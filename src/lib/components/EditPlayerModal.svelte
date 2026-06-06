<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import type { Player } from "$lib/scripts/team.svelte";
    import { Position } from "$lib/scripts/team.svelte";

    let {
        showModal = $bindable(),
        playerToEdit,
    }: { showModal: boolean; playerToEdit: Player } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state("");
    let newMembership: string = $state("");
    let newPosition: Position = $state(Position.ANY);
    let newSubTeamID: number = $state(-1);
    let newNamed: boolean = $state(false);
    let newYouthOptions: string = $state("");
    let showWarning: boolean = $state(false);

    $effect(() => {
        if (showModal) {
            newName = playerToEdit.name;
            newMembership = playerToEdit.membershipNum;
            newPosition = playerToEdit.position;
            newSubTeamID = playerToEdit.subTeamID;
            newNamed = playerToEdit.named;
            newYouthOptions = playerToEdit.youthOptions;
            showWarning = false;

            dialog?.showModal();
        }
    });
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => {
        if (e.target === dialog) dialog?.close();
    }}
>
    <h2>Edit Player</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            showWarning = !teams.currentTeam?.updatePlayer(
                playerToEdit.playerID,
                newName.trim(),
                newMembership.trim(),
                newPosition,
                newSubTeamID,
                newNamed,
                newYouthOptions.trim(),
            );
            console.log("Update result:", !showWarning);
            if (!showWarning) {
                dialog?.close();
                showModal = false;
            }
        }}
    >
        <p>Player Name:</p>
        <input type="text" required bind:value={newName} />
        <p>Membership Number:</p>
        <input type="text" bind:value={newMembership} />
        <p>Position:</p>
        <select bind:value={newPosition}>
            <option value={Position.ANY}>Any</option>
            <option value={Position.GK}>Goal Keeper</option>
            <option value={Position.DEF}>Defender</option>
            <option value={Position.CEN}>Center</option>
            <option value={Position.FWD}>Forward</option>
        </select>
        <p>Sub Team:</p>
        <select bind:value={newSubTeamID}>
            {#each teams.currentTeam?.subteams as subteam}
                <option value={subteam.subTeamID}>{subteam.name}</option>
            {/each}
            <option value="">Any</option>
        </select>
        <br />
        {#if teams.currentTeam?.youthTeam}
            <p>Date of Birth:</p>
            <input type="date" bind:value={newYouthOptions} />
        {:else}
            <label>
                <input type="checkbox" bind:checked={newNamed} />
                Named Player
            </label>
            <p>Youth Player or Helmet Waiver:</p>
            <select bind:value={newYouthOptions}>
                <option value="">Neither</option>
                <option value="Y">Youth Player</option>
                <option value="HW">Helmet Waiver</option>
            </select>
        {/if}
        <div style="margin-top: 1rem;">
            <button type="button" onclick={() => dialog?.close()}>Cancel</button
            >
            <button type="submit" class="primary">Confirm</button>
        </div>
        {#if showWarning}
            <p
                style="color: red; margin-top: 1rem; width: 100%; text-align: center;"
            >
                Could not update player.<br />
                Check that this player name is not aleady used.
            </p>
        {/if}
    </form>
</dialog>
