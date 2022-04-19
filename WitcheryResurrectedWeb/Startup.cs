using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WitcheryResurrectedWeb.Discord;
using WitcheryResurrectedWeb.Download;
using WitcheryResurrectedWeb.Suggestions;

namespace WitcheryResurrectedWeb;

public class Startup
{
    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options => options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

        services.AddControllersWithViews();

        services.AddSingleton<ISuggestionsHandler>(_ => new SuggestionsHandler("suggestions.bin"));
        services.AddHostedService(provider => provider.GetRequiredService<ISuggestionsHandler>());

        services.AddSingleton<IConfigurationManager>(
            _ => new ConfigurationManager("config.json", "access_tokens.bin")
        );

        services.AddHostedService(provider => provider.GetRequiredService<IConfigurationManager>());

        services.AddSingleton<IDownloadManager>(_ => new DownloadManager("Downloads"));
        services.AddHostedService(provider => provider.GetRequiredService<IDownloadManager>());

        services.AddSingleton<IDiscordHandler>(
            provider => new DiscordHandler(provider.GetRequiredService<IConfigurationManager>())
        );

        services.AddHostedService(provider => provider.GetRequiredService<IDiscordHandler>());

        services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/build");
    }

    public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }


        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();

        app.UseRouting();
        app.UseCors("CorsPolicy");

        app.UseEndpoints(endpoints => endpoints.MapControllerRoute("default", "{controller}/{action=Index}/{id?}"));

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment()) spa.UseReactDevelopmentServer("start");
        });
    }
}