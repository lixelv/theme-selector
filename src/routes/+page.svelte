<script lang="ts">
	import { theme } from '$lib/index.js';
</script>

{$theme}
<button on:click={() => theme.set('dark')}>Dark</button>
<button on:click={() => theme.set('light')}>Light</button>
<button on:click={() => theme.set('system')}>System</button>
