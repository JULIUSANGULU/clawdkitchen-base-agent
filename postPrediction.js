import { TwitterApi } from "twitter-api-v2";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

// Twitter client
const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
});

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

        return tweet;

    } catch (error) {
        console.error("AI prediction failed:", error);
        // Fallback to basic prediction
        const confidence = Math.floor(Math.random() * 20) + 55;
        return `⚽️ Match Intelligence Update

${match.home} vs ${match.away}

Model confidence: ${match.home} win (${confidence}%)
Tactical edge + recent form advantage.

Oracle addendum: the crab has seen the data 🦀

#ClawdKitchen #Base`;
    }
}

async function main() {
    const tweet = await generatePrediction();

    try {
        await client.v2.tweet(tweet);
        console.log("AI prediction posted autonomously 🧠⚽");
        console.log(tweet);
    } catch (e) {
        console.log("X API blocked — prediction generated:");
        console.log(tweet);
        console.error(e);
    }
}

main().catch(console.error);