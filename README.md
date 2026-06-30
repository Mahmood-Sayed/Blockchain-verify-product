# BlockVerify — Blockchain-Based Product Verification System

**MCA Project | Mahmood Sayed (24P00169) | Presidency College**  
**Guide: Ms. Jitha Janardhanan | Session: March–June 2026**

---

## Project Structure

```
blockchain-verify/
├── contracts/                  # Solidity smart contracts
│   └── ProductVerification.sol
├── scripts/
│   └── deploy.js               # Hardhat deploy script
├── hardhat.config.js
├── package.json                # Root (Hardhat)
│
├── backend/                    # Node.js + Express API
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── verify.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── blockchain.js
│   └── .env
│
└── frontend/                   # React app
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── VerifyProduct.js
        │   ├── RegisterProduct.js
        │   └── Dashboard.js
        ├── components/
        │   └── Navbar.js
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   ├── api.js
        │   └── blockchain.js
        └── config/
            └── contract.json   # Auto-generated after deploy
```

---

## Setup & Run (Step-by-Step)

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- MetaMask browser extension

---

### Step 1 — Install dependencies

```bash
# Root (Hardhat + smart contract tools)
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

---

### Step 2 — Start Hardhat local blockchain

Open **Terminal 1**:
```bash
npx hardhat node
```
Keep this running. It creates 20 test accounts with 10000 ETH each.  
Copy one of the private keys — you'll need it for MetaMask.

---

### Step 3 — Compile & Deploy the smart contract

Open **Terminal 2**:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```
This auto-saves the contract address to:
- `frontend/src/config/contract.json`
- `backend/config/contract.json`

---

### Step 4 — Start the backend

Open **Terminal 3**:
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

---

### Step 5 — Start the frontend

Open **Terminal 4**:
```bash
cd frontend
npm start
```
Frontend runs at: http://localhost:3000

---

### Step 6 — Configure MetaMask

1. Open MetaMask → Add Network manually:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import a test account using a private key from Step 2.

---

## How to Use

### As a Manufacturer
1. Go to http://localhost:3000/register
2. Select **Manufacturer**, fill in details, click **Connect MetaMask**
3. Sign up → You're taken to Dashboard
4. Click **Register New Product**, fill the form
5. MetaMask will ask you to sign 1-2 transactions → Confirm them
6. Product is now on the blockchain!

### As a Customer
1. Go to http://localhost:3000/verify
2. Enter the product's serial number
3. Instantly see if it's authentic (verified on blockchain) or fake

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.19 |
| Blockchain Dev | Hardhat |
| Web3 Library | Ethers.js v6 |
| Frontend | React.js 18 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT tokens |
| QR Codes | qrcode npm |

---

## Smart Contract Functions

| Function | Description |
|----------|-------------|
| `registerCompany(name, email)` | Register manufacturer on-chain |
| `registerProduct(name, serialNumber)` | Register product hash on-chain |
| `verifyProduct(serialNumber)` | Returns authenticity status |
| `getProduct(serialNumber)` | Returns full product details |
| `getCompanyProducts(address)` | Returns all products of a company |

