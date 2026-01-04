import React, { useState } from 'react';
import { Package, User, LogOut, Settings, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ORDERS = [
  { id: '#ORD-7782', date: 'Oct 12, 2023', status: 'Delivered', total: 895, items: ['Amethyst Silk Evening Gown'] },
  { id: '#ORD-5521', date: 'Sep 28, 2023', status: 'Processing', total: 320, items: ['Midnight Velvet Blazer'] },
  { id: '#ORD-3390', date: 'Aug 15, 2023', status: 'Delivered', total: 550, items: ['Crystal Embellished Clutch'] },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'settings'>('orders');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-primary-950">My Account</h1>
          <p className="text-slate-500">Welcome back, Sophia</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-900 border-l-4 border-primary-600' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'}`}
                >
                  <Package className="w-5 h-5" /> Orders
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-900 border-l-4 border-primary-600' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'}`}
                >
                  <User className="w-5 h-5" /> Profile Details
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-900 border-l-4 border-primary-600' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'}`}
                >
                  <Settings className="w-5 h-5" /> Settings
                </button>
                <button className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-auto border-t border-gray-100">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]"
            >
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary-950 mb-6">Order History</h2>
                  <div className="space-y-4">
                    {MOCK_ORDERS.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow group">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <div>
                            <span className="font-bold text-primary-900 block">{order.id}</span>
                            <span className="text-sm text-slate-500">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                            <span className="font-medium text-slate-900">${order.total}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                          <p className="text-sm text-slate-600">
                            {order.items.join(', ')} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
                          </p>
                          <button className="text-primary-600 text-sm font-medium flex items-center hover:underline">
                            View Details <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-xl">
                  <h2 className="font-serif text-xl font-bold text-primary-950 mb-6">Profile Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <input type="text" defaultValue="Sophia" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input type="text" defaultValue="Sterling" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input type="email" defaultValue="sophia.sterling@example.com" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none" />
                    </div>
                    <button className="bg-primary-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary-950 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-slate-900">Email Notifications</h4>
                        <p className="text-sm text-slate-500">Receive updates about your order status.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary-600"/>
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-primary-600"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-slate-900">New Arrivals</h4>
                        <p className="text-sm text-slate-500">Get notified when new collections drop.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" defaultChecked className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer right-0 border-primary-600"/>
                        <div className="block overflow-hidden h-6 rounded-full bg-primary-600 cursor-pointer"></div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="text-red-600 text-sm font-medium hover:underline">Delete Account</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;