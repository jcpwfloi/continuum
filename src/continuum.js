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

        this.option = {};
        this.supportDirectory = /Chrome/.test(window.navigator.userAgent);
        this.files = []; // File Objects
        this.defaults = {
            chunkSize: 1024 * 1024,
            enableFlashUpload: true
        };

        this.option = extend(this.option, this.defaults, opts);
    }

    Continuum.prototype = {
        assignDrop: function(obj) {
            var $ = this;
            var drop = obj;

            function cancel(e) {
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            }

            // Tells the browser that we *can* drop on this target
            addEventHandler(drop, 'dragover', cancel);
            addEventHandler(drop, 'dragenter', cancel);

            addEventHandler(drop, 'drop', function (e) {
                e = e || window.event; // get window.event if e argument missing (in IE)   
                if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

                var dt = e.dataTransfer, files = dt.files;

                for (var i = 0; i < files.length; ++ i) {
                    var file = files[i];
                    var reader = new FileReader();

                    $.parseFile(file);
                }
                return false;
            });
        }
    };

    function preventDefaultEvent(event) {
        event.preventDefault();
    }

    function ContinuumFile(continuumObj, file) {
        this.continuumObj = continuumObj;
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

    function extend(dest) {
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

    function addEventHandler(obj, evt, handler) {
        if(obj.addEventListener) {
            // W3C method
            obj.addEventListener(evt, handler, false);
        } else if(obj.attachEvent) {
            // IE method.
            obj.attachEvent('on'+evt, handler);
        } else {
            // Old school method.
            obj['on'+evt] = handler;
        }
    }

    Continuum.extend = extend;

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

