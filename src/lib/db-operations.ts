import { db, type Folder, type Link, type Shortcut } from './database'
import { v4 as uuidv4 } from 'uuid'

// Folder operations
export const folderOperations = {
  async getAll(): Promise<Folder[]> {
    return await db.folders.orderBy('createdAt').toArray()
  },

  async create(name: string): Promise<Folder> {
    const folder: Folder = {
      id: uuidv4(),
      name,
      isOpen: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.folders.add(folder)
    return folder
  },

  async update(id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>): Promise<void> {
    await db.folders.update(id, {
      ...updates,
      updatedAt: new Date()
    })
  },

  async delete(id: string): Promise<void> {
    // Delete all links in this folder first
    await db.links.where('folderId').equals(id).delete()
    // Then delete the folder
    await db.folders.delete(id)
  },

  async toggle(id: string): Promise<void> {
    const folder = await db.folders.get(id)
    if (folder) {
      await db.folders.update(id, {
        isOpen: !folder.isOpen,
        updatedAt: new Date()
      })
    }
  }
}

// Link operations
export const linkOperations = {
  async getByFolderId(folderId: string): Promise<Link[]> {
    return await db.links.where('folderId').equals(folderId).toArray()
  },

  async create(folderId: string, name: string, url: string, favicon?: string): Promise<Link> {
    const link: Link = {
      id: uuidv4(),
      folderId,
      name,
      url,
      favicon,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.links.add(link)
    return link
  },

  async update(id: string, updates: Partial<Omit<Link, 'id' | 'folderId' | 'createdAt'>>): Promise<void> {
    await db.links.update(id, {
      ...updates,
      updatedAt: new Date()
    })
  },

  async delete(id: string): Promise<void> {
    await db.links.delete(id)
  }
}

// Shortcut operations
export const shortcutOperations = {
  async getAll(): Promise<Shortcut[]> {
    return await db.shortcuts.orderBy('createdAt').toArray()
  },

  async create(name: string, url: string, favicon?: string): Promise<Shortcut> {
    const shortcut: Shortcut = {
      id: uuidv4(),
      name,
      url,
      favicon,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.shortcuts.add(shortcut)
    return shortcut
  },

  async update(id: string, updates: Partial<Omit<Shortcut, 'id' | 'createdAt'>>): Promise<void> {
    await db.shortcuts.update(id, {
      ...updates,
      updatedAt: new Date()
    })
  },

  async delete(id: string): Promise<void> {
    await db.shortcuts.delete(id)
  }
}

// Utility functions
export const dbUtils = {
  async clearAll(): Promise<void> {
    await db.links.clear()
    await db.folders.clear()
    await db.shortcuts.clear()
  },

  async exportData(): Promise<{ folders: Folder[], links: Link[], shortcuts: Shortcut[] }> {
    const folders = await db.folders.toArray()
    const links = await db.links.toArray()
    const shortcuts = await db.shortcuts.toArray()
    return { folders, links, shortcuts }
  },

  async importData(data: { folders: Folder[], links: Link[], shortcuts: Shortcut[] }): Promise<void> {
    await this.clearAll()
    await db.folders.bulkAdd(data.folders)
    await db.links.bulkAdd(data.links)
    if (data.shortcuts) {
      await db.shortcuts.bulkAdd(data.shortcuts)
    }
  }
}
