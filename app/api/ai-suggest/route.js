export async function POST(req) {
    try {
        const { messages } = await req.json();

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free",
                messages,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("AI error:", data.error.message);
            return Response.json({ result: `⚠️ ${data.error.message}` });
        }

        const message = data?.choices?.[0]?.message?.content;

        if (!message) {
            console.error("AI response malformed:", data);
            return Response.json({ result: "AI did not return a suggestion." });
        }

        return Response.json({ result: message });
    } catch (err) {
        console.error("AI call failed:", err);
        return Response.json({ error: "AI processing failed" }, { status: 500 });
    }
}




