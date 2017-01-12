Great news - the site has a favicon, but it is a tad too big. 

Favicons should be kept as small as possible making it cacheable and usable by the older browsers.

Newer browsers allow extra icons to be set either in the [manifest.json](https://developer.mozilla.org/en-US/docs/Web/Manifest) file or meta tags that can define icons for numerous screens sizes.

While HTML5 greatly improves this limit, this error indicates that the file size is over 200kb. Which to us is **way** to big.

# How do I fix this ?

Make sure the favicon at the root of your website (`/favicon.ico`) is smaller than `200kb`.

Several tools exist that are able to generate the sizes required by various devices along with your basic `favicon.ico`:

* [Real Favicon Generator](https://realfavicongenerator.net/) -- **Highly recommended**
* [Online Favicon Converter](http://tools.dynamicdrive.com/favicon/)
* [Online Favicon Creator](http://www.favicon.cc/)

# Resources

* [Various sizing information](http://realfavicongenerator.net/faq#why_so_many_files)
* [Does a favicon have to be 32x32 or 16x16?](http://stackoverflow.com/questions/4014823/does-a-favicon-have-to-be-32x32-or-16x16)
* [How a bad favicon.ico can cause a lot of trouble](http://techblog.wimgodden.be/2011/02/22/how-a-bad-favicon-ico-can-cause-a-lot-of-trouble/)
* [Webweaver - Favicons](http://www.webweaver.nu/html-tips/favicon.shtml)
* [Online Favicon Converter](http://tools.dynamicdrive.com/favicon/)
* [Online Favicon Creator](http://www.favicon.cc/)
* [Real Favicon Generator](https://realfavicongenerator.net/)
