require("dotenv").config();
import Agenda from "agenda";

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI || "",
    collection: "jobs",
  },
});

export default agenda;
