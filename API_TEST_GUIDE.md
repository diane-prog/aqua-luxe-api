# Guide de test API - PoolBk

> Base URL : `http://localhost:3000/api/v1`
> Swagger : `http://localhost:3000/swagger`

---

## 1. Authentification

### 1.1 Register (créer un compte)

```
POST /auth/register
Body: { "email": "user@poolbk.com", "password": "User@123", "fullName": "Jean Dupont" }
```

→ Retourne `"Account created successfully. Please login."`

### 1.2 Login (vérifier les identifiants)

```
POST /auth/login
Body: { "email": "user@poolbk.com", "password": "User@123" }
```

→ Retourne `"Credentials verified. Please request a verification code."` + l'email.
→ Ne retourne PAS encore le token. Étape suivante : demander le code OTP.

### 1.3 Send OTP (demander le code de vérification)

```
POST /auth/send-otp
Body: { "email": "user@poolbk.com" }
```

→ Envoie un code à 6 chiffres par email. Retourne `"Verification code sent to user@poolbk.com"`.

### 1.4 Verify OTP (entrer le code → obtenir le token)

```
POST /auth/verify-otp
Body: { "email": "user@poolbk.com", "code": "123456" }
```

→ Si le code est valide : retourne `{ user, accessToken, refreshToken }`.
→ Copier le `accessToken` → l'utiliser dans le header `Authorization: Bearer <token>` pour les routes admin.

### 1.5 Refresh Token

```
POST /auth/refresh
Body: { "refreshToken": "<refreshToken copié ci-dessus>" }
```

→ Retourne un nouveau `accessToken` + `refreshToken`. Remplacer les tokens en cours.

### 1.6 Vérifier le profil

```
GET /auth/me
Header: Authorization: Bearer <token>
```

→ Retourne les infos de l'utilisateur connecté.

### 1.7 Mot de passe oublié

```
POST /auth/forgot-password
Body: { "email": "admin@poolbk.com" }
```

→ Envoie un email de reset (si mail configuré). Retourne toujours un message de succès.

### 1.5 Déconnexion

```
POST /auth/logout
Header: Authorization: Bearer <token>
```

→ Invalide le refresh token. Il faudra se reconnecter après.

---

## 2. Contenu vitrine (Public - pas de token nécessaire)

### 2.1 Services

```
GET /services                           → Liste des services actifs
GET /services/slug/pool-construction    → Détail par slug
```

### 2.2 Packages (Forfaits)

```
GET /packages                           → Liste des packages actifs
```

### 2.3 Projets (Portfolio)

```
GET /projects                           → Liste des projets publiés
GET /projects/slug/<slug>               → Détail par slug
```

### 2.4 Catégories de projets

```
GET /project-categories                 → Liste des catégories
```

### 2.5 Témoignages

```
GET /testimonials                       → Tous les témoignages actifs
GET /testimonials/featured              → Uniquement les mis en avant
```

### 2.6 FAQ

```
GET /faq                                → Toutes les questions/réponses actives
```

### 2.7 Blog

```
GET /blog                               → Articles publiés
GET /blog/slug/<slug>                   → Détail par slug
```

### 2.8 Catégories blog

```
GET /blog-categories                    → Liste des catégories
```

### 2.9 Équipe

```
GET /team                               → Membres actifs
```

### 2.10 Process Steps

```
GET /process-steps                      → Les étapes du processus
```

### 2.11 Why Choose Us

```
GET /why-choose-us                      → Les points forts
```

### 2.12 Pages statiques

```
GET /pages/slug/about                   → Page "About Us"
GET /pages/slug/terms                   → Page "Terms & Conditions"
GET /pages/slug/privacy                 → Page "Privacy Policy"
```

### 2.13 Settings

```
GET /settings                           → Réglages du site (singleton)
```

---

## 3. Administration CRUD

> Toutes les routes admin nécessitent le header `Authorization: Bearer <token>`.

### 3.1 Services

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/services/admin` | Créer un service |
| `GET` | `/services/admin/all` | Lister tous (soft-delete inclus) |
| `GET` | `/services/admin/:id` | Détail par ID |
| `PUT` | `/services/admin/:id` | Modifier |
| `DELETE` | `/services/admin/:id` | Supprimer (soft-delete) |

**Body création :**
```json
{
  "title": "Pool Construction",
  "slug": "pool-construction",
  "shortDescription": "Construction de piscines sur mesure",
  "description": "Nous construisons des piscines de qualité supérieure...",
  "icon": "pool",
  "category": "construction",
  "features": ["Design personnalisé", "Matériaux premium", "Garantie 10 ans"],
  "order": 1,
  "isActive": true
}
```

**Valeurs de `category` :** `construction`, `renovation`, `maintenance`, `water_care`, `pool_upgrade`, `inspection`

---

### 3.2 Packages (Forfaits)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/packages/admin` | Créer |
| `GET` | `/packages/admin/all` | Lister tous |
| `GET` | `/packages/admin/:id` | Détail |
| `PUT` | `/packages/admin/:id` | Modifier |
| `DELETE` | `/packages/admin/:id` | Supprimer |

**Body création :**
```json
{
  "name": "Basic Pool Care",
  "price": 99.99,
  "period": "monthly",
  "features": ["Nettoyage hebdomadaire", "Contrôle chimique", "Rapport mensuel"],
  "isHighlighted": false,
  "order": 1,
  "isActive": true
}
```

**Valeurs de `period` :** `monthly`, `yearly`

---

### 3.3 Catégories de projets

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/project-categories/admin` | Créer |
| `GET` | `/project-categories` | Lister (public) |
| `PUT` | `/project-categories/admin/:id` | Modifier |
| `DELETE` | `/project-categories/admin/:id` | Supprimer |

**Body :**
```json
{ "name": "Residential", "slug": "residential", "order": 1 }
```

---

### 3.4 Projets (Portfolio)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/projects/admin` | Créer |
| `GET` | `/projects/admin/all` | Lister tous |
| `GET` | `/projects/admin/:id` | Détail |
| `PUT` | `/projects/admin/:id` | Modifier |
| `DELETE` | `/projects/admin/:id` | Supprimer (+ images Cloudinary) |

**Body création :**
```json
{
  "title": "Villa Miami Pool",
  "slug": "villa-miami-pool",
  "location": "Miami, FL",
  "description": "Piscine Infinity pour villa de luxe",
  "completionDays": 45,
  "clientId": "John Smith",
  "status": "published",
  "categoryId": "<id de la catégorie>"
}
```

**Valeurs de `status` :** `draft`, `published`

> Pour ajouter des images, utiliser `POST /projects/admin/:id/images` (multipart/form-data, champ `files`).
> Pour les images avant/après : `POST /projects/admin/:id/before-after` (champ `files`, max 2 fichiers).

---

### 3.5 Témoignages

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/testimonials/admin` | Créer |
| `GET` | `/testimonials/admin/all` | Lister tous |
| `PUT` | `/testimonials/admin/:id` | Modifier |
| `DELETE` | `/testimonials/admin/:id` | Supprimer |

**Body :**
```json
{
  "authorName": "Marie Dupont",
  "rating": 5,
  "content": "Excellent travail, piscine terminée en 3 semaines !",
  "projectRef": "Villa Miami Pool",
  "isFeatured": true,
  "isActive": true,
  "order": 1
}
```

---

### 3.6 FAQ

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/faq/admin` | Créer |
| `GET` | `/faq/admin/all` | Lister tous |
| `PUT` | `/faq/admin/:id` | Modifier |
| `DELETE` | `/faq/admin/:id` | Supprimer |

**Body :**
```json
{
  "question": "Combien de temps prend la construction d'une piscine ?",
  "answer": "En moyenne 4 à 8 semaines selon la complexité du projet.",
  "category": "construction",
  "order": 1,
  "isActive": true
}
```

---

### 3.7 Catégories blog

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/blog-categories/admin` | Créer |
| `GET` | `/blog-categories` | Lister (public) |
| `PUT` | `/blog-categories/admin/:id` | Modifier |
| `DELETE` | `/blog-categories/admin/:id` | Supprimer |

**Body :**
```json
{ "name": "Pool Tips", "slug": "pool-tips", "description": "Conseils d'entretien", "order": 1 }
```

---

### 3.8 Blog (Articles)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/blog/admin` | Créer |
| `GET` | `/blog/admin/all` | Lister tous |
| `GET` | `/blog/admin/:id` | Détail |
| `PUT` | `/blog/admin/:id` | Modifier |
| `DELETE` | `/blog/admin/:id` | Supprimer |

**Body :**
```json
{
  "title": "5 conseils pour entretenir votre piscine",
  "slug": "5-conseils-entretien-piscine",
  "excerpt": "Découvrez nos astuces...",
  "content": "<h1>5 conseils</h1><p>Contenu en HTML ou Markdown...</p>",
  "categoryId": "<id>",
  "tags": ["entretien", "conseils", "piscine"],
  "status": "published",
  "readingTime": 5,
  "seoTitle": "5 conseils entretien piscine | Pooluxe",
  "seoDescription": "Guide complet d'entretien de piscine"
}
```

> Quand `status` passe à `published`, `publishedAt` est automatiquement défini.

---

### 3.9 Pages statiques

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/pages/admin` | Créer |
| `GET` | `/pages/admin` | Lister |
| `GET` | `/pages/admin/:id` | Détail |
| `PUT` | `/pages/admin/:id` | Modifier |
| `DELETE` | `/pages/admin/:id` | Supprimer |
| `GET` | `/pages/slug/<slug>` | Public par slug |

**Body :**
```json
{
  "title": "About Us",
  "slug": "about",
  "content": "<h1>À propos de Pooluxe</h1><p>Nous sommes experts en construction de piscines depuis 2005.</p>",
  "seoTitle": "À propos | Pooluxe",
  "seoDescription": "Découvrez Pooluxe, spécialiste en piscines"
}
```

---

### 3.10 Équipe

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/team/admin` | Créer |
| `GET` | `/team/admin/all` | Lister |
| `PUT` | `/team/admin/:id` | Modifier |
| `DELETE` | `/team/admin/:id` | Supprimer |

**Body :**
```json
{
  "fullName": "Pierre Martin",
  "role": "Chef de chantier",
  "bio": "15 ans d'expérience dans la construction de piscines",
  "isActive": true,
  "order": 1
}
```

---

### 3.11 Process Steps

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/process-steps/admin` | Créer |
| `GET` | `/process-steps/admin/all` | Lister |
| `PUT` | `/process-steps/admin/:id` | Modifier |
| `DELETE` | `/process-steps/admin/:id` | Supprimer |

**Body :**
```json
{
  "stepNumber": 1,
  "title": "Consultation gratuite",
  "description": "Nous étudions votre projet et votre terrain",
  "icon": "clipboard-list",
  "order": 1,
  "isActive": true
}
```

---

### 3.12 Why Choose Us

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/why-choose-us/admin` | Créer |
| `GET` | `/why-choose-us/admin/all` | Lister |
| `PUT` | `/why-choose-us/admin/:id` | Modifier |
| `DELETE` | `/why-choose-us/admin/:id` | Supprimer |

**Body :**
```json
{
  "icon": "shield-check",
  "title": "Licencié et assuré",
  "description": "Entreprise certifiée avec assurance décennale",
  "isActive": true,
  "order": 1
}
```

---

### 3.13 Settings (Réglages globaux)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/settings` | Lire (public) |
| `PUT` | `/settings` | Modifier (admin) |

**Body :**
```json
{
  "companyName": "Pooluxe",
  "phone": "+1-555-POOL",
  "email": "info@pooluxe.com",
  "address": "123 Pool Lane, Miami FL 33101",
  "businessHours": "Lun-Ven 8h-18h, Sam 9h-13h",
  "socialLinks": [
    { "platform": "facebook", "url": "https://facebook.com/pooluxe" },
    { "platform": "instagram", "url": "https://instagram.com/pooluxe" },
    { "platform": "youtube", "url": "https://youtube.com/pooluxe" }
  ],
  "footerText": "© 2026 Pooluxe. Tous droits réservés.",
  "metaTitle": "Pooluxe - Construction et entretien de piscines",
  "metaDescription": "Pooluxe, votre expert en construction, rénovation et entretien de piscines"
}
```

---

## 4. Leads (Formulaires publics)

### 4.1 Formulaire Contact

```
POST /contact-messages
Body: {
  "fullName": "Jean Dupont",
  "email": "jean@exemple.com",
  "phone": "+33 6 12 34 56 78",
  "subject": "Demande de devis piscine",
  "message": "Je souhaite construire une piscine dans mon jardin de 200m²"
}
```

→ Crée le message, envoie un email de confirmation, notifie le dashboard admin via WebSocket.

**Gestion admin :**

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/contact-messages/admin` | Lister tous |
| `GET` | `/contact-messages/admin/unread-count` | Nombre de non-lus |
| `GET` | `/contact-messages/admin/:id` | Détail |
| `PUT` | `/contact-messages/admin/:id/status` | Changer le statut |
| `DELETE` | `/contact-messages/admin/:id` | Supprimer |

**Valeurs de `status` :** `new`, `read`, `replied`, `archived`

---

### 4.2 Demande de devis

```
POST /quote-requests
Body: {
  "fullName": "Sophie Martin",
  "email": "sophie@exemple.com",
  "phone": "+33 6 98 76 54 32",
  "serviceTypeId": "<id du service>",
  "address": "456 Avenue des Pins, Nice",
  "description": "Piscine rectangulaire 10x5m avec Jacuzzi intégré",
  "budgetRange": "25000-35000",
  "preferredDate": "2026-06-01"
}
```

**Gestion admin :**

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/quote-requests/admin` | Lister tous |
| `GET` | `/quote-requests/admin/pending-count` | Nombre en attente |
| `GET` | `/quote-requests/admin/:id` | Détail |
| `PUT` | `/quote-requests/admin/:id/status` | Changer le statut |
| `DELETE` | `/quote-requests/admin/:id` | Supprimer |

**Body changement de statut :**
```json
{
  "status": "contacted",
  "notes": "Appel prévu lundi",
  "estimatedPrice": 32000
}
```

**Valeurs de `status` :** `new`, `contacted`, `quoted`, `converted`, `rejected`

---

### 4.3 Newsletter

```
POST /newsletter/subscribe
Body: { "email": "abonne@exemple.com" }
```

```
POST /newsletter/unsubscribe/abonne@exemple.com
```

**Gestion admin :**

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/newsletter/admin` | Lister |
| `GET` | `/newsletter/admin/active-count` | Nombre d'abonnés actifs |

---

## 5. Dashboard

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/admin/dashboard/stats` | Statistiques globales |
| `GET` | `/admin/dashboard/quotes-by-month` | Devis par mois |
| `GET` | `/admin/dashboard/top-services` | Services les plus demandés |
| `GET` | `/admin/dashboard/recent-quotes` | 5 derniers devis |
| `GET` | `/admin/dashboard/recent-messages` | 5 derniers messages |

---

## 6. Gestion des rôles et permissions

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/admin/roles` | Lister les rôles |
| `GET` | `/admin/permissions` | Lister les permissions |
| `GET` | `/admin/users` | Lister les utilisateurs |
| `POST` | `/admin/users` | Créer un utilisateur |
| `PUT` | `/admin/users/:id` | Modifier |

**Valeurs de `role.name` :** `super_admin`, `admin`, `editor`

---

## 7. Swagger UI

1. Ouvrir `http://localhost:3000/swagger`
2. Cliquer sur le bouton **Authorize** (🔒) en haut à droite
3. Entrer le token : `eyJhbGci...` (le `accessToken` du login)
4. Tester les routes admin → elles fonctionnent directement dans Swagger
5. Les routes publiques n'ont pas besoin de token

---

## Ordre de test recommandé

1. **Register** → créer un compte
2. **Login** → vérifier email/mot de passe
3. **Send OTP** → recevoir le code par email
4. **Verify OTP** → entrer le code → obtenir le token
5. **Settings** → configurer l'entreprise
6. **Project Categories** → créer des catégories
7. **Services** → créer les prestations
8. **Packages** → créer les forfaits
9. **Blog Categories** → créer les catégories blog
10. **Blog** → créer des articles
11. **Pages** → créer About, Terms, Privacy
12. **Team** → ajouter l'équipe
13. **Process Steps** → décrire les étapes
14. **Why Choose Us** → les points forts
15. **FAQ** → les questions fréquentes
16. **Projects** → créer le portfolio
17. **Testimonials** → ajouter les avis
18. **Contact / Quote** → tester les formulaires publics
19. **Dashboard** → vérifier les stats
