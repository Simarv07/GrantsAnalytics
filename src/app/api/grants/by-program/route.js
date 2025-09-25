import { NextResponse } from 'next/server';
const db = require('../../../../lib/db');

export async function GET() {
  try {
    const rows = await db.query(`
      SELECT p.ProgramName, SUM(f.AgreementValue) as totalAmount
      FROM FactGrants f
      JOIN DimProgram p ON f.ProgramID = p.ProgramID
      GROUP BY p.ProgramName
      ORDER BY totalAmount DESC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return new NextResponse('Server Error: ' + err.message, { status: 500 });
  }
}


