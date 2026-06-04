import type { Player } from "$lib/scripts/team.svelte";
let counter = 0;

export class Match {
    private ID: number = $state(-1);
    private date: string = $state("");
    private availability: Map<Player, Availability> = $state(new Map());
    private subTeamsInvolved: SubTeamsInvloved[] = $state([]);
    private pastSubteams: Map<Player, string> = $state(new Map());

    constructor(date: string, pastSubteams: Map<Player, string>, subTeamsInvolved: SubTeamsInvloved[]) {
        this.ID = counter++;
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
