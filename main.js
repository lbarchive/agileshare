// Copyright (c) 2012 Yu-Jie Lin
// MIT License

function Services() {
  this.services = {};
  this.view = $('#services');
  this.selected_service = null;
}
Services.prototype = {
  constructor: Services,
  add_service: function(service){
    var self = this;
    var service_id = service.id
    this.services[service_id] = service;
    var $s = $('<span/>', {
      id: 'btn-' + service_id,
      class: 'btn-service',
      html: service.btn_html || service.name,
      alt: 'ID: ' + service.id,
      title: 'ID: ' + service.id,
      click: function(){
        if ($(this).hasClass('selected')) {
          self.unselect_services();
        } else {
          self.select_service(service_id);
        }
      }
    }).appendTo(this.view);
  },
  select_service: function(service_id){
    var service = this.services[service_id];
    if (!service)
      return;
    this.selected_service = service;
    $('span.btn-service').removeClass('selected').addClass('unselected');
    $('#btn-' + service.id).removeClass('unselected').addClass('selected');
    $('#filter-container').slideUp();
    service.show();
    $(this).trigger('select');
  },
  unselect_services: function(){
    this.selected_service = null;
    $('span.btn-service').removeClass('selected unselected');
    $('#service-container').slideUp();
    $('#filter-container').slideDown();
    $(this).trigger('select');
  }
}


function Service(id, name, btn_html) {
  this.id = id;
  this.name = name;
  this.btn_html = btn_html;
  this.view = $('<div/>');
  this.view_initialized = false;
  this.reinit_when_url_changed = true;
}
Service.prototype = {
  constructor: Service,
  create_view: function(){},
  init_view: function(){
    this.view.empty();
    this.create_view();
    this.view_initialized = true;
  },
  show: function(){
    if (!this.view_initialized)
      this.init_view();
    var $s_container = $('#service-container');
    $s_container.empty().append(this.view).slideDown();
  }
}


// http://delicious.com/tools
function ServiceDelicious(){}
ServiceDelicious.prototype = new Service('delicious', 'Delicious');
ServiceDelicious.prototype.create_view = function(){
  var url = $('#url').val();
  // https://s3.amazonaws.com/avos-site-images/delicious-logo-rev1.zip
  var $img = $('<img/>', {
    border: 0,
    src: '/images/delicious.png',
    alt: 'Delicious',
    title: 'Delicious',
    css: {
      'margin-right': '1ex',
      'vertical-align': 'middle'
    }
  })

  var $btn = $('<button/>', {
    click: function(){
      window.open('http://www.delicious.com/save?v=5&noui&jump=close&url=' + encodeURIComponent(url));
    },
    html: $('<span/>', {
      text: 'Save this on Delicious',
      css: {'vertical-align': 'middle'}
    })
  }).prepend($img)
    .appendTo(this.view);
}


// http://about.digg.com/downloads/button/smart
function ServiceDigg(){}
ServiceDigg.prototype = new Service('digg', 'Digg');
ServiceDigg.prototype.create_view = function(){
  var url = $('#url').val();
  var $a = $('<a/>', {
    href: 'http://digg.com/submit?url=' + encodeURIComponent(url),
    class: 'DiggThisButton DiggCompact'
  }).appendTo(this.view);

  $.ajaxSetup({cache: true});
  $.getScript('http://widgets.digg.com/buttons.js')
  $.ajaxSetup({cache: false});
}


function ServiceEmail(){
  this.reinit_when_url_changed = false;
}
ServiceEmail.prototype = new Service('email', 'Email', '<span class="symbol">@</span> Email');
ServiceEmail.prototype.create_view = function(){
  this.view.append($('<span/>').text('To: '));
  var $to = $('<input/>', {
    type: 'text',
    id: 'email-to',
    placeholder: 'someone@example.com'
  }).appendTo(this.view);

  var $btn = $('<button/>', {
    text: 'Open email client',
    click: function(){
      var to = $('#email-to').val();
      window.open('mailto:'+ to + '?body=' + encodeURIComponent($('#url').val()));
    }
  }).appendTo(this.view);
}


// http://developers.facebook.com/docs/reference/plugins/like/
function ServiceFacebook(){}
ServiceFacebook.prototype = new Service('facebook', 'Facebook', '<span class="symbol">f</span> Facebook');
ServiceFacebook.prototype.create_view = function(){
  var url = $('#url').val();
  $('<div/>', {id: 'fb-root'}).appendTo(this.view);
  var $div = $('<div/>', {
    'data-href': url,
    'data-send': 'true',
    'data-width': '450',
    'data-show-faces': 'true',
    class: 'fb-like'
  }).appendTo(this.view);

  if (window.FB) {
    FB.XFBML.parse();
    return;
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}


// http://www.google.com/intl/en/webmasters/+1/button/index.html
function ServiceGooglePlus(){}
ServiceGooglePlus.prototype = new Service('google-plus', 'Google+', '<span class="symbol">g</span> Google+');
ServiceGooglePlus.prototype.create_view = function(){
  var url = $('#url').val();
  var $div = $('<div/>', {
    'data-href': url,
    class: 'g-plusone'
  }).appendTo(this.view);

  $.ajaxSetup({cache: true});
  $.getScript('https://apis.google.com/js/plusone.js')
  $.ajaxSetup({cache: false});
}


// http://developer.linkedin.com/share-plugin
function ServiceLinkedIn(){}
ServiceLinkedIn.prototype = new Service('linkedin', 'LinkedIn', '<span class="symbol">l</span> Linked In');
ServiceLinkedIn.prototype.create_view = function(){
  var url = $('#url').val();
  var $script = $('<script/>', {
    type: 'IN/Share',
    'data-url': url,
    'data-counter': 'right',
    'data-showzero': true
    }).appendTo(this.view);

  $.ajaxSetup({cache: true});
  $.getScript('http://platform.linkedin.com/in.js')
  $.ajaxSetup({cache: false});
}


// http://pinterest.com/about/goodies/
function ServicePinterest(){}
ServicePinterest.prototype = new Service('pinterest', 'Pinterest');
ServicePinterest.prototype.create_view = function(){
  var url = $('#url').val();
  var $img = $('<img/>', {
    border: 0,
    src: '//assets.pinterest.com/images/PinExt.png',
    title: 'Pin It'
  });

  var $a = $('<a/>', {
    href: 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url),
    'count-layout': 'horizontal',
    class: 'pin-it-button'
  }).append($img).appendTo(this.view);

  $.ajaxSetup({cache: true});
  $.getScript('//assets.pinterest.com/js/pinit.js')
  $.ajaxSetup({cache: false});
}


// http://www.reddit.com/buttons/
function ServiceReddit(){}
ServiceReddit.prototype = new Service('reddit', 'Reddit');
ServiceReddit.prototype.create_view = function(){
  var url = $('#url').val();

  // http://www.reddit.com/static/button/button3.js
  var prefix = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.reddit.com';
  var $iframe = $('<iframe/>', {
    src: prefix + '/static/button/button3.html' +
      '?width=69' +
      '&newwindow=1' +
      '&url=' + encodeURIComponent(url),
    height: '52px',
    width: '69px',
    scrolling: 'no',
    frameborder: '0'
    }).appendTo(this.view);
}


// http://www.stumbleupon.com/dt/badges/create
function ServiceStumbleUpon(){}
ServiceStumbleUpon.prototype = new Service('stumbleupon', 'StumbleUpon');
ServiceStumbleUpon.prototype.create_view = function(){
  var url = $('#url').val();
  var $su = $('<su:badge/>').appendTo(this.view);
  $su.attr('layout', '2');
  $su.attr('location', url);

  $.ajaxSetup({cache: true});
  $.getScript('https://platform.stumbleupon.com/1/widgets.js')
  $.ajaxSetup({cache: false});
}


// http://www.tumblr.com/docs/en/buttons
function ServiceTumblr(){}
ServiceTumblr.prototype = new Service('tumblr', 'Tumblr', '<span class="symbol">k</span> Tumblr');
ServiceTumblr.prototype.create_view = function(){
  var url = $('#url').val();
  var $a = $('<a/>', {
    href: 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(url),
    click: function(){
      window.open(this.href);
      return false;
    },
    style: "display:inline-block; text-indent:-9999px; overflow:hidden; width:129px; height:20px; background:url('http://platform.tumblr.com/v1/share_3T.png') top left no-repeat transparent;",
    text: 'Share on Tumblr'
    }).appendTo(this.view);
}


// http://twitter.com/about/resources/buttons#tweet
function ServiceTwitter(){}
ServiceTwitter.prototype = new Service('twitter', 'Twitter', '<span class="symbol">t</span> Twitter');
ServiceTwitter.prototype.create_view = function(){
  var url = $('#url').val();
  var $a = $('<a/>', {
    href: 'https://twitter.com/share',
    text: 'Tweet',
    'data-url': url,
    class: 'twitter-share-button'
    }).appendTo(this.view);

  $.ajaxSetup({cache: true});
  $.getScript('//platform.twitter.com/widgets.js')
  $.ajaxSetup({cache: false});
}

// http://vk.com/developers.php?oid=-17680044&p=Share
function ServiceVKontakte(){
  var self = this;
  this.render = function(){
    var url = $('#url').val();
    self.view.html(VK.Share.button({url: url}, {type: "round", text: "Share"}));
  }
}
ServiceVKontakte.prototype = new Service('vk', 'VKontakte', '<span class="symbol">v</span> VKontakte');
ServiceVKontakte.prototype.constructor = ServiceVKontakte;
ServiceVKontakte.prototype.create_view = function(){
  if (window.VK) {
    this.render();
    return
  }
  $.ajaxSetup({cache: true});
  $.getScript('http://vk.com/js/api/share.js?11', this.render);
  $.ajaxSetup({cache: false});
}


// https://www.xing.com/app/share?op=button_builder
function ServiceXING(){}
ServiceXING.prototype = new Service('xing', 'XING');
ServiceXING.prototype.create_view = function(){
  var url = $('#url').val();
  var $script = $('<script/>', {
    type: 'XING/Share',
    'data-url': url,
    'data-counter': 'top',
    'data-lang': 'en'
    }).appendTo(this.view);
  // use the conventional way to insert script tag as the code provided by
  // XING.
  (function(d, s) {
    var x = d.createElement(s);
    var s = d.getElementsByTagName(s)[0];
    x.src ='https://www.xing-share.com/js/external/share.js';
    s.parentNode.insertBefore(x, s);
  })(document, 'script');
}


function update_url() {
  var query = 'url=' + encodeURIComponent($('#url').val());
  if (services.selected_service)
    query += '&service=' + encodeURIComponent(services.selected_service.id);
  $('.url-query').text(query);
}


function url_changed(show) {
  for (var idx in services.services)
    if (services.services[idx].reinit_when_url_changed)
      services.services[idx].view_initialized = false;
  if (show && services.selected_service)
    services.selected_service.show();
  update_url();
}


function qs_to_kv(query) {
  var pairs = {}
  $.each(query.split('&'), function(idx, kvs){
    var kv = kvs.split('=');
    pairs[kv[0]] = decodeURIComponent(kv[1]);
  });
  return pairs;
}


// Load
$(function(){
  var services = window.services = new Services();
  var services_list = [
    ServiceDelicious, ServiceDigg,
    ServiceEmail,
    ServiceFacebook,
    ServiceGooglePlus,
    ServiceLinkedIn,
    ServicePinterest,
    ServiceReddit,
    ServiceStumbleUpon,
    ServiceTumblr, ServiceTwitter,
    ServiceVKontakte,
    ServiceXING];
  $.each(services_list, function(idx, service){
    services.add_service(new service());
  });

  var href = location.href.split('?')[0].split('#')[0];
  var kvs_hash = qs_to_kv(location.hash.substr(1));
  var query = (location.href.split('?')[1] || '').split('#')[0];
  var kvs_query = qs_to_kv(query);

  var url = kvs_hash['url'] || kvs_query['url'] || document.referrer || href;
  var service_id = kvs_hash['service'] || kvs_query['service'] || null;
  
  $('.code-url').text(href);
  $('#bookmarklet').attr(
    'href', 
    'javascript:(function(){window.open("' + href + '?url="+encodeURIComponent(location.href));})();');

  $('#url')
    .val(url)
    .change(function(){url_changed();})
    .blur(function(){url_changed(true);});
  update_url();

  $('#filter')
    .keyup(function(){
      var text = $(this).val();
      if (!text) {
        $('span.btn-service').removeClass('hidden');
        return;
      }
      var RE = new RegExp(text, 'gi');
      for(var idx in services.services){
        var service = services.services[idx];
        RE.lastIndex = 0;
        if (RE.test(service.name))
          $('#btn-' + service.id).removeClass('hidden');
        else
          $('#btn-' + service.id).addClass('hidden');
      }
    });

  $(services).bind('select', function(){url_changed()});
  services.select_service(service_id);
});
