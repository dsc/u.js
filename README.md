# u.js &mdash; minimalist utilities

`u.js` is a minimalist, functional utility library designed for embedding into another small program.

 * Collection utilities that work on both Arrays and Objects (`reduce`, `map`)
 * Copying/extending Objects
 * Binding function scope
 * Serializing and deserializing query-string KV pairs
 * Optional polyfills in `future.js` for the most important JS features 
   missing from older browsers (e.g., `Array.map()`, `Object.keys()`)

That's it.<sup><a name="fn1_link" href="#fn1">1</a></sup> `u.js` has no dependencies and works in 
any browser. The code has seen extensive production use, but the tests were part of a bigger 
project and have not yet been ported.


## Why?

`u.js` is ideal for building a **bootstrapper**. Several of my projects have been embeddable tools.
When your code is going to run in hostile territory, versioning is especially important, but it
requires some way to get your versioned code on the page in the first place: a bootstrapper.

A tiny bootstrapper gives your users the flexibility to choose a version, but gives you the power to
smooth over implementation assumptions (like changing configuration parameters, embedding-code, or
the inevitable bug pasted onto someone's page). So I needed something tiny primarily to parse
querystring values and work with collections. It had to come prior to the main program, as the
program version could be overriden by configuration!


## API

### u.reduce(o, fn, [acc], [cxt=o])

As `Array.prototype.reduce()`, but for both Object and Arrays.

Invokes `acc = fn.call(cxt, acc, v, k, o)` for each value in the collection, returning the final
value of the accumulator. For Arrays, `k` will be the index.


### u.map(o, fn, cxt=o)

As `Array.prototype.map()`, but for both Object and Arrays.

Invokes `fn.call(cxt, v, k, o)` for each value in the collection, returning a new collection with
the mapped values. (The collection will be an Object or Array based on the type of the input
collection.)


### u.extend(target, ...donors) -> target

Copies all keys from each `donor` onto the `target` object, and then returns it.


### u.bind(fn, context, ...args) -> Function

Stub for `Function.prototype.bind()`: returns a function `(...more_args)` that when invoked, 
calls the original function with the supplied context and arguments from both invocations 
concatenated together:

`fn.apply( context, args.concat(more_args) )`


### u.isArray(o) -> Boolean

Returns whether the input object is an Array; calls `Array.isArray(o)` if it exists, and a polyfill
otherwise.


### u.trim(s) -> String

Returns the string with leading and trailing whitespace removed.


### u.toKV(o, delimiter='&') -> String

Serializes an object into a string of "form-encoded" key-value pairs, applying one layer of
URL-encoding.


### u.fromKV(q, delimiter='&') -> Object

Deserializes "form-encoded" key-value pairs (removing one layer of URL-encoding), and returning an
object of their values. Note that repeated values in the serialized string will clobber each other.


### u.setCookie(k, v, [expires, [path, [domain, [doc]]]]) -> Object

Sets a cookie, returning an updated map from cookie key to value.

By default, the cookie will be set for all paths on the current domain using the current document,
expiring on a distant date:

- expires: `'Sun, 24-Mar-2024 11:11:11 GMT'`
- path: `'/'`
- domain: `doc.domain`
- doc: `window.document`



## Feedback

Open a ticket at [github](http://github.com/dsc/u.js), or send me [email](mailto:dsc@less.ly?subject=u.js).


<a name="fn1" href="#fn1_link">[1]</a>: `u.js` does not provide any DOM manipulation; check out [Zepto.js](http://zeptojs.com) if you
need to fiddle with DOM elements.

