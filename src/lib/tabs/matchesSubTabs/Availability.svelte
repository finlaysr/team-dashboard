<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import { Availability } from "$lib/scripts/match.svelte";
    import {
        Position,
        type SubTeamID,
        type PlayerID,
    } from "$lib/scripts/team.svelte";
    import type { MatchID } from "$lib/scripts/match.svelte";

    let {
        currentMatchID,
        subTeamID,
    }: { currentMatchID: MatchID; subTeamID: SubTeamID } = $props();

    let currentMatch = $derived(
        teams.currentTeam?.getMatches.getMatchByID(currentMatchID!),
    );

    let addingPlayer: boolean = $state(false);
    let playerToAdd: PlayerID | null = $state(null);
</script>

<div class="scroll">
    <div
        style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;"
    >
        {#each Object.values(Availability) as av}
            <p class={av.replace(" ", "-") + " player"}>
                {av}: {currentMatch?.getMatchPlayers.filter(
                    (mp) => mp.availability === av,
                ).length}
            </p>
        {/each}
    </div>
    <table>
        <thead>
            <tr>
                <th>Player</th>
                <th>Availability</th>
                <th>Sub Team</th>
                <th>Position</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>
            {#each currentMatch?.getMatchPlayers as matchPlayer (matchPlayer.playerID)}
                <tr>
                    <td>
                        {teams.currentTeam?.getPlayerByID(matchPlayer.playerID)
                            ?.name}
                    </td>

                    <td>
                        {#each Object.values(Availability) as av}
                            <label for={matchPlayer.playerID + av}>
                                <input
                                    type="radio"
                                    bind:group={matchPlayer.availability}
                                    value={av}
                                    class="test"
                                    id={matchPlayer.playerID + av}
                                />
                                {#if av === Availability.YES}
                                    <svg viewBox="0 -960 960 960">
                                        <path
                                            d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
                                        />
                                    </svg>
                                {:else if av === Availability.MAYBE}
                                    <svg viewBox="0 -960 960 960">
                                        <path
                                            d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"
                                        />
                                    </svg>
                                {:else if av === Availability.NO}
                                    <svg viewBox="0 -960 960 960">
                                        <path
                                            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                                        />
                                    </svg>
                                {:else if av === Availability.INJURED}
                                    <svg viewBox="0 -960 960 960">
                                        <path
                                            d="M420-340h120v-100h100v-120H540v-100H420v100H320v120h100v100Zm60 260q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"
                                        />
                                    </svg>
                                {:else if av === Availability.NO_REPLY}
                                    <svg viewBox="0 -960 960 960">
                                        <path
                                            d="m791-55-91-91q-49 32-104.5 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-60 17-115.5T146-700l-91-91 57-57 736 736-57 57ZM480-160q43 0 83.5-11t78.5-33L204-642q-22 38-33 78.5T160-480q0 133 93.5 226.5T480-160Zm334-100-58-58q22-38 33-78.5t11-83.5q0-133-93.5-226.5T480-800q-43 0-83.5 11T318-756l-58-58q49-32 104.5-49T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 60-17 115.5T814-260ZM537-537ZM423-423Z"
                                        />
                                    </svg>
                                {/if}
                            </label>
                        {/each}
                    </td>
                    <td>
                        <select bind:value={matchPlayer.matchSubTeam}>
                            {#each currentMatch?.getSubTeamsInvolved as subteam (subteam.subTeamID)}
                                <option value={subteam.subTeamID}>
                                    {teams.currentTeam?.getSubteamByID(
                                        subteam.subTeamID,
                                    )?.name}
                                </option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <select bind:value={matchPlayer.matchPosition}>
                            {#each Object.values(Position) as pos}
                                <option value={pos}>{pos}</option>
                            {/each}
                        </select>
                    </td>

                    <td>
                        <button
                            class="danger"
                            onclick={() =>
                                currentMatch?.removePlayer(
                                    matchPlayer.playerID,
                                )}
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if !addingPlayer}
        <button
            class="primary"
            style="margin-top: 1rem;"
            onclick={() => (addingPlayer = true)}
        >
            Add Player
        </button>
    {:else}
        <div
            style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;"
        >
            <p>Select player:</p>
            <form>
                <select bind:value={playerToAdd}>
                    <option value={null} disabled selected>
                        choose player
                    </option>
                    {#each teams.currentTeam?.players.filter((p) => !currentMatch?.getMatchPlayers.some((mp) => mp.playerID === p.playerID)) as player (player.playerID)}
                        <option value={player.playerID}>
                            {player.name}
                        </option>
                    {/each}
                </select>
                <button type="button" onclick={() => (addingPlayer = false)}>
                    Cancel
                </button>
                <button
                    type="submit"
                    class="primary"
                    onclick={() => {
                        if (playerToAdd != null) {
                            currentMatch?.addPlayer(playerToAdd);
                            playerToAdd = null;
                            addingPlayer = false;
                        }
                    }}>Add</button
                >
            </form>
        </div>
    {/if}
</div>

<style>
    table {
        background-color: #f9f9f9;
    }
    th {
        text-align: left;
        padding: 0.5rem;
    }

    select {
        padding: 0.25rem;
        font-size: 1rem;
    }

    input[type="radio"] {
        position: absolute;
        opacity: 0;
    }

    input[type="radio"] + svg {
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
    }

    input + svg {
        cursor: pointer;
    }

    label {
        display: inline-flex;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    svg {
        fill: grey;
        opacity: 0.5;
        height: 2rem;
        width: auto;
        margin: 0 0.2rem;
        padding: 0.2rem;
        background-color: transparent;
    }

    input:hover + svg,
    input:checked + svg,
    input:focus + svg {
        opacity: 1;
    }

    input[value="Yes"]:hover + svg,
    input[value="Yes"]:focus + svg,
    input[value="Yes"]:checked + svg {
        fill: var(--av-yes-fg);
    }

    input[value="Yes"]:checked + svg {
        background-color: var(--av-yes-bg);
        border-radius: 50%;
    }

    input[value="Maybe"]:hover + svg,
    input[value="Maybe"]:focus + svg,
    input[value="Maybe"]:checked + svg {
        fill: var(--av-maybe-fg);
    }

    input[value="Maybe"]:checked + svg {
        background-color: var(--av-maybe-bg);
        border-radius: 50%;
    }

    input[value="Injured"]:hover + svg,
    input[value="Injured"]:focus + svg,
    input[value="Injured"]:checked + svg {
        fill: var(--av-injured-fg);
    }

    input[value="Injured"]:checked + svg {
        background-color: var(--av-injured-bg);
        border-radius: 50%;
    }

    input[value="No"]:hover + svg,
    input[value="No"]:focus + svg,
    input[value="No"]:checked + svg {
        fill: var(--av-no-fg);
    }

    input[value="No"]:checked + svg {
        background-color: var(--av-no-bg);
        border-radius: 50%;
    }

    input[value="No Reply"]:hover + svg,
    input[value="No Reply"]:focus + svg,
    input[value="No Reply"]:checked + svg {
        fill: var(--av-no-reply-fg);
    }

    input[value="No Reply"]:checked + svg {
        background-color: var(--av-no-reply-bg);
        border-radius: 50%;
    }

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
