/*!
 * Issuecon - A script for drawing current issue's number in the Favicon.
 *
 * Based on Tinycon - A small library for manipulating the Favicon
 * by Tom Moor, http://tommoor.com
 */

(function()
{
    var Issuecon = {},
        currentFavicon = null,
        faviconImage = null,
        canvas = null,
        options = {},
        agent = navigator.userAgent.toLowerCase(),
        ratio = window.devicePixelRatio || 1,
        size = 16 * ratio,
        pngbase64 = "data:image/png;base64,iVBORw0KGgo",
        digitsSprite1x = "AAAANSUhEUgAAACwAAAAFBAMAAADMCRPMAAAAHlBMVEUAAAD///////////////////////////////////8kfJuVAAAACXRSTlMATYOHaahbOBeT70QpAAAAWElEQVQIHQXBoQ2AQBBE0bkEs24TBDm3djUNUAIWTS/of3K65T11WU4nmCnT1bUdgtBgAAgJgP0UhGZG2k5XqKvZLkFoaSAGiyUQ76kuY5zCNQs996zv+gGMQSG+eLTQeQAAAABJRU5ErkJggg==",
        digitsSprite2x = "AAAANSUhEUgAAAFgAAAAKAgMAAABNvXFbAAAACVBMVEUAAAD///////9zeKVjAAAAAnRSTlMAgJsrThgAAAB5SURBVAjXTc/BCQQxDANAEe6V132uB+F6rqCUIvZlUuXKMSyLMSiDMTFCY4VC0M5wnwyIc4nikJy7Pl/HWCA4i4GHcyy/yRf//rjMY3lW2wWFzvSmsabkdhYjzelI887iCRG15EyYoYe9pJkyq7l/EoqsI4Y7NNHn3IxoQ0l3SlQmAAAAAElFTkSuQmCC",
        hash = 10,
        digitImage,
        digitsSprite = pngbase64 + (ratio > 1 ? digitsSprite2x : digitsSprite1x),
        digitWidth = 4 * ratio,
        digitHeight = 5 * ratio,
        digitMargin = 2 * ratio,
        digitPadding = 2 * ratio,
        shiftX = size - (digitWidth + digitPadding - 1),
        shiftY = size - (digitHeight + digitPadding),
        digitsWritten = 0;

    var defaults = {
        colorBy: "tracker",
        backgroundDefault: "rgba(200, 0, 0, 0.9)",
        backgrounds: {
            1: "rgba(231, 76, 60, 0.9)",
            2: "rgba(64, 154, 227, 0.9)",
            3: "rgba(1, 152, 81, 0.9)",
            4: "rgba(88, 68, 146, 0.9)",
            5: "rgba(237, 130, 12, 0.9)",
            6: "rgba(32, 153, 154, 0.9)",
            7: "rgba(162, 99, 79, 0.9)"
        },
        crossOrigin: true
    };

    var ua = (function()
    {
        // New function has access to 'agent' via closure
        return function (browser)
        {
            return agent.indexOf(browser) !== -1;
        };
    }());

    var browser = {
        ie: ua("msie"),
        chrome: ua("chrome"),
        webkit: ua("chrome") || ua("safari"),
        safari: ua("safari") && !ua("chrome"),
        mozilla: ua("mozilla") && !ua("chrome") && !ua("safari"),
        winnt: ua("windows nt")
    };

    var getFaviconTag = function()
    {
        var links = document.getElementsByTagName("link");

        for (var i = 0, len = links.length; i < len; i++)
        {
            if ((links[i].getAttribute("rel") || "").match(/\bicon\b/))
            {
                return links[i];
            }
        }

        return false;
    };

    var removeFaviconTag = function()
    {
        var links = document.getElementsByTagName("link");
        var head = document.getElementsByTagName("head")[0];

        for (var i = 0, len = links.length; i < len; i++)
        {
            var exists = (typeof(links[i]) !== "undefined");

            if (exists && (links[i].getAttribute("rel") || "").match(/\bicon\b/))
            {
                head.removeChild(links[i]);
            }
        }
    };

    var getCurrentFavicon = function()
    {
        if (!currentFavicon)
        {
            var tag = getFaviconTag();
            currentFavicon = tag ? tag.getAttribute("href") : "/favicon.ico";
        }

        return currentFavicon;
    };

    var getCanvas = function()
    {
        if (!canvas)
        {
            canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
        }

        return canvas;
    };

    var refreshFavicon = function()
    {
        setFaviconTag(getCanvas().toDataURL());
    };

    var setFaviconTag = function(url)
    {
        removeFaviconTag();

        var link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    var drawFavicon = function(label, background)
    {
        var context = getCanvas().getContext("2d");
        var src = getCurrentFavicon();

        faviconImage = document.createElement("img");
        faviconImage.onload = function()
        {
            // clear canvas
            context.clearRect(0, 0, size, size);

            // draw the favicon
            context.drawImage(faviconImage, 0, 0, faviconImage.width, faviconImage.height, 0, 0, size, size);

            // draw bubble over the top
            var labelLength = (label + "").length;
            if (labelLength > 0)
            {
                drawBubble(context, background);

                digitImage = new Image();
                digitImage.src = digitsSprite;

                var breakDigits = labelLength === 4 ? 2 : 3;

                for (var i = labelLength - 1; i >= 0; i--)
                {
                    drawDigit(context, label[i], breakDigits);
                }

                if (labelLength < 6)
                {
                    drawDigit(context, hash, breakDigits);
                }
            }

            // refresh tag in page
            refreshFavicon();
        };

        // allow cross origin resource requests if the image is not a data:uri
        // as detailed here: https://github.com/mrdoob/three.js/issues/1305
        if (!src.match(/^data/) && options.crossOrigin)
        {
            faviconImage.crossOrigin = "anonymous";
        }

        faviconImage.src = src;
    };

    var drawBubble = function(context, background)
    {
        var top = 0,
            left = 0,
            bottom = size,
            right = size,
            radius = 2 * ratio;

        context.fillStyle = background;

        // bubble
        context.beginPath();
        context.moveTo(left + radius, top);
        context.quadraticCurveTo(left, top, left, top + radius);
        context.lineTo(left, bottom - radius);
        context.quadraticCurveTo(left, bottom, left + radius, bottom);
        context.lineTo(right - radius, bottom);
        context.quadraticCurveTo(right, bottom, right, bottom - radius);
        context.lineTo(right, top + radius);
        context.quadraticCurveTo(right, top, right - radius, top);
        context.closePath();
        context.fill();

        // bottom shadow
        context.beginPath();
        context.strokeStyle = "rgba(0,0,0,0.3)";
        context.moveTo(left + radius / 2.0, bottom);
        context.lineTo(right - radius / 2.0, bottom);
        context.closePath();
        context.stroke();
    };

    var drawDigit = function(context, digit, newline)
    {
        digit = parseInt(digit, 10);

        context.drawImage(digitImage, digit * digitWidth, 0,
                            digitWidth, digitHeight,
                            shiftX, shiftY,
                            digitWidth, digitHeight);
        shiftX -= (digitWidth);
        digitsWritten++;

        if (digitsWritten === newline)
        {
            shiftX = size - (digitWidth + digitPadding - 1);
            shiftY -= (digitHeight + digitMargin);
        }
    };

    var getIssueNumber = function()
    {
        var header = $("#content > h2:first").text(),
            number = "";

        if (header)
        {
            number = header.replace(/^.*?#/, "");
        }

        return number;
    };

    var getBackground = function()
    {
        var issueClass = $("#content > .issue:first").attr("class"),
            match = false, variant = 0, regex;

        if (issueClass && options.colorBy)
        {
            regex = new RegExp("\\s" + options.colorBy + "-(\\d+?)\\s");
            match = issueClass.match(regex);

            if (match && match[1])
            {
                variant = match[1];
            }
        }

        if (options.backgrounds && options.backgrounds[variant])
        {
            return options.backgrounds[variant];
        }

        return options.backgroundDefault || "#555";
    };

    Issuecon.setOptions = function(custom)
    {
        options = {};

        for (var key in defaults)
        {
            options[key] = custom.hasOwnProperty(key) ? custom[key] : defaults[key];
        }

        return this;
    };

    Issuecon.setFavicon = function()
    {
        // check support
        if (!getCanvas().getContext) return this;

        var label = getIssueNumber(),
            background = getBackground();

        if (label)
        {
            drawFavicon(label, background);
        }

        return this;
    };

    Issuecon.setOptions(defaults);
    window.Issuecon = Issuecon;
})();

$(function()
{
    Issuecon.setFavicon();
});
