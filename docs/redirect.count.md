Redirects are quite usefull but developers/site owners must keep in mind that every redirects adds latency.

For this reason, the maximum accepted limit for redirects on pages are 2. This provides only a limited amount of latency and giving users a acceptable experience.

Using more redirects (either server-side or client-side) gives users a bad experience as the browser needs to follow every redirect.

For the various browsers these are the maximum limits along with their average latency added per redirect:

```
Chrome 49 *32bit* ↷ 55.0.2883.87 m, 21 redirects
Chrome Canary 49 *32bit* ↷ 57.0.2944.0, 21 redirects
Firefox 43 ↷ 50.0.2, 20 redirects
IE 8, 11 redirects (<a href="https://webpagetest.org">webpagetest.org</a>)
IE 9, 121 redirects (<a href="https://webpagetest.org">webpagetest.org</a>)
IE 10, 121 redirects (<a href="https://webpagetest.org">webpagetest.org</a>)
IE 11, 110 redirects
Opera 28, 21 redirects
Opera 36, 21 redirects
Safari 5.1.7, 16 redirects
```

> Source <a href="http://stackoverflow.com/users/950430/dennis">@Dennis</a> - [In Chrome, how many redirects are “too many”?](http://stackoverflow.com/questions/9384474/in-chrome-how-many-redirects-are-too-many)

# How do I fix this ?

Look at what would be causing the page to redirect more than twice. Updating this logic to directly redirect to the required page solves the issue. While also giving you control to redirect as required.

# Resources

* [Avoid Landing Page Redirects](https://developers.google.com/speed/docs/insights/AvoidRedirects)
* [How many 301 redirects are too many?](http://www.kickstartcommerce.com/many-301-redirects-many.html)
