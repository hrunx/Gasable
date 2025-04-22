import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEEP_URL = "https://api.deepseek.com/v1/chat/completions";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const { messages, api_key } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    if (!api_key) {
      throw new Error("API key is required");
    }

    console.log("[DeepSeek] Sending request to DeepSeek API");

    const response = await fetch(DEEP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log("[DeepSeek] Response status:", response.status);
    console.log("[DeepSeek] Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[DeepSeek] API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      throw new Error(`DeepSeek API error (${response.status}): ${errorBody}`);
    }

    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    let result;
    try {
      const data = JSON.parse(responseText);
      result = data.choices[0].message.content;
    } catch (error) {
      console.warn("[DeepSeek] Failed to parse JSON response:", error);
      result = responseText;
    }

    return new Response(
      JSON.stringify({ content: result }),
      { 
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS
        }
      }
    );
  } catch (error) {
    console.error("Error in deepseek-proxy:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...CORS_HEADERS 
        }
      }
    );
  }
});