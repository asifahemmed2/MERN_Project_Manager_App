import { useMutation } from "@tanstack/react-query"
import { postData } from "../lib/api"

export const useSignUpMutation = () => {
   return useMutation({
     mutationFn: (data: any) => postData("/auth/sign-up", data)
   })
}