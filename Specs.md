### **Project: CarbonCred NFT Marketplace**

**Version:** 1.3
**Date:** August 4, 2025
**Location:** Bommasandra, Karnataka, India
**Authors:** [sai karthik]

### **Part 1: Requirement Specification**
Of course. Here is a comprehensive set of specifications for a marketplace NFT platform for carbon credits. The document is structured into three parts as requested:

1.  **Requirement Specification:** Defines *what* the system must do from a business and user perspective.
2.  **Design Specification:** Outlines *how* the system will be built, including the technology stack and architecture.
3.  **Task Specification:** Breaks down the development work into actionable tasks and phases.

---

### **Project: CarbonCred NFT Marketplace**

**Version:** 1.0
**Date:** August 5, 2025

### **Part 1: Requirement Specification**

#### **1. Introduction**

This document outlines the requirements for "CarbonCred," a decentralized marketplace platform built on the Ethereum blockchain. The platform will enable verified entities to tokenize carbon credits as Non-Fungible Tokens (NFTs) and sell them to users who wish to offset their carbon footprint. The primary currency for transactions will be Ether (ETH).

#### **2. User Roles & Personas**

1.  **Seller (Project Originator):** An entity (e.g., a renewable energy project, a reforestation organization) that has been verified to generate legitimate carbon credits. They mint these credits as NFTs on the platform.
2.  **Buyer (Carbon Offsetter):** An individual or corporation looking to purchase carbon credit NFTs to offset their emissions or for investment purposes.
3.  **Platform Administrator:** The team managing the platform, responsible for verifying sellers, managing platform integrity, and resolving disputes.

#### **3. Functional Requirements (FR)**

**FR1: User Account Management**
* **FR1.1:** All users (Sellers and Buyers) must be able to connect to the platform using a standard Web3 wallet (e.g., MetaMask). Wallet connection serves as authentication.
* **FR1.2:** Users can create a basic profile associated with their wallet address, including a username and profile picture.
* **FR1.3:** Sellers must undergo a mandatory verification process (KYB - Know Your Business) managed by the Platform Administrator before they are granted minting rights.

**FR2: Seller-Specific Functionality**
* **FR2.1:** A verified Seller must be able to create a "Project" page, detailing the source of their carbon credits (e.g., project type, location, verification standard like Verra or Gold Standard, vintage year).
* **FR2.2:** Upon project approval by an Administrator, the Seller is granted the right to mint a specific quantity ('n') of carbon credit NFTs corresponding to their verified documentation. Each NFT will represent a standardized unit, e.g., **1 NFT = 1 tonne of $CO_2e$ (Carbon Dioxide equivalent)**.
* **FR2.3:** The Seller can list their minted NFTs for sale on the marketplace, setting a fixed price in ETH.
* **FR2.4:** The Seller must have a dashboard to view their active listings, sales history, and total earnings.
* **FR2.5:** The Seller can withdraw their ETH earnings from the platform's smart contract to their wallet.

**FR3: Buyer-Specific Functionality**
* **FR3.1:** A Buyer can browse, search, and filter all listed carbon credit NFTs on the marketplace.
* **FR3.2:** Filtering criteria shall include: price, project type, location, vintage year, and verification standard.
* **FR3.3:** A Buyer can view the detailed page for each NFT, which includes all project metadata, provenance, and transaction history.
* **FR3.4:** A Buyer can purchase an NFT using ETH. The transaction must be atomic (the ETH transfer and NFT transfer must succeed or fail together).
* **FR3.5:** A Buyer can view their collection of owned carbon credit NFTs in their profile.
* **FR3.6:** A Buyer has the option to "retire" a carbon credit NFT. Retiring an NFT permanently removes it from circulation (e.g., by sending it to a burn address or a non-transferable state), signifying that the offset has been claimed. A retired NFT cannot be resold.

**FR4: Platform & Administrator Functionality**
* **FR4.1:** The platform shall collect a small percentage fee on every successful sale. The fee percentage must be configurable by the Administrator.
* **FR4.2:** Administrators will have a secure dashboard to manage Seller verification requests (approve/reject).
* **FR4.3:** Administrators can view platform-wide analytics (total volume, number of transactions, active users).
* **FR4.4:** Administrators can feature specific projects or NFTs on the homepage.

#### **4. Non-Functional Requirements (NFR)**

* **NFR1: Security:** Smart contracts must be audited by a reputable third-party firm to prevent vulnerabilities (e.g., re-entrancy attacks). All off-chain data must be stored securely.
* **NFR2: Performance:** The user interface must be responsive, with loading times under 3 seconds. Blockchain transaction feedback should be clearly communicated to the user (e.g., "pending," "confirmed," "failed").
* **NFR3: Scalability:** The platform should be designed to handle an initial load of 1,000 concurrent users and be scalable. Consideration for Layer-2 solutions (e.g., Arbitrum, Optimism) should be made to reduce gas fees and improve transaction speed.
* **NFR4: Usability:** The UI/UX should be intuitive for users familiar with web3 applications. Clear instructions and tooltips should guide new users.
* **NFR5: Decentralization:** NFT metadata and associated verification documents must be stored on a decentralized file system like IPFS to ensure permanence and prevent data loss.

-----

### **Part 2: Detailed Design Specification**

#### **2.1 System Architecture Overview**

The platform uses a decoupled architecture:

  * **On-Chain Logic (thirdweb):** Manages asset ownership (`NFT Collection`) and commerce (`Marketplace`). It is the source of truth for "who owns what" and "what is for sale".
  * **Off-Chain Backend (Supabase):** Manages user data, project details, and business logic that does not need to be on-chain. It acts as the system's administrative and data-enrichment layer.
  * **Frontend (React/Next.js):** The presentation layer that consumes data from both thirdweb (for on-chain state) and Supabase (for off-chain state) to provide a cohesive user experience.

*(Conceptual diagram for clarity)*

-----

#### **2.2 Detailed Data Flow Diagrams**

**2.2.1 Flow 1: Seller Project Verification & NFT Minting**

This flow describes how a Seller gets approved and is empowered to mint their own NFTs.

1.  **Seller (UI):** Connects wallet -\> Navigates to "Create Project" form.
2.  **Frontend:**
      * Authenticates user with `supabase.auth.signInWith('ethereum')`.
      * Renders the project submission form.
      * On submit, uploads verification documents to **Supabase Storage**.
      * Inserts a new record into the **`projects`** table in Supabase with `status: 'pending'`.
3.  **Admin (UI):** Navigates to the Admin Dashboard -\> Sees a list of pending projects.
4.  **Frontend (Admin):**
      * Fetches projects where `status = 'pending'` from the Supabase `projects` table.
      * Admin reviews the project details and clicks "Approve".
5.  **Frontend (Admin Action):** On "Approve" click:
      * Makes a secure call to the **Supabase Edge Function** `grant-minter-role`.
      * **Request Body:** `{ "sellerAddress": "0x...", "nftContractAddress": "0x..." }`
6.  **Supabase Edge Function (`grant-minter-role`):**
      * Receives the request and validates the caller is an authenticated Admin.
      * Initializes the **thirdweb Node.js SDK** with the securely stored Admin private key.
      * Calls `nftCollection.roles.grant("minter", sellerAddress)`.
      * On success, updates the project's status in the Supabase `projects` table to `status: 'approved'`.
      * Returns a `{ success: true }` message.
7.  **Seller (UI):** Navigates to their dashboard, sees the approved project, and an enabled "Mint NFTs" button.
8.  **Frontend (Seller Action):**
      * Seller clicks "Mint NFTs", opening a modal.
      * Seller enters NFT details (name, description).
      * The frontend prepares the metadata JSON object according to the standard in `2.5.4`.
      * Uses thirdweb's `useNFTCollection` hook and calls the `mintTo(sellerAddress, metadata)` function. Since the seller now has the `minter` role, this on-chain transaction succeeds.

**2.2.2 Flow 2: Buyer NFT Purchase**

This flow describes the process of a user buying an NFT from the marketplace.

1.  **Buyer (UI):** Browses the marketplace and clicks on an NFT to purchase.
2.  **Frontend:**
      * Fetches active listings from the **thirdweb `Marketplace` contract** using the `useActiveListings` hook.
      * For each listing, it fetches the NFT metadata from **IPFS** via the `tokenURI`.
      * It also fetches supplementary project data from the **Supabase `projects` table** to enrich the listing.
3.  **Buyer (UI):** Clicks the "Buy Now for X ETH" button.
4.  **Frontend:**
      * Uses the thirdweb `<Web3Button>` component.
      * The button's `action` prop is configured to call `marketplace.directListings.buyFromListing(listingId, quantity)`.
5.  **thirdweb SDK & Blockchain:**
      * The SDK prompts the user to confirm the transaction in their wallet (e.g., MetaMask).
      * Upon confirmation, the `Marketplace` smart contract atomically:
          * Transfers the ETH from the buyer.
          * Sends the sale price to the seller.
          * Sends the platform fee to the admin wallet.
          * Transfers ownership of the NFT to the buyer.
6.  **Frontend:**
      * The `<Web3Button>` component automatically handles UI states (loading, success, error).
      * On success, it can display a confirmation toast/modal and refetch the user's owned NFTs using the `useOwnedNFTs` hook to update their profile page.

-----

#### **2.3 Backend Design (Supabase)**

**2.3.1 Database Schema & Row Level Security (RLS)**

  * **Table: `users`**

      * `id` (UUID, PRIMARY KEY, references `auth.users.id`)
      * `wallet_address` (TEXT, UNIQUE, NOT NULL)
      * `username` (TEXT)
      * `role` (TEXT, DEFAULT 'user') - Can be 'user' or 'admin'.
      * `created_at` (TIMESTAMPTZ, DEFAULT now())
      * **RLS Policies:**
          * `ENABLE ROW LEVEL SECURITY;`
          * **Admin Full Access:** `CREATE POLICY "Admins have full access" ON users FOR ALL TO authenticated USING (get_my_claim('role') = 'admin');`
          * **User Own Data:** `CREATE POLICY "Users can view and update their own data" ON users FOR ALL TO authenticated USING (auth.uid() = id);`

  * **Table: `projects`**

      * `id` (SERIAL, PRIMARY KEY)
      * `seller_wallet_address` (TEXT, NOT NULL)
      * `project_name` (TEXT, NOT NULL)
      * `description` (TEXT)
      * `location` (TEXT)
      * `verification_standard` (TEXT) -- e.g., 'Verra', 'Gold Standard'
      * `verification_docs_url` (TEXT) -- Link to Supabase Storage file
      * `status` (TEXT, DEFAULT 'pending') -- 'pending', 'approved', 'rejected'
      * `created_at` (TIMESTAMPTZ, DEFAULT now())
      * **RLS Policies:**
          * `ENABLE ROW LEVEL SECURITY;`
          * **Admin Full Access:** `CREATE POLICY "Admins have full access" ON projects FOR ALL TO authenticated USING (get_my_claim('role') = 'admin');`
          * **Sellers Create/Update Own:** `CREATE POLICY "Sellers can create/update their own projects" ON projects FOR ALL TO authenticated USING (auth.uid() = (SELECT id FROM users WHERE wallet_address = seller_wallet_address));`
          * **Public Read on Approved:** `CREATE POLICY "Public can read approved projects" ON projects FOR SELECT USING (status = 'approved');`

**2.3.2 Storage Configuration**

  * **Bucket:** `verification-documents`
  * **Policies:**
      * Admins have full `SELECT`, `INSERT`, `UPDATE`, `DELETE` access.
      * Authenticated users can `INSERT` documents.
      * `SELECT` access is restricted to the user who uploaded the file and to admins. This prevents users from seeing each other's private verification documents.

**2.3.3 Edge Function Specification: `grant-minter-role`**

  * **Endpoint:** `/functions/v1/grant-minter-role`
  * **Method:** `POST`
  * **Authorization:** Requires Supabase user JWT. The function will first check if the caller's custom claim `role` is 'admin'.
  * **Request Body (JSON):**
    ```json
    {
      "sellerAddress": "0x...",
      "nftContractAddress": "0x..."
    }
    ```
  * **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Minter role granted successfully to 0x..."
    }
    ```
  * **Error Responses:**
      * `401 Unauthorized`: If the user is not authenticated or not an admin.
      * `400 Bad Request`: If the request body is missing required fields.
      * `500 Internal Server Error`: If the thirdweb SDK call fails or the database update fails.

-----

#### **2.4 Frontend Design**

**2.4.1 Component Architecture**

  * **`pages/`**: Standard Next.js pages (`index.js`, `marketplace.js`, `profile.js`, `admin.js`).
  * **`components/`**:
      * **`common/`**:
          * `ConnectWalletButton.js`: Wrapper around thirdweb's connect logic.
          * `Navbar.js`, `Footer.js`, `Layout.js`.
      * **`nft/`**:
          * `NFTGrid.js`: Fetches and displays a grid of NFTs. Takes filter props.
          * `NFTCard.js`: Displays a single NFT with image, name, price.
          * `NFTDetailView.js`: A full-page or modal view with detailed info, metadata, and purchase button.
          * `PurchaseModal.js`: Contains the `<Web3Button>` and logic for buying.
      * **`project/`**:
          * `ProjectForm.js`: Form for sellers to create/edit a project.
          * `ProjectDetailHeader.js`: Banner-like component for an NFT's project page.
      * **`profile/`**:
          * `OwnedNFTsTab.js`: Grid of NFTs owned by the current user.
          * `CreatedProjectsTab.js`: List of projects created by the seller.
      * **`admin/`**:
          * `PendingProjectsTable.js`: Table of projects with `status: 'pending'`, with Approve/Reject buttons.

**2.4.2 State Management**

  * **Strategy:** For simplicity and performance, a combination will be used:
      * **thirdweb Hooks:** For all on-chain state (listings, owned NFTs, contract data). This provides caching and automatic refetching.
      * **React Context & Hooks:** For global UI state like the current user's Supabase profile and auth status.
      * **Local Component State (`useState`)**: For form inputs and temporary UI states.

**2.4.3 NFT Metadata Standard**

  * The `tokenURI` will point to an IPFS URL containing a JSON file with the following structure:
    ```json
    {
      "name": "Reforestation Credit - Amazonia #123",
      "description": "This token represents one tonne of CO2e offset through the Amazonia Reforestation Project.",
      "image": "ipfs://<image_cid>",
      "external_url": "https://carboncred.io/projects/1",
      "attributes": [
        {
          "trait_type": "Project",
          "value": "Amazonia Reforestation"
        },
        {
          "trait_type": "Location",
          "value": "Brazil"
        },
        {
          "trait_type": "Standard",
          "value": "Verra"
        },
        {
          "trait_type": "Vintage Year",
          "value": "2024"
        },
        {
          "trait_type": "Project ID",
          "value": 1
        },
        {
          "trait_type": "Status",
          "value": "Active" // Changes to "Retired" upon burning
        }
      ]
    }
    ```

**2.4.4 Error Handling Strategy**

  * **Wallet/Transaction Errors:** Handled by the `<Web3Button>` component and thirdweb hooks. Errors (e.g., "User rejected transaction," "Insufficient funds") will be caught and displayed in a standardized toast notification component (e.g., `react-hot-toast`).
  * **API/Backend Errors:** All calls to Supabase will be wrapped in `try...catch` blocks. Errors will be logged and displayed to the user via the same toast notification system with user-friendly messages (e.g., "Could not load your profile. Please try again.").

### **Part 3: Task Specification**

*(This section is now more granular, mapping directly to the detailed design.)*

**Epic 1: Setup & Configuration**

  * [Task] Set up Supabase project, thirdweb project.
  * [Task] Implement DB schema and RLS policies in Supabase as per spec 2.3.1.
  * [Task] Configure Supabase Storage bucket and policies as per spec 2.3.2.
  * [Task] Deploy and configure `NFT Collection` & `Marketplace` contracts on thirdweb.

**Epic 2: Backend (Edge Functions)**

  * [Task] Develop, test, and deploy the `grant-minter-role` Edge Function as per spec 2.3.3.
  * [Task] Implement secure secrets management for the admin wallet private key.

**Epic 3: Core Frontend Components**

  * [Task] Develop `Layout.js`, `Navbar.js`, `Footer.js`.
  * [Task] Develop `ConnectWalletButton.js` using Supabase Auth and thirdweb.
  * [Task] Implement the User Profile Context provider to hold Supabase user data.

**Epic 4: Marketplace & NFT Flow**

  * [Task] Develop `NFTGrid.js` and `NFTCard.js`.
  * [Task] Develop `NFTDetailView.js` to display all metadata and project info.
  * [Task] Develop the `PurchaseModal.js` with the `<Web3Button>` for buying.
  * [Task] Implement the "Retire" functionality by calling the `burn` function.

**Epic 5: Seller & Admin Flows**

  * [Task] Develop the `ProjectForm.js` component for project creation.
  * [Task] Develop the user profile page with `OwnedNFTsTab.js` and `CreatedProjectsTab.js`.
  * [Task] Develop the `PendingProjectsTable.js` for the admin dashboard.
  * [Task] Implement the admin action to invoke the `grant-minter-role` Edge Function.

**Epic 6: Finalization & Deployment**

  * [Task] Implement comprehensive error handling and toast notifications.
  * [Task] Conduct end-to-end testing of all data flows.
  * [Task] Security audit of RLS policies and Edge Function logic.
  * [Task] Deploy frontend to Vercel/Netlify.