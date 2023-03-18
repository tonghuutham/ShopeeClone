import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

//register
export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)

//login
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)

//logout

export const logout = () => http.post('/logout')
