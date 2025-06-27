import React, { useState } from 'react';
import { Bell, Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '../../lib/utils';
import Logo from './Logo';

interface TopBarProps {
  userName?: string;
  userRole?: string;
  userInitials?: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  userName = 'João Silva',
  userRole = 'Administrador',
  userInitials = 'JS',
  onThemeToggle,
  isDarkMode = false,
  className = ''
}) => {
  const [notifications] = useState(3);

  return (
    <header className={cn(
      'sticky top-0 z-40 h-14 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-subtle',
      className
    )}>
      <div className="h-full flex items-center justify-between px-6">
        {/* Logo/Brand */}
        <span className="font-semibold text-xl text-neutral-900 dark:text-neutral-100 tracking-tight">SISBIC</span>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:ring-1 hover:ring-neutral-200 dark:hover:ring-neutral-600 transition-all duration-150 group relative">
              <Bell className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-all duration-150 group-hover:scale-105" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm animate-pulse">
                  {notifications}
                </span>
              )}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-150" />
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
                <Menu.Items className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 shadow-subtle-lg rounded-lg overflow-hidden z-50 border border-neutral-200 dark:border-neutral-700">
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                      Nenhuma notificação no momento
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:ring-1 hover:ring-neutral-200 dark:hover:ring-neutral-600 transition-all duration-150 group relative"
              title={isDarkMode ? "Modo claro" : "Modo escuro"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-all duration-150 group-hover:scale-105" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-all duration-150 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-150" />
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:ring-1 hover:ring-neutral-200 dark:hover:ring-neutral-600 transition-all duration-150 group">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-xs">{userInitials}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{userName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{userRole}</p>
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-150" />
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
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 shadow-subtle-lg rounded-lg overflow-hidden z-50 border border-neutral-200 dark:border-neutral-700">
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{userName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{userRole}</p>
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
                          <LogOut className="w-4 h-4 mr-3" />
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
      </header>
    );
};

export default TopBar; 