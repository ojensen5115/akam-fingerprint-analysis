(function() {

    var page_identifier = window["bazadebezolkohpepadr"];         // set by calling document
    var unknown_hash_1 = "429471401c2c5bdfbf4f48c56fbc4f89";
    var unknown_hash_2 = "b7a9cdc96f0e57b9ac3b225b8928342e";
    var unknown_hash_3 = "679ddb4a0c6e5f4fba37a52f6d08c9f4";

    var already_measured = false;
    var A = null;   // unknown purpose
    var m = null;   // unknown purpose

    var sha1_cache = {};
    function sha1_impl = function(e) {...}
    function sha1(e) {
        return sha1_cache[e] || (sha1_cache[e] = sha1_impl(e)), sha1_cache[e];
    }

    // does this call `thing`? seems to be used to measure initialization time
    function is_array(thing) {
        return "[object Array]" === Object.prototype.toString.call(thing);
    }

    function get_plugins() {
        var plugins = null;
        try {
            plugins = navigator.plugins
        } catch (error) {}
        return plugins;
    }



    function Fingerprinter() {

        var EXECUTION_COUNTER = 0;
        var RESULTS_OBJECT = {
            ap: null,
            bt: null,
            fonts: null,
            fh: null,
            timing: {
                profile: {}
            }
        };

        this.compute = function(e) {
            EXECUTION_COUNTER++;
            evaluate_and_time(record_plugins_hashcode, "bp");
            evaluate_and_time(record_screen_viewport_dimensions, "sr");
            evaluate_and_time(record_document_properties, "dp");
            evaluate_and_time(record_timestamp_with_offset, "lt");
            evaluate_and_time(record_local_or_session_storage, "ps");
            evaluate_and_time(record_canvas_drawing_behavior, "cv");
            evaluate_and_time(record_shockwave_flash_version, "fp");
            evaluate_and_time(record_supported_silverlight_versions, "sp");
            evaluate_and_time(record_browser_name, "br");
            evaluate_and_time(record_ie_userdata_behavior, "ieps");
            evaluate_and_time(record_activex_properties, "av");
            evaluate_and_time(record_browser_automation, "z" + EXECUTION_COUNTER);
            evaluate_and_time(check_latest_supported_javascript_version, "jsv");
            evaluate_and_time(record_plugin_names, "nav");
            evaluate_and_time(record_navigator_permissions, "nap");
            evaluate_and_time(record_window_chrome, "crc");
            record_result("t", sha1(page_identifier));      // possibly for removing invalid submissions
            record_result("u", unknown_hash_1);             // possibly for removing invalid submissions
            record_canvas_and_battery();
            is_array(RESULTS_OBJECT)
        };

        this.exitEarly = function() {
            return RESULTS_OBJECT["z"]["a"] != page_identifier
        };

        this.retry = function() {
            evaluate_and_time(record_browser_automation, "z" + ++EXECUTION_COUNTER)
        };

        function evaluate_and_time(callable, label) {
            var timestamp = new Date().valueOf();
            callable(label);
            record_elapsed_time(label, new Date().valueOf() - timestamp)
        }

        function record_canvas_and_battery() {
            record_canvas_pixel_color("ap");
            record_battery_status("bt")
        }

        function record_result(property, value) {
            try {
                RESULTS_OBJECT[property] = value
            } catch (error) {}
        }

        function record_elapsed_time(label, elapsed_time) {
            RESULTS_OBJECT["timing"]["profile"][label] = elapsed_time;
        }

        function str_hashcode(inputstr) {
            var accumulator = 0;
            if (!inputstr) return accumulator;
            for (var idx = 0; idx < inputStr.length; idx++) {
                accumulator = (accumulator << 5) - accumulator + inputStr.charCodeAt(idx);
                accumulator &= accumulator;
            }
            return accumulator;
        }

        function extract_value(container, property) {
            if (container[property] === 0) {
                return 0
            }
            var value = container[property];
            var type = typeof value;
            if (value && !is_array(value)) {
                if (type === 'object' || type === 'function') {
                    return 1;
                }
            }
            return value;
        }

        function collect_properties(e, elements, collector) {
            collector = collector || {};
            for (var idx = 0, idx < elements.length; idx++) {
                try {
                    collector[elements[idx]] = extract_value(e, elements[idx])
                } catch (error) {
                    collector[elements[idx]] = -1
                }
            }
            return collector;
        }

        function record_plugin_names(label) {
            try {
                var browser_properties = ["userAgent", "appName", "appCodeName", "appVersion", "appMinorVersion", "product",
                         "productSub", "vendor", "vendorSub", "buildID", "platform", "oscpu", "hardwareConcurrency",
                         "language", "languages", "systemLanguage", "userLanguage", "doNotTrack", "msDoNotTrack",
                         "cookieEnabled", "geolocation", "vibrate", "maxTouchPoints", "webdriver"],
                var result = collect_properties(window.navigator, browser_properties),
                var plugins = get_plugins();
                if (plugins) {
                    var plugin_names = [];
                    for (var idx = 0; idx < plugins.length; idx++) {
                        plugin_names.push(plugins[idx]["name"]);
                    }
                    result["plugins"] = plugin_names
                }
                record_result(label, JSON.stringify(result))
            } catch (t) {
                record_result(label, null)
            }
        }

        function record_battery_status(label) {
            try {
                if (!window.navigator.getBattery) return void record_result(label, 0);
                window.navigator.getBattery().then(function(battery) {
                    var result = {};
                    for (var property in battery) {
                        var val = battery[property];
                        result[property] = val === 1 / 0 ? "Infinity" : val;
                    }
                    try {
                        record_result(label, JSON.stringify(result))
                    } catch (error) {
                        record_result(label, null)
                    }
                });
            } catch (error) {
                record_result(label, null)
            }
        }

        function record_canvas_pixel_color(label) {
            try {
                if (window.Image) {
                    var img = new window.Image;
                    var ctx = document.createElement("canvas")["getContext"]("2d");
                    img.onload = function() {
                        ctx.drawImage(t, 0, 0);
                        var result = 0 === ctx.getImageData(0, 0, 1, 1)["data"][3];
                        record_result(label, result)
                    };
                    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg=="
                }
            } catch (error) {
                record_result(label, null)
            }
        }

        function record_document_properties(label) {
            try {
                var result = collect_properties(b, [
                    "XDomainRequest", "createPopup", "removeEventListener", "globalStorage", "openDatabase",
                    "indexedDB", "attachEvent", "ActiveXObject", "dispatchEvent", "addBehavior", "addEventListener",
                    "detachEvent", "fireEvent", "MutationObserver", "HTMLMenuItemElement", "Int8Array",
                    "postMessage", "querySelector"]);
                collect_properties(document, ["getElementsByClassName", "querySelector", "images", "compatMode", "documentMode"], result);
                result["all"] = +(void 0 !== document["all"]);
                if (window.performance) {
                    collect_properties(window["performance"], ["now"], result)
                }
                collect_properties(document.documentElement, ["contextMenu"], result)
                record_result(label, JSON.stringify(result))
            } catch (error) {
                record_result(label, null)
            }
        }

        function record_browser_automation() {
            try {
                var FLAG_HASH = 1;
                var FLAG_HEADLESS = 2;
                var FLAG_SEQUENTUM = 4;
                var flags = 0;

                // We will search for any properties of window or document whose names match these hashes.
                var global_variable_hashes = {
                        "ab83830091905ec484220e15372611e52518dc10": 0,  //
                        "5932ec3b29ebe803fd4c2ea4c6466594a8d26e98": 1,  // _phantom
                        "c61ac5f634a60b236efff0dcf2c58ea21a5bb045": 2,  //
                        "c72737c2730b51767fa2bb7096d8a21794478e31": 3,  // _selenium
                        "2be5f64b36230104ef9c6e230215846a83d18df6": 4,  // Buffer
                        "65e447c54305dd9339396c154db07818f9675b34": 5,  //
                        "2d7806f38716a43e8c137edf6a2ce743a37dd269": 6,  //
                        "2e96e89125f4c1aef797410a4bfdb32c0632ef0c": 7,  // emit
                        "6227120ab7544133388a6529a55e3c3aa773b62a": 8,  // spawn
                        "aada8c761c9839de74c9e0a3f646245903ade635": 9,  //
                        "401f28bfeb07b52f1aa03f6be068183a69e616a7": 10, //
                        "a55eadd3835e907703909302ae224665c7f1deb5": 11, //
                        "f29a5b0b6b66a956c46aa96418616943a82f384e": 12, //
                        "ceb4ff185e3410098b188fc7ab41d5da08915cb7": 13, // webdriver
                        "9a023486a301520629fbd808528062bd5faea3a3": 14, //
                        "9c809883f7ac3b475264c728b470ec6f6023c603": 15, //
                        "f50b8c49b59e71ed9bfb3cf29657f9525fe732ea": 16, //
                        "0079454664c5bd62c192c37249266fc3f444b92d": 17, //
                        "4b98d10d3ddef6d769a68834839f996051b4bfbc": 18, //
                        "280888db1a3adbaa57cf1d78354b34ebffb5f0f5": 19, //
                        "b17210a08058278fe2a99efaaf3d2ca2cb04e5c4": 20, //
                        "a5d557543fd7dc314cc9028547484efb6990c4a4": 21, //
                        "c8601f2bf97562110658a0fa715570a462f8827f": 22, //
                        "a7c4b3b7096f24f28a1e67eb5864d482abe923b2": 23, //
                        "b596b0aabfcbd673e7d167e0300bea98c7ae28b6": 24, //
                        "68bde83571d61a1e089a11dd5c781f9430981cbb": 25, //
                        "f398833bfc598770628c0bd78147d79375314770": 26, //
                        "144731d8f2ce4d33fd52c9c854ed5ebc3cc55e4d": 27, //
                        "4830d704dd532a1b5533234200de6cc28b4201d6": 28, //
                        "e727e7bd5f6f8c596d3f18c28ab3adf1e1f648f6": 29, //
                        "0cfb78ff5a7b54c4084b51597b850d69a81d885b": 30, //
                        "9210fca97412a462e08573ed5523fc317f61b552": 31  //
                    };
                // All of the property names we're looking for begin with one of these characters, so
                // we can filter the property names by first letter to help performance.
                var prefix_filter = {
                    '$': 1, '_': 1, 'B': 1, 'c': 1, 'd': 1, 'e': 1, 's': 1, 'w': 1
                };

                var found_hashes = [];
                // check if certain window or document properties or global variables exist.
                // names identified by hashes above.
                var containers = [window, document];
                for (var idx = 0; idx < containers.length; idx++) {
                    var win_or_doc = containers[idx];
                    for (var global_variable in win_or_doc)
                        if (prefix_filter[global_variable[0]]) {
                            var hashnum = global_variable_hashes[sha1(d)];
                            if (0 !== hashnum) {
                                found_hashes.push(hashnum);
                                flags |= FLAG_HASH;
                            }
                        }
                }

                // check if it's selenium or equivalent
                var identifiers = ["selenium", "driver", "webdriver"];
                for (idx = 0; idx < identifiers.length; idx++) {
                    if (document.documentElement.getAttribute(identifiers[idx])) {
                        flags |= FLAG_HEADLESS;
                    }
                }

                // check for sequentum
                if (window.external && window.external.toString && window.external.toString().indexOf("Sequentum") > -1) {
                    flags |= FLAG_SEQUENTUM;
                }

                record_result("z", {
                    'a': flags ^ page_identifier,
                    'b': +!(!window.XPathResult && !document.XPathResult),
                    'c': +!(!window.chrome || window.chrome.runtime)
                });
                record_result("zh", found_hashes + "");
            } catch (error) {
                record_result("z", {
                    'a': page_identifier,
                    'b': 0,
                    'c': 0,
                    'e': 1
                }), record_result("zh", "")
            }
        }

        function record_activex_properties(label) {
            if (window["ActiveXObject"]) {
                for (var idx = 2; idx < 10; idx++) {
                    try {
                        record_result(e, !!new window.ActiveXObject("PDF.PdfCtrl." + idx) && idx);
                        return;
                    }
                } catch (error) {}
                try {
                    record_result(e, !!new window.ActiveXObject("PDF.PdfCtrl.1") && "4");
                    return;
                } catch (error) {}
                try {
                    record_result(e, !!new window.ActiveXObject("AcroPDF.PDF.1") && "7");
                    return;
                } catch (error) {}
            }
            record_result(label, false)
        }

        function record_ie_userdata_behavior(label) {
            var elem = false;
            var result = false;
            try {
                elem = document.createElement("div");
                elem.style.behavior = "url(#default#userData)";
                document.body.appendChild(t);
                elem.setAttribute("fsfp", "true1");
                elem.save("oXMLStore");
                elem.removeAttribute("fsfp");
                elem.load("oXMLStore");
                result = "true1" === elem.getAttribute("fsfp");
            } catch (error) {}
            try {
                elem && document.body.removeChild(elem);
            } catch (error) {}
            record_result(label, result)
        }

        function record_supported_silverlight_versions(label) {
            function check_silverlight_version_supported(version) {
                void 0 == version && (version = null);  // not sure what this line does
                var result = false;
                try {
                    var n = false;
                    try {
                        var silverlight = navigator.plugins["Silverlight Plug-In"];
                        if (silverlight)
                            if (null === version) result = true;
                            else {
                                for (var r = silverlight["description"], i = r.split("."); i.length > 3;) i.pop();
                                for (; i.length < 4;) i.push(0);
                                for (var o = version.split("."); o.length > 4;) o.pop();
                                var c, f, d = 0;
                                do {
                                    c = parseInt(o[d]), f = parseInt(i[d]), d++
                                } while (d < o.length && c === f);
                                c <= f && !isNaN(c) && (result = true)
                            }
                        else n = true
                    } catch (error) {
                        n = true
                    }
                    if (n) {
                        var agcontrol = new window.ActiveXObject("AgControl.AgControl");
                        null === e ? result = true : agcontrol.IsVersionSupported(e) && (result = true), u = null
                    }
                } catch (error) {
                    result = false
                }
                return result;
            }
            try {
                var versions = ["1.0", "2.0", "3.0", "4.0", "5.0"];
                var supported_versions = [];
                for (var idx = 0; idx < versions.length; idx++) {
                    if (check_silverlight_version_supported(versions[idx])) {
                        supported_versions.push(versions[idx]);
                    }
                }
                if (supported_versions.length == 0) {
                    record_result(label, false);
                    return;
                }
                record_result(label, supported_versions.join(","))
            } catch (error) {
                record_result(label, false)
            }
        }

        function record_browser_name(label) {
            try {
                var opera = window["opera"] || l["userAgent"]["indexOf"](" OPR/") >= 0 ? "Opera" : 0;
                var firefox = "undefined" != typeof InstallTrigger ? "Firefox" : 0;
                var safari = Object["prototype"]["toString"]["call"](window["HTMLElement"])["indexOf"]("Constructor") > 0 || window["safari"] && window["safari"]["pushNotification"] && "[object SafariRemoteNotification]" === window["safari"]["pushNotification"]["toString"]() || window["ApplePaySession"];
                safari = safari ? "Safari" : 0;
                var crios = safari && l["userAgent"]["match"]("CriOS") ? "Chrome IOS" : 0;
                var chrome = window["chrome"] && !t ? "Chrome" : 0;
                var ie = window["ActiveXObject"] && "ActiveXObject" in window || u["documentMode"] ? "IE" : 0;
                var edge = !ie && window["StyleMedia"] ? "Edge" : 0;
                var browser_name = opera || firefox || ie || chrome || crios || safari || "";
                record_result(label, browser_name)
            } catch (error) {
                record_result(label, null)
            }
        }

        function record_shockwave_flash_version(label) {
            function extract_version(description_str) {
                return e = e["match"](/[\d]+/g), e["length"] = 3, e["join"](".")
            }
            var found = false;
            var version = "";
            var plugins = get_plugins();

            if (plugins && plugins.length) {
                var shockwave = plugins["Shockwave Flash"];
                if (shockwave) {
                    found = true;
                    if (shockwave["description"]) {
                        version = extract_version(shockwave["description"]);
                    }
                    if (plugins["Shockwave Flash 2.0"]) {
                        found = true;
                        version = "2.0.0.11";
                    }
                }
            } else {
                var mimetypes;
                try {
                    mimetypes = navigator.mimeTypes;
                } catch (error) {}

                if (mimetypes && mimetypes.length) {
                    var flash = mimetypes["application/x-shockwave-flash"];
                    found = flash;
                    if (flash && flash["enabledPlugin"]) {
                        version = extract_version(flash["enabledPlugin"]["description"]);
                    }
                } else try {
                    var shockwave = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                    found = true;
                    version = extract_version(shockwave.GetVariable("$version"));
                } catch (error) {
                    try {
                        shockwave = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                        found = true;
                        version = "6.0.21";
                    } catch (error) {
                        try {
                            shockwave = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                            found = true;
                            version = extract_version(shockwave.GetVariable("$version"));
                        } catch (error) {}
                    }
                }
            }
            var result = version;
            record_result(label, !!found && result);
        }

        function record_local_or_session_storage(label) {
            record_result(label, functions_as_storage("localStorage") + "," + functions_as_storage("sessionStorage"))
        }

        function functions_as_storage(storage_type) {
            try {
                var storage = document[storage_type];   // i.e. document['localStorage'], etc.
                var n = "__akfp_storage_test__";
                storage.setItem(n, n);
                storage.removeItem(n);
                return true;
            } catch (error) {
                return false;
            }
        }

        function record_canvas_drawing_behavior(label) {
            var image_data_hash = false;
            try {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                context.fillStyle = "rgba(255,153,153, 0.5)";
                context.font = "18pt Tahoma";
                context.textBaseline = "top";
                context.fillText("Soft Ruddy Foothold 2", 2, 2);
                context.fillStyle = "#0000FF";
                context.fillRect(100, 25, 30, 10);
                context.fillStyle = "#E0E0E0";
                context.fillRect(100, 25, 20, 30);
                context.fillStyle = "#FF3333";
                context.fillRect(100, 25, 10, 15);
                context.fillText("!H71JCaj)]# 1@#", 4, 8);
                var image_data_url = canvas.toDataURL();
                document.createElement("img").src = image_data_url;
                image_data_hash = SHA1(image_data_url)
            } catch (error) {}

            record_result(label, image_data_hash);
        }

        function check_latest_supported_javascript_version(label) {
            /*
            this works as follows:
            - for each of the version numbers (e.g. "1.3")
                - create `<script language="JavaScript1.3">` element
                - set the script contents to `urhehlevkedkilrobacf = "1.3"`
                - append the script to <head>
            - get the current value of `urhehlevkedkilrobacf`
            - this is the latest lang="JavaScriptX.X" supported
             */
            var version_numbers = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0"],
            var result = "",
            var variable_name = "urhehlevkedkilrobacf";
            window[variable_name] = "";
            try {
                var head = document.getElementsByTagName("head")[0];
                var script_elems = [],
                for (var idx = 0; idx < t.length; idx++) {
                    var script = document.createElement("script");
                    var version = version_numbers[idx];
                    script.setAttribute("language", "JavaScript" + version);
                    if (document.currentScript && "nonce" in document.currentScript && document.currentScript["nonce"]) {
                        script.setAttribute("nonce", document.currentScript["nonce"]);
                    }
                    // urhehlevkedkilrobacf = "1.2"
                    script.text = variable_name + '="' + d + '"';
                    head.appendChild(script);
                    script_elems.push(script);
                }
                result = window[variable_name];
                for (idx = 0; idx < t.length; idx++) {
                    head.removeChild(script_elems[idx]);
                }
            } catch (error) {}
            record_result(label, result)
        }

        function record_screen_viewport_dimensions(label) {
            try {
                var t = window.innerWidth,
                var n = window.outerWidth;
                var a = window.screenX;
                var r = window.pageXOffset;
                var o = window.screen.availWidth;
                var c = window.screen.width;
                var screen_dimensions = {
                    inner: void 0 !== t ? [t, window.innerHeight] : 0,
                    outer: void 0 !== n ? [n, window.outerHeight] : 0,
                    screen: void 0 !== a ? [a, window.screenY] : 0,
                    pageOffset: void 0 !== r ? [r, window.pageYOffset] : 0,
                    avail: void 0 !== o ? [o, window.screen.availHeight] : 0,
                    size: void 0 !== c ? [c, window.screen.height] : 0,
                    client: document.body ? [document.body.clientWidth, document.body.clientHeight] : -1,
                    colorDepth: window.screen.colorDepth,
                    pixelDepth: window.screen.pixelDepth
                };
                record_result(label, JSON.stringify(screen_dimensions));
            } catch (t) {
                record_result(label, null);
            }
        }

        function record_plugins_hashcode(label) {
            var result = [],
            var plugins = get_plugins();
            if (plugins)
                for (var idx = 0; idx < plugins["length"]; idx++)
                    for (var jdx = 0; jdx < plugins[idx]["length"]; jdx++) {
                        result.push(
                            str_hashcode(
                                [
                                    plugins[idx]["name"],
                                    plugins[idx]["description"],
                                    plugins[idx]["filename"],
                                    plugins[idx][jdx]["description"],
                                    plugins[idx][jdx]["type"],
                                    plugins[idx][jdx]["suffixes"]
                                ].toString()
                            )
                        );
                    }
            record_result(label, result.toString());
        }

        function record_timestamp_with_offset(label) {
            var result = false;
            try {
                var timestamp = new Date();
                var offset_hrs = -timestamp.getTimezoneOffset() / 60;
                if (offset_hrs > 0) {
                    offset_hrs = "+" + offset_hrs;
                } else {
                    offset_hrs = "";
                }
                result = timestamp.valueOf() + offset_hrs;
            } catch (error) {}

            record_result(label, result);
        }

        function record_navigator_permissions(label) {
            var permission_status = [],
                permissions = ["geolocation", "notifications", "push", "midi", "camera", "microphone", "speaker",
                    "device-info", "background-sync", "bluetooth", "persistent-storage", "ambient-light-sensor",
                    "accelerometer", "gyroscope", "magnetometer", "clipboard", "accessibility-events",
                    "clipboard-read", "clipboard-write", "payment-handler"];
            if (!navigator.permissions) {
                record_result(label, 6);
                return;
            }
            try {
                var query_permission = function(e, n) {
                    return navigator.permissions.query({
                        name: e
                    }).then(function(e) {
                        switch (e["state"]) {
                            case "prompt":
                                t[n] = 1;
                                break;
                            case "granted":
                                t[n] = 2;
                                break;
                            case "denied":
                                t[n] = 0;
                                break;
                            default:
                                t[n] = 5
                        }
                    }).catch(function(e) {
                        t[n] = -1 !== e["message"].indexOf("is not a valid enum value of type PermissionName") ? 4 : 3
                    })
                };

                r = permissions.map(function(e, t) {
                    return query_permission(e, t)
                });
                Promise.all(r).then(function() {
                    record_result(label, t.join(""))
                });
            } catch (error) {
                record_result(label, 7)
            }
        }

        function record_window_chrome(label) {
            var result = {
                "window.chrome": window["chrome"] || "-not-existent"
            };
            record_result(label, JSON.stringify(result))
        }

    }



    function urlencode_object(e) {
        var result = "";
        for (var n in e) {
            if (e.hasOwnProperty(n)) {
                result += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]) + "&";
            }
        }
        if (result.length) {
            result = result.substr(0, result.length - 1);
        }
        return result;
    }


    function ajax_send(payload) {
        // determine hostname
        var curren_location = window.location;
        var current_origin = current_location["origin"] || current_location.protocol + "//" + current_location.hostname + (current_location.port ? ":" + current_location.port : "");
        if (window.location.origin) {
            current_origin = window.location.origin;
        }
        // make the ajax endpoint hard to find
        var obfuscated_page_identifier = "928" ^ page_identifier;
        var target_uri = "/akam/13/pixel_" + obfuscated_page_identifier.toString(16);
        // encode data and add timestamps
        var timestamp = new Date().valueOf();
        payload["timing"]["send"] = timestamp - timestamp_init;
        payload["timing"] = JSON.stringify(payload["timing"]);
        payload["z"] = JSON.stringify(payload["z"]);
        var urlencoded_data = urlencode_object(payload);
        if (!urlencoded_data) {
            urlencoded_data = "0";
        }
        // send it
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest;
        } else if (window.ActiveXObject) {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xhr) {
            xhr.open("POST", current_origin + target_uri, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            xhr.send(urlencoded_data);
        }
    }

    function measure() {
        if (!already_measured) {
            if (window.performance && window.performance.timing) {
                var timestamp_responsestart = window.performance.timing.responseStart;
            }
            timestamp_init = new Date().valueOf();  // global
            already_measured = true;
            var fingerprinter = new Fingerprinter(unknown_hash_2, unknown_hash_3),
            var counter = 0;

            fingerprinter.compute(
                function(n) {
                    function process() {
                        var timestamp = new Date().valueOf(),
                        var time_diff = timestamp - timestamp_compute;
                        counter++;
                        n["timing"][t] = timestamp - timestamp_init;

                        if (!fingerprinter.exitEarly()) {
                            if (time_diff > 500) {
                                ajax_send(n);
                            } else {
                                setTimeout(function() {
                                    fingerprinter.retry();
                                    process();
                                }, 100);
                            }
                        }
                    }
                    var timestamp_compute = new Date().valueOf();
                    n["timing"]["main"] = timestamp_responsestart ? timestamp_init - timestamp_responsestart : 0;
                    n["timing"]["compute"] = timestamp_compute - timestamp_init;
                    process();
                }
            )
        }
    }


    if (document['body']) {
        measure();
    } else {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', measure, false);
            document.addEventListener('load', measure, false);
        } else {
            if (document.attachEvent) {
                document.attachEvent('DOMContentLoaded', measure);
                document.attachEvent('onload', measure);
            }
        }
    }
})()