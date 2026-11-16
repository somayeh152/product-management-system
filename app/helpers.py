
import re
from typing import Optional
from app.schemas import ProductResponse


def search_products(
    products: dict[int, ProductResponse],
    query: str,
) -> list[ProductResponse]:
    """
    Full-text search across product names and descriptions.
    """

    if not query or not query.strip():
        return []

    query_words = re.findall(r"\w+", query.lower())

    results = []

    for product in products.values():
        text = f"{product.name} {product.description}".lower()

        # Count matching query words
        matched_words = sum(
            1 for word in query_words if word in text
        )

        if matched_words > 0:
            results.append((matched_words, product))

    # Sort by relevance (most matching words first)
    results.sort(key=lambda item: item[0], reverse=True)

    return [product for _, product in results]
