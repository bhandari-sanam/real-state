import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};

export const agentPageLoader = async () => {
  const response = await apiRequest.get("/users");
  return response.data;
};

export const agentDetailPageLoader = async ({ params }) => {
  const agentResponse = await apiRequest.get(`/users/${params.id}`);
  return {
    agent: agentResponse.data.user,
    posts: agentResponse.data.posts,
  };
};

