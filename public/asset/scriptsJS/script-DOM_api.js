const dashboard = document.getElementById('dashboard');
const filterStatus = document.getElementById('filterStatus');
const onlineCountBox = document.getElementById('onlineCount');

// Basic HTML injection detection
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Update Ui, refresh
async function updateDashboard() {
  try {
    const scanRes = await fetch("/api/scan");
    const devices = await scanRes.json();

    //online devices display
    const onlineCount = devices.filter(dev => dev.status === "online").length;
    onlineCountBox.textContent = `Online: ${onlineCount}`;

    if (devices.length === 0) return;
    const currentFilter = filterStatus.value;

    // Card generation
    dashboard.innerHTML = '';

    devices.forEach(dev => {
      if (currentFilter === 'all' || dev.status === currentFilter) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${escapeHTML(dev.name)}</h3>
          <p><strong>IP :</strong> ${escapeHTML(dev.ip)}</p>
          <p><strong>Latence :</strong> ${escapeHTML(dev.latency)}</p>
          <p><strong>MAC :</strong> ${escapeHTML(dev.mac)}</p>
          <span class="status ${escapeHTML(dev.status)}">
            ${dev.status === 'online' ? "Online" : "Offline"}
          </span>
        `;
        dashboard.appendChild(card);
      }
    });
  }
  catch (error) {console.error("Erreur lors du scan :", error);} 
  finally {setTimeout(updateDashboard, 5000);}
}

filterStatus.addEventListener('change', () => {updateDashboard();});

updateDashboard();