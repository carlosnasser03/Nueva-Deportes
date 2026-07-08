import { StandingsCalculator } from '../domain/standings/StandingsCalculator';
import { IMatchRepository } from '../infrastructure/repositories/interfaces/IMatchRepository';
import { TeamDTO, StandingRowDTO } from '@shared';

export class StandingsService {
  constructor(private readonly matchRepository: IMatchRepository) {}

  async getStandings(categoryId: string): Promise<StandingRowDTO[]> {
    const matches = await this.matchRepository.findByCategory(categoryId);
    const calculator = new StandingsCalculator();

    const standings = calculator.calculate(
      matches.map((match) => ({
        homeId: match.homeId,
        awayId: match.awayId,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      }))
    );

    return standings.map((row) => ({
      position: row.position,
      team: { id: row.teamId, name: row.teamName, crestUrl: null, categoryId },
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDiff,
      points: row.points,
    }));
  }
}
