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
        'surface-soft': 'rgb(var(--surface-soft) / <alpha-value>)',
        'surface-soft-foreground': 'rgb(var(--surface-soft-foreground) / <alpha-value>)',
        'surface-soft-muted': 'rgb(var(--surface-soft-muted) / <alpha-value>)',
        'surface-soft-border': 'rgb(var(--surface-soft-border) / <alpha-value>)',
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
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          hover: 'rgb(var(--success-hover) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
          bg: 'rgb(var(--success-bg) / <alpha-value>)',
          border: 'rgb(var(--success-border) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          hover: 'rgb(var(--warning-hover) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
          bg: 'rgb(var(--warning-bg) / <alpha-value>)',
          border: 'rgb(var(--warning-border) / <alpha-value>)',
        },
        link: {
          DEFAULT: 'rgb(var(--link) / <alpha-value>)',
          hover: 'rgb(var(--link-hover) / <alpha-value>)',
        },
        placeholder: 'rgb(var(--placeholder) / <alpha-value>)',
        overlay: {
          DEFAULT: 'rgb(var(--overlay) / <alpha-value>)',
          opacity: 'var(--overlay-opacity)',
        },
      },
      fontSize: {
        display: ['clamp(3rem, 6vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'page-title': ['clamp(2.125rem, 4vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '700' }],
        'section-title': ['clamp(1.625rem, 2.8vw, 2.375rem)', { lineHeight: '1.12', letterSpacing: '-0.025em', fontWeight: '700' }],
        'subsection-title': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.18', letterSpacing: '-0.02em', fontWeight: '700' }],
        'card-title': ['1.125rem', { lineHeight: '1.6rem', letterSpacing: '-0.015em', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.9rem' }],
        'body-base': ['1rem', { lineHeight: '1.75rem' }],
        helper: ['0.875rem', { lineHeight: '1.5rem' }],
        caption: ['0.75rem', { lineHeight: '1.25rem' }],
        'heading-2': ['clamp(1.625rem, 2.8vw, 2.375rem)', { lineHeight: '1.12', letterSpacing: '-0.025em', fontWeight: '700' }],
        'heading-3': ['1.125rem', { lineHeight: '1.6rem', letterSpacing: '-0.015em', fontWeight: '700' }],
        small: ['0.875rem', { lineHeight: '1.5rem' }],
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
