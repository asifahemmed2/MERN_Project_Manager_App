import { useMutation } from "@tanstack/react-query"
import { postData } from "../lib/api"

export const useSignUpMutation = () => {
   return useMutation({
     mutationFn: (data: { email: string; password: string; name: string }) => postData("/auth/sign-up", data)
   })
}

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string }) => postData("/auth/verify-email", data)
  })
}

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => postData("/auth/sign-in", data)
  })
}