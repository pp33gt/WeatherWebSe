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
            this.txtServerTime1 = 'txtServerTime1';
            this.txtServerTime2 = 'txtServerTime2';
            this.txtValue1 = 'txtValue1';
            this.txtValue2 = 'txtValue2';
            this.btnLoadForm = 'btnLoadForm';
            this.btnForm1 = 'btnForm1';
            this.btnForm2 = 'btnForm2';
            this.ulClientTimeHistory1 = 'ulClientTimeHistory1';
            this.ulClientTimeHistory2 = 'ulClientTimeHistory2';
            this.currentWeatherDataError1 = 'currentWeatherDataError1';
            this.currentWeatherDataError2 = 'currentWeatherDataError2';
            this.jqAjxWhenService = jqAjxWhenService;
            this.model = model;
            model.setOnModelUpdated(function (model) { return _this.updateGui(model); });
        }
        JqAjxWhenTestController.prototype.init = function () {
            var _this = this;
            var keys = [
                this.txtServerTime1,
                this.txtServerTime2,
                this.txtValue1,
                this.txtValue2,
                this.btnLoadForm,
                this.btnForm1,
                this.btnForm2,
                this.ulClientTimeHistory1,
                this.ulClientTimeHistory2,
                this.currentWeatherDataError1,
                this.currentWeatherDataError2
            ];
            this.model.init(keys);
            $('#' + this.btnLoadForm).click(function () {
                _this.SetFormDisabled(true);
                _this.model.setModelValue(_this.txtValue1, '');
                _this.model.setModelValue(_this.txtValue2, '');
                _this.loadForm();
            });
            $('#' + this.btnForm1).click(function () {
                _this.SetFormDisabled(true);
                _this.updateModelListValue(_this.ulClientTimeHistory1, (new Date()).toString());
                _this.postForm1();
            });
            $('#' + this.btnForm2).click(function () {
                _this.SetFormDisabled(true);
                _this.updateModelListValue(_this.ulClientTimeHistory2, (new Date()).toString());
                _this.postForm2();
            });
            this.SetFormDisabled(true);
            this.model.setModelValue(this.btnLoadForm, null, false);
        };
        JqAjxWhenTestController.prototype.loadForm = function () {
            var _this = this;
            var getForm1Data = function () { return _this.jqAjxWhenService.getServerTime(5000); };
            var getForm2Data = function () { return _this.jqAjxWhenService.getServerTime(10000); };
            $.when(getForm1Data(), getForm2Data()).then(function (formData1, formData2) {
                return _this.onFormLoaded(formData1, formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.onFormLoaded = function (formData1, formData2, model) {
            var form1Obj = Ajax.Convert.ArrayToObject(formData1);
            var modelForm1 = form1Obj.success;
            model.setModelValue(this.txtServerTime1, modelForm1.result);
            var form2Obj = Ajax.Convert.ArrayToObject(formData2);
            var modelForm2 = form2Obj.success;
            model.setModelValue(this.txtServerTime2, modelForm2.result);
            this.SetFormDisabled(false);
        };
        JqAjxWhenTestController.prototype.postForm1 = function () {
            var _this = this;
            var txtValue1 = $('#' + this.txtValue1).val().toString();
            var historyValues1 = this.model.getModelValue(this.ulClientTimeHistory1).List;
            var form1Data = new Ajax.FormData(txtValue1, historyValues1, 0, '');
            var postForm1Data = function () {
                return _this.jqAjxWhenService.postServerTimes(form1Data)
                    .done(function (data) {
                    var errorMsg = data.errorMessage1 === null ? '' : data.errorMessage1;
                    _this.model.setModelValue(_this.currentWeatherDataError1, errorMsg);
                    var newList = data.historyValues1;
                    _this.model.setModelValue(_this.ulClientTimeHistory1, null, null, newList);
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                    _this.model.setModelValue(_this.currentWeatherDataError1, errorMsg);
                });
            };
            $.when(postForm1Data())
                .then(function (formData2) {
                return _this.onForm1Posted(formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.postForm2 = function () {
            var _this = this;
            var postForm2Data = function () {
                var txtValue2 = $('#' + _this.txtValue2).val().toString();
                var historyValues2 = _this.model.getModelValue(_this.ulClientTimeHistory2).List;
                var postData = new Ajax.FormData(txtValue2, historyValues2, 0, '');
                return _this.jqAjxWhenService.postServerTimes(postData).done(function (data) {
                    var errorMsg = data.errorMessage === null ? '' : data.errorMessage;
                    _this.model.setModelValue(_this.currentWeatherDataError2, errorMsg);
                    var newList = data.historyValues;
                    _this.model.setModelValue(_this.ulClientTimeHistory2, null, null, newList);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                    _this.model.setModelValue(_this.currentWeatherDataError2, errorMsg);
                });
            };
            $.when(postForm2Data())
                .then(function (formData2) {
                return _this.onForm2Posted(formData2, _this.model);
            });
        };
        JqAjxWhenTestController.prototype.onForm1Posted = function (formData1, model) {
            model.setModelValue(this.txtValue1, formData1.txtValue);
            this.SetFormDisabled(false);
        };
        JqAjxWhenTestController.prototype.onForm2Posted = function (formData2, model) {
            model.setModelValue(this.txtValue2, formData2.txtValue);
            this.SetFormDisabled(false);
        };
        JqAjxWhenTestController.prototype.SetFormDisabled = function (disable) {
            var model = this.model;
            model.setModelValue(this.btnLoadForm, null, disable);
            model.setModelValue(this.btnForm1, null, disable);
            model.setModelValue(this.btnForm2, null, disable);
        };
        JqAjxWhenTestController.prototype.updateGuiValues = function (model) {
            var _this = this;
            var txtServerTime1 = model.getModelValue(this.txtServerTime1).Value;
            $('#' + this.txtServerTime1).val(txtServerTime1);
            var txtServerTime2 = model.getModelValue(this.txtServerTime2).Value;
            $('#' + this.txtServerTime2).val(txtServerTime2);
            var error1 = this.model.getModelValue(this.currentWeatherDataError1).Value;
            $('#' + this.currentWeatherDataError1).text(error1);
            var error2 = this.model.getModelValue(this.currentWeatherDataError2).Value;
            $('#' + this.currentWeatherDataError2).text(error2);
            var list1 = model.getModelValue(this.ulClientTimeHistory1).List;
            $('#' + this.ulClientTimeHistory1).children().remove();
            list1.forEach(function (item) {
                $('#' + _this.ulClientTimeHistory1).append('<li>' + item + '</li>');
            });
            var list2 = model.getModelValue(this.ulClientTimeHistory2).List;
            $('#' + this.ulClientTimeHistory2).children().remove();
            list2.forEach(function (item) {
                $('#' + _this.ulClientTimeHistory2).append('<li>' + item + '</li>');
            });
        };
        JqAjxWhenTestController.prototype.updateGui = function (model) {
            this.updateGuiValues(model);
            var btnLoadFormDisable = model.getModelValue(this.btnLoadForm).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnLoadForm).attr('id'), btnLoadFormDisable);
            var btnForm1Disable = model.getModelValue(this.btnForm1).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm1).attr('id'), btnForm1Disable);
            var btnForm2Disable = model.getModelValue(this.btnForm2).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm2).attr('id'), btnForm2Disable);
        };
        JqAjxWhenTestController.prototype.updateModelListValue = function (idListValue, value) {
            var modelValue = this.model.getModelValue(idListValue);
            modelValue.List.push(value);
            this.model.setModelValue(idListValue, null, null, modelValue.List);
        };
        return JqAjxWhenTestController;
    }());
    JqAjaxTest.JqAjxWhenTestController = JqAjxWhenTestController;
})(JqAjaxTest || (JqAjaxTest = {}));
//# sourceMappingURL=JqAjaxWhenTest.js.map