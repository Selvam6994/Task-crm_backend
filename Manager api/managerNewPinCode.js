import { app, generateHashedPassword, client } from "../index.js";

export function managerNewPinCode() {
    app.post("/managerSignUp/:email", async function (request, response) {
        const { email } = request.params;
        const { name, phone, pin, confirmPin } = await request.body;
        if (pin == confirmPin) {
            const hashedPassword = await generateHashedPassword(pin);
            const userData = await client
                .db("CRM")
                .collection("Manager Data")
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
    });
}
