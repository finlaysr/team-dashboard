<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import TeamLinesDoc from "$lib/tabs/TeamLinesDoc.svelte";
    import TeamTab from "$lib/tabs/TeamTab.svelte";
    import NewTeamModal from "$lib/components/NewTeamModal.svelte";

    let tabs = $state([
        { name: "Team", comp: TeamTab },
        { name: "Team Lines", comp: TeamLinesDoc },
    ]);
    let currTab = $state(tabs[0]);

    let showNewTeamModal: boolean = $state(false);
</script>

<main>
    <NewTeamModal bind:showModal={showNewTeamModal} />

    <div id="header">
        <h1>Team Dashboard</h1>
        {#if teams.teams.length > 0}
            <p style="padding: 0rem; margin: 0;">Current Team:</p>
            <form>
                <select bind:value={teams.currentTeam}>
                    {#each teams.teams as team}
                        <option value={team}>{team.name}</option>
                    {/each}
                </select>
            </form>
            <button onclick={() => (showNewTeamModal = true)} class="primary">
                Create New Team
            </button>
        {/if}
    </div>

    {#if teams.teams.length === 0 || !teams.currentTeam}
        <div class="content">
            <h2>Welcome to the Team Dashboard!</h2>
            <p>To get started, please create a new team.</p>
            <button onclick={() => (showNewTeamModal = true)} class="primary">
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
</main>

<style>
    .tabs {
        display: flex;
        width: 100%;
        background-color: #eee;
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
        padding: 0.5rem 1rem;
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .content {
        padding: 1rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    select {
        padding: 0.25rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        border: 1px solid #ccc;
    }
</style>
