'use client';

import { useState } from 'react';
import { PlayerSeason, SortKey, SortDirection, Grade } from '@/types';

interface PlayerTableProps {
  players: PlayerSeason[];
  allMDs: number[];
}

const columns: { key: SortKey; label: string; tooltip?: string }[] = [
  { key: 'player', label: 'Player' },
  { key: 'primaryPosition', label: 'Pos' },
  { key: 'totalSuccessful', label: 'Won' },
  { key: 'totalUnsuccessful', label: 'Lost' },
  { key: 'totalDuels', label: 'Total' },
  { key: 'individualAvgSR', label: 'Avg SR', tooltip: 'Individual average success rate across played match days' },
  { key: 'duelsPerGame', label: 'p/g', tooltip: 'Duels per game' },
  { key: 'duelsPerMin', label: 'p/m', tooltip: 'Duels per minute' },
  { key: 'duelsPer90', label: 'p/90', tooltip: 'Duels per 90 minutes' },
  { key: 'rating', label: 'Rating', tooltip: 'Number of A grades earned (SR, p/g, p/m)' },
];

function gradeColor(grade: Grade | null): string {
  if (grade === 'A') return 'bg-green-500/20 text-green-400';
  if (grade === 'B') return 'bg-yellow-500/20 text-yellow-400';
  if (grade === 'C') return 'bg-red-500/20 text-red-400';
  return 'bg-gray-800 text-gray-500';
}

function ratingColor(rating: number | null): string {
  if (rating === null) return 'bg-gray-800 text-gray-500';
  if (rating === 3) return 'bg-green-500 text-black';
  if (rating === 2) return 'bg-green-500/40 text-green-300';
  if (rating === 1) return 'bg-yellow-500/30 text-yellow-300';
  return 'bg-red-500/30 text-red-300';
}

function formatNum(val: number | null, decimals = 0): string {
  if (val === null || isNaN(val)) return '—';
  return val.toFixed(decimals);
}

export default function PlayerTable({ players, allMDs }: PlayerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const sorted = [...players].sort((a, b) => {
    const av = a[sortKey] ?? -Infinity;
    const bv = b[sortKey] ?? -Infinity;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function toggleExpand(name: string) {
    setExpandedPlayer((prev) => (prev === name ? null : name));
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-yellow-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto rounded border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                title={col.tooltip}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors select-none whitespace-nowrap"
              >
                {col.label}
                <SortIcon col={col.key} />
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">
              MD Form
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const isExpanded = expandedPlayer === p.player;

            return (
              <>
                <tr
                  key={p.player}
                  className={`border-b border-gray-800 transition-colors hover:bg-gray-800/50 cursor-pointer ${
                    i % 2 === 0 ? 'bg-black' : 'bg-gray-950'
                  } ${isExpanded ? 'bg-gray-800/50' : ''} ${!p.played ? 'opacity-50' : ''}`}
                  onClick={() => toggleExpand(p.player)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-white">{p.player}</span>
                    {!p.played && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                        Did not play
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.primaryPosition ? (
                      <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded">
                        {p.primaryPosition}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{p.totalSuccessful}</td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{p.totalUnsuccessful}</td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{p.totalDuels}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold tabular-nums ${gradeColor(p.srGrade)}`}>
                      {formatNum(p.individualAvgSR, 0)}{p.individualAvgSR !== null ? '%' : ''} {p.srGrade ? `(${p.srGrade})` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold tabular-nums ${gradeColor(p.dpgGrade)}`}>
                      {formatNum(p.duelsPerGame, 2)} {p.dpgGrade ? `(${p.dpgGrade})` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold tabular-nums ${gradeColor(p.dpmGrade)}`}>
                      {formatNum(p.duelsPerMin, 3)} {p.dpmGrade ? `(${p.dpmGrade})` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 tabular-nums">{formatNum(p.duelsPer90, 2)}</td>
                  <td className="px-4 py-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black ${ratingColor(p.rating)}`}>
                      {p.rating ?? '—'}
                    </span>
                  </td>
                  {/* MD form sparkline */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 items-end h-6">
                      {allMDs.map((md) => {
                        const row = p.matchDays.find((r) => r.md === md);
                        const pct = row?.success_pct;
                        if (pct === null || pct === undefined) {
                          return <div key={md} className="w-3 h-1 bg-gray-700 rounded-sm" />;
                        }
                        const h = Math.max(4, Math.round((pct / 100) * 24));
                        const color = pct >= 75 ? 'bg-green-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
                        return (
                          <div
                            key={md}
                            title={`MD${md}: ${pct}%`}
                            className={`w-3 rounded-sm ${color} hover:opacity-80 transition-opacity`}
                            style={{ height: `${h}px` }}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${p.player}-expanded`} className="bg-gray-900 border-b border-gray-700">
                    <td colSpan={columns.length + 1} className="px-6 py-4">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">
                        Match Day Breakdown — {p.player}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {p.matchDays.map((row) => (
                          <div key={row.md} className="flex flex-col items-center bg-gray-800 rounded px-4 py-2 min-w-[64px]">
                            <span className="text-white font-black text-lg tabular-nums">
                              {row.success_pct !== null ? `${row.success_pct}%` : '—'}
                            </span>
                            <span className="text-gray-500 text-xs uppercase tracking-widest">
                              MD{row.md}
                            </span>
                            <span className="text-gray-600 text-[10px] mt-1">
                              {row.min_played > 0 ? `${row.min_played}'${row.sub ? ' (sub)' : ''}` : 'DNP'}
                            </span>
                            {row.position && (
                              <span className="text-yellow-400 text-[10px] font-bold mt-0.5">
                                {row.position}{row.position_plus ? ` / ${row.position_plus}` : ''}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
