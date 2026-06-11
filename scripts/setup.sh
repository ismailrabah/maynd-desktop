#!/bin/bash
echo "Setting up Maynd.ma..."
if ! command -v bun &> /dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
if ! command -v rustc &> /dev/null; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
fi
bun install
cd src-tauri && cargo build && cd ..
mkdir -p models sidecar documents
echo "Setup complete! Run: bun run tauri:dev"