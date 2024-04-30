import { spawn } from 'child_process';

export const poserQuestion = (req, res) => {
  const pythonProcess = spawn('python', ['./scripts/detectionerr.py']);

  // Send the JSON data to the Python script
  pythonProcess.stdin.write(JSON.stringify(req.body));
  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    res.send(data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send(data.toString());
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
