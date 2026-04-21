# EventsHub

This repository contains the frontend (and future backend) for the EventsHub platform.

---

## 🚀 Current Frontend Status

The following pages are fully functional on the frontend:

### Authentication Pages

* Login
* Signup

### Shared Page

* Settings

### User Pages

* Home
* Browse Events

### Organiser Pages

* Organiser Home 
* Analytics

### Shared Features

* Sidebar (toggle on all screen sizes)
* Topbar with logo + sponsors placeholder
* Footer
* Event cards & grids
* Search → BrowseEvents flow
* Filters (category, date, location)
* Grid / list view
* Role-based UI (admin vs user)

---

## 🛠 Tech Stack

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS (v4 with Vite plugin)

---

## 📁 Project Structure

```
client/
  src/
    components/
      events/
      layout/
      ui/
    context/
    data/
    pages/
      authenticattion/
      organiser/
      user/
      settings/
    routes/
    styles/
    types/
    utilis/
    App.tsx
    main.tsx
```

---

## 📦 Setup Instructions (for developers)

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd EventsHub/client
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run the development server

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 🎨 Tailwind CSS Setup

This project uses Tailwind CSS (v4 with Vite plugin).

Ensure the following:

### `vite.config.ts`

Tailwind plugin must be included:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

### `src/styles/index.css`

```css
@import "tailwindcss";
```

---

### `main.tsx`

```ts
import "./styles/index.css";
```

---

## 👤 Role Testing (IMPORTANT)

This project uses `localStorage` for frontend role simulation.

### Test as admin

Open browser console and run:

```js
localStorage.setItem("role", "admin")
```

Refresh the page.

---

### Test as normal user

```js
localStorage.setItem("role", "user")
```

---

### Clear role

```js
localStorage.removeItem("role")
```

---

## 🔗 Available Routes

### Public

* `/home`
* `/browse-events`

### Admin only

* `/organiser-home`

---

## 🧠 Developer Guidelines

* Use **Tailwind only** (avoid creating new CSS files)
* Reuse shared components:

  * `DashboardLayout`
  * `Sidebar`
  * `Topbar`
  * `Footer`
  * `EventGrid`
  * `EventCard`
  * `StatCard`
* Keep UI consistent (spacing, colors, rounded cards)
* Use existing routing and auth structure
* Keep sidebar links aligned with routes

---

## ⚠️ Common Issues

### Styles not showing

* Check Tailwind plugin in `vite.config.ts`
* Check `@import "tailwindcss";` in CSS
* Restart dev server

---

### Redirect issues

* Check `AppRouter.tsx`
* Check `ProtectedRoute.tsx`
* Check `localStorage role`

---

### Admin page not accessible

Run:

```js
localStorage.setItem("role", "admin")
```

---

## 📌 Next Features to Build

* Categories page
* Event detail page
* My Bookings
* Saved Events
* QR Codes
* Create Event
* My Events
* Attendees
* Analytics

---

## 🤝 Team Note

After pulling updates:

```bash
npm install
npm run dev
```

---

## ✅ Summary

* Frontend for 3 core pages is complete
* Tailwind-based UI system is in place
* Layout + components are reusable
* Ready for expansion
