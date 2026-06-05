<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import NewMatchModal from "$lib/components/NewMatchModal.svelte";

    let showNewMatchModal: boolean = $state(false);
    let currentMatch = $derived.by(
        () => teams.currentTeam?.getMatches.currentMatch,
    );
</script>

<h2>Match Days</h2>

<NewMatchModal bind:showModal={showNewMatchModal} />
{#if teams.currentTeam?.getMatches}
    {#if !teams.currentTeam?.getMatches.currentMatch}
        <div class="content">
            <h3>Welcome to the Match Days Section</h3>
            <p>
                Here you can create match days, assign players to teams, and
                check availability.
            </p>
            <p>
                Any changes to player sub teams you make here won't affect the
                main team list.
            </p>
            <p>To get started, create your first match day!</p>
            <button class="primary" onclick={() => (showNewMatchModal = true)}>
                Create New Match
            </button>
        </div>
    {:else}
        <div class="rounded_block">
            <div class="top_row">
                <div class="top_row" style="gap: 1rem; flex-wrap: wrap;">
                    <h3>Current Match</h3>
                    <form>
                        <select bind:value={currentMatch}>
                            {#each teams.currentTeam?.getMatches.getMatches as match (match.getID)}
                                <option value={match}>{match.getDate}</option>
                            {/each}
                        </select>
                    </form>
                </div>

                <button
                    class="primary"
                    onclick={() => (showNewMatchModal = true)}
                >
                    Create New Match
                </button>
            </div>

            {#each currentMatch?.getSubTeamsInvolved as subteam (subteam.subteam)}
                <h4>{subteam.subteam} {subteam.description}</h4>
            {/each}
        </div>
    {/if}
{/if}

<style>
    select {
        padding: 0.25rem;
        font-size: 1rem;
    }
</style>
