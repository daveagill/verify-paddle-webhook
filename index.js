const crypto = require('crypto');
const { serialize } = require('php-serialize');

/**
 * Verify a Paddle webhook payload to confirm it was sent by Paddle.
 * 
 * @param {string} publicKey
 * A Paddle public-key
 * @param {Object.<string, string>} webhookData
 * The webhook payload parameters formatted as a JS object
 * @returns {boolean}
 * Returns true when the webhookData is valid for the public key,
 * otherwise returns false.
 */
exports.verifyPaddleWebhook = function(publicKey, webhookData) {
    // extract the signatue from the remainder of the payload
    // the signature actually signs the remainder
    const {p_signature:signature, ...otherProps} = webhookData || {};

    // sort by key (asciibetical)
    // also be sure to convert any numbers into strings
    const sorted = {};
    for (const k of Object.keys(otherProps).sort()) {
        const v = otherProps[k];
        sorted[k] = v == null ? null : v.toString();
    }

    // PHP-style serialization to utf8 format string
    const serialized = serialize(sorted);

    // initialise a Verify instance
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    // verify but don't propagate exceptions,. Any errors (such as a malformed
    // public key) are considered false for our purposes. We are not interested
    // in reporting 'why' the validation failed.
    try {
        return verifier.verify(publicKey, signature, 'base64');
    }
    catch (err) {
        return false;
    }
}
