import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, Users, BookOpen, Plus, Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
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

  // Componente para ícones bicolores (exemplo para Home)
  type SidebarIconProps = { icon: React.ElementType; active: boolean };
  const SidebarIcon = ({ icon: Icon, active }: SidebarIconProps) => (
    <span className="relative w-5 h-5 flex items-center justify-center">
      {/* Simulação bicolor: outline + preenchido */}
      <Icon
        className={`w-5 h-5 ${active ? 'text-brand-primary dark:text-brand-primary-dark' : 'text-content-secondary dark:text-content-secondary-dark'} transition-colors duration-200`}
        strokeWidth={active ? 2.5 : 1.5}
        fill={active ? 'currentColor' : 'none'}
      />
    </span>
  );

  // Ícone customizado para Editais (preenchido quando ativo)
  const EditaisIcon = ({ active }: { active: boolean }) => (
    active ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-brand-primary dark:text-brand-primary-dark" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="7" y="8" width="10" height="2" rx="1" fill="currentColor" className="text-surface-1 dark:text-surface-dark-1" />
        <rect x="7" y="12" width="7" height="2" rx="1" fill="currentColor" className="text-surface-1 dark:text-surface-dark-1" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-content-secondary dark:text-content-secondary-dark" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="7" y="8" width="10" height="2" rx="1" />
        <rect x="7" y="12" width="7" height="2" rx="1" />
      </svg>
    )
  );

  return (
    <aside className="w-64 bg-surface-0 dark:bg-surface-dark-0 border-r border-border-color dark:border-border-dark flex flex-col h-screen">
      <div className="flex flex-col h-full py-6 pr-6">
        {/* ===== SEÇÃO SUPERIOR - IDENTIDADE ===== */}
        <div className="flex-shrink-0 pb-3 border-b border-border-color dark:border-border-dark pl-6 flex items-center h-[120px]">
          {/* Logo UFBA e Nome do Sistema em duas colunas */}
          <div className="flex items-center gap-4 mx-auto">
            {/* Logo UFBA */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo UFBA"
                className="h-[104px] w-auto hidden dark:block"
                style={{ objectFit: 'contain' }}
              />
              <img
                src="/logo-branco-ufba.png"
                alt="Logo UFBA"
                className="h-[104px] w-auto block dark:hidden"
                style={{ objectFit: 'contain' }}
              />
            </Link>
            {/* Título da Aplicação */}
            <div className="flex flex-col">
              <h1 className="text-xl text-content-main dark:text-content-main-dark leading-tight">SISBIC</h1>
              <p className="text-sm text-content-secondary dark:text-content-secondary-dark leading-tight">Sistema de Bolsas de Iniciação Científica</p>
            </div>
          </div>
        </div>

        {/* ===== SEÇÃO INTERMEDIÁRIA - NAVEGAÇÃO PRINCIPAL ===== */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`group block transition-colors duration-150 ${active ? 'font-semibold' : 'font-normal'}`}
                    style={{ position: 'relative' }}
                  >
                    <div className={`relative flex items-center gap-3 py-2 pr-4 rounded-lg text-sm transition-colors duration-150
                      ${active ? 'text-brand-primary dark:text-brand-primary-dark' : 'text-content-secondary hover:text-brand-primary dark:text-content-secondary-dark dark:hover:text-brand-primary-dark'}`}>
                      {/* Fundo sutil para hover e estado ativo */}
                      <span className={`pointer-events-none absolute inset-y-0 left-0 ml-6 right-0 rounded-lg 
                        ${active ? 'bg-surface-1 dark:bg-surface-dark-1' : 'bg-surface-1 dark:bg-surface-dark-1 opacity-0 group-hover:opacity-100'} 
                        transition-opacity duration-150 z-0`} />
                      
                      {/* Indicador lateral de item ativo */}
                      {active && <div className="absolute inset-y-0 left-0 w-0.5 bg-brand-primary dark:bg-brand-primary-dark rounded-r-full"></div>}
                      
                      {/* Conteúdo do item */}
                      <div className="flex items-center gap-3 ml-8 relative z-10">
                        <item.icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
                        <span>{item.label}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ===== SEÇÃO DE AÇÃO PRIMÁRIA ===== */}
          {primaryAction && (
            <div className="mt-6">
              <Link to={primaryAction.path}>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 dark:bg-brand-primary-dark/10 dark:text-brand-primary-dark dark:hover:bg-brand-primary-dark/20 w-full py-3 font-semibold transition-all duration-150">
                  <Plus className="w-5 h-5" />
                  {primaryAction.label}
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* ===== RODAPÉ COESO ===== */}
        <div className="flex-shrink-0 pt-6 border-t border-border-color dark:border-border-dark ml-6">
          <div className="flex items-center justify-between">
            {/* Perfil do Usuário à Esquerda */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-1 dark:bg-surface-dark-1 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
              </div>
              <div>
                <p className="font-semibold text-content-main dark:text-content-main-dark">João Silva</p>
                <p className="text-sm text-content-secondary dark:text-content-secondary-dark">Administrador</p>
              </div>
            </div>
            {/* Ícones de Ação à Direita */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md text-content-secondary hover:bg-surface-1 hover:text-brand-primary dark:text-content-secondary-dark dark:hover:bg-surface-dark-1 dark:hover:text-brand-primary-dark transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-md text-content-secondary hover:bg-surface-1 hover:text-brand-primary dark:text-content-secondary-dark dark:hover:bg-surface-dark-1 dark:hover:text-brand-primary-dark transition-colors" 
                onClick={toggleTheme} 
                title={isDarkMode ? "Modo claro" : "Modo escuro"}
              >
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