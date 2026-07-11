from app.models.schemas import GraphEdge, GraphNode, KnowledgeDocument, QueryMetric, SourceType


DOCUMENTS: list[KnowledgeDocument] = [
    KnowledgeDocument(
        id="doc-001",
        title="Enterprise Billing Launch Plan",
        source=SourceType.DOCS,
        owner="Product Ops",
        freshness_days=2,
        authority_score=0.94,
        snippet="Private beta rollout, risk register, launch owners, and readiness checklist for billing analytics.",
        url="https://example.com/docs/billing-launch",
    ),
    KnowledgeDocument(
        id="doc-002",
        title="SOC2 Customer Escalation Runbook",
        source=SourceType.TICKETS,
        owner="Security",
        freshness_days=14,
        authority_score=0.89,
        snippet="Escalation workflow for enterprise security questions, compliance evidence, and response SLAs.",
        url="https://example.com/tickets/soc2-runbook",
    ),
    KnowledgeDocument(
        id="doc-003",
        title="Search Relevance Evaluation Notes",
        source=SourceType.SLACK,
        owner="AI Platform",
        freshness_days=5,
        authority_score=0.86,
        snippet="Team discussion on NDCG, MRR, click models, and manual review workflows for relevance tuning.",
        url="https://example.com/slack/search-relevance",
    ),
    KnowledgeDocument(
        id="doc-004",
        title="Repository Indexing Architecture",
        source=SourceType.GITHUB,
        owner="Developer Experience",
        freshness_days=8,
        authority_score=0.91,
        snippet="Design for code-aware chunking, symbol extraction, permissions, and incremental indexing.",
        url="https://example.com/github/repo-indexing",
    ),
    KnowledgeDocument(
        id="doc-005",
        title="Enterprise Account Health Signals",
        source=SourceType.CRM,
        owner="Revenue Ops",
        freshness_days=1,
        authority_score=0.82,
        snippet="Customer health score definitions, renewal risk categories, and executive sponsor mapping.",
        url="https://example.com/crm/account-health",
    ),
]


GRAPH_NODES: list[GraphNode] = [
    GraphNode(id="billing", label="Billing Analytics", kind="product", weight=0.94),
    GraphNode(id="launch", label="Launch Readiness", kind="workflow", weight=0.89),
    GraphNode(id="soc2", label="SOC2", kind="compliance", weight=0.87),
    GraphNode(id="relevance", label="Search Relevance", kind="metric", weight=0.91),
    GraphNode(id="repo-indexing", label="Repository Indexing", kind="system", weight=0.86),
]


GRAPH_EDGES: list[GraphEdge] = [
    GraphEdge(source="billing", target="launch", relationship="requires"),
    GraphEdge(source="soc2", target="launch", relationship="blocks"),
    GraphEdge(source="relevance", target="repo-indexing", relationship="evaluates"),
    GraphEdge(source="billing", target="soc2", relationship="customer_question"),
]


QUERY_METRICS: list[QueryMetric] = [
    QueryMetric(query="billing launch risks", searches=184, click_through_rate=0.42, zero_result_rate=0.03, avg_relevance=0.91),
    QueryMetric(query="soc2 escalation", searches=97, click_through_rate=0.38, zero_result_rate=0.05, avg_relevance=0.87),
    QueryMetric(query="repo indexing", searches=76, click_through_rate=0.34, zero_result_rate=0.08, avg_relevance=0.84),
    QueryMetric(query="search relevance metrics", searches=121, click_through_rate=0.46, zero_result_rate=0.02, avg_relevance=0.93),
]
