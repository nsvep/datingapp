from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .database import engine, Base
from .routers import auth
from . import models  # Import all models to register them

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Simple FastAPI app without database for testing
app = FastAPI(
    title="Dating App API - Simple",
    description="Minimal version for testing",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Simple Dating App API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "simple"}

@app.get("/test")
async def test_endpoint():
    return {"test": "working", "message": "This is a test endpoint"}

@app.get("/db-health")
async def db_health_check():
    try:
        # Test database connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
        return {
            "status": "healthy",
            "database": "connected",
            "message": "Database connection successful"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "message": "Database connection failed"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
