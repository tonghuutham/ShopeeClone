import { User } from 'src/types/user.type'

//Lưu token vào localStorage
export const setAccessTokenLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
//Xóa token từ localStorage
export const clearLS = () => {
  localStorage.removeItem('access_token') // clear access_token
  localStorage.removeItem('profile') // clear profile
}
//Lấy token từ localStorage
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

// Profile

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
