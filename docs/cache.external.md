Caching allows the user's browser to keep a local copy of a resource for fast loading without downloading the entire resource from the server every time.

This issue refers to a external resource that does not have caching headers defined which makes caching on the users' browser unpredictable.

# How do I fix this ?

We advise contacting the remote vendor and showing them the information as to the benifits that will be gained by having complete control of how long a resource is cached at [passmarked.com/performance/network/missing-cache-headers-on-local-asset](//passmarked.com/performance/network/missing-cache-headers-on-local-asset) which will also guide as to how this can be enabled.

# Popular CDN's

Using a popular CDN is a great way to improve your chance that a user will already have the resource cached as they might have seen it before on another site.

Well known CDN's include:

* [Google's Hosted Libraries](https://developers.google.com/speed/libraries/)
* [CDNJS](https://cdnjs.com/)

These targets have proper caching headers set and ready for us.

# Resources

* [W3 - RFC 2616 Section 14.9 - Cache Control](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)
* [Beginners guide to HTTP cache headers](http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/)
* [Heroko - HTTP cache headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers)
* [StackOverflow - Risks of having HTTP Cache-Control: public](http://stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public)
* [MSDN - Caching issues with Vary Response Header](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx)
