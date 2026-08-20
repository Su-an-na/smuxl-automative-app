import React, { useState } from 'react';
import { CartItem, Vehicle } from '../types';
import { ShoppingCart, X, Trash2, Plus, Minus, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onRemoveItem: (partId: string) => void;
  onClearCart: () => void;
  vehicle: Vehicle;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  vehicle,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.part.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const shipping = subtotal > 200 ? 0 : items.length > 0 ? 18.00 : 0;
  const estimatedTax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + shipping + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AUTOCORE15' || promoCode.trim().toUpperCase() === 'RS6' || promoCode.trim().toUpperCase() === '720S') {
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4b8eff', '#00dbe9', '#adc6ff'],
        });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in flex justify-end">
      <div className="w-full max-w-md bg-[#1e2023] border-l border-[#414755] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-[#282a2d] border-b border-[#414755] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-[#4b8eff]" />
            <h3 className="text-base font-bold text-[#e2e2e6]">
              Parts & Component Cart
            </h3>
            <span className="bg-[#4b8eff]/20 text-[#adc6ff] text-xs font-mono font-bold px-2 py-0.5 rounded">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8b90a0] hover:text-[#e2e2e6] hover:bg-[#333538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 flex-grow flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00a0aa]/20 border border-[#00dbe9] flex items-center justify-center text-[#00dbe9] shadow-lg glow-tertiary">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#e2e2e6]">
              OEM Dispatch Confirmed!
            </h4>
            <p className="text-xs text-[#c1c6d7] leading-relaxed">
              Your high-performance order has been assigned tracking ID{' '}
              <span className="font-mono text-[#adc6ff]">#AC-{Math.floor(100000 + Math.random() * 900000)}</span>.
              Fitment verified for {vehicle.name}.
            </p>
            <div className="bg-[#14171a] p-3 rounded-lg border border-[#2E3238] w-full text-left text-xs font-mono text-[#8b90a0] flex flex-col gap-1">
              <div>Estimated Delivery: 2 Business Days via Express Freight</div>
              <div>Warranty: Autocore 24-Month Precision Guarantee</div>
            </div>
            <button
              onClick={() => {
                onClearCart();
                setOrderSuccess(false);
                onClose();
              }}
              className="mt-4 w-full py-3 bg-[#4b8eff] text-[#00285c] rounded-lg font-bold text-xs uppercase font-mono hover:bg-[#adc6ff] transition-colors"
            >
              Back to Garage
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#282a2d] flex items-center justify-center text-[#8b90a0]">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="text-base font-semibold text-[#e2e2e6]">Your cart is empty</div>
            <p className="text-xs text-[#8b90a0]">
              Browse verified OEM and performance upgrades in the Autocore Shop.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg bg-[#282a2d] border border-[#414755] text-xs font-bold font-mono text-[#adc6ff] hover:bg-[#333538]"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
              {items.map(({ part, quantity }) => (
                <div
                  key={part.id}
                  className="bg-[#14171a] border border-[#2E3238] rounded-xl p-3 flex gap-3 items-center"
                >
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#1e2023] flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-semibold text-[#e2e2e6] truncate">
                      {part.name}
                    </h4>
                    <div className="text-[11px] font-mono text-[#8b90a0]">
                      OEM: {part.oemCode}
                    </div>
                    <div className="text-xs font-mono font-bold text-[#adc6ff] mt-1">
                      ${part.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onRemoveItem(part.id)}
                      className="text-[#8b90a0] hover:text-[#ffb4ab] p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-[#1e2023] border border-[#414755] rounded-md px-1 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(part.id, quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#8b90a0] hover:text-[#e2e2e6]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-[#e2e2e6] w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(part.id, quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#8b90a0] hover:text-[#e2e2e6]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="p-4 border-t border-[#2E3238] bg-[#1a1c1f]">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo (try AUTOCORE15)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow bg-[#111316] border border-[#414755] rounded-lg px-3 py-1.5 text-xs text-[#e2e2e6] uppercase font-mono focus:border-[#4b8eff] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#282a2d] border border-[#414755] rounded-lg text-xs font-mono font-bold text-[#adc6ff] hover:bg-[#333538]"
                >
                  Apply
                </button>
              </form>
              {promoApplied && (
                <div className="text-[11px] font-mono text-[#00dbe9] mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 15% VIP Garage Discount Applied
                </div>
              )}
            </div>

            {/* Summary & Checkout */}
            <div className="p-4 bg-[#282a2d] border-t border-[#414755] flex flex-col gap-2.5">
              <div className="flex justify-between text-xs text-[#c1c6d7]">
                <span>Subtotal</span>
                <span className="font-mono text-[#e2e2e6]">${subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-xs text-[#00dbe9]">
                  <span>VIP Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#c1c6d7]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#8b90a0]" /> Express Freight
                </span>
                <span className="font-mono text-[#e2e2e6]">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#c1c6d7]">
                <span>Estimated Sales Tax</span>
                <span className="font-mono text-[#e2e2e6]">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#e2e2e6] border-t border-[#414755] pt-2 mt-1">
                <span>Total</span>
                <span className="font-mono text-base text-[#adc6ff]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-2 w-full h-11 bg-[#4b8eff] text-[#00285c] rounded-lg font-bold text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2 hover:bg-[#adc6ff] transition-all glow-active disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing Secure CAN Checkout...</span>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
