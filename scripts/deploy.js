const hre = require("hardhat");

async function main() {
    console.log("Deploying PredictionMarket to Base...");

    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy();

    await predictionMarket.waitForDeployment();

    const address = await predictionMarket.getAddress();

    console.log("✅ PredictionMarket deployed to:", address);
    console.log("📝 SAVE THIS ADDRESS - You need it for your bot and frontend!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Add this address to your .env file as CONTRACT_ADDRESS");
    console.log("2. Verify on Basescan:", `https://basescan.org/address/${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });