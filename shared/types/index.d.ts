export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
export interface CategoryDTO {
    id: string;
    name: string;
    color: string;
}
export interface TeamDTO {
    id: string;
    name: string;
    crestUrl: string | null;
    categoryId: string;
}
export interface MatchDTO {
    id: string;
    categoryId: string;
    home: TeamDTO;
    away: TeamDTO;
    date: string;
    venue: string;
    status: 'scheduled' | 'live' | 'finished';
    homeGoals: number | null;
    awayGoals: number | null;
}
export interface StandingRowDTO {
    position: number;
    team: TeamDTO;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    points: number;
}
export interface PlayerDTO {
    id: string;
    name: string;
    cardPhotoUrl: string | null;
    position: Position;
    jerseyNumber: number | null;
    teamId: string;
    categoryId: string;
    seasonPoints: number;
    goals: number;
}
export interface PlayerMatchRatingDTO {
    matchId: string;
    opponent: string;
    date: string;
    minutesPlayed: number;
    goals: number;
    points: number;
}
export interface PlayerProfileDTO extends PlayerDTO {
    matchesPlayed: number;
    breakdown: {
        concept: string;
        points: number;
    }[];
    history: PlayerMatchRatingDTO[];
}
export interface ScorerDTO {
    position: number;
    player: PlayerDTO;
    goals: number;
}
export interface SponsorDTO {
    id: string;
    name: string;
    imageUrl: string;
    linkUrl: string | null;
    placement: string;
}
