from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_hybrid_search():
    response = client.post(
        "/api/search",
        json={"query": "billing launch risks", "mode": "hybrid", "top_k": 3},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["query"] == "billing launch risks"
    assert len(payload["results"]) == 3
    assert payload["results"][0]["final_score"] >= payload["results"][-1]["final_score"]
