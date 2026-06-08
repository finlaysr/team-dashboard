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
    <p>Show:</p>
    {#each Object.values(Availability) as av}
        <label class={av.replace(" ", "-") + " player"} for={av}>
            <input
                type="checkbox"
                bind:checked={showAvailability[av]}
                id={av}
            />
            {av}
        </label>
    {/each}
</div>

<h3>Availabile</h3>
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
</style>
