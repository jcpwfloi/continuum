/**
 * @license MIT
 */
(function(window, document, undefined) {'use strict';
    var ie10plus = window.navigator.msPointerEnabled;
    /**
     * Continuum.js is a library providing fault-tolerant, resumable,
     * simultaneous, uploads via HTML File API.
     * @param [opts]
     * @param {number}
     * @param {bool}
     * @param {number}
     * @constructor
     */
    function Continuum (opts) {
        /**
         * Browser Compatability Support
         * @type {boolean}
         */
        this.support = (
            typeof File !== 'undefined' &&
            typeof Blob !== 'undefined' &&
            typeof FileList !== 'undefined' &&
            (
             !!Blob.prototype.slice || !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice ||
             false
            ) //file slicing support
        );

        if (!this.support) {
            return;
        }

        this.supportDirectory = /Chrome/.test(window.navigator.userAgent);
        this.files = []; // File Objects
        this.defaults = {
            chunkSize: 1024 * 1024,
            enableFlashUpload: true
        };
    }
})(window, document);
