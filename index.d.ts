export declare function verifyPaddleWebhook(
    publicKey: string,
    webhookData: Readonly<Record<string, { toString(): string } | undefined | null>>,
): boolean;
