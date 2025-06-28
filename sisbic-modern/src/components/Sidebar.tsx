import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, Users, BookOpen, Plus, Bell, Moon, Sun, LogOut } from 'lucide-react';
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
    <aside className="w-64 bg-institutional-dark dark:bg-slate-900 border-r border-neutral-800 flex flex-col p-6">
      <div className="flex h-full flex-col">
        {/* ===== SEÇÃO SUPERIOR - IDENTIDADE ===== */}
        <div className="flex-shrink-0 pb-3 border-b border-neutral-700/50">
          {/* Logo UFBA e Nome do Sistema em duas colunas */}
          <div className="flex items-center gap-4">
            {/* Logo UFBA */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo-branco-ufba.png"
                alt="Logo UFBA"
                className="h-32 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            {/* Título da Aplicação */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white leading-tight">SISBIC</h1>
              <p className="text-sm text-slate-300 leading-tight">Sistema de Bolsas de Iniciação Científica</p>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO INTERMEDIÁRIA - NAVEGAÇÃO PRINCIPAL ===== */}
        <div className="flex flex-1 flex-col py-6">
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7 mb-8">
              <li>
                <ul className="-mx-2 space-y-1">
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
              </li>
            </ul>
          </nav>

          {/* ===== SEÇÃO DE AÇÃO PRIMÁRIA ===== */}
          {primaryAction && (
            <div>
              <Link to={primaryAction.path}>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white hover:bg-white/20 w-full py-3 font-semibold transition-all duration-150">
                  <Plus className="w-5 h-5" />
                  {primaryAction.label}
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* ===== RODAPÉ COESO ===== */}
        <div className="mt-auto pt-6 border-t border-neutral-700/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Perfil do Usuário à Esquerda */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">JS</span>
                <div>
                  <p className="font-semibold text-white">João Silva</p>
                  <p className="text-xs text-slate-300">Administrador</p>
                </div>
              </div>
              {/* Ícones de Ação à Direita */}
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
                <button className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors" onClick={toggleTheme} title={isDarkMode ? "Modo claro" : "Modo escuro"}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 