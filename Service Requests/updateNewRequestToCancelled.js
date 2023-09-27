import { app, client } from "../index.js";

export function updateNewRequestToCancelled() {
    app.put("/cancelRequests", async function (request, response) {
        const { name, email, phone, vehicleNumber, serviceRequirements, date } = await request.body;
        const findData = await client
            .db("CRM")
            .collection("Service Requests")
            .findOne({
                name: name,
                email: email,
                phone: phone,
                vehicleNumber: vehicleNumber,
                serviceRequirements: serviceRequirements,
                date: date,
                status: "New",
            });

        if (findData) {
            const { name, email, phone, vehicleNumber, serviceRequirements, date } = request.body;
            const updateData = await client
                .db("CRM")
                .collection("Service Requests")
                .updateOne(
                    {
                        name: name,
                        email: email,
                        phone: phone,
                        vehicleNumber: vehicleNumber,
                        serviceRequirements: serviceRequirements,
                        date: date,
                    },
                    { $set: { status: "Cancelled" } }
                );
            response.status(200).send(updateData);
        } else {
            response.status(400).send("not added");
        }
    });
}
