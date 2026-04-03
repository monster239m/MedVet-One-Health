import connectDB from '@/lib/db';
import Consultation from '@/models/Consultation';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const consultations = await Consultation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const consultation = await Consultation.create(data);
    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
