var feedReader;

feedReader = function(feedUrl, numEntries, feedEl, feedControlEl, entryTemplate, options) {
  var Entries, Entry, EntryList, EntryListView, EntryView, FeedControlView, loadFeed;
  if (options == null) {
    options = {};
  }
  Entry = Backbone.Model.extend({
    initialize: function() {
      this.set('isRead', this.getField("isRead"));
      return this.set('bookmarked', this.getField("bookmarked"));
    },
    read: function() {
      this.setAndStore("isRead", true);
      return $(".feed-control-filter").trigger('change');
    },
    unread: function() {
      this.setAndStore("isRead", false);
      return $(".feed-control-filter").trigger('change');
    },
    bookmark: function() {
      this.setAndStore("bookmarked", true);
      return $(".feed-control-filter").trigger('change');
    },
    unbookmark: function() {
      this.setAndStore("bookmarked", false);
      return $(".feed-control-filter").trigger('change');
    },
    setAndStore: function(fieldName, cond) {
      this.set(fieldName, cond);
      return this.store(fieldName, cond);
    },
    getField: function(fieldName) {
      return localStorage.getItem(fieldName + "|" + this.get('link'));
    },
    store: function(fieldName, cond) {
      if (cond) {
        return localStorage.setItem(fieldName + "|" + this.get('link'), true);
      } else {
        return localStorage.removeItem(fieldName + "|" + this.get('link'));
      }
    }
  });
  EntryList = Backbone.Collection.extend({
    model: Entry
  });
  EntryView = Backbone.View.extend({
    tagName: "div",
    className: "feed-entry",
    template: entryTemplate,
    events: {
      "click .entry-bookmark": "bookmarked",
      "click .entry-read": "read"
    },
    initialize: function() {
      return this.listenTo(this.model, "change", this.render);
    },
    render: function() {
      var _this = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.toggleClass(this.model.get('bookmarked'), "bookmarked");
      this.toggleClass(this.model.get('isRead'), "read");
      if (options["entryRenderCallback"]) {
        options["entryRenderCallback"](this);
      }
      this.$el.find("img").error(function(event) {
        $(event.currentTarget).parent().find(".entry-title").css("position", "relative");
        return $(event.currentTarget).remove();
      });
      return this;
    },
    bookmarked: function(event) {
      if (this.model.get('bookmarked')) {
        this.model.unbookmark();
      } else {
        this.model.bookmark();
      }
      return event.preventDefault();
    },
    read: function(event) {
      if (this.model.get('isRead')) {
        this.model.unread();
      } else {
        this.model.read();
      }
      return event.preventDefault();
    },
    toggleClass: function(condition, trueClass, falseClass) {
      if (falseClass == null) {
        falseClass = "un" + trueClass;
      }
      if (condition) {
        this.$el.addClass(trueClass);
        return this.$el.removeClass(falseClass);
      } else {
        this.$el.addClass(falseClass);
        return this.$el.removeClass(trueClass);
      }
    }
  });
  EntryListView = Backbone.View.extend({
    initialize: function(entries) {
      this.$el = feedEl;
      this.$feedList = $("<div/>");
      this.$el.append(this.$feedList);
      new FeedControlView(this.$feedList);
      this.listenTo(entries, 'reset', this.render);
      return this.$feedList.html(_.template($('#feed-loading-template').html())({
        url: feedUrl
      }));
    },
    render: function() {
      var _this = this;
      this.$feedList.empty();
      if (Entries.length) {
        Entries.each(function(entry) {
          return _this.addOne(entry);
        });
      } else {
        this.renderError({
          message: "Empty feed."
        });
      }
      this.$feedList.imagesLoaded(function() {
        return _this.reLayout();
      });
      this.reLayout();
      if (options["listRenderCallback"]) {
        options["listRenderCallback"]();
      }
      return this;
    },
    reLayout: function() {
      if (this.$feedList.hasClass('isotope')) {
        return this.$feedList.isotope('reLayout');
      } else {
        return this.$feedList.isotope({
          layoutMode: 'masonry'
        });
      }
    },
    renderError: function(error) {
      return this.$el.html(_.template($('#feed-error-template').html())(error));
    },
    addOne: function(entry) {
      var view;
      view = new EntryView({
        model: entry
      });
      return this.$feedList.append(view.render().$el);
    }
  });
  FeedControlView = Backbone.View.extend({
    initialize: function($feedList) {
      this.feedControlHTML = feedControlEl.html();
      this.$feedList = $feedList;
      return this.$el = feedControlEl;
    },
    events: {
      "click .feed-control-reload": "reloadFeed",
      "change .feed-control-filter": "filterChange",
      "change .feed-control-sort": "sortChange"
    },
    reloadFeed: function() {
      this.$feedList.isotope('destroy');
      this.$el.html(this.feedControlHTML);
      return loadFeed();
    },
    filterChange: function() {
      return this.$feedList.isotope({
        filter: $(".feed-control-filter:checked").val()
      });
    },
    sortChange: function(event) {
      return this.$feedList.isotope({
        sortBy: $(event.currentTarget).attr("data-sortBy"),
        sortAscending: $(event.currentTarget).attr("data-sortAscending") === "true"
      });
    }
  });
  Entries = new EntryList;
  new EntryListView(Entries);
  loadFeed = function() {
    var feed;
    feedControlEl.hide();
    feed = new google.feeds.Feed(feedUrl);
    feed.setNumEntries(numEntries);
    feed.load(function(result) {
      var template;
      if (!result.error) {
        Entries.reset(result.feed.entries);
        feedControlEl.slideDown();
      } else {
        template = _.template($('#feed-error-template').html());
        feedEl.html(template(result.error));
      }
      return null;
    });
    return null;
  };
  return google.setOnLoadCallback(loadFeed);
};