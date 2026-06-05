import { browser } from "$app/environment";
import { Team } from "$lib/scripts/team.svelte"

const STORAGE_KEY = "teamsData";

class Teams {
  teams: Team[] = $state([]);
  currentTeam: Team | null = $state(null);

  loadFromStorage() {
    if (browser) {
      let data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        try {
          let parsed = JSON.parse(data).map((t: any) => Team.fromJSON(JSON.stringify(t)));
          if (parsed.length > 0) {
            console.log("Loaded teams from storage:", parsed);
            this.teams = parsed;
            this.currentTeam = parsed[0];
          }
        } catch (e) {
          console.error("Failed to parse teams data from storage:", e);
        }
      }
    } else {
      console.warn("Not ready to load teams from storage!");
    }
  }

  addTeam(name: string, subteams: string[], youthTeam: boolean): boolean {
    if (this.teams.find(t => t.name == name)) { return false };
    this.teams.push(new Team(name, subteams, youthTeam));
    this.currentTeam = this.teams[this.teams.length - 1];
    return true;
  }

  deleteTeam(team: Team): boolean {
    if (this.teams.includes(team)) {
      this.teams.splice(this.teams.indexOf(team), 1);
      if (this.teams.length > 0) {
        this.currentTeam = this.teams[0];
      } else {
        this.currentTeam = null;
      }
      return true;
    }
    return false;
  }

  saveToStorage() {
    if (browser) {
      let data = JSON.stringify($state.snapshot(this.teams));
      localStorage.setItem(STORAGE_KEY, data);
    }
  }
}

export const teams = new Teams();