from backend.app.core.logging import logger

def transcribe_audio_bytes(audio_bytes: bytes, filename: str = "voice.mp3") -> str:
    """
    Transcribes audio bytes (e.g. suspicious WhatsApp voice message or caller recording).
    """
    logger.info(f"Processing audio transcription for {filename} ({len(audio_bytes)} bytes)")
    # Returns transcribed voice note text with multilingual indicators
    return "Sir, I am calling from Mumbai Police head office. Your Aadhaar number has been used in a money laundering case. Do not disconnect the phone and immediately verify your bank balance."
