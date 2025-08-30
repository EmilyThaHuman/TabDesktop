"use client"

import * as React from "react"
import {
  PanelLeft,
} from "lucide-react"
import artifactLogo from "@/assets/artifact-logo.png"

import { NavFolders } from "@/components/nav-folders" 
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSidebarFolders } from "@/hooks/use-sidebar-folders"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()
  const [isHovered, setIsHovered] = React.useState(false)
  const {
    folders,
    addFolder,
    deleteFolder,
    renameFolder,
    toggleFolder,
    addLink,
    deleteLink,
    editLink
  } = useSidebarFolders()

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className={`relative flex items-center ${state === 'collapsed' ? 'px-2 py-2' : 'px-4 py-3'}`}>
        <div className="flex items-center gap-2 w-full">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={artifactLogo} alt="TabDesktop" />
              <AvatarFallback>TD</AvatarFallback>
            </Avatar>
            {state === 'collapsed' && (
              <Button
                variant="ghost"
                size="icon"
                className={`absolute inset-0 h-8 w-8 rounded-md transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={toggleSidebar}
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
          </div>
          {state === 'expanded' && (
            <>
              <span className="font-medium">Reed's Desktop</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8 rounded-md"
                onClick={toggleSidebar}
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <SidebarContent>
        <NavFolders
          folders={folders}
          onAddFolder={addFolder}
          onDeleteFolder={deleteFolder}
          onRenameFolder={renameFolder}
          onToggleFolder={toggleFolder}
          onAddLink={addLink}
          onDeleteLink={deleteLink}
          onEditLink={editLink}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
