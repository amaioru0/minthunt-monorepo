import { ApiConfig, DEFAULT_API_CONFIG } from "./api/api-config";
import { TokenRefreshRequest, applyAuthTokenInterceptor } from 'react-native-axios-jwt'
import axios from 'axios'

// import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'react-native-axios-jwt'

const config = DEFAULT_API_CONFIG;

const axiosInstance = axios.create({ baseURL: config.url })
// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<string> => {
  const response = await axios.post(`${config.url}/v1/auth/refresh-tokens`, { token: refreshToken })
  return response.data.tokens.access.token
}
applyAuthTokenInterceptor(axiosInstance, { requestRefresh })

// export const login = async (email, password) => {
//     const params = {
//         email: email,
//         password: password
//     }
//     const response = await axiosInstance.post('/auth/login', params)
//     console.log(response)
//     await setAuthTokens({
//         accessToken: response.data.tokens.access.token,
//         refreshToken: response.data.tokens.refresh.token
//       })
//     console.log(await getAccessToken())
// }

// export const logout = async () => {
//   console.log("logout")
//   await clearAuthTokens()
//   console.log(await getAccessToken())
// }

// export const accessToken = async () => {
//   getAccessToken().then(accessToken => console.log(accessToken))
// }
// export const refreshToken = async () => {
//   getRefreshToken().then(refreshToken => console.log(refreshToken))
// }



export default axiosInstance;