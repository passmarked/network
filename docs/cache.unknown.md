The `cache-control` header allows developers/website owners to precisely control where the resources of the site are allowed to be stored/cached and how often they need to be re-validated from the server. 

The header includes numerous options that can be set, normally referred to as `directives`. The supported `directives` commonly used include:

* `public` - Allows proxy servesr to cache the resource, use normally for resources such as images where the data can be public and shared.
* `private` - Allows only the browser itself to cache the result of the resource, could be seen as more secure as no service in between the service and the user should be caching the result.
* `no-cache` - Will force browsers to make a request to the server before releasing anything from the cache. Great if you need to be able to log and track usage of a resource while still using caching for performance.
* `only-if-cached` - Informs the browser to not make any requests to the server.
* `max-age=<seconds>` - Specifies the number of seconds that this resource should be cached for. We recommend at a bare minimum **4 hours**, while something bigger like **2 days** are advised for shared static resources like images.
* `s-maxage=<seconds>` - Same as `max-age` but only applies to servers and intermediate services, ignore in the private cache of browsers themselves.
* `must-revalidate` - Informs the browser to check the server for a new copy of the resource everytime before using it from cache.
* `proxy-revalidate` - Same as `must-revalidate` but only applies to proxies
* `no-store` - Informs the browser to not store anything related to the request or the response of the resource in question.

These `directives` can be cherry-picked and combined based on the scenario such as:

```
Cache-Control: no-cache, no-store, must-revalidate
```

Which will totally disable caching for resources returned with the header.

Or:

```
Cache-Control:public, max-age=14400
```

Which will cache the resource for 4 hours.


# How do I fix this ?

Double check the web server congfiguration and what options are included using only the valid options listed above (or from the resources).

# Resources

* [developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
* [www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)
* [www.mobify.com/blog/beginners-guide-to-http-cache-headers/](http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/)
* [devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers)
* [stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public](http://stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public)
* [blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx)
