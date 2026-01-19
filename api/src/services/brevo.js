const fetch = require("node-fetch");

const { BREVO_KEY, ENVIRONMENT } = require("../config");

const SENDER_NAME = "Your Name";
const SENDER_NAME_SMS = "Your Name";
const SENDER_EMAIL = "Your Email";

const regexp_exception_staging = /selego\.co/;

const api = async (path, options = {}) => {
  try {
    if (!BREVO_KEY) {
      return;
    }

    const res = await fetch(`https://api.sendinblue.com/v3${path}`, {
      ...options,
      retries: 3,
      retryDelay: 1000,
      retryOn: [502, 503, 504],
      headers: { "api-key": BREVO_KEY, "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const contentType = res.headers.raw()["content-type"];
    if (contentType && contentType.length && contentType[0].includes("application/json")) return await res.json();
    // Sometimes, sendinblue returns a 204 with an empty body
    return true;
  } catch (e) {
    // Error in sendinblue api
  }
};

// https://developers.brevo.com/reference/sendtransacsms
async function sendSMS(phoneNumber, content, tag) {
  try {
    // format phone number for Sendinblue
    const formattedPhoneNumber = phoneNumber
      .replace(/[^0-9]/g, "")
      .replace(/^0([6,7])/, "33$1")
      .replace(/^330/, "33");

    const body = {};
    body.sender = SENDER_NAME_SMS;
    body.recipient = formattedPhoneNumber;
    body.content = content;
    body.type = "transactional";
    body.tag = tag;

    const sms = await api("/transactionalSMS/sms", { method: "POST", body: JSON.stringify(body) });
    if (!sms || sms?.code) {
      // Error sending an SMS
    }
  } catch (e) {
    // Error in sendSMS
  }
}

// https://developers.brevo.com/reference/sendtransacemail
async function sendEmail(to, subject, htmlContent, { params, attachment, cc, bcc } = {}) {
  try {
    const body = {};
    if (ENVIRONMENT !== "production") {
      to = to.filter((e) => e.email.match(regexp_exception_staging));
      if (cc?.length) cc = cc.filter((e) => e.email.match(regexp_exception_staging));
      if (bcc?.length) bcc = bcc.filter((e) => e.email.match(regexp_exception_staging));
    }
    body.to = to;
    if (cc?.length) body.cc = cc;
    if (bcc?.length) body.bcc = bcc;
    body.htmlContent = htmlContent;
    body.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    body.subject = subject;

    if (params) body.params = params;
    if (attachment) body.attachment = attachment;
    const mail = await api("/smtp/email", { method: "POST", body: JSON.stringify(body) });
    if (!mail || mail?.code) {
      // Error sending an email
    }
  } catch (e) {
    // Error in sendEmail
  }
}

// https://developers.brevo.com/reference/sendtransacemail
async function sendTemplate(id, { params, emailTo, cc, bcc, attachment } = {}, { force } = { force: false }) {
  try {
    if (!id) throw new Error("No template id provided");

    const body = { templateId: parseInt(id) };
    if (!force && ENVIRONMENT !== "production") {
      emailTo = emailTo.filter((e) => e.email.match(regexp_exception_staging));
      if (cc?.length) cc = cc.filter((e) => e.email.match(regexp_exception_staging));
      if (bcc?.length) bcc = bcc.filter((e) => e.email.match(regexp_exception_staging));
    }
    if (emailTo) body.to = emailTo;
    if (cc?.length) body.cc = cc;
    if (bcc?.length) body.bcc = bcc;
    if (params) body.params = params;
    if (attachment) body.attachment = attachment;
    const mail = await api("/smtp/email", { method: "POST", body: JSON.stringify(body) });

    if (!mail || mail?.code) {
      return;
    }
    return mail;
  } catch (e) {
    // Error in sendTemplate
  }
}

module.exports = {
  api,
  sendSMS,
  sendEmail,
  sendTemplate,
};
