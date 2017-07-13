new Vue({
  el: '#app',

  data: {
    clipWorkArea: '',
    option: {
      templates: []
    }
  },

  methods: {
    init: function () {
      this.option = {
        templates: [{
          name: 'URL',
          value: '{url}'
        }, {
          name: 'title - URL',
          value: '{title} - {url}'
        }, {
          name: 'title - TinyURL',
          value: '{title} - {tinyurl}'
        }]
      }
    },

    save: function () {
      chrome.storage.local.set({'option': this.option})
    },

    load: function () {
      var self = this
      chrome.storage.local.get('option', function (result) {
        if (!result.option) {
          self.init()
          return
        }

        self.option = result.option
      })
    },

    replace: function (tab, prefix, str, cb) {
      var self = this
      var isMatch = false
      str = str.replace(/(?:[^\\]|^)(\{(?:title|url|tinyurl)\})/, function () {
        isMatch = true
        var args = Array.prototype.slice.call(arguments)
        var p1 = args[1]
        var offset = str.indexOf(p1)
        prefix = prefix + str.substr(0, offset)
        var postfix = str.substr(offset + p1.length)
        var replacement = ''
        switch (p1) {
          case '{title}':
            replacement = tab.title
            break
          case '{url}':
            replacement = tab.url
            break
          case '{tinyurl}':
            replacement = tab.url
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
            xhr.open("GET", 'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(tab.url), true);
            xhr.send()
            function handleStateChange () {
              if (xhr.readyState == 4) {
                replacement = xhr.responseText
                self.replace(tab, prefix + replacement, postfix, cb)
              }
            }
            return
        }
        self.replace(tab, prefix + replacement, postfix, cb)
      })
      if (!isMatch) cb(prefix + str)
    },

    copy: function (template) {
      var self = this
      chrome.tabs.query({ active: true }, function (tabs) {
        var tab = tabs[0]
        var str = template.value
        str = str.replace('\\n', '\n')
        str = str.replace('\\t', '\t')
        self.replace(tab, '', str, function (result) {
          self.clipWorkArea = result
          Vue.nextTick(function () {
            self.$refs.clipWorkArea.select()
            document.execCommand('Copy')
          })
        })
      })
    }
  },

  created: function () {
    this.load()
  }
})