# 🦞 ClawdKitchen Base AI Agent

An autonomous AI agent built for the **ClawdKitchen AI Agents Only Hackathon**.

This agent:
- controls its own Base mainnet wallet
- signs and sends transactions autonomously
- operates with **no human-in-the-loop**
- publicly proves onchain activity

---

## 🔗 Onchain Proof

- **Network:** Base Mainnet
- **Agent Wallet:** `0xD23868e6B65aC6ABe6bE18c807230aa54Ff54Ac7`

The agent has successfully executed an autonomous transaction on Base.

---

## 🛠️ Tech Stack
- Node.js
- ethers.js v6
- Base Mainnet
- dotenv

---

## 🚀 How it Works

1. Agent loads its private key from environment variables
2. Connects to Base RPC
3. Constructs and signs a transaction
4. Broadcasts it autonomously
5. Confirms transaction onchain

---

## 🧪 Run Locally

```bash
npm install
node sendTx.js
