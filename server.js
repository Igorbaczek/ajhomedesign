import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("Chat server draait.");
});

app.post("/api/chat-site", async (req, res) => {
  try {
    const {
      message,
      messages = [],
      pageTitle = "",
      pageUrl = "",
      pageContent = ""
    } = req.body;

    const safeMessages = Array.isArray(messages)
      ? messages
          .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-10)
      : [];

    const conversationText = safeMessages
      .map(m => `${m.role === "user" ? "Bezoeker" : "Assistent"}: ${m.content}`)
      .join("\n");

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content:
            "Je bent een vriendelijke en professionele website-chatbot. " +
            "Antwoord altijd in het Nederlands. " +
            "Gebruik vooral de meegegeven website-inhoud om vragen te beantwoorden. " +
            "Als iets niet op de pagina staat, zeg dat eerlijk. " +
            "Verzin geen prijzen, openingstijden of voorwaarden."
        },
        {
          role: "user",
          content:
            `Paginatitel: ${pageTitle}\n` +
            `Pagina URL: ${pageUrl}\n\n` +
            `Website-inhoud:\n${pageContent}\n\n` +
            `Vorige chat:\n${conversationText}\n\n` +
            `Nieuwe vraag:\n${message}`
        }
      ]
    });

    res.json({
      reply: response.output_text || "Sorry, ik kon geen antwoord genereren."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Er ging iets mis op de server."
    });
  }
});

app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});
