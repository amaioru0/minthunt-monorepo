import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const SettingsModel = types
  .model("Settings")
  .props({
    network: types.optional(types.string, "kovan"),
    chainId: types.optional(types.number, 42)
  })
  .views((self) => ({
    get selectedNetwork() {
      return self.network;
    },
    get getchainId() {
      return self.chainId;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setNetwork: async (network) => {
      self.network = network;
    },
    setChainId: async (chainId) => {
      self.chainId = chainId;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type SettingsType = Instance<typeof SettingsModel>
export interface Settings extends SettingsType {}
type SettingsSnapshotType = SnapshotOut<typeof SettingsModel>
export interface SettingsSnapshot extends SettingsSnapshotType {}
export const createSettingsDefaultModel = () => types.optional(SettingsModel, {})
