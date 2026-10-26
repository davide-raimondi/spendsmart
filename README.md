<div align="center">

  <img src="app/src/main/assets/logo.png" alt="SpendSmart Logo" width="120" />

  # 💸 SpendSmart
  ### **Le tue spese mensili, sotto controllo in 1-Tap.**

  <p align="center">
    Un'applicazione Android ibrida, ultra-leggera e 100% offline progettata per eliminare la complessità della gestione finanziaria personale. Zero registrazioni, zero server esterni, massima velocità.
  </p>

  <!-- BADGES -->
  <p align="center">
    <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-3b82f6?style=for-the-badge&logo=android&logoColor=white" alt="Platform" />
    <img src="https://img.shields.io/badge/Tech-Kotlin%20%2B%20ES6-f97316?style=for-the-badge&logo=kotlin&logoColor=white" alt="Language" />
    <img src="https://img.shields.io/badge/Privacy-100%25%20Offline-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="Privacy" />
    <img src="https://img.shields.io/badge/UI-Glassmorphism-6366f1?style=for-the-badge" alt="UI" />
  </p>

  <!-- QUICK LINKS -->
  <h4>
    <a href="#-richiedi-lapk">📲 Richiedi APK</a>
    <span> · </span>
    <a href="#-funzionalità-principali">✨ Funzionalità</a>
    <span> · </span>
    <a href="#-come-eseguire-il-progetto-per-sviluppatori">🚀 Installazione</a>
    <span> · </span>
    <a href="https://github.com/davide23567/spendsmart/issues">🐛 Segnala un Bug</a>
  </h4>

</div>

---

## 🎯 Perché SpendSmart?

A differenza delle app bancarie tradizionali o dei fogli di calcolo complessi, **SpendSmart** nasce con un solo obiettivo: **azzerare la frizione quotidiana**.

| Problema Comune ❌ | La Soluzione SpendSmart ✅ |
| :--- | :--- |
| App lente con login obbligatorio e pubblicità | **Avvio istantaneo**, nessun account richiesto |
| Dati finanziari salvati su cloud di terze parti | **100% Offline-First**, tutto resta sul dispositivo |
| Dimenticanze su bollette bimestrali o annuali | **Motore di ricorrenza flessibile** per mesi specifici |
| Troppi passaggi per registrare un pagamento | **1-Tap Action**: tocca la card per saldare la spesa |

---

## ✨ Funzionalità Principali

* ⚡ **1-Tap Status Toggle:** Segna qualsiasi spesa come *Pagata* o *Da Pagare* con un singolo tocco sulla scheda.
* 📊 **Dashboard Finanziaria in Tempo Reale:**
  * **Totale Mese:** Panoramica immediata delle uscite previste.
  * **Pagate vs Da Pagare:** Bilancio aggiornato istantaneamente ad ogni tocco.
  * **Progress Bar Dinamica:** Indicatore visivo della percentuale di completamento delle spese mensili.
* 🔁 **Gestione Avanzata Spese Fisse e Ricorrenti:**
  * Ideale per *Affitto, Abbonamenti (Netflix, Spotify, Palestra), Rate e Utenze*.
  * **Modalità Periodo:** Imposta una spesa *Da Mese* a *A Mese* (o a tempo indeterminato).
  * **Modalità Mesi Specifici:** Perfetta per scadenze non mensili (es. bollette bimestrali, assicurazione auto, tasse annuali).
* 🔍 **Smart Filtering:** Filtra al volo le voci tra `Tutte`, `Da Pagare`, `⚠️ Scadute` (evidenziazione automatica oltre il giorno di scadenza) e `Pagate`.
* ↩️ **Safe Delete con Undo:** Notifica Toast interattiva con pulsante *"Annulla"* per ripristinare qualsiasi eliminazione involontaria.
* 🔒 **Privacy Totale:** Nessun tracciamento, nessun database esterno. Persistenza locale ultra-rapida tramite `LocalStorage`.

---

## 🎨 Design System & UX

SpendSmart unisce la flessibilità del design web moderno con un'esperienza nativa Android immersiva:

* **Dark Mode Nativa:** Palette calibrata su toni Slate/Deep Blue (`#0f172a`) con accenti semantici *Emerald* (pagato) e *Indigo* (focus).
* **Glassmorphism UI:** Card traslucide con sfocatura dinamica (`backdrop-filter: blur`) su sfondo con gradient blobs animati.
* **Edge-to-Edge Display:** Integrazione fluida con status bar e navigation bar di Android tramite `WindowCompat`.
* **Tipografia Curata:** Font *Inter* per garantire leggibilità perfetta anche su cifre e badge compatti.

---

## 🛠️ Stack Tecnologico & Architettura

Il progetto adotta un'architettura **Hybrid Web-Native** leggera, evitando framework pesanti per garantire prestazioni immediate su qualsiasi smartphone.

```text
spendsmart/
├── app/src/main/
│   ├── assets/                  # 🌐 WEB CORE (UI & Business Logic)
│   │   ├── index.html           # Struttura semantica & Modali
│   │   ├── styles.css           # Design System, Variabili CSS & Glassmorphism
│   │   ├── script.js            # State Management, Calcoli & LocalStorage
│   │   └── logo.png             # Brand Identity
│   ├── java/.../MainActivity.kt # 📱 ANDROID WRAPPER (Kotlin Edge-to-Edge WebView)
│   └── res/                     # Icone adattive mipmap (mdpi -> xxxhdpi)
├── gradle/libs.versions.toml    # Gestione centralizzata dipendenze (Version Catalog)
└── build.gradle.kts             # Build configuration in Kotlin DSL
