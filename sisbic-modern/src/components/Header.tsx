import React, { Fragment } from 'react';
import { Bell, Search, Settings, User, Moon, Sun, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, Transition } from '@headlessui/react';

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
    <header className="glass-header">
      <div className="mx-6 mt-6 p-4 rounded-3xl bg-white/60 dark:bg-ufba-gray-800/60 backdrop-blur-glass border border-white/50 dark:border-white/10 shadow-depth-2 border-b border-transparent dark:border-slate-700">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ufba-blue to-ufba-blue-bright">
              SISBIC Modern
            </h1>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Busca global (Pressione '/' para focar)"
                className="glass-input w-full pl-10"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <Menu as="div" className="relative">
              <Menu.Button className="glass-button p-2 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 glass-effect divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Notificações</h3>
                    <div className="space-y-3">
                      <Menu.Item>
                        <div className="p-2 hover:bg-white/10 dark:hover:bg-gray-800/30 rounded-lg">
                          <p className="text-sm font-medium">Novo edital publicado</p>
                          <p className="text-xs text-gray-500">Há 5 minutos</p>
                        </div>
                      </Menu.Item>
                      {/* Mais notificações aqui */}
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Tema */}
            <button onClick={toggleTheme} className="glass-button p-2 tooltip-wrapper">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="tooltip">Alternar tema</span>
            </button>

            {/* Perfil */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 glass-button px-3 py-2">
                <img
                  src="https://github.com/joaobittencourt.png"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-white/20"
                />
                <div className="text-left">
                  <p className="text-sm font-medium">João Bittencourt</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 glass-effect">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-white/10 dark:bg-gray-800/30' : ''
                          } group flex w-full items-center rounded-lg px-3 py-2 text-sm`}
                        >
                          <User className="mr-2 h-5 w-5" />
                          Meu Perfil
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-white/10 dark:bg-gray-800/30' : ''
                          } group flex w-full items-center rounded-lg px-3 py-2 text-sm`}
                        >
                          <Settings className="mr-2 h-5 w-5" />
                          Configurações
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-white/10 dark:bg-gray-800/30' : ''
                          } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-500`}
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 