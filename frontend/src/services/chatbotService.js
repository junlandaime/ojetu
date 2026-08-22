const CHATBOT_WEBHOOK =
    "https://n8n-6xr7vvprsosz.jkt6.sumopod.my.id/webhook/fitalenta-chat";

export const sendChatMessage = async ({
                                          message,
                                          sessionId,
                                          history,
                                      }) => {
    try {
        const response = await fetch(
            CHATBOT_WEBHOOK,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    Accept:
                        "application/json",
                },
                body: JSON.stringify({
                    message,
                    chatInput: message,
                    question: message,
                    sessionId,
                    history,
                }),
            }
        );

        if (!response.ok) {
            let errorMessage =
                "Gagal menghubungi FITALENTA AI.";

            try {
                const errorData =
                    await response.json();

                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    errorMessage;
            } catch {
                // Response error bukan JSON.
            }

            throw new Error(
                errorMessage
            );
        }

        return await response.json();
    } catch (error) {
        console.error(
            "FITALENTA AI service error:",
            error
        );

        throw error;
    }
};