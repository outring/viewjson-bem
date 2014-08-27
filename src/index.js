var _defaults = require("lodash.defaults");
var _isArray = require("lodash.isarray");

var defaultBemOptions = {
    enableCls: false,
    jsAttr: "onclick",
    elemSeparator: "__",
    modSeparator: "_",
    modValSeparator: "_"
};

function getBemClasses(block, elem, mod, bemOptions) {
    var classes = [];

    var baseClass = !elem ? block : block + bemOptions.elemSeparator + elem;
    classes.push(baseClass);

    if (mod !== undefined) {
        for (var modName in mod) {
            var modVal = mod[modName];
            if (modVal !== undefined && modVal !== null) {
                classes.push(baseClass + bemOptions.modSeparator + modName + bemOptions.modValSeparator + modVal);
            }
        }
    }

    return classes.join(" ");
}

function getJsOptions(js) {
    return js === true ? {} : js;
}

module.exports = function (bemOptions) {
    bemOptions = _defaults({}, bemOptions, defaultBemOptions);

    return function (current, scope, options) {
        if (scope.type !== "object") {
            return current;
        }

        if (current.bem === false) {
            return current;
        }

        var jsOptions = {};
        var jsEnabled = false;

        var classes = [];

        scope.bemBlock = current.block || scope.bemBlock;
        if (current.block !== undefined || current.elem !== undefined) {
            classes.push(getBemClasses(
                scope.bemBlock,
                current.elem,
                current.mod,
                bemOptions
            ));
        }

        if (current.js && current.block !== undefined) {
            jsOptions[current.block] = getJsOptions(current.js);
            jsEnabled = true;
        }

        if (scope.bemBlock !== undefined) {
            var mix = current.mix || [];
            if (!_isArray(mix)) {
                mix = [mix];
            }

            for (var i = 0; i < mix.length; i++) {
                var currentMix = mix[i];

                if (currentMix.block !== undefined || currentMix.elem !== undefined) {
                    classes.push(getBemClasses(
                        (currentMix.block || scope.bemBlock),
                        currentMix.elem,
                        currentMix.mod,
                        bemOptions
                    ));
                }

                if (currentMix.js && currentMix.block !== undefined) {
                    jsOptions[currentMix.block] = getJsOptions(currentMix.js);
                    jsEnabled = true;
                }
            }
        }

        if (jsEnabled) {
            classes.push("i-bem");

            if (!current.attr) {
                current.attr = {};
            }
            current.attr[current.jsAttr || bemOptions.jsAttr] = "return " + JSON.stringify(jsOptions);
        }

        if (bemOptions.enableCls) {
            current.class = current.cls;
        }

        if (classes.length) {
            current.class = classes.join(" ") + (current.class ? " " + current.class : "");
        }

        return current;
    };
};