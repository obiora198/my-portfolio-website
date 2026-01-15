// Color mapping from Tailwind classes to hex colors
export const colorMap: Record<string, string> = {
  // Sunset theme
  'text-orange-600': '#ea580c',
  'text-orange-400': '#fb923c',
  'text-rose-600': '#e11d48',
  'text-rose-400': '#fb7185',
  'text-pink-600': '#db2777',
  'text-pink-400': '#f472b6',

  // Sky theme
  'text-sky-600': '#0284c7',
  'text-sky-400': '#38bdf8',
  'text-blue-600': '#2563eb',
  'text-blue-400': '#60a5fa',
  'text-cyan-600': '#0891b2',
  'text-cyan-400': '#22d3ee',

  // Emerald theme
  'text-emerald-600': '#059669',
  'text-emerald-400': '#34d399',
  'text-teal-600': '#0d9488',
  'text-teal-400': '#2dd4bf',
  'text-green-600': '#16a34a',
  'text-green-400': '#4ade80',

  // Minimal theme
  'text-gray-800': '#1f2937',
  'text-gray-300': '#d1d5db',
  'text-slate-700': '#334155',
  'text-slate-300': '#cbd5e1',
  'text-zinc-700': '#3f3f46',
  'text-zinc-300': '#d4d4d8',
}

export function generateFavicon(
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
) {
  // Convert Tailwind classes to hex colors
  const primary = colorMap[primaryColor] || '#ea580c'
  const secondary = colorMap[secondaryColor] || '#e11d48'
  const accent = colorMap[accentColor] || '#db2777'

  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="50%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <!-- Outer Circle -->
      <circle cx="32" cy="32" r="28" stroke="url(#faviconGradient)" stroke-width="3" fill="none" />
      <!-- E Letter -->
      <path
        d="M21 19 H37 M21 19 V32 M21 32 H34 M21 32 V45 M21 45 H37"
        stroke="url(#faviconGradient)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- O Letter - small circle -->
      <circle cx="43" cy="21" r="6" stroke="url(#faviconGradient)" stroke-width="3" fill="none" />
    </svg>
  `
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function updateFavicon(href: string) {
  if (typeof window === 'undefined') return

  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
}
