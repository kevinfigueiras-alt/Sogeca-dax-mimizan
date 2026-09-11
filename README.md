# SOGECA — Tableau de bord Portefeuille & CA

Version autonome (hors Claude) du tableau de bord SOGECA : portefeuille clients,
sorties, répartition par collaborateur, atterrissage (charges fixes, PCA,
primes) et prospects.

Ce dossier contient tout le nécessaire pour héberger le site sur Internet,
avec une vraie base de données partagée et un code d'accès. Un développeur
web peut le prendre en main directement ; les étapes ci-dessous sont aussi
écrites pour quelqu'un qui n'a jamais fait ça.

## Ce qui a changé par rapport à la version Claude

Dans Claude, les données étaient sauvegardées automatiquement par l'outil
(`window.storage`). Cette fonctionnalité n'existe qu'à l'intérieur de Claude.
Cette version utilise à la place **Supabase**, un service de base de données
gratuit (jusqu'à un certain volume) et simple à mettre en place, sans écrire
de code serveur.

Si aucune base Supabase n'est configurée, le site fonctionne quand même,
mais chaque ordinateur/navigateur garde ses propres données en local
(pratique pour tester avant de déployer).

## Ce qu'il faut prévoir avant de commencer

- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) pour héberger le site (gratuit pour ce volume d'usage)
- Node.js installé sur l'ordinateur qui fait le déploiement (version 18 ou plus), uniquement si vous voulez lancer le site en local ou exécuter le script d'import des données

---

## Étape 1 — Créer la base de données (Supabase)

1. Allez sur [supabase.com](https://supabase.com) → **New project**
2. Donnez-lui un nom (ex. `sogeca-dashboard`), choisissez un mot de passe de base de données (à conserver de côté), et une région proche (Europe)
3. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche) → **New query**
4. Ouvrez le fichier [`supabase/schema.sql`](./supabase/schema.sql) de ce dossier, copiez tout son contenu, collez-le dans l'éditeur SQL, puis cliquez sur **Run**
   → Cela crée la table `kv_store` qui contiendra le portefeuille, les charges, les prospects, le PCA et les primes.
5. Allez dans **Project Settings** (icône engrenage) → **API**
   → Notez les deux valeurs suivantes, vous en aurez besoin à l'étape 3 :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)

## Étape 2 — Charger les données de départ

Les données actuelles du portefeuille (881 dossiers), des charges fixes
(juil. 2026 → juin 2027) sont déjà exportées dans le dossier [`data/`](./data).
Les prospects, le PCA et les primes démarrent vides (à remplir directement
dans le site une fois en ligne).

**⚠️ Point important** : les valeurs de PCA et de primes que vous avez pu
saisir directement dans le tableau de bord affiché dans Claude ne sont
**pas récupérables automatiquement** — cette limitation vient de Claude, pas
de ce projet. Si vous aviez déjà rempli des primes ou des PCA côté Claude,
il faudra les ressaisir une fois le nouveau site en ligne (ça prend 2 minutes,
via les onglets Atterrissage et Primes du site lui-même).

Pour charger les données de départ dans Supabase :

```bash
npm install
cp .env.example .env
# Ouvrez .env et remplissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
# avec les valeurs notées à l'étape 1
node --env-file=.env scripts/seed.mjs
```

Vous devriez voir 5 lignes `OK : ...` s'afficher.

## Étape 3 — Configurer le code d'accès et lancer en local (optionnel)

Dans le fichier `.env`, choisissez un code d'accès :

```
VITE_ACCESS_CODE=votre-code-ici
```

Pour tester le site sur votre ordinateur avant de le mettre en ligne :

```bash
npm run dev
```

Puis ouvrez l'adresse affichée (en général `http://localhost:5173`).

## Étape 4 — Déployer le site en ligne (Vercel, recommandé)

1. Créez un compte sur [vercel.com](https://vercel.com) (vous pouvez vous connecter avec GitHub)
2. Mettez ce dossier sur un dépôt GitHub (demandez à votre agence web de le faire si besoin — c'est une opération standard de quelques minutes)
3. Sur Vercel : **Add New** → **Project** → sélectionnez le dépôt GitHub
4. Dans les réglages du projet, section **Environment Variables**, ajoutez les 3 mêmes variables que dans votre `.env` :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ACCESS_CODE`
5. Cliquez sur **Deploy**

Au bout de 1 à 2 minutes, Vercel vous donne une adresse du type
`sogeca-dashboard.vercel.app`. C'est votre site, accessible depuis n'importe
quel navigateur, protégé par le code d'accès.

Vous pouvez ensuite, dans les réglages Vercel, brancher un nom de domaine à
vous (ex. `portefeuille.sogeca.com`) si vous en avez un.

### Alternative : Netlify

Le principe est identique (glisser le dossier ou connecter GitHub, définir
les mêmes variables d'environnement, déployer). Netlify détecte
automatiquement qu'il s'agit d'un projet Vite.

---

## Utilisation au quotidien

- Toute personne qui a l'adresse du site **et** le code d'accès peut l'ouvrir, voir le portefeuille et le modifier (ajouter/résilier des clients, saisir des charges, des primes, des prospects...)
- Toutes les modifications sont partagées instantanément entre tous les utilisateurs (comme dans Claude)
- Pour changer le code d'accès : modifiez la variable `VITE_ACCESS_CODE` dans Vercel et redéployez

## Limites à connaître

- Le code d'accès protège l'accès au site, mais **tout le monde qui le connaît a les mêmes droits** (pas de comptes séparés, pas d'historique de qui a modifié quoi). Si vous avez besoin de comptes individuels par collaborateur avec des droits différents, il faut ajouter l'authentification Supabase (Supabase Auth) — une évolution possible mais qui demande un peu plus de développement.
- Pas de sauvegarde automatique / historique des versions du portefeuille. Pensez à exporter régulièrement (ou demandez à votre développeur d'ajouter un bouton d'export Excel).

## Pour aller plus loin

Si vous voulez qu'un développeur reprenne ce projet pour l'améliorer
(comptes utilisateurs, export Excel automatique, historique des
modifications, connexion avec votre logiciel de facturation...), ce dossier
lui donne une base de code claire et fonctionnelle à partir de laquelle
travailler.
