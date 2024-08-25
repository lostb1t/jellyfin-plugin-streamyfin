## Compagnion app for [Streamyfin](https://github.com/fredrikburmester/streamyfin)

Allows centralised configuration of  Streamyfin.

Config example:

```yaml
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
```