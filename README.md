
# Soozeer

**Soozeer** is a modern **social media platform** built as a personal full-stack project.  
It allows users to create profiles, post content, follow others, like/comment, and explore a feed — all with a clean, responsive UI.

Live Demo → [https://soozeer.netlify.app](https://soozeer.netlify.app)

Homepage ![Homepage](https://res.cloudinary.com/dgmpx8acb/image/upload/v1772433291/soozeer_bhydg5.webp)
Profile ![Profile](https://res.cloudinary.com/dgmpx8acb/image/upload/v1772433761/Screenshot_2026-03-02_at_07.40.09_tegwlq.png)
Search ![Search](https://res.cloudinary.com/dgmpx8acb/image/upload/v1772433762/Screenshot_2026-03-02_at_07.40.49_bfplqx.png)
Message ![Message](https://res.cloudinary.com/dgmpx8acb/image/upload/v1772433762/Screenshot_2026-03-02_at_07.39.24_sezhcu.png)

## ✨ Features

- User authentication (sign up / login / logout)
- Create, edit, delete posts
- Like & comment on posts
- Responsive design (mobile + desktop)
- Real-time-ish feed with fast data fetching
- Profile pages
- Follow / unfollow users (planned or partial)
- Dark/light mode support (if implemented)

## 🛠️ Tech Stack

| Layer            | Technology                        | Purpose                              |
|------------------|-----------------------------------|--------------------------------------|
| Frontend         | React 18 + Vite                   | Fast development & build tool        |
| Styling          | Tailwind CSS                      | Utility-first CSS framework          |
| Routing          | React Router v6                   | Client-side navigation               |
| State Management | Redux Toolkit + RTK Query         | Global state & caching               |
| Data Fetching    | TanStack React Query              | Server-state, caching, refetching    |
| Backend / DB     | Supabase                          | PostgreSQL + Authentication          |
| Linting/Formatting | ESLint + Prettier (configured)   | Code quality                         |
| Deployment       | Netlify                           | Hosting static frontend              |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm, yarn or npm

### Installation

```bash
# Clone the repo
git clone https://github.com/AkhatorEnosa/soozeer.git
cd soozeer

# Install dependencies
pnpm install
# or
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these from your Supabase project → Settings → API.

### Development

```bash
# Start dev server (http://localhost:5173)
pnpm dev
# or
npm run dev
```

### Build for production

```bash
pnpm build
# Preview locally
pnpm preview
```

## 📂 Project Structure (high-level)

```
soozeer/
├── public/                 → static assets
├── src/
│   ├── components/         → reusable UI pieces
│   ├── features/           → feature-based slices (posts, auth, users…)
│   ├── pages/              → route-level pages
│   ├── hooks/              → custom hooks
│   ├── lib/                → supabase client, utils
│   ├── store/              → redux store & slices
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🗺️ Roadmap / Planned Features

- [ ] Image/video uploads (Supabase Storage)
- [ ] Infinite scroll on feed
- [ ] PWA support

## 🤝 Contributing

This is currently a personal project, but feel free to open issues or PRs if you find bugs or have improvement ideas.

1. Fork the repo
2. Create feature/bugfix branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License (add a `LICENSE` file if you want to make it official)

---

Made with ❤️ by [Osa Akhator](https://github.com/AkhatorEnosa)  
Frontend Developer • React • Tailwind • Supabase
```
