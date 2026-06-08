<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "$lib/global.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Team Dashboard</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta
		name="description"
		content="A team management dashboard to help coaches track players, matches, and availability."
	/>
	<meta
		name="keywords"
		content="team, dashboard, management, players, matches"
	/>
	<meta name="author" content="Finlay Robb" />
	<meta property="og:title" content="Team Dashboard" />
	<meta
		property="og:description"
		content="A team management dashboard to help coaches track players, matches, and availability."
	/>
	<meta property="og:image" content={favicon} />
</svelte:head>

{@render children()}
