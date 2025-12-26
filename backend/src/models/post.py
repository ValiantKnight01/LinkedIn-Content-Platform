from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField
from datetime import datetime, timezone

class Post(Document):
    title = StringField(required=True, max_length=200)
    type = StringField(required=True, choices=['link', 'article', 'forum'])
    sources = ListField(StringField())
    theme = ReferenceField('Theme', required=True)
    status = StringField(default='proposed', choices=['proposed', 'selected', 'inDraft', 'scheduled'])
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'posts',
        'indexes': [
            'theme',
            'status'
        ]
    }
