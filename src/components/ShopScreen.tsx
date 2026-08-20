import React, { useState, useMemo } from 'react';
import { ShopPart, Vehicle } from '../types';
import { 
  Search, 
  Car, 
  ShoppingCart, 
  Check, 
  AlertCircle, 
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface ShopScreenProps {
  parts: ShopPart[];
  currentVehicle: Vehicle;
  onAddToCart: (part: ShopPart) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  parts,
  currentVehicle,
  onAddToCart,
  onOpenCart,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Parts');
  const [fitmentOnly, setFitmentOnly] = useState(true);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const categories = ['All Parts', 'Engine', 'Braking', 'Suspension', 'Fluids', 'Exhaust', 'Electrical'];

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // Fitment filter
      if (fitmentOnly) {
        const matchesFitment = part.compatibleModels.some(
          (m) =>
            m.toLowerCase().includes(currentVehicle.name.toLowerCase()) ||
            m.toLowerCase().includes(currentVehicle.model.toLowerCase()) ||
            currentVehicle.name.toLowerCase().includes(m.toLowerCase())
        );
        if (!matchesFitment) return false;
      }

      // Category filter
      if (selectedCategory !== 'All Parts' && part.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = part.name.toLowerCase().includes(query);
        const matchOem = part.oemCode.toLowerCase().includes(query);
        const matchDesc = part.description.toLowerCase().includes(query);
        return matchName || matchOem || matchDesc;
      }

      return true;
    });
  }, [parts, currentVehicle, fitmentOnly, selectedCategory, searchQuery]);

  const handleAdd = (part: ShopPart) => {
    onAddToCart(part);
    setQuickAddedId(part.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Search & Filter Area */}
      <section className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b90a0]" />
          <input
            id="shop-search-input"
            type="text"
            placeholder="Search parts by OEM or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1c1f] border border-[#414755] rounded-lg py-2.5 pl-11 pr-4 text-sm text-[#e2e2e6] placeholder:text-[#8b90a0] focus:outline-none focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff] transition-colors h-11"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8b90a0] hover:text-[#e2e2e6]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Fitment Toggle Box */}
        <div className="flex items-center justify-between bg-[#282a2d] rounded-lg p-3 border border-[#414755] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#4b8eff]/20 flex items-center justify-center text-[#adc6ff] flex-shrink-0">
              <Car className="w-4 h-4 text-[#4b8eff]" />
            </div>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-semibold text-[#e2e2e6] block truncate">
                Fitment Verified: {currentVehicle.name}
              </span>
              <span className="text-[10px] text-[#8b90a0] font-mono">
                {currentVehicle.trim} • VIN *{currentVehicle.vin.slice(-4)}
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-3">
            <input
              id="fitment-verified-toggle"
              type="checkbox"
              checked={fitmentOnly}
              onChange={(e) => setFitmentOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-[#333538] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e2e2e6] after:border-[#2E3238] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4b8eff]"></div>
          </label>
        </div>
      </section>

      {/* Categories Horizontal Scroll Pills */}
      <section className="-mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider font-mono whitespace-nowrap h-9 flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#4b8eff] text-[#00285c] shadow-md'
                    : 'bg-[#282a2d] text-[#c1c6d7] hover:text-[#e2e2e6] hover:bg-[#333538] border border-[#414755]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Components Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#414755] pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#e2e2e6] tracking-tight">
              Featured Components
            </h2>
            <span className="text-xs font-mono text-[#8b90a0]">
              ({filteredParts.length} available)
            </span>
          </div>

          {/* Cart Quick Button */}
          {cartCount > 0 && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#4b8eff]/20 text-[#adc6ff] border border-[#4b8eff]/40 rounded-full text-xs font-mono font-bold hover:bg-[#4b8eff] hover:text-[#00285c] transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart ({cartCount})</span>
            </button>
          )}
        </div>

        {filteredParts.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-xl flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-[#8b90a0]" />
            <div className="text-sm font-semibold text-[#e2e2e6]">No components found</div>
            <p className="text-xs text-[#8b90a0]">
              Try turning off "Fitment Verified" or selecting "All Parts".
            </p>
            <button
              onClick={() => {
                setFitmentOnly(false);
                setSelectedCategory('All Parts');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-[#4b8eff] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredParts.map((part, index) => {
              const isFirstBento = index === 0;
              const isAdded = quickAddedId === part.id;

              return (
                <div
                  key={part.id}
                  className={`glass-panel rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-[#4b8eff]/60 group ${
                    isFirstBento ? 'sm:col-span-2 md:col-span-2' : ''
                  }`}
                >
                  {/* Part Image Box */}
                  <div
                    className={`bg-[#1e2023] relative flex items-center justify-center overflow-hidden ${
                      isFirstBento ? 'h-48 sm:h-52' : 'h-36 sm:h-40'
                    }`}
                  >
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {/* Stock Alert Badge */}
                    {part.lowStock && (
                      <div className="absolute top-2.5 left-2.5 bg-[#93000a]/90 border border-[#ffb4ab]/40 text-[#ffb4ab] text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow">
                        LOW STOCK ({part.stockCount} LEFT)
                      </div>
                    )}

                    {/* Category tag */}
                    <div className="absolute top-2.5 right-2.5 bg-[#111316]/80 backdrop-blur border border-[#414755] text-[#c1c6d7] text-[10px] font-mono px-2 py-0.5 rounded">
                      {part.category}
                    </div>
                  </div>

                  {/* Part Info */}
                  <div className="p-3.5 flex flex-col justify-between flex-grow gap-2.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-[#e2e2e6] leading-tight group-hover:text-[#adc6ff] transition-colors">
                            {part.name}
                          </h3>
                          <p className="text-xs font-mono text-[#8b90a0] mt-0.5">
                            OEM: {part.oemCode}
                          </p>
                        </div>
                        <span className="text-base sm:text-lg font-bold font-mono text-[#adc6ff] whitespace-nowrap">
                          ${part.price.toFixed(2)}
                        </span>
                      </div>

                      {isFirstBento && (
                        <p className="text-xs text-[#c1c6d7] mt-2 line-clamp-2 leading-relaxed">
                          {part.description}
                        </p>
                      )}
                    </div>

                    {/* Add to Cart / Quick Add Button */}
                    <button
                      onClick={() => handleAdd(part)}
                      className={`w-full rounded-lg h-10 flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase transition-all duration-200 active:scale-95 ${
                        isAdded
                          ? 'bg-[#00dbe9] text-[#00363a]'
                          : isFirstBento
                          ? 'bg-[#4b8eff] text-[#00285c] hover:bg-[#adc6ff] glow-active'
                          : 'bg-[#282a2d] border border-[#414755] text-[#e2e2e6] hover:bg-[#333538] hover:border-[#4b8eff]/40'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          {isFirstBento ? 'Add to Cart' : 'Quick Add'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
