# 🤖 AI Agent Crash Course — Complete Self‑Study Source

A hands-on, self-contained learning repository based on the **Google Cloud Tech – AI Agent Crash Course** playlist with Annie Wang.

> 🎥 Playlist: https://www.youtube.com/playlist?list=PLIivdWyY5sqLNeW9MPxldbbevMEJGMWBG  
> 📘 Interactive Codelab: https://abed-dvp.github.io/data-agents/  
> 🧩 Framework: Google Agent Development Kit (ADK)

This repository is designed so you can **learn the course without keeping the videos open beside you**.

The playlist covers foundational and advanced agent patterns, memory, multi-agent systems, MCP, and agent evaluation. Google’s official ADK codelab covers the same practical arc: first agent → workflow agents → router → agent-as-tool → persistent memory → MCP. The exercises here are independently written and organized for self-study.

---

# How to Use This Repository

For every concept, use the same study loop:

```text
1. What is it?
2. Why does it exist?
3. How does it work?
4. What does the code mean line by line?
5. When should I use it?
6. What is the common mistake?
7. Can I build or explain it without looking?
```

The repository has three layers:

```text
README      → complete reference / textbook
lessons/    → runnable code examples
codelab/    → interactive step-by-step practice
```

---

# Course Map

The playlist is organized around these major topics:

1. Foundational AI agent design patterns
2. Advanced AI agent design patterns
3. Short-term memory: sessions, events, and state
4. Persistent memory across restarts
5. Long-term memory and memory retrieval
6. Multi-agent system foundations with ADK
7. Workflow agents and agent communication
8. Connecting ADK agents to MCP servers
9. Database tools with MCP / Toolbox
10. Agent evaluation: theory
11. Agent evaluation: practical testing

---

# 0. Setup

## Requirements

You need:

- Python 3.10+
- Git
- a Google account
- a Gemini API key from Google AI Studio
- a terminal
- optional: VS Code

Check Python:

```bash
python --version
```

or on some systems:

```bash
python3 --version
```

## Clone the repository

```bash
git clone https://github.com/abed-dvp/data-agents.git
cd data-agents
```

## Create a virtual environment

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Why use a virtual environment?

A virtual environment isolates this project’s Python dependencies from your global Python installation.

Without it:

```text
project A needs package X v1
project B needs package X v2
→ conflict
```

With a virtual environment:

```text
project A → its own packages
project B → its own packages
```

## Install dependencies

```bash
pip install -r requirements.txt
```

Important packages:

```text
google-adk      → Google Agent Development Kit
python-dotenv   → loads local .env configuration
pytest          → automated testing
```

## Configure your Gemini API key

Copy the template:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Then edit:

```env
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your_api_key_here
```

### Why `GOOGLE_GENAI_USE_VERTEXAI=FALSE`?

It tells ADK to use a Gemini API key rather than Vertex AI authentication.

### Important

Never commit your real API key.

That is why:

```text
.env          → ignored
.env.example  → committed
```

---

# 1. What Is an AI Agent?

A normal LLM call looks roughly like:

```text
Input → Model → Output
```

An agent adds control, tools, state, and iteration:

```text
User
 ↓
Agent
 ├─ reason / decide
 ├─ call tools
 ├─ observe results
 ├─ update state
 └─ continue until task is complete
```

A useful mental model:

```text
Agent = Model + Instructions + Tools + State + Control Loop
```

Not every chatbot needs to be an agent.

Use agentic behavior when the system must:

- decide which action to take
- use external tools
- perform multiple steps
- route to specialists
- iterate based on feedback
- maintain state or memory

---

# 2. Your First ADK Agent

Minimal example:

```python
from google.adk.agents import Agent

root_agent = Agent(
    name="helpful_agent",
    model="gemini-flash-latest",
    description="A simple helpful assistant.",
    instruction="Answer clearly and concisely.",
)
```

## `Agent(...)`

Creates an LLM-driven ADK agent.

Important arguments:

### `name`

```python
name="helpful_agent"
```

A stable identifier for the agent.

Use simple names:

```text
weather_agent
planner_agent
research_agent
```

### `model`

```python
model="gemini-flash-latest"
```

Specifies the model used by the LLM agent.

### `description`

Tells the wider system what the agent is good at.

This matters especially in multi-agent routing.

### `instruction`

Defines the agent’s role and behavior.

Example:

```python
instruction="""
You are a restaurant specialist.
Return one recommendation and explain why it matches the user.
"""
```

---

# 3. Tools

An agent becomes more useful when it can act on external systems.

Conceptually:

```text
User asks question
      ↓
Agent decides a tool is needed
      ↓
Tool executes
      ↓
Tool result returns to the agent
      ↓
Agent produces final response
```

A Python function can be a tool:

```python
def calculate_total(price: float, quantity: int) -> float:
    """Calculate total price."""
    return price * quantity
```

Then:

```python
root_agent = Agent(
    name="shopping_agent",
    model="gemini-flash-latest",
    instruction="Help the user calculate shopping costs.",
    tools=[calculate_total],
)
```

## Why is the docstring important?

The model needs to understand:

- what the tool does
- when to use it
- what arguments it expects

A vague tool description makes tool selection less reliable.

---

# 4. Foundational Pattern 1 — Single Agent

A single agent owns the complete task.

```text
User
 ↓
Single Agent
 ├─ Tool A
 ├─ Tool B
 └─ Response
```

## Good fit

Use a single agent when:

- the task is not very complex
- one instruction set is enough
- tools share one responsibility
- you do not need explicit workflow control

## Weakness

As responsibilities grow, one giant instruction becomes difficult to:

- understand
- test
- maintain
- evaluate

This is when decomposition becomes useful.

---

# 5. Foundational Pattern 2 — Sequential Agent

A Sequential Agent runs sub-agents in a fixed order.

```text
Agent A → Agent B → Agent C
```

Example:

```python
from google.adk.agents import Agent, SequentialAgent

research_agent = Agent(
    name="research_agent",
    model="gemini-flash-latest",
    instruction="Research the topic and return key facts.",
    output_key="research"
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
```

## `output_key`

```python
output_key="research"
```

Stores the agent’s output in shared state:

```text
state["research"]
```

The next agent can reference it:

```text
{research}
```

## When to use SequentialAgent

Use it when:

- order is deterministic
- each step depends on the previous step
- you want a predictable pipeline

Example:

```text
extract requirements
      ↓
research
      ↓
draft
      ↓
review
```

---

# 6. Foundational Pattern 3 — Parallel Agent

Parallel execution is useful when tasks are independent.

Instead of:

```text
Museum search
    ↓
Restaurant search
    ↓
Concert search
```

run:

```text
          ┌─ Museum Agent ─────┐
User ─────┼─ Restaurant Agent ─┼─→ Synthesis
          └─ Concert Agent ────┘
```

Example:

```python
from google.adk.agents import Agent, ParallelAgent

museum_agent = Agent(
    name="museum_agent",
    model="gemini-flash-latest",
    instruction="Find one museum.",
    output_key="museum",
)

restaurant_agent = Agent(
    name="restaurant_agent",
    model="gemini-flash-latest",
    instruction="Find one restaurant.",
    output_key="restaurant",
)

parallel_research = ParallelAgent(
    name="parallel_research",
    sub_agents=[museum_agent, restaurant_agent],
)
```

## When parallelism is valid

Tasks must be independent.

Good:

```text
find museum
find restaurant
find concert
```

Bad:

```text
Step B requires Step A result
```

That requires sequential execution.

---

# 7. Advanced Pattern — Loop / Generator–Critic

A Loop Agent repeats a workflow.

Common pattern:

```text
Generate
   ↓
Critique
   ↓
Refine
   ↓
Check
   └──── repeat if needed
```

Why?

A first answer may not satisfy a strict constraint.

Example:

```text
Planner → proposes plan
Critic → checks travel time
Refiner → improves plan
Critic → checks again
```

Important:

Every loop needs a termination strategy.

For example:

- success condition
- maximum iterations
- explicit exit signal

Without a stopping condition:

```text
agent → critic → agent → critic → ...
```

can continue unnecessarily.

---

# 8. Advanced Pattern — Coordinator / Router

A router dynamically decides which specialist should receive the request.

```text
                 ┌─ Budget Agent
User → Router ───┼─ Events Agent
                 ├─ Research Agent
                 └─ Logistics Agent
```

This is different from a fixed Sequential Agent.

Sequential:

```text
always A → B → C
```

Router:

```text
inspect request → choose path
```

## Why descriptions matter

A coordinator must understand each specialist’s capability.

Bad:

```python
description="Does things"
```

Better:

```python
description="Finds current concerts and weekend events for a city."
```

---

# 9. Advanced Pattern — Agent as Tool

Sometimes you want the parent agent to keep full control while calling specialist agents like tools.

```python
from google.adk.tools.agent_tool import AgentTool

root_agent = Agent(
    name="architect_agent",
    model="gemini-flash-latest",
    instruction="Build and validate a plan.",
    tools=[
        AgentTool(agent=location_agent),
        AgentTool(agent=logistics_agent),
    ],
)
```

Conceptually:

```text
Parent Agent
  ├─ calls Specialist A as tool
  ├─ receives result
  ├─ reasons
  ├─ calls Specialist B as tool
  └─ remains in control
```

## Coordinator vs Agent-as-Tool

Coordinator/sub-agent delegation:

```text
parent delegates responsibility
```

Agent-as-tool:

```text
parent invokes specialist capability and keeps control
```

This distinction is one of the most important advanced patterns.

---

# 10. Short-Term Memory: Session, Event, State

Agents often need context inside an ongoing interaction.

ADK’s mental model:

```text
Session
 ├─ Events
 └─ State
```

## Session

A session represents one conversation context.

Typical identity:

```text
app_name
user_id
session_id
```

These identifiers matter.

If you accidentally change the session ID:

```text
old conversation context ≠ new session
```

## Events

Events are the detailed interaction history.

Examples:

- user messages
- agent responses
- tool calls
- tool responses

Think:

```text
Events = chronological log
```

## State

State is quick-access structured context.

Example:

```python
tool_context.state["preferred_cuisine"] = "Italian"
```

Think:

```text
Events = full story
State  = useful working variables
```

---

# 11. Session Services

A SessionService stores and retrieves sessions.

Simple local/in-memory example:

```python
from google.adk.sessions import InMemorySessionService

session_service = InMemorySessionService()
```

Useful for:

- demos
- unit tests
- temporary development

But:

```text
process exits
      ↓
memory disappears
```

---

# 12. Persistent Memory with DatabaseSessionService

To preserve session information across process restarts, use persistent storage.

Example:

```python
from google.adk.sessions import DatabaseSessionService

session_service = DatabaseSessionService(
    db_url="sqlite:///agent_sessions.db"
)
```

Now:

```text
run program
   ↓
save session to SQLite
   ↓
stop program
   ↓
restart
   ↓
load same session
```

The important idea is not SQLite specifically.

The important idea is:

```text
session lifecycle ≠ process lifecycle
```

---

# 13. Runner

The Runner executes an agent within a session context.

```python
from google.adk.runners import Runner

runner = Runner(
    agent=root_agent,
    session_service=session_service,
    app_name=root_agent.name,
)
```

The Runner connects:

```text
Agent
 +
Session Service
 +
User / Session
```

Then it processes messages and emits events.

---

# 14. Long-Term Memory

Persistent session history and long-term memory are related but not identical.

Session history:

```text
what happened in this conversation?
```

Long-term memory:

```text
what meaningful information about this user/task should be recalled later?
```

Examples:

```text
User prefers Italian food
User dislikes crowded places
User's project uses PostgreSQL
```

Good memory systems should avoid simply dumping every transcript forever.

They need:

- extraction
- relevance
- consolidation
- retrieval

---

# 15. Load Memory vs Preload Memory

Two useful patterns:

## On-demand memory

Agent decides:

> I need to search memory now.

Good when recall is optional.

## Preloaded memory

Relevant memory is fetched before model inference.

Conceptually:

```text
User query
    ↓
search memory
    ↓
inject relevant memories
    ↓
model call
```

ADK includes a `PreloadMemoryTool` concept for this behavior.

Trade-off:

```text
preload everything relevant → easy context
but
more retrieved context → more tokens/noise
```

---

# 16. Multi-Agent Systems

A multi-agent system contains multiple autonomous or semi-autonomous agents that cooperate.

Why split agents?

- specialization
- clearer instructions
- independent testing
- reusable capabilities
- explicit workflow control

But multi-agent is not automatically better.

Costs:

- more latency
- more model calls
- harder debugging
- more failure modes
- more evaluation complexity

Use multiple agents because responsibilities require separation, not because “multi-agent” sounds advanced.

---

# 17. ADK Agent Types

Important categories:

## LLM Agent

Uses a model to reason and choose actions.

## Workflow Agent

Controls execution deterministically.

Examples:

- SequentialAgent
- ParallelAgent
- LoopAgent

## Custom Agent

Used when built-in workflow primitives are not enough.

A strong architecture often combines:

```text
LLM decision-making
+
deterministic workflow control
```

---

# 18. Agent Hierarchy

ADK multi-agent systems often form a hierarchy.

```text
Root Agent
 ├─ Research Agent
 ├─ Booking Agent
 └─ Logistics Agent
```

The hierarchy helps define:

- ownership
- delegation boundaries
- available specialists

Avoid creating a giant flat list of agents without clear roles.

---

# 19. How Agents Communicate

Three important patterns:

## Shared Session State

Agent A writes:

```text
state["destination"] = "Rome"
```

Agent B reads it.

Good for deterministic workflows.

## LLM-Driven Delegation

The LLM chooses a sub-agent.

Good for dynamic routing.

## Explicit Invocation / AgentTool

Parent explicitly calls another agent as a tool.

Good when parent should maintain control.

---

# 20. What Is MCP?

MCP = **Model Context Protocol**.

A useful analogy:

```text
MCP is a standardized adapter between AI applications and external capabilities.
```

Without a common protocol:

```text
Agent ↔ custom integration A
Agent ↔ custom integration B
Agent ↔ custom integration C
```

With MCP:

```text
Agent / MCP Client
       ↓
   MCP Server
       ↓
files / DB / APIs / services
```

MCP can expose:

- tools
- resources
- external systems

---

# 21. Why MCP Matters

Benefits:

## Modularity

The tool provider and agent application can evolve separately.

## Reuse

One MCP server can serve multiple MCP-compatible clients.

## Security boundary

External capability can be isolated behind a server.

## Discoverability

Tools expose machine-readable descriptions.

But MCP does not magically make tools safe.

You still need:

- authentication
- authorization
- input validation
- least privilege
- logging
- rate limits

---

# 22. Connecting ADK to MCP

Conceptual architecture:

```text
ADK Agent
   ↓
MCP client/toolset
   ↓
MCP Server
   ↓
External capability
```

When debugging MCP, separate layers:

```text
1. Is the MCP server running?
2. Can the client reach it?
3. Can it discover tools?
4. Are tool schemas correct?
5. Can the agent select the right tool?
6. Does the underlying system return valid data?
```

Do not debug all six layers at once.

---

# 23. MCP Toolbox for Databases

Google’s Toolbox approach can expose database operations as agent tools.

Conceptually:

```text
Agent
 ↓
MCP / Toolbox
 ↓
defined database tool
 ↓
SQL database
```

The agent should not receive unrestricted arbitrary SQL access by default.

Better:

```text
find_museums(city)
find_top_rated(city)
find_affordable(city, max_cost)
```

These tools have:

- narrow purpose
- explicit arguments
- easier authorization
- easier evaluation

This is a key production lesson:

> Prefer bounded capabilities over a giant “do anything to the database” tool.

---

# 24. Agent Evaluation Is Different from LLM Evaluation

Traditional LLM evaluation often checks:

```text
input → final text
```

An agent has a trajectory:

```text
input
 ↓
tool choice
 ↓
tool arguments
 ↓
tool result
 ↓
state change
 ↓
next action
 ↓
final answer
```

Two agents can return similar final text while one used:

- the wrong tool
- too many calls
- unsafe arguments
- incorrect intermediate state

Therefore evaluation should cover more than the final response.

---

# 25. The Agent Testing Pyramid

A useful three-level model:

## Tier 1 — Component Tests

Test deterministic components:

- Python functions
- parsers
- validators
- tool wrappers

Fast and cheap.

Example:

```python
def test_calculate_total():
    assert calculate_total(10, 3) == 30
```

## Tier 2 — Trajectory / Integration Tests

Test agent behavior:

- did it call the right tool?
- with correct arguments?
- in the right order?
- did state change correctly?

## Tier 3 — End-to-End / Human Review

Evaluate real user experience:

- usefulness
- correctness
- safety
- clarity
- edge cases

Most agent systems need all three.

---

# 26. Current Evaluation Workflow

A practical evaluation loop:

```text
write eval cases
      ↓
run agent
      ↓
collect traces
      ↓
score behavior
      ↓
inspect failures
      ↓
change agent
      ↓
run again
```

Current Google agent tooling supports structured evaluation workflows.

Example:

```bash
agents-cli eval run
```

Do not treat evaluation as a final QA phase.

Use:

```text
build → evaluate → fix → evaluate → expand cases
```

---

# 27. What Should You Evaluate?

At minimum:

## Final response

Was the answer useful and correct?

## Tool selection

Did the agent choose the correct capability?

## Tool arguments

Were arguments complete and valid?

## Trajectory

Did the workflow follow the intended path?

## State

Was important context saved or updated correctly?

## Cost / efficiency

Did the agent make ten model/tool calls when two were enough?

## Failure behavior

What happens when:

- tool fails
- server times out
- data is missing
- user request is ambiguous
- memory is stale

---

# 28. Common Agent Engineering Mistakes

## 1. One giant agent

Everything is stuffed into one instruction.

Result:

- difficult to test
- difficult to reason about
- conflicting responsibilities

## 2. Too many agents

The opposite mistake.

Every tiny function becomes an agent.

Result:

- unnecessary latency
- unnecessary cost
- complex orchestration

## 3. Tool descriptions are vague

Then the model cannot reliably decide when to call them.

## 4. No loop termination rule

Iterative agents can waste calls.

## 5. Memory without scope

Storing everything forever creates noise and privacy risk.

## 6. Testing only final text

Agent failures often happen in the trajectory.

## 7. MCP server has excessive privilege

A powerful generic database tool is harder to secure than narrow operations.

---

# 29. Recommended Build Order

Do not start with a complex multi-agent MCP system.

Build progressively:

```text
1. Single Agent
2. Add one tool
3. Add Session/State
4. Sequential workflow
5. Parallel workflow
6. Loop/refinement
7. Dynamic router
8. Agent-as-tool
9. Persistent memory
10. MCP
11. Evaluation
```

At each step:

```text
run → inspect trace → test → understand failure
```

---

# 30. Useful ADK Commands

## `adk web`

```bash
adk web
```

### What it does

Starts the ADK development UI/server.

Typical use:

- interact with agents
- inspect behavior
- inspect traces
- compare agent implementations

Local UI is commonly available on a localhost port shown in the terminal.

Stop with:

```text
Ctrl + C
```

## Why use the web UI?

A normal chatbot view shows:

```text
question → answer
```

Agent debugging needs:

```text
question
→ agent decision
→ tool call
→ tool response
→ state
→ next decision
→ final answer
```

The trace is often more informative than the final answer.

---

# 31. Debugging Checklist

When an agent does the wrong thing, ask:

## Step 1 — Instruction

Is the expected behavior actually stated clearly?

## Step 2 — Tool description

Can the model understand what the tool does?

## Step 3 — Tool arguments

Did the model send correct values?

## Step 4 — Tool output

Did the tool return useful structured data?

## Step 5 — State

Was required context written/read correctly?

## Step 6 — Routing

Was the correct agent selected?

## Step 7 — Evaluation

Do you have a test that reproduces this failure?

Turn bugs into eval cases.

---

# Repository Structure

```text
data-agents/
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
│
├── lessons/
│   ├── 01_single_agent/
│   ├── 02_sequential/
│   ├── 03_parallel/
│   ├── 04_loop/
│   ├── 05_router/
│   ├── 06_agent_as_tool/
│   ├── 07_short_term_memory/
│   ├── 08_persistent_memory/
│   ├── 09_mcp/
│   └── 10_evaluation/
│
├── codelab/
│   ├── index.html
│   ├── steps.js
│   ├── app.js
│   └── styles.css
│
└── .github/workflows/
    └── publish-gh-pages.yml
```

---

# Interview Mental Model

If asked:

> How would you design an AI agent system?

Start with:

```text
1. Define the task and success criteria.
2. Decide whether one agent is enough.
3. Define deterministic tools.
4. Choose workflow pattern.
5. Define state/session/memory needs.
6. Define external integration boundary (API/MCP).
7. Define evaluation cases before production.
8. Add observability and safety.
```

Do **not** start with:

> “I would use five agents, MCP, and a vector database.”

Start with requirements.

---

# Final Summary

```text
Single Agent
      ↓
Sequential / Parallel
      ↓
Loop / Router / Agent-as-Tool
      ↓
Session / State
      ↓
Persistent & Long-Term Memory
      ↓
Multi-Agent Communication
      ↓
MCP
      ↓
Evaluation
```

The goal of the course is not to memorize ADK classes.

The goal is to understand:

> **which control pattern, memory model, integration boundary, and evaluation strategy fits the problem you are solving.**

---

## Sources & Credits

Course sequence inspired by Google Cloud Tech's **AI Agent Crash Course** featuring Annie Wang.

Technical implementation is aligned with current Google Agent Development Kit documentation and Google's official ADK learning materials.

All explanations, exercises, repository organization, and self-study notes in this repository are independently written for learning and portfolio use.
