const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const cors = require("cors");
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors());
const upload = multer();

let soldiers = [
  {
    id: "unknown",
    age: "unknown",
    birthName: "unknown",
    kills: 0,
    deaths: 0,
    lastMatch: "12/31/23",
  },
];

app.get("/soldiers/", (req, res) => {
  res.json(soldiers);
});

app.post("/add-soldier/", upload.none(), (req, res) => {
  const newSoldier = req.body;
  console.log("New Soldier:", newSoldier);

  // Validate that the request contains the necessary data
  if (!newSoldier) {
    return res.status(400).json({
      error:
        "Invalid request. Please provide the required data (name, age, birthName, kills, deaths, lastMatch).",
    });
  }

  // Add the new soldier to the array
  soldiers.push(newSoldier);

  // Send a response indicating success
  res.json({ success: true, message: "Soldier added successfully." });
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/api/soldiers/:id?", (request, response) => {
  const soldierId = request.params.id;

  if (soldierId) {
    const foundSoldier = soldiers.find((soldier) => soldier.id === soldierId);
    if (foundSoldier) {
      response.json(foundSoldier);
    } else {
      response.json(soldiers.find((soldier) => soldier.id === "unknown"));
    }
  } else {
    // If no specific ID is provided, return the whole array
    response.json(soldiers);
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Function to fetch and display soldiers
function listSoldiers() {
  fetch("/api/soldiers/")
    .then((response) => response.json())
    .then((data) => {
      displaySoldiers(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
