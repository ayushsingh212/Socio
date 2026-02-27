import api from "@/lib/axios"



export const startMessage = (data:{
  receiver:string,
  message:string,

})=>
    api.post(`/message/start/${data.receiver}`,{
    message:data.message
  })

  export const getAllActveChatRoom = ()=>
    api.post("/message/rooms")
