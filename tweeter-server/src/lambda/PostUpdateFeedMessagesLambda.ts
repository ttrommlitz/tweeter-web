import { SQSEvent } from "aws-lambda";
import { Status } from "tweeter-shared";
import { FollowsDao } from "../dao/FollowsDao";
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

const followsDao = new FollowsDao()
const client = new SQSClient()


exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log('EVENT: ', event)

  for (const record of event.Records) {
    const newStatus = Status.fromJson(record.body)

    if (newStatus === null) {
      throw new Error('Failed to parse new status from SQS message: ' + record.body)
    }
    
    let hasMorePages = true
    let lastFollowerAlias: string | undefined = undefined

    while (hasMorePages) {
      const page = await followsDao.getPageOfFollowers(newStatus.user.alias, 100, lastFollowerAlias)
      const followerAliases = page.items.map(follow => follow.follower_handle)
      
      const params: SendMessageCommandInput = {
        MessageBody: JSON.stringify({ aliases: followerAliases, status: newStatus }),
        QueueUrl: process.env.UPDATE_FEEDS_QUEUE_URL
      }

      await client.send(new SendMessageCommand(params))

      hasMorePages = page.hasMorePages
      lastFollowerAlias = page.items.length > 0 ? page.items[page.items.length - 1].follower_handle : undefined
    }
  }
}