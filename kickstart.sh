#!/bin/bash
# Kickstart project initialization script

set -e

setup_project() {
    local project_name=$1

    # Create project directory
    mkdir -p "$project_name"
    cd "$project_name"

    # Initialize git
    git init

    # Create standard configuration files
    create_config_files

    # Install dependencies
    install_dependencies

    # Setup development tools
    setup_dev_tools

    # Initial commit
    git add .
    git commit -m "Initial project setup from kickstart-stack"
}

create_config_files() {
    # Create .env.example
    cat > .env.example << EOL
# Project Environment Configuration
PROJECT_NAME=
DATABASE_URL=
API_KEY=
DEBUG=false
EOL

    # Create .tool-versions for asdf
    cat > .tool-versions << EOL
nodejs 20.11.0
python 3.11.7
poetry 1.7.1
EOL

    # Create Makefile
    cat > Makefile << EOL
.PHONY: setup dev test lint clean

setup:
	@echo "Setting up project environment..."
	@[ -f .env ] || cp .env.example .env
	@asdf install
	@npm ci
	@poetry install

dev:
	@echo "Starting development server..."
	@npm run dev

test:
	@echo "Running tests..."
	@npm test

lint:
	@echo "Running linters..."
	@npm run lint

clean:
	@echo "Cleaning project..."
	@rm -rf node_modules
	@rm -rf .venv
EOL

    # Create .editorconfig
    cat > .editorconfig << EOL
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{js,json,yml,yaml}]
indent_size = 2
EOL

    # Create pre-commit configuration
    cat > .pre-commit-config.yaml << EOL
repos:
-   repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
    -   id: trailing-whitespace
    -   id: end-of-file-fixer
    -   id: check-yaml
    -   id: check-added-large-files

-   repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
    -   id: black

-   repo: https://github.com/eslint/eslint
    rev: v8.56.0
    hooks:
    -   id: eslint
EOL
}

install_dependencies() {
    # Node.js dependencies
    npm init -y
    npm install -D \
        prettier \
        eslint \
        husky \
        lint-staged \
        @types/node

    # Python dependencies
    poetry init -n
    poetry add \
        pytest \
        black \
        mypy

    # Install pre-commit
    pip install pre-commit
    pre-commit install
}

setup_dev_tools() {
    # Setup Husky for git hooks
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"

    # Create lint-staged configuration
    cat > .lintstagedrc.json << EOL
{
    "*.{js,ts,jsx,tsx}": [
        "eslint --fix",
        "prettier --write"
    ],
    "*.{py}": [
        "black",
        "mypy"
    ]
}
EOL
}

# Run the setup function with the project name
setup_project "$1"