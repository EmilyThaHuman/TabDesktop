// This file has been deprecated in favor of IndexedDB storage
// Shortcuts are now managed through:
// - Database: src/lib/database.ts (Shortcut interface)
// - Operations: src/lib/db-operations.ts (shortcutOperations)
// - Hook: src/hooks/use-shortcuts.ts (useShortcuts)
//
// This file is kept temporarily for reference during migration
// and can be safely deleted once migration is confirmed working.

export interface Shortcut {
  id: string
  name: string
  url: string
  favicon?: string
}

// Legacy store - DO NOT USE
// Use useShortcuts hook instead
