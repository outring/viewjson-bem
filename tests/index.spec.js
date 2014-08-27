var viewJson = require("viewjson");
var bemViewJson = require("../src");

function getOptions(bemOptions) {
    return { transforms: [bemViewJson(bemOptions || {})] };
}

describe("ViewJson BEM-plugin", function () {

    it("must not do anything if bem disabled", function () {
        expect(viewJson.render({ block: "block", elem: "elem", bem: false }, getOptions()))
            .toEqual("<div></div>");
    });

    describe("classes generation", function () {

        it("must not alias cls to class by default", function () {
            expect(viewJson.render({ block: "block", class: "customBase", cls: "customOverride" }, getOptions()))
                .toEqual("<div class=\"block customBase\"></div>");
        });

        it("must alias cls to class if enabled", function () {
            expect(viewJson.render({ block: "block", class: "customBase", cls: "customOverride" },
                getOptions({ enableCls: true })))
                .toEqual("<div class=\"block customOverride\"></div>");
        });

        it("must pass block name to class", function () {
            expect(viewJson.render({ block: "block" }, getOptions()))
                .toEqual("<div class=\"block\"></div>");
        });

        it("must concatenate block and element name", function () {
            expect(viewJson.render({ block: "block", elem: "elem" }, getOptions()))
                .toEqual("<div class=\"block__elem\"></div>");
        });

        it("must concatenate block and child element name", function () {
            expect(viewJson.render({ block: "block", content: { elem: "elem" } }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"block__elem\"></div></div>");
        });

        it("must not concatenate block and child block name", function () {
            expect(viewJson.render({ block: "block", content: { block: "childBlock" } }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"childBlock\"></div></div>");
        });

        it("must not add block and to non-element child", function () {
            expect(viewJson.render({ block: "block", content: { } }, getOptions()))
                .toEqual("<div class=\"block\"><div></div></div>");
        });

        it("must not concatenate block and child block element name", function () {
            expect(viewJson.render({ block: "block", content: { block: "childBlock", elem: "elem" } }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"childBlock__elem\"></div></div>");
        });

        it("must not concatenate block and child block child element name", function () {
            expect(viewJson.render({ block: "block", content: { block: "childBlock", content: { elem: "elem" } } }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"childBlock\"><div class=\"childBlock__elem\"></div></div></div>");
        });

        it("must concatenate block and mods", function () {
            expect(viewJson.render({ block: "block", mod: { modName: "modVal", modName2: "modVal2" }  }, getOptions()))
                .toEqual("<div class=\"block block_modName_modVal block_modName2_modVal2\"></div>");
        });

        it("must concatenate block element and mods", function () {
            expect(viewJson.render({ block: "block", elem: "elem", mod: { modName: "modVal", modName2: "modVal2" }  }, getOptions()))
                .toEqual("<div class=\"block__elem block__elem_modName_modVal block__elem_modName2_modVal2\"></div>");
        });

        it("must not add null and undefined mod values to block", function () {
            expect(viewJson.render({ block: "block", mod: { modName: null, modName2: undefined }  }, getOptions()))
                .toEqual("<div class=\"block\"></div>");
        });

        it("must not add null and undefined mod values to elem", function () {
            expect(viewJson.render({ block: "block", elem: "elem", mod: { modName: null, modName2: undefined }  }, getOptions()))
                .toEqual("<div class=\"block__elem\"></div>");
        });

        it("must add mix block name to class", function () {
            expect(viewJson.render({ block: "block", mix: { block: "mixBlock" } }, getOptions()))
                .toEqual("<div class=\"block mixBlock\"></div>");
        });

        it("must add multiple mix blocks names to class", function () {
            expect(viewJson.render({ block: "block", mix: [
                { block: "mixBlock" },
                { block: "mixBlock2" }
            ] }, getOptions()))
                .toEqual("<div class=\"block mixBlock mixBlock2\"></div>");
        });

        it("must add mix block element name to class", function () {
            expect(viewJson.render({ block: "block", mix: { block: "mixBlock", elem: "mixElem" } }, getOptions()))
                .toEqual("<div class=\"block mixBlock__mixElem\"></div>");
        });

        it("must add mix element name to class", function () {
            expect(viewJson.render({ block: "block", mix: { elem: "mixElem" } }, getOptions()))
                .toEqual("<div class=\"block block__mixElem\"></div>");
        });

        it("must not add mix when no block to class", function () {
            expect(viewJson.render({ mix: { elem: "mixElem" } }, getOptions()))
                .toEqual("<div></div>");
        });

        it("must add mix block with mod to class", function () {
            expect(viewJson.render({ block: "block", mix: { block: "mixBlock", mod: { mixModName: "mixModVal" } } }, getOptions()))
                .toEqual("<div class=\"block mixBlock mixBlock_mixModName_mixModVal\"></div>");
        });

        it("must not add anything with empty mix", function () {
            expect(viewJson.render({ block: "block", mix: {} }, getOptions()))
                .toEqual("<div class=\"block\"></div>");
        });

        it("must respect naming options", function () {
            expect(viewJson.render({ block: "block", elem: "elem", mod: { modName: "modVal" } },
                getOptions({ elemSeparator: "1", modSeparator: "2", modValSeparator: "3" })))
                .toEqual("<div class=\"block1elem block1elem2modName3modVal\"></div>");
        });

        it("must share block name only to children naming options", function () {
            expect(viewJson.render({
                block: "block", content: [
                    { block: "childBlock" },
                    { elem: "elem" }
                ]
            }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"childBlock\"></div><div class=\"block__elem\"></div></div>");
        });

        it("must share block name even to deep children", function () {
            expect(viewJson.render({ block: "block", content: { elem: "elem", content: { elem: "deepElem" } } }, getOptions()))
                .toEqual("<div class=\"block\"><div class=\"block__elem\"><div class=\"block__deepElem\"></div></div></div>");
        });

    });

    describe("js-attributes generation", function () {

        it("must add i-bem class and onclick attribute if js enabled", function () {
            expect(viewJson.render({ block: "block", js: true }, getOptions()))
                .toEqual("<div onclick=\"return {&quot;block&quot;:{}}\" class=\"block i-bem\"></div>");
        });

        it("must pass js-options", function () {
            expect(viewJson.render({ block: "block", js: { opt1: 0, opt2: "string" } }, getOptions()))
                .toEqual("<div onclick=\"return {&quot;block&quot;:{&quot;opt1&quot;:0,&quot;opt2&quot;:&quot;string&quot;}}\" class=\"block i-bem\"></div>");
        });

        it("must add i-bem class and onclick attribute if js in mix enabled", function () {
            expect(viewJson.render({ block: "block", mix: { block: "mixBlock", js: true } }, getOptions()))
                .toEqual("<div onclick=\"return {&quot;mixBlock&quot;:{}}\" class=\"block mixBlock i-bem\"></div>");
        });

        it("must pass js-options from mix", function () {
            expect(viewJson.render({ block: "block", mix: { block: "mixBlock", js: { opt1: 0, opt2: "string" } } }, getOptions()))
                .toEqual("<div onclick=\"return {&quot;mixBlock&quot;:{&quot;opt1&quot;:0,&quot;opt2&quot;:&quot;string&quot;}}\" class=\"block mixBlock i-bem\"></div>");
        });

        it("must add i-bem class and all onclick attribute options", function () {
            expect(viewJson.render({ block: "block", js: true, mix: { block: "mixBlock", js: true } }, getOptions()))
                .toEqual("<div onclick=\"return {&quot;block&quot;:{},&quot;mixBlock&quot;:{}}\" class=\"block mixBlock i-bem\"></div>");
        });

        it("must not add i-bem class and onclick options if no block specified", function () {
            expect(viewJson.render({ js: true }, getOptions()))
                .toEqual("<div></div>");
        });

        it("must respect jsAttr", function () {
            expect(viewJson.render({ block: "block", js: true, jsAttr: "ondblclick" }, getOptions()))
                .toEqual("<div ondblclick=\"return {&quot;block&quot;:{}}\" class=\"block i-bem\"></div>");
        });

        it("must respect jsAttr from options", function () {
            expect(viewJson.render({ block: "block", js: true }, getOptions({ jsAttr: "ondblclick" })))
                .toEqual("<div ondblclick=\"return {&quot;block&quot;:{}}\" class=\"block i-bem\"></div>");
        });

    });

});