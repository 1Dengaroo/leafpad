export interface DiffPreset {
  id: string;
  name: string;
  left: string;
  right: string;
}

export const diffPresets: DiffPreset[] = [
  {
    id: 'preset-1',
    name: 'Minor Tweak',
    left: JSON.stringify(
      {
        name: 'Leafpad',
        version: '1.2.0',
        description: 'Clean devtools',
        settings: { theme: 'dark', indentSize: 2, wordWrap: true },
        features: ['formatter', 'diff', 'minify']
      },
      null,
      2
    ),
    right: JSON.stringify(
      {
        name: 'Leafpad',
        version: '1.2.1',
        description: 'Clean devtools',
        settings: { theme: 'dark', indentSize: 4, wordWrap: true },
        features: ['formatter', 'diff', 'minify']
      },
      null,
      2
    )
  },
  {
    id: 'preset-2',
    name: 'Small Update',
    left: JSON.stringify(
      {
        user: 'ada',
        role: 'editor',
        permissions: ['read', 'write'],
        profile: { displayName: 'Ada L.', avatar: null, bio: 'Software engineer' }
      },
      null,
      2
    ),
    right: JSON.stringify(
      {
        user: 'ada',
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
        profile: {
          displayName: 'Ada Lovelace',
          avatar: 'https://example.com/ada.png',
          bio: 'Software engineer & mathematician'
        }
      },
      null,
      2
    )
  },
  {
    id: 'preset-3',
    name: 'Completely Different',
    left: JSON.stringify(
      {
        type: 'invoice',
        id: 'INV-001',
        date: '2026-01-15',
        customer: { name: 'Acme Corp', address: '123 Main St' },
        items: [
          { description: 'Widget A', qty: 10, price: 9.99 },
          { description: 'Widget B', qty: 5, price: 19.99 }
        ],
        total: 199.85
      },
      null,
      2
    ),
    right: JSON.stringify(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Headquarters', employees: 120 },
            geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] }
          }
        ],
        metadata: { source: 'manual', updatedAt: '2026-03-01T12:00:00Z' }
      },
      null,
      2
    )
  }
];
