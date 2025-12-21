import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  // For simplicity, we return a fixed set of posts for Nov 2025
  // and empty for others unless we want to seed more.
  if (month === '11' && year === '2025') {
    return NextResponse.json([
      { id: '1', title: 'Intro to Vectors', date: '2025-11-03', status: 'draft' },
      { id: '2', title: 'Embeddings 101', date: '2025-11-04', status: 'in-progress' },
      { id: '3', title: 'RAG Architecture', date: '2025-11-06', status: 'scheduled' },
      { id: '4', title: 'Vector DBs', date: '2025-11-09', status: 'draft' },
      { id: '5', title: 'Chunking Strategy', date: '2025-11-10', status: 'in-progress' },
      { id: '6', title: 'Hybrid Search', date: '2025-11-13', status: 'scheduled' },
      { id: '7', title: 'Context Windows', date: '2025-11-15', status: 'draft' },
      { id: '8', title: 'Query Transformation', date: '2025-11-17', status: 'in-progress' },
      { id: '9', title: 'Re-ranking Models', date: '2025-11-19', status: 'scheduled' },
      { id: '10', title: 'Evaluating RAG', date: '2025-11-21', status: 'draft' },
      { id: '11', title: 'Advanced RAG', date: '2025-11-23', status: 'in-progress' },
      { id: '12', title: 'Production RAG', date: '2025-11-25', status: 'scheduled' },
      { id: '13', title: 'Fine-Tuning LLMs', date: '2025-11-27', status: 'draft' },
      { id: '14', title: 'Case Studies', date: '2025-11-29', status: 'in-progress' },
      { id: '15', title: 'Future of Search', date: '2025-11-30', status: 'scheduled' },
    ]);
  }

  return NextResponse.json([]);
}
