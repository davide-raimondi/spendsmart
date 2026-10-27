# 💸 SpendSmart — Spese in 1-Tap

<p align="center">
  <img src="app/src/main/assets/logo.png" alt="SpendSmart Logo" width="120" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);" />
</p>

<p align="center">
  <strong>Monitora le spese quotidiane, gestisci il budget e tieni sotto controllo le scadenze mensili in un singolo tocco.</strong>
</p>

<p align="center">
  <a href="https://github.com/davide23567/SpendSmart/raw/main/spendsmart.apk">
    <img src="https://img.shields.io/badge/SCARICA%20APK-Download%20Diretto%20Android-38BDF8?style=for-the-badge&logo=android&logoColor=white" alt="Scarica APK SpendSmart" />
  </a>
  <a href="https://www.instagram.com/davide.raimondi94">
    <img src="https://img.shields.io/badge/Instagram-@davide.raimondi94-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram Davide Raimondi" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-blue?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/Language-Kotlin%20%2F%20JavaScript-orange?style=flat-square" alt="Language" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20Offline-emerald?style=flat-square" alt="Privacy" />
  <img src="https://img.shields.io/badge/UI-Dark%20Obsidian%20Glass-indigo?style=flat-square" alt="UI" />
</p>

---

## 📲 Download Diretto APK per Android

Puoi installare subito **SpendSmart** sul tuo smartphone Android senza bisogno di configurare ambienti di sviluppo:

👉 **[Scarica SpendSmart APK pronto all'uso (spendsmart.apk)](https://github.com/davide23567/SpendSmart/raw/main/spendsmart.apk)**

1. Scarica il file `spendsmart.apk` direttamente sul tuo smartphone.
2. Apri il file scaricato e tocca **Installa** (autorizza se richiesto l'installazione da browser/fonti sconosciute).
3. Apri l'app e gestisci le tue uscite mensili con la nuova interfaccia grafica rinnovata!

---

## 📖 Panoramica

**SpendSmart** è un'applicazione Android ibrida, lightweight e moderna progettata per semplificare radicalmente la gestione finanziaria personale. A differenza delle complesse app bancarie tradizionali, SpendSmart elimina ogni frizione: non richiede registrazione, non invia dati all'esterno ed è ottimizzata per consentire l'inserimento e il controllo delle spese in **1-tap**.

Combina la fluidità di una UI moderna in **Glassmorphism ad alta definizione** con l'affidabilità di un wrapper nativo **Android (Kotlin)** edge-to-edge.

---

## ✨ Funzionalità Principali

- ⚡ **1-Tap Action:** Segna una spesa come *Pagata* o *Da Pagare* con un solo tocco sul display.
- 📅 **Navigazione Mensile Dinamica:** Scorri facilmente tra mesi passati, presenti e futuri con ricalcolo immediato dei totali.
- 📊 **Dashboard Finanziaria & Progress Bar:** 
  - **Totale Mese:** Somma complessiva delle uscite preventivate.
  - **Pagate:** Ammontare già saldato con barra verde smeraldo.
  - **Da Pagare:** Importo rimanente da saldare.
  - **Barra di avanzamento animata:** Effetto shimmer con percentuale grafica di completamento.
- 🔁 **Spese Fisse e Ricorrenti Avanzate:**
  - Configura spese continuative (es. *Affitto*, *Netflix*, *Palestra*).
  - Modalità **Periodo** (*Da Mese* a *A Mese* o senza data di scadenza).
  - Modalità **Mesi Specifici** (per spese bimestrali, trimestrali o annuali come bollette e assicurazioni).
- 🔍 **Filtri Intelligenti:**
  - `Tutte`: Panoramica completa del mese.
  - `Da Pagare`: Focus sulle uscite ancora da saldare.
  - `⚠️ Scadute`: Rilevamento immediato dei pagamenti oltre il giorno prefissato con allerta visiva.
  - `Pagate`: Archivio delle spese già regolate.
- ↩️ **Undo / Annulla Istantaneo:** Notifica toast floating con pulsante *"Annulla"* per ripristinare qualsiasi eliminazione involontaria.
- ✏️ **Modifica e Personalizzazione:** Modale intuitiva per correggere importi, giorni di scadenza o parametri di ricorrenza.
- 🔒 **100% Privacy & Offline-First:** Tutti i dati risiedono esclusivamente nel dispositivo (`LocalStorage`). Nessun tracking, nessuna pubblicità, nessun server remoto.

---

## 🎨 Grafica Rinnovata & Design System

- **Tema Scuro Obsidian:** Palette cromatica curata su toni ardesia/notte profonda (`#0b0f19`) con accenti ciano elettrico (`#38bdf8`), verde smeraldo (`#10b981`) e indaco (`#818cf8`).
- **Glassmorphism Premium:** Schede semitrasparenti con sfocatura dinamica dello sfondo (`backdrop-filter: blur(20px) saturate(180%)`), bordi luminosi e riflessi interni.
- **Mesh Ambientale Dinamico:** Sfumature fluorescenti animate sullo sfondo che donano profondità e un feeling moderno da app fintech.
- **Tipografia di Precisione:** Google Font *Inter* con cifre tabulari per l'allineamento perfetto dei bilanci finanziari.
- **Feedback & Micro-Animazioni:** Transizioni fluide su pulsanti, swipe, switch in stile iOS e stati di pagamento.
- **Edge-to-Edge Nativo:** Perfetta integrazione immersiva con la barra di stato e la barra di navigazione di Android (`WindowCompat`).

---

## 🛠️ Architettura e Stack Tecnologico

### Frontend (Web Core)
- **HTML5:** Struttura semantica, accessibility e navigazione touch.
- **CSS3:** Custom Properties (variabili CSS), layout responsive Flexbox/Grid, animazioni keyframe e glassmorphism.
- **JavaScript (Vanilla ES6+):** Logica di calcolo dei bilanci, gestione dello stato, persistenza dati e gestione eventi senza framework pesanti.

### Applicazione Android
- **Linguaggio:** Kotlin
- **Architettura:** Single-Activity (`MainActivity.kt`) con `Android WebView` ad alte prestazioni.
- **UI System:** AndroidX Core, `WindowCompat` per supporto immersivo a schermo intero.
- **Build System:** Gradle (Kotlin DSL - `build.gradle.kts`) con Version Catalog (`gradle/libs.versions.toml`).
- **Asset Branding:** Icone adattive mipmap generate su tutte le densità (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi).

---

## 📂 Struttura del Progetto

```text
SpendSmart/
├── spendsmart.apk           # APK Android pronto per l'installazione diretta
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/              # Interfaccia Web Core
│   │   │   │   ├── index.html       # Markup applicazione
│   │   │   │   ├── styles.css       # Design System & Glassmorphism
│   │   │   │   ├── script.js        # Logica di business & LocalStorage
│   │   │   │   └── logo.png         # Logo ufficiale
│   │   │   ├── java/                # Codice sorgente nativo Kotlin
│   │   │   │   └── com/example/spendsmart/MainActivity.kt
│   │   │   └── res/                 # Icone vettoriali e mipmap adattive
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── gradle/
│   └── libs.versions.toml           # Gestione dipendenze centralizzata
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

---

## 🚀 Come Eseguire il Progetto

### 1. Installazione APK sul telefono (Metodo Consigliato)
Scarica direttamente il file [spendsmart.apk](https://github.com/davide23567/SpendSmart/raw/main/spendsmart.apk) e installalo sul tuo smartphone Android.

### 2. Test Rapido nel Browser
Puoi testare l'interfaccia immediatamente aprendo il file web in locale:
1. Clona il repository:
   ```bash
   git clone https://github.com/davide23567/SpendSmart.git
   ```
2. Apri `app/src/main/assets/index.html` con qualsiasi browser (Chrome, Edge, Firefox, Safari).

### 3. Esecuzione su Dispositivo o Emulatore Android via Studio
1. Apri **Android Studio**.
2. Seleziona **Open** e scegli la cartella principale del progetto `SpendSmart`.
3. Attendi il completamento della sincronizzazione di Gradle.
4. Collega uno smartphone Android (con debug USB abilitato) o avvia un emulatore AVD.
5. Clicca su **Run** (o premi `Shift + F10`).

### 4. Generazione APK da Riga di Comando
```powershell
# Su Windows:
.\gradlew.bat assembleDebug

# L'APK generato sarà disponibile in:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 🤝 Crediti e Contatti

Progettata e sviluppata da **Davide Raimondi**.
- **GitHub**: [@davide23567](https://github.com/davide23567)
- **Instagram**: [@davide.raimondi94](https://www.instagram.com/davide.raimondi94)

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza [MIT](LICENSE).
