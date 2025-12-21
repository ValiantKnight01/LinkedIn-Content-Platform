import { NextRequest, NextResponse } from 'next/server';

const initialCards = [
  { id: 'k1', title: 'Advanced RAG Techniques', type: 'link', status: 'proposed' },
  { id: 'k2', title: 'Intro to Vector Databases', type: 'forum', status: 'proposed' },
  { id: 'k3', title: 'Evaluating LLM Responses', type: 'article', status: 'proposed' },
  { id: 'k4', title: 'The Role of Context Windows', type: 'link', status: 'proposed' },
  { id: 'k5', title: 'Fine-Tuning vs. RAG', type: 'article', status: 'proposed' },
  { id: 'k6', title: 'Production-Ready RAG Systems', type: 'forum', status: 'proposed' },
  { id: 'k7', title: 'Chunking Strategies for RAG', type: 'link', status: 'selected' },
  { id: 'k8', title: 'Re-ranking Models Explained', type: 'article', status: 'selected' },
  { id: 'k9', title: 'Hybrid Search Methods', type: 'forum', status: 'inDraft' },
  { id: 'k10', title: 'Core RAG Architecture', type: 'article', status: 'scheduled' },
  { id: 'k11', title: 'Understanding Embeddings', type: 'article', status: 'scheduled' },
  { id: 'k12', title: 'Why RAG is the Future', type: 'article', status: 'scheduled' },
];

export async function GET() {
  return NextResponse.json(initialCards);
}
