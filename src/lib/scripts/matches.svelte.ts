import { Match } from "$lib/scripts/match.svelte";
import type { SubTeamsInvloved, MatchID } from "$lib/scripts/match.svelte";

export class Matches {
  private matches: Match[] = $state([]);
  currentMatch: MatchID | null = $state(null);
  private matchIndex: number = $state(0);

  constructor(matches?: Match[], currentMatch?: MatchID | null, matchIndex?: number) {
    if (matches) {
      this.matches = matches;
    }
    if (currentMatch) {
      this.currentMatch = currentMatch;
    }
    if (matchIndex !== undefined) {
      this.matchIndex = matchIndex;
    }
  }

  get getMatches(): Match[] {
    return this.matches;
  }

  getMatchByID(matchID: MatchID): Match | null {
    const match = this.matches.find(m => m.getID === matchID);
    return match ? match : null;
  }

  addMatch(newDate: string, subTeamsInvolved: SubTeamsInvloved[]): boolean {
    this.matches.push(new Match(this.matchIndex++, newDate.trim(), subTeamsInvolved));
    this.currentMatch = this.matches[this.matches.length - 1].getID;
    return true;
  }

  deleteMatch(match: Match): boolean {
    if (this.matches.includes(match)) {
      this.matches.splice(this.matches.indexOf(match), 1);
      if (this.matches.length > 0) {
        this.currentMatch = this.matches[0].getID;
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
      currentMatch: this.currentMatch ? this.currentMatch : null,
      matchIndex: $state.snapshot(this.matchIndex),
    }
  }

  static fromJSON(data: string | null): Matches {
    if (!data) {
      return new Matches();
    }
    let json = JSON.parse(data);
    let matches = json.matches.map((m: any) => Match.fromJSON(JSON.stringify(m)));
    let currentMatch = json.currentMatch !== null ? json.currentMatch : null;
    return new Matches(matches, currentMatch, json.matchIndex);
  }
}