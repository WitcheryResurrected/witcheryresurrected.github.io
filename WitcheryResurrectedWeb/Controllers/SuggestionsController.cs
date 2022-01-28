using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WitcheryResurrectedWeb.Discord;
using WitcheryResurrectedWeb.Suggestions;

namespace WitcheryResurrectedWeb.Controllers
{
    [Route("suggestions")]
    public class SuggestionsController : Controller
    {
        [HttpPost("add/{messageId}")]
        public async Task<ActionResult<int>> AddSuggestion([FromRoute] ulong messageId, [FromBody] string pass)
        {
            if (pass != Program.Config.UploadCode) return StatusCode(401);
            var message = await DiscordHandler.SuggestionsChannel.GetMessageAsync(messageId);
            if (message == null) return StatusCode(404);
            var id = Program.SuggestionsHandler.Suggestions.Count > 0 ? Program.SuggestionsHandler.Suggestions.Last().Key + 1 : 1;
            var filteredWords = from x in Regex.Replace(message.Content.Replace('\n', ' '), "[^ A-Za-z0-9_-]", "").Split(" ") where x.Length > 3 select x;
            Program.SuggestionsHandler.Suggestions[id] = new Suggestion(messageId, message.Author.Id, SuggestionState.Pending,
                message.Author.Username, new HashSet<string>(filteredWords));
            Program.SuggestionsHandler.MarkChange();
            return id;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<UnnamedSuggestionView> DeleteSuggestion([FromRoute] int id, [FromBody] string pass)
        {
            if (pass != Program.Config.UploadCode) return StatusCode(401);
            if (!Program.SuggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
            Program.SuggestionsHandler.Suggestions.Remove(id, out var suggestion);
            Program.SuggestionsHandler.ByAuthor[suggestion.Author].Remove(id);
            Program.SuggestionsHandler.ByMessage.Remove(suggestion.Message);
            Program.SuggestionsHandler.MarkChange();
            return new UnnamedSuggestionView(id, suggestion);
        }
        
        [HttpPatch("{id:int}")]
        public ActionResult<UnnamedSuggestionView> UpdateSuggestion([FromRoute] int id, [FromBody] Update update)
        {
            if (update.Pass != Program.Config.UploadCode) return StatusCode(401);
            if (!Program.SuggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
            var suggestion = Program.SuggestionsHandler.Suggestions[id];
            suggestion.State = update.State;
            Program.SuggestionsHandler.Suggestions[id] = suggestion;
            Program.SuggestionsHandler.MarkChange();
            return new UnnamedSuggestionView(id, suggestion);
        }
        
        [HttpGet("{id:int}")]
        public ActionResult<UnnamedSuggestionView> ById([FromRoute] int id)
        {
            if (!Program.SuggestionsHandler.Suggestions.ContainsKey(id)) return StatusCode(404);
            return new UnnamedSuggestionView(id, Program.SuggestionsHandler.Suggestions[id]);
        }

        [HttpGet("by_message/{messageId}")]
        public ActionResult<UnnamedSuggestionView> ByMessage([FromRoute] ulong messageId)
        {
            if (!Program.SuggestionsHandler.ByMessage.ContainsKey(messageId)) return StatusCode(404);
            var id = Program.SuggestionsHandler.ByMessage[messageId];
            return new UnnamedSuggestionView(id, Program.SuggestionsHandler.Suggestions[id]);
        }

        [HttpGet("by_author/{authorId}")]
        public ActionResult<List<UnnamedSuggestionView>> ByAuthor([FromRoute] ulong authorId)
        {
            if (!Program.SuggestionsHandler.ByAuthor.ContainsKey(authorId)) return StatusCode(404);
            var authorSuggestions =
                from id in Program.SuggestionsHandler.ByAuthor[authorId]
                select new UnnamedSuggestionView(id, Program.SuggestionsHandler.Suggestions[id]);
            
            return new List<UnnamedSuggestionView>(authorSuggestions);
        }

        [HttpGet]
        public async Task<ActionResult<List<SuggestionView>>> GetSuggestions([FromQuery] string last)
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
            foreach (var (id, suggestion) in Program.SuggestionsHandler.Suggestions)
            {
                switch (sent)
                {
                    case < 1 when !lastId.HasValue:
                        sent = 1;
                        suggestions.Add(new SuggestionView(id, suggestion.AuthorName, await suggestion.GetContent(), suggestion.State));
                        break;
                    case < 0 when id == lastId.Value:
                        sent = 0;
                        break;
                    default:
                    {
                        if (sent != -1)
                        {
                            if (sent++ >= 10) continue;
                            suggestions.Add(new SuggestionView(id, suggestion.AuthorName, await suggestion.GetContent(), suggestion.State));
                        }

                        break;
                    }
                }
            }

            return suggestions;
        }

        public class Update
        {
            public SuggestionState State { get; set; }
            public string Pass { get; set; }
        }
    }
}
