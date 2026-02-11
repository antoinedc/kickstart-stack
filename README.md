# Kickstart Stack

## Prerequisites

- asdf
- Node.js (20.x)
- Python (3.11.x)
- Poetry
- pre-commit

## Quick Start

1. Install Prerequisites
```bash
# Install asdf (if not already installed)
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0

# Add asdf to your shell
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash' >> ~/.bashrc

# Install required plugins
asdf plugin add nodejs
asdf plugin add python
asdf plugin add poetry

# Install specific versions
asdf install nodejs 20.11.0
asdf install python 3.11.7
asdf install poetry 1.7.1
```

2. Create a New Project
```bash
# Clone the kickstart stack
git clone https://github.com/antoinedc/kickstart-stack.git

# Use the kickstart script
cd kickstart-stack
chmod +x kickstart.sh
./kickstart.sh my-new-project
```

## Features

- Standardized project structure
- Consistent tooling
- Pre-configured linters and formatters
- Git hooks with pre-commit
- Environment variable management
- Cross-platform development setup

## Development Workflow

- `make setup`: Initialize project environment
- `make dev`: Start development server
- `make test`: Run test suite
- `make lint`: Run code linters

## Customization

Modify `.env.example`, `.tool-versions`, and configuration files to fit your project needs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request