using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace WeatherWebSe.Core.Common
{
    public static class HttpManager
    {
        public static async Task<string> GetAsync(string url)
        {
            var request = (HttpWebRequest)WebRequest.Create(url);

            var response = await request.GetResponseAsync();
            using (var responseStream = response.GetResponseStream())
            {
                var reader = new StreamReader(responseStream, System.Text.Encoding.UTF8);
                return reader.ReadToEnd();
            }
        }
    }
}
