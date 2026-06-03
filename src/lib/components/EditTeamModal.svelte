<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";

    let {
        showModal = $bindable(),
        currentName,
    }: { showModal: boolean; currentName: string } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state(currentName);
    let newYouthTeam: boolean = $state(teams.currentTeam?.youthTeam || false);

    $effect(() => {
        if (showModal) {
            newName = currentName;
            newYouthTeam = teams.currentTeam?.youthTeam || false;
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
    <h2>Edit Team {currentName}</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            teams.currentTeam?.updateTeam(newName.trim(), newYouthTeam);
            showModal = false;
            dialog?.close();
        }}
    >
        <p>Edit Team Name:</p>
        <input type="text" required bind:value={newName} />
        <p>
            <label
                ><input type="checkbox" bind:checked={newYouthTeam} /> Youth Team</label
            >
        </p>
        <div style="margin-top: 1rem;">
            <button onclick={() => dialog?.close()}>Cancel</button>
            <button type="submit" class="primary">Save Changes</button>
        </div>
    </form>
</dialog>
