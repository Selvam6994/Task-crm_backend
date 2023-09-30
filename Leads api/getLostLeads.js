import { adminAuth } from "../Admin api/adminAuth.js";
import { app, client } from "../index.js";

export function getLostLeads() {
  app.get("/getLostLeads", async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("Leads")
      .find({ status: "lost" })
      .toArray();
    if (getData) {
      response.status(200).send(getData);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
