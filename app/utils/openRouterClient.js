export async function fetchAIResponse(messages) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: messages,
        }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI";
}
