import sqsSend from "./aws-sdk-example";

jest.mock('aws-sdk', () => {
    const SQSMocked = {
        sendMessage: jest.fn().mockReturnThis(),
        promise: jest.fn()
    };
    return {
        SQS: jest.fn(() => SQSMocked)
    };
});

test('send success', async () => {
    let output: String = await sqsSend();
    expect(output).toBe("Success!");
});