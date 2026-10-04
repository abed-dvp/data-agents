# MCP Lesson

This lesson is architecture-first because an MCP server is a separate process.

Mental model:

```text
ADK Agent
   ↓
MCP client/toolset
   ↓
MCP server
   ↓
External system
```

Debug in layers:

1. Is the server running?
2. Can the client reach it?
3. Can tools be discovered?
4. Are schemas correct?
5. Does the agent choose the right tool?
6. Does the external system return valid data?

Prefer narrow tools such as:

- `find_destinations_by_type(city, type)`
- `find_top_rated(city)`
- `find_affordable(city, max_cost)`

over an unrestricted "execute arbitrary SQL" capability.
