from google.adk.agents import Agent, LoopAgent, SequentialAgent
from google.adk.tools import ToolContext
from dotenv import load_dotenv

load_dotenv()

DONE = "APPROVED"

def exit_loop(tool_context: ToolContext):
    """End the loop when the reviewer approves the answer."""
    tool_context.actions.escalate = True
    return {}

draft = Agent(
    name="draft_agent",
    model="gemini-flash-latest",
    instruction="Draft a concise answer to the user.",
    output_key="draft",
)

review = Agent(
    name="review_agent",
    model="gemini-flash-latest",
    instruction=f"""Review this draft: {{draft}}
If it is clear and correct, output exactly {DONE}.
Otherwise explain one concrete improvement.""",
    output_key="review",
)

refine = Agent(
    name="refine_agent",
    model="gemini-flash-latest",
    instruction=f"""Draft: {{draft}}
Review: {{review}}
If review is {DONE}, output {DONE}.
Otherwise produce an improved draft and save it as the new answer.""",
    output_key="draft",
)

exit_agent = Agent(
    name="exit_agent",
    model="gemini-flash-latest",
    tools=[exit_loop],
    instruction=f"If the input is exactly {DONE}, call exit_loop.",
)

loop = LoopAgent(
    name="review_loop",
    sub_agents=[review, refine, exit_agent],
    max_iterations=3,
)

root_agent = SequentialAgent(
    name="draft_and_refine",
    sub_agents=[draft, loop],
)
