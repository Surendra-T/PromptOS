"""
Analyzer Agent — Parses intent and extracts core variables from the raw prompt.
"""
import ollama
import json
import re
import asyncio


ANALYZER_SYSTEM = """You are an expert prompt analyzer. Your job is to analyze a user's raw prompt and extract structured metadata.

Return ONLY valid JSON with this exact structure:
{
  "intent": "brief description of what the user wants",
  "entities": ["list", "of", "key", "entities"],
  "complexity": 0.0,
  "warnings": ["any issues with the prompt"],
  "target_domain": "domain/topic area",
  "clarity_score": 0
}

Rules:
- intent: 1 sentence describing the core goal
- entities: extract nouns/concepts that matter
- complexity: 0.0 to 1.0 (how complex the task is)
- warnings: list issues like ambiguity, missing context, vague requirements
- clarity_score: 0-100 integer rating of current prompt clarity
"""


def _call_ollama(model: str, messages: list, temperature: float = 0.1) -> str:
    """Synchronous ollama call — run via asyncio.to_thread to avoid blocking the event loop."""
    response = ollama.chat(
        model=model,
        messages=messages,
        options={"temperature": temperature},
    )
    return response["message"]["content"].strip()


async def analyze(prompt: str, model: str = "llama3.1") -> dict:
    """Analyze the prompt and return structured metadata."""
    try:
        content = await asyncio.to_thread(
            _call_ollama,
            model,
            [
                {"role": "system", "content": ANALYZER_SYSTEM},
                {"role": "user", "content": f"Analyze this prompt:\n\n{prompt}"},
            ],
            0.1,
        )

        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())

        return {
            "intent": "General task",
            "entities": [],
            "complexity": 0.5,
            "warnings": ["Could not fully parse prompt"],
            "target_domain": "general",
            "clarity_score": 50,
        }

    except Exception as e:
        return {
            "intent": "General task",
            "entities": [],
            "complexity": 0.5,
            "warnings": [str(e)],
            "target_domain": "general",
            "clarity_score": 50,
        }
