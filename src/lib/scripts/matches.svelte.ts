import { Match } from "$lib/scripts/match.svelte";
import type { Player } from "$lib/scripts/team.svelte";
import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";

class Matches {
  private matches: Match[] = $state([]);
  private currentMatch: Match | null = $state(null);

  get getMatches(): Match[] {
    return this.matches;
  }

  get getCurrentMatch(): Match | null {
    return this.currentMatch;
  }

  addMatch(newDate: string, newPastSubteams: Map<Player, string>, subTeamsInvolved: SubTeamsInvloved[]): boolean {
    console.log("Adding new match: ", newDate);
    this.matches.push(new Match(newDate.trim(), newPastSubteams, subTeamsInvolved));
    this.currentMatch = this.matches[this.matches.length - 1];
    return true;
  }
}

export const matches = new Matches();
