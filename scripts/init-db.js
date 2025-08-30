#!/usr/bin/env node

console.log(`
📖 TabDesktop Database CLI

The database is automatically initialized when you first run the application.
Your data is stored in IndexedDB in your browser.

Available npm scripts:
  pnpm run dev        - Start the development server
  pnpm run build      - Build for production
  pnpm run db:help    - Show this help

Database Features:
✅ Automatic initialization on first app load
✅ Persistent storage using IndexedDB (Dexie)
✅ Folders and links are automatically saved
✅ Data persists between browser sessions
✅ No server setup required

To manage your data:
1. Start the app: pnpm run dev
2. Add/edit folders and links through the UI
3. Data is automatically saved to IndexedDB

Database Location:
- Browser: IndexedDB database named "TabDesktopDB"
- Tables: folders, links
- Automatic backups: Use browser dev tools > Application > Storage

Note: IndexedDB is a browser-based database that doesn't require
command-line initialization. Your data is stored locally and
persists across browser sessions.
`)

process.exit(0)
