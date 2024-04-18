import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
//import compilateur from './routes/compilateur.js';
const app = express();
const hostname = "127.0.0.1";
const port = process.env.PORT || 9090;

app.use(cors());
app.use(bodyParser.json());
//app.use('/compilateur', compilateur);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
