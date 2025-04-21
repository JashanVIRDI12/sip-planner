export async function fetchAIResponse(messages) {
    try {
        const response = await fetch("/api/ai-suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages }),
        });

        const data = await response.json();
        return data.result || "No response from AI";
    } catch (error) {
        return "AI is currently unavailable. Please try again later.";
    }
}


