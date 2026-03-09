const dashboard = document.getElementById('dashboard');
const filterStatus = document.getElementById('filterStatus');
const onlineCountBox = document.getElementById('onlineCount');

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
          <h3>${dev.name}</h3>
          <p><strong>IP :</strong> ${dev.ip}</p>
          <p><strong>Latence :</strong> ${dev.latency}</p>
          <p><strong>MAC :</strong> ${dev.mac}</p>
          <span class="status ${dev.status}">
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