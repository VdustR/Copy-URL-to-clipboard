new Vue({
  el: '#app',

  data: {
    newMethodName: '',
    newMethodValue: '',
    option: {
      templates: []
    }
  },

  computed: {
    isNewMethodValid: function () {
      if (this.newMethodName.length === 0) return false
      if (this.newMethodValue.length === 0) return false
      return true
    }
  },

  watch: {
    'option.templates': function () {
      this.save()
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

    addMethod: function () {
      this.option.templates.push({
        name: this.newMethodName,
        value: this.newMethodValue
      })
      this.newMethodName = ''
      this.newMethodValue = ''
    },

    removeMethod: function (template) {
      var index = this.option.templates.indexOf(template)
      if (index === -1) return
      this.option.templates.splice(index, 1)
    }
  },

  created: function () {
    this.load()
  }
})
