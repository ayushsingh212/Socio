import api from "@/lib/axios"

export const getPosts = () =>
  api.get("/posts")

export const createPost = (data: FormData) =>
  api.post("/posts", data)

export const likePost = (id: string) =>
  api.post(`/posts/${id}/like`)