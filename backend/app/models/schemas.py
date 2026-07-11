from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class SourceType(str, Enum):
    DOCS = "docs"
    SLACK = "slack"
    TICKETS = "tickets"
    GITHUB = "github"
    CRM = "crm"


class SearchMode(str, Enum):
    HYBRID = "hybrid"
    KEYWORD = "keyword"
    SEMANTIC = "semantic"
    AGENTIC = "agentic"


class KnowledgeDocument(BaseModel):
    id: str
    title: str
    source: SourceType
    owner: str
    freshness_days: int
    authority_score: float = Field(ge=0, le=1)
    snippet: str
    url: str


class SearchRequest(BaseModel):
    query: str
    mode: SearchMode = SearchMode.HYBRID
    user_team: str = "Product"
    top_k: int = Field(default=5, ge=1, le=10)


class SearchResult(BaseModel):
    document: KnowledgeDocument
    bm25_score: float
    vector_score: float
    rerank_score: float
    graph_boost: float
    final_score: float
    explanation: str


class SearchResponse(BaseModel):
    query: str
    interpreted_intent: str
    results: list[SearchResult]
    latency_ms: int
    answer_draft: str


class GraphNode(BaseModel):
    id: str
    label: str
    kind: str
    weight: float


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str


class QueryMetric(BaseModel):
    query: str
    searches: int
    click_through_rate: float
    zero_result_rate: float
    avg_relevance: float


class EvalSummary(BaseModel):
    ndcg_at_5: float
    mrr: float
    recall_at_10: float
    hallucination_risk: float
    total_judgments: int


class DashboardSummary(BaseModel):
    indexed_documents: int
    connected_sources: int
    searches_today: int
    zero_result_rate: float
    avg_latency_ms: int
    relevance_score: float
