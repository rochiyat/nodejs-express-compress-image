const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const { isEmpty } = require('lodash');
const moment = require('moment');

const { returnSuccess, returnNonSuccess } = require('./helper.js');

async function listFiles (req, res) {
    try {
        const { folderPath, extFiles } = req.body
        let fileData = [];
        let fileText, result;
        // list of files in the directory
        fs.readdir(folderPath, function (err, files) {
            if(err) {
                returnNonSuccess(req, 'Error reading directory', null, res);
                return;
            }
            if(!isEmpty(extFiles)){
                fileText = files.filter(el => path.extname(el) === extFiles);
                returnSuccess(req, fileText, res);
            } else {
                returnSuccess(req, files, res);
            }
             
        });
    } catch (error) {
        returnNonSuccess(req, null, error, res);
    }
}

async function listFilesByFolder (req, res) {
    try {
        const { folderPath } = req.body;
        // Membaca isi folder
        const items = fs.readdirSync(folderPath);

        // Array untuk menyimpan folder dan file terpisah
        const folders = [];
        const files = [];

        // Iterasi melalui setiap item di folder
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const itemStats = fs.statSync(itemPath);

            if (itemStats.isDirectory()) {
                // Jika item adalah folder, tambahkan ke array folders
                folders.push(item);
            } else if (itemStats.isFile()) {
                // Jika item adalah file, tambahkan ke array files
                files.push(`${item} - ${convertBytes(itemStats.size)}`);
            }
        }
        returnSuccess(req, folders.concat(files), res);
    } catch (error) {
        returnNonSuccess(req, null, error, res);
    }
}

async function renameFiles(req, res) {
    try {
        const { folderPath, searchFiles, targetPath, renameFiles } = req.body;
        const renameWith = renameFiles ? renameFiles : '';
        const timeFrom = moment().format('YYYY-MM-DD HH:mm:ss');
        let fileData = [];
        let newName;
        let total = 0;
        const dir = fs.readdirSync(folderPath);
        for (let i = 0; i < dir.length; i++) {
            if(dir[i].includes(searchFiles)){
                newName = dir[i].replace(searchFiles, renameWith);
                if(!isEmpty(targetPath)) {
                    fs.renameSync(`${folderPath}/${dir[i]}`, `${targetPath}/${newName}`);    
                } else {
                    fs.renameSync(`${folderPath}/${dir[i]}`, `${folderPath}/${newName}`);
                }
                fileData.push(newName);
                total++;
            }
        }
        const timeTo = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = {
            filenames: fileData,
            total,
            timeFrom,
            timeTo,
            duration: `${moment(timeTo).diff(timeFrom) / 1000} ms`
        }
        returnSuccess(req, result, res);
    } catch (error) {
        returnNonSuccess(req, null, error, res);
    }
}

async function moveFileWithSize (req, res) {
    try {
        let stats, sizes;
        let fileData = [];
        let total = 0;
        const { pathFolderSource, pathFolderDest, searchFiles, size, withMove } = req.body;
        const arrSize = size.split(' ');
        let valueSize = Number(arrSize[0]);
        const labelSize = arrSize[1];
        const startTime = new Date();
        const dir = fs.readdirSync(pathFolderSource);
        for (let i = 0; i < dir.length; i++) {
            valueSize = Number(arrSize[0]);
            stats = fs.lstatSync(`${pathFolderSource}/${dir[i]}`);
            if(!stats.isDirectory()){
                sizes = convertBytes(stats.size);
                switch (labelSize) {
                    case 'KB':
                        valueSize *= 1024;
                        break;
                    case 'MB':
                        valueSize *= 1024 * 1024;
                        break;
                    case 'GB':
                        valueSize *= 1024 * 1024 * 1024;
                        break;
                    case 'TB':
                        valueSize *= 1024 * 1024 * 1024 * 1024;
                        break;
                    default:
                        valueSize = valueSize;
                        break;
                }
                if(!isEmpty(searchFiles)){
                    if(stats.size >= valueSize && dir[i].includes(searchFiles)){
                        if(withMove){
                            // rename sudah menghapus file di path source, dipindah ke path dest
                            fs.renameSync(`${pathFolderSource}${dir[i]}`, `${pathFolderDest}${dir[i]}`);
                        }
                        fileData.push(`${dir[i]} - ${sizes}`);
                        total++;
                    }
                } else {
                    if(stats.size >= valueSize){
                        if(withMove){
                            // rename sudah menghapus file di path source, dipindah ke path dest
                            fs.renameSync(`${pathFolderSource}${dir[i]}`, `${pathFolderDest}${dir[i]}`);
                        }
                        fileData.push(`${dir[i]} - ${sizes}`);
                        total++;
                    }
                }
            }
        }
        const endTime = new Date();
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
        const result = {
            filenames: fileData,
            total,
            duration: `${duration} ms`,
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function resizeImage (req, res) {
    try {
        const { pathFolderSource, pathFolderDestination, imageQuality } = req.body;
        let fileData = [];
        let total = 0;
        let endTime, duration, startTime, file, stats, statsDest;
        const totalStartTime = new Date();
        const dir = fs.readdirSync(pathFolderSource);
        console.log('Total file with directory: ', dir.length);
        for (let i = 0; i < dir.length; i++) {
            stats = fs.lstatSync(`${pathFolderSource}${dir[i]}`);
            if(!stats.isDirectory()){
                startTime = new Date();
                total += 1;
                await jimp.read(`${pathFolderSource}${dir[i]}`)
                .then(image => {
                    return image
                        .quality(imageQuality)
                        .write(`${pathFolderDestination}${dir[i]}`);
                })
                .catch(err => {
                    console.log(err);
                })
                endTime = new Date();
                duration = (endTime.getTime() - startTime.getTime()) / 1000;
                file = `${pathFolderSource}${dir[i]} - ${duration} ms - ${convertBytes(stats.size)}`;
                fileData.push(file);
                console.log(`${i+1} -> ${file}`);
            }
        }
        const totalEndTime = new Date();
        const totalDuration = totalEndTime.getTime() - totalStartTime.getTime();
        const diffMins = Math.round(((totalDuration % 86400000) % 3600000) / 60000); // minutes
        const result = {
            status: 'Success',
            code: 200,
            data: {
                filenames: fileData,
                total,
                duration: `${diffMins} minutes` 
            }
        }

        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  
    if (bytes == 0) {
      return "n/a"
    }
  
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  
    if (i == 0) {
      return bytes + " " + sizes[i]
    }
  
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}

module.exports = {
    listFiles,
    renameFiles,
    moveFileWithSize,
    resizeImage,
    listFilesByFolder,
};