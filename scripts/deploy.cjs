const hre = require("hardhat");

async function main() {
    console.log("Deploying PredictionMarket to Base...");

    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy();

    await predictionMarket.deployed();

    console.log("✅ PredictionMarket deployed to:", predictionMarket.address);
    console.log("📝 SAVE THIS ADDRESS!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});