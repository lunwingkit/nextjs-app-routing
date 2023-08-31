const GREEN_API_ID_INSTANCE = "7103850231";
const GREEN_API_API_TOKEN_INSTANCE = "17e32526e9cd4359b45d715a087c50ac926e037091994fe2ae";

export async function sendWhatsappMessage(recepientId: string, message: string): Promise<Response> {
    const url = `https://api.green-api.com/waInstance${GREEN_API_ID_INSTANCE}/sendMessage/${GREEN_API_API_TOKEN_INSTANCE}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "chatId": recepientId,
            "message": message,
        }),
    });
    return resp;
}