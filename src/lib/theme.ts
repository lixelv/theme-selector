import { browser } from '$app/environment';
import {
	writable,
	type Readable,
	type Subscriber,
	type Unsubscriber,
	type Writable
} from 'svelte/store';

type themeSelect = 'system' | 'light' | 'dark';

class Theme implements Readable<'light' | 'dark'> {
	#themeOption: Writable<themeSelect>;
	#themeCurrent: Writable<'light' | 'dark'>;
	onThemeChange?: (theme: 'light' | 'dark') => void = (value) => {
		if (browser) {
			if (value === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	};
	value: themeSelect;

	constructor(onThemeChange?: (theme: 'light' | 'dark') => void) {
		if (onThemeChange) {
			this.onThemeChange = onThemeChange;
		}

		this.#themeOption = writable('system');
		this.#themeCurrent = writable('light');
		this.value = 'light';

		if (browser) {
			this.initialize();
		}
	}

	private initialize() {
		const theme = localStorage.getItem('theme');

		if (theme) {
			this.#themeOption.set(theme as themeSelect);
		} else {
			this.#themeOption.set('system');
			localStorage.setItem('theme', 'system');
		}

		this.value = theme as themeSelect;
		this.#themeCurrent.set(this.get());

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			this.#themeCurrent.set(this.get());
		});

		this.#themeOption.subscribe((value) => {
			this.value = value;
			this.#themeCurrent.set(this.get());
		});

		this.#themeCurrent.subscribe((value) => {
			this.onThemeChange?.(value);
		});

		this.onThemeChange?.(this.get());
	}

	get(): 'light' | 'dark' {
		if (this.value === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} else {
			return this.value;
		}
	}

	set(value: themeSelect) {
		this.#themeOption.set(value);
		localStorage.setItem('theme', value);
	}

	subscribe(
		run: Subscriber<'light' | 'dark'>,
		invalidate?: Subscriber<'light' | 'dark'>
	): Unsubscriber {
		return this.#themeCurrent.subscribe(run, invalidate as any);
	}
}

export const createThemeStore = (calledFunc: (theme: 'light' | 'dark') => void) => {
	return new Theme(calledFunc);
};

export const theme = new Theme();
