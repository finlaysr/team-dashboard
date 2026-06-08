<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import type { MatchID } from "$lib/scripts/match.svelte";
    import type { SubTeamID } from "$lib/scripts/team.svelte";

    import NewMatchModal from "$lib/components/NewMatchModal.svelte";
    import AvailabilityTab from "$lib/tabs/matchesSubTabs/Availability.svelte";
    import SubTeamTab from "$lib/tabs/matchesSubTabs/SubTeam.svelte";

    let showNewMatchModal: boolean = $state(false);
    let currentMatchID: MatchID | null = $derived(
        teams.currentTeam?.getMatches.currentMatch || null,
    );

    let currentMatch = $derived(
        teams.currentTeam?.getMatches.getMatchByID(currentMatchID!),
    );

    let tabs: {
        name: string;
        comp: typeof SubTeamTab | typeof AvailabilityTab;
        subTeamID: SubTeamID;
    }[] = $derived(
        [{ name: "Availability", comp: AvailabilityTab, subTeamID: -1 }].concat(
            currentMatch?.getSubTeamsInvolved.map((subteam) => {
                return {
                    name:
                        teams.currentTeam?.getSubteamByID(subteam.subTeamID)
                            ?.name || "Sub Team",
                    comp: SubTeamTab,
                    subTeamID: subteam.subTeamID,
                };
            }) || [],
        ),
    );
    let currTab = $derived(tabs[0]);

    let currSubTeamTab: SubTeamID = $state(-1);

    // FIX: When adding first match, it doesn't appear unil second match added.
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
                        <select bind:value={currentMatchID}>
                            {#each teams.currentTeam?.getMatches.getMatches as match (match.getID)}
                                {let d = $derived(new Date(match.getDate))}
                                <option value={match.getID}
                                    >{d.toLocaleDateString("en-GB",  { year: 'numeric', month: 'long', day: 'numeric' })}</option
                                >
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

            <div class="tabs_container">
                <div class="tabs">
                    {#each tabs as tab}
                        <button
                            class:selected={currTab === tab}
                            onclick={() => {
                                currTab = tab;
                                currSubTeamTab = tab.subTeamID;
                            }}
                        >
                            {tab.name}
                        </button>
                    {/each}
                </div>

                <div class="tabs_content">
                    {#if currentMatchID}
                        <currTab.comp
                            {currentMatchID}
                            subTeamID={currSubTeamTab}
                        />
                    {/if}
                </div>
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

            <!-- {#each currentMatch?.getMatchPlayers as matchPlayer (matchPlayer.playerID)}
                <p>
                    {teams.currentTeam?.getPlayerByID(matchPlayer.playerID)
                        ?.name}
                    : {matchPlayer.availability}, {matchPlayer.matchSubTeam}, {matchPlayer.matchPosition}
                </p>
            {/each} -->
        </div>
    {/if}
{/if}

<style>
    .tabs_content {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 0 0 0.5rem 0.5rem;
        background-color: #fff;
    }

    .tabs {
        display: flex;
        flex-wrap: wrap;
    }

    .tabs button {
        background: none;
        border: 1px solid #ccc;
        border-bottom: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 1rem;
        border-radius: 0.75rem 0.75rem 0 0;
        transition:
            background-color 0.3s,
            font-weight 0.3s;
    }

    .tabs button.selected {
        background-color: #ddd;
        font-weight: bold;
    }
</style>
