# Decentralized Crowdfunding dApp on Polygon

[![Deploy with Vercel]([https://vercel.com/button](https://crowdfunding-dapp-0.vercel.app))](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDarshanVarpe%2Fcrowdfunding-dapp&root-directory=client)

A complete, full-stack decentralized application that allows users to create and fund crowdfunding campaigns directly on the blockchain. Built with a Solidity backend using the Foundry framework and a modern Next.js frontend with TypeScript.

**Live Demo:** [**[[https://your-project-url.vercel.app](https://crowdfunding-dapp-0.vercel.app)]([https://crowdfunding-dapp-0.vercel.app](https://crowdfunding-dapp-0.vercel.app))**]([https://your-project-url.vercel.app](https://crowdfunding-dapp-0.vercel.app)) 👈 

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/c2ffa28e-eec9-4c01-a4ba-d02749242d4b" />


## 📖 About The Project

This project is a fully functional crowdfunding platform built on the Polygon Amoy testnet. It leverages a factory smart contract pattern to allow any user to permissionlessly create their own campaign. The entire lifecycle of a campaign—from funding and tier management to withdrawals and refunds—is handled by decentralized smart contracts, ensuring transparency and security for both creators and backers.

The goal was to build a real-world, feature-rich dApp from the ground up, demonstrating a comprehensive understanding of both smart contract development and modern frontend technologies.

---

## ✨ Core Features

The platform includes a robust set of features for campaign owners, backers, and visitors:

* **👥 For Everyone:**
    * Connect a Web3 Wallet (e.g., MetaMask).
    * View all active, successful, and failed campaigns.
    * View detailed information for any specific campaign.
    * Read and post on-chain comments.

* **🙋‍♂️ For Campaign Backers:**
    * Fund campaigns by contributing to specific reward tiers.
    * Claim a full refund if a campaign fails to meet its goal by the deadline.

* **👑 For Campaign Owners:**
    * Create new crowdfunding campaigns through the factory contract.
    * View a personal dashboard showing only their created campaigns.
    * Add and remove funding tiers in an "Edit Mode".
    * **Withdraw** the collected funds if the campaign is successful.
    * **Pause/Unpause** the ability for users to fund the campaign.
    * **Extend** the campaign deadline while it is still active.

---

## 🛠️ Tech Stack

This project was built using a modern, full-stack web3 technology set:

* **Smart Contracts (Backend):**
    * **Solidity:** Language for writing the smart contracts.
    * **Foundry:** A fast, portable, and Solidity-native development toolkit for compiling, testing, and deploying contracts.

* **Frontend:**
    * **Next.js:** A React framework for building high-performance, server-rendered applications.
    * **React & TypeScript:** For building a type-safe and modular user interface.
    * **Ethers.js:** A comprehensive library for interacting with the Ethereum blockchain and smart contracts.
    * **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

* **Blockchain & Deployment:**
    * **Polygon (Amoy Testnet):** The EVM-compatible blockchain where the smart contracts are live.
    * **Vercel:** For seamless, continuous deployment of the frontend application.

---

## 🚀 Getting Started

To run this project locally, follow these steps.

### Prerequisites

* Node.js (v18 or later)
* Foundry (Forge & Anvil) installed.
* A Web3 wallet like MetaMask.

### Backend Setup (Smart Contracts)

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/DarshanVarpe/crowdfunding-dapp.git](https://github.com/DarshanVarpe/crowdfunding-dapp.git)
    cd crowdfunding-dapp
    ```

2.  **Install Foundry dependencies:**
    ```sh
    forge install
    ```

3.  **Set up environment variables:**
    * Create a `.env` file in the root directory.
    * Add your Polygon Amoy RPC URL and your deployer wallet's private key:
        ```env
        AMOY_RPC_URL="YOUR_ALCHEMY_OR_INFURA_AMOY_RPC_URL"
        PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
        POLYGONSCAN_API_KEY="YOUR_POLYGONSCAN_API_KEY"
        ```

4.  **Compile and Deploy:**
    * Compile the contracts: `forge build`
    * Deploy the factory contract to the Amoy testnet:
        ```sh
        source .env
        forge create --rpc-url $AMOY_RPC_URL --private-key $PRIVATE_KEY --verify --broadcast src/CrowdfundingFactory.sol:CrowdfundingFactory
        ```

### Frontend Setup

1.  **Navigate to the client directory:**
    ```sh
    cd client
    ```

2.  **Install frontend dependencies:**
    ```sh
    npm install
    ```

3.  **Update contract details:**
    * Open `src/constants/index.ts`.
    * Replace `FACTORY_ADDRESS` with the new address you got from the deployment step.
    * Update the `FACTORY_ABI` and `CROWDFUNDING_ABI` by copying them from the `out/` directory in the root folder.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🏛️ Smart Contract Architecture

This dApp uses a **Factory Contract Pattern** for creating campaigns.

* **`CrowdfundingFactory.sol`:** A single, permanent contract that acts as a registry and deployment engine. Its main purpose is to create and keep track of new campaign contracts.
* **`Crowdfunding.sol`:** The template contract that contains all the logic for a single campaign. Each time a new campaign is created, the factory deploys a fresh, independent instance of this contract.

This pattern allows the platform to be permissionless and scalable, as anyone can interact with the factory to launch a standardized, secure campaign without requiring centralized approval.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
