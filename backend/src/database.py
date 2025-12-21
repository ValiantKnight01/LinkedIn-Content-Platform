from mongoengine import connect, disconnect
from .config import settings

def connect_db():
    connect(host=settings.mongodb_uri)
    print("Connected to MongoDB")

def disconnect_db():
    disconnect()
    print("Disconnected from MongoDB")
