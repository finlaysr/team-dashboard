<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import { Position, type SubTeamID } from "$lib/scripts/team.svelte";
    import type { MatchID } from "$lib/scripts/match.svelte";
    import { Availability } from "$lib/scripts/match.svelte";

    let {
        currentMatchID,
        subTeamID,
    }: { currentMatchID: MatchID; subTeamID: SubTeamID } = $props();

    let currentMatch = $derived(
        teams.currentTeam?.getMatches.getMatchByID(currentMatchID!),
    );
</script>

<h3>Availabile</h3>
{#each Object.values(Position) as pos}
    <h4>{pos}</h4>
    {#each currentMatch?.getMatchPlayers.filter((mp) => mp.matchSubTeam === subTeamID && mp.matchPosition === pos && mp.availability === Availability.YES) as player (player.playerID)}
        <p>{teams.currentTeam?.getPlayerByID(player.playerID)?.name}</p>
    {/each}
{/each}
