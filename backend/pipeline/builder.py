"""
Builder Agent — Constructs the final structured prompt with Role/Task/Requirements/Format sections.
"""
import ollama
import json
import re
import asyncio


BUILDER_SYSTEM_GPT = """You are an expert prompt architect specializing in GPT models.
Your job is to restructure a cleaned prompt into an optimized format with clear sections.

Return ONLY valid JSON:
{
  "structured_prompt": "the full restructured prompt",
  "sections": [
    {"label": "Role", "content": "..."},
    {"label": "Task", "content": "..."},
    {"label": "Requirements", "content": "..."},
    {"label": "Format", "content": "..."}
  ],
  "context": "brief description of what you built"
}

Guidelines:
- Role: Define who the AI should be (expert, specialist, etc.)
- Task: Clear, direct statement of what needs to be done
- Requirements: Specific constraints, bullet points for multiple items
- Format: How the output should be structured
- Make each section concrete and actionable
"""

BUILDER_SYSTEM_CLAUDE = """You are an expert prompt architect specializing in Claude models.
Structure the prompt with clear XML-like sections that Claude responds best to.

Return ONLY valid JSON:
{
  "structured_prompt": "the full restructured prompt",
  "sections": [
    {"label": "Role", "content": "..."},
    {"label": "Task", "content": "..."},
    {"label": "Requirements", "content": "..."},
    {"label": "Format", "content": "..."}
  ],
  "context": "brief description of what you built"
}
"""

BUILDER_SYSTEM_SYSTEM = """You are an expert system prompt architect.
Create a comprehensive system prompt with proper instruction hierarchy.

Return ONLY valid JSON:
{
  "structured_prompt": "the full system prompt",
  "sections": [
    {"label": "Role", "content": "..."},
    {"label": "Task", "content": "..."},
    {"label": "Requirements", "content": "..."},
    {"label": "Format", "content": "..."}
  ],
  "context": "brief description of what you built"
}
"""


def get_builder_system(fmt: str) -> str:
    return {
        "gpt":    BUILDER_SYSTEM_GPT,
        "claude": BUILDER_SYSTEM_CLAUDE,
        "system": BUILDER_SYSTEM_SYSTEM,
    }.get(fmt, BUILDER_SYSTEM_GPT)


def _call_ollama(model: str, messages: list, temperature: float = 0.3) -> str:
    response = ollama.chat(
        model=model,
        messages=messages,
        options={"temperature": temperature},
    )
    return response["message"]["content"].strip()


async def build(cleaned_text: str, analysis: dict, fmt: str = "gpt", model: str = "llama3.1") -> dict:
    """Build a structured prompt from the cleaned text."""
    context = f"""
Cleaned prompt: {cleaned_text}

Context:
- Intent: {analysis.get('intent', '')}
- Domain: {analysis.get('target_domain', 'general')}
- Key entities: {', '.join(analysis.get('entities', []))}
- Target format: {fmt}
"""
    try:
        content = await asyncio.to_thread(
            _call_ollama,
            model,
            [
                {"role": "system", "content": get_builder_system(fmt)},
                {"role": "user", "content": f"Build a structured prompt:\n\n{context}"},
            ],
            0.3,
        )

        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())

        return {"structured_prompt": cleaned_text, "sections": [], "context": "Structure preserved as-is"}

    except Exception as e:
        return {"structured_prompt": cleaned_text, "sections": [], "context": str(e)}
