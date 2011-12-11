(function(_Object, _Array, _Function){

var _
,   FN = "constructor"
,   PT = "prototype"
,   FP = _Function[PT]

,   AP     = _Array[PT]
,   _slice = AP.slice

,   OP           = _Object[PT]
,   hasProtoProp = typeof ''.__proto__ == "object"
,   objToString  = OP.toString
,   hasOwn       = OP.hasOwnProperty
,   getget       = OP.__lookupGetter__
,   getset       = OP.__lookupSetter__
,   setget       = OP.__defineGetter__
,   setset       = OP.__defineSetter__

,   nativeForEach      = AP.forEach
,   nativeMap          = AP.map
,   nativeReduce       = AP.reduce
,   nativeReduceRight  = AP.reduceRight
,   nativeFilter       = AP.filter
,   nativeEvery        = AP.every
,   nativeSome         = AP.some
,   nativeIndexOf      = AP.indexOf
,   nativeLastIndexOf  = AP.lastIndexOf
,   nativeIsArray      = _Array.isArray
,   nativeKeys         = _Object.keys
,   nativeBind         = FP.bind
;

// JavaScript 1.6 & 1.7

if ( !AP.indexOf ) {
    AP.indexOf = function indexOf( value ){
        for ( var A = this, i = 0, L = A.length; i < L; ++i )
            if ( A[i] === value )
                return i;
        return -1;
    };
}

if ( !AP.lastIndexOf ) {
    AP.lastIndexOf = function lastIndexOf( value ){
        for ( var A = this, i = A.length-1; i >= 0; --i )
            if ( A[i] === value )
                return i;
        return -1;
    };
}


if ( !AP.map ) {
    AP.forEach = function forEach( fn, context ){
        for ( var A = this, context = context||A, i = 0, L = A.length; i < L; ++i )
            fn.call( context, A[i], i, A );
    };
    
    AP.map = function map( fn, context ){
        for ( var A = this, context = context||A, i = 0, L = A.length, r = new _Array(L); i < L; ++i )
            r[i] = fn.call( context, A[i], i, A );
        return r;
    };
    
    AP.filter = function filter( fn, context ){
        for ( var A = this, context = context||A, i = 0, L = A.length, r = [], v = A[0]; i < L; v = A[++i] )
            if ( fn.call( context, v, i, A ) )
                r.push(v);
        return r;
    };
    
    AP.every = function every( fn, context ){
        var A = this, context = context||A;
        for (var i=0, L = A.length; i<L; ++i) {
            if (i in A && !fn.call(context, A[i], i, A) )
                return false;
        }
        return true;
    }
    
    AP.some = function some( fn, context ){
        var A = this, context = context||A;
        for (var i=0, L = A.length; i<L; ++i) {
            if (i in A && fn.call(context, A[i], i, A) )
                return true;
        }
        return false;
    }
}

if ( !AP.reduce ) {
    AP.reduce = function reduce( fn, acc, context ){
        var A = this, context = context||A, i = 0, L = A.length;
        if (arguments.length < 2) { ++i; acc = A[0]; }
        for ( ; i < L; ++i )
            acc = fn.call( context, acc, A[i], i, A );
        return acc;
    }
}

if ( !_Array.isArray ) {
    _Array.isArray = function isArray(o) {
        return objToString.call(o) == '[object Array]';
    };
}

// JavaScript 1.8.5

if ( !FP.bind ) {
    FP.bind = function bind( context ){
        var fn = this
        ,   args = _slice.call(arguments,1)
        ;
        return function(){
            return fn.apply(context, args.concat( _slice.call(arguments) ));
        };
    };
}

if ( !_Object.getPrototypeOf ) {
    _Object['getPrototypeOf'] = ( hasProtoProp
            ? function getPrototypeOf(o){ return o.__proto__; }
            : function getPrototypeOf(o){ return o[FN][PT]; }
        );
}

if ( !_Object.keys ) {
    _Object['keys'] =
        function keys(o){
            var k, keys = [];
            for ( k in o )
                if (hasOwn.call(o,k)) keys.push(k);
            return keys;
        };
}

if ( !_Object.defineProperty ) {
    
    function cleanDescriptor(desc){
        if (typeof desc != "object" || desc === null)
            throw new TypeError("Property description must be an object: "+desc);
        
        var d = {}
        ,   get = desc.get, set = desc.set
        ,   hasValue = hasOwn.call(desc, 'value')
        ;
        
        if (hasOwn.call(desc, 'get') && get !== undefined) {
            if (typeof get != 'function')
                throw new TypeError("Getter must be a function: "+get);
            d.get = get;
        }
        
        if (hasOwn.call(desc, 'set') && set !== undefined) {
            if (typeof set != 'function')
                throw new TypeError("Setter must be a function: "+set);
            d.set = set;
        }
        
        if ( hasValue && (d.get || d.set) )
            throw new TypeError("Invalid property. A property cannot both have accessors and be writable or have a value: "+desc);
        
        if ( hasValue )
            d.value = desc.value;
        
        return d;
    }
    
    _Object['defineProperty'] =
        function defineProperty(o, prop, desc){
            var t = typeof o;
            if (o === null || !(t == "object" || t == "function"))
                throw new TypeError("Object.defineProperty called on non-object: "+o);
            
            desc = cleanDescriptor(desc);
            if ( 'value' in desc ) {
                delete o[prop];
                o[prop] = desc.value;
            } else {
                if ( desc.get ) setget.call(o, prop, desc.get);
                if ( desc.set ) setset.call(o, prop, desc.set);
            }
            
            return o;
        };
    
    _Object['defineProperties'] =
        function defineProperties(o, props) {
            var t = typeof o;
            if (o === null || !(t == "object" || t == "function"))
                throw new TypeError("Object.defineProperty called on non-object: "+o);
            
            props = Object(props);
            var k, descs = {};
            
            // Perform all the error checks before mutating anything
            for (k in props)
                if (hasOwn.call(props,k)) descs[k] = cleanDescriptor(props[k]);
            
            // Now we can start changing things
            for (k in descs)
                _Object.defineProperty(o, k, descs[k]);
            
            return o;
        }
    
    _Object['getOwnPropertyDescriptor'] = 
        function getOwnPropertyDescriptor(o, prop){
            var t = typeof o;
            if (o === null || !(t == "object" || t == "function"))
                throw new TypeError("Object.getOwnPropertyDescriptor called on non-object: "+o);
            
            if ( !hasOwn.call(o,prop) )
                return undefined;
            
            var getter = getget.call(o, prop)
            ,   setter = getset.call(o, prop)
            ,   desc   = { 'configurable':true, 'enumerable':true };
            
            // Data Descriptor
            if (getter === undefined && setter === undefined) {
                desc['value']    = o[prop];
                desc['writable'] = true;
            
            // Accessor Descriptor
            } else {
                if (getter) desc['get'] = getter;
                if (setter) desc['set'] = setter;
            }
            
            return desc;
        };
}

if ( !_Object.create ) {
    _Object['create'] = 
        function create(proto, props){
            if (typeof proto != 'object')
                throw new TypeError(proto+" is not an object or null");
            if (arguments.length > 1 && (props === null || typeof props != 'object'))
                throw new TypeError("value is not a non-null object");
            
            var o, AnonymousParent;
            if (hasProtoProp) {
                o = { '__proto__' : proto };
            } else {
                function AnonymousParent(){
                    this[FN] = proto[FN];
                }
                AnonymousParent[PT] = proto;
                o = new AnonymousParent();
            }
            if (props)
                _Object.defineProperties(o, props);
            return o;
        }
}

})(Object, Array, Function);
