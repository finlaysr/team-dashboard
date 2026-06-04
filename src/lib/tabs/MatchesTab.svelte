<script lang="ts">
    import { matches } from "$lib/scripts/matches.svelte";
    import NewMatchModal from "$lib/components/NewMatchModal.svelte";

    let showNewMatchModal: boolean = $state(false);
</script>

<h2>Match Days</h2>

<NewMatchModal bind:showModal={showNewMatchModal} />

{#if !matches.getCurrentMatch}
    <div class="content">
        <h3>Welcome to the Matche Days Section</h3>
        <p>
            Here you can create match days, assign players to teams, and check
            availability
        </p>
        <p>To get started, create your first match day!</p>
        <button class="primary" onclick={() => (showNewMatchModal = true)}>
            Create New Match
        </button>
    </div>
{:else}
    <div class="rounded_block">
        <div class="top_row">
            <h3>All Match Days</h3>
            <button class="primary" onclick={() => (showNewMatchModal = true)}>
                Create New Match
            </button>
        </div>

        {#each matches.getMatches as match (match.getID)}
            <h4>{match.getDate}</h4>
        {/each}
    </div>
{/if}
