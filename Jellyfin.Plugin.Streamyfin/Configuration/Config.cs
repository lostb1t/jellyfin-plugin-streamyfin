using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;
using System.Diagnostics.CodeAnalysis;

namespace Jellyfin.Plugin.Streamyfin.Configuration;

public class Config
{
  public Config()
  {
    //search = Array.Empty<string>();
  }

  public Search? Search { get; set; }
}

public class Search
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}
  
  public bool Enabled { get; set; }
  public string? Url { get; set; }
}