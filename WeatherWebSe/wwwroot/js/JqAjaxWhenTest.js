/// <reference path="deftyped/index.d.ts" />
/// <reference path="Common.ts" />
function onJqAjxWhenTestLoaded() {
    var apiUrl = $("#txtApiUrl").val().toString();
    var jqAjxWhenService = new Ajax.JqAjxWhenService(apiUrl);
    var model = new Common.JqAjxWhenTestModel();
    var jqAjxWhenTestController = new JqAjaxTest.JqAjxWhenTestController(jqAjxWhenService, model);
    jqAjxWhenTestController.init();
}
var JqAjaxTest;
(function (JqAjaxTest) {
    var JqAjxWhenTestController = /** @class */ (function () {
        function JqAjxWhenTestController(jqAjxWhenService, model) {
            var _this = this;
            this.model = null;
            this.jqAjxWhenService = null;
            this.txtValue1 = 'txtValue1';
            this.txtValue2 = 'txtValue2';
            this.btnLoadForm = 'btnLoadForm';
            this.btnForm1 = 'btnForm1';
            this.btnForm2 = 'btnForm2';
            this.jqAjxWhenService = jqAjxWhenService;
            this.model = model;
            model.setOnModelUpdated(function (model) { return _this.updateGui(model); });
        }
        JqAjxWhenTestController.prototype.init = function () {
            var _this = this;
            var keys = [
                this.txtValue1,
                this.txtValue2,
                this.btnLoadForm,
                this.btnForm1,
                this.btnForm2
            ];
            this.model.init(keys);
            $('#' + this.btnLoadForm).click(function () {
                _this.model.setModelValue(_this.btnLoadForm, null, true);
                _this.model.setModelValue(_this.btnForm1, null, true);
                _this.model.setModelValue(_this.btnForm2, null, true);
                _this.model.setModelValue(_this.txtValue1, '');
                _this.model.setModelValue(_this.txtValue2, '');
                _this.loadForm();
            });
            $('#' + this.btnForm2).click(function () {
                _this.model.setModelValue(_this.btnLoadForm, null, true);
                _this.model.setModelValue(_this.btnForm1, null, true);
                _this.model.setModelValue(_this.btnForm2, null, true);
                _this.postForm2();
            });
            $('#' + this.btnForm1).click(function () {
                _this.model.setModelValue(_this.btnLoadForm, null, true);
                _this.model.setModelValue(_this.btnForm1, null, true);
                _this.model.setModelValue(_this.btnForm2, null, true);
                _this.postForm1();
            });
        };
        JqAjxWhenTestController.prototype.loadForm = function () {
            var _this = this;
            var getForm1Data = function () { return _this.jqAjxWhenService.getServerTime(5000); };
            var getForm2Data = function () { return _this.jqAjxWhenService.getServerTime(10000); };
            $.when(getForm1Data(), getForm2Data()).then(function (formData1, formData2) {
                return _this.onFormLoaded(formData1, formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.postForm1 = function () {
            var _this = this;
            var postForm1Data = function () {
                return _this.jqAjxWhenService.postServerTimes1(_this.model.getValue(_this.txtValue1).Value);
            };
            $.when(postForm1Data())
                .then(function (formData2) {
                return _this.onForm1Posted(formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.postForm2 = function () {
            var _this = this;
            var postForm2Data = function () {
                return _this.jqAjxWhenService.postServerTimes2(_this.model.getValue(_this.txtValue2).Value);
            };
            $.when(postForm2Data())
                .then(function (formData2) {
                return _this.onForm2Posted(formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.onForm1Posted = function (formData1, model) {
            model.setModelValue(this.txtValue1, formData1.txtValue1);
            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        };
        JqAjxWhenTestController.prototype.onForm2Posted = function (formData2, model) {
            model.setModelValue(this.txtValue2, formData2.txtValue2);
            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        };
        JqAjxWhenTestController.prototype.onFormLoaded = function (formData1, formData2, model) {
            var form1Obj = Ajax.Convert.ArrayToObject(formData1);
            var modelForm1 = form1Obj.success;
            model.setModelValue(this.txtValue1, modelForm1.result);
            var form2Obj = Ajax.Convert.ArrayToObject(formData2);
            var modelForm2 = form2Obj.success;
            model.setModelValue(this.txtValue2, modelForm2.result);
            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        };
        JqAjxWhenTestController.prototype.updateGuiValues = function (model) {
            var txtValue1 = model.getValue(this.txtValue1).Value;
            $('#' + this.txtValue1).val(txtValue1);
            var txtValue2 = model.getValue(this.txtValue2).Value;
            $('#' + this.txtValue2).val(txtValue2);
        };
        JqAjxWhenTestController.prototype.updateGui = function (model) {
            this.updateGuiValues(model);
            var btnLoadFormDisable = model.getValue(this.btnLoadForm).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnLoadForm).attr('id'), btnLoadFormDisable);
            var btnForm1Disable = model.getValue(this.btnForm1).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm1).attr('id'), btnForm1Disable);
            var btnForm2Disable = model.getValue(this.btnForm2).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm2).attr('id'), btnForm2Disable);
        };
        return JqAjxWhenTestController;
    }());
    JqAjaxTest.JqAjxWhenTestController = JqAjxWhenTestController;
})(JqAjaxTest || (JqAjaxTest = {}));
//# sourceMappingURL=JqAjaxWhenTest.js.map