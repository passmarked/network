ALPN ([Application Level Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)) allows the clients to dictate which protocols can be used, and have the server simply respond with a supported protocol. This allows both the handshake and response to take place on a single request.

ALPN replaces the older protocol NPN ([Next Protocol Negotiation](https://tools.ietf.org/id/draft-agl-tls-nextprotoneg-03.html)). As of Chrome 51 (May/June 2016) *NPN* has been deprecated in favour of ALPN.

Ensuring that your web server is handle ALPN gives a bit of a performance boost as clients do not need to try and figure out which protocol could be best to use.

# How do I fix this ?

How website owners / developers go about enabling ALPN will differ:

* Providers like [Cloudflare](https://www.cloudflare.com) give users a quick way to enable all the required server side changes to support these new protocols and extensions without having to touch their own servers. Especially good for websites running on shared hosting.
* Most of the popuar web services have added support for HTTP/2, and to that effect *ALPN*. These might require a few extra steps to setup such as NGINX requiring the following command to be given while compiling - `./configure --with-http_spdy_module --with-http_v2_module --with-http_ssl_module`.

# Resources

* [Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)
* [Application-Layer Protocol Negotiation Extension](https://tools.ietf.org/html/rfc7301)
* [Transitioning from SPDY to HTTP/2](http://blog.chromium.org/2016/02/transitioning-from-spdy-to-http2.html)
* [Negotiating HTTP/2](http://www.matthewparrilla.com/post/negotiation-http2-alpn-tls-handshake/)
