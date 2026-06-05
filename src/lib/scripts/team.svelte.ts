import { teams } from "$lib/scripts/teams.svelte";
import { Match } from "$lib/scripts/match.svelte";
import { Matches } from "$lib/scripts/matches.svelte";
import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";


export class Team {
  name: string = $state("");
  readonly subteams: string[] = $state([]);
  readonly players: Player[] = $state([]);
  youthTeam: boolean = $state(false);

  private matches: Matches = $state(new Matches());

  constructor(name: string, subteams: string[] = ["First Team"], youthTeam: boolean, players?: Player[], matches?: Matches) {
    this.name = name.trim();
    this.subteams = subteams.map(s => s.trim()).filter(s => s.length > 0);
    this.youthTeam = youthTeam;
    if (players) {
      this.players = players;
    }
    if (matches) {
      this.matches = matches;
    }
  }

  toJSON() {
    return {
      name: $state.snapshot(this.name),
      subteams: $state.snapshot(this.subteams),
      players: $state.snapshot(this.players),
      youthTeam: $state.snapshot(this.youthTeam),
      matches: $state.snapshot(this.matches),
    }
  }

  static fromJSON(data: string): Team {
    let json = JSON.parse(data);

    return new Team(
      json.name,
      json.subteams,
      json.youthTeam,
      json.players.map((p: any) => Player.fromJSON(JSON.stringify(p))),
      Matches.fromJSON(
        json.matches ? JSON.stringify(json.matches) : null
      )
    );
  }

  addPlayer(player: Player): boolean {
    if (this.players.find(p => p.name === player.name)) { return false };
    this.players.push(player);
    return true;
  }

  deletePlayer(player: Player): boolean {
    if (this.players.includes(player)) {
      this.players.splice(this.players.indexOf(player), 1);
      return true;
    }
    return false;
  }

  updatePlayer(player: Player, newName?: string, newMembership?: string, newPosition?: Position, newSubteam?: string, newNamed?: boolean, newYouthOptions?: string): boolean {
    let updated = this.players.find(p => p === player);
    if (!updated) { return false };

    if (newName !== undefined) {
      if (this.players.find(p => p.name === newName && p !== player)) { return false };
      updated.name = newName.trim();
    }
    if (newMembership !== undefined) updated.membershipNum = newMembership.trim();
    if (newPosition !== undefined) updated.position = newPosition;
    if (newSubteam !== undefined) updated.subteam = newSubteam.trim();
    if (newNamed !== undefined) updated.named = newNamed;
    if (newYouthOptions !== undefined) updated.youthOptions = newYouthOptions.trim();
    return true;
  }

  addSubteam(subteam: string): boolean {
    subteam = subteam.trim();
    if (this.subteams.includes(subteam) || subteam.length === 0) { return false };
    this.subteams.push(subteam);
    return true;
  }

  editSubteam(oldName: string, newName: string): boolean {
    const index = this.subteams.indexOf(oldName);
    if (this.subteams.find(s => s === newName && s !== oldName)) { return false };
    if (index !== -1 && newName.trim().length > 0) {
      this.subteams[index] = newName;
      this.players.forEach(player => {
        if (player.subteam === oldName) {
          player.subteam = newName;
        }
      });
      return true;
    }
    return false;
  }

  deleteSubteam(name: string): boolean {
    const index = this.subteams.indexOf(name);
    if (index !== -1) {
      this.subteams.splice(index, 1);
      this.players.forEach(player => {
        if (player.subteam === name) {
          player.subteam = "";
        }
      });
      return true;
    }
    return false;
  }

  getSubteamPlayers(subteam: string, position: Position = Position.ANY): Player[] {
    return this.players.filter(player => player.subteam === subteam && player.position === position);
  }

  updateTeam(newName: string, newYouthTeam: boolean): boolean {
    if (teams.teams.find(t => t.name === newName && t !== this)) { return false };
    this.name = newName.trim();
    if (this.youthTeam !== newYouthTeam) {
      this.youthTeam = newYouthTeam;
      this.players.forEach(player => { player.youthOptions = "" });
    }
    return true;
  }

  get getMatches(): Matches {
    return this.matches;
  }

  addMatch(newDate: string, newPastSubteams: Map<Player, string>, subTeamsInvolved: SubTeamsInvloved[]): boolean {
    return this.matches.addMatch(newDate, newPastSubteams, subTeamsInvolved);
  }
}

export class Player {
  name: string = $state("");
  membershipNum: string = $state("");
  position: Position = $state(Position.ANY);
  subteam: string = $state("");
  named: boolean = $state(false);
  youthOptions: string = $state("");

  constructor(name: string, membershipNum: string, position: Position, subteam: string, named: boolean, youthOptions: string = "") {
    this.name = name.trim();
    this.membershipNum = membershipNum.trim();
    this.position = position;
    this.subteam = subteam.trim();
    this.named = named;
    this.youthOptions = youthOptions.trim();
  }

  toJSON() {
    return {
      name: $state.snapshot(this.name),
      membershipNum: $state.snapshot(this.membershipNum),
      position: $state.snapshot(this.position),
      subteam: $state.snapshot(this.subteam),
      named: $state.snapshot(this.named),
      youthOptions: $state.snapshot(this.youthOptions)
    }
  }

  static fromJSON(data: any): Player {
    let json = JSON.parse(data);
    return new Player(
      json.name,
      json.membershipNum,
      json.position,
      json.subteam,
      json.named,
      json.youthOptions
    );
  }
}

export enum Position {
  GK = "Goal Keeper",
  DEF = "Defender",
  CEN = "Midfielder",
  FWD = "Forward",
  ANY = "Any",
}

