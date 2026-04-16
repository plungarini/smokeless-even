(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(l){if(l.ep)return;l.ep=!0;const s=i(l);fetch(l.href,s)}})();var Ud={exports:{}},ko={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pp=Symbol.for("react.transitional.element"),Gp=Symbol.for("react.fragment");function jd(e,t,i){var n=null;if(i!==void 0&&(n=""+i),t.key!==void 0&&(n=""+t.key),"key"in t){i={};for(var l in t)l!=="key"&&(i[l]=t[l])}else i=t;return t=i.ref,{$$typeof:Pp,type:e,key:n,ref:t!==void 0?t:null,props:i}}ko.Fragment=Gp;ko.jsx=jd;ko.jsxs=jd;Ud.exports=ko;var Y=Ud.exports,Pd={exports:{}},Io={},Gd={exports:{}},qd={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(L,j){var P=L.length;L.push(j);t:for(;0<P;){var at=P-1>>>1,k=L[at];if(0<l(k,j))L[at]=j,L[P]=k,P=at;else break t}}function i(L){return L.length===0?null:L[0]}function n(L){if(L.length===0)return null;var j=L[0],P=L.pop();if(P!==j){L[0]=P;t:for(var at=0,k=L.length,ui=k>>>1;at<ui;){var Kt=2*(at+1)-1,Zt=L[Kt],Ve=Kt+1,Ht=L[Ve];if(0>l(Zt,P))Ve<k&&0>l(Ht,Zt)?(L[at]=Ht,L[Ve]=P,at=Ve):(L[at]=Zt,L[Kt]=P,at=Kt);else if(Ve<k&&0>l(Ht,P))L[at]=Ht,L[Ve]=P,at=Ve;else break t}}return j}function l(L,j){var P=L.sortIndex-j.sortIndex;return P!==0?P:L.id-j.id}if(e.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();e.unstable_now=function(){return a.now()-o}}var c=[],d=[],v=1,w=null,V=3,b=!1,C=!1,N=!1,D=!1,Z=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;function A(L){for(var j=i(d);j!==null;){if(j.callback===null)n(d);else if(j.startTime<=L)n(d),j.sortIndex=j.expirationTime,t(c,j);else break;j=i(d)}}function R(L){if(N=!1,A(L),!C)if(i(c)!==null)C=!0,I||(I=!0,E());else{var j=i(d);j!==null&&Ft(R,j.startTime-L)}}var I=!1,m=-1,f=5,g=-1;function M(){return D?!0:!(e.unstable_now()-g<f)}function S(){if(D=!1,I){var L=e.unstable_now();g=L;var j=!0;try{t:{C=!1,N&&(N=!1,p(m),m=-1),b=!0;var P=V;try{e:{for(A(L),w=i(c);w!==null&&!(w.expirationTime>L&&M());){var at=w.callback;if(typeof at=="function"){w.callback=null,V=w.priorityLevel;var k=at(w.expirationTime<=L);if(L=e.unstable_now(),typeof k=="function"){w.callback=k,A(L),j=!0;break e}w===i(c)&&n(c),A(L)}else n(c);w=i(c)}if(w!==null)j=!0;else{var ui=i(d);ui!==null&&Ft(R,ui.startTime-L),j=!1}}break t}finally{w=null,V=P,b=!1}j=void 0}}finally{j?E():I=!1}}}var E;if(typeof _=="function")E=function(){_(S)};else if(typeof MessageChannel<"u"){var y=new MessageChannel,Wt=y.port2;y.port1.onmessage=S,E=function(){Wt.postMessage(null)}}else E=function(){Z(S,0)};function Ft(L,j){m=Z(function(){L(e.unstable_now())},j)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(L){L.callback=null},e.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):f=0<L?Math.floor(1e3/L):5},e.unstable_getCurrentPriorityLevel=function(){return V},e.unstable_next=function(L){switch(V){case 1:case 2:case 3:var j=3;break;default:j=V}var P=V;V=j;try{return L()}finally{V=P}},e.unstable_requestPaint=function(){D=!0},e.unstable_runWithPriority=function(L,j){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var P=V;V=L;try{return j()}finally{V=P}},e.unstable_scheduleCallback=function(L,j,P){var at=e.unstable_now();switch(typeof P=="object"&&P!==null?(P=P.delay,P=typeof P=="number"&&0<P?at+P:at):P=at,L){case 1:var k=-1;break;case 2:k=250;break;case 5:k=1073741823;break;case 4:k=1e4;break;default:k=5e3}return k=P+k,L={id:v++,callback:j,priorityLevel:L,startTime:P,expirationTime:k,sortIndex:-1},P>at?(L.sortIndex=P,t(d,L),i(c)===null&&L===i(d)&&(N?(p(m),m=-1):N=!0,Ft(R,P-at))):(L.sortIndex=k,t(c,L),C||b||(C=!0,I||(I=!0,E()))),L},e.unstable_shouldYield=M,e.unstable_wrapCallback=function(L){var j=V;return function(){var P=V;V=j;try{return L.apply(this,arguments)}finally{V=P}}}})(qd);Gd.exports=qd;var qp=Gd.exports,Yd={exports:{}},X={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xc=Symbol.for("react.transitional.element"),Yp=Symbol.for("react.portal"),Xp=Symbol.for("react.fragment"),Fp=Symbol.for("react.strict_mode"),Kp=Symbol.for("react.profiler"),Qp=Symbol.for("react.consumer"),Jp=Symbol.for("react.context"),$p=Symbol.for("react.forward_ref"),Wp=Symbol.for("react.suspense"),tm=Symbol.for("react.memo"),Xd=Symbol.for("react.lazy"),em=Symbol.for("react.activity"),nf=Symbol.iterator;function im(e){return e===null||typeof e!="object"?null:(e=nf&&e[nf]||e["@@iterator"],typeof e=="function"?e:null)}var Fd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Kd=Object.assign,Qd={};function as(e,t,i){this.props=e,this.context=t,this.refs=Qd,this.updater=i||Fd}as.prototype.isReactComponent={};as.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};as.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Jd(){}Jd.prototype=as.prototype;function Cc(e,t,i){this.props=e,this.context=t,this.refs=Qd,this.updater=i||Fd}var Oc=Cc.prototype=new Jd;Oc.constructor=Cc;Kd(Oc,as.prototype);Oc.isPureReactComponent=!0;var lf=Array.isArray;function y2(){}var Mt={H:null,A:null,T:null,S:null},$d=Object.prototype.hasOwnProperty;function Nc(e,t,i){var n=i.ref;return{$$typeof:xc,type:e,key:t,ref:n!==void 0?n:null,props:i}}function nm(e,t){return Nc(e.type,t,e.props)}function Rc(e){return typeof e=="object"&&e!==null&&e.$$typeof===xc}function lm(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(i){return t[i]})}var sf=/\/+/g;function Au(e,t){return typeof e=="object"&&e!==null&&e.key!=null?lm(""+e.key):t.toString(36)}function sm(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(y2,y2):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function yl(e,t,i,n,l){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(s){case"bigint":case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case xc:case Yp:a=!0;break;case Xd:return a=e._init,yl(a(e._payload),t,i,n,l)}}if(a)return l=l(e),a=n===""?"."+Au(e,0):n,lf(l)?(i="",a!=null&&(i=a.replace(sf,"$&/")+"/"),yl(l,t,i,"",function(d){return d})):l!=null&&(Rc(l)&&(l=nm(l,i+(l.key==null||e&&e.key===l.key?"":(""+l.key).replace(sf,"$&/")+"/")+a)),t.push(l)),1;a=0;var o=n===""?".":n+":";if(lf(e))for(var c=0;c<e.length;c++)n=e[c],s=o+Au(n,c),a+=yl(n,t,i,s,l);else if(c=im(e),typeof c=="function")for(e=c.call(e),c=0;!(n=e.next()).done;)n=n.value,s=o+Au(n,c++),a+=yl(n,t,i,s,l);else if(s==="object"){if(typeof e.then=="function")return yl(sm(e),t,i,n,l);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return a}function oa(e,t,i){if(e==null)return e;var n=[],l=0;return yl(e,n,"","",function(s){return t.call(i,s,l++)}),n}function rm(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(i){(e._status===0||e._status===-1)&&(e._status=1,e._result=i)},function(i){(e._status===0||e._status===-1)&&(e._status=2,e._result=i)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var rf=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},am={map:oa,forEach:function(e,t,i){oa(e,function(){t.apply(this,arguments)},i)},count:function(e){var t=0;return oa(e,function(){t++}),t},toArray:function(e){return oa(e,function(t){return t})||[]},only:function(e){if(!Rc(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};X.Activity=em;X.Children=am;X.Component=as;X.Fragment=Xp;X.Profiler=Kp;X.PureComponent=Cc;X.StrictMode=Fp;X.Suspense=Wp;X.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Mt;X.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Mt.H.useMemoCache(e)}};X.cache=function(e){return function(){return e.apply(null,arguments)}};X.cacheSignal=function(){return null};X.cloneElement=function(e,t,i){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var n=Kd({},e.props),l=e.key;if(t!=null)for(s in t.key!==void 0&&(l=""+t.key),t)!$d.call(t,s)||s==="key"||s==="__self"||s==="__source"||s==="ref"&&t.ref===void 0||(n[s]=t[s]);var s=arguments.length-2;if(s===1)n.children=i;else if(1<s){for(var a=Array(s),o=0;o<s;o++)a[o]=arguments[o+2];n.children=a}return Nc(e.type,l,n)};X.createContext=function(e){return e={$$typeof:Jp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:Qp,_context:e},e};X.createElement=function(e,t,i){var n,l={},s=null;if(t!=null)for(n in t.key!==void 0&&(s=""+t.key),t)$d.call(t,n)&&n!=="key"&&n!=="__self"&&n!=="__source"&&(l[n]=t[n]);var a=arguments.length-2;if(a===1)l.children=i;else if(1<a){for(var o=Array(a),c=0;c<a;c++)o[c]=arguments[c+2];l.children=o}if(e&&e.defaultProps)for(n in a=e.defaultProps,a)l[n]===void 0&&(l[n]=a[n]);return Nc(e,s,l)};X.createRef=function(){return{current:null}};X.forwardRef=function(e){return{$$typeof:$p,render:e}};X.isValidElement=Rc;X.lazy=function(e){return{$$typeof:Xd,_payload:{_status:-1,_result:e},_init:rm}};X.memo=function(e,t){return{$$typeof:tm,type:e,compare:t===void 0?null:t}};X.startTransition=function(e){var t=Mt.T,i={};Mt.T=i;try{var n=e(),l=Mt.S;l!==null&&l(i,n),typeof n=="object"&&n!==null&&typeof n.then=="function"&&n.then(y2,rf)}catch(s){rf(s)}finally{t!==null&&i.types!==null&&(t.types=i.types),Mt.T=t}};X.unstable_useCacheRefresh=function(){return Mt.H.useCacheRefresh()};X.use=function(e){return Mt.H.use(e)};X.useActionState=function(e,t,i){return Mt.H.useActionState(e,t,i)};X.useCallback=function(e,t){return Mt.H.useCallback(e,t)};X.useContext=function(e){return Mt.H.useContext(e)};X.useDebugValue=function(){};X.useDeferredValue=function(e,t){return Mt.H.useDeferredValue(e,t)};X.useEffect=function(e,t){return Mt.H.useEffect(e,t)};X.useEffectEvent=function(e){return Mt.H.useEffectEvent(e)};X.useId=function(){return Mt.H.useId()};X.useImperativeHandle=function(e,t,i){return Mt.H.useImperativeHandle(e,t,i)};X.useInsertionEffect=function(e,t){return Mt.H.useInsertionEffect(e,t)};X.useLayoutEffect=function(e,t){return Mt.H.useLayoutEffect(e,t)};X.useMemo=function(e,t){return Mt.H.useMemo(e,t)};X.useOptimistic=function(e,t){return Mt.H.useOptimistic(e,t)};X.useReducer=function(e,t,i){return Mt.H.useReducer(e,t,i)};X.useRef=function(e){return Mt.H.useRef(e)};X.useState=function(e){return Mt.H.useState(e)};X.useSyncExternalStore=function(e,t,i){return Mt.H.useSyncExternalStore(e,t,i)};X.useTransition=function(){return Mt.H.useTransition()};X.version="19.2.4";Yd.exports=X;var Vt=Yd.exports,Wd={exports:{}},re={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var om=Vt;function tH(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)t+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function qi(){}var le={d:{f:qi,r:function(){throw Error(tH(522))},D:qi,C:qi,L:qi,m:qi,X:qi,S:qi,M:qi},p:0,findDOMNode:null},um=Symbol.for("react.portal");function cm(e,t,i){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:um,key:n==null?null:""+n,children:e,containerInfo:t,implementation:i}}var Gs=om.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function zo(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}re.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=le;re.createPortal=function(e,t){var i=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(tH(299));return cm(e,t,null,i)};re.flushSync=function(e){var t=Gs.T,i=le.p;try{if(Gs.T=null,le.p=2,e)return e()}finally{Gs.T=t,le.p=i,le.d.f()}};re.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,le.d.C(e,t))};re.prefetchDNS=function(e){typeof e=="string"&&le.d.D(e)};re.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var i=t.as,n=zo(i,t.crossOrigin),l=typeof t.integrity=="string"?t.integrity:void 0,s=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;i==="style"?le.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:n,integrity:l,fetchPriority:s}):i==="script"&&le.d.X(e,{crossOrigin:n,integrity:l,fetchPriority:s,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};re.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var i=zo(t.as,t.crossOrigin);le.d.M(e,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&le.d.M(e)};re.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var i=t.as,n=zo(i,t.crossOrigin);le.d.L(e,i,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};re.preloadModule=function(e,t){if(typeof e=="string")if(t){var i=zo(t.as,t.crossOrigin);le.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else le.d.m(e)};re.requestFormReset=function(e){le.d.r(e)};re.unstable_batchedUpdates=function(e,t){return e(t)};re.useFormState=function(e,t,i){return Gs.H.useFormState(e,t,i)};re.useFormStatus=function(){return Gs.H.useHostTransitionStatus()};re.version="19.2.4";function eH(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(eH)}catch(e){console.error(e)}}eH(),Wd.exports=re;var hm=Wd.exports;/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Lt=qp,iH=Vt,fm=hm;function O(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)t+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function nH(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Tr(e){var t=e,i=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(i=t.return),e=t.return;while(e)}return t.tag===3?i:null}function lH(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function sH(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function af(e){if(Tr(e)!==e)throw Error(O(188))}function dm(e){var t=e.alternate;if(!t){if(t=Tr(e),t===null)throw Error(O(188));return t!==e?null:e}for(var i=e,n=t;;){var l=i.return;if(l===null)break;var s=l.alternate;if(s===null){if(n=l.return,n!==null){i=n;continue}break}if(l.child===s.child){for(s=l.child;s;){if(s===i)return af(l),e;if(s===n)return af(l),t;s=s.sibling}throw Error(O(188))}if(i.return!==n.return)i=l,n=s;else{for(var a=!1,o=l.child;o;){if(o===i){a=!0,i=l,n=s;break}if(o===n){a=!0,n=l,i=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===i){a=!0,i=s,n=l;break}if(o===n){a=!0,n=s,i=l;break}o=o.sibling}if(!a)throw Error(O(189))}}if(i.alternate!==n)throw Error(O(190))}if(i.tag!==3)throw Error(O(188));return i.stateNode.current===i?e:t}function rH(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=rH(e),t!==null)return t;e=e.sibling}return null}var yt=Object.assign,Hm=Symbol.for("react.element"),ua=Symbol.for("react.transitional.element"),Is=Symbol.for("react.portal"),_l=Symbol.for("react.fragment"),aH=Symbol.for("react.strict_mode"),w2=Symbol.for("react.profiler"),oH=Symbol.for("react.consumer"),_i=Symbol.for("react.context"),Bc=Symbol.for("react.forward_ref"),Z2=Symbol.for("react.suspense"),_2=Symbol.for("react.suspense_list"),Dc=Symbol.for("react.memo"),Ki=Symbol.for("react.lazy"),b2=Symbol.for("react.activity"),Vm=Symbol.for("react.memo_cache_sentinel"),of=Symbol.iterator;function Cs(e){return e===null||typeof e!="object"?null:(e=of&&e[of]||e["@@iterator"],typeof e=="function"?e:null)}var gm=Symbol.for("react.client.reference");function S2(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===gm?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case _l:return"Fragment";case w2:return"Profiler";case aH:return"StrictMode";case Z2:return"Suspense";case _2:return"SuspenseList";case b2:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Is:return"Portal";case _i:return e.displayName||"Context";case oH:return(e._context.displayName||"Context")+".Consumer";case Bc:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Dc:return t=e.displayName||null,t!==null?t:S2(e.type)||"Memo";case Ki:t=e._payload,e=e._init;try{return S2(e(t))}catch{}}return null}var zs=Array.isArray,G=iH.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,st=fm.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Yn={pending:!1,data:null,method:null,action:null},E2=[],bl=-1;function ri(e){return{current:e}}function zt(e){0>bl||(e.current=E2[bl],E2[bl]=null,bl--)}function gt(e,t){bl++,E2[bl]=e.current,e.current=t}var ii=ri(null),ur=ri(null),cn=ri(null),Qa=ri(null);function Ja(e,t){switch(gt(cn,t),gt(ur,e),gt(ii,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?H0(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=H0(t),e=Tg(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}zt(ii),gt(ii,e)}function Xl(){zt(ii),zt(ur),zt(cn)}function T2(e){e.memoizedState!==null&&gt(Qa,e);var t=ii.current,i=Tg(t,e.type);t!==i&&(gt(ur,e),gt(ii,i))}function $a(e){ur.current===e&&(zt(ii),zt(ur)),Qa.current===e&&(zt(Qa),Mr._currentValue=Yn)}var xu,uf;function kn(e){if(xu===void 0)try{throw Error()}catch(i){var t=i.stack.trim().match(/\n( *(at )?)/);xu=t&&t[1]||"",uf=-1<i.stack.indexOf(`
    at`)?" (<anonymous>)":-1<i.stack.indexOf("@")?"@unknown:0:0":""}return`
`+xu+e+uf}var Cu=!1;function Ou(e,t){if(!e||Cu)return"";Cu=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var n={DetermineComponentFrameRoot:function(){try{if(t){var w=function(){throw Error()};if(Object.defineProperty(w.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(w,[])}catch(b){var V=b}Reflect.construct(e,[],w)}else{try{w.call()}catch(b){V=b}e.call(w.prototype)}}else{try{throw Error()}catch(b){V=b}(w=e())&&typeof w.catch=="function"&&w.catch(function(){})}}catch(b){if(b&&V&&typeof b.stack=="string")return[b.stack,V.stack]}return[null,null]}};n.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var l=Object.getOwnPropertyDescriptor(n.DetermineComponentFrameRoot,"name");l&&l.configurable&&Object.defineProperty(n.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var s=n.DetermineComponentFrameRoot(),a=s[0],o=s[1];if(a&&o){var c=a.split(`
`),d=o.split(`
`);for(l=n=0;n<c.length&&!c[n].includes("DetermineComponentFrameRoot");)n++;for(;l<d.length&&!d[l].includes("DetermineComponentFrameRoot");)l++;if(n===c.length||l===d.length)for(n=c.length-1,l=d.length-1;1<=n&&0<=l&&c[n]!==d[l];)l--;for(;1<=n&&0<=l;n--,l--)if(c[n]!==d[l]){if(n!==1||l!==1)do if(n--,l--,0>l||c[n]!==d[l]){var v=`
`+c[n].replace(" at new "," at ");return e.displayName&&v.includes("<anonymous>")&&(v=v.replace("<anonymous>",e.displayName)),v}while(1<=n&&0<=l);break}}}finally{Cu=!1,Error.prepareStackTrace=i}return(i=e?e.displayName||e.name:"")?kn(i):""}function pm(e,t){switch(e.tag){case 26:case 27:case 5:return kn(e.type);case 16:return kn("Lazy");case 13:return e.child!==t&&t!==null?kn("Suspense Fallback"):kn("Suspense");case 19:return kn("SuspenseList");case 0:case 15:return Ou(e.type,!1);case 11:return Ou(e.type.render,!1);case 1:return Ou(e.type,!0);case 31:return kn("Activity");default:return""}}function cf(e){try{var t="",i=null;do t+=pm(e,i),i=e,e=e.return;while(e);return t}catch(n){return`
Error generating stack: `+n.message+`
`+n.stack}}var A2=Object.prototype.hasOwnProperty,Lc=Lt.unstable_scheduleCallback,Nu=Lt.unstable_cancelCallback,mm=Lt.unstable_shouldYield,vm=Lt.unstable_requestPaint,ye=Lt.unstable_now,Mm=Lt.unstable_getCurrentPriorityLevel,uH=Lt.unstable_ImmediatePriority,cH=Lt.unstable_UserBlockingPriority,Wa=Lt.unstable_NormalPriority,ym=Lt.unstable_LowPriority,hH=Lt.unstable_IdlePriority,wm=Lt.log,Zm=Lt.unstable_setDisableYieldValue,Ar=null,we=null;function sn(e){if(typeof wm=="function"&&Zm(e),we&&typeof we.setStrictMode=="function")try{we.setStrictMode(Ar,e)}catch{}}var Ze=Math.clz32?Math.clz32:Sm,_m=Math.log,bm=Math.LN2;function Sm(e){return e>>>=0,e===0?32:31-(_m(e)/bm|0)|0}var ca=256,ha=262144,fa=4194304;function In(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Uo(e,t,i){var n=e.pendingLanes;if(n===0)return 0;var l=0,s=e.suspendedLanes,a=e.pingedLanes;e=e.warmLanes;var o=n&134217727;return o!==0?(n=o&~s,n!==0?l=In(n):(a&=o,a!==0?l=In(a):i||(i=o&~e,i!==0&&(l=In(i))))):(o=n&~s,o!==0?l=In(o):a!==0?l=In(a):i||(i=n&~e,i!==0&&(l=In(i)))),l===0?0:t!==0&&t!==l&&!(t&s)&&(s=l&-l,i=t&-t,s>=i||s===32&&(i&4194048)!==0)?t:l}function xr(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Em(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function fH(){var e=fa;return fa<<=1,!(fa&62914560)&&(fa=4194304),e}function Ru(e){for(var t=[],i=0;31>i;i++)t.push(e);return t}function Cr(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Tm(e,t,i,n,l,s){var a=e.pendingLanes;e.pendingLanes=i,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=i,e.entangledLanes&=i,e.errorRecoveryDisabledLanes&=i,e.shellSuspendCounter=0;var o=e.entanglements,c=e.expirationTimes,d=e.hiddenUpdates;for(i=a&~i;0<i;){var v=31-Ze(i),w=1<<v;o[v]=0,c[v]=-1;var V=d[v];if(V!==null)for(d[v]=null,v=0;v<V.length;v++){var b=V[v];b!==null&&(b.lane&=-536870913)}i&=~w}n!==0&&dH(e,n,0),s!==0&&l===0&&e.tag!==0&&(e.suspendedLanes|=s&~(a&~t))}function dH(e,t,i){e.pendingLanes|=t,e.suspendedLanes&=~t;var n=31-Ze(t);e.entangledLanes|=t,e.entanglements[n]=e.entanglements[n]|1073741824|i&261930}function HH(e,t){var i=e.entangledLanes|=t;for(e=e.entanglements;i;){var n=31-Ze(i),l=1<<n;l&t|e[n]&t&&(e[n]|=t),i&=~l}}function VH(e,t){var i=t&-t;return i=i&42?1:kc(i),i&(e.suspendedLanes|t)?0:i}function kc(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ic(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function gH(){var e=st.p;return e!==0?e:(e=window.event,e===void 0?32:Ig(e.type))}function hf(e,t){var i=st.p;try{return st.p=e,t()}finally{st.p=i}}var Tn=Math.random().toString(36).slice(2),Gt="__reactFiber$"+Tn,de="__reactProps$"+Tn,os="__reactContainer$"+Tn,x2="__reactEvents$"+Tn,Am="__reactListeners$"+Tn,xm="__reactHandles$"+Tn,ff="__reactResources$"+Tn,Or="__reactMarker$"+Tn;function zc(e){delete e[Gt],delete e[de],delete e[x2],delete e[Am],delete e[xm]}function Sl(e){var t=e[Gt];if(t)return t;for(var i=e.parentNode;i;){if(t=i[os]||i[Gt]){if(i=t.alternate,t.child!==null||i!==null&&i.child!==null)for(e=v0(e);e!==null;){if(i=e[Gt])return i;e=v0(e)}return t}e=i,i=e.parentNode}return null}function us(e){if(e=e[Gt]||e[os]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Us(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(O(33))}function Dl(e){var t=e[ff];return t||(t=e[ff]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function It(e){e[Or]=!0}var pH=new Set,mH={};function al(e,t){Fl(e,t),Fl(e+"Capture",t)}function Fl(e,t){for(mH[e]=t,e=0;e<t.length;e++)pH.add(t[e])}var Cm=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),df={},Hf={};function Om(e){return A2.call(Hf,e)?!0:A2.call(df,e)?!1:Cm.test(e)?Hf[e]=!0:(df[e]=!0,!1)}function xa(e,t,i){if(Om(t))if(i===null)e.removeAttribute(t);else{switch(typeof i){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var n=t.toLowerCase().slice(0,5);if(n!=="data-"&&n!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+i)}}function da(e,t,i){if(i===null)e.removeAttribute(t);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+i)}}function Hi(e,t,i,n){if(n===null)e.removeAttribute(i);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(i);return}e.setAttributeNS(t,i,""+n)}}function xe(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function vH(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Nm(e,t,i){var n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function C2(e){if(!e._valueTracker){var t=vH(e)?"checked":"value";e._valueTracker=Nm(e,t,""+e[t])}}function MH(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var i=t.getValue(),n="";return e&&(n=vH(e)?e.checked?"true":"false":e.value),e=n,e!==i?(t.setValue(e),!0):!1}function to(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Rm=/[\n"\\]/g;function Ne(e){return e.replace(Rm,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function O2(e,t,i,n,l,s,a,o){e.name="",a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"?e.type=a:e.removeAttribute("type"),t!=null?a==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+xe(t)):e.value!==""+xe(t)&&(e.value=""+xe(t)):a!=="submit"&&a!=="reset"||e.removeAttribute("value"),t!=null?N2(e,a,xe(t)):i!=null?N2(e,a,xe(i)):n!=null&&e.removeAttribute("value"),l==null&&s!=null&&(e.defaultChecked=!!s),l!=null&&(e.checked=l&&typeof l!="function"&&typeof l!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+xe(o):e.removeAttribute("name")}function yH(e,t,i,n,l,s,a,o){if(s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(e.type=s),t!=null||i!=null){if(!(s!=="submit"&&s!=="reset"||t!=null)){C2(e);return}i=i!=null?""+xe(i):"",t=t!=null?""+xe(t):i,o||t===e.value||(e.value=t),e.defaultValue=t}n=n??l,n=typeof n!="function"&&typeof n!="symbol"&&!!n,e.checked=o?e.checked:!!n,e.defaultChecked=!!n,a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.name=a),C2(e)}function N2(e,t,i){t==="number"&&to(e.ownerDocument)===e||e.defaultValue===""+i||(e.defaultValue=""+i)}function Ll(e,t,i,n){if(e=e.options,t){t={};for(var l=0;l<i.length;l++)t["$"+i[l]]=!0;for(i=0;i<e.length;i++)l=t.hasOwnProperty("$"+e[i].value),e[i].selected!==l&&(e[i].selected=l),l&&n&&(e[i].defaultSelected=!0)}else{for(i=""+xe(i),t=null,l=0;l<e.length;l++){if(e[l].value===i){e[l].selected=!0,n&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function wH(e,t,i){if(t!=null&&(t=""+xe(t),t!==e.value&&(e.value=t),i==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=i!=null?""+xe(i):""}function ZH(e,t,i,n){if(t==null){if(n!=null){if(i!=null)throw Error(O(92));if(zs(n)){if(1<n.length)throw Error(O(93));n=n[0]}i=n}i==null&&(i=""),t=i}i=xe(t),e.defaultValue=i,n=e.textContent,n===i&&n!==""&&n!==null&&(e.value=n),C2(e)}function Kl(e,t){if(t){var i=e.firstChild;if(i&&i===e.lastChild&&i.nodeType===3){i.nodeValue=t;return}}e.textContent=t}var Bm=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Vf(e,t,i){var n=t.indexOf("--")===0;i==null||typeof i=="boolean"||i===""?n?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":n?e.setProperty(t,i):typeof i!="number"||i===0||Bm.has(t)?t==="float"?e.cssFloat=i:e[t]=(""+i).trim():e[t]=i+"px"}function _H(e,t,i){if(t!=null&&typeof t!="object")throw Error(O(62));if(e=e.style,i!=null){for(var n in i)!i.hasOwnProperty(n)||t!=null&&t.hasOwnProperty(n)||(n.indexOf("--")===0?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="");for(var l in t)n=t[l],t.hasOwnProperty(l)&&i[l]!==n&&Vf(e,l,n)}else for(var s in t)t.hasOwnProperty(s)&&Vf(e,s,t[s])}function Uc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Dm=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Lm=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ca(e){return Lm.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function bi(){}var R2=null;function jc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var El=null,kl=null;function gf(e){var t=us(e);if(t&&(e=t.stateNode)){var i=e[de]||null;t:switch(e=t.stateNode,t.type){case"input":if(O2(e,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name),t=i.name,i.type==="radio"&&t!=null){for(i=e;i.parentNode;)i=i.parentNode;for(i=i.querySelectorAll('input[name="'+Ne(""+t)+'"][type="radio"]'),t=0;t<i.length;t++){var n=i[t];if(n!==e&&n.form===e.form){var l=n[de]||null;if(!l)throw Error(O(90));O2(n,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name)}}for(t=0;t<i.length;t++)n=i[t],n.form===e.form&&MH(n)}break t;case"textarea":wH(e,i.value,i.defaultValue);break t;case"select":t=i.value,t!=null&&Ll(e,!!i.multiple,t,!1)}}}var Bu=!1;function bH(e,t,i){if(Bu)return e(t,i);Bu=!0;try{var n=e(t);return n}finally{if(Bu=!1,(El!==null||kl!==null)&&(Wo(),El&&(t=El,e=kl,kl=El=null,gf(t),e)))for(t=0;t<e.length;t++)gf(e[t])}}function cr(e,t){var i=e.stateNode;if(i===null)return null;var n=i[de]||null;if(n===null)return null;i=n[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break t;default:e=!1}if(e)return null;if(i&&typeof i!="function")throw Error(O(231,t,typeof i));return i}var Oi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),B2=!1;if(Oi)try{var Os={};Object.defineProperty(Os,"passive",{get:function(){B2=!0}}),window.addEventListener("test",Os,Os),window.removeEventListener("test",Os,Os)}catch{B2=!1}var rn=null,Pc=null,Oa=null;function SH(){if(Oa)return Oa;var e,t=Pc,i=t.length,n,l="value"in rn?rn.value:rn.textContent,s=l.length;for(e=0;e<i&&t[e]===l[e];e++);var a=i-e;for(n=1;n<=a&&t[i-n]===l[s-n];n++);return Oa=l.slice(e,1<n?1-n:void 0)}function Na(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ha(){return!0}function pf(){return!1}function He(e){function t(i,n,l,s,a){this._reactName=i,this._targetInst=l,this.type=n,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(i=e[o],this[o]=i?i(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ha:pf,this.isPropagationStopped=pf,this}return yt(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var i=this.nativeEvent;i&&(i.preventDefault?i.preventDefault():typeof i.returnValue!="unknown"&&(i.returnValue=!1),this.isDefaultPrevented=Ha)},stopPropagation:function(){var i=this.nativeEvent;i&&(i.stopPropagation?i.stopPropagation():typeof i.cancelBubble!="unknown"&&(i.cancelBubble=!0),this.isPropagationStopped=Ha)},persist:function(){},isPersistent:Ha}),t}var ol={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},jo=He(ol),Nr=yt({},ol,{view:0,detail:0}),km=He(Nr),Du,Lu,Ns,Po=yt({},Nr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ns&&(Ns&&e.type==="mousemove"?(Du=e.screenX-Ns.screenX,Lu=e.screenY-Ns.screenY):Lu=Du=0,Ns=e),Du)},movementY:function(e){return"movementY"in e?e.movementY:Lu}}),mf=He(Po),Im=yt({},Po,{dataTransfer:0}),zm=He(Im),Um=yt({},Nr,{relatedTarget:0}),ku=He(Um),jm=yt({},ol,{animationName:0,elapsedTime:0,pseudoElement:0}),Pm=He(jm),Gm=yt({},ol,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),qm=He(Gm),Ym=yt({},ol,{data:0}),vf=He(Ym),Xm={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Fm={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Km={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Qm(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Km[e])?!!t[e]:!1}function Gc(){return Qm}var Jm=yt({},Nr,{key:function(e){if(e.key){var t=Xm[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Na(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Fm[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gc,charCode:function(e){return e.type==="keypress"?Na(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Na(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),$m=He(Jm),Wm=yt({},Po,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Mf=He(Wm),tv=yt({},Nr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gc}),ev=He(tv),iv=yt({},ol,{propertyName:0,elapsedTime:0,pseudoElement:0}),nv=He(iv),lv=yt({},Po,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sv=He(lv),rv=yt({},ol,{newState:0,oldState:0}),av=He(rv),ov=[9,13,27,32],qc=Oi&&"CompositionEvent"in window,qs=null;Oi&&"documentMode"in document&&(qs=document.documentMode);var uv=Oi&&"TextEvent"in window&&!qs,EH=Oi&&(!qc||qs&&8<qs&&11>=qs),yf=" ",wf=!1;function TH(e,t){switch(e){case"keyup":return ov.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function AH(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Tl=!1;function cv(e,t){switch(e){case"compositionend":return AH(t);case"keypress":return t.which!==32?null:(wf=!0,yf);case"textInput":return e=t.data,e===yf&&wf?null:e;default:return null}}function hv(e,t){if(Tl)return e==="compositionend"||!qc&&TH(e,t)?(e=SH(),Oa=Pc=rn=null,Tl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return EH&&t.locale!=="ko"?null:t.data;default:return null}}var fv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zf(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!fv[e.type]:t==="textarea"}function xH(e,t,i,n){El?kl?kl.push(n):kl=[n]:El=n,t=vo(t,"onChange"),0<t.length&&(i=new jo("onChange","change",null,i,n),e.push({event:i,listeners:t}))}var Ys=null,hr=null;function dv(e){bg(e,0)}function Go(e){var t=Us(e);if(MH(t))return e}function _f(e,t){if(e==="change")return t}var CH=!1;if(Oi){var Iu;if(Oi){var zu="oninput"in document;if(!zu){var bf=document.createElement("div");bf.setAttribute("oninput","return;"),zu=typeof bf.oninput=="function"}Iu=zu}else Iu=!1;CH=Iu&&(!document.documentMode||9<document.documentMode)}function Sf(){Ys&&(Ys.detachEvent("onpropertychange",OH),hr=Ys=null)}function OH(e){if(e.propertyName==="value"&&Go(hr)){var t=[];xH(t,hr,e,jc(e)),bH(dv,t)}}function Hv(e,t,i){e==="focusin"?(Sf(),Ys=t,hr=i,Ys.attachEvent("onpropertychange",OH)):e==="focusout"&&Sf()}function Vv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Go(hr)}function gv(e,t){if(e==="click")return Go(t)}function pv(e,t){if(e==="input"||e==="change")return Go(t)}function mv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var be=typeof Object.is=="function"?Object.is:mv;function fr(e,t){if(be(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var i=Object.keys(e),n=Object.keys(t);if(i.length!==n.length)return!1;for(n=0;n<i.length;n++){var l=i[n];if(!A2.call(t,l)||!be(e[l],t[l]))return!1}return!0}function Ef(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Tf(e,t){var i=Ef(e);e=0;for(var n;i;){if(i.nodeType===3){if(n=e+i.textContent.length,e<=t&&n>=t)return{node:i,offset:t-e};e=n}t:{for(;i;){if(i.nextSibling){i=i.nextSibling;break t}i=i.parentNode}i=void 0}i=Ef(i)}}function NH(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?NH(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function RH(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=to(e.document);t instanceof e.HTMLIFrameElement;){try{var i=typeof t.contentWindow.location.href=="string"}catch{i=!1}if(i)e=t.contentWindow;else break;t=to(e.document)}return t}function Yc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var vv=Oi&&"documentMode"in document&&11>=document.documentMode,Al=null,D2=null,Xs=null,L2=!1;function Af(e,t,i){var n=i.window===i?i.document:i.nodeType===9?i:i.ownerDocument;L2||Al==null||Al!==to(n)||(n=Al,"selectionStart"in n&&Yc(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),Xs&&fr(Xs,n)||(Xs=n,n=vo(D2,"onSelect"),0<n.length&&(t=new jo("onSelect","select",null,t,i),e.push({event:t,listeners:n}),t.target=Al)))}function Dn(e,t){var i={};return i[e.toLowerCase()]=t.toLowerCase(),i["Webkit"+e]="webkit"+t,i["Moz"+e]="moz"+t,i}var xl={animationend:Dn("Animation","AnimationEnd"),animationiteration:Dn("Animation","AnimationIteration"),animationstart:Dn("Animation","AnimationStart"),transitionrun:Dn("Transition","TransitionRun"),transitionstart:Dn("Transition","TransitionStart"),transitioncancel:Dn("Transition","TransitionCancel"),transitionend:Dn("Transition","TransitionEnd")},Uu={},BH={};Oi&&(BH=document.createElement("div").style,"AnimationEvent"in window||(delete xl.animationend.animation,delete xl.animationiteration.animation,delete xl.animationstart.animation),"TransitionEvent"in window||delete xl.transitionend.transition);function ul(e){if(Uu[e])return Uu[e];if(!xl[e])return e;var t=xl[e],i;for(i in t)if(t.hasOwnProperty(i)&&i in BH)return Uu[e]=t[i];return e}var DH=ul("animationend"),LH=ul("animationiteration"),kH=ul("animationstart"),Mv=ul("transitionrun"),yv=ul("transitionstart"),wv=ul("transitioncancel"),IH=ul("transitionend"),zH=new Map,k2="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");k2.push("scrollEnd");function Fe(e,t){zH.set(e,t),al(t,[e])}var eo=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ae=[],Cl=0,Xc=0;function qo(){for(var e=Cl,t=Xc=Cl=0;t<e;){var i=Ae[t];Ae[t++]=null;var n=Ae[t];Ae[t++]=null;var l=Ae[t];Ae[t++]=null;var s=Ae[t];if(Ae[t++]=null,n!==null&&l!==null){var a=n.pending;a===null?l.next=l:(l.next=a.next,a.next=l),n.pending=l}s!==0&&UH(i,l,s)}}function Yo(e,t,i,n){Ae[Cl++]=e,Ae[Cl++]=t,Ae[Cl++]=i,Ae[Cl++]=n,Xc|=n,e.lanes|=n,e=e.alternate,e!==null&&(e.lanes|=n)}function Fc(e,t,i,n){return Yo(e,t,i,n),io(e)}function cl(e,t){return Yo(e,null,null,t),io(e)}function UH(e,t,i){e.lanes|=i;var n=e.alternate;n!==null&&(n.lanes|=i);for(var l=!1,s=e.return;s!==null;)s.childLanes|=i,n=s.alternate,n!==null&&(n.childLanes|=i),s.tag===22&&(e=s.stateNode,e===null||e._visibility&1||(l=!0)),e=s,s=s.return;return e.tag===3?(s=e.stateNode,l&&t!==null&&(l=31-Ze(i),e=s.hiddenUpdates,n=e[l],n===null?e[l]=[t]:n.push(t),t.lane=i|536870912),s):null}function io(e){if(50<ir)throw ir=0,sc=null,Error(O(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ol={};function Zv(e,t,i,n){this.tag=e,this.key=i,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function me(e,t,i,n){return new Zv(e,t,i,n)}function Kc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ai(e,t){var i=e.alternate;return i===null?(i=me(e.tag,t,e.key,e.mode),i.elementType=e.elementType,i.type=e.type,i.stateNode=e.stateNode,i.alternate=e,e.alternate=i):(i.pendingProps=t,i.type=e.type,i.flags=0,i.subtreeFlags=0,i.deletions=null),i.flags=e.flags&65011712,i.childLanes=e.childLanes,i.lanes=e.lanes,i.child=e.child,i.memoizedProps=e.memoizedProps,i.memoizedState=e.memoizedState,i.updateQueue=e.updateQueue,t=e.dependencies,i.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},i.sibling=e.sibling,i.index=e.index,i.ref=e.ref,i.refCleanup=e.refCleanup,i}function jH(e,t){e.flags&=65011714;var i=e.alternate;return i===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=i.childLanes,e.lanes=i.lanes,e.child=i.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=i.memoizedProps,e.memoizedState=i.memoizedState,e.updateQueue=i.updateQueue,e.type=i.type,t=i.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ra(e,t,i,n,l,s){var a=0;if(n=e,typeof e=="function")Kc(e)&&(a=1);else if(typeof e=="string")a=T9(e,i,ii.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case b2:return e=me(31,i,t,l),e.elementType=b2,e.lanes=s,e;case _l:return Xn(i.children,l,s,t);case aH:a=8,l|=24;break;case w2:return e=me(12,i,t,l|2),e.elementType=w2,e.lanes=s,e;case Z2:return e=me(13,i,t,l),e.elementType=Z2,e.lanes=s,e;case _2:return e=me(19,i,t,l),e.elementType=_2,e.lanes=s,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case _i:a=10;break t;case oH:a=9;break t;case Bc:a=11;break t;case Dc:a=14;break t;case Ki:a=16,n=null;break t}a=29,i=Error(O(130,e===null?"null":typeof e,"")),n=null}return t=me(a,i,t,l),t.elementType=e,t.type=n,t.lanes=s,t}function Xn(e,t,i,n){return e=me(7,e,n,t),e.lanes=i,e}function ju(e,t,i){return e=me(6,e,null,t),e.lanes=i,e}function PH(e){var t=me(18,null,null,0);return t.stateNode=e,t}function Pu(e,t,i){return t=me(4,e.children!==null?e.children:[],e.key,t),t.lanes=i,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var xf=new WeakMap;function Re(e,t){if(typeof e=="object"&&e!==null){var i=xf.get(e);return i!==void 0?i:(t={value:e,source:t,stack:cf(t)},xf.set(e,t),t)}return{value:e,source:t,stack:cf(t)}}var Nl=[],Rl=0,no=null,dr=0,Ce=[],Oe=0,wn=null,$e=1,We="";function Mi(e,t){Nl[Rl++]=dr,Nl[Rl++]=no,no=e,dr=t}function GH(e,t,i){Ce[Oe++]=$e,Ce[Oe++]=We,Ce[Oe++]=wn,wn=e;var n=$e;e=We;var l=32-Ze(n)-1;n&=~(1<<l),i+=1;var s=32-Ze(t)+l;if(30<s){var a=l-l%5;s=(n&(1<<a)-1).toString(32),n>>=a,l-=a,$e=1<<32-Ze(t)+l|i<<l|n,We=s+e}else $e=1<<s|i<<l|n,We=e}function Qc(e){e.return!==null&&(Mi(e,1),GH(e,1,0))}function Jc(e){for(;e===no;)no=Nl[--Rl],Nl[Rl]=null,dr=Nl[--Rl],Nl[Rl]=null;for(;e===wn;)wn=Ce[--Oe],Ce[Oe]=null,We=Ce[--Oe],Ce[Oe]=null,$e=Ce[--Oe],Ce[Oe]=null}function qH(e,t){Ce[Oe++]=$e,Ce[Oe++]=We,Ce[Oe++]=wn,$e=t.id,We=t.overflow,wn=e}var qt=null,vt=null,et=!1,hn=null,Be=!1,I2=Error(O(519));function Zn(e){var t=Error(O(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Hr(Re(t,e)),I2}function Cf(e){var t=e.stateNode,i=e.type,n=e.memoizedProps;switch(t[Gt]=e,t[de]=n,i){case"dialog":Q("cancel",t),Q("close",t);break;case"iframe":case"object":case"embed":Q("load",t);break;case"video":case"audio":for(i=0;i<mr.length;i++)Q(mr[i],t);break;case"source":Q("error",t);break;case"img":case"image":case"link":Q("error",t),Q("load",t);break;case"details":Q("toggle",t);break;case"input":Q("invalid",t),yH(t,n.value,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name,!0);break;case"select":Q("invalid",t);break;case"textarea":Q("invalid",t),ZH(t,n.value,n.defaultValue,n.children)}i=n.children,typeof i!="string"&&typeof i!="number"&&typeof i!="bigint"||t.textContent===""+i||n.suppressHydrationWarning===!0||Eg(t.textContent,i)?(n.popover!=null&&(Q("beforetoggle",t),Q("toggle",t)),n.onScroll!=null&&Q("scroll",t),n.onScrollEnd!=null&&Q("scrollend",t),n.onClick!=null&&(t.onclick=bi),t=!0):t=!1,t||Zn(e,!0)}function Of(e){for(qt=e.return;qt;)switch(qt.tag){case 5:case 31:case 13:Be=!1;return;case 27:case 3:Be=!0;return;default:qt=qt.return}}function vl(e){if(e!==qt)return!1;if(!et)return Of(e),et=!0,!1;var t=e.tag,i;if((i=t!==3&&t!==27)&&((i=t===5)&&(i=e.type,i=!(i!=="form"&&i!=="button")||cc(e.type,e.memoizedProps)),i=!i),i&&vt&&Zn(e),Of(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(O(317));vt=m0(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(O(317));vt=m0(e)}else t===27?(t=vt,An(e.type)?(e=Hc,Hc=null,vt=e):vt=t):vt=qt?Le(e.stateNode.nextSibling):null;return!0}function Wn(){vt=qt=null,et=!1}function Gu(){var e=hn;return e!==null&&(ce===null?ce=e:ce.push.apply(ce,e),hn=null),e}function Hr(e){hn===null?hn=[e]:hn.push(e)}var z2=ri(null),hl=null,Si=null;function Ji(e,t,i){gt(z2,t._currentValue),t._currentValue=i}function xi(e){e._currentValue=z2.current,zt(z2)}function U2(e,t,i){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===i)break;e=e.return}}function j2(e,t,i,n){var l=e.child;for(l!==null&&(l.return=e);l!==null;){var s=l.dependencies;if(s!==null){var a=l.child;s=s.firstContext;t:for(;s!==null;){var o=s;s=l;for(var c=0;c<t.length;c++)if(o.context===t[c]){s.lanes|=i,o=s.alternate,o!==null&&(o.lanes|=i),U2(s.return,i,e),n||(a=null);break t}s=o.next}}else if(l.tag===18){if(a=l.return,a===null)throw Error(O(341));a.lanes|=i,s=a.alternate,s!==null&&(s.lanes|=i),U2(a,i,e),a=null}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===e){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}}function cs(e,t,i,n){e=null;for(var l=t,s=!1;l!==null;){if(!s){if(l.flags&524288)s=!0;else if(l.flags&262144)break}if(l.tag===10){var a=l.alternate;if(a===null)throw Error(O(387));if(a=a.memoizedProps,a!==null){var o=l.type;be(l.pendingProps.value,a.value)||(e!==null?e.push(o):e=[o])}}else if(l===Qa.current){if(a=l.alternate,a===null)throw Error(O(387));a.memoizedState.memoizedState!==l.memoizedState.memoizedState&&(e!==null?e.push(Mr):e=[Mr])}l=l.return}e!==null&&j2(t,e,i,n),t.flags|=262144}function lo(e){for(e=e.firstContext;e!==null;){if(!be(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function tl(e){hl=e,Si=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Yt(e){return YH(hl,e)}function Va(e,t){return hl===null&&tl(e),YH(e,t)}function YH(e,t){var i=t._currentValue;if(t={context:t,memoizedValue:i,next:null},Si===null){if(e===null)throw Error(O(308));Si=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Si=Si.next=t;return i}var _v=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(i,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(i){return i()})}},bv=Lt.unstable_scheduleCallback,Sv=Lt.unstable_NormalPriority,Ot={$$typeof:_i,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $c(){return{controller:new _v,data:new Map,refCount:0}}function Rr(e){e.refCount--,e.refCount===0&&bv(Sv,function(){e.controller.abort()})}var Fs=null,P2=0,Ql=0,Il=null;function Ev(e,t){if(Fs===null){var i=Fs=[];P2=0,Ql=Z1(),Il={status:"pending",value:void 0,then:function(n){i.push(n)}}}return P2++,t.then(Nf,Nf),t}function Nf(){if(--P2===0&&Fs!==null){Il!==null&&(Il.status="fulfilled");var e=Fs;Fs=null,Ql=0,Il=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Tv(e,t){var i=[],n={status:"pending",value:null,reason:null,then:function(l){i.push(l)}};return e.then(function(){n.status="fulfilled",n.value=t;for(var l=0;l<i.length;l++)(0,i[l])(t)},function(l){for(n.status="rejected",n.reason=l,l=0;l<i.length;l++)(0,i[l])(void 0)}),n}var Rf=G.S;G.S=function(e,t){rg=ye(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Ev(e,t),Rf!==null&&Rf(e,t)};var Fn=ri(null);function Wc(){var e=Fn.current;return e!==null?e:dt.pooledCache}function Ba(e,t){t===null?gt(Fn,Fn.current):gt(Fn,t.pool)}function XH(){var e=Wc();return e===null?null:{parent:Ot._currentValue,pool:e}}var hs=Error(O(460)),t1=Error(O(474)),Xo=Error(O(542)),so={then:function(){}};function Bf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function FH(e,t,i){switch(i=e[i],i===void 0?e.push(t):i!==t&&(t.then(bi,bi),t=i),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Lf(e),e;default:if(typeof t.status=="string")t.then(bi,bi);else{if(e=dt,e!==null&&100<e.shellSuspendCounter)throw Error(O(482));e=t,e.status="pending",e.then(function(n){if(t.status==="pending"){var l=t;l.status="fulfilled",l.value=n}},function(n){if(t.status==="pending"){var l=t;l.status="rejected",l.reason=n}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Lf(e),e}throw Kn=t,hs}}function zn(e){try{var t=e._init;return t(e._payload)}catch(i){throw i!==null&&typeof i=="object"&&typeof i.then=="function"?(Kn=i,hs):i}}var Kn=null;function Df(){if(Kn===null)throw Error(O(459));var e=Kn;return Kn=null,e}function Lf(e){if(e===hs||e===Xo)throw Error(O(483))}var zl=null,Vr=0;function ga(e){var t=Vr;return Vr+=1,zl===null&&(zl=[]),FH(zl,e,t)}function Rs(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function pa(e,t){throw t.$$typeof===Hm?Error(O(525)):(e=Object.prototype.toString.call(t),Error(O(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function KH(e){function t(Z,p){if(e){var _=Z.deletions;_===null?(Z.deletions=[p],Z.flags|=16):_.push(p)}}function i(Z,p){if(!e)return null;for(;p!==null;)t(Z,p),p=p.sibling;return null}function n(Z){for(var p=new Map;Z!==null;)Z.key!==null?p.set(Z.key,Z):p.set(Z.index,Z),Z=Z.sibling;return p}function l(Z,p){return Z=Ai(Z,p),Z.index=0,Z.sibling=null,Z}function s(Z,p,_){return Z.index=_,e?(_=Z.alternate,_!==null?(_=_.index,_<p?(Z.flags|=67108866,p):_):(Z.flags|=67108866,p)):(Z.flags|=1048576,p)}function a(Z){return e&&Z.alternate===null&&(Z.flags|=67108866),Z}function o(Z,p,_,A){return p===null||p.tag!==6?(p=ju(_,Z.mode,A),p.return=Z,p):(p=l(p,_),p.return=Z,p)}function c(Z,p,_,A){var R=_.type;return R===_l?v(Z,p,_.props.children,A,_.key):p!==null&&(p.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Ki&&zn(R)===p.type)?(p=l(p,_.props),Rs(p,_),p.return=Z,p):(p=Ra(_.type,_.key,_.props,null,Z.mode,A),Rs(p,_),p.return=Z,p)}function d(Z,p,_,A){return p===null||p.tag!==4||p.stateNode.containerInfo!==_.containerInfo||p.stateNode.implementation!==_.implementation?(p=Pu(_,Z.mode,A),p.return=Z,p):(p=l(p,_.children||[]),p.return=Z,p)}function v(Z,p,_,A,R){return p===null||p.tag!==7?(p=Xn(_,Z.mode,A,R),p.return=Z,p):(p=l(p,_),p.return=Z,p)}function w(Z,p,_){if(typeof p=="string"&&p!==""||typeof p=="number"||typeof p=="bigint")return p=ju(""+p,Z.mode,_),p.return=Z,p;if(typeof p=="object"&&p!==null){switch(p.$$typeof){case ua:return _=Ra(p.type,p.key,p.props,null,Z.mode,_),Rs(_,p),_.return=Z,_;case Is:return p=Pu(p,Z.mode,_),p.return=Z,p;case Ki:return p=zn(p),w(Z,p,_)}if(zs(p)||Cs(p))return p=Xn(p,Z.mode,_,null),p.return=Z,p;if(typeof p.then=="function")return w(Z,ga(p),_);if(p.$$typeof===_i)return w(Z,Va(Z,p),_);pa(Z,p)}return null}function V(Z,p,_,A){var R=p!==null?p.key:null;if(typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint")return R!==null?null:o(Z,p,""+_,A);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case ua:return _.key===R?c(Z,p,_,A):null;case Is:return _.key===R?d(Z,p,_,A):null;case Ki:return _=zn(_),V(Z,p,_,A)}if(zs(_)||Cs(_))return R!==null?null:v(Z,p,_,A,null);if(typeof _.then=="function")return V(Z,p,ga(_),A);if(_.$$typeof===_i)return V(Z,p,Va(Z,_),A);pa(Z,_)}return null}function b(Z,p,_,A,R){if(typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint")return Z=Z.get(_)||null,o(p,Z,""+A,R);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case ua:return Z=Z.get(A.key===null?_:A.key)||null,c(p,Z,A,R);case Is:return Z=Z.get(A.key===null?_:A.key)||null,d(p,Z,A,R);case Ki:return A=zn(A),b(Z,p,_,A,R)}if(zs(A)||Cs(A))return Z=Z.get(_)||null,v(p,Z,A,R,null);if(typeof A.then=="function")return b(Z,p,_,ga(A),R);if(A.$$typeof===_i)return b(Z,p,_,Va(p,A),R);pa(p,A)}return null}function C(Z,p,_,A){for(var R=null,I=null,m=p,f=p=0,g=null;m!==null&&f<_.length;f++){m.index>f?(g=m,m=null):g=m.sibling;var M=V(Z,m,_[f],A);if(M===null){m===null&&(m=g);break}e&&m&&M.alternate===null&&t(Z,m),p=s(M,p,f),I===null?R=M:I.sibling=M,I=M,m=g}if(f===_.length)return i(Z,m),et&&Mi(Z,f),R;if(m===null){for(;f<_.length;f++)m=w(Z,_[f],A),m!==null&&(p=s(m,p,f),I===null?R=m:I.sibling=m,I=m);return et&&Mi(Z,f),R}for(m=n(m);f<_.length;f++)g=b(m,Z,f,_[f],A),g!==null&&(e&&g.alternate!==null&&m.delete(g.key===null?f:g.key),p=s(g,p,f),I===null?R=g:I.sibling=g,I=g);return e&&m.forEach(function(S){return t(Z,S)}),et&&Mi(Z,f),R}function N(Z,p,_,A){if(_==null)throw Error(O(151));for(var R=null,I=null,m=p,f=p=0,g=null,M=_.next();m!==null&&!M.done;f++,M=_.next()){m.index>f?(g=m,m=null):g=m.sibling;var S=V(Z,m,M.value,A);if(S===null){m===null&&(m=g);break}e&&m&&S.alternate===null&&t(Z,m),p=s(S,p,f),I===null?R=S:I.sibling=S,I=S,m=g}if(M.done)return i(Z,m),et&&Mi(Z,f),R;if(m===null){for(;!M.done;f++,M=_.next())M=w(Z,M.value,A),M!==null&&(p=s(M,p,f),I===null?R=M:I.sibling=M,I=M);return et&&Mi(Z,f),R}for(m=n(m);!M.done;f++,M=_.next())M=b(m,Z,f,M.value,A),M!==null&&(e&&M.alternate!==null&&m.delete(M.key===null?f:M.key),p=s(M,p,f),I===null?R=M:I.sibling=M,I=M);return e&&m.forEach(function(E){return t(Z,E)}),et&&Mi(Z,f),R}function D(Z,p,_,A){if(typeof _=="object"&&_!==null&&_.type===_l&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case ua:t:{for(var R=_.key;p!==null;){if(p.key===R){if(R=_.type,R===_l){if(p.tag===7){i(Z,p.sibling),A=l(p,_.props.children),A.return=Z,Z=A;break t}}else if(p.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Ki&&zn(R)===p.type){i(Z,p.sibling),A=l(p,_.props),Rs(A,_),A.return=Z,Z=A;break t}i(Z,p);break}else t(Z,p);p=p.sibling}_.type===_l?(A=Xn(_.props.children,Z.mode,A,_.key),A.return=Z,Z=A):(A=Ra(_.type,_.key,_.props,null,Z.mode,A),Rs(A,_),A.return=Z,Z=A)}return a(Z);case Is:t:{for(R=_.key;p!==null;){if(p.key===R)if(p.tag===4&&p.stateNode.containerInfo===_.containerInfo&&p.stateNode.implementation===_.implementation){i(Z,p.sibling),A=l(p,_.children||[]),A.return=Z,Z=A;break t}else{i(Z,p);break}else t(Z,p);p=p.sibling}A=Pu(_,Z.mode,A),A.return=Z,Z=A}return a(Z);case Ki:return _=zn(_),D(Z,p,_,A)}if(zs(_))return C(Z,p,_,A);if(Cs(_)){if(R=Cs(_),typeof R!="function")throw Error(O(150));return _=R.call(_),N(Z,p,_,A)}if(typeof _.then=="function")return D(Z,p,ga(_),A);if(_.$$typeof===_i)return D(Z,p,Va(Z,_),A);pa(Z,_)}return typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint"?(_=""+_,p!==null&&p.tag===6?(i(Z,p.sibling),A=l(p,_),A.return=Z,Z=A):(i(Z,p),A=ju(_,Z.mode,A),A.return=Z,Z=A),a(Z)):i(Z,p)}return function(Z,p,_,A){try{Vr=0;var R=D(Z,p,_,A);return zl=null,R}catch(m){if(m===hs||m===Xo)throw m;var I=me(29,m,null,Z.mode);return I.lanes=A,I.return=Z,I}finally{}}}var el=KH(!0),QH=KH(!1),Qi=!1;function e1(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function G2(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function fn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function dn(e,t,i){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,lt&2){var l=n.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),n.pending=t,t=io(e),UH(e,null,i),t}return Yo(e,n,t,i),io(e)}function Ks(e,t,i){if(t=t.updateQueue,t!==null&&(t=t.shared,(i&4194048)!==0)){var n=t.lanes;n&=e.pendingLanes,i|=n,t.lanes=i,HH(e,i)}}function qu(e,t){var i=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,i===n)){var l=null,s=null;if(i=i.firstBaseUpdate,i!==null){do{var a={lane:i.lane,tag:i.tag,payload:i.payload,callback:null,next:null};s===null?l=s=a:s=s.next=a,i=i.next}while(i!==null);s===null?l=s=t:s=s.next=t}else l=s=t;i={baseState:n.baseState,firstBaseUpdate:l,lastBaseUpdate:s,shared:n.shared,callbacks:n.callbacks},e.updateQueue=i;return}e=i.lastBaseUpdate,e===null?i.firstBaseUpdate=t:e.next=t,i.lastBaseUpdate=t}var q2=!1;function Qs(){if(q2){var e=Il;if(e!==null)throw e}}function Js(e,t,i,n){q2=!1;var l=e.updateQueue;Qi=!1;var s=l.firstBaseUpdate,a=l.lastBaseUpdate,o=l.shared.pending;if(o!==null){l.shared.pending=null;var c=o,d=c.next;c.next=null,a===null?s=d:a.next=d,a=c;var v=e.alternate;v!==null&&(v=v.updateQueue,o=v.lastBaseUpdate,o!==a&&(o===null?v.firstBaseUpdate=d:o.next=d,v.lastBaseUpdate=c))}if(s!==null){var w=l.baseState;a=0,v=d=c=null,o=s;do{var V=o.lane&-536870913,b=V!==o.lane;if(b?(tt&V)===V:(n&V)===V){V!==0&&V===Ql&&(q2=!0),v!==null&&(v=v.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var C=e,N=o;V=t;var D=i;switch(N.tag){case 1:if(C=N.payload,typeof C=="function"){w=C.call(D,w,V);break t}w=C;break t;case 3:C.flags=C.flags&-65537|128;case 0:if(C=N.payload,V=typeof C=="function"?C.call(D,w,V):C,V==null)break t;w=yt({},w,V);break t;case 2:Qi=!0}}V=o.callback,V!==null&&(e.flags|=64,b&&(e.flags|=8192),b=l.callbacks,b===null?l.callbacks=[V]:b.push(V))}else b={lane:V,tag:o.tag,payload:o.payload,callback:o.callback,next:null},v===null?(d=v=b,c=w):v=v.next=b,a|=V;if(o=o.next,o===null){if(o=l.shared.pending,o===null)break;b=o,o=b.next,b.next=null,l.lastBaseUpdate=b,l.shared.pending=null}}while(!0);v===null&&(c=w),l.baseState=c,l.firstBaseUpdate=d,l.lastBaseUpdate=v,s===null&&(l.shared.lanes=0),bn|=a,e.lanes=a,e.memoizedState=w}}function JH(e,t){if(typeof e!="function")throw Error(O(191,e));e.call(t)}function $H(e,t){var i=e.callbacks;if(i!==null)for(e.callbacks=null,e=0;e<i.length;e++)JH(i[e],t)}var Jl=ri(null),ro=ri(0);function kf(e,t){e=Di,gt(ro,e),gt(Jl,t),Di=e|t.baseLanes}function Y2(){gt(ro,Di),gt(Jl,Jl.current)}function i1(){Di=ro.current,zt(Jl),zt(ro)}var Se=ri(null),De=null;function $i(e){var t=e.alternate;gt(Et,Et.current&1),gt(Se,e),De===null&&(t===null||Jl.current!==null||t.memoizedState!==null)&&(De=e)}function X2(e){gt(Et,Et.current),gt(Se,e),De===null&&(De=e)}function WH(e){e.tag===22?(gt(Et,Et.current),gt(Se,e),De===null&&(De=e)):Wi()}function Wi(){gt(Et,Et.current),gt(Se,Se.current)}function pe(e){zt(Se),De===e&&(De=null),zt(Et)}var Et=ri(0);function ao(e){for(var t=e;t!==null;){if(t.tag===13){var i=t.memoizedState;if(i!==null&&(i=i.dehydrated,i===null||fc(i)||dc(i)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ni=0,F=null,ht=null,xt=null,oo=!1,Ul=!1,il=!1,uo=0,gr=0,jl=null,Av=0;function _t(){throw Error(O(321))}function n1(e,t){if(t===null)return!1;for(var i=0;i<t.length&&i<e.length;i++)if(!be(e[i],t[i]))return!1;return!0}function l1(e,t,i,n,l,s){return Ni=s,F=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,G.H=e===null||e.memoizedState===null?xV:V1,il=!1,s=i(n,l),il=!1,Ul&&(s=eV(t,i,n,l)),tV(e),s}function tV(e){G.H=pr;var t=ht!==null&&ht.next!==null;if(Ni=0,xt=ht=F=null,oo=!1,gr=0,jl=null,t)throw Error(O(300));e===null||Nt||(e=e.dependencies,e!==null&&lo(e)&&(Nt=!0))}function eV(e,t,i,n){F=e;var l=0;do{if(Ul&&(jl=null),gr=0,Ul=!1,25<=l)throw Error(O(301));if(l+=1,xt=ht=null,e.updateQueue!=null){var s=e.updateQueue;s.lastEffect=null,s.events=null,s.stores=null,s.memoCache!=null&&(s.memoCache.index=0)}G.H=CV,s=t(i,n)}while(Ul);return s}function xv(){var e=G.H,t=e.useState()[0];return t=typeof t.then=="function"?Br(t):t,e=e.useState()[0],(ht!==null?ht.memoizedState:null)!==e&&(F.flags|=1024),t}function s1(){var e=uo!==0;return uo=0,e}function r1(e,t,i){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i}function a1(e){if(oo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}oo=!1}Ni=0,xt=ht=F=null,Ul=!1,gr=uo=0,jl=null}function ie(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return xt===null?F.memoizedState=xt=e:xt=xt.next=e,xt}function Tt(){if(ht===null){var e=F.alternate;e=e!==null?e.memoizedState:null}else e=ht.next;var t=xt===null?F.memoizedState:xt.next;if(t!==null)xt=t,ht=e;else{if(e===null)throw F.alternate===null?Error(O(467)):Error(O(310));ht=e,e={memoizedState:ht.memoizedState,baseState:ht.baseState,baseQueue:ht.baseQueue,queue:ht.queue,next:null},xt===null?F.memoizedState=xt=e:xt=xt.next=e}return xt}function Fo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Br(e){var t=gr;return gr+=1,jl===null&&(jl=[]),e=FH(jl,e,t),t=F,(xt===null?t.memoizedState:xt.next)===null&&(t=t.alternate,G.H=t===null||t.memoizedState===null?xV:V1),e}function Ko(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Br(e);if(e.$$typeof===_i)return Yt(e)}throw Error(O(438,String(e)))}function o1(e){var t=null,i=F.updateQueue;if(i!==null&&(t=i.memoCache),t==null){var n=F.alternate;n!==null&&(n=n.updateQueue,n!==null&&(n=n.memoCache,n!=null&&(t={data:n.data.map(function(l){return l.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),i===null&&(i=Fo(),F.updateQueue=i),i.memoCache=t,i=t.data[t.index],i===void 0)for(i=t.data[t.index]=Array(e),n=0;n<e;n++)i[n]=Vm;return t.index++,i}function Ri(e,t){return typeof t=="function"?t(e):t}function Da(e){var t=Tt();return u1(t,ht,e)}function u1(e,t,i){var n=e.queue;if(n===null)throw Error(O(311));n.lastRenderedReducer=i;var l=e.baseQueue,s=n.pending;if(s!==null){if(l!==null){var a=l.next;l.next=s.next,s.next=a}t.baseQueue=l=s,n.pending=null}if(s=e.baseState,l===null)e.memoizedState=s;else{t=l.next;var o=a=null,c=null,d=t,v=!1;do{var w=d.lane&-536870913;if(w!==d.lane?(tt&w)===w:(Ni&w)===w){var V=d.revertLane;if(V===0)c!==null&&(c=c.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),w===Ql&&(v=!0);else if((Ni&V)===V){d=d.next,V===Ql&&(v=!0);continue}else w={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},c===null?(o=c=w,a=s):c=c.next=w,F.lanes|=V,bn|=V;w=d.action,il&&i(s,w),s=d.hasEagerState?d.eagerState:i(s,w)}else V={lane:w,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},c===null?(o=c=V,a=s):c=c.next=V,F.lanes|=w,bn|=w;d=d.next}while(d!==null&&d!==t);if(c===null?a=s:c.next=o,!be(s,e.memoizedState)&&(Nt=!0,v&&(i=Il,i!==null)))throw i;e.memoizedState=s,e.baseState=a,e.baseQueue=c,n.lastRenderedState=s}return l===null&&(n.lanes=0),[e.memoizedState,n.dispatch]}function Yu(e){var t=Tt(),i=t.queue;if(i===null)throw Error(O(311));i.lastRenderedReducer=e;var n=i.dispatch,l=i.pending,s=t.memoizedState;if(l!==null){i.pending=null;var a=l=l.next;do s=e(s,a.action),a=a.next;while(a!==l);be(s,t.memoizedState)||(Nt=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),i.lastRenderedState=s}return[s,n]}function iV(e,t,i){var n=F,l=Tt(),s=et;if(s){if(i===void 0)throw Error(O(407));i=i()}else i=t();var a=!be((ht||l).memoizedState,i);if(a&&(l.memoizedState=i,Nt=!0),l=l.queue,c1(sV.bind(null,n,l,e),[e]),l.getSnapshot!==t||a||xt!==null&&xt.memoizedState.tag&1){if(n.flags|=2048,$l(9,{destroy:void 0},lV.bind(null,n,l,i,t),null),dt===null)throw Error(O(349));s||Ni&127||nV(n,t,i)}return i}function nV(e,t,i){e.flags|=16384,e={getSnapshot:t,value:i},t=F.updateQueue,t===null?(t=Fo(),F.updateQueue=t,t.stores=[e]):(i=t.stores,i===null?t.stores=[e]:i.push(e))}function lV(e,t,i,n){t.value=i,t.getSnapshot=n,rV(t)&&aV(e)}function sV(e,t,i){return i(function(){rV(t)&&aV(e)})}function rV(e){var t=e.getSnapshot;e=e.value;try{var i=t();return!be(e,i)}catch{return!0}}function aV(e){var t=cl(e,2);t!==null&&fe(t,e,2)}function F2(e){var t=ie();if(typeof e=="function"){var i=e;if(e=i(),il){sn(!0);try{i()}finally{sn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ri,lastRenderedState:e},t}function oV(e,t,i,n){return e.baseState=i,u1(e,ht,typeof n=="function"?n:Ri)}function Cv(e,t,i,n,l){if(Jo(e))throw Error(O(485));if(e=t.action,e!==null){var s={payload:l,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(a){s.listeners.push(a)}};G.T!==null?i(!0):s.isTransition=!1,n(s),i=t.pending,i===null?(s.next=t.pending=s,uV(t,s)):(s.next=i.next,t.pending=i.next=s)}}function uV(e,t){var i=t.action,n=t.payload,l=e.state;if(t.isTransition){var s=G.T,a={};G.T=a;try{var o=i(l,n),c=G.S;c!==null&&c(a,o),If(e,t,o)}catch(d){K2(e,t,d)}finally{s!==null&&a.types!==null&&(s.types=a.types),G.T=s}}else try{s=i(l,n),If(e,t,s)}catch(d){K2(e,t,d)}}function If(e,t,i){i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(function(n){zf(e,t,n)},function(n){return K2(e,t,n)}):zf(e,t,i)}function zf(e,t,i){t.status="fulfilled",t.value=i,cV(t),e.state=i,t=e.pending,t!==null&&(i=t.next,i===t?e.pending=null:(i=i.next,t.next=i,uV(e,i)))}function K2(e,t,i){var n=e.pending;if(e.pending=null,n!==null){n=n.next;do t.status="rejected",t.reason=i,cV(t),t=t.next;while(t!==n)}e.action=null}function cV(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function hV(e,t){return t}function Uf(e,t){if(et){var i=dt.formState;if(i!==null){t:{var n=F;if(et){if(vt){e:{for(var l=vt,s=Be;l.nodeType!==8;){if(!s){l=null;break e}if(l=Le(l.nextSibling),l===null){l=null;break e}}s=l.data,l=s==="F!"||s==="F"?l:null}if(l){vt=Le(l.nextSibling),n=l.data==="F!";break t}}Zn(n)}n=!1}n&&(t=i[0])}}return i=ie(),i.memoizedState=i.baseState=t,n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:hV,lastRenderedState:t},i.queue=n,i=EV.bind(null,F,n),n.dispatch=i,n=F2(!1),s=H1.bind(null,F,!1,n.queue),n=ie(),l={state:t,dispatch:null,action:e,pending:null},n.queue=l,i=Cv.bind(null,F,l,s,i),l.dispatch=i,n.memoizedState=e,[t,i,!1]}function jf(e){var t=Tt();return fV(t,ht,e)}function fV(e,t,i){if(t=u1(e,t,hV)[0],e=Da(Ri)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var n=Br(t)}catch(a){throw a===hs?Xo:a}else n=t;t=Tt();var l=t.queue,s=l.dispatch;return i!==t.memoizedState&&(F.flags|=2048,$l(9,{destroy:void 0},Ov.bind(null,l,i),null)),[n,s,e]}function Ov(e,t){e.action=t}function Pf(e){var t=Tt(),i=ht;if(i!==null)return fV(t,i,e);Tt(),t=t.memoizedState,i=Tt();var n=i.queue.dispatch;return i.memoizedState=e,[t,n,!1]}function $l(e,t,i,n){return e={tag:e,create:i,deps:n,inst:t,next:null},t=F.updateQueue,t===null&&(t=Fo(),F.updateQueue=t),i=t.lastEffect,i===null?t.lastEffect=e.next=e:(n=i.next,i.next=e,e.next=n,t.lastEffect=e),e}function dV(){return Tt().memoizedState}function La(e,t,i,n){var l=ie();F.flags|=e,l.memoizedState=$l(1|t,{destroy:void 0},i,n===void 0?null:n)}function Qo(e,t,i,n){var l=Tt();n=n===void 0?null:n;var s=l.memoizedState.inst;ht!==null&&n!==null&&n1(n,ht.memoizedState.deps)?l.memoizedState=$l(t,s,i,n):(F.flags|=e,l.memoizedState=$l(1|t,s,i,n))}function Gf(e,t){La(8390656,8,e,t)}function c1(e,t){Qo(2048,8,e,t)}function Nv(e){F.flags|=4;var t=F.updateQueue;if(t===null)t=Fo(),F.updateQueue=t,t.events=[e];else{var i=t.events;i===null?t.events=[e]:i.push(e)}}function HV(e){var t=Tt().memoizedState;return Nv({ref:t,nextImpl:e}),function(){if(lt&2)throw Error(O(440));return t.impl.apply(void 0,arguments)}}function VV(e,t){return Qo(4,2,e,t)}function gV(e,t){return Qo(4,4,e,t)}function pV(e,t){if(typeof t=="function"){e=e();var i=t(e);return function(){typeof i=="function"?i():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function mV(e,t,i){i=i!=null?i.concat([e]):null,Qo(4,4,pV.bind(null,t,e),i)}function h1(){}function vV(e,t){var i=Tt();t=t===void 0?null:t;var n=i.memoizedState;return t!==null&&n1(t,n[1])?n[0]:(i.memoizedState=[e,t],e)}function MV(e,t){var i=Tt();t=t===void 0?null:t;var n=i.memoizedState;if(t!==null&&n1(t,n[1]))return n[0];if(n=e(),il){sn(!0);try{e()}finally{sn(!1)}}return i.memoizedState=[n,t],n}function f1(e,t,i){return i===void 0||Ni&1073741824&&!(tt&261930)?e.memoizedState=t:(e.memoizedState=i,e=og(),F.lanes|=e,bn|=e,i)}function yV(e,t,i,n){return be(i,t)?i:Jl.current!==null?(e=f1(e,i,n),be(e,t)||(Nt=!0),e):!(Ni&42)||Ni&1073741824&&!(tt&261930)?(Nt=!0,e.memoizedState=i):(e=og(),F.lanes|=e,bn|=e,t)}function wV(e,t,i,n,l){var s=st.p;st.p=s!==0&&8>s?s:8;var a=G.T,o={};G.T=o,H1(e,!1,t,i);try{var c=l(),d=G.S;if(d!==null&&d(o,c),c!==null&&typeof c=="object"&&typeof c.then=="function"){var v=Tv(c,n);$s(e,t,v,_e(e))}else $s(e,t,n,_e(e))}catch(w){$s(e,t,{then:function(){},status:"rejected",reason:w},_e())}finally{st.p=s,a!==null&&o.types!==null&&(a.types=o.types),G.T=a}}function Rv(){}function Q2(e,t,i,n){if(e.tag!==5)throw Error(O(476));var l=ZV(e).queue;wV(e,l,t,Yn,i===null?Rv:function(){return _V(e),i(n)})}function ZV(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Yn,baseState:Yn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ri,lastRenderedState:Yn},next:null};var i={};return t.next={memoizedState:i,baseState:i,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ri,lastRenderedState:i},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function _V(e){var t=ZV(e);t.next===null&&(t=e.alternate.memoizedState),$s(e,t.next.queue,{},_e())}function d1(){return Yt(Mr)}function bV(){return Tt().memoizedState}function SV(){return Tt().memoizedState}function Bv(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var i=_e();e=fn(i);var n=dn(t,e,i);n!==null&&(fe(n,t,i),Ks(n,t,i)),t={cache:$c()},e.payload=t;return}t=t.return}}function Dv(e,t,i){var n=_e();i={lane:n,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Jo(e)?TV(t,i):(i=Fc(e,t,i,n),i!==null&&(fe(i,e,n),AV(i,t,n)))}function EV(e,t,i){var n=_e();$s(e,t,i,n)}function $s(e,t,i,n){var l={lane:n,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null};if(Jo(e))TV(t,l);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var a=t.lastRenderedState,o=s(a,i);if(l.hasEagerState=!0,l.eagerState=o,be(o,a))return Yo(e,t,l,0),dt===null&&qo(),!1}catch{}finally{}if(i=Fc(e,t,l,n),i!==null)return fe(i,e,n),AV(i,t,n),!0}return!1}function H1(e,t,i,n){if(n={lane:2,revertLane:Z1(),gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Jo(e)){if(t)throw Error(O(479))}else t=Fc(e,i,n,2),t!==null&&fe(t,e,2)}function Jo(e){var t=e.alternate;return e===F||t!==null&&t===F}function TV(e,t){Ul=oo=!0;var i=e.pending;i===null?t.next=t:(t.next=i.next,i.next=t),e.pending=t}function AV(e,t,i){if(i&4194048){var n=t.lanes;n&=e.pendingLanes,i|=n,t.lanes=i,HH(e,i)}}var pr={readContext:Yt,use:Ko,useCallback:_t,useContext:_t,useEffect:_t,useImperativeHandle:_t,useLayoutEffect:_t,useInsertionEffect:_t,useMemo:_t,useReducer:_t,useRef:_t,useState:_t,useDebugValue:_t,useDeferredValue:_t,useTransition:_t,useSyncExternalStore:_t,useId:_t,useHostTransitionStatus:_t,useFormState:_t,useActionState:_t,useOptimistic:_t,useMemoCache:_t,useCacheRefresh:_t};pr.useEffectEvent=_t;var xV={readContext:Yt,use:Ko,useCallback:function(e,t){return ie().memoizedState=[e,t===void 0?null:t],e},useContext:Yt,useEffect:Gf,useImperativeHandle:function(e,t,i){i=i!=null?i.concat([e]):null,La(4194308,4,pV.bind(null,t,e),i)},useLayoutEffect:function(e,t){return La(4194308,4,e,t)},useInsertionEffect:function(e,t){La(4,2,e,t)},useMemo:function(e,t){var i=ie();t=t===void 0?null:t;var n=e();if(il){sn(!0);try{e()}finally{sn(!1)}}return i.memoizedState=[n,t],n},useReducer:function(e,t,i){var n=ie();if(i!==void 0){var l=i(t);if(il){sn(!0);try{i(t)}finally{sn(!1)}}}else l=t;return n.memoizedState=n.baseState=l,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:l},n.queue=e,e=e.dispatch=Dv.bind(null,F,e),[n.memoizedState,e]},useRef:function(e){var t=ie();return e={current:e},t.memoizedState=e},useState:function(e){e=F2(e);var t=e.queue,i=EV.bind(null,F,t);return t.dispatch=i,[e.memoizedState,i]},useDebugValue:h1,useDeferredValue:function(e,t){var i=ie();return f1(i,e,t)},useTransition:function(){var e=F2(!1);return e=wV.bind(null,F,e.queue,!0,!1),ie().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,i){var n=F,l=ie();if(et){if(i===void 0)throw Error(O(407));i=i()}else{if(i=t(),dt===null)throw Error(O(349));tt&127||nV(n,t,i)}l.memoizedState=i;var s={value:i,getSnapshot:t};return l.queue=s,Gf(sV.bind(null,n,s,e),[e]),n.flags|=2048,$l(9,{destroy:void 0},lV.bind(null,n,s,i,t),null),i},useId:function(){var e=ie(),t=dt.identifierPrefix;if(et){var i=We,n=$e;i=(n&~(1<<32-Ze(n)-1)).toString(32)+i,t="_"+t+"R_"+i,i=uo++,0<i&&(t+="H"+i.toString(32)),t+="_"}else i=Av++,t="_"+t+"r_"+i.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:d1,useFormState:Uf,useActionState:Uf,useOptimistic:function(e){var t=ie();t.memoizedState=t.baseState=e;var i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=i,t=H1.bind(null,F,!0,i),i.dispatch=t,[e,t]},useMemoCache:o1,useCacheRefresh:function(){return ie().memoizedState=Bv.bind(null,F)},useEffectEvent:function(e){var t=ie(),i={impl:e};return t.memoizedState=i,function(){if(lt&2)throw Error(O(440));return i.impl.apply(void 0,arguments)}}},V1={readContext:Yt,use:Ko,useCallback:vV,useContext:Yt,useEffect:c1,useImperativeHandle:mV,useInsertionEffect:VV,useLayoutEffect:gV,useMemo:MV,useReducer:Da,useRef:dV,useState:function(){return Da(Ri)},useDebugValue:h1,useDeferredValue:function(e,t){var i=Tt();return yV(i,ht.memoizedState,e,t)},useTransition:function(){var e=Da(Ri)[0],t=Tt().memoizedState;return[typeof e=="boolean"?e:Br(e),t]},useSyncExternalStore:iV,useId:bV,useHostTransitionStatus:d1,useFormState:jf,useActionState:jf,useOptimistic:function(e,t){var i=Tt();return oV(i,ht,e,t)},useMemoCache:o1,useCacheRefresh:SV};V1.useEffectEvent=HV;var CV={readContext:Yt,use:Ko,useCallback:vV,useContext:Yt,useEffect:c1,useImperativeHandle:mV,useInsertionEffect:VV,useLayoutEffect:gV,useMemo:MV,useReducer:Yu,useRef:dV,useState:function(){return Yu(Ri)},useDebugValue:h1,useDeferredValue:function(e,t){var i=Tt();return ht===null?f1(i,e,t):yV(i,ht.memoizedState,e,t)},useTransition:function(){var e=Yu(Ri)[0],t=Tt().memoizedState;return[typeof e=="boolean"?e:Br(e),t]},useSyncExternalStore:iV,useId:bV,useHostTransitionStatus:d1,useFormState:Pf,useActionState:Pf,useOptimistic:function(e,t){var i=Tt();return ht!==null?oV(i,ht,e,t):(i.baseState=e,[e,i.queue.dispatch])},useMemoCache:o1,useCacheRefresh:SV};CV.useEffectEvent=HV;function Xu(e,t,i,n){t=e.memoizedState,i=i(n,t),i=i==null?t:yt({},t,i),e.memoizedState=i,e.lanes===0&&(e.updateQueue.baseState=i)}var J2={enqueueSetState:function(e,t,i){e=e._reactInternals;var n=_e(),l=fn(n);l.payload=t,i!=null&&(l.callback=i),t=dn(e,l,n),t!==null&&(fe(t,e,n),Ks(t,e,n))},enqueueReplaceState:function(e,t,i){e=e._reactInternals;var n=_e(),l=fn(n);l.tag=1,l.payload=t,i!=null&&(l.callback=i),t=dn(e,l,n),t!==null&&(fe(t,e,n),Ks(t,e,n))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var i=_e(),n=fn(i);n.tag=2,t!=null&&(n.callback=t),t=dn(e,n,i),t!==null&&(fe(t,e,i),Ks(t,e,i))}};function qf(e,t,i,n,l,s,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,s,a):t.prototype&&t.prototype.isPureReactComponent?!fr(i,n)||!fr(l,s):!0}function Yf(e,t,i,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(i,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(i,n),t.state!==e&&J2.enqueueReplaceState(t,t.state,null)}function nl(e,t){var i=t;if("ref"in t){i={};for(var n in t)n!=="ref"&&(i[n]=t[n])}if(e=e.defaultProps){i===t&&(i=yt({},i));for(var l in e)i[l]===void 0&&(i[l]=e[l])}return i}function OV(e){eo(e)}function NV(e){console.error(e)}function RV(e){eo(e)}function co(e,t){try{var i=e.onUncaughtError;i(t.value,{componentStack:t.stack})}catch(n){setTimeout(function(){throw n})}}function Xf(e,t,i){try{var n=e.onCaughtError;n(i.value,{componentStack:i.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(l){setTimeout(function(){throw l})}}function $2(e,t,i){return i=fn(i),i.tag=3,i.payload={element:null},i.callback=function(){co(e,t)},i}function BV(e){return e=fn(e),e.tag=3,e}function DV(e,t,i,n){var l=i.type.getDerivedStateFromError;if(typeof l=="function"){var s=n.value;e.payload=function(){return l(s)},e.callback=function(){Xf(t,i,n)}}var a=i.stateNode;a!==null&&typeof a.componentDidCatch=="function"&&(e.callback=function(){Xf(t,i,n),typeof l!="function"&&(Hn===null?Hn=new Set([this]):Hn.add(this));var o=n.stack;this.componentDidCatch(n.value,{componentStack:o!==null?o:""})})}function Lv(e,t,i,n,l){if(i.flags|=32768,n!==null&&typeof n=="object"&&typeof n.then=="function"){if(t=i.alternate,t!==null&&cs(t,i,l,!0),i=Se.current,i!==null){switch(i.tag){case 31:case 13:return De===null?go():i.alternate===null&&bt===0&&(bt=3),i.flags&=-257,i.flags|=65536,i.lanes=l,n===so?i.flags|=16384:(t=i.updateQueue,t===null?i.updateQueue=new Set([n]):t.add(n),l2(e,n,l)),!1;case 22:return i.flags|=65536,n===so?i.flags|=16384:(t=i.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([n])},i.updateQueue=t):(i=t.retryQueue,i===null?t.retryQueue=new Set([n]):i.add(n)),l2(e,n,l)),!1}throw Error(O(435,i.tag))}return l2(e,n,l),go(),!1}if(et)return t=Se.current,t!==null?(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=l,n!==I2&&(e=Error(O(422),{cause:n}),Hr(Re(e,i)))):(n!==I2&&(t=Error(O(423),{cause:n}),Hr(Re(t,i))),e=e.current.alternate,e.flags|=65536,l&=-l,e.lanes|=l,n=Re(n,i),l=$2(e.stateNode,n,l),qu(e,l),bt!==4&&(bt=2)),!1;var s=Error(O(520),{cause:n});if(s=Re(s,i),er===null?er=[s]:er.push(s),bt!==4&&(bt=2),t===null)return!0;n=Re(n,i),i=t;do{switch(i.tag){case 3:return i.flags|=65536,e=l&-l,i.lanes|=e,e=$2(i.stateNode,n,e),qu(i,e),!1;case 1:if(t=i.type,s=i.stateNode,(i.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||s!==null&&typeof s.componentDidCatch=="function"&&(Hn===null||!Hn.has(s))))return i.flags|=65536,l&=-l,i.lanes|=l,l=BV(l),DV(l,e,i,n),qu(i,l),!1}i=i.return}while(i!==null);return!1}var g1=Error(O(461)),Nt=!1;function Pt(e,t,i,n){t.child=e===null?QH(t,null,i,n):el(t,e.child,i,n)}function Ff(e,t,i,n,l){i=i.render;var s=t.ref;if("ref"in n){var a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}else a=n;return tl(t),n=l1(e,t,i,a,s,l),o=s1(),e!==null&&!Nt?(r1(e,t,l),Bi(e,t,l)):(et&&o&&Qc(t),t.flags|=1,Pt(e,t,n,l),t.child)}function Kf(e,t,i,n,l){if(e===null){var s=i.type;return typeof s=="function"&&!Kc(s)&&s.defaultProps===void 0&&i.compare===null?(t.tag=15,t.type=s,LV(e,t,s,n,l)):(e=Ra(i.type,null,n,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!p1(e,l)){var a=s.memoizedProps;if(i=i.compare,i=i!==null?i:fr,i(a,n)&&e.ref===t.ref)return Bi(e,t,l)}return t.flags|=1,e=Ai(s,n),e.ref=t.ref,e.return=t,t.child=e}function LV(e,t,i,n,l){if(e!==null){var s=e.memoizedProps;if(fr(s,n)&&e.ref===t.ref)if(Nt=!1,t.pendingProps=n=s,p1(e,l))e.flags&131072&&(Nt=!0);else return t.lanes=e.lanes,Bi(e,t,l)}return W2(e,t,i,n,l)}function kV(e,t,i,n){var l=n.children,s=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.mode==="hidden"){if(t.flags&128){if(s=s!==null?s.baseLanes|i:i,e!==null){for(n=t.child=e.child,l=0;n!==null;)l=l|n.lanes|n.childLanes,n=n.sibling;n=l&~s}else n=0,t.child=null;return Qf(e,t,s,i,n)}if(i&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ba(t,s!==null?s.cachePool:null),s!==null?kf(t,s):Y2(),WH(t);else return n=t.lanes=536870912,Qf(e,t,s!==null?s.baseLanes|i:i,i,n)}else s!==null?(Ba(t,s.cachePool),kf(t,s),Wi(),t.memoizedState=null):(e!==null&&Ba(t,null),Y2(),Wi());return Pt(e,t,l,i),t.child}function js(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Qf(e,t,i,n,l){var s=Wc();return s=s===null?null:{parent:Ot._currentValue,pool:s},t.memoizedState={baseLanes:i,cachePool:s},e!==null&&Ba(t,null),Y2(),WH(t),e!==null&&cs(e,t,n,!0),t.childLanes=l,null}function ka(e,t){return t=ho({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Jf(e,t,i){return el(t,e.child,null,i),e=ka(t,t.pendingProps),e.flags|=2,pe(t),t.memoizedState=null,e}function kv(e,t,i){var n=t.pendingProps,l=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(et){if(n.mode==="hidden")return e=ka(t,n),t.lanes=536870912,js(null,e);if(X2(t),(e=vt)?(e=xg(e,Be),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:wn!==null?{id:$e,overflow:We}:null,retryLane:536870912,hydrationErrors:null},i=PH(e),i.return=t,t.child=i,qt=t,vt=null)):e=null,e===null)throw Zn(t);return t.lanes=536870912,null}return ka(t,n)}var s=e.memoizedState;if(s!==null){var a=s.dehydrated;if(X2(t),l)if(t.flags&256)t.flags&=-257,t=Jf(e,t,i);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(O(558));else if(Nt||cs(e,t,i,!1),l=(i&e.childLanes)!==0,Nt||l){if(n=dt,n!==null&&(a=VH(n,i),a!==0&&a!==s.retryLane))throw s.retryLane=a,cl(e,a),fe(n,e,a),g1;go(),t=Jf(e,t,i)}else e=s.treeContext,vt=Le(a.nextSibling),qt=t,et=!0,hn=null,Be=!1,e!==null&&qH(t,e),t=ka(t,n),t.flags|=4096;return t}return e=Ai(e.child,{mode:n.mode,children:n.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Ia(e,t){var i=t.ref;if(i===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof i!="function"&&typeof i!="object")throw Error(O(284));(e===null||e.ref!==i)&&(t.flags|=4194816)}}function W2(e,t,i,n,l){return tl(t),i=l1(e,t,i,n,void 0,l),n=s1(),e!==null&&!Nt?(r1(e,t,l),Bi(e,t,l)):(et&&n&&Qc(t),t.flags|=1,Pt(e,t,i,l),t.child)}function $f(e,t,i,n,l,s){return tl(t),t.updateQueue=null,i=eV(t,n,i,l),tV(e),n=s1(),e!==null&&!Nt?(r1(e,t,s),Bi(e,t,s)):(et&&n&&Qc(t),t.flags|=1,Pt(e,t,i,s),t.child)}function Wf(e,t,i,n,l){if(tl(t),t.stateNode===null){var s=Ol,a=i.contextType;typeof a=="object"&&a!==null&&(s=Yt(a)),s=new i(n,s),t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=J2,t.stateNode=s,s._reactInternals=t,s=t.stateNode,s.props=n,s.state=t.memoizedState,s.refs={},e1(t),a=i.contextType,s.context=typeof a=="object"&&a!==null?Yt(a):Ol,s.state=t.memoizedState,a=i.getDerivedStateFromProps,typeof a=="function"&&(Xu(t,i,a,n),s.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(a=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),a!==s.state&&J2.enqueueReplaceState(s,s.state,null),Js(t,n,s,l),Qs(),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308),n=!0}else if(e===null){s=t.stateNode;var o=t.memoizedProps,c=nl(i,o);s.props=c;var d=s.context,v=i.contextType;a=Ol,typeof v=="object"&&v!==null&&(a=Yt(v));var w=i.getDerivedStateFromProps;v=typeof w=="function"||typeof s.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,v||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o||d!==a)&&Yf(t,s,n,a),Qi=!1;var V=t.memoizedState;s.state=V,Js(t,n,s,l),Qs(),d=t.memoizedState,o||V!==d||Qi?(typeof w=="function"&&(Xu(t,i,w,n),d=t.memoizedState),(c=Qi||qf(t,i,c,n,V,d,a))?(v||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=d),s.props=n,s.state=d,s.context=a,n=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{s=t.stateNode,G2(e,t),a=t.memoizedProps,v=nl(i,a),s.props=v,w=t.pendingProps,V=s.context,d=i.contextType,c=Ol,typeof d=="object"&&d!==null&&(c=Yt(d)),o=i.getDerivedStateFromProps,(d=typeof o=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==w||V!==c)&&Yf(t,s,n,c),Qi=!1,V=t.memoizedState,s.state=V,Js(t,n,s,l),Qs();var b=t.memoizedState;a!==w||V!==b||Qi||e!==null&&e.dependencies!==null&&lo(e.dependencies)?(typeof o=="function"&&(Xu(t,i,o,n),b=t.memoizedState),(v=Qi||qf(t,i,v,n,V,b,c)||e!==null&&e.dependencies!==null&&lo(e.dependencies))?(d||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,b,c),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,b,c)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||a===e.memoizedProps&&V===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&V===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=b),s.props=n,s.state=b,s.context=c,n=v):(typeof s.componentDidUpdate!="function"||a===e.memoizedProps&&V===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&V===e.memoizedState||(t.flags|=1024),n=!1)}return s=n,Ia(e,t),n=(t.flags&128)!==0,s||n?(s=t.stateNode,i=n&&typeof i.getDerivedStateFromError!="function"?null:s.render(),t.flags|=1,e!==null&&n?(t.child=el(t,e.child,null,l),t.child=el(t,null,i,l)):Pt(e,t,i,l),t.memoizedState=s.state,e=t.child):e=Bi(e,t,l),e}function t0(e,t,i,n){return Wn(),t.flags|=256,Pt(e,t,i,n),t.child}var Fu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ku(e){return{baseLanes:e,cachePool:XH()}}function Qu(e,t,i){return e=e!==null?e.childLanes&~i:0,t&&(e|=Me),e}function IV(e,t,i){var n=t.pendingProps,l=!1,s=(t.flags&128)!==0,a;if((a=s)||(a=e!==null&&e.memoizedState===null?!1:(Et.current&2)!==0),a&&(l=!0,t.flags&=-129),a=(t.flags&32)!==0,t.flags&=-33,e===null){if(et){if(l?$i(t):Wi(),(e=vt)?(e=xg(e,Be),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:wn!==null?{id:$e,overflow:We}:null,retryLane:536870912,hydrationErrors:null},i=PH(e),i.return=t,t.child=i,qt=t,vt=null)):e=null,e===null)throw Zn(t);return dc(e)?t.lanes=32:t.lanes=536870912,null}var o=n.children;return n=n.fallback,l?(Wi(),l=t.mode,o=ho({mode:"hidden",children:o},l),n=Xn(n,l,i,null),o.return=t,n.return=t,o.sibling=n,t.child=o,n=t.child,n.memoizedState=Ku(i),n.childLanes=Qu(e,a,i),t.memoizedState=Fu,js(null,n)):($i(t),tc(t,o))}var c=e.memoizedState;if(c!==null&&(o=c.dehydrated,o!==null)){if(s)t.flags&256?($i(t),t.flags&=-257,t=Ju(e,t,i)):t.memoizedState!==null?(Wi(),t.child=e.child,t.flags|=128,t=null):(Wi(),o=n.fallback,l=t.mode,n=ho({mode:"visible",children:n.children},l),o=Xn(o,l,i,null),o.flags|=2,n.return=t,o.return=t,n.sibling=o,t.child=n,el(t,e.child,null,i),n=t.child,n.memoizedState=Ku(i),n.childLanes=Qu(e,a,i),t.memoizedState=Fu,t=js(null,n));else if($i(t),dc(o)){if(a=o.nextSibling&&o.nextSibling.dataset,a)var d=a.dgst;a=d,n=Error(O(419)),n.stack="",n.digest=a,Hr({value:n,source:null,stack:null}),t=Ju(e,t,i)}else if(Nt||cs(e,t,i,!1),a=(i&e.childLanes)!==0,Nt||a){if(a=dt,a!==null&&(n=VH(a,i),n!==0&&n!==c.retryLane))throw c.retryLane=n,cl(e,n),fe(a,e,n),g1;fc(o)||go(),t=Ju(e,t,i)}else fc(o)?(t.flags|=192,t.child=e.child,t=null):(e=c.treeContext,vt=Le(o.nextSibling),qt=t,et=!0,hn=null,Be=!1,e!==null&&qH(t,e),t=tc(t,n.children),t.flags|=4096);return t}return l?(Wi(),o=n.fallback,l=t.mode,c=e.child,d=c.sibling,n=Ai(c,{mode:"hidden",children:n.children}),n.subtreeFlags=c.subtreeFlags&65011712,d!==null?o=Ai(d,o):(o=Xn(o,l,i,null),o.flags|=2),o.return=t,n.return=t,n.sibling=o,t.child=n,js(null,n),n=t.child,o=e.child.memoizedState,o===null?o=Ku(i):(l=o.cachePool,l!==null?(c=Ot._currentValue,l=l.parent!==c?{parent:c,pool:c}:l):l=XH(),o={baseLanes:o.baseLanes|i,cachePool:l}),n.memoizedState=o,n.childLanes=Qu(e,a,i),t.memoizedState=Fu,js(e.child,n)):($i(t),i=e.child,e=i.sibling,i=Ai(i,{mode:"visible",children:n.children}),i.return=t,i.sibling=null,e!==null&&(a=t.deletions,a===null?(t.deletions=[e],t.flags|=16):a.push(e)),t.child=i,t.memoizedState=null,i)}function tc(e,t){return t=ho({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function ho(e,t){return e=me(22,e,null,t),e.lanes=0,e}function Ju(e,t,i){return el(t,e.child,null,i),e=tc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function e0(e,t,i){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),U2(e.return,t,i)}function $u(e,t,i,n,l,s){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:i,tailMode:l,treeForkCount:s}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=n,a.tail=i,a.tailMode=l,a.treeForkCount=s)}function zV(e,t,i){var n=t.pendingProps,l=n.revealOrder,s=n.tail;n=n.children;var a=Et.current,o=(a&2)!==0;if(o?(a=a&1|2,t.flags|=128):a&=1,gt(Et,a),Pt(e,t,n,i),n=et?dr:0,!o&&e!==null&&e.flags&128)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&e0(e,i,t);else if(e.tag===19)e0(e,i,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(l){case"forwards":for(i=t.child,l=null;i!==null;)e=i.alternate,e!==null&&ao(e)===null&&(l=i),i=i.sibling;i=l,i===null?(l=t.child,t.child=null):(l=i.sibling,i.sibling=null),$u(t,!1,l,i,s,n);break;case"backwards":case"unstable_legacy-backwards":for(i=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&ao(e)===null){t.child=l;break}e=l.sibling,l.sibling=i,i=l,l=e}$u(t,!0,i,null,s,n);break;case"together":$u(t,!1,null,null,void 0,n);break;default:t.memoizedState=null}return t.child}function Bi(e,t,i){if(e!==null&&(t.dependencies=e.dependencies),bn|=t.lanes,!(i&t.childLanes))if(e!==null){if(cs(e,t,i,!1),(i&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(O(153));if(t.child!==null){for(e=t.child,i=Ai(e,e.pendingProps),t.child=i,i.return=t;e.sibling!==null;)e=e.sibling,i=i.sibling=Ai(e,e.pendingProps),i.return=t;i.sibling=null}return t.child}function p1(e,t){return e.lanes&t?!0:(e=e.dependencies,!!(e!==null&&lo(e)))}function Iv(e,t,i){switch(t.tag){case 3:Ja(t,t.stateNode.containerInfo),Ji(t,Ot,e.memoizedState.cache),Wn();break;case 27:case 5:T2(t);break;case 4:Ja(t,t.stateNode.containerInfo);break;case 10:Ji(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,X2(t),null;break;case 13:var n=t.memoizedState;if(n!==null)return n.dehydrated!==null?($i(t),t.flags|=128,null):i&t.child.childLanes?IV(e,t,i):($i(t),e=Bi(e,t,i),e!==null?e.sibling:null);$i(t);break;case 19:var l=(e.flags&128)!==0;if(n=(i&t.childLanes)!==0,n||(cs(e,t,i,!1),n=(i&t.childLanes)!==0),l){if(n)return zV(e,t,i);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),gt(Et,Et.current),n)break;return null;case 22:return t.lanes=0,kV(e,t,i,t.pendingProps);case 24:Ji(t,Ot,e.memoizedState.cache)}return Bi(e,t,i)}function UV(e,t,i){if(e!==null)if(e.memoizedProps!==t.pendingProps)Nt=!0;else{if(!p1(e,i)&&!(t.flags&128))return Nt=!1,Iv(e,t,i);Nt=!!(e.flags&131072)}else Nt=!1,et&&t.flags&1048576&&GH(t,dr,t.index);switch(t.lanes=0,t.tag){case 16:t:{var n=t.pendingProps;if(e=zn(t.elementType),t.type=e,typeof e=="function")Kc(e)?(n=nl(e,n),t.tag=1,t=Wf(null,t,e,n,i)):(t.tag=0,t=W2(null,t,e,n,i));else{if(e!=null){var l=e.$$typeof;if(l===Bc){t.tag=11,t=Ff(null,t,e,n,i);break t}else if(l===Dc){t.tag=14,t=Kf(null,t,e,n,i);break t}}throw t=S2(e)||e,Error(O(306,t,""))}}return t;case 0:return W2(e,t,t.type,t.pendingProps,i);case 1:return n=t.type,l=nl(n,t.pendingProps),Wf(e,t,n,l,i);case 3:t:{if(Ja(t,t.stateNode.containerInfo),e===null)throw Error(O(387));n=t.pendingProps;var s=t.memoizedState;l=s.element,G2(e,t),Js(t,n,null,i);var a=t.memoizedState;if(n=a.cache,Ji(t,Ot,n),n!==s.cache&&j2(t,[Ot],i,!0),Qs(),n=a.element,s.isDehydrated)if(s={element:n,isDehydrated:!1,cache:a.cache},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){t=t0(e,t,n,i);break t}else if(n!==l){l=Re(Error(O(424)),t),Hr(l),t=t0(e,t,n,i);break t}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(vt=Le(e.firstChild),qt=t,et=!0,hn=null,Be=!0,i=QH(t,null,n,i),t.child=i;i;)i.flags=i.flags&-3|4096,i=i.sibling}else{if(Wn(),n===l){t=Bi(e,t,i);break t}Pt(e,t,n,i)}t=t.child}return t;case 26:return Ia(e,t),e===null?(i=y0(t.type,null,t.pendingProps,null))?t.memoizedState=i:et||(i=t.type,e=t.pendingProps,n=Mo(cn.current).createElement(i),n[Gt]=t,n[de]=e,Xt(n,i,e),It(n),t.stateNode=n):t.memoizedState=y0(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return T2(t),e===null&&et&&(n=t.stateNode=Cg(t.type,t.pendingProps,cn.current),qt=t,Be=!0,l=vt,An(t.type)?(Hc=l,vt=Le(n.firstChild)):vt=l),Pt(e,t,t.pendingProps.children,i),Ia(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&et&&((l=n=vt)&&(n=V9(n,t.type,t.pendingProps,Be),n!==null?(t.stateNode=n,qt=t,vt=Le(n.firstChild),Be=!1,l=!0):l=!1),l||Zn(t)),T2(t),l=t.type,s=t.pendingProps,a=e!==null?e.memoizedProps:null,n=s.children,cc(l,s)?n=null:a!==null&&cc(l,a)&&(t.flags|=32),t.memoizedState!==null&&(l=l1(e,t,xv,null,null,i),Mr._currentValue=l),Ia(e,t),Pt(e,t,n,i),t.child;case 6:return e===null&&et&&((e=i=vt)&&(i=g9(i,t.pendingProps,Be),i!==null?(t.stateNode=i,qt=t,vt=null,e=!0):e=!1),e||Zn(t)),null;case 13:return IV(e,t,i);case 4:return Ja(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=el(t,null,n,i):Pt(e,t,n,i),t.child;case 11:return Ff(e,t,t.type,t.pendingProps,i);case 7:return Pt(e,t,t.pendingProps,i),t.child;case 8:return Pt(e,t,t.pendingProps.children,i),t.child;case 12:return Pt(e,t,t.pendingProps.children,i),t.child;case 10:return n=t.pendingProps,Ji(t,t.type,n.value),Pt(e,t,n.children,i),t.child;case 9:return l=t.type._context,n=t.pendingProps.children,tl(t),l=Yt(l),n=n(l),t.flags|=1,Pt(e,t,n,i),t.child;case 14:return Kf(e,t,t.type,t.pendingProps,i);case 15:return LV(e,t,t.type,t.pendingProps,i);case 19:return zV(e,t,i);case 31:return kv(e,t,i);case 22:return kV(e,t,i,t.pendingProps);case 24:return tl(t),n=Yt(Ot),e===null?(l=Wc(),l===null&&(l=dt,s=$c(),l.pooledCache=s,s.refCount++,s!==null&&(l.pooledCacheLanes|=i),l=s),t.memoizedState={parent:n,cache:l},e1(t),Ji(t,Ot,l)):(e.lanes&i&&(G2(e,t),Js(t,null,null,i),Qs()),l=e.memoizedState,s=t.memoizedState,l.parent!==n?(l={parent:n,cache:n},t.memoizedState=l,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=l),Ji(t,Ot,n)):(n=s.cache,Ji(t,Ot,n),n!==l.cache&&j2(t,[Ot],i,!0))),Pt(e,t,t.pendingProps.children,i),t.child;case 29:throw t.pendingProps}throw Error(O(156,t.tag))}function Vi(e){e.flags|=4}function Wu(e,t,i,n,l){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(l&335544128)===l)if(e.stateNode.complete)e.flags|=8192;else if(hg())e.flags|=8192;else throw Kn=so,t1}else e.flags&=-16777217}function i0(e,t){if(t.type!=="stylesheet"||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Rg(t))if(hg())e.flags|=8192;else throw Kn=so,t1}function ma(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?fH():536870912,e.lanes|=t,Wl|=t)}function Bs(e,t){if(!et)switch(e.tailMode){case"hidden":t=e.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e.tail=null:i.sibling=null;break;case"collapsed":i=e.tail;for(var n=null;i!==null;)i.alternate!==null&&(n=i),i=i.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function mt(e){var t=e.alternate!==null&&e.alternate.child===e.child,i=0,n=0;if(t)for(var l=e.child;l!==null;)i|=l.lanes|l.childLanes,n|=l.subtreeFlags&65011712,n|=l.flags&65011712,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)i|=l.lanes|l.childLanes,n|=l.subtreeFlags,n|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=n,e.childLanes=i,t}function zv(e,t,i){var n=t.pendingProps;switch(Jc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return mt(t),null;case 1:return mt(t),null;case 3:return i=t.stateNode,n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),xi(Ot),Xl(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(e===null||e.child===null)&&(vl(t)?Vi(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Gu())),mt(t),null;case 26:var l=t.type,s=t.memoizedState;return e===null?(Vi(t),s!==null?(mt(t),i0(t,s)):(mt(t),Wu(t,l,null,n,i))):s?s!==e.memoizedState?(Vi(t),mt(t),i0(t,s)):(mt(t),t.flags&=-16777217):(e=e.memoizedProps,e!==n&&Vi(t),mt(t),Wu(t,l,e,n,i)),null;case 27:if($a(t),i=cn.current,l=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==n&&Vi(t);else{if(!n){if(t.stateNode===null)throw Error(O(166));return mt(t),null}e=ii.current,vl(t)?Cf(t):(e=Cg(l,n,i),t.stateNode=e,Vi(t))}return mt(t),null;case 5:if($a(t),l=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==n&&Vi(t);else{if(!n){if(t.stateNode===null)throw Error(O(166));return mt(t),null}if(s=ii.current,vl(t))Cf(t);else{var a=Mo(cn.current);switch(s){case 1:s=a.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:s=a.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":s=a.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":s=a.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":s=a.createElement("div"),s.innerHTML="<script><\/script>",s=s.removeChild(s.firstChild);break;case"select":s=typeof n.is=="string"?a.createElement("select",{is:n.is}):a.createElement("select"),n.multiple?s.multiple=!0:n.size&&(s.size=n.size);break;default:s=typeof n.is=="string"?a.createElement(l,{is:n.is}):a.createElement(l)}}s[Gt]=t,s[de]=n;t:for(a=t.child;a!==null;){if(a.tag===5||a.tag===6)s.appendChild(a.stateNode);else if(a.tag!==4&&a.tag!==27&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break t;for(;a.sibling===null;){if(a.return===null||a.return===t)break t;a=a.return}a.sibling.return=a.return,a=a.sibling}t.stateNode=s;t:switch(Xt(s,l,n),l){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break t;case"img":n=!0;break t;default:n=!1}n&&Vi(t)}}return mt(t),Wu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,i),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==n&&Vi(t);else{if(typeof n!="string"&&t.stateNode===null)throw Error(O(166));if(e=cn.current,vl(t)){if(e=t.stateNode,i=t.memoizedProps,n=null,l=qt,l!==null)switch(l.tag){case 27:case 5:n=l.memoizedProps}e[Gt]=t,e=!!(e.nodeValue===i||n!==null&&n.suppressHydrationWarning===!0||Eg(e.nodeValue,i)),e||Zn(t,!0)}else e=Mo(e).createTextNode(n),e[Gt]=t,t.stateNode=e}return mt(t),null;case 31:if(i=t.memoizedState,e===null||e.memoizedState!==null){if(n=vl(t),i!==null){if(e===null){if(!n)throw Error(O(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(O(557));e[Gt]=t}else Wn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;mt(t),e=!1}else i=Gu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),e=!0;if(!e)return t.flags&256?(pe(t),t):(pe(t),null);if(t.flags&128)throw Error(O(558))}return mt(t),null;case 13:if(n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(l=vl(t),n!==null&&n.dehydrated!==null){if(e===null){if(!l)throw Error(O(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(O(317));l[Gt]=t}else Wn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;mt(t),l=!1}else l=Gu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=l),l=!0;if(!l)return t.flags&256?(pe(t),t):(pe(t),null)}return pe(t),t.flags&128?(t.lanes=i,t):(i=n!==null,e=e!==null&&e.memoizedState!==null,i&&(n=t.child,l=null,n.alternate!==null&&n.alternate.memoizedState!==null&&n.alternate.memoizedState.cachePool!==null&&(l=n.alternate.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==l&&(n.flags|=2048)),i!==e&&i&&(t.child.flags|=8192),ma(t,t.updateQueue),mt(t),null);case 4:return Xl(),e===null&&_1(t.stateNode.containerInfo),mt(t),null;case 10:return xi(t.type),mt(t),null;case 19:if(zt(Et),n=t.memoizedState,n===null)return mt(t),null;if(l=(t.flags&128)!==0,s=n.rendering,s===null)if(l)Bs(n,!1);else{if(bt!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=ao(e),s!==null){for(t.flags|=128,Bs(n,!1),e=s.updateQueue,t.updateQueue=e,ma(t,e),t.subtreeFlags=0,e=i,i=t.child;i!==null;)jH(i,e),i=i.sibling;return gt(Et,Et.current&1|2),et&&Mi(t,n.treeForkCount),t.child}e=e.sibling}n.tail!==null&&ye()>Ho&&(t.flags|=128,l=!0,Bs(n,!1),t.lanes=4194304)}else{if(!l)if(e=ao(s),e!==null){if(t.flags|=128,l=!0,e=e.updateQueue,t.updateQueue=e,ma(t,e),Bs(n,!0),n.tail===null&&n.tailMode==="hidden"&&!s.alternate&&!et)return mt(t),null}else 2*ye()-n.renderingStartTime>Ho&&i!==536870912&&(t.flags|=128,l=!0,Bs(n,!1),t.lanes=4194304);n.isBackwards?(s.sibling=t.child,t.child=s):(e=n.last,e!==null?e.sibling=s:t.child=s,n.last=s)}return n.tail!==null?(e=n.tail,n.rendering=e,n.tail=e.sibling,n.renderingStartTime=ye(),e.sibling=null,i=Et.current,gt(Et,l?i&1|2:i&1),et&&Mi(t,n.treeForkCount),e):(mt(t),null);case 22:case 23:return pe(t),i1(),n=t.memoizedState!==null,e!==null?e.memoizedState!==null!==n&&(t.flags|=8192):n&&(t.flags|=8192),n?i&536870912&&!(t.flags&128)&&(mt(t),t.subtreeFlags&6&&(t.flags|=8192)):mt(t),i=t.updateQueue,i!==null&&ma(t,i.retryQueue),i=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(i=e.memoizedState.cachePool.pool),n=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(n=t.memoizedState.cachePool.pool),n!==i&&(t.flags|=2048),e!==null&&zt(Fn),null;case 24:return i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),xi(Ot),mt(t),null;case 25:return null;case 30:return null}throw Error(O(156,t.tag))}function Uv(e,t){switch(Jc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return xi(Ot),Xl(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return $a(t),null;case 31:if(t.memoizedState!==null){if(pe(t),t.alternate===null)throw Error(O(340));Wn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(pe(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(O(340));Wn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return zt(Et),null;case 4:return Xl(),null;case 10:return xi(t.type),null;case 22:case 23:return pe(t),i1(),e!==null&&zt(Fn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return xi(Ot),null;case 25:return null;default:return null}}function jV(e,t){switch(Jc(t),t.tag){case 3:xi(Ot),Xl();break;case 26:case 27:case 5:$a(t);break;case 4:Xl();break;case 31:t.memoizedState!==null&&pe(t);break;case 13:pe(t);break;case 19:zt(Et);break;case 10:xi(t.type);break;case 22:case 23:pe(t),i1(),e!==null&&zt(Fn);break;case 24:xi(Ot)}}function Dr(e,t){try{var i=t.updateQueue,n=i!==null?i.lastEffect:null;if(n!==null){var l=n.next;i=l;do{if((i.tag&e)===e){n=void 0;var s=i.create,a=i.inst;n=s(),a.destroy=n}i=i.next}while(i!==l)}}catch(o){ut(t,t.return,o)}}function _n(e,t,i){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var s=l.next;n=s;do{if((n.tag&e)===e){var a=n.inst,o=a.destroy;if(o!==void 0){a.destroy=void 0,l=t;var c=i,d=o;try{d()}catch(v){ut(l,c,v)}}}n=n.next}while(n!==s)}}catch(v){ut(t,t.return,v)}}function PV(e){var t=e.updateQueue;if(t!==null){var i=e.stateNode;try{$H(t,i)}catch(n){ut(e,e.return,n)}}}function GV(e,t,i){i.props=nl(e.type,e.memoizedProps),i.state=e.memoizedState;try{i.componentWillUnmount()}catch(n){ut(e,t,n)}}function Ws(e,t){try{var i=e.ref;if(i!==null){switch(e.tag){case 26:case 27:case 5:var n=e.stateNode;break;case 30:n=e.stateNode;break;default:n=e.stateNode}typeof i=="function"?e.refCleanup=i(n):i.current=n}}catch(l){ut(e,t,l)}}function ti(e,t){var i=e.ref,n=e.refCleanup;if(i!==null)if(typeof n=="function")try{n()}catch(l){ut(e,t,l)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof i=="function")try{i(null)}catch(l){ut(e,t,l)}else i.current=null}function qV(e){var t=e.type,i=e.memoizedProps,n=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":i.autoFocus&&n.focus();break t;case"img":i.src?n.src=i.src:i.srcSet&&(n.srcset=i.srcSet)}}catch(l){ut(e,e.return,l)}}function t2(e,t,i){try{var n=e.stateNode;u9(n,e.type,i,t),n[de]=t}catch(l){ut(e,e.return,l)}}function YV(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&An(e.type)||e.tag===4}function e2(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||YV(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&An(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ec(e,t,i){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?(i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i).insertBefore(e,t):(t=i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i,t.appendChild(e),i=i._reactRootContainer,i!=null||t.onclick!==null||(t.onclick=bi));else if(n!==4&&(n===27&&An(e.type)&&(i=e.stateNode,t=null),e=e.child,e!==null))for(ec(e,t,i),e=e.sibling;e!==null;)ec(e,t,i),e=e.sibling}function fo(e,t,i){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?i.insertBefore(e,t):i.appendChild(e);else if(n!==4&&(n===27&&An(e.type)&&(i=e.stateNode),e=e.child,e!==null))for(fo(e,t,i),e=e.sibling;e!==null;)fo(e,t,i),e=e.sibling}function XV(e){var t=e.stateNode,i=e.memoizedProps;try{for(var n=e.type,l=t.attributes;l.length;)t.removeAttributeNode(l[0]);Xt(t,n,i),t[Gt]=e,t[de]=i}catch(s){ut(e,e.return,s)}}var yi=!1,Ct=!1,i2=!1,n0=typeof WeakSet=="function"?WeakSet:Set,kt=null;function jv(e,t){if(e=e.containerInfo,oc=_o,e=RH(e),Yc(e)){if("selectionStart"in e)var i={start:e.selectionStart,end:e.selectionEnd};else t:{i=(i=e.ownerDocument)&&i.defaultView||window;var n=i.getSelection&&i.getSelection();if(n&&n.rangeCount!==0){i=n.anchorNode;var l=n.anchorOffset,s=n.focusNode;n=n.focusOffset;try{i.nodeType,s.nodeType}catch{i=null;break t}var a=0,o=-1,c=-1,d=0,v=0,w=e,V=null;e:for(;;){for(var b;w!==i||l!==0&&w.nodeType!==3||(o=a+l),w!==s||n!==0&&w.nodeType!==3||(c=a+n),w.nodeType===3&&(a+=w.nodeValue.length),(b=w.firstChild)!==null;)V=w,w=b;for(;;){if(w===e)break e;if(V===i&&++d===l&&(o=a),V===s&&++v===n&&(c=a),(b=w.nextSibling)!==null)break;w=V,V=w.parentNode}w=b}i=o===-1||c===-1?null:{start:o,end:c}}else i=null}i=i||{start:0,end:0}}else i=null;for(uc={focusedElem:e,selectionRange:i},_o=!1,kt=t;kt!==null;)if(t=kt,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,kt=e;else for(;kt!==null;){switch(t=kt,s=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(i=0;i<e.length;i++)l=e[i],l.ref.impl=l.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&s!==null){e=void 0,i=t,l=s.memoizedProps,s=s.memoizedState,n=i.stateNode;try{var C=nl(i.type,l);e=n.getSnapshotBeforeUpdate(C,s),n.__reactInternalSnapshotBeforeUpdate=e}catch(N){ut(i,i.return,N)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,i=e.nodeType,i===9)hc(e);else if(i===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":hc(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(O(163))}if(e=t.sibling,e!==null){e.return=t.return,kt=e;break}kt=t.return}}function FV(e,t,i){var n=i.flags;switch(i.tag){case 0:case 11:case 15:pi(e,i),n&4&&Dr(5,i);break;case 1:if(pi(e,i),n&4)if(e=i.stateNode,t===null)try{e.componentDidMount()}catch(a){ut(i,i.return,a)}else{var l=nl(i.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(l,t,e.__reactInternalSnapshotBeforeUpdate)}catch(a){ut(i,i.return,a)}}n&64&&PV(i),n&512&&Ws(i,i.return);break;case 3:if(pi(e,i),n&64&&(e=i.updateQueue,e!==null)){if(t=null,i.child!==null)switch(i.child.tag){case 27:case 5:t=i.child.stateNode;break;case 1:t=i.child.stateNode}try{$H(e,t)}catch(a){ut(i,i.return,a)}}break;case 27:t===null&&n&4&&XV(i);case 26:case 5:pi(e,i),t===null&&n&4&&qV(i),n&512&&Ws(i,i.return);break;case 12:pi(e,i);break;case 31:pi(e,i),n&4&&JV(e,i);break;case 13:pi(e,i),n&4&&$V(e,i),n&64&&(e=i.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(i=Jv.bind(null,i),p9(e,i))));break;case 22:if(n=i.memoizedState!==null||yi,!n){t=t!==null&&t.memoizedState!==null||Ct,l=yi;var s=Ct;yi=n,(Ct=t)&&!s?vi(e,i,(i.subtreeFlags&8772)!==0):pi(e,i),yi=l,Ct=s}break;case 30:break;default:pi(e,i)}}function KV(e){var t=e.alternate;t!==null&&(e.alternate=null,KV(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&zc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var wt=null,ue=!1;function gi(e,t,i){for(i=i.child;i!==null;)QV(e,t,i),i=i.sibling}function QV(e,t,i){if(we&&typeof we.onCommitFiberUnmount=="function")try{we.onCommitFiberUnmount(Ar,i)}catch{}switch(i.tag){case 26:Ct||ti(i,t),gi(e,t,i),i.memoizedState?i.memoizedState.count--:i.stateNode&&(i=i.stateNode,i.parentNode.removeChild(i));break;case 27:Ct||ti(i,t);var n=wt,l=ue;An(i.type)&&(wt=i.stateNode,ue=!1),gi(e,t,i),nr(i.stateNode),wt=n,ue=l;break;case 5:Ct||ti(i,t);case 6:if(n=wt,l=ue,wt=null,gi(e,t,i),wt=n,ue=l,wt!==null)if(ue)try{(wt.nodeType===9?wt.body:wt.nodeName==="HTML"?wt.ownerDocument.body:wt).removeChild(i.stateNode)}catch(s){ut(i,t,s)}else try{wt.removeChild(i.stateNode)}catch(s){ut(i,t,s)}break;case 18:wt!==null&&(ue?(e=wt,g0(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,i.stateNode),ns(e)):g0(wt,i.stateNode));break;case 4:n=wt,l=ue,wt=i.stateNode.containerInfo,ue=!0,gi(e,t,i),wt=n,ue=l;break;case 0:case 11:case 14:case 15:_n(2,i,t),Ct||_n(4,i,t),gi(e,t,i);break;case 1:Ct||(ti(i,t),n=i.stateNode,typeof n.componentWillUnmount=="function"&&GV(i,t,n)),gi(e,t,i);break;case 21:gi(e,t,i);break;case 22:Ct=(n=Ct)||i.memoizedState!==null,gi(e,t,i),Ct=n;break;default:gi(e,t,i)}}function JV(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ns(e)}catch(i){ut(t,t.return,i)}}}function $V(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ns(e)}catch(i){ut(t,t.return,i)}}function Pv(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new n0),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new n0),t;default:throw Error(O(435,e.tag))}}function va(e,t){var i=Pv(e);t.forEach(function(n){if(!i.has(n)){i.add(n);var l=$v.bind(null,e,n);n.then(l,l)}})}function ae(e,t){var i=t.deletions;if(i!==null)for(var n=0;n<i.length;n++){var l=i[n],s=e,a=t,o=a;t:for(;o!==null;){switch(o.tag){case 27:if(An(o.type)){wt=o.stateNode,ue=!1;break t}break;case 5:wt=o.stateNode,ue=!1;break t;case 3:case 4:wt=o.stateNode.containerInfo,ue=!0;break t}o=o.return}if(wt===null)throw Error(O(160));QV(s,a,l),wt=null,ue=!1,s=l.alternate,s!==null&&(s.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)WV(t,e),t=t.sibling}var je=null;function WV(e,t){var i=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:ae(t,e),oe(e),n&4&&(_n(3,e,e.return),Dr(3,e),_n(5,e,e.return));break;case 1:ae(t,e),oe(e),n&512&&(Ct||i===null||ti(i,i.return)),n&64&&yi&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(i=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=i===null?n:i.concat(n))));break;case 26:var l=je;if(ae(t,e),oe(e),n&512&&(Ct||i===null||ti(i,i.return)),n&4){var s=i!==null?i.memoizedState:null;if(n=e.memoizedState,i===null)if(n===null)if(e.stateNode===null){t:{n=e.type,i=e.memoizedProps,l=l.ownerDocument||l;e:switch(n){case"title":s=l.getElementsByTagName("title")[0],(!s||s[Or]||s[Gt]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=l.createElement(n),l.head.insertBefore(s,l.querySelector("head > title"))),Xt(s,n,i),s[Gt]=e,It(s),n=s;break t;case"link":var a=Z0("link","href",l).get(n+(i.href||""));if(a){for(var o=0;o<a.length;o++)if(s=a[o],s.getAttribute("href")===(i.href==null||i.href===""?null:i.href)&&s.getAttribute("rel")===(i.rel==null?null:i.rel)&&s.getAttribute("title")===(i.title==null?null:i.title)&&s.getAttribute("crossorigin")===(i.crossOrigin==null?null:i.crossOrigin)){a.splice(o,1);break e}}s=l.createElement(n),Xt(s,n,i),l.head.appendChild(s);break;case"meta":if(a=Z0("meta","content",l).get(n+(i.content||""))){for(o=0;o<a.length;o++)if(s=a[o],s.getAttribute("content")===(i.content==null?null:""+i.content)&&s.getAttribute("name")===(i.name==null?null:i.name)&&s.getAttribute("property")===(i.property==null?null:i.property)&&s.getAttribute("http-equiv")===(i.httpEquiv==null?null:i.httpEquiv)&&s.getAttribute("charset")===(i.charSet==null?null:i.charSet)){a.splice(o,1);break e}}s=l.createElement(n),Xt(s,n,i),l.head.appendChild(s);break;default:throw Error(O(468,n))}s[Gt]=e,It(s),n=s}e.stateNode=n}else _0(l,e.type,e.stateNode);else e.stateNode=w0(l,n,e.memoizedProps);else s!==n?(s===null?i.stateNode!==null&&(i=i.stateNode,i.parentNode.removeChild(i)):s.count--,n===null?_0(l,e.type,e.stateNode):w0(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&t2(e,e.memoizedProps,i.memoizedProps)}break;case 27:ae(t,e),oe(e),n&512&&(Ct||i===null||ti(i,i.return)),i!==null&&n&4&&t2(e,e.memoizedProps,i.memoizedProps);break;case 5:if(ae(t,e),oe(e),n&512&&(Ct||i===null||ti(i,i.return)),e.flags&32){l=e.stateNode;try{Kl(l,"")}catch(C){ut(e,e.return,C)}}n&4&&e.stateNode!=null&&(l=e.memoizedProps,t2(e,l,i!==null?i.memoizedProps:l)),n&1024&&(i2=!0);break;case 6:if(ae(t,e),oe(e),n&4){if(e.stateNode===null)throw Error(O(162));n=e.memoizedProps,i=e.stateNode;try{i.nodeValue=n}catch(C){ut(e,e.return,C)}}break;case 3:if(ja=null,l=je,je=yo(t.containerInfo),ae(t,e),je=l,oe(e),n&4&&i!==null&&i.memoizedState.isDehydrated)try{ns(t.containerInfo)}catch(C){ut(e,e.return,C)}i2&&(i2=!1,tg(e));break;case 4:n=je,je=yo(e.stateNode.containerInfo),ae(t,e),oe(e),je=n;break;case 12:ae(t,e),oe(e);break;case 31:ae(t,e),oe(e),n&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,va(e,n)));break;case 13:ae(t,e),oe(e),e.child.flags&8192&&e.memoizedState!==null!=(i!==null&&i.memoizedState!==null)&&($o=ye()),n&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,va(e,n)));break;case 22:l=e.memoizedState!==null;var c=i!==null&&i.memoizedState!==null,d=yi,v=Ct;if(yi=d||l,Ct=v||c,ae(t,e),Ct=v,yi=d,oe(e),n&8192)t:for(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,l&&(i===null||c||yi||Ct||Un(e)),i=null,t=e;;){if(t.tag===5||t.tag===26){if(i===null){c=i=t;try{if(s=c.stateNode,l)a=s.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none";else{o=c.stateNode;var w=c.memoizedProps.style,V=w!=null&&w.hasOwnProperty("display")?w.display:null;o.style.display=V==null||typeof V=="boolean"?"":(""+V).trim()}}catch(C){ut(c,c.return,C)}}}else if(t.tag===6){if(i===null){c=t;try{c.stateNode.nodeValue=l?"":c.memoizedProps}catch(C){ut(c,c.return,C)}}}else if(t.tag===18){if(i===null){c=t;try{var b=c.stateNode;l?p0(b,!0):p0(c.stateNode,!1)}catch(C){ut(c,c.return,C)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;i===t&&(i=null),t=t.return}i===t&&(i=null),t.sibling.return=t.return,t=t.sibling}n&4&&(n=e.updateQueue,n!==null&&(i=n.retryQueue,i!==null&&(n.retryQueue=null,va(e,i))));break;case 19:ae(t,e),oe(e),n&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,va(e,n)));break;case 30:break;case 21:break;default:ae(t,e),oe(e)}}function oe(e){var t=e.flags;if(t&2){try{for(var i,n=e.return;n!==null;){if(YV(n)){i=n;break}n=n.return}if(i==null)throw Error(O(160));switch(i.tag){case 27:var l=i.stateNode,s=e2(e);fo(e,s,l);break;case 5:var a=i.stateNode;i.flags&32&&(Kl(a,""),i.flags&=-33);var o=e2(e);fo(e,o,a);break;case 3:case 4:var c=i.stateNode.containerInfo,d=e2(e);ec(e,d,c);break;default:throw Error(O(161))}}catch(v){ut(e,e.return,v)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function tg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;tg(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function pi(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)FV(e,t.alternate,t),t=t.sibling}function Un(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:_n(4,t,t.return),Un(t);break;case 1:ti(t,t.return);var i=t.stateNode;typeof i.componentWillUnmount=="function"&&GV(t,t.return,i),Un(t);break;case 27:nr(t.stateNode);case 26:case 5:ti(t,t.return),Un(t);break;case 22:t.memoizedState===null&&Un(t);break;case 30:Un(t);break;default:Un(t)}e=e.sibling}}function vi(e,t,i){for(i=i&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var n=t.alternate,l=e,s=t,a=s.flags;switch(s.tag){case 0:case 11:case 15:vi(l,s,i),Dr(4,s);break;case 1:if(vi(l,s,i),n=s,l=n.stateNode,typeof l.componentDidMount=="function")try{l.componentDidMount()}catch(d){ut(n,n.return,d)}if(n=s,l=n.updateQueue,l!==null){var o=n.stateNode;try{var c=l.shared.hiddenCallbacks;if(c!==null)for(l.shared.hiddenCallbacks=null,l=0;l<c.length;l++)JH(c[l],o)}catch(d){ut(n,n.return,d)}}i&&a&64&&PV(s),Ws(s,s.return);break;case 27:XV(s);case 26:case 5:vi(l,s,i),i&&n===null&&a&4&&qV(s),Ws(s,s.return);break;case 12:vi(l,s,i);break;case 31:vi(l,s,i),i&&a&4&&JV(l,s);break;case 13:vi(l,s,i),i&&a&4&&$V(l,s);break;case 22:s.memoizedState===null&&vi(l,s,i),Ws(s,s.return);break;case 30:break;default:vi(l,s,i)}t=t.sibling}}function m1(e,t){var i=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(i=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==i&&(e!=null&&e.refCount++,i!=null&&Rr(i))}function v1(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Rr(e))}function ze(e,t,i,n){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)eg(e,t,i,n),t=t.sibling}function eg(e,t,i,n){var l=t.flags;switch(t.tag){case 0:case 11:case 15:ze(e,t,i,n),l&2048&&Dr(9,t);break;case 1:ze(e,t,i,n);break;case 3:ze(e,t,i,n),l&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Rr(e)));break;case 12:if(l&2048){ze(e,t,i,n),e=t.stateNode;try{var s=t.memoizedProps,a=s.id,o=s.onPostCommit;typeof o=="function"&&o(a,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(c){ut(t,t.return,c)}}else ze(e,t,i,n);break;case 31:ze(e,t,i,n);break;case 13:ze(e,t,i,n);break;case 23:break;case 22:s=t.stateNode,a=t.alternate,t.memoizedState!==null?s._visibility&2?ze(e,t,i,n):tr(e,t):s._visibility&2?ze(e,t,i,n):(s._visibility|=2,wl(e,t,i,n,(t.subtreeFlags&10256)!==0||!1)),l&2048&&m1(a,t);break;case 24:ze(e,t,i,n),l&2048&&v1(t.alternate,t);break;default:ze(e,t,i,n)}}function wl(e,t,i,n,l){for(l=l&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var s=e,a=t,o=i,c=n,d=a.flags;switch(a.tag){case 0:case 11:case 15:wl(s,a,o,c,l),Dr(8,a);break;case 23:break;case 22:var v=a.stateNode;a.memoizedState!==null?v._visibility&2?wl(s,a,o,c,l):tr(s,a):(v._visibility|=2,wl(s,a,o,c,l)),l&&d&2048&&m1(a.alternate,a);break;case 24:wl(s,a,o,c,l),l&&d&2048&&v1(a.alternate,a);break;default:wl(s,a,o,c,l)}t=t.sibling}}function tr(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var i=e,n=t,l=n.flags;switch(n.tag){case 22:tr(i,n),l&2048&&m1(n.alternate,n);break;case 24:tr(i,n),l&2048&&v1(n.alternate,n);break;default:tr(i,n)}t=t.sibling}}var Ps=8192;function Ml(e,t,i){if(e.subtreeFlags&Ps)for(e=e.child;e!==null;)ig(e,t,i),e=e.sibling}function ig(e,t,i){switch(e.tag){case 26:Ml(e,t,i),e.flags&Ps&&e.memoizedState!==null&&A9(i,je,e.memoizedState,e.memoizedProps);break;case 5:Ml(e,t,i);break;case 3:case 4:var n=je;je=yo(e.stateNode.containerInfo),Ml(e,t,i),je=n;break;case 22:e.memoizedState===null&&(n=e.alternate,n!==null&&n.memoizedState!==null?(n=Ps,Ps=16777216,Ml(e,t,i),Ps=n):Ml(e,t,i));break;default:Ml(e,t,i)}}function ng(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ds(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var i=0;i<t.length;i++){var n=t[i];kt=n,sg(n,e)}ng(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)lg(e),e=e.sibling}function lg(e){switch(e.tag){case 0:case 11:case 15:Ds(e),e.flags&2048&&_n(9,e,e.return);break;case 3:Ds(e);break;case 12:Ds(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,za(e)):Ds(e);break;default:Ds(e)}}function za(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var i=0;i<t.length;i++){var n=t[i];kt=n,sg(n,e)}ng(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:_n(8,t,t.return),za(t);break;case 22:i=t.stateNode,i._visibility&2&&(i._visibility&=-3,za(t));break;default:za(t)}e=e.sibling}}function sg(e,t){for(;kt!==null;){var i=kt;switch(i.tag){case 0:case 11:case 15:_n(8,i,t);break;case 23:case 22:if(i.memoizedState!==null&&i.memoizedState.cachePool!==null){var n=i.memoizedState.cachePool.pool;n!=null&&n.refCount++}break;case 24:Rr(i.memoizedState.cache)}if(n=i.child,n!==null)n.return=i,kt=n;else t:for(i=e;kt!==null;){n=kt;var l=n.sibling,s=n.return;if(KV(n),n===i){kt=null;break t}if(l!==null){l.return=s,kt=l;break t}kt=s}}}var Gv={getCacheForType:function(e){var t=Yt(Ot),i=t.data.get(e);return i===void 0&&(i=e(),t.data.set(e,i)),i},cacheSignal:function(){return Yt(Ot).controller.signal}},qv=typeof WeakMap=="function"?WeakMap:Map,lt=0,dt=null,J=null,tt=0,ot=0,ge=null,an=!1,fs=!1,M1=!1,Di=0,bt=0,bn=0,Qn=0,y1=0,Me=0,Wl=0,er=null,ce=null,ic=!1,$o=0,rg=0,Ho=1/0,Vo=null,Hn=null,Dt=0,Vn=null,ts=null,Ci=0,nc=0,lc=null,ag=null,ir=0,sc=null;function _e(){return lt&2&&tt!==0?tt&-tt:G.T!==null?Z1():gH()}function og(){if(Me===0)if(!(tt&536870912)||et){var e=ha;ha<<=1,!(ha&3932160)&&(ha=262144),Me=e}else Me=536870912;return e=Se.current,e!==null&&(e.flags|=32),Me}function fe(e,t,i){(e===dt&&(ot===2||ot===9)||e.cancelPendingCommit!==null)&&(es(e,0),on(e,tt,Me,!1)),Cr(e,i),(!(lt&2)||e!==dt)&&(e===dt&&(!(lt&2)&&(Qn|=i),bt===4&&on(e,tt,Me,!1)),ai(e))}function ug(e,t,i){if(lt&6)throw Error(O(327));var n=!i&&(t&127)===0&&(t&e.expiredLanes)===0||xr(e,t),l=n?Fv(e,t):n2(e,t,!0),s=n;do{if(l===0){fs&&!n&&on(e,t,0,!1);break}else{if(i=e.current.alternate,s&&!Yv(i)){l=n2(e,t,!1),s=!1;continue}if(l===2){if(s=t,e.errorRecoveryDisabledLanes&s)var a=0;else a=e.pendingLanes&-536870913,a=a!==0?a:a&536870912?536870912:0;if(a!==0){t=a;t:{var o=e;l=er;var c=o.current.memoizedState.isDehydrated;if(c&&(es(o,a).flags|=256),a=n2(o,a,!1),a!==2){if(M1&&!c){o.errorRecoveryDisabledLanes|=s,Qn|=s,l=4;break t}s=ce,ce=l,s!==null&&(ce===null?ce=s:ce.push.apply(ce,s))}l=a}if(s=!1,l!==2)continue}}if(l===1){es(e,0),on(e,t,0,!0);break}t:{switch(n=e,s=l,s){case 0:case 1:throw Error(O(345));case 4:if((t&4194048)!==t)break;case 6:on(n,t,Me,!an);break t;case 2:ce=null;break;case 3:case 5:break;default:throw Error(O(329))}if((t&62914560)===t&&(l=$o+300-ye(),10<l)){if(on(n,t,Me,!an),Uo(n,0,!0)!==0)break t;Ci=t,n.timeoutHandle=Ag(l0.bind(null,n,i,ce,Vo,ic,t,Me,Qn,Wl,an,s,"Throttled",-0,0),l);break t}l0(n,i,ce,Vo,ic,t,Me,Qn,Wl,an,s,null,-0,0)}}break}while(!0);ai(e)}function l0(e,t,i,n,l,s,a,o,c,d,v,w,V,b){if(e.timeoutHandle=-1,w=t.subtreeFlags,w&8192||(w&16785408)===16785408){w={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:bi},ig(t,s,w);var C=(s&62914560)===s?$o-ye():(s&4194048)===s?rg-ye():0;if(C=x9(w,C),C!==null){Ci=s,e.cancelPendingCommit=C(r0.bind(null,e,t,s,i,n,l,a,o,c,v,w,null,V,b)),on(e,s,a,!d);return}}r0(e,t,s,i,n,l,a,o,c)}function Yv(e){for(var t=e;;){var i=t.tag;if((i===0||i===11||i===15)&&t.flags&16384&&(i=t.updateQueue,i!==null&&(i=i.stores,i!==null)))for(var n=0;n<i.length;n++){var l=i[n],s=l.getSnapshot;l=l.value;try{if(!be(s(),l))return!1}catch{return!1}}if(i=t.child,t.subtreeFlags&16384&&i!==null)i.return=t,t=i;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function on(e,t,i,n){t&=~y1,t&=~Qn,e.suspendedLanes|=t,e.pingedLanes&=~t,n&&(e.warmLanes|=t),n=e.expirationTimes;for(var l=t;0<l;){var s=31-Ze(l),a=1<<s;n[s]=-1,l&=~a}i!==0&&dH(e,i,t)}function Wo(){return lt&6?!0:(Lr(0),!1)}function w1(){if(J!==null){if(ot===0)var e=J.return;else e=J,Si=hl=null,a1(e),zl=null,Vr=0,e=J;for(;e!==null;)jV(e.alternate,e),e=e.return;J=null}}function es(e,t){var i=e.timeoutHandle;i!==-1&&(e.timeoutHandle=-1,f9(i)),i=e.cancelPendingCommit,i!==null&&(e.cancelPendingCommit=null,i()),Ci=0,w1(),dt=e,J=i=Ai(e.current,null),tt=t,ot=0,ge=null,an=!1,fs=xr(e,t),M1=!1,Wl=Me=y1=Qn=bn=bt=0,ce=er=null,ic=!1,t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var l=31-Ze(n),s=1<<l;t|=e[l],n&=~s}return Di=t,qo(),i}function cg(e,t){F=null,G.H=pr,t===hs||t===Xo?(t=Df(),ot=3):t===t1?(t=Df(),ot=4):ot=t===g1?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,ge=t,J===null&&(bt=1,co(e,Re(t,e.current)))}function hg(){var e=Se.current;return e===null?!0:(tt&4194048)===tt?De===null:(tt&62914560)===tt||tt&536870912?e===De:!1}function fg(){var e=G.H;return G.H=pr,e===null?pr:e}function dg(){var e=G.A;return G.A=Gv,e}function go(){bt=4,an||(tt&4194048)!==tt&&Se.current!==null||(fs=!0),!(bn&134217727)&&!(Qn&134217727)||dt===null||on(dt,tt,Me,!1)}function n2(e,t,i){var n=lt;lt|=2;var l=fg(),s=dg();(dt!==e||tt!==t)&&(Vo=null,es(e,t)),t=!1;var a=bt;t:do try{if(ot!==0&&J!==null){var o=J,c=ge;switch(ot){case 8:w1(),a=6;break t;case 3:case 2:case 9:case 6:Se.current===null&&(t=!0);var d=ot;if(ot=0,ge=null,Bl(e,o,c,d),i&&fs){a=0;break t}break;default:d=ot,ot=0,ge=null,Bl(e,o,c,d)}}Xv(),a=bt;break}catch(v){cg(e,v)}while(!0);return t&&e.shellSuspendCounter++,Si=hl=null,lt=n,G.H=l,G.A=s,J===null&&(dt=null,tt=0,qo()),a}function Xv(){for(;J!==null;)Hg(J)}function Fv(e,t){var i=lt;lt|=2;var n=fg(),l=dg();dt!==e||tt!==t?(Vo=null,Ho=ye()+500,es(e,t)):fs=xr(e,t);t:do try{if(ot!==0&&J!==null){t=J;var s=ge;e:switch(ot){case 1:ot=0,ge=null,Bl(e,t,s,1);break;case 2:case 9:if(Bf(s)){ot=0,ge=null,s0(t);break}t=function(){ot!==2&&ot!==9||dt!==e||(ot=7),ai(e)},s.then(t,t);break t;case 3:ot=7;break t;case 4:ot=5;break t;case 7:Bf(s)?(ot=0,ge=null,s0(t)):(ot=0,ge=null,Bl(e,t,s,7));break;case 5:var a=null;switch(J.tag){case 26:a=J.memoizedState;case 5:case 27:var o=J;if(a?Rg(a):o.stateNode.complete){ot=0,ge=null;var c=o.sibling;if(c!==null)J=c;else{var d=o.return;d!==null?(J=d,tu(d)):J=null}break e}}ot=0,ge=null,Bl(e,t,s,5);break;case 6:ot=0,ge=null,Bl(e,t,s,6);break;case 8:w1(),bt=6;break t;default:throw Error(O(462))}}Kv();break}catch(v){cg(e,v)}while(!0);return Si=hl=null,G.H=n,G.A=l,lt=i,J!==null?0:(dt=null,tt=0,qo(),bt)}function Kv(){for(;J!==null&&!mm();)Hg(J)}function Hg(e){var t=UV(e.alternate,e,Di);e.memoizedProps=e.pendingProps,t===null?tu(e):J=t}function s0(e){var t=e,i=t.alternate;switch(t.tag){case 15:case 0:t=$f(i,t,t.pendingProps,t.type,void 0,tt);break;case 11:t=$f(i,t,t.pendingProps,t.type.render,t.ref,tt);break;case 5:a1(t);default:jV(i,t),t=J=jH(t,Di),t=UV(i,t,Di)}e.memoizedProps=e.pendingProps,t===null?tu(e):J=t}function Bl(e,t,i,n){Si=hl=null,a1(t),zl=null,Vr=0;var l=t.return;try{if(Lv(e,l,t,i,tt)){bt=1,co(e,Re(i,e.current)),J=null;return}}catch(s){if(l!==null)throw J=l,s;bt=1,co(e,Re(i,e.current)),J=null;return}t.flags&32768?(et||n===1?e=!0:fs||tt&536870912?e=!1:(an=e=!0,(n===2||n===9||n===3||n===6)&&(n=Se.current,n!==null&&n.tag===13&&(n.flags|=16384))),Vg(t,e)):tu(t)}function tu(e){var t=e;do{if(t.flags&32768){Vg(t,an);return}e=t.return;var i=zv(t.alternate,t,Di);if(i!==null){J=i;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);bt===0&&(bt=5)}function Vg(e,t){do{var i=Uv(e.alternate,e);if(i!==null){i.flags&=32767,J=i;return}if(i=e.return,i!==null&&(i.flags|=32768,i.subtreeFlags=0,i.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=i}while(e!==null);bt=6,J=null}function r0(e,t,i,n,l,s,a,o,c){e.cancelPendingCommit=null;do eu();while(Dt!==0);if(lt&6)throw Error(O(327));if(t!==null){if(t===e.current)throw Error(O(177));if(s=t.lanes|t.childLanes,s|=Xc,Tm(e,i,s,a,o,c),e===dt&&(J=dt=null,tt=0),ts=t,Vn=e,Ci=i,nc=s,lc=l,ag=n,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Wv(Wa,function(){return Mg(),null})):(e.callbackNode=null,e.callbackPriority=0),n=(t.flags&13878)!==0,t.subtreeFlags&13878||n){n=G.T,G.T=null,l=st.p,st.p=2,a=lt,lt|=4;try{jv(e,t,i)}finally{lt=a,st.p=l,G.T=n}}Dt=1,gg(),pg(),mg()}}function gg(){if(Dt===1){Dt=0;var e=Vn,t=ts,i=(t.flags&13878)!==0;if(t.subtreeFlags&13878||i){i=G.T,G.T=null;var n=st.p;st.p=2;var l=lt;lt|=4;try{WV(t,e);var s=uc,a=RH(e.containerInfo),o=s.focusedElem,c=s.selectionRange;if(a!==o&&o&&o.ownerDocument&&NH(o.ownerDocument.documentElement,o)){if(c!==null&&Yc(o)){var d=c.start,v=c.end;if(v===void 0&&(v=d),"selectionStart"in o)o.selectionStart=d,o.selectionEnd=Math.min(v,o.value.length);else{var w=o.ownerDocument||document,V=w&&w.defaultView||window;if(V.getSelection){var b=V.getSelection(),C=o.textContent.length,N=Math.min(c.start,C),D=c.end===void 0?N:Math.min(c.end,C);!b.extend&&N>D&&(a=D,D=N,N=a);var Z=Tf(o,N),p=Tf(o,D);if(Z&&p&&(b.rangeCount!==1||b.anchorNode!==Z.node||b.anchorOffset!==Z.offset||b.focusNode!==p.node||b.focusOffset!==p.offset)){var _=w.createRange();_.setStart(Z.node,Z.offset),b.removeAllRanges(),N>D?(b.addRange(_),b.extend(p.node,p.offset)):(_.setEnd(p.node,p.offset),b.addRange(_))}}}}for(w=[],b=o;b=b.parentNode;)b.nodeType===1&&w.push({element:b,left:b.scrollLeft,top:b.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<w.length;o++){var A=w[o];A.element.scrollLeft=A.left,A.element.scrollTop=A.top}}_o=!!oc,uc=oc=null}finally{lt=l,st.p=n,G.T=i}}e.current=t,Dt=2}}function pg(){if(Dt===2){Dt=0;var e=Vn,t=ts,i=(t.flags&8772)!==0;if(t.subtreeFlags&8772||i){i=G.T,G.T=null;var n=st.p;st.p=2;var l=lt;lt|=4;try{FV(e,t.alternate,t)}finally{lt=l,st.p=n,G.T=i}}Dt=3}}function mg(){if(Dt===4||Dt===3){Dt=0,vm();var e=Vn,t=ts,i=Ci,n=ag;t.subtreeFlags&10256||t.flags&10256?Dt=5:(Dt=0,ts=Vn=null,vg(e,e.pendingLanes));var l=e.pendingLanes;if(l===0&&(Hn=null),Ic(i),t=t.stateNode,we&&typeof we.onCommitFiberRoot=="function")try{we.onCommitFiberRoot(Ar,t,void 0,(t.current.flags&128)===128)}catch{}if(n!==null){t=G.T,l=st.p,st.p=2,G.T=null;try{for(var s=e.onRecoverableError,a=0;a<n.length;a++){var o=n[a];s(o.value,{componentStack:o.stack})}}finally{G.T=t,st.p=l}}Ci&3&&eu(),ai(e),l=e.pendingLanes,i&261930&&l&42?e===sc?ir++:(ir=0,sc=e):ir=0,Lr(0)}}function vg(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Rr(t)))}function eu(){return gg(),pg(),mg(),Mg()}function Mg(){if(Dt!==5)return!1;var e=Vn,t=nc;nc=0;var i=Ic(Ci),n=G.T,l=st.p;try{st.p=32>i?32:i,G.T=null,i=lc,lc=null;var s=Vn,a=Ci;if(Dt=0,ts=Vn=null,Ci=0,lt&6)throw Error(O(331));var o=lt;if(lt|=4,lg(s.current),eg(s,s.current,a,i),lt=o,Lr(0,!1),we&&typeof we.onPostCommitFiberRoot=="function")try{we.onPostCommitFiberRoot(Ar,s)}catch{}return!0}finally{st.p=l,G.T=n,vg(e,t)}}function a0(e,t,i){t=Re(i,t),t=$2(e.stateNode,t,2),e=dn(e,t,2),e!==null&&(Cr(e,2),ai(e))}function ut(e,t,i){if(e.tag===3)a0(e,e,i);else for(;t!==null;){if(t.tag===3){a0(t,e,i);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Hn===null||!Hn.has(n))){e=Re(i,e),i=BV(2),n=dn(t,i,2),n!==null&&(DV(i,n,t,e),Cr(n,2),ai(n));break}}t=t.return}}function l2(e,t,i){var n=e.pingCache;if(n===null){n=e.pingCache=new qv;var l=new Set;n.set(t,l)}else l=n.get(t),l===void 0&&(l=new Set,n.set(t,l));l.has(i)||(M1=!0,l.add(i),e=Qv.bind(null,e,t,i),t.then(e,e))}function Qv(e,t,i){var n=e.pingCache;n!==null&&n.delete(t),e.pingedLanes|=e.suspendedLanes&i,e.warmLanes&=~i,dt===e&&(tt&i)===i&&(bt===4||bt===3&&(tt&62914560)===tt&&300>ye()-$o?!(lt&2)&&es(e,0):y1|=i,Wl===tt&&(Wl=0)),ai(e)}function yg(e,t){t===0&&(t=fH()),e=cl(e,t),e!==null&&(Cr(e,t),ai(e))}function Jv(e){var t=e.memoizedState,i=0;t!==null&&(i=t.retryLane),yg(e,i)}function $v(e,t){var i=0;switch(e.tag){case 31:case 13:var n=e.stateNode,l=e.memoizedState;l!==null&&(i=l.retryLane);break;case 19:n=e.stateNode;break;case 22:n=e.stateNode._retryCache;break;default:throw Error(O(314))}n!==null&&n.delete(t),yg(e,i)}function Wv(e,t){return Lc(e,t)}var po=null,Zl=null,rc=!1,mo=!1,s2=!1,un=0;function ai(e){e!==Zl&&e.next===null&&(Zl===null?po=Zl=e:Zl=Zl.next=e),mo=!0,rc||(rc=!0,e9())}function Lr(e,t){if(!s2&&mo){s2=!0;do for(var i=!1,n=po;n!==null;){if(e!==0){var l=n.pendingLanes;if(l===0)var s=0;else{var a=n.suspendedLanes,o=n.pingedLanes;s=(1<<31-Ze(42|e)+1)-1,s&=l&~(a&~o),s=s&201326741?s&201326741|1:s?s|2:0}s!==0&&(i=!0,o0(n,s))}else s=tt,s=Uo(n,n===dt?s:0,n.cancelPendingCommit!==null||n.timeoutHandle!==-1),!(s&3)||xr(n,s)||(i=!0,o0(n,s));n=n.next}while(i);s2=!1}}function t9(){wg()}function wg(){mo=rc=!1;var e=0;un!==0&&h9()&&(e=un);for(var t=ye(),i=null,n=po;n!==null;){var l=n.next,s=Zg(n,t);s===0?(n.next=null,i===null?po=l:i.next=l,l===null&&(Zl=i)):(i=n,(e!==0||s&3)&&(mo=!0)),n=l}Dt!==0&&Dt!==5||Lr(e),un!==0&&(un=0)}function Zg(e,t){for(var i=e.suspendedLanes,n=e.pingedLanes,l=e.expirationTimes,s=e.pendingLanes&-62914561;0<s;){var a=31-Ze(s),o=1<<a,c=l[a];c===-1?(!(o&i)||o&n)&&(l[a]=Em(o,t)):c<=t&&(e.expiredLanes|=o),s&=~o}if(t=dt,i=tt,i=Uo(e,e===t?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),n=e.callbackNode,i===0||e===t&&(ot===2||ot===9)||e.cancelPendingCommit!==null)return n!==null&&n!==null&&Nu(n),e.callbackNode=null,e.callbackPriority=0;if(!(i&3)||xr(e,i)){if(t=i&-i,t===e.callbackPriority)return t;switch(n!==null&&Nu(n),Ic(i)){case 2:case 8:i=cH;break;case 32:i=Wa;break;case 268435456:i=hH;break;default:i=Wa}return n=_g.bind(null,e),i=Lc(i,n),e.callbackPriority=t,e.callbackNode=i,t}return n!==null&&n!==null&&Nu(n),e.callbackPriority=2,e.callbackNode=null,2}function _g(e,t){if(Dt!==0&&Dt!==5)return e.callbackNode=null,e.callbackPriority=0,null;var i=e.callbackNode;if(eu()&&e.callbackNode!==i)return null;var n=tt;return n=Uo(e,e===dt?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),n===0?null:(ug(e,n,t),Zg(e,ye()),e.callbackNode!=null&&e.callbackNode===i?_g.bind(null,e):null)}function o0(e,t){if(eu())return null;ug(e,t,!0)}function e9(){d9(function(){lt&6?Lc(uH,t9):wg()})}function Z1(){if(un===0){var e=Ql;e===0&&(e=ca,ca<<=1,!(ca&261888)&&(ca=256)),un=e}return un}function u0(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ca(""+e)}function c0(e,t){var i=t.ownerDocument.createElement("input");return i.name=t.name,i.value=t.value,e.id&&i.setAttribute("form",e.id),t.parentNode.insertBefore(i,t),e=new FormData(e),i.parentNode.removeChild(i),e}function i9(e,t,i,n,l){if(t==="submit"&&i&&i.stateNode===l){var s=u0((l[de]||null).action),a=n.submitter;a&&(t=(t=a[de]||null)?u0(t.formAction):a.getAttribute("formAction"),t!==null&&(s=t,a=null));var o=new jo("action","action",null,n,l);e.push({event:o,listeners:[{instance:null,listener:function(){if(n.defaultPrevented){if(un!==0){var c=a?c0(l,a):new FormData(l);Q2(i,{pending:!0,data:c,method:l.method,action:s},null,c)}}else typeof s=="function"&&(o.preventDefault(),c=a?c0(l,a):new FormData(l),Q2(i,{pending:!0,data:c,method:l.method,action:s},s,c))},currentTarget:l}]})}}for(var r2=0;r2<k2.length;r2++){var a2=k2[r2],n9=a2.toLowerCase(),l9=a2[0].toUpperCase()+a2.slice(1);Fe(n9,"on"+l9)}Fe(DH,"onAnimationEnd");Fe(LH,"onAnimationIteration");Fe(kH,"onAnimationStart");Fe("dblclick","onDoubleClick");Fe("focusin","onFocus");Fe("focusout","onBlur");Fe(Mv,"onTransitionRun");Fe(yv,"onTransitionStart");Fe(wv,"onTransitionCancel");Fe(IH,"onTransitionEnd");Fl("onMouseEnter",["mouseout","mouseover"]);Fl("onMouseLeave",["mouseout","mouseover"]);Fl("onPointerEnter",["pointerout","pointerover"]);Fl("onPointerLeave",["pointerout","pointerover"]);al("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));al("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));al("onBeforeInput",["compositionend","keypress","textInput","paste"]);al("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));al("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));al("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var mr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),s9=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mr));function bg(e,t){t=(t&4)!==0;for(var i=0;i<e.length;i++){var n=e[i],l=n.event;n=n.listeners;t:{var s=void 0;if(t)for(var a=n.length-1;0<=a;a--){var o=n[a],c=o.instance,d=o.currentTarget;if(o=o.listener,c!==s&&l.isPropagationStopped())break t;s=o,l.currentTarget=d;try{s(l)}catch(v){eo(v)}l.currentTarget=null,s=c}else for(a=0;a<n.length;a++){if(o=n[a],c=o.instance,d=o.currentTarget,o=o.listener,c!==s&&l.isPropagationStopped())break t;s=o,l.currentTarget=d;try{s(l)}catch(v){eo(v)}l.currentTarget=null,s=c}}}}function Q(e,t){var i=t[x2];i===void 0&&(i=t[x2]=new Set);var n=e+"__bubble";i.has(n)||(Sg(t,e,2,!1),i.add(n))}function o2(e,t,i){var n=0;t&&(n|=4),Sg(i,e,n,t)}var Ma="_reactListening"+Math.random().toString(36).slice(2);function _1(e){if(!e[Ma]){e[Ma]=!0,pH.forEach(function(i){i!=="selectionchange"&&(s9.has(i)||o2(i,!1,e),o2(i,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ma]||(t[Ma]=!0,o2("selectionchange",!1,t))}}function Sg(e,t,i,n){switch(Ig(t)){case 2:var l=N9;break;case 8:l=R9;break;default:l=T1}i=l.bind(null,t,i,e),l=void 0,!B2||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),n?l!==void 0?e.addEventListener(t,i,{capture:!0,passive:l}):e.addEventListener(t,i,!0):l!==void 0?e.addEventListener(t,i,{passive:l}):e.addEventListener(t,i,!1)}function u2(e,t,i,n,l){var s=n;if(!(t&1)&&!(t&2)&&n!==null)t:for(;;){if(n===null)return;var a=n.tag;if(a===3||a===4){var o=n.stateNode.containerInfo;if(o===l)break;if(a===4)for(a=n.return;a!==null;){var c=a.tag;if((c===3||c===4)&&a.stateNode.containerInfo===l)return;a=a.return}for(;o!==null;){if(a=Sl(o),a===null)return;if(c=a.tag,c===5||c===6||c===26||c===27){n=s=a;continue t}o=o.parentNode}}n=n.return}bH(function(){var d=s,v=jc(i),w=[];t:{var V=zH.get(e);if(V!==void 0){var b=jo,C=e;switch(e){case"keypress":if(Na(i)===0)break t;case"keydown":case"keyup":b=$m;break;case"focusin":C="focus",b=ku;break;case"focusout":C="blur",b=ku;break;case"beforeblur":case"afterblur":b=ku;break;case"click":if(i.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=mf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=zm;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=ev;break;case DH:case LH:case kH:b=Pm;break;case IH:b=nv;break;case"scroll":case"scrollend":b=km;break;case"wheel":b=sv;break;case"copy":case"cut":case"paste":b=qm;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=Mf;break;case"toggle":case"beforetoggle":b=av}var N=(t&4)!==0,D=!N&&(e==="scroll"||e==="scrollend"),Z=N?V!==null?V+"Capture":null:V;N=[];for(var p=d,_;p!==null;){var A=p;if(_=A.stateNode,A=A.tag,A!==5&&A!==26&&A!==27||_===null||Z===null||(A=cr(p,Z),A!=null&&N.push(vr(p,A,_))),D)break;p=p.return}0<N.length&&(V=new b(V,C,null,i,v),w.push({event:V,listeners:N}))}}if(!(t&7)){t:{if(V=e==="mouseover"||e==="pointerover",b=e==="mouseout"||e==="pointerout",V&&i!==R2&&(C=i.relatedTarget||i.fromElement)&&(Sl(C)||C[os]))break t;if((b||V)&&(V=v.window===v?v:(V=v.ownerDocument)?V.defaultView||V.parentWindow:window,b?(C=i.relatedTarget||i.toElement,b=d,C=C?Sl(C):null,C!==null&&(D=Tr(C),N=C.tag,C!==D||N!==5&&N!==27&&N!==6)&&(C=null)):(b=null,C=d),b!==C)){if(N=mf,A="onMouseLeave",Z="onMouseEnter",p="mouse",(e==="pointerout"||e==="pointerover")&&(N=Mf,A="onPointerLeave",Z="onPointerEnter",p="pointer"),D=b==null?V:Us(b),_=C==null?V:Us(C),V=new N(A,p+"leave",b,i,v),V.target=D,V.relatedTarget=_,A=null,Sl(v)===d&&(N=new N(Z,p+"enter",C,i,v),N.target=_,N.relatedTarget=D,A=N),D=A,b&&C)e:{for(N=r9,Z=b,p=C,_=0,A=Z;A;A=N(A))_++;A=0;for(var R=p;R;R=N(R))A++;for(;0<_-A;)Z=N(Z),_--;for(;0<A-_;)p=N(p),A--;for(;_--;){if(Z===p||p!==null&&Z===p.alternate){N=Z;break e}Z=N(Z),p=N(p)}N=null}else N=null;b!==null&&h0(w,V,b,N,!1),C!==null&&D!==null&&h0(w,D,C,N,!0)}}t:{if(V=d?Us(d):window,b=V.nodeName&&V.nodeName.toLowerCase(),b==="select"||b==="input"&&V.type==="file")var I=_f;else if(Zf(V))if(CH)I=pv;else{I=Vv;var m=Hv}else b=V.nodeName,!b||b.toLowerCase()!=="input"||V.type!=="checkbox"&&V.type!=="radio"?d&&Uc(d.elementType)&&(I=_f):I=gv;if(I&&(I=I(e,d))){xH(w,I,i,v);break t}m&&m(e,V,d),e==="focusout"&&d&&V.type==="number"&&d.memoizedProps.value!=null&&N2(V,"number",V.value)}switch(m=d?Us(d):window,e){case"focusin":(Zf(m)||m.contentEditable==="true")&&(Al=m,D2=d,Xs=null);break;case"focusout":Xs=D2=Al=null;break;case"mousedown":L2=!0;break;case"contextmenu":case"mouseup":case"dragend":L2=!1,Af(w,i,v);break;case"selectionchange":if(vv)break;case"keydown":case"keyup":Af(w,i,v)}var f;if(qc)t:{switch(e){case"compositionstart":var g="onCompositionStart";break t;case"compositionend":g="onCompositionEnd";break t;case"compositionupdate":g="onCompositionUpdate";break t}g=void 0}else Tl?TH(e,i)&&(g="onCompositionEnd"):e==="keydown"&&i.keyCode===229&&(g="onCompositionStart");g&&(EH&&i.locale!=="ko"&&(Tl||g!=="onCompositionStart"?g==="onCompositionEnd"&&Tl&&(f=SH()):(rn=v,Pc="value"in rn?rn.value:rn.textContent,Tl=!0)),m=vo(d,g),0<m.length&&(g=new vf(g,e,null,i,v),w.push({event:g,listeners:m}),f?g.data=f:(f=AH(i),f!==null&&(g.data=f)))),(f=uv?cv(e,i):hv(e,i))&&(g=vo(d,"onBeforeInput"),0<g.length&&(m=new vf("onBeforeInput","beforeinput",null,i,v),w.push({event:m,listeners:g}),m.data=f)),i9(w,e,d,i,v)}bg(w,t)})}function vr(e,t,i){return{instance:e,listener:t,currentTarget:i}}function vo(e,t){for(var i=t+"Capture",n=[];e!==null;){var l=e,s=l.stateNode;if(l=l.tag,l!==5&&l!==26&&l!==27||s===null||(l=cr(e,i),l!=null&&n.unshift(vr(e,l,s)),l=cr(e,t),l!=null&&n.push(vr(e,l,s))),e.tag===3)return n;e=e.return}return[]}function r9(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function h0(e,t,i,n,l){for(var s=t._reactName,a=[];i!==null&&i!==n;){var o=i,c=o.alternate,d=o.stateNode;if(o=o.tag,c!==null&&c===n)break;o!==5&&o!==26&&o!==27||d===null||(c=d,l?(d=cr(i,s),d!=null&&a.unshift(vr(i,d,c))):l||(d=cr(i,s),d!=null&&a.push(vr(i,d,c)))),i=i.return}a.length!==0&&e.push({event:t,listeners:a})}var a9=/\r\n?/g,o9=/\u0000|\uFFFD/g;function f0(e){return(typeof e=="string"?e:""+e).replace(a9,`
`).replace(o9,"")}function Eg(e,t){return t=f0(t),f0(e)===t}function ct(e,t,i,n,l,s){switch(i){case"children":typeof n=="string"?t==="body"||t==="textarea"&&n===""||Kl(e,n):(typeof n=="number"||typeof n=="bigint")&&t!=="body"&&Kl(e,""+n);break;case"className":da(e,"class",n);break;case"tabIndex":da(e,"tabindex",n);break;case"dir":case"role":case"viewBox":case"width":case"height":da(e,i,n);break;case"style":_H(e,n,s);break;case"data":if(t!=="object"){da(e,"data",n);break}case"src":case"href":if(n===""&&(t!=="a"||i!=="href")){e.removeAttribute(i);break}if(n==null||typeof n=="function"||typeof n=="symbol"||typeof n=="boolean"){e.removeAttribute(i);break}n=Ca(""+n),e.setAttribute(i,n);break;case"action":case"formAction":if(typeof n=="function"){e.setAttribute(i,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof s=="function"&&(i==="formAction"?(t!=="input"&&ct(e,t,"name",l.name,l,null),ct(e,t,"formEncType",l.formEncType,l,null),ct(e,t,"formMethod",l.formMethod,l,null),ct(e,t,"formTarget",l.formTarget,l,null)):(ct(e,t,"encType",l.encType,l,null),ct(e,t,"method",l.method,l,null),ct(e,t,"target",l.target,l,null)));if(n==null||typeof n=="symbol"||typeof n=="boolean"){e.removeAttribute(i);break}n=Ca(""+n),e.setAttribute(i,n);break;case"onClick":n!=null&&(e.onclick=bi);break;case"onScroll":n!=null&&Q("scroll",e);break;case"onScrollEnd":n!=null&&Q("scrollend",e);break;case"dangerouslySetInnerHTML":if(n!=null){if(typeof n!="object"||!("__html"in n))throw Error(O(61));if(i=n.__html,i!=null){if(l.children!=null)throw Error(O(60));e.innerHTML=i}}break;case"multiple":e.multiple=n&&typeof n!="function"&&typeof n!="symbol";break;case"muted":e.muted=n&&typeof n!="function"&&typeof n!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(n==null||typeof n=="function"||typeof n=="boolean"||typeof n=="symbol"){e.removeAttribute("xlink:href");break}i=Ca(""+n),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",i);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":n!=null&&typeof n!="function"&&typeof n!="symbol"?e.setAttribute(i,""+n):e.removeAttribute(i);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":n&&typeof n!="function"&&typeof n!="symbol"?e.setAttribute(i,""):e.removeAttribute(i);break;case"capture":case"download":n===!0?e.setAttribute(i,""):n!==!1&&n!=null&&typeof n!="function"&&typeof n!="symbol"?e.setAttribute(i,n):e.removeAttribute(i);break;case"cols":case"rows":case"size":case"span":n!=null&&typeof n!="function"&&typeof n!="symbol"&&!isNaN(n)&&1<=n?e.setAttribute(i,n):e.removeAttribute(i);break;case"rowSpan":case"start":n==null||typeof n=="function"||typeof n=="symbol"||isNaN(n)?e.removeAttribute(i):e.setAttribute(i,n);break;case"popover":Q("beforetoggle",e),Q("toggle",e),xa(e,"popover",n);break;case"xlinkActuate":Hi(e,"http://www.w3.org/1999/xlink","xlink:actuate",n);break;case"xlinkArcrole":Hi(e,"http://www.w3.org/1999/xlink","xlink:arcrole",n);break;case"xlinkRole":Hi(e,"http://www.w3.org/1999/xlink","xlink:role",n);break;case"xlinkShow":Hi(e,"http://www.w3.org/1999/xlink","xlink:show",n);break;case"xlinkTitle":Hi(e,"http://www.w3.org/1999/xlink","xlink:title",n);break;case"xlinkType":Hi(e,"http://www.w3.org/1999/xlink","xlink:type",n);break;case"xmlBase":Hi(e,"http://www.w3.org/XML/1998/namespace","xml:base",n);break;case"xmlLang":Hi(e,"http://www.w3.org/XML/1998/namespace","xml:lang",n);break;case"xmlSpace":Hi(e,"http://www.w3.org/XML/1998/namespace","xml:space",n);break;case"is":xa(e,"is",n);break;case"innerText":case"textContent":break;default:(!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(i=Dm.get(i)||i,xa(e,i,n))}}function ac(e,t,i,n,l,s){switch(i){case"style":_H(e,n,s);break;case"dangerouslySetInnerHTML":if(n!=null){if(typeof n!="object"||!("__html"in n))throw Error(O(61));if(i=n.__html,i!=null){if(l.children!=null)throw Error(O(60));e.innerHTML=i}}break;case"children":typeof n=="string"?Kl(e,n):(typeof n=="number"||typeof n=="bigint")&&Kl(e,""+n);break;case"onScroll":n!=null&&Q("scroll",e);break;case"onScrollEnd":n!=null&&Q("scrollend",e);break;case"onClick":n!=null&&(e.onclick=bi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!mH.hasOwnProperty(i))t:{if(i[0]==="o"&&i[1]==="n"&&(l=i.endsWith("Capture"),t=i.slice(2,l?i.length-7:void 0),s=e[de]||null,s=s!=null?s[i]:null,typeof s=="function"&&e.removeEventListener(t,s,l),typeof n=="function")){typeof s!="function"&&s!==null&&(i in e?e[i]=null:e.hasAttribute(i)&&e.removeAttribute(i)),e.addEventListener(t,n,l);break t}i in e?e[i]=n:n===!0?e.setAttribute(i,""):xa(e,i,n)}}}function Xt(e,t,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Q("error",e),Q("load",e);var n=!1,l=!1,s;for(s in i)if(i.hasOwnProperty(s)){var a=i[s];if(a!=null)switch(s){case"src":n=!0;break;case"srcSet":l=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(O(137,t));default:ct(e,t,s,a,i,null)}}l&&ct(e,t,"srcSet",i.srcSet,i,null),n&&ct(e,t,"src",i.src,i,null);return;case"input":Q("invalid",e);var o=s=a=l=null,c=null,d=null;for(n in i)if(i.hasOwnProperty(n)){var v=i[n];if(v!=null)switch(n){case"name":l=v;break;case"type":a=v;break;case"checked":c=v;break;case"defaultChecked":d=v;break;case"value":s=v;break;case"defaultValue":o=v;break;case"children":case"dangerouslySetInnerHTML":if(v!=null)throw Error(O(137,t));break;default:ct(e,t,n,v,i,null)}}yH(e,s,o,c,d,a,l,!1);return;case"select":Q("invalid",e),n=a=s=null;for(l in i)if(i.hasOwnProperty(l)&&(o=i[l],o!=null))switch(l){case"value":s=o;break;case"defaultValue":a=o;break;case"multiple":n=o;default:ct(e,t,l,o,i,null)}t=s,i=a,e.multiple=!!n,t!=null?Ll(e,!!n,t,!1):i!=null&&Ll(e,!!n,i,!0);return;case"textarea":Q("invalid",e),s=l=n=null;for(a in i)if(i.hasOwnProperty(a)&&(o=i[a],o!=null))switch(a){case"value":n=o;break;case"defaultValue":l=o;break;case"children":s=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(O(91));break;default:ct(e,t,a,o,i,null)}ZH(e,n,l,s);return;case"option":for(c in i)if(i.hasOwnProperty(c)&&(n=i[c],n!=null))switch(c){case"selected":e.selected=n&&typeof n!="function"&&typeof n!="symbol";break;default:ct(e,t,c,n,i,null)}return;case"dialog":Q("beforetoggle",e),Q("toggle",e),Q("cancel",e),Q("close",e);break;case"iframe":case"object":Q("load",e);break;case"video":case"audio":for(n=0;n<mr.length;n++)Q(mr[n],e);break;case"image":Q("error",e),Q("load",e);break;case"details":Q("toggle",e);break;case"embed":case"source":case"link":Q("error",e),Q("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in i)if(i.hasOwnProperty(d)&&(n=i[d],n!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(O(137,t));default:ct(e,t,d,n,i,null)}return;default:if(Uc(t)){for(v in i)i.hasOwnProperty(v)&&(n=i[v],n!==void 0&&ac(e,t,v,n,i,void 0));return}}for(o in i)i.hasOwnProperty(o)&&(n=i[o],n!=null&&ct(e,t,o,n,i,null))}function u9(e,t,i,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var l=null,s=null,a=null,o=null,c=null,d=null,v=null;for(b in i){var w=i[b];if(i.hasOwnProperty(b)&&w!=null)switch(b){case"checked":break;case"value":break;case"defaultValue":c=w;default:n.hasOwnProperty(b)||ct(e,t,b,null,n,w)}}for(var V in n){var b=n[V];if(w=i[V],n.hasOwnProperty(V)&&(b!=null||w!=null))switch(V){case"type":s=b;break;case"name":l=b;break;case"checked":d=b;break;case"defaultChecked":v=b;break;case"value":a=b;break;case"defaultValue":o=b;break;case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(O(137,t));break;default:b!==w&&ct(e,t,V,b,n,w)}}O2(e,a,o,c,d,v,s,l);return;case"select":b=a=o=V=null;for(s in i)if(c=i[s],i.hasOwnProperty(s)&&c!=null)switch(s){case"value":break;case"multiple":b=c;default:n.hasOwnProperty(s)||ct(e,t,s,null,n,c)}for(l in n)if(s=n[l],c=i[l],n.hasOwnProperty(l)&&(s!=null||c!=null))switch(l){case"value":V=s;break;case"defaultValue":o=s;break;case"multiple":a=s;default:s!==c&&ct(e,t,l,s,n,c)}t=o,i=a,n=b,V!=null?Ll(e,!!i,V,!1):!!n!=!!i&&(t!=null?Ll(e,!!i,t,!0):Ll(e,!!i,i?[]:"",!1));return;case"textarea":b=V=null;for(o in i)if(l=i[o],i.hasOwnProperty(o)&&l!=null&&!n.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:ct(e,t,o,null,n,l)}for(a in n)if(l=n[a],s=i[a],n.hasOwnProperty(a)&&(l!=null||s!=null))switch(a){case"value":V=l;break;case"defaultValue":b=l;break;case"children":break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(O(91));break;default:l!==s&&ct(e,t,a,l,n,s)}wH(e,V,b);return;case"option":for(var C in i)if(V=i[C],i.hasOwnProperty(C)&&V!=null&&!n.hasOwnProperty(C))switch(C){case"selected":e.selected=!1;break;default:ct(e,t,C,null,n,V)}for(c in n)if(V=n[c],b=i[c],n.hasOwnProperty(c)&&V!==b&&(V!=null||b!=null))switch(c){case"selected":e.selected=V&&typeof V!="function"&&typeof V!="symbol";break;default:ct(e,t,c,V,n,b)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var N in i)V=i[N],i.hasOwnProperty(N)&&V!=null&&!n.hasOwnProperty(N)&&ct(e,t,N,null,n,V);for(d in n)if(V=n[d],b=i[d],n.hasOwnProperty(d)&&V!==b&&(V!=null||b!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(V!=null)throw Error(O(137,t));break;default:ct(e,t,d,V,n,b)}return;default:if(Uc(t)){for(var D in i)V=i[D],i.hasOwnProperty(D)&&V!==void 0&&!n.hasOwnProperty(D)&&ac(e,t,D,void 0,n,V);for(v in n)V=n[v],b=i[v],!n.hasOwnProperty(v)||V===b||V===void 0&&b===void 0||ac(e,t,v,V,n,b);return}}for(var Z in i)V=i[Z],i.hasOwnProperty(Z)&&V!=null&&!n.hasOwnProperty(Z)&&ct(e,t,Z,null,n,V);for(w in n)V=n[w],b=i[w],!n.hasOwnProperty(w)||V===b||V==null&&b==null||ct(e,t,w,V,n,b)}function d0(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function c9(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,i=performance.getEntriesByType("resource"),n=0;n<i.length;n++){var l=i[n],s=l.transferSize,a=l.initiatorType,o=l.duration;if(s&&o&&d0(a)){for(a=0,o=l.responseEnd,n+=1;n<i.length;n++){var c=i[n],d=c.startTime;if(d>o)break;var v=c.transferSize,w=c.initiatorType;v&&d0(w)&&(c=c.responseEnd,a+=v*(c<o?1:(o-d)/(c-d)))}if(--n,t+=8*(s+a)/(l.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var oc=null,uc=null;function Mo(e){return e.nodeType===9?e:e.ownerDocument}function H0(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Tg(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function cc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var c2=null;function h9(){var e=window.event;return e&&e.type==="popstate"?e===c2?!1:(c2=e,!0):(c2=null,!1)}var Ag=typeof setTimeout=="function"?setTimeout:void 0,f9=typeof clearTimeout=="function"?clearTimeout:void 0,V0=typeof Promise=="function"?Promise:void 0,d9=typeof queueMicrotask=="function"?queueMicrotask:typeof V0<"u"?function(e){return V0.resolve(null).then(e).catch(H9)}:Ag;function H9(e){setTimeout(function(){throw e})}function An(e){return e==="head"}function g0(e,t){var i=t,n=0;do{var l=i.nextSibling;if(e.removeChild(i),l&&l.nodeType===8)if(i=l.data,i==="/$"||i==="/&"){if(n===0){e.removeChild(l),ns(t);return}n--}else if(i==="$"||i==="$?"||i==="$~"||i==="$!"||i==="&")n++;else if(i==="html")nr(e.ownerDocument.documentElement);else if(i==="head"){i=e.ownerDocument.head,nr(i);for(var s=i.firstChild;s;){var a=s.nextSibling,o=s.nodeName;s[Or]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&s.rel.toLowerCase()==="stylesheet"||i.removeChild(s),s=a}}else i==="body"&&nr(e.ownerDocument.body);i=l}while(i);ns(t)}function p0(e,t){var i=e;e=0;do{var n=i.nextSibling;if(i.nodeType===1?t?(i._stashedDisplay=i.style.display,i.style.display="none"):(i.style.display=i._stashedDisplay||"",i.getAttribute("style")===""&&i.removeAttribute("style")):i.nodeType===3&&(t?(i._stashedText=i.nodeValue,i.nodeValue=""):i.nodeValue=i._stashedText||""),n&&n.nodeType===8)if(i=n.data,i==="/$"){if(e===0)break;e--}else i!=="$"&&i!=="$?"&&i!=="$~"&&i!=="$!"||e++;i=n}while(i)}function hc(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var i=t;switch(t=t.nextSibling,i.nodeName){case"HTML":case"HEAD":case"BODY":hc(i),zc(i);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(i.rel.toLowerCase()==="stylesheet")continue}e.removeChild(i)}}function V9(e,t,i,n){for(;e.nodeType===1;){var l=i;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!n&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(n){if(!e[Or])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(s=e.getAttribute("rel"),s==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(s!==l.rel||e.getAttribute("href")!==(l.href==null||l.href===""?null:l.href)||e.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin)||e.getAttribute("title")!==(l.title==null?null:l.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(s=e.getAttribute("src"),(s!==(l.src==null?null:l.src)||e.getAttribute("type")!==(l.type==null?null:l.type)||e.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin))&&s&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var s=l.name==null?null:""+l.name;if(l.type==="hidden"&&e.getAttribute("name")===s)return e}else return e;if(e=Le(e.nextSibling),e===null)break}return null}function g9(e,t,i){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!i||(e=Le(e.nextSibling),e===null))return null;return e}function xg(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Le(e.nextSibling),e===null))return null;return e}function fc(e){return e.data==="$?"||e.data==="$~"}function dc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function p9(e,t){var i=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||i.readyState!=="loading")t();else{var n=function(){t(),i.removeEventListener("DOMContentLoaded",n)};i.addEventListener("DOMContentLoaded",n),e._reactRetry=n}}function Le(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Hc=null;function m0(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var i=e.data;if(i==="/$"||i==="/&"){if(t===0)return Le(e.nextSibling);t--}else i!=="$"&&i!=="$!"&&i!=="$?"&&i!=="$~"&&i!=="&"||t++}e=e.nextSibling}return null}function v0(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var i=e.data;if(i==="$"||i==="$!"||i==="$?"||i==="$~"||i==="&"){if(t===0)return e;t--}else i!=="/$"&&i!=="/&"||t++}e=e.previousSibling}return null}function Cg(e,t,i){switch(t=Mo(i),e){case"html":if(e=t.documentElement,!e)throw Error(O(452));return e;case"head":if(e=t.head,!e)throw Error(O(453));return e;case"body":if(e=t.body,!e)throw Error(O(454));return e;default:throw Error(O(451))}}function nr(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);zc(e)}var ke=new Map,M0=new Set;function yo(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ii=st.d;st.d={f:m9,r:v9,D:M9,C:y9,L:w9,m:Z9,X:b9,S:_9,M:S9};function m9(){var e=Ii.f(),t=Wo();return e||t}function v9(e){var t=us(e);t!==null&&t.tag===5&&t.type==="form"?_V(t):Ii.r(e)}var ds=typeof document>"u"?null:document;function Og(e,t,i){var n=ds;if(n&&typeof t=="string"&&t){var l=Ne(t);l='link[rel="'+e+'"][href="'+l+'"]',typeof i=="string"&&(l+='[crossorigin="'+i+'"]'),M0.has(l)||(M0.add(l),e={rel:e,crossOrigin:i,href:t},n.querySelector(l)===null&&(t=n.createElement("link"),Xt(t,"link",e),It(t),n.head.appendChild(t)))}}function M9(e){Ii.D(e),Og("dns-prefetch",e,null)}function y9(e,t){Ii.C(e,t),Og("preconnect",e,t)}function w9(e,t,i){Ii.L(e,t,i);var n=ds;if(n&&e&&t){var l='link[rel="preload"][as="'+Ne(t)+'"]';t==="image"&&i&&i.imageSrcSet?(l+='[imagesrcset="'+Ne(i.imageSrcSet)+'"]',typeof i.imageSizes=="string"&&(l+='[imagesizes="'+Ne(i.imageSizes)+'"]')):l+='[href="'+Ne(e)+'"]';var s=l;switch(t){case"style":s=is(e);break;case"script":s=Hs(e)}ke.has(s)||(e=yt({rel:"preload",href:t==="image"&&i&&i.imageSrcSet?void 0:e,as:t},i),ke.set(s,e),n.querySelector(l)!==null||t==="style"&&n.querySelector(kr(s))||t==="script"&&n.querySelector(Ir(s))||(t=n.createElement("link"),Xt(t,"link",e),It(t),n.head.appendChild(t)))}}function Z9(e,t){Ii.m(e,t);var i=ds;if(i&&e){var n=t&&typeof t.as=="string"?t.as:"script",l='link[rel="modulepreload"][as="'+Ne(n)+'"][href="'+Ne(e)+'"]',s=l;switch(n){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":s=Hs(e)}if(!ke.has(s)&&(e=yt({rel:"modulepreload",href:e},t),ke.set(s,e),i.querySelector(l)===null)){switch(n){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(i.querySelector(Ir(s)))return}n=i.createElement("link"),Xt(n,"link",e),It(n),i.head.appendChild(n)}}}function _9(e,t,i){Ii.S(e,t,i);var n=ds;if(n&&e){var l=Dl(n).hoistableStyles,s=is(e);t=t||"default";var a=l.get(s);if(!a){var o={loading:0,preload:null};if(a=n.querySelector(kr(s)))o.loading=5;else{e=yt({rel:"stylesheet",href:e,"data-precedence":t},i),(i=ke.get(s))&&b1(e,i);var c=a=n.createElement("link");It(c),Xt(c,"link",e),c._p=new Promise(function(d,v){c.onload=d,c.onerror=v}),c.addEventListener("load",function(){o.loading|=1}),c.addEventListener("error",function(){o.loading|=2}),o.loading|=4,Ua(a,t,n)}a={type:"stylesheet",instance:a,count:1,state:o},l.set(s,a)}}}function b9(e,t){Ii.X(e,t);var i=ds;if(i&&e){var n=Dl(i).hoistableScripts,l=Hs(e),s=n.get(l);s||(s=i.querySelector(Ir(l)),s||(e=yt({src:e,async:!0},t),(t=ke.get(l))&&S1(e,t),s=i.createElement("script"),It(s),Xt(s,"link",e),i.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},n.set(l,s))}}function S9(e,t){Ii.M(e,t);var i=ds;if(i&&e){var n=Dl(i).hoistableScripts,l=Hs(e),s=n.get(l);s||(s=i.querySelector(Ir(l)),s||(e=yt({src:e,async:!0,type:"module"},t),(t=ke.get(l))&&S1(e,t),s=i.createElement("script"),It(s),Xt(s,"link",e),i.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},n.set(l,s))}}function y0(e,t,i,n){var l=(l=cn.current)?yo(l):null;if(!l)throw Error(O(446));switch(e){case"meta":case"title":return null;case"style":return typeof i.precedence=="string"&&typeof i.href=="string"?(t=is(i.href),i=Dl(l).hoistableStyles,n=i.get(t),n||(n={type:"style",instance:null,count:0,state:null},i.set(t,n)),n):{type:"void",instance:null,count:0,state:null};case"link":if(i.rel==="stylesheet"&&typeof i.href=="string"&&typeof i.precedence=="string"){e=is(i.href);var s=Dl(l).hoistableStyles,a=s.get(e);if(a||(l=l.ownerDocument||l,a={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},s.set(e,a),(s=l.querySelector(kr(e)))&&!s._p&&(a.instance=s,a.state.loading=5),ke.has(e)||(i={rel:"preload",as:"style",href:i.href,crossOrigin:i.crossOrigin,integrity:i.integrity,media:i.media,hrefLang:i.hrefLang,referrerPolicy:i.referrerPolicy},ke.set(e,i),s||E9(l,e,i,a.state))),t&&n===null)throw Error(O(528,""));return a}if(t&&n!==null)throw Error(O(529,""));return null;case"script":return t=i.async,i=i.src,typeof i=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Hs(i),i=Dl(l).hoistableScripts,n=i.get(t),n||(n={type:"script",instance:null,count:0,state:null},i.set(t,n)),n):{type:"void",instance:null,count:0,state:null};default:throw Error(O(444,e))}}function is(e){return'href="'+Ne(e)+'"'}function kr(e){return'link[rel="stylesheet"]['+e+"]"}function Ng(e){return yt({},e,{"data-precedence":e.precedence,precedence:null})}function E9(e,t,i,n){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?n.loading=1:(t=e.createElement("link"),n.preload=t,t.addEventListener("load",function(){return n.loading|=1}),t.addEventListener("error",function(){return n.loading|=2}),Xt(t,"link",i),It(t),e.head.appendChild(t))}function Hs(e){return'[src="'+Ne(e)+'"]'}function Ir(e){return"script[async]"+e}function w0(e,t,i){if(t.count++,t.instance===null)switch(t.type){case"style":var n=e.querySelector('style[data-href~="'+Ne(i.href)+'"]');if(n)return t.instance=n,It(n),n;var l=yt({},i,{"data-href":i.href,"data-precedence":i.precedence,href:null,precedence:null});return n=(e.ownerDocument||e).createElement("style"),It(n),Xt(n,"style",l),Ua(n,i.precedence,e),t.instance=n;case"stylesheet":l=is(i.href);var s=e.querySelector(kr(l));if(s)return t.state.loading|=4,t.instance=s,It(s),s;n=Ng(i),(l=ke.get(l))&&b1(n,l),s=(e.ownerDocument||e).createElement("link"),It(s);var a=s;return a._p=new Promise(function(o,c){a.onload=o,a.onerror=c}),Xt(s,"link",n),t.state.loading|=4,Ua(s,i.precedence,e),t.instance=s;case"script":return s=Hs(i.src),(l=e.querySelector(Ir(s)))?(t.instance=l,It(l),l):(n=i,(l=ke.get(s))&&(n=yt({},i),S1(n,l)),e=e.ownerDocument||e,l=e.createElement("script"),It(l),Xt(l,"link",n),e.head.appendChild(l),t.instance=l);case"void":return null;default:throw Error(O(443,t.type))}else t.type==="stylesheet"&&!(t.state.loading&4)&&(n=t.instance,t.state.loading|=4,Ua(n,i.precedence,e));return t.instance}function Ua(e,t,i){for(var n=i.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),l=n.length?n[n.length-1]:null,s=l,a=0;a<n.length;a++){var o=n[a];if(o.dataset.precedence===t)s=o;else if(s!==l)break}s?s.parentNode.insertBefore(e,s.nextSibling):(t=i.nodeType===9?i.head:i,t.insertBefore(e,t.firstChild))}function b1(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function S1(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var ja=null;function Z0(e,t,i){if(ja===null){var n=new Map,l=ja=new Map;l.set(i,n)}else l=ja,n=l.get(i),n||(n=new Map,l.set(i,n));if(n.has(e))return n;for(n.set(e,null),i=i.getElementsByTagName(e),l=0;l<i.length;l++){var s=i[l];if(!(s[Or]||s[Gt]||e==="link"&&s.getAttribute("rel")==="stylesheet")&&s.namespaceURI!=="http://www.w3.org/2000/svg"){var a=s.getAttribute(t)||"";a=e+a;var o=n.get(a);o?o.push(s):n.set(a,[s])}}return n}function _0(e,t,i){e=e.ownerDocument||e,e.head.insertBefore(i,t==="title"?e.querySelector("head > title"):null)}function T9(e,t,i){if(i===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Rg(e){return!(e.type==="stylesheet"&&!(e.state.loading&3))}function A9(e,t,i,n){if(i.type==="stylesheet"&&(typeof n.media!="string"||matchMedia(n.media).matches!==!1)&&!(i.state.loading&4)){if(i.instance===null){var l=is(n.href),s=t.querySelector(kr(l));if(s){t=s._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=wo.bind(e),t.then(e,e)),i.state.loading|=4,i.instance=s,It(s);return}s=t.ownerDocument||t,n=Ng(n),(l=ke.get(l))&&b1(n,l),s=s.createElement("link"),It(s);var a=s;a._p=new Promise(function(o,c){a.onload=o,a.onerror=c}),Xt(s,"link",n),i.instance=s}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(i,t),(t=i.state.preload)&&!(i.state.loading&3)&&(e.count++,i=wo.bind(e),t.addEventListener("load",i),t.addEventListener("error",i))}}var h2=0;function x9(e,t){return e.stylesheets&&e.count===0&&Pa(e,e.stylesheets),0<e.count||0<e.imgCount?function(i){var n=setTimeout(function(){if(e.stylesheets&&Pa(e,e.stylesheets),e.unsuspend){var s=e.unsuspend;e.unsuspend=null,s()}},6e4+t);0<e.imgBytes&&h2===0&&(h2=62500*c9());var l=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Pa(e,e.stylesheets),e.unsuspend)){var s=e.unsuspend;e.unsuspend=null,s()}},(e.imgBytes>h2?50:800)+t);return e.unsuspend=i,function(){e.unsuspend=null,clearTimeout(n),clearTimeout(l)}}:null}function wo(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Pa(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Zo=null;function Pa(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Zo=new Map,t.forEach(C9,e),Zo=null,wo.call(e))}function C9(e,t){if(!(t.state.loading&4)){var i=Zo.get(e);if(i)var n=i.get(null);else{i=new Map,Zo.set(e,i);for(var l=e.querySelectorAll("link[data-precedence],style[data-precedence]"),s=0;s<l.length;s++){var a=l[s];(a.nodeName==="LINK"||a.getAttribute("media")!=="not all")&&(i.set(a.dataset.precedence,a),n=a)}n&&i.set(null,n)}l=t.instance,a=l.getAttribute("data-precedence"),s=i.get(a)||n,s===n&&i.set(null,l),i.set(a,l),this.count++,n=wo.bind(this),l.addEventListener("load",n),l.addEventListener("error",n),s?s.parentNode.insertBefore(l,s.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(l,e.firstChild)),t.state.loading|=4}}var Mr={$$typeof:_i,Provider:null,Consumer:null,_currentValue:Yn,_currentValue2:Yn,_threadCount:0};function O9(e,t,i,n,l,s,a,o,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ru(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ru(0),this.hiddenUpdates=Ru(null),this.identifierPrefix=n,this.onUncaughtError=l,this.onCaughtError=s,this.onRecoverableError=a,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function Bg(e,t,i,n,l,s,a,o,c,d,v,w){return e=new O9(e,t,i,a,c,d,v,w,o),t=1,s===!0&&(t|=24),s=me(3,null,null,t),e.current=s,s.stateNode=e,t=$c(),t.refCount++,e.pooledCache=t,t.refCount++,s.memoizedState={element:n,isDehydrated:i,cache:t},e1(s),e}function Dg(e){return e?(e=Ol,e):Ol}function Lg(e,t,i,n,l,s){l=Dg(l),n.context===null?n.context=l:n.pendingContext=l,n=fn(t),n.payload={element:i},s=s===void 0?null:s,s!==null&&(n.callback=s),i=dn(e,n,t),i!==null&&(fe(i,e,t),Ks(i,e,t))}function b0(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var i=e.retryLane;e.retryLane=i!==0&&i<t?i:t}}function E1(e,t){b0(e,t),(e=e.alternate)&&b0(e,t)}function kg(e){if(e.tag===13||e.tag===31){var t=cl(e,67108864);t!==null&&fe(t,e,67108864),E1(e,67108864)}}function S0(e){if(e.tag===13||e.tag===31){var t=_e();t=kc(t);var i=cl(e,t);i!==null&&fe(i,e,t),E1(e,t)}}var _o=!0;function N9(e,t,i,n){var l=G.T;G.T=null;var s=st.p;try{st.p=2,T1(e,t,i,n)}finally{st.p=s,G.T=l}}function R9(e,t,i,n){var l=G.T;G.T=null;var s=st.p;try{st.p=8,T1(e,t,i,n)}finally{st.p=s,G.T=l}}function T1(e,t,i,n){if(_o){var l=Vc(n);if(l===null)u2(e,t,n,bo,i),E0(e,n);else if(D9(l,e,t,i,n))n.stopPropagation();else if(E0(e,n),t&4&&-1<B9.indexOf(e)){for(;l!==null;){var s=us(l);if(s!==null)switch(s.tag){case 3:if(s=s.stateNode,s.current.memoizedState.isDehydrated){var a=In(s.pendingLanes);if(a!==0){var o=s;for(o.pendingLanes|=2,o.entangledLanes|=2;a;){var c=1<<31-Ze(a);o.entanglements[1]|=c,a&=~c}ai(s),!(lt&6)&&(Ho=ye()+500,Lr(0))}}break;case 31:case 13:o=cl(s,2),o!==null&&fe(o,s,2),Wo(),E1(s,2)}if(s=Vc(n),s===null&&u2(e,t,n,bo,i),s===l)break;l=s}l!==null&&n.stopPropagation()}else u2(e,t,n,null,i)}}function Vc(e){return e=jc(e),A1(e)}var bo=null;function A1(e){if(bo=null,e=Sl(e),e!==null){var t=Tr(e);if(t===null)e=null;else{var i=t.tag;if(i===13){if(e=lH(t),e!==null)return e;e=null}else if(i===31){if(e=sH(t),e!==null)return e;e=null}else if(i===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return bo=e,null}function Ig(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Mm()){case uH:return 2;case cH:return 8;case Wa:case ym:return 32;case hH:return 268435456;default:return 32}default:return 32}}var gc=!1,gn=null,pn=null,mn=null,yr=new Map,wr=new Map,tn=[],B9="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function E0(e,t){switch(e){case"focusin":case"focusout":gn=null;break;case"dragenter":case"dragleave":pn=null;break;case"mouseover":case"mouseout":mn=null;break;case"pointerover":case"pointerout":yr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":wr.delete(t.pointerId)}}function Ls(e,t,i,n,l,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:i,eventSystemFlags:n,nativeEvent:s,targetContainers:[l]},t!==null&&(t=us(t),t!==null&&kg(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function D9(e,t,i,n,l){switch(t){case"focusin":return gn=Ls(gn,e,t,i,n,l),!0;case"dragenter":return pn=Ls(pn,e,t,i,n,l),!0;case"mouseover":return mn=Ls(mn,e,t,i,n,l),!0;case"pointerover":var s=l.pointerId;return yr.set(s,Ls(yr.get(s)||null,e,t,i,n,l)),!0;case"gotpointercapture":return s=l.pointerId,wr.set(s,Ls(wr.get(s)||null,e,t,i,n,l)),!0}return!1}function zg(e){var t=Sl(e.target);if(t!==null){var i=Tr(t);if(i!==null){if(t=i.tag,t===13){if(t=lH(i),t!==null){e.blockedOn=t,hf(e.priority,function(){S0(i)});return}}else if(t===31){if(t=sH(i),t!==null){e.blockedOn=t,hf(e.priority,function(){S0(i)});return}}else if(t===3&&i.stateNode.current.memoizedState.isDehydrated){e.blockedOn=i.tag===3?i.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ga(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var i=Vc(e.nativeEvent);if(i===null){i=e.nativeEvent;var n=new i.constructor(i.type,i);R2=n,i.target.dispatchEvent(n),R2=null}else return t=us(i),t!==null&&kg(t),e.blockedOn=i,!1;t.shift()}return!0}function T0(e,t,i){Ga(e)&&i.delete(t)}function L9(){gc=!1,gn!==null&&Ga(gn)&&(gn=null),pn!==null&&Ga(pn)&&(pn=null),mn!==null&&Ga(mn)&&(mn=null),yr.forEach(T0),wr.forEach(T0)}function ya(e,t){e.blockedOn===t&&(e.blockedOn=null,gc||(gc=!0,Lt.unstable_scheduleCallback(Lt.unstable_NormalPriority,L9)))}var wa=null;function A0(e){wa!==e&&(wa=e,Lt.unstable_scheduleCallback(Lt.unstable_NormalPriority,function(){wa===e&&(wa=null);for(var t=0;t<e.length;t+=3){var i=e[t],n=e[t+1],l=e[t+2];if(typeof n!="function"){if(A1(n||i)===null)continue;break}var s=us(i);s!==null&&(e.splice(t,3),t-=3,Q2(s,{pending:!0,data:l,method:i.method,action:n},n,l))}}))}function ns(e){function t(c){return ya(c,e)}gn!==null&&ya(gn,e),pn!==null&&ya(pn,e),mn!==null&&ya(mn,e),yr.forEach(t),wr.forEach(t);for(var i=0;i<tn.length;i++){var n=tn[i];n.blockedOn===e&&(n.blockedOn=null)}for(;0<tn.length&&(i=tn[0],i.blockedOn===null);)zg(i),i.blockedOn===null&&tn.shift();if(i=(e.ownerDocument||e).$$reactFormReplay,i!=null)for(n=0;n<i.length;n+=3){var l=i[n],s=i[n+1],a=l[de]||null;if(typeof s=="function")a||A0(i);else if(a){var o=null;if(s&&s.hasAttribute("formAction")){if(l=s,a=s[de]||null)o=a.formAction;else if(A1(l)!==null)continue}else o=a.action;typeof o=="function"?i[n+1]=o:(i.splice(n,3),n-=3),A0(i)}}}function Ug(){function e(s){s.canIntercept&&s.info==="react-transition"&&s.intercept({handler:function(){return new Promise(function(a){return l=a})},focusReset:"manual",scroll:"manual"})}function t(){l!==null&&(l(),l=null),n||setTimeout(i,20)}function i(){if(!n&&!navigation.transition){var s=navigation.currentEntry;s&&s.url!=null&&navigation.navigate(s.url,{state:s.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var n=!1,l=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(i,100),function(){n=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),l!==null&&(l(),l=null)}}}function x1(e){this._internalRoot=e}iu.prototype.render=x1.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(O(409));var i=t.current,n=_e();Lg(i,n,e,t,null,null)};iu.prototype.unmount=x1.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Lg(e.current,2,null,e,null,null),Wo(),t[os]=null}};function iu(e){this._internalRoot=e}iu.prototype.unstable_scheduleHydration=function(e){if(e){var t=gH();e={blockedOn:null,target:e,priority:t};for(var i=0;i<tn.length&&t!==0&&t<tn[i].priority;i++);tn.splice(i,0,e),i===0&&zg(e)}};var x0=iH.version;if(x0!=="19.2.4")throw Error(O(527,x0,"19.2.4"));st.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(O(188)):(e=Object.keys(e).join(","),Error(O(268,e)));return e=dm(t),e=e!==null?rH(e):null,e=e===null?null:e.stateNode,e};var k9={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:G,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Za=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Za.isDisabled&&Za.supportsFiber)try{Ar=Za.inject(k9),we=Za}catch{}}Io.createRoot=function(e,t){if(!nH(e))throw Error(O(299));var i=!1,n="",l=OV,s=NV,a=RV;return t!=null&&(t.unstable_strictMode===!0&&(i=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onUncaughtError!==void 0&&(l=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=Bg(e,1,!1,null,null,i,n,null,l,s,a,Ug),e[os]=t.current,_1(e),new x1(t)};Io.hydrateRoot=function(e,t,i){if(!nH(e))throw Error(O(299));var n=!1,l="",s=OV,a=NV,o=RV,c=null;return i!=null&&(i.unstable_strictMode===!0&&(n=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onUncaughtError!==void 0&&(s=i.onUncaughtError),i.onCaughtError!==void 0&&(a=i.onCaughtError),i.onRecoverableError!==void 0&&(o=i.onRecoverableError),i.formState!==void 0&&(c=i.formState)),t=Bg(e,1,!0,t,i??null,n,l,c,s,a,o,Ug),t.context=Dg(null),i=t.current,n=_e(),n=kc(n),l=fn(n),l.callback=null,dn(i,l,n),i=n,t.current.lanes=i,Cr(t,i),ai(t),e[os]=t.current,_1(e),new iu(t)};Io.version="19.2.4";function jg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(jg)}catch(e){console.error(e)}}jg(),Pd.exports=Io;var I9=Pd.exports;function Pg(e){var t,i,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var l=e.length;for(t=0;t<l;t++)e[t]&&(i=Pg(e[t]))&&(n&&(n+=" "),n+=i)}else for(i in e)e[i]&&(n&&(n+=" "),n+=i);return n}function Gg(){for(var e,t,i=0,n="",l=arguments.length;i<l;i++)(e=arguments[i])&&(t=Pg(e))&&(n&&(n+=" "),n+=t);return n}const z9=(e,t)=>{const i=new Array(e.length+t.length);for(let n=0;n<e.length;n++)i[n]=e[n];for(let n=0;n<t.length;n++)i[e.length+n]=t[n];return i},U9=(e,t)=>({classGroupId:e,validator:t}),qg=(e=new Map,t=null,i)=>({nextPart:e,validators:t,classGroupId:i}),So="-",C0=[],j9="arbitrary..",P9=e=>{const t=q9(e),{conflictingClassGroups:i,conflictingClassGroupModifiers:n}=e;return{getClassGroupId:a=>{if(a.startsWith("[")&&a.endsWith("]"))return G9(a);const o=a.split(So),c=o[0]===""&&o.length>1?1:0;return Yg(o,c,t)},getConflictingClassGroupIds:(a,o)=>{if(o){const c=n[a],d=i[a];return c?d?z9(d,c):c:d||C0}return i[a]||C0}}},Yg=(e,t,i)=>{if(e.length-t===0)return i.classGroupId;const l=e[t],s=i.nextPart.get(l);if(s){const d=Yg(e,t+1,s);if(d)return d}const a=i.validators;if(a===null)return;const o=t===0?e.join(So):e.slice(t).join(So),c=a.length;for(let d=0;d<c;d++){const v=a[d];if(v.validator(o))return v.classGroupId}},G9=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{const t=e.slice(1,-1),i=t.indexOf(":"),n=t.slice(0,i);return n?j9+n:void 0})(),q9=e=>{const{theme:t,classGroups:i}=e;return Y9(i,t)},Y9=(e,t)=>{const i=qg();for(const n in e){const l=e[n];C1(l,i,n,t)}return i},C1=(e,t,i,n)=>{const l=e.length;for(let s=0;s<l;s++){const a=e[s];X9(a,t,i,n)}},X9=(e,t,i,n)=>{if(typeof e=="string"){F9(e,t,i);return}if(typeof e=="function"){K9(e,t,i,n);return}Q9(e,t,i,n)},F9=(e,t,i)=>{const n=e===""?t:Xg(t,e);n.classGroupId=i},K9=(e,t,i,n)=>{if(J9(e)){C1(e(n),t,i,n);return}t.validators===null&&(t.validators=[]),t.validators.push(U9(i,e))},Q9=(e,t,i,n)=>{const l=Object.entries(e),s=l.length;for(let a=0;a<s;a++){const[o,c]=l[a];C1(c,Xg(t,o),i,n)}},Xg=(e,t)=>{let i=e;const n=t.split(So),l=n.length;for(let s=0;s<l;s++){const a=n[s];let o=i.nextPart.get(a);o||(o=qg(),i.nextPart.set(a,o)),i=o}return i},J9=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,$9=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,i=Object.create(null),n=Object.create(null);const l=(s,a)=>{i[s]=a,t++,t>e&&(t=0,n=i,i=Object.create(null))};return{get(s){let a=i[s];if(a!==void 0)return a;if((a=n[s])!==void 0)return l(s,a),a},set(s,a){s in i?i[s]=a:l(s,a)}}},pc="!",O0=":",W9=[],N0=(e,t,i,n,l)=>({modifiers:e,hasImportantModifier:t,baseClassName:i,maybePostfixModifierPosition:n,isExternal:l}),t7=e=>{const{prefix:t,experimentalParseClassName:i}=e;let n=l=>{const s=[];let a=0,o=0,c=0,d;const v=l.length;for(let N=0;N<v;N++){const D=l[N];if(a===0&&o===0){if(D===O0){s.push(l.slice(c,N)),c=N+1;continue}if(D==="/"){d=N;continue}}D==="["?a++:D==="]"?a--:D==="("?o++:D===")"&&o--}const w=s.length===0?l:l.slice(c);let V=w,b=!1;w.endsWith(pc)?(V=w.slice(0,-1),b=!0):w.startsWith(pc)&&(V=w.slice(1),b=!0);const C=d&&d>c?d-c:void 0;return N0(s,b,V,C)};if(t){const l=t+O0,s=n;n=a=>a.startsWith(l)?s(a.slice(l.length)):N0(W9,!1,a,void 0,!0)}if(i){const l=n;n=s=>i({className:s,parseClassName:l})}return n},e7=e=>{const t=new Map;return e.orderSensitiveModifiers.forEach((i,n)=>{t.set(i,1e6+n)}),i=>{const n=[];let l=[];for(let s=0;s<i.length;s++){const a=i[s],o=a[0]==="[",c=t.has(a);o||c?(l.length>0&&(l.sort(),n.push(...l),l=[]),n.push(a)):l.push(a)}return l.length>0&&(l.sort(),n.push(...l)),n}},i7=e=>({cache:$9(e.cacheSize),parseClassName:t7(e),sortModifiers:e7(e),...P9(e)}),n7=/\s+/,l7=(e,t)=>{const{parseClassName:i,getClassGroupId:n,getConflictingClassGroupIds:l,sortModifiers:s}=t,a=[],o=e.trim().split(n7);let c="";for(let d=o.length-1;d>=0;d-=1){const v=o[d],{isExternal:w,modifiers:V,hasImportantModifier:b,baseClassName:C,maybePostfixModifierPosition:N}=i(v);if(w){c=v+(c.length>0?" "+c:c);continue}let D=!!N,Z=n(D?C.substring(0,N):C);if(!Z){if(!D){c=v+(c.length>0?" "+c:c);continue}if(Z=n(C),!Z){c=v+(c.length>0?" "+c:c);continue}D=!1}const p=V.length===0?"":V.length===1?V[0]:s(V).join(":"),_=b?p+pc:p,A=_+Z;if(a.indexOf(A)>-1)continue;a.push(A);const R=l(Z,D);for(let I=0;I<R.length;++I){const m=R[I];a.push(_+m)}c=v+(c.length>0?" "+c:c)}return c},s7=(...e)=>{let t=0,i,n,l="";for(;t<e.length;)(i=e[t++])&&(n=Fg(i))&&(l&&(l+=" "),l+=n);return l},Fg=e=>{if(typeof e=="string")return e;let t,i="";for(let n=0;n<e.length;n++)e[n]&&(t=Fg(e[n]))&&(i&&(i+=" "),i+=t);return i},r7=(e,...t)=>{let i,n,l,s;const a=c=>{const d=t.reduce((v,w)=>w(v),e());return i=i7(d),n=i.cache.get,l=i.cache.set,s=o,o(c)},o=c=>{const d=n(c);if(d)return d;const v=l7(c,i);return l(c,v),v};return s=a,(...c)=>s(s7(...c))},a7=[],Bt=e=>{const t=i=>i[e]||a7;return t.isThemeGetter=!0,t},Kg=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Qg=/^\((?:(\w[\w-]*):)?(.+)\)$/i,o7=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,u7=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,c7=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,h7=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,f7=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,d7=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,Yi=e=>o7.test(e),K=e=>!!e&&!Number.isNaN(Number(e)),Xi=e=>!!e&&Number.isInteger(Number(e)),f2=e=>e.endsWith("%")&&K(e.slice(0,-1)),mi=e=>u7.test(e),Jg=()=>!0,H7=e=>c7.test(e)&&!h7.test(e),O1=()=>!1,V7=e=>f7.test(e),g7=e=>d7.test(e),p7=e=>!z(e)&&!U(e),m7=e=>xn(e,t3,O1),z=e=>Kg.test(e),Ln=e=>xn(e,e3,H7),R0=e=>xn(e,S7,K),v7=e=>xn(e,n3,Jg),M7=e=>xn(e,i3,O1),B0=e=>xn(e,$g,O1),y7=e=>xn(e,Wg,g7),_a=e=>xn(e,l3,V7),U=e=>Qg.test(e),ks=e=>fl(e,e3),w7=e=>fl(e,i3),D0=e=>fl(e,$g),Z7=e=>fl(e,t3),_7=e=>fl(e,Wg),ba=e=>fl(e,l3,!0),b7=e=>fl(e,n3,!0),xn=(e,t,i)=>{const n=Kg.exec(e);return n?n[1]?t(n[1]):i(n[2]):!1},fl=(e,t,i=!1)=>{const n=Qg.exec(e);return n?n[1]?t(n[1]):i:!1},$g=e=>e==="position"||e==="percentage",Wg=e=>e==="image"||e==="url",t3=e=>e==="length"||e==="size"||e==="bg-size",e3=e=>e==="length",S7=e=>e==="number",i3=e=>e==="family-name",n3=e=>e==="number"||e==="weight",l3=e=>e==="shadow",E7=()=>{const e=Bt("color"),t=Bt("font"),i=Bt("text"),n=Bt("font-weight"),l=Bt("tracking"),s=Bt("leading"),a=Bt("breakpoint"),o=Bt("container"),c=Bt("spacing"),d=Bt("radius"),v=Bt("shadow"),w=Bt("inset-shadow"),V=Bt("text-shadow"),b=Bt("drop-shadow"),C=Bt("blur"),N=Bt("perspective"),D=Bt("aspect"),Z=Bt("ease"),p=Bt("animate"),_=()=>["auto","avoid","all","avoid-page","page","left","right","column"],A=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],R=()=>[...A(),U,z],I=()=>["auto","hidden","clip","visible","scroll"],m=()=>["auto","contain","none"],f=()=>[U,z,c],g=()=>[Yi,"full","auto",...f()],M=()=>[Xi,"none","subgrid",U,z],S=()=>["auto",{span:["full",Xi,U,z]},Xi,U,z],E=()=>[Xi,"auto",U,z],y=()=>["auto","min","max","fr",U,z],Wt=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],Ft=()=>["start","end","center","stretch","center-safe","end-safe"],L=()=>["auto",...f()],j=()=>[Yi,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...f()],P=()=>[Yi,"screen","full","dvw","lvw","svw","min","max","fit",...f()],at=()=>[Yi,"screen","full","lh","dvh","lvh","svh","min","max","fit",...f()],k=()=>[e,U,z],ui=()=>[...A(),D0,B0,{position:[U,z]}],Kt=()=>["no-repeat",{repeat:["","x","y","space","round"]}],Zt=()=>["auto","cover","contain",Z7,m7,{size:[U,z]}],Ve=()=>[f2,ks,Ln],Ht=()=>["","none","full",d,U,z],Ut=()=>["",K,ks,Ln],ci=()=>["solid","dashed","dotted","double"],Fr=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],At=()=>[K,f2,D0,B0],Cn=()=>["","none",C,U,z],hi=()=>["none",K,U,z],zi=()=>["none",K,U,z],On=()=>[K,U,z],Ui=()=>[Yi,"full",...f()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[mi],breakpoint:[mi],color:[Jg],container:[mi],"drop-shadow":[mi],ease:["in","out","in-out"],font:[p7],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[mi],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[mi],shadow:[mi],spacing:["px",K],text:[mi],"text-shadow":[mi],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",Yi,z,U,D]}],container:["container"],columns:[{columns:[K,z,U,o]}],"break-after":[{"break-after":_()}],"break-before":[{"break-before":_()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:R()}],overflow:[{overflow:I()}],"overflow-x":[{"overflow-x":I()}],"overflow-y":[{"overflow-y":I()}],overscroll:[{overscroll:m()}],"overscroll-x":[{"overscroll-x":m()}],"overscroll-y":[{"overscroll-y":m()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:g()}],"inset-x":[{"inset-x":g()}],"inset-y":[{"inset-y":g()}],start:[{"inset-s":g(),start:g()}],end:[{"inset-e":g(),end:g()}],"inset-bs":[{"inset-bs":g()}],"inset-be":[{"inset-be":g()}],top:[{top:g()}],right:[{right:g()}],bottom:[{bottom:g()}],left:[{left:g()}],visibility:["visible","invisible","collapse"],z:[{z:[Xi,"auto",U,z]}],basis:[{basis:[Yi,"full","auto",o,...f()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[K,Yi,"auto","initial","none",z]}],grow:[{grow:["",K,U,z]}],shrink:[{shrink:["",K,U,z]}],order:[{order:[Xi,"first","last","none",U,z]}],"grid-cols":[{"grid-cols":M()}],"col-start-end":[{col:S()}],"col-start":[{"col-start":E()}],"col-end":[{"col-end":E()}],"grid-rows":[{"grid-rows":M()}],"row-start-end":[{row:S()}],"row-start":[{"row-start":E()}],"row-end":[{"row-end":E()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":y()}],"auto-rows":[{"auto-rows":y()}],gap:[{gap:f()}],"gap-x":[{"gap-x":f()}],"gap-y":[{"gap-y":f()}],"justify-content":[{justify:[...Wt(),"normal"]}],"justify-items":[{"justify-items":[...Ft(),"normal"]}],"justify-self":[{"justify-self":["auto",...Ft()]}],"align-content":[{content:["normal",...Wt()]}],"align-items":[{items:[...Ft(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...Ft(),{baseline:["","last"]}]}],"place-content":[{"place-content":Wt()}],"place-items":[{"place-items":[...Ft(),"baseline"]}],"place-self":[{"place-self":["auto",...Ft()]}],p:[{p:f()}],px:[{px:f()}],py:[{py:f()}],ps:[{ps:f()}],pe:[{pe:f()}],pbs:[{pbs:f()}],pbe:[{pbe:f()}],pt:[{pt:f()}],pr:[{pr:f()}],pb:[{pb:f()}],pl:[{pl:f()}],m:[{m:L()}],mx:[{mx:L()}],my:[{my:L()}],ms:[{ms:L()}],me:[{me:L()}],mbs:[{mbs:L()}],mbe:[{mbe:L()}],mt:[{mt:L()}],mr:[{mr:L()}],mb:[{mb:L()}],ml:[{ml:L()}],"space-x":[{"space-x":f()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":f()}],"space-y-reverse":["space-y-reverse"],size:[{size:j()}],"inline-size":[{inline:["auto",...P()]}],"min-inline-size":[{"min-inline":["auto",...P()]}],"max-inline-size":[{"max-inline":["none",...P()]}],"block-size":[{block:["auto",...at()]}],"min-block-size":[{"min-block":["auto",...at()]}],"max-block-size":[{"max-block":["none",...at()]}],w:[{w:[o,"screen",...j()]}],"min-w":[{"min-w":[o,"screen","none",...j()]}],"max-w":[{"max-w":[o,"screen","none","prose",{screen:[a]},...j()]}],h:[{h:["screen","lh",...j()]}],"min-h":[{"min-h":["screen","lh","none",...j()]}],"max-h":[{"max-h":["screen","lh",...j()]}],"font-size":[{text:["base",i,ks,Ln]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[n,b7,v7]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",f2,z]}],"font-family":[{font:[w7,M7,t]}],"font-features":[{"font-features":[z]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[l,U,z]}],"line-clamp":[{"line-clamp":[K,"none",U,R0]}],leading:[{leading:[s,...f()]}],"list-image":[{"list-image":["none",U,z]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",U,z]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:k()}],"text-color":[{text:k()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...ci(),"wavy"]}],"text-decoration-thickness":[{decoration:[K,"from-font","auto",U,Ln]}],"text-decoration-color":[{decoration:k()}],"underline-offset":[{"underline-offset":[K,"auto",U,z]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:f()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",U,z]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",U,z]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:ui()}],"bg-repeat":[{bg:Kt()}],"bg-size":[{bg:Zt()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Xi,U,z],radial:["",U,z],conic:[Xi,U,z]},_7,y7]}],"bg-color":[{bg:k()}],"gradient-from-pos":[{from:Ve()}],"gradient-via-pos":[{via:Ve()}],"gradient-to-pos":[{to:Ve()}],"gradient-from":[{from:k()}],"gradient-via":[{via:k()}],"gradient-to":[{to:k()}],rounded:[{rounded:Ht()}],"rounded-s":[{"rounded-s":Ht()}],"rounded-e":[{"rounded-e":Ht()}],"rounded-t":[{"rounded-t":Ht()}],"rounded-r":[{"rounded-r":Ht()}],"rounded-b":[{"rounded-b":Ht()}],"rounded-l":[{"rounded-l":Ht()}],"rounded-ss":[{"rounded-ss":Ht()}],"rounded-se":[{"rounded-se":Ht()}],"rounded-ee":[{"rounded-ee":Ht()}],"rounded-es":[{"rounded-es":Ht()}],"rounded-tl":[{"rounded-tl":Ht()}],"rounded-tr":[{"rounded-tr":Ht()}],"rounded-br":[{"rounded-br":Ht()}],"rounded-bl":[{"rounded-bl":Ht()}],"border-w":[{border:Ut()}],"border-w-x":[{"border-x":Ut()}],"border-w-y":[{"border-y":Ut()}],"border-w-s":[{"border-s":Ut()}],"border-w-e":[{"border-e":Ut()}],"border-w-bs":[{"border-bs":Ut()}],"border-w-be":[{"border-be":Ut()}],"border-w-t":[{"border-t":Ut()}],"border-w-r":[{"border-r":Ut()}],"border-w-b":[{"border-b":Ut()}],"border-w-l":[{"border-l":Ut()}],"divide-x":[{"divide-x":Ut()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":Ut()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...ci(),"hidden","none"]}],"divide-style":[{divide:[...ci(),"hidden","none"]}],"border-color":[{border:k()}],"border-color-x":[{"border-x":k()}],"border-color-y":[{"border-y":k()}],"border-color-s":[{"border-s":k()}],"border-color-e":[{"border-e":k()}],"border-color-bs":[{"border-bs":k()}],"border-color-be":[{"border-be":k()}],"border-color-t":[{"border-t":k()}],"border-color-r":[{"border-r":k()}],"border-color-b":[{"border-b":k()}],"border-color-l":[{"border-l":k()}],"divide-color":[{divide:k()}],"outline-style":[{outline:[...ci(),"none","hidden"]}],"outline-offset":[{"outline-offset":[K,U,z]}],"outline-w":[{outline:["",K,ks,Ln]}],"outline-color":[{outline:k()}],shadow:[{shadow:["","none",v,ba,_a]}],"shadow-color":[{shadow:k()}],"inset-shadow":[{"inset-shadow":["none",w,ba,_a]}],"inset-shadow-color":[{"inset-shadow":k()}],"ring-w":[{ring:Ut()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:k()}],"ring-offset-w":[{"ring-offset":[K,Ln]}],"ring-offset-color":[{"ring-offset":k()}],"inset-ring-w":[{"inset-ring":Ut()}],"inset-ring-color":[{"inset-ring":k()}],"text-shadow":[{"text-shadow":["none",V,ba,_a]}],"text-shadow-color":[{"text-shadow":k()}],opacity:[{opacity:[K,U,z]}],"mix-blend":[{"mix-blend":[...Fr(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Fr()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[K]}],"mask-image-linear-from-pos":[{"mask-linear-from":At()}],"mask-image-linear-to-pos":[{"mask-linear-to":At()}],"mask-image-linear-from-color":[{"mask-linear-from":k()}],"mask-image-linear-to-color":[{"mask-linear-to":k()}],"mask-image-t-from-pos":[{"mask-t-from":At()}],"mask-image-t-to-pos":[{"mask-t-to":At()}],"mask-image-t-from-color":[{"mask-t-from":k()}],"mask-image-t-to-color":[{"mask-t-to":k()}],"mask-image-r-from-pos":[{"mask-r-from":At()}],"mask-image-r-to-pos":[{"mask-r-to":At()}],"mask-image-r-from-color":[{"mask-r-from":k()}],"mask-image-r-to-color":[{"mask-r-to":k()}],"mask-image-b-from-pos":[{"mask-b-from":At()}],"mask-image-b-to-pos":[{"mask-b-to":At()}],"mask-image-b-from-color":[{"mask-b-from":k()}],"mask-image-b-to-color":[{"mask-b-to":k()}],"mask-image-l-from-pos":[{"mask-l-from":At()}],"mask-image-l-to-pos":[{"mask-l-to":At()}],"mask-image-l-from-color":[{"mask-l-from":k()}],"mask-image-l-to-color":[{"mask-l-to":k()}],"mask-image-x-from-pos":[{"mask-x-from":At()}],"mask-image-x-to-pos":[{"mask-x-to":At()}],"mask-image-x-from-color":[{"mask-x-from":k()}],"mask-image-x-to-color":[{"mask-x-to":k()}],"mask-image-y-from-pos":[{"mask-y-from":At()}],"mask-image-y-to-pos":[{"mask-y-to":At()}],"mask-image-y-from-color":[{"mask-y-from":k()}],"mask-image-y-to-color":[{"mask-y-to":k()}],"mask-image-radial":[{"mask-radial":[U,z]}],"mask-image-radial-from-pos":[{"mask-radial-from":At()}],"mask-image-radial-to-pos":[{"mask-radial-to":At()}],"mask-image-radial-from-color":[{"mask-radial-from":k()}],"mask-image-radial-to-color":[{"mask-radial-to":k()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":A()}],"mask-image-conic-pos":[{"mask-conic":[K]}],"mask-image-conic-from-pos":[{"mask-conic-from":At()}],"mask-image-conic-to-pos":[{"mask-conic-to":At()}],"mask-image-conic-from-color":[{"mask-conic-from":k()}],"mask-image-conic-to-color":[{"mask-conic-to":k()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:ui()}],"mask-repeat":[{mask:Kt()}],"mask-size":[{mask:Zt()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",U,z]}],filter:[{filter:["","none",U,z]}],blur:[{blur:Cn()}],brightness:[{brightness:[K,U,z]}],contrast:[{contrast:[K,U,z]}],"drop-shadow":[{"drop-shadow":["","none",b,ba,_a]}],"drop-shadow-color":[{"drop-shadow":k()}],grayscale:[{grayscale:["",K,U,z]}],"hue-rotate":[{"hue-rotate":[K,U,z]}],invert:[{invert:["",K,U,z]}],saturate:[{saturate:[K,U,z]}],sepia:[{sepia:["",K,U,z]}],"backdrop-filter":[{"backdrop-filter":["","none",U,z]}],"backdrop-blur":[{"backdrop-blur":Cn()}],"backdrop-brightness":[{"backdrop-brightness":[K,U,z]}],"backdrop-contrast":[{"backdrop-contrast":[K,U,z]}],"backdrop-grayscale":[{"backdrop-grayscale":["",K,U,z]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[K,U,z]}],"backdrop-invert":[{"backdrop-invert":["",K,U,z]}],"backdrop-opacity":[{"backdrop-opacity":[K,U,z]}],"backdrop-saturate":[{"backdrop-saturate":[K,U,z]}],"backdrop-sepia":[{"backdrop-sepia":["",K,U,z]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":f()}],"border-spacing-x":[{"border-spacing-x":f()}],"border-spacing-y":[{"border-spacing-y":f()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",U,z]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[K,"initial",U,z]}],ease:[{ease:["linear","initial",Z,U,z]}],delay:[{delay:[K,U,z]}],animate:[{animate:["none",p,U,z]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[N,U,z]}],"perspective-origin":[{"perspective-origin":R()}],rotate:[{rotate:hi()}],"rotate-x":[{"rotate-x":hi()}],"rotate-y":[{"rotate-y":hi()}],"rotate-z":[{"rotate-z":hi()}],scale:[{scale:zi()}],"scale-x":[{"scale-x":zi()}],"scale-y":[{"scale-y":zi()}],"scale-z":[{"scale-z":zi()}],"scale-3d":["scale-3d"],skew:[{skew:On()}],"skew-x":[{"skew-x":On()}],"skew-y":[{"skew-y":On()}],transform:[{transform:[U,z,"","none","gpu","cpu"]}],"transform-origin":[{origin:R()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:Ui()}],"translate-x":[{"translate-x":Ui()}],"translate-y":[{"translate-y":Ui()}],"translate-z":[{"translate-z":Ui()}],"translate-none":["translate-none"],accent:[{accent:k()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:k()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",U,z]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":f()}],"scroll-mx":[{"scroll-mx":f()}],"scroll-my":[{"scroll-my":f()}],"scroll-ms":[{"scroll-ms":f()}],"scroll-me":[{"scroll-me":f()}],"scroll-mbs":[{"scroll-mbs":f()}],"scroll-mbe":[{"scroll-mbe":f()}],"scroll-mt":[{"scroll-mt":f()}],"scroll-mr":[{"scroll-mr":f()}],"scroll-mb":[{"scroll-mb":f()}],"scroll-ml":[{"scroll-ml":f()}],"scroll-p":[{"scroll-p":f()}],"scroll-px":[{"scroll-px":f()}],"scroll-py":[{"scroll-py":f()}],"scroll-ps":[{"scroll-ps":f()}],"scroll-pe":[{"scroll-pe":f()}],"scroll-pbs":[{"scroll-pbs":f()}],"scroll-pbe":[{"scroll-pbe":f()}],"scroll-pt":[{"scroll-pt":f()}],"scroll-pr":[{"scroll-pr":f()}],"scroll-pb":[{"scroll-pb":f()}],"scroll-pl":[{"scroll-pl":f()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",U,z]}],fill:[{fill:["none",...k()]}],"stroke-w":[{stroke:[K,ks,Ln,R0]}],stroke:[{stroke:["none",...k()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},T7=r7(E7);function Ee(...e){return T7(Gg(e))}const A7=e=>Y.jsx("svg",{viewBox:"0 0 32 32",fill:"none",...e,children:Y.jsx("path",{d:"M27 27H24V24H27V27ZM24 24H21V21H24V24ZM21 21H18V18H21V21ZM16 20H9V18H16V20ZM9 18H7V16H9V18ZM18 18H16V16H18V18ZM7 16H5V9H7V16ZM20 16H18V9H20V16ZM9 9H7V7H9V9ZM18 9H16V7H18V9ZM16 7H9V5H16V7Z",fill:"currentColor"})}),x7={"edit-add":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76610)">
<rect x="15" y="4" width="2" height="10" fill="currentColor"/>
<rect x="5" y="16" width="2" height="10" transform="rotate(-90 5 16)" fill="currentColor"/>
<rect x="17" y="26" width="2" height="10" transform="rotate(-180 17 26)" fill="currentColor"/>
<rect x="27" y="14" width="2" height="10" transform="rotate(90 27 14)" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76610">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-checklist":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 27H4V25H6V27ZM4 25H2V23H4V25ZM8 25H6V23H8V25ZM30 24H12V22H30V24ZM10 23H8V21H10V23ZM12 21H10V19H12V21ZM8 13H4V11H8V13ZM4 11H2V7H4V11ZM10 11H8V7H10V11ZM30 10H12V8H30V10ZM8 7H4V5H8V7Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-copy":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="26" y="25" width="5" height="2" transform="rotate(-180 26 25)" fill="currentColor"/>
<rect x="6" y="7" width="9" height="2" fill="currentColor"/>
<rect x="17" y="11" width="2" height="2" fill="currentColor"/>
<rect x="15" y="13" width="4" height="2" transform="rotate(-90 15 13)" fill="currentColor"/>
<rect x="11" y="7" width="2" height="2" transform="rotate(-90 11 7)" fill="currentColor"/>
<rect x="21" y="13" width="14" height="2" transform="rotate(90 21 13)" fill="currentColor"/>
<rect x="5" y="27" width="14" height="2" fill="currentColor"/>
<rect x="13" y="3" width="13" height="2" fill="currentColor"/>
<rect x="4" y="9" width="2" height="18" fill="currentColor"/>
<rect x="26" y="5" width="2" height="18" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-cross-small":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76618)">
<path d="M7 27H5V25H7V27ZM27 27H25V25H27V27ZM9 25H7V23H9V25ZM25 25H23V23H25V25ZM11 23H9V21H11V23ZM23 23H21V21H23V23ZM13 21H11V19H13V21ZM21 21H19V19H21V21ZM15 19H13V17H15V19ZM19 19H17V17H19V19ZM15 15H13V13H15V15ZM19 15H17V13H19V15ZM13 13H11V11H13V13ZM21 13H19V11H21V13ZM11 11H9V9H11V11ZM23 11H21V9H23V11ZM9 9H7V7H9V9ZM25 9H23V7H25V9ZM7 5V7H5V5H7ZM27 7H25V5H27V7Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76618">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-cross":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76614)">
<path d="M5 29H3V27H5V29ZM29 29H27V27H29V29ZM7 27H5V25H7V27ZM27 27H25V25H27V27ZM9 25H7V23H9V25ZM25 25H23V23H25V25ZM11 23H9V21H11V23ZM23 23H21V21H23V23ZM13 21H11V19H13V21ZM21 21H19V19H21V21ZM15 19H13V17H15V19ZM19 19H17V17H19V19ZM15 15H13V13H15V15ZM19 15H17V13H19V15ZM13 13H11V11H13V13ZM21 13H19V11H21V13ZM11 11H9V9H11V11ZM23 11H21V9H23V11ZM9 9H7V7H9V9ZM25 9H23V7H25V9ZM7 7H5V5H7V7ZM27 7H25V5H27V7ZM5 3V5H3V3H5ZM29 5H27V3H29V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76614">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-cut":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76590)">
<path d="M30 27H28V25H30V27ZM13 26H4V24H13V26ZM28 25H26V23H28V25ZM4 24H2V19H4V24ZM13 19H4V17H18V19H15V24H13V19ZM26 23H24V21H26V23ZM24 21H22V19H24V21ZM22 19H20V17H22V19ZM20 17H18V15H20V17ZM15 13H18V15H4V13H13V8H15V13ZM22 15H20V13H22V15ZM4 13H2V8H4V13ZM24 13H22V11H24V13ZM26 11H24V9H26V11ZM28 9H26V7H28V9ZM13 8H4V6H13V8ZM30 7H28V5H30V7Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76590">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-display-adj":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 25H24V27H8V28H6V27H2V25H6V24H8V25ZM23 22H3V20H23V22ZM30 16H31V18H30V21H28V18H27V16H28V7H30V16ZM3 20H1V8H3V20ZM25 20H23V8H25V20ZM23 8H3V6H23V8Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-dist-adj":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 25H10V27H4V21H6V25ZM9 24H7V22H9V24ZM22 23H13V21H22V23ZM11 22H9V20H11V22ZM24 21H22V12H24V21ZM13 20H11V18H13V20ZM8 19H6V12H8V19ZM15 18H13V16H15V18ZM22 12H8V10H22V12ZM27 11H25V7H21V5H27V11ZM24 10H22V8H24V10Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-dot-lists":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 25H3V21H7V25ZM29 24H11V22H29V24ZM7 11H3V7H7V11ZM29 10H11V8H29V10Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-edit":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 27H9V29H3V23H5V27ZM30 29H15V27H30V29ZM11 27H9V25H11V27ZM13 25H11V23H13V25ZM7 23H5V21H7V23ZM15 23H13V21H15V23ZM9 21H7V19H9V21ZM17 21H15V19H17V21ZM11 19H9V17H11V19ZM19 19H17V17H19V19ZM13 17H11V15H13V17ZM21 17H19V15H21V17ZM15 15H13V13H15V15ZM23 15H21V13H23V15ZM17 13H15V11H17V13ZM25 13H23V11H25V13ZM19 11H17V9H19V11ZM23 11H21V9H23V11ZM27 11H25V9H27V11ZM21 9H19V7H21V9ZM29 9H27V7H29V9ZM23 7H21V5H23V7ZM27 7H25V5H27V7ZM25 5H23V3H25V5Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-hight-adj":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 31H15V29H17V31ZM15 29H13V27H15V29ZM19 29H17V27H19V29ZM13 27H11V25H13V27ZM17 27H15V23H17V27ZM21 27H19V25H21V27ZM24 22H8V20H24V22ZM8 20H6V12H8V20ZM26 20H24V12H26V20ZM24 12H8V10H24V12ZM17 9H15V5H17V9ZM13 7H11V5H13V7ZM21 7H19V5H21V7ZM15 5H13V3H15V5ZM19 5H17V3H19V5ZM17 3H15V1H17V3Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-import":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76574)">
<path d="M5 27.998H27V18H29V28H27V29.998H5V28H3V18H5V27.998ZM17 25.001H15V23.001H17V25.001ZM15 23.001H13V21.001H15V23.001ZM19 23.001H17V21.001H19V23.001ZM13 21.001H11V19.001H13V21.001ZM21 21.001H19V19.001H21V21.001ZM17 21H15V2H17V21ZM11 19.001H9V17.001H11V19.001ZM23 19.001H21V17.001H23V19.001ZM9 17H7V15H9V17ZM25 17H23V15H25V17ZM7 15H5V13H7V15ZM27 15H25V13H27V15Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76574">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-layout-settings":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76654)">
<path d="M26 30.0029H6V28.0029H26V30.0029ZM6 28.0029H4V4.00293H6V28.0029ZM28 28.0029H26V8.00293H28V28.0029ZM22 23.0029H20V21.0029H22V23.0029ZM20 21.0029H8V19.0029H20V21.0029ZM24 21.0029H22V19.0029H24V21.0029ZM22 19.0029H20V17.0029H22V19.0029ZM12 15.0029H10V13.0029H12V15.0029ZM10 13.0029H8V11.0029H10V13.0029ZM24 13.0029H12V11.0029H24V13.0029ZM12 11.0029H10V9.00293H12V11.0029ZM24 6.00293H26V8.00293H22V4.00293H24V6.00293ZM22 4.00293H6V2.00293H22V4.00293Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76654">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-multi-selection":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76670)">
<path d="M25 28H23V26H25V28ZM7 26H3V24H7V26ZM19 26H10V24H19V26ZM23 26H21V24H23V26ZM27 26H25V24H27V26ZM29 24H27V22H29V24ZM31 22H29V20H31V22ZM7 17H3V15H7V17ZM28 17H10V15H28V17ZM7 8H3V6H7V8ZM28 8H10V6H28V8Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76670">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-new":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 30H6V28H26V30ZM6 28H4V4H6V28ZM28 28H26V8H28V28ZM17 22.0049H15V17.0049H17V22.0049ZM17 15.0049H15.0049V17H10.0049V15H15V10.0049H17V15.0049ZM22.0049 17H17.0049V15H22.0049V17ZM24 6H26V8H22V4H24V6ZM22 4H6V2H22V4Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-number-list":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 28H4V26H10V28ZM4 26H2V22H8V20H10V24H4V26ZM30 24H12V22H30V24ZM8 20H4V18H8V20ZM8 15H6V6H8V15ZM30 10H12V8H30V10ZM6 6H4V4H6V6Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-options":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76674)">
<path d="M6 25H2V23H6V25ZM30 25H9V23H30V25ZM6 17H2V15H6V17ZM30 17H9V15H30V17ZM6 9H2V7H6V9ZM30 9H9V7H30V9Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76674">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-paste":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76598)">
<path d="M20 30H4V28H20V30ZM4 28H2V8H4V28ZM28 26H22V28H20V26H12V24H28V26ZM12 24H10V8H4V6H10V4H12V24ZM30 24H28V4H30V24ZM26 19H14V17H26V19ZM26 15H14V13H26V15ZM26 11H14V9H26V11ZM28 4H12V2H28V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76598">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-pause":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76646)">
<path d="M11 28H9V4H11V28ZM23 28H21V4H23V28Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76646">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-pin":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76630)">
<path d="M17 31H15V20H17V31ZM6 18H15V20H4V16H6V18ZM28 20H17V18H26V16H28V20ZM8 16H6V14H8V16ZM26 16H24V14H26V16ZM10 14H8V12H10V14ZM24 14H22V12H24V14ZM13 10H19V5H21V10H22V12H10V10H11V5H13V10ZM11 5H9V3H11V5ZM23 5H21V3H23V5ZM21 3H11V1H21V3Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76630">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-play":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76642)">
<path d="M12 29H9V27H12V29ZM9 27H7V5H9V27ZM15 27H12V25H15V27ZM18 25H15V23H18V25ZM21 23H18V21H21V23ZM24 21H21V19H24V21ZM26 19H24V17H26V19ZM28 17H26V15H28V17ZM26 15H24V13H26V15ZM24 13H21V11H24V13ZM21 11H18V9H21V11ZM18 9H15V7H18V9ZM15 7H12V5H15V7ZM12 5H9V3H12V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76642">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-redo":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76626)">
<path d="M22 25V27H10V25H22ZM10 25H8V23H10V25ZM8 23H6V15H8V23ZM20 19H18V17H20V19ZM22 17H20V15H22V17ZM10 15H8V13H10V15ZM24 15H22V13H24V15ZM22 13H10V11H22V13ZM26 13H24V11H26V13ZM24 11H22V9H24V11ZM22 9H20V7H22V9ZM20 7H18V5H20V7Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76626">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-restore":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76650)">
<path d="M24 29H8V27H24V29ZM8 27H6V25H8V27ZM26 27H24V25H26V27ZM6 25H4V15H6V25ZM28 25H26V11H28V25ZM14 13H12V11H14V13ZM12 11H10V9H12V11ZM26 11H24V9H26V11ZM10 9H8V7H10V9ZM24 9H12V7H24V9ZM12 7H10V5H12V7ZM14 5H12V3H14V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76650">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-settings":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 28H21V26H25V28ZM21 26H3V24H21V26ZM29 26H25V24H29V26ZM25 24H21V22H25V24ZM18 19H14V17H18V19ZM14 17H3V15H14V17ZM29 17H18V15H29V17ZM18 15H14V13H18V15ZM11 10H7V8H11V10ZM7 8H3V6H7V8ZM29 8H11V6H29V8ZM11 6H7V4H11V6Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-share":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 29H5V27H27V29ZM5 27H3V5H5V27ZM29 27H27V19H29V27ZM12 22H10V18H12V22ZM14 18H12V14H14V18ZM24 16H22V14H24V16ZM16 14H14V12H16V14ZM26 14H24V12H26V14ZM20 12H16V10H20V12ZM28 12H26V10H28V12ZM26 10H20V8H26V10ZM30 10H28V8H30V10ZM28 8H26V6H28V8ZM26 6H24V4H26V6ZM13 5H5V3H13V5ZM24 4H22V2H24V4Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-sweep":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76606)">
<path d="M12 27H15V18H17V27H20V29H7V27H10V18H12V27ZM25 29H22V27H25V29ZM4 13H28V11H30V15H27V27H25V15H7V27H5V15H2V11H4V13ZM22 27H20V18H22V27ZM22 9H28V11H20V5H12V11H4V9H10V3H22V9Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76606">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-switch":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 30H16V28H18V30ZM16 28H14V26H16V28ZM14 26H12V24H14V26ZM26 26H16V24H26V26ZM16 24H14V22H16V24ZM28 22V24H26V22H28ZM4 22H2V10H4V22ZM18 22H16V20H18V22ZM30 22H28V10H30V22ZM16 12H14V10H16V12ZM6 10H4V8H6V10ZM18 10H16V8H18V10ZM16 8H6V6H16V8ZM20 8H18V6H20V8ZM18 6H16V4H18V6ZM16 4H14V2H16V4Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-trash":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76602)">
<path d="M24 30H8V28H24V30ZM8 28H6V10H8V28ZM26 28H24V10H26V28ZM14 26H12V10H14V26ZM20 26H18V10H20V26ZM12 6H20V4H22V6H28V8H4V6H10V4H12V6ZM20 4H12V2H20V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76602">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-undo":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76622)">
<path d="M22 27H10V25H22V27ZM24 25H22V23H24V25ZM26 23H24V15H26V23ZM14 19H12V17H14V19ZM12 17H10V15H12V17ZM10 15H8V13H10V15ZM24 15H22V13H24V15ZM8 13H6V11H8V13ZM22 13H10V11H22V13ZM10 11H8V9H10V11ZM12 9H10V7H12V9ZM14 7H12V5H14V7Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76622">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Edit & Settings"},"edit-unpin":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 31H15V20H17V31ZM28 28H26V26H28V28ZM26 26H24V24H26V26ZM24 24H22V22H24V24ZM22 22H20V20H22V22ZM6 18H15V20H4V16H6V18ZM20 20H18V18H20V20ZM28 20H22V18H26V16H28V20ZM18 18H16V16H18V18ZM8 16H6V14H8V16ZM16 16H14V14H16V16ZM26 16H24V14H26V16ZM10 14H8V12H10V14ZM14 14H12V12H14V14ZM24 14H22V12H24V14ZM12 12H10V10H12V12ZM21 10H22V12H14V10H19V5H21V10ZM10 10H8V8H10V10ZM13 9H11V5H13V9ZM8 8H6V6H8V8ZM6 6H4V4H6V6ZM11 5H9V3H11V5ZM23 5H21V3H23V5ZM21 3H11V1H21V3Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-upload-to-cloud":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 28H15V18H17V28ZM6 22H3V20H6V22ZM11 22H9V20H11V22ZM23 22H21V20H23V22ZM29 22H26V20H29V22ZM3 20H1V13H3V20ZM13 20H11V18H13V20ZM21 20H19V18H21V20ZM31 20H29V13H31V20ZM15 18H13V16H15V18ZM19 18H17V16H19V18ZM17 16H15V14H17V16ZM5 13H3V11H5V13ZM29 13H25V11H29V13ZM9 11H5V9H9V11ZM25 11H23V9H25V11ZM11 9H9V7H11V9ZM23 9H20V7H23V9ZM20 7H11V5H20V7Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"edit-width":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 27H0V5H2V27ZM32 27H30V5H32V27ZM9 21H7V19H9V21ZM25 21H23V19H25V21ZM7 19H5V17H7V19ZM27 19H25V17H27V19ZM5 17H3V15H5V17ZM25 15V17H7V15H25ZM29 17H27V15H29V17ZM7 15H5V13H7V15ZM27 15H25V13H27V15ZM9 13H7V11H9V13ZM25 13H23V11H25V13Z" fill="currentColor"/>
</svg>`,category:"Edit & Settings"},"feat-access-control":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76400)">
<path d="M26 29H6V27H26V29ZM6 27H4V14H6V27ZM28 27H26V14H28V27ZM17 24H15V22H17V24ZM15 22H13V19H15V22ZM19 22H17V19H19V22ZM17 19H15V17H17V19ZM12 12H26V14H6V12H10V5H12V12ZM22 9H20V5H22V9ZM20 5H12V3H20V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76400">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-account":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76452)">
<path d="M7 29H5V21H7V29ZM27 29H25V21H27V29ZM9 21H7V19H9V21ZM25 21H23V19H25V21ZM23 19H9V17H23V19ZM20 15H12V13H20V15ZM12 13H10V5H12V13ZM22 13H20V5H22V13ZM20 5H12V3H20V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76452">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-calendar":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 29H5V27H27V29ZM5 9H27V7H29V27H27V11H5V27H3V7H5V9ZM11 23H9V21H11V23ZM17 23H15V21H17V23ZM23 23H21V21H23V23ZM11 17H9V15H11V17ZM17 17H15V15H17V17ZM23 17H21V15H23V17ZM11 5H21V2H23V5H27V7H5V5H9V2H11V5Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-camera":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 26H5V24H27V26ZM5 24H3V10H5V24ZM29 24H27V10H29V24ZM19 22H13V20H19V22ZM13 20H11V14H13V20ZM21 20H19V14H21V20ZM9 14H7V12H9V14ZM19 14H13V12H19V14ZM11 10H5V8H11V10ZM27 10H21V8H27V10ZM21 8H11V6H21V8Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-direct-push":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 26H4V24H28V26ZM4 24H2V8H4V24ZM30 24H28V8H30V24ZM17 20H15V18H17V20ZM15 18H13V16H15V18ZM19 18H17V16H19V18ZM13 16H11V14H13V16ZM17 16H15V4H17V16ZM21 16H19V14H21V16ZM11 14H9V12H11V14ZM23 14H21V12H23V14ZM11 8H4V6H11V8ZM28 8H21V6H28V8Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-eis":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76392)">
<path d="M15.0088 31.9912L13.0088 32L13 30L15 29.9912L15.0088 31.9912ZM19.0088 31.9912L17.0088 32L17 30L19 29.9912L19.0088 31.9912ZM13.0088 29.9912L11.0088 30L11 28L13 27.9912L13.0088 29.9912ZM17.0088 29.9912L15.0088 30L15 28L17 27.9912L17.0088 29.9912ZM21.0088 29.9912L19.0088 30L19 28L21 27.9912L21.0088 29.9912ZM23 25H9V23H23V25ZM9 23H7V9H9V23ZM25 23H23V9H25V23ZM18.0176 17.9814L14.0088 18L13.9912 14.0088L18 13.9912L18.0176 17.9814ZM23 9H9V7H23V9ZM13.0088 3.99023L11.0098 4L11 2L13 1.99121L13.0088 3.99023ZM17.0088 3.99023L15.0098 4L15 2L17 1.99121L17.0088 3.99023ZM21.0088 3.99023L19.0098 4L19 2L21 1.99121L21.0088 3.99023ZM15.0088 1.99023L13.0098 2L13 0L15 -0.00878906L15.0088 1.99023ZM19.0088 1.99023L17.0098 2L17 0L19 -0.00878906L19.0088 1.99023Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76392">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-email":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76368)">
<path d="M28 26H4V24H28V26ZM28 8H30V24H28V10H26V8H6V10H4V24H2V8H4V6H28V8ZM20 18H12V16H20V18ZM12 16H10V14H12V16ZM22 16H20V14H22V16ZM10 14H8V12H10V14ZM24 14H22V12H24V14ZM8 12H6V10H8V12ZM26 12H24V10H26V12Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76368">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-even-ai":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 30H15V2H17V30ZM10.5 24H8.5V8H10.5V24ZM23.5 24H21.5V8H23.5V24ZM4 20H2V12H4V20ZM30 20H28V12H30V20Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-facial-scan":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 31H3V29H7V31ZM29 31H25V29H29V31ZM3 29H1V25H3V29ZM31 29H29V25H31V29ZM15 26H17V25H20V27H17V28H15V27H12V25H15V26ZM12 25H9V23H12V25ZM17 25H15V15H17V25ZM23 25H20V23H23V25ZM9 11H7V21H9V23H7V22H5V10H7V9H9V11ZM25 10H27V22H25V23H23V21H25V11H23V9H25V10ZM15 15H12V13H15V15ZM20 15H17V13H20V15ZM12 13H9V11H12V13ZM23 13H20V11H23V13ZM12 9H9V7H12V9ZM23 9H20V7H23V9ZM3 7H1V3H3V7ZM17 5H20V7H17V6H15V7H12V5H15V4H17V5ZM31 7H29V3H31V7ZM7 3H3V1H7V3ZM29 3H25V1H29V3Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-feedback":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 29V27H28V13H25V27H26V29H27ZM4 30H2V28H4V30ZM6 28H4V26H6V28ZM4 26H2V4H4V26ZM8 26H6V24H8V26ZM20 24H8V22H20V24ZM20 17H8V15H20V17ZM20 11H8V9H20V11ZM25 11H28V9H25V11ZM28 4H4V2H28V4ZM28 31H25V29H24V27H23V9H24V7H29V9H30V27H29V29H28V31Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-headup-angle":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76388)">
<path d="M30 27H4V25H30V27ZM4 25H2V23H4V25ZM20 24H18V22H20V24ZM6 23H4V21H6V23ZM8 21H6V19H8V21ZM18 21H16V19H18V21ZM10 19H8V17H10V19ZM16 18H14V16H16V18ZM12 17H10V15H12V17ZM14 15H12V13H14V15ZM16 13H14V11H16V13ZM18 11H16V9H18V11ZM20 9H18V7H20V9ZM22 7H20V5H22V7ZM24 5H22V3H24V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76388">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-inbox":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76412)">
<path d="M5 31H3V29H5V31ZM7 29H5V27H7V29ZM5 27H3V5H5V27ZM9 27H7V25H9V27ZM27 25H9V23H27V25ZM29 23H27V5H29V23ZM17 20H15V18H17V20ZM15 18H13V16H15V18ZM19 18H17V16H19V18ZM13 16H11V14H13V16ZM17 16H15V3H17V16ZM21 16H19V14H21V16ZM11 14H9V12H11V14ZM23 14H21V12H23V14ZM13 5H5V3H13V5ZM27 5H19V3H27V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76412">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-interface-settings":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29 28H27V25H29V28ZM21 25H4V23H21V25ZM27 25H24V23H27V25ZM32 25H29V23H32V25ZM4 23H2V8H4V23ZM29 23H27V20H29V23ZM24 19H7V17H24V19ZM29 17H27V8H29V17ZM24 14H7V12H24V14ZM27 8H4V6H27V8Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-languages":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76380)">
<path d="M10 22H2V20H8V18H2V20H0V16H8V14H10V22ZM20 22H14V20H20V22ZM32 22H26V20H32V22ZM14 12H20V14H14V20H12V8H14V12ZM22 20H20V14H22V20ZM26 20H24V14H26V20ZM8 14H2V12H8V14ZM32 14H26V12H32V14Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76380">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-learn-explore":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 27H4V25H15V27ZM28 27H17V25H28V27ZM4 25H2V7H4V25ZM17 25H15V7H17V25ZM30 25H28V10H30V25ZM24 6H26V8H28V10H24V7H17V5H24V6ZM15 7H4V5H15V7Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-menu":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 27H3V25H14V27ZM3 25H1V7H3V25ZM16 25H14V7H16V25ZM29 25H17V23H29V25ZM31 23H29V9H31V23ZM12 22H5V20H12V22ZM12 17H5V15H12V17ZM12 12H5V10H12V12ZM29 9H17V7H29V9ZM14 7H3V5H14V7Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-message":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76404)">
<path d="M5 31H3V29H5V31ZM7 29H5V27H7V29ZM5 27H3V5H5V27ZM9 27H7V25H9V27ZM27 25H9V23H27V25ZM29 5V23H27V5H29ZM23 18H9V16H23V18ZM23 12H9V10H23V12ZM27 5H5V3H27V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76404">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-navigate":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76324)">
<path d="M6 30H4V12H6V30ZM22 20H20V18H22V20ZM24 18H22V16H24V18ZM26 16H24V14H26V16ZM28 14H26V12H28V14ZM26 12H6V10H26V12ZM30 12H28V10H30V12ZM28 10H26V8H28V10ZM26 8H24V6H26V8ZM24 6H22V4H24V6ZM22 2V4H20V2H22Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76324">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-news":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76416)">
<path d="M25.5 27V29H4.5V27H25.5ZM25.5 23H23.5V5H4.5V27H2.5V3H25.5V23ZM27.5 27H25.5V25H27.5V27ZM29.5 25H27.5V9H29.5V25ZM20.5 23H7.5V21H20.5V23ZM20.5 17H7.5V15H20.5V17ZM10.5 11H7.5V9H10.5V11ZM20.5 11H13.5V9H20.5V11Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76416">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-notification":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76344)">
<path d="M18 29H14V27H18V29ZM27 25H5V23H27V25ZM5 23H3V20H5V23ZM29 23H27V20H29V23ZM7 20H5V18H7V20ZM27 20H25V18H27V20ZM9 18H7V16H9V18ZM25 18H23V16H25V18ZM11 16H9V7H11V16ZM23 7V16H21V7H23ZM13 7H11V5H13V7ZM21 7H19V5H21V7ZM19 5H13V3H19V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76344">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-personal-info":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76456)">
<path d="M7 29H5V21H7V29ZM27 29H25V21H27V29ZM9 21H7V19H9V21ZM25 21H23V19H25V21ZM23 19H9V17H23V19ZM20 15H12V13H20V15ZM12 13H10V5H12V13ZM22 13H20V5H22V13ZM28 8H26V6H28V8ZM26 6H24V4H26V6ZM30 6H28V4H30V6ZM20 5H12V3H20V5ZM28 4H26V2H28V4Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76456">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-phone-call":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76408)">
<path d="M16 30H6V28H16V30ZM6 28H4V21H6V28ZM19 28H16V26H19V28ZM22 26H19V24H22V26ZM24 24H22V22H24V24ZM16 23H13V21H16V23ZM26 22H24V19H26V22ZM13 21H6V19H13V21ZM19 21H16V19H19V21ZM21 19H19V16H21V19ZM28 19H26V16H28V19ZM13 16H11V13H13V16ZM23 16H21V13H23V16ZM30 16H28V6H30V16ZM8 15H6V10H8V15ZM3 14H1V8H3V14ZM16 13H13V11H16V13ZM21 13H19V6H21V13ZM10 10H8V8H10V10ZM5 8H3V5H5V8ZM15 8H10V6H15V8ZM28 6H21V4H28V6ZM8 5H5V3H8V5ZM14 1V3H8V1H14Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76408">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-phone-voice-input":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 30H5V28H17V30ZM5 28H3V4H5V28ZM19 28H17V4H19V28ZM14 26H8V24H14V26ZM29 12H28V15H27V17H28V20H29V23H27V20H26V17H25V15H26V12H27V9H29V12ZM12 21H10V19H12V21ZM24 14H23V18H24V21H22V18H21V14H22V11H24V14ZM10 19H8V17H10V19ZM14 19H12V17H14V19ZM8 17H6V15H8V17ZM12 17H10V11H12V17ZM16 17H14V15H16V17ZM14 5H8V4H5V2H17V4H14V5Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-privacy":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 31H14V29H18V31ZM14 29H11V27H14V29ZM21 29H18V27H21V29ZM11 27H9V25H11V27ZM23 27H21V25H23V27ZM9 25H7V22H9V25ZM25 25H23V22H25V25ZM7 22H5V19H7V22ZM18.5 18H17V22H15V18H13.5V16H18.5V18ZM27 22H25V19H27V22ZM5 19H3V7H5V19ZM29 19H27V7H29V19ZM13.5 16H11.5V11H13.5V16ZM20.5 16H18.5V11H20.5V16ZM18.5 11H13.5V9H18.5V11ZM8 7H5V5H8V7ZM27 7H24V5H27V7ZM12 5H8V3H12V5ZM24 5H20V3H24V5ZM20 3H12V1H20V3Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-qr-code":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 27H5V17H15V27ZM20 27H18V25H20V27ZM25 27H23V25H25V27ZM7 25H13V19H7V25ZM21 24H19V22H21V24ZM27 24H25V22H27V24ZM24 22H22V20H24V22ZM20 20H18V18H20V20ZM27 20H25V18H27V20ZM15 15H5V5H15V15ZM27 15H17V5H27V15ZM7 13H13V7H7V13ZM19 13H25V7H19V13Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-quick-note":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 30H6V28H22V30ZM6 28H4V4H6V28ZM26 26H24V28H22V24H26V26ZM28 4V24H26V4H28ZM18 23H9V21H18V23ZM22 17H9V15H22V17ZM23 11H9V9H23V11ZM26 4H6V2H26V4Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-scan":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 30H4V28H9V30ZM28 30H23V28H28V30ZM4 28H2V23H4V28ZM30 28H28V23H30V28ZM30 17H2V15H30V17ZM4 9H2V4H4V9ZM30 9H28V4H30V9ZM9 4H4V2H9V4ZM28 4H24V2H28V4Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-screen-off":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="27" y="8" width="2" height="16" fill="#232323"/>
<rect x="5" y="6" width="16" height="2" fill="#232323"/>
<rect x="3" y="8" width="2" height="16" fill="#232323"/>
<rect x="11" y="24" width="16" height="2" fill="#232323"/>
<rect x="16" y="14" width="2" height="2" fill="#232323"/>
<rect x="18" y="12" width="2" height="2" fill="#232323"/>
<rect x="20" y="10" width="2" height="2" fill="#232323"/>
<rect x="22" y="8" width="2" height="2" fill="#232323"/>
<rect x="24" y="6" width="2" height="2" fill="#232323"/>
<rect x="14" y="16" width="2" height="2" fill="#232323"/>
<rect x="12" y="18" width="2" height="2" fill="#232323"/>
<rect x="10" y="20" width="2" height="2" fill="#232323"/>
<rect x="8" y="22" width="2" height="2" fill="#232323"/>
<rect x="6" y="24" width="2" height="2" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-services":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 31H14V29H18V31ZM14 29H12V27H14V29ZM27 29H18V27H27V29ZM18 27H14V25H18V27ZM29 27H27V19H29V27ZM5 21H3V19H5V21ZM3 19H1V12H3V19ZM7 19H5V12H3V10H5V7H7V19ZM27 10H29V12H27V19H25V7H27V10ZM31 19H29V12H31V19ZM9 7H7V5H9V7ZM25 7H23V5H25V7ZM23 5H9V3H23V5Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-stocks":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76420)">
<path d="M5 28H3V18H5V28ZM11 28H9V22H11V28ZM17 28H15V18H17V28ZM23 28H21V14H23V28ZM29 10V28H27V10H29ZM11.5 18H8.5V16H11.5V18ZM8.5 16H5.5V14H8.5V16ZM14.5 16H11.5V14H14.5V16ZM5.5 14H2.5V12H5.5V14ZM17.5 14H14.5V12H17.5V14ZM20.5 12H17.5V10H20.5V12ZM23.5 10H20.5V8H23.5V10ZM26.5 8H23.5V6H26.5V8ZM29.5 6H26.5V4H29.5V6Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76420">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-study":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76460)">
<path d="M11 5V22H25V5H11ZM7 23H9V6H7V23ZM22 19H15V17H22V19ZM22 15H15V13H22V15ZM22 10H15V8H22V10ZM27 24H9V25H7V26H9V27H25V25H27V28H25V29H9V28H7V27H5V5H7V4H9V3H27V24Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76460">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-teleprompt":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29 28H3V26H29V28ZM5 21.5H3V19.5H5V21.5ZM29 21H12V19H29V21ZM7 19.5H5V17.5H7V19.5ZM9 17.5H7V15.5H9V17.5ZM7 15.5H5V13.5H7V15.5ZM29 14H12V12H29V14ZM5 13.5H3V11.5H5V13.5ZM29 7H3V5H29V7Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-theme":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76356)">
<path d="M17 29H5V27H17V29ZM5 27H3V15H5V27ZM19 27H17V15H19V27ZM22 24H20V22H22V24ZM24 22H22V10H24V22ZM27 19H25V17H27V19ZM29 17H27V5H29V17ZM17 15H5V13H17V15ZM10 12H8V10H10V12ZM22 10H10V8H22V10ZM15 7H13V5H15V7ZM27 5H15V3H27V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76356">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-time-counting":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76352)">
<path d="M27 29H5V27H27V29ZM5 27H3V5H5V27ZM29 27H27V5H29V27ZM17.9893 16.0039H15.9912V18.001H9.99512V16.001H15.9893V8.00488H17.9893V16.0039ZM27 5H5V3H27V5Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76352">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-transcribe":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23 23H17V28H20V30H12V28H15V23H9V21H23V23ZM9 21H7V19H9V21ZM25 21H23V19H25V21ZM7 19H5V11H7V19ZM27 19H25V11H27V19ZM20 18H12V16H20V18ZM12 16H10V4H12V16ZM22 16H20V4H22V16ZM20 4H12V2H20V4Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-translate":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 32H24V30H26V32ZM24 30H22V28H24V30ZM22 28H20V26H22V28ZM30 28H24V26H30V28ZM24 26H22V24H24V26ZM32 26H30V16H32V26ZM26 24H24V22H26V24ZM13 18H19V16H21V22H19V20H13V22H11V16H13V18ZM2 16H0V6H2V16ZM15 16H13V12H15V16ZM19 16H17V12H19V16ZM17 12H15V8H17V12ZM8 9.99609H6V7.99609H8V9.99609ZM10.002 7.99609H8.00195V5.99609H10.002V7.99609ZM8 6H2V4H8V6ZM12.002 5.99609H10.002V3.99609H12.002V5.99609ZM8.00195 1.99609H10.002V3.99609H8.00195V2H6.00195V0H8.00195V1.99609Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-voice-print":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76384)">
<path d="M9 30H4V28H9V30ZM28 30H23V28H28V30ZM4 28H2V23H4V28ZM30 28H28V23H30V28ZM17 25H15V7H17V25ZM11 21H9V11H11V21ZM23 21H21V11H23V21ZM5 18H3V14H5V18ZM29 18H27V14H29V18ZM4 9H2V4H4V9ZM30 9H28V4H30V9ZM9 4H4V2H9V4ZM28 4H24V2H28V4Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76384">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-wear-detect":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 28H2V26H8V28ZM30 28H24V26H30V28ZM2 26H0V21H2V26ZM32 26H30V21H32V26ZM12 22H6V20H12V22ZM26 22H20V20H26V22ZM6 20H4V13H6V20ZM14 20H12V17H14V20ZM20 20H18V17H20V20ZM28 20H26V13H28V20ZM18 17H14V13H18V17ZM14 13H6V11H14V13ZM26 13H18V11H26V13ZM2 11H0V6H2V11ZM32 11H30V6H32V11ZM8 6H2V4H8V6ZM30 6H24V4H30V6Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"feat-weather":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76360)">
<path d="M4 27H28V25H4V27ZM28 25H30V20H28V25ZM2 25H4V20H2V25ZM26 20H28V18H26V20ZM4 20H7V18H4V20ZM23 18H26V16H23V18ZM7 16V18H9V16H7ZM21 16H23V14H21V16ZM9 16H11V14H9V16ZM23 14H26V12H23V14ZM11 14H21V12H11V14ZM26 12H28V9H26V12ZM9 12H11V9H9V12ZM24 9H26V7H24V9ZM11 9H14V7H11V9ZM14 7H24V5H14V7Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_76360">
<rect width="32" height="32" fill="white" transform="matrix(-1 0 0 1 32 0)"/>
</clipPath>
</defs>
</svg>`,category:"Feature & Function"},"feat-wiki":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30 28H2V26H30V28ZM2 26H0V11H2V26ZM32 26H30V11H32V26ZM17 22H26V24H6V22H15V7H17V22ZM6 22H4V11H2V9H4V7H6V22ZM28 9H30V11H28V22H26V7H28V9ZM13 18H8V16H13V18ZM24 18H19V16H24V18ZM13 13H8V11H13V13ZM24 13H19V11H24V13ZM15 7H6V5H15V7ZM26 7H17V5H26V7Z" fill="#232323"/>
</svg>`,category:"Feature & Function"},"guide-back":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76515)">
<path d="M16 29H14V27H16V29ZM14 27H12V25H14V27ZM12 25H10V23H12V25ZM10 23H8V21H10V23ZM8 21H6V19H8V21ZM6 19H4V17H6V19ZM4 15V17H2V15H4ZM30 17H6V15H30V17ZM6 15H4V13H6V15ZM8 13H6V11H8V13ZM10 11H8V9H10V11ZM12 9H10V7H12V9ZM14 7H12V5H14V7ZM16 5H14V3H16V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76515">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-drill-back":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76497)">
<path d="M23 29H21V27H23V29ZM21 27H19V25H21V27ZM19 25H17V23H19V25ZM17 23H15V21H17V23ZM15 21H13V19H15V21ZM13 19H11V17H13V19ZM11 15V17H9V15H11ZM13 15H11V13H13V15ZM15 13H13V11H15V13ZM17 11H15V9H17V11ZM19 9H17V7H19V9ZM21 7H19V5H21V7ZM23 5H21V3H23V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76497">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-drill-down":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76489)">
<path d="M17 21V23H15V21H17ZM15 21H13V19H15V21ZM19 21H17V19H19V21ZM13 19H11V17H13V19ZM21 19H19V17H21V19ZM11 17H9V15H11V17ZM23 17H21V15H23V17ZM9 15H7V13H9V15ZM25 15H23V13H25V15ZM7 13H5V11H7V13ZM27 13H25V11H27V13ZM5 11H3V9H5V11ZM29 11H27V9H29V11Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76489">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-drill-up":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76481)">
<path d="M29 21L29 23L27 23L27 21L29 21ZM27 19L27 21L25 21L25 19L27 19ZM25 17L25 19L23 19L23 17L25 17ZM23 15L23 17L21 17L21 15L23 15ZM21 13L21 15L19 15L19 13L21 13ZM19 11L19 13L17 13L17 11L19 11ZM15 9L17 9L17 11L15 11L15 9ZM15 11L15 13L13 13L13 11L15 11ZM13 13L13 15L11 15L11 13L13 13ZM11 15L11 17L9 17L9 15L11 15ZM9 17L9 19L7 19L7 17L9 17ZM7 19L7 21L5 21L5 19L7 19ZM5 21L5 23L3 23L3 21L5 21Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76481">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-small-back":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76505)">
<path d="M11 29H9V27H11V29ZM13 27H11V25H13V27ZM15 25H13V23H15V25ZM17 23H15V21H17V23ZM19 21H17V19H19V21ZM21 19H19V17H21V19ZM23 15V17H21V15H23ZM21 15H19V13H21V15ZM19 13H17V11H19V13ZM17 11H15V9H17V11ZM15 9H13V7H15V9ZM13 7H11V5H13V7ZM11 5H9V3H11V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76505">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-small-drill-back":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 25H18V23H20V25ZM18 23H16V21H18V23ZM16 21H14V19H16V21ZM14 19H12V17H14V19ZM12 15V17H10V15H12ZM14 15H12V13H14V15ZM16 13H14V11H16V13ZM18 11H16V9H18V11ZM20 9H18V7H20V9Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-chevron-small-drill-down":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76493)">
<path d="M17 20V22H15V20H17ZM15 20H13V18H15V20ZM19 20H17V18H19V20ZM13 18H11V16H13V18ZM21 18H19V16H21V18ZM11 16H9V14H11V16ZM23 16H21V14H23V16ZM9 14H7V12H9V14ZM25 14H23V12H25V14Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76493">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-chevron-small-drill-in":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 25H12V23H14V25ZM16 23H14V21H16V23ZM18 21H16V19H18V21ZM20 19H18V17H20V19ZM22 15V17H20V15H22ZM20 15H18V13H20V15ZM18 13H16V11H18V13ZM16 11H14V9H16V11ZM14 9H12V7H14V9Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-chevron-small-drill-up":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76485)">
<path d="M9 20H7V18H9V20ZM25 20H23V18H25V20ZM11 18H9V16H11V18ZM23 18H21V16H23V18ZM13 16H11V14H13V16ZM21 16H19V14H21V16ZM15 14H13V12H15V14ZM19 14H17V12H19V14ZM17 10V12H15V10H17Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76485">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-double-tap":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 31H11V29H24V31ZM11 29H9V27H11V29ZM26 29H24V20H26V29ZM9 27H7V20H9V27ZM16 11H17V18H15V11H13V24H11V20H9V18H11V11H12V9H16V11ZM24 20H17V18H24V20ZM14 2H15V5H14V6H11V5H10V2H11V1H14V2ZM21 2H22V5H21V6H18V5H17V2H18V1H21V2Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-go":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76519)">
<path d="M18 29H16V27H18V29ZM20 27H18V25H20V27ZM22 25H20V23H22V25ZM24 23H22V21H24V23ZM26 21H24V19H26V21ZM28 19H26V17H28V19ZM26 17H2V15H26V17ZM30 15V17H28V15H30ZM28 15H26V13H28V15ZM26 13H24V11H26V13ZM24 11H22V9H24V11ZM22 9H20V7H22V9ZM20 7H18V5H20V7ZM18 5H16V3H18V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76519">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-long-press":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 31H11V29H24V31ZM11 29H9V27H11V29ZM26 29H24V20H26V29ZM9 27H7V20H9V27ZM16 11H17V18H15V11H13V24H11V20H9V18H11V11H12V9H16V11ZM24 20H17V18H24V20ZM23 2H24V4H23V5H10V4H9V2H10V1H23V2Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-maximize-card":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76531)">
<path d="M27 29H5V27H27V29ZM5 27H3V5H5V27ZM29 27H27V21H29V27ZM19 23H11V21H19V23ZM11 21H9V13H11V21ZM14 20H12V18H14V20ZM16 18H14V16H16V18ZM18 16H16V14H18V16ZM28 6V14H26V6H28ZM21 13H19V11H21V13ZM23 11H21V9H23V11ZM25 9H23V7H25V9ZM26 6H18V4H26V6ZM11 5H5V3H11V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76531">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-maximize":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76523)">
<path d="M16 30H4V28H16V30ZM4 28H2V16H4V28ZM8 26H6V24H8V26ZM10 24H8V22H10V24ZM12 22H10V20H12V22ZM14 20H12V18H14V20ZM30 4V16H28V4H30ZM20 14H18V12H20V14ZM22.333 12H20.333V10H22.333V12ZM24.333 10H22.333V8H24.333V10ZM26.333 8H24.333V6H26.333V8ZM28 4H16V2H28V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76523">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-minimize-card":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76535)">
<path d="M27 29H5V27H27V29ZM5 27H3V5H5V27ZM29 27H27V21H29V27ZM10 24H8V22H10V24ZM18 24H16V16H18V24ZM12 22H10V20H12V22ZM14 20H12V18H14V20ZM16 16H8V14H16V16ZM28 14H20V12H28V14ZM20 4V12H18V4H20ZM24 10H22V8H24V10ZM26 8H24V6H26V8ZM28 6H26V4H28V6ZM11 5H5V3H11V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76535">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-minimize":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 30H14V18H16V30ZM6 28H4V26H6V28ZM8 26H6V24H8V26ZM10 24H8V22H10V24ZM12 22H10V20H12V22ZM14 18H2V16H14V18ZM30 16H18V14H30V16ZM18 2V14H16V2H18ZM21.667 12H19.667V10H21.667V12ZM23.667 10H21.667V8H23.667V10ZM25.667 8H23.667V6H25.667V8ZM28 6H26V4H28V6Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-search":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27 27H24V24H27V27ZM24 24H21V21H24V24ZM21 21H18V18H21V21ZM16 20H9V18H16V20ZM9 18H7V16H9V18ZM18 18H16V16H18V18ZM7 16H5V9H7V16ZM20 16H18V9H20V16ZM9 9H7V7H9V9ZM18 9H16V7H18V9ZM16 7H9V5H16V7Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-shift-to-top":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76539)">
<path d="M26 26H24V24H26V26ZM24 24H22V22H24V24ZM22 22H20V20H22V22ZM22 8H8V21H6V6H22V8ZM20 20H18V18H20V20ZM18 18H16V16H18V18ZM16 16H14V14H16V16ZM14 14H12V12H14V14ZM12 12H10V10H12V12Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76539">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Guide System"},"guide-single-tap":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 31H11V29H24V31ZM11 29H9V27H11V29ZM26 29H24V20H26V29ZM9 27H7V20H9V27ZM16 11H17V18H15V11H13V24H11V20H9V18H11V11H12V9H16V11ZM24 20H17V18H24V20ZM15 2H16V5H15V6H12V5H11V2H12V1H15V2Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"guide-swip":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.667 31.3334H11.667V29.3334H24.667V31.3334ZM11.667 29.3334H9.66699V27.3334H11.667V29.3334ZM26.667 29.3334H24.667V20.3334H26.667V29.3334ZM9.66699 27.3334H7.66699V20.3334H9.66699V27.3334ZM15.667 11.3334H16.667V14.3334H17.667V18.3334H15.667V14.3334H14.667V11.3334H11.667V14.3334H12.667V18.3334H13.667V24.3334H11.667V20.3334H9.66699V18.3334H10.667V14.3334H9.66699V11.3334H10.667V9.33337H15.667V11.3334ZM24.667 20.3334H17.667V18.3334H24.667V20.3334ZM10.667 5.33337H7.66699V4.33337H6.66699V2.33337H7.66699V1.33337H10.667V5.33337ZM13.667 5.33337H11.667V1.33337H13.667V5.33337ZM16.667 4.83337H14.667V1.83337H16.667V4.83337ZM19.667 4.33337H17.667V2.33337H19.667V4.33337ZM22.667 3.83337H20.667V2.83337H22.667V3.83337Z" fill="currentColor"/>
</svg>`,category:"Guide System"},"health-HRV":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 27H15V25H17V27ZM15 25H13V23H15V25ZM19 25H17V23H19V25ZM13 23H11V21H13V23ZM21 23H19V21H21V23ZM11 21H9V19H11V21ZM23 21H21V19H23V21ZM16 20H14V18H16V20ZM9 19H7V17H9V19ZM25 19H23V17H25V19ZM13.999 18H11.999V16H13.999V18ZM18 18H16V15H18V18ZM11.999 16H3.99902V14H11.999V16ZM28.001 16H24V14H28.001V16ZM20 15H18V12H20V15ZM22.002 12H24V14H22V12H20.002V10H22.002V12ZM7 13H5V9H7V13ZM27 13H25V9H27V13ZM17 11H15V9H17V11ZM9 9H7V7H9V9ZM13.001 7H15V9H13V7H9V5H13.001V7ZM19 9H17V7H19V9ZM23.001 7H25V9H23V7H19V5H23.001V7Z" fill="#232323"/>
</svg>`,category:"Health"},"health-heart-rate":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 27H15V25H17V27ZM15 25H13V23H15V25ZM19 25H17V23H19V25ZM13 23H11V21H13V23ZM21 23H19V21H21V23ZM11 21H9V19H11V21ZM23 21H21V19H23V21ZM9 19H7V17H9V19ZM25 19H23V17H25V19ZM7 17H5V9H7V17ZM27 17H25V9H27V17ZM17 11H15V9H17V11ZM9 9H7V7H9V9ZM13.001 7H15V9H13V7H9V5H13.001V7ZM19 9H17V7H19V9ZM23.001 7H25V9H23V7H19V5H23.001V7Z" fill="#232323"/>
</svg>`,category:"Health"},"health-lift-2":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 26.0007V30.0007H9V26.0007H11ZM23 30.0007H21V26.0007H23V30.0007ZM13 26.0007H11V24.0007H13V26.0007ZM21 26.0007H19V24.0007H21V26.0007ZM15 24.0007H13V22.0007H15V24.0007ZM19 24.0007H17V22.0007H19V24.0007ZM17 22.0007H15V20.0007H17V22.0007ZM6 13.0007H11V11.0007H13V13.0007H19V11.0007H21V13.0007H26V10.0007H28V18.0007H26V15.0007H19V19.9998H17V15.0007H15V19.9998H13V15.0007H6V18.0007H4V10.0007H6V13.0007ZM19 11.0007H13V9.00073H19V11.0007ZM17 7.99976H15V5.99976H17V7.99976Z" fill="#232323"/>
</svg>`,category:"Health"},"health-lift-3":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 26.0012V30.0012H9V26.0012H11ZM23 30.0012H21V26.0012H23V30.0012ZM13 26.0012H11V24.0012H13V26.0012ZM21 26.0012H19V24.0012H21V26.0012ZM15 24.0012H13V22.0012H15V24.0012ZM19 24.0012H17V22.0012H19V24.0012ZM17 22.0012H15V20.0012H17V22.0012ZM15 20.0002H13V14.0002H15V20.0002ZM19 20.0002H17V14.0002H19V20.0002ZM6 3.00122H26V0.0012207H28V8.00122H26V5.00122H23V13.0012H21V14.0012H19V11.0012H21V5.00122H11V11.0012H13V14.0012H11V13.0012H9V5.00122H6V8.00122H4V0.0012207H6V3.00122ZM19 11.0012H13V9.00122H19V11.0012ZM17 8.00024H15V6.00024H17V8.00024Z" fill="#232323"/>
</svg>`,category:"Health"},"health-lift":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 26.0007V30.0007H9V26.0007H11ZM23 30.0007H21V26.0007H23V30.0007ZM13 26.0007H11V24.0007H13V26.0007ZM21 26.0007H19V24.0007H21V26.0007ZM11 20.9998H15V20.0007H17V20.9998H21V13.0007H23V20.9998H26V17.9998H28V25.9998H26V22.9998H19V24.0007H17V22.9998H15V24.0007H13V22.9998H6V25.9998H4V17.9998H6V20.9998H9V13.0007H11V20.9998ZM15 19.9998H13V13.9998H15V19.9998ZM19 19.9998H17V13.9998H19V19.9998ZM13 13.0007H11V11.0007H13V13.0007ZM21 13.0007H19V11.0007H21V13.0007ZM19 11.0007H13V9.00073H19V11.0007ZM17 7.99976H15V5.99976H17V7.99976Z" fill="#232323"/>
</svg>`,category:"Health"},"health-run":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 24.001H24V28.001H26V30.001H22V26.001H20V20.001H22V24.001ZM14 22.001H6V24.001H4V20.001H14V22.001ZM18 22.001H16V12.001H18V22.001ZM12 16.001H10V12.001H12V16.001ZM20 8.00098H24V14.001H26V16.001H22V10.001H20V12.001H18V8.00098H14V12.001H12V8.00098H14V6.00098H20V8.00098ZM24 5.00098H21V2.00098H24V5.00098Z" fill="#232323"/>
</svg>`,category:"Health"},"health-sleep":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_77058)">
<path d="M4 20H15V14H17V20H28V14H30V25H28V22H4V26H2V6H4V20ZM11 17H8V15H11V17ZM8 15H6V12H8V15ZM13 15H11V12H13V15ZM28 14H17V12H28V14ZM11 10V12H8V10H11Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_77058">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Health"},"health-spo2":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 29H12V27H19V29ZM12 27H10V25H12V27ZM21 27H19V25H21V27ZM10 25H8V23H10V25ZM23 25H21V23H23V25ZM9 14H8V23H6V14H7V12H9V14ZM20 22H16V20H20V22ZM16 20H14V16H16V20ZM22 20H20V16H22V20ZM20 16H16V14H20V16ZM11 12H9V9H11V12ZM23 12H21V9H23V12ZM13 9H11V6H13V9ZM21 9H19V6H21V9ZM15 6H13V4H15V6ZM19 6H17V4H19V6ZM17 4H15V2H17V4Z" fill="#232323"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23 16L23 14L27 14L27 16L23 16Z" fill="#232323"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23 20L23 18L25 18L25 20L23 20Z" fill="#232323"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 18L25 16L27 16L27 18L25 18Z" fill="#232323"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23 22L23 20L27 20L27 22L23 22Z" fill="#232323"/>
</svg>`,category:"Health"},"health-stand":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 22.001V30.001H11V22.001H13ZM21 30.001H19V22.001H21V30.001ZM15 22.001H13V20.001H15V22.001ZM19 22.001H17V20.001H19V22.001ZM17 20.001H15V10.001H17V20.001ZM12 17.001H10V10.001H12V17.001ZM22 17.001H20V10.001H22V17.001ZM19 8.00098H20V10.001H18V8.00098H14V10.001H12V8.00098H13V6.00098H19V8.00098ZM17.667 4.66797H15V2.00098H17.667V4.66797Z" fill="#232323"/>
</svg>`,category:"Health"},"health-steps":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_77030)">
<path d="M11 31H8V29H11V31ZM8 29H6V25H8V29ZM12 21H13V29H11V21H10V18H12V21ZM6 25H4V21H6V25ZM24 25H21V23H24V25ZM22 15H21V23H19V15H20V12H22V15ZM26 23H24V19H26V23ZM4 21H2V15H4V21ZM28 19H26V15H28V19ZM14 18H12V13H14V18ZM7 15H4V13H7V15ZM30 15H28V9H30V15ZM3 14H1V12H3V14ZM12 13H7V11H12V13ZM5 12H3V10H5V12ZM20 7V12H18V7H20ZM7 10H5V8H7V10ZM14 10H12V7H14V10ZM10 9H8V7H10V9ZM28 9H25V7H28V9ZM31 8H29V6H31V8ZM25 7H20V5H25V7ZM29 6H27V4H29V6ZM20 4H18V1H20V4ZM27 4H25V2H27V4ZM24 3H22V1H24V3Z" fill="#232323"/>
</g>
<defs>
<clipPath id="clip0_10001_77030">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Health"},"health-temperature":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 29H12V27H20V29ZM12 27H10V25H12V27ZM22 27H20V25H22V27ZM17 18H19V20H21V24H19V26H13V24H11V20H13V18H15V11H17V18ZM10 25H8V19H10V25ZM24 25H22V19H24V25ZM12 19H10V17H12V19ZM22 19H20V17H22V19ZM14 17H12V5H14V17ZM20 17H18V5H20V17ZM26 9H24V7H26V9ZM24 7H22V5H24V7ZM28 7H26V5H28V7ZM18 5H14V3H18V5ZM26 5H24V3H26V5Z" fill="#232323"/>
</svg>`,category:"Health"},"health-walk":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 30.0012H8V24.0012H10V30.0012ZM20 24.0012H21V28.0012H22V30.0012H19V24.0012H18V22.0012H20V24.0012ZM12 24.0012H10V22.0012H12V24.0012ZM14 22.0012H12V20.0012H14V22.0012ZM18 22.0012H16V20.0012H18V22.0012ZM16 20.0012H14V10.0012H16V20.0012ZM10 17.0012H8V10.0012H10V17.0012ZM24 16.0012H22V14.0012H24V16.0012ZM22 12.0012V14.0012H20V12.0012H22ZM20 12.0012H18V8.00122H20V12.0012ZM12 10.0012H10V8.00122H12V10.0012ZM18 8.00122H12V6.00122H18V8.00122ZM17.667 4.66821H15V2.00122H17.667V4.66821Z" fill="#232323"/>
</svg>`,category:"Health"},"menu-even-hub-highlighted":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76297)">
<path d="M13 19H15V28H13V30H4V28H2V19H4V17H13V19ZM26 30H21V28H26V30ZM21 28H19V26H21V28ZM28 28H26V26H28V28ZM19 26H17V21H19V26ZM30 26H28V21H30V26ZM21 21H19V19H21V21ZM28 21H26V19H28V21ZM26 19H21V17H26V19ZM13 4H15V13H13V15H4V13H2V4H4V2H13V4ZM28 4H30V13H28V15H19V13H17V4H19V2H28V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76297">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-even-hub":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76293)">
<path d="M13 30H4V28H13V30ZM26 30H21V28H26V30ZM4 28H2V19H4V28ZM15 28H13V19H15V28ZM21 28H19V26H21V28ZM28 28H26V26H28V28ZM19 26H17V21H19V26ZM30 26H28V21H30V26ZM21 21H19V19H21V21ZM28 21H26V19H28V21ZM13 19H4V17H13V19ZM26 19H21V17H26V19ZM13 15H4V13H13V15ZM28 15H19V13H28V15ZM4 13H2V4H4V13ZM15 13H13V4H15V13ZM19 13H17V4H19V13ZM30 13H28V4H30V13ZM13 4H4V2H13V4ZM28 4H19V2H28V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76293">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-gear-highlighted":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76305)">
<path d="M17 3H19V7H21V6H23V5H25V6H26V7H27V9H26V11H25V13H29V15H30V17H29V19H25V21H26V23H27V25H26V26H25V27H23V26H21V25H19V29H17V30H15V29H13V25H11V26H9V27H7V26H6V25H5V23H6V21H7V19H3V17H2V15H3V13H7V11H6V9H5V7H6V6H7V5H9V6H11V7H13V3H15V2H17V3ZM13 12V13H12V19H13V20H19V19H20V13H19V12H13Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76305">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-gear":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76301)">
<path d="M15 28H17V25H19V29H17V30H15V29H13V25H15V28ZM9 22H8V23H7V24H8V25H9V24H10V23H13V25H11V26H9V27H7V26H6V25H5V23H6V21H7V19H9V22ZM22 24H23V25H24V24H25V23H24V22H23V19H25V21H26V23H27V25H26V26H25V27H23V26H21V25H19V23H22V24ZM19 21H13V19H19V21ZM7 15H4V17H7V19H3V17H2V15H3V13H7V15ZM13 19H11V13H13V19ZM21 19H19V13H21V19ZM29 15H30V17H29V19H25V17H28V15H25V13H29V15ZM9 6H11V7H13V9H10V8H9V7H8V8H7V9H8V10H9V13H7V11H6V9H5V7H6V6H7V5H9V6ZM19 13H13V11H19V13ZM25 6H26V7H27V9H26V11H25V13H23V10H24V9H25V8H24V7H23V8H22V9H19V7H21V6H23V5H25V6ZM17 3H19V7H17V4H15V7H13V3H15V2H17V3Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76301">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-healt-highlighted":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76289)">
<path d="M13 5H15V7H17V5H19V3H24V5H27V7H29V9H30V13H29V14H31V15H26V12H24V10H22V12H20V15H18V18H16V21H14V19H12V21H14V23H16V21H18V18H20V15H22V12H24V15H26V17H31V18H27V19H26V21H24V23H22V25H20V27H18V29H14V27H12V25H10V23H8V21H6V19H5V18H1V17H10V19H12V17H10V15H1V14H2V9H3V7H5V5H8V3H13V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76289">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-healt":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76285)">
<path d="M18 29H14V27H18V29ZM14 27H12V25H14V27ZM20 27H18V25H20V27ZM12 25H10V23H12V25ZM22 25H20V23H22V25ZM10 23H8V21H10V23ZM16 23H14V21H16V23ZM24 23H22V21H24V23ZM8 21H6V19H8V21ZM14 21H12V19H14V21ZM18 21H16V18H18V21ZM26 21H24V19H26V21ZM12 19H10V17H12V19ZM20 18H18V15H20V18ZM10 17H1V15H10V17ZM31 17H26V15H31V17ZM22 15H20V12H22V15ZM26 15H24V12H26V15ZM5 9H4V13H2V9H3V7H5V9ZM29 9H30V13H28V9H27V7H29V9ZM24 12H22V10H24V12ZM17 9H15V7H17V9ZM8 7H5V5H8V7ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM27 7H24V5H27V7ZM13 5H8V3H13V5ZM24 5H19V3H24V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76285">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-home-highlighted":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76281)">
<path d="M17 5H19V7H21V9H23V11H25V13H27V15H29V17H27V27H25V29H7V27H5V17H3V15H5V13H7V11H9V9H11V7H13V5H15V3H17V5ZM13 23H19V20H13V23ZM3 19H1V17H3V19ZM31 19H29V17H31V19Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76281">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"menu-home":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76277)">
<path d="M25 29H7V27H25V29ZM7 27H5V17H7V27ZM27 27H25V17H27V27ZM21 25H11V18H21V25ZM13 23H19V20H13V23ZM3 19H1V17H3V19ZM31 19H29V17H31V19ZM5 17H3V15H5V17ZM29 17H27V15H29V17ZM7 15H5V13H7V15ZM27 15H25V13H27V15ZM9 13H7V11H9V13ZM25 13H23V11H25V13ZM11 11H9V9H11V11ZM23 11H21V9H23V11ZM13 9H11V7H13V9ZM21 9H19V7H21V9ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM17 5H15V3H17V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76277">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Menu Bar"},"nav-bicycle":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76967)">
<path d="M11 28H5V26H11V28ZM27 28H21V26H27V28ZM5 26H3V24H5V26ZM13 26H11V24H13V26ZM21 18H20V24H21V26H19V24H18V18H19V16H21V18ZM29 18H30V24H29V26H27V24H28V18H27V16H29V18ZM3 24H1V18H3V24ZM15 24H13V18H15V24ZM23 14H27V16H25V22H23V16H21V14H11V12H21V8H23V14ZM5 18H3V16H5V18ZM13 18H11V16H13V18ZM11 16H5V14H11V16ZM11 10V12H7V10H11ZM21 8H19V5H21V8ZM19 5H14V3H19V5ZM23 5H21V3H23V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76967">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-bus":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76975)">
<path d="M25.001 25.001V19.001H7V25.001H25.001ZM14 23.001H8V21.001H14.001L14 23.001ZM24.001 23.001H18.001V21.001H24.001V23.001ZM7 17.001H25.001V9H7V17.001ZM4 14.001H2V9H4V14.001ZM30.001 14.001H28.001V9H30.001V14.001ZM25.001 5H7V3H25.001V5ZM27.001 27.001H26.001V29.001H22.001V27.001H10V29.001H6V27.001H5V5H7V7H25.001V5H27.001V27.001Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76975">
<rect width="32.0013" height="32.0013" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-business":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76983)">
<path d="M27 28H5V26H27V28ZM5 26H3V12H5V26ZM29 26H27V12H29V26ZM11 10H21V6H23V10H27V12H23V19H21V12H11V19H9V12H5V10H9V6H11V10ZM21 6H11V4H21V6Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76983">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-cloth-shop":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76995)">
<path d="M24 29H8V27H24V29ZM4 14H6V10H8V27H6V16H2V9H4V14ZM30 16H26V27H24V10H26V14H28V9H30V16ZM6 9H4V7H6V9ZM17 9H15V7H17V9ZM28 9H26V7H28V9ZM8 7H6V5H8V7ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM26 7H24V5H26V7ZM13 5H8V3H13V5ZM24 5H19V3H24V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76995">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-coffee-shop":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_77003)">
<path d="M28 29H2V27H28V29ZM21 25H7V23H21V25ZM7 23H5V21H7V23ZM23 23H21V21H23V23ZM5 21H3V11H5V21ZM25 16H27V18H25V21H23V11H25V16ZM29 16H27V11H29V16ZM23 11H5V9H23V11ZM27 11H25V9H27V11ZM11 8H9V6H11V8ZM17 8H15V6H17V8ZM13 6H11V4H13V6ZM19 6H17V4H19V6ZM11 4H9V2H11V4ZM17 4H15V2H17V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_77003">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-compass":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 27H8V29H3V24H5V27ZM12 27H8V25H12V27ZM16 25H12V23H16V25ZM7 24H5V20H7V24ZM23 21H21V23H16V21H19V19H21V16H23V21ZM9 20H7V16H9V20ZM19 19H13V13H19V19ZM15 17H17V15H15V17ZM16 11H13V13H11V16H9V11H11V9H16V11ZM25 16H23V12H25V16ZM27 12H25V8H27V12ZM20 9H16V7H20V9ZM29 3V8H27V5H24V3H29ZM24 7H20V5H24V7Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-crown":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 28.001H6V26.001H26V28.001ZM27 24.001H28V26.001H26V24.001H6V26.001H4V24.001H5V22.001H27V24.001ZM5 22.001H3V10.001H5V22.001ZM29 22.001H27V10.001H29V22.001ZM17 20.001H15V18.001H17V20.001ZM15 18.001H13V15.001H15V18.001ZM19 18.001H17V15.001H19V18.001ZM17 15.001H15V13.001H17V15.001ZM11 14.001H9V12.001H11V14.001ZM23 14.001H21V12.001H23V14.001ZM9 12.001H7V10.001H9V12.001ZM13 12.001H11V9.00098H13V12.001ZM21 12.001H19V9.00098H21V12.001ZM25 12.001H23V10.001H25V12.001ZM7 10.001H5V8.00098H7V10.001ZM27 10.001H25V8.00098H27V10.001ZM15 9.00098H13V6.00098H15V9.00098ZM19 9.00098H17V6.00098H19V9.00098ZM17 6.00098H15V4.00098H17V6.00098Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-direction":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_77019)">
<path d="M10 24.667H8V14.667H10V24.667ZM20 18.667V20.667H18V18.667H20ZM22 18.667H20V16.667H22V18.667ZM24 16.667H22V14.667H24V16.667ZM22 14.667H10V12.667H22V14.667ZM26 14.667H24V12.667H26V14.667ZM24 12.667H22V10.667H24V12.667ZM22 10.667H20V8.66699H22V10.667ZM20 8.66699H18V6.66602H20V8.66699Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_77019">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-end-location":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 23.001H11V21.001H21V23.001ZM11 11.001V21.001H9V11.001H11ZM23 21.001H21V11.001H23V21.001ZM18 18.001H14V14.001H18V18.001ZM21 11.001H11V9.00098H21V11.001Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-flag":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 19H21V21H7V30H5V5H7V19ZM23 19H21V17H23V19ZM25 17H23V15H25V17ZM27 15H25V13H27V15ZM29 13H27V11H29V13ZM27 11H25V9H27V11ZM25 9H23V7H25V9ZM23 7H21V5H23V7ZM21 5H7V3H21V5Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-gift":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 10.501H17V8.50098H19V10.501H29.5V12.501H27V25.501H25V12.501H17V25.501H25V27.501H7V25.501H15V12.501H7V25.501H5V12.501H2.5V10.501H13V8.50098H15V10.501ZM13 8.50098H11V6.50098H13V8.50098ZM21 8.50098H19V6.50098H21V8.50098ZM11 6.50098H9V4.50098H11V6.50098ZM23 6.50098H21V4.50098H23V6.50098Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-groceries":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76991)">
<path d="M12 28H10V26H12V28ZM25 28H23V26H25V28ZM25 25H10V23H25V25ZM10 23H8V20H10V23ZM25 20H10V18H25V20ZM10 18H8V14H10V18ZM27 18H25V14H27V18ZM8 8H27V10H8V14H6V6H8V8ZM29 14H27V10H29V14ZM6 6H3V4H6V6Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76991">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-home-address":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76931)">
<path d="M20 27H25V29H7V27H12V17H20V27ZM7 27H5V17H7V27ZM14 27H18V19H14V27ZM27 27H25V17H27V27ZM3 19H1V17H3V19ZM31 19H29V17H31V19ZM5 17H3V15H5V17ZM29 17H27V15H29V17ZM7 15H5V13H7V15ZM27 15H25V13H27V15ZM9 13H7V11H9V13ZM25 13H23V11H25V13ZM11 11H9V9H11V11ZM23 11H21V9H23V11ZM13 9H11V7H13V9ZM21 9H19V7H21V9ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM17 5H15V3H17V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76931">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-hotel":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76999)">
<path d="M4 20H15V14H17V20H28V14H30V25H28V22H4V26H2V6H4V20ZM11 17H8V15H11V17ZM8 15H6V12H8V15ZM13 15H11V12H13V15ZM28 14H17V12H28V14ZM11 10V12H8V10H11Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76999">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-location":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 30H15V28H17V30ZM15 28H13V26H15V28ZM19 28H17V26H19V28ZM13 26H11V24H13V26ZM21 26H19V24H21V26ZM11 24H9V21H11V24ZM23 24H21V21H23V24ZM9 21H7V18H9V21ZM25 21H23V18H25V21ZM7 18H5V8H7V18ZM19 18H13V16H19V18ZM27 18H25V8H27V18ZM13 16H11V10H13V16ZM21 16H19V10H21V16ZM19 10H13V8H19V10ZM9 8H7V6H9V8ZM25 8H23V6H25V8ZM11 6H9V4H11V6ZM23 6H21V4H23V6ZM21 4H11V2H21V4Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-office-address":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76935)">
<path d="M20 10H26V12H20V27H26V12H28V27H30V29H2V27H4V9H6V27H18V5H20V10ZM16 25H8V23H16V25ZM16 21H8V19H16V21ZM16 17H8V15H16V17ZM16 13H8V11H16V13ZM10 9H6V7H10V9ZM14 7H10V5H14V7ZM18 5H14V3H18V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76935">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-relocate":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76947)">
<path d="M17 31H15V29H17V31ZM15 29H13V25H15V29ZM19 29H17V25H19V29ZM13 25H11V21H13V25ZM21 25H19V21H21V25ZM11 21H7V19H11V21ZM23 21H21V16H23V21ZM7 19H3V17H7V19ZM3 17H1V15H3V17ZM25 16H23V12H25V16ZM7 15H3V13H7V15ZM11 13H7V11H11V13ZM27 12H25V8H27V12ZM16 11H11V9H16V11ZM20 9H16V7H20V9ZM29 3V8H27V5H24V3H29ZM24 7H20V5H24V7Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76947">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-restaurant":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76979)">
<path d="M11 29H9V15H11V29ZM23 29H21V15H23V29ZM11 12H12V14H8V12H9V3H11V12ZM24 14H20V12H24V14ZM8 12H6V4H8V12ZM14 12H12V4H14V12ZM20 12H18V5H20V12ZM26 12H24V5H26V12ZM24 5H20V3H24V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76979">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-shopping":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 29.0012H4V27.0012H28V29.0012ZM11 10.0012H6V15.0012H5V21.0012H4V27.0012H2V21.0012H3V15.0012H4V9.00122H6V8.00122H9V4.00122H11V10.0012ZM23 8.00122H26V9.00122H28V15.0012H29V21.0012H30V27.0012H28V21.0012H27V15.0012H26V10.0012H13V8.00122H21V4.00122H23V8.00122ZM19 21.0012H13V19.0012H19V21.0012ZM13 19.0012H11V17.0012H13V19.0012ZM21 19.0012H19V17.0012H21V19.0012ZM11 17.0012H9V13.0012H11V17.0012ZM23 17.0012H21V13.0012H23V17.0012ZM21 4.00122H11V2.00122H21V4.00122Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-train":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76971)">
<path d="M12 28H20V26H12V28ZM7 24H5V6H7V24ZM27 24H25V6H27V24ZM22 15H10V8H22V15ZM12 13H20V10H12V13ZM13 6H7V4H13V6ZM19 4H17V6H15V4H13V2H19V4ZM25 6H19V4H25V6ZM22 28H27V30H5V28H10V26H7V24H25V26H22V28Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76971">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Navigate"},"nav-walk":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 30.0007H8V24.0007H10V30.0007ZM20 24.0007H21V28.0007H22V30.0007H19V24.0007H18V22.0007H20V24.0007ZM12 24.0007H10V22.0007H12V24.0007ZM14 22.0007H12V20.0007H14V22.0007ZM18 22.0007H16V20.0007H18V22.0007ZM16 20.0007H14V18.0007H16V20.0007ZM14 18.0007H12V10.0007H14V18.0007ZM18 18.0007H16V12.0007H18V18.0007ZM10 17.0007H8V10.0007H10V17.0007ZM24 16.0007H22V14.0007H24V16.0007ZM22 12.0007V14.0007H20V12.0007H22ZM20 12.0007H18V8.00073H20V12.0007ZM12 10.0007H10V8.00073H12V10.0007ZM18 8.00073H12V6.00073H18V8.00073ZM17.667 4.66772H15V2.00073H17.667V4.66772Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-zoom-in":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 25H23V23H25V25ZM23 23H21V21H23V23ZM17 21H9V19H17V21ZM21 21H19V19H21V21ZM9 19H7V17H9V19ZM19 19H17V17H19V19ZM7 17H5V9H7V17ZM14 12H17V14H14V17H12V14H9V12H12V9H14V12ZM21 17H19V9H21V17ZM9 9H7V7H9V9ZM19 9H17V7H19V9ZM17 7H9V5H17V7Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"nav-zoom-out":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 25H23V23H25V25ZM23 23H21V21H23V23ZM17 21H9V19H17V21ZM21 21H19V19H21V21ZM9 19H7V17H9V19ZM19 19H17V17H19V19ZM7 17H5V9H7V17ZM21 17H19V9H21V17ZM17 14H9V12H17V14ZM9 9H7V7H9V9ZM19 9H17V7H19V9ZM17 7H9V5H17V7Z" fill="currentColor"/>
</svg>`,category:"Navigate"},"status-alert":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.9">
<path d="M26 28H6V26H26V28ZM6 26H4V6H6V26ZM28 26H26V6H28V26ZM17 23H15V21H17V23ZM17 19H15V9H17V19ZM26 6H6V4H26V6Z" fill="currentColor"/>
</g>
</svg>`,category:"Status"},"status-archived-file":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 30H6V28H26V30ZM6 28H4V4H6V28ZM28 28H26V4H28V28ZM11 23H9V21H11V23ZM12 20H10V18H12V20ZM10 18H8V16H10V18ZM12 16H10V14H12V16ZM10 14H8V12H10V14ZM12 12H10V10H12V12ZM10 10H8V8H10V10ZM12 8H10V6H12V8ZM26 4H10V6H8V4H6V2H26V4Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-bad-pressed":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="26" y="8" width="2" height="10" fill="#7B7B7B"/>
<rect x="24" y="8" width="2" height="10" fill="#7B7B7B"/>
<rect x="24" y="18" width="2" height="2" fill="#7B7B7B"/>
<rect x="20" y="18" width="2" height="2" fill="#7B7B7B"/>
<rect x="12" y="20" width="8" height="2" fill="#7B7B7B"/>
<rect x="12" y="22" width="6" height="2" fill="#7B7B7B"/>
<rect x="10" y="24" width="6" height="2" fill="#7B7B7B"/>
<rect x="10" y="26" width="4" height="2" fill="#7B7B7B"/>
<rect x="10" y="28" width="2" height="2" fill="#7B7B7B"/>
<rect x="3" y="12" width="2" height="6" fill="#7B7B7B"/>
<rect x="5" y="12" width="17" height="6" fill="#7B7B7B"/>
<rect x="7" y="8" width="15" height="4" fill="#7B7B7B"/>
<rect x="5" y="8" width="2" height="4" fill="#7B7B7B"/>
<rect x="7" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="20" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="4" width="11" height="2" fill="#7B7B7B"/>
<rect x="9" y="6" width="11" height="2" fill="#7B7B7B"/>
<rect x="5" y="18" width="15" height="2" fill="#7B7B7B"/>
<rect x="8" y="24" width="2" height="4" fill="#7B7B7B"/>
<rect x="10" y="22" width="2" height="2" fill="#7B7B7B"/>
<rect x="24" y="6" width="2" height="2" fill="#7B7B7B"/>
</svg>`,category:"Status"},"status-bad":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="26" y="8" width="2" height="10" fill="#7B7B7B"/>
<rect x="22" y="8" width="2" height="10" fill="#7B7B7B"/>
<rect x="24" y="18" width="2" height="2" fill="#7B7B7B"/>
<rect x="20" y="18" width="2" height="2" fill="#7B7B7B"/>
<rect x="18" y="20" width="2" height="2" fill="#7B7B7B"/>
<rect x="16" y="22" width="2" height="2" fill="#7B7B7B"/>
<rect x="14" y="24" width="2" height="2" fill="#7B7B7B"/>
<rect x="12" y="26" width="2" height="2" fill="#7B7B7B"/>
<rect x="10" y="28" width="2" height="2" fill="#7B7B7B"/>
<rect x="3" y="12" width="2" height="6" fill="#7B7B7B"/>
<rect x="5" y="8" width="2" height="4" fill="#7B7B7B"/>
<rect x="7" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="20" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="4" width="11" height="2" fill="#7B7B7B"/>
<rect x="5" y="18" width="9" height="2" fill="#7B7B7B"/>
<rect x="8" y="24" width="2" height="4" fill="#7B7B7B"/>
<rect x="10" y="20" width="2" height="4" fill="#7B7B7B"/>
<rect x="24" y="6" width="2" height="2" fill="#7B7B7B"/>
</svg>`,category:"Status"},"status-battery-50":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76761)">
<path d="M26 24H3V22H26V24ZM3 22H1V10H3V22ZM28 13H30V19H28V22H26V10H28V13ZM8 20H6V12H8V20ZM13 20H11V12H13V20ZM26 10H3V8H26V10Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76761">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-battery-75":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76757)">
<path d="M26 24H3V22H26V24ZM3 22H1V10H3V22ZM28 13H30V19H28V22H26V10H28V13ZM8 20H6V12H8V20ZM13 20H11V12H13V20ZM18 20H16V12H18V20ZM26 10H3V8H26V10Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76757">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-battery-dying":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76769)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 22L26 22L26 24L3 24L3 22Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 8L26 8L26 10L3 10L3 8Z" fill="currentColor"/>
<rect x="26" y="10" width="2" height="12" fill="currentColor"/>
<rect x="28" y="13" width="2" height="6" fill="currentColor"/>
<rect x="1" y="10" width="2" height="12" fill="currentColor"/>
<rect x="6" y="12" width="2" height="8" fill="#FF453A"/>
</g>
<defs>
<clipPath id="clip0_10001_76769">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-battery-full":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76753)">
<path d="M26 24H3V22H26V24ZM3 22H1V10H3V22ZM28 13H30V19H28V22H26V10H28V13ZM8 20H6V12H8V20ZM13 20H11V12H13V20ZM18 20H16V12H18V20ZM23 20H21V12H23V20ZM26 10H3V8H26V10Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76753">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-battery-low":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76765)">
<path d="M26 24H3V22H26V24ZM3 22H1V10H3V22ZM28 13H30V19H28V22H26V10H28V13ZM8 20H6V12H8V20ZM26 10H3V8H26V10Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76765">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-bluetooth-disconnected":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.9971 28.9971H17.9971V26.9971H19.9971V28.9971ZM21.9971 26.9971H19.9971V24.9971H21.9971V26.9971ZM17.9971 26.9951H15.9971V18H17.9971V26.9951ZM8 26H6V24H8V26ZM23.9971 24.9971H21.9971V22.9971H23.9971V24.9971ZM10 24H8V22H10V24ZM26 22.9971H24V20.9971H26V22.9971ZM12 22H10V20H12V22ZM23.9971 20.9971H21.9971V18.9971H23.9971V20.9971ZM14 20H12V18H14V20ZM14 14H12V12H14V14ZM19.9971 4.99707H21.9971V6.99707H19.9971V5H17.9971V14H15.9971V4.99707H17.9971V3H19.9971V4.99707ZM23.9971 12.9971H21.9971V10.9971H23.9971V12.9971ZM12 12H10V10H12V12ZM26 10.9971H24V8.99707H26V10.9971ZM10 10H8V8H10V10ZM23.9971 9H21.9971V7H23.9971V9ZM8 8H6V6H8V8Z" fill="#FF453A"/>
</svg>`,category:"Status"},"status-bluetooth":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76741)">
<path d="M19.998 28.9971H17.998V26.9971H19.998V28.9971ZM23.9971 24.999H21.998V26.9971H19.998V24.9971H21.9971V22.999H23.9971V24.999ZM17.998 14.999H19.998V16.9971H21.998V18.9971H19.998V16.999H17.998V26.9961H15.998V18H14V14H15.998V4.99902H17.998V14.999ZM8 26H6V24H8V26ZM10 24H8V22H10V24ZM26 22.9971H24V20.9971H26V22.9971ZM12 22H10V20H12V22ZM23.9971 20.999H21.9971V18.999H23.9971V20.999ZM14 20H12V18H14V20ZM21.998 15H19.998V13H21.998V15ZM14 14H12V12H14V14ZM23.9971 12.999H21.9971V10.999H23.9971V12.999ZM12 12H10V10H12V12ZM26 10.999H24V8.99902H26V10.999ZM10 10H8V8H10V10ZM23.9971 9H21.9971V7H23.9971V9ZM8 8H6V6H8V8ZM21.998 6.99902H19.998V4.99902H21.998V6.99902ZM19.998 5H17.998V3H19.998V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76741">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-brightness-auto":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 26H27V23H29V30H27V28H20V30H18V23H20V26ZM6 28H4V26H6V28ZM15 23H11V21H15V23ZM22 23H20V20H22V23ZM27 23H25V20H27V23ZM11 21H9V11H11V21ZM25 20H22V18H25V20ZM4 17H2V15H4V17ZM30 17H28V15H30V17ZM23 15H21V11H23V15ZM21 11H11V9H21V11ZM6 6H4V4H6V6ZM28 6H26V4H28V6ZM17 4H15V2H17V4Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-brightness":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 30H15V28H17V30ZM6 28H4V26H6V28ZM28 26V28H26V26H28ZM21 23H11V21H21V23ZM11 21H9V11H11V21ZM23 21H21V11H23V21ZM4 17H2V15H4V17ZM30 17H28V15H30V17ZM21 11H11V9H21V11ZM6 6H4V4H6V6ZM28 6H26V4H28V6ZM17 4H15V2H17V4Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-case-battery":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 26H18V24H28V26ZM14 24H4V22H14V24ZM18 24H16V19H18V24ZM30 20H31V23H30V24H28V19H30V20ZM4 18H14V20H4V22H2V9H4V18ZM28 19H18V17H28V19ZM18 16H14V14H18V16ZM30 15H28V9H30V15ZM28 9H4V7H28V9Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-case-charging":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 22L14 22L14 24L4 24L4 22Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 7L28 7L28 9L4 9L4 7Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 18L14 18L14 20L4 20L4 18Z" fill="currentColor"/>
<rect x="2" y="9" width="2" height="13" fill="currentColor"/>
<rect x="28" y="9" width="2" height="6" fill="currentColor"/>
<rect x="14" y="14" width="4" height="2" fill="currentColor"/>
<path d="M18 17H28V19H18V17Z" fill="currentColor"/>
<path d="M18 19H28V24H18V19Z" fill="#FEF991"/>
<path d="M18 24H28V26H18V24Z" fill="currentColor"/>
<path d="M28 19H30V24H28V19Z" fill="currentColor"/>
<path d="M30 20H31V23H30V20Z" fill="currentColor"/>
<rect x="16" y="19" width="2" height="5" fill="currentColor"/>
</svg>`,category:"Status"},"status-case":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 24H4V22H28V24ZM4 18H28V9H30V22H28V20H4V22H2V9H4V18ZM18 16H14V14H18V16ZM28 9H4V7H28V9Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-checkbox":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23 25H9V23H23V25ZM9 23H7V9H9V23ZM25 23H23V9H25V23ZM23 9H9V7H23V9Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-checkmark":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 24H11V22H13V24ZM11 22H9V20H11V22ZM15 22H13V20H15V22ZM9 20H7V18H9V20ZM17 20H15V18H17V20ZM7 18H5V16H7V18ZM19 18H17V16H19V18ZM21 16H19V14H21V16ZM23 14H21V12H23V14ZM25 12H23V10H25V12ZM27 10H25V8H27V10Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-clickbox":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 23H11V21H21V23ZM11 21H9V11H11V21ZM23 21H21V11H23V21ZM21 11H11V9H21V11Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-complete":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76829)">
<path d="M12 26H10V24H12V26ZM10 24H8V22H10V24ZM14 24H12V22H14V24ZM8 22H6V20H8V22ZM16 22H14V20H16V22ZM6 20H4V18H6V20ZM18 20H16V18H18V20ZM4 18H2V16H4V18ZM20 18H18V16H20V18ZM22 16H20V14H22V16ZM24 14H22V12H24V14ZM26 12H24V10H26V12ZM28 10H26V8H28V10ZM30 8H28V6H30V8Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76829">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-disconnected":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76733)">
<path d="M25 29H20V27H25V29ZM7.00098 27H5.00098V25H7.00098V27ZM20 27H18V25H20V27ZM27 27H25V25H27V27ZM9.00098 25H7.00098V23H9.00098V25ZM18 25H16V23H18V25ZM29 25H27V20H29V25ZM11.001 23H9.00098V21H11.001V23ZM15 19H13.001V21H11.001V19H13V17H15V19ZM27 20H25V18H27V20ZM25 18H23V16H25V18ZM9 16H7V14H9V16ZM19 15H17V13H19V15ZM7 14H5V12H7V14ZM21.001 13H19.001V11H21.001V13ZM5 12H3V7H5V12ZM23.001 11H21.001V9H23.001V11ZM16 9H14V7H16V9ZM25.001 9H23.001V7H25.001V9ZM7 7H5V5H7V7ZM14 7H12V5H14V7ZM27.001 7H25.001V5H27.001V7ZM12 5H7V3H12V5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76733">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-display-adj-off":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="6" width="20" height="15" fill="#FEF991"/>
<rect x="3" y="6" width="20" height="2" fill="currentColor"/>
<rect x="3" y="20" width="20" height="2" fill="currentColor"/>
<rect x="6" y="24" width="2" height="4" fill="currentColor"/>
<rect x="27" y="16" width="4" height="2" fill="currentColor"/>
<rect x="2" y="25" width="22" height="2" fill="currentColor"/>
<rect x="28" y="7" width="2" height="14" fill="currentColor"/>
<rect x="1" y="8" width="2" height="12" fill="currentColor"/>
<rect x="23" y="8" width="2" height="12" fill="currentColor"/>
</svg>`,category:"Status"},"status-dot":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76809)">
<path d="M18 14H19V18H18V19H14V18H13V14H14V13H18V14Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76809">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-eye-closed":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 22H8V20H10V22ZM24 22H22V20H24V22ZM6 20H4V18H6V20ZM22 20H10V18H22V20ZM28 20H26V18H28V20ZM10 18H6V16H10V18ZM26 18H22V16H26V18ZM6 16H4V14H6V16ZM28 16H26V14H28V16ZM4 14H2V12H4V14ZM30 14H28V12H30V14ZM2 12H0V10H2V12ZM32 10V12H30V10H32Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-eye-open":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 25H10V23H22V25ZM10 23H6V21H10V23ZM26 23H22V21H26V23ZM6 21H4V19H6V21ZM19 21H13V19H19V21ZM28 21H26V19H28V21ZM4 19H2V17H4V19ZM13 19H11V13H13V19ZM21 19H19V13H21V19ZM30 19H28V17H30V19ZM2 17H0V15H2V17ZM32 15V17H30V15H32ZM4 15H2V13H4V15ZM30 15H28V13H30V15ZM6 13H4V11H6V13ZM19 13H13V11H19V13ZM28 13H26V11H28V13ZM10 11H6V9H10V11ZM26 11H22V9H26V11ZM22 9H10V7H22V9Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-faqs":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76781)">
<path d="M26 28H6V26H26V28ZM6 26H4V6H6V26ZM28 26H26V6H28V26ZM17 24H15V22H17V24ZM17 21H15V16H17V21ZM19 16H17V14H19V16ZM13 14H11V10H13V14ZM21 14H19V10H21V14ZM19 10H13V8H19V10ZM26 6H6V4H26V6Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76781">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-fast":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 20H17V22H18V24H21V23H23V25H21V26H9V24H16V22H15V21H13V19H15V20ZM9 24H7V22H6V20H4V18H7V16H9V18H8V22H9V24ZM27 23H23V21H27V23ZM30 19H29V21H27V19H28V15H30V19ZM4 18H2V14H4V18ZM20 12H21V14H20V16H18V15H11V16H9V15H7V14H4V12H7V13H9V14H11V13H18V14H19V12H18V10H20V12ZM28 15H26V13H28V15ZM26 13H24V11H26V13ZM24 11H22V9H24V11ZM18 10H16V7H18V10ZM22 9H20V7H22V9ZM20 7H18V5H20V7Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-fav":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="4" y="7" width="24" height="12" fill="#FEF991"/>
<rect width="16" height="4" transform="matrix(1 0 0 -1 8 23)" fill="#FEF991"/>
<rect x="12" y="23" width="8" height="4" fill="#FEF991"/>
<rect x="7" y="5" width="8" height="4" fill="#FEF991"/>
<rect x="18" y="5" width="8" height="4" fill="#FEF991"/>
<rect x="8" y="3" width="5" height="2" fill="currentColor"/>
<rect x="19" y="3" width="5" height="2" fill="currentColor"/>
<rect x="2" y="9" width="2" height="8" fill="currentColor"/>
<rect x="28" y="9" width="2" height="8" fill="currentColor"/>
<rect x="15" y="7" width="2" height="2" fill="currentColor"/>
<rect x="6" y="19" width="2" height="2" fill="currentColor"/>
<rect x="4" y="17" width="2" height="2" fill="currentColor"/>
<rect x="26" y="19" width="2" height="2" transform="rotate(90 26 19)" fill="currentColor"/>
<rect x="28" y="17" width="2" height="2" transform="rotate(90 28 17)" fill="currentColor"/>
<rect x="10" y="23" width="2" height="2" fill="currentColor"/>
<rect x="8" y="21" width="2" height="2" fill="currentColor"/>
<rect x="24" y="21" width="2" height="2" transform="rotate(90 24 21)" fill="currentColor"/>
<rect x="12" y="25" width="2" height="2" fill="currentColor"/>
<rect x="22" y="23" width="2" height="2" transform="rotate(90 22 23)" fill="currentColor"/>
<rect x="20" y="25" width="2" height="2" transform="rotate(90 20 25)" fill="currentColor"/>
<rect x="18" y="27" width="2" height="4" transform="rotate(90 18 27)" fill="currentColor"/>
<rect x="13" y="5" width="2" height="2" fill="currentColor"/>
<rect x="6" y="5" width="2" height="2" fill="currentColor"/>
<rect x="24" y="5" width="2" height="2" fill="currentColor"/>
<rect x="4" y="7" width="2" height="2" fill="currentColor"/>
<rect x="26" y="7" width="2" height="2" fill="currentColor"/>
<rect x="17" y="5" width="2" height="2" fill="currentColor"/>
</svg>`,category:"Status"},"status-file":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76901)">
<path d="M21 30H7V28H21V30ZM7 28H5V4H7V28ZM25 26H23V28H21V24H25V26ZM27 24H25V4H27V24ZM25 4H7V2H25V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76901">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-first-floor":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 29H6V27H8V29ZM12 29H10V27H12V29ZM16 29H14V27H16V29ZM20 29H18V27H20V29ZM24 29H22V27H24V29ZM28 29H26V27H28V29ZM6 27H4V25H6V27ZM10 27H8V25H10V27ZM14 27H12V25H14V27ZM18 27H16V25H18V27ZM22 27H20V25H22V27ZM26 27H24V25H26V27ZM8 25H6V23H8V25ZM12 25H10V23H12V25ZM16 25H14V23H16V25ZM20 25H18V23H20V25ZM24 25H22V23H24V25ZM28 25H26V23H28V25ZM6 23H4V21H6V23ZM10 23H8V21H10V23ZM14 23H12V21H14V23ZM18 23H16V21H18V23ZM22 23H20V21H22V23ZM26 23H24V21H26V23ZM8 21H6V19H8V21ZM12 21H10V19H12V21ZM16 21H14V19H16V21ZM20 21H18V19H20V21ZM24 21H22V19H24V21ZM28 21H26V19H28V21ZM30 17H2V15H30V17Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-glasses-battery":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 25H18V23H28V25ZM18 23H16V18H18V23ZM30 19H31V22H30V23H28V18H30V19ZM11.999 20.002H3.99902V18.002H11.999V20.002ZM17.999 12.002H18.001V14.002H14.001V18H12.001V14H14.001V9.99902H17.999V12.002ZM28 18H18V16H28V18ZM13.999 10H4V17.999H2V9.99902H3.99902V8H13.999V10ZM28.002 10H30V14H28V10H18.002V8H28.002V10Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-glasses-charging":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 18H28V23H18V18Z" fill="#FEF991"/>
<path d="M2 9.99854H4.00007V17.9988H2V9.99854Z" fill="currentColor"/>
<path d="M18 16H28V18H18V16Z" fill="currentColor"/>
<path d="M18 23H28V25H18V23Z" fill="currentColor"/>
<path d="M15.999 9.99854H17.9991V13.9987H15.999V9.99854Z" fill="currentColor"/>
<path d="M14.001 9.99854H16.001V13.9987H14.001V9.99854Z" fill="currentColor"/>
<path d="M14.001 12.0015H18.0011V14.0015H14.001V12.0015Z" fill="currentColor"/>
<path d="M12.001 14H14.001V18.0001H12.001V14Z" fill="currentColor"/>
<path d="M28 10H30V14H28V10Z" fill="currentColor"/>
<path d="M3.99902 8H13.9994V10.0001H3.99902V8Z" fill="currentColor"/>
<path d="M18.002 8H28.0023V10.0001H18.002V8Z" fill="currentColor"/>
<path d="M3.99902 18.0015H11.9993V20.0015H3.99902V18.0015Z" fill="currentColor"/>
<path d="M28 18H30V23H28V18Z" fill="currentColor"/>
<path d="M30 19H31V22H30V19Z" fill="currentColor"/>
<rect x="16" y="18" width="2" height="5" fill="currentColor"/>
</svg>`,category:"Status"},"status-glasses":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.999 22.002H3.99902V20.002H11.999V22.002ZM28.001 22.002H20.001V20.002H28.001V22.002ZM18 14.002H18.001V16.002H14.002V20H12.002V16H14.001V11.999H18V14.002ZM20.002 20H18.002V16H20.002V20ZM13.999 12H4V19.999H2V11.999H3.99902V10H13.999V12ZM28.002 11.999H30V19.999H28V12H18.002V10H28.002V11.999Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-good-pressed":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="5" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="17" y="14" width="5" height="12" fill="#7B7B7B"/>
<rect x="9" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="22" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="11" y="12" width="2" height="14" fill="#7B7B7B"/>
<rect x="13" y="10" width="2" height="16" fill="#7B7B7B"/>
<rect x="15" y="8" width="2" height="18" fill="#7B7B7B"/>
<rect x="5" y="12" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="12" width="2" height="2" fill="#7B7B7B"/>
<rect x="11" y="10" width="2" height="2" fill="#7B7B7B"/>
<rect x="13" y="8" width="2" height="2" fill="#7B7B7B"/>
<rect x="15" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="17" y="4" width="2" height="2" fill="#7B7B7B"/>
<rect x="19" y="2" width="2" height="2" fill="#7B7B7B"/>
<rect x="26" y="14" width="2" height="6" fill="#7B7B7B"/>
<rect x="24" y="14" width="2" height="6" fill="#7B7B7B"/>
<rect x="17" y="6" width="2" height="6" fill="#7B7B7B"/>
<rect x="24" y="20" width="2" height="4" fill="#7B7B7B"/>
<rect x="22" y="24" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="24" width="2" height="2" fill="#7B7B7B"/>
<rect x="11" y="26" width="11" height="2" fill="#7B7B7B"/>
<rect x="17" y="12" width="9" height="2" fill="#7B7B7B"/>
<rect x="21" y="4" width="2" height="4" fill="#7B7B7B"/>
<rect x="19" y="4" width="2" height="4" fill="#7B7B7B"/>
<rect x="19" y="8" width="2" height="2" fill="#7B7B7B"/>
<rect x="5" y="24" width="2" height="2" fill="#7B7B7B"/>
</svg>`,category:"Status"},"status-good":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="7" y="14" width="2" height="10" fill="#7B7B7B"/>
<rect x="5" y="12" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="12" width="2" height="2" fill="#7B7B7B"/>
<rect x="11" y="10" width="2" height="2" fill="#7B7B7B"/>
<rect x="13" y="8" width="2" height="2" fill="#7B7B7B"/>
<rect x="15" y="6" width="2" height="2" fill="#7B7B7B"/>
<rect x="17" y="4" width="2" height="2" fill="#7B7B7B"/>
<rect x="19" y="2" width="2" height="2" fill="#7B7B7B"/>
<rect x="26" y="14" width="2" height="6" fill="#7B7B7B"/>
<rect x="24" y="20" width="2" height="4" fill="#7B7B7B"/>
<rect x="22" y="24" width="2" height="2" fill="#7B7B7B"/>
<rect x="9" y="24" width="2" height="2" fill="#7B7B7B"/>
<rect x="11" y="26" width="11" height="2" fill="#7B7B7B"/>
<rect x="17" y="12" width="9" height="2" fill="#7B7B7B"/>
<rect x="21" y="4" width="2" height="4" fill="#7B7B7B"/>
<rect x="19" y="8" width="2" height="4" fill="#7B7B7B"/>
<rect x="5" y="24" width="2" height="2" fill="#7B7B7B"/>
</svg>`,category:"Status"},"status-grabber":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76793)">
<path d="M28 25H4V23H28V25ZM28 17H4V15H28V17ZM28 9H4V7H28V9Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76793">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-head-up":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.999 25.002H3.99902V23.002H11.999V25.002ZM28.001 25.002H20.001V23.002H28.001V25.002ZM18 17.002H18.001V19.002H14.002V23H12.002V19H14.001V14.999H18V17.002ZM20.002 23H18.002V19H20.002V23ZM13.999 15H4V22.999H2V14.999H3.99902V13H13.999V15ZM30 22.999H28V14.999H30V22.999ZM28 15H18V13H28V15ZM17 13H15V7H17V13ZM13 9H11V7H13V9ZM21 9H19V7H21V9ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM17 5H15V3H17V5Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-hint":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76920)">
<path d="M13 11H19V13.0001H13V11Z" fill="currentColor"/>
<path d="M13 19H19V21.0001H13V19Z" fill="currentColor"/>
<path d="M19 13H21V19H19V13Z" fill="currentColor"/>
<path d="M11 13H13V19H11V13Z" fill="currentColor"/>
<path d="M13 13H19V19H13V13Z" fill="#FEF991"/>
</g>
<defs>
<clipPath id="clip0_10001_76920">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-info":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76785)">
<path d="M26 28H6V26H26V28ZM6 26H4V6H6V26ZM28 26H26V6H28V26ZM17 21H18V23H14V21H15V15H14V13H17V21ZM17 11H15V9H17V11ZM26 6H6V4H26V6Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76785">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-login":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76909)">
<path d="M26 30H10V28H26V30ZM10 28H8V22H10V28ZM28 28H26V4H28V28ZM17 23H15V21H17V23ZM19 21H17V19H19V21ZM21 19H19V17H21V19ZM19 17H4V15H19V17ZM23 17H21V15H23V17ZM21 15H19V13H21V15ZM19 13H17V11H19V13ZM17 11H15V9H17V11ZM10 10H8V4H10V10ZM26 4H10V2H26V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76909">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-logout":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76913)">
<path d="M20 30H6V28H20V30ZM6 28H4V4H6V28ZM22 28H20V21H22V28ZM26 23H24V21H26V23ZM28 21H26V19H28V21ZM30 19H28V17H30V19ZM28 17H11V15H28V17ZM32 17H30V15H32V17ZM30 15H28V13H30V15ZM28 13H26V11H28V13ZM22 11H20V4H22V11ZM26 11H24V9H26V11ZM20 4H6V2H20V4Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76913">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-more":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 18H3V14H7V18ZM18 18H14V14H18V18ZM29 18H25V14H29V18Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-network-error":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29 29H27V27H29V29ZM27 27H25V25H27V27ZM19 24H17V26H15V24H13V22H19V24ZM25 25H23V23H25V25ZM23 23H21V21H23V23ZM21 21H19V19H21V21ZM9 20H7V18H9V20ZM25 20H23V18H25V20ZM23 18H19V19H17V17H19V16H23V18ZM13 18H9V16H13V18ZM15 14H19V16H17V17H15V16H13V13H15V14ZM4 15H2V13H4V15ZM30 15H28V13H30V15ZM7 13H4V11H7V13ZM13 13H11V11H13V13ZM28 13H25V11H28V13ZM9 9H11V11H7V7H9V9ZM25 11H21V9H25V11ZM21 9H11V7H21V9ZM7 7H5V5H7V7ZM5 5H3V3H5V5Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-reset":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 24H2V22H12V24ZM30 22V24H22V22H30ZM14 22H12V20H14V22ZM22 22H20V20H22V22ZM16 20H14V18H16V20ZM20 20H18V18H20V20ZM18 18H16V16H18V18ZM8 16H6V14H8V16ZM16 16H14V14H16V16ZM20 16H18V14H20V16ZM6 14H4V12H6V14ZM14 14H12V12H14V14ZM22 14H20V12H22V14ZM4 12H2V10H4V12ZM12 12H6V10H12V12ZM30 12H22V10H30V12ZM6 10H4V8H6V10ZM8 8H6V6H8V8Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-saved":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76885)">
<path d="M9 26H12V28H9V29H7V6H9V26ZM25 29H23V28H20V26H23V6H25V29ZM15 26H12V24H15V26ZM20 26H17V24H20V26ZM17 24H15V22H17V24ZM23 6H9V4H23V6Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76885">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-second-floor":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30 17H2V15H30V17ZM8 13H6V11H8V13ZM12 13H10V11H12V13ZM16 13H14V11H16V13ZM20 13H18V11H20V13ZM24 13H22V11H24V13ZM28 13H26V11H28V13ZM6 11H4V9H6V11ZM10 11H8V9H10V11ZM14 11H12V9H14V11ZM18 11H16V9H18V11ZM22 11H20V9H22V11ZM26 11H24V9H26V11ZM8 9H6V7H8V9ZM12 9H10V7H12V9ZM16 9H14V7H16V9ZM20 9H18V7H20V9ZM24 9H22V7H24V9ZM28 9H26V7H28V9ZM6 7H4V5H6V7ZM10 7H8V5H10V7ZM14 7H12V5H14V7ZM18 7H16V5H18V7ZM22 7H20V5H22V7ZM26 7H24V5H26V7ZM8 5H6V3H8V5ZM12 5H10V3H12V5ZM16 5H14V3H16V5ZM20 5H18V3H20V5ZM24 5H22V3H24V5ZM28 5H26V3H28V5Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-sele":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 27H7V25H25V27ZM7 25H5V7H7V25ZM27 25H25V7H27V25ZM25 7H7V5H25V7Z" fill="#232323"/>
</svg>`,category:"Status"},"status-selected-box":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 6H28V26H26V28H6V26H4V6H6V4H26V6ZM22 13H20V15H18V17H16V19H14V21H12V19H10V17H8V19H10V21H12V23H14V21H16V19H18V17H20V15H22V13H24V11H22V13Z" fill="#232323"/>
</svg>`,category:"Status"},"status-selected":{svg:`<svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.333 23H11.333V21H21.333V23ZM11.333 21H9.33301V11H11.333V21ZM23.333 21H21.333V11H23.333V21ZM18.333 18H14.333V14H18.333V18ZM21.333 11H11.333V9H21.333V11Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-slow":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 25H4V23H9V25ZM25 25H21V23H25V25ZM18 8H20V9H22V11H23V12H24V13H29V14H31V19H29V15H24V16H25V19H29V21H27V23H25V21H21V23H19V22H11V23H9V22H8V21H6V20H5V21H4V23H2V21H3V19H4V16H5V12H6V11H7V9H9V8H11V7H18V8ZM11 10H9V11H8V13H7V16H6V19H8V20H21V19H23V16H22V13H21V11H20V10H18V9H11V10Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-speaker-off":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 30H14V28H17V24H19V30ZM14 28H12V26H14V28ZM12 26H10V24H12V26ZM10 24H4V22H10V24ZM4 22H2V20H4V22ZM19 22H17V20H19V22ZM27 22H25V20H27V22ZM2 20H0V14H2V20ZM21 20H19V18H21V20ZM25 20H23V18H25V20ZM23 18H21V16H23V18ZM21 16H19V14H21V16ZM25 16H23V14H25V16ZM4 14H2V12H4V14ZM19 14H17V12H19V14ZM27 14H25V12H27V14ZM10 12H4V10H10V12ZM12 10H10V8H12V10ZM19 10H17V6H14V4H19V10ZM14 8H12V6H14V8Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-speaker-on":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 30H14V28H17V6H14V4H19V30ZM28 29H26V27H28V29ZM14 28H12V26H14V28ZM30 10H31V13H32V21H31V24H30V27H28V24H29V21H30V13H29V10H28V7H30V10ZM12 26H10V24H12V26ZM24 10H25V12H26V15H27V19H26V22H25V24H24V26H22V24H23V22H24V19H25V15H24V12H23V10H22V8H24V10ZM10 24H4V22H10V24ZM4 22H2V20H4V22ZM2 20H0V14H2V20ZM4 14H2V12H4V14ZM10 12H4V10H10V12ZM12 10H10V8H12V10ZM14 8H12V6H14V8ZM28 7H26V5H28V7Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-text-sizing":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 6H13V26H16V28H8V26H11V6H4V4H20V6ZM26 28H20V26H22V14H18V12H28V14H24V26H26V28ZM18 16H16V14H18V16ZM30 16H28V14H30V16ZM4 8H2V6H4V8ZM22 8H20V6H22V8Z" fill="currentColor"/>
</svg>`,category:"Status"},"status-unbind":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76737)">
<path d="M18 27H16V23H5V21H16V17H5V15H16V11H5V9H16V5H18V27ZM27 23H20V21H27V23ZM5 21H3V19H5V21ZM29 21H27V19H29V21ZM3 19H1V13H3V19ZM31 19H29V13H31V19ZM27 17H21V15H27V17ZM5 13H3V11H5V13ZM29 13H27V11H29V13ZM27 11H20V9H27V11Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76737">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-undisturb":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_10001_76749)">
<path d="M14.001 25.5H22V27.5H14V25.5H10.001V23.5H14.001V25.5ZM24 25.5H22V23.5H24V25.5ZM10 23.5H8V19.5H10V23.5ZM22 23.5H18V21.5H22V23.5ZM18 21.5H16V19.5H18V21.5ZM8 12.5V19.5H6V12.5H8ZM16 19.5H14V12.5H16V19.5ZM18 12.5H16V10.5H18V12.5ZM10 12.499H8V8.49902H10V12.499ZM22 10.499H18V8.49902H22V10.499ZM14 8.5H10V6.5H14V8.5ZM24 8.5H22V6.5H24V8.5ZM22 6.5H14V4.5H22V6.5Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_10001_76749">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>`,category:"Status"},"status-unfav":{svg:`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 29H14V27H18V29ZM14 27H12V25H14V27ZM20 27H18V25H20V27ZM12 25H10V23H12V25ZM22 25H20V23H22V25ZM10 23H8V21H10V23ZM24 23H22V21H24V23ZM8 21H6V19H8V21ZM26 21H24V19H26V21ZM6 19H4V17H6V19ZM28 19H26V17H28V19ZM4 17H2V9H4V17ZM30 17H28V9H30V17ZM6 9H4V7H6V9ZM17 9H15V7H17V9ZM28 9H26V7H28V9ZM8 7H6V5H8V7ZM15 7H13V5H15V7ZM19 7H17V5H19V7ZM26 7H24V5H26V7ZM13 5H8V3H13V5ZM24 5H19V3H24V5Z" fill="currentColor"/>
</svg>`,category:"Status"}},C7=Object.keys(x7);C7.length;const L0=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,k0=Gg,N1=(e,t)=>i=>{var n;if((t==null?void 0:t.variants)==null)return k0(e,i==null?void 0:i.class,i==null?void 0:i.className);const{variants:l,defaultVariants:s}=t,a=Object.keys(l).map(d=>{const v=i==null?void 0:i[d],w=s==null?void 0:s[d];if(v===null)return null;const V=L0(v)||L0(w);return l[d][V]}),o=i&&Object.entries(i).reduce((d,v)=>{let[w,V]=v;return V===void 0||(d[w]=V),d},{}),c=t==null||(n=t.compoundVariants)===null||n===void 0?void 0:n.reduce((d,v)=>{let{class:w,className:V,...b}=v;return Object.entries(b).every(C=>{let[N,D]=C;return Array.isArray(D)?D.includes({...s,...o}[N]):{...s,...o}[N]===D})?[...d,w,V]:d},[]);return k0(e,a,c,i==null?void 0:i.class,i==null?void 0:i.className)},O7=N1("inline-flex items-center justify-center gap-4 rounded-[6px] font-normal transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-[17px] tracking-[-0.17px]",{variants:{variant:{highlight:"bg-accent text-text-highlight hover:opacity-90",default:"bg-surface text-text hover:bg-surface-light",ghost:"text-text-dim hover:text-text hover:bg-surface-light",danger:"bg-surface text-negative hover:bg-surface-light",secondary:"bg-surface-light text-text-dim hover:text-text hover:bg-surface-lighter"},size:{sm:"h-9 px-4 text-[15px] tracking-[-0.15px]",default:"h-12 px-4",lg:"h-12 px-6",icon:"h-9 w-9 text-[15px]"}},defaultVariants:{variant:"highlight",size:"default"}}),mc=Vt.forwardRef(({className:e,variant:t,size:i,type:n="button",...l},s)=>Y.jsx("button",{ref:s,type:n,className:Ee(O7({variant:t,size:i,className:e})),...l}));mc.displayName="Button";const N7=N1("rounded-[6px] bg-surface",{variants:{variant:{default:"",elevated:"shadow-lg shadow-black/12",interactive:"transition-colors hover:bg-surface-light cursor-pointer"},padding:{none:"p-0",sm:"p-3",default:"p-4",lg:"p-6"}},defaultVariants:{variant:"default",padding:"default"}}),s3=Vt.forwardRef(({className:e,variant:t,padding:i,...n},l)=>Y.jsx("div",{ref:l,className:Ee(N7({variant:t,padding:i,className:e})),...n}));s3.displayName="Card";const R7=N1("inline-flex items-center rounded-[6px] px-2 py-0.5 text-[11px] tracking-[-0.11px] font-normal",{variants:{variant:{positive:"bg-positive-alpha text-positive",negative:"bg-negative-alpha text-negative",accent:"bg-accent-alpha text-accent",neutral:"bg-surface-light text-text-dim"}},defaultVariants:{variant:"neutral"}}),B7=Vt.forwardRef(({className:e,variant:t,...i},n)=>Y.jsx("span",{ref:n,className:Ee(R7({variant:t,className:e})),...i}));B7.displayName="Badge";const D7=Vt.forwardRef(({className:e,type:t="text",...i},n)=>Y.jsx("input",{ref:n,type:t,className:Ee("h-9 w-full bg-input-bg text-text rounded-[6px] px-4 text-[17px] tracking-[-0.17px] outline-none placeholder:text-text-dim transition-colors",e),...i}));D7.displayName="Input";const L7=Vt.forwardRef(({className:e,rows:t=3,...i},n)=>Y.jsx("textarea",{ref:n,rows:t,className:Ee("w-full bg-input-bg text-text rounded-[6px] px-4 py-3 text-[17px] tracking-[-0.17px] outline-none placeholder:text-text-dim transition-colors resize-none",e),...i}));L7.displayName="Textarea";const k7=Vt.forwardRef(({value:e,className:t,...i},n)=>Y.jsx("div",{ref:n,className:Ee("h-1 w-full rounded-full bg-surface-lighter overflow-hidden",t),...i,children:Y.jsx("div",{className:"h-full rounded-full bg-accent transition-all duration-500 ease-out",style:{width:`${Math.min(100,Math.max(0,e))}%`}})}));k7.displayName="Progress";const I7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("div",{ref:i,className:"w-full overflow-x-auto rounded-[6px] bg-surface",children:Y.jsx("table",{className:Ee("w-full border-collapse text-[15px] tracking-[-0.15px]",e),...t})}));I7.displayName="Table";const z7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("thead",{ref:i,className:Ee("bg-surface-light/50",e),...t}));z7.displayName="TableHeader";const U7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("tbody",{ref:i,className:Ee("",e),...t}));U7.displayName="TableBody";const j7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("tr",{ref:i,className:Ee("transition-colors hover:bg-surface-light border-b border-border/50 last:border-0",e),...t}));j7.displayName="TableRow";const P7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("th",{ref:i,className:Ee("text-left text-text-dim font-normal px-4 py-3 text-[13px] tracking-[-0.13px] whitespace-nowrap",e),...t}));P7.displayName="TableHead";const G7=Vt.forwardRef(({className:e,...t},i)=>Y.jsx("td",{ref:i,className:Ee("px-4 py-3 tabular-nums whitespace-nowrap",e),...t}));G7.displayName="TableCell";const q7=Vt.forwardRef(({className:e,placeholder:t="Search...",...i},n)=>Y.jsxs("div",{className:Ee("relative",e),children:[Y.jsx(A7,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim pointer-events-none"}),Y.jsx("input",{ref:n,type:"search",placeholder:t,className:"h-9 w-full bg-input-bg text-text rounded-[6px] pl-11 pr-4 text-[17px] tracking-[-0.17px] outline-none placeholder:text-text-dim transition-colors",...i})]}));q7.displayName="SearchBar";Array.from({length:24},(e,t)=>t);Vt.createContext(null);Y.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:Y.jsx("path",{d:"M12.5 15L7.5 10L12.5 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})});const Y7=()=>{};var I0={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r3=function(e){const t=[];let i=0;for(let n=0;n<e.length;n++){let l=e.charCodeAt(n);l<128?t[i++]=l:l<2048?(t[i++]=l>>6|192,t[i++]=l&63|128):(l&64512)===55296&&n+1<e.length&&(e.charCodeAt(n+1)&64512)===56320?(l=65536+((l&1023)<<10)+(e.charCodeAt(++n)&1023),t[i++]=l>>18|240,t[i++]=l>>12&63|128,t[i++]=l>>6&63|128,t[i++]=l&63|128):(t[i++]=l>>12|224,t[i++]=l>>6&63|128,t[i++]=l&63|128)}return t},X7=function(e){const t=[];let i=0,n=0;for(;i<e.length;){const l=e[i++];if(l<128)t[n++]=String.fromCharCode(l);else if(l>191&&l<224){const s=e[i++];t[n++]=String.fromCharCode((l&31)<<6|s&63)}else if(l>239&&l<365){const s=e[i++],a=e[i++],o=e[i++],c=((l&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;t[n++]=String.fromCharCode(55296+(c>>10)),t[n++]=String.fromCharCode(56320+(c&1023))}else{const s=e[i++],a=e[i++];t[n++]=String.fromCharCode((l&15)<<12|(s&63)<<6|a&63)}}return t.join("")},a3={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const i=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let l=0;l<e.length;l+=3){const s=e[l],a=l+1<e.length,o=a?e[l+1]:0,c=l+2<e.length,d=c?e[l+2]:0,v=s>>2,w=(s&3)<<4|o>>4;let V=(o&15)<<2|d>>6,b=d&63;c||(b=64,a||(V=64)),n.push(i[v],i[w],i[V],i[b])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(r3(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):X7(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const i=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let l=0;l<e.length;){const s=i[e.charAt(l++)],o=l<e.length?i[e.charAt(l)]:0;++l;const d=l<e.length?i[e.charAt(l)]:64;++l;const w=l<e.length?i[e.charAt(l)]:64;if(++l,s==null||o==null||d==null||w==null)throw new F7;const V=s<<2|o>>4;if(n.push(V),d!==64){const b=o<<4&240|d>>2;if(n.push(b),w!==64){const C=d<<6&192|w;n.push(C)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class F7 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const K7=function(e){const t=r3(e);return a3.encodeByteArray(t,!0)},Eo=function(e){return K7(e).replace(/\./g,"")},o3=function(e){try{return a3.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q7(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J7=()=>Q7().__FIREBASE_DEFAULTS__,$7=()=>{if(typeof process>"u"||typeof I0>"u")return;const e=I0.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},W7=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&o3(e[1]);return t&&JSON.parse(t)},R1=()=>{try{return Y7()||J7()||$7()||W7()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},u3=e=>{var t,i;return(i=(t=R1())===null||t===void 0?void 0:t.emulatorHosts)===null||i===void 0?void 0:i[e]},c3=e=>{const t=u3(e);if(!t)return;const i=t.lastIndexOf(":");if(i<=0||i+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const n=parseInt(t.substring(i+1),10);return t[0]==="["?[t.substring(1,i-1),n]:[t.substring(0,i),n]},h3=()=>{var e;return(e=R1())===null||e===void 0?void 0:e.config},f3=e=>{var t;return(t=R1())===null||t===void 0?void 0:t[`_${e}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tM{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,i)=>{this.resolve=t,this.reject=i})}wrapCallback(t){return(i,n)=>{i?this.reject(i):this.resolve(n),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(i):t(i,n))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function nu(e){return(await fetch(e,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eM(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const i={alg:"none",type:"JWT"},n=t||"demo-project",l=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:l,exp:l+3600,auth_time:l,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);return[Eo(JSON.stringify(i)),Eo(JSON.stringify(a)),""].join(".")}const lr={};function iM(){const e={prod:[],emulator:[]};for(const t of Object.keys(lr))lr[t]?e.emulator.push(t):e.prod.push(t);return e}function nM(e){let t=document.getElementById(e),i=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),i=!0),{created:i,element:t}}let z0=!1;function B1(e,t){if(typeof window>"u"||typeof document>"u"||!dl(window.location.host)||lr[e]===t||lr[e]||z0)return;lr[e]=t;function i(V){return`__firebase__banner__${V}`}const n="__firebase__banner",s=iM().prod.length>0;function a(){const V=document.getElementById(n);V&&V.remove()}function o(V){V.style.display="flex",V.style.background="#7faaf0",V.style.position="fixed",V.style.bottom="5px",V.style.left="5px",V.style.padding=".5em",V.style.borderRadius="5px",V.style.alignItems="center"}function c(V,b){V.setAttribute("width","24"),V.setAttribute("id",b),V.setAttribute("height","24"),V.setAttribute("viewBox","0 0 24 24"),V.setAttribute("fill","none"),V.style.marginLeft="-6px"}function d(){const V=document.createElement("span");return V.style.cursor="pointer",V.style.marginLeft="16px",V.style.fontSize="24px",V.innerHTML=" &times;",V.onclick=()=>{z0=!0,a()},V}function v(V,b){V.setAttribute("id",b),V.innerText="Learn more",V.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",V.setAttribute("target","__blank"),V.style.paddingLeft="5px",V.style.textDecoration="underline"}function w(){const V=nM(n),b=i("text"),C=document.getElementById(b)||document.createElement("span"),N=i("learnmore"),D=document.getElementById(N)||document.createElement("a"),Z=i("preprendIcon"),p=document.getElementById(Z)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(V.created){const _=V.element;o(_),v(D,N);const A=d();c(p,Z),_.append(p,C,D,A),document.body.appendChild(_)}s?(C.innerText="Preview backend disconnected.",p.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(p.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",b)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",w):w()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lM(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(se())}function sM(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function rM(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function aM(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function oM(){const e=se();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function uM(){try{return typeof indexedDB=="object"}catch{return!1}}function cM(){return new Promise((e,t)=>{try{let i=!0;const n="validate-browser-context-for-indexeddb-analytics-module",l=self.indexedDB.open(n);l.onsuccess=()=>{l.result.close(),i||self.indexedDB.deleteDatabase(n),e(!0)},l.onupgradeneeded=()=>{i=!1},l.onerror=()=>{var s;t(((s=l.error)===null||s===void 0?void 0:s.message)||"")}}catch(i){t(i)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hM="FirebaseError";class oi extends Error{constructor(t,i,n){super(i),this.code=t,this.customData=n,this.name=hM,Object.setPrototypeOf(this,oi.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zr.prototype.create)}}class zr{constructor(t,i,n){this.service=t,this.serviceName=i,this.errors=n}create(t,...i){const n=i[0]||{},l=`${this.service}/${t}`,s=this.errors[t],a=s?fM(s,n):"Error",o=`${this.serviceName}: ${a} (${l}).`;return new oi(l,o,n)}}function fM(e,t){return e.replace(dM,(i,n)=>{const l=t[n];return l!=null?String(l):`<${n}?>`})}const dM=/\{\$([^}]+)}/g;function HM(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function Sn(e,t){if(e===t)return!0;const i=Object.keys(e),n=Object.keys(t);for(const l of i){if(!n.includes(l))return!1;const s=e[l],a=t[l];if(U0(s)&&U0(a)){if(!Sn(s,a))return!1}else if(s!==a)return!1}for(const l of n)if(!i.includes(l))return!1;return!0}function U0(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(e){const t=[];for(const[i,n]of Object.entries(e))Array.isArray(n)?n.forEach(l=>{t.push(encodeURIComponent(i)+"="+encodeURIComponent(l))}):t.push(encodeURIComponent(i)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function VM(e,t){const i=new gM(e,t);return i.subscribe.bind(i)}class gM{constructor(t,i){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=i,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(i=>{i.next(t)})}error(t){this.forEachObserver(i=>{i.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,i,n){let l;if(t===void 0&&i===void 0&&n===void 0)throw new Error("Missing Observer.");pM(t,["next","error","complete"])?l=t:l={next:t,error:i,complete:n},l.next===void 0&&(l.next=d2),l.error===void 0&&(l.error=d2),l.complete===void 0&&(l.complete=d2);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?l.error(this.finalError):l.complete()}catch{}}),this.observers.push(l),s}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let i=0;i<this.observers.length;i++)this.sendOne(i,t)}sendOne(t,i){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{i(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function pM(e,t){if(typeof e!="object"||e===null)return!1;for(const i of t)if(i in e&&typeof e[i]=="function")return!0;return!1}function d2(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(e){return e&&e._delegate?e._delegate:e}class En{constructor(t,i,n){this.name=t,this.instanceFactory=i,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mM{constructor(t,i){this.name=t,this.container=i,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const i=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(i)){const n=new tM;if(this.instancesDeferred.set(i,n),this.isInitialized(i)||this.shouldAutoInitialize())try{const l=this.getOrInitializeService({instanceIdentifier:i});l&&n.resolve(l)}catch{}}return this.instancesDeferred.get(i).promise}getImmediate(t){var i;const n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),l=(i=t==null?void 0:t.optional)!==null&&i!==void 0?i:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(l)return null;throw s}else{if(l)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(MM(t))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[i,n]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);try{const s=this.getOrInitializeService({instanceIdentifier:l});n.resolve(s)}catch{}}}}clearInstance(t=jn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(i=>"INTERNAL"in i).map(i=>i.INTERNAL.delete()),...t.filter(i=>"_delete"in i).map(i=>i._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=jn){return this.instances.has(t)}getOptions(t=jn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:i={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const l=this.getOrInitializeService({instanceIdentifier:n,options:i});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);n===o&&a.resolve(l)}return l}onInit(t,i){var n;const l=this.normalizeInstanceIdentifier(i),s=(n=this.onInitCallbacks.get(l))!==null&&n!==void 0?n:new Set;s.add(t),this.onInitCallbacks.set(l,s);const a=this.instances.get(l);return a&&t(a,l),()=>{s.delete(t)}}invokeOnInitCallbacks(t,i){const n=this.onInitCallbacks.get(i);if(n)for(const l of n)try{l(t,i)}catch{}}getOrInitializeService({instanceIdentifier:t,options:i={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:vM(t),options:i}),this.instances.set(t,n),this.instancesOptions.set(t,i),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch{}return n||null}normalizeInstanceIdentifier(t=jn){return this.component?this.component.multipleInstances?t:jn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function vM(e){return e===jn?void 0:e}function MM(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yM{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const i=this.getProvider(t.name);if(i.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);i.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const i=new mM(t,this);return this.providers.set(t,i),i}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rt;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(rt||(rt={}));const wM={debug:rt.DEBUG,verbose:rt.VERBOSE,info:rt.INFO,warn:rt.WARN,error:rt.ERROR,silent:rt.SILENT},ZM=rt.INFO,_M={[rt.DEBUG]:"log",[rt.VERBOSE]:"log",[rt.INFO]:"info",[rt.WARN]:"warn",[rt.ERROR]:"error"},bM=(e,t,...i)=>{if(t<e.logLevel)return;const n=new Date().toISOString(),l=_M[t];if(l)console[l](`[${n}]  ${e.name}:`,...i);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class D1{constructor(t){this.name=t,this._logLevel=ZM,this._logHandler=bM,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in rt))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?wM[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,rt.DEBUG,...t),this._logHandler(this,rt.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,rt.VERBOSE,...t),this._logHandler(this,rt.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,rt.INFO,...t),this._logHandler(this,rt.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,rt.WARN,...t),this._logHandler(this,rt.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,rt.ERROR,...t),this._logHandler(this,rt.ERROR,...t)}}const SM=(e,t)=>t.some(i=>e instanceof i);let j0,P0;function EM(){return j0||(j0=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function TM(){return P0||(P0=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const d3=new WeakMap,vc=new WeakMap,H3=new WeakMap,H2=new WeakMap,L1=new WeakMap;function AM(e){const t=new Promise((i,n)=>{const l=()=>{e.removeEventListener("success",s),e.removeEventListener("error",a)},s=()=>{i(vn(e.result)),l()},a=()=>{n(e.error),l()};e.addEventListener("success",s),e.addEventListener("error",a)});return t.then(i=>{i instanceof IDBCursor&&d3.set(i,e)}).catch(()=>{}),L1.set(t,e),t}function xM(e){if(vc.has(e))return;const t=new Promise((i,n)=>{const l=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",a),e.removeEventListener("abort",a)},s=()=>{i(),l()},a=()=>{n(e.error||new DOMException("AbortError","AbortError")),l()};e.addEventListener("complete",s),e.addEventListener("error",a),e.addEventListener("abort",a)});vc.set(e,t)}let Mc={get(e,t,i){if(e instanceof IDBTransaction){if(t==="done")return vc.get(e);if(t==="objectStoreNames")return e.objectStoreNames||H3.get(e);if(t==="store")return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return vn(e[t])},set(e,t,i){return e[t]=i,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function CM(e){Mc=e(Mc)}function OM(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...i){const n=e.call(V2(this),t,...i);return H3.set(n,t.sort?t.sort():[t]),vn(n)}:TM().includes(e)?function(...t){return e.apply(V2(this),t),vn(d3.get(this))}:function(...t){return vn(e.apply(V2(this),t))}}function NM(e){return typeof e=="function"?OM(e):(e instanceof IDBTransaction&&xM(e),SM(e,EM())?new Proxy(e,Mc):e)}function vn(e){if(e instanceof IDBRequest)return AM(e);if(H2.has(e))return H2.get(e);const t=NM(e);return t!==e&&(H2.set(e,t),L1.set(t,e)),t}const V2=e=>L1.get(e);function RM(e,t,{blocked:i,upgrade:n,blocking:l,terminated:s}={}){const a=indexedDB.open(e,t),o=vn(a);return n&&a.addEventListener("upgradeneeded",c=>{n(vn(a.result),c.oldVersion,c.newVersion,vn(a.transaction),c)}),i&&a.addEventListener("blocked",c=>i(c.oldVersion,c.newVersion,c)),o.then(c=>{s&&c.addEventListener("close",()=>s()),l&&c.addEventListener("versionchange",d=>l(d.oldVersion,d.newVersion,d))}).catch(()=>{}),o}const BM=["get","getKey","getAll","getAllKeys","count"],DM=["put","add","delete","clear"],g2=new Map;function G0(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(g2.get(t))return g2.get(t);const i=t.replace(/FromIndex$/,""),n=t!==i,l=DM.includes(i);if(!(i in(n?IDBIndex:IDBObjectStore).prototype)||!(l||BM.includes(i)))return;const s=async function(a,...o){const c=this.transaction(a,l?"readwrite":"readonly");let d=c.store;return n&&(d=d.index(o.shift())),(await Promise.all([d[i](...o),l&&c.done]))[0]};return g2.set(t,s),s}CM(e=>({...e,get:(t,i,n)=>G0(t,i)||e.get(t,i,n),has:(t,i)=>!!G0(t,i)||e.has(t,i)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LM{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(i=>{if(kM(i)){const n=i.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(i=>i).join(" ")}}function kM(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const yc="@firebase/app",q0="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li=new D1("@firebase/app"),IM="@firebase/app-compat",zM="@firebase/analytics-compat",UM="@firebase/analytics",jM="@firebase/app-check-compat",PM="@firebase/app-check",GM="@firebase/auth",qM="@firebase/auth-compat",YM="@firebase/database",XM="@firebase/data-connect",FM="@firebase/database-compat",KM="@firebase/functions",QM="@firebase/functions-compat",JM="@firebase/installations",$M="@firebase/installations-compat",WM="@firebase/messaging",ty="@firebase/messaging-compat",ey="@firebase/performance",iy="@firebase/performance-compat",ny="@firebase/remote-config",ly="@firebase/remote-config-compat",sy="@firebase/storage",ry="@firebase/storage-compat",ay="@firebase/firestore",oy="@firebase/ai",uy="@firebase/firestore-compat",cy="firebase",hy="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wc="[DEFAULT]",fy={[yc]:"fire-core",[IM]:"fire-core-compat",[UM]:"fire-analytics",[zM]:"fire-analytics-compat",[PM]:"fire-app-check",[jM]:"fire-app-check-compat",[GM]:"fire-auth",[qM]:"fire-auth-compat",[YM]:"fire-rtdb",[XM]:"fire-data-connect",[FM]:"fire-rtdb-compat",[KM]:"fire-fn",[QM]:"fire-fn-compat",[JM]:"fire-iid",[$M]:"fire-iid-compat",[WM]:"fire-fcm",[ty]:"fire-fcm-compat",[ey]:"fire-perf",[iy]:"fire-perf-compat",[ny]:"fire-rc",[ly]:"fire-rc-compat",[sy]:"fire-gcs",[ry]:"fire-gcs-compat",[ay]:"fire-fst",[uy]:"fire-fst-compat",[oy]:"fire-vertex","fire-js":"fire-js",[cy]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zr=new Map,dy=new Map,Zc=new Map;function Y0(e,t){try{e.container.addComponent(t)}catch(i){Li.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,i)}}function ll(e){const t=e.name;if(Zc.has(t))return Li.debug(`There were multiple attempts to register component ${t}.`),!1;Zc.set(t,e);for(const i of Zr.values())Y0(i,e);for(const i of dy.values())Y0(i,e);return!0}function jr(e,t){const i=e.container.getProvider("heartbeat").getImmediate({optional:!0});return i&&i.triggerHeartbeat(),e.container.getProvider(t)}function ve(e){return e==null?!1:e.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Mn=new zr("app","Firebase",Hy);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(t,i,n){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},i),this._name=i.name,this._automaticDataCollectionEnabled=i.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new En("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Mn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vs=hy;function V3(e,t={}){let i=e;typeof t!="object"&&(t={name:t});const n=Object.assign({name:wc,automaticDataCollectionEnabled:!0},t),l=n.name;if(typeof l!="string"||!l)throw Mn.create("bad-app-name",{appName:String(l)});if(i||(i=h3()),!i)throw Mn.create("no-options");const s=Zr.get(l);if(s){if(Sn(i,s.options)&&Sn(n,s.config))return s;throw Mn.create("duplicate-app",{appName:l})}const a=new yM(l);for(const c of Zc.values())a.addComponent(c);const o=new Vy(i,n,a);return Zr.set(l,o),o}function k1(e=wc){const t=Zr.get(e);if(!t&&e===wc&&h3())return V3();if(!t)throw Mn.create("no-app",{appName:e});return t}function X0(){return Array.from(Zr.values())}function ni(e,t,i){var n;let l=(n=fy[e])!==null&&n!==void 0?n:e;i&&(l+=`-${i}`);const s=l.match(/\s|\//),a=t.match(/\s|\//);if(s||a){const o=[`Unable to register library "${l}" with version "${t}":`];s&&o.push(`library name "${l}" contains illegal characters (whitespace or "/")`),s&&a&&o.push("and"),a&&o.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Li.warn(o.join(" "));return}ll(new En(`${l}-version`,()=>({library:l,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gy="firebase-heartbeat-database",py=1,_r="firebase-heartbeat-store";let p2=null;function g3(){return p2||(p2=RM(gy,py,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(_r)}catch(i){console.warn(i)}}}}).catch(e=>{throw Mn.create("idb-open",{originalErrorMessage:e.message})})),p2}async function my(e){try{const i=(await g3()).transaction(_r),n=await i.objectStore(_r).get(p3(e));return await i.done,n}catch(t){if(t instanceof oi)Li.warn(t.message);else{const i=Mn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Li.warn(i.message)}}}async function F0(e,t){try{const n=(await g3()).transaction(_r,"readwrite");await n.objectStore(_r).put(t,p3(e)),await n.done}catch(i){if(i instanceof oi)Li.warn(i.message);else{const n=Mn.create("idb-set",{originalErrorMessage:i==null?void 0:i.message});Li.warn(n.message)}}}function p3(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vy=1024,My=30;class yy{constructor(t){this.container=t,this._heartbeatsCache=null;const i=this.container.getProvider("app").getImmediate();this._storage=new Zy(i),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var t,i;try{const l=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=K0();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((i=this._heartbeatsCache)===null||i===void 0?void 0:i.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:l}),this._heartbeatsCache.heartbeats.length>My){const a=_y(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Li.warn(n)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const i=K0(),{heartbeatsToSend:n,unsentEntries:l}=wy(this._heartbeatsCache.heartbeats),s=Eo(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=i,l.length>0?(this._heartbeatsCache.heartbeats=l,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(i){return Li.warn(i),""}}}function K0(){return new Date().toISOString().substring(0,10)}function wy(e,t=vy){const i=[];let n=e.slice();for(const l of e){const s=i.find(a=>a.agent===l.agent);if(s){if(s.dates.push(l.date),Q0(i)>t){s.dates.pop();break}}else if(i.push({agent:l.agent,dates:[l.date]}),Q0(i)>t){i.pop();break}n=n.slice(1)}return{heartbeatsToSend:i,unsentEntries:n}}class Zy{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return uM()?cM().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const i=await my(this.app);return i!=null&&i.heartbeats?i:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var i;if(await this._canUseIndexedDBPromise){const l=await this.read();return F0(this.app,{lastSentHeartbeatDate:(i=t.lastSentHeartbeatDate)!==null&&i!==void 0?i:l.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var i;if(await this._canUseIndexedDBPromise){const l=await this.read();return F0(this.app,{lastSentHeartbeatDate:(i=t.lastSentHeartbeatDate)!==null&&i!==void 0?i:l.lastSentHeartbeatDate,heartbeats:[...l.heartbeats,...t.heartbeats]})}else return}}function Q0(e){return Eo(JSON.stringify({version:2,heartbeats:e})).length}function _y(e){if(e.length===0)return-1;let t=0,i=e[0].date;for(let n=1;n<e.length;n++)e[n].date<i&&(i=e[n].date,t=n);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function by(e){ll(new En("platform-logger",t=>new LM(t),"PRIVATE")),ll(new En("heartbeat",t=>new yy(t),"PRIVATE")),ni(yc,q0,e),ni(yc,q0,"esm2017"),ni("fire-js","")}by("");function I1(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(i[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(e);l<n.length;l++)t.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(e,n[l])&&(i[n[l]]=e[n[l]]);return i}function m3(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Sy=m3,v3=new zr("auth","Firebase",m3());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=new D1("@firebase/auth");function Ey(e,...t){To.logLevel<=rt.WARN&&To.warn(`Auth (${Vs}): ${e}`,...t)}function qa(e,...t){To.logLevel<=rt.ERROR&&To.error(`Auth (${Vs}): ${e}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function si(e,...t){throw U1(e,...t)}function Ye(e,...t){return U1(e,...t)}function z1(e,t,i){const n=Object.assign(Object.assign({},Sy()),{[t]:i});return new zr("auth","Firebase",n).create(t,{appName:e.name})}function yn(e){return z1(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function M3(e,t,i){const n=i;if(!(t instanceof n))throw n.name!==t.constructor.name&&si(e,"argument-error"),z1(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function U1(e,...t){if(typeof e!="string"){const i=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=e.name),e._errorFactory.create(i,...n)}return v3.create(e,...t)}function q(e,t,...i){if(!e)throw U1(t,...i)}function Ei(e){const t="INTERNAL ASSERTION FAILED: "+e;throw qa(t),new Error(t)}function ki(e,t){e||Ei(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _c(){var e;return typeof self<"u"&&((e=self.location)===null||e===void 0?void 0:e.href)||""}function Ty(){return J0()==="http:"||J0()==="https:"}function J0(){var e;return typeof self<"u"&&((e=self.location)===null||e===void 0?void 0:e.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ay(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ty()||rM()||"connection"in navigator)?navigator.onLine:!0}function xy(){if(typeof navigator>"u")return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(t,i){this.shortDelay=t,this.longDelay=i,ki(i>t,"Short delay should be less than long delay!"),this.isMobile=lM()||aM()}get(){return Ay()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j1(e,t){ki(e.emulator,"Emulator should always be set here");const{url:i}=e.emulator;return t?`${i}${t.startsWith("/")?t.slice(1):t}`:i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y3{static initialize(t,i,n){this.fetchImpl=t,i&&(this.headersImpl=i),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ei("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ei("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ei("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ny=new Pr(3e4,6e4);function P1(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function gs(e,t,i,n,l={}){return w3(e,l,async()=>{let s={},a={};n&&(t==="GET"?a=n:s={body:JSON.stringify(n)});const o=Ur(Object.assign({key:e.config.apiKey},a)).slice(1),c=await e._getAdditionalHeaders();c["Content-Type"]="application/json",e.languageCode&&(c["X-Firebase-Locale"]=e.languageCode);const d=Object.assign({method:t,headers:c},s);return sM()||(d.referrerPolicy="no-referrer"),e.emulatorConfig&&dl(e.emulatorConfig.host)&&(d.credentials="include"),y3.fetch()(await Z3(e,e.config.apiHost,i,o),d)})}async function w3(e,t,i){e._canInitEmulator=!1;const n=Object.assign(Object.assign({},Cy),t);try{const l=new By(e),s=await Promise.race([i(),l.promise]);l.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Sa(e,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[c,d]=o.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Sa(e,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Sa(e,"email-already-in-use",a);if(c==="USER_DISABLED")throw Sa(e,"user-disabled",a);const v=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw z1(e,v,d);si(e,v)}}catch(l){if(l instanceof oi)throw l;si(e,"network-request-failed",{message:String(l)})}}async function Ry(e,t,i,n,l={}){const s=await gs(e,t,i,n,l);return"mfaPendingCredential"in s&&si(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function Z3(e,t,i,n){const l=`${t}${i}?${n}`,s=e,a=s.config.emulator?j1(e.config,l):`${e.config.apiScheme}://${l}`;return Oy.includes(i)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}class By{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((i,n)=>{this.timer=setTimeout(()=>n(Ye(this.auth,"network-request-failed")),Ny.get())})}}function Sa(e,t,i){const n={appName:e.name};i.email&&(n.email=i.email),i.phoneNumber&&(n.phoneNumber=i.phoneNumber);const l=Ye(e,t,n);return l.customData._tokenResponse=i,l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dy(e,t){return gs(e,"POST","/v1/accounts:delete",t)}async function Ao(e,t){return gs(e,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Ly(e,t=!1){const i=Ke(e),n=await i.getIdToken(t),l=G1(n);q(l&&l.exp&&l.auth_time&&l.iat,i.auth,"internal-error");const s=typeof l.firebase=="object"?l.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:l,token:n,authTime:sr(m2(l.auth_time)),issuedAtTime:sr(m2(l.iat)),expirationTime:sr(m2(l.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function m2(e){return Number(e)*1e3}function G1(e){const[t,i,n]=e.split(".");if(t===void 0||i===void 0||n===void 0)return qa("JWT malformed, contained fewer than 3 sections"),null;try{const l=o3(i);return l?JSON.parse(l):(qa("Failed to decode base64 JWT payload"),null)}catch(l){return qa("Caught error parsing JWT payload as JSON",l==null?void 0:l.toString()),null}}function $0(e){const t=G1(e);return q(t,"internal-error"),q(typeof t.exp<"u","internal-error"),q(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function br(e,t,i=!1){if(i)return t;try{return await t}catch(n){throw n instanceof oi&&ky(n)&&e.auth.currentUser===e&&await e.auth.signOut(),n}}function ky({code:e}){return e==="auth/user-disabled"||e==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){var i;if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const l=((i=this.user.stsTokenManager.expirationTime)!==null&&i!==void 0?i:0)-Date.now()-3e5;return Math.max(0,l)}}schedule(t=!1){if(!this.isRunning)return;const i=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},i)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(t,i){this.createdAt=t,this.lastLoginAt=i,this._initializeTime()}_initializeTime(){this.lastSignInTime=sr(this.lastLoginAt),this.creationTime=sr(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xo(e){var t;const i=e.auth,n=await e.getIdToken(),l=await br(e,Ao(i,{idToken:n}));q(l==null?void 0:l.users.length,i,"internal-error");const s=l.users[0];e._notifyReloadListener(s);const a=!((t=s.providerUserInfo)===null||t===void 0)&&t.length?_3(s.providerUserInfo):[],o=Uy(e.providerData,a),c=e.isAnonymous,d=!(e.email&&s.passwordHash)&&!(o!=null&&o.length),v=c?d:!1,w={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new bc(s.createdAt,s.lastLoginAt),isAnonymous:v};Object.assign(e,w)}async function zy(e){const t=Ke(e);await xo(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Uy(e,t){return[...e.filter(n=>!t.some(l=>l.providerId===n.providerId)),...t]}function _3(e){return e.map(t=>{var{providerId:i}=t,n=I1(t,["providerId"]);return{providerId:i,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jy(e,t){const i=await w3(e,{},async()=>{const n=Ur({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:l,apiKey:s}=e.config,a=await Z3(e,l,"/v1/token",`key=${s}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:o,body:n};return e.emulatorConfig&&dl(e.emulatorConfig.host)&&(c.credentials="include"),y3.fetch()(a,c)});return{accessToken:i.access_token,expiresIn:i.expires_in,refreshToken:i.refresh_token}}async function Py(e,t){return gs(e,"POST","/v2/accounts:revokeToken",P1(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){q(t.idToken,"internal-error"),q(typeof t.idToken<"u","internal-error"),q(typeof t.refreshToken<"u","internal-error");const i="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):$0(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,i)}updateFromIdToken(t){q(t.length!==0,"internal-error");const i=$0(t);this.updateTokensAndExpiration(t,null,i)}async getToken(t,i=!1){return!i&&this.accessToken&&!this.isExpired?this.accessToken:(q(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,i){const{accessToken:n,refreshToken:l,expiresIn:s}=await jy(t,i);this.updateTokensAndExpiration(n,l,Number(s))}updateTokensAndExpiration(t,i,n){this.refreshToken=i||null,this.accessToken=t||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(t,i){const{refreshToken:n,accessToken:l,expirationTime:s}=i,a=new Pl;return n&&(q(typeof n=="string","internal-error",{appName:t}),a.refreshToken=n),l&&(q(typeof l=="string","internal-error",{appName:t}),a.accessToken=l),s&&(q(typeof s=="number","internal-error",{appName:t}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Pl,this.toJSON())}_performRefresh(){return Ei("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fi(e,t){q(typeof e=="string"||typeof e>"u","internal-error",{appName:t})}class Ge{constructor(t){var{uid:i,auth:n,stsTokenManager:l}=t,s=I1(t,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Iy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=i,this.auth=n,this.stsTokenManager=l,this.accessToken=l.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new bc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(t){const i=await br(this,this.stsTokenManager.getToken(this.auth,t));return q(i,this.auth,"internal-error"),this.accessToken!==i&&(this.accessToken=i,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),i}getIdTokenResult(t){return Ly(this,t)}reload(){return zy(this)}_assign(t){this!==t&&(q(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(i=>Object.assign({},i)),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const i=new Ge(Object.assign(Object.assign({},this),{auth:t,stsTokenManager:this.stsTokenManager._clone()}));return i.metadata._copy(this.metadata),i}_onReload(t){q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,i=!1){let n=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),n=!0),i&&await xo(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ve(this.auth.app))return Promise.reject(yn(this.auth));const t=await this.getIdToken();return await br(this,Dy(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>Object.assign({},t)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,i){var n,l,s,a,o,c,d,v;const w=(n=i.displayName)!==null&&n!==void 0?n:void 0,V=(l=i.email)!==null&&l!==void 0?l:void 0,b=(s=i.phoneNumber)!==null&&s!==void 0?s:void 0,C=(a=i.photoURL)!==null&&a!==void 0?a:void 0,N=(o=i.tenantId)!==null&&o!==void 0?o:void 0,D=(c=i._redirectEventId)!==null&&c!==void 0?c:void 0,Z=(d=i.createdAt)!==null&&d!==void 0?d:void 0,p=(v=i.lastLoginAt)!==null&&v!==void 0?v:void 0,{uid:_,emailVerified:A,isAnonymous:R,providerData:I,stsTokenManager:m}=i;q(_&&m,t,"internal-error");const f=Pl.fromJSON(this.name,m);q(typeof _=="string",t,"internal-error"),Fi(w,t.name),Fi(V,t.name),q(typeof A=="boolean",t,"internal-error"),q(typeof R=="boolean",t,"internal-error"),Fi(b,t.name),Fi(C,t.name),Fi(N,t.name),Fi(D,t.name),Fi(Z,t.name),Fi(p,t.name);const g=new Ge({uid:_,auth:t,email:V,emailVerified:A,displayName:w,isAnonymous:R,photoURL:C,phoneNumber:b,tenantId:N,stsTokenManager:f,createdAt:Z,lastLoginAt:p});return I&&Array.isArray(I)&&(g.providerData=I.map(M=>Object.assign({},M))),D&&(g._redirectEventId=D),g}static async _fromIdTokenResponse(t,i,n=!1){const l=new Pl;l.updateFromServerResponse(i);const s=new Ge({uid:i.localId,auth:t,stsTokenManager:l,isAnonymous:n});return await xo(s),s}static async _fromGetAccountInfoResponse(t,i,n){const l=i.users[0];q(l.localId!==void 0,"internal-error");const s=l.providerUserInfo!==void 0?_3(l.providerUserInfo):[],a=!(l.email&&l.passwordHash)&&!(s!=null&&s.length),o=new Pl;o.updateFromIdToken(n);const c=new Ge({uid:l.localId,auth:t,stsTokenManager:o,isAnonymous:a}),d={uid:l.localId,displayName:l.displayName||null,photoURL:l.photoUrl||null,email:l.email||null,emailVerified:l.emailVerified||!1,phoneNumber:l.phoneNumber||null,tenantId:l.tenantId||null,providerData:s,metadata:new bc(l.createdAt,l.lastLoginAt),isAnonymous:!(l.email&&l.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W0=new Map;function Ti(e){ki(e instanceof Function,"Expected a class definition");let t=W0.get(e);return t?(ki(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,W0.set(e,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b3{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,i){this.storage[t]=i}async _get(t){const i=this.storage[t];return i===void 0?null:i}async _remove(t){delete this.storage[t]}_addListener(t,i){}_removeListener(t,i){}}b3.type="NONE";const td=b3;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(e,t,i){return`firebase:${e}:${t}:${i}`}class Gl{constructor(t,i,n){this.persistence=t,this.auth=i,this.userKey=n;const{config:l,name:s}=this.auth;this.fullUserKey=Ya(this.userKey,l.apiKey,s),this.fullPersistenceKey=Ya("persistence",l.apiKey,s),this.boundEventHandler=i._onStorageEvent.bind(i),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const i=await Ao(this.auth,{idToken:t}).catch(()=>{});return i?Ge._fromGetAccountInfoResponse(this.auth,i,t):null}return Ge._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const i=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,i)return this.setCurrentUser(i)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,i,n="authUser"){if(!i.length)return new Gl(Ti(td),t,n);const l=(await Promise.all(i.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=l[0]||Ti(td);const a=Ya(n,t.config.apiKey,t.name);let o=null;for(const d of i)try{const v=await d._get(a);if(v){let w;if(typeof v=="string"){const V=await Ao(t,{idToken:v}).catch(()=>{});if(!V)break;w=await Ge._fromGetAccountInfoResponse(t,V,v)}else w=Ge._fromJSON(t,v);d!==s&&(o=w),s=d;break}}catch{}const c=l.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new Gl(s,t,n):(s=c[0],o&&await s._set(a,o.toJSON()),await Promise.all(i.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new Gl(s,t,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ed(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(A3(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(S3(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(C3(t))return"Blackberry";if(O3(t))return"Webos";if(E3(t))return"Safari";if((t.includes("chrome/")||T3(t))&&!t.includes("edge/"))return"Chrome";if(x3(t))return"Android";{const i=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(i);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function S3(e=se()){return/firefox\//i.test(e)}function E3(e=se()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function T3(e=se()){return/crios\//i.test(e)}function A3(e=se()){return/iemobile/i.test(e)}function x3(e=se()){return/android/i.test(e)}function C3(e=se()){return/blackberry/i.test(e)}function O3(e=se()){return/webos/i.test(e)}function q1(e=se()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Gy(e=se()){var t;return q1(e)&&!!(!((t=window.navigator)===null||t===void 0)&&t.standalone)}function qy(){return oM()&&document.documentMode===10}function N3(e=se()){return q1(e)||x3(e)||O3(e)||C3(e)||/windows phone/i.test(e)||A3(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R3(e,t=[]){let i;switch(e){case"Browser":i=ed(se());break;case"Worker":i=`${ed(se())}-${e}`;break;default:i=e}const n=t.length?t.join(","):"FirebaseCore-web";return`${i}/JsCore/${Vs}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,i){const n=s=>new Promise((a,o)=>{try{const c=t(s);a(c)}catch(c){o(c)}});n.onAbort=i,this.queue.push(n);const l=this.queue.length-1;return()=>{this.queue[l]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const i=[];try{for(const n of this.queue)await n(t),n.onAbort&&i.push(n.onAbort)}catch(n){i.reverse();for(const l of i)try{l()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xy(e,t={}){return gs(e,"GET","/v2/passwordPolicy",P1(e,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fy=6;class Ky{constructor(t){var i,n,l,s;const a=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(i=a.minPasswordLength)!==null&&i!==void 0?i:Fy,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(l=(n=t.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&l!==void 0?l:"",this.forceUpgradeOnSignin=(s=t.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=t.schemaVersion}validatePassword(t){var i,n,l,s,a,o;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,c),this.validatePasswordCharacterOptions(t,c),c.isValid&&(c.isValid=(i=c.meetsMinPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(n=c.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(l=c.containsLowercaseLetter)!==null&&l!==void 0?l:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(o=c.containsNonAlphanumericCharacter)!==null&&o!==void 0?o:!0),c}validatePasswordLengthOptions(t,i){const n=this.customStrengthOptions.minPasswordLength,l=this.customStrengthOptions.maxPasswordLength;n&&(i.meetsMinPasswordLength=t.length>=n),l&&(i.meetsMaxPasswordLength=t.length<=l)}validatePasswordCharacterOptions(t,i){this.updatePasswordCharacterOptionsStatuses(i,!1,!1,!1,!1);let n;for(let l=0;l<t.length;l++)n=t.charAt(l),this.updatePasswordCharacterOptionsStatuses(i,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(t,i,n,l,s){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=i)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=l)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(t,i,n,l){this.app=t,this.heartbeatServiceProvider=i,this.appCheckServiceProvider=n,this.config=l,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new id(this),this.idTokenSubscription=new id(this),this.beforeStateQueue=new Yy(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=v3,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=l.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(t,i){return i&&(this._popupRedirectResolver=Ti(i)),this._initializationPromise=this.queue(async()=>{var n,l,s;if(!this._deleted&&(this.persistenceManager=await Gl.create(this,t),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((l=this._popupRedirectResolver)===null||l===void 0)&&l._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(i),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const i=await Ao(this,{idToken:t}),n=await Ge._fromGetAccountInfoResponse(this,i,t);await this.directlySetCurrentUser(n)}catch(i){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",i),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var i;if(ve(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let l=n,s=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId,o=l==null?void 0:l._redirectEventId,c=await this.tryRedirectSignIn(t);(!a||a===o)&&(c!=null&&c.user)&&(l=c.user,s=!0)}if(!l)return this.directlySetCurrentUser(null);if(!l._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(l)}catch(a){l=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return l?this.reloadAndSetCurrentUserOrClear(l):this.directlySetCurrentUser(null)}return q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===l._redirectEventId?this.directlySetCurrentUser(l):this.reloadAndSetCurrentUserOrClear(l)}async tryRedirectSignIn(t){let i=null;try{i=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return i}async reloadAndSetCurrentUserOrClear(t){try{await xo(t)}catch(i){if((i==null?void 0:i.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=xy()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(ve(this.app))return Promise.reject(yn(this));const i=t?Ke(t):null;return i&&q(i.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(i&&i._clone(this))}async _updateCurrentUser(t,i=!1){if(!this._deleted)return t&&q(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),i||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return ve(this.app)?Promise.reject(yn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return ve(this.app)?Promise.reject(yn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ti(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const i=this._getPasswordPolicyInternal();return i.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):i.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await Xy(this),i=new Ky(t);this.tenantId===null?this._projectPasswordPolicy=i:this._tenantPasswordPolicies[this.tenantId]=i}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new zr("auth","Firebase",t())}onAuthStateChanged(t,i,n){return this.registerStateListener(this.authStateSubscription,t,i,n)}beforeAuthStateChanged(t,i){return this.beforeStateQueue.pushCallback(t,i)}onIdTokenChanged(t,i,n){return this.registerStateListener(this.idTokenSubscription,t,i,n)}authStateReady(){return new Promise((t,i)=>{if(this.currentUser)t();else{const n=this.onAuthStateChanged(()=>{n(),t()},i)}})}async revokeAccessToken(t){if(this.currentUser){const i=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:i};this.tenantId!=null&&(n.tenantId=this.tenantId),await Py(this,n)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)===null||t===void 0?void 0:t.toJSON()}}async _setRedirectUser(t,i){const n=await this.getOrInitRedirectPersistenceManager(i);return t===null?n.removeCurrentUser():n.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const i=t&&Ti(t)||this._popupRedirectResolver;q(i,this,"argument-error"),this.redirectPersistenceManager=await Gl.create(this,[Ti(i._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var i,n;return this._isInitialized&&await this.queue(async()=>{}),((i=this._currentUser)===null||i===void 0?void 0:i._redirectEventId)===t?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,i;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(i=(t=this.currentUser)===null||t===void 0?void 0:t.uid)!==null&&i!==void 0?i:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,i,n,l){if(this._deleted)return()=>{};const s=typeof i=="function"?i:i.next.bind(i);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(q(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof i=="function"){const c=t.addObserver(i,n,l);return()=>{a=!0,c()}}else{const c=t.addObserver(i);return()=>{a=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=R3(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var t;const i={"X-Client-Version":this.clientVersion};this.app.options.appId&&(i["X-Firebase-gmpid"]=this.app.options.appId);const n=await((t=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getHeartbeatsHeader());n&&(i["X-Firebase-Client"]=n);const l=await this._getAppCheckToken();return l&&(i["X-Firebase-AppCheck"]=l),i}async _getAppCheckToken(){var t;if(ve(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const i=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||t===void 0?void 0:t.getToken());return i!=null&&i.error&&Ey(`Error while retrieving App Check token: ${i.error}`),i==null?void 0:i.token}}function ps(e){return Ke(e)}class id{constructor(t){this.auth=t,this.observer=null,this.addObserver=VM(i=>this.observer=i)}get next(){return q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Y1={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Jy(e){Y1=e}function $y(e){return Y1.loadJS(e)}function Wy(){return Y1.gapiScript}function t6(e){return`__${e}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B3(e,t){const i=jr(e,"auth");if(i.isInitialized()){const l=i.getImmediate(),s=i.getOptions();if(Sn(s,t??{}))return l;si(l,"already-initialized")}return i.initialize({options:t})}function e6(e,t){const i=(t==null?void 0:t.persistence)||[],n=(Array.isArray(i)?i:[i]).map(Ti);t!=null&&t.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(n,t==null?void 0:t.popupRedirectResolver)}function i6(e,t,i){const n=ps(e);q(/^https?:\/\//.test(t),n,"invalid-emulator-scheme");const l=!1,s=D3(t),{host:a,port:o}=n6(t),c=o===null?"":`:${o}`,d={url:`${s}//${a}${c}/`},v=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:l})});if(!n._canInitEmulator){q(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),q(Sn(d,n.config.emulator)&&Sn(v,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=d,n.emulatorConfig=v,n.settings.appVerificationDisabledForTesting=!0,dl(a)?(nu(`${s}//${a}${c}`),B1("Auth",!0)):l6()}function D3(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function n6(e){const t=D3(e),i=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!i)return{host:"",port:null};const n=i[2].split("@").pop()||"",l=/^(\[[^\]]+\])(:|$)/.exec(n);if(l){const s=l[1];return{host:s,port:nd(n.substr(s.length+1))}}else{const[s,a]=n.split(":");return{host:s,port:nd(a)}}}function nd(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}function l6(){function e(){const t=document.createElement("p"),i=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",i.position="fixed",i.width="100%",i.backgroundColor="#ffffff",i.border=".1em solid #000000",i.color="#b50000",i.bottom="0px",i.left="0px",i.margin="0px",i.zIndex="10000",i.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",e):e())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L3{constructor(t,i){this.providerId=t,this.signInMethod=i}toJSON(){return Ei("not implemented")}_getIdTokenResponse(t){return Ei("not implemented")}_linkToIdToken(t,i){return Ei("not implemented")}_getReauthenticationResolver(t){return Ei("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ql(e,t){return Ry(e,"POST","/v1/accounts:signInWithIdp",P1(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s6="http://localhost";class sl extends L3{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const i=new sl(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(i.idToken=t.idToken),t.accessToken&&(i.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(i.nonce=t.nonce),t.pendingToken&&(i.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(i.accessToken=t.oauthToken,i.secret=t.oauthTokenSecret):si("argument-error"),i}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const i=typeof t=="string"?JSON.parse(t):t,{providerId:n,signInMethod:l}=i,s=I1(i,["providerId","signInMethod"]);if(!n||!l)return null;const a=new sl(n,l);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(t){const i=this.buildRequest();return ql(t,i)}_linkToIdToken(t,i){const n=this.buildRequest();return n.idToken=i,ql(t,n)}_getReauthenticationResolver(t){const i=this.buildRequest();return i.autoCreate=!1,ql(t,i)}buildRequest(){const t={requestUri:s6,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const i={};this.idToken&&(i.id_token=this.idToken),this.accessToken&&(i.access_token=this.accessToken),this.secret&&(i.oauth_token_secret=this.secret),i.providerId=this.providerId,this.nonce&&!this.pendingToken&&(i.nonce=this.nonce),t.postBody=Ur(i)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr extends lu{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en extends Gr{constructor(){super("facebook.com")}static credential(t){return sl._fromParams({providerId:en.PROVIDER_ID,signInMethod:en.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return en.credentialFromTaggedObject(t)}static credentialFromError(t){return en.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return en.credential(t.oauthAccessToken)}catch{return null}}}en.FACEBOOK_SIGN_IN_METHOD="facebook.com";en.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi extends Gr{constructor(){super("google.com"),this.addScope("profile")}static credential(t,i){return sl._fromParams({providerId:wi.PROVIDER_ID,signInMethod:wi.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:i})}static credentialFromResult(t){return wi.credentialFromTaggedObject(t)}static credentialFromError(t){return wi.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:i,oauthAccessToken:n}=t;if(!i&&!n)return null;try{return wi.credential(i,n)}catch{return null}}}wi.GOOGLE_SIGN_IN_METHOD="google.com";wi.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn extends Gr{constructor(){super("github.com")}static credential(t){return sl._fromParams({providerId:nn.PROVIDER_ID,signInMethod:nn.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return nn.credentialFromTaggedObject(t)}static credentialFromError(t){return nn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return nn.credential(t.oauthAccessToken)}catch{return null}}}nn.GITHUB_SIGN_IN_METHOD="github.com";nn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln extends Gr{constructor(){super("twitter.com")}static credential(t,i){return sl._fromParams({providerId:ln.PROVIDER_ID,signInMethod:ln.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:i})}static credentialFromResult(t){return ln.credentialFromTaggedObject(t)}static credentialFromError(t){return ln.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:i,oauthTokenSecret:n}=t;if(!i||!n)return null;try{return ln.credential(i,n)}catch{return null}}}ln.TWITTER_SIGN_IN_METHOD="twitter.com";ln.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,i,n,l=!1){const s=await Ge._fromIdTokenResponse(t,n,l),a=ld(n);return new ls({user:s,providerId:a,_tokenResponse:n,operationType:i})}static async _forOperation(t,i,n){await t._updateTokensIfNecessary(n,!0);const l=ld(n);return new ls({user:t,providerId:l,_tokenResponse:n,operationType:i})}}function ld(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co extends oi{constructor(t,i,n,l){var s;super(i.code,i.message),this.operationType=n,this.user=l,Object.setPrototypeOf(this,Co.prototype),this.customData={appName:t.name,tenantId:(s=t.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:i.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(t,i,n,l){return new Co(t,i,n,l)}}function k3(e,t,i,n){return(t==="reauthenticate"?i._getReauthenticationResolver(e):i._getIdTokenResponse(e)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Co._fromErrorAndOperation(e,s,t,n):s})}async function r6(e,t,i=!1){const n=await br(e,t._linkToIdToken(e.auth,await e.getIdToken()),i);return ls._forOperation(e,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function a6(e,t,i=!1){const{auth:n}=e;if(ve(n.app))return Promise.reject(yn(n));const l="reauthenticate";try{const s=await br(e,k3(n,l,t,e),i);q(s.idToken,n,"internal-error");const a=G1(s.idToken);q(a,n,"internal-error");const{sub:o}=a;return q(e.uid===o,n,"user-mismatch"),ls._forOperation(e,l,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&si(n,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function o6(e,t,i=!1){if(ve(e.app))return Promise.reject(yn(e));const n="signIn",l=await k3(e,n,t),s=await ls._fromIdTokenResponse(e,n,l);return i||await e._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u6(e,t){return Ke(e).setPersistence(t)}function c6(e,t,i,n){return Ke(e).onIdTokenChanged(t,i,n)}function h6(e,t,i){return Ke(e).beforeAuthStateChanged(t,i)}function sd(e){return Ke(e).signOut()}const Oo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I3{constructor(t,i){this.storageRetriever=t,this.type=i}_isAvailable(){try{return this.storage?(this.storage.setItem(Oo,"1"),this.storage.removeItem(Oo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,i){return this.storage.setItem(t,JSON.stringify(i)),Promise.resolve()}_get(t){const i=this.storage.getItem(t);return Promise.resolve(i?JSON.parse(i):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f6=1e3,d6=10;class z3 extends I3{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,i)=>this.onStorageEvent(t,i),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=N3(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const i of Object.keys(this.listeners)){const n=this.storage.getItem(i),l=this.localCache[i];n!==l&&t(i,l,n)}}onStorageEvent(t,i=!1){if(!t.key){this.forAllChangedKeys((a,o,c)=>{this.notifyListeners(a,c)});return}const n=t.key;i?this.detachListener():this.stopPolling();const l=()=>{const a=this.storage.getItem(n);!i&&this.localCache[n]===a||this.notifyListeners(n,a)},s=this.storage.getItem(n);qy()&&s!==t.newValue&&t.newValue!==t.oldValue?setTimeout(l,d6):l()}notifyListeners(t,i){this.localCache[t]=i;const n=this.listeners[t];if(n)for(const l of Array.from(n))l(i&&JSON.parse(i))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,i,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:i,newValue:n}),!0)})},f6)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,i){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(i)}_removeListener(t,i){this.listeners[t]&&(this.listeners[t].delete(i),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,i){await super._set(t,i),this.localCache[t]=JSON.stringify(i)}async _get(t){const i=await super._get(t);return this.localCache[t]=JSON.stringify(i),i}async _remove(t){await super._remove(t),delete this.localCache[t]}}z3.type="LOCAL";const U3=z3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j3 extends I3{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,i){}_removeListener(t,i){}}j3.type="SESSION";const X1=j3;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H6(e){return Promise.all(e.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(i){return{fulfilled:!1,reason:i}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const i=this.receivers.find(l=>l.isListeningto(t));if(i)return i;const n=new su(t);return this.receivers.push(n),n}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const i=t,{eventId:n,eventType:l,data:s}=i.data,a=this.handlersMap[l];if(!(a!=null&&a.size))return;i.ports[0].postMessage({status:"ack",eventId:n,eventType:l});const o=Array.from(a).map(async d=>d(i.origin,s)),c=await H6(o);i.ports[0].postMessage({status:"done",eventId:n,eventType:l,response:c})}_subscribe(t,i){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(i)}_unsubscribe(t,i){this.handlersMap[t]&&i&&this.handlersMap[t].delete(i),(!i||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}su.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F1(e="",t=10){let i="";for(let n=0;n<t;n++)i+=Math.floor(Math.random()*10);return e+i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V6{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,i,n=50){const l=typeof MessageChannel<"u"?new MessageChannel:null;if(!l)throw new Error("connection_unavailable");let s,a;return new Promise((o,c)=>{const d=F1("",20);l.port1.start();const v=setTimeout(()=>{c(new Error("unsupported_event"))},n);a={messageChannel:l,onMessage(w){const V=w;if(V.data.eventId===d)switch(V.data.status){case"ack":clearTimeout(v),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(V.data.response);break;default:clearTimeout(v),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(a),l.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:t,eventId:d,data:i},[l.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function li(){return window}function g6(e){li().location.href=e}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P3(){return typeof li().WorkerGlobalScope<"u"&&typeof li().importScripts=="function"}async function p6(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function m6(){var e;return((e=navigator==null?void 0:navigator.serviceWorker)===null||e===void 0?void 0:e.controller)||null}function v6(){return P3()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G3="firebaseLocalStorageDb",M6=1,No="firebaseLocalStorage",q3="fbase_key";class qr{constructor(t){this.request=t}toPromise(){return new Promise((t,i)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{i(this.request.error)})})}}function ru(e,t){return e.transaction([No],t?"readwrite":"readonly").objectStore(No)}function y6(){const e=indexedDB.deleteDatabase(G3);return new qr(e).toPromise()}function Sc(){const e=indexedDB.open(G3,M6);return new Promise((t,i)=>{e.addEventListener("error",()=>{i(e.error)}),e.addEventListener("upgradeneeded",()=>{const n=e.result;try{n.createObjectStore(No,{keyPath:q3})}catch(l){i(l)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(No)?t(n):(n.close(),await y6(),t(await Sc()))})})}async function rd(e,t,i){const n=ru(e,!0).put({[q3]:t,value:i});return new qr(n).toPromise()}async function w6(e,t){const i=ru(e,!1).get(t),n=await new qr(i).toPromise();return n===void 0?null:n.value}function ad(e,t){const i=ru(e,!0).delete(t);return new qr(i).toPromise()}const Z6=800,_6=3;class Y3{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Sc(),this.db)}async _withRetries(t){let i=0;for(;;)try{const n=await this._openDb();return await t(n)}catch(n){if(i++>_6)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return P3()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=su._getInstance(v6()),this.receiver._subscribe("keyChanged",async(t,i)=>({keyProcessed:(await this._poll()).includes(i.key)})),this.receiver._subscribe("ping",async(t,i)=>["keyChanged"])}async initializeSender(){var t,i;if(this.activeServiceWorker=await p6(),!this.activeServiceWorker)return;this.sender=new V6(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((t=n[0])===null||t===void 0)&&t.fulfilled&&!((i=n[0])===null||i===void 0)&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||m6()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await Sc();return await rd(t,Oo,"1"),await ad(t,Oo),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,i){return this._withPendingWrite(async()=>(await this._withRetries(n=>rd(n,t,i)),this.localCache[t]=i,this.notifyServiceWorker(t)))}async _get(t){const i=await this._withRetries(n=>w6(n,t));return this.localCache[t]=i,i}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(i=>ad(i,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(l=>{const s=ru(l,!1).getAll();return new qr(s).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const i=[],n=new Set;if(t.length!==0)for(const{fbase_key:l,value:s}of t)n.add(l),JSON.stringify(this.localCache[l])!==JSON.stringify(s)&&(this.notifyListeners(l,s),i.push(l));for(const l of Object.keys(this.localCache))this.localCache[l]&&!n.has(l)&&(this.notifyListeners(l,null),i.push(l));return i}notifyListeners(t,i){this.localCache[t]=i;const n=this.listeners[t];if(n)for(const l of Array.from(n))l(i)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Z6)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,i){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(i)}_removeListener(t,i){this.listeners[t]&&(this.listeners[t].delete(i),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Y3.type="LOCAL";const b6=Y3;new Pr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K1(e,t){return t?Ti(t):(q(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q1 extends L3{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return ql(t,this._buildIdpRequest())}_linkToIdToken(t,i){return ql(t,this._buildIdpRequest(i))}_getReauthenticationResolver(t){return ql(t,this._buildIdpRequest())}_buildIdpRequest(t){const i={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(i.idToken=t),i}}function S6(e){return o6(e.auth,new Q1(e),e.bypassAuthState)}function E6(e){const{auth:t,user:i}=e;return q(i,t,"internal-error"),a6(i,new Q1(e),e.bypassAuthState)}async function T6(e){const{auth:t,user:i}=e;return q(i,t,"internal-error"),r6(i,new Q1(e),e.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X3{constructor(t,i,n,l,s=!1){this.auth=t,this.resolver=n,this.user=l,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(i)?i:[i]}execute(){return new Promise(async(t,i)=>{this.pendingPromise={resolve:t,reject:i};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(t){const{urlResponse:i,sessionId:n,postBody:l,tenantId:s,error:a,type:o}=t;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:i,sessionId:n,tenantId:s||void 0,postBody:l||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(c))}catch(d){this.reject(d)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return S6;case"linkViaPopup":case"linkViaRedirect":return T6;case"reauthViaPopup":case"reauthViaRedirect":return E6;default:si(this.auth,"internal-error")}}resolve(t){ki(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){ki(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A6=new Pr(2e3,1e4);async function x6(e,t,i){if(ve(e.app))return Promise.reject(Ye(e,"operation-not-supported-in-this-environment"));const n=ps(e);M3(e,t,lu);const l=K1(n,i);return new Gn(n,"signInViaPopup",t,l).executeNotNull()}class Gn extends X3{constructor(t,i,n,l,s){super(t,i,l,s),this.provider=n,this.authWindow=null,this.pollId=null,Gn.currentPopupAction&&Gn.currentPopupAction.cancel(),Gn.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return q(t,this.auth,"internal-error"),t}async onExecution(){ki(this.filter.length===1,"Popup operations only handle one event");const t=F1();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(i=>{this.reject(i)}),this.resolver._isIframeWebStorageSupported(this.auth,i=>{i||this.reject(Ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)===null||t===void 0?void 0:t.associatedEvent)||null}cancel(){this.reject(Ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Gn.currentPopupAction=null}pollUserCancellation(){const t=()=>{var i,n;if(!((n=(i=this.authWindow)===null||i===void 0?void 0:i.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,A6.get())};t()}}Gn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C6="pendingRedirect",Xa=new Map;class O6 extends X3{constructor(t,i,n=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],i,void 0,n),this.eventId=null}async execute(){let t=Xa.get(this.auth._key());if(!t){try{const n=await N6(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(n)}catch(i){t=()=>Promise.reject(i)}Xa.set(this.auth._key(),t)}return this.bypassAuthState||Xa.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const i=await this.auth._redirectUserForId(t.eventId);if(i)return this.user=i,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function N6(e,t){const i=K3(t),n=F3(e);if(!await n._isAvailable())return!1;const l=await n._get(i)==="true";return await n._remove(i),l}async function R6(e,t){return F3(e)._set(K3(t),"true")}function B6(e,t){Xa.set(e._key(),t)}function F3(e){return Ti(e._redirectPersistence)}function K3(e){return Ya(C6,e.config.apiKey,e.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function od(e,t,i){return D6(e,t,i)}async function D6(e,t,i){if(ve(e.app))return Promise.reject(yn(e));const n=ps(e);M3(e,t,lu),await n._initializationPromise;const l=K1(n,i);return await R6(l,n),l._openRedirect(n,t,"signInViaRedirect")}async function L6(e,t){return await ps(e)._initializationPromise,Q3(e,t,!1)}async function Q3(e,t,i=!1){if(ve(e.app))return Promise.reject(yn(e));const n=ps(e),l=K1(n,t),a=await new O6(n,l,i).execute();return a&&!i&&(delete a.user._redirectEventId,await n._persistUserIfCurrent(a.user),await n._setRedirectUser(null,t)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k6=10*60*1e3;class I6{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let i=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(t,n)&&(i=!0,this.sendToConsumer(t,n),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!z6(t)||(this.hasHandledPotentialRedirect=!0,i||(this.queuedRedirectEvent=t,i=!0)),i}sendToConsumer(t,i){var n;if(t.error&&!J3(t)){const l=((n=t.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";i.onError(Ye(this.auth,l))}else i.onAuthEvent(t)}isEventForConsumer(t,i){const n=i.eventId===null||!!t.eventId&&t.eventId===i.eventId;return i.filter.includes(t.type)&&n}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=k6&&this.cachedEventUids.clear(),this.cachedEventUids.has(ud(t))}saveEventToCache(t){this.cachedEventUids.add(ud(t)),this.lastProcessedEventTime=Date.now()}}function ud(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(t=>t).join("-")}function J3({type:e,error:t}){return e==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function z6(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return J3(e);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function U6(e,t={}){return gs(e,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j6=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,P6=/^https?/;async function G6(e){if(e.config.emulator)return;const{authorizedDomains:t}=await U6(e);for(const i of t)try{if(q6(i))return}catch{}si(e,"unauthorized-domain")}function q6(e){const t=_c(),{protocol:i,hostname:n}=new URL(t);if(e.startsWith("chrome-extension://")){const a=new URL(e);return a.hostname===""&&n===""?i==="chrome-extension:"&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):i==="chrome-extension:"&&a.hostname===n}if(!P6.test(i))return!1;if(j6.test(e))return n===e;const l=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+l+"|"+l+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y6=new Pr(3e4,6e4);function cd(){const e=li().___jsl;if(e!=null&&e.H){for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let i=0;i<e.CP.length;i++)e.CP[i]=null}}function X6(e){return new Promise((t,i)=>{var n,l,s;function a(){cd(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{cd(),i(Ye(e,"network-request-failed"))},timeout:Y6.get()})}if(!((l=(n=li().gapi)===null||n===void 0?void 0:n.iframes)===null||l===void 0)&&l.Iframe)t(gapi.iframes.getContext());else if(!((s=li().gapi)===null||s===void 0)&&s.load)a();else{const o=t6("iframefcb");return li()[o]=()=>{gapi.load?a():i(Ye(e,"network-request-failed"))},$y(`${Wy()}?onload=${o}`).catch(c=>i(c))}}).catch(t=>{throw Fa=null,t})}let Fa=null;function F6(e){return Fa=Fa||X6(e),Fa}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K6=new Pr(5e3,15e3),Q6="__/auth/iframe",J6="emulator/auth/iframe",$6={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},W6=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function tw(e){const t=e.config;q(t.authDomain,e,"auth-domain-config-required");const i=t.emulator?j1(t,J6):`https://${e.config.authDomain}/${Q6}`,n={apiKey:t.apiKey,appName:e.name,v:Vs},l=W6.get(e.config.apiHost);l&&(n.eid=l);const s=e._getFrameworks();return s.length&&(n.fw=s.join(",")),`${i}?${Ur(n).slice(1)}`}async function ew(e){const t=await F6(e),i=li().gapi;return q(i,e,"internal-error"),t.open({where:document.body,url:tw(e),messageHandlersFilter:i.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:$6,dontclear:!0},n=>new Promise(async(l,s)=>{await n.restyle({setHideOnLeave:!1});const a=Ye(e,"network-request-failed"),o=li().setTimeout(()=>{s(a)},K6.get());function c(){li().clearTimeout(o),l(n)}n.ping(c).then(c,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iw={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},nw=500,lw=600,sw="_blank",rw="http://localhost";class hd{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function aw(e,t,i,n=nw,l=lw){const s=Math.max((window.screen.availHeight-l)/2,0).toString(),a=Math.max((window.screen.availWidth-n)/2,0).toString();let o="";const c=Object.assign(Object.assign({},iw),{width:n.toString(),height:l.toString(),top:s,left:a}),d=se().toLowerCase();i&&(o=T3(d)?sw:i),S3(d)&&(t=t||rw,c.scrollbars="yes");const v=Object.entries(c).reduce((V,[b,C])=>`${V}${b}=${C},`,"");if(Gy(d)&&o!=="_self")return ow(t||"",o),new hd(null);const w=window.open(t||"",o,v);q(w,e,"popup-blocked");try{w.focus()}catch{}return new hd(w)}function ow(e,t){const i=document.createElement("a");i.href=e,i.target=t;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),i.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uw="__/auth/handler",cw="emulator/auth/handler",hw=encodeURIComponent("fac");async function fd(e,t,i,n,l,s){q(e.config.authDomain,e,"auth-domain-config-required"),q(e.config.apiKey,e,"invalid-api-key");const a={apiKey:e.config.apiKey,appName:e.name,authType:i,redirectUrl:n,v:Vs,eventId:l};if(t instanceof lu){t.setDefaultLanguage(e.languageCode),a.providerId=t.providerId||"",HM(t.getCustomParameters())||(a.customParameters=JSON.stringify(t.getCustomParameters()));for(const[v,w]of Object.entries({}))a[v]=w}if(t instanceof Gr){const v=t.getScopes().filter(w=>w!=="");v.length>0&&(a.scopes=v.join(","))}e.tenantId&&(a.tid=e.tenantId);const o=a;for(const v of Object.keys(o))o[v]===void 0&&delete o[v];const c=await e._getAppCheckToken(),d=c?`#${hw}=${encodeURIComponent(c)}`:"";return`${fw(e)}?${Ur(o).slice(1)}${d}`}function fw({config:e}){return e.emulator?j1(e,cw):`https://${e.authDomain}/${uw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v2="webStorageSupport";class dw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=X1,this._completeRedirectFn=Q3,this._overrideRedirectResult=B6}async _openPopup(t,i,n,l){var s;ki((s=this.eventManagers[t._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await fd(t,i,n,_c(),l);return aw(t,a,F1())}async _openRedirect(t,i,n,l){await this._originValidation(t);const s=await fd(t,i,n,_c(),l);return g6(s),new Promise(()=>{})}_initialize(t){const i=t._key();if(this.eventManagers[i]){const{manager:l,promise:s}=this.eventManagers[i];return l?Promise.resolve(l):(ki(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(t);return this.eventManagers[i]={promise:n},n.catch(()=>{delete this.eventManagers[i]}),n}async initAndGetManager(t){const i=await ew(t),n=new I6(t);return i.register("authEvent",l=>(q(l==null?void 0:l.authEvent,t,"invalid-auth-event"),{status:n.onEvent(l.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:n},this.iframes[t._key()]=i,n}_isIframeWebStorageSupported(t,i){this.iframes[t._key()].send(v2,{type:v2},l=>{var s;const a=(s=l==null?void 0:l[0])===null||s===void 0?void 0:s[v2];a!==void 0&&i(!!a),si(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const i=t._key();return this.originValidationPromises[i]||(this.originValidationPromises[i]=G6(t)),this.originValidationPromises[i]}get _shouldInitProactively(){return N3()||E3()||q1()}}const $3=dw;var dd="@firebase/auth",Hd="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hw{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)===null||t===void 0?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const i=this.auth.onIdTokenChanged(n=>{t((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,i),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const i=this.internalListeners.get(t);i&&(this.internalListeners.delete(t),i(),this.updateProactiveRefresh())}assertAuthConfigured(){q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vw(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function gw(e){ll(new En("auth",(t,{options:i})=>{const n=t.getProvider("app").getImmediate(),l=t.getProvider("heartbeat"),s=t.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=n.options;q(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:a,authDomain:o,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:R3(e)},d=new Qy(n,l,s,c);return e6(d,i),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,i,n)=>{t.getProvider("auth-internal").initialize()})),ll(new En("auth-internal",t=>{const i=ps(t.getProvider("auth").getImmediate());return(n=>new Hw(n))(i)},"PRIVATE").setInstantiationMode("EXPLICIT")),ni(dd,Hd,Vw(e)),ni(dd,Hd,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pw=5*60,mw=f3("authIdTokenMaxAge")||pw;let Vd=null;const vw=e=>async t=>{const i=t&&await t.getIdTokenResult(),n=i&&(new Date().getTime()-Date.parse(i.issuedAtTime))/1e3;if(n&&n>mw)return;const l=i==null?void 0:i.token;Vd!==l&&(Vd=l,await fetch(e,{method:l?"POST":"DELETE",headers:l?{Authorization:`Bearer ${l}`}:{}}))};function Mw(e=k1()){const t=jr(e,"auth");if(t.isInitialized())return t.getImmediate();const i=B3(e,{popupRedirectResolver:$3,persistence:[b6,U3,X1]}),n=f3("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(n,location.origin);if(location.origin===s.origin){const a=vw(s.toString());h6(i,a,()=>a(i.currentUser)),c6(i,o=>a(o))}}const l=u3("auth");return l&&i6(i,`http://${l}`),i}function yw(){var e,t;return(t=(e=document.getElementsByTagName("head"))===null||e===void 0?void 0:e[0])!==null&&t!==void 0?t:document}Jy({loadJS(e){return new Promise((t,i)=>{const n=document.createElement("script");n.setAttribute("src",e),n.onload=t,n.onerror=l=>{const s=Ye("internal-error");s.customData=l,i(s)},n.type="text/javascript",n.charset="UTF-8",yw().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});gw("Browser");var ww="firebase",Zw="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ni(ww,Zw,"app");var gd=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var J1;(function(){var e;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(m,f){function g(){}g.prototype=f.prototype,m.D=f.prototype,m.prototype=new g,m.prototype.constructor=m,m.C=function(M,S,E){for(var y=Array(arguments.length-2),Wt=2;Wt<arguments.length;Wt++)y[Wt-2]=arguments[Wt];return f.prototype[S].apply(M,y)}}function i(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(n,i),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function l(m,f,g){g||(g=0);var M=Array(16);if(typeof f=="string")for(var S=0;16>S;++S)M[S]=f.charCodeAt(g++)|f.charCodeAt(g++)<<8|f.charCodeAt(g++)<<16|f.charCodeAt(g++)<<24;else for(S=0;16>S;++S)M[S]=f[g++]|f[g++]<<8|f[g++]<<16|f[g++]<<24;f=m.g[0],g=m.g[1],S=m.g[2];var E=m.g[3],y=f+(E^g&(S^E))+M[0]+3614090360&4294967295;f=g+(y<<7&4294967295|y>>>25),y=E+(S^f&(g^S))+M[1]+3905402710&4294967295,E=f+(y<<12&4294967295|y>>>20),y=S+(g^E&(f^g))+M[2]+606105819&4294967295,S=E+(y<<17&4294967295|y>>>15),y=g+(f^S&(E^f))+M[3]+3250441966&4294967295,g=S+(y<<22&4294967295|y>>>10),y=f+(E^g&(S^E))+M[4]+4118548399&4294967295,f=g+(y<<7&4294967295|y>>>25),y=E+(S^f&(g^S))+M[5]+1200080426&4294967295,E=f+(y<<12&4294967295|y>>>20),y=S+(g^E&(f^g))+M[6]+2821735955&4294967295,S=E+(y<<17&4294967295|y>>>15),y=g+(f^S&(E^f))+M[7]+4249261313&4294967295,g=S+(y<<22&4294967295|y>>>10),y=f+(E^g&(S^E))+M[8]+1770035416&4294967295,f=g+(y<<7&4294967295|y>>>25),y=E+(S^f&(g^S))+M[9]+2336552879&4294967295,E=f+(y<<12&4294967295|y>>>20),y=S+(g^E&(f^g))+M[10]+4294925233&4294967295,S=E+(y<<17&4294967295|y>>>15),y=g+(f^S&(E^f))+M[11]+2304563134&4294967295,g=S+(y<<22&4294967295|y>>>10),y=f+(E^g&(S^E))+M[12]+1804603682&4294967295,f=g+(y<<7&4294967295|y>>>25),y=E+(S^f&(g^S))+M[13]+4254626195&4294967295,E=f+(y<<12&4294967295|y>>>20),y=S+(g^E&(f^g))+M[14]+2792965006&4294967295,S=E+(y<<17&4294967295|y>>>15),y=g+(f^S&(E^f))+M[15]+1236535329&4294967295,g=S+(y<<22&4294967295|y>>>10),y=f+(S^E&(g^S))+M[1]+4129170786&4294967295,f=g+(y<<5&4294967295|y>>>27),y=E+(g^S&(f^g))+M[6]+3225465664&4294967295,E=f+(y<<9&4294967295|y>>>23),y=S+(f^g&(E^f))+M[11]+643717713&4294967295,S=E+(y<<14&4294967295|y>>>18),y=g+(E^f&(S^E))+M[0]+3921069994&4294967295,g=S+(y<<20&4294967295|y>>>12),y=f+(S^E&(g^S))+M[5]+3593408605&4294967295,f=g+(y<<5&4294967295|y>>>27),y=E+(g^S&(f^g))+M[10]+38016083&4294967295,E=f+(y<<9&4294967295|y>>>23),y=S+(f^g&(E^f))+M[15]+3634488961&4294967295,S=E+(y<<14&4294967295|y>>>18),y=g+(E^f&(S^E))+M[4]+3889429448&4294967295,g=S+(y<<20&4294967295|y>>>12),y=f+(S^E&(g^S))+M[9]+568446438&4294967295,f=g+(y<<5&4294967295|y>>>27),y=E+(g^S&(f^g))+M[14]+3275163606&4294967295,E=f+(y<<9&4294967295|y>>>23),y=S+(f^g&(E^f))+M[3]+4107603335&4294967295,S=E+(y<<14&4294967295|y>>>18),y=g+(E^f&(S^E))+M[8]+1163531501&4294967295,g=S+(y<<20&4294967295|y>>>12),y=f+(S^E&(g^S))+M[13]+2850285829&4294967295,f=g+(y<<5&4294967295|y>>>27),y=E+(g^S&(f^g))+M[2]+4243563512&4294967295,E=f+(y<<9&4294967295|y>>>23),y=S+(f^g&(E^f))+M[7]+1735328473&4294967295,S=E+(y<<14&4294967295|y>>>18),y=g+(E^f&(S^E))+M[12]+2368359562&4294967295,g=S+(y<<20&4294967295|y>>>12),y=f+(g^S^E)+M[5]+4294588738&4294967295,f=g+(y<<4&4294967295|y>>>28),y=E+(f^g^S)+M[8]+2272392833&4294967295,E=f+(y<<11&4294967295|y>>>21),y=S+(E^f^g)+M[11]+1839030562&4294967295,S=E+(y<<16&4294967295|y>>>16),y=g+(S^E^f)+M[14]+4259657740&4294967295,g=S+(y<<23&4294967295|y>>>9),y=f+(g^S^E)+M[1]+2763975236&4294967295,f=g+(y<<4&4294967295|y>>>28),y=E+(f^g^S)+M[4]+1272893353&4294967295,E=f+(y<<11&4294967295|y>>>21),y=S+(E^f^g)+M[7]+4139469664&4294967295,S=E+(y<<16&4294967295|y>>>16),y=g+(S^E^f)+M[10]+3200236656&4294967295,g=S+(y<<23&4294967295|y>>>9),y=f+(g^S^E)+M[13]+681279174&4294967295,f=g+(y<<4&4294967295|y>>>28),y=E+(f^g^S)+M[0]+3936430074&4294967295,E=f+(y<<11&4294967295|y>>>21),y=S+(E^f^g)+M[3]+3572445317&4294967295,S=E+(y<<16&4294967295|y>>>16),y=g+(S^E^f)+M[6]+76029189&4294967295,g=S+(y<<23&4294967295|y>>>9),y=f+(g^S^E)+M[9]+3654602809&4294967295,f=g+(y<<4&4294967295|y>>>28),y=E+(f^g^S)+M[12]+3873151461&4294967295,E=f+(y<<11&4294967295|y>>>21),y=S+(E^f^g)+M[15]+530742520&4294967295,S=E+(y<<16&4294967295|y>>>16),y=g+(S^E^f)+M[2]+3299628645&4294967295,g=S+(y<<23&4294967295|y>>>9),y=f+(S^(g|~E))+M[0]+4096336452&4294967295,f=g+(y<<6&4294967295|y>>>26),y=E+(g^(f|~S))+M[7]+1126891415&4294967295,E=f+(y<<10&4294967295|y>>>22),y=S+(f^(E|~g))+M[14]+2878612391&4294967295,S=E+(y<<15&4294967295|y>>>17),y=g+(E^(S|~f))+M[5]+4237533241&4294967295,g=S+(y<<21&4294967295|y>>>11),y=f+(S^(g|~E))+M[12]+1700485571&4294967295,f=g+(y<<6&4294967295|y>>>26),y=E+(g^(f|~S))+M[3]+2399980690&4294967295,E=f+(y<<10&4294967295|y>>>22),y=S+(f^(E|~g))+M[10]+4293915773&4294967295,S=E+(y<<15&4294967295|y>>>17),y=g+(E^(S|~f))+M[1]+2240044497&4294967295,g=S+(y<<21&4294967295|y>>>11),y=f+(S^(g|~E))+M[8]+1873313359&4294967295,f=g+(y<<6&4294967295|y>>>26),y=E+(g^(f|~S))+M[15]+4264355552&4294967295,E=f+(y<<10&4294967295|y>>>22),y=S+(f^(E|~g))+M[6]+2734768916&4294967295,S=E+(y<<15&4294967295|y>>>17),y=g+(E^(S|~f))+M[13]+1309151649&4294967295,g=S+(y<<21&4294967295|y>>>11),y=f+(S^(g|~E))+M[4]+4149444226&4294967295,f=g+(y<<6&4294967295|y>>>26),y=E+(g^(f|~S))+M[11]+3174756917&4294967295,E=f+(y<<10&4294967295|y>>>22),y=S+(f^(E|~g))+M[2]+718787259&4294967295,S=E+(y<<15&4294967295|y>>>17),y=g+(E^(S|~f))+M[9]+3951481745&4294967295,m.g[0]=m.g[0]+f&4294967295,m.g[1]=m.g[1]+(S+(y<<21&4294967295|y>>>11))&4294967295,m.g[2]=m.g[2]+S&4294967295,m.g[3]=m.g[3]+E&4294967295}n.prototype.u=function(m,f){f===void 0&&(f=m.length);for(var g=f-this.blockSize,M=this.B,S=this.h,E=0;E<f;){if(S==0)for(;E<=g;)l(this,m,E),E+=this.blockSize;if(typeof m=="string"){for(;E<f;)if(M[S++]=m.charCodeAt(E++),S==this.blockSize){l(this,M),S=0;break}}else for(;E<f;)if(M[S++]=m[E++],S==this.blockSize){l(this,M),S=0;break}}this.h=S,this.o+=f},n.prototype.v=function(){var m=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);m[0]=128;for(var f=1;f<m.length-8;++f)m[f]=0;var g=8*this.o;for(f=m.length-8;f<m.length;++f)m[f]=g&255,g/=256;for(this.u(m),m=Array(16),f=g=0;4>f;++f)for(var M=0;32>M;M+=8)m[g++]=this.g[f]>>>M&255;return m};function s(m,f){var g=o;return Object.prototype.hasOwnProperty.call(g,m)?g[m]:g[m]=f(m)}function a(m,f){this.h=f;for(var g=[],M=!0,S=m.length-1;0<=S;S--){var E=m[S]|0;M&&E==f||(g[S]=E,M=!1)}this.g=g}var o={};function c(m){return-128<=m&&128>m?s(m,function(f){return new a([f|0],0>f?-1:0)}):new a([m|0],0>m?-1:0)}function d(m){if(isNaN(m)||!isFinite(m))return w;if(0>m)return D(d(-m));for(var f=[],g=1,M=0;m>=g;M++)f[M]=m/g|0,g*=4294967296;return new a(f,0)}function v(m,f){if(m.length==0)throw Error("number format error: empty string");if(f=f||10,2>f||36<f)throw Error("radix out of range: "+f);if(m.charAt(0)=="-")return D(v(m.substring(1),f));if(0<=m.indexOf("-"))throw Error('number format error: interior "-" character');for(var g=d(Math.pow(f,8)),M=w,S=0;S<m.length;S+=8){var E=Math.min(8,m.length-S),y=parseInt(m.substring(S,S+E),f);8>E?(E=d(Math.pow(f,E)),M=M.j(E).add(d(y))):(M=M.j(g),M=M.add(d(y)))}return M}var w=c(0),V=c(1),b=c(16777216);e=a.prototype,e.m=function(){if(N(this))return-D(this).m();for(var m=0,f=1,g=0;g<this.g.length;g++){var M=this.i(g);m+=(0<=M?M:4294967296+M)*f,f*=4294967296}return m},e.toString=function(m){if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(C(this))return"0";if(N(this))return"-"+D(this).toString(m);for(var f=d(Math.pow(m,6)),g=this,M="";;){var S=A(g,f).g;g=Z(g,S.j(f));var E=((0<g.g.length?g.g[0]:g.h)>>>0).toString(m);if(g=S,C(g))return E+M;for(;6>E.length;)E="0"+E;M=E+M}},e.i=function(m){return 0>m?0:m<this.g.length?this.g[m]:this.h};function C(m){if(m.h!=0)return!1;for(var f=0;f<m.g.length;f++)if(m.g[f]!=0)return!1;return!0}function N(m){return m.h==-1}e.l=function(m){return m=Z(this,m),N(m)?-1:C(m)?0:1};function D(m){for(var f=m.g.length,g=[],M=0;M<f;M++)g[M]=~m.g[M];return new a(g,~m.h).add(V)}e.abs=function(){return N(this)?D(this):this},e.add=function(m){for(var f=Math.max(this.g.length,m.g.length),g=[],M=0,S=0;S<=f;S++){var E=M+(this.i(S)&65535)+(m.i(S)&65535),y=(E>>>16)+(this.i(S)>>>16)+(m.i(S)>>>16);M=y>>>16,E&=65535,y&=65535,g[S]=y<<16|E}return new a(g,g[g.length-1]&-2147483648?-1:0)};function Z(m,f){return m.add(D(f))}e.j=function(m){if(C(this)||C(m))return w;if(N(this))return N(m)?D(this).j(D(m)):D(D(this).j(m));if(N(m))return D(this.j(D(m)));if(0>this.l(b)&&0>m.l(b))return d(this.m()*m.m());for(var f=this.g.length+m.g.length,g=[],M=0;M<2*f;M++)g[M]=0;for(M=0;M<this.g.length;M++)for(var S=0;S<m.g.length;S++){var E=this.i(M)>>>16,y=this.i(M)&65535,Wt=m.i(S)>>>16,Ft=m.i(S)&65535;g[2*M+2*S]+=y*Ft,p(g,2*M+2*S),g[2*M+2*S+1]+=E*Ft,p(g,2*M+2*S+1),g[2*M+2*S+1]+=y*Wt,p(g,2*M+2*S+1),g[2*M+2*S+2]+=E*Wt,p(g,2*M+2*S+2)}for(M=0;M<f;M++)g[M]=g[2*M+1]<<16|g[2*M];for(M=f;M<2*f;M++)g[M]=0;return new a(g,0)};function p(m,f){for(;(m[f]&65535)!=m[f];)m[f+1]+=m[f]>>>16,m[f]&=65535,f++}function _(m,f){this.g=m,this.h=f}function A(m,f){if(C(f))throw Error("division by zero");if(C(m))return new _(w,w);if(N(m))return f=A(D(m),f),new _(D(f.g),D(f.h));if(N(f))return f=A(m,D(f)),new _(D(f.g),f.h);if(30<m.g.length){if(N(m)||N(f))throw Error("slowDivide_ only works with positive integers.");for(var g=V,M=f;0>=M.l(m);)g=R(g),M=R(M);var S=I(g,1),E=I(M,1);for(M=I(M,2),g=I(g,2);!C(M);){var y=E.add(M);0>=y.l(m)&&(S=S.add(g),E=y),M=I(M,1),g=I(g,1)}return f=Z(m,S.j(f)),new _(S,f)}for(S=w;0<=m.l(f);){for(g=Math.max(1,Math.floor(m.m()/f.m())),M=Math.ceil(Math.log(g)/Math.LN2),M=48>=M?1:Math.pow(2,M-48),E=d(g),y=E.j(f);N(y)||0<y.l(m);)g-=M,E=d(g),y=E.j(f);C(E)&&(E=V),S=S.add(E),m=Z(m,y)}return new _(S,m)}e.A=function(m){return A(this,m).h},e.and=function(m){for(var f=Math.max(this.g.length,m.g.length),g=[],M=0;M<f;M++)g[M]=this.i(M)&m.i(M);return new a(g,this.h&m.h)},e.or=function(m){for(var f=Math.max(this.g.length,m.g.length),g=[],M=0;M<f;M++)g[M]=this.i(M)|m.i(M);return new a(g,this.h|m.h)},e.xor=function(m){for(var f=Math.max(this.g.length,m.g.length),g=[],M=0;M<f;M++)g[M]=this.i(M)^m.i(M);return new a(g,this.h^m.h)};function R(m){for(var f=m.g.length+1,g=[],M=0;M<f;M++)g[M]=m.i(M)<<1|m.i(M-1)>>>31;return new a(g,m.h)}function I(m,f){var g=f>>5;f%=32;for(var M=m.g.length-g,S=[],E=0;E<M;E++)S[E]=0<f?m.i(E+g)>>>f|m.i(E+g+1)<<32-f:m.i(E+g);return new a(S,m.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=v,J1=a}).apply(typeof gd<"u"?gd:typeof self<"u"?self:typeof window<"u"?window:{});var Ea=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var e,t=typeof Object.defineProperties=="function"?Object.defineProperty:function(r,u,h){return r==Array.prototype||r==Object.prototype||(r[u]=h.value),r};function i(r){r=[typeof globalThis=="object"&&globalThis,r,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ea=="object"&&Ea];for(var u=0;u<r.length;++u){var h=r[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var n=i(this);function l(r,u){if(u)t:{var h=n;r=r.split(".");for(var H=0;H<r.length-1;H++){var T=r[H];if(!(T in h))break t;h=h[T]}r=r[r.length-1],H=h[r],u=u(H),u!=H&&u!=null&&t(h,r,{configurable:!0,writable:!0,value:u})}}function s(r,u){r instanceof String&&(r+="");var h=0,H=!1,T={next:function(){if(!H&&h<r.length){var x=h++;return{value:u(x,r[x]),done:!1}}return H=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}l("Array.prototype.values",function(r){return r||function(){return s(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},o=this||self;function c(r){var u=typeof r;return u=u!="object"?u:r?Array.isArray(r)?"array":u:"null",u=="array"||u=="object"&&typeof r.length=="number"}function d(r){var u=typeof r;return u=="object"&&r!=null||u=="function"}function v(r,u,h){return r.call.apply(r.bind,arguments)}function w(r,u,h){if(!r)throw Error();if(2<arguments.length){var H=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,H),r.apply(u,T)}}return function(){return r.apply(u,arguments)}}function V(r,u,h){return V=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?v:w,V.apply(null,arguments)}function b(r,u){var h=Array.prototype.slice.call(arguments,1);return function(){var H=h.slice();return H.push.apply(H,arguments),r.apply(this,H)}}function C(r,u){function h(){}h.prototype=u.prototype,r.aa=u.prototype,r.prototype=new h,r.prototype.constructor=r,r.Qb=function(H,T,x){for(var B=Array(arguments.length-2),ft=2;ft<arguments.length;ft++)B[ft-2]=arguments[ft];return u.prototype[T].apply(H,B)}}function N(r){const u=r.length;if(0<u){const h=Array(u);for(let H=0;H<u;H++)h[H]=r[H];return h}return[]}function D(r,u){for(let h=1;h<arguments.length;h++){const H=arguments[h];if(c(H)){const T=r.length||0,x=H.length||0;r.length=T+x;for(let B=0;B<x;B++)r[T+B]=H[B]}else r.push(H)}}class Z{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function p(r){return/^[\s\xa0]*$/.test(r)}function _(){var r=o.navigator;return r&&(r=r.userAgent)?r:""}function A(r){return A[" "](r),r}A[" "]=function(){};var R=_().indexOf("Gecko")!=-1&&!(_().toLowerCase().indexOf("webkit")!=-1&&_().indexOf("Edge")==-1)&&!(_().indexOf("Trident")!=-1||_().indexOf("MSIE")!=-1)&&_().indexOf("Edge")==-1;function I(r,u,h){for(const H in r)u.call(h,r[H],H,r)}function m(r,u){for(const h in r)u.call(void 0,r[h],h,r)}function f(r){const u={};for(const h in r)u[h]=r[h];return u}const g="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function M(r,u){let h,H;for(let T=1;T<arguments.length;T++){H=arguments[T];for(h in H)r[h]=H[h];for(let x=0;x<g.length;x++)h=g[x],Object.prototype.hasOwnProperty.call(H,h)&&(r[h]=H[h])}}function S(r){var u=1;r=r.split(":");const h=[];for(;0<u&&r.length;)h.push(r.shift()),u--;return r.length&&h.push(r.join(":")),h}function E(r){o.setTimeout(()=>{throw r},0)}function y(){var r=at;let u=null;return r.g&&(u=r.g,r.g=r.g.next,r.g||(r.h=null),u.next=null),u}class Wt{constructor(){this.h=this.g=null}add(u,h){const H=Ft.get();H.set(u,h),this.h?this.h.next=H:this.g=H,this.h=H}}var Ft=new Z(()=>new L,r=>r.reset());class L{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let j,P=!1,at=new Wt,k=()=>{const r=o.Promise.resolve(void 0);j=()=>{r.then(ui)}};var ui=()=>{for(var r;r=y();){try{r.h.call(r.g)}catch(h){E(h)}var u=Ft;u.j(r),100>u.h&&(u.h++,r.next=u.g,u.g=r)}P=!1};function Kt(){this.s=this.s,this.C=this.C}Kt.prototype.s=!1,Kt.prototype.ma=function(){this.s||(this.s=!0,this.N())},Kt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Zt(r,u){this.type=r,this.g=this.target=u,this.defaultPrevented=!1}Zt.prototype.h=function(){this.defaultPrevented=!0};var Ve=function(){if(!o.addEventListener||!Object.defineProperty)return!1;var r=!1,u=Object.defineProperty({},"passive",{get:function(){r=!0}});try{const h=()=>{};o.addEventListener("test",h,u),o.removeEventListener("test",h,u)}catch{}return r}();function Ht(r,u){if(Zt.call(this,r?r.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,r){var h=this.type=r.type,H=r.changedTouches&&r.changedTouches.length?r.changedTouches[0]:null;if(this.target=r.target||r.srcElement,this.g=u,u=r.relatedTarget){if(R){t:{try{A(u.nodeName);var T=!0;break t}catch{}T=!1}T||(u=null)}}else h=="mouseover"?u=r.fromElement:h=="mouseout"&&(u=r.toElement);this.relatedTarget=u,H?(this.clientX=H.clientX!==void 0?H.clientX:H.pageX,this.clientY=H.clientY!==void 0?H.clientY:H.pageY,this.screenX=H.screenX||0,this.screenY=H.screenY||0):(this.clientX=r.clientX!==void 0?r.clientX:r.pageX,this.clientY=r.clientY!==void 0?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0),this.button=r.button,this.key=r.key||"",this.ctrlKey=r.ctrlKey,this.altKey=r.altKey,this.shiftKey=r.shiftKey,this.metaKey=r.metaKey,this.pointerId=r.pointerId||0,this.pointerType=typeof r.pointerType=="string"?r.pointerType:Ut[r.pointerType]||"",this.state=r.state,this.i=r,r.defaultPrevented&&Ht.aa.h.call(this)}}C(Ht,Zt);var Ut={2:"touch",3:"pen",4:"mouse"};Ht.prototype.h=function(){Ht.aa.h.call(this);var r=this.i;r.preventDefault?r.preventDefault():r.returnValue=!1};var ci="closure_listenable_"+(1e6*Math.random()|0),Fr=0;function At(r,u,h,H,T){this.listener=r,this.proxy=null,this.src=u,this.type=h,this.capture=!!H,this.ha=T,this.key=++Fr,this.da=this.fa=!1}function Cn(r){r.da=!0,r.listener=null,r.proxy=null,r.src=null,r.ha=null}function hi(r){this.src=r,this.g={},this.h=0}hi.prototype.add=function(r,u,h,H,T){var x=r.toString();r=this.g[x],r||(r=this.g[x]=[],this.h++);var B=On(r,u,H,T);return-1<B?(u=r[B],h||(u.fa=!1)):(u=new At(u,this.src,x,!!H,T),u.fa=h,r.push(u)),u};function zi(r,u){var h=u.type;if(h in r.g){var H=r.g[h],T=Array.prototype.indexOf.call(H,u,void 0),x;(x=0<=T)&&Array.prototype.splice.call(H,T,1),x&&(Cn(u),r.g[h].length==0&&(delete r.g[h],r.h--))}}function On(r,u,h,H){for(var T=0;T<r.length;++T){var x=r[T];if(!x.da&&x.listener==u&&x.capture==!!h&&x.ha==H)return T}return-1}var Ui="closure_lm_"+(1e6*Math.random()|0),au={};function sh(r,u,h,H,T){if(Array.isArray(u)){for(var x=0;x<u.length;x++)sh(r,u[x],h,H,T);return null}return h=oh(h),r&&r[ci]?r.K(u,h,d(H)?!!H.capture:!1,T):fp(r,u,h,!1,H,T)}function fp(r,u,h,H,T,x){if(!u)throw Error("Invalid event type");var B=d(T)?!!T.capture:!!T,ft=uu(r);if(ft||(r[Ui]=ft=new hi(r)),h=ft.add(u,h,H,B,x),h.proxy)return h;if(H=dp(),h.proxy=H,H.src=r,H.listener=h,r.addEventListener)Ve||(T=B),T===void 0&&(T=!1),r.addEventListener(u.toString(),H,T);else if(r.attachEvent)r.attachEvent(ah(u.toString()),H);else if(r.addListener&&r.removeListener)r.addListener(H);else throw Error("addEventListener and attachEvent are unavailable.");return h}function dp(){function r(h){return u.call(r.src,r.listener,h)}const u=Hp;return r}function rh(r,u,h,H,T){if(Array.isArray(u))for(var x=0;x<u.length;x++)rh(r,u[x],h,H,T);else H=d(H)?!!H.capture:!!H,h=oh(h),r&&r[ci]?(r=r.i,u=String(u).toString(),u in r.g&&(x=r.g[u],h=On(x,h,H,T),-1<h&&(Cn(x[h]),Array.prototype.splice.call(x,h,1),x.length==0&&(delete r.g[u],r.h--)))):r&&(r=uu(r))&&(u=r.g[u.toString()],r=-1,u&&(r=On(u,h,H,T)),(h=-1<r?u[r]:null)&&ou(h))}function ou(r){if(typeof r!="number"&&r&&!r.da){var u=r.src;if(u&&u[ci])zi(u.i,r);else{var h=r.type,H=r.proxy;u.removeEventListener?u.removeEventListener(h,H,r.capture):u.detachEvent?u.detachEvent(ah(h),H):u.addListener&&u.removeListener&&u.removeListener(H),(h=uu(u))?(zi(h,r),h.h==0&&(h.src=null,u[Ui]=null)):Cn(r)}}}function ah(r){return r in au?au[r]:au[r]="on"+r}function Hp(r,u){if(r.da)r=!0;else{u=new Ht(u,this);var h=r.listener,H=r.ha||r.src;r.fa&&ou(r),r=h.call(H,u)}return r}function uu(r){return r=r[Ui],r instanceof hi?r:null}var cu="__closure_events_fn_"+(1e9*Math.random()>>>0);function oh(r){return typeof r=="function"?r:(r[cu]||(r[cu]=function(u){return r.handleEvent(u)}),r[cu])}function Qt(){Kt.call(this),this.i=new hi(this),this.M=this,this.F=null}C(Qt,Kt),Qt.prototype[ci]=!0,Qt.prototype.removeEventListener=function(r,u,h,H){rh(this,r,u,h,H)};function te(r,u){var h,H=r.F;if(H)for(h=[];H;H=H.F)h.push(H);if(r=r.M,H=u.type||u,typeof u=="string")u=new Zt(u,r);else if(u instanceof Zt)u.target=u.target||r;else{var T=u;u=new Zt(H,r),M(u,T)}if(T=!0,h)for(var x=h.length-1;0<=x;x--){var B=u.g=h[x];T=Kr(B,H,!0,u)&&T}if(B=u.g=r,T=Kr(B,H,!0,u)&&T,T=Kr(B,H,!1,u)&&T,h)for(x=0;x<h.length;x++)B=u.g=h[x],T=Kr(B,H,!1,u)&&T}Qt.prototype.N=function(){if(Qt.aa.N.call(this),this.i){var r=this.i,u;for(u in r.g){for(var h=r.g[u],H=0;H<h.length;H++)Cn(h[H]);delete r.g[u],r.h--}}this.F=null},Qt.prototype.K=function(r,u,h,H){return this.i.add(String(r),u,!1,h,H)},Qt.prototype.L=function(r,u,h,H){return this.i.add(String(r),u,!0,h,H)};function Kr(r,u,h,H){if(u=r.i.g[String(u)],!u)return!0;u=u.concat();for(var T=!0,x=0;x<u.length;++x){var B=u[x];if(B&&!B.da&&B.capture==h){var ft=B.listener,jt=B.ha||B.src;B.fa&&zi(r.i,B),T=ft.call(jt,H)!==!1&&T}}return T&&!H.defaultPrevented}function uh(r,u,h){if(typeof r=="function")h&&(r=V(r,h));else if(r&&typeof r.handleEvent=="function")r=V(r.handleEvent,r);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:o.setTimeout(r,u||0)}function ch(r){r.g=uh(()=>{r.g=null,r.i&&(r.i=!1,ch(r))},r.l);const u=r.h;r.h=null,r.m.apply(null,u)}class Vp extends Kt{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ch(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ms(r){Kt.call(this),this.h=r,this.g={}}C(ms,Kt);var hh=[];function fh(r){I(r.g,function(u,h){this.g.hasOwnProperty(h)&&ou(u)},r),r.g={}}ms.prototype.N=function(){ms.aa.N.call(this),fh(this)},ms.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var hu=o.JSON.stringify,gp=o.JSON.parse,pp=class{stringify(r){return o.JSON.stringify(r,void 0)}parse(r){return o.JSON.parse(r,void 0)}};function fu(){}fu.prototype.h=null;function dh(r){return r.h||(r.h=r.i())}function mp(){}var vs={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function du(){Zt.call(this,"d")}C(du,Zt);function Hu(){Zt.call(this,"c")}C(Hu,Zt);var Hl={},Hh=null;function Vu(){return Hh=Hh||new Qt}Hl.La="serverreachability";function Vh(r){Zt.call(this,Hl.La,r)}C(Vh,Zt);function Ms(r){const u=Vu();te(u,new Vh(u))}Hl.STAT_EVENT="statevent";function gh(r,u){Zt.call(this,Hl.STAT_EVENT,r),this.stat=u}C(gh,Zt);function ee(r){const u=Vu();te(u,new gh(u,r))}Hl.Ma="timingevent";function ph(r,u){Zt.call(this,Hl.Ma,r),this.size=u}C(ph,Zt);function ys(r,u){if(typeof r!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){r()},u)}function ws(){this.g=!0}ws.prototype.xa=function(){this.g=!1};function vp(r,u,h,H,T,x){r.info(function(){if(r.g)if(x)for(var B="",ft=x.split("&"),jt=0;jt<ft.length;jt++){var nt=ft[jt].split("=");if(1<nt.length){var Jt=nt[0];nt=nt[1];var $t=Jt.split("_");B=2<=$t.length&&$t[1]=="type"?B+(Jt+"="+nt+"&"):B+(Jt+"=redacted&")}}else B=null;else B=x;return"XMLHTTP REQ ("+H+") [attempt "+T+"]: "+u+`
`+h+`
`+B})}function Mp(r,u,h,H,T,x,B){r.info(function(){return"XMLHTTP RESP ("+H+") [ attempt "+T+"]: "+u+`
`+h+`
`+x+" "+B})}function Vl(r,u,h,H){r.info(function(){return"XMLHTTP TEXT ("+u+"): "+wp(r,h)+(H?" "+H:"")})}function yp(r,u){r.info(function(){return"TIMEOUT: "+u})}ws.prototype.info=function(){};function wp(r,u){if(!r.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(r=0;r<h.length;r++)if(Array.isArray(h[r])){var H=h[r];if(!(2>H.length)){var T=H[1];if(Array.isArray(T)&&!(1>T.length)){var x=T[0];if(x!="noop"&&x!="stop"&&x!="close")for(var B=1;B<T.length;B++)T[B]=""}}}}return hu(h)}catch{return u}}var gu={NO_ERROR:0,TIMEOUT:8},Zp={},pu;function Qr(){}C(Qr,fu),Qr.prototype.g=function(){return new XMLHttpRequest},Qr.prototype.i=function(){return{}},pu=new Qr;function ji(r,u,h,H){this.j=r,this.i=u,this.l=h,this.R=H||1,this.U=new ms(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new mh}function mh(){this.i=null,this.g="",this.h=!1}var vh={},mu={};function vu(r,u,h){r.L=1,r.v=ta(fi(u)),r.m=h,r.P=!0,Mh(r,null)}function Mh(r,u){r.F=Date.now(),Jr(r),r.A=fi(r.v);var h=r.A,H=r.R;Array.isArray(H)||(H=[String(H)]),Rh(h.i,"t",H),r.C=0,h=r.j.J,r.h=new mh,r.g=$h(r.j,h?u:null,!r.m),0<r.O&&(r.M=new Vp(V(r.Y,r,r.g),r.O)),u=r.U,h=r.g,H=r.ca;var T="readystatechange";Array.isArray(T)||(T&&(hh[0]=T.toString()),T=hh);for(var x=0;x<T.length;x++){var B=sh(h,T[x],H||u.handleEvent,!1,u.h||u);if(!B)break;u.g[B.key]=B}u=r.H?f(r.H):{},r.m?(r.u||(r.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",r.g.ea(r.A,r.u,r.m,u)):(r.u="GET",r.g.ea(r.A,r.u,null,u)),Ms(),vp(r.i,r.u,r.A,r.l,r.R,r.m)}ji.prototype.ca=function(r){r=r.target;const u=this.M;u&&di(r)==3?u.j():this.Y(r)},ji.prototype.Y=function(r){try{if(r==this.g)t:{const $t=di(this.g);var u=this.g.Ba();const ml=this.g.Z();if(!(3>$t)&&($t!=3||this.g&&(this.h.h||this.g.oa()||Uh(this.g)))){this.J||$t!=4||u==7||(u==8||0>=ml?Ms(3):Ms(2)),Mu(this);var h=this.g.Z();this.X=h;e:if(yh(this)){var H=Uh(this.g);r="";var T=H.length,x=di(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Nn(this),Zs(this);var B="";break e}this.h.i=new o.TextDecoder}for(u=0;u<T;u++)this.h.h=!0,r+=this.h.i.decode(H[u],{stream:!(x&&u==T-1)});H.length=0,this.h.g+=r,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=h==200,Mp(this.i,this.u,this.A,this.l,this.R,$t,h),this.o){if(this.T&&!this.K){e:{if(this.g){var ft,jt=this.g;if((ft=jt.g?jt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(ft)){var nt=ft;break e}}nt=null}if(h=nt)Vl(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,yu(this,h);else{this.o=!1,this.s=3,ee(12),Nn(this),Zs(this);break t}}if(this.P){h=!0;let Ie;for(;!this.J&&this.C<B.length;)if(Ie=_p(this,B),Ie==mu){$t==4&&(this.s=4,ee(14),h=!1),Vl(this.i,this.l,null,"[Incomplete Response]");break}else if(Ie==vh){this.s=4,ee(15),Vl(this.i,this.l,B,"[Invalid Chunk]"),h=!1;break}else Vl(this.i,this.l,Ie,null),yu(this,Ie);if(yh(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),$t!=4||B.length!=0||this.h.h||(this.s=1,ee(16),h=!1),this.o=this.o&&h,!h)Vl(this.i,this.l,B,"[Invalid Chunked Response]"),Nn(this),Zs(this);else if(0<B.length&&!this.W){this.W=!0;var Jt=this.j;Jt.g==this&&Jt.ba&&!Jt.M&&(Jt.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),Eu(Jt),Jt.M=!0,ee(11))}}else Vl(this.i,this.l,B,null),yu(this,B);$t==4&&Nn(this),this.o&&!this.J&&($t==4?Fh(this.j,this):(this.o=!1,Jr(this)))}else Up(this.g),h==400&&0<B.indexOf("Unknown SID")?(this.s=3,ee(12)):(this.s=0,ee(13)),Nn(this),Zs(this)}}}catch{}finally{}};function yh(r){return r.g?r.u=="GET"&&r.L!=2&&r.j.Ca:!1}function _p(r,u){var h=r.C,H=u.indexOf(`
`,h);return H==-1?mu:(h=Number(u.substring(h,H)),isNaN(h)?vh:(H+=1,H+h>u.length?mu:(u=u.slice(H,H+h),r.C=H+h,u)))}ji.prototype.cancel=function(){this.J=!0,Nn(this)};function Jr(r){r.S=Date.now()+r.I,wh(r,r.I)}function wh(r,u){if(r.B!=null)throw Error("WatchDog timer not null");r.B=ys(V(r.ba,r),u)}function Mu(r){r.B&&(o.clearTimeout(r.B),r.B=null)}ji.prototype.ba=function(){this.B=null;const r=Date.now();0<=r-this.S?(yp(this.i,this.A),this.L!=2&&(Ms(),ee(17)),Nn(this),this.s=2,Zs(this)):wh(this,this.S-r)};function Zs(r){r.j.G==0||r.J||Fh(r.j,r)}function Nn(r){Mu(r);var u=r.M;u&&typeof u.ma=="function"&&u.ma(),r.M=null,fh(r.U),r.g&&(u=r.g,r.g=null,u.abort(),u.ma())}function yu(r,u){try{var h=r.j;if(h.G!=0&&(h.g==r||wu(h.h,r))){if(!r.K&&wu(h.h,r)&&h.G==3){try{var H=h.Da.g.parse(u)}catch{H=null}if(Array.isArray(H)&&H.length==3){var T=H;if(T[0]==0){t:if(!h.u){if(h.g)if(h.g.F+3e3<r.F)ra(h),la(h);else break t;Su(h),ee(18)}}else h.za=T[1],0<h.za-h.T&&37500>T[2]&&h.F&&h.v==0&&!h.C&&(h.C=ys(V(h.Za,h),6e3));if(1>=bh(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Bn(h,11)}else if((r.K||h.g==r)&&ra(h),!p(u))for(T=h.Da.g.parse(u),u=0;u<T.length;u++){let nt=T[u];if(h.T=nt[0],nt=nt[1],h.G==2)if(nt[0]=="c"){h.K=nt[1],h.ia=nt[2];const Jt=nt[3];Jt!=null&&(h.la=Jt,h.j.info("VER="+h.la));const $t=nt[4];$t!=null&&(h.Aa=$t,h.j.info("SVER="+h.Aa));const ml=nt[5];ml!=null&&typeof ml=="number"&&0<ml&&(H=1.5*ml,h.L=H,h.j.info("backChannelRequestTimeoutMs_="+H)),H=h;const Ie=r.g;if(Ie){const aa=Ie.g?Ie.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(aa){var x=H.h;x.g||aa.indexOf("spdy")==-1&&aa.indexOf("quic")==-1&&aa.indexOf("h2")==-1||(x.j=x.l,x.g=new Set,x.h&&(Zu(x,x.h),x.h=null))}if(H.D){const Tu=Ie.g?Ie.g.getResponseHeader("X-HTTP-Session-Id"):null;Tu&&(H.ya=Tu,pt(H.I,H.D,Tu))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-r.F,h.j.info("Handshake RTT: "+h.R+"ms")),H=h;var B=r;if(H.qa=Jh(H,H.J?H.ia:null,H.W),B.K){Sh(H.h,B);var ft=B,jt=H.L;jt&&(ft.I=jt),ft.B&&(Mu(ft),Jr(ft)),H.g=B}else Yh(H);0<h.i.length&&sa(h)}else nt[0]!="stop"&&nt[0]!="close"||Bn(h,7);else h.G==3&&(nt[0]=="stop"||nt[0]=="close"?nt[0]=="stop"?Bn(h,7):bu(h):nt[0]!="noop"&&h.l&&h.l.ta(nt),h.v=0)}}Ms(4)}catch{}}var bp=class{constructor(r,u){this.g=r,this.map=u}};function Zh(r){this.l=r||10,o.PerformanceNavigationTiming?(r=o.performance.getEntriesByType("navigation"),r=0<r.length&&(r[0].nextHopProtocol=="hq"||r[0].nextHopProtocol=="h2")):r=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=r?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function _h(r){return r.h?!0:r.g?r.g.size>=r.j:!1}function bh(r){return r.h?1:r.g?r.g.size:0}function wu(r,u){return r.h?r.h==u:r.g?r.g.has(u):!1}function Zu(r,u){r.g?r.g.add(u):r.h=u}function Sh(r,u){r.h&&r.h==u?r.h=null:r.g&&r.g.has(u)&&r.g.delete(u)}Zh.prototype.cancel=function(){if(this.i=Eh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const r of this.g.values())r.cancel();this.g.clear()}};function Eh(r){if(r.h!=null)return r.i.concat(r.h.D);if(r.g!=null&&r.g.size!==0){let u=r.i;for(const h of r.g.values())u=u.concat(h.D);return u}return N(r.i)}function Sp(r){if(r.V&&typeof r.V=="function")return r.V();if(typeof Map<"u"&&r instanceof Map||typeof Set<"u"&&r instanceof Set)return Array.from(r.values());if(typeof r=="string")return r.split("");if(c(r)){for(var u=[],h=r.length,H=0;H<h;H++)u.push(r[H]);return u}u=[],h=0;for(H in r)u[h++]=r[H];return u}function Ep(r){if(r.na&&typeof r.na=="function")return r.na();if(!r.V||typeof r.V!="function"){if(typeof Map<"u"&&r instanceof Map)return Array.from(r.keys());if(!(typeof Set<"u"&&r instanceof Set)){if(c(r)||typeof r=="string"){var u=[];r=r.length;for(var h=0;h<r;h++)u.push(h);return u}u=[],h=0;for(const H in r)u[h++]=H;return u}}}function Th(r,u){if(r.forEach&&typeof r.forEach=="function")r.forEach(u,void 0);else if(c(r)||typeof r=="string")Array.prototype.forEach.call(r,u,void 0);else for(var h=Ep(r),H=Sp(r),T=H.length,x=0;x<T;x++)u.call(void 0,H[x],h&&h[x],r)}var Ah=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Tp(r,u){if(r){r=r.split("&");for(var h=0;h<r.length;h++){var H=r[h].indexOf("="),T=null;if(0<=H){var x=r[h].substring(0,H);T=r[h].substring(H+1)}else x=r[h];u(x,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function Rn(r){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,r instanceof Rn){this.h=r.h,$r(this,r.j),this.o=r.o,this.g=r.g,Wr(this,r.s),this.l=r.l;var u=r.i,h=new Ss;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),xh(this,h),this.m=r.m}else r&&(u=String(r).match(Ah))?(this.h=!1,$r(this,u[1]||"",!0),this.o=_s(u[2]||""),this.g=_s(u[3]||"",!0),Wr(this,u[4]),this.l=_s(u[5]||"",!0),xh(this,u[6]||"",!0),this.m=_s(u[7]||"")):(this.h=!1,this.i=new Ss(null,this.h))}Rn.prototype.toString=function(){var r=[],u=this.j;u&&r.push(bs(u,Ch,!0),":");var h=this.g;return(h||u=="file")&&(r.push("//"),(u=this.o)&&r.push(bs(u,Ch,!0),"@"),r.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&r.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&r.push("/"),r.push(bs(h,h.charAt(0)=="/"?Cp:xp,!0))),(h=this.i.toString())&&r.push("?",h),(h=this.m)&&r.push("#",bs(h,Np)),r.join("")};function fi(r){return new Rn(r)}function $r(r,u,h){r.j=h?_s(u,!0):u,r.j&&(r.j=r.j.replace(/:$/,""))}function Wr(r,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);r.s=u}else r.s=null}function xh(r,u,h){u instanceof Ss?(r.i=u,Rp(r.i,r.h)):(h||(u=bs(u,Op)),r.i=new Ss(u,r.h))}function pt(r,u,h){r.i.set(u,h)}function ta(r){return pt(r,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),r}function _s(r,u){return r?u?decodeURI(r.replace(/%25/g,"%2525")):decodeURIComponent(r):""}function bs(r,u,h){return typeof r=="string"?(r=encodeURI(r).replace(u,Ap),h&&(r=r.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),r):null}function Ap(r){return r=r.charCodeAt(0),"%"+(r>>4&15).toString(16)+(r&15).toString(16)}var Ch=/[#\/\?@]/g,xp=/[#\?:]/g,Cp=/[#\?]/g,Op=/[#\?@]/g,Np=/#/g;function Ss(r,u){this.h=this.g=null,this.i=r||null,this.j=!!u}function Pi(r){r.g||(r.g=new Map,r.h=0,r.i&&Tp(r.i,function(u,h){r.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}e=Ss.prototype,e.add=function(r,u){Pi(this),this.i=null,r=gl(this,r);var h=this.g.get(r);return h||this.g.set(r,h=[]),h.push(u),this.h+=1,this};function Oh(r,u){Pi(r),u=gl(r,u),r.g.has(u)&&(r.i=null,r.h-=r.g.get(u).length,r.g.delete(u))}function Nh(r,u){return Pi(r),u=gl(r,u),r.g.has(u)}e.forEach=function(r,u){Pi(this),this.g.forEach(function(h,H){h.forEach(function(T){r.call(u,T,H,this)},this)},this)},e.na=function(){Pi(this);const r=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let H=0;H<u.length;H++){const T=r[H];for(let x=0;x<T.length;x++)h.push(u[H])}return h},e.V=function(r){Pi(this);let u=[];if(typeof r=="string")Nh(this,r)&&(u=u.concat(this.g.get(gl(this,r))));else{r=Array.from(this.g.values());for(let h=0;h<r.length;h++)u=u.concat(r[h])}return u},e.set=function(r,u){return Pi(this),this.i=null,r=gl(this,r),Nh(this,r)&&(this.h-=this.g.get(r).length),this.g.set(r,[u]),this.h+=1,this},e.get=function(r,u){return r?(r=this.V(r),0<r.length?String(r[0]):u):u};function Rh(r,u,h){Oh(r,u),0<h.length&&(r.i=null,r.g.set(gl(r,u),N(h)),r.h+=h.length)}e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const r=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var H=u[h];const x=encodeURIComponent(String(H)),B=this.V(H);for(H=0;H<B.length;H++){var T=x;B[H]!==""&&(T+="="+encodeURIComponent(String(B[H]))),r.push(T)}}return this.i=r.join("&")};function gl(r,u){return u=String(u),r.j&&(u=u.toLowerCase()),u}function Rp(r,u){u&&!r.j&&(Pi(r),r.i=null,r.g.forEach(function(h,H){var T=H.toLowerCase();H!=T&&(Oh(this,H),Rh(this,T,h))},r)),r.j=u}function Bp(r,u){const h=new ws;if(o.Image){const H=new Image;H.onload=b(Gi,h,"TestLoadImage: loaded",!0,u,H),H.onerror=b(Gi,h,"TestLoadImage: error",!1,u,H),H.onabort=b(Gi,h,"TestLoadImage: abort",!1,u,H),H.ontimeout=b(Gi,h,"TestLoadImage: timeout",!1,u,H),o.setTimeout(function(){H.ontimeout&&H.ontimeout()},1e4),H.src=r}else u(!1)}function Dp(r,u){const h=new ws,H=new AbortController,T=setTimeout(()=>{H.abort(),Gi(h,"TestPingServer: timeout",!1,u)},1e4);fetch(r,{signal:H.signal}).then(x=>{clearTimeout(T),x.ok?Gi(h,"TestPingServer: ok",!0,u):Gi(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(T),Gi(h,"TestPingServer: error",!1,u)})}function Gi(r,u,h,H,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),H(h)}catch{}}function Lp(){this.g=new pp}function kp(r,u,h){const H=h||"";try{Th(r,function(T,x){let B=T;d(T)&&(B=hu(T)),u.push(H+x+"="+encodeURIComponent(B))})}catch(T){throw u.push(H+"type="+encodeURIComponent("_badmap")),T}}function ea(r){this.l=r.Ub||null,this.j=r.eb||!1}C(ea,fu),ea.prototype.g=function(){return new ia(this.l,this.j)},ea.prototype.i=function(r){return function(){return r}}({});function ia(r,u){Qt.call(this),this.D=r,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(ia,Qt),e=ia.prototype,e.open=function(r,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=r,this.A=u,this.readyState=1,Ts(this)},e.send=function(r){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};r&&(u.body=r),(this.D||o).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Es(this)),this.readyState=0},e.Sa=function(r){if(this.g&&(this.l=r,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=r.headers,this.readyState=2,Ts(this)),this.g&&(this.readyState=3,Ts(this),this.g)))if(this.responseType==="arraybuffer")r.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in r){if(this.j=r.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Bh(this)}else r.text().then(this.Ra.bind(this),this.ga.bind(this))};function Bh(r){r.j.read().then(r.Pa.bind(r)).catch(r.ga.bind(r))}e.Pa=function(r){if(this.g){if(this.o&&r.value)this.response.push(r.value);else if(!this.o){var u=r.value?r.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!r.done}))&&(this.response=this.responseText+=u)}r.done?Es(this):Ts(this),this.readyState==3&&Bh(this)}},e.Ra=function(r){this.g&&(this.response=this.responseText=r,Es(this))},e.Qa=function(r){this.g&&(this.response=r,Es(this))},e.ga=function(){this.g&&Es(this)};function Es(r){r.readyState=4,r.l=null,r.j=null,r.v=null,Ts(r)}e.setRequestHeader=function(r,u){this.u.append(r,u)},e.getResponseHeader=function(r){return this.h&&this.h.get(r.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const r=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,r.push(h[0]+": "+h[1]),h=u.next();return r.join(`\r
`)};function Ts(r){r.onreadystatechange&&r.onreadystatechange.call(r)}Object.defineProperty(ia.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(r){this.m=r?"include":"same-origin"}});function Dh(r){let u="";return I(r,function(h,H){u+=H,u+=":",u+=h,u+=`\r
`}),u}function _u(r,u,h){t:{for(H in h){var H=!1;break t}H=!0}H||(h=Dh(h),typeof r=="string"?h!=null&&encodeURIComponent(String(h)):pt(r,u,h))}function St(r){Qt.call(this),this.headers=new Map,this.o=r||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(St,Qt);var Ip=/^https?$/i,zp=["POST","PUT"];e=St.prototype,e.Ha=function(r){this.J=r},e.ea=function(r,u,h,H){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+r);u=u?u.toUpperCase():"GET",this.D=r,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():pu.g(),this.v=this.o?dh(this.o):dh(pu),this.g.onreadystatechange=V(this.Ea,this);try{this.B=!0,this.g.open(u,String(r),!0),this.B=!1}catch(x){Lh(this,x);return}if(r=h||"",h=new Map(this.headers),H)if(Object.getPrototypeOf(H)===Object.prototype)for(var T in H)h.set(T,H[T]);else if(typeof H.keys=="function"&&typeof H.get=="function")for(const x of H.keys())h.set(x,H.get(x));else throw Error("Unknown input type for opt_headers: "+String(H));H=Array.from(h.keys()).find(x=>x.toLowerCase()=="content-type"),T=o.FormData&&r instanceof o.FormData,!(0<=Array.prototype.indexOf.call(zp,u,void 0))||H||T||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[x,B]of h)this.g.setRequestHeader(x,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{zh(this),this.u=!0,this.g.send(r),this.u=!1}catch(x){Lh(this,x)}};function Lh(r,u){r.h=!1,r.g&&(r.j=!0,r.g.abort(),r.j=!1),r.l=u,r.m=5,kh(r),na(r)}function kh(r){r.A||(r.A=!0,te(r,"complete"),te(r,"error"))}e.abort=function(r){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=r||7,te(this,"complete"),te(this,"abort"),na(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),na(this,!0)),St.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?Ih(this):this.bb())},e.bb=function(){Ih(this)};function Ih(r){if(r.h&&typeof a<"u"&&(!r.v[1]||di(r)!=4||r.Z()!=2)){if(r.u&&di(r)==4)uh(r.Ea,0,r);else if(te(r,"readystatechange"),di(r)==4){r.h=!1;try{const B=r.Z();t:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break t;default:u=!1}var h;if(!(h=u)){var H;if(H=B===0){var T=String(r.D).match(Ah)[1]||null;!T&&o.self&&o.self.location&&(T=o.self.location.protocol.slice(0,-1)),H=!Ip.test(T?T.toLowerCase():"")}h=H}if(h)te(r,"complete"),te(r,"success");else{r.m=6;try{var x=2<di(r)?r.g.statusText:""}catch{x=""}r.l=x+" ["+r.Z()+"]",kh(r)}}finally{na(r)}}}}function na(r,u){if(r.g){zh(r);const h=r.g,H=r.v[0]?()=>{}:null;r.g=null,r.v=null,u||te(r,"ready");try{h.onreadystatechange=H}catch{}}}function zh(r){r.I&&(o.clearTimeout(r.I),r.I=null)}e.isActive=function(){return!!this.g};function di(r){return r.g?r.g.readyState:0}e.Z=function(){try{return 2<di(this)?this.g.status:-1}catch{return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},e.Oa=function(r){if(this.g){var u=this.g.responseText;return r&&u.indexOf(r)==0&&(u=u.substring(r.length)),gp(u)}};function Uh(r){try{if(!r.g)return null;if("response"in r.g)return r.g.response;switch(r.H){case"":case"text":return r.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in r.g)return r.g.mozResponseArrayBuffer}return null}catch{return null}}function Up(r){const u={};r=(r.g&&2<=di(r)&&r.g.getAllResponseHeaders()||"").split(`\r
`);for(let H=0;H<r.length;H++){if(p(r[H]))continue;var h=S(r[H]);const T=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const x=u[T]||[];u[T]=x,x.push(h)}m(u,function(H){return H.join(", ")})}e.Ba=function(){return this.m},e.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function As(r,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[r]||u}function jh(r){this.Aa=0,this.i=[],this.j=new ws,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=As("failFast",!1,r),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=As("baseRetryDelayMs",5e3,r),this.cb=As("retryDelaySeedMs",1e4,r),this.Wa=As("forwardChannelMaxRetries",2,r),this.wa=As("forwardChannelRequestTimeoutMs",2e4,r),this.pa=r&&r.xmlHttpFactory||void 0,this.Xa=r&&r.Tb||void 0,this.Ca=r&&r.useFetchStreams||!1,this.L=void 0,this.J=r&&r.supportsCrossDomainXhr||!1,this.K="",this.h=new Zh(r&&r.concurrentRequestLimit),this.Da=new Lp,this.P=r&&r.fastHandshake||!1,this.O=r&&r.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=r&&r.Rb||!1,r&&r.xa&&this.j.xa(),r&&r.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&r&&r.detectBufferingProxy||!1,this.ja=void 0,r&&r.longPollingTimeout&&0<r.longPollingTimeout&&(this.ja=r.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}e=jh.prototype,e.la=8,e.G=1,e.connect=function(r,u,h,H){ee(0),this.W=r,this.H=u||{},h&&H!==void 0&&(this.H.OSID=h,this.H.OAID=H),this.F=this.X,this.I=Jh(this,null,this.W),sa(this)};function bu(r){if(Ph(r),r.G==3){var u=r.U++,h=fi(r.I);if(pt(h,"SID",r.K),pt(h,"RID",u),pt(h,"TYPE","terminate"),xs(r,h),u=new ji(r,r.j,u),u.L=2,u.v=ta(fi(h)),h=!1,o.navigator&&o.navigator.sendBeacon)try{h=o.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&o.Image&&(new Image().src=u.v,h=!0),h||(u.g=$h(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Jr(u)}Qh(r)}function la(r){r.g&&(Eu(r),r.g.cancel(),r.g=null)}function Ph(r){la(r),r.u&&(o.clearTimeout(r.u),r.u=null),ra(r),r.h.cancel(),r.s&&(typeof r.s=="number"&&o.clearTimeout(r.s),r.s=null)}function sa(r){if(!_h(r.h)&&!r.s){r.s=!0;var u=r.Ga;j||k(),P||(j(),P=!0),at.add(u,r),r.B=0}}function jp(r,u){return bh(r.h)>=r.h.j-(r.s?1:0)?!1:r.s?(r.i=u.D.concat(r.i),!0):r.G==1||r.G==2||r.B>=(r.Va?0:r.Wa)?!1:(r.s=ys(V(r.Ga,r,u),Kh(r,r.B)),r.B++,!0)}e.Ga=function(r){if(this.s)if(this.s=null,this.G==1){if(!r){this.U=Math.floor(1e5*Math.random()),r=this.U++;const T=new ji(this,this.j,r);let x=this.o;if(this.S&&(x?(x=f(x),M(x,this.S)):x=this.S),this.m!==null||this.O||(T.H=x,x=null),this.P)t:{for(var u=0,h=0;h<this.i.length;h++){e:{var H=this.i[h];if("__data__"in H.map&&(H=H.map.__data__,typeof H=="string")){H=H.length;break e}H=void 0}if(H===void 0)break;if(u+=H,4096<u){u=h;break t}if(u===4096||h===this.i.length-1){u=h+1;break t}}u=1e3}else u=1e3;u=qh(this,T,u),h=fi(this.I),pt(h,"RID",r),pt(h,"CVER",22),this.D&&pt(h,"X-HTTP-Session-Id",this.D),xs(this,h),x&&(this.O?u="headers="+encodeURIComponent(String(Dh(x)))+"&"+u:this.m&&_u(h,this.m,x)),Zu(this.h,T),this.Ua&&pt(h,"TYPE","init"),this.P?(pt(h,"$req",u),pt(h,"SID","null"),T.T=!0,vu(T,h,null)):vu(T,h,u),this.G=2}}else this.G==3&&(r?Gh(this,r):this.i.length==0||_h(this.h)||Gh(this))};function Gh(r,u){var h;u?h=u.l:h=r.U++;const H=fi(r.I);pt(H,"SID",r.K),pt(H,"RID",h),pt(H,"AID",r.T),xs(r,H),r.m&&r.o&&_u(H,r.m,r.o),h=new ji(r,r.j,h,r.B+1),r.m===null&&(h.H=r.o),u&&(r.i=u.D.concat(r.i)),u=qh(r,h,1e3),h.I=Math.round(.5*r.wa)+Math.round(.5*r.wa*Math.random()),Zu(r.h,h),vu(h,H,u)}function xs(r,u){r.H&&I(r.H,function(h,H){pt(u,H,h)}),r.l&&Th({},function(h,H){pt(u,H,h)})}function qh(r,u,h){h=Math.min(r.i.length,h);var H=r.l?V(r.l.Na,r.l,r):null;t:{var T=r.i;let x=-1;for(;;){const B=["count="+h];x==-1?0<h?(x=T[0].g,B.push("ofs="+x)):x=0:B.push("ofs="+x);let ft=!0;for(let jt=0;jt<h;jt++){let nt=T[jt].g;const Jt=T[jt].map;if(nt-=x,0>nt)x=Math.max(0,T[jt].g-100),ft=!1;else try{kp(Jt,B,"req"+nt+"_")}catch{H&&H(Jt)}}if(ft){H=B.join("&");break t}}}return r=r.i.splice(0,h),u.D=r,H}function Yh(r){if(!r.g&&!r.u){r.Y=1;var u=r.Fa;j||k(),P||(j(),P=!0),at.add(u,r),r.v=0}}function Su(r){return r.g||r.u||3<=r.v?!1:(r.Y++,r.u=ys(V(r.Fa,r),Kh(r,r.v)),r.v++,!0)}e.Fa=function(){if(this.u=null,Xh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var r=2*this.R;this.j.info("BP detection timer enabled: "+r),this.A=ys(V(this.ab,this),r)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ee(10),la(this),Xh(this))};function Eu(r){r.A!=null&&(o.clearTimeout(r.A),r.A=null)}function Xh(r){r.g=new ji(r,r.j,"rpc",r.Y),r.m===null&&(r.g.H=r.o),r.g.O=0;var u=fi(r.qa);pt(u,"RID","rpc"),pt(u,"SID",r.K),pt(u,"AID",r.T),pt(u,"CI",r.F?"0":"1"),!r.F&&r.ja&&pt(u,"TO",r.ja),pt(u,"TYPE","xmlhttp"),xs(r,u),r.m&&r.o&&_u(u,r.m,r.o),r.L&&(r.g.I=r.L);var h=r.g;r=r.ia,h.L=1,h.v=ta(fi(u)),h.m=null,h.P=!0,Mh(h,r)}e.Za=function(){this.C!=null&&(this.C=null,la(this),Su(this),ee(19))};function ra(r){r.C!=null&&(o.clearTimeout(r.C),r.C=null)}function Fh(r,u){var h=null;if(r.g==u){ra(r),Eu(r),r.g=null;var H=2}else if(wu(r.h,u))h=u.D,Sh(r.h,u),H=1;else return;if(r.G!=0){if(u.o)if(H==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var T=r.B;H=Vu(),te(H,new ph(H,h)),sa(r)}else Yh(r);else if(T=u.s,T==3||T==0&&0<u.X||!(H==1&&jp(r,u)||H==2&&Su(r)))switch(h&&0<h.length&&(u=r.h,u.i=u.i.concat(h)),T){case 1:Bn(r,5);break;case 4:Bn(r,10);break;case 3:Bn(r,6);break;default:Bn(r,2)}}}function Kh(r,u){let h=r.Ta+Math.floor(Math.random()*r.cb);return r.isActive()||(h*=2),h*u}function Bn(r,u){if(r.j.info("Error code "+u),u==2){var h=V(r.fb,r),H=r.Xa;const T=!H;H=new Rn(H||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||$r(H,"https"),ta(H),T?Bp(H.toString(),h):Dp(H.toString(),h)}else ee(2);r.G=0,r.l&&r.l.sa(u),Qh(r),Ph(r)}e.fb=function(r){r?(this.j.info("Successfully pinged google.com"),ee(2)):(this.j.info("Failed to ping google.com"),ee(1))};function Qh(r){if(r.G=0,r.ka=[],r.l){const u=Eh(r.h);(u.length!=0||r.i.length!=0)&&(D(r.ka,u),D(r.ka,r.i),r.h.i.length=0,N(r.i),r.i.length=0),r.l.ra()}}function Jh(r,u,h){var H=h instanceof Rn?fi(h):new Rn(h);if(H.g!="")u&&(H.g=u+"."+H.g),Wr(H,H.s);else{var T=o.location;H=T.protocol,u=u?u+"."+T.hostname:T.hostname,T=+T.port;var x=new Rn(null);H&&$r(x,H),u&&(x.g=u),T&&Wr(x,T),h&&(x.l=h),H=x}return h=r.D,u=r.ya,h&&u&&pt(H,h,u),pt(H,"VER",r.la),xs(r,H),H}function $h(r,u,h){if(u&&!r.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=r.Ca&&!r.pa?new St(new ea({eb:h})):new St(r.pa),u.Ha(r.J),u}e.isActive=function(){return!!this.l&&this.l.isActive(this)};function Wh(){}e=Wh.prototype,e.ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){};function Te(r,u){Qt.call(this),this.g=new jh(u),this.l=r,this.h=u&&u.messageUrlParams||null,r=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(r?r["X-Client-Protocol"]="webchannel":r={"X-Client-Protocol":"webchannel"}),this.g.o=r,r=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(r?r["X-WebChannel-Content-Type"]=u.messageContentType:r={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(r?r["X-WebChannel-Client-Profile"]=u.va:r={"X-WebChannel-Client-Profile":u.va}),this.g.S=r,(r=u&&u.Sb)&&!p(r)&&(this.g.m=r),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!p(u)&&(this.g.D=u,r=this.h,r!==null&&u in r&&(r=this.h,u in r&&delete r[u])),this.j=new pl(this)}C(Te,Qt),Te.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Te.prototype.close=function(){bu(this.g)},Te.prototype.o=function(r){var u=this.g;if(typeof r=="string"){var h={};h.__data__=r,r=h}else this.u&&(h={},h.__data__=hu(r),r=h);u.i.push(new bp(u.Ya++,r)),u.G==3&&sa(u)},Te.prototype.N=function(){this.g.l=null,delete this.j,bu(this.g),delete this.g,Te.aa.N.call(this)};function tf(r){du.call(this),r.__headers__&&(this.headers=r.__headers__,this.statusCode=r.__status__,delete r.__headers__,delete r.__status__);var u=r.__sm__;if(u){t:{for(const h in u){r=h;break t}r=void 0}(this.i=r)&&(r=this.i,u=u!==null&&r in u?u[r]:void 0),this.data=u}else this.data=r}C(tf,du);function ef(){Hu.call(this),this.status=1}C(ef,Hu);function pl(r){this.g=r}C(pl,Wh),pl.prototype.ua=function(){te(this.g,"a")},pl.prototype.ta=function(r){te(this.g,new tf(r))},pl.prototype.sa=function(r){te(this.g,new ef)},pl.prototype.ra=function(){te(this.g,"b")},Te.prototype.send=Te.prototype.o,Te.prototype.open=Te.prototype.m,Te.prototype.close=Te.prototype.close,gu.NO_ERROR=0,gu.TIMEOUT=8,gu.HTTP_ERROR=6,Zp.COMPLETE="complete",mp.EventType=vs,vs.OPEN="a",vs.CLOSE="b",vs.ERROR="c",vs.MESSAGE="d",Qt.prototype.listen=Qt.prototype.K,St.prototype.listenOnce=St.prototype.L,St.prototype.getLastError=St.prototype.Ka,St.prototype.getLastErrorCode=St.prototype.Ba,St.prototype.getStatus=St.prototype.Z,St.prototype.getResponseJson=St.prototype.Oa,St.prototype.getResponseText=St.prototype.oa,St.prototype.send=St.prototype.ea,St.prototype.setWithCredentials=St.prototype.Ha}).apply(typeof Ea<"u"?Ea:typeof self<"u"?self:typeof window<"u"?window:{});const pd="@firebase/firestore",md="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}ne.UNAUTHENTICATED=new ne(null),ne.GOOGLE_CREDENTIALS=new ne("google-credentials-uid"),ne.FIRST_PARTY=new ne("first-party-uid"),ne.MOCK_USER=new ne("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yr="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss=new D1("@firebase/firestore");function qe(e,...t){if(ss.logLevel<=rt.DEBUG){const i=t.map($1);ss.debug(`Firestore (${Yr}): ${e}`,...i)}}function W3(e,...t){if(ss.logLevel<=rt.ERROR){const i=t.map($1);ss.error(`Firestore (${Yr}): ${e}`,...i)}}function _w(e,...t){if(ss.logLevel<=rt.WARN){const i=t.map($1);ss.warn(`Firestore (${Yr}): ${e}`,...i)}}function $1(e){if(typeof e=="string")return e;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(i){return JSON.stringify(i)}(e)}catch{return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sr(e,t,i){let n="Unexpected state";typeof t=="string"?n=t:i=t,tp(e,n,i)}function tp(e,t,i){let n=`FIRESTORE (${Yr}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(i!==void 0)try{n+=" CONTEXT: "+JSON.stringify(i)}catch{n+=" CONTEXT: "+i}throw W3(n),new Error(n)}function rr(e,t,i,n){let l="Unexpected state";typeof i=="string"?l=i:n=i,e||tp(t,l,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class W extends oi{constructor(t,i){super(t,i),this.code=t,this.message=i,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(){this.promise=new Promise((t,i)=>{this.resolve=t,this.reject=i})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{constructor(t,i){this.user=i,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class bw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,i){t.enqueueRetryable(()=>i(ne.UNAUTHENTICATED))}shutdown(){}}class Sw{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,i){this.changeListener=i,t.enqueueRetryable(()=>i(this.token.user))}shutdown(){this.changeListener=null}}class Ew{constructor(t){this.t=t,this.currentUser=ne.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,i){rr(this.o===void 0,42304);let n=this.i;const l=c=>this.i!==n?(n=this.i,i(c)):Promise.resolve();let s=new ar;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new ar,t.enqueueRetryable(()=>l(this.currentUser))};const a=()=>{const c=s;t.enqueueRetryable(async()=>{await c.promise,await l(this.currentUser)})},o=c=>{qe("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>o(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?o(c):(qe("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new ar)}},0),a()}getToken(){const t=this.i,i=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(i).then(n=>this.i!==t?(qe("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(rr(typeof n.accessToken=="string",31837,{l:n}),new ep(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return rr(t===null||typeof t=="string",2055,{h:t}),new ne(t)}}class Tw{constructor(t,i,n){this.P=t,this.T=i,this.I=n,this.type="FirstParty",this.user=ne.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Aw{constructor(t,i,n){this.P=t,this.T=i,this.I=n}getToken(){return Promise.resolve(new Tw(this.P,this.T,this.I))}start(t,i){t.enqueueRetryable(()=>i(ne.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class vd{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class xw{constructor(t,i){this.V=i,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ve(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,i){rr(this.o===void 0,3512);const n=s=>{s.error!=null&&qe("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.m;return this.m=s.token,qe("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?i(s.token):Promise.resolve()};this.o=s=>{t.enqueueRetryable(()=>n(s))};const l=s=>{qe("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>l(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?l(s):qe("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new vd(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(i=>i?(rr(typeof i.token=="string",44558,{tokenResult:i}),this.m=i.token,new vd(i.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cw(e){const t=typeof self<"u"&&(self.crypto||self.msCrypto),i=new Uint8Array(e);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(i);else for(let n=0;n<e;n++)i[n]=Math.floor(256*Math.random());return i}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ow(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nw{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",i=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const l=Cw(40);for(let s=0;s<l.length;++s)n.length<20&&l[s]<i&&(n+=t.charAt(l[s]%62))}return n}}function Xe(e,t){return e<t?-1:e>t?1:0}function Rw(e,t){let i=0;for(;i<e.length&&i<t.length;){const n=e.codePointAt(i),l=t.codePointAt(i);if(n!==l){if(n<128&&l<128)return Xe(n,l);{const s=Ow(),a=Bw(s.encode(Md(e,i)),s.encode(Md(t,i)));return a!==0?a:Xe(n,l)}}i+=n>65535?2:1}return Xe(e.length,t.length)}function Md(e,t){return e.codePointAt(t)>65535?e.substring(t,t+2):e.substring(t,t+1)}function Bw(e,t){for(let i=0;i<e.length&&i<t.length;++i)if(e[i]!==t[i])return Xe(e[i],t[i]);return Xe(e.length,t.length)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yd="__name__";class Qe{constructor(t,i,n){i===void 0?i=0:i>t.length&&Sr(637,{offset:i,range:t.length}),n===void 0?n=t.length-i:n>t.length-i&&Sr(1746,{length:n,range:t.length-i}),this.segments=t,this.offset=i,this.len=n}get length(){return this.len}isEqual(t){return Qe.comparator(this,t)===0}child(t){const i=this.segments.slice(this.offset,this.limit());return t instanceof Qe?t.forEach(n=>{i.push(n)}):i.push(t),this.construct(i)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let i=0;i<this.length;i++)if(this.get(i)!==t.get(i))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let i=0;i<this.length;i++)if(this.get(i)!==t.get(i))return!1;return!0}forEach(t){for(let i=this.offset,n=this.limit();i<n;i++)t(this.segments[i])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,i){const n=Math.min(t.length,i.length);for(let l=0;l<n;l++){const s=Qe.compareSegments(t.get(l),i.get(l));if(s!==0)return s}return Xe(t.length,i.length)}static compareSegments(t,i){const n=Qe.isNumericId(t),l=Qe.isNumericId(i);return n&&!l?-1:!n&&l?1:n&&l?Qe.extractNumericId(t).compare(Qe.extractNumericId(i)):Rw(t,i)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return J1.fromString(t.substring(4,t.length-2))}}class Pe extends Qe{construct(t,i,n){return new Pe(t,i,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const i=[];for(const n of t){if(n.indexOf("//")>=0)throw new W($.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);i.push(...n.split("/").filter(l=>l.length>0))}return new Pe(i)}static emptyPath(){return new Pe([])}}const Dw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Pn extends Qe{construct(t,i,n){return new Pn(t,i,n)}static isValidIdentifier(t){return Dw.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Pn.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===yd}static keyField(){return new Pn([yd])}static fromServerFormat(t){const i=[];let n="",l=0;const s=()=>{if(n.length===0)throw new W($.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);i.push(n),n=""};let a=!1;for(;l<t.length;){const o=t[l];if(o==="\\"){if(l+1===t.length)throw new W($.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[l+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new W($.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=c,l+=2}else o==="`"?(a=!a,l++):o!=="."||a?(n+=o,l++):(s(),l++)}if(s(),a)throw new W($.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Pn(i)}static emptyPath(){return new Pn([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(t){this.path=t}static fromPath(t){return new qn(Pe.fromString(t))}static fromName(t){return new qn(Pe.fromString(t).popFirst(5))}static empty(){return new qn(Pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&Pe.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,i){return Pe.comparator(t.path,i.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new qn(new Pe(t.slice()))}}function Lw(e,t,i,n){if(t===!0&&n===!0)throw new W($.INVALID_ARGUMENT,`${e} and ${i} cannot be used together.`)}function kw(e){return typeof e=="object"&&e!==null&&(Object.getPrototypeOf(e)===Object.prototype||Object.getPrototypeOf(e)===null)}function Iw(e){if(e===void 0)return"undefined";if(e===null)return"null";if(typeof e=="string")return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if(typeof e=="number"||typeof e=="boolean")return""+e;if(typeof e=="object"){if(e instanceof Array)return"an array";{const t=function(n){return n.constructor?n.constructor.name:null}(e);return t?`a custom ${t} object`:"an object"}}return typeof e=="function"?"a function":Sr(12329,{type:typeof e})}function zw(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new W($.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const i=Iw(e);throw new W($.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${i}`)}}return e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(e,t){const i={typeString:e};return t&&(i.value=t),i}function Xr(e,t){if(!kw(e))throw new W($.INVALID_ARGUMENT,"JSON must be an object");let i;for(const n in t)if(t[n]){const l=t[n].typeString,s="value"in t[n]?{value:t[n].value}:void 0;if(!(n in e)){i=`JSON missing required field: '${n}'`;break}const a=e[n];if(l&&typeof a!==l){i=`JSON field '${n}' must be a ${l}.`;break}if(s!==void 0&&a!==s.value){i=`Expected '${n}' field to equal '${s.value}'`;break}}if(i)throw new W($.INVALID_ARGUMENT,i);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wd=-62135596800,Zd=1e6;class Je{static now(){return Je.fromMillis(Date.now())}static fromDate(t){return Je.fromMillis(t.getTime())}static fromMillis(t){const i=Math.floor(t/1e3),n=Math.floor((t-1e3*i)*Zd);return new Je(i,n)}constructor(t,i){if(this.seconds=t,this.nanoseconds=i,i<0)throw new W($.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+i);if(i>=1e9)throw new W($.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+i);if(t<wd)throw new W($.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new W($.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Zd}_compareTo(t){return this.seconds===t.seconds?Xe(this.nanoseconds,t.nanoseconds):Xe(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Je._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Xr(t,Je._jsonSchema))return new Je(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-wd;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Je._jsonSchemaVersion="firestore/timestamp/1.0",Je._jsonSchema={type:Rt("string",Je._jsonSchemaVersion),seconds:Rt("number"),nanoseconds:Rt("number")};function Uw(e){return e.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jw extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(t){this.binaryString=t}static fromBase64String(t){const i=function(l){try{return atob(l)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new jw("Invalid base64 string: "+s):s}}(t);return new rl(i)}static fromUint8Array(t){const i=function(l){let s="";for(let a=0;a<l.length;++a)s+=String.fromCharCode(l[a]);return s}(t);return new rl(i)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(i){return btoa(i)}(this.binaryString)}toUint8Array(){return function(i){const n=new Uint8Array(i.length);for(let l=0;l<i.length;l++)n[l]=i.charCodeAt(l);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return Xe(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}rl.EMPTY_BYTE_STRING=new rl("");const Ro="(default)";class Bo{constructor(t,i){this.projectId=t,this.database=i||Ro}static empty(){return new Bo("","")}get isDefaultDatabase(){return this.database===Ro}isEqual(t){return t instanceof Bo&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pw{constructor(t,i=null,n=[],l=[],s=null,a="F",o=null,c=null){this.path=t,this.collectionGroup=i,this.explicitOrderBy=n,this.filters=l,this.limit=s,this.limitType=a,this.startAt=o,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function Gw(e){return new Pw(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _d,it;(it=_d||(_d={}))[it.OK=0]="OK",it[it.CANCELLED=1]="CANCELLED",it[it.UNKNOWN=2]="UNKNOWN",it[it.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",it[it.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",it[it.NOT_FOUND=5]="NOT_FOUND",it[it.ALREADY_EXISTS=6]="ALREADY_EXISTS",it[it.PERMISSION_DENIED=7]="PERMISSION_DENIED",it[it.UNAUTHENTICATED=16]="UNAUTHENTICATED",it[it.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",it[it.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",it[it.ABORTED=10]="ABORTED",it[it.OUT_OF_RANGE=11]="OUT_OF_RANGE",it[it.UNIMPLEMENTED=12]="UNIMPLEMENTED",it[it.INTERNAL=13]="INTERNAL",it[it.UNAVAILABLE=14]="UNAVAILABLE",it[it.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new J1([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qw=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ip=1048576;function M2(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yw{constructor(t,i,n=1e3,l=1.5,s=6e4){this.Fi=t,this.timerId=i,this.d_=n,this.E_=l,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(t){this.cancel();const i=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),l=Math.max(0,i-n);l>0&&qe("ExponentialBackoff",`Backing off for ${l} ms (base delay: ${this.R_} ms, delay with jitter: ${i} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,l,()=>(this.m_=Date.now(),t())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W1{constructor(t,i,n,l,s){this.asyncQueue=t,this.timerId=i,this.targetTimeMs=n,this.op=l,this.removalCallback=s,this.deferred=new ar,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,i,n,l,s){const a=Date.now()+n,o=new W1(t,i,a,l,s);return o.start(n),o}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new W($.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var bd,Sd;(Sd=bd||(bd={})).Fa="default",Sd.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xw(e){const t={};return e.timeoutSeconds!==void 0&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const np="firestore.googleapis.com",Td=!0;class Ad{constructor(t){var i,n;if(t.host===void 0){if(t.ssl!==void 0)throw new W($.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=np,this.ssl=Td}else this.host=t.host,this.ssl=(i=t.ssl)!==null&&i!==void 0?i:Td;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=qw;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<ip)throw new W($.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}Lw("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Xw((n=t.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new W($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new W($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new W($.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(n,l){return n.timeoutSeconds===l.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class lp{constructor(t,i,n,l){this._authCredentials=t,this._appCheckCredentials=i,this._databaseId=n,this._app=l,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ad({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new W($.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new W($.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ad(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new bw;switch(n.type){case"firstParty":return new Aw(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new W($.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(i){const n=Ed.get(i);n&&(qe("ComponentProvider","Removing Datastore"),Ed.delete(i),n.terminate())}(this),Promise.resolve()}}function Fw(e,t,i,n={}){var l;e=zw(e,lp);const s=dl(t),a=e._getSettings(),o=Object.assign(Object.assign({},a),{emulatorOptions:e._getEmulatorOptions()}),c=`${t}:${i}`;s&&(nu(`https://${c}`),B1("Firestore",!0)),a.host!==np&&a.host!==c&&_w("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const d=Object.assign(Object.assign({},a),{host:c,ssl:s,emulatorOptions:n});if(!Sn(d,o)&&(e._setSettings(d),n.mockUserToken)){let v,w;if(typeof n.mockUserToken=="string")v=n.mockUserToken,w=ne.MOCK_USER;else{v=eM(n.mockUserToken,(l=e._app)===null||l===void 0?void 0:l.options.projectId);const V=n.mockUserToken.sub||n.mockUserToken.user_id;if(!V)throw new W($.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");w=new ne(V)}e._authCredentials=new Sw(new ep(v,w))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class th{constructor(t,i,n){this.converter=i,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new th(this.firestore,t,this._query)}}class ei{constructor(t,i,n){this.converter=i,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new eh(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new ei(this.firestore,t,this._key)}toJSON(){return{type:ei._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,i,n){if(Xr(i,ei._jsonSchema))return new ei(t,n||null,new qn(Pe.fromString(i.referencePath)))}}ei._jsonSchemaVersion="firestore/documentReference/1.0",ei._jsonSchema={type:Rt("string",ei._jsonSchemaVersion),referencePath:Rt("string")};class eh extends th{constructor(t,i,n){super(t,i,Gw(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new ei(this.firestore,null,new qn(t))}withConverter(t){return new eh(this.firestore,t,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xd="AsyncQueue";class Cd{constructor(t=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Yw(this,"async_queue_retry"),this.oc=()=>{const n=M2();n&&qe(xd,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=t;const i=M2();i&&typeof i.addEventListener=="function"&&i.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.ac(),this.uc(t)}enterRestrictedMode(t){if(!this.Xu){this.Xu=!0,this.rc=t||!1;const i=M2();i&&typeof i.removeEventListener=="function"&&i.removeEventListener("visibilitychange",this.oc)}}enqueue(t){if(this.ac(),this.Xu)return new Promise(()=>{});const i=new ar;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(t().then(i.resolve,i.reject),i.promise)).then(()=>i.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Zu.push(t),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(t){if(!Uw(t))throw t;qe(xd,"Operation failed with retryable error: "+t)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(t){const i=this._c.then(()=>(this.nc=!0,t().catch(n=>{throw this.tc=n,this.nc=!1,W3("INTERNAL UNHANDLED ERROR: ",Od(n)),n}).then(n=>(this.nc=!1,n))));return this._c=i,i}enqueueAfterDelay(t,i,n){this.ac(),this.sc.indexOf(t)>-1&&(i=0);const l=W1.createAndSchedule(this,t,i,n,s=>this.lc(s));return this.ec.push(l),l}ac(){this.tc&&Sr(47125,{hc:Od(this.tc)})}verifyOperationInProgress(){}async Pc(){let t;do t=this._c,await t;while(t!==this._c)}Tc(t){for(const i of this.ec)if(i.timerId===t)return!0;return!1}Ic(t){return this.Pc().then(()=>{this.ec.sort((i,n)=>i.targetTimeMs-n.targetTimeMs);for(const i of this.ec)if(i.skipDelay(),t!=="all"&&i.timerId===t)break;return this.Pc()})}dc(t){this.sc.push(t)}lc(t){const i=this.ec.indexOf(t);this.ec.splice(i,1)}}function Od(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+`
`+e.stack),t}class Kw extends lp{constructor(t,i,n,l){super(t,i,n,l),this.type="firestore",this._queue=new Cd,this._persistenceKey=(l==null?void 0:l.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Cd(t),this._firestoreClient=void 0,await t}}}function Qw(e,t,i){i||(i=Ro);const n=jr(e,"firestore");if(n.isInitialized(i)){const l=n.getImmediate({identifier:i}),s=n.getOptions(i);if(Sn(s,t))return l;throw new W($.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(t.cacheSizeBytes!==void 0&&t.localCache!==void 0)throw new W($.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(t.cacheSizeBytes!==void 0&&t.cacheSizeBytes!==-1&&t.cacheSizeBytes<ip)throw new W($.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&dl(t.host)&&nu(t.host),n.initialize({options:t,instanceIdentifier:i})}function Jw(e,t){const i=typeof e=="object"?e:k1(),n=typeof e=="string"?e:Ro,l=jr(i,"firestore").getImmediate({identifier:n});if(!l._initialized){const s=c3("firestore");s&&Fw(l,...s)}return l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Zi(rl.fromBase64String(t))}catch(i){throw new W($.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+i)}}static fromUint8Array(t){return new Zi(rl.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Zi._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Xr(t,Zi._jsonSchema))return Zi.fromBase64String(t.bytes)}}Zi._jsonSchemaVersion="firestore/bytes/1.0",Zi._jsonSchema={type:Rt("string",Zi._jsonSchemaVersion),bytes:Rt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(...t){for(let i=0;i<t.length;++i)if(t[i].length===0)throw new W($.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Pn(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(t,i){if(!isFinite(t)||t<-90||t>90)throw new W($.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(i)||i<-180||i>180)throw new W($.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+i);this._lat=t,this._long=i}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return Xe(this._lat,t._lat)||Xe(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Jn._jsonSchemaVersion}}static fromJSON(t){if(Xr(t,Jn._jsonSchema))return new Jn(t.latitude,t.longitude)}}Jn._jsonSchemaVersion="firestore/geoPoint/1.0",Jn._jsonSchema={type:Rt("string",Jn._jsonSchemaVersion),latitude:Rt("number"),longitude:Rt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(t){this._values=(t||[]).map(i=>i)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(n,l){if(n.length!==l.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==l[s])return!1;return!0}(this._values,t._values)}toJSON(){return{type:$n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Xr(t,$n._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(i=>typeof i=="number"))return new $n(t.vectorValues);throw new W($.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}$n._jsonSchemaVersion="firestore/vectorValue/1.0",$n._jsonSchema={type:Rt("string",$n._jsonSchemaVersion),vectorValues:Rt("object")};const $w=new RegExp("[~\\*/\\[\\]]");function Ww(e,t,i){if(t.search($w)>=0)throw Nd(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e);try{return new sp(...t.split("."))._internalPath}catch{throw Nd(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e)}}function Nd(e,t,i,n,l){let s=`Function ${t}() called with invalid data`;s+=". ";let a="";return new W($.INVALID_ARGUMENT,s+e+a)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rp{constructor(t,i,n,l,s){this._firestore=t,this._userDataWriter=i,this._key=n,this._document=l,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ei(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new t4(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const i=this._document.data.field(ap("DocumentSnapshot.get",t));if(i!==null)return this._userDataWriter.convertValue(i)}}}class t4 extends rp{data(){return super.data()}}function ap(e,t){return typeof t=="string"?Ww(e,t):t instanceof sp?t._internalPath:t._delegate._internalPath}class Ta{constructor(t,i){this.hasPendingWrites=t,this.fromCache=i}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Yl extends rp{constructor(t,i,n,l,s,a){super(t,i,n,l,a),this._firestore=t,this._firestoreImpl=t,this.metadata=s}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const i=new Ka(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(i,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,i={}){if(this._document){const n=this._document.data.field(ap("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,i.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new W($.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,i={};return i.type=Yl._jsonSchemaVersion,i.bundle="",i.bundleSource="DocumentSnapshot",i.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?i:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),i.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),i)}}Yl._jsonSchemaVersion="firestore/documentSnapshot/1.0",Yl._jsonSchema={type:Rt("string",Yl._jsonSchemaVersion),bundleSource:Rt("string","DocumentSnapshot"),bundleName:Rt("string"),bundle:Rt("string")};class Ka extends Yl{data(t={}){return super.data(t)}}class or{constructor(t,i,n,l){this._firestore=t,this._userDataWriter=i,this._snapshot=l,this.metadata=new Ta(l.hasPendingWrites,l.fromCache),this.query=n}get docs(){const t=[];return this.forEach(i=>t.push(i)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,i){this._snapshot.docs.forEach(n=>{t.call(i,new Ka(this._firestore,this._userDataWriter,n.key,n,new Ta(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const i=!!t.includeMetadataChanges;if(i&&this._snapshot.excludesMetadataChanges)throw new W($.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===i||(this._cachedChanges=function(l,s){if(l._snapshot.oldDocs.isEmpty()){let a=0;return l._snapshot.docChanges.map(o=>{const c=new Ka(l._firestore,l._userDataWriter,o.doc.key,o.doc,new Ta(l._snapshot.mutatedKeys.has(o.doc.key),l._snapshot.fromCache),l.query.converter);return o.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=l._snapshot.oldDocs;return l._snapshot.docChanges.filter(o=>s||o.type!==3).map(o=>{const c=new Ka(l._firestore,l._userDataWriter,o.doc.key,o.doc,new Ta(l._snapshot.mutatedKeys.has(o.doc.key),l._snapshot.fromCache),l.query.converter);let d=-1,v=-1;return o.type!==0&&(d=a.indexOf(o.doc.key),a=a.delete(o.doc.key)),o.type!==1&&(a=a.add(o.doc),v=a.indexOf(o.doc.key)),{type:e4(o.type),doc:c,oldIndex:d,newIndex:v}})}}(this,i),this._cachedChangesIncludeMetadataChanges=i),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new W($.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=or._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Nw.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const i=[],n=[],l=[];return this.docs.forEach(s=>{s._document!==null&&(i.push(s._document),n.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),l.push(s.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function e4(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Sr(61501,{type:e})}}or._jsonSchemaVersion="firestore/querySnapshot/1.0",or._jsonSchema={type:Rt("string",or._jsonSchemaVersion),bundleSource:Rt("string","QuerySnapshot"),bundleName:Rt("string"),bundle:Rt("string")};(function(t,i=!0){(function(l){Yr=l})(Vs),ll(new En("firestore",(n,{instanceIdentifier:l,options:s})=>{const a=n.getProvider("app").getImmediate(),o=new Kw(new Ew(n.getProvider("auth-internal")),new xw(a,n.getProvider("app-check-internal")),function(d,v){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new W($.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Bo(d.options.projectId,v)}(a,l),a);return s=Object.assign({useFetchStreams:i},s),o._setSettings(s),o},"PUBLIC").setMultipleInstances(!0)),ni(pd,md,t),ni(pd,md,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i4="type.googleapis.com/google.protobuf.Int64Value",n4="type.googleapis.com/google.protobuf.UInt64Value";function op(e,t){const i={};for(const n in e)e.hasOwnProperty(n)&&(i[n]=t(e[n]));return i}function Do(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>Do(t));if(typeof e=="function"||typeof e=="object")return op(e,t=>Do(t));throw new Error("Data cannot be encoded in JSON: "+e)}function rs(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case i4:case n4:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>rs(t)):typeof e=="function"||typeof e=="object"?op(e,t=>rs(t)):e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ih="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rd={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class he extends oi{constructor(t,i,n){super(`${ih}/${t}`,i||""),this.details=n,Object.setPrototypeOf(this,he.prototype)}}function l4(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function Lo(e,t){let i=l4(e),n=i,l;try{const s=t&&t.error;if(s){const a=s.status;if(typeof a=="string"){if(!Rd[a])return new he("internal","internal");i=Rd[a],n=a}const o=s.message;typeof o=="string"&&(n=o),l=s.details,l!==void 0&&(l=rs(l))}}catch{}return i==="ok"?null:new he(i,n,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s4{constructor(t,i,n,l){this.app=t,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,ve(t)&&t.settings.appCheckToken&&(this.serverAppAppCheckToken=t.settings.appCheckToken),this.auth=i.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||i.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||l==null||l.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const i=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return i.error?null:i.token}return null}async getContext(t){const i=await this.getAuthToken(),n=await this.getMessagingToken(),l=await this.getAppCheckToken(t);return{authToken:i,messagingToken:n,appCheckToken:l}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ec="us-central1",r4=/^data: (.*?)(?:\n|$)/;function a4(e){let t=null;return{promise:new Promise((i,n)=>{t=setTimeout(()=>{n(new he("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class o4{constructor(t,i,n,l,s=Ec,a=(...o)=>fetch(...o)){this.app=t,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new s4(t,i,n,l),this.cancelAllRequests=new Promise(o=>{this.deleteService=()=>Promise.resolve(o())});try{const o=new URL(s);this.customDomain=o.origin+(o.pathname==="/"?"":o.pathname),this.region=Ec}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(t){const i=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${i}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${i}.cloudfunctions.net/${t}`}}function u4(e,t,i){const n=dl(t);e.emulatorOrigin=`http${n?"s":""}://${t}:${i}`,n&&(nu(e.emulatorOrigin),B1("Functions",!0))}function c4(e,t,i){const n=l=>f4(e,t,l,{});return n.stream=(l,s)=>H4(e,t,l,s),n}async function h4(e,t,i,n){i["Content-Type"]="application/json";let l;try{l=await n(e,{method:"POST",body:JSON.stringify(t),headers:i})}catch{return{status:0,json:null}}let s=null;try{s=await l.json()}catch{}return{status:l.status,json:s}}async function up(e,t){const i={},n=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return n.authToken&&(i.Authorization="Bearer "+n.authToken),n.messagingToken&&(i["Firebase-Instance-ID-Token"]=n.messagingToken),n.appCheckToken!==null&&(i["X-Firebase-AppCheck"]=n.appCheckToken),i}function f4(e,t,i,n){const l=e._url(t);return d4(e,l,i,n)}async function d4(e,t,i,n){i=Do(i);const l={data:i},s=await up(e,n),a=n.timeout||7e4,o=a4(a),c=await Promise.race([h4(t,l,s,e.fetchImpl),o.promise,e.cancelAllRequests]);if(o.cancel(),!c)throw new he("cancelled","Firebase Functions instance was deleted.");const d=Lo(c.status,c.json);if(d)throw d;if(!c.json)throw new he("internal","Response is not valid JSON object.");let v=c.json.data;if(typeof v>"u"&&(v=c.json.result),typeof v>"u")throw new he("internal","Response is missing data field.");return{data:rs(v)}}function H4(e,t,i,n){const l=e._url(t);return V4(e,l,i,n||{})}async function V4(e,t,i,n){var l;i=Do(i);const s={data:i},a=await up(e,n);a["Content-Type"]="application/json",a.Accept="text/event-stream";let o;try{o=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:a,signal:n==null?void 0:n.signal})}catch(b){if(b instanceof Error&&b.name==="AbortError"){const N=new he("cancelled","Request was cancelled.");return{data:Promise.reject(N),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(N)}}}}}}const C=Lo(0,null);return{data:Promise.reject(C),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(C)}}}}}}let c,d;const v=new Promise((b,C)=>{c=b,d=C});(l=n==null?void 0:n.signal)===null||l===void 0||l.addEventListener("abort",()=>{const b=new he("cancelled","Request was cancelled.");d(b)});const w=o.body.getReader(),V=g4(w,c,d,n==null?void 0:n.signal);return{stream:{[Symbol.asyncIterator](){const b=V.getReader();return{async next(){const{value:C,done:N}=await b.read();return{value:C,done:N}},async return(){return await b.cancel(),{done:!0,value:void 0}}}}},data:v}}function g4(e,t,i,n){const l=(a,o)=>{const c=a.match(r4);if(!c)return;const d=c[1];try{const v=JSON.parse(d);if("result"in v){t(rs(v.result));return}if("message"in v){o.enqueue(rs(v.message));return}if("error"in v){const w=Lo(0,v);o.error(w),i(w);return}}catch(v){if(v instanceof he){o.error(v),i(v);return}}},s=new TextDecoder;return new ReadableStream({start(a){let o="";return c();async function c(){if(n!=null&&n.aborted){const d=new he("cancelled","Request was cancelled");return a.error(d),i(d),Promise.resolve()}try{const{value:d,done:v}=await e.read();if(v){o.trim()&&l(o.trim(),a),a.close();return}if(n!=null&&n.aborted){const V=new he("cancelled","Request was cancelled");a.error(V),i(V),await e.cancel();return}o+=s.decode(d,{stream:!0});const w=o.split(`
`);o=w.pop()||"";for(const V of w)V.trim()&&l(V.trim(),a);return c()}catch(d){const v=d instanceof he?d:Lo(0,null);a.error(v),i(v)}}},cancel(){return e.cancel()}})}const Bd="@firebase/functions",Dd="0.12.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p4="auth-internal",m4="app-check-internal",v4="messaging-internal";function M4(e){const t=(i,{instanceIdentifier:n})=>{const l=i.getProvider("app").getImmediate(),s=i.getProvider(p4),a=i.getProvider(v4),o=i.getProvider(m4);return new o4(l,s,a,o,n)};ll(new En(ih,t,"PUBLIC").setMultipleInstances(!0)),ni(Bd,Dd,e),ni(Bd,Dd,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y4(e=k1(),t=Ec){const n=jr(Ke(e),ih).getImmediate({identifier:t}),l=c3("functions");return l&&w4(n,...l),n}function w4(e,t,i){u4(Ke(e),t,i)}function nh(e,t,i){return c4(Ke(e),t)}M4();const cp={firebaseConfig:{apiKey:"AIzaSyCdopZ7PgYFx82A0lC_lLeKtEXepYUd4Pw",authDomain:"smokeless-eu.firebaseapp.com",projectId:"smokeless-eu",storageBucket:"smokeless-eu.firebasestorage.app",messagingSenderId:"1096722867612",appId:"1:1096722867612:web:19176df5b5a4e443f65459"},firebaseFunctionsRegion:"europe-west1"},Er=X0().length>0?X0()[0]:V3(cp.firebaseConfig);let Tc;try{Tc=B3(Er,{persistence:U3,popupRedirectResolver:$3})}catch{Tc=Mw(Er)}const Ue=Tc;let Ld;try{Ld=Qw(Er,{experimentalAutoDetectLongPolling:!0})}catch{Ld=Jw(Er)}const lh=y4(Er,cp.firebaseFunctionsRegion);async function Z4(e){return(await nh(lh,"resolveGoogleLinkCode")({code:e})).data}async function kd(e){return(await nh(lh,"completeGoogleLinkSession")({sessionId:e})).data}async function Id(e){return(await nh(lh,"prepareGoogleLinkMigration")({sessionId:e})).data}const Ac="smokeless:link-site:session";function hp(e){return e.toUpperCase().replace(/[^A-Z2-9]/g,"").slice(0,10)}function _4(e){const t=hp(e);return t.length<=5?t:`${t.slice(0,5)}-${t.slice(5)}`}function zd(){if(typeof window>"u")return null;try{const e=window.sessionStorage.getItem(Ac);if(!e)return null;const t=JSON.parse(e);return typeof t.sessionId!="string"||typeof t.expiresAt!="string"?null:{sessionId:t.sessionId,expiresAt:t.expiresAt}}catch{return null}}function Aa(e){if(!(typeof window>"u")){if(!e){window.sessionStorage.removeItem(Ac);return}window.sessionStorage.setItem(Ac,JSON.stringify(e))}}function b4(){if(typeof navigator>"u")return!1;const e=navigator.userAgent,t=/iPad|iPhone|iPod/.test(e),i=/Safari/.test(e)&&!/Chrome|CriOS|Edg|FxiOS/.test(e);return t||i}function S4(e){if(!e||typeof e!="object"||!("code"in e))return!1;const t=String(e.code??"");return t==="auth/popup-blocked"||t==="auth/web-storage-unsupported"||t==="auth/operation-not-supported-in-this-environment"}function E4(e){const t=Math.max(0,e),i=Math.floor(t/60),n=t%60;return`${i}:${String(n).padStart(2,"0")}`}function T4(){const[e,t]=Vt.useState(""),[i,n]=Vt.useState("idle"),[l,s]=Vt.useState(()=>zd()),[a,o]=Vt.useState("Enter the pairing code from Smokeless to continue."),[c,d]=Vt.useState(""),[v,w]=Vt.useState(!1),[V,b]=Vt.useState(()=>Date.now());Vt.useEffect(()=>{const p=window.setInterval(()=>b(Date.now()),1e3);return()=>window.clearInterval(p)},[]),Vt.useEffect(()=>{let p=!1;return(async()=>{await u6(Ue,X1);const A=zd(),R=await L6(Ue);if(!p){if(R!=null&&R.user&&A){s(A),n("authorizing"),o("Preparing your Smokeless data...");try{const I=await kd(A.sessionId);if(await Id(A.sessionId),p)return;d(I.targetGoogleEmail??R.user.email??""),w(!1),n("success"),o("Google account linked successfully. Return to Smokeless to finish the account switch."),Aa(null),s(null),await sd(Ue)}catch(I){if(console.error("[Smokeless Link] redirect completion failed",I),p)return;d(R.user.email??""),w(!0),n("error"),o(I instanceof Error?I.message:"Google access was approved, but Smokeless could not finish linking.")}return}if(Ue.currentUser&&A){s(A),n("ready"),o("Continue with Google to finish linking.");return}A&&(s(A),n("ready"),o("Continue with Google to finish linking."))}})().catch(A=>{console.error("[Smokeless Link] initialization failed",A),!p&&(n("error"),o(A instanceof Error?A.message:"Could not start the Google link page."))}),()=>{p=!0}},[]);const C=Vt.useMemo(()=>l?Math.max(0,Math.floor((new Date(l.expiresAt).getTime()-V)/1e3)):0,[V,l]),N=async()=>{const p=hp(e);if(p.length!==10){w(!1),n("error"),o("Enter the full 10-character code shown in Smokeless.");return}w(!1),n("authorizing"),o("Checking pairing code...");try{const _=await Z4(p),A={sessionId:_.sessionId,expiresAt:_.expiresAt};Aa(A),s(A),n("ready"),o("Code verified. Continue with Google in this browser.")}catch(_){console.error("[Smokeless Link] resolve failed",_),w(!1),n("error"),o(_ instanceof Error?_.message:"Pairing code not recognized.")}},D=async()=>{if(!l)return;const p=new wi;p.setCustomParameters({prompt:"select_account"}),Aa(l),w(!1),n("authorizing"),o("Opening Google sign-in...");try{if(b4()){await od(Ue,p);return}const _=await x6(Ue,p),A=await kd(l.sessionId),R=await Id(l.sessionId);d(A.targetGoogleEmail??R.targetGoogleEmail??_.user.email??""),w(!1),n("success"),o("Google account linked successfully. Return to Smokeless to finish the account switch."),Aa(null),s(null),await sd(Ue)}catch(_){if(S4(_)){await od(Ue,p);return}console.error("[Smokeless Link] google auth failed",_),Ue.currentUser&&(d(Ue.currentUser.email??c),w(!0)),n("error"),o(_ instanceof Error?_.message:Ue.currentUser?"Google access was approved, but Smokeless could not finish linking.":"Could not complete Google sign-in.")}},Z=i==="success"||v;return Y.jsxs("div",{className:"linker-shell",children:[Y.jsx("div",{className:"linker-orb linker-orb-left"}),Y.jsx("div",{className:"linker-orb linker-orb-right"}),Y.jsx("div",{className:"linker-frame",children:Y.jsxs(s3,{padding:"default",className:"linker-card",children:[Y.jsx("div",{className:"linker-eyebrow",children:"Smokeless Pairing"}),Y.jsx("h1",{className:"linker-title",children:"Link your Google account in a normal browser."}),Y.jsx("p",{className:"linker-body",children:a}),c?Y.jsxs("div",{className:"linker-chip",children:[i==="success"?"Linked as ":"Authorized as ",c]}):null,Z?null:Y.jsxs(Y.Fragment,{children:[Y.jsxs("div",{className:"linker-section",children:[Y.jsx("label",{className:"linker-label",htmlFor:"pairing-code",children:"Pairing code"}),Y.jsx("input",{id:"pairing-code",className:"linker-input",value:_4(e),onChange:p=>t(p.currentTarget.value),placeholder:"ABCDE-FGHIJ",autoComplete:"one-time-code",autoCapitalize:"characters",spellCheck:!1,disabled:i==="authorizing"}),Y.jsx(mc,{variant:"secondary",className:"linker-button",onClick:()=>void N(),disabled:i==="authorizing",children:"Verify code"})]}),l?Y.jsxs("div",{className:"linker-session",children:[Y.jsxs("div",{children:[Y.jsx("div",{className:"linker-label",children:"Session"}),Y.jsx("div",{className:"linker-meta",children:l.sessionId})]}),Y.jsxs("div",{children:[Y.jsx("div",{className:"linker-label",children:"Expires in"}),Y.jsx("div",{className:"linker-countdown",children:E4(C)})]})]}):null,Y.jsx(mc,{variant:"highlight",className:"linker-button linker-button-primary",onClick:()=>void D(),disabled:!l||i==="authorizing"||C===0,children:"Continue with Google"})]}),Y.jsx("div",{className:"linker-footer",children:Z?"Return to Smokeless on your phone. The app will refresh onto the linked Google account automatically.":"After Google confirms access here, Smokeless will prepare your data here first, then your phone app will switch onto the linked account."})]})})]})}I9.createRoot(document.getElementById("root")).render(Y.jsx(T4,{}));
