const express = require("express");
const { PelletRepo } = require("./pellet-repo");

const pelletRepo = new PelletRepo();

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.get('/api/pellets', async (req, res) => {
  try {
    const result = await pelletRepo.get();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.post('/api/pellets', async (req, res) => {
try {
    const consumption = req.body;
    console.log(`Adding consumption, bags: ${consumption.bags}, date: ${consumption.date}`);
    await pelletRepo.add(consumption);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.delete('/api/pellets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Removing consumption with id '${id}'.`);
    await pelletRepo.remove(id);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
})

app.listen(8080, () => {
  console.log("Listening on port 8080");
})