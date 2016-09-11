GZIP is great and helps to reduce the size of text based resources and responses by a large percentage.

There are exceptions though, images being one of them. Images are already in a compressed format such as `gif`,`jpg` or `png`. Meaning that attempting to run GZIP or any of the common compression algorithms on images is a waste of processing power from your server.

# How do I fix this ?

Disable GZIP on image files served by your hosts.

# Resources

* [Content-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
* [GZipped Images - Is It Worth?](http://webmasters.stackexchange.com/questions/8382/gzipped-images-is-it-worth)
* [Optimize Images](https://developers.google.com/speed/docs/insights/OptimizeImages)
