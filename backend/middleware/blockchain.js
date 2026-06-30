const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

let provider, contractInstance;

const getContract = () => {
  if (contractInstance) return contractInstance;

  try {
    const configPath = path.join(__dirname, "../config/contract.json");
    if (!fs.existsSync(configPath)) {
      throw new Error("contract.json not found. Deploy the contract first.");
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Load ABI from compiled artifacts
    const artifactPath = path.join(
      __dirname,
      "../../frontend/src/artifacts/contracts/ProductVerification.sol/ProductVerification.json"
    );
    if (!fs.existsSync(artifactPath)) {
      throw new Error("Contract ABI not found. Run: npx hardhat compile");
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545");
    contractInstance = new ethers.Contract(config.contractAddress, artifact.abi, provider);
    return contractInstance;
  } catch (err) {
    console.error("Blockchain connection error:", err.message);
    return null;
  }
};

const getSignedContract = async (privateKey) => {
  const contract = getContract();
  if (!contract) return null;
  const wallet = new ethers.Wallet(privateKey, provider);
  return contract.connect(wallet);
};

module.exports = { getContract, getSignedContract };
