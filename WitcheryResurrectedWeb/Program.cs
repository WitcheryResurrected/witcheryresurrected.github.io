using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using WitcheryResurrectedWeb.Discord;
using WitcheryResurrectedWeb.Download;
using WitcheryResurrectedWeb.Suggestions;

namespace WitcheryResurrectedWeb
{
    public static class Program
    {
        public static SuggestionsHandler SuggestionsHandler { get; private set; }
        public static Configuration Config { get; private set; }

        public static async Task Main(string[] args)
        {
            Config = JsonSerializer.Deserialize<Configuration>(await File.ReadAllTextAsync("config.json"));
            Debug.Assert(Config != null, nameof(Config) + " != null");

            SuggestionsHandler = new SuggestionsHandler("suggestions.bin");

            SuggestionsHandler.AddShutdownHandling();

            await DownloadManager.Load();
            await DiscordHandler.Load(Config);
            await CreateHostBuilder(args).Build().RunAsync();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });

        public class Configuration
        {
            public string Webhook { get; set; }

            public string BotToken { get; set; }

            public string UploadCode { get; set; }

            public string GuildId { get; set; }

            public string SuggestionsChannel { get; set; }
        }
    }
}
