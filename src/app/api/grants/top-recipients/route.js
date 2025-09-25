import { NextResponse } from 'next/server';
const db = require('../../../../lib/db');

export async function GET() {
  try {
    const rows = await db.query(`
      SELECT TOP 10
        r.LegalName,
        SUM(f.AgreementValue) as totalAmount,
        COUNT(f.GrantID) as grantCount
      FROM FactGrants f
      JOIN DimRecipient r ON f.RecipientID = r.RecipientID
      GROUP BY r.LegalName
      ORDER BY totalAmount DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return new NextResponse('Server Error: ' + err.message, { status: 500 });
  }
}


