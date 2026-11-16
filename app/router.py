from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.schemas import ItemCreate, ItemResponse, ProductResponse
from app.controllers.product_controller import single, index, search
from app.data import PRODUCTS


router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("", response_model=list[ProductResponse])
def list_products(
    sort: Literal["price_desc", "price_asc"] = Query(
        default="price_desc",
        description="Sort by price: price_desc (expensive first) or price_asc (cheapest first)"
    )
):
    return index(sort, PRODUCTS)


@router.get("{product_id}", response_model=ProductResponse)
def get_product(product_id: int) -> ProductResponse:
    return single(PRODUCTS , product_id)


@router.get("/search/{query}")
def search_products(query: str):
    return search(PRODUCTS, query)