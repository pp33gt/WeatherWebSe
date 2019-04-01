using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WeatherWebSe.Models;
using WeatherWebSe.Core;

namespace WeatherWebSe.Controllers
{
    [Produces("application/json")]
    [Route("api/Weather")]
    public class WeatherController : Controller
    {
        private IWeatherManager WeatherManager { get; }
        public WeatherController(IWeatherManager weatherManager)
        {
            WeatherManager = weatherManager;
        }

        [HttpGet]
        [Route("GetWeatherData")]
        public async Task<WeatherModel> GetWeatherData(string city)
        {
            if (city != null)
            {
                var model = await WeatherManager.GetWeatherAsync(city);
                return model;
            }
            return new WeatherModel();
        }

    }
}
