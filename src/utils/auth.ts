//Lưu token vào localStorage
export const saveAccesTokenLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
//Xóa token từ localStorage
export const clearAccessTokenFromLS = () => {
  localStorage.removeItem('access_token')
}
//Lấy token từ localStorage
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
