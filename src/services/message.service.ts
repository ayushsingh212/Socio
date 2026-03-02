import api from "@/lib/axios"



export const startMessage = (data:{
  receiver:string,
 

})=>
    api.post(`/message/start/${data.receiver}`)

  export const getAllActveChatRoom = ()=>
    api.get("/message/rooms")

  export const getMessages = (roomId:string)=>
    api.get(`/message/messages/${roomId}`)

  export const searchUsersForDM = (query:string)=>
    api.get(`/message/dmSearch?search=${query}`)