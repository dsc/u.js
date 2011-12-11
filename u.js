;var u = (function(_Object, _Array, _encode, _decode){

var u = (typeof exports != 'undefined' ? exports : {})

,   FN = "constructor"
,   PT = "prototype"

,   OP = _Object[PT]
,   AP = _Array[PT]
,   FP = Function[PT]

,   nativeReduce  = AP.reduce
,   nativeMap     = AP.map
,   nativeIndexOf = AP.indexOf
,   nativeBind    = FP.bind

,   toString = OP.toString
,   slice    = AP.slice
;

u.isArray = _Array.isArray || function(o){
    return toString.call(o) == '[object Array]';
};

u.reduce = function(o, fn, acc, cxt){
    if (!o) return acc;
    
    cxt = cxt || o;
    if (u.isArray(o))
        for ( var i = 0, len = o.length, v = o[0]; i < len; v = o[++i] )
            acc = fn.call(cxt, acc, v, i, o);
    else
        for ( var name in o )
            acc = fn.call(cxt, acc, o[name], name, o);
    
    return acc;
};

u.map = function(o, fn, cxt){
    if (!o) return o;
    
    var acc;
    if (u.isArray(o))
        acc = new _Array(o.length);
    else
        acc = new (o[FN] || _Object)();
    
    return u.reduce(o, function(acc, v, k, o){
        acc[k] = fn.call(this, v, k, o);
        return acc;
    }, acc, cxt);
};

u.trim = function(s){
    return s.replace(/(^\s+|\s+$)/g, '');
};

u.toKV = function(o, delimiter){
    return u.reduce(o, function(acc, v, k){
            acc.push( _encode(k) + '=' + _encode(v) );
            return acc;
        }, [])
        .join(delimiter || "&");
};

u.fromKV = function(q, delimiter){
    return u.reduce(q.split(delimiter || '&'), function(acc, pair){
            var kv = pair.split('='), k = kv[0], v = kv[1];
            if (k) acc[_decode(k)] = _decode(v);
            return acc;
        }, {});
};

// Takes any number of arguments and dumps their (k,v) pairs on A
u.extend = function(A, B){
    return u.reduce(slice.call(arguments,1), function(A, donor){
        return u.reduce(donor, function(o, v, k){
            o[k] = v;
            return o;
        }, A);
    }, A);
};

u.bind = function(fn, context){
    var args = slice.call(arguments,2);
    return function(){
        return fn.apply( context, args.concat(slice.call(arguments)) );
    };
};

u.setCookie = function(k, v, expires, path, domain, doc){
    var _document = document;
    doc        = doc || _document;
    expires    = 'expires='+(expires || 'Sun, 24-Mar-2024 11:11:11 GMT');
    path       = 'path='+(path || '/');
    domain     = 'domain='+(domain || doc.domain);
    doc.cookie = [ k+'='+_encode(v), expires, domain, path ].join('; ');
    return u.fromKV(_document.cookie, '; ');
};


// u.extend(root, u);
return u;
})(Object, Array, this.encodeURIComponent, this.decodeURIComponent);
