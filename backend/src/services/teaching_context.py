"""Teaching context service for pedagogically-enhanced AI responses.

This service integrates the 9 pedagogical skills from .claude/skills/ into AI chat responses,
ensuring the agent teaches using evidence-based learning science methodologies.

Pedagogical Skills Applied:
1. learning-objectives: Bloom's taxonomy aligned outcomes
2. concept-scaffolding: Cognitive Load Theory (CLT) - max 2-3 new concepts per step for beginners
3. code-example-generator: Runnable, PEP8-compliant examples with explanations
4. exercise-designer: 8 exercise types with retrieval practice, spaced repetition, interleaving
5. assessment-builder: Balanced assessments (60%+ non-recall)
6. technical-clarity: Readability analysis, jargon detection, gatekeeping language removal
7. ai-collaborate-teaching: AI pair programming patterns (Explainer, Debugger, Code Reviewer, etc.)
8. skills-proficiency-mapper: CEFR proficiency levels (A1-C2), Bloom's alignment
9. book-scaffolding: Chapter dependencies and prerequisite management

Research Foundation:
- Bloom's Taxonomy: 70+ years cognitive complexity research
- Cognitive Load Theory: Working memory limitations (7±2 chunks)
- CEFR: 40+ years language learning proficiency research (A1-C2)
- Evidence-based strategies: retrieval practice, spaced repetition, interleaving
- DigComp 2.1: Digital competence framework (2022)
"""

from pathlib import Path
from typing import Optional, Dict, Any, List
import re


class TeachingContext:
    """Manages pedagogical context for AI teaching responses."""

    # CEFR Proficiency Levels (40+ years of research)
    PROFICIENCY_LEVELS = {
        "A1": {
            "name": "Foundation",
            "bloom": ["Remember", "Understand"],
            "max_new_concepts": 2,
            "description": "Recognize and understand basic concepts",
            "student_capability": "Can follow examples, identify patterns, define terms"
        },
        "A2": {
            "name": "Basic",
            "bloom": ["Understand", "Apply"],
            "max_new_concepts": 3,
            "description": "Apply in simple, familiar contexts",
            "student_capability": "Can apply to textbook scenarios with scaffolding"
        },
        "B1": {
            "name": "Intermediate",
            "bloom": ["Apply", "Analyze"],
            "max_new_concepts": 4,
            "description": "Apply to real, unfamiliar problems independently",
            "student_capability": "Can solve real problems without templates"
        },
        "B2": {
            "name": "Advanced",
            "bloom": ["Analyze", "Evaluate"],
            "max_new_concepts": 5,
            "description": "Analyze and evaluate complex situations",
            "student_capability": "Can compare approaches, evaluate tradeoffs"
        },
        "C1": {
            "name": "Proficient",
            "bloom": ["Evaluate", "Create"],
            "max_new_concepts": 6,
            "description": "Expert independent use; can teach others",
            "student_capability": "Can design solutions, teach concepts to peers"
        }
    }

    # AI Pair Programming Patterns (from ai-collaborate-teaching skill)
    AI_PATTERNS = {
        "explainer": "Student inquires, AI clarifies concepts",
        "debugger": "Student reports bugs, AI helps diagnose",
        "code_reviewer": "Student writes code, AI provides feedback",
        "pair_programmer": "Student and AI co-create code incrementally",
        "hypothesis_validator": "Student forms hypotheses, AI confirms/refutes"
    }

    # Exercise Types (from exercise-designer skill)
    EXERCISE_TYPES = [
        "fill-in-blank", "debug-this", "build-from-scratch", "extend-code",
        "trace-execution", "explain-code", "refactor", "parsons-problem"
    ]

    def __init__(self):
        """Initialize teaching context."""
        self.skills_path = Path(__file__).parent.parent.parent.parent / ".claude" / "skills"

    def detect_user_intent(self, message: str) -> Dict[str, Any]:
        """
        Detect pedagogical intent from user message.

        Args:
            message: User's question or request

        Returns:
            Intent metadata including detected skills, proficiency level, AI pattern
        """
        intent = {
            "activated_skills": [],
            "ai_pattern": None,
            "proficiency_level": "B1",  # Default intermediate
            "requires_code_example": False,
            "requires_exercise": False,
            "requires_scaffolding": False,
            "cognitive_load_concerns": False
        }

        message_lower = message.lower()

        # Detect AI Pair Programming Patterns
        if any(word in message_lower for word in ["what is", "explain", "how does", "why"]):
            intent["ai_pattern"] = "explainer"
            intent["activated_skills"].append("technical-clarity")

        if any(word in message_lower for word in ["error", "bug", "broken", "not working", "debug"]):
            intent["ai_pattern"] = "debugger"
            intent["activated_skills"].append("code-example-generator")

        if any(word in message_lower for word in ["review", "feedback", "improve", "better"]):
            intent["ai_pattern"] = "code_reviewer"
            intent["activated_skills"].append("assessment-builder")

        if any(word in message_lower for word in ["help me write", "let's build", "create"]):
            intent["ai_pattern"] = "pair_programmer"
            intent["activated_skills"].append("code-example-generator")

        # Detect skill activation needs
        if any(word in message_lower for word in ["example", "show me", "demonstrate"]):
            intent["requires_code_example"] = True
            intent["activated_skills"].append("code-example-generator")

        if any(word in message_lower for word in ["practice", "exercise", "try", "challenge"]):
            intent["requires_exercise"] = True
            intent["activated_skills"].append("exercise-designer")

        if any(word in message_lower for word in ["step by step", "break down", "gradually", "incrementally"]):
            intent["requires_scaffolding"] = True
            intent["activated_skills"].append("concept-scaffolding")

        # Detect proficiency level (if explicitly mentioned)
        if any(word in message_lower for word in ["beginner", "new to", "first time", "basic"]):
            intent["proficiency_level"] = "A1"
            intent["cognitive_load_concerns"] = True
        elif any(word in message_lower for word in ["intermediate", "learning", "practicing"]):
            intent["proficiency_level"] = "B1"
        elif any(word in message_lower for word in ["advanced", "complex", "deep dive"]):
            intent["proficiency_level"] = "B2"

        # Remove duplicates
        intent["activated_skills"] = list(set(intent["activated_skills"]))

        return intent

    def build_system_prompt(
        self,
        chapter_context: Optional[str],
        user_intent: Dict[str, Any]
    ) -> str:
        """
        Build pedagogically-enhanced system prompt.

        Args:
            chapter_context: Chapter markdown content
            user_intent: Detected pedagogical intent

        Returns:
            System prompt with teaching guidelines
        """
        proficiency = self.PROFICIENCY_LEVELS[user_intent["proficiency_level"]]

        prompt_parts = [
            "# AI Learning Assistant - Pedagogical Guidelines\n",
            "You are an expert AI teaching assistant for Python programming, trained in evidence-based learning science.\n",
        ]

        # Add proficiency level context
        prompt_parts.append(f"\n## Student Proficiency Level: {user_intent['proficiency_level']} ({proficiency['name']})\n")
        prompt_parts.append(f"**Student Capability**: {proficiency['student_capability']}\n")
        prompt_parts.append(f"**Bloom's Levels**: {', '.join(proficiency['bloom'])}\n")
        prompt_parts.append(f"**Cognitive Load Limit**: Max {proficiency['max_new_concepts']} new concepts per response\n")

        # Add AI pattern guidance
        if user_intent["ai_pattern"]:
            pattern_name = user_intent["ai_pattern"].replace("_", " ").title()
            pattern_desc = self.AI_PATTERNS[user_intent["ai_pattern"]]
            prompt_parts.append(f"\n## AI Pattern: {pattern_name}\n")
            prompt_parts.append(f"**Your Role**: {pattern_desc}\n")

        # Add skill-specific guidance
        if "concept-scaffolding" in user_intent["activated_skills"]:
            prompt_parts.append("\n## Cognitive Load Theory (CLT) Guidance\n")
            prompt_parts.append(f"- Break explanations into {proficiency['max_new_concepts']} or fewer new concepts\n")
            prompt_parts.append("- Use worked examples with step-by-step explanations\n")
            prompt_parts.append("- Provide checkpoints to verify understanding\n")
            prompt_parts.append("- Start simple, build incrementally\n")

        if "code-example-generator" in user_intent["activated_skills"]:
            prompt_parts.append("\n## Code Example Guidelines\n")
            prompt_parts.append("- Provide runnable, self-contained examples\n")
            prompt_parts.append("- Follow PEP 8 style guidelines\n")
            prompt_parts.append("- Explain WHAT the code does, HOW it works, and WHY it matters\n")
            prompt_parts.append("- Show expected output\n")
            prompt_parts.append("- Include common mistakes to avoid\n")

        if "exercise-designer" in user_intent["activated_skills"]:
            prompt_parts.append("\n## Exercise Design Principles\n")
            prompt_parts.append("- Use varied exercise types (not just 'write code from scratch')\n")
            prompt_parts.append("- Apply retrieval practice (ask them to recall)\n")
            prompt_parts.append("- Include progressive hints if stuck\n")
            prompt_parts.append("- Provide clear success criteria\n")

        if "technical-clarity" in user_intent["activated_skills"]:
            prompt_parts.append("\n## Technical Clarity Guidelines\n")
            prompt_parts.append("- Define all jargon before using\n")
            prompt_parts.append("- Use analogies and real-world examples\n")
            prompt_parts.append("- Avoid gatekeeping language ('obviously', 'simply', 'just')\n")
            prompt_parts.append("- Check readability matches proficiency level\n")

        # Add chapter context if available
        if chapter_context:
            prompt_parts.append("\n## Chapter Context\n")
            prompt_parts.append("Use the following chapter content to answer questions accurately:\n\n")
            prompt_parts.append(f"```\n{chapter_context}\n```\n")

        # Add validation reminder
        prompt_parts.append("\n## Validation Principle\n")
        prompt_parts.append("**Trust but Verify**: Always encourage students to:\n")
        prompt_parts.append("1. Read and understand all code (even AI-generated)\n")
        prompt_parts.append("2. Test thoroughly before trusting\n")
        prompt_parts.append("3. Ask questions about anything unclear\n")

        return "".join(prompt_parts)

    def get_proficiency_info(self, level: str) -> Dict[str, Any]:
        """Get proficiency level information."""
        return self.PROFICIENCY_LEVELS.get(level, self.PROFICIENCY_LEVELS["B1"])

    def suggest_next_steps(self, intent: Dict[str, Any]) -> List[str]:
        """
        Suggest pedagogically appropriate next steps.

        Args:
            intent: User intent metadata

        Returns:
            List of suggested next actions
        """
        suggestions = []

        if intent["requires_code_example"]:
            suggestions.append("Try running the code example yourself")
            suggestions.append("Modify the example to explore variations")

        if intent["requires_exercise"]:
            suggestions.append("Complete the practice exercise")
            suggestions.append("Check your solution against the criteria")

        if intent["requires_scaffolding"]:
            suggestions.append("Verify you understand each step before proceeding")
            suggestions.append("Ask questions if any step is unclear")

        # Always include verification
        suggestions.append("Test your understanding by explaining it in your own words")

        return suggestions


# Singleton instance
_teaching_context: Optional[TeachingContext] = None


def get_teaching_context() -> TeachingContext:
    """Get or create teaching context instance."""
    global _teaching_context
    if _teaching_context is None:
        _teaching_context = TeachingContext()
    return _teaching_context
