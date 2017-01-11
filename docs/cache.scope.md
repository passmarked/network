Using `cache-control` developers/website owners can specify precisely how/where and when the resources are allowed to be cached.

Part of these options that can be configured are `private` and `public`, which define:

* `private` that only browsers may cache this resource, meaning the best security as this is per users and proxy servers will ignore these resources.
* `public` will allow proxies and servers in between to cache and re-use the file.

As is noted, these two differ quite a bit. And as such make no sense being used together, which would only confuse browsers and negate most of the benefits of specifying a specific type.

# How do I fix this ?

Change the `cache-control` header to include only `private` or `public`, not both.

# Resources

* [www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)
* [www.mobify.com/blog/beginners-guide-to-http-cache-headers/](http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/)
* [devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers)
* [stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public](http://stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public)
* [blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx)
