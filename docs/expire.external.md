One or more of your external assets have an extremely short caching age. This nullifies the point of allowing the browser to store resources for future use.

# How do I fix this ?

Caching of at least 6 hours (at a bare minimum) is required for externally hosted resources. If the headers can't be changed, because the server is controlled by a third party, consider hosting the file yourself (on a CDN, if possible).

# Resources

* [Webmasters Stackexchange - Cache external static scripts] (http://webmasters.stackexchange.com/questions/16534/cache-external-static-scripts)
