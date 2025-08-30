"use client";
// pages/admin/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([
    { id: 1, name: 'Handcrafted Oak Table', price: 1299, stock: 12, category: 'Furniture', image: '/api/placeholder/150/100' },
    { id: 2, name: 'Reclaimed Wood Bookshelf', price: 899, stock: 8, category: 'Storage', image: '/api/placeholder/150/100' },
    { id: 3, name: 'Rustic Pine Chair', price: 349, stock: 25, category: 'Seating', image: '/api/placeholder/150/100' }
  ]);
  const [orders, setOrders] = useState([
    { id: 1001, customer: 'Emma Thompson', email: 'emma@email.com', total: 1648, status: 'pending', date: '2024-08-20', items: 2 },
    { id: 1002, customer: 'Michael Chen', email: 'michael@email.com', total: 899, status: 'processing', date: '2024-08-19', items: 1 },
    { id: 1003, customer: 'Sarah Johnson', email: 'sarah@email.com', total: 2145, status: 'shipped', date: '2024-08-18', items: 3 },
    { id: 1004, customer: 'David Wilson', email: 'david@email.com', total: 698, status: 'delivered', date: '2024-08-17', items: 2 }
  ]);

  const [productForm, setProductForm] = useState({
    name: '', price: '', stock: '', category: '', description: ''
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;
    
    const newProduct = {
      id: Date.now(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category,
      description: productForm.description,
      image: '/api/placeholder/150/100'
    };
    
    setProducts([...products, newProduct]);
    setProductForm({ name: '', price: '', stock: '', category: '', description: '' });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <>
      <Head>
        <title>Floresta WUD Admin Dashboard</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Floresta WUD</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'orders', label: 'Orders', icon: '🛍️' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'from-blue-500 to-blue-600' },
                  { title: 'Total Orders', value: stats.totalOrders, icon: '🛍️', color: 'from-green-500 to-green-600' },
                  { title: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'from-amber-500 to-amber-600' },
                  { title: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'from-purple-500 to-purple-600' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Products</h2>
                  <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
              </div>

              {/* Add Product Form */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Product</h3>
                <form onSubmit={addProduct}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select category</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Storage">Storage</option>
                        <option value="Seating">Seating</option>
                        <option value="Decor">Decor</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows="3"
                        placeholder="Product description..."
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">🪵</span>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-bold text-emerald-600">${product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                      >
                        Remove Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                <p className="text-gray-600 mt-1">Manage customer orders and track status</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                              <p className="text-xs text-gray-500">{order.date} • {order.items} items</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                              <p className="text-xs text-gray-500">{order.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'processing')}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium"
                                  >
                                    Process
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-md text-xs font-medium"
                                >
                                  Ship
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium"
                                >
                                  Deliver
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// tailwind.config.js
