Slow response times increase page abandonment with the average user only waiting 6-10 seconds before leaving a site. Response times of less than 1 second feels instantaneous to the user, while in the range of 1 second a user maintains his/her thought process. Anywhere from 6 seconds and longer, the user loses patience with the site and will abandon it.

The error could present itself by simply having a slow website due to application code. Or just a slow connection to the server overall. Which could indicate that your link is saturated and it's time to upgrade to a bigger or more servers to handle the traffic. Shared hosting is a common problem here.

When testing we expect to see that the server responds with content for the user to start processing in under a second at a minimum, ideally this would happen as close to 100ms (The goldy locks zone of response time) as possible.

# How do I fix this ?

* Enable Gzip compression
* Use a CDN (Content Delivery Network)
* Minify your JavaScript and CSS files
* Test database queries for inefficiency
* Add an Expires or a Cache-Control Header
* Combine external JavaScript and CSS files
* Test and optimize code related to requests
* Move CPU intensive operations to the client
* Reduce the number of HTTP requests being made
* Use page level caching or leverage local storage

# Resources

* [Acceptable waiting time for users](http://ux.stackexchange.com/questions/58163/acceptable-waiting-time-for-users-in-time-sensitive-actions)
* [Improve Server Response Time](https://developers.google.com/speed/docs/insights/Server)
* [Best Practices for Speeding Up Your Web Site](https://developer.yahoo.com/performance/rules.html)
* [Why is my page slow](https://gtmetrix.com/why-is-my-page-slow.html)
* [Server response time](https://varvy.com/pagespeed/improve-server-response.html)
* [W3C Recommendations Reduce 'World Wide Wait'](https://www.w3.org/Protocols/NL-PerfNote.html)
* [Loading time](https://blog.kissmetrics.com/loading-time/?wide=1)
