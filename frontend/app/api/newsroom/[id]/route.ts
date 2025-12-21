import { NextRequest, NextResponse } from 'next/server';
import { initialCards, updateCards } from '../data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const updates = await request.json();

  const cardIndex = initialCards.findIndex((c) => c.id === id);

  if (cardIndex === -1) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const updatedCard = { ...initialCards[cardIndex], ...updates };
  const newCards = [...initialCards];
  newCards[cardIndex] = updatedCard;

  updateCards(newCards);

  return NextResponse.json(updatedCard);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const cardIndex = initialCards.findIndex((c) => c.id === id);

  if (cardIndex === -1) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const newCards = initialCards.filter((c) => c.id !== id);
  updateCards(newCards);

  return NextResponse.json({ success: true });
}
