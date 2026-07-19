import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI ENDPOINTS
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are StadiumMind, the advanced AI operating system for Lusail Stadium.",
          temperature: 0.7,
          topP: 0.95,
        },
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { history, message, context } = req.body;
      
      const roleStr = context?.role ? `The user's clearing role is ${context.role.toUpperCase()}. ` : "";
      const alertStr = context?.alertsCount ? `There are currently ${context.alertsCount} active safety warnings in the queue. ` : "";
      
      const systemInstruction = `You are StadiumMind, the advanced real-time AI Operating System for Lusail Stadium. 
      Coordinating operations for the FIFA World Cup 2026.
      ${roleStr}${alertStr}
      Be extremely professional, concise, slightly futuristic, and action-oriented. Support fans, stewards, and operators based on their permissions.`;

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction,
        },
        history: history || [],
      });
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[STADIUM_CORE] Intelligence Grid Active on http://localhost:${PORT}`);
  });
}

startServer();
