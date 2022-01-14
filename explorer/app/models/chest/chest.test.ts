import { ChestModel } from "./chest"

test("can be created", () => {
  const instance = ChestModel.create({})

  expect(instance).toBeTruthy()
})
