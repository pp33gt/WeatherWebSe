using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WeatherWebSe.Controllers
{

    public class Model
    {
        public int? delaymsecs { get; set; }
        public string txtValue { get; set; }
        public string ErrorMessage { get; set; }
        public List<string> historyValues { get; set; }
        public string prerequisiteValue { get; set; }
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
            res.ErrorMessage = "";
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

            if (model.delaymsecs.HasValue)
            {
                var delayMsecs = model.delaymsecs.Value;
                if (delayMsecs > 10000)
                {
                    throw new ArgumentOutOfRangeException("Specify Delay Within 0-10000");
                }
                System.Threading.Thread.Sleep(delayMsecs);
            }

            if (ModelState.IsValid)
            {
                if (model.historyValues?.Count >= 5)
                {
                    model.ErrorMessage = "Max number of history items reached, reseting";
                    model.historyValues = new List<string>();
                }

                if (!string.IsNullOrEmpty(model.txtValue) && model.historyValues != null)
                {
                    var prereq = model.prerequisiteValue.Replace(" ", "");
                    TagLastHistoryItem(model.historyValues, $"{prereq}:{model.txtValue}");
                }

                return model;
            }
            return new Model() { ErrorMessage = "ModelState Invalid" };
        }

        private static void TagLastHistoryItem(List<string> historyValues, string txtValue)
        {
            var indexLast1 = historyValues.Count - 1;
            if (indexLast1 >= 0)
            {
                var lastItem = historyValues[indexLast1];

                historyValues[indexLast1] = $"({txtValue}) " + lastItem;
            }
        }
    }
}