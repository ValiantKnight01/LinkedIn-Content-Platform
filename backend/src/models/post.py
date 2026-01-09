from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField, IntField
from datetime import datetime, timezone

class Post(Document):
    title = StringField(required=True, max_length=200)
    type = StringField(required=True, choices=['link', 'article', 'forum'])
    sources = ListField(StringField())
    summary = StringField() # Detailed synthesis from deep research
    theme = ReferenceField('Theme', required=True)
    status = StringField(default='planned', choices=['proposed', 'planned', 'researched', 'selected', 'inDraft', 'scheduled'])
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    # New fields for Progressive Curriculum
    day = IntField()
    learning_objective = StringField()
    difficulty = StringField()
    search_queries = ListField(StringField())

    meta = {
        'collection': 'posts',
        'indexes': [
            'theme',
            'status'
        ]
    }
