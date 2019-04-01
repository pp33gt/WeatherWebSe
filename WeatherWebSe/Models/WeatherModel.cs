using System;

namespace WeatherWebSe.Models
{
    public class WeatherModel
    {
        public string City { get; set; }

        public decimal Temperature { get; set; }

        public DateTime ValidTime { get; set; }

        public string ValidTimeDisplay => ValidTime.ToString("yyyy-MM-dd HH:mm");

        public string ErrorMessage { get; set; }
    }
}
