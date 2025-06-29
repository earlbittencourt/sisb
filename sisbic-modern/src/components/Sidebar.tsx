import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, Users, BookOpen, Plus, Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import NavItem from './ui/NavItem';
import Button from './ui/Button';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [notifications] = useState(3);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Editais', path: '/editais' },
    { icon: BookOpen, label: 'Programas', path: '/programas' },
    { icon: Users, label: 'Usuários', path: '/usuarios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  // Determinar ação primária baseada na rota atual
  const getPrimaryAction = () => {
    if (location.pathname === '/') {
      return { label: 'Widget', path: '/widgets/novo' };
    }
    return null;
  };

  const primaryAction = getPrimaryAction();

  return (
    <aside className="w-64 bg-primary-50 dark:bg-gray-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen">
      <div className="flex flex-col h-full p-6">
        {/* ===== SEÇÃO SUPERIOR - IDENTIDADE ===== */}
        <div className="flex-shrink-0 pb-3 border-b border-slate-200 dark:border-slate-800">
          {/* Logo UFBA e Nome do Sistema em duas colunas */}
          <div className="flex items-center gap-4">
            {/* Logo UFBA */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo UFBA"
                className="h-16 w-auto hidden dark:block"
                style={{ objectFit: 'contain' }}
              />
              <img
                src="/logo-branco-ufba.png"
                alt="Logo UFBA"
                className="h-16 w-auto block dark:hidden"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            {/* Título da Aplicação */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white leading-tight">SISBIC</h1>
              <p className="text-sm text-gray-300 leading-tight">Sistema de Bolsas de Iniciação Científica</p>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO INTERMEDIÁRIA - NAVEGAÇÃO PRINCIPAL ===== */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ===== SEÇÃO DE AÇÃO PRIMÁRIA ===== */}
          {primaryAction && (
            <div className="mt-6">
              <Link to={primaryAction.path}>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white hover:bg-white/20 w-full py-3 font-semibold transition-all duration-150">
                  <Plus className="w-5 h-5" />
                  {primaryAction.label}
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* ===== RODAPÉ COESO ===== */}
        <div className="flex-shrink-0 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            {/* Perfil do Usuário à Esquerda */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-200" />
              </div>
              <div>
                <p className="font-semibold text-white">João Silva</p>
                <p className="text-sm text-gray-300">Administrador</p>
              </div>
            </div>
            {/* Ícones de Ação à Direita */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors" onClick={toggleTheme} title={isDarkMode ? "Modo claro" : "Modo escuro"}>
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 