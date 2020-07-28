// References 
// https://stackoverflow.com/questions/51215750/typescript-errors-when-using-jest-mocks/51251369 - Typecasting for Mock Implemenation
// https://stackoverflow.com/questions/57585620/how-to-mock-aws-sqs-call-for-unit-testing - Another example
// https://jestjs.io/docs/en/mock-function-api#mockfnmockrejectedvaluevalue- Throw an error, using mock reject value
// https://stackoverflow.com/questions/56496998/how-to-restore-a-mock-created-with-jest-mock - Restoring original mock, information
// https://github.com/facebook/jest/issues/5143 - Restoring all mocks

import sqsSend from "./aws-sdk-example";

// Mocks
import { SQS } from "aws-sdk";
jest.mock('aws-sdk', () => {
    const SQSMocked = {
        sendMessage: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    return {
        SQS: jest.fn(() => SQSMocked)
    };
});
let mockSQS = new SQS(); // as unknown as jest.Mock<SQS>;

test('send success', async () => {
    (mockSQS.sendMessage().promise as jest.MockedFunction<any>).mockResolvedValueOnce(jest.fn());
    let output: String = await sqsSend();
    expect(output).toBe("Success!");
});

test('throw failure', async () => {
    (mockSQS.sendMessage().promise as jest.MockedFunction<any>).mockRejectedValueOnce(new Error('Error sending message'));
    try {
        await sqsSend();
        fail('Test should have thrown exception');
    } catch (err) {
        // Notice: Using toEqual instead of the toBe.
        expect(err).toEqual(new Error('Error sending message'));
    }
});