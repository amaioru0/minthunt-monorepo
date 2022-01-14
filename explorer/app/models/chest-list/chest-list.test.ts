import { ChestListModel } from "./chest-list"

test("can be created", () => {
  const instance = ChestListModel.create({})

  expect(instance).toBeTruthy()
})
