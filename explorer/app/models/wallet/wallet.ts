import { Instance, SnapshotOut, types, applySnapshot } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const WalletModel = types
  .model("Wallet")
  .props({
    address: types.optional(types.string, ""),
    publicKey: types.optional(types.string, ""),
    privateKey: types.optional(types.string, ""),
    mnemonic: types.optional(types.string, ""),
    hasWallet: types.optional(types.boolean, false),
  })
  .views((self) => ({
    getWallet() { 
     return self;
   },
 })) // eslint-disable-line @typescript-eslint/no-unused-vars
 .actions((self) => ({
  setWallet: (wallet) => {
    applySnapshot(self, wallet);
  },
}))  // eslint-disable-line @typescript-eslint/no-unused-vars

type WalletType = Instance<typeof WalletModel>
export interface Wallet extends WalletType {}
type WalletSnapshotType = SnapshotOut<typeof WalletModel>
export interface WalletSnapshot extends WalletSnapshotType {}
export const createWalletDefaultModel = () => types.optional(WalletModel, {})
