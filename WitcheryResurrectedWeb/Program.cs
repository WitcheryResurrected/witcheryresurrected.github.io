using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using Discord.Webhook;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace WitcheryResurrectedWeb
{
    public static class Program
    {
        public static readonly Dictionary<string, Downloadable> Downloads = new(); 
        public static readonly SortedDictionary<DateTimeOffset, string> SortedDownloads = new(new DescendingComparer<DateTimeOffset>());
        
        public static DiscordWebhookClient WebhookClient { get; private set; }
        public static string Pass { get; private set; } = "";

        public static void Main(string[] args)
        {
            Pass = File.ReadAllText("pass.txt").Replace("\n", "").Trim();
            WebhookClient = new DiscordWebhookClient(File.ReadAllText("webhook.txt"));
            if (Directory.Exists("Downloads"))
            {
                foreach (var directory in Directory.EnumerateDirectories("Downloads"))
                {
                    var path = Path.GetRelativePath("Downloads", directory);
                    var downloadable = new Downloadable(
                        File.ReadAllText(Path.Combine(directory, "name.txt")).Replace("\n", "").Trim(),
                        JsonSerializer.Deserialize<DownloadFile[]>(File.ReadAllText(Path.Combine(directory, "indices.json"))),
                        DateTimeOffset.FromUnixTimeSeconds(
                            BitConverter.ToInt64(File.ReadAllBytes(Path.Combine(directory, "release")))),
                        new Changelog(File.ReadAllLines(Path.Combine(directory, "changelog.txt")))
                    );

                    Downloads[path] = downloadable;
                    SortedDownloads[downloadable.Release] = path;
                }
            }

            CreateHostBuilder(args).Build().Run();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
        
        public class DescendingBackedComparer<TKey, TOrdered > : IComparer<TKey>
            where TKey : IComparable<TKey>
            where TOrdered : IComparable<TOrdered>
        {
            private readonly Func<TKey, TOrdered> _backer;

            public DescendingBackedComparer(Func<TKey, TOrdered> backer) => _backer = backer;

            public int Compare(TKey x, TKey y) {
                if (y == null)
                    return x == null ? 0 : 1;

                return _backer(y).CompareTo(_backer(x));
            }
        }
        
        public class DescendingComparer<T> : IComparer<T> where T : IComparable<T> {
            public int Compare(T x, T y) {
                if (y == null)
                    return x == null ? 0 : 1;

                return y.CompareTo(x);
            }
        }
    }
}
