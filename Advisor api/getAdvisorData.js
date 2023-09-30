import { app, client } from "../index.js";

export function getAdvisorData() {
  app.get("/getAdvisorData", async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("Service Advisor Data")
      .find({})
      .toArray();
    if (getData) {
      response.status(200).send(getData);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
