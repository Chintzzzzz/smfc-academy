import { SquadAverages } from '@/types';

interface SquadStatsProps {
  squadAvg: SquadAverages;
  playerCount: number;
  allMDs: number[];
}

export default function SquadStats({ squadAvg, playerCount, allMDs }: SquadStatsProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-6 mb-10">
      <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-4">Squad Averages</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-2xl font-black text-white">{playerCount}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Players</p>
        </div>
        <div>
          <p className="text-2xl font-black text-white">{squadAvg.avgIndividualAvgSR.toFixed(1)}%</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Avg SR</p>
        </div>
        <div>
          <p className="text-2xl font-black text-white">{squadAvg.avgDuelsPerGame.toFixed(2)}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Duels p/g</p>
        </div>
        <div>
          <p className="text-2xl font-black text-white">{squadAvg.avgDuelsPer90.toFixed(2)}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Duels p/90</p>
        </div>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Success % by match day</p>
      <div className="flex gap-2 flex-wrap">
        {allMDs.map((md) => {
          const pct = squadAvg.avgSuccessPctByMD[md] ?? 0;
          const color = pct >= 75 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
          return (
            <div key={md} className="bg-gray-800 rounded px-3 py-2 text-center min-w-[56px]">
              <p className={`font-black tabular-nums ${color}`}>{pct.toFixed(0)}%</p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">MD{md}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
