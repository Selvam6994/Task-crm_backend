import { app, client } from "../index.js";

export function getQualifiedLeads() {
    app.get("/getQualifiedLeads", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Leads")
            .find({ status: "qualified" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
