import { adminAuth } from "../Admin api/adminAuth.js";
import { app, client } from "../index.js";

export function updateNewToContacted() {
  app.put("/contactedLeads", adminAuth, async function (request, response) {
    const { name, email, phone, requirements } = await request.body;
    const findData = await client.db("CRM").collection("Leads").findOne({
      name: name,
      email: email,
      phone: phone,
      requirements: requirements,
      status: "New",
    });

    if (findData) {
      const { name, email, phone, requirements } = request.body;
      const contactedData = await client
        .db("CRM")
        .collection("Leads")
        .updateOne(
          {
            name: name,
            email: email,
            phone: phone,
            requirements: requirements,
          },
          { $set: { status: "contacted" } }
        );
      response.status(200).send(contactedData);
    } else {
      response.status(400).send("not added");
    }
  });
}
