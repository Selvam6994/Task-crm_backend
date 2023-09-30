import { ObjectId } from "mongodb";
import { managerAuth } from "../Manager api/managerAuth.js";
import { app, client } from "../index.js";

export function deleteAdvisor() {
  app.delete(
    "/deleteAdvisorData",
    managerAuth,
    async function (request, response) {
      const { _id } = await request.body;
      const findData = await client
        .db("CRM")
        .collection("Service Advisor Data")
        .findOne({ _id: new ObjectId(_id) });
      if (findData) {
        const deleteData = await client
          .db("CRM")
          .collection("Service Advisor Data")
          .deleteOne({ _id: new ObjectId(_id) });
        response.status(200).send(deleteData);
      } else {
        response.status(400).send({ message: "no data available" });
      }
    }
  );
}
