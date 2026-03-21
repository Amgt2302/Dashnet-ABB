# 💻 DashNet – Lancement en local

> Prérequis, configuration et lancement de DashNet sans Docker

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) *(inclus avec Node.js)*

Vérifier les versions installées :

```bash
node -v
npm -v
```

---

## ⚙️ Configuration

Avant de lancer le projet, éditer `config.json` à la racine :

```json
{
  "PORT": 7357,
  "IP_PREFIX": "192.168",
  "SUBNET_START": 1,
  "SUBNET_END": 1,
  "SCAN_INTERVAL": 10000
}
```

| Paramètre | Description |
|---|---|
| `PORT` | Port d'écoute du serveur |
| `IP_PREFIX` | Préfixe de la plage IP à scanner (ex. `192.168`) |
| `SUBNET_START` | Premier sous-réseau scanné (ex. `1` → `192.168.1.x`) |
| `SUBNET_END` | Dernier sous-réseau scanné |
| `SCAN_INTERVAL` | Intervalle entre deux scans en millisecondes (ex. `10000` = 10s) |

> ⚠️ Adapter `IP_PREFIX`, `SUBNET_START` et `SUBNET_END` à ton réseau avant de lancer.

---

## 🚀 Lancer le projet

**1. Se placer dans le dossier du projet**

```bash
cd /Documents/Dashnet-ABB
```

**2. Installer les dépendances**

```bash
npm install
```

**3. Démarrer le serveur**

```bash
npm start
```

**4. Accéder à l'interface**

Ouvrir le navigateur et se rendre sur :

[localhost:7357](http://localhost:7357)

---

## 🛑 Arrêter le projet

Dans le terminal où tourne le serveur :

```
Ctrl + C
```

---

## 📦 Dépendances

| Package | Rôle |
|---|---|
| `express` | Serveur HTTP + API REST |
| `ping` | Sonde ICMP pour tester la disponibilité des machines |
| `sqlite3` | Base de données locale |
```bash
npm update
```

> Pour la maintenance des dépendances → [README-Maintenance.md](README-Maintenance.md)

---
---
*DashNet – Anthony Mignot · BTS CIEL 2026 · ABB*