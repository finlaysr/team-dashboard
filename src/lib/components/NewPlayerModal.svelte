<script lang="ts">
    import type { Team } from "$lib/scripts/team.svelte";
    import { Position, Player } from "$lib/scripts/team.svelte";

    let { showModal = $bindable(), team }: { showModal: boolean; team: Team } =
        $props();
    let dialog: HTMLDialogElement | null = $state(null);

    let playerName: string = $state("");
    let membershipNum: string = $state("");
    let position: Position = $state(Position.ANY);
    let subTeams: string = $state(team.subteams[0] || "");
    let namedPlayer: boolean = $state(false);
    let youthOptions: string = $state("");
    $effect(() => {
        if (showModal) {
            dialog?.showModal();
            playerName = "";
            membershipNum = "";
            position = Position.ANY;
            subTeams = team.subteams[0] || "";
            namedPlayer = false;
            youthOptions = "";
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
    <h2>Create a New Player</h2>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            team.addPlayer(
                new Player(
                    playerName.trim(),
                    membershipNum.trim(),
                    position,
                    subTeams,
                    namedPlayer,
                    youthOptions.trim(),
                ),
            );
            dialog?.close();
        }}
    >
        <p>Player Name:</p>
        <input type="text" required bind:value={playerName} />
        <p>Membership Number:</p>
        <input type="text" required bind:value={membershipNum} />
        <p>Position:</p>
        <select bind:value={position}>
            <option value={Position.ANY}>Any</option>
            <option value={Position.GK}>Goal Keeper</option>
            <option value={Position.DEF}>Defender</option>
            <option value={Position.CEN}>Center</option>
            <option value={Position.FWD}>Forward</option>
        </select>
        <p>Sub Team:</p>
        <select bind:value={subTeams}>
            {#each team.subteams as subteam}
                <option value={subteam}>{subteam}</option>
            {/each}
            <option value="">Any</option>
        </select>
        <br />
        <label>
            <input type="checkbox" bind:checked={namedPlayer} />
            Named Player
        </label>
        {#if team.youthTeam}
            <p>Date of Birth:</p>
            <input type="date" bind:value={youthOptions} />
        {:else}
            <p>Youth Player or Helmet Waiver:</p>
            <select bind:value={youthOptions}>
                <option value="">Neither</option>
                <option value="Y">Youth Player</option>
                <option value="HW">Helmet Waiver</option>
            </select>
        {/if}
        <div style="margin-top: 1rem;">
            <button onclick={() => dialog?.close()}>Cancel</button>
            <button type="submit" class="primary">Create!</button>
        </div>
    </form>
</dialog>
