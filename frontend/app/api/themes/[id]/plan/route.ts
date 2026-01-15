import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/themes`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/${id}/plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error planning theme in backend:', error);
    return NextResponse.json(
      { error: 'Failed to plan theme' },
      { status: 500 }
    );
  }
}
