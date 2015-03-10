# Redmine issue number favicon

Displays currently viewed issue's number in the favicon.

*Note*: do not confuse this with the [Issue favicon plugin](http://www.redmine.org/plugins/redmine_issue_favicon).

## Installation

Just put `redmine_issue_number_favicon` folder into your Redmine's `plugins` folder and restart Redmine.

## Customization

In `redmine_issue_number_favicon/assets/javascripts` folder create a file called `custom.js`. Now you can put a code customizing plugin to your needs, e.g.:

    (function()
    {
        Issuecon.setOptions({
            colorBy: "priority",
            backgrounds: {
                1: "#00ab00",
                2: "#787878",
                3: "#0056ab",
                4: "#985200",
                5: "#ab0000",
            }
        });
    })();

Available options are:

* `colorBy`

    Decides which attribute should influence the favicon's background color. Basically it's the name of the class of `div.issue`. If empty, coloring will be ignored.

    **Default**: "tracker"

* `backgroundDefault`

    Default background value if colorBy is empty or the corresponding custom background is not set.

    **Default**: "rgba(200, 0, 0, 0.9)"

* `backgrounds`

    Hash of background colors. The hash's key is the "id" of attribute specified by `colorBy` option, e.g. when `colorBy` is set to "status" and `div.issue` has a class status-2, color at `backgrounds[2]` will be used.

    **Default**: hash of colors compatible with [PurpleMine 2 theme][PurpleMine].

* `crossOrigin`

    Allow cross origin resource requests if the image is not a data:uri as detailed here: https://github.com/mrdoob/three.js/issues/1305

    **Default**: `true`

## License

[WTFPL](http://www.wtfpl.net/)

[PurpleMine]: https://github.com/HolonGlobe/PurpleMine2