using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace WitcheryResurrectedWeb.Download
{
    public static class DownloadManager
    {
        public static readonly Dictionary<string, Downloadable> Downloads = new(); 
        public static readonly SortedDictionary<DateTimeOffset, string> SortedDownloads = new(new DescendingComparer<DateTimeOffset>());

        public static async Task Load()
        {
            if (!Directory.Exists("Downloads")) return;
            foreach (var directory in Directory.EnumerateDirectories("Downloads"))
            {
                var path = Path.GetRelativePath("Downloads", directory);
                var downloadable = new Downloadable(
                    (await File.ReadAllTextAsync(Path.Combine(directory, "name.txt"))).Replace("\n", "").Trim(),
                    JsonSerializer.Deserialize<DownloadFile[]>(await File.ReadAllTextAsync(Path.Combine(directory, "indices.json"))),
                    DateTimeOffset.FromUnixTimeSeconds(
                        BitConverter.ToInt64(await File.ReadAllBytesAsync(Path.Combine(directory, "release")))),
                    new Changelog(await File.ReadAllLinesAsync(Path.Combine(directory, "changelog.txt")))
                );

                Downloads[path] = downloadable;
                SortedDownloads[downloadable.Release] = path;
            }

        }
        
        public class DescendingBackedComparer<TKey, TOrdered> : IComparer<TKey>
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