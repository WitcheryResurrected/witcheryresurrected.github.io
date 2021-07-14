using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WitcheryResurrectedWeb.Models;
using Files = System.IO.File;

namespace WitcheryResurrectedWeb.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Downloads() => View();
        public IActionResult Upload() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});

        [HttpPost]  
        public async Task<IActionResult> UploadFiles(Uploadable upload)
        {
            if (upload.Pass != Program.Pass) return Content("Wrong key.");
            if (upload.Files == null || upload.Files.Count == 0) return Content("No files selected.");
            var folder = Path.Combine("Downloads", upload.Name);
            Directory.CreateDirectory("Downloads");
            Directory.CreateDirectory(folder);

            await using (var release = Files.Create(Path.Combine(folder, "release")))
            {
                await release.WriteAsync(BitConverter.GetBytes(DateTimeOffset.Now.ToUnixTimeSeconds()));
            }
            
            await using (var text = Files.CreateText(Path.Combine(folder, "indices.txt")))
            {
                foreach (var file in upload.Files)
                {
                    await text.WriteLineAsync($"{file.FileName};0");
                    await using var stream = new FileStream(Path.Combine(folder, file.FileName), FileMode.Create);
                    await file.CopyToAsync(stream);
                }
            }

            await using (var text = Files.CreateText(Path.Combine(folder, "changelog.txt")))
            {
                await text.WriteLineAsync(upload.ChangeLog);
            }

            var releaseDate = DateTimeOffset.Now;
            Program.Downloads[upload.Name] = new Program.Downloadable(
                upload.Name,
                upload.Files.Select(file => new Program.DownloadFile(file.FileName, file.Length, 0)),
                releaseDate
            );

            Program.SortedDownloads[releaseDate] = upload.Name;

            return Content("Success!");  
        }

        [HttpGet]
        public ActionResult<List<Program.Downloadable>> GetDownloads() => GetDownloads(null);

        public ActionResult<List<Program.Downloadable>> GetDownloads(string last)
        {
            var list = new List<Program.Downloadable>();
            DateTimeOffset? lastDate;
            if (last == null)
            {
                lastDate = null;
            }
            else
            {
                if (!long.TryParse(last, out var unix)) return list;
                lastDate = DateTimeOffset.FromUnixTimeSeconds(unix);
            }

            var sent = -1;
            foreach (var (date, name) in Program.SortedDownloads)
            {
                if (sent < 1 && !lastDate.HasValue)
                {
                    sent = 1;
                    list.Add(Program.Downloads[name]);
                } else if (lastDate.HasValue && date == lastDate.Value)
                {
                    sent = 0;
                }
                else if (sent != -1)
                {
                    if (sent++ >= 5) continue;
                    list.Add(Program.Downloads[name]);
                }
            }

            return list;
        }
        
        public async Task<IActionResult> Download(string filename)  
        {
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filename, FileMode.Open))  
            {
                await stream.CopyToAsync(memory);  
            }
            memory.Position = 0;  
            return File(memory, "application/java-archive", Path.GetFileName(filename));  
        }
        
        public class Uploadable
        {
            public string Name { set; get; }
            public List<IFormFile> Files { get; } = new();
            public string ChangeLog { set; get; }
            
            public string Pass { set; get; }
        }
    }
}
