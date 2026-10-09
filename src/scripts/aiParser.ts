import fs from 'fs/promises';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import query from '../config/db.js';
import dotenv from 'dotenv';


dotenv.config();

const ai = new GoogleGenAI();

async function runAIExtraction() {
    try {
        const filePath = path.join(__dirname, '../../');
        const dataBuffer = await fs.readFile(filePath);

        const parser = new PDFParse({ data: dataBuffer });
        const pdfData =  await parser.getText();
        await parser.destroy();

        const rawText = pdfData.text;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    text: `You are a data extraction assistant. 
                    Extract agricultural commodity prices from the following raw text extracted from a Philippine market price PDF report.
                    Return ONLY a valid JSON array of objects. Do not include markdown code blocks (like \`\`\`json) or conversational text.
                    Each object must have these keys:
                    - "period_of": string (e.g "September 28, 2026 - October 4, 2026)
                    - "market": string (e.g "NCR")
                    - "name": string (e.g "Regular Milled Rice")
                    - "specification": string (e.g "20-40% bran streak" IF ANY)
                    - "unit": number (e.g "kg", "pack")
                    - "price": number (e.g "20.00")
                    
                    Raw Text:
                    ${rawText}`
                }
            ]
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("No response received from Gemini.");
        }

        const cleanedJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const commoditiesData = JSON.parse(cleanedJson);

        for (const item of commoditiesData) {
            const commoditiesResult = await query(
                `INSERT INTO commodities (name, specification, unit)
                VALUES ($1, $2, $3)
                ON CONFLICT (name) DO UPDATE SET specification = EXCLUDED.specification
                RETURNING id;`,
                [item.name, item.specification, item.unit]
            );

            const commodityId = commoditiesResult.rows[0].id;

            await query(
                `INSERT INTO price_logs (commodity_id, price, market, period_of)
                VALUES($1, $2, $3, $4);`,
                [commodityId, item.price. item.market, item.period_of]
            );
        }

        console.log("Database seeding completed via AI Agent");
    } catch (error) {
        console.error("Error during AI Seeding:", error);
    }
}

runAIExtraction();