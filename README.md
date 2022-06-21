# NodeJS SMTP Email API SDK

> Mailazy NodeJs SDK Client

## Table of Contents

- [Install](#install)
  - [Prerequisites](#prerequisites)
  - [Generate Access Keys](#generate-access-keys)
  - [Install Package](#install-package)
- [Usage](#usage)
  - [Email API](#email-api)
  - [SMTP](#smtp)
- [License](#license)

## Install

### Prerequisites

- Node.js version >= 10
- Mailazy account, [sign up for free](https://app.mailazy.com/signup?source=mailazy-node).

### Generate Access Keys

You need a sender/domain authenticated account in order to generate Access Keys from the [Mailazy Console](https://app.mailazy.com/dashboard)

### Install Package

[npm][]:

```sh
npm install mailazy
```

[yarn][]:

```sh
yarn add mailazy
```

## Usage

### Email API

```js
const MailazyClient = require('mailazy');
const client = new MailazyClient({
    serviceType: "API", //SMTP,API
    auth: {
        user: '___mailazy_access_key___',
        pass: '___mailazy_access_secret___'
    }
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
```

### SMTP

```js
const MailazyClient = require('mailazy');
const client = new MailazyClient({
    serviceType: "SMTP", //SMTP,API
    auth: {
        user: '___mailazy_access_key___',
        pass: '___mailazy_access_secret___'
    }
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
```

## License

[MIT](LICENSE) © Mailazy

##

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
