import { getPlayerSeasons, computeSquadAverages } from '@/lib/data';
import PlayerTable from '@/components/PlayerTable';
import SquadStats from '@/components/SquadStats';

export default function SquadPage() {
  const players = getPlayerSeasons('duels_2011.csv');
  const squadAvg = computeSquadAverages(players);

  const allMDs = Array.from(
    new Set(players.flatMap((p) => p.matchDays.map((r) => r.md)))
  ).sort((a, b) => a - b);

  const playedPlayers = players.filter((p) => p.played);
  const topRated = [...playedPlayers].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  const mostActive = [...playedPlayers].sort((a, b) => b.totalDuels - a.totalDuels)[0];

  return (
    <div>
      <div className="mb-10">
        <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase font-bold mb-2">
          2011 Cohort · Duels Data
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Squad Overview</h1>
        <p className="text-gray-400">
          Click any player row to expand their match-by-match breakdown. Click column
          headers to sort. Grades (A/B/C) are calculated against the squad average.
        </p>
      </div>

      <SquadStats squadAvg={squadAvg} playerCount={playedPlayers.length} allMDs={allMDs} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-900 border border-yellow-400/30 rounded p-5 flex items-center gap-5">
          <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-lg">🏆</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Top rated</p>
            <p className="text-white font-bold text-lg">{topRated?.player}</p>
            <p className="text-yellow-400 font-black">Rating: {topRated?.rating} / 3</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded p-5 flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-lg">⚡</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Most active</p>
            <p className="text-white font-bold text-lg">{mostActive?.player}</p>
            <p className="text-gray-300 font-black">{mostActive?.totalDuels} total duels</p>
          </div>
        </div>
      </div>

      <PlayerTable players={players} allMDs={allMDs} />

      <p className="text-gray-600 text-xs mt-4 leading-relaxed">
        SR = Individual Avg% SR across played match days · p/g = duels per game · p/m = duels per minute ·
        p/90 = duels per 90 minutes. Grade A = at or above squad average, B = below, C = SR under 50%.
        Rating = number of A grades earned (0–3). Greyed rows did not play any minutes this period.
      </p>
    </div>
  );
}
