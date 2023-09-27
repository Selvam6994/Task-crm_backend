import { app, client } from "../index.js";

export function addLeads() {
    app.post("/addLeads", async function (request, response) {
        const { name, email, phone, requirements } = await request.body;
        const findData = await client
            .db("CRM")
            .collection("Leads")
            .findOne({ email: email });
        if (!findData) {
            const addData = await client.db("CRM").collection("Leads").insertOne({
                name: name,
                email: email,
                phone: phone,
                requirements: requirements,
                status: "New",
            });
            if (addData) {
                response.status(200).send(addData);
            } else {
                response.status(400).send({ message: "cannot post" });
            }
        } else {
            response.status(400).send({ message: "This lead is already available" });
        }
    });
}
