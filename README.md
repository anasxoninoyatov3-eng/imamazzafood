Mazza Food — Order forwarding helper

This small addition provides a simple Express endpoint that will forward orders submitted from the frontend to a Telegram chat via a bot.

Setup

1. Create a Telegram bot and obtain its token (BotFather). Note the token.
2. Determine the target chat id (where to send orders). This can be your user id or a group id.
3. In the project root, set the environment variables and start the server (Windows PowerShell example):

```powershell
$env:TELEGRAM_BOT_TOKEN = '8521051511:AAGqsWjQ82kecjN6reYPZ3-x3WUGXEb6jlc'
$env:TELEGRAM_CHAT_ID = '8283401187'
npm install
npm start
```
`
Usage

The frontend already tries to POST order objects to `/api/send-order`. When the server receives a POST with body { order }, it will forward a textual summary to the Telegram chat configured above.

Notes

- Make sure the server is reachable from the frontend origin. If you serve the static site by opening `index.html` from the filesystem, consider serving the site from this Express server (it already serves static files from the project root).
- Keep your bot token private. For production, use a secure secrets store or environment management.
