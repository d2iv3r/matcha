"""Helper utility functions."""

import re


def to_snake_case(text: str) -> str:
    """
    Convert text to snake_case.

    Args:
        text: Text to convert

    Returns:
        snake_case string
    """
    text = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', text)
    text = re.sub(r'([a-z\d])([A-Z])', r'\1_\2', text)
    text = text.replace('-', '_')
    return text.lower()


def to_camel_case(text: str) -> str:
    """
    Convert text to camelCase.

    Args:
        text: Text to convert

    Returns:
        camelCase string
    """
    components = text.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def to_pascal_case(text: str) -> str:
    """
    Convert text to PascalCase.

    Args:
        text: Text to convert

    Returns:
        PascalCase string
    """
    return ''.join(x.title() for x in text.split('_'))
