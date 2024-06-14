import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";
import OpenAI from "openai"; // Default import
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseFunction() {
  const response = await axios.get("https://tengrinews.kz/news/");
  const html = response.data;
  const $ = cheerio.load(html);

  cron.schedule("* * * * *", async () => {
    console.log("Latest 20 news Summary (updated every minute): ");
    const newsList = $(".content_main_item");
    let combinedText = "";

    for (let i = 0; i < newsList.length && i < 20; i++) {
      const news = newsList[i];
      const title = $(news)
        .find(".content_main_item_title")
        .text()
        .replace("\n", "")
        .trim();
      const description = $(news).find(".content_main_item_announce").text();
      combinedText += `${title}: ${description}\n`;
    }

    const summary = await getSummary(combinedText);
    console.log("Summary: ", summary);
  });
}

async function getSummary(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Given the following news. Combine and create a story up to 100-150 words.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing text: ", error);
    return "Error summarizing text.";
  }
}
