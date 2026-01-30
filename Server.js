const express = require('express');
const app = express();
const PORT = 7357;

// Servir les fichiers statiques du dossier public
app.use(express.static('public'));

// Une route simple '/'
app.get('/', (req, res) => {
  res.send('Oops! File not found or failed to load');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});