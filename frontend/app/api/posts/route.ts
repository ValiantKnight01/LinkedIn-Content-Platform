import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  try {
    const res = await fetch(
      `${BACKEND_URL}/posts?month=${month}&year=${year}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching posts from backend:', error);
    return NextResponse.json([], { status: 500 });
  }
}
