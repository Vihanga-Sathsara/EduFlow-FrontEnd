import axios, { AxiosError } from "axios"
import { refreshTokens } from "./auth"

const api = axios.create({ 
    baseURL: "edu-flow-back-end.vercel.app/api",
})

const PUBLIC_ENDPOINT = ["/auth/register","/auth/google-register", "/auth/login", "/auth/google-login"]

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")

    const isPubliic = PUBLIC_ENDPOINT.some((url) => config.url?.includes(url))

    if( !isPubliic && token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use((response) => {
    return response
},
async (error : AxiosError) => {
    const originalRequest: any = error.config

    if(error.response?.status === 401 && !PUBLIC_ENDPOINT.some(url => originalRequest.url?.includes(url)) && !originalRequest._retry){
        originalRequest._retry = true

        try{
            const refreshToken = localStorage.getItem("refreshToken")
            if(!refreshToken){
                throw new Error("No refresh token available")
            }

            const data = await refreshTokens(refreshToken)
            localStorage.setItem("accessToken", data.accessToken)
           
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

            return axios(originalRequest)
        }catch(err){
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("accessToken")
            window.alert("Session expired. Please log in again.")
            window.location.href = "/login"
            console.error("Token refresh failed:", err)
            return Promise.reject(err)
        }
    }
    return Promise.reject(error)
})
    
export default api

