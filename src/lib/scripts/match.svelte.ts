import type { Player, PlayerID, SubTeamID } from "$lib/scripts/team.svelte";
import { Position } from "$lib/scripts/team.svelte";
import { teams } from "$lib/scripts/teams.svelte";

export type MatchID = number;
export class Match {
    private matchID: MatchID = $state(-1);
    private date: string = $state("");
    private subTeamsInvolved: SubTeamsInvloved[] = $state([]);

    private matchPlayers: MatchPlayer[] = $state([]);

    constructor(matchID: MatchID, date: string, subTeamsInvolved: SubTeamsInvloved[], matchPlayers?: MatchPlayer[]) {
        const setDefaultPlayers = () => {
            teams.currentTeam?.players
                .filter(p => subTeamsInvolved.some(st => st.subTeamID === p.subTeamID))
                .forEach((p) => {
                    this.matchPlayers.push({
                        playerID: p.playerID,
                        availability: Availability.NO_REPLY,
                        matchSubTeam: p.subTeamID,
                        matchPosition: p.position
                    });
                });
        }

        this.matchID = matchID;
        this.date = date.trim();
        this.subTeamsInvolved = subTeamsInvolved;
        if (matchPlayers) {
            this.matchPlayers = matchPlayers;
        } else {
            setDefaultPlayers();
        }
    }

    addPlayer(playerID: PlayerID) {
        const player = teams.currentTeam?.getPlayerByID(playerID);
        if (player && this.matchPlayers.every(mp => mp.playerID !== playerID)) {
            this.matchPlayers.push({
                playerID: player.playerID,
                availability: Availability.NO_REPLY,
                matchSubTeam: player.subTeamID,
                matchPosition: player.position
            });
        }
    }

    removePlayer(playerID: PlayerID) {
        this.matchPlayers = this.matchPlayers.filter(mp => mp.playerID !== playerID);
    }

    get getID(): MatchID {
        return this.matchID;
    }

    get getDate(): string {
        return this.date;
    }

    get getSubTeamsInvolved(): SubTeamsInvloved[] {
        return this.subTeamsInvolved;
    }

    get getMatchPlayers(): MatchPlayer[] {
        return this.matchPlayers;
    }

    getMatchPlayerByID(playerID: PlayerID): MatchPlayer | undefined {
        return this.matchPlayers.find(mp => mp.playerID === playerID);
    }

    setAvailability(playerID: PlayerID, availability: Availability) {
        const matchPlayer = this.getMatchPlayerByID(playerID);
        if (matchPlayer) {
            matchPlayer.availability = availability;
        }
    }

    toJSON() {
        return {
            matchID: $state.snapshot(this.matchID),
            date: $state.snapshot(this.date),
            subTeamsInvolved: $state.snapshot(this.subTeamsInvolved),
            matchPlayers: $state.snapshot(this.matchPlayers)
        }
    }

    static fromJSON(data: string): Match {
        let json = JSON.parse(data);
        return new Match(
            json.matchID,
            json.date,
            json.subTeamsInvolved,
            json.matchPlayers
        );
    }
}

export interface MatchPlayer {
    "playerID": PlayerID;
    "availability": Availability;
    "matchSubTeam": SubTeamID;
    "matchPosition": Position;
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
