from google.adk.agents import Agent, SequentialAgent
from dotenv import load_dotenv

load_dotenv()

research_agent = Agent(
    name="research_agent",
    model="gemini-flash-latest",
    instruction="Summarize the user's topic into three factual bullet points.",
    output_key="research",
)

writer_agent = Agent(
    name="writer_agent",
    model="gemini-flash-latest",
    instruction="Write a short explanation using this research: {research}",
)

root_agent = SequentialAgent(
    name="research_then_write",
    sub_agents=[research_agent, writer_agent],
)
