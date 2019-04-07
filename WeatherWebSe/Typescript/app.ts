/// <reference path="deftyped/index.d.ts" />

// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification​
// for details on configuring this project to bundle and minify static web assets.​

function onDocumentReady() {
    let weatherController: WeatherController = new WeatherController(new WeatherService());
    weatherController.init();
}

/*.*/
class WeatherModel {
    public errorMessage: string;
    public city: string;
    public temperature: number;
    public validTime: string;
    public validTimeDisplay: string;
}
   
class WeatherController {

    public currentWeatherData: WeatherModel = null;

    public weatherSearchHistory: WeatherModel[] = new Array<WeatherModel>();

    private weatherService: WeatherService = null;
    
    constructor(weatherService: WeatherService) {
        this.weatherService = weatherService;
    }

    init() {
        $("#btnSearch").click(() => {
            return this.getWeatherData();
        });
    }

    getWeatherData() {
        $('#currentWeatherData').text('');

        this.showCurrentWeatherDataError('');

        if (this.currentWeatherData != null) {
            this.weatherSearchHistory.push(this.currentWeatherData);
            this.currentWeatherData = null;
            this.showWeatherSearchHistory(this.weatherSearchHistory);
        }

        var cityName: string = $('#txtCityName').val().toString();
        if (cityName.length < 1) {
            this.showCurrentWeatherDataError('Please Specify a City');
            return;
        }
        
        this.weatherService.getWeatherData(cityName)
            .done((data: WeatherModel) => {
                var errorMsg = data.errorMessage;
                if (errorMsg != null && errorMsg.length > 0) {
                    this.showCurrentWeatherDataError(errorMsg);
                    return;
                }
                this.currentWeatherData = data;
                this.showCurrentWeatherData();
            })
            .fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                this.showCurrentWeatherDataError('failed to get weather data');
            });;
    }

    showCurrentWeatherDataError(errorText:string) {
        $('#currentWeatherDataError').text(errorText);
    }

    showCurrentWeatherData() {
        $('#currentWeatherData').text(this.weatherDataToString(this.currentWeatherData));
    }

    showWeatherSearchHistory(searchHistory: Array<WeatherModel>) {
        $('#ulWeatherSearches li').remove();
        var historyCopy: Array<WeatherModel> = searchHistory.slice();
        historyCopy = historyCopy.reverse();
        historyCopy.forEach((item: WeatherModel) => { this.addListItemToSearchHistory(item) } );
    }

    addListItemToSearchHistory(weatherData) {
        var liValue = this.weatherDataToString(weatherData);
        $("#ulWeatherSearches").append('<li>' + liValue + '</li>');
    }

    weatherDataToString(weatherData: WeatherModel) {
        return 'City: ' + weatherData.city + ' ValidTime: ' + weatherData.validTimeDisplay + ' Temperature: ' + weatherData.temperature + "\u2103";
    }
}

class WeatherService {

    getWeatherData(cityName: string): JQueryXHR {

        return $.ajax({
            url: '/api/Weather/GetWeatherData',
            data: {
                city: cityName
            }})
            .done((data) => {
                //alert(data);
            })
            .fail((jqXHR: JQueryXHR, textStatus: string, errorThrown:string) => {
                //alert(error);
            });
    }
}