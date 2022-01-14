import { Instance, SnapshotOut, types } from "mobx-state-tree"


// const GeoDataModel = types.model('GeoData').props({
//   latitude: types.number,
//   longitude: types.number,
//   country: types.optional(types.string, '')
// })

/**
 * Model description here for TypeScript hints.
 */
export const ChestModel = types
  .model("Chest")
  .props({
    _id: types.optional(types.string, ""),
    latitude: types.optional(types.number, 0),
    longitude: types.optional(types.number, 0),
    // geoData: types.optional(GeoDataModel, {}),
    title: types.optional(types.string, "")
  })
  .views((self) => ({
     getChest() { // B
      return self;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    // changeTitle(title) {
    //   self.title = title;
    // }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type ChestType = Instance<typeof ChestModel>
export interface Chest extends ChestType {}
type ChestSnapshotType = SnapshotOut<typeof ChestModel>
export interface ChestSnapshot extends ChestSnapshotType {}
export const createChestDefaultModel = () => types.optional(ChestModel, {})
