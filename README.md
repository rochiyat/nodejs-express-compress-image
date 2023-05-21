# Node JS and Express for Compress or Resize Image with Library JIMP

## Requirement
- Node JS
- Developer Tools, me use VSC
- Postman or Similar or Command Line


## Running Project
- Clone repo github
- Install library dependency with command 
```bash
$ npm install
```
- Install nodemon (optional) with command 
```bash
$ npm install nodemon --save--dev
```
- Running application with command
```bash
$ npm start
```

## Test Project With Postman or Similar or Command Line

### **Resize Image**
```json
curl --location 'http://localhost:8001/api/v1/resize/image' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolderSource": "/home/vboxuser/Pictures/Source Image/",
    "pathFolderDestination": "/home/vboxuser/Pictures/Target Image/",
    "imageQuality": 10
}'
```

### **List Files in Folder with Extention**
```json
curl --location 'http://localhost:8001/api/v1/list' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolder": "/media/sf_D_DRIVE/Video/",
    "extFiles": ".mp4"
}'
```

### **List Files in Folder without Extention (list all folder and files)**
```json
curl --location 'http://localhost:8001/api/v1/list' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolder": "/media/sf_D_DRIVE/Video/",
    "extFiles": ""
}'
```

### **List Folder and Files With Size**
```json
curl --location 'http://localhost:8001/api/v1/list-by-folder' \
--header 'Content-Type: application/json' \
--data '{
    "folderPath": "/media/sf_D_DRIVE/Video/"
}'
```

### **Rename Files In Same or Other Path**
```json
curl --location 'http://localhost:8001/api/v1/rename' \
--header 'Content-Type: application/json' \
--data '{
    "folderPath": "/home/vboxuser/Documents/",
    "searchFiles": "rename-files-infolder-nodejs-main.zip",
    "targetPath": "/home/vboxuser/Downloads/",
    "renameFiles": "rename-files-infolder-nodejs-main.zip"
}'
```

### **Move Files With Size**
```json
curl --location 'http://localhost:8001/api/v1/move/search' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolderSource": "/home/vboxuser/Documents/",
    "searchFiles": "",
    "pathFolderDest": "/home/vboxuser/Downloads/",
    "size": "150 MB",
    "withMove": true
}'
```