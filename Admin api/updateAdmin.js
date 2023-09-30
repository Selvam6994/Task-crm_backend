import { ObjectId } from "mongodb";
import { app, client, generateHashedPassword } from "../index.js";
import { managerAuth } from "../Manager api/managerAuth.js";

export function updateAdmin() {
  app.put("/updateAdminData",  async function (request, response) {
    const { id } = await request.body;
    const findData = await client
      .db("CRM")
      .collection("Admin Data")
      .findOne({ _id: new ObjectId(id) });
    if (findData) {
      const { name, email, phone } = await request.body;
      if ({ newPin: "" }) {
        const adminData = await client
          .db("CRM")
          .collection("Admin Data")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { name: name, email: email, phone: phone } }
          );
        response.status(200).send(adminData);
      }
    }
  });
  app.put("/updateAdminPin",managerAuth, async function (request, response) {
    const { id, newPin, confirmPin } = await request.body;
    const findData = await client
      .db("CRM")
      .collection("Admin Data")
      .findOne({ _id: new ObjectId(id) });
    if (findData) {
      if (newPin == confirmPin) {
        const hashedPassword = await generateHashedPassword(newPin);
        const adminData = await client
          .db("CRM")
          .collection("Admin Data")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { pin: hashedPassword } }
          );
        response.status(200).send(adminData);
      } else {
        response.status(400).send("pin does not match");
      }
    }
  });
}
