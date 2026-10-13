from fastapi import HTTPException, status

class SentriqException(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)

class ScannerException(SentriqException):
    def __init__(self, detail: str):
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

class RateLimitException(SentriqException):
    def __init__(self, detail: str = "Rate limit exceeded. Please wait a moment."):
        super().__init__(detail=detail, status_code=status.HTTP_429_TOO_MANY_REQUESTS)
