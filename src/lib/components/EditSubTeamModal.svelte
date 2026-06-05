<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";

    let {
        showModal = $bindable(),
        subTeamIDToEdit,
    }: { showModal: boolean; subTeamIDToEdit: number } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state("");
    let showWarning: boolean = $state(false);

    $effect(() => {
        if (showModal) {
            newName =
                teams.currentTeam?.getSubteamByID(subTeamIDToEdit)?.name || "";
            showWarning = false;

            dialog?.showModal();
        }
    });

    function deleteSubTeam() {
        if (
            window.confirm(
                `Are you sure you want to delete the sub team "${teams.currentTeam?.getSubteamByID(subTeamIDToEdit)?.name}"? This action cannot be undone.`,
            )
        ) {
            teams.currentTeam?.deleteSubteam(subTeamIDToEdit);
            dialog?.close();
        }
    }
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => {
        if (e.target === dialog) dialog?.close();
    }}
>
    <h2>Edit Sub Team</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            showWarning = !teams.currentTeam?.editSubteam(
                subTeamIDToEdit,
                newName.trim(),
            );
            if (!showWarning) {
                dialog?.close();
                showModal = false;
            }
        }}
    >
        <p>Edit Sub Team Name:</p>
        <input type="text" required bind:value={newName} />

        <div style="margin-top: 1rem;">
            <button type="button" onclick={() => dialog?.close()}>Cancel</button
            >
            <button class="danger" onclick={deleteSubTeam}>
                Delete Sub Team
            </button>
            <button type="submit" class="primary">Save Changes</button>
        </div>
        {#if showWarning}
            <p
                style="color: red; margin-top: 1rem; width: 100%; text-align: center;"
            >
                Could not update sub team.<br />
                Check that this sub team name is not aleady used.
            </p>
        {/if}
    </form>
</dialog>
