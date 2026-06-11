import { teams } from "$lib/scripts/teams.svelte";
import { Matches } from "$lib/scripts/matches.svelte";

export type TeamID = number;
export class Team {
  teamID: TeamID = $state(-1);
  name: string = $state("");
  readonly subteams: SubTeam[] = $state([]);
  readonly players: Player[] = $state([]);
  youthTeam: boolean = $state(false);
  private playerIndex: PlayerID = $state(1);
  private subteamIndex: SubTeamID = $state(1);

  private matches: Matches = $state(new Matches());

  constructor(teamID: TeamID, name: string, youthTeam: boolean, playerIndex: PlayerID = 1, subteamIndex: SubTeamID = 1, players?: Player[], matches?: Matches, subTeamNames?: string[], subteams?: SubTeam[]) {
    this.teamID = teamID;
    this.name = name.trim();
    this.playerIndex = playerIndex;
    this.subteamIndex = subteamIndex;
    if (subTeamNames) {
      subTeamNames.forEach(s => { this.addSubteam(s) });
    } else if (subteams) {
      subteams.forEach(s => { this.subteams.push(s) });
    }
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
      teamID: $state.snapshot(this.teamID),
      name: $state.snapshot(this.name),
      subteams: $state.snapshot(this.subteams),
      players: $state.snapshot(this.players),
      youthTeam: $state.snapshot(this.youthTeam),
      playerIndex: $state.snapshot(this.playerIndex),
      subteamIndex: $state.snapshot(this.subteamIndex),
      matches: $state.snapshot(this.matches),
    }
  }

  static fromJSON(data: string): Team {
    let json = JSON.parse(data);

    return new Team(
      json.teamID,
      json.name,
      json.youthTeam,
      json.playerIndex,
      json.subteamIndex,
      json.players.map((p: any) => Player.fromJSON(JSON.stringify(p))),
      Matches.fromJSON(
        json.matches ? JSON.stringify(json.matches) : null
      ),
      undefined, // Ignore subTeamNames as we have the subTeamIDs when loading
      json.subteams
    );
  }

  addPlayer(name: string, membershipNum: string, position: Position, subTeamID: SubTeamID, named: boolean, youthOptions: string): boolean {
    if (this.players.find(p => p.name === name)) { return false };
    this.players.push(new Player(this.playerIndex++, name, membershipNum, position, subTeamID, named, youthOptions));
    return true;
  }

  deletePlayer(playerID: PlayerID): boolean {
    const player = this.players.find(p => p.playerID === playerID);
    if (player) {
      this.players.splice(this.players.indexOf(player), 1);
      return true;
    }
    return false;
  }

  updatePlayer(playerID: PlayerID, newName?: string, newMembership?: string, newPosition?: Position, newSubTeamID?: SubTeamID, newNamed?: boolean, newYouthOptions?: string): boolean {
    const player = this.players.find(p => p.playerID === playerID);
    if (!player) { return false };

    if (newName !== undefined) {
      if (this.players.find(p => p.name === newName && p !== player)) { return false };
      player.name = newName.trim();
    }
    if (newMembership !== undefined) player.membershipNum = newMembership.trim();
    if (newPosition !== undefined) player.position = newPosition;
    if (newSubTeamID !== undefined) player.subTeamID = newSubTeamID;
    if (newNamed !== undefined) player.named = newNamed;
    if (newYouthOptions !== undefined) player.youthOptions = newYouthOptions.trim();
    return true;
  }

  getPlayerByID(playerID: PlayerID): Player | undefined {
    return this.players.find(p => p.playerID === playerID);
  }

  addSubteam(subteamName: string): boolean {
    subteamName = subteamName.trim();
    if (this.subteams.some(s => s.name === subteamName) || subteamName.length === 0) { return false };
    this.subteams.push({ subTeamID: this.subteamIndex++, name: subteamName });
    return true;
  }

  editSubteam(subTeamID: SubTeamID, newName: string): boolean {
    newName = newName.trim();
    if (newName.length === 0) { return false };

    const index = this.subteams.findIndex(s => s.subTeamID === subTeamID);
    if (index === -1) { return false };

    if (this.subteams.some(s => s !== this.subteams[index] && s.name === newName)) { return false };
    this.subteams[index].name = newName;
    return true;
  }

  deleteSubteam(subTeamID: SubTeamID): boolean {
    const index = this.subteams.findIndex(s => s.subTeamID === subTeamID);
    if (index !== -1) {
      this.subteams.splice(index, 1);
      return true;
    }
    return false;
  }

  getSubteamByID(subTeamID: SubTeamID): SubTeam | undefined {
    return this.subteams.find(s => s.subTeamID === subTeamID);
  }

  getSubteamPlayers(subTeamID: SubTeamID, position: Position = Position.ANY): Player[] {
    const subteam = this.subteams.find(s => s.subTeamID === subTeamID);
    if (!subteam) { return []; }
    return this.players.filter(player => player.subTeamID === subteam.subTeamID && (player.position === position || position === Position.ANY));
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
}

export interface SubTeam {
  subTeamID: number;
  name: string;
}

export type PlayerID = number;
export type SubTeamID = number;

export class Player {
  playerID: PlayerID = $state(-1);
  name: string = $state("");
  membershipNum: string = $state("");
  position: Position = $state(Position.ANY);
  subTeamID: SubTeamID = $state(-1);
  named: boolean = $state(false);
  youthOptions: string = $state("");

  constructor(playerID: PlayerID, name: string, membershipNum: string, position: Position, subTeamID: SubTeamID, named: boolean, youthOptions: string = "") {
    this.playerID = playerID;
    this.name = name.trim();
    this.membershipNum = membershipNum.trim();
    this.position = position;
    this.subTeamID = subTeamID;
    this.named = named;
    this.youthOptions = youthOptions.trim();
  }

  toJSON() {
    return {
      playerID: $state.snapshot(this.playerID),
      name: $state.snapshot(this.name),
      membershipNum: $state.snapshot(this.membershipNum),
      position: $state.snapshot(this.position),
      subTeamID: $state.snapshot(this.subTeamID),
      named: $state.snapshot(this.named),
      youthOptions: $state.snapshot(this.youthOptions)
    }
  }

  static fromJSON(data: any): Player {
    let json = JSON.parse(data);
    return new Player(
      json.playerID,
      json.name,
      json.membershipNum,
      json.position,
      json.subTeamID,
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
