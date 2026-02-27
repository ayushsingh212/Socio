import { getProfile } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import { useEffect } from "react"

export const useAuthBootstrap = () => {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile()
        setUser({user:res.data,isLoading:true})
      } catch {
        setUser(null)
      } 
    }

    fetchUser()
  }, [setUser])
}