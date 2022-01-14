import { Instance, SnapshotOut, types, flow, applySnapshot } from "mobx-state-tree"
import { UserApi } from "../../services/api/user-api"
import { withEnvironment } from "../extensions/with-environment"
import { clearAuthTokens } from 'react-native-axios-jwt';
import { TreasureMapModel, TreasureMapSnapshot } from "../treasure-map/treasure-map";

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    userId: types.optional(types.string, ""),
    // username: types.optional(types.string, ""),
    // email: types.optional(types.string, ""),
    role: types.optional(types.string, "user"),
    // emailVerified: types.optional(types.boolean, false),
    // phoneNo: types.optional(types.string, ""),
    // avatar: types.optional(types.string, ""),  
    loggedIn: types.optional(types.boolean, false),
    hasMaps: types.optional(types.boolean, false),
    selectedMap: types.optional(types.number, 0),
    treasureMaps: types.optional(types.array(TreasureMapModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUser: (user) => {
      // self = { ...user }
      applySnapshot(self, user);
      // console.log(self)
    },
    setLogin: async (trueOrFalse) => {
      self.loggedIn = trueOrFalse;
    },
    setHasMaps: async (trueOrFalse) => {
      self.hasMaps = trueOrFalse;
    },
    selectMap: async (id) => {
      self.selectedMap = id;
    },
    updateMaps: (maps) => {
      applySnapshot(self.treasureMaps, maps);
    },
  }))
  .actions((self) => ({
    // loginUser: async (email, password) => {
    //   const userApi = new UserApi(self.environment.api)
    //   const result = await userApi.loginUser(email, password)
    //   console.log(result)
    //   if (result.kind === "ok") {
    //     self.saveUser(result.user)
    //     console.log(self)
    //   } else {
    //     __DEV__ && console.tron.log(result.kind)
    //   }
    // },
    loginUser: flow( function*(email, password) {
      const userApi = new UserApi(self.environment.api)
      const result = yield userApi.loginUser(email, password)
      if (result.kind === "ok") {
        self.saveUser(result.user)
        self.setLogin(true);
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    loginUserEth: flow( function*(publicAddress, signature) {
      console.log("login user")
      const userApi = new UserApi(self.environment.api)
      const result = yield userApi.loginUserEth(publicAddress, signature)
      if (result.kind === "ok") {
        self.saveUser({
          hasMaps: self.hasMaps,
          selectedMap: self.selectedMap,
          treasureMaps: self.treasureMaps,
          ...result.user
        })
        self.setLogin(true);
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    getNonce: flow( function*(publicAddress) {
      const userApi = new UserApi(self.environment.api)
      const result = yield userApi.getNonce(publicAddress)
      if (result.kind === "ok") {
        return result.nonce;
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
    logoutUser: async () => {
      await clearAuthTokens()
      // self.saveUser({userId: "", username: "", email: "", role: "user", emailVerified: false, phoneNo: "", avatar: "", loggedIn: false})
      self.saveUser({
        hasMaps: self.hasMaps,
        selectedMap: self.selectedMap,
        treasureMaps: self.treasureMaps,
      })
      self.setLogin(false);
    },
    getUser: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getUser()
      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))
  .views((self) => ({
    get isLoggedIn() {
      return self.loggedIn;
    },
    get getHasMaps() {
      return self.hasMaps;
    },
    get getSelectedMap() {
      return self.selectedMap;
    },
    get getTreasureMaps() {
      return self.treasureMaps;
    },
  }))
  // eslint-disable-line @typescript-eslint/no-unused-vars

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
