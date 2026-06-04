import { teams } from "$lib/scripts/teams.svelte";

export class Team {
  name: string = $state("");
  readonly subteams: string[] = $state([]);
  readonly players: Player[] = $state([]);
  private availability: Map<Player, Availability> = $state(new Map());
  youthTeam: boolean = $state(false);

  constructor(name: string, subteams: string[] = ["First Team"], youthTeam: boolean, players?: Player[]) {
    this.name = name.trim();
    this.subteams = subteams.map(s => s.trim()).filter(s => s.length > 0);
    this.youthTeam = youthTeam;
    if (players) {
      this.players = players;
    }
  }

  toJSON() {
    return {
      name: $state.snapshot(this.name),
      subteams: $state.snapshot(this.subteams),
      players: $state.snapshot(this.players),
      youthTeam: $state.snapshot(this.youthTeam)
    }
  }

  static fromJSON(data: string): Team {
    let json = JSON.parse(data);
    return new Team(
      json.name,
      json.subteams,
      json.youthTeam,
      json.players.map((p: any) => Player.fromJSON(JSON.stringify(p)))
    );
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  deletePlayer(player: Player): boolean {
    if (this.players.includes(player)) {
      this.players.splice(this.players.indexOf(player), 1);
      return true;
    }
    return false;
  }

  updatePlayer(player: Player, newName?: string, newMembership?: string, newPosition?: Position, newSubteam?: string, newNamed?: boolean, newYouthOptions?: string) {
    let updated = this.players.find(p => p === player);
    if (!updated) { return };

    if (newName !== undefined) updated.name = newName.trim();
    if (newMembership !== undefined) updated.membershipNum = newMembership.trim();
    if (newPosition !== undefined) updated.position = newPosition;
    if (newSubteam !== undefined) updated.subteam = newSubteam.trim();
    if (newNamed !== undefined) updated.named = newNamed;
    if (newYouthOptions !== undefined) updated.youthOptions = newYouthOptions.trim();
  }

  setAvailability(player: Player, availability: Availability) {
    this.availability.set(player, availability);
  }

  addSubteam(subteam: string) {
    subteam = subteam.trim();
    if (subteam.length > 0 && !this.subteams.includes(subteam)) {
      this.subteams.push(subteam);
    }

  }

  editSubteam(oldName: string, newName: string) {
    const index = this.subteams.indexOf(oldName);
    if (index !== -1 && newName.trim().length > 0) {
      this.subteams[index] = newName;
      this.players.forEach(player => {
        if (player.subteam === oldName) {
          player.subteam = newName;
        }
      });
    }
  }

  deleteSubteam(name: string) {
    const index = this.subteams.indexOf(name);
    if (index !== -1) {
      this.subteams.splice(index, 1);
      this.players.forEach(player => {
        if (player.subteam === name) {
          player.subteam = "";
        }
      });
    }
  }

  getSubteamPlayers(subteam: string, position: Position = Position.ANY): Player[] {
    return this.players.filter(player => player.subteam === subteam && player.position === position);
  }

  updateTeam(name: string, youthTeam: boolean) {
    this.name = name.trim();
    if (this.youthTeam !== youthTeam) {
      this.youthTeam = youthTeam;
      this.players.forEach(player => { player.youthOptions = "" });
    }
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

enum Availability {
  YES,
  MAYBE,
  INJURED,
  NO,
  NO_REPLY
}
