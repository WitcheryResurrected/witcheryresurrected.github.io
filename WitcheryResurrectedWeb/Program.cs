using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace WitcheryResurrectedWeb
{
    public static class Program
    {
        public static readonly Dictionary<string, Downloadable> Downloads = new(); 
        public static readonly SortedDictionary<DateTimeOffset, string> SortedDownloads = new(new DescendingComparer<DateTimeOffset>());

        public static string Pass { get; private set; } = "";
        
        public static void Main(string[] args)
        {
            Pass = File.ReadAllText("pass.txt");

            if (Directory.Exists("Downloads"))
            {
                foreach (var directory in Directory.EnumerateDirectories("Downloads"))
                {
                    var path = Path.GetRelativePath("Downloads", directory);
                    var downloadable = new Downloadable(
                        File.ReadAllText(Path.Combine(path, "name.txt")),
                        File
                                .ReadAllLines(Path.Combine(directory, "indices.txt"))
                                .Select(name =>
                                {
                                    var strings = name.Split(";");
                                    return new DownloadFile(strings[0], new FileInfo(Path.Combine(directory, strings[0])).Length,
                                        long.Parse(strings[1]));
                                }), 
                        DateTimeOffset.FromUnixTimeSeconds(BitConverter.ToInt64(File.ReadAllBytes(Path.Combine(directory, "release"))))
                    );
                    AddChanges(File.ReadAllLines(Path.Combine(directory, "changelog.txt")), downloadable.Additions,
                        downloadable.Removals, downloadable.Changes);
                    
                    Downloads[path] = downloadable;
                    SortedDownloads[downloadable.Release] = path;
                }
            }

            CreateHostBuilder(args).Build().Run();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });

        public static void AddChanges(IEnumerable<string> text, List<string> additions, List<string> removals, List<string> changes)
        {
            foreach (var s in text)
            {
                if (s.StartsWith("+")) additions.Add(s[1..].Trim());
                else if (s.StartsWith("-")) removals.Add(s[1..].Trim());
                else if (s.StartsWith("*")) changes.Add(s[1..].Trim());
                else changes.Add(s.Trim());
            }
        }
        
        private class DescendingComparer<T> : IComparer<T> where T : IComparable<T> {
            public int Compare(T x, T y) {
                if (y == null)
                    return x == null ? 0 : 1;

                return y.CompareTo(x);
            }
        }

        public struct DownloadFile
        {
            public string Name { get; }
            public long Size { get; }
            public long DownloadCount;

            public DownloadFile(string name, long size, long downloadCount)
            {
                Name = name;
                Size = size;
                DownloadCount = downloadCount;
            }
        }
        
        public class Downloadable
        {
            public string Name { get; }
            public DownloadFile[] Paths { get; }
            
            public DateTimeOffset Release { get; }
            
            public List<string> Additions { get; } = new();
            public List<string> Removals { get; } = new();
            public List<string> Changes { get; } = new();
            
            public Downloadable(string name, IEnumerable<DownloadFile> paths, DateTimeOffset release)
            {
                Name = name;
                Paths = paths.ToArray();
                Release = release;
            }
        }
    }
}
