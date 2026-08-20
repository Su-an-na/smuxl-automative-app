import React, { useState } from 'react';
import { 
  TabType, 
  Vehicle, 
  DiagnosticAlert, 
  ServiceRecord, 
  ShopPart, 
  CartItem, 
  DeviceMode 
} from './types';
import { 
  VEHICLES, 
  DIAGNOSTIC_ALERTS, 
  SERVICE_RECORDS, 
  SHOP_PARTS 
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { PassportScreen } from './components/PassportScreen';
import { ShopScreen } from './components/ShopScreen';
import { DiagnosticsScreen } from './components/DiagnosticsScreen';
import { FullScanModal } from './components/FullScanModal';
import { CartDrawer } from './components/CartDrawer';
import { AlertDetailModal } from './components/AlertDetailModal';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(VEHICLES[0]);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');

  // Diagnostic Alerts State
  const [alerts, setAlerts] = useState<DiagnosticAlert[]>(DIAGNOSTIC_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<DiagnosticAlert | null>(null);

  // Service History State
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(SERVICE_RECORDS);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { part: SHOP_PARTS[0], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals State
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (part: ShopPart) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(partId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.part.id === partId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (partId: string) => {
    setCartItems((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleClearAlerts = () => {
    setAlerts([]);
    setSelectedVehicle((prev) => ({
      ...prev,
      healthScore: 100,
      healthStatus: 'OPTIMAL',
      sysStatus: 'SYS OK',
    }));
  };

  const handleScanComplete = () => {
    setSelectedVehicle((prev) => ({
      ...prev,
      healthScore: 98,
      healthStatus: 'OPTIMAL',
      sysStatus: 'SYS OK',
    }));
  };

  const handleAddServiceRecord = (record: ServiceRecord) => {
    setServiceRecords((prev) => [record, ...prev]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Responsive device frame wrapper logic
  const getDeviceFrameClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[420px] mx-auto my-4 rounded-[36px] border-[10px] border-[#282a2d] shadow-2xl overflow-hidden min-h-[840px]';
      case 'tablet':
        return 'max-w-[768px] mx-auto my-6 rounded-[28px] border-[12px] border-[#282a2d] shadow-2xl overflow-hidden min-h-[960px]';
      case 'desktop':
        return 'max-w-6xl mx-auto';
      default:
        return 'w-full max-w-7xl mx-auto';
    }
  };

  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] flex flex-col font-sans selection:bg-[#4b8eff]/30 selection:text-[#adc6ff]">
      {/* Dynamic Device Container */}
      <div className={`flex flex-col flex-grow relative transition-all duration-300 ${getDeviceFrameClass()}`}>
        {/* Top App Bar */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
          unreadAlertsCount={alerts.length}
          deviceMode={deviceMode}
          onChangeDeviceMode={setDeviceMode}
        />

        {/* Main Content Area */}
        <main className="flex-grow px-4 sm:px-6 md:px-8 py-5 md:py-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {currentTab === 'home' && (
            <HomeScreen
              vehicle={selectedVehicle}
              alerts={alerts}
              onRunScan={() => setIsScanModalOpen(true)}
              onNavigateTab={setCurrentTab}
              onSelectAlert={setSelectedAlert}
            />
          )}

          {currentTab === 'passport' && (
            <PassportScreen
              vehicle={selectedVehicle}
              serviceRecords={serviceRecords}
              onAddServiceRecord={handleAddServiceRecord}
            />
          )}

          {currentTab === 'shop' && (
            <ShopScreen
              parts={SHOP_PARTS}
              currentVehicle={selectedVehicle}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            />
          )}

          {currentTab === 'diagnostics' && (
            <DiagnosticsScreen
              vehicle={selectedVehicle}
              alerts={alerts}
              onRunScan={() => setIsScanModalOpen(true)}
              onClearAlerts={handleClearAlerts}
              onSelectAlert={setSelectedAlert}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation (Mobile & Tablet) */}
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          cartCount={totalCartCount}
        />
      </div>

      {/* Interactive Modals */}
      <FullScanModal
        vehicle={selectedVehicle}
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        vehicle={selectedVehicle}
      />

      <AlertDetailModal
        alert={selectedAlert}
        vehicle={selectedVehicle}
        onClose={() => setSelectedAlert(null)}
        onNavigateToShop={() => setCurrentTab('shop')}
      />

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
