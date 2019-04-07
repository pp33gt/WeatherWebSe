/// <reference path="deftyped/index.d.ts" />
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification​
// for details on configuring this project to bundle and minify static web assets.​
function onDocumentReady() {
    var weatherController = new WeatherController(new WeatherService());
    weatherController.init();
}
/*.*/
var WeatherModel = /** @class */ (function () {
    function WeatherModel() {
    }
    return WeatherModel;
}());
var WeatherController = /** @class */ (function () {
    function WeatherController(weatherService) {
        this.currentWeatherData = null;
        this.weatherSearchHistory = new Array();
        this.weatherService = null;
        this.weatherService = weatherService;
    }
    WeatherController.prototype.init = function () {
        var _this = this;
        $("#btnSearch").click(function () {
            return _this.getWeatherData();
        });
    };
    WeatherController.prototype.getWeatherData = function () {
        var _this = this;
        $('#currentWeatherData').text('');
        this.showCurrentWeatherDataError('');
        if (this.currentWeatherData != null) {
            this.weatherSearchHistory.push(this.currentWeatherData);
            this.currentWeatherData = null;
            this.showWeatherSearchHistory(this.weatherSearchHistory);
        }
        var cityName = $('#txtCityName').val().toString();
        if (cityName.length < 1) {
            this.showCurrentWeatherDataError('Please Specify a City');
            return;
        }
        this.weatherService.getWeatherData(cityName)
            .done(function (data) {
            var errorMsg = data.errorMessage;
            if (errorMsg != null && errorMsg.length > 0) {
                _this.showCurrentWeatherDataError(errorMsg);
                return;
            }
            _this.currentWeatherData = data;
            _this.showCurrentWeatherData();
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            _this.showCurrentWeatherDataError('failed to get weather data');
        });
        ;
    };
    WeatherController.prototype.showCurrentWeatherDataError = function (errorText) {
        $('#currentWeatherDataError').text(errorText);
    };
    WeatherController.prototype.showCurrentWeatherData = function () {
        $('#currentWeatherData').text(this.weatherDataToString(this.currentWeatherData));
    };
    WeatherController.prototype.showWeatherSearchHistory = function (searchHistory) {
        var _this = this;
        $('#ulWeatherSearches li').remove();
        var historyCopy = searchHistory.slice();
        historyCopy = historyCopy.reverse();
        historyCopy.forEach(function (item) { _this.addListItemToSearchHistory(item); });
    };
    WeatherController.prototype.addListItemToSearchHistory = function (weatherData) {
        var liValue = this.weatherDataToString(weatherData);
        $("#ulWeatherSearches").append('<li>' + liValue + '</li>');
    };
    WeatherController.prototype.weatherDataToString = function (weatherData) {
        return 'City: ' + weatherData.city + ' ValidTime: ' + weatherData.validTimeDisplay + ' Temperature: ' + weatherData.temperature + "\u2103";
    };
    return WeatherController;
}());
var WeatherService = /** @class */ (function () {
    function WeatherService() {
    }
    WeatherService.prototype.getWeatherData = function (cityName) {
        return $.ajax({
            url: '/api/Weather/GetWeatherData',
            data: {
                city: cityName
            }
        })
            .done(function (data) {
            //alert(data);
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            //alert(error);
        });
    };
    return WeatherService;
}());
//# sourceMappingURL=app.js.map