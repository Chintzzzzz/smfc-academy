import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { MatchDayRow, PlayerSeason, SquadAverages, Grade } from '@/types';

function readCSV<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'src/data', filename);
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data } = Papa.parse<T>(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // numbers parse as numbers, "NA" stays as string
  });
  return data;
}

// Raw rows have "NA" strings from the CSV — normalise to null
function cleanRow(raw: any): MatchDayRow {
  const toNullableNum = (v: any): number | null =>
    v === 'NA' || v === '' || v === null || v === undefined ? null : Number(v);
  const toNullableStr = (v: any): string | null =>
    v === 'NA' || v === '' || v === null || v === undefined ? null : String(v);

  return {
    player: String(raw.player),
    md: Number(raw.md),
    successful: Number(raw.successful) || 0,
    unsuccessful: Number(raw.unsuccessful) || 0,
    total: Number(raw.total) || 0,
    success_pct: toNullableNum(raw.success_pct),
    min_played: Number(raw.min_played) || 0,
    sub: Number(raw.sub) || 0,
    position: toNullableStr(raw.position),
    position_plus: toNullableStr(raw.position_plus),
  };
}

export function getMatchDayRows(filename = 'duels_2011.csv'): MatchDayRow[] {
  return readCSV<any>(filename).map(cleanRow);
}

// Group raw rows by player, then compute every season-level stat from scratch.
export function getPlayerSeasons(filename = 'duels_2011.csv'): PlayerSeason[] {
  const rows = getMatchDayRows(filename);

  const byPlayer = new Map<string, MatchDayRow[]>();
  for (const row of rows) {
    if (!byPlayer.has(row.player)) byPlayer.set(row.player, []);
    byPlayer.get(row.player)!.push(row);
  }

  const seasons: PlayerSeason[] = [];
  for (const [player, matchDays] of byPlayer) {
    matchDays.sort((a, b) => a.md - b.md);

    const playedRows = matchDays.filter((r) => r.min_played > 0);
    const matchesPlayed = playedRows.length;
    const played = matchesPlayed > 0;

    const totalSuccessful = matchDays.reduce((sum, r) => sum + r.successful, 0);
    const totalUnsuccessful = matchDays.reduce((sum, r) => sum + r.unsuccessful, 0);
    const totalDuels = totalSuccessful + totalUnsuccessful;
    const totalMinutes = matchDays.reduce((sum, r) => sum + r.min_played, 0);

    // Individual Avg% SR = average of each played match day's success_pct
    const validPcts = playedRows
      .map((r) => r.success_pct)
      .filter((v): v is number => v !== null);
    const individualAvgSR =
      validPcts.length > 0
        ? validPcts.reduce((sum, v) => sum + v, 0) / validPcts.length
        : null;

    const duelsPerGame = matchesPlayed > 0 ? totalDuels / matchesPlayed : null;
    const duelsPerMin = totalMinutes > 0 ? totalDuels / totalMinutes : null;
    const duelsPer90 = duelsPerMin !== null ? duelsPerMin * 90 : null;

    // Primary position = most frequently played position this period
    // (falls back to position_plus if position is missing on a row)
    const positionCounts = new Map<string, number>();
    playedRows.forEach((r) => {
      const pos = r.position ?? r.position_plus;
      if (pos) positionCounts.set(pos, (positionCounts.get(pos) ?? 0) + 1);
    });
    let primaryPosition: string | null = null;
    let maxCount = 0;
    positionCounts.forEach((count, pos) => {
      if (count > maxCount) {
        maxCount = count;
        primaryPosition = pos;
      }
    });

    seasons.push({
      player,
      matchDays,
      played,
      matchesPlayed,
      primaryPosition,
      totalSuccessful,
      totalUnsuccessful,
      totalDuels,
      individualAvgSR,
      duelsPerGame,
      duelsPerMin,
      duelsPer90,
      // grades filled in below once we know squad averages
      srGrade: null,
      dpgGrade: null,
      dpmGrade: null,
      rating: null,
    });
  }

  const squadAvg = computeSquadAverages(seasons);
  return seasons.map((s) => applyGrades(s, squadAvg));
}

export function computeSquadAverages(seasons: PlayerSeason[]): SquadAverages {
  const played = seasons.filter((s) => s.played);

  const avg = (vals: number[]) =>
    vals.length > 0 ? vals.reduce((sum, v) => sum + v, 0) / vals.length : 0;

  const avgSuccessPctByMD: Record<number, number> = {};
  const allMDs = new Set<number>();
  seasons.forEach((s) => s.matchDays.forEach((r) => allMDs.add(r.md)));

  allMDs.forEach((md) => {
    const pctsThisMD = seasons
      .flatMap((s) => s.matchDays)
      .filter((r) => r.md === md && r.success_pct !== null)
      .map((r) => r.success_pct as number);
    avgSuccessPctByMD[md] = avg(pctsThisMD);
  });

  return {
    avgSuccessPctByMD,
    avgIndividualAvgSR: avg(played.map((s) => s.individualAvgSR ?? 0).filter((v) => v !== null)),
    avgDuelsPerGame: avg(played.map((s) => s.duelsPerGame ?? 0)),
    avgDuelsPerMin: avg(played.map((s) => s.duelsPerMin ?? 0)),
    avgDuelsPer90: avg(played.map((s) => s.duelsPer90 ?? 0)),
  };
}

// Grading rule (confirmed with the team):
// SR grade:  A if individualAvgSR >= squad avg, B if below, C if < 50%
// DPG grade: A if duelsPerGame  >= squad avg, else B
// DPM grade: A if duelsPerMin   >= squad avg, else B
// Rating = number of A grades earned across SR/DPG/DPM (0-3)
// Players who didn't play any minutes are graded null (shown as "—", not penalised)
function applyGrades(season: PlayerSeason, squadAvg: SquadAverages): PlayerSeason {
  if (!season.played) {
    return { ...season, srGrade: null, dpgGrade: null, dpmGrade: null, rating: null };
  }

  const srGrade: Grade =
    season.individualAvgSR === null
      ? 'C'
      : season.individualAvgSR < 50
      ? 'C'
      : season.individualAvgSR >= squadAvg.avgIndividualAvgSR
      ? 'A'
      : 'B';

  const dpgGrade: Grade =
    (season.duelsPerGame ?? 0) >= squadAvg.avgDuelsPerGame ? 'A' : 'B';

  const dpmGrade: Grade =
    (season.duelsPerMin ?? 0) >= squadAvg.avgDuelsPerMin ? 'A' : 'B';

  const rating = [srGrade, dpgGrade, dpmGrade].filter((g) => g === 'A').length;

  return { ...season, srGrade, dpgGrade, dpmGrade, rating };
}

// When you upgrade to Graph API, only this file changes.
// Pages keep calling getPlayerSeasons() / computeSquadAverages() unchanged.
