import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Plus, Minus, CreditCard, RotateCw, CheckCircle2 } from 'lucide-react';

interface ConcessionsPanelProps {
  foodCategory: string;
  setFoodCategory: (val: any) => void;
  cart: { [key: string]: number };
  modifyCart: (id: string, val: number) => void;
  getCartTotal: () => number;
  orderStatus: "none" | "paying" | "preparing" | "ready";
  orderId: string;
  foodItems: any[];
  t: any;
  handleFoodCheckout: () => void;
}

export const ConcessionsPanel: React.FC<ConcessionsPanelProps> = ({
  foodCategory,
  setFoodCategory,
  cart,
  modifyCart,
  getCartTotal,
  orderStatus,
  orderId,
  foodItems,
  t,
  handleFoodCheckout
}) => {
  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[9px] font-mono text-neon-blue-400 uppercase tracking-widest block font-bold">
            🍔 GASTRONOMY HUB
          </span>
          <h3 className="font-display font-bold text-xl text-white mt-1">{t.foodTitle}</h3>
        </div>
        <Utensils className="w-5 h-5 text-void-500" />
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'halal', 'vegan', 'drinks'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFoodCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              foodCategory === cat 
                ? 'bg-neon-blue-500 text-white shadow-neon-glow-blue' 
                : 'bg-void-900 text-void-500 hover:text-void-300 border border-void-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 mb-6">
        {foodItems.filter(f => foodCategory === 'all' || f.tag === foodCategory).map((item) => (
          <div key={item.id} className="p-3 bg-void-900 border border-void-700/50 rounded-xl flex items-center justify-between group hover:border-neon-blue-500/30 transition-all">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white group-hover:text-neon-blue-400 transition-colors">{item.name}</span>
              <span className="text-[10px] text-void-500 mt-0.5">{item.desc}</span>
              <span className="text-[11px] text-neon-cyan-400 font-mono font-bold mt-1">${item.price.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => modifyCart(item.id, -1)} className="p-1.5 rounded-lg bg-void-800 text-void-400 hover:text-white transition-all">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold font-mono text-white w-4 text-center">{cart[item.id] || 0}</span>
              <button onClick={() => modifyCart(item.id, 1)} className="p-1.5 rounded-lg bg-neon-blue-500/20 text-neon-blue-400 hover:bg-neon-blue-500/30 transition-all">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-void-600/10 pt-6 space-y-4">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs text-void-400 font-mono uppercase">Subtotal Estimated</span>
          <span className="text-lg font-display font-black text-white tracking-tighter">${getCartTotal().toFixed(2)}</span>
        </div>

        {orderStatus === 'none' ? (
          <button
            onClick={handleFoodCheckout}
            disabled={getCartTotal() === 0}
            className="w-full py-4 bg-neon-blue-500 hover:bg-neon-blue-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-neon-glow-blue flex items-center justify-center gap-2 disabled:opacity-30 disabled:shadow-none"
          >
            <CreditCard className="w-4 h-4" />
            {t.orderFood}
          </button>
        ) : (
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            orderStatus === 'ready' 
              ? 'bg-state-success-bg/10 border-state-success-text/20 text-state-success-text' 
              : 'bg-void-900 border-neon-blue-500/20 text-void-300'
          }`}>
            {orderStatus === 'paying' || orderStatus === 'preparing' ? (
              <RotateCw className="w-5 h-5 animate-spin text-neon-blue-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-state-success-text" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Order {orderId}</span>
              <span className="text-xs font-bold uppercase tracking-tight">
                {orderStatus === 'paying' ? 'Decrypting Payment...' : orderStatus === 'preparing' ? 'Crafting in Concourse B' : 'Ready at Sector B!'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
