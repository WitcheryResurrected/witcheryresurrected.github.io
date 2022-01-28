using System;
using System.Threading.Tasks;
using Discord;
using Discord.Webhook;
using Discord.WebSocket;

namespace WitcheryResurrectedWeb.Discord
{
    public class DiscordHandler
    {
        public static DiscordWebhookClient WebhookClient { get; private set; }
        public static DiscordSocketClient BotClient { get; private set; }

        public static SocketGuild Guild { get; private set; }
        public static SocketTextChannel SuggestionsChannel { get; private set; }

        public static async Task Load(Program.Configuration config)
        {
            WebhookClient = new DiscordWebhookClient(config.Webhook);
            BotClient = new DiscordSocketClient();
            BotClient.Ready += () =>
            {
                Guild = BotClient.GetGuild(ulong.Parse(config.GuildId));
                SuggestionsChannel = Guild.GetTextChannel(ulong.Parse(config.SuggestionsChannel));
                return Console.Out.WriteLineAsync($"Logged into bot {BotClient.CurrentUser}");
            };
            await BotClient.LoginAsync(TokenType.Bot, config.BotToken);
            await BotClient.StartAsync();
        }
    }
}
