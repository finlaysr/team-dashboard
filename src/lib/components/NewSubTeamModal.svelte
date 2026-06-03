<script lang="ts">
    import type { Team } from "$lib/scripts/team.svelte";

    let { showModal = $bindable(), team }: { showModal: boolean; team: Team } =
        $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let newName: string = $state("");

    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            newName = "";
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
            team.addSubteam(newName.trim());
            dialog?.close();
        }}
    >
        <p>Sub Team Name:</p>
        <input type="text" required bind:value={newName} />

        <div style="margin-top: 1rem;">
            <button onclick={() => dialog?.close()}>Cancel</button>
            <button type="submit" class="primary">Create Sub Team</button>
        </div>
    </form>
</dialog>
