import { browser } from "$app/environment";
import { Team } from "$lib/scripts/team.svelte"

const STORAGE_KEY = "teamsData";

class Teams {
  teams: Team[] = $state([]);
  currentTeam: Team | null = $state(null);
  private teamIndex: number = $state(0);

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
      let storedIndex = localStorage.getItem("teamIndex");
      if (storedIndex) {
        this.teamIndex = parseInt(storedIndex);
      }
    } else {
      console.warn("Not ready to load teams from storage!");
    }
  }

  addTeam(name: string, subTeamNames: string[], youthTeam: boolean): boolean {
    if (this.teams.find(t => t.name == name)) { return false };

    const newTeam = new Team(this.teamIndex++, name, youthTeam, 0, 0, undefined, undefined, subTeamNames, undefined);
    this.teams.push(newTeam);
    this.currentTeam = newTeam;
    return true;
  }

  deleteTeam(teamID: number): boolean {
    const team = this.teams.find(t => t.teamID === teamID);
    if (team) {
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
      localStorage.setItem("teamIndex", this.teamIndex.toString());
    }
  }
}

export const teams = new Teams();