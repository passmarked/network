When configuring IPv6 addresses on a domain it is vital to ensure that these IP's do actually point to a working service that will respond.

When resolving a domain browsers will get the list of addresses to use and starting using one. After which if that fails move on the next address till it finds a working target.

This "failover" adds a few ms to trying to connect to your service. Although probably not even noticable it is considered good practice to keep your DNS records up to date to avoid any unpredictable behaviour with servers caching and handling propegration of your address.

 # How do I fix this ?
 
Ensure that all `AAAA` records that are configured point to valid and existing targets.
 
 # Resources
 
 * [Why DNS Based Global Server Load Balancing (GSLB) Doesn’t Work](http://www.tenereillo.com/GSLBPageOfShame.htm)
 * [Protecting Browsers from DNS Rebinding Attacks](https://crypto.stanford.edu/dns/dns-rebinding.pdf)
 * [http://serverfault.com/questions/60553/why-is-dns-failover-not-recommended](http://serverfault.com/questions/60553/why-is-dns-failover-not-recommended)
