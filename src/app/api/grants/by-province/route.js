import { NextResponse } from 'next/server';
const db = require('../../../../lib/db');

export async function GET() {
  try {
    const rows = await db.query(`
      SELECT l.Province, SUM(f.AgreementValue) as totalAmount
      FROM FactGrants f
      JOIN DimLocation l ON f.LocationID = l.LocationID
      GROUP BY l.Province
      ORDER BY totalAmount DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return new NextResponse('Server Error: ' + err.message, { status: 500 });
  }
}


