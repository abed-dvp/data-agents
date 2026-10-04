from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from dotenv import load_dotenv

load_dotenv()

researcher = Agent(
    name="researcher",
    model="gemini-flash-latest",
    description="Produces a concise factual briefing.",
    instruction="Return only the key facts needed for the user's request.",
)

critic = Agent(
    name="critic",
    model="gemini-flash-latest",
    description="Finds weaknesses and missing assumptions.",
    instruction="Critique the proposed answer and list only actionable issues.",
)

root_agent = Agent(
    name="architect_agent",
    model="gemini-flash-latest",
    instruction="Use specialist agents as tools when needed, but keep control of the final response.",
    tools=[AgentTool(agent=researcher), AgentTool(agent=critic)],
)
