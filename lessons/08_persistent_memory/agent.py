from google.adk.agents import Agent
from dotenv import load_dotenv

load_dotenv()

root_agent = Agent(
    name="persistent_memory_agent",
    model="gemini-flash-latest",
    instruction="Use the conversation/session context to answer consistently.",
)
