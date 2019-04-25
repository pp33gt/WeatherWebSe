using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WeatherWebSe.Controllers
{

    public class Model
    {
        public string txtValue1 { get; set; }
        public string txtValue2 { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class ServerTime
    {
        public string Result { get; set; }
        public string ErrorMessage { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ServerTimeController : ControllerBase
    {
        [HttpGet]
        [Route("Get")]
        [Produces("application/json")]
        public async Task<ServerTime> Get(int? delaymsecs)
        {
            var res = new ServerTime();
            if (delaymsecs.HasValue)
            {
                var delayMsecs = delaymsecs.Value;
                if (delayMsecs > 10000)
                {
                    throw new ArgumentOutOfRangeException("Specify Delay Within 0-10000");
                }
                System.Threading.Thread.Sleep(delayMsecs);
            }
            var time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            res.Result = time;
            return res;
        }

       

        [HttpPost]
        [Route("Post")]
        [Produces("application/json")]
        public async Task<Model> Post(Model model)
        {
            if(ModelState.IsValid)
            {
                return new Model() { txtValue1 = '*' + model.txtValue1, txtValue2 = '*' + model.txtValue2 };
            }
            return new Model() { ErrorMessage = "ModelState Invalid" };
        }
    }
}