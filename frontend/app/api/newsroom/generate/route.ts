import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newCards = [
    { 
        id: `gen-${Math.random().toString(36).substr(2, 9)}`, 
        title: 'New AI Insight ' + Math.floor(Math.random() * 100), 
        type: 'link', 
        status: 'proposed' 
    },
    { 
        id: `gen-${Math.random().toString(36).substr(2, 9)}`, 
        title: 'Community Discussion Topic', 
        type: 'forum', 
        status: 'proposed' 
    },
  ];

  return NextResponse.json(newCards);
}
