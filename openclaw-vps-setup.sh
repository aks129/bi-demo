#!/bin/bash
# ============================================================
# OpenClaw VPS Setup Script
# - Always-on (systemd daemon)
# - Telegram bot pairing
# ============================================================
set -euo pipefail

echo "=== OpenClaw VPS Setup ==="

# ----------------------------------------------------------
# 1. Detect OpenClaw installation
# ----------------------------------------------------------
OPENCLAW_BIN=""
if command -v openclaw &>/dev/null; then
    OPENCLAW_BIN=$(which openclaw)
elif command -v clawdbot &>/dev/null; then
    OPENCLAW_BIN=$(which clawdbot)
else
    echo "[!] OpenClaw not found. Installing..."
    curl -fsSL https://openclaw.ai/install.sh | bash
    # Re-source profile to pick up new PATH
    source ~/.bashrc 2>/dev/null || source ~/.profile 2>/dev/null || true
    if command -v openclaw &>/dev/null; then
        OPENCLAW_BIN=$(which openclaw)
    elif command -v clawdbot &>/dev/null; then
        OPENCLAW_BIN=$(which clawdbot)
    else
        echo "[ERROR] Installation failed. Please install manually."
        exit 1
    fi
fi

echo "[OK] OpenClaw binary: $OPENCLAW_BIN"

# ----------------------------------------------------------
# 2. Determine config directory
# ----------------------------------------------------------
CONFIG_DIR=""
if [ -d "$HOME/.openclaw" ]; then
    CONFIG_DIR="$HOME/.openclaw"
elif [ -d "$HOME/.clawdbot" ]; then
    CONFIG_DIR="$HOME/.clawdbot"
elif [ -d "$HOME/.moltbot" ]; then
    CONFIG_DIR="$HOME/.moltbot"
else
    CONFIG_DIR="$HOME/.openclaw"
    mkdir -p "$CONFIG_DIR/config"
    echo "[INFO] Created config directory: $CONFIG_DIR"
fi

echo "[OK] Config directory: $CONFIG_DIR"

# ----------------------------------------------------------
# 3. Telegram Bot Configuration
# ----------------------------------------------------------
CHANNELS_FILE="$CONFIG_DIR/config/channels.json"

if [ -f "$CHANNELS_FILE" ]; then
    echo "[INFO] Existing channels.json found:"
    cat "$CHANNELS_FILE"
    echo ""
    read -p "Overwrite with new Telegram config? (y/N): " OVERWRITE
    if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
        echo "[SKIP] Keeping existing channels.json"
    else
        WRITE_CHANNELS=true
    fi
else
    WRITE_CHANNELS=true
fi

if [ "${WRITE_CHANNELS:-false}" = true ]; then
    read -p "Enter your Telegram Bot Token (from @BotFather): " BOT_TOKEN
    if [ -z "$BOT_TOKEN" ]; then
        echo "[ERROR] Bot token cannot be empty"
        exit 1
    fi

    mkdir -p "$(dirname "$CHANNELS_FILE")"
    cat > "$CHANNELS_FILE" <<CHANNELS_EOF
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "$BOT_TOKEN",
      "dmPolicy": "pairing"
    }
  }
}
CHANNELS_EOF
    echo "[OK] Telegram channel configured in $CHANNELS_FILE"
    echo "[INFO] dmPolicy is set to 'pairing' - you'll need to approve your account"
fi

# ----------------------------------------------------------
# 4. Set up systemd service for always-on
# ----------------------------------------------------------
echo ""
echo "=== Setting up always-on systemd service ==="

# Determine the user running openclaw
RUN_USER=$(whoami)
GATEWAY_PORT=18789

cat > /etc/systemd/system/openclaw-gateway.service <<SERVICE_EOF
[Unit]
Description=OpenClaw Gateway (Always-On)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$RUN_USER
ExecStart=$OPENCLAW_BIN gateway --port $GATEWAY_PORT
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
WorkingDirectory=$HOME

[Install]
WantedBy=multi-user.target
SERVICE_EOF

echo "[OK] Created /etc/systemd/system/openclaw-gateway.service"

# Reload systemd and enable
systemctl daemon-reload
systemctl enable openclaw-gateway.service
echo "[OK] Service enabled (will start on boot)"

# Start or restart the service
systemctl restart openclaw-gateway.service
sleep 3

if systemctl is-active --quiet openclaw-gateway.service; then
    echo "[OK] OpenClaw gateway is running!"
else
    echo "[WARN] Service may not have started. Checking status..."
    systemctl status openclaw-gateway.service --no-pager || true
fi

# ----------------------------------------------------------
# 5. Show dashboard access info
# ----------------------------------------------------------
echo ""
echo "==========================================="
echo "  SETUP COMPLETE"
echo "==========================================="
echo ""
echo "Dashboard: http://127.0.0.1:$GATEWAY_PORT/"
echo ""
echo "To access dashboard from your LOCAL machine,"
echo "run this on YOUR computer (not the VPS):"
echo ""
echo "  ssh -N -L $GATEWAY_PORT:127.0.0.1:$GATEWAY_PORT root@$(hostname -I | awk '{print $1}')"
echo ""
echo "Then open: http://127.0.0.1:$GATEWAY_PORT/"
echo ""
echo "==========================================="
echo "  TELEGRAM BOT PAIRING"
echo "==========================================="
echo ""
echo "1. Send any message to your Telegram bot"
echo "2. You'll receive a PAIRING CODE in the chat"
echo "3. Run this command to approve:"
echo ""
echo "   $OPENCLAW_BIN pairing list telegram"
echo "   $OPENCLAW_BIN pairing approve telegram <CODE>"
echo ""
echo "Or check logs for the pairing code:"
echo "   journalctl -u openclaw-gateway -f"
echo ""
echo "==========================================="
echo "  USEFUL COMMANDS"
echo "==========================================="
echo ""
echo "  Status:   systemctl status openclaw-gateway"
echo "  Logs:     journalctl -u openclaw-gateway -f"
echo "  Restart:  systemctl restart openclaw-gateway"
echo "  Stop:     systemctl stop openclaw-gateway"
echo "  Doctor:   $OPENCLAW_BIN doctor"
echo ""
