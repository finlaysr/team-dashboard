<script lang="ts">
    import NewPlayerModal from "$lib/components/NewPlayerModal.svelte";
    import EditSubTeamModal from "$lib/components/EditSubTeamModal.svelte";
    import NewSubTeamModal from "$lib/components/NewSubTeamModal.svelte";
    import EditTeamModal from "$lib/components/EditTeamModal.svelte";
    import EditPlayerModal from "$lib/components/EditPlayerModal.svelte";
    import type { Player } from "$lib/scripts/team.svelte";
    import { teams } from "$lib/scripts/teams.svelte";

    let showNewSubTeamModal: boolean = $state(false);
    let showNewPlayerModal: boolean = $state(false);
    let showEditSubTeamModal: boolean = $state(false);
    let subTeamToEdit: string = $state("");
    let showEditTeamModal: boolean = $state(false);
    let showEditPlayerModal: boolean = $state(false);
    let playerToEdit: Player | null = $state(null);
</script>

{#if teams.currentTeam}
    <EditSubTeamModal bind:showModal={showEditSubTeamModal} {subTeamToEdit} />
    <NewSubTeamModal
        bind:showModal={showNewSubTeamModal}
        team={teams.currentTeam}
    />
    <NewPlayerModal
        bind:showModal={showNewPlayerModal}
        team={teams.currentTeam}
    />
    {#if playerToEdit}
        <EditPlayerModal bind:showModal={showEditPlayerModal} {playerToEdit} />
    {/if}
    <EditTeamModal
        bind:showModal={showEditTeamModal}
        currentName={teams.currentTeam.name}
    />

    <div style="display: flex; gap: 1rem; align-items: center;">
        <h2>{teams.currentTeam?.name}</h2>
        {#if teams.currentTeam?.youthTeam}
            <p
                style="border: 1px solid #ccc; border-radius: 0.25rem; color: #555; padding: 0.2rem; margin: 0; font-size: 0.875rem;"
            >
                Youth Team
            </p>
        {/if}
    </div>
    <div class="rounded_block">
        <div class="top_row">
            <h3>Sub Teams:</h3>
            <button
                onclick={() => {
                    showNewSubTeamModal = true;
                }}
                class="primary"
            >
                New Sub Team
            </button>
        </div>

        <div style="display: flex; gap: 2rem; align-items: center;">
            {#each teams.currentTeam?.subteams as name (name)}
                <button
                    class="subteams"
                    onclick={() => {
                        subTeamToEdit = name;
                        showEditSubTeamModal = true;
                    }}
                >
                    {name}
                </button>
            {/each}
            <div></div>
        </div>
    </div>

    <div class="rounded_block">
        <div class="top_row">
            <h3>Players:</h3>
            <button
                onclick={() => {
                    showNewPlayerModal = true;
                }}
                class="primary"
            >
                New Player
            </button>
        </div>

        <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Membership No.</th>
                    <th>Position</th>
                    <th>Sub Team</th>
                    <th>Named Player</th>
                    {#if teams.currentTeam?.youthTeam}
                        <th>Date of Birth</th>
                    {:else}
                        <th>Youth Player (Y) or Helmet Waiver (HW)</th>
                    {/if}
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {#each teams.currentTeam?.players ?? [] as player (player.name)}
                    <tr>
                        <td> {player.name} </td>
                        <td> {player.membershipNum}</td>
                        <td> {player.position} </td>
                        <td> {player.subteam} </td>
                        <td> {player.named ? "Yes" : "No"} </td>
                        <td> {player.youthOptions} </td>
                        <td>
                            <button
                                onclick={() => {
                                    playerToEdit = player;
                                    showEditPlayerModal = true;
                                }}
                            >
                                Edit
                            </button>
                            <button
                                class="danger"
                                onclick={() => {
                                    if (
                                        window.confirm(
                                            `Are you sure you want to delete the player "${player.name}"? This action cannot be undone.`,
                                        )
                                    ) {
                                        teams.currentTeam?.deletePlayer(player);
                                    }
                                }}
                                >Delete
                            </button></td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
        <p
            style="margin-top: 1rem; margin-bottom: 0.5rem; color: #555; font-size: 0.875rem; padding: 0 1rem;"
        >
            {teams.currentTeam?.players.length} players shown
        </p>
    </div>

    <button
        onclick={() => {
            showEditTeamModal = true;
        }}
    >
        Edit Team
    </button>

    <button
        class="danger"
        onclick={() => {
            if (
                window.confirm(
                    `Are you sure you want to delete the team "${teams.currentTeam?.name}"? This action cannot be undone.`,
                )
            ) {
                teams.currentTeam && teams.deleteTeam(teams.currentTeam);
            }
        }}
    >
        Delete Team
    </button>
{/if}

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

    .subteams {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        padding: 0.25rem;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        background-color: #fff;
    }

    thead {
        background-color: #eee;
        border-bottom: 2px solid #ccc;
    }
</style>
