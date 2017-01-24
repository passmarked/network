Redirects are quite useful but developers/site owners must keep in mind that every redirects adds latency.

Although the latency can be saved using caching, the problem with client-side redirects are that they cannot be cached.

# How do I fix this ?

Remove the logic that redirects on the client-side scripts, and rather use the logic server-side as part of the application code or server config. With server-config being the best case here to save more processing time.

Apache can be setup as such:

```
<VirtualHost *:80>
  ServerName www.domain1.com
  Redirect / http://www.domain2.com
</VirtualHost>
```

While NGINX can also be configured using:

```
server {
  listen 80;
  server_name domain1.com;
  return 301 $scheme://domain2.com$request_uri;
}
```

**Both of these examples redirect using 302 (temporary), using 301 (permanent) will allow browsers to fully cache and hit the server again. Usage depends on your scenario.**

# Resources

* [Avoid Landing Page Redirects](https://developers.google.com/speed/docs/insights/AvoidRedirects)
* [How To Create Temporary and Permanent Redirects with Apache and Nginx](https://www.digitalocean.com/community/tutorials/how-to-create-temporary-and-permanent-redirects-with-apache-and-nginx)
