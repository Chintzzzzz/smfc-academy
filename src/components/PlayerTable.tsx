'use client';

import { useState } from 'react';
import { Player, SortKey, SortDirection } from '@/types';

interface PlayerTableProps {
  players: Player[];
}

const matchDayKeys: (keyof Player)[] = ['MD1','MD2','MD3','MD4','MD5','MD6','MD7','MD8'];

const columns: { key: SortKey; label: string; tooltip?: string }[] = [
  { key: 'name', label: 'Player' },
  { key: 'position', label: 'Pos' },
  { key: 'successfulDuels', label: 'Won', tooltip: 'Successful duels' },
  { key: 'unsuccessfulDuels', label: 'Lost', tooltip: 'Unsuccessful duels' },
  { key: 'totalDuels', label: 'Total', tooltip: 'Total duels' },
  { key: 'successPercent', label: 'Win %', tooltip: 'Success percentage' },
  { key: 'individualAvgSR', label: 'Avg SR', tooltip: 'Individual average success rate' },
  { key: 'duelsPerGame', label: 'p/g', tooltip: 'Duels per game' },
  { key: 'duelsPerMatch', label: 'p/m', tooltip: 'Duels per match' },
  { key: 'duelsPerNinety', label: 'p/90', tooltip: 'Duels per 90 minutes' },
];

function formatValue(player: Player, key: SortKey): string {
  const val = player[key];
  if (val === null || val === undefined) return '—';
  if (typeof val === 'number') {
    if (['successPercent', 'individualAvgSR'].includes(key as string)) return `${val.toFixed(1)}%`;
    if (['duelsPerGame', 'duelsPerMatch', 'duelsPerNinety'].includes(key as string)) return val.toFixed(1);
    return String(val);
  }
  return String(val);
}

export default function PlayerTable({ players }: PlayerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('successPercent');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const sorted = [...players].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
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
              MD Breakdown
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, i) => {
            const isExpanded = expandedPlayer === player.name;
            const winPct = player.successPercent;
            const pctColor =
              winPct >= 75 ? 'text-green-400' :
              winPct >= 60 ? 'text-yellow-400' :
              'text-red-400';

            return (
              <>
                <tr
                  key={player.name}
                  className={`border-b border-gray-800 transition-colors hover:bg-gray-800/50 cursor-pointer ${
                    i % 2 === 0 ? 'bg-black' : 'bg-gray-950'
                  } ${isExpanded ? 'bg-gray-800/50' : ''}`}
                  onClick={() => toggleExpand(player.name)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.key === 'name' ? (
                        <span className="font-semibold text-white">{player.name}</span>
                      ) : col.key === 'position' ? (
                        <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                          {player.position.slice(0, 3).toUpperCase()}
                        </span>
                      ) : col.key === 'successPercent' || col.key === 'individualAvgSR' ? (
                        <span className={`font-bold tabular-nums ${pctColor}`}>
                          {formatValue(player, col.key)}
                        </span>
                      ) : (
                        <span className="text-gray-300 tabular-nums">
                          {formatValue(player, col.key)}
                        </span>
                      )}
                    </td>
                  ))}
                  {/* MD sparkline summary */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 items-end h-6">
                      {matchDayKeys.map((md) => {
                        const val = player[md] as number | null;
                        if (val === null) return <div key={md} className="w-3 h-1 bg-gray-700 rounded-sm" />;
                        const maxH = 24;
                        const h = Math.max(4, Math.round((val / 10) * maxH));
                        return (
                          <div
                            key={md}
                            title={`${md}: ${val}`}
                            className="w-3 bg-yellow-400/60 rounded-sm hover:bg-yellow-400 transition-colors"
                            style={{ height: `${h}px` }}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>

                {/* Expanded match day row */}
                {isExpanded && (
                  <tr key={`${player.name}-expanded`} className="bg-gray-900 border-b border-gray-700">
                    <td colSpan={columns.length + 1} className="px-6 py-4">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">
                        Match Day Duel Totals — {player.name}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {matchDayKeys.map((md) => {
                          const val = player[md] as number | null;
                          return (
                            <div key={md} className="flex flex-col items-center bg-gray-800 rounded px-4 py-2 min-w-[48px]">
                              <span className="text-white font-black text-lg tabular-nums">
                                {val ?? '—'}
                              </span>
                              <span className="text-gray-500 text-xs uppercase tracking-widest">
                                {md}
                              </span>
                            </div>
                          );
                        })}
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
