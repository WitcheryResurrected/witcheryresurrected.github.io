﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WitcheryResurrectedWeb.Discord;
using WitcheryResurrectedWeb.Download;

namespace WitcheryResurrectedWeb.Controllers;

[EnableCors("CorsPolicy")]
public class DownloadsController : Controller
{
    private readonly IConfigurationManager _configurationManager;
    private readonly IDiscordHandler _discordHandler;
    private readonly IDownloadManager _downloadManager;

    public DownloadsController(
        IConfigurationManager configurationManager,
        IDiscordHandler discordHandler,
        IDownloadManager downloadManager
    )
    {
        _configurationManager = configurationManager;
        _discordHandler = discordHandler;
        _downloadManager = downloadManager;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFiles([FromForm] string? name, [FromForm] List<ModFile> files,
        [FromForm] string? changelog, [FromForm] string? pass)
    {
        if (!await _configurationManager.IsAuthenticated(pass)) return StatusCode(401);
        if (files.All(file => file.File == null || file.Version == null) || name == null) return StatusCode(400);

        var (downloadable, directoryName) = await _downloadManager.AddDownloads(
            name,
            changelog,
            files.Select<ModFile, (DownloadFile, Func<Stream, Task>)>(file => (
                new DownloadFile(
                    file.File!.FileName,
                    file.File.Length,
                    0,
                    file.Dependencies,
                    file.Loader,
                    file.Version!
                ),
                stream => file.File.CopyToAsync(stream)
            ))
        );

        await _discordHandler.PostChangelog(
            name,
            downloadable.Changelog,
            $"{Request.Scheme}://{Request.Host.ToString()}/download",
            directoryName,
            files.Select(file => file.File!.FileName)
        );

        return StatusCode(200);
    }

    [HttpGet("downloads")]
    public ActionResult<List<Downloadable>> Downloads([FromQuery] int limit, [FromQuery] string? after)
    {
        var downloads = _downloadManager.Downloads(limit, after);
        return downloads == null ? StatusCode(404) : downloads;
    }

    [HttpGet("download/{name}/{file}")]
    public async Task<IActionResult> Download([FromRoute] string name, [FromRoute] string file)
    {
        var stream = await _downloadManager.Download(name, file);
        return stream == null ? StatusCode(404) : File(stream, "application/java-archive", file);
    }

    [SuppressMessage("ReSharper", "UnusedAutoPropertyAccessor.Global")]
    [SuppressMessage("ReSharper", "ClassNeverInstantiated.Global")]
    public class ModFile
    {
        public IFormFile? File { get; set; }
        public ModLoader Loader { get; set; }
        public string? Version { get; set; }
        public List<Dependency> Dependencies { get; } = new();
    }
}
