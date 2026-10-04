from google.adk.agents import Agent
from google.adk.tools import ToolContext
from dotenv import load_dotenv

load_dotenv()

def save_preference(tool_context: ToolContext, key: str, value: str) -> str:
    """Save one preference in the current session state."""
    tool_context.state[key] = value
    return f"Saved {key}={value}"

def read_preference(tool_context: ToolContext, key: str) -> str:
    """Read one preference from the current session state."""
    return str(tool_context.state.get(key, "not set"))

root_agent = Agent(
    name="memory_agent",
    model="gemini-flash-latest",
    instruction="Remember and recall user preferences using the provided tools.",
    tools=[save_preference, read_preference],
)
