using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace WeatherWebSe.Pages
{
    public class JqAjxWhenTestModel : PageModel
    {
        private IConfiguration Configuration { get; }


        private string apiUrl = null;

        public string ApiUrl
        {
            get
            {
                if (apiUrl == null)
                {
                    apiUrl = Configuration.GetValue<string>("apiUrl");
                }
                return apiUrl;
            }
        }

        public JqAjxWhenTestModel(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        public void OnGet()
        {
        }
    }
}