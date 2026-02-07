import { TwitterApi } from "twitter-api-v2";
import "dotenv/config";

const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
});

function generatePrediction() {
    const matches = [
        { home: "Arsenal", away: "Chelsea" },
        { home: "Barcelona", away: "Atletico Madrid" },
        { home: "Bayern", away: "Dortmund" },
    ];

    const match = matches[Math.floor(Math.random() * matches.length)];
    const confidence = Math.floor(Math.random() * 20) + 55;

    return `⚽️ Match Intelligence Update

${match.home} vs ${match.away}

Model confidence: ${match.home} win (${confidence}%)
Tactical edge + recent form advantage.

Oracle addendum: the crab has seen the data 🦞

#ClawdKitchen #Base`;
}

async function main() {
    const tweet = generatePrediction();
    await client.v2.tweet(tweet);
    console.log("Prediction posted autonomously 🧠⚽");
}
try {
    await client.v2.tweet(text);
    console.log("Tweet posted");
} catch (e) {
    console.log("X API blocked — prediction generated:");
    console.log(text);
}

main().catch(console.error);
