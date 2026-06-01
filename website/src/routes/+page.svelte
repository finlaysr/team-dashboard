<script>
  import { toSVG } from "$lib/scripts/team-lines-to-pdf";
  let input = $state("hello typst!");
  let output = $state("");
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
<button
  onclick={async () => {
    console.log("staring compiling");
    output = await toSVG(input);
  }}>Generate SVG</button
>
<textarea id="input" bind:value={input}></textarea>
<div id="content">{@html output}</div>
