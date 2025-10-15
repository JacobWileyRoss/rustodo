import scrollbar from 'tailwind-scrollbar';

export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: [
        scrollbar(),
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--color-background) / <alpha-value>)',
                'surface-panel': 'rgb(var(--color-surface-panel) / <alpha-value>)',
                'surface-task': 'rgb(var(--color-surface-task) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                'header-bg': 'rgb(var(--color-header-bg) / <alpha-value>)',
                foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
                neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                edit: 'rgb(var(--color-edit) / <alpha-value>)',
                'edit-hover': 'rgb(var(--color-edit-hover) / <alpha-value>)',
                'is-editing': 'rgb(var(--color-is-editing) / <alpha-value>)',
                save: 'rgb(var(--color-save) / <alpha-value>)',
                'save-hover': 'rgb(var(--color-save-hover) / <alpha-value>)',
                delete: 'rgb(var(--color-delete) / <alpha-value>)',
                'delete-hover': 'rgb(var(--color-delete-hover) / <alpha-value>)',
            },
            fontFamily: {
                jetbrains: ['JetBrains Mono', 'monospace'],
            }
        }
    }
};
