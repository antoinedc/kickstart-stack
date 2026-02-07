
### Production Deployment

- **Server**: {{SERVER_IP}} ({{DOMAIN}})
- **Deploy path**: `/opt/{{PROJECT_NAME}}`
- **SSL**: Automatic via Caddy (Let's Encrypt)

```bash
# SSH to server
ssh root@{{SERVER_IP}}

# Deploy updates
cd /opt/{{PROJECT_NAME}}
./scripts/deploy.sh update

# Other commands
./scripts/deploy.sh logs api
./scripts/deploy.sh backup
./scripts/deploy.sh status
./scripts/deploy.sh db-status
```

**First-time setup:**
```bash
./scripts/deploy.sh setup
cp .env.production.example .env.production
# Fill in .env.production values
./scripts/deploy.sh deploy
```

**Database management:**
```bash
./scripts/deploy.sh db-status    # Check migration status
./scripts/deploy.sh db-migrate   # Apply pending migrations
./scripts/deploy.sh backup       # Create backup
./scripts/deploy.sh restore <file>  # Restore from backup
```
