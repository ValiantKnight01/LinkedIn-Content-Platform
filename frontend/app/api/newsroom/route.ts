import { NextRequest, NextResponse } from 'next/server';
import { initialCards } from './data';

export async function GET() {
  return NextResponse.json(initialCards);
}

