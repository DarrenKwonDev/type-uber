import Twilio from "twilio";

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// 일반 메세지 보내기
export const sendSMS = (to: string, body: string): Promise<any> => {
  return twilioClient.messages.create({ from: process.env.TWILIO_PHONE, to, body });
};

// 인증을 위한 key보내기
export const sendVerificationSMS = (to: string, key: string): Promise<any> => sendSMS(to, `Your verificatino key is ${key}`);
