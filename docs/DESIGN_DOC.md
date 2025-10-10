# Project Architecture & Core Goals: everybit

## 1. Overview

**everybit** is a GoFundMe-style crypto fundraising platform built on the Base blockchain.

The project's primary mission is to make creating and donating to fundraisers radically accessible. It is designed to cater to three distinct user groups:

1. **Crypto Novices:** Individuals who are not familiar with blockchain technology and do not own crypto or have a crypto wallet.
2. **Crypto Middle Ground:** Users who have (or are willing to create) a Coinbase account and want to donate from their Coinbase balance.
3. **Crypto Natives:** Experienced users who are comfortable interacting with smart contracts and managing their own wallets.

## 2. Core Principles

- **Frictionless User Experience:** The platform must be intuitive for all target user groups. Donating or creating a campaign should be as simple and seamless as possible.
- **Security & Trust:** All smart contracts must be secure and transparent. Donors should have confidence that their funds are going directly to the intended campaign.
- **Decentralization:** By building on Base and using a factory pattern, the platform empowers creators to own and control their fundraising campaigns directly via smart contracts.
- **Simplicity with User Empowerment:** While contracts remain lean and gas-efficient, they provide key tools like cancellation and refunds for a more user-centric experience.

## 3. Smart Contract Architecture: The Factory Pattern

To ensure scalability, organization, and low gas costs, the project uses the **Factory Pattern**.

- **`CampaignFactory.sol`**: A single, durable contract that is deployed once. Its sole purpose is to deploy new `Campaign` contracts. It acts as a registry, keeping a list of all campaigns ever created, which makes discovery simple for the frontend.

- **`Campaign.sol`**: A lightweight "template" contract that is deployed by the factory for every new fundraiser. Each campaign is a unique instance of this contract with its own address, beneficiary, goal, and deadline.

This pattern is gas-efficient because the complex factory logic is deployed only once, and each new campaign is a minimal clone.

### 3.1 `Campaign.sol` Key Features

The `Campaign.sol` template is designed to be both simple and robust, with several key features:

- **Dual Donation Paths:** Supports both `donate()` (standard ERC-20 `approve`/`transferFrom`) and `donateWithPermit()` (EIP-2612) for a one-click user experience with compatible tokens like USDC.
- **Flexible Funding:** The creator can claim all raised funds after the deadline, even if the goal isn't met.
- **Updatable Metadata:** The campaign creator can call `updateMetadataURI` to change the campaign's details after launch. An event `MetadataUpdated(string oldMetadataURI, string newMetadataURI, uint256 timestamp)` is emitted for easy off-chain tracking.
- **Ending & Refunds:** Creators can end a campaign at any time. This prevents new donations and allows existing donors to call a `refund()` function to retrieve their contributions.
- **ETH Rejection:** The contract explicitly rejects native ETH transfers via `receive()` and `fallback()` functions to prevent accidental loss of funds.
- **Custom Errors:** All `require` checks use custom errors for improved gas efficiency and clearer error reporting on the frontend.

## 4. Key Personas & User Flows

### 4.1. The Crypto Novice (Guest Flow)

This user wants to donate to a cause using familiar methods, like a debit card, without needing to understand or set up a crypto wallet.

- **Goal:** A simple, \"no account needed\" donation experience.
- **Technology:** **Coinbase Pay SDK (`@coinbase/cbpay-js` using `initOnRamp()`)**
- **The Flow:**
  1. The user visits a campaign page and clicks "Donate with Card".
  2. The Coinbase Onramp modal appears.
  3. The user enters their card information and email directly into the secure Coinbase UI.
  4. Coinbase processes the payment, converts fiat to USDC on Base, and sends it directly to the campaign contract.
  5. Since this is an ERC-20 transfer, no `receive()` or `fallback()` is involved.
  6. If the campaign is ended, the frontend shows a "Request Refund" button to eligible donors.

---

### 4.2. The Crypto Middle Ground (Coinbase Account Flow)

This user already has a Coinbase account or is willing to create one. They want to donate using their existing Coinbase balance without installing a wallet extension.

- **Goal:** A frictionless flow for Coinbase account holders.
- **Technology:** **Coinbase Pay SDK (`@coinbase/cbpay-js` using `initCbPay()`)**
- **The Flow:**
  1. The user visits a campaign page and clicks "Donate with Coinbase".
  2. The Coinbase Pay modal appears.
  3. The user logs into their Coinbase account (or signs up if they don’t have one yet).
  4. The user selects an asset (e.g., USDC or ETH) from their Coinbase balance.
  5. Coinbase processes the transfer and sends the funds directly to the campaign contract.
  6. If the campaign is ended, the frontend displays a "Request Refund" button.

---

### 4.3. The Crypto Native (Wallet Flow)

This user already has a crypto wallet (MetaMask, Coinbase Wallet, etc.) and wants to donate directly from it.

- **Goal:** A secure, gas-efficient donation flow supporting both one-click (permit) and two-step (approve/transferFrom) patterns.
- **Technology:** **wagmi hooks**, EIP-2612 **`permit`**, and ERC-20 **`approve`**/**`transferFrom`**.
- **The Flow:**
  1. The user connects their wallet to the site (using Privy).
  2. The frontend application checks if the token supports `permit`.
  3. **If `permit` is supported (ideal path):**
     - The application crafts a `permit` message.
     - The user signs the message (a single, gas-less off-chain action).
     - The frontend calls the `donateWithPermit()` function on the smart contract, submitting the signature. The contract verifies the signature and pulls the funds in a single transaction.
  4. **If `permit` is not supported (fallback path):**
     - The frontend calls `approve()` to grant spending permission to the contract.
     - Once the approval transaction is confirmed, the frontend calls the `donate()` function.
  5. If the campaign is ended, the frontend shows a "Request Refund" button, which logged-in donors can use to trigger the `refund()` function.

## 5. Fundraising Model: GoFundMe-Style

- **Flexible Funding:** Campaigns follow a flexible "GoFundMe-style" model. The `beneficiary` designated during campaign creation can withdraw all donated funds after the campaign `deadline` has passed, **even if the fundraising `goal` has not been met**.
- **Ending & Refunds:** Campaign creators can end their campaign at any time, preventing further donations. Donors may request a refund of their contribution if the campaign is ended and funds remain in the contract. However, creators may still claim remaining funds after ending the campaign, similar to GoFundMe's approach.

## 6. Frontend Technology Stack

- **Framework:** Next.js
- **Styling:** TailwindCSS
- **Authentication & Wallet Management:** Privy
- **Smart Contract Interaction:** wagmi / viem
- **Guest On-ramp:** Coinbase Pay SDK (`initOnRamp`)
- **Coinbase Account Payments:** Coinbase Pay SDK (`initCbPay`)
- **Crypto Wallets:** MetaMask, Coinbase Wallet via wagmi connectors

## 7. Additional UX Considerations

- When a campaign is ended:
  - Display a prominent "Campaign Ended" banner.
  - Disable the donation form.
  - Show a "Request Refund" button for all donors (guest, Coinbase account, crypto wallet).
  - Add a notice: *"The creator may still withdraw funds from this campaign. Request your refund promptly."*up