import { describe, expect, it } from 'vitest';
import {
  buildPlayerStatSummary,
  countEventGames,
  findPostseasonSummary,
} from '../src/app/utils/nbaStats.js';

const mockSeasonTypes = [
  { displayName: 'Regular Season' },
  {
    displayName: '25-26 Postseason',
    categories: [
      { type: 'event', events: [{ id: 1 }, { id: 2 }] },
      { type: 'event', events: [{ id: 3 }, { id: 4 }, { id: 5 }] },
      { type: 'summary', events: [] },
    ],
    summary: {
      stats: [
        {
          stats: [
            210, // minutes
            0,
            0.51, // fg pct
            0,
            0,
            0,
            0,
            82, // rebounds
            28, // assists
            0,
            0,
            0,
            0,
            180, // points
          ],
        },
      ],
    },
  },
];

describe('nba playoff stat helpers', () => {
  it('finds the postseason summary from a season list', () => {
    const result = findPostseasonSummary(mockSeasonTypes);

    expect(result).toBeDefined();
    expect(result.displayName).toBe('25-26 Postseason');
  });

  it('counts all event records in the postseason categories', () => {
    const season = findPostseasonSummary(mockSeasonTypes);

    expect(countEventGames(season)).toBe(5);
  });

  it('builds a player stat summary with totals and averages', () => {
    const player = {
      fullName: 'Jalen Brunson',
      eliminated: 'champion',
      image: 'https://example.com/player.png',
      altText: 'Illustrated headshot of Jalen Brunson',
      teamLogo: 'https://example.com/logo.png',
      logoAlt: 'New York Knicks logo',
    };

    const result = buildPlayerStatSummary(player, findPostseasonSummary(mockSeasonTypes));

    expect(result.player).toBe('Jalen Brunson');
    expect(result.games).toBe(5);
    expect(result.totalMinutes).toBe(210);
    expect(result.avgMinutes).toBe('42.0');
    expect(result.totalPoints).toBe(180);
    expect(result.avgPoints).toBe('36.0');
    expect(result.totalAssists).toBe(28);
    expect(result.avgAssists).toBe('5.6');
    expect(result.totalRebounds).toBe(82);
    expect(result.avgRebounds).toBe('16.4');
    expect(result.fgPercentage).toBe(0.51);
    expect(result.eliminated).toBe('champion');
  });
});
