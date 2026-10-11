export type Language = 'cs' | 'en';

export const TRANSLATIONS = {
  cs: {
    appTitle: 'ScrapMaster AI',
    appSubtitle: 'Autonomní studio pro recyklaci hardware a reverzní inženýrství',
    titanBadge: 'GODMODE-TITAN',
    localEngineOnline: 'Lokální AI jádro: ONLINE',
    salvageYield: 'Hodnota šrotu:',
    zeroPaidApis: '100% Bez placených API',
    localPrivate: 'Lokální soukromí bez cloudu',
    syncedStorage: 'Synchronizace s lokální pamětí',

    // Nav tabs
    navCopilot: 'GenAI Kopilot (ALL-ENG)',
    navPinoutExplorer: 'Pinout Explorer',
    navCostSavings: 'Kalkulačka úspor (ROI)',
    navMastering: 'DIY Mastering (AutoLLM)',
    navBuild: 'Nápad na stavbu',
    navWhatCanIBuild: 'Co z toho postavím?',
    navWebSerial: 'USB WebSerial',
    navCad3d: '3D CAD úchyty',
    navDesolder: 'Pájecí rádce',
    navLabels: 'Štítkovač',
    navVision: 'Vizuální pitva',
    navVideo: 'Inverzní video',
    navInventory: 'Šrotoviště',
    navSafety: 'Bezpečnost & Rizika',
    navScience: 'Chemie & Materiály',
    navSearch: 'Živé Google ověření',
    navImageStudio: 'Generátor vzhledu',
    navAgents: 'Virtuální agenti',
    navDeploy: 'Lokální instalace',

    // What Can I Build
    whatCanIBuildTitle: 'Co z toho postavím? (Reverzní párovač součástek)',
    whatCanIBuildDesc: 'Zaškrtněte součástky, které máte ve své krabici se šrotem. Algoritmus okamžitě spočítá shodu a vygeneruje kompletní stavební návod.',
    selectedParts: 'Označené součástky:',
    readyToBuild: 'Připraveno ke stavbě',
    missingParts: 'Chybí',
    matchPercentage: 'Shoda',
    generateBlueprint: 'Vygenerovat kompletní projekt a schéma',
    quickSelectJunkBox: 'Rychlé sestavy harampádí:',
    allPartsFound: 'Máte všechny součástky! Můžete ihned začít stavět.',
    almostReady: 'Téměř hotovo – chybí jen drobnosti, které lze nahradit.',

    // WebSerial Terminal
    webSerialTitle: 'WebSerial USB Terminál & Nahrávač',
    webSerialDesc: 'Připojte Arduino, ESP32 nebo převodník přímo přes USB v prohlížeči. Testujte příkazy, sledujte telemetry a ovládejte zachráněné motory.',
    connectUsb: 'Připojit USB zařízení',
    disconnectUsb: 'Odpojit port',
    portStatusConnected: 'PŘIPOJENO',
    portStatusDisconnected: 'ODPOJENO',
    baudRate: 'Přenosová rychlost (Baud):',
    quickMacros: 'Rychlé příkazy & Testovací makra:',
    clearTerminal: 'Vyčistit konzoli',
    autoscroll: 'Automatický posun',
    sendCommand: 'Odeslat',
    sendPlaceholder: 'Zadejte příkaz (např. T pro test čtverce, U/D pero nahoru/dolů, G28)...',
    simulatedModeNotice: 'Režim simulace (pokud nemáte připojený hardware, můžete testovat virtuální odezvu)',

    // 3D CAD Mounts
    cadTitle: 'Parametrický 3D CAD & OpenSCAD Generátor',
    cadDesc: 'Automaticky generuje 3D tiskové modely a úchyty pro zachráněné součástky (DVD motorky, 18650 články, TO-220 chladiče, serva).',
    presetMounts: 'Připravené držáky:',
    downloadScad: 'Stáhnout OpenSCAD (.scad)',
    copyScad: 'Kopírovat kód',

    // Desoldering Advisor
    desolderTitle: 'Rádce odpájení & Teplotní mapa DPS',
    desolderDesc: 'Chraňte zachráněné součástky a plošný spoj před spálením. Výpočet doporučených teplot, ochrana MOS čipů a techniky záchrany.',

    // Labels & QR Code Generator
    labelsTitle: 'Generátor štítků na šuplíky a QR kódů',
    labelsDesc: 'Vytiskněte si profesionální štítky na krabičky se součástkami s pinoutem a QR kódem pro rychlé skenování telefonem.',
    printLabels: 'Vytisknout štítky',

    // Common buttons
    addPart: 'Přidat součástku',
    copyCode: 'Kopírovat kód',
    download: 'Stáhnout',
    copied: 'Zkopírováno!',
    synthesizing: 'Generuji zapojení...'
  },
  en: {
    appTitle: 'ScrapMaster AI',
    appSubtitle: 'Autonomous Hardware Salvage & Reverse Engineering Studio',
    titanBadge: 'GODMODE-TITAN',
    localEngineOnline: 'Local AI Engine: ONLINE',
    salvageYield: 'Salvage Yield:',
    zeroPaidApis: 'Zero Paid APIs',
    localPrivate: '100% Local Private Execution',
    syncedStorage: 'Local Storage & IndexedDB Synced',

    // Nav tabs
    navCopilot: 'GenAI Copilot (ALL-ENG)',
    navPinoutExplorer: 'Pinout Explorer',
    navCostSavings: 'Savings ROI Calculator',
    navMastering: 'DIY Mastering (AutoLLM)',
    navBuild: 'Prompt-to-Build',
    navWhatCanIBuild: 'What Can I Build?',
    navWebSerial: 'USB WebSerial',
    navCad3d: '3D CAD Mounts',
    navDesolder: 'Desolder Advisor',
    navLabels: 'Bin Label Maker',
    navVision: 'Vision Dissector',
    navVideo: 'Inverse Video Lab',
    navInventory: 'Scrap Bin',
    navSafety: 'Safety Scanner',
    navScience: 'Materials Science',
    navSearch: 'Search Grounding',
    navImageStudio: 'Image Studio',
    navAgents: 'Titan MoE',
    navDeploy: 'Local Runtime',

    // What Can I Build
    whatCanIBuildTitle: 'What Can I Build? (Reverse BOM Matcher)',
    whatCanIBuildDesc: 'Check the parts you have lying in your junk drawer. The engine instantly calculates BOM match percentage and generates schematics and firmware.',
    selectedParts: 'Selected Parts:',
    readyToBuild: 'Ready to Build',
    missingParts: 'Missing',
    matchPercentage: 'Match',
    generateBlueprint: 'Generate Circuit Blueprint & Firmware',
    quickSelectJunkBox: 'Quick Junk Presets:',
    allPartsFound: 'All parts in your scrap bin! You can start building immediately.',
    almostReady: 'Almost complete – missing minor passives with easy alternatives.',

    // WebSerial Terminal
    webSerialTitle: 'WebSerial USB Live Terminal & Flasher',
    webSerialDesc: 'Connect your salvaged Arduino, ESP32, or USB-UART converter directly inside the browser. Send commands, view telemetry, and control motors.',
    connectUsb: 'Connect USB Device',
    disconnectUsb: 'Disconnect Port',
    portStatusConnected: 'CONNECTED',
    portStatusDisconnected: 'DISCONNECTED',
    baudRate: 'Baud Rate:',
    quickMacros: 'Quick Macros & Test Commands:',
    clearTerminal: 'Clear Console',
    autoscroll: 'Auto-Scroll',
    sendCommand: 'Send',
    sendPlaceholder: 'Type command (e.g. T for test square, U/D pen up/down, G28)...',
    simulatedModeNotice: 'Simulation mode (test virtual responses if no physical USB board is plugged in)',

    // 3D CAD Mounts
    cadTitle: 'Parametric 3D CAD & OpenSCAD Generator',
    cadDesc: 'Instantly generates 3D printable mounts and brackets for salvaged parts (DVD steppers, 18650 cells, TO-220 heatsinks, servos).',
    presetMounts: 'Preset Mounts:',
    downloadScad: 'Download OpenSCAD (.scad)',
    copyScad: 'Copy Code',

    // Desoldering Advisor
    desolderTitle: 'Desoldering Advisor & PCB Thermal Heatmap',
    desolderDesc: 'Prevent scorched chips and lifted copper pads. Thermal recommendations, MOS protection, and solder extraction techniques.',

    // Labels & QR Code Generator
    labelsTitle: 'Drawer Labels & QR Code Bin Organizer',
    labelsDesc: 'Print high-density component organizer labels with pinouts, voltage specs, and QR codes for instant smartphone lookup.',
    printLabels: 'Print Labels Sheet',

    // Common buttons
    addPart: 'Add Salvaged Part',
    copyCode: 'Copy Code',
    download: 'Download',
    copied: 'Copied!',
    synthesizing: 'Synthesizing...'
  }
};
