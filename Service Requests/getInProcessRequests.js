import { app, client } from "../index.js";

export function getInProcessRequests() {
    app.get("/getServiceInProcees", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Service Requests")
            .find({ status: "In Process" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
