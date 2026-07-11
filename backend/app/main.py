from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title="Enterprise Knowledge Engine",
    description="AI search platform API with hybrid retrieval, reranking, graph signals, and relevance analytics.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "Enterprise Knowledge Engine API",
        "status": "running",
        "docs": "http://localhost:8300/docs",
        "frontend": "http://localhost:5177",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "enterprise-knowledge-engine"}
