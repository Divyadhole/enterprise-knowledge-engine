from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "local"
    cors_origins: list[str] = ["http://localhost:5177", "http://127.0.0.1:5177"]
    postgres_url: str = "postgresql://knowledge:knowledge@localhost:5435/knowledge"
    qdrant_url: str = "http://localhost:6335"
    elasticsearch_url: str = "http://localhost:9201"
    openai_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
