namespace WitcheryResurrectedWeb.Suggestions;

public class UnnamedSuggestionView
{
    public int Id { get; }
    public string AuthorId { get; }
    public string MessageId { get; }
    public SuggestionState State { get; }

    public UnnamedSuggestionView(int id, Suggestion suggestion)
    {
        Id = id;
        AuthorId = suggestion.Author.ToString();
        MessageId = suggestion.Message.ToString();
        State = suggestion.State;
    }
}
