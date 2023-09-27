import { app, client } from "../index.js";

export function managerSignUpOtpVerify() {
    app.post("/managerSignUp/otpVerification", async function (request, response) {
        const { otp } = await request.body;
        const storedOtp = await client
            .db("CRM")
            .collection("Manager OTP")
            .findOne({ otp: +otp });
        if (storedOtp) {
            response.status(200).send({ message: "OTP verified" });
        } else {
            response.status(400).send({ message: "invalid otp" });
        }
    });
}
