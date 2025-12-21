export const contactMailTemplate = ({
  name,
  email,
  subject = "New contact message",
  message,
  receivedAt = new Date().toLocaleString(),
}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Contact Message</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:24px;background:#f3f4f6}
      .card{max-width:720px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.08)}
      h1{font-size:20px;margin:0 0 12px}
      p{margin:0 0 12px;color:#374151}
      .meta{font-size:13px;color:#6b7280;margin-bottom:12px}
      .message{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb}
      .reply{margin-top:16px}
      a.button{display:inline-block;padding:10px 16px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>New contact message: ${subject}</h1>
      <div class="meta">Received: ${receivedAt}</div>

      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p class="message">${message}</p>

      <div class="reply">
        <a class="button" href="mailto:${email}?subject=Re:${encodeURIComponent(
  subject
)}">Reply to sender</a>
      </div>
    </div>
  </body>
</html>
`;
