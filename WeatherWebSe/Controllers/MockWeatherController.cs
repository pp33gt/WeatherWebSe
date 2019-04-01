using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WeatherWebSe.Core.Weather;

namespace WeatherWebSe.Controllers
{
    [Produces("application/json")]
    [Route("extmock")]
    public class MockWeatherController : Controller
    {
        IWeatherService Service { get; }

        public MockWeatherController(IWeatherService service)
        {
            Service = service;
        }

        [HttpGet]
        [Route("Weather/Point/lon/{lon}/lat/{lat}")]
        public async Task<SmhiGetPoint> GetWeatherData(decimal lon, decimal lat)
        {
            return await Service.GetWeatherDataAsync(new SmhiCoordinate() { Longitude = lon, Latitude = lat });
        }

    }
}
