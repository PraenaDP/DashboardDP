'use strict';

/* ============================================================
   Dashboard de Favoritos — app.js v2 (jerárquico)
   Aplicación vanilla JS, sin dependencias, funciona en file://
   ============================================================ */

/* ---------- Configuración ---------- */
const APP = {
  name: 'Dashboard',
  version: 12,
  // Enlace oficial del autor. Solo admite un perfil HTTPS de Ko-fi; no se expone
  // como ajuste ni se guarda dentro de los datos de cada persona. Déjalo vacío
  // durante el desarrollo y sustitúyelo por tu perfil antes de publicar.
  // Ejemplo: 'https://ko-fi.com/tu_usuario'
  supportUrl: '',
  storageKey: 'dashboard_favorites_v2',
  legacyKey: 'dashboard_favorites_v1',
  defaults: {
    settings: {
      name: 'Dashboard',
      greeting: '',
      language: 'es',
      webEngine: 'google',
      webSuggestionsEnabled: false,
      theme: 'dark',
      skin: 'default',
      quickViewMode: 'icon',
      quickSortMode: 'custom',
      quickCustomOrder: [],
      workspaceSortMode: 'custom',
      viewMode: 'grid',
      sortMode: 'custom',
      sidebarCollapsed: false,
      sidebarWidth: 240,
      sidebarAutoReveal: false,
      categorySort: 'custom',
      panelCollapsed: false,
      panelWidth: 300,
      panelExpanded: false,
      panelMode: 'default',
      panelCustomLayout: 'stack',
      panelCustomLayouts: { sidebar: 'stack', expanded: 'grid' },
      greetingVisible: true,
      greetingFont: 'neon',
      greetingSize: 19,
      panelNotesLayout: 'stack',
      backupReminderDays: 7,
      calendarAutoSyncMinutes: 30,
      taskBoardSort: 'manual',
      taskBoardDensity: 'comfortable',
      taskCalendarView: 'month',
      lastBackupAt: 0,
      lastNativeSyncAt: 0,
      // null muestra la decisión inicial. "all" integra los marcadores ya existentes;
      // "future" deja el dashboard vacío y solo incorpora los creados después.
      nativeBookmarkMode: null,
      nativeKnownBookmarkIds: [],
      nativeTrackedBookmarkIds: [],
      nativeWriteEnabled: false,
      nativeWriteFolderId: '',
      nativeWriteFolderName: ''
    }
  },
  themes: {
    default: { id: 'default', name: 'Default' },
    vercel: { id: 'vercel', name: 'Vercelin' },
    youtubin: { id: 'youtubin', name: 'Youtubin' },
    grafanin: { id: 'grafanin', name: 'Grafanin' }
  },
  engines: [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { id: 'brave', name: 'Brave', url: 'https://search.brave.com/search?q=' },
    { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' }
  ],
  categoryColors: ['#8E58D7', '#65B8FF', '#63D297', '#F5B44C', '#FF6B81', '#B084E8', '#4EC9B4', '#E88F5B'],
  seedCategories: [],
  seedBookmarks: []
};

const MAX_CUSTOM_PANEL_BLOCKS = 9;
const HOME_SORT_MODES = ['custom', 'name-asc', 'name-desc', 'recent-desc', 'recent-asc'];

/* ---------- Idioma de la interfaz ---------- */
const LANGUAGES = [
  { id: 'es', label: 'Español', locale: 'es-ES' },
  { id: 'en', label: 'English', locale: 'en-GB' },
  { id: 'ca', label: 'Català', locale: 'ca-ES' },
  { id: 'eu', label: 'Euskara', locale: 'eu-ES' },
  { id: 'de', label: 'Deutsch', locale: 'de-DE' },
  { id: 'fr', label: 'Français', locale: 'fr-FR' },
  { id: 'it', label: 'Italiano', locale: 'it-IT' },
  { id: 'pt', label: 'Português', locale: 'pt-PT' },
  { id: 'gl', label: 'Galego', locale: 'gl-ES' }
];

const UI_TEXT = {
  es: { home: 'Inicio', all: 'Todos los favoritos', pinned: 'Fijados', later: 'Para después', recent: 'Recientes', frequent: 'Más usados', categories: 'Categorías', workspaces: 'Espacios de trabajo', quick: 'Fijados y Grupos', searchBookmarks: 'Buscar favoritos…', searchWeb: 'Buscar en la web…', favorites: 'favoritos', statistics: 'Estadísticas', totalFavorites: 'Total favoritos', language: 'Idioma de la interfaz', settings: 'Ajustes', dashboardName: 'Nombre del dashboard', yourName: 'Tu nombre', searchEngine: 'Motor de búsqueda por defecto', theme: 'Tema', wallpaper: 'Fondo de pantalla', data: 'Datos', save: 'Guardar', cancel: 'Cancelar', morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches', browserSynced: 'Marcadores del navegador: sincronizados a las {time}', browserFuture: 'Marcadores del navegador: se añadirán los que guardes a partir de ahora', browserPreparing: 'Marcadores del navegador: preparando sincronización…' },
  en: { home: 'Home', all: 'All bookmarks', pinned: 'Pinned', later: 'Read later', recent: 'Recent', frequent: 'Most used', categories: 'Categories', workspaces: 'Workspaces', quick: 'Pinned & Groups', searchBookmarks: 'Search bookmarks…', searchWeb: 'Search the web…', favorites: 'bookmarks', statistics: 'Statistics', totalFavorites: 'Total bookmarks', language: 'Interface language', settings: 'Settings', dashboardName: 'Dashboard name', yourName: 'Your name', searchEngine: 'Default search engine', theme: 'Theme', wallpaper: 'Wallpaper', data: 'Data', save: 'Save', cancel: 'Cancel', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', browserSynced: 'Browser bookmarks: synced at {time}', browserFuture: 'Browser bookmarks: new bookmarks will be added automatically', browserPreparing: 'Browser bookmarks: preparing sync…' },
  ca: { home: 'Inici', all: 'Tots els favorits', pinned: 'Fixats', later: 'Per més tard', recent: 'Recents', frequent: 'Més utilitzats', categories: 'Categories', workspaces: 'Espais de treball', quick: 'Fixats i Grups', searchBookmarks: 'Cerca favorits…', searchWeb: 'Cerca al web…', favorites: 'favorits', statistics: 'Estadístiques', totalFavorites: 'Total de favorits', language: 'Idioma de la interfície', settings: 'Configuració', dashboardName: 'Nom del dashboard', yourName: 'El teu nom', searchEngine: 'Motor de cerca predeterminat', theme: 'Tema', wallpaper: 'Fons de pantalla', data: 'Dades', save: 'Desa', cancel: 'Cancel·la', morning: 'Bon dia', afternoon: 'Bona tarda', evening: 'Bona nit', browserSynced: 'Marcadors del navegador: sincronitzats a les {time}', browserFuture: "Marcadors del navegador: s'afegiran els nous automàticament", browserPreparing: 'Marcadors del navegador: preparant la sincronització…' },
  eu: { home: 'Hasiera', all: 'Laster-marko guztiak', pinned: 'Finkatuak', later: 'Geroago irakurtzeko', recent: 'Azkenak', frequent: 'Erabilienak', categories: 'Kategoriak', workspaces: 'Lan-eremuak', quick: 'Finkatuak eta taldeak', searchBookmarks: 'Bilatu laster-markoak…', searchWeb: 'Bilatu webean…', favorites: 'laster-marko', statistics: 'Estatistikak', totalFavorites: 'Laster-markoak guztira', language: 'Interfazearen hizkuntza', settings: 'Ezarpenak', dashboardName: 'Dashboardaren izena', yourName: 'Zure izena', searchEngine: 'Lehenetsitako bilatzailea', theme: 'Gaia', wallpaper: 'Horma-papera', data: 'Datuak', save: 'Gorde', cancel: 'Utzi', morning: 'Egun on', afternoon: 'Arratsalde on', evening: 'Gabon', browserSynced: 'Nabigatzaileko laster-markoak: {time}(e)an sinkronizatuta', browserFuture: 'Nabigatzaileko laster-marka berriak automatikoki gehituko dira', browserPreparing: 'Nabigatzaileko laster-markoak: sinkronizazioa prestatzen…' },
  de: { home: 'Startseite', all: 'Alle Lesezeichen', pinned: 'Angeheftet', later: 'Später lesen', recent: 'Zuletzt verwendet', frequent: 'Am häufigsten verwendet', categories: 'Kategorien', workspaces: 'Arbeitsbereiche', quick: 'Angeheftet und Gruppen', searchBookmarks: 'Lesezeichen suchen…', searchWeb: 'Im Web suchen…', favorites: 'Lesezeichen', statistics: 'Statistiken', totalFavorites: 'Lesezeichen gesamt', language: 'Sprache der Oberfläche', settings: 'Einstellungen', dashboardName: 'Name des Dashboards', yourName: 'Dein Name', searchEngine: 'Standardsuchmaschine', theme: 'Design', wallpaper: 'Hintergrundbild', data: 'Daten', save: 'Speichern', cancel: 'Abbrechen', morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend', browserSynced: 'Browser-Lesezeichen: synchronisiert um {time}', browserFuture: 'Browser-Lesezeichen: neue Lesezeichen werden automatisch hinzugefügt', browserPreparing: 'Browser-Lesezeichen: Synchronisierung wird vorbereitet…' },
  fr: { home: 'Accueil', all: 'Tous les favoris', pinned: 'Épinglés', later: 'À lire plus tard', recent: 'Récents', frequent: 'Les plus utilisés', categories: 'Catégories', workspaces: 'Espaces de travail', quick: 'Épinglés et groupes', searchBookmarks: 'Rechercher des favoris…', searchWeb: 'Rechercher sur le Web…', favorites: 'favoris', statistics: 'Statistiques', totalFavorites: 'Total des favoris', language: 'Langue de l’interface', settings: 'Paramètres', dashboardName: 'Nom du dashboard', yourName: 'Votre nom', searchEngine: 'Moteur de recherche par défaut', theme: 'Thème', wallpaper: 'Fond d’écran', data: 'Données', save: 'Enregistrer', cancel: 'Annuler', morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir', browserSynced: 'Favoris du navigateur : synchronisés à {time}', browserFuture: 'Favoris du navigateur : les nouveaux seront ajoutés automatiquement', browserPreparing: 'Favoris du navigateur : préparation de la synchronisation…' },
  it: { home: 'Home', all: 'Tutti i preferiti', pinned: 'Fissati', later: 'Da leggere dopo', recent: 'Recenti', frequent: 'Più usati', categories: 'Categorie', workspaces: 'Spazi di lavoro', quick: 'Fissati e gruppi', searchBookmarks: 'Cerca preferiti…', searchWeb: 'Cerca sul web…', favorites: 'preferiti', statistics: 'Statistiche', totalFavorites: 'Preferiti totali', language: 'Lingua dell’interfaccia', settings: 'Impostazioni', dashboardName: 'Nome del dashboard', yourName: 'Il tuo nome', searchEngine: 'Motore di ricerca predefinito', theme: 'Tema', wallpaper: 'Sfondo', data: 'Dati', save: 'Salva', cancel: 'Annulla', morning: 'Buongiorno', afternoon: 'Buon pomeriggio', evening: 'Buonasera', browserSynced: 'Preferiti del browser: sincronizzati alle {time}', browserFuture: 'Preferiti del browser: i nuovi preferiti verranno aggiunti automaticamente', browserPreparing: 'Preferiti del browser: preparazione della sincronizzazione…' },
  pt: { home: 'Início', all: 'Todos os favoritos', pinned: 'Fixados', later: 'Ler mais tarde', recent: 'Recentes', frequent: 'Mais usados', categories: 'Categorias', workspaces: 'Espaços de trabalho', quick: 'Fixados e grupos', searchBookmarks: 'Pesquisar favoritos…', searchWeb: 'Pesquisar na web…', favorites: 'favoritos', statistics: 'Estatísticas', totalFavorites: 'Total de favoritos', language: 'Idioma da interface', settings: 'Definições', dashboardName: 'Nome do dashboard', yourName: 'O teu nome', searchEngine: 'Motor de pesquisa predefinido', theme: 'Tema', wallpaper: 'Papel de parede', data: 'Dados', save: 'Guardar', cancel: 'Cancelar', morning: 'Bom dia', afternoon: 'Boa tarde', evening: 'Boa noite', browserSynced: 'Favoritos do navegador: sincronizados às {time}', browserFuture: 'Favoritos do navegador: novos favoritos serão adicionados automaticamente', browserPreparing: 'Favoritos do navegador: a preparar sincronização…' },
  gl: { home: 'Inicio', all: 'Todos os favoritos', pinned: 'Fixados', later: 'Para máis tarde', recent: 'Recentes', frequent: 'Máis usados', categories: 'Categorías', workspaces: 'Espazos de traballo', quick: 'Fixados e grupos', searchBookmarks: 'Buscar favoritos…', searchWeb: 'Buscar na web…', favorites: 'favoritos', statistics: 'Estatísticas', totalFavorites: 'Total de favoritos', language: 'Idioma da interface', settings: 'Axustes', dashboardName: 'Nome do dashboard', yourName: 'O teu nome', searchEngine: 'Motor de busca predeterminado', theme: 'Tema', wallpaper: 'Fondo de pantalla', data: 'Datos', save: 'Gardar', cancel: 'Cancelar', morning: 'Bos días', afternoon: 'Boas tardes', evening: 'Boas noites', browserSynced: 'Marcadores do navegador: sincronizados ás {time}', browserFuture: 'Marcadores do navegador: engadiranse automaticamente os novos', browserPreparing: 'Marcadores do navegador: preparando a sincronización…' }
};

// Textos cortos reutilizados por botones, widgets y menús. Así, los elementos
// que se crean después de cargar la página se traducen igual que la interfaz base.
const UI_COMMON = {
  navigation: ['Navegación', 'Navigation', 'Navegació', 'Nabigazioa', 'Navigation', 'Navigation', 'Navigazione', 'Navegação', 'Navegación'],
  widgets: ['Widgets', 'Widgets', 'Ginys', 'Widgetak', 'Widgets', 'Widgets', 'Widget', 'Widgets', 'Widgets'],
  addBookmark: ['Añadir favorito', 'Add bookmark', 'Afegeix favorit', 'Gehitu laster-marka', 'Lesezeichen hinzufügen', 'Ajouter un favori', 'Aggiungi preferito', 'Adicionar favorito', 'Engadir favorito'],
  editMode: ['Modo edición', 'Edit mode', 'Mode d’edició', 'Edizio modua', 'Bearbeitungsmodus', 'Mode édition', 'Modalità modifica', 'Modo de edição', 'Modo edición'],
  enableEditMode: ['Activar modo edición', 'Enable edit mode', 'Activa el mode d’edició', 'Aktibatu edizio modua', 'Bearbeitungsmodus aktivieren', 'Activer le mode édition', 'Attiva modalità modifica', 'Ativar modo de edição', 'Activar modo edición'],
  finishEditMode: ['Terminar modo edición', 'Finish edit mode', 'Finalitza el mode d’edició', 'Amaitu edizio modua', 'Bearbeitungsmodus beenden', 'Terminer le mode édition', 'Termina modalità modifica', 'Terminar modo de edição', 'Rematar modo edición'],
  toggleSidebar: ['Alternar barra lateral', 'Toggle sidebar', 'Commuta la barra lateral', 'Aldatu alboko barra', 'Seitenleiste umschalten', 'Basculer la barre latérale', 'Attiva/disattiva barra laterale', 'Alternar barra lateral', 'Alternar barra lateral'],
  resizeSidebar: ['Cambiar ancho de la barra lateral', 'Resize sidebar', 'Canviar l’amplada de la barra lateral', 'Alboko barraren zabalera aldatu', 'Seitenleistenbreite ändern', 'Redimensionner la barre latérale', 'Ridimensiona barra laterale', 'Redimensionar barra lateral', 'Cambiar o ancho da barra lateral'],
  sidebarBehavior: ['Comportamiento de la barra lateral', 'Sidebar behaviour', 'Comportament de la barra lateral', 'Alboko barraren portaera', 'Verhalten der Seitenleiste', 'Comportement de la barre latérale', 'Comportamento della barra laterale', 'Comportamento da barra lateral', 'Comportamento da barra lateral'],
  sidebarAutoReveal: ['Abrir automáticamente al acercar el ratón', 'Open automatically when the pointer reaches the edge', 'Obrir automàticament en apropar el ratolí', 'Ireki automatikoki sagua ertzera hurbiltzean', 'Beim Annähern der Maus automatisch öffnen', 'Ouvrir automatiquement à l’approche de la souris', 'Apri automaticamente avvicinando il mouse', 'Abrir automaticamente ao aproximar o rato', 'Abrir automaticamente ao achegar o rato'],
  sidebarAutoRevealHelp: ['Al estar contraída, se abre al acercar el ratón al borde izquierdo y se vuelve a ocultar al salir.', 'When collapsed, it opens as the pointer reaches the left edge and hides again when you move away.', 'Quan és replegada, s’obre en apropar el ratolí a la vora esquerra i es torna a ocultar en sortir.', 'Tolestuta dagoenean, ezkerreko ertzera sagua hurbiltzean irekitzen da eta urruntzean berriro ezkutatzen da.', 'Wenn sie eingeklappt ist, öffnet sie sich an der linken Kante und wird beim Wegbewegen wieder ausgeblendet.', 'Lorsqu’elle est repliée, elle s’ouvre au bord gauche et se masque à nouveau quand vous éloignez la souris.', 'Quando è chiusa, si apre avvicinando il mouse al bordo sinistro e si nasconde di nuovo allontanandolo.', 'Quando está recolhida, abre ao aproximar o rato da margem esquerda e volta a ocultar-se ao sair.', 'Cando está contraída, ábrese ao achegar o rato ao bordo esquerdo e volve ocultarse ao saír.'],
  expandPanel: ['Abrir vista amplia', 'Open wide view', 'Obrir vista ampla', 'Ireki ikuspegi zabala', 'Breite Ansicht öffnen', 'Ouvrir la vue large', 'Apri visualizzazione ampia', 'Abrir vista ampla', 'Abrir vista ampla'],
  restorePanel: ['Restaurar tamaño del panel', 'Restore panel size', 'Restaurar la mida del panell', 'Leheneratu panelaren tamaina', 'Panelgröße wiederherstellen', 'Restaurer la taille du panneau', 'Ripristina dimensione pannello', 'Restaurar tamanho do painel', 'Restaurar tamaño do panel'],
  resetMasonry: ['Restablecer mosaico', 'Reset mosaic', 'Restableix el mosaic', 'Berrezarri mosaikoa', 'Mosaik zurücksetzen', 'Réinitialiser la mosaïque', 'Reimposta mosaico', 'Repor mosaico', 'Restablecer mosaico'],
  lightMode: ['Cambiar a modo claro', 'Switch to light mode', 'Canvia al mode clar', 'Aldatu modu argira', 'Zum hellen Modus wechseln', 'Passer au mode clair', 'Passa alla modalità chiara', 'Mudar para modo claro', 'Cambiar ao modo claro'],
  darkMode: ['Cambiar a modo oscuro', 'Switch to dark mode', 'Canvia al mode fosc', 'Aldatu modu ilunera', 'Zum dunklen Modus wechseln', 'Passer au mode sombre', 'Passa alla modalità scura', 'Mudar para modo escuro', 'Cambiar ao modo escuro'],
  addCategory: ['Añadir categoría', 'Add category', 'Afegeix categoria', 'Gehitu kategoria', 'Kategorie hinzufügen', 'Ajouter une catégorie', 'Aggiungi categoria', 'Adicionar categoria', 'Engadir categoría'],
  collapseCategories: ['Contraer todas las categorías', 'Collapse all categories', 'Replega totes les categories', 'Tolestu kategoria guztiak', 'Alle Kategorien einklappen', 'Réduire toutes les catégories', 'Comprimi tutte le categorie', 'Recolher todas as categorias', 'Contraer todas as categorías'],
  search: ['Buscar', 'Search', 'Cerca', 'Bilatu', 'Suchen', 'Rechercher', 'Cerca', 'Pesquisar', 'Buscar'],
  webSuggestions: ['Sugerencias de búsqueda web', 'Web search suggestions', 'Suggeriments de cerca web', 'Webeko bilaketa-iradokizunak', 'Websuchvorschläge', 'Suggestions de recherche Web', 'Suggerimenti di ricerca sul Web', 'Sugestões de pesquisa na Web', 'Suxestións de busca web'],
  webSuggestionsHelp: ['Muestra propuestas mientras escribes. Al activarlo, solo el texto de la consulta se envía al buscador elegido; DashboardDP no lo guarda ni usa un servidor propio.', 'Shows suggestions while you type. When enabled, only your query text is sent to the selected search engine; DashboardDP does not store it or use its own server.', 'Mostra propostes mentre escrius. En activar-ho, només el text de la consulta s’envia al cercador triat; DashboardDP no el desa ni usa un servidor propi.', 'Idazten duzun bitartean iradokizunak erakusten ditu. Aktibatzean, kontsultaren testua bakarrik bidaltzen zaio aukeratutako bilatzaileari; DashboardDPk ez du gordetzen ezta zerbitzari propiorik erabiltzen ere.', 'Zeigt Vorschläge während der Eingabe. Nach dem Aktivieren wird nur der Suchtext an die gewählte Suchmaschine gesendet; DashboardDP speichert ihn nicht und nutzt keinen eigenen Server.', 'Affiche des suggestions pendant la saisie. Une fois activé, seul le texte de la recherche est envoyé au moteur choisi ; DashboardDP ne le conserve pas et n’utilise pas de serveur propre.', 'Mostra suggerimenti durante la digitazione. Se attivato, solo il testo della ricerca viene inviato al motore scelto; DashboardDP non lo salva e non usa un proprio server.', 'Mostra sugestões enquanto escreve. Ao ativar, apenas o texto da pesquisa é enviado ao motor escolhido; o DashboardDP não o guarda nem usa um servidor próprio.', 'Mostra suxestións mentres escribes. Ao activalo, só se envía o texto da consulta ao buscador escollido; DashboardDP non o garda nin usa un servidor propio.'],
  webSuggestionsPermissionDenied: ['No se concedió permiso para las sugerencias de {engine}. Puedes volver a activarlas en Ajustes cuando quieras.', 'Permission for {engine} suggestions was not granted. You can enable them again in Settings whenever you want.', 'No s’ha concedit permís per als suggeriments de {engine}. Pots activar-los de nou a Configuració quan vulguis.', 'Ez da {engine} iradokizunetarako baimenik eman. Nahi duzunean berriro gaitu ditzakezu Ezarpenetan.', 'Die Berechtigung für Vorschläge von {engine} wurde nicht erteilt. Du kannst sie jederzeit in den Einstellungen wieder aktivieren.', 'L’autorisation pour les suggestions de {engine} n’a pas été accordée. Vous pouvez les réactiver dans les Paramètres à tout moment.', 'L’autorizzazione per i suggerimenti di {engine} non è stata concessa. Puoi riattivarli nelle Impostazioni quando vuoi.', 'A permissão para as sugestões do {engine} não foi concedida. Pode voltar a ativá-las nas Definições quando quiser.', 'Non se concedeu permiso para as suxestións de {engine}. Podes activalas de novo en Axustes cando queiras.'],
  webSuggestionsEnableHint: ['Activa las sugerencias web en Ajustes para recibir propuestas de {engine}.', 'Enable web suggestions in Settings to receive suggestions from {engine}.', 'Activa els suggeriments web a Configuració per rebre propostes de {engine}.', 'Aktibatu webeko iradokizunak Ezarpenetan {engine}(e)ko proposamenak jasotzeko.', 'Aktiviere Websuchvorschläge in den Einstellungen, um Vorschläge von {engine} zu erhalten.', 'Activez les suggestions Web dans les Paramètres pour recevoir les propositions de {engine}.', 'Attiva i suggerimenti Web nelle Impostazioni per ricevere proposte da {engine}.', 'Ative as sugestões Web nas Definições para receber sugestões do {engine}.', 'Activa as suxestións web en Axustes para recibir propostas de {engine}.'],
  webSuggestionsAllowHint: ['Haz clic para permitir las sugerencias de {engine}.', 'Click to allow suggestions from {engine}.', 'Fes clic per permetre els suggeriments de {engine}.', 'Egin klik {engine}(e)ko iradokizunak baimentzeko.', 'Klicke, um Vorschläge von {engine} zu erlauben.', 'Cliquez pour autoriser les suggestions de {engine}.', 'Fai clic per consentire i suggerimenti di {engine}.', 'Clique para permitir as sugestões do {engine}.', 'Fai clic para permitir as suxestións de {engine}.'],
  edit: ['Editar', 'Edit', 'Edita', 'Editatu', 'Bearbeiten', 'Modifier', 'Modifica', 'Editar', 'Editar'],
  delete: ['Eliminar', 'Delete', 'Suprimeix', 'Ezabatu', 'Löschen', 'Supprimer', 'Elimina', 'Eliminar', 'Eliminar'],
  add: ['Añadir', 'Add', 'Afegeix', 'Gehitu', 'Hinzufügen', 'Ajouter', 'Aggiungi', 'Adicionar', 'Engadir'],
  create: ['Crear', 'Create', 'Crea', 'Sortu', 'Erstellen', 'Créer', 'Crea', 'Criar', 'Crear'],
  close: ['Cerrar', 'Close', 'Tanca', 'Itxi', 'Schließen', 'Fermer', 'Chiudi', 'Fechar', 'Pechar'],
  options: ['Opciones', 'Options', 'Opcions', 'Aukerak', 'Optionen', 'Options', 'Opzioni', 'Opções', 'Opcións'],
  pin: ['Fijar', 'Pin', 'Fixa', 'Finkatu', 'Anheften', 'Épingler', 'Fissa', 'Fixar', 'Fixar'],
  unpin: ['Desfijar', 'Unpin', 'Desfixa', 'Kendu finkapena', 'Lösen', 'Désépingler', 'Sblocca', 'Desafixar', 'Desfixar'],
  player: ['Reproductor', 'Player', 'Reproductor', 'Erreproduzitzailea', 'Player', 'Lecteur', 'Lettore', 'Reprodutor', 'Reprodutor'],
  weather: ['Clima', 'Weather', 'Temps', 'Eguraldia', 'Wetter', 'Météo', 'Meteo', 'Tempo', 'Tempo'],
  calendar: ['Calendario', 'Calendar', 'Calendari', 'Egutegia', 'Kalender', 'Calendrier', 'Calendario', 'Calendário', 'Calendario'],
  taskManager: ['Gestor de tareas', 'Task manager', 'Gestor de tasques', 'Zereginen kudeatzailea', 'Aufgabenverwaltung', 'Gestionnaire de tâches', 'Gestore attività', 'Gestor de tarefas', 'Xestor de tarefas'],
  braveShortcuts: ['Atajos de Brave', 'Brave shortcuts', 'Dreceres de Brave', 'Brave lasterbideak', 'Brave-Verknüpfungen', 'Raccourcis Brave', 'Scorciatoie Brave', 'Atalhos do Brave', 'Atallos de Brave'],
  firefoxShortcuts: ['Atajos de Firefox', 'Firefox shortcuts', 'Dreceres de Firefox', 'Firefox lasterbideak', 'Firefox-Verknüpfungen', 'Raccourcis Firefox', 'Scorciatoie Firefox', 'Atalhos do Firefox', 'Atallos de Firefox'],
  chromeShortcuts: ['Atajos de Google Chrome', 'Google Chrome shortcuts', 'Dreceres de Google Chrome', 'Google Chrome lasterbideak', 'Google-Chrome-Verknüpfungen', 'Raccourcis Google Chrome', 'Scorciatoie Google Chrome', 'Atalhos do Google Chrome', 'Atallos de Google Chrome'],
  edgeShortcuts: ['Atajos de Microsoft Edge', 'Microsoft Edge shortcuts', 'Dreceres de Microsoft Edge', 'Microsoft Edge lasterbideak', 'Microsoft-Edge-Verknüpfungen', 'Raccourcis Microsoft Edge', 'Scorciatoie Microsoft Edge', 'Atalhos do Microsoft Edge', 'Atallos de Microsoft Edge'],
  windowsShortcuts: ['Atajos de Windows', 'Windows shortcuts', 'Dreceres de Windows', 'Windows lasterbideak', 'Windows-Verknüpfungen', 'Raccourcis Windows', 'Scorciatoie Windows', 'Atalhos do Windows', 'Atallos de Windows'],
  linuxCommands: ['Comandos de Linux', 'Linux commands', 'Ordres de Linux', 'Linux komandoak', 'Linux-Befehle', 'Commandes Linux', 'Comandi Linux', 'Comandos Linux', 'Comandos de Linux'],
  noSong: ['Ninguna canción', 'No song selected', 'Cap cançó', 'Abestirik ez', 'Kein Titel ausgewählt', 'Aucun morceau sélectionné', 'Nessun brano selezionato', 'Nenhuma música selecionada', 'Ningunha canción seleccionada'],
  playerHelp: ['Reproduce audio local o una carpeta con varias canciones', 'Play local audio or a folder with several tracks', 'Reprodueix àudio local o una carpeta amb diverses cançons', 'Erreproduzitu audio lokala edo hainbat abestidun karpeta', 'Lokale Audiodatei oder einen Ordner mit mehreren Titeln abspielen', 'Lire un fichier audio local ou un dossier de morceaux', 'Riproduci audio locale o una cartella con più brani', 'Reproduza áudio local ou uma pasta com várias músicas', 'Reproduce audio local ou un cartafol con varias cancións'],
  previous: ['Anterior', 'Previous', 'Anterior', 'Aurrekoa', 'Zurück', 'Précédent', 'Precedente', 'Anterior', 'Anterior'],
  play: ['Reproducir', 'Play', 'Reprodueix', 'Erreproduzitu', 'Wiedergabe', 'Lire', 'Riproduci', 'Reproduzir', 'Reproducir'],
  next: ['Siguiente', 'Next', 'Següent', 'Hurrengoa', 'Weiter', 'Suivant', 'Successivo', 'Seguinte', 'Seguinte'],
  progress: ['Progreso', 'Progress', 'Progrés', 'Aurrerapena', 'Fortschritt', 'Progression', 'Avanzamento', 'Progresso', 'Progreso'],
  localAudio: ['Audio local', 'Local audio', 'Àudio local', 'Audio lokala', 'Lokale Audiodatei', 'Audio local', 'Audio locale', 'Áudio local', 'Audio local'],
  folder: ['Carpeta', 'Folder', 'Carpeta', 'Karpeta', 'Ordner', 'Dossier', 'Cartella', 'Pasta', 'Cartafol'],
  playFolder: ['Reproducir una carpeta completa', 'Play an entire folder', 'Reprodueix una carpeta sencera', 'Erreproduzitu karpeta osoa', 'Einen ganzen Ordner abspielen', 'Lire un dossier entier', 'Riproduci un’intera cartella', 'Reproduzir uma pasta completa', 'Reproducir un cartafol completo'],
  loadingWeather: ['Cargando clima…', 'Loading weather…', 'Carregant el temps…', 'Eguraldia kargatzen…', 'Wetter wird geladen…', 'Chargement de la météo…', 'Caricamento meteo…', 'A carregar meteorologia…', 'Cargando o tempo…'],
  previousMonth: ['Mes anterior', 'Previous month', 'Mes anterior', 'Aurreko hilabetea', 'Vorheriger Monat', 'Mois précédent', 'Mese precedente', 'Mês anterior', 'Mes anterior'],
  nextMonth: ['Mes siguiente', 'Next month', 'Mes següent', 'Hurrengo hilabetea', 'Nächster Monat', 'Mois suivant', 'Mese successivo', 'Mês seguinte', 'Mes seguinte'],
  hidePanel: ['Ocultar panel lateral', 'Hide side panel', 'Amaga el panell lateral', 'Ezkutatu alboko panela', 'Seitenleiste ausblenden', 'Masquer le panneau latéral', 'Nascondi pannello laterale', 'Ocultar painel lateral', 'Ocultar panel lateral'],
  noCategory: ['Sin categoría', 'Uncategorized', 'Sense categoria', 'Kategoriarik gabe', 'Ohne Kategorie', 'Sans catégorie', 'Senza categoria', 'Sem categoria', 'Sen categoría'],
  pending: ['Pendiente', 'Pending', 'Pendent', 'Zain', 'Ausstehend', 'En attente', 'In sospeso', 'Pendente', 'Pendente'],
  noActivity: ['Aún no hay actividad', 'No activity yet', 'Encara no hi ha activitat', 'Oraindik ez dago jarduerarik', 'Noch keine Aktivität', 'Aucune activité pour le moment', 'Nessuna attività ancora', 'Ainda não há atividade', 'Aínda non hai actividade'],
  locatingWeather: ['Buscando tu ubicación…', 'Finding your location…', 'Cercant la teva ubicació…', 'Zure kokapena bilatzen…', 'Standort wird ermittelt…', 'Recherche de votre position…', 'Ricerca della posizione…', 'A procurar a tua localização…', 'Buscando a túa localización…'],
  weatherUnavailable: ['No se pudo obtener el clima.', 'Weather could not be retrieved.', 'No s’ha pogut obtenir el temps.', 'Ezin izan da eguraldia eskuratu.', 'Wetterdaten konnten nicht abgerufen werden.', 'Impossible de récupérer la météo.', 'Impossibile recuperare il meteo.', 'Não foi possível obter a meteorologia.', 'Non se puido obter o tempo.'],
  locationUnavailable: ['No se pudo obtener tu ubicación. Introduce una ciudad:', 'Your location could not be retrieved. Enter a city:', 'No s’ha pogut obtenir la teva ubicació. Introdueix una ciutat:', 'Ezin izan da zure kokapena eskuratu. Sartu hiri bat:', 'Ihr Standort konnte nicht ermittelt werden. Geben Sie eine Stadt ein:', 'Impossible de récupérer votre position. Saisissez une ville :', 'Impossibile recuperare la posizione. Inserisci una città:', 'Não foi possível obter a tua localização. Introduz uma cidade:', 'Non se puido obter a túa localización. Introduce unha cidade:'],
  searchCity: ['Buscar ciudad', 'Search city', 'Cerca ciutat', 'Bilatu hiria', 'Stadt suchen', 'Rechercher une ville', 'Cerca città', 'Pesquisar cidade', 'Buscar cidade'],
  cityNotFound: ['No se encontró la ciudad.', 'City not found.', 'No s’ha trobat la ciutat.', 'Ez da hiria aurkitu.', 'Stadt nicht gefunden.', 'Ville introuvable.', 'Città non trovata.', 'Cidade não encontrada.', 'Non se atopou a cidade.'],
  feelsLike: ['Sensación', 'Feels like', 'Sensació', 'Sentsazioa', 'Gefühlt', 'Ressenti', 'Percepita', 'Sensação', 'Sensación'],
  humidity: ['Humedad', 'Humidity', 'Humitat', 'Hezetasuna', 'Luftfeuchtigkeit', 'Humidité', 'Umidità', 'Humidade', 'Humidade'],
  wind: ['Viento', 'Wind', 'Vent', 'Haizea', 'Wind', 'Vent', 'Vento', 'Vento', 'Vento'],
  yourLocation: ['Tu ubicación', 'Your location', 'La teva ubicació', 'Zure kokapena', 'Ihr Standort', 'Votre position', 'La tua posizione', 'A tua localização', 'A túa localización'],
  icons: ['Iconos', 'Icons', 'Icones', 'Ikonoak', 'Symbole', 'Icônes', 'Icone', 'Ícones', 'Iconas'],
  list: ['Lista', 'List', 'Llista', 'Zerrenda', 'Liste', 'Liste', 'Elenco', 'Lista', 'Lista'],
  cards: ['Flashcards', 'Cards', 'Targetes', 'Txartelak', 'Karten', 'Cartes', 'Schede', 'Cartões', 'Tarxetas'],
  viewCards: ['Vista tarjetas', 'Card view', 'Vista de targetes', 'Txartel-ikuspegia', 'Kartenansicht', 'Vue cartes', 'Vista schede', 'Vista de cartões', 'Vista de tarxetas'],
  viewList: ['Vista lista', 'List view', 'Vista de llista', 'Zerrenda-ikuspegia', 'Listenansicht', 'Vue liste', 'Vista elenco', 'Vista de lista', 'Vista de lista'],
  viewIcons: ['Vista iconos', 'Icon view', 'Vista d’icones', 'Ikono-ikuspegia', 'Symbolansicht', 'Vue icônes', 'Vista icone', 'Vista de ícones', 'Vista de iconas'],
  copyRow: ['Pulsa una fila para copiarla', 'Click a row to copy it', 'Prem una fila per copiar-la', 'Egin klik lerro batean kopiatzeko', 'Klicke auf eine Zeile zum Kopieren', 'Cliquez sur une ligne pour la copier', 'Fai clic su una riga per copiarla', 'Clique numa linha para copiá-la', 'Preme nunha fila para copiala'],
  tabsWindows: ['Pestañas y ventanas', 'Tabs and windows', 'Pestanyes i finestres', 'Fitxak eta leihoak', 'Tabs und Fenster', 'Onglets et fenêtres', 'Schede e finestre', 'Separadores e janelas', 'Pestanas e ventás'],
  addressSearch: ['Barra de direcciones y búsqueda', 'Address bar and search', 'Barra d’adreces i cerca', 'Helbide-barra eta bilaketa', 'Adressleiste und Suche', 'Barre d’adresse et recherche', 'Barra degli indirizzi e ricerca', 'Barra de endereços e pesquisa', 'Barra de enderezos e busca'],
  historyBookmarks: ['Historial y marcadores', 'History and bookmarks', 'Historial i marcadors', 'Historia eta laster-markoak', 'Verlauf und Lesezeichen', 'Historique et favoris', 'Cronologia e preferiti', 'Histórico e favoritos', 'Historial e marcadores'],
  newTab: ['Nueva pestaña', 'New tab', 'Pestanya nova', 'Fitxa berria', 'Neuer Tab', 'Nouvel onglet', 'Nuova scheda', 'Novo separador', 'Nova pestana'],
  closeTab: ['Cerrar pestaña', 'Close tab', 'Tanca la pestanya', 'Itxi fitxa', 'Tab schließen', 'Fermer l’onglet', 'Chiudi scheda', 'Fechar separador', 'Pechar pestana'],
  nextTab: ['Siguiente pestaña', 'Next tab', 'Pestanya següent', 'Hurrengo fitxa', 'Nächster Tab', 'Onglet suivant', 'Scheda successiva', 'Separador seguinte', 'Pestana seguinte'],
  previousTab: ['Pestaña anterior', 'Previous tab', 'Pestanya anterior', 'Aurreko fitxa', 'Vorheriger Tab', 'Onglet précédent', 'Scheda precedente', 'Separador anterior', 'Pestana anterior'],
  newWindow: ['Nueva ventana', 'New window', 'Finestra nova', 'Leiho berria', 'Neues Fenster', 'Nouvelle fenêtre', 'Nuova finestra', 'Nova janela', 'Nova ventá'],
  back: ['Atrás', 'Back', 'Enrere', 'Atzera', 'Zurück', 'Précédent', 'Indietro', 'Voltar', 'Atrás'],
  forward: ['Adelante', 'Forward', 'Endavant', 'Aurrera', 'Vorwärts', 'Suivant', 'Avanti', 'Avançar', 'Adiante'],
  reload: ['Recargar', 'Reload', 'Recarrega', 'Berriz kargatu', 'Neu laden', 'Actualiser', 'Ricarica', 'Recarregar', 'Recargar'],
  homepage: ['Página de inicio', 'Home page', 'Pàgina d’inici', 'Hasierako orria', 'Startseite', 'Page d’accueil', 'Pagina iniziale', 'Página inicial', 'Páxina de inicio'],
  fullscreen: ['Pantalla completa', 'Full screen', 'Pantalla completa', 'Pantaila osoa', 'Vollbild', 'Plein écran', 'Schermo intero', 'Ecrã inteiro', 'Pantalla completa'],
  history: ['Historial', 'History', 'Historial', 'Historia', 'Verlauf', 'Historique', 'Cronologia', 'Histórico', 'Historial'],
  downloads: ['Descargas', 'Downloads', 'Baixades', 'Deskargak', 'Downloads', 'Téléchargements', 'Download', 'Transferências', 'Descargas'],
  zoom: ['Zoom', 'Zoom', 'Zoom', 'Zooma', 'Zoom', 'Zoom', 'Zoom', 'Zoom', 'Zoom'],
  print: ['Imprimir', 'Print', 'Imprimeix', 'Inprimatu', 'Drucken', 'Imprimer', 'Stampa', 'Imprimir', 'Imprimir'],
  savePage: ['Guardar página', 'Save page', 'Desa la pàgina', 'Gorde orria', 'Seite speichern', 'Enregistrer la page', 'Salva pagina', 'Guardar página', 'Gardar páxina'],
  trackPosition: ['{current} de {total} · {size}', '{current} of {total} · {size}', '{current} de {total} · {size}', '{current}/{total} · {size}', '{current} von {total} · {size}', '{current} sur {total} · {size}', '{current} di {total} · {size}', '{current} de {total} · {size}', '{current} de {total} · {size}'],
  playlist: ['Lista de reproducción', 'Playlist', 'Llista de reproducció', 'Erreprodukzio-zerrenda', 'Wiedergabeliste', 'Liste de lecture', 'Playlist', 'Lista de reprodução', 'Lista de reprodución'],
  playing: ['Reproduciendo', 'Playing', 'S’està reproduint', 'Erreproduzitzen', 'Wiedergabe', 'Lecture en cours', 'In riproduzione', 'A reproduzir', 'Reproducindo']
};

Object.entries(UI_COMMON).forEach(([key, translations]) => {
  LANGUAGES.forEach((language, index) => { UI_TEXT[language.id][key] = translations[index]; });
});

// Textos de los widgets que se crean dinámicamente. Mantenerlos aquí evita
// que Calendario y Notas vuelvan a quedarse fijos en un único idioma.
const WIDGET_TEXT = {
  taskManager: ['Gestor de tareas', 'Task manager', 'Gestor de tasques', 'Zereginen kudeatzailea', 'Aufgabenmanager', 'Gestionnaire de tâches', 'Gestore attività', 'Gestor de tarefas', 'Xestor de tarefas'],
  localTasks: ['Tus tareas se guardan solo en este navegador.', 'Your tasks stay only in this browser.', 'Les teves tasques només es desen en aquest navegador.', 'Zure zereginak nabigatzaile honetan soilik gordetzen dira.', 'Deine Aufgaben bleiben nur in diesem Browser.', 'Vos tâches restent uniquement dans ce navigateur.', 'Le attività restano solo in questo browser.', 'As tuas tarefas ficam apenas neste navegador.', 'As túas tarefas só se gardan neste navegador.'],
  board: ['Tablero', 'Board', 'Tauler', 'Taula', 'Tafel', 'Tableau', 'Bacheca', 'Quadro', 'Taboleiro'],
  calendar: ['Calendario', 'Calendar', 'Calendari', 'Egutegia', 'Kalender', 'Calendrier', 'Calendario', 'Calendário', 'Calendario'],
  importIcs: ['Importar .ics', 'Import .ics', 'Importa .ics', 'Inportatu .ics', '.ics importieren', 'Importer .ics', 'Importa .ics', 'Importar .ics', 'Importar .ics'],
  exportIcs: ['Exportar .ics', 'Export .ics', 'Exporta .ics', 'Esportatu .ics', '.ics exportieren', 'Exporter .ics', 'Esporta .ics', 'Exportar .ics', 'Exportar .ics'],
  syncNow: ['Sincronizar ahora', 'Sync now', 'Sincronitza ara', 'Sinkronizatu orain', 'Jetzt synchronisieren', 'Synchroniser', 'Sincronizza ora', 'Sincronizar agora', 'Sincronizar agora'],
  calendarAutoSync: ['Sincronización inteligente del calendario', 'Smart calendar sync', 'Sincronització intel·ligent del calendari', 'Egutegiaren sinkronizazio adimenduna', 'Intelligente Kalendersynchronisierung', 'Synchronisation intelligente du calendrier', 'Sincronizzazione intelligente del calendario', 'Sincronização inteligente do calendário', 'Sincronización intelixente do calendario'],
  calendarAutoSyncHelp: ['También se comprueba al abrir el Dashboard, entrar en Calendario y volver a esta pestaña. Nunca abre el inicio de sesión automáticamente.', 'Also checks when opening the Dashboard, entering Calendar and returning to this tab. It never opens sign-in automatically.', 'També es comprova en obrir el Dashboard, entrar al Calendari i tornar a aquesta pestanya. Mai obre l’inici de sessió automàticament.', 'Dashboarda irekitzean, Egutegian sartzean eta fitxa honetara itzultzean ere egiaztatzen da. Ez du inoiz saio-hasiera automatikoki irekitzen.', 'Es wird auch beim Öffnen des Dashboards, beim Aufrufen des Kalenders und bei der Rückkehr zu diesem Tab geprüft. Die Anmeldung wird nie automatisch geöffnet.', 'Une vérification est aussi effectuée à l’ouverture du Dashboard, à l’entrée dans Calendrier et au retour sur cet onglet. La connexion ne s’ouvre jamais automatiquement.', 'Il controllo avviene anche all’apertura del Dashboard, entrando nel Calendario e tornando a questa scheda. L’accesso non viene mai aperto automaticamente.', 'Também verifica ao abrir o Dashboard, entrar no Calendário e voltar a este separador. Nunca abre o início de sessão automaticamente.', 'Tamén se comproba ao abrir o Dashboard, entrar no Calendario e volver a esta lapela. Nunca abre o inicio de sesión automaticamente.'],
  calendarAutoOff: ['Desactivada', 'Off', 'Desactivada', 'Desaktibatuta', 'Deaktiviert', 'Désactivée', 'Disattivata', 'Desativada', 'Desactivada'],
  calendarEveryMinutes: ['Cada {minutes} minutos', 'Every {minutes} minutes', 'Cada {minutes} minuts', '{minutes} minuturo', 'Alle {minutes} Minuten', 'Toutes les {minutes} minutes', 'Ogni {minutes} minuti', 'A cada {minutes} minutos', 'Cada {minutes} minutos'],
  calendarSyncRemoved: ['{count} eliminados', '{count} removed', '{count} eliminats', '{count} ezabatuta', '{count} entfernt', '{count} supprimés', '{count} eliminati', '{count} removidos', '{count} eliminados'],
  newTask: ['Nueva tarea', 'New task', 'Tasca nova', 'Zeregin berria', 'Neue Aufgabe', 'Nouvelle tâche', 'Nuova attività', 'Nova tarefa', 'Nova tarefa'],
  taskTodo: ['Por hacer', 'To do', 'Per fer', 'Egiteko', 'Zu erledigen', 'À faire', 'Da fare', 'Por fazer', 'Por facer'],
  taskDoing: ['En curso', 'In progress', 'En curs', 'Martxan', 'In Bearbeitung', 'En cours', 'In corso', 'Em curso', 'En curso'],
  taskDone: ['Hecho', 'Done', 'Fet', 'Eginda', 'Erledigt', 'Terminé', 'Fatto', 'Concluída', 'Feita'],
  dropTask: ['Suelta una tarea aquí', 'Drop a task here', 'Deixa anar una tasca aquí', 'Jaregin zeregin bat hemen', 'Aufgabe hier ablegen', 'Déposez une tâche ici', 'Rilascia qui un’attività', 'Larga uma tarefa aqui', 'Solta unha tarefa aquí'],
  noDueDates: ['Sin vencimientos', 'No due dates', 'Sense venciments', 'Mugarik gabe', 'Keine Fälligkeiten', 'Aucune échéance', 'Nessuna scadenza', 'Sem prazos', 'Sen vencementos'],
  taskSort: ['Ordenar', 'Sort', 'Ordena', 'Ordenatu', 'Sortieren', 'Trier', 'Ordina', 'Ordenar', 'Ordenar'],
  taskSortManual: ['Orden manual', 'Manual order', 'Ordre manual', 'Eskuzko ordena', 'Manuelle Reihenfolge', 'Ordre manuel', 'Ordine manuale', 'Ordem manual', 'Orde manual'],
  taskSortDue: ['Fecha más próxima', 'Nearest due date', 'Data més pròxima', 'Hurbileneko data', 'Nächste Fälligkeit', 'Échéance la plus proche', 'Scadenza più vicina', 'Data mais próxima', 'Data máis próxima'],
  taskSortPriority: ['Prioridad', 'Priority', 'Prioritat', 'Lehentasuna', 'Priorität', 'Priorité', 'Priorità', 'Prioridade', 'Prioridade'],
  taskSortUpdated: ['Actualizadas recientemente', 'Recently updated', 'Actualitzades recentment', 'Duela gutxi eguneratuak', 'Zuletzt aktualisiert', 'Récemment mises à jour', 'Aggiornate di recente', 'Atualizadas recentemente', 'Actualizadas recentemente'],
  taskComfortable: ['Vista cómoda', 'Comfortable view', 'Vista còmoda', 'Ikuspegi erosoa', 'Komfortable Ansicht', 'Vue confortable', 'Vista comoda', 'Vista confortável', 'Vista cómoda'],
  taskCompact: ['Vista compacta', 'Compact view', 'Vista compacta', 'Ikuspegi trinkoa', 'Kompakte Ansicht', 'Vue compacte', 'Vista compatta', 'Vista compacta', 'Vista compacta'],
  taskReorderHelp: ['Arrastra una tarjeta para colocarla exactamente donde quieras.', 'Drag a card to place it exactly where you want.', 'Arrossega una targeta per col·locar-la exactament on vulguis.', 'Arrastatu txartela nahi duzun tokian jartzeko.', 'Ziehe eine Karte genau an die gewünschte Position.', 'Faites glisser une carte pour la placer exactement où vous le souhaitez.', 'Trascina una scheda per posizionarla esattamente dove vuoi.', 'Arrasta um cartão para o colocares exatamente onde quiseres.', 'Arrastra unha tarxeta para colocala exactamente onde queiras.'],
  taskProperties: ['Propiedades', 'Properties', 'Propietats', 'Propietateak', 'Eigenschaften', 'Propriétés', 'Proprietà', 'Propriedades', 'Propiedades'],
  priority: ['Prioridad', 'Priority', 'Prioritat', 'Lehentasuna', 'Priorität', 'Priorité', 'Priorità', 'Prioridade', 'Prioridade'],
  priorityLow: ['Baja', 'Low', 'Baixa', 'Baxua', 'Niedrig', 'Basse', 'Bassa', 'Baixa', 'Baixa'],
  priorityNormal: ['Normal', 'Normal', 'Normal', 'Normala', 'Normal', 'Normale', 'Normale', 'Normal', 'Normal'],
  priorityHigh: ['Alta', 'High', 'Alta', 'Altua', 'Hoch', 'Haute', 'Alta', 'Alta', 'Alta'],
  priorityUrgent: ['Urgente', 'Urgent', 'Urgent', 'Premiazkoa', 'Dringend', 'Urgente', 'Urgente', 'Urgente', 'Urxente'],
  calendarMonth: ['Mes', 'Month', 'Mes', 'Hilabetea', 'Monat', 'Mois', 'Mese', 'Mês', 'Mes'],
  calendarWeek: ['Semana', 'Week', 'Setmana', 'Astea', 'Woche', 'Semaine', 'Settimana', 'Semana', 'Semana'],
  calendarAgenda: ['Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda', 'Axenda'],
  today: ['Hoy', 'Today', 'Avui', 'Gaur', 'Heute', 'Aujourd’hui', 'Oggi', 'Hoje', 'Hoxe'],
  previousPeriod: ['Periodo anterior', 'Previous period', 'Període anterior', 'Aurreko aldia', 'Vorheriger Zeitraum', 'Période précédente', 'Periodo precedente', 'Período anterior', 'Período anterior'],
  nextPeriod: ['Periodo siguiente', 'Next period', 'Període següent', 'Hurrengo aldia', 'Nächster Zeitraum', 'Période suivante', 'Periodo successivo', 'Período seguinte', 'Período seguinte'],
  noCalendarTasks: ['No hay tareas con fecha en este periodo.', 'There are no dated tasks in this period.', 'No hi ha tasques amb data en aquest període.', 'Ez dago datadun zereginik aldi honetan.', 'In diesem Zeitraum gibt es keine datierten Aufgaben.', 'Aucune tâche datée pour cette période.', 'Non ci sono attività con data in questo periodo.', 'Não há tarefas com data neste período.', 'Non hai tarefas con data neste período.'],
  calendarHelp: ['Añade una fecha a una tarea para verla en el calendario y poder sincronizarla.', 'Add a date to a task to see it in the calendar and sync it.', 'Afegeix una data a una tasca per veure-la al calendari i sincronitzar-la.', 'Gehitu data bat zereginari egutegian ikusi eta sinkronizatzeko.', 'Füge einer Aufgabe ein Datum hinzu, um sie im Kalender zu sehen und zu synchronisieren.', 'Ajoutez une date à une tâche pour la voir dans le calendrier et la synchroniser.', 'Aggiungi una data a un’attività per vederla nel calendario e sincronizzarla.', 'Adiciona uma data a uma tarefa para a veres no calendário e sincronizares.', 'Engade unha data a unha tarefa para vela no calendario e sincronizala.'],
  dueLabel: ['Vence', 'Due', 'Venç', 'Epemuga', 'Fällig', 'Échéance', 'Scade', 'Prazo', 'Vence'],
  reminderLabel: ['Aviso', 'Reminder', 'Avís', 'Abisua', 'Erinnerung', 'Rappel', 'Promemoria', 'Aviso', 'Aviso'],
  clearDate: ['Sin fecha', 'No date', 'Sense data', 'Datarik gabe', 'Ohne Datum', 'Sans date', 'Senza data', 'Sem data', 'Sen data'],
  edit: ['Editar', 'Edit', 'Edita', 'Editatu', 'Bearbeiten', 'Modifier', 'Modifica', 'Editar', 'Editar'],
  done: ['Hecha', 'Done', 'Feta', 'Eginda', 'Erledigt', 'Terminée', 'Fatta', 'Concluída', 'Feita'],
  reopen: ['Reabrir', 'Reopen', 'Reobre', 'Berriro ireki', 'Wieder öffnen', 'Rouvrir', 'Riapri', 'Reabrir', 'Reabrir'],
  taskTitle: ['Título', 'Title', 'Títol', 'Izenburua', 'Titel', 'Titre', 'Titolo', 'Título', 'Título'],
  taskTitlePlaceholder: ['Título de la tarea', 'Task title', 'Títol de la tasca', 'Zereginaren izenburua', 'Aufgabentitel', 'Titre de la tâche', 'Titolo dell’attività', 'Título da tarefa', 'Título da tarefa'],
  notes: ['Notas', 'Notes', 'Notes', 'Oharrak', 'Notizen', 'Notes', 'Note', 'Notas', 'Notas'],
  notesPlaceholder: ['Notas, enlaces o contexto (opcional)', 'Notes, links or context (optional)', 'Notes, enllaços o context (opcional)', 'Oharrak, estekak edo testuingurua (aukerakoa)', 'Notizen, Links oder Kontext (optional)', 'Notes, liens ou contexte (facultatif)', 'Note, link o contesto (facoltativo)', 'Notas, ligações ou contexto (opcional)', 'Notas, ligazóns ou contexto (opcional)'],
  column: ['Columna', 'Column', 'Columna', 'Zutabea', 'Spalte', 'Colonne', 'Colonna', 'Coluna', 'Columna'],
  dueDate: ['Fecha y hora', 'Date and time', 'Data i hora', 'Data eta ordua', 'Datum und Uhrzeit', 'Date et heure', 'Data e ora', 'Data e hora', 'Data e hora'],
  reminder: ['Recordatorio', 'Reminder', 'Recordatori', 'Oroigarria', 'Erinnerung', 'Rappel', 'Promemoria', 'Lembrete', 'Lembrete'],
  reminderHelp: ['El aviso se muestra aunque el dashboard esté cerrado. Déjalo vacío si no quieres una notificación.', 'The alert can appear while the dashboard is closed. Leave it empty to skip notifications.', 'L’avís es mostra encara que el dashboard estigui tancat. Deixa’l buit per no rebre notificacions.', 'Abisua dashboarda itxita egon arren ager daiteke. Utzi hutsik jakinarazpenik nahi ez baduzu.', 'Der Hinweis kann erscheinen, auch wenn das Dashboard geschlossen ist. Leer lassen, um keine Benachrichtigung zu erhalten.', 'L’alerte peut apparaître même lorsque le dashboard est fermé. Laissez vide pour ne pas recevoir de notification.', 'L’avviso può comparire anche a dashboard chiuso. Lascia vuoto per non ricevere notifiche.', 'O aviso pode aparecer com o dashboard fechado. Deixa vazio para não receber notificações.', 'O aviso pode aparecer co dashboard pechado. Déixao baleiro para non recibir avisos.'],
  calendarTarget: ['Calendario de sincronización', 'Sync calendar', 'Calendari de sincronització', 'Sinkronizazio-egutegia', 'Synchronisierungskalender', 'Calendrier de synchronisation', 'Calendario di sincronizzazione', 'Calendário de sincronização', 'Calendario de sincronización'],
  noSync: ['Solo local (sin sincronizar)', 'Local only (no sync)', 'Només local (sense sincronitzar)', 'Lokala soilik (sinkronizaziorik gabe)', 'Nur lokal (ohne Synchronisierung)', 'Local uniquement (sans synchronisation)', 'Solo locale (senza sincronizzazione)', 'Apenas local (sem sincronização)', 'Só local (sen sincronización)'],
  calendarHub: ['Calendarios', 'Calendars', 'Calendaris', 'Egutegiak', 'Kalender', 'Calendriers', 'Calendari', 'Calendários', 'Calendarios'],
  chooseIcs: ['Elegir archivo .ics', 'Choose .ics file', 'Tria un fitxer .ics', 'Aukeratu .ics fitxategia', '.ics-Datei wählen', 'Choisir un fichier .ics', 'Scegli file .ics', 'Escolher ficheiro .ics', 'Escoller ficheiro .ics'],
  calendarLocalInfo: ['Puedes importar uno o varios calendarios .ics. Sus eventos se suman sin borrar los ya existentes.', 'You can import one or more .ics calendars. Their events are added without deleting existing ones.', 'Pots importar un o diversos calendaris .ics. Els esdeveniments se sumen sense esborrar els existents.', 'Eguneko .ics bat edo gehiago inporta ditzakezu. Gertaerak gehitzen dira lehendik daudenak ezabatu gabe.', 'Du kannst einen oder mehrere .ics-Kalender importieren. Ihre Ereignisse werden hinzugefügt, ohne vorhandene zu löschen.', 'Vous pouvez importer un ou plusieurs calendriers .ics. Leurs événements s’ajoutent sans supprimer ceux existants.', 'Puoi importare uno o più calendari .ics. Gli eventi si aggiungono senza eliminare quelli esistenti.', 'Podes importar um ou mais calendários .ics. Os eventos são adicionados sem apagar os existentes.', 'Podes importar un ou varios calendarios .ics. Os eventos engádense sen borrar os existentes.'],
  personalConnection: ['Conexión personal opcional', 'Optional personal connection', 'Connexió personal opcional', 'Aukerako konexio pertsonala', 'Optionale persönliche Verbindung', 'Connexion personnelle facultative', 'Connessione personale opzionale', 'Ligação pessoal opcional', 'Conexión persoal opcional'],
  setupConnection: ['Configurar mi conexión', 'Set up my connection', 'Configura la meva connexió', 'Konfiguratu nire konexioa', 'Meine Verbindung einrichten', 'Configurer ma connexion', 'Configura la mia connessione', 'Configurar a minha ligação', 'Configurar a miña conexión'],
  connected: ['Conectado', 'Connected', 'Connectat', 'Konektatuta', 'Verbunden', 'Connecté', 'Connesso', 'Ligado', 'Conectado'],
  disconnect: ['Desconectar y borrar datos locales', 'Disconnect and erase local data', 'Desconnecta i esborra les dades locals', 'Deskonektatu eta ezabatu datu lokalak', 'Trennen und lokale Daten löschen', 'Déconnecter et effacer les données locales', 'Disconnetti ed elimina i dati locali', 'Desligar e apagar dados locais', 'Desconectar e borrar datos locais'],
  clientId: ['Tu Client ID', 'Your Client ID', 'El teu Client ID', 'Zure Client ID', 'Deine Client ID', 'Votre Client ID', 'Il tuo Client ID', 'O teu Client ID', 'O teu Client ID'],
  redirectUri: ['URI de redirección', 'Redirect URI', 'URI de redirecció', 'Birbideratze URIa', 'Weiterleitungs-URI', 'URI de redirection', 'URI di reindirizzamento', 'URI de redirecionamento', 'URI de redirección'],
  copy: ['Copiar', 'Copy', 'Copia', 'Kopiatu', 'Kopieren', 'Copier', 'Copia', 'Copiar', 'Copiar'],
  noSecret: ['Nunca pegues una clave secreta ni tu contraseña. Solo se necesita el Client ID.', 'Never paste a client secret or your password. Only the Client ID is needed.', 'No enganxis mai una clau secreta ni la contrasenya. Només cal el Client ID.', 'Ez itsatsi inoiz gako sekreturik edo pasahitzik. Client IDa baino ez da behar.', 'Füge niemals ein Client Secret oder Passwort ein. Nur die Client ID wird benötigt.', 'Ne collez jamais de secret client ou de mot de passe. Seul le Client ID est nécessaire.', 'Non incollare mai un client secret o la password. Serve solo il Client ID.', 'Nunca coloques uma chave secreta ou palavra-passe. Só é necessário o Client ID.', 'Nunca pegues unha clave secreta nin o contrasinal. Só se necesita o Client ID.'],
  saveConnect: ['Guardar y conectar', 'Save and connect', 'Desa i connecta', 'Gorde eta konektatu', 'Speichern und verbinden', 'Enregistrer et connecter', 'Salva e connetti', 'Guardar e ligar', 'Gardar e conectar'],
  calendarExtensionOnly: ['Esta función requiere instalar DashboardDP como extensión.', 'This feature requires DashboardDP to be installed as an extension.', 'Aquesta funció requereix instal·lar DashboardDP com a extensió.', 'Funtzio honek DashboardDP luzapen gisa instalatzea behar du.', 'Diese Funktion erfordert DashboardDP als Erweiterung.', 'Cette fonction nécessite DashboardDP installé comme extension.', 'Questa funzione richiede DashboardDP installato come estensione.', 'Esta função requer o DashboardDP instalado como extensão.', 'Esta función require DashboardDP instalado como extensión.'],
  calendarUnsupportedBrowser: ['Este navegador no permite la autorización segura para esta extensión.', 'This browser does not support secure authorization for this extension.', 'Aquest navegador no permet l’autorització segura per a aquesta extensió.', 'Nabigatzaile honek ez du luzapen honetarako baimen segurua onartzen.', 'Dieser Browser unterstützt keine sichere Autorisierung für diese Erweiterung.', 'Ce navigateur ne permet pas l’autorisation sécurisée pour cette extension.', 'Questo browser non supporta l’autorizzazione sicura per questa estensione.', 'Este navegador não permite autorização segura para esta extensão.', 'Este navegador non permite autorización segura para esta extensión.'],
  calendarBraveIdentityDisabled: ['En Brave, abre brave://settings/extensions y activa «Permitir el inicio de sesión de Google para extensiones». Después vuelve a intentar la conexión.', 'In Brave, open brave://settings/extensions and enable “Allow Google login for extensions”. Then try connecting again.', 'A Brave, obre brave://settings/extensions i activa «Permet l’inici de sessió de Google per a extensions». Després, torna a provar la connexió.', 'Brave-n, ireki brave://settings/extensions eta aktibatu «Baimendu Google saio-hasiera luzapenetarako». Ondoren, saiatu berriro konektatzen.', 'Öffne in Brave brave://settings/extensions und aktiviere „Google-Anmeldung für Erweiterungen zulassen“. Versuche danach die Verbindung erneut.', 'Dans Brave, ouvrez brave://settings/extensions et activez « Autoriser la connexion Google pour les extensions ». Réessayez ensuite de vous connecter.', 'In Brave, apri brave://settings/extensions e attiva « Consenti l’accesso Google per le estensioni ». Quindi prova di nuovo a connetterti.', 'No Brave, abre brave://settings/extensions e ativa « Permitir início de sessão Google para extensões ». Depois tenta ligar novamente.', 'En Brave, abre brave://settings/extensions e activa « Permitir o inicio de sesión de Google para extensións ». Despois tenta conectar de novo.'],
  calendarGooglePersonalMode: ['Modo personal avanzado: Google requiere un cliente OAuth de tipo «Extensión de Chrome», no «Aplicación web». Este modo no usa ni guarda claves secretas.', 'Advanced personal mode: Google requires a “Chrome Extension” OAuth client, not a “Web application”. This mode never uses or stores client secrets.', 'Mode personal avançat: Google requereix un client OAuth de tipus «Extensió de Chrome», no «Aplicació web». Aquest mode no fa servir ni desa claus secretes.', 'Modu pertsonal aurreratua: Googlek «Chrome luzapena» motako OAuth bezeroa behar du, ez «Web aplikazioa». Modu honek ez du gako sekreturik erabiltzen edo gordetzen.', 'Erweiterter persönlicher Modus: Google benötigt einen OAuth-Client vom Typ „Chrome-Erweiterung“, nicht „Webanwendung“. Dieser Modus verwendet oder speichert keine Client Secrets.', 'Mode personnel avancé : Google requiert un client OAuth de type « Extension Chrome », et non « Application Web ». Ce mode n’utilise ni ne stocke de secrets client.', 'Modalità personale avanzata: Google richiede un client OAuth di tipo « Estensione Chrome », non « Applicazione web ». Questa modalità non usa né memorizza segreti client.', 'Modo pessoal avançado: o Google requer um cliente OAuth do tipo « Extensão Chrome », e não « Aplicação Web ». Este modo não usa nem guarda segredos de cliente.', 'Modo persoal avanzado: Google require un cliente OAuth de tipo « Extensión de Chrome », non « Aplicación web ». Este modo non usa nin garda claves secretas.'],
  calendarGoogleManifestReady: ['Cliente personal detectado. Puedes conectar Google Calendar desde esta pestaña de DashboardDP.', 'Personal client detected. You can connect Google Calendar from this DashboardDP tab.', 'Client personal detectat. Pots connectar Google Calendar des d’aquesta pestanya de DashboardDP.', 'Bezero pertsonala atzeman da. Google Calendar DashboardDP fitxa honetatik konekta dezakezu.', 'Persönlicher Client erkannt. Du kannst Google Calendar über diesen DashboardDP-Tab verbinden.', 'Client personnel détecté. Vous pouvez connecter Google Calendar depuis cet onglet DashboardDP.', 'Client personale rilevato. Puoi collegare Google Calendar da questa scheda DashboardDP.', 'Cliente pessoal detetado. Podes ligar o Google Calendar neste separador DashboardDP.', 'Cliente persoal detectado. Podes conectar Google Calendar desde esta lapela de DashboardDP.'],
  calendarGoogleManifestMissing: ['Introduce el Client ID de tu cliente «Extensión de Chrome». DashboardDP descargará un manifest personal sin secretos: sustitúyelo en la carpeta de la extensión y recárgala en Brave.', 'Enter the Client ID of your “Chrome Extension” client. DashboardDP will download a secret-free personal manifest: replace it in the extension folder and reload it in Brave.', 'Introdueix el Client ID del teu client «Extensió de Chrome». DashboardDP baixarà un manifest personal sense secrets: substitueix-lo a la carpeta de l’extensió i recarrega-la a Brave.', 'Sartu zure «Chrome luzapena» bezeroaren Client IDa. DashboardDPk sekreturik gabeko manifest pertsonala deskargatuko du: ordeztu luzapenaren karpetan eta berriro kargatu Brave-n.', 'Gib die Client ID deines „Chrome-Erweiterung“-Clients ein. DashboardDP lädt ein persönliches Manifest ohne Geheimnisse herunter: Ersetze es im Erweiterungsordner und lade Brave neu.', 'Saisissez le Client ID de votre client « Extension Chrome ». DashboardDP téléchargera un manifest personnel sans secret : remplacez-le dans le dossier de l’extension et rechargez Brave.', 'Inserisci il Client ID del client « Estensione Chrome ». DashboardDP scaricherà un manifest personale senza segreti: sostituiscilo nella cartella dell’estensione e ricarica Brave.', 'Introduz o Client ID do teu cliente « Extensão Chrome ». O DashboardDP descarregará um manifest pessoal sem segredos: substitui-o na pasta da extensão e recarrega no Brave.', 'Introduce o Client ID do teu cliente « Extensión de Chrome ». DashboardDP descargará un manifest persoal sen segredos: substitúeo no cartafol da extensión e recárgaa en Brave.'],
  calendarGoogleDownloadManifest: ['Descargar manifest personal', 'Download personal manifest', 'Baixa el manifest personal', 'Deskargatu manifest pertsonala', 'Persönliches Manifest herunterladen', 'Télécharger le manifest personnel', 'Scarica manifest personale', 'Descarregar manifest pessoal', 'Descargar manifest persoal'],
  calendarGoogleManifestDownloaded: ['Manifest personal descargado. Sustituye manifest.json en la carpeta de DashboardDP y pulsa Recargar en brave://extensions.', 'Personal manifest downloaded. Replace manifest.json in the DashboardDP folder and click Reload in brave://extensions.', 'Manifest personal baixat. Substitueix manifest.json a la carpeta de DashboardDP i prem Recarrega a brave://extensions.', 'Manifest pertsonala deskargatu da. Ordeztu manifest.json DashboardDP karpetan eta sakatu Berriro kargatu brave://extensions helbidean.', 'Persönliches Manifest heruntergeladen. Ersetze manifest.json im DashboardDP-Ordner und klicke in brave://extensions auf Neu laden.', 'Manifest personnel téléchargé. Remplacez manifest.json dans le dossier DashboardDP et cliquez sur Recharger dans brave://extensions.', 'Manifest personale scaricato. Sostituisci manifest.json nella cartella DashboardDP e fai clic su Ricarica in brave://extensions.', 'Manifest pessoal descarregado. Substitui manifest.json na pasta DashboardDP e clica em Recarregar em brave://extensions.', 'Manifest persoal descargado. Substitúe manifest.json no cartafol DashboardDP e preme Recargar en brave://extensions.'],
  calendarGoogleOpenExtensionTab: ['Para conectar Google Calendar, abre DashboardDP desde su icono fijado y realiza la conexión en la pestaña que se abrirá.', 'To connect Google Calendar, open DashboardDP from its pinned icon and complete the connection in the tab that opens.', 'Per connectar Google Calendar, obre DashboardDP des de la seva icona fixada i fes la connexió a la pestanya que s’obrirà.', 'Google Calendar konektatzeko, ireki DashboardDP ainguratutako ikonotik eta egin konexioa irekiko den fitxan.', 'Um Google Calendar zu verbinden, öffne DashboardDP über sein angeheftetes Symbol und führe die Verbindung im geöffneten Tab durch.', 'Pour connecter Google Calendar, ouvrez DashboardDP depuis son icône épinglée et effectuez la connexion dans l’onglet qui s’ouvre.', 'Per collegare Google Calendar, apri DashboardDP dalla sua icona fissata ed effettua la connessione nella scheda che si apre.', 'Para ligar o Google Calendar, abre o DashboardDP pelo ícone fixado e conclui a ligação no separador que será aberto.', 'Para conectar Google Calendar, abre DashboardDP desde a súa icona fixada e realiza a conexión na lapela que se abrirá.'],
  calendarGoogleStep1: ['Copia el ID de esta extensión.', 'Copy this extension ID.', 'Copia l’ID d’aquesta extensió.', 'Kopiatu luzapen honen IDa.', 'Kopiere diese Erweiterungs-ID.', 'Copiez l’ID de cette extension.', 'Copia l’ID di questa estensione.', 'Copia o ID desta extensão.', 'Copia o ID desta extensión.'],
  calendarGoogleStep2: ['En Google Cloud crea un proyecto personal y activa «Google Calendar API».', 'In Google Cloud, create a personal project and enable “Google Calendar API”.', 'A Google Cloud crea un projecte personal i activa «Google Calendar API».', 'Google Cloud-en, sortu proiektu pertsonal bat eta aktibatu «Google Calendar API».', 'Erstelle in Google Cloud ein persönliches Projekt und aktiviere die „Google Calendar API“.', 'Dans Google Cloud, créez un projet personnel et activez « Google Calendar API ».', 'In Google Cloud, crea un progetto personale e attiva «Google Calendar API».', 'No Google Cloud, cria um projeto pessoal e ativa «Google Calendar API».', 'En Google Cloud crea un proxecto persoal e activa «Google Calendar API».'],
  calendarGoogleStep3: ['En «Google Auth platform», configura el consentimiento para uso personal y añade tu cuenta como usuario de prueba si Google lo solicita.', 'In “Google Auth platform”, configure consent for personal use and add your account as a test user if Google requests it.', 'A «Google Auth platform», configura el consentiment per a ús personal i afegeix el teu compte com a usuari de prova si Google t’ho demana.', '«Google Auth platform»-en, konfiguratu baimena erabilera pertsonalerako eta gehitu zure kontua probako erabiltzaile gisa Googlek eskatzen badu.', 'Konfiguriere in der „Google Auth platform“ die Einwilligung für die persönliche Nutzung und füge dein Konto als Testnutzer hinzu, falls Google dies verlangt.', 'Dans « Google Auth platform », configurez le consentement pour un usage personnel et ajoutez votre compte comme utilisateur test si Google le demande.', 'In « Google Auth platform », configura il consenso per uso personale e aggiungi il tuo account come utente di prova se Google lo richiede.', 'Na «Google Auth platform», configura o consentimento para uso pessoal e adiciona a tua conta como utilizador de teste se o Google o pedir.', 'En «Google Auth platform», configura o consentimento para uso persoal e engade a túa conta como usuario de proba se Google o solicita.'],
  calendarGoogleStep4: ['Crea una credencial OAuth de tipo «Extensión de Chrome», pega el ID de arriba como «ID de elemento» y copia su Client ID. No elijas «Aplicación web».', 'Create a “Chrome Extension” OAuth credential, paste the ID above as its “Item ID”, and copy its Client ID. Do not choose “Web application”.', 'Crea una credencial OAuth de tipus «Extensió de Chrome», enganxa l’ID de dalt com a «ID de l’element» i copia’n el Client ID. No triïs «Aplicació web».', 'Sortu «Chrome luzapena» motako OAuth kredentzial bat, itsatsi goiko IDa «Elementu ID» gisa eta kopiatu Client IDa. Ez aukeratu «Web aplikazioa».', 'Erstelle OAuth-Anmeldedaten vom Typ „Chrome-Erweiterung“, füge die obige ID als „Element-ID“ ein und kopiere die Client ID. Wähle nicht „Webanwendung“.', 'Créez des identifiants OAuth de type « Extension Chrome », collez l’ID ci-dessus comme « ID de l’élément » et copiez le Client ID. Ne choisissez pas « Application Web ».', 'Crea una credenziale OAuth di tipo « Estensione Chrome », incolla l’ID sopra come « ID elemento » e copia il Client ID. Non scegliere « Applicazione web ».', 'Cria uma credencial OAuth do tipo « Extensão Chrome », cola o ID acima como « ID do item » e copia o Client ID. Não escolhas « Aplicação Web ».', 'Crea unha credencial OAuth de tipo «Extensión de Chrome», pega o ID anterior como «ID de elemento» e copia o Client ID. Non elixas «Aplicación web».'],
  calendarGoogleStep5: ['Pega ese Client ID aquí. Descarga el manifest personal, sustitúyelo como manifest.json en la carpeta de DashboardDP y pulsa Recargar en brave://extensions.', 'Paste that Client ID here. Download the personal manifest, replace manifest.json in the DashboardDP folder, and click Reload in brave://extensions.', 'Enganxa aquest Client ID aquí. Baixa el manifest personal, substitueix manifest.json a la carpeta DashboardDP i prem Recarrega a brave://extensions.', 'Itsatsi Client ID hori hemen. Deskargatu manifest pertsonala, ordeztu manifest.json DashboardDP karpetan eta sakatu Berriro kargatu brave://extensions helbidean.', 'Füge diese Client ID hier ein. Lade das persönliche Manifest herunter, ersetze manifest.json im DashboardDP-Ordner und klicke in brave://extensions auf Neu laden.', 'Collez ce Client ID ici. Téléchargez le manifest personnel, remplacez manifest.json dans le dossier DashboardDP et cliquez sur Recharger dans brave://extensions.', 'Incolla qui il Client ID. Scarica il manifest personale, sostituisci manifest.json nella cartella DashboardDP e fai clic su Ricarica in brave://extensions.', 'Cola aqui esse Client ID. Descarrega o manifest pessoal, substitui manifest.json na pasta DashboardDP e clica em Recarregar em brave://extensions.', 'Pega aquí ese Client ID. Descarga o manifest persoal, substitúeo como manifest.json no cartafol de DashboardDP e preme Recargar en brave://extensions.'],
  calendarExtensionId: ['ID de esta extensión', 'This extension ID', 'ID d’aquesta extensió', 'Luzapen honen IDa', 'ID dieser Erweiterung', 'ID de cette extension', 'ID di questa estensione', 'ID desta extensão', 'ID desta extensión'],
  calendarGoogleConnect: ['Conectar Google Calendar', 'Connect Google Calendar', 'Connecta Google Calendar', 'Konektatu Google Calendar', 'Google Calendar verbinden', 'Connecter Google Calendar', 'Collega Google Calendar', 'Ligar Google Calendar', 'Conectar Google Calendar'],
  calendarPermissionDenied: ['No se concedieron los permisos necesarios.', 'The required permissions were not granted.', 'No s’han concedit els permisos necessaris.', 'Beharrezko baimenak ez dira eman.', 'Die erforderlichen Berechtigungen wurden nicht erteilt.', 'Les autorisations requises n’ont pas été accordées.', 'Le autorizzazioni necessarie non sono state concesse.', 'As permissões necessárias não foram concedidas.', 'Non se concederon os permisos necesarios.'],
  calendarClientIdRequired: ['Introduce un Client ID válido.', 'Enter a valid Client ID.', 'Introdueix un Client ID vàlid.', 'Sartu baliozko Client ID bat.', 'Gib eine gültige Client ID ein.', 'Saisissez un Client ID valide.', 'Inserisci un Client ID valido.', 'Introduz um Client ID válido.', 'Introduce un Client ID válido.'],
  calendarConnectionFailed: ['No se pudo conectar el calendario.', 'The calendar could not be connected.', 'No s’ha pogut connectar el calendari.', 'Ezin izan da egutegia konektatu.', 'Der Kalender konnte nicht verbunden werden.', 'Le calendrier n’a pas pu être connecté.', 'Non è stato possibile connettere il calendario.', 'Não foi possível ligar o calendário.', 'Non se puido conectar o calendario.'],
  calendarReconnectNeeded: ['La autorización ha caducado. Tu configuración sigue guardada: pulsa «Renovar acceso y sincronizar».', 'Authorization expired. Your setup is still saved: select “Renew access and sync”.', 'L’autorització ha caducat. La configuració continua desada: prem «Renova l’accés i sincronitza».', 'Baimena iraungi da. Konfigurazioa gordeta dago: sakatu «Berritu sarbidea eta sinkronizatu».', 'Die Autorisierung ist abgelaufen. Deine Einrichtung ist gespeichert: Wähle „Zugriff erneuern und synchronisieren“.', 'L’autorisation a expiré. Votre configuration est conservée : choisissez « Renouveler l’accès et synchroniser ».', 'L’autorizzazione è scaduta. La configurazione è ancora salvata: scegli «Rinnova accesso e sincronizza».', 'A autorização expirou. A configuração continua guardada: seleciona «Renovar acesso e sincronizar».', 'A autorización caducou. A configuración segue gardada: preme «Renovar acceso e sincronizar».'],
  calendarRenewAccess: ['Renovar acceso', 'Renew access', 'Renova l’accés', 'Berritu sarbidea', 'Zugriff erneuern', 'Renouveler l’accès', 'Rinnova accesso', 'Renovar acesso', 'Renovar acceso'],
  calendarRenewAndSync: ['Renovar acceso y sincronizar', 'Renew access and sync', 'Renova l’accés i sincronitza', 'Berritu sarbidea eta sinkronizatu', 'Zugriff erneuern und synchronisieren', 'Renouveler l’accès et synchroniser', 'Rinnova accesso e sincronizza', 'Renovar acesso e sincronizar', 'Renovar acceso e sincronizar'],
  calendarConnectionPaused: ['Conexión guardada · falta renovar la autorización', 'Connection saved · authorization renewal required', 'Connexió desada · cal renovar l’autorització', 'Konexioa gordeta · baimena berritu behar da', 'Verbindung gespeichert · Autorisierung muss erneuert werden', 'Connexion enregistrée · autorisation à renouveler', 'Connessione salvata · autorizzazione da rinnovare', 'Ligação guardada · é necessário renovar a autorização', 'Conexión gardada · cómpre renovar a autorización'],
  calendarAccessRestored: ['Acceso al calendario recuperado.', 'Calendar access restored.', 'Accés al calendari recuperat.', 'Egutegirako sarbidea berreskuratu da.', 'Kalenderzugriff wiederhergestellt.', 'Accès au calendrier rétabli.', 'Accesso al calendario ripristinato.', 'Acesso ao calendário recuperado.', 'Acceso ao calendario recuperado.'],
  calendarRenewHelp: ['DashboardDP intentará renovar el acceso automáticamente al abrir Brave. Si Google cierra la sesión o exige confirmación, usa «Renovar acceso»; no tendrás que repetir la configuración.', 'DashboardDP will try to renew access automatically when Brave opens. If Google signs you out or asks for confirmation, use “Renew access”; you will not need to repeat setup.', 'DashboardDP intentarà renovar l’accés automàticament en obrir Brave. Si Google tanca la sessió o demana confirmació, fes servir «Renova l’accés»; no caldrà repetir la configuració.', 'DashboardDPk Brave irekitzean sarbidea automatikoki berritzen saiatuko da. Googlek saioa ixten badu edo baieztapena eskatzen badu, erabili «Berritu sarbidea»; ez duzu konfigurazioa errepikatu beharko.', 'DashboardDP versucht beim Öffnen von Brave, den Zugriff automatisch zu erneuern. Wenn Google dich abmeldet oder eine Bestätigung verlangt, nutze „Zugriff erneuern“; die Einrichtung muss nicht wiederholt werden.', 'DashboardDP tentera de renouveler automatiquement l’accès à l’ouverture de Brave. Si Google vous déconnecte ou demande une confirmation, utilisez « Renouveler l’accès » ; vous n’aurez pas à refaire la configuration.', 'DashboardDP proverà a rinnovare automaticamente l’accesso all’apertura di Brave. Se Google disconnette l’account o chiede conferma, usa «Rinnova accesso»; non dovrai ripetere la configurazione.', 'O DashboardDP tentará renovar o acesso automaticamente ao abrir o Brave. Se o Google terminar a sessão ou pedir confirmação, usa «Renovar acesso»; não terás de repetir a configuração.', 'DashboardDP tentará renovar o acceso automaticamente ao abrir Brave. Se Google pecha a sesión ou pide confirmación, usa «Renovar acceso»; non terás que repetir a configuración.'],
  calendarSyncFailed: ['No se pudo sincronizar el calendario.', 'The calendar could not be synchronized.', 'No s’ha pogut sincronitzar el calendari.', 'Ezin izan da egutegia sinkronizatu.', 'Der Kalender konnte nicht synchronisiert werden.', 'Le calendrier n’a pas pu être synchronisé.', 'Non è stato possibile sincronizzare il calendario.', 'Não foi possível sincronizar o calendário.', 'Non se puido sincronizar o calendario.'],
  calendarSecurityCheckFailed: ['La comprobación de seguridad falló. Inténtalo otra vez.', 'The security check failed. Try again.', 'La comprovació de seguretat ha fallat. Torna-ho a provar.', 'Segurtasun-egiaztapenak huts egin du. Saiatu berriro.', 'Die Sicherheitsprüfung ist fehlgeschlagen. Versuche es erneut.', 'La vérification de sécurité a échoué. Réessayez.', 'Il controllo di sicurezza non è riuscito. Riprova.', 'A verificação de segurança falhou. Tenta novamente.', 'A comprobación de seguridade fallou. Téntao outra vez.'],
  calendarConnectionCancelled: ['La conexión se canceló.', 'The connection was cancelled.', 'La connexió s’ha cancel·lat.', 'Konexioa ezeztatu da.', 'Die Verbindung wurde abgebrochen.', 'La connexion a été annulée.', 'La connessione è stata annullata.', 'A ligação foi cancelada.', 'A conexión cancelouse.'],
  calendarUntitledEvent: ['Evento sin título', 'Untitled event', 'Esdeveniment sense títol', 'Izenbururik gabeko gertaera', 'Ereignis ohne Titel', 'Événement sans titre', 'Evento senza titolo', 'Evento sem título', 'Evento sen título'],
  calendarNoConnection: ['Configura primero una conexión personal.', 'Set up a personal connection first.', 'Configura primer una connexió personal.', 'Lehenik konexio pertsonal bat konfiguratu.', 'Richte zuerst eine persönliche Verbindung ein.', 'Configurez d’abord une connexion personnelle.', 'Configura prima una connessione personale.', 'Configura primeiro uma ligação pessoal.', 'Configura primeiro unha conexión persoal.'],
  calendarSyncSummary: ['Sincronización terminada: {imported} añadidos, {updated} actualizados y {pushed} enviados.', 'Sync complete: {imported} added, {updated} updated and {pushed} sent.', 'Sincronització acabada: {imported} afegits, {updated} actualitzats i {pushed} enviats.', 'Sinkronizazioa amaituta: {imported} gehituta, {updated} eguneratuta eta {pushed} bidalita.', 'Synchronisierung beendet: {imported} hinzugefügt, {updated} aktualisiert und {pushed} gesendet.', 'Synchronisation terminée : {imported} ajoutés, {updated} mis à jour et {pushed} envoyés.', 'Sincronizzazione completata: {imported} aggiunti, {updated} aggiornati e {pushed} inviati.', 'Sincronização concluída: {imported} adicionados, {updated} atualizados e {pushed} enviados.', 'Sincronización rematada: {imported} engadidos, {updated} actualizados e {pushed} enviados.']
  ,stickyNotes: ['Notas adhesivas', 'Sticky notes', 'Notes adhesives', 'Ohar itsaskorrak', 'Haftnotizen', 'Notes adhésives', 'Note adesive', 'Notas adesivas', 'Notas adhesivas']
  ,stickySubtitle: ['Notas locales, rápidas y ligeras.', 'Local, quick and lightweight notes.', 'Notes locals, ràpids i lleugers.', 'Ohar lokal, azkar eta arinak.', 'Lokale, schnelle und leichte Notizen.', 'Notes locales, rapides et légères.', 'Note locali, rapide e leggere.', 'Notas locais, rápidas e leves.', 'Notas locais, rápidas e lixeiras.']
  ,newNote: ['Nueva nota', 'New note', 'Nota nova', 'Ohar berria', 'Neue Notiz', 'Nouvelle note', 'Nuova nota', 'Nova nota', 'Nova nota']
  ,noteCount: ['{count} notas', '{count} notes', '{count} notes', '{count} ohar', '{count} Notizen', '{count} notes', '{count} note', '{count} notas', '{count} notas']
  ,stickyEmpty: ['Crea una nota para guardar una idea, una lista o una imagen.', 'Create a note to save an idea, list or image.', 'Crea una nota per desar una idea, una llista o una imatge.', 'Sortu ohar bat ideia, zerrenda edo irudi bat gordetzeko.', 'Erstelle eine Notiz für eine Idee, Liste oder ein Bild.', 'Créez une note pour enregistrer une idée, une liste ou une image.', 'Crea una nota per salvare un’idea, una lista o un’immagine.', 'Cria uma nota para guardar uma ideia, lista ou imagem.', 'Crea unha nota para gardar unha idea, lista ou imaxe.']
  ,untitledNote: ['Sin título', 'Untitled', 'Sense títol', 'Izenbururik gabe', 'Ohne Titel', 'Sans titre', 'Senza titolo', 'Sem título', 'Sen título']
  ,pinnedNote: ['Fijada', 'Pinned', 'Fixada', 'Finkatuta', 'Angeheftet', 'Épinglée', 'Fissata', 'Fixada', 'Fixada']
  ,emptyNote: ['Nota vacía', 'Empty note', 'Nota buida', 'Ohar hutsa', 'Leere Notiz', 'Note vide', 'Nota vuota', 'Nota vazia', 'Nota baleira']
  ,pin: ['Fijar', 'Pin', 'Fixa', 'Finkatu', 'Anheften', 'Épingler', 'Fissa', 'Fixar', 'Fixar']
  ,unpin: ['Desfijar', 'Unpin', 'Desfixa', 'Desfinkatu', 'Lösen', 'Désépingler', 'Sblocca', 'Desafixar', 'Desfixar']
  ,delete: ['Eliminar', 'Delete', 'Suprimeix', 'Ezabatu', 'Löschen', 'Supprimer', 'Elimina', 'Eliminar', 'Eliminar']
  ,editNote: ['Editar nota', 'Edit note', 'Edita la nota', 'Editatu oharra', 'Notiz bearbeiten', 'Modifier la note', 'Modifica nota', 'Editar nota', 'Editar nota']
  ,noteTitlePlaceholder: ['Título de la nota', 'Note title', 'Títol de la nota', 'Oharraren izenburua', 'Notiztitel', 'Titre de la note', 'Titolo della nota', 'Título da nota', 'Título da nota']
  ,noteContent: ['Contenido de la nota', 'Note content', 'Contingut de la nota', 'Oharraren edukia', 'Notizinhalt', 'Contenu de la note', 'Contenuto della nota', 'Conteúdo da nota', 'Contido da nota']
  ,fontFamily: ['Fuente', 'Font', 'Font', 'Letra-tipoa', 'Schriftart', 'Police', 'Carattere', 'Tipo de letra', 'Fonte']
  ,fontSize: ['Tamaño', 'Size', 'Mida', 'Tamaina', 'Größe', 'Taille', 'Dimensione', 'Tamanho', 'Tamaño']
  ,heading: ['Título', 'Heading', 'Títol', 'Izenburua', 'Überschrift', 'Titre', 'Titolo', 'Título', 'Título']
  ,list: ['Lista', 'List', 'Llista', 'Zerrenda', 'Liste', 'Liste', 'Elenco', 'Lista', 'Lista']
  ,image: ['Imagen', 'Image', 'Imatge', 'Irudia', 'Bild', 'Image', 'Immagine', 'Imagem', 'Imaxe']
  ,noteColor: ['Color de la nota', 'Note color', 'Color de la nota', 'Oharraren kolorea', 'Notizfarbe', 'Couleur de la note', 'Colore della nota', 'Cor da nota', 'Cor da nota']
  ,saveNote: ['Guardar nota', 'Save note', 'Desa la nota', 'Gorde oharra', 'Notiz speichern', 'Enregistrer la note', 'Salva nota', 'Guardar nota', 'Gardar nota']
  ,calendarGoogleIcs: ['Google descarga los calendarios en un ZIP: extrae sus .ics e impórtalos juntos.', 'Google downloads calendars in a ZIP: extract its .ics files and import them together.', 'Google descarrega els calendaris en un ZIP: extreu-ne els .ics i importa’ls junts.', 'Googlek egutegiak ZIP batean deskargatzen ditu: atera .ics fitxategiak eta inportatu batera.', 'Google lädt Kalender als ZIP herunter: .ics-Dateien entpacken und zusammen importieren.', 'Google télécharge les calendriers dans un ZIP : extrayez les .ics et importez-les ensemble.', 'Google scarica i calendari in uno ZIP: estrai i .ics e importali insieme.', 'O Google descarrega calendários num ZIP: extrai os .ics e importa-os juntos.', 'Google descarga os calendarios nun ZIP: extrae os .ics e impórtaos xuntos.']
  ,calendarMicrosoftIcs: ['Importa un .ics o configura tu propia conexión segura.', 'Import an .ics file or set up your own secure connection.', 'Importa un .ics o configura la teva connexió segura.', 'Inportatu .ics bat edo konfiguratu zure konexio segurua.', 'Importiere eine .ics-Datei oder richte deine sichere Verbindung ein.', 'Importez un .ics ou configurez votre propre connexion sécurisée.', 'Importa un .ics o configura la tua connessione sicura.', 'Importa um .ics ou configura a tua ligação segura.', 'Importa un .ics ou configura a túa conexión segura.']
  ,calendarPersonalStorage: ['La conexión personal es opcional. El Client ID, los permisos y los datos se guardan únicamente en tu navegador; DashboardDP no utiliza servidores propios.', 'The personal connection is optional. Client ID, permissions and data stay only in your browser; DashboardDP uses no own server.', 'La connexió personal és opcional. El Client ID, els permisos i les dades només es desen al navegador; DashboardDP no usa servidor propi.', 'Konexio pertsonala aukerakoa da. Client IDa, baimenak eta datuak zure nabigatzailean soilik gordetzen dira; DashboardDPk ez du zerbitzari propiorik erabiltzen.', 'Die persönliche Verbindung ist optional. Client ID, Berechtigungen und Daten bleiben nur im Browser; DashboardDP nutzt keinen eigenen Server.', 'La connexion personnelle est facultative. Client ID, autorisations et données restent dans votre navigateur ; DashboardDP n’utilise aucun serveur propre.', 'La connessione personale è opzionale. Client ID, autorizzazioni e dati restano solo nel browser; DashboardDP non usa server propri.', 'A ligação pessoal é opcional. Client ID, permissões e dados ficam apenas no navegador; o DashboardDP não usa servidor próprio.', 'A conexión persoal é opcional. Client ID, permisos e datos só quedan no navegador; DashboardDP non usa servidor propio.']
  ,calendarGuideLead: ['Esta conexión es personal y opcional: creas tu propio Client ID y autorizas tu propia cuenta. No introduzcas contraseñas ni claves secretas. Los datos de acceso se guardan solo en tu navegador y no se incluyen al exportar el Dashboard.', 'This is a personal, optional connection: you create your own Client ID and authorize your own account. Never enter passwords or client secrets. Access data stays in your browser and is not included in Dashboard exports.', 'Aquesta connexió és personal i opcional: crees el teu Client ID i autoritzes el teu compte. No introdueixis contrasenyes ni claus secretes. Les dades només es desen al navegador i no s’exporten.', 'Konexio hau pertsonala eta aukerakoa da: zure Client IDa sortu eta zure kontua baimentzen duzu. Ez sartu pasahitzik edo gako sekreturik. Datuak nabigatzailean bakarrik gordetzen dira.', 'Diese Verbindung ist persönlich und optional: Du erstellst deine Client ID und autorisierst dein Konto. Gib niemals Passwörter oder Client Secrets ein. Zugangsdaten bleiben im Browser und werden nicht exportiert.', 'Cette connexion est personnelle et facultative : vous créez votre Client ID et autorisez votre compte. Ne saisissez jamais de mot de passe ni de secret client. Les données restent dans le navigateur et ne sont pas exportées.', 'Questa connessione è personale e facoltativa: crei il tuo Client ID e autorizzi il tuo account. Non inserire password o client secret. I dati restano nel browser e non vengono esportati.', 'Esta ligação é pessoal e opcional: crias o teu Client ID e autorizas a tua conta. Nunca introduzas palavras-passe ou client secret. Os dados ficam no navegador e não são exportados.', 'Esta conexión é persoal e opcional: creas o teu Client ID e autorizas a túa conta. Non introduzas contrasinais nin client secret. Os datos quedan no navegador e non se exportan.']
  ,calendarSecurityResponsibility: ['Seguridad y responsabilidad: esta opción es avanzada y voluntaria. Tú gestionas tu proyecto OAuth y sus permisos. DashboardDP solo solicita acceso al calendario que eliges mediante la ventana oficial del proveedor.', 'Security and responsibility: this is an advanced, voluntary option. You manage your OAuth project and its permissions. DashboardDP requests access only to the calendar you choose through the provider’s official window.', 'Seguretat i responsabilitat: és una opció avançada i voluntària. Tu gestiones el projecte OAuth i els permisos. DashboardDP només demana accés al calendari triat mitjançant la finestra oficial.', 'Segurtasuna eta erantzukizuna: aukera aurreratu eta borondatezkoa da. Zuk kudeatzen dituzu OAuth proiektua eta baimenak. DashboardDPk aukeratutako egutegirako sarbidea besterik ez du eskatzen.', 'Sicherheit und Verantwortung: Dies ist eine freiwillige erweiterte Option. Du verwaltest dein OAuth-Projekt und dessen Berechtigungen. DashboardDP fordert nur Zugriff auf den gewählten Kalender über das offizielle Fenster an.', 'Sécurité et responsabilité : cette option est avancée et volontaire. Vous gérez votre projet OAuth et ses autorisations. DashboardDP ne demande l’accès qu’au calendrier choisi via la fenêtre officielle.', 'Sicurezza e responsabilità: questa è un’opzione avanzata e volontaria. Gestisci tu il progetto OAuth e le autorizzazioni. DashboardDP richiede accesso solo al calendario scelto tramite la finestra ufficiale.', 'Segurança e responsabilidade: esta opção é avançada e voluntária. Tu geres o projeto OAuth e as permissões. O DashboardDP pede acesso apenas ao calendário escolhido pela janela oficial.', 'Seguridade e responsabilidade: esta opción é avanzada e voluntaria. Ti xestionas o proxecto OAuth e os permisos. DashboardDP só solicita acceso ao calendario elixido pola xanela oficial.']
  ,backToBoard: ['Volver al tablero', 'Back to board', 'Tornar al tauler', 'Itzuli taulara', 'Zurück zur Tafel', 'Retour au tableau', 'Torna alla bacheca', 'Voltar ao quadro', 'Volver ao taboleiro']
  ,redirectCopied: ['URI copiada', 'URI copied', 'URI copiada', 'URIa kopiatuta', 'URI kopiert', 'URI copiée', 'URI copiata', 'URI copiado', 'URI copiada']
  ,connectionReady: ['Conexión preparada', 'Connection ready', 'Connexió preparada', 'Konexioa prest', 'Verbindung bereit', 'Connexion prête', 'Connessione pronta', 'Ligação pronta', 'Conexión preparada']
  ,disconnected: ['Desconectado', 'Disconnected', 'Desconnectat', 'Deskonektatuta', 'Getrennt', 'Déconnecté', 'Disconnesso', 'Desligado', 'Desconectado']
  ,calendarPermissionTitle: ['Antes de conectar {service}', 'Before connecting {service}', 'Abans de connectar {service}', '{service} konektatu aurretik', 'Vor dem Verbinden mit {service}', 'Avant de connecter {service}', 'Prima di connettere {service}', 'Antes de ligar {service}', 'Antes de conectar {service}']
  ,calendarPermissionIntro: ['Brave mostrará un aviso de permiso. Es normal: permite a DashboardDP comunicarse solo con los servicios oficiales necesarios para iniciar sesión y sincronizar tu calendario.', 'Brave will show a permission prompt. This is normal: it allows DashboardDP to communicate only with the official services needed to sign in and sync your calendar.', 'Brave mostrarà un avís de permís. És normal: permet a DashboardDP comunicar-se només amb els serveis oficials necessaris per iniciar sessió i sincronitzar el calendari.', 'Brave-k baimen-ohar bat erakutsiko du. Normala da: DashboardDPri saioa hasteko eta egutegia sinkronizatzeko behar diren zerbitzu ofizialekin soilik komunikatzeko aukera ematen dio.', 'Brave zeigt eine Berechtigungsabfrage. Das ist normal: Sie erlaubt DashboardDP nur die Kommunikation mit den offiziellen Diensten für Anmeldung und Kalendersynchronisierung.', 'Brave affichera une demande d’autorisation. C’est normal : elle permet à DashboardDP de communiquer uniquement avec les services officiels nécessaires à la connexion et à la synchronisation du calendrier.', 'Brave mostrerà una richiesta di autorizzazione. È normale: consente a DashboardDP di comunicare solo con i servizi ufficiali necessari per accedere e sincronizzare il calendario.', 'O Brave mostrará um pedido de permissão. É normal: permite ao DashboardDP comunicar apenas com os serviços oficiais necessários para iniciar sessão e sincronizar o calendário.', 'Brave mostrará un aviso de permiso. É normal: permite que DashboardDP se comunique só cos servizos oficiais necesarios para iniciar sesión e sincronizar o calendario.']
  ,calendarPermissionServices: ['Brave mostrará estos servicios oficiales:', 'Brave will show these official services:', 'Brave mostrarà aquests serveis oficials:', 'Brave-k zerbitzu ofizial hauek erakutsiko ditu:', 'Brave zeigt diese offiziellen Dienste:', 'Brave affichera ces services officiels :', 'Brave mostrerà questi servizi ufficiali:', 'O Brave mostrará estes serviços oficiais:', 'Brave mostrará estes servizos oficiais:']
  ,calendarPermissionLogin: ['Inicio de sesión seguro', 'Secure sign-in', 'Inici de sessió segur', 'Saio-hasiera segurua', 'Sichere Anmeldung', 'Connexion sécurisée', 'Accesso sicuro', 'Início de sessão seguro', 'Inicio de sesión seguro']
  ,calendarPermissionToken: ['Autorización segura', 'Secure authorization', 'Autorització segura', 'Baimen segurua', 'Sichere Autorisierung', 'Autorisation sécurisée', 'Autorizzazione sicura', 'Autorização segura', 'Autorización segura']
  ,calendarPermissionSync: ['Sincronización del calendario', 'Calendar synchronization', 'Sincronització del calendari', 'Egutegiaren sinkronizazioa', 'Kalendersynchronisierung', 'Synchronisation du calendrier', 'Sincronizzazione del calendario', 'Sincronização do calendário', 'Sincronización do calendario']
  ,calendarPermissionNoAccess: ['DashboardDP no solicita acceso a tu contraseña, Gmail, Drive, favoritos ni historial. En el paso siguiente, el propio proveedor mostrará y pedirá los permisos concretos del calendario. Puedes cancelar ahora o en cualquier momento.', 'DashboardDP does not request access to your password, Gmail, Drive, bookmarks, or browsing history. In the next step, the provider itself will show and request the exact calendar permissions. You can cancel now or at any time.', 'DashboardDP no demana accés a la contrasenya, Gmail, Drive, favorits ni historial. En el pas següent, el proveïdor mostrarà i demanarà els permisos concrets del calendari. Pots cancel·lar ara o en qualsevol moment.', 'DashboardDPk ez du zure pasahitza, Gmail, Drive, laster-markoak edo nabigazio-historialerako sarbiderik eskatzen. Hurrengo urratsean, hornitzaileak berak egutegiaren baimen zehatzak erakutsi eta eskatuko ditu. Orain edo edozein unetan ezeztatu dezakezu.', 'DashboardDP fordert keinen Zugriff auf dein Passwort, Gmail, Drive, Lesezeichen oder den Browserverlauf an. Im nächsten Schritt zeigt der Anbieter selbst die genauen Kalenderberechtigungen an und fordert sie an. Du kannst jetzt oder jederzeit abbrechen.', 'DashboardDP ne demande aucun accès à votre mot de passe, Gmail, Drive, vos favoris ou votre historique de navigation. À l’étape suivante, le fournisseur affichera et demandera les autorisations précises du calendrier. Vous pouvez annuler maintenant ou à tout moment.', 'DashboardDP non richiede accesso alla password, a Gmail, Drive, preferiti o cronologia di navigazione. Nel passaggio successivo, il provider mostrerà e richiederà le autorizzazioni specifiche del calendario. Puoi annullare ora o in qualsiasi momento.', 'O DashboardDP não pede acesso à tua palavra-passe, Gmail, Drive, favoritos ou histórico de navegação. No passo seguinte, o próprio fornecedor mostrará e pedirá as permissões específicas do calendário. Podes cancelar agora ou a qualquer momento.', 'DashboardDP non solicita acceso ao teu contrasinal, Gmail, Drive, favoritos ou historial de navegación. No seguinte paso, o propio provedor mostrará e pedirá os permisos concretos do calendario. Podes cancelar agora ou en calquera momento.']
  ,calendarPermissionContinue: ['Continuar y mostrar permiso de Brave', 'Continue and show Brave permission', 'Continua i mostra el permís de Brave', 'Jarraitu eta erakutsi Brave-ren baimena', 'Fortfahren und Brave-Berechtigung anzeigen', 'Continuer et afficher l’autorisation Brave', 'Continua e mostra l’autorizzazione di Brave', 'Continuar e mostrar permissão do Brave', 'Continuar e mostrar permiso de Brave']
  ,notesVisible: ['Notas visibles', 'Visible notes', 'Notes visibles', 'Ohar ikusgaiak', 'Sichtbare Notizen', 'Notes visibles', 'Note visibili', 'Notas visíveis', 'Notas visibles']
  ,showInPanel: ['Mostrar en mi barra personalizada', 'Show in my custom bar', 'Mostra a la meva barra personalitzada', 'Erakutsi nire barra pertsonalizatuan', 'In meiner persönlichen Leiste anzeigen', 'Afficher dans ma barre personnalisée', 'Mostra nella mia barra personalizzata', 'Mostrar na minha barra personalizada', 'Mostrar na miña barra personalizada']
  ,noNotesVisible: ['Aún no has elegido notas para mostrar aquí.', 'You have not selected any notes to show here yet.', 'Encara no has triat notes per mostrar aquí.', 'Oraindik ez duzu hemen erakusteko oharrik aukeratu.', 'Du hast noch keine Notizen ausgewählt, die hier angezeigt werden.', 'Vous n’avez pas encore sélectionné de notes à afficher ici.', 'Non hai ancora scelto note da mostrare qui.', 'Ainda não escolheste notas para mostrar aqui.', 'Aínda non elixiches notas para mostrar aquí.']
  ,chooseNotes: ['Elegir notas', 'Choose notes', 'Triar notes', 'Aukeratu oharrak', 'Notizen auswählen', 'Choisir des notes', 'Scegli note', 'Escolher notas', 'Escoller notas']
  ,notesMasonry: ['Usar dos columnas masonry', 'Use two-column masonry', 'Utilitza dues columnes masonry', 'Erabili bi zutabeko masonry', 'Zweispaltiges Masonry verwenden', 'Utiliser deux colonnes masonry', 'Usa due colonne masonry', 'Usar duas colunas masonry', 'Usar dúas columnas masonry']
  ,notesStack: ['Usar una columna', 'Use one column', 'Utilitza una columna', 'Erabili zutabe bat', 'Eine Spalte verwenden', 'Utiliser une colonne', 'Usa una colonna', 'Usar uma coluna', 'Usar unha columna']
  ,sortQuickAccess: ['Ordenar fijados y grupos', 'Sort pinned items and groups', 'Ordena fixats i grups', 'Ordenatu finkatuak eta taldeak', 'Angeheftete Elemente und Gruppen sortieren', 'Trier les favoris épinglés et les groupes', 'Ordina elementi fissati e gruppi', 'Ordenar fixados e grupos', 'Ordenar fixados e grupos']
  ,sortWorkspaces: ['Ordenar espacios de trabajo', 'Sort workspaces', 'Ordena espais de treball', 'Ordenatu lan-eremuak', 'Arbeitsbereiche sortieren', 'Trier les espaces de travail', 'Ordina spazi di lavoro', 'Ordenar espaços de trabalho', 'Ordenar espazos de traballo']
  ,sortCustom: ['Personalizado', 'Custom', 'Personalitzat', 'Pertsonalizatua', 'Benutzerdefiniert', 'Personnalisé', 'Personalizzato', 'Personalizado', 'Personalizado']
  ,sortNameAsc: ['Nombre: A–Z', 'Name: A–Z', 'Nom: A–Z', 'Izena: A–Z', 'Name: A–Z', 'Nom : A–Z', 'Nome: A–Z', 'Nome: A–Z', 'Nome: A–Z']
  ,sortNameDesc: ['Nombre: Z–A', 'Name: Z–A', 'Nom: Z–A', 'Izena: Z–A', 'Name: Z–A', 'Nom : Z–A', 'Nome: Z–A', 'Nome: Z–A', 'Nome: Z–A']
  ,sortRecentDesc: ['Fecha: reciente → antiguo', 'Date: newest → oldest', 'Data: recent → antiga', 'Data: berriena → zaharrena', 'Datum: neu → alt', 'Date : récente → ancienne', 'Data: recente → meno recente', 'Data: recente → antiga', 'Data: recente → antiga']
  ,sortRecentAsc: ['Fecha: antiguo → reciente', 'Date: oldest → newest', 'Data: antiga → recent', 'Data: zaharrena → berriena', 'Datum: alt → neu', 'Date : ancienne → récente', 'Data: meno recente → recente', 'Data: antiga → recente', 'Data: antiga → recente']
  ,sortUseDesc: ['Uso: mayor → menor', 'Usage: highest → lowest', 'Ús: major → menor', 'Erabilera: handiena → txikiena', 'Nutzung: hoch → niedrig', 'Utilisation : élevée → faible', 'Uso: maggiore → minore', 'Uso: maior → menor', 'Uso: maior → menor']
  ,sortUseAsc: ['Uso: menor → mayor', 'Usage: lowest → highest', 'Ús: menor → major', 'Erabilera: txikiena → handiena', 'Nutzung: niedrig → hoch', 'Utilisation : faible → élevée', 'Uso: minore → maggiore', 'Uso: menor → maior', 'Uso: menor → maior']
  ,sortAccessDesc: ['Acceso: reciente → antiguo', 'Access: newest → oldest', 'Accés: recent → antic', 'Sarbidea: berriena → zaharrena', 'Zugriff: neu → alt', 'Accès : récent → ancien', 'Accesso: recente → meno recente', 'Acesso: recente → antigo', 'Acceso: recente → antigo']
  ,sortAccessAsc: ['Acceso: antiguo → reciente', 'Access: oldest → newest', 'Accés: antic → recent', 'Sarbidea: zaharrena → berriena', 'Zugriff: alt → neu', 'Accès : ancien → récent', 'Accesso: meno recente → recente', 'Acesso: antigo → recente', 'Acceso: antigo → recente']
};
Object.entries(WIDGET_TEXT).forEach(([key, translations]) => {
  LANGUAGES.forEach((language, index) => { UI_TEXT[language.id][key] = translations[index]; });
});

const UI_SOURCE_KEYS = Object.fromEntries(Object.keys(UI_TEXT.es).map((key) => [UI_TEXT.es[key], key]));
const UI_SOURCE_TEXT_NODES = new WeakMap();
const UI_SOURCE_ATTRIBUTES = new WeakMap();
function localizeUiString(value) {
  if (typeof value !== 'string') return value;
  const key = UI_SOURCE_KEYS[value];
  return key ? t(key) : value;
}

function translateStaticInterface() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const source = UI_SOURCE_TEXT_NODES.get(node) || node.nodeValue;
    if (!UI_SOURCE_KEYS[source]) return;
    UI_SOURCE_TEXT_NODES.set(node, source);
    node.nodeValue = localizeUiString(source);
  });
  document.querySelectorAll('[title], [aria-label], [placeholder]').forEach((node) => {
    const saved = UI_SOURCE_ATTRIBUTES.get(node) || {};
    ['title', 'aria-label', 'placeholder'].forEach((attribute) => {
      if (!node.hasAttribute(attribute)) return;
      const source = saved[attribute] || node.getAttribute(attribute);
      if (!UI_SOURCE_KEYS[source]) return;
      saved[attribute] = source;
      node.setAttribute(attribute, localizeUiString(source));
    });
    if (Object.keys(saved).length) UI_SOURCE_ATTRIBUTES.set(node, saved);
  });
}

function getLanguage() {
  const id = state.data && state.data.settings ? state.data.settings.language : APP.defaults.settings.language;
  return LANGUAGES.some((language) => language.id === id) ? id : 'es';
}

function getLocale() {
  return LANGUAGES.find((language) => language.id === getLanguage()).locale;
}

function t(key, variables = {}) {
  const languageIndex = Math.max(0, LANGUAGES.findIndex((language) => language.id === getLanguage()));
  let value = (UI_TEXT[getLanguage()] && UI_TEXT[getLanguage()][key]) || UI_TEXT.es[key] || (UI_COMMON[key] && (UI_COMMON[key][languageIndex] || UI_COMMON[key][0])) || key;
  Object.entries(variables).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });
  return value;
}

let refreshClock = () => {};
function applyInterfaceLanguage() {
  document.documentElement.lang = getLanguage();
  translateStaticInterface();
  const staticText = [
    ['.sidebar-item[data-view="home"] span', 'home'],
    ['.sidebar-item[data-view="all"] span', 'all'],
    ['.sidebar-item[data-view="pinned"] span', 'pinned'],
    ['.sidebar-item[data-view="later"] span', 'later'],
    ['.sidebar-item[data-view="recent"] span', 'recent'],
    ['.sidebar-item[data-view="frequent"] span', 'frequent'],
    ['#sidebar .sidebar-section:nth-child(2) .sidebar-section-title', 'categories'],
    ['#workspaces .section-title', 'workspaces'],
    ['#quickAccess .section-title', 'quick'],
    ['#panel .panel-section:nth-child(1) .panel-section-title', 'recent'],
    ['#panel .panel-section:nth-child(2) .panel-section-title', 'statistics'],
    ['#stats .stat:nth-child(1) dt', 'totalFavorites'],
    ['#stats .stat:nth-child(2) dt', 'categories'],
    ['#stats .stat:nth-child(3) dt', 'pinned']
  ];
  staticText.forEach(([selector, key]) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = t(key);
  });
  if (els.searchInput) {
    els.searchInput.placeholder = t('searchBookmarks');
    els.searchInput.setAttribute('aria-label', t('searchBookmarks'));
  }
  if (els.webSearchInput) {
    els.webSearchInput.placeholder = t('searchWeb');
    els.webSearchInput.setAttribute('aria-label', t('searchWeb'));
  }
  if (els.resultsCount && els.resultsCount.nextSibling) els.resultsCount.nextSibling.textContent = ` ${t('favorites')}`;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder)); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => { node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => { node.setAttribute('title', t(node.dataset.i18nTitle)); });
  refreshClock();
  if (calYear !== null) renderCalendar();
}

/* ---------- Utilidades ---------- */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function decodeEntities(text) {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeUrl(url) {
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getLegacyFaviconUrl(bookmark) {
  try {
    return new URL('/favicon.ico', bookmark.url).href;
  } catch {
    return '';
  }
}

function getBrowserFaviconUrl(bookmark, size = 128) {
  try {
    const api = getBrowserExtensionApi();
    if (!api?.runtime?.getURL || !isValidUrl(bookmark.url)) return '';
    const favicon = new URL(api.runtime.getURL('/_favicon/'));
    favicon.searchParams.set('pageUrl', bookmark.url);
    favicon.searchParams.set('size', String(Math.max(16, Math.min(128, Number(size) || 128))));
    return favicon.href;
  } catch {
    return '';
  }
}

function getFaviconSources(bookmark, size = 128) {
  if (bookmark.iconUrl && /^(data:image\/|https?:\/\/)/i.test(bookmark.iconUrl)) {
    return { primary: bookmark.iconUrl, fallback: getLegacyFaviconUrl(bookmark) };
  }
  const nativeIcon = getBrowserFaviconUrl(bookmark, size);
  const legacyIcon = getLegacyFaviconUrl(bookmark);
  return { primary: nativeIcon || legacyIcon, fallback: nativeIcon ? legacyIcon : '' };
}

function getFaviconUrl(bookmark, size = 128) {
  return getFaviconSources(bookmark, size).primary;
}

function optimizeBookmarkIcon(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      reject(new Error('Selecciona una imagen PNG, JPG o WebP.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('La imagen no es válida.'));
      image.onload = () => {
        const side = 128;
        const scale = Math.min(side / image.width, side / image.height, 1);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = side;
        canvas.height = side;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, side, side);
        context.drawImage(image, Math.round((side - width) / 2), Math.round((side - height) / 2), width, height);
        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl.length > 130000) { reject(new Error('La imagen sigue siendo demasiado grande.')); return; }
        resolve(dataUrl);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function escapeAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function highlightSearch(text) {
  const q = state.searchQuery.trim();
  if (!q || text === null || text === undefined || text === '') return escapeHtml(text);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp('(' + escaped + ')', 'ig'));
  return parts
    .map((part, i) => (i % 2 === 1 ? '<mark class="search-hit">' + escapeHtml(part) + '</mark>' : escapeHtml(part)))
    .join('');
}

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = localizeUiString(value);
      else if (key === 'html') node.innerHTML = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2), value);
      } else if (['disabled', 'checked', 'selected', 'hidden'].includes(key)) {
        if (key in node) node[key] = !!value;
        if (value) node.setAttribute(key, '');
        else node.removeAttribute(key);
      } else if (value !== undefined && value !== null) {
        node.setAttribute(key, ['title', 'aria-label', 'placeholder'].includes(key) ? localizeUiString(value) : value);
      }
    }
  }
  if (children) {
    for (const child of Array.isArray(children) ? children : [children]) {
      if (child == null) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(localizeUiString(child)) : child);
    }
  }
  return node;
}

/* ---------- Iconos SVG ---------- */
const ICONS = {
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><circle cx="12" cy="5" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="12" cy="19" r="1.8"></circle></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  duplicate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
  move: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"></path><path d="M19 9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 14.21 3 3 3 0 0 0 21 12.79z"></path></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
  export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
  import: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
  backup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
  contract: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.7-9.1A5 5 0 1 1 17.5 19z"></path></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"></rect><path d="m16 10 5-3v10l-5-3z"></path></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path><path d="M10 12v2h4v-2"></path></svg>'
};

const COLLECTION_ICON_OPTIONS = [
  { id: 'folder', label: 'Carpeta', icon: ICONS.folder },
  { id: 'briefcase', label: 'Trabajo', icon: ICONS.briefcase },
  { id: 'cloud', label: 'Nube', icon: ICONS.cloud },
  { id: 'video', label: 'Vídeo', icon: ICONS.video },
  { id: 'music', label: 'Música', icon: ICONS.music },
  { id: 'grid', label: 'Cuadrícula', icon: ICONS.grid }
];

function getCollectionIcon(id, fallback = 'folder') {
  return COLLECTION_ICON_OPTIONS.find((option) => option.id === id)
    || COLLECTION_ICON_OPTIONS.find((option) => option.id === fallback)
    || COLLECTION_ICON_OPTIONS[0];
}

function createCollectionIconPicker(initialId, onSelect, fallback = 'folder') {
  let selected = getCollectionIcon(initialId, fallback).id;
  const options = el('div', { class: 'collection-icon-options', role: 'radiogroup', 'aria-label': 'Tipo de icono' });
  COLLECTION_ICON_OPTIONS.forEach((option) => {
    const button = el('button', {
      class: `collection-icon-option${option.id === selected ? ' selected' : ''}`,
      type: 'button',
      title: option.label,
      'aria-label': option.label,
      'aria-checked': option.id === selected ? 'true' : 'false',
      role: 'radio',
      html: option.icon
    });
    button.addEventListener('click', () => {
      selected = option.id;
      options.querySelectorAll('.collection-icon-option').forEach((item) => {
        const active = item === button;
        item.classList.toggle('selected', active);
        item.setAttribute('aria-checked', active ? 'true' : 'false');
      });
      onSelect(selected);
    });
    options.appendChild(button);
  });
  return options;
}

/* ---------- Atajos rápidos (widgets de referencia) ---------- */
const SHORTCUTS = {
  brave: {
    label: 'Atajos de Brave',
    sections: [
      {
        name: 'Pestañas y ventanas',
        items: [
          { name: 'Nueva pestaña', keys: 'Ctrl + T' },
          { name: 'Cerrar pestaña', keys: 'Ctrl + W' },
          { name: 'Reabrir pestaña cerrada', keys: 'Ctrl + Mayús + T' },
          { name: 'Siguiente pestaña', keys: 'Ctrl + Tab' },
          { name: 'Pestaña anterior', keys: 'Ctrl + Mayús + Tab' },
          { name: 'Ir a la pestaña 1–8', keys: 'Ctrl + 1…8' },
          { name: 'Última pestaña', keys: 'Ctrl + 9' },
          { name: 'Nueva ventana', keys: 'Ctrl + N' },
          { name: 'Nueva ventana privada', keys: 'Ctrl + Mayús + N' }
        ]
      },
      {
        name: 'Barra de direcciones y búsqueda',
        items: [
          { name: 'Enfocar barra de direcciones', keys: 'Ctrl + L' },
          { name: 'Buscar con el buscador predeterminado', keys: 'Ctrl + E' },
          { name: 'Buscar en esta página', keys: 'Ctrl + F' },
          { name: 'Resultado siguiente', keys: 'Ctrl + G' },
          { name: 'Resultado anterior', keys: 'Ctrl + Mayús + G' }
        ]
      },
      {
        name: 'Navegación',
        items: [
          { name: 'Atrás', keys: 'Alt + ←' },
          { name: 'Adelante', keys: 'Alt + →' },
          { name: 'Recargar', keys: 'F5 / Ctrl + R' },
          { name: 'Recarga forzada', keys: 'Ctrl + Mayús + R' },
          { name: 'Página de inicio', keys: 'Alt + Inicio' },
          { name: 'Pantalla completa', keys: 'F11' }
        ]
      },
      {
        name: 'Historial y marcadores',
        items: [
          { name: 'Historial', keys: 'Ctrl + H' },
          { name: 'Descargas', keys: 'Ctrl + J' },
          { name: 'Añadir marcador', keys: 'Ctrl + D' },
          { name: 'Mostrar/ocultar barra de marcadores', keys: 'Ctrl + Mayús + B' },
          { name: 'Gestor de marcadores', keys: 'Ctrl + Mayús + O' }
        ]
      },
      {
        name: 'Zoom',
        items: [
          { name: 'Acercar', keys: 'Ctrl + +' },
          { name: 'Alejar', keys: 'Ctrl + -' },
          { name: 'Restablecer zoom', keys: 'Ctrl + 0' }
        ]
      }
    ]
  },
  firefox: {
    label: 'Atajos de Firefox',
    sections: [
      {
        name: 'Pestañas y ventanas',
        items: [
          { name: 'Nueva pestaña', keys: 'Ctrl + T' },
          { name: 'Cerrar pestaña', keys: 'Ctrl + W' },
          { name: 'Reabrir pestaña cerrada', keys: 'Ctrl + Mayús + T' },
          { name: 'Siguiente pestaña', keys: 'Ctrl + Tab' },
          { name: 'Pestaña anterior', keys: 'Ctrl + Mayús + Tab' },
          { name: 'Nueva ventana', keys: 'Ctrl + N' },
          { name: 'Nueva ventana privada', keys: 'Ctrl + Mayús + P' }
        ]
      },
      {
        name: 'Barra de direcciones y búsqueda',
        items: [
          { name: 'Enfocar barra de direcciones', keys: 'Ctrl + L' },
          { name: 'Buscar en la web', keys: 'Ctrl + K' },
          { name: 'Buscar en esta página', keys: 'Ctrl + F' },
          { name: 'Buscar de nuevo', keys: 'F3' }
        ]
      },
      {
        name: 'Navegación',
        items: [
          { name: 'Atrás', keys: 'Alt + ←' },
          { name: 'Adelante', keys: 'Alt + →' },
          { name: 'Recargar', keys: 'F5' },
          { name: 'Recarga forzada', keys: 'Ctrl + F5' },
          { name: 'Página de inicio', keys: 'Alt + Inicio' },
          { name: 'Pantalla completa', keys: 'F11' }
        ]
      },
      {
        name: 'Historial y marcadores',
        items: [
          { name: 'Historial', keys: 'Ctrl + H' },
          { name: 'Descargas', keys: 'Ctrl + J' },
          { name: 'Añadir marcador', keys: 'Ctrl + D' },
          { name: 'Mostrar/ocultar barra de marcadores', keys: 'Ctrl + Mayús + B' },
          { name: 'Gestor de marcadores', keys: 'Ctrl + Mayús + O' }
        ]
      },
      {
        name: 'Zoom',
        items: [
          { name: 'Acercar', keys: 'Ctrl + +' },
          { name: 'Alejar', keys: 'Ctrl + -' },
          { name: 'Restablecer zoom', keys: 'Ctrl + 0' }
        ]
      }
    ]
  },
  chrome: {
    label: 'Atajos de Google Chrome',
    sections: [
      {
        name: 'Pestañas y ventanas',
        items: [
          { name: 'Nueva pestaña', keys: 'Ctrl + T' },
          { name: 'Cerrar pestaña', keys: 'Ctrl + W' },
          { name: 'Reabrir pestaña cerrada', keys: 'Ctrl + Mayús + T' },
          { name: 'Siguiente pestaña', keys: 'Ctrl + Tab' },
          { name: 'Pestaña anterior', keys: 'Ctrl + Mayús + Tab' },
          { name: 'Ir a la pestaña 1–8', keys: 'Ctrl + 1…8' },
          { name: 'Última pestaña', keys: 'Ctrl + 9' },
          { name: 'Nueva ventana', keys: 'Ctrl + N' },
          { name: 'Nueva ventana de incógnito', keys: 'Ctrl + Mayús + N' }
        ]
      },
      {
        name: 'Barra de direcciones y búsqueda',
        items: [
          { name: 'Enfocar barra de direcciones', keys: 'Ctrl + L' },
          { name: 'Buscar con el buscador predeterminado', keys: 'Ctrl + E' },
          { name: 'Buscar en esta página', keys: 'Ctrl + F' },
          { name: 'Resultado siguiente', keys: 'Ctrl + G' },
          { name: 'Resultado anterior', keys: 'Ctrl + Mayús + G' }
        ]
      },
      {
        name: 'Navegación',
        items: [
          { name: 'Atrás', keys: 'Alt + ←' },
          { name: 'Adelante', keys: 'Alt + →' },
          { name: 'Recargar', keys: 'F5 / Ctrl + R' },
          { name: 'Recarga forzada', keys: 'Ctrl + Mayús + R' },
          { name: 'Página de inicio', keys: 'Alt + Inicio' },
          { name: 'Pantalla completa', keys: 'F11' }
        ]
      },
      {
        name: 'Historial y marcadores',
        items: [
          { name: 'Historial', keys: 'Ctrl + H' },
          { name: 'Descargas', keys: 'Ctrl + J' },
          { name: 'Añadir marcador', keys: 'Ctrl + D' },
          { name: 'Mostrar/ocultar barra de marcadores', keys: 'Ctrl + Mayús + B' },
          { name: 'Gestor de marcadores', keys: 'Ctrl + Mayús + O' }
        ]
      },
      {
        name: 'Herramientas',
        items: [
          { name: 'Imprimir', keys: 'Ctrl + P' },
          { name: 'Guardar página', keys: 'Ctrl + S' },
          { name: 'Zoom: acercar / alejar / reiniciar', keys: 'Ctrl + + / - / 0' }
        ]
      }
    ]
  },
  edge: {
    label: 'Atajos de Microsoft Edge',
    sections: [
      {
        name: 'Pestañas y ventanas',
        items: [
          { name: 'Nueva pestaña', keys: 'Ctrl + T' },
          { name: 'Cerrar pestaña', keys: 'Ctrl + W' },
          { name: 'Reabrir pestaña cerrada', keys: 'Ctrl + Mayús + T' },
          { name: 'Siguiente pestaña', keys: 'Ctrl + Tab' },
          { name: 'Pestaña anterior', keys: 'Ctrl + Mayús + Tab' },
          { name: 'Nueva ventana', keys: 'Ctrl + N' },
          { name: 'Nueva ventana InPrivate', keys: 'Ctrl + Mayús + N' },
          { name: 'Pantalla dividida', keys: 'Ctrl + Mayús + 2' }
        ]
      },
      {
        name: 'Barra de direcciones y búsqueda',
        items: [
          { name: 'Enfocar barra de direcciones', keys: 'Ctrl + L' },
          { name: 'Buscar en esta página', keys: 'Ctrl + F' },
          { name: 'Resultado siguiente', keys: 'Ctrl + G' }
        ]
      },
      {
        name: 'Navegación',
        items: [
          { name: 'Atrás', keys: 'Alt + ←' },
          { name: 'Adelante', keys: 'Alt + →' },
          { name: 'Recargar', keys: 'F5 / Ctrl + R' },
          { name: 'Recarga forzada', keys: 'Ctrl + Mayús + R' },
          { name: 'Página de inicio', keys: 'Alt + Inicio' },
          { name: 'Pantalla completa', keys: 'F11' }
        ]
      },
      {
        name: 'Favoritos y colecciones',
        items: [
          { name: 'Añadir a favoritos', keys: 'Ctrl + D' },
          { name: 'Mostrar/ocultar barra de favoritos', keys: 'Ctrl + Mayús + B' },
          { name: 'Gestor de favoritos', keys: 'Ctrl + Mayús + O' },
          { name: 'Colecciones', keys: 'Ctrl + Mayús + Y' },
          { name: 'Historial', keys: 'Ctrl + H' },
          { name: 'Descargas', keys: 'Ctrl + J' }
        ]
      },
      {
        name: 'Herramientas',
        items: [
          { name: 'Imprimir', keys: 'Ctrl + P' },
          { name: 'Guardar página', keys: 'Ctrl + S' },
          { name: 'Zoom: acercar / alejar / reiniciar', keys: 'Ctrl + + / - / 0' }
        ]
      }
    ]
  },
  windows: {
    label: 'Atajos de Windows',
    sections: [
      {
        name: 'Escritorio y ventanas',
        items: [
          { name: 'Mostrar/ocultar escritorio', keys: 'Win + D' },
          { name: 'Minimizar todas las ventanas', keys: 'Win + M' },
          { name: 'Maximizar ventana', keys: 'Win + ↑' },
          { name: 'Minimizar ventana', keys: 'Win + ↓' },
          { name: 'Ajustar a la izquierda', keys: 'Win + ←' },
          { name: 'Ajustar a la derecha', keys: 'Win + →' },
          { name: 'Cambiar de aplicación', keys: 'Alt + Tab' },
          { name: 'Cerrar ventana', keys: 'Alt + F4' },
          { name: 'Seleccionar ventana con teclado', keys: 'Ctrl + Alt + Tab' }
        ]
      },
      {
        name: 'Sistema',
        items: [
          { name: 'Configuración', keys: 'Win + I' },
          { name: 'Explorador de archivos', keys: 'Win + E' },
          { name: 'Ejecutar', keys: 'Win + R' },
          { name: 'Buscar', keys: 'Win + S' },
          { name: 'Administrador de tareas', keys: 'Ctrl + Mayús + Esc' },
          { name: 'Bloquear equipo', keys: 'Win + L' },
          { name: 'Menú de usuario avanzado', keys: 'Win + X' },
          { name: 'Configuración rápida', keys: 'Win + A' },
          { name: 'Cerrar sesión', keys: 'Ctrl + Alt + Supr' }
        ]
      },
      {
        name: 'Capturas y herramientas',
        items: [
          { name: 'Captura de pantalla', keys: 'Win + Mayús + S' },
          { name: 'Barra de juego / grabar', keys: 'Win + G' },
          { name: 'Portapapeles histórico', keys: 'Win + V' },
          { name: 'Emojis y símbolos', keys: 'Win + .' },
          { name: 'Dictado', keys: 'Win + H' },
          { name: 'Lupa', keys: 'Win + + / -' }
        ]
      },
      {
        name: 'Edición de texto',
        items: [
          { name: 'Copiar', keys: 'Ctrl + C' },
          { name: 'Cortar', keys: 'Ctrl + X' },
          { name: 'Pegar', keys: 'Ctrl + V' },
          { name: 'Deshacer', keys: 'Ctrl + Z' },
          { name: 'Rehacer', keys: 'Ctrl + Y' },
          { name: 'Seleccionar todo', keys: 'Ctrl + A' },
          { name: 'Guardar', keys: 'Ctrl + S' },
          { name: 'Buscar', keys: 'Ctrl + F' }
        ]
      }
    ]
  },
  linux: {
    label: 'Comandos de Linux',
    sections: [
      {
        name: 'Sistema',
        items: [
          { name: 'Ver información del SO', cmd: 'cat /etc/os-release' },
          { name: 'Versión del kernel', cmd: 'uname -r' },
          { name: 'Memoria libre', cmd: 'free -h' },
          { name: 'Espacio en disco', cmd: 'df -h' },
          { name: 'Tiempo encendido', cmd: 'uptime' },
          { name: 'Apagar equipo', cmd: 'sudo shutdown now' },
          { name: 'Reiniciar', cmd: 'sudo reboot' }
        ]
      },
      {
        name: 'Procesos',
        items: [
          { name: 'Listar procesos', cmd: 'ps aux' },
          { name: 'Monitor interactivo', cmd: 'top' },
          { name: 'Monitor moderno', cmd: 'htop' },
          { name: 'Terminar por nombre', cmd: 'pkill firefox' },
          { name: 'Terminar por PID', cmd: 'kill -9 1234' },
          { name: 'Buscar proceso', cmd: 'pgrep -l firefox' }
        ]
      },
      {
        name: 'Red',
        items: [
          { name: 'Direcciones IP', cmd: 'ip a' },
          { name: 'Ping', cmd: 'ping -c 4 ejemplo.com' },
          { name: 'Resolver DNS', cmd: 'dig dominio.es' },
          { name: 'Puertos en escucha', cmd: 'ss -tulpn' },
          { name: 'Cabeceras de una URL', cmd: 'curl -I https://ejemplo.com' }
        ]
      },
      {
        name: 'Archivos y carpetas',
        items: [
          { name: 'Listar archivos', cmd: 'ls -la' },
          { name: 'Cambiar de directorio', cmd: 'cd ruta' },
          { name: 'Copiar', cmd: 'cp -r origen destino' },
          { name: 'Mover o renombrar', cmd: 'mv origen destino' },
          { name: 'Eliminar (con cuidado)', cmd: 'rm -rf carpeta' },
          { name: 'Crear directorio', cmd: 'mkdir -p ruta' },
          { name: 'Buscar archivos', cmd: 'find . -name "*.md"' },
          { name: 'Buscar texto', cmd: 'grep -rn "texto" .' },
          { name: 'Permisos', cmd: 'chmod 755 archivo' },
          { name: 'Propietario', cmd: 'chown usuario:grupo archivo' }
        ]
      },
      {
        name: 'Paquetes y compresión',
        items: [
          { name: 'Actualizar (Debian/Ubuntu)', cmd: 'sudo apt update && sudo apt upgrade' },
          { name: 'Instalar paquete', cmd: 'sudo apt install nombre' },
          { name: 'Buscar paquete', cmd: 'apt search nombre' },
          { name: 'Comprimir en tar.gz', cmd: 'tar -czvf archivo.tar.gz carpeta' },
          { name: 'Extraer tar.gz', cmd: 'tar -xzvf archivo.tar.gz' },
          { name: 'Comprimir en zip', cmd: 'zip -r archivo.zip carpeta' }
        ]
      }
    ]
  }
};

/* ---------- Estado global ---------- */
const state = {
  data: null,
  currentView: 'home',
  activeCategoryId: null,
  searchQuery: '',
  auditStatusFilter: null,
  viewMode: 'grid',
  quickViewMode: 'icon',
  sortMode: 'custom',
  editMode: false,
  commandIndex: 0,
  draggingId: null,
  draggingQuickKey: null,
  draggingWorkspaceId: null,
  webIndex: 0
};

/* ---------- Referencias DOM ---------- */
const $ = (id) => document.getElementById(id);
const els = {
  sidebar: $('sidebar'),
  sidebarToggle: $('sidebarToggle'),
  sidebarResizer: $('sidebarResizer'),
  panel: $('panel'),
  panelToggle: $('panelToggle'),
  panelResizer: $('panelResizer'),
  panelContent: $('panelContent'),
  panelModeControl: $('panelModeControl'),
  panelModeLabel: $('panelModeLabel'),
  panelModeBtn: $('panelModeBtn'),
  panelLayoutBtn: $('panelLayoutBtn'),
  panelResetLayoutBtn: $('panelResetLayoutBtn'),
  panelFullBtn: $('panelFullBtn'),
  panelRecentSection: $('panelRecentSection'),
  panelStatsSection: $('panelStatsSection'),
  panelToolsSection: $('panelToolsSection'),
  content: $('content'),
  categoriesList: $('categoriesList'),
  addCategoryBtn: $('addCategoryBtn'),
  collapseAllBtn: $('collapseAllBtn'),
  sortCategoriesBtn: $('sortCategoriesBtn'),
  addBookmarkBtn: $('addBookmarkBtn'),
  calendarSyncBtn: $('calendarSyncBtn'),
  settingsBtn: $('settingsBtn'),
  brandName: $('brandName'),
  themeToggle: $('themeToggle'),
  themeIcon: $('themeIcon'),
  widgetPlayerBtn: $('widgetPlayerBtn'),
  widgetWeatherBtn: $('widgetWeatherBtn'),
  widgetCalendarBtn: $('widgetCalendarBtn'),
  widgetTasksBtn: $('widgetTasksBtn'),
  widgetNotesBtn: $('widgetNotesBtn'),
  widgetBraveBtn: $('widgetBraveBtn'),
  widgetFirefoxBtn: $('widgetFirefoxBtn'),
  widgetChromeBtn: $('widgetChromeBtn'),
  widgetEdgeBtn: $('widgetEdgeBtn'),
  widgetWindowsBtn: $('widgetWindowsBtn'),
  widgetLinuxBtn: $('widgetLinuxBtn'),
  widgetPlayer: $('widgetPlayer'),
  widgetWeather: $('widgetWeather'),
  widgetCalendar: $('widgetCalendar'),
  playerTrack: $('playerTrack'),
  playerMeta: $('playerMeta'),
  playerPlayBtn: $('playerPlayBtn'),
  playerPrevBtn: $('playerPrevBtn'),
  playerNextBtn: $('playerNextBtn'),
  playerSeek: $('playerSeek'),
  playerTime: $('playerTime'),
  playerSelectBtn: $('playerSelectBtn'),
  playerFolderBtn: $('playerFolderBtn'),
  weatherContent: $('weatherContent'),
  calTitle: $('calTitle'),
  calGrid: $('calGrid'),
  calPrev: $('calPrev'),
  calNext: $('calNext'),
  greeting: $('greeting'),
  heroTitle: $('heroTitle'),
  searchInput: $('searchInput'),
  searchForm: $('searchForm'),
  quickArea: $('quickArea'),
  quickViewMode: $('quickViewMode'),
  quickSortMode: $('quickSortMode'),
  quickEditModeBtn: $('quickEditModeBtn'),
  addQuickGroupBtn: $('addQuickGroupBtn'),
  workspaceArea: $('workspaceArea'),
  workspaceSortMode: $('workspaceSortMode'),
  addWorkspaceBtn: $('addWorkspaceBtn'),
  viewHome: $('view-home'),
  viewCategory: $('view-category'),
  viewTitle: $('viewTitle'),
  breadcrumb: $('breadcrumb'),
  subcats: $('subcats'),
  viewMode: $('viewMode'),
  sortMode: $('sortMode'),
  resultsCount: $('resultsCount'),
  bookmarksGrid: $('bookmarksGrid'),
  emptyState: $('emptyState'),
  emptyTitle: $('emptyTitle'),
  emptyText: $('emptyText'),
  emptyAddBtn: $('emptyAddBtn'),
  clearSearchBtn: $('clearSearchBtn'),
  webSearchForm: $('webSearchForm'),
  webEngine: $('webEngine'),
  webSearchInput: $('webSearchInput'),
  webSuggestions: $('webSuggestions'),
  tooltip: $('tooltip'),
  dropOverlay: $('dropOverlay'),
  recentList: $('recentList'),
  statTotal: $('statTotal'),
  statCategories: $('statCategories'),
  statPinned: $('statPinned'),
  syncStatus: $('syncStatus'),
  footerCopyright: $('footerCopyright'),
  supportLink: $('supportLink'),
  modalOverlay: $('modalOverlay'),
  commandPalette: $('commandPalette'),
  commandInput: $('commandInput'),
  commandList: $('commandList'),
  commandEmpty: $('commandEmpty'),
  toastContainer: $('toastContainer'),
  importFile: $('importFile')
};

/* ============================================================
   CAPA DE DATOS (localStorage)
   ============================================================ */

function defaultData() {
  return {
    version: APP.version,
    settings: { ...APP.defaults.settings },
    categories: [],
    bookmarks: [],
    quickGroups: [],
    workspaces: [],
    tasks: [],
    projects: [],
    stickyNotes: [],
    customWidgets: [],
    widgetLibrary: [],
    panelCustomBlocks: [],
    trash: [],
    activity: [],
    empty: false
  };
}

function normalizedName(value) {
  return normalizeSearchText(value);
}

function normalizeSearchText(value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase(getLocale())
    .replace(/ß/g, 'ss')
    .replace(/[æ]/g, 'ae')
    .replace(/[œ]/g, 'oe')
    .replace(/[ø]/g, 'o')
    .replace(/[đð]/g, 'd');
}

/* Se usa solo para detectar duplicados: la URL guardada nunca se modifica. */
function canonicalUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'].forEach((key) => parsed.searchParams.delete(key));
    if (parsed.pathname === '/') parsed.pathname = '';
    return parsed.toString().replace(/\/$/, '').toLowerCase();
  } catch {
    return String(url || '').trim().toLowerCase();
  }
}

function buildSeedFromBookmarksData() {
  const categories = [];
  const bookmarks = [];
  const idMap = {};

  if (typeof BOOKMARKS_DATA === 'undefined' || !BOOKMARKS_DATA) return;

  const seedCats = BOOKMARKS_DATA.categories || [];
  const seedBms = BOOKMARKS_DATA.bookmarks || [];

  seedCats.forEach((c, i) => {
    idMap[c.id] = uid();
  });

  seedCats.forEach((c, i) => {
    categories.push({
      id: idMap[c.id],
      name: decodeEntities(c.name || 'Sin categoría'),
      parentId: c.parentId ? idMap[c.parentId] || null : null,
      color: 'theme',
      inheritColor: !!c.parentId,
      createdAt: Date.now(),
      order: typeof c.order === 'number' ? c.order : i,
      collapsed: c.parentId ? true : false
    });
  });

  const catOrder = {};
  seedBms.forEach((b, i) => {
    const key = b.categoryId || '__root__';
    if (catOrder[key] === undefined) catOrder[key] = 0;
    const order = catOrder[key]++;
    bookmarks.push({
      id: uid(),
      name: decodeEntities(b.title || getDomain(b.url) || 'Sin nombre'),
      url: b.url,
      description: '',
      categoryId: b.categoryId ? idMap[b.categoryId] || null : null,
      color: null,
      iconUrl: b.icon || null,
      tags: [],
      status: 'saved',
      pinned: false,
      useCount: 0,
      lastAccess: 0,
      createdAt: Date.now(),
      order
    });
  });

  APP.seedCategories = categories;
  APP.seedBookmarks = bookmarks;
}

function loadData() {
  try {
    let raw = localStorage.getItem(APP.storageKey);
    let parsed = null;
    if (raw) {
      parsed = JSON.parse(raw);
    } else {
      raw = localStorage.getItem(APP.legacyKey);
      if (raw) {
        try { parsed = JSON.parse(raw); } catch { parsed = null; }
      }
    }
    if (!parsed) return null;
    return validateData(parsed) ? migrateData(parsed) : null;
  } catch {
    return null;
  }
}

function saveData() {
  try {
    localStorage.setItem(APP.storageKey, JSON.stringify(state.data));
  } catch (error) {
    console.error('Error guardando datos:', error);
    toast('Error al guardar los datos', 'error');
  }
}

function validateData(data) {
  const record = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
  if (!record(data) || !Array.isArray(data.categories) || !Array.isArray(data.bookmarks) || !record(data.settings)) return false;
  const pending = [{ value: data, depth: 0 }];
  let visited = 0;
  while (pending.length) {
    const { value, depth } = pending.pop();
    if (++visited > 500000 || depth > 64) return false;
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) return false;
        pending.push({ value: value[key], depth: depth + 1 });
      }
    }
  }
  for (const key of ['categories', 'bookmarks', 'quickGroups', 'workspaces', 'tasks', 'stickyNotes', 'customWidgets', 'widgetLibrary', 'panelCustomBlocks', 'trash']) {
    if (data[key] === undefined) continue;
    if (!Array.isArray(data[key]) || data[key].length > 50000) return false;
    const ids = new Set();
    for (const item of data[key]) {
      if (!record(item)) return false;
      if (item.id !== undefined && (typeof item.id !== 'string' || !item.id || ids.has(item.id))) return false;
      if (item.id) ids.add(item.id);
      for (const field of ['name', 'title', 'url', 'html', 'markdown', 'description', 'parentId', 'categoryId']) {
        if (item[field] != null && typeof item[field] !== 'string') return false;
      }
      if (item.bookmarkIds !== undefined && (!Array.isArray(item.bookmarkIds) || !item.bookmarkIds.every((id) => typeof id === 'string'))) return false;
    }
  }
  const parents = new Map(data.categories.map((category) => [category.id, category.parentId]));
  for (const category of data.categories) {
    const seen = new Set();
    let id = category.id;
    while (id && parents.has(id)) {
      if (seen.has(id) || seen.size >= 64) return false;
      seen.add(id);
      id = parents.get(id);
    }
  }
  return true;
}

function tryRestoreHierarchy(data) {
  if (data.categories.some((c) => 'parentId' in c)) return;
  if (typeof BOOKMARKS_DATA === 'undefined') return;
  const seed = BOOKMARKS_DATA.categories || [];
  if (data.categories.length !== seed.length) return;

  const namesMatch = seed.every((sc, i) => {
    const a = (data.categories[i].name || '').trim().toLowerCase();
    const b = decodeEntities((sc.name || '')).trim().toLowerCase();
    return a === b;
  });
  if (!namesMatch) return;

  const keyToNew = {};
  const newByKey = {};
  seed.forEach((sc, i) => {
    keyToNew[sc.id] = data.categories[i].id;
    newByKey[sc.id] = data.categories[i];
  });

  data.categories.forEach((c) => {
    c.parentId = null;
    c.collapsed = false;
  });
  seed.forEach((sc) => {
    if (sc.parentId && keyToNew[sc.parentId]) {
      newByKey[sc.id].parentId = keyToNew[sc.parentId];
      newByKey[sc.id].collapsed = true;
    }
  });
}

function migrateData(data, persist = true) {
  let migrated = sanitizeStoredColors(cloneBackupValue(data));
  let changed = false;
  const hadPanelCustomLayouts = !!(data?.settings && Object.prototype.hasOwnProperty.call(data.settings, 'panelCustomLayouts'));
  const hadWidgetLibrary = Array.isArray(data?.widgetLibrary);

  if (migrated.version === undefined) {
    migrated.version = 1;
  }

  migrated.settings = migrated.settings || { ...APP.defaults.settings };
  migrated.settings = { ...APP.defaults.settings, ...migrated.settings };
  const legacySortModes = { name: 'name-asc', frequent: 'frequent-desc', recent: 'recent-desc' };
  if (legacySortModes[migrated.settings.sortMode]) {
    migrated.settings.sortMode = legacySortModes[migrated.settings.sortMode];
    changed = true;
  }
  if (!['custom', 'name-asc', 'name-desc', 'frequent-desc', 'frequent-asc', 'recent-desc', 'recent-asc'].includes(migrated.settings.sortMode)) {
    migrated.settings.sortMode = 'custom';
    changed = true;
  }
  migrated.categories = migrated.categories || [];
  migrated.bookmarks = migrated.bookmarks || [];
  migrated.quickGroups = Array.isArray(migrated.quickGroups) ? migrated.quickGroups : [];
  migrated.workspaces = Array.isArray(migrated.workspaces) ? migrated.workspaces : [];
  migrated.tasks = Array.isArray(migrated.tasks) ? migrated.tasks : [];
  migrated.projects = Array.isArray(migrated.projects) ? migrated.projects : [];
  migrated.stickyNotes = Array.isArray(migrated.stickyNotes) ? migrated.stickyNotes : [];
  migrated.customWidgets = Array.isArray(migrated.customWidgets) ? migrated.customWidgets : [];
  migrated.widgetLibrary = Array.isArray(migrated.widgetLibrary) ? migrated.widgetLibrary : [];
  migrated.panelCustomBlocks = Array.isArray(migrated.panelCustomBlocks) ? migrated.panelCustomBlocks : [];
  migrated.trash = Array.isArray(migrated.trash) ? migrated.trash : [];
  migrated.activity = Array.isArray(migrated.activity) ? migrated.activity : [];
  if (migrated.empty === undefined) migrated.empty = false;

  if (migrated.version < 2) {
    tryRestoreHierarchy(migrated);
    migrated.categories.forEach((c) => {
      if (c.parentId === undefined) c.parentId = null;
      if (c.collapsed === undefined) c.collapsed = c.parentId ? true : false;
    });
    migrated.version = 2;
    changed = true;
  }

  if (migrated.version < 3) {
    migrated.quickGroups = migrated.quickGroups || [];
    migrated.version = 3;
    changed = true;
  }

  if (migrated.version < 4) {
    migrated.version = 4;
    changed = true;
  }

  if (migrated.version < 5) {
    migrated.version = 5;
    changed = true;
  }

  if (migrated.version < 6) {
    migrated.version = 6;
    changed = true;
  }

  if (migrated.version < 7) {
    migrated.version = 7;
    changed = true;
  }

  if (migrated.version < 8) {
    migrated.version = 8;
    changed = true;
  }

  if (migrated.version < 9) {
    // Las colecciones creadas por las versiones anteriores recibían colores
    // alternos. Se normalizan al color del tema y las hijas heredan del padre.
    migrated.categories.forEach((category) => {
      if (!category.color || APP.categoryColors.includes(category.color)) category.color = 'theme';
      if (category.parentId) category.inheritColor = true;
    });
    migrated.version = 9;
    changed = true;
  }

  if (migrated.version < 10) {
    migrated.version = 10;
    changed = true;
  }

  if (migrated.version < 11) {
    migrated.version = 11;
    changed = true;
  }

  migrated.categories = migrated.categories.map((c) => {
    const fixed = { ...c };
    if (!fixed.id) { fixed.id = uid(); changed = true; }
    if (typeof fixed.name !== 'string' || !fixed.name.trim()) { fixed.name = 'Sin categoría'; changed = true; }
    if (fixed.parentId === undefined) { fixed.parentId = null; changed = true; }
    if (fixed.color === undefined || fixed.color === null) { fixed.color = 'theme'; changed = true; }
    // Las categorías existentes conservan su propio color. Las nuevas hijas
    // podrán decidir explícitamente si heredan el color de su padre.
    if (typeof fixed.inheritColor !== 'boolean') { fixed.inheritColor = !!fixed.parentId; changed = true; }
    if (typeof fixed.createdAt !== 'number') { fixed.createdAt = Date.now(); changed = true; }
    if (typeof fixed.order !== 'number') { fixed.order = 0; changed = true; }
    if (typeof fixed.collapsed !== 'boolean') { fixed.collapsed = fixed.parentId ? true : false; changed = true; }
    return fixed;
  });

  migrated.bookmarks = migrated.bookmarks.map((b) => {
    const fixed = { ...b };
    if (!fixed.id) { fixed.id = uid(); changed = true; }
    if (typeof fixed.name !== 'string' || !fixed.name.trim()) {
      fixed.name = getDomain(fixed.url) || 'Sin nombre';
      changed = true;
    }
    if (!fixed.url || !isValidUrl(fixed.url)) {
      fixed.url = normalizeUrl(fixed.url || '');
      changed = true;
    }
    if (fixed.categoryId === undefined) { fixed.categoryId = null; changed = true; }
    if (typeof fixed.pinned !== 'boolean') { fixed.pinned = false; changed = true; }
    if (typeof fixed.useCount !== 'number') { fixed.useCount = 0; changed = true; }
    if (typeof fixed.lastAccess !== 'number') { fixed.lastAccess = 0; changed = true; }
    if (typeof fixed.createdAt !== 'number') { fixed.createdAt = Date.now(); changed = true; }
    if (typeof fixed.order !== 'number') { fixed.order = 0; changed = true; }
    if (fixed.description === undefined) { fixed.description = ''; changed = true; }
    if (fixed.color === undefined) { fixed.color = null; changed = true; }
    if (fixed.iconUrl === undefined) { fixed.iconUrl = null; changed = true; }
    if (!Array.isArray(fixed.tags)) { fixed.tags = []; changed = true; }
    fixed.tags = fixed.tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean).slice(0, 12);
    if (fixed.auditStatus !== undefined && !['available', 'missing', 'youtube_missing', 'restricted', 'server_error', 'timeout', 'network_error', 'skipped'].includes(fixed.auditStatus)) {
      delete fixed.auditStatus;
      delete fixed.auditDetail;
      delete fixed.auditHttpStatus;
      delete fixed.auditCheckedAt;
      changed = true;
    }
    if (!['saved', 'later'].includes(fixed.status)) { fixed.status = 'saved'; changed = true; }
    return fixed;
  });

  migrated.quickGroups = migrated.quickGroups.map((g, gi) => {
    const fixed = { ...g };
    if (!fixed.id) { fixed.id = uid(); changed = true; }
    if (typeof fixed.name !== 'string' || !fixed.name.trim()) { fixed.name = 'Grupo'; changed = true; }
    if (!Array.isArray(fixed.bookmarkIds)) { fixed.bookmarkIds = []; changed = true; }
    else { fixed.bookmarkIds = fixed.bookmarkIds.filter((id) => typeof id === 'string'); }
    if (typeof fixed.createdAt !== 'number') { fixed.createdAt = Date.now(); changed = true; }
    if (typeof fixed.order !== 'number') { fixed.order = 0; changed = true; }
    if (typeof fixed.color !== 'string' || !fixed.color) { fixed.color = APP.categoryColors[gi % APP.categoryColors.length]; changed = true; }
    if (!COLLECTION_ICON_OPTIONS.some((option) => option.id === fixed.icon)) { fixed.icon = 'folder'; changed = true; }
    return fixed;
  });

  migrated.workspaces = migrated.workspaces.map((workspace, wi) => ({
    id: typeof workspace.id === 'string' ? workspace.id : uid(),
    name: typeof workspace.name === 'string' && workspace.name.trim() ? workspace.name.trim() : `Espacio ${wi + 1}`,
    bookmarkIds: Array.isArray(workspace.bookmarkIds) ? workspace.bookmarkIds.filter((id) => typeof id === 'string') : [],
    color: typeof workspace.color === 'string' && workspace.color ? workspace.color : APP.categoryColors[wi % APP.categoryColors.length],
    icon: COLLECTION_ICON_OPTIONS.some((option) => option.id === workspace.icon) ? workspace.icon : 'briefcase',
    createdAt: typeof workspace.createdAt === 'number' ? workspace.createdAt : Date.now(),
    order: typeof workspace.order === 'number' ? workspace.order : wi
  }));
  if (!HOME_SORT_MODES.includes(migrated.settings.quickSortMode)) { migrated.settings.quickSortMode = 'custom'; changed = true; }
  if (!Array.isArray(migrated.settings.quickCustomOrder)) { migrated.settings.quickCustomOrder = []; changed = true; }
  else migrated.settings.quickCustomOrder = migrated.settings.quickCustomOrder.filter((key) => typeof key === 'string');
  if (!HOME_SORT_MODES.includes(migrated.settings.workspaceSortMode)) { migrated.settings.workspaceSortMode = 'custom'; changed = true; }
  migrated.tasks = migrated.tasks.map((task, ti) => ({
    id: typeof task.id === 'string' ? task.id : uid(),
    title: typeof task.title === 'string' && task.title.trim() ? task.title.trim() : `Tarea ${ti + 1}`,
    notes: typeof task.notes === 'string' ? task.notes.slice(0, 5000) : '',
    status: ['todo', 'doing', 'done'].includes(task.status) ? task.status : 'todo',
    priority: ['low', 'normal', 'high', 'urgent'].includes(task.priority) ? task.priority : 'normal',
    dueAt: Number.isFinite(Number(task.dueAt)) && Number(task.dueAt) > 0 ? Number(task.dueAt) : null,
    reminderAt: Number.isFinite(Number(task.reminderAt)) && Number(task.reminderAt) > 0 ? Number(task.reminderAt) : null,
    calendarTarget: task.calendarTarget && typeof task.calendarTarget === 'object' ? {
      provider: ['google', 'microsoft', 'ics'].includes(task.calendarTarget.provider) ? task.calendarTarget.provider : null,
      calendarId: typeof task.calendarTarget.calendarId === 'string' ? task.calendarTarget.calendarId : null,
      calendarName: typeof task.calendarTarget.calendarName === 'string' ? task.calendarTarget.calendarName : null,
      remoteEventId: typeof task.calendarTarget.remoteEventId === 'string' ? task.calendarTarget.remoteEventId : null,
      remoteUpdatedAt: Number.isFinite(Number(task.calendarTarget.remoteUpdatedAt)) ? Number(task.calendarTarget.remoteUpdatedAt) : 0,
      allDay: !!task.calendarTarget.allDay
    } : { provider: null, calendarId: null, calendarName: null, remoteEventId: null, remoteUpdatedAt: 0 },
    createdAt: Number.isFinite(Number(task.createdAt)) ? Number(task.createdAt) : Date.now(),
    updatedAt: Number.isFinite(Number(task.updatedAt)) ? Number(task.updatedAt) : Date.now(),
    order: typeof task.order === 'number' ? task.order : ti
  }));
  migrated.stickyNotes = migrated.stickyNotes.map((note, ni) => ({
    id: typeof note.id === 'string' ? note.id : uid(),
    title: typeof note.title === 'string' ? note.title.slice(0, 160) : '',
    html: sanitizeStickyHtml(note.html),
    markdown: typeof note.markdown === 'string' ? note.markdown.slice(0, 100000) : '',
    mode: note.mode === 'markdown' || (typeof note.markdown === 'string' && note.markdown.trim()) ? 'markdown' : 'rich',
    fontFamily: typeof note.fontFamily === 'string' && /^[A-Za-z0-9 ,"'-]+$/.test(note.fontFamily) ? note.fontFamily : 'system-ui',
    fontSize: typeof note.fontSize === 'string' && /^(?:12|14|16|18|20|24|28|32)px$/.test(note.fontSize) ? note.fontSize : '16px',
    color: typeof note.color === 'string' && note.color ? note.color : '#F5B44C',
    pinned: !!note.pinned,
    showInPanel: !!note.showInPanel,
    panelHeight: Math.max(120, Math.min(640, Number(note.panelHeight) || 180)),
    createdAt: Number.isFinite(Number(note.createdAt)) ? Number(note.createdAt) : Date.now(),
    updatedAt: Number.isFinite(Number(note.updatedAt)) ? Number(note.updatedAt) : Date.now(),
    order: typeof note.order === 'number' ? note.order : ni
  }));
  migrated.customWidgets = migrated.customWidgets.map((widget, wi) => ({
    id: typeof widget.id === 'string' ? widget.id : uid(),
    title: typeof widget.title === 'string' && widget.title.trim() ? widget.title.trim().slice(0, 80) : `Widget ${wi + 1}`,
    url: typeof widget.url === 'string' && /^https:\/\//i.test(widget.url.trim()) ? widget.url.trim() : '',
    height: Math.max(160, Math.min(900, Number(widget.height) || 320)),
    createdAt: Number.isFinite(Number(widget.createdAt)) ? Number(widget.createdAt) : Date.now(),
    order: typeof widget.order === 'number' ? widget.order : wi
  })).filter((widget) => widget.url);
  const panelNativeTypes = new Set();
  migrated.panelCustomBlocks = migrated.panelCustomBlocks.map((block, bi) => {
    const type = ['recent', 'stats', 'tools', 'notes', 'iframe'].includes(block.type) ? block.type : 'iframe';
    const title = typeof block.title === 'string' && block.title.trim() ? block.title.trim().slice(0, 80) : (type === 'iframe' ? `Widget ${bi + 1}` : '');
    const url = type === 'iframe' && typeof block.url === 'string' && /^https:\/\//i.test(block.url.trim()) ? block.url.trim() : '';
    const width = normalizeIframeWidth(block.width) || '100%';
    const height = normalizeIframeHeight(block.height) || 320;
    const legacyManualLayout = normalizeManualPanelLayout(block.manualLayout);
    const manualLayouts = normalizeManualPanelLayouts(block.manualLayouts, legacyManualLayout);
    if (legacyManualLayout || !block.manualLayouts) changed = true;
    return {
      id: typeof block.id === 'string' ? block.id : uid(),
      type,
      title,
      url,
      width,
      height,
      manualLayouts,
      embedCode: type === 'iframe' && url ? buildCustomIframeCode({ url, title, width, height }) : '',
      createdAt: Number.isFinite(Number(block.createdAt)) ? Number(block.createdAt) : Date.now(),
      order: typeof block.order === 'number' ? block.order : bi
    };
  }).filter((block) => {
    if (block.type === 'iframe') return !!block.url;
    if (panelNativeTypes.has(block.type)) return false;
    panelNativeTypes.add(block.type);
    return true;
  }).slice(0, MAX_CUSTOM_PANEL_BLOCKS);
  // Compatibilidad: los widgets creados con la versión anterior se trasladan
  // a la nueva barra personal para que no desaparezcan al actualizar.
  if (!migrated.panelCustomBlocks.length && migrated.customWidgets.length) {
    migrated.panelCustomBlocks = migrated.customWidgets.slice(0, MAX_CUSTOM_PANEL_BLOCKS).map((widget, wi) => {
      const width = normalizeIframeWidth(widget.width) || '100%';
      const height = normalizeIframeHeight(widget.height) || 320;
      return { ...widget, type: 'iframe', width, height, embedCode: buildCustomIframeCode({ url: widget.url, title: widget.title, width, height }), order: wi };
    });
    migrated.settings.panelMode = 'custom';
    changed = true;
  }
  migrated.widgetLibrary = migrated.widgetLibrary.map((entry, index) => normalizeWidgetLibraryEntry(entry, index)).filter(Boolean);
  if (!hadWidgetLibrary) {
    const knownLibraryEntries = new Set(migrated.widgetLibrary.map(widgetLibrarySignature));
    const rememberWidget = (widget, index) => {
      const entry = normalizeWidgetLibraryEntry(widget, index);
      if (!entry || knownLibraryEntries.has(widgetLibrarySignature(entry))) return;
      knownLibraryEntries.add(widgetLibrarySignature(entry));
      migrated.widgetLibrary.push(entry);
    };
    migrated.customWidgets.forEach((widget, index) => rememberWidget({ ...widget, width: widget.width || '100%' }, index));
    migrated.panelCustomBlocks.filter((block) => block.type === 'iframe').forEach((block, index) => rememberWidget(block, index));
    if (migrated.widgetLibrary.length) changed = true;
  }
  if (!['default', 'custom'].includes(migrated.settings.panelMode)) { migrated.settings.panelMode = 'default'; changed = true; }
  if (!['stack', 'grid', 'masonry'].includes(migrated.settings.panelCustomLayout)) { migrated.settings.panelCustomLayout = 'stack'; changed = true; }
  const legacyPanelLayout = migrated.settings.panelCustomLayout;
  const savedPanelLayouts = migrated.settings.panelCustomLayouts;
  if (!hadPanelCustomLayouts || !savedPanelLayouts || typeof savedPanelLayouts !== 'object') {
    migrated.settings.panelCustomLayouts = { sidebar: legacyPanelLayout, expanded: 'grid' };
    changed = true;
  } else {
    const sidebarLayout = savedPanelLayouts.sidebar;
    const expandedLayout = savedPanelLayouts.expanded;
    migrated.settings.panelCustomLayouts = {
      sidebar: ['stack', 'grid', 'masonry'].includes(sidebarLayout) ? sidebarLayout : legacyPanelLayout,
      expanded: ['stack', 'grid', 'masonry'].includes(expandedLayout) ? expandedLayout : 'grid'
    };
  }
  if (!['stack', 'masonry'].includes(migrated.settings.panelNotesLayout)) { migrated.settings.panelNotesLayout = 'stack'; changed = true; }
  migrated.activity = migrated.activity.filter((item) => item && typeof item === 'object').slice(-300);
  migrated.trash = migrated.trash.map(normalizeTrashEntry).filter(Boolean).filter((entry) => entry.deletedAt >= Date.now() - TRASH_RETENTION_MS).sort((a, b) => b.deletedAt - a.deletedAt).slice(0, TRASH_MAX_ITEMS);

  // Limpiar categorías huérfanas
  const validIds = new Set(migrated.categories.map((c) => c.id));
  migrated.categories.forEach((c) => {
    if (c.parentId && !validIds.has(c.parentId)) c.parentId = null;
  });

  if (changed && persist) {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(migrated));
    } catch {}
  }
  return migrated;
}

/* ---------- Papelera recuperable ---------- */
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const TRASH_MAX_ITEMS = 250;
const TRASH_TYPES = new Set(['bookmark', 'category-tree', 'quick-group', 'workspace', 'custom-widget', 'widget-library', 'task', 'sticky-note']);

function normalizeTrashEntry(entry) {
  if (!entry || typeof entry !== 'object' || !TRASH_TYPES.has(entry.type) || !entry.payload || typeof entry.payload !== 'object') return null;
  const p = entry.payload;
  const probe = { categories: [], bookmarks: [], settings: {} };
  const types = { bookmark: ['bookmarks', 'bookmark'], 'quick-group': ['quickGroups', 'group'], workspace: ['workspaces', 'workspace'], 'custom-widget': ['customWidgets', 'widget'], 'widget-library': ['widgetLibrary', 'widget'], task: ['tasks', 'task'], 'sticky-note': ['stickyNotes', 'note'] };
  if (entry.type === 'category-tree') {
    probe.categories = p.categories;
    probe.bookmarks = p.bookmarks;
  } else {
    const [collection, field] = types[entry.type];
    if (!p[field]?.id) return null;
    probe[collection] = [p[field]];
  }
  if (!validateData(probe)) return null;
  if (probe.bookmarks.some((item) => !isValidUrl(item.url))) return null;
  if (p.widget && !isValidEmbedUrl(p.widget.url)) return null;
  try {
    return {
      id: typeof entry.id === 'string' && entry.id ? entry.id : uid(),
      type: entry.type,
      label: typeof entry.label === 'string' && entry.label.trim() ? entry.label.trim().slice(0, 180) : 'Elemento eliminado',
      payload: sanitizeStoredColors(cloneBackupValue(entry.payload)),
      deletedAt: Number.isFinite(Number(entry.deletedAt)) ? Number(entry.deletedAt) : Date.now()
    };
  } catch {
    return null;
  }
}

function trashItems() {
  if (!Array.isArray(state.data?.trash)) state.data.trash = [];
  return state.data.trash;
}

function pruneTrash() {
  const limit = Date.now() - TRASH_RETENTION_MS;
  state.data.trash = trashItems().map(normalizeTrashEntry).filter(Boolean).filter((entry) => entry.deletedAt >= limit).sort((a, b) => b.deletedAt - a.deletedAt).slice(0, TRASH_MAX_ITEMS);
}

function addToTrash(type, label, payload) {
  const entry = normalizeTrashEntry({ id: uid(), type, label, payload, deletedAt: Date.now() });
  if (!entry) return null;
  trashItems().unshift(entry);
  pruneTrash();
  return entry;
}

function bookmarkMemberships(bookmarkIds) {
  const ids = new Set(bookmarkIds || []);
  const memberships = {};
  ids.forEach((id) => {
    memberships[id] = {
      quickGroupIds: state.data.quickGroups.filter((group) => group.bookmarkIds.includes(id)).map((group) => group.id),
      workspaceIds: state.data.workspaces.filter((workspace) => workspace.bookmarkIds.includes(id)).map((workspace) => workspace.id)
    };
  });
  return memberships;
}

function restoreBookmarkMemberships(bookmark, membership) {
  if (!bookmark || !membership) return;
  (Array.isArray(membership.quickGroupIds) ? membership.quickGroupIds : []).forEach((groupId) => {
    const group = getQuickGroup(groupId);
    if (group && !group.bookmarkIds.includes(bookmark.id)) group.bookmarkIds.push(bookmark.id);
  });
  (Array.isArray(membership.workspaceIds) ? membership.workspaceIds : []).forEach((workspaceId) => {
    const workspace = getWorkspace(workspaceId);
    if (workspace && !workspace.bookmarkIds.includes(bookmark.id)) workspace.bookmarkIds.push(bookmark.id);
  });
}

function trashTypeLabel(type) {
  return ({ bookmark: 'Favorito', 'category-tree': 'Categoría', 'quick-group': 'Grupo fijado', workspace: 'Espacio de trabajo', 'custom-widget': 'Widget', 'widget-library': 'Widget guardado', task: 'Tarea', 'sticky-note': 'Nota' })[type] || 'Elemento';
}

function restoreTrashEntry(entryId, options = {}) {
  pruneTrash();
  const entry = trashItems().find((item) => item.id === entryId);
  if (!entry) return false;
  const payload = entry.payload || {};
  let restored = false;

  if (entry.type === 'bookmark' && payload.bookmark && !getBookmark(payload.bookmark.id)) {
    const bookmark = cloneBackupValue(payload.bookmark);
    state.data.bookmarks.push(bookmark);
    restoreBookmarkMemberships(bookmark, payload.membership);
    queueNativeBookmarkWrite(bookmark);
    restored = true;
  } else if (entry.type === 'category-tree' && Array.isArray(payload.categories) && Array.isArray(payload.bookmarks)) {
    const categoryIds = new Set(payload.categories.map((category) => category.id));
    const bookmarkIds = new Set(payload.bookmarks.map((bookmark) => bookmark.id));
    if (![...categoryIds].some((id) => getCategory(id)) && ![...bookmarkIds].some((id) => getBookmark(id))) {
      state.data.categories.push(...cloneBackupValue(payload.categories));
      state.data.bookmarks.push(...cloneBackupValue(payload.bookmarks));
      payload.bookmarks.forEach((bookmark) => restoreBookmarkMemberships(bookmark, payload.memberships?.[bookmark.id]));
      const syncRestored = async () => {
        if (!nativeWritesEnabled()) return;
        const api = getBrowserExtensionApi();
        if (!api) return;
        for (const id of categoryIds) await ensureNativeFolderForCategory(id, api);
        for (const id of bookmarkIds) await syncDashboardBookmarkToNative(getBookmark(id));
      };
      syncRestored().catch(() => toast('Restaurado localmente. Revisa la sincronización de marcadores.', 'error'));
      restored = true;
    }
  } else if (entry.type === 'quick-group' && payload.group && !getQuickGroup(payload.group.id)) {
    state.data.quickGroups.push(cloneBackupValue(payload.group));
    restored = true;
  } else if (entry.type === 'workspace' && payload.workspace && !getWorkspace(payload.workspace.id)) {
    state.data.workspaces.push(cloneBackupValue(payload.workspace));
    restored = true;
  } else if (entry.type === 'custom-widget' && payload.widget && !customWidgets().some((item) => item.id === payload.widget.id)) {
    state.data.customWidgets.push(cloneBackupValue(payload.widget));
    restored = true;
  } else if (entry.type === 'widget-library' && payload.widget && !widgetLibrary().some((item) => item.id === payload.widget.id)) {
    state.data.widgetLibrary.push(cloneBackupValue(payload.widget));
    restored = true;
  } else if (entry.type === 'task' && payload.task && !tasks().some((item) => item.id === payload.task.id)) {
    state.data.tasks.push(cloneBackupValue(payload.task));
    syncTaskReminder(payload.task);
    restored = true;
  } else if (entry.type === 'sticky-note' && payload.note && !stickyNotes().some((item) => item.id === payload.note.id)) {
    state.data.stickyNotes.push(cloneBackupValue(payload.note));
    restored = true;
  }

  if (!restored) {
    toast('No se pudo restaurar porque ya existe un elemento con esos datos.', 'error');
    return false;
  }
  state.data.trash = trashItems().filter((item) => item.id !== entryId);
  saveData();
  renderAll();
  toast(`“${entry.label}” recuperado.`, 'success');
  if (options.reopenTrash) openTrash();
  return true;
}

function notifyTrashEntry(entry) {
  if (!entry) return;
  toast(`“${entry.label}” se ha movido a la Papelera.`, 'info', {
    actionLabel: 'Deshacer',
    action: () => restoreTrashEntry(entry.id),
    duration: 9000
  });
}

function openTrash() {
  pruneTrash();
  const modal = el('div', { class: 'modal trash-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Papelera' }), el('button', { class: 'modal-close', type: 'button', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body trash-body' });
  body.appendChild(el('p', { class: 'widget-library-lead', text: 'Los elementos eliminados se conservan localmente durante 30 días. Puedes recuperarlos de forma individual.' }));
  const entries = trashItems().slice().sort((a, b) => b.deletedAt - a.deletedAt);
  if (!entries.length) {
    body.appendChild(el('p', { class: 'widget-library-empty', text: 'La papelera está vacía.' }));
  } else {
    const list = el('div', { class: 'trash-list' });
    entries.forEach((entry) => {
      const row = el('article', { class: 'trash-item' });
      const copy = el('div', { class: 'trash-item-copy' });
      copy.append(el('strong', { text: entry.label }), el('span', { text: `${trashTypeLabel(entry.type)} · ${new Date(entry.deletedAt).toLocaleString(getLocale())}` }));
      const actions = el('div', { class: 'trash-item-actions' });
      actions.append(
        el('button', { class: 'btn secondary', type: 'button', text: 'Restaurar', onclick: () => restoreTrashEntry(entry.id, { reopenTrash: true }) }),
        el('button', { class: 'icon-btn small danger', type: 'button', title: 'Eliminar definitivamente', 'aria-label': 'Eliminar definitivamente', html: ICONS.trash, onclick: () => { state.data.trash = trashItems().filter((item) => item.id !== entry.id); saveData(); openTrash(); } })
      );
      row.append(copy, actions);
      list.appendChild(row);
    });
    body.appendChild(list);
  }
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', type: 'button', text: 'Cerrar', onclick: closeModal }));
  if (entries.length) footer.appendChild(el('button', { class: 'btn danger', type: 'button', text: 'Vaciar papelera', onclick: confirmEmptyTrash }));
  modal.append(header, body, footer);
  openModal(modal);
}

function confirmEmptyTrash() {
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Vaciar Papelera' }), el('button', { class: 'modal-close', type: 'button', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: openTrash }));
  const body = el('div', { class: 'modal-body' });
  body.appendChild(el('p', { text: 'Vas a eliminar definitivamente todos los elementos de la Papelera. Esta acción no se puede deshacer.' }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(
    el('button', { class: 'btn', type: 'button', text: 'Cancelar', onclick: openTrash }),
    el('button', { class: 'btn danger', type: 'button', text: 'Vaciar definitivamente', onclick: () => { state.data.trash = []; saveData(); closeModal(); toast('Papelera vaciada definitivamente.', 'info'); } })
  );
  modal.append(header, body, footer);
  openModal(modal);
}

function initData() {
  buildSeedFromBookmarksData();

  const stored = loadData();
  if (stored) {
    state.data = stored;
    if (!stored.empty && state.data.bookmarks.length === 0 && APP.seedBookmarks.length > 0) {
      state.data.categories = APP.seedCategories.map((c) => ({ ...c, id: uid() }));
      const idMap = {};
      APP.seedCategories.forEach((c, i) => { idMap[c.id] = state.data.categories[i].id; });
      state.data.categories.forEach((c) => {
        if (c.parentId && idMap[c.parentId]) c.parentId = idMap[c.parentId];
      });
      state.data.bookmarks = APP.seedBookmarks.map((b) => ({ ...b, id: uid(), categoryId: idMap[b.categoryId] || null }));
    }
    state.quickViewMode = state.data.settings.quickViewMode || 'icon';
    state.viewMode = state.data.settings.viewMode || 'grid';
    state.sortMode = state.data.settings.sortMode || 'custom';
    return;
  }

  state.data = defaultData();
  if (APP.seedCategories.length > 0) {
    state.data.categories = APP.seedCategories;
    state.data.bookmarks = APP.seedBookmarks;
  }
  saveData();
  state.quickViewMode = state.data.settings.quickViewMode;
  state.viewMode = state.data.settings.viewMode;
  state.sortMode = state.data.settings.sortMode;
}

/* ---------- Import / Export ---------- */
const FULL_BACKUP_FORMAT = 'dashboarddp-full-backup';
const FULL_BACKUP_SCHEMA = 1;

function cloneBackupValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeStoredColors(value) {
  const pending = [value];
  while (pending.length) {
    const item = pending.pop();
    if (!item || typeof item !== 'object') continue;
    if (Object.prototype.hasOwnProperty.call(item, 'color') && item.color != null && item.color !== 'theme' && !isValidCssColor(item.color)) item.color = '#8e58d7';
    Object.values(item).forEach((child) => { if (child && typeof child === 'object') pending.push(child); });
  }
  return value;
}

function detachImportedNativeLinks(data) {
  const clean = cloneBackupValue(data);
  const pending = [clean];
  while (pending.length) {
    const value = pending.pop();
    if (!value || typeof value !== 'object') continue;
    for (const key of Object.keys(value)) {
      if (['sourceNativeId', 'nativeTargetFolderId', 'nativeRootFolder'].includes(key)) delete value[key];
      else if (value[key] && typeof value[key] === 'object') pending.push(value[key]);
    }
  }
  if (clean.settings) {
    Object.keys(clean.settings).filter((key) => key.startsWith('native')).forEach((key) => delete clean.settings[key]);
    clean.settings.nativeWriteEnabled = false;
    clean.settings.nativeWriteFolderId = '';
    clean.settings.nativeBookmarkMode = '';
  }
  return clean;
}

function backupCalendarConnections() {
  const safe = {};
  Object.entries(personalCalendarConnections || {}).forEach(([provider, connection]) => {
    if (!['google', 'microsoft'].includes(provider) || !connection || !String(connection.clientId || '').trim()) return;
    safe[provider] = {
      authMode: connection.authMode === 'pkce' ? 'pkce' : 'implicit',
      clientId: String(connection.clientId).trim(),
      redirectUri: String(connection.redirectUri || '').trim(),
      calendars: Array.isArray(connection.calendars) ? connection.calendars.map((calendar) => ({ id: String(calendar.id || ''), name: String(calendar.name || calendar.id || '') })).filter((calendar) => calendar.id) : [],
      connectedAt: Number(connection.connectedAt) || 0
    };
  });
  return safe;
}

function fullBackupEnvelope() {
  return {
    format: FULL_BACKUP_FORMAT,
    schema: FULL_BACKUP_SCHEMA,
    exportedAt: new Date().toISOString(),
    dashboard: cloneBackupValue(state.data),
    calendarConnections: backupCalendarConnections()
  };
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportData() {
  state.data.settings.lastBackupAt = Date.now();
  addActivity('backup-exported', 'Copia completa del Dashboard');
  saveData();
  downloadJson(fullBackupEnvelope(), `dashboarddp-copia-completa-${new Date().toISOString().slice(0, 10)}.json`);
  toast('Copia completa descargada: favoritos, ajustes, fijados, espacios, widgets, notas y tareas.', 'success');
}

function escapeHtmlExport(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function exportHtml() {
  const lines = [];
  lines.push('<!DOCTYPE NETSCAPE-Bookmark-file-1>');
  lines.push('<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">');
  lines.push('<TITLE>Marcadores</TITLE>');
  lines.push('<H1>Marcadores</H1>');

  const buildDL = (parentId, depth) => {
    const indent = '    '.repeat(depth);
    const cats = getChildren(parentId);
    const bms = state.data.bookmarks
      .filter((b) => (b.categoryId || null) === (parentId || null))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    lines.push(`${indent}<DL><p>`);
    bms.forEach((b) => {
      lines.push(`${indent}    <DT><A HREF="${escapeHtmlExport(b.url)}" ADD_DATE="${Math.floor((b.createdAt || Date.now()) / 1000)}">${escapeHtmlExport(b.name)}</A>`);
    });
    cats.forEach((c) => {
      lines.push(`${indent}    <DT><H3 ADD_DATE="${Math.floor((c.createdAt || Date.now()) / 1000)}">${escapeHtmlExport(c.name)}</H3>`);
      buildDL(c.id, depth + 1);
    });
    lines.push(`${indent}</DL><p>`);
  };

  buildDL(null, 0);

  const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `marcadores-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Marcadores exportados en HTML', 'success');
}

const BROWSER_IMPORT_GUIDES = [
  {
    id: 'brave',
    name: 'Brave',
    description: 'Importa los marcadores que ya guardas en Brave.',
    steps: [
      'En Brave abre el gestor de marcadores desde el menú principal.',
      'Abre el menú de opciones del gestor y elige Exportar marcadores.',
      'Guarda el archivo en formato HTML y selecciónalo aquí.'
    ]
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    description: 'Importa los marcadores que ya guardas en Chrome.',
    steps: [
      'En Chrome abre el gestor de marcadores desde el menú principal.',
      'Abre el menú de tres puntos del gestor y elige Exportar marcadores.',
      'Guarda el archivo en formato HTML y selecciónalo aquí.'
    ]
  },
  {
    id: 'edge',
    name: 'Microsoft Edge',
    description: 'Importa los favoritos que ya guardas en Edge.',
    steps: [
      'En Edge abre Favoritos desde el menú principal.',
      'En el menú de Favoritos elige Exportar favoritos.',
      'Guarda el archivo en formato HTML y selecciónalo aquí.'
    ]
  },
  {
    id: 'firefox',
    name: 'Mozilla Firefox',
    description: 'Importa los marcadores que ya guardas en Firefox.',
    steps: [
      'En Firefox abre Marcadores y después Administrar marcadores.',
      'Usa Importar y respaldar y elige Exportar marcadores a HTML.',
      'Guarda el archivo HTML y selecciónalo aquí.'
    ]
  },
  {
    id: 'vivaldi',
    name: 'Vivaldi',
    description: 'Importa los marcadores que ya guardas en Vivaldi.',
    steps: [
      'En Vivaldi abre el gestor de marcadores.',
      'Usa su menú de opciones para exportar los marcadores.',
      'Guarda el archivo en formato HTML y selecciónalo aquí.'
    ]
  },
  {
    id: 'opera',
    name: 'Opera',
    description: 'Importa los marcadores que ya guardas en Opera.',
    steps: [
      'En Opera abre el gestor de marcadores.',
      'Usa la opción de exportar marcadores, o expórtalos primero desde el navegador del que procedan.',
      'Elige aquí el archivo HTML exportado.'
    ]
  },
  {
    id: 'safari',
    name: 'Safari',
    description: 'Importa los marcadores exportados desde Safari.',
    steps: [
      'En Safari abre Archivo y elige Exportar marcadores.',
      'Guarda el archivo HTML exportado.',
      'Transfiérelo a este equipo si hace falta y selecciónalo aquí.'
    ]
  },
  {
    id: 'other',
    name: 'Otro navegador',
    description: 'Importa un archivo estándar de marcadores.',
    steps: [
      'Abre el gestor de favoritos o marcadores de tu navegador.',
      'Busca Exportar marcadores o Exportar favoritos y elige el formato HTML.',
      'Selecciona aquí el archivo .html o .htm que se haya creado.'
    ]
  }
];

function chooseBrowserBookmarkFile(browser, keepSeparated = true) {
  const input = el('input', { type: 'file', accept: '.html,.htm,text/html', hidden: true });
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    input.remove();
    if (file) readBrowserBookmarkFile(file, browser, keepSeparated);
  }, { once: true });
  input.click();
}

function readBrowserBookmarkFile(file, browser = null, keepSeparated = false) {
  if (file.size > 25 * 1024 * 1024) { toast('El archivo supera el límite de importación de 25 MB.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = () => importBrowserBookmarks(String(reader.result || ''), file.name, browser, keepSeparated);
  reader.onerror = () => toast('No se pudo leer el archivo de marcadores', 'error');
  reader.readAsText(file);
}

function openBrowserImportGuide(browser) {
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(
    el('h2', { class: 'modal-title', id: 'modalTitle', text: `Importar desde ${browser.name}` }),
    el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal })
  );
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: browser.description }),
    el('p', { class: 'modal-subtitle', text: 'Por privacidad, DashboardDP no lee directamente los perfiles de otros navegadores. Tú eliges el archivo HTML que exportes.' })
  );
  const steps = el('ol', { class: 'help-list' });
  browser.steps.forEach((step) => steps.appendChild(el('li', { text: step })));
  const keepSeparated = el('input', { type: 'checkbox' });
  keepSeparated.checked = true;
  const keepSeparatedLabel = el('label', { class: 'checkbox-label' });
  keepSeparatedLabel.append(keepSeparated, el('span', { text: `Mantenerlos dentro de una categoría «Importado · ${browser.name}»` }));
  body.append(steps, keepSeparatedLabel, el('p', { class: 'modal-subtitle', text: 'Al seleccionarlo verás una vista previa. La integración suma los favoritos nuevos y conserva tus categorías, grupos, espacios y ajustes actuales.' }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(
    el('button', { class: 'btn', text: 'Elegir otro navegador', onclick: openBrowserImportAssistant }),
    el('button', { class: 'btn primary', text: `Elegir HTML de ${browser.name}`, onclick: () => { closeModal(); chooseBrowserBookmarkFile(browser, keepSeparated.checked); } })
  );
  modal.append(header, body, footer);
  openModal(modal);
}

function openBrowserImportAssistant() {
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(
    el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Importar desde otro navegador' }),
    el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal })
  );
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: 'Elige el navegador desde el que quieres traer marcadores. Puedes repetir el proceso tantas veces como necesites.' }),
    el('p', { class: 'modal-subtitle', text: 'Cada importación se integra con los favoritos que ya tienes: no sustituye ni borra tu biblioteca actual.' })
  );
  const list = el('div', { class: 'settings-actions' });
  BROWSER_IMPORT_GUIDES.forEach((browser) => {
    list.appendChild(el('button', {
      class: 'btn secondary',
      html: `${ICONS.import}<span>${browser.name}</span>`,
      onclick: () => openBrowserImportGuide(browser)
    }));
  });
  body.appendChild(list);
  modal.append(header, body);
  openModal(modal);
}

function categoryPathKey(category, categories) {
  const path = [];
  const seen = new Set();
  let current = category;
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(normalizedName(current.name));
    current = current.parentId ? categories.find((c) => c.id === current.parentId) : null;
  }
  return path.join(' › ');
}

function mergeDashboardData(current, incoming) {
  const merged = JSON.parse(JSON.stringify(current));
  merged.quickGroups = Array.isArray(merged.quickGroups) ? merged.quickGroups : [];
  const source = migrateData(cloneBackupValue(incoming), false);
  source.quickGroups = Array.isArray(source.quickGroups) ? source.quickGroups : [];
  const stats = { added: 0, updated: 0, existing: 0, invalid: 0, categories: 0, groups: 0, widgets: 0 };
  const categoryMap = new Map();
  const incomingById = new Map(source.categories.map((c) => [c.id, c]));
  const pending = new Set(source.categories.map((c) => c.id));

  while (pending.size) {
    let progressed = false;
    [...pending].forEach((oldId) => {
      const imported = incomingById.get(oldId);
      const parentReady = !imported.parentId || categoryMap.has(imported.parentId) || !incomingById.has(imported.parentId);
      if (!parentReady) return;
      const parentId = imported.parentId ? (categoryMap.get(imported.parentId) || null) : null;
      let match = merged.categories.find((c) => c.sourceNativeId && imported.sourceNativeId && c.sourceNativeId === imported.sourceNativeId)
        || merged.categories.find((c) => (c.parentId || null) === parentId && normalizedName(c.name) === normalizedName(imported.name));
      if (!match) {
        match = {
          ...imported,
          id: uid(),
          parentId,
          order: merged.categories.filter((c) => (c.parentId || null) === parentId).length,
          collapsed: imported.collapsed !== false
        };
        merged.categories.push(match);
        stats.categories++;
      } else if (imported.sourceNativeId) {
        const categoryChanged = String(match.sourceNativeId || '') !== String(imported.sourceNativeId)
          || !!match.nativeRootFolder !== !!imported.nativeRootFolder
          || (match.parentId || null) !== parentId
          || match.name !== (imported.name || match.name);
        match.sourceNativeId = imported.sourceNativeId;
        match.nativeRootFolder = !!imported.nativeRootFolder;
        match.parentId = parentId;
        match.name = imported.name || match.name;
        if (categoryChanged) stats.updated++;
      }
      categoryMap.set(oldId, match.id);
      pending.delete(oldId);
      progressed = true;
    });
    if (!progressed) {
      pending.forEach((oldId) => categoryMap.set(oldId, null));
      break;
    }
  }

  const byUrl = new Map();
  const byNativeId = new Map();
  merged.bookmarks.forEach((bookmark) => byUrl.set(canonicalUrl(bookmark.url), bookmark));
  merged.bookmarks.forEach((bookmark) => {
    if (bookmark.sourceNativeId) byNativeId.set(String(bookmark.sourceNativeId), bookmark);
  });
  const bookmarkMap = new Map();
  source.bookmarks.forEach((imported) => {
    if (!imported.url || !isValidUrl(imported.url)) {
      stats.invalid++;
      return;
    }
    const key = canonicalUrl(imported.url);
    const existing = (imported.sourceNativeId && byNativeId.get(String(imported.sourceNativeId))) || byUrl.get(key);
    if (existing) {
      if (imported.sourceNativeId) {
        const nativeUrlChanged = canonicalUrl(existing.url) !== canonicalUrl(imported.url);
        const nativeChanged = String(existing.sourceNativeId || '') !== String(imported.sourceNativeId)
          || existing.name !== (imported.name || existing.name)
          || existing.url !== imported.url
          || (existing.categoryId || null) !== (categoryMap.get(imported.categoryId) || null);
        existing.sourceNativeId = imported.sourceNativeId;
        existing.name = imported.name || existing.name;
        existing.url = imported.url;
        existing.categoryId = categoryMap.get(imported.categoryId) || null;
        if (nativeUrlChanged) {
          delete existing.auditStatus;
          delete existing.auditDetail;
          delete existing.auditHttpStatus;
          delete existing.auditCheckedAt;
        }
        if (nativeChanged) stats.updated++;
      }
      bookmarkMap.set(imported.id, existing.id);
      stats.existing++;
      return;
    }
    const categoryId = categoryMap.get(imported.categoryId) || null;
    const created = {
      ...imported,
      id: uid(),
      categoryId,
      order: merged.bookmarks.filter((b) => (b.categoryId || null) === categoryId).length,
      useCount: 0,
      lastAccess: 0
    };
    merged.bookmarks.push(created);
    byUrl.set(key, created);
    bookmarkMap.set(imported.id, created.id);
    stats.added++;
  });

  source.quickGroups.forEach((group) => {
    const bookmarkIds = group.bookmarkIds.map((id) => bookmarkMap.get(id)).filter(Boolean);
    if (!bookmarkIds.length) return;
    let target = merged.quickGroups.find((g) => normalizedName(g.name) === normalizedName(group.name));
    if (!target) {
      target = { ...group, id: uid(), bookmarkIds: [], order: merged.quickGroups.length };
      merged.quickGroups.push(target);
      stats.groups++;
    }
    bookmarkIds.forEach((id) => {
      if (!target.bookmarkIds.includes(id)) target.bookmarkIds.push(id);
      const bookmark = merged.bookmarks.find((b) => b.id === id);
      if (bookmark) bookmark.pinned = true;
    });
  });

  const knownTaskIds = new Set(merged.tasks.map((task) => task.id));
  source.tasks.forEach((task) => {
    if (knownTaskIds.has(task.id)) return;
    merged.tasks.push({ ...task, id: uid(), order: merged.tasks.length });
  });
  const knownNoteIds = new Set((merged.stickyNotes || []).map((note) => note.id));
  source.stickyNotes.forEach((note) => {
    if (knownNoteIds.has(note.id)) return;
    merged.stickyNotes.push({ ...note, id: uid(), order: merged.stickyNotes.length });
  });
  const knownWidgetUrls = new Set((merged.customWidgets || []).map((widget) => String(widget.url || '').trim()));
  source.customWidgets.forEach((widget) => {
    const url = String(widget.url || '').trim();
    if (!isValidEmbedUrl(url) || knownWidgetUrls.has(url)) return;
    merged.customWidgets.push({ ...widget, id: uid(), order: merged.customWidgets.length });
    knownWidgetUrls.add(url);
    stats.widgets++;
  });
  merged.widgetLibrary = Array.isArray(merged.widgetLibrary) ? merged.widgetLibrary : [];
  const knownWidgetLibraryEntries = new Set(merged.widgetLibrary.map(widgetLibrarySignature));
  (source.widgetLibrary || []).forEach((entry) => {
    const normalized = normalizeWidgetLibraryEntry(entry, merged.widgetLibrary.length);
    if (!normalized || knownWidgetLibraryEntries.has(widgetLibrarySignature(normalized))) return;
    normalized.id = uid();
    normalized.order = merged.widgetLibrary.length;
    merged.widgetLibrary.push(normalized);
    knownWidgetLibraryEntries.add(widgetLibrarySignature(normalized));
    stats.widgets++;
  });
  merged.panelCustomBlocks = Array.isArray(merged.panelCustomBlocks) ? merged.panelCustomBlocks : [];
  const existingPanelTypes = new Set(merged.panelCustomBlocks.filter((block) => block.type !== 'iframe').map((block) => block.type));
  const existingPanelUrls = new Set(merged.panelCustomBlocks.filter((block) => block.type === 'iframe').map((block) => block.url));
  source.panelCustomBlocks.forEach((block) => {
    if (merged.panelCustomBlocks.length >= MAX_CUSTOM_PANEL_BLOCKS) return;
    if (block.type === 'iframe') {
      if (!isValidEmbedUrl(block.url) || existingPanelUrls.has(block.url)) return;
      existingPanelUrls.add(block.url);
    } else {
      if (existingPanelTypes.has(block.type)) return;
      existingPanelTypes.add(block.type);
    }
    merged.panelCustomBlocks.push({ ...block, id: uid(), order: merged.panelCustomBlocks.length });
    stats.widgets++;
  });

  source.workspaces.forEach((workspace) => {
    const bookmarkIds = workspace.bookmarkIds.map((id) => bookmarkMap.get(id)).filter(Boolean);
    if (!bookmarkIds.length) return;
    let target = merged.workspaces.find((item) => normalizedName(item.name) === normalizedName(workspace.name));
    if (!target) {
      target = { ...workspace, id: uid(), bookmarkIds: [], order: merged.workspaces.length };
      merged.workspaces.push(target);
    }
    bookmarkIds.forEach((id) => {
      if (!target.bookmarkIds.includes(id)) target.bookmarkIds.push(id);
    });
  });

  merged.version = APP.version;
  return { data: merged, stats };
}

function backupCurrentData() {
  exportData();
}

function confirmMergedImport(incoming, fileName) {
  incoming = detachImportedNativeLinks(incoming);
  const preview = mergeDashboardData(state.data, incoming);
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Integrar favoritos' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: `Archivo: ${fileName}. Se conservarán tus favoritos, grupos, ajustes y fondo actuales.` }),
    el('p', { text: `${preview.stats.added} nuevos · ${preview.stats.existing} ya existentes · ${preview.stats.categories} categorías creadas${preview.stats.widgets ? ` · ${preview.stats.widgets} widgets añadidos` : ''}${preview.stats.invalid ? ` · ${preview.stats.invalid} enlaces no válidos omitidos` : ''}` }),
    el('p', { class: 'modal-subtitle', text: 'Antes de integrar se descargará una copia de seguridad JSON.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', {
    class: 'btn primary', text: 'Integrar', onclick: () => {
      backupCurrentData();
      state.data = preview.data;
      saveData();
      renderAll();
      closeModal();
      toast(`${preview.stats.added} favoritos integrados`, 'success');
    }
  }));
  modal.append(header, body, footer);
  openModal(modal);
}

function importData(jsonText, fileName = 'copia JSON') {
  if (typeof jsonText !== 'string' || jsonText.length > 25 * 1024 * 1024) {
    toast('La copia supera el límite de importación de 25 MB.', 'error');
    return false;
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    toast('El archivo JSON no es válido', 'error');
    return false;
  }
  if (parsed && parsed.format === FULL_BACKUP_FORMAT) {
    if (!validateData(parsed.dashboard)) {
      toast('La copia completa no tiene el formato correcto', 'error');
      return false;
    }
    confirmFullBackupRestore(parsed, fileName);
    return true;
  }
  if (!validateData(parsed)) {
    toast('El archivo no tiene el formato correcto', 'error');
    return false;
  }
  confirmMergedImport(parsed, fileName);
  return true;
}

function restoredCalendarConnections(value) {
  const safe = {};
  Object.entries(value || {}).forEach(([provider, connection]) => {
    if (!['google', 'microsoft'].includes(provider) || !connection || !String(connection.clientId || '').trim()) return;
    safe[provider] = {
      authMode: connection.authMode === 'pkce' ? 'pkce' : 'implicit',
      clientId: String(connection.clientId).trim(),
      redirectUri: String(connection.redirectUri || '').trim(),
      calendars: Array.isArray(connection.calendars) ? connection.calendars.map((calendar) => ({ id: String(calendar.id || ''), name: String(calendar.name || calendar.id || '') })).filter((calendar) => calendar.id) : [],
      token: null,
      connectedAt: Number(connection.connectedAt) || Date.now(),
      lastSyncAt: 0,
      needsReconnect: true,
      silentRenewAttemptAt: 0
    };
  });
  return safe;
}

async function restoreFullBackup(backup) {
  if (!validateData(backup?.dashboard)) throw new Error('Copia no válida. No se han cambiado los datos.');
  const previousTaskIds = tasks().map((task) => task.id);
  const restored = migrateData(detachImportedNativeLinks(backup.dashboard), false);
  state.data = restored;
  state.data.settings.lastBackupAt = Date.now();
  state.currentView = 'home';
  state.activeCategoryId = null;
  state.searchQuery = '';
  state.quickViewMode = state.data.settings.quickViewMode || 'icon';
  state.viewMode = state.data.settings.viewMode || 'grid';
  state.sortMode = state.data.settings.sortMode || 'custom';
  previousTaskIds.forEach((id) => syncTaskReminder({ id, status: 'done' }));
  personalCalendarConnections = restoredCalendarConnections(backup.calendarConnections);
  try { await savePersonalCalendarConnections(); } catch {}
  saveData();
  applySkin(state.data.settings.skin || 'default');
  applyTheme(state.data.settings.theme || 'dark');
  applyWallpaper();
  setSidebarWidth(state.data.settings.sidebarWidth, false);
  setPanelWidth(state.data.settings.panelWidth, false);
  setSidebarCollapsed(!!state.data.settings.sidebarCollapsed, false);
  setPanelCollapsed(!!state.data.settings.panelCollapsed, false);
  setPanelExpanded(!!state.data.settings.panelExpanded, false);
  if (els.webEngine) els.webEngine.value = state.data.settings.webEngine || 'google';
  applyInterfaceLanguage();
  scheduleCalendarAutoSync();
  syncAllTaskReminders();
  updateCalendarSyncButton();
  renderAll();
  toast('Copia restaurada. Vuelve a elegir la carpeta de sincronización y renueva los calendarios externos.', 'success');
}

function confirmFullBackupRestore(backup, fileName) {
  const dashboard = migrateData(cloneBackupValue(backup.dashboard), false);
  const connections = Object.keys(restoredCalendarConnections(backup.calendarConnections)).length;
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Restaurar copia completa' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: `Archivo: ${fileName}. Esta acción sustituirá el Dashboard actual por la copia guardada.` }),
    el('p', { class: 'modal-subtitle', text: `${dashboard.bookmarks.length} favoritos · ${dashboard.categories.length} categorías · ${dashboard.workspaces.length} espacios · ${dashboard.quickGroups.length} grupos fijados · ${dashboard.tasks.length} tareas/eventos · ${dashboard.stickyNotes.length} notas · ${dashboard.panelCustomBlocks.length} bloques personalizados${connections ? ` · ${connections} conexiones de calendario para renovar` : ''}` }),
    el('p', { text: 'Antes de restaurar se descargará una copia completa del estado actual. Las cuentas de Google y Microsoft requerirán renovar el acceso por seguridad.' }),
    el('p', { text: 'La escritura de marcadores quedará desactivada. Los vínculos con el navegador de origen se descartarán: vuelve a elegir la carpeta de sincronización desde Ajustes después de restaurar.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn primary', text: 'Crear copia y restaurar', onclick: async () => {
    exportData();
    await restoreFullBackup(backup);
    closeModal();
  } }));
  modal.append(header, body, footer);
  openModal(modal);
}

async function resetData() {
  const taskIds = tasks().map((task) => task.id);
  state.data = defaultData();
  state.data.empty = true;
  state.currentView = 'home';
  state.activeCategoryId = null;
  taskIds.forEach((id) => syncTaskReminder({ id, status: 'done' }));
  await clearPersonalCalendarConnections();
  saveData();
  applyWallpaper();
  renderAll();
  toast('Dashboard restablecido y datos locales eliminados', 'info');
}

/* ============================================================
   LÓGICA DE CATEGORÍAS (jerárquica)
   ============================================================ */

function getCategory(id) {
  return state.data.categories.find((c) => c.id === id);
}

function getBookmark(id) {
  return state.data.bookmarks.find((b) => b.id === id);
}

function getChildren(parentId) {
  const pid = parentId || null;
  return state.data.categories
    .filter((c) => (c.parentId || null) === pid)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function getDirectCount(categoryId) {
  return state.data.bookmarks.filter((b) => b.categoryId === categoryId).length;
}

function getCategoryPath(id) {
  const path = [];
  const seen = new Set();
  let node = getCategory(id);
  while (node && !seen.has(node.id)) {
    seen.add(node.id);
    path.unshift(node);
    node = node.parentId ? getCategory(node.parentId) : null;
  }
  return path;
}

function getCategoryColor(categoryOrId, seen = new Set()) {
  const category = typeof categoryOrId === 'string' ? getCategory(categoryOrId) : categoryOrId;
  if (!category) return getThemeCategoryColor();
  if (seen.has(category.id)) return resolveCategoryColor(category.color);
  seen.add(category.id);
  const parent = category.parentId ? getCategory(category.parentId) : null;
  if (category.inheritColor && parent) return getCategoryColor(parent, seen);
  return resolveCategoryColor(category.color);
}

function getThemeCategoryColor() {
  const color = document.body ? getComputedStyle(document.body).getPropertyValue('--primary').trim() : '';
  return color || '#8E58D7';
}

function resolveCategoryColor(color) {
  return !color || color === 'theme' ? getThemeCategoryColor() : color;
}

function cssColorToHex(color) {
  const value = resolveCategoryColor(color).trim();
  const short = /^#([0-9a-f]{3})$/i.exec(value);
  if (short) return '#' + short[1].split('').map((part) => part + part).join('');
  const full = /^#([0-9a-f]{6})$/i.exec(value);
  if (full) return '#' + full[1];
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value);
  if (rgb) return '#' + rgb.slice(1, 4).map((part) => Math.max(0, Math.min(255, Number(part))).toString(16).padStart(2, '0')).join('');
  return '#8e58d7';
}

function isValidCssColor(value) {
  if (!value || typeof value !== 'string') return false;
  const probe = document.createElement('span');
  probe.style.color = '';
  probe.style.color = value.trim();
  return !!probe.style.color;
}

function createCategoryColorControl(initialColor) {
  let selectedColor = initialColor || 'theme';
  const control = el('div', { class: 'category-color-control' });
  const options = el('div', { class: 'color-options category-palette' });
  const themeButton = el('button', { class: 'color-option theme-color-option', type: 'button', title: 'Usar el color del tema', 'aria-label': 'Usar el color del tema' });
  themeButton.innerHTML = '<span></span>';
  options.appendChild(themeButton);
  APP.categoryColors.forEach((color) => {
    options.appendChild(el('button', { class: 'color-option', type: 'button', style: `background:${color}`, 'data-color': color, 'aria-label': `Color ${color}` }));
  });
  const manual = el('div', { class: 'manual-color-inputs' });
  const picker = el('input', { class: 'native-color-picker', type: 'color', value: cssColorToHex(selectedColor), 'aria-label': 'Selector de color' });
  const textInput = el('input', { class: 'form-input color-code-input', type: 'text', value: selectedColor === 'theme' ? '' : selectedColor, placeholder: '#8E58D7 o rgb(142, 88, 215)', 'aria-label': 'Color hexadecimal o RGB' });
  manual.append(picker, textInput);
  control.append(options, manual, el('p', { class: 'form-hint', text: 'El primer botón usa automáticamente el color principal del tema actual.' }));

  const refresh = () => {
    options.querySelectorAll('.color-option').forEach((option) => option.classList.toggle('selected', option === themeButton ? selectedColor === 'theme' : option.dataset.color === selectedColor));
    picker.value = cssColorToHex(selectedColor);
    textInput.value = selectedColor === 'theme' ? '' : selectedColor;
    textInput.classList.remove('invalid');
  };
  const setColor = (value) => { selectedColor = value || 'theme'; refresh(); };
  themeButton.addEventListener('click', () => setColor('theme'));
  options.querySelectorAll('[data-color]').forEach((option) => option.addEventListener('click', () => setColor(option.dataset.color)));
  picker.addEventListener('input', () => setColor(picker.value));
  textInput.addEventListener('change', () => {
    const value = textInput.value.trim();
    if (!value) { setColor('theme'); return; }
    if (!isValidCssColor(value)) { textInput.classList.add('invalid'); return; }
    setColor(value);
  });
  refresh();
  return { element: control, value: () => selectedColor };
}

function createBookmarkColorControl(initialColor) {
  let selectedColor = initialColor || null;
  const control = el('div', { class: 'category-color-control' });
  const options = el('div', { class: 'color-options category-palette' });
  const automatic = el('button', { class: 'color-option theme-color-option', type: 'button', title: 'Usar el color de la categoría', 'aria-label': 'Usar el color de la categoría' });
  automatic.innerHTML = '<span></span>';
  options.appendChild(automatic);
  APP.categoryColors.forEach((color) => options.appendChild(el('button', { class: 'color-option', type: 'button', style: `background:${color}`, 'data-color': color, 'aria-label': `Color ${color}` })));
  const manual = el('div', { class: 'manual-color-inputs' });
  const picker = el('input', { class: 'native-color-picker', type: 'color', value: cssColorToHex(selectedColor || getThemeCategoryColor()), 'aria-label': 'Selector de color' });
  const textInput = el('input', { class: 'form-input color-code-input', type: 'text', value: selectedColor || '', placeholder: '#8E58D7 o rgb(142, 88, 215)', 'aria-label': 'Color hexadecimal o RGB' });
  manual.append(picker, textInput);
  control.append(options, manual, el('p', { class: 'form-hint', text: 'El primer botón usa el color heredado de su categoría. También puedes introducir RGB o hexadecimal.' }));
  const refresh = () => {
    options.querySelectorAll('.color-option').forEach((option) => option.classList.toggle('selected', option === automatic ? !selectedColor : option.dataset.color === selectedColor));
    picker.value = cssColorToHex(selectedColor || getThemeCategoryColor());
    textInput.value = selectedColor || '';
    textInput.classList.remove('invalid');
  };
  const setColor = (value) => { selectedColor = value || null; refresh(); };
  automatic.addEventListener('click', () => setColor(null));
  options.querySelectorAll('[data-color]').forEach((option) => option.addEventListener('click', () => setColor(option.dataset.color)));
  picker.addEventListener('input', () => setColor(picker.value));
  textInput.addEventListener('change', () => {
    const value = textInput.value.trim();
    if (!value) { setColor(null); return; }
    if (!isValidCssColor(value)) { textInput.classList.add('invalid'); return; }
    setColor(value);
  });
  refresh();
  return { element: control, value: () => selectedColor };
}

function hexToRgba(color, alpha) {
  const value = String(resolveCategoryColor(color) || '').replace('#', '').trim();
  const hex = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  if (!/^[0-9a-f]{6}$/i.test(hex)) return `rgba(142, 88, 215, ${alpha})`;
  const number = Number.parseInt(hex, 16);
  return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
}

function categoryColorStyle(category) {
  const color = getCategoryColor(category);
  return `--category-color:${color};--category-color-soft:${hexToRgba(color, 0.15)};--category-color-strong:${hexToRgba(color, 0.32)};`;
}

function getDescendantIds(id) {
  const result = [id];
  let frontier = [id];
  while (frontier.length) {
    const next = [];
    frontier.forEach((fid) => {
      getChildren(fid).forEach((ch) => {
        next.push(ch.id);
        result.push(ch.id);
      });
    });
    frontier = next;
  }
  return result;
}

function isInActivePath(id) {
  if (!state.activeCategoryId) return false;
  return getCategoryPath(state.activeCategoryId).some((c) => c.id === id);
}

function addCategory(name, parentId, color, inheritColor) {
  const clean = name.trim();
  if (!clean) return null;
  const pid = parentId || null;
  const cat = {
    id: uid(),
    name: clean,
    parentId: pid,
    color: color || 'theme',
    inheritColor: typeof inheritColor === 'boolean' ? inheritColor : !!pid,
    createdAt: Date.now(),
    order: state.data.categories.filter((c) => (c.parentId || null) === pid).length,
    collapsed: pid ? true : false
  };
  state.data.categories.push(cat);
  saveData();
  renderAll();
  queueNativeCategoryWrite(cat);
  toast(`Categoría "${clean}" creada`, 'success');
  return cat;
}

function updateCategory(id, changes) {
  const cat = getCategory(id);
  if (!cat) return null;

  if (changes.name !== undefined && changes.name.trim()) cat.name = changes.name.trim();
  if (changes.parentId !== undefined) {
    const pid = changes.parentId || null;
    if (pid !== id && !getDescendantIds(id).includes(pid)) cat.parentId = pid;
  }
  if (changes.color !== undefined) cat.color = changes.color || 'theme';
  if (changes.inheritColor !== undefined) cat.inheritColor = !!changes.inheritColor && !!cat.parentId;
  if (!cat.parentId) cat.inheritColor = false;

  saveData();
  renderAll();
  queueNativeCategoryWrite(cat);
  toast('Categoría actualizada', 'success');
  return cat;
}

function deleteCategory(id) {
  const cat = getCategory(id);
  if (!cat) return;
  const ids = getDescendantIds(id);
  const removedCategories = state.data.categories.filter((category) => ids.includes(category.id));
  const removedBookmarks = state.data.bookmarks.filter((bookmark) => ids.includes(bookmark.categoryId));
  const trashEntry = addToTrash('category-tree', cat.name, {
    categories: removedCategories,
    bookmarks: removedBookmarks,
    memberships: bookmarkMemberships(removedBookmarks.map((bookmark) => bookmark.id))
  });
  const removedById = new Map(removedCategories.map((category) => [category.id, category]));
  const nativeRemovalRoots = removedCategories.filter((category) => {
    if (!nativeFolderIdForCategory(category)) return false;
    let parent = category.parentId ? removedById.get(category.parentId) : null;
    while (parent) {
      if (nativeFolderIdForCategory(parent)) return false;
      parent = parent.parentId ? removedById.get(parent.parentId) : null;
    }
    return true;
  });
  const isCoveredByNativeFolderRemoval = (bookmark) => {
    let category = bookmark.categoryId ? removedById.get(bookmark.categoryId) : null;
    while (category) {
      if (nativeRemovalRoots.some((root) => root.id === category.id)) return true;
      category = category.parentId ? removedById.get(category.parentId) : null;
    }
    return false;
  };
  const bmCount = state.data.bookmarks.filter((b) => ids.includes(b.categoryId)).length;
  state.data.categories = state.data.categories.filter((c) => !ids.includes(c.id));
  state.data.bookmarks = state.data.bookmarks.filter((b) => !ids.includes(b.categoryId));
  if (state.activeCategoryId && ids.includes(state.activeCategoryId)) {
    state.activeCategoryId = null;
    state.currentView = 'home';
  }
  saveData();
  renderAll();
  removedBookmarks.filter((bookmark) => !isCoveredByNativeFolderRemoval(bookmark)).forEach((bookmark) => queueNativeBookmarkRemoval(bookmark));
  nativeRemovalRoots.forEach((category) => queueNativeCategoryRemoval(category));
  notifyTrashEntry(trashEntry);
}

function toggleCategoryCollapse(id) {
  const cat = getCategory(id);
  if (!cat) return;
  cat.collapsed = !cat.collapsed;
  saveData();
  renderSidebar();
}

function toggleAllCategories() {
  const anyExpanded = state.data.categories.some((c) => !c.collapsed);
  state.data.categories.forEach((c) => { c.collapsed = anyExpanded; });
  saveData();
  renderSidebar();
  updateCollapseAllBtn();
  toast(anyExpanded ? 'Categorías contraídas' : 'Categorías desplegadas', 'info');
}

function updateCollapseAllBtn() {
  if (!els.collapseAllBtn) return;
  const anyExpanded = state.data.categories.some((c) => !c.collapsed);
  const collapseSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>';
  const expandSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="7 11 12 16 17 11"></polyline><polyline points="7 18 12 23 17 18"></polyline></svg>';
  els.collapseAllBtn.innerHTML = anyExpanded ? collapseSvg : expandSvg;
  els.collapseAllBtn.setAttribute('aria-label', anyExpanded ? 'Contraer todas las categorías' : 'Desplegar todas las categorías');
  els.collapseAllBtn.setAttribute('title', anyExpanded ? 'Contraer todas las categorías' : 'Desplegar todas las categorías');
}

function selectCategory(id) {
  state.auditStatusFilter = null;
  state.currentView = 'category';
  state.activeCategoryId = id;
  els.sidebar.querySelectorAll('.sidebar-item').forEach((i) => i.classList.remove('active'));
  let node = getCategory(id);
  while (node) {
    node.collapsed = false;
    node = node.parentId ? getCategory(node.parentId) : null;
  }
  saveData();
  renderSidebar();
  renderCurrentView();
}

function selectNavView(view) {
  // La antigua cola "Para después" reutiliza el mismo hueco de navegación,
  // pero ahora abre el gestor de ideas; los favoritos existentes no se alteran.
  if (view === 'later' && typeof openProjectManager === 'function') {
    state.currentView = 'later';
    renderSidebar();
    renderCurrentView();
    return;
  }
  state.auditStatusFilter = null;
  state.currentView = view;
  state.activeCategoryId = null;
  renderSidebar();
  renderCurrentView();
}

/* ============================================================
   LÓGICA DE FAVORITOS
   ============================================================ */

function openBookmark(id) {
  const bookmark = getBookmark(id);
  if (!bookmark) return;

  bookmark.useCount += 1;
  bookmark.lastAccess = Date.now();
  addActivity('opened', bookmark.name);
  saveData();
  renderSidebar();
  renderPanel();
  renderCurrentView();

  if (bookmark.url && isValidUrl(bookmark.url)) {
    window.open(bookmark.url, '_blank', 'noopener');
  }
}

function togglePin(id) {
  const bookmark = getBookmark(id);
  if (!bookmark) return;
  bookmark.pinned = !bookmark.pinned;
  saveData();
  renderSidebar();
  renderPanel();
  renderCurrentView();
  toast(bookmark.pinned ? `${bookmark.name} fijado` : `${bookmark.name} desfijado`, 'info');
}

function addBookmark(bm) {
  const bookmark = {
    id: uid(),
    name: bm.name.trim(),
    url: normalizeUrl(bm.url),
    description: (bm.description || '').trim(),
    categoryId: bm.categoryId || null,
    color: bm.color || null,
    iconUrl: bm.iconUrl || null,
    tags: Array.isArray(bm.tags) ? bm.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12) : [],
    status: bm.status === 'later' ? 'later' : 'saved',
    pinned: !!bm.pinned,
    useCount: 0,
    lastAccess: 0,
    createdAt: Date.now(),
    order: state.data.bookmarks.filter((b) => b.categoryId === bm.categoryId).length
  };

  if (!isValidUrl(bookmark.url)) {
    toast('La URL no es válida', 'error');
    return null;
  }

  state.data.bookmarks.push(bookmark);
  addActivity('added', bookmark.name);
  saveData();
  renderAll();
  queueNativeBookmarkWrite(bookmark);
  toast(`Favorito "${bookmark.name}" añadido`, 'success');
  return bookmark;
}

function updateBookmark(id, changes) {
  const bookmark = getBookmark(id);
  if (!bookmark) return null;

  if (changes.name !== undefined) bookmark.name = changes.name.trim() || bookmark.name;
  if (changes.url !== undefined) {
    const url = normalizeUrl(changes.url);
    if (!isValidUrl(url)) {
      toast('La URL no es válida', 'error');
      return null;
    }
    if (canonicalUrl(bookmark.url) !== canonicalUrl(url)) {
      delete bookmark.auditStatus;
      delete bookmark.auditDetail;
      delete bookmark.auditHttpStatus;
      delete bookmark.auditCheckedAt;
    }
    bookmark.url = url;
  }
  if (changes.description !== undefined) bookmark.description = (changes.description || '').trim();
  if (changes.categoryId !== undefined) bookmark.categoryId = changes.categoryId || null;
  if (changes.color !== undefined) bookmark.color = changes.color || null;
  if (changes.iconUrl !== undefined) bookmark.iconUrl = changes.iconUrl || null;
  if (changes.tags !== undefined) bookmark.tags = Array.isArray(changes.tags) ? changes.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12) : bookmark.tags;
  if (changes.status !== undefined) bookmark.status = changes.status === 'later' ? 'later' : 'saved';

  addActivity('updated', bookmark.name);
  saveData();
  renderAll();
  queueNativeBookmarkWrite(bookmark);
  toast('Favorito actualizado', 'success');
  return bookmark;
}

function deleteBookmark(id) {
  const bookmark = getBookmark(id);
  if (!bookmark) return;
  const trashEntry = addToTrash('bookmark', bookmark.name, { bookmark, membership: bookmarkMemberships([id])[id] });
  state.data.bookmarks = state.data.bookmarks.filter((b) => b.id !== id);
  state.data.quickGroups.forEach((group) => { group.bookmarkIds = group.bookmarkIds.filter((memberId) => memberId !== id); });
  state.data.workspaces.forEach((workspace) => { workspace.bookmarkIds = workspace.bookmarkIds.filter((memberId) => memberId !== id); });
  addActivity('deleted', bookmark.name);
  saveData();
  renderAll();
  queueNativeBookmarkRemoval(bookmark);
  notifyTrashEntry(trashEntry);
}

function duplicateBookmark(id) {
  const source = getBookmark(id);
  if (!source) return;
  const copy = {
    ...source,
    id: uid(),
    name: source.name + ' (copia)',
    pinned: false,
    useCount: 0,
    lastAccess: 0,
    order: state.data.bookmarks.filter((b) => b.categoryId === source.categoryId).length
  };
  state.data.bookmarks.push(copy);
  saveData();
  renderAll();
  queueNativeBookmarkWrite(copy);
  toast('Favorito duplicado', 'success');
}

function moveBookmark(id, categoryId) {
  const bookmark = getBookmark(id);
  if (!bookmark || !getCategory(categoryId)) return;
  bookmark.categoryId = categoryId;
  bookmark.order = state.data.bookmarks.filter((b) => b.categoryId === categoryId).length;
  saveData();
  renderAll();
  queueNativeBookmarkWrite(bookmark);
  toast(`Movido a "${getCategory(categoryId).name}"`, 'success');
}

function recordUsage(id) {
  const bookmark = getBookmark(id);
  if (!bookmark) return;
  bookmark.useCount += 1;
  bookmark.lastAccess = Date.now();
  addActivity('opened', bookmark.name);
  saveData();
  renderPanel();
}

function addActivity(type, label) {
  if (!state.data) return;
  if (!Array.isArray(state.data.activity)) state.data.activity = [];
  state.data.activity.push({ id: uid(), type, label: String(label || ''), at: Date.now() });
  if (state.data.activity.length > 300) state.data.activity = state.data.activity.slice(-300);
}

/* ============================================================
   FILTRADO Y ORDENACIÓN
   ============================================================ */

function getVisibleBookmarks() {
  let bookmarks = state.data.bookmarks;
  const q = normalizeSearchText(state.searchQuery);

  if (state.currentView === 'category' && state.activeCategoryId) {
    bookmarks = bookmarks.filter((b) => b.categoryId === state.activeCategoryId);
  } else if (state.currentView === 'pinned') {
    bookmarks = bookmarks.filter((b) => b.pinned);
  } else if (state.currentView === 'later') {
    bookmarks = bookmarks.filter((b) => b.status === 'later');
  } else if (state.currentView === 'recent') {
    bookmarks = bookmarks.filter((b) => b.lastAccess > 0).sort((a, b) => b.lastAccess - a.lastAccess);
    return bookmarks;
  } else if (state.currentView === 'frequent') {
    bookmarks = bookmarks.filter((b) => b.useCount > 0).sort((a, b) => b.useCount - a.useCount);
    return bookmarks;
  }

  if (state.auditStatusFilter) {
    bookmarks = bookmarks.filter((bookmark) => matchesBookmarkAuditFilter(bookmark, state.auditStatusFilter));
  }

  if (q) {
    bookmarks = bookmarks
      .map((bookmark) => ({ bookmark, score: bookmarkSearchScore(bookmark, q) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.bookmark);
    return bookmarks;
  }

  switch (state.sortMode) {
    case 'name':
    case 'name-asc':
      bookmarks = [...bookmarks].sort((a, b) => a.name.localeCompare(b.name, getLocale()));
      break;
    case 'name-desc':
      bookmarks = [...bookmarks].sort((a, b) => b.name.localeCompare(a.name, getLocale()));
      break;
    case 'frequent':
    case 'frequent-desc':
      bookmarks = [...bookmarks].sort((a, b) => b.useCount - a.useCount);
      break;
    case 'frequent-asc':
      bookmarks = [...bookmarks].sort((a, b) => a.useCount - b.useCount);
      break;
    case 'recent':
    case 'recent-desc':
      bookmarks = [...bookmarks].sort((a, b) => b.lastAccess - a.lastAccess);
      break;
    case 'recent-asc':
      bookmarks = [...bookmarks].sort((a, b) => a.lastAccess - b.lastAccess);
      break;
    default:
      bookmarks = [...bookmarks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return bookmarks;
}

function bookmarkSearchScore(bookmark, query) {
  const category = getCategory(bookmark.categoryId);
  const fields = [bookmark.name, getDomain(bookmark.url), bookmark.url, bookmark.description || '', ...(bookmark.tags || []), category ? category.name : '']
    .join(' ');
  const searchableFields = normalizeSearchText(fields);
  return query.split(/\s+/).reduce((score, token) => {
    if (score < 0) return -1;
    const direct = searchableFields.indexOf(token);
    if (direct >= 0) return score + 100 - Math.min(direct, 90);
    let cursor = 0;
    for (const char of token) {
      cursor = searchableFields.indexOf(char, cursor);
      if (cursor < 0) return -1;
      cursor++;
    }
    return score + 10;
  }, 0);
}

/* ============================================================
   RENDERIZADO
   ============================================================ */

function renderAll() {
  renderBrand();
  renderSidebar();
  renderPanel();
  renderCurrentView();
  updateEditModeUI();
  updateCalendarSyncButton();
  updateCollapseAllBtn();
}

function renderBrand() {
  const name = state.data.settings.name || APP.defaults.settings.name;
  els.brandName.textContent = name;
  document.title = `${name} • ${state.data.settings.greeting || APP.defaults.settings.greeting}`;
}

/* ---------- Tema (skin) + modo claro/oscuro + fondo ---------- */
function applyTheme(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('light', light);
  if (els.themeIcon) els.themeIcon.innerHTML = light ? ICONS.moon : ICONS.sun;
  els.themeToggle.setAttribute('aria-label', t(light ? 'darkMode' : 'lightMode'));
  els.themeToggle.setAttribute('title', t(light ? 'darkMode' : 'lightMode'));
}

function applySkin(skin) {
  const s = APP.themes[skin] ? skin : 'default';
  document.body.setAttribute('data-theme', s);
}

function applyWallpaper() {
  const url = state.data.wallpaper;
  if (url) {
    document.body.classList.add('has-wallpaper');
    document.body.style.setProperty('--wallpaper-url', 'url("' + url + '")');
    const op = state.data.wallpaperOpacity == null ? 100 : state.data.wallpaperOpacity;
    const clamped = Math.min(100, Math.max(0, Number(op))) / 100;
    document.body.style.setProperty('--wallpaper-opacity', String(clamped));
  } else {
    document.body.classList.remove('has-wallpaper');
    document.body.style.removeProperty('--wallpaper-url');
    document.body.style.removeProperty('--wallpaper-opacity');
  }
}

/* ---------- Sidebar (árbol) ---------- */
function renderSidebar() {
  const catList = els.categoriesList;
  catList.textContent = '';
  if (els.sortCategoriesBtn) {
    const alphabetical = state.data.settings.categorySort === 'name';
    els.sortCategoriesBtn.classList.toggle('active', alphabetical);
    els.sortCategoriesBtn.title = alphabetical ? 'Usar orden personalizado' : 'Ordenar categorías alfabéticamente';
    els.sortCategoriesBtn.setAttribute('aria-label', els.sortCategoriesBtn.title);
  }

  const roots = getChildren(null).slice().sort((a, b) => {
    if (state.data.settings.categorySort === 'name') return String(a.name || '').localeCompare(String(b.name || ''), getLanguage(), { sensitivity: 'base', numeric: true });
    return (a.order || 0) - (b.order || 0);
  });
  if (roots.length === 0) {
    catList.appendChild(el('li', { class: 'panel-empty', text: 'Sin categorías' }));
    return;
  }

  roots.forEach((root) => catList.appendChild(renderCategoryNode(root, 0)));
}

function renderCategoryNode(cat, depth) {
  const li = el('li', { class: 'category-node' });
  const children = getChildren(cat.id).slice().sort((a, b) => {
    if (state.data.settings.categorySort === 'name') return String(a.name || '').localeCompare(String(b.name || ''), getLanguage(), { sensitivity: 'base', numeric: true });
    return (a.order || 0) - (b.order || 0);
  });
  const directBookmarks = state.data.bookmarks.filter(b => b.categoryId === cat.id).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  const hasChildren = children.length > 0 || directBookmarks.length > 0;
  const expanded = !cat.collapsed;
  const isActive = state.activeCategoryId === cat.id;
  const isAncestor = isInActivePath(cat.id);

  const row = el('div', {
    class: 'category-row' + (isActive ? ' active' : isAncestor ? ' ancestor-active' : ''),
    style: `padding-left:${8 + depth * 16}px;${categoryColorStyle(cat)}`
  });

  const chevron = hasChildren
    ? el('button', {
        class: 'tree-chevron' + (expanded ? ' expanded' : ''),
        'aria-label': expanded ? 'Contraer' : 'Expandir',
        'aria-expanded': String(expanded),
        html: ICONS.chevronRight,
        onclick: (e) => { e.stopPropagation(); toggleCategoryCollapse(cat.id); }
      })
    : el('span', { class: 'tree-chevron leaf', 'aria-hidden': 'true', html: '&nbsp;' });

  const dot = el('span', { class: 'category-item-dot' });
  const name = el('span', { class: 'category-item-name', text: cat.name });
  const count = el('span', { class: 'category-item-count', text: String(getDirectCount(cat.id)) });

  const actions = el('span', { class: 'category-item-actions' });
  actions.append(
    el('button', {
      class: 'icon-btn', 'aria-label': `Editar ${cat.name}`, title: 'Editar', html: ICONS.edit,
      onclick: (e) => { e.stopPropagation(); openCategoryForm(cat.id); }
    }),
    el('button', {
      class: 'icon-btn', 'aria-label': `Añadir subcategoría a ${cat.name}`, title: 'Añadir subcategoría', html: ICONS.plus,
      onclick: (e) => { e.stopPropagation(); openCategoryForm(null, cat.id); }
    }),
    el('button', {
      class: 'icon-btn', 'aria-label': `Eliminar ${cat.name}`, title: 'Eliminar', html: ICONS.trash,
      onclick: (e) => { e.stopPropagation(); confirmDeleteCategory(cat.id); }
    })
  );

  row.append(chevron, dot, name, count, actions);
  row.addEventListener('click', () => selectCategory(cat.id));
  li.appendChild(row);

  if (hasChildren && expanded) {
    const subList = el('ul', { class: 'sidebar-sub-list' });
    children.forEach((child) => subList.appendChild(renderCategoryNode(child, depth + 1)));
    directBookmarks.forEach(bookmark => {
      const item=el('li',{class:'sidebar-bookmark-node'});
      const link=el('button',{class:'sidebar-bookmark-link',draggable:'true',title:bookmark.name+' — '+bookmark.url,style:`padding-left:${28+depth*16}px`,text:bookmark.name,onclick:()=>openBookmark(bookmark.id)});
      link.addEventListener('dragstart',event=>{event.stopPropagation();state.draggingId=bookmark.id;state.draggingQuickKey=null;event.dataTransfer.effectAllowed='copy';event.dataTransfer.setData('application/x-dashboard-sidebar-bookmark',bookmark.id);event.dataTransfer.setData('text/plain',bookmark.id);});
      link.addEventListener('dragend',()=>{state.draggingId=null;hideDropOverlay();});
      const actions=el('span',{class:'sidebar-bookmark-actions'});
      actions.append(
        el('button',{class:'icon-btn small',title:'Renombrar enlace','aria-label':'Renombrar '+bookmark.name,html:ICONS.edit,onclick:e=>{e.stopPropagation();openSidebarBookmarkRename(bookmark.id);}}),
        el('button',{class:'icon-btn small danger',title:'Eliminar enlace','aria-label':'Eliminar '+bookmark.name,html:ICONS.trash,onclick:e=>{e.stopPropagation();confirmDeleteBookmark(bookmark.id);}})
      );
      item.append(link,actions);subList.append(item);
    });
    li.appendChild(subList);
  }

  return li;
}

/* ---------- Vista actual ---------- */
function openSidebarBookmarkRename(id) {
  const bookmark=getBookmark(id);if(!bookmark)return;
  const input=el('input',{class:'form-input',type:'text',value:bookmark.name,maxlength:'300','aria-label':'Nombre del enlace'});
  const modal=el('div',{class:'modal',role:'dialog','aria-label':'Renombrar enlace'});
  const save=()=>{const name=input.value.trim();if(!name){input.classList.add('invalid');input.focus();return;}updateBookmark(id,{name});closeModal();};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();save();}});
  modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:'Renombrar enlace'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:closeModal})]),el('div',{class:'modal-body'},[input,el('p',{class:'form-hint',text:nativeWritesEnabled()?'El cambio también se enviará a los marcadores del navegador.':'La escritura bidireccional está desactivada. Actívala en Ajustes > Búsqueda y sincronización para actualizar también el navegador.'})]),el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cancelar',onclick:closeModal}),el('button',{class:'btn primary',text:'Guardar',onclick:save})]));
  openModal(modal);input.focus();input.select();
}

function renderCurrentView() {
  if (state.currentView === 'later' && typeof renderProjectsBody === 'function') {
    renderProjectsBody();
    return;
  }
  const searching = state.searchQuery.trim().length > 0 || !!state.auditStatusFilter;

  if (state.currentView === 'home' && !searching) {
    els.breadcrumb.classList.add('hidden');
    els.subcats.classList.add('hidden');
    showView('home');
    renderWorkspaces();
    renderQuickAccess();
    return;
  }

  showView('category');
  renderCategoryView();
}

function showView(name) {
  document.getElementById('projectsBody')?.classList.add('hidden');
  els.viewHome.classList.toggle('hidden', name !== 'home');
  els.viewCategory.classList.toggle('hidden', name !== 'category');
}

/* ---------- Acceso rápido (fijados + grupos por temática) ---------- */

const expandedQuickGroups = new Set();

function getQuickGroup(id) {
  return state.data.quickGroups.find((g) => g.id === id);
}

function getGroupOfBookmark(bookmarkId) {
  return state.data.quickGroups.find((g) => g.bookmarkIds.includes(bookmarkId));
}

function quickEntryKey(type, id) {
  return `${type}:${id}`;
}

function orderQuickEntries(loose, groups) {
  const entries = [
    ...loose.map((bookmark, index) => ({ type: 'bookmark', key: quickEntryKey('bookmark', bookmark.id), id: bookmark.id, name: bookmark.name, createdAt: bookmark.createdAt, order: index, item: bookmark })),
    ...groups.map((group, index) => ({ type: 'group', key: quickEntryKey('group', group.id), id: group.id, name: group.name, createdAt: group.createdAt, order: loose.length + index, item: group }))
  ];
  const mode = state.data.settings.quickSortMode || 'custom';
  if (mode !== 'custom') return entries.sort((a, b) => compareHomeItems(a, b, mode));

  const liveKeys = new Set(entries.map((entry) => entry.key));
  const stored = Array.isArray(state.data.settings.quickCustomOrder) ? state.data.settings.quickCustomOrder : [];
  const normalized = stored.filter((key, index) => liveKeys.has(key) && stored.indexOf(key) === index);
  entries.forEach((entry) => { if (!normalized.includes(entry.key)) normalized.push(entry.key); });
  state.data.settings.quickCustomOrder = normalized;
  const positions = new Map(normalized.map((key, index) => [key, index]));
  return entries.sort((a, b) => positions.get(a.key) - positions.get(b.key));
}

function clearQuickOrderDropState() {
  els.quickArea?.querySelectorAll('.dragging, .drop-before, .drop-after, .drop-inside').forEach((item) => item.classList.remove('dragging', 'drop-before', 'drop-after', 'drop-inside'));
}

function reorderQuickEntry(fromKey, targetKey, after) {
  if (!fromKey || !targetKey || fromKey === targetKey) return;
  const pinned = state.data.bookmarks.filter((bookmark) => bookmark.pinned);
  const { entries } = getQuickSections(pinned);
  const keys = entries.map((entry) => entry.key);
  const fromIndex = keys.indexOf(fromKey);
  if (fromIndex < 0) return;
  const [moved] = keys.splice(fromIndex, 1);
  let targetIndex = keys.indexOf(targetKey);
  if (targetIndex < 0) return;
  if (after) targetIndex++;
  keys.splice(targetIndex, 0, moved);
  state.data.settings.quickSortMode = 'custom';
  state.data.settings.quickCustomOrder = keys;
  saveData();
  renderQuickAccess();
}

function quickOrderIntent(element, event, canContainBookmark) {
  const rect = element.getBoundingClientRect();
  const horizontal = state.quickViewMode === 'icon';
  const position = horizontal
    ? (event.clientX - rect.left) / Math.max(1, rect.width)
    : (event.clientY - rect.top) / Math.max(1, rect.height);
  if (canContainBookmark && state.draggingId && position >= 0.27 && position <= 0.73) return 'inside';
  return position > 0.5 ? 'after' : 'before';
}

function enableQuickTopLevelOrdering(element, entry, groupId = null) {
  if (groupId) {
    const sidebarDrag=event=>Array.from(event.dataTransfer?.types||[]).includes('application/x-dashboard-sidebar-bookmark');
    element.addEventListener('dragover',event=>{if(!sidebarDrag(event))return;event.preventDefault();event.stopPropagation();event.dataTransfer.dropEffect='copy';element.classList.add('drop-inside');},true);
    element.addEventListener('drop',event=>{if(!sidebarDrag(event))return;event.preventDefault();event.stopImmediatePropagation();element.classList.remove('drop-inside');const id=event.dataTransfer.getData('application/x-dashboard-sidebar-bookmark');state.draggingId=null;hideDropOverlay();if(getBookmark(id))assignToQuickGroup(groupId,id);},true);
  }
  if ((state.data.settings.quickSortMode || 'custom') !== 'custom') return;
  element.draggable = true;
  element.classList.add('order-draggable');
  element.dataset.quickOrderKey = entry.key;
  element.addEventListener('dragstart', (event) => {
    const dragSource = event.target instanceof Element ? event.target.closest('[draggable="true"]') : null;
    if (dragSource && dragSource !== element) return;
    state.draggingQuickKey = entry.key;
    state.draggingId = entry.type === 'bookmark' ? entry.id : null;
    element.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    try { event.dataTransfer.setData('application/x-dashboard-quick-order', entry.key); } catch {}
  });
  element.addEventListener('dragover', (event) => {
    const dragSource = event.target instanceof Element ? event.target.closest('[draggable="true"]') : null;
    if (dragSource && dragSource !== element) return;
    if (!state.draggingQuickKey || state.draggingQuickKey === entry.key) return;
    event.preventDefault();
    clearQuickOrderDropState();
    const intent = quickOrderIntent(element, event, !!groupId);
    element.classList.add(intent === 'inside' ? 'drop-inside' : intent === 'after' ? 'drop-after' : 'drop-before');
  });
  element.addEventListener('dragleave', () => element.classList.remove('drop-before', 'drop-after', 'drop-inside'));
  element.addEventListener('drop', (event) => {
    const dragSource = event.target instanceof Element ? event.target.closest('[draggable="true"]') : null;
    if (dragSource && dragSource !== element) return;
    if (!state.draggingQuickKey) return;
    event.preventDefault();
    event.stopPropagation();
    const intent = quickOrderIntent(element, event, !!groupId);
    const fromKey = state.draggingQuickKey;
    const bookmarkId = state.draggingId;
    clearQuickOrderDropState();
    state.draggingQuickKey = null;
    state.draggingId = null;
    if (intent === 'inside' && groupId && bookmarkId) assignToQuickGroup(groupId, bookmarkId);
    else reorderQuickEntry(fromKey, entry.key, intent === 'after');
  });
  element.addEventListener('dragend', () => {
    state.draggingQuickKey = null;
    state.draggingId = null;
    clearQuickOrderDropState();
  });
}

function nextGroupName() {
  const nums = state.data.quickGroups
    .map((g) => /^Grupo (\d+)$/.exec(g.name || ''))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const n = nums.length ? Math.max(...nums) + 1 : 1;
  return `Grupo ${n}`;
}

function createQuickGroup(name, bookmarkIds = [], color = null, icon = 'folder') {
  const ids = bookmarkIds.filter((id) => getBookmark(id));
  const group = {
    id: uid(),
    name: (name && name.trim()) || nextGroupName(),
    bookmarkIds: ids,
    color: color || APP.categoryColors[state.data.quickGroups.length % APP.categoryColors.length],
    icon: getCollectionIcon(icon, 'folder').id,
    createdAt: Date.now(),
    order: state.data.quickGroups.length
  };
  state.data.quickGroups.push(group);
  ids.forEach((id) => {
    const bm = getBookmark(id);
    if (bm && !bm.pinned) bm.pinned = true;
  });
  saveData();
  renderAll();
  toast('Grupo creado', 'success');
  return group;
}

function updateQuickGroup(id, changes) {
  const group = getQuickGroup(id);
  if (!group) return;
  if (changes.name !== undefined) group.name = (changes.name || '').trim() || group.name;
  if (changes.color !== undefined) group.color = changes.color || group.color;
  if (changes.icon !== undefined) group.icon = getCollectionIcon(changes.icon, 'folder').id;
  saveData();
  renderQuickAccess();
  toast('Grupo actualizado', 'success');
}

function deleteQuickGroup(id) {
  const group = getQuickGroup(id);
  if (!group) return;
  const trashEntry = addToTrash('quick-group', group.name, { group });
  state.data.quickGroups = state.data.quickGroups.filter((g) => g.id !== id);
  saveData();
  renderQuickAccess();
  notifyTrashEntry(trashEntry);
}

function confirmDeleteQuickGroup(id) {
  const group = getQuickGroup(id);
  if (!group) return;
  const modal = el('div', { class: 'modal bookmark-audit-confirm-modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Disolver grupo' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(el('p', { text: `Se disolverá “${group.name}”. Sus favoritos seguirán fijados como accesos individuales.` }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn danger', text: 'Disolver', onclick: () => { deleteQuickGroup(id); closeModal(); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function assignToQuickGroup(groupId, bookmarkId) {
  const group = getQuickGroup(groupId);
  const bookmark = getBookmark(bookmarkId);
  if (!group || !bookmark) return;
  if (!bookmark.pinned) bookmark.pinned = true;
  state.data.quickGroups.forEach((g) => {
    const idx = g.bookmarkIds.indexOf(bookmarkId);
    if (idx !== -1 && g.id !== groupId) g.bookmarkIds.splice(idx, 1);
  });
  if (!group.bookmarkIds.includes(bookmarkId)) group.bookmarkIds.push(bookmarkId);
  saveData();
  renderAll();
  toast(`Añadido a "${group.name}"`, 'success');
}

function removeFromQuickGroup(groupId, bookmarkId) {
  const group = getQuickGroup(groupId);
  if (!group) return;
  group.bookmarkIds = group.bookmarkIds.filter((id) => id !== bookmarkId);
  saveData();
  renderQuickAccess();
  toast('Eliminado del grupo', 'info');
}

function toggleQuickGroup(id) {
  if (expandedQuickGroups.has(id)) expandedQuickGroups.delete(id);
  else expandedQuickGroups.add(id);
  renderQuickAccess();
}

function openQuickGroupForm(groupId) {
  const editing = groupId ? getQuickGroup(groupId) : null;
  const closeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  const modal = el('div', { class: 'modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: editing ? 'Renombrar grupo' : 'Nuevo grupo' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: closeSvg, onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });
  const group = el('div', { class: 'form-group' });
  group.append(el('label', { class: 'form-label', for: 'quick-group-name', text: 'Nombre *' }));
  const nameInput = el('input', { class: 'form-input', id: 'quick-group-name', type: 'text', placeholder: 'Ej: Trabajo', value: editing ? editing.name : '' });
  const nameError = el('span', { class: 'form-error', text: 'El nombre es obligatorio' });
  group.append(nameInput, nameError);
  body.appendChild(group);

  const colorGroup = el('div', { class: 'form-group' });
  colorGroup.append(el('label', { class: 'form-label', text: 'Color' }));
  const colorOptions = el('div', { class: 'color-options' });
  let selectedColor = editing?.color || APP.categoryColors[state.data.quickGroups.length % APP.categoryColors.length];
  APP.categoryColors.forEach((color) => {
    const opt = el('button', {
      class: 'color-option' + (selectedColor === color ? ' selected' : ''),
      style: `background:${color}`,
      'aria-label': `Color ${color}`,
      'data-color': color
    });
    opt.addEventListener('click', () => {
      colorOptions.querySelectorAll('.color-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedColor = color;
    });
    colorOptions.appendChild(opt);
  });
  colorGroup.appendChild(colorOptions);
  body.appendChild(colorGroup);

  let selectedIcon = getCollectionIcon(editing?.icon, 'folder').id;
  const iconGroup = el('div', { class: 'form-group' });
  iconGroup.append(el('label', { class: 'form-label', text: 'Tipo de icono' }), createCollectionIconPicker(selectedIcon, (icon) => { selectedIcon = icon; }, 'folder'));
  body.appendChild(iconGroup);

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', {
    class: 'btn primary',
    text: editing ? 'Guardar' : 'Crear',
    onclick: () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.classList.add('invalid');
        nameError.classList.add('visible');
        return;
      }
      if (editing) updateQuickGroup(editing.id, { name, color: selectedColor, icon: selectedIcon });
      else createQuickGroup(name, [], selectedColor, selectedIcon);
      closeModal();
    }
  }));

  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => nameInput.focus(), 50);
}

function getWorkspace(id) {
  return state.data.workspaces.find((workspace) => workspace.id === id);
}

function openWorkspaceForm(workspaceId) {
  const editing = workspaceId ? getWorkspace(workspaceId) : null;
  const modal = el('div', { class: 'modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: editing ? 'Editar espacio' : 'Nuevo espacio de trabajo' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  const nameInput = el('input', { class: 'form-input', type: 'text', placeholder: 'Ej.: Trabajo diario', value: editing ? editing.name : '' });
  body.append(el('label', { class: 'form-label', text: 'Nombre' }), nameInput);

  let selectedColor = editing?.color || APP.categoryColors[state.data.workspaces.length % APP.categoryColors.length];
  const colorGroup = el('div', { class: 'form-group' });
  const colorOptions = el('div', { class: 'color-options' });
  colorGroup.append(el('label', { class: 'form-label', text: 'Color' }));
  APP.categoryColors.forEach((color) => {
    const option = el('button', { class: `color-option${selectedColor === color ? ' selected' : ''}`, type: 'button', style: `background:${color}`, title: `Color ${color}` });
    option.addEventListener('click', () => {
      selectedColor = color;
      colorOptions.querySelectorAll('.color-option').forEach((item) => item.classList.toggle('selected', item === option));
    });
    colorOptions.appendChild(option);
  });
  colorGroup.appendChild(colorOptions);
  body.appendChild(colorGroup);

  let selectedIcon = getCollectionIcon(editing?.icon, 'briefcase').id;
  const iconGroup = el('div', { class: 'form-group' });
  iconGroup.append(el('label', { class: 'form-label', text: 'Tipo de icono' }), createCollectionIconPicker(selectedIcon, (icon) => { selectedIcon = icon; }, 'briefcase'));
  body.append(iconGroup, el('label', { class: 'form-label', text: 'Favoritos que abrirá' }));
  const filterInput = el('input', { class: 'form-input', type: 'search', placeholder: 'Buscar por nombre, dominio, etiqueta o ruta…', 'aria-label': 'Buscar favoritos para el espacio' });
  const selected = new Set(editing ? editing.bookmarkIds : []);
  const expanded = new Set();
  const selectionInfo = el('span', { class: 'workspace-picker-info' });
  const tree = el('div', { class: 'workspace-picker-tree', role: 'tree', 'aria-label': 'Favoritos organizados por categorías' });
  const matches = (bookmark, query) => {
    if (!query) return true;
    const categoryPath = getCategoryPath(bookmark.categoryId).map((item) => item.name).join(' ');
    return normalizeSearchText([bookmark.name, bookmark.url, getDomain(bookmark.url), ...(bookmark.tags || []), categoryPath].join(' ')).includes(query);
  };
  const categoryHasMatches = (categoryId, query) => {
    if (!query) return true;
    if (state.data.bookmarks.some((bookmark) => bookmark.categoryId === categoryId && matches(bookmark, query))) return true;
    return getChildren(categoryId).some((child) => categoryHasMatches(child.id, query));
  };
  const renderPicker = () => {
    const query = normalizeSearchText(filterInput.value);
    tree.textContent = '';
    selectionInfo.textContent = `${selected.size} seleccionados`;
    const makeBookmark = (bookmark, depth) => {
      const label = el('label', { class: 'workspace-bookmark', style: `padding-left:${28 + depth * 18}px` });
      const input = el('input', { type: 'checkbox' });
      input.checked = selected.has(bookmark.id);
      input.addEventListener('change', () => {
        if (input.checked) selected.add(bookmark.id);
        else selected.delete(bookmark.id);
        selectionInfo.textContent = `${selected.size} seleccionados`;
      });
      const meta = bookmark.tags && bookmark.tags.length ? ` · #${bookmark.tags.slice(0, 2).join(' #')}` : '';
      label.append(input, el('span', { class: 'workspace-bookmark-name', text: bookmark.name }), el('span', { class: 'workspace-bookmark-domain', text: `${getDomain(bookmark.url)}${meta}` }));
      return label;
    };
    const makeCategory = (category, depth) => {
      if (!categoryHasMatches(category.id, query)) return null;
      const children = getChildren(category.id).filter((child) => categoryHasMatches(child.id, query));
      const direct = state.data.bookmarks.filter((bookmark) => bookmark.categoryId === category.id && matches(bookmark, query)).sort((a, b) => a.name.localeCompare(b.name, 'es'));
      const hasContent = children.length || direct.length;
      if (!hasContent) return null;
      const open = query ? true : expanded.has(category.id);
      const wrap = el('div', { class: 'workspace-category-node', role: 'treeitem', 'aria-expanded': String(open) });
      const head = el('button', { class: 'workspace-category-head', type: 'button', style: `padding-left:${8 + depth * 18}px`, 'aria-label': `${open ? 'Contraer' : 'Desplegar'} ${category.name}` });
      head.append(el('span', { class: 'workspace-category-chevron' + (open ? ' open' : ''), html: ICONS.chevronRight }), el('span', { class: 'category-item-dot', style: `background:${getCategoryColor(category)}` }), el('span', { class: 'workspace-category-name', text: category.name }), el('span', { class: 'category-item-count', text: String(getDirectCount(category.id)) }));
      head.addEventListener('click', () => {
        if (expanded.has(category.id)) expanded.delete(category.id);
        else expanded.add(category.id);
        renderPicker();
      });
      wrap.appendChild(head);
      if (open) {
        const content = el('div', { class: 'workspace-category-content', role: 'group' });
        direct.forEach((bookmark) => content.appendChild(makeBookmark(bookmark, depth)));
        children.forEach((child) => {
          const node = makeCategory(child, depth + 1);
          if (node) content.appendChild(node);
        });
        wrap.appendChild(content);
      }
      return wrap;
    };
    const uncategorized = state.data.bookmarks.filter((bookmark) => !bookmark.categoryId && matches(bookmark, query)).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (uncategorized.length) {
      const loose = el('div', { class: 'workspace-loose' });
      loose.append(el('div', { class: 'workspace-loose-title', text: 'Sin categoría' }));
      uncategorized.forEach((bookmark) => loose.appendChild(makeBookmark(bookmark, 0)));
      tree.appendChild(loose);
    }
    getChildren(null).forEach((category) => {
      const node = makeCategory(category, 0);
      if (node) tree.appendChild(node);
    });
    if (!tree.children.length) tree.appendChild(el('p', { class: 'workspace-empty', text: 'No hay favoritos que coincidan con la búsqueda.' }));
  };
  filterInput.addEventListener('input', renderPicker);
  renderPicker();
  body.append(filterInput, selectionInfo, tree);
  const footer = el('div', { class: 'modal-footer' });
  if (editing) footer.append(el('button', { class: 'btn danger', text: 'Eliminar espacio', onclick: () => { closeModal(); confirmDeleteWorkspace(editing.id); } }));
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn primary', text: editing ? 'Guardar' : 'Crear', onclick: () => {
    const name = nameInput.value.trim();
    if (!name) return;
    const bookmarkIds = [...selected];
    if (editing) {
      editing.name = name;
      editing.bookmarkIds = bookmarkIds;
      editing.color = selectedColor;
      editing.icon = selectedIcon;
    } else {
      state.data.workspaces.push({ id: uid(), name, bookmarkIds, color: selectedColor, icon: selectedIcon, createdAt: Date.now(), order: state.data.workspaces.length });
    }
    addActivity(editing ? 'workspace-updated' : 'workspace-created', name);
    saveData();
    renderWorkspaces();
    closeModal();
  } }));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => nameInput.focus(), 30);
}

function deleteWorkspace(id) {
  const workspace = getWorkspace(id);
  if (!workspace) return;
  const trashEntry = addToTrash('workspace', workspace.name, { workspace });
  state.data.workspaces = state.data.workspaces.filter((item) => item.id !== id);
  addActivity('workspace-deleted', workspace.name);
  saveData();
  renderWorkspaces();
  notifyTrashEntry(trashEntry);
}

function confirmDeleteWorkspace(id) {
  const workspace = getWorkspace(id);
  if (!workspace) return;
  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Eliminar espacio de trabajo' }));
  const body = el('div', { class: 'modal-body', text: `Se eliminará “${workspace.name}”. Los favoritos originales no se borrarán.` });
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn danger', text: 'Eliminar espacio', onclick: () => { deleteWorkspace(id); closeModal(); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function openWorkspace(workspaceId) {
  const workspace = getWorkspace(workspaceId);
  if (!workspace) return;
  const bookmarks = workspace.bookmarkIds.map((id) => getBookmark(id)).filter(Boolean);
  if (!bookmarks.length) return toast('Este espacio no tiene favoritos todavía', 'info');
  const launch = async () => {
    const api = getBrowserExtensionApi();
    let openedByExtension = false;
    if (api && api.runtime && api.runtime.sendMessage) {
      try {
        await api.runtime.sendMessage({ type: 'dashboard-open-tabs', urls: bookmarks.map((bookmark) => bookmark.url) });
        openedByExtension = true;
      } catch {}
    }
    if (!openedByExtension) {
      bookmarks.forEach((bookmark) => {
        const link = document.createElement('a');
        link.href = bookmark.url;
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    }
    bookmarks.forEach((bookmark) => {
      bookmark.useCount += 1;
      bookmark.lastAccess = Date.now();
    });
    addActivity('workspace-opened', workspace.name);
    saveData();
    toast(openedByExtension ? `Abiertas ${bookmarks.length} pestañas: ${workspace.name}` : `Abriendo ${bookmarks.length} pestañas: ${workspace.name}`, 'success');
  };
  if (bookmarks.length <= 5) return launch();
  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  modal.append(el('div', { class: 'modal-header', html: '<h2 class="modal-title">Abrir espacio</h2>' }), el('div', { class: 'modal-body', text: `Se abrirán ${bookmarks.length} pestañas. ¿Continuar?` }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn primary', text: 'Abrir pestañas', onclick: () => { closeModal(); launch(); } }));
  modal.appendChild(footer);
  openModal(modal);
}

function compareHomeItems(a, b, mode) {
  if (mode === 'name-asc' || mode === 'name-desc') {
    const result = String(a.name || '').localeCompare(String(b.name || ''), getLocale(), { sensitivity: 'base', numeric: true });
    return mode === 'name-desc' ? -result : result;
  }
  if (mode === 'recent-desc' || mode === 'recent-asc') {
    const result = (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
    return mode === 'recent-asc' ? -result : result;
  }
  return (Number(a.order) || 0) - (Number(b.order) || 0);
}

function sortedWorkspaces() {
  const mode = state.data.settings.workspaceSortMode || 'custom';
  return state.data.workspaces.slice().sort((a, b) => compareHomeItems(a, b, mode));
}

function clearWorkspaceDropState() {
  els.workspaceArea?.querySelectorAll('.dragging, .drop-before, .drop-after').forEach((item) => item.classList.remove('dragging', 'drop-before', 'drop-after'));
}

function reorderWorkspace(fromId, targetId, after) {
  if (!fromId || !targetId || fromId === targetId) return;
  const ordered = state.data.workspaces.slice().sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const fromIndex = ordered.findIndex((item) => item.id === fromId);
  if (fromIndex < 0) return;
  const [moved] = ordered.splice(fromIndex, 1);
  let targetIndex = ordered.findIndex((item) => item.id === targetId);
  if (targetIndex < 0) return;
  if (after) targetIndex++;
  ordered.splice(targetIndex, 0, moved);
  ordered.forEach((item, index) => { item.order = index; });
  state.data.settings.workspaceSortMode = 'custom';
  saveData();
  renderWorkspaces();
}

function enableWorkspaceOrdering(card, workspace) {
  if ((state.data.settings.workspaceSortMode || 'custom') !== 'custom') return;
  card.draggable = true;
  card.classList.add('order-draggable');
  card.addEventListener('dragstart', (event) => {
    state.draggingWorkspaceId = workspace.id;
    card.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    try { event.dataTransfer.setData('text/plain', workspace.id); } catch {}
  });
  card.addEventListener('dragover', (event) => {
    if (!state.draggingWorkspaceId || state.draggingWorkspaceId === workspace.id) return;
    event.preventDefault();
    clearWorkspaceDropState();
    const rect = card.getBoundingClientRect();
    card.classList.add(event.clientX >= rect.left + rect.width / 2 ? 'drop-after' : 'drop-before');
  });
  card.addEventListener('dragleave', () => card.classList.remove('drop-before', 'drop-after'));
  card.addEventListener('drop', (event) => {
    if (!state.draggingWorkspaceId) return;
    event.preventDefault();
    const rect = card.getBoundingClientRect();
    const after = event.clientX >= rect.left + rect.width / 2;
    const fromId = state.draggingWorkspaceId;
    clearWorkspaceDropState();
    state.draggingWorkspaceId = null;
    reorderWorkspace(fromId, workspace.id, after);
  });
  card.addEventListener('dragend', () => {
    state.draggingWorkspaceId = null;
    clearWorkspaceDropState();
  });
}

function renderWorkspaces() {
  const area = els.workspaceArea;
  area.textContent = '';
  const workspaceMode = state.data.settings.workspaceSortMode || 'custom';
  if (els.workspaceSortMode) els.workspaceSortMode.value = workspaceMode;
  area.classList.toggle('custom-order', workspaceMode === 'custom');
  const workspaces = sortedWorkspaces();
  if (!workspaces.length) {
    area.appendChild(el('p', { class: 'workspace-empty', text: 'Agrupa enlaces para abrir tus contextos de trabajo en un clic.' }));
    return;
  }
  workspaces.forEach((workspace) => {
    const card = el('div', { class: 'workspace-card', style: `--workspace-color:${workspace.color}` });
    const open = el('button', { class: 'workspace-open', 'aria-label': `Abrir espacio ${workspace.name}` });
    open.append(el('span', { class: 'workspace-icon', html: getCollectionIcon(workspace.icon, 'briefcase').icon }), el('span', { class: 'workspace-name', text: workspace.name }), el('span', { class: 'workspace-count', text: `${workspace.bookmarkIds.length} enlaces` }));
    open.addEventListener('click', () => openWorkspace(workspace.id));
    const edit = el('button', { class: 'icon-btn small', 'aria-label': `Editar ${workspace.name}`, title: 'Editar espacio', html: ICONS.edit, onclick: () => openWorkspaceForm(workspace.id) });
    card.append(open, edit);
    enableWorkspaceOrdering(card, workspace);
    area.appendChild(card);
  });
}

function renderQuickAccess() {
  const pinned = state.data.bookmarks.filter((b) => b.pinned);
  const mode = state.quickViewMode;
  const sortMode = state.data.settings.quickSortMode || 'custom';
  if (els.quickSortMode) els.quickSortMode.value = sortMode;

  els.quickViewMode.querySelectorAll('.segmented-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });

  const area = els.quickArea;
  area.textContent = '';
  area.className = 'quick-area';
  area.classList.toggle('custom-order', sortMode === 'custom');

  if (pinned.length === 0 && state.data.quickGroups.length === 0) {
    const empty = el('div', { class: 'quick-empty' });
    empty.append(el('p', { class: 'quick-empty-title', text: 'Aún no hay accesos fijados' }));
    empty.append(el('span', { class: 'quick-empty-hint', text: 'Pulsa la estrella en cualquier favorito para fijarlo aquí' }));
    area.appendChild(empty);
    return;
  }

  const { loose, groups, byGroup, entries } = getQuickSections(pinned);

  if (mode === 'list') {
    area.classList.add('quick-list-mode');
    renderQuickList(area, entries, byGroup);
  } else if (mode === 'cards') {
    renderQuickCards(area, entries, byGroup);
  } else {
    renderQuickIcons(area, entries, byGroup);
  }
}

function getQuickSections(pinned) {
  const loose = [];
  const byGroup = new Map();
  pinned.forEach((b) => {
    const g = getGroupOfBookmark(b.id);
    if (g) {
      if (!byGroup.has(g.id)) byGroup.set(g.id, []);
      byGroup.get(g.id).push(b);
    } else {
      loose.push(b);
    }
  });
  const groups = state.data.quickGroups.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  groups.forEach((g) => {
    if (!byGroup.has(g.id)) byGroup.set(g.id, []);
  });
  return { loose, groups, byGroup, entries: orderQuickEntries(loose, groups) };
}

function setQuickDrag(item, bookmark) {
  if (!state.editMode && !(state.currentView === 'home' && state.quickViewMode === 'icon')) return;
  item.draggable = 'true';
  item.addEventListener('dragstart', (e) => {
    state.draggingId = bookmark.id;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', bookmark.id); } catch {}
  });
  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    els.quickArea.querySelectorAll('.drag-over').forEach((n) => n.classList.remove('drag-over'));
    state.draggingId = null;
  });
}

function setQuickDropTarget(item, bookmark) {
  item.addEventListener('dragover', (e) => {
    if ((!state.editMode && !(state.currentView === 'home' && state.quickViewMode === 'icon')) || !state.draggingId || state.draggingId === bookmark.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    item.classList.add('drag-over');
  });
  item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
  item.addEventListener('drop', (e) => {
    e.preventDefault();
    item.classList.remove('drag-over');
    const fromId = e.dataTransfer.getData('text/plain') || state.draggingId;
    if (!fromId || fromId === bookmark.id) return;
    const fromBm = getBookmark(fromId);
    if (!fromBm) return;
    const targetGroup = getGroupOfBookmark(bookmark.id);
    if (targetGroup) {
      assignToQuickGroup(targetGroup.id, fromId);
      return;
    }
    const sourceGroup = getGroupOfBookmark(fromId);
    if (sourceGroup) {
      removeFromQuickGroup(sourceGroup.id, fromId);
      createQuickGroup(null, [fromId, bookmark.id]);
      return;
    }
    createQuickGroup(null, [fromId, bookmark.id]);
  });
}

function makeGroupDropTarget(group) {
  const wrap = el('div', { class: 'drop-target' });
  wrap.addEventListener('dragover', (e) => {
    if (!state.draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    wrap.classList.add('drag-over');
  });
  wrap.addEventListener('dragleave', () => wrap.classList.remove('drag-over'));
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    wrap.classList.remove('drag-over');
    const fromId = e.dataTransfer.getData('text/plain') || state.draggingId;
    if (fromId) assignToQuickGroup(group.id, fromId);
  });
  return wrap;
}

function quickIconItem(bookmark, entry = null) {
  // Inicio y Fijados comparten exactamente el mismo icono y comportamiento.
  const item = renderIconItem(bookmark);
  item.classList.add('quick-icon-item');
  if (entry) enableQuickTopLevelOrdering(item, entry);
  else {
    setQuickDrag(item, bookmark);
    setQuickDropTarget(item, bookmark);
  }
  return item;
}

function renderQuickIcons(area, entries, byGroup) {
  const grid = el('div', { class: 'quick-grid quick-icons-grid' });
  const bodies = [];
  entries.forEach((entry) => {
    if (entry.type === 'bookmark') {
      grid.appendChild(quickIconItem(entry.item, entry));
      return;
    }
    const { folder, body } = renderQuickGroupFolder(entry.item, byGroup.get(entry.id), entry);
    grid.appendChild(folder);
    if (body) bodies.push(body);
  });

  area.appendChild(grid);
  bodies.forEach((b) => area.appendChild(b));
}

function renderQuickGroupFolder(group, members, entry) {
  const wrap = el('div', { class: 'drop-target quick-group' });
  wrap.style.setProperty('--group-color', group.color || '');

  const expanded = expandedQuickGroups.has(group.id);
  const btn = el('button', {
    class: 'quick-group-btn',
    'aria-expanded': expanded ? 'true' : 'false',
    'aria-label': `Abrir grupo ${group.name}`,
    title: group.name
  });

  const stack = el('span', { class: 'quick-group-stack', 'aria-hidden': 'true' });
  const groupIcon = getCollectionIcon(group.icon, 'folder');
  stack.classList.toggle('folder-like', groupIcon.id === 'folder');
  stack.appendChild(el('span', { class: 'quick-group-symbol', html: groupIcon.icon }));
  btn.append(stack, el('span', { class: 'quick-group-count', text: String(members.length) }), el('span', { class: 'quick-group-name', text: group.name }));
  btn.addEventListener('click', () => toggleQuickGroup(group.id));
  wrap.appendChild(btn);
  enableQuickTopLevelOrdering(wrap, entry, group.id);

  if (state.editMode) {
    const actions = el('div', { class: 'quick-group-actions' });
    actions.append(
      el('button', { class: 'icon-btn small', 'aria-label': `Renombrar grupo ${group.name}`, title: 'Renombrar grupo', html: ICONS.edit, onclick: (e) => { e.stopPropagation(); openQuickGroupForm(group.id); } }),
      el('button', { class: 'icon-btn small danger', 'aria-label': `Disolver grupo ${group.name}`, title: 'Disolver grupo', html: ICONS.trash, onclick: (e) => { e.stopPropagation(); confirmDeleteQuickGroup(group.id); } })
    );
    wrap.appendChild(actions);
  }

  let body = null;
  if (expanded) {
    body = el('div', { class: 'quick-group-body' });
    body.style.setProperty('--group-color', group.color || '');
    const bodyGrid = el('div', { class: 'quick-grid quick-icons-grid' });
    members.forEach((b) => {
      if (state.editMode) {
        const holder = el('div', { class: 'quick-member' });
        holder.appendChild(quickIconItem(b));
        holder.appendChild(el('button', {
          class: 'icon-btn small danger quick-member-remove', 'aria-label': `Quitar ${b.name} del grupo`, title: 'Quitar del grupo',
          html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
          onclick: (e) => { e.stopPropagation(); removeFromQuickGroup(group.id, b.id); }
        }));
        bodyGrid.appendChild(holder);
      } else {
        bodyGrid.appendChild(quickIconItem(b));
      }
    });
    body.appendChild(bodyGrid);
  }

  return { folder: wrap, body };
}

function quickRowItem(bookmark, entry = null) {
  const row = el('div', {
    class: 'bookmark-row quick-row',
    role: 'listitem',
    tabindex: '0',
    'aria-label': `${bookmark.name}, ${getDomain(bookmark.url)}`
  });
  row.dataset.id = bookmark.id;

  const favicon = el('span', { class: 'panel-link-favicon large', html: renderFavicon(bookmark) });
  const body = el('div', { class: 'bookmark-row-body' });
  body.append(el('span', { class: 'bookmark-row-name', html: highlightSearch(bookmark.name) }));
  body.append(el('span', { class: 'bookmark-row-domain', html: highlightSearch(getDomain(bookmark.url)) }));
  if (bookmark.description) body.append(el('span', { class: 'bookmark-row-desc', html: highlightSearch(bookmark.description) }));

  const actions = el('div', { class: 'bookmark-row-actions' });
  actions.append(
    el('button', {
      class: 'icon-btn' + (bookmark.pinned ? ' pinned-star' : ''), 'aria-label': bookmark.pinned ? 'Desfijar' : 'Fijar', title: 'Fijar/Desfijar',
      html: bookmark.pinned ? ICONS.star : ICONS.starOutline,
      onclick: (e) => { e.stopPropagation(); togglePin(bookmark.id); }
    }),
    el('button', {
      class: 'icon-btn', 'aria-label': 'Más opciones', title: 'Opciones', html: ICONS.more,
      onclick: (e) => { e.stopPropagation(); openCardMenu(bookmark.id); }
    })
  );

  const auditBadge = bookmarkAuditStatusBadge(bookmark);
  if (auditBadge) row.append(favicon, body, auditBadge, actions);
  else row.append(favicon, body, actions);
  row.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    openBookmark(bookmark.id);
  });
  row.addEventListener('keydown', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookmark(bookmark.id);
    }
  });
  if (entry) enableQuickTopLevelOrdering(row, entry);
  else {
    setQuickDrag(row, bookmark);
    setQuickDropTarget(row, bookmark);
  }
  return row;
}

function renderQuickList(area, entries, byGroup) {
  const list = el('div', { class: 'quick-list' });
  entries.forEach((entry) => {
    if (entry.type === 'bookmark') {
      list.appendChild(quickRowItem(entry.item, entry));
      return;
    }
    const g = entry.item;
    const members = byGroup.get(g.id);
    const expanded = expandedQuickGroups.has(g.id);
    const section = el('div', { class: 'quick-list-group' });
    section.style.setProperty('--group-color', g.color || '');

    const head = el('div', { class: 'quick-list-group-head' });
    const toggleBtn = el('button', { class: 'quick-list-group-header' + (expanded ? ' expanded' : ''), 'aria-expanded': expanded ? 'true' : 'false' });
    toggleBtn.append(
      el('span', { class: 'quick-chev', html: ICONS.chevronRight }),
      el('span', { class: 'quick-group-dot' }),
      el('span', { class: 'quick-list-group-name', text: g.name }),
      el('span', { class: 'quick-list-group-count', text: String(members.length) })
    );
    toggleBtn.addEventListener('click', () => toggleQuickGroup(g.id));
    head.appendChild(toggleBtn);

    if (state.editMode) {
      const actions = el('div', { class: 'quick-list-group-actions' });
      actions.append(
        el('button', { class: 'icon-btn small', 'aria-label': `Renombrar grupo ${g.name}`, title: 'Renombrar grupo', html: ICONS.edit, onclick: () => openQuickGroupForm(g.id) }),
        el('button', { class: 'icon-btn small danger', 'aria-label': `Disolver grupo ${g.name}`, title: 'Disolver grupo', html: ICONS.trash, onclick: () => confirmDeleteQuickGroup(g.id) })
      );
      head.appendChild(actions);
    }
    section.appendChild(head);

    enableQuickTopLevelOrdering(section, entry, g.id);

    if (expanded) {
      const items = el('div', { class: 'quick-list-items' });
      members.forEach((b) => items.appendChild(quickRowItem(b)));
      section.appendChild(items);
    }
    list.appendChild(section);
  });

  area.appendChild(list);
}

function renderQuickCards(area, entries, byGroup) {
  let looseGrid = null;
  const ensureLooseGrid = () => {
    if (!looseGrid) {
      looseGrid = el('div', { class: 'quick-cards-grid' });
      area.appendChild(looseGrid);
    }
    return looseGrid;
  };
  entries.forEach((entry) => {
    if (entry.type === 'bookmark') {
      const card = renderCard(entry.item, { categoryColor: false });
      enableQuickTopLevelOrdering(card, entry);
      ensureLooseGrid().appendChild(card);
      return;
    }
    looseGrid = null;
    const g = entry.item;
    const members = byGroup.get(g.id);
    const section = el('div', { class: 'quick-cards-group' });
    section.style.setProperty('--group-color', g.color || '');
    const header = el('div', { class: 'quick-cards-group-header' });
    header.append(el('span', { class: 'quick-group-dot' }), el('span', { class: 'quick-cards-group-name', text: g.name }), el('span', { class: 'quick-cards-group-count', text: String(members.length) }));

    if (state.editMode) {
      header.append(
        el('button', { class: 'icon-btn small', 'aria-label': `Renombrar grupo ${g.name}`, title: 'Renombrar grupo', html: ICONS.edit, onclick: () => openQuickGroupForm(g.id) }),
        el('button', { class: 'icon-btn small danger', 'aria-label': `Disolver grupo ${g.name}`, title: 'Disolver grupo', html: ICONS.trash, onclick: () => confirmDeleteQuickGroup(g.id) })
      );
    }

    const grid = el('div', { class: 'quick-cards-grid' });
    members.forEach((b) => grid.appendChild(renderCard(b, { categoryColor: false })));
    section.append(header, grid);
    enableQuickTopLevelOrdering(section, entry, g.id);
    area.appendChild(section);
  });
}

function renderFavicon(bookmark, size) {
  const favicon = getFaviconSources(bookmark, size || 128);
  const color = bookmark.color || APP.categoryColors[0];

  if (favicon.primary) {
    const fallbackAttr = favicon.fallback ? ` data-favicon-fallback="${escapeAttr(favicon.fallback)}"` : '';
    return `<img class="favicon-image" src="${escapeAttr(favicon.primary)}"${fallbackAttr} alt="" loading="lazy" decoding="async"><span class="favicon-fallback" style="background:${escapeAttr(color)};display:none;width:100%;height:100%;align-items:center;justify-content:center;font-weight:700">${escapeAttr(initials(bookmark.name))}</span>`;
  }

  return `<span class="favicon-fallback" style="background:${escapeAttr(color)};width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:700">${escapeAttr(initials(bookmark.name))}</span>`;
}

function renderBreadcrumb() {
  const bc = els.breadcrumb;
  bc.textContent = '';
  if (!(state.currentView === 'category' && state.activeCategoryId)) {
    bc.classList.add('hidden');
    return;
  }
  bc.classList.remove('hidden');

  const path = getCategoryPath(state.activeCategoryId);
  path.forEach((cat, i) => {
    const isLast = i === path.length - 1;
    const seg = el('button', {
      class: 'crumb' + (isLast ? ' current' : ''),
      text: cat.name,
      'aria-current': isLast ? 'page' : null,
      disabled: isLast ? 'true' : null
    });
    if (!isLast) seg.addEventListener('click', () => selectCategory(cat.id));
    bc.appendChild(seg);
    if (!isLast) {
      bc.appendChild(el('span', { class: 'crumb-sep', html: ICONS.chevronRight, 'aria-hidden': 'true' }));
    }
  });
}

function renderSubcats() {
  const container = els.subcats;
  container.textContent = '';
  if (!(state.currentView === 'category' && state.activeCategoryId)) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');

  const parentId = state.activeCategoryId;
  const children = getChildren(parentId);

  const header = el('div', { class: 'subcats-header' });
  header.append(el('h3', { class: 'subcats-title', text: 'Subcategorías' }));
  header.append(el('button', {
    class: 'icon-btn small',
    'aria-label': 'Nueva subcategoría',
    title: 'Nueva subcategoría',
    html: ICONS.plus,
    onclick: () => openCategoryForm(null, parentId)
  }));

  const chips = el('div', { class: 'subcats-row' });
  children.forEach((child) => {
    const count = getDirectCount(child.id);
    const chip = el('button', {
      class: 'subcat-chip',
      'aria-label': `Abrir ${child.name}`,
      style: categoryColorStyle(child)
    });
    chip.append(
      el('span', { class: 'subcat-chip-icon', html: ICONS.folder }),
      el('span', { class: 'subcat-chip-name', text: child.name }),
      el('span', { class: 'subcat-chip-count', text: String(count) })
    );
    chip.addEventListener('click', () => selectCategory(child.id));
    chips.appendChild(chip);
  });

  container.append(header, chips);
}

function matchesBookmarkAuditFilter(bookmark, mode) {
  if (!mode) return true;
  if (mode === 'not_audited') return !bookmark.auditStatus;
  if (mode === 'deletable') return ['missing','youtube_missing'].includes(bookmark.auditStatus);
  if (mode === 'inconclusive') return !!bookmark.auditStatus && !['available','missing','youtube_missing'].includes(bookmark.auditStatus);
  return bookmark.auditStatus === mode;
}

function renderBookmarkAuditFilter() {
  if (!els.sortMode) return;
  let select = document.getElementById('bookmarkAuditFilter');
  if (!select) {
    const group = el('div', {class:'bookmark-sort-filter-group'});
    els.sortMode.parentNode.insertBefore(group, els.sortMode);
    group.appendChild(els.sortMode);
    select = el('select', {id:'bookmarkAuditFilter',class:'form-select','aria-label':'Filtrar por estado de auditoría'});
    [['','Todos los estados de auditoría'],['not_audited','Sin auditar'],['deletable','404 o inexistentes'],['inconclusive','Todos los no concluyentes'],...Object.entries(BOOKMARK_AUDIT_LABELS)].forEach(([value,text])=>select.appendChild(el('option',{value,text})));
    select.addEventListener('change',()=>{state.auditStatusFilter=select.value||null;renderCurrentView();});
    group.appendChild(select);
  }
  select.value=state.auditStatusFilter||'';
}

function renderCategoryView() {
  renderBookmarkAuditFilter();
  let title = 'Resultados';
  const searching = state.searchQuery.trim().length > 0 || !!state.auditStatusFilter;
  if (state.auditStatusFilter) {
    title = `Estado auditado: ${BOOKMARK_AUDIT_LABELS[state.auditStatusFilter] || state.auditStatusFilter}`;
  } else if (state.currentView === 'category' && state.activeCategoryId) {
    const cat = getCategory(state.activeCategoryId);
    title = cat ? cat.name : 'Categoría';
  } else if (state.currentView === 'all') title = 'Todos los favoritos';
  else if (state.currentView === 'pinned') title = 'Fijados';
  else if (state.currentView === 'later') title = 'Para después';
  else if (state.currentView === 'recent') title = 'Recientes';
  else if (state.currentView === 'frequent') title = 'Más usados';
  else if (searching) title = 'Resultados de búsqueda';

  els.viewTitle.textContent = title;
  if (els.sortMode && els.sortMode.value !== state.sortMode) els.sortMode.value = state.sortMode;

  const bookmarks = getVisibleBookmarks();
  els.resultsCount.textContent = String(bookmarks.length);

  renderBreadcrumb();
  renderSubcats();

  const hasResults = bookmarks.length > 0;
  els.emptyState.classList.toggle('hidden', hasResults);

  if (!hasResults) updateEmptyState(searching);

  els.bookmarksGrid.className =
    'bookmarks-grid ' +
    (state.viewMode === 'list' ? 'list' : state.viewMode === 'icon' ? 'icons' : '');
  els.bookmarksGrid.textContent = '';
  els.bookmarksGrid.classList.toggle('hidden', !hasResults);

  if (hasResults) {
    bookmarks.forEach((bookmark) => {
      if (state.viewMode === 'list') els.bookmarksGrid.appendChild(renderRow(bookmark));
      else if (state.viewMode === 'icon') els.bookmarksGrid.appendChild(renderIconItem(bookmark));
      else els.bookmarksGrid.appendChild(renderCard(bookmark));
    });
    if (state.viewMode === 'grid') enableDragDrop();
  }
}

function updateEmptyState(searching) {
  if (searching) {
    els.emptyTitle.textContent = 'Sin resultados';
    els.emptyText.textContent = state.auditStatusFilter
      ? `No hay favoritos con el estado “${BOOKMARK_AUDIT_LABELS[state.auditStatusFilter] || state.auditStatusFilter}”`
      : `No se encontraron favoritos con “${state.searchQuery.trim()}”`;
    els.emptyAddBtn.classList.add('hidden');
    els.clearSearchBtn.classList.remove('hidden');
  } else {
    els.emptyTitle.textContent = 'No hay favoritos';
    els.emptyText.textContent = 'Añade tu primer favorito para empezar';
    els.emptyAddBtn.classList.remove('hidden');
    els.clearSearchBtn.classList.add('hidden');
  }
}

function getBookmarkCategory(bookmark) {
  return bookmark.categoryId ? getCategory(bookmark.categoryId) : null;
}

function filterBookmarksByCategory(categoryId) {
  state.searchQuery = '';
  state.auditStatusFilter = null;
  if (els.searchInput) els.searchInput.value = '';
  selectCategory(categoryId);
}

function filterBookmarksByAuditStatus(status) {
  if (!BOOKMARK_AUDIT_LABELS[status]) return;
  state.searchQuery = '';
  state.auditStatusFilter = status;
  state.currentView = 'all';
  state.activeCategoryId = null;
  if (els.searchInput) els.searchInput.value = '';
  els.sidebar.querySelectorAll('.sidebar-item').forEach((item) => item.classList.toggle('active', item.dataset.view === 'all'));
  renderSidebar();
  renderCurrentView();
}

function bookmarkCategoryBadge(bookmark, useCategoryColor = true) {
  const category = getBookmarkCategory(bookmark);
  return el('button', {
    type: 'button',
    class: 'bookmark-category clickable-tag' + (useCategoryColor && category ? ' category-colored' : ''),
    style: useCategoryColor && category ? categoryColorStyle(category) : '',
    html: highlightSearch(category ? category.name : 'Sin categoría'),
    title: category ? `Mostrar favoritos de ${category.name}` : 'Mostrar favoritos sin categoría',
    'aria-label': category ? `Mostrar favoritos de la categoría ${category.name}` : 'Mostrar favoritos sin categoría',
    disabled: !category,
    onclick: (event) => {
      event.stopPropagation();
      if (category) filterBookmarksByCategory(category.id);
    }
  });
}

const BOOKMARK_AUDIT_MARKS = {
  available: '✅',
  missing: '404',
  youtube_missing: 'YT×',
  restricted: '🔒',
  server_error: '🚨',
  timeout: '⌛',
  network_error: '📡',
  skipped: '⌂'
};

function bookmarkAuditStatusBadge(bookmark) {
  const status = bookmark.auditStatus;
  if (!BOOKMARK_AUDIT_MARKS[status] || !BOOKMARK_AUDIT_LABELS[status]) return null;
  const checkedAt = Number(bookmark.auditCheckedAt) || 0;
  const checkedText = checkedAt ? ` · ${new Date(checkedAt).toLocaleString(getLocale())}` : '';
  const detail = bookmark.auditDetail ? ` · ${bookmark.auditDetail}` : '';
  const description = `${BOOKMARK_AUDIT_LABELS[status]}${detail}${checkedText}`;
  return el('button', {
    type: 'button',
    class: `bookmark-status-tag ${status}`,
    text: BOOKMARK_AUDIT_MARKS[status],
    title: description,
    'aria-label': `${description}. Mostrar favoritos con este estado`,
    onclick: (event) => {
      event.stopPropagation();
      filterBookmarksByAuditStatus(status);
    }
  });
}

function renderCard(bookmark, options = {}) {
  const useCategoryColor = options.categoryColor !== false;
  const category = getBookmarkCategory(bookmark);
  const card = el('div', {
    class: 'bookmark-card' + (bookmark.pinned ? ' pinned' : '') + (useCategoryColor && category ? ' category-colored' : ''),
    style: useCategoryColor && category ? categoryColorStyle(category) : '',
    role: 'listitem',
    draggable: state.editMode ? 'true' : 'false',
    tabindex: '0',
    'aria-label': `${bookmark.name}, ${getDomain(bookmark.url)}`
  });
  card.dataset.id = bookmark.id;

  if (state.editMode) {
    card.appendChild(el('span', { class: 'edit-badge', text: '✎', 'aria-hidden': 'true' }));
  }

  const top = el('div', { class: 'bookmark-top' });
  const favicon = el('span', { class: 'bookmark-favicon', html: renderFavicon(bookmark) });

  const actions = el('div', { class: 'bookmark-actions' });
  actions.append(
    el('button', {
      class: 'icon-btn' + (bookmark.pinned ? ' pinned-star' : ''), 'aria-label': bookmark.pinned ? 'Desfijar' : 'Fijar', title: 'Fijar/Desfijar',
      html: bookmark.pinned ? ICONS.star : ICONS.starOutline,
      onclick: (e) => { e.stopPropagation(); togglePin(bookmark.id); }
    }),
    el('button', {
      class: 'icon-btn', 'aria-label': 'Más opciones', title: 'Opciones', html: ICONS.more,
      onclick: (e) => { e.stopPropagation(); openCardMenu(bookmark.id); }
    })
  );
  top.append(favicon, actions);

  const body = el('div', { class: 'bookmark-body' });
  body.append(el('div', { class: 'bookmark-name', html: highlightSearch(bookmark.name) }));
  body.append(el('div', { class: 'bookmark-domain', html: highlightSearch(getDomain(bookmark.url)) }));
  if (bookmark.description) body.append(el('div', { class: 'bookmark-desc', html: highlightSearch(bookmark.description) }));
  if (bookmark.tags && bookmark.tags.length) {
    body.append(el('div', { class: 'bookmark-tags', text: bookmark.tags.slice(0, 3).map((tag) => '#' + tag).join(' · ') }));
  }

  const footer = el('div', { class: 'bookmark-footer' });
  const footerMeta = el('div', { class: 'bookmark-footer-meta' });
  footerMeta.append(bookmarkCategoryBadge(bookmark, useCategoryColor));
  const auditBadge = bookmarkAuditStatusBadge(bookmark);
  if (auditBadge) footerMeta.appendChild(auditBadge);
  if (bookmark.status === 'later') footerMeta.append(el('span', { class: 'bookmark-later', text: 'Pendiente' }));
  footer.appendChild(footerMeta);
  footer.appendChild(el('span', { class: 'bookmark-open', html: `Abrir ${ICONS.open}` }));

  card.append(top, body, footer);

  card.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    openBookmark(bookmark.id);
  });
  card.addEventListener('keydown', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookmark(bookmark.id);
    }
  });

  return card;
}

function renderRow(bookmark) {
  const category = getBookmarkCategory(bookmark);
  const row = el('div', {
    class: 'bookmark-row' + (bookmark.pinned ? ' pinned' : '') + (category ? ' category-colored' : ''),
    style: category ? categoryColorStyle(category) : '',
    role: 'listitem',
    draggable: state.editMode ? 'true' : 'false',
    tabindex: '0',
    'aria-label': `${bookmark.name}, ${getDomain(bookmark.url)}`
  });
  row.dataset.id = bookmark.id;

  const favicon = el('span', { class: 'panel-link-favicon large', html: renderFavicon(bookmark) });
  const body = el('div', { class: 'bookmark-row-body' });
  body.append(el('span', { class: 'bookmark-row-name', html: highlightSearch(bookmark.name) }));
  body.append(el('span', { class: 'bookmark-row-domain', html: highlightSearch(getDomain(bookmark.url)) }));
  if (bookmark.description) body.append(el('span', { class: 'bookmark-row-desc', html: highlightSearch(bookmark.description) }));

  const meta = el('div', { class: 'bookmark-row-meta' });
  meta.append(bookmarkCategoryBadge(bookmark));
  const auditBadge = bookmarkAuditStatusBadge(bookmark);
  if (auditBadge) meta.appendChild(auditBadge);

  const actions = el('div', { class: 'bookmark-row-actions' });
  actions.append(
    el('button', {
      class: 'icon-btn' + (bookmark.pinned ? ' pinned-star' : ''), 'aria-label': bookmark.pinned ? 'Desfijar' : 'Fijar', title: 'Fijar/Desfijar',
      html: bookmark.pinned ? ICONS.star : ICONS.starOutline,
      onclick: (e) => { e.stopPropagation(); togglePin(bookmark.id); }
    }),
    el('button', {
      class: 'icon-btn', 'aria-label': 'Más opciones', title: 'Opciones', html: ICONS.more,
      onclick: (e) => { e.stopPropagation(); openCardMenu(bookmark.id); }
    })
  );

  row.append(favicon, body, meta, actions);

  row.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    openBookmark(bookmark.id);
  });
  row.addEventListener('keydown', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookmark(bookmark.id);
    }
  });

  return row;
}

function renderIconItem(bookmark) {
  const item = el('button', {
    class: 'icon-item' + (bookmark.pinned ? ' pinned' : ''),
    role: 'listitem',
    tabindex: '0',
    'aria-label': `${bookmark.name}, ${getDomain(bookmark.url)}`
  });
  item.dataset.id = bookmark.id;
  item.dataset.tipName = bookmark.name;
  item.dataset.tipUrl = bookmark.url;
  item.insertAdjacentHTML('beforeend', `<span class="icon-item-favicon">${renderFavicon(bookmark)}</span>`);

  item.addEventListener('click', () => openBookmark(bookmark.id));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookmark(bookmark.id);
    }
  });
  return item;
}

/* ---------- Tooltip ---------- */
function showTooltip(name, url, x, y) {
  els.tooltip.textContent = '';
  els.tooltip.appendChild(el('strong', { html: highlightSearch(name) }));
  els.tooltip.appendChild(el('span', { html: highlightSearch(url) }));
  els.tooltip.classList.add('visible');
  positionTooltip(x, y);
}

function positionTooltip(x, y) {
  const r = els.tooltip.getBoundingClientRect();
  let left = x + 14;
  let top = y + 14;
  if (left + r.width > window.innerWidth - 8) left = x - r.width - 10;
  if (top + r.height > window.innerHeight - 8) top = y - r.height - 10;
  els.tooltip.style.left = Math.max(8, left) + 'px';
  els.tooltip.style.top = Math.max(8, top) + 'px';
}

function hideTooltip() {
  els.tooltip.classList.remove('visible');
}

function tooltipIconFromEventTarget(target) {
  return target instanceof Element ? target.closest('.icon-item[data-tip-name]') : null;
}

function showIconTooltip(item, x, y) {
  if (!item?.dataset.tipName) return;
  showTooltip(item.dataset.tipName, item.dataset.tipUrl || '', x, y);
}

function openCardMenu(bookmarkId) {
  const bookmark = getBookmark(bookmarkId);
  if (!bookmark) return;

  const modal = el('div', { class: 'modal menu-modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: bookmark.name }), el('button', {
    class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    onclick: closeModal
  }));

  const body = el('div', { class: 'modal-body' });
  const actions = [
    { label: 'Editar', icon: ICONS.edit, fn: () => { closeModal(); openBookmarkForm(bookmark.id); } },
    { label: 'Duplicar', icon: ICONS.duplicate, fn: () => { closeModal(); duplicateBookmark(bookmarkId); } },
    { label: bookmark.pinned ? 'Desfijar' : 'Fijar', icon: ICONS.starOutline, fn: () => { closeModal(); togglePin(bookmarkId); } },
    { label: 'Añadir a proyecto', icon: ICONS.folder, fn: () => { closeModal(); openAddBookmarkToProject(bookmarkId); } }
  ];

  actions.push({
    label: 'Mover a…', icon: ICONS.move,
    fn: () => {
      closeModal();
      const modal2 = el('div', { class: 'modal' });
      const h2 = el('div', { class: 'modal-header' });
      h2.append(el('h2', { class: 'modal-title', text: 'Mover favorito' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
      const b2 = el('div', { class: 'modal-body' });
      const formGroup = el('div', { class: 'form-group' });
      formGroup.append(el('label', { class: 'form-label', for: 'moveCategory', text: 'Categoría' }));
      const select = el('select', { class: 'form-select', id: 'moveCategory' });
      select.appendChild(categoryOptionsEl(bookmark.categoryId));
      formGroup.appendChild(select);
      b2.appendChild(formGroup);
      const footer = el('div', { class: 'modal-footer' });
      footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn primary', text: 'Mover', onclick: () => { moveBookmark(bookmarkId, select.value); closeModal(); } }));
      modal2.append(h2, b2, footer);
      openModal(modal2);
    }
  });

  actions.push({
    label: 'Eliminar', icon: ICONS.trash, danger: true,
    fn: () => { closeModal(); confirmDeleteBookmark(bookmarkId); }
  });

  actions.forEach((action) => {
    body.appendChild(el('button', {
      class: 'btn ' + (action.danger ? 'danger' : 'secondary'),
      style: 'justify-content:flex-start;width:100%',
      html: action.icon + '<span>' + action.label + '</span>',
      onclick: action.fn
    }));
  });

  modal.append(header, body);
  openModal(modal);
}

function categoryOptionsEl(selectedId) {
  const select = document.createElement('select');
  select.className = 'form-select';

  const roots = getChildren(null);
  const walk = (cats, depth) => {
    cats.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = (depth > 0 ? '— '.repeat(depth) : '') + c.name;
      if (c.id === selectedId) opt.selected = true;
      select.appendChild(opt);
      const kids = getChildren(c.id);
      if (kids.length) walk(kids, depth + 1);
    });
  };
  walk(roots, 0);
  return select;
}

/* ---------- Drag & drop (grid) ---------- */
function enableDragDrop() {
  if (!state.editMode) return;

  const cards = els.bookmarksGrid.querySelectorAll('.bookmark-card');

  cards.forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      state.draggingId = card.dataset.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.dataset.id); } catch {}
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      els.bookmarksGrid.querySelectorAll('.bookmark-card').forEach((c) => c.classList.remove('drag-over'));
      state.draggingId = null;
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const siblings = Array.from(els.bookmarksGrid.querySelectorAll('.bookmark-card'));
      const dragging = state.draggingId ? getBookmark(state.draggingId) : null;

      siblings.forEach((c) => c.classList.remove('drag-over'));

      if (dragging && dragging.categoryId === state.activeCategoryId) {
        const target = siblings.find((c) => c === card);
        if (target) target.classList.add('drag-over');
      }
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData('text/plain') || state.draggingId;
      const toId = card.dataset.id;
      if (!fromId || fromId === toId) return;
      reorderBookmarks(fromId, toId);
    });
  });
}

function reorderBookmarks(fromId, toId) {
  const from = getBookmark(fromId);
  const to = getBookmark(toId);
  if (!from || !to) return;

  const sameCategory = from.categoryId === to.categoryId;

  if (sameCategory) {
    const ids = els.bookmarksGrid.querySelectorAll('.bookmark-card');
    const ordered = Array.from(ids).map((c) => c.dataset.id);
    const fromIndex = ordered.indexOf(fromId);
    const toIndex = ordered.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) return;
    ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, fromId);
    ordered.forEach((id, i) => {
      const bm = getBookmark(id);
      if (bm) bm.order = i;
    });
  } else {
    from.categoryId = to.categoryId;
    from.order = state.data.bookmarks.filter((b) => b.categoryId === to.categoryId).length;
  }

  saveData();
  renderCurrentView();
  renderSidebar();
}

/* ============================================================
   BÚSQUEDA WEB (motor + autocompletado)
   ============================================================ */

function getEngine(id) {
  return APP.engines.find((e) => e.id === id) || APP.engines[0];
}

function searchWeb(query) {
  const q = query.trim();
  if (!q) {
    toast('Escribe algo para buscar', 'info');
    return;
  }
  const engine = getEngine(state.data.settings.webEngine);
  window.open(engine.url + encodeURIComponent(q), '_blank', 'noopener');
  hideWebSuggestions();
}

const WEB_SUGGESTION_PROVIDERS = {
  google: {
    origin: 'https://suggestqueries.google.com/*',
    url: (query) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${encodeURIComponent(getLanguage())}&q=${encodeURIComponent(query)}`,
    parse: (data) => Array.isArray(data && data[1]) ? data[1] : []
  },
  youtube: {
    origin: 'https://suggestqueries.google.com/*',
    url: (query) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${encodeURIComponent(getLanguage())}&q=${encodeURIComponent(query)}`,
    parse: (data) => Array.isArray(data && data[1]) ? data[1] : []
  },
  duckduckgo: {
    origin: 'https://duckduckgo.com/*',
    url: (query) => `https://duckduckgo.com/ac/?type=list&q=${encodeURIComponent(query)}`,
    parse: (data) => Array.isArray(data) ? data.map((item) => typeof item === 'string' ? item : item && item.phrase).filter(Boolean) : []
  },
  bing: {
    origin: 'https://api.bing.com/*',
    url: (query) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`,
    parse: (data) => Array.isArray(data && data[1]) ? data[1] : []
  },
  brave: {
    origin: 'https://search.brave.com/*',
    url: (query) => `https://search.brave.com/api/suggest?q=${encodeURIComponent(query)}`,
    parse: (data) => {
      if (Array.isArray(data && data[1])) return data[1];
      if (Array.isArray(data && data.suggestions)) return data.suggestions.map((item) => typeof item === 'string' ? item : item && (item.query || item.text)).filter(Boolean);
      if (Array.isArray(data && data.results)) return data.results.map((item) => typeof item === 'string' ? item : item && (item.query || item.text || item.title)).filter(Boolean);
      return [];
    }
  }
};

function getWebSuggestionProvider(engineId = state.data.settings.webEngine) {
  return WEB_SUGGESTION_PROVIDERS[engineId] || WEB_SUGGESTION_PROVIDERS.google;
}

function getExtensionPermissionsApi() {
  const api = globalThis.browser || globalThis.chrome;
  return api && api.permissions ? api : null;
}

async function hasWebSuggestionPermission(engineId) {
  const api = getExtensionPermissionsApi();
  if (!api) return true;
  const provider = getWebSuggestionProvider(engineId);
  try {
    return await api.permissions.contains({ origins: [provider.origin] });
  } catch {
    return false;
  }
}

async function requestWebSuggestionPermission(engineId) {
  const api = getExtensionPermissionsApi();
  if (!api) return true;
  const provider = getWebSuggestionProvider(engineId);
  try {
    // Debe ejecutarse directamente desde el clic de Ajustes. Comprobar antes
    // con una operación asíncrona puede hacer que Chromium pierda ese gesto.
    return await api.permissions.request({ origins: [provider.origin] });
  } catch {
    return false;
  }
}

function suggestionList(items) {
  return [...new Set((items || []).map((item) => String(item).trim()).filter(Boolean))].slice(0, 8);
}

function showWebSuggestionHint(message, onSelect = null) {
  els.webSuggestions.textContent = '';
  const item = el('li', {
    class: 'web-suggestion web-suggestion-hint' + (onSelect ? ' actionable' : ''),
    role: 'option',
    'aria-selected': 'false'
  });
  item.append(el('span', { class: 'web-suggestion-icon', html: ICONS.search }));
  item.append(el('span', { class: 'web-suggestion-name', text: message }));
  if (onSelect) {
    item.addEventListener('mousedown', async (event) => {
      event.preventDefault();
      const allowed = await onSelect();
      if (allowed) renderWebSuggestions(els.webSearchInput.value);
    });
  }
  els.webSuggestions.appendChild(item);
  els.webSuggestions.classList.remove('hidden');
}

async function fetchWebSuggestions(query) {
  const clean = query.trim();
  if (!clean || !state.data.settings.webSuggestionsEnabled) return [];
  const provider = getWebSuggestionProvider();
  if (getBrowserExtensionApi() && !await hasWebSuggestionPermission()) return [];
  try {
    const response = await fetch(provider.url(clean), { credentials: 'omit' });
    if (!response.ok) return [];
    return suggestionList(provider.parse(await response.json()));
  } catch {
    return [];
  }
}

async function renderWebSuggestions(query) {
  const clean = query.trim();
  if (!clean) {
    hideWebSuggestions();
    return;
  }
  const currentValue = els.webSearchInput.value.trim();
  if (currentValue !== clean) return;

  const engine = getEngine(state.data.settings.webEngine);
  if (!state.data.settings.webSuggestionsEnabled) {
    showWebSuggestionHint(t('webSuggestionsEnableHint', { engine: engine.name }));
    return;
  }
  if (getBrowserExtensionApi() && !await hasWebSuggestionPermission()) {
    showWebSuggestionHint(t('webSuggestionsAllowHint', { engine: engine.name }), () => requestWebSuggestionPermission(engine.id));
    return;
  }

  const remote = await fetchWebSuggestions(clean);
  if (els.webSearchInput.value.trim() !== clean) return;

  const suggestions = remote;
  if (!suggestions.length) {
    hideWebSuggestions();
    return;
  }

  els.webSuggestions.textContent = '';
  state.webIndex = 0;
  suggestions.slice(0, 8).forEach((s, i) => {
    const item = el('li', {
      class: 'web-suggestion' + (i === 0 ? ' selected' : ''),
      role: 'option',
      'aria-selected': i === 0 ? 'true' : 'false'
    });
    item.append(el('span', { class: 'web-suggestion-icon', html: ICONS.search }));
    item.append(el('span', { class: 'web-suggestion-name', text: s }));
    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      els.webSearchInput.value = s;
      searchWeb(s);
    });
    els.webSuggestions.appendChild(item);
  });

  els.webSuggestions.classList.remove('hidden');
  els.webSuggestions.setAttribute('role', 'listbox');
}

function hideWebSuggestions() {
  els.webSuggestions.classList.add('hidden');
  els.webSuggestions.textContent = '';
}

function updateWebSelection() {
  const items = els.webSuggestions.querySelectorAll('.web-suggestion');
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === state.webIndex);
    item.setAttribute('aria-selected', i === state.webIndex ? 'true' : 'false');
  });
  const sel = items[state.webIndex];
  if (sel) sel.scrollIntoView({ block: 'nearest' });
}

function initWebSearch() {
  els.webEngine.value = state.data.settings.webEngine || 'google';
  els.webEngine.addEventListener('change', async () => {
    state.data.settings.webEngine = els.webEngine.value;
    saveData();
    hideWebSuggestions();
    if (state.data.settings.webSuggestionsEnabled && !await requestWebSuggestionPermission(els.webEngine.value)) {
      toast(t('webSuggestionsPermissionDenied', { engine: getEngine(els.webEngine.value).name }), 'info');
    }
  });

  els.webSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const active = els.webSuggestions.querySelector('.web-suggestion.selected');
    const q = active ? active.textContent.trim() : els.webSearchInput.value;
    searchWeb(q);
  });

  let debounceTimer = null;
  els.webSearchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const value = els.webSearchInput.value;
    debounceTimer = setTimeout(() => {
      const still = els.webSearchInput.value;
      if (still === value) renderWebSuggestions(value);
    }, 180);
  });

  els.webSearchInput.addEventListener('keydown', (e) => {
    const items = els.webSuggestions.querySelectorAll('.web-suggestion');
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.webIndex = (state.webIndex + 1) % items.length;
      updateWebSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.webIndex = (state.webIndex - 1 + items.length) % items.length;
      updateWebSelection();
    } else if (e.key === 'Escape') {
      hideWebSuggestions();
    }
  });

  els.webSearchInput.addEventListener('blur', () => {
    setTimeout(hideWebSuggestions, 150);
  });
}

/* ============================================================
   GUARDAR ENLACES DESDE FUERA (drag & drop / parámetros)
   ============================================================ */

function showDropOverlay() {
  if (!els.dropOverlay) return;
  els.dropOverlay.classList.remove('hidden');
  els.dropOverlay.setAttribute('aria-hidden', 'false');
}

let externalDropZoneLocked = false;

function setExternalDropZoneLocked(locked) {
  externalDropZoneLocked = !!locked;
  if (externalDropZoneLocked) hideDropOverlay();
}

function hideDropOverlay() {
  if (!els.dropOverlay) return;
  els.dropOverlay.classList.add('hidden');
  els.dropOverlay.setAttribute('aria-hidden', 'true');
}

function handleExternalDrop(e) {
  const dt = e.dataTransfer;
  if (!dt) {
    toast('Arrastra un enlace válido', 'error');
    return;
  }

  const types = Array.from(dt.types || []);
  let url = '';

  if (types.includes('text/uri-list')) {
    url = (dt.getData('text/uri-list') || '').split(/\r?\n/).find((l) => l.trim() && !l.trim().startsWith('#')) || '';
  }
  if (!url) url = dt.getData('text/plain') || '';
  url = url.trim();

  if (!url) {
    toast('Arrastra un enlace válido', 'error');
    return;
  }

  const normalized = normalizeUrl(url);
  if (!isValidUrl(normalized)) {
    toast('Ese elemento no es un enlace válido', 'error');
    return;
  }

  openBookmarkForm(null, { name: getDomain(normalized) || 'Nuevo favorito', url: normalized });
}

function initDropZone() {
  let dragCounter = 0;
  const internalDragActive = () => !!(state.draggingId || state.draggingQuickKey || state.draggingWorkspaceId);

  window.addEventListener('dragenter', (e) => {
    if (state.currentView === 'later' || Array.from(e.dataTransfer?.types || []).some(t=>t.startsWith('application/dashboard-'))) return;
    if (externalDropZoneLocked || internalDragActive()) return;
    dragCounter++;
    showDropOverlay();
  });

  window.addEventListener('dragover', (e) => {
    if (externalDropZoneLocked) { e.preventDefault(); return; }
    if (internalDragActive()) return;
    const types = e.dataTransfer ? Array.from(e.dataTransfer.types || []) : [];
    if (types.some((t) => t === 'text/uri-list' || t === 'text/plain')) e.preventDefault();
  });

  window.addEventListener('dragleave', () => {
    if (externalDropZoneLocked) return;
    dragCounter = Math.max(0, dragCounter - 1);
    if (dragCounter === 0) hideDropOverlay();
  });

  window.addEventListener('drop', (e) => {
    if (e.defaultPrevented || state.currentView === 'later' || Array.from(e.dataTransfer?.types || []).some(t=>t.startsWith('application/dashboard-'))) { hideDropOverlay(); return; }
    if (externalDropZoneLocked) { e.preventDefault(); return; }
    dragCounter = 0;
    hideDropOverlay();
    e.preventDefault();
    if (internalDragActive()) return;
    handleExternalDrop(e);
  });
}

/* Permite abrir el dashboard con ?add=URL&title=Título para pre-rellenar el formulario. */
function handleExternalAdd() {
  try {
    const params = new URLSearchParams(window.location.search);
    const add = params.get('add');
    if (!add || !isValidUrl(add)) return;
    const title = params.get('title') || '';
    openBookmarkForm(null, { name: decodeEntities(title) || getDomain(add), url: add });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
  } catch {}
}

/* ============================================================
   PANEL LATERAL DERECHO
   ============================================================ */

function renderPanel() {
  renderRecentList();
  renderStats();
  renderCustomPanel();
  renderFooter();
}

function customWidgets() {
  return Array.isArray(state.data.customWidgets) ? state.data.customWidgets : [];
}

function isValidEmbedUrl(value) {
  try { return new URL(String(value || '')).protocol === 'https:'; } catch { return false; }
}

/* Política uniforme: ningún proveedor recibe excepciones de origen. */
function widgetIframeSandbox() {
  return 'allow-scripts allow-forms allow-popups';
}

function renderCustomWidgets() {
  const section = els.customWidgetsSection;
  if (!section) return;
  section.textContent = '';
  const head = el('div', { class: 'custom-widgets-head' });
  head.append(
    el('h2', { class: 'panel-section-title', text: 'Widgets propios' }),
    el('button', { class: 'icon-btn small', type: 'button', title: 'Añadir widget propio', 'aria-label': 'Añadir widget propio', html: ICONS.plus, onclick: () => openCustomWidgetForm() })
  );
  section.appendChild(head);
  const widgets = customWidgets().slice().sort((a, b) => a.order - b.order);
  if (!widgets.length) {
    section.appendChild(el('p', { class: 'custom-widget-empty', text: 'Añade una URL HTTPS para mostrar un widget embebido en este panel.' }));
    return;
  }
  widgets.forEach((widget) => {
    const card = el('article', { class: 'custom-widget-card' });
    const cardHead = el('div', { class: 'custom-widget-head' });
    const actions = el('div', { class: 'custom-widget-actions' });
    actions.append(
      el('button', { class: 'icon-btn small', type: 'button', title: 'Editar widget', 'aria-label': 'Editar widget', html: ICONS.edit, onclick: () => openCustomWidgetForm(widget.id) }),
      el('button', { class: 'icon-btn small danger', type: 'button', title: 'Eliminar widget', 'aria-label': 'Eliminar widget', html: ICONS.trash, onclick: () => confirmDeleteCustomWidget(widget.id) })
    );
    cardHead.append(el('span', { class: 'custom-widget-title', text: widget.title }), actions);
    const frame = el('iframe', {
      class: 'custom-widget-frame', src: widget.url, title: widget.title,
      sandbox: widgetIframeSandbox(widget.url), referrerpolicy: 'no-referrer', loading: 'lazy'
    });
    frame.style.height = `${Math.max(160, Math.min(900, Number(widget.height) || 320))}px`;
    card.append(cardHead, frame);
    section.appendChild(card);
  });
}

function openCustomWidgetForm(widgetId = null) {
  const editing = widgetId ? customWidgets().find((widget) => widget.id === widgetId) : null;
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: editing ? 'Editar widget propio' : 'Añadir widget propio' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  const titleInput = el('input', { class: 'form-input', type: 'text', maxlength: '80', placeholder: 'Ej.: Mi calendario visual', value: editing ? editing.title : '' });
  const urlInput = el('input', { class: 'form-input', type: 'url', placeholder: 'https://ejemplo.com/widget', value: editing ? editing.url : '' });
  const heightInput = el('input', { class: 'form-input', type: 'number', min: '160', max: '900', step: '20', value: String(editing ? editing.height : 320) });
  body.append(
    taskFormGroup('Nombre del widget', titleInput),
    taskFormGroup('URL HTTPS para embeber', urlInput),
    taskFormGroup('Altura (px)', heightInput),
    el('p', { class: 'task-form-help', text: 'Algunos sitios bloquean ser mostrados dentro de un iframe. El widget se abre aislado y DashboardDP no recibe sus datos.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn secondary', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn primary', text: editing ? 'Guardar' : 'Añadir', onclick: () => {
    const url = urlInput.value.trim();
    if (!isValidEmbedUrl(url)) { urlInput.classList.add('invalid'); urlInput.focus(); toast('Introduce una URL HTTPS válida.', 'error'); return; }
    const widget = editing || { id: uid(), createdAt: Date.now(), order: customWidgets().length };
    widget.title = titleInput.value.trim() || new URL(url).hostname;
    widget.url = url;
    widget.height = Math.max(160, Math.min(900, Number(heightInput.value) || 320));
    if (!editing) state.data.customWidgets.push(widget);
    saveWidgetToLibrary({ ...widget, width: widget.width || '100%' });
    saveData();
    renderPanel();
    closeModal();
    toast(editing ? 'Widget actualizado' : 'Widget añadido', 'success');
  }}));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => titleInput.focus(), 20);
}

function deleteCustomWidget(widgetId) {
  const widget = customWidgets().find((item) => item.id === widgetId);
  if (!widget) return;
  const trashEntry = addToTrash('custom-widget', widget.title, { widget });
  state.data.customWidgets = customWidgets().filter((item) => item.id !== widgetId);
  saveData();
  renderPanel();
  notifyTrashEntry(trashEntry);
}

function confirmDeleteCustomWidget(widgetId) {
  const widget = customWidgets().find((item) => item.id === widgetId);
  if (!widget) return;
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Eliminar widget propio' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.appendChild(el('p', { text: `¿Quieres eliminar el widget “${widget.title}”? Esta acción no se puede deshacer.` }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn danger', text: 'Eliminar', onclick: () => { deleteCustomWidget(widgetId); closeModal(); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function panelCustomBlocks() {
  return Array.isArray(state.data.panelCustomBlocks) ? state.data.panelCustomBlocks : [];
}

function getPanelMode() {
  return state.data.settings.panelMode === 'custom' ? 'custom' : 'default';
}

function nativePanelSection(type) {
  return ({ recent: els.panelRecentSection, stats: els.panelStatsSection, tools: els.panelToolsSection })[type] || null;
}

function panelBlockTitle(type) {
  return ({ recent: 'Recientes', stats: 'Estadísticas', tools: 'Widgets', notes: t('notesVisible'), iframe: 'Widget iframe' })[type] || 'Bloque';
}

function panelVisibleStickyNotes() {
  return stickyNotes()
    .filter((note) => note.showInPanel)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
    .slice(0, 9);
}

function stickyPreviewText(html) {
  const preview = document.createElement('div');
  preview.innerHTML = sanitizeStickyHtml(html);
  return (preview.textContent || '').replace(/\s+/g, ' ').trim();
}

function savePanelNoteInline(note, titleElement, contentElement) {
  const title = String(titleElement.textContent || '').trim().slice(0, 160);
  const html = sanitizeStickyHtml(contentElement.innerHTML);
  if (html.length > 180000) {
    toast('Esta nota contiene demasiado contenido. Usa el editor completo para reducirla.', 'error');
    return;
  }
  note.title = title;
  note.html = html;
  if (String(note.markdown || '').trim()) note.mode = 'markdown';
  note.updatedAt = Date.now();
  saveData();
}

function enablePanelNoteResize(note, card, handle) {
  let startY = 0;
  let startHeight = 0;
  const stop = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', stop);
    document.removeEventListener('pointercancel', stop);
    document.body.classList.remove('panel-note-resizing');
    note.panelHeight = Math.max(120, Math.min(640, Number(note.panelHeight) || 180));
    saveData();
  };
  const move = (event) => {
    const next = Math.max(120, Math.min(640, Math.round(startHeight + event.clientY - startY)));
    note.panelHeight = next;
    card.style.setProperty('--sticky-panel-height', `${next}px`);
  };
  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    startY = event.clientY;
    startHeight = Math.max(120, Math.min(640, Number(note.panelHeight) || card.getBoundingClientRect().height || 180));
    document.body.classList.add('panel-note-resizing');
    handle.setPointerCapture?.(event.pointerId);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop, { once: true });
    document.addEventListener('pointercancel', stop, { once: true });
  });
}

function renderPanelNotesSection({ standard = false } = {}) {
  const notesLayout = getPanelNotesLayout();
  const section = el('section', { class: `panel-notes-section panel-notes-${notesLayout}${standard ? ' panel-standard-notes-section panel-section' : ''}` });
  if (standard) {
    const heading = el('div', { class: 'panel-section-header' });
    const headingActions = el('div', { class: 'panel-note-header-actions' });
    headingActions.append(
      el('button', { class: 'icon-btn small', type: 'button', text: notesLayout === 'masonry' ? '☷' : '▦', title: notesLayout === 'masonry' ? t('notesStack') : t('notesMasonry'), 'aria-label': notesLayout === 'masonry' ? t('notesStack') : t('notesMasonry'), onclick: togglePanelNotesLayout }),
      el('button', { class: 'icon-btn small', type: 'button', title: t('stickyNotes'), 'aria-label': t('stickyNotes'), html: ICONS.edit, onclick: openStickyNotes })
    );
    heading.append(
      el('h2', { class: 'panel-section-title', text: t('notesVisible') }),
      headingActions
    );
    section.appendChild(heading);
  }
  const notes = panelVisibleStickyNotes();
  if (!notes.length) {
    section.append(
      el('p', { class: 'panel-empty', text: t('noNotesVisible') }),
      el('button', { class: 'btn secondary panel-notes-open', type: 'button', text: t('chooseNotes'), onclick: openStickyNotes })
    );
    return section;
  }
  const list = el('div', { class: 'panel-notes-list' });
  notes.forEach((note) => {
    const preview = el('article', { class: 'panel-note-preview', style: `--sticky-color:${note.color};--sticky-panel-height:${Math.max(120, Math.min(640, Number(note.panelHeight) || 180))}px` });
    const title = el('strong', { class: 'panel-note-inline-title', contenteditable: 'true', role: 'textbox', 'aria-label': 'Título de la nota', dataset: { placeholder: 'Título de la nota' } });
    title.textContent = note.title || '';
    const isMarkdown = isMarkdownStickyNote(note);
    const content = el('div', { class: `panel-note-preview-content${isMarkdown ? ' markdown-rendered' : ''}`, contenteditable: isMarkdown ? 'false' : 'true', role: 'textbox', 'aria-label': 'Contenido de la nota', dataset: { placeholder: 'Escribe directamente aquí…' } });
    content.style.fontFamily = note.fontFamily || 'system-ui';
    content.style.fontSize = note.fontSize || '16px';
    content.innerHTML = renderStickyNote(note);
    if (isMarkdown) bindStickyMarkdownTasks(content, note);
    const markdownInline = el('textarea', { class: 'panel-note-markdown hidden', 'aria-label': 'Markdown de la nota' });
    // En un textarea el atributo HTML value no rellena el texto visible;
    // hay que asignar la propiedad para no vaciar la fuente al editar en línea.
    markdownInline.value = note.markdown || '';
    let saveTimer = 0;
    const scheduleSave = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => savePanelNoteInline(note, title, content), 500);
    };
    [title, content].forEach((editable) => {
      editable.addEventListener('input', scheduleSave);
      editable.addEventListener('blur', () => { clearTimeout(saveTimer); savePanelNoteInline(note, title, content); });
      editable.addEventListener('paste', (event) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain') || '';
        document.execCommand('insertText', false, text);
      });
    });
    const actions = el('div', { class: 'panel-note-actions' });
    if (isMarkdown) {
      let editingMarkdown = false;
      const markdownToggle = el('button', { class: 'icon-btn small', type: 'button', title: 'Editar Markdown en línea', 'aria-label': 'Editar Markdown en línea', text: 'MD' });
      markdownToggle.addEventListener('click', () => {
        editingMarkdown = !editingMarkdown;
        markdownInline.classList.toggle('hidden', !editingMarkdown);
        content.classList.toggle('hidden', editingMarkdown);
        markdownToggle.classList.toggle('active', editingMarkdown);
        markdownToggle.title = editingMarkdown ? 'Mostrar vista previa' : 'Editar Markdown en línea';
        if (editingMarkdown) markdownInline.focus();
        else {
          note.markdown = markdownInline.value;
          note.mode = 'markdown';
          note.html = renderStickyMarkdown(note.markdown);
          note.updatedAt = Date.now();
          saveData();
          // Reconstruye el bloque completo para que la vista previa del panel
          // use exactamente el mismo renderizador que el editor central.
          renderPanel();
        }
      });
      markdownInline.addEventListener('input', () => {
        note.markdown = markdownInline.value;
        note.mode = 'markdown';
        note.html = renderStickyMarkdown(note.markdown);
        note.updatedAt = Date.now();
        saveData();
      });
      actions.appendChild(markdownToggle);
    }
    actions.appendChild(el('button', { class: 'icon-btn small', type: 'button', title: t('edit'), 'aria-label': t('edit'), html: ICONS.edit, onclick: () => openStickyEditor(note, { returnToNotes: false }) }));
    const resize = el('div', { class: 'panel-note-resize', role: 'separator', tabindex: '0', 'aria-label': 'Arrastrar para cambiar la altura de la nota', title: 'Arrastra para cambiar la altura' });
    enablePanelNoteResize(note, preview, resize);
    preview.append(title, content, markdownInline, actions, resize);
    list.appendChild(preview);
  });
  section.appendChild(list);
  return section;
}

function renderCustomPanel() {
  if (!els.panelContent) return;
  const custom = getPanelMode() === 'custom';
  const layout = getPanelCustomLayout();
  els.panel.classList.toggle('custom-mode', custom);
  els.panelModeLabel.textContent = custom ? 'Barra Personal' : 'Barra por Defecto';
  els.panelModeBtn.textContent = custom ? '▤' : '▥';
  els.panelModeBtn.title = custom ? 'Mostrar Barra por Defecto' : 'Mostrar Barra Personal';
  els.panelModeBtn.setAttribute('aria-label', els.panelModeBtn.title);
  els.panelModeBtn.classList.toggle('primary', !custom);
  els.panelLayoutBtn.classList.toggle('hidden', !custom);
  els.panelResetLayoutBtn?.classList.toggle('hidden', !custom || layout !== 'masonry');
  if (els.panelResetLayoutBtn) {
    els.panelResetLayoutBtn.textContent = '↺';
    els.panelResetLayoutBtn.title = t('resetMasonry');
    els.panelResetLayoutBtn.setAttribute('aria-label', t('resetMasonry'));
  }
  els.panelLayoutBtn.textContent = layout === 'stack' ? '☷' : layout === 'grid' ? '▦' : '⌗';
  els.panelLayoutBtn.title = layout === 'stack' ? 'Usar cuadrícula compacta' : layout === 'grid' ? 'Ajustar mosaico manualmente' : 'Usar vista vertical';
  els.panelLayoutBtn.setAttribute('aria-label', els.panelLayoutBtn.title);
  els.panelContent.textContent = '';
  if (!custom) {
    [els.panelRecentSection, els.panelStatsSection, els.panelToolsSection].forEach((section) => { if (section) els.panelContent.appendChild(section); });
    els.panelContent.appendChild(renderPanelNotesSection({ standard: true }));
    return;
  }
  const area = el('div', { class: `custom-panel-area custom-panel-${layout}` });
  const head = el('div', { class: 'custom-panel-head' });
  head.append(el('h2', { class: 'panel-section-title', text: 'Mis bloques' }), el('button', { class: 'icon-btn small', type: 'button', title: 'Añadir bloque', 'aria-label': 'Añadir bloque', html: ICONS.plus, onclick: openPanelBlockPicker }));
  const blocksArea = el('div', { class: 'custom-panel-blocks' });
  const blocks = panelCustomBlocks().slice().sort((a, b) => a.order - b.order);
  if (layout === 'masonry') ensureManualPanelLayouts(blocks);
  if (!blocks.length) blocksArea.appendChild(el('p', { class: 'custom-panel-empty', text: 'Esta barra está vacía. Pulsa + para añadir Recientes, Estadísticas, Widgets, Notas visibles o un iframe propio.' }));
  blocks.forEach((block, index) => blocksArea.appendChild(renderCustomPanelBlock(block, index, blocks.length, layout === 'masonry' ? blocksArea : null)));
  area.append(head, blocksArea);
  els.panelContent.appendChild(area);
  if (layout === 'masonry') requestAnimationFrame(() => { if (blocksArea.isConnected) updateManualPanelCanvasHeight(blocksArea); });
  updateCustomPanelGridLayout();
}

function renderCustomPanelBlock(block, index, total, manualCanvas = null) {
  const wrapper = el('article', { class: `custom-panel-block custom-panel-block-${block.type}` });
  if (manualCanvas) {
    wrapper.classList.add('custom-panel-manual-block');
    applyManualPanelBlockStyle(wrapper, getManualPanelLayout(block));
  }
  const header = el('div', { class: 'custom-panel-block-head' });
  const actions = el('div', { class: 'custom-panel-block-actions' });
  actions.append(
    el('button', { class: 'icon-btn small', type: 'button', text: '↑', title: 'Subir bloque', 'aria-label': 'Subir bloque', disabled: index === 0, onclick: () => movePanelCustomBlock(block.id, -1) }),
    el('button', { class: 'icon-btn small', type: 'button', text: '↓', title: 'Bajar bloque', 'aria-label': 'Bajar bloque', disabled: index === total - 1, onclick: () => movePanelCustomBlock(block.id, 1) })
  );
  if (block.type === 'iframe') actions.append(el('button', { class: 'icon-btn small', type: 'button', title: 'Editar widget', 'aria-label': 'Editar widget', html: ICONS.edit, onclick: () => openCustomIframeBlockForm(block.id) }));
  if (block.type === 'notes') actions.append(el('button', { class: 'icon-btn small', type: 'button', text: getPanelNotesLayout() === 'masonry' ? '☷' : '▦', title: getPanelNotesLayout() === 'masonry' ? t('notesStack') : t('notesMasonry'), 'aria-label': getPanelNotesLayout() === 'masonry' ? t('notesStack') : t('notesMasonry'), onclick: togglePanelNotesLayout }));
  actions.append(el('button', { class: 'icon-btn small danger', type: 'button', title: 'Quitar bloque', 'aria-label': 'Quitar bloque', html: ICONS.trash, onclick: () => confirmDeletePanelCustomBlock(block.id) }));
  header.append(el('span', { class: 'custom-panel-block-title', text: block.type === 'iframe' ? block.title : panelBlockTitle(block.type) }), actions);
  if (manualCanvas) {
    const dragHandle = el('span', { class: 'custom-panel-drag-handle', text: '⠿', title: 'Arrastra para mover el bloque', 'aria-label': 'Arrastra para mover el bloque', role: 'button', tabindex: '0' });
    const resizeHandle = el('div', { class: 'custom-panel-resize-handle', title: 'Arrastra para cambiar ancho y alto', 'aria-label': 'Arrastra para cambiar ancho y alto', role: 'separator', tabindex: '0' });
    header.prepend(dragHandle);
    enableManualPanelBlockInteractions(block, wrapper, dragHandle, resizeHandle, manualCanvas);
    wrapper.appendChild(resizeHandle);
  }
  wrapper.appendChild(header);
  if (block.type === 'iframe') {
    const frame = el('iframe', { class: 'custom-widget-frame', src: block.url, title: block.title, sandbox: widgetIframeSandbox(block.url), referrerpolicy: 'no-referrer', loading: 'lazy' });
    frame.style.width = normalizeIframeWidth(block.width) || '100%';
    frame.style.maxWidth = '100%';
    frame.style.height = `${normalizeIframeHeight(block.height) || 320}px`;
    wrapper.appendChild(frame);
  } else if (block.type === 'notes') {
    wrapper.appendChild(renderPanelNotesSection());
  } else {
    const nativeSection = nativePanelSection(block.type);
    if (nativeSection) wrapper.appendChild(nativeSection);
  }
  return wrapper;
}

function toggleCustomPanelMode() {
  state.data.settings.panelMode = getPanelMode() === 'custom' ? 'default' : 'custom';
  saveData();
  renderPanel();
  if (getPanelMode() === 'custom' && !panelCustomBlocks().length) openPanelBlockPicker();
}

function togglePanelCustomLayout() {
  const layout = getPanelCustomLayout();
  const layoutKey = getManualPanelLayoutKey();
  const next = layout === 'stack' ? 'grid' : layout === 'grid' ? 'masonry' : 'stack';
  state.data.settings.panelCustomLayouts = {
    ...(state.data.settings.panelCustomLayouts || {}),
    [layoutKey]: next
  };
  // Compatibilidad con instalaciones antiguas y con exportaciones previas.
  state.data.settings.panelCustomLayout = next;
  saveData();
  renderPanel();
}

function getPanelCustomLayout() {
  const layoutKey = getManualPanelLayoutKey();
  const layouts = state.data?.settings?.panelCustomLayouts;
  const selected = layouts?.[layoutKey];
  if (['stack', 'grid', 'masonry'].includes(selected)) return selected;
  return ['stack', 'grid', 'masonry'].includes(state.data?.settings?.panelCustomLayout) ? state.data.settings.panelCustomLayout : 'stack';
}

function resetPanelManualLayout() {
  const layoutKey = getManualPanelLayoutKey();
  panelCustomBlocks().forEach((block) => {
    if (block.manualLayouts) delete block.manualLayouts[layoutKey];
    delete block.manualLayout;
  });
  state.data.settings.panelCustomLayouts = {
    ...(state.data.settings.panelCustomLayouts || {}),
    [layoutKey]: 'grid'
  };
  state.data.settings.panelCustomLayout = 'grid';
  saveData();
  renderPanel();
  toast('Se ha restaurado la cuadrícula compacta.', 'success');
}

function getPanelNotesLayout() {
  return state.data?.settings?.panelNotesLayout === 'masonry' ? 'masonry' : 'stack';
}

function togglePanelNotesLayout() {
  state.data.settings.panelNotesLayout = getPanelNotesLayout() === 'masonry' ? 'stack' : 'masonry';
  saveData();
  renderPanel();
}

let customPanelResizeFrame = 0;
let customPanelResizeObserver = null;

function scheduleCustomPanelGridLayout() {
  if (customPanelResizeFrame) cancelAnimationFrame(customPanelResizeFrame);
  customPanelResizeFrame = requestAnimationFrame(() => {
    customPanelResizeFrame = 0;
    updateCustomPanelGridLayout();
  });
}

function initCustomPanelResizeObserver() {
  if (!els.panel || typeof ResizeObserver === 'undefined') return;
  if (customPanelResizeObserver) customPanelResizeObserver.disconnect();
  customPanelResizeObserver = new ResizeObserver(scheduleCustomPanelGridLayout);
  customPanelResizeObserver.observe(els.panel);
  scheduleCustomPanelGridLayout();
}

function updateCustomPanelGridLayout() {
  if (!els.panel || !els.panelContent || !state.data) return;
  const usesGrid = getPanelMode() === 'custom' && getPanelCustomLayout() === 'grid';
  const contentWidth = els.panelContent.clientWidth || els.panel.clientWidth;
  const wideGrid = usesGrid && contentWidth >= 560;
  els.panel.classList.toggle('custom-grid-wide', wideGrid);
  if (!wideGrid) {
    els.panel.style.removeProperty('--custom-grid-square-size');
    els.panel.style.removeProperty('--custom-grid-columns');
    return;
  }
  const blockCount = panelCustomBlocks().length;
  if (!blockCount) return;
  const topbarHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height')) || 64;
  const visiblePanelHeight = Math.min(els.panel.clientHeight || window.innerHeight - topbarHeight, window.innerHeight - topbarHeight);
  const columns = blockCount === 4 ? 2 : Math.min(3, blockCount);
  const rows = Math.max(1, Math.ceil(blockCount / columns));
  const gap = 6;
  const fromWidth = (contentWidth - 24 - ((columns - 1) * gap)) / columns;
  const fromHeight = (visiblePanelHeight - 154 - ((rows - 1) * gap)) / rows;
  const squareSize = Math.max(120, Math.floor(Math.min(fromWidth, fromHeight)));
  els.panel.style.setProperty('--custom-grid-square-size', `${squareSize}px`);
  els.panel.style.setProperty('--custom-grid-columns', `${columns}`);
}

function clampManualPanelValue(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min));
}

function normalizeManualPanelLayout(layout) {
  if (!layout || typeof layout !== 'object') return null;
  const width = clampManualPanelValue(layout.width, 18, 100);
  return {
    x: clampManualPanelValue(layout.x, 0, Math.max(0, 100 - width)),
    y: clampManualPanelValue(layout.y, 0, 6000),
    width,
    height: Math.round(clampManualPanelValue(layout.height, 140, 1800))
  };
}

function normalizeManualPanelLayouts(layouts, legacyLayout = null) {
  const source = layouts && typeof layouts === 'object' ? layouts : {};
  return {
    sidebar: normalizeManualPanelLayout(source.sidebar || legacyLayout),
    expanded: normalizeManualPanelLayout(source.expanded)
  };
}

function getManualPanelLayoutKey() {
  return els.panel?.classList.contains('expanded') ? 'expanded' : 'sidebar';
}

function getManualPanelLayout(block) {
  const layouts = normalizeManualPanelLayouts(block.manualLayouts, block.manualLayout);
  block.manualLayouts = layouts;
  return layouts[getManualPanelLayoutKey()];
}

function getAutomaticPanelLayoutMetrics(blockCount) {
  const contentWidth = els.panelContent?.clientWidth || els.panel?.clientWidth || 900;
  const topbarHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-height')) || 64;
  const visiblePanelHeight = Math.min(els.panel?.clientHeight || window.innerHeight - topbarHeight, window.innerHeight - topbarHeight);
  const columns = blockCount === 4 ? 2 : Math.min(3, Math.max(1, blockCount));
  const rows = Math.max(1, Math.ceil(blockCount / columns));
  const gap = 6;
  const fromWidth = (contentWidth - 24 - ((columns - 1) * gap)) / columns;
  const fromHeight = (visiblePanelHeight - 154 - ((rows - 1) * gap)) / rows;
  const squareSize = Math.max(140, Math.floor(Math.min(fromWidth, fromHeight)));
  const matrixWidth = (columns * squareSize) + ((columns - 1) * gap);
  return { contentWidth, columns, gap, squareSize, startX: Math.max(0, (contentWidth - matrixWidth) / 2) };
}

function ensureManualPanelLayouts(blocks) {
  if (!blocks.length) return;
  const metrics = getAutomaticPanelLayoutMetrics(blocks.length);
  let changed = false;
  blocks.forEach((block, index) => {
    const layoutKey = getManualPanelLayoutKey();
    const normalized = getManualPanelLayout(block);
    if (normalized) return;
    const column = index % metrics.columns;
    const row = Math.floor(index / metrics.columns);
    block.manualLayouts[layoutKey] = {
      x: ((metrics.startX + (column * (metrics.squareSize + metrics.gap))) / metrics.contentWidth) * 100,
      y: row * (metrics.squareSize + metrics.gap),
      width: (metrics.squareSize / metrics.contentWidth) * 100,
      height: metrics.squareSize
    };
    changed = true;
  });
  if (changed) saveData();
}

function applyManualPanelBlockStyle(wrapper, layout) {
  const normalized = normalizeManualPanelLayout(layout);
  if (!normalized) return;
  wrapper.style.setProperty('--manual-block-x', `${normalized.x}%`);
  wrapper.style.setProperty('--manual-block-y', `${normalized.y}px`);
  wrapper.style.setProperty('--manual-block-width', `${normalized.width}%`);
  wrapper.style.setProperty('--manual-block-height', `${normalized.height}px`);
}

function updateManualPanelCanvasHeight(canvas) {
  const bottom = Array.from(canvas.children).reduce((max, child) => Math.max(max, child.offsetTop + child.offsetHeight), 0);
  canvas.style.height = `${Math.max(260, bottom + 8)}px`;
}

function enableManualPanelBlockInteractions(block, wrapper, dragHandle, resizeHandle, canvas) {
  const startInteraction = (event, kind) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const layoutKey = getManualPanelLayoutKey();
    const initial = getManualPanelLayout(block);
    if (!initial) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const canvasWidth = Math.max(1, canvas.clientWidth);
    wrapper.classList.add(kind === 'move' ? 'manual-moving' : 'manual-resizing');
    document.body.classList.add('panel-manual-adjusting');
    const move = (pointerEvent) => {
      const deltaX = pointerEvent.clientX - startX;
      const deltaY = pointerEvent.clientY - startY;
      const next = { ...initial };
      if (kind === 'move') {
        next.x = clampManualPanelValue(initial.x + ((deltaX / canvasWidth) * 100), 0, 100 - initial.width);
        next.y = clampManualPanelValue(initial.y + deltaY, 0, 6000);
      } else {
        next.width = clampManualPanelValue(initial.width + ((deltaX / canvasWidth) * 100), 18, 100 - initial.x);
        next.height = Math.round(clampManualPanelValue(initial.height + deltaY, 140, 1800));
      }
      block.manualLayouts[layoutKey] = normalizeManualPanelLayout(next);
      applyManualPanelBlockStyle(wrapper, block.manualLayouts[layoutKey]);
      updateManualPanelCanvasHeight(canvas);
    };
    const stop = () => {
      wrapper.classList.remove('manual-moving', 'manual-resizing');
      document.body.classList.remove('panel-manual-adjusting');
      saveData();
      document.removeEventListener('pointermove', move);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop, { once: true });
    document.addEventListener('pointercancel', stop, { once: true });
  };
  dragHandle.addEventListener('pointerdown', (event) => startInteraction(event, 'move'));
  resizeHandle.addEventListener('pointerdown', (event) => startInteraction(event, 'resize'));
}

function openPanelBlockPicker() { openWidgetLibrary(); }
function addPanelCustomBlock(type) {
  if (panelCustomBlocks().length >= MAX_CUSTOM_PANEL_BLOCKS) return;
  state.data.panelCustomBlocks.push({ id: uid(), type, title: '', url: '', height: 320, createdAt: Date.now(), order: panelCustomBlocks().length });
  saveData();
  closeModal();
  renderPanel();
}

function normalizeIframeWidth(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return null;
  const match = raw.match(/^(\d{1,4}(?:\.\d+)?)\s*(px|%)?$/);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2] || 'px';
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (unit === '%' && amount <= 100) return `${amount}%`;
  if (unit === 'px' && amount >= 120 && amount <= 1600) return `${amount}px`;
  return null;
}

function normalizeIframeHeight(value) {
  const raw = String(value ?? '').trim().toLowerCase().replace(/px$/, '');
  if (!raw || !/^\d{1,4}(?:\.\d+)?$/.test(raw)) return null;
  const amount = Number(raw);
  return Number.isFinite(amount) && amount >= 120 && amount <= 1600 ? Math.round(amount) : null;
}

function buildCustomIframeCode({ url, title, width, height }) {
  const cleanWidth = normalizeIframeWidth(width) || '100%';
  const widthAttribute = cleanWidth.endsWith('px') ? cleanWidth.slice(0, -2) : cleanWidth;
  const cleanHeight = normalizeIframeHeight(height) || 320;
  const cleanTitle = String(title || 'Widget').trim().slice(0, 80) || 'Widget';
  return `<iframe src="${escapeAttr(url)}" width="${escapeAttr(widthAttribute)}" height="${cleanHeight}" frameborder="0" loading="lazy" title="${escapeAttr(cleanTitle)}"></iframe>`;
}

function parseCustomIframe(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (!/^<iframe\b/i.test(raw)) return isValidEmbedUrl(raw) ? { url: raw, title: '', width: null, height: null } : null;
  const frame = new DOMParser().parseFromString(raw, 'text/html').querySelector('iframe');
  if (!frame || !isValidEmbedUrl(frame.getAttribute('src'))) return null;
  return {
    url: frame.getAttribute('src').trim(),
    title: (frame.getAttribute('title') || '').trim().slice(0, 80),
    width: normalizeIframeWidth(frame.getAttribute('width') || frame.style.width),
    height: normalizeIframeHeight(frame.getAttribute('height') || frame.style.height)
  };
}

function widgetLibrary() {
  return Array.isArray(state.data.widgetLibrary) ? state.data.widgetLibrary : [];
}

const WIDGET_LIBRARY_TYPES = ['Por defecto','Mapas','Desarrollo','Herramientas','Citas','Banca','Música','Tiempo','Productividad','Noticias','Otros'];

function normalizeWidgetLibraryEntry(entry, index = 0) {
  const url = typeof entry?.url === 'string' && isValidEmbedUrl(entry.url.trim()) ? entry.url.trim() : '';
  if (!url) return null;
  const title = typeof entry.title === 'string' && entry.title.trim() ? entry.title.trim().slice(0, 80) : new URL(url).hostname;
  const width = normalizeIframeWidth(entry.width) || '100%';
  const height = normalizeIframeHeight(entry.height) || 320;
  const createdAt = Number.isFinite(Number(entry.createdAt)) ? Number(entry.createdAt) : Date.now();
  const updatedAt = Number.isFinite(Number(entry.updatedAt)) ? Number(entry.updatedAt) : createdAt;
  const lastUsedAt = Number.isFinite(Number(entry.lastUsedAt)) ? Number(entry.lastUsedAt) : updatedAt;
  return {
    id: typeof entry.id === 'string' ? entry.id : uid(),
    title,
    url,
    width,
    height,
    embedCode: buildCustomIframeCode({ url, title, width, height }),
    description: typeof entry.description === 'string' ? entry.description.slice(0,4000) : '',
    widgetType: typeof entry.widgetType === 'string' && entry.widgetType.trim() ? entry.widgetType.trim().slice(0,60) : 'Otros',
    createdAt,
    updatedAt,
    lastUsedAt,
    order: typeof entry.order === 'number' ? entry.order : index
  };
}

function widgetLibrarySignature(entry) {
  return [String(entry?.url || '').trim(), String(entry?.title || '').trim(), normalizeIframeWidth(entry?.width) || '100%', normalizeIframeHeight(entry?.height) || 320].join('\u0001');
}

function saveWidgetToLibrary(widget, existingId = null) {
  const normalized = normalizeWidgetLibraryEntry(widget, widgetLibrary().length);
  if (!normalized) return null;
  const signature = widgetLibrarySignature(normalized);
  const current = existingId ? widgetLibrary().find((entry) => entry.id === existingId) : null;
  const duplicate = widgetLibrary().find((entry) => entry.id !== current?.id && widgetLibrarySignature(entry) === signature);
  const now = Date.now();
  if (duplicate) {
    if (widget.description !== undefined) duplicate.description = normalized.description;
    if (widget.widgetType !== undefined) duplicate.widgetType = normalized.widgetType;
    duplicate.lastUsedAt = now;
    duplicate.updatedAt = now;
    return duplicate;
  }
  if (current) {
    if (widget.description === undefined) normalized.description = current.description || '';
    if (widget.widgetType === undefined) normalized.widgetType = current.widgetType || 'Otros';
    Object.assign(current, normalized, { id: current.id, createdAt: current.createdAt, updatedAt: now, lastUsedAt: now });
    return current;
  }
  normalized.createdAt = now;
  normalized.updatedAt = now;
  normalized.lastUsedAt = now;
  normalized.order = widgetLibrary().length;
  state.data.widgetLibrary.push(normalized);
  return normalized;
}

function copyWidgetLibraryCode(entry) {
  const code = entry.embedCode || buildCustomIframeCode(entry);
  if (!navigator.clipboard?.writeText) { toast('Selecciona el código para copiarlo.', 'info'); return; }
  navigator.clipboard.writeText(code).then(() => toast('Código iframe copiado.', 'success')).catch(() => toast('No se pudo copiar automáticamente. Selecciona el código para copiarlo.', 'info'));
}

function addWidgetLibraryEntryToPanel(entryId) {
  const entry = widgetLibrary().find((item) => item.id === entryId);
  if (!entry) return;
  if (panelCustomBlocks().length >= MAX_CUSTOM_PANEL_BLOCKS) { toast(`La barra personalizada admite un máximo de ${MAX_CUSTOM_PANEL_BLOCKS} bloques.`, 'info'); return; }
  const block = {
    id: uid(), type: 'iframe', title: entry.title, url: entry.url, width: entry.width, height: entry.height,
    embedCode: entry.embedCode || buildCustomIframeCode(entry), manualLayouts: {}, createdAt: Date.now(), order: panelCustomBlocks().length
  };
  state.data.panelCustomBlocks.push(block);
  entry.lastUsedAt = Date.now();
  saveData();
  closeModal();
  renderPanel();
  toast(`Widget “${entry.title}” añadido a tu barra.`, 'success');
}

function openWidgetLibraryForm(entryId = null) {
  const editing = entryId ? widgetLibrary().find((entry) => entry.id === entryId) : null;
  const modal = el('div', { class: 'modal widget-library-form-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: editing ? 'Editar widget guardado' : 'Guardar widget en mi biblioteca' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: openWidgetLibrary }));
  const body = el('div', { class: 'modal-body' });
  const descriptionInput=el('textarea',{class:'form-textarea',rows:'4',maxlength:'4000',placeholder:'Descripción del widget…'});
  descriptionInput.value=editing?.description||'';
  const typeInput=el('input',{class:'form-input',type:'text',maxlength:'60',list:'widgetTypeSuggestions',value:editing?.widgetType||'Otros',placeholder:'Mapas, música, herramientas…'});
  const typeSuggestions=el('datalist',{id:'widgetTypeSuggestions'});
  WIDGET_LIBRARY_TYPES.forEach(value=>typeSuggestions.append(el('option',{value})));
  body.append(taskFormGroup('Descripción',descriptionInput),taskFormGroup('Tipo de widget',typeInput),typeSuggestions);
  const titleInput = el('input', { class: 'form-input', type: 'text', maxlength: '80', placeholder: 'Ej.: Mapa del tiempo', value: editing ? editing.title : '' });
  const embedInput = el('textarea', { class: 'form-textarea iframe-code-input', rows: '7', placeholder: 'https://ejemplo.com/widget\n\no pega aquí el código <iframe> completo' });
  embedInput.value = editing ? (editing.embedCode || buildCustomIframeCode(editing)) : '';
  const widthInput = el('input', { class: 'form-input', type: 'text', inputmode: 'decimal', maxlength: '8', placeholder: '100% o 640', value: editing ? (normalizeIframeWidth(editing.width) || '100%') : '100%' });
  const heightInput = el('input', { class: 'form-input', type: 'number', min: '120', max: '1600', step: '20', value: String(editing ? (normalizeIframeHeight(editing.height) || 320) : 320) });
  body.append(
    el('p', { class: 'widget-library-lead', text: 'Los widgets guardados permanecen aquí aunque quites su bloque de la Barra Personal. Puedes conservar distintas versiones del mismo servicio.' }),
    taskFormGroup('Nombre del widget', titleInput), taskFormGroup('URL HTTPS o código iframe', embedInput), taskFormGroup('Ancho (px o %)', widthInput), taskFormGroup('Altura (px)', heightInput)
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn secondary', text: 'Volver a la biblioteca', onclick: openWidgetLibrary }), el('button', { class: 'btn primary', text: editing ? 'Guardar cambios' : 'Guardar widget', onclick: () => {
    const parsed = parseCustomIframe(embedInput.value);
    if (!parsed) { embedInput.classList.add('invalid'); embedInput.focus(); toast('Pega una URL HTTPS válida o un iframe con src HTTPS.', 'error'); return; }
    const width = normalizeIframeWidth(widthInput.value || parsed.width || editing?.width || '100%');
    if (!width) { widthInput.classList.add('invalid'); widthInput.focus(); toast('Indica un ancho entre 120 y 1600 px, o un porcentaje hasta 100%.', 'error'); return; }
    const height = normalizeIframeHeight(heightInput.value || parsed.height || editing?.height || 320);
    if (!height) { heightInput.classList.add('invalid'); heightInput.focus(); toast('Indica una altura entre 120 y 1600 px.', 'error'); return; }
    const saved = saveWidgetToLibrary({ title: titleInput.value.trim() || parsed.title || new URL(parsed.url).hostname, description:descriptionInput.value.trim(), widgetType:typeInput.value.trim()||'Otros', url: parsed.url, width, height }, editing?.id || null);
    if (!saved) return;
    saveData();
    openWidgetLibrary();
    toast(editing ? 'Widget guardado actualizado.' : 'Widget añadido a tu biblioteca.', 'success');
  }}));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => titleInput.focus(), 20);
}

function confirmDeleteWidgetLibraryEntry(entryId) {
  const entry = widgetLibrary().find((item) => item.id === entryId);
  if (!entry) return;
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Eliminar de la biblioteca' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: openWidgetLibrary }));
  const body = el('div', { class: 'modal-body' });
  body.appendChild(el('p', { text: `¿Quieres eliminar “${entry.title}” de tu Biblioteca de widgets? Los bloques que ya estén en tu barra no se quitarán.` }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn secondary', text: 'Cancelar', onclick: openWidgetLibrary }), el('button', { class: 'btn danger', text: 'Mover a la Papelera', onclick: () => { const trashEntry = addToTrash('widget-library', entry.title, { widget: entry }); state.data.widgetLibrary = widgetLibrary().filter((item) => item.id !== entryId); saveData(); openWidgetLibrary(); notifyTrashEntry(trashEntry); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function openWidgetLibraryPreview(entry, back) {
  if(!isValidEmbedUrl(entry.url))return;
  const frame=el('iframe',{src:entry.url,title:entry.title,sandbox:widgetIframeSandbox(entry.url),referrerpolicy:'no-referrer',loading:'lazy'});
  const close=()=>{frame.removeAttribute('src');back();};
  const modal=el('div',{class:'modal widget-library-preview-modal',role:'dialog','aria-label':entry.title});
  modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',text:entry.title}),el('button',{class:'modal-close',text:'×',title:'Cerrar vista previa','aria-label':'Cerrar vista previa',onclick:close})]),el('div',{class:'modal-body'},[frame]),el('div',{class:'modal-footer'},[el('span',{class:'form-hint',text:'Algunos servicios bloquean la incrustación.'}),el('button',{class:'btn',text:'Cerrar',onclick:close})]));
  openModal(modal);
}

function openWidgetLibrary() {
 const modal=el('div',{class:'modal widget-library-modal',role:'dialog','aria-labelledby':'modalTitle'}),body=el('div',{class:'modal-body widget-library-body'}),toolbar=el('div',{class:'widget-library-toolbar'}),search=el('input',{class:'form-input',type:'search',placeholder:'Rechercher…','aria-label':'Buscar widgets'}),filter=el('select',{class:'form-select','aria-label':'Tipo de widget'}),view=el('select',{class:'form-select','aria-label':'Vista de widgets'}),list=el('div',{class:'widget-library-list'});
 search.placeholder='Buscar widgets…';
 const sort=el('select',{class:'form-select','aria-label':'Ordenar widgets'});
 [['name-asc','Nombre A–Z'],['name-desc','Nombre Z–A'],['updated','Últimos modificados']].forEach(([value,text])=>sort.append(el('option',{value,text})));
 sort.value=['name-asc','name-desc','updated'].includes(state.data.settings.widgetLibrarySort)?state.data.settings.widgetLibrarySort:'name-asc';
 filter.append(el('option',{value:'',text:'Todos los tipos'}));
 [...new Set([...WIDGET_LIBRARY_TYPES,...widgetLibrary().map(e=>e.widgetType||'Otros')])].sort().forEach(value=>filter.append(el('option',{value,text:value})));
 [['cards','Tarjetas'],['list','Lista']].forEach(([value,text])=>view.append(el('option',{value,text})));
 const views=state.data.settings.widgetLibraryViews||{};view.value=views.all||'cards';
 const render=()=>{
  list.textContent='';list.className='widget-library-list widget-library-view-'+view.value;
  const defaults=[['recent','Recientes','Los últimos favoritos abiertos.'],['stats','Estadísticas','Contadores y estado de tus marcadores.'],['tools','Widgets','Herramientas integradas del Dashboard.'],['notes',t('notesVisible'),'Muestra las notas elegidas.']].map(([nativeType,title,description])=>({nativeType,title,description,widgetType:'Por defecto',url:'',updatedAt:0}));
  const entries=[...defaults,...widgetLibrary()].filter(e=>(!filter.value||(e.widgetType||'Otros')===filter.value)&&normalizeSearchText(e.title+' '+e.url+' '+(e.description||'')).includes(normalizeSearchText(search.value))).sort((a,b)=>sort.value==='updated'?b.updatedAt-a.updatedAt:(sort.value==='name-desc'?-1:1)*a.title.localeCompare(b.title,getLocale(),{sensitivity:'base',numeric:true}));
  if(!entries.length)list.append(el('p',{text:'No hay widgets con estos filtros.'}));
  entries.forEach(entry=>{
   const card=el('article',{class:'widget-library-card'}),description=el('p',{class:'widget-library-description',text:entry.description||''}),actions=el('div',{class:'widget-library-actions'});
   if(entry.nativeType){card.append(el('strong',{text:entry.title}));if(entry.description)card.append(description);card.append(el('button',{class:'btn secondary',html:ICONS.plus+'<span>Agregar</span>',title:'Agregar a mi barra',disabled:panelCustomBlocks().length>=MAX_CUSTOM_PANEL_BLOCKS||panelCustomBlocks().some(b=>b.type===entry.nativeType),onclick:()=>addPanelCustomBlock(entry.nativeType)}));list.append(card);return;}
   const iconButton=(icon,label,fn,danger=false)=>el('button',{class:'icon-btn'+(danger?' danger':''),type:'button',html:icon,title:label,'aria-label':label,onclick:fn});
   actions.append(el('button',{class:'btn secondary',type:'button',html:ICONS.plus+'<span>Agregar</span>',title:'Agregar a mi barra',disabled:panelCustomBlocks().length>=MAX_CUSTOM_PANEL_BLOCKS,onclick:()=>addWidgetLibraryEntryToPanel(entry.id)}),iconButton(ICONS.duplicate,'Copiar código',()=>copyWidgetLibraryCode(entry)),iconButton(ICONS.edit,'Editar widget',()=>openWidgetLibraryForm(entry.id)),iconButton(ICONS.trash,'Eliminar widget',()=>confirmDeleteWidgetLibraryEntry(entry.id),true));
   const preview=el('div',{class:'widget-library-preview'}),previewButton=el('button',{class:'icon-btn',html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',title:'Abrir vista previa','aria-label':'Abrir vista previa'});
   previewButton.onclick=()=>openWidgetLibraryPreview(entry,()=>{openModal(modal);});
   preview.append(previewButton);
   card.append(el('strong',{text:entry.title}),el('a',{class:'widget-library-domain',text:getDomain(entry.url),href:entry.url,target:'_blank',rel:'noopener noreferrer'}));if(entry.description)card.append(description);actions.prepend(previewButton);card.append(actions);list.append(card);
  });
 };
 filter.onchange=()=>{view.value=(state.data.settings.widgetLibraryViews||{})[filter.value||'all']||'cards';render();};
 view.onchange=()=>{state.data.settings.widgetLibraryViews={...(state.data.settings.widgetLibraryViews||{}),[filter.value||'all']:view.value};saveData();render();};
 search.oninput=render;
 sort.onchange=()=>{state.data.settings.widgetLibrarySort=sort.value;saveData();render();};
 toolbar.append(search,filter,sort,view);body.append(el('p',{class:'form-hint',text:'Los widgets se guardan en tu copia completa. Las vistas previas contactan con el servicio externo solo al pulsarlas; no son capturas almacenadas. Algunos servicios bloquean su incrustación.'}),toolbar,list);
 modal.append(el('div',{class:'modal-header'},[el('h2',{class:'modal-title',id:'modalTitle',text:'Biblioteca de widgets'}),el('button',{class:'modal-close',text:'×','aria-label':'Cerrar',onclick:closeModal})]),body,el('div',{class:'modal-footer'},[el('button',{class:'btn',text:'Cerrar',onclick:closeModal}),el('button',{class:'btn primary',text:'Añadir widget',onclick:()=>openWidgetLibraryForm()})]));render();openModal(modal);
}

function openCustomIframeBlockForm(blockId = null) {
  const editing = blockId ? panelCustomBlocks().find((block) => block.id === blockId && block.type === 'iframe') : null;
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: editing ? 'Editar iframe propio' : 'Añadir iframe propio' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  const titleInput = el('input', { class: 'form-input', type: 'text', maxlength: '80', placeholder: 'Ej.: Temporizador Pomodoro', value: editing ? editing.title : '' });
  const fallbackCode = editing ? buildCustomIframeCode(editing) : '';
  const embedInput = el('textarea', { class: 'form-textarea iframe-code-input', rows: '7', placeholder: 'https://ejemplo.com/widget\n\no pega aquí el código <iframe> completo' });
  // En un textarea el atributo HTML "value" no rellena su contenido visible.
  // Se asigna la propiedad para conservar y mostrar siempre el código al editar.
  embedInput.value = editing ? (editing.embedCode || fallbackCode) : '';
  const widthInput = el('input', { class: 'form-input', type: 'text', inputmode: 'decimal', maxlength: '8', placeholder: '100% o 640', value: editing ? (normalizeIframeWidth(editing.width) || '100%') : '' });
  const heightInput = el('input', { class: 'form-input', type: 'number', min: '120', max: '1600', step: '20', placeholder: 'Se detecta del iframe si existe', value: editing ? String(normalizeIframeHeight(editing.height) || 320) : '' });
  body.append(taskFormGroup('Nombre del widget', titleInput), taskFormGroup('URL HTTPS o código iframe', embedInput), taskFormGroup('Ancho (px o %)', widthInput), taskFormGroup('Altura (px)', heightInput), el('p', { class: 'task-form-help', text: 'El código se conserva para que puedas editarlo después. El ancho acepta, por ejemplo, 100%, 360 o 640 px; se adapta al panel cuando falte espacio. En mosaico manual, ancho y altura actualizan el tamaño de la tarjeta. Se usa únicamente la dirección HTTPS del iframe.' }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn secondary', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn primary', text: editing ? 'Guardar' : 'Añadir', onclick: () => {
    const parsed = parseCustomIframe(embedInput.value);
    if (!parsed) { embedInput.classList.add('invalid'); embedInput.focus(); toast('Pega una URL HTTPS válida o un iframe con src HTTPS.', 'error'); return; }
    const width = normalizeIframeWidth(widthInput.value || parsed.width || editing?.width || '100%');
    if (!width) { widthInput.classList.add('invalid'); widthInput.focus(); toast('Indica un ancho entre 120 y 1600 px, o un porcentaje hasta 100%.', 'error'); return; }
    const height = normalizeIframeHeight(heightInput.value || parsed.height || editing?.height || 320);
    if (!height) { heightInput.classList.add('invalid'); heightInput.focus(); toast('Indica una altura entre 120 y 1600 px.', 'error'); return; }
    const block = editing || { id: uid(), type: 'iframe', createdAt: Date.now(), order: panelCustomBlocks().length };
    block.title = titleInput.value.trim() || parsed.title || new URL(parsed.url).hostname;
    block.url = parsed.url;
    block.width = width;
    block.height = height;
    if (getPanelCustomLayout() === 'masonry') {
      const canvasWidth = els.panelContent?.clientWidth || 900;
      const inputWidth = width.endsWith('%') ? Number.parseFloat(width) : (Number.parseFloat(width) / canvasWidth) * 100;
      const layoutKey = getManualPanelLayoutKey();
      const current = getManualPanelLayout(block) || { x: 0, y: 0, width: inputWidth, height };
      block.manualLayouts[layoutKey] = normalizeManualPanelLayout({ ...current, width: inputWidth, height });
    }
    block.embedCode = buildCustomIframeCode(block);
    if (!editing) state.data.panelCustomBlocks.push(block);
    saveWidgetToLibrary(block);
    saveData();
    renderPanel();
    closeModal();
  } }));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => titleInput.focus(), 20);
}

function movePanelCustomBlock(blockId, direction) {
  const blocks = panelCustomBlocks().slice().sort((a, b) => a.order - b.order);
  const index = blocks.findIndex((block) => block.id === blockId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= blocks.length) return;
  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
  blocks.forEach((block, order) => { block.order = order; });
  state.data.panelCustomBlocks = blocks;
  saveData();
  renderPanel();
}

function confirmDeletePanelCustomBlock(blockId) {
  const block = panelCustomBlocks().find((item) => item.id === blockId);
  if (!block) return;
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Quitar bloque de mi barra' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.appendChild(el('p', { text: `¿Quieres quitar “${block.type === 'iframe' ? block.title : panelBlockTitle(block.type)}” de tu barra personalizada? Podrás volver a añadirlo cuando quieras.` }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn danger', text: 'Quitar', onclick: () => { state.data.panelCustomBlocks = panelCustomBlocks().filter((item) => item.id !== blockId); saveData(); closeModal(); renderPanel(); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function renderFooter() {
  if (els.footerCopyright) els.footerCopyright.textContent = `DashboardDP © ${new Date().getFullYear()} · GPL-3.0-only.`;
  if (!els.supportLink) return;
  const url = getSupportUrl();
  const enabled = !!url;
  els.supportLink.classList.toggle('hidden', !enabled);
  if (enabled) els.supportLink.href = url;
}

function getSupportUrl() {
  try {
    const url = new URL(String(APP.supportUrl || '').trim());
    const isKoFi = url.hostname === 'ko-fi.com' || url.hostname === 'www.ko-fi.com';
    return url.protocol === 'https:' && isKoFi && url.pathname.length > 1 ? url.href : '';
  } catch {
    return '';
  }
}

function renderRecentList() {
  els.recentList.textContent = '';
  const recent = state.data.bookmarks.filter((b) => b.lastAccess > 0).sort((a, b) => b.lastAccess - a.lastAccess).slice(0, 5);

  if (recent.length === 0) {
    els.recentList.appendChild(el('li', { class: 'panel-empty', text: 'Aún no hay actividad' }));
    return;
  }

  recent.forEach((bookmark) => {
    els.recentList.appendChild(renderPanelLink(bookmark));
  });
}

function renderPanelLink(bookmark) {
  const li = el('li');
  const a = el('a', {
    class: 'panel-link',
    href: bookmark.url,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Abrir ${bookmark.name}`
  });
  const favicon = el('span', { class: 'panel-link-favicon', html: renderFavicon(bookmark) });
  const name = el('span', { class: 'panel-link-name', text: bookmark.name });
  a.append(favicon, name);
  a.addEventListener('click', () => recordUsage(bookmark.id));
  li.appendChild(a);
  return li;
}

function renderStats() {
  els.statTotal.textContent = String(state.data.bookmarks.length);
  els.statCategories.textContent = String(state.data.categories.length);
  els.statPinned.textContent = String(state.data.bookmarks.filter((b) => b.pinned).length);
  const syncedAt = Number(state.data.settings.lastNativeSyncAt) || 0;
  if (getBrowserExtensionApi()) {
    if (state.data.settings.nativeBookmarkMode === 'future') {
      els.syncStatus.textContent = t('browserFuture');
    } else {
      els.syncStatus.textContent = syncedAt
      ? t('browserSynced', { time: new Date(syncedAt).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) })
      : t('browserPreparing');
    }
  } else {
    els.syncStatus.textContent = 'Marcadores del navegador: instala la extensión para sincronizar';
  }
}

/* ============================================================
   MODALES
   ============================================================ */

// El fondo solo debe cerrar una ventana cuando la pulsación empieza y termina
// deliberadamente sobre él. Así, seleccionar texto desde un campo y soltar el
// ratón fuera del modal nunca se confunde con un clic de cierre.
let modalBackdropPressStarted = false;

function openModal(modal) {
  modalBackdropPressStarted = false;
  els.modalOverlay.textContent = '';
  els.modalOverlay.appendChild(modal);
  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.classList.add('visible');

  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  modalBackdropPressStarted = false;
  const closesTaskUi = !!els.modalOverlay.querySelector('.task-manager-modal, .task-form-modal, .calendar-guide-modal, .sticky-notes-modal, .sticky-editor-modal');
  els.modalOverlay.textContent = '';
  els.modalOverlay.classList.add('hidden');
  els.modalOverlay.classList.remove('visible');
  if (closesTaskUi) setExternalDropZoneLocked(false);
}

function confirmDeleteBookmark(id) {
  const bookmark = getBookmark(id);
  if (!bookmark) return;

  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Eliminar favorito' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });
  body.append(el('p', { text: `¿Quieres mover "${bookmark.name}" a la Papelera? Podrás restaurarlo durante los próximos 30 días.` }));

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn danger', text: 'Mover a la Papelera', onclick: () => { deleteBookmark(id); closeModal(); } }));

  modal.append(header, body, footer);
  openModal(modal);
}

function confirmDeleteCategory(id) {
  const cat = getCategory(id);
  if (!cat) return;
  const ids = getDescendantIds(id);
  const bmCount = state.data.bookmarks.filter((b) => ids.includes(b.categoryId)).length;
  const subCount = ids.length - 1;

  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Eliminar categoría' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });
  const msg = subCount > 0
    ? `¿Mover "${cat.name}", sus ${subCount} subcategorías y ${bmCount} favoritos a la Papelera? Podrás restaurar el árbol durante 30 días.`
    : `¿Mover "${cat.name}" y sus ${bmCount} favoritos a la Papelera? Podrás restaurarlos durante 30 días.`;
  body.append(el('p', { text: msg }));

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn danger', text: 'Mover a la Papelera', onclick: () => { deleteCategory(id); closeModal(); } }));

  modal.append(header, body, footer);
  openModal(modal);
}

/* ---------- Auditoría segura de favoritos ---------- */
const BOOKMARK_AUDIT_LABELS = {
  available: 'Disponible',
  missing: 'No existe (404/410)',
  youtube_missing: 'Vídeo de YouTube no disponible',
  restricted: 'Protegida o restringida',
  server_error: 'Error temporal del servidor',
  timeout: 'Tiempo de espera agotado',
  network_error: 'Error de red, DNS, TLS o bloqueo',
  skipped: 'Dirección local o especial (no comprobada)'
};

function bookmarkAuditCategoryName(bookmark) {
  return getCategory(bookmark.categoryId)?.name || 'Sin categoría';
}

function isAuditDeletionCandidate(result) {
  return result.status === 'missing' || result.status === 'youtube_missing';
}

function youtubeVideoId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || '';
    if (!['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) return '';
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || '';
    const match = parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/);
    return match ? match[1] : '';
  } catch { return ''; }
}

function isPrivateAuditHost(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/\.$/, '');
  if (!host || /(?:^|\.)(?:localhost|local|lan|home|internal|onion)$/.test(host)) return true;
  if (host.includes(':')) {
    return !/^\[?[23][0-9a-f]{3}:/.test(host) || /^\[?2001:db8:/i.test(host);
  }
  if (!host.includes('.')) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const [a, b] = host.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && [0, 168].includes(b)) || (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0);
  }
  return false;
}

async function requestBookmarkAuditPermission() {
  const api = globalThis.browser || globalThis.chrome;
  if (!api?.permissions) return false;
  const origins = ['http://*/*', 'https://*/*'];
  try {
    if (await api.permissions.contains({ origins })) return true;
    return !!(await api.permissions.request({ origins }));
  } catch (error) {
    console.warn('No se pudo solicitar permiso para auditar enlaces.', error);
    return false;
  }
}

async function fetchAuditResponse(url, signal) {
  const response = await fetch(url, { method: 'GET', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'manual', signal });
  try { await response.body?.cancel(); } catch { /* El estado HTTP ya está disponible. */ }
  return response;
}

async function auditOneBookmark(bookmark, outerSignal) {
  let parsed;
  try { parsed = new URL(bookmark.url); } catch {
    return { bookmarkId: bookmark.id, name: bookmark.name, url: bookmark.url, category: bookmarkAuditCategoryName(bookmark), status: 'skipped', detail: 'Dirección no válida; se conserva para revisión manual', httpStatus: 0 };
  }
  const base = { bookmarkId: bookmark.id, name: bookmark.name, url: bookmark.url, category: bookmarkAuditCategoryName(bookmark), httpStatus: 0 };
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || isPrivateAuditHost(parsed.hostname)) {
    return { ...base, status: 'skipped', detail: 'Se conserva: dirección local, privada o especial' };
  }

  const controller = new AbortController();
  const onOuterAbort = () => controller.abort();
  outerSignal?.addEventListener('abort', onOuterAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const videoId = youtubeVideoId(bookmark.url);
    if (videoId) {
      const canonicalVideoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
      const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalVideoUrl)}&format=json`;
      const youtubeResponse = await fetchAuditResponse(oembed, controller.signal);
      if (youtubeResponse.ok) return { ...base, status: 'available', detail: 'Vídeo público disponible', httpStatus: youtubeResponse.status };
      if ([404, 410].includes(youtubeResponse.status)) return { ...base, status: 'youtube_missing', detail: `YouTube no encuentra el vídeo (${youtubeResponse.status})`, httpStatus: youtubeResponse.status };
      if ([401, 403, 429, 451].includes(youtubeResponse.status)) return { ...base, status: 'restricted', detail: `Vídeo privado, restringido o temporalmente bloqueado (${youtubeResponse.status})`, httpStatus: youtubeResponse.status };
    }

    const response = await fetchAuditResponse(bookmark.url, controller.signal);
    const code = response.status;
    if (response.type === 'opaqueredirect' || (code >= 300 && code < 400)) return { ...base, status: 'restricted', detail: 'Redirección no seguida automáticamente; revisa el destino manualmente', httpStatus: code };
    if (code >= 200 && code < 400) return { ...base, status: 'available', detail: response.redirected ? `Disponible; redirige a ${response.url}` : `HTTP ${code}`, httpStatus: code };
    if (code === 404 || code === 410) return { ...base, status: 'missing', detail: `HTTP ${code}`, httpStatus: code };
    if ([401, 403, 407, 418, 423, 429, 451].includes(code)) return { ...base, status: 'restricted', detail: `HTTP ${code}; puede requerir acceso, VPN o inicio de sesión`, httpStatus: code };
    if (code >= 500) return { ...base, status: 'server_error', detail: `HTTP ${code}; puede ser temporal`, httpStatus: code };
    return { ...base, status: 'restricted', detail: `HTTP ${code}; no se propone borrar`, httpStatus: code };
  } catch (error) {
    const timedOut = error?.name === 'AbortError' && !outerSignal?.aborted;
    return { ...base, status: timedOut ? 'timeout' : 'network_error', detail: timedOut ? 'No respondió en 10 segundos' : 'No se pudo conectar; puede ser DNS, TLS, ISP, VPN o red', httpStatus: 0 };
  } finally {
    clearTimeout(timer);
    outerSignal?.removeEventListener('abort', onOuterAbort);
  }
}

function downloadTextFile(text, filename, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBookmarkAuditReport(results) {
  const counts = Object.fromEntries(Object.keys(BOOKMARK_AUDIT_LABELS).map((key) => [key, results.filter((item) => item.status === key).length]));
  const lines = [
    '# Auditoría de favoritos de DashboardDP', '',
    `- Fecha: ${new Date().toLocaleString()}`,
    `- Favoritos revisados: ${results.length}`,
    `- Candidatos a revisión manual: ${(counts.missing || 0) + (counts.youtube_missing || 0)}`, '',
    '> Un error de red, DNS, TLS, bloqueo del proveedor, VPN, autenticación o tiempo de espera no demuestra que una web haya desaparecido. DashboardDP nunca los selecciona automáticamente para borrar.', ''
  ];
  Object.entries(BOOKMARK_AUDIT_LABELS).forEach(([status, label]) => lines.push(`- ${label}: ${counts[status] || 0}`));
  lines.push('', '## Detalle', '', '| Estado | Favorito | Categoría | Resultado | Dirección |', '|---|---|---|---|---|');
  results.forEach((item) => {
    const clean = (value) => String(value || '').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
    lines.push(`| ${clean(BOOKMARK_AUDIT_LABELS[item.status])} | ${clean(item.name)} | ${clean(item.category)} | ${clean(item.detail)} | ${clean(item.url)} |`);
  });
  downloadTextFile(lines.join('\n'), `dashboarddp-auditoria-favoritos-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown;charset=utf-8');
  toast('Informe de auditoría descargado', 'success');
}

function persistBookmarkAuditResults(results) {
  const checkedAt = Date.now();
  const byId = new Map(results.map((result) => [result.bookmarkId, result]));
  state.data.bookmarks.forEach((bookmark) => {
    const result = byId.get(bookmark.id);
    if (!result) return;
    bookmark.auditStatus = result.status;
    bookmark.auditDetail = result.detail || '';
    bookmark.auditHttpStatus = Number(result.httpStatus) || 0;
    bookmark.auditCheckedAt = checkedAt;
  });
  saveData();
  renderCurrentView();
}

async function deleteAuditedBookmarks(results, selectedIds) {
  const selected = new Set(selectedIds);
  const candidates = state.data.bookmarks.filter((bookmark) => selected.has(bookmark.id));
  const removed = [];
  const failed = [];
  for (const bookmark of candidates) {
    if (nativeWritesEnabled() && bookmark.sourceNativeId) {
      try { await removeDashboardBookmarkFromNative(bookmark); }
      catch (error) { failed.push(bookmark); console.warn('No se pudo borrar el marcador nativo auditado.', error); continue; }
    }
    removed.push(bookmark);
  }
  const removedIds = new Set(removed.map((bookmark) => bookmark.id));
  const memberships = bookmarkMemberships(removed.map((bookmark) => bookmark.id));
  const trashEntries = removed.map((bookmark) => addToTrash('bookmark', bookmark.name, { bookmark, membership: memberships[bookmark.id] }));
  state.data.bookmarks = state.data.bookmarks.filter((bookmark) => !removedIds.has(bookmark.id));
  state.data.quickGroups.forEach((group) => { group.bookmarkIds = group.bookmarkIds.filter((id) => !removedIds.has(id)); });
  state.data.workspaces.forEach((workspace) => { workspace.bookmarkIds = workspace.bookmarkIds.filter((id) => !removedIds.has(id)); });
  removed.forEach((bookmark) => addActivity('deleted', bookmark.name));
  saveData();
  renderAll();
  if (removed.length) {
    toast(`${removed.length} favoritos movidos a la Papelera${nativeWritesEnabled() ? ' y sincronizados con el navegador' : ''}.`, 'success');
    if (trashEntries.length === 1) notifyTrashEntry(trashEntries[0]);
  }
  if (failed.length) toast(`${failed.length} favoritos se conservaron porque falló la eliminación en el navegador`, 'error');
  return { removed, failed };
}

function confirmDeleteAuditedBookmarks(results, selectedIds) {
  const chosen = results.filter((item) => selectedIds.has(item.bookmarkId) && isAuditDeletionCandidate(item));
  if (!chosen.length) { toast('Selecciona al menos un favorito 404 o inexistente', 'info'); return; }
  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Confirmar eliminación' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: () => openBookmarkAudit(results) }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: `Vas a eliminar ${chosen.length} favoritos marcados como 404/410 o vídeo inexistente. Esta acción no se puede deshacer.` }),
    el('p', { class: 'form-hint', text: nativeWritesEnabled() ? 'La sincronización bidireccional está activa: también se eliminarán sus marcadores vinculados del navegador.' : 'La sincronización bidireccional no está activa: se borrarán de DashboardDP, pero podrían reaparecer en una importación o sincronización posterior.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(
    el('button', { class: 'btn', text: 'Volver', onclick: () => openBookmarkAudit(results) }),
    el('button', { class: 'btn secondary', html: ICONS.export + '<span>Exportar informe antes</span>', onclick: () => exportBookmarkAuditReport(results) }),
    el('button', { class: 'btn danger', html: ICONS.trash + `<span>Eliminar ${chosen.length}</span>`, onclick: async () => { const outcome = await deleteAuditedBookmarks(results, new Set(chosen.map((item) => item.bookmarkId))); openBookmarkAudit(results.filter((item) => !outcome.removed.some((bookmark) => bookmark.id === item.bookmarkId))); } })
  );
  modal.append(header, body, footer);
  openModal(modal);
}

function openBookmarkAudit(initialResults = null) {
  const modal = el('div', { class: 'modal bookmark-audit-modal', role: 'dialog', 'aria-labelledby': 'bookmarkAuditTitle' });
  const controller = new AbortController();
  let results = Array.isArray(initialResults) ? initialResults : [];
  let running = false;
  const selectedIds = new Set();
  const header = el('div', { class: 'modal-header' });
  const closeAudit = () => { controller.abort(); closeModal(); };
  header.append(el('h2', { class: 'modal-title', id: 'bookmarkAuditTitle', text: 'Auditoría de favoritos' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeAudit }));
  const body = el('div', { class: 'modal-body bookmark-audit-body' });
  const intro = el('div', { class: 'bookmark-audit-intro' });
  intro.append(
    el('p', { text: 'Comprueba el estado de tus favoritos directamente desde el navegador. Los resultados no salen de tu equipo.' }),
    el('p', { class: 'form-hint', text: 'Solo los 404/410 y los vídeos de YouTube confirmados como inexistentes se pueden seleccionar para borrar. «No concluyentes» no significa que el enlace esté caído: la comprobación no pudo decidirlo por bloqueo del ISP/VPN, DNS, TLS, permisos, red, servidor, tiempo de espera o dirección local/especial. Esos enlaces se conservan.' })
  );
  const progress = el('div', { class: 'bookmark-audit-progress hidden' });
  const progressBar = el('div', { class: 'bookmark-audit-progress-bar' });
  const progressFill = el('span');
  progressBar.appendChild(progressFill);
  const progressText = el('span', { text: '' });
  progress.append(progressBar, progressText);
  const controls = el('div', { class: 'bookmark-audit-controls hidden' });
  const search = el('input', { class: 'form-input', type: 'search', placeholder: 'Buscar por nombre, categoría o dirección…' });
  const filter = el('select', { class: 'form-select', 'aria-label': 'Filtrar resultados' });
  [['all', 'Todos los resultados'], ['deletable', 'Solo 404 o inexistentes'], ['available', 'Disponibles'], ['restricted', 'Protegidos o restringidos'], ['uncertain', 'Red, tiempo de espera o servidor'], ['skipped', 'Locales o especiales']].forEach(([value, label]) => filter.appendChild(el('option', { value, text: label })));
  const selectCandidates = el('button', { class: 'btn secondary', type: 'button', text: 'Seleccionar candidatos' });
  const clearSelection = el('button', { class: 'btn', type: 'button', text: 'Deseleccionar' });
  controls.append(search, filter, selectCandidates, clearSelection);
  const summary = el('div', { class: 'bookmark-audit-summary hidden' });
  const list = el('div', { class: 'bookmark-audit-list hidden' });
  const AUDIT_PAGE_SIZE = 160;
  let visibleResultLimit = AUDIT_PAGE_SIZE;
  const footer = el('div', { class: 'modal-footer' });
  const startButton = el('button', { class: 'btn primary', html: ICONS.search + `<span>Comprobar ${state.data.bookmarks.length} favoritos</span>` });
  const exportButton = el('button', { class: 'btn secondary hidden', html: ICONS.export + '<span>Exportar informe</span>', onclick: () => exportBookmarkAuditReport(results) });
  const deleteButton = el('button', { class: 'btn danger hidden', html: ICONS.trash + '<span>Eliminar seleccionados</span>', onclick: () => confirmDeleteAuditedBookmarks(results, selectedIds) });
  footer.append(el('button', { class: 'btn', text: 'Cerrar', onclick: closeAudit }), exportButton, deleteButton, startButton);

  const matchesFilter = (item) => {
    const mode = filter.value;
    if (mode === 'inconclusive') return !['available', 'missing', 'youtube_missing'].includes(item.status);
    if (mode === 'deletable') return isAuditDeletionCandidate(item);
    if (mode === 'uncertain') return ['network_error', 'timeout', 'server_error'].includes(item.status);
    if (mode !== 'all') return item.status === mode;
    return true;
  };
  const renderResults = () => {
    if (!filter.querySelector('option[value="inconclusive"]')) filter.appendChild(el('option', {value:'inconclusive',text:'Todos los no concluyentes'}));
    const counts = Object.fromEntries(Object.keys(BOOKMARK_AUDIT_LABELS).map((key) => [key, results.filter((item) => item.status === key).length]));
    summary.textContent = '';
    [['Comprobados', results.length, 'Enlaces que han recibido un resultado durante esta auditoría.'], ['Disponibles', counts.available || 0, 'La comprobación recibió una respuesta válida.'], ['404/no disponibles', (counts.missing || 0) + (counts.youtube_missing || 0), 'Enlaces confirmados como inexistentes; son los únicos candidatos a borrar.'], ['No concluyentes', results.length - (counts.available || 0) - (counts.missing || 0) - (counts.youtube_missing || 0), 'No se pudo determinar si existe: red, permisos, ISP/VPN, DNS, TLS, servidor, espera o dirección especial. No se borra.']].forEach(([label, value, description], index) => summary.appendChild(el('button', { type: 'button', class: 'bookmark-audit-stat', title: description, 'aria-pressed': String(filter.value === ['all','available','deletable','inconclusive'][index]), onclick: () => { filter.value = ['all','available','deletable','inconclusive'][index]; visibleResultLimit = AUDIT_PAGE_SIZE; renderResults(); }, 'aria-label': `${label}: ${description}` }, [el('strong', { text: String(value) }), el('span', { text: label })])));
    const query = search.value.trim().toLowerCase();
    const visible = results.filter((item) => matchesFilter(item) && (!query || `${item.name} ${item.url} ${item.category}`.toLowerCase().includes(query)));
    list.textContent = '';
    if (!visible.length) list.appendChild(el('p', { class: 'bookmark-audit-empty', text: 'No hay resultados con este filtro.' }));
    visible.slice(0, visibleResultLimit).forEach((item) => {
      const candidate = isAuditDeletionCandidate(item);
      const checkbox = el('input', { type: 'checkbox', checked: selectedIds.has(item.bookmarkId), disabled: !candidate, 'aria-label': `Seleccionar ${item.name}` });
      checkbox.addEventListener('change', () => { checkbox.checked ? selectedIds.add(item.bookmarkId) : selectedIds.delete(item.bookmarkId); updateDeleteButton(); });
      const copy = el('div', { class: 'bookmark-audit-copy' });
      copy.append(el('strong', { text: item.name || item.url }), el('span', { text: item.url }), el('small', { text: `${item.category} · ${item.detail}` }));
      const badge = el('span', { class: `bookmark-audit-badge ${candidate ? 'danger' : item.status}`, text: BOOKMARK_AUDIT_LABELS[item.status] });
      list.appendChild(el('label', { class: `bookmark-audit-row${candidate ? ' candidate' : ''}` }, [checkbox, copy, badge]));
    });
    if (visible.length > visibleResultLimit) {
      list.appendChild(el('button', { class: 'btn secondary bookmark-audit-more', type: 'button', text: `Mostrar ${Math.min(AUDIT_PAGE_SIZE, visible.length - visibleResultLimit)} resultados más (${visibleResultLimit} de ${visible.length})`, onclick: () => { visibleResultLimit += AUDIT_PAGE_SIZE; renderResults(); } }));
    }
    updateDeleteButton();
  };
  const updateDeleteButton = () => {
    deleteButton.classList.toggle('hidden', !results.length);
    deleteButton.disabled = selectedIds.size === 0;
    deleteButton.querySelector('span').textContent = `Eliminar seleccionados (${selectedIds.size})`;
  };
  search.addEventListener('input', () => { visibleResultLimit = AUDIT_PAGE_SIZE; renderResults(); });
  filter.addEventListener('change', () => { visibleResultLimit = AUDIT_PAGE_SIZE; renderResults(); });
  selectCandidates.addEventListener('click', () => { results.filter(isAuditDeletionCandidate).forEach((item) => selectedIds.add(item.bookmarkId)); renderResults(); });
  clearSelection.addEventListener('click', () => { selectedIds.clear(); renderResults(); });

  const showCompleted = () => {
    running = false;
    startButton.classList.add('hidden');
    progress.classList.add('hidden');
    controls.classList.remove('hidden');
    summary.classList.remove('hidden');
    list.classList.remove('hidden');
    exportButton.classList.remove('hidden');
    renderResults();
  };
  startButton.addEventListener('click', async () => {
    if (running) return;
    if (!await requestBookmarkAuditPermission()) { toast('Sin permiso para consultar las webs no se puede iniciar la auditoría', 'error'); return; }
    running = true;
    startButton.disabled = true;
    progress.classList.remove('hidden');
    intro.classList.add('hidden');
    const bookmarks = [...state.data.bookmarks];
    results = [];
    let nextIndex = 0;
    let completed = 0;
    const updateProgress = () => {
      progressFill.style.width = `${bookmarks.length ? (completed / bookmarks.length) * 100 : 100}%`;
      progressText.textContent = `${completed} de ${bookmarks.length}`;
    };
    const worker = async () => {
      while (nextIndex < bookmarks.length && !controller.signal.aborted) {
        const index = nextIndex++;
        results[index] = await auditOneBookmark(bookmarks[index], controller.signal);
        completed += 1;
        if (completed === bookmarks.length || completed % 6 === 0) updateProgress();
      }
    };
    await Promise.all(Array.from({ length: Math.min(6, Math.max(1, bookmarks.length)) }, worker));
    updateProgress();
    results = results.filter(Boolean);
    if (!controller.signal.aborted) {
      persistBookmarkAuditResults(results);
      showCompleted();
    }
  });
  if (results.length) showCompleted();
  body.append(intro, progress, controls, summary, list);
  modal.append(header, body, footer);
  openModal(modal);
}

function openBookmarkForm(id, prefill) {
  const editing = id ? getBookmark(id) : null;
  const pf = prefill || {};

  const modal = el('div', { class: 'modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: editing ? 'Editar favorito' : 'Nuevo favorito' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });

  const nameGroup = el('div', { class: 'form-group' });
  nameGroup.append(el('label', { class: 'form-label', for: 'bm-name', text: 'Nombre *' }));
  const nameInput = el('input', { class: 'form-input', id: 'bm-name', type: 'text', placeholder: 'Ej: GitHub', value: editing ? editing.name : (pf.name || '') });
  const nameError = el('span', { class: 'form-error', id: 'bm-name-error', text: 'El nombre es obligatorio' });
  nameGroup.append(nameInput, nameError);
  body.appendChild(nameGroup);

  const urlGroup = el('div', { class: 'form-group' });
  urlGroup.append(el('label', { class: 'form-label', for: 'bm-url', text: 'URL *' }));
  const urlInput = el('input', { class: 'form-input', id: 'bm-url', type: 'text', placeholder: 'https://ejemplo.com', value: editing ? editing.url : (pf.url || '') });
  const urlError = el('span', { class: 'form-error', id: 'bm-url-error', text: 'URL inválida' });
  urlGroup.append(urlInput, urlError);
  body.appendChild(urlGroup);

  const iconGroup = el('div', { class: 'form-group bookmark-icon-group' });
  iconGroup.appendChild(el('label', { class: 'form-label', text: 'Icono del favorito' }));
  let selectedIcon = editing?.iconUrl || null;
  const iconPreview = el('span', { class: 'bookmark-icon-preview' });
  const iconFile = el('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', hidden: '' });
  const iconActions = el('div', { class: 'bookmark-icon-actions' });
  const uploadIconBtn = el('button', { class: 'btn secondary compact', type: 'button', text: 'Subir imagen' });
  const resetIconBtn = el('button', { class: 'btn secondary compact', type: 'button', text: 'Usar icono de la web' });
  const iconHelp = el('span', { class: 'form-hint', text: 'Si no subes una imagen, se utiliza el favicon original de la web.' });
  const refreshIconPreview = () => {
    iconPreview.innerHTML = renderFavicon({ name: nameInput.value || 'Icono', url: urlInput.value, iconUrl: selectedIcon, color: null });
  };
  uploadIconBtn.addEventListener('click', () => iconFile.click());
  resetIconBtn.addEventListener('click', () => { selectedIcon = null; refreshIconPreview(); });
  iconFile.addEventListener('change', async () => {
    const file = iconFile.files && iconFile.files[0];
    if (!file) return;
    try {
      selectedIcon = await optimizeBookmarkIcon(file);
      refreshIconPreview();
      toast('Icono personalizado aplicado', 'success');
    } catch (error) {
      toast(error.message || 'No se pudo usar esa imagen', 'error');
    } finally {
      iconFile.value = '';
    }
  });
  nameInput.addEventListener('input', refreshIconPreview);
  urlInput.addEventListener('input', refreshIconPreview);
  iconActions.append(iconPreview, uploadIconBtn, resetIconBtn);
  iconGroup.append(iconActions, iconHelp, iconFile);
  body.appendChild(iconGroup);

  const descGroup = el('div', { class: 'form-group' });
  descGroup.append(el('label', { class: 'form-label', for: 'bm-desc', text: 'Descripción (opcional)' }));
  const descInput = el('textarea', { class: 'form-textarea', id: 'bm-desc', placeholder: 'Breve descripción…', text: editing ? editing.description || '' : '' });
  descGroup.appendChild(descInput);
  body.appendChild(descGroup);

  const tagsGroup = el('div', { class: 'form-group' });
  tagsGroup.append(el('label', { class: 'form-label', for: 'bm-tags', text: 'Etiquetas (separadas por comas)' }));
  const tagsInput = el('input', { class: 'form-input', id: 'bm-tags', type: 'text', placeholder: 'Ej.: trabajo, IA, pendiente', value: editing ? (editing.tags || []).join(', ') : (pf.tags || []).join(', ') });
  tagsGroup.appendChild(tagsInput);
  body.appendChild(tagsGroup);

  const statusGroup = el('div', { class: 'form-group' });
  statusGroup.append(el('label', { class: 'form-label', for: 'bm-status', text: 'Estado' }));
  const statusSelect = el('select', { class: 'form-select', id: 'bm-status' });
  statusSelect.append(el('option', { value: 'saved', text: 'Favorito guardado' }), el('option', { value: 'later', text: 'Guardar para después' }));
  statusSelect.value = editing ? editing.status || 'saved' : (pf.status || 'saved');
  statusGroup.appendChild(statusSelect);
  body.appendChild(statusGroup);

  const row = el('div', { class: 'form-row' });
  const catGroup = el('div', { class: 'form-group' });
  catGroup.append(el('label', { class: 'form-label', for: 'bm-cat', text: 'Categoría' }));
  const defaultCat = editing ? editing.categoryId : (pf.categoryId || (state.currentView === 'category' ? state.activeCategoryId : null));
  const catSelect = categoryOptionsEl(defaultCat);
  catSelect.id = 'bm-cat';
  catGroup.appendChild(catSelect);
  row.appendChild(catGroup);

  const colorGroup = el('div', { class: 'form-group' });
  colorGroup.append(el('label', { class: 'form-label', text: 'Color (opcional)' }));
  const colorControl = createBookmarkColorControl(editing?.color || null);
  colorGroup.appendChild(colorControl.element);
  row.appendChild(colorGroup);
  body.appendChild(row);

  const collections = el('div', { class: 'bookmark-collections' });
  const groupControl = el('details', { class: 'bookmark-collection-control' });
  groupControl.appendChild(el('summary', { text: 'Grupo de fijados' }));
  const groupSelect = el('select', { class: 'form-select' });
  groupSelect.appendChild(el('option', { value: '', text: 'Sin grupo fijado' }));
  state.data.quickGroups.slice().sort((a, b) => a.order - b.order).forEach((group) => groupSelect.appendChild(el('option', { value: group.id, text: group.name })));
  const currentGroup = editing ? getGroupOfBookmark(editing.id) : null;
  groupSelect.value = currentGroup ? currentGroup.id : '';
  groupControl.append(groupSelect, el('p', { class: 'form-hint', text: 'Un favorito puede pertenecer a un grupo de fijados. Al elegirlo, quedará fijado automáticamente.' }));

  const workspaceControl = el('details', { class: 'bookmark-collection-control' });
  workspaceControl.appendChild(el('summary', { text: 'Espacios de trabajo' }));
  const workspaceList = el('div', { class: 'bookmark-workspace-list' });
  const selectedWorkspaces = new Set(editing ? state.data.workspaces.filter((workspace) => workspace.bookmarkIds.includes(editing.id)).map((workspace) => workspace.id) : []);
  if (!state.data.workspaces.length) workspaceList.appendChild(el('p', { class: 'form-hint', text: 'Todavía no hay espacios de trabajo. Puedes crearlos desde la página de inicio.' }));
  state.data.workspaces.slice().sort((a, b) => a.order - b.order).forEach((workspace) => {
    const label = el('label', { class: 'bookmark-workspace-option' });
    const input = el('input', { type: 'checkbox', value: workspace.id });
    input.checked = selectedWorkspaces.has(workspace.id);
    input.addEventListener('change', () => { if (input.checked) selectedWorkspaces.add(workspace.id); else selectedWorkspaces.delete(workspace.id); });
    label.append(input, el('span', { class: 'category-item-dot', style: `background:${workspace.color}` }), el('span', { text: workspace.name }));
    workspaceList.appendChild(label);
  });
  workspaceControl.append(workspaceList, el('p', { class: 'form-hint', text: 'Un favorito puede incluirse en varios espacios de trabajo.' }));
  collections.append(groupControl, workspaceControl);
  body.appendChild(collections);

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', {
    class: 'btn primary',
    text: editing ? 'Guardar' : 'Añadir',
    onclick: () => {
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();
      const desc = descInput.value.trim();
      const tags = tagsInput.value.split(',').map((tag) => tag.trim()).filter(Boolean);
      const categoryId = catSelect.value;
      let valid = true;

      if (!name) {
        nameInput.classList.add('invalid');
        nameError.classList.add('visible');
        valid = false;
      } else {
        nameInput.classList.remove('invalid');
        nameError.classList.remove('visible');
      }

      const normalized = normalizeUrl(url);
      if (!url || !isValidUrl(normalized)) {
        urlInput.classList.add('invalid');
        urlError.classList.add('visible');
        valid = false;
      } else {
        urlInput.classList.remove('invalid');
        urlError.classList.remove('visible');
      }

      if (!valid) return;

      if (editing) {
        updateBookmark(editing.id, { name, url: normalized, description: desc, tags, status: statusSelect.value, categoryId, color: colorControl.value(), iconUrl: selectedIcon });
      } else {
        const created = addBookmark({ name, url: normalized, description: desc, tags, status: statusSelect.value, categoryId, color: colorControl.value(), iconUrl: selectedIcon });
        if (!created) return;
      }
      const savedId = editing ? editing.id : state.data.bookmarks[state.data.bookmarks.length - 1].id;
      state.data.quickGroups.forEach((group) => { group.bookmarkIds = group.bookmarkIds.filter((bookmarkId) => bookmarkId !== savedId); });
      if (groupSelect.value) {
        const group = getQuickGroup(groupSelect.value);
        if (group && !group.bookmarkIds.includes(savedId)) group.bookmarkIds.push(savedId);
        const bookmark = getBookmark(savedId);
        if (bookmark) bookmark.pinned = true;
      }
      state.data.workspaces.forEach((workspace) => {
        workspace.bookmarkIds = workspace.bookmarkIds.filter((bookmarkId) => bookmarkId !== savedId);
        if (selectedWorkspaces.has(workspace.id)) workspace.bookmarkIds.push(savedId);
      });
      saveData();
      renderAll();
      closeModal();
    }
  }));

  modal.append(header, body, footer);
  openModal(modal);

  refreshIconPreview();
  setTimeout(() => nameInput.focus(), 50);
}

function openCategoryForm(id, presetParentId) {
  const editing = id ? getCategory(id) : null;
  const excludedIds = editing ? getDescendantIds(editing.id) : [];

  const modal = el('div', { class: 'modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: editing ? 'Editar categoría' : 'Nueva categoría' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });

  const group = el('div', { class: 'form-group' });
  group.append(el('label', { class: 'form-label', for: 'cat-name', text: 'Nombre *' }));
  const nameInput = el('input', { class: 'form-input', id: 'cat-name', type: 'text', placeholder: 'Ej: Sistemas', value: editing ? editing.name : '' });
  const nameError = el('span', { class: 'form-error', text: 'El nombre es obligatorio' });
  group.append(nameInput, nameError);
  body.appendChild(group);

  const parentGroup = el('div', { class: 'form-group' });
  parentGroup.append(el('label', { class: 'form-label', for: 'cat-parent', text: 'Categoría padre' }));
  const parentSelect = el('select', { class: 'form-select', id: 'cat-parent' });
  const rootOpt = document.createElement('option');
  rootOpt.value = '';
  rootOpt.textContent = 'Ninguna (raíz)';
  parentSelect.appendChild(rootOpt);
  const walk = (cats, depth) => {
    cats.forEach((c) => {
      if (excludedIds.includes(c.id)) return;
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = (depth > 0 ? '— '.repeat(depth) : '') + c.name;
      parentSelect.appendChild(opt);
      const kids = getChildren(c.id);
      if (kids.length) walk(kids, depth + 1);
    });
  };
  walk(getChildren(null), 0);
  const defaultParent = editing ? editing.parentId : (presetParentId || null);
  parentSelect.value = defaultParent || '';
  parentGroup.appendChild(parentSelect);
  body.appendChild(parentGroup);

  const inheritanceGroup = el('div', { class: 'form-group category-inheritance' });
  const inheritLabel = el('label', { class: 'checkbox-label' });
  const inheritInput = el('input', { type: 'checkbox' });
  inheritInput.checked = editing ? !!editing.inheritColor : !!defaultParent;
  inheritLabel.append(inheritInput, el('span', { text: 'Usar el color de la categoría superior' }));
  const inheritHint = el('p', { class: 'form-hint', text: 'Al cambiar el color del padre, esta subcategoría y sus enlaces se actualizarán automáticamente.' });
  const updateInheritanceAvailability = () => {
    const hasParent = !!parentSelect.value;
    inheritInput.disabled = !hasParent;
    if (!hasParent) inheritInput.checked = false;
    inheritanceGroup.classList.toggle('disabled', !hasParent);
  };
  parentSelect.addEventListener('change', updateInheritanceAvailability);
  updateInheritanceAvailability();
  inheritanceGroup.append(inheritLabel, inheritHint);
  body.appendChild(inheritanceGroup);

  const colorGroup = el('div', { class: 'form-group' });
  colorGroup.append(el('label', { class: 'form-label', text: 'Color' }));
  const colorControl = createCategoryColorControl(editing?.color || 'theme');
  colorGroup.appendChild(colorControl.element);
  body.appendChild(colorGroup);

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', {
    class: 'btn primary',
    text: editing ? 'Guardar' : 'Crear',
    onclick: () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.classList.add('invalid');
        nameError.classList.add('visible');
        return;
      }
      if (editing) {
        updateCategory(editing.id, { name, parentId: parentSelect.value, color: colorControl.value(), inheritColor: inheritInput.checked });
      } else {
        addCategory(name, parentSelect.value, colorControl.value(), inheritInput.checked);
      }
      closeModal();
    }
  }));

  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => nameInput.focus(), 50);
}

function getDashboardExtensionVersion() {
  return String(globalThis.chrome?.runtime?.getManifest?.().version || '1.10.48');
}

function compareDashboardVersions(left, right) {
  const parse = (value) => String(value || '').trim().replace(/^v/i, '').split('-')[0].split('.').map((part) => Number.parseInt(part, 10) || 0).slice(0, 3);
  const a = parse(left);
  const b = parse(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  }
  return 0;
}

async function checkDashboardUpdate() {
  const currentVersion = getDashboardExtensionVersion();
  const api = getExtensionPermissionsApi();
  if (api) {
    try {
      // Se ejecuta directamente desde el botón para que Chromium conserve el gesto de usuario.
      const allowed = await api.permissions.request({ origins: ['https://api.github.com/*'] });
      if (!allowed) return { message: 'No se concedió permiso para consultar las versiones publicadas en GitHub.' };
    } catch {
      return { message: 'El navegador no pudo solicitar permiso para consultar actualizaciones.' };
    }
  }
  try {
    const response = await fetch('https://api.github.com/repos/PraenaDP/DashboardDP/releases/latest', {
      credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/vnd.github+json' }
    });
    if (response.status === 404) return { message: `Tienes DashboardDP ${currentVersion}. Aún no hay una versión publicada en GitHub.` };
    if (!response.ok) throw new Error('Respuesta no disponible');
    const release = await response.json();
    const latestVersion = String(release?.tag_name || release?.name || '').trim().replace(/^v/i, '');
    const releaseUrl = typeof release?.html_url === 'string' && /^https:\/\/github\.com\/PraenaDP\/DashboardDP\/releases\//.test(release.html_url)
      ? release.html_url
      : 'https://github.com/PraenaDP/DashboardDP/releases';
    if (!latestVersion) return { message: 'La última publicación de GitHub no tiene una versión válida.', releaseUrl };
    const comparison = compareDashboardVersions(latestVersion, currentVersion);
    if (comparison > 0) return { message: `Hay una actualización: ${latestVersion}. Tu versión actual es ${currentVersion}.`, releaseUrl, available: true };
    if (comparison < 0) return { message: `Tu versión ${currentVersion} es más reciente que la última Release publicada (${latestVersion}).`, releaseUrl };
    return { message: `DashboardDP está actualizado: versión ${currentVersion}.`, releaseUrl };
  } catch {
    return { message: 'No se pudo comprobar GitHub ahora. Comprueba tu conexión e inténtalo de nuevo.' };
  }
}

function openDashboardUpdateGuide(releaseUrl = 'https://github.com/PraenaDP/DashboardDP/releases') {
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'updateGuideTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'updateGuideTitle', text: 'Actualizar DashboardDP sin perder datos' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  const steps = el('ol');
  [
    'Desde Ajustes → Datos, descarga una Copia completa como medida de seguridad.',
    'Abre una terminal dentro de la carpeta clonada de DashboardDP y ejecuta: git pull --ff-only origin main.',
    'Si Git informa de cambios locales, detente y revísalos antes de actualizar; no fuerces ni descartes archivos a ciegas.',
    'Abre edge://extensions, chrome://extensions o brave://extensions y pulsa Recargar en DashboardDP.'
  ].forEach((step) => steps.appendChild(el('li', { text: step })));
  body.append(
    el('p', { text: `Tu versión actual es ${getDashboardExtensionVersion()}. Los favoritos, notas, tareas y ajustes se guardan en el almacenamiento local del navegador, no en la carpeta de la extensión.` }),
    steps,
    el('p', { class: 'form-hint', text: 'No uses «Cargar sin empaquetar» sobre una carpeta distinta para actualizar: crearías otra instalación. Si no usas Git, descarga el ZIP de una Release, sustituye los archivos en la misma carpeta y después pulsa Recargar.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(
    el('button', { class: 'btn', type: 'button', text: 'Cerrar', onclick: closeModal }),
    el('button', { class: 'btn secondary', type: 'button', html: ICONS.export + '<span>Abrir versiones en GitHub</span>', onclick: () => window.open(releaseUrl, '_blank', 'noopener') })
  );
  modal.append(header, body, footer);
  openModal(modal);
}

function openSettingsForm() {
  const modal = el('div', { class: 'modal settings-modal' });
  const backupShortcut = el('button', {class:'btn secondary',text:'Copia completa y restauración',onclick:openCompleteBackupPanel});
  modal.append(backupShortcut);
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: t('settings') }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });
  const settingsNav = el('nav', { class: 'settings-nav', 'aria-label': 'Secciones de ajustes' });
  const settingsSections = [
    ['Principal', 'settings-principal'],
    ['Aspecto', 'settings-appearance'],
    ['Búsqueda y sincronización', 'settings-search'],
    ['Datos', 'settings-data'],
    ['Ayuda', 'settings-info']
  ];
  const settingsPanels = {};
  const selectSettingsSection = (id) => {
    settingsNav.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.settingsTarget === id);
    });
    Object.entries(settingsPanels).forEach(([panelId, panel]) => {
      panel.classList.toggle('active', panelId === id);
    });
  };
  settingsSections.forEach(([label, id], index) => {
    settingsNav.appendChild(el('button', { type: 'button', class: index === 0 ? 'active' : '', text: label, onclick: () => {
      selectSettingsSection(id);
    }, 'data-settings-target': id }));
  });
  body.appendChild(settingsNav);
  settingsSections.forEach(([, id], index) => {
    const panel = el('section', { class: `settings-section${index === 0 ? ' active' : ''}`, id });
    settingsPanels[id] = panel;
    body.appendChild(panel);
  });
  const group1 = el('div', { class: 'form-group' });
  group1.append(el('label', { class: 'form-label', for: 'set-name', text: t('dashboardName') }));
  const nameInput = el('input', { class: 'form-input', id: 'set-name', type: 'text', value: state.data.settings.name || '' });
  group1.appendChild(nameInput);
  settingsPanels['settings-principal'].appendChild(group1);

  const group2 = el('div', { class: 'form-group' });
  group2.append(el('label', { class: 'form-label', for: 'set-greeting', text: t('yourName') }));
  const greetingInput = el('input', { class: 'form-input', id: 'set-greeting', type: 'text', value: state.data.settings.greeting || '' });
  group2.appendChild(greetingInput);
  settingsPanels['settings-principal'].appendChild(group2);

  const greetingDisplayGroup = el('div', { class: 'form-group' });
  const greetingVisibleInput = el('input', { type: 'checkbox', checked: state.data.settings.greetingVisible !== false });
  const greetingVisibleLabel = el('label', { class: 'settings-toggle-row' });
  greetingVisibleLabel.append(greetingVisibleInput, el('span', { class: 'settings-toggle-copy', html: '<strong>Mostrar saludo en Inicio</strong><span class="form-hint">Puedes ocultarlo por completo sin perder tu nombre configurado.</span>' }));
  const greetingFont = el('select', { class: 'form-select', 'aria-label': 'Tipografía del saludo' });
  [
    ['neon', 'Neon Love'],
    ['script', 'Neon Script'],
    ['hand', 'Handwriting'],
    ['serif', 'Serif elegante']
  ].forEach(([value, label]) => greetingFont.appendChild(el('option', { value, text: label, selected: (state.data.settings.greetingFont || 'neon') === value })));
  const greetingSize = el('input', { class: 'form-input', type: 'number', min: '14', max: '34', step: '1', value: String(Math.max(14, Math.min(34, Number(state.data.settings.greetingSize) || 19)),), 'aria-label': 'Tamaño del saludo' });
  greetingDisplayGroup.append(
    greetingVisibleLabel,
    el('label', { class: 'form-label', text: 'Tipografía del saludo' }), greetingFont,
    el('label', { class: 'form-label', text: 'Tamaño del saludo (px)' }), greetingSize
  );
  settingsPanels['settings-principal'].appendChild(greetingDisplayGroup);

  const groupLanguage = el('div', { class: 'form-group' });
  groupLanguage.append(el('label', { class: 'form-label', for: 'set-language', text: t('language') }));
  const languageSelect = el('select', { class: 'form-select', id: 'set-language' });
  LANGUAGES.forEach((language) => {
    const option = document.createElement('option');
    option.value = language.id;
    option.textContent = language.label;
    option.selected = language.id === getLanguage();
    languageSelect.appendChild(option);
  });
  groupLanguage.appendChild(languageSelect);
  settingsPanels['settings-principal'].appendChild(groupLanguage);

  const group3 = el('div', { class: 'form-group' });
  group3.append(el('label', { class: 'form-label', for: 'set-engine', text: t('searchEngine') }));
  const engineSelect = el('select', { class: 'form-select', id: 'set-engine' });
  APP.engines.forEach((e) => {
    const opt = document.createElement('option');
    opt.value = e.id;
    opt.textContent = e.name;
    if (e.id === (state.data.settings.webEngine || 'google')) opt.selected = true;
    engineSelect.appendChild(opt);
  });
  group3.appendChild(engineSelect);
  settingsPanels['settings-search'].appendChild(group3);

  const groupWebSuggestions = el('div', { class: 'form-group' });
  const webSuggestionsInput = el('input', { type: 'checkbox', checked: !!state.data.settings.webSuggestionsEnabled });
  const webSuggestionsLabel = el('label', { class: 'settings-toggle-row' });
  const webSuggestionsCopy = el('span', { class: 'settings-toggle-copy' });
  webSuggestionsCopy.append(
    el('strong', { text: t('webSuggestions') }),
    el('span', { class: 'form-hint', text: t('webSuggestionsHelp') })
  );
  webSuggestionsLabel.append(webSuggestionsInput, webSuggestionsCopy);
  groupWebSuggestions.append(webSuggestionsLabel);
  settingsPanels['settings-search'].appendChild(groupWebSuggestions);

  const groupCalendarSync = el('div', { class: 'form-group' });
  groupCalendarSync.append(el('label', { class: 'form-label', for: 'set-calendar-sync', text: t('calendarAutoSync') }));
  const calendarSyncSelect = el('select', { class: 'form-select', id: 'set-calendar-sync' });
  [0, 15, 30, 60].forEach((minutes) => {
    const option = document.createElement('option');
    option.value = String(minutes);
    option.textContent = minutes ? t('calendarEveryMinutes', { minutes }) : t('calendarAutoOff');
    option.selected = minutes === Number(state.data.settings.calendarAutoSyncMinutes ?? 30);
    calendarSyncSelect.appendChild(option);
  });
  groupCalendarSync.append(calendarSyncSelect, el('span', { class: 'form-hint', text: t('calendarAutoSyncHelp') }));
  settingsPanels['settings-search'].appendChild(groupCalendarSync);

  const groupA = el('div', { class: 'form-group' });
  groupA.append(el('label', { class: 'form-label', text: t('theme') }));
  const themeOptions = el('div', { class: 'theme-options' });
  const currentSkin = state.data.settings.skin || 'default';
  Object.keys(APP.themes).forEach((key) => {
    const t = APP.themes[key];
    const btn = el('button', {
      class: 'theme-option' + (key === currentSkin ? ' selected' : ''),
      'data-theme': key,
      type: 'button',
      html: '<span class="theme-swatch"></span><span>' + t.name + '</span>',
      onclick: () => {
        themeOptions.querySelectorAll('.theme-option').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.data.settings.skin = key;
        saveData();
        applySkin(key);
        renderAll();
        toast('Tema «' + t.name + '» activado', 'info');
      }
    });
    themeOptions.appendChild(btn);
  });
  groupA.appendChild(themeOptions);
  settingsPanels['settings-appearance'].appendChild(groupA);

  const groupW = el('div', { class: 'form-group' });
  groupW.append(el('label', { class: 'form-label', text: t('wallpaper') }));
  const wpPreview = el('div', { class: 'wallpaper-preview' + (state.data.wallpaper ? ' visible' : '') });
  if (state.data.wallpaper) wpPreview.style.backgroundImage = 'url("' + state.data.wallpaper + '")';
  const wpActions = el('div', { class: 'wallpaper-actions' });
  const wpInput = el('input', { type: 'file', accept: 'image/*', hidden: true });
  const wpUploadBtn = el('button', { class: 'btn secondary', type: 'button', html: ICONS.image + '<span>Subir imagen</span>', onclick: () => wpInput.click() });
  const wpRemoveBtn = el('button', { class: 'btn danger', type: 'button', html: ICONS.trash + '<span>Quitar fondo</span>', onclick: () => {
    state.data.wallpaper = null;
    delete state.data.wallpaperOpacity;
    saveData();
    applyWallpaper();
    wpPreview.classList.remove('visible');
    wpRemoveBtn.disabled = true;
    updateOpDisabled();
    toast('Fondo de pantalla eliminado', 'info');
  } });
  wpRemoveBtn.disabled = !state.data.wallpaper;
  wpInput.addEventListener('change', () => {
    const file = wpInput.files && wpInput.files[0];
    if (!file) return;
    processWallpaperFile(file, (dataUrl) => {
      state.data.wallpaper = dataUrl;
      saveData();
      applyWallpaper();
      wpPreview.style.backgroundImage = 'url("' + dataUrl + '")';
      wpPreview.classList.add('visible');
      wpRemoveBtn.disabled = false;
      updateOpDisabled();
      toast('Fondo de pantalla actualizado', 'success');
    });
    wpInput.value = '';
  });
  const wallpaperOpacity = state.data.wallpaperOpacity == null ? 100 : state.data.wallpaperOpacity;
  const opRow = el('div', { class: 'wallpaper-opacity-row' });
  const opRange = el('input', { type: 'range', min: '0', max: '100', value: String(Math.min(100, Math.max(0, wallpaperOpacity))), class: 'wallpaper-opacity-range', 'aria-label': 'Opacidad del fondo de pantalla' });
  const opValue = el('span', { class: 'wallpaper-opacity-value', text: opRange.value + '%' });
  const updateOpDisabled = () => {
    const has = !!state.data.wallpaper;
    opRange.disabled = !has;
    opValue.classList.toggle('dimmed', !has);
  };
  opRange.addEventListener('input', () => {
    state.data.wallpaperOpacity = Number(opRange.value);
    saveData();
    applyWallpaper();
    opValue.textContent = opRange.value + '%';
  });
  updateOpDisabled();
  opRow.append(opRange, opValue);
  wpActions.append(wpUploadBtn, wpRemoveBtn);
  groupW.append(wpPreview, opRow, wpActions, wpInput);
  settingsPanels['settings-appearance'].appendChild(groupW);

  const groupSidebarBehavior = el('div', { class: 'form-group' });
  const sidebarAutoRevealInput = el('input', { type: 'checkbox', checked: !!state.data.settings.sidebarAutoReveal });
  const sidebarAutoRevealLabel = el('label', { class: 'settings-toggle-row' });
  const sidebarAutoRevealCopy = el('span', { class: 'settings-toggle-copy' });
  sidebarAutoRevealCopy.append(el('strong', { text: t('sidebarAutoReveal') }), el('span', { class: 'form-hint', text: t('sidebarAutoRevealHelp') }));
  sidebarAutoRevealLabel.append(sidebarAutoRevealInput, sidebarAutoRevealCopy);
  groupSidebarBehavior.append(el('label', { class: 'form-label', text: t('sidebarBehavior') }), sidebarAutoRevealLabel);
  settingsPanels['settings-principal'].appendChild(groupSidebarBehavior);

  const groupInfo = el('div', { class: 'form-group' });
  const infoActions = el('div', { class: 'settings-info-actions' });
  infoActions.append(
    el('button', { class: 'btn secondary', type: 'button', text: 'Ayuda y guía de uso', onclick: openHelpModal }),
    el('button', { class: 'btn secondary', type: 'button', text: 'Acerca de DashboardDP', onclick: openAboutModal })
  );
  groupInfo.append(el('label', { class: 'form-label', text: 'Documentación y privacidad' }), infoActions);
  settingsPanels['settings-info'].appendChild(groupInfo);

  const groupUpdates = el('div', { class: 'form-group' });
  const updateStatus = el('span', { class: 'form-hint', text: `Versión instalada: ${getDashboardExtensionVersion()}. La comprobación no descarga ni modifica la extensión.` });
  const openReleaseButton = el('button', { class: 'btn primary hidden', type: 'button', html: ICONS.export + '<span>Abrir actualización</span>' });
  const checkUpdateButton = el('button', { class: 'btn secondary', type: 'button', html: ICONS.search + '<span>Comprobar actualizaciones</span>', onclick: async () => {
    checkUpdateButton.disabled = true;
    updateStatus.textContent = 'Consultando la última Release publicada…';
    const result = await checkDashboardUpdate();
    updateStatus.textContent = result.message;
    openReleaseButton.classList.toggle('hidden', !result.releaseUrl);
    if (result.releaseUrl) openReleaseButton.onclick = () => window.open(result.releaseUrl, '_blank', 'noopener');
    checkUpdateButton.disabled = false;
  } });
  const updateActions = el('div', { class: 'settings-info-actions' });
  updateActions.append(checkUpdateButton, openReleaseButton, el('button', { class: 'btn secondary', type: 'button', text: 'Cómo actualizar sin perder datos', onclick: () => { closeModal(); openDashboardUpdateGuide(); } }));
  groupUpdates.append(el('label', { class: 'form-label', text: 'Actualizaciones desde GitHub' }), updateStatus, updateActions);
  settingsPanels['settings-info'].appendChild(groupUpdates);

  const dataPanel = settingsPanels['settings-data'];
  dataPanel.classList.add('settings-data-panel');
  const createDataCard = (title, description, icon, actions, tone = '') => {
    const card = el('section', { class: `settings-data-card${tone ? ` ${tone}` : ''}` });
    const heading = el('div', { class: 'settings-data-card-heading' });
    heading.append(
      el('span', { class: 'settings-data-card-icon', html: icon }),
      el('div', { class: 'settings-data-card-copy' }, [
        el('h3', { text: title }),
        el('p', { text: description })
      ])
    );
    const actionList = el('div', { class: 'settings-data-actions' });
    actionList.append(...actions);
    card.append(heading, actionList);
    return card;
  };
  const dataButton = (icon, label, action, variant = 'secondary') => el('button', {
    class: `btn ${variant}`,
    type: 'button',
    html: icon + `<span>${label}</span>`,
    onclick: action
  });

  dataPanel.append(
    createDataCard(
      'Marcadores del navegador',
      'Importa, exporta y mantiene conectada tu biblioteca de favoritos.',
      ICONS.folder,
      [
        dataButton(ICONS.reset, 'Sincronizar con marcadores del navegador', openNativeBookmarkSyncSettings),
        dataButton(ICONS.import, 'Importar desde otro navegador', openBrowserImportAssistant),
        dataButton(ICONS.export, 'Exportar HTML (marcadores)', () => { closeModal(); exportHtml(); })
      ]
    ),
    createDataCard(
      'Copias completas y restauración',
      'El JSON completo conserva favoritos, categorías, fijados, grupos, espacios, widgets, notas, tareas, Papelera y ajustes. No incluye contraseñas, sesiones ni tokens OAuth.',
      ICONS.duplicate,
      [
        dataButton(ICONS.export, 'Crear copia completa (JSON)', () => { closeModal(); exportData(); }),
        dataButton(ICONS.import, 'Restaurar copia completa o importar favoritos', () => { els.importFile.click(); })
      ]
    ),
    createDataCard(
      'Revisión y mantenimiento',
      'Comprueba enlaces, revisa duplicados y detecta favoritos que conviene organizar.',
      ICONS.search,
      [
        dataButton(ICONS.trash, `Abrir Papelera${trashItems().length ? ` (${trashItems().length})` : ''}`, openTrash),
        dataButton(ICONS.search, 'Auditar disponibilidad de favoritos', openBookmarkAudit),
        dataButton(ICONS.search, 'Revisar biblioteca', () => { closeModal(); openLibraryReview(); })
      ]
    ),
    createDataCard(
      'Widgets guardados',
      'Gestiona tus widgets reutilizables y recupera los que ya no estén en la Barra Personal.',
      ICONS.duplicate,
      [dataButton(ICONS.duplicate, 'Abrir biblioteca de widgets', openWidgetLibrary)]
    ),
    createDataCard(
      'Zona de peligro',
      'Borrar los datos elimina el contenido guardado localmente. Descarga una copia primero.',
      ICONS.reset,
      [dataButton(ICONS.reset, 'Restablecer datos', () => { closeModal(); confirmReset(); }, 'danger')],
      'settings-data-card-danger'
    )
  );

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: t('cancel'), onclick: closeModal }));
  footer.append(el('button', {
    class: 'btn primary', text: t('save'),
    onclick: async () => {
      const suggestionsEnabled = webSuggestionsInput.checked;
      if (suggestionsEnabled && !await requestWebSuggestionPermission(engineSelect.value)) {
        webSuggestionsInput.checked = false;
        toast(t('webSuggestionsPermissionDenied', { engine: getEngine(engineSelect.value).name }), 'info');
      }
      state.data.settings.name = nameInput.value.trim() || APP.defaults.settings.name;
      state.data.settings.greeting = greetingInput.value.trim() || APP.defaults.settings.greeting;
      state.data.settings.greetingVisible = greetingVisibleInput.checked;
      state.data.settings.greetingFont = greetingFont.value;
      state.data.settings.greetingSize = Math.max(14, Math.min(34, Number(greetingSize.value) || 19));
      state.data.settings.language = languageSelect.value;
      state.data.settings.webEngine = engineSelect.value;
      state.data.settings.webSuggestionsEnabled = webSuggestionsInput.checked;
      state.data.settings.calendarAutoSyncMinutes = Number(calendarSyncSelect.value);
      const hadSidebarAutoReveal = !!state.data.settings.sidebarAutoReveal;
      state.data.settings.sidebarAutoReveal = sidebarAutoRevealInput.checked;
      if (sidebarAutoRevealInput.checked) setSidebarCollapsed(true, false);
      else if (hadSidebarAutoReveal) setSidebarCollapsed(false, false);
      saveData();
      scheduleCalendarAutoSync();
      applyInterfaceLanguage();
      els.webEngine.value = engineSelect.value;
      renderAll();
      closeModal();
      toast('Ajustes guardados', 'success');
    }
  }));

  modal.append(header, body, footer);
  openModal(modal);
}

function openHelpModal() {
  const modal = el('div', { class: 'modal help-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Ayuda y guía de uso' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: openSettingsForm }));
  const body = el('div', { class: 'modal-body help-body' });
  const topics = [
    { group: 'Primeros pasos', title: 'Cómo usar esta guía', intro: 'Esta ayuda es una referencia operativa: cada apartado indica dónde está el control, qué hace al pulsarlo y qué resultado debes esperar.', blocks: [
      ['Regla de lectura', 'Los nombres entre comillas corresponden al texto o a la leyenda del control en pantalla. Los botones de icono muestran su acción al pasar el ratón o al recibir foco con el teclado.', ['Selecciona una sección del árbol de la izquierda.', 'Lee primero el resultado esperado y después los pasos concretos.', 'Si un control requiere confirmación o permiso del navegador, la ventana lo indicará antes de cambiar datos.']],
      ['Distribución de la pantalla', 'La barra superior sirve para buscar en la web; la barra lateral izquierda organiza y encuentra favoritos; el centro muestra la sección seleccionada; la barra derecha contiene la Barra por Defecto o la Barra Personal.', ['Pulsa una entrada de Navegación para cambiar la vista central.', 'Pulsa el icono de engranaje de la parte superior para abrir Ajustes.', 'Usa el botón de menú para contraer o revelar la barra izquierda cuando necesites más espacio.']]
    ] },
    { group: 'Primeros pasos', title: 'Ajustes, pestañas y guardado', intro: 'Ajustes no es una página única: cada pestaña muestra solo su propio tipo de configuración.', blocks: [
      ['Abrir y cambiar de sección', 'En Ajustes, las pestañas Principal, Aspecto, Búsqueda y sincronización, Datos y Ayuda actúan como una navegación interna. Al pulsar una, el resto de sus campos se ocultan.', ['Pulsa el engranaje de la barra superior.', 'Pulsa el nombre de la pestaña que quieras configurar.', 'Cambia un control y guarda o confirma cuando el formulario muestre ese botón.']],
      ['Qué ocurre al cerrar', 'Los ajustes, la organización y los cambios de contenido se guardan en el almacenamiento local del navegador. Cerrar una ventana sin pulsar su acción de guardar no confirma los cambios que estaban solo en el formulario.', ['Usa el botón Guardar, Aplicar o Confirmar de cada diálogo antes de cerrarlo.', 'Usa la X o el botón Cerrar solo cuando no quieras modificar ese formulario.', 'Antes de restaurar o restablecer datos, descarga una Copia completa desde Datos.']]
    ] },
    { group: 'Favoritos', title: 'Crear, abrir y editar un favorito', intro: 'Un favorito puede tener nombre, URL, categoría, etiquetas, color, icono propio, estado, grupo fijado y espacios de trabajo.', blocks: [
      ['Añadir un favorito', 'El botón + abre el formulario de favorito. La dirección es necesaria para que DashboardDP pueda abrir y auditar la web.', ['Pulsa + en el lugar desde el que quieras crear el favorito.', 'Escribe un nombre y una dirección web válida.', 'Selecciona categoría, etiquetas y los destinos opcionales: fijado, grupo o espacio.', 'Pulsa Guardar para incorporarlo a la biblioteca.']],
      ['Abrir y administrar', 'Pulsar el área principal de una tarjeta, fila o icono abre la URL y actualiza su actividad. El menú de acciones no abre la web: sirve para editar, duplicar, mover a Para después o eliminar.', ['Haz clic en el nombre, tarjeta o icono para abrir el enlace.', 'Pulsa el menú de acciones del favorito para ver las operaciones disponibles.', 'Elige Editar para cambiar sus datos o Eliminar para pedir confirmación antes de quitarlo.']],
      ['Iconos y calidad', 'DashboardDP intenta usar primero la imagen de mayor resolución disponible en el almacén del navegador; si no existe, prueba el favicon de la web y después muestra iniciales. Un icono manual siempre tiene prioridad.', ['Pasa el ratón por un favorito en vista de iconos para ver nombre y URL.', 'Abre Editar si quieres sustituir el icono por una imagen propia.', 'Usa una imagen nítida cuadrada si la web no publica un favicon de calidad suficiente.']]
    ] },
    { group: 'Favoritos', title: 'Vistas, búsqueda y orden', intro: 'Las vistas cambian la presentación, no los datos. El orden seleccionado se guarda para que la lista reaparezca igual al volver.', blocks: [
      ['Cambiar la vista', 'Los controles de cuadrícula, lista e iconos están junto al título de los listados. La vista de iconos elimina etiquetas de categoría para mostrar únicamente accesos compactos.', ['Pulsa el icono de cuadrícula para tarjetas.', 'Pulsa el icono de lista para filas con más contexto.', 'Pulsa el icono de puntos para accesos compactos; pasa el ratón por ellos para leer la web.']],
      ['Ordenar el resultado', 'El selector de orden ofrece Personalizado, Nombre A–Z, Nombre Z–A, Uso mayor/menor y Acceso reciente/antiguo. Cada opción indica explícitamente el sentido.', ['Pulsa el selector situado junto a las vistas.', 'Elige el criterio y el sentido que necesites.', 'Elige Personalizado y arrastra elementos solo cuando la vista permita ordenar manualmente.']],
      ['Buscar y salir de un filtro', 'La búsqueda de favoritos está encima de Categorías. Busca por nombre, dominio, URL, etiqueta y ruta de categoría; sus resultados aparecen en el área central.', ['Escribe en Buscar favoritos.', 'Pulsa un resultado para abrirlo o cambia la vista para revisarlo.', 'Pulsa Limpiar búsqueda o elige una entrada de Navegación para volver al listado normal.']]
    ] },
    { group: 'Favoritos', title: 'Categorías, subcategorías y etiquetas', intro: 'Las categorías son jerárquicas y su color puede aplicarse a sus hijos y a los favoritos asociados.', blocks: [
      ['Crear y navegar', 'El botón + junto a Categorías abre la creación de categoría. Las flechas de una categoría expanden o contraen sus subcategorías; pulsar su nombre abre su contenido.', ['Pulsa + junto a Categorías para crear una categoría raíz o una subcategoría.', 'Elige una categoría padre, nombre y color.', 'Pulsa la flecha para expandir o contraer; pulsa el nombre para abrirla.']],
      ['Filtrar mediante una etiqueta', 'La etiqueta de categoría que acompaña a un favorito en tarjetas y lista es un botón. No abre la web: abre una lista con los enlaces de esa categoría.', ['Pulsa la etiqueta de categoría de una tarjeta o fila.', 'Comprueba el título del listado para confirmar el filtro activo.', 'Pulsa Limpiar búsqueda o selecciona otra sección para abandonar el filtro.']],
      ['Color e icono', 'El color elegido se refleja en la categoría y en los enlaces, salvo en grupos fijados, que conservan su propio color. La categoría no sustituye un icono manual del favorito.', ['Abre Editar categoría para cambiar color o jerarquía.', 'Activa la herencia de color si quieres que las subcategorías adopten el color padre.', 'Guarda y revisa el resultado en el listado central.']]
    ] },
    { group: 'Inicio', title: 'Fijados y grupos', intro: 'Inicio reúne los fijados sueltos y los grupos en una misma secuencia. Las carpetas de grupo no ocultan su identidad con favicons superpuestos.', blocks: [
      ['Crear y configurar un grupo', 'El botón de carpeta con + abre el formulario de grupo. Puedes elegir nombre, color e icono visual: carpeta, trabajo, nube, vídeo, música o cuadrícula.', ['En Inicio, busca Fijados y Grupos.', 'Pulsa el botón de crear grupo.', 'Escribe el nombre, elige color e icono y guarda.', 'Edita un favorito y asígnalo al grupo para incorporarlo.']],
      ['Abrir y editar contenido', 'Pulsar una carpeta muestra sus favoritos debajo de la fila de grupos. El botón de lápiz activa el Modo edición; el atajo E hace lo mismo cuando no estás escribiendo en un campo.', ['Pulsa una carpeta para desplegar o contraer su contenido.', 'Pulsa el lápiz para activar Modo edición; vuelve a pulsarlo para salir.', 'En modo edición, usa los controles visibles o arrastra los elementos.']],
      ['Orden personalizado', 'El selector de Fijados y Grupos permite Personalizado, Nombre A–Z, Nombre Z–A, Fecha reciente a antigua y Fecha antigua a reciente.', ['Elige Personalizado.', 'Arrastra iconos y carpetas para decidir su secuencia.', 'Suelta un favorito en el centro de una carpeta para incorporarlo al grupo; suéltalo en un borde para reordenarlo.', 'Elige otro criterio cuando quieras que DashboardDP calcule el orden automáticamente.']]
    ] },
    { group: 'Inicio', title: 'Espacios de trabajo', intro: 'Un espacio abre un conjunto de enlaces para cambiar de contexto rápidamente.', blocks: [
      ['Crear un espacio', 'El botón + del bloque Espacios de trabajo abre su formulario. El espacio no copia los favoritos: solo guarda qué favoritos abrir, junto con su nombre, color e icono.', ['Pulsa + en Espacios de trabajo.', 'Escribe nombre, elige color e icono y marca los favoritos incluidos.', 'Guarda el espacio.', 'Pulsa su tarjeta y confirma para abrir sus enlaces en pestañas separadas.']],
      ['Ordenar espacios', 'Los espacios tienen su propio selector de orden; no comparten configuración con Fijados y Grupos.', ['Pulsa el selector de Espacios de trabajo.', 'Elige Nombre A–Z, Nombre Z–A, Fecha reciente a antigua o Fecha antigua a reciente.', 'Para tu propia disposición, elige Personalizado y arrastra las tarjetas.']],
      ['Editar o eliminar', 'Cambiar o quitar un espacio no elimina los favoritos que contenía.', ['Abre la edición del espacio desde su control de lápiz.', 'Modifica enlaces, color o icono y guarda.', 'Usa Eliminar solo para borrar el contenedor del espacio.']]
    ] },
    { group: 'Importar y sincronizar', title: 'Copias, importación y restauración', intro: 'Las importaciones suman contenido. La restauración de copia completa reemplaza el estado actual después de darte la opción de protegerlo.', blocks: [
      ['Copia completa', 'La Copia completa JSON conserva favoritos, categorías, fijados, espacios, tareas, notas, widgets, Papelera y ajustes. Es la opción recomendada antes de migrar de equipo, importar de forma masiva o restablecer.', ['Abre Ajustes > Datos.', 'Pulsa Descargar copia completa.', 'Guarda el archivo JSON fuera de la carpeta de la extensión.', 'Usa Restaurar copia solo cuando quieras sustituir el estado local.']],
      ['Importar favoritos', 'La importación HTML o JSON de favoritos integra elementos en tu biblioteca sin borrar lo que ya existe. El asistente explica cómo exportar desde Brave, Chrome, Edge, Firefox, Vivaldi, Opera y otros.', ['Abre Ajustes > Datos.', 'Pulsa Importar desde otro navegador o selecciona un archivo HTML/JSON.', 'Elige el archivo que exportaste desde el otro navegador.', 'Revisa el resumen y confirma la integración.']],
      ['Exportar para otro navegador', 'Exportar HTML crea un archivo de marcadores convencional; no incluye tareas, notas, widgets ni ajustes.', ['Abre Ajustes > Datos.', 'Pulsa Exportar HTML (marcadores).', 'Importa ese archivo desde el gestor de marcadores del navegador de destino.']],
      ['Recuperar una eliminación', 'Las eliminaciones compatibles se mueven a la Papelera durante 30 días. El aviso posterior ofrece Deshacer durante nueve segundos; después puedes recuperar cada elemento desde Ajustes.', ['Después de eliminar, pulsa Deshacer en el aviso si todavía aparece.', 'Para recuperarlo más tarde, abre Ajustes > Datos > Revisión y mantenimiento.', 'Pulsa Abrir Papelera y localiza el elemento.', 'Pulsa Restaurar. Vaciar Papelera es la única acción definitiva y pide confirmación.']]
    ] },
    { group: 'Importar y sincronizar', title: 'Marcadores nativos y auditoría', intro: 'La sincronización funciona en el navegador donde instalaste DashboardDP. La auditoría se ejecuta solo cuando la inicias y no borra enlaces por sí sola.', blocks: [
      ['Organización de Datos', 'Datos agrupa acciones por su finalidad para evitar mezclar operaciones distintas: Marcadores del navegador reúne sincronización, importación y HTML; Copias y restauración protege y recupera el estado completo; Revisión y mantenimiento contiene auditoría y revisión; Widgets guardados abre tu biblioteca; Zona de peligro mantiene el restablecimiento separado.', ['Abre Ajustes > Datos.', 'Elige primero el bloque que describe lo que quieres hacer.', 'Pulsa la acción concreta dentro de ese bloque.', 'Antes de Restaurar o Restablecer, descarga una Copia completa.']],
      ['Sincronización bidireccional', 'Puedes vincular DashboardDP con una carpeta de marcadores nativos. Los cambios compatibles viajan en ambos sentidos después de configurar la carpeta y autorizar la escritura.', ['Abre Ajustes > Búsqueda y sincronización.', 'Selecciona la carpeta nativa de destino y activa la sincronización.', 'Pulsa sincronizar después de hacer cambios importantes o al detectar un cambio externo.', 'Si cambias de navegador o equipo, usa una Copia completa para trasladar tu biblioteca.']],
      ['Ejecutar una auditoría', 'Auditar disponibilidad de favoritos solicita permiso opcional para consultar direcciones HTTP/HTTPS y clasifica el último resultado de cada enlace. Para no ralentizar bibliotecas grandes revisa como máximo seis enlaces a la vez y muestra el informe en bloques de 160 resultados.', ['Abre Ajustes > Datos.', 'Pulsa Auditar disponibilidad de favoritos.', 'Pulsa Comprobar favoritos y espera a que termine.', 'Pulsa Mostrar resultados más si quieres cargar el siguiente bloque.', 'Pulsa Exportar informe si quieres guardar el resultado en Markdown.']],
      ['Leer y filtrar estados', 'En vista de tarjetas y lista, la insignia junto a la categoría muestra disponible, 404, vídeo de YouTube inexistente, protegido, servidor, espera, red o local/especial. Su leyenda incluye el detalle y la fecha.', ['Pasa el ratón por una insignia para leer el resultado.', 'Pulsa la insignia para filtrar todos los favoritos con ese mismo estado.', 'Pulsa Limpiar búsqueda o navega a otra sección para salir del filtro.']],
      ['Borrado seguro', 'Solo HTTP 404/410 y vídeos de YouTube confirmados como inexistentes se pueden seleccionar como candidatos. Bloqueos de ISP/VPN, DNS, TLS, autenticación, servidor, red y espera no prueban que una web haya desaparecido.', ['Revisa primero el informe o la lista de candidatos.', 'Marca manualmente solo los enlaces que quieres quitar.', 'Confirma moverlos a la Papelera.', 'Si falla el borrado nativo vinculado, DashboardDP conserva el favorito para no desincronizar bibliotecas.', 'Usa Ajustes > Datos > Papelera para restaurar un favorito que no querías quitar.']]
    ] },
    { group: 'Productividad', title: 'Tareas y calendario', intro: 'Tareas, recordatorios y calendarios son datos locales, salvo que conectes voluntariamente un proveedor externo.', blocks: [
      ['Tablero de tareas', 'El gestor usa columnas Por hacer, En curso y Hecho. Cada tarjeta admite prioridad, fecha, recordatorio, notas y orden.', ['Abre el Gestor de tareas desde su botón o el menú rápido.', 'Pulsa crear tarea y completa sus propiedades.', 'Arrastra una tarjeta a otra columna para cambiar su estado.', 'Usa las vistas de calendario para revisar fechas por mes, semana o agenda.']],
      ['Calendarios e ICS', 'Puedes importar varios archivos ICS sin borrar eventos existentes. Los calendarios de solo lectura sirven para consultar, no como destino de escritura.', ['Abre el calendario.', 'Usa Importar ICS y selecciona uno o varios archivos .ics extraídos del ZIP.', 'Elige el calendario de destino cuando crees o edites un evento.', 'Exporta ICS si necesitas trasladar eventos a otra aplicación.']],
      ['Google y Microsoft', 'Las conexiones son personales y opcionales. Requieren que configures tu propio cliente OAuth; DashboardDP no guarda contraseñas ni opera un servidor de calendario.', ['Abre Ajustes > Búsqueda y sincronización.', 'Sigue la guía de la conexión elegida y autoriza solo la cuenta que quieras usar.', 'Pulsa Sincronizar para enviar y recuperar cambios.', 'Si aparece un error de fecha, revisa que el evento tenga fecha y hora válidas antes de reintentarlo.']],
      ['Google Calendar: activar la API', 'Crear un Client ID OAuth no activa automáticamente Google Calendar API. Debes habilitarla una vez en el mismo proyecto de Google Cloud que creó ese Client ID.', ['Abre Google Cloud Console con la cuenta propietaria del proyecto OAuth.', 'Ve a APIs y servicios > Biblioteca, busca Google Calendar API y pulsa Habilitar.', 'Comprueba que el proyecto seleccionado es el mismo de tu Client ID y espera unos minutos.', 'Vuelve a DashboardDP y pulsa Sincronizar otra vez.', 'Si aparece «Google Calendar API has not been used in project…», la API está desactivada o se habilitó en otro proyecto.', 'Si aparece access_denied durante las pruebas, añade tu correo en Google Auth Platform > Audience como usuario de prueba.']]
    ] },
    { group: 'Productividad', title: 'Notas adhesivas y Markdown', intro: 'Una nota es de tipo Formato o Markdown. El tipo y su contenido fuente se conservan para que puedas reabrirla y seguir editando sin conversiones.', blocks: [
      ['Nota de Formato', 'Formato usa el editor visual y permite familia tipográfica, tamaño, color, negrita, cursiva, título, listas, imágenes y otros controles.', ['Crea o edita una nota.', 'Pulsa Formato.', 'Selecciona fuente y tamaño antes o después de escribir.', 'Guarda: la tarjeta y la edición en línea respetarán la tipografía elegida.']],
      ['Nota Markdown', 'Markdown conserva el texto que escribes. Vista previa interpreta títulos, listas, enlaces, imágenes, citas, código y tareas.', ['Crea o edita una nota y pulsa Markdown.', 'Escribe el texto fuente, por ejemplo # Título o - [ ] Tarea.', 'Pulsa Vista previa para comprobar el resultado sin convertir la nota.', 'Guarda y vuelve a abrir la nota: seguirá en Markdown.']],
      ['Tareas en Markdown', 'Las líneas - [ ] y - [x] se renderizan como casillas reales. Al marcarlas, el estado se guarda localmente y la tarea completada aparece tachada.', ['Abre la Vista previa o una nota visible Markdown.', 'Pulsa la casilla de la tarea.', 'Comprueba que el texto queda tachado.', 'Recarga el Dashboard: la casilla debe mantener su estado.']],
      ['Notas visibles', 'Activa Mostrar en mi barra personalizada para mostrar una nota en el bloque Notas visibles. Las notas visuales se pueden editar en línea y cambiar de altura con el tirador inferior; el lápiz abre el editor completo.', ['Edita una nota y activa Mostrar en mi barra personalizada.', 'En Barra Personal añade el bloque Notas visibles si aún no existe.', 'Pulsa MD en una tarjeta Markdown para abrir su fuente.', 'Pulsa el lápiz para cambiar formato, colores, imágenes o el tipo de nota.']]
    ] },
    { group: 'Paneles y widgets', title: 'Barras y vistas de panel', intro: 'Las medidas de las barras y las decisiones de vista se recuerdan entre sesiones.', blocks: [
      ['Redimensionar y ocultar', 'La barra izquierda y el panel derecho se ajustan arrastrando su borde. La izquierda puede revelarse al acercar el ratón; la derecha se puede ocultar o ampliar.', ['Coloca el cursor en el borde de la barra.', 'Arrastra hasta alcanzar el ancho deseado.', 'Pulsa el control de vista amplia del panel derecho para ocupar el ancho útil de la ventana.', 'Vuelve a pulsarlo para regresar sin perder el ancho lateral.']],
      ['Barra por Defecto y Barra Personal', 'La barra por Defecto muestra los bloques estándar. La Barra Personal permite una composición elegida por ti y no borra la configuración estándar.', ['Pulsa el control de cambio de barra en el panel derecho.', 'Elige Barra por Defecto o Barra Personal.', 'En Barra Personal pulsa + para añadir un bloque, hasta un máximo de nueve.', 'Usa los controles de cada bloque para moverlo, editarlo o quitarlo; quitarlo no borra sus datos.']],
      ['Vistas independientes', 'Vertical, cuadrícula y mosaico se guardan por separado para barra lateral y vista amplia. El mosaico manual conserva posiciones y tamaños en cada modo.', ['Elige una vista con sus botones de icono.', 'En mosaico, arrastra el tirador superior de un bloque para moverlo.', 'Arrastra la esquina inferior derecha para cambiar su tamaño.', 'Pulsa Restablecer mosaico, situado a la izquierda de las vistas, para reiniciar solo la composición actual.']]
    ] },
    { group: 'Paneles y widgets', title: 'Widgets, iframes y clima', intro: 'Los bloques embebidos se mantienen separados y solo admiten direcciones HTTPS.', blocks: [
      ['Añadir un iframe propio', 'Un iframe puede crearse desde una URL HTTPS o desde código iframe completo. DashboardDP extrae la dirección, título, ancho y alto para poder editarlo después y lo conserva automáticamente en tu Biblioteca de widgets.', ['Abre Barra Personal y pulsa +.', 'Elige Iframe propio.', 'Pega una URL HTTPS o el código iframe.', 'Configura título y tamaño, y guarda.']],
      ['Biblioteca de widgets', 'La Biblioteca de widgets guarda cada widget que creas aunque luego quites su bloque de la Barra Personal. Sirve para recuperar configuraciones anteriores, mantener versiones alternativas y copiar su código reutilizable.', ['En el selector Añadir bloque, pulsa Biblioteca de widgets para recuperar o crear un widget.', 'En Ajustes > Datos, pulsa Biblioteca de widgets para gestionarla en cualquier momento.', 'Pulsa Añadir a mi barra para recuperar una entrada, o Editar y Eliminar de la biblioteca para administrarla.', 'Quitar un bloque de la barra no borra su entrada guardada.']],
      ['Si un iframe aparece vacío', 'Algunos servicios impiden que su contenido se muestre dentro de otra página. Eso pertenece a la política del servicio, no a la configuración de DashboardDP.', ['Pulsa Abrir en una pestaña en el bloque si está disponible.', 'Confirma que la URL funciona fuera del iframe.', 'Sustituye el widget por otro servicio que permita incrustación si necesitas verlo dentro del panel.']],
      ['Clima', 'El widget del tiempo usa una localización elegida por ti; su icono se adapta al bloque para no ocupar una superficie desproporcionada.', ['Abre la configuración del widget del tiempo.', 'Introduce una ciudad o ubicación.', 'Guarda y espera a la siguiente actualización del widget.']]
    ] },
    { group: 'Personalización', title: 'Tema, fondo y saludo', intro: 'Estas opciones cambian el aspecto sin modificar favoritos, tareas ni notas.', blocks: [
      ['Tema y fondo', 'Aspecto reúne el tema, skin y fondo. Una imagen de fondo se combina con superficies translúcidas para conservar contraste y bordes redondeados.', ['Abre Ajustes > Aspecto.', 'Elige tema o skin.', 'Usa Subir imagen para seleccionar un fondo propio o Quitar fondo para volver al aspecto sin imagen.', 'Guarda los cambios y revisa contraste en las secciones que uses.']],
      ['Saludo de Inicio', 'El saludo Buenas días/tardes/noches es opcional. Puedes elegir fuente, incluidas Neon Love y alternativas similares, y su tamaño.', ['Abre Ajustes > Principal.', 'Activa o desactiva Mostrar saludo.', 'Elige la fuente en el selector.', 'Ajusta el tamaño y guarda; al desactivarlo también desaparece su espacio visual.']]
    ] },
    { group: 'Búsqueda y privacidad', title: 'Búsqueda web, permisos y datos', intro: 'DashboardDP guarda tu información en el navegador y solo realiza conexiones externas después de una acción o autorización tuya.', blocks: [
      ['Buscar en la web', 'La barra superior está disponible en todas las secciones. El selector permite Google, DuckDuckGo, Bing, Brave y YouTube.', ['Elige el motor en el selector.', 'Escribe la consulta.', 'Pulsa Buscar o Enter para abrir el resultado en el motor elegido.']],
      ['Sugerencias web', 'Las sugerencias son opcionales. Al activarlas, el texto se consulta directamente con el motor elegido mientras escribes; DashboardDP no crea un historial propio ni usa servidor propio.', ['Abre Ajustes > Búsqueda y sincronización.', 'Activa Sugerencias de búsqueda web.', 'Concede el permiso del motor si el navegador lo solicita.', 'Desactiva la opción en el mismo lugar si no quieres recibir sugerencias.']],
      ['Actualizaciones desde GitHub', 'DashboardDP puede consultar de forma voluntaria la última Release pública de GitHub. La comprobación nunca descarga ni sustituye archivos: el navegador protege la extensión contra actualizaciones automáticas no verificadas.', ['Abre Ajustes > Ayuda.', 'Pulsa Comprobar actualizaciones y concede solo el permiso para consultar api.github.com si el navegador lo pide.', 'Si existe una Release más reciente, descarga una Copia completa y abre una terminal dentro del clon de DashboardDP.', 'Ejecuta git pull --ff-only origin main y pulsa Recargar en la página de extensiones. Si Git detecta cambios locales, revísalos antes de continuar.']],
      ['Privacidad y resolución de problemas', 'Favoritos, notas, tareas, ajustes y widgets viven en el almacenamiento local del navegador. Borrar los datos de la extensión o usar Restablecer puede eliminarlos.', ['Descarga una Copia completa antes de una limpieza importante.', 'Recarga la extensión desde la página de extensiones si una modificación no aparece.', 'Si un calendario o iframe falla, revisa su guía o prueba abrir la dirección fuera del Dashboard.']]
    ] },
    { group: 'Búsqueda y privacidad', title: 'Apoyo voluntario', intro: 'DashboardDP puede mostrar un único enlace oficial de Ko-fi, siempre opcional y configurado por el autor de la versión publicada.', blocks: [
      ['Dónde aparece', 'Cuando el autor ha configurado un perfil oficial, el apoyo se muestra en Ajustes > Ayuda > Acerca de DashboardDP y de forma discreta en el pie. Si no aparece, la versión no tiene ningún enlace de donación activo.', ['Abre Ajustes y pulsa Ayuda.', 'Pulsa Acerca de DashboardDP.', 'Pulsa Abrir Ko-fi solo si quieres visitar el perfil del autor.']],
      ['Qué no hace', 'Una donación no desbloquea funciones, no instala contenido, no cambia permisos ni envía tus datos de DashboardDP. El botón abre Ko-fi en una pestaña externa.', ['No introduzcas datos de pago dentro de DashboardDP.', 'Verifica el perfil de Ko-fi antes de donar.', 'Cierra la pestaña externa si no deseas continuar.']]
    ] }
  ];
  topics.push({ group: 'Seguridad y recuperación', title: 'Importaciones y auditorías seguras', intro: 'La versión 1.10.48 refuerza la validación de copias y las conexiones externas.', blocks: [
    ['Restaurar una copia', 'Los identificadores de marcadores solo son válidos en su perfil de origen. Al restaurar una copia se eliminan esos vínculos, también de la Papelera, y se desactiva la escritura nativa.', ['Descarga una Copia completa antes del cambio.', 'Abre Ajustes > Datos > Copias y restauración y selecciona tu archivo.', 'Confirma la restauración.', 'Abre Marcadores del navegador, elige nuevamente la carpeta de destino y activa la escritura solo si lo deseas.', 'Renueva aparte tus conexiones de calendario.']],
    ['Archivos admitidos', 'Las importaciones se limitan a 25 MB. Se rechazan estructuras incorrectas, identificadores duplicados y categorías circulares. Los colores y las notas se sanean antes de mostrarlos.', ['Selecciona tu copia JSON o archivo HTML de marcadores.', 'Si aparece un error de estructura, conserva el original y revisa el archivo antes de volver a importar.', 'Una copia exportada contiene información personal; guárdala fuera del repositorio público.']],
    ['Resultados no concluyentes', 'Las direcciones privadas reconocidas se omiten. Las redirecciones no se siguen automáticamente para evitar saltos a la red local; aparecen como protegidas o restringidas. Un dominio puede resolver a una IP privada, por lo que esto no garantiza aislamiento de red.', ['Inicia la auditoría solo sobre favoritos de confianza.', 'Pasa el ratón sobre la insignia para conocer el motivo.', 'Si indica redirección, abre el favorito manualmente y comprueba el destino.', 'Mantén los enlaces con bloqueo de ISP, VPN, red o permisos; esos estados no demuestran que la página haya desaparecido.']]
  ] });
  const tree = el('aside', { class: 'help-tree', 'aria-label': 'Índice de ayuda' });
  const reader = el('article', { class: 'help-reader', tabindex: '0' });
  const groups = [...new Set(topics.map((topic) => topic.group))];
  const showTopic = (topic, button) => {
    tree.querySelectorAll('.help-topic').forEach((item) => item.classList.toggle('active', item === button));
    reader.textContent = '';
    reader.append(el('h2', { text: topic.title }));
    if (topic.intro) reader.append(el('p', { class: 'help-reader-intro', text: topic.intro }));
    topic.blocks.forEach(([heading, text, steps = []]) => {
      const section = el('section', { class: 'help-section' }, [el('h3', { text: heading }), el('p', { text })]);
      if (steps.length) {
        const list = el('ol', { class: 'help-steps' });
        steps.forEach((step) => list.appendChild(el('li', { text: step })));
        section.appendChild(list);
      }
      reader.appendChild(section);
    });
    reader.scrollTop = 0;
  };
  groups.forEach((group, index) => {
    const details = el('details', { class: 'help-tree-group', open: index === 0 ? '' : null });
    details.appendChild(el('summary', { text: group }));
    topics.filter((topic) => topic.group === group).forEach((topic) => {
      const button = el('button', { class: 'help-topic', type: 'button', text: topic.title, onclick: () => showTopic(topic, button) });
      details.appendChild(button);
      if (topic === topics[0]) setTimeout(() => showTopic(topic, button), 0);
    });
    tree.appendChild(details);
  });
  body.append(tree, reader);
  modal.append(header, body);
  openModal(modal);
}

function openAboutModal() {
  const modal = el('div', { class: 'modal about-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Acerca de DashboardDP' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: openSettingsForm }));
  const body = el('div', { class: 'modal-body about-body' });
  body.append(
    el('p', { class: 'about-version', text: `DashboardDP · extensión local · versión ${globalThis.chrome?.runtime?.getManifest?.().version || '1.8.2'}` }),
    el('section', { class: 'help-section' }, [el('h3', { text: 'Licencia y derechos' }), el('p', { text: 'Copyright © 2026 David (PraenaDP). DashboardDP se distribuye bajo GPL-3.0-only: puedes usarlo, estudiarlo, modificarlo y redistribuirlo, incluso comercialmente, siempre que las redistribuciones derivadas mantengan la misma licencia GPL y proporcionen su código fuente. Se entrega sin garantía.' })]),
    el('section', { class: 'help-section' }, [el('h3', { text: 'Privacidad y seguridad' }), el('p', { text: 'DashboardDP guarda sus datos en el navegador. No opera un servidor propio ni recibe tus favoritos, tareas, notas ni calendarios. Las integraciones externas solo se conectan cuando la persona las configura y autoriza con el proveedor correspondiente.' })]),
    el('section', { class: 'help-section' }, [el('h3', { text: 'Uso de widgets propios' }), el('p', { text: 'Los widgets iframe son enlaces elegidos por quien usa la extensión. Cada persona es responsable de revisar la procedencia y las condiciones del servicio que embeba.' })])
  );
  const supportUrl = getSupportUrl();
  if (supportUrl) {
    const supportSection = el('section', { class: 'help-section about-support-section' });
    supportSection.append(
      el('h3', { text: 'Apoyar DashboardDP' }),
      el('p', { text: 'DashboardDP es gratuito y se mantiene de forma independiente. Si te resulta útil y quieres colaborar con su continuidad, puedes invitar al autor a un café mediante Ko-fi. La donación es completamente voluntaria y no desbloquea ni limita ninguna función.' }),
      el('div', { class: 'about-support-actions' }, [
        el('a', { class: 'btn secondary', href: supportUrl, target: '_blank', rel: 'noopener noreferrer', text: 'Abrir Ko-fi' })
      ])
    );
    body.appendChild(supportSection);
  }
  modal.append(header, body);
  openModal(modal);
}

function openLibraryReview() {
  const byUrl = new Map();
  state.data.bookmarks.forEach((bookmark) => {
    const key = canonicalUrl(bookmark.url);
    byUrl.set(key, (byUrl.get(key) || 0) + 1);
  });
  const duplicates = [...byUrl.values()].filter((count) => count > 1).reduce((total, count) => total + count - 1, 0);
  const uncategorized = state.data.bookmarks.filter((bookmark) => !bookmark.categoryId).length;
  const pending = state.data.bookmarks.filter((bookmark) => bookmark.status === 'later').length;
  const unused = state.data.bookmarks.filter((bookmark) => !bookmark.lastAccess).length;
  const insecure = state.data.bookmarks.filter((bookmark) => /^http:\/\//i.test(bookmark.url)).length;
  const modal = el('div', { class: 'modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Revisar biblioteca' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  const items = [
    [`${duplicates} duplicados potenciales`, 'Se comparan URLs ignorando parámetros de seguimiento.'],
    [`${uncategorized} sin categoría`, 'Puedes clasificarlos desde el menú de cada favorito.'],
    [`${pending} para después`, 'Pendientes de revisar o convertir en favoritos permanentes.'],
    [`${unused} nunca abiertos desde el dashboard`, 'Útil para limpiar enlaces que ya no utilizas.'],
    [`${insecure} enlaces HTTP`, 'Conviene abrirlos y actualizar a HTTPS cuando esté disponible.']
  ];
  items.forEach(([title, description]) => {
    const row = el('div', { class: 'review-item' });
    row.append(el('strong', { text: title }), el('span', { text: description }));
    body.appendChild(row);
  });
  const recentActivity = state.data.activity.slice(-5).reverse();
  if (recentActivity.length) {
    body.appendChild(el('h3', { class: 'form-label', text: 'Actividad reciente' }));
    recentActivity.forEach((item) => {
      body.appendChild(el('div', { class: 'review-item', text: `${item.label} · ${new Date(item.at).toLocaleString('es-ES')}` }));
    });
  }
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cerrar', onclick: closeModal }), el('button', { class: 'btn primary', text: 'Ver pendientes', onclick: () => { closeModal(); selectNavView('later'); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

/* ============================================================
   COMMAND PALETTE (Ctrl+K)
   ============================================================ */

function openCommandPalette() {
  els.commandPalette.classList.remove('hidden');
  els.commandInput.value = '';
  state.commandIndex = 0;
  renderCommands();
  setTimeout(() => els.commandInput.focus(), 30);
}

function closeCommandPalette() {
  els.commandPalette.classList.add('hidden');
  els.searchInput.focus();
}

function collectCategoryCommands(cats, q, depth, prefix) {
  const commands = [];
  cats.forEach((cat) => {
    const label = (depth > 0 ? (prefix ? prefix + ' › ' : '') + cat.name : cat.name);
    if (!q || cat.name.toLowerCase().includes(q) || label.toLowerCase().includes(q)) {
      commands.push({
        type: 'category', id: cat.id, label, icon: ICONS.folder, kind: 'Categoría',
        action: () => { closeCommandPalette(); selectCategory(cat.id); }
      });
    }
    const kids = getChildren(cat.id);
    if (kids.length) {
      commands.push(...collectCategoryCommands(kids, q, depth + 1, depth === 0 ? cat.name : label));
    }
  });
  return commands;
}

function renderCommands() {
  const q = els.commandInput.value.toLowerCase().trim();
  els.commandList.textContent = '';
  state.commandIndex = 0;

  const commands = [];

  if (!q) {
    commands.push(
      { type: 'action', label: 'Nuevo favorito', icon: ICONS.plus, kind: 'Acción', action: () => { closeCommandPalette(); openBookmarkForm(); } },
      { type: 'action', label: 'Gestor de tareas', icon: ICONS.check, kind: 'Acción', action: () => { closeCommandPalette(); openTaskManager(); } },
      { type: 'action', label: 'Nueva categoría', icon: ICONS.folder, kind: 'Acción', action: () => { closeCommandPalette(); openCategoryForm(); } },
      { type: 'action', label: 'Nueva subcategoría', icon: ICONS.folder, kind: 'Acción', action: () => { closeCommandPalette(); openCategoryForm(null, state.currentView === 'category' ? state.activeCategoryId : null); } },
      { type: 'action', label: 'Ajustes', icon: ICONS.settings, kind: 'Acción', action: () => { closeCommandPalette(); openSettingsForm(); } },
      { type: 'action', label: 'Sincronizar con marcadores del navegador', icon: ICONS.reset, kind: 'Acción', action: () => { closeCommandPalette(); openNativeBookmarkSyncSettings(); } },
      { type: 'action', label: 'Descargar copia completa', icon: ICONS.export, kind: 'Acción', action: () => { closeCommandPalette(); exportData(); } },
      { type: 'action', label: 'Importar desde otro navegador', icon: ICONS.import, kind: 'Acción', action: () => { closeCommandPalette(); openBrowserImportAssistant(); } },
      { type: 'action', label: 'Restaurar copia o importar favoritos', icon: ICONS.import, kind: 'Acción', action: () => { closeCommandPalette(); els.importFile.click(); } },
      { type: 'action', label: state.editMode ? 'Desactivar modo edición' : 'Activar modo edición', icon: ICONS.edit, kind: 'Acción', action: () => { closeCommandPalette(); toggleEditMode(); } }
    );
  }

  commands.push(...collectCategoryCommands(getChildren(null), q, 0, ''));

  state.data.bookmarks.forEach((bookmark) => {
    const domain = getDomain(bookmark.url);
    const cat = getCategory(bookmark.categoryId);
    if (!q || bookmark.name.toLowerCase().includes(q) || domain.includes(q) || bookmark.url.toLowerCase().includes(q) || (cat && cat.name.toLowerCase().includes(q))) {
      commands.push({
        type: 'bookmark', id: bookmark.id, label: bookmark.name, icon: ICONS.link, kind: cat ? cat.name : 'Favorito',
        sub: domain, action: () => { closeCommandPalette(); openBookmark(bookmark.id); }
      });
    }
  });

  const hasActions = commands.length > 0;
  els.commandEmpty.classList.toggle('hidden', hasActions);

  commands.forEach((cmd, index) => {
    const item = el('li', {
      class: 'command-item' + (index === state.commandIndex ? ' selected' : ''),
      role: 'option',
      'aria-selected': index === state.commandIndex ? 'true' : 'false'
    });

    let iconHtml;
    if (cmd.type === 'bookmark') {
      const bm = getBookmark(cmd.id);
      iconHtml = `<span class="command-item-favicon">${bm ? renderFavicon(bm) : ''}</span>`;
    } else {
      iconHtml = `<span style="display:inline-flex;color:var(--primary-soft)">${cmd.icon}</span>`;
    }

    item.insertAdjacentHTML('beforeend', iconHtml);
    item.append(el('span', { class: 'command-item-name', text: cmd.label }));
    if (cmd.sub) item.append(el('span', { class: 'command-item-kind', text: cmd.sub }));
    else item.append(el('span', { class: 'command-item-kind', text: cmd.kind }));

    item.addEventListener('mouseenter', () => {
      state.commandIndex = index;
      updateCommandSelection();
    });
    item.addEventListener('click', () => cmd.action());

    els.commandList.appendChild(item);
  });
}

function updateCommandSelection() {
  els.commandList.querySelectorAll('.command-item').forEach((item, i) => {
    item.classList.toggle('selected', i === state.commandIndex);
    item.setAttribute('aria-selected', i === state.commandIndex ? 'true' : 'false');
  });
  const selected = els.commandList.querySelector('.command-item.selected');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
}

/* ============================================================
   MODO EDICIÓN
   ============================================================ */

function toggleEditMode() {
  state.editMode = !state.editMode;
  updateEditModeUI();
  renderCurrentView();
  toast(state.editMode ? 'Modo edición activado' : 'Modo edición desactivado', 'info');
}

function updateEditModeUI() {
  document.body.classList.toggle('edit-mode', state.editMode);
  if (els.quickEditModeBtn) {
    els.quickEditModeBtn.classList.toggle('active', state.editMode);
    els.quickEditModeBtn.setAttribute('aria-pressed', state.editMode ? 'true' : 'false');
    const label = `${t('editMode')} (E)`;
    els.quickEditModeBtn.setAttribute('aria-label', label);
    els.quickEditModeBtn.title = label;
  }
}

/* ============================================================
   TOASTS
   ============================================================ */

function toast(message, type = 'info', options = null) {
  const item = el('div', { class: `toast ${type}`, role: 'status' });
  const msg = el('span', { class: 'toast-message', text: message });
  const close = el('button', {
    class: 'toast-close', 'aria-label': 'Cerrar notificación',
    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    onclick: () => item.remove()
  });
  if (options?.action && typeof options.action === 'function') {
    const action = el('button', { class: 'toast-action', type: 'button', text: options.actionLabel || 'Deshacer', onclick: () => { item.remove(); options.action(); } });
    item.append(msg, action, close);
  } else {
    item.append(msg, close);
  }
  els.toastContainer.appendChild(item);
  setTimeout(() => item.remove(), Number(options?.duration) || 4000);
}

/* ============================================================
   RELOJ
   ============================================================ */

function initClock() {
  const timeEl = $('clock');
  const dateEl = $('date');

  function update() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit', hour12: false });
    dateEl.textContent = now.toLocaleDateString(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' });
    updateGreeting();
  }

  function updateGreeting() {
    const hour = new Date().getHours();
    const name = String(state.data?.settings?.greeting || '').trim();
    let saludo = t('morning');
    if (hour >= 12 && hour < 19) saludo = t('afternoon');
    else if (hour < 5 || hour >= 19) saludo = t('evening');
    const message = name ? `${saludo}, ${name}` : saludo;
    els.greeting.textContent = message;
    els.heroTitle.textContent = message;
    const context = els.heroTitle.closest('.home-context');
    if (context) {
      const settings = state.data?.settings || APP.defaults.settings;
      context.classList.toggle('hidden', settings.greetingVisible === false);
      context.dataset.greetingFont = settings.greetingFont || 'neon';
      context.style.setProperty('--greeting-size', `${Math.max(14, Math.min(34, Number(settings.greetingSize) || 19))}px`);
    }
  }

  refreshClock = update;
  update();
  setInterval(update, 1000);
}

/* ============================================================
   EVENTOS GLOBALES
   ============================================================ */

function setSidebarCollapsed(collapsed, persist = true) {
  els.sidebar.classList.toggle('collapsed', collapsed);
  els.sidebarToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  if (persist && state.data) {
    state.data.settings.sidebarCollapsed = collapsed;
    saveData();
  }
}

function getSidebarWidthBounds() {
  const maxByViewport = Math.max(280, window.innerWidth - 460);
  return { min: 210, max: Math.min(520, maxByViewport) };
}

function setSidebarWidth(width, persist = true) {
  if (!state.data) return;
  const { min, max } = getSidebarWidthBounds();
  const next = Math.round(Math.min(max, Math.max(min, Number(width) || APP.defaults.settings.sidebarWidth)));
  document.documentElement.style.setProperty('--sidebar-width', `${next}px`);
  if (els.sidebarResizer) {
    els.sidebarResizer.setAttribute('aria-valuemin', String(min));
    els.sidebarResizer.setAttribute('aria-valuemax', String(max));
    els.sidebarResizer.setAttribute('aria-valuenow', String(next));
    els.sidebarResizer.setAttribute('aria-label', t('resizeSidebar'));
    els.sidebarResizer.setAttribute('title', t('resizeSidebar'));
  }
  if (persist) {
    state.data.settings.sidebarWidth = next;
    saveData();
  }
}

function initSidebarResizer() {
  const handle = els.sidebarResizer;
  if (!handle) return;
  let startX = 0;
  let startWidth = 0;
  const finish = () => {
    if (!document.body.classList.contains('sidebar-resizing')) return;
    document.body.classList.remove('sidebar-resizing');
    setSidebarWidth(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')), true);
  };
  handle.addEventListener('pointerdown', (event) => {
    if (window.innerWidth <= 768 || els.sidebar.classList.contains('collapsed')) return;
    startX = event.clientX;
    startWidth = els.sidebar.getBoundingClientRect().width;
    document.body.classList.add('sidebar-resizing');
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', (event) => {
    if (!document.body.classList.contains('sidebar-resizing')) return;
    setSidebarWidth(startWidth + event.clientX - startX, false);
  });
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('keydown', (event) => {
    const { min, max } = getSidebarWidthBounds();
    const current = Number(state.data.settings.sidebarWidth) || APP.defaults.settings.sidebarWidth;
    if (event.key === 'ArrowLeft') { event.preventDefault(); setSidebarWidth(current - 16); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); setSidebarWidth(current + 16); }
    else if (event.key === 'Home') { event.preventDefault(); setSidebarWidth(min); }
    else if (event.key === 'End') { event.preventDefault(); setSidebarWidth(max); }
  });
}

function sidebarAutoRevealEnabled() {
  return !!state.data?.settings?.sidebarAutoReveal && window.innerWidth > 768 && window.matchMedia('(hover: hover)').matches;
}

function initSidebarAutoReveal() {
  let closeTimer = null;
  const cancelClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = null;
  };
  const closeSidebar = () => {
    cancelClose();
    closeTimer = setTimeout(() => {
      if (sidebarAutoRevealEnabled() && !document.body.classList.contains('sidebar-resizing')) setSidebarCollapsed(true, false);
    }, 380);
  };
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || !sidebarAutoRevealEnabled() || !els.sidebar.classList.contains('collapsed')) return;
    if (event.clientX <= 18) {
      cancelClose();
      setSidebarCollapsed(false, false);
    }
  });
  els.sidebar.addEventListener('pointerenter', cancelClose);
  els.sidebar.addEventListener('pointerleave', () => {
    if (sidebarAutoRevealEnabled() && !els.sidebar.classList.contains('collapsed')) closeSidebar();
  });
}

function setPanelCollapsed(collapsed, persist = true) {
  els.panel.classList.toggle('collapsed', collapsed);
  els.panelToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  if (els.panelResizer) els.panelResizer.classList.toggle('hidden', collapsed);
  if (collapsed && els.panel.classList.contains('expanded')) setPanelExpanded(false, persist);
  if (persist && state.data) {
    state.data.settings.panelCollapsed = collapsed;
    saveData();
  }
}

function panelExpandedAvailable() {
  return window.innerWidth > 860;
}

function setPanelExpanded(expanded, persist = true) {
  const next = !!expanded && panelExpandedAvailable() && !els.panel.classList.contains('collapsed');
  els.panel.classList.toggle('expanded', next);
  document.body.classList.toggle('panel-expanded', next);
  if (els.panelFullBtn) {
    const label = t(next ? 'restorePanel' : 'expandPanel');
    els.panelFullBtn.innerHTML = next ? ICONS.contract : ICONS.expand;
    els.panelFullBtn.title = label;
    els.panelFullBtn.setAttribute('aria-label', label);
    els.panelFullBtn.setAttribute('aria-pressed', String(next));
  }
  if (persist && state.data) {
    state.data.settings.panelExpanded = !!expanded;
    saveData();
  }
  // La vista amplia tiene su propia distribución; al cambiar entre ambas se vuelve
  // a dibujar siempre la barra personal para aplicar su elección guardada.
  if (state.data && getPanelMode() === 'custom') renderPanel();
  scheduleCustomPanelGridLayout();
}

function getPanelWidthBounds() {
  const maxByViewport = Math.max(320, window.innerWidth - 520);
  return { min: 260, max: Math.min(900, maxByViewport) };
}

function setPanelWidth(width, persist = true) {
  if (!state.data) return;
  const { min, max } = getPanelWidthBounds();
  const next = Math.round(Math.min(max, Math.max(min, Number(width) || APP.defaults.settings.panelWidth)));
  document.documentElement.style.setProperty('--panel-width', `${next}px`);
  if (els.panelResizer) {
    els.panelResizer.setAttribute('aria-valuemin', String(min));
    els.panelResizer.setAttribute('aria-valuemax', String(max));
    els.panelResizer.setAttribute('aria-valuenow', String(next));
  }
  if (persist) {
    state.data.settings.panelWidth = next;
    saveData();
  }
  scheduleCustomPanelGridLayout();
}

function initPanelResizer() {
  const handle = els.panelResizer;
  if (!handle) return;
  let startX = 0;
  let startWidth = 0;
  const finish = () => {
    if (!document.body.classList.contains('panel-resizing')) return;
    document.body.classList.remove('panel-resizing');
    setPanelWidth(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--panel-width')), true);
  };
  handle.addEventListener('pointerdown', (event) => {
    if (window.innerWidth <= 860 || els.panel.classList.contains('collapsed')) return;
    startX = event.clientX;
    startWidth = els.panel.getBoundingClientRect().width;
    document.body.classList.add('panel-resizing');
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', (event) => {
    if (!document.body.classList.contains('panel-resizing')) return;
    setPanelWidth(startWidth - (event.clientX - startX), false);
  });
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('keydown', (event) => {
    const { min, max } = getPanelWidthBounds();
    const current = Number(state.data.settings.panelWidth) || APP.defaults.settings.panelWidth;
    if (event.key === 'ArrowLeft') { event.preventDefault(); setPanelWidth(current + 16); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); setPanelWidth(current - 16); }
    else if (event.key === 'Home') { event.preventDefault(); setPanelWidth(min); }
    else if (event.key === 'End') { event.preventDefault(); setPanelWidth(max); }
  });
}

function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function initResponsive() {
  const PANEL_BREAKPOINT = 860;
  const SIDEBAR_BREAKPOINT = 768;
  let panelWasOpen = !els.panel.classList.contains('collapsed');
  let sidebarWasOpen = !els.sidebar.classList.contains('collapsed');

  function update() {
    const w = window.innerWidth;

    if (w > SIDEBAR_BREAKPOINT) setSidebarWidth(state.data.settings.sidebarWidth, false);
    if (w > PANEL_BREAKPOINT) {
      setPanelWidth(state.data.settings.panelWidth, false);
      if (!els.panel.classList.contains('collapsed')) setPanelExpanded(!!state.data.settings.panelExpanded, false);
    } else if (els.panel.classList.contains('expanded')) {
      setPanelExpanded(false, false);
    }

    if (w <= PANEL_BREAKPOINT) {
      if (!els.panel.classList.contains('collapsed')) {
        panelWasOpen = true;
        setPanelCollapsed(true, false);
      }
    } else if (panelWasOpen && els.panel.classList.contains('collapsed')) {
      setPanelCollapsed(false, false);
      panelWasOpen = false;
      if (state.data.settings.panelExpanded) setPanelExpanded(true, false);
    }

    if (w <= SIDEBAR_BREAKPOINT) {
      if (!els.sidebar.classList.contains('collapsed')) {
        sidebarWasOpen = true;
        setSidebarCollapsed(true, false);
      }
    } else if (sidebarWasOpen && els.sidebar.classList.contains('collapsed')) {
      setSidebarCollapsed(false, false);
      sidebarWasOpen = false;
    }
  }

  update();
  window.addEventListener('resize', debounce(update, 150));
}

function bindEvents() {
  els.sidebarToggle.addEventListener('click', () => {
    setSidebarCollapsed(!els.sidebar.classList.contains('collapsed'));
  });
  initSidebarResizer();
  initSidebarAutoReveal();

  els.panelToggle.addEventListener('click', () => {
    setPanelCollapsed(!els.panel.classList.contains('collapsed'));
  });
  els.panelModeBtn.addEventListener('click', toggleCustomPanelMode);
  els.panelLayoutBtn.addEventListener('click', togglePanelCustomLayout);
  els.panelResetLayoutBtn?.addEventListener('click', resetPanelManualLayout);
  els.panelFullBtn.addEventListener('click', () => setPanelExpanded(!els.panel.classList.contains('expanded')));
  initPanelResizer();

  els.sidebar.querySelectorAll('.sidebar-item[data-view]').forEach((item) => {
    item.addEventListener('click', () => {
      els.sidebar.querySelectorAll('.sidebar-item').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      selectNavView(item.dataset.view);
    });
  });

  els.searchInput.addEventListener('input', () => {
    state.auditStatusFilter = null;
    state.searchQuery = els.searchInput.value;
    renderCurrentView();
  });

  els.searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    if (!state.searchQuery.trim()) return;
    const items = els.bookmarksGrid.querySelectorAll('.bookmark-card, .bookmark-row, .icon-item');
    if (items.length && !els.bookmarksGrid.classList.contains('hidden')) {
      e.preventDefault();
      items[0].focus();
    }
  });

  els.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.searchQuery.trim()) return;
    if (els.bookmarksGrid.classList.contains('hidden')) return;
    const first = els.bookmarksGrid.querySelector('.bookmark-card, .bookmark-row, .icon-item');
    if (first) openBookmark(first.dataset.id);
  });

  els.viewMode.querySelectorAll('.segmented-btn').forEach((btn) => {
    btn.addEventListener('click', () => setViewMode(btn.dataset.mode));
  });

  els.quickViewMode.querySelectorAll('.segmented-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.quickViewMode = btn.dataset.mode;
      state.data.settings.quickViewMode = state.quickViewMode;
      saveData();
      els.quickViewMode.querySelectorAll('.segmented-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === state.quickViewMode));
      renderQuickAccess();
    });
  });

  els.quickSortMode?.addEventListener('change', () => {
    state.data.settings.quickSortMode = HOME_SORT_MODES.includes(els.quickSortMode.value) ? els.quickSortMode.value : 'custom';
    saveData();
    renderQuickAccess();
  });

  els.workspaceSortMode?.addEventListener('change', () => {
    state.data.settings.workspaceSortMode = HOME_SORT_MODES.includes(els.workspaceSortMode.value) ? els.workspaceSortMode.value : 'custom';
    saveData();
    renderWorkspaces();
  });

  els.addQuickGroupBtn.addEventListener('click', () => openQuickGroupForm());
  els.quickEditModeBtn?.addEventListener('click', toggleEditMode);
  els.addWorkspaceBtn.addEventListener('click', () => openWorkspaceForm());

  els.sortMode.addEventListener('change', () => {
    state.sortMode = els.sortMode.value;
    state.data.settings.sortMode = state.sortMode;
    saveData();
    renderCurrentView();
  });

  els.addBookmarkBtn.addEventListener('click', () => openBookmarkForm());
  els.emptyAddBtn.addEventListener('click', () => openBookmarkForm());
  els.clearSearchBtn.addEventListener('click', () => {
    els.searchInput.value = '';
    state.searchQuery = '';
    state.auditStatusFilter = null;
    renderCurrentView();
    els.searchInput.focus();
  });
  els.addCategoryBtn.addEventListener('click', () => openCategoryForm(null, null));
  els.collapseAllBtn.addEventListener('click', toggleAllCategories);
  els.sortCategoriesBtn?.addEventListener('click', () => {
    state.data.settings.categorySort = state.data.settings.categorySort === 'name' ? 'custom' : 'name';
    saveData();
    renderSidebar();
    const alphabetical = state.data.settings.categorySort === 'name';
    els.sortCategoriesBtn.title = alphabetical ? 'Usar orden personalizado' : 'Ordenar categorías alfabéticamente';
    els.sortCategoriesBtn.setAttribute('aria-label', els.sortCategoriesBtn.title);
    els.sortCategoriesBtn.classList.toggle('active', alphabetical);
  });
  els.calendarSyncBtn.addEventListener('click', handleTopbarCalendarSync);
  els.settingsBtn.addEventListener('click', openSettingsForm);

  els.themeToggle.addEventListener('click', () => {
    const current = state.data.settings.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    state.data.settings.theme = next;
    saveData();
    applyTheme(next);
    renderAll();
    toast(next === 'light' ? 'Modo claro activado' : 'Modo oscuro activado', 'info');
  });

  els.importFile.addEventListener('change', handleImportFile);

  els.modalOverlay.addEventListener('pointerdown', (e) => {
    modalBackdropPressStarted = e.target === els.modalOverlay;
  });

  els.modalOverlay.addEventListener('click', (e) => {
    const intentionalBackdropClick = modalBackdropPressStarted && e.target === els.modalOverlay;
    modalBackdropPressStarted = false;
    if (intentionalBackdropClick) closeModal();
  });

  els.modalOverlay.addEventListener('pointercancel', () => {
    modalBackdropPressStarted = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!els.commandPalette.classList.contains('hidden')) closeCommandPalette();
      else if (!els.modalOverlay.classList.contains('hidden')) closeModal();
    }
  });

  els.commandInput.addEventListener('input', renderCommands);
  els.commandInput.addEventListener('keydown', handleCommandKeys);

  els.bookmarksGrid.addEventListener('keydown', handleGridArrows);

  // La leyenda pertenece al icono, no al contenedor concreto que lo muestra.
  // Así funciona igual en Inicio, Fijados, grupos desplegados, categorías,
  // Recientes, Más usados y resultados de búsqueda.
  document.addEventListener('pointermove', (e) => {
    const item = tooltipIconFromEventTarget(e.target);
    if (item) showIconTooltip(item, e.clientX, e.clientY);
    else hideTooltip();
  });
  document.addEventListener('pointerout', (e) => {
    const item = tooltipIconFromEventTarget(e.target);
    const nextTarget = e.relatedTarget;
    if (item && (!(nextTarget instanceof Node) || !item.contains(nextTarget))) hideTooltip();
  });
  document.addEventListener('focusin', (e) => {
    const item = tooltipIconFromEventTarget(e.target);
    if (!item) return;
    const rect = item.getBoundingClientRect();
    showIconTooltip(item, rect.left + rect.width / 2, rect.bottom);
  });
  document.addEventListener('focusout', (e) => {
    if (tooltipIconFromEventTarget(e.target)) hideTooltip();
  });
  document.addEventListener('scroll', hideTooltip, true);
}

function handleGridArrows(e) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const items = Array.from(els.bookmarksGrid.querySelectorAll('.bookmark-card, .bookmark-row, .icon-item'));
  if (!items.length || !items.includes(document.activeElement)) return;
  e.preventDefault();
  const dx = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
  const dy = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
  moveResultFocus(items, dx, dy);
}

function moveResultFocus(items, dx, dy) {
  const index = items.indexOf(document.activeElement);
  const from = index >= 0 ? index : 0;
  const rect = items[from].getBoundingClientRect();
  const eps = 3;
  const candidates = items
    .map((item, i) => ({ item, i, r: item.getBoundingClientRect() }))
    .filter(({ r }) => {
      if (dy !== 0) {
        const colAligned = Math.abs(r.left - rect.left) <= eps;
        const rowDiff = r.top - rect.top;
        return colAligned && (dy > 0 ? rowDiff > eps : rowDiff < -eps);
      }
      if (dx !== 0) {
        const rowAligned = Math.abs(r.top - rect.top) <= eps;
        const colDiff = r.left - rect.left;
        return rowAligned && (dx > 0 ? colDiff > eps : colDiff < -eps);
      }
      return false;
    });
  if (!candidates.length) return;
  candidates.sort((a, b) => {
    if (dy !== 0) return Math.abs(a.r.top - rect.top) - Math.abs(b.r.top - rect.top);
    return Math.abs(a.r.left - rect.left) - Math.abs(b.r.left - rect.left);
  });
  candidates[0].item.focus();
}

function setViewMode(mode) {
  state.viewMode = mode;
  state.data.settings.viewMode = mode;
  saveData();
  els.viewMode.querySelectorAll('.segmented-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  renderCurrentView();
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) { e.target.value = ''; toast('El archivo supera el límite de importación de 25 MB.', 'error'); return; }
  e.target.value = '';
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    readBrowserBookmarkFile(file);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => importData(String(reader.result || ''), file.name);
  reader.onerror = () => toast('No se pudo leer el archivo', 'error');
  reader.readAsText(file);
}

function parseBrowserBookmarks(text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const rootDL = doc.querySelector('dl');
  if (!rootDL) return null;

  const cats = [];
  const bms = [];

  const walk = (dlEl, parentRef) => {
    let bmOrder = 0;
    let catOrder = 0;
    Array.from(dlEl.children).forEach((dt) => {
      if (!dt || dt.tagName !== 'DT') return;

      const h3 = dt.querySelector('h3');
      if (h3) {
        const name = (h3.textContent || '').trim() || 'Sin nombre';
        const cat = { name, parentRef, order: catOrder++ };
        cats.push(cat);
        const siblingDL = dt.nextElementSibling && dt.nextElementSibling.tagName === 'DL'
          ? dt.nextElementSibling
          : dt.querySelector(':scope > dl');
        if (siblingDL) walk(siblingDL, cat);
        return;
      }

      const a = dt.querySelector('a');
      if (a) {
        const url = (a.getAttribute('href') || '').trim();
        if (!url || !isValidUrl(url)) return;
        const name = (a.textContent || '').trim() || getDomain(url);
        bms.push({ name, url, parentRef, order: bmOrder++ });
      }
    });
  };

  walk(rootDL, null);

  if (cats.length === 0 && bms.length === 0) return null;

  const origToId = new Map();
  const finalCats = cats.map((c, i) => {
    const id = uid();
    origToId.set(c, id);
    return {
      id,
      name: c.name,
      parentId: null,
      color: 'theme',
      inheritColor: !!c.parentRef,
      createdAt: Date.now(),
      order: c.order,
      collapsed: c.parentRef ? true : false
    };
  });
  finalCats.forEach((fc) => {
    const orig = cats.find((c) => origToId.get(c) === fc.id);
    if (orig && orig.parentRef && origToId.has(orig.parentRef)) {
      fc.parentId = origToId.get(orig.parentRef);
    }
  });

  const finalBms = bms.map((b) => ({
    id: uid(),
    name: b.name,
    url: b.url,
    description: '',
    tags: [],
    status: 'saved',
    categoryId: b.parentRef && origToId.has(b.parentRef) ? origToId.get(b.parentRef) : null,
    color: null,
    iconUrl: null,
    pinned: false,
    useCount: 0,
    lastAccess: 0,
    createdAt: Date.now(),
    order: b.order
  }));

  return pruneEmptyCategories(finalCats, finalBms);
}

function pruneEmptyCategories(cats, bms) {
  const used = new Set(bms.map((b) => b.categoryId).filter(Boolean));
  const hasChildren = new Set();
  cats.forEach((c) => { if (c.parentId) hasChildren.add(c.parentId); });
  const keep = cats.filter((c) => used.has(c.id) || hasChildren.has(c.id));
  const kept = new Set(keep.map((c) => c.id));
  keep.forEach((c) => { if (c.parentId && !kept.has(c.parentId)) c.parentId = null; });
  return { categories: keep, bookmarks: bms };
}

function groupBrowserBookmarks(parsed, browserName) {
  const root = {
    id: uid(),
    name: `Importado · ${browserName}`,
    parentId: null,
    color: 'theme',
    inheritColor: false,
    createdAt: Date.now(),
    order: 0,
    collapsed: false
  };
  parsed.categories.forEach((category) => {
    if (!category.parentId) category.parentId = root.id;
  });
  parsed.bookmarks.forEach((bookmark) => {
    if (!bookmark.categoryId) bookmark.categoryId = root.id;
  });
  parsed.categories.unshift(root);
  return parsed;
}

function importBrowserBookmarks(htmlText, fileName, browser = null, keepSeparated = false) {
  const parsed = parseBrowserBookmarks(htmlText);
  if (!parsed || (parsed.categories.length === 0 && parsed.bookmarks.length === 0)) {
    toast('No se encontraron marcadores en el archivo', 'error');
    return;
  }
  if (browser && keepSeparated) groupBrowserBookmarks(parsed, browser.name);
  confirmMergedImport({
    version: APP.version,
    settings: {},
    categories: parsed.categories,
    bookmarks: parsed.bookmarks,
    quickGroups: [],
    empty: false
  }, fileName);
}

function resetSummary() {
  return {
    bookmarks: state.data.bookmarks.length,
    categories: state.data.categories.length,
    workspaces: state.data.workspaces.length,
    tasks: tasks().length,
    notes: stickyNotes().length,
    connections: Object.keys(personalCalendarConnections).length
  };
}

function showFinalResetConfirmation(summary, backedUp) {
  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Confirmación final' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: backedUp ? 'Se ha descargado una copia completa. ¿Quieres eliminar ahora todos los datos locales y empezar de cero?' : 'No has creado una copia de seguridad. ¿Quieres eliminar igualmente todos los datos locales y empezar de cero?' }),
    el('p', { class: 'modal-subtitle', text: 'Se borrarán favoritos, categorías, espacios, fondos, ajustes, tareas, eventos importados, notas y conexiones personales guardadas en esta extensión.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn danger', text: 'Sí, eliminar todo', onclick: async () => { closeModal(); await resetData(); } }));
  modal.append(header, body, footer);
  openModal(modal);
}

function confirmReset() {
  const summary = resetSummary();
  const modal = el('div', { class: 'modal', role: 'alertdialog' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', text: 'Restablecer datos' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));

  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: 'Vas a borrar por completo el Dashboard de este navegador. No se conservarán los ajustes ni el contenido.' }),
    el('p', { class: 'modal-subtitle', text: `${summary.bookmarks} favoritos · ${summary.categories} categorías · ${summary.workspaces} espacios · ${summary.tasks} tareas/eventos · ${summary.notes} notas${summary.connections ? ` · ${summary.connections} conexiones personales` : ''}` }),
    el('p', { text: 'Antes de borrar, puedes descargar una copia completa con tus favoritos, espacios, fijados, ajustes, widgets, tareas, eventos, notas y tema.' })
  );

  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }));
  footer.append(el('button', { class: 'btn secondary', text: 'Crear copia y continuar', onclick: () => { exportData(); showFinalResetConfirmation(summary, true); } }));
  footer.append(el('button', { class: 'btn danger', text: 'Continuar sin copia', onclick: () => showFinalResetConfirmation(summary, false) }));

  modal.append(header, body, footer);
  openModal(modal);
}

/* ============================================================
   ATAJOS DE TECLADO
   ============================================================ */

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const modalOpen = !els.modalOverlay.classList.contains('hidden');
    const paletteOpen = !els.commandPalette.classList.contains('hidden');
    const active = document.activeElement;
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteOpen) closeCommandPalette();
      else openCommandPalette();
      return;
    }

    if (paletteOpen) return;

    if (e.key === '/' && !typing) {
      e.preventDefault();
      els.searchInput.focus();
      return;
    }

    if (modalOpen || typing) return;

    if (e.key.toLowerCase() === 'n') {
      e.preventDefault();
      openBookmarkForm();
      return;
    }

    if (e.key.toLowerCase() === 'e') {
      e.preventDefault();
      toggleEditMode();
    }
  });
}

function handleCommandKeys(e) {
  const items = els.commandList.querySelectorAll('.command-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    state.commandIndex = (state.commandIndex + 1) % items.length;
    updateCommandSelection();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    state.commandIndex = (state.commandIndex - 1 + items.length) % items.length;
    updateCommandSelection();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const selected = items[state.commandIndex];
    if (selected) selected.click();
  } else if (e.key === 'Escape') {
    closeCommandPalette();
  }
}

/* ============================================================
   GESTOR DE TAREAS
   ============================================================ */

const TASK_COLUMNS = [
  { id: 'todo', labelKey: 'taskTodo' },
  { id: 'doing', labelKey: 'taskDoing' },
  { id: 'done', labelKey: 'taskDone' }
];

const TASK_PRIORITIES = [
  { id: 'low', labelKey: 'priorityLow', weight: 1 },
  { id: 'normal', labelKey: 'priorityNormal', weight: 2 },
  { id: 'high', labelKey: 'priorityHigh', weight: 3 },
  { id: 'urgent', labelKey: 'priorityUrgent', weight: 4 }
];

let taskCalendarCursor = new Date();

function tasks() {
  return Array.isArray(state.data.tasks) ? state.data.tasks : [];
}

function taskStatusLabel(status) {
  return t((TASK_COLUMNS.find((column) => column.id === status) || TASK_COLUMNS[0]).labelKey);
}

function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromDateTimeLocal(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function formatTaskDate(value, includeTime = true) {
  if (!value) return '';
  const options = includeTime
    ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'short' };
  return new Intl.DateTimeFormat(getLocale(), options).format(new Date(value));
}

function taskDateKey(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function extensionApi() {
  // Brave puede exponer un objeto `browser` parcial incluso con runtime.
  // Para OAuth hay que preferir la API Chromium que incluye identity.
  const browserApi = globalThis.browser;
  const chromeApi = globalThis.chrome;
  if (chromeApi && chromeApi.runtime && chromeApi.identity) return chromeApi;
  if (browserApi && browserApi.runtime && browserApi.identity) return browserApi;
  if (chromeApi && chromeApi.runtime) return chromeApi;
  if (browserApi && browserApi.runtime) return browserApi;
  return browserApi || chromeApi || null;
}

/* ---------- Calendarios personales (OAuth local, sin servidor) ---------- */
const CALENDAR_CONNECTIONS_KEY = 'dashboarddp_personal_calendar_connections_v1';
const CALENDAR_DELETIONS_KEY = 'dashboarddp_personal_calendar_deletions_v1';
let personalCalendarConnections = {};

function extStorage() {
  const api = extensionApi();
  return api && api.storage && api.storage.local ? api.storage.local : null;
}

async function extLocalGet(key, fallback = {}) {
  const storage = extStorage();
  if (!storage) return fallback;
  try {
    const result = storage.get(key);
    const data = result && typeof result.then === 'function'
      ? await result
      : await new Promise((resolve) => storage.get(key, resolve));
    return data && data[key] !== undefined ? data[key] : fallback;
  } catch { return fallback; }
}

async function extLocalSet(values) {
  const storage = extStorage();
  if (!storage) throw new Error(t('calendarExtensionOnly'));
  const result = storage.set(values);
  if (result && typeof result.then === 'function') await result;
  else await new Promise((resolve) => storage.set(values, resolve));
}

async function loadPersonalCalendarConnections() {
  const saved = await extLocalGet(CALENDAR_CONNECTIONS_KEY, {});
  personalCalendarConnections = saved && typeof saved === 'object' ? saved : {};
  return personalCalendarConnections;
}

async function savePersonalCalendarConnections() {
  await extLocalSet({ [CALENDAR_CONNECTIONS_KEY]: personalCalendarConnections });
}

function providerName(provider) {
  return provider === 'google' ? 'Google Calendar' : 'Microsoft Outlook';
}

function providerApiOrigins(provider) {
  return provider === 'microsoft'
    ? ['https://login.microsoftonline.com/*', 'https://graph.microsoft.com/*']
    : ['https://accounts.google.com/*', 'https://oauth2.googleapis.com/*', 'https://www.googleapis.com/*'];
}

async function ensureCalendarOAuthPermission(provider) {
  const api = extensionApi();
  if (!api || !api.permissions) throw new Error(t('calendarUnsupportedBrowser'));
  const request = { origins: providerApiOrigins(provider) };
  try {
    const contains = api.permissions.contains(request);
    const granted = contains && typeof contains.then === 'function'
      ? await contains
      : await new Promise((resolve) => api.permissions.contains(request, resolve));
    if (!granted) {
      const asked = api.permissions.request(request);
      const accepted = asked && typeof asked.then === 'function' ? await asked : await new Promise((resolve) => api.permissions.request(request, resolve));
      if (!accepted) return false;
    }
    const currentApi = extensionApi();
    const canUseOwnIdentity = currentApi?.identity && currentApi.identity.launchWebAuthFlow;
    const canUseExtensionWorker = currentApi?.runtime && currentApi.runtime.sendMessage;
    if (!canUseOwnIdentity && !canUseExtensionWorker) throw new Error(t('calendarUnsupportedBrowser'));
    return true;
  } catch (error) {
    if (error && error.message === t('calendarUnsupportedBrowser')) throw error;
    throw new Error(t('calendarPermissionDenied'));
  }
}

function launchCalendarWebAuthFlow(url, interactive = true) {
  const api = extensionApi();
  if (!api || !api.runtime || !api.runtime.sendMessage) return Promise.reject(new Error(t('calendarUnsupportedBrowser')));
  if (api.identity && api.identity.launchWebAuthFlow) {
    return new Promise((resolve, reject) => {
      try {
        const details = { url, interactive };
        if (!interactive) {
          details.abortOnLoadForNonInteractive = false;
          details.timeoutMsForNonInteractive = 10000;
        }
        api.identity.launchWebAuthFlow(details, (redirectedUrl) => {
          const runtimeError = api.runtime.lastError;
          if (runtimeError) { reject(new Error(runtimeError.message)); return; }
          if (!redirectedUrl) { reject(new Error(t('calendarConnectionCancelled'))); return; }
          resolve(redirectedUrl);
        });
      } catch (error) { reject(error); }
    });
  }
  return new Promise((resolve, reject) => {
    try {
      api.runtime.sendMessage({ type: 'dashboard-launch-calendar-auth', url, interactive }, (response) => {
        const runtimeError = api.runtime.lastError;
        if (runtimeError) { reject(new Error(runtimeError.message)); return; }
        if (!response || !response.ok || !response.redirectedUrl) {
          const detail = response && response.error;
          reject(new Error(detail === 'OAuth identity API is unavailable in this browser.' ? t('calendarBraveIdentityDisabled') : detail || t('calendarUnsupportedBrowser')));
          return;
        }
        resolve(response.redirectedUrl);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function currentCalendarRedirectUri() {
  const api = extensionApi();
  if (!api) return '';
  // En Chromium, identity puede estar como permiso opcional y no exponer
  // getRedirectURL hasta que se solicite. El ID de la extensión ya permite
  // conocer la misma URI, así el usuario puede configurarla antes de conectar.
  if (api.identity && api.identity.getRedirectURL) {
    try {
      const redirect = api.identity.getRedirectURL();
      if (redirect) return redirect;
    } catch {}
  }
  const extensionId = api.runtime && api.runtime.id;
  return extensionId ? `https://${extensionId}.chromiumapp.org/` : '';
}

function base64Url(bytes) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function createPkce() {
  const raw = new Uint8Array(48);
  crypto.getRandomValues(raw);
  const verifier = base64Url(raw);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: base64Url(digest) };
}

function calendarOAuthConfig(provider, clientId, redirectUri, pkce, stateValue, options = {}) {
  if (provider === 'google') {
    const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'token', state: stateValue });
    params.set('scope', 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.calendarlist.readonly');
    const prompt = Object.prototype.hasOwnProperty.call(options, 'prompt') ? options.prompt : 'consent';
    if (prompt) params.set('prompt', prompt);
    params.set('include_granted_scopes', 'true');
    return { authorize: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, token: 'https://oauth2.googleapis.com/token' };
  }
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', code_challenge: pkce.challenge, code_challenge_method: 'S256', state: stateValue });
  params.set('scope', 'openid offline_access https://graph.microsoft.com/Calendars.ReadWrite');
  return { authorize: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`, token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token' };
}

async function exchangeCalendarCode(provider, clientId, redirectUri, code, verifier) {
  const endpoint = provider === 'google' ? 'https://oauth2.googleapis.com/token' : 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const body = new URLSearchParams({ client_id: clientId, code, redirect_uri: redirectUri, grant_type: 'authorization_code', code_verifier: verifier });
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) throw new Error(payload.error_description || t('calendarConnectionFailed'));
  return { accessToken: payload.access_token, refreshToken: payload.refresh_token || null, expiresAt: Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000 - 30000 };
}

async function renewGoogleImplicitToken(connection, interactive = false) {
  if (!connection || !connection.clientId) throw new Error(t('calendarReconnectNeeded'));
  const redirectUri = connection.redirectUri || currentCalendarRedirectUri();
  if (!redirectUri) throw new Error(t('calendarUnsupportedBrowser'));
  const stateValue = base64Url(crypto.getRandomValues(new Uint8Array(18)));
  const flow = calendarOAuthConfig('google', connection.clientId, redirectUri, null, stateValue, { prompt: interactive ? null : 'none' });
  const redirected = await launchCalendarWebAuthFlow(flow.authorize, interactive);
  const result = new URL(redirected);
  const oauthParams = new URLSearchParams(result.hash.replace(/^#/, ''));
  if (oauthParams.get('state') !== stateValue) throw new Error(t('calendarSecurityCheckFailed'));
  const error = oauthParams.get('error');
  if (error) throw new Error(oauthParams.get('error_description') || error);
  const accessToken = oauthParams.get('access_token');
  if (!accessToken) throw new Error(t('calendarReconnectNeeded'));
  connection.token = {
    accessToken,
    refreshToken: null,
    expiresAt: Date.now() + Math.max(60, Number(oauthParams.get('expires_in')) || 3600) * 1000 - 30000
  };
  connection.redirectUri = redirectUri;
  connection.needsReconnect = false;
  connection.silentRenewAttemptAt = 0;
  await savePersonalCalendarConnections();
  return accessToken;
}

async function refreshCalendarToken(provider, connection) {
  if (connection.token && connection.token.accessToken && connection.token.expiresAt > Date.now()) return connection.token.accessToken;
  if (provider === 'google' && connection.authMode === 'implicit') {
    const lastAttempt = Number(connection.silentRenewAttemptAt) || 0;
    if (connection.needsReconnect && Date.now() - lastAttempt < 5 * 60 * 1000) throw new Error(t('calendarReconnectNeeded'));
    connection.silentRenewAttemptAt = Date.now();
    try {
      return await renewGoogleImplicitToken(connection, false);
    } catch {
      connection.needsReconnect = true;
      await savePersonalCalendarConnections().catch(() => {});
      throw new Error(t('calendarReconnectNeeded'));
    }
  }
  if (!connection.token || !connection.token.refreshToken) {
    connection.needsReconnect = true;
    await savePersonalCalendarConnections().catch(() => {});
    throw new Error(t('calendarReconnectNeeded'));
  }
  const endpoint = provider === 'google' ? 'https://oauth2.googleapis.com/token' : 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const body = new URLSearchParams({ client_id: connection.clientId, refresh_token: connection.token.refreshToken, grant_type: 'refresh_token' });
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    connection.needsReconnect = true;
    await savePersonalCalendarConnections().catch(() => {});
    throw new Error(t('calendarReconnectNeeded'));
  }
  connection.token = { accessToken: payload.access_token, refreshToken: payload.refresh_token || connection.token.refreshToken, expiresAt: Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000 - 30000 };
  connection.needsReconnect = false;
  await savePersonalCalendarConnections();
  return connection.token.accessToken;
}

async function calendarFetch(provider, connection, url, options = {}, retry = true) {
  const destination = new URL(url);
  const origin = { google: 'https://www.googleapis.com', microsoft: 'https://graph.microsoft.com' }[provider];
  if (!origin || destination.origin !== origin || destination.username || destination.password) {
    throw new Error('Destino de calendario no autorizado. No se han enviado credenciales.');
  }
  const token = await refreshCalendarToken(provider, connection);
  const response = await fetch(destination.href, { ...options, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } });
  if (response.status === 401 && retry) {
    connection.token.expiresAt = 0;
    return calendarFetch(provider, connection, url, options, false);
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error && payload.error.message ? payload.error.message : payload.error_description || t('calendarSyncFailed'));
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function listProviderCalendars(provider, connection) {
  if (provider === 'google') {
    const result = await calendarFetch(provider, connection, 'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader');
    return (result.items || []).map((item) => ({ id: item.id, name: item.summaryOverride || item.summary || item.id, primary: !!item.primary, writable: item.accessRole === 'writer' || item.accessRole === 'owner' }));
  }
  const result = await calendarFetch(provider, connection, 'https://graph.microsoft.com/v1.0/me/calendars?$select=id,name,isDefaultCalendar,canEdit');
  return (result.value || []).map((item) => ({ id: item.id, name: item.name || item.id, primary: !!item.isDefaultCalendar, writable: item.canEdit !== false }));
}

async function connectPersonalCalendar(provider, clientId) {
  if (!clientId || clientId.trim().length < 8) throw new Error(t('calendarClientIdRequired'));
  const granted = await ensureCalendarOAuthPermission(provider);
  if (!granted) throw new Error(t('calendarPermissionDenied'));
  const redirectUri = currentCalendarRedirectUri();
  if (!redirectUri) throw new Error(t('calendarUnsupportedBrowser'));
  const pkce = provider === 'google' ? null : await createPkce();
  const stateValue = base64Url(crypto.getRandomValues(new Uint8Array(18)));
  const flow = calendarOAuthConfig(provider, clientId.trim(), redirectUri, pkce, stateValue);
  const redirected = await launchCalendarWebAuthFlow(flow.authorize);
  const result = new URL(redirected);
  const oauthParams = provider === 'google' ? new URLSearchParams(result.hash.replace(/^#/, '')) : result.searchParams;
  if (oauthParams.get('state') !== stateValue) throw new Error(t('calendarSecurityCheckFailed'));
  const error = oauthParams.get('error');
  if (error) throw new Error(oauthParams.get('error_description') || error);
  let token;
  if (provider === 'google') {
    const accessToken = oauthParams.get('access_token');
    if (!accessToken) throw new Error(t('calendarConnectionCancelled'));
    token = { accessToken, refreshToken: null, expiresAt: Date.now() + Math.max(60, Number(oauthParams.get('expires_in')) || 3600) * 1000 - 30000 };
  } else {
    const code = oauthParams.get('code');
    if (!code) throw new Error(t('calendarConnectionCancelled'));
    token = await exchangeCalendarCode(provider, clientId.trim(), redirectUri, code, pkce.verifier);
  }
  const connection = { authMode: provider === 'google' ? 'implicit' : 'pkce', clientId: clientId.trim(), redirectUri, token, calendars: [], connectedAt: Date.now(), lastSyncAt: 0, needsReconnect: false, silentRenewAttemptAt: 0 };
  personalCalendarConnections[provider] = connection;
  connection.calendars = await listProviderCalendars(provider, connection);
  await savePersonalCalendarConnections();
  return connection;
}

async function disconnectPersonalCalendar(provider) {
  const connection = personalCalendarConnections[provider];
  if (connection && connection.token && connection.token.accessToken && provider === 'google') {
    fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(connection.token.refreshToken || connection.token.accessToken)}`, { method: 'POST' }).catch(() => {});
  }
  delete personalCalendarConnections[provider];
  await savePersonalCalendarConnections();
}

async function clearPersonalCalendarConnections() {
  const providers = Object.keys(personalCalendarConnections);
  await Promise.all(providers.map((provider) => disconnectPersonalCalendar(provider).catch(() => {})));
  personalCalendarConnections = {};
  const storage = extStorage();
  if (storage) {
    try {
      const result = storage.remove([CALENDAR_CONNECTIONS_KEY, CALENDAR_DELETIONS_KEY]);
      if (result && typeof result.then === 'function') await result;
      else await new Promise((resolve) => storage.remove([CALENDAR_CONNECTIONS_KEY, CALENDAR_DELETIONS_KEY], resolve));
    } catch {}
  }
  const api = extensionApi();
  if (api && api.identity && api.identity.clearAllCachedAuthTokens) {
    try {
      const result = api.identity.clearAllCachedAuthTokens();
      if (result && typeof result.then === 'function') await result;
    } catch {}
  }
}

function connectedCalendarOptions() {
  return Object.entries(personalCalendarConnections).flatMap(([provider, connection]) => (connection.calendars || [])
    .filter((calendar) => calendar.writable !== false)
    .map((calendar) => ({ provider, calendarId: calendar.id, calendarName: calendar.name, label: `${providerName(provider)} · ${calendar.name}` })));
}

function normalizeCalendarTimestamp(value) {
  let timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;
  if (timestamp < 100000000000) timestamp *= 1000;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 1900 || date.getUTCFullYear() > 9999) return null;
  return date.getTime();
}

function isoForCalendar(value) {
  const timestamp = normalizeCalendarTimestamp(value);
  return timestamp === null ? null : new Date(timestamp).toISOString();
}

function calendarDateOnly(value, dayOffset = 0) {
  const timestamp = normalizeCalendarTimestamp(value);
  if (timestamp === null) return null;
  const date = new Date(timestamp);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function taskMarker(task) { return `<!--dashboarddp-task:${task.id}-->`; }
function stripTaskMarker(value) { return String(value || '').replace(/<!--\s*dashboarddp-task:[^>]+-->/gi, '').trim(); }
function remoteTaskId(value) { const match = /<!--\s*dashboarddp-task:([^>\s]+)\s*-->/i.exec(String(value || '')); return match ? match[1] : null; }
function htmlToPlain(value) { const node = document.createElement('div'); node.innerHTML = String(value || ''); return node.textContent || node.innerText || ''; }

function remoteEventToTask(provider, calendar, event) {
  if (provider === 'google' && event.status === 'cancelled') {
    return { remoteEventId: event.id, cancelled: true, remoteUpdatedAt: new Date(event.updated).getTime() || Date.now(), calendar };
  }
  const rawNotes = provider === 'google' ? (event.description || '') : htmlToPlain(event.body && event.body.content);
  const start = provider === 'google' ? (event.start && (event.start.dateTime || event.start.date)) : (event.start && event.start.dateTime);
  const dueAt = start ? new Date(start.includes('T') ? start : `${start}T09:00:00`).getTime() : null;
  const allDay = provider === 'google' ? !!(event.start && event.start.date && !event.start.dateTime) : !!event.isAllDay;
  return { remoteEventId: event.id, markerTaskId: remoteTaskId(rawNotes), title: provider === 'google' ? (event.summary || t('calendarUntitledEvent')) : (event.subject || t('calendarUntitledEvent')), notes: stripTaskMarker(provider === 'google' ? rawNotes : htmlToPlain(event.body && event.body.content)), dueAt: Number.isFinite(dueAt) ? dueAt : null, allDay, remoteUpdatedAt: new Date(provider === 'google' ? event.updated : event.lastModifiedDateTime).getTime() || Date.now(), calendar };
}

async function fetchRemoteEvents(provider, connection, calendar) {
  const min = new Date(); min.setFullYear(min.getFullYear() - 1);
  const max = new Date(); max.setFullYear(max.getFullYear() + 2);
  const values = [];
  if (provider === 'google') {
    connection.syncTokens = connection.syncTokens && typeof connection.syncTokens === 'object' ? connection.syncTokens : {};
    const savedToken = connection.syncTokens[calendar.id] || null;
    const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`;
    const firstQuery = savedToken
      ? `singleEvents=true&showDeleted=true&maxResults=2500&syncToken=${encodeURIComponent(savedToken)}`
      : `singleEvents=true&showDeleted=true&maxResults=2500&timeMin=${encodeURIComponent(min.toISOString())}&timeMax=${encodeURIComponent(max.toISOString())}`;
    let url = `${base}?${firstQuery}`;
    let nextSyncToken = null;
    try {
      for (let page = 0; url && page < 20; page++) {
        const data = await calendarFetch(provider, connection, url);
        values.push(...(data.items || []));
        nextSyncToken = data.nextSyncToken || nextSyncToken;
        url = data.nextPageToken ? `${base}?${firstQuery}&pageToken=${encodeURIComponent(data.nextPageToken)}` : null;
      }
    } catch (error) {
      if (savedToken && error && error.status === 410) {
        delete connection.syncTokens[calendar.id];
        return fetchRemoteEvents(provider, connection, calendar);
      }
      throw error;
    }
    if (nextSyncToken) connection.syncTokens[calendar.id] = nextSyncToken;
    return values.map((event) => remoteEventToTask(provider, calendar, event));
  }
  let url = `https://graph.microsoft.com/v1.0/me/calendars/${encodeURIComponent(calendar.id)}/calendarView?startDateTime=${encodeURIComponent(min.toISOString())}&endDateTime=${encodeURIComponent(max.toISOString())}&$top=1000`;
  for (let page = 0; url && page < 12; page++) {
    const data = await calendarFetch(provider, connection, url);
    values.push(...(data.value || []));
    url = data['@odata.nextLink'];
  }
  return values.map((event) => remoteEventToTask(provider, calendar, event));
}

function updateTaskFromRemote(task, remote) {
  task.title = remote.title;
  task.notes = remote.notes;
  task.dueAt = remote.dueAt;
  task.calendarTarget = { provider: task.calendarTarget.provider, calendarId: remote.calendar.id, calendarName: remote.calendar.name, remoteEventId: remote.remoteEventId, remoteUpdatedAt: remote.remoteUpdatedAt, allDay: !!remote.allDay };
  task.updatedAt = remote.remoteUpdatedAt;
}

async function pullProviderEvents(provider, connection) {
  let added = 0; let updated = 0; let removed = 0;
  for (const calendar of connection.calendars || []) {
    const remoteEvents = await fetchRemoteEvents(provider, connection, calendar);
    remoteEvents.forEach((remote) => {
      let task = tasks().find((item) => item.calendarTarget && item.calendarTarget.provider === provider && item.calendarTarget.calendarId === calendar.id && item.calendarTarget.remoteEventId === remote.remoteEventId);
      if (!task && remote.markerTaskId) task = tasks().find((item) => item.id === remote.markerTaskId);
      if (remote.cancelled) {
        if (task) {
          state.data.tasks = tasks().filter((item) => item.id !== task.id);
          syncTaskReminder({ id: task.id, status: 'done' });
          removed++;
        }
        return;
      }
      if (task) {
        task.calendarTarget.allDay = !!remote.allDay;
        task.calendarTarget.calendarName = remote.calendar.name;
        const knownUpdated = Number(task.calendarTarget && task.calendarTarget.remoteUpdatedAt) || 0;
        if (remote.remoteUpdatedAt > knownUpdated + 1000) { updateTaskFromRemote(task, remote); updated++; }
        return;
      }
      state.data.tasks.push({ id: uid(), title: remote.title, notes: remote.notes, status: 'todo', priority: 'normal', dueAt: remote.dueAt, reminderAt: null, calendarTarget: { provider, calendarId: calendar.id, calendarName: calendar.name, remoteEventId: remote.remoteEventId, remoteUpdatedAt: remote.remoteUpdatedAt, allDay: !!remote.allDay }, createdAt: Date.now(), updatedAt: remote.remoteUpdatedAt, order: tasks().length });
      added++;
    });
  }
  return { added, updated, removed };
}

function remotePayload(provider, task) {
  const dueAt = normalizeCalendarTimestamp(task.dueAt);
  if (dueAt === null) return null;
  const allDay = !!(task.calendarTarget && task.calendarTarget.allDay);
  if (allDay) {
    const startDate = calendarDateOnly(dueAt);
    const endDate = calendarDateOnly(dueAt, 1);
    if (provider === 'google') return { summary: task.title, description: `${task.notes || ''}\n\n${taskMarker(task)}`.trim(), start: { date: startDate }, end: { date: endDate } };
    return { subject: task.title, body: { contentType: 'HTML', content: `${String(task.notes || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}<br><br>${taskMarker(task)}` }, isAllDay: true, start: { dateTime: `${startDate}T00:00:00`, timeZone: 'UTC' }, end: { dateTime: `${endDate}T00:00:00`, timeZone: 'UTC' } };
  }
  const start = isoForCalendar(dueAt);
  const end = isoForCalendar(dueAt + 30 * 60000);
  if (provider === 'google') return { summary: task.title, description: `${task.notes || ''}\n\n${taskMarker(task)}`.trim(), start: { dateTime: start }, end: { dateTime: end } };
  return { subject: task.title, body: { contentType: 'HTML', content: `${String(task.notes || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}<br><br>${taskMarker(task)}` }, isAllDay: false, start: { dateTime: start, timeZone: 'UTC' }, end: { dateTime: end, timeZone: 'UTC' } };
}

async function pushTaskToProvider(provider, connection, task) {
  if (!task.dueAt || !task.calendarTarget || task.calendarTarget.provider !== provider || !task.calendarTarget.calendarId) return false;
  const target = task.calendarTarget;
  const calendar = (connection.calendars || []).find((item) => item.id === target.calendarId);
  if (calendar && calendar.writable === false) return false;
  const normalizedDueAt = normalizeCalendarTimestamp(task.dueAt);
  if (normalizedDueAt === null) return false;
  if (normalizedDueAt !== task.dueAt) task.dueAt = normalizedDueAt;
  let payload = remotePayload(provider, task);
  if (!payload) return false;
  const base = provider === 'google'
    ? `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(target.calendarId)}/events`
    : `https://graph.microsoft.com/v1.0/me/calendars/${encodeURIComponent(target.calendarId)}/events`;
  const method = target.remoteEventId ? 'PATCH' : 'POST';
  const url = target.remoteEventId ? `${base}/${encodeURIComponent(target.remoteEventId)}` : base;
  let event;
  try {
    event = await calendarFetch(provider, connection, url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (error) {
    const invalidGoogleStart = provider === 'google' && method === 'PATCH' && /invalid\s+start\s+time/i.test(String(error && error.message));
    if (!invalidGoogleStart) throw error;
    const remoteEvent = await calendarFetch(provider, connection, url, { method: 'GET' });
    const remoteWasAllDay = !!(remoteEvent && remoteEvent.start && remoteEvent.start.date && !remoteEvent.start.dateTime);
    if (!remoteWasAllDay) throw error;
    target.allDay = true;
    payload = remotePayload(provider, task);
    event = await calendarFetch(provider, connection, url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  }
  if (event) {
    target.remoteEventId = event.id;
    target.remoteUpdatedAt = new Date(provider === 'google' ? event.updated : event.lastModifiedDateTime).getTime() || Date.now();
  }
  return true;
}

const CALENDAR_SMART_SYNC_MIN_MS = 5 * 60 * 1000;
let calendarSyncPromise = null;
let calendarAutoSyncTimer = null;
let calendarReconnectNoticeShown = false;
let activeTaskManagerRefresh = null;

function calendarSyncMessage(stats) {
  const base = t('calendarSyncSummary', stats);
  return stats.removed ? `${base} · ${t('calendarSyncRemoved', { count: stats.removed })}` : base;
}

async function syncPersonalCalendars(options = {}) {
  if (calendarSyncPromise) return calendarSyncPromise;
  const force = options.force !== false;
  const showToast = options.showToast !== false;
  const minAgeMs = Number(options.minAgeMs) || CALENDAR_SMART_SYNC_MIN_MS;
  const run = async () => {
    const connected = Object.entries(personalCalendarConnections).filter(([, connection]) => connection && connection.clientId);
    if (!connected.length) {
      if (showToast) toast(t('calendarNoConnection'), 'info');
      return { imported: 0, updated: 0, removed: 0, pushed: 0, skipped: true };
    }
    const now = Date.now();
    const providers = connected.filter(([, connection]) => force || now - (Number(connection.lastSyncAt) || 0) >= minAgeMs);
    if (!providers.length) return { imported: 0, updated: 0, removed: 0, pushed: 0, skipped: true };
    const stats = { imported: 0, updated: 0, removed: 0, pushed: 0, skipped: false };
    for (const [provider, connection] of providers) {
      connection.calendars = await listProviderCalendars(provider, connection);
      const pulled = await pullProviderEvents(provider, connection);
      stats.imported += pulled.added;
      stats.updated += pulled.updated;
      stats.removed += pulled.removed || 0;
      for (const task of tasks().filter((item) => item.calendarTarget && item.calendarTarget.provider === provider)) {
        const remoteUpdated = Number(task.calendarTarget.remoteUpdatedAt) || 0;
        if (!task.calendarTarget.remoteEventId || task.updatedAt > remoteUpdated + 1000) {
          if (await pushTaskToProvider(provider, connection, task)) stats.pushed++;
        }
      }
      connection.lastSyncAt = Date.now();
      connection.needsReconnect = false;
    }
    await savePersonalCalendarConnections();
    saveData();
    syncAllTaskReminders();
    renderCalendar();
    if (typeof activeTaskManagerRefresh === 'function') activeTaskManagerRefresh();
    if (showToast) toast(calendarSyncMessage(stats), 'success');
    updateCalendarSyncButton();
    return stats;
  };
  calendarSyncPromise = run().finally(() => { calendarSyncPromise = null; });
  return calendarSyncPromise;
}

async function smartSyncPersonalCalendars(reason = 'smart') {
  if (document.visibilityState === 'hidden') return null;
  try {
    const stats = await syncPersonalCalendars({ force: false, showToast: false, minAgeMs: CALENDAR_SMART_SYNC_MIN_MS, reason });
    if (stats && !stats.skipped && (stats.imported || stats.updated || stats.removed || stats.pushed)) {
      toast(calendarSyncMessage(stats), 'success');
    }
    calendarReconnectNoticeShown = false;
    return stats;
  } catch (error) {
    const reconnect = error && error.message === t('calendarReconnectNeeded');
    if (reconnect && !calendarReconnectNoticeShown) {
      calendarReconnectNoticeShown = true;
      toast(t('calendarReconnectNeeded'), 'info');
    } else if (!reconnect) {
      console.warn('Sincronización inteligente del calendario no disponible.', error);
    }
    if (typeof activeTaskManagerRefresh === 'function') activeTaskManagerRefresh();
    updateCalendarSyncButton();
    return null;
  }
}

function scheduleCalendarAutoSync() {
  if (calendarAutoSyncTimer) window.clearInterval(calendarAutoSyncTimer);
  calendarAutoSyncTimer = null;
  const minutes = Number(state.data.settings.calendarAutoSyncMinutes ?? 30);
  if (minutes <= 0) return;
  calendarAutoSyncTimer = window.setInterval(() => smartSyncPersonalCalendars('interval'), minutes * 60 * 1000);
}

function initSmartCalendarSync() {
  scheduleCalendarAutoSync();
  window.setTimeout(() => smartSyncPersonalCalendars('startup'), 1500);
  window.addEventListener('focus', () => smartSyncPersonalCalendars('focus'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') smartSyncPersonalCalendars('visible');
  });
}

function syncTaskReminder(task) {
  const api = extensionApi();
  if (!api || !api.runtime || !api.runtime.sendMessage) return;
  const type = task && task.reminderAt && task.status !== 'done' ? 'dashboard-schedule-task-reminder' : 'dashboard-clear-task-reminder';
  Promise.resolve(api.runtime.sendMessage(type === 'dashboard-schedule-task-reminder'
    ? { type, task }
    : { type, taskId: task && task.id })).catch(() => {});
}

function syncAllTaskReminders() {
  tasks().forEach(syncTaskReminder);
}

function setTaskStatus(task, status) {
  if (!task || !TASK_COLUMNS.some((column) => column.id === status)) return;
  if (task.status !== status) {
    const targetOrders = tasks().filter((item) => item.status === status && item.id !== task.id).map((item) => Number(item.order) || 0);
    task.order = targetOrders.length ? Math.max(...targetOrders) + 1 : 0;
  }
  task.status = status;
  task.updatedAt = Date.now();
  saveData();
  syncTaskReminder(task);
}

function taskPriority(task) {
  return TASK_PRIORITIES.find((priority) => priority.id === task.priority) || TASK_PRIORITIES[1];
}

function taskComparator(mode) {
  if (mode === 'due') return (a, b) => (a.dueAt || Number.MAX_SAFE_INTEGER) - (b.dueAt || Number.MAX_SAFE_INTEGER) || a.order - b.order;
  if (mode === 'priority') return (a, b) => taskPriority(b).weight - taskPriority(a).weight || (a.dueAt || Number.MAX_SAFE_INTEGER) - (b.dueAt || Number.MAX_SAFE_INTEGER) || a.order - b.order;
  if (mode === 'updated') return (a, b) => b.updatedAt - a.updatedAt || a.order - b.order;
  return (a, b) => a.order - b.order || b.updatedAt - a.updatedAt;
}

function orderedTasksForColumn(status, mode = state.data.settings.taskBoardSort || 'manual') {
  return tasks().filter((task) => task.status === status).sort(taskComparator(mode));
}

function prepareManualTaskOrder(mode) {
  if (mode === 'manual') return;
  TASK_COLUMNS.forEach((column) => {
    orderedTasksForColumn(column.id, mode).forEach((task, index) => { task.order = index; });
  });
}

function moveTaskToPosition(taskId, status, targetId = null, placeAfter = false) {
  const task = tasks().find((item) => item.id === taskId);
  if (!task || !TASK_COLUMNS.some((column) => column.id === status)) return;
  if (targetId === taskId) return;
  const previousSort = state.data.settings.taskBoardSort || 'manual';
  prepareManualTaskOrder(previousSort);
  state.data.settings.taskBoardSort = 'manual';
  const laneTasks = tasks()
    .filter((item) => item.status === status && item.id !== taskId)
    .sort((a, b) => a.order - b.order || b.updatedAt - a.updatedAt);
  let insertAt = laneTasks.length;
  if (targetId) {
    const targetIndex = laneTasks.findIndex((item) => item.id === targetId);
    if (targetIndex >= 0) insertAt = targetIndex + (placeAfter ? 1 : 0);
  }
  laneTasks.splice(insertAt, 0, task);
  task.status = status;
  task.updatedAt = Date.now();
  laneTasks.forEach((item, index) => { item.order = index; });
  saveData();
  syncTaskReminder(task);
}

function applyTaskCalendarTarget(task, value) {
  const previousTarget = task.calendarTarget || {};
  const chosen = value ? value.split('|') : null;
  const connectionOption = chosen && connectedCalendarOptions().find((option) => option.provider === chosen[0] && option.calendarId === chosen[1]);
  task.calendarTarget = connectionOption
    ? {
        provider: connectionOption.provider,
        calendarId: connectionOption.calendarId,
        calendarName: connectionOption.calendarName,
        remoteEventId: previousTarget.provider === connectionOption.provider && previousTarget.calendarId === connectionOption.calendarId ? previousTarget.remoteEventId : null,
        remoteUpdatedAt: previousTarget.provider === connectionOption.provider && previousTarget.calendarId === connectionOption.calendarId ? previousTarget.remoteUpdatedAt || 0 : 0,
        allDay: previousTarget.provider === connectionOption.provider && previousTarget.calendarId === connectionOption.calendarId ? !!previousTarget.allDay : false
      }
    : { provider: null, calendarId: null, calendarName: null, remoteEventId: null, remoteUpdatedAt: 0, allDay: false };
}

function removeTask(task) {
  const trashEntry = addToTrash('task', task.title, { task });
  state.data.tasks = tasks().filter((item) => item.id !== task.id);
  saveData();
  syncTaskReminder({ id: task.id, status: 'done' });
  notifyTrashEntry(trashEntry);
}

function openCalendarManager(initialView = 'calendar') {
  setExternalDropZoneLocked(true);
  const modal = el('div', { class: 'modal task-manager-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(
    el('div', null, [
      el('h2', { class: 'modal-title', id: 'modalTitle', text: t('taskManager') }),
      el('p', { class: 'task-manager-subtitle', text: t('localTasks') })
    ]),
    el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal })
  );
  const body = el('div', { class: 'modal-body task-manager-body' });
  const toolbar = el('div', { class: 'task-manager-toolbar' });
  const boardBtn = el('button', { class: `task-view-btn${initialView === 'board' ? ' active' : ''}`, text: t('board') });
  const calendarBtn = el('button', { class: `task-view-btn${initialView === 'calendar' ? ' active' : ''}`, text: t('calendar') });
  const exportBtn = el('button', { class: 'btn secondary task-export-btn', html: ICONS.export + `<span>${t('exportIcs')}</span>`, onclick: exportTasksCalendar });
  const importBtn = el('button', { class: 'btn secondary task-import-btn', html: ICONS.import + `<span>${t('importIcs')}</span>`, onclick: () => importCalendarFile(() => openTaskManager('calendar')) });
  const syncBtn = el('button', { class: 'btn secondary task-sync-btn', html: `<span>${t('syncNow')}</span>`, onclick: async () => {
    syncBtn.disabled = true;
    try { await syncPersonalCalendars(); } catch (error) { toast(error.message || t('calendarSyncFailed'), 'error'); }
    finally { syncBtn.disabled = false; }
  } });
  const addBtn = el('button', { class: 'btn primary task-add-btn', html: ICONS.plus + `<span>${t('newTask')}</span>` });
  toolbar.append(boardBtn, calendarBtn, importBtn, exportBtn, syncBtn, addBtn);
  const content = el('div', { class: 'task-manager-content' });
  let integrations = buildCalendarIntegrations();
  body.append(toolbar, content, integrations);
  modal.append(header, body);

  let currentView = initialView;
  const render = (view) => {
    currentView = view;
    content.textContent = '';
    boardBtn.classList.toggle('active', view === 'board');
    calendarBtn.classList.toggle('active', view === 'calendar');
    if (view === 'calendar') renderTaskCalendar(content, () => render('calendar'));
    else renderTaskBoard(content, () => render('board'));
  };
  boardBtn.addEventListener('click', () => render('board'));
  calendarBtn.addEventListener('click', () => {
    render('calendar');
    smartSyncPersonalCalendars('calendar-view');
  });
  addBtn.addEventListener('click', () => openTaskForm(null, () => openTaskManager(currentView)));
  render(initialView);
  openModal(modal);
  activeTaskManagerRefresh = () => {
    if (!document.body.contains(modal)) { activeTaskManagerRefresh = null; return; }
    render(currentView);
    const nextIntegrations = buildCalendarIntegrations();
    integrations.replaceWith(nextIntegrations);
    integrations = nextIntegrations;
  };
  smartSyncPersonalCalendars(initialView === 'calendar' ? 'calendar-open' : 'task-manager-open');
}

function renderTaskBoard(container, rerender) {
  const controls = el('div', { class: 'task-board-controls' });
  const sortLabel = el('label', { class: 'task-board-control' });
  const sortSelect = el('select', { class: 'form-select task-board-select', 'aria-label': t('taskSort') });
  [
    ['manual', 'taskSortManual'],
    ['due', 'taskSortDue'],
    ['priority', 'taskSortPriority'],
    ['updated', 'taskSortUpdated']
  ].forEach(([value, key]) => sortSelect.appendChild(el('option', { value, text: t(key) })));
  sortSelect.value = state.data.settings.taskBoardSort || 'manual';
  sortLabel.append(el('span', { text: t('taskSort') }), sortSelect);
  const density = el('div', { class: 'task-density-switch', role: 'group', 'aria-label': t('taskComfortable') });
  const comfortableBtn = el('button', { class: `task-density-btn${state.data.settings.taskBoardDensity !== 'compact' ? ' active' : ''}`, text: t('taskComfortable') });
  const compactBtn = el('button', { class: `task-density-btn${state.data.settings.taskBoardDensity === 'compact' ? ' active' : ''}`, text: t('taskCompact') });
  density.append(comfortableBtn, compactBtn);
  controls.append(sortLabel, density, el('span', { class: 'task-reorder-help', text: t('taskReorderHelp') }));
  container.appendChild(controls);

  sortSelect.addEventListener('change', () => {
    state.data.settings.taskBoardSort = sortSelect.value;
    saveData();
    rerender();
  });
  comfortableBtn.addEventListener('click', () => { state.data.settings.taskBoardDensity = 'comfortable'; saveData(); rerender(); });
  compactBtn.addEventListener('click', () => { state.data.settings.taskBoardDensity = 'compact'; saveData(); rerender(); });

  const board = el('div', { class: 'task-board' });
  if (state.data.settings.taskBoardDensity === 'compact') board.classList.add('compact');
  TASK_COLUMNS.forEach((column) => {
    const columnTasks = orderedTasksForColumn(column.id);
    const lane = el('section', { class: `task-lane ${column.id}`, dataset: { status: column.id } });
    const title = el('div', { class: 'task-lane-head' });
    title.append(el('h3', { text: t(column.labelKey) }), el('span', { class: 'task-count', text: String(columnTasks.length) }));
    const cards = el('div', { class: 'task-cards', dataset: { status: column.id } });
    cards.addEventListener('dragover', (event) => {
      event.preventDefault();
      cards.classList.add('drag-over');
      cards.querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
      const targetCard = event.target.closest('.task-card');
      if (targetCard && cards.contains(targetCard)) targetCard.classList.add(event.clientY > targetCard.getBoundingClientRect().top + targetCard.offsetHeight / 2 ? 'drop-after' : 'drop-before');
    });
    cards.addEventListener('dragleave', (event) => {
      if (cards.contains(event.relatedTarget)) return;
      cards.classList.remove('drag-over');
      cards.querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
    });
    cards.addEventListener('drop', (event) => {
      event.preventDefault();
      cards.classList.remove('drag-over');
      cards.querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
      const id = event.dataTransfer.getData('text/plain');
      const targetCard = event.target.closest('.task-card');
      const targetId = targetCard && cards.contains(targetCard) ? targetCard.dataset.taskId : null;
      const placeAfter = !!(targetCard && event.clientY > targetCard.getBoundingClientRect().top + targetCard.offsetHeight / 2);
      moveTaskToPosition(id, column.id, targetId, placeAfter);
      rerender();
    });
    if (!columnTasks.length) cards.appendChild(el('p', { class: 'task-empty', text: t('dropTask') }));
    columnTasks.forEach((task) => cards.appendChild(buildTaskCard(task, rerender)));
    lane.append(title, cards);
    board.appendChild(lane);
  });
  container.appendChild(board);
}

function buildTaskCard(task, rerender) {
  const priority = taskPriority(task);
  const card = el('article', { class: `task-card priority-${priority.id}${task.status === 'done' ? ' completed' : ''}`, draggable: 'true', dataset: { taskId: task.id } });
  card.addEventListener('dragstart', (event) => {
    if (event.target.closest('button, input, select, summary, details')) { event.preventDefault(); return; }
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
  });
  const top = el('div', { class: 'task-card-top' });
  top.append(
    el('h4', { class: 'task-card-title', text: task.title }),
    el('span', { class: `task-priority-badge ${priority.id}`, text: t(priority.labelKey) })
  );
  card.appendChild(top);
  if (task.notes) card.appendChild(el('p', { class: 'task-card-notes', text: task.notes }));
  const meta = el('div', { class: 'task-card-meta' });
  if (task.dueAt) meta.appendChild(el('span', { class: `task-date${task.dueAt < Date.now() && task.status !== 'done' ? ' overdue' : ''}`, text: `${t('dueLabel')}: ${formatTaskDate(task.dueAt)}` }));
  if (task.reminderAt && task.status !== 'done') meta.appendChild(el('span', { class: 'task-reminder', text: `${t('reminderLabel')}: ${formatTaskDate(task.reminderAt)}` }));
  if (task.calendarTarget && task.calendarTarget.provider) meta.appendChild(el('span', { class: 'task-calendar-chip', text: task.calendarTarget.calendarName || task.calendarTarget.provider }));
  card.appendChild(meta);

  const quick = el('details', { class: 'task-quick-properties' });
  quick.appendChild(el('summary', { text: t('taskProperties') }));
  const quickGrid = el('div', { class: 'task-quick-grid' });
  const statusSelect = el('select', { class: 'task-quick-input', 'aria-label': t('column') });
  TASK_COLUMNS.forEach((column) => statusSelect.appendChild(el('option', { value: column.id, text: t(column.labelKey) })));
  statusSelect.value = task.status;
  const prioritySelect = el('select', { class: 'task-quick-input', 'aria-label': t('priority') });
  TASK_PRIORITIES.forEach((item) => prioritySelect.appendChild(el('option', { value: item.id, text: t(item.labelKey) })));
  prioritySelect.value = priority.id;
  const dueInput = el('input', { class: 'task-quick-input', type: 'date', 'aria-label': t('dueDate'), value: task.dueAt ? toDateTimeLocal(task.dueAt).slice(0, 10) : '' });
  const targetSelect = el('select', { class: 'task-quick-input task-quick-calendar', 'aria-label': t('calendarTarget') });
  targetSelect.appendChild(el('option', { value: '', text: t('noSync') }));
  connectedCalendarOptions().forEach((option) => targetSelect.appendChild(el('option', { value: `${option.provider}|${option.calendarId}`, text: option.label })));
  if (task.calendarTarget && task.calendarTarget.provider && task.calendarTarget.provider !== 'ics') targetSelect.value = `${task.calendarTarget.provider}|${task.calendarTarget.calendarId}`;
  quickGrid.append(statusSelect, prioritySelect, dueInput, targetSelect);
  quick.appendChild(quickGrid);
  card.appendChild(quick);

  statusSelect.addEventListener('change', () => { setTaskStatus(task, statusSelect.value); rerender(); });
  prioritySelect.addEventListener('change', () => { task.priority = prioritySelect.value; task.updatedAt = Date.now(); saveData(); rerender(); });
  dueInput.addEventListener('change', () => {
    if (!dueInput.value) task.dueAt = null;
    else {
      const prior = task.dueAt ? new Date(task.dueAt) : new Date();
      const time = task.dueAt ? `${String(prior.getHours()).padStart(2, '0')}:${String(prior.getMinutes()).padStart(2, '0')}` : '09:00';
      task.dueAt = fromDateTimeLocal(`${dueInput.value}T${time}`);
    }
    task.updatedAt = Date.now();
    saveData();
    syncTaskReminder(task);
    rerender();
  });
  targetSelect.addEventListener('change', () => { applyTaskCalendarTarget(task, targetSelect.value); task.updatedAt = Date.now(); saveData(); rerender(); });
  const actions = el('div', { class: 'task-card-actions' });
  actions.append(
    el('button', { class: 'task-card-btn', text: t('edit'), onclick: () => openTaskForm(task, () => openTaskManager('board')) }),
    el('button', { class: 'task-card-btn done', text: task.status === 'done' ? t('reopen') : t('done'), onclick: () => { setTaskStatus(task, task.status === 'done' ? 'todo' : 'done'); rerender(); } })
  );
  card.appendChild(actions);
  return card;
}

function startTaskDay(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addTaskDays(value, days) {
  const date = startTaskDay(value);
  date.setDate(date.getDate() + days);
  return date;
}

function startTaskWeek(value) {
  const date = startTaskDay(value);
  return addTaskDays(date, -((date.getDay() + 6) % 7));
}

function tasksForCalendarDay(date) {
  const key = taskDateKey(date.getTime());
  return tasks().filter((task) => task.dueAt && taskDateKey(task.dueAt) === key).sort((a, b) => a.dueAt - b.dueAt || taskPriority(b).weight - taskPriority(a).weight);
}

function buildCalendarTaskItem(task, compact = false) {
  const item = el('button', {
    class: `task-calendar-item ${task.status} priority-${taskPriority(task).id}${compact ? ' compact' : ''}`,
    title: `${task.title} · ${t(taskPriority(task).labelKey)}`,
    onclick: () => openTaskForm(task, () => openTaskManager('calendar'))
  });
  item.append(
    el('span', { text: new Intl.DateTimeFormat(getLocale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(task.dueAt)) }),
    el('strong', { text: task.title })
  );
  return item;
}

function calendarRangeTitle(view) {
  if (view === 'month') return new Intl.DateTimeFormat(getLocale(), { month: 'long', year: 'numeric' }).format(taskCalendarCursor);
  const start = startTaskWeek(taskCalendarCursor);
  const end = addTaskDays(start, view === 'week' ? 6 : 29);
  const startText = new Intl.DateTimeFormat(getLocale(), { day: 'numeric', month: 'short' }).format(start);
  const endText = new Intl.DateTimeFormat(getLocale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(end);
  return `${startText} — ${endText}`;
}

function renderTaskCalendar(container, rerender) {
  const validViews = ['month', 'week', 'agenda'];
  const currentView = validViews.includes(state.data.settings.taskCalendarView) ? state.data.settings.taskCalendarView : 'month';
  const shell = el('section', { class: 'task-calendar-shell' });
  const toolbar = el('div', { class: 'task-calendar-toolbar' });
  const navigation = el('div', { class: 'task-calendar-navigation' });
  const previousBtn = el('button', { class: 'task-calendar-nav-btn', text: '‹', title: t('previousPeriod'), 'aria-label': t('previousPeriod') });
  const todayBtn = el('button', { class: 'task-calendar-today-btn', text: t('today') });
  const nextBtn = el('button', { class: 'task-calendar-nav-btn', text: '›', title: t('nextPeriod'), 'aria-label': t('nextPeriod') });
  const rangeTitle = el('h3', { class: 'task-calendar-range', text: calendarRangeTitle(currentView) });
  navigation.append(previousBtn, todayBtn, nextBtn, rangeTitle);
  const views = el('div', { class: 'task-calendar-view-switch', role: 'group', 'aria-label': t('calendar') });
  [['month', 'calendarMonth'], ['week', 'calendarWeek'], ['agenda', 'calendarAgenda']].forEach(([view, key]) => {
    views.appendChild(el('button', { class: `task-calendar-view-btn${currentView === view ? ' active' : ''}`, text: t(key), onclick: () => {
      state.data.settings.taskCalendarView = view;
      saveData();
      rerender();
    } }));
  });
  toolbar.append(navigation, views);
  shell.appendChild(toolbar);

  const movePeriod = (direction) => {
    if (currentView === 'month') taskCalendarCursor = new Date(taskCalendarCursor.getFullYear(), taskCalendarCursor.getMonth() + direction, 1);
    else taskCalendarCursor = addTaskDays(taskCalendarCursor, direction * (currentView === 'week' ? 7 : 30));
    rerender();
  };
  previousBtn.addEventListener('click', () => movePeriod(-1));
  nextBtn.addEventListener('click', () => movePeriod(1));
  todayBtn.addEventListener('click', () => { taskCalendarCursor = new Date(); rerender(); });

  if (currentView === 'month') renderTaskMonthView(shell);
  else if (currentView === 'week') renderTaskWeekView(shell);
  else renderTaskAgendaView(shell);

  if (!tasks().some((task) => task.dueAt)) shell.appendChild(el('p', { class: 'task-calendar-help', text: t('calendarHelp') }));
  container.appendChild(shell);
}

function renderTaskMonthView(container) {
  const grid = el('div', { class: 'task-month-grid' });
  const monday = startTaskWeek(new Date(2024, 0, 1));
  for (let index = 0; index < 7; index++) {
    grid.appendChild(el('div', { class: 'task-month-weekday', text: new Intl.DateTimeFormat(getLocale(), { weekday: 'short' }).format(addTaskDays(monday, index)) }));
  }
  const monthStart = new Date(taskCalendarCursor.getFullYear(), taskCalendarCursor.getMonth(), 1);
  const firstCell = startTaskWeek(monthStart);
  const todayKey = taskDateKey(Date.now());
  for (let index = 0; index < 42; index++) {
    const date = addTaskDays(firstCell, index);
    const dayTasks = tasksForCalendarDay(date);
    const cell = el('section', { class: `task-month-day${date.getMonth() !== monthStart.getMonth() ? ' outside' : ''}${taskDateKey(date.getTime()) === todayKey ? ' today' : ''}` });
    cell.appendChild(el('div', { class: 'task-month-day-number', text: String(date.getDate()) }));
    dayTasks.slice(0, 3).forEach((task) => cell.appendChild(buildCalendarTaskItem(task, true)));
    if (dayTasks.length > 3) cell.appendChild(el('span', { class: 'task-month-more', text: `+${dayTasks.length - 3}` }));
    grid.appendChild(cell);
  }
  container.appendChild(grid);
}

function renderTaskWeekView(container) {
  const grid = el('div', { class: 'task-week-grid' });
  const start = startTaskWeek(taskCalendarCursor);
  const todayKey = taskDateKey(Date.now());
  for (let index = 0; index < 7; index++) {
    const date = addTaskDays(start, index);
    const dayTasks = tasksForCalendarDay(date);
    const day = el('section', { class: `task-week-day${taskDateKey(date.getTime()) === todayKey ? ' today' : ''}` });
    day.appendChild(el('h3', { text: new Intl.DateTimeFormat(getLocale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(date) }));
    if (!dayTasks.length) day.appendChild(el('p', { class: 'task-empty', text: t('noDueDates') }));
    dayTasks.forEach((task) => day.appendChild(buildCalendarTaskItem(task)));
    grid.appendChild(day);
  }
  container.appendChild(grid);
}

function renderTaskAgendaView(container) {
  const list = el('div', { class: 'task-agenda-list' });
  const start = startTaskWeek(taskCalendarCursor);
  let found = false;
  for (let index = 0; index < 30; index++) {
    const date = addTaskDays(start, index);
    const dayTasks = tasksForCalendarDay(date);
    if (!dayTasks.length) continue;
    found = true;
    const row = el('section', { class: 'task-agenda-day' });
    row.appendChild(el('h3', { text: new Intl.DateTimeFormat(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(date) }));
    const items = el('div', { class: 'task-agenda-items' });
    dayTasks.forEach((task) => items.appendChild(buildCalendarTaskItem(task)));
    row.appendChild(items);
    list.appendChild(row);
  }
  if (!found) list.appendChild(el('p', { class: 'task-calendar-empty', text: t('noCalendarTasks') }));
  container.appendChild(list);
}

function openTaskForm(existing, afterSave) {
  const task = existing || { title: '', notes: '', status: 'todo', priority: 'normal', dueAt: null, reminderAt: null };
  const modal = el('div', { class: 'modal task-form-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: existing ? t('edit') : t('newTask') }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: () => { closeModal(); if (afterSave) afterSave(); } }));
  const body = el('div', { class: 'modal-body' });
  const titleInput = el('input', { class: 'form-input', type: 'text', placeholder: t('taskTitlePlaceholder'), value: task.title, maxlength: '180', autofocus: '' });
  const notesInput = el('textarea', { class: 'form-input task-notes-input', placeholder: t('notesPlaceholder'), maxlength: '5000' });
  notesInput.value = task.notes || '';
  const statusSelect = el('select', { class: 'form-select' });
  TASK_COLUMNS.forEach((column) => statusSelect.appendChild(el('option', { value: column.id, text: t(column.labelKey) })));
  statusSelect.value = task.status;
  const prioritySelect = el('select', { class: 'form-select' });
  TASK_PRIORITIES.forEach((priority) => prioritySelect.appendChild(el('option', { value: priority.id, text: t(priority.labelKey) })));
  prioritySelect.value = taskPriority(task).id;
  const dueInput = el('input', { class: 'form-input', type: 'datetime-local', value: toDateTimeLocal(task.dueAt) });
  const reminderInput = el('input', { class: 'form-input', type: 'datetime-local', value: toDateTimeLocal(task.reminderAt) });
  const targetSelect = el('select', { class: 'form-select' });
  targetSelect.appendChild(el('option', { value: '', text: t('noSync') }));
  connectedCalendarOptions().forEach((option) => targetSelect.appendChild(el('option', { value: `${option.provider}|${option.calendarId}`, text: option.label })));
  if (task.calendarTarget && task.calendarTarget.provider && task.calendarTarget.provider !== 'ics') targetSelect.value = `${task.calendarTarget.provider}|${task.calendarTarget.calendarId}`;
  body.append(
    taskFormGroup(t('taskTitle'), titleInput),
    taskFormGroup(t('notes'), notesInput),
    taskFormGroup(t('column'), statusSelect),
    taskFormGroup(t('priority'), prioritySelect),
    taskFormGroup(t('dueDate'), dueInput),
    taskFormGroup(t('reminder'), reminderInput),
    taskFormGroup(t('calendarTarget'), targetSelect),
    el('p', { class: 'task-form-help', text: t('reminderHelp') })
  );
  const footer = el('div', { class: 'modal-footer' });
  if (existing) footer.appendChild(el('button', { class: 'btn danger task-delete-btn', text: 'Eliminar', onclick: () => { removeTask(existing); closeModal(); if (afterSave) afterSave(); } }));
  footer.append(el('button', { class: 'btn secondary', text: 'Cancelar', onclick: () => { closeModal(); if (afterSave) afterSave(); } }), el('button', { class: 'btn primary', text: 'Guardar', onclick: () => {
    const title = titleInput.value.trim();
    if (!title) { titleInput.focus(); toast('Escribe un título para la tarea', 'error'); return; }
    const saved = existing || { id: uid(), createdAt: Date.now(), order: tasks().length, calendarTarget: { provider: null, calendarId: null, calendarName: null, remoteEventId: null } };
    Object.assign(saved, { title, notes: notesInput.value.trim(), status: statusSelect.value, priority: prioritySelect.value, dueAt: fromDateTimeLocal(dueInput.value), reminderAt: fromDateTimeLocal(reminderInput.value), updatedAt: Date.now() });
    applyTaskCalendarTarget(saved, targetSelect.value);
    if (!existing) state.data.tasks.push(saved);
    saveData();
    syncTaskReminder(saved);
    closeModal();
    if (afterSave) afterSave();
    toast(existing ? 'Tarea actualizada' : 'Tarea creada', 'success');
  }}));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => titleInput.focus(), 20);
}

function taskFormGroup(label, input) {
  const group = el('label', { class: 'form-group' });
  group.append(el('span', { class: 'form-label', text: label }), input);
  return group;
}

function icsEscape(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function icsDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function unfoldIcsLines(text) {
  return String(text || '').replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
}

function unescapeIcsText(value) {
  return String(value || '').replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

function parseIcsTimestamp(value) {
  const raw = String(value || '').trim();
  const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/.exec(raw);
  if (!match) return null;
  const [, year, month, day, hour = '09', minute = '00', second = '00', utc] = match;
  const date = utc
    ? new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)))
    : new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function parseIcsEvents(text) {
  const events = [];
  let current = null;
  unfoldIcsLines(text).forEach((line) => {
    const normalized = String(line || '').replace(/^\uFEFF/, '').trim();
    if (normalized.toUpperCase() === 'BEGIN:VEVENT') { current = {}; return; }
    if (normalized.toUpperCase() === 'END:VEVENT') { if (current && current.SUMMARY) events.push(current); current = null; return; }
    if (!current) return;
    const separator = normalized.indexOf(':');
    if (separator < 1) return;
    const key = normalized.slice(0, separator).split(';')[0].toUpperCase();
    const value = normalized.slice(separator + 1);
    if (['UID', 'SUMMARY', 'DESCRIPTION', 'DTSTART', 'STATUS'].includes(key) && current[key] === undefined) current[key] = value;
  });
  return events.map((event) => ({
    uid: unescapeIcsText(event.UID || ''),
    title: unescapeIcsText(event.SUMMARY || '').trim(),
    notes: unescapeIcsText(event.DESCRIPTION || '').trim(),
    dueAt: parseIcsTimestamp(event.DTSTART),
    status: String(event.STATUS || '').toUpperCase() === 'COMPLETED' ? 'done' : 'todo'
  })).filter((event) => event.title);
}

function importCalendarFile(afterImport) {
  const input = el('input', { type: 'file', accept: '.ics,.zip,text/calendar,application/zip', multiple: '', hidden: '' });
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    const files = [...(input.files || [])];
    if (!files.length) { input.remove(); return; }
    const zip = files.find((file) => /\.zip$/i.test(file.name) || file.type === 'application/zip');
    if (zip) {
      input.remove();
      toast('Google exporta todos los calendarios como ZIP. Extrae ese ZIP y selecciona uno o varios archivos .ics.', 'info');
      return;
    }
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error(file.name));
      reader.onload = () => resolve({ file, events: parseIcsEvents(reader.result) });
      reader.readAsText(file, 'utf-8');
    }))).then((imports) => {
      const eventsFound = imports.reduce((total, item) => total + item.events.length, 0);
      if (!eventsFound) { toast('No se encontraron eventos. Elige el archivo .ics extraído, no el ZIP descargado de Google.', 'error'); return; }
      const existing = new Set(tasks().map((task) => task.calendarTarget && task.calendarTarget.provider === 'ics' ? task.calendarTarget.remoteEventId : '').filter(Boolean));
      let added = 0;
      let skipped = 0;
      imports.forEach(({ file, events }) => {
        const calendarName = file.name.replace(/\.ics$/i, '') || 'Calendario importado';
        events.forEach((event) => {
          const remoteEventId = event.uid || `${calendarName}:${event.title}:${event.dueAt || ''}`;
          if (existing.has(remoteEventId)) { skipped++; return; }
          state.data.tasks.push({
            id: uid(), title: event.title, notes: event.notes, status: event.status, priority: 'normal', dueAt: event.dueAt, reminderAt: null,
            calendarTarget: { provider: 'ics', calendarId: calendarName, calendarName, remoteEventId },
            createdAt: Date.now(), updatedAt: Date.now(), order: tasks().length
          });
          existing.add(remoteEventId);
          added++;
        });
      });
      if (!added) { toast('Esos calendarios ya estaban importados.', 'info'); return; }
      saveData();
      syncAllTaskReminders();
      toast(`${added} evento${added === 1 ? '' : 's'} importado${added === 1 ? '' : 's'}${skipped ? ` · ${skipped} ya existía${skipped === 1 ? '' : 'n'}` : ''}`, 'success');
      if (afterImport) afterImport();
    }).catch(() => toast('No se pudo leer uno de los archivos de calendario.', 'error')).finally(() => input.remove());
  }, { once: true });
  input.click();
}

function exportTasksCalendar() {
  const dated = tasks().filter((task) => task.dueAt);
  if (!dated.length) { toast('Añade al menos una fecha de vencimiento para exportar el calendario', 'info'); return; }
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DashboardDP//Task Manager//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  dated.forEach((task) => {
    lines.push('BEGIN:VEVENT', `UID:${task.id}@dashboarddp.local`, `DTSTAMP:${icsDate(task.updatedAt || Date.now())}`, `DTSTART:${icsDate(task.dueAt)}`, `DTEND:${icsDate(task.dueAt + 30 * 60000)}`, `SUMMARY:${icsEscape(task.title)}`, `DESCRIPTION:${icsEscape(task.notes)}`, `STATUS:${task.status === 'done' ? 'COMPLETED' : 'CONFIRMED'}`);
    if (task.reminderAt) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER;VALUE=DATE-TIME:${icsDate(task.reminderAt)}`, `DESCRIPTION:${icsEscape(task.title)}`, 'END:VALARM');
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dashboard-tareas-${new Date().toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Calendario exportado en formato .ics', 'success');
}

async function renewPersonalCalendarAccess(provider, options = {}) {
  const connection = personalCalendarConnections[provider];
  if (!connection || !connection.clientId) throw new Error(t('calendarNoConnection'));
  const granted = await ensureCalendarOAuthPermission(provider);
  if (!granted) throw new Error(t('calendarPermissionDenied'));
  if (provider === 'google') {
    await renewGoogleImplicitToken(connection, true);
  } else {
    await connectPersonalCalendar(provider, connection.clientId);
  }
  const renewed = personalCalendarConnections[provider];
  renewed.needsReconnect = false;
  renewed.lastSyncAt = 0;
  renewed.calendars = await listProviderCalendars(provider, renewed);
  await savePersonalCalendarConnections();
  if (options.syncAfter !== false) await syncPersonalCalendars({ force: true, showToast: false });
  if (options.showToast !== false) toast(t('calendarAccessRestored'), 'success');
  updateCalendarSyncButton();
}

function calendarConnectionsNeedingRenewal() {
  return Object.entries(personalCalendarConnections).filter(([provider, connection]) => {
    if (!connection || !connection.clientId) return false;
    if (connection.needsReconnect) return true;
    const token = connection.token || {};
    return provider === 'google' && !token.refreshToken && (!token.accessToken || Number(token.expiresAt) <= Date.now() + 30000);
  });
}

function updateCalendarSyncButton() {
  const button = els.calendarSyncBtn;
  if (!button) return;
  const needsRenewal = calendarConnectionsNeedingRenewal().length > 0;
  const label = t(needsRenewal ? 'calendarRenewAndSync' : 'syncNow');
  button.innerHTML = ICONS.reset;
  button.classList.toggle('needs-renewal', needsRenewal);
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
}

async function handleTopbarCalendarSync() {
  const button = els.calendarSyncBtn;
  if (!button || button.disabled) return;
  const connected = Object.entries(personalCalendarConnections).filter(([, connection]) => connection && connection.clientId);
  if (!connected.length) {
    toast(t('calendarNoConnection'), 'info');
    openTaskManager('calendar');
    return;
  }
  button.disabled = true;
  button.classList.add('syncing');
  button.setAttribute('aria-busy', 'true');
  try {
    const renewals = calendarConnectionsNeedingRenewal();
    for (const [provider] of renewals) await renewPersonalCalendarAccess(provider, { syncAfter: false, showToast: false });
    await syncPersonalCalendars({ force: true, showToast: renewals.length === 0 });
    if (renewals.length) toast(t('calendarAccessRestored'), 'success');
  } catch (error) {
    toast(error.message || t('calendarSyncFailed'), 'error');
  } finally {
    button.disabled = false;
    button.classList.remove('syncing');
    button.removeAttribute('aria-busy');
    updateCalendarSyncButton();
  }
}

function buildCalendarIntegrations() {
  const details = el('section', { class: 'task-integrations calendar-integrations-open' });
  details.appendChild(el('h2', { class: 'modal-title', text: t('calendarHub') }));
  const intro = el('p', { text: t('calendarLocalInfo') });
  const providers = el('div', { class: 'task-provider-grid' });
  [
    { id: 'google', title: 'Google Calendar', description: t('calendarGoogleIcs') },
    { id: 'microsoft', title: 'Outlook / Microsoft 365', description: t('calendarMicrosoftIcs') }
  ].forEach((provider) => {
    const connection = personalCalendarConnections[provider.id];
    const card = el('div', { class: 'task-provider' });
    const connectionText = connection
      ? (connection.needsReconnect ? t('calendarConnectionPaused') : `${t('connected')} · ${(connection.calendars || []).length} ${t('calendar').toLowerCase()}`)
      : provider.description;
    card.append(el('strong', { text: provider.title }), el('span', { text: connectionText }));
    const actions = el('div', { class: 'task-provider-actions' });
    if (connection && connection.needsReconnect) {
      const renewBtn = el('button', { class: 'task-provider-btn renew', type: 'button', text: t('calendarRenewAccess') });
      renewBtn.addEventListener('click', async () => {
        renewBtn.disabled = true;
        try { await renewPersonalCalendarAccess(provider.id); openTaskManager('calendar'); }
        catch (error) { toast(error.message || t('calendarReconnectNeeded'), 'error'); renewBtn.disabled = false; }
      });
      actions.appendChild(renewBtn);
    }
    actions.appendChild(el('button', { class: 'task-provider-btn', type: 'button', text: t('setupConnection'), onclick: () => openCalendarSetupGuide(provider.id) }));
    card.appendChild(actions);
    providers.appendChild(card);
  });
  const importExisting = el('button', { class: 'btn secondary calendar-import-existing', type: 'button', html: ICONS.import + `<span>${t('chooseIcs')}</span>`, onclick: () => importCalendarFile(() => openTaskManager('calendar')) });
  details.append(intro, importExisting, providers, el('p', { class: 'task-integration-note', text: t('calendarPersonalStorage') }));
  return details;
}

function externalLink(url, label) {
  return el('a', { class: 'btn secondary calendar-guide-link', href: url, target: '_blank', rel: 'noopener noreferrer', text: label });
}

function calendarSetupSteps(provider) {
  const steps = {
    es: {
      google: ['En Google Cloud crea un proyecto personal y activa Google Calendar API.', 'Configura la pantalla de consentimiento para pruebas personales y crea una credencial OAuth de tipo Aplicación web.', 'Copia exactamente la URI de redirección de abajo en “URIs de redirección autorizados”. No uses ni copies una clave secreta.', 'Copia el Client ID, pégalo aquí y pulsa “Guardar y conectar”.'],
      microsoft: ['En Microsoft Entra registra una aplicación personal para cuentas Microsoft personales y profesionales.', 'En Autenticación añade la URI de redirección de abajo como plataforma Aplicación de una sola página (SPA).', 'En Permisos API añade Microsoft Graph → Permisos delegados → Calendars.ReadWrite. No crees un Client Secret.', 'Copia el Application (client) ID, pégalo aquí y pulsa “Guardar y conectar”.']
    },
    en: {
      google: ['In Google Cloud, create a personal project and enable Google Calendar API.', 'Set up the consent screen for personal testing and create a Web application OAuth credential.', 'Copy the redirect URI below exactly into “Authorized redirect URIs”. Do not use or copy a client secret.', 'Copy the Client ID, paste it here, and select “Save and connect”.'],
      microsoft: ['In Microsoft Entra, register a personal app for personal and work Microsoft accounts.', 'Under Authentication, add the redirect URI below as a Single-page application (SPA) platform.', 'Under API permissions, add Microsoft Graph → Delegated permissions → Calendars.ReadWrite. Do not create a client secret.', 'Copy the Application (client) ID, paste it here, and select “Save and connect”.']
    },
    ca: {
      google: ['A Google Cloud crea un projecte personal i activa Google Calendar API.', 'Configura la pantalla de consentiment per a proves personals i crea una credencial OAuth de tipus Aplicació web.', 'Copia exactament la URI de redirecció de sota a “URIs de redirecció autoritzats”. No facis servir cap clau secreta.', 'Copia el Client ID, enganxa’l aquí i prem “Desa i connecta”.'],
      microsoft: ['A Microsoft Entra registra una aplicació personal per a comptes Microsoft personals i professionals.', 'A Autenticació afegeix la URI de redirecció de sota com a plataforma SPA.', 'A Permisos API afegeix Microsoft Graph → Permisos delegats → Calendars.ReadWrite. No creïs cap Client Secret.', 'Copia l’Application (client) ID, enganxa’l aquí i prem “Desa i connecta”.']
    },
    eu: {
      google: ['Google Cloud-en sortu proiektu pertsonal bat eta aktibatu Google Calendar API.', 'Konfiguratu baimen-pantaila proba pertsonaletarako eta sortu Web aplikazio motako OAuth kredentziala.', 'Kopiatu beheko birbideratze URIa zehazki “Authorized redirect URIs” eremuan. Ez erabili gako sekreturik.', 'Kopiatu Client IDa, itsatsi hemen eta sakatu “Gorde eta konektatu”.'],
      microsoft: ['Microsoft Entra-n erregistratu aplikazio pertsonal bat Microsoft kontu pertsonal eta profesionaletarako.', 'Autentifikazioan gehitu beheko birbideratze URIa SPA plataforma gisa.', 'API baimenetan gehitu Microsoft Graph → Delegated permissions → Calendars.ReadWrite. Ez sortu Client Secretrik.', 'Kopiatu Application (client) IDa, itsatsi hemen eta sakatu “Gorde eta konektatu”.']
    },
    de: {
      google: ['Erstelle in Google Cloud ein persönliches Projekt und aktiviere die Google Calendar API.', 'Richte den Zustimmungsbildschirm für persönliche Tests ein und erstelle eine OAuth-Anmeldung vom Typ Webanwendung.', 'Kopiere die untenstehende Weiterleitungs-URI exakt in „Autorisierte Weiterleitungs-URIs“. Verwende kein Client Secret.', 'Kopiere die Client ID, füge sie hier ein und wähle „Speichern und verbinden“.'],
      microsoft: ['Registriere in Microsoft Entra eine persönliche App für private und geschäftliche Microsoft-Konten.', 'Füge unter Authentifizierung die untenstehende Weiterleitungs-URI als SPA-Plattform hinzu.', 'Füge unter API-Berechtigungen Microsoft Graph → Delegierte Berechtigungen → Calendars.ReadWrite hinzu. Erstelle kein Client Secret.', 'Kopiere die Application (client) ID, füge sie hier ein und wähle „Speichern und verbinden“.']
    },
    fr: {
      google: ['Dans Google Cloud, créez un projet personnel et activez Google Calendar API.', 'Configurez l’écran de consentement pour les essais personnels et créez un identifiant OAuth de type application Web.', 'Copiez exactement l’URI de redirection ci-dessous dans « URI de redirection autorisées ». N’utilisez aucune clé secrète.', 'Copiez le Client ID, collez-le ici et choisissez « Enregistrer et connecter ».'],
      microsoft: ['Dans Microsoft Entra, enregistrez une application personnelle pour les comptes Microsoft personnels et professionnels.', 'Dans Authentification, ajoutez l’URI de redirection ci-dessous comme plateforme SPA.', 'Dans Autorisations API, ajoutez Microsoft Graph → Autorisations déléguées → Calendars.ReadWrite. Ne créez pas de Client Secret.', 'Copiez l’Application (client) ID, collez-le ici et choisissez « Enregistrer et connecter ».']
    },
    it: {
      google: ['In Google Cloud crea un progetto personale e abilita Google Calendar API.', 'Configura la schermata di consenso per i test personali e crea credenziali OAuth di tipo Applicazione web.', 'Copia esattamente l’URI di reindirizzamento qui sotto in “URI di reindirizzamento autorizzati”. Non usare un Client Secret.', 'Copia il Client ID, incollalo qui e scegli “Salva e connetti”.'],
      microsoft: ['In Microsoft Entra registra un’app personale per account Microsoft personali e aziendali.', 'In Autenticazione aggiungi l’URI di reindirizzamento qui sotto come piattaforma SPA.', 'In Autorizzazioni API aggiungi Microsoft Graph → Autorizzazioni delegate → Calendars.ReadWrite. Non creare un Client Secret.', 'Copia l’Application (client) ID, incollalo qui e scegli “Salva e connetti”.']
    },
    pt: {
      google: ['No Google Cloud cria um projeto pessoal e ativa a Google Calendar API.', 'Configura o ecrã de consentimento para testes pessoais e cria credenciais OAuth de tipo Aplicação Web.', 'Copia exatamente o URI de redirecionamento abaixo em “URIs de redirecionamento autorizados”. Não uses Client Secret.', 'Copia o Client ID, cola-o aqui e seleciona “Guardar e ligar”.'],
      microsoft: ['No Microsoft Entra regista uma aplicação pessoal para contas Microsoft pessoais e profissionais.', 'Em Autenticação adiciona o URI de redirecionamento abaixo como plataforma SPA.', 'Em Permissões de API adiciona Microsoft Graph → Permissões delegadas → Calendars.ReadWrite. Não cries Client Secret.', 'Copia o Application (client) ID, cola-o aqui e seleciona “Guardar e ligar”.']
    },
    gl: {
      google: ['En Google Cloud crea un proxecto persoal e activa Google Calendar API.', 'Configura a pantalla de consentimento para probas persoais e crea unha credencial OAuth de tipo Aplicación web.', 'Copia exactamente a URI de redirección de abaixo en “URIs de redirección autorizados”. Non uses unha clave secreta.', 'Copia o Client ID, pégao aquí e preme “Gardar e conectar”.'],
      microsoft: ['En Microsoft Entra rexistra unha aplicación persoal para contas Microsoft persoais e profesionais.', 'En Autenticación engade a URI de redirección de abaixo como plataforma SPA.', 'En Permisos API engade Microsoft Graph → Permisos delegados → Calendars.ReadWrite. Non crees un Client Secret.', 'Copia o Application (client) ID, pégao aquí e preme “Gardar e conectar”.']
    }
  };
  return (steps[getLanguage()] || steps.es)[provider];
}

function calendarPermissionDetails(provider) {
  return provider === 'microsoft'
    ? [
      ['login.microsoftonline.com', t('calendarPermissionLogin')],
      ['graph.microsoft.com', t('calendarPermissionSync')]
    ]
    : [
      ['accounts.google.com', t('calendarPermissionLogin')],
      ['oauth2.googleapis.com', t('calendarPermissionToken')],
      ['www.googleapis.com', t('calendarPermissionSync')]
    ];
}

async function finishPersonalCalendarConnection(provider, clientId) {
  const service = provider === 'google' ? 'Google Calendar' : 'Outlook / Microsoft 365';
  try {
    await connectPersonalCalendar(provider, clientId);
    toast(`${service}: ${t('connectionReady')}`, 'success');
    openTaskManager('calendar');
  } catch (error) {
    toast(error.message || t('calendarConnectionFailed'), 'error');
  }
}

function openCalendarPermissionExplanation(provider, clientId) {
  const service = provider === 'google' ? 'Google Calendar' : 'Outlook / Microsoft 365';
  const modal = el('div', { class: 'modal calendar-guide-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(
    el('h2', { class: 'modal-title', id: 'modalTitle', text: t('calendarPermissionTitle', { service }) }),
    el('button', { class: 'modal-close', 'aria-label': t('close'), html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: () => openCalendarSetupGuide(provider, clientId) })
  );
  const body = el('div', { class: 'modal-body calendar-guide-body' });
  body.appendChild(el('p', { class: 'calendar-guide-lead', text: t('calendarPermissionIntro') }));
  const section = el('section', { class: 'calendar-guide-section' });
  section.appendChild(el('h3', { text: t('calendarPermissionServices') }));
  section.appendChild(el('ul', { class: 'calendar-guide-steps' }, calendarPermissionDetails(provider).map(([domain, purpose]) => el('li', null, [el('code', { text: domain }), ` — ${purpose}`]))));
  body.append(section, el('p', { class: 'task-integration-note', text: t('calendarPermissionNoAccess') }));
  const footer = el('div', { class: 'modal-footer' });
  footer.append(
    el('button', { class: 'btn secondary', text: t('backToBoard'), onclick: () => openCalendarSetupGuide(provider, clientId) }),
    el('button', { class: 'btn primary', text: t('calendarPermissionContinue'), onclick: () => finishPersonalCalendarConnection(provider, clientId) })
  );
  modal.append(header, body, footer);
  openModal(modal);
}

async function openCalendarSetupGuide(provider, draftClientId = '') {
  const google = provider === 'google';
  const service = google ? 'Google Calendar' : 'Outlook / Microsoft 365';
  const modal = el('div', { class: 'modal calendar-guide-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: `Conectar ${service}` }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: () => openTaskManager('calendar') }));
  const body = el('div', { class: 'modal-body calendar-guide-body' });
  const connection = personalCalendarConnections[provider] || {};
  body.appendChild(el('p', { class: 'calendar-guide-lead', text: t('calendarGuideLead') }));
  const setup = el('section', { class: 'calendar-guide-section' });
  setup.append(el('h3', { text: t('personalConnection') }));
  const clientInput = el('input', { class: 'form-input', type: 'text', value: draftClientId || connection.clientId || '', placeholder: google ? '1234567890-xxxx.apps.googleusercontent.com' : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', autocomplete: 'off', spellcheck: 'false' });
  setup.append(el('ol', { class: 'calendar-guide-steps' }, calendarSetupSteps(provider).map((text) => el('li', { text }))));
  setup.appendChild(externalLink(google ? 'https://console.cloud.google.com/apis/credentials' : 'https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade', google ? 'Abrir Google Cloud' : 'Abrir Microsoft Entra'));
  const redirect = currentCalendarRedirectUri();
  const redirectGroup = el('div', { class: 'calendar-redirect-row' });
  redirectGroup.append(el('span', { class: 'form-label', text: t('redirectUri') }), el('code', { class: 'calendar-redirect-value', text: redirect || '—' }), el('button', { class: 'task-provider-btn', type: 'button', text: t('copy'), onclick: () => { if (navigator.clipboard && redirect) navigator.clipboard.writeText(redirect).then(() => toast(t('redirectCopied'), 'success')).catch(() => {}); } }));
  body.append(setup, redirectGroup, taskFormGroup(t('clientId'), clientInput), el('p', { class: 'task-integration-note', text: t('calendarSecurityResponsibility') }));
  if (connection.clientId) body.appendChild(el('p', { class: 'calendar-renew-help', text: t('calendarRenewHelp') }));
  const footer = el('div', { class: 'modal-footer' });
  if (connection.clientId) footer.appendChild(el('button', { class: 'btn danger', text: t('disconnect'), onclick: async () => { await disconnectPersonalCalendar(provider); toast(`${service}: ${t('disconnected')}`, 'success'); openTaskManager('calendar'); } }));
  footer.append(el('button', { class: 'btn secondary', text: t('backToBoard'), onclick: () => openTaskManager('calendar') }));
  footer.appendChild(el('button', { class: 'btn primary', text: t('saveConnect'), onclick: () => {
    const clientId = clientInput.value.trim();
    if (clientId.length < 8) { toast(t('calendarClientIdRequired'), 'error'); return; }
    openCalendarPermissionExplanation(provider, clientId);
  }}));
  modal.append(header, body, footer);
  openModal(modal);
}

/* ---------- Notas adhesivas ---------- */
const STICKY_COLORS = ['#F5B44C', '#FF8FA3', '#8E58D7', '#65B8FF', '#63D297', '#4EC9B4'];
const STICKY_FONTS = [
  { value: 'system-ui', label: 'Sistema' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' },
  { value: 'Courier New, monospace', label: 'Monoespaciada' }
];
const STICKY_FONT_SIZES = [
  { value: '12px', label: '12 px' },
  { value: '14px', label: '14 px' },
  { value: '16px', label: '16 px' },
  { value: '18px', label: '18 px' },
  { value: '20px', label: '20 px' },
  { value: '24px', label: '24 px' },
  { value: '28px', label: '28 px' },
  { value: '32px', label: '32 px' }
];

function stickyNotes() {
  return Array.isArray(state.data.stickyNotes) ? state.data.stickyNotes : [];
}

function sanitizeStickyHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'H1', 'H2', 'H3', 'P', 'BR', 'UL', 'OL', 'LI', 'LABEL', 'SPAN', 'IMG', 'A', 'CODE', 'BLOCKQUOTE', 'HR', 'INPUT', 'BUTTON']);
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !allowed.has(child.tagName)) {
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
        return;
      }
      [...child.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';
        const allowedStyle = name === 'style' && value.split(';').filter(Boolean).every((rule) => /^(?:color|font-family|font-size)\s*:\s*(?!.*(?:url\s*\(|expression\s*\(|javascript\s*:))[^;]+$/i.test(rule.trim()));
        const allowedImage = child.tagName === 'IMG' && name === 'src' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=\s]+$/i.test(value) && value.length <= 180000;
        const allowedLink = child.tagName === 'A' && name === 'href' && /^https?:\/\/[^\s<>"']+$/i.test(value);
        const allowedCheck = child.tagName === 'INPUT' && name === 'type' && value === 'checkbox';
        const allowedChecked = child.tagName === 'INPUT' && name === 'checked';
        const allowedDisabled = child.tagName === 'INPUT' && name === 'disabled';
        const allowedTaskIndex = child.tagName === 'INPUT' && name === 'data-markdown-task';
        const allowedTaskButton = child.tagName === 'BUTTON' && ['type', 'data-markdown-task', 'aria-pressed'].includes(name);
        const allowedTaskLine = child.tagName === 'LI' && ['data-markdown-task', 'role', 'tabindex', 'aria-checked'].includes(name);
        const allowedClass = name === 'class' && value.split(/\s+/).every((token) => ['markdown-task', 'done', 'markdown-task-label', 'markdown-task-checkbox', 'markdown-task-text'].includes(token));
        if (!allowedStyle && !allowedImage && !allowedLink && !allowedCheck && !allowedChecked && !allowedDisabled && !allowedTaskIndex && !allowedTaskButton && !allowedTaskLine && name !== 'alt' && !allowedClass) child.removeAttribute(attr.name);
      });
      if (child.tagName === 'A') { child.setAttribute('target', '_blank'); child.setAttribute('rel', 'noopener noreferrer'); }
      walk(child);
    });
  };
  walk(template.content);
  return template.innerHTML;
}

function renderStickyMarkdown(markdown) {
  let taskIndex = 0;
  const inline = (value) => escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>');
  const output = [];
  let inList = false;
  String(markdown || '').replace(/\r/g, '').split('\n').forEach((line) => {
    const closeList = () => { if (inList) { output.push('</ul>'); inList = false; } };
    if (/^\s*[-*+]\s+/.test(line)) {
      if (!inList) { output.push('<ul>'); inList = true; }
      const item = line.replace(/^\s*[-*+]\s+/, '');
      const task = item.match(/^\[([ xX])\]\s+(.*)$/);
      const completed = task && task[1].toLowerCase() === 'x';
      // Casilla nativa del navegador: permanece visible en todos los temas y
      // conserva de forma natural el clic, el foco y el uso con teclado.
      output.push(task ? `<li class="markdown-task${completed ? ' done' : ''}"><label class="markdown-task-label"><input class="markdown-task-checkbox" type="checkbox" data-markdown-task="${taskIndex++}"${completed ? ' checked' : ''}><span class="markdown-task-text">${inline(task[2])}</span></label></li>` : `<li>${inline(item)}</li>`);
      return;
    }
    closeList();
    if (!line.trim()) { output.push(''); return; }
    if (/^```/.test(line)) { output.push('<pre><code>'); return; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); return; }
    if (/^>\s?/.test(line)) { output.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); return; }
    if (/^---+$/.test(line.trim())) { output.push('<hr>'); return; }
    output.push(`<p>${inline(line)}</p>`);
  });
  if (inList) output.push('</ul>');
  return sanitizeStickyHtml(output.join('\n').replace(/<pre><code>\n?/g, '<p><code>').replace(/\n?<\/code>/g, '</code></p>'));
}

function recoverMarkdownFromStickyHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html || '');
  const items = [...template.content.querySelectorAll('li')];
  return items.map((item) => {
    const input = item.querySelector('input[type="checkbox"]');
    const text = String(item.textContent || '').trim();
    return `- [${input?.checked ? 'x' : ' '}] ${text}`;
  }).join('\n');
}

function isMarkdownStickyNote(note) {
  return note?.mode === 'markdown' || !!String(note?.markdown || '').trim() || /markdown-task|type=["']checkbox["']/i.test(String(note?.html || ''));
}

function ensureStickyMarkdownSource(note) {
  if (!note || String(note.markdown || '').trim() || !isMarkdownStickyNote(note)) return;
  const recovered = recoverMarkdownFromStickyHtml(note.html);
  if (recovered) {
    note.markdown = recovered;
    note.mode = 'markdown';
    saveData();
  }
}

function renderStickyNote(note) {
  ensureStickyMarkdownSource(note);
  return isMarkdownStickyNote(note) && String(note?.markdown || '').trim() ? renderStickyMarkdown(note.markdown) : sanitizeStickyHtml(note?.html || '');
}

function updateMarkdownTask(markdown, index, checked) {
  let current = -1;
  return String(markdown || '').replace(/^(\s*[-*+]\s+)\[([ xX])\](\s+)/gm, (full, prefix, state, space) => {
    current += 1;
    return current === index ? `${prefix}[${checked ? 'x' : ' '}]${space}` : full;
  });
}

function bindStickyMarkdownTasks(container, note) {
  container.querySelectorAll('.markdown-task-checkbox[data-markdown-task]').forEach((control) => {
    const toggleTask = () => {
      const index = Number(control.dataset.markdownTask);
      const checked = control.checked;
      ensureStickyMarkdownSource(note);
      note.markdown = updateMarkdownTask(note.markdown, index, checked);
      note.mode = 'markdown';
      note.html = renderStickyMarkdown(note.markdown);
      note.updatedAt = Date.now();
      saveData();
      control.closest('.markdown-task')?.classList.toggle('done', checked);
    };
    control.addEventListener('change', toggleTask);
  });
}

function optimizeStickyImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(png|jpeg|webp)$/i.test(file.type)) { reject(new Error('Selecciona una imagen PNG, JPG o WebP.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('La imagen no es válida.'));
      image.onload = () => {
        const max = 900;
        const scale = Math.min(max / image.width, max / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        let result = canvas.toDataURL('image/jpeg', 0.78);
        if (result.length > 140000) result = canvas.toDataURL('image/jpeg', 0.58);
        if (result.length > 170000) { reject(new Error('La imagen es demasiado grande para una nota.')); return; }
        resolve(result);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function openStickyNotes() {
  setExternalDropZoneLocked(true);
  const modal = el('div', { class: 'modal sticky-notes-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('div', null, [el('h2', { class: 'modal-title', id: 'modalTitle', text: t('stickyNotes') }), el('p', { class: 'task-manager-subtitle', text: t('stickySubtitle') })]), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="6" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body sticky-notes-body' });
  const toolbar = el('div', { class: 'sticky-toolbar' });
  toolbar.append(el('span', { class: 'sticky-count', text: t('noteCount', { count: stickyNotes().length }) }), el('button', { class: 'btn primary', html: ICONS.plus + `<span>${t('newNote')}</span>`, onclick: () => openStickyEditor(null) }));
  const grid = el('div', { class: 'sticky-grid' });
  const list = stickyNotes().slice().sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  if (!list.length) grid.appendChild(el('p', { class: 'sticky-empty', text: t('stickyEmpty') }));
  list.forEach((note) => grid.appendChild(buildStickyCard(note)));
  body.append(toolbar, grid);
  modal.append(header, body);
  openModal(modal);
}

function buildStickyCard(note) {
  const card = el('article', { class: 'sticky-card', style: `--sticky-color:${note.color}` });
  const top = el('div', { class: 'sticky-card-top' });
  top.append(el('strong', { text: note.title || t('untitledNote') }), el('span', { class: 'sticky-pin', text: note.pinned ? t('pinnedNote') : '' }));
  const isMarkdown = isMarkdownStickyNote(note);
  const content = el('div', { class: `sticky-card-content${isMarkdown ? ' markdown-rendered' : ''}`, html: renderStickyNote(note) || `<p>${t('emptyNote')}</p>` });
  content.style.fontFamily = note.fontFamily || 'system-ui';
  content.style.fontSize = note.fontSize || '16px';
  if (isMarkdown) bindStickyMarkdownTasks(content, note);
  const actions = el('div', { class: 'sticky-card-actions' });
  actions.append(el('button', { class: 'task-card-btn', text: t('edit'), onclick: () => openStickyEditor(note) }), el('button', { class: 'task-card-btn', text: note.pinned ? t('unpin') : t('pin'), onclick: () => { note.pinned = !note.pinned; note.updatedAt = Date.now(); saveData(); openStickyNotes(); } }), el('button', { class: 'task-card-btn sticky-delete', text: t('delete'), onclick: () => { const trashEntry = addToTrash('sticky-note', note.title || t('untitledNote'), { note }); state.data.stickyNotes = stickyNotes().filter((item) => item.id !== note.id); saveData(); notifyTrashEntry(trashEntry); openStickyNotes(); } }));
  card.append(top, content, actions);
  return card;
}

function openStickyEditor(existing, options = {}) {
  const returnToNotes = options.returnToNotes !== false;
  const exitEditor = () => { if (returnToNotes) openStickyNotes(); else closeModal(); };
  const note = existing || { title: '', html: '', markdown: '', mode: 'rich', color: STICKY_COLORS[0], fontFamily: 'system-ui', fontSize: '16px' };
  ensureStickyMarkdownSource(note);
  const modal = el('div', { class: 'modal sticky-editor-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: existing ? t('editNote') : t('newNote') }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: exitEditor }));
  const body = el('div', { class: 'modal-body sticky-editor-body' });
  const title = el('input', { class: 'form-input', type: 'text', value: note.title, placeholder: t('noteTitlePlaceholder'), maxlength: '160' });
  const editor = el('div', { class: 'sticky-editor', contenteditable: 'true', role: 'textbox', 'aria-label': t('noteContent') });
  editor.innerHTML = sanitizeStickyHtml(note.html);
  editor.style.fontFamily = note.fontFamily || 'system-ui';
  editor.style.fontSize = note.fontSize || '16px';
  const markdownInput = el('textarea', { class: 'sticky-markdown-editor', placeholder: '# Título\n\nEscribe con **negrita**, listas o enlaces…' });
  // Igual que en el panel: el contenido inicial de textarea se aplica como
  // propiedad para conservar siempre la fuente Markdown ya guardada.
  markdownInput.value = note.markdown || '';
  const markdownPreview = el('article', { class: 'sticky-markdown-preview' });
  let editorMode = options.mode || (isMarkdownStickyNote(note) ? 'markdown' : 'rich');
  if (!['rich', 'markdown'].includes(editorMode)) editorMode = 'rich';
  markdownInput.dataset.enabled = editorMode === 'markdown' ? 'true' : 'false';
  const formatBar = el('div', { class: 'sticky-format-bar' });
  const command = (label, cmd, value) => el('button', { class: 'sticky-format-btn', type: 'button', text: label, onclick: () => { editor.focus(); document.execCommand(cmd, false, value); } });
  formatBar.append(command('B', 'bold'), command('I', 'italic'), command(t('heading'), 'formatBlock', 'H2'), command(t('list'), 'insertUnorderedList'));
  const fontFamilySelect = el('select', { class: 'sticky-format-select', title: t('fontFamily'), 'aria-label': t('fontFamily') });
  STICKY_FONTS.forEach((font) => fontFamilySelect.appendChild(el('option', { value: font.value, text: font.label })));
  fontFamilySelect.value = note.fontFamily && STICKY_FONTS.some((font) => font.value === note.fontFamily) ? note.fontFamily : 'system-ui';
  fontFamilySelect.addEventListener('change', () => { editor.focus(); document.execCommand('styleWithCSS', false, true); document.execCommand('fontName', false, fontFamilySelect.value); editor.style.fontFamily = fontFamilySelect.value; });
  const fontSizeSelect = el('select', { class: 'sticky-format-select sticky-format-size', title: t('fontSize'), 'aria-label': t('fontSize') });
  STICKY_FONT_SIZES.forEach((size) => fontSizeSelect.appendChild(el('option', { value: size.value, text: size.label })));
  fontSizeSelect.value = note.fontSize && STICKY_FONT_SIZES.some((size) => size.value === note.fontSize) ? note.fontSize : '16px';
  fontSizeSelect.addEventListener('change', () => { editor.focus(); document.execCommand('styleWithCSS', false, true); document.execCommand('fontSize', false, fontSizeSelect.value); editor.style.fontSize = fontSizeSelect.value; });
  const textColor = el('input', { class: 'sticky-text-color', type: 'color', value: '#211c31', title: 'Color de texto' });
  textColor.addEventListener('input', () => { editor.focus(); document.execCommand('foreColor', false, textColor.value); });
  const imageInput = el('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', hidden: '' });
  const imageBtn = el('button', { class: 'sticky-format-btn', type: 'button', text: t('image'), onclick: () => imageInput.click() });
  imageInput.addEventListener('change', async () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    try { const image = await optimizeStickyImage(file); editor.focus(); document.execCommand('insertImage', false, image); } catch (error) { toast(error.message || 'No se pudo insertar la imagen', 'error'); } finally { imageInput.value = ''; }
  });
  formatBar.append(fontFamilySelect, fontSizeSelect, textColor, imageBtn);
  const markdownMode = el('button', { class: 'sticky-format-btn', type: 'button', text: 'Markdown' });
  const previewMode = el('button', { class: 'sticky-format-btn', type: 'button', text: 'Vista previa' });
  const richMode = el('button', { class: 'sticky-format-btn', type: 'button', text: 'Formato' });
  const setEditorMode = (mode) => {
    editorMode = mode;
    editor.classList.toggle('hidden', mode !== 'rich');
    markdownInput.classList.toggle('hidden', mode !== 'markdown');
    markdownPreview.classList.toggle('hidden', mode !== 'preview');
    fontFamilySelect.classList.toggle('hidden', mode !== 'rich');
    fontSizeSelect.classList.toggle('hidden', mode !== 'rich');
    formatBar.querySelectorAll('.sticky-format-btn').forEach((button) => button.classList.remove('active'));
    (mode === 'markdown' ? markdownMode : mode === 'preview' ? previewMode : richMode).classList.add('active');
    if (mode === 'preview') markdownPreview.innerHTML = markdownInput.dataset.enabled === 'true' ? renderStickyMarkdown(markdownInput.value) : sanitizeStickyHtml(editor.innerHTML);
    if (mode === 'preview' && markdownInput.dataset.enabled === 'true') bindStickyMarkdownTasks(markdownPreview, note);
  };
  markdownMode.addEventListener('click', () => { markdownInput.dataset.enabled = 'true'; setEditorMode('markdown'); });
  previewMode.addEventListener('click', () => setEditorMode('preview'));
  richMode.addEventListener('click', () => { markdownInput.dataset.enabled = 'false'; setEditorMode('rich'); });
  formatBar.append(richMode, markdownMode, previewMode);
  const colors = el('div', { class: 'sticky-colors' });
  let selectedColor = note.color;
  STICKY_COLORS.forEach((color) => {
    const button = el('button', { class: 'color-option' + (color === selectedColor ? ' selected' : ''), type: 'button', style: `background:${color}`, 'aria-label': `Color ${color}` });
    button.addEventListener('click', () => { selectedColor = color; colors.querySelectorAll('.color-option').forEach((item) => item.classList.toggle('selected', item === button)); });
    colors.appendChild(button);
  });
  const showInPanel = el('input', { type: 'checkbox', checked: !!note.showInPanel });
  const showInPanelLabel = el('label', { class: 'settings-toggle-row sticky-panel-toggle' });
  showInPanelLabel.append(showInPanel, el('span', { class: 'settings-toggle-copy' }, [el('strong', { text: t('showInPanel') }), el('span', { class: 'form-hint', text: t('notesVisible') })]));
  const panelHeight = el('input', { class: 'form-input', type: 'number', min: '120', max: '640', step: '10', value: String(Math.max(120, Math.min(640, Number(note.panelHeight) || 180))) });
  const panelHeightGroup = el('div', { class: 'form-group' });
  panelHeightGroup.append(el('span', { class: 'form-label', text: 'Altura en Notas visibles (px)' }), panelHeight, el('span', { class: 'form-hint', text: 'Entre 120 y 640 px. Se aplica cuando esta nota se muestra en la barra lateral.' }));
  body.append(title, formatBar, editor, markdownInput, markdownPreview, imageInput, el('div', { class: 'form-group' }, [el('span', { class: 'form-label', text: t('noteColor') }), colors]), showInPanelLabel, panelHeightGroup);
  setEditorMode(editorMode);
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn secondary', text: t('cancel'), onclick: exitEditor }), el('button', { class: 'btn primary', text: t('saveNote'), onclick: () => {
    if (!existing && stickyNotes().length >= 40) { toast('Para mantener el dashboard ligero, el límite es de 40 notas.', 'info'); return; }
    const useMarkdown = markdownInput.dataset.enabled === 'true';
    const markdown = useMarkdown ? markdownInput.value.trim() : '';
    const html = useMarkdown ? renderStickyMarkdown(markdown) : sanitizeStickyHtml(editor.innerHTML);
    if (html.length > 180000) { toast('Esta nota contiene demasiadas imágenes o texto. Reduce su contenido.', 'error'); return; }
    const saved = existing || { id: uid(), createdAt: Date.now(), order: stickyNotes().length, pinned: false };
    Object.assign(saved, { title: title.value.trim(), html, markdown, mode: useMarkdown ? 'markdown' : 'rich', fontFamily: fontFamilySelect.value, fontSize: fontSizeSelect.value, color: selectedColor, showInPanel: showInPanel.checked, panelHeight: Math.max(120, Math.min(640, Number(panelHeight.value) || 180)), updatedAt: Date.now() });
    if (!existing) state.data.stickyNotes.push(saved);
    saveData();
    renderPanel();
    exitEditor();
  }}));
  modal.append(header, body, footer);
  openModal(modal);
  setTimeout(() => title.focus(), 20);
}

/* ============================================================
   WIDGETS (reproductor, clima, calendario) + fondo de pantalla
   ============================================================ */

function processWallpaperFile(file, cb) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1920;
      let width = img.width;
      let height = img.height;
      if (width > MAX) {
        height = Math.round((height * MAX) / width);
        width = MAX;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      let dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      if (dataUrl.length > 1400000) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      }
      cb(dataUrl);
    };
    img.onerror = () => toast('No se pudo leer la imagen', 'error');
    img.src = reader.result;
  };
  reader.onerror = () => toast('No se pudo leer la imagen', 'error');
  reader.readAsDataURL(file);
}

/* El gestor de tareas locales no debe mostrar ni sincronizar eventos de Calendar. */
function openTaskManager(view) {
  if (view === 'calendar') return openCalendarManager('calendar');
  setExternalDropZoneLocked(true);
  const modal = el('div', { class: 'modal task-manager-modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  const body = el('div', { class: 'modal-body task-manager-body' });
  const toolbar = el('div', { class: 'task-manager-toolbar' });
  const content = el('div', { class: 'task-manager-content' });
  const addBtn = el('button', { class: 'btn primary', html: ICONS.plus + '<span>Nueva tarea local</span>' });
  const projectsBtn = el('button', { class: 'btn secondary', text: 'Mis proyectos', onclick: () => { closeModal(); openProjectManager('ideas'); } });
  const googleBtn = el('button', { class: 'btn secondary', text: 'Google Tasks', onclick: () => openGoogleTasksSetup() });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Tareas locales' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', text: '×', onclick: closeModal }));
  toolbar.append(addBtn);
  body.append(toolbar, content); modal.append(header, body);
  const render = () => { content.textContent = ''; renderSimpleLocalTasks(content, render); };
  addBtn.addEventListener('click', () => {
    const input = el('input', {class:'form-input',placeholder:'Escribe una tarea',maxlength:'180'});
    const form = el('div',{class:'modal'},[el('div',{class:'modal-body'},[input]),el('div',{class:'modal-footer'},[
      el('button',{class:'btn',text:'Cancelar',onclick:()=>openTaskManager()}),
      el('button',{class:'btn primary',text:'Añadir',onclick:()=>{if(!input.value.trim())return;state.data.tasks.push({id:uid(),title:input.value.trim(),status:'todo',createdAt:Date.now(),updatedAt:Date.now(),order:tasks().length});saveData();openTaskManager();}})
    ])]); openModal(form); input.focus();
  });
  render(); openModal(modal);
  activeTaskManagerRefresh = () => { if (!document.body.contains(modal)) { activeTaskManagerRefresh = null; return; } render(); };
}

function openGoogleTasksSetup() {
  const modal = el('div', { class: 'modal', role: 'dialog' });
  modal.append(el('div', { class: 'modal-header' }, [el('h2', { class: 'modal-title', text: 'Google Tasks' }), el('button', { class: 'modal-close', text: '×', onclick: closeModal })]), el('div', { class: 'modal-body' }, [el('p', { text: 'Google Tasks usa una API y un permiso OAuth diferentes de Google Calendar. Los eventos de Calendar permanecen solo en el calendario.' }), el('p', { class: 'form-hint', text: 'Activa Google Tasks API en el mismo proyecto OAuth y autoriza el alcance de tareas. Esta conexión no convertirá ni sincronizará proyectos locales.' })]), el('div', { class: 'modal-footer' }, [el('button', { class: 'btn', text: 'Volver', onclick: () => openTaskManager() })]));
  openModal(modal);
}

function initWidgets() {
  initWidgetToggles();
  initShortcutWidgets();
  initPlayerWidget();
  initCalendarWidget();
  if (els.widgetTasksBtn) els.widgetTasksBtn.addEventListener('click', () => openTaskManager());
  if (els.widgetNotesBtn) els.widgetNotesBtn.addEventListener('click', () => openStickyNotes());
}

function initShortcutWidgets() {
  const buttons = {
    brave: els.widgetBraveBtn,
    firefox: els.widgetFirefoxBtn,
    chrome: els.widgetChromeBtn,
    edge: els.widgetEdgeBtn,
    windows: els.widgetWindowsBtn,
    linux: els.widgetLinuxBtn
  };
  Object.entries(buttons).forEach(([key, btn]) => {
    if (!btn) return;
    btn.addEventListener('click', () => openShortcutsModal(key));
  });
}

function openShortcutsModal(key) {
  const data = SHORTCUTS[key];
  if (!data) return;

  const modal = el('div', { class: 'modal shortcuts-modal' });
  const header = el('div', { class: 'modal-header' });
  header.append(
    el('h2', { class: 'modal-title', text: data.label }),
    el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal })
  );

  const body = el('div', { class: 'modal-body shortcuts-body' });
  body.append(el('p', { class: 'modal-subtitle', text: 'Pulsa una fila para copiarla' }));

  data.sections.forEach((section) => {
    const details = el('details', { class: 'shortcut-group', open: '' });
    details.appendChild(el('summary', { class: 'shortcut-group-summary', text: section.name }));
    const list = el('ul', { class: 'shortcut-list' });
    section.items.forEach((item) => {
      const li = el('li');
      const btn = el('button', { class: 'shortcut-item', 'aria-label': `Copiar ${item.name}` });
      btn.append(el('span', { class: 'shortcut-item-name', text: item.name }));
      btn.append(el('code', { class: 'shortcut-item-keys', text: item.cmd || item.keys }));
      btn.addEventListener('click', () => copyShortcut(item));
      li.appendChild(btn);
      list.appendChild(li);
    });
    details.appendChild(list);
    body.appendChild(details);
  });

  modal.append(header, body);
  openModal(modal);
}

function copyShortcut(item) {
  const text = item.cmd || item.keys;
  const done = () => toast(`Copiado: ${text}`, 'success');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    done();
  } catch {}
  document.body.removeChild(ta);
}

function initWidgetToggles() {
  const widgets = [
    { btn: els.widgetPlayerBtn, panel: els.widgetPlayer },
    { btn: els.widgetWeatherBtn, panel: els.widgetWeather },
    { btn: els.widgetCalendarBtn, panel: els.widgetCalendar }
  ];
  widgets.forEach(({ btn, panel }) => {
    btn.addEventListener('click', () => {
      const open = !panel.classList.contains('hidden');
      widgets.forEach((w) => {
        w.btn.classList.remove('active');
        w.btn.setAttribute('aria-expanded', 'false');
        w.panel.classList.add('hidden');
      });
      setPanelCalendarWidgetOpen(false);
      if (!open) {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.remove('hidden');
        if (panel === els.widgetWeather) loadWeather();
        if (panel === els.widgetCalendar) {
          setPanelCalendarWidgetOpen(true);
          renderCalendar();
        }
      }
    });
  });
}

let panelScrollBeforeCalendar = null;

function setPanelCalendarWidgetOpen(open) {
  if (!els.panel) return;
  if (open) {
    if (panelScrollBeforeCalendar === null) panelScrollBeforeCalendar = els.panel.scrollTop;
    els.panel.classList.add('calendar-widget-open');
    return;
  }
  if (!els.panel.classList.contains('calendar-widget-open')) return;
  els.panel.classList.remove('calendar-widget-open');
  const previousScroll = panelScrollBeforeCalendar;
  panelScrollBeforeCalendar = null;
  if (previousScroll !== null) requestAnimationFrame(() => { els.panel.scrollTop = previousScroll; });
}

/* ---------- Reproductor ---------- */
let playerAudio = null;
let playerMode = 'none';
let playlist = [];
let playlistIndex = -1;

function initPlayerWidget() {
  playerAudio = new Audio();
  const audio = playerAudio;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'audio/*';
  fileInput.hidden = true;
  const dirInput = document.createElement('input');
  dirInput.type = 'file';
  dirInput.webkitdirectory = true;
  dirInput.hidden = true;
  document.body.appendChild(fileInput);
  document.body.appendChild(dirInput);

  els.playerSelectBtn.addEventListener('click', () => fileInput.click());
  els.playerFolderBtn.addEventListener('click', () => dirInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    playFiles([file]);
    fileInput.value = '';
  });

  dirInput.addEventListener('change', () => {
    const files = dirInput.files ? Array.from(dirInput.files) : [];
    const audioFiles = files.filter(isAudioFile);
    if (audioFiles.length === 0) {
      toast('No se encontraron archivos de audio en la carpeta', 'error');
      return;
    }
    audioFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    playFiles(audioFiles);
    dirInput.value = '';
  });

  els.playerPlayBtn.addEventListener('click', playerToggle);
  els.playerPrevBtn.addEventListener('click', playerPrev);
  els.playerNextBtn.addEventListener('click', playerNext);

  audio.addEventListener('play', () => { setPlayerIcon(true); syncMediaSessionState(); });
  audio.addEventListener('pause', () => { setPlayerIcon(false); syncMediaSessionState(); });
  audio.addEventListener('ended', playerNext);
  audio.addEventListener('timeupdate', updatePlayerUI);
  audio.addEventListener('loadedmetadata', updatePlayerUI);
  audio.addEventListener('error', () => {
    if (playerMode !== 'none') {
      toast('No se pudo reproducir el audio', 'error');
      setPlayerIcon(false);
    }
  });

  els.playerSeek.addEventListener('input', applySeek);
  els.playerSeek.addEventListener('change', applySeek);

  updateNavButtons();
  setupMediaSession();
}

function playFiles(files) {
  if (!files || files.length === 0) return;
  playlist.forEach((t) => {
    if (t.url && t.url.startsWith('blob:')) URL.revokeObjectURL(t.url);
  });
  playlist = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), size: f.size }));
  playlistIndex = -1;
  playerMode = playlist.length > 1 ? 'folder' : 'file';
  playTrack(0);
}

function playTrack(i) {
  if (i < 0 || i >= playlist.length) return;
  playlistIndex = i;
  const t = playlist[i];
  playerAudio.src = t.url;
  playerAudio.load();
  els.playerTrack.textContent = t.name;
  els.playerMeta.textContent = playlist.length > 1
    ? t('trackPosition', { current: i + 1, total: playlist.length, size: formatSize(t.size) })
    : formatSize(t.size);
  resetPlayerUI();
  setPlayerIcon(true);
  updateNavButtons();
  playerAudio.play().catch(() => {});
  updateMediaSession({
    title: t.name,
    artist: t('localAudio'),
    album: playlist.length > 1 ? t('playlist') : ''
  });
}

function updateNavButtons() {
  els.playerPrevBtn.disabled = !(playlist.length > 0 && playlistIndex > 0);
  els.playerNextBtn.disabled = !(playlist.length > 0 && playlistIndex < playlist.length - 1);
}

function playerToggle() {
  if (playerMode === 'none') {
    els.playerSelectBtn.click();
    return;
  }
  if (isPlayerPlaying()) {
    playerPause();
  } else {
    playerPlay();
  }
}

function isPlayerPlaying() {
  return playerAudio.src ? !playerAudio.paused : false;
}

function playerPlay() {
  if (!playerAudio.src) {
    els.playerSelectBtn.click();
    return;
  }
  playerAudio.play().catch(() => {});
}

function playerPause() {
  playerAudio.pause();
}

function playerSeek(sec) {
  if (playerAudio.duration && isFinite(playerAudio.duration)) {
    playerAudio.currentTime = sec;
  }
}

function playerPrev() {
  if (playlist.length === 0) return;
  if (playlistIndex > 0) {
    playTrack(playlistIndex - 1);
  } else if (playerAudio.currentTime > 3) {
    playerAudio.currentTime = 0;
  }
}

function playerNext() {
  if (playlist.length === 0) return;
  if (playlistIndex < playlist.length - 1) {
    playTrack(playlistIndex + 1);
  } else {
    setPlayerIcon(false);
    syncMediaSessionState();
  }
}

function applySeek() {
  const pct = Number(els.playerSeek.value) || 0;
  if (playerAudio.duration && isFinite(playerAudio.duration)) {
    playerAudio.currentTime = (pct / 100) * playerAudio.duration;
  }
}

function setupMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const set = (action, handler) => {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch (e) {}
  };
  set('play', playerPlay);
  set('pause', playerPause);
  set('previoustrack', playerPrev);
  set('nexttrack', playerNext);
  set('seekto', (d) => playerSeek(d.seekTime));
}

function updateMediaSession(meta) {
  if (!('mediaSession' in navigator)) return;
  try {
    if (meta) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.title || t('playing'),
        artist: meta.artist || '',
        album: meta.album || '',
        artwork: meta.artwork ? [{ src: meta.artwork, sizes: '480x360' }] : []
      });
      syncMediaSessionState();
    } else {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
    }
  } catch (e) {}
}

function syncMediaSessionState() {
  if (!('mediaSession' in navigator)) return;
  try {
    if (navigator.mediaSession.metadata) {
      navigator.mediaSession.playbackState = isPlayerPlaying() ? 'playing' : 'paused';
    }
  } catch (e) {}
}

function resetPlayerUI() {
  els.playerSeek.value = '0';
  els.playerTime.textContent = '0:00 / 0:00';
}

function updatePlayerUI() {
  const d = playerAudio.duration || 0;
  const t = playerAudio.currentTime || 0;
  if (isFinite(d) && d > 0) {
    els.playerSeek.value = String((t / d) * 100);
  }
  els.playerTime.textContent = fmtTime(t) + ' / ' + fmtTime(d);
}

function setPlayerIcon(playing) {
  els.playerPlayBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
  els.playerPlayBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
}

function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function isAudioFile(f) {
  if (f.type && f.type.startsWith('audio/')) return true;
  return /\.(mp3|ogg|oga|opus|wav|m4a|aac|flac|webm|weba)$/i.test(f.name || '');
}

/* ---------- Clima ---------- */
const WEATHER_CODES = {
  0: ['☀️', 'Despejado'],
  1: ['🌤️', 'Mayormente despejado'],
  2: ['⛅', 'Parcialmente nublado'],
  3: ['☁️', 'Nublado'],
  45: ['🌫️', 'Niebla'],
  48: ['🌫️', 'Bancos de niebla'],
  51: ['🌦️', 'Llovizna ligera'],
  53: ['🌦️', 'Llovizna'],
  55: ['🌧️', 'Llovizna fuerte'],
  56: ['🌧️', 'Llovizna helada'],
  57: ['🌧️', 'Llovizna helada fuerte'],
  61: ['🌧️', 'Lluvia ligera'],
  63: ['🌧️', 'Lluvia'],
  65: ['🌧️', 'Lluvia fuerte'],
  66: ['🌧️', 'Lluvia helada'],
  67: ['🌧️', 'Lluvia helada fuerte'],
  71: ['🌨️', 'Nevada ligera'],
  73: ['🌨️', 'Nevada'],
  75: ['❄️', 'Nevada fuerte'],
  77: ['🌨️', 'Granos de nieve'],
  80: ['🌦️', 'Chubascos ligeros'],
  81: ['🌦️', 'Chubascos'],
  82: ['⛈️', 'Chubascos fuertes'],
  85: ['🌨️', 'Chubascos de nieve'],
  86: ['🌨️', 'Chubascos de nieve fuertes'],
  95: ['⛈️', 'Tormenta'],
  96: ['⛈️', 'Tormenta con granizo'],
  99: ['⛈️', 'Tormenta con granizo fuerte']
};

let weatherLoaded = false;

function loadWeather() {
  if (weatherLoaded) return;
  if (!('geolocation' in navigator)) {
    weatherLoaded = true;
    renderWeatherManual();
    return;
  }
  els.weatherContent.textContent = t('locatingWeather');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      weatherLoaded = true;
      fetchWeather(pos.coords.latitude, pos.coords.longitude, t('yourLocation'));
    },
    () => {
      weatherLoaded = true;
      renderWeatherManual();
    }
  );
}

function fetchWeather(lat, lon, label) {
  els.weatherContent.textContent = t('loadingWeather');
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto';
  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((data) => renderWeatherData(data, label))
    .catch(() => {
      els.weatherContent.textContent = t('weatherUnavailable');
      appendWeatherPlaceForm();
    });
}

function renderWeatherData(data, label) {
  const c = data.current || {};
  const code = WEATHER_CODES[c.weather_code] || ['🌡️', '—'];
  els.weatherContent.textContent = '';
  const city = el('div', { class: 'weather-city' });
  city.innerHTML = ICONS.mapPin;
  city.appendChild(el('span', { text: label }));
  els.weatherContent.append(
    city,
    el('div', {
      class: 'weather-current',
      html: '<span class="weather-icon">' + code[0] + '</span><div><div class="weather-temp">' + Math.round(c.temperature_2m) + '°</div><div class="weather-desc">' + code[1] + '</div></div>'
    }),
    el('div', {
      class: 'weather-details',
      html: '<span>' + t('feelsLike') + ': ' + Math.round(c.apparent_temperature) + '°</span><span>' + t('humidity') + ': ' + c.relative_humidity_2m + '%</span><span>' + t('wind') + ': ' + Math.round(c.wind_speed_10m) + ' km/h</span>'
    })
  );
  appendWeatherPlaceForm();
}

function renderWeatherManual() {
  els.weatherContent.textContent = '';
  els.weatherContent.append(el('p', { class: 'weather-error', text: t('locationUnavailable') }));
  appendWeatherPlaceForm();
}

function appendWeatherPlaceForm() {
  if (els.weatherContent.querySelector('.weather-place-form')) return;
  const form = el('div', { class: 'weather-place-form' });
  const input = el('input', { class: 'form-input', type: 'text', placeholder: 'Ej.: Madrid', 'aria-label': t('searchCity') });
  const btn = el('button', { class: 'btn', type: 'button', 'aria-label': t('searchCity'), html: ICONS.search });
  const doSearch = () => {
    const q = input.value.trim();
    if (!q) return;
    els.weatherContent.textContent = t('loadingWeather');
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(q) + '&count=1&language=' + encodeURIComponent(getLanguage()))
      .then((r) => r.json())
      .then((d) => {
        const loc = d.results && d.results[0];
        if (!loc) throw new Error();
        fetchWeather(loc.latitude, loc.longitude, loc.name);
      })
      .catch(() => {
        els.weatherContent.textContent = t('cityNotFound');
        appendWeatherPlaceForm();
      });
  };
  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });
  form.append(input, btn);
  els.weatherContent.appendChild(form);
}

/* ---------- Calendario ---------- */
let calYear = null;
let calMonth = null;

function initCalendarWidget() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  els.calPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    renderCalendar();
  });
  els.calNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    renderCalendar();
  });
  renderCalendar();
}

function renderCalendar() {
  const locale = getLocale();
  const DOW = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: 'short' })
    .format(new Date(2024, 0, index + 1))
    .replace('.', '')
    .slice(0, 2));
  els.calTitle.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(calYear, calMonth, 1));
  els.calGrid.textContent = '';
  DOW.forEach((d) => els.calGrid.appendChild(el('div', { class: 'cal-dow', text: d })));

  const startOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const taskDays = new Map();
  tasks().filter((task) => task.dueAt).forEach((task) => {
    const key = taskDateKey(task.dueAt);
    taskDays.set(key, (taskDays.get(key) || 0) + 1);
  });

  for (let i = startOffset - 1; i >= 0; i--) {
    const prev = new Date(calYear, calMonth, -i).getDate();
    els.calGrid.appendChild(el('div', { class: 'cal-day other', text: String(prev) }));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate();
    const count = taskDays.get(`${calYear}-${calMonth}-${d}`) || 0;
    const day = el('button', { class: 'cal-day' + (isToday ? ' today' : '') + (count ? ' has-tasks' : ''), text: String(d), title: count ? `${count} tarea${count === 1 ? '' : 's'} con vencimiento` : '' });
    if (count) day.appendChild(el('span', { class: 'cal-task-dot', text: String(count) }));
    day.addEventListener('click', () => openTaskManager('calendar'));
    els.calGrid.appendChild(day);
  }
  const total = startOffset + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= nextDays; i++) {
    els.calGrid.appendChild(el('div', { class: 'cal-day other', text: String(i) }));
  }
}

/* ---------- Integración con extensiones de navegador ---------- */
function getBrowserExtensionApi() {
  const api = globalThis.browser || globalThis.chrome;
  return api && api.bookmarks ? api : null;
}

function nativeWritesEnabled() {
  return !!state.data?.settings?.nativeWriteEnabled && !!state.data?.settings?.nativeWriteFolderId;
}

function nativeFolderIdForCategory(category) {
  return String(category?.nativeTargetFolderId || category?.sourceNativeId || '');
}

function queueNativeBookmarkWrite(bookmark) {
  if (!nativeWritesEnabled() || !bookmark) return;
  syncDashboardBookmarkToNative(bookmark).catch((error) => {
    console.warn('No se pudo actualizar el marcador nativo.', error);
    toast('No se pudo actualizar el marcador en el navegador', 'error');
  });
}

function queueNativeBookmarkRemoval(bookmark) {
  if (!nativeWritesEnabled() || !bookmark?.sourceNativeId) return;
  removeDashboardBookmarkFromNative(bookmark).catch((error) => {
    console.warn('No se pudo eliminar el marcador nativo.', error);
    toast('No se pudo eliminar el marcador del navegador', 'error');
  });
}

function queueNativeCategoryWrite(category) {
  if (!nativeWritesEnabled() || !category) return;
  syncDashboardCategoryToNative(category).catch((error) => {
    console.warn('No se pudo actualizar la carpeta nativa.', error);
    toast('No se pudo actualizar la carpeta del navegador', 'error');
  });
}

function queueNativeCategoryRemoval(category) {
  if (!nativeWritesEnabled() || !category) return;
  removeDashboardCategoryFromNative(category).catch((error) => {
    console.warn('No se pudo eliminar la carpeta nativa.', error);
    toast('No se pudo eliminar la carpeta del navegador', 'error');
  });
}

async function nativeBookmarkExists(api, id) {
  if (!id) return null;
  try {
    const nodes = await api.bookmarks.get(String(id));
    return nodes && nodes[0] ? nodes[0] : null;
  } catch {
    return null;
  }
}

async function ensureNativeFolderForCategory(categoryId, api) {
  const category = getCategory(categoryId);
  const fallback = String(state.data.settings.nativeWriteFolderId || '');
  if (!category) return fallback;

  const knownId = nativeFolderIdForCategory(category);
  if (knownId && await nativeBookmarkExists(api, knownId)) return knownId;

  const parentId = category.parentId
    ? await ensureNativeFolderForCategory(category.parentId, api)
    : fallback;
  if (!parentId) throw new Error('No hay una carpeta nativa de destino seleccionada.');
  const created = await api.bookmarks.create({ parentId, title: category.name });
  category.nativeTargetFolderId = String(created.id);
  category.sourceNativeId = String(created.id);
  saveData();
  return category.nativeTargetFolderId;
}

async function syncDashboardCategoryToNative(category) {
  const api = getBrowserExtensionApi();
  if (!api || !nativeWritesEnabled() || !category || category.nativeRootFolder) return;
  const existingId = nativeFolderIdForCategory(category);
  const existing = existingId ? await nativeBookmarkExists(api, existingId) : null;
  const parentId = category.parentId
    ? await ensureNativeFolderForCategory(category.parentId, api)
    : String(state.data.settings.nativeWriteFolderId);

  if (existing) {
    await api.bookmarks.update(existing.id, { title: category.name });
    if (parentId && String(existing.parentId || '') !== parentId) await api.bookmarks.move(existing.id, { parentId });
    if (!category.sourceNativeId) category.sourceNativeId = String(existing.id);
    category.nativeTargetFolderId = String(existing.id);
  } else {
    const created = await api.bookmarks.create({ parentId, title: category.name });
    category.nativeTargetFolderId = String(created.id);
    category.sourceNativeId = String(created.id);
  }
  saveData();
}

async function syncDashboardBookmarkToNative(bookmark) {
  const api = getBrowserExtensionApi();
  if (!api || !nativeWritesEnabled() || !bookmark) return;
  const parentId = bookmark.categoryId
    ? await ensureNativeFolderForCategory(bookmark.categoryId, api)
    : String(state.data.settings.nativeWriteFolderId);
  if (!parentId) throw new Error('No hay una carpeta nativa de destino seleccionada.');

  const existing = bookmark.sourceNativeId ? await nativeBookmarkExists(api, bookmark.sourceNativeId) : null;
  if (existing) {
    await api.bookmarks.update(existing.id, { title: bookmark.name, url: bookmark.url });
    if (String(existing.parentId || '') !== parentId) await api.bookmarks.move(existing.id, { parentId });
    return;
  }
  const created = await api.bookmarks.create({ parentId, title: bookmark.name, url: bookmark.url });
  bookmark.sourceNativeId = String(created.id);
  saveData();
}

async function removeDashboardBookmarkFromNative(bookmark) {
  const api = getBrowserExtensionApi();
  if (!api || !bookmark?.sourceNativeId) return;
  const existing = await nativeBookmarkExists(api, bookmark.sourceNativeId);
  if (existing?.url) await api.bookmarks.remove(existing.id);
}

async function removeDashboardCategoryFromNative(category) {
  const api = getBrowserExtensionApi();
  if (!api || category?.nativeRootFolder) return;
  const folderId = nativeFolderIdForCategory(category);
  const existing = folderId ? await nativeBookmarkExists(api, folderId) : null;
  if (existing && !existing.url) await api.bookmarks.removeTree(existing.id);
}

function nativeFolderOptions(tree) {
  const folders = [];
  const walk = (node, depth) => {
    if (!node) return;
    if (!node.url && depth >= 0 && node.id) {
      folders.push({ id: String(node.id), name: node.title || 'Carpeta de marcadores', depth });
    }
    (node.children || []).forEach((child) => walk(child, depth + 1));
  };
  (tree || []).forEach((root) => walk(root, -1));
  return folders;
}

async function copyDashboardBookmarksToNative() {
  if (!nativeWritesEnabled()) {
    toast('Elige primero una carpeta y activa la sincronización bidireccional', 'error');
    return;
  }
  const unsynced = state.data.bookmarks.filter((bookmark) => !bookmark.sourceNativeId);
  if (!unsynced.length) {
    toast('Todos los favoritos ya están vinculados con el navegador', 'info');
    return;
  }
  const api = getBrowserExtensionApi();
  const nativeData = nativeBookmarkTreeToData(await api.bookmarks.getTree());
  const nativeByUrl = new Map(nativeData.bookmarks.map((bookmark) => [canonicalUrl(bookmark.url), bookmark]));
  let copied = 0;
  let linked = 0;
  for (const bookmark of unsynced) {
    const existing = nativeByUrl.get(canonicalUrl(bookmark.url));
    if (existing) {
      bookmark.sourceNativeId = String(existing.sourceNativeId);
      linked++;
    } else {
      await syncDashboardBookmarkToNative(bookmark);
      copied++;
    }
  }
  state.data.settings.lastNativeSyncAt = Date.now();
  saveData();
  renderAll();
  toast(`${copied} favoritos copiados${linked ? ` · ${linked} ya existían y se vincularon` : ''}`, 'success');
}

function nativeBookmarkTreeToData(tree, flattenedFolderIds = new Set()) {
  const categories = [];
  const bookmarks = [];
  let catOrder = 0;
  let bookmarkOrder = 0;

  const walk = (nodes, parentId = null, skipRoot = false, depth = -1) => {
    (nodes || []).forEach((node) => {
      if (node.url) {
        if (!isValidUrl(node.url)) return;
        bookmarks.push({
          id: `native-${node.id}`,
          sourceNativeId: String(node.id),
          name: node.title || getDomain(node.url),
          url: node.url,
          description: '',
          tags: [],
          status: 'saved',
          categoryId: parentId,
          color: null,
          iconUrl: null,
          pinned: false,
          useCount: 0,
          lastAccess: 0,
          createdAt: Number(node.dateAdded) || Date.now(),
          order: bookmarkOrder++
        });
        return;
      }

      const hasChildren = Array.isArray(node.children);
      if (!hasChildren) return;
      if (flattenedFolderIds.has(String(node.id))) {
        walk(node.children, parentId, false, depth + 1);
        return;
      }
      if (skipRoot) {
        walk(node.children, parentId, false, depth + 1);
        return;
      }
      const category = {
        id: `native-folder-${node.id}`,
        sourceNativeId: String(node.id),
        nativeRootFolder: depth === 0,
        name: node.title || 'Marcadores',
        parentId,
        color: 'theme',
        inheritColor: !!parentId,
        createdAt: Number(node.dateAdded) || Date.now(),
        order: catOrder++,
        collapsed: true
      };
      categories.push(category);
      walk(node.children, category.id, false, depth + 1);
    });
  };

  walk(tree, null, true);
  return { version: APP.version, settings: {}, categories, bookmarks, quickGroups: [], empty: false };
}

const NATIVE_BOOKMARK_CHANGE_KEY = 'dashboardNativeBookmarkChange';
let nativeBookmarkSyncing = false;
let nativeBookmarkSyncPending = false;
let nativeBookmarkSyncPendingToast = false;
let nativeBookmarkRefreshTimer = null;

function queueNativeBookmarkRefresh(showToast = false) {
  if (!state.data.settings.nativeBookmarkMode) return;
  nativeBookmarkSyncPendingToast = nativeBookmarkSyncPendingToast || showToast;
  clearTimeout(nativeBookmarkRefreshTimer);
  nativeBookmarkRefreshTimer = setTimeout(() => {
    const pendingToast = nativeBookmarkSyncPendingToast;
    nativeBookmarkSyncPendingToast = false;
    syncNativeBookmarks(pendingToast);
  }, 120);
}

function bookmarkIdsFromNativeData(data) {
  return data.bookmarks.map((bookmark) => String(bookmark.sourceNativeId));
}

function filterNativeDataForBookmarks(data, bookmarkIds) {
  const wantedBookmarks = new Set(bookmarkIds);
  const bookmarks = data.bookmarks.filter((bookmark) => wantedBookmarks.has(String(bookmark.sourceNativeId)));
  const wantedCategories = new Set(bookmarks.map((bookmark) => bookmark.categoryId).filter(Boolean));
  let changed = true;
  while (changed) {
    changed = false;
    data.categories.forEach((category) => {
      if (wantedCategories.has(category.id) && category.parentId && !wantedCategories.has(category.parentId)) {
        wantedCategories.add(category.parentId);
        changed = true;
      }
    });
  }
  return {
    ...data,
    categories: data.categories.filter((category) => wantedCategories.has(category.id)),
    bookmarks
  };
}

async function syncNativeBookmarks(showToast = false) {
  const api = getBrowserExtensionApi();
  if (!api || !state.data.settings.nativeBookmarkMode) return;
  if (nativeBookmarkSyncing) {
    nativeBookmarkSyncPending = true;
    nativeBookmarkSyncPendingToast = nativeBookmarkSyncPendingToast || showToast;
    return;
  }
  nativeBookmarkSyncing = true;
  const originalData = state.data;
  try {
    const tree = await api.bookmarks.getTree();
    if (state.data !== originalData || !state.data.settings.nativeBookmarkMode) return;
    const flattenedFolderIds = state.data.settings.nativeWriteFolderId
      ? new Set([String(state.data.settings.nativeWriteFolderId)])
      : new Set();
    const nativeData = nativeBookmarkTreeToData(tree, flattenedFolderIds);
    const mode = state.data.settings.nativeBookmarkMode;
    const knownIds = new Set(state.data.settings.nativeKnownBookmarkIds || []);
    const trackedIds = new Set(state.data.settings.nativeTrackedBookmarkIds || []);
    const incoming = mode === 'future'
      ? filterNativeDataForBookmarks(nativeData, nativeData.bookmarks
        .filter((bookmark) => !knownIds.has(String(bookmark.sourceNativeId)) || trackedIds.has(String(bookmark.sourceNativeId)))
        .map((bookmark) => String(bookmark.sourceNativeId)))
      : nativeData;
    const merged = mergeDashboardData(state.data, incoming);
    const liveNativeIds = new Set(nativeData.bookmarks.map((bookmark) => String(bookmark.sourceNativeId)));
    const removedIds = merged.data.bookmarks
      .filter((bookmark) => bookmark.sourceNativeId && !liveNativeIds.has(String(bookmark.sourceNativeId)))
      .map((bookmark) => bookmark.id);
    if (removedIds.length) {
      const removed = new Set(removedIds);
      merged.data.bookmarks = merged.data.bookmarks.filter((bookmark) => !removed.has(bookmark.id));
      merged.data.quickGroups.forEach((group) => {
        group.bookmarkIds = group.bookmarkIds.filter((id) => !removed.has(id));
      });
    }
    if (mode === 'future') {
      const selectedIds = bookmarkIdsFromNativeData(incoming);
      merged.data.settings.nativeKnownBookmarkIds = bookmarkIdsFromNativeData(nativeData);
      merged.data.settings.nativeTrackedBookmarkIds = [...new Set([...trackedIds, ...selectedIds])]
        .filter((id) => liveNativeIds.has(id));
    }
    const hasChanges = !!(merged.stats.added || merged.stats.updated || merged.stats.categories || removedIds.length);
    state.data = merged.data;
    state.data.settings.lastNativeSyncAt = Date.now();
    saveData();
    if (hasChanges) {
      renderAll();
      if (showToast) {
        const changes = [];
        if (merged.stats.added) changes.push(`${merged.stats.added} incorporados`);
        if (merged.stats.updated) changes.push(`${merged.stats.updated} actualizados`);
        if (removedIds.length) changes.push(`${removedIds.length} retirados`);
        if (changes.length) toast(`Marcadores del navegador: ${changes.join(' · ')}`, 'success');
      }
    }
  } catch (error) {
    console.warn('No se pudieron sincronizar los marcadores del navegador.', error);
  } finally {
    nativeBookmarkSyncing = false;
    if (nativeBookmarkSyncPending) {
      nativeBookmarkSyncPending = false;
      queueNativeBookmarkRefresh(nativeBookmarkSyncPendingToast);
    }
  }
}

async function startFutureBookmarkSync(api) {
  const tree = await api.bookmarks.getTree();
  const flattenedFolderIds = state.data.settings.nativeWriteFolderId
    ? new Set([String(state.data.settings.nativeWriteFolderId)])
    : new Set();
  const existing = nativeBookmarkTreeToData(tree, flattenedFolderIds);
  state.data.settings.nativeBookmarkMode = 'future';
  state.data.settings.nativeKnownBookmarkIds = bookmarkIdsFromNativeData(existing);
  state.data.settings.nativeTrackedBookmarkIds = [];
  state.data.settings.lastNativeSyncAt = Date.now();
  saveData();
  renderAll();
  toast('El Dashboard empezará vacío. Los nuevos marcadores se añadirán automáticamente.', 'success');
}

function showNativeBookmarkChoice(api) {
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: '¿Cómo quieres empezar?' }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: 'Hemos detectado marcadores guardados en este navegador.' }),
    el('p', { class: 'modal-subtitle', text: 'Elige una opción. Podrás seguir creando, editando e importando favoritos después.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', {
    class: 'btn',
    text: 'Empezar de cero',
    onclick: async () => {
      try {
        closeModal();
        await startFutureBookmarkSync(api);
      } catch (error) {
        console.warn('No se pudo preparar la sincronización de nuevos marcadores.', error);
        toast('No se pudo leer la lista de marcadores del navegador', 'error');
      }
    }
  }));
  footer.append(el('button', {
    class: 'btn primary',
    text: 'Añadir mis favoritos actuales',
    onclick: async () => {
      state.data.settings.nativeBookmarkMode = 'all';
      state.data.settings.nativeKnownBookmarkIds = [];
      state.data.settings.nativeTrackedBookmarkIds = [];
      saveData();
      closeModal();
      await syncNativeBookmarks(true);
    }
  }));
  modal.append(header, body, footer);
  openModal(modal);
}

function confirmCopyDashboardBookmarksToNative() {
  const count = state.data.bookmarks.filter((bookmark) => !bookmark.sourceNativeId).length;
  const modal = el('div', { class: 'modal', role: 'alertdialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Copiar favoritos al navegador' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(
    el('p', { text: `Se revisarán ${count} favoritos locales para llevarlos a la carpeta elegida del navegador.` }),
    el('p', { class: 'modal-subtitle', text: 'Si un enlace ya existe en el navegador, se vinculará sin crear un duplicado. Esta acción no sustituye los favoritos que ya tengas.' })
  );
  const footer = el('div', { class: 'modal-footer' });
  footer.append(el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }), el('button', { class: 'btn primary', text: 'Copiar favoritos', onclick: async () => { closeModal(); try { await copyDashboardBookmarksToNative(); } catch (error) { console.warn('No se pudieron copiar los favoritos al navegador.', error); toast('No se pudieron copiar todos los favoritos al navegador', 'error'); } } }));
  modal.append(header, body, footer);
  openModal(modal);
}

async function openNativeBookmarkSyncSettings() {
  const api = getBrowserExtensionApi();
  if (!api) {
    toast('Este navegador no permite acceder a sus marcadores', 'error');
    return;
  }

  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-labelledby': 'modalTitle' });
  const header = el('div', { class: 'modal-header' });
  header.append(el('h2', { class: 'modal-title', id: 'modalTitle', text: 'Sincronización con marcadores del navegador' }), el('button', { class: 'modal-close', 'aria-label': 'Cerrar', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', onclick: closeModal }));
  const body = el('div', { class: 'modal-body' });
  body.append(el('p', { text: 'Decide en qué carpeta del navegador se guardarán los favoritos que crees o edites desde DashboardDP.' }));
  const loading = el('p', { class: 'modal-subtitle', text: 'Leyendo las carpetas de marcadores…' });
  body.appendChild(loading);
  modal.append(header, body);
  openModal(modal);

  try {
    const folders = nativeFolderOptions(await api.bookmarks.getTree());
    if (!folders.length) throw new Error('No se encontraron carpetas de marcadores.');
    loading.remove();

    const folderGroup = el('div', { class: 'form-group' });
    folderGroup.appendChild(el('label', { class: 'form-label', text: 'Carpeta de destino' }));
    const folderSelect = el('select', { class: 'form-select' });
    folders.forEach((folder, index) => {
      const option = el('option', { value: folder.id, text: `${'— '.repeat(Math.min(folder.depth, 5))}${folder.name}` });
      if (String(state.data.settings.nativeWriteFolderId || '') === folder.id || (!state.data.settings.nativeWriteFolderId && index === 0)) option.selected = true;
      folderSelect.appendChild(option);
    });
    folderGroup.append(folderSelect, el('p', { class: 'form-hint', text: 'Las categorías de DashboardDP se crearán dentro de esta carpeta cuando sea necesario.' }));

    const writeEnabled = el('input', { type: 'checkbox' });
    writeEnabled.checked = !!state.data.settings.nativeWriteEnabled;
    const writeLabel = el('label', { class: 'settings-toggle-row' });
    const writeCopy = el('span', { class: 'settings-toggle-copy' });
    writeCopy.append(el('strong', { text: 'Activar sincronización bidireccional' }), el('span', { class: 'form-hint', text: 'Los cambios realizados en DashboardDP se escribirán también en los marcadores de este navegador.' }));
    writeLabel.append(writeEnabled, writeCopy);

    let initialMode = null;
    if (!state.data.settings.nativeBookmarkMode) {
      const startGroup = el('div', { class: 'form-group' });
      startGroup.appendChild(el('label', { class: 'form-label', text: 'Marcadores que ya existen en este navegador' }));
      initialMode = el('select', { class: 'form-select' });
      initialMode.append(el('option', { value: 'all', text: 'Añadirlos ahora a DashboardDP' }), el('option', { value: 'future', text: 'No importarlos; detectar solo los nuevos' }));
      startGroup.append(initialMode, el('p', { class: 'form-hint', text: 'Esta elección se usa únicamente la primera vez y no elimina nada.' }));
      body.appendChild(startGroup);
    }
    body.append(folderGroup, writeLabel, el('p', { class: 'modal-subtitle', text: 'Los cambios que hagas directamente en el navegador se detectan y actualizan DashboardDP. Esta conexión solo trabaja con los marcadores de este navegador.' }));

    const footer = el('div', { class: 'modal-footer' });
    footer.append(
      el('button', { class: 'btn', text: 'Cancelar', onclick: closeModal }),
      el('button', { class: 'btn secondary', text: 'Copiar favoritos actuales al navegador', onclick: () => { if (!writeEnabled.checked) { toast('Activa primero la sincronización bidireccional', 'info'); return; } state.data.settings.nativeWriteEnabled = true; state.data.settings.nativeWriteFolderId = folderSelect.value; state.data.settings.nativeWriteFolderName = folderSelect.options[folderSelect.selectedIndex]?.textContent || ''; saveData(); confirmCopyDashboardBookmarksToNative(); } }),
      el('button', { class: 'btn primary', text: 'Guardar sincronización', onclick: async () => {
        state.data.settings.nativeWriteEnabled = writeEnabled.checked;
        state.data.settings.nativeWriteFolderId = folderSelect.value;
        state.data.settings.nativeWriteFolderName = folderSelect.options[folderSelect.selectedIndex]?.textContent || '';
        if (!state.data.settings.nativeBookmarkMode && initialMode) {
          if (initialMode.value === 'all') {
            state.data.settings.nativeBookmarkMode = 'all';
            state.data.settings.nativeKnownBookmarkIds = [];
            state.data.settings.nativeTrackedBookmarkIds = [];
          } else {
            await startFutureBookmarkSync(api);
          }
        }
        saveData();
        closeModal();
        if (state.data.settings.nativeBookmarkMode === 'all') await syncNativeBookmarks(true);
        renderAll();
        toast(writeEnabled.checked ? 'Sincronización bidireccional activada' : 'Lectura de marcadores activada; la escritura está desactivada', 'success');
      } })
    );
    modal.appendChild(footer);
  } catch (error) {
    loading.textContent = 'No se pudieron leer las carpetas de marcadores de este navegador.';
    loading.classList.add('form-error', 'visible');
    console.warn('No se pudieron leer las carpetas nativas.', error);
  }
}

function addCapturedBrowserPage(capture) {
  if (!capture || !capture.url || !isValidUrl(capture.url)) return false;
  const exists = state.data.bookmarks.some((bookmark) => canonicalUrl(bookmark.url) === canonicalUrl(capture.url));
  if (exists) {
    toast('Este enlace ya está en el dashboard', 'info');
    return false;
  }
  addBookmark({
    name: capture.title || getDomain(capture.url),
    url: capture.url,
    description: '',
    tags: [],
    status: 'saved',
    categoryId: null
  });
  return true;
}

async function consumePendingCaptures(api) {
  if (!api.storage || !api.storage.local) return;
  try {
    const stored = await api.storage.local.get('pendingCaptures');
    const captures = Array.isArray(stored.pendingCaptures) ? stored.pendingCaptures : [];
    let added = 0;
    captures.forEach((capture) => { if (addCapturedBrowserPage(capture)) added++; });
    if (captures.length) await api.storage.local.remove('pendingCaptures');
    if (added) toast(`${added} páginas guardadas desde el navegador`, 'success');
  } catch (error) {
    console.warn('No se pudieron recuperar las páginas pendientes.', error);
  }
}

function initBrowserIntegration() {
  const api = getBrowserExtensionApi();
  if (!api) return;

  // Compatibilidad: las instalaciones anteriores ya sincronizadas continúan sin
  // mostrar el asistente y conservan exactamente el comportamiento previo.
  if (!state.data.settings.nativeBookmarkMode && state.data.bookmarks.some((bookmark) => bookmark.sourceNativeId)) {
    state.data.settings.nativeBookmarkMode = 'all';
    saveData();
  }

  if (api.runtime && api.runtime.onMessage) {
    api.runtime.onMessage.addListener((message) => {
      if (message && message.type === 'dashboard-bookmarks-changed') queueNativeBookmarkRefresh(true);
      if (message && message.type === 'dashboard-capture') addCapturedBrowserPage(message.capture);
    });
  }
  if (api.storage && api.storage.onChanged) {
    api.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes && changes[NATIVE_BOOKMARK_CHANGE_KEY]) queueNativeBookmarkRefresh(true);
    });
  }
  window.addEventListener('focus', () => queueNativeBookmarkRefresh(false));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') queueNativeBookmarkRefresh(false);
  });
  consumePendingCaptures(api);

  if (state.data.settings.nativeBookmarkMode) syncNativeBookmarks(false);
  else showNativeBookmarkChoice(api);
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

function init() {
  initData();
  loadPersonalCalendarConnections().then(() => {
    updateCalendarSyncButton();
    initSmartCalendarSync();
  }).catch(() => {});
  applyInterfaceLanguage();
  document.addEventListener('error', (event) => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.classList.contains('favicon-image')) {
      const fallbackUrl = image.dataset.faviconFallback;
      if (fallbackUrl) {
        delete image.dataset.faviconFallback;
        image.src = fallbackUrl;
        return;
      }
      image.style.display = 'none';
      const fallback = image.nextElementSibling;
      if (fallback) fallback.style.display = 'flex';
    }
  }, true);
  applySkin(state.data.settings.skin || 'default');
  applyTheme(state.data.settings.theme || 'dark');
  applyWallpaper();
  setSidebarWidth(state.data.settings.sidebarWidth, false);
  setPanelWidth(state.data.settings.panelWidth, false);
  setSidebarCollapsed(!!state.data.settings.sidebarCollapsed, false);
  setPanelCollapsed(!!state.data.settings.panelCollapsed, false);
  if (state.data.settings.sidebarAutoReveal) setSidebarCollapsed(true, false);
  setPanelExpanded(!!state.data.settings.panelExpanded, false);
  bindEvents();
  initKeyboardShortcuts();
  initClock();
  initWebSearch();
  setViewMode(state.viewMode);
  initResponsive();
  initCustomPanelResizeObserver();
  initDropZone();
  initWidgets();
  renderAll();
  handleExternalAdd();
  initBrowserIntegration();
  syncAllTaskReminders();
  const days = Number(state.data.settings.backupReminderDays) || 7;
  const lastBackup = Number(state.data.settings.lastBackupAt) || 0;
  if (!lastBackup || Date.now() - lastBackup > days * 86400000) {
    setTimeout(() => toast('Conviene exportar una copia de seguridad de tus favoritos', 'info'), 1200);
  }
}

document.addEventListener('DOMContentLoaded', init);
