import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const MOCK_CUSTOMERS = [
  { id: 1, name: "Marcus Rivera", email: "marcus@email.com", phone: "555-0101", channel: "TikTok", joined: "2025-01-15", totalSpent: 847, orders: 4, tags: ["SPS Coral", "LED Lights"], tankSize: "120gal", notes: "Loves acropora frags, watches every TikTok live", lastContact: "2025-03-01", location: "Austin, TX" },
  { id: 2, name: "Priya Nair", email: "priya@email.com", phone: "555-0202", channel: "Trade Show", joined: "2024-11-03", totalSpent: 1240, orders: 7, tags: ["LPS Coral", "Nano Tank"], tankSize: "30gal", notes: "Regular at Austin Reef Club shows. Interested in frag swaps.", lastContact: "2025-02-20", location: "Houston, TX" },
  { id: 3, name: "Derek Hollis", email: "derek@email.com", phone: "555-0303", channel: "Shopify", joined: "2025-02-01", totalSpent: 390, orders: 2, tags: ["LED Lights", "New Customer"], tankSize: "75gal", notes: "First purchase was Kessil A360. Follow up on upgrade path.", lastContact: "2025-02-01", location: "Dallas, TX" },
  { id: 4, name: "Yuki Tanaka", email: "yuki@email.com", phone: "555-0404", channel: "Instagram", joined: "2024-09-22", totalSpent: 2100, orders: 11, tags: ["SPS Coral", "High-End Lights", "VIP"], tankSize: "200gal", notes: "Top spender. Reef tank influencer with 12k followers. Send new arrivals first.", lastContact: "2025-03-05", location: "San Antonio, TX" },
  { id: 5, name: "Carlos Mendez", email: "carlos@email.com", phone: "555-0505", channel: "Home Store", joined: "2025-01-28", totalSpent: 560, orders: 3, tags: ["Soft Coral", "Beginner"], tankSize: "55gal", notes: "Local pickup customer. New to reefing, very curious — loves in-person advice.", lastContact: "2025-01-30", location: "Local" },
];

const MOCK_SALES = [
  { id: 1, customer: "Yuki Tanaka", product: "SPS Pack 1", amount: 1200, channel: "Shopify", date: "2025-03-05", category: "SPS Coral" },
  { id: 2, customer: "Marcus Rivera", product: "WYSIWYG Acropora Colony", amount: 380, channel: "TikTok", date: "2025-03-01", category: "SPS Coral" },
  { id: 3, customer: "Priya Nair", product: "SPS Pack 3", amount: 520, channel: "Trade Show", date: "2025-02-20", category: "SPS Coral" },
  { id: 4, customer: "Derek Hollis", product: "ReefBreeders Photon V2+", amount: 399, channel: "Shopify", date: "2025-02-01", category: "LED Lights" },
  { id: 5, customer: "Carlos Mendez", product: "Collector Pack — Beginner", amount: 95, channel: "Home Store", date: "2025-01-30", category: "Soft Coral" },
];

const MOCK_CAMPAIGNS = [
  { id: 1, name: "New WYSIWYG Drop", status: "Active", segment: "SPS Coral buyers", sent: 48, opened: 31, clicked: 14, date: "2025-03-01" },
  { id: 2, name: "TikTok Live — SPS Pack Flash Sale", status: "Draft", segment: "TikTok customers", sent: 0, opened: 0, clicked: 0, date: "2025-03-10" },
  { id: 3, name: "ReefBreeders Meridian In Stock", status: "Sent", segment: "LED Light buyers", sent: 72, opened: 45, clicked: 22, date: "2025-02-15" },
];

const CHANNEL_COLORS = {
  "TikTok": "#ff4d6d",
  "Trade Show": "#f4a261",
  "Shopify": "#52b788",
  "Instagram": "#c77dff",
  "Home Store": "#4cc9f0",
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
`;

export default function AquaCRM() {
  const [tab, setTab] = useState("dashboard");
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [sales] = useState(MOCK_SALES);
  const [campaigns] = useState(MOCK_CAMPAIGNS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", channel: "Trade Show", tankSize: "", location: "", notes: "", tags: [] });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === "All" || c.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);
  const channels = ["TikTok", "Trade Show", "Shopify", "Instagram", "Home Store"];
  const channelCounts = channels.map(ch => ({ name: ch, count: customers.filter(c => c.channel === ch).length }));
  const maxCount = Math.max(...channelCounts.map(c => c.count));

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;
    const c = { ...newCustomer, id: customers.length + 1, joined: new Date().toISOString().split("T")[0], totalSpent: 0, orders: 0, lastContact: new Date().toISOString().split("T")[0] };
    setCustomers([c, ...customers]);
    setNewCustomer({ name: "", email: "", phone: "", channel: "Trade Show", tankSize: "", location: "", notes: "", tags: [] });
    showToast("✓ Customer added successfully");
    setTab("customers");
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
                    <div style={{ marginTop: 16, padding: "12px", background: "#0a1628", borderRadius: 8, fontSize: 12, color: "#4a7fa5" }}>
                      🔗 Connect pootangreefs.com Shopify & TikTok Shop to auto-sync customers
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
                          {c.tags.slice(0, 2).map(t => (
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
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.id}>
                        <td style={{ color: "#e0f0ff", fontWeight: 500 }}>{s.customer}</td>
                        <td>{s.product}</td>
                        <td><span className="tag" style={{ background: "#0e2340", color: "#4a7fa5" }}>{s.category}</span></td>
                        <td><span className="channel-badge" style={{ background: `${CHANNEL_COLORS[s.channel]}22`, color: CHANNEL_COLORS[s.channel] }}>{s.channel}</span></td>
                        <td className="amount-cell">${s.amount}</td>
                        <td style={{ color: "#2a5278" }}>{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CAMPAIGNS */}
            {tab === "campaigns" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className="btn btn-primary" onClick={() => showToast("Campaign builder coming soon!")}>+ New Campaign</button>
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
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast("Opening campaign editor...")}>Edit</button>
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
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast(`Creating campaign for ${seg.name}...`)}>Create Campaign</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PROMOTIONS */}
            {tab === "promotions" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className="btn btn-primary" onClick={() => showToast("Promo builder coming soon!")}>+ New Promotion</button>
                </div>
                {[
                  { title: "Free Shipping — Orders $399+", desc: "Auto-applies at checkout on pootangreefs.com. Remind email list customers before Live Sales.", start: "Ongoing", end: "Ongoing", code: "Auto", channel: "Shopify" },
                  { title: "TikTok Live Flash Sale — SPS Packs", desc: "Exclusive pricing during live stream. DM to claim. First come first served — mention pack # in chat.", start: "Mar 12", end: "Mar 12", code: "LIVE10", channel: "TikTok" },
                  { title: "WYSIWYG Early Access for Email Subscribers", desc: "Email list gets 24hr early access before new WYSIWYG pieces go live on site.", start: "Ongoing", end: "Ongoing", code: "Email Only", channel: "Email List" },
                  { title: "Trade Show Loyalty — 5th Show Reward", desc: "Visit 5 shows, get a free frag. Track via customer notes field in CRM.", start: "Ongoing", end: "Ongoing", code: "In-Person", channel: "Trade Show" },
                ].map((promo, i) => (
                  <div key={i} className="promo-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="promo-title">{promo.title}</div>
                        <div className="promo-desc">{promo.desc}</div>
                        <div className="promo-meta">
                          <span>📅 <strong>{promo.start}</strong> → {promo.end}</span>
                          <span>🔖 Code: <strong>{promo.code}</strong></span>
                          <span>📣 <strong>{promo.channel}</strong></span>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm">Edit</button>
                    </div>
                  </div>
                ))}
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
                      <div className="qr-box">📱</div>
                      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#e0f0ff", marginBottom: 8 }}>Trade Show Sign-up Form</div>
                      <div className="qr-text">Generate a QR code that links to a customer sign-up form. Display at your trade show booth — customers scan and fill it in themselves.</div>
                      <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={() => showToast("QR code generator coming soon!")}>Generate QR Code</button>
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

          </div>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="profile-header" style={{ margin: 0, flex: 1 }}>
                  <div className="profile-avatar">{selectedCustomer.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="profile-info">
                    <h2>{selectedCustomer.name}</h2>
                    <div className="profile-meta">{selectedCustomer.email} · {selectedCustomer.phone} · {selectedCustomer.location}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className="channel-badge" style={{ background: `${CHANNEL_COLORS[selectedCustomer.channel]}22`, color: CHANNEL_COLORS[selectedCustomer.channel] }}>{selectedCustomer.channel}</span>
                      {selectedCustomer.tags?.map(t => <span key={t} className="tag" style={{ background: `${TAG_COLORS[t] || "#4a7fa5"}22`, color: TAG_COLORS[t] || "#4a7fa5", marginLeft: 4 }}>{t}</span>)}
                    </div>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedCustomer(null)}>✕</button>
              </div>
              <div className="detail-grid">
                <div className="detail-item"><label>Tank Size</label><span>{selectedCustomer.tankSize || "—"}</span></div>
                <div className="detail-item"><label>Total Spent</label><span style={{ color: "#4fc3f7", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>${selectedCustomer.totalSpent}</span></div>
                <div className="detail-item"><label>Orders</label><span>{selectedCustomer.orders}</span></div>
                <div className="detail-item"><label>Customer Since</label><span>{selectedCustomer.joined}</span></div>
                <div className="detail-item"><label>Last Contact</label><span>{selectedCustomer.lastContact}</span></div>
                <div className="detail-item"><label>Channel</label><span>{selectedCustomer.channel}</span></div>
              </div>
              {selectedCustomer.notes && (
                <>
                  <div style={{ fontSize: 11, color: "#2a5278", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Notes</div>
                  <div className="notes-box">{selectedCustomer.notes}</div>
                </>
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
                <button className="btn btn-primary btn-sm" onClick={() => { showToast(`Email drafted for ${selectedCustomer.name}`); setSelectedCustomer(null); }}>✉ Send Email</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { showToast("Opened in edit mode"); setSelectedCustomer(null); }}>Edit Profile</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { showToast("Added to campaign segment"); setSelectedCustomer(null); }}>Add to Campaign</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
