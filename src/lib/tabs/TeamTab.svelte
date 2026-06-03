<script lang="ts">
    import NewPlayerModal from "$lib/components/NewPlayerModal.svelte";
    import type { Team } from "$lib/scripts/team.svelte";
    import { Player, Position } from "$lib/scripts/team.svelte";
    let { team }: { team: Team } = $props();

    let showNewPlayerModal: boolean = $state(false);
</script>

<h2>{team.name}</h2>

<NewPlayerModal bind:showModal={showNewPlayerModal} {team} />

<div style="display: flex; gap: 2rem; align-items: center;">
    <h3>Sub Teams:</h3>
    {#each team.subteams as name (name)}
        <p
            style="border: 1px solid #ccc; padding: 0.2rem; border-radius: 0.25rem;"
        >
            {name}
        </p>
    {/each}
    <div>
        <button
            onclick={() => {
                const newSubTeam = prompt("Enter new sub team name:");
                if (newSubTeam) {
                    team.addSubteam(newSubTeam);
                    console.log("Added sub team:", team.subteams);
                }
            }}
        >
            New Sub Team
        </button>
    </div>
</div>

<div style="display: flex; gap: 2rem; align-items: center;">
    <h3>Players:</h3>
    <button
        onclick={() => {
            showNewPlayerModal = true;
        }}
    >
        New Player
    </button>
</div>

<table style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Sub Team</th>
            <th>Named Player</th>
        </tr>
    </thead>

    <tbody>
        {#each team.players as player (player.name)}
            <tr>
                <td> {player.name} </td>
                <td> {player.position} </td>
                <td> {player.subteam} </td>
                <td> {player.named ? "Yes" : "No"} </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table,
    th,
    td {
        border: 1px solid #ccc;
    }
    td,
    tr {
        padding: 0.5rem;
    }
</style>
