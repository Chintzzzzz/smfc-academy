import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Player } from '@/types';

function readCSV<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'src/data', filename);
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data } = Papa.parse<T>(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // auto-converts numbers
  });
  return data;
}

export function getPlayers(): Player[] {
  return readCSV<Player>('players.csv');
}

export function getPlayersByYear(year: number): Player[] {
  return getPlayers().filter((p) => p.yearOfBirth === year);
}

// When you upgrade to Graph API, only this file changes.
// All pages continue to call getPlayers() / getPlayersByYear() unchanged.
