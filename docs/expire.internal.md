Having an extremely short caching age on local resources (in production) is generally a bad idea, as this nullifies the point of allowing the browser to cache resources.

# How do I fix this ?

Consider setting the `Expires` header at least two days in the future. If this is unacceptable, alternatives include filename based cache busting.

# Resources

* [Filename based cache busting made easy](http://heatherevens.me.uk/2013/07/01/filename-based-cache-busting-made-easy/)
* [HTML5 Boilerplate](https://html5boilerplate.com/)
