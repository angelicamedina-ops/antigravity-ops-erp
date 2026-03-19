import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mock API for Orders (to be replaced with real integrations)
  app.get('/api/orders', (req, res) => {
    res.json([
      {
        id: 'WOO-12345',
        channel: 'WOO',
        customer: 'John Smith',
        items: [{ sku: 'AG-XP-1-G2', name: 'Micro-Start XP-1 Gen2', qty: 1, price: 149.99 }],
        total: 149.99,
        status: 'PENDING',
        shipBy: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: 'PO-98765',
        channel: 'EMAIL PO',
        customer: 'RevZilla Motorsports',
        items: [
          { sku: 'AG-ATX20-HD', name: 'ATX20 Heavy Duty', qty: 10, price: 449.99 },
          { sku: 'AG-XP-20-HD', name: 'Micro-Start XP-20-HD', qty: 5, price: 249.99 }
        ],
        total: 5749.85,
        status: 'CONFIRMED',
        shipBy: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'WMT-55210',
        channel: 'WALMART',
        customer: 'Sarah Jenkins',
        items: [{ sku: 'AG-ATZ10-RS', name: 'ATZ10-RS RE-START', qty: 1, price: 224.99 }],
        total: 224.99,
        status: 'IN SHIPSTATION',
        shipBy: new Date(Date.now() + 172800000).toISOString(),
      },
      {
        id: 'TT-99012',
        channel: 'TIKTOK',
        customer: 'Mike Ross',
        items: [{ sku: 'AG-XP-10-G2', name: 'Micro-Start XP-10 Gen2', qty: 2, price: 199.99 }],
        total: 399.98,
        status: 'SHIPPED',
        shipBy: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 'WOO-12346',
        channel: 'WOO',
        customer: 'David Miller',
        items: [{ sku: 'AG-ATZ7-RS', name: 'ATZ7-RS RE-START', qty: 1, price: 144.99 }],
        total: 144.99,
        status: 'NEEDS ACTION',
        shipBy: new Date(Date.now() + 43200000).toISOString(),
      },
      {
        id: 'NEG-77812',
        channel: 'NEWEGG',
        customer: 'Tech Solutions Inc',
        items: [{ sku: 'AG-1601', name: '16-Cell Small Case', qty: 4, price: 289.99 }],
        total: 1159.96,
        status: 'IN QB',
        shipBy: new Date(Date.now() + 86400000).toISOString(),
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
