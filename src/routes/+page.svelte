<script lang="ts">
    import type { Team } from "$lib/scripts/team.svelte";
    import { teams } from "$lib/scripts/teams.svelte";
    import TeamLinesDoc from "$lib/tabs/TeamLinesDoc.svelte";
    import TeamTab from "$lib/tabs/TeamTab.svelte";
    import NewTeamModal from "$lib/components/NewTeamModal.svelte";

    let currTeam: Team | null = $derived(null);
    if (teams.teams.length > 0) {
        currTeam = teams.teams[0];
    }

    let tabs = $state([
        { name: "Team", comp: TeamTab },
        { name: "Team Lines", comp: TeamLinesDoc },
    ]);
    let currTab = $state(tabs[0]);

    let showNewTeam: boolean = $state(false);
</script>

<main>
    <div id="header">
        <h1>Team Dashboard</h1>
        {#if currTeam}
            <p style="padding: 0rem; margin: 0;">Current Team:</p>
            <form>
                <select bind:value={currTeam}>
                    {#each teams.teams as team}
                        <option value={team}>{team.name}</option>
                    {/each}
                </select>
            </form>
            <button onclick={() => (showNewTeam = true)}>
                Create New Team
            </button>
        {/if}
    </div>
    <NewTeamModal
        bind:showModal={showNewTeam}
        onCreated={(team) => (currTeam = team)}
    />
    {#if !currTeam}
        <div class="content">
            <h2>Welcome to the Team Dashboard!</h2>
            <p>To get started, please create a new team.</p>
            <button onclick={() => (showNewTeam = true)}>
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
            <currTab.comp team={currTeam} />
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
    }
</style>
