<script lang="ts">
  import { toSVG, toPDF } from "$lib/scripts/team-lines-to-pdf";
  let input = $state("= Welcome! \n hello typst! \\ $1/2$");
  let output = $state("");

  async function pdfButton() {
    console.log("staring compiling");
    let pdfBlob = await toPDF(input);
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

<textarea bind:value={input} rows="10" cols="100"></textarea>
<br />
<button
  onclick={async () => {
    console.log("staring previewing");
    output = await toSVG(input);
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
