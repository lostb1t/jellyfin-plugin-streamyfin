#pragma warning disable SA1611
#pragma warning disable SA1591
#pragma warning disable SA1615
#pragma warning disable CS0165

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
// using Jellyfin.Api.Attributes;
// using Jellyfin.Api.Extensions;
// using Jellyfin.Api.Helpers;
// using Jellyfin.Api.ModelBinders;
// using Jellyfin.Api.Models.LibraryDtos;
using Jellyfin.Data.Entities;
using Jellyfin.Data.Enums;
using Jellyfin.Extensions;
using MediaBrowser.Common.Api;
using MediaBrowser.Common.Extensions;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Controller.Dto;
using MediaBrowser.Controller.Entities;
using MediaBrowser.Controller.Entities.Audio;
using MediaBrowser.Controller.Entities.Movies;
using MediaBrowser.Controller.Entities.TV;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Providers;
using MediaBrowser.Model.Activity;
using MediaBrowser.Model.Configuration;
using MediaBrowser.Model.Dto;
using MediaBrowser.Model.Entities;
using MediaBrowser.Model.Globalization;
using MediaBrowser.Model.Net;
using MediaBrowser.Model.Querying;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Jellyfin.Plugin.Streamyfin.Api;

/// <summary>
/// CollectionImportController.
/// </summary>
[ApiController]
//[Authorize(Policy = "DefaultAuthorization")]
[Authorize]
[Route("collectionimport")]
// [Produces(MediaTypeNames.Application.Json)]
public class StreamyfinController : ControllerBase
{
    private readonly ILogger<StreamyfinController> _logger;
    private readonly ILoggerFactory _loggerFactory;
    // private readonly IFileSystem _fileSystem;
    private readonly IServerConfigurationManager _config;
    private readonly IUserManager _userManager;
    private readonly ILibraryManager _libraryManager;
    private readonly IDtoService _dtoService;

    public StreamyfinController(
        ILoggerFactory loggerFactory,
        // IFileSystem fileSystem,
        IDtoService dtoService,
        IServerConfigurationManager config,
        IUserManager userManager,
        ILibraryManager libraryManager)
    {
        _loggerFactory = loggerFactory;
        _logger = loggerFactory.CreateLogger<StreamyfinController>();
        // _fileSystem = fileSystem;
        _dtoService = dtoService;
        _config = config;
        _userManager = userManager;
        _libraryManager = libraryManager;

        _logger.LogInformation("StreamyfinController Loaded");
    }

    // public class Data
    // {
    //     public string test { get; set; } = "";
    // }

    /// <summary>
    /// Returns home lists.
    /// </summary>
    [HttpGet("items")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    // public ActionResult<Dictionary<string, string>> Home()
    public ActionResult<string> Home(
    )
    {
      return "";
    }
}
