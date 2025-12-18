export const welcomeTemplate = ({
  name,
  ctaUrl = "#",
  helpUrl = "#",
  year = new Date().getFullYear(),
}) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Welcome to Learnify</title>
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body{ margin:0; padding:0; width:100% !important; font-family:'Helvetica Neue',Arial,sans-serif; background-color:#f4f8fc; color:#2f3a45; }

    .container{ max-width:640px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,0.08); }
    .header{ background:linear-gradient(90deg,#e3f2fd,#bbdefb); padding:30px; text-align:center; }
    .header svg{ width:56px; height:56px; margin-bottom:10px; }
    .brand{ font-size:22px; font-weight:700; color:#0b3b57; margin:0; }

    .body{ padding:30px; }
    h1{ font-size:22px; margin:0 0 10px 0; color:#0b3b57; }
    p{ margin:0 0 14px 0; font-size:15px; line-height:1.6; color:#455a64; }

    .cta{ display:inline-block; margin-top:20px; padding:12px 22px; background:linear-gradient(180deg,#2196f3,#1976d2); color:#fff; text-decoration:none; font-weight:600; border-radius:8px; box-shadow:0 4px 12px rgba(33,150,243,0.25); }
    .cta:hover{ background:#1e88e5; }

    .footer{ padding:22px; background:#f9fbfe; text-align:center; font-size:13px; color:#78909c; border-top:1px solid #e1ebf5; }
    a{ color:#1b81d6; text-decoration:none; }

    @media(max-width:480px){
      .body, .header, .footer{ padding:18px; }
      h1{ font-size:20px; }
    }
  </style>
</head>
<body>
  <div style="padding:26px;background-color:#f4f8fc;">
    <div class="container">
      <div class="header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <rect x="8" y="16" width="48" height="32" rx="6" fill="#E8F6FF"/>
          <path d="M32 8L8 20L32 32L56 20L32 8Z" fill="#2196F3"/>
          <path d="M20 36H44V40H20Z" fill="#1B81D6"/>
        </svg>
        <p class="brand">Learnify</p>
      </div>

      <div class="body">
        <h1>Welcome to Learnify, ${name} 🎉</h1>
        <p>We’re thrilled to have you on board! Learnify is your space to explore courses, grow your skills, and connect with mentors.</p>
        <p>Let’s get your journey started — set up your profile, choose a course, and start learning today.</p>

        <a href="${ctaUrl}" class="cta">Get Started</a>

        <p style="margin-top:24px;">If you didn’t create this account, please ignore this message.</p>
        <p style="margin-top:12px;font-size:14px;color:#90a4ae;">Need help? Visit our <a href="${helpUrl}">Help Center</a>.</p>
      </div>

      <div class="footer">
        <p>© ${year} Learnify. All rights reserved.</p>
        <p>You received this email because you signed up on Learnify.</p>
        <p><a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;
