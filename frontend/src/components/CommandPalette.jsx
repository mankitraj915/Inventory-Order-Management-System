import { Command } from 'cmdk'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <Command.Input 
          placeholder="Search..." 
          className="w-full bg-transparent px-4 py-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none border-b border-zinc-800" 
        />
        <Command.List>
          <Command.Item
            onSelect={() => { navigate('/'); setOpen(false) }}
            className="px-4 py-3 text-sm text-zinc-300 flex items-center gap-3 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors aria-selected:bg-indigo-600 aria-selected:text-white"
          >
            <LayoutDashboard size={18} />
            Go to Dashboard
          </Command.Item>
          <Command.Item
            onSelect={() => { navigate('/products'); setOpen(false) }}
            className="px-4 py-3 text-sm text-zinc-300 flex items-center gap-3 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors aria-selected:bg-indigo-600 aria-selected:text-white"
          >
            <Package size={18} />
            Go to Products
          </Command.Item>
          <Command.Item
            onSelect={() => { navigate('/customers'); setOpen(false) }}
            className="px-4 py-3 text-sm text-zinc-300 flex items-center gap-3 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors aria-selected:bg-indigo-600 aria-selected:text-white"
          >
            <Users size={18} />
            Go to Customers
          </Command.Item>
          <Command.Item
            onSelect={() => { navigate('/orders'); setOpen(false) }}
            className="px-4 py-3 text-sm text-zinc-300 flex items-center gap-3 cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors aria-selected:bg-indigo-600 aria-selected:text-white"
          >
            <ShoppingCart size={18} />
            Go to Orders
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  )
}
