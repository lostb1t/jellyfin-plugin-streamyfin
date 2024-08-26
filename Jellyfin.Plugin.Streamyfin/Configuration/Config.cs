#pragma warning disable CS8604
#pragma warning disable CA2227
#pragma warning disable CS8600
#pragma warning disable CS8603
#pragma warning disable CS8714
#pragma warning disable CA1002
#pragma warning disable CA1819
#pragma warning disable CA1507

using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using MediaBrowser.Model.Plugins;
using Jellyfin.Data.Enums;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Xml.Serialization;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
//using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
//using Newtonsoft.Json.Schema;
using Newtonsoft.Json;

namespace Jellyfin.Plugin.Streamyfin.Configuration;

public class Config
{
  //public Bla Wit { get; set; }
  public Search? marlinSearch { get; set; }
  public Home? home { get; set; }
}

public enum Bla
{
  yolo,
  Another
}

public class Search
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}
  
  public bool enabled { get; set; }
  public string? url { get; set; }
}

public class Home
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}
  //public string? SortBy { get; set; }
  public SerializableDictionary<string, Section>? sections { get; set; }
}

public class Section
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}
  
  //[EnumDataType(typeof(SectionStyle))]
  //[JsonConverter(typeof(StringEnumConverter))]
  public SectionStyle? style { get; set; }
  public SectionType? type { get; set; }
  public SectionItemResolver? items { get; set; }
  [YamlMember(DefaultValuesHandling = DefaultValuesHandling.OmitNull)]
  public SectionSuggestions? suggestions { get; set; } = null;
}

//[JsonConverter(typeof(StringEnumConverter))]
public enum SectionStyle
{
    //[EnumMember(Value = "portrait")]
    portrait,
    landscape
}

public enum SectionType
{
    row,
    carousel,
}


public class SectionItemResolver
{
  public ItemArgs? args { get; set; }
}

public class ItemArgs
{
  //[EnumDataType(typeof(ItemSortBy))]
  public ItemSortBy[]? sortBy { get; set; }
  public SortOrder[]? sortOrder { get; set; }
  //[YamlMember(DefaultValuesHandling = DefaultValuesHandling.OmitEmptyCollections)]
  public List<string>? genres { get; set; }
  public string? parentId { get; set; }
  public string[]? filters { get; set; }
  public bool? recursive { get; set; }
}

public class SectionSuggestions
{
  public SuggestionsArgs? args { get; set; }
}

public class SuggestionsArgs
{
  public BaseItemKind[]? type { get; set; }
}

 [XmlRoot("dictionary")]
    public class SerializableDictionary<TKey, TValue>
        : Dictionary<TKey, TValue>, IXmlSerializable
    {
        #region IXmlSerializable Members
        public System.Xml.Schema.XmlSchema GetSchema()
        {
            return null;
        }
 
        public void ReadXml(System.Xml.XmlReader reader)
        {
            XmlSerializer keySerializer = new XmlSerializer(typeof(TKey));
            XmlSerializer valueSerializer = new XmlSerializer(typeof(TValue));
 
            bool wasEmpty = reader.IsEmptyElement;
            reader.Read();
 
            if (wasEmpty)
                return;
 
            while (reader.NodeType != System.Xml.XmlNodeType.EndElement)
            {
                reader.ReadStartElement("item");
 
                reader.ReadStartElement("key");
                TKey key = (TKey)keySerializer.Deserialize(reader);
                reader.ReadEndElement();
 
                reader.ReadStartElement("value");
                TValue value = (TValue)valueSerializer.Deserialize(reader);
                reader.ReadEndElement();
 
                this.Add(key, value);
 
                reader.ReadEndElement();
                reader.MoveToContent();
            }
            reader.ReadEndElement();
        }
 
        public void WriteXml(System.Xml.XmlWriter writer)
        {
            XmlSerializer keySerializer = new XmlSerializer(typeof(TKey));
            XmlSerializer valueSerializer = new XmlSerializer(typeof(TValue));
 
            foreach (TKey key in this.Keys)
            {
                writer.WriteStartElement("item");
 
                writer.WriteStartElement("key");
                keySerializer.Serialize(writer, key);
                writer.WriteEndElement();
 
                writer.WriteStartElement("value");
                TValue value = this[key];
                valueSerializer.Serialize(writer, value);
                writer.WriteEndElement();
 
                writer.WriteEndElement();
            }
        }
        #endregion
    }
/*
home:
  sections:
    Trending:
      style: portrait
      type: row 
      items:
        args: 
          sortBy: AddedDate
          sortOrder: Ascending
          filterByGenre: [""Anime"", ""Comics""]";
*/