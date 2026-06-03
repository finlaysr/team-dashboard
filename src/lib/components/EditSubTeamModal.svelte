<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";

    let {
        showModal = $bindable(),
        subTeamToEdit,
    }: { showModal: boolean; subTeamToEdit: string } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state(subTeamToEdit);

    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            newName = subTeamToEdit;
        }
    });

    function deleteSubTeam() {
        if (
            window.confirm(
                `Are you sure you want to delete the sub team "${subTeamToEdit}"? This action cannot be undone.`,
            )
        ) {
            teams.currentTeam?.deleteSubteam(subTeamToEdit);
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
            teams.currentTeam?.editSubteam(subTeamToEdit, newName.trim());
            dialog?.close();
        }}
    >
        <p>Edit Sub Team Name:</p>
        <input type="text" required bind:value={newName} />

        <div style="margin-top: 1rem;">
            <button onclick={() => dialog?.close()}>Cancel</button>
            <button class="danger" onclick={deleteSubTeam}>
                Delete Sub Team
            </button>
            <button type="submit" class="primary">Save Changes</button>
        </div>
    </form>
</dialog>
