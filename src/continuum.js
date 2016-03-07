/**
 * @license MIT
 */
(function(window, document, undefined) {'use strict';
    var ie10plus = window.navigator.msPointerEnabled;
    /**
     * Continuum.js is a library providing fault-tolerant, resumable,
     * simultaneous, uploads via HTML File API.
     * @param {opts}
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

        var $ = this;

        $.support = (
            typeof File !== 'undefined' &&
            typeof Blob !== 'undefined' &&
            typeof FileList !== 'undefined' &&
            (
             !!Blob.prototype.slice || !!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice ||
             false
            ) //file slicing support
        );

        if (!$.support) {
            return;
        }

        $.supportDirectory = /Chrome/.test(window.navigator.userAgent);
        $.files = []; // File Objects
        $.defaults = {
            chunkSize: 1024 * 1024,
            enableFlashUpload: true
        };
    }

    Continuum.prototype = {
    };

    function ContinuumFile(continuumObj, file) {
        var $ = this;
        $.continuumObj = continuumObj;
    }

    ContinuumFile.prototype = {
    };

    Continuum.version = '0.0.1';

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Continum;
    } else {
        window.Continuum = Continuum;
        if (typeof define === "function" && define.amd) {
            define("continuum", [], function() { return Continuum; });
        }
    }

})(window, document);

