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

        $.option = {};
        $.supportDirectory = /Chrome/.test(window.navigator.userAgent);
        $.files = []; // File Objects
        $.defaults = {
            chunkSize: 1024 * 1024,
            enableFlashUpload: true
        };
        $.option = $.extend($.option, $.defaults, opts);
    }

    Continuum.prototype = {
        assignDrop: function(obj) {
            var $ = this;
            obj.ondrop = function(event) {
                preventDefaultEvent(event);
                if (event.dataTransfer && e.dataTransfer.files.length != 0) {
                    var files = e.dataTransfer.files;
                    console.log(files);
                }
            }
        }
    };

    function preventDefaultEvent(event) {
        event.preventDefault();
    }

    function ContinuumFile(continuumObj, file) {
        var $ = this;
        $.continuumObj = continuumObj;
    }

    ContinuumFile.prototype = {
    };

    /**
     * Iterate each element of an object
     * @function
     * @param {Array|Object} obj object or an array to iterate
     * @param {Function} callback callback(value, key)
     * @param {Object=} context Object to become context (`this`) for the iterator function
     */
    function each(obj, callback, context) {
        if (!obj) return;
        var key;
        if (typeof(obj.length) !== 'undefined') {
            for (key = 0; key < obj.length; ++ key)
                if (callback.call(context, obj[key], key) === false)
                    return;
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key) && callback.call(context, obj[key], key) === false) return;
            }
        }
    }

    Continuum.extend = function(dest) {
        var arg = arguments;
        each(arg, function(obj) {
            if (obj !== dest) {
                each(obj, function(value, key) {
                    dest[key] = value;
                });
            }
        });
        return dest;
    }

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

