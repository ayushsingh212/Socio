
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