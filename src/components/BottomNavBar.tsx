import React from 'react';
import { TabType } from '../types';
import { Home, Car, ShoppingCart, Wrench } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  cartCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab, cartCount = 0 }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'passport' as TabType, label: 'Passport', icon: Car },
    { id: 'shop' as TabType, label: 'Shop', icon: ShoppingCart, badge: cartCount },
    { id: 'diagnostics' as TabType, label: 'Diagnostics', icon: Wrench },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#1e2023]/95 backdrop-blur-lg border-t border-[#414755] flex justify-around items-center px-2 py-2 safe-pb shadow-2xl md:hidden">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'bg-[#4b8eff] text-[#00285c] rounded-full px-4 py-1 shadow-md'
                : 'text-[#c1c6d7] hover:text-[#adc6ff] px-3 py-1'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-2 bg-[#4b8eff] text-[#00285c] text-[9px] font-bold px-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${isActive ? 'text-[#00285c]' : 'text-[#c1c6d7]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
