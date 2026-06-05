import { Match } from "$lib/scripts/match.svelte";
import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";

export class Matches {
  private matches: Match[] = $state([]);
  currentMatch: Match | null = $state(null);
  private matchIndex: number = $state(0);

  constructor(matches?: Match[], currentMatch?: Match | null, matchCount?: number) {
    if (matches) {
      this.matches = matches;
    }
    if (currentMatch) {
      this.currentMatch = currentMatch;
    }
    if (matchCount !== undefined) {
      this.matchIndex = matchCount;
    }
  }

  get getMatches(): Match[] {
    return this.matches;
  }

  addMatch(newDate: string, subTeamsInvolved: SubTeamsInvloved[]): boolean {
    console.log("Adding new match: ", newDate);
    this.matches.push(new Match(this.matchIndex++, newDate.trim(), subTeamsInvolved));
    this.currentMatch = this.matches[this.matches.length - 1];
    return true;
  }

  deleteMatch(match: Match): boolean {
    if (this.matches.includes(match)) {
      this.matches.splice(this.matches.indexOf(match), 1);
      if (this.matches.length > 0) {
        this.currentMatch = this.matches[0];
      } else {
        this.currentMatch = null;
      }
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      matches: $state.snapshot(this.matches),
      currentMatch: this.currentMatch ? this.currentMatch.toJSON() : null,
      matchIndex: $state.snapshot(this.matchIndex),
    }
  }

  static fromJSON(data: string | null): Matches {
    if (!data) {
      return new Matches();
    }
    let json = JSON.parse(data);
    let matches = json.matches.map((m: any) => Match.fromJSON(JSON.stringify(m)));
    let currentMatch = matches.length > 0 ? matches[0] : null;
    return new Matches(matches, currentMatch, json.matchIndex);
  }
}