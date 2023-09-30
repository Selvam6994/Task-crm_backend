import { managerAuth } from "../Manager api/managerAuth.js";
import { app, client, generateHashedPassword } from "../index.js";

export function addAdmin() {
  app.post("/adminSignUp",managerAuth, async function (request, response) {
    const { name, email, phone, pin, confirmPin } = await request.body;
    const checkData = await client
      .db("CRM")
      .collection("Admin Data")
      .findOne({ email: email });
    if (checkData) {
      response.status(401).send({ message: "User Already Exists" });
    } else {
      if (pin == confirmPin) {
        const hashedPassword = await generateHashedPassword(pin);
        const userData = await client
          .db("CRM")
          .collection("Admin Data")
          .insertOne({
            name: name,
            email: email,
            phone: phone,
            pin: hashedPassword,
          });
        response.status(200).send({ password: hashedPassword });
      } else {
        response.status(400).send({ message: "password does not match" });
      }
    }
  });
}
