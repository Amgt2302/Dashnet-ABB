# DashNet – ABB

> Dashboard de supervision réseau en temps réel, développé en interne pour ABB.

---

## Présentation

DashNet détecte automatiquement les machines connectées au réseau local et affiche pour chacune :

- Le nom (FQDN)
- L'adresse IP
- L'adresse MAC
- La latence
- L'état : **En ligne** / **Hors ligne**

L'interface se rafraîchit automatiquement toutes les 5 secondes, sans rechargement de page.

---

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | Node.js + Express |
| Frontend | HTML5 / CSS3 / JavaScript natif |
| Scan réseau | ICMP (ping) + ARP |
| Résolution de noms | DNS / LLMNR / mDNS / NetBIOS |
| Base de données | SQLite *(en cours d'intégration)* |
| Environnement | Debian + Docker |

---

## Documentation

| Document | Description |
|---|---|
| [README-Local.md](docs/README-Local.md) | Prérequis, configuration et lancement en local |
| [README-Docker.md](docs/README-Docker.md) | Lancement et arrêt via Docker |
| [README-Maintenance.md](docs/README-Maintenance.md) | Mise à jour des dépendances npm |

---

## Dépôt

[github.com/Amgt2302/Dashnet-ABB](https://github.com/Amgt2302/Dashnet-ABB)

---
*DashNet – Anthony Mignot · BTS CIEL 2026 · ABB*