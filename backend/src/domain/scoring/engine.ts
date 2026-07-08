export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PlayerMatchInput {
  position: Position;
  minutesPlayed: number;
  matchDurationMinutes: number;
  goalsScored: number;
  teamGoals: number;
  teamCleanSheet: boolean;
}

export interface ScoringContribution {
  concept: string;
  points: number;
}

export interface ScoringResult {
  total: number;
  breakdown: ScoringContribution[];
}

export interface ScoringRule {
  readonly name: string;
  apply(input: PlayerMatchInput): ScoringContribution | null;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

export class BaseParticipationRule implements ScoringRule {
  readonly name = 'Participación';
  constructor(private readonly points = 1) {}
  apply(i: PlayerMatchInput) {
    if (i.minutesPlayed <= 0) return null;
    return { concept: this.name, points: this.points };
  }
}

export class CleanSheetRule implements ScoringRule {
  readonly name = 'Portería a cero';
  constructor(private readonly p: Record<Position, number> = { GK: 5, DEF: 3, MID: 1, FWD: 0 }) {}
  apply(i: PlayerMatchInput) {
    if (!i.teamCleanSheet) return null;
    const base = this.p[i.position];
    if (base === 0) return null;
    const frac = i.matchDurationMinutes > 0 ? Math.min(i.minutesPlayed / i.matchDurationMinutes, 1) : 1;
    return { concept: this.name, points: round2(base * frac) };
  }
}

export class OffensiveShareRule implements ScoringRule {
  readonly name = 'Reparto ofensivo';
  constructor(private readonly p: Record<Position, number> = { GK: 0, DEF: 0, MID: 0.5, FWD: 1 }) {}
  apply(i: PlayerMatchInput) {
    const per = this.p[i.position];
    if (per === 0 || i.teamGoals === 0) return null;
    return { concept: this.name, points: round2(per * i.teamGoals) };
  }
}

export class ScorerPositionBonusRule implements ScoringRule {
  readonly name = 'Bono por posición del anotador';
  constructor(private readonly p: Record<Position, number> = { GK: 0, DEF: 0, MID: 2, FWD: 3 }) {}
  apply(i: PlayerMatchInput) {
    if (i.goalsScored === 0) return null;
    const per = this.p[i.position];
    if (per === 0) return null;
    return { concept: this.name, points: round2(per * i.goalsScored) };
  }
}

export class ScorerBonusRule implements ScoringRule {
  readonly name = 'Bono al anotador';
  constructor(private readonly pointsPerGoal = 5) {}
  apply(i: PlayerMatchInput) {
    if (i.goalsScored === 0) return null;
    return { concept: this.name, points: this.pointsPerGoal * i.goalsScored };
  }
}

export class HatTrickBonusRule implements ScoringRule {
  readonly name = 'Bonus 3+ goles';
  constructor(private readonly bonus = 5, private readonly threshold = 3) {}
  apply(i: PlayerMatchInput) {
    if (i.goalsScored < this.threshold) return null;
    return { concept: this.name, points: this.bonus };
  }
}

export class ScoringEngine {
  constructor(private readonly rules: ScoringRule[]) {}
  calculate(input: PlayerMatchInput): ScoringResult {
    const breakdown = this.rules
      .map((r) => r.apply(input))
      .filter((c): c is ScoringContribution => c !== null);
    const total = round2(breakdown.reduce((s, c) => s + c.points, 0));
    return { total, breakdown };
  }
}

export function createDefaultScoringEngine(): ScoringEngine {
  return new ScoringEngine([
    new BaseParticipationRule(1),
    new CleanSheetRule({ GK: 5, DEF: 3, MID: 1, FWD: 0 }),
    new OffensiveShareRule({ GK: 0, DEF: 0, MID: 0.5, FWD: 1 }),
    new ScorerPositionBonusRule({ GK: 0, DEF: 0, MID: 2, FWD: 3 }),
    new ScorerBonusRule(5),
    new HatTrickBonusRule(5, 3),
  ]);
}
