import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { lead } = await req.json();

    const prompt = `You are a CRM lead scoring expert. Analyze this lead and return ONLY a JSON object, no extra text, no markdown, no backticks.

Lead Details:
- Name: ${lead.name}
- Company: ${lead.company || 'Unknown'}
- Email: ${lead.email || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Source: ${lead.source || 'Unknown'}
- Current Status: ${lead.status}
- Notes: ${lead.notes || 'None'}

Return ONLY this JSON format:
{
  "score": <number 0-100>,
  "priority": "<High | Medium | Low>",
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "recommended_action": "<one clear action to take>"
}`;

    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.choices[0].message.content || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to analyze lead' },
      { status: 500 }
    );
  }
}