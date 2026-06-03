export class Team {
  readonly name: string = $state("");
  readonly subteams: string[] = $state([]);
  readonly players: Player[] = $state([]);
  private availability: Map<Player, Availability> = $state(new Map());

  constructor(name: string, subteams: string[] = ["First Team"]) {
    this.name = name.trim();
    this.subteams = subteams.map(s => s.trim()).filter(s => s.length > 0);
  }

  addPlayer(player: Player) {
    this.players.push(new Player(player.name, player.position, player.subteam, player.named))
  }

  removePlayer(player: Player): boolean {
    if (this.players.includes(player)) {
      this.players.splice(this.players.indexOf(player), 1);
      return true;
    }
    return false;
  }

  getSubteamPlayers(subteam: string, position: Position = Position.ANY): Player[] {
    return this.players.filter(player => player.subteam === subteam && player.position === position);
  }

  setAvailability(player: Player, availability: Availability) {
    this.availability.set(player, availability);
  }

  updatePlayer(player: Player, newName?: string, newPosition?: Position, newSubteam?: string, newNamed?: boolean) {
    let updated = this.players.find(p => p === player);
    if (!updated) { return };

    if (newName !== undefined) updated.name = newName.trim();
    if (newPosition !== undefined) updated.position = newPosition;
    if (newSubteam !== undefined) updated.subteam = newSubteam.trim();
    if (newNamed !== undefined) updated.named = newNamed;
  }

  addSubteam(subteam: string) {
    subteam = subteam.trim();
    if (subteam.length > 0 && !this.subteams.includes(subteam)) {
      this.subteams.push(subteam);
    }
  }
}

export class Player {
  name: string;
  position: Position;
  subteam: string;
  named: boolean;

  constructor(name: string, position: Position, subteam: string, named: boolean) {
    this.name = name.trim();
    this.position = position;
    this.subteam = subteam.trim();
    this.named = named;
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
