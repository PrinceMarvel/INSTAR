/**
 * Système de dictionnaires et de correspondances linguistiques pour INSTAR.
 * Associe automatiquement le pays d'inscription à sa langue principale (Français ou Anglais).
 */

// Association entre code pays (ISO) et langue officielle dominante
export const COUNTRY_LANGUAGE_MAP = Object.freeze({
  CI: 'fr', // Côte d'Ivoire
  BF: 'fr', // Burkina Faso
  ML: 'fr', // Mali
  GN: 'fr', // Guinée
  SN: 'fr', // Sénégal
  TG: 'fr', // Togo
  BJ: 'fr', // Bénin
  NE: 'fr', // Niger
  CM: 'fr', // Cameroun
  FR: 'fr', // France
  BE: 'fr', // Belgique
  CH: 'fr', // Suisse
  CA: 'fr', // Canada (défaut bilingue)
  GH: 'en', // Ghana (Anglophone)
  NG: 'en', // Nigeria (Anglophone)
  LR: 'en', // Liberia (Anglophone)
  US: 'en', // États-Unis (Anglophone)
  GB: 'en', // Royaume-Uni (Anglophone)
});

export const TRANSLATIONS = Object.freeze({
  fr: {
    // Slogan & Identité
    appName: 'INSTAR',
    slogan: 'L’Ange de la route, rapide et sécurisée à Gagnoa',
    city: 'Gagnoa',

    // Rôles
    passenger: 'Passager',
    driver: 'Chauffeur',
    admin: 'Admin',

    // Connexion
    loginTitle: 'Se connecter',
    phoneLabel: 'Numéro de téléphone',
    adminEmailLabel: 'Adresse e-mail administrateur',
    passwordLabel: 'Mot de passe',
    loginButton: 'Se connecter',
    loading: 'Chargement...',
    noAccountPassenger: 'Nouveau sur INSTAR ?',
    createPassengerAccount: 'Créer un compte passager',
    noAccountDriver: 'Vous possédez une moto ou un taxi ?',
    joinDriverFleet: 'Rejoindre la flotte INSTAR',
    backToLogin: 'Retour à la connexion',

    // Inscription Passager
    passengerRegisterTitle: 'Compte Passager',
    passengerRegisterSubtitle: 'Commandez vos motos-taxis et taxis à Gagnoa en toute sérénité',
    fullNameLabel: 'Nom complet',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    createAccountButton: 'Créer mon compte',
    alreadyAccount: 'Vous avez déjà un compte ?',
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    passwordTooShort: 'Le mot de passe doit comporter au moins 6 caractères.',

    // Inscription Chauffeur
    driverRegisterTitle: 'Espace Chauffeur',
    driverRegisterSubtitle: 'Rejoignez le réseau professionnel de transport urbain de Gagnoa',
    vehicleTypeLabel: 'Type de véhicule de transport',
    motoTaxi: 'Moto-taxi',
    communalTaxi: 'Taxi communal',
    licensePlateLabel: 'Numéro d’immatriculation ou registre',
    submitDossierButton: 'Soumettre mon dossier',
    driverPendingInfo: 'Votre compte sera activé après vérification par les modérateurs de Gagnoa.',

    // Sélection pays
    selectCountryTitle: 'Sélectionnez votre pays',
    searchCountryPlaceholder: 'Rechercher un pays ou un indicatif...',
    noCountryFound: 'Aucun pays trouvé.',
    international: 'International',
  },

  en: {
    // Slogan & Identity
    appName: 'INSTAR',
    slogan: 'The Angel of the road, fast and safe in Gagnoa',
    city: 'Gagnoa',

    // Roles
    passenger: 'Passenger',
    driver: 'Driver',
    admin: 'Admin',

    // Login
    loginTitle: 'Log in',
    phoneLabel: 'Phone number',
    adminEmailLabel: 'Administrator email address',
    passwordLabel: 'Password',
    loginButton: 'Log in',
    loading: 'Loading...',
    noAccountPassenger: 'New to INSTAR?',
    createPassengerAccount: 'Create a passenger account',
    noAccountDriver: 'Do you own a motorbike or taxi?',
    joinDriverFleet: 'Join the INSTAR fleet',
    backToLogin: 'Back to login',

    // Passenger Registration
    passengerRegisterTitle: 'Passenger Account',
    passengerRegisterSubtitle: 'Order your moto-taxis and communal taxis in Gagnoa easily',
    fullNameLabel: 'Full name',
    confirmPasswordLabel: 'Confirm password',
    createAccountButton: 'Create my account',
    alreadyAccount: 'Already have an account?',
    passwordMismatch: 'Passwords do not match.',
    passwordTooShort: 'Password must be at least 6 characters long.',

    // Driver Registration
    driverRegisterTitle: 'Driver Space',
    driverRegisterSubtitle: 'Join the professional urban mobility network of Gagnoa',
    vehicleTypeLabel: 'Transport vehicle type',
    motoTaxi: 'Moto-taxi',
    communalTaxi: 'Communal taxi',
    licensePlateLabel: 'License plate or register number',
    submitDossierButton: 'Submit my application',
    driverPendingInfo: 'Your account will be activated after review by Gagnoa moderators.',

    // Country selection
    selectCountryTitle: 'Select your country',
    searchCountryPlaceholder: 'Search country or country code...',
    noCountryFound: 'No country found.',
    international: 'International',
  },
});
