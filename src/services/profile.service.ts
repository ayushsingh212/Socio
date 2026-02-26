import api from "@/lib/axios"
export const getUserProfile = (username:string)=> 

  api.get(`/community/userCommunityProfile/${username}`)


export const getFollowers = ()=>

api.get("/userCommunityProfile/:username")

export const getFollowing = (username:string)=>

  api.get(`/userCommunityProfile/${username}`)


export const getUserPosts = ()=>
  api.get("getReelOfYourId/232")

