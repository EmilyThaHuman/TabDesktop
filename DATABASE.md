# TabDesktop Database

## Overview

TabDesktop uses **IndexedDB** with **Dexie** as a wrapper for persistent local storage. This provides a free, browser-based database solution that requires no server setup and persists data across browser sessions.

## Database Schema

### Tables

#### `folders`
- `id` (string) - Unique identifier
- `name` (string) - Folder name
- `isOpen` (boolean) - Whether folder is expanded
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

#### `links`
- `id` (string) - Unique identifier
- `folderId` (string) - Reference to parent folder
- `name` (string) - Link display name
- `url` (string) - Link URL
- `favicon` (string, optional) - Favicon URL
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

#### `shortcuts`
- `id` (string) - Unique identifier
- `name` (string) - Shortcut display name
- `url` (string) - Shortcut URL
- `favicon` (string, optional) - Favicon URL
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last modification timestamp

## Features

✅ **Automatic Initialization** - Database is created on first app load  
✅ **Persistent Storage** - Data survives browser restarts  
✅ **No Server Required** - Runs entirely in the browser  
✅ **Automatic Backups** - Data is stored locally in IndexedDB  
✅ **Real-time Updates** - Changes are immediately persisted  

## Usage

### Starting the Application
```bash
pnpm run dev
```

The database will be automatically initialized with default "Work" and "Personal" folders on first run.

### Database Operations

All database operations are handled automatically through the UI:
- **Add Folder**: Click the "Add Folder" button
- **Add Link**: Use the "+" button in any folder
- **Edit/Delete**: Use the context menus (⋯ button)
- **Toggle Folders**: Click folder names to expand/collapse

### Data Location

- **Database Name**: `TabDesktopDB`
- **Storage**: Browser's IndexedDB
- **Access**: Browser DevTools > Application > Storage > IndexedDB

### Backup & Export

To backup your data:
1. Open Browser DevTools (F12)
2. Go to Application > Storage > IndexedDB > TabDesktopDB
3. Export data manually or use browser export features

### Development

#### Database Files
- `src/lib/database.ts` - Database schema and connection
- `src/lib/db-operations.ts` - CRUD operations
- `src/hooks/use-sidebar-folders.ts` - React hook integration

#### Available Commands
```bash
pnpm run db:help    # Show database information
pnpm run dev        # Start development server
pnpm run build      # Build for production
```

## Technical Details

### Dependencies
- **Dexie** (v4.2.0) - IndexedDB wrapper
- **UUID** (v11.1.0) - Unique ID generation

### Architecture
```
UI Components
    ↓
React Hooks (use-sidebar-folders)
    ↓
Database Operations (db-operations.ts)
    ↓
Dexie/IndexedDB (database.ts)
```

### Error Handling
- All database operations include try/catch blocks
- Errors are logged to console
- UI gracefully handles database failures
- Automatic fallback to default data on initialization errors

## Migration from localStorage

The application has been migrated from in-memory state to persistent IndexedDB storage. All folder and link operations now automatically save to the database, providing true persistence across browser sessions.
