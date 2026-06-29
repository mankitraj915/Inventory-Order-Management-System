import { Link, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'
import { Toaster } from 'sonner'
import CommandPalette from './CommandPalette'

export default function Layout() {
  return (
    <div className="bg-zinc-950 text-zinc-50 min-h-screen font-sans antialiased">
      <Toaster theme="dark" position="bottom-right" richColors />
      <CommandPalette />
      <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 font-bold text-xl">
          Inventory Pro
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/products" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-colors">
            <Package size={20} />
            Products
          </Link>
          <Link to="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-colors">
            <Users size={20} />
            Customers
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-colors">
            <ShoppingCart size={20} />
            Orders
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
          Press <kbd className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">⌘K</kbd> to search
        </div>
      </aside>
      <main className="pl-64 h-screen flex flex-col">
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
