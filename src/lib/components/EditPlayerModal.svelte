<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";
    import type { Player } from "$lib/scripts/team.svelte";
    import { Position } from "$lib/scripts/team.svelte";

    let {
        showModal = $bindable(),
        playerToEdit,
    }: { showModal: boolean; playerToEdit: Player } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state(playerToEdit.name);
    let newMembership: string = $state(playerToEdit.membershipNum);
    let newPosition: Position = $state(playerToEdit.position);
    let newSubteam: string = $state(playerToEdit.subteam);
    let newNamed: boolean = $state(playerToEdit.named);
    let newYouthOptions: string = $state(playerToEdit.youthOptions);

    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            newName = playerToEdit.name;
            newMembership = playerToEdit.membershipNum;
            newPosition = playerToEdit.position;
            newSubteam = playerToEdit.subteam;
            newNamed = playerToEdit.named;
            newYouthOptions = playerToEdit.youthOptions;
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
            teams.currentTeam?.updatePlayer(
                playerToEdit,
                newName.trim(),
                newMembership.trim(),
                newPosition,
                newSubteam.trim(),
                newNamed,
                newYouthOptions.trim(),
            );
            dialog?.close();
            showModal = false;
        }}
    >
        <p>Player Name:</p>
        <input type="text" required bind:value={newName} />
        <p>Membership Number:</p>
        <input type="text" required bind:value={newMembership} />
        <p>Position:</p>
        <select bind:value={newPosition}>
            <option value={Position.ANY}>Any</option>
            <option value={Position.GK}>Goal Keeper</option>
            <option value={Position.DEF}>Defender</option>
            <option value={Position.CEN}>Center</option>
            <option value={Position.FWD}>Forward</option>
        </select>
        <p>Sub Team:</p>
        <select bind:value={newSubteam}>
            {#each teams.currentTeam?.subteams as subteam}
                <option value={subteam}>{subteam}</option>
            {/each}
            <option value="">Any</option>
        </select>
        <br />
        <label>
            <input type="checkbox" bind:checked={newNamed} />
            Named Player
        </label>
        {#if teams.currentTeam?.youthTeam}
            <p>Date of Birth:</p>
            <input type="date" bind:value={newYouthOptions} />
        {:else}
            <p>Youth Player or Helmet Waiver:</p>
            <select bind:value={newYouthOptions}>
                <option value="">Neither</option>
                <option value="Y">Youth Player</option>
                <option value="HW">Helmet Waiver</option>
            </select>
        {/if}
        <div style="margin-top: 1rem;">
            <button onclick={() => dialog?.close()}>Cancel</button>
            <button type="submit" class="primary">Confirm</button>
        </div>
    </form>
</dialog>
