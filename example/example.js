const MailazyClient = require('./../index');
const path = require("path");

const client = new MailazyClient({
    serviceType: "SMTP", //SMTP,API // Required
    apiURL: "https://api.mailazy.com", //Optional
    host: 'smtp.mailazy.com', //Optional
    port: 587, //Optional
    auth: {
        user: '___mailazy_access_key___',
        pass: '___mailazy_access_secret___'
    }
    //... any other options that support from nodemailer library
});

const fn = async () => {
    try {
        const resp = await client.send({
           from: "example@domain.com", // required, Use domain you verified
           to: "test@example.com", // required, user comma (,) for multiple recipients
           cc: "cc@domain.com", // optional, user comma (,) for multiple recipients
           bcc: "bcc@domain.com", // optional, user comma (,) for multiple recipients
           reply_to: "reply@domain.com", // optional
           subject: 'test email from node.js app with attachment', // required
           text: 'hello world!', // required
           html: '<b>hello world</b>', // required
           attachments: [ // optional
           {
               filename: 'hello.csv',
               path: path.join(__dirname, `hello.csv`),
               contentType: 'application/octet-stream'
           }
           ]
      });
        console.log('resp: ' + resp);
    } catch (e) {
        console.log('error: ' + e);
    }
};
fn();