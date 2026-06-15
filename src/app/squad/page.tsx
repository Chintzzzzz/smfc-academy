import { getPlayersByYear } from '@/lib/data';
import PlayerTable from '@/components/PlayerTable';

export default function SquadPage() {
  const players = getPlayersByYear(2011);

  const topDuelist = [...players].sort((a, b) => b.successPercent - a.successPercent)[0];
  const mostActive = [...players].sort((a, b) => b.totalDuels - a.totalDuels)[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase font-bold mb-2">
          2011 Cohort · Duels Data
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Squad Overview</h1>
        <p className="text-gray-400">
          Click any player row to expand their match-by-match duel totals. Click column
          headers to sort.
        </p>
      </div>

      {/* Spotlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-900 border border-yellow-400/30 rounded p-5 flex items-center gap-5">
          <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-lg">🏆</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Highest win rate</p>
            <p className="text-white font-bold text-lg">{topDuelist?.name}</p>
            <p className="text-yellow-400 font-black">{topDuelist?.successPercent.toFixed(1)}% success rate</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded p-5 flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-lg">⚡</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Most active</p>
            <p className="text-white font-bold text-lg">{mostActive?.name}</p>
            <p className="text-gray-300 font-black">{mostActive?.totalDuels} total duels</p>
          </div>
        </div>
      </div>
      {/*trial*/}
      {/* Table */}
      <PlayerTable players={players} />

      <p className="text-gray-600 text-xs mt-4">
        MD1–MD8 = match day duel totals · Win % and Avg SR colour-coded: green ≥75%, yellow ≥60%, red below 60%
      </p>
    </div>
  );
}
