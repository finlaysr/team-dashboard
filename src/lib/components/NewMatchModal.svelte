<script lang="ts">
    import type { SubTeamsInvloved } from "$lib/scripts/match.svelte";
    import { teams } from "$lib/scripts/teams.svelte";
    import type { Player, Position } from "$lib/scripts/team.svelte";
    let { showModal = $bindable() }: { showModal: boolean } = $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let date: string = $state("");
    let showWarning: boolean = $state(false);
    let subTeamsCheckboxes: boolean[] = $state([]);
    let subTeamsDesc: string[] = $state([]);

    $effect(() => {
        if (showModal) {
            date = "";

            dialog?.showModal();
        }
    });

    function getPastSubteams(): Map<Player, Position> {
        let map: Map<Player, Position> = new Map();
        teams.currentTeam?.players.forEach((p) => {
            map.set(p, p.position);
        });
        return map;
    }

    function getSubTeamsInvolved(): SubTeamsInvloved[] {
        if (teams.currentTeam == null) {
            return [];
        }
        console.log("chekcboxes: ", $state.snapshot(subTeamsCheckboxes));
        console.log("Desc: ", $state.snapshot(subTeamsDesc));
        let values = subTeamsCheckboxes
            .entries()
            .filter(([_, v]) => v)
            .map(([i, _]) => {
                return {
                    subteam: teams.currentTeam!.subteams[i],
                    description: subTeamsDesc[i].trim(),
                };
            })
            .toArray();
        console.log("Subteams: ", JSON.stringify(values));
        return values;
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
            showWarning = !teams.currentTeam?.addMatch(
                date,
                getPastSubteams(),
                getSubTeamsInvolved(),
            );
            if (!showWarning) {
                dialog?.close();
            }
        }}
    >
        <p>Match Date:</p>
        <input type="date" required bind:value={date} />
        <p>Subteams Involved:</p>
        {#each teams.currentTeam?.subteams as subteam, i}
            <div>
                <label
                    ><input
                        type="checkbox"
                        bind:checked={subTeamsCheckboxes[i]}
                    />{subteam}</label
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
                style="color: red; margin-top: 1rem; width: 100%; text-align: center;"
            >
                Could not create match.<br />
            </p>
        {/if}
    </form>
</dialog>
