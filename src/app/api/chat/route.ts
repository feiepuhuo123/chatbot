import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V2.5",
      messages: [
        { role: "user", content: message }
      ],
    });

    return NextResponse.json({ 
      reply: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error calling SiliconFlow API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 