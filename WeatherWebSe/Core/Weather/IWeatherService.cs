using System.Threading.Tasks;

namespace WeatherWebSe.Core.Weather
{
    public interface IWeatherService
    {
        Task<SmhiGetPoint> GetWeatherDataAsync(SmhiCoordinate coordinate);
    }
}
