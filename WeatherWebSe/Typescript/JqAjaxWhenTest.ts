/// <reference path="deftyped/index.d.ts" />
/// <reference path="Common.ts" />

function onJqAjxWhenTestLoaded() {
    var apiUrl = $("#txtApiUrl").val().toString();
    var jqAjxWhenService: Ajax.JqAjxWhenService = new Ajax.JqAjxWhenService(apiUrl);
    var model = new Common.JqAjxWhenTestModel();
    let jqAjxWhenTestController: JqAjaxTest.JqAjxWhenTestController = new JqAjaxTest.JqAjxWhenTestController(jqAjxWhenService, model);
    jqAjxWhenTestController.init();
}

namespace JqAjaxTest {
    export class JqAjxWhenTestController {
        private model: Common.IJqAjxWhenTestModel = null;

        private jqAjxWhenService: Ajax.IJqAjxWhenService = null;

        public readonly txtServerTime1: string = 'txtServerTime1';
        public readonly txtServerTime2: string = 'txtServerTime2';

        public readonly txtValue1: string = 'txtValue1';
        public readonly txtValue2: string = 'txtValue2';

        public readonly btnLoadForm: string = 'btnLoadForm';
        public readonly btnForm1: string = 'btnForm1';
        public readonly btnForm2: string = 'btnForm2';

        public readonly ulClientTimeHistory1: string = 'ulClientTimeHistory1';
        public readonly ulClientTimeHistory2: string = 'ulClientTimeHistory2';

        public readonly currentWeatherDataError1: string = 'currentWeatherDataError1';
        public readonly currentWeatherDataError2: string = 'currentWeatherDataError2';

        constructor(jqAjxWhenService: Ajax.IJqAjxWhenService, model: Common.IJqAjxWhenTestModel) {
            this.jqAjxWhenService = jqAjxWhenService;
            this.model = model;
            model.setOnModelUpdated((model) => this.updateGui(model));
        }

        init() {
            var keys: string[] = [
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

            $('#' + this.btnLoadForm).click(() => {
                this.SetFormDisabled(true);

                this.model.setModelValue(this.txtValue1, '');
                this.model.setModelValue(this.txtValue2, '');
                this.loadForm();
            });            

            $('#' + this.btnForm1).click(() => {
                this.SetFormDisabled(true);
                this.updateModelListValue(this.ulClientTimeHistory1, (new Date()).toString());
                this.postForm1();
            });

            $('#' + this.btnForm2).click(() => {
                this.SetFormDisabled(true);
                this.updateModelListValue(this.ulClientTimeHistory2, (new Date()).toString());
                this.postForm2();
            });

            this.SetFormDisabled(true);
            this.model.setModelValue(this.btnLoadForm, null, false);
        }

        private loadForm() {
            var getForm1Data = () => this.jqAjxWhenService.getServerTime(5000);

            var getForm2Data = () => this.jqAjxWhenService.getServerTime(10000);

            $.when(getForm1Data(), getForm2Data()).then(
                (formData1: Array<object>, formData2: Array<object>) =>
                    this.onFormLoaded(formData1, formData2, this.model));
        }

        private onFormLoaded(formData1: Array<object>, formData2: Array<object>, model: Common.IJqAjxWhenTestModel) {

            var form1Obj = Ajax.Convert.ArrayToObject(formData1);
            var modelForm1: Ajax.IServerTime = <Ajax.IServerTime>form1Obj.success;
            model.setModelValue(this.txtServerTime1, modelForm1.result);

            var form2Obj = Ajax.Convert.ArrayToObject(formData2);
            var modelForm2: Ajax.IServerTime = <Ajax.IServerTime>form2Obj.success;
            model.setModelValue(this.txtServerTime2, modelForm2.result);

            this.SetFormDisabled(false);
        }

        private postForm1() {
            var txtValue1 = $('#' + this.txtValue1).val().toString();
            var historyValues1 = <string[]>this.model.getModelValue(this.ulClientTimeHistory1).List;
            var form1Data = new Ajax.FormData(txtValue1, historyValues1, 0, '');

            var postForm1Data = () => {
                return this.jqAjxWhenService.postServerTimes(
                    form1Data)
                    .done((data) => {
                        var errorMsg = data.errorMessage1 === null ? '' : data.errorMessage1;
                        this.model.setModelValue(this.currentWeatherDataError1, errorMsg);
                        var newList = data.historyValues1;
                        this.model.setModelValue(this.ulClientTimeHistory1, null, null, newList);
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                        this.model.setModelValue(this.currentWeatherDataError1, errorMsg);
                    })
            };

            $.when(postForm1Data())
                .then((formData2: Ajax.IFormDataModel) =>
                    this.onForm1Posted(formData2, this.model));
        }

        private postForm2() {
            var postForm2Data = () => {
                var txtValue2 = $('#' + this.txtValue2).val().toString();
                var historyValues2 = <string[]> this.model.getModelValue(this.ulClientTimeHistory2).List;
                var postData = new Ajax.FormData(txtValue2, historyValues2, 0, '');
                return this.jqAjxWhenService.postServerTimes(postData).done((data: Ajax.IFormDataModel) => {                    
                    var errorMsg = data.errorMessage === null ? '' : data.errorMessage;
                    this.model.setModelValue(this.currentWeatherDataError2, errorMsg);
                    var newList = data.historyValues;
                    this.model.setModelValue(this.ulClientTimeHistory2, null, null, newList);
                }).fail((jqXHR, textStatus, errorThrown) => {
                    var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                    this.model.setModelValue(this.currentWeatherDataError2, errorMsg);
                });
            };

            $.when(postForm2Data())
                .then((formData2: Ajax.IFormDataModel) =>
                    this.onForm2Posted(formData2, this.model));
        }

        private onForm1Posted(formData1: Ajax.IFormDataModel, model: Common.IJqAjxWhenTestModel) {
            model.setModelValue(this.txtValue1, formData1.txtValue);

            this.SetFormDisabled(false);
        }

        private onForm2Posted(formData2: Ajax.IFormDataModel, model: Common.IJqAjxWhenTestModel) {
            model.setModelValue(this.txtValue2, formData2.txtValue);

            this.SetFormDisabled(false);
        }

        private SetFormDisabled(disable: boolean) {
            var model = this.model;
            model.setModelValue(this.btnLoadForm, null, disable);
            model.setModelValue(this.btnForm1, null, disable);
            model.setModelValue(this.btnForm2, null, disable);

        }

        private updateGuiValues(model: Common.IJqAjxWhenTestModel) {
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
            list1.forEach((item) => {
                $('#' + this.ulClientTimeHistory1).append('<li>' + item + '</li>');
            });

            var list2 = model.getModelValue(this.ulClientTimeHistory2).List;
            $('#' + this.ulClientTimeHistory2).children().remove();
            list2.forEach((item) => {
                $('#' + this.ulClientTimeHistory2).append('<li>' + item + '</li>');                    
            });
        }
       
        private updateGui(model: Common.IJqAjxWhenTestModel) {
            this.updateGuiValues(model);

            var btnLoadFormDisable = model.getModelValue(this.btnLoadForm).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnLoadForm).attr('id'), btnLoadFormDisable);

            var btnForm1Disable = model.getModelValue(this.btnForm1).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm1).attr('id'), btnForm1Disable);

            var btnForm2Disable = model.getModelValue(this.btnForm2).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm2).attr('id'), btnForm2Disable);
        }

        private updateModelListValue(idListValue: string, value: Object) {
            var modelValue = this.model.getModelValue(idListValue);
            modelValue.List.push(value);
            this.model.setModelValue(idListValue, null, null, modelValue.List);
        }
    }
}



