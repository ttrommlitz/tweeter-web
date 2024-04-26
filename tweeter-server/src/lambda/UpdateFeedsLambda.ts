import { SQSEvent } from "aws-lambda";
import { Status } from "tweeter-shared";
import { FeedDao } from "../dao/FeedDao";

const feedDao = new FeedDao()

exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log('EVENT: ', event)

  for (const record of event.Records) {
    const body = JSON.parse(record.body)
    const followerAliases = body.aliases
    const newStatus = Status.fromJson(JSON.stringify(body.status))

    if (newStatus === null) {
      throw new Error('Failed to parse new status from SQS message: ' + record.body)
    }

    await feedDao.batchWriteFeedStatus(followerAliases, newStatus)
  }
}