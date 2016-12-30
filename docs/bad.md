Bad requests are reported where the response was a status code other than 200 (OK) or a redirect (30x).

These could include anything from AJAX calls that are not returning succesfully from the server.

These are wasteful, and add latency and wait time to your users. 

Along with adding additional resources slowing your own website down, mobile devices might suffer more and more battery drains no thanks to these bad requests.

# How do I fix this ?

Remove (or fix the scripts) that link to all the mentioned bad requests.

# Resources

* [Avoid bad requests](https://varvy.com/pagespeed/avoid-bad-requests.html)
* [Battery Cost of an HTTP request?](http://stackoverflow.com/questions/30353779/battery-cost-of-an-http-request)
