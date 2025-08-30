import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ShortcutGrid } from "@/components/shortcut-grid"

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <div className="flex-1">
          <ShortcutGrid />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default App
