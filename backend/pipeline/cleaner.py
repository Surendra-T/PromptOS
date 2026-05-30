"""
Cleaner Agent — Removes redundancy, ambiguity, filler words, and improves clarity.
"""
import ollama
import json
import re
import asyncio


CLEANER_SYSTEM = """You are an expert prompt cleaner. Your job is to take a raw prompt and clean it by:
1. Removing filler words, redundancy, and repetition
2. Fixing ambiguous or vague statements
3. Making the language precise and direct
4. Preserving all core intent and requirements

Return ONLY valid JSON:
{
  "cleaned_text": "the cleaned version of the prompt",
  "removed_items": ["list of what was removed/fixed"],
  "clarity_delta": 0
}

Rules:
- cleaned_text: the improved prompt, preserving all key requirements
- removed_items: brief descriptions of what you changed
- clarity_delta: integer from 0-30 representing how much clarity improved
"""


def _call_ollama(model: str, messages: list, temperature: float = 0.2) -> str:
    response = ollama.chat(
        model=model,
        messages=messages,
        options={"temperature": temperature},
    )
    return response["message"]["content"].strip()


async def clean(prompt: str, analysis: dict, model: str = "llama3.1") -> dict:
    """Clean the prompt based on analyzer results."""
    context = f"""
Original prompt: {prompt}

Analysis context:
- Intent: {analysis.get('intent', '')}
- Warnings: {', '.join(analysis.get('warnings', []))}
- Clarity score: {analysis.get('clarity_score', 50)}/100
"""
    try:
        content = await asyncio.to_thread(
            _call_ollama,
            model,
            [
                {"role": "system", "content": CLEANER_SYSTEM},
                {"role": "user", "content": f"Clean this prompt:\n\n{context}"},
            ],
            0.2,
        )

        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())

        return {"cleaned_text": prompt, "removed_items": [], "clarity_delta": 0}

    except Exception as e:
        return {"cleaned_text": prompt, "removed_items": [], "clarity_delta": 0, "error": str(e)}
