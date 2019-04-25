/// <reference path="deftyped/index.d.ts" />
var Common;
(function (Common) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.setDisableAttr = function (id, disable) {
            var ctrl = $('#' + id);
            if (ctrl) {
                var isDisabled = this.isDisabled(ctrl);
                if (isDisabled != disable)
                    ctrl.prop('disabled', disable);
            }
        };
        Control.isDisabled = function (ctrl) {
            var disabledAttr = 'disabled';
            if (ctrl.attr(disabledAttr) == disabledAttr) {
                return true;
            }
            return false;
        };
        return Control;
    }());
    Common.Control = Control;
    var modelValue = /** @class */ (function () {
        function modelValue(id, value, disabled) {
            this.id = id;
            if (value)
                this.value = value;
            if (disabled)
                this.disabled = disabled;
        }
        Object.defineProperty(modelValue.prototype, "Value", {
            get: function () {
                return this.value;
            },
            set: function (newValue) {
                this.value = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(modelValue.prototype, "Disabled", {
            get: function () {
                return this.disabled;
            },
            set: function (disabled) {
                this.disabled = disabled;
            },
            enumerable: true,
            configurable: true
        });
        return modelValue;
    }());
    Common.modelValue = modelValue;
    var JqAjxWhenTestModel = /** @class */ (function () {
        function JqAjxWhenTestModel() {
            this.modelValues = [];
        }
        JqAjxWhenTestModel.prototype.init = function (keys) {
            var _this = this;
            this.modelValues = [];
            keys.forEach(function (item) {
                _this.modelValues.push(new Common.modelValue(item, null, null));
            });
        };
        JqAjxWhenTestModel.prototype.setOnModelUpdated = function (onModelUpdated) {
            this.onModelUpdated = onModelUpdated;
        };
        JqAjxWhenTestModel.prototype.setModelValue = function (id, value, disabled) {
            var _this = this;
            var doUpdateGui = false;
            this.modelValues.forEach(function (item) {
                if (item.id === id) {
                    if (value !== null && value !== item.Value) {
                        item.Value = value;
                        doUpdateGui = true;
                    }
                    if (disabled !== null && disabled !== item.Disabled) {
                        item.Disabled = disabled;
                        doUpdateGui = true;
                    }
                    if (_this.onModelUpdated && doUpdateGui)
                        _this.onModelUpdated(_this);
                    return false;
                }
            });
        };
        JqAjxWhenTestModel.prototype.getValue = function (id) {
            var res = null;
            this.modelValues.forEach(function (item) {
                if (item.id === id) {
                    res = item;
                    return false;
                }
            });
            if (res != null)
                return res;
            throw new Error("not found error");
        };
        return JqAjxWhenTestModel;
    }());
    Common.JqAjxWhenTestModel = JqAjxWhenTestModel;
})(Common || (Common = {}));
var Ajax;
(function (Ajax) {
    var Convert = /** @class */ (function () {
        function Convert() {
        }
        Convert.ArrayToObject = function (data) {
            var res = new Object();
            res.success = data[0];
            res.statusText = data[1].toString();
            res.jqxhr = data[2];
            return res;
        };
        return Convert;
    }());
    Ajax.Convert = Convert;
    var JqAjxWhenService = /** @class */ (function () {
        function JqAjxWhenService(apiUrl) {
            this.apiUrl = null;
            this.apiUrl = apiUrl + '/api/ServerTime';
        }
        JqAjxWhenService.prototype.getServerTime = function (delaymsecs) {
            console.info('begin: (' + delaymsecs + ' )');
            return $.ajax({
                type: 'get',
                url: this.apiUrl + '/Get',
                data: {
                    delaymsecs: delaymsecs
                }
            }).done(function (data) {
                console.info('done: (' + delaymsecs + ' )');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.info('err:' + textStatus);
            });
        };
        JqAjxWhenService.prototype.postServerTimes1 = function (txtValue1) {
            return $.ajax({
                type: 'post',
                url: this.apiUrl + '/Post',
                data: JSON.stringify({
                    txtValue1: txtValue1
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).done(function (data) {
                console.info('done-post:' + data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.info('err:' + textStatus);
            });
        };
        JqAjxWhenService.prototype.postServerTimes2 = function (txtValue2) {
            return $.ajax({
                type: 'post',
                url: this.apiUrl + '/Post',
                data: JSON.stringify({
                    txtValue2: txtValue2
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).done(function (data) {
                console.info('done-post:' + data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.info('err:' + textStatus);
            });
        };
        return JqAjxWhenService;
    }());
    Ajax.JqAjxWhenService = JqAjxWhenService;
})(Ajax || (Ajax = {}));
//# sourceMappingURL=Common.js.map