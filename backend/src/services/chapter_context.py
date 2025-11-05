"""Chapter context retrieval service."""
import os
import re
from pathlib import Path
from typing import Optional


def _normalize_chapter_id(chapter_id: str) -> str:
    """
    Normalize chapter_id to match file/folder structure.

    Examples:
    - "01-ai-development-revolution" -> "01-ai-development-revolution"
    - "/docs/01-Introducing-AI-Driven-Development/01-ai-development-revolution/" -> "01-ai-development-revolution"
    """
    # Remove leading/trailing slashes
    chapter_id = chapter_id.strip('/')

    # Extract last part if it's a full path
    if '/' in chapter_id:
        chapter_id = chapter_id.split('/')[-1]

    return chapter_id


def _find_chapter_files(chapter_id: str, docs_root: Path) -> list[Path]:
    """
    Find all markdown files for a chapter.

    Args:
        chapter_id: Normalized chapter identifier
        docs_root: Root directory of docs folder

    Returns:
        List of markdown file paths
    """
    files = []

    # Case 1: Check if chapter_id.md exists at root level (e.g., preface-agent-native.md)
    direct_file = docs_root / f"{chapter_id}.md"
    if direct_file.exists() and direct_file.is_file():
        files.append(direct_file)
        return files

    # Case 2: Search recursively for folders matching chapter_id
    for root, dirs, filenames in os.walk(docs_root):
        # Check if current directory matches chapter_id
        if Path(root).name == chapter_id:
            # Find all .md files in this directory
            for filename in filenames:
                if filename.endswith('.md') and filename != 'README.md':
                    files.append(Path(root) / filename)

    # Case 3: If no exact match, try partial match
    if not files:
        chapter_lower = chapter_id.lower()
        for root, dirs, filenames in os.walk(docs_root):
            if chapter_lower in Path(root).name.lower():
                for filename in filenames:
                    if filename.endswith('.md') and filename != 'README.md':
                        files.append(Path(root) / filename)

    return sorted(files)


def _extract_content_from_markdown(file_path: Path) -> str:
    """
    Extract content from markdown file, removing frontmatter.

    Args:
        file_path: Path to markdown file

    Returns:
        Content as string
    """
    try:
        content = file_path.read_text(encoding='utf-8')

        # Remove frontmatter (between ---)
        frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
        content = re.sub(frontmatter_pattern, '', content, flags=re.DOTALL)

        # Remove code blocks but keep text
        content = re.sub(r'```[\s\S]*?```', '', content)

        # Clean up extra whitespace
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = content.strip()

        return content
    except Exception as e:
        return f"Error reading file {file_path}: {str(e)}"


async def get_chapter_context(chapter_id: str) -> Optional[str]:
    """
    Retrieve chapter content for context.

    Args:
        chapter_id: Chapter identifier (can be path or ID)

    Returns:
        Chapter content as string, or None if not found
    """
    if not chapter_id:
        return None

    # Normalize chapter_id
    chapter_id = _normalize_chapter_id(chapter_id)

    # Determine docs root directory
    # Backend is in backend/, docs are in ../book-source/docs/
    backend_dir = Path(__file__).parent.parent.parent
    docs_root = backend_dir.parent / 'book-source' / 'docs'

    # Fallback: try relative to current working directory
    if not docs_root.exists():
        docs_root = Path('book-source/docs')

    if not docs_root.exists():
        return f"Chapter {chapter_id}: Unable to locate docs directory"

    # Find chapter files
    chapter_files = _find_chapter_files(chapter_id, docs_root)

    if not chapter_files:
        return f"Chapter {chapter_id}: No markdown files found"

    # Extract content from all files
    contents = []
    for file_path in chapter_files:
        content = _extract_content_from_markdown(file_path)
        if content:
            # Add filename as header
            filename = file_path.stem.replace('_', ' ').title()
            contents.append(f"## {filename}\n\n{content}")

    if not contents:
        return f"Chapter {chapter_id}: No content extracted"

    # Combine all content
    full_content = "\n\n".join(contents)

    # Limit content length (Gemini context window consideration)
    max_length = 50000  # ~50k characters
    if len(full_content) > max_length:
        full_content = full_content[:max_length] + "\n\n[Content truncated...]"

    return full_content
