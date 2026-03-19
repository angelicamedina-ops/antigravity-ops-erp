import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Truck, 
  FileText, 
  RefreshCcw, 
  Undo2, 
  Settings, 
  Search, 
  Bell, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Upload,
  Plus,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, OrderStatus, Product } from './types';
import { PRODUCT_CATALOG } from './constants';
import Fuse from 'fuse.js';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  'PENDING': 'bg-amber-100 text-amber-700 border-amber-200',
  'CONFIRMED': 'bg-blue-100 text-blue-700 border-blue-200',
  'IN QB': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'IN SHIPSTATION': 'bg-purple-100 text-purple-700 border-purple-200',
  'SHIPPED': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'CLOSED': 'bg-slate-100 text-slate-700 border-slate-200',
  'NEEDS ACTION': 'bg-red-100 text-red-700 border-red-200',
};

const CHANNEL_TAGS: Record<string, string> = {
  'WOO': 'bg-purple-500 text-white',
  'WALMART': 'bg-blue-600 text-white',
  'TIKTOK': 'bg-rose-100 text-rose-600 border border-rose-200',
  'NEWEGG': 'bg-orange-500 text-white',
  'EMAIL PO': 'bg-slate-600 text-white',
  'MANUAL': 'bg-teal-600 text-white',
};

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedPO, setExtractedPO] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate extraction
    setTimeout(() => {
      setExtractedPO({
        buyer: 'RevZilla Motorsports',
        poNumber: 'PO-2024-03-19-01',
        date: new Date().toLocaleDateString(),
        items: [
          { sku: 'AG-XP-10-G2', name: 'Micro-Start XP-10 Gen2', qty: 10, price: 199.99, confidence: 1 },
          { sku: 'AG-ATX20-HD', name: 'ATX20 Heavy Duty', qty: 5, price: 449.99, confidence: 0.95 },
          { sku: 'AG-ATZ7-RS', name: 'ATZ7-RS RE-START', qty: 2, price: 144.99, confidence: 0.8, inactive: true },
        ]
      });
      setIsUploading(false);
    }, 1500);
  };

  const summary = {
    new: orders.filter(o => o.status === 'PENDING').length,
    pending: orders.filter(o => o.status === 'CONFIRMED').length,
    awaiting: orders.filter(o => ['IN QB', 'IN SS'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    attention: orders.filter(o => o.status === 'NEEDS ACTION').length,
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">A</div>
          <h1 className="font-bold text-lg text-white tracking-tight">Antigravity</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="Orders" 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
          />
          <SidebarItem 
            icon={<Truck size={20} />} 
            label="Tracking" 
            active={activeTab === 'tracking'} 
            onClick={() => setActiveTab('tracking')} 
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Invoices" 
            active={activeTab === 'invoices'} 
            onClick={() => setActiveTab('invoices')} 
          />
          <SidebarItem 
            icon={<RefreshCcw size={20} />} 
            label="SKU Manager" 
            active={activeTab === 'sku'} 
            onClick={() => setActiveTab('sku')} 
          />
          <SidebarItem 
            icon={<Undo2 size={20} />} 
            label="Refunds" 
            active={activeTab === 'refunds'} 
            onClick={() => setActiveTab('refunds')} 
          />
        </nav>

        <div className="p-4 mt-auto">
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search SKU, Order, Customer, Tracking..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl text-sm transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Operations Manager</p>
                <p className="text-xs text-slate-500">Antigravity Batteries</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/seed/ops/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Summary Bar */}
              <div className="grid grid-cols-5 gap-4">
                <SummaryTile label="New Today" value={summary.new} icon={<ShoppingCart size={20} />} color="emerald" />
                <SummaryTile label="Pending Review" value={summary.pending} icon={<Clock size={20} />} color="amber" />
                <SummaryTile label="Awaiting Fulfillment" value={summary.awaiting} icon={<Package size={20} />} color="blue" />
                <SummaryTile label="Shipped Today" value={summary.shipped} icon={<Truck size={20} />} color="indigo" />
                <SummaryTile label="Needs Attention" value={summary.attention} icon={<AlertCircle size={20} />} color="red" />
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Order Feed */}
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Channel Order Feed</h2>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                        <Plus size={18} /> Manual Order
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500">
                        <Filter size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading orders...</div>
                      ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No orders found.</div>
                      ) : (
                        orders.slice(0, 10).map(order => (
                          <OrderRow key={order.id} order={order} />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Panels */}
                <div className="space-y-8">
                  {/* PDF Drag & Drop */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Drag & Drop PO</h3>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className={cn(
                        "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all",
                        isUploading ? "border-emerald-500 bg-emerald-50" : "border-slate-200 group-hover:border-emerald-400 group-hover:bg-slate-50"
                      )}>
                        {isUploading ? (
                          <div className="animate-spin text-emerald-500 mb-3">
                            <RefreshCcw size={32} />
                          </div>
                        ) : (
                          <Upload size={32} className="text-slate-300 mb-3 group-hover:text-emerald-500 transition-colors" />
                        )}
                        <p className="text-sm font-bold text-slate-900">{isUploading ? 'Extracting PO Data...' : 'Drop Dealer PO PDF'}</p>
                        <p className="text-xs text-slate-500 mt-1">Auto-extracts SKUs, Qty, and Pricing</p>
                      </div>
                    </div>
                  </section>

                  {/* Alerts */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Alerts & Attention</h3>
                    <div className="space-y-3">
                      <AlertItem 
                        type="error" 
                        title="Inactive SKU Detected" 
                        desc="Order #WOO-12345 contains AG-ATZ7-RS (Inactive)" 
                      />
                      <AlertItem 
                        type="warning" 
                        title="Overdue Shipment" 
                        desc="PO-98765 is 24hrs past ship-by date" 
                      />
                    </div>
                  </section>

                  {/* Channel Breakdown */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Channel Breakdown</h3>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                      <ChannelStat label="WooCommerce" value="$12,450" count={42} color="purple" />
                      <ChannelStat label="Walmart" value="$4,200" count={15} color="blue" />
                      <ChannelStat label="TikTok Shop" value="$8,900" count={31} color="slate" />
                      <ChannelStat label="Newegg" value="$3,150" count={12} color="orange" />
                      <ChannelStat label="Email PO" value="$24,000" count={8} color="slate" />
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && <OrdersView orders={orders} loading={loading} />}
          {activeTab === 'sku' && <SkuManager />}
          {activeTab === 'tracking' && <TrackingView />}
          {activeTab === 'refunds' && <RefundsView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* PO Review Modal */}
      <AnimatePresence>
        {extractedPO && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Review Extracted PO</h2>
                  <p className="text-sm text-slate-500">Extracted from: {extractedPO.buyer}</p>
                </div>
                <button onClick={() => setExtractedPO(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyer</p>
                    <p className="font-bold text-slate-900">{extractedPO.buyer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PO Number</p>
                    <p className="font-bold text-slate-900">{extractedPO.poNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-slate-900">{extractedPO.date}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Line Items</h3>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-600">AG- SKU</th>
                          <th className="px-6 py-4 font-bold text-slate-600">Product Name</th>
                          <th className="px-6 py-4 font-bold text-slate-600">Qty</th>
                          <th className="px-6 py-4 font-bold text-slate-600">Price</th>
                          <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {extractedPO.items.map((item: any, i: number) => (
                          <tr key={i} className={cn(item.inactive && "bg-red-50")}>
                            <td className="px-6 py-4 font-bold text-slate-900">{item.sku}</td>
                            <td className="px-6 py-4 text-slate-600">{item.name}</td>
                            <td className="px-6 py-4 font-medium">{item.qty}</td>
                            <td className="px-6 py-4 font-bold">${item.price}</td>
                            <td className="px-6 py-4">
                              {item.inactive ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase border border-red-200">Inactive SKU</span>
                              ) : (
                                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                                  <ShieldCheck size={14} /> {Math.round(item.confidence * 100)}% Match
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  <p>Total Items: <span className="font-bold text-slate-900">17</span></p>
                  <p>Total Value: <span className="font-bold text-slate-900">$4,539.88</span></p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setExtractedPO(null)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all">
                    Discard
                  </button>
                  <button className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2">
                    Confirm & Push to QB/SS <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrdersView({ orders, loading }: { orders: Order[], loading: boolean }) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [filterChannel, setFilterChannel] = useState<string | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesChannel = filterChannel === 'ALL' || order.channel === filterChannel;
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(item => item.sku.toLowerCase().includes(search.toLowerCase()));
    
    return matchesStatus && matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h2>
          <p className="text-sm text-slate-500">View and manage all incoming channel orders</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <Download size={18} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
            <Plus size={18} /> Manual Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID, Customer, or SKU..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN QB">In QuickBooks</option>
            <option value="IN SHIPSTATION">In ShipStation</option>
            <option value="SHIPPED">Shipped</option>
            <option value="NEEDS ACTION">Needs Action</option>
          </select>

          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500"
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
          >
            <option value="ALL">All Channels</option>
            <option value="WOO">WooCommerce</option>
            <option value="WALMART">Walmart</option>
            <option value="TIKTOK">TikTok Shop</option>
            <option value="NEWEGG">Newegg</option>
            <option value="EMAIL PO">Email PO</option>
          </select>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No orders match your filters.</div>
          ) : (
            filteredOrders.map(order => (
              <OrderRow key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TrackingView() {
  const shipments = [
    { id: '1Z999AA10123456784', orderId: 'WOO-12345', customer: 'John Smith', carrier: 'UPS', status: 'IN TRANSIT', lastScan: 'Los Angeles, CA', delivery: 'Mar 21, 2026' },
    { id: '401234567890', orderId: 'PO-98765', customer: 'RevZilla Motorsports', carrier: 'FedEx', status: 'OUT FOR DELIVERY', lastScan: 'Van Nuys, CA', delivery: 'Today' },
    { id: '9400100000000000000000', orderId: 'WMT-55210', customer: 'Sarah Jenkins', carrier: 'USPS', status: 'DELIVERED', lastScan: 'Austin, TX', delivery: 'Mar 18, 2026' },
    { id: '1Z999AA10123456785', orderId: 'WOO-12346', customer: 'David Miller', carrier: 'UPS', status: 'EXCEPTION', lastScan: 'Memphis, TN', delivery: 'Delayed' },
    { id: '1Z999AA10123456786', orderId: 'NEG-77812', customer: 'Tech Solutions Inc', carrier: 'UPS', status: 'IN TRANSIT', lastScan: 'Gardena, CA', delivery: 'Mar 20, 2026' },
    { id: '401234567891', orderId: 'TT-99012', customer: 'Mike Ross', carrier: 'FedEx', status: 'IN TRANSIT', lastScan: 'Indianapolis, IN', delivery: 'Mar 22, 2026' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shipment Tracking</h2>
          <p className="text-sm text-slate-500">Live carrier status for all recent shipments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {shipments.map((ship, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-emerald-500 transition-all">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                ship.carrier === 'UPS' ? 'bg-amber-800' : ship.carrier === 'FedEx' ? 'bg-purple-800' : 'bg-blue-600'
              )}>
                {ship.carrier[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{ship.id}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{ship.carrier} • {ship.lastScan}</p>
                <p className="text-[10px] text-slate-400 mt-1">Order: <span className="font-bold text-slate-600">{ship.orderId}</span> • Customer: <span className="font-bold text-slate-600">{ship.customer}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border",
                  ship.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  ship.status === 'EXCEPTION' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-blue-100 text-blue-700 border-blue-200'
                )}>
                  {ship.status}
                </span>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Est. Delivery</p>
                <p className="text-sm font-bold text-slate-900">{ship.delivery}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefundsView() {
  const refunds = [
    { id: 'REF-1001', orderId: 'WOO-12345', customer: 'John Smith', amount: 149.99, reason: 'Defective Unit', status: 'PENDING' },
    { id: 'REF-1002', orderId: 'TT-99012', customer: 'Mike Ross', amount: 399.98, reason: 'Changed Mind', status: 'APPROVED' },
    { id: 'REF-1003', orderId: 'WMT-55210', customer: 'Sarah Jenkins', amount: 224.99, reason: 'Shipping Damage', status: 'PROCESSING' },
    { id: 'REF-1004', orderId: 'WOO-12340', customer: 'Alice Wong', amount: 119.99, reason: 'Wrong Item Received', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Refunds & Cancellations</h2>
          <p className="text-sm text-slate-500">Manage returns and order reversals</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Refund ID</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Order / Customer</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Amount</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Reason</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{ref.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ref.orderId}</p>
                      <p className="text-xs text-slate-500">{ref.customer}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">${ref.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">{ref.reason}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase border",
                        ref.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        ref.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Refund Workflow</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
              
              <WorkflowStep active icon={<FileText size={14} />} label="Request Received" desc="Customer initiated refund" />
              <WorkflowStep active icon={<ShieldCheck size={14} />} label="Validation" desc="Verifying return tracking" />
              <WorkflowStep icon={<RefreshCcw size={14} />} label="Processing" desc="Reversing payment in Stripe/Paypal" />
              <WorkflowStep icon={<CheckCircle2 size={14} />} label="Completed" desc="Inventory updated & closed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({ active, icon, label, desc }: { active?: boolean, icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="relative flex gap-4 pl-1">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2",
        active ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-300"
      )}>
        {icon}
      </div>
      <div>
        <p className={cn("text-sm font-bold", active ? "text-slate-900" : "text-slate-400")}>{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function InvoicesView() {
  const [search, setSearch] = useState('');
  const invoices = [
    { id: 'INV-2026-001', customer: 'Amazon.com', amount: 12450.00, status: 'PAID', date: '2026-03-15' },
    { id: 'INV-2026-002', customer: 'Walmart', amount: 8900.50, status: 'PENDING', date: '2026-03-17' },
    { id: 'INV-2026-003', customer: 'Target', amount: 5600.00, status: 'OVERDUE', date: '2026-03-10' },
    { id: 'INV-2026-004', customer: 'RevZilla', amount: 24500.00, status: 'PENDING', date: '2026-03-18' },
    { id: 'INV-2026-005', customer: 'Cycle Gear', amount: 15200.00, status: 'PAID', date: '2026-03-12' },
    { id: 'INV-2026-006', customer: 'Parts Unlimited', amount: 42000.00, status: 'PENDING', date: '2026-03-19' },
  ];

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (id: string) => {
    alert(`Downloading invoice ${id}... (Simulated)`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">QuickBooks Invoices</h2>
          <p className="text-sm text-slate-500">Manage and track your accounts receivable</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search invoices by ID or Customer..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">Invoice ID</th>
              <th className="px-6 py-4 font-bold text-slate-600">Customer</th>
              <th className="px-6 py-4 font-bold text-slate-600">Amount</th>
              <th className="px-6 py-4 font-bold text-slate-600">Date</th>
              <th className="px-6 py-4 font-bold text-slate-600">Status</th>
              <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{inv.id}</td>
                <td className="px-6 py-4 text-slate-600">{inv.customer}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase border",
                    inv.status === 'PAID' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    inv.status === 'OVERDUE' ? "bg-red-50 text-red-700 border-red-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  )}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => alert(`Sending invoice ${inv.id}...`)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
                    >
                      Send
                    </button>
                    <button 
                      onClick={() => alert(`Resending invoice ${inv.id}...`)}
                      className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all"
                    >
                      Resend
                    </button>
                    <button 
                      onClick={() => handleDownload(inv.id)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-900"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkuManager() {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCT_CATALOG);

  useEffect(() => {
    if (!search) {
      setFilteredProducts(PRODUCT_CATALOG);
      return;
    }
    const fuse = new Fuse(PRODUCT_CATALOG, {
      keys: ['sku', 'name', 'upc'],
      threshold: 0.3
    });
    setFilteredProducts(fuse.search(search).map(r => r.item));
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">SKU Mapping Engine</h2>
          <p className="text-sm text-slate-500">Master AG- SKU Catalog & Channel Aliases</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Plus size={18} /> Add New SKU
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by AG- SKU, Name, or UPC..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">Master AG- SKU</th>
              <th className="px-6 py-4 font-bold text-slate-600">Product Name</th>
              <th className="px-6 py-4 font-bold text-slate-600">QB Code</th>
              <th className="px-6 py-4 font-bold text-slate-600">SS SKU</th>
              <th className="px-6 py-4 font-bold text-slate-600">Woo ID</th>
              <th className="px-6 py-4 font-bold text-slate-600">MSRP/MAP</th>
              <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((p) => (
              <tr key={p.sku} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{p.sku}</td>
                <td className="px-6 py-4 text-slate-600">{p.name}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{p.qbItemCode || '-'}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{p.ssSku || '-'}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{p.wooId || '-'}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${p.price}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-900">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-sm text-slate-500">Configure your dashboard and integrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">API Integrations</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold">W</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">WooCommerce</p>
                  <p className="text-xs text-slate-500">Connected to antigravitybatteries.com</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">Q</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">QuickBooks Online</p>
                  <p className="text-xs text-slate-500">Syncing invoices and payments</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold">S</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">ShipStation</p>
                  <p className="text-xs text-slate-500">Pushing orders for fulfillment</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">User Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts for overdue shipments</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Auto-Sync Inventory</p>
                <p className="text-xs text-slate-500">Sync SKU stock levels every hour</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
        active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SummaryTile({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    red: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const isOverdue = new Date(order.shipBy) < new Date();

  return (
    <div className="group hover:bg-slate-50 transition-all cursor-pointer">
      <div className="p-4 flex items-center gap-6">
        <div className={cn("w-1.5 h-12 rounded-full", order.status === 'NEEDS ACTION' ? 'bg-red-500' : 'bg-slate-200 group-hover:bg-emerald-500')} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", CHANNEL_TAGS[order.channel])}>
              {order.channel}
            </span>
            <span className="font-bold text-slate-900">{order.id}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium truncate">{order.customer}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Package size={14} /> {order.items.length} items</span>
            <span className="font-semibold text-slate-900">${order.total.toLocaleString()}</span>
            <span className={cn("flex items-center gap-1", isOverdue && "text-red-500 font-bold")}>
              <Clock size={14} /> Ship by: {new Date(order.shipBy).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", STATUS_COLORS[order.status])}>
            {order.status}
          </div>
          <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
      
      {/* Quick Preview of items */}
      <div className="px-12 pb-4 block">
        <div className="bg-white rounded-xl border border-slate-100 p-3 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-slate-600"><span className="font-bold text-slate-900">{item.sku}</span> {item.name}</span>
              <span className="text-slate-400">qty: {item.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertItem({ type, title, desc }: { type: 'error' | 'warning' | 'info', title: string, desc: string }) {
  const styles = {
    error: "bg-red-50 border-red-100 text-red-800",
    warning: "bg-amber-50 border-amber-100 text-amber-800",
    info: "bg-blue-50 border-blue-100 text-blue-800",
  };

  return (
    <div className={cn("p-4 rounded-xl border flex gap-3", styles[type])}>
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
    </div>
  );
}

function ChannelStat({ label, value, count, color }: { label: string, value: string, count: number, color: string }) {
  const colors: Record<string, string> = {
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    slate: "bg-slate-700",
    orange: "bg-orange-500",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", colors[color])} />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">{value}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold">{count} orders</p>
      </div>
    </div>
  );
}
