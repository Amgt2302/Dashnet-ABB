# 🔧 DashNet – Maintenance des dépendances

> Mise à jour et vérification des librairies npm

---

## Vérifier les dépendances installées

```bash
npm list
```

---

## Vérifier les mises à jour disponibles

```bash
npm outdated
```

| Colonne | Description |
|---|---|
| `Current` | Version actuellement installée |
| `Wanted` | Version compatible selon `package.json` |
| `Latest` | Dernière version disponible sur npm |

---

## Mettre à jour les dépendances

**Mise à jour mineure / patch** *(safe)*

```bash
npm update
```

**Mise à jour vers la dernière version**

```bash
npm install express@latest
npm install ping@latest
npm install sqlite3@latest
```

---

## Réinstaller proprement

```bash
rm -rf node_modules
npm install
```

---

## Vérifier les failles de sécurité

```bash
npm audit
```

Corriger automatiquement :

```bash
npm audit fix
```

> ⚠️ `npm audit fix --force` peut introduire des changements majeurs — à utiliser avec précaution.

---

## Dépendances du projet

| Package | Version | Rôle |
|---|---|---|
| `express` | ^5.2.1 | Serveur HTTP + API REST |
| `ping` | ^1.0.0 | Sonde ICMP pour tester la disponibilité des machines |
| `sqlite3` | ^5.1.7 | Base de données locale |

---
---
*DashNet – Anthony Mignot · BTS CIEL 2026 · ABB*