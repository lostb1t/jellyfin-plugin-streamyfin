using System;
using System.Collections.Generic;
using Jellyfin.Plugin.Streamyfin.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace Jellyfin.Plugin.Streamyfin;

/// <summary>
/// The main plugin.
/// </summary>
public class StreamyfinPlugin : BasePlugin<PluginConfiguration>, IHasWebPages
{
    /// <summary>
    /// Initializes a new instance of the <see cref="Plugin"/> class.
    /// </summary>
    /// <param name="applicationPaths">Instance of the <see cref="IApplicationPaths"/> interface.</param>
    /// <param name="xmlSerializer">Instance of the <see cref="IXmlSerializer"/> interface.</param>
    public StreamyfinPlugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
    }

    /// <inheritdoc />
    public override string Name => "Streamyfin";

    /// <inheritdoc />
    public override Guid Id => Guid.Parse("1e9e5d38-6e67-4615-8719-e98a5c34f004");

    /// <summary>
    /// Gets the current plugin instance.
    /// </summary>
    public static StreamyfinPlugin? Instance { get; private set; }

    /// <inheritdoc />
    public IEnumerable<PluginPageInfo> GetPages()
    {
            var prefix = GetType().Namespace;
            yield return new PluginPageInfo
            {
                Name = Name,
                EmbeddedResourcePath = prefix + ".Configuration.config.html",
            };

             yield return new PluginPageInfo
             {
                 Name = "config.js",
                 EmbeddedResourcePath = prefix + ".Configuration.monaco.dist.config.js"
             };
    }
}
