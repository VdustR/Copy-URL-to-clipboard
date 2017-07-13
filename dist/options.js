new Vue({
    el: "#app",
    data: {
        newMethodName: "",
        newMethodValue: "",
        option: {
            templates: []
        }
    },
    computed: {
        isNewMethodValid: function() {
            return 0 !== this.newMethodName.length && 0 !== this.newMethodValue.length;
        }
    },
    watch: {
        "option.templates": function() {
            this.save();
        }
    },
    methods: {
        init: function() {
            this.option = {
                templates: [ {
                    name: "URL",
                    value: "{url}"
                }, {
                    name: "title - URL",
                    value: "{title} - {url}"
                }, {
                    name: "title - TinyURL",
                    value: "{title} - {tinyurl}"
                } ]
            };
        },
        save: function() {
            chrome.storage.local.set({
                option: this.option
            });
        },
        load: function() {
            var t = this;
            chrome.storage.local.get("option", function(e) {
                e.option ? t.option = e.option : t.init();
            });
        },
        addMethod: function() {
            this.option.templates.push({
                name: this.newMethodName,
                value: this.newMethodValue
            }), this.newMethodName = "", this.newMethodValue = "";
        },
        removeMethod: function(t) {
            var e = this.option.templates.indexOf(t);
            -1 !== e && this.option.templates.splice(e, 1);
        }
    },
    created: function() {
        this.load();
    }
});