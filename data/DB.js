const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

const DB_PATH = path.resolve(__dirname, "DashNet_DB.db");
const db      = new sqlite3.Database(DB_PATH);

// --- INIT --- \\
function initDB() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS devices (
                ip          TEXT PRIMARY KEY,
                mac         TEXT,
                hostname    TEXT,
                alive       INTEGER DEFAULT 0,
                latency_ms  REAL,
                last_seen   DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });
    console.log("🗄️  Database ready");
}

// --- WRITE --- \\
function updateDevice(device) {
    if (!device.ip) return;

    const sql = `
        INSERT INTO devices (ip, mac, hostname, alive, latency_ms, last_seen)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(ip) DO UPDATE SET
            mac        = COALESCE(excluded.mac, devices.mac),
            hostname   = COALESCE(excluded.hostname, devices.hostname),
            alive      = excluded.alive,
            latency_ms = excluded.latency_ms,
            last_seen  = CURRENT_TIMESTAMP
    `;

    db.run(sql, [
        device.ip,
        device.mac  || null,
        device.name || null,
        device.status === 'online' ? 1 : 0,
        parseFloat(device.latency?.replace(' ms', '')) || null
    ], (err) => {
        if (err) console.error("DB error:", err.message);
    });
}

// --- READ --- \\
function getAllDevices() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM devices ORDER BY last_seen DESC", [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// --- CLOSE --- \\
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

module.exports = { initDB, updateDevice, getAllDevices };