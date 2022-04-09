# Akam Fingerprinter Analysis

I stumbled across an interesting code snippet recently:

```html
<script >bazadebezolkohpepadr="1782718187"</script><script type="text/javascript" src="https://REDACTED/akam/13/REDACTED"  defer></script>
```

and doing a quick search for `bazadebezolkohpepadr` showed that others had stumbled across it too, and wondered what it was. Looking at the obfuscated script that always seemed to follow it. Each different website with this snippet had a different value of `bazadebezolkohpepadr`, and the obfuscated script following it appeared at first glance to be some kind of fingerprinting code. Let's see what it does!

## Behavior

This script posts its results to a back-end script listening on the same host. The URL it posts to is defined by the value of `bazadebezolkohpepadr` as follows:
```javascript
var obfuscated_page_identifier = "928" ^ bazadebezolkohpepadr;
var target_uri = "/akam/13/pixel_" + obfuscated_page_identifier.toString(16);
```
So for example, for a value of 1782718187, this script will post its results to
`/akam/13/pixel_6a421d4b`.

## Repo structure

* `0-original.js` is the file as it was found in the wild
* `1-beautified.js` is the file after being run through a JS beautifier
* `2-dereferenced.js` is the file after dereferencing the references to the obfuscated strings in the `_` variable
* `3-unobfuscated.js` is my legible rewrite of this code, with inferred variable / function names and behavioral analysis

Note the unobfuscated code won't run natively: I've removed uninteresting code that has no bearing on the actual behavior, such as a packaged implementation of sha1, base64 encoding, json encoding, and so on. It may also contain the occasional typo.