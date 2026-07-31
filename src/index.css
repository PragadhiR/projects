@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    @apply bg-ink-50 text-ink-800 font-sans antialiased;
    line-height: 1.5;
  }

  ::selection {
    @apply bg-brand-200 text-brand-900;
  }

  *:focus-visible {
    @apply outline-none ring-2 ring-brand-500 ring-offset-2 ring-offset-white;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #bce0ff transparent;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-brand-200 rounded-full;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-brand-300;
  }

  .bg-grid {
    background-image: linear-gradient(rgba(29, 114, 241, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(29, 114, 241, 0.05) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .bg-radial-brand {
    background: radial-gradient(120% 100% at 50% 0%, rgba(51, 145, 251, 0.16), transparent 60%);
  }
}
