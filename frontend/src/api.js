import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

export const getProducts = async () => (await api.get('/products')).data
export const getProduct = async (id) => (await api.get(`/products/${id}`)).data
export const createProduct = async (data) => (await api.post('/products', data)).data
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data

export const getCustomers = async () => (await api.get('/customers')).data
export const getCustomer = async (id) => (await api.get(`/customers/${id}`)).data
export const createCustomer = async (data) => (await api.post('/customers', data)).data
export const deleteCustomer = async (id) => (await api.delete(`/customers/${id}`)).data

export const getOrders = async () => (await api.get('/orders')).data
export const getOrder = async (id) => (await api.get(`/orders/${id}`)).data
export const createOrder = async (data) => (await api.post('/orders', data)).data
export const deleteOrder = async (id) => (await api.delete(`/orders/${id}`)).data
