import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017/postgenerator"
    app_name: str = "PostGenerator API"
    llm_provider: str = os.getenv("LLM_PROVIDER", "anthropic")

    model_config = SettingsConfigDict(env_file="backend/.env", extra="ignore")


settings = Settings()


def get_llm(temperature: float = 0.7):
    """Factory to get the configured LLM."""
    if settings.llm_provider == "groq":
        # Using Llama 3.3 70B as a high-quality open model on Groq
        return init_chat_model("groq:llama-3.3-70b-versatile", temperature=temperature)
    else:
        # Default to Anthropic Haiku 4.5
        return init_chat_model(
            "anthropic:claude-haiku-4-5-20251001", temperature=temperature
        )
