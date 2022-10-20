using System.Collections.Generic;
using System.Threading.Tasks;
using WitcheryResurrectedWeb.Discord;

namespace WitcheryResurrectedWeb.Suggestions;

public struct Suggestion
{
    public ulong Message { get; }
    public ulong Author { get; }
    public SuggestionState State { get; set; }
        
    public string AuthorName { get; }
    public HashSet<string> Keywords { get; }

    public Suggestion(ulong message, ulong author, SuggestionState state, string authorName, HashSet<string> keywords)
    {
        Message = message;
        Author = author;
        State = state;
        AuthorName = authorName;
        Keywords = keywords;
    }

    public async Task<string?> GetContent(IDiscordHandler discordHandler)
    {
        // TODO
        return null;
    }
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