import { app, client } from "../index.js";

export function getOpenRequests() {
    app.get("/getOpenServiceRequests", async function (request, response) {
        const getData = await client
            .db("CRM")
            .collection("Service Requests")
            .find({ status: "Open" })
            .toArray();
        if (getData) {
            response.status(200).send(getData);
        } else {
            response.status(400).send({ message: "no data" });
        }
    });
}
