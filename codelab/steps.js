window.CODELAB_STEPS = [
  {
    "title": "What Is an AI Agent?",
    "section": "Foundations",
    "learn": "An agent combines a model with instructions, tools, state, and a control loop so it can decide and act rather than only produce one response.",
    "bullets": [
      "LLM call: input → model → output.",
      "Agent: input → decide → tool/action → observe → continue.",
      "Use agents when the task needs decisions, tools, multiple steps, routing, or memory."
    ],
    "example": "Agent = Model + Instructions + Tools + State + Control Loop",
    "challenge": "Write the five parts of the agent mental model.",
    "starter": "Agent = ",
    "solution": "Agent = Model + Instructions + Tools + State + Control Loop",
    "check": [
      "model",
      "instructions",
      "tools",
      "state",
      "control"
    ],
    "takeaway": "Agentic systems add control and action around the model."
  },
  {
    "title": "Set Up Python & Virtual Environment",
    "section": "Setup",
    "learn": "Use a virtual environment so ADK dependencies are isolated from your global Python installation.",
    "bullets": [
      "`python -m venv .venv` creates the environment.",
      "Activating it changes which Python/pip commands your shell uses.",
      "Install project dependencies only after activation."
    ],
    "example": "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install -r requirements.txt",
    "challenge": "Write the Windows PowerShell command that activates `.venv`.",
    "starter": "",
    "solution": ".\\.venv\\Scripts\\Activate.ps1",
    "check": [
      ".venv",
      "activate.ps1"
    ],
    "takeaway": "Environment isolation makes setup reproducible."
  },
  {
    "title": "Environment Variables & API Key",
    "section": "Setup",
    "learn": "Keep credentials outside code and load them through environment variables.",
    "bullets": [
      "`.env.example` is safe to commit.",
      "`.env` contains your local secret and is ignored.",
      "`GOOGLE_GENAI_USE_VERTEXAI=FALSE` selects Gemini API-key auth in this setup."
    ],
    "example": "GOOGLE_GENAI_USE_VERTEXAI=FALSE\nGOOGLE_API_KEY=your_api_key_here",
    "challenge": "Which file should contain the real API key locally?",
    "starter": "",
    "solution": ".env",
    "check": [
      ".env"
    ],
    "takeaway": "Commit configuration templates, never real keys."
  },
  {
    "title": "Your First ADK Agent",
    "section": "Foundations",
    "learn": "`Agent(...)` creates an LLM-driven ADK agent with a stable name, model, description, and instruction.",
    "bullets": [
      "`name` identifies the agent.",
      "`model` chooses the model.",
      "`description` helps other agents understand its capability.",
      "`instruction` defines its behavior."
    ],
    "example": "root_agent = Agent(\n  name=\"helpful_agent\",\n  model=\"gemini-flash-latest\",\n  description=\"A simple helpful assistant.\",\n  instruction=\"Answer clearly and concisely.\",\n)",
    "challenge": "Create an agent named `research_agent` using `gemini-flash-latest`.",
    "starter": "root_agent = Agent(\n  \n)",
    "solution": "root_agent = Agent(\n  name=\"research_agent\",\n  model=\"gemini-flash-latest\",\n  instruction=\"Research the user request clearly.\",\n)",
    "check": [
      "name=\"research_agent\"",
      "model=\"gemini-flash-latest\""
    ],
    "takeaway": "A good agent starts with a narrow responsibility and clear instruction."
  },
  {
    "title": "Tools: Give the Agent Capabilities",
    "section": "Foundations",
    "learn": "Tools let an agent interact with deterministic functions and external systems.",
    "bullets": [
      "A tool should do one clear job.",
      "Its name and docstring help the model decide when to call it.",
      "Structured arguments make tool use easier to validate."
    ],
    "example": "def calculate_total(price: float, quantity: int) -> float:\n    \"\"\"Calculate total price.\"\"\"\n    return price * quantity\n\nAgent(..., tools=[calculate_total])",
    "challenge": "What three things should a tool description make clear?",
    "starter": "1.\n2.\n3.",
    "solution": "1. What the tool does\n2. When to use it\n3. What arguments it expects",
    "check": [
      "what",
      "when",
      "arguments"
    ],
    "takeaway": "Tool quality starts with a narrow contract the model can understand."
  },
  {
    "title": "Single-Agent Pattern",
    "section": "Design Patterns",
    "learn": "A single agent owns the complete task and all its tools.",
    "bullets": [
      "Simple architecture.",
      "Easy to start and debug.",
      "Becomes hard to maintain when responsibilities conflict or grow."
    ],
    "example": "User → Single Agent → Tools → Response",
    "challenge": "When is a single agent a good fit?",
    "starter": "When ...",
    "solution": "When one clear instruction set and a small group of related tools can handle the task.",
    "check": [
      "one",
      "instruction",
      "tools"
    ],
    "takeaway": "Start with one agent unless the problem actually needs decomposition."
  },
  {
    "title": "SequentialAgent",
    "section": "Design Patterns",
    "learn": "A SequentialAgent runs sub-agents in a deterministic order.",
    "bullets": [
      "Use it when step B depends on step A.",
      "`output_key` can save one agent's result into shared state.",
      "Later instructions can reference that state."
    ],
    "example": "research = Agent(..., output_key=\"research\")\nwriter = Agent(..., instruction=\"Use: {research}\")\nroot_agent = SequentialAgent(\n  name=\"research_then_write\",\n  sub_agents=[research, writer],\n)",
    "challenge": "What ADK field stores an agent's final output into state?",
    "starter": "",
    "solution": "output_key",
    "check": [
      "output_key"
    ],
    "takeaway": "Sequential workflows make ordering explicit instead of hoping an LLM follows an implicit sequence."
  },
  {
    "title": "State Handoff with output_key",
    "section": "Design Patterns",
    "learn": "`output_key` writes an agent's output into shared state so downstream agents can consume it.",
    "bullets": [
      "Agent A writes state.",
      "Agent B reads `{key}` in its instruction.",
      "This is clearer than re-prompting the same information."
    ],
    "example": "foodie_agent = Agent(..., output_key=\"destination\")\ntransport_agent = Agent(..., instruction=\"Navigate to {destination}\")",
    "challenge": "If Agent A uses `output_key='plan'`, how can Agent B reference it in its instruction?",
    "starter": "",
    "solution": "{plan}",
    "check": [
      "{plan}"
    ],
    "takeaway": "Shared state is a clean handoff mechanism for deterministic workflows."
  },
  {
    "title": "ParallelAgent",
    "section": "Design Patterns",
    "learn": "ParallelAgent runs independent sub-agents concurrently.",
    "bullets": [
      "Use parallelism only when tasks do not depend on each other's outputs.",
      "Each branch should store its own result.",
      "A later synthesis step can combine them."
    ],
    "example": "          ┌─ Museum Agent ───┐\nUser ─────┼─ Concert Agent ──┼→ Synthesis\n          └─ Food Agent ─────┘",
    "challenge": "Are these parallelizable: find a museum, restaurant, and concert independently?",
    "starter": "",
    "solution": "Yes. They are independent searches and can run in parallel.",
    "check": [
      "yes",
      "independent"
    ],
    "takeaway": "Parallelism improves latency only when the branches are genuinely independent."
  },
  {
    "title": "Sequential + Parallel Together",
    "section": "Design Patterns",
    "learn": "Complex workflows can compose workflow agents.",
    "bullets": [
      "Parallel research can run first.",
      "A sequential synthesis step can run afterward.",
      "Composition is more maintainable than one giant prompt."
    ],
    "example": "SequentialAgent([\n  ParallelAgent([A, B, C]),\n  synthesis_agent,\n])",
    "challenge": "Which workflow should wrap `ParallelAgent + synthesis_agent` when synthesis must wait?",
    "starter": "",
    "solution": "SequentialAgent",
    "check": [
      "sequentialagent"
    ],
    "takeaway": "Workflow agents are composable building blocks."
  },
  {
    "title": "LoopAgent: Generator–Critic",
    "section": "Advanced Patterns",
    "learn": "LoopAgent repeats a set of sub-agents until a stop condition or iteration limit is reached.",
    "bullets": [
      "Useful for critique/refine cycles.",
      "Always define a termination condition.",
      "Use `max_iterations` as a safety bound."
    ],
    "example": "Draft → Critique → Refine → Check\n           ↑             ↓\n           └──── repeat ─┘",
    "challenge": "Name two protections every agent loop should have.",
    "starter": "1.\n2.",
    "solution": "1. A success/exit condition\n2. A maximum iteration limit",
    "check": [
      "condition",
      "maximum"
    ],
    "takeaway": "A loop without a stopping rule is an operational bug waiting to happen."
  },
  {
    "title": "Exit a Loop with ToolContext",
    "section": "Advanced Patterns",
    "learn": "A tool can signal workflow termination through ToolContext actions.",
    "bullets": [
      "The exit controller decides whether the loop is done.",
      "The tool changes control flow rather than business data.",
      "Keep the success phrase/condition precise."
    ],
    "example": "def exit_loop(tool_context: ToolContext):\n    tool_context.actions.escalate = True\n    return {}",
    "challenge": "Which ToolContext property is set to end/escalate the loop in this pattern?",
    "starter": "tool_context.actions.",
    "solution": "tool_context.actions.escalate = True",
    "check": [
      "escalate",
      "true"
    ],
    "takeaway": "Control-flow tools should be explicit and narrowly scoped."
  },
  {
    "title": "Router / Coordinator Pattern",
    "section": "Advanced Patterns",
    "learn": "A router analyzes the request and delegates it to the most appropriate specialist.",
    "bullets": [
      "Descriptions become routing metadata.",
      "Routes should have clear decision boundaries.",
      "Dynamic routing is different from a fixed sequential workflow."
    ],
    "example": "                 ┌─ Budget Agent\nUser → Router ───┼─ Events Agent\n                 └─ Logistics Agent",
    "challenge": "What is the key difference between a router and SequentialAgent?",
    "starter": "",
    "solution": "A router dynamically chooses a path; SequentialAgent always runs a predefined order.",
    "check": [
      "dynamically",
      "predefined"
    ],
    "takeaway": "Use routing when the correct path depends on the user's request."
  },
  {
    "title": "Agent as Tool",
    "section": "Advanced Patterns",
    "learn": "AgentTool lets a parent invoke a specialist agent like a tool while the parent keeps control.",
    "bullets": [
      "Specialist agent becomes a callable capability.",
      "Parent decides when to invoke it.",
      "Useful when the parent must reason between specialist calls."
    ],
    "example": "tools=[\n  AgentTool(agent=researcher),\n  AgentTool(agent=critic),\n]",
    "challenge": "What is the main control difference between delegation and AgentTool?",
    "starter": "",
    "solution": "With AgentTool, the parent agent keeps control and invokes the specialist as a capability.",
    "check": [
      "parent",
      "control"
    ],
    "takeaway": "Agent-as-tool is useful when orchestration should stay centralized."
  },
  {
    "title": "Session, Event, and State",
    "section": "Memory",
    "learn": "ADK separates a conversation container, its chronological events, and structured working state.",
    "bullets": [
      "Session = one conversation context.",
      "Events = chronological messages/tool activity.",
      "State = structured variables useful during the session."
    ],
    "example": "Session\n ├─ Events\n └─ State",
    "challenge": "Match them: full chronological log = ?, quick structured variables = ?",
    "starter": "Log = \nVariables = ",
    "solution": "Log = Events\nVariables = State",
    "check": [
      "events",
      "state"
    ],
    "takeaway": "Events tell the story; state stores the working facts."
  },
  {
    "title": "InMemorySessionService",
    "section": "Memory",
    "learn": "InMemorySessionService stores session data only for the lifetime of the running process.",
    "bullets": [
      "Excellent for demos and tests.",
      "Fast and simple.",
      "Restarting the process loses the stored sessions."
    ],
    "example": "session_service = InMemorySessionService()",
    "challenge": "What happens to its sessions when the process exits?",
    "starter": "",
    "solution": "They are lost because the service is in-memory only.",
    "check": [
      "lost",
      "memory"
    ],
    "takeaway": "In-memory session storage is temporary by design."
  },
  {
    "title": "DatabaseSessionService",
    "section": "Memory",
    "learn": "DatabaseSessionService persists session data so the same session can survive process restarts.",
    "bullets": [
      "SQLite is convenient for local learning.",
      "The important idea is persistent session storage, not SQLite itself.",
      "Use stable app/user/session identifiers when retrieving a session."
    ],
    "example": "session_service = DatabaseSessionService(\n  db_url=\"sqlite:///agent_sessions.db\"\n)",
    "challenge": "What problem does DatabaseSessionService solve compared with InMemorySessionService?",
    "starter": "",
    "solution": "It persists sessions across process restarts.",
    "check": [
      "persist",
      "restart"
    ],
    "takeaway": "Session lifetime can be longer than process lifetime."
  },
  {
    "title": "Runner",
    "section": "Memory",
    "learn": "Runner connects an agent, session service, app identity, and incoming messages into one execution loop.",
    "bullets": [
      "Runner executes the agent.",
      "It reads/writes session context.",
      "It emits events you can inspect."
    ],
    "example": "runner = Runner(\n  agent=root_agent,\n  session_service=session_service,\n  app_name=root_agent.name,\n)",
    "challenge": "What three major pieces does Runner connect?",
    "starter": "1.\n2.\n3.",
    "solution": "1. Agent\n2. Session service/context\n3. Incoming user message / execution events",
    "check": [
      "agent",
      "session",
      "message"
    ],
    "takeaway": "Runner is the execution bridge between agent logic and conversation state."
  },
  {
    "title": "Persistent Preferences with ToolContext.state",
    "section": "Memory",
    "learn": "Tools can read and update structured session state through ToolContext.",
    "bullets": [
      "Use stable keys.",
      "Merge new preferences rather than overwriting unrelated data.",
      "State is session-scoped unless backed by persistent storage."
    ],
    "example": "current = tool_context.state.get(\"preferences\") or {}\ncurrent.update(new_preferences)\ntool_context.state[\"preferences\"] = current",
    "challenge": "Which object gives a tool access to session state?",
    "starter": "",
    "solution": "ToolContext",
    "check": [
      "toolcontext"
    ],
    "takeaway": "ToolContext is the bridge between tool execution and agent/session state."
  },
  {
    "title": "Long-Term Memory",
    "section": "Memory",
    "learn": "Long-term memory retrieves meaningful information beyond the immediate conversational working state.",
    "bullets": [
      "Do not confuse full transcript storage with useful memory.",
      "Memory should be relevant and scoped.",
      "Retrieval should return only what helps the current task."
    ],
    "example": "Conversation history ≠ long-term memory\nLong-term memory = selected useful facts + retrieval",
    "challenge": "Why is storing every transcript as memory a poor strategy?",
    "starter": "Because ...",
    "solution": "Because it creates noise, increases context cost, and may retain irrelevant or sensitive information.",
    "check": [
      "noise",
      "irrelevant"
    ],
    "takeaway": "Useful memory is selective, retrievable, and scoped."
  },
  {
    "title": "Multi-Agent Systems",
    "section": "Multi-Agent",
    "learn": "Multi-agent systems split responsibilities across specialized agents.",
    "bullets": [
      "Benefits: specialization, testability, reuse, clearer instructions.",
      "Costs: latency, model calls, routing complexity, more failure modes.",
      "More agents is not automatically better."
    ],
    "example": "Root Agent\n ├─ Research Agent\n ├─ Booking Agent\n └─ Logistics Agent",
    "challenge": "Give one benefit and one cost of multi-agent architecture.",
    "starter": "Benefit: \nCost: ",
    "solution": "Benefit: specialization/testability\nCost: more latency and orchestration complexity",
    "check": [
      "benefit",
      "cost"
    ],
    "takeaway": "Use multiple agents only when responsibility boundaries justify the complexity."
  },
  {
    "title": "Agent Communication Patterns",
    "section": "Multi-Agent",
    "learn": "Agents can communicate through shared state, delegation, or explicit AgentTool invocation.",
    "bullets": [
      "Shared state fits deterministic handoff.",
      "Delegation fits dynamic specialist routing.",
      "AgentTool fits centralized parent control."
    ],
    "example": "State → deterministic handoff\nDelegation → dynamic routing\nAgentTool → explicit specialist call",
    "challenge": "Which pattern fits a fixed workflow where Agent B reads Agent A's result?",
    "starter": "",
    "solution": "Shared state / output_key handoff",
    "check": [
      "state"
    ],
    "takeaway": "Pick the communication mechanism that matches the control model."
  },
  {
    "title": "What Is MCP?",
    "section": "MCP",
    "learn": "Model Context Protocol standardizes how AI applications connect to external tools and resources.",
    "bullets": [
      "Client and server are separated.",
      "Capabilities can be discovered through schemas.",
      "One MCP server can serve multiple compatible clients."
    ],
    "example": "ADK Agent → MCP Client → MCP Server → External System",
    "challenge": "What architectural boundary does MCP create?",
    "starter": "",
    "solution": "A standardized boundary between the agent application and external tools/resources.",
    "check": [
      "standard",
      "external"
    ],
    "takeaway": "MCP decouples agent applications from tool-provider implementations."
  },
  {
    "title": "Debug MCP Layer by Layer",
    "section": "MCP",
    "learn": "MCP bugs can occur at several layers, so debug them in order instead of changing everything.",
    "bullets": [
      "Server running?",
      "Client reachable?",
      "Tools discoverable?",
      "Schemas correct?",
      "Agent selecting correctly?",
      "Underlying system healthy?"
    ],
    "example": "server → transport → discovery → schema → selection → external system",
    "challenge": "What should you check first when an MCP tool cannot be used at all?",
    "starter": "",
    "solution": "Confirm that the MCP server is running and reachable.",
    "check": [
      "server",
      "running",
      "reachable"
    ],
    "takeaway": "Separate transport, schema, agent-choice, and backend failures."
  },
  {
    "title": "Database Tools with MCP / Toolbox",
    "section": "MCP",
    "learn": "Expose narrow database capabilities instead of unrestricted arbitrary SQL whenever possible.",
    "bullets": [
      "Narrow tools are easier to secure.",
      "Explicit parameters are easier to validate.",
      "Tool names/descriptions improve agent selection and evaluation."
    ],
    "example": "find_top_rated(city)\nfind_affordable(city, max_cost)\nfind_by_type(city, type)",
    "challenge": "Why is `execute_any_sql(sql)` riskier than `find_affordable(city, max_cost)`?",
    "starter": "",
    "solution": "Because arbitrary SQL has much broader permissions and is harder to validate and authorize safely.",
    "check": [
      "broader",
      "validate"
    ],
    "takeaway": "Least-privilege tool design matters as much as agent prompting."
  },
  {
    "title": "Agent Evaluation: Beyond Final Text",
    "section": "Evaluation",
    "learn": "Agent evaluation must inspect the trajectory, not only the final answer.",
    "bullets": [
      "Check tool selection.",
      "Check tool arguments.",
      "Check state changes.",
      "Check ordering/trajectory.",
      "Check final response."
    ],
    "example": "Input → Tool choice → Arguments → Result → State → Next action → Final answer",
    "challenge": "Name three things to evaluate before the final answer.",
    "starter": "1.\n2.\n3.",
    "solution": "1. Tool selection\n2. Tool arguments\n3. State/trajectory",
    "check": [
      "tool",
      "arguments",
      "state"
    ],
    "takeaway": "An agent can sound correct while taking the wrong actions."
  },
  {
    "title": "Agent Testing Pyramid",
    "section": "Evaluation",
    "learn": "Use different test layers for deterministic code, agent behavior, and real user experience.",
    "bullets": [
      "Tier 1: component/unit tests.",
      "Tier 2: trajectory/integration tests.",
      "Tier 3: end-to-end and human review."
    ],
    "example": "Component → Trajectory/Integration → End-to-End",
    "challenge": "Where should a deterministic calculator tool be tested first?",
    "starter": "",
    "solution": "Tier 1 component/unit test",
    "check": [
      "component"
    ],
    "takeaway": "Test deterministic pieces cheaply before spending model calls on end-to-end tests."
  },
  {
    "title": "Turn Bugs into Eval Cases",
    "section": "Evaluation",
    "learn": "Every reproducible agent failure should become a regression evaluation case.",
    "bullets": [
      "Capture the failing input.",
      "Capture expected tool/trajectory behavior.",
      "Fix the agent.",
      "Re-run the case in future changes."
    ],
    "example": "bug → eval case → fix → regression protection",
    "challenge": "What should you do after reproducing a routing failure?",
    "starter": "",
    "solution": "Add it as an evaluation/regression case before or alongside the fix.",
    "check": [
      "eval",
      "case"
    ],
    "takeaway": "Evaluation is a development loop, not a final QA step."
  },
  {
    "title": "Final Architecture Mental Model",
    "section": "Wrap-up",
    "learn": "Build agent systems from requirements, not from fashionable components.",
    "bullets": [
      "Start with one agent.",
      "Add tools only when actions are required.",
      "Add workflow agents when control flow needs structure.",
      "Add memory when continuity requires it.",
      "Add MCP when external integration needs a standard boundary.",
      "Add evaluation from the beginning."
    ],
    "example": "Task → Agent → Tools → Workflow → Memory → MCP → Evaluation",
    "challenge": "Write the recommended build order from simple agent to evaluated system.",
    "starter": "1.\n2.\n3.\n4.\n5.",
    "solution": "1. Single agent\n2. Add tools\n3. Add workflow/multi-agent only when needed\n4. Add memory/MCP for real requirements\n5. Add and continuously run evaluations",
    "check": [
      "single",
      "tools",
      "workflow",
      "memory",
      "eval"
    ],
    "takeaway": "Complexity should be earned by requirements."
  }
];