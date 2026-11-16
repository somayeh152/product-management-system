.PHONY: help install venv run ui-install ui-dev ui-build ui-preview install-all clean

VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
UVICORN := $(VENV)/bin/uvicorn
UI_DIR := ui

help:
	@echo "Available targets:"
	@echo "  make install      Create venv and install Python deps"
	@echo "  make run          Start FastAPI with reload"
	@echo "  make ui-install   Install frontend deps"
	@echo "  make ui-dev       Start Vite dev server"
	@echo "  make ui-build     Build frontend into ui/dist"
	@echo "  make ui-preview   Preview the production UI build"
	@echo "  make install-all  Install backend and frontend deps"
	@echo "  make clean        Remove venv, caches, and UI build"

venv:
	python3 -m venv $(VENV)

install: venv
	$(PIP) install -r requirements.txt

run: $(UVICORN)
	$(UVICORN) app.main:app --reload

$(UVICORN):
	@$(MAKE) install

ui-install:
	cd $(UI_DIR) && npm install

ui-dev:
	cd $(UI_DIR) && npm run dev

ui-build:
	cd $(UI_DIR) && npm run build

ui-preview:
	cd $(UI_DIR) && npm run preview

install-all: install ui-install

clean:
	rm -rf $(VENV) __pycache__ app/__pycache__ .pytest_cache .mypy_cache
	rm -rf $(UI_DIR)/node_modules $(UI_DIR)/dist
	find . -type d -name __pycache__ -prune -exec rm -rf {} +
