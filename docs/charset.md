Setting the character set of your HTML and text responses is important as it allows browsers to immediately start executing scripts and parsing and avoid olders browsers like IE6 from type sniffing. If not specified the browsers are left in charge of figuring out the character set and could produce intended results.

When a charset is specified in a header, often refered to as setting the character set at the server level reduces browser processing, the can reduce browser processing and avoid sniffing by older browsers like IE6.

# How do I fix this ?

The fix is to enable the header on any HTML/TEXT responses from the server, either individually or globally.

To enable in Apache (and probably most shared hosting solutions), create a `.htaccess` in the root of your website with the following content:

```
AddDefaultCharset UTF-8
```

Enabling in NGINX is easy as well, just add the `charset` property to the NGINX server block. This will set the charset on responses where appropriate. An example of enabling the setting would be editing the files in `/etc/nginx/(conf.d|sites-enabled|sites-available)/` with the following config:

```
server {
   # other server config...
   charset utf-8;
}
```

# Resources

* [PageSpeed: Specify a character set early](https://gtmetrix.com/specify-a-character-set-early.html)
* [How to specify the character set in the HTTP Content-Type response header?](http://stackoverflow.com/questions/7963390/how-to-specify-the-character-set-in-the-http-content-type-response-header)
* [NGINX Docs: Charset](http://nginx.org/en/docs/http/ngx_http_charset_module.html#charset)
