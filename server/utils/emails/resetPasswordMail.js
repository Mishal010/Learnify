export const resetPasswordTemplate = ({
  name,
  resetUrl,
  year = new Date().getFullYear(),
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    /* Reset & Client Fixes */
    body { margin: 0; padding: 0; width: 100%; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; }
    table { border-spacing: 0; border-collapse: collapse; }
    img { border: 0; outline: none; }
    
    /* Typography */
    body, td { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #374151; }
    
    /* Elements */
    .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 60px; }
    .main-table { margin: 0 auto; background-color: #ffffff; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    
    /* Header */
    .brand-stripe { height: 6px; background: linear-gradient(90deg, #4f46e5, #818cf8); width: 100%; }
    .header { padding: 40px 40px 20px 40px; text-align: center; }
    .logo-text { font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin: 0; }
    
    /* Body */
    .content { padding: 20px 40px 40px 40px; }
    h1 { margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #111827; text-align: center; letter-spacing: -0.5px; }
    p { margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; }
    
    /* Button */
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); transition: all 0.2s; }
    .btn:hover { background-color: #4338ca; box-shadow: 0 6px 8px rgba(79, 70, 229, 0.3); }
    
    /* Security Note */
    .security-note { background-color: #f9fafb; border-radius: 8px; padding: 16px; font-size: 14px; color: #6b7280; text-align: center; line-height: 1.5; border: 1px solid #e5e7eb; }

    /* Footer */
    .footer { background-color: #f3f4f6; padding: 0 20px; text-align: center; }
    .footer-text { font-size: 12px; color: #9ca3af; line-height: 1.5; margin-bottom: 8px; }
    .footer a { color: #6b7280; text-decoration: underline; }

    /* Mobile */
    @media only screen and (max-width: 600px) {
      .content, .header { padding: 24px !important; }
      h1 { font-size: 22px !important; }
      .btn { display: block; width: auto; }
    }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation">
    <tr>
      <td align="center">
        <div style="height: 40px;"></div>
        
        <table class="main-table" role="presentation">
          <tr><td class="brand-stripe"></td></tr>
          
          <tr>
            <td class="header">
               <div class="logo-text">Learnify<span style="color:#4f46e5">.</span></div>
            </td>
          </tr>
          
          <tr>
            <td class="content">
              <h1>Reset your password</h1>
              <p>
                Hi ${name}, we received a request to reset the password for your Learnify account. If you made this request, please click the button below.
              </p>
              
              <div class="btn-container">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              
              <div class="security-note">
                <strong>Didn't ask for this?</strong>
                <br>
                You can safely ignore this email. Your password will not change unless you click the button above.
              </div>
            </td>
          </tr>
        </table>
        
        <div style="height: 30px;"></div>
        <div class="footer">
          <p class="footer-text">
            © ${year} Learnify Inc. • All rights reserved.<br>
            <a href="#">Help Center</a> • <a href="#">Privacy Policy</a>
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;
