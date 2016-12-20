GZIP is used to compress text based responses before sending them to the client who will uncompress them.

This allows clients to download a considerably smaller file by taking a small expense of compressing on the server when sending the response.

In general GZIP can save your users 80%+ on file sizes to download.

This issue is related to a external asset that was used which does not have GZIP enabled and could save your users a minimum of 20KB or more from the size of files needed to download to display your page.

We advise contacting the remote vendor and showing the information as to the benefits that will be gained by enabling GZIP at [passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site](http://passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site). This will also guide you as to how this can be enabled.

Alternatively, others that have GZIP enabled with the same content could also be sourced. 

# Resources

To read more about GZIP and optimising performance with this technology see:

* [passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site](http://passmarked.com/performance/inspect/enable-gzip-to-decrease-size-that-the-user-has-to-download-from-local-site) 
* [www.fastly.com/blog/new-gzip-settings-and-deciding-what-to-compress](https://www.fastly.com/blog/new-gzip-settings-and-deciding-what-to-compress)
* [httpd.apache.org/docs/2.2/mod/mod_deflate.html](http://httpd.apache.org/docs/2.2/mod/mod_deflate.html)
* [nginx.org/en/docs/http/ngx_http_gzip_module.html](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)

