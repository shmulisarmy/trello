clients = []
messages = []

async def broadcast(message: str):
    for client in clients:
        await client.send_text(message)


async def broadcast_json(message: dict):
    global messages
    if message.get("type") == "message":
        messages.append(message)
    for client in clients:
        client: WebSocket
        await client.send_json(message)
