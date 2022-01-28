namespace WitcheryResurrectedWeb.Suggestions
{
    public class SuggestionView
    {
        public int Id { get; }
        public string AuthorName { get; }
        public string Content { get; }
        public SuggestionState State { get; }

        public SuggestionView(int id, string authorName, string content, SuggestionState state)
        {
            Id = id;
            AuthorName = authorName;
            Content = content;
            State = state;
        }
    }
}
