import { Match } from "$lib/scripts/match.svelte";
import type { Player } from "$lib/scripts/team.svelte";
import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";

export class Matches {
  private matches: Match[] = $state([]);
  currentMatch: Match | null = $state(null);
  private matchCount: number = $state(0);

  constructor(matches?: Match[], currentMatch?: Match | null, matchCount?: number) {
    if (matches) {
      this.matches = matches;
    }
    if (currentMatch) {
      this.currentMatch = currentMatch;
    }
    if (matchCount !== undefined) {
      this.matchCount = matchCount;
    }
  }

  get getMatches(): Match[] {
    return this.matches;
  }

  addMatch(newDate: string, newPastSubteams: Map<Player, string>, subTeamsInvolved: SubTeamsInvloved[]): boolean {
    console.log("Adding new match: ", newDate);
    this.matches.push(new Match(this.matchCount++, newDate.trim(), newPastSubteams, subTeamsInvolved));
    this.currentMatch = this.matches[this.matches.length - 1];
    return true;
  }

  toJSON() {
    return {
      matches: $state.snapshot(this.matches),
      currentMatch: this.currentMatch ? this.currentMatch.toJSON() : null,
      matchCount: $state.snapshot(this.matchCount),
    }
  }

  static fromJSON(data: string | null): Matches {
    if (!data) {
      return new Matches();
    }
    let json = JSON.parse(data);
    let matches = json.matches.map((m: any) => Match.fromJSON(JSON.stringify(m)));
    let currentMatch = matches.length > 0 ? matches[0] : null;
    return new Matches(matches, currentMatch, json.matchCount);
  }
}