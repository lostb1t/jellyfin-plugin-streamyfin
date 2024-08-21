#pragma warning disable CA2227
#pragma warning disable CS0219
using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;
using System.Diagnostics.CodeAnalysis;

namespace Jellyfin.Plugin.Streamyfin.Configuration;



/// <summary>
/// Plugin configuration.
/// </summary>
public class PluginConfiguration : BasePluginConfiguration
{
    public string  Yaml { get; set; }
    public string Test { get; set; }
  
    public PluginConfiguration()
    {
    Test = "test";
    Yaml = @"home:
  sections:
    # name of the section
    Trending:
      # style of section: poster (default), hero
      style: poster
      # type: row (default), carousel
      type: row 
      # source:
      source: 
        # source: the resolver, these are predefined will resolve the data from its source
        # Options:
        #  - items: will fetch items from the /items endpoint
        resolver: items
        # args: available to items resolver.
        # options:
        #  - sortBy
        #  - sortOrder
        #  - filterByGenre
        args: 
          sortBy: AddedDate
          sortOrder: Ascending
          filterByGenre: [""Anime"", ""Comics""]";
    }



    // public ImportSet[] ImportSets { 
    // get;
    // set
    // {
    //     if (!String.IsNullOrEmpty(value))
    //         _myValue = value;
    //     }
    // }
}
