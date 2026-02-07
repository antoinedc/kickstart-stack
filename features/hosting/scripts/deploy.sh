#!/bin/bash
set -e

# {{PROJECT_NAME}} Production Deployment Script
# Usage: ./scripts/deploy.sh [command]

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Copy .env.production.example to .env.production and fill in values"
        exit 1
    fi
}

setup() {
    log_info "Setting up server..."

    sudo apt update && sudo apt upgrade -y

    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER
        log_warn "Please log out and back in for Docker group membership to take effect"
    fi

    if ! docker compose version &> /dev/null; then
        log_info "Installing Docker Compose plugin..."
        sudo apt install -y docker-compose-plugin
    fi

    mkdir -p backups

    log_info "Configuring firewall..."
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable

    log_info "Setup complete!"
    log_info "Next steps:"
    log_info "  1. Copy .env.production.example to .env.production"
    log_info "  2. Fill in all required values"
    log_info "  3. Run: ./scripts/deploy.sh deploy"
}

deploy() {
    check_env_file
    log_info "Deploying..."

    set -a
    source "$ENV_FILE"
    set +a

    docker compose -f "$COMPOSE_FILE" build
    docker compose -f "$COMPOSE_FILE" up -d

    log_info "Deployment complete!"
    sleep 5
    status
}

update() {
    check_env_file
    log_info "Updating..."

    git pull origin master

    set -a
    source "$ENV_FILE"
    set +a

    log_info "Checking migration status..."
    MIGRATION_OUTPUT=$(docker compose -f "$COMPOSE_FILE" exec -T api npx prisma migrate status 2>&1 || true)

    if echo "$MIGRATION_OUTPUT" | grep -q "Following migration"; then
        log_warn "Pending migrations detected"
        log_info "Migrations will be applied automatically during deploy"
    elif echo "$MIGRATION_OUTPUT" | grep -q "Database schema is up to date"; then
        log_info "Database schema is up to date"
    else
        log_warn "Could not determine migration status (normal for first deploy)"
    fi

    docker compose -f "$COMPOSE_FILE" build
    docker compose -f "$COMPOSE_FILE" up -d
    docker image prune -f

    log_info "Update complete!"
    status
}

logs() {
    local service=${1:-}
    if [ -n "$service" ]; then
        docker compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        docker compose -f "$COMPOSE_FILE" logs -f
    fi
}

status() {
    log_info "Service Status:"
    docker compose -f "$COMPOSE_FILE" ps
    echo ""
    log_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

backup() {
    check_env_file
    source "$ENV_FILE"

    BACKUP_DIR="backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

    mkdir -p "$BACKUP_DIR"

    log_info "Creating database backup..."
    docker compose -f "$COMPOSE_FILE" exec -T postgres \
        pg_dump -U "${POSTGRES_USER:-postgres}" "${POSTGRES_DB:-{{PROJECT_NAME}}}" | gzip > "$BACKUP_FILE"

    log_info "Backup saved to: $BACKUP_FILE"

    ls -t ${BACKUP_DIR}/*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm
    log_info "Old backups cleaned up (keeping last 7)"
}

restore() {
    check_env_file
    source "$ENV_FILE"

    if [ -z "$1" ]; then
        log_error "Please specify backup file: ./scripts/deploy.sh restore backups/filename.sql.gz"
        log_info "Available backups:"
        ls -la backups/*.sql.gz 2>/dev/null || echo "  No backups found"
        exit 1
    fi

    BACKUP_FILE="$1"

    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi

    log_warn "This will overwrite the current database!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi

    log_info "Restoring database from $BACKUP_FILE..."
    gunzip -c "$BACKUP_FILE" | docker compose -f "$COMPOSE_FILE" exec -T postgres \
        psql -U "${POSTGRES_USER:-postgres}" "${POSTGRES_DB:-{{PROJECT_NAME}}}"

    log_info "Database restored!"
}

stop() {
    log_info "Stopping all services..."
    docker compose -f "$COMPOSE_FILE" down
    log_info "All services stopped"
}

restart() {
    local service=${1:-}
    if [ -n "$service" ]; then
        log_info "Restarting $service..."
        docker compose -f "$COMPOSE_FILE" restart "$service"
    else
        log_info "Restarting all services..."
        docker compose -f "$COMPOSE_FILE" restart
    fi
    log_info "Restart complete"
}

db_status() {
    check_env_file
    set -a; source "$ENV_FILE"; set +a
    docker compose -f "$COMPOSE_FILE" exec -T api npx prisma migrate status
}

db_migrate() {
    check_env_file
    log_info "Running Prisma migrations..."
    set -a; source "$ENV_FILE"; set +a
    docker compose -f "$COMPOSE_FILE" exec -T api npx prisma migrate deploy
    log_info "Migrations complete!"
}

db_diff() {
    check_env_file
    set -a; source "$ENV_FILE"; set +a
    docker compose -f "$COMPOSE_FILE" exec -T api npx prisma migrate diff \
        --from-schema-datasource prisma/schema.prisma \
        --to-schema-datamodel prisma/schema.prisma \
        --shadow-database-url "$DATABASE_URL" 2>/dev/null || true
    log_info "To see pending migrations, use: $0 db-status"
}

case "${1:-}" in
    setup)     setup ;;
    deploy)    deploy ;;
    update)    update ;;
    logs)      logs "$2" ;;
    status)    status ;;
    backup)    backup ;;
    restore)   restore "$2" ;;
    stop)      stop ;;
    restart)   restart "$2" ;;
    db-status) db_status ;;
    db-migrate) db_migrate ;;
    db-diff)   db_diff ;;
    *)
        echo "Deployment Script"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  setup              Initial server setup"
        echo "  deploy             Build and deploy all services"
        echo "  update             Pull latest code and redeploy"
        echo "  logs [service]     View logs"
        echo "  status             Service status and resource usage"
        echo "  backup             Create database backup"
        echo "  restore <file>     Restore from backup"
        echo "  stop               Stop all services"
        echo "  restart [service]  Restart services"
        echo "  db-status          Check migration status"
        echo "  db-migrate         Run pending migrations"
        echo "  db-diff            Show schema differences"
        ;;
esac
