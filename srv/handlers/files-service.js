'use strict';

const cds = require('@sap/cds');
const serviceConstants = require('../constants/services');
const fs = require('fs');
const scanner = require('../utils/file-scanner.js');
const Stream = require('stream')

class FilesService extends cds.ApplicationService {
    async init() {
        this.before('CREATE', serviceConstants.FilesEntity.Files, this.#beforeFileCreate);
        this.after('CREATE', serviceConstants.FilesEntity.Files, this.#afterFileCreate);
        this.on('UPDATE', serviceConstants.FilesEntity.Files, this.#onFileUpload);
        this.on('READ', serviceConstants.FilesEntity.Files, this.#onFileDownload);
        this.after('DELETE', serviceConstants.FilesEntity.Files, this.#afterFileDelete);
        await scanner.init();
        return super.init();
    }

    #beforeFileCreate(req) {
        // validate name attribute is presented
        if (!Object.hasOwn(req.data, 'name')) {
            req.reject(400, 'No name provided');
        }
    }

    async #afterFileCreate(result, req) {
        // update url content
        await cds.run(UPDATE.entity(serviceConstants.FilesEntity.FilesDb, result.ID)
            .with({url: `${serviceConstants.ApiPath}Files/${result.ID}/content`}));
    }

    async #onFileUpload(req, next) {
        // go to the next if no ID
        if (!req.data.ID) {
            return next();
        }
        // get path for the request
        const url = req._.req.path;
        // if ends with content -> the request is for content upload
        if (url.endsWith('/content')) {
            // TODO: has to be checked and replaced with current logic as better to check stream instead of file
            // const readableStream = new Stream.Readable();
            // req.data.content.pipe(readableStream);
            // const res = await scanner.scan(req.data.content);
            // console.log(res);
            // update mediaType and persist file into the system
            await cds.run(UPDATE.entity(serviceConstants.FilesEntity.FilesDb, req.data.ID)
                .with({mediaType: req.data.mediaType}));
            const fileName = `/tmp/${req.data.ID}`;
            req.data.content.pipe(fs.createWriteStream(fileName, {flags: 'w'}));
            const scanResult = await scanner.isInfected(fileName);
            if (scanResult.isInfected) {
                // remove file and notify user
                await fs.unlinkSync(fileName);
                req.reject(400, 'FIle infected');
            }
        } else {
            // in any other cases perform simple update
            return next();
        }
    }

    async #onFileDownload(req, next) {
        // go to the next if no ID
        if (!req.data.ID) {
            return next();
        }
        // get path for the request
        const url = req._.req.path;
        // if ends with content -> the request is for content download
        if (url.endsWith('/content')) {
            // get media type from DB
            const mediaType = await cds.run(SELECT.from(serviceConstants.FilesEntity.FilesDb, req.data.ID).columns('mediaType'));
            // fill in media type + value as stream for data
            return {mediaType: mediaType.mediaType, value: fs.createReadStream(`/tmp/${req.data.ID}`)};
        } else {
            // in any other cases perform simple get
            return next();
        }
    }

    async #afterFileDelete(req) {
        // remove file from the system after db deletion
        await fs.unlinkSync(`/tmp/${req.data.ID}`);
    }

}

module.exports = FilesService;