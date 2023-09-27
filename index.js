import express from "express";
import CROS from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { managerNewPinCode } from "./Manager api/managerNewPinCode.js";
import { managerSignUpOtpVerify } from "./Manager api/managerSignUpOtpVerify.js";
import { managerSignUp } from "./Manager api/managerSignUp.js";
import { managerLogin } from "./Manager api/managerLogin.js";
import { getCancelledLeads } from "./Leads api/getCancelledLeads.js";
import { deleteLeads } from "./Leads api/deleteLeads.js";
import { getConfirmedLeads } from "./Leads api/getConfirmedLeads.js";
import { updateQualifiedToConfirmed } from "./Leads api/updateQualifiedToConfirmed.js";
import { getLostLeads } from "./Leads api/getLostLeads.js";
import { getQualifiedLeads } from "./Leads api/getQualifiedLeads.js";
import { updateContactedToLost } from "./Leads api/updateContactedToLost.js";
import { updateContactedToQualified } from "./Leads api/updateContactedToQualified.js";
import { getContactedLeads } from "./Leads api/getContactedLeads.js";
import { updateNewToContacted } from "./Leads api/updateNewToContacted.js";
import { getNewLeads } from "./Leads api/getNewLeads.js";
import { addLeads } from "./Leads api/addLeads.js";
import { deleteCancelledLeads } from "./Leads api/deleteCancelledLeads.js";
import { deleteCancelledRequests } from "./Service Requests/deleteCancelledRequests.js";
import { getCompletedRequests } from "./Service Requests/getCompletedRequests.js";
import { getCancelledRequests } from "./Service Requests/getCancelledRequests.js";
import { getInProcessRequests } from "./Service Requests/getInProcessRequests.js";
import { getOpenRequests } from "./Service Requests/getOpenRequests.js";
import { updateProcessRequestToCompleted } from "./Service Requests//updateProcessRequestToCompleted.js";
import { updateOpenRequestToProcess } from "./Service Requests/updateOpenRequestToProcess.js";
import { updateNewRequestToCancelled } from "./Service Requests/updateNewRequestToCancelled.js";
import { updateNewRequestToOpen } from "./Service Requests/updateNewRequestToOpen.js";
import { getNewServiceRequests } from "./Service Requests/getNewServiceRequests.js";
import { addNewServiceRequest } from "./Service Requests/addNewServiceRequest.js";
import { updateQualifiedToCancelled } from "./Service Requests/updateQualifiedToCancelled.js";
dotenv.config();
export const app = express();

app.use(express.json());
app.use(CROS());

export const PORT = process.env.PORT;

const MongoURL = process.env.MONGO_URL;
export const client = new MongoClient(MongoURL);
export let secretKey = process.env.SECRET_KEY;
await client.connect();

export async function generateHashedPassword(pin) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  let newPin = pin.toString();
  const hashedPassword = await bcrypt.hash(newPin, salt);

  return hashedPassword;
}

// Manager login
managerLogin();

// Manager sign up
managerSignUp();

// Manager otp verfication
managerSignUpOtpVerify();

// Manager Set new pin
managerNewPinCode();

// add leads
addLeads();

// get New Leads
getNewLeads();

// update status from "new" to "contacted"
updateNewToContacted();

// get (find) data status "contacted"
getContactedLeads();

// update status from "contacted" to "qualified"
updateContactedToQualified();

// update status from "contacted" to "lost"
updateContactedToLost();

// get (find) data status "qualified"
getQualifiedLeads();

// get (find) data status "lost"
getLostLeads();

// update status from "qualified" to "confirmed"
updateQualifiedToConfirmed();

// get (find) data status "confirmed"
getConfirmedLeads();

// Delete Lost Data
deleteLeads();

// get (find) data status "cancelled"
getCancelledLeads();

// delete cancelled Leads
deleteCancelledLeads();

// update status from "qualified" to "cancelled"
updateQualifiedToCancelled();

// Add new service requests
addNewServiceRequest();

// get newly created service requests
getNewServiceRequests();

// update sevice requsts "new" to "open"
updateNewRequestToOpen();

// update sevice requsts "new" to "cancelled"
updateNewRequestToCancelled();

// get open service requests
getOpenRequests();

// update sevice requsts "open" to "process"
updateOpenRequestToProcess();

// get In process service
getInProcessRequests();

// update sevice requsts "process" to "completed"
updateProcessRequestToCompleted();

// get cancelled service requests
getCancelledRequests();
// get Completed service
getCompletedRequests();

//   delete cancelled data
deleteCancelledRequests();

// add new admin and set sign in password
app.post("/adminSignUp", async function (request, response) {
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

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
