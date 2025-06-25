import React from 'react';
import { Bell, Search, Settings, User, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleProfileChange = (newProfile: string) => {
    if (user) {
      setUser({
        ...user,
        profile: newProfile as any
      });
    }
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-6 mt-6 p-4 rounded-3xl bg-white/60 dark:bg-ufba-gray-800/60 backdrop-blur-glass border border-white/50 dark:border-white/10 shadow-depth-2">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ufba-blue to-ufba-blue-bright">
              SISBIC Modern
            </h1>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ufba-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white/50 dark:bg-ufba-gray-700/50 text-ufba-gray-800 dark:text-ufba-gray-100 placeholder-ufba-gray-500 border-none focus:ring-2 focus:ring-ufba-blue-light transition"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-ufba-gold" /> : <Moon className="w-5 h-5 text-ufba-blue" />}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition">
              <Bell className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition">
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>

            <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-2"></div>

            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ufba-blue to-ufba-blue-light flex items-center justify-center">
                 <User className="w-5 h-5 text-white" />
               </div>
               <div className="text-left">
                  <p className="font-semibold text-sm text-text-primary">{user?.name}</p>
                  <div className="relative">
                    <select
                      value={user?.profile}
                      onChange={(e) => handleProfileChange(e.target.value)}
                      className="appearance-none bg-transparent text-xs text-text-secondary -ml-1 pr-5 focus:outline-none cursor-pointer"
                    >
                      <option value="admin">Administrador</option>
                      <option value="coordinator">Coordenador</option>
                      <option value="advisor">Orientador/Pesquisador</option>
                      <option value="student">Bolsista</option>
                      <option value="comite">Membro de Comitê</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 