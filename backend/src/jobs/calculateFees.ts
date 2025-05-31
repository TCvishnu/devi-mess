import { Agenda } from "agenda";

export const agendaFunction = (agenda: Agenda) => {
  //@ts-ignore for now
  agenda.define("calculate-monthly-fees", async (job) => {
    console.log("Running monthly fee calculation...");
    console.log(new Date().toISOString());
    console.log("Monthly fees calculated and stored.");
  });
};
