<script lang="ts">
  import { TeamLinesDoc } from "$lib/scripts/team-lines-to-pdf";
  import { onMount } from "svelte";
  let output = $state("");
  let teamLinesDoc = new TeamLinesDoc();

  onMount(async () => {
    await teamLinesDoc.init().catch((error) => {
      console.error("Failed to initialize Typst:", error);
    });
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
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>

<button
  onclick={async () => {
    console.log("staring previewing");
    output = await teamLinesDoc.toSVG();
  }}>Generate SVG</button
>
<button
  onclick={async () => {
    console.log("staring compiling");
    await pdfButton();
  }}>Generate PDF</button
>
<p>Output:</p>
<div style="border: 1px solid #000; width: fit-content; height: fit-content;">
  {@html output}
</div>
