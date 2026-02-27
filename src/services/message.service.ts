import api from "@/lib/axios"



export const startMessage = (data:{
  receiver:string,
  message:string,

})=>
    api.post(`/message/start/${data.receiver}`,{
    message:data.message
  })

  export const getAllActveChatRoom = ()=>
    api.get("/message/rooms")

  export const getMessages = (roomId:string)=>
    api.get(`/message/messages/${roomId}`)