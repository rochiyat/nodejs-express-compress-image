const dotenv = require('dotenv');
const express = require('express');
const app = express();

app.use(express.json());

const { listFiles, renameFiles, moveFileWithSize, resizeImage, listFilesByFolder } = require('./handler')

dotenv.config();

const { API_PORT } = process.env;
const port = API_PORT || 8001;

//listening server on port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.post('/api/v1/list', listFiles);
app.post('/api/v1/list-by-folder', listFilesByFolder);
app.post('/api/v1/rename', renameFiles);
app.post('/api/v1/move/search', moveFileWithSize);
app.post('/api/v1/resize/image', resizeImage);