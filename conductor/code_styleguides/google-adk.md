# Google Agent Development Kit (ADK) Style Guide

## Core Principles
- **Code-First Agents**: Define agents and tools directly in Python code for maximum control and type safety.
- **Gemini-First**: Optimized for Google Gemini models (e.g., `gemini-2.0-flash`).
- **Modularity**: Use specialized agents for specific tasks and orchestrate them through a root agent.
- **Tool Integration**: Decorate functions as tools to extend agent capabilities.

## Agent Definition

### Basic Agent
Define an agent with a clear `name`, `model`, `instruction`, and `description`.

```python
from google.adk.agents import Agent

weather_agent = Agent(
    name="weather_agent",
    model="gemini-2.0-flash",
    description="Provides weather information for specific cities.",
    instruction="""
    You are a helpful weather assistant.
    Use the 'get_weather' tool to find information when requested.
    Present results clearly to the user.
    """,
    tools=[get_weather]
)
```

### Multi-Agent Orchestration
Use `AgentTool` to nest specialized agents into a root agent.

```python
from google.adk.tools.agent_tool import AgentTool
from google.adk.agents import Agent

search_agent = Agent(name="SearchAgent", tools=[google_search])
coding_agent = Agent(name="CodeAgent", code_executor=BuiltInCodeExecutor())

root_agent = Agent(
    name="RootAgent",
    model="gemini-2.0-flash",
    tools=[AgentTool(agent=search_agent), AgentTool(agent=coding_agent)]
)
```

## Tool Development

### Function Tools
Decorate Python functions to make them available to agents. Use type hints and docstrings for automatic schema generation.

```python
def get_weather(city: str) -> str:
    """Gets the current weather for a given city."""
    # Implementation
    return f"The weather in {city} is sunny."
```

### Built-in Tools
Leverage ADK's built-in tools like `google_search` or `BuiltInCodeExecutor`.

```python
from google.adk.tools import google_search
from google.adk.code_executors import BuiltInCodeExecutor
```

## Orchestration & Streaming
- Use `InMemoryRunner` for local testing and session management.
- Handle events and stream responses for a responsive user experience.

```python
from google.adk.runners import InMemoryRunner

runner = InMemoryRunner(agent=root_agent, app_name="my_app")
events = runner.run_async(user_id="user1", session_id="session1", new_message="What's the weather in Tokyo?")

for event in events:
    # Process event.content.parts
    pass
```

## Backend Structure (FastAPI Integration)

### REST API Standards
- **URL Structure**: Use resource-oriented URLs (e.g., `/api/v1/agents`, `/api/v1/agents/{id}/chat`).
- **HTTP Methods**:
  - `GET`: Retrieve resources.
  - `POST`: Create resources or trigger complex actions (like running an agent).
  - `PUT`: Update/Replace resources.
  - `DELETE`: Remove resources.
- **Status Codes**:
  - `200 OK`: Successful synchronous request.
  - `201 Created`: Resource created.
  - `202 Accepted`: Asynchronous task started (e.g., long-running agent task).
  - `400 Bad Request`: Validation error.
  - `401 Unauthorized`: Authentication failed.
  - `404 Not Found`: Resource missing.
  - `500 Internal Server Error`: Server-side crash.

### Data Validation (Pydantic)
- Use `pydantic.BaseModel` for all request bodies and response schemas.
- Use type hints strictly.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's input message")
    session_id: str = Field(..., description="Unique session identifier")

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Call ADK runner logic here
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    return ChatResponse(response="Agent processed your message.")
```
