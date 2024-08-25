#pragma warning disable CS8604
#pragma warning disable CA2227
#pragma warning disable CS8600
#pragma warning disable CS8603
#pragma warning disable CS8714
#pragma warning disable CA1002

using System;
using System.Collections.Generic;
using MediaBrowser.Model.Plugins;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Xml.Serialization;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Jellyfin.Plugin.Streamyfin.Configuration;

public class Config
{
  public Config()
  {
    //search = Array.Empty<string>();
  }

  public Search? MarlinSearch { get; set; }
  public Home? Home { get; set; }
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

public class Home
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}
  //public string? SortBy { get; set; }
  public SerializableDictionary<string, Section>? Sections { get; set; }
}

public class Section
{
  //public Search()
  //{
  //  Enabled = false;
  //  Url = "";
  //}

  public SectionStyle? Style { get; set; }
  public SectionType? Type { get; set; }
  public SectionItemResolver? Items { get; set; }
}

public enum SectionStyle
{
    portrait,
    landscape,
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
  public string? sortBy { get; set; }
  public string? sortOrder { get; set; }
  [YamlMember(DefaultValuesHandling = DefaultValuesHandling.OmitEmptyCollections)]
  public List<string>? genres { get; set; }
  public string? parentId { get; set; }
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