// One row per player per match day — mirrors the CSV exactly
export interface MatchDayRow {
  player: string;
  md: number;
  successful: number;
  unsuccessful: number;
  total: number;
  success_pct: number | null;   // null when player didn't play (NA in CSV)
  min_played: number;
  sub: number;                  // 1 = came on as sub, 0 = started
  position: string | null;
  position_plus: string | null;
}

export type Grade = 'A' | 'B' | 'C';

// Computed season summary for one player, derived from their MatchDayRow[]
export interface PlayerSeason {
  player: string;
  matchDays: MatchDayRow[];           // raw rows, MD1–MD8 (or however many exist)
  played: boolean;                    // did they feature in at least one MD
  matchesPlayed: number;              // count of MDs with min_played > 0
  primaryPosition: string | null;     // most frequently played position this period
  totalSuccessful: number;
  totalUnsuccessful: number;
  totalDuels: number;
  individualAvgSR: number | null;     // average of success_pct across played MDs
  duelsPerGame: number | null;        // totalDuels / matchesPlayed
  duelsPerMin: number | null;         // totalDuels / total minutes played
  duelsPer90: number | null;          // duelsPerMin * 90
  srGrade: Grade | null;
  dpgGrade: Grade | null;
  dpmGrade: Grade | null;
  rating: number | null;              // 0-3, count of A grades
}

export interface SquadAverages {
  avgSuccessPctByMD: Record<number, number>; // MD -> squad avg success %
  avgIndividualAvgSR: number;
  avgDuelsPerGame: number;
  avgDuelsPerMin: number;
  avgDuelsPer90: number;
}

export type SortKey = keyof PlayerSeason;
export type SortDirection = 'asc' | 'desc';
