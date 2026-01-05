import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--bg-secondary) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-subtle': 'rgb(var(--text-subtle) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          indigo: {
            DEFAULT: 'rgb(var(--accent-indigo) / <alpha-value>)',
            hover: 'rgb(var(--accent-indigo-hover) / <alpha-value>)',
            foreground: 'rgb(var(--accent-indigo-foreground) / <alpha-value>)',
          },
          violet: {
            DEFAULT: 'rgb(var(--accent-violet) / <alpha-value>)',
            hover: 'rgb(var(--accent-violet-hover) / <alpha-value>)',
            foreground: 'rgb(var(--accent-violet-foreground) / <alpha-value>)',
          },
          emerald: {
            DEFAULT: 'rgb(var(--accent-emerald) / <alpha-value>)',
            hover: 'rgb(var(--accent-emerald-hover) / <alpha-value>)',
            foreground: 'rgb(var(--accent-emerald-foreground) / <alpha-value>)',
          },
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          hover: 'rgb(var(--danger-hover) / <alpha-value>)',
          foreground: 'rgb(var(--danger-foreground) / <alpha-value>)',
        },
      },
      boxShadow: {
        'theme': 'var(--shadow)',
        'theme-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
export default config
