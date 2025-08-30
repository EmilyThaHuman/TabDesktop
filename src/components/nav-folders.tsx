"use client"

import { useState } from "react"
import { ChevronRight, Folder, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { AddFolderDialog } from "@/components/add-folder-dialog"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { EditLinkDialog } from "@/components/edit-link-dialog"
import type { SidebarFolder, SidebarLink } from "@/types/sidebar"
import { Input } from "@/components/ui/input"

interface NavFoldersProps {
  folders: SidebarFolder[]
  onAddFolder: (name: string) => void
  onDeleteFolder: (folderId: string) => void
  onRenameFolder: (folderId: string, newName: string) => void
  onToggleFolder: (folderId: string) => void
  onAddLink: (folderId: string, name: string, url: string) => void
  onDeleteLink: (folderId: string, linkId: string) => void
  onEditLink: (folderId: string, linkId: string, name: string, url: string) => void
}

export function NavFolders({
  folders,
  onAddFolder,
  onDeleteFolder,
  onRenameFolder,
  onToggleFolder,
  onAddLink,
  onDeleteLink,
  onEditLink,
}: NavFoldersProps) {
  const { isMobile } = useSidebar()
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const [editingLink, setEditingLink] = useState<{ folderId: string; link: SidebarLink } | null>(null)

  const handleStartRename = (folderId: string, currentName: string) => {
    setEditingFolder(folderId)
    setEditingFolderName(currentName)
  }

  const handleFinishRename = (folderId: string) => {
    if (editingFolderName.trim()) {
      onRenameFolder(folderId, editingFolderName.trim())
    }
    setEditingFolder(null)
    setEditingFolderName("")
  }

  const handleKeyDown = (e: React.KeyboardEvent, folderId: string) => {
    if (e.key === 'Enter') {
      handleFinishRename(folderId)
    } else if (e.key === 'Escape') {
      setEditingFolder(null)
      setEditingFolderName("")
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarMenu>
        {folders.map((folder) => (
          <Collapsible
            key={folder.id}
            asChild
            open={folder.isOpen}
            onOpenChange={() => onToggleFolder(folder.id)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={folder.name}>
                  <Folder className="h-4 w-4" />
                  {editingFolder === folder.id ? (
                    <Input
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={() => handleFinishRename(folder.id)}
                      onKeyDown={(e) => handleKeyDown(e, folder.id)}
                      className="h-6 px-1 text-sm"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{folder.name}</span>
                  )}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <AddLinkDialog
                    onAddLink={(name, url) => onAddLink(folder.id, name, url)}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Plus className="text-muted-foreground" />
                        <span>Add Link</span>
                      </DropdownMenuItem>
                    }
                  />
                  <DropdownMenuItem onClick={() => handleStartRename(folder.id, folder.name)}>
                    <Edit className="text-muted-foreground" />
                    <span>Rename Folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Folder</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {folder.links.map((link) => (
                    <SidebarMenuSubItem key={link.id}>
                      <SidebarMenuSubButton asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          {link.favicon && (
                            <img
                              src={link.favicon}
                              alt=""
                              className="h-4 w-4 flex-shrink-0 rounded-sm"
                              style={{ backgroundColor: '#414141' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <span className="truncate">{link.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover className="ml-auto">
                            <MoreHorizontal className="h-3 w-3" />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-32 rounded-lg"
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                        >
                          <DropdownMenuItem onClick={() => setEditingLink({ folderId: folder.id, link })}>
                            <Edit className="text-muted-foreground h-3 w-3" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteLink(folder.id, link.id)}>
                            <Trash2 className="text-muted-foreground h-3 w-3" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuSubItem>
                  ))}
                  {folder.links.length === 0 && (
                    <SidebarMenuSubItem>
                      <AddLinkDialog
                        onAddLink={(name, url) => onAddLink(folder.id, name, url)}
                        trigger={
                          <SidebarMenuSubButton className="text-muted-foreground">
                            <Plus className="h-4 w-4" />
                            <span>Add first link</span>
                          </SidebarMenuSubButton>
                        }
                      />
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <SidebarMenuItem>
          <AddFolderDialog onAddFolder={onAddFolder} />
        </SidebarMenuItem>
      </SidebarMenu>
      
      <EditLinkDialog
        link={editingLink?.link || null}
        open={!!editingLink}
        onOpenChange={(open) => !open && setEditingLink(null)}
        onEditLink={(name, url) => {
          if (editingLink) {
            onEditLink(editingLink.folderId, editingLink.link.id, name, url)
            setEditingLink(null)
          }
        }}
      />
    </SidebarGroup>
  )
}
