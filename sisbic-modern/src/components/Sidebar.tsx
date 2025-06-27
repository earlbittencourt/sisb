import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, Users, BookOpen, User } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Logo from './ui/Logo';
import NavItem from './ui/NavItem';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Editais', path: '/editais' },
    { icon: BookOpen, label: 'Programas', path: '/programas' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
    { icon: Users, label: 'Usuários', path: '/usuarios' },
  ];

  return (
    <aside className="w-64 bg-primary-darker dark:bg-slate-900 border-r border-neutral-800 flex flex-col">
      <div className="p-6">
        <div className="mb-8 flex items-center justify-center">
          <Logo size="xl" showText={false} />
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                />
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-all duration-150 group border border-neutral-700">
            <User className="w-4 h-4 text-neutral-300" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-neutral-800 shadow-subtle-lg rounded-lg overflow-hidden z-50 border border-neutral-200 dark:border-neutral-700">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">João Bittencourt</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Administrador</p>
              </div>
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150`}
                    >
                      <User className="w-4 h-4 mr-3 text-neutral-500" />
                      Perfil
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150`}
                    >
                      <Settings className="w-4 h-4 mr-3 text-neutral-500" />
                      Configurações
                    </button>
                  )}
                </Menu.Item>
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-2" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-red-50 dark:bg-red-500/10' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 transition-colors duration-150`}
                    >
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar; 