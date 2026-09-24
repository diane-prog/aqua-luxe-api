# Aqua Luxe API

## Overview

**Aqua Luxe** (anciennement "PoolBk") est une API REST backend pour une entreprise spécialisée dans la **construction, rénovation et maintenance de piscines**. C'est le moteur backend qui alimente le site vitrine et le tableau de bord administrateur de l'entreprise.

---

## De quoi parle ce projet ?

Ce projet est le **backend complet** d'un site web pour une entreprise de piscines. Il permet :

- Aux **visiteurs** de parcourir les services, projets, blog et témoignages
- Aux **clients potentiels** de demander des devis et d'envoyer des messages de contact
- Aux **administrateurs** de gérer tout le contenu du site (services, projets, blog, équipe, etc.)
- Aux **marketers** de consulter les statistiques de leads et d'abonnements newsletter

---

## Quel problème résout-il ?

### Pour l'entreprise (Aqua Luxe)

L'entreprise avait besoin d'un **système centralisé** pour :

| Problème | Solution |
|----------|----------|
| Gérer le contenu du site sans code | Modules CRUD pour services, projets, blog, FAQ, témoignages, équipe |
| Collecter des leads | Formulaires de devis et de contact avec stockage en base de données |
| Suivre les performances | Dashboard avec statistiques (devis/mois, services populaires, messages récents) |
| Informer les clients | Système de newsletter et FAQ |
| Gérer les accès | Système RBAC avec 3 rôles (super_admin, admin, editor) et 13 permissions |

### Pour les développeurs

| Problème | Solution |
|----------|----------|
| Documentation API | Swagger auto-généré à `/docs` |
| Authentification sécurisée | JWT + OTP (code par email) |
| Déploiement Docker | Dockerfile prêt pour Coolify / DigitalOcean / Railway |
| Base de données | PostgreSQL avec synchronisation automatique des tables |

---

## Stack technique

| Composant | Technologie |
|-----------|------------|
| Framework | **NestJS 11** (Node.js / TypeScript) |
| Base de données | **PostgreSQL** via **TypeORM** |
| Authentification | **JWT** (access + refresh tokens) + **OTP** par email |
| Documentation | **Swagger** (OpenAPI) |
| Upload fichiers | **Cloudinary** |
| Envoi emails | **Nodemailer** (SMTP Gmail) |
| Logging | **Winston** |
| Sécurité | **Helmet** (headers HTTP), **bcrypt** (mots de passe) |
| WebSockets | **Socket.IO** |
| Conteneurisation | **Docker** |

---

## Architecture fonctionnelle

### 22 modules backend

```
├── 🔐 Auth                → Inscription, connexion, OTP, mot de passe oublié
├── 👥 Users               → Gestion des utilisateurs
├── 🎭 Roles               → super_admin, admin, editor
├── 🔑 Permissions         → 13 permissions granulaires
├── 🏊 Services            → Services proposés (construction, rénovation, maintenance)
├── 📦 Packages            → Forfaits tarifaires
├── 🏗️ Projects            → Portfolio des réalisations
├── 📂 Project Categories  → Catégories de projets
├── ⭐ Testimonials        → Témoignages clients
├── 👨‍💼 Team                → Membres de l'équipe
├── 📋 Process Steps        → Étapes du processus de travail
├── ❓ Why Choose Us        → Arguments de vente
├── ❔ FAQ                 → Questions fréquentes
├── 📝 Blog                → Articles de blog
├── 📁 Blog Categories     → Catégories du blog
├── 📄 Pages               → Pages statiques
├── 📩 Contact Messages    → Messages du formulaire de contact
├── 📊 Quote Requests      → Demandes de devis
├── 📧 Newsletter          → Abonnements / désabonnements
├── ⚙️ Settings           → Paramètres globaux du site
├── 📈 Dashboard          → Statistiques admin
└── ❤️ Health              → Santé de l'API
```

### Rôles et permissions

| Rôle | Permissions |
|------|-------------|
| **super_admin** | Toutes les 13 permissions |
| **admin** | Toutes sauf gestion des utilisateurs et rôles |
| **editor** | Gérer le blog, les projets, voir le dashboard |

### Flux d'authentification

```
1. POST /auth/login        → Valide email + mot de passe
2. POST /auth/send-otp     → Envoie un code OTP par email
3. POST /auth/verify-otp   → Vérifie le code OTP → Retourne JWT
4. Le token JWT est utilisé dans le header Authorization: Bearer <token>
```

### Comptes par défaut

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@poolbk.com | Admin@123 | super_admin |

---

## Structure des endpoints

### Résumé

| Type | Nombre |
|------|--------|
| Endpoints publics | ~27 |
| Endpoints protégés (JWT) | ~95 |
| **Total** | **~122** |

### Exemples d'endpoints publics

```
GET /api/v1/services          → Liste des services
GET /api/v1/projects         → Liste des projets
GET /api/v1/blog             → Articles publiés
GET /api/v1/testimonials      → Témoignages clients
GET /api/v1/faq               → FAQ
GET /api/v1/settings          → Paramètres du site
POST /api/v1/quote-requests   → Soumettre une demande de devis
POST /api/v1/contact-messages → Envoyer un message
POST /api/v1/newsletter/subscribe → S'abonner à la newsletter
```

### Exemples d'endpoints protégés

```
GET  /api/v1/admin/users           → Liste utilisateurs (super_admin)
POST /api/v1/services/admin        → Créer un service (admin/editor)
PUT  /api/v1/projects/admin/:id    → Modifier un projet (admin/editor)
GET  /api/v1/admin/dashboard/stats → Statistiques (admin/editor)
```

---

## Installation locale

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- pnpm

### Étapes

```bash
# 1. Cloner le projet
git clone <repo-url>
cd aqua-luxe-api

# 2. Installer les dépendances
pnpm install

# 3. Créer la base de données PostgreSQL
psql -U postgres -c "CREATE DATABASE poolbk;"

# 4. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (DB, Cloudinary, Gmail...)

# 5. Démarrer en développement
pnpm run start:dev
```

### Démarrage automatique

Au premier lancement, le **Seeder** crée automatiquement :
- Les 13 permissions
- Les 3 rôles avec leurs permissions
- Le compte admin par défaut (`admin@poolbk.com` / `Admin@123`)

---

## Déploiement Docker

### Build manuel

```bash
docker build -t aqua-luxe-api .
docker run -p 3000:3000 --env-file .env aqua-luxe-api
```

### Variables d'environnement requises

```env
PORT=3000
NODE_ENV=production

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=poolbk
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=votre_refresh_secret

# Cloudinary (upload d'images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email (SMTP Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre_email@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_FROM=noreply@votredomaine.com

# Divers
ENABLE_SWAGGER=true
CORS_ORIGINS=*
```

---

## Documentation API

Une fois le serveur démarré :

- **Swagger UI** : http://localhost:3000/docs
- **Santé API** : http://localhost:3000/health

---

## Pour qui est ce projet ?

### Ideal pour :

- 🏊 Entreprises de construction/rénovation de piscines
- 🏠 Sites vitrine avec back-office complet
- 📱 Apps mobiles nécessitant une API backend
- 🚀 Startups ayant besoin d'un MVP rapide avec auth, RBAC et CMS

### Non recommandé pour :

- Sites e-commerce (pas de module paiement)
- Applications temps réel complexes (WebSockets basiques uniquement)
- Projets sans base de données relationnelle

---

## Licence

Projet privé - Tous droits réservés
