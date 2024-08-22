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
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
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
using Jellyfin.Plugin.Streamyfin.Configuration;

namespace Jellyfin.Plugin.Streamyfin.Api;

public class ConfigYamlRes {
  public string Value { get; set; } = default!;
}

public class ConfigSaveResponse {
  public bool Error { get; set; }
  public string Message { get; set; } = default!;
}

//public class ConfigYamlReq {
//  public string? Value { get; set; }
//}

/// <summary>
/// CollectionImportController.
/// </summary>
[ApiController]
//[Authorize(Policy = "DefaultAuthorization")]
[Authorize]
[Route("streamyfin")]
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

    [HttpPost("config/yaml")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    // public ActionResult<Dictionary<string, string>> Home()
    public ActionResult<ConfigSaveResponse> saveConfig(
      [FromBody, Required] ConfigYamlRes config
    )
    {
      //Console.WriteLine(config.Value);
      //var config = StreamyfinPlugin.Instance!.Configuration.Config;
      var deserializer = new DeserializerBuilder()
        .WithNamingConvention(UnderscoredNamingConvention.Instance)  // see height_in_inches in sample yml 
        .Build();

      Config p;
      try 
      {
        p = deserializer.Deserialize<Config>(config.Value);
      }  
      catch (Exception e)
      {

        return new ConfigSaveResponse{Error = true, Message = e.ToString()};
      }     
      
      var c = StreamyfinPlugin.Instance!.Configuration;
      c.Config = p;
      StreamyfinPlugin.Instance!.UpdateConfiguration(c);

      return new ConfigSaveResponse{Error = false};
    }
    
    [HttpGet("config")]
    //[Produces("text/yaml")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    // public ActionResult<Dictionary<string, string>> Home()
    public ActionResult<Config> getConfig(
    )
    {
      var config = StreamyfinPlugin.Instance!.Configuration.Config;
      return config;
    }
    
    //[HttpGet("config.yaml")]
    [HttpGet("config/yaml")]
    //[Produces("application/x-yaml")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    // public ActionResult<Dictionary<string, string>> Home()
    public ActionResult<ConfigYamlRes> getConfigYaml(
    )
    {
      var config = StreamyfinPlugin.Instance!.Configuration.Config;
      var serializer = new SerializerBuilder()
    .WithNamingConvention(CamelCaseNamingConvention.Instance)
    .Build();
      var yaml = serializer.Serialize(config);
      //return yaml;
      return new ConfigYamlRes{Value = yaml};
    }
}
