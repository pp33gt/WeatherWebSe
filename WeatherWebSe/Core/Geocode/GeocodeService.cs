using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WeatherWebSe.Core.Common;
using Newtonsoft.Json;
using System.Text;
using System;

namespace WeatherWebSe.Core.Geocode
{
    public class GeocodeService : IGeocodeService
    {
        public async Task<GeocodeResult> GetGeocodeResult(string city)
        {
            var geocodeResult = new GeocodeResult();

            var geocodeData = await GetGeocodes();

            geocodeResult.Geocode = GetGeocode(city, geocodeData);
            if(geocodeResult.Geocode == null)
            {
                geocodeResult.ValidCities = GetGeocodeCitiesCommaSeparated(geocodeData);
            }
            return geocodeResult;
        }

        private async Task<Geocodes> GetGeocodes()
        {
            try
            {
                var json = await FileManager.GetJsonFromFileAsync($"{Constants.ResourcesPath}\\geocode.json");
                return JsonConvert.DeserializeObject<Geocodes>(json);
            }
            catch (Exception ex)
            {
                var error = ex.Message;
                throw;
            }
        }

        private GeocodeItem GetGeocode(string city, Geocodes geocodeData)
        {
            var list = new List<GeocodeItem>(geocodeData.geocodes);
            var geocode = list.FirstOrDefault(a => a.city.ToLower() == city.ToLower());
            return geocode;
        }

        private string GetGeocodeCitiesCommaSeparated(Geocodes geocodeData)
        {
            var sb = new StringBuilder();
            var cities = string.Empty;          

            var separator = "";
            foreach (var item in geocodeData.geocodes)
            {
                sb.Append(separator + item.city);
                separator = ", ";
            }

            return sb.ToString();
        }

    }
}
