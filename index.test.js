const { verifyPaddleWebhook } = require('./index');

//
// --- BEGIN TEST DATA ---
//

const payload = {
    event_time: '2020-04-21 00:00:00',
    alert_id: '1534261303',
    alert_name: 'subscription_created',
    user_id: '3',
    email: 'somebody@acme.org',
    checkout_id: '1-aaaaaaaaaaaaaaa-bbbbbbbbbb',
    subscription_id: '1',
    subscription_plan_id: '3',
    currency: 'USD',
    linked_subscriptions: '1, 1, 6',
    marketing_consent: '',
    next_bill_date: '2020-05-10',
    passthrough: 'Example String',
    quantity: '12',
    source: 'Trial',
    status: 'active',
    unit_price: 'unit_price',
    cancel_url: 'https://checkout.paddle.com/subscription/cancel?user=1&subscription=1&hash=123',
    update_url: 'https://checkout.paddle.com/subscription/update?user=3&subscription=1&hash=321'
};

// key/signature pairing
const pair1 = {
    publicKey:
`-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA5q+Fu1JHdk/kpvG6WZOt
aoxJbUtiwwL4NhsN7DSRhBDEYWfwJTC8DdGLIzo77A7ISaOu6kNsZtN3rHE3VkUJ
1w01my+8Jo/TxQGEC3pQ+l7C6jWaa/DnkY+FznbCitoQU7J68mSgpmbiQ8W7992a
9oKn22y0hJ6g4e+GIH509fjbSRMIJ0hHa1aEPNbc4skYEWxG8y6mnTnexGORjHZQ
9aKrhlpHtYA2e7V7eEklzgB/0QgVEREs8j469JDXBIqGJXHvUj4+c4UtQNZ1tZgY
xhSZFAv0W5Z/SXEdOMNpnTqVGT3B+APDbQtPbelY2fOhJwFsdKXcpWY1tnCJKOXy
lOpEqfSQzho8UrVUDdBy2qnermxkVhyaEJ8JryjRBJpbx1M7+MleoM/W5WFrxzZi
4mra7iYI9KFIJtnKpGn65AOQW/83Nz5yuAy8WbL+sOno86SRVX7GdAAGtbMtRzao
4BpRBxBsG5q9qTKRTFOfSPdYRx4psHDAlJh04IrL1m/kCo0VN1ktkGZOYIhEFR7t
rOOxoHASft3mHgPstWhdznb1plXsfRbXt3FXg0ZWCDWyumQs4QfqHuZCP18tVrwa
Y1AewwZq4IN/yF9DWulwHTFCwT+YQGJ06Z/71708pKosbBAv2saT+lhlh1QiB1QR
gMqeNmaDiG4+EO1PxzgSU6sCAwEAAQ==
-----END PUBLIC KEY-----`,

    privateSignature: '0WhzrGkxflc9GQrsNNw7p9WspiTsUAOfGPgDKVr/KtVcu1KQUIbQn0GuPa1S8TVF8vMhtP4BjltIRIYqjbP+6sczAkpMcs8/Q4c/Uzope+xXkqORdSeFCkO13gGWIuB//quai27L/rmZZi1dzmeq/MvPqNnPUIKYtyKyVATYQR/t5p3VqFhs38jYtJJj3RRiMGedxI4KcXQyeL+W5857DG+fbS65jRc5o/72wAmteyLINgBAQkC9Babs7YA/j4ekWZTrJ1lgklTV73pB/PlxJxGkj78dqn5dXZ1u/WigvLIQLywL7QaoBPAqNDwUPqDvvHFW4d9IXV1C26cI1MQQQ6Hen/0njupWL9+eXgPyjedMbdAZ5bEcuBY7nNtDoPKgI2JwSgpNm8WniI8Pw1OBQ4SWl+wcdJfh531Q6WgPHH+1h2r+sopAnk8mwkz6er5XSjNWzj6QB/hjhrca2CHCkEcz+rSybOM/v2e1COW67tFHZUR3ksQznqBdpS7Fkfcz7sJVpNAfMXTAsZeZ1HpN+1sF+tLExoFl8u/eso8ThRR3N+QHCXTW2iTTzagdMiCiAkMnmLGQLj03F2NBvmPqEOiwN1ml7dcmHwn86pFBSNzIWPPsFURkUKjY4oO1y0iU2C6XWNTY8Nwax2b8bl+w9Gb7zwTozVGhTtil9TzEwbc='
};

// key/signature pairing
const pair2 = {
    publicKey:
`-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvO3cy4xPF0zWxg7eBfr6
FkfYRVl9dOs/Jb+fFCBl8jPcNtJSRVVDn5gCIgzLJ6N2AKatuUH1B/prWK/VJIth
GBVNEFCNo9ZY71K/rS5Mo/ide/3HBAigwO2aZNFn3mgolT6rZ6+yp5z+ye2jNjoX
a4akCLasKne0121+OWvzK0T9ec9yvpsUi4tIIlnGkNdh7u5ngmNE8R4Mq5ch9Hry
CU6WFLC8y8xnu7Q8Oc1Z8XfdyebXXT66h0WeSiBTu50xwY2z9YeWYoWqFxQe8JGD
P8AWhYNguJcPRr8/EGCG/kBKrABHJa6YuZffKzHbBqJ1F6gCLNpMalsfzGFDLzSz
6V9X74eKQxYnxmdlhGf7OE2oANP5xWYFQZnlCUdswROb4PXtKNfBAjs/2mrpLDsy
kE8DZK92klCmTue/ydRnBfJ2ogYLF7T3+dzwzQIghTtmDLKmEcew1nmaSt7zf079
MayxcP0rQYPdEoQFDnT3P5DySTeLokZk0kr+/a/iQf9TSpTzfbA4rLcruD31jlQz
Pg9b9RonvNarZEzk8cJA3P28nQ8BrEPQDnEslSzfONniHvR8hYB9ZE7Tjzap0O2P
SCXn61281fWurgndmXnnpi4+erAnFsy/xTuIUrobQfEC5PrP0syH2GRTAm/EErEA
BGficWhIyugKT2PpSKKxkG0CAwEAAQ==
-----END PUBLIC KEY-----`,

    privateSignature: 'fjSUyhmASjlCTXFxGo05xqr80dBKxgIyUa8wKf/374/lo7PPTw3Sny+DgbmWoQYDAuS/WF9Ky6GfegFQgTXYoCoWoeKlGhBWPIsOLqHLrK/NwR710de2XH3SGwYTDMq2RTlKLuc7Z6f4ccMH69LjrLPe0sj1YTpWK2Z0S11EoX30H9ImzMwBgqNxLREUJbcxmNbGjqQIudpAierXWSGWwRXZy5vGZ0jDhxxZ2kAFjo7BN9bNVizvADMjZhfh8Lgf0u4BQPbBK1kyG1Ea/+zhToyGPEOTeFEIpC6KGfNpDQCwRGnmm/E+wg+hzmBi07Guk6CbvWq7x1kUglkra8tt/aZ1GoJRQGeovL26JlCop75clsdbTSva/VeFZiKrEuMJbVqxKd7mEiy6BxIuwMSzUvwDed58glidjLJ4SFPkXjpEpAY20+NJ68y2NjyQjrR6bp+FupwkbHmE1Es2+Kn5qvBzVh8Re2ZpSDRJMFxtKX166VpfNtW4KiW/SNRl1Ip3I75Y/as+3CU/3xBkfSJQTHhIf/i+AjraugVCqjLKbVs/KvGQzesKfimKhh7FEGGgrQZeMOTzrScftkaA9IH6vlyuKv1fzuwvDYey9hk7RNcIIDjVeKOleU+FNVQeKm2UHlJ1IWwYjFSNvg1qmqck9eYIxit863UnrWBwGSzKfEA='
};

// key/signature pairing (malformed)
const malformedPair = {
    publicKey: 'some malformed key',
    privateSignature: 'some malformed signature'
};

// key/signature pairing (nulls)
const nullPair = {
    publicKey: null,
    privateSignature: null
};

//
// --- END TEST DATA ---
//


describe.each([
    // when                         publicKey      privateSig     expect
    [ 'key and signature match #1', pair1        , pair1        , true  ],
    [ 'key and signature match #2', pair2        , pair2        , true  ],
    [ 'key and signature mismatch', pair1        , pair2        , false ],
    [ 'publicKey is malformed'    , malformedPair, pair1        , false ],
    [ 'publicKey is null'         , nullPair     , pair1        , false ],
    [ 'p_signature is malformed'  , pair1        , malformedPair, false ],
    [ 'p_signature is null'       , pair1        , nullPair     , false ],

])('verifyPaddleWebhook', (when, {publicKey}, {privateSignature}, expected) => {
    test(`should return ${expected} when ${when}`, () => {
        const signedPayload = {
            ...payload,
            p_signature: privateSignature
        };

        const result = verifyPaddleWebhook(publicKey, signedPayload);
        expect(result).toBe(expected);
    });
});

describe('verifyPaddleWebhook', () => {
    test(`should return false for null arguments`, () => {
        const result = verifyPaddleWebhook(null, null);
        expect(result).toBe(false);
    });

    test(`should return false for undefined arguments`, () => {
        const result = verifyPaddleWebhook();
        expect(result).toBe(false);
    });
});