import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found. Please install it.");
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  await ensureCorrectNetwork();
  return accounts[0];
};

export const getProvider = () => {
  if (!window.ethereum) throw new Error("MetaMask not found.");
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return provider.getSigner();
};

export const getContract = async (contractAddress, abi) => {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
};

export const getReadOnlyContract = (contractAddress, abi) => {
  const rpcUrl = process.env.REACT_APP_RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(contractAddress, abi, provider);
};

// Ensures the user's MetaMask is on the right network (e.g. Sepolia).
// Prompts to switch, or to add the network if they don't have it yet.
export const ensureCorrectNetwork = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found.");
  const targetChainId = process.env.REACT_APP_CHAIN_ID || "0xaa36a7"; // Sepolia = 11155111 = 0xaa36a7
  const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
  if (currentChainId === targetChainId) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainId }],
    });
  } catch (switchError) {
    // Chain not added to MetaMask yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: targetChainId,
            chainName: "Sepolia Test Network",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [process.env.REACT_APP_RPC_URL],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
};

export const formatTimestamp = (bigintTimestamp) => {
  if (!bigintTimestamp) return "N/A";
  return new Date(Number(bigintTimestamp) * 1000).toLocaleString();
};
