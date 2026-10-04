from google.adk.agents import Agent, ParallelAgent, SequentialAgent
from dotenv import load_dotenv

load_dotenv()

pros_agent = Agent(
    name="pros_agent",
    model="gemini-flash-latest",
    instruction="List the strongest advantages of the user's topic.",
    output_key="pros",
)

cons_agent = Agent(
    name="cons_agent",
    model="gemini-flash-latest",
    instruction="List the strongest disadvantages of the user's topic.",
    output_key="cons",
)

parallel = ParallelAgent(
    name="parallel_research",
    sub_agents=[pros_agent, cons_agent],
)

synthesis = Agent(
    name="synthesis_agent",
    model="gemini-flash-latest",
    instruction="Compare the pros and cons clearly.
Pros: {pros}
Cons: {cons}",
)

root_agent = SequentialAgent(
    name="parallel_then_synthesize",
    sub_agents=[parallel, synthesis],
)
