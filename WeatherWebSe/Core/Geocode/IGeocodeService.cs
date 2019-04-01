using System.Threading.Tasks;

namespace WeatherWebSe.Core.Geocode
{
    public interface IGeocodeService
    {
        Task<GeocodeResult> GetGeocodeResult(string city);
    }
}
