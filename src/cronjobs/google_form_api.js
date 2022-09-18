// Import dependencies
const mongoose = require("mongoose");
require("dotenv").config();
const { google } = require("googleapis");
const cron = require("node-cron");
const service = google.sheets("v4");
const credentials = require("../credentials/credentials.json");
const business = require("../models/business");
const semester = require("../models/semester");
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log("DB not connected ", error));
// // Configure auth client
const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const task = cron.schedule(
  "59 * * * * *",
  async () => {
    try {
      // Authorize the client
      const token = await authClient.authorize();

      // Set the client credentials
      await authClient.setCredentials(token);

      // Get the rows
      const res = await service.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: "1Zgipf32ZOjbWAlvjNbQ81mYlAyIZiRB5acsUBRQANEk",
        range: "A2:M",
      });

      const lastSemester = await semester.find({}).sort({ _id: -1 }).limit(1);
      // All of the answers
      const answers = [];

      // Set rows to equal the rows
      const rows = res.data.values;
      // Check if we have any data and if we do add it to our answers array
      if (rows.length) {
        // Remove the headers
        rows.shift();

        // For each row
        for (const row of rows) {
          if (row[11] !== 'FALSE' && row[10] !== 'FALSE')
          answers.push({
            majors: row[11],
            name: row[2],
            email: row[3],
            internshipPosition: row[5],
            amount: row[6],
            address: row[4],
            description: row[7],
            request: row[8],
            code_request: row[1],
            campus_id: row[10],
            smester_id: lastSemester[0]._id,
          });
        }

      console.log({ answers });
        await business.insertMany(answers);
        console.log('Auto insert Doanh nghiep success');
      } else {
        console.log("No data found.");
      }
    } catch (error) {
      // Log the error
      console.log(error);
      // Exit the process with error
      process.exit(1);
    }
  },
  {
    scheduled: false,
  }
);

task.start();
