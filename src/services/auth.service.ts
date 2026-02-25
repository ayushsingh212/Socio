import api from "@/lib/axios"
import { RegisterPayLoad, SendOtpPayload, VerifyEmailPayload } from "@/types/auth.types"

export const login = (data: {
  email: string
  password: string
}) => api.post("/auth/login", data)

export const register = (data:RegisterPayLoad ) => api.post("/auth/register", data)

export const getProfile = () =>
  api.get("/auth/me")

export const verifyRegisterEmail = (data:VerifyEmailPayload)=>{
  api.post("/auth/verifyRegisterEmail",data)
}
export const sendOtp = (data:SendOtpPayload)=>{
  api.post(`auth/sendOtp/${data.purpose}`,data)
}