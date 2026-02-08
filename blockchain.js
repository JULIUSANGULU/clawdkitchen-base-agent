import { ethers } from "ethers";
import "dotenv/config";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [
    "function recordPrediction(string memory _home, string memory _away, uint8 _winner, uint8 _confidence) external returns (uint256)",
    "function getPrediction(uint256 _id) external view returns (tuple(uint256 id, string homeTeam, string awayTeam, uint8 predictedWinner, uint8 confidence, uint256 timestamp, bool resolved, uint8 actualWinner))",
    "function getAccuracy() external view returns (uint256)",
    "function predictionCount() external view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

export async function recordPredictionOnChain(match, winner, confidence) {
    try {
        const winnerCode = winner === "home" ? 0 : winner === "away" ? 1 : 2;

        const tx = await contract.recordPrediction(
            match.home,
            match.away,
            winnerCode,
            confidence
        );

        const receipt = await tx.wait();
        console.log("✅ Prediction recorded on Base!");
        console.log("Transaction hash:", receipt.hash);
        console.log("View on Basescan:", `https://basescan.org/tx/${receipt.hash}`);

        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain recording failed:", error.message);
        throw error;
    }
}

export async function getAccuracy() {
    try {
        const accuracy = await contract.getAccuracy();
        return accuracy.toString();
    } catch (error) {
        console.error("Error getting accuracy:", error.message);
        return "0";
    }
}

export async function getPredictionCount() {
    try {
        const count = await contract.predictionCount();
        return count.toString();
    } catch (error) {
        console.error("Error getting prediction count:", error.message);
        return "0";
    }
}