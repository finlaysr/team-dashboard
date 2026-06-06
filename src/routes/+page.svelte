<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import TeamLinesDoc from "$lib/tabs/TeamLinesDoc.svelte";
    import TeamTab from "$lib/tabs/TeamTab.svelte";
    import NewTeamModal from "$lib/components/NewTeamModal.svelte";
    import MatchesTab from "$lib/tabs/MatchesTab.svelte";
    import { onMount } from "svelte";
    let loaded = $state(false);
    onMount(() => {
        if (!loaded) {
            teams.loadFromStorage();
            loaded = true;
        }
    });

    let tabs = $state([
        { name: "Team", comp: TeamTab },
        { name: "Matches", comp: MatchesTab },
        { name: "Team Lines", comp: TeamLinesDoc },
    ]);
    let currTab = $state(tabs[0]);
    let showNewTeamModal: boolean = $state(false);

    // Save teams to localStorage whenever they change
    $effect(() => {
        teams.saveToStorage();
    });
</script>

<main>
    <NewTeamModal bind:showModal={showNewTeamModal} />

    <div id="header">
        <h1>Team Dashboard</h1>
        <div
            style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;"
        >
            {#if teams.teams.length > 0}
                <p style="padding: 0rem; margin: 0;">Current Team:</p>
                <form>
                    <select bind:value={teams.currentTeam}>
                        {#each teams.teams as team}
                            <option value={team}>{team.name}</option>
                        {/each}
                    </select>
                </form>
                <button
                    onclick={() => (showNewTeamModal = true)}
                    class="primary"
                >
                    Create New Team
                </button>
            {/if}
        </div>
    </div>

    {#if loaded}
        {#if teams.teams.length === 0 || !teams.currentTeam}
            <div class="content">
                <h2>Welcome to the Team Dashboard!</h2>
                <p>To get started, please create a new team!</p>
                <button
                    onclick={() => (showNewTeamModal = true)}
                    class="primary"
                >
                    Create New Team
                </button>
            </div>
        {:else}
            <div class="tabs">
                {#each tabs as tab}
                    <button
                        class:selected={currTab === tab}
                        onclick={() => (currTab = tab)}
                    >
                        {tab.name}
                    </button>
                {/each}
            </div>

            <div class="content">
                {#if teams.currentTeam}
                    <currTab.comp />
                {/if}
            </div>
        {/if}
    {:else}
        <div class="content">
            <h2>Loading teams...</h2>
        </div>
    {/if}
</main>

<style>
    .tabs {
        display: flex;
        width: 100%;
        background-color: #eee;
        flex-wrap: wrap;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: #eee;
        cursor: pointer;
        font-size: 1.25rem;
        border-radius: 0;
    }

    .tabs button.selected {
        background-color: #ddd;
        font-weight: bold;
    }

    form {
        display: inline-block;
    }

    #header {
        background-color: #083e00;
        color: white;
        padding: 1.5rem 1.5rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        #header {
            padding: 1rem;
            gap: 1rem;
        }

        #header h1 {
            font-size: 1.5rem;
        }

        #header select {
            font-size: 0.9rem;
            padding: 0.2rem;
        }
    }

    #header h1 {
        margin: 0;
        padding: 0;
    }

    #header p {
        margin: 0;
        padding: 0;
    }

    #header button {
        margin: 0;
    }

    #header select {
        padding: 0.25rem;
        font-size: 1rem;
    }

    select {
        padding: 0.25rem;
        font-size: 1rem;
    }
</style>
