<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";

    let {
        showModal = $bindable(),
        onCreated,
    }: { showModal: boolean; onCreated: (team: any) => void } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let teamName: string = $state("");
    let subTeams: string[] = $state(["First Team"]);
    let subTeamCount = $state(1);

    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            subTeamCount = 1;
            teamName = "";
            subTeams = ["First Team"];
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
    <h2>Create a New Team</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            teams.addTeam(teamName, subTeams);
            const newTeam = $derived(teams.teams[teams.teams.length - 1]);
            onCreated(newTeam);
        }}
    >
        <p>Team Name:</p>
        <input type="text" required bind:value={teamName} />
        <p>Sub Teams:</p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            {#each Array(subTeamCount) as _, i}
                <input
                    type="text"
                    required={i === 0}
                    bind:value={subTeams[i]}
                />
            {/each}
            <button
                type="button"
                onclick={() => {
                    subTeamCount += 1;
                }}>New Sub Team</button
            >
        </div>
        <div style="margin-top: 1rem;">
            <button type="submit" onclick={() => dialog?.close()}
                >Create!</button
            >
            <button onclick={() => dialog?.close()}>Cancel</button>
        </div>
    </form>
</dialog>

<style>
</style>
