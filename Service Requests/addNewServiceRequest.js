import { app, client } from "../index.js";

export function addNewServiceRequest() {
    app.post("/addServiceRequests", async function (request, response) {
        const { name, email, phone, vehicleNumber, serviceRequirements, date } = await request.body;
        const findData = await client
            .db("CRM")
            .collection("Service Requests")
            .findOne({ email: email });
        if (!findData) {
            const addData = await client
                .db("CRM")
                .collection("Service Requests")
                .insertOne({
                    name: name,
                    email: email,
                    phone: phone,
                    vehicleNumber: vehicleNumber,
                    serviceRequirements: serviceRequirements,
                    date: date,
                    status: "New",
                });
            if (addData) {
                response.status(200).send(addData);
            } else {
                response.status(400).send({ message: "cannot post" });
            }
        } else {
            response
                .status(400)
                .send({ message: "This service request is already available" });
        }
    });
}
