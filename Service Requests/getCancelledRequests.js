import { app, client } from "../index.js";

export function getCancelledRequests() {
    app.get("/getCancelledServiceRequests", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Service Requests")
            .find({ status: "Cancelled" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
