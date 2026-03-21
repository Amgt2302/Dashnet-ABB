const express = require("express");
const app = express();
const ping = require("ping");
const dns = require("dns").promises;
const { exec } = require("child_process");
const config = require("./config.json");

const { initDB, updateDevice } = require("./data/DB");
initDB();

const PORT = config.PORT;
const IP_PREFIX = config.IP_PREFIX;
const SUBNET_START = config.SUBNET_START;
const SUBNET_END = config.SUBNET_END;
const SCAN_INTERVAL = config.SCAN_INTERVAL;

let lastScan = [];


// --- FUNCTIONS --- \\

const ipToNum = ip => {return ip.split('.').map(Number).reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;};

// 1. Generate target IP list
function generateTargetIPs() {
    const ips = [];
    for (let i = SUBNET_START; i <= SUBNET_END; i++) {
        for (let j = 1; j < 255; j++) {
            ips.push(`${IP_PREFIX}.${i}.${j}`);
        }
    }
    return ips;
}

// 1.1 Get Mac Address
function getMac(ip) {
    return new Promise(resolve => {
        const cmd = process.platform === 'win32' 
            ? `arp -a ${ip}` 
            : `ip neigh show to ${ip}`;

        exec(cmd, (err, stdout) => {
            if (!stdout) return resolve("Err");

            const words = stdout.trim().split(/\s+/);
            const foundMac = words.find(word => {
                const sep = word.includes(':') ? ':' : '-';
                return word.split(sep).length === 6 && word.length >= 11;
            });

            resolve(foundMac ? foundMac.toUpperCase() : "**");
        });
    });
}

// 1.2 Get Hostname (lookupService)
async function getName(ip) {
    try {
        const result = await dns.lookupService(ip, 0);
        return result.hostname;
    } catch (err) {
        return "Unknow";
    }
}


// 2. Scan engine
async function scanNetwork(concurrency = 100, timeoutSec = 1) {
    const ips = generateTargetIPs();
    const startCheck = Date.now();
    const results = [];
    let idx = 0;

    // Worker: picks an IP from the list until empty
    async function worker() {
        while (idx < ips.length) {
            const currentIp = ips[idx++];

            try {
                const res = await ping.promise.probe(currentIp, { timeout: timeoutSec, min_reply: 1 });
                const mac = res.alive ? await getMac(currentIp) : "-";
                const DNSname = res.alive ? await getName(currentIp) : "Unknown";

                results.push({
                    timestamp: new Date(),
                    name:DNSname,
                    ip: currentIp,
                    status: res.alive ? 'online' : 'offline',
                    latency: res.alive ? res.time + ' ms' : '- ms',
                    mac:mac
                });

            } catch (err) {
                // Fail-safe: mark as offline on internal error
                results.push({
                    ip: currentIp,
                    latency: 'Err'
                });
            }
        }
    }
    
    // Launch workers
    await Promise.all(
        Array.from({ length: Math.min(concurrency, ips.length) }, () => worker())
    );

    // Sort IP list
    results.sort((a, b) => ipToNum(a.ip) - ipToNum(b.ip));

    const duration = ((Date.now() - startCheck) / 1000).toFixed(2);
    //console.log(`✅ Scan finished in ${duration}s. Devices found: ${results.length}`);

    lastScan = results;
    results.forEach(device => updateDevice(device));
    return results;
}


// 3. Auto-refresh loop
async function startScanLoop() {
    while (true) {
        await scanNetwork();

        // Wait before next cycle
        await new Promise(resolve => setTimeout(resolve, SCAN_INTERVAL));
    }
}

startScanLoop();



// --- API ROUTES --- \\

app.get('/api/scan', async (req, res) => {
    return res.json(lastScan);
});

app.use(express.static("public"));
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});