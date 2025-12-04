import React from 'react';
import { LayoutDashboard, LineChart, PlusSquare, Menu, X, Gem, Layers } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market', label: 'Mercado', icon: LineChart },
    { id: 'operations', label: 'Operações', icon: Layers },
    { id: 'new-operation', label: 'Nova Operação', icon: PlusSquare },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-200">
      {/* Mobile Header */}
      <div className="md:hidden glass-panel border-b border-luxury-border p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-luxury-gold font-bold text-xl tracking-wider">
          <Gem className="drop-shadow-lg" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-luxury-gold to-yellow-200">CRYPTOWAY</span>
        </div>
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 glass-panel border-r border-luxury-border transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-24' : 'md:w-72'}
      `}>
        {/* Header / Logo Area - Click to Collapse */}
        <div 
            onClick={toggleCollapse}
            className={`
                h-24 flex items-center border-b border-luxury-border/50 cursor-pointer group hover:bg-white/5 transition-colors
                ${isCollapsed ? 'justify-center px-0' : 'px-8 gap-3'}
            `}
            title="Clique para minimizar/expandir"
        >
          <div className="p-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/20 group-hover:border-luxury-gold/50 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Gem size={28} className="text-luxury-gold" />
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 flex flex-col justify-center whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>
            <span className="block font-bold text-xl tracking-widest text-white">CRYPTO<span className="text-luxury-gold">WAY</span></span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted">Wealth Mgmt</span>
          </div>
        </div>

        <nav className="p-4 space-y-3 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center transition-all duration-300 group relative
                  ${isCollapsed ? 'justify-center px-0 py-4 rounded-xl' : 'gap-4 px-4 py-4 rounded-xl'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-luxury-gold/20 to-transparent text-white shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                    : 'text-luxury-muted hover:text-white hover:bg-white/5'
                  }
                  ${isActive && !isCollapsed ? 'border-l-2 border-luxury-gold' : 'border-l-2 border-transparent'}
                `}
              >
                <Icon size={24} className={`transition-colors shrink-0 ${isActive ? 'text-luxury-gold drop-shadow-md' : 'group-hover:text-luxury-gold'}`} />
                
                <span className={`
                    text-sm font-medium tracking-wide whitespace-nowrap overflow-hidden transition-all duration-500
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                    ${isActive ? 'font-semibold' : ''}
                `}>
                    {item.label}
                </span>

                {/* Tooltip for collapsed state hover */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-luxury-black border border-luxury-border rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`absolute bottom-0 w-full p-6 border-t border-luxury-border/30 transition-all duration-500 ${isCollapsed ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          <div className="bg-black/40 p-4 rounded-xl border border-luxury-border/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-xs text-luxury-muted uppercase tracking-wider">Sistema Online</p>
            </div>
            <p className="text-[10px] text-luxury-muted/60 text-center mt-1 font-mono">Powered by Gemini AI</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative h-screen">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 pb-20">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};