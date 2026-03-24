# User Pages

This folder contains all user-facing pages for the Events Hub platform.

---

## 📄 Pages

### Home (`Home.tsx`)

* Displays featured events
* Includes search bar and category shortcuts
* Provides quick navigation to browse events

### Browse Events (`BrowseEvents.tsx`)

* Displays all available events
* Supports:

  * Search
  * Category filtering
  * Date filtering
  * Location filtering
* Includes grid/list toggle
* Displays empty state when no results are found

---

## 🧩 Components Used

* Sidebar
* Topbar
* Footer
* EventGrid
* EventCard

---

## 📌 Notes

* Navigation is limited to:

  * `/home`
  * `/browse-events`
* Event actions currently redirect to browse events or placeholder routes
* Designed to be integrated with backend APIs in future development
