<script lang="ts">
    import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";
    import { teams } from "$lib/scripts/teams.svelte";
    let { showModal = $bindable() }: { showModal: boolean } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let date: string = $state("");
    let showWarning: boolean = $state(false);
    let subTeamsCheckboxes: boolean[] = $state([]);
    let subTeamsDesc: string[] = $state([]);
    let onlySubTeamPlayers: boolean = $state(false);

    $effect(() => {
        if (showModal) {
            date = "";
            showWarning = false;
            subTeamsCheckboxes = [];
            subTeamsDesc = [];
            dialog?.showModal();
        }
    });

    function getSubTeamsInvolved(): SubTeamsInvloved[] {
        if (teams.currentTeam == null) {
            return [];
        }
        return subTeamsCheckboxes
            .entries()
            .filter(([_, checked]) => checked)
            .map(([i, _]) => {
                return {
                    subTeamID: teams.currentTeam!.subteams[i].subTeamID,
                    description: subTeamsDesc[i]?.trim() || "",
                };
            })
            .toArray();
    }
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => {
        if (e.target === dialog) dialog?.close();
    }}
>
    <h2>Create New Match Day</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            if (
                getSubTeamsInvolved().length === 0 ||
                getSubTeamsInvolved().some((st) => st.description === "")
            ) {
                showWarning = true;
                return;
            }
            showWarning = !teams.currentTeam?.getMatches.addMatch(
                date,
                getSubTeamsInvolved(),
                onlySubTeamPlayers,
            );
            if (!showWarning) {
                dialog?.close();
            }
        }}
    >
        <p>Match Date:</p>
        <input type="date" required bind:value={date} />
        <br />
        <label
            ><input
                type="checkbox"
                bind:checked={onlySubTeamPlayers}
                style="margin: 0.5rem 0;"
            />
            Include only players from the specified subteams</label
        >

        <p>Subteams Involved:</p>
        {#each teams.currentTeam?.subteams as { subTeamID, name }, i}
            <div>
                <label
                    ><input
                        type="checkbox"
                        bind:checked={subTeamsCheckboxes[i]}
                    />
                    {name}</label
                >
                <input
                    type="text"
                    bind:value={subTeamsDesc[i]}
                    placeholder="Description"
                />
            </div>
        {/each}

        <div style="margin-top: 1rem;">
            <button type="button" onclick={() => dialog?.close()}>Cancel</button
            >
            <button type="submit" class="primary">Create!</button>
        </div>
        {#if showWarning}
            <p
                style="color: red; margin-top: 1rem; width: 100%; text-align: center; white-space: normal; overflow-wrap: anywhere;"
            >
                Could not create match. <br />
                Check that you have selected some subteams <br />
                and provided descriptions for the selected subteams.<br />
            </p>
        {/if}
    </form>
</dialog>
