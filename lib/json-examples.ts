export interface JsonExample {
  id: string;
  name: string;
  data: string;
}

export const jsonExamples: JsonExample[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    data: JSON.stringify({
      id: 1024,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'admin',
      verified: true,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: { email: true, push: false }
      },
      tags: ['engineer', 'early-adopter']
    })
  },
  {
    id: 'api-response',
    name: 'API Response',
    data: JSON.stringify({
      status: 200,
      message: 'OK',
      data: {
        items: [
          { id: 'p_01', name: 'Wireless Keyboard', price: 59.99, inStock: true },
          { id: 'p_02', name: 'USB-C Hub', price: 34.5, inStock: false },
          { id: 'p_03', name: 'Monitor Stand', price: 89.0, inStock: true }
        ],
        pagination: { page: 1, perPage: 20, total: 3 }
      },
      meta: { requestId: 'req_abc123', duration: '42ms' }
    })
  },
  {
    id: 'config-file',
    name: 'Config File',
    data: JSON.stringify({
      appName: 'my-app',
      version: '2.1.0',
      env: 'production',
      database: {
        host: 'db.example.com',
        port: 5432,
        name: 'app_prod',
        pool: { min: 2, max: 10 }
      },
      cache: { driver: 'redis', ttl: 3600 },
      features: {
        darkMode: true,
        betaAccess: false,
        maxUploadMb: 25
      }
    })
  },
  {
    id: 'nested-array',
    name: 'Nested Data',
    data: JSON.stringify({
      school: 'Westfield High',
      year: 2026,
      departments: [
        {
          name: 'Science',
          head: 'Dr. Park',
          courses: [
            { code: 'SCI-101', title: 'Intro to Physics', enrolled: 32 },
            { code: 'SCI-202', title: 'Organic Chemistry', enrolled: 18 }
          ]
        },
        {
          name: 'Arts',
          head: 'Ms. Rivera',
          courses: [
            { code: 'ART-101', title: 'Drawing Fundamentals', enrolled: 25 },
            { code: 'ART-305', title: 'Digital Media', enrolled: 14 }
          ]
        }
      ]
    })
  },
  {
    id: 'geojson',
    name: 'GeoJSON',
    data: JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Central Park', category: 'park', area_km2: 3.41 },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-73.9812, 40.7681],
                [-73.958, 40.8006],
                [-73.9493, 40.7968],
                [-73.9732, 40.764],
                [-73.9812, 40.7681]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'Times Square', category: 'landmark' },
          geometry: { type: 'Point', coordinates: [-73.9855, 40.758] }
        }
      ]
    })
  }
];
