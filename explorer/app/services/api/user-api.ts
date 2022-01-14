import { ApiResponse } from "apisauce"
import { Api } from "./api"
// import { GetCharactersResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'react-native-axios-jwt'

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async loginUser(email, password) {
    try {
      // make the api call
      const params = {
        email: email,
        password: password
    }

      const response: ApiResponse<any> = await this.api.apisauce.post(
        '/auth/login', params
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      await setAuthTokens({
        accessToken: response.data.tokens.access.token,
        refreshToken: response.data.tokens.refresh.token
      })

      const user = response.data.user

      return { kind: "ok", user: user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getUser() {
    try {
      // make the api call
  
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "/users/me",
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = response.data

      return { kind: "ok", user: user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getNonce(publicAddress) {
    try {
      // make the api call
  
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `/users/nonce/${publicAddress}`,
      )

      const nonce = []

      if(!response.data.nonce) {
        const response2: ApiResponse<any> = await this.api.apisauce.post(
          `/auth/registerEth`, { publicAddress: publicAddress }
        )

        nonce.push(response2.data.nonce)
      } else {
        nonce.push(response.data.nonce)
      }

      return { kind: "ok", nonce: nonce[0] }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async loginUserEth(publicAddress, signature) {
    try {
      console.log("API")
      // make the api call
      const params = {
        publicAddress: publicAddress,
        signature: signature
    }

      const response: ApiResponse<any> = await this.api.apisauce.post(
        '/auth/loginEth', params
      )

      // console.log(response)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      await setAuthTokens({
        accessToken: response.data.tokens.access.token,
        refreshToken: response.data.tokens.refresh.token
      })

      const user = response.data.user

      return { kind: "ok", user: user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
