import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const TreasureMapModel = types
  .model("TreasureMap")
  .props({
    name: types.maybe(types.string),
    range: types.maybe(types.number),
    color: types.maybe(types.string),
    type: types.maybe(types.string),
    image: types.maybe(types.string),
  })
  .views((self) => ({
    getMap() { // B
     return self;
   },
 })) // eslint-disable-line @typescript-eslint/no-unused-vars

type TreasureMapType = Instance<typeof TreasureMapModel>
export interface TreasureMap extends TreasureMapType {}
type TreasureMapSnapshotType = SnapshotOut<typeof TreasureMapModel>
export interface TreasureMapSnapshot extends TreasureMapSnapshotType {}
export const createTreasureMapDefaultModel = () => types.optional(TreasureMapModel, {})
