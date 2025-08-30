import Dexie, { type EntityTable } from 'dexie'

export interface Folder {
  id: string
  name: string
  isOpen: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Link {
  id: string
  folderId: string
  name: string
  url: string
  favicon?: string
  createdAt: Date
  updatedAt: Date
}

export interface Shortcut {
  id: string
  name: string
  url: string
  favicon?: string
  createdAt: Date
  updatedAt: Date
}

const db = new Dexie('TabDesktopDB') as Dexie & {
  folders: EntityTable<Folder, 'id'>
  links: EntityTable<Link, 'id'>
  shortcuts: EntityTable<Shortcut, 'id'>
}

// Define schemas
db.version(1).stores({
  folders: 'id, name, isOpen, createdAt, updatedAt',
  links: 'id, folderId, name, url, favicon, createdAt, updatedAt',
  shortcuts: 'id, name, url, favicon, createdAt, updatedAt'
})

export { db }
