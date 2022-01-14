import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ChestSvgModel = types
  .model("ChestSvg")
  .props({})
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type ChestSvgType = Instance<typeof ChestSvgModel>
export interface ChestSvg extends ChestSvgType {}
type ChestSvgSnapshotType = SnapshotOut<typeof ChestSvgModel>
export interface ChestSvgSnapshot extends ChestSvgSnapshotType {}
export const createChestSvgDefaultModel = () => types.optional(ChestSvgModel, {})
