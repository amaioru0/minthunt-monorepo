import { Instance, SnapshotOut, types, destroy, applySnapshot } from "mobx-state-tree"
import { ChestModel, ChestSnapshot } from "../chest/chest";
import { withEnvironment } from "../extensions/with-environment"

// const initialChests = [
//   {
//     latitude: 51.88512815507423,
//     longitude: -8.480941650356145,
//     title: "Alien Friend"
//   },
//   {
//     latitude: 51.88552732507139,
//     longitude: -8.482531714931463,
//     title: "Alien Friend"
//   }
// ]

/**
 * Model description here for TypeScript hints.
 */
export const ChestListModel = types
  .model("ChestList")
  .props({
    chests: types.optional(types.array(ChestModel), []),
  })
  .actions((self) => ({
    updateChests: (esChests) => {
      applySnapshot(self, esChests);
    },
  }))
  .views((self) => ({

  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    remove(chest) { // B
      destroy(chest)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type ChestListType = Instance<typeof ChestListModel>
export interface ChestList extends ChestListType {}
type ChestListSnapshotType = SnapshotOut<typeof ChestListModel>
export interface ChestListSnapshot extends ChestListSnapshotType {}
export const createChestListDefaultModel = () => types.optional(ChestListModel, {})
