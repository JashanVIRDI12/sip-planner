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
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages,
            }),
        });

        const raw = await response.text();

        const data = JSON.parse(raw);

        return Response.json({
            result: data.choices?.[0]?.message?.content || "No response from AI",
        });
    } catch (err) {
        return Response.json({ error: "AI processing failed" }, { status: 500 });
    }
}



