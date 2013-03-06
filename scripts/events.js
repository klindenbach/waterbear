// Add support for event delegation on top of normal DOM events
// Minimal support for non-DOM events
// Normalized between mouse and touch events

(function(global){
    "use strict";
    var matchesSelector;
    if (document.body.matches){
        matchesSelector = function(elem, selector){ return elem.matches(selector); };
    }else if(document.body.mozMatchesSelector){
        matchesSelector = function(elem, selector){ return elem.mozMatchesSelector(selector); };
    }else if (document.body.webkitMatchesSelector){
        matchesSelector = function(elem, selector){ return elem.webkitMatchesSelector(selector); };
    }else if (document.body.msMatchesSelector){
        matchesSelector = function(elem, selector){ return elem.msMatchesSelector(selector); };
    }else if(document.body.oMatchesSelector){
        matchesSelector = function(elem, selector){ return elem.oMatchesSelector(selector); };
    }

    var  closest = function(elem, selector){
        while(elem){
            if (matchesSelector(elem, selector)){
                return elem;
            }
            elem = elem.parentElement;
        }
        return null;
    };

    var indexOf = function(elem){
        var idx = 0;
        while(elem.previousSiblingElement){
            elem = elem.previousSiblingElement;
            idx++;
        }
        return idx;
    }

    var on = function(elem, eventname, selector, handler){
        if (!elem.tagName){ console.error('first argument must be element'); }
        if (typeof eventname !== 'string'){ console.error('second argument must be eventname'); }
        if (typeof selector !== 'string'){ console.log('third argument must be selector'); }
        if (typeof handler !== 'function'){ console.flog('fourth argument must be handler'); }
        var listener = function(event){
            if (matchesSelector(event.target, selector)){
                handler(event);
            }
        };
        elem.addEventListener(eventname, listener);
        return listener;
    };

    var off = function(elem, eventname, handler){
        elem.removeEventListener(eventname, handler);
    }

    var once = function(elem, eventname, selector, handler){
        if (!elem.tagName){ console.error('first argument must be element'); }
        if (typeof eventname !== 'string'){ console.error('second argument must be eventname'); }
        if (typeof selector !== 'string'){ console.log('third argument must be selector'); }
        if (typeof handler !== 'function'){ console.flog('fourth argument must be handler'); }
        var listener = function(event){
            if (matchesSelector(event.target, selector)){
                handler(event);
                elem.removeEventListener(eventname, listener);
            }
        };
        elem.addEventListener(eventname, listener);
        return listener;
    }

    var trigger = function(elem, eventname, data){
        var evt = new CustomEvent(eventname, {detail: data});
        elem.dispatchEvent(event);
    };

    // Are touch events supported?
    var isTouch = ('ontouchstart' in global);

    // Treat mouse events and single-finger touch events similarly
    var blend = function(event){
        if (isTouch){
            if (event.touches.length > 1){
                return false;
            }
            var touch = event.touches[0];
            event.target = touch.target;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        }else{
            if (event.which !== 1){ // left mouse button
                return false;
            }
        }
        // fix target?
        return event;
    }


    global.Event = {
        on: on,
        off: off,
        once: once,
        trigger: trigger,
        isTouch: isTouch,
        blend: blend,
        matches: matchesSelector,
        closest: closest,
        indexOf: indexOf
    };
})(this);