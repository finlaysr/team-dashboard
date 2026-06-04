<script lang="ts">
    import type { Team } from "$lib/scripts/team.svelte";

    let { showModal = $bindable(), team }: { showModal: boolean; team: Team } =
        $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state("");
    let showWarning: boolean = $state(false);

    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            newName = "";
            showWarning = false;
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
    <h2>Create Sub Team</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            showWarning = !team.addSubteam(newName.trim());
            if (!showWarning) {
                dialog?.close();
            }
        }}
    >
        <p>Sub Team Name:</p>
        <input type="text" required bind:value={newName} />

        <div style="margin-top: 1rem;">
            <button type="button" onclick={() => dialog?.close()}>Cancel</button
            >
            <button type="submit" class="primary">Create Sub Team</button>
        </div>
        {#if showWarning}
            <p
                style="color: red; margin-top: 1rem; width: 100%; text-align: center;"
            >
                Could not create sub team.<br />
                Check that this sub team name is not already used.
            </p>
        {/if}
    </form>
</dialog>
