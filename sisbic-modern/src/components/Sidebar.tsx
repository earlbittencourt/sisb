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
        className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'} transition-colors duration-200`}
        strokeWidth={active ? 2.5 : 1.5}
        fill={active ? 'currentColor' : 'none'}
      />
    </span>
  );

  // Ícone customizado para Editais (preenchido quando ativo)
  const EditaisIcon = ({ active }: { active: boolean }) => (
    active ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="7" y="8" width="10" height="2" rx="1" fill="#fff" />
        <rect x="7" y="12" width="7" height="2" rx="1" fill="#fff" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="7" y="8" width="10" height="2" rx="1" />
        <rect x="7" y="12" width="7" height="2" rx="1" />
      </svg>
    )
  );

  return (
    <aside className="w-64 bg-primary-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="flex flex-col h-full py-6 pr-6">
        {/* ===== SEÇÃO SUPERIOR - IDENTIDADE ===== */}
        <div className="flex-shrink-0 pb-3 border-b border-gray-200 dark:border-gray-800 pl-6 flex items-center h-[120px]">
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
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">SISBIC</h1>
              <p className="text-sm text-gray-700 dark:text-gray-100 leading-tight">Sistema de Bolsas de Iniciação Científica</p>
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
                    className={`group block transition-colors duration-150 ${active ? 'font-bold bg-transparent' : 'font-normal'}`}
                    style={{ position: 'relative' }}
                  >
                    <div className="relative flex items-center gap-3 py-2 pr-4 rounded-lg text-sm transition-colors duration-150">
                      {/* Fundo do hover, agora em todos os itens */}
                      <span className="pointer-events-none absolute inset-y-0 left-0 ml-6 right-0 rounded-lg bg-primary-100 dark:bg-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />
                      {/* Faixa vertical do item ativo */}
                      {active && (
                        <span
                          className="absolute left-0 top-0 h-full w-[3px] rounded-r-full"
                          style={{ background: 'var(--tw-color-primary, #3b82f6)', zIndex: 1 }}
                        />
                      )}
                      <div className="flex items-center gap-3 ml-8 relative z-10">
                        <item.icon 
                          className={`w-5 h-5 transition-colors duration-200 ${active ? 'text-primary' : 'text-gray-400'} group-hover:text-primary`}
                          {...(active ? { color: '#3b82f6', strokeWidth: 2.5 } : { strokeWidth: 1.5 })}
                        />
                        <span 
                          className={`z-10 transition-colors duration-200 font-bold text-sm group-hover:text-primary`}
                          style={active ? { color: 'var(--tw-color-primary, #3b82f6)' } : { color: '' }}
                        >
                          {item.label}
                        </span>
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
                <button className="flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white hover:bg-white/20 w-full py-3 font-semibold transition-all duration-150">
                  <Plus className="w-5 h-5" />
                  {primaryAction.label}
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* ===== RODAPÉ COESO ===== */}
        <div className="flex-shrink-0 pt-6 border-t border-gray-200 dark:border-gray-800 ml-6">
          <div className="flex items-center justify-between">
            {/* Perfil do Usuário à Esquerda */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500 dark:text-primary-200" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">João Silva</p>
                <p className="text-sm text-gray-700 dark:text-gray-100">Administrador</p>
              </div>
            </div>
            {/* Ícones de Ação à Direita */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-primary transition-colors" onClick={toggleTheme} title={isDarkMode ? "Modo claro" : "Modo escuro"}>
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