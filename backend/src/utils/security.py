import os
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# Using HTTPBearer to extract the token from the Authorization header
security = HTTPBearer()


async def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency to verify the internal API key from the Authorization header.
    Expects format: Authorization: Bearer <API_KEY>
    """
    internal_api_key = os.getenv("INTERNAL_API_KEY")

    if not internal_api_key:
        # In development, we might not have the key set, but we should enforce it for security
        # If it's not set, we should probably warn but still block for safety
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="INTERNAL_API_KEY environment variable is not set on the server.",
        )

    if credentials.credentials != internal_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing Internal API Key",
        )

    return credentials.credentials
