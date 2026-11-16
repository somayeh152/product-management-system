from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.schemas import ItemCreate, ItemResponse, ProductResponse
from app.controllers.product_controller import single, index
from app.data import PRODUCTS

from app.router import router


app = FastAPI(
    title="Sample FastAPI Project",
    description="A minimal FastAPI app for learning",
    version="0.1.0",
)

app.include_router(router)


UI_DIR = Path(__file__).resolve().parent.parent / "ui" / "dist"
ASSETS_DIR = UI_DIR / "assets"

if ASSETS_DIR.is_dir():
    router.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")


@app.get("/")
def serve_spa_root() -> FileResponse:
    return FileResponse(UI_DIR / "index.html")


@app.get("/{full_path:path}")
def serve_spa(full_path: str) -> FileResponse:
    """Serve built static files, or fall back to index.html for client routes."""
    candidate = UI_DIR / full_path
    if candidate.is_file():
        return FileResponse(candidate)
    return FileResponse(UI_DIR / "index.html")