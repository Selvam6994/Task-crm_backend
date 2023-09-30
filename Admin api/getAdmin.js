import { app, client } from "../index.js";

export function getAdmin() {
  app.get("/getAdminData", async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("Admin Data")
      .find({})
      .toArray();
    if (getData) {
      response.status(200).send(getData);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
