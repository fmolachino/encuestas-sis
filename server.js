
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});