import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useShortcuts } from '@/hooks/use-shortcuts'

interface AddShortcutDialogProps {
  children?: React.ReactNode
}

export function AddShortcutDialog({ children }: AddShortcutDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addShortcut } = useShortcuts()

  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return `https://www.google.com/s2/favicons?domain=${url}&sz=64`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    setIsLoading(true)
    
    try {
      let processedUrl = url.trim()
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl
      }

      const favicon = getFaviconUrl(processedUrl)
      
      await addShortcut(name.trim(), processedUrl, favicon)

      setName('')
      setUrl('')
      setOpen(false)
    } catch (error) {
      console.error('Error adding shortcut:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName('')
    setUrl('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add shortcut</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter shortcut name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !url.trim()}>
              {isLoading ? 'Adding...' : 'Done'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
