<script lang="ts">
    import { TeamLinesDoc } from "$lib/scripts/teamLinesDoc";
    import type { teamLinesDocInputs, TeamLinePlayer } from "$lib/scripts/teamLinesDoc";
    import  { type MatchID, Availability } from "$lib/scripts/match.svelte";
    import type { SubTeam } from "$lib/scripts/team.svelte";
    import { onMount } from "svelte";
    import loadingSvg from "$lib/assets/loading.svg";
    import { teams } from "$lib/scripts/teams.svelte";

    let selectedMatch: MatchID | null = $state(null);
    let selectedSubTeam: SubTeam | null = $state(null);

    let inputs: teamLinesDocInputs = $state({
        competition: "",
        date: "",
        homeTeam: "",
        visitors: "",
        players: [],
        substitutes: [],
        referee: "",
        printName: "",
        club: "",
        options: {
            youthCompetition: false,
            playerCount: 12,
            subCount: 5,
        },
    });

    let output = $state("");
    let teamLinesDoc = new TeamLinesDoc();
    let loading = $state(true);

    onMount(async () => {
        await teamLinesDoc.init().catch((error) => {
            console.error("Failed to initialize Typst:", error);
        });
        await teamLinesDoc.updateData(inputs);
        output = await teamLinesDoc.toSVG();
        loading = false;
    });

    async function pdfButton() {
        console.log("staring compiling");
        let pdfBlob = await teamLinesDoc.toPDF();
        if (!pdfBlob) {
            alert("Failed to generate PDF!");
            return;
        }
        let url = URL.createObjectURL(pdfBlob);
        window.open(url);
    }

    // add players when match set
    $effect(() => {
        console.log("changing now!");
        if (selectedMatch === null || selectedSubTeam === null) return;
        let players = teams.currentTeam?.getMatches
            .getMatchByID(selectedMatch)?.getMatchPlayers.filter((mp) => {
                return mp.matchSubTeam === selectedSubTeam!.subTeamID && mp.availability === Availability.YES;
            });

        if (!players) return;
        let teamPlayers: {sub: boolean, player: TeamLinePlayer}[] = players.map((mp) => {
            let p = teams.currentTeam?.getPlayerByID(mp.playerID)!
            return {sub: mp.substitute, 
                    player: {
                        num: "",
                        name: p.name,
                        membNum: p.membershipNum,
                        youthHelmet: p.youthOptions
            }}});
        inputs.players = teamPlayers.filter(tp => !tp.sub).map(tp => tp.player);
        inputs.substitutes = teamPlayers.filter(tp => tp.sub).map(tp => tp.player);
        })

    $effect(() => {
        inputs.options.youthCompetition = teams.currentTeam?.youthTeam!;
    })

    //make preview update on input change
    $effect(() => {
        if (loading) return;
        teamLinesDoc.updateData(inputs).then(() => {
            teamLinesDoc.toSVG().then((svg) => {
                output = svg;
            });
        });
    });
</script>

<h2>Team Lines Generator</h2>
<div style="display: flex; gap: 2rem; flex-wrap: wrap;">
    <div class="rounded_block" style="flex: 1;">
        {#if teams.currentTeam?.getMatches.getMatches.length! > 0}
            <h3>Inputs:</h3>
            <form>

                <div
                    style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;"
                >
                    <h4 style="grid-column: 1 / span 2; margin-bottom: 0; padding-bottom: 0">Choose Match:</h4>
                    <p style="grid-column: 1 / span 2; padding-left: 0.25rem;">All players marked as available will be added to the document.</p>
                    <p style="padding: 0.25rem; margin: 0;">Match:</p>
                        <select bind:value={selectedMatch}>
                            {#each teams.currentTeam?.getMatches.getMatches as match (match.getID)}
                                {let d = $derived(new Date(match.getDate))}
                                <option value={match.getID}>{d.toLocaleDateString("en-GB",  { year: 'numeric', month: 'long', day: 'numeric' })}</option>
                            {/each}
                        </select>
                        {#if selectedMatch}
                            <p style="padding: 0.25rem; margin: 0;">Sub Team:</p>
                            <select bind:value={selectedSubTeam}>
                            {#each teams.currentTeam?.getMatches.getMatchByID(selectedMatch)?.getSubTeamsInvolved as subTeam (subTeam.subTeamID)}
                                <option value={subTeam}>{teams.currentTeam?.getSubteamByID(subTeam.subTeamID)?.name}: {subTeam.description}</option>
                            {/each}
                            </select>
                        {/if}
                    

                    <h4 style="grid-column: 1 / span 2;">Other Info:</h4>
                    <p style="padding: 0.25rem; margin: 0;">Competition:</p>
                    <input type="text" bind:value={inputs.competition} />
                    <p style="padding: 0.25rem; margin: 0;">Date:</p>
                    <input type="text" bind:value={inputs.date} />
                    <p style="padding: 0.25rem; margin: 0;">Home Team:</p>
                    <input type="text" bind:value={inputs.homeTeam} />
                    <p style="padding: 0.25rem; margin: 0;">Visitors:</p>
                    <input type="text" bind:value={inputs.visitors} />
                    <p style="padding: 0.25rem; margin: 0;">Referee:</p>
                    <input type="text" bind:value={inputs.referee} />
                    <p style="padding: 0.25rem; margin: 0;">Print Name:</p>
                    <input type="text" bind:value={inputs.printName} />
                    <p style="padding: 0.25rem; margin: 0;">Club:</p>
                    <input type="text" bind:value={inputs.club} />
                    <p style="padding: 0.25rem; margin: 0;">Player Count:</p>
                    <input
                        type="number"
                        bind:value={inputs.options.playerCount}
                        min="0"
                        max="20"
                    />
                    <p style="padding: 0.25rem; margin: 0;">Substitute Count:</p>
                    <input
                        type="number"
                        bind:value={inputs.options.subCount}
                        min="0"
                        max="10"
                    />
                    <p style="padding: 0.25rem; margin: 0;">Youth Competition:</p>
                    <input
                        type="checkbox"
                        bind:checked={inputs.options.youthCompetition}
                    />
                </div>
            </form>
            <br />
            <button
                onclick={async () => {
                    console.log("staring previewing");
                    await teamLinesDoc.updateData(inputs);
                    output = await teamLinesDoc.toSVG();
                }}>Update Preview</button
            >

            <button
                onclick={async () => {
                    console.log("staring compiling");
                    await teamLinesDoc.updateData(inputs);
                    await pdfButton();
                }}>Generate PDF</button
            >
        {:else}
            <h3>Welcome to the Team Lines Document Generator!</h3>
            <p>Here you can create a team lines document based on a match you have created.</p>
            <p>To get started, please first create a match.</p>
        {/if}
    </div>

    <div class="rounded_block">
        <h3>Output:</h3>
        {#if loading}
            <p>Loading...</p>
            <img
                src={loadingSvg}
                alt="Loading..."
                class="spinning"
                width="50px"
            />
        {:else}
            <div
                style="border: 1px solid #ccc; width: fit-content; height: fit-content; background: white;"
            >
                {@html output}
            </div>
        {/if}
    </div>
</div>

<style>
    .spinning {
        animation: spin 2.5s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    h3 {
        margin-bottom: 0.5rem;
    }
</style>
