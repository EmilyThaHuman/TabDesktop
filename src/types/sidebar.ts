export interface SidebarLink {
  id: string
  name: string
  url: string
  favicon?: string
}

export interface SidebarFolder {
  id: string
  name: string
  links: SidebarLink[]
  isOpen?: boolean
}
