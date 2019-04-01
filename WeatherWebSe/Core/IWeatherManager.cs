using System.Threading.Tasks;
using WeatherWebSe.Models;

namespace WeatherWebSe.Core
{
    public interface IWeatherManager
    {
        Task<WeatherModel> GetWeatherAsync(string city);
    }
}
