using Microsoft.EntityFrameworkCore;

namespace WitcheryResurrectedWeb.Suggestions;

public class SuggestionsContext : DbContext
{
    public DbSet<SuggestionX> Suggestions { get; set; }
    public DbSet<SuggestionStateX> SuggestionStates { get; set; }
    public DbSet<SuggestionContent> SuggestionContent { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options
            .UseSqlite("Data Source=suggestions.sqlite")
            .UseSnakeCaseNamingConvention();
}
