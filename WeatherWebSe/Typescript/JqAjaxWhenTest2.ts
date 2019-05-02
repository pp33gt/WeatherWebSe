/// <reference path="Common.ts" />

function onDocReady() {
    var controller: JqAjaxWhenTest2.GuiMainController = JqAjaxWhenTest2.GuiMainController.CreateMainController();
    controller.init();
}

namespace JqAjaxWhenTest2 {

    abstract class modelBase {
        constructor() {
        }
    }

    class ServerTimeModel extends modelBase {

        private _serverTime: string = '';
        public get serverTime(): string
        {
            return this._serverTime;
        }
        public set serverTime(value: string) {
            this._serverTime = value;
        }

        private _value: string = '';
        public get Value(): string {
            return this._value;
        }
        public set Value(value: string) {
            this._value = value;
        }

        private _disableForm: boolean = false;
        public get disableForm(): boolean {
            return this._disableForm;
        }
        public set disableForm(value: boolean) {
            this._disableForm = value;
        }        

        private _history: string[] = [];
        public get history(): string[] {
            return this._history;
        }
        public set history(value: string[]) {
            this._history = value;
        }

        private _error: string = '';
        public get error(): string {
            return this._error;
        }
        public set error(value: string) {
            this._error = value;
        }


        private _preReqServerTime1: string = null;
        public get preReqServerTime1(): string {
            return this._preReqServerTime1;
        }
        public set preReqServerTime1(value: string) {
            this._preReqServerTime1 = value;
        }

    }

    abstract class controllerBase {

        protected _model: ServerTimeModel = new ServerTimeModel();
        public get model(): ServerTimeModel {
            return this._model;
        }

        protected readonly _service: Ajax.IJqAjxWhenService;

        protected readonly _databus: Idatabus;

        constructor(service: Ajax.IJqAjxWhenService, databus: Idatabus) {
            this._service = service;
            this._databus = databus;
        }

        private numLoading: number = 0;

        protected isFormsLoading(item: databusBase) {
            if (item.IsLoading)
                this.numLoading += 1;
            else
                this.numLoading -= 1;
            var disableForm = false;
            if (this.numLoading > 0) {
                disableForm = true;
            }
            return disableForm;
        }

        public handleDataBus(ajaxMethod: () => JQueryXHR, databusModel: databusBase, model: ServerTimeModel): JQueryXHR {

            databusModel.setLoading(true);            
            this._databus.push(databusModel);

            return ajaxMethod().done((data: Ajax.IServerTime) => {
                var errorMsg = data.errorMessage === null ? '' : data.errorMessage;
                model.error = errorMsg;
            }).fail((jqXHR, textStatus, errorThrown) => {
                var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                model.error = errorMsg;
            }).always(() => {
                databusModel.setLoading(false);
                databusModel.update(model);
                this._databus.push(databusModel);
            });
        }
    }

    export class GuiMainController {

        private static txtApiUrl = 'txtApiUrl';

        private _service1: Ajax.IJqAjxWhenService;

        private _service2: Ajax.IJqAjxWhenService;

        private _service3: Ajax.IJqAjxWhenService;

        private _controller1: Gui1Controller;

        private _controller2: Gui2Controller;

        private _controller3: Gui3Controller;

        private readonly btnLoadForm: string = 'btnLoadForm';

        private readonly _databus: Idatabus;

        constructor(service1: Ajax.IJqAjxWhenService, service2: Ajax.IJqAjxWhenService, service3: Ajax.IJqAjxWhenService, databus: Idatabus) {
            this._service1 = service1;
            this._service2 = service2;
            this._service3 = service3;
            this._databus = databus;
            this._controller1 = new Gui1Controller(this._service1, this._databus);
            this._controller2 = new Gui2Controller(this._service2, this._databus);
            this._controller3 = new Gui3Controller(this._service3, this._databus);
            this._databus.addListener((item) => { this.onData(item); });
        }

        public static CreateMainController(): GuiMainController {            
            var apiUrl = $('#' + GuiMainController.txtApiUrl).val().toString();
            var jqAjxWhenService1: Ajax.JqAjxWhenService = new Ajax.JqAjxWhenService(apiUrl);
            var jqAjxWhenService2: Ajax.JqAjxWhenService = new Ajax.JqAjxWhenService(apiUrl);
            var jqAjxWhenService3: Ajax.JqAjxWhenService = new Ajax.JqAjxWhenService(apiUrl);
            var dataBus: Idatabus = new databus(new Array<databusBase>());
            var mainController = new GuiMainController(jqAjxWhenService1, jqAjxWhenService2, jqAjxWhenService3, dataBus);
            return mainController;
        }

        public init() {
            this.disableForms(false);

            this.initBtnLoadForms();
        }

        private part1Loading: boolean = false;
        private part2Loading: boolean = false;
        private part3Loading: boolean = false;

        private onData(item: databusBase) {
            switch (item.kind) {
                case databusBase.databusModel1:
                    this.part1Loading = item.IsLoading;
                    break;
                case databusBase.databusModel2:
                    this.part2Loading = item.IsLoading;
                    break;
                case databusBase.databusModel3:
                    this.part3Loading = item.IsLoading;
                    break;
            }
            var disable = false;
            if (this.part1Loading || this.part2Loading || this.part3Loading) {
                disable = true;
            }
            this.disableForms(disable);
        }

        private initBtnLoadForms() {
            $('#' + this.btnLoadForm).click(() => {

                var fetch1 = () => this._controller1.fetchServerTime().done((data: Ajax.IServerTime) => {
                    //alert('1');
                });
                var fetch2 = () => this._controller2.fetchServerTime().done((data: Ajax.IServerTime) => {
                    //alert('2');
                });
                var fetch3 = () => this._controller3.fetchServerTime().done((data: Ajax.IServerTime) => {
                    //alert('3');
                });

                $.when(fetch1())
                    .then((formData1: Ajax.IServerTime) => {
                        
                        if (formData1.errorMessage.length == 0) {

                            $.when(fetch2(), fetch3())
                                .then((formData2: Array<Object>, formData3: Array<Object>) => {

                                    var form2Obj = Ajax.Convert.ArrayToObject(formData2);
                                    var form3Obj = Ajax.Convert.ArrayToObject(formData3);

                                    if (form2Obj.statusText !== 'success' || form3Obj.statusText !== 'success')
                                    {
                                        alert('errors occured');
                                    }
                                });
                        }
                        else {
                            alert('errors occured');
                        }
                    });
            });
        }

        private disableForms(disable: boolean): void {
            Common.Control.setDisable($('#' + this.btnLoadForm), disable);
            this._controller1.disableForm(disable);
        }
    }

    class Gui1Controller extends controllerBase {

        public readonly txtServerTime1: string = 'txtServerTime1';

        public readonly txtValue1: string = 'txtValue1';

        public readonly btnForm1: string = 'btnForm1';

        public readonly ulClientTimeHistory1: string = 'ulClientTimeHistory1';

        public readonly currentWeatherDataError1: string = 'currentWeatherDataError1';

        constructor(service: Ajax.IJqAjxWhenService, databus: Idatabus) {
            super(service, databus);
            this._databus.addListener((item) => { this.onDataBusEvt(item); });
            this.initBtnForm1();
        }

        private initBtnForm1(): void {           
            $('#' + this.btnForm1).click(() => {
                this.onBtnFormClick();
            });
        }

        private onDataBusEvt(item: databusBase) {
        }

        private onBtnFormClick(): JQuery.Promise<any> {
            var deferred = $.Deferred();

            this.postForm().done(() => {
                deferred.resolve();
            });
            return deferred.promise();
        }

        public disableForm(disable: boolean): void {
            this._model.disableForm = disable;
            this.updateGui();
        }

        public fetchServerTime(): JQueryXHR {
            var model = this.model;
            model.serverTime = null;
            this.updateGui();

            var databusModel = new databusModel1(model);

            var getFormData = (): JQueryXHR => this._service.getServerTime(5000)
                .done((data: Ajax.IServerTime) => {
                    model.serverTime = data.result;
                }).fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            return this.handleDataBus(getFormData, databusModel, model);
        }

        public postForm(): JQueryXHR {
            var model = this.model;

            model.history.push((new Date()).toString());
            var history = model.history.splice(0);
            model.history = new Array<string>();
            var value = $('#' + this.txtValue1).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, '');

            this.updateGui();

            var postServerTimes = (): JQueryXHR => this._service.postServerTimes(formData)
                .done((data: Ajax.IFormDataModel) => {
                    model.history = data.historyValues;
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            var databusModel = new databusModel1(model);
            return this.handleDataBus(postServerTimes, databusModel, model);
        }

        public updateGui() {
            var model = this._model;

            $('#' + this.txtServerTime1).val(model.serverTime);
            
            $('#' + this.currentWeatherDataError1).text(model.error);
            
            $('#' + this.ulClientTimeHistory1).children().remove();
            model.history.forEach((item) => {
                $('#' + this.ulClientTimeHistory1).append('<li>' + item + '</li>');
            });

            Common.Control.setDisable($('#' + this.btnForm1), model.disableForm);

            Common.Control.setDisable($('#' + this.txtValue1), model.disableForm);
        }
    }

    class Gui2Controller extends controllerBase {

        public readonly txtPreReqPart1_2: string = 'txtPreReqPart1_2';
    
        public readonly txtServerTime2: string = 'txtServerTime2';

        public readonly txtValue2: string = 'txtValue2';

        public readonly btnForm2: string = 'btnForm2';

        public readonly ulClientTimeHistory2: string = 'ulClientTimeHistory2';

        public readonly currentWeatherDataError2: string = 'currentWeatherDataError2';

        constructor(service: Ajax.IJqAjxWhenService, databus: Idatabus) {
            super(service, databus);
            this._databus.addListener((item) => { this.onDataBusEvt(item); });
            this.initBtnForm2();
        }

        private initBtnForm2(): void {
            $('#' + this.btnForm2).click(() => {
                this.onBtnFormClick();
            });
            this.updateFormDisable(false);
        }

        private onDataBusEvt(item: databusBase) {
            switch (item.kind) {
                case databusBase.databusModel1:
                    this.model.preReqServerTime1 = item.ServerTime;
                    break;
            }

            var isFormLoadning: boolean = super.isFormsLoading(item);
            this.updateFormDisable(isFormLoadning);
        }

        private updateFormDisable(isFormLoadning: boolean) {
            var disableForm = false;
            if (isFormLoadning || this.model.preReqServerTime1 === null) {
                disableForm = true;
            }
            this.disableForm(disableForm);
        }

        private onBtnFormClick(): JQuery.Promise<any> {
            var model = this.model;
            var deferred = $.Deferred();

            this.postForm(model.preReqServerTime1).done(() => {
                deferred.resolve();
            });
            return deferred.promise();
        }

        public disableForm(disable: boolean): void {
            this._model.disableForm = disable;
            this.updateGui();
        }

        public fetchServerTime(): JQueryXHR {
            var model = this.model;
            model.serverTime = null;
            this.updateGui();

            var databusModel = new databusModel2(model);

            var getFormData = (): JQueryXHR => this._service.getServerTime(10000)
                .done((data: Ajax.IServerTime) => {
                    model.serverTime = data.result;
                }).fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            return this.handleDataBus(getFormData, databusModel, model);
        }

        public postForm(prerequisiteValue: string): JQueryXHR {
            var model = this.model;

            model.history.push((new Date()).toString());
            var history = model.history.splice(0);
            model.history = new Array<string>();
            var value = $('#' + this.txtValue2).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, prerequisiteValue);

            this.updateGui();

            var postServerTimes = (): JQueryXHR => this._service.postServerTimes(formData)
                .done((data: Ajax.IFormDataModel) => {
                    model.history = data.historyValues;
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            var databusModel = new databusModel2(model);
            return this.handleDataBus(postServerTimes, databusModel, model);
        }

        public updateGui() {
            var model = this._model;

            $('#' + this.txtPreReqPart1_2).val(model.preReqServerTime1);        

            $('#' + this.txtServerTime2).val(model.serverTime);

            $('#' + this.currentWeatherDataError2).text(model.error);

            $('#' + this.ulClientTimeHistory2).children().remove();
            model.history.forEach((item) => {
                $('#' + this.ulClientTimeHistory2).append('<li>' + item + '</li>');
            });

            Common.Control.setDisable($('#' + this.btnForm2), model.disableForm);

            Common.Control.setDisable($('#' + this.txtValue2), model.disableForm);
        }
    }

    class Gui3Controller extends controllerBase {

        public readonly txtPreReqPart1_3: string = 'txtPreReqPart1_3';

        public readonly txtServerTime3: string = 'txtServerTime3';

        public readonly txtValue3: string = 'txtValue3';

        public readonly btnForm3: string = 'btnForm3';

        public readonly ulClientTimeHistory3: string = 'ulClientTimeHistory3';

        public readonly currentWeatherDataError3: string = 'currentWeatherDataError3';

        constructor(service: Ajax.IJqAjxWhenService, databus: Idatabus) {
            super(service, databus);
            this._databus.addListener((item) => { this.onDataBusEvt(item); });
            this.initBtnForm3();
        }

        private initBtnForm3(): void {
            $('#' + this.btnForm3).click(() => {
                this.onBtnFormClick();
            });

            this.updateFormDisable(false);
        }

        private onDataBusEvt(item: databusBase) {
            switch (item.kind) {
                case databusBase.databusModel1:
                    this.model.preReqServerTime1 = item.ServerTime;
                    break;
            }

            var isFormLoadning: boolean = super.isFormsLoading(item);
            this.updateFormDisable(isFormLoadning);
        }

        private updateFormDisable(isFormLoadning: boolean) {
            var disableForm = false;
            if (isFormLoadning || this.model.preReqServerTime1 === null) {
                disableForm = true;
            }
            this.disableForm(disableForm);
        }

        private onBtnFormClick(): JQuery.Promise<any> {
            var model = this.model;

            var deferred = $.Deferred();
            this.postForm(model.preReqServerTime1).done(() => {
                deferred.resolve();
            });
            return deferred.promise();
        }

        public disableForm(disable: boolean): void {
            this.model.disableForm = disable;
            this.updateGui();
        }

        public fetchServerTime(): JQueryXHR {
            var model = this.model;
            model.serverTime = null;
            this.updateGui();

            var databusModel = new databusModel3(model);

            var getFormData = (): JQueryXHR => this._service.getServerTime(5000)
                .done((data: Ajax.IServerTime) => {
                    model.serverTime = data.result;0
                }).fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            return this.handleDataBus(getFormData, databusModel, model);
        }

        public postForm(prerequisiteValue: string): JQueryXHR {
            var model = this.model;
            
            model.history.push((new Date()).toString());            
            var history = model.history.splice(0);
            model.history = new Array<string>();
            var value = $('#' + this.txtValue3).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, prerequisiteValue);
            
            this.updateGui();

            var postServerTimes = (): JQueryXHR => this._service.postServerTimes(formData)
                .done((data: Ajax.IFormDataModel) => {
                    model.history = data.historyValues;
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                }).always(() => {
                    this.updateGui();
                });

            var databusModel = new databusModel3(model);   
            return this.handleDataBus(postServerTimes, databusModel, model);
        }

        public updateGui() {
            var model = this.model;

            $('#' + this.txtPreReqPart1_3).val(model.preReqServerTime1);        

            $('#' + this.txtServerTime3).val(model.serverTime);

            $('#' + this.currentWeatherDataError3).text(model.error);

            $('#' + this.ulClientTimeHistory3).children().remove();
            model.history.forEach((item) => {
                $('#' + this.ulClientTimeHistory3).append('<li>' + item + '</li>');
            });

            Common.Control.setDisable($('#' + this.btnForm3), model.disableForm);

            Common.Control.setDisable($('#' + this.txtValue3), model.disableForm);
        }
    }

    interface Idatabus {
        addListener(listener: (obj: databusBase) => void);
        push(obj: databusBase);
        notify();
    }

    abstract class databusBase {
        readonly kind: string;
        protected serverTime: string = null;
        private isLoading: boolean = false;

        constructor(kind: string, serverTime: string) {
            this.kind = kind;
            this.serverTime = serverTime;
        }

        public static databusModel1: string = 'databusModel1';
        public static databusModel2: string = 'databusModel2';
        public static databusModel3: string = 'databusModel3';

        public setLoading(loading :boolean) {
            this.isLoading = loading;
        }

        get IsLoading(): boolean {
            return this.isLoading;
        }

        get ServerTime(): string {
            return this.serverTime;
        }

        public abstract update(model: ServerTimeModel);
    } 

    class databusModel1 extends databusBase {
        constructor(model: ServerTimeModel)
        {
            super(databusBase.databusModel1, model.serverTime);
        }

        public update(model: ServerTimeModel) {
            this.serverTime = model.serverTime;
        }
    } 

    class databusModel2 extends databusBase{
        constructor(model: ServerTimeModel)
        {
            super(databusBase.databusModel2, model.serverTime);
        }

        public update(model: ServerTimeModel) {
            this.serverTime = model.serverTime;
        }
    }

    class databusModel3 extends databusBase {
        constructor(model: ServerTimeModel) {
            super(databusBase.databusModel3, model.serverTime);
        }

        public update(model: ServerTimeModel) {
            this.serverTime = model.serverTime;
        }
    } 

    class databus implements Idatabus
    {
        constructor(databusItems: Array<databusBase>) {
            this._databusItems = databusItems;
        }

        private _databusItems: Array<databusBase> = new Array<databusBase>();

        private _listeners = new Array<(obj: databusBase) => void>();

        public addListener(listener: (obj: databusBase) => void) {
            this._listeners.push(listener);
        }

        public push(obj: databusBase) {
            this._databusItems.push(obj);
            this.notify();
        }

        public notify() {
            if (this._databusItems.length < 1)
                return;

            if (this._listeners.length < 1) {
                this._databusItems = new Array<databusBase>();
                return;
            }

            var items = this._databusItems.slice(0);
            this._databusItems = new Array<databusBase>();
            
            for (var i = 0; i < items.length; i++) {
                var item = items[i]; 
                this._listeners.forEach(
                    (listener) => { listener(item); }
                );
            }
        }
    }
}