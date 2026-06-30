const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying ProductVerification contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const ProductVerification = await hre.ethers.getContractFactory("ProductVerification");
  const contract = await ProductVerification.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ ProductVerification deployed to:", address);

  // Save the contract address to a config file for frontend & backend
  const config = {
    contractAddress: address,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
  };

  // Write to frontend
  const frontendConfigPath = path.join(__dirname, "../frontend/src/config/contract.json");
  fs.mkdirSync(path.dirname(frontendConfigPath), { recursive: true });
  fs.writeFileSync(frontendConfigPath, JSON.stringify(config, null, 2));
  console.log("📝 Contract address saved to frontend/src/config/contract.json");

  // Write to backend
  const backendConfigPath = path.join(__dirname, "../backend/config/contract.json");
  fs.mkdirSync(path.dirname(backendConfigPath), { recursive: true });
  fs.writeFileSync(backendConfigPath, JSON.stringify(config, null, 2));
  console.log("📝 Contract address saved to backend/config/contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
