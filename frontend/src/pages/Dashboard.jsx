import { useQuery } from '@tanstack/react-query'
import { getProducts, getCustomers, getOrders } from '../api'
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const { data: products = [], isLoading: pLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const { data: customers = [], isLoading: cLoading } = useQuery({ queryKey: ['customers'], queryFn: getCustomers })
  const { data: orders = [], isLoading: oLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders })

  const isLoading = pLoading || cLoading || oLoading
  const lowStockProducts = products.filter(p => p.quantity_in_stock < 10)

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-800/50 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-28"></div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-28"></div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-28"></div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="h-12 bg-zinc-800/30 rounded w-full mb-2"></div>
          <div className="h-12 bg-zinc-800/30 rounded w-full mb-2"></div>
          <div className="h-12 bg-zinc-800/30 rounded w-full mb-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg text-blue-400">
            <Package size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-400">Total Products</div>
            <div className="text-3xl font-semibold tracking-tight">{products.length}</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-500/20 p-4 rounded-lg text-emerald-400">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-400">Total Customers</div>
            <div className="text-3xl font-semibold tracking-tight">{customers.length}</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-purple-500/20 p-4 rounded-lg text-purple-400">
            <ShoppingCart size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-400">Total Orders</div>
            <div className="text-3xl font-semibold tracking-tight">{orders.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-2 text-rose-400">
          <AlertTriangle size={20} />
          <h2 className="text-xl font-bold text-zinc-100">Low Stock Alerts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="bg-zinc-900/50 text-xs font-medium uppercase tracking-wider text-zinc-400 px-6 py-3.5 border-b border-zinc-800">SKU</th>
                <th className="bg-zinc-900/50 text-xs font-medium uppercase tracking-wider text-zinc-400 px-6 py-3.5 border-b border-zinc-800">Name</th>
                <th className="bg-zinc-900/50 text-xs font-medium uppercase tracking-wider text-zinc-400 px-6 py-3.5 border-b border-zinc-800">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={product.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  <td className="text-sm px-6 py-4 text-zinc-300 font-mono">{product.sku}</td>
                  <td className="text-sm px-6 py-4 text-zinc-300">{product.name}</td>
                  <td className="text-sm px-6 py-4 text-rose-400 font-mono">{product.quantity_in_stock}</td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package size={48} className="text-zinc-600" />
                      <div className="text-zinc-400 font-medium text-base">All clear</div>
                      <div className="text-sm">All products have sufficient stock.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
