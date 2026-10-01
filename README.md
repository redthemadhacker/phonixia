# Phonixia: Multiverse Adventure 🎮✨

Phonixia is a free, accessible beta version of a phonics learning quest engineered for children. Designed to make foundational reading engaging and intuitive, players venture through 5 magical realms to master phonetic pronunciation challenges, discover hidden mechanics, and track their literacy journey.

---

## 🌟 Key Features

* **5 Immersive Magical Realms:**
  * *Sound Shallows* — Interactive underwater swimming mechanics.
  * *Builders Guild* — Brick-mason quarry challenges.
  * *Crystal Caverns* — Dynamic minecart dashing.
  * *Skyward Heights* — High-altitude sky gliding.
  * *The Acropolis* — Climax realm showdown.
* **Phonetic Pronunciation Challenges:** Targets foundational letter sounds and syllable audio cues (e.g., *BUH*, *EH*, *DAH*) with hint-free mastery enforcement.
* **Custom Explorer & Guides:** Character creation featuring gender-matched companion guides (**Kam** and **Celine**).
* **Multi-Device Cloud Persistence:** Cross-platform cloud cartridge saves allowing seamless session recovery across phones, tablets, and desktops.
* **Parent Dashboard & Telemetry:** Real-time visibility into player reading progression, mastery checkpoints, and usage statistics.

---

## 🔒 Security & Privacy Architecture

Engineered with zero-trust parental cybersecurity standards:

* **Authentication Standards:** Client and server-side complexity enforcement (uppercase, lowercase, number, special character, 8+ characters) backed by a live validation checklist.
* **Cryptographic Storage:** Strong salted key derivation implemented via standard Web Crypto APIs and secure hashing.
* **Local LAN & Wi-Fi Isolation:** Strict security headers, rate-limiting, and local network boundary protections to prevent unauthorized Wi-Fi sniffing or LAN enumeration.

---

## 🛠️ Tech Stack & Environment

| Layer | Technologies |
| :--- | :--- |
| **Development Environment** | Linux (Ubuntu 24.10), VS Code, GitHub, AI Studio |
| **Frontend Core** | React, TypeScript, Vite, Tailwind CSS |
| **Backend & Services** | Node.js, Express, Web Crypto API |
| **Deployment Target** | Cloud Run & Mobile Browser Viewports |

---

## 🚀 Live Demo & Testing

Experience the live beta build:

👉 **[Play Phonixia Beta](https://phonixia-7c9c93ef0d42.herokuapp.com/)**

---

## 📱 Mobile Responsiveness & Viewport Optimization

Phonixia is fine-tuned for touch ergonomics and cross-platform fidelity:

* **Dynamic Viewports:** Uses dynamic viewport height units (`100dvh`) to prevent address-bar clipping on iOS Safari and mobile Chromium browsers.
* **Safe-Area Insets:** Built-in viewport padding supports device notches, rounded device borders, and navigation gestures.
* **Adaptive Canvas Scaling:** Responsive element scaling eliminates horizontal overflow and layout shifts across tablets, laptops, and mobile screens.

---

## 📦 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/redthemadhacker/phonixia.git](https://github.com/redthemadhacker/phonixia.git)
   cd phonixia