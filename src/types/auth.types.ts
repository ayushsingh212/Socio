
export interface RegisterPayLoad {
  fullName: string
  email: string
  username:string,
  DOB:string,
  password: string
  gender:string
}
export interface VerifyEmailPayload{
  email:string
  otp:string
}

export interface SendOtpPayload{
  email:string
  purpose:string
}

export interface ForgotPasswordPayload {
  email: string
  method: "email" | "otp"
}

export interface VerifyResetOTPPayload {
  email: string
  otp: string
  purpose:string
}

export interface ResetPasswordPayload {
  newPassword: string
  confirmNewPassword:string

}