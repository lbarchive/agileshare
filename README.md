Agile Share
===========

*[Agile Share][as]* is created for people who don't use social networks but have websites as well as for people who share via social buttons. One goal is to keep it simple and clean, and the websites also. You only need to have a link in your pages, no more delay or waste of time for loading bloated buttons, especially when readers are not interested in sharing your content. If they do, then one click can send them to the cleanest buttons ever.

[as]: http://as.yjl.im

Installation
------------

Generally, you only need to link to `http://as.yjl.im`, there are some options listed on [website][as].

### Blogger template

In order to add link to each post in posts list, you need to modify the template.

Find `<span class='post-icons'>`, then add `<b:if...>...</b:if>` part inside it.

```xml
<span class='post-icons'>
  <b:if cond='data:post.url'>
    <a expr:href='&quot;http://as.yjl.im/#url=&quot; + data:post.url' alt="Agile Share" title="Agile Share" target="_blank">℁</a>
  </b:if>
</span>
```

You don't have to put the code at same place, as long as it's inside posts loop, it will work.

Buttons
-------

* Delicious
* Digg
* Email
* Facebook
* Flattr
* Google+
* Linked In
* Pinterest
* Reddit
* StumbleUpon
* Tumblr
* Twitter
* VKontakte
* XING

Supported options
-----------------

You can use either query string or fragment (hash) to specify options in key/value pair form.

* `url`: the URL to be submitted to a service.
* `service`: select the service when page loaded.
* `flattr_id`: specify who owns the URL for Flattr service.

Issues
------

If you find a bug or need some services to be added to the buttons, create an issue with enough information.

License
-------

    Copyright (c) 2012-2013 Yu-Jie Lin
    This program is licensed under the MIT License, see COPYING
