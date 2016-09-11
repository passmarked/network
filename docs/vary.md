The Vary header lets browser clients define how the server identifies each request. This allows the server to control how caching is handled on all it's clients.

The "Accept-Encoding" is a quick way to tell clients and caching servers how to handle requests where GZIP is on and off, treating them as the same or unique.

When "Accept-Encoding" is configured as one of the options in Vary the GZIP and NON-GZIP request would be treated as unique, allowing browsers that do not support GZIP to still access the site.

# How do I fix this ?

To fix simply define the header, with at a minimum the "Accept-Encoding" option.

## Apache

If using Apache (and most probably a shared environment) create/edit the `.htaccess` file in the root of the site with the following content:

```
<IfModule mod_headers.c>
  <FilesMatch ".(js|css|xml|gz|html)$">
    Header append Vary: Accept-Encoding
  </FilesMatch>
</IfModule>
```

## NGINX

To define the header in your location or server block use the following:

```
gzip_vary on
```

### IIS

Define the setting in web.config:

```
<system.webServer>
  <httpProtocol>
    <customHeaders>
    <remove name="Vary"></remove>
    <add name="Vary" value="Accept-Encoding"></add>
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

# Resources

* [Is Vary: Accept-Encoding overkill?](http://stackoverflow.com/questions/14540490/is-vary-accept-encoding-overkill)
* [Accept-Encoding, It’s Vary important.](https://www.maxcdn.com/blog/accept-encoding-its-vary-important/)
