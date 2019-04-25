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

        public readonly txtValue1: string = 'txtValue1';
        public readonly txtValue2: string = 'txtValue2';

        public readonly btnLoadForm: string = 'btnLoadForm';
        public readonly btnForm1: string = 'btnForm1';
        public readonly btnForm2: string = 'btnForm2';

        constructor(jqAjxWhenService: Ajax.IJqAjxWhenService, model: Common.IJqAjxWhenTestModel) {
            this.jqAjxWhenService = jqAjxWhenService;
            this.model = model;
            model.setOnModelUpdated((model) => this.updateGui(model));
        }

        init() {
            var keys: string[] = [
                this.txtValue1,
                this.txtValue2,
                this.btnLoadForm,
                this.btnForm1,
                this.btnForm2
            ];

            this.model.init(keys);

            $('#' + this.btnLoadForm).click(() => {
                this.model.setModelValue(this.btnLoadForm, null, true);
                this.model.setModelValue(this.btnForm1, null, true);
                this.model.setModelValue(this.btnForm2, null, true);
                this.model.setModelValue(this.txtValue1, '');
                this.model.setModelValue(this.txtValue2, '');
                this.loadForm();
            });

            $('#' + this.btnForm2).click(() => {
                this.model.setModelValue(this.btnLoadForm, null, true);
                this.model.setModelValue(this.btnForm1, null, true);
                this.model.setModelValue(this.btnForm2, null, true);
                this.postForm2();
            });

            $('#' + this.btnForm1).click(() => {
                this.model.setModelValue(this.btnLoadForm, null, true);
                this.model.setModelValue(this.btnForm1, null, true);
                this.model.setModelValue(this.btnForm2, null, true);
                this.postForm1();
            });
        }

        loadForm() {
            var getForm1Data = () => this.jqAjxWhenService.getServerTime(5000);

            var getForm2Data = () => this.jqAjxWhenService.getServerTime(10000);

            $.when(getForm1Data(), getForm2Data()).then(
                (formData1: Array<object>, formData2: Array<object>) =>
                    this.onFormLoaded(formData1, formData2, this.model));
        }

        postForm1() {
            
            var postForm1Data = () => {
                return this.jqAjxWhenService.postServerTimes1(
                    this.model.getValue(this.txtValue1).Value
                )};

            $.when(postForm1Data())
                .then((formData2: Ajax.IFormDataModel) =>
                    this.onForm1Posted(formData2, this.model));
        }

        postForm2() {

            var postForm2Data = () => {
                return this.jqAjxWhenService.postServerTimes2(
                    this.model.getValue(this.txtValue2).Value
                )
            };

            $.when(postForm2Data())
                .then((formData2: Ajax.IFormDataModel) =>
                    this.onForm2Posted(formData2, this.model));
        }

        onForm1Posted(formData1: Ajax.IFormDataModel, model: Common.IJqAjxWhenTestModel) {
            model.setModelValue(this.txtValue1, formData1.txtValue1);

            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        }

        onForm2Posted(formData2: Ajax.IFormDataModel, model: Common.IJqAjxWhenTestModel) {
            model.setModelValue(this.txtValue2, formData2.txtValue2);

            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        }

        onFormLoaded(formData1: Array<object>, formData2: Array<object>, model: Common.IJqAjxWhenTestModel) {

            var form1Obj = Ajax.Convert.ArrayToObject(formData1);
            var modelForm1: Ajax.IServerTime = <Ajax.IServerTime> form1Obj.success;
            model.setModelValue(this.txtValue1, modelForm1.result);

            var form2Obj = Ajax.Convert.ArrayToObject(formData2);
            var modelForm2: Ajax.IServerTime = <Ajax.IServerTime>form2Obj.success;
            model.setModelValue(this.txtValue2, modelForm2.result);

            model.setModelValue(this.btnLoadForm, null, false);
            model.setModelValue(this.btnForm1, null, false);
            model.setModelValue(this.btnForm2, null, false);
        }

        private updateGuiValues(model: Common.IJqAjxWhenTestModel) {
            var txtValue1 = model.getValue(this.txtValue1).Value;
            $('#' + this.txtValue1).val(txtValue1);

            var txtValue2 = model.getValue(this.txtValue2).Value;
            $('#' + this.txtValue2).val(txtValue2);
        }

        private updateGui(model: Common.IJqAjxWhenTestModel) {
            this.updateGuiValues(model);

            var btnLoadFormDisable = model.getValue(this.btnLoadForm).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnLoadForm).attr('id'), btnLoadFormDisable);

            var btnForm1Disable = model.getValue(this.btnForm1).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm1).attr('id'), btnForm1Disable);

            var btnForm2Disable = model.getValue(this.btnForm2).Disabled;
            Common.Control.setDisableAttr($('#' + this.btnForm2).attr('id'), btnForm2Disable);
        }
    }
}



