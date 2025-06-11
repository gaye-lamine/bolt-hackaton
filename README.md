# NOMAD AI - Compagnon de Micro-Business Local

Une Progressive Web App (PWA) complète qui permet à n'importe qui de créer sa micro-entreprise locale de services en moins de 5 minutes grâce à une IA conversationnelle.

## 🎯 Fonctionnalités principales

- **Onboarding intelligent avec assistant IA** : Chatbot qui génère un profil de micro-entreprise personnalisé
- **Génération automatique de ressources** : Page de profil public, modèles de messages, tarifs recommandés
- **Dashboard mobile-first** : Gestion des services, clients, et disponibilités
- **Mode PWA** : Installable sur mobile, fonctionne hors-ligne
- **Authentification sans mot de passe** : Magic links via Supabase

## 🔧 Tech Stack

- **Frontend** : React + TypeScript, Tailwind CSS, Vite
- **Backend** : Supabase (auth, database, functions)
- **PWA** : Service Worker, App Manifest
- **Routing** : React Router
- **Icons** : Lucide React

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd nomad-ai-pwa
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
   - Créer un projet Supabase sur [supabase.com](https://supabase.com)
   - Copier `.env.example` vers `.env`
   - Remplir les variables d'environnement Supabase

4. **Créer les tables de base de données**
   - Dans le dashboard Supabase, aller dans SQL Editor
   - Exécuter le contenu du fichier `supabase/migrations/create_initial_schema.sql`

5. **Lancer en développement**
```bash
npm run dev
```

## 🔧 Configuration Supabase pour Production

### IMPORTANT : Configuration des URLs de redirection

Pour que l'authentification fonctionne correctement sur Netlify, vous DEVEZ configurer ces URLs dans votre dashboard Supabase :

1. **Allez dans votre projet Supabase → Authentication → URL Configuration**

2. **Site URL** : `https://hackaton-bolt.netlify.app`

3. **Redirect URLs** - Ajoutez TOUTES ces URLs :
   ```
   https://hackaton-bolt.netlify.app/**
   https://hackaton-bolt.netlify.app/dashboard
   https://hackaton-bolt.netlify.app/auth
   https://hackaton-bolt.netlify.app/onboarding
   http://localhost:3000/**
   http://localhost:5173/**
   ```

4. **Sauvegardez les changements**

### Vérification de la configuration

Après avoir mis à jour les URLs :
- Attendez 1-2 minutes pour la propagation
- Testez l'envoi d'un nouveau lien de connexion
- Le lien devrait maintenant pointer vers `https://hackaton-bolt.netlify.app`

## 📱 PWA Setup

L'application est configurée comme une PWA complète :

- **Installable** : Prompt d'installation automatique sur mobile
- **Offline-ready** : Service Worker pour le cache
- **App-like** : Écran de démarrage, icônes, mode standalone

## 🗃️ Structure de la base de données

- **users** : Profils utilisateurs avec compétences et disponibilités
- **services** : Services proposés par chaque utilisateur
- **clients** : Carnet d'adresses des clients
- **ai_conversations** : Historique des conversations avec l'IA

## 🤖 IA Assistant

L'assistant IA utilise un système de questions-réponses pour :
- Collecter les informations de l'utilisateur
- Générer automatiquement les services
- Créer le profil public
- Fournir des conseils personnalisés

*Note : En production, connecter à l'API OpenAI pour des réponses intelligentes*

## 🎨 Design System

- **Couleurs** : Purple (#8B5CF6), Teal (#14B8A6), Orange (#F97316)
- **Typographie** : Système de tailles cohérent
- **Espacement** : Grille 8px
- **Responsive** : Mobile-first avec breakpoints optimisés

## 🔐 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification** via Supabase Auth
- **Politiques** : Accès uniquement aux données personnelles
- **Profils publics** : Lecture seule pour les pages de services

## 📦 Build & Déploiement

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

Déployable sur :
- **Vercel** (recommandé pour PWA)
- **Netlify**
- **Supabase Hosting**

## 🛠️ Développement

### Structure des composants
```
src/
├── components/         # Composants réutilisables
│   ├── Layout/        # Header, Sidebar
│   ├── UI/            # Button, Input, Card
│   └── Chat/          # Chat interface
├── contexts/          # React Context (Auth, Theme)
├── hooks/             # Custom hooks
├── lib/               # Utilitaires (Supabase client)
├── pages/             # Pages principales
└── App.tsx           # Configuration des routes
```

### Ajout de nouvelles fonctionnalités

1. **Nouveaux services** : Étendre la table `services`
2. **Analytics** : Ajouter une table `analytics`
3. **Paiements** : Intégrer Stripe
4. **Notifications** : Push notifications PWA

## 📖 Utilisation

1. **Inscription** : Magic link par email
2. **Onboarding** : Questions de l'IA (5 min)
3. **Profil généré** : Services et page publique créés
4. **Partage** : URL personnalisée `/profile/username`
5. **Gestion** : Dashboard pour clients et services

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier LICENSE pour plus de détails.

---

**NOMAD AI** - Libérez votre potentiel entrepreneurial ! 🚀