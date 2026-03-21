
# 🐳 DashNet – Lancement via Docker

> Déploiement conteneurisé de DashNet


## Prérequis

- [Docker](https://www.docker.com/) installé sur la machine

Sous Debian :

```bash
sudo apt install docker.io
```

---
---
---

## 🚀 Lancer le projet

**1. Se placer dans le dossier du projet**

```bash
cd /Documents/Dashnet-ABB
```

**2. Build l'image Docker**

```bash
docker build -t dashnet .
```

> Remplacer `dashnet` si besoin.

**3. Lancer le conteneur**

```bash
docker run --network host dashnet
```

> Le port **7357** est défini dans `config.json`.

**4. Accéder à l'interface**

Ouvrir le navigateur et se rendre sur :

[localhost:7357](http://localhost:7357)

---
---
---

## 🛑 Arrêter le projet

**1. Trouver l'ID du conteneur en cours**

```bash
docker ps
```

**2. Stopper le conteneur**

```bash
docker stop <ID_CONTAINER>
```

> Exemple : `docker stop a3f2c1b9e4d7`

---
---
*DashNet – Anthony Mignot · ABB*
