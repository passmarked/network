# @passmarked/network 

![NPM](https://img.shields.io/npm/dt/@passmarked/network.svg) [![Build Status](https://travis-ci.org/passmarked/network.svg)](https://travis-ci.org/passmarked/network)

[Passmarked](http://passmarked.com) is a suite of tests that can be run against any page/website to identify issues with parity to most online tools in one package.

The [Terminal Client](http://npmjs.org/package/passmarked) is intended for use by developers to integrate into their workflow/CI servers but also integrate into their own application that might need to test websites and provide realtime feedback.

All of the checks on [Passmarked](http://passmarked.com) can be voted on importance and are [open-sourced](http://github.com/passmarked/suite), to encourage community involvement in fixing and adding new rules. We are building the living Web Standard and love any [contributions](#contributing).

## Synopsis

The rules checked in this module are:

* **alpn** - ALNP negotiation could not be performed, meaning the protocol is disabled.
* **bad** - Any of the links in the HAR returned a status code other than REDIRECT/INFO/OK
* **cache.internal** - Caching on the internal resource is not configured
* **cache.external** - Caching on the external (third party domain) resource is not configured
* **expire.internal** - The caching duration on a local resource is configured for less than 2 days at a minimum
* **expire.external** - The caching duration on a external resource is configured for less than 6 hours at a minimum
* **charset** - Charset could have been set earlier in the headers of the response.
* **consistent** - Any of the same assets are returned from different urls that does not allow caching.
* **favicon.size** - Favicon is bigger than 10KB.
* **favicon.exists** - Favicon does not exists.
* **favicon.redirect**- Favicon request was redirected instead of just serving.
* **compress.images** - GZIP was detected on any images on the page.
* **gzip.internal** - Returned if any CSS or JS assets on the same domain are not gzipped.
* **gzip.external** - Returned if any CSS or JS assets on a third-party domain are not gzipped.
* **html** - HTML returned from server was not minified.
* **h2** - HTTP2 is not supported on server.
* **h2.blank** - Blank response from HTTP2 server
* **h2.push** - HTTP2 Server Push could be used on blocking resources for the page.
* **minify** - Resources returned were not minified.
* **minify.empty** - Resource was empty after content was minified, meaning the request could probably just be removed. 
* **pagespeed.slow** - Initial response took more than 3 seconds seconds to render.
* **pagespeed.warn** - Initial response took more than 1 second to render.
* **vary** - Vary header was not configured on the responses of resources.

## Running

The rules are checked everytime a url is run through Passmarked or our API. To run using the hosted system head to [passmarked.com](http://passmarked.com) or our [Terminal Client](http://npmjs.org/package/passmarked) use:

```bash
npm install -g passmarked
passmarked --filter=network example.com
```

The hosted version allows free runs from our homepage and the option to register a site to check in its entirety.
Using the Passmarked npm module (or directly via the API) integrations are also possible to get running reports with all the rules in a matter of seconds.

## Running Locally

All rules can be run locally using our main integration library. This requires installing the package and any dependencies that the code might have such as a specific version of OpenSSL, see [#dependencies](#dependencies)

First ensure `passmarked` is installed:

```bash
npm install passmarked
npm install @passmarked/network
```

After which the rules will be runnable using promises:

```javascript
passmarked.createRunner(
  require('@passmarked/network'), // this package
  require('@passmarked/ssl'), // to test SSL
  require('@passmarked/inspect') // to test network performance
).run({
  url: 'http://example.com',
  body: 'body of page here',
  har: {log: {entries: []}}
}).then(function(payload) {
  if (payload.hasRule('secure')) {
    console.log('better check that ...');
  }
  var rules = payload.getRules();
  for (var rule in rules) {
    console.log('*', rules[rule].getMessage());
  }
}).catch(console.error.bind(console));
```

Alternatively, callbacks are also available:

```javascript
passmarked.createRunner(
  require('@passmarked/network'),
  require('@passmarked/ssl'),
  require('@passmarked/inspect')
).run({
  url: 'http://example.com',
  body: 'body of page here',
  har: {log: {entries: []}}
}, function(err, payload) {
  if (payload.hasRule('secure')) {
    console.log("better check that ...");
  }
  var rules = payload.getRules();
  for (var rule in rules) {
    console.log('*', rules[rule].getMessage());
  }
});
```

## Dependencies

The module expects a updated version of OpenSSL, at the time of writing `openssl-1.0.2h`. The module expects the newest compiled excutable to present at `/usr/local/ssl/bin/openssl`.


```bash
# install our essentials to build openssl
apt-get install -y build-essential

# upgrade to a much newer and specific version of ssl
wget -O /tmp/openssl-1.0.2h.tar.gz https://www.openssl.org/source/openssl-1.0.2h.tar.gz
cd /tmp/ && tar -xf /tmp/openssl-1.0.2h.tar.gz
rm /tmp/openssl-1.0.2h.tar.gz
cd /tmp/openssl-1.0.2h && ./config
cd /tmp/openssl-1.0.2h && make depend
cd /tmp/openssl-1.0.2h && make
cd /tmp/openssl-1.0.2h && make install
rm -R /tmp/openssl-1.0.2h
```

The module also expects to see `timeout` from `coreutils` present in some form, this defaults to `gtimeout` on MacOS which can be installed using:

```
brew install coreutils
```

## Rules

Rules represent checks that occur in this module, all of these rules have a **UID** which can be used to check for specific rules. For the structure and more details see the [Wiki](https://github.com/passmarked/passmarked/wiki) page on [Rules](https://github.com/passmarked/passmarked/wiki/Create).

> Rules also include a `type` which could be `critical`, `error`, `warning` or `notice` giving a better view on the importance of the rule.

## Contributing

```bash
git clone git@github.com:passmarked/network.git
npm install
npm test
```

Pull requests have a prerequisite of passing tests. If your contribution is accepted, it will be merged into `develop` (and then `master` after staging tests by the team) which will then be deployed live to [passmarked.com](http://passmarked.com) and on NPM for everyone to download and test.

## About

To learn more visit:

* [Passmarked](http://passmarked.com)
* [Terminal Client](https://www.npmjs.com/package/passmarked)
* [NPM Package](https://www.npmjs.com/package/@passmarked/network)
* [Slack](http://passmarked.com/chat) - We have a Slack team with all our team and open to anyone using the site to chat and figure out problems. To join head over to [passmarked.com/chat](http://passmarked.com/chat) and request a invite.

## License

Copyright 2016 Passmarked Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
