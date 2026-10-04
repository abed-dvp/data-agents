import asyncio
from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService
from google.genai.types import Content, Part

from agent import root_agent

APP_NAME = root_agent.name
USER_ID = "demo_user"
SESSION_ID = "demo_session"

async def main():
    session_service = DatabaseSessionService(
        db_url="sqlite:///agent_sessions.db"
    )

    session = await session_service.get_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
    )

    if session is None:
        session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID,
        )

    runner = Runner(
        agent=root_agent,
        session_service=session_service,
        app_name=APP_NAME,
    )

    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=Content(parts=[Part(text="What do you remember about me?")], role="user"),
    ):
        if event.content:
            for part in event.content.parts:
                if getattr(part, "text", None):
                    print(part.text)

if __name__ == "__main__":
    asyncio.run(main())
