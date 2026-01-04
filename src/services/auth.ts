import api from "./api"

export const register = async (email: string, password: string) => {
    const res = await api.post("/auth/register", { email, password })
    return res.data
}

export const googleRegister = async (email: string) => {
    const res = await api.post("/auth/google-register", { email })
    return res.data
}

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password })
    return res.data
}

export const refreshTokens = async (refreshToken: string) => {
    const res = await api.post("/auth/refresh", { token:refreshToken })
    return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const gmailLogin = async (email: string) => {
    const res = await api.post("/auth/google-login", { email })
    return res.data
}

export const resetPassword = async (email: string) => {
    const res = await api.post("/auth/reset-password", { email })
    return res.data
}

export const verifyOtp = async ( otp: string, token: string ) => {
    const res = await api.post("/auth/verify-otp", { otp, token })
    return res.data
}

export const updateNewPassword = async (email: string, newPassword: string) => {
    const res = await api.post("/auth/update-password", { email, newPassword })
    return res.data
}

export const updateProfile  = async (email: string, currentPassword: string, newPassword: string) => {
    const res = await api.post("/auth/update-profile", { email, currentPassword, newPassword })
    return res.data
}

export const getAllUsers = async () => {
    const res = await api.get("/auth/get-all-users")
    return res.data
}
