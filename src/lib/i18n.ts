export type LanguageCode = 'en' | 'fr' | 'es' | 'ha';

export type TranslationKey = 
  | 'dashboard'
  | 'settings'
  | 'notifications'
  | 'calendar'
  | 'taskDecomposer'
  | 'procrastinationAnalyzer'
  | 'analytics'
  | 'distractionCost'
  | 'welcomeBack'
  | 'save'
  | 'updatePassword'
  | 'email'
  | 'name'
  | 'language'
  | 'profile'
  | 'logout'
  | 'cancel'
  | 'delete'
  | 'edit'
  // Common / Navigation
  | 'search'
  | 'helpCenter'
  | 'keyboardShortcuts'
  | 'giveFeedback'
  | 'admin'
  | 'signedOut'
  | 'languageChanged'
  | 'openingHelpCenter'
  | 'feedbackThanks'
  | 'platform'
  | 'tools'
  | 'copyright'
  // Settings
  | 'manageAccount'
  | 'preferences'
  | 'focusMode'
  | 'privacy'
  | 'profileInfo'
  | 'updatePhoto'
  | 'avatarUrl'
  | 'upload'
  | 'bio'
  | 'appearance'
  | 'customizeLook'
  | 'darkMode'
  | 'reduceEyeStrain'
  | 'compactMode'
  | 'reduceSpacing'
  | 'configureAlerts'
  | 'emailNotifications'
  | 'emailNotifDesc'
  | 'pushNotifications'
  | 'pushNotifDesc'
  | 'focusConfiguration'
  | 'focusConfigDesc'
  | 'strictMode'
  | 'strictModeDesc'
  | 'blockDistractions'
  | 'blockDistractionsDesc'
  | 'defaultFocusDuration'
  | 'security'
  | 'securityDesc'
  | 'currentPassword'
  | 'newPassword'
  | 'confirmPassword'
  | 'dangerZone'
  | 'irreversibleActions'
  | 'deleteAccount'
  | 'deleteAccountDesc'
  | 'profileUpdated'
  | 'focusPrefsSaved'
  | 'passwordUpdated'
  | 'passwordUpdateFailed'
  | 'enterNewPassword'
  | 'passwordsDoNotMatch'
  | 'passwordTooShort'
  | 'fileSizeError'
  | 'fileFormatError'
  // Analytics
  | 'deepDive'
  | 'selectPeriod'
  | 'last7Days'
  | 'last14Days'
  | 'last30Days'
  | 'generateReport'
  | 'noActivity'
  | 'startTracking'
  | 'avgFocusScore'
  | 'deepWork'
  | 'distractionTime'
  | 'flowEfficiency'
  | 'weeklyFocusTrend'
  | 'dailyFocusScore'
  | 'distractionSources'
  | 'attentionGoes'
  | 'peakPerformanceHours'
  | 'focusMinutesByHour'
  | 'aiInsights'
  | 'personalizedRecs'
  | 'weeklyReport'
  | 'exportCsv'
  | 'focusTime'
  | 'distractions'
  | 'focusScore'
  | 'totalDays'
  | 'date'
  | 'focusMin'
  | 'distractionMin'
  | 'noDataAvailable'
  | 'showingRecentDays'
  // Calendar
  | 'manageSchedule'
  | 'sync'
  | 'newBlock'
  | 'day'
  | 'week'
  | 'calendars'
  | 'work'
  | 'personal'
  | 'focus'
  | 'upcomingSessions'
  | 'close'
  | 'editBlock'
  | 'title'
  | 'startTime'
  | 'duration'
  | 'tag'
  | 'color'
  | 'selectTag'
  | 'selectColor'
  | 'saveChanges'
  | 'createBlock'
  | 'calendarSettings'
  | 'done'
  | 'hours'
  | 'mins'
  | 'eventUpdated'
  | 'eventCreated'
  | 'eventDeleted'
  | 'calendarSynced'
  | 'pleaseEnterTitle'
  | 'sessionCompleted'
  | 'sessionMarkedComplete'
  // Distraction Cost
  | 'visualizeImpact'
  | 'noDistractionData'
  | 'logDistractions'
  | 'estimatedDailyLoss'
  | 'configuration'
  | 'adjustParams'
  | 'hourlyRate'
  | 'teamSize'
  | 'includeOverhead'
  | 'contextSwitchPenalty'
  | 'calculationsBasedOn'
  | 'contextSwitches'
  | 'detectedInterruptions'
  | 'totalTimeLost'
  | 'avgDailyLoss'
  | 'summaryLastDays'
  | 'projectedAnnualLoss'
  | 'perDayCost'
  | 'youWereAway'
  // Notifications
  | 'stayUpdated'
  | 'markAllRead'
  | 'all'
  | 'unread'
  | 'archived'
  | 'noNotifications'
  | 'caughtUp'
  | 'markAsRead'
  | 'archive'
  // Procrastination Analyzer
  | 'focusBlockerActive'
  | 'distractionAttemptLogged'
  // Task Decomposer
  | 'transformTasks'
  | 'whatNeedsDone'
  | 'enterTaskDetails'
  | 'chunkSize'
  | 'timeAvailable'
  | 'extraContext'
  | 'generateSteps'
  | 'decomposing'
  | 'actionPlan'
  | 'totalTime'
  | 'analyzingComplexity'
  | 'breakingDownTask'
  | 'startFirstSession'
  | 'whyThisWorks'
  | 'cognitiveLoadTheory'
  | 'cognitiveLoadDesc'
  | 'dopamineLoop'
  | 'dopamineLoopDesc'
  | 'timeBoxing'
  | 'timeBoxingDesc'
  | 'proTips'
  | 'tipMomentum'
  | 'tipBreakDown'
  // Home
  | 'trackProductivity'
  | 'tasksCompleted'
  | 'productivity';

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    notifications: 'Notifications',
    calendar: 'Calendar',
    taskDecomposer: 'Task Decomposer',
    procrastinationAnalyzer: 'Procrastination Analyzer',
    analytics: 'Analytics',
    distractionCost: 'Distraction Cost',
    welcomeBack: 'Welcome back',
    save: 'Save',
    updatePassword: 'Update Password',
    email: 'Email',
    name: 'Name',
    language: 'Language',
    profile: 'Profile',
    logout: 'Logout',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search...',
    helpCenter: 'Help Center',
    keyboardShortcuts: 'Keyboard Shortcuts',
    giveFeedback: 'Give Feedback',
    admin: 'Admin',
    signedOut: 'Signed out successfully',
    languageChanged: 'Language changed to',
    openingHelpCenter: 'Opening Help Center...',
    feedbackThanks: 'Thanks for your feedback!',
    platform: 'Platform',
    tools: 'Tools',
    copyright: '© 2026 FocusFlow Inc.',
    manageAccount: 'Manage your account settings and preferences.',
    preferences: 'Preferences',
    focusMode: 'Focus Mode',
    privacy: 'Privacy',
    profileInfo: 'Profile Information',
    updatePhoto: 'Update your photo and personal details.',
    avatarUrl: 'Avatar URL (Optional)',
    upload: 'Upload',
    bio: 'Bio',
    appearance: 'Appearance',
    customizeLook: 'Customize how FocusFlow looks on your device.',
    darkMode: 'Dark Mode',
    reduceEyeStrain: 'Adjust the appearance to reduce eye strain.',
    compactMode: 'Compact Mode',
    reduceSpacing: 'Reduce spacing for higher information density.',
    configureAlerts: 'Configure how you receive alerts.',
    emailNotifications: 'Email Notifications',
    emailNotifDesc: 'Receive daily summaries and weekly reports.',
    pushNotifications: 'Push Notifications',
    pushNotifDesc: 'Receive real-time alerts on your device.',
    focusConfiguration: 'Focus Mode Configuration',
    focusConfigDesc: 'Set up your environment for deep work sessions.',
    strictMode: 'Strict Mode',
    strictModeDesc: 'Block all non-essential notifications during focus sessions.',
    blockDistractions: 'Block distraction prompts',
    blockDistractionsDesc: 'Prevent new task prompts during focus sessions.',
    defaultFocusDuration: 'Default Focus Duration (minutes)',
    security: 'Security',
    securityDesc: 'Manage your password and security settings.',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    dangerZone: 'Danger Zone',
    irreversibleActions: 'Irreversible actions.',
    deleteAccount: 'Delete Account',
    deleteAccountDesc: 'Permanently remove your account and all data.',
    profileUpdated: 'Profile updated successfully',
    focusPrefsSaved: 'Focus preferences saved',
    passwordUpdated: 'Password updated successfully',
    passwordUpdateFailed: 'Failed to update password',
    enterNewPassword: 'Please enter a new password',
    passwordsDoNotMatch: 'New passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    fileSizeError: 'File size must be less than 800KB',
    fileFormatError: 'JPG, GIF or PNG. Max 800KB.',
    deepDive: 'Deep dive into your cognitive performance and focus trends.',
    selectPeriod: 'Select period',
    last7Days: 'Last 7 Days',
    last14Days: 'Last 14 Days',
    last30Days: 'Last 30 Days',
    generateReport: 'Generate Report',
    noActivity: 'No activity yet',
    startTracking: 'Start tracking your focus sessions and distractions to see your analytics here.',
    avgFocusScore: 'Avg Focus Score',
    deepWork: 'Deep Work',
    distractionTime: 'Distraction Time',
    flowEfficiency: 'Flow Efficiency',
    weeklyFocusTrend: 'Weekly Focus Trend',
    dailyFocusScore: 'Daily focus score vs. deep work hours',
    distractionSources: 'Distraction Sources',
    attentionGoes: 'Where your attention goes',
    peakPerformanceHours: 'Peak Performance Hours',
    focusMinutesByHour: 'Focus minutes by hour of day',
    aiInsights: 'AI Insights',
    personalizedRecs: 'Personalized recommendations based on your data',
    weeklyReport: 'Weekly Report',
    exportCsv: 'Export CSV',
    focusTime: 'Focus Time',
    distractions: 'Distractions',
    focusScore: 'Focus Score',
    totalDays: 'Total Days',
    date: 'Date',
    focusMin: 'Focus (min)',
    distractionMin: 'Distraction (min)',
    noDataAvailable: 'No data available.',
    showingRecentDays: 'Showing recent 7 days. Download CSV for full report.',
    manageSchedule: 'Manage your schedule and focus blocks',
    sync: 'Sync',
    newBlock: 'New Block',
    day: 'Day',
    week: 'Week',
    calendars: 'Calendars',
    work: 'Work',
    personal: 'Personal',
    focus: 'Focus',
    upcomingSessions: 'Upcoming Sessions',
    close: 'Close',
    editBlock: 'Edit Block',
    title: 'Title',
    startTime: 'Start Time',
    duration: 'Duration',
    tag: 'Tag',
    color: 'Color',
    selectTag: 'Select tag',
    selectColor: 'Select color',
    saveChanges: 'Save Changes',
    createBlock: 'Create Block',
    calendarSettings: 'Calendar Settings',
    done: 'Done',
    hours: 'Hours',
    mins: 'Mins',
    eventUpdated: 'Event updated',
    eventCreated: 'Event created',
    eventDeleted: 'Event deleted',
    calendarSynced: 'Calendar synced',
    pleaseEnterTitle: 'Please enter a title',
    sessionCompleted: 'Focus session completed!',
    sessionMarkedComplete: 'Session marked as complete',
    visualizeImpact: 'Visualize the financial impact of interruptions based on your recent activity.',
    noDistractionData: 'No distraction data yet',
    logDistractions: 'Log some distractions to see the cost analysis.',
    estimatedDailyLoss: 'Estimated Daily Loss',
    configuration: 'Configuration',
    adjustParams: 'Adjust parameters to estimate costs',
    hourlyRate: 'Hourly Rate (Avg)',
    teamSize: 'Team Size',
    includeOverhead: 'Include Overhead (20%)',
    contextSwitchPenalty: 'Context Switch Penalty',
    calculationsBasedOn: 'Calculations based on your last 7 days of activity.',
    contextSwitches: 'Context Switches',
    detectedInterruptions: 'Detected interruptions (Last 7 days)',
    totalTimeLost: 'Total time lost (Last 7 days)',
    avgDailyLoss: 'Avg Daily Loss',
    summaryLastDays: 'Summary of the last {days} days',
    projectedAnnualLoss: 'Projected Annual Loss',
    perDayCost: 'Cost per day',
    youWereAway: 'You were away',
    stayUpdated: 'Stay updated on your productivity and tasks.',
    markAllRead: 'Mark all as read',
    all: 'All',
    unread: 'Unread',
    archived: 'Archived',
    noNotifications: 'No notifications',
    caughtUp: 'You\'re all caught up! Check back later for new updates.',
    markAsRead: 'Mark as read',
    archive: 'Archive',
    focusBlockerActive: 'Focus Blocker Active',
    distractionAttemptLogged: 'Distraction attempt logged!',
    transformTasks: 'Transform overwhelming projects into manageable micro-steps.',
    whatNeedsDone: 'What needs to be done?',
    enterTaskDetails: 'Enter a complex task and fine-tune the timeboxing details.',
    chunkSize: 'Chunk size (minutes)',
    timeAvailable: 'Time available (optional)',
    extraContext: 'Extra context (optional)',
    generateSteps: 'Generate Steps',
    decomposing: 'Decomposing...',
    actionPlan: 'Action Plan',
    totalTime: 'Total Time',
    analyzingComplexity: 'Analyzing Complexity',
    breakingDownTask: 'Breaking down task into atomic units...',
    startFirstSession: 'Start First Session',
    whyThisWorks: 'Why This Works',
    cognitiveLoadTheory: 'Cognitive Load Theory',
    cognitiveLoadDesc: 'Large tasks trigger "analysis paralysis". Breaking them down reduces the cognitive load required to start.',
    dopamineLoop: 'The Dopamine Loop',
    dopamineLoopDesc: 'Checking off small items creates frequent dopamine hits, maintaining momentum and motivation.',
    timeBoxing: 'Time Boxing',
    timeBoxingDesc: '5-15 minute chunks fit into gaps in your schedule, making it easier to make progress on busy days.',
    proTips: 'Pro Tips',
    tipMomentum: 'Start with the easiest micro-step to build momentum immediately.',
    tipBreakDown: 'If a step still feels "hard", break it down further until it feels trivial.',
    trackProductivity: 'Track productivity and manage tasks with ease and convenience',
    tasksCompleted: 'Tasks Completed',
    productivity: 'Productivity',
  },
  fr: {
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    notifications: 'Notifications',
    calendar: 'Calendrier',
    taskDecomposer: 'Décomposeur de tâches',
    procrastinationAnalyzer: 'Analyseur de procrastination',
    analytics: 'Analytique',
    distractionCost: 'Coût de distraction',
    welcomeBack: 'Bon retour',
    save: 'Enregistrer',
    updatePassword: 'Mettre à jour le mot de passe',
    email: 'E-mail',
    name: 'Nom',
    language: 'Langue',
    profile: 'Profil',
    logout: 'Se déconnecter',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher...',
    helpCenter: 'Centre d\'aide',
    keyboardShortcuts: 'Raccourcis clavier',
    giveFeedback: 'Donner un avis',
    admin: 'Admin',
    signedOut: 'Déconnecté avec succès',
    languageChanged: 'Langue changée en',
    openingHelpCenter: 'Ouverture du centre d\'aide...',
    feedbackThanks: 'Merci pour votre avis !',
    platform: 'Plateforme',
    tools: 'Outils',
    copyright: '© 2026 FocusFlow Inc.',
    manageAccount: 'Gérez les paramètres de votre compte et vos préférences.',
    preferences: 'Préférences',
    focusMode: 'Mode Focus',
    privacy: 'Confidentialité',
    profileInfo: 'Informations de profil',
    updatePhoto: 'Mettez à jour votre photo et vos informations personnelles.',
    avatarUrl: 'URL de l\'avatar (Optionnel)',
    upload: 'Télécharger',
    bio: 'Bio',
    appearance: 'Apparence',
    customizeLook: 'Personnalisez l\'apparence de FocusFlow sur votre appareil.',
    darkMode: 'Mode sombre',
    reduceEyeStrain: 'Ajustez l\'apparence pour réduire la fatigue oculaire.',
    compactMode: 'Mode compact',
    reduceSpacing: 'Réduisez l\'espacement pour une densité d\'information plus élevée.',
    configureAlerts: 'Configurez la réception des alertes.',
    emailNotifications: 'Notifications par e-mail',
    emailNotifDesc: 'Recevez des résumés quotidiens et des rapports hebdomadaires.',
    pushNotifications: 'Notifications Push',
    pushNotifDesc: 'Recevez des alertes en temps réel sur votre appareil.',
    focusConfiguration: 'Configuration du mode Focus',
    focusConfigDesc: 'Configurez votre environnement pour des sessions de travail approfondi.',
    strictMode: 'Mode strict',
    strictModeDesc: 'Bloquez toutes les notifications non essentielles pendant les sessions de focus.',
    blockDistractions: 'Bloquer les distractions',
    blockDistractionsDesc: 'Empêchez les nouvelles demandes de tâches pendant les sessions de focus.',
    defaultFocusDuration: 'Durée de focus par défaut (minutes)',
    security: 'Sécurité',
    securityDesc: 'Gérez votre mot de passe et vos paramètres de sécurité.',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    dangerZone: 'Zone de danger',
    irreversibleActions: 'Actions irréversibles.',
    deleteAccount: 'Supprimer le compte',
    deleteAccountDesc: 'Supprimez définitivement votre compte et toutes les données.',
    profileUpdated: 'Profil mis à jour avec succès',
    focusPrefsSaved: 'Préférences de focus enregistrées',
    passwordUpdated: 'Mot de passe mis à jour avec succès',
    passwordUpdateFailed: 'Échec de la mise à jour du mot de passe',
    enterNewPassword: 'Veuillez entrer un nouveau mot de passe',
    passwordsDoNotMatch: 'Les nouveaux mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    fileSizeError: 'La taille du fichier doit être inférieure à 800 Ko',
    fileFormatError: 'JPG, GIF ou PNG. Max 800 Ko.',
    deepDive: 'Plongez dans vos performances cognitives et vos tendances de concentration.',
    selectPeriod: 'Sélectionner une période',
    last7Days: '7 derniers jours',
    last14Days: '14 derniers jours',
    last30Days: '30 derniers jours',
    generateReport: 'Générer un rapport',
    noActivity: 'Aucune activité pour le moment',
    startTracking: 'Commencez à suivre vos sessions de focus et vos distractions pour voir vos analyses ici.',
    avgFocusScore: 'Score de focus moyen',
    deepWork: 'Travail approfondi',
    distractionTime: 'Temps de distraction',
    flowEfficiency: 'Efficacité du flux',
    weeklyFocusTrend: 'Tendance hebdomadaire de focus',
    dailyFocusScore: 'Score de focus quotidien vs heures de travail approfondi',
    distractionSources: 'Sources de distraction',
    attentionGoes: 'Où va votre attention',
    peakPerformanceHours: 'Heures de performance maximale',
    focusMinutesByHour: 'Minutes de focus par heure de la journée',
    aiInsights: 'Insights IA',
    personalizedRecs: 'Recommandations personnalisées basées sur vos données',
    weeklyReport: 'Rapport hebdomadaire',
    exportCsv: 'Exporter CSV',
    focusTime: 'Temps de focus',
    distractions: 'Distractions',
    focusScore: 'Score de focus',
    totalDays: 'Jours totaux',
    date: 'Date',
    focusMin: 'Focus (min)',
    distractionMin: 'Distraction (min)',
    noDataAvailable: 'Aucune donnée disponible.',
    showingRecentDays: 'Affichage des 7 derniers jours. Téléchargez le CSV pour le rapport complet.',
    manageSchedule: 'Gérez votre emploi du temps et vos blocs de focus',
    sync: 'Synchroniser',
    newBlock: 'Nouveau bloc',
    day: 'Jour',
    week: 'Semaine',
    calendars: 'Calendriers',
    work: 'Travail',
    personal: 'Personnel',
    focus: 'Focus',
    upcomingSessions: 'Sessions à venir',
    close: 'Fermer',
    editBlock: 'Modifier le bloc',
    title: 'Titre',
    startTime: 'Heure de début',
    duration: 'Durée',
    tag: 'Tag',
    color: 'Couleur',
    selectTag: 'Sélectionner un tag',
    selectColor: 'Sélectionner une couleur',
    saveChanges: 'Enregistrer les modifications',
    createBlock: 'Créer un bloc',
    calendarSettings: 'Paramètres du calendrier',
    done: 'Terminé',
    hours: 'Heures',
    mins: 'Mins',
    eventUpdated: 'Événement mis à jour',
    eventCreated: 'Événement créé',
    eventDeleted: 'Événement supprimé',
    calendarSynced: 'Calendrier synchronisé',
    pleaseEnterTitle: 'Veuillez entrer un titre',
    sessionCompleted: 'Session de focus terminée !',
    sessionMarkedComplete: 'Session marquée comme terminée',
    visualizeImpact: 'Visualisez l\'impact financier des interruptions sur votre activité récente.',
    noDistractionData: 'Pas encore de données de distraction',
    logDistractions: 'Enregistrez quelques distractions pour voir l\'analyse des coûts.',
    estimatedDailyLoss: 'Perte quotidienne estimée',
    configuration: 'Configuration',
    adjustParams: 'Ajustez les paramètres pour estimer les coûts',
    hourlyRate: 'Taux horaire (Moy)',
    teamSize: 'Taille de l\'équipe',
    includeOverhead: 'Inclure les frais généraux (20%)',
    contextSwitchPenalty: 'Pénalité de changement de contexte',
    calculationsBasedOn: 'Calculs basés sur vos 7 derniers jours d\'activité.',
    contextSwitches: 'Changements de contexte',
    detectedInterruptions: 'Interruptions détectées (7 derniers jours)',
    totalTimeLost: 'Temps total perdu (7 derniers jours)',
    avgDailyLoss: 'Perte quotidienne moy',
    summaryLastDays: 'Résumé des {days} derniers jours',
    projectedAnnualLoss: 'Perte annuelle projetée',
    perDayCost: 'Coût par jour',
    youWereAway: 'Vous étiez absent',
    stayUpdated: 'Restez informé de votre productivité et de vos tâches.',
    markAllRead: 'Tout marquer comme lu',
    all: 'Tout',
    unread: 'Non lu',
    archived: 'Archivé',
    noNotifications: 'Aucune notification',
    caughtUp: 'Vous êtes à jour ! Revenez plus tard pour de nouvelles mises à jour.',
    markAsRead: 'Marquer comme lu',
    archive: 'Archiver',
    focusBlockerActive: 'Bloqueur de focus actif',
    distractionAttemptLogged: 'Tentative de distraction enregistrée !',
    transformTasks: 'Transformez des projets écrasants en micro-étapes gérables.',
    whatNeedsDone: 'Que faut-il faire ?',
    enterTaskDetails: 'Entrez une tâche complexe et affinez les détails du timeboxing.',
    chunkSize: 'Taille du morceau (minutes)',
    timeAvailable: 'Temps disponible (optionnel)',
    extraContext: 'Contexte supplémentaire (optionnel)',
    generateSteps: 'Générer les étapes',
    decomposing: 'Décomposition...',
    actionPlan: 'Plan d\'action',
    totalTime: 'Temps total',
    analyzingComplexity: 'Analyse de la complexité',
    breakingDownTask: 'Décomposition de la tâche en unités atomiques...',
    startFirstSession: 'Démarrer la première session',
    whyThisWorks: 'Pourquoi ça marche',
    cognitiveLoadTheory: 'Théorie de la charge cognitive',
    cognitiveLoadDesc: 'Les grandes tâches déclenchent une "paralysie de l\'analyse". Les décomposer réduit la charge cognitive nécessaire pour commencer.',
    dopamineLoop: 'La boucle de dopamine',
    dopamineLoopDesc: 'Cocher de petits éléments crée des pics de dopamine fréquents, maintenant l\'élan et la motivation.',
    timeBoxing: 'Time Boxing',
    timeBoxingDesc: 'Des morceaux de 5 à 15 minutes s\'intègrent dans les trous de votre emploi du temps, facilitant la progression lors des journées chargées.',
    proTips: 'Conseils pro',
    tipMomentum: 'Commencez par la micro-étape la plus facile pour créer un élan immédiat.',
    tipBreakDown: 'Si une étape semble encore "difficile", décomposez-la davantage jusqu\'à ce qu\'elle semble triviale.',
    trackProductivity: 'Suivez la productivité et gérez les tâches avec facilité et commodité',
    tasksCompleted: 'Tâches terminées',
    productivity: 'Productivité',
  },
  es: {
    dashboard: 'Panel de control',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    calendar: 'Calendario',
    taskDecomposer: 'Desglosador de tareas',
    procrastinationAnalyzer: 'Analizador de procrastinación',
    analytics: 'Analítica',
    distractionCost: 'Costo de distracción',
    welcomeBack: 'Bienvenido de nuevo',
    save: 'Guardar',
    updatePassword: 'Actualizar contraseña',
    email: 'Correo electrónico',
    name: 'Nombre',
    language: 'Idioma',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar...',
    helpCenter: 'Centro de ayuda',
    keyboardShortcuts: 'Atajos de teclado',
    giveFeedback: 'Dar opinión',
    admin: 'Admin',
    signedOut: 'Sesión cerrada con éxito',
    languageChanged: 'Idioma cambiado a',
    openingHelpCenter: 'Abriendo Centro de ayuda...',
    feedbackThanks: '¡Gracias por tu opinión!',
    platform: 'Plataforma',
    tools: 'Herramientas',
    copyright: '© 2026 FocusFlow Inc.',
    manageAccount: 'Administra la configuración y preferencias de tu cuenta.',
    preferences: 'Preferencias',
    focusMode: 'Modo de enfoque',
    privacy: 'Privacidad',
    profileInfo: 'Información del perfil',
    updatePhoto: 'Actualiza tu foto y datos personales.',
    avatarUrl: 'URL del avatar (Opcional)',
    upload: 'Subir',
    bio: 'Biografía',
    appearance: 'Apariencia',
    customizeLook: 'Personaliza cómo se ve FocusFlow en tu dispositivo.',
    darkMode: 'Modo oscuro',
    reduceEyeStrain: 'Ajusta la apariencia para reducir la fatiga visual.',
    compactMode: 'Modo compacto',
    reduceSpacing: 'Reduce el espaciado para una mayor densidad de información.',
    configureAlerts: 'Configura cómo recibes alertas.',
    emailNotifications: 'Notificaciones por correo',
    emailNotifDesc: 'Recibe resúmenes diarios e informes semanales.',
    pushNotifications: 'Notificaciones Push',
    pushNotifDesc: 'Recibe alertas en tiempo real en tu dispositivo.',
    focusConfiguration: 'Configuración del modo de enfoque',
    focusConfigDesc: 'Configura tu entorno para sesiones de trabajo profundo.',
    strictMode: 'Modo estricto',
    strictModeDesc: 'Bloquea todas las notificaciones no esenciales durante las sesiones de enfoque.',
    blockDistractions: 'Bloquear distracciones',
    blockDistractionsDesc: 'Evita nuevas solicitudes de tareas durante las sesiones de enfoque.',
    defaultFocusDuration: 'Duración de enfoque predeterminada (minutos)',
    security: 'Seguridad',
    securityDesc: 'Administra tu contraseña y configuración de seguridad.',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña',
    dangerZone: 'Zona de peligro',
    irreversibleActions: 'Acciones irreversibles.',
    deleteAccount: 'Eliminar cuenta',
    deleteAccountDesc: 'Elimina permanentemente tu cuenta y todos los datos.',
    profileUpdated: 'Perfil actualizado con éxito',
    focusPrefsSaved: 'Preferencias de enfoque guardadas',
    passwordUpdated: 'Contraseña actualizada con éxito',
    passwordUpdateFailed: 'Error al actualizar la contraseña',
    enterNewPassword: 'Por favor, introduce una nueva contraseña',
    passwordsDoNotMatch: 'Las nuevas contraseñas no coinciden',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
    fileSizeError: 'El tamaño del archivo debe ser inferior a 800 KB',
    fileFormatError: 'JPG, GIF o PNG. Máx. 800 KB.',
    deepDive: 'Profundiza en tu rendimiento cognitivo y tendencias de enfoque.',
    selectPeriod: 'Seleccionar período',
    last7Days: 'Últimos 7 días',
    last14Days: 'Últimos 14 días',
    last30Days: 'Últimos 30 días',
    generateReport: 'Generar informe',
    noActivity: 'Sin actividad aún',
    startTracking: 'Comienza a rastrear tus sesiones de enfoque y distracciones para ver tus análisis aquí.',
    avgFocusScore: 'Puntaje de enfoque promedio',
    deepWork: 'Trabajo profundo',
    distractionTime: 'Tiempo de distracción',
    flowEfficiency: 'Eficiencia de flujo',
    weeklyFocusTrend: 'Tendencia semanal de enfoque',
    dailyFocusScore: 'Puntaje diario de enfoque vs horas de trabajo profundo',
    distractionSources: 'Fuentes de distracción',
    attentionGoes: 'A dónde va tu atención',
    peakPerformanceHours: 'Horas de máximo rendimiento',
    focusMinutesByHour: 'Minutos de enfoque por hora del día',
    aiInsights: 'Insights de IA',
    personalizedRecs: 'Recomendaciones personalizadas basadas en tus datos',
    weeklyReport: 'Informe semanal',
    exportCsv: 'Exportar CSV',
    focusTime: 'Tiempo de enfoque',
    distractions: 'Distracciones',
    focusScore: 'Puntaje de enfoque',
    totalDays: 'Días totales',
    date: 'Fecha',
    focusMin: 'Enfoque (min)',
    distractionMin: 'Distracción (min)',
    noDataAvailable: 'No hay datos disponibles.',
    showingRecentDays: 'Mostrando los últimos 7 días. Descarga el CSV para el informe completo.',
    manageSchedule: 'Administra tu horario y bloques de enfoque',
    sync: 'Sincronizar',
    newBlock: 'Nuevo bloque',
    day: 'Día',
    week: 'Semana',
    calendars: 'Calendarios',
    work: 'Trabajo',
    personal: 'Personal',
    focus: 'Enfoque',
    upcomingSessions: 'Próximas sesiones',
    close: 'Cerrar',
    editBlock: 'Editar bloque',
    title: 'Título',
    startTime: 'Hora de inicio',
    duration: 'Duración',
    tag: 'Etiqueta',
    color: 'Color',
    selectTag: 'Seleccionar etiqueta',
    selectColor: 'Seleccionar color',
    saveChanges: 'Guardar cambios',
    createBlock: 'Crear bloque',
    calendarSettings: 'Configuración del calendario',
    done: 'Hecho',
    hours: 'Horas',
    mins: 'Mins',
    eventUpdated: 'Evento actualizado',
    eventCreated: 'Evento creado',
    eventDeleted: 'Evento eliminado',
    calendarSynced: 'Calendario sincronizado',
    pleaseEnterTitle: 'Por favor, introduce un título',
    sessionCompleted: '¡Sesión de enfoque completada!',
    sessionMarkedComplete: 'Sesión marcada como completada',
    visualizeImpact: 'Visualiza el impacto financiero de las interrupciones basado en tu actividad reciente.',
    noDistractionData: 'Aún no hay datos de distracción',
    logDistractions: 'Registra algunas distracciones para ver el análisis de costos.',
    estimatedDailyLoss: 'Pérdida diaria estimada',
    configuration: 'Configuración',
    adjustParams: 'Ajusta los parámetros para estimar los costos',
    hourlyRate: 'Tarifa por hora (Prom)',
    teamSize: 'Tamaño del equipo',
    includeOverhead: 'Incluir gastos generales (20%)',
    contextSwitchPenalty: 'Penalización por cambio de contexto',
    calculationsBasedOn: 'Cálculos basados en tus últimos 7 días de actividad.',
    contextSwitches: 'Cambios de contexto',
    detectedInterruptions: 'Interrupciones detectadas (Últimos 7 días)',
    totalTimeLost: 'Tiempo total perdido (Últimos 7 días)',
    avgDailyLoss: 'Pérdida diaria prom',
    summaryLastDays: 'Resumen de los últimos {days} días',
    projectedAnnualLoss: 'Pérdida anual proyectada',
    perDayCost: 'Costo por día',
    youWereAway: 'Estuviste ausente',
    stayUpdated: 'Mantente actualizado sobre tu productividad y tareas.',
    markAllRead: 'Marcar todo como leído',
    all: 'Todo',
    unread: 'No leído',
    archived: 'Archivado',
    noNotifications: 'Sin notificaciones',
    caughtUp: '¡Estás al día! Vuelve más tarde para nuevas actualizaciones.',
    markAsRead: 'Marcar como leído',
    archive: 'Archivar',
    focusBlockerActive: 'Bloqueador de enfoque activo',
    distractionAttemptLogged: '¡Intento de distracción registrado!',
    transformTasks: 'Transforma proyectos abrumadores en micro-pasos manejables.',
    whatNeedsDone: '¿Qué hay que hacer?',
    enterTaskDetails: 'Introduce una tarea compleja y ajusta los detalles del timeboxing.',
    chunkSize: 'Tamaño del fragmento (minutos)',
    timeAvailable: 'Tiempo disponible (opcional)',
    extraContext: 'Contexto adicional (opcional)',
    generateSteps: 'Generar pasos',
    decomposing: 'Descomponiendo...',
    actionPlan: 'Plan de acción',
    totalTime: 'Tiempo total',
    analyzingComplexity: 'Analizando complejidad',
    breakingDownTask: 'Desglosando tarea en unidades atómicas...',
    startFirstSession: 'Iniciar primera sesión',
    whyThisWorks: 'Por qué funciona',
    cognitiveLoadTheory: 'Teoría de la carga cognitiva',
    cognitiveLoadDesc: 'Las tareas grandes desencadenan "parálisis por análisis". Desglosarlas reduce la carga cognitiva necesaria para empezar.',
    dopamineLoop: 'El bucle de dopamina',
    dopamineLoopDesc: 'Completar pequeños elementos crea picos frecuentes de dopamina, manteniendo el impulso y la motivación.',
    timeBoxing: 'Time Boxing',
    timeBoxingDesc: 'Fragmentos de 5 a 15 minutos encajan en los huecos de tu horario, facilitando el progreso en días ocupados.',
    proTips: 'Consejos pro',
    tipMomentum: 'Comienza con el micro-paso más fácil para crear impulso inmediato.',
    tipBreakDown: 'Si un paso aún se siente "difícil", desglosalo más hasta que parezca trivial.',
    trackProductivity: 'Rastrea la productividad y administra tareas con facilidad y conveniencia',
    tasksCompleted: 'Tareas completadas',
    productivity: 'Productividad',
  },
  ha: {
    dashboard: 'Allon lura',
    settings: 'Saituna',
    notifications: 'Sanarwa',
    calendar: 'Kalanda',
    taskDecomposer: 'Mai rarraba ayyuka',
    procrastinationAnalyzer: 'Mai nazarin jinkiri',
    analytics: 'Nazari',
    distractionCost: 'Kudin shagala',
    welcomeBack: 'Barka da dawowa',
    save: 'Ajiye',
    updatePassword: 'Sabunta kalmar sirri',
    email: 'Imel',
    name: 'Suna',
    language: 'Harshe',
    profile: 'Bayanan martaba',
    logout: 'Fita',
    cancel: 'Soke',
    delete: 'Goge',
    edit: 'Gyara',
    search: 'Bincika...',
    helpCenter: 'Cibiyar taimako',
    keyboardShortcuts: 'Gajerun hanyoyin madannai',
    giveFeedback: 'Bayar da ra\'ayi',
    admin: 'Admin',
    signedOut: 'An fita lafiya',
    languageChanged: 'An canza harshe zuwa',
    openingHelpCenter: 'Ana buɗe Cibiyar taimako...',
    feedbackThanks: 'Na gode da ra\'ayinku!',
    platform: 'Dandamali',
    tools: 'Kayan aiki',
    copyright: '© 2026 FocusFlow Inc.',
    manageAccount: 'Sarrafa saitunan asusunku da abubuwan da kuke so.',
    preferences: 'Abubuwan da aka fi so',
    focusMode: 'Yanayin mayar da hankali',
    privacy: 'Sirri',
    profileInfo: 'Bayanan martaba',
    updatePhoto: 'Sabunta hotonku da bayanan sirri.',
    avatarUrl: 'URL na Avatar (Na zaɓi)',
    upload: 'Loda',
    bio: 'Bio',
    appearance: 'Bayyanar',
    customizeLook: 'Keɓance yadda FocusFlow ke gani akan na\'urarku.',
    darkMode: 'Yanayin duhu',
    reduceEyeStrain: 'Daidaita bayyanar don rage damuwar ido.',
    compactMode: 'Yanayin ɗan karami',
    reduceSpacing: 'Rage sarari don ƙarin bayanan da yawa.',
    configureAlerts: 'Sanya yadda kuke karɓar faɗakarwa.',
    emailNotifications: 'Sanarwar Imel',
    emailNotifDesc: 'Karɓi taƙaitaccen bayani na yau da kullun da rahotanni na mako-mako.',
    pushNotifications: 'Sanarwar Tura',
    pushNotifDesc: 'Karɓi faɗakarwa na ainihi akan na\'urarku.',
    focusConfiguration: 'Saitin Yanayin Mayar da Hankali',
    focusConfigDesc: 'Sanya yanayin ku don zaman aiki mai zurfi.',
    strictMode: 'Yanayin tsayayye',
    strictModeDesc: 'Toshe duk sanarwar da ba ta da mahimmanci yayin zaman mayar da hankali.',
    blockDistractions: 'Toshe abubuwan jan hankali',
    blockDistractionsDesc: 'Hana sabbin buƙatun aiki yayin zaman mayar da hankali.',
    defaultFocusDuration: 'Tsawon lokacin mayar da hankali na asali (mintuna)',
    security: 'Tsaro',
    securityDesc: 'Sarrafa kalmar sirri da saitunan tsaro.',
    currentPassword: 'Kalmar sirri ta yanzu',
    newPassword: 'Sabuwar kalmar sirri',
    confirmPassword: 'Tabbatar da kalmar sirri',
    dangerZone: 'Yankin haɗari',
    irreversibleActions: 'Ayyukan da ba za a iya juyawa ba.',
    deleteAccount: 'Goge asusu',
    deleteAccountDesc: 'Goge asusunku da duk bayanan har abada.',
    profileUpdated: 'An sabunta bayanan martaba lafiya',
    focusPrefsSaved: 'An ajiye abubuwan da aka fi so na mayar da hankali',
    passwordUpdated: 'An sabunta kalmar sirri lafiya',
    passwordUpdateFailed: 'An kasa sabunta kalmar sirri',
    enterNewPassword: 'Don Allah shigar da sabuwar kalmar sirri',
    passwordsDoNotMatch: 'Sabbin kalmomin sirri ba su dace ba',
    passwordTooShort: 'Kalmar sirri dole ne ta kasance aƙalla haruffa 8',
    fileSizeError: 'Girman fayil dole ne ya kasance ƙasa da 800KB',
    fileFormatError: 'JPG, GIF ko PNG. Max 800KB.',
    deepDive: 'Zuryafawa cikin aikin ku na fahimi da yanayin mayar da hankali.',
    selectPeriod: 'Zaɓi lokaci',
    last7Days: 'Kwanaki 7 da suka gabata',
    last14Days: 'Kwanaki 14 da suka gabata',
    last30Days: 'Kwanaki 30 da suka gabata',
    generateReport: 'Samar da Rahoto',
    noActivity: 'Babu aiki tukuna',
    startTracking: 'Fara bin diddigin zaman mayar da hankali da abubuwan jan hankali don ganin nazarin ku anan.',
    avgFocusScore: 'Matsakaicin Makin Mayar da Hankali',
    deepWork: 'Aiki Mai Zurfi',
    distractionTime: 'Lokacin Shagala',
    flowEfficiency: 'Ingancin Gudana',
    weeklyFocusTrend: 'Yanayin Mayar da Hankali na Mako-mako',
    dailyFocusScore: 'Makin mayar da hankali na yau da kullun vs awoyi na aiki mai zurfi',
    distractionSources: 'Tushen Shagala',
    attentionGoes: 'Inda hankalin ku ke tafiya',
    peakPerformanceHours: 'Awanni na Babban Aiki',
    focusMinutesByHour: 'Mintuna na mayar da hankali ta awa na rana',
    aiInsights: 'Basirar AI',
    personalizedRecs: 'Shawarasu na musamman dangane da bayanan ku',
    weeklyReport: 'Rahoton Mako-mako',
    exportCsv: 'Fitar da CSV',
    focusTime: 'Lokacin Mayar da Hankali',
    distractions: 'Abubuwan jan hankali',
    focusScore: 'Makin Mayar da Hankali',
    totalDays: 'Jimlar Kwanaki',
    date: 'Kwana',
    focusMin: 'Mayar da hankali (min)',
    distractionMin: 'Shagala (min)',
    noDataAvailable: 'Babu bayanai.',
    showingRecentDays: 'Ana nuna kwanaki 7 na baya-bayan nan. Zazzage CSV don cikakken rahoto.',
    manageSchedule: 'Sarrafa jadawalin ku da tubalan mayar da hankali',
    sync: 'Aiki tare',
    newBlock: 'Sabon Tubali',
    day: 'Rana',
    week: 'Mako',
    calendars: 'Kalandarku',
    work: 'Aiki',
    personal: 'Na sirri',
    focus: 'Mayar da hankali',
    upcomingSessions: 'Zaman masu zuwa',
    close: 'Rufe',
    editBlock: 'Gyara Tubali',
    title: 'Taken',
    startTime: 'Lokacin Farawa',
    duration: 'Tsawon lokaci',
    tag: 'Alama',
    color: 'Launi',
    selectTag: 'Zaɓi alama',
    selectColor: 'Zaɓi launi',
    saveChanges: 'Ajiye Canje-canje',
    createBlock: 'Ƙirƙiri Tubali',
    calendarSettings: 'Saitunan Kalanda',
    done: 'Anyi',
    hours: 'Awoyi',
    mins: 'Mintuna',
    eventUpdated: 'An sabunta taron',
    eventCreated: 'An ƙirƙiri taron',
    eventDeleted: 'An goge taron',
    calendarSynced: 'An daidaita kalanda',
    pleaseEnterTitle: 'Don Allah shigar da taken',
    sessionCompleted: 'An kammala zaman mayar da hankali!',
    sessionMarkedComplete: 'An yi alama zaman a matsayin an kammala',
    visualizeImpact: 'Hango tasirin kuɗi na katsewa dangane da aikin ku na baya-bayan nan.',
    noDistractionData: 'Babu bayanan shagala tukuna',
    logDistractions: 'Shigar da wasu abubuwan jan hankali don ganin nazarin farashi.',
    estimatedDailyLoss: 'Kiyasin Asarar Kullum',
    configuration: 'Saitin',
    adjustParams: 'Daidaita sigogi don kimanta farashi',
    hourlyRate: 'Kudin awa (Matsakaici)',
    teamSize: 'Girman Ƙungiya',
    includeOverhead: 'Haɗa Kuɗin Sama (20%)',
    contextSwitchPenalty: 'Hukuncin Canjin Yanayi',
    calculationsBasedOn: 'Lissafi dangane da aikin ku na kwanaki 7 na ƙarshe.',
    contextSwitches: 'Canje-canjen Yanayi',
    detectedInterruptions: 'Katsewa da aka gano (Kwanaki 7 na ƙarshe)',
    totalTimeLost: 'Jimlar lokacin da aka rasa (Kwanaki 7 na ƙarshe)',
    avgDailyLoss: 'Matsakaicin Asarar Kullum',
    summaryLastDays: 'Takaitaccen kwanaki {days} da suka gabata',
    projectedAnnualLoss: 'Kiyasin Asarar Shekara',
    perDayCost: 'Kudin kowace rana',
    youWereAway: 'Ba ka nan',
    stayUpdated: 'Kasance da labarin yawan aiki da ayyukan ku.',
    markAllRead: 'Yi alama duka a matsayin an karanta',
    all: 'Duka',
    unread: 'Ba a karanta ba',
    archived: 'Ajiye',
    noNotifications: 'Babu sanarwa',
    caughtUp: 'Kun gama komai! Duba daga baya don sabbin abubuwa.',
    markAsRead: 'Yi alama a matsayin an karanta',
    archive: 'Ajiye',
    focusBlockerActive: 'Mai Toshe Mayar da Hankali Yana Aiki',
    distractionAttemptLogged: 'An shigar da ƙoƙarin shagala!',
    transformTasks: 'Canza manyan ayyuka zuwa ƙananan matakai masu sauƙin sarrafawa.',
    whatNeedsDone: 'Menene ya kamata a yi?',
    enterTaskDetails: 'Shigar da aiki mai wuya kuma daidaita cikakkun bayanai na lokaci.',
    chunkSize: 'Girman yanki (mintuna)',
    timeAvailable: 'Lokacin da ake da shi (na zaɓi)',
    extraContext: 'Ƙarin mahallin (na zaɓi)',
    generateSteps: 'Samar da Matakai',
    decomposing: 'Rarrabawa...',
    actionPlan: 'Shirin Aiki',
    totalTime: 'Jimlar Lokaci',
    analyzingComplexity: 'Yana nazarin wahala',
    breakingDownTask: 'Rarraba aiki zuwa sassan atomic...',
    startFirstSession: 'Fara Zama na Farko',
    whyThisWorks: 'Me yasa Wannan ke Aiki',
    cognitiveLoadTheory: 'Ka\'idar Nauyin Fahimi',
    cognitiveLoadDesc: 'Manyan ayyuka suna haifar da "shanyewar bincike". Rarraba su yana rage nauyin fahimi da ake buƙata don farawa.',
    dopamineLoop: 'Madauki na Dopamine',
    dopamineLoopDesc: 'Cike ƙananan abubuwa yana haifar da hits na dopamine akai-akai, yana kiyaye ƙarfi da kuzari.',
    timeBoxing: 'Time Boxing',
    timeBoxingDesc: 'Yankunan mintuna 5-15 sun dace da gibin jadawalin ku, yana sauƙaƙa samun ci gaba a ranakun aiki.',
    proTips: 'Nasihun Kwararru',
    tipMomentum: 'Fara da mataki mafi sauƙi don gina ƙarfi nan da nan.',
    tipBreakDown: 'Idan mataki har yanzu yana jin "wuya", rarraba shi har sai ya zama mara amfani.',
    trackProductivity: 'Bibiyar yawan aiki da sarrafa ayyuka cikin sauƙi da dacewa',
    tasksCompleted: 'Ayyukan da aka Kammala',
    productivity: 'Yawan aiki',
  },
};

export const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ha', label: 'Hausa' },
];
