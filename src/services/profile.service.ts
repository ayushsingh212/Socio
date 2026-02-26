import api from "@/lib/axios"
export const getProfile = ()=> {

  api.get("/user/getUser")

}
export const getFollowers = ()=>{

api.get("/userCommunityProfile/:username")
}
export const getFollowing = ()=>{

api.get("/userCommunityProfile/:username")
}

export const getUserPost = ()=>{
  api.get("getReelOfYourId/232")
}