.PHONY: help install build test clean deploy-sepolia deploy-mainnet verify

# Load environment variables
include .env
export

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	forge install

build: ## Build contracts
	forge build

test: ## Run tests
	forge test -vv

test-gas: ## Run tests with gas reporting
	forge test --gas-report

clean: ## Clean build artifacts
	forge clean

# Deployment commands
deploy-sepolia: ## Deploy to Base Sepolia testnet
	@echo "Deploying to Base Sepolia..."
	forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		--verify \
		-vvvv

deploy-sepolia-dry: ## Dry run deployment to Base Sepolia
	@echo "Dry run deployment to Base Sepolia..."
	forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		-vvvv

test-deployment: ## Test the deployed contracts on Base Sepolia
	@echo "Testing deployed contracts..."
	forge script script/TestDeployment.s.sol:TestDeployment \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		-vvvv

deploy-mainnet: ## Deploy to Base Mainnet (DANGEROUS - use with caution)
	@echo "⚠️  DEPLOYING TO MAINNET ⚠️"
	@echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
	@sleep 5
	forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
		--rpc-url $(BASE_MAINNET_RPC_URL) \
		--broadcast \
		--verify \
		-vvvv

# Verification (if auto-verify fails)
verify: ## Verify contracts on Basescan
	@echo "Manual verification - you'll need to provide contract addresses"
	@echo "Usage: forge verify-contract <address> <contract> --chain base-sepolia"

# Utility commands
format: ## Format code
	forge fmt

snapshot: ## Create gas snapshot
	forge snapshot

coverage: ## Generate coverage report
	forge coverage

# Local development
anvil: ## Start local Anvil node
	anvil

deploy-local: ## Deploy to local Anvil node
	forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
		--rpc-url http://localhost:8545 \
		--broadcast \
		-vvvv
