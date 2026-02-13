const express = require("express");
const app = express();
const ping = require("ping");

const PORT = 7357;
const IP_PREFIX = "172.16";
const SUBNET_START = 0;
const SUBNET_END = 2;
const SCAN_INTERVAL = 10000;

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

                results.push({
                    timestamp: new Date(),
                    ip: currentIp,
                    status: res.alive ? 'online' : 'offline',
                    latency: res.alive ? res.time + 'ms' : '-'
                });

            } catch (err) {
                // Fail-safe: mark as offline on internal error
                results.push({
                    ip: currentIp,
                    status: 'offline',
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