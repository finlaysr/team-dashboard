import type { Player, Position, PlayerID, SubTeamID } from "$lib/scripts/team.svelte";
import { teams } from "$lib/scripts/teams.svelte";

export type MatchID = number;
export class Match {
    private matchID: MatchID = $state(-1);
    private date: string = $state("");
    private subTeamsInvolved: SubTeamsInvloved[] = $state([]);

    private availability: Record<PlayerID, Availability> = $state({});
    private matchSubTeams: Record<PlayerID, SubTeamID> = $state({});
    private matchPositions: Record<PlayerID, Position> = $state({});

    constructor(matchID: MatchID, date: string, subTeamsInvolved: SubTeamsInvloved[], availability?: Record<PlayerID, Availability>, matchSubTeams?: Record<PlayerID, SubTeamID>, matchPositions?: Record<PlayerID, Position>) {
        function setDefaultSubteams(record: Record<PlayerID, SubTeamID>) {
            teams.currentTeam?.players.forEach((p) => {
                record[p.playerID] = p.subTeamID;
            });
        }

        function setDefaultAvailability(record: Record<PlayerID, Availability>) {
            teams.currentTeam?.players.forEach((p) => {
                record[p.playerID] = Availability.NO_REPLY;
            });
        }

        function setDefaultPositions(record: Record<PlayerID, Position>) {
            teams.currentTeam?.players.forEach((p) => {
                record[p.playerID] = p.position;
            });
        }

        this.matchID = matchID;
        this.date = date.trim();
        this.subTeamsInvolved = subTeamsInvolved;
        if (matchSubTeams) {
            this.matchSubTeams = matchSubTeams;
        } else {
            setDefaultSubteams(this.matchSubTeams);
        }
        if (availability) {
            this.availability = availability;
        } else {
            setDefaultAvailability(this.availability);
        }
        if (matchPositions) {
            this.matchPositions = matchPositions;
        } else {
            setDefaultPositions(this.matchPositions);
        }
    }

    setAvailability(playerID: PlayerID, availability: Availability) {
        this.availability[playerID] = availability;
        console.log("availability: ", $state.snapshot(this.availability));
    }

    get getID(): MatchID {
        return this.matchID;
    }

    get getDate(): string {
        return this.date;
    }

    get getAvailability(): Record<PlayerID, Availability> {
        return this.availability;
    }

    get getSubTeamsInvolved(): SubTeamsInvloved[] {
        return this.subTeamsInvolved;
    }

    get getmatchSubTeams(): Record<PlayerID, SubTeamID> {
        return this.matchSubTeams;
    }

    get getMatchPositions(): Record<PlayerID, Position> {
        return this.matchPositions;
    }

    toJSON() {
        console.log("availability saved: ", $state.snapshot(this.availability));
        return {
            matchID: $state.snapshot(this.matchID),
            date: $state.snapshot(this.date),
            subTeamsInvolved: $state.snapshot(this.subTeamsInvolved),
            availability: $state.snapshot(this.availability),
            matchSubTeams: $state.snapshot(this.matchSubTeams),
            matchPositions: $state.snapshot(this.matchPositions),
        }
    }

    static fromJSON(data: string): Match {
        let json = JSON.parse(data);
        console.log("availability loaded: ", json.availability);
        return new Match(
            json.matchID,
            json.date,
            json.subTeamsInvolved,
            json.availability,
            json.matchSubTeams,
            json.matchPositions
        );
    }
}

export enum Availability {
    YES = "Yes",
    MAYBE = "Maybe",
    INJURED = "Injured",
    NO = "No",
    NO_REPLY = "No Reply"
}

export interface SubTeamsInvloved {
    "subTeamID": SubTeamID;
    "description": string
}
