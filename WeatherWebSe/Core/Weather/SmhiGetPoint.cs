using System;

namespace WeatherWebSe.Core.Weather
{
    public class SmhiGetPoint
    {
        public DateTime approvedTime { get; set; }
        public DateTime referenceTime { get; set; }

        public SmhiTimeSeries[] timeSeries { get; set; }
    }
}
