using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace WitcheryResurrectedWeb.Suggestions;

public interface ISuggestionsHandler : IHostedService, IDisposable, IAsyncDisposable
{
    IDictionary<int, Suggestion> Suggestions { get; }
    IDictionary<ulong, int> ByMessage { get; }
    IDictionary<ulong, ISet<int>> ByAuthor { get; }

    Task MarkChange();
    public Task Flush();
}

public class SuggestionsHandler : ISuggestionsHandler
{
    private DateTime _lastFlush = DateTime.Now;
    private bool _writePending;

    private readonly string _file;

    public IDictionary<int, Suggestion> Suggestions { get; } = new SortedDictionary<int, Suggestion>();
    public IDictionary<ulong, int> ByMessage { get; } = new SortedDictionary<ulong, int>();
    public IDictionary<ulong, ISet<int>> ByAuthor { get; } = new SortedDictionary<ulong, ISet<int>>();

    public SuggestionsHandler(string file) => _file = file;

    public Task MarkChange()
    {
        if (DateTime.Now - _lastFlush > new TimeSpan(0, 30, 0))
        {
            return Flush();
        }

        _writePending = true;
        return Task.CompletedTask;
    }

    public async Task Flush()
    {
        await Console.Out.WriteLineAsync("Writing suggestions data...");
        await using var fileData = File.OpenWrite(_file);
        await using var output = new BinaryWriter(fileData);
        output.Write(Suggestions.Count);

        foreach (var (id, suggestion) in Suggestions)
        {
            output.Write(id);
            output.Write(suggestion.Message);
            output.Write(suggestion.Author);
            output.Write((byte) suggestion.State);
            output.Write(suggestion.AuthorName);

            output.Write(suggestion.Keywords.Count);
            foreach (var suggestionKeyword in suggestion.Keywords) output.Write(suggestionKeyword);
        }

        await Console.Out.WriteLineAsync("Write complete.");
        _lastFlush = DateTime.Now;
        _writePending = false;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (File.Exists(_file))
        {
            await using var fileData = File.OpenRead(_file);
            using var input = new BinaryReader(fileData);
            var suggestionCount = input.ReadInt32();
            for (var i = 0; i < suggestionCount; ++i)
            {
                var id = input.ReadInt32();
                var messageId = input.ReadUInt64();
                var authorId = input.ReadUInt64();
                var state = (SuggestionState) input.ReadByte();
                var authorTitle = input.ReadString();

                var keywordCapacity = input.ReadInt32();
                var set = new HashSet<string>(keywordCapacity);
                for (var j = 0; j < keywordCapacity; ++j) set.Add(input.ReadString());

                Suggestions[id] = new Suggestion(messageId, authorId, state, authorTitle, set);
                ByMessage[messageId] = id;
                var suggestions = ByAuthor.ContainsKey(authorId)
                    ? ByAuthor[authorId]
                    : ByAuthor[authorId] = new HashSet<int>();
                suggestions.Add(id);
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) =>
        _writePending ? Flush() : Task.CompletedTask;

    public void Dispose()
    {
        Flush().GetAwaiter().GetResult();
        GC.SuppressFinalize(this);
    }

    public async ValueTask DisposeAsync()
    {
        await Flush();
        GC.SuppressFinalize(this);
    }
}
