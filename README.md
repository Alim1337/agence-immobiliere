# Maison & Fils — Agence immobilière

Site vitrine + back-office CRM pour une agence immobilière, en Next.js 15/16 (App Router) + TypeScript + Tailwind v4 + Prisma 6 + Neon.

## État actuel

Fait — **tout est maintenant branché sur la vraie base de données (Neon/Postgres via Prisma)** :
- Site public : accueil, liste des biens + filtres, fiche bien, programme neuf, agence — lisent les vraies données (`published: true` uniquement)
- Estimation, mentions légales : statiques
- **Le blog est maintenant en base** (modèle `Article`), plus en mock-data,
  avec un **CRUD admin complet** dans `/admin/articles` : liste, création,
  édition, toggle publication, suppression.
- Auth.js (NextAuth v5) vérifie email/mot de passe contre la table `User` (bcrypt)
- `src/proxy.ts` protège `/admin/*` (remplace `middleware.ts`, renommé en Next.js 16)
- Back-office CRM entièrement branché sur Prisma :
  - Dashboard (KPIs calculés en base)
  - Pipeline Kanban drag & drop → persiste via server actions (`src/app/actions/leads.ts`)
  - Fiche lead avec historique d'interactions → ajout persisté en base
  - Gestion des biens : toggle publication persisté, formulaire d'ajout fonctionnel (crée un bien non publié)
  - Agenda des rendez-vous
- **Les formulaires publics créent de vrais leads** : le formulaire de
  contact sur une fiche bien et le formulaire d'estimation créent chacun
  un `Lead` en base (file d'attente, `stage: NOUVEAU`), visible
  immédiatement dans `/admin/leads`. Le message envoyé est stocké dans
  `Lead.message` et visible sur la fiche du lead.
- **Relances (tâches)** : sur chaque fiche lead, on peut créer un rappel
  daté (ex. "Rappeler dans 3 jours") et le cocher une fois fait. Le
  dashboard affiche les relances en attente pour l'utilisateur connecté
  (ou pour toute l'agence si admin).
- **Matching automatique** : sur chaque fiche lead, une section "Biens
  correspondants" suggère jusqu'à 4 biens disponibles et publiés dont le
  prix rentre dans le budget du lead (tolérance ±10%), en priorisant les
  biens de la même ville.
- **Upload de photos réel** via UploadThing : sur `/admin/biens/nouveau` et
  `/admin/biens/[id]` (nouvelle page d'édition), un dropzone permet
  d'uploader des photos. Elles sont stockées en base (`PropertyImage`) et
  affichées partout où un bien apparaît (site public + admin), avec repli
  automatique sur le placeholder visuel s'il n'y a pas encore de photo.
- **Données localisées en Algérie** : villes (Alger, Oran, Constantine),
  adresses, mentions légales, et prix en dinar algérien (DA) au lieu de
  l'euro. Le champ DPE (diagnostic français) a été retiré des biens de
  démo — le champ existe toujours dans le schéma si besoin ailleurs, mais
  n'est affiché que s'il est renseigné.
- **Favoris** : bouton cœur sur chaque bien (cartes + fiche détaillée),
  stocké dans le navigateur (localStorage, pas besoin de compte), page
  `/favoris` pour les retrouver, compteur dans le header.
- **WhatsApp click-to-contact** sur chaque fiche bien — le numéro vient
  maintenant des paramètres agence (`/admin/parametres`), plus besoin de
  toucher au code.
- **Gestion des agents depuis l'admin** (`/admin/agents`, réservé aux
  ADMIN) : liste des comptes, création d'un nouvel agent, changement de
  rôle, activation/désactivation (un compte désactivé ne peut plus se
  connecter). Remplace le besoin de passer par le seed pour ajouter un
  agent.
- **Génération de PDF** (`@react-pdf/renderer`, pas de compte externe) :
  - **Mandat** — bouton "Télécharger le mandat" sur `/admin/biens/[id]`.
    Utilise les coordonnées du propriétaire (nouveau champ, privé, jamais
    affiché publiquement).
  - **Bon de visite** — lien "Bon de visite" sur chaque rendez-vous dans
    `/admin/agenda`.
  Les deux sont des documents de départ, à faire relire par un
  professionnel du droit avant usage réel (mention déjà présente en bas
  de chaque PDF).
- **Paramètres agence éditables** (`/admin/parametres`, réservé aux
  ADMIN) : nom, logo, adresse, téléphone, WhatsApp, email, accroche de
  l'accueil. Piloté par un modèle `AgencySettings` (singleton) au lieu
  d'être codé en dur dans le header/footer/contact. Note : les mentions
  légales restent statiques pour l'instant (champs juridiques spécifiques
  non couverts par ce modèle).
- **Carte interactive** (MapLibre GL + tuiles OpenStreetMap, 100% gratuit,
  aucun compte/clé requis) : affichée sur `/biens` (tous les biens
  filtrés qui ont des coordonnées) et sur chaque fiche bien (position
  unique). Les coordonnées se saisissent à la main dans le formulaire
  d'un bien (champ optionnel — pas de géocodage automatique pour
  l'instant).

⚠️ Changement de schéma cumulé depuis la dernière fois (ajout de
`Property.ownerName/ownerPhone/ownerEmail`, `Property.latitude/longitude`,
et du nouveau modèle `AgencySettings`) — tout est additif/nullable ou une
nouvelle table, donc sans risque, pas besoin de `--force-reset` :
```bash
npx prisma generate
npx prisma db push
```

## La carte (aucune configuration requise)

Contrairement à Mapbox/Google Maps, la carte fonctionne directement sans
compte ni clé API — elle utilise MapLibre GL (librairie open-source) avec
les tuiles gratuites d'OpenStreetMap. `npm run dev`, va sur `/biens` (les
biens du seed ont déjà des coordonnées).

Pour ajouter des coordonnées à un bien : clic droit sur l'emplacement dans
Google Maps → "Copier les coordonnées" → colle latitude/longitude dans le
formulaire du bien (`/admin/biens/[id]`).

Note : les tuiles OpenStreetMap gratuites sont pensées pour un usage
raisonnable (petit site, trafic modéré) — si le site prend beaucoup de
trafic un jour, passer à un fournisseur de tuiles dédié (ex: MapTiler,
qui a aussi un tier gratuit généreux) sera plus approprié.

⚠️ Comme les biens/articles de démo utilisent la même référence/slug
qu'avant (juste avec des données différentes), et que le seed utilise
`upsert` avec `update: {}` (= ne touche pas à un enregistrement déjà
existant), relancer `db seed` seul ne mettra PAS à jour tes anciennes
données françaises. Pour repartir avec les nouvelles données algériennes :
```bash
npx prisma db push --force-reset
npx prisma db seed
```
(ça efface aussi les leads que tu as créés en testant `/contact` — sans
conséquence sur une base de démo)

⚠️ Le schéma a encore changé (ajout du modèle `Article` pour le blog).
Après avoir récupéré cette version :
```bash
npx prisma generate
npx prisma db push
```
Le seed script n'est **pas** idempotent pour les leads/rendez-vous (seuls
les users/biens/articles utilisent `upsert`) — si tu avais déjà seedé
avant, ne relance pas `db seed` tel quel ou tu auras des leads en double.
Pour repartir propre et récupérer les 3 articles de démo :
```bash
npx prisma db push --force-reset
npx prisma db seed
```

## Notes techniques importantes

- **Prisma 6, pas 7** : épinglé volontairement (voir `package.json`). Prisma 7
  impose des adaptateurs de driver obligatoires et un nouveau système de
  config — trop de complexité pour ce projet. Ignore les messages
  "Update available 6 -> 7", ne mets pas à jour.
- **`src/proxy.ts`, pas `middleware.ts`** : Next.js 16 a renommé la
  convention. Si tu vois une erreur "Both middleware file and proxy file are
  detected", supprime l'ancien `src/middleware.ts`.
- **Windows / Turbopack** : `next.config.ts` fixe `turbopack.root` sur le
  dossier du projet, pour éviter qu'un `package-lock.json`/`yarn.lock`
  parasite dans un dossier parent (ex: le dossier utilisateur Windows) ne
  perturbe la détection de la racine.
- **La couche de données** vit dans `src/lib/data/` (`properties.ts`,
  `leads.ts`, `appointments.ts`) — c'est le seul endroit qui doit parler à
  Prisma directement. Les server actions dans `src/app/actions/` appellent
  cette couche et font le contrôle des permissions (rôle, propriétaire du
  lead) avant d'écrire.

## Comptes de démo

Mot de passe pour tous : `demo1234`

| Email | Rôle |
|---|---|
| claire.vasseur@maisonetfils.fr | ADMIN |
| nadir.belkacem@maisonetfils.fr | AGENT |
| emilie.roussel@maisonetfils.fr | AGENT |
| yanis.cherfi@maisonetfils.fr | ASSISTANT |

## Démarrer en local

```bash
npm install
npm run dev
```

## Connecter/reconnecter la base de données (Neon)

1. Crée un projet gratuit sur https://neon.tech (Postgres 15/16/17, tous compatibles)
2. Copie la connection string "pooled" dans `.env` (`DATABASE_URL=...`)
3. Lance :
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

⚠️ Si tu avais déjà seedé une version antérieure de ce projet (avant que
les rendez-vous soient ajoutés au seed), le script va recréer des leads en
double car `lead.create` n'est pas idempotent (contrairement à
`user.upsert`/`property.upsert`). Pour repartir propre :
```bash
npx prisma db push --force-reset
npx prisma db seed
```
(⚠️ ça vide entièrement la base — sans conséquence sur un projet Neon de dev/démo)

Un `AUTH_SECRET` est déjà généré dans `.env` pour le dev local. Pour la
prod, génère-en un nouveau : `openssl rand -base64 32`.

## Configurer l'upload de photos (UploadThing)

1. Crée un compte sur https://uploadthing.com (le tien est déjà fait)
2. Dashboard → API Keys → onglet "V7" → copie le token
3. Colle-le dans `.env` : `UPLOADTHING_TOKEN="..."`
4. `npm install` (si pas déjà fait), `npm run dev`

Pas de changement de schéma nécessaire — le modèle `PropertyImage`
existait déjà. Teste sur `/admin/biens/nouveau` ou en éditant un bien
existant via "Modifier" dans `/admin/biens`.

## À faire ensuite

- Relances automatiques (email/tâche) si un lead n'a pas été recontacté

## Structure

```
src/
  app/
    (site)/                 -> pages publiques (accueil, biens, estimation, neuf, agence, actualites, mentions-legales)
    admin/                   -> back-office (dashboard, leads, biens, agenda) — protege par proxy.ts
    login/                   -> page de connexion
    api/auth/[...nextauth]/  -> route handler Auth.js
    actions/                 -> server actions (login, logout, leads, properties)
  components/
    ui/                      -> Button, Badge, Input, Select (style shadcn)
    site/                    -> header, footer, property-card, search-bar...
    admin/                   -> sidebar, kanban, table biens, timeline interactions
  lib/
    data/                    -> couche d'accès Prisma (properties.ts, leads.ts, appointments.ts, tasks.ts, articles.ts)
    format.ts                -> labels + formatage (prix, statuts, étapes du pipeline...)
    prisma.ts                -> client Prisma (singleton)
  auth.ts                    -> config Auth.js (Credentials + bcrypt + Prisma)
  proxy.ts                   -> protection des routes /admin (ex-middleware.ts)
prisma/
  schema.prisma              -> schema complet (biens + CRM)
  seed.ts                    -> comptes de demo + quelques biens/leads/rdv
```
