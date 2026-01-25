#!/bin/bash
# scripts/setup_environment.sh
# Installs Git from Backports and PostgreSQL 18 from PGDG

set -e

echo "--- 1. Checking Permissions ---"
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (use sudo)"
  exit 1
fi

echo "--- 2. Configuring Repositories ---"

# Enable Backports if not present
if ! grep -r "bookworm-backports" /etc/apt/sources.list /etc/apt/sources.list.d/ > /dev/null; then
    echo "Adding bookworm-backports..."
    echo "deb http://deb.debian.org/debian bookworm-backports main" > /etc/apt/sources.list.d/backports.list
else
    echo "Backports seems configured."
fi

# Add PostgreSQL Apt Repository
if [ ! -f /etc/apt/sources.list.d/pgdg.list ]; then
    echo "Adding PostgreSQL PGDG repo..."
    apt-get update && apt-get install -y curl gpg gnupg2 lsb-release
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg
    echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list
else
    echo "PGDG repo seems configured."
fi

echo "--- 3. Updating Apt Cache ---"
apt-get update

echo "--- 4. Installing Git (Backports) ---"
apt-get install -y -t bookworm-backports git

echo "--- 5. Installing PostgreSQL 18 ---"
apt-get install -y postgresql-18 postgresql-contrib-18

echo "--- 6. Verification ---"
git --version
psql --version || echo "psql needs path update or service start"

echo "Done!"
