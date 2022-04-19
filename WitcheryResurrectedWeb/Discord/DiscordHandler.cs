using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Discord;
using Discord.Webhook;
using Discord.WebSocket;
using Microsoft.Extensions.Hosting;
using WitcheryResurrectedWeb.Download;

namespace WitcheryResurrectedWeb.Discord;

public interface IDiscordHandler : IHostedService
{
    DiscordWebhookClient? WebhookClient { get; }
    DiscordSocketClient? BotClient { get; }

    SocketGuild? Guild { get; }
    SocketTextChannel? SuggestionsChannel { get; }

    public Task PostChangelog(string name, Changelog changelog, string url, string directoryName, IEnumerable<string> links);
}

public class DiscordHandler : IDiscordHandler
{
    public DiscordWebhookClient? WebhookClient { get; private set; }
    public DiscordSocketClient? BotClient { get; private set; }

    public SocketGuild? Guild { get; private set; }
    public SocketTextChannel? SuggestionsChannel { get; private set; }

    private readonly IConfigurationManager _configurationManager;

    public DiscordHandler(IConfigurationManager configurationManager) => _configurationManager = configurationManager;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (_configurationManager.Config.Webhook != null)
            WebhookClient = new DiscordWebhookClient(_configurationManager.Config.Webhook);

        if (_configurationManager.Config.BotToken != null)
        {
            BotClient = new DiscordSocketClient();
            BotClient.Ready += () =>
            {
                if (_configurationManager.Config.GuildId != null)
                {
                    Guild = BotClient.GetGuild(ulong.Parse(_configurationManager.Config.GuildId));
                }

                if (Guild != null && _configurationManager.Config.SuggestionsChannel != null)
                {
                    SuggestionsChannel =
                        Guild.GetTextChannel(ulong.Parse(_configurationManager.Config.SuggestionsChannel));
                }

                return Console.Out.WriteLineAsync($"Logged into bot {BotClient.CurrentUser}");
            };
            await BotClient.LoginAsync(TokenType.Bot, _configurationManager.Config.BotToken);
            await BotClient.StartAsync();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    public async Task PostChangelog(string name, Changelog changelog, string url, string directoryName, IEnumerable<string> fileNames)
    {
        if (WebhookClient != null)
        {
            var fileLinks = string.Join('\n', fileNames.Select(file => $"[{file}]({url}/{directoryName}/{file})"));
            var additions = string.Join('\n', changelog.Additions.Select(change => $"+{change}"));
            var removals = string.Join('\n', changelog.Removals.Select(change => $"-{change}"));
            var changes = string.Join('\n', changelog.Changes.Select(change => $"*{change}"));
            var builder = new StringBuilder(fileLinks);
            var hasChanges = false;
            if (!string.IsNullOrEmpty(additions))
            {
                hasChanges = true;
                builder.Append("\n\nChangelog:\n").Append(additions);
            }

            if (!string.IsNullOrEmpty(removals))
            {
                if (!hasChanges)
                {
                    hasChanges = true;
                    builder.Append("\n\nChangelog:");
                }

                builder.Append('\n').Append(removals);
            }

            if (!string.IsNullOrEmpty(changes))
            {
                if (!hasChanges) builder.Append("\n\nChangelog:");
                builder.Append('\n').Append(changes);
            }

            await WebhookClient.SendMessageAsync("<@&874401180804087878>", embeds: new[]
            {
                new EmbedBuilder()
                    .WithTitle(name)
                    .WithDescription(builder.ToString())
                    .Build()
            });
        }
    }
}
