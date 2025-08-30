import { useState, useCallback, useEffect } from 'react'
import type { SidebarFolder } from '@/types/sidebar'
import { folderOperations, linkOperations } from '@/lib/db-operations'
import type { Folder } from '@/lib/database'

export function useSidebarFolders() {
  const [folders, setFolders] = useState<SidebarFolder[]>([])
  const [loading, setLoading] = useState(true)

  // Convert database types to UI types
  const convertToSidebarFolder = useCallback(async (dbFolder: Folder): Promise<SidebarFolder> => {
    const links = await linkOperations.getByFolderId(dbFolder.id)
    return {
      id: dbFolder.id,
      name: dbFolder.name,
      isOpen: dbFolder.isOpen,
      links: links.map(link => ({
        id: link.id,
        name: link.name,
        url: link.url,
        favicon: link.favicon
      }))
    }
  }, [])

  // Load folders from database
  const loadFolders = useCallback(async () => {
    try {
      const dbFolders = await folderOperations.getAll()
      const sidebarFolders = await Promise.all(
        dbFolders.map(folder => convertToSidebarFolder(folder))
      )
      setFolders(sidebarFolders)
    } catch (error) {
      console.error('Failed to load folders:', error)
      // Initialize with default folders if database is empty
      if (folders.length === 0) {
        await folderOperations.create('Work')
        await folderOperations.create('Personal')
        await loadFolders()
      }
    } finally {
      setLoading(false)
    }
  }, [convertToSidebarFolder, folders.length])

  useEffect(() => {
    loadFolders()
  }, [loadFolders])

  const addFolder = useCallback(async (name: string) => {
    try {
      await folderOperations.create(name)
      await loadFolders()
    } catch (error) {
      console.error('Failed to add folder:', error)
    }
  }, [loadFolders])

  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      await folderOperations.delete(folderId)
      await loadFolders()
    } catch (error) {
      console.error('Failed to delete folder:', error)
    }
  }, [loadFolders])

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
    try {
      await folderOperations.update(folderId, { name: newName })
      await loadFolders()
    } catch (error) {
      console.error('Failed to rename folder:', error)
    }
  }, [loadFolders])

  const toggleFolder = useCallback(async (folderId: string) => {
    try {
      await folderOperations.toggle(folderId)
      await loadFolders()
    } catch (error) {
      console.error('Failed to toggle folder:', error)
    }
  }, [loadFolders])

  const addLink = useCallback(async (folderId: string, name: string, url: string) => {
    try {
      const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`
      await linkOperations.create(folderId, name, url, favicon)
      await loadFolders()
    } catch (error) {
      console.error('Failed to add link:', error)
    }
  }, [loadFolders])

  const deleteLink = useCallback(async (_folderId: string, linkId: string) => {
    try {
      await linkOperations.delete(linkId)
      await loadFolders()
    } catch (error) {
      console.error('Failed to delete link:', error)
    }
  }, [loadFolders])

  const editLink = useCallback(async (_folderId: string, linkId: string, name: string, url: string) => {
    try {
      const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`
      await linkOperations.update(linkId, { name, url, favicon })
      await loadFolders()
    } catch (error) {
      console.error('Failed to edit link:', error)
    }
  }, [loadFolders])

  return {
    folders,
    loading,
    addFolder,
    deleteFolder,
    renameFolder,
    toggleFolder,
    addLink,
    deleteLink,
    editLink
  }
}
