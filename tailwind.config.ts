import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-jp)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      /* TYPO-FR-1/2: 用途別トークン（Display / Heading / Body / Small / UI） */
      fontSize: {
        'display': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-1': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-2': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-3': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.35', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'ui': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'ui-sm': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0' }],
      },
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
      boxShadow: {
        'theme': 'var(--shadow)',
        'theme-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
export default config
