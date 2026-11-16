from typing import Literal
from fastapi import Query
from app.schemas import ProductResponse
from app.helpers import search_products


def single(products , id):
    product = products.get(id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def index(sort, products) -> list[ProductResponse]:
    def by_price(product):
        return product.price

    reverse = sort == "price_desc"
    return sorted(products.values(), key=by_price, reverse=reverse)


def search(products, query):
    return search_products(products, query)
