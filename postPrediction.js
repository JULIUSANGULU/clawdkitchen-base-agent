import { recordPredictionOnChain, getAccuracy, getPredictionCount } from "./blockchain.js";
import { TwitterApi } from "twitter-api-v2";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

// Twitter client (optional)
const client = process.env.X_API_KEY ? new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
}) : null;

// Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Generate AI prediction using Claude
async function generatePrediction() {
    const matches = [
        { home: "Arsenal", away: "Chelsea" },
        { home: "Barcelona", away: "Atletico Madrid" },
        { home: "Bayern", away: "Dortmund" },
        { home: "Liverpool", away: "Manchester City" },
        { home: "Real Madrid", away: "Barcelona" },
    ];

    const match = matches[Math.floor(Math.random() * matches.length)];

    // Call Claude API for real prediction
    const prompt = `You are a football prediction AI. Analyze this match:

${match.home} vs ${match.away}

Consider:
- Recent form (last 5 matches)
- Head-to-head history
- Home advantage
- Current league position
- Injuries and suspensions

Provide a JSON prediction with this exact format:
{
  "winner": "home|away|draw",
  "confidence": 65,
  "reasoning": "brief tactical analysis in one sentence"
}`;

    try {
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        const prediction = JSON.parse(message.content[0].text);

        // Format tweet based on AI prediction
        const winnerText =
            prediction.winner === "home" ? match.home :
                prediction.winner === "away" ? match.away :
                    "Draw";

        const tweet = `⚽️ Match Intelligence Update

${match.home} vs ${match.away}

AI Prediction: ${winnerText} (${prediction.confidence}% confidence)
${prediction.reasoning}

Oracle addendum: the crab has seen the data 🦀

#ClawdKitchen #Base`;

        // Return both the tweet and the data needed for blockchain
        return { tweet, match, prediction };

    } catch (error) {
        console.error("AI prediction failed:", error.message);
        // Fallback to basic prediction
        const confidence = Math.floor(Math.random() * 20) + 55;
        const tweet = `⚽️ Match Intelligence Update

${match.home} vs ${match.away}

Model confidence: ${match.home} win (${confidence}%)
Tactical edge + recent form advantage.

Oracle addendum: the crab has seen the data 🦀

#ClawdKitchen #Base`;

        const prediction = {
            winner: "home",
            confidence: confidence,
            reasoning: "Fallback prediction"
        };

        return { tweet, match, prediction };
    }
}

async function main() {
    const { tweet, match, prediction } = await generatePrediction();

    // Record prediction on blockchain FIRST
    try {
        console.log("📝 Recording prediction on Base blockchain...");
        const txHash = await recordPredictionOnChain(
            match,
            prediction.winner,
            prediction.confidence
        );
        console.log("✅ Blockchain transaction:", txHash);

        // Get current stats
        const accuracy = await getAccuracy();
        const count = await getPredictionCount();
        console.log(`📊 Total predictions: ${count} | Accuracy: ${accuracy}%`);
    } catch (error) {
        console.error("❌ Blockchain recording failed:", error.message);
        console.log("⚠️  Continuing anyway...");
    }

    // Post to Twitter (optional)
    if (client) {
        try {
            await client.v2.tweet(tweet);
            console.log("🐦 AI prediction posted to Twitter!");
        } catch (e) {
            console.log("⚠️  Twitter posting failed (API credits needed or rate limited)");
            console.log("   Error:", e.message);
        }
    } else {
        console.log("ℹ️  Twitter disabled (no API credentials configured)");
    }

    // Always display the prediction
    console.log("\n📱 Prediction Content:");
    console.log("─".repeat(50));
    console.log(tweet);
    console.log("─".repeat(50));
}

main().catch(console.error);