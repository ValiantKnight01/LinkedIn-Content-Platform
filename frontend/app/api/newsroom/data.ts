export interface KanbanCard {
  id: string;
  title: string;
  type: 'link' | 'forum' | 'article';
  status: 'proposed' | 'selected' | 'inDraft' | 'scheduled';
  // New fields for Research Complete View
  research_status?: 'queued' | 'researching' | 'complete';
  angle?: string;
  angle_guidance?: Record<string, string>; // Map of angle name to guidance text
  read_time?: string;
  description?: string;
  data_points?: string[];
  tags?: string[];
  audience?: string;
  source_url?: string;
}

export let initialCards: KanbanCard[] = [
  { id: 'k1', title: 'Advanced RAG Techniques', type: 'link', status: 'proposed' },
  { id: 'k2', title: 'Intro to Vector Databases', type: 'forum', status: 'proposed' },
  { id: 'k3', title: 'Evaluating LLM Responses', type: 'article', status: 'proposed' },
  { id: 'k4', title: 'The Role of Context Windows', type: 'link', status: 'proposed' },
  { id: 'k5', title: 'Fine-Tuning vs. RAG', type: 'article', status: 'proposed' },
  { id: 'k6', title: 'Production-Ready RAG Systems', type: 'forum', status: 'proposed' },
  { 
    id: 'k7', 
    title: 'Chunking Strategies for RAG', 
    type: 'link', 
    status: 'selected',
    research_status: 'complete',
    angle: 'Contrarian',
    angle_guidance: {
        'Contrarian': '"Stop obsessing over vector search. Start focusing on intelligent document chunking and re-ranking models for truly superior results."',
        'Educational': '"A step-by-step guide to implementing advanced chunking strategies that go beyond simple fixed-size splitting."',
        'Case Study': '"How we improved retrieval accuracy by 40% using semantic chunking in a production RAG system."',
        'Trend Analysis': '"Why 2024 will be the year of semantic chunking and dynamic context windows in RAG applications."'
    },
    read_time: 'Est. 5 min read',
    description: 'This topic moves beyond basic introductions, offering actionable insights for those already familiar with RAG. It addresses the common pitfalls and complexities encountered when scaling these systems for production environments.',
    data_points: [
      'A 2023 study showed a 40% improvement in retrieval accuracy by implementing sophisticated re-ranking models over simple vector similarity.',
      'Case study: Company X reduced irrelevant search results by 60% after optimizing their document chunking strategy for their specific data structure.',
      'Internal benchmark data suggests that hybrid search methods outperform pure vector search by 25% on complex, multi-faceted queries.'
    ],
    tags: ['RAG', 'Vector Search', 'LLM'],
    audience: 'Senior Data Scientists',
    source_url: 'https://example.com/rag-chunking'
  },
  { 
    id: 'k8', 
    title: 'Re-ranking Models Explained', 
    type: 'article', 
    status: 'selected',
    research_status: 'researching' 
  },
  { id: 'k9', title: 'Hybrid Search Methods', type: 'forum', status: 'inDraft' },
  { id: 'k10', title: 'Core RAG Architecture', type: 'article', status: 'scheduled' },
  { id: 'k11', title: 'Understanding Embeddings', type: 'article', status: 'scheduled' },
  { id: 'k12', title: 'Why RAG is the Future', type: 'article', status: 'scheduled' },
];

export const updateCards = (newCards: KanbanCard[]) => {
  initialCards = newCards;
};
