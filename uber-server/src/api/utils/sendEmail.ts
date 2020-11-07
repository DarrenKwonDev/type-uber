import Mailgun from "mailgun-js";

var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgunClient = new Mailgun({ apiKey: API_KEY as string, domain: DOMAIN as string });

export const sendEmail = (to: string = "anatomy1545@gmail.com", subject: string, html: string) => {
  // 무료 계정이기 때문에 자기 자신에게만 보낼 수 있다. (in sandbox)
  if (to !== "anatomy1545@gmail.com") {
    throw new Error("since current mailgun account is free account, You can only send email to 'anatomy1545@gmail.com'");
  }

  // @types/mailgun-js에서 정한 타이핑대로 작성
  const data: Mailgun.messages.SendData = {
    from: "anatomy1545@gmail.com",
    to,
    subject,
    html,
  };

  // 발송
  return mailgunClient.messages().send(data, function (error, body) {
    if (error) {
      console.log("error on sending email");
      console.log(error.message);
    }
  });
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello ${fullName}! please verify your email`;
  const emailHtml = `Click to verify your email <a href="https://corp.edupopkorn.com/verification/${key}/">here</a>`;

  return sendEmail("anatomy1545@gmail.com", emailSubject, emailHtml);
};
