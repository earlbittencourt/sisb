import { Link, useLocation } from "react-router-dom";
import { FileText, Settings, GraduationCap, type LucideIcon, Home, ClipboardList, ChevronDown, Building2, AlertTriangle, Database } from "lucide-react";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// Define the type for a navigation link
interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
}

// All possible navigation links
const navLinks: NavLink[] = [
  { name: "Dashboard", href: "/", icon: Home, roles: ["admin", "coordinator", "advisor", "student"] },
  { name: "Meus Projetos", href: "/meus-projetos", icon: FileText, roles: ["advisor", "student"] },
  { name: "Editais", href: "/editais", icon: Building2, roles: ["admin"] },
  { name: "Inadimplência", href: "/admin/inadimplencia", icon: AlertTriangle, roles: ["admin"] }
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isReportsOpen, setReportsOpen] = useState(false);
  const [isAdminOpen, setAdminOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [highlighterStyle, setHighlighterStyle] = useState({ top: 0, height: 0, left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector<HTMLAnchorElement>('a[data-active="true"]');
      
      if (activeLink) {
        const top = activeLink.offsetTop;
        const height = activeLink.clientHeight;
        const left = activeLink.offsetLeft;
        const width = activeLink.clientWidth;
        setHighlighterStyle({ top, height, left, width, opacity: 1 });
      } else {
        setHighlighterStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }
  }, [location.pathname]);

  // Filter links based on the current user's profile
  const userLinks = navLinks.filter(link => link.roles.includes(user?.profile || ""));

  return (
    <div className="w-72 flex flex-col bg-sidebar-gradient rounded-3xl shadow-2xl mt-2 mb-8 p-0 backdrop-blur-md border border-white/20 dark:border-black/30" style={{minHeight: 'calc(100vh - 3rem)', maxHeight: 'calc(100vh - 3rem)'}}>
      <div className="flex items-center px-7 pt-6 pb-8">
        <GraduationCap size={24} className="text-white mr-3"/>
        <h1 className="text-xl font-bold text-white">SISBIC</h1>
      </div>

      <nav ref={navRef} className="relative flex-1 space-y-1.5 px-2">
        <div
          className="moving-glass-highlighter"
          style={{
            transform: `translate(${highlighterStyle.left}px, ${highlighterStyle.top}px)`,
            height: `${highlighterStyle.height}px`,
            width: `${highlighterStyle.width-15}px`,
            opacity: highlighterStyle.opacity,
            pointerEvents: 'none'
          }}
        />

        {userLinks.map((link) => {
          const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              to={link.href}
              data-active={isActive}
              className={`relative z-10 flex items-center rounded-lg text-sm font-medium transition-all duration-200 w-full
                ${isActive
                  ? "font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  : "text-gray-200 hover:text-white"
                }`}
            >
              <div className="flex items-center w-full px-5 py-2.5">
                <link.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive ? 'text-white' : ''}`} />
                <span className="leading-none">{link.name}</span>
              </div>
            </Link>
          );
        })}

        <div className="relative z-10">
          <button
            onClick={() => setReportsOpen(!isReportsOpen)}
            className="flex items-center justify-between rounded-lg text-sm font-medium text-gray-200 hover:text-white w-full"
          >
            <div className="flex items-center w-full px-5 py-2.5">
              <ClipboardList className="mr-3 h-5 w-5"/>
              <span>Relatórios</span>
              <ChevronDown
                className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                  isReportsOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
          {isReportsOpen && (
            <div className="mt-1.5 space-y-1.5">
              <Link to="/reports/students" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Alunos
              </Link>
              <Link to="/reports/projects" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Projetos
              </Link>
            </div>
          )}
        </div>

        {/* Menu Administração do Sistema */}
        <div className="relative z-10">
          <button
            onClick={() => setAdminOpen(!isAdminOpen)}
            className="flex items-center justify-between rounded-lg text-sm font-medium text-gray-200 hover:text-white w-full"
          >
            <div className="flex items-center w-full px-5 py-2.5">
              <Database className="mr-3 h-5 w-5"/>
              <span>Administração do Sistema</span>
              <ChevronDown
                className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                  isAdminOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
          {isAdminOpen && (
            <div className="mt-1.5 space-y-1.5">
              <Link to="/admin/tipos-programa" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Tipos de Programa
              </Link>
              <Link to="/admin/noticias" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Manutenção de Notícias
              </Link>
              <Link to="/admin/agencias" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Agências de Fomento
              </Link>
              <Link to="/admin/anexos" className="block text-sm text-gray-300 hover:text-white px-8 py-2">
                Anexar Arquivos
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="px-5 pb-6">
        <button
          className="w-full rounded-lg bg-white/20 py-2.5 text-center text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/30">
          <Settings className="mr-2 inline h-4 w-4"/>
          Configurações
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 