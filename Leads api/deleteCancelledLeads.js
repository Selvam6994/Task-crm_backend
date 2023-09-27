import { app, client } from "../index.js";

export function deleteCancelledLeads() {
    app.delete("/deleteCancelledData", async function (request, response) {
        const { name, email, phone, requirements } = await request.body;
        const findData = await client.db("CRM").collection("Leads").findOne({
            name: name,
            email: email,
            phone: phone,
            requirements: requirements,
            status: "cancelled",
        });
        if (findData) {
            const deleteData = await client.db("CRM").collection("Leads").deleteOne({
                name: name,
                email: email,
                phone: phone,
                requirements: requirements,
                status: "cancelled",
            });
            response.status(200).send(deleteData);
        } else {
            response.status(400).send({ message: "no data available" });
        }
    });
}
