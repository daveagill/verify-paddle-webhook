# Verify your Paddle.com Webhooks

[![Travis (.com)](https://img.shields.io/travis/com/daveagill/verify-paddle-webhook?style=flat-square)](https://travis-ci.com/daveagill/verify-paddle-webhook)
[![npm](https://img.shields.io/npm/v/verify-paddle-webhook?style=flat-square)](https://www.npmjs.com/package/verify-paddle-webhook)
[![GitHub](https://img.shields.io/github/license/daveagill/verify-paddle-webhook?style=flat-square)](https://github.com/daveagill/verify-paddle-webhook/blob/master/LICENSE)

Secure your webhooks with ease by validating whether they were really sent by Paddle.com.

> __Important:__ You will need your public key from your Paddle account. [Find your public key.](https://vendors.paddle.com/public-key)

## Install
```
$ npm install verify-paddle-webhook
```

## API
This package consists of one easy-to-use function - `verifyPaddleWebhook` - that checks the `p_signature` of your paddle webhook payloads against the public key of your account:

```js
function verifyPaddleWebhook(publicKey, webhookData)
```

### Arguments:
* __`publicKey`__  `<string>` This string is [your account's public key](https://vendors.paddle.com/public-key).
* __`webhookData`__ `<object>` This is your webhook payload, it should be a Javascript object and it should include the `p_signature` property as sent by Paddle.

## Basic Usage
```js
const {verifyPaddleWebhook} = require('verify-paddle-webhook');

const PUBLIC_KEY =
`-----BEGIN PUBLIC KEY-----
Your public key here
-----END PUBLIC KEY-----`;

function isValid(paddleWebhookData) {
    return verifyPaddleWebhook(PUBLIC_KEY, paddleWebhookData);
}
```

## Examples
### Example: Express.js
```js
const express = require('express');
const {verifyPaddleWebhook} = require('verify-paddle-webhook');

const PUBLIC_KEY =
`-----BEGIN PUBLIC KEY-----
Your public key here
-----END PUBLIC KEY-----`;

const app = express();
app.use(express.urlencoded());

app.post('/webhook', function(req, res) {
    if (verifyPaddleWebhook(PUBLIC_KEY, req.body)) {
        console.log('Webhook is valid!');
        // process the webhook
    }
    res.sendStatus(200);
});

app.listen(80);
```
---

### Example: Using Node.js to parse the request body:
Paddle actually sends the payload in the body of a POST request formatted as a URL-encoded query string:
```
alert_id=1234567890&balance_currency=USD&balance_earnings=321.12&balance_fee=666.33 ...etc...
```

Many high-level frameworks will convert that into a JS object for use with `verifyPaddleWebhook` but if you need to convert it manually then you can use the Node.js [`querystring` module](https://nodejs.org/api/querystring.html) to parse the body:

```js
const querystring = require('querystring');
const {verifyPaddleWebhook} = require('verify-paddle-webhook');

const PUBLIC_KEY =
`-----BEGIN PUBLIC KEY-----
Your public key here
-----END PUBLIC KEY-----`;

function process(body) {
    const webhookData = querystring.parse(body);
    if (verifyPaddleWebhook(PUBLIC_KEY, webhookData)) {
        console.log('Webhook is valid!');
        // process the webhook
    }
}
```
---

### Example: AWS Lambda function / Netlify function (Node.js)
This example works for AWS Lambda and Netlify.

Note: For AWS Lambda this assumes the Lambda function is invoked through AWS API Gateway using proxy integration ([see tutorial](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)).

For more detail see the [Node.js example](#example-using-node.js-to-parse-the-request-body).

```js
const querystring = require('querystring');
const {verifyPaddleWebhook} = require('verify-paddle-webhook');

const PUBLIC_KEY =
`-----BEGIN PUBLIC KEY-----
Your public key here
-----END PUBLIC KEY-----`;

exports.handler = async function(event, context) {
    const webhookData = querystring.parse(event.body);
    if (verifyPaddleWebhook(PUBLIC_KEY, webhookData)) {
        console.log('Webhook is valid!');
        // process the webhook
    }

    return {"statusCode": 200, "body": "OK"};
}
```
