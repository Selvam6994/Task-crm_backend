import express from "express";
import CROS from "cors";
import { MongoClient, ObjectId } from "mongodb";
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
import { updateAdmin } from "./Admin api/updateAdmin.js";
import { getAdmin } from "./Admin api/getAdmin.js";
import { addAdmin } from "./Admin api/addAdmin.js";
import { managerAuth } from "./Manager api/managerAuth.js";
import jwt from "jsonwebtoken";
import { deleteAdvisor } from "./Advisor api/deleteAdvisor.js";
import { getAdvisorData } from "./Advisor api/getAdvisorData.js";
import { updateAdvisorData } from "./Advisor api/updateAdvisorData.js";
import { advisorLogin } from "./Advisor api/advisorLogin.js";
import { addAdvisor } from "./Advisor api/addAdvisor.js";
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

// ***************************Leads Api****************************************
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

// ***************************Emmployees Api****************************************
// ***************************Admin Api****************************************
// Login Admin
app.post("/adminLogIn", async function (request, response) {
  const { email, pin } = await request.body;
  const existingUser = await client
    .db("CRM")
    .collection("Admin Data")
    .findOne({ email: email });
  console.log(existingUser);
  if (existingUser) {
    let storedPassword = existingUser.pin;
    const inputPin = pin.toString();
    const passwordCheck = await bcrypt.compare(inputPin, storedPassword);
    if (passwordCheck == true) {
      let token = jwt.sign(
        { email: existingUser.email, name: existingUser.name },
        secretKey
      );
      response
        .status(200)
        .send({ message: "Logged in successfully", token: token });
    } else {
      response.status(400).send({ message: "invalid credential" });
    }
  } else {
    response.status(400).send({ message: "invalid credential" });
  }
});

// add new admin and set sign in password
addAdmin();

//get admindata
getAdmin();

// update Admin data
updateAdmin();

// delete Admin data
app.delete("/deleteAdminData", managerAuth, async function (request, response) {
  const { _id } = await request.body;
  const findData = await client
    .db("CRM")
    .collection("Admin Data")
    .findOne({ _id: new ObjectId(_id) });
  if (findData) {
    const deleteData = await client
      .db("CRM")
      .collection("Admin Data")
      .deleteOne({ _id: new ObjectId(_id) });
    response.status(200).send(deleteData);
  } else {
    response.status(400).send({ message: "no data available" });
  }
});
// ***************************Admin Api****************************************

// ***************************Service Advisor Api****************************************
// login advisor
advisorLogin();

// add Service Advisor
addAdvisor();

// get service advisor data
getAdvisorData();

// update advisor
updateAdvisorData();

// delete Service Advisor data
deleteAdvisor();

// ***************************Service Advisor Api****************************************

// ***************************Technician Api****************************************

// technicians login
app.post("/technicianLogIn", async function (request, response) {
  const { email, pin } = await request.body;
  const existingUser = await client
    .db("CRM")
    .collection("Technician Data")
    .findOne({ email: email });
  console.log(existingUser);
  if (existingUser) {
    let storedPassword = existingUser.pin;
    console.log(storedPassword)
    const inputPin = pin.toString();
    console.log(inputPin)
    const passwordCheck = await bcrypt.compare(inputPin, storedPassword);
    console.log(passwordCheck)
    if (passwordCheck == true) {
      let token = jwt.sign(
        { email: existingUser.email, name: existingUser.name },
        secretKey
      );
      response
        .status(200)
        .send({ message: "Logged in successfully", token: token });
    } else {
      response.status(400).send({ message: "invalid credential" });
    }
  } else {
    response.status(400).send({ message: "invalid credential" });
  }
});
// add Technicians
app.post("/technicianSignUp", managerAuth, async function (request, response) {
  const { name, email, phone, pin, confirmPin } = await request.body;
  const checkData = await client
    .db("CRM")
    .collection("Technician Data")
    .findOne({ email: email });
  if (checkData) {
    response.status(401).send({ message: "User Already Exists" });
  } else {
    if (pin == confirmPin) {
      const hashedPassword = await generateHashedPassword(pin);
      const userData = await client
        .db("CRM")
        .collection("Technician Data")
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

// get technicians data
app.get("/getTechnicianData", async function (request, response) {
  const getData = await client
    .db("CRM")
    .collection("Technician Data")
    .find({})
    .toArray();
  if (getData) {
    response.status(200).send(getData);
  } else {
    response.status(400).send({ message: "no data" });
  }
});
// update technician data
app.put("/updateTechnicianData", managerAuth, async function (request, response) {
    const { id } = await request.body;
    const findData = await client
      .db("CRM")
      .collection("Technician Data")
      .findOne({ _id: new ObjectId(id) });
    if (findData) {
      const { name, email, phone } = await request.body;
      const adminData = await client
        .db("CRM")
        .collection("Technician Data")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { name: name, email: email, phone: phone } }
        );
      response.status(200).send(adminData);
    }
  }
);
// update technician pin
app.put("/updateTechnicianPin", managerAuth, async function (request, response) {
  const { id, newPin, confirmPin } = await request.body;
  const findData = await client
    .db("CRM")
    .collection("Technician Data")
    .findOne({ _id: new ObjectId(id) });
  if (findData) {
    if (newPin == confirmPin) {
      const hashedPassword = await generateHashedPassword(newPin);
      const adminData = await client
        .db("CRM")
        .collection("Technician Data")
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

// delete Technician data
app.delete(
  "/deleteTechnicianData",
  managerAuth,
  async function (request, response) {
    const { _id } = await request.body;
    const findData = await client
      .db("CRM")
      .collection("Technician Data")
      .findOne({ _id: new ObjectId(_id) });
    if (findData) {
      const deleteData = await client
        .db("CRM")
        .collection("Technician Data")
        .deleteOne({ _id: new ObjectId(_id) });
      response.status(200).send(deleteData);
    } else {
      response.status(400).send({ message: "no data available" });
    }
  }
);
// ***************************Technician Api****************************************

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
