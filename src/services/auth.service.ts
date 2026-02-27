import api from "@/lib/axios"
import { RegisterPayLoad, SendOtpPayload, VerifyEmailPayload, ForgotPasswordPayload, VerifyResetOTPPayload, ResetPasswordPayload } from "@/types/auth.types"

export const login = (data: {
  identifier: string
  password: string
}) => api.post("/auth/login", data)

export const register = (data:RegisterPayLoad ) => api.post("/auth/register", data)

export const getProfile = () =>
  api.get("/user/getUser",{
    withCredentials:true
  })

export const verifyRegisterEmail = (data:VerifyEmailPayload)=>{
  api.post("/auth/verifyRegisterEmail",data)
}
export const sendOtp = (data:SendOtpPayload)=>{
  api.post(`auth/sendOtp/${data.purpose}`,data)
}

export const forgotPassword = (data: ForgotPasswordPayload) => 
  api.post("/auth/forgot-password", data)

export const resetPasswordLink = (data:{email:string})=>{

  api.post("/auth/resetLink",data)
}

export const verifyResetOTP = (data: VerifyResetOTPPayload) => 
  api.post("/auth/verifyOtp", data)

export const resetPasswordOtp = (data: ResetPasswordPayload) => 
  api.post("/auth/changePasswordViaOtp", data)