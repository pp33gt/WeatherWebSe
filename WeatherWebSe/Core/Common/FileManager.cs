using System.IO;
using System.Threading.Tasks;

namespace WeatherWebSe.Core.Common
{
    public static class FileManager
    {
        public async static Task<string> GetJsonFromFileAsync(string filePath)
        {
            var result = string.Empty;
            using (var reader = new StreamReader(filePath, System.Text.Encoding.UTF8))
            {
                result = await reader.ReadToEndAsync();
            }
            return result;
        }
    }
}
