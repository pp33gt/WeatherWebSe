/// <reference path="Common.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function onDocReady() {
    var controller = JqAjaxWhenTest2.GuiMainController.CreateMainController();
    controller.init();
}
var JqAjaxWhenTest2;
(function (JqAjaxWhenTest2) {
    var modelBase = /** @class */ (function () {
        function modelBase() {
        }
        return modelBase;
    }());
    var ServerTimeModel = /** @class */ (function (_super) {
        __extends(ServerTimeModel, _super);
        function ServerTimeModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._serverTime = '';
            _this._value = '';
            _this._disableForm = false;
            _this._history = [];
            _this._error = '';
            _this._preReqServerTime1 = null;
            return _this;
        }
        Object.defineProperty(ServerTimeModel.prototype, "serverTime", {
            get: function () {
                return this._serverTime;
            },
            set: function (value) {
                this._serverTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerTimeModel.prototype, "Value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerTimeModel.prototype, "disableForm", {
            get: function () {
                return this._disableForm;
            },
            set: function (value) {
                this._disableForm = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerTimeModel.prototype, "history", {
            get: function () {
                return this._history;
            },
            set: function (value) {
                this._history = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerTimeModel.prototype, "error", {
            get: function () {
                return this._error;
            },
            set: function (value) {
                this._error = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerTimeModel.prototype, "preReqServerTime1", {
            get: function () {
                return this._preReqServerTime1;
            },
            set: function (value) {
                this._preReqServerTime1 = value;
            },
            enumerable: true,
            configurable: true
        });
        return ServerTimeModel;
    }(modelBase));
    var controllerBase = /** @class */ (function () {
        function controllerBase(service, databus) {
            this._model = new ServerTimeModel();
            this.numLoading = 0;
            this._service = service;
            this._databus = databus;
        }
        Object.defineProperty(controllerBase.prototype, "model", {
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        controllerBase.prototype.isFormsLoading = function (item) {
            if (item.IsLoading)
                this.numLoading += 1;
            else
                this.numLoading -= 1;
            var disableForm = false;
            if (this.numLoading > 0) {
                disableForm = true;
            }
            return disableForm;
        };
        controllerBase.prototype.handleDataBus = function (ajaxMethod, databusModel, model) {
            var _this = this;
            databusModel.setLoading(true);
            this._databus.push(databusModel);
            return ajaxMethod().done(function (data) {
                var errorMsg = data.errorMessage === null ? '' : data.errorMessage;
                model.error = errorMsg;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                var errorMsg = 'textStatus: ' + textStatus + ' jqXHR.status ' + jqXHR.status + ' errorThrown: ' + errorThrown;
                model.error = errorMsg;
            }).always(function () {
                databusModel.setLoading(false);
                databusModel.update(model);
                _this._databus.push(databusModel);
            });
        };
        return controllerBase;
    }());
    var GuiMainController = /** @class */ (function () {
        function GuiMainController(service1, service2, service3, databus) {
            var _this = this;
            this.btnLoadForm = 'btnLoadForm';
            this.part1Loading = false;
            this.part2Loading = false;
            this.part3Loading = false;
            this._service1 = service1;
            this._service2 = service2;
            this._service3 = service3;
            this._databus = databus;
            this._controller1 = new Gui1Controller(this._service1, this._databus);
            this._controller2 = new Gui2Controller(this._service2, this._databus);
            this._controller3 = new Gui3Controller(this._service3, this._databus);
            this._databus.addListener(function (item) { _this.onData(item); });
        }
        GuiMainController.CreateMainController = function () {
            var apiUrl = $('#' + GuiMainController.txtApiUrl).val().toString();
            var jqAjxWhenService1 = new Ajax.JqAjxWhenService(apiUrl);
            var jqAjxWhenService2 = new Ajax.JqAjxWhenService(apiUrl);
            var jqAjxWhenService3 = new Ajax.JqAjxWhenService(apiUrl);
            var dataBus = new databus(new Array());
            var mainController = new GuiMainController(jqAjxWhenService1, jqAjxWhenService2, jqAjxWhenService3, dataBus);
            return mainController;
        };
        GuiMainController.prototype.init = function () {
            this.disableForms(false);
            this.initBtnLoadForms();
        };
        GuiMainController.prototype.onData = function (item) {
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
        };
        GuiMainController.prototype.initBtnLoadForms = function () {
            var _this = this;
            $('#' + this.btnLoadForm).click(function () {
                var fetch1 = function () { return _this._controller1.fetchServerTime().done(function (data) {
                    //alert('1');
                }); };
                var fetch2 = function () { return _this._controller2.fetchServerTime().done(function (data) {
                    //alert('2');
                }); };
                var fetch3 = function () { return _this._controller3.fetchServerTime().done(function (data) {
                    //alert('3');
                }); };
                $.when(fetch1())
                    .then(function (formData1) {
                    if (formData1.errorMessage.length == 0) {
                        $.when(fetch2(), fetch3())
                            .then(function (formData2, formData3) {
                            var form2Obj = Ajax.Convert.ArrayToObject(formData2);
                            var form3Obj = Ajax.Convert.ArrayToObject(formData3);
                            if (form2Obj.statusText !== 'success' || form3Obj.statusText !== 'success') {
                                alert('errors occured');
                            }
                        });
                    }
                    else {
                        alert('errors occured');
                    }
                });
            });
        };
        GuiMainController.prototype.disableForms = function (disable) {
            Common.Control.setDisable($('#' + this.btnLoadForm), disable);
            this._controller1.disableForm(disable);
        };
        GuiMainController.txtApiUrl = 'txtApiUrl';
        return GuiMainController;
    }());
    JqAjaxWhenTest2.GuiMainController = GuiMainController;
    var Gui1Controller = /** @class */ (function (_super) {
        __extends(Gui1Controller, _super);
        function Gui1Controller(service, databus) {
            var _this = _super.call(this, service, databus) || this;
            _this.txtServerTime1 = 'txtServerTime1';
            _this.txtValue1 = 'txtValue1';
            _this.btnForm1 = 'btnForm1';
            _this.ulClientTimeHistory1 = 'ulClientTimeHistory1';
            _this.currentWeatherDataError1 = 'currentWeatherDataError1';
            _this._databus.addListener(function (item) { _this.onDataBusEvt(item); });
            _this.initBtnForm1();
            return _this;
        }
        Gui1Controller.prototype.initBtnForm1 = function () {
            var _this = this;
            $('#' + this.btnForm1).click(function () {
                _this.onBtnFormClick();
            });
        };
        Gui1Controller.prototype.onDataBusEvt = function (item) {
        };
        Gui1Controller.prototype.onBtnFormClick = function () {
            var deferred = $.Deferred();
            this.postForm().done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        };
        Gui1Controller.prototype.disableForm = function (disable) {
            this._model.disableForm = disable;
            this.updateGui();
        };
        Gui1Controller.prototype.fetchServerTime = function () {
            var _this = this;
            var model = this.model;
            model.serverTime = null;
            this.updateGui();
            var databusModel = new databusModel1(model);
            var getFormData = function () { return _this._service.getServerTime(5000)
                .done(function (data) {
                model.serverTime = data.result;
            }).fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            return this.handleDataBus(getFormData, databusModel, model);
        };
        Gui1Controller.prototype.postForm = function () {
            var _this = this;
            var model = this.model;
            model.history.push((new Date()).toString());
            var history = model.history.splice(0);
            model.history = new Array();
            var value = $('#' + this.txtValue1).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, '');
            this.updateGui();
            var postServerTimes = function () { return _this._service.postServerTimes(formData)
                .done(function (data) {
                model.history = data.historyValues;
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            var databusModel = new databusModel1(model);
            return this.handleDataBus(postServerTimes, databusModel, model);
        };
        Gui1Controller.prototype.updateGui = function () {
            var _this = this;
            var model = this._model;
            $('#' + this.txtServerTime1).val(model.serverTime);
            $('#' + this.currentWeatherDataError1).text(model.error);
            $('#' + this.ulClientTimeHistory1).children().remove();
            model.history.forEach(function (item) {
                $('#' + _this.ulClientTimeHistory1).append('<li>' + item + '</li>');
            });
            Common.Control.setDisable($('#' + this.btnForm1), model.disableForm);
            Common.Control.setDisable($('#' + this.txtValue1), model.disableForm);
        };
        return Gui1Controller;
    }(controllerBase));
    var Gui2Controller = /** @class */ (function (_super) {
        __extends(Gui2Controller, _super);
        function Gui2Controller(service, databus) {
            var _this = _super.call(this, service, databus) || this;
            _this.txtPreReqPart1_2 = 'txtPreReqPart1_2';
            _this.txtServerTime2 = 'txtServerTime2';
            _this.txtValue2 = 'txtValue2';
            _this.btnForm2 = 'btnForm2';
            _this.ulClientTimeHistory2 = 'ulClientTimeHistory2';
            _this.currentWeatherDataError2 = 'currentWeatherDataError2';
            _this._databus.addListener(function (item) { _this.onDataBusEvt(item); });
            _this.initBtnForm2();
            return _this;
        }
        Gui2Controller.prototype.initBtnForm2 = function () {
            var _this = this;
            $('#' + this.btnForm2).click(function () {
                _this.onBtnFormClick();
            });
            this.updateFormDisable(false);
        };
        Gui2Controller.prototype.onDataBusEvt = function (item) {
            switch (item.kind) {
                case databusBase.databusModel1:
                    this.model.preReqServerTime1 = item.ServerTime;
                    break;
            }
            var isFormLoadning = _super.prototype.isFormsLoading.call(this, item);
            this.updateFormDisable(isFormLoadning);
        };
        Gui2Controller.prototype.updateFormDisable = function (isFormLoadning) {
            var disableForm = false;
            if (isFormLoadning || this.model.preReqServerTime1 === null) {
                disableForm = true;
            }
            this.disableForm(disableForm);
        };
        Gui2Controller.prototype.onBtnFormClick = function () {
            var model = this.model;
            var deferred = $.Deferred();
            this.postForm(model.preReqServerTime1).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        };
        Gui2Controller.prototype.disableForm = function (disable) {
            this._model.disableForm = disable;
            this.updateGui();
        };
        Gui2Controller.prototype.fetchServerTime = function () {
            var _this = this;
            var model = this.model;
            model.serverTime = null;
            this.updateGui();
            var databusModel = new databusModel2(model);
            var getFormData = function () { return _this._service.getServerTime(10000)
                .done(function (data) {
                model.serverTime = data.result;
            }).fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            return this.handleDataBus(getFormData, databusModel, model);
        };
        Gui2Controller.prototype.postForm = function (prerequisiteValue) {
            var _this = this;
            var model = this.model;
            model.history.push((new Date()).toString());
            var history = model.history.splice(0);
            model.history = new Array();
            var value = $('#' + this.txtValue2).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, prerequisiteValue);
            this.updateGui();
            var postServerTimes = function () { return _this._service.postServerTimes(formData)
                .done(function (data) {
                model.history = data.historyValues;
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            var databusModel = new databusModel2(model);
            return this.handleDataBus(postServerTimes, databusModel, model);
        };
        Gui2Controller.prototype.updateGui = function () {
            var _this = this;
            var model = this._model;
            $('#' + this.txtPreReqPart1_2).val(model.preReqServerTime1);
            $('#' + this.txtServerTime2).val(model.serverTime);
            $('#' + this.currentWeatherDataError2).text(model.error);
            $('#' + this.ulClientTimeHistory2).children().remove();
            model.history.forEach(function (item) {
                $('#' + _this.ulClientTimeHistory2).append('<li>' + item + '</li>');
            });
            Common.Control.setDisable($('#' + this.btnForm2), model.disableForm);
            Common.Control.setDisable($('#' + this.txtValue2), model.disableForm);
        };
        return Gui2Controller;
    }(controllerBase));
    var Gui3Controller = /** @class */ (function (_super) {
        __extends(Gui3Controller, _super);
        function Gui3Controller(service, databus) {
            var _this = _super.call(this, service, databus) || this;
            _this.txtPreReqPart1_3 = 'txtPreReqPart1_3';
            _this.txtServerTime3 = 'txtServerTime3';
            _this.txtValue3 = 'txtValue3';
            _this.btnForm3 = 'btnForm3';
            _this.ulClientTimeHistory3 = 'ulClientTimeHistory3';
            _this.currentWeatherDataError3 = 'currentWeatherDataError3';
            _this._databus.addListener(function (item) { _this.onDataBusEvt(item); });
            _this.initBtnForm3();
            return _this;
        }
        Gui3Controller.prototype.initBtnForm3 = function () {
            var _this = this;
            $('#' + this.btnForm3).click(function () {
                _this.onBtnFormClick();
            });
            this.updateFormDisable(false);
        };
        Gui3Controller.prototype.onDataBusEvt = function (item) {
            switch (item.kind) {
                case databusBase.databusModel1:
                    this.model.preReqServerTime1 = item.ServerTime;
                    break;
            }
            var isFormLoadning = _super.prototype.isFormsLoading.call(this, item);
            this.updateFormDisable(isFormLoadning);
        };
        Gui3Controller.prototype.updateFormDisable = function (isFormLoadning) {
            var disableForm = false;
            if (isFormLoadning || this.model.preReqServerTime1 === null) {
                disableForm = true;
            }
            this.disableForm(disableForm);
        };
        Gui3Controller.prototype.onBtnFormClick = function () {
            var model = this.model;
            var deferred = $.Deferred();
            this.postForm(model.preReqServerTime1).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        };
        Gui3Controller.prototype.disableForm = function (disable) {
            this.model.disableForm = disable;
            this.updateGui();
        };
        Gui3Controller.prototype.fetchServerTime = function () {
            var _this = this;
            var model = this.model;
            model.serverTime = null;
            this.updateGui();
            var databusModel = new databusModel3(model);
            var getFormData = function () { return _this._service.getServerTime(5000)
                .done(function (data) {
                model.serverTime = data.result;
                0;
            }).fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            return this.handleDataBus(getFormData, databusModel, model);
        };
        Gui3Controller.prototype.postForm = function (prerequisiteValue) {
            var _this = this;
            var model = this.model;
            model.history.push((new Date()).toString());
            var history = model.history.splice(0);
            model.history = new Array();
            var value = $('#' + this.txtValue3).val().toString();
            var formData = new Ajax.FormData(value, history, 5000, prerequisiteValue);
            this.updateGui();
            var postServerTimes = function () { return _this._service.postServerTimes(formData)
                .done(function (data) {
                model.history = data.historyValues;
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
            }).always(function () {
                _this.updateGui();
            }); };
            var databusModel = new databusModel3(model);
            return this.handleDataBus(postServerTimes, databusModel, model);
        };
        Gui3Controller.prototype.updateGui = function () {
            var _this = this;
            var model = this.model;
            $('#' + this.txtPreReqPart1_3).val(model.preReqServerTime1);
            $('#' + this.txtServerTime3).val(model.serverTime);
            $('#' + this.currentWeatherDataError3).text(model.error);
            $('#' + this.ulClientTimeHistory3).children().remove();
            model.history.forEach(function (item) {
                $('#' + _this.ulClientTimeHistory3).append('<li>' + item + '</li>');
            });
            Common.Control.setDisable($('#' + this.btnForm3), model.disableForm);
            Common.Control.setDisable($('#' + this.txtValue3), model.disableForm);
        };
        return Gui3Controller;
    }(controllerBase));
    var databusBase = /** @class */ (function () {
        function databusBase(kind, serverTime) {
            this.serverTime = null;
            this.isLoading = false;
            this.kind = kind;
            this.serverTime = serverTime;
        }
        databusBase.prototype.setLoading = function (loading) {
            this.isLoading = loading;
        };
        Object.defineProperty(databusBase.prototype, "IsLoading", {
            get: function () {
                return this.isLoading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(databusBase.prototype, "ServerTime", {
            get: function () {
                return this.serverTime;
            },
            enumerable: true,
            configurable: true
        });
        databusBase.databusModel1 = 'databusModel1';
        databusBase.databusModel2 = 'databusModel2';
        databusBase.databusModel3 = 'databusModel3';
        return databusBase;
    }());
    var databusModel1 = /** @class */ (function (_super) {
        __extends(databusModel1, _super);
        function databusModel1(model) {
            return _super.call(this, databusBase.databusModel1, model.serverTime) || this;
        }
        databusModel1.prototype.update = function (model) {
            this.serverTime = model.serverTime;
        };
        return databusModel1;
    }(databusBase));
    var databusModel2 = /** @class */ (function (_super) {
        __extends(databusModel2, _super);
        function databusModel2(model) {
            return _super.call(this, databusBase.databusModel2, model.serverTime) || this;
        }
        databusModel2.prototype.update = function (model) {
            this.serverTime = model.serverTime;
        };
        return databusModel2;
    }(databusBase));
    var databusModel3 = /** @class */ (function (_super) {
        __extends(databusModel3, _super);
        function databusModel3(model) {
            return _super.call(this, databusBase.databusModel3, model.serverTime) || this;
        }
        databusModel3.prototype.update = function (model) {
            this.serverTime = model.serverTime;
        };
        return databusModel3;
    }(databusBase));
    var databus = /** @class */ (function () {
        function databus(databusItems) {
            this._databusItems = new Array();
            this._listeners = new Array();
            this._databusItems = databusItems;
        }
        databus.prototype.addListener = function (listener) {
            this._listeners.push(listener);
        };
        databus.prototype.push = function (obj) {
            this._databusItems.push(obj);
            this.notify();
        };
        databus.prototype.notify = function () {
            if (this._databusItems.length < 1)
                return;
            if (this._listeners.length < 1) {
                this._databusItems = new Array();
                return;
            }
            var items = this._databusItems.slice(0);
            this._databusItems = new Array();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                this._listeners.forEach(function (listener) { listener(item); });
            }
        };
        return databus;
    }());
})(JqAjaxWhenTest2 || (JqAjaxWhenTest2 = {}));
//# sourceMappingURL=JqAjaxWhenTest2.js.map