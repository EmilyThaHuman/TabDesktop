import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useShortcuts } from '@/hooks/use-shortcuts'
import { AddShortcutDialog } from './add-shortcut-dialog'
import { EditLinkDialog } from './edit-link-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import type { Shortcut } from '@/lib/database'

export function ShortcutGrid() {
  const { shortcuts, removeShortcut, updateShortcut } = useShortcuts()
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null)

  const handleShortcutClick = (url: string, e: React.MouseEvent) => {
    // Don't open link if clicking on dropdown trigger or dropdown content
    const target = e.target as HTMLElement
    if (target.closest('[data-dropdown-trigger]') || 
        target.closest('[role="menu"]') || 
        target.closest('[data-radix-popper-content-wrapper]')) {
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleEdit = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut)
  }

  const handleDelete = async (id: string) => {
    await removeShortcut(id)
  }

  const handleEditSubmit = async (name: string, url: string, customImage?: string) => {
    if (editingShortcut) {
      let processedUrl = url.trim()
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl
      }
      
      const favicon = customImage || `https://www.google.com/s2/favicons?domain=${new URL(processedUrl).hostname}&sz=64`
      
      await updateShortcut(editingShortcut.id, {
        name: name.trim(),
        url: processedUrl,
        favicon
      })
      setEditingShortcut(null)
    }
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-10 gap-6">
        {/* Add shortcut button */}
        <div className="flex flex-col items-center space-y-2">
          <AddShortcutDialog>
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center cursor-pointer transition-colors">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
          </AddShortcutDialog>
          <span className="text-xs text-gray-500 text-center">Add shortcut</span>
        </div>

        {/* Existing shortcuts */}
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.id}
            className="flex flex-col items-center space-y-2 cursor-pointer group relative"
            onMouseDown={(e) => {
              // Prevent click if it's on dropdown elements
              const target = e.target as HTMLElement
              if (target.closest('[data-dropdown-trigger]') || 
                  target.closest('[role="menu"]') || 
                  target.closest('[data-radix-popper-content-wrapper]')) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            onClick={(e) => handleShortcutClick(shortcut.url, e)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 group-hover:scale-105 transition-transform">
                <AvatarImage 
                  src={shortcut.favicon} 
                  alt={shortcut.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs font-medium bg-gray-100">
                  {shortcut.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    data-dropdown-trigger
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault()
                      handleEdit(shortcut)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault()
                      handleDelete(shortcut.id)
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <span className="text-xs text-gray-700 text-center max-w-full truncate">
              {shortcut.name}
            </span>
          </div>
        ))}
      </div>
      
      {/* Edit dialog */}
      <EditLinkDialog
        link={editingShortcut ? {
          id: editingShortcut.id,
          name: editingShortcut.name,
          url: editingShortcut.url,
          favicon: editingShortcut.favicon
        } : null}
        open={!!editingShortcut}
        onOpenChange={(open) => !open && setEditingShortcut(null)}
        onEditLink={handleEditSubmit}
      />
    </div>
  )
}
