'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports = class File {
    constructor(input) {
        if ('string' === typeof input) {
            this.path = input;
        } else {
            Object.keys(input).forEach((k) => this[k] = input[k]);
        }

        this.name = this.name || path.basename(this.path || '');

        if (!this.name) {
            throw new Error('No name');
        }

        this.type = this.type || mime.getType(this.name);

        if (!this.path) {
            if (this.buffer) {
                this.size = this.buffer.length;
            } else if (!this.stream) {
                throw new Error('No input, nor stream, nor buffer.');
            }

            return;
        }

        if (!this.jsdom) {
            return;
        }

        if (!this.async) {
            updateStat(fs.statSync(this.path));
        } else {
            fs.stat(this.path, function (err, stat) {
                updateStat(stat);
            });
        }
    }

    updateStat(stat) {
        this.stat = stat;
        this.lastModifiedDate = this.stat.mtime;
        this.size = this.stat.size;
    }
}; 
