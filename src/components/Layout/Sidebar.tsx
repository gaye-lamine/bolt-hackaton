import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Users, MessageCircle, BarChart3, X, Crown } from 'lucide-react';
import { PremiumBadge } from '../Premium/PremiumBadge';
import { usePremium } from '../../hooks/usePremium';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home },
  { name: 'Mon profil', href: '/profile', icon: User },
  { name: 'Mes services', href: '/services', icon: Briefcase },
  { name: 'Mes clients', href: '/clients', icon: Users },
  { name: 'Assistant IA', href: '/ai-coach', icon: MessageCircle, premium: true },
  { name: 'Statistiques', href: '/analytics', icon: BarChart3, premium: true },
  { name: 'Premium', href: '/premium', icon: Crown, isPremiumPage: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isPremium } = usePremium();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-600 transform transition-transform duration-300 ease-in-out shadow-strong
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header mobile uniquement */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-600 lg:hidden">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 font-display">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo pour desktop */}
        <div className="hidden lg:flex items-center p-6 border-b border-neutral-200 dark:border-neutral-600">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50 font-display">
            NOMAD AI
          </span>
        </div>

        {/* Premium Status */}
        {isPremium && (
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-600">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center">
                <PremiumBadge size="sm" />
                <span className="ml-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  Compte Premium actif
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const needsPremium = item.premium && !isPremium;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] relative
                  ${isActive 
                    ? item.isPremiumPage 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 shadow-soft'
                      : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }
                  ${needsPremium ? 'opacity-75' : ''}
                `}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive 
                      ? item.isPremiumPage
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                
                {item.isPremiumPage && (
                  <PremiumBadge size="sm" showText={false} />
                )}
                
                {needsPremium && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Premium si pas premium */}
        {!isPremium && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-600">
            <Link to="/premium">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-dashed border-yellow-300 dark:border-yellow-600 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors cursor-pointer">
                <div className="text-center">
                  <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                    Passez à Premium
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-2">
                    Débloquez toutes les fonctionnalités
                  </p>
                  <div className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                      500 CFA/mois
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-600">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center font-medium">
              NOMAD AI v1.0
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-1">
              Votre compagnon entrepreneurial
            </p>
          </div>
        </div>
      </div>
    </>
  );
};