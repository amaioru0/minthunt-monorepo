import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { ChestListModel } from "../chest-list/chest-list";
import { ChestModel } from '../chest/chest';
import { UserModel } from '../user/user';
import { WalletModel } from '../wallet/wallet';
import { SettingsModel } from '../settings/settings';

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  userStore: types.optional(UserModel, {} as any),
  chestStore: types.optional(ChestModel, {} as any),
  chestListStore: types.optional(ChestListModel, {} as any),
  walletStore: types.optional(WalletModel, {} as any),
  settingsStore: types.optional(SettingsModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
