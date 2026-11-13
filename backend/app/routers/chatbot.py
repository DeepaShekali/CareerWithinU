import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ChatMessage
from ..schemas import ChatMessageCreate, ChatMessageOut, ChatResponse
from ..auth import get_current_user
from ..ai_engine.chatbot import generate_chat_response

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

@router.get("/history", response_model=List[ChatMessageOut])
def get_chat_history(
    session_id: str = "default",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves saved chat conversation history for the student."""
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.timestamp.asc()).all()

    # If new user and no history, create default friendly welcome
    if not messages:
        welcome_msg = ChatMessage(
            user_id=current_user.id,
            session_id=session_id,
            sender="assistant",
            message=f"Hi {current_user.full_name.split()[0]}! Welcome to CareerWithinU. I'm your AI Career Assistant. Let's discover a career path that matches your skills, interests and ambitions.",
            timestamp=datetime.datetime.utcnow(),
            intent_tag="welcome"
        )
        db.add(welcome_msg)
        db.commit()
        db.refresh(welcome_msg)
        messages = [welcome_msg]

    return messages

@router.post("/message", response_model=Dict[str, Any])
def send_chat_message(
    chat_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Processes student query:
    1. Saves user message
    2. Runs AI Assistant response generation
    3. Saves assistant reply
    4. Returns complete response with follow-up suggestions
    """
    user_msg_text = chat_in.message.strip()
    if not user_msg_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # 1. Save student message
    student_msg = ChatMessage(
        user_id=current_user.id,
        session_id=chat_in.session_id or "default",
        sender="user",
        message=user_msg_text,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(student_msg)
    db.commit()

    # 2. Generate AI response
    ai_result = generate_chat_response(
        user_id=current_user.id,
        user_message=user_msg_text,
        db=db
    )

    # 3. Save assistant response
    assistant_msg = ChatMessage(
        user_id=current_user.id,
        session_id=chat_in.session_id or "default",
        sender="assistant",
        message=ai_result["reply"],
        timestamp=datetime.datetime.utcnow(),
        intent_tag=ai_result.get("intent_tag")
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return {
        "reply": ai_result["reply"],
        "intent_tag": ai_result.get("intent_tag", "general"),
        "suggested_actions": ai_result.get("suggested_actions", []),
        "career_suggestions": ai_result.get("career_suggestions", []),
        "message_id": assistant_msg.id,
        "timestamp": assistant_msg.timestamp
    }

@router.post("/clear")
def clear_chat_history(
    session_id: str = "default",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clears previous chat messages and resets with initial welcome."""
    db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.session_id == session_id
    ).delete()

    welcome_msg = ChatMessage(
        user_id=current_user.id,
        session_id=session_id,
        sender="assistant",
        message=f"Hi {current_user.full_name.split()[0]}! Welcome to CareerWithinU. I'm your AI Career Assistant. Let's discover a career path that matches your skills, interests and ambitions.",
        timestamp=datetime.datetime.utcnow(),
        intent_tag="welcome"
    )
    db.add(welcome_msg)
    db.commit()

    return {"message": "Chat history cleared successfully.", "welcome_message": welcome_msg.message}
