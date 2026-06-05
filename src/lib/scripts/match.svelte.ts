import type { Player } from "$lib/scripts/team.svelte";

export class Match {
    private ID: number = $state(-1);
    private date: string = $state("");
    private availability: Map<Player, Availability> = $state(new Map());
    private subTeamsInvolved: SubTeamsInvloved[] = $state([]);
    private pastSubteams: Map<Player, string> = $state(new Map());

    constructor(ID: number, date: string, pastSubteams: Map<Player, string>, subTeamsInvolved: SubTeamsInvloved[]) {
        this.ID = ID;
        this.date = date.trim();
        this.pastSubteams = pastSubteams;
        this.subTeamsInvolved = subTeamsInvolved;
    }

    setAvailability(player: Player, availability: Availability) {
        this.availability.set(player, availability);
    }

    get getID(): number {
        return this.ID;
    }

    get getDate(): string {
        return this.date;
    }

    get getAvailability(): Map<Player, Availability> {
        return this.availability;
    }

    get getSubTeamsInvolved(): SubTeamsInvloved[] {
        return this.subTeamsInvolved;
    }

    get getPastSubteams(): Map<Player, string> {
        return this.pastSubteams;
    }

    toJSON() {
        return {
            ID: $state.snapshot(this.ID),
            date: $state.snapshot(this.date),
            availability: Array.from($state.snapshot(this.availability).entries()),
            subTeamsInvolved: $state.snapshot(this.subTeamsInvolved),
            pastSubteams: Array.from($state.snapshot(this.pastSubteams).entries()),
        }
    }

    static fromJSON(data: string): Match {
        let json = JSON.parse(data);
        return new Match(
            json.ID,
            json.date,
            new Map(json.pastSubteams),
            json.subTeamsInvolved
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
    "subteam": string;
    "description": string
}
