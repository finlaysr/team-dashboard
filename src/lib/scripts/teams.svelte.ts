import { Team } from "$lib/scripts/team.svelte"

class Teams {
  teams: Team[] = $state([]);

  addTeam(name: string, subteams: string[]) {
    if (this.teams.find(t => t.name == name)) { return };
    this.teams.push(new Team(name, subteams));
  }
}

export const teams = new Teams();
