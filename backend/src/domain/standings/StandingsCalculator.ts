export interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface MatchStandingInput {
  homeId: string;
  awayId: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

export class StandingsCalculator {
  calculate(matches: MatchStandingInput[]): Array<StandingRow & { position: number }> {
    const rows = new Map<string, StandingRow>();

    const ensure = (teamId: string) => {
      if (!rows.has(teamId)) {
        rows.set(teamId, {
          teamId,
          teamName: teamId,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
          points: 0,
        });
      }
      return rows.get(teamId)!;
    };

    matches.forEach((match) => {
      const { homeId, awayId, homeGoals, awayGoals } = match;
      if (homeGoals === null || awayGoals === null) return;
      const home = ensure(homeId);
      const away = ensure(awayId);

      home.played += 1;
      away.played += 1;
      home.goalsFor += homeGoals;
      home.goalsAgainst += awayGoals;
      away.goalsFor += awayGoals;
      away.goalsAgainst += homeGoals;

      if (homeGoals > awayGoals) {
        home.won += 1;
        away.lost += 1;
        home.points += 3;
      } else if (homeGoals < awayGoals) {
        away.won += 1;
        home.lost += 1;
        away.points += 3;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    });

    const sorted = Array.from(rows.values()).map((row) => ({
      ...row,
      goalDiff: row.goalsFor - row.goalsAgainst,
    }));

    sorted.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return 0;
    });

    return sorted.map((row, index) => ({
      ...row,
      position: index + 1,
    }));
  }
}
