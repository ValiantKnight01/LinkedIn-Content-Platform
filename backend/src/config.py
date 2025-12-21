from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017/postgenerator"
    app_name: str = "PostGenerator API"
    
    model_config = SettingsConfigDict(env_file="backend/.env", extra="ignore")

settings = Settings()
