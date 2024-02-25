'use strict'

const NodeClam = require('clamscan');

class FileScanner {

    #scanner

    async init() {
        this.#scanner = await new NodeClam().init({
            clamdscan: {
                // socket: '/var/run/clamd.scan/clamd.sock',
                host: '127.0.0.1',
                port: 3310,
            }
        });
        return this;
    }

    async scan(stream) {
        return await this.#scanner.scanStream(stream);
    }

    async isInfected(filePath) {
        return await this.#scanner.isInfected(filePath);
    }

}

module.exports = new FileScanner()