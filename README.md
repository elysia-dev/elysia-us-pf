# Elysia US PF monorepo

## Getting Started
```sh
yarn

# Run next.js dev server locally
yarn workspace web dev

# Run hardhat tests
yarn workspace hardhat hardhat test
```

## Verify contracts in etherscan
```sh
yarn workspace hardhat hardhat etherscan-verify --network rinkeby
```

## Deploy
```sh
# elyfi-test network
yarn workspace hardhat hardhat deploy --network ganache_remote --tags mainnet

# mainnet
yarn workspace hardhat hardhat deploy --network mainnet --tags mainnet
```
