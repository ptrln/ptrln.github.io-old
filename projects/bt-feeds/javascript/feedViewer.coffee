feedReader = (feedUrl, numEntries, feedEl, 
  feedControlEl, entryTemplate, options = {}) ->

  Entry = Backbone.Model.extend
    initialize: () ->
      this.set 'isRead', this.getField("isRead")
      this.set 'bookmarked', this.getField("bookmarked")      
    read: () ->
      this.setAndStore("isRead", true)
      $(".feed-control-filter").trigger('change')
    unread: ()->
      this.setAndStore("isRead", false)
      $(".feed-control-filter").trigger('change')
    bookmark: () ->
      this.setAndStore("bookmarked", true)
      $(".feed-control-filter").trigger('change')
    unbookmark: () ->
      this.setAndStore("bookmarked", false)
      $(".feed-control-filter").trigger('change')
    setAndStore: (fieldName, cond) ->
      this.set(fieldName, cond)
      this.store(fieldName, cond)
    getField: (fieldName) ->
      localStorage.getItem(fieldName + "|" + this.get('link'))
    store: (fieldName, cond) ->
      if cond
        localStorage.setItem(fieldName + "|" + this.get('link'), true)
      else
        localStorage.removeItem(fieldName + "|" +  this.get('link'))

  EntryList = Backbone.Collection.extend
    model: Entry

  EntryView = Backbone.View.extend
    tagName: "div"
    className: "feed-entry"
    template: entryTemplate
    events:
      "click .entry-bookmark": "bookmarked" 
      "click .entry-read": "read"
    initialize: () ->
      this.listenTo this.model, "change", this.render
    render: () ->
      this.$el.html this.template this.model.toJSON()
      this.toggleClass(this.model.get('bookmarked'), "bookmarked")
      this.toggleClass(this.model.get('isRead'), "read")  
      options["entryRenderCallback"](this) if options["entryRenderCallback"]
      this.$el.find("img").error (event) =>
        $(event.currentTarget).parent().
          find(".entry-title").css("position", "relative")
        $(event.currentTarget).remove();
      this
    bookmarked: (event) ->
      if this.model.get('bookmarked')
        this.model.unbookmark()
      else 
        this.model.bookmark()
      event.preventDefault()
    read: (event)->
      if this.model.get('isRead')
        this.model.unread()
      else
        this.model.read()
      event.preventDefault()
    toggleClass: (condition, trueClass, falseClass = "un" + trueClass) ->
      if condition
        this.$el.addClass(trueClass)
        this.$el.removeClass(falseClass)
      else
        this.$el.addClass(falseClass)
        this.$el.removeClass(trueClass)


  EntryListView = Backbone.View.extend
    initialize: (entries) ->
      this.$el = feedEl
      this.$feedList = $("<div/>")
      this.$el.append(this.$feedList)
      new FeedControlView(this.$feedList)
      this.listenTo entries, 'reset', this.render
      this.$feedList.html(
        _.template($('#feed-loading-template').html()) url: feedUrl
      )
    render: () ->
      this.$feedList.empty()
      if (Entries.length)
        Entries.each (entry) =>
          this.addOne(entry)
      else
        this.renderError message: "Empty feed."
      this.$feedList.imagesLoaded () => this.reLayout()
      this.reLayout()
      options["listRenderCallback"]() if options["listRenderCallback"]
      this
    reLayout: () ->
      if this.$feedList.hasClass('isotope')
        this.$feedList.isotope 'reLayout'
      else
        this.$feedList.isotope layoutMode : 'masonry' 
    renderError: (error) ->
      this.$el.html _.template($('#feed-error-template').html()) error
    addOne: (entry) ->
      view = new EntryView model: entry
      this.$feedList.append view.render().$el

  FeedControlView = Backbone.View.extend
    initialize: ($feedList) ->
      this.feedControlHTML = feedControlEl.html()
      this.$feedList = $feedList
      this.$el = feedControlEl
    events:
      "click .feed-control-reload" : "reloadFeed"
      "change .feed-control-filter" : "filterChange"
      "change .feed-control-sort" : "sortChange"
    reloadFeed: () ->
      this.$feedList.isotope 'destroy'
      this.$el.html this.feedControlHTML
      loadFeed()
    filterChange: () ->
      this.$feedList.isotope 
        filter: $(".feed-control-filter:checked").val()
    sortChange: (event) ->
      this.$feedList.isotope
        sortBy: $(event.currentTarget).attr("data-sortBy")
        sortAscending: $(event.currentTarget).
          attr("data-sortAscending") == "true"

  Entries = new EntryList;

  new EntryListView(Entries);

  loadFeed = () -> 
    feedControlEl.hide()
    feed = new google.feeds.Feed feedUrl
    feed.setNumEntries numEntries
    feed.load (result) ->
      if (!result.error)
        Entries.reset(result.feed.entries)
        feedControlEl.slideDown()
      else
        template = _.template($('#feed-error-template').html())
        feedEl.html template result.error
      null
    null

  google.setOnLoadCallback loadFeed

