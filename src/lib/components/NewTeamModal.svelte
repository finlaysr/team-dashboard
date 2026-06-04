<script lang="ts">
    import { teams } from "$lib/scripts/teams.svelte";

    let { showModal = $bindable() }: { showModal: boolean } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let teamName: string = $state("");
    let subTeams: string[] = $state([]);
    let subTeamCount = $state(1);
    let youthTeam: boolean = $state(false);
    let showWarning: boolean = $state(false);

    $effect(() => {
        if (showModal) {
            subTeamCount = 1;
            teamName = "";
            subTeams = ["First Team"];
            youthTeam = false;
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
    <h2>Create a New Team</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            showWarning = !teams.addTeam(teamName, subTeams, youthTeam);
            if (!showWarning) {
                dialog?.close();
            }
        }}
    >
        <p>Team Name:</p>
        <input type="text" required bind:value={teamName} />
        <p>Sub Teams:</p>
        <div
            style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;"
        >
            <div>
                {#each Array(subTeamCount) as _, i}
                    <input
                        type="text"
                        required={i === 0}
                        bind:value={subTeams[i]}
                    />
                    <br />
                {/each}
            </div>

            <button
                type="button"
                onclick={() => {
                    subTeamCount += 1;
                }}>New Sub Team</button
            >
        </div>
        <p>
            <label
                ><input type="checkbox" bind:checked={youthTeam} /> Youth Team</label
            >
        </p>
        <div style="margin-top: 1rem;">
            <button type="button" onclick={() => dialog?.close()}>Cancel</button
            >
            <button type="submit" class="primary">Create!</button>
        </div>
        {#if showWarning}
            <p
                style="color: red; margin-top: 1rem; width: 100%; text-align: center;"
            >
                Could not create team.<br />
                Check that this team name is not already used.
            </p>
        {/if}
    </form>
</dialog>

<style>
</style>
