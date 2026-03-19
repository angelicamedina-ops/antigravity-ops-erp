import { Product } from './types';

export const PRODUCT_CATALOG: Product[] = [
  // RE-START POWERSPORT BATTERIES
  { sku: 'AG-AT7B-BS-RS', name: 'AT7B-BS RE-START', price: 144.99, upc: '711811703669', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-AT7B-RS', ssSku: 'AG-AT7B-BS-RS', wooId: '1001' },
  { sku: 'AG-ATZ5-X', name: 'ATZ5-X', price: 119.99, upc: '711811704987', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATZ5-X', ssSku: 'AG-ATZ5-X', wooId: '1002' },
  { sku: 'AG-ATZ7-RS', name: 'ATZ7-RS RE-START', price: 144.99, upc: '711811703362', status: 'Inactive', category: 'RE-START', qbItemCode: 'BAT-ATZ7-RS', ssSku: 'AG-ATZ7-RS', wooId: '1003' },
  { sku: 'AG-ATZ10-RS', name: 'ATZ10-RS RE-START', price: 224.99, upc: '711811703379', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATZ10-RS', ssSku: 'AG-ATZ10-RS', wooId: '1004' },
  { sku: 'AG-ATZ10-HD-RS', name: 'ATZ10 Heavy Duty RS', price: 279.99, upc: '711811704925', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATZ10-HD-RS', ssSku: 'AG-ATZ10-HD-RS', wooId: '1005' },
  { sku: 'AG-AT12BS-RS', name: 'AT12BS RE-START', price: 249.99, upc: '711811703492', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-AT12BS-RS', ssSku: 'AG-AT12BS-RS', wooId: '1006' },
  { sku: 'AG-AT12BS-HD-RS', name: 'AT12BS Heavy Duty RS', price: 289.99, upc: '639713373639', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-AT12BS-HD-RS', ssSku: 'AG-AT12BS-HD-RS', wooId: '1007' },
  { sku: 'AG-ATX12-RS', name: 'ATX12-RS RE-START', price: 249.99, upc: '711811703515', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATX12-RS', ssSku: 'AG-ATX12-RS', wooId: '1008' },
  { sku: 'AG-ATX12-HD-RS', name: 'ATX12 Heavy Duty RS', price: 284.99, upc: '639713373622', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATX12-HD-RS', ssSku: 'AG-ATX12-HD-RS', wooId: '1009' },
  { sku: 'AG-ATX12-AH-RS', name: 'ATX12-AH RE-START', price: 249.99, upc: '711811703812', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATX12-AH-RS', ssSku: 'AG-ATX12-AH-RS', wooId: '1010' },
  { sku: 'AG-ATX20-RS', name: 'ATX20-RS RE-START', price: 354.99, upc: '711811703386', status: 'Inactive', category: 'RE-START', qbItemCode: 'BAT-ATX20-RS', ssSku: 'AG-ATX20-RS', wooId: '1011' },
  { sku: 'AG-ATX20-HD', name: 'ATX20 Heavy Duty', price: 449.99, upc: '711811703799', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATX20-HD', ssSku: 'AG-ATX20-HD', wooId: '1012' },
  { sku: 'AG-ATX30-RS', name: 'ATX30-RS RE-START', price: 449.99, upc: '711811703423', status: 'Inactive', category: 'RE-START', qbItemCode: 'BAT-ATX30-RS', ssSku: 'AG-ATX30-RS', wooId: '1013' },
  { sku: 'AG-ATX30-HD', name: 'ATX30 Heavy Duty', price: 629.99, upc: '711811703805', status: 'Active', category: 'RE-START', qbItemCode: 'BAT-ATX30-HD', ssSku: 'AG-ATX30-HD', wooId: '1014' },

  // SMALL CASE BATTERIES
  { sku: 'AG-401', name: '4-Cell Small Case', price: 119.99, upc: '639713372694', status: 'Active', category: 'SMALL CASE', qbItemCode: 'BAT-401', ssSku: 'AG-401', wooId: '2001' },
  { sku: 'AG-801', name: '8-Cell Small Case', price: 179.99, upc: '639713372700', status: 'Active', category: 'SMALL CASE', qbItemCode: 'BAT-801', ssSku: 'AG-801', wooId: '2002' },
  { sku: 'AG-1201', name: '12-Cell Small Case', price: 219.99, upc: '639713372717', status: 'Active', category: 'SMALL CASE', qbItemCode: 'BAT-1201', ssSku: 'AG-1201', wooId: '2003' },
  { sku: 'AG-1601', name: '16-Cell Small Case', price: 289.99, upc: '639713372724', status: 'Active', category: 'SMALL CASE', qbItemCode: 'BAT-1601', ssSku: 'AG-1601', wooId: '2004' },

  // MICRO-START JUMP STARTERS
  { sku: 'AG-XP-1-G2', name: 'Micro-Start XP-1 Gen2', price: 149.99, upc: '711811704604', status: 'Active', category: 'MICRO-START', qbItemCode: 'MS-XP-1-G2', ssSku: 'AG-XP-1-G2', wooId: '3001' },
  { sku: 'AG-XP-10-G2', name: 'Micro-Start XP-10 Gen2', price: 199.99, upc: '711811704772', status: 'Active', category: 'MICRO-START', qbItemCode: 'MS-XP-10-G2', ssSku: 'AG-XP-10-G2', wooId: '3002' },
  { sku: 'AG-XP-15', name: 'Micro-Start XP-15 + Inflator', price: 179.99, upc: '711811704710', status: 'Active', category: 'MICRO-START', qbItemCode: 'MS-XP-15', ssSku: 'AG-XP-15', wooId: '3003' },
  { sku: 'AG-XP-20', name: 'Micro-Start XP-20', price: 229.99, upc: '711811704611', status: 'Active', category: 'MICRO-START', qbItemCode: 'MS-XP-20', ssSku: 'AG-XP-20', wooId: '3004' },
  { sku: 'AG-XP-20-HD', name: 'Micro-Start XP-20-HD', price: 249.99, upc: '711811704628', status: 'Active', category: 'MICRO-START', qbItemCode: 'MS-XP-20-HD', ssSku: 'AG-XP-20-HD', wooId: '3005' },
];
