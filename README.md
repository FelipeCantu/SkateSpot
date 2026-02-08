# SkateSpot

<div align="center">

  ![SkateSpot Banner](https://via.placeholder.com/1200x400?text=SkateSpot+Banner)

  ### Discover spots, share clips, and compete.

  <div align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=for-the-badge" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&style=for-the-badge" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&style=for-the-badge" alt="Prisma" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&style=for-the-badge" alt="TailwindCSS" />
  </div>
</div>

<br />

## 🛹 Overview

**SkateSpot** is the ultimate social platform for skateboarders. Find hidden spots, track your progression, and climb the ranks from **Rookie** to **Legend**.

Whether you're looking for the perfect stair set, a hidden ditch, or a buttery ledge, SkateSpot puts it on the map. Upload your clips, get rated by the community, and prove you own the spot.

---

## ✨ Features

- **🗺️ Interactive Spot Map** — Discover skate spots (street, park, DIY, transition) on a Leaflet-powered map. Filter by type and difficulty, and see what's near you.
- **📹 Clip Feed** — A TikTok-style feed for skateboarding. Upload clips, get likes, and build your hype.
- **🏆 Leaderboards** — Real-time rankings. Compete for the top spot globally or become the "King of the Spot" at your local park.
- **👤 Pro Profiles** — Showcase your best clips, your stats, and your gear setup.
- **🔔 Live Notifications** — Never miss a session. Get notified when friends drop new clips or when someone steals your spot record.
- **📈 Progression System** — Earn points to level up your tier:

  | Action | Points |
  |:---|:---:|
  | Create a spot | +25 |
  | Upload a clip | +50 |
  | Receive a like | +5 |
  | Receive a comment | +10 |
  | Gain a follower | +5 |

  | Tier | Points Required |
  |:---|:---:|
  | 🟢 Rookie | 0 |
  | 🔵 Amateur | 100 |
  | 🟣 Pro | 500 |
  | 🟡 Legend | 1,000 |

- **⭐ Ratings** — Rate spots and clips on a 1–5 star scale. Ratings feed into leaderboard rankings and "King of the Spot" titles.
- **💾 Save Clips** — Bookmark your favorite clips to watch later from your profile.

### 📸 Screenshots

| Map View | Spot Detail | User Profile |
|:---:|:---:|:---:|
| ![Map](https://via.placeholder.com/300x600?text=Map+View) | ![Spot](https://via.placeholder.com/300x600?text=Spot+Detail) | ![Profile](https://via.placeholder.com/300x600?text=User+Profile) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn** or **pnpm**
- **SQLite** (for local dev)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FelipeCantu/SkateSpot.git
   cd skatespot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   # (Optional) Seed with sample data
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/index.html) + [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Avatars**: [DiceBear](https://www.dicebear.com/) (auto-generated from username)

---

## 📂 Project Structure

```bash
skatespot/
├── app/
│   ├── api/                  # 26 API routes (auth, spots, clips, users, leaderboard, notifications)
│   ├── map/                  # Interactive spot discovery map
│   ├── feed/                 # Clip feed with likes, comments, saves
│   ├── leaderboard/          # Global rankings page
│   ├── profile/              # Current user profile (clips, saved, liked tabs)
│   ├── user/[id]/            # Public user profiles with follow
│   ├── spot/[id]/            # Spot detail + "King of the Spot" leaderboard
│   ├── login/                # Login page
│   ├── signup/               # Registration page
│   ├── layout.tsx            # Root layout with context providers
│   └── page.tsx              # Landing page
├── components/               # Reusable UI (Navbar, SpotCard, FeedCard, Modals, etc.)
├── context/                  # React Context providers (UserContext, SpotContext, FeedContext)
├── lib/                      # Auth config, Prisma client, API helpers, points logic
├── utils/                    # Geolocation hook, Haversine distance, geocoding
├── types/                    # TypeScript type definitions + NextAuth augmentation
├── prisma/                   # Database schema & migrations
└── public/                   # Static assets & uploads
```

---

## 🔌 API Routes

<details>
<summary>Click to expand full API documentation</summary>

**Auth**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |

**Spots**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/spots` | List all spots with images & ratings |
| `POST` | `/api/spots` | Create a new spot (+25 pts) |
| `GET` | `/api/spots/[id]` | Get spot details + King of the Spot |
| `DELETE` | `/api/spots/[id]` | Delete a spot (owner only) |
| `POST` | `/api/spots/[id]/rate` | Rate a spot (1–5 stars) |

**Clips**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/clips` | List all clips (sort by recent/popular) |
| `POST` | `/api/clips` | Upload a clip (+50 pts) |
| `GET` | `/api/clips/[id]` | Get clip details |
| `DELETE` | `/api/clips/[id]` | Delete a clip (owner only) |
| `POST` | `/api/clips/[id]/like` | Toggle like (+5 pts to creator) |
| `POST` | `/api/clips/[id]/save` | Toggle save/bookmark |
| `POST` | `/api/clips/[id]/rate` | Rate a clip (1–5 stars) |
| `GET` | `/api/clips/[id]/comment` | Get comments on a clip |
| `POST` | `/api/clips/[id]/comment` | Add a comment (+10 pts to creator) |

**Users**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/me` | Get current user profile |
| `PATCH` | `/api/users/me` | Update profile (name, bio, socials) |
| `GET` | `/api/users/me/liked` | Get liked clips |
| `GET` | `/api/users/me/saved` | Get saved clips |
| `GET` | `/api/users/[id]` | Get another user's profile |
| `POST` | `/api/users/[id]/follow` | Toggle follow (+5 pts) |

**Leaderboard & Notifications**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leaderboard` | Top 20 users + top 10 spots |
| `GET` | `/api/leaderboard/spots/[spotId]` | King of the Spot rankings |
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/[id]` | Mark notification as read |
| `PATCH` | `/api/notifications` | Mark all as read |

</details>

---

## 🗄️ Database Schema

10 models managed by Prisma:

| Model | Description |
| :--- | :--- |
| **User** | Profile, credentials, points, tier, social links (Instagram, YouTube, TikTok) |
| **Spot** | Location (lat/lng), type, difficulty, feature tags, verification status |
| **SpotImage** | Photo URLs attached to spots (up to 5 per spot) |
| **Clip** | Video/image URL, thumbnail, trick name, view & engagement counts |
| **Like** | User → clip like (unique per user per clip) |
| **Save** | User → clip bookmark (unique per user per clip) |
| **Rating** | 1–5 star rating for spots or clips (unique per user per target) |
| **Comment** | Text comments on clips |
| **Follow** | User → user follow relationship |
| **Notification** | Activity alerts (like, comment, follow, achievement) |

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push Prisma schema to database
npm run db:seed    # Seed database with sample data
npm run db:reset   # Reset and reseed database
```

---

## 🗺️ Roadmap

- [x] User auth (signup / login / JWT sessions)
- [x] Interactive map with spot pins & geolocation
- [x] Spot creation with photos, types, difficulty & feature tags
- [x] Clip uploads with trick tagging
- [x] Like, comment, save & star rating system
- [x] Follow system with notifications
- [x] Points system & tier progression
- [x] Global + spot-level leaderboards ("King of the Spot")
- [x] User profiles with clips, saved & liked tabs
- [ ] Head-to-head battle voting system
- [ ] Challenge notifications & podium badges
- [ ] Direct messaging
- [ ] Crews / groups & crew battles
- [ ] Session scheduling & meetups
- [ ] Trick checklist & skill tree progression
- [ ] Achievements & badges system
- [ ] Weather integration & skateability scores
- [ ] Events & virtual contests
- [ ] Tutorial section & mentorship
- [ ] Gear setup tracking
- [ ] Built-in clip editor
- [ ] AI-powered trick detection
- [ ] AR features (trick preview, ghost replay)
- [ ] Offline mode
- [ ] Pro subscriptions & monetization

---

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) in the Vercel dashboard.
   - *Note: For production, you will need a hosted database (e.g., Vercel Postgres, PlanetScale, or Railway) instead of SQLite.*
4. Deploy!

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
