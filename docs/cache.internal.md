Caching allows the users browser to keep a local copy of a resource for fast loading without downloading the entire resource from the server every time. Like for example a logo which is shown on every page.

Caching can be enabled/handled in a few ways based on the type of resources you are serving.

# How do I fix this ?

To fix just add the caching headers on relevant files.

This can be achieved by configuring the server to set caching or using a service like [CloudFlare](https://www.cloudflare.com) that will handle configuring caching for you.

To configure caching on Apache (most shared hosting services) add the following in a `.htaccess` in the root of your website folder:

```
<IfModule mod_headers.c>
  Header unset Last-Modified
  FileETag none
  ExpiresActive On
  ExpiresDefault "access plus 1 years"
</IfModule>
```

If using NGINX caching can be configured by using a block like the following:

```
server {
  ...
  location ~* \.(jpg|jpeg|gif|css|png|js|ico|html)$ {

    root /var/sites/{{ relay_api_domain }}/src/web/assets;

    access_log off;
    expires max;

  }
  ...
}
```

# Types of Caching

Caching can be tweak based on how you would like to cache your resources as this may differ from site-to-site.

## Time Based

Time-based means that resources can be cached for a set time in which it would not change.

This is good for static content that you know will remain that way for the cache time specified.

## Content Based

If necessary based on your site, your cache can be based on the content of your resources. This is useful if you do not have a idea on how often the content of a resource might change.

This can be done by using the ``ETag`` header. 

# Options to control cache

Caching can be set and handle in various ways, by choosing one of the following solutions listed in order of best practice:

## 1. Cache Control

The ``Cache-Control`` header would be the best to use for modern browsers and offers the most options for your website to define how and when caching should take place.

To enable cache control the following header should be added to the response:

```
cache-control: public, max-age=84600, no-cache
```

Dissecting the header above it gives us various items we can set and each of the keysword:

``private / public``:

When the first item is marked as private/public this will control where the content is allowed to be cached.

If set to ``private`` the file will only be allowed to cache on a users browser. Nothing else will cache the resource, this should be used for responses that will only be valid for a certain user.

If set to ``public`` any caching servers in between the server and the users' browser will be allowed to cache the response. This is meant for resources that will be the same for all users using the site. A logo would be a perfect example. 

``max-age``:

Sets how long the resource is allowed to be cached in seconds. If the resource was last cached more than the specified ``max-age`` a new version will be downloaded.

``s-maxage``:

The ``s-`` refers to **Shared** as in **Shared Cache**, as in CDN. 

This keyword is aimed at CDN's and other intermediary caches. When present this supersedes the ``max-age`` and ``expires`` header. 

Most well behaved CDN's will respect this.

``min-fresh``:

Indicates that the client is willing to accept a response whose freshness lifetime is no less than its current age plus the specified time in seconds. 

That is, the client wants a response that will still be fresh for at least the specified number of seconds.

``max-stale``:

Indicates that the client is willing to accept a response that has exceeded its expiration time. 

If max-stale is assigned a value, then the client is willing to accept a response that has exceeded its expiration time by no more than the specified number of seconds. If no value is assigned to max-stale, then the client is willing to accept a stale response of any age.

``no-cache``:

This keyword sets that the resource should be downloaded each time the user visits a page.

``no-store``:

This keyword will set that no part of the response will be stored in the cache. This was intended for sensitive pages.

If followed to the word no part of the request will be stored either in a attempt to up the security more.

``must-revalidate``:

This specifies any configuration where the cache is otherwise configured to serve stale content.

The client is required to send the request headers back and receive confirmation that the asset hasn’t changed.

This will make clients send a **HEAD** request to check if the content has changed.

``proxy-revalidate``:

Pretty much the same as the ``must-revalidate`` but aimed at intermediary caches. 

``no-transform``:

When set this disabled any intermediary services that try and optimise by transforming resources to other formats.

The intend is to allow you to control that the content you are sending is never changed.

### Examples

##### PHP

```
/**
* Eaxmple of setting the cache
**/
header("Cache-Control: public, max-age=84600"); // HTTP/1.1
header("Expires: Sat, 08 Aug 2015 05:00:00 GMT"); // Date to set

/**
* Example to invalidate cache
**/
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
```

## 2. Expires

If the expires header is set the browser will mark the resource as stale when the datetime set is reached on the client side.

These days the ``Cache-Control`` header takes precedence, but to account for older browsers it's best pracetice to set a matching ``Expires`` header.

You will want to also confirm that the date is in the correct format otherwise the browser might evaluate the date as expired.

The expected format is:

```
Thu, 01 Dec 1983 20:00:00 GMT
```

## 3. ETag

Short for "Entity Tag". The etag is a unique identifier for the resource being requested which is typically comprised of a hash of that resource.

This allows the browser to ask smarter questions to handle the caching. Such as "give me the full file if it's different than the etag I have".

## 4. Vary

Vary is powerfull but can make a simple caching schema more difficult than it needs to be.

Vary has had a rough past with [IE having trouble](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx) and even [Chrome more recently](https://code.google.com/p/chromium/issues/detail?id=94369).

The header sets which headers will be used by the client to determine when a resource is stale.

On a sidenote setting:

```
vary: User-Agent
```

will show that you are serving different versions of your HTML/CSS depending on the User-Agent. Some search engines like **Google** also take note of this header and will crawl for mobile content too.

## 5. Pragma

The header itself is quite old but newer browser implementation still honoured the header.

For example newer implementations might parse:

```
pragma: no-cache
```

as:

```
cache-control: no-cache
```

This is mostly a request header but you good to keep in mind and know about.

No new HTTP directives will be defined for "pragma" going forward.

# Resources

Few links to read up for more detailed information:

* [www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.1)
* [www.mobify.com/blog/beginners-guide-to-http-cache-headers/](http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/)
* [devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers#http-cache-headers)
* [stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public](http://stackoverflow.com/questions/3339859/what-is-the-risk-of-having-http-header-cache-control-public)
* [blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx](http://blogs.msdn.com/b/ieinternals/archive/2009/06/17/vary-header-prevents-caching-in-ie.aspx)
