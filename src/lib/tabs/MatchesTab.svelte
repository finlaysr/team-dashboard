<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import NewMatchModal from "$lib/components/NewMatchModal.svelte";
    import { Availability } from "$lib/scripts/match.svelte";

    let showNewMatchModal: boolean = $state(false);
    let currentMatch = $derived.by(() =>
        teams.currentTeam?.getMatches.getMatchByID(
            teams.currentTeam?.getMatches.currentMatch!,
        ),
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
                Any changes made here to player sub teams or positions won't
                affect the main team list.
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
                    <h3>Current Match Day</h3>
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

            {#each currentMatch?.getSubTeamsInvolved as subteam (subteam.subTeamID)}
                <h4>
                    {teams.currentTeam?.getSubteamByID(subteam.subTeamID)
                        ?.name}: {subteam.description}
                </h4>
            {/each}

            {#each Object.keys(currentMatch?.getmatchSubTeams || {}).map(Number) as player (player)}
                <p>
                    {teams.currentTeam?.getPlayerByID(player)?.name} - {currentMatch
                        ?.getmatchSubTeams[player]}
                    - {currentMatch?.getAvailability[player]}
                </p>
            {/each}

            <div class="scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Sub Team</th>
                            <th>Position</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each Object.keys(currentMatch?.getmatchSubTeams || {}).map(Number) as playerID (playerID)}
                            <tr>
                                <td
                                    >{teams.currentTeam?.getPlayerByID(playerID)
                                        ?.name}</td
                                >
                                <td
                                    >{teams.currentTeam?.getSubteamByID(
                                        currentMatch?.getmatchSubTeams[
                                            playerID
                                        ]!,
                                    )?.name}</td
                                >
                                <td
                                    >{currentMatch?.getMatchPositions[
                                        playerID
                                    ]}</td
                                >
                                <td>
                                    <select
                                        onchange={(e) => {
                                            const target =
                                                e.target as HTMLSelectElement;
                                            currentMatch?.setAvailability(
                                                playerID,
                                                target.value as Availability,
                                            );
                                            teams.saveToStorage();
                                        }}
                                    >
                                        {#each Object.values(Availability) as av}
                                            <option value={av}>{av}</option>
                                        {/each}
                                    </select>
                                </td>
                                <td> </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <button
                class="danger"
                onclick={() => {
                    if (currentMatch) {
                        if (
                            window.confirm(
                                "Are you sure you want to delete this match?",
                            )
                        ) {
                            teams.currentTeam?.getMatches.deleteMatch(
                                currentMatch,
                            );
                        }
                    }
                }}
                style="margin-top: 1rem;"
            >
                Delete Match Day
            </button>
        </div>
    {/if}
{/if}

<style>
    select {
        padding: 0.25rem;
        font-size: 1rem;
    }
</style>
