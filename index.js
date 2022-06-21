const nodemailer = require("nodemailer");
const http2 = require('http2');
const fs = require('fs');
const packageJson = require('./package.json');
const process = require('process');

class MailazyClient {
    /**
     * 
     * @param {type} config
     * @returns {nm$_index.MailazyClient}
     */
    constructor(config) {
        this.config = {...config};
        this.config.apiURL = this.config.apiURL ? this.config.apiURL : 'https://api.mailazy.com';
        this.config.serviceType = this.config.serviceType ? this.config.serviceType : 'API';
        this.config.host = this.config.host ? this.config.host : 'smtp.mailazy.com';
        this.config.port = this.config.port ? this.config.port : 587;
    }
    /**
     * Function to get useragent string from system
     * 
     * @returns {String}
     */
    getUserAgentHeader() {
        return `MailazySDK/${packageJson.name} ${packageJson.version} (lang=node.js;v=${process.versions.node};bit=${process.arch};os=${process.platform})`;
    }
            
    /**	
     * Function to Send Email 
     * 	 
     * @param {type} payload = {
     *      from: "example@domain.com", // required, Use domain you verified
     *      to: "test@example.com", // required, user comma (,) for multiple recipients
     *      cc: "cc@domain.com", // optional, user comma (,) for multiple recipients
     *      bcc: "bcc@domain.com", // optional, user comma (,) for multiple recipients
     *      reply_to: "reply@domain.com", // optional
     *      subject: 'test email from node.js app with attachment', // required
     *      text: 'hello world!', // required
     *      html: '<b>hello world</b>', // required
     *      attachments: [ // optional
     *      {
     *          filename: 'hello.csv',
     *          path: path.join(__dirname, `hello.csv`),
     *          contentType: 'application/octet-stream',
     *      }
     *      ]
     * };
     * 
     * @returns {undefined}
     */
    send(payload) {
        return new Promise((resolve, reject) => {
            const errors = [
                [!payload, 'Payload can not be empty'],
                [!payload.to, 'No mail receiver (property "to" not defined)'],
                [!payload.from, 'No mail sender (property "from" not defined)'],
                [
                    !payload.subject,
                    'No subject, all mails must have subjects (property "subject" not defined)'
                ],
                [
                    !payload.html || !payload.text,
                    'No mail content (Neither the html property nor the text property is set)'
                ]
            ]
                    .filter((error) => error[0])
                    .map((error) => error[1]);

            if (errors.length > 0) {
                reject(new Error('- ' + errors.join('\n- ')));
            }

            const mailOptions = {
                to: payload.to.split(','),
                from: payload.from,
                subject: payload.subject
            };
            if (payload.cc) {
                mailOptions.cc = payload.cc.split(',');
            }
            if (payload.bcc) {
                mailOptions.bcc = payload.bcc.split(',');
            }
            if (this.config.serviceType == "SMTP") {
                mailOptions.text = payload.text;
                mailOptions.html = payload.html;
                if (payload.reply_to) {
                    mailOptions.replyTo = payload.reply_to;
                }
                if (payload.attachments && payload.attachments.length > 0) {
                    mailOptions.attachments = payload.attachments;
                }
                const smtpTransport = nodemailer.createTransport(this.config);
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(JSON.stringify(response));
                    }
                });
            } else {
                if (payload.reply_to) {
                    mailOptions.reply_to = payload.reply_to;
                }
                mailOptions.content = [
                    {
                        type: 'text/plain',
                        value: payload.text
                    },
                    {
                        type: 'text/html',
                        value: payload.html
                    }
                ];
                if (payload.attachments && payload.attachments.length > 0) {
                    mailOptions.attachments = [];
                    payload.attachments.forEach(function (element, index) {
                        mailOptions.attachments[index] = mailOptions.attachments[index] ? mailOptions.attachments[index] : {};
                        mailOptions.attachments[index].file_name = element.filename;
                        mailOptions.attachments[index].type = element.contentType;
                        mailOptions.attachments[index].content = fs.readFileSync(element.path, {encoding: 'base64'});
                    });
                }

                const buffer = Buffer.from(JSON.stringify(mailOptions), 'utf8');

                const req = http2.connect(this.config.apiURL).request({
                    [http2.constants.HTTP2_HEADER_SCHEME]: 'https',
                    [http2.constants.HTTP2_HEADER_METHOD]: http2.constants.HTTP2_METHOD_POST,
                    [http2.constants.HTTP2_HEADER_PATH]: `/v1/mail/send`,
                    'Content-Type': 'application/json',
                    'Content-Length': buffer.length,
                    'X-Api-Key': this.config.auth.user,
                    'X-Api-Secret': this.config.auth.pass,
                    'User-Agent': this.getUserAgentHeader()
                });

                const data = [];
                req.on('data', (chunk) => {
                    data.push(chunk);
                });
                req.once('error', (err) => {
                    reject(err);
                });
                req.write(buffer);
                req.end();
                req.once('end', () => {
                    resolve(Buffer.concat(data).toString('utf8'));
                });
            }
        });
    }
}

module.exports = MailazyClient;