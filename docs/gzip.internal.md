GZIP is used to compress text based responses before sending them to the client who will uncompress them.

This allows clients to download a considerable smaller file by taking a small expense of compressing on the server when sending the response.

By general GZIP can save your users 80%+ on file sizes to download, in most cases.

# When compression is a bad thing

Certain file types would not gain any advantage when enabling GZIP and in fact might cause wasted resources.

These file types include:

* Media files such as **mp4**, **avi**, **mp3**
* Image files such **png**, **jpeg**, **jpg**, **gif**

As these files are already compressed your users will only be downloading file that is almost the same size at the expense of your server having to compress it as well.


# How to enable

Solutions to enable GZIP depends on how your website might be hosted, as this dictates what can be changed. For various types of sitations we have listed a few examples to enable the setting and/or services that could be used.

It's worth noting that external services like  [Cloudflare](cloudflare.com) who do various things to speed up your website can be used in place of any of these provided solutions.

## Shared-Hosting

If your paying a small amount and gaining access to your website through [CPanel](http://cpanel.com/) and uploading changes via FTP you're probably on a shared host.

What this is that the provider gives you limited access to certain folders where your website files be located and then hides all of the server configuration to allow quick and simple website development.

The downside is that various clients may be using the same server your website is currently running on and could slow down your website if they start receiving attention. 

In this example you will not be able to edit configuration on the server to enable GZIP. To enable GZIP and speed up your website you'll need to either:

* Contact your hosting provider and ask about enabling GZIP for your text based assets.
* Use a external such as [Cloudflare](cloudflare.com) who do various things to speed up your website by acting as a proxy. One of these optimisations being enabling GZIP. Free plans are offered for users starting out.

## NGINX

If you are indeed able to configure your web server, that server happens to be NGINX. Enabling GZIP is a simple case of adding the directives shown below.

These can either be added to the global nginx.conf file to enable for all websites or per server as you see fit.

```
###
# Enable GZIP, see http://passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site for more details.
###
gzip on;
gzip_min_length 1024;
gzip_comp_level 2;
gzip_disable "MSIE [1-6].(?!.*SV1)";
gzip_proxied any;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
```

With each of these parameters allowing you to configure:

```gzip <on|off>;```:

Accepts either "on" or "off" and tells NGINX to enable GZIP compression.

Default: ```off```

```gzip_min_length: <bytes>;```:

When a file is smaller or equal to the amount of bytes configured on this property the file will skip compression.

Reason for this is that as the file size decreases to small sizes <1kb GZIP becomes less and less useful. To save server resources these files are normally served as is, or even better embedded in the page itself as a **data image**.

Default: ```20 bytes```

```gzip_comp_level: <1-9;```:

Specifies the "compression level" that signifies how much NGINX will try. This level has a direct correlation with how much processing power will be required to serve and compress these files, on high-volume sites higher numbers here will certainly be felt on system load and capacity.

A test ran by a user from ServerFault shows the following compression rates:

```
text/html:
0    55.38 KiB (100.00% of original size)
1    11.22 KiB ( 20.26% of original size)
2    10.89 KiB ( 19.66% of original size)
3    10.60 KiB ( 19.14% of original size)
4    10.17 KiB ( 18.36% of original size)
5     9.79 KiB ( 17.68% of original size)
6     9.62 KiB ( 17.37% of original size)
7     9.50 KiB ( 17.15% of original size)
8     9.45 KiB ( 17.06% of original size)
9     9.44 KiB ( 17.05% of original size)
```

```
text/x-javascript:
0    261.46 KiB (100.00% of original size)
1     95.01 KiB ( 36.34% of original size)
2     90.60 KiB ( 34.65% of original size)
3     87.16 KiB ( 33.36% of original size)
4     81.89 KiB ( 31.32% of original size)
5     79.33 KiB ( 30.34% of original size)
6     78.04 KiB ( 29.85% of original size)
7     77.85 KiB ( 29.78% of original size)
8     77.74 KiB ( 29.73% of original size)
9     77.75 KiB ( 29.74% of original size)
```

source: [serverfault.com/a/452642/74976](http://serverfault.com/a/452642/74976)

```gzip_disable "<regex here>";```:

Tells NGINX to disable gzip on user agents that match the given regex. A good starting point would be to add **<= IE6** browsers to this property as GZIP is not supported:

```
gzip_disable "MSIE [1-6].(?!.*SV1)";
```

```gzip_proxied <option>;```:

Allows control of when NGINX will enable GZIP for proxy requests based on the request and response. Various options include:

* **off** (default): Turns of all compression for proxied requests
* **expired**: Enables compression if a response header includes the **Expires** field with a value that disables caching
* **no-cache**: Enables compression if the **Cache-Control** header of the response determines **no-cache**
* **no-store**: Enables compression if the **Cache-Control** header of the response determines **no-store**
* **private**: Enables compression if the **Cache-Control** header of the response determines **private**
* **no_last_modified**: Enables compression if the response does not include a **last_modified** header
* **no_etag**: Enables compression if no **ETag** header is given in the response
* **auth**: Enables compression if the request includes the **Authorization** header
* **any**: Enables compression for all requests.

A safe default is ```any``` that will simple enable GZIP for all proxied requests but these options allow environment specific settings.

```gzip_types: <content-type> <content-type>;``:

Configures which **Content-Type**'s should be compressed. This allows fine control over which type of files should be compressed to save server processing power if it's not needed.

For a start it's a suggested to enable at least:

```gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;```

Default: ```text/html```

-

After enabling and configuring these properties NGINX can be restarted and you should not a immediate decrease in file sizes that the client has to download.

## Apache

First ensure that [Apache](http://apache.org) has the [mod_deflate](http://httpd.apache.org/docs/2.2/mod/mod_deflate.html) module enabled. 

### Enable

#### Debian / Ubuntu

If on Ubuntu run the following:

```
a2enmod mod_deflate
```

and be sure to restart Apache using:

```
service apache2 restart
```

### Configure

To enable GZIP add the following to your **.htaccess** in the root of your website.

```
###
# Enable GZIP, see http://passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site for more details.
###
SetOutputFilter DEFLATE
AddOutputFilterByType DEFLATE text/plain text/css text/xml text/javascript application/x-javascript application/xml
BrowserMatch ^Mozilla/4 gzip-only-text/html
BrowserMatch ^Mozilla/4\.0[678] no-gzip
BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
BrowserMatch \bMSI[E] !no-gzip !gzip-only-text/html
SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-gzip
Header append Vary User-Agent env=!dont-vary
``` 

Source: [stackoverflow.com/a/12367952/657852](http://stackoverflow.com/a/12367952/657852)

With each of these properties allowing you do the following:

```SetOutputFilter DEFLATE```:

Just enables the DEFLATE module which will handle compressing the response.

```AddOutputFilterByType DEFLATE <type> <type>```:

Specifies which **Content-Type**'s should have GZIP enabled to save on server performance with already compressed files as noted above.

A good default to list here would include:

```
AddOutputFilterByType DEFLATE text/plain text/css text/xml text/javascript application/x-javascript application/xml
```

```BrowserMatch <regex> [<options>]```: 

Allows setting up compression and options on a per browser action. The regex passed will be matched to the user agent given in the request.

For example to disable GZIP on IE6 and older add the following:

```
BrowserMatch \bMSI[E] !no-gzip
```

-

After enabling and configuring these properties Apache can be restarted and you should not a immediate decrease in file sizes that the client has to download.

# Resources

To read more about GZIP and optimising performance with this technology see:

* [www.fastly.com/blog/new-gzip-settings-and-deciding-what-to-compress](https://www.fastly.com/blog/new-gzip-settings-and-deciding-what-to-compress)
* [httpd.apache.org/docs/2.2/mod/mod_deflate.html](http://httpd.apache.org/docs/2.2/mod/mod_deflate.html)
* [nginx.org/en/docs/http/ngx_http_gzip_module.html](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)

