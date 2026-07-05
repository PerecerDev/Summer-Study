module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'npx vite preview --host 127.0.0.1 --port 4173 --outDir .vercel/output/static',
      startServerReadyPattern: 'Local',
      url: ['http://127.0.0.1:4173/login'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
