import { app, client } from "../index.js";

export function deleteCancelledRequests() {
    app.delete("/deleteCancelledRequests", async function (request, response) {
        const { name, email, phone, vehicleNumber, serviceRequirements, date } = await request.body;
        const findData = await client.db("CRM").collection("Service Requests").findOne({
            name: name,
            email: email,
            phone: phone,
            vehicleNumber: vehicleNumber,
            serviceRequirements: serviceRequirements,
            date: date,
            status: "Cancelled",
        });
        if (findData) {
            const deleteData = await client.db("CRM").collection("Service Requests").deleteOne({
                name: name,
                email: email,
                phone: phone,
                vehicleNumber: vehicleNumber,
                serviceRequirements: serviceRequirements,
                date: date,
                status: "Cancelled",
            });
            response.status(200).send(deleteData);
        } else {
            response.status(400).send({ message: "no data available" });
        }
    });
}
