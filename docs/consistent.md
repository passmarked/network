When referencing static resources multiple times they should consistently  have the same domain and path. This is to ensure that any resource being used (like for example a logo) is cached and quickly renders for the user when showing. 

This also avoids download more from your server, saving server processing and bandwidth for the clients and server.

The error occurs when something like the following is seen:

```html
<img src="http://example.com/a.png" />
<img src="http://static.example.com/a.png" />
```

In this example `/a.png` could easily be served by using only one unique url to the resource.

# How do I fix this ?

Change the resource tags asking for resources on inconsistent urls, for example:

```html
<!-- bad -->
<img src="http://example.com/a.png" />
<img src="http://static.example.com/a.png" />
```

```html
<!-- good -->
<img src="http://example.com/a.png" />
<img src="http://example.com/a.png" />
```

# Resources

* [PageSpeed: Serve resources from a consistent URL](https://gtmetrix.com/serve-resources-from-a-consistent-url.html)
