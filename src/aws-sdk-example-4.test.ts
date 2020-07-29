// References
// https://jestjs.io/docs/en/mock-functions#mocking-modules - Mocking modules from official Jest documentation

import sqsSend from "./aws-sdk-example";

// Mocks
import aws from "aws-sdk";

jest.mock('aws-sdk');
// Note: Look for a better alternative for mockAws
// Any cast here makes it harder to discover available methods on aws. For now, try directly calling aws to discover methods.
const mockAWS = aws as jest.Mocked<any>

test('send success', async () => {
    const sendMessageMock = jest.fn().mockReturnValue({
        promise: jest.fn()
    });

    const SQSMocked = {
        sendMessage: sendMessageMock,
    };

    mockAWS.SQS = jest.fn(() => SQSMocked)

    let output: String = await sqsSend();
    expect(output).toBe("Success!");
});

test('throw failure', async () => {

    const sendMessageMock = jest.fn().mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('Error sending message'))
    });

    const SQSMocked = {
        sendMessage: sendMessageMock,
    };

    mockAWS.SQS = jest.fn(() => SQSMocked)

    try {
        await sqsSend();
        fail('Test should have thrown exception');
    } catch (err) {
        // Notice: Using toEqual instead of the toBe.
        expect(err).toEqual(new Error('Error sending message'));
    }
});