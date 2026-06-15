import Link from 'next/link';
import { getPlayersByYear } from '@/lib/data';

export default function HomePage() {
  const players2011 = getPlayersByYear(2011);
  const avgSuccessRate =
    players2011.reduce((sum, p) => sum + p.successPercent, 0) / players2011.length;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-800 pb-16 mb-16">
        <p className="text-yellow-400 text-xs tracking-[0.3em] uppercase font-bold mb-4">
          St Mirren FC · Academy Analytics
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          PLAYER
          <br />
          <span className="text-yellow-400">PERFORMANCE</span>
          <br />
          DATA
        </h1>
        <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
          Tracking duel performance across all match days for the 2011 cohort.
          Click any player to see their match-by-match breakdown.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="bg-gray-900 border border-gray-800 rounded p-6">
          <p className="text-4xl font-black text-yellow-400">{players2011.length}</p>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Players tracked</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded p-6">
          <p className="text-4xl font-black text-white">{avgSuccessRate.toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Avg duel win rate</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded p-6">
          <p className="text-4xl font-black text-white">2011</p>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Birth year cohort</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded p-6">
          <p className="text-4xl font-black text-white">8</p>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Match days</p>
        </div>
      </section>

      {/* CTA */}
      <Link
        href="/squad"
        className="inline-flex items-center gap-3 bg-yellow-400 text-black font-bold px-8 py-4 rounded hover:bg-yellow-300 transition-colors text-sm tracking-wide uppercase"
      >
        View Squad Stats
        <span>→</span>
      </Link>
    </div>
  );
}
