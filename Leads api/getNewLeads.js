import { app, client } from "../index.js";

export function getNewLeads() {
    app.get("/getNewLeads", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Leads")
            .find({ status: "New" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
