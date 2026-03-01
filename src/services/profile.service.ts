import api from "@/lib/axios"
export const getUserProfile = (username:string)=> 

  api.get(`/community/userCommunityProfile/${username}`)


export const getFollowersCount = (userId:string)=>

api.get(`/user/getFollowerCount/${userId}`)

export const getFollowing = (userId:string)=>

  api.get(`/user/getFollowingCount/${userId}`)


export const getUserPosts = ()=>
  api.get("/getReelOfYourId/232")

export const toggleFollow = (channelId: string) =>
  api.put(`/user/followCreator/${channelId}`)

export const getFollowSuggestions = ()=>
  api.get("/user/getFollowSuggestions")

