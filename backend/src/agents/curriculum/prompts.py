CURRICULUM_PLANNING_PROMPT = """You are an expert content strategist and educator.
Theme: {theme_title}
Target Month: {month}/{year} ({num_days} days)

Create a progressive 30-day (or {num_days}-day) curriculum. 
The curriculum should start with foundational concepts and gradually move to advanced topics.

For EACH day, provide:
1. A compelling title.
2. A clear learning objective.
3. Difficulty level (Beginner for first 10 days, Intermediate for next 10, Advanced for last 10).
4. Content type (link, article, or forum).
5. 3-5 specific, high-intent search queries that will be used to scrape deep information for that day's post.

Ensure the topics are distinct and follow a logical learning path."""
