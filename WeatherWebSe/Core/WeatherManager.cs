using System;
using System.Linq;
using System.Threading.Tasks;
using WeatherWebSe.Models;
using WeatherWebSe.Core.Geocode;
using WeatherWebSe.Core.Weather;
using WeatherWebSe.Core.Common;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace WeatherWebSe.Core
{
    public class WeatherManager : IWeatherManager
    {
        private IWeatherService WeatherService { get; }
        private IGeocodeService GeocodeService { get; }
        private IConfiguration Configuration { get; }

        public WeatherManager(IWeatherService weatherService, IGeocodeService geocodeService, IConfiguration configuration)
        {
            WeatherService = weatherService;
            GeocodeService = geocodeService;
        }

        public async Task<WeatherModel> GetWeatherAsync(string city)
        {
            var model = new WeatherModel() { City = city };

            GeocodeResult geocodeResult = null;
            try
            {
                geocodeResult = await GetGeoCodeByCityNameAsync(city);
                if (geocodeResult.ErrorOccured)
                {
                    model.ErrorMessage = $"Could not find Coordinates for City: {city} (Try: { geocodeResult.ValidCities })";
                }
            }
            catch (Exception)
            {
                model.ErrorMessage = "Failed to Fetch Geocode for specified City: " + city;
            }

            var geocode = geocodeResult.Geocode;
            if (!geocodeResult.ErrorOccured && geocode != null)
            {
                try
                {
                    var weatherModel = await GetWeatherDataAsync(new Coordinate() { Longitude = geocode.longitude, Latitude = geocode.latitude });
                    model.Temperature = weatherModel.Temperature;
                    model.ValidTime = weatherModel.ValidTime;
                }
                catch (Exception)
                {
                    model.ErrorMessage = "Failed to Fetch Weather for specified City: " + city;
                }
            }
            return model;
        }

        private async Task<SMHIModel> GetWeatherDataAsync(Coordinate coordinate)
        {
            var model = new SMHIModel();

            var lon = coordinate.Longitude.ToString().Replace(",", ".");
            var lat = coordinate.Latitude.ToString().Replace(",", ".");
            var url = $"{Constants.ApiMockUrl}/Weather/Point/lon/{lon}/lat/{lat}";
            
            var res = await HttpManager.GetAsync(url);
            var obj = JsonConvert.DeserializeObject<SmhiGetPoint>(res);
            var earliestWeatherPrognosis = obj.timeSeries.OrderBy(a => a.validTime).FirstOrDefault();
            var earliestWeatherPrognosisTemp = earliestWeatherPrognosis.parameters.Where(b => b.name == "t").FirstOrDefault();
            model.ValidTime = earliestWeatherPrognosis.validTime;
            model.Temperature = decimal.Parse(earliestWeatherPrognosisTemp.values.FirstOrDefault(), CultureInfo.InvariantCulture);
            return model;
        }

        private async Task<GeocodeResult> GetGeoCodeByCityNameAsync(string city)
        {
            var url = $"{Constants.ApiMockUrl}/Geocode/Get?city={city}"; 
            var geocodeResultJson = await HttpManager.GetAsync(url);
            return JsonConvert.DeserializeObject<GeocodeResult>(geocodeResultJson);
        }
    }
}
