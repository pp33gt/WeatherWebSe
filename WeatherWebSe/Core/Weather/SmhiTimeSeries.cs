using System;

namespace WeatherWebSe.Core.Weather
{
    public class SmhiTimeSeries
    {
        public DateTime validTime { get; set; }
        public SmhiParameter[] parameters { get; set; }
    }
}
