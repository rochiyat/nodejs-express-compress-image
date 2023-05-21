# Node JS and Express for Compress or Resize Image with Library JIMP

## Requirement
- Node JS
- Developer Tools, me use VSC
- Postman or Similar or Command Line


## Running Project
- Clone repo github
- Install library dependency with command _npm install_
- Running application with command _npm start_

## Test Project With Postman or Similar or Command Line

### **Resize Image**
curl --location 'http://localhost:8001/api/v1/resize/image' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolderSource": "/home/vboxuser/Pictures/Source Image/",
    "pathFolderDestination": "/home/vboxuser/Pictures/Target Image/",
    "imageQuality": 10
}'

### **List Files in Folder with Extention**
curl --location 'http://localhost:8001/api/v1/list' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolder": "/media/sf_D_DRIVE/Video/",
    "extFiles": ".mp4"
}'

### **List Files in Folder without Extention (list all folder and files)**
curl --location 'http://localhost:8001/api/v1/list' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolder": "/media/sf_D_DRIVE/Video/",
    "extFiles": ""
}'

### **List Folder and Files With Size**
curl --location 'http://localhost:8001/api/v1/list-by-folder' \
--header 'Content-Type: application/json' \
--data '{
    "folderPath": "/media/sf_D_DRIVE/Video/"
}'

### **Rename Files In Same or Other Path**
curl --location 'http://localhost:8001/api/v1/rename' \
--header 'Content-Type: application/json' \
--data '{
    "folderPath": "/home/vboxuser/Documents/",
    "searchFiles": "rename-files-infolder-nodejs-main.zip",
    "targetPath": "/home/vboxuser/Downloads/",
    "renameFiles": "rename-files-infolder-nodejs-main.zip"
}'

### **Move Files With Size**
curl --location 'http://localhost:8001/api/v1/move/search' \
--header 'Content-Type: application/json' \
--data '{
    "pathFolderSource": "/home/vboxuser/Documents/",
    "searchFiles": "",
    "pathFolderDest": "/home/vboxuser/Downloads/",
    "size": "150 MB",
    "withMove": true
}'