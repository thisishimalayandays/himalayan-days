
export async function sendTelegramNotification(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsEnv = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatIdsEnv) {
        console.warn("Telegram notification skipped: Missing env vars");
        return;
    }

    // Support multiple chat IDs separated by comma
    const chatIds = chatIdsEnv.split(',').map(id => id.trim()).filter(id => id.length > 0);

    for (const chatId of chatIds) {
        try {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Telegram API Error for chat ${chatId}:`, errorData);
            }
        } catch (error) {
            console.error(`Failed to send Telegram notification to ${chatId}:`, error);
        }
    }
}

export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
