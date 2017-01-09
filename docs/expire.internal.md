Having an extremely short caching age on local resources (in production) is generally a bad idea, as this nullifies the point of allowing the browser to cache resources.

# How do I fix this ?

Consider setting the `Expires` header at least two days in the future. If this is unacceptable, alternatives include filename based cache busting.

# Resources

* [Strategies for Cache-Busting CSS](https://css-tricks.com/strategies-for-cache-busting-css/)
* [Automatic Cache Busting for Your CSS](https://blog.risingstack.com/automatic-cache-busting-for-your-css/)
