import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Columns, PlusCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/LeadsList';
import Pipeline from './pages/Pipeline';
import CaptureLead from './pages/CaptureLead';
import LeadDetail from './pages/LeadDetail';

function App() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/leads', label: 'All Leads', icon: Users },
        { path: '/pipeline', label: 'Pipeline', icon: Columns },
        { path: '/capture', label: 'Capture Lead', icon: PlusCircle },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm z-20">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">G</div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Gharpayy</h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300 ml-1">Properties CRM</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 text-primary shadow-sm shadow-blue-50'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] text-white shadow-xl">
                        <p className="text-xs font-bold text-gray-400 mb-1">PRO PLAN</p>
                        <p className="text-sm font-black mb-4">Unlimited Leads</p>
                        <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-colors">Manage Subscription</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#FBFBFF] relative z-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto p-10">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/leads" element={<LeadsList />} />
                        <Route path="/pipeline" element={<Pipeline />} />
                        <Route path="/capture" element={<CaptureLead />} />
                        <Route path="/lead/:id" element={<LeadDetail />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
