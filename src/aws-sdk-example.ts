import { SQS } from "aws-sdk";

async function sqsSend(): Promise<string> {

    try {
        let sqs = new SQS();

        await sqs.sendMessage({
            MessageBody: "Hello",
            QueueUrl: "queue"
        }).promise();

    } catch (err) {
        console.log(err);
        throw err;
    }

    return "Success!";

}

export = sqsSend;