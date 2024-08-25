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
    //public string Yaml { get; set; }
    public Config Config { get; set; }
  
    public PluginConfiguration()
    { 
      Config = new Config{
        Search = new Search{
          Enabled = false,
          Url = ""
        },
        Home = new Home{
          Sections = new SerializableDictionary<string, Section>
        {
            { "Anime", new Section{
              Style = SectionStyle.portrait,
              Type = SectionType.row,
              Items = new SectionItemResolver{ args =new ItemArgs{
               genres = new List<string>{"Anime"}
              }
            } } },
            { "Trending collection", new Section{
              Style = SectionStyle.portrait,
              Type = SectionType.carousel,
              Items = new SectionItemResolver 
                {args = new ItemArgs{
                parentId = "YOURCOLLECTIONID"
              } } } }
        }
        }
      };
      //Yaml
      /* 
    SfConfig = "test";
    Yaml = @"home:
  sections:
    Trending:
      style: portrait
      type: row 
      source: 
        resolver: items
        args: 
          sortBy: AddedDate
          sortOrder: Ascending
          filterByGenre: [""Anime"", ""Comics""]";
          */
    }
}
