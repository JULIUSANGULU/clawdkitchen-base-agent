const hre = require("hardhat");

async function main() {
    console.log("Deploying PredictionMarket to Base...");

    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy();

    // Wait for deployment to finish
    await predictionMarket.waitForDeployment();

    // Get the contract address
    const address = await predictionMarket.getAddress();

    console.log("✅ PredictionMarket deployed to:", address);
    console.log("📝 SAVE THIS ADDRESS!");
    console.log("");
    console.log("Add this to your .env file:");
    console.log(`CONTRACT_ADDRESS=${address}`);
    console.log("");
    console.log("Verify on Basescan:");
    console.log(`https://basescan.org/address/${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});