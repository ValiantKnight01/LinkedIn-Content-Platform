RESEARCH_SYNTHESIS_PROMPT = """
Topic: {title}
Day: {day}
Learning Objective: {learning_objective}
Difficulty: {difficulty}

Researched Content:
{context}

Create a LinkedIn post following this EXACT structure. Missing ANY section = FAIL.

MANDATORY SECTIONS (in order):
1. Hook (max 3 sentences, must include 2+ numbers)
2. Problem (why old methods failed)
3. Solution (what attention mechanism does differently)
4. How It Works (explain mechanism with analogy)
5. Before vs After (STRUCTURED JSON: Populate the `comparison` field)
6. Trade-offs (STRUCTURED JSON: Populate the `tradeoffs` field)
7. Key Takeaways (5-7 bullets, actionable + surprising)
8. Call to Action (personal question, not abstract)

CRITICAL: Each of the body sections MUST have a specific, detailed Company Example populated in its `example_use_case` field.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL JSON STRUCTURE RULES:

1. For the "Before vs After" section:
   - DO NOT put text in the `content` field.
   - INSTEAD, populate the `comparison` object with `items` (dimension, before, after) and a `summary`.
   - Example dimensions: Performance, Context, Efficiency, Capabilities.

2. For the "Trade-offs" section:
   - DO NOT put text in the `content` field.
   - INSTEAD, populate the `tradeoffs` object with `pros`, `cons`, `constraints`, and `real_world_context`.

3. For all other sections (Problem, Solution, How It Works):
   - Populate the `content` field with descriptive text.
   - Populate the `example_use_case` field.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL HOOK RULES (STRICTLY ENFORCE):

✓ DO:
- Start with concrete scenario: "You do X. Models do Y. How?"
- Include 2+ specific numbers
- Max 3 sentences (preferably 2)
- Conversational tone

✗ DON'T:
- NO semicolons (;) in hook - EVER
- NO academic writing style
- NO marketing fluff ("revolutionary", "game-changing")
- NO sentences over 25 words
- NO vague statements without numbers

TEST YOUR HOOK:
- Contains semicolon? → REJECT, rewrite
- Over 3 sentences? → REJECT, shorten
- No numbers? → REJECT, add metrics
- Sounds like academic paper? → REJECT, make conversational

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXAMPLE RULES (DISTRIBUTED):

You must find 3-4 high-quality company examples.
Instead of listing them in one block, ASSIGN each one to the most relevant section using the `example_use_case` field.

CRITICAL: EVERY section (Problem, Solution, etc.) MUST have a populated `example_use_case`.

For EACH example used:

1. Company/Product Name (specific)
2. Specific Feature (not "their system" - name it)
3. Technical Details (2-3 sentences on HOW)
4. Business Outcome (Explain the impact in plain language - NO specific percentages or dollar amounts unless you are 100% sure they are in the source text)
5. Time Period (when this happened)

FORMAT TEMPLATE:
"[Company]'s [Product Name] ([Year]):
- Technical approach: [How they use attention - 2 details]
- Business outcome: [Explain the qualitative impact, e.g., 'drastically reduced latency', 'improved accuracy on long-range text']
- Key insight: [Interesting detail]"

CRITICAL SOURCE RULE (ANTI-HALLUCINATION):
- DO NOT generate plausible-sounding business metrics (like '$2.3M saved' or '40% reduction').
- Use ONLY qualitative descriptions (e.g., "significant reduction", "faster processing", "more accurate context") for impact and results.
- ACCURACY IS MORE IMPORTANT THAN FORMATTING. Hallucinating numbers = IMMEDIATE FAIL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECHNICAL TERMS (Days 1-10 ONLY):

If you mention ANY of these terms, define them IMMEDIATELY:
- ARIMA → "AutoRegressive Integrated Moving Average - a 1970s statistical method that assumes smooth patterns"
- Transformer → "Deep learning architecture from 2017 that uses attention to focus on relevant data"
- RNN → "Recurrent Neural Network - processes sequences step-by-step"
- MAE/RMSE/F1 → Convert to simple language: "Accuracy improved from 65% to 95%"

FORMAT: [Term] → [One sentence definition] → [When/why it's used]

NO jargon dumps. If you use a technical term, explain it in the SAME sentence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WRITING STYLE (MANDATORY):

Sentence rules:
- Average length: 12-15 words
- Maximum length: 25 words
- NO semicolons anywhere (use periods)
- NO run-on sentences

Paragraph rules:
- Maximum: 2 sentences per paragraph (STRICT LIMIT)
- Total section content: Maximum 4 sentences (STRICT LIMIT)
- Prefer: 1-2 sentences
- Add blank line between paragraphs

Example Rule:
- `example_use_case` field MUST be exactly 1 sentence.

Tone:
- Conversational (write like you're explaining to a friend)
- Active voice ("Google built" not "was built by Google")
- Direct ("This works" not "This can potentially work")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TAKEAWAYS FORMAT:

Each takeaway must be ONE of these types:
→ Impactful change: "[Technology] improved [process] by enabling [capability]"
→ Business context: "[Company] solved [problem] using [technology]"
→ Actionable tool: "Start with [specific tool/library name]"

STRICT LIMIT: Exactly 3 takeaways. No more, no less.
Each must include specific product names OR actionable advice.

NO generic statements like "Attention mechanisms are powerful" ← REJECT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CALL TO ACTION:

✗ DON'T ask abstract questions: "What are potential applications in your industry?"

✓ DO ask personal questions:
- "What's the weirdest recommendation you've gotten?"
- "Have you noticed [product] getting better? What changed?"
- "What's the hardest forecasting problem in your work?"

Make it about THEIR experience, not hypothetical scenarios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINAL VALIDATION CHECKLIST:

Before submitting, verify:
□ Hook is punchy and has no semicolons
□ All body sections present
□ 3+ company examples with specific products
□ Each example has: qualitative impact + timeframe
□ Before/After comparison included (qualitative)
□ Trade-offs section has benefits + challenges + when not to use
□ All technical terms defined (for Days 1-10)
□ No sentences over 25 words
□ No marketing fluff in hook
□ CTA is personal, not abstract
□ 5+ actionable takeaways

If ANY checkbox is unchecked → FIX before submitting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JSON STRUCTURE MAPPING (CRITICAL):
- "Hook" content goes to -> `hook` field
- "Key Takeaways" content goes to -> `key_takeaways` field
- "Call to Action" content goes to -> `call_to_action` field
- ALL OTHER BODY CONTENT (Problem, Solution, How it works, Examples, Trade-offs) goes to -> `sections` list
- Do NOT put Takeaways or CTA in the `sections` list.

Now generate the post following ALL rules above."""
