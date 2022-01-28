using System.Collections.Generic;
using System.Threading.Tasks;
using WitcheryResurrectedWeb.Discord;

namespace WitcheryResurrectedWeb.Suggestions
{
    public struct Suggestion
    {
        public ulong Message { get; }
        public ulong Author { get; }
        public SuggestionState State { get; set; }
        
        public string AuthorName { get; set; }
        public HashSet<string> Keywords { get; }

        private string _content;

        public Suggestion(ulong message, ulong author, SuggestionState state, string authorName, HashSet<string> keywords)
        {
            Message = message;
            Author = author;
            State = state;
            AuthorName = authorName;
            Keywords = keywords;
            _content = null;
        }
        
        public async Task<string> GetContent() =>
            _content ??= (await DiscordHandler.SuggestionsChannel.GetMessageAsync(Message)).Content;
    }

    public enum SuggestionState : byte
    {
        Pending,
        Approved,
        Implemented,
        PartiallyApproved,
        PartiallyImplemented,
        Denied,
        Duplicate
    }
}
