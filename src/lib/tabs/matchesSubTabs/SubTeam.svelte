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

    let showAvailability: Record<Availability, boolean> = $state({
        [Availability.YES]: true,
        [Availability.MAYBE]: false,
        [Availability.INJURED]: false,
        [Availability.NO]: false,
        [Availability.NO_REPLY]: false,
    });
</script>

<div
    style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;"
>
    <p>Include:</p>
    {#each Object.values(Availability) as av}
        <label class={av.replace(" ", "-") + " player"} for={av}>
            <input
                type="checkbox"
                bind:checked={showAvailability[av]}
                id={av}
            />
            {av} ({currentMatch?.getMatchPlayers.filter(mp => mp.matchSubTeam === subTeamID && mp.availability === av).length})
        </label>
    {/each}
</div>

<h3>Lineup</h3>
{#each Object.values(Position) as pos}
    {let players = $derived(currentMatch?.getMatchPlayers.filter(mp => mp.matchSubTeam === subTeamID && mp.matchPosition === pos && showAvailability[mp.availability]))}
    <div class="rounded_block" style="padding: 0.5rem; ">
        <p style="margin: 0; padding: 0; color: #555;">{pos} ({players?.length}) </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                
            {#each players as player (player.playerID)}
                <p class={player.availability.replace(" ", "-") + " player"}>
                    {teams.currentTeam?.getPlayerByID(player.playerID)?.name}
                </p>
            {/each}
        </div>
    </div>
{/each}

<h3>Player List</h3>
{let allPlayers = $derived(currentMatch?.getMatchPlayers.filter(mp => mp.matchSubTeam === subTeamID && showAvailability[mp.availability]).map(mp => teams.currentTeam?.getPlayerByID(mp.playerID)?.name))}

<div class="rounded_block">
    <pre>{allPlayers?.join("\n")}</pre>
</div>

<button onclick={() => {
        navigator.clipboard.writeText(allPlayers?.join("\n") || "");
    }} >
    Copy Player List
</button>

<style>
    .player {
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin: 0.25rem 0;
        width: fit-content;
    }

    .Yes {
        background-color: var(--av-yes-bg);
        color: var(--av-yes-fg);
    }

    .Maybe {
        background-color: var(--av-maybe-bg);
        color: var(--av-maybe-fg);
    }

    .No {
        background-color: var(--av-no-bg);
        color: var(--av-no-fg);
    }

    .Injured {
        background-color: var(--av-injured-bg);
        color: var(--av-injured-fg);
    }

    .No-Reply {
        background-color: var(--av-no-reply-bg);
        color: var(--av-no-reply-fg);
    }

    pre {
        margin: 0;
        background-color: #f9f9f9;
        font-size: 0.875rem;
    }
    h3 {
        margin-bottom: 0.5rem;
    }

    :global(body.dark-mode) pre {
        background-color: #1b1e1f;
    }
</style>
