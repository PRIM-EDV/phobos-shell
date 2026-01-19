#!/bin/bash

# Platform-agnostic git setup script for devcontainer
# This script configures git to work with host system credentials

echo "Setting up git configuration for devcontainer..."

# Copy host git config if available
if [ -f /tmp/host-gitconfig ]; then
    echo "Copying host git configuration..."
    cp /tmp/host-gitconfig ~/.gitconfig
fi

# Ensure safe directory is set for monorepo and all subdirectories
# Use '*' to trust all directories to avoid ownership issues in containers
git config --global --add safe.directory '*'

# Set up credential storage based on platform
if [ -f ~/.git-credentials ]; then
    echo "Setting up git credential store..."
    git config --global credential.helper store
fi

# Set up SSH for git operations
if [ -d ~/.ssh ]; then
    echo "Setting up SSH for git operations..."
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/* 2>/dev/null || true
    
    # Start SSH agent if available and needed
    if [ -n "$SSH_AUTH_SOCK" ] || command -v ssh-agent >/dev/null; then
        if [ -z "$SSH_AUTH_SOCK" ]; then
            eval "$(ssh-agent -s)"
        fi
        ssh-add ~/.ssh/id_* 2>/dev/null || true
    fi
fi

# Configure git settings for development
git config --global core.autocrlf input
git config --global init.defaultBranch main
git config --global pull.rebase false

# Enable helpful git features
git config --global color.ui auto
git config --global push.default simple

echo "Git configuration completed successfully!"
echo "Current git user: $(git config --global user.name 2>/dev/null || echo 'Not set')"
echo "Current git email: $(git config --global user.email 2>/dev/null || echo 'Not set')"

# Test git connectivity
if command -v git >/dev/null && git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "✓ Git connectivity test passed"
else
    echo "ℹ Git connectivity test skipped or failed (this is normal if no remote is configured)"
fi