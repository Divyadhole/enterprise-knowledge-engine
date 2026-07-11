import { useEffect, useState } from "react";
import { BarChart3, BrainCircuit, GitFork, Network, Search, ShieldCheck, Timer, Waypoints } from "lucide-react";
import { ScoreBar } from "./components/ScoreBar";
import { StatCard } from "./components/StatCard";
import {
  EvalSummary,
  QueryMetric,
  SearchResponse,
  Summary,
  api,
  demoEval,
  demoMetrics,
  demoSearch,
  demoSummary,
} from "./lib/api";

const defaultQuery = "billing launch risks and SOC2 escalation";

export function App() {
  const [summary, setSummary] = useState<Summary>(demoSummary);
  const [metrics, setMetrics] = useState<QueryMetric[]>(demoMetrics);
  const [evaluation, setEvaluation] = useState<EvalSummary>(demoEval);
  const [query, setQuery] = useState(defaultQuery);
  const [response, setResponse] = useState<SearchResponse>(demoSearch(defaultQuery));
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.summary(), api.metrics(), api.evaluation()])
      .then(([summaryData, metricData, evalData]) => {
        setSummary(summaryData);
        setMetrics(metricData);
        setEvaluation(evalData);
      })
      .catch(() => setDemoMode(true));
  }, []);

  async function runSearch() {
    setLoading(true);
    try {
      const result = demoMode ? demoSearch(query) : await api.search({ query, mode: "hybrid", top_k: 4 });
      setResponse(result);
    } catch {
      setDemoMode(true);
      setResponse(demoSearch(query));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <a className="skip-link" href="#search-workbench">Skip to search workbench</a>
      <header className="hero">
        <div>
          <p>Portfolio project 5</p>
          <h1>AI Search & Enterprise Knowledge Engine</h1>
          <p className="hero-copy">
            A relevance-focused enterprise search system with hybrid retrieval, BM25, vector search,
            reranking, graph boosts, query understanding, personalization, analytics, and eval metrics.
          </p>
        </div>
        <div className="pipeline-card" aria-label="Retrieval pipeline">
          <span>Query understanding</span>
          <span>BM25 + vectors</span>
          <span>Cross-encoder rerank</span>
          <span>Graph personalization</span>
          <span>Answer with citations</span>
        </div>
      </header>

      {demoMode && <div className="notice">Portfolio demo mode is active with sample enterprise knowledge data.</div>}

      <section className="stats-grid">
        <StatCard icon={Search} label="Indexed Docs" value={summary.indexed_documents.toLocaleString()} detail="permission-aware corpus" />
        <StatCard icon={Network} label="Sources" value={`${summary.connected_sources}`} detail="docs, Slack, GitHub, CRM" />
        <StatCard icon={Timer} label="Latency" value={`${summary.avg_latency_ms} ms`} detail="hybrid search p95 target" />
        <StatCard icon={ShieldCheck} label="Relevance" value={`${Math.round(summary.relevance_score * 100)}%`} detail="offline judgment score" />
      </section>

      <section className="workspace-grid" id="search-workbench">
        <section className="search-panel">
          <div className="section-heading">
            <h2>Search Workbench</h2>
            <p>Run a query and inspect every ranking signal behind the answer.</p>
          </div>
          <label htmlFor="query">Enterprise query</label>
          <textarea id="query" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="primary-action" onClick={runSearch} disabled={!query.trim() || loading} type="button">
            <Search size={17} />
            {loading ? "Searching" : "Run Hybrid Search"}
          </button>

          <article className="answer-box" aria-live="polite">
            <span>Interpreted intent</span>
            <p>{response.interpreted_intent}</p>
            <span>Answer draft</span>
            <p>{response.answer_draft}</p>
            <small>{response.latency_ms} ms · agentic retrieval trace available</small>
          </article>
        </section>

        <section className="results-panel">
          <div className="section-heading">
            <h2>Ranked Evidence</h2>
            <p>Every result shows lexical, semantic, rerank, and graph contribution.</p>
          </div>
          <div className="result-list">
            {response.results.map((result) => (
              <article key={result.document.id} className="result-card">
                <div className="result-header">
                  <div>
                    <h3>{result.document.title}</h3>
                    <p>{result.document.snippet}</p>
                  </div>
                  <strong>{Math.round(result.final_score * 100)}</strong>
                </div>
                <div className="chip-row">
                  <span>{result.document.source}</span>
                  <span>{result.document.owner}</span>
                  <span>{result.document.freshness_days}d fresh</span>
                </div>
                <div className="score-grid">
                  <ScoreBar label="BM25" value={result.bm25_score} />
                  <ScoreBar label="Vector" value={result.vector_score} />
                  <ScoreBar label="Rerank" value={result.rerank_score} />
                  <ScoreBar label="Graph" value={result.graph_boost * 5} />
                </div>
                <p className="explanation">{result.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="analytics-panel">
          <div className="section-heading">
            <h2>Search Quality</h2>
            <p>Offline relevance and live analytics for search tuning.</p>
          </div>
          <div className="quality-grid">
            <ScoreBar label="NDCG@5" value={evaluation.ndcg_at_5} />
            <ScoreBar label="MRR" value={evaluation.mrr} />
            <ScoreBar label="Recall@10" value={evaluation.recall_at_10} />
            <ScoreBar label="Low hallucination risk" value={1 - evaluation.hallucination_risk} />
          </div>
          <div className="query-table">
            {metrics.map((metric) => (
              <article key={metric.query}>
                <span>{metric.query}</span>
                <strong>{metric.searches}</strong>
                <small>CTR {Math.round(metric.click_through_rate * 100)}% · zero {Math.round(metric.zero_result_rate * 100)}%</small>
              </article>
            ))}
          </div>
        </section>

        <section className="graph-panel">
          <div className="section-heading">
            <h2>Knowledge Graph Signals</h2>
            <p>Entity relationships boost ranking and make retrieval explainable.</p>
          </div>
          <div className="graph-canvas" aria-label="Knowledge graph preview">
            <span className="node n1"><BrainCircuit size={16} /> Billing</span>
            <span className="node n2"><Waypoints size={16} /> Launch</span>
            <span className="node n3"><ShieldCheck size={16} /> SOC2</span>
            <span className="node n4"><BarChart3 size={16} /> Relevance</span>
            <span className="node n5"><GitFork size={16} /> Repo Indexing</span>
          </div>
        </section>
      </section>
    </main>
  );
}
