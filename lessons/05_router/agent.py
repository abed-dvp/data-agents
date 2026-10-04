from google.adk.agents import Agent
from dotenv import load_dotenv

load_dotenv()

coding_agent = Agent(
    name="coding_agent",
    model="gemini-flash-latest",
    description="Handles programming and debugging questions.",
    instruction="Answer programming questions with concise examples.",
)

writing_agent = Agent(
    name="writing_agent",
    model="gemini-flash-latest",
    description="Handles rewriting, editing, and writing requests.",
    instruction="Help the user improve writing clearly.",
)

root_agent = Agent(
    name="router_agent",
    model="gemini-flash-latest",
    instruction="Route the request to the best specialist.",
    sub_agents=[coding_agent, writing_agent],
)
