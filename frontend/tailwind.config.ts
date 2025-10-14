import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Custom Zoo Color Palette
        dark_spring_green: {
          DEFAULT: '#2c6e49',
          50: '#e6f2ec',
          100: '#ccebd9',
          200: '#99d6b4',
          300: '#66c28e',
          400: '#40a06a',
          500: '#2c6e49',
          600: '#23583a',
          700: '#1a422b',
          800: '#112c1d',
          900: '#09160e',
        },
        sea_green: {
          DEFAULT: '#4c956c',
          50: '#e8f5ee',
          100: '#d9ece1',
          200: '#b4d8c3',
          300: '#8ec5a6',
          400: '#68b188',
          500: '#4c956c',
          600: '#3d7656',
          700: '#2e5940',
          800: '#1f3b2b',
          900: '#0f1e15',
        },
        light_yellow: {
          DEFAULT: '#fefee3',
          50: '#fffff9',
          100: '#fffff3',
          200: '#fefeed',
          300: '#fefee7',
          400: '#fefee3',
          500: '#fefee3',
          600: '#fbfb85',
          700: '#f7f728',
          800: '#b9b907',
          900: '#5d5d03',
        },
        melon: {
          DEFAULT: '#ffc9b9',
          50: '#fff4f1',
          100: '#ffe9e2',
          200: '#ffded4',
          300: '#ffd3c6',
          400: '#ffc9b9',
          500: '#ffc9b9',
          600: '#ff8560',
          700: '#ff4208',
          800: '#af2900',
          900: '#581400',
        },
        persian_orange: {
          DEFAULT: '#d68c45',
          50: '#f7e8d9',
          100: '#eed0b4',
          200: '#e6b98e',
          300: '#dea168',
          400: '#d68c45',
          500: '#d68c45',
          600: '#b86e28',
          700: '#8a521e',
          800: '#5c3714',
          900: '#2e1b0a',
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
