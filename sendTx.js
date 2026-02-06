import { ethers } from "ethers";
import "dotenv/config";

const BASE_RPC = "https://mainnet.base.org";

async function main() {
    const provider = new ethers.JsonRpcProvider(BASE_RPC);

    const wallet = new ethers.Wallet(
        process.env.AGENT_PRIVATE_KEY,
        provider
    );

    console.log("Agent address:", wallet.address);

    const tx = await wallet.sendTransaction({
        to: wallet.address,
        value: 0
    });

    console.log("Transaction sent!");
    console.log("Tx hash:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed on Base ✅");
}

main().catch(console.error);
