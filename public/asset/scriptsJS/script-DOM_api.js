const dashboard = document.getElementById('dashboard');

async function updateDashboard() {
  try {
    const scanRes = await fetch("/api/scan");
    const devices = await scanRes.json();

    if (devices.length === 0) return;

    // Card generation
    dashboard.innerHTML = '';

    devices.forEach(dev => {
      const card = document.createElement("div");

      card.className = "card";
      card.innerHTML = `
        <h3>Unknown</h3>
        <p><strong>IP :</strong> ${dev.ip}</p>
        <p><strong>Latence :</strong> ${dev.latency}</p>
        <p><strong>MAC :</strong> xx:xx:xx:xx:xx</p>
        <span class="status ${dev.status}">
          ${dev.status === 'online' ? "Online" : "Offline"}
        </span>
      `;

      dashboard.appendChild(card);
    });
  }
  catch (error) {console.error("Erreur lors du scan :", error);} 
  finally {setTimeout(updateDashboard, 5000);}
}

updateDashboard();