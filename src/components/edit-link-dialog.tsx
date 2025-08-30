"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SidebarLink } from "@/types/sidebar"

interface EditLinkDialogProps {
  link: SidebarLink | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditLink: (name: string, url: string) => void
}

export function EditLinkDialog({ link, open, onOpenChange, onEditLink }: EditLinkDialogProps) {
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  useEffect(() => {
    if (link) {
      setLinkName(link.name)
      setLinkUrl(link.url)
    }
  }, [link])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkName.trim() && linkUrl.trim()) {
      let url = linkUrl.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      onEditLink(linkName.trim(), url)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the link name and URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-link-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-link-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                className="col-span-3"
                placeholder="Enter link name"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-link-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="Enter URL"
                type="url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!linkName.trim() || !linkUrl.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
