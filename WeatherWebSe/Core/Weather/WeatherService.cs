using System;
using System.Threading.Tasks;
using WeatherWebSe.Core.Common;
using Newtonsoft.Json;

namespace WeatherWebSe.Core.Weather
{
    public class WeatherService : IWeatherService
    {
        public async Task<SmhiGetPoint> GetWeatherDataAsync(SmhiCoordinate coordinate)
        {
            var lon = Math.Truncate(coordinate.Longitude);
            var lat = Math.Truncate(coordinate.Latitude);

            var json = await FileManager.GetJsonFromFileAsync($"{Constants.ResourcesPath}\\weather_{lon}_{lat}.json");

            return JsonConvert.DeserializeObject<SmhiGetPoint>(json);
        }
    }
}
