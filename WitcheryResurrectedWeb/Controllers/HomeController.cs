using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Discord;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Files = System.IO.File;

namespace WitcheryResurrectedWeb.Controllers
{
    public class HomeController : Controller
    {
        [HttpPost("upload")]  
        public async Task<IActionResult> UploadFiles(string name, List<ModFile> files, string changelog, string pass)
        {
            if (pass != Program.Pass) return Content("Wrong key.");
            if (files.All(file => file.File == null)) return Content("No files selected.");
            var directoryName = Regex.Replace(name, "[^a-zA-Z0-9_.-]", "");
            var folder = Path.Combine("Downloads", directoryName);
            Directory.CreateDirectory("Downloads");
            Directory.CreateDirectory(folder);

            var releaseDate = DateTimeOffset.Now;
            var downloadable = new Downloadable(
                name,
                files.Where(file => file.File != null).Select(file => new DownloadFile(file.File.FileName, file.File.Length, 0, file.Dependencies, file.Loader, file.Version)),
                releaseDate,
                new Changelog(changelog?.Split('\n') ?? Enumerable.Empty<string>())
            );
            
            await using (var release = Files.Create(Path.Combine(folder, "release")))
            {
                await release.WriteAsync(BitConverter.GetBytes(DateTimeOffset.Now.ToUnixTimeSeconds()));
            }
            
            await using (var text = Files.Create(Path.Combine(folder, "indices.json")))
            {
                await text.WriteAsync(JsonSerializer.SerializeToUtf8Bytes(downloadable.Paths));
                
                foreach (var file in files)
                {
                    await using var stream = new FileStream(Path.Combine(folder, file.File.FileName), FileMode.Create);
                    await file.File.CopyToAsync(stream);
                }
            }
            
            await using (var text = Files.CreateText(Path.Combine(folder, "changelog.txt")))
            {
                await text.WriteLineAsync(changelog);
            }

            await using (var text = Files.CreateText(Path.Combine(folder, "name.txt")))
            {
                await text.WriteLineAsync(name);
            }

            Program.Downloads[directoryName] = downloadable;
            Program.SortedDownloads[releaseDate] = directoryName;

            var url = $"{Request.Scheme}://{Request.Host.ToString()}/Download";
            var fileLinks = string.Join('\n', files.Select(file => $"[{file.File.FileName}]({url}/{directoryName}/{file.File.FileName})"));
            var additions = string.Join('\n', downloadable.Changelog.Additions.Select(change => $"+{change}"));
            var removals = string.Join('\n', downloadable.Changelog.Removals.Select(change => $"-{change}"));
            var changes = string.Join('\n', downloadable.Changelog.Changes.Select(change => $"*{change}"));
            var builder = new StringBuilder(fileLinks);
            var hasChanges = false;
            if (!string.IsNullOrEmpty(additions))
            {
                hasChanges = true;
                builder.Append("\n\nChangelog:\n").Append(additions);
            }

            if (!string.IsNullOrEmpty(removals))
            {
                if (!hasChanges)
                {
                    hasChanges = true;
                    builder.Append("\n\nChangelog:");
                }
                builder.Append('\n').Append(removals);
            }

            if (!string.IsNullOrEmpty(changes))
            {
                if (!hasChanges) builder.Append("\n\nChangelog:");
                builder.Append('\n').Append(changes);
            }

            await Program.WebhookClient.SendMessageAsync(embeds: new []
            {
                new EmbedBuilder()
                    .WithTitle(name)
                    .WithDescription(builder.ToString())
                    .Build()
            });

            return Content("Success!");  
        }

        [HttpGet("downloads")]
        public ActionResult<IDictionary<string, Downloadable>> GetDownloads() => GetDownloads(null);

        [HttpGet("downloads/{last}")]
        public ActionResult<IDictionary<string, Downloadable>> GetDownloads([FromRoute] string last)
        {
            var downloads = new SortedDictionary<string, Downloadable>(new Program.DescendingBackedComparer<string, DateTimeOffset>(key => Program.Downloads[key].Release));
            DateTimeOffset? lastDate;
            if (last == null)
            {
                lastDate = null;
            }
            else
            {
                if (!long.TryParse(last, out var unix)) return downloads;
                lastDate = DateTimeOffset.FromUnixTimeSeconds(unix);
            }

            var sent = -1;
            foreach (var (date, name) in Program.SortedDownloads)
            {
                switch (sent)
                {
                    case < 1 when !lastDate.HasValue:
                        sent = 1;
                        downloads[name] = Program.Downloads[name];
                        break;
                    case < 0 when date == lastDate.Value:
                        sent = 0;
                        break;
                    default:
                    {
                        if (sent != -1)
                        {
                            if (sent++ >= 5) continue;
                            downloads[name] = Program.Downloads[name];
                        }

                        break;
                    }
                }
            }

            return downloads;
        }

        [HttpGet("download/{name}/{file}")]
        public async Task<IActionResult> Download([FromRoute] string name, [FromRoute] string file)
        {
            if (!Program.Downloads.ContainsKey(name))
                return StatusCode(404);
            var download = Program.Downloads[name];
            var index = -1;
            for (var i = 0; i < download.Paths.Length; ++i)
            {
                var downloadPath = download.Paths[i];
                if (downloadPath.Name != file) continue;
                index = i;
                break;
            }

            if (index == -1)
                return StatusCode(404);

            lock (download) ++download.Paths[index].DownloadCount;
            var indices = Path.Combine("Downloads", name, "indices.json");
            var downloadFiles = JsonSerializer.Deserialize<DownloadFile[]>(
                await Files.ReadAllTextAsync(indices));
            ++downloadFiles![index].DownloadCount;

            await Files.WriteAllTextAsync(indices, JsonSerializer.Serialize(downloadFiles));
            
            return File(new FileStream(Path.Combine("Downloads", name, file), FileMode.Open), "application/java-archive", file);
        }
        
        public class ModFile
        {
            public IFormFile File { get; set; }
            public ModLoader Loader { get; set; }
            public string Version { get; set; }
            public List<Dependency> Dependencies { get; } = new();
        }
    }
}
