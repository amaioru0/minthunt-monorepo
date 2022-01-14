import { TreasureMapModel } from "./treasure-map"

test("can be created", () => {
  const instance = TreasureMapModel.create({})

  expect(instance).toBeTruthy()
})
