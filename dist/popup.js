new Vue({
    el: "#app",
    data: {
        clipWorkArea: "",
        option: {
            templates: []
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
            var e = this;
            chrome.storage.local.get("option", function(t) {
                t.option ? e.option = t.option : e.init();
            });
        },
        replace: function(e, t, n, o) {
            var a = this, r = !1;
            n = n.replace(/(?:[^\\]|^)(\{(?:title|url|tinyurl)\})/, function() {
                function i() {
                    4 == s.readyState && (p = s.responseText, a.replace(e, t + p, u, o));
                }
                r = !0;
                var l = Array.prototype.slice.call(arguments)[1], c = n.indexOf(l);
                t += n.substr(0, c);
                var u = n.substr(c + l.length), p = "";
                switch (l) {
                  case "{title}":
                    p = e.title;
                    break;

                  case "{url}":
                    p = e.url;
                    break;

                  case "{tinyurl}":
                    p = e.url;
                    var s = new XMLHttpRequest();
                    return s.onreadystatechange = i, s.open("GET", "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(e.url), !0), 
                    void s.send();
                }
                a.replace(e, t + p, u, o);
            }), r || o(t + n);
        },
        copy: function(e) {
            var t = this;
            chrome.tabs.query({
                active: !0
            }, function(n) {
                var o = n[0], a = e.value;
                a = (a = a.replace("\\n", "\n")).replace("\\t", "\t"), t.replace(o, "", a, function(e) {
                    t.clipWorkArea = e, Vue.nextTick(function() {
                        t.$refs.clipWorkArea.select(), document.execCommand("Copy");
                    });
                });
            });
        }
    },
    created: function() {
        this.load();
    }
});