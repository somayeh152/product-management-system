# Sample FastAPI Project

Minimal FastAPI app with CRUD-style item endpoints.
A full-stack product management system built with Python and React. Developed as a hands-on project to explore backend development, REST APIs, database management, and frontend integration.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

Build the UI once so FastAPI can serve it:

```bash
make ui-build
```

Open:

- UI (products page): http://127.0.0.1:8000/products
- API JSON: http://127.0.0.1:8000/api/products
- Interactive docs: http://127.0.0.1:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | Products UI page |
| GET | `/api/products` | List products (JSON) |
| GET | `/api/products/{id}` | Get one product (JSON) |

## Example

```bash
curl http://127.0.0.1:8000/api/products
```
