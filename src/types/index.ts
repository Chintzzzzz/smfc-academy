export interface Player {
  name: string;
  position: string;
  yearOfBirth: number;
  // Match day duel stats (MD1–MD8)
  MD1: number | null;
  MD2: number | null;
  MD3: number | null;
  MD4: number | null;
  MD5: number | null;
  MD6: number | null;
  MD7: number | null;
  MD8: number | null;
  // Aggregated duel stats
  successfulDuels: number;
  unsuccessfulDuels: number;
  totalDuels: number;
  successPercent: number;       // Success %
  individualAvgSR: number;      // Individual Avg% SR
  duelsPerGame: number;         // DUELS p/g
  duelsPerMatch: number;        // DUELS p/m
  duelsPerNinety: number;       // DUELS p/90
}

export type SortKey = keyof Player;
export type SortDirection = 'asc' | 'desc';
