<script lang="ts">
  import { TeamLinesDoc } from "$lib/scripts/teamLinesDoc";
  import type { teamLinesDocInputs } from "$lib/scripts/teamLinesDoc";
  import { onMount } from "svelte";
  let output = $state("");
  let teamLinesDoc = new TeamLinesDoc();

  onMount(async () => {
    await teamLinesDoc.init().catch((error) => {
      console.error("Failed to initialize Typst:", error);
    });
    output = await teamLinesDoc.toSVG();
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
    options: { u17Competition: false },
  });
</script>

<h1>Team Lines Generator</h1>
<div style="display: flex; gap: 2rem;">
  <div>
    <h2>Inputs:</h2>
    <form>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
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
  </div>

  <div>
    <h2>Output:</h2>
    <div
      style="border: 1px solid #000; width: fit-content; height: fit-content;"
    >
      {@html output}
    </div>
  </div>
</div>
