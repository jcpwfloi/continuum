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
        this.fileList = []; //File Objects
        this.supportDirectory = /Chrome/.test(window.navigator.userAgent);
        this.defaults = {
            chunkSize: 1024 * 1024,
            enableFlashUpload: true
        };

        this.option = extend(this.option, this.defaults, opts);
    }

    Continuum.prototype = {
        on: function(event, callback) {
            event = event.toLowerCase();
            if (!this.events.hasOwnProperty(event)) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },

        off: function(event, fn) {
            if (event !== undefined) {
                event = event.toLowercase();
                if (fn !== undefined) {
                    if (this.events.hasOwnProperty(event)) {
                        arrayRemove(this.events[event], fn);
                    }
                } else {
                    delete this.events[event];
                }
            } else {
                this.events = {};
            }
        },

        fire: function(event, args) {
            args = Array.prototype.slice.call(arguments);
            event = event.toLowerCase();
            var preventDefault = false;
            if (this.events.hasOwnProperty(event)) {
                each(this.events[event], function(callback) {
                    preventDefault = callback.apply(this, args.slice(1)) === false || preventDefault;
                }, this);
            }
            if (event != 'catchall') {
                args.unshift('catchAll')
                preventDefault = this.fire.apply(this, args) === false || preventDefault();
            }
            return !preventDefault;
        },

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

                $.fire('filereceive');

                for (var i = 0; i < files.length; ++ i) {
                    var file = files[i];

                    $.fileList.push(new ContinuumFile(file));
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
        } else if (obj.attachEvent) {
            // IE method.
            obj.attachEvent('on' + evt, handler);
        } else {
            // Old school method.
            obj['on' + evt] = handler;
        }
    }

    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
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

