var ResourceLoader = (function (Blob, BlobBuilder) {
    "use strict";

    var ResourceType = {
        IMAGE: 0,
        SOUND: 1,
        JSON: 2,
        FONT: 3
    };

    function ResourceLoader() {
        this.resources = [];
        this.resourcesLoaded = 0;
    }

    ResourceLoader.prototype.addImage = function (imgSrc) {
        var img = new Image();
        this.resources.push({
            type: ResourceType.IMAGE,
            file: img,
            src: imgSrc
        });

        return img;
    };

    ResourceLoader.prototype.addJSON = function (jsonSrc) {
        var jsonObject = {};
        this.resources.push({
            type: ResourceType.JSON,
            file: jsonObject,
            src: jsonSrc
        });

        return jsonObject;
    };

    ResourceLoader.prototype.addFont = function (fontSrc) {
        var font = {};
        this.resources.push({
            type: ResourceType.FONT,
            file: font,
            src: fontSrc
        });

        return font;
    };

    ResourceLoader.prototype.load = function () {
        var self = this;
        self.resources.forEach(function (elem) {

            if (elem.type === ResourceType.IMAGE) {
                elem.file.onload = function () {
                    self.onResourceLoad();
                };
                elem.file.src = elem.src;

            } else if (elem.type === ResourceType.JSON) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", elem.src, true);

                xhr.onload = function () {
                    var json = JSON.parse(this.responseText);
                    for (var k in json) {
                        if (json.hasOwnProperty(k)) {
                            elem.file[k] = json[k];
                        }
                    }
                    self.onResourceLoad();
                };
                xhr.send();

            } else if (elem.type === ResourceType.FONT) {
                var xhrFont = new XMLHttpRequest();
                xhrFont.open("GET", elem.src, true);
                xhrFont.responseType = "arraybuffer";

                xhrFont.onload = function () {

                    if (BlobBuilder) {
                        var blobBuilder = new BlobBuilder();
                        blobBuilder.append(xhrFont.response);
                        elem.file.blob = blobBuilder.getBlob();

                    } else if (Blob) {
                        elem.file.blob = new Blob([xhrFont.response], {type: "application/font-woff"});

                    } else {
                        // todo error blobs are not supported
                    }

                    self.onResourceLoad();
                };

                xhrFont.send();
            }
        });
    };

    ResourceLoader.prototype.onResourceLoad = function () {
        this.resourcesLoaded++;
        var onProgress = this.onProgress;
        if (onProgress !== undefined && typeof onProgress === "function")
            onProgress();

        if (this.resourcesLoaded === this.resources.length) {
            var onComplete = this.onComplete;
            if (onComplete !== undefined && typeof onComplete === "function")
                onComplete();
        }
    };

    return ResourceLoader;
})(Blob, window.WebKitBlobBuilder);