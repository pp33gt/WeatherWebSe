namespace WeatherWebSe.Core.Geocode
{
    public class GeocodeResult
    {
        public GeocodeItem Geocode { get; set; }

        public string ValidCities { get; set; }

        public bool ErrorOccured => !string.IsNullOrEmpty(ValidCities);
    }
}
