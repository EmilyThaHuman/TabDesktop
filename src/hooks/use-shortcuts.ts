import { useState, useCallback, useEffect } from 'react'
import { shortcutOperations } from '@/lib/db-operations'
import type { Shortcut } from '@/lib/database'

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [loading, setLoading] = useState(true)

  // Load shortcuts from database
  const loadShortcuts = useCallback(async () => {
    try {
      const dbShortcuts = await shortcutOperations.getAll()
      setShortcuts(dbShortcuts)
    } catch (error) {
      console.error('Failed to load shortcuts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShortcuts()
  }, [loadShortcuts])

  const addShortcut = useCallback(async (name: string, url: string, favicon?: string) => {
    try {
      await shortcutOperations.create(name, url, favicon)
      await loadShortcuts()
    } catch (error) {
      console.error('Failed to add shortcut:', error)
    }
  }, [loadShortcuts])

  const removeShortcut = useCallback(async (id: string) => {
    try {
      await shortcutOperations.delete(id)
      await loadShortcuts()
    } catch (error) {
      console.error('Failed to remove shortcut:', error)
    }
  }, [loadShortcuts])

  const updateShortcut = useCallback(async (id: string, updates: Partial<Omit<Shortcut, 'id' | 'createdAt'>>) => {
    try {
      await shortcutOperations.update(id, updates)
      await loadShortcuts()
    } catch (error) {
      console.error('Failed to update shortcut:', error)
    }
  }, [loadShortcuts])

  return {
    shortcuts,
    loading,
    addShortcut,
    removeShortcut,
    updateShortcut
  }
}
