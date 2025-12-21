from mongoengine import Document, StringField, IntField

class Theme(Document):
    title = StringField(required=True, max_length=200)
    description = StringField()
    month = IntField(required=True, min_value=1, max_value=12)
    year = IntField(required=True)
    category = StringField(max_length=100)
    
    meta = {
        'collection': 'themes',
        'indexes': [
            {'fields': ['year', 'month'], 'unique': True}
        ]
    }
