import { ChestSvgModel } from "./chest-svg"

test("can be created", () => {
  const instance = ChestSvgModel.create({})

  expect(instance).toBeTruthy()
})
