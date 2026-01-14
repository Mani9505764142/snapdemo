import { ddb } from "./dynamodb";
import {
  PutCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = "SnapDemoAnalytics";

/**
 * Create analytics row only if it does not exist
 */
export async function initAnalytics(videoKey: string) {
  await ddb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        videoKey,
        views: 0,
        completedViews: 0,
        createdAt: Date.now(),
      },
      ConditionExpression: "attribute_not_exists(videoKey)",
    })
  ).catch(() => {
    // Ignore if already exists (expected behavior)
  });
}

/**
 * Increment view count
 */
export async function incrementView(videoKey: string) {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { videoKey },
      UpdateExpression: "ADD #v :inc",
      ExpressionAttributeNames: {
        "#v": "views",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
      },
    })
  );
}

/**
 * Increment completed view count
 */
export async function incrementComplete(videoKey: string) {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { videoKey },
      UpdateExpression: "ADD #c :inc",
      ExpressionAttributeNames: {
        "#c": "completedViews",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
      },
    })
  );
}

/**
 * Read analytics (for Home / Demo page)
 */
export async function getAnalytics(videoKey: string) {
  const res = await ddb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { videoKey },
    })
  );

  return res.Item ?? {
    views: 0,
    completedViews: 0,
  };
}
