// References
// https://stackoverflow.com/questions/48790927/how-to-change-mock-implementation-on-a-per-single-test-basis-jestjs - Option 2, jest.doMock(...)
// More info on doMock(...) - https://jestjs.io/docs/en/jest-object.html#jestdomockmodulename-factory-options
// https://mariusschulz.com/blog/dynamic-import-expressions-in-typescript - Await operator with Dynamic imports

beforeEach(() => {
    jest.resetModules();
});


test('send success', async () => {
    jest.doMock('aws-sdk', () => {
        const SQSMocked = {
            sendMessage: jest.fn().mockReturnThis(),
            promise: jest.fn()
        };
        return {
            SQS: jest.fn(() => SQSMocked)
        };
    });

    // Dynamic import
    let sqsSend = await import('./aws-sdk-example');

    let output: String = await sqsSend.default();
    expect(output).toBe('Success!');
});

test('throw failure', async () => {
    jest.doMock('aws-sdk', () => {
        const SQSMocked = {
            sendMessage: jest.fn().mockReturnThis(),
            promise: () => { throw new Error('Error sending message'); }
        };
        return {
            SQS: jest.fn(() => SQSMocked)
        };
    });

    // Dynamic import
    let sqsSend = await import('./aws-sdk-example');

    try {
        await sqsSend.default();
        fail('Test should have thrown exception');
    } catch (err) {
        // Notice: Using toEqual instead of the toBe.
        expect(err).toEqual(new Error('Error sending message'));
    }
});