const express = require('express');
const app = express();
const PORT = 3333;

// Une route simple '/'
app.get('/', (req, res) => {
  res.send('HELLO World from Express !');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});