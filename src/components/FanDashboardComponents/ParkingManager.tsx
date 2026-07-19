import React from 'react';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';

interface ParkingManagerProps {
  isParkingReserved: boolean;
  selectedLot: string;
  setSelectedLot: (val: string) => void;
  parkingSpacesLeft: { [key: string]: number };
  handleReserveParking: () => void;
  t: any;
}

export const ParkingManager: React.FC<ParkingManagerProps> = ({
  isParkingReserved,
  selectedLot,
  setSelectedLot,
  parkingSpacesLeft,
  handleReserveParking,
  t
}) => {
  return (
    <div className="bg-void-850 border border-void-600/30 rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div>
          <span className="text-[9px] font-mono text-neon-purple-400 uppercase tracking-widest block font-bold">
            🚗 TRANSPORT MATRIX
          </span>
          <h3 className="font-display font-bold text-lg text-white mt-1">{t.parkingTitle}</h3>
        </div>

        {isParkingReserved ? (
          <div className="bg-state-success-bg/10 border border-state-success-text/20 p-5 rounded-2xl flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-state-success-text" />
            <div>
              <h4 className="text-white font-bold text-sm">{t.parkingPassTitle}</h4>
              <p className="text-[10px] text-void-400 font-mono mt-1">Confirmed for {selectedLot}</p>
            </div>
            <div className="w-full bg-white p-3 rounded-xl">
              <div className="w-full h-12 bg-repeat-x bg-[linear-gradient(to_right,#000_1px,transparent_1px,#000_3px,transparent_3px)] opacity-80" />
            </div>
            <button className="text-[10px] text-neon-cyan-400 font-bold uppercase tracking-widest hover:underline">
              View Directions
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {(['Lot A', 'Lot B', 'Lot C'] as const).map((lot) => (
                <button
                  key={lot}
                  onClick={() => setSelectedLot(lot)}
                  className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedLot === lot 
                      ? 'bg-neon-purple-500/10 border-neon-purple-500' 
                      : 'bg-void-900 border-void-600/15 hover:border-void-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedLot === lot ? 'bg-neon-purple-500/20 text-neon-purple-400' : 'bg-void-800 text-void-500'}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className={`text-xs font-bold block ${selectedLot === lot ? 'text-white' : 'text-void-400'}`}>{lot}</span>
                      <span className="text-[9px] text-void-500 font-mono">Premium West Wing</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${parkingSpacesLeft[lot] < 5 ? 'text-state-danger-text' : 'text-void-400'}`}>
                    {parkingSpacesLeft[lot]} Left
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleReserveParking}
              className="w-full py-3.5 bg-neon-purple-500 hover:bg-neon-purple-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-neon-glow-purple flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {t.reserveParking}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
