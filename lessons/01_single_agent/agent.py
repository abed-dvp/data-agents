from google.adk.agents import Agent
from dotenv import load_dotenv

load_dotenv()

root_agent = Agent(
    name="helpful_agent",
    model="gemini-flash-latest",
    description="A simple helpful assistant.",
    instruction="""
You are a concise and helpful assistant.
Answer clearly. If you are unsure, say so.
""",
)
