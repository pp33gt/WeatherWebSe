using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WeatherWebSe.Core.Geocode;

namespace WeatherWebSe.Controllers
{
    [Produces("application/json")]
    [Route("extmock")]
    public class MockGeocodesController : Controller
    {
        IGeocodeService Service { get; }

        public MockGeocodesController(IGeocodeService service)
        {
            Service = service;
        }

        [HttpGet]
        [Route("Geocode/Get")]
        public async Task<GeocodeResult> GetGeocode(string city)
        {
            if (!string.IsNullOrEmpty(city))
            {
                return await Service.GetGeocodeResult(city);
            }
            return new GeocodeResult();
        }
    }
}
