# KiplyStart 2026 🚀

> **"Primero en tus manos, después tu pago"**

KiplyStart is a modern e-commerce platform built for the Venezuelan market, focusing on trust, speed, and a "Cash on Delivery" model. It leverages **Neuro-Marketing principles** and **Scientific Branding** to maximize conversion.

## 🧠 Brains (The Source of Truth)

This project is governed by two core documents found in `brain/`:

1.  **`TECHNICAL_BRAIN_2026.md`**: Validates all code decisions.
    *   *Key Rules*: Mobile-first, LCP < 1.2s, Hick's Law (max 5 options), Pure Functions.
2.  **`BRANDING_CIENTIFICO_V2.md`**: Validates all visual/copy decisions.
    *   *Key Rules*: 'Amigo Autoridad' archetype, Deep Blue (#0A2463) & Bright Red (#E63946), Von Restorff effect.

## 🛠 Tech Stack

*   **Frontend**: React + Vite
*   **Styling**: Tailwind CSS (Custom Config)
*   **Backend**: Supabase (Database + Auth)
*   **Hosting**: Vercel (Recommended)

## 📂 Project Structure

```bash
src/
├── components/      # UI Components (Atom/Molecules)
│   ├── Navbar.jsx   # Main navigation
│   ├── ProductCard.jsx # Smart display card
│   └── ...
├── lib/             # Logic & Clients
│   └── supabaseClient.js
├── views/           # Page Views
│   ├── Home.jsx     # Landing Page
│   ├── Catalogo.jsx # Product Grid
│   └── ...
└── main.jsx         # Entry point
```

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file based on `.env.example`:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📦 Deployment (Vercel)

1.  **Build**:
    ```bash
    npm run build
    ```
    *Output directory: `dist/`*

2.  **Deploy**:
    Connect your GitHub repository to Vercel. The default settings for Vite (`npm run build` as build command, `dist` as output) work out of the box.

    *Note: Ensure you add your Environment Variables in the Vercel Dashboard.*

## 🧪 Testing & Validation

Before committing, run the **"Brain Check"**:
- [ ] Is the primary CTA Red (#E63946)?
- [ ] Are secondary actions Blue/Neutral?
- [ ] Is the Navbar simple (max 5 items)?
- [ ] Does the page load under 1.5s?

---
© 2026 KiplyStart. Built with Scientific Precision.
