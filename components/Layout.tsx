
import React from 'react';
import Logo from './Logo';
import { LayoutDashboard, ClipboardList, Users, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, userName }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'checkin', label: 'Daily Check-in', icon: ClipboardList },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#fef9f2] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-pink-100 p-6 flex flex-col hidden md:flex">
        <Logo className="mb-10" />
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-100 text-black font-bold'
                  : 'text-black opacity-70 hover:opacity-100 hover:bg-yellow-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-gray-100">
          <div className="mb-4">
            <p className="text-[10px] text-black uppercase font-bold px-4 opacity-50">Logged in as</p>
            <p className="text-sm font-bold px-4 text-black truncate">{userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex justify-around p-3 md:hidden z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              activeTab === tab.id ? 'text-pink-600 font-bold' : 'text-black opacity-60'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
