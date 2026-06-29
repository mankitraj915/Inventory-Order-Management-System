import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct, deleteProduct } from '../api'
import { Trash2, Plus, PackageX, Search, ArrowUp, ArrowDown } from 'lucide-react'
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel, 
  flexRender 
} from '@tanstack/react-table'
import { toast } from 'sonner'

export default function Products() {
  const queryClient = useQueryClient()
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts })
  
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity_in_stock: '' })
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setFormData({ name: '', sku: '', price: '', quantity_in_stock: '' })
      toast.success('Product created successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Operation failed')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Operation failed')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      quantity_in_stock: parseInt(formData.quantity_in_stock, 10)
    })
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="font-mono">{info.getValue()}</span>
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: info => <span className="font-mono">{info.getValue()}</span>
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => <span className="font-mono">${info.getValue()}</span>
    },
    {
      accessorKey: 'quantity_in_stock',
      header: 'Stock',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          disabled={deleteMutation.isPending && deleteMutation.variables === row.original.id}
          onClick={() => deleteMutation.mutate(row.original.id)}
          className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} />
          Delete
        </button>
      )
    }
  ], [deleteMutation])

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-800/50 rounded w-48"></div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-48"></div>
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
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Products</h1>

      <div className="bg-zinc-900 border border-zinc-800 border-t-2 border-t-indigo-500/50 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-zinc-100">Add Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            required
            type="text"
            placeholder="Name"
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
          />
          <input
            required
            type="text"
            placeholder="SKU"
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.sku}
            onChange={e => setFormData(p => ({ ...p, sku: e.target.value }))}
          />
          <input
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.price}
            onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
          />
          <input
            required
            type="number"
            min="0"
            placeholder="Stock"
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.quantity_in_stock}
            onChange={e => setFormData(p => ({ ...p, quantity_in_stock: e.target.value }))}
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="md:col-span-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            {createMutation.isPending ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <Search size={18} className="text-zinc-500" />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors w-full md:w-64"
          />
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="bg-zinc-900/50 text-xs font-medium uppercase tracking-wider text-zinc-400 px-6 py-3.5 border-b border-zinc-800 cursor-pointer select-none hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUp size={14} className="text-zinc-500" />,
                        desc: <ArrowDown size={14} className="text-zinc-500" />
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <PackageX size={48} className="text-zinc-600" />
                    <div className="text-zinc-400 font-medium text-base">No products found</div>
                    <div className="text-sm">Add your first product above to get started.</div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="text-sm px-6 py-4 text-zinc-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
