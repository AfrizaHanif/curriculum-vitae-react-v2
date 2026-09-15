# 💼 M. Afriza Hanif – Interactive Portfolio & Modern CV

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,bootstrap,sass" alt="Tech Stack" />
  </a>
</p>

<p align="center">
  <b>English</b> | <a href="README.id.md">Bahasa Indonesia</a>
</p>

<p align="center">
  <b>A modern, responsive, and performance-driven curriculum vitae and portfolio website.</b><br />
  Built with Next.js App Router, TypeScript, and Bootstrap 5.
</p>

<p align="center">
  <a href="https://afrizahanif.com"><strong>🌐 Explore the Live Demo »</strong></a>
</p>

---

## 📸 Preview

![Portfolio Preview](./public/images/preview-image.png)

---

## ✨ Key Features

- ⚡ **Blazing Fast & SEO Ready:** Built with Next.js App Router, dynamic metadata, and OpenGraph optimization.
- 📱 **Mobile-First & Responsive:** Clean layout crafted with Bootstrap 5 and custom modular SCSS.
- 🗺️ **Interactive Leaflet Map:** Dynamic map component displaying working areas / project locations.
- 📬 **Interactive Contact Form:** Built-in contact form integration with validation and spam protection.
- ♿ **Accessible & Semantic:** Follows modern web accessibility standards and semantic HTML5 hierarchy.

---

## 🛠️ Tech Stack

### Core & Framework

- [Next.js](https://nextjs.org/) (v16 App Router)
- [React](https://react.dev/) (v19)
- [TypeScript](https://www.typescriptlang.org/) (v5)

### Styling & UI

- [Bootstrap](https://getbootstrap.com/) (v5.3)
- [SASS / SCSS](https://sass-lang.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

### Libraries & Tools

- [Leaflet](https://leafletjs.com/) (Interactive Maps)
- [ESLint](https://eslint.org/) (Code linting & quality)
- GitHub Actions & Lighthouse CI (Automated deployment & auditing)

---

## 📊 Lighthouse Benchmark

| Metric                | Score |    Status    |
| :-------------------- | :---: | :----------: |
| ⚡ **Performance**    | `95+` | 🟢 Excellent |
| ♿ **Accessibility**  | `95+` | 🟢 Excellent |
| 🛡️ **Best Practices** | `100` |  🟢 Perfect  |
| 🔍 **SEO**            | `100` |  🟢 Perfect  |

> 🔗 **Live Audit & Verification:**
>
> - Run a live real-time audit on [Google PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fafrizahanif.com)
> - Automated CI audit status: [![CI & Lighthouse Audit](https://github.com/AfrizaHanif/curriculum-vitae-react-v2/actions/workflows/deploy.yml/badge.svg)](https://github.com/AfrizaHanif/curriculum-vitae-react-v2/actions/workflows/deploy.yml)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- `npm` (bundled with Node.js)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/AfrizaHanif/curriculum-vitae-react-v2.git
   cd curriculum-vitae-react-v2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and adjust the variables as needed.

   > 💡 **Local Development Tip:**  
   > Set `NEXT_PUBLIC_MOCK_SUBMISSION=true` to test contact form submissions locally without requiring personal Formspree credentials.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command              | Description                                   |
| :------------------- | :-------------------------------------------- |
| `npm run dev`        | Runs the app in development mode with Webpack |
| `npm run build`      | Builds the production bundle                  |
| `npm run start`      | Runs the built app in production mode         |
| `npm run lint`       | Checks code formatting and linter issues      |
| `npm run type-check` | Validates TypeScript types across the project |
| `npm run sync-data`  | Runs script to synchronize data               |

---

## 📁 Project Structure

```text
curriculum-vitae-v2/
├── public/              # Static public assets (images, documents, icons)
├── src/
│   ├── app/             # Next.js App Router pages and layouts
│   ├── assets/          # Bundled assets (fonts, images, audio)
│   ├── components/      # Modular and reusable UI components
│   ├── context/         # React Context providers for global state
│   ├── data/            # Static JSON data (profiles, projects, experience)
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Styling files (custom SCSS & CSS)
│   ├── types/           # TypeScript interfaces and type definitions
│   └── utils/           # Utility and helper functions
├── scripts/             # Data synchronization and automation scripts
├── .env.example         # Example environment variables template
└── next.config.ts       # Next.js configuration
```

---

## 📬 Contact & Connect

- **Name:** Muhammad Afriza Hanif
- **LinkedIn:** [linkedin.com/in/afrizahanif](https://linkedin.com/in/afrizahanif)
- **GitHub:** [@AfrizaHanif](https://github.com/AfrizaHanif)
- **Email:** <afrizahanif728@gmail.com>
- **Website:** [afrizahanif.com](https://afrizahanif.com)

---

## 💡 Development & Workflow

Architected and developed by **Muhammad Afriza Hanif**, leveraging modern developer workflows and AI pair-programming tools (Google Gemini / Claude) for code review, accessibility audits, and productivity optimization.

---

## 📄 License

© 2026 Muhammad Afriza Hanif. All rights reserved.

The source code is publicly accessible for evaluation, code review, and recruitment purposes only. Reproduction, redistribution, or unauthorized use of personal assets, branding, and content is strictly prohibited.
