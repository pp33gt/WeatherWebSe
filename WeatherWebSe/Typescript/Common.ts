/// <reference path="deftyped/index.d.ts" />

namespace Common {

    export class Control {

        public static setDisableAttr(id: string, disable: boolean) {
            var ctrl = $('#' + id);
            if (ctrl) {
                var isDisabled = this.isDisabled(ctrl);
                if (isDisabled != disable)
                    ctrl.prop('disabled', disable);
            }
        }

        private static isDisabled(ctrl: JQuery): boolean {
            var disabledAttr = 'disabled';
            if (ctrl.attr(disabledAttr) == disabledAttr) {
                return true;
            }
            return false;
        }
    }

    export interface IJqAjxWhenTestModel {
        init(keys: Array<string>): void;
        setOnModelUpdated(onModelUpdated?: (model: IJqAjxWhenTestModel) => void): void;
        getValue(id: string): modelValue;
        setModelValue(id: string, value?: string, disabled?: boolean): void;
    }

    export class modelValue {
        public readonly id: string;
        private value: string;
        private disabled: boolean;

        constructor(id: string, value: string, disabled?: boolean) {
            this.id = id;
            if (value)
                this.value = value;

            if (disabled)
                this.disabled = disabled;
        }

        get Value(): string {
            return this.value;
        }

        set Value(newValue: string) {
            this.value = newValue;
        }

        get Disabled(): boolean {
            return this.disabled;
        }

        set Disabled(disabled: boolean) {
            this.disabled = disabled;
        }
    }

    export class JqAjxWhenTestModel implements Common.IJqAjxWhenTestModel {

        private onModelUpdated: (model: Common.IJqAjxWhenTestModel) => void;

        public init(keys: Array<string>) {
            this.modelValues = [];
            keys.forEach((item) => {
                this.modelValues.push(new Common.modelValue(item, null, null));
            });
        }

        public setOnModelUpdated(onModelUpdated?: (model: Common.IJqAjxWhenTestModel) => void) {
            this.onModelUpdated = onModelUpdated;
        }

        private modelValues: Array<Common.modelValue> = [];

        public setModelValue(id: string, value?: string, disabled?: boolean) {
            var doUpdateGui = false;
            this.modelValues.forEach(
                (item) => {
                    if (item.id === id) {
                        if (value !== null && value !== item.Value) {
                            item.Value = value;
                            doUpdateGui = true;
                        }

                        if (disabled !== null && disabled !== item.Disabled) {
                            item.Disabled = disabled;
                            doUpdateGui = true;
                        }

                        if (this.onModelUpdated && doUpdateGui)
                            this.onModelUpdated(this);

                        return false;
                    }
                });
        }

        public getValue(id: string): Common.modelValue {
            var res: any = null;
            this.modelValues.forEach(
                (item) => {
                    if (item.id === id) {
                        res = item;
                        return false;
                    }
                });

            if (res != null)
                return res;

            throw new Error("not found error");
        }
    }
}

namespace Ajax {
    export interface IAjaxData {
        success: object;
        statusText: string;
        jqxhr: JQueryXHR;
    }

    export interface IServerTime {
        result: string;
        errorMessage: string;
    }

    export interface IJqAjxWhenService {
        getServerTime(delay: number): JQueryXHR;
        postServerTimes1(txtValue1: string): JQueryXHR;
        postServerTimes2(txtValue2: string): JQueryXHR;
    }

    export interface IFormDataModel {
        txtValue1: string;
        txtValue2: string;
        ErrorMessage: string;
    }

    export class Convert {
        public static ArrayToObject(data: Array<object>): Ajax.IAjaxData {
            var res: Ajax.IAjaxData = <Ajax.IAjaxData>new Object();
            res.success = data[0];
            res.statusText = data[1].toString();
            res.jqxhr = <JQueryXHR>data[2];
            return res;
        }
    }

    export class JqAjxWhenService implements Ajax.IJqAjxWhenService {

        private apiUrl: string = null;

        constructor(apiUrl: string) {
            this.apiUrl = apiUrl + '/api/ServerTime';
        }

        getServerTime(delaymsecs: number): JQueryXHR {
            console.info('begin: (' + delaymsecs + ' )');
            return $.ajax(
                {
                    type: 'get',
                    url: this.apiUrl + '/Get',
                    data:
                    {
                        delaymsecs: delaymsecs
                    }
                }
            ).done((data) => {
                console.info('done: (' + delaymsecs + ' )');
            }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                console.info('err:' + textStatus);
            });
        }

        postServerTimes1(txtValue1: string): JQueryXHR {
            return $.ajax(
                {
                    type: 'post',
                    url: this.apiUrl + '/Post',
                    data: JSON.stringify(
                        {
                            txtValue1: txtValue1
                        }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).done((data) => {
                console.info('done-post:' + data);
            }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                console.info('err:' + textStatus);
            });
        }

        postServerTimes2(txtValue2: string): JQueryXHR {
            return $.ajax(
                {
                    type: 'post',
                    url: this.apiUrl + '/Post',
                    data: JSON.stringify(
                        {
                            txtValue2: txtValue2
                        }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).done((data) => {
                console.info('done-post:' + data);
            }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                console.info('err:' + textStatus);
            });
        }
    }
}
