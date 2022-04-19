using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WitcheryResurrectedWeb.Discord;
using WitcheryResurrectedWeb.Suggestions;

namespace WitcheryResurrectedWeb.Controllers;

[Route("suggestions")]
public class SuggestionsController : Controller
{
    private readonly IConfigurationManager _configurationManager;
    private readonly IDiscordHandler _discordHandler;
    private readonly ISuggestionsHandler _suggestionsHandler;

    public SuggestionsController(
        IConfigurationManager configurationManager,
        IDiscordHandler discordHandler,
        ISuggestionsHandler suggestionsHandler
    )
    {
        _configurationManager = configurationManager;
        _discordHandler = discordHandler;
        _suggestionsHandler = suggestionsHandler;
    }

    [HttpPost("add/{messageId}")]
    public async Task<ActionResult<int>> AddSuggestion([FromRoute] ulong messageId, [FromBody] string? pass)
    {
        if (!await _configurationManager.IsAuthenticated(pass)) return StatusCode(401);
        if (_discordHandler.SuggestionsChannel == null) return StatusCode(501);
        var message = await _discordHandler.SuggestionsChannel.GetMessageAsync(messageId);
        if (message == null) return StatusCode(404);
        var id = _suggestionsHandler.Suggestions.Count > 0 ? _suggestionsHandler.Suggestions.Last().Key + 1 : 1;
        var filteredWords =
            from x in Regex.Replace(message.Content.Replace('\n', ' '), "[^ A-Za-z0-9_-]", "").Split(" ")
            where x.Length > 3
            select x;
        _suggestionsHandler.Suggestions[id] = new Suggestion(messageId, message.Author.Id, SuggestionState.Pending,
            message.Author.Username, new HashSet<string>(filteredWords));
        await _suggestionsHandler.MarkChange();
        return id;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<UnnamedSuggestionView>> DeleteSuggestion([FromRoute] int id, [FromBody] string? pass)
    {
        if (!await _configurationManager.IsAuthenticated(pass)) return StatusCode(401);
        if (!_suggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
        _suggestionsHandler.Suggestions.Remove(id, out var suggestion);
        _suggestionsHandler.ByAuthor[suggestion.Author].Remove(id);
        _suggestionsHandler.ByMessage.Remove(suggestion.Message);
        await _suggestionsHandler.MarkChange();
        return new UnnamedSuggestionView(id, suggestion);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<UnnamedSuggestionView>> UpdateSuggestion([FromRoute] int id,
        [FromBody] Update update)
    {
        if (!await _configurationManager.IsAuthenticated(update.Pass)) return StatusCode(401);
        if (!_suggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
        var suggestion = _suggestionsHandler.Suggestions[id];
        suggestion.State = update.State;
        _suggestionsHandler.Suggestions[id] = suggestion;
        await _suggestionsHandler.MarkChange();
        return new UnnamedSuggestionView(id, suggestion);
    }

    [HttpGet("{id:int}")]
    public ActionResult<UnnamedSuggestionView> ById([FromRoute] int id)
    {
        if (!_suggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
        return new UnnamedSuggestionView(id, _suggestionsHandler.Suggestions[id]);
    }

    [HttpGet("by_message/{messageId}")]
    public ActionResult<UnnamedSuggestionView> ByMessage([FromRoute] ulong messageId)
    {
        if (!_suggestionsHandler.ByMessage.ContainsKey(messageId)) return StatusCode(404);
        var id = _suggestionsHandler.ByMessage[messageId];
        return new UnnamedSuggestionView(id, _suggestionsHandler.Suggestions[id]);
    }

    [HttpGet("by_author/{authorId}")]
    public ActionResult<List<UnnamedSuggestionView>> ByAuthor([FromRoute] ulong authorId)
    {
        if (!_suggestionsHandler.ByAuthor.ContainsKey(authorId)) return StatusCode(404);
        var authorSuggestions =
            from id in _suggestionsHandler.ByAuthor[authorId]
            select new UnnamedSuggestionView(id, _suggestionsHandler.Suggestions[id]);

        return new List<UnnamedSuggestionView>(authorSuggestions);
    }

    [HttpGet]
    public async Task<ActionResult<List<SuggestionView>>> GetSuggestions([FromQuery] string? last)
    {
        var suggestions = new List<SuggestionView>();
        int? lastId;
        if (last == null)
        {
            lastId = null;
        }
        else
        {
            if (!int.TryParse(last, out var id)) return suggestions;
            lastId = id;
        }

        var sent = -1;
        foreach (var (id, suggestion) in _suggestionsHandler.Suggestions)
        {
            switch (sent)
            {
                case < 1 when !lastId.HasValue:
                    sent = 1;
                    suggestions.Add(new SuggestionView(id, suggestion.AuthorName,
                        await suggestion.GetContent(_discordHandler) ?? "Failed to fetch contents.", suggestion.State));
                    break;
                case < 0 when id == lastId.Value:
                    sent = 0;
                    break;
                default:
                {
                    if (sent != -1)
                    {
                        if (sent++ >= 10) continue;
                        suggestions.Add(new SuggestionView(id, suggestion.AuthorName,
                            await suggestion.GetContent(_discordHandler) ?? "Failed to fetch contents.",
                            suggestion.State));
                    }

                    break;
                }
            }
        }

        return suggestions;
    }

    [SuppressMessage("ReSharper", "UnusedAutoPropertyAccessor.Global")]
    public class Update
    {
        public SuggestionState State { get; set; }
        public string? Pass { get; set; }
    }
}