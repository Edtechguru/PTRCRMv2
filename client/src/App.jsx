import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "./supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const CHANNEL_COLORS = {
  "TikTok": "#ff4d6d",
  "Trade Show": "#f4a261",
  "Shopify": "#52b788",
  "Instagram": "#c77dff",
  "Home Store": "#4cc9f0",
  "Discord": "#5865F2",
};

const TAG_COLORS = {
  "SPS Coral": "#ef476f",
  "LPS Coral": "#ffd166",
  "Soft Coral": "#06d6a0",
  "LED Lights": "#4cc9f0",
  "Nano Tank": "#a2d2ff",
  "VIP": "#f72585",
  "New Customer": "#52b788",
  "Beginner": "#b5e48c",
  "High-End Lights": "#7b2d8b",
};

const styles = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050e1a; font-family: 'DM Sans', sans-serif; color: #e0f0ff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a1628; }
  ::-webkit-scrollbar-thumb { background: #1a3a5c; border-radius: 3px; }

  .app { display: flex; min-height: 100vh; background: #050e1a; }

  /* Sidebar */
  .sidebar { width: 220px; min-height: 100vh; background: #07121f; border-right: 1px solid #0e2340; display: flex; flex-direction: column; padding: 0; position: fixed; top: 0; left: 0; z-index: 100; }
  .sidebar-logo { padding: 18px 16px 16px; border-bottom: 1px solid #0e2340; }
  .logo-mark { display: flex; align-items: center; justify-content: center; }
  .sidebar-nav { padding: 16px 12px; flex: 1; }
  .nav-label { font-size: 10px; color: #2a5278; letter-spacing: 2px; text-transform: uppercase; padding: 0 8px; margin-bottom: 8px; margin-top: 16px; font-weight: 600; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; color: #4a7fa5; font-size: 13.5px; font-weight: 400; transition: all 0.15s; margin-bottom: 2px; }
  .nav-item:hover { background: #0e2340; color: #90caf9; }
  .nav-item.active { background: linear-gradient(135deg, #0e2f52, #0a2340); color: #4fc3f7; font-weight: 500; border: 1px solid #1a3a5c; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 20px; border-top: 1px solid #0e2340; }
  .sidebar-user { display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 30px; height: 30px; background: linear-gradient(135deg, #0077b6, #00b4d8); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; }
  .user-name { font-size: 12px; color: #a0c4e0; font-weight: 500; }
  .user-role { font-size: 10px; color: #2a5278; }

  /* Main */
  .main { margin-left: 220px; flex: 1; min-height: 100vh; }
  .topbar { height: 60px; background: #07121f; border-bottom: 1px solid #0e2340; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #e0f0ff; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.15s; }
  .btn-primary { background: linear-gradient(135deg, #0077b6, #00b4d8); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: #4a7fa5; border: 1px solid #1a3a5c; }
  .btn-ghost:hover { background: #0e2340; color: #90caf9; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .content { padding: 28px; }

  /* Cards */
  .card { background: #07121f; border: 1px solid #0e2340; border-radius: 12px; padding: 20px; }
  .card-glow { box-shadow: 0 0 20px rgba(0,180,216,0.05); }

  /* Dashboard */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #07121f; border: 1px solid #0e2340; border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.blue::before { background: linear-gradient(90deg, #0077b6, #00b4d8); }
  .stat-card.teal::before { background: linear-gradient(90deg, #00b4d8, #48cae4); }
  .stat-card.green::before { background: linear-gradient(90deg, #06d6a0, #52b788); }
  .stat-card.purple::before { background: linear-gradient(90deg, #7b2d8b, #c77dff); }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #e0f0ff; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: #4a7fa5; text-transform: uppercase; letter-spacing: 1px; }
  .stat-delta { font-size: 11px; color: #06d6a0; margin-top: 6px; }
  .stat-icon { position: absolute; top: 16px; right: 16px; font-size: 22px; opacity: 0.3; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .grid-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #90caf9; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }

  /* Channel breakdown */
  .channel-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .channel-name { font-size: 13px; color: #a0c4e0; width: 90px; }
  .bar-track { flex: 1; height: 6px; background: #0e2340; border-radius: 3px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
  .channel-val { font-size: 12px; color: #4a7fa5; width: 40px; text-align: right; }

  /* Recent activity */
  .activity-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #0a1e30; }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .activity-text { font-size: 13px; color: #a0c4e0; flex: 1; }
  .activity-time { font-size: 11px; color: #2a5278; }

  /* Customer list */
  .search-bar { width: 100%; padding: 10px 14px; background: #0a1628; border: 1px solid #1a3a5c; border-radius: 8px; color: #e0f0ff; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; margin-bottom: 16px; }
  .search-bar::placeholder { color: #2a5278; }
  .search-bar:focus { border-color: #0077b6; }
  .filter-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-chip { padding: 5px 12px; border-radius: 20px; border: 1px solid #1a3a5c; background: transparent; color: #4a7fa5; font-size: 12px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .filter-chip:hover, .filter-chip.active { background: #0e2340; color: #4fc3f7; border-color: #0077b6; }

  .customer-table { width: 100%; border-collapse: collapse; }
  .customer-table th { text-align: left; padding: 10px 12px; font-size: 11px; color: #2a5278; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #0e2340; }
  .customer-table td { padding: 12px; border-bottom: 1px solid #0a1e30; font-size: 13px; color: #a0c4e0; }
  .customer-table tr:hover td { background: #0a1628; cursor: pointer; }
  .customer-name { color: #e0f0ff; font-weight: 500; }
  .channel-badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
  .tag { padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 4px; display: inline-block; margin-bottom: 2px; }
  .spent-value { color: #4fc3f7; font-weight: 600; font-family: 'Syne', sans-serif; }

  /* Customer detail modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(5,14,26,0.85); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: #07121f; border: 1px solid #1a3a5c; border-radius: 16px; width: 640px; max-height: 85vh; overflow-y: auto; padding: 28px; }
  .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .modal-close { background: #0e2340; border: none; color: #4a7fa5; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; font-size: 16px; }
  .profile-header { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
  .profile-avatar { width: 56px; height: 56px; border-radius: 12px; background: linear-gradient(135deg, #0077b6, #00b4d8); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: white; }
  .profile-info h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #e0f0ff; }
  .profile-meta { font-size: 12px; color: #4a7fa5; margin-top: 4px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .detail-item label { font-size: 10px; color: #2a5278; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px; }
  .detail-item span { font-size: 13px; color: #a0c4e0; }
  .notes-box { background: #0a1628; border: 1px solid #1a3a5c; border-radius: 8px; padding: 12px; font-size: 13px; color: #90caf9; font-style: italic; line-height: 1.6; margin-bottom: 20px; }
  .purchase-history h4 { font-size: 12px; color: #2a5278; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
  .purchase-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #0a1e30; }
  .purchase-product { font-size: 13px; color: #a0c4e0; }
  .purchase-amount { font-size: 13px; color: #4fc3f7; font-weight: 600; }

  /* Add customer form */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { margin-bottom: 16px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-group label { display: block; font-size: 11px; color: #4a7fa5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .form-input { width: 100%; padding: 10px 12px; background: #0a1628; border: 1px solid #1a3a5c; border-radius: 8px; color: #e0f0ff; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; }
  .form-input:focus { border-color: #0077b6; }
  .form-input::placeholder { color: #2a5278; }
  select.form-input option { background: #0a1628; }
  .tag-select { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-toggle { padding: 5px 12px; border-radius: 20px; border: 1px solid #1a3a5c; background: transparent; color: #4a7fa5; font-size: 12px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .tag-toggle.selected { background: #0e2340; color: #4fc3f7; border-color: #0077b6; }
  .qr-promo { background: linear-gradient(135deg, #0a1f38, #071628); border: 1px solid #1a3a5c; border-radius: 12px; padding: 20px; text-align: center; }
  .qr-box { width: 100px; height: 100px; background: #0e2340; border: 2px dashed #1a3a5c; border-radius: 8px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 36px; }
  .qr-text { font-size: 12px; color: #4a7fa5; line-height: 1.6; }

  /* Campaigns */
  .campaign-card { background: #07121f; border: 1px solid #0e2340; border-radius: 12px; padding: 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 20px; }
  .campaign-info { flex: 1; }
  .campaign-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #e0f0ff; margin-bottom: 4px; }
  .campaign-seg { font-size: 12px; color: #4a7fa5; }
  .campaign-stats { display: flex; gap: 24px; }
  .camp-stat { text-align: center; }
  .camp-stat-val { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #4fc3f7; }
  .camp-stat-label { font-size: 11px; color: #2a5278; text-transform: uppercase; }
  .status-badge { padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .status-active { background: rgba(6,214,160,0.15); color: #06d6a0; }
  .status-draft { background: rgba(74,127,165,0.15); color: #4a7fa5; }
  .status-sent { background: rgba(76,201,240,0.15); color: #4cc9f0; }

  /* Sales */
  .sales-table { width: 100%; border-collapse: collapse; }
  .sales-table th { text-align: left; padding: 10px 12px; font-size: 11px; color: #2a5278; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #0e2340; }
  .sales-table td { padding: 12px; border-bottom: 1px solid #0a1e30; font-size: 13px; color: #a0c4e0; }
  .amount-cell { color: #4fc3f7; font-weight: 600; font-family: 'Syne', sans-serif; }

  /* Promotions */
  .promo-card { background: linear-gradient(135deg, #0a1f38, #071220); border: 1px solid #1a3a5c; border-radius: 12px; padding: 24px; margin-bottom: 12px; position: relative; overflow: hidden; }
  .promo-card::after { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, rgba(0,180,216,0.1), transparent); }
  .promo-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #e0f0ff; margin-bottom: 6px; }
  .promo-desc { font-size: 13px; color: #4a7fa5; margin-bottom: 12px; }
  .promo-meta { display: flex; gap: 16px; }
  .promo-meta span { font-size: 12px; color: #2a5278; }
  .promo-meta strong { color: #4fc3f7; }

  /* Empty state */
  .empty { text-align: center; padding: 48px; color: #2a5278; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* Success toast */
  .toast { position: fixed; bottom: 24px; right: 24px; background: #06d6a0; color: #050e1a; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; z-index: 300; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Charts */
  .custom-tooltip { background: #0a1628; border: 1px solid #1a3a5c; border-radius: 8px; padding: 12px; color: #e0f0ff; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
  .custom-tooltip .label { font-size: 12px; color: #4a7fa5; margin-bottom: 4px; font-family: 'DM Sans', sans-serif; }
  .custom-tooltip .value { font-size: 16px; font-weight: 700; color: #4fc3f7; font-family: 'Syne', sans-serif; }
  .chart-container { height: 300px; width: 100%; margin-top: 16px; }
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AquaCRM() {
  const [tab, setTab] = useState("dashboard");
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", channel: "Trade Show", tankSize: "", location: "", notes: "", tags: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", category: "SPS Coral", price: "", cost: "", stock_qty: "", description: "", image_url: "", shopify_url: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [newSale, setNewSale] = useState({ customer_id: "", product_id: "", channel: "Shopify", amount: "", date: new Date().toISOString().split('T')[0] });
  const [editingSale, setEditingSale] = useState(null);
  const [deleteSaleId, setDeleteSaleId] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignFormData, setCampaignFormData] = useState({ name: "", status: "Draft", segment: "", date: new Date().toISOString().split('T')[0] });
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoFormData, setPromoFormData] = useState({ title: "", description: "", code: "", channel: "Shopify", start_date: "Ongoing", end_date: "Ongoing" });
  const [showPromoDeleteConfirm, setShowPromoDeleteConfirm] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Step 2 & 3: Fetch real customers and inventory from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [custRes, invRes, salesRes, campRes, promoRes] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*').order('date', { ascending: false }),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('promotions').select('*').order('created_at', { ascending: false }),
      ]);
      
      // Handle Customers
      if (custRes.data) {
        setCustomers(custRes.data.map(c => ({ 
          ...c, 
          totalSpent: Number(c.total_spent), 
          tankSize: c.tank_size, 
          lastContact: c.last_contact 
        })));
      }
      if (custRes.error) console.error("Error fetching customers:", custRes.error);

      // Handle Inventory
      if (invRes.data) {
        setInventory(invRes.data.map(i => ({ 
          ...i, 
          price: Number(i.price), 
          cost: Number(i.cost) 
        })));
      }
      if (invRes.error) console.error("Error fetching inventory:", invRes.error);

      // Handle Sales
      if (salesRes.data) {
        setSales(salesRes.data.map(s => ({ 
          ...s, 
          customer: s.customer_name, 
          amount: Number(s.amount) 
        })));
      }
      if (salesRes.error) console.error("Error fetching sales:", salesRes.error);

      // Handle Campaigns
      if (campRes.data) {
        setCampaigns(campRes.data);
      }
      if (campRes.error) console.error("Error fetching campaigns:", campRes.error);

      // Handle Promotions
      if (promoRes.data) {
        setPromotions(promoRes.data.map(p => ({ 
          ...p, 
          desc: p.description, 
          start: p.start_date, 
          end: p.end_date 
        })));
      }
      if (promoRes.error) console.error("Error fetching promotions:", promoRes.error);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleEditClick = () => {
    setEditFormData({
      name: selectedCustomer.name || "",
      email: selectedCustomer.email || "",
      phone: selectedCustomer.phone || "",
      location: selectedCustomer.location || "",
      channel: selectedCustomer.channel || "Trade Show",
      tankSize: selectedCustomer.tankSize || "",
      notes: selectedCustomer.notes || ""
    });
    setIsEditing(true);
  };

  const handleCustomerSave = async () => {
    const { error } = await supabase
      .from('customers')
      .update({
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        location: editFormData.location,
        channel: editFormData.channel,
        tank_size: editFormData.tankSize,
        notes: editFormData.notes
      })
      .eq('id', selectedCustomer.id);

    if (error) {
      console.error("Update error:", error);
      showToast("Save failed — please try again");
      return; // Keep user in edit mode
    }

    const updatedCustomer = { 
      ...selectedCustomer, 
      ...editFormData 
    };
    setCustomers(customers.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setIsEditing(false);
    showToast("Customer profile updated!");
  };

  const handleCustomerDelete = async () => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', selectedCustomer.id);

    if (error) {
      console.error("Delete error:", error);
      showToast("Delete failed — please try again");
      return; // Keep modal open
    }

    setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
    showToast("Customer deleted");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCustomers = customers.filter(c => {
    const name = c.name || "";
    const email = c.email || "";
    const channel = c.channel || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === "All" || channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);
  const channels = ["TikTok", "Trade Show", "Shopify", "Instagram", "Home Store", "Discord"];
  const channelCounts = channels.map(ch => ({ name: ch, count: customers.filter(c => c.channel === ch).length }));
  const maxCount = Math.max(...channelCounts.map(c => c.count));

  // Data aggregations for charts
  const revenueByDateMap = sales.reduce((acc, sale) => {
    acc[sale.date] = (acc[sale.date] || 0) + sale.amount;
    return acc;
  }, {});
  // Sort dates to ensure line chart flows left to right
  const revenueData = Object.keys(revenueByDateMap).sort().map(date => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: revenueByDateMap[date]
  }));

  const categoryCountsMap = sales.reduce((acc, sale) => {
    acc[sale.category] = (acc[sale.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.keys(categoryCountsMap).map(key => ({
    name: key,
    value: categoryCountsMap[key],
    color: TAG_COLORS[key] || "#4a7fa5"
  }));

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) return;
    const { data, error } = await supabase.from('customers').insert([{
      name: newCustomer.name, email: newCustomer.email, phone: newCustomer.phone,
      channel: newCustomer.channel, tank_size: newCustomer.tankSize, location: newCustomer.location,
      notes: newCustomer.notes, tags: JSON.stringify(newCustomer.tags),
    }]).select();
    if (error) { showToast("✗ Error: " + error.message); return; }
    if (data) setCustomers([{ ...data[0], totalSpent: 0, tankSize: data[0].tank_size, lastContact: data[0].last_contact, tags: newCustomer.tags }, ...customers]);
    setNewCustomer({ name: "", email: "", phone: "", channel: "Trade Show", tankSize: "", location: "", notes: "", tags: [] });
    showToast("✓ Customer added successfully");
    setTab("customers");
  };

  const handleAddProduct = async () => {
    if (!newProduct.name) return;
    const { data, error } = await supabase.from('inventory').insert([{
      name: newProduct.name, sku: newProduct.sku || null, category: newProduct.category,
      price: Number(newProduct.price) || 0, cost: Number(newProduct.cost) || 0,
      stock_qty: Number(newProduct.stock_qty) || 0, description: newProduct.description,
      image_url: newProduct.image_url
    }]).select();
    if (error) { showToast("✗ Error: " + error.message); return; }
    if (data) setInventory([{ ...data[0], price: Number(data[0].price), cost: Number(data[0].cost), shopify_url: newProduct.shopify_url }, ...inventory]);
    setNewProduct({ name: "", sku: "", category: "SPS Coral", price: "", cost: "", stock_qty: "", description: "", image_url: "", shopify_url: "" });
    showToast("✓ Product added to inventory");
  };

  const handleInventorySave = async () => {
    const { error } = await supabase
      .from('inventory')
      .update({
        name: editingProduct.name,
        category: editingProduct.category,
        description: editingProduct.description,
        price: Number(editingProduct.price) || 0,
        cost: Number(editingProduct.cost) || 0,
        stock_qty: Number(editingProduct.stock_qty) || 0,
        image_url: editingProduct.image_url
      })
      .eq('id', editingProduct.id);

    if (error) {
      console.error("Update error:", error);
      showToast("Save failed — please try again");
      return; 
    }

    setInventory(inventory.map(item => item.id === editingProduct.id ? { 
      ...item, 
      ...editingProduct, 
      price: Number(editingProduct.price) || 0, 
      cost: Number(editingProduct.cost) || 0, 
      stock_qty: Number(editingProduct.stock_qty) || 0 
    } : item));
    setEditingProduct(null);
    showToast("Product updated successfully!");
  };

  const handleInventoryDelete = async () => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', deleteProductId);

    if (error) {
      console.error("Delete error:", error);
      showToast("Delete failed — please try again");
      return;
    }

    setInventory(inventory.filter(item => item.id !== deleteProductId));
    setDeleteProductId(null);
    if (editingProduct && editingProduct.id === deleteProductId) setEditingProduct(null);
    showToast("Product deleted");
  };

  const handleAddSale = async () => {
    if (!newSale.customer_id || !newSale.product_id || !newSale.amount) return;
    
    const customer = customers.find(c => c.id.toString() === newSale.customer_id.toString());
    const product = inventory.find(p => p.id.toString() === newSale.product_id.toString());
    
    const { data: insertedSale, error } = await supabase.from('sales').insert([{
      customer_id: customer.id,
      customer_name: customer.name,
      product_id: product.id,
      product: product.name,
      category: product.category,
      channel: newSale.channel,
      amount: Number(newSale.amount),
      date: newSale.date
    }]).select();

    if (error) { showToast("✗ Error: " + error.message); return; }

    const newSalesList = [{ ...insertedSale[0], customer: insertedSale[0].customer_name, amount: Number(insertedSale[0].amount) }, ...sales];
    newSalesList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setSales(newSalesList);
    
    const { error: custError } = await supabase
      .from('customers')
      .update({ 
        total_spent: customer.totalSpent + Number(newSale.amount),
        orders: customer.orders + 1
      })
      .eq('id', customer.id);
      
    if (custError) {
      console.error("Customer update error:", custError);
    } else {
      setCustomers(customers.map(c => c.id === customer.id ? { 
        ...c, 
        totalSpent: c.totalSpent + Number(newSale.amount),
        orders: c.orders + 1
      } : c));
    }

    setNewSale({ customer_id: "", product_id: "", channel: "Shopify", amount: "", date: new Date().toISOString().split('T')[0] });
    showToast("✓ Sale logged successfully");
  };

  const handleSaleSave = async () => {
    const cust = customers.find(c => c.id.toString() === editingSale.customer_id?.toString()) || { id: editingSale.customer_id, name: editingSale.customer };
    const prod = inventory.find(p => p.id.toString() === editingSale.product_id?.toString()) || { id: editingSale.product_id, name: editingSale.product, category: editingSale.category };
    
    const { error } = await supabase
      .from('sales')
      .update({
        customer_id: cust.id,
        customer_name: cust.name,
        product_id: prod.id,
        product: prod.name,
        category: prod.category,
        channel: editingSale.channel,
        amount: Number(editingSale.amount),
        date: editingSale.date
      })
      .eq('id', editingSale.id);

    if (error) {
      console.error("Update error:", error);
      showToast("Save failed — please try again");
      return; 
    }

    setSales(sales.map(item => item.id === editingSale.id ? { 
      ...item,
      customer_id: cust.id,
      customer: cust.name,
      product_id: prod.id,
      product: prod.name,
      category: prod.category,
      channel: editingSale.channel,
      amount: Number(editingSale.amount),
      date: editingSale.date
    } : item));
    setEditingSale(null);
    showToast("Sale updated successfully!");
  };

  const handleSaleDelete = async () => {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', deleteSaleId);

    if (error) {
      console.error("Delete error:", error);
      showToast("Delete failed — please try again");
      return;
    }

    setSales(sales.filter(item => item.id !== deleteSaleId));
    setDeleteSaleId(null);
    if (editingSale && editingSale.id === deleteSaleId) setEditingSale(null);
    showToast("Sale deleted");
  };

  const handleCampaignSave = async () => {
    if (!campaignFormData.name) {
      showToast("Campaign Name is required");
      return;
    }

    const payload = {
      name: campaignFormData.name,
      status: campaignFormData.status,
      segment: campaignFormData.segment,
      date: campaignFormData.date
    };

    if (editingCampaign) {
      // UPDATE
      const { error } = await supabase
        .from('campaigns')
        .update(payload)
        .eq('id', editingCampaign.id);

      if (error) {
        console.error("Update error:", error);
        showToast("Save failed — please try again");
        return;
      }

      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...payload } : c));
      showToast("Campaign updated successfully!");
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...payload, sent: 0, opened: 0, clicked: 0 }])
        .select();

      if (error) {
        console.error("Insert error:", error);
        showToast("Save failed — please try again");
        return;
      }

      setCampaigns([data[0], ...campaigns]);
      showToast("Campaign created successfully!");
    }

    setShowCampaignModal(false);
    setEditingCampaign(null);
  };

  const openCampaignModal = (camp = null) => {
    if (camp) {
      setEditingCampaign(camp);
      setCampaignFormData({
        name: camp.name,
        status: camp.status,
        segment: camp.segment,
        date: camp.date
      });
    } else {
      setEditingCampaign(null);
      setCampaignFormData({
        name: "",
        status: "Draft",
        segment: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowCampaignModal(true);
  };

  const handlePromoSave = async () => {
    if (!promoFormData.title) {
      showToast("Promotion Title is required");
      return;
    }

    const payload = {
      title: promoFormData.title,
      description: promoFormData.description,
      code: promoFormData.code,
      channel: promoFormData.channel,
      start_date: promoFormData.start_date,
      end_date: promoFormData.end_date
    };

    if (editingPromo) {
      // UPDATE
      const { error } = await supabase
        .from('promotions')
        .update(payload)
        .eq('id', editingPromo.id);

      if (error) {
        console.error("Update error:", error);
        showToast("Save failed — please try again");
        return;
      }

      setPromotions(promotions.map(p => p.id === editingPromo.id ? { 
        ...p, 
        ...payload,
        desc: payload.description,
        start: payload.start_date,
        end: payload.end_date
      } : p));
      showToast("Promotion updated successfully!");
    } else {
      // INSERT
      const { data, error } = await supabase
        .from('promotions')
        .insert([payload])
        .select();

      if (error) {
        console.error("Insert error:", error);
        showToast("Save failed — please try again");
        return;
      }

      const inserted = {
        ...data[0],
        desc: data[0].description,
        start: data[0].start_date,
        end: data[0].end_date
      };
      setPromotions([inserted, ...promotions]);
      showToast("Promotion created successfully!");
    }

    setShowPromoModal(false);
    setEditingPromo(null);
  };

  const handlePromoDelete = async () => {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', editingPromo.id);

    if (error) {
      console.error("Delete error:", error);
      showToast("Delete failed — please try again");
      return;
    }

    setPromotions(promotions.filter(p => p.id !== editingPromo.id));
    setShowPromoDeleteConfirm(false);
    setShowPromoModal(false);
    setEditingPromo(null);
    showToast("Promotion deleted");
  };

  const openPromoModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setPromoFormData({
        title: promo.title,
        description: promo.desc || promo.description,
        code: promo.code,
        channel: promo.channel,
        start_date: promo.start || promo.start_date,
        end_date: promo.end || promo.end_date
      });
    } else {
      setEditingPromo(null);
      setPromoFormData({
        title: "",
        description: "",
        code: "",
        channel: "Shopify",
        start_date: "Ongoing",
        end_date: "Ongoing"
      });
    }
    setShowPromoModal(true);
  };

  const toggleTag = (tag) => {
    setNewCustomer(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "customers", icon: "◉", label: "Customers" },
    { id: "inventory", icon: "◫", label: "Inventory" },
    { id: "sales", icon: "◎", label: "Sales Log" },
    { id: "campaigns", icon: "◈", label: "Campaigns" },
    { id: "promotions", icon: "◇", label: "Promotions" },
    { id: "add", icon: "⊕", label: "Add Customer" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <img
                src="https://pootangreefs.com/cdn/shop/files/Poo_Tang_Reefs_No_Background_677c1053-60d2-47e9-b607-89c81304ee3a.png?v=1762300889"
                alt="Poo Tang Reefs"
                style={{ width: "100%", maxWidth: 160, objectFit: "contain", filter: "brightness(1.1)" }}
              />
            </div>
          </div>
          <div className="sidebar-nav">
            <div className="nav-label">Main</div>
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">PT</div>
              <div>
                <div className="user-name">Poo Tang Reefs</div>
                <div className="user-role">Admin</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">
              {tab === "dashboard" && "Dashboard"}
              {tab === "customers" && "Customers"}
              {tab === "inventory" && "Inventory"}
              {tab === "sales" && "Sales Log"}
              {tab === "campaigns" && "Email Campaigns"}
              {tab === "promotions" && "Promotions"}
              {tab === "add" && "Add Customer"}
            </div>
            <div className="topbar-right">
              <button className="btn btn-ghost btn-sm" onClick={() => setTab("add")}>+ Add Customer</button>
              <button className="btn btn-primary btn-sm" onClick={() => setTab("campaigns")}>New Campaign</button>
            </div>
          </div>

          <div className="content">
            {isLoading ? (
              <div className="empty" style={{ marginTop: "100px" }}>
                <div className="empty-icon">⏳</div>
                <div style={{ fontSize: 16, fontFamily: "Syne, sans-serif" }}>Loading Data...</div>
              </div>
            ) : (
              <>

            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <>
                <div className="stats-grid">
                  <div className="stat-card blue">
                    <span className="stat-icon">👥</span>
                    <div className="stat-value">{customers.length}</div>
                    <div className="stat-label">Total Customers</div>
                    <div className="stat-delta">↑ +3 this month</div>
                  </div>
                  <div className="stat-card teal">
                    <span className="stat-icon">💰</span>
                    <div className="stat-value">${totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-delta">↑ +12% vs last month</div>
                  </div>
                  <div className="stat-card green">
                    <span className="stat-icon">📦</span>
                    <div className="stat-value">{sales.length}</div>
                    <div className="stat-label">Orders Tracked</div>
                    <div className="stat-delta">↑ +5 this week</div>
                  </div>
                  <div className="stat-card purple">
                    <span className="stat-icon">📧</span>
                    <div className="stat-value">64%</div>
                    <div className="stat-label">Email Open Rate</div>
                    <div className="stat-delta">↑ Above industry avg</div>
                  </div>
                </div>

                <div className="grid-2" style={{ marginBottom: 24, gridTemplateColumns: "1.5fr 1fr" }}>
                  <div className="card card-glow">
                    <div className="section-title">Revenue Trend</div>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" vertical={false} />
                          <XAxis dataKey="date" stroke="#4a7fa5" tick={{ fill: "#4a7fa5", fontSize: 12 }} tickLine={false} axisLine={false} />
                          <YAxis stroke="#4a7fa5" tick={{ fill: "#4a7fa5", fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="revenue" stroke="#00b4d8" strokeWidth={3} activeDot={{ r: 8, fill: "#4fc3f7", stroke: "#07121f", strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card">
                    <div className="section-title">Sales by Category</div>
                    <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ResponsiveContainer width="100%" height={220}>
                         <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ background: "#0a1628", border: "1px solid #1a3a5c", borderRadius: "8px", color: "#e0f0ff" }}
                            itemStyle={{ color: "#4fc3f7", fontWeight: 700 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                        {categoryData.map(entry => (
                          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#a0c4e0' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color }}></div>
                            {entry.name} ({entry.value})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="card card-glow">
                    <div className="section-title">Recent Sales</div>
                    {sales.slice(0, 5).map(s => (
                      <div key={s.id} className="activity-item">
                        <div className="activity-dot" style={{ background: CHANNEL_COLORS[s.channel] || "#4a7fa5" }} />
                        <div className="activity-text"><strong style={{ color: "#e0f0ff" }}>{s.customer}</strong> — {s.product}</div>
                        <div style={{ color: "#4fc3f7", fontWeight: 600, fontFamily: "Syne, sans-serif", fontSize: 13 }}>${s.amount}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div className="section-title">Sales by Channel</div>
                    {channelCounts.map(ch => (
                      <div key={ch.name} className="channel-bar">
                        <div className="channel-name" style={{ fontSize: 12 }}>{ch.name}</div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${(ch.count / maxCount) * 100}%`, background: CHANNEL_COLORS[ch.name] }} />
                        </div>
                        <div className="channel-val">{ch.count}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 16, padding: "12px", background: "#0a1628", borderRadius: 8, fontSize: 12, color: "#4a7fa5", border: "1px solid #1a3a5c" }}>
                      🔗 <strong>Integrated:</strong> Discord Bot (Demo) | <strong>Pending:</strong> Shopify & TikTok Sync
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CUSTOMERS */}
            {tab === "customers" && (
              <div className="card">
                <input className="search-bar" placeholder="Search customers by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="filter-row">
                  {["All", ...channels].map(ch => (
                    <button key={ch} className={`filter-chip ${channelFilter === ch ? "active" : ""}`} onClick={() => setChannelFilter(ch)}>{ch}</button>
                  ))}
                </div>
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Channel</th>
                      <th>Tags</th>
                      <th>Tank</th>
                      <th>Total Spent</th>
                      <th>Orders</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(c => (
                      <tr key={c.id} onClick={() => setSelectedCustomer(c)}>
                        <td>
                          <div className="customer-name">{c.name}</div>
                          <div style={{ fontSize: 11, color: "#2a5278" }}>{c.email}</div>
                        </td>
                        <td>
                          <span className="channel-badge" style={{ background: `${CHANNEL_COLORS[c.channel]}22`, color: CHANNEL_COLORS[c.channel] }}>{c.channel}</span>
                        </td>
                        <td>
                          {(Array.isArray(c.tags) ? c.tags : []).slice(0, 2).map(t => (
                            <span key={t} className="tag" style={{ background: `${TAG_COLORS[t] || "#4a7fa5"}22`, color: TAG_COLORS[t] || "#4a7fa5" }}>{t}</span>
                          ))}
                        </td>
                        <td style={{ fontSize: 12 }}>{c.tankSize}</td>
                        <td><span className="spent-value">${c.totalSpent}</span></td>
                        <td style={{ color: "#4a7fa5" }}>{c.orders}</td>
                        <td style={{ fontSize: 12, color: "#2a5278" }}>{c.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="empty"><div className="empty-icon">🔍</div>No customers found</div>
                )}
              </div>
            )}

            {/* INVENTORY */}
            {tab === "inventory" && (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div className="section-title" style={{ margin: 0 }}>Product Catalog</div>
                  <div style={{ fontSize: 13, color: "#4fc3f7", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>{inventory.length} products · {inventory.reduce((a, b) => a + (b.stock_qty || 0), 0)} total units</div>
                </div>
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Product / Desc</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Cost</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => {
                      const isEditingProd = editingProduct && editingProduct.id === item.id;
                      return (
                        <tr key={item.id} style={{ background: isEditingProd ? "#0a1e30" : "transparent" }}>
                          {isEditingProd ? (
                            <>
                              <td style={{ minWidth: 200 }}>
                                <input className="form-input" style={{ marginBottom: 4, width: "100%", padding: "4px 8px" }} value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Product Name" />
                                <input className="form-input" style={{ marginBottom: 4, width: "100%", padding: "4px 8px", fontSize: 12 }} value={editingProduct.description || ""} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Description" />
                                <input className="form-input" style={{ marginBottom: 4, width: "100%", padding: "4px 8px", fontSize: 12 }} value={editingProduct.image_url || ""} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} placeholder="Image URL (Thumbnail)" />
                                <input className="form-input" style={{ width: "100%", padding: "4px 8px", fontSize: 12 }} value={editingProduct.shopify_url || ""} onChange={e => setEditingProduct({...editingProduct, shopify_url: e.target.value})} placeholder="Shopify Link URL" />
                              </td>
                              <td style={{ fontSize: 12, color: "#4a7fa5", fontFamily: "monospace", verticalAlign: "top" }}>{item.sku || "—"}</td>
                              <td style={{ verticalAlign: "top" }}>
                                <select className="form-input" style={{ padding: "4px 8px" }} value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                  <option>SPS Coral</option>
                                  <option>LPS Coral</option>
                                  <option>Soft Coral</option>
                                  <option>LED Lights</option>
                                  <option>Equipment</option>
                                  <option>Accessories</option>
                                </select>
                              </td>
                              <td style={{ verticalAlign: "top", width: 90 }}>
                                <input className="form-input" type="number" style={{ width: "100%", padding: "4px 8px" }} value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} />
                              </td>
                              <td style={{ verticalAlign: "top", width: 90 }}>
                                <input className="form-input" type="number" style={{ width: "100%", padding: "4px 8px" }} value={editingProduct.cost} onChange={e => setEditingProduct({...editingProduct, cost: e.target.value})} />
                              </td>
                              <td style={{ verticalAlign: "top", width: 90 }}>
                                <input className="form-input" type="number" style={{ width: "100%", padding: "4px 8px" }} value={editingProduct.stock_qty} onChange={e => setEditingProduct({...editingProduct, stock_qty: e.target.value})} />
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button className="btn btn-primary btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={handleInventorySave}>Save</button>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => setEditingProduct(null)}>Cancel</button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ color: "#e0f0ff", fontWeight: 500 }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, background: "#0e2340", border: "1px solid #1a3a5c" }} />
                                  ) : (
                                    <div style={{ width: 40, height: 40, borderRadius: 4, background: "#0e2340", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "1px solid #1a3a5c", flexShrink: 0 }}>📦</div>
                                  )}
                                  <div>
                                    <div>{item.name}</div>
                                    {item.description && <div style={{ fontSize: 11, color: "#4a7fa5", marginTop: 2 }}>{item.description}</div>}
                                    {item.shopify_url && <a href={item.shopify_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#4fc3f7", textDecoration: "none", marginTop: 2, display: "inline-block" }}>🔗 View on Shopify</a>}
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontSize: 12, color: "#4a7fa5", fontFamily: "monospace" }}>{item.sku || "—"}</td>
                              <td><span className="tag" style={{ background: `${TAG_COLORS[item.category] || "#4a7fa5"}22`, color: TAG_COLORS[item.category] || "#4a7fa5" }}>{item.category}</span></td>
                              <td className="amount-cell">${Number(item.price).toFixed(2)}</td>
                              <td style={{ color: "#4a7fa5" }}>${Number(item.cost).toFixed(2)}</td>
                              <td><span style={{ color: item.stock_qty > 5 ? "#06d6a0" : item.stock_qty > 0 ? "#ffd166" : "#ef476f", fontWeight: 600 }}>{item.stock_qty}</span></td>
                              <td>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => setEditingProduct({ ...item })}>✏️</button>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12, color: "#ef476f" }} onClick={() => setDeleteProductId(item.id)}>🗑️</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {inventory.length === 0 && (
                  <div className="empty"><div className="empty-icon">📦</div>No products yet. Add your first product below.</div>
                )}

                <div style={{ marginTop: 24, padding: 20, background: "#0a1628", borderRadius: 12, border: "1px solid #1a3a5c" }}>
                  <div className="section-title">Add New Product</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input className="form-input" placeholder="e.g. WYSIWYG Acropora Colony" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>SKU</label>
                      <input className="form-input" placeholder="e.g. SPS-PK-001" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                        <option>SPS Coral</option>
                        <option>LPS Coral</option>
                        <option>Soft Coral</option>
                        <option>LED Lights</option>
                        <option>Equipment</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input className="form-input" type="number" placeholder="0" value={newProduct.stock_qty} onChange={e => setNewProduct({ ...newProduct, stock_qty: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Price ($)</label>
                      <input className="form-input" type="number" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Cost ($)</label>
                      <input className="form-input" type="number" placeholder="0.00" value={newProduct.cost} onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })} />
                    </div>
                    <div className="form-group full">
                      <label>Description</label>
                      <textarea className="form-input" rows={2} placeholder="Product description..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    </div>
                    <div className="form-group full">
                      <label>Image URL</label>
                      <input className="form-input" placeholder="https://.../image.png" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} />
                    </div>
                    <div className="form-group full">
                      <label>Shopify URL</label>
                      <input className="form-input" placeholder="https://.../products/sku" value={newProduct.shopify_url} onChange={e => setNewProduct({ ...newProduct, shopify_url: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: 8 }} onClick={handleAddProduct}>Add Product →</button>
                </div>

                {deleteProductId && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 14, 26, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div className="card" style={{ width: 400, maxWidth: "90%" }}>
                      <div style={{ fontSize: 24, marginBottom: 16, textAlign: "center" }}>⚠️</div>
                      <h3 style={{ margin: "0 0 12px 0", color: "#e0f0ff", textAlign: "center" }}>Delete Product?</h3>
                      <p style={{ color: "#4a7fa5", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>
                        Are you sure you want to delete <strong>{inventory.find(i => i.id === deleteProductId)?.name}</strong>? This cannot be undone.
                      </p>
                      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <button className="btn btn-ghost" onClick={() => setDeleteProductId(null)}>Cancel</button>
                        <button className="btn btn-primary" style={{ background: "#ef476f", borderColor: "#ef476f", color: "white" }} onClick={handleInventoryDelete}>Confirm Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SALES */}
            {tab === "sales" && (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div className="section-title" style={{ margin: 0 }}>All Transactions</div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "#4fc3f7" }}>${totalRevenue.toLocaleString()} total</div>
                </div>
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Channel</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => {
                      const isEditingS = editingSale && editingSale.id === s.id;
                      return (
                        <tr key={s.id} style={{ background: isEditingS ? "#0a1e30" : "transparent" }}>
                          {isEditingS ? (
                            <>
                              <td style={{ verticalAlign: "top" }}>
                                <select className="form-input" style={{ width: "100%", padding: "4px 8px" }} value={editingSale.customer_id || ""} onChange={e => setEditingSale({...editingSale, customer_id: e.target.value})}>
                                  <option value={s.customer_id}>{s.customer}</option>
                                  {customers.filter(c => c.id !== s.customer_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <select className="form-input" style={{ width: "100%", padding: "4px 8px" }} value={editingSale.product_id || ""} onChange={e => {
                                  const selProd = inventory.find(p => p.id.toString() === e.target.value.toString());
                                  let newAmount = editingSale.amount;
                                  if (selProd) newAmount = selProd.price;
                                  setEditingSale({...editingSale, product_id: e.target.value, amount: newAmount});
                                }}>
                                  <option value={s.product_id}>{s.product}</option>
                                  {inventory.filter(p => p.id !== s.product_id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <span className="tag" style={{ background: "#0e2340", color: "#4a7fa5" }}>{inventory.find(p => p.id.toString() === editingSale.product_id?.toString())?.category || s.category}</span>
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <select className="form-input" style={{ padding: "4px 8px" }} value={editingSale.channel} onChange={e => setEditingSale({...editingSale, channel: e.target.value})}>
                                  {channels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                                </select>
                              </td>
                              <td style={{ verticalAlign: "top", width: 90 }}>
                                <input className="form-input" type="number" style={{ width: "100%", padding: "4px 8px" }} value={editingSale.amount} onChange={e => setEditingSale({...editingSale, amount: e.target.value})} />
                              </td>
                              <td style={{ verticalAlign: "top", width: 130 }}>
                                <input className="form-input" type="date" style={{ width: "100%", padding: "4px 8px" }} value={editingSale.date} onChange={e => setEditingSale({...editingSale, date: e.target.value})} />
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button className="btn btn-primary btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={handleSaleSave}>Save</button>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => setEditingSale(null)}>Cancel</button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ color: "#e0f0ff", fontWeight: 500 }}>{s.customer}</td>
                              <td>{s.product}</td>
                              <td><span className="tag" style={{ background: "#0e2340", color: "#4a7fa5" }}>{s.category}</span></td>
                              <td><span className="channel-badge" style={{ background: `${CHANNEL_COLORS[s.channel]}22`, color: CHANNEL_COLORS[s.channel] }}>{s.channel}</span></td>
                              <td className="amount-cell">${Number(s.amount).toFixed(2)}</td>
                              <td style={{ color: "#2a5278" }}>{s.date}</td>
                              <td>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => setEditingSale({ ...s, customer_id: s.customer_id || customers.find(c => c.name === s.customer)?.id, product_id: s.product_id || inventory.find(p => p.name === s.product)?.id })}>✏️</button>
                                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12, color: "#ef476f" }} onClick={() => setDeleteSaleId(s.id)}>🗑️</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {sales.length === 0 && (
                  <div className="empty"><div className="empty-icon">💸</div>No sales yet.</div>
                )}

                <div style={{ marginTop: 24, padding: 20, background: "#0a1628", borderRadius: 12, border: "1px solid #1a3a5c" }}>
                  <div className="section-title">Log New Sale</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Customer *</label>
                      <select className="form-input" value={newSale.customer_id} onChange={e => setNewSale({ ...newSale, customer_id: e.target.value })}>
                        <option value="" disabled>Select Customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Product *</label>
                      <select className="form-input" value={newSale.product_id} onChange={e => {
                        const selProd = inventory.find(p => p.id.toString() === e.target.value.toString());
                        let newAmt = newSale.amount;
                        if (selProd) newAmt = selProd.price;
                        setNewSale({ ...newSale, product_id: e.target.value, amount: newAmt });
                      }}>
                        <option value="" disabled>Select Product...</option>
                        {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Channel</label>
                      <select className="form-input" value={newSale.channel} onChange={e => setNewSale({ ...newSale, channel: e.target.value })}>
                        {channels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount ($) *</label>
                      <input className="form-input" type="number" placeholder="0.00" value={newSale.amount} onChange={e => setNewSale({ ...newSale, amount: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input className="form-input" type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: 8 }} onClick={handleAddSale}>Add Sale →</button>
                </div>

                {deleteSaleId && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 14, 26, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div className="card" style={{ width: 400, maxWidth: "90%" }}>
                      <div style={{ fontSize: 24, marginBottom: 16, textAlign: "center" }}>⚠️</div>
                      <h3 style={{ margin: "0 0 12px 0", color: "#e0f0ff", textAlign: "center" }}>Delete Sale?</h3>
                      <p style={{ color: "#4a7fa5", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>
                        Are you sure you want to delete this sales record? This cannot be undone.
                      </p>
                      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <button className="btn btn-ghost" onClick={() => setDeleteSaleId(null)}>Cancel</button>
                        <button className="btn btn-primary" style={{ background: "#ef476f", borderColor: "#ef476f", color: "white" }} onClick={handleSaleDelete}>Confirm Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CAMPAIGNS */}
            {tab === "campaigns" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className="btn btn-primary" onClick={() => openCampaignModal()}>+ New Campaign</button>
                </div>
                {campaigns.map(camp => (
                  <div key={camp.id} className="campaign-card">
                    <div className="campaign-info">
                      <div className="campaign-name">{camp.name}</div>
                      <div className="campaign-seg">Segment: {camp.segment} · {camp.date}</div>
                    </div>
                    <div className="campaign-stats">
                      <div className="camp-stat">
                        <div className="camp-stat-val">{camp.sent}</div>
                        <div className="camp-stat-label">Sent</div>
                      </div>
                      <div className="camp-stat">
                        <div className="camp-stat-val">{camp.opened}</div>
                        <div className="camp-stat-label">Opened</div>
                      </div>
                      <div className="camp-stat">
                        <div className="camp-stat-val">{camp.clicked}</div>
                        <div className="camp-stat-label">Clicked</div>
                      </div>
                    </div>
                    <span className={`status-badge status-${camp.status.toLowerCase()}`}>{camp.status}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => openCampaignModal(camp)}>Edit</button>
                  </div>
                ))}
                <div className="card" style={{ marginTop: 16, background: "linear-gradient(135deg, #0a1f38, #071220)" }}>
                  <div className="section-title">Suggested Segments</div>
                  {[
                    { name: "VIP Customers", desc: "Top spenders (>$500). Send exclusive WYSIWYG previews and first access to new SPS packs.", count: customers.filter(c => c.totalSpent > 500).length },
                    { name: "TikTok Live Viewers", desc: "Customers acquired via TikTok. Best for flash sale announcements and new pack drops.", count: customers.filter(c => c.channel === "TikTok").length },
                    { name: "SPS Coral Buyers", desc: "Customers tagged SPS Coral. Share new acropora WYSIWYG, pack restocks, dosing tips.", count: customers.filter(c => c.tags?.includes("SPS Coral")).length },
                    { name: "ReefBreeders / Aquawiz Buyers", desc: "Light buyers — alert when Meridian or Aquawiz restock. Upsell accessories.", count: customers.filter(c => c.tags?.includes("LED Lights")).length },
                  ].map(seg => (
                    <div key={seg.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #0a1e30" }}>
                      <div>
                        <div style={{ color: "#e0f0ff", fontWeight: 500, fontSize: 13 }}>{seg.name} <span style={{ color: "#4fc3f7", fontFamily: "Syne, sans-serif" }}>({seg.count})</span></div>
                        <div style={{ color: "#4a7fa5", fontSize: 12, marginTop: 2 }}>{seg.desc}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => {
                        openCampaignModal();
                        setCampaignFormData(prev => ({ ...prev, name: `${seg.name} Campaign`, segment: seg.name }));
                      }}>Create Campaign</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PROMOTIONS */}
            {tab === "promotions" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className="btn btn-primary" onClick={() => openPromoModal()}>+ New Promotion</button>
                </div>
                {promotions.map((promo, i) => {
                  const isExpired = promo.end !== "Ongoing" && promo.end_date !== "Ongoing" && new Date(promo.end || promo.end_date) < new Date();
                  return (
                    <div key={promo.id || i} className="promo-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="promo-title">
                            {promo.title}
                            {isExpired && <span style={{ marginLeft: 12, background: "#1a3a5c", color: "#4a7fa5", padding: "2px 8px", borderRadius: 4, fontSize: 10, textTransform: "uppercase" }}>Expired</span>}
                          </div>
                          <div className="promo-desc">{promo.desc || promo.description}</div>
                          <div className="promo-meta">
                            <span>📅 <strong>{promo.start || promo.start_date}</strong> → {promo.end || promo.end_date}</span>
                            <span>🔖 Code: <strong>{promo.code}</strong></span>
                            <span>📣 <strong>{promo.channel}</strong></span>
                          </div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => openPromoModal(promo)}>Edit</button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ADD CUSTOMER */}
            {tab === "add" && (
              <div className="grid-2">
                <div className="card">
                  <div className="section-title">Manual Entry</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input className="form-input" placeholder="Jane Smith" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input className="form-input" placeholder="jane@email.com" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-input" placeholder="555-0000" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Channel</label>
                      <select className="form-input" value={newCustomer.channel} onChange={e => setNewCustomer({ ...newCustomer, channel: e.target.value })}>
                        {channels.map(ch => <option key={ch}>{ch}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tank Size</label>
                      <input className="form-input" placeholder="e.g. 75gal" value={newCustomer.tankSize} onChange={e => setNewCustomer({ ...newCustomer, tankSize: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input className="form-input" placeholder="City, State" value={newCustomer.location} onChange={e => setNewCustomer({ ...newCustomer, location: e.target.value })} />
                    </div>
                    <div className="form-group full">
                      <label>Interests / Tags</label>
                      <div className="tag-select">
                        {Object.keys(TAG_COLORS).map(t => (
                          <button key={t} className={`tag-toggle ${newCustomer.tags.includes(t) ? "selected" : ""}`} onClick={() => toggleTag(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group full">
                      <label>Notes</label>
                      <textarea className="form-input" rows={3} placeholder="Tank type, coral preferences, TikTok handle, how they found you..." value={newCustomer.notes} onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }} onClick={handleAddCustomer}>Add Customer →</button>
                </div>

                <div>
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="section-title">QR Code Sign-up</div>
                    <div className="qr-promo">
                      {!qrVisible ? (
                        <>
                          <div className="qr-box">📱</div>
                          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#e0f0ff", marginBottom: 8 }}>Trade Show Sign-up Form</div>
                          <div className="qr-text">Generate a QR code that links to a customer sign-up form. Display at your trade show booth — customers scan and fill it in themselves.</div>
                          <div className="form-group" style={{ marginTop: 14, textAlign: "left" }}>
                            <label>Sign-up Form URL</label>
                            <input className="form-input" placeholder="https://your-site.netlify.app (or leave blank for current page)" value={qrUrl} onChange={e => setQrUrl(e.target.value)} />
                          </div>
                          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setQrVisible(true)}>Generate QR Code</button>
                        </>
                      ) : (
                        <>
                          <div style={{ background: "white", padding: 16, borderRadius: 12, display: "inline-block", marginBottom: 12 }}>
                            <QRCodeCanvas
                              id="qr-canvas"
                              value={qrUrl || window.location.origin + "/#add"}
                              size={180}
                              bgColor="#ffffff"
                              fgColor="#050e1a"
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#e0f0ff", marginBottom: 4, fontSize: 14 }}>Scan to Sign Up</div>
                          <div className="qr-text" style={{ marginBottom: 12 }}>{qrUrl || window.location.origin + "/#add"}</div>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            <button className="btn btn-primary btn-sm" onClick={() => {
                              const canvas = document.getElementById("qr-canvas");
                              const url = canvas.toDataURL("image/png");
                              const link = document.createElement("a");
                              link.download = "ptrcrm-signup-qr.png";
                              link.href = url;
                              link.click();
                              showToast("✓ QR code downloaded!");
                            }}>Download PNG</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setQrVisible(false)}>Regenerate</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="card">
                    <div className="section-title">Integration Sources</div>
                    {[
                      { name: "Shopify", icon: "🛒", desc: "Auto-import customers from online orders", status: "Connect" },
                      { name: "TikTok Shop", icon: "🎵", desc: "Capture buyers from TikTok Lives", status: "Connect" },
                      { name: "Instagram", icon: "📸", desc: "Track DM-based and Shop orders", status: "Connect" },
                    ].map(src => (
                      <div key={src.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #0a1e30" }}>
                        <span style={{ fontSize: 20 }}>{src.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#e0f0ff", fontSize: 13, fontWeight: 500 }}>{src.name}</div>
                          <div style={{ color: "#4a7fa5", fontSize: 12 }}>{src.desc}</div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast(`${src.name} integration coming soon!`)}>{src.status}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

              </>
            )}

          </div>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="modal-overlay" onClick={() => { setSelectedCustomer(null); setIsEditing(false); setShowDeleteConfirm(false); }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="profile-header" style={{ margin: 0, flex: 1 }}>
                  <div className="profile-avatar">{selectedCustomer.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="profile-info">
                    {isEditing ? (
                      <input className="form-input" style={{ marginBottom: 4, width: "100%", fontSize: "16px", fontWeight: "bold" }} value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} placeholder="Full Name" />
                    ) : (
                      <h2>{selectedCustomer.name}</h2>
                    )}
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <input className="form-input" style={{ flex: 1 }} value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} placeholder="Email" />
                        <input className="form-input" style={{ width: 120 }} value={editFormData.phone} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} placeholder="Phone" />
                        <input className="form-input" style={{ flex: 1 }} value={editFormData.location} onChange={e => setEditFormData({ ...editFormData, location: e.target.value })} placeholder="Location" />
                      </div>
                    ) : (
                      <div className="profile-meta">{selectedCustomer.email} · {selectedCustomer.phone} · {selectedCustomer.location}</div>
                    )}
                    <div style={{ marginTop: 6 }}>
                      {isEditing ? (
                        <select className="form-input" style={{ width: "auto", display: "inline-block", marginRight: 8, padding: "4px 8px" }} value={editFormData.channel} onChange={e => setEditFormData({ ...editFormData, channel: e.target.value })}>
                          {channels.map(ch => <option key={ch}>{ch}</option>)}
                        </select>
                      ) : (
                        <span className="channel-badge" style={{ background: `${CHANNEL_COLORS[selectedCustomer.channel] || "#4a7fa5"}22`, color: CHANNEL_COLORS[selectedCustomer.channel] || "#4a7fa5" }}>{selectedCustomer.channel || "Unknown"}</span>
                      )}
                      {(Array.isArray(selectedCustomer.tags) ? selectedCustomer.tags : []).map(t => <span key={t} className="tag" style={{ background: `${TAG_COLORS[t] || "#4a7fa5"}22`, color: TAG_COLORS[t] || "#4a7fa5", marginLeft: 4 }}>{t}</span>)}
                    </div>
                  </div>
                </div>
                <button className="modal-close" onClick={() => { setSelectedCustomer(null); setIsEditing(false); setShowDeleteConfirm(false); }}>✕</button>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tank Size</label>
                  {isEditing ? (
                    <input className="form-input" value={editFormData.tankSize} onChange={e => setEditFormData({...editFormData, tankSize: e.target.value})} placeholder="e.g. 120gal" />
                  ) : (
                    <span>{selectedCustomer.tankSize || "—"}</span>
                  )}
                </div>
                <div className="detail-item"><label>Total Spent</label><span style={{ color: "#4fc3f7", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>${selectedCustomer.totalSpent}</span></div>
                <div className="detail-item"><label>Orders</label><span>{selectedCustomer.orders}</span></div>
                <div className="detail-item"><label>Customer Since</label><span>{selectedCustomer.joined}</span></div>
                <div className="detail-item"><label>Last Contact</label><span>{selectedCustomer.lastContact}</span></div>
                <div className="detail-item"><label>Channel</label><span>{selectedCustomer.channel}</span></div>
              </div>
              <div style={{ fontSize: 11, color: "#2a5278", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8, marginTop: 16 }}>Notes</div>
              {isEditing ? (
                <textarea className="form-input" rows={3} value={editFormData.notes} onChange={e => setEditFormData({...editFormData, notes: e.target.value})} placeholder="Customer notes..." />
              ) : (
                selectedCustomer.notes ? <div className="notes-box">{selectedCustomer.notes}</div> : <div style={{ color: "#4a7fa5", fontSize: 13, marginBottom: 16 }}>No notes added.</div>
              )}
              <div className="purchase-history">
                <h4>Purchase History</h4>
                {sales.filter(s => s.customer === selectedCustomer.name).length > 0
                  ? sales.filter(s => s.customer === selectedCustomer.name).map(s => (
                    <div key={s.id} className="purchase-item">
                      <div>
                        <div className="purchase-product">{s.product}</div>
                        <div style={{ fontSize: 11, color: "#2a5278" }}>{s.date} · {s.channel}</div>
                      </div>
                      <div className="purchase-amount">${s.amount}</div>
                    </div>
                  ))
                  : <div style={{ color: "#2a5278", fontSize: 13 }}>No purchases recorded yet.</div>
                }
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {isEditing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={handleCustomerSave}>Save Changes</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => { showToast(`Email drafted for ${selectedCustomer.name}`); setSelectedCustomer(null); }}>✉ Send Email</button>
                    <button className="btn btn-ghost btn-sm" onClick={handleEditClick}>Edit Profile</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { showToast("Added to campaign segment"); setSelectedCustomer(null); }}>Add to Campaign</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "#ff4d4f" }} onClick={() => setShowDeleteConfirm(true)}>Delete Customer</button>
                  </>
                )}
              </div>
              
              {/* Delete Confirmation Overlay */}
              {showDeleteConfirm && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 14, 26, 0.95)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 32, borderRadius: 16, zIndex: 10 }}>
                  <div style={{ fontSize: 24, marginBottom: 16 }}>⚠️</div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#e0f0ff", textAlign: "center" }}>Delete Customer?</h3>
                  <p style={{ color: "#4a7fa5", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to delete {selectedCustomer.name}? This cannot be undone.</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    <button className="btn btn-primary" style={{ background: "#ff4d4f", borderColor: "#ff4d4f", color: "white" }} onClick={handleCustomerDelete}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}

        {/* Campaign Builder Modal */}
        {showCampaignModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div>
                  <h2 style={{ fontFamily: 'Syne', color: '#e0f0ff', fontSize: 24, margin: 0 }}>
                    {editingCampaign ? "Edit Campaign" : "Build New Campaign"}
                  </h2>
                  <p style={{ color: '#4a7fa5', fontSize: 13, marginTop: 4 }}>
                    {editingCampaign ? `Updating details for ${editingCampaign.name}` : "Define your targets and message"}
                  </p>
                </div>
                <button className="modal-close" onClick={() => setShowCampaignModal(false)}>×</button>
              </div>

              <div className="form-grid">
                <div className="form-group full">
                  <label>Campaign Name *</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. VIP Early Access Drop" 
                    value={campaignFormData.name} 
                    onChange={e => setCampaignFormData({...campaignFormData, name: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    className="form-input" 
                    value={campaignFormData.status} 
                    onChange={e => setCampaignFormData({...campaignFormData, status: e.target.value})}
                  >
                    <option>Draft</option>
                    <option>Active</option>
                    <option>Sent</option>
                    <option>Archived</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Launch Date</label>
                  <input 
                    className="form-input" 
                    type="date" 
                    value={campaignFormData.date} 
                    onChange={e => setCampaignFormData({...campaignFormData, date: e.target.value})}
                  />
                </div>

                <div className="form-group full">
                  <label>Target Segment</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. SPS Coral buyers, Top Spenders" 
                    value={campaignFormData.segment} 
                    onChange={e => setCampaignFormData({...campaignFormData, segment: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleCampaignSave}>
                  {editingCampaign ? "Save Changes" : "Create Campaign →"}
                </button>
                <button className="btn btn-ghost" style={{ padding: '0 24px' }} onClick={() => setShowCampaignModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Promotion Builder Modal */}
        {showPromoModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div>
                  <h2 style={{ fontFamily: 'Syne', color: '#e0f0ff', fontSize: 24, margin: 0 }}>
                    {editingPromo ? "Edit Promotion" : "Create New Promotion"}
                  </h2>
                  <p style={{ color: '#4a7fa5', fontSize: 13, marginTop: 4 }}>
                    {editingPromo ? `Updating details for ${editingPromo.title}` : "Set up a new offer or discount"}
                  </p>
                </div>
                <button className="modal-close" onClick={() => setShowPromoModal(false)}>×</button>
              </div>

              <div className="form-grid">
                <div className="form-group full">
                  <label>Promo Title *</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. 10% Off TikTok Live" 
                    value={promoFormData.title} 
                    onChange={e => setPromoFormData({...promoFormData, title: e.target.value})}
                  />
                </div>
                
                <div className="form-group full">
                  <label>Description</label>
                  <textarea 
                    className="form-input" 
                    rows={3}
                    placeholder="Describe the offer details..." 
                    value={promoFormData.description} 
                    onChange={e => setPromoFormData({...promoFormData, description: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Promo Code</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. LIVE10" 
                    value={promoFormData.code} 
                    onChange={e => setPromoFormData({...promoFormData, code: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Channel</label>
                  <select 
                    className="form-input" 
                    value={promoFormData.channel} 
                    onChange={e => setPromoFormData({...promoFormData, channel: e.target.value})}
                  >
                    <option>Shopify</option>
                    <option>TikTok</option>
                    <option>Email List</option>
                    <option>Trade Show</option>
                    <option>All Channels</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. Ongoing or 2024-03-01" 
                    value={promoFormData.start_date} 
                    onChange={e => setPromoFormData({...promoFormData, start_date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g. Ongoing or 2024-03-31" 
                    value={promoFormData.end_date} 
                    onChange={e => setPromoFormData({...promoFormData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handlePromoSave}>
                  {editingPromo ? "Save Changes" : "Create Promotion →"}
                </button>
                {editingPromo && (
                  <button className="btn btn-ghost" style={{ padding: '0 24px', color: '#ef476f' }} onClick={() => setShowPromoDeleteConfirm(true)}>
                    Delete
                  </button>
                )}
                <button className="btn btn-ghost" style={{ padding: '0 24px' }} onClick={() => setShowPromoModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Promo Delete Confirmation */}
        {showPromoDeleteConfirm && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5, 14, 26, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100 }}>
            <div className="card" style={{ width: 400, maxWidth: "90%" }}>
              <div style={{ fontSize: 24, marginBottom: 16, textAlign: "center" }}>⚠️</div>
              <h3 style={{ margin: "0 0 12px 0", color: "#e0f0ff", textAlign: "center" }}>Delete Promotion?</h3>
              <p style={{ color: "#4a7fa5", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>{editingPromo?.title}</strong>? This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-ghost" onClick={() => setShowPromoDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ background: "#ef476f", borderColor: "#ef476f", color: "white" }} onClick={handlePromoDelete}>Confirm Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
