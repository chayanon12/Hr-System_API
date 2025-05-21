const express = require("express");
const app = express();
const port = 4007;
const oracledb = require("oracledb");
const path = require('path');

const cors = require('cors');
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
    return res.sendStatus(200);  
  }
  next();
});



const Common = require("./routes/Routes_Common.cjs")
const RequestManPower = require("./routes/Routes_RequestManPower.cjs")
const Letter = require("./routes/Routes_Letter.cjs")


app.use("/api/Common", Common);
app.use("/api/RequestManPower", RequestManPower);
app.use("/api/RefferenceLetter", Letter);

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('/usr/src/app/FileFomat/', filename);

  console.log('Attempting to download:', filePath);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("File download failed.");
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  