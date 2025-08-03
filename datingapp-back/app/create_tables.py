"""
Script to create all database tables
Run this script to initialize the database with all models
"""

from database import Base, engine
import models  # This imports all models and registers them with Base.metadata

def create_tables():
    """Create all tables in the database"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        print("Created tables:")
        for table in Base.metadata.tables.keys():
            print(f"  - {table}")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()
