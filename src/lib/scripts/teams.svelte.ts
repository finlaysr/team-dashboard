import { Team } from "$lib/scripts/team.svelte"

class Teams {
  teams: Team[] = $state([]);
  currentTeam: Team | null = $state(null);

  addTeam(name: string, subteams: string[], youthTeam: boolean) {
    if (this.teams.find(t => t.name == name)) { return };
    this.teams.push(new Team(name, subteams, youthTeam));
    this.currentTeam = this.teams[this.teams.length - 1];
  }

  deleteTeam(team: Team) {
    if (this.teams.includes(team)) {
      this.teams.splice(this.teams.indexOf(team), 1);
      if (this.teams.length > 0) {
        this.currentTeam = this.teams[0];
      } else {
        this.currentTeam = null;
      }
    }
  }
}

export const teams = new Teams();
