import { LoadMoreStatusItemsRequest, LoadMoreStatusItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Factory } from "../model/service/Factory";

exports.handler = async (event: JSON): Promise<LoadMoreStatusItemsResponse> => {
  console.log("EVENT: ", event)

  const request: LoadMoreStatusItemsRequest = LoadMoreStatusItemsRequest.fromJSON(event);
  let response: LoadMoreStatusItemsResponse;

  console.log('REQUEST: ', request)

  try {
    const [statusItems, hasMoreItems] = await new StatusService(new Factory()).loadMoreFeedItems(
      request.authToken, request.user, request.pageSize, request.lastItem
    );

    response = new LoadMoreStatusItemsResponse(
      statusItems, hasMoreItems, true
    );

    return response;
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }
}