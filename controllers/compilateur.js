import { config } from 'dotenv';
import axios from 'axios';
config();
const staticVariables = {
    clientId: process.env.JDoodleClientId,
    clientSecret: process.env.JDoodleClientSecret,
    stdin: "",
    language: "java",
    versionIndex: 3
  };
  
export async function addCompilateur(req, res) {
    try {
      const { script } = req.body;
      const requestData = {...staticVariables, script };
  
      const response = await axios.post('https://api.jdoodle.com/v1/execute', requestData);
  
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'exécution du code' });
    }
  };