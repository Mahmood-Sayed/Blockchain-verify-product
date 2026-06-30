const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const ProductVerification = await hre.ethers.getContractFactory("ProductVerification");
  const contract = await ProductVerification.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("ProductVerification deployed to:", address);

  // Save contract address and ABI for backend
  const artifact = await hre.artifacts.readArtifact("ProductVerification");
  const deployInfo = {
    address,
    abi: artifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  // Write to backend config
  const backendPath = path.join(__dirname, "../../backend/config/contract.json");
  fs.mkdirSync(path.dirname(backendPath), { recursive: true });
  fs.writeFileSync(backendPath, JSON.stringify(deployInfo, null, 2));
  console.log("Contract info saved to backend/config/contract.json");

  // Write to frontend config
  const frontendPath = path.join(__dirname, "../../frontend/src/config/contract.json");
  fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
  fs.writeFileSync(frontendPath, JSON.stringify(deployInfo, null, 2));
  console.log("Contract info saved to frontend/src/config/contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
