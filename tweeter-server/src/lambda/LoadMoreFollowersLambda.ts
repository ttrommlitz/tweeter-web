import { LoadMoreUserItemsRequest, LoadMoreUserItemsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

exports.handler = async (event: JSON): Promise<LoadMoreUserItemsResponse> => {
  console.log("EVENT: ", event)

  const request: LoadMoreUserItemsRequest = LoadMoreUserItemsRequest.fromJSON(event);
  let response: LoadMoreUserItemsResponse;

  try {
    const [userItems, hasMoreItems] = await new FollowService().loadMoreFollowers(
      request.authToken, request.user, request.pageSize, request.lastItem
    );

    response = new LoadMoreUserItemsResponse(
      userItems, hasMoreItems, true
    );

    return response;
  } catch (error) {
    throw new Error(`[400] ${error}`)
  }
}