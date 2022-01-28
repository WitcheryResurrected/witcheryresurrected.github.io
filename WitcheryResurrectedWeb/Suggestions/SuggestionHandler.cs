using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace WitcheryResurrectedWeb.Suggestions
{
    public class SuggestionsHandler
    {
        private DateTime _lastFlush = DateTime.Now;
        private bool _writePending;

        private readonly string _file;

        public SortedDictionary<int, Suggestion> Suggestions { get; } = new();
        public SortedDictionary<ulong, int> ByMessage { get; } = new();
        public SortedDictionary<ulong, HashSet<int>> ByAuthor { get; } = new();

        public SuggestionsHandler(string file)
        {
            _file = file;
            if (File.Exists(file)) Load(File.ReadAllBytes(file));
        }

        public void MarkChange()
        {
            lock (Suggestions)
            {
                if (DateTime.Now - _lastFlush > new TimeSpan(0, 30, 0))
                {
                    Flush();
                }
                else
                {
                    _writePending = true;
                }
            }
        }

        public void Flush()
        {
            Console.WriteLine("Writing suggestions data...");
            File.WriteAllBytes(_file, Save().ToArray());
            Console.WriteLine("Write complete.");
            _lastFlush = DateTime.Now;
            _writePending = false;
        }

        public void AddShutdownHandling()
        {
            AppDomain.CurrentDomain.ProcessExit += (_, _) =>
            {
                lock (Suggestions)
                {
                    if (_writePending)
                        Flush();
                }
            };
        }

        private static void Write<T>(List<byte> byteList, T value)
        {
            var lastIndex = byteList.Count;
            for (var i = 0; i < Unsafe.SizeOf<T>(); ++i) byteList.Add(0);
            Unsafe.WriteUnaligned(ref CollectionsMarshal.AsSpan(byteList)[lastIndex], value);
        }

        private static T Read<T>(byte[] byteList, ref int offset)
        {
            var value = Unsafe.ReadUnaligned<T>(ref byteList[offset]);
            offset += Unsafe.SizeOf<T>();
            return value;
        }

        private List<byte> Save()
        {
            var byteList = new List<byte>();
            Write(byteList, Suggestions.Count);
            foreach (var (id, suggestion) in Suggestions)
            {
                Write(byteList, id);
                Write(byteList, suggestion.Message);
                Write(byteList, suggestion.Author);
                Write(byteList, suggestion.State);
                Write(byteList, suggestion.AuthorName.Length);
                foreach (var c in suggestion.AuthorName) Write(byteList, c);
                Write(byteList, suggestion.Keywords.Count);
                foreach (var suggestionKeyword in suggestion.Keywords)
                {
                    Write(byteList, suggestionKeyword.Length);
                    foreach (var c in suggestionKeyword) Write(byteList, c);
                }
            }

            return byteList;
        }
        
        private unsafe void Load(byte[] bytes)
        {
            Suggestions.Clear();
            var offset = 0;
            var suggestionCount = Read<int>(bytes, ref offset);
            for (var i = 0; i < suggestionCount; ++i)
            {
                var id = Read<int>(bytes, ref offset);
                var messageId = Read<ulong>(bytes, ref offset);
                var authorId = Read<ulong>(bytes, ref offset);
                var state = Read<SuggestionState>(bytes, ref offset);
                var authorTitleSize = Read<int>(bytes, ref offset);
                var authorTitle = new string((char*) Unsafe.AsPointer(ref bytes[offset]), 0, authorTitleSize);
                offset += authorTitleSize * sizeof(char);
                var keywordCapacity = Read<int>(bytes, ref offset);
                var set = new HashSet<string>(keywordCapacity);
                for (var j = 0; j < keywordCapacity; ++j)
                {
                    var keywordSize = Read<int>(bytes, ref offset);
                    set.Add(new string((char*) Unsafe.AsPointer(ref bytes[offset]), 0, keywordSize));
                    offset += keywordSize * sizeof(char);
                }
                Suggestions[id] = new Suggestion(messageId, authorId, state, authorTitle, set);
                ByMessage[messageId] = id;
                var suggestions = ByAuthor.ContainsKey(authorId) ? ByAuthor[authorId] : ByAuthor[authorId] = new HashSet<int>();
                suggestions.Add(id);
            }
        }
    }
}
