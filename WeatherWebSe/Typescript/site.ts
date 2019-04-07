///// <reference path="deftyped/index.d.ts" />

//// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
//// for details on configuring this project to bundle and minify static web assets.

//// Write your Javascript code.

//declare var currentWeatherData: string;

//declare var weatherSearchHistory: string[];

//function onDocumentReady() {
//    currentWeatherData = null;
//    weatherSearchHistory = [];

//    $("#btnSearch").click(function () {
//        $('#currentWeatherData').text('');
//        getWeatherData();
//    });
//}

//function getWeatherData() {

//    var cityName: string = $('#txtCityName').val().toString();
//    if (cityName.length < 1) {
//        showCurrentWeatherDataError('Please Specify a City');
//        return;
//    }
//    showCurrentWeatherDataError('');

//    if (currentWeatherData != null) {
//        weatherSearchHistory.push(currentWeatherData);
//        currentWeatherData = null;
//        showWeatherSearchHistory();
//    }

//    $.ajax({
//        url: '/api/Weather/GetWeatherData',

//        data: {
//            city: cityName
//        },

//        success: function (data) {
//            var errorMsg = data.errorMessage;
//            if (errorMsg != null && errorMsg.length > 0) {
//                showCurrentWeatherDataError(errorMsg);
//                return;
//            }
//            currentWeatherData = data;
//            showCurrentWeatherData();
//        },
//        error: (jqXHR, textStatus, errorThrown) => {
//            showCurrentWeatherDataError('Communication problem');
//        }
//    });
//}

//function showCurrentWeatherData() {
//    $('#currentWeatherData').text(weatherDataToString(currentWeatherData));
//}

//function showCurrentWeatherDataError(errorText) {
//    $('#currentWeatherDataError').text(errorText);
//}

//function weatherDataToString(weatherData) {
//    return 'City: ' + weatherData.city + ' ValidTime: ' + weatherData.validTimeDisplay + ' Temperature: ' + weatherData.temperature + "\u2103";
//}

//function showWeatherSearchHistory() {
//    $('#ulWeatherSearches li').remove();
//    weatherSearchHistory.forEach(addListItemToSearchHistory);
//}

//function addListItemToSearchHistory(weatherData) {
//    var liValue = weatherDataToString(weatherData);
//    $("#ulWeatherSearches").append('<li>' + liValue + '</li>');
//}