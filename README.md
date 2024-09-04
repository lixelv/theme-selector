# theme-selector

A simple Svelte store library that lets you switch between light and dark themes, with support for system theme by default.

## Installation

Install the package via npm:

```bash
npm i theme-selector
```

### (Optional) Instant Theme Switch

To ensure the theme is applied instantly on page load (before Svelte mounts), you can add this script to the `<head>` section of your `app.html`. This is especially useful if you're using libraries like ShadCN:

```html
<script>
	const theme = localStorage.getItem('theme');
	let currentTheme;

	if (theme === 'system' || !theme) {
		currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} else {
		currentTheme = theme;
	}

	if (currentTheme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}

	if (!theme) {
		localStorage.setItem('theme', 'system');
	}
</script>
```

## Usage

Import the `theme` store and use it in your components:

```svelte
<script>
	import { theme } from 'theme-selector';
</script>

<!-- $theme reflects the current theme ('light' or 'dark'). 
The set method accepts 'light', 'dark', or 'system'. -->
<h1>Your current theme is {$theme}</h1>

<button on:click={() => theme.set('dark')}>Dark</button>
<button on:click={() => theme.set('light')}>Light</button>
<button on:click={() => theme.set('system')}>System</button>
```

### Custom Theme Store

You can create a new theme store using the `createThemeStore` function. This allows you to specify a callback function that will be invoked whenever the theme changes (either by system preferences or user selection):

```svelte
<script>
	import { createThemeStore } from 'theme-selector';

	function onThemeChange(theme) {
		console.log('Theme changed to:', theme);
	}

	const theme = createThemeStore(onThemeChange);
</script>

<p>The current theme is: {$theme}</p>
```

### Default Behavior with ShadCN

By default, if no callback function is provided to `createThemeStore`, it will automatically update the `html` class to reflect the current theme.

## License

This project is licensed under the MIT License.
