The `expiry` header allows developers/website owners to specify a exact date when the resource will no longer be valid, and must be re-fetched from the server.

This header must return a valid date in ISO format. This date needs to be parsed by numerous browsers, so it is good practice to not make any modications and keep with the standards.

The header returned a date that we were not able to parse, which can cause unexpected behaviour in browsers.

# How do I fix this ?

Check your web server, and why the `expiry` header is not returning a actual date that we can parse and check.

# Resources

* [www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)
* [www.mobify.com/blog/beginners-guide-to-http-cache-headers/](http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/)
* [devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers)
* [stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public](http://stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public)
* [blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx)
