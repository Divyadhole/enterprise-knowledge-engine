from fastapi import APIRouter

from app.models.schemas import DashboardSummary, EvalSummary, GraphEdge, GraphNode, QueryMetric, SearchRequest, SearchResponse
from app.services.catalog import DOCUMENTS, GRAPH_EDGES, GRAPH_NODES, QUERY_METRICS
from app.services.search_engine import evaluation_summary, run_search

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_summary() -> DashboardSummary:
    return DashboardSummary(
        indexed_documents=48210,
        connected_sources=5,
        searches_today=1842,
        zero_result_rate=0.041,
        avg_latency_ms=142,
        relevance_score=0.89,
    )


@router.post("/search", response_model=SearchResponse)
def search(request: SearchRequest) -> SearchResponse:
    return run_search(request)


@router.get("/documents")
def list_documents():
    return DOCUMENTS


@router.get("/graph/nodes", response_model=list[GraphNode])
def list_graph_nodes() -> list[GraphNode]:
    return GRAPH_NODES


@router.get("/graph/edges", response_model=list[GraphEdge])
def list_graph_edges() -> list[GraphEdge]:
    return GRAPH_EDGES


@router.get("/analytics/queries", response_model=list[QueryMetric])
def list_query_metrics() -> list[QueryMetric]:
    return QUERY_METRICS


@router.get("/evaluation", response_model=EvalSummary)
def get_evaluation() -> EvalSummary:
    return evaluation_summary()
