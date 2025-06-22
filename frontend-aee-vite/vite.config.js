// vite.config.js
export default async function ({ mode }) {
  if (mode === 'production') {
    const mod = await import('./vite.config.prod.js');
    return mod.default;
  }
  if (mode === 'preview') {
    const mod = await import('./vite.config.preview.js');
    return mod.default;
  }
  if (mode === 'github') {
    const mod = await import('./vite.config.github.js');
    return mod.default;
  }
  const mod = await import('./vite.config.dev.js');
  return mod.default;
}
