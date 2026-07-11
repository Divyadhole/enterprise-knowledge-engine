export type Summary = {
  indexed_documents: number;
  connected_sources: number;
  searches_today: number;
  zero_result_rate: number;
  avg_latency_ms: number;
  relevance_score: number;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  source: "docs" | "slack" | "tickets" | "github" | "crm";
  owner: string;
  freshness_days: number;
  authority_score: number;
  snippet: string;
  url: string;
};

export type SearchResult = {
  document: KnowledgeDocument;
  bm25_score: number;
  vector_score: number;
  rerank_score: number;
  graph_boost: number;
  final_score: number;
  explanation: string;
};

export type SearchResponse = {
  query: string;
  interpreted_intent: string;
  results: SearchResult[];
  latency_ms: number;
  answer_draft: string;
};

export type QueryMetric = {
  query: string;
  searches: number;
  click_through_rate: number;
  zero_result_rate: number;
  avg_relevance: number;
};

export type EvalSummary = {
  ndcg_at_5: number;
  mrr: number;
  recall_at_10: number;
  hallucination_risk: number;
  total_judgments: number;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8300/api";

export const demoSummary: Summary = {
  indexed_documents: 48210,
  connected_sources: 5,
  searches_today: 1842,
  zero_result_rate: 0.041,
  avg_latency_ms: 142,
  relevance_score: 0.89,
};

export const demoDocuments: KnowledgeDocument[] = [
  {
    id: "doc-001",
    title: "Enterprise Billing Launch Plan",
    source: "docs",
    owner: "Product Ops",
    freshness_days: 2,
    authority_score: 0.94,
    snippet: "Private beta rollout, risk register, launch owners, and readiness checklist for billing analytics.",
    url: "https://example.com/docs/billing-launch",
  },
  {
    id: "doc-002",
    title: "SOC2 Customer Escalation Runbook",
    source: "tickets",
    owner: "Security",
    freshness_days: 14,
    authority_score: 0.89,
    snippet: "Escalation workflow for enterprise security questions, compliance evidence, and response SLAs.",
    url: "https://example.com/tickets/soc2-runbook",
  },
  {
    id: "doc-003",
    title: "Search Relevance Evaluation Notes",
    source: "slack",
    owner: "AI Platform",
    freshness_days: 5,
    authority_score: 0.86,
    snippet: "Team discussion on NDCG, MRR, click models, and manual review workflows for relevance tuning.",
    url: "https://example.com/slack/search-relevance",
  },
  {
    id: "doc-004",
    title: "Repository Indexing Architecture",
    source: "github",
    owner: "Developer Experience",
    freshness_days: 8,
    authority_score: 0.91,
    snippet: "Design for code-aware chunking, symbol extraction, permissions, and incremental indexing.",
    url: "https://example.com/github/repo-indexing",
  },
];

export const demoMetrics: QueryMetric[] = [
  { query: "billing launch risks", searches: 184, click_through_rate: 0.42, zero_result_rate: 0.03, avg_relevance: 0.91 },
  { query: "soc2 escalation", searches: 97, click_through_rate: 0.38, zero_result_rate: 0.05, avg_relevance: 0.87 },
  { query: "repo indexing", searches: 76, click_through_rate: 0.34, zero_result_rate: 0.08, avg_relevance: 0.84 },
  { query: "search relevance metrics", searches: 121, click_through_rate: 0.46, zero_result_rate: 0.02, avg_relevance: 0.93 },
];

export const demoEval: EvalSummary = {
  ndcg_at_5: 0.89,
  mrr: 0.84,
  recall_at_10: 0.92,
  hallucination_risk: 0.07,
  total_judgments: 428,
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function scoreDocument(query: string, document: KnowledgeDocument, index: number): SearchResult {
  const tokens = query.toLowerCase().split(/\s+/).filter((token) => token.length > 2);
  const text = `${document.title} ${document.snippet} ${document.owner} ${document.source}`.toLowerCase();
  const overlap = tokens.length ? tokens.filter((token) => text.includes(token)).length / tokens.length : 0;
  const freshnessBoost = Math.max(0, 1 - document.freshness_days / 45);
  const bm25 = Number((0.48 + overlap * 0.36 + document.authority_score * 0.12).toFixed(3));
  const vector = Number((0.52 + overlap * 0.22 + freshnessBoost * 0.13).toFixed(3));
  const graph = Number((document.authority_score * 0.08 + freshnessBoost * 0.05).toFixed(3));
  const rerank = Number((bm25 * 0.35 + vector * 0.45 + graph + (index === 0 ? 0.03 : 0)).toFixed(3));
  const final = Number((bm25 * 0.3 + vector * 0.35 + rerank * 0.25 + graph).toFixed(3));
  return {
    document,
    bm25_score: bm25,
    vector_score: vector,
    rerank_score: rerank,
    graph_boost: graph,
    final_score: final,
    explanation: "Keyword overlap, semantic similarity, source authority, freshness, and graph proximity increased this result.",
  };
}

export function demoSearch(query: string): SearchResponse {
  const results = demoDocuments
    .map((document, index) => scoreDocument(query, document, index))
    .sort((left, right) => right.final_score - left.final_score)
    .slice(0, 4);

  return {
    query,
    interpreted_intent: `Find authoritative enterprise knowledge about "${query}".`,
    results,
    latency_ms: 118 + query.length * 3 + results.length * 12,
    answer_draft: `Top evidence points to ${results[0]?.document.title ?? "the indexed corpus"}. Review source citations before taking action.`,
  };
}

export const api = {
  summary: () => request<Summary>("/summary"),
  metrics: () => request<QueryMetric[]>("/analytics/queries"),
  evaluation: () => request<EvalSummary>("/evaluation"),
  search: (body: { query: string; mode: string; top_k: number }) =>
    request<SearchResponse>("/search", { method: "POST", body: JSON.stringify(body) }),
};
