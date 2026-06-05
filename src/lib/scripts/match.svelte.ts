import type { Player, Position } from "$lib/scripts/team.svelte";
import { teams } from "$lib/scripts/teams.svelte";

export class Match {
    private matchID: number = $state(-1);
    private date: string = $state("");
    private subTeamsInvolved: SubTeamsInvloved[] = $state([]);

    private availability: Map<number, Availability> = $state(new Map());
    private matchSubTeams: Map<number, number> = $state(new Map());
    private matchPositions: Map<number, Position> = $state(new Map());

    constructor(matchID: number, date: string, subTeamsInvolved: SubTeamsInvloved[], availability?: Map<number, Availability>, matchSubTeams?: Map<number, number>, matchPositions?: Map<number, Position>) {
        function setDefaultSubteams(): Map<number, number> {
            let map: Map<number, number> = new Map();
            teams.currentTeam?.players.forEach((p) => {
                map.set(p.playerID, p.subTeamID);
            });
            return map;
        }

        function setDefaultAvailability(): Map<number, Availability> {
            let map: Map<number, Availability> = new Map();
            teams.currentTeam?.players.forEach((p) => {
                map.set(p.playerID, Availability.NO_REPLY);
            });
            return map;
        }

        function setDefaultPositions(): Map<number, Position> {
            let map: Map<number, Position> = new Map();
            teams.currentTeam?.players.forEach((p) => {
                map.set(p.playerID, p.position);
            });
            return map;
        }

        this.matchID = matchID;
        this.date = date.trim();
        this.subTeamsInvolved = subTeamsInvolved;
        if (matchSubTeams) {
            this.matchSubTeams = matchSubTeams;
        } else {
            this.matchSubTeams = setDefaultSubteams();
        }
        if (availability) {
            this.availability = availability;
        } else {
            this.availability = setDefaultAvailability();
        }
        if (matchPositions) {
            this.matchPositions = matchPositions;
        } else {
            this.matchPositions = setDefaultPositions();
        }
    }

    setAvailability(player: Player, availability: Availability) {
        this.availability.set(player.playerID, availability);
    }

    get getID(): number {
        return this.matchID;
    }

    get getDate(): string {
        return this.date;
    }

    get getAvailability(): Map<number, Availability> {
        return this.availability;
    }

    get getSubTeamsInvolved(): SubTeamsInvloved[] {
        return this.subTeamsInvolved;
    }

    get getmatchSubTeams(): Map<number, number> {
        return this.matchSubTeams;
    }

    get getMatchPositions(): Map<number, Position> {
        return this.matchPositions;
    }

    toJSON() {
        return {
            matchID: $state.snapshot(this.matchID),
            date: $state.snapshot(this.date),
            subTeamsInvolved: $state.snapshot(this.subTeamsInvolved),
            availability: Array.from($state.snapshot(this.availability).entries()),
            matchSubTeams: Array.from($state.snapshot(this.matchSubTeams).entries()),
            matchPositions: Array.from($state.snapshot(this.matchPositions).entries()),
        }
    }

    static fromJSON(data: string): Match {
        let json = JSON.parse(data);
        return new Match(
            json.matchID,
            json.date,
            json.subTeamsInvolved,
            new Map(json.availability),
            new Map(json.matchSubTeams),
            new Map(json.matchPositions)
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
    "subTeamID": number;
    "description": string
}
