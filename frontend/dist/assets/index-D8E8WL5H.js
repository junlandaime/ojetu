(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))o(u);new MutationObserver(u=>{for(const h of u)if(h.type==="childList")for(const p of h.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&o(p)}).observe(document,{childList:!0,subtree:!0});function d(u){const h={};return u.integrity&&(h.integrity=u.integrity),u.referrerPolicy&&(h.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?h.credentials="include":u.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function o(u){if(u.ep)return;u.ep=!0;const h=d(u);fetch(u.href,h)}})();function Cf(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Jo={exports:{}},Ii={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cp;function Ob(){if(Cp)return Ii;Cp=1;var i=Symbol.for("react.transitional.element"),l=Symbol.for("react.fragment");function d(o,u,h){var p=null;if(h!==void 0&&(p=""+h),u.key!==void 0&&(p=""+u.key),"key"in u){h={};for(var x in u)x!=="key"&&(h[x]=u[x])}else h=u;return u=h.ref,{$$typeof:i,type:o,key:p,ref:u!==void 0?u:null,props:h}}return Ii.Fragment=l,Ii.jsx=d,Ii.jsxs=d,Ii}var Mp;function Lb(){return Mp||(Mp=1,Jo.exports=Ob()),Jo.exports}var e=Lb(),Xo={exports:{}},Ee={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rp;function Pb(){if(Rp)return Ee;Rp=1;var i=Symbol.for("react.transitional.element"),l=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),u=Symbol.for("react.profiler"),h=Symbol.for("react.consumer"),p=Symbol.for("react.context"),x=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),b=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),A=Symbol.iterator;function P(N){return N===null||typeof N!="object"?null:(N=A&&N[A]||N["@@iterator"],typeof N=="function"?N:null)}var w={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,H={};function _(N,k,Y){this.props=N,this.context=k,this.refs=H,this.updater=Y||w}_.prototype.isReactComponent={},_.prototype.setState=function(N,k){if(typeof N!="object"&&typeof N!="function"&&N!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,N,k,"setState")},_.prototype.forceUpdate=function(N){this.updater.enqueueForceUpdate(this,N,"forceUpdate")};function E(){}E.prototype=_.prototype;function L(N,k,Y){this.props=N,this.context=k,this.refs=H,this.updater=Y||w}var q=L.prototype=new E;q.constructor=L,M(q,_.prototype),q.isPureReactComponent=!0;var oe=Array.isArray;function re(){}var te={H:null,A:null,T:null,S:null},ge=Object.prototype.hasOwnProperty;function ye(N,k,Y){var X=Y.ref;return{$$typeof:i,type:N,key:k,ref:X!==void 0?X:null,props:Y}}function he(N,k){return ye(N.type,k,N.props)}function Oe(N){return typeof N=="object"&&N!==null&&N.$$typeof===i}function Ce(N){var k={"=":"=0",":":"=2"};return"$"+N.replace(/[=:]/g,function(Y){return k[Y]})}var Se=/\/+/g;function Z(N,k){return typeof N=="object"&&N!==null&&N.key!=null?Ce(""+N.key):k.toString(36)}function fe(N){switch(N.status){case"fulfilled":return N.value;case"rejected":throw N.reason;default:switch(typeof N.status=="string"?N.then(re,re):(N.status="pending",N.then(function(k){N.status==="pending"&&(N.status="fulfilled",N.value=k)},function(k){N.status==="pending"&&(N.status="rejected",N.reason=k)})),N.status){case"fulfilled":return N.value;case"rejected":throw N.reason}}throw N}function U(N,k,Y,X,se){var pe=typeof N;(pe==="undefined"||pe==="boolean")&&(N=null);var Ae=!1;if(N===null)Ae=!0;else switch(pe){case"bigint":case"string":case"number":Ae=!0;break;case"object":switch(N.$$typeof){case i:case l:Ae=!0;break;case b:return Ae=N._init,U(Ae(N._payload),k,Y,X,se)}}if(Ae)return se=se(N),Ae=X===""?"."+Z(N,0):X,oe(se)?(Y="",Ae!=null&&(Y=Ae.replace(Se,"$&/")+"/"),U(se,k,Y,"",function(ee){return ee})):se!=null&&(Oe(se)&&(se=he(se,Y+(se.key==null||N&&N.key===se.key?"":(""+se.key).replace(Se,"$&/")+"/")+Ae)),k.push(se)),1;Ae=0;var B=X===""?".":X+":";if(oe(N))for(var S=0;S<N.length;S++)X=N[S],pe=B+Z(X,S),Ae+=U(X,k,Y,pe,se);else if(S=P(N),typeof S=="function")for(N=S.call(N),S=0;!(X=N.next()).done;)X=X.value,pe=B+Z(X,S++),Ae+=U(X,k,Y,pe,se);else if(pe==="object"){if(typeof N.then=="function")return U(fe(N),k,Y,X,se);throw k=String(N),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(N).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return Ae}function ie(N,k,Y){if(N==null)return N;var X=[],se=0;return U(N,X,"","",function(pe){return k.call(Y,pe,se++)}),X}function I(N){if(N._status===-1){var k=N._result;k=k(),k.then(function(Y){(N._status===0||N._status===-1)&&(N._status=1,N._result=Y)},function(Y){(N._status===0||N._status===-1)&&(N._status=2,N._result=Y)}),N._status===-1&&(N._status=0,N._result=k)}if(N._status===1)return N._result.default;throw N._result}var ue=typeof reportError=="function"?reportError:function(N){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof N=="object"&&N!==null&&typeof N.message=="string"?String(N.message):String(N),error:N});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",N);return}console.error(N)},D={map:ie,forEach:function(N,k,Y){ie(N,function(){k.apply(this,arguments)},Y)},count:function(N){var k=0;return ie(N,function(){k++}),k},toArray:function(N){return ie(N,function(k){return k})||[]},only:function(N){if(!Oe(N))throw Error("React.Children.only expected to receive a single React element child.");return N}};return Ee.Activity=v,Ee.Children=D,Ee.Component=_,Ee.Fragment=d,Ee.Profiler=u,Ee.PureComponent=L,Ee.StrictMode=o,Ee.Suspense=y,Ee.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=te,Ee.__COMPILER_RUNTIME={__proto__:null,c:function(N){return te.H.useMemoCache(N)}},Ee.cache=function(N){return function(){return N.apply(null,arguments)}},Ee.cacheSignal=function(){return null},Ee.cloneElement=function(N,k,Y){if(N==null)throw Error("The argument must be a React element, but you passed "+N+".");var X=M({},N.props),se=N.key;if(k!=null)for(pe in k.key!==void 0&&(se=""+k.key),k)!ge.call(k,pe)||pe==="key"||pe==="__self"||pe==="__source"||pe==="ref"&&k.ref===void 0||(X[pe]=k[pe]);var pe=arguments.length-2;if(pe===1)X.children=Y;else if(1<pe){for(var Ae=Array(pe),B=0;B<pe;B++)Ae[B]=arguments[B+2];X.children=Ae}return ye(N.type,se,X)},Ee.createContext=function(N){return N={$$typeof:p,_currentValue:N,_currentValue2:N,_threadCount:0,Provider:null,Consumer:null},N.Provider=N,N.Consumer={$$typeof:h,_context:N},N},Ee.createElement=function(N,k,Y){var X,se={},pe=null;if(k!=null)for(X in k.key!==void 0&&(pe=""+k.key),k)ge.call(k,X)&&X!=="key"&&X!=="__self"&&X!=="__source"&&(se[X]=k[X]);var Ae=arguments.length-2;if(Ae===1)se.children=Y;else if(1<Ae){for(var B=Array(Ae),S=0;S<Ae;S++)B[S]=arguments[S+2];se.children=B}if(N&&N.defaultProps)for(X in Ae=N.defaultProps,Ae)se[X]===void 0&&(se[X]=Ae[X]);return ye(N,pe,se)},Ee.createRef=function(){return{current:null}},Ee.forwardRef=function(N){return{$$typeof:x,render:N}},Ee.isValidElement=Oe,Ee.lazy=function(N){return{$$typeof:b,_payload:{_status:-1,_result:N},_init:I}},Ee.memo=function(N,k){return{$$typeof:f,type:N,compare:k===void 0?null:k}},Ee.startTransition=function(N){var k=te.T,Y={};te.T=Y;try{var X=N(),se=te.S;se!==null&&se(Y,X),typeof X=="object"&&X!==null&&typeof X.then=="function"&&X.then(re,ue)}catch(pe){ue(pe)}finally{k!==null&&Y.types!==null&&(k.types=Y.types),te.T=k}},Ee.unstable_useCacheRefresh=function(){return te.H.useCacheRefresh()},Ee.use=function(N){return te.H.use(N)},Ee.useActionState=function(N,k,Y){return te.H.useActionState(N,k,Y)},Ee.useCallback=function(N,k){return te.H.useCallback(N,k)},Ee.useContext=function(N){return te.H.useContext(N)},Ee.useDebugValue=function(){},Ee.useDeferredValue=function(N,k){return te.H.useDeferredValue(N,k)},Ee.useEffect=function(N,k){return te.H.useEffect(N,k)},Ee.useEffectEvent=function(N){return te.H.useEffectEvent(N)},Ee.useId=function(){return te.H.useId()},Ee.useImperativeHandle=function(N,k,Y){return te.H.useImperativeHandle(N,k,Y)},Ee.useInsertionEffect=function(N,k){return te.H.useInsertionEffect(N,k)},Ee.useLayoutEffect=function(N,k){return te.H.useLayoutEffect(N,k)},Ee.useMemo=function(N,k){return te.H.useMemo(N,k)},Ee.useOptimistic=function(N,k){return te.H.useOptimistic(N,k)},Ee.useReducer=function(N,k,Y){return te.H.useReducer(N,k,Y)},Ee.useRef=function(N){return te.H.useRef(N)},Ee.useState=function(N){return te.H.useState(N)},Ee.useSyncExternalStore=function(N,k,Y){return te.H.useSyncExternalStore(N,k,Y)},Ee.useTransition=function(){return te.H.useTransition()},Ee.version="19.2.0",Ee}var Dp;function _d(){return Dp||(Dp=1,Xo.exports=Pb()),Xo.exports}var j=_d();const Sd=Cf(j);var Qo={exports:{}},Ki={},Zo={exports:{}},Wo={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Op;function Ub(){return Op||(Op=1,(function(i){function l(U,ie){var I=U.length;U.push(ie);e:for(;0<I;){var ue=I-1>>>1,D=U[ue];if(0<u(D,ie))U[ue]=ie,U[I]=D,I=ue;else break e}}function d(U){return U.length===0?null:U[0]}function o(U){if(U.length===0)return null;var ie=U[0],I=U.pop();if(I!==ie){U[0]=I;e:for(var ue=0,D=U.length,N=D>>>1;ue<N;){var k=2*(ue+1)-1,Y=U[k],X=k+1,se=U[X];if(0>u(Y,I))X<D&&0>u(se,Y)?(U[ue]=se,U[X]=I,ue=X):(U[ue]=Y,U[k]=I,ue=k);else if(X<D&&0>u(se,I))U[ue]=se,U[X]=I,ue=X;else break e}}return ie}function u(U,ie){var I=U.sortIndex-ie.sortIndex;return I!==0?I:U.id-ie.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var h=performance;i.unstable_now=function(){return h.now()}}else{var p=Date,x=p.now();i.unstable_now=function(){return p.now()-x}}var y=[],f=[],b=1,v=null,A=3,P=!1,w=!1,M=!1,H=!1,_=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;function q(U){for(var ie=d(f);ie!==null;){if(ie.callback===null)o(f);else if(ie.startTime<=U)o(f),ie.sortIndex=ie.expirationTime,l(y,ie);else break;ie=d(f)}}function oe(U){if(M=!1,q(U),!w)if(d(y)!==null)w=!0,re||(re=!0,Ce());else{var ie=d(f);ie!==null&&fe(oe,ie.startTime-U)}}var re=!1,te=-1,ge=5,ye=-1;function he(){return H?!0:!(i.unstable_now()-ye<ge)}function Oe(){if(H=!1,re){var U=i.unstable_now();ye=U;var ie=!0;try{e:{w=!1,M&&(M=!1,E(te),te=-1),P=!0;var I=A;try{a:{for(q(U),v=d(y);v!==null&&!(v.expirationTime>U&&he());){var ue=v.callback;if(typeof ue=="function"){v.callback=null,A=v.priorityLevel;var D=ue(v.expirationTime<=U);if(U=i.unstable_now(),typeof D=="function"){v.callback=D,q(U),ie=!0;break a}v===d(y)&&o(y),q(U)}else o(y);v=d(y)}if(v!==null)ie=!0;else{var N=d(f);N!==null&&fe(oe,N.startTime-U),ie=!1}}break e}finally{v=null,A=I,P=!1}ie=void 0}}finally{ie?Ce():re=!1}}}var Ce;if(typeof L=="function")Ce=function(){L(Oe)};else if(typeof MessageChannel<"u"){var Se=new MessageChannel,Z=Se.port2;Se.port1.onmessage=Oe,Ce=function(){Z.postMessage(null)}}else Ce=function(){_(Oe,0)};function fe(U,ie){te=_(function(){U(i.unstable_now())},ie)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(U){U.callback=null},i.unstable_forceFrameRate=function(U){0>U||125<U?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ge=0<U?Math.floor(1e3/U):5},i.unstable_getCurrentPriorityLevel=function(){return A},i.unstable_next=function(U){switch(A){case 1:case 2:case 3:var ie=3;break;default:ie=A}var I=A;A=ie;try{return U()}finally{A=I}},i.unstable_requestPaint=function(){H=!0},i.unstable_runWithPriority=function(U,ie){switch(U){case 1:case 2:case 3:case 4:case 5:break;default:U=3}var I=A;A=U;try{return ie()}finally{A=I}},i.unstable_scheduleCallback=function(U,ie,I){var ue=i.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?ue+I:ue):I=ue,U){case 1:var D=-1;break;case 2:D=250;break;case 5:D=1073741823;break;case 4:D=1e4;break;default:D=5e3}return D=I+D,U={id:b++,callback:ie,priorityLevel:U,startTime:I,expirationTime:D,sortIndex:-1},I>ue?(U.sortIndex=I,l(f,U),d(y)===null&&U===d(f)&&(M?(E(te),te=-1):M=!0,fe(oe,I-ue))):(U.sortIndex=D,l(y,U),w||P||(w=!0,re||(re=!0,Ce()))),U},i.unstable_shouldYield=he,i.unstable_wrapCallback=function(U){var ie=A;return function(){var I=A;A=ie;try{return U.apply(this,arguments)}finally{A=I}}}})(Wo)),Wo}var Lp;function zb(){return Lp||(Lp=1,Zo.exports=Ub()),Zo.exports}var ed={exports:{}},Ca={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pp;function Bb(){if(Pp)return Ca;Pp=1;var i=_d();function l(y){var f="https://react.dev/errors/"+y;if(1<arguments.length){f+="?args[]="+encodeURIComponent(arguments[1]);for(var b=2;b<arguments.length;b++)f+="&args[]="+encodeURIComponent(arguments[b])}return"Minified React error #"+y+"; visit "+f+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function d(){}var o={d:{f:d,r:function(){throw Error(l(522))},D:d,C:d,L:d,m:d,X:d,S:d,M:d},p:0,findDOMNode:null},u=Symbol.for("react.portal");function h(y,f,b){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:u,key:v==null?null:""+v,children:y,containerInfo:f,implementation:b}}var p=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function x(y,f){if(y==="font")return"";if(typeof f=="string")return f==="use-credentials"?f:""}return Ca.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,Ca.createPortal=function(y,f){var b=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!f||f.nodeType!==1&&f.nodeType!==9&&f.nodeType!==11)throw Error(l(299));return h(y,f,null,b)},Ca.flushSync=function(y){var f=p.T,b=o.p;try{if(p.T=null,o.p=2,y)return y()}finally{p.T=f,o.p=b,o.d.f()}},Ca.preconnect=function(y,f){typeof y=="string"&&(f?(f=f.crossOrigin,f=typeof f=="string"?f==="use-credentials"?f:"":void 0):f=null,o.d.C(y,f))},Ca.prefetchDNS=function(y){typeof y=="string"&&o.d.D(y)},Ca.preinit=function(y,f){if(typeof y=="string"&&f&&typeof f.as=="string"){var b=f.as,v=x(b,f.crossOrigin),A=typeof f.integrity=="string"?f.integrity:void 0,P=typeof f.fetchPriority=="string"?f.fetchPriority:void 0;b==="style"?o.d.S(y,typeof f.precedence=="string"?f.precedence:void 0,{crossOrigin:v,integrity:A,fetchPriority:P}):b==="script"&&o.d.X(y,{crossOrigin:v,integrity:A,fetchPriority:P,nonce:typeof f.nonce=="string"?f.nonce:void 0})}},Ca.preinitModule=function(y,f){if(typeof y=="string")if(typeof f=="object"&&f!==null){if(f.as==null||f.as==="script"){var b=x(f.as,f.crossOrigin);o.d.M(y,{crossOrigin:b,integrity:typeof f.integrity=="string"?f.integrity:void 0,nonce:typeof f.nonce=="string"?f.nonce:void 0})}}else f==null&&o.d.M(y)},Ca.preload=function(y,f){if(typeof y=="string"&&typeof f=="object"&&f!==null&&typeof f.as=="string"){var b=f.as,v=x(b,f.crossOrigin);o.d.L(y,b,{crossOrigin:v,integrity:typeof f.integrity=="string"?f.integrity:void 0,nonce:typeof f.nonce=="string"?f.nonce:void 0,type:typeof f.type=="string"?f.type:void 0,fetchPriority:typeof f.fetchPriority=="string"?f.fetchPriority:void 0,referrerPolicy:typeof f.referrerPolicy=="string"?f.referrerPolicy:void 0,imageSrcSet:typeof f.imageSrcSet=="string"?f.imageSrcSet:void 0,imageSizes:typeof f.imageSizes=="string"?f.imageSizes:void 0,media:typeof f.media=="string"?f.media:void 0})}},Ca.preloadModule=function(y,f){if(typeof y=="string")if(f){var b=x(f.as,f.crossOrigin);o.d.m(y,{as:typeof f.as=="string"&&f.as!=="script"?f.as:void 0,crossOrigin:b,integrity:typeof f.integrity=="string"?f.integrity:void 0})}else o.d.m(y)},Ca.requestFormReset=function(y){o.d.r(y)},Ca.unstable_batchedUpdates=function(y,f){return y(f)},Ca.useFormState=function(y,f,b){return p.H.useFormState(y,f,b)},Ca.useFormStatus=function(){return p.H.useHostTransitionStatus()},Ca.version="19.2.0",Ca}var Up;function Mf(){if(Up)return ed.exports;Up=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(l){console.error(l)}}return i(),ed.exports=Bb(),ed.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zp;function Fb(){if(zp)return Ki;zp=1;var i=zb(),l=_d(),d=Mf();function o(a){var t="https://react.dev/errors/"+a;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+a+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u(a){return!(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11)}function h(a){var t=a,n=a;if(a.alternate)for(;t.return;)t=t.return;else{a=t;do t=a,(t.flags&4098)!==0&&(n=t.return),a=t.return;while(a)}return t.tag===3?n:null}function p(a){if(a.tag===13){var t=a.memoizedState;if(t===null&&(a=a.alternate,a!==null&&(t=a.memoizedState)),t!==null)return t.dehydrated}return null}function x(a){if(a.tag===31){var t=a.memoizedState;if(t===null&&(a=a.alternate,a!==null&&(t=a.memoizedState)),t!==null)return t.dehydrated}return null}function y(a){if(h(a)!==a)throw Error(o(188))}function f(a){var t=a.alternate;if(!t){if(t=h(a),t===null)throw Error(o(188));return t!==a?null:a}for(var n=a,s=t;;){var r=n.return;if(r===null)break;var c=r.alternate;if(c===null){if(s=r.return,s!==null){n=s;continue}break}if(r.child===c.child){for(c=r.child;c;){if(c===n)return y(r),a;if(c===s)return y(r),t;c=c.sibling}throw Error(o(188))}if(n.return!==s.return)n=r,s=c;else{for(var m=!1,g=r.child;g;){if(g===n){m=!0,n=r,s=c;break}if(g===s){m=!0,s=r,n=c;break}g=g.sibling}if(!m){for(g=c.child;g;){if(g===n){m=!0,n=c,s=r;break}if(g===s){m=!0,s=c,n=r;break}g=g.sibling}if(!m)throw Error(o(189))}}if(n.alternate!==s)throw Error(o(190))}if(n.tag!==3)throw Error(o(188));return n.stateNode.current===n?a:t}function b(a){var t=a.tag;if(t===5||t===26||t===27||t===6)return a;for(a=a.child;a!==null;){if(t=b(a),t!==null)return t;a=a.sibling}return null}var v=Object.assign,A=Symbol.for("react.element"),P=Symbol.for("react.transitional.element"),w=Symbol.for("react.portal"),M=Symbol.for("react.fragment"),H=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),E=Symbol.for("react.consumer"),L=Symbol.for("react.context"),q=Symbol.for("react.forward_ref"),oe=Symbol.for("react.suspense"),re=Symbol.for("react.suspense_list"),te=Symbol.for("react.memo"),ge=Symbol.for("react.lazy"),ye=Symbol.for("react.activity"),he=Symbol.for("react.memo_cache_sentinel"),Oe=Symbol.iterator;function Ce(a){return a===null||typeof a!="object"?null:(a=Oe&&a[Oe]||a["@@iterator"],typeof a=="function"?a:null)}var Se=Symbol.for("react.client.reference");function Z(a){if(a==null)return null;if(typeof a=="function")return a.$$typeof===Se?null:a.displayName||a.name||null;if(typeof a=="string")return a;switch(a){case M:return"Fragment";case _:return"Profiler";case H:return"StrictMode";case oe:return"Suspense";case re:return"SuspenseList";case ye:return"Activity"}if(typeof a=="object")switch(a.$$typeof){case w:return"Portal";case L:return a.displayName||"Context";case E:return(a._context.displayName||"Context")+".Consumer";case q:var t=a.render;return a=a.displayName,a||(a=t.displayName||t.name||"",a=a!==""?"ForwardRef("+a+")":"ForwardRef"),a;case te:return t=a.displayName||null,t!==null?t:Z(a.type)||"Memo";case ge:t=a._payload,a=a._init;try{return Z(a(t))}catch{}}return null}var fe=Array.isArray,U=l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ie=d.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,I={pending:!1,data:null,method:null,action:null},ue=[],D=-1;function N(a){return{current:a}}function k(a){0>D||(a.current=ue[D],ue[D]=null,D--)}function Y(a,t){D++,ue[D]=a.current,a.current=t}var X=N(null),se=N(null),pe=N(null),Ae=N(null);function B(a,t){switch(Y(pe,t),Y(se,a),Y(X,null),t.nodeType){case 9:case 11:a=(a=t.documentElement)&&(a=a.namespaceURI)?Wh(a):0;break;default:if(a=t.tagName,t=t.namespaceURI)t=Wh(t),a=ep(t,a);else switch(a){case"svg":a=1;break;case"math":a=2;break;default:a=0}}k(X),Y(X,a)}function S(){k(X),k(se),k(pe)}function ee(a){a.memoizedState!==null&&Y(Ae,a);var t=X.current,n=ep(t,a.type);t!==n&&(Y(se,a),Y(X,n))}function Je(a){se.current===a&&(k(X),k(se)),Ae.current===a&&(k(Ae),zi._currentValue=I)}var He,R;function be(a){if(He===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);He=t&&t[1]||"",R=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+He+a+R}var ke=!1;function Ie(a,t){if(!a||ke)return"";ke=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(t){var ae=function(){throw Error()};if(Object.defineProperty(ae.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(ae,[])}catch(J){var $=J}Reflect.construct(a,[],ae)}else{try{ae.call()}catch(J){$=J}a.call(ae.prototype)}}else{try{throw Error()}catch(J){$=J}(ae=a())&&typeof ae.catch=="function"&&ae.catch(function(){})}}catch(J){if(J&&$&&typeof J.stack=="string")return[J.stack,$.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var r=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");r&&r.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var c=s.DetermineComponentFrameRoot(),m=c[0],g=c[1];if(m&&g){var T=m.split(`
`),G=g.split(`
`);for(r=s=0;s<T.length&&!T[s].includes("DetermineComponentFrameRoot");)s++;for(;r<G.length&&!G[r].includes("DetermineComponentFrameRoot");)r++;if(s===T.length||r===G.length)for(s=T.length-1,r=G.length-1;1<=s&&0<=r&&T[s]!==G[r];)r--;for(;1<=s&&0<=r;s--,r--)if(T[s]!==G[r]){if(s!==1||r!==1)do if(s--,r--,0>r||T[s]!==G[r]){var Q=`
`+T[s].replace(" at new "," at ");return a.displayName&&Q.includes("<anonymous>")&&(Q=Q.replace("<anonymous>",a.displayName)),Q}while(1<=s&&0<=r);break}}}finally{ke=!1,Error.prepareStackTrace=n}return(n=a?a.displayName||a.name:"")?be(n):""}function oa(a,t){switch(a.tag){case 26:case 27:case 5:return be(a.type);case 16:return be("Lazy");case 13:return a.child!==t&&t!==null?be("Suspense Fallback"):be("Suspense");case 19:return be("SuspenseList");case 0:case 15:return Ie(a.type,!1);case 11:return Ie(a.type.render,!1);case 1:return Ie(a.type,!0);case 31:return be("Activity");default:return""}}function Te(a){try{var t="",n=null;do t+=oa(a,n),n=a,a=a.return;while(a);return t}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var Ra=Object.prototype.hasOwnProperty,Ke=i.unstable_scheduleCallback,Oa=i.unstable_cancelCallback,Tt=i.unstable_shouldYield,We=i.unstable_requestPaint,pa=i.unstable_now,Vs=i.unstable_getCurrentPriorityLevel,An=i.unstable_ImmediatePriority,Et=i.unstable_UserBlockingPriority,vt=i.unstable_NormalPriority,Js=i.unstable_LowPriority,ja=i.unstable_IdlePriority,Xs=i.log,O=i.unstable_setDisableYieldValue,le=null,me=null;function sa(a){if(typeof Xs=="function"&&O(a),me&&typeof me.setStrictMode=="function")try{me.setStrictMode(le,a)}catch{}}var ya=Math.clz32?Math.clz32:Qn,Tn=Math.log,Qs=Math.LN2;function Qn(a){return a>>>=0,a===0?32:31-(Tn(a)/Qs|0)|0}var en=256,Ct=262144,ut=4194304;function Mt(a){var t=a&42;if(t!==0)return t;switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return a&261888;case 262144:case 524288:case 1048576:case 2097152:return a&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return a&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return a}}function Zn(a,t,n){var s=a.pendingLanes;if(s===0)return 0;var r=0,c=a.suspendedLanes,m=a.pingedLanes;a=a.warmLanes;var g=s&134217727;return g!==0?(s=g&~c,s!==0?r=Mt(s):(m&=g,m!==0?r=Mt(m):n||(n=g&~a,n!==0&&(r=Mt(n))))):(g=s&~c,g!==0?r=Mt(g):m!==0?r=Mt(m):n||(n=s&~a,n!==0&&(r=Mt(n)))),r===0?0:t!==0&&t!==r&&(t&c)===0&&(c=r&-r,n=t&-t,c>=n||c===32&&(n&4194048)!==0)?t:r}function En(a,t){return(a.pendingLanes&~(a.suspendedLanes&~a.pingedLanes)&t)===0}function Zs(a,t){switch(a){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function sl(){var a=ut;return ut<<=1,(ut&62914560)===0&&(ut=4194304),a}function F(a){for(var t=[],n=0;31>n;n++)t.push(a);return t}function ne(a,t){a.pendingLanes|=t,t!==268435456&&(a.suspendedLanes=0,a.pingedLanes=0,a.warmLanes=0)}function je(a,t,n,s,r,c){var m=a.pendingLanes;a.pendingLanes=n,a.suspendedLanes=0,a.pingedLanes=0,a.warmLanes=0,a.expiredLanes&=n,a.entangledLanes&=n,a.errorRecoveryDisabledLanes&=n,a.shellSuspendCounter=0;var g=a.entanglements,T=a.expirationTimes,G=a.hiddenUpdates;for(n=m&~n;0<n;){var Q=31-ya(n),ae=1<<Q;g[Q]=0,T[Q]=-1;var $=G[Q];if($!==null)for(G[Q]=null,Q=0;Q<$.length;Q++){var J=$[Q];J!==null&&(J.lane&=-536870913)}n&=~ae}s!==0&&Ge(a,s,0),c!==0&&r===0&&a.tag!==0&&(a.suspendedLanes|=c&~(m&~t))}function Ge(a,t,n){a.pendingLanes|=t,a.suspendedLanes&=~t;var s=31-ya(t);a.entangledLanes|=t,a.entanglements[s]=a.entanglements[s]|1073741824|n&261930}function Ue(a,t){var n=a.entangledLanes|=t;for(a=a.entanglements;n;){var s=31-ya(n),r=1<<s;r&t|a[s]&t&&(a[s]|=t),n&=~r}}function an(a,t){var n=t&-t;return n=(n&42)!==0?1:La(n),(n&(a.suspendedLanes|t))!==0?0:n}function La(a){switch(a){case 2:a=1;break;case 8:a=4;break;case 32:a=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:a=128;break;case 268435456:a=134217728;break;default:a=0}return a}function et(a){return a&=-a,2<a?8<a?(a&134217727)!==0?32:268435456:8:2}function zd(){var a=ie.p;return a!==0?a:(a=window.event,a===void 0?32:kp(a.type))}function Bd(a,t){var n=ie.p;try{return ie.p=a,t()}finally{ie.p=n}}var tn=Math.random().toString(36).slice(2),Sa="__reactFiber$"+tn,Pa="__reactProps$"+tn,Wn="__reactContainer$"+tn,Br="__reactEvents$"+tn,kg="__reactListeners$"+tn,_g="__reactHandles$"+tn,Fd="__reactResources$"+tn,Ws="__reactMarker$"+tn;function Fr(a){delete a[Sa],delete a[Pa],delete a[Br],delete a[kg],delete a[_g]}function es(a){var t=a[Sa];if(t)return t;for(var n=a.parentNode;n;){if(t=n[Wn]||n[Sa]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(a=rp(a);a!==null;){if(n=a[Sa])return n;a=rp(a)}return t}a=n,n=a.parentNode}return null}function as(a){if(a=a[Sa]||a[Wn]){var t=a.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return a}return null}function ei(a){var t=a.tag;if(t===5||t===26||t===27||t===6)return a.stateNode;throw Error(o(33))}function ts(a){var t=a[Fd];return t||(t=a[Fd]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Na(a){a[Ws]=!0}var Hd=new Set,Id={};function Cn(a,t){ns(a,t),ns(a+"Capture",t)}function ns(a,t){for(Id[a]=t,a=0;a<t.length;a++)Hd.add(t[a])}var Sg=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Kd={},qd={};function wg(a){return Ra.call(qd,a)?!0:Ra.call(Kd,a)?!1:Sg.test(a)?qd[a]=!0:(Kd[a]=!0,!1)}function il(a,t,n){if(wg(t))if(n===null)a.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":a.removeAttribute(t);return;case"boolean":var s=t.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){a.removeAttribute(t);return}}a.setAttribute(t,""+n)}}function ll(a,t,n){if(n===null)a.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":a.removeAttribute(t);return}a.setAttribute(t,""+n)}}function Rt(a,t,n,s){if(s===null)a.removeAttribute(n);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":a.removeAttribute(n);return}a.setAttributeNS(t,n,""+s)}}function at(a){switch(typeof a){case"bigint":case"boolean":case"number":case"string":case"undefined":return a;case"object":return a;default:return""}}function Gd(a){var t=a.type;return(a=a.nodeName)&&a.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ag(a,t,n){var s=Object.getOwnPropertyDescriptor(a.constructor.prototype,t);if(!a.hasOwnProperty(t)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var r=s.get,c=s.set;return Object.defineProperty(a,t,{configurable:!0,get:function(){return r.call(this)},set:function(m){n=""+m,c.call(this,m)}}),Object.defineProperty(a,t,{enumerable:s.enumerable}),{getValue:function(){return n},setValue:function(m){n=""+m},stopTracking:function(){a._valueTracker=null,delete a[t]}}}}function Hr(a){if(!a._valueTracker){var t=Gd(a)?"checked":"value";a._valueTracker=Ag(a,t,""+a[t])}}function $d(a){if(!a)return!1;var t=a._valueTracker;if(!t)return!0;var n=t.getValue(),s="";return a&&(s=Gd(a)?a.checked?"true":"false":a.value),a=s,a!==n?(t.setValue(a),!0):!1}function rl(a){if(a=a||(typeof document<"u"?document:void 0),typeof a>"u")return null;try{return a.activeElement||a.body}catch{return a.body}}var Tg=/[\n"\\]/g;function tt(a){return a.replace(Tg,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Ir(a,t,n,s,r,c,m,g){a.name="",m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"?a.type=m:a.removeAttribute("type"),t!=null?m==="number"?(t===0&&a.value===""||a.value!=t)&&(a.value=""+at(t)):a.value!==""+at(t)&&(a.value=""+at(t)):m!=="submit"&&m!=="reset"||a.removeAttribute("value"),t!=null?Kr(a,m,at(t)):n!=null?Kr(a,m,at(n)):s!=null&&a.removeAttribute("value"),r==null&&c!=null&&(a.defaultChecked=!!c),r!=null&&(a.checked=r&&typeof r!="function"&&typeof r!="symbol"),g!=null&&typeof g!="function"&&typeof g!="symbol"&&typeof g!="boolean"?a.name=""+at(g):a.removeAttribute("name")}function Yd(a,t,n,s,r,c,m,g){if(c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(a.type=c),t!=null||n!=null){if(!(c!=="submit"&&c!=="reset"||t!=null)){Hr(a);return}n=n!=null?""+at(n):"",t=t!=null?""+at(t):n,g||t===a.value||(a.value=t),a.defaultValue=t}s=s??r,s=typeof s!="function"&&typeof s!="symbol"&&!!s,a.checked=g?a.checked:!!s,a.defaultChecked=!!s,m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"&&(a.name=m),Hr(a)}function Kr(a,t,n){t==="number"&&rl(a.ownerDocument)===a||a.defaultValue===""+n||(a.defaultValue=""+n)}function ss(a,t,n,s){if(a=a.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<a.length;n++)r=t.hasOwnProperty("$"+a[n].value),a[n].selected!==r&&(a[n].selected=r),r&&s&&(a[n].defaultSelected=!0)}else{for(n=""+at(n),t=null,r=0;r<a.length;r++){if(a[r].value===n){a[r].selected=!0,s&&(a[r].defaultSelected=!0);return}t!==null||a[r].disabled||(t=a[r])}t!==null&&(t.selected=!0)}}function Vd(a,t,n){if(t!=null&&(t=""+at(t),t!==a.value&&(a.value=t),n==null)){a.defaultValue!==t&&(a.defaultValue=t);return}a.defaultValue=n!=null?""+at(n):""}function Jd(a,t,n,s){if(t==null){if(s!=null){if(n!=null)throw Error(o(92));if(fe(s)){if(1<s.length)throw Error(o(93));s=s[0]}n=s}n==null&&(n=""),t=n}n=at(t),a.defaultValue=n,s=a.textContent,s===n&&s!==""&&s!==null&&(a.value=s),Hr(a)}function is(a,t){if(t){var n=a.firstChild;if(n&&n===a.lastChild&&n.nodeType===3){n.nodeValue=t;return}}a.textContent=t}var Eg=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Xd(a,t,n){var s=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?s?a.setProperty(t,""):t==="float"?a.cssFloat="":a[t]="":s?a.setProperty(t,n):typeof n!="number"||n===0||Eg.has(t)?t==="float"?a.cssFloat=n:a[t]=(""+n).trim():a[t]=n+"px"}function Qd(a,t,n){if(t!=null&&typeof t!="object")throw Error(o(62));if(a=a.style,n!=null){for(var s in n)!n.hasOwnProperty(s)||t!=null&&t.hasOwnProperty(s)||(s.indexOf("--")===0?a.setProperty(s,""):s==="float"?a.cssFloat="":a[s]="");for(var r in t)s=t[r],t.hasOwnProperty(r)&&n[r]!==s&&Xd(a,r,s)}else for(var c in t)t.hasOwnProperty(c)&&Xd(a,c,t[c])}function qr(a){if(a.indexOf("-")===-1)return!1;switch(a){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Cg=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Mg=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cl(a){return Mg.test(""+a)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":a}function Dt(){}var Gr=null;function $r(a){return a=a.target||a.srcElement||window,a.correspondingUseElement&&(a=a.correspondingUseElement),a.nodeType===3?a.parentNode:a}var ls=null,rs=null;function Zd(a){var t=as(a);if(t&&(a=t.stateNode)){var n=a[Pa]||null;e:switch(a=t.stateNode,t.type){case"input":if(Ir(a,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=a;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+tt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var s=n[t];if(s!==a&&s.form===a.form){var r=s[Pa]||null;if(!r)throw Error(o(90));Ir(s,r.value,r.defaultValue,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name)}}for(t=0;t<n.length;t++)s=n[t],s.form===a.form&&$d(s)}break e;case"textarea":Vd(a,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ss(a,!!n.multiple,t,!1)}}}var Yr=!1;function Wd(a,t,n){if(Yr)return a(t,n);Yr=!0;try{var s=a(t);return s}finally{if(Yr=!1,(ls!==null||rs!==null)&&(Jl(),ls&&(t=ls,a=rs,rs=ls=null,Zd(t),a)))for(t=0;t<a.length;t++)Zd(a[t])}}function ai(a,t){var n=a.stateNode;if(n===null)return null;var s=n[Pa]||null;if(s===null)return null;n=s[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(a=a.type,s=!(a==="button"||a==="input"||a==="select"||a==="textarea")),a=!s;break e;default:a=!1}if(a)return null;if(n&&typeof n!="function")throw Error(o(231,t,typeof n));return n}var Ot=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Vr=!1;if(Ot)try{var ti={};Object.defineProperty(ti,"passive",{get:function(){Vr=!0}}),window.addEventListener("test",ti,ti),window.removeEventListener("test",ti,ti)}catch{Vr=!1}var nn=null,Jr=null,ol=null;function eu(){if(ol)return ol;var a,t=Jr,n=t.length,s,r="value"in nn?nn.value:nn.textContent,c=r.length;for(a=0;a<n&&t[a]===r[a];a++);var m=n-a;for(s=1;s<=m&&t[n-s]===r[c-s];s++);return ol=r.slice(a,1<s?1-s:void 0)}function dl(a){var t=a.keyCode;return"charCode"in a?(a=a.charCode,a===0&&t===13&&(a=13)):a=t,a===10&&(a=13),32<=a||a===13?a:0}function ul(){return!0}function au(){return!1}function Ua(a){function t(n,s,r,c,m){this._reactName=n,this._targetInst=r,this.type=s,this.nativeEvent=c,this.target=m,this.currentTarget=null;for(var g in a)a.hasOwnProperty(g)&&(n=a[g],this[g]=n?n(c):c[g]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?ul:au,this.isPropagationStopped=au,this}return v(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ul)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ul)},persist:function(){},isPersistent:ul}),t}var Mn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ml=Ua(Mn),ni=v({},Mn,{view:0,detail:0}),Rg=Ua(ni),Xr,Qr,si,hl=v({},ni,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Wr,button:0,buttons:0,relatedTarget:function(a){return a.relatedTarget===void 0?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){return"movementX"in a?a.movementX:(a!==si&&(si&&a.type==="mousemove"?(Xr=a.screenX-si.screenX,Qr=a.screenY-si.screenY):Qr=Xr=0,si=a),Xr)},movementY:function(a){return"movementY"in a?a.movementY:Qr}}),tu=Ua(hl),Dg=v({},hl,{dataTransfer:0}),Og=Ua(Dg),Lg=v({},ni,{relatedTarget:0}),Zr=Ua(Lg),Pg=v({},Mn,{animationName:0,elapsedTime:0,pseudoElement:0}),Ug=Ua(Pg),zg=v({},Mn,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Bg=Ua(zg),Fg=v({},Mn,{data:0}),nu=Ua(Fg),Hg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ig={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Kg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function qg(a){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(a):(a=Kg[a])?!!t[a]:!1}function Wr(){return qg}var Gg=v({},ni,{key:function(a){if(a.key){var t=Hg[a.key]||a.key;if(t!=="Unidentified")return t}return a.type==="keypress"?(a=dl(a),a===13?"Enter":String.fromCharCode(a)):a.type==="keydown"||a.type==="keyup"?Ig[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Wr,charCode:function(a){return a.type==="keypress"?dl(a):0},keyCode:function(a){return a.type==="keydown"||a.type==="keyup"?a.keyCode:0},which:function(a){return a.type==="keypress"?dl(a):a.type==="keydown"||a.type==="keyup"?a.keyCode:0}}),$g=Ua(Gg),Yg=v({},hl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),su=Ua(Yg),Vg=v({},ni,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Wr}),Jg=Ua(Vg),Xg=v({},Mn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qg=Ua(Xg),Zg=v({},hl,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Wg=Ua(Zg),ex=v({},Mn,{newState:0,oldState:0}),ax=Ua(ex),tx=[9,13,27,32],ec=Ot&&"CompositionEvent"in window,ii=null;Ot&&"documentMode"in document&&(ii=document.documentMode);var nx=Ot&&"TextEvent"in window&&!ii,iu=Ot&&(!ec||ii&&8<ii&&11>=ii),lu=" ",ru=!1;function cu(a,t){switch(a){case"keyup":return tx.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ou(a){return a=a.detail,typeof a=="object"&&"data"in a?a.data:null}var cs=!1;function sx(a,t){switch(a){case"compositionend":return ou(t);case"keypress":return t.which!==32?null:(ru=!0,lu);case"textInput":return a=t.data,a===lu&&ru?null:a;default:return null}}function ix(a,t){if(cs)return a==="compositionend"||!ec&&cu(a,t)?(a=eu(),ol=Jr=nn=null,cs=!1,a):null;switch(a){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return iu&&t.locale!=="ko"?null:t.data;default:return null}}var lx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function du(a){var t=a&&a.nodeName&&a.nodeName.toLowerCase();return t==="input"?!!lx[a.type]:t==="textarea"}function uu(a,t,n,s){ls?rs?rs.push(s):rs=[s]:ls=s,t=tr(t,"onChange"),0<t.length&&(n=new ml("onChange","change",null,n,s),a.push({event:n,listeners:t}))}var li=null,ri=null;function rx(a){Yh(a,0)}function pl(a){var t=ei(a);if($d(t))return a}function mu(a,t){if(a==="change")return t}var hu=!1;if(Ot){var ac;if(Ot){var tc="oninput"in document;if(!tc){var pu=document.createElement("div");pu.setAttribute("oninput","return;"),tc=typeof pu.oninput=="function"}ac=tc}else ac=!1;hu=ac&&(!document.documentMode||9<document.documentMode)}function fu(){li&&(li.detachEvent("onpropertychange",gu),ri=li=null)}function gu(a){if(a.propertyName==="value"&&pl(ri)){var t=[];uu(t,ri,a,$r(a)),Wd(rx,t)}}function cx(a,t,n){a==="focusin"?(fu(),li=t,ri=n,li.attachEvent("onpropertychange",gu)):a==="focusout"&&fu()}function ox(a){if(a==="selectionchange"||a==="keyup"||a==="keydown")return pl(ri)}function dx(a,t){if(a==="click")return pl(t)}function ux(a,t){if(a==="input"||a==="change")return pl(t)}function mx(a,t){return a===t&&(a!==0||1/a===1/t)||a!==a&&t!==t}var $a=typeof Object.is=="function"?Object.is:mx;function ci(a,t){if($a(a,t))return!0;if(typeof a!="object"||a===null||typeof t!="object"||t===null)return!1;var n=Object.keys(a),s=Object.keys(t);if(n.length!==s.length)return!1;for(s=0;s<n.length;s++){var r=n[s];if(!Ra.call(t,r)||!$a(a[r],t[r]))return!1}return!0}function xu(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function bu(a,t){var n=xu(a);a=0;for(var s;n;){if(n.nodeType===3){if(s=a+n.textContent.length,a<=t&&s>=t)return{node:n,offset:t-a};a=s}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=xu(n)}}function ju(a,t){return a&&t?a===t?!0:a&&a.nodeType===3?!1:t&&t.nodeType===3?ju(a,t.parentNode):"contains"in a?a.contains(t):a.compareDocumentPosition?!!(a.compareDocumentPosition(t)&16):!1:!1}function vu(a){a=a!=null&&a.ownerDocument!=null&&a.ownerDocument.defaultView!=null?a.ownerDocument.defaultView:window;for(var t=rl(a.document);t instanceof a.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)a=t.contentWindow;else break;t=rl(a.document)}return t}function nc(a){var t=a&&a.nodeName&&a.nodeName.toLowerCase();return t&&(t==="input"&&(a.type==="text"||a.type==="search"||a.type==="tel"||a.type==="url"||a.type==="password")||t==="textarea"||a.contentEditable==="true")}var hx=Ot&&"documentMode"in document&&11>=document.documentMode,os=null,sc=null,oi=null,ic=!1;function yu(a,t,n){var s=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ic||os==null||os!==rl(s)||(s=os,"selectionStart"in s&&nc(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),oi&&ci(oi,s)||(oi=s,s=tr(sc,"onSelect"),0<s.length&&(t=new ml("onSelect","select",null,t,n),a.push({event:t,listeners:s}),t.target=os)))}function Rn(a,t){var n={};return n[a.toLowerCase()]=t.toLowerCase(),n["Webkit"+a]="webkit"+t,n["Moz"+a]="moz"+t,n}var ds={animationend:Rn("Animation","AnimationEnd"),animationiteration:Rn("Animation","AnimationIteration"),animationstart:Rn("Animation","AnimationStart"),transitionrun:Rn("Transition","TransitionRun"),transitionstart:Rn("Transition","TransitionStart"),transitioncancel:Rn("Transition","TransitionCancel"),transitionend:Rn("Transition","TransitionEnd")},lc={},Nu={};Ot&&(Nu=document.createElement("div").style,"AnimationEvent"in window||(delete ds.animationend.animation,delete ds.animationiteration.animation,delete ds.animationstart.animation),"TransitionEvent"in window||delete ds.transitionend.transition);function Dn(a){if(lc[a])return lc[a];if(!ds[a])return a;var t=ds[a],n;for(n in t)if(t.hasOwnProperty(n)&&n in Nu)return lc[a]=t[n];return a}var ku=Dn("animationend"),_u=Dn("animationiteration"),Su=Dn("animationstart"),px=Dn("transitionrun"),fx=Dn("transitionstart"),gx=Dn("transitioncancel"),wu=Dn("transitionend"),Au=new Map,rc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");rc.push("scrollEnd");function mt(a,t){Au.set(a,t),Cn(t,[a])}var fl=typeof reportError=="function"?reportError:function(a){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof a=="object"&&a!==null&&typeof a.message=="string"?String(a.message):String(a),error:a});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",a);return}console.error(a)},nt=[],us=0,cc=0;function gl(){for(var a=us,t=cc=us=0;t<a;){var n=nt[t];nt[t++]=null;var s=nt[t];nt[t++]=null;var r=nt[t];nt[t++]=null;var c=nt[t];if(nt[t++]=null,s!==null&&r!==null){var m=s.pending;m===null?r.next=r:(r.next=m.next,m.next=r),s.pending=r}c!==0&&Tu(n,r,c)}}function xl(a,t,n,s){nt[us++]=a,nt[us++]=t,nt[us++]=n,nt[us++]=s,cc|=s,a.lanes|=s,a=a.alternate,a!==null&&(a.lanes|=s)}function oc(a,t,n,s){return xl(a,t,n,s),bl(a)}function On(a,t){return xl(a,null,null,t),bl(a)}function Tu(a,t,n){a.lanes|=n;var s=a.alternate;s!==null&&(s.lanes|=n);for(var r=!1,c=a.return;c!==null;)c.childLanes|=n,s=c.alternate,s!==null&&(s.childLanes|=n),c.tag===22&&(a=c.stateNode,a===null||a._visibility&1||(r=!0)),a=c,c=c.return;return a.tag===3?(c=a.stateNode,r&&t!==null&&(r=31-ya(n),a=c.hiddenUpdates,s=a[r],s===null?a[r]=[t]:s.push(t),t.lane=n|536870912),c):null}function bl(a){if(50<Mi)throw Mi=0,jo=null,Error(o(185));for(var t=a.return;t!==null;)a=t,t=a.return;return a.tag===3?a.stateNode:null}var ms={};function xx(a,t,n,s){this.tag=a,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ya(a,t,n,s){return new xx(a,t,n,s)}function dc(a){return a=a.prototype,!(!a||!a.isReactComponent)}function Lt(a,t){var n=a.alternate;return n===null?(n=Ya(a.tag,t,a.key,a.mode),n.elementType=a.elementType,n.type=a.type,n.stateNode=a.stateNode,n.alternate=a,a.alternate=n):(n.pendingProps=t,n.type=a.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=a.flags&65011712,n.childLanes=a.childLanes,n.lanes=a.lanes,n.child=a.child,n.memoizedProps=a.memoizedProps,n.memoizedState=a.memoizedState,n.updateQueue=a.updateQueue,t=a.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=a.sibling,n.index=a.index,n.ref=a.ref,n.refCleanup=a.refCleanup,n}function Eu(a,t){a.flags&=65011714;var n=a.alternate;return n===null?(a.childLanes=0,a.lanes=t,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,a.type=n.type,t=n.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),a}function jl(a,t,n,s,r,c){var m=0;if(s=a,typeof a=="function")dc(a)&&(m=1);else if(typeof a=="string")m=Nb(a,n,X.current)?26:a==="html"||a==="head"||a==="body"?27:5;else e:switch(a){case ye:return a=Ya(31,n,t,r),a.elementType=ye,a.lanes=c,a;case M:return Ln(n.children,r,c,t);case H:m=8,r|=24;break;case _:return a=Ya(12,n,t,r|2),a.elementType=_,a.lanes=c,a;case oe:return a=Ya(13,n,t,r),a.elementType=oe,a.lanes=c,a;case re:return a=Ya(19,n,t,r),a.elementType=re,a.lanes=c,a;default:if(typeof a=="object"&&a!==null)switch(a.$$typeof){case L:m=10;break e;case E:m=9;break e;case q:m=11;break e;case te:m=14;break e;case ge:m=16,s=null;break e}m=29,n=Error(o(130,a===null?"null":typeof a,"")),s=null}return t=Ya(m,n,t,r),t.elementType=a,t.type=s,t.lanes=c,t}function Ln(a,t,n,s){return a=Ya(7,a,s,t),a.lanes=n,a}function uc(a,t,n){return a=Ya(6,a,null,t),a.lanes=n,a}function Cu(a){var t=Ya(18,null,null,0);return t.stateNode=a,t}function mc(a,t,n){return t=Ya(4,a.children!==null?a.children:[],a.key,t),t.lanes=n,t.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation},t}var Mu=new WeakMap;function st(a,t){if(typeof a=="object"&&a!==null){var n=Mu.get(a);return n!==void 0?n:(t={value:a,source:t,stack:Te(t)},Mu.set(a,t),t)}return{value:a,source:t,stack:Te(t)}}var hs=[],ps=0,vl=null,di=0,it=[],lt=0,sn=null,yt=1,Nt="";function Pt(a,t){hs[ps++]=di,hs[ps++]=vl,vl=a,di=t}function Ru(a,t,n){it[lt++]=yt,it[lt++]=Nt,it[lt++]=sn,sn=a;var s=yt;a=Nt;var r=32-ya(s)-1;s&=~(1<<r),n+=1;var c=32-ya(t)+r;if(30<c){var m=r-r%5;c=(s&(1<<m)-1).toString(32),s>>=m,r-=m,yt=1<<32-ya(t)+r|n<<r|s,Nt=c+a}else yt=1<<c|n<<r|s,Nt=a}function hc(a){a.return!==null&&(Pt(a,1),Ru(a,1,0))}function pc(a){for(;a===vl;)vl=hs[--ps],hs[ps]=null,di=hs[--ps],hs[ps]=null;for(;a===sn;)sn=it[--lt],it[lt]=null,Nt=it[--lt],it[lt]=null,yt=it[--lt],it[lt]=null}function Du(a,t){it[lt++]=yt,it[lt++]=Nt,it[lt++]=sn,yt=t.id,Nt=t.overflow,sn=a}var wa=null,ia=null,Fe=!1,ln=null,rt=!1,fc=Error(o(519));function rn(a){var t=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ui(st(t,a)),fc}function Ou(a){var t=a.stateNode,n=a.type,s=a.memoizedProps;switch(t[Sa]=a,t[Pa]=s,n){case"dialog":Pe("cancel",t),Pe("close",t);break;case"iframe":case"object":case"embed":Pe("load",t);break;case"video":case"audio":for(n=0;n<Di.length;n++)Pe(Di[n],t);break;case"source":Pe("error",t);break;case"img":case"image":case"link":Pe("error",t),Pe("load",t);break;case"details":Pe("toggle",t);break;case"input":Pe("invalid",t),Yd(t,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":Pe("invalid",t);break;case"textarea":Pe("invalid",t),Jd(t,s.value,s.defaultValue,s.children)}n=s.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||s.suppressHydrationWarning===!0||Qh(t.textContent,n)?(s.popover!=null&&(Pe("beforetoggle",t),Pe("toggle",t)),s.onScroll!=null&&Pe("scroll",t),s.onScrollEnd!=null&&Pe("scrollend",t),s.onClick!=null&&(t.onclick=Dt),t=!0):t=!1,t||rn(a,!0)}function Lu(a){for(wa=a.return;wa;)switch(wa.tag){case 5:case 31:case 13:rt=!1;return;case 27:case 3:rt=!0;return;default:wa=wa.return}}function fs(a){if(a!==wa)return!1;if(!Fe)return Lu(a),Fe=!0,!1;var t=a.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=a.type,n=!(n!=="form"&&n!=="button")||Oo(a.type,a.memoizedProps)),n=!n),n&&ia&&rn(a),Lu(a),t===13){if(a=a.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(o(317));ia=lp(a)}else if(t===31){if(a=a.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(o(317));ia=lp(a)}else t===27?(t=ia,yn(a.type)?(a=Bo,Bo=null,ia=a):ia=t):ia=wa?ot(a.stateNode.nextSibling):null;return!0}function Pn(){ia=wa=null,Fe=!1}function gc(){var a=ln;return a!==null&&(Ha===null?Ha=a:Ha.push.apply(Ha,a),ln=null),a}function ui(a){ln===null?ln=[a]:ln.push(a)}var xc=N(null),Un=null,Ut=null;function cn(a,t,n){Y(xc,t._currentValue),t._currentValue=n}function zt(a){a._currentValue=xc.current,k(xc)}function bc(a,t,n){for(;a!==null;){var s=a.alternate;if((a.childLanes&t)!==t?(a.childLanes|=t,s!==null&&(s.childLanes|=t)):s!==null&&(s.childLanes&t)!==t&&(s.childLanes|=t),a===n)break;a=a.return}}function jc(a,t,n,s){var r=a.child;for(r!==null&&(r.return=a);r!==null;){var c=r.dependencies;if(c!==null){var m=r.child;c=c.firstContext;e:for(;c!==null;){var g=c;c=r;for(var T=0;T<t.length;T++)if(g.context===t[T]){c.lanes|=n,g=c.alternate,g!==null&&(g.lanes|=n),bc(c.return,n,a),s||(m=null);break e}c=g.next}}else if(r.tag===18){if(m=r.return,m===null)throw Error(o(341));m.lanes|=n,c=m.alternate,c!==null&&(c.lanes|=n),bc(m,n,a),m=null}else m=r.child;if(m!==null)m.return=r;else for(m=r;m!==null;){if(m===a){m=null;break}if(r=m.sibling,r!==null){r.return=m.return,m=r;break}m=m.return}r=m}}function gs(a,t,n,s){a=null;for(var r=t,c=!1;r!==null;){if(!c){if((r.flags&524288)!==0)c=!0;else if((r.flags&262144)!==0)break}if(r.tag===10){var m=r.alternate;if(m===null)throw Error(o(387));if(m=m.memoizedProps,m!==null){var g=r.type;$a(r.pendingProps.value,m.value)||(a!==null?a.push(g):a=[g])}}else if(r===Ae.current){if(m=r.alternate,m===null)throw Error(o(387));m.memoizedState.memoizedState!==r.memoizedState.memoizedState&&(a!==null?a.push(zi):a=[zi])}r=r.return}a!==null&&jc(t,a,n,s),t.flags|=262144}function yl(a){for(a=a.firstContext;a!==null;){if(!$a(a.context._currentValue,a.memoizedValue))return!0;a=a.next}return!1}function zn(a){Un=a,Ut=null,a=a.dependencies,a!==null&&(a.firstContext=null)}function Aa(a){return Pu(Un,a)}function Nl(a,t){return Un===null&&zn(a),Pu(a,t)}function Pu(a,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Ut===null){if(a===null)throw Error(o(308));Ut=t,a.dependencies={lanes:0,firstContext:t},a.flags|=524288}else Ut=Ut.next=t;return n}var bx=typeof AbortController<"u"?AbortController:function(){var a=[],t=this.signal={aborted:!1,addEventListener:function(n,s){a.push(s)}};this.abort=function(){t.aborted=!0,a.forEach(function(n){return n()})}},jx=i.unstable_scheduleCallback,vx=i.unstable_NormalPriority,fa={$$typeof:L,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function vc(){return{controller:new bx,data:new Map,refCount:0}}function mi(a){a.refCount--,a.refCount===0&&jx(vx,function(){a.controller.abort()})}var hi=null,yc=0,xs=0,bs=null;function yx(a,t){if(hi===null){var n=hi=[];yc=0,xs=So(),bs={status:"pending",value:void 0,then:function(s){n.push(s)}}}return yc++,t.then(Uu,Uu),t}function Uu(){if(--yc===0&&hi!==null){bs!==null&&(bs.status="fulfilled");var a=hi;hi=null,xs=0,bs=null;for(var t=0;t<a.length;t++)(0,a[t])()}}function Nx(a,t){var n=[],s={status:"pending",value:null,reason:null,then:function(r){n.push(r)}};return a.then(function(){s.status="fulfilled",s.value=t;for(var r=0;r<n.length;r++)(0,n[r])(t)},function(r){for(s.status="rejected",s.reason=r,r=0;r<n.length;r++)(0,n[r])(void 0)}),s}var zu=U.S;U.S=function(a,t){yh=pa(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&yx(a,t),zu!==null&&zu(a,t)};var Bn=N(null);function Nc(){var a=Bn.current;return a!==null?a:na.pooledCache}function kl(a,t){t===null?Y(Bn,Bn.current):Y(Bn,t.pool)}function Bu(){var a=Nc();return a===null?null:{parent:fa._currentValue,pool:a}}var js=Error(o(460)),kc=Error(o(474)),_l=Error(o(542)),Sl={then:function(){}};function Fu(a){return a=a.status,a==="fulfilled"||a==="rejected"}function Hu(a,t,n){switch(n=a[n],n===void 0?a.push(t):n!==t&&(t.then(Dt,Dt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw a=t.reason,Ku(a),a;default:if(typeof t.status=="string")t.then(Dt,Dt);else{if(a=na,a!==null&&100<a.shellSuspendCounter)throw Error(o(482));a=t,a.status="pending",a.then(function(s){if(t.status==="pending"){var r=t;r.status="fulfilled",r.value=s}},function(s){if(t.status==="pending"){var r=t;r.status="rejected",r.reason=s}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw a=t.reason,Ku(a),a}throw Hn=t,js}}function Fn(a){try{var t=a._init;return t(a._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Hn=n,js):n}}var Hn=null;function Iu(){if(Hn===null)throw Error(o(459));var a=Hn;return Hn=null,a}function Ku(a){if(a===js||a===_l)throw Error(o(483))}var vs=null,pi=0;function wl(a){var t=pi;return pi+=1,vs===null&&(vs=[]),Hu(vs,a,t)}function fi(a,t){t=t.props.ref,a.ref=t!==void 0?t:null}function Al(a,t){throw t.$$typeof===A?Error(o(525)):(a=Object.prototype.toString.call(t),Error(o(31,a==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":a)))}function qu(a){function t(z,C){if(a){var K=z.deletions;K===null?(z.deletions=[C],z.flags|=16):K.push(C)}}function n(z,C){if(!a)return null;for(;C!==null;)t(z,C),C=C.sibling;return null}function s(z){for(var C=new Map;z!==null;)z.key!==null?C.set(z.key,z):C.set(z.index,z),z=z.sibling;return C}function r(z,C){return z=Lt(z,C),z.index=0,z.sibling=null,z}function c(z,C,K){return z.index=K,a?(K=z.alternate,K!==null?(K=K.index,K<C?(z.flags|=67108866,C):K):(z.flags|=67108866,C)):(z.flags|=1048576,C)}function m(z){return a&&z.alternate===null&&(z.flags|=67108866),z}function g(z,C,K,W){return C===null||C.tag!==6?(C=uc(K,z.mode,W),C.return=z,C):(C=r(C,K),C.return=z,C)}function T(z,C,K,W){var Ne=K.type;return Ne===M?Q(z,C,K.props.children,W,K.key):C!==null&&(C.elementType===Ne||typeof Ne=="object"&&Ne!==null&&Ne.$$typeof===ge&&Fn(Ne)===C.type)?(C=r(C,K.props),fi(C,K),C.return=z,C):(C=jl(K.type,K.key,K.props,null,z.mode,W),fi(C,K),C.return=z,C)}function G(z,C,K,W){return C===null||C.tag!==4||C.stateNode.containerInfo!==K.containerInfo||C.stateNode.implementation!==K.implementation?(C=mc(K,z.mode,W),C.return=z,C):(C=r(C,K.children||[]),C.return=z,C)}function Q(z,C,K,W,Ne){return C===null||C.tag!==7?(C=Ln(K,z.mode,W,Ne),C.return=z,C):(C=r(C,K),C.return=z,C)}function ae(z,C,K){if(typeof C=="string"&&C!==""||typeof C=="number"||typeof C=="bigint")return C=uc(""+C,z.mode,K),C.return=z,C;if(typeof C=="object"&&C!==null){switch(C.$$typeof){case P:return K=jl(C.type,C.key,C.props,null,z.mode,K),fi(K,C),K.return=z,K;case w:return C=mc(C,z.mode,K),C.return=z,C;case ge:return C=Fn(C),ae(z,C,K)}if(fe(C)||Ce(C))return C=Ln(C,z.mode,K,null),C.return=z,C;if(typeof C.then=="function")return ae(z,wl(C),K);if(C.$$typeof===L)return ae(z,Nl(z,C),K);Al(z,C)}return null}function $(z,C,K,W){var Ne=C!==null?C.key:null;if(typeof K=="string"&&K!==""||typeof K=="number"||typeof K=="bigint")return Ne!==null?null:g(z,C,""+K,W);if(typeof K=="object"&&K!==null){switch(K.$$typeof){case P:return K.key===Ne?T(z,C,K,W):null;case w:return K.key===Ne?G(z,C,K,W):null;case ge:return K=Fn(K),$(z,C,K,W)}if(fe(K)||Ce(K))return Ne!==null?null:Q(z,C,K,W,null);if(typeof K.then=="function")return $(z,C,wl(K),W);if(K.$$typeof===L)return $(z,C,Nl(z,K),W);Al(z,K)}return null}function J(z,C,K,W,Ne){if(typeof W=="string"&&W!==""||typeof W=="number"||typeof W=="bigint")return z=z.get(K)||null,g(C,z,""+W,Ne);if(typeof W=="object"&&W!==null){switch(W.$$typeof){case P:return z=z.get(W.key===null?K:W.key)||null,T(C,z,W,Ne);case w:return z=z.get(W.key===null?K:W.key)||null,G(C,z,W,Ne);case ge:return W=Fn(W),J(z,C,K,W,Ne)}if(fe(W)||Ce(W))return z=z.get(K)||null,Q(C,z,W,Ne,null);if(typeof W.then=="function")return J(z,C,K,wl(W),Ne);if(W.$$typeof===L)return J(z,C,K,Nl(C,W),Ne);Al(C,W)}return null}function xe(z,C,K,W){for(var Ne=null,$e=null,ve=C,De=C=0,Be=null;ve!==null&&De<K.length;De++){ve.index>De?(Be=ve,ve=null):Be=ve.sibling;var Ye=$(z,ve,K[De],W);if(Ye===null){ve===null&&(ve=Be);break}a&&ve&&Ye.alternate===null&&t(z,ve),C=c(Ye,C,De),$e===null?Ne=Ye:$e.sibling=Ye,$e=Ye,ve=Be}if(De===K.length)return n(z,ve),Fe&&Pt(z,De),Ne;if(ve===null){for(;De<K.length;De++)ve=ae(z,K[De],W),ve!==null&&(C=c(ve,C,De),$e===null?Ne=ve:$e.sibling=ve,$e=ve);return Fe&&Pt(z,De),Ne}for(ve=s(ve);De<K.length;De++)Be=J(ve,z,De,K[De],W),Be!==null&&(a&&Be.alternate!==null&&ve.delete(Be.key===null?De:Be.key),C=c(Be,C,De),$e===null?Ne=Be:$e.sibling=Be,$e=Be);return a&&ve.forEach(function(wn){return t(z,wn)}),Fe&&Pt(z,De),Ne}function _e(z,C,K,W){if(K==null)throw Error(o(151));for(var Ne=null,$e=null,ve=C,De=C=0,Be=null,Ye=K.next();ve!==null&&!Ye.done;De++,Ye=K.next()){ve.index>De?(Be=ve,ve=null):Be=ve.sibling;var wn=$(z,ve,Ye.value,W);if(wn===null){ve===null&&(ve=Be);break}a&&ve&&wn.alternate===null&&t(z,ve),C=c(wn,C,De),$e===null?Ne=wn:$e.sibling=wn,$e=wn,ve=Be}if(Ye.done)return n(z,ve),Fe&&Pt(z,De),Ne;if(ve===null){for(;!Ye.done;De++,Ye=K.next())Ye=ae(z,Ye.value,W),Ye!==null&&(C=c(Ye,C,De),$e===null?Ne=Ye:$e.sibling=Ye,$e=Ye);return Fe&&Pt(z,De),Ne}for(ve=s(ve);!Ye.done;De++,Ye=K.next())Ye=J(ve,z,De,Ye.value,W),Ye!==null&&(a&&Ye.alternate!==null&&ve.delete(Ye.key===null?De:Ye.key),C=c(Ye,C,De),$e===null?Ne=Ye:$e.sibling=Ye,$e=Ye);return a&&ve.forEach(function(Db){return t(z,Db)}),Fe&&Pt(z,De),Ne}function ta(z,C,K,W){if(typeof K=="object"&&K!==null&&K.type===M&&K.key===null&&(K=K.props.children),typeof K=="object"&&K!==null){switch(K.$$typeof){case P:e:{for(var Ne=K.key;C!==null;){if(C.key===Ne){if(Ne=K.type,Ne===M){if(C.tag===7){n(z,C.sibling),W=r(C,K.props.children),W.return=z,z=W;break e}}else if(C.elementType===Ne||typeof Ne=="object"&&Ne!==null&&Ne.$$typeof===ge&&Fn(Ne)===C.type){n(z,C.sibling),W=r(C,K.props),fi(W,K),W.return=z,z=W;break e}n(z,C);break}else t(z,C);C=C.sibling}K.type===M?(W=Ln(K.props.children,z.mode,W,K.key),W.return=z,z=W):(W=jl(K.type,K.key,K.props,null,z.mode,W),fi(W,K),W.return=z,z=W)}return m(z);case w:e:{for(Ne=K.key;C!==null;){if(C.key===Ne)if(C.tag===4&&C.stateNode.containerInfo===K.containerInfo&&C.stateNode.implementation===K.implementation){n(z,C.sibling),W=r(C,K.children||[]),W.return=z,z=W;break e}else{n(z,C);break}else t(z,C);C=C.sibling}W=mc(K,z.mode,W),W.return=z,z=W}return m(z);case ge:return K=Fn(K),ta(z,C,K,W)}if(fe(K))return xe(z,C,K,W);if(Ce(K)){if(Ne=Ce(K),typeof Ne!="function")throw Error(o(150));return K=Ne.call(K),_e(z,C,K,W)}if(typeof K.then=="function")return ta(z,C,wl(K),W);if(K.$$typeof===L)return ta(z,C,Nl(z,K),W);Al(z,K)}return typeof K=="string"&&K!==""||typeof K=="number"||typeof K=="bigint"?(K=""+K,C!==null&&C.tag===6?(n(z,C.sibling),W=r(C,K),W.return=z,z=W):(n(z,C),W=uc(K,z.mode,W),W.return=z,z=W),m(z)):n(z,C)}return function(z,C,K,W){try{pi=0;var Ne=ta(z,C,K,W);return vs=null,Ne}catch(ve){if(ve===js||ve===_l)throw ve;var $e=Ya(29,ve,null,z.mode);return $e.lanes=W,$e.return=z,$e}finally{}}}var In=qu(!0),Gu=qu(!1),on=!1;function _c(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Sc(a,t){a=a.updateQueue,t.updateQueue===a&&(t.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,callbacks:null})}function dn(a){return{lane:a,tag:0,payload:null,callback:null,next:null}}function un(a,t,n){var s=a.updateQueue;if(s===null)return null;if(s=s.shared,(Xe&2)!==0){var r=s.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),s.pending=t,t=bl(a),Tu(a,null,n),t}return xl(a,s,t,n),bl(a)}function gi(a,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var s=t.lanes;s&=a.pendingLanes,n|=s,t.lanes=n,Ue(a,n)}}function wc(a,t){var n=a.updateQueue,s=a.alternate;if(s!==null&&(s=s.updateQueue,n===s)){var r=null,c=null;if(n=n.firstBaseUpdate,n!==null){do{var m={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};c===null?r=c=m:c=c.next=m,n=n.next}while(n!==null);c===null?r=c=t:c=c.next=t}else r=c=t;n={baseState:s.baseState,firstBaseUpdate:r,lastBaseUpdate:c,shared:s.shared,callbacks:s.callbacks},a.updateQueue=n;return}a=n.lastBaseUpdate,a===null?n.firstBaseUpdate=t:a.next=t,n.lastBaseUpdate=t}var Ac=!1;function xi(){if(Ac){var a=bs;if(a!==null)throw a}}function bi(a,t,n,s){Ac=!1;var r=a.updateQueue;on=!1;var c=r.firstBaseUpdate,m=r.lastBaseUpdate,g=r.shared.pending;if(g!==null){r.shared.pending=null;var T=g,G=T.next;T.next=null,m===null?c=G:m.next=G,m=T;var Q=a.alternate;Q!==null&&(Q=Q.updateQueue,g=Q.lastBaseUpdate,g!==m&&(g===null?Q.firstBaseUpdate=G:g.next=G,Q.lastBaseUpdate=T))}if(c!==null){var ae=r.baseState;m=0,Q=G=T=null,g=c;do{var $=g.lane&-536870913,J=$!==g.lane;if(J?(ze&$)===$:(s&$)===$){$!==0&&$===xs&&(Ac=!0),Q!==null&&(Q=Q.next={lane:0,tag:g.tag,payload:g.payload,callback:null,next:null});e:{var xe=a,_e=g;$=t;var ta=n;switch(_e.tag){case 1:if(xe=_e.payload,typeof xe=="function"){ae=xe.call(ta,ae,$);break e}ae=xe;break e;case 3:xe.flags=xe.flags&-65537|128;case 0:if(xe=_e.payload,$=typeof xe=="function"?xe.call(ta,ae,$):xe,$==null)break e;ae=v({},ae,$);break e;case 2:on=!0}}$=g.callback,$!==null&&(a.flags|=64,J&&(a.flags|=8192),J=r.callbacks,J===null?r.callbacks=[$]:J.push($))}else J={lane:$,tag:g.tag,payload:g.payload,callback:g.callback,next:null},Q===null?(G=Q=J,T=ae):Q=Q.next=J,m|=$;if(g=g.next,g===null){if(g=r.shared.pending,g===null)break;J=g,g=J.next,J.next=null,r.lastBaseUpdate=J,r.shared.pending=null}}while(!0);Q===null&&(T=ae),r.baseState=T,r.firstBaseUpdate=G,r.lastBaseUpdate=Q,c===null&&(r.shared.lanes=0),gn|=m,a.lanes=m,a.memoizedState=ae}}function $u(a,t){if(typeof a!="function")throw Error(o(191,a));a.call(t)}function Yu(a,t){var n=a.callbacks;if(n!==null)for(a.callbacks=null,a=0;a<n.length;a++)$u(n[a],t)}var ys=N(null),Tl=N(0);function Vu(a,t){a=Yt,Y(Tl,a),Y(ys,t),Yt=a|t.baseLanes}function Tc(){Y(Tl,Yt),Y(ys,ys.current)}function Ec(){Yt=Tl.current,k(ys),k(Tl)}var Va=N(null),ct=null;function mn(a){var t=a.alternate;Y(ma,ma.current&1),Y(Va,a),ct===null&&(t===null||ys.current!==null||t.memoizedState!==null)&&(ct=a)}function Cc(a){Y(ma,ma.current),Y(Va,a),ct===null&&(ct=a)}function Ju(a){a.tag===22?(Y(ma,ma.current),Y(Va,a),ct===null&&(ct=a)):hn()}function hn(){Y(ma,ma.current),Y(Va,Va.current)}function Ja(a){k(Va),ct===a&&(ct=null),k(ma)}var ma=N(0);function El(a){for(var t=a;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Uo(n)||zo(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===a)break;for(;t.sibling===null;){if(t.return===null||t.return===a)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Bt=0,Me=null,ea=null,ga=null,Cl=!1,Ns=!1,Kn=!1,Ml=0,ji=0,ks=null,kx=0;function da(){throw Error(o(321))}function Mc(a,t){if(t===null)return!1;for(var n=0;n<t.length&&n<a.length;n++)if(!$a(a[n],t[n]))return!1;return!0}function Rc(a,t,n,s,r,c){return Bt=c,Me=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,U.H=a===null||a.memoizedState===null?Rm:Yc,Kn=!1,c=n(s,r),Kn=!1,Ns&&(c=Qu(t,n,s,r)),Xu(a),c}function Xu(a){U.H=Ni;var t=ea!==null&&ea.next!==null;if(Bt=0,ga=ea=Me=null,Cl=!1,ji=0,ks=null,t)throw Error(o(300));a===null||xa||(a=a.dependencies,a!==null&&yl(a)&&(xa=!0))}function Qu(a,t,n,s){Me=a;var r=0;do{if(Ns&&(ks=null),ji=0,Ns=!1,25<=r)throw Error(o(301));if(r+=1,ga=ea=null,a.updateQueue!=null){var c=a.updateQueue;c.lastEffect=null,c.events=null,c.stores=null,c.memoCache!=null&&(c.memoCache.index=0)}U.H=Dm,c=t(n,s)}while(Ns);return c}function _x(){var a=U.H,t=a.useState()[0];return t=typeof t.then=="function"?vi(t):t,a=a.useState()[0],(ea!==null?ea.memoizedState:null)!==a&&(Me.flags|=1024),t}function Dc(){var a=Ml!==0;return Ml=0,a}function Oc(a,t,n){t.updateQueue=a.updateQueue,t.flags&=-2053,a.lanes&=~n}function Lc(a){if(Cl){for(a=a.memoizedState;a!==null;){var t=a.queue;t!==null&&(t.pending=null),a=a.next}Cl=!1}Bt=0,ga=ea=Me=null,Ns=!1,ji=Ml=0,ks=null}function Da(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ga===null?Me.memoizedState=ga=a:ga=ga.next=a,ga}function ha(){if(ea===null){var a=Me.alternate;a=a!==null?a.memoizedState:null}else a=ea.next;var t=ga===null?Me.memoizedState:ga.next;if(t!==null)ga=t,ea=a;else{if(a===null)throw Me.alternate===null?Error(o(467)):Error(o(310));ea=a,a={memoizedState:ea.memoizedState,baseState:ea.baseState,baseQueue:ea.baseQueue,queue:ea.queue,next:null},ga===null?Me.memoizedState=ga=a:ga=ga.next=a}return ga}function Rl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function vi(a){var t=ji;return ji+=1,ks===null&&(ks=[]),a=Hu(ks,a,t),t=Me,(ga===null?t.memoizedState:ga.next)===null&&(t=t.alternate,U.H=t===null||t.memoizedState===null?Rm:Yc),a}function Dl(a){if(a!==null&&typeof a=="object"){if(typeof a.then=="function")return vi(a);if(a.$$typeof===L)return Aa(a)}throw Error(o(438,String(a)))}function Pc(a){var t=null,n=Me.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var s=Me.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(t={data:s.data.map(function(r){return r.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Rl(),Me.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(a),s=0;s<a;s++)n[s]=he;return t.index++,n}function Ft(a,t){return typeof t=="function"?t(a):t}function Ol(a){var t=ha();return Uc(t,ea,a)}function Uc(a,t,n){var s=a.queue;if(s===null)throw Error(o(311));s.lastRenderedReducer=n;var r=a.baseQueue,c=s.pending;if(c!==null){if(r!==null){var m=r.next;r.next=c.next,c.next=m}t.baseQueue=r=c,s.pending=null}if(c=a.baseState,r===null)a.memoizedState=c;else{t=r.next;var g=m=null,T=null,G=t,Q=!1;do{var ae=G.lane&-536870913;if(ae!==G.lane?(ze&ae)===ae:(Bt&ae)===ae){var $=G.revertLane;if($===0)T!==null&&(T=T.next={lane:0,revertLane:0,gesture:null,action:G.action,hasEagerState:G.hasEagerState,eagerState:G.eagerState,next:null}),ae===xs&&(Q=!0);else if((Bt&$)===$){G=G.next,$===xs&&(Q=!0);continue}else ae={lane:0,revertLane:G.revertLane,gesture:null,action:G.action,hasEagerState:G.hasEagerState,eagerState:G.eagerState,next:null},T===null?(g=T=ae,m=c):T=T.next=ae,Me.lanes|=$,gn|=$;ae=G.action,Kn&&n(c,ae),c=G.hasEagerState?G.eagerState:n(c,ae)}else $={lane:ae,revertLane:G.revertLane,gesture:G.gesture,action:G.action,hasEagerState:G.hasEagerState,eagerState:G.eagerState,next:null},T===null?(g=T=$,m=c):T=T.next=$,Me.lanes|=ae,gn|=ae;G=G.next}while(G!==null&&G!==t);if(T===null?m=c:T.next=g,!$a(c,a.memoizedState)&&(xa=!0,Q&&(n=bs,n!==null)))throw n;a.memoizedState=c,a.baseState=m,a.baseQueue=T,s.lastRenderedState=c}return r===null&&(s.lanes=0),[a.memoizedState,s.dispatch]}function zc(a){var t=ha(),n=t.queue;if(n===null)throw Error(o(311));n.lastRenderedReducer=a;var s=n.dispatch,r=n.pending,c=t.memoizedState;if(r!==null){n.pending=null;var m=r=r.next;do c=a(c,m.action),m=m.next;while(m!==r);$a(c,t.memoizedState)||(xa=!0),t.memoizedState=c,t.baseQueue===null&&(t.baseState=c),n.lastRenderedState=c}return[c,s]}function Zu(a,t,n){var s=Me,r=ha(),c=Fe;if(c){if(n===void 0)throw Error(o(407));n=n()}else n=t();var m=!$a((ea||r).memoizedState,n);if(m&&(r.memoizedState=n,xa=!0),r=r.queue,Hc(am.bind(null,s,r,a),[a]),r.getSnapshot!==t||m||ga!==null&&ga.memoizedState.tag&1){if(s.flags|=2048,_s(9,{destroy:void 0},em.bind(null,s,r,n,t),null),na===null)throw Error(o(349));c||(Bt&127)!==0||Wu(s,t,n)}return n}function Wu(a,t,n){a.flags|=16384,a={getSnapshot:t,value:n},t=Me.updateQueue,t===null?(t=Rl(),Me.updateQueue=t,t.stores=[a]):(n=t.stores,n===null?t.stores=[a]:n.push(a))}function em(a,t,n,s){t.value=n,t.getSnapshot=s,tm(t)&&nm(a)}function am(a,t,n){return n(function(){tm(t)&&nm(a)})}function tm(a){var t=a.getSnapshot;a=a.value;try{var n=t();return!$a(a,n)}catch{return!0}}function nm(a){var t=On(a,2);t!==null&&Ia(t,a,2)}function Bc(a){var t=Da();if(typeof a=="function"){var n=a;if(a=n(),Kn){sa(!0);try{n()}finally{sa(!1)}}}return t.memoizedState=t.baseState=a,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ft,lastRenderedState:a},t}function sm(a,t,n,s){return a.baseState=n,Uc(a,ea,typeof s=="function"?s:Ft)}function Sx(a,t,n,s,r){if(Ul(a))throw Error(o(485));if(a=t.action,a!==null){var c={payload:r,action:a,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(m){c.listeners.push(m)}};U.T!==null?n(!0):c.isTransition=!1,s(c),n=t.pending,n===null?(c.next=t.pending=c,im(t,c)):(c.next=n.next,t.pending=n.next=c)}}function im(a,t){var n=t.action,s=t.payload,r=a.state;if(t.isTransition){var c=U.T,m={};U.T=m;try{var g=n(r,s),T=U.S;T!==null&&T(m,g),lm(a,t,g)}catch(G){Fc(a,t,G)}finally{c!==null&&m.types!==null&&(c.types=m.types),U.T=c}}else try{c=n(r,s),lm(a,t,c)}catch(G){Fc(a,t,G)}}function lm(a,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(s){rm(a,t,s)},function(s){return Fc(a,t,s)}):rm(a,t,n)}function rm(a,t,n){t.status="fulfilled",t.value=n,cm(t),a.state=n,t=a.pending,t!==null&&(n=t.next,n===t?a.pending=null:(n=n.next,t.next=n,im(a,n)))}function Fc(a,t,n){var s=a.pending;if(a.pending=null,s!==null){s=s.next;do t.status="rejected",t.reason=n,cm(t),t=t.next;while(t!==s)}a.action=null}function cm(a){a=a.listeners;for(var t=0;t<a.length;t++)(0,a[t])()}function om(a,t){return t}function dm(a,t){if(Fe){var n=na.formState;if(n!==null){e:{var s=Me;if(Fe){if(ia){a:{for(var r=ia,c=rt;r.nodeType!==8;){if(!c){r=null;break a}if(r=ot(r.nextSibling),r===null){r=null;break a}}c=r.data,r=c==="F!"||c==="F"?r:null}if(r){ia=ot(r.nextSibling),s=r.data==="F!";break e}}rn(s)}s=!1}s&&(t=n[0])}}return n=Da(),n.memoizedState=n.baseState=t,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:om,lastRenderedState:t},n.queue=s,n=Em.bind(null,Me,s),s.dispatch=n,s=Bc(!1),c=$c.bind(null,Me,!1,s.queue),s=Da(),r={state:t,dispatch:null,action:a,pending:null},s.queue=r,n=Sx.bind(null,Me,r,c,n),r.dispatch=n,s.memoizedState=a,[t,n,!1]}function um(a){var t=ha();return mm(t,ea,a)}function mm(a,t,n){if(t=Uc(a,t,om)[0],a=Ol(Ft)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var s=vi(t)}catch(m){throw m===js?_l:m}else s=t;t=ha();var r=t.queue,c=r.dispatch;return n!==t.memoizedState&&(Me.flags|=2048,_s(9,{destroy:void 0},wx.bind(null,r,n),null)),[s,c,a]}function wx(a,t){a.action=t}function hm(a){var t=ha(),n=ea;if(n!==null)return mm(t,n,a);ha(),t=t.memoizedState,n=ha();var s=n.queue.dispatch;return n.memoizedState=a,[t,s,!1]}function _s(a,t,n,s){return a={tag:a,create:n,deps:s,inst:t,next:null},t=Me.updateQueue,t===null&&(t=Rl(),Me.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=a.next=a:(s=n.next,n.next=a,a.next=s,t.lastEffect=a),a}function pm(){return ha().memoizedState}function Ll(a,t,n,s){var r=Da();Me.flags|=a,r.memoizedState=_s(1|t,{destroy:void 0},n,s===void 0?null:s)}function Pl(a,t,n,s){var r=ha();s=s===void 0?null:s;var c=r.memoizedState.inst;ea!==null&&s!==null&&Mc(s,ea.memoizedState.deps)?r.memoizedState=_s(t,c,n,s):(Me.flags|=a,r.memoizedState=_s(1|t,c,n,s))}function fm(a,t){Ll(8390656,8,a,t)}function Hc(a,t){Pl(2048,8,a,t)}function Ax(a){Me.flags|=4;var t=Me.updateQueue;if(t===null)t=Rl(),Me.updateQueue=t,t.events=[a];else{var n=t.events;n===null?t.events=[a]:n.push(a)}}function gm(a){var t=ha().memoizedState;return Ax({ref:t,nextImpl:a}),function(){if((Xe&2)!==0)throw Error(o(440));return t.impl.apply(void 0,arguments)}}function xm(a,t){return Pl(4,2,a,t)}function bm(a,t){return Pl(4,4,a,t)}function jm(a,t){if(typeof t=="function"){a=a();var n=t(a);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return a=a(),t.current=a,function(){t.current=null}}function vm(a,t,n){n=n!=null?n.concat([a]):null,Pl(4,4,jm.bind(null,t,a),n)}function Ic(){}function ym(a,t){var n=ha();t=t===void 0?null:t;var s=n.memoizedState;return t!==null&&Mc(t,s[1])?s[0]:(n.memoizedState=[a,t],a)}function Nm(a,t){var n=ha();t=t===void 0?null:t;var s=n.memoizedState;if(t!==null&&Mc(t,s[1]))return s[0];if(s=a(),Kn){sa(!0);try{a()}finally{sa(!1)}}return n.memoizedState=[s,t],s}function Kc(a,t,n){return n===void 0||(Bt&1073741824)!==0&&(ze&261930)===0?a.memoizedState=t:(a.memoizedState=n,a=kh(),Me.lanes|=a,gn|=a,n)}function km(a,t,n,s){return $a(n,t)?n:ys.current!==null?(a=Kc(a,n,s),$a(a,t)||(xa=!0),a):(Bt&42)===0||(Bt&1073741824)!==0&&(ze&261930)===0?(xa=!0,a.memoizedState=n):(a=kh(),Me.lanes|=a,gn|=a,t)}function _m(a,t,n,s,r){var c=ie.p;ie.p=c!==0&&8>c?c:8;var m=U.T,g={};U.T=g,$c(a,!1,t,n);try{var T=r(),G=U.S;if(G!==null&&G(g,T),T!==null&&typeof T=="object"&&typeof T.then=="function"){var Q=Nx(T,s);yi(a,t,Q,Za(a))}else yi(a,t,s,Za(a))}catch(ae){yi(a,t,{then:function(){},status:"rejected",reason:ae},Za())}finally{ie.p=c,m!==null&&g.types!==null&&(m.types=g.types),U.T=m}}function Tx(){}function qc(a,t,n,s){if(a.tag!==5)throw Error(o(476));var r=Sm(a).queue;_m(a,r,t,I,n===null?Tx:function(){return wm(a),n(s)})}function Sm(a){var t=a.memoizedState;if(t!==null)return t;t={memoizedState:I,baseState:I,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ft,lastRenderedState:I},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ft,lastRenderedState:n},next:null},a.memoizedState=t,a=a.alternate,a!==null&&(a.memoizedState=t),t}function wm(a){var t=Sm(a);t.next===null&&(t=a.alternate.memoizedState),yi(a,t.next.queue,{},Za())}function Gc(){return Aa(zi)}function Am(){return ha().memoizedState}function Tm(){return ha().memoizedState}function Ex(a){for(var t=a.return;t!==null;){switch(t.tag){case 24:case 3:var n=Za();a=dn(n);var s=un(t,a,n);s!==null&&(Ia(s,t,n),gi(s,t,n)),t={cache:vc()},a.payload=t;return}t=t.return}}function Cx(a,t,n){var s=Za();n={lane:s,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Ul(a)?Cm(t,n):(n=oc(a,t,n,s),n!==null&&(Ia(n,a,s),Mm(n,t,s)))}function Em(a,t,n){var s=Za();yi(a,t,n,s)}function yi(a,t,n,s){var r={lane:s,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ul(a))Cm(t,r);else{var c=a.alternate;if(a.lanes===0&&(c===null||c.lanes===0)&&(c=t.lastRenderedReducer,c!==null))try{var m=t.lastRenderedState,g=c(m,n);if(r.hasEagerState=!0,r.eagerState=g,$a(g,m))return xl(a,t,r,0),na===null&&gl(),!1}catch{}finally{}if(n=oc(a,t,r,s),n!==null)return Ia(n,a,s),Mm(n,t,s),!0}return!1}function $c(a,t,n,s){if(s={lane:2,revertLane:So(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},Ul(a)){if(t)throw Error(o(479))}else t=oc(a,n,s,2),t!==null&&Ia(t,a,2)}function Ul(a){var t=a.alternate;return a===Me||t!==null&&t===Me}function Cm(a,t){Ns=Cl=!0;var n=a.pending;n===null?t.next=t:(t.next=n.next,n.next=t),a.pending=t}function Mm(a,t,n){if((n&4194048)!==0){var s=t.lanes;s&=a.pendingLanes,n|=s,t.lanes=n,Ue(a,n)}}var Ni={readContext:Aa,use:Dl,useCallback:da,useContext:da,useEffect:da,useImperativeHandle:da,useLayoutEffect:da,useInsertionEffect:da,useMemo:da,useReducer:da,useRef:da,useState:da,useDebugValue:da,useDeferredValue:da,useTransition:da,useSyncExternalStore:da,useId:da,useHostTransitionStatus:da,useFormState:da,useActionState:da,useOptimistic:da,useMemoCache:da,useCacheRefresh:da};Ni.useEffectEvent=da;var Rm={readContext:Aa,use:Dl,useCallback:function(a,t){return Da().memoizedState=[a,t===void 0?null:t],a},useContext:Aa,useEffect:fm,useImperativeHandle:function(a,t,n){n=n!=null?n.concat([a]):null,Ll(4194308,4,jm.bind(null,t,a),n)},useLayoutEffect:function(a,t){return Ll(4194308,4,a,t)},useInsertionEffect:function(a,t){Ll(4,2,a,t)},useMemo:function(a,t){var n=Da();t=t===void 0?null:t;var s=a();if(Kn){sa(!0);try{a()}finally{sa(!1)}}return n.memoizedState=[s,t],s},useReducer:function(a,t,n){var s=Da();if(n!==void 0){var r=n(t);if(Kn){sa(!0);try{n(t)}finally{sa(!1)}}}else r=t;return s.memoizedState=s.baseState=r,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:r},s.queue=a,a=a.dispatch=Cx.bind(null,Me,a),[s.memoizedState,a]},useRef:function(a){var t=Da();return a={current:a},t.memoizedState=a},useState:function(a){a=Bc(a);var t=a.queue,n=Em.bind(null,Me,t);return t.dispatch=n,[a.memoizedState,n]},useDebugValue:Ic,useDeferredValue:function(a,t){var n=Da();return Kc(n,a,t)},useTransition:function(){var a=Bc(!1);return a=_m.bind(null,Me,a.queue,!0,!1),Da().memoizedState=a,[!1,a]},useSyncExternalStore:function(a,t,n){var s=Me,r=Da();if(Fe){if(n===void 0)throw Error(o(407));n=n()}else{if(n=t(),na===null)throw Error(o(349));(ze&127)!==0||Wu(s,t,n)}r.memoizedState=n;var c={value:n,getSnapshot:t};return r.queue=c,fm(am.bind(null,s,c,a),[a]),s.flags|=2048,_s(9,{destroy:void 0},em.bind(null,s,c,n,t),null),n},useId:function(){var a=Da(),t=na.identifierPrefix;if(Fe){var n=Nt,s=yt;n=(s&~(1<<32-ya(s)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Ml++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=kx++,t="_"+t+"r_"+n.toString(32)+"_";return a.memoizedState=t},useHostTransitionStatus:Gc,useFormState:dm,useActionState:dm,useOptimistic:function(a){var t=Da();t.memoizedState=t.baseState=a;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=$c.bind(null,Me,!0,n),n.dispatch=t,[a,t]},useMemoCache:Pc,useCacheRefresh:function(){return Da().memoizedState=Ex.bind(null,Me)},useEffectEvent:function(a){var t=Da(),n={impl:a};return t.memoizedState=n,function(){if((Xe&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}},Yc={readContext:Aa,use:Dl,useCallback:ym,useContext:Aa,useEffect:Hc,useImperativeHandle:vm,useInsertionEffect:xm,useLayoutEffect:bm,useMemo:Nm,useReducer:Ol,useRef:pm,useState:function(){return Ol(Ft)},useDebugValue:Ic,useDeferredValue:function(a,t){var n=ha();return km(n,ea.memoizedState,a,t)},useTransition:function(){var a=Ol(Ft)[0],t=ha().memoizedState;return[typeof a=="boolean"?a:vi(a),t]},useSyncExternalStore:Zu,useId:Am,useHostTransitionStatus:Gc,useFormState:um,useActionState:um,useOptimistic:function(a,t){var n=ha();return sm(n,ea,a,t)},useMemoCache:Pc,useCacheRefresh:Tm};Yc.useEffectEvent=gm;var Dm={readContext:Aa,use:Dl,useCallback:ym,useContext:Aa,useEffect:Hc,useImperativeHandle:vm,useInsertionEffect:xm,useLayoutEffect:bm,useMemo:Nm,useReducer:zc,useRef:pm,useState:function(){return zc(Ft)},useDebugValue:Ic,useDeferredValue:function(a,t){var n=ha();return ea===null?Kc(n,a,t):km(n,ea.memoizedState,a,t)},useTransition:function(){var a=zc(Ft)[0],t=ha().memoizedState;return[typeof a=="boolean"?a:vi(a),t]},useSyncExternalStore:Zu,useId:Am,useHostTransitionStatus:Gc,useFormState:hm,useActionState:hm,useOptimistic:function(a,t){var n=ha();return ea!==null?sm(n,ea,a,t):(n.baseState=a,[a,n.queue.dispatch])},useMemoCache:Pc,useCacheRefresh:Tm};Dm.useEffectEvent=gm;function Vc(a,t,n,s){t=a.memoizedState,n=n(s,t),n=n==null?t:v({},t,n),a.memoizedState=n,a.lanes===0&&(a.updateQueue.baseState=n)}var Jc={enqueueSetState:function(a,t,n){a=a._reactInternals;var s=Za(),r=dn(s);r.payload=t,n!=null&&(r.callback=n),t=un(a,r,s),t!==null&&(Ia(t,a,s),gi(t,a,s))},enqueueReplaceState:function(a,t,n){a=a._reactInternals;var s=Za(),r=dn(s);r.tag=1,r.payload=t,n!=null&&(r.callback=n),t=un(a,r,s),t!==null&&(Ia(t,a,s),gi(t,a,s))},enqueueForceUpdate:function(a,t){a=a._reactInternals;var n=Za(),s=dn(n);s.tag=2,t!=null&&(s.callback=t),t=un(a,s,n),t!==null&&(Ia(t,a,n),gi(t,a,n))}};function Om(a,t,n,s,r,c,m){return a=a.stateNode,typeof a.shouldComponentUpdate=="function"?a.shouldComponentUpdate(s,c,m):t.prototype&&t.prototype.isPureReactComponent?!ci(n,s)||!ci(r,c):!0}function Lm(a,t,n,s){a=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,s),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,s),t.state!==a&&Jc.enqueueReplaceState(t,t.state,null)}function qn(a,t){var n=t;if("ref"in t){n={};for(var s in t)s!=="ref"&&(n[s]=t[s])}if(a=a.defaultProps){n===t&&(n=v({},n));for(var r in a)n[r]===void 0&&(n[r]=a[r])}return n}function Pm(a){fl(a)}function Um(a){console.error(a)}function zm(a){fl(a)}function zl(a,t){try{var n=a.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(s){setTimeout(function(){throw s})}}function Bm(a,t,n){try{var s=a.onCaughtError;s(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(r){setTimeout(function(){throw r})}}function Xc(a,t,n){return n=dn(n),n.tag=3,n.payload={element:null},n.callback=function(){zl(a,t)},n}function Fm(a){return a=dn(a),a.tag=3,a}function Hm(a,t,n,s){var r=n.type.getDerivedStateFromError;if(typeof r=="function"){var c=s.value;a.payload=function(){return r(c)},a.callback=function(){Bm(t,n,s)}}var m=n.stateNode;m!==null&&typeof m.componentDidCatch=="function"&&(a.callback=function(){Bm(t,n,s),typeof r!="function"&&(xn===null?xn=new Set([this]):xn.add(this));var g=s.stack;this.componentDidCatch(s.value,{componentStack:g!==null?g:""})})}function Mx(a,t,n,s,r){if(n.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(t=n.alternate,t!==null&&gs(t,n,r,!0),n=Va.current,n!==null){switch(n.tag){case 31:case 13:return ct===null?Xl():n.alternate===null&&ua===0&&(ua=3),n.flags&=-257,n.flags|=65536,n.lanes=r,s===Sl?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([s]):t.add(s),No(a,s,r)),!1;case 22:return n.flags|=65536,s===Sl?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([s])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([s]):n.add(s)),No(a,s,r)),!1}throw Error(o(435,n.tag))}return No(a,s,r),Xl(),!1}if(Fe)return t=Va.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=r,s!==fc&&(a=Error(o(422),{cause:s}),ui(st(a,n)))):(s!==fc&&(t=Error(o(423),{cause:s}),ui(st(t,n))),a=a.current.alternate,a.flags|=65536,r&=-r,a.lanes|=r,s=st(s,n),r=Xc(a.stateNode,s,r),wc(a,r),ua!==4&&(ua=2)),!1;var c=Error(o(520),{cause:s});if(c=st(c,n),Ci===null?Ci=[c]:Ci.push(c),ua!==4&&(ua=2),t===null)return!0;s=st(s,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,a=r&-r,n.lanes|=a,a=Xc(n.stateNode,s,a),wc(n,a),!1;case 1:if(t=n.type,c=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(xn===null||!xn.has(c))))return n.flags|=65536,r&=-r,n.lanes|=r,r=Fm(r),Hm(r,a,n,s),wc(n,r),!1}n=n.return}while(n!==null);return!1}var Qc=Error(o(461)),xa=!1;function Ta(a,t,n,s){t.child=a===null?Gu(t,null,n,s):In(t,a.child,n,s)}function Im(a,t,n,s,r){n=n.render;var c=t.ref;if("ref"in s){var m={};for(var g in s)g!=="ref"&&(m[g]=s[g])}else m=s;return zn(t),s=Rc(a,t,n,m,c,r),g=Dc(),a!==null&&!xa?(Oc(a,t,r),Ht(a,t,r)):(Fe&&g&&hc(t),t.flags|=1,Ta(a,t,s,r),t.child)}function Km(a,t,n,s,r){if(a===null){var c=n.type;return typeof c=="function"&&!dc(c)&&c.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=c,qm(a,t,c,s,r)):(a=jl(n.type,null,s,t,t.mode,r),a.ref=t.ref,a.return=t,t.child=a)}if(c=a.child,!io(a,r)){var m=c.memoizedProps;if(n=n.compare,n=n!==null?n:ci,n(m,s)&&a.ref===t.ref)return Ht(a,t,r)}return t.flags|=1,a=Lt(c,s),a.ref=t.ref,a.return=t,t.child=a}function qm(a,t,n,s,r){if(a!==null){var c=a.memoizedProps;if(ci(c,s)&&a.ref===t.ref)if(xa=!1,t.pendingProps=s=c,io(a,r))(a.flags&131072)!==0&&(xa=!0);else return t.lanes=a.lanes,Ht(a,t,r)}return Zc(a,t,n,s,r)}function Gm(a,t,n,s){var r=s.children,c=a!==null?a.memoizedState:null;if(a===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((t.flags&128)!==0){if(c=c!==null?c.baseLanes|n:n,a!==null){for(s=t.child=a.child,r=0;s!==null;)r=r|s.lanes|s.childLanes,s=s.sibling;s=r&~c}else s=0,t.child=null;return $m(a,t,c,n,s)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},a!==null&&kl(t,c!==null?c.cachePool:null),c!==null?Vu(t,c):Tc(),Ju(t);else return s=t.lanes=536870912,$m(a,t,c!==null?c.baseLanes|n:n,n,s)}else c!==null?(kl(t,c.cachePool),Vu(t,c),hn(),t.memoizedState=null):(a!==null&&kl(t,null),Tc(),hn());return Ta(a,t,r,n),t.child}function ki(a,t){return a!==null&&a.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function $m(a,t,n,s,r){var c=Nc();return c=c===null?null:{parent:fa._currentValue,pool:c},t.memoizedState={baseLanes:n,cachePool:c},a!==null&&kl(t,null),Tc(),Ju(t),a!==null&&gs(a,t,s,!0),t.childLanes=r,null}function Bl(a,t){return t=Hl({mode:t.mode,children:t.children},a.mode),t.ref=a.ref,a.child=t,t.return=a,t}function Ym(a,t,n){return In(t,a.child,null,n),a=Bl(t,t.pendingProps),a.flags|=2,Ja(t),t.memoizedState=null,a}function Rx(a,t,n){var s=t.pendingProps,r=(t.flags&128)!==0;if(t.flags&=-129,a===null){if(Fe){if(s.mode==="hidden")return a=Bl(t,s),t.lanes=536870912,ki(null,a);if(Cc(t),(a=ia)?(a=ip(a,rt),a=a!==null&&a.data==="&"?a:null,a!==null&&(t.memoizedState={dehydrated:a,treeContext:sn!==null?{id:yt,overflow:Nt}:null,retryLane:536870912,hydrationErrors:null},n=Cu(a),n.return=t,t.child=n,wa=t,ia=null)):a=null,a===null)throw rn(t);return t.lanes=536870912,null}return Bl(t,s)}var c=a.memoizedState;if(c!==null){var m=c.dehydrated;if(Cc(t),r)if(t.flags&256)t.flags&=-257,t=Ym(a,t,n);else if(t.memoizedState!==null)t.child=a.child,t.flags|=128,t=null;else throw Error(o(558));else if(xa||gs(a,t,n,!1),r=(n&a.childLanes)!==0,xa||r){if(s=na,s!==null&&(m=an(s,n),m!==0&&m!==c.retryLane))throw c.retryLane=m,On(a,m),Ia(s,a,m),Qc;Xl(),t=Ym(a,t,n)}else a=c.treeContext,ia=ot(m.nextSibling),wa=t,Fe=!0,ln=null,rt=!1,a!==null&&Du(t,a),t=Bl(t,s),t.flags|=4096;return t}return a=Lt(a.child,{mode:s.mode,children:s.children}),a.ref=t.ref,t.child=a,a.return=t,a}function Fl(a,t){var n=t.ref;if(n===null)a!==null&&a.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(o(284));(a===null||a.ref!==n)&&(t.flags|=4194816)}}function Zc(a,t,n,s,r){return zn(t),n=Rc(a,t,n,s,void 0,r),s=Dc(),a!==null&&!xa?(Oc(a,t,r),Ht(a,t,r)):(Fe&&s&&hc(t),t.flags|=1,Ta(a,t,n,r),t.child)}function Vm(a,t,n,s,r,c){return zn(t),t.updateQueue=null,n=Qu(t,s,n,r),Xu(a),s=Dc(),a!==null&&!xa?(Oc(a,t,c),Ht(a,t,c)):(Fe&&s&&hc(t),t.flags|=1,Ta(a,t,n,c),t.child)}function Jm(a,t,n,s,r){if(zn(t),t.stateNode===null){var c=ms,m=n.contextType;typeof m=="object"&&m!==null&&(c=Aa(m)),c=new n(s,c),t.memoizedState=c.state!==null&&c.state!==void 0?c.state:null,c.updater=Jc,t.stateNode=c,c._reactInternals=t,c=t.stateNode,c.props=s,c.state=t.memoizedState,c.refs={},_c(t),m=n.contextType,c.context=typeof m=="object"&&m!==null?Aa(m):ms,c.state=t.memoizedState,m=n.getDerivedStateFromProps,typeof m=="function"&&(Vc(t,n,m,s),c.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof c.getSnapshotBeforeUpdate=="function"||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(m=c.state,typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount(),m!==c.state&&Jc.enqueueReplaceState(c,c.state,null),bi(t,s,c,r),xi(),c.state=t.memoizedState),typeof c.componentDidMount=="function"&&(t.flags|=4194308),s=!0}else if(a===null){c=t.stateNode;var g=t.memoizedProps,T=qn(n,g);c.props=T;var G=c.context,Q=n.contextType;m=ms,typeof Q=="object"&&Q!==null&&(m=Aa(Q));var ae=n.getDerivedStateFromProps;Q=typeof ae=="function"||typeof c.getSnapshotBeforeUpdate=="function",g=t.pendingProps!==g,Q||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(g||G!==m)&&Lm(t,c,s,m),on=!1;var $=t.memoizedState;c.state=$,bi(t,s,c,r),xi(),G=t.memoizedState,g||$!==G||on?(typeof ae=="function"&&(Vc(t,n,ae,s),G=t.memoizedState),(T=on||Om(t,n,T,s,$,G,m))?(Q||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount()),typeof c.componentDidMount=="function"&&(t.flags|=4194308)):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=s,t.memoizedState=G),c.props=s,c.state=G,c.context=m,s=T):(typeof c.componentDidMount=="function"&&(t.flags|=4194308),s=!1)}else{c=t.stateNode,Sc(a,t),m=t.memoizedProps,Q=qn(n,m),c.props=Q,ae=t.pendingProps,$=c.context,G=n.contextType,T=ms,typeof G=="object"&&G!==null&&(T=Aa(G)),g=n.getDerivedStateFromProps,(G=typeof g=="function"||typeof c.getSnapshotBeforeUpdate=="function")||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(m!==ae||$!==T)&&Lm(t,c,s,T),on=!1,$=t.memoizedState,c.state=$,bi(t,s,c,r),xi();var J=t.memoizedState;m!==ae||$!==J||on||a!==null&&a.dependencies!==null&&yl(a.dependencies)?(typeof g=="function"&&(Vc(t,n,g,s),J=t.memoizedState),(Q=on||Om(t,n,Q,s,$,J,T)||a!==null&&a.dependencies!==null&&yl(a.dependencies))?(G||typeof c.UNSAFE_componentWillUpdate!="function"&&typeof c.componentWillUpdate!="function"||(typeof c.componentWillUpdate=="function"&&c.componentWillUpdate(s,J,T),typeof c.UNSAFE_componentWillUpdate=="function"&&c.UNSAFE_componentWillUpdate(s,J,T)),typeof c.componentDidUpdate=="function"&&(t.flags|=4),typeof c.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof c.componentDidUpdate!="function"||m===a.memoizedProps&&$===a.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||m===a.memoizedProps&&$===a.memoizedState||(t.flags|=1024),t.memoizedProps=s,t.memoizedState=J),c.props=s,c.state=J,c.context=T,s=Q):(typeof c.componentDidUpdate!="function"||m===a.memoizedProps&&$===a.memoizedState||(t.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||m===a.memoizedProps&&$===a.memoizedState||(t.flags|=1024),s=!1)}return c=s,Fl(a,t),s=(t.flags&128)!==0,c||s?(c=t.stateNode,n=s&&typeof n.getDerivedStateFromError!="function"?null:c.render(),t.flags|=1,a!==null&&s?(t.child=In(t,a.child,null,r),t.child=In(t,null,n,r)):Ta(a,t,n,r),t.memoizedState=c.state,a=t.child):a=Ht(a,t,r),a}function Xm(a,t,n,s){return Pn(),t.flags|=256,Ta(a,t,n,s),t.child}var Wc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function eo(a){return{baseLanes:a,cachePool:Bu()}}function ao(a,t,n){return a=a!==null?a.childLanes&~n:0,t&&(a|=Qa),a}function Qm(a,t,n){var s=t.pendingProps,r=!1,c=(t.flags&128)!==0,m;if((m=c)||(m=a!==null&&a.memoizedState===null?!1:(ma.current&2)!==0),m&&(r=!0,t.flags&=-129),m=(t.flags&32)!==0,t.flags&=-33,a===null){if(Fe){if(r?mn(t):hn(),(a=ia)?(a=ip(a,rt),a=a!==null&&a.data!=="&"?a:null,a!==null&&(t.memoizedState={dehydrated:a,treeContext:sn!==null?{id:yt,overflow:Nt}:null,retryLane:536870912,hydrationErrors:null},n=Cu(a),n.return=t,t.child=n,wa=t,ia=null)):a=null,a===null)throw rn(t);return zo(a)?t.lanes=32:t.lanes=536870912,null}var g=s.children;return s=s.fallback,r?(hn(),r=t.mode,g=Hl({mode:"hidden",children:g},r),s=Ln(s,r,n,null),g.return=t,s.return=t,g.sibling=s,t.child=g,s=t.child,s.memoizedState=eo(n),s.childLanes=ao(a,m,n),t.memoizedState=Wc,ki(null,s)):(mn(t),to(t,g))}var T=a.memoizedState;if(T!==null&&(g=T.dehydrated,g!==null)){if(c)t.flags&256?(mn(t),t.flags&=-257,t=no(a,t,n)):t.memoizedState!==null?(hn(),t.child=a.child,t.flags|=128,t=null):(hn(),g=s.fallback,r=t.mode,s=Hl({mode:"visible",children:s.children},r),g=Ln(g,r,n,null),g.flags|=2,s.return=t,g.return=t,s.sibling=g,t.child=s,In(t,a.child,null,n),s=t.child,s.memoizedState=eo(n),s.childLanes=ao(a,m,n),t.memoizedState=Wc,t=ki(null,s));else if(mn(t),zo(g)){if(m=g.nextSibling&&g.nextSibling.dataset,m)var G=m.dgst;m=G,s=Error(o(419)),s.stack="",s.digest=m,ui({value:s,source:null,stack:null}),t=no(a,t,n)}else if(xa||gs(a,t,n,!1),m=(n&a.childLanes)!==0,xa||m){if(m=na,m!==null&&(s=an(m,n),s!==0&&s!==T.retryLane))throw T.retryLane=s,On(a,s),Ia(m,a,s),Qc;Uo(g)||Xl(),t=no(a,t,n)}else Uo(g)?(t.flags|=192,t.child=a.child,t=null):(a=T.treeContext,ia=ot(g.nextSibling),wa=t,Fe=!0,ln=null,rt=!1,a!==null&&Du(t,a),t=to(t,s.children),t.flags|=4096);return t}return r?(hn(),g=s.fallback,r=t.mode,T=a.child,G=T.sibling,s=Lt(T,{mode:"hidden",children:s.children}),s.subtreeFlags=T.subtreeFlags&65011712,G!==null?g=Lt(G,g):(g=Ln(g,r,n,null),g.flags|=2),g.return=t,s.return=t,s.sibling=g,t.child=s,ki(null,s),s=t.child,g=a.child.memoizedState,g===null?g=eo(n):(r=g.cachePool,r!==null?(T=fa._currentValue,r=r.parent!==T?{parent:T,pool:T}:r):r=Bu(),g={baseLanes:g.baseLanes|n,cachePool:r}),s.memoizedState=g,s.childLanes=ao(a,m,n),t.memoizedState=Wc,ki(a.child,s)):(mn(t),n=a.child,a=n.sibling,n=Lt(n,{mode:"visible",children:s.children}),n.return=t,n.sibling=null,a!==null&&(m=t.deletions,m===null?(t.deletions=[a],t.flags|=16):m.push(a)),t.child=n,t.memoizedState=null,n)}function to(a,t){return t=Hl({mode:"visible",children:t},a.mode),t.return=a,a.child=t}function Hl(a,t){return a=Ya(22,a,null,t),a.lanes=0,a}function no(a,t,n){return In(t,a.child,null,n),a=to(t,t.pendingProps.children),a.flags|=2,t.memoizedState=null,a}function Zm(a,t,n){a.lanes|=t;var s=a.alternate;s!==null&&(s.lanes|=t),bc(a.return,t,n)}function so(a,t,n,s,r,c){var m=a.memoizedState;m===null?a.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:s,tail:n,tailMode:r,treeForkCount:c}:(m.isBackwards=t,m.rendering=null,m.renderingStartTime=0,m.last=s,m.tail=n,m.tailMode=r,m.treeForkCount=c)}function Wm(a,t,n){var s=t.pendingProps,r=s.revealOrder,c=s.tail;s=s.children;var m=ma.current,g=(m&2)!==0;if(g?(m=m&1|2,t.flags|=128):m&=1,Y(ma,m),Ta(a,t,s,n),s=Fe?di:0,!g&&a!==null&&(a.flags&128)!==0)e:for(a=t.child;a!==null;){if(a.tag===13)a.memoizedState!==null&&Zm(a,n,t);else if(a.tag===19)Zm(a,n,t);else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break e;for(;a.sibling===null;){if(a.return===null||a.return===t)break e;a=a.return}a.sibling.return=a.return,a=a.sibling}switch(r){case"forwards":for(n=t.child,r=null;n!==null;)a=n.alternate,a!==null&&El(a)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),so(t,!1,r,n,c,s);break;case"backwards":case"unstable_legacy-backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(a=r.alternate,a!==null&&El(a)===null){t.child=r;break}a=r.sibling,r.sibling=n,n=r,r=a}so(t,!0,n,null,c,s);break;case"together":so(t,!1,null,null,void 0,s);break;default:t.memoizedState=null}return t.child}function Ht(a,t,n){if(a!==null&&(t.dependencies=a.dependencies),gn|=t.lanes,(n&t.childLanes)===0)if(a!==null){if(gs(a,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(a!==null&&t.child!==a.child)throw Error(o(153));if(t.child!==null){for(a=t.child,n=Lt(a,a.pendingProps),t.child=n,n.return=t;a.sibling!==null;)a=a.sibling,n=n.sibling=Lt(a,a.pendingProps),n.return=t;n.sibling=null}return t.child}function io(a,t){return(a.lanes&t)!==0?!0:(a=a.dependencies,!!(a!==null&&yl(a)))}function Dx(a,t,n){switch(t.tag){case 3:B(t,t.stateNode.containerInfo),cn(t,fa,a.memoizedState.cache),Pn();break;case 27:case 5:ee(t);break;case 4:B(t,t.stateNode.containerInfo);break;case 10:cn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Cc(t),null;break;case 13:var s=t.memoizedState;if(s!==null)return s.dehydrated!==null?(mn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?Qm(a,t,n):(mn(t),a=Ht(a,t,n),a!==null?a.sibling:null);mn(t);break;case 19:var r=(a.flags&128)!==0;if(s=(n&t.childLanes)!==0,s||(gs(a,t,n,!1),s=(n&t.childLanes)!==0),r){if(s)return Wm(a,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),Y(ma,ma.current),s)break;return null;case 22:return t.lanes=0,Gm(a,t,n,t.pendingProps);case 24:cn(t,fa,a.memoizedState.cache)}return Ht(a,t,n)}function eh(a,t,n){if(a!==null)if(a.memoizedProps!==t.pendingProps)xa=!0;else{if(!io(a,n)&&(t.flags&128)===0)return xa=!1,Dx(a,t,n);xa=(a.flags&131072)!==0}else xa=!1,Fe&&(t.flags&1048576)!==0&&Ru(t,di,t.index);switch(t.lanes=0,t.tag){case 16:e:{var s=t.pendingProps;if(a=Fn(t.elementType),t.type=a,typeof a=="function")dc(a)?(s=qn(a,s),t.tag=1,t=Jm(null,t,a,s,n)):(t.tag=0,t=Zc(null,t,a,s,n));else{if(a!=null){var r=a.$$typeof;if(r===q){t.tag=11,t=Im(null,t,a,s,n);break e}else if(r===te){t.tag=14,t=Km(null,t,a,s,n);break e}}throw t=Z(a)||a,Error(o(306,t,""))}}return t;case 0:return Zc(a,t,t.type,t.pendingProps,n);case 1:return s=t.type,r=qn(s,t.pendingProps),Jm(a,t,s,r,n);case 3:e:{if(B(t,t.stateNode.containerInfo),a===null)throw Error(o(387));s=t.pendingProps;var c=t.memoizedState;r=c.element,Sc(a,t),bi(t,s,null,n);var m=t.memoizedState;if(s=m.cache,cn(t,fa,s),s!==c.cache&&jc(t,[fa],n,!0),xi(),s=m.element,c.isDehydrated)if(c={element:s,isDehydrated:!1,cache:m.cache},t.updateQueue.baseState=c,t.memoizedState=c,t.flags&256){t=Xm(a,t,s,n);break e}else if(s!==r){r=st(Error(o(424)),t),ui(r),t=Xm(a,t,s,n);break e}else{switch(a=t.stateNode.containerInfo,a.nodeType){case 9:a=a.body;break;default:a=a.nodeName==="HTML"?a.ownerDocument.body:a}for(ia=ot(a.firstChild),wa=t,Fe=!0,ln=null,rt=!0,n=Gu(t,null,s,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Pn(),s===r){t=Ht(a,t,n);break e}Ta(a,t,s,n)}t=t.child}return t;case 26:return Fl(a,t),a===null?(n=up(t.type,null,t.pendingProps,null))?t.memoizedState=n:Fe||(n=t.type,a=t.pendingProps,s=nr(pe.current).createElement(n),s[Sa]=t,s[Pa]=a,Ea(s,n,a),Na(s),t.stateNode=s):t.memoizedState=up(t.type,a.memoizedProps,t.pendingProps,a.memoizedState),null;case 27:return ee(t),a===null&&Fe&&(s=t.stateNode=cp(t.type,t.pendingProps,pe.current),wa=t,rt=!0,r=ia,yn(t.type)?(Bo=r,ia=ot(s.firstChild)):ia=r),Ta(a,t,t.pendingProps.children,n),Fl(a,t),a===null&&(t.flags|=4194304),t.child;case 5:return a===null&&Fe&&((r=s=ia)&&(s=ob(s,t.type,t.pendingProps,rt),s!==null?(t.stateNode=s,wa=t,ia=ot(s.firstChild),rt=!1,r=!0):r=!1),r||rn(t)),ee(t),r=t.type,c=t.pendingProps,m=a!==null?a.memoizedProps:null,s=c.children,Oo(r,c)?s=null:m!==null&&Oo(r,m)&&(t.flags|=32),t.memoizedState!==null&&(r=Rc(a,t,_x,null,null,n),zi._currentValue=r),Fl(a,t),Ta(a,t,s,n),t.child;case 6:return a===null&&Fe&&((a=n=ia)&&(n=db(n,t.pendingProps,rt),n!==null?(t.stateNode=n,wa=t,ia=null,a=!0):a=!1),a||rn(t)),null;case 13:return Qm(a,t,n);case 4:return B(t,t.stateNode.containerInfo),s=t.pendingProps,a===null?t.child=In(t,null,s,n):Ta(a,t,s,n),t.child;case 11:return Im(a,t,t.type,t.pendingProps,n);case 7:return Ta(a,t,t.pendingProps,n),t.child;case 8:return Ta(a,t,t.pendingProps.children,n),t.child;case 12:return Ta(a,t,t.pendingProps.children,n),t.child;case 10:return s=t.pendingProps,cn(t,t.type,s.value),Ta(a,t,s.children,n),t.child;case 9:return r=t.type._context,s=t.pendingProps.children,zn(t),r=Aa(r),s=s(r),t.flags|=1,Ta(a,t,s,n),t.child;case 14:return Km(a,t,t.type,t.pendingProps,n);case 15:return qm(a,t,t.type,t.pendingProps,n);case 19:return Wm(a,t,n);case 31:return Rx(a,t,n);case 22:return Gm(a,t,n,t.pendingProps);case 24:return zn(t),s=Aa(fa),a===null?(r=Nc(),r===null&&(r=na,c=vc(),r.pooledCache=c,c.refCount++,c!==null&&(r.pooledCacheLanes|=n),r=c),t.memoizedState={parent:s,cache:r},_c(t),cn(t,fa,r)):((a.lanes&n)!==0&&(Sc(a,t),bi(t,null,null,n),xi()),r=a.memoizedState,c=t.memoizedState,r.parent!==s?(r={parent:s,cache:s},t.memoizedState=r,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=r),cn(t,fa,s)):(s=c.cache,cn(t,fa,s),s!==r.cache&&jc(t,[fa],n,!0))),Ta(a,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(o(156,t.tag))}function It(a){a.flags|=4}function lo(a,t,n,s,r){if((t=(a.mode&32)!==0)&&(t=!1),t){if(a.flags|=16777216,(r&335544128)===r)if(a.stateNode.complete)a.flags|=8192;else if(Ah())a.flags|=8192;else throw Hn=Sl,kc}else a.flags&=-16777217}function ah(a,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)a.flags&=-16777217;else if(a.flags|=16777216,!gp(t))if(Ah())a.flags|=8192;else throw Hn=Sl,kc}function Il(a,t){t!==null&&(a.flags|=4),a.flags&16384&&(t=a.tag!==22?sl():536870912,a.lanes|=t,Ts|=t)}function _i(a,t){if(!Fe)switch(a.tailMode){case"hidden":t=a.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?a.tail=null:n.sibling=null;break;case"collapsed":n=a.tail;for(var s=null;n!==null;)n.alternate!==null&&(s=n),n=n.sibling;s===null?t||a.tail===null?a.tail=null:a.tail.sibling=null:s.sibling=null}}function la(a){var t=a.alternate!==null&&a.alternate.child===a.child,n=0,s=0;if(t)for(var r=a.child;r!==null;)n|=r.lanes|r.childLanes,s|=r.subtreeFlags&65011712,s|=r.flags&65011712,r.return=a,r=r.sibling;else for(r=a.child;r!==null;)n|=r.lanes|r.childLanes,s|=r.subtreeFlags,s|=r.flags,r.return=a,r=r.sibling;return a.subtreeFlags|=s,a.childLanes=n,t}function Ox(a,t,n){var s=t.pendingProps;switch(pc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return la(t),null;case 1:return la(t),null;case 3:return n=t.stateNode,s=null,a!==null&&(s=a.memoizedState.cache),t.memoizedState.cache!==s&&(t.flags|=2048),zt(fa),S(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(a===null||a.child===null)&&(fs(t)?It(t):a===null||a.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,gc())),la(t),null;case 26:var r=t.type,c=t.memoizedState;return a===null?(It(t),c!==null?(la(t),ah(t,c)):(la(t),lo(t,r,null,s,n))):c?c!==a.memoizedState?(It(t),la(t),ah(t,c)):(la(t),t.flags&=-16777217):(a=a.memoizedProps,a!==s&&It(t),la(t),lo(t,r,a,s,n)),null;case 27:if(Je(t),n=pe.current,r=t.type,a!==null&&t.stateNode!=null)a.memoizedProps!==s&&It(t);else{if(!s){if(t.stateNode===null)throw Error(o(166));return la(t),null}a=X.current,fs(t)?Ou(t):(a=cp(r,s,n),t.stateNode=a,It(t))}return la(t),null;case 5:if(Je(t),r=t.type,a!==null&&t.stateNode!=null)a.memoizedProps!==s&&It(t);else{if(!s){if(t.stateNode===null)throw Error(o(166));return la(t),null}if(c=X.current,fs(t))Ou(t);else{var m=nr(pe.current);switch(c){case 1:c=m.createElementNS("http://www.w3.org/2000/svg",r);break;case 2:c=m.createElementNS("http://www.w3.org/1998/Math/MathML",r);break;default:switch(r){case"svg":c=m.createElementNS("http://www.w3.org/2000/svg",r);break;case"math":c=m.createElementNS("http://www.w3.org/1998/Math/MathML",r);break;case"script":c=m.createElement("div"),c.innerHTML="<script><\/script>",c=c.removeChild(c.firstChild);break;case"select":c=typeof s.is=="string"?m.createElement("select",{is:s.is}):m.createElement("select"),s.multiple?c.multiple=!0:s.size&&(c.size=s.size);break;default:c=typeof s.is=="string"?m.createElement(r,{is:s.is}):m.createElement(r)}}c[Sa]=t,c[Pa]=s;e:for(m=t.child;m!==null;){if(m.tag===5||m.tag===6)c.appendChild(m.stateNode);else if(m.tag!==4&&m.tag!==27&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===t)break e;for(;m.sibling===null;){if(m.return===null||m.return===t)break e;m=m.return}m.sibling.return=m.return,m=m.sibling}t.stateNode=c;e:switch(Ea(c,r,s),r){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break e;case"img":s=!0;break e;default:s=!1}s&&It(t)}}return la(t),lo(t,t.type,a===null?null:a.memoizedProps,t.pendingProps,n),null;case 6:if(a&&t.stateNode!=null)a.memoizedProps!==s&&It(t);else{if(typeof s!="string"&&t.stateNode===null)throw Error(o(166));if(a=pe.current,fs(t)){if(a=t.stateNode,n=t.memoizedProps,s=null,r=wa,r!==null)switch(r.tag){case 27:case 5:s=r.memoizedProps}a[Sa]=t,a=!!(a.nodeValue===n||s!==null&&s.suppressHydrationWarning===!0||Qh(a.nodeValue,n)),a||rn(t,!0)}else a=nr(a).createTextNode(s),a[Sa]=t,t.stateNode=a}return la(t),null;case 31:if(n=t.memoizedState,a===null||a.memoizedState!==null){if(s=fs(t),n!==null){if(a===null){if(!s)throw Error(o(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(o(557));a[Sa]=t}else Pn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;la(t),a=!1}else n=gc(),a!==null&&a.memoizedState!==null&&(a.memoizedState.hydrationErrors=n),a=!0;if(!a)return t.flags&256?(Ja(t),t):(Ja(t),null);if((t.flags&128)!==0)throw Error(o(558))}return la(t),null;case 13:if(s=t.memoizedState,a===null||a.memoizedState!==null&&a.memoizedState.dehydrated!==null){if(r=fs(t),s!==null&&s.dehydrated!==null){if(a===null){if(!r)throw Error(o(318));if(r=t.memoizedState,r=r!==null?r.dehydrated:null,!r)throw Error(o(317));r[Sa]=t}else Pn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;la(t),r=!1}else r=gc(),a!==null&&a.memoizedState!==null&&(a.memoizedState.hydrationErrors=r),r=!0;if(!r)return t.flags&256?(Ja(t),t):(Ja(t),null)}return Ja(t),(t.flags&128)!==0?(t.lanes=n,t):(n=s!==null,a=a!==null&&a.memoizedState!==null,n&&(s=t.child,r=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(r=s.alternate.memoizedState.cachePool.pool),c=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(c=s.memoizedState.cachePool.pool),c!==r&&(s.flags|=2048)),n!==a&&n&&(t.child.flags|=8192),Il(t,t.updateQueue),la(t),null);case 4:return S(),a===null&&Eo(t.stateNode.containerInfo),la(t),null;case 10:return zt(t.type),la(t),null;case 19:if(k(ma),s=t.memoizedState,s===null)return la(t),null;if(r=(t.flags&128)!==0,c=s.rendering,c===null)if(r)_i(s,!1);else{if(ua!==0||a!==null&&(a.flags&128)!==0)for(a=t.child;a!==null;){if(c=El(a),c!==null){for(t.flags|=128,_i(s,!1),a=c.updateQueue,t.updateQueue=a,Il(t,a),t.subtreeFlags=0,a=n,n=t.child;n!==null;)Eu(n,a),n=n.sibling;return Y(ma,ma.current&1|2),Fe&&Pt(t,s.treeForkCount),t.child}a=a.sibling}s.tail!==null&&pa()>Yl&&(t.flags|=128,r=!0,_i(s,!1),t.lanes=4194304)}else{if(!r)if(a=El(c),a!==null){if(t.flags|=128,r=!0,a=a.updateQueue,t.updateQueue=a,Il(t,a),_i(s,!0),s.tail===null&&s.tailMode==="hidden"&&!c.alternate&&!Fe)return la(t),null}else 2*pa()-s.renderingStartTime>Yl&&n!==536870912&&(t.flags|=128,r=!0,_i(s,!1),t.lanes=4194304);s.isBackwards?(c.sibling=t.child,t.child=c):(a=s.last,a!==null?a.sibling=c:t.child=c,s.last=c)}return s.tail!==null?(a=s.tail,s.rendering=a,s.tail=a.sibling,s.renderingStartTime=pa(),a.sibling=null,n=ma.current,Y(ma,r?n&1|2:n&1),Fe&&Pt(t,s.treeForkCount),a):(la(t),null);case 22:case 23:return Ja(t),Ec(),s=t.memoizedState!==null,a!==null?a.memoizedState!==null!==s&&(t.flags|=8192):s&&(t.flags|=8192),s?(n&536870912)!==0&&(t.flags&128)===0&&(la(t),t.subtreeFlags&6&&(t.flags|=8192)):la(t),n=t.updateQueue,n!==null&&Il(t,n.retryQueue),n=null,a!==null&&a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),s=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(s=t.memoizedState.cachePool.pool),s!==n&&(t.flags|=2048),a!==null&&k(Bn),null;case 24:return n=null,a!==null&&(n=a.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),zt(fa),la(t),null;case 25:return null;case 30:return null}throw Error(o(156,t.tag))}function Lx(a,t){switch(pc(t),t.tag){case 1:return a=t.flags,a&65536?(t.flags=a&-65537|128,t):null;case 3:return zt(fa),S(),a=t.flags,(a&65536)!==0&&(a&128)===0?(t.flags=a&-65537|128,t):null;case 26:case 27:case 5:return Je(t),null;case 31:if(t.memoizedState!==null){if(Ja(t),t.alternate===null)throw Error(o(340));Pn()}return a=t.flags,a&65536?(t.flags=a&-65537|128,t):null;case 13:if(Ja(t),a=t.memoizedState,a!==null&&a.dehydrated!==null){if(t.alternate===null)throw Error(o(340));Pn()}return a=t.flags,a&65536?(t.flags=a&-65537|128,t):null;case 19:return k(ma),null;case 4:return S(),null;case 10:return zt(t.type),null;case 22:case 23:return Ja(t),Ec(),a!==null&&k(Bn),a=t.flags,a&65536?(t.flags=a&-65537|128,t):null;case 24:return zt(fa),null;case 25:return null;default:return null}}function th(a,t){switch(pc(t),t.tag){case 3:zt(fa),S();break;case 26:case 27:case 5:Je(t);break;case 4:S();break;case 31:t.memoizedState!==null&&Ja(t);break;case 13:Ja(t);break;case 19:k(ma);break;case 10:zt(t.type);break;case 22:case 23:Ja(t),Ec(),a!==null&&k(Bn);break;case 24:zt(fa)}}function Si(a,t){try{var n=t.updateQueue,s=n!==null?n.lastEffect:null;if(s!==null){var r=s.next;n=r;do{if((n.tag&a)===a){s=void 0;var c=n.create,m=n.inst;s=c(),m.destroy=s}n=n.next}while(n!==r)}}catch(g){Ze(t,t.return,g)}}function pn(a,t,n){try{var s=t.updateQueue,r=s!==null?s.lastEffect:null;if(r!==null){var c=r.next;s=c;do{if((s.tag&a)===a){var m=s.inst,g=m.destroy;if(g!==void 0){m.destroy=void 0,r=t;var T=n,G=g;try{G()}catch(Q){Ze(r,T,Q)}}}s=s.next}while(s!==c)}}catch(Q){Ze(t,t.return,Q)}}function nh(a){var t=a.updateQueue;if(t!==null){var n=a.stateNode;try{Yu(t,n)}catch(s){Ze(a,a.return,s)}}}function sh(a,t,n){n.props=qn(a.type,a.memoizedProps),n.state=a.memoizedState;try{n.componentWillUnmount()}catch(s){Ze(a,t,s)}}function wi(a,t){try{var n=a.ref;if(n!==null){switch(a.tag){case 26:case 27:case 5:var s=a.stateNode;break;case 30:s=a.stateNode;break;default:s=a.stateNode}typeof n=="function"?a.refCleanup=n(s):n.current=s}}catch(r){Ze(a,t,r)}}function kt(a,t){var n=a.ref,s=a.refCleanup;if(n!==null)if(typeof s=="function")try{s()}catch(r){Ze(a,t,r)}finally{a.refCleanup=null,a=a.alternate,a!=null&&(a.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(r){Ze(a,t,r)}else n.current=null}function ih(a){var t=a.type,n=a.memoizedProps,s=a.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&s.focus();break e;case"img":n.src?s.src=n.src:n.srcSet&&(s.srcset=n.srcSet)}}catch(r){Ze(a,a.return,r)}}function ro(a,t,n){try{var s=a.stateNode;nb(s,a.type,n,t),s[Pa]=t}catch(r){Ze(a,a.return,r)}}function lh(a){return a.tag===5||a.tag===3||a.tag===26||a.tag===27&&yn(a.type)||a.tag===4}function co(a){e:for(;;){for(;a.sibling===null;){if(a.return===null||lh(a.return))return null;a=a.return}for(a.sibling.return=a.return,a=a.sibling;a.tag!==5&&a.tag!==6&&a.tag!==18;){if(a.tag===27&&yn(a.type)||a.flags&2||a.child===null||a.tag===4)continue e;a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}function oo(a,t,n){var s=a.tag;if(s===5||s===6)a=a.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Dt));else if(s!==4&&(s===27&&yn(a.type)&&(n=a.stateNode,t=null),a=a.child,a!==null))for(oo(a,t,n),a=a.sibling;a!==null;)oo(a,t,n),a=a.sibling}function Kl(a,t,n){var s=a.tag;if(s===5||s===6)a=a.stateNode,t?n.insertBefore(a,t):n.appendChild(a);else if(s!==4&&(s===27&&yn(a.type)&&(n=a.stateNode),a=a.child,a!==null))for(Kl(a,t,n),a=a.sibling;a!==null;)Kl(a,t,n),a=a.sibling}function rh(a){var t=a.stateNode,n=a.memoizedProps;try{for(var s=a.type,r=t.attributes;r.length;)t.removeAttributeNode(r[0]);Ea(t,s,n),t[Sa]=a,t[Pa]=n}catch(c){Ze(a,a.return,c)}}var Kt=!1,ba=!1,uo=!1,ch=typeof WeakSet=="function"?WeakSet:Set,ka=null;function Px(a,t){if(a=a.containerInfo,Ro=dr,a=vu(a),nc(a)){if("selectionStart"in a)var n={start:a.selectionStart,end:a.selectionEnd};else e:{n=(n=a.ownerDocument)&&n.defaultView||window;var s=n.getSelection&&n.getSelection();if(s&&s.rangeCount!==0){n=s.anchorNode;var r=s.anchorOffset,c=s.focusNode;s=s.focusOffset;try{n.nodeType,c.nodeType}catch{n=null;break e}var m=0,g=-1,T=-1,G=0,Q=0,ae=a,$=null;a:for(;;){for(var J;ae!==n||r!==0&&ae.nodeType!==3||(g=m+r),ae!==c||s!==0&&ae.nodeType!==3||(T=m+s),ae.nodeType===3&&(m+=ae.nodeValue.length),(J=ae.firstChild)!==null;)$=ae,ae=J;for(;;){if(ae===a)break a;if($===n&&++G===r&&(g=m),$===c&&++Q===s&&(T=m),(J=ae.nextSibling)!==null)break;ae=$,$=ae.parentNode}ae=J}n=g===-1||T===-1?null:{start:g,end:T}}else n=null}n=n||{start:0,end:0}}else n=null;for(Do={focusedElem:a,selectionRange:n},dr=!1,ka=t;ka!==null;)if(t=ka,a=t.child,(t.subtreeFlags&1028)!==0&&a!==null)a.return=t,ka=a;else for(;ka!==null;){switch(t=ka,c=t.alternate,a=t.flags,t.tag){case 0:if((a&4)!==0&&(a=t.updateQueue,a=a!==null?a.events:null,a!==null))for(n=0;n<a.length;n++)r=a[n],r.ref.impl=r.nextImpl;break;case 11:case 15:break;case 1:if((a&1024)!==0&&c!==null){a=void 0,n=t,r=c.memoizedProps,c=c.memoizedState,s=n.stateNode;try{var xe=qn(n.type,r);a=s.getSnapshotBeforeUpdate(xe,c),s.__reactInternalSnapshotBeforeUpdate=a}catch(_e){Ze(n,n.return,_e)}}break;case 3:if((a&1024)!==0){if(a=t.stateNode.containerInfo,n=a.nodeType,n===9)Po(a);else if(n===1)switch(a.nodeName){case"HEAD":case"HTML":case"BODY":Po(a);break;default:a.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((a&1024)!==0)throw Error(o(163))}if(a=t.sibling,a!==null){a.return=t.return,ka=a;break}ka=t.return}}function oh(a,t,n){var s=n.flags;switch(n.tag){case 0:case 11:case 15:Gt(a,n),s&4&&Si(5,n);break;case 1:if(Gt(a,n),s&4)if(a=n.stateNode,t===null)try{a.componentDidMount()}catch(m){Ze(n,n.return,m)}else{var r=qn(n.type,t.memoizedProps);t=t.memoizedState;try{a.componentDidUpdate(r,t,a.__reactInternalSnapshotBeforeUpdate)}catch(m){Ze(n,n.return,m)}}s&64&&nh(n),s&512&&wi(n,n.return);break;case 3:if(Gt(a,n),s&64&&(a=n.updateQueue,a!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Yu(a,t)}catch(m){Ze(n,n.return,m)}}break;case 27:t===null&&s&4&&rh(n);case 26:case 5:Gt(a,n),t===null&&s&4&&ih(n),s&512&&wi(n,n.return);break;case 12:Gt(a,n);break;case 31:Gt(a,n),s&4&&mh(a,n);break;case 13:Gt(a,n),s&4&&hh(a,n),s&64&&(a=n.memoizedState,a!==null&&(a=a.dehydrated,a!==null&&(n=Gx.bind(null,n),ub(a,n))));break;case 22:if(s=n.memoizedState!==null||Kt,!s){t=t!==null&&t.memoizedState!==null||ba,r=Kt;var c=ba;Kt=s,(ba=t)&&!c?$t(a,n,(n.subtreeFlags&8772)!==0):Gt(a,n),Kt=r,ba=c}break;case 30:break;default:Gt(a,n)}}function dh(a){var t=a.alternate;t!==null&&(a.alternate=null,dh(t)),a.child=null,a.deletions=null,a.sibling=null,a.tag===5&&(t=a.stateNode,t!==null&&Fr(t)),a.stateNode=null,a.return=null,a.dependencies=null,a.memoizedProps=null,a.memoizedState=null,a.pendingProps=null,a.stateNode=null,a.updateQueue=null}var ra=null,za=!1;function qt(a,t,n){for(n=n.child;n!==null;)uh(a,t,n),n=n.sibling}function uh(a,t,n){if(me&&typeof me.onCommitFiberUnmount=="function")try{me.onCommitFiberUnmount(le,n)}catch{}switch(n.tag){case 26:ba||kt(n,t),qt(a,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:ba||kt(n,t);var s=ra,r=za;yn(n.type)&&(ra=n.stateNode,za=!1),qt(a,t,n),Li(n.stateNode),ra=s,za=r;break;case 5:ba||kt(n,t);case 6:if(s=ra,r=za,ra=null,qt(a,t,n),ra=s,za=r,ra!==null)if(za)try{(ra.nodeType===9?ra.body:ra.nodeName==="HTML"?ra.ownerDocument.body:ra).removeChild(n.stateNode)}catch(c){Ze(n,t,c)}else try{ra.removeChild(n.stateNode)}catch(c){Ze(n,t,c)}break;case 18:ra!==null&&(za?(a=ra,np(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.stateNode),Ps(a)):np(ra,n.stateNode));break;case 4:s=ra,r=za,ra=n.stateNode.containerInfo,za=!0,qt(a,t,n),ra=s,za=r;break;case 0:case 11:case 14:case 15:pn(2,n,t),ba||pn(4,n,t),qt(a,t,n);break;case 1:ba||(kt(n,t),s=n.stateNode,typeof s.componentWillUnmount=="function"&&sh(n,t,s)),qt(a,t,n);break;case 21:qt(a,t,n);break;case 22:ba=(s=ba)||n.memoizedState!==null,qt(a,t,n),ba=s;break;default:qt(a,t,n)}}function mh(a,t){if(t.memoizedState===null&&(a=t.alternate,a!==null&&(a=a.memoizedState,a!==null))){a=a.dehydrated;try{Ps(a)}catch(n){Ze(t,t.return,n)}}}function hh(a,t){if(t.memoizedState===null&&(a=t.alternate,a!==null&&(a=a.memoizedState,a!==null&&(a=a.dehydrated,a!==null))))try{Ps(a)}catch(n){Ze(t,t.return,n)}}function Ux(a){switch(a.tag){case 31:case 13:case 19:var t=a.stateNode;return t===null&&(t=a.stateNode=new ch),t;case 22:return a=a.stateNode,t=a._retryCache,t===null&&(t=a._retryCache=new ch),t;default:throw Error(o(435,a.tag))}}function ql(a,t){var n=Ux(a);t.forEach(function(s){if(!n.has(s)){n.add(s);var r=$x.bind(null,a,s);s.then(r,r)}})}function Ba(a,t){var n=t.deletions;if(n!==null)for(var s=0;s<n.length;s++){var r=n[s],c=a,m=t,g=m;e:for(;g!==null;){switch(g.tag){case 27:if(yn(g.type)){ra=g.stateNode,za=!1;break e}break;case 5:ra=g.stateNode,za=!1;break e;case 3:case 4:ra=g.stateNode.containerInfo,za=!0;break e}g=g.return}if(ra===null)throw Error(o(160));uh(c,m,r),ra=null,za=!1,c=r.alternate,c!==null&&(c.return=null),r.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)ph(t,a),t=t.sibling}var ht=null;function ph(a,t){var n=a.alternate,s=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:Ba(t,a),Fa(a),s&4&&(pn(3,a,a.return),Si(3,a),pn(5,a,a.return));break;case 1:Ba(t,a),Fa(a),s&512&&(ba||n===null||kt(n,n.return)),s&64&&Kt&&(a=a.updateQueue,a!==null&&(s=a.callbacks,s!==null&&(n=a.shared.hiddenCallbacks,a.shared.hiddenCallbacks=n===null?s:n.concat(s))));break;case 26:var r=ht;if(Ba(t,a),Fa(a),s&512&&(ba||n===null||kt(n,n.return)),s&4){var c=n!==null?n.memoizedState:null;if(s=a.memoizedState,n===null)if(s===null)if(a.stateNode===null){e:{s=a.type,n=a.memoizedProps,r=r.ownerDocument||r;a:switch(s){case"title":c=r.getElementsByTagName("title")[0],(!c||c[Ws]||c[Sa]||c.namespaceURI==="http://www.w3.org/2000/svg"||c.hasAttribute("itemprop"))&&(c=r.createElement(s),r.head.insertBefore(c,r.querySelector("head > title"))),Ea(c,s,n),c[Sa]=a,Na(c),s=c;break e;case"link":var m=pp("link","href",r).get(s+(n.href||""));if(m){for(var g=0;g<m.length;g++)if(c=m[g],c.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&c.getAttribute("rel")===(n.rel==null?null:n.rel)&&c.getAttribute("title")===(n.title==null?null:n.title)&&c.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){m.splice(g,1);break a}}c=r.createElement(s),Ea(c,s,n),r.head.appendChild(c);break;case"meta":if(m=pp("meta","content",r).get(s+(n.content||""))){for(g=0;g<m.length;g++)if(c=m[g],c.getAttribute("content")===(n.content==null?null:""+n.content)&&c.getAttribute("name")===(n.name==null?null:n.name)&&c.getAttribute("property")===(n.property==null?null:n.property)&&c.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&c.getAttribute("charset")===(n.charSet==null?null:n.charSet)){m.splice(g,1);break a}}c=r.createElement(s),Ea(c,s,n),r.head.appendChild(c);break;default:throw Error(o(468,s))}c[Sa]=a,Na(c),s=c}a.stateNode=s}else fp(r,a.type,a.stateNode);else a.stateNode=hp(r,s,a.memoizedProps);else c!==s?(c===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):c.count--,s===null?fp(r,a.type,a.stateNode):hp(r,s,a.memoizedProps)):s===null&&a.stateNode!==null&&ro(a,a.memoizedProps,n.memoizedProps)}break;case 27:Ba(t,a),Fa(a),s&512&&(ba||n===null||kt(n,n.return)),n!==null&&s&4&&ro(a,a.memoizedProps,n.memoizedProps);break;case 5:if(Ba(t,a),Fa(a),s&512&&(ba||n===null||kt(n,n.return)),a.flags&32){r=a.stateNode;try{is(r,"")}catch(xe){Ze(a,a.return,xe)}}s&4&&a.stateNode!=null&&(r=a.memoizedProps,ro(a,r,n!==null?n.memoizedProps:r)),s&1024&&(uo=!0);break;case 6:if(Ba(t,a),Fa(a),s&4){if(a.stateNode===null)throw Error(o(162));s=a.memoizedProps,n=a.stateNode;try{n.nodeValue=s}catch(xe){Ze(a,a.return,xe)}}break;case 3:if(lr=null,r=ht,ht=sr(t.containerInfo),Ba(t,a),ht=r,Fa(a),s&4&&n!==null&&n.memoizedState.isDehydrated)try{Ps(t.containerInfo)}catch(xe){Ze(a,a.return,xe)}uo&&(uo=!1,fh(a));break;case 4:s=ht,ht=sr(a.stateNode.containerInfo),Ba(t,a),Fa(a),ht=s;break;case 12:Ba(t,a),Fa(a);break;case 31:Ba(t,a),Fa(a),s&4&&(s=a.updateQueue,s!==null&&(a.updateQueue=null,ql(a,s)));break;case 13:Ba(t,a),Fa(a),a.child.flags&8192&&a.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&($l=pa()),s&4&&(s=a.updateQueue,s!==null&&(a.updateQueue=null,ql(a,s)));break;case 22:r=a.memoizedState!==null;var T=n!==null&&n.memoizedState!==null,G=Kt,Q=ba;if(Kt=G||r,ba=Q||T,Ba(t,a),ba=Q,Kt=G,Fa(a),s&8192)e:for(t=a.stateNode,t._visibility=r?t._visibility&-2:t._visibility|1,r&&(n===null||T||Kt||ba||Gn(a)),n=null,t=a;;){if(t.tag===5||t.tag===26){if(n===null){T=n=t;try{if(c=T.stateNode,r)m=c.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none";else{g=T.stateNode;var ae=T.memoizedProps.style,$=ae!=null&&ae.hasOwnProperty("display")?ae.display:null;g.style.display=$==null||typeof $=="boolean"?"":(""+$).trim()}}catch(xe){Ze(T,T.return,xe)}}}else if(t.tag===6){if(n===null){T=t;try{T.stateNode.nodeValue=r?"":T.memoizedProps}catch(xe){Ze(T,T.return,xe)}}}else if(t.tag===18){if(n===null){T=t;try{var J=T.stateNode;r?sp(J,!0):sp(T.stateNode,!1)}catch(xe){Ze(T,T.return,xe)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===a)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===a)break e;for(;t.sibling===null;){if(t.return===null||t.return===a)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}s&4&&(s=a.updateQueue,s!==null&&(n=s.retryQueue,n!==null&&(s.retryQueue=null,ql(a,n))));break;case 19:Ba(t,a),Fa(a),s&4&&(s=a.updateQueue,s!==null&&(a.updateQueue=null,ql(a,s)));break;case 30:break;case 21:break;default:Ba(t,a),Fa(a)}}function Fa(a){var t=a.flags;if(t&2){try{for(var n,s=a.return;s!==null;){if(lh(s)){n=s;break}s=s.return}if(n==null)throw Error(o(160));switch(n.tag){case 27:var r=n.stateNode,c=co(a);Kl(a,c,r);break;case 5:var m=n.stateNode;n.flags&32&&(is(m,""),n.flags&=-33);var g=co(a);Kl(a,g,m);break;case 3:case 4:var T=n.stateNode.containerInfo,G=co(a);oo(a,G,T);break;default:throw Error(o(161))}}catch(Q){Ze(a,a.return,Q)}a.flags&=-3}t&4096&&(a.flags&=-4097)}function fh(a){if(a.subtreeFlags&1024)for(a=a.child;a!==null;){var t=a;fh(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),a=a.sibling}}function Gt(a,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)oh(a,t.alternate,t),t=t.sibling}function Gn(a){for(a=a.child;a!==null;){var t=a;switch(t.tag){case 0:case 11:case 14:case 15:pn(4,t,t.return),Gn(t);break;case 1:kt(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&sh(t,t.return,n),Gn(t);break;case 27:Li(t.stateNode);case 26:case 5:kt(t,t.return),Gn(t);break;case 22:t.memoizedState===null&&Gn(t);break;case 30:Gn(t);break;default:Gn(t)}a=a.sibling}}function $t(a,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var s=t.alternate,r=a,c=t,m=c.flags;switch(c.tag){case 0:case 11:case 15:$t(r,c,n),Si(4,c);break;case 1:if($t(r,c,n),s=c,r=s.stateNode,typeof r.componentDidMount=="function")try{r.componentDidMount()}catch(G){Ze(s,s.return,G)}if(s=c,r=s.updateQueue,r!==null){var g=s.stateNode;try{var T=r.shared.hiddenCallbacks;if(T!==null)for(r.shared.hiddenCallbacks=null,r=0;r<T.length;r++)$u(T[r],g)}catch(G){Ze(s,s.return,G)}}n&&m&64&&nh(c),wi(c,c.return);break;case 27:rh(c);case 26:case 5:$t(r,c,n),n&&s===null&&m&4&&ih(c),wi(c,c.return);break;case 12:$t(r,c,n);break;case 31:$t(r,c,n),n&&m&4&&mh(r,c);break;case 13:$t(r,c,n),n&&m&4&&hh(r,c);break;case 22:c.memoizedState===null&&$t(r,c,n),wi(c,c.return);break;case 30:break;default:$t(r,c,n)}t=t.sibling}}function mo(a,t){var n=null;a!==null&&a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),a=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),a!==n&&(a!=null&&a.refCount++,n!=null&&mi(n))}function ho(a,t){a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&mi(a))}function pt(a,t,n,s){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)gh(a,t,n,s),t=t.sibling}function gh(a,t,n,s){var r=t.flags;switch(t.tag){case 0:case 11:case 15:pt(a,t,n,s),r&2048&&Si(9,t);break;case 1:pt(a,t,n,s);break;case 3:pt(a,t,n,s),r&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&mi(a)));break;case 12:if(r&2048){pt(a,t,n,s),a=t.stateNode;try{var c=t.memoizedProps,m=c.id,g=c.onPostCommit;typeof g=="function"&&g(m,t.alternate===null?"mount":"update",a.passiveEffectDuration,-0)}catch(T){Ze(t,t.return,T)}}else pt(a,t,n,s);break;case 31:pt(a,t,n,s);break;case 13:pt(a,t,n,s);break;case 23:break;case 22:c=t.stateNode,m=t.alternate,t.memoizedState!==null?c._visibility&2?pt(a,t,n,s):Ai(a,t):c._visibility&2?pt(a,t,n,s):(c._visibility|=2,Ss(a,t,n,s,(t.subtreeFlags&10256)!==0||!1)),r&2048&&mo(m,t);break;case 24:pt(a,t,n,s),r&2048&&ho(t.alternate,t);break;default:pt(a,t,n,s)}}function Ss(a,t,n,s,r){for(r=r&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var c=a,m=t,g=n,T=s,G=m.flags;switch(m.tag){case 0:case 11:case 15:Ss(c,m,g,T,r),Si(8,m);break;case 23:break;case 22:var Q=m.stateNode;m.memoizedState!==null?Q._visibility&2?Ss(c,m,g,T,r):Ai(c,m):(Q._visibility|=2,Ss(c,m,g,T,r)),r&&G&2048&&mo(m.alternate,m);break;case 24:Ss(c,m,g,T,r),r&&G&2048&&ho(m.alternate,m);break;default:Ss(c,m,g,T,r)}t=t.sibling}}function Ai(a,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=a,s=t,r=s.flags;switch(s.tag){case 22:Ai(n,s),r&2048&&mo(s.alternate,s);break;case 24:Ai(n,s),r&2048&&ho(s.alternate,s);break;default:Ai(n,s)}t=t.sibling}}var Ti=8192;function ws(a,t,n){if(a.subtreeFlags&Ti)for(a=a.child;a!==null;)xh(a,t,n),a=a.sibling}function xh(a,t,n){switch(a.tag){case 26:ws(a,t,n),a.flags&Ti&&a.memoizedState!==null&&kb(n,ht,a.memoizedState,a.memoizedProps);break;case 5:ws(a,t,n);break;case 3:case 4:var s=ht;ht=sr(a.stateNode.containerInfo),ws(a,t,n),ht=s;break;case 22:a.memoizedState===null&&(s=a.alternate,s!==null&&s.memoizedState!==null?(s=Ti,Ti=16777216,ws(a,t,n),Ti=s):ws(a,t,n));break;default:ws(a,t,n)}}function bh(a){var t=a.alternate;if(t!==null&&(a=t.child,a!==null)){t.child=null;do t=a.sibling,a.sibling=null,a=t;while(a!==null)}}function Ei(a){var t=a.deletions;if((a.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var s=t[n];ka=s,vh(s,a)}bh(a)}if(a.subtreeFlags&10256)for(a=a.child;a!==null;)jh(a),a=a.sibling}function jh(a){switch(a.tag){case 0:case 11:case 15:Ei(a),a.flags&2048&&pn(9,a,a.return);break;case 3:Ei(a);break;case 12:Ei(a);break;case 22:var t=a.stateNode;a.memoizedState!==null&&t._visibility&2&&(a.return===null||a.return.tag!==13)?(t._visibility&=-3,Gl(a)):Ei(a);break;default:Ei(a)}}function Gl(a){var t=a.deletions;if((a.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var s=t[n];ka=s,vh(s,a)}bh(a)}for(a=a.child;a!==null;){switch(t=a,t.tag){case 0:case 11:case 15:pn(8,t,t.return),Gl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Gl(t));break;default:Gl(t)}a=a.sibling}}function vh(a,t){for(;ka!==null;){var n=ka;switch(n.tag){case 0:case 11:case 15:pn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var s=n.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:mi(n.memoizedState.cache)}if(s=n.child,s!==null)s.return=n,ka=s;else e:for(n=a;ka!==null;){s=ka;var r=s.sibling,c=s.return;if(dh(s),s===n){ka=null;break e}if(r!==null){r.return=c,ka=r;break e}ka=c}}}var zx={getCacheForType:function(a){var t=Aa(fa),n=t.data.get(a);return n===void 0&&(n=a(),t.data.set(a,n)),n},cacheSignal:function(){return Aa(fa).controller.signal}},Bx=typeof WeakMap=="function"?WeakMap:Map,Xe=0,na=null,Le=null,ze=0,Qe=0,Xa=null,fn=!1,As=!1,po=!1,Yt=0,ua=0,gn=0,$n=0,fo=0,Qa=0,Ts=0,Ci=null,Ha=null,go=!1,$l=0,yh=0,Yl=1/0,Vl=null,xn=null,va=0,bn=null,Es=null,Vt=0,xo=0,bo=null,Nh=null,Mi=0,jo=null;function Za(){return(Xe&2)!==0&&ze!==0?ze&-ze:U.T!==null?So():zd()}function kh(){if(Qa===0)if((ze&536870912)===0||Fe){var a=Ct;Ct<<=1,(Ct&3932160)===0&&(Ct=262144),Qa=a}else Qa=536870912;return a=Va.current,a!==null&&(a.flags|=32),Qa}function Ia(a,t,n){(a===na&&(Qe===2||Qe===9)||a.cancelPendingCommit!==null)&&(Cs(a,0),jn(a,ze,Qa,!1)),ne(a,n),((Xe&2)===0||a!==na)&&(a===na&&((Xe&2)===0&&($n|=n),ua===4&&jn(a,ze,Qa,!1)),_t(a))}function _h(a,t,n){if((Xe&6)!==0)throw Error(o(327));var s=!n&&(t&127)===0&&(t&a.expiredLanes)===0||En(a,t),r=s?Ix(a,t):yo(a,t,!0),c=s;do{if(r===0){As&&!s&&jn(a,t,0,!1);break}else{if(n=a.current.alternate,c&&!Fx(n)){r=yo(a,t,!1),c=!1;continue}if(r===2){if(c=t,a.errorRecoveryDisabledLanes&c)var m=0;else m=a.pendingLanes&-536870913,m=m!==0?m:m&536870912?536870912:0;if(m!==0){t=m;e:{var g=a;r=Ci;var T=g.current.memoizedState.isDehydrated;if(T&&(Cs(g,m).flags|=256),m=yo(g,m,!1),m!==2){if(po&&!T){g.errorRecoveryDisabledLanes|=c,$n|=c,r=4;break e}c=Ha,Ha=r,c!==null&&(Ha===null?Ha=c:Ha.push.apply(Ha,c))}r=m}if(c=!1,r!==2)continue}}if(r===1){Cs(a,0),jn(a,t,0,!0);break}e:{switch(s=a,c=r,c){case 0:case 1:throw Error(o(345));case 4:if((t&4194048)!==t)break;case 6:jn(s,t,Qa,!fn);break e;case 2:Ha=null;break;case 3:case 5:break;default:throw Error(o(329))}if((t&62914560)===t&&(r=$l+300-pa(),10<r)){if(jn(s,t,Qa,!fn),Zn(s,0,!0)!==0)break e;Vt=t,s.timeoutHandle=ap(Sh.bind(null,s,n,Ha,Vl,go,t,Qa,$n,Ts,fn,c,"Throttled",-0,0),r);break e}Sh(s,n,Ha,Vl,go,t,Qa,$n,Ts,fn,c,null,-0,0)}}break}while(!0);_t(a)}function Sh(a,t,n,s,r,c,m,g,T,G,Q,ae,$,J){if(a.timeoutHandle=-1,ae=t.subtreeFlags,ae&8192||(ae&16785408)===16785408){ae={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Dt},xh(t,c,ae);var xe=(c&62914560)===c?$l-pa():(c&4194048)===c?yh-pa():0;if(xe=_b(ae,xe),xe!==null){Vt=c,a.cancelPendingCommit=xe(Dh.bind(null,a,t,c,n,s,r,m,g,T,Q,ae,null,$,J)),jn(a,c,m,!G);return}}Dh(a,t,c,n,s,r,m,g,T)}function Fx(a){for(var t=a;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var s=0;s<n.length;s++){var r=n[s],c=r.getSnapshot;r=r.value;try{if(!$a(c(),r))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===a)break;for(;t.sibling===null;){if(t.return===null||t.return===a)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function jn(a,t,n,s){t&=~fo,t&=~$n,a.suspendedLanes|=t,a.pingedLanes&=~t,s&&(a.warmLanes|=t),s=a.expirationTimes;for(var r=t;0<r;){var c=31-ya(r),m=1<<c;s[c]=-1,r&=~m}n!==0&&Ge(a,n,t)}function Jl(){return(Xe&6)===0?(Ri(0),!1):!0}function vo(){if(Le!==null){if(Qe===0)var a=Le.return;else a=Le,Ut=Un=null,Lc(a),vs=null,pi=0,a=Le;for(;a!==null;)th(a.alternate,a),a=a.return;Le=null}}function Cs(a,t){var n=a.timeoutHandle;n!==-1&&(a.timeoutHandle=-1,lb(n)),n=a.cancelPendingCommit,n!==null&&(a.cancelPendingCommit=null,n()),Vt=0,vo(),na=a,Le=n=Lt(a.current,null),ze=t,Qe=0,Xa=null,fn=!1,As=En(a,t),po=!1,Ts=Qa=fo=$n=gn=ua=0,Ha=Ci=null,go=!1,(t&8)!==0&&(t|=t&32);var s=a.entangledLanes;if(s!==0)for(a=a.entanglements,s&=t;0<s;){var r=31-ya(s),c=1<<r;t|=a[r],s&=~c}return Yt=t,gl(),n}function wh(a,t){Me=null,U.H=Ni,t===js||t===_l?(t=Iu(),Qe=3):t===kc?(t=Iu(),Qe=4):Qe=t===Qc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Xa=t,Le===null&&(ua=1,zl(a,st(t,a.current)))}function Ah(){var a=Va.current;return a===null?!0:(ze&4194048)===ze?ct===null:(ze&62914560)===ze||(ze&536870912)!==0?a===ct:!1}function Th(){var a=U.H;return U.H=Ni,a===null?Ni:a}function Eh(){var a=U.A;return U.A=zx,a}function Xl(){ua=4,fn||(ze&4194048)!==ze&&Va.current!==null||(As=!0),(gn&134217727)===0&&($n&134217727)===0||na===null||jn(na,ze,Qa,!1)}function yo(a,t,n){var s=Xe;Xe|=2;var r=Th(),c=Eh();(na!==a||ze!==t)&&(Vl=null,Cs(a,t)),t=!1;var m=ua;e:do try{if(Qe!==0&&Le!==null){var g=Le,T=Xa;switch(Qe){case 8:vo(),m=6;break e;case 3:case 2:case 9:case 6:Va.current===null&&(t=!0);var G=Qe;if(Qe=0,Xa=null,Ms(a,g,T,G),n&&As){m=0;break e}break;default:G=Qe,Qe=0,Xa=null,Ms(a,g,T,G)}}Hx(),m=ua;break}catch(Q){wh(a,Q)}while(!0);return t&&a.shellSuspendCounter++,Ut=Un=null,Xe=s,U.H=r,U.A=c,Le===null&&(na=null,ze=0,gl()),m}function Hx(){for(;Le!==null;)Ch(Le)}function Ix(a,t){var n=Xe;Xe|=2;var s=Th(),r=Eh();na!==a||ze!==t?(Vl=null,Yl=pa()+500,Cs(a,t)):As=En(a,t);e:do try{if(Qe!==0&&Le!==null){t=Le;var c=Xa;a:switch(Qe){case 1:Qe=0,Xa=null,Ms(a,t,c,1);break;case 2:case 9:if(Fu(c)){Qe=0,Xa=null,Mh(t);break}t=function(){Qe!==2&&Qe!==9||na!==a||(Qe=7),_t(a)},c.then(t,t);break e;case 3:Qe=7;break e;case 4:Qe=5;break e;case 7:Fu(c)?(Qe=0,Xa=null,Mh(t)):(Qe=0,Xa=null,Ms(a,t,c,7));break;case 5:var m=null;switch(Le.tag){case 26:m=Le.memoizedState;case 5:case 27:var g=Le;if(m?gp(m):g.stateNode.complete){Qe=0,Xa=null;var T=g.sibling;if(T!==null)Le=T;else{var G=g.return;G!==null?(Le=G,Ql(G)):Le=null}break a}}Qe=0,Xa=null,Ms(a,t,c,5);break;case 6:Qe=0,Xa=null,Ms(a,t,c,6);break;case 8:vo(),ua=6;break e;default:throw Error(o(462))}}Kx();break}catch(Q){wh(a,Q)}while(!0);return Ut=Un=null,U.H=s,U.A=r,Xe=n,Le!==null?0:(na=null,ze=0,gl(),ua)}function Kx(){for(;Le!==null&&!Tt();)Ch(Le)}function Ch(a){var t=eh(a.alternate,a,Yt);a.memoizedProps=a.pendingProps,t===null?Ql(a):Le=t}function Mh(a){var t=a,n=t.alternate;switch(t.tag){case 15:case 0:t=Vm(n,t,t.pendingProps,t.type,void 0,ze);break;case 11:t=Vm(n,t,t.pendingProps,t.type.render,t.ref,ze);break;case 5:Lc(t);default:th(n,t),t=Le=Eu(t,Yt),t=eh(n,t,Yt)}a.memoizedProps=a.pendingProps,t===null?Ql(a):Le=t}function Ms(a,t,n,s){Ut=Un=null,Lc(t),vs=null,pi=0;var r=t.return;try{if(Mx(a,r,t,n,ze)){ua=1,zl(a,st(n,a.current)),Le=null;return}}catch(c){if(r!==null)throw Le=r,c;ua=1,zl(a,st(n,a.current)),Le=null;return}t.flags&32768?(Fe||s===1?a=!0:As||(ze&536870912)!==0?a=!1:(fn=a=!0,(s===2||s===9||s===3||s===6)&&(s=Va.current,s!==null&&s.tag===13&&(s.flags|=16384))),Rh(t,a)):Ql(t)}function Ql(a){var t=a;do{if((t.flags&32768)!==0){Rh(t,fn);return}a=t.return;var n=Ox(t.alternate,t,Yt);if(n!==null){Le=n;return}if(t=t.sibling,t!==null){Le=t;return}Le=t=a}while(t!==null);ua===0&&(ua=5)}function Rh(a,t){do{var n=Lx(a.alternate,a);if(n!==null){n.flags&=32767,Le=n;return}if(n=a.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(a=a.sibling,a!==null)){Le=a;return}Le=a=n}while(a!==null);ua=6,Le=null}function Dh(a,t,n,s,r,c,m,g,T){a.cancelPendingCommit=null;do Zl();while(va!==0);if((Xe&6)!==0)throw Error(o(327));if(t!==null){if(t===a.current)throw Error(o(177));if(c=t.lanes|t.childLanes,c|=cc,je(a,n,c,m,g,T),a===na&&(Le=na=null,ze=0),Es=t,bn=a,Vt=n,xo=c,bo=r,Nh=s,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(a.callbackNode=null,a.callbackPriority=0,Yx(vt,function(){return zh(),null})):(a.callbackNode=null,a.callbackPriority=0),s=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||s){s=U.T,U.T=null,r=ie.p,ie.p=2,m=Xe,Xe|=4;try{Px(a,t,n)}finally{Xe=m,ie.p=r,U.T=s}}va=1,Oh(),Lh(),Ph()}}function Oh(){if(va===1){va=0;var a=bn,t=Es,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=U.T,U.T=null;var s=ie.p;ie.p=2;var r=Xe;Xe|=4;try{ph(t,a);var c=Do,m=vu(a.containerInfo),g=c.focusedElem,T=c.selectionRange;if(m!==g&&g&&g.ownerDocument&&ju(g.ownerDocument.documentElement,g)){if(T!==null&&nc(g)){var G=T.start,Q=T.end;if(Q===void 0&&(Q=G),"selectionStart"in g)g.selectionStart=G,g.selectionEnd=Math.min(Q,g.value.length);else{var ae=g.ownerDocument||document,$=ae&&ae.defaultView||window;if($.getSelection){var J=$.getSelection(),xe=g.textContent.length,_e=Math.min(T.start,xe),ta=T.end===void 0?_e:Math.min(T.end,xe);!J.extend&&_e>ta&&(m=ta,ta=_e,_e=m);var z=bu(g,_e),C=bu(g,ta);if(z&&C&&(J.rangeCount!==1||J.anchorNode!==z.node||J.anchorOffset!==z.offset||J.focusNode!==C.node||J.focusOffset!==C.offset)){var K=ae.createRange();K.setStart(z.node,z.offset),J.removeAllRanges(),_e>ta?(J.addRange(K),J.extend(C.node,C.offset)):(K.setEnd(C.node,C.offset),J.addRange(K))}}}}for(ae=[],J=g;J=J.parentNode;)J.nodeType===1&&ae.push({element:J,left:J.scrollLeft,top:J.scrollTop});for(typeof g.focus=="function"&&g.focus(),g=0;g<ae.length;g++){var W=ae[g];W.element.scrollLeft=W.left,W.element.scrollTop=W.top}}dr=!!Ro,Do=Ro=null}finally{Xe=r,ie.p=s,U.T=n}}a.current=t,va=2}}function Lh(){if(va===2){va=0;var a=bn,t=Es,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=U.T,U.T=null;var s=ie.p;ie.p=2;var r=Xe;Xe|=4;try{oh(a,t.alternate,t)}finally{Xe=r,ie.p=s,U.T=n}}va=3}}function Ph(){if(va===4||va===3){va=0,We();var a=bn,t=Es,n=Vt,s=Nh;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?va=5:(va=0,Es=bn=null,Uh(a,a.pendingLanes));var r=a.pendingLanes;if(r===0&&(xn=null),et(n),t=t.stateNode,me&&typeof me.onCommitFiberRoot=="function")try{me.onCommitFiberRoot(le,t,void 0,(t.current.flags&128)===128)}catch{}if(s!==null){t=U.T,r=ie.p,ie.p=2,U.T=null;try{for(var c=a.onRecoverableError,m=0;m<s.length;m++){var g=s[m];c(g.value,{componentStack:g.stack})}}finally{U.T=t,ie.p=r}}(Vt&3)!==0&&Zl(),_t(a),r=a.pendingLanes,(n&261930)!==0&&(r&42)!==0?a===jo?Mi++:(Mi=0,jo=a):Mi=0,Ri(0)}}function Uh(a,t){(a.pooledCacheLanes&=t)===0&&(t=a.pooledCache,t!=null&&(a.pooledCache=null,mi(t)))}function Zl(){return Oh(),Lh(),Ph(),zh()}function zh(){if(va!==5)return!1;var a=bn,t=xo;xo=0;var n=et(Vt),s=U.T,r=ie.p;try{ie.p=32>n?32:n,U.T=null,n=bo,bo=null;var c=bn,m=Vt;if(va=0,Es=bn=null,Vt=0,(Xe&6)!==0)throw Error(o(331));var g=Xe;if(Xe|=4,jh(c.current),gh(c,c.current,m,n),Xe=g,Ri(0,!1),me&&typeof me.onPostCommitFiberRoot=="function")try{me.onPostCommitFiberRoot(le,c)}catch{}return!0}finally{ie.p=r,U.T=s,Uh(a,t)}}function Bh(a,t,n){t=st(n,t),t=Xc(a.stateNode,t,2),a=un(a,t,2),a!==null&&(ne(a,2),_t(a))}function Ze(a,t,n){if(a.tag===3)Bh(a,a,n);else for(;t!==null;){if(t.tag===3){Bh(t,a,n);break}else if(t.tag===1){var s=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(xn===null||!xn.has(s))){a=st(n,a),n=Fm(2),s=un(t,n,2),s!==null&&(Hm(n,s,t,a),ne(s,2),_t(s));break}}t=t.return}}function No(a,t,n){var s=a.pingCache;if(s===null){s=a.pingCache=new Bx;var r=new Set;s.set(t,r)}else r=s.get(t),r===void 0&&(r=new Set,s.set(t,r));r.has(n)||(po=!0,r.add(n),a=qx.bind(null,a,t,n),t.then(a,a))}function qx(a,t,n){var s=a.pingCache;s!==null&&s.delete(t),a.pingedLanes|=a.suspendedLanes&n,a.warmLanes&=~n,na===a&&(ze&n)===n&&(ua===4||ua===3&&(ze&62914560)===ze&&300>pa()-$l?(Xe&2)===0&&Cs(a,0):fo|=n,Ts===ze&&(Ts=0)),_t(a)}function Fh(a,t){t===0&&(t=sl()),a=On(a,t),a!==null&&(ne(a,t),_t(a))}function Gx(a){var t=a.memoizedState,n=0;t!==null&&(n=t.retryLane),Fh(a,n)}function $x(a,t){var n=0;switch(a.tag){case 31:case 13:var s=a.stateNode,r=a.memoizedState;r!==null&&(n=r.retryLane);break;case 19:s=a.stateNode;break;case 22:s=a.stateNode._retryCache;break;default:throw Error(o(314))}s!==null&&s.delete(t),Fh(a,n)}function Yx(a,t){return Ke(a,t)}var Wl=null,Rs=null,ko=!1,er=!1,_o=!1,vn=0;function _t(a){a!==Rs&&a.next===null&&(Rs===null?Wl=Rs=a:Rs=Rs.next=a),er=!0,ko||(ko=!0,Jx())}function Ri(a,t){if(!_o&&er){_o=!0;do for(var n=!1,s=Wl;s!==null;){if(a!==0){var r=s.pendingLanes;if(r===0)var c=0;else{var m=s.suspendedLanes,g=s.pingedLanes;c=(1<<31-ya(42|a)+1)-1,c&=r&~(m&~g),c=c&201326741?c&201326741|1:c?c|2:0}c!==0&&(n=!0,qh(s,c))}else c=ze,c=Zn(s,s===na?c:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(c&3)===0||En(s,c)||(n=!0,qh(s,c));s=s.next}while(n);_o=!1}}function Vx(){Hh()}function Hh(){er=ko=!1;var a=0;vn!==0&&ib()&&(a=vn);for(var t=pa(),n=null,s=Wl;s!==null;){var r=s.next,c=Ih(s,t);c===0?(s.next=null,n===null?Wl=r:n.next=r,r===null&&(Rs=n)):(n=s,(a!==0||(c&3)!==0)&&(er=!0)),s=r}va!==0&&va!==5||Ri(a),vn!==0&&(vn=0)}function Ih(a,t){for(var n=a.suspendedLanes,s=a.pingedLanes,r=a.expirationTimes,c=a.pendingLanes&-62914561;0<c;){var m=31-ya(c),g=1<<m,T=r[m];T===-1?((g&n)===0||(g&s)!==0)&&(r[m]=Zs(g,t)):T<=t&&(a.expiredLanes|=g),c&=~g}if(t=na,n=ze,n=Zn(a,a===t?n:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),s=a.callbackNode,n===0||a===t&&(Qe===2||Qe===9)||a.cancelPendingCommit!==null)return s!==null&&s!==null&&Oa(s),a.callbackNode=null,a.callbackPriority=0;if((n&3)===0||En(a,n)){if(t=n&-n,t===a.callbackPriority)return t;switch(s!==null&&Oa(s),et(n)){case 2:case 8:n=Et;break;case 32:n=vt;break;case 268435456:n=ja;break;default:n=vt}return s=Kh.bind(null,a),n=Ke(n,s),a.callbackPriority=t,a.callbackNode=n,t}return s!==null&&s!==null&&Oa(s),a.callbackPriority=2,a.callbackNode=null,2}function Kh(a,t){if(va!==0&&va!==5)return a.callbackNode=null,a.callbackPriority=0,null;var n=a.callbackNode;if(Zl()&&a.callbackNode!==n)return null;var s=ze;return s=Zn(a,a===na?s:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),s===0?null:(_h(a,s,t),Ih(a,pa()),a.callbackNode!=null&&a.callbackNode===n?Kh.bind(null,a):null)}function qh(a,t){if(Zl())return null;_h(a,t,!0)}function Jx(){rb(function(){(Xe&6)!==0?Ke(An,Vx):Hh()})}function So(){if(vn===0){var a=xs;a===0&&(a=en,en<<=1,(en&261888)===0&&(en=256)),vn=a}return vn}function Gh(a){return a==null||typeof a=="symbol"||typeof a=="boolean"?null:typeof a=="function"?a:cl(""+a)}function $h(a,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,a.id&&n.setAttribute("form",a.id),t.parentNode.insertBefore(n,t),a=new FormData(a),n.parentNode.removeChild(n),a}function Xx(a,t,n,s,r){if(t==="submit"&&n&&n.stateNode===r){var c=Gh((r[Pa]||null).action),m=s.submitter;m&&(t=(t=m[Pa]||null)?Gh(t.formAction):m.getAttribute("formAction"),t!==null&&(c=t,m=null));var g=new ml("action","action",null,s,r);a.push({event:g,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(vn!==0){var T=m?$h(r,m):new FormData(r);qc(n,{pending:!0,data:T,method:r.method,action:c},null,T)}}else typeof c=="function"&&(g.preventDefault(),T=m?$h(r,m):new FormData(r),qc(n,{pending:!0,data:T,method:r.method,action:c},c,T))},currentTarget:r}]})}}for(var wo=0;wo<rc.length;wo++){var Ao=rc[wo],Qx=Ao.toLowerCase(),Zx=Ao[0].toUpperCase()+Ao.slice(1);mt(Qx,"on"+Zx)}mt(ku,"onAnimationEnd"),mt(_u,"onAnimationIteration"),mt(Su,"onAnimationStart"),mt("dblclick","onDoubleClick"),mt("focusin","onFocus"),mt("focusout","onBlur"),mt(px,"onTransitionRun"),mt(fx,"onTransitionStart"),mt(gx,"onTransitionCancel"),mt(wu,"onTransitionEnd"),ns("onMouseEnter",["mouseout","mouseover"]),ns("onMouseLeave",["mouseout","mouseover"]),ns("onPointerEnter",["pointerout","pointerover"]),ns("onPointerLeave",["pointerout","pointerover"]),Cn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Cn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Cn("onBeforeInput",["compositionend","keypress","textInput","paste"]),Cn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Cn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Cn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Di="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Wx=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Di));function Yh(a,t){t=(t&4)!==0;for(var n=0;n<a.length;n++){var s=a[n],r=s.event;s=s.listeners;e:{var c=void 0;if(t)for(var m=s.length-1;0<=m;m--){var g=s[m],T=g.instance,G=g.currentTarget;if(g=g.listener,T!==c&&r.isPropagationStopped())break e;c=g,r.currentTarget=G;try{c(r)}catch(Q){fl(Q)}r.currentTarget=null,c=T}else for(m=0;m<s.length;m++){if(g=s[m],T=g.instance,G=g.currentTarget,g=g.listener,T!==c&&r.isPropagationStopped())break e;c=g,r.currentTarget=G;try{c(r)}catch(Q){fl(Q)}r.currentTarget=null,c=T}}}}function Pe(a,t){var n=t[Br];n===void 0&&(n=t[Br]=new Set);var s=a+"__bubble";n.has(s)||(Vh(t,a,2,!1),n.add(s))}function To(a,t,n){var s=0;t&&(s|=4),Vh(n,a,s,t)}var ar="_reactListening"+Math.random().toString(36).slice(2);function Eo(a){if(!a[ar]){a[ar]=!0,Hd.forEach(function(n){n!=="selectionchange"&&(Wx.has(n)||To(n,!1,a),To(n,!0,a))});var t=a.nodeType===9?a:a.ownerDocument;t===null||t[ar]||(t[ar]=!0,To("selectionchange",!1,t))}}function Vh(a,t,n,s){switch(kp(t)){case 2:var r=Ab;break;case 8:r=Tb;break;default:r=qo}n=r.bind(null,t,n,a),r=void 0,!Vr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),s?r!==void 0?a.addEventListener(t,n,{capture:!0,passive:r}):a.addEventListener(t,n,!0):r!==void 0?a.addEventListener(t,n,{passive:r}):a.addEventListener(t,n,!1)}function Co(a,t,n,s,r){var c=s;if((t&1)===0&&(t&2)===0&&s!==null)e:for(;;){if(s===null)return;var m=s.tag;if(m===3||m===4){var g=s.stateNode.containerInfo;if(g===r)break;if(m===4)for(m=s.return;m!==null;){var T=m.tag;if((T===3||T===4)&&m.stateNode.containerInfo===r)return;m=m.return}for(;g!==null;){if(m=es(g),m===null)return;if(T=m.tag,T===5||T===6||T===26||T===27){s=c=m;continue e}g=g.parentNode}}s=s.return}Wd(function(){var G=c,Q=$r(n),ae=[];e:{var $=Au.get(a);if($!==void 0){var J=ml,xe=a;switch(a){case"keypress":if(dl(n)===0)break e;case"keydown":case"keyup":J=$g;break;case"focusin":xe="focus",J=Zr;break;case"focusout":xe="blur",J=Zr;break;case"beforeblur":case"afterblur":J=Zr;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":J=tu;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":J=Og;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":J=Jg;break;case ku:case _u:case Su:J=Ug;break;case wu:J=Qg;break;case"scroll":case"scrollend":J=Rg;break;case"wheel":J=Wg;break;case"copy":case"cut":case"paste":J=Bg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":J=su;break;case"toggle":case"beforetoggle":J=ax}var _e=(t&4)!==0,ta=!_e&&(a==="scroll"||a==="scrollend"),z=_e?$!==null?$+"Capture":null:$;_e=[];for(var C=G,K;C!==null;){var W=C;if(K=W.stateNode,W=W.tag,W!==5&&W!==26&&W!==27||K===null||z===null||(W=ai(C,z),W!=null&&_e.push(Oi(C,W,K))),ta)break;C=C.return}0<_e.length&&($=new J($,xe,null,n,Q),ae.push({event:$,listeners:_e}))}}if((t&7)===0){e:{if($=a==="mouseover"||a==="pointerover",J=a==="mouseout"||a==="pointerout",$&&n!==Gr&&(xe=n.relatedTarget||n.fromElement)&&(es(xe)||xe[Wn]))break e;if((J||$)&&($=Q.window===Q?Q:($=Q.ownerDocument)?$.defaultView||$.parentWindow:window,J?(xe=n.relatedTarget||n.toElement,J=G,xe=xe?es(xe):null,xe!==null&&(ta=h(xe),_e=xe.tag,xe!==ta||_e!==5&&_e!==27&&_e!==6)&&(xe=null)):(J=null,xe=G),J!==xe)){if(_e=tu,W="onMouseLeave",z="onMouseEnter",C="mouse",(a==="pointerout"||a==="pointerover")&&(_e=su,W="onPointerLeave",z="onPointerEnter",C="pointer"),ta=J==null?$:ei(J),K=xe==null?$:ei(xe),$=new _e(W,C+"leave",J,n,Q),$.target=ta,$.relatedTarget=K,W=null,es(Q)===G&&(_e=new _e(z,C+"enter",xe,n,Q),_e.target=K,_e.relatedTarget=ta,W=_e),ta=W,J&&xe)a:{for(_e=eb,z=J,C=xe,K=0,W=z;W;W=_e(W))K++;W=0;for(var Ne=C;Ne;Ne=_e(Ne))W++;for(;0<K-W;)z=_e(z),K--;for(;0<W-K;)C=_e(C),W--;for(;K--;){if(z===C||C!==null&&z===C.alternate){_e=z;break a}z=_e(z),C=_e(C)}_e=null}else _e=null;J!==null&&Jh(ae,$,J,_e,!1),xe!==null&&ta!==null&&Jh(ae,ta,xe,_e,!0)}}e:{if($=G?ei(G):window,J=$.nodeName&&$.nodeName.toLowerCase(),J==="select"||J==="input"&&$.type==="file")var $e=mu;else if(du($))if(hu)$e=ux;else{$e=ox;var ve=cx}else J=$.nodeName,!J||J.toLowerCase()!=="input"||$.type!=="checkbox"&&$.type!=="radio"?G&&qr(G.elementType)&&($e=mu):$e=dx;if($e&&($e=$e(a,G))){uu(ae,$e,n,Q);break e}ve&&ve(a,$,G),a==="focusout"&&G&&$.type==="number"&&G.memoizedProps.value!=null&&Kr($,"number",$.value)}switch(ve=G?ei(G):window,a){case"focusin":(du(ve)||ve.contentEditable==="true")&&(os=ve,sc=G,oi=null);break;case"focusout":oi=sc=os=null;break;case"mousedown":ic=!0;break;case"contextmenu":case"mouseup":case"dragend":ic=!1,yu(ae,n,Q);break;case"selectionchange":if(hx)break;case"keydown":case"keyup":yu(ae,n,Q)}var De;if(ec)e:{switch(a){case"compositionstart":var Be="onCompositionStart";break e;case"compositionend":Be="onCompositionEnd";break e;case"compositionupdate":Be="onCompositionUpdate";break e}Be=void 0}else cs?cu(a,n)&&(Be="onCompositionEnd"):a==="keydown"&&n.keyCode===229&&(Be="onCompositionStart");Be&&(iu&&n.locale!=="ko"&&(cs||Be!=="onCompositionStart"?Be==="onCompositionEnd"&&cs&&(De=eu()):(nn=Q,Jr="value"in nn?nn.value:nn.textContent,cs=!0)),ve=tr(G,Be),0<ve.length&&(Be=new nu(Be,a,null,n,Q),ae.push({event:Be,listeners:ve}),De?Be.data=De:(De=ou(n),De!==null&&(Be.data=De)))),(De=nx?sx(a,n):ix(a,n))&&(Be=tr(G,"onBeforeInput"),0<Be.length&&(ve=new nu("onBeforeInput","beforeinput",null,n,Q),ae.push({event:ve,listeners:Be}),ve.data=De)),Xx(ae,a,G,n,Q)}Yh(ae,t)})}function Oi(a,t,n){return{instance:a,listener:t,currentTarget:n}}function tr(a,t){for(var n=t+"Capture",s=[];a!==null;){var r=a,c=r.stateNode;if(r=r.tag,r!==5&&r!==26&&r!==27||c===null||(r=ai(a,n),r!=null&&s.unshift(Oi(a,r,c)),r=ai(a,t),r!=null&&s.push(Oi(a,r,c))),a.tag===3)return s;a=a.return}return[]}function eb(a){if(a===null)return null;do a=a.return;while(a&&a.tag!==5&&a.tag!==27);return a||null}function Jh(a,t,n,s,r){for(var c=t._reactName,m=[];n!==null&&n!==s;){var g=n,T=g.alternate,G=g.stateNode;if(g=g.tag,T!==null&&T===s)break;g!==5&&g!==26&&g!==27||G===null||(T=G,r?(G=ai(n,c),G!=null&&m.unshift(Oi(n,G,T))):r||(G=ai(n,c),G!=null&&m.push(Oi(n,G,T)))),n=n.return}m.length!==0&&a.push({event:t,listeners:m})}var ab=/\r\n?/g,tb=/\u0000|\uFFFD/g;function Xh(a){return(typeof a=="string"?a:""+a).replace(ab,`
`).replace(tb,"")}function Qh(a,t){return t=Xh(t),Xh(a)===t}function aa(a,t,n,s,r,c){switch(n){case"children":typeof s=="string"?t==="body"||t==="textarea"&&s===""||is(a,s):(typeof s=="number"||typeof s=="bigint")&&t!=="body"&&is(a,""+s);break;case"className":ll(a,"class",s);break;case"tabIndex":ll(a,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":ll(a,n,s);break;case"style":Qd(a,s,c);break;case"data":if(t!=="object"){ll(a,"data",s);break}case"src":case"href":if(s===""&&(t!=="a"||n!=="href")){a.removeAttribute(n);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){a.removeAttribute(n);break}s=cl(""+s),a.setAttribute(n,s);break;case"action":case"formAction":if(typeof s=="function"){a.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof c=="function"&&(n==="formAction"?(t!=="input"&&aa(a,t,"name",r.name,r,null),aa(a,t,"formEncType",r.formEncType,r,null),aa(a,t,"formMethod",r.formMethod,r,null),aa(a,t,"formTarget",r.formTarget,r,null)):(aa(a,t,"encType",r.encType,r,null),aa(a,t,"method",r.method,r,null),aa(a,t,"target",r.target,r,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){a.removeAttribute(n);break}s=cl(""+s),a.setAttribute(n,s);break;case"onClick":s!=null&&(a.onclick=Dt);break;case"onScroll":s!=null&&Pe("scroll",a);break;case"onScrollEnd":s!=null&&Pe("scrollend",a);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(o(61));if(n=s.__html,n!=null){if(r.children!=null)throw Error(o(60));a.innerHTML=n}}break;case"multiple":a.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":a.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){a.removeAttribute("xlink:href");break}n=cl(""+s),a.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?a.setAttribute(n,""+s):a.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?a.setAttribute(n,""):a.removeAttribute(n);break;case"capture":case"download":s===!0?a.setAttribute(n,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?a.setAttribute(n,s):a.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?a.setAttribute(n,s):a.removeAttribute(n);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?a.removeAttribute(n):a.setAttribute(n,s);break;case"popover":Pe("beforetoggle",a),Pe("toggle",a),il(a,"popover",s);break;case"xlinkActuate":Rt(a,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":Rt(a,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":Rt(a,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":Rt(a,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":Rt(a,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":Rt(a,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":Rt(a,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":Rt(a,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":Rt(a,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":il(a,"is",s);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Cg.get(n)||n,il(a,n,s))}}function Mo(a,t,n,s,r,c){switch(n){case"style":Qd(a,s,c);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(o(61));if(n=s.__html,n!=null){if(r.children!=null)throw Error(o(60));a.innerHTML=n}}break;case"children":typeof s=="string"?is(a,s):(typeof s=="number"||typeof s=="bigint")&&is(a,""+s);break;case"onScroll":s!=null&&Pe("scroll",a);break;case"onScrollEnd":s!=null&&Pe("scrollend",a);break;case"onClick":s!=null&&(a.onclick=Dt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Id.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(r=n.endsWith("Capture"),t=n.slice(2,r?n.length-7:void 0),c=a[Pa]||null,c=c!=null?c[n]:null,typeof c=="function"&&a.removeEventListener(t,c,r),typeof s=="function")){typeof c!="function"&&c!==null&&(n in a?a[n]=null:a.hasAttribute(n)&&a.removeAttribute(n)),a.addEventListener(t,s,r);break e}n in a?a[n]=s:s===!0?a.setAttribute(n,""):il(a,n,s)}}}function Ea(a,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Pe("error",a),Pe("load",a);var s=!1,r=!1,c;for(c in n)if(n.hasOwnProperty(c)){var m=n[c];if(m!=null)switch(c){case"src":s=!0;break;case"srcSet":r=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,t));default:aa(a,t,c,m,n,null)}}r&&aa(a,t,"srcSet",n.srcSet,n,null),s&&aa(a,t,"src",n.src,n,null);return;case"input":Pe("invalid",a);var g=c=m=r=null,T=null,G=null;for(s in n)if(n.hasOwnProperty(s)){var Q=n[s];if(Q!=null)switch(s){case"name":r=Q;break;case"type":m=Q;break;case"checked":T=Q;break;case"defaultChecked":G=Q;break;case"value":c=Q;break;case"defaultValue":g=Q;break;case"children":case"dangerouslySetInnerHTML":if(Q!=null)throw Error(o(137,t));break;default:aa(a,t,s,Q,n,null)}}Yd(a,c,g,T,G,m,r,!1);return;case"select":Pe("invalid",a),s=m=c=null;for(r in n)if(n.hasOwnProperty(r)&&(g=n[r],g!=null))switch(r){case"value":c=g;break;case"defaultValue":m=g;break;case"multiple":s=g;default:aa(a,t,r,g,n,null)}t=c,n=m,a.multiple=!!s,t!=null?ss(a,!!s,t,!1):n!=null&&ss(a,!!s,n,!0);return;case"textarea":Pe("invalid",a),c=r=s=null;for(m in n)if(n.hasOwnProperty(m)&&(g=n[m],g!=null))switch(m){case"value":s=g;break;case"defaultValue":r=g;break;case"children":c=g;break;case"dangerouslySetInnerHTML":if(g!=null)throw Error(o(91));break;default:aa(a,t,m,g,n,null)}Jd(a,s,r,c);return;case"option":for(T in n)if(n.hasOwnProperty(T)&&(s=n[T],s!=null))switch(T){case"selected":a.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:aa(a,t,T,s,n,null)}return;case"dialog":Pe("beforetoggle",a),Pe("toggle",a),Pe("cancel",a),Pe("close",a);break;case"iframe":case"object":Pe("load",a);break;case"video":case"audio":for(s=0;s<Di.length;s++)Pe(Di[s],a);break;case"image":Pe("error",a),Pe("load",a);break;case"details":Pe("toggle",a);break;case"embed":case"source":case"link":Pe("error",a),Pe("load",a);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(G in n)if(n.hasOwnProperty(G)&&(s=n[G],s!=null))switch(G){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,t));default:aa(a,t,G,s,n,null)}return;default:if(qr(t)){for(Q in n)n.hasOwnProperty(Q)&&(s=n[Q],s!==void 0&&Mo(a,t,Q,s,n,void 0));return}}for(g in n)n.hasOwnProperty(g)&&(s=n[g],s!=null&&aa(a,t,g,s,n,null))}function nb(a,t,n,s){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var r=null,c=null,m=null,g=null,T=null,G=null,Q=null;for(J in n){var ae=n[J];if(n.hasOwnProperty(J)&&ae!=null)switch(J){case"checked":break;case"value":break;case"defaultValue":T=ae;default:s.hasOwnProperty(J)||aa(a,t,J,null,s,ae)}}for(var $ in s){var J=s[$];if(ae=n[$],s.hasOwnProperty($)&&(J!=null||ae!=null))switch($){case"type":c=J;break;case"name":r=J;break;case"checked":G=J;break;case"defaultChecked":Q=J;break;case"value":m=J;break;case"defaultValue":g=J;break;case"children":case"dangerouslySetInnerHTML":if(J!=null)throw Error(o(137,t));break;default:J!==ae&&aa(a,t,$,J,s,ae)}}Ir(a,m,g,T,G,Q,c,r);return;case"select":J=m=g=$=null;for(c in n)if(T=n[c],n.hasOwnProperty(c)&&T!=null)switch(c){case"value":break;case"multiple":J=T;default:s.hasOwnProperty(c)||aa(a,t,c,null,s,T)}for(r in s)if(c=s[r],T=n[r],s.hasOwnProperty(r)&&(c!=null||T!=null))switch(r){case"value":$=c;break;case"defaultValue":g=c;break;case"multiple":m=c;default:c!==T&&aa(a,t,r,c,s,T)}t=g,n=m,s=J,$!=null?ss(a,!!n,$,!1):!!s!=!!n&&(t!=null?ss(a,!!n,t,!0):ss(a,!!n,n?[]:"",!1));return;case"textarea":J=$=null;for(g in n)if(r=n[g],n.hasOwnProperty(g)&&r!=null&&!s.hasOwnProperty(g))switch(g){case"value":break;case"children":break;default:aa(a,t,g,null,s,r)}for(m in s)if(r=s[m],c=n[m],s.hasOwnProperty(m)&&(r!=null||c!=null))switch(m){case"value":$=r;break;case"defaultValue":J=r;break;case"children":break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(o(91));break;default:r!==c&&aa(a,t,m,r,s,c)}Vd(a,$,J);return;case"option":for(var xe in n)if($=n[xe],n.hasOwnProperty(xe)&&$!=null&&!s.hasOwnProperty(xe))switch(xe){case"selected":a.selected=!1;break;default:aa(a,t,xe,null,s,$)}for(T in s)if($=s[T],J=n[T],s.hasOwnProperty(T)&&$!==J&&($!=null||J!=null))switch(T){case"selected":a.selected=$&&typeof $!="function"&&typeof $!="symbol";break;default:aa(a,t,T,$,s,J)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var _e in n)$=n[_e],n.hasOwnProperty(_e)&&$!=null&&!s.hasOwnProperty(_e)&&aa(a,t,_e,null,s,$);for(G in s)if($=s[G],J=n[G],s.hasOwnProperty(G)&&$!==J&&($!=null||J!=null))switch(G){case"children":case"dangerouslySetInnerHTML":if($!=null)throw Error(o(137,t));break;default:aa(a,t,G,$,s,J)}return;default:if(qr(t)){for(var ta in n)$=n[ta],n.hasOwnProperty(ta)&&$!==void 0&&!s.hasOwnProperty(ta)&&Mo(a,t,ta,void 0,s,$);for(Q in s)$=s[Q],J=n[Q],!s.hasOwnProperty(Q)||$===J||$===void 0&&J===void 0||Mo(a,t,Q,$,s,J);return}}for(var z in n)$=n[z],n.hasOwnProperty(z)&&$!=null&&!s.hasOwnProperty(z)&&aa(a,t,z,null,s,$);for(ae in s)$=s[ae],J=n[ae],!s.hasOwnProperty(ae)||$===J||$==null&&J==null||aa(a,t,ae,$,s,J)}function Zh(a){switch(a){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function sb(){if(typeof performance.getEntriesByType=="function"){for(var a=0,t=0,n=performance.getEntriesByType("resource"),s=0;s<n.length;s++){var r=n[s],c=r.transferSize,m=r.initiatorType,g=r.duration;if(c&&g&&Zh(m)){for(m=0,g=r.responseEnd,s+=1;s<n.length;s++){var T=n[s],G=T.startTime;if(G>g)break;var Q=T.transferSize,ae=T.initiatorType;Q&&Zh(ae)&&(T=T.responseEnd,m+=Q*(T<g?1:(g-G)/(T-G)))}if(--s,t+=8*(c+m)/(r.duration/1e3),a++,10<a)break}}if(0<a)return t/a/1e6}return navigator.connection&&(a=navigator.connection.downlink,typeof a=="number")?a:5}var Ro=null,Do=null;function nr(a){return a.nodeType===9?a:a.ownerDocument}function Wh(a){switch(a){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function ep(a,t){if(a===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return a===1&&t==="foreignObject"?0:a}function Oo(a,t){return a==="textarea"||a==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Lo=null;function ib(){var a=window.event;return a&&a.type==="popstate"?a===Lo?!1:(Lo=a,!0):(Lo=null,!1)}var ap=typeof setTimeout=="function"?setTimeout:void 0,lb=typeof clearTimeout=="function"?clearTimeout:void 0,tp=typeof Promise=="function"?Promise:void 0,rb=typeof queueMicrotask=="function"?queueMicrotask:typeof tp<"u"?function(a){return tp.resolve(null).then(a).catch(cb)}:ap;function cb(a){setTimeout(function(){throw a})}function yn(a){return a==="head"}function np(a,t){var n=t,s=0;do{var r=n.nextSibling;if(a.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"||n==="/&"){if(s===0){a.removeChild(r),Ps(t);return}s--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")s++;else if(n==="html")Li(a.ownerDocument.documentElement);else if(n==="head"){n=a.ownerDocument.head,Li(n);for(var c=n.firstChild;c;){var m=c.nextSibling,g=c.nodeName;c[Ws]||g==="SCRIPT"||g==="STYLE"||g==="LINK"&&c.rel.toLowerCase()==="stylesheet"||n.removeChild(c),c=m}}else n==="body"&&Li(a.ownerDocument.body);n=r}while(n);Ps(t)}function sp(a,t){var n=a;a=0;do{var s=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(a===0)break;a--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||a++;n=s}while(n)}function Po(a){var t=a.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Po(n),Fr(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}a.removeChild(n)}}function ob(a,t,n,s){for(;a.nodeType===1;){var r=n;if(a.nodeName.toLowerCase()!==t.toLowerCase()){if(!s&&(a.nodeName!=="INPUT"||a.type!=="hidden"))break}else if(s){if(!a[Ws])switch(t){case"meta":if(!a.hasAttribute("itemprop"))break;return a;case"link":if(c=a.getAttribute("rel"),c==="stylesheet"&&a.hasAttribute("data-precedence"))break;if(c!==r.rel||a.getAttribute("href")!==(r.href==null||r.href===""?null:r.href)||a.getAttribute("crossorigin")!==(r.crossOrigin==null?null:r.crossOrigin)||a.getAttribute("title")!==(r.title==null?null:r.title))break;return a;case"style":if(a.hasAttribute("data-precedence"))break;return a;case"script":if(c=a.getAttribute("src"),(c!==(r.src==null?null:r.src)||a.getAttribute("type")!==(r.type==null?null:r.type)||a.getAttribute("crossorigin")!==(r.crossOrigin==null?null:r.crossOrigin))&&c&&a.hasAttribute("async")&&!a.hasAttribute("itemprop"))break;return a;default:return a}}else if(t==="input"&&a.type==="hidden"){var c=r.name==null?null:""+r.name;if(r.type==="hidden"&&a.getAttribute("name")===c)return a}else return a;if(a=ot(a.nextSibling),a===null)break}return null}function db(a,t,n){if(t==="")return null;for(;a.nodeType!==3;)if((a.nodeType!==1||a.nodeName!=="INPUT"||a.type!=="hidden")&&!n||(a=ot(a.nextSibling),a===null))return null;return a}function ip(a,t){for(;a.nodeType!==8;)if((a.nodeType!==1||a.nodeName!=="INPUT"||a.type!=="hidden")&&!t||(a=ot(a.nextSibling),a===null))return null;return a}function Uo(a){return a.data==="$?"||a.data==="$~"}function zo(a){return a.data==="$!"||a.data==="$?"&&a.ownerDocument.readyState!=="loading"}function ub(a,t){var n=a.ownerDocument;if(a.data==="$~")a._reactRetry=t;else if(a.data!=="$?"||n.readyState!=="loading")t();else{var s=function(){t(),n.removeEventListener("DOMContentLoaded",s)};n.addEventListener("DOMContentLoaded",s),a._reactRetry=s}}function ot(a){for(;a!=null;a=a.nextSibling){var t=a.nodeType;if(t===1||t===3)break;if(t===8){if(t=a.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return a}var Bo=null;function lp(a){a=a.nextSibling;for(var t=0;a;){if(a.nodeType===8){var n=a.data;if(n==="/$"||n==="/&"){if(t===0)return ot(a.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}a=a.nextSibling}return null}function rp(a){a=a.previousSibling;for(var t=0;a;){if(a.nodeType===8){var n=a.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return a;t--}else n!=="/$"&&n!=="/&"||t++}a=a.previousSibling}return null}function cp(a,t,n){switch(t=nr(n),a){case"html":if(a=t.documentElement,!a)throw Error(o(452));return a;case"head":if(a=t.head,!a)throw Error(o(453));return a;case"body":if(a=t.body,!a)throw Error(o(454));return a;default:throw Error(o(451))}}function Li(a){for(var t=a.attributes;t.length;)a.removeAttributeNode(t[0]);Fr(a)}var dt=new Map,op=new Set;function sr(a){return typeof a.getRootNode=="function"?a.getRootNode():a.nodeType===9?a:a.ownerDocument}var Jt=ie.d;ie.d={f:mb,r:hb,D:pb,C:fb,L:gb,m:xb,X:jb,S:bb,M:vb};function mb(){var a=Jt.f(),t=Jl();return a||t}function hb(a){var t=as(a);t!==null&&t.tag===5&&t.type==="form"?wm(t):Jt.r(a)}var Ds=typeof document>"u"?null:document;function dp(a,t,n){var s=Ds;if(s&&typeof t=="string"&&t){var r=tt(t);r='link[rel="'+a+'"][href="'+r+'"]',typeof n=="string"&&(r+='[crossorigin="'+n+'"]'),op.has(r)||(op.add(r),a={rel:a,crossOrigin:n,href:t},s.querySelector(r)===null&&(t=s.createElement("link"),Ea(t,"link",a),Na(t),s.head.appendChild(t)))}}function pb(a){Jt.D(a),dp("dns-prefetch",a,null)}function fb(a,t){Jt.C(a,t),dp("preconnect",a,t)}function gb(a,t,n){Jt.L(a,t,n);var s=Ds;if(s&&a&&t){var r='link[rel="preload"][as="'+tt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(r+='[imagesrcset="'+tt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(r+='[imagesizes="'+tt(n.imageSizes)+'"]')):r+='[href="'+tt(a)+'"]';var c=r;switch(t){case"style":c=Os(a);break;case"script":c=Ls(a)}dt.has(c)||(a=v({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:a,as:t},n),dt.set(c,a),s.querySelector(r)!==null||t==="style"&&s.querySelector(Pi(c))||t==="script"&&s.querySelector(Ui(c))||(t=s.createElement("link"),Ea(t,"link",a),Na(t),s.head.appendChild(t)))}}function xb(a,t){Jt.m(a,t);var n=Ds;if(n&&a){var s=t&&typeof t.as=="string"?t.as:"script",r='link[rel="modulepreload"][as="'+tt(s)+'"][href="'+tt(a)+'"]',c=r;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":c=Ls(a)}if(!dt.has(c)&&(a=v({rel:"modulepreload",href:a},t),dt.set(c,a),n.querySelector(r)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Ui(c)))return}s=n.createElement("link"),Ea(s,"link",a),Na(s),n.head.appendChild(s)}}}function bb(a,t,n){Jt.S(a,t,n);var s=Ds;if(s&&a){var r=ts(s).hoistableStyles,c=Os(a);t=t||"default";var m=r.get(c);if(!m){var g={loading:0,preload:null};if(m=s.querySelector(Pi(c)))g.loading=5;else{a=v({rel:"stylesheet",href:a,"data-precedence":t},n),(n=dt.get(c))&&Fo(a,n);var T=m=s.createElement("link");Na(T),Ea(T,"link",a),T._p=new Promise(function(G,Q){T.onload=G,T.onerror=Q}),T.addEventListener("load",function(){g.loading|=1}),T.addEventListener("error",function(){g.loading|=2}),g.loading|=4,ir(m,t,s)}m={type:"stylesheet",instance:m,count:1,state:g},r.set(c,m)}}}function jb(a,t){Jt.X(a,t);var n=Ds;if(n&&a){var s=ts(n).hoistableScripts,r=Ls(a),c=s.get(r);c||(c=n.querySelector(Ui(r)),c||(a=v({src:a,async:!0},t),(t=dt.get(r))&&Ho(a,t),c=n.createElement("script"),Na(c),Ea(c,"link",a),n.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},s.set(r,c))}}function vb(a,t){Jt.M(a,t);var n=Ds;if(n&&a){var s=ts(n).hoistableScripts,r=Ls(a),c=s.get(r);c||(c=n.querySelector(Ui(r)),c||(a=v({src:a,async:!0,type:"module"},t),(t=dt.get(r))&&Ho(a,t),c=n.createElement("script"),Na(c),Ea(c,"link",a),n.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},s.set(r,c))}}function up(a,t,n,s){var r=(r=pe.current)?sr(r):null;if(!r)throw Error(o(446));switch(a){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Os(n.href),n=ts(r).hoistableStyles,s=n.get(t),s||(s={type:"style",instance:null,count:0,state:null},n.set(t,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){a=Os(n.href);var c=ts(r).hoistableStyles,m=c.get(a);if(m||(r=r.ownerDocument||r,m={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},c.set(a,m),(c=r.querySelector(Pi(a)))&&!c._p&&(m.instance=c,m.state.loading=5),dt.has(a)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},dt.set(a,n),c||yb(r,a,n,m.state))),t&&s===null)throw Error(o(528,""));return m}if(t&&s!==null)throw Error(o(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Ls(n),n=ts(r).hoistableScripts,s=n.get(t),s||(s={type:"script",instance:null,count:0,state:null},n.set(t,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,a))}}function Os(a){return'href="'+tt(a)+'"'}function Pi(a){return'link[rel="stylesheet"]['+a+"]"}function mp(a){return v({},a,{"data-precedence":a.precedence,precedence:null})}function yb(a,t,n,s){a.querySelector('link[rel="preload"][as="style"]['+t+"]")?s.loading=1:(t=a.createElement("link"),s.preload=t,t.addEventListener("load",function(){return s.loading|=1}),t.addEventListener("error",function(){return s.loading|=2}),Ea(t,"link",n),Na(t),a.head.appendChild(t))}function Ls(a){return'[src="'+tt(a)+'"]'}function Ui(a){return"script[async]"+a}function hp(a,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var s=a.querySelector('style[data-href~="'+tt(n.href)+'"]');if(s)return t.instance=s,Na(s),s;var r=v({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return s=(a.ownerDocument||a).createElement("style"),Na(s),Ea(s,"style",r),ir(s,n.precedence,a),t.instance=s;case"stylesheet":r=Os(n.href);var c=a.querySelector(Pi(r));if(c)return t.state.loading|=4,t.instance=c,Na(c),c;s=mp(n),(r=dt.get(r))&&Fo(s,r),c=(a.ownerDocument||a).createElement("link"),Na(c);var m=c;return m._p=new Promise(function(g,T){m.onload=g,m.onerror=T}),Ea(c,"link",s),t.state.loading|=4,ir(c,n.precedence,a),t.instance=c;case"script":return c=Ls(n.src),(r=a.querySelector(Ui(c)))?(t.instance=r,Na(r),r):(s=n,(r=dt.get(c))&&(s=v({},n),Ho(s,r)),a=a.ownerDocument||a,r=a.createElement("script"),Na(r),Ea(r,"link",s),a.head.appendChild(r),t.instance=r);case"void":return null;default:throw Error(o(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(s=t.instance,t.state.loading|=4,ir(s,n.precedence,a));return t.instance}function ir(a,t,n){for(var s=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),r=s.length?s[s.length-1]:null,c=r,m=0;m<s.length;m++){var g=s[m];if(g.dataset.precedence===t)c=g;else if(c!==r)break}c?c.parentNode.insertBefore(a,c.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(a,t.firstChild))}function Fo(a,t){a.crossOrigin==null&&(a.crossOrigin=t.crossOrigin),a.referrerPolicy==null&&(a.referrerPolicy=t.referrerPolicy),a.title==null&&(a.title=t.title)}function Ho(a,t){a.crossOrigin==null&&(a.crossOrigin=t.crossOrigin),a.referrerPolicy==null&&(a.referrerPolicy=t.referrerPolicy),a.integrity==null&&(a.integrity=t.integrity)}var lr=null;function pp(a,t,n){if(lr===null){var s=new Map,r=lr=new Map;r.set(n,s)}else r=lr,s=r.get(n),s||(s=new Map,r.set(n,s));if(s.has(a))return s;for(s.set(a,null),n=n.getElementsByTagName(a),r=0;r<n.length;r++){var c=n[r];if(!(c[Ws]||c[Sa]||a==="link"&&c.getAttribute("rel")==="stylesheet")&&c.namespaceURI!=="http://www.w3.org/2000/svg"){var m=c.getAttribute(t)||"";m=a+m;var g=s.get(m);g?g.push(c):s.set(m,[c])}}return s}function fp(a,t,n){a=a.ownerDocument||a,a.head.insertBefore(n,t==="title"?a.querySelector("head > title"):null)}function Nb(a,t,n){if(n===1||t.itemProp!=null)return!1;switch(a){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return a=t.disabled,typeof t.precedence=="string"&&a==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function gp(a){return!(a.type==="stylesheet"&&(a.state.loading&3)===0)}function kb(a,t,n,s){if(n.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var r=Os(s.href),c=t.querySelector(Pi(r));if(c){t=c._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(a.count++,a=rr.bind(a),t.then(a,a)),n.state.loading|=4,n.instance=c,Na(c);return}c=t.ownerDocument||t,s=mp(s),(r=dt.get(r))&&Fo(s,r),c=c.createElement("link"),Na(c);var m=c;m._p=new Promise(function(g,T){m.onload=g,m.onerror=T}),Ea(c,"link",s),n.instance=c}a.stylesheets===null&&(a.stylesheets=new Map),a.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(a.count++,n=rr.bind(a),t.addEventListener("load",n),t.addEventListener("error",n))}}var Io=0;function _b(a,t){return a.stylesheets&&a.count===0&&or(a,a.stylesheets),0<a.count||0<a.imgCount?function(n){var s=setTimeout(function(){if(a.stylesheets&&or(a,a.stylesheets),a.unsuspend){var c=a.unsuspend;a.unsuspend=null,c()}},6e4+t);0<a.imgBytes&&Io===0&&(Io=62500*sb());var r=setTimeout(function(){if(a.waitingForImages=!1,a.count===0&&(a.stylesheets&&or(a,a.stylesheets),a.unsuspend)){var c=a.unsuspend;a.unsuspend=null,c()}},(a.imgBytes>Io?50:800)+t);return a.unsuspend=n,function(){a.unsuspend=null,clearTimeout(s),clearTimeout(r)}}:null}function rr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)or(this,this.stylesheets);else if(this.unsuspend){var a=this.unsuspend;this.unsuspend=null,a()}}}var cr=null;function or(a,t){a.stylesheets=null,a.unsuspend!==null&&(a.count++,cr=new Map,t.forEach(Sb,a),cr=null,rr.call(a))}function Sb(a,t){if(!(t.state.loading&4)){var n=cr.get(a);if(n)var s=n.get(null);else{n=new Map,cr.set(a,n);for(var r=a.querySelectorAll("link[data-precedence],style[data-precedence]"),c=0;c<r.length;c++){var m=r[c];(m.nodeName==="LINK"||m.getAttribute("media")!=="not all")&&(n.set(m.dataset.precedence,m),s=m)}s&&n.set(null,s)}r=t.instance,m=r.getAttribute("data-precedence"),c=n.get(m)||s,c===s&&n.set(null,r),n.set(m,r),this.count++,s=rr.bind(this),r.addEventListener("load",s),r.addEventListener("error",s),c?c.parentNode.insertBefore(r,c.nextSibling):(a=a.nodeType===9?a.head:a,a.insertBefore(r,a.firstChild)),t.state.loading|=4}}var zi={$$typeof:L,Provider:null,Consumer:null,_currentValue:I,_currentValue2:I,_threadCount:0};function wb(a,t,n,s,r,c,m,g,T){this.tag=1,this.containerInfo=a,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=F(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=F(0),this.hiddenUpdates=F(null),this.identifierPrefix=s,this.onUncaughtError=r,this.onCaughtError=c,this.onRecoverableError=m,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=T,this.incompleteTransitions=new Map}function xp(a,t,n,s,r,c,m,g,T,G,Q,ae){return a=new wb(a,t,n,m,T,G,Q,ae,g),t=1,c===!0&&(t|=24),c=Ya(3,null,null,t),a.current=c,c.stateNode=a,t=vc(),t.refCount++,a.pooledCache=t,t.refCount++,c.memoizedState={element:s,isDehydrated:n,cache:t},_c(c),a}function bp(a){return a?(a=ms,a):ms}function jp(a,t,n,s,r,c){r=bp(r),s.context===null?s.context=r:s.pendingContext=r,s=dn(t),s.payload={element:n},c=c===void 0?null:c,c!==null&&(s.callback=c),n=un(a,s,t),n!==null&&(Ia(n,a,t),gi(n,a,t))}function vp(a,t){if(a=a.memoizedState,a!==null&&a.dehydrated!==null){var n=a.retryLane;a.retryLane=n!==0&&n<t?n:t}}function Ko(a,t){vp(a,t),(a=a.alternate)&&vp(a,t)}function yp(a){if(a.tag===13||a.tag===31){var t=On(a,67108864);t!==null&&Ia(t,a,67108864),Ko(a,67108864)}}function Np(a){if(a.tag===13||a.tag===31){var t=Za();t=La(t);var n=On(a,t);n!==null&&Ia(n,a,t),Ko(a,t)}}var dr=!0;function Ab(a,t,n,s){var r=U.T;U.T=null;var c=ie.p;try{ie.p=2,qo(a,t,n,s)}finally{ie.p=c,U.T=r}}function Tb(a,t,n,s){var r=U.T;U.T=null;var c=ie.p;try{ie.p=8,qo(a,t,n,s)}finally{ie.p=c,U.T=r}}function qo(a,t,n,s){if(dr){var r=Go(s);if(r===null)Co(a,t,s,ur,n),_p(a,s);else if(Cb(r,a,t,n,s))s.stopPropagation();else if(_p(a,s),t&4&&-1<Eb.indexOf(a)){for(;r!==null;){var c=as(r);if(c!==null)switch(c.tag){case 3:if(c=c.stateNode,c.current.memoizedState.isDehydrated){var m=Mt(c.pendingLanes);if(m!==0){var g=c;for(g.pendingLanes|=2,g.entangledLanes|=2;m;){var T=1<<31-ya(m);g.entanglements[1]|=T,m&=~T}_t(c),(Xe&6)===0&&(Yl=pa()+500,Ri(0))}}break;case 31:case 13:g=On(c,2),g!==null&&Ia(g,c,2),Jl(),Ko(c,2)}if(c=Go(s),c===null&&Co(a,t,s,ur,n),c===r)break;r=c}r!==null&&s.stopPropagation()}else Co(a,t,s,null,n)}}function Go(a){return a=$r(a),$o(a)}var ur=null;function $o(a){if(ur=null,a=es(a),a!==null){var t=h(a);if(t===null)a=null;else{var n=t.tag;if(n===13){if(a=p(t),a!==null)return a;a=null}else if(n===31){if(a=x(t),a!==null)return a;a=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;a=null}else t!==a&&(a=null)}}return ur=a,null}function kp(a){switch(a){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Vs()){case An:return 2;case Et:return 8;case vt:case Js:return 32;case ja:return 268435456;default:return 32}default:return 32}}var Yo=!1,Nn=null,kn=null,_n=null,Bi=new Map,Fi=new Map,Sn=[],Eb="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function _p(a,t){switch(a){case"focusin":case"focusout":Nn=null;break;case"dragenter":case"dragleave":kn=null;break;case"mouseover":case"mouseout":_n=null;break;case"pointerover":case"pointerout":Bi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Fi.delete(t.pointerId)}}function Hi(a,t,n,s,r,c){return a===null||a.nativeEvent!==c?(a={blockedOn:t,domEventName:n,eventSystemFlags:s,nativeEvent:c,targetContainers:[r]},t!==null&&(t=as(t),t!==null&&yp(t)),a):(a.eventSystemFlags|=s,t=a.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),a)}function Cb(a,t,n,s,r){switch(t){case"focusin":return Nn=Hi(Nn,a,t,n,s,r),!0;case"dragenter":return kn=Hi(kn,a,t,n,s,r),!0;case"mouseover":return _n=Hi(_n,a,t,n,s,r),!0;case"pointerover":var c=r.pointerId;return Bi.set(c,Hi(Bi.get(c)||null,a,t,n,s,r)),!0;case"gotpointercapture":return c=r.pointerId,Fi.set(c,Hi(Fi.get(c)||null,a,t,n,s,r)),!0}return!1}function Sp(a){var t=es(a.target);if(t!==null){var n=h(t);if(n!==null){if(t=n.tag,t===13){if(t=p(n),t!==null){a.blockedOn=t,Bd(a.priority,function(){Np(n)});return}}else if(t===31){if(t=x(n),t!==null){a.blockedOn=t,Bd(a.priority,function(){Np(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){a.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}a.blockedOn=null}function mr(a){if(a.blockedOn!==null)return!1;for(var t=a.targetContainers;0<t.length;){var n=Go(a.nativeEvent);if(n===null){n=a.nativeEvent;var s=new n.constructor(n.type,n);Gr=s,n.target.dispatchEvent(s),Gr=null}else return t=as(n),t!==null&&yp(t),a.blockedOn=n,!1;t.shift()}return!0}function wp(a,t,n){mr(a)&&n.delete(t)}function Mb(){Yo=!1,Nn!==null&&mr(Nn)&&(Nn=null),kn!==null&&mr(kn)&&(kn=null),_n!==null&&mr(_n)&&(_n=null),Bi.forEach(wp),Fi.forEach(wp)}function hr(a,t){a.blockedOn===t&&(a.blockedOn=null,Yo||(Yo=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,Mb)))}var pr=null;function Ap(a){pr!==a&&(pr=a,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){pr===a&&(pr=null);for(var t=0;t<a.length;t+=3){var n=a[t],s=a[t+1],r=a[t+2];if(typeof s!="function"){if($o(s||n)===null)continue;break}var c=as(n);c!==null&&(a.splice(t,3),t-=3,qc(c,{pending:!0,data:r,method:n.method,action:s},s,r))}}))}function Ps(a){function t(T){return hr(T,a)}Nn!==null&&hr(Nn,a),kn!==null&&hr(kn,a),_n!==null&&hr(_n,a),Bi.forEach(t),Fi.forEach(t);for(var n=0;n<Sn.length;n++){var s=Sn[n];s.blockedOn===a&&(s.blockedOn=null)}for(;0<Sn.length&&(n=Sn[0],n.blockedOn===null);)Sp(n),n.blockedOn===null&&Sn.shift();if(n=(a.ownerDocument||a).$$reactFormReplay,n!=null)for(s=0;s<n.length;s+=3){var r=n[s],c=n[s+1],m=r[Pa]||null;if(typeof c=="function")m||Ap(n);else if(m){var g=null;if(c&&c.hasAttribute("formAction")){if(r=c,m=c[Pa]||null)g=m.formAction;else if($o(r)!==null)continue}else g=m.action;typeof g=="function"?n[s+1]=g:(n.splice(s,3),s-=3),Ap(n)}}}function Tp(){function a(c){c.canIntercept&&c.info==="react-transition"&&c.intercept({handler:function(){return new Promise(function(m){return r=m})},focusReset:"manual",scroll:"manual"})}function t(){r!==null&&(r(),r=null),s||setTimeout(n,20)}function n(){if(!s&&!navigation.transition){var c=navigation.currentEntry;c&&c.url!=null&&navigation.navigate(c.url,{state:c.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,r=null;return navigation.addEventListener("navigate",a),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){s=!0,navigation.removeEventListener("navigate",a),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),r!==null&&(r(),r=null)}}}function Vo(a){this._internalRoot=a}fr.prototype.render=Vo.prototype.render=function(a){var t=this._internalRoot;if(t===null)throw Error(o(409));var n=t.current,s=Za();jp(n,s,a,t,null,null)},fr.prototype.unmount=Vo.prototype.unmount=function(){var a=this._internalRoot;if(a!==null){this._internalRoot=null;var t=a.containerInfo;jp(a.current,2,null,a,null,null),Jl(),t[Wn]=null}};function fr(a){this._internalRoot=a}fr.prototype.unstable_scheduleHydration=function(a){if(a){var t=zd();a={blockedOn:null,target:a,priority:t};for(var n=0;n<Sn.length&&t!==0&&t<Sn[n].priority;n++);Sn.splice(n,0,a),n===0&&Sp(a)}};var Ep=l.version;if(Ep!=="19.2.0")throw Error(o(527,Ep,"19.2.0"));ie.findDOMNode=function(a){var t=a._reactInternals;if(t===void 0)throw typeof a.render=="function"?Error(o(188)):(a=Object.keys(a).join(","),Error(o(268,a)));return a=f(t),a=a!==null?b(a):null,a=a===null?null:a.stateNode,a};var Rb={bundleType:0,version:"19.2.0",rendererPackageName:"react-dom",currentDispatcherRef:U,reconcilerVersion:"19.2.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gr.isDisabled&&gr.supportsFiber)try{le=gr.inject(Rb),me=gr}catch{}}return Ki.createRoot=function(a,t){if(!u(a))throw Error(o(299));var n=!1,s="",r=Pm,c=Um,m=zm;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onUncaughtError!==void 0&&(r=t.onUncaughtError),t.onCaughtError!==void 0&&(c=t.onCaughtError),t.onRecoverableError!==void 0&&(m=t.onRecoverableError)),t=xp(a,1,!1,null,null,n,s,null,r,c,m,Tp),a[Wn]=t.current,Eo(a),new Vo(t)},Ki.hydrateRoot=function(a,t,n){if(!u(a))throw Error(o(299));var s=!1,r="",c=Pm,m=Um,g=zm,T=null;return n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(m=n.onCaughtError),n.onRecoverableError!==void 0&&(g=n.onRecoverableError),n.formState!==void 0&&(T=n.formState)),t=xp(a,1,!0,t,n??null,s,r,T,c,m,g,Tp),t.context=bp(null),n=t.current,s=Za(),s=La(s),r=dn(s),r.callback=null,un(n,r,s),n=s,t.current.lanes=n,ne(t,n),_t(t),a[Wn]=t.current,Eo(a),new fr(t)},Ki.version="19.2.0",Ki}var Bp;function Hb(){if(Bp)return Qo.exports;Bp=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(l){console.error(l)}}return i(),Qo.exports=Fb(),Qo.exports}var Ib=Hb();const Kb=Cf(Ib);function Rf(i,l){return function(){return i.apply(l,arguments)}}const{toString:qb}=Object.prototype,{getPrototypeOf:wd}=Object,{iterator:Rr,toStringTag:Df}=Symbol,Dr=(i=>l=>{const d=qb.call(l);return i[d]||(i[d]=d.slice(8,-1).toLowerCase())})(Object.create(null)),gt=i=>(i=i.toLowerCase(),l=>Dr(l)===i),Or=i=>l=>typeof l===i,{isArray:Is}=Array,Fs=Or("undefined");function Zi(i){return i!==null&&!Fs(i)&&i.constructor!==null&&!Fs(i.constructor)&&qa(i.constructor.isBuffer)&&i.constructor.isBuffer(i)}const Of=gt("ArrayBuffer");function Gb(i){let l;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?l=ArrayBuffer.isView(i):l=i&&i.buffer&&Of(i.buffer),l}const $b=Or("string"),qa=Or("function"),Lf=Or("number"),Wi=i=>i!==null&&typeof i=="object",Yb=i=>i===!0||i===!1,_r=i=>{if(Dr(i)!=="object")return!1;const l=wd(i);return(l===null||l===Object.prototype||Object.getPrototypeOf(l)===null)&&!(Df in i)&&!(Rr in i)},Vb=i=>{if(!Wi(i)||Zi(i))return!1;try{return Object.keys(i).length===0&&Object.getPrototypeOf(i)===Object.prototype}catch{return!1}},Jb=gt("Date"),Xb=gt("File"),Qb=gt("Blob"),Zb=gt("FileList"),Wb=i=>Wi(i)&&qa(i.pipe),ej=i=>{let l;return i&&(typeof FormData=="function"&&i instanceof FormData||qa(i.append)&&((l=Dr(i))==="formdata"||l==="object"&&qa(i.toString)&&i.toString()==="[object FormData]"))},aj=gt("URLSearchParams"),[tj,nj,sj,ij]=["ReadableStream","Request","Response","Headers"].map(gt),lj=i=>i.trim?i.trim():i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function el(i,l,{allOwnKeys:d=!1}={}){if(i===null||typeof i>"u")return;let o,u;if(typeof i!="object"&&(i=[i]),Is(i))for(o=0,u=i.length;o<u;o++)l.call(null,i[o],o,i);else{if(Zi(i))return;const h=d?Object.getOwnPropertyNames(i):Object.keys(i),p=h.length;let x;for(o=0;o<p;o++)x=h[o],l.call(null,i[x],x,i)}}function Pf(i,l){if(Zi(i))return null;l=l.toLowerCase();const d=Object.keys(i);let o=d.length,u;for(;o-- >0;)if(u=d[o],l===u.toLowerCase())return u;return null}const Vn=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,Uf=i=>!Fs(i)&&i!==Vn;function fd(){const{caseless:i,skipUndefined:l}=Uf(this)&&this||{},d={},o=(u,h)=>{const p=i&&Pf(d,h)||h;_r(d[p])&&_r(u)?d[p]=fd(d[p],u):_r(u)?d[p]=fd({},u):Is(u)?d[p]=u.slice():(!l||!Fs(u))&&(d[p]=u)};for(let u=0,h=arguments.length;u<h;u++)arguments[u]&&el(arguments[u],o);return d}const rj=(i,l,d,{allOwnKeys:o}={})=>(el(l,(u,h)=>{d&&qa(u)?i[h]=Rf(u,d):i[h]=u},{allOwnKeys:o}),i),cj=i=>(i.charCodeAt(0)===65279&&(i=i.slice(1)),i),oj=(i,l,d,o)=>{i.prototype=Object.create(l.prototype,o),i.prototype.constructor=i,Object.defineProperty(i,"super",{value:l.prototype}),d&&Object.assign(i.prototype,d)},dj=(i,l,d,o)=>{let u,h,p;const x={};if(l=l||{},i==null)return l;do{for(u=Object.getOwnPropertyNames(i),h=u.length;h-- >0;)p=u[h],(!o||o(p,i,l))&&!x[p]&&(l[p]=i[p],x[p]=!0);i=d!==!1&&wd(i)}while(i&&(!d||d(i,l))&&i!==Object.prototype);return l},uj=(i,l,d)=>{i=String(i),(d===void 0||d>i.length)&&(d=i.length),d-=l.length;const o=i.indexOf(l,d);return o!==-1&&o===d},mj=i=>{if(!i)return null;if(Is(i))return i;let l=i.length;if(!Lf(l))return null;const d=new Array(l);for(;l-- >0;)d[l]=i[l];return d},hj=(i=>l=>i&&l instanceof i)(typeof Uint8Array<"u"&&wd(Uint8Array)),pj=(i,l)=>{const o=(i&&i[Rr]).call(i);let u;for(;(u=o.next())&&!u.done;){const h=u.value;l.call(i,h[0],h[1])}},fj=(i,l)=>{let d;const o=[];for(;(d=i.exec(l))!==null;)o.push(d);return o},gj=gt("HTMLFormElement"),xj=i=>i.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(d,o,u){return o.toUpperCase()+u}),Fp=(({hasOwnProperty:i})=>(l,d)=>i.call(l,d))(Object.prototype),bj=gt("RegExp"),zf=(i,l)=>{const d=Object.getOwnPropertyDescriptors(i),o={};el(d,(u,h)=>{let p;(p=l(u,h,i))!==!1&&(o[h]=p||u)}),Object.defineProperties(i,o)},jj=i=>{zf(i,(l,d)=>{if(qa(i)&&["arguments","caller","callee"].indexOf(d)!==-1)return!1;const o=i[d];if(qa(o)){if(l.enumerable=!1,"writable"in l){l.writable=!1;return}l.set||(l.set=()=>{throw Error("Can not rewrite read-only method '"+d+"'")})}})},vj=(i,l)=>{const d={},o=u=>{u.forEach(h=>{d[h]=!0})};return Is(i)?o(i):o(String(i).split(l)),d},yj=()=>{},Nj=(i,l)=>i!=null&&Number.isFinite(i=+i)?i:l;function kj(i){return!!(i&&qa(i.append)&&i[Df]==="FormData"&&i[Rr])}const _j=i=>{const l=new Array(10),d=(o,u)=>{if(Wi(o)){if(l.indexOf(o)>=0)return;if(Zi(o))return o;if(!("toJSON"in o)){l[u]=o;const h=Is(o)?[]:{};return el(o,(p,x)=>{const y=d(p,u+1);!Fs(y)&&(h[x]=y)}),l[u]=void 0,h}}return o};return d(i,0)},Sj=gt("AsyncFunction"),wj=i=>i&&(Wi(i)||qa(i))&&qa(i.then)&&qa(i.catch),Bf=((i,l)=>i?setImmediate:l?((d,o)=>(Vn.addEventListener("message",({source:u,data:h})=>{u===Vn&&h===d&&o.length&&o.shift()()},!1),u=>{o.push(u),Vn.postMessage(d,"*")}))(`axios@${Math.random()}`,[]):d=>setTimeout(d))(typeof setImmediate=="function",qa(Vn.postMessage)),Aj=typeof queueMicrotask<"u"?queueMicrotask.bind(Vn):typeof process<"u"&&process.nextTick||Bf,Tj=i=>i!=null&&qa(i[Rr]),V={isArray:Is,isArrayBuffer:Of,isBuffer:Zi,isFormData:ej,isArrayBufferView:Gb,isString:$b,isNumber:Lf,isBoolean:Yb,isObject:Wi,isPlainObject:_r,isEmptyObject:Vb,isReadableStream:tj,isRequest:nj,isResponse:sj,isHeaders:ij,isUndefined:Fs,isDate:Jb,isFile:Xb,isBlob:Qb,isRegExp:bj,isFunction:qa,isStream:Wb,isURLSearchParams:aj,isTypedArray:hj,isFileList:Zb,forEach:el,merge:fd,extend:rj,trim:lj,stripBOM:cj,inherits:oj,toFlatObject:dj,kindOf:Dr,kindOfTest:gt,endsWith:uj,toArray:mj,forEachEntry:pj,matchAll:fj,isHTMLForm:gj,hasOwnProperty:Fp,hasOwnProp:Fp,reduceDescriptors:zf,freezeMethods:jj,toObjectSet:vj,toCamelCase:xj,noop:yj,toFiniteNumber:Nj,findKey:Pf,global:Vn,isContextDefined:Uf,isSpecCompliantForm:kj,toJSONObject:_j,isAsyncFn:Sj,isThenable:wj,setImmediate:Bf,asap:Aj,isIterable:Tj};function Re(i,l,d,o,u){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=i,this.name="AxiosError",l&&(this.code=l),d&&(this.config=d),o&&(this.request=o),u&&(this.response=u,this.status=u.status?u.status:null)}V.inherits(Re,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:V.toJSONObject(this.config),code:this.code,status:this.status}}});const Ff=Re.prototype,Hf={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(i=>{Hf[i]={value:i}});Object.defineProperties(Re,Hf);Object.defineProperty(Ff,"isAxiosError",{value:!0});Re.from=(i,l,d,o,u,h)=>{const p=Object.create(Ff);V.toFlatObject(i,p,function(b){return b!==Error.prototype},f=>f!=="isAxiosError");const x=i&&i.message?i.message:"Error",y=l==null&&i?i.code:l;return Re.call(p,x,y,d,o,u),i&&p.cause==null&&Object.defineProperty(p,"cause",{value:i,configurable:!0}),p.name=i&&i.name||"Error",h&&Object.assign(p,h),p};const Ej=null;function gd(i){return V.isPlainObject(i)||V.isArray(i)}function If(i){return V.endsWith(i,"[]")?i.slice(0,-2):i}function Hp(i,l,d){return i?i.concat(l).map(function(u,h){return u=If(u),!d&&h?"["+u+"]":u}).join(d?".":""):l}function Cj(i){return V.isArray(i)&&!i.some(gd)}const Mj=V.toFlatObject(V,{},null,function(l){return/^is[A-Z]/.test(l)});function Lr(i,l,d){if(!V.isObject(i))throw new TypeError("target must be an object");l=l||new FormData,d=V.toFlatObject(d,{metaTokens:!0,dots:!1,indexes:!1},!1,function(M,H){return!V.isUndefined(H[M])});const o=d.metaTokens,u=d.visitor||b,h=d.dots,p=d.indexes,y=(d.Blob||typeof Blob<"u"&&Blob)&&V.isSpecCompliantForm(l);if(!V.isFunction(u))throw new TypeError("visitor must be a function");function f(w){if(w===null)return"";if(V.isDate(w))return w.toISOString();if(V.isBoolean(w))return w.toString();if(!y&&V.isBlob(w))throw new Re("Blob is not supported. Use a Buffer instead.");return V.isArrayBuffer(w)||V.isTypedArray(w)?y&&typeof Blob=="function"?new Blob([w]):Buffer.from(w):w}function b(w,M,H){let _=w;if(w&&!H&&typeof w=="object"){if(V.endsWith(M,"{}"))M=o?M:M.slice(0,-2),w=JSON.stringify(w);else if(V.isArray(w)&&Cj(w)||(V.isFileList(w)||V.endsWith(M,"[]"))&&(_=V.toArray(w)))return M=If(M),_.forEach(function(L,q){!(V.isUndefined(L)||L===null)&&l.append(p===!0?Hp([M],q,h):p===null?M:M+"[]",f(L))}),!1}return gd(w)?!0:(l.append(Hp(H,M,h),f(w)),!1)}const v=[],A=Object.assign(Mj,{defaultVisitor:b,convertValue:f,isVisitable:gd});function P(w,M){if(!V.isUndefined(w)){if(v.indexOf(w)!==-1)throw Error("Circular reference detected in "+M.join("."));v.push(w),V.forEach(w,function(_,E){(!(V.isUndefined(_)||_===null)&&u.call(l,_,V.isString(E)?E.trim():E,M,A))===!0&&P(_,M?M.concat(E):[E])}),v.pop()}}if(!V.isObject(i))throw new TypeError("data must be an object");return P(i),l}function Ip(i){const l={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(i).replace(/[!'()~]|%20|%00/g,function(o){return l[o]})}function Ad(i,l){this._pairs=[],i&&Lr(i,this,l)}const Kf=Ad.prototype;Kf.append=function(l,d){this._pairs.push([l,d])};Kf.toString=function(l){const d=l?function(o){return l.call(this,o,Ip)}:Ip;return this._pairs.map(function(u){return d(u[0])+"="+d(u[1])},"").join("&")};function Rj(i){return encodeURIComponent(i).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function qf(i,l,d){if(!l)return i;const o=d&&d.encode||Rj;V.isFunction(d)&&(d={serialize:d});const u=d&&d.serialize;let h;if(u?h=u(l,d):h=V.isURLSearchParams(l)?l.toString():new Ad(l,d).toString(o),h){const p=i.indexOf("#");p!==-1&&(i=i.slice(0,p)),i+=(i.indexOf("?")===-1?"?":"&")+h}return i}class Kp{constructor(){this.handlers=[]}use(l,d,o){return this.handlers.push({fulfilled:l,rejected:d,synchronous:o?o.synchronous:!1,runWhen:o?o.runWhen:null}),this.handlers.length-1}eject(l){this.handlers[l]&&(this.handlers[l]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(l){V.forEach(this.handlers,function(o){o!==null&&l(o)})}}const Gf={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},Dj=typeof URLSearchParams<"u"?URLSearchParams:Ad,Oj=typeof FormData<"u"?FormData:null,Lj=typeof Blob<"u"?Blob:null,Pj={isBrowser:!0,classes:{URLSearchParams:Dj,FormData:Oj,Blob:Lj},protocols:["http","https","file","blob","url","data"]},Td=typeof window<"u"&&typeof document<"u",xd=typeof navigator=="object"&&navigator||void 0,Uj=Td&&(!xd||["ReactNative","NativeScript","NS"].indexOf(xd.product)<0),zj=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",Bj=Td&&window.location.href||"http://localhost",Fj=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Td,hasStandardBrowserEnv:Uj,hasStandardBrowserWebWorkerEnv:zj,navigator:xd,origin:Bj},Symbol.toStringTag,{value:"Module"})),Ma={...Fj,...Pj};function Hj(i,l){return Lr(i,new Ma.classes.URLSearchParams,{visitor:function(d,o,u,h){return Ma.isNode&&V.isBuffer(d)?(this.append(o,d.toString("base64")),!1):h.defaultVisitor.apply(this,arguments)},...l})}function Ij(i){return V.matchAll(/\w+|\[(\w*)]/g,i).map(l=>l[0]==="[]"?"":l[1]||l[0])}function Kj(i){const l={},d=Object.keys(i);let o;const u=d.length;let h;for(o=0;o<u;o++)h=d[o],l[h]=i[h];return l}function $f(i){function l(d,o,u,h){let p=d[h++];if(p==="__proto__")return!0;const x=Number.isFinite(+p),y=h>=d.length;return p=!p&&V.isArray(u)?u.length:p,y?(V.hasOwnProp(u,p)?u[p]=[u[p],o]:u[p]=o,!x):((!u[p]||!V.isObject(u[p]))&&(u[p]=[]),l(d,o,u[p],h)&&V.isArray(u[p])&&(u[p]=Kj(u[p])),!x)}if(V.isFormData(i)&&V.isFunction(i.entries)){const d={};return V.forEachEntry(i,(o,u)=>{l(Ij(o),u,d,0)}),d}return null}function qj(i,l,d){if(V.isString(i))try{return(l||JSON.parse)(i),V.trim(i)}catch(o){if(o.name!=="SyntaxError")throw o}return(d||JSON.stringify)(i)}const al={transitional:Gf,adapter:["xhr","http","fetch"],transformRequest:[function(l,d){const o=d.getContentType()||"",u=o.indexOf("application/json")>-1,h=V.isObject(l);if(h&&V.isHTMLForm(l)&&(l=new FormData(l)),V.isFormData(l))return u?JSON.stringify($f(l)):l;if(V.isArrayBuffer(l)||V.isBuffer(l)||V.isStream(l)||V.isFile(l)||V.isBlob(l)||V.isReadableStream(l))return l;if(V.isArrayBufferView(l))return l.buffer;if(V.isURLSearchParams(l))return d.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),l.toString();let x;if(h){if(o.indexOf("application/x-www-form-urlencoded")>-1)return Hj(l,this.formSerializer).toString();if((x=V.isFileList(l))||o.indexOf("multipart/form-data")>-1){const y=this.env&&this.env.FormData;return Lr(x?{"files[]":l}:l,y&&new y,this.formSerializer)}}return h||u?(d.setContentType("application/json",!1),qj(l)):l}],transformResponse:[function(l){const d=this.transitional||al.transitional,o=d&&d.forcedJSONParsing,u=this.responseType==="json";if(V.isResponse(l)||V.isReadableStream(l))return l;if(l&&V.isString(l)&&(o&&!this.responseType||u)){const p=!(d&&d.silentJSONParsing)&&u;try{return JSON.parse(l,this.parseReviver)}catch(x){if(p)throw x.name==="SyntaxError"?Re.from(x,Re.ERR_BAD_RESPONSE,this,null,this.response):x}}return l}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:Ma.classes.FormData,Blob:Ma.classes.Blob},validateStatus:function(l){return l>=200&&l<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};V.forEach(["delete","get","head","post","put","patch"],i=>{al.headers[i]={}});const Gj=V.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),$j=i=>{const l={};let d,o,u;return i&&i.split(`
`).forEach(function(p){u=p.indexOf(":"),d=p.substring(0,u).trim().toLowerCase(),o=p.substring(u+1).trim(),!(!d||l[d]&&Gj[d])&&(d==="set-cookie"?l[d]?l[d].push(o):l[d]=[o]:l[d]=l[d]?l[d]+", "+o:o)}),l},qp=Symbol("internals");function qi(i){return i&&String(i).trim().toLowerCase()}function Sr(i){return i===!1||i==null?i:V.isArray(i)?i.map(Sr):String(i)}function Yj(i){const l=Object.create(null),d=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let o;for(;o=d.exec(i);)l[o[1]]=o[2];return l}const Vj=i=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(i.trim());function ad(i,l,d,o,u){if(V.isFunction(o))return o.call(this,l,d);if(u&&(l=d),!!V.isString(l)){if(V.isString(o))return l.indexOf(o)!==-1;if(V.isRegExp(o))return o.test(l)}}function Jj(i){return i.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(l,d,o)=>d.toUpperCase()+o)}function Xj(i,l){const d=V.toCamelCase(" "+l);["get","set","has"].forEach(o=>{Object.defineProperty(i,o+d,{value:function(u,h,p){return this[o].call(this,l,u,h,p)},configurable:!0})})}let Ga=class{constructor(l){l&&this.set(l)}set(l,d,o){const u=this;function h(x,y,f){const b=qi(y);if(!b)throw new Error("header name must be a non-empty string");const v=V.findKey(u,b);(!v||u[v]===void 0||f===!0||f===void 0&&u[v]!==!1)&&(u[v||y]=Sr(x))}const p=(x,y)=>V.forEach(x,(f,b)=>h(f,b,y));if(V.isPlainObject(l)||l instanceof this.constructor)p(l,d);else if(V.isString(l)&&(l=l.trim())&&!Vj(l))p($j(l),d);else if(V.isObject(l)&&V.isIterable(l)){let x={},y,f;for(const b of l){if(!V.isArray(b))throw TypeError("Object iterator must return a key-value pair");x[f=b[0]]=(y=x[f])?V.isArray(y)?[...y,b[1]]:[y,b[1]]:b[1]}p(x,d)}else l!=null&&h(d,l,o);return this}get(l,d){if(l=qi(l),l){const o=V.findKey(this,l);if(o){const u=this[o];if(!d)return u;if(d===!0)return Yj(u);if(V.isFunction(d))return d.call(this,u,o);if(V.isRegExp(d))return d.exec(u);throw new TypeError("parser must be boolean|regexp|function")}}}has(l,d){if(l=qi(l),l){const o=V.findKey(this,l);return!!(o&&this[o]!==void 0&&(!d||ad(this,this[o],o,d)))}return!1}delete(l,d){const o=this;let u=!1;function h(p){if(p=qi(p),p){const x=V.findKey(o,p);x&&(!d||ad(o,o[x],x,d))&&(delete o[x],u=!0)}}return V.isArray(l)?l.forEach(h):h(l),u}clear(l){const d=Object.keys(this);let o=d.length,u=!1;for(;o--;){const h=d[o];(!l||ad(this,this[h],h,l,!0))&&(delete this[h],u=!0)}return u}normalize(l){const d=this,o={};return V.forEach(this,(u,h)=>{const p=V.findKey(o,h);if(p){d[p]=Sr(u),delete d[h];return}const x=l?Jj(h):String(h).trim();x!==h&&delete d[h],d[x]=Sr(u),o[x]=!0}),this}concat(...l){return this.constructor.concat(this,...l)}toJSON(l){const d=Object.create(null);return V.forEach(this,(o,u)=>{o!=null&&o!==!1&&(d[u]=l&&V.isArray(o)?o.join(", "):o)}),d}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([l,d])=>l+": "+d).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(l){return l instanceof this?l:new this(l)}static concat(l,...d){const o=new this(l);return d.forEach(u=>o.set(u)),o}static accessor(l){const o=(this[qp]=this[qp]={accessors:{}}).accessors,u=this.prototype;function h(p){const x=qi(p);o[x]||(Xj(u,p),o[x]=!0)}return V.isArray(l)?l.forEach(h):h(l),this}};Ga.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);V.reduceDescriptors(Ga.prototype,({value:i},l)=>{let d=l[0].toUpperCase()+l.slice(1);return{get:()=>i,set(o){this[d]=o}}});V.freezeMethods(Ga);function td(i,l){const d=this||al,o=l||d,u=Ga.from(o.headers);let h=o.data;return V.forEach(i,function(x){h=x.call(d,h,u.normalize(),l?l.status:void 0)}),u.normalize(),h}function Yf(i){return!!(i&&i.__CANCEL__)}function Ks(i,l,d){Re.call(this,i??"canceled",Re.ERR_CANCELED,l,d),this.name="CanceledError"}V.inherits(Ks,Re,{__CANCEL__:!0});function Vf(i,l,d){const o=d.config.validateStatus;!d.status||!o||o(d.status)?i(d):l(new Re("Request failed with status code "+d.status,[Re.ERR_BAD_REQUEST,Re.ERR_BAD_RESPONSE][Math.floor(d.status/100)-4],d.config,d.request,d))}function Qj(i){const l=/^([-+\w]{1,25})(:?\/\/|:)/.exec(i);return l&&l[1]||""}function Zj(i,l){i=i||10;const d=new Array(i),o=new Array(i);let u=0,h=0,p;return l=l!==void 0?l:1e3,function(y){const f=Date.now(),b=o[h];p||(p=f),d[u]=y,o[u]=f;let v=h,A=0;for(;v!==u;)A+=d[v++],v=v%i;if(u=(u+1)%i,u===h&&(h=(h+1)%i),f-p<l)return;const P=b&&f-b;return P?Math.round(A*1e3/P):void 0}}function Wj(i,l){let d=0,o=1e3/l,u,h;const p=(f,b=Date.now())=>{d=b,u=null,h&&(clearTimeout(h),h=null),i(...f)};return[(...f)=>{const b=Date.now(),v=b-d;v>=o?p(f,b):(u=f,h||(h=setTimeout(()=>{h=null,p(u)},o-v)))},()=>u&&p(u)]}const Cr=(i,l,d=3)=>{let o=0;const u=Zj(50,250);return Wj(h=>{const p=h.loaded,x=h.lengthComputable?h.total:void 0,y=p-o,f=u(y),b=p<=x;o=p;const v={loaded:p,total:x,progress:x?p/x:void 0,bytes:y,rate:f||void 0,estimated:f&&x&&b?(x-p)/f:void 0,event:h,lengthComputable:x!=null,[l?"download":"upload"]:!0};i(v)},d)},Gp=(i,l)=>{const d=i!=null;return[o=>l[0]({lengthComputable:d,total:i,loaded:o}),l[1]]},$p=i=>(...l)=>V.asap(()=>i(...l)),ev=Ma.hasStandardBrowserEnv?((i,l)=>d=>(d=new URL(d,Ma.origin),i.protocol===d.protocol&&i.host===d.host&&(l||i.port===d.port)))(new URL(Ma.origin),Ma.navigator&&/(msie|trident)/i.test(Ma.navigator.userAgent)):()=>!0,av=Ma.hasStandardBrowserEnv?{write(i,l,d,o,u,h){const p=[i+"="+encodeURIComponent(l)];V.isNumber(d)&&p.push("expires="+new Date(d).toGMTString()),V.isString(o)&&p.push("path="+o),V.isString(u)&&p.push("domain="+u),h===!0&&p.push("secure"),document.cookie=p.join("; ")},read(i){const l=document.cookie.match(new RegExp("(^|;\\s*)("+i+")=([^;]*)"));return l?decodeURIComponent(l[3]):null},remove(i){this.write(i,"",Date.now()-864e5)}}:{write(){},read(){return null},remove(){}};function tv(i){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(i)}function nv(i,l){return l?i.replace(/\/?\/$/,"")+"/"+l.replace(/^\/+/,""):i}function Jf(i,l,d){let o=!tv(l);return i&&(o||d==!1)?nv(i,l):l}const Yp=i=>i instanceof Ga?{...i}:i;function Xn(i,l){l=l||{};const d={};function o(f,b,v,A){return V.isPlainObject(f)&&V.isPlainObject(b)?V.merge.call({caseless:A},f,b):V.isPlainObject(b)?V.merge({},b):V.isArray(b)?b.slice():b}function u(f,b,v,A){if(V.isUndefined(b)){if(!V.isUndefined(f))return o(void 0,f,v,A)}else return o(f,b,v,A)}function h(f,b){if(!V.isUndefined(b))return o(void 0,b)}function p(f,b){if(V.isUndefined(b)){if(!V.isUndefined(f))return o(void 0,f)}else return o(void 0,b)}function x(f,b,v){if(v in l)return o(f,b);if(v in i)return o(void 0,f)}const y={url:h,method:h,data:h,baseURL:p,transformRequest:p,transformResponse:p,paramsSerializer:p,timeout:p,timeoutMessage:p,withCredentials:p,withXSRFToken:p,adapter:p,responseType:p,xsrfCookieName:p,xsrfHeaderName:p,onUploadProgress:p,onDownloadProgress:p,decompress:p,maxContentLength:p,maxBodyLength:p,beforeRedirect:p,transport:p,httpAgent:p,httpsAgent:p,cancelToken:p,socketPath:p,responseEncoding:p,validateStatus:x,headers:(f,b,v)=>u(Yp(f),Yp(b),v,!0)};return V.forEach(Object.keys({...i,...l}),function(b){const v=y[b]||u,A=v(i[b],l[b],b);V.isUndefined(A)&&v!==x||(d[b]=A)}),d}const Xf=i=>{const l=Xn({},i);let{data:d,withXSRFToken:o,xsrfHeaderName:u,xsrfCookieName:h,headers:p,auth:x}=l;if(l.headers=p=Ga.from(p),l.url=qf(Jf(l.baseURL,l.url,l.allowAbsoluteUrls),i.params,i.paramsSerializer),x&&p.set("Authorization","Basic "+btoa((x.username||"")+":"+(x.password?unescape(encodeURIComponent(x.password)):""))),V.isFormData(d)){if(Ma.hasStandardBrowserEnv||Ma.hasStandardBrowserWebWorkerEnv)p.setContentType(void 0);else if(V.isFunction(d.getHeaders)){const y=d.getHeaders(),f=["content-type","content-length"];Object.entries(y).forEach(([b,v])=>{f.includes(b.toLowerCase())&&p.set(b,v)})}}if(Ma.hasStandardBrowserEnv&&(o&&V.isFunction(o)&&(o=o(l)),o||o!==!1&&ev(l.url))){const y=u&&h&&av.read(h);y&&p.set(u,y)}return l},sv=typeof XMLHttpRequest<"u",iv=sv&&function(i){return new Promise(function(d,o){const u=Xf(i);let h=u.data;const p=Ga.from(u.headers).normalize();let{responseType:x,onUploadProgress:y,onDownloadProgress:f}=u,b,v,A,P,w;function M(){P&&P(),w&&w(),u.cancelToken&&u.cancelToken.unsubscribe(b),u.signal&&u.signal.removeEventListener("abort",b)}let H=new XMLHttpRequest;H.open(u.method.toUpperCase(),u.url,!0),H.timeout=u.timeout;function _(){if(!H)return;const L=Ga.from("getAllResponseHeaders"in H&&H.getAllResponseHeaders()),oe={data:!x||x==="text"||x==="json"?H.responseText:H.response,status:H.status,statusText:H.statusText,headers:L,config:i,request:H};Vf(function(te){d(te),M()},function(te){o(te),M()},oe),H=null}"onloadend"in H?H.onloadend=_:H.onreadystatechange=function(){!H||H.readyState!==4||H.status===0&&!(H.responseURL&&H.responseURL.indexOf("file:")===0)||setTimeout(_)},H.onabort=function(){H&&(o(new Re("Request aborted",Re.ECONNABORTED,i,H)),H=null)},H.onerror=function(q){const oe=q&&q.message?q.message:"Network Error",re=new Re(oe,Re.ERR_NETWORK,i,H);re.event=q||null,o(re),H=null},H.ontimeout=function(){let q=u.timeout?"timeout of "+u.timeout+"ms exceeded":"timeout exceeded";const oe=u.transitional||Gf;u.timeoutErrorMessage&&(q=u.timeoutErrorMessage),o(new Re(q,oe.clarifyTimeoutError?Re.ETIMEDOUT:Re.ECONNABORTED,i,H)),H=null},h===void 0&&p.setContentType(null),"setRequestHeader"in H&&V.forEach(p.toJSON(),function(q,oe){H.setRequestHeader(oe,q)}),V.isUndefined(u.withCredentials)||(H.withCredentials=!!u.withCredentials),x&&x!=="json"&&(H.responseType=u.responseType),f&&([A,w]=Cr(f,!0),H.addEventListener("progress",A)),y&&H.upload&&([v,P]=Cr(y),H.upload.addEventListener("progress",v),H.upload.addEventListener("loadend",P)),(u.cancelToken||u.signal)&&(b=L=>{H&&(o(!L||L.type?new Ks(null,i,H):L),H.abort(),H=null)},u.cancelToken&&u.cancelToken.subscribe(b),u.signal&&(u.signal.aborted?b():u.signal.addEventListener("abort",b)));const E=Qj(u.url);if(E&&Ma.protocols.indexOf(E)===-1){o(new Re("Unsupported protocol "+E+":",Re.ERR_BAD_REQUEST,i));return}H.send(h||null)})},lv=(i,l)=>{const{length:d}=i=i?i.filter(Boolean):[];if(l||d){let o=new AbortController,u;const h=function(f){if(!u){u=!0,x();const b=f instanceof Error?f:this.reason;o.abort(b instanceof Re?b:new Ks(b instanceof Error?b.message:b))}};let p=l&&setTimeout(()=>{p=null,h(new Re(`timeout ${l} of ms exceeded`,Re.ETIMEDOUT))},l);const x=()=>{i&&(p&&clearTimeout(p),p=null,i.forEach(f=>{f.unsubscribe?f.unsubscribe(h):f.removeEventListener("abort",h)}),i=null)};i.forEach(f=>f.addEventListener("abort",h));const{signal:y}=o;return y.unsubscribe=()=>V.asap(x),y}},rv=function*(i,l){let d=i.byteLength;if(d<l){yield i;return}let o=0,u;for(;o<d;)u=o+l,yield i.slice(o,u),o=u},cv=async function*(i,l){for await(const d of ov(i))yield*rv(d,l)},ov=async function*(i){if(i[Symbol.asyncIterator]){yield*i;return}const l=i.getReader();try{for(;;){const{done:d,value:o}=await l.read();if(d)break;yield o}}finally{await l.cancel()}},Vp=(i,l,d,o)=>{const u=cv(i,l);let h=0,p,x=y=>{p||(p=!0,o&&o(y))};return new ReadableStream({async pull(y){try{const{done:f,value:b}=await u.next();if(f){x(),y.close();return}let v=b.byteLength;if(d){let A=h+=v;d(A)}y.enqueue(new Uint8Array(b))}catch(f){throw x(f),f}},cancel(y){return x(y),u.return()}},{highWaterMark:2})},Jp=64*1024,{isFunction:xr}=V,dv=(({Request:i,Response:l})=>({Request:i,Response:l}))(V.global),{ReadableStream:Xp,TextEncoder:Qp}=V.global,Zp=(i,...l)=>{try{return!!i(...l)}catch{return!1}},uv=i=>{i=V.merge.call({skipUndefined:!0},dv,i);const{fetch:l,Request:d,Response:o}=i,u=l?xr(l):typeof fetch=="function",h=xr(d),p=xr(o);if(!u)return!1;const x=u&&xr(Xp),y=u&&(typeof Qp=="function"?(w=>M=>w.encode(M))(new Qp):async w=>new Uint8Array(await new d(w).arrayBuffer())),f=h&&x&&Zp(()=>{let w=!1;const M=new d(Ma.origin,{body:new Xp,method:"POST",get duplex(){return w=!0,"half"}}).headers.has("Content-Type");return w&&!M}),b=p&&x&&Zp(()=>V.isReadableStream(new o("").body)),v={stream:b&&(w=>w.body)};u&&["text","arrayBuffer","blob","formData","stream"].forEach(w=>{!v[w]&&(v[w]=(M,H)=>{let _=M&&M[w];if(_)return _.call(M);throw new Re(`Response type '${w}' is not supported`,Re.ERR_NOT_SUPPORT,H)})});const A=async w=>{if(w==null)return 0;if(V.isBlob(w))return w.size;if(V.isSpecCompliantForm(w))return(await new d(Ma.origin,{method:"POST",body:w}).arrayBuffer()).byteLength;if(V.isArrayBufferView(w)||V.isArrayBuffer(w))return w.byteLength;if(V.isURLSearchParams(w)&&(w=w+""),V.isString(w))return(await y(w)).byteLength},P=async(w,M)=>{const H=V.toFiniteNumber(w.getContentLength());return H??A(M)};return async w=>{let{url:M,method:H,data:_,signal:E,cancelToken:L,timeout:q,onDownloadProgress:oe,onUploadProgress:re,responseType:te,headers:ge,withCredentials:ye="same-origin",fetchOptions:he}=Xf(w),Oe=l||fetch;te=te?(te+"").toLowerCase():"text";let Ce=lv([E,L&&L.toAbortSignal()],q),Se=null;const Z=Ce&&Ce.unsubscribe&&(()=>{Ce.unsubscribe()});let fe;try{if(re&&f&&H!=="get"&&H!=="head"&&(fe=await P(ge,_))!==0){let N=new d(M,{method:"POST",body:_,duplex:"half"}),k;if(V.isFormData(_)&&(k=N.headers.get("content-type"))&&ge.setContentType(k),N.body){const[Y,X]=Gp(fe,Cr($p(re)));_=Vp(N.body,Jp,Y,X)}}V.isString(ye)||(ye=ye?"include":"omit");const U=h&&"credentials"in d.prototype,ie={...he,signal:Ce,method:H.toUpperCase(),headers:ge.normalize().toJSON(),body:_,duplex:"half",credentials:U?ye:void 0};Se=h&&new d(M,ie);let I=await(h?Oe(Se,he):Oe(M,ie));const ue=b&&(te==="stream"||te==="response");if(b&&(oe||ue&&Z)){const N={};["status","statusText","headers"].forEach(se=>{N[se]=I[se]});const k=V.toFiniteNumber(I.headers.get("content-length")),[Y,X]=oe&&Gp(k,Cr($p(oe),!0))||[];I=new o(Vp(I.body,Jp,Y,()=>{X&&X(),Z&&Z()}),N)}te=te||"text";let D=await v[V.findKey(v,te)||"text"](I,w);return!ue&&Z&&Z(),await new Promise((N,k)=>{Vf(N,k,{data:D,headers:Ga.from(I.headers),status:I.status,statusText:I.statusText,config:w,request:Se})})}catch(U){throw Z&&Z(),U&&U.name==="TypeError"&&/Load failed|fetch/i.test(U.message)?Object.assign(new Re("Network Error",Re.ERR_NETWORK,w,Se),{cause:U.cause||U}):Re.from(U,U&&U.code,w,Se)}}},mv=new Map,Qf=i=>{let l=i?i.env:{};const{fetch:d,Request:o,Response:u}=l,h=[o,u,d];let p=h.length,x=p,y,f,b=mv;for(;x--;)y=h[x],f=b.get(y),f===void 0&&b.set(y,f=x?new Map:uv(l)),b=f;return f};Qf();const bd={http:Ej,xhr:iv,fetch:{get:Qf}};V.forEach(bd,(i,l)=>{if(i){try{Object.defineProperty(i,"name",{value:l})}catch{}Object.defineProperty(i,"adapterName",{value:l})}});const Wp=i=>`- ${i}`,hv=i=>V.isFunction(i)||i===null||i===!1,Zf={getAdapter:(i,l)=>{i=V.isArray(i)?i:[i];const{length:d}=i;let o,u;const h={};for(let p=0;p<d;p++){o=i[p];let x;if(u=o,!hv(o)&&(u=bd[(x=String(o)).toLowerCase()],u===void 0))throw new Re(`Unknown adapter '${x}'`);if(u&&(V.isFunction(u)||(u=u.get(l))))break;h[x||"#"+p]=u}if(!u){const p=Object.entries(h).map(([y,f])=>`adapter ${y} `+(f===!1?"is not supported by the environment":"is not available in the build"));let x=d?p.length>1?`since :
`+p.map(Wp).join(`
`):" "+Wp(p[0]):"as no adapter specified";throw new Re("There is no suitable adapter to dispatch the request "+x,"ERR_NOT_SUPPORT")}return u},adapters:bd};function nd(i){if(i.cancelToken&&i.cancelToken.throwIfRequested(),i.signal&&i.signal.aborted)throw new Ks(null,i)}function ef(i){return nd(i),i.headers=Ga.from(i.headers),i.data=td.call(i,i.transformRequest),["post","put","patch"].indexOf(i.method)!==-1&&i.headers.setContentType("application/x-www-form-urlencoded",!1),Zf.getAdapter(i.adapter||al.adapter,i)(i).then(function(o){return nd(i),o.data=td.call(i,i.transformResponse,o),o.headers=Ga.from(o.headers),o},function(o){return Yf(o)||(nd(i),o&&o.response&&(o.response.data=td.call(i,i.transformResponse,o.response),o.response.headers=Ga.from(o.response.headers))),Promise.reject(o)})}const Wf="1.12.2",Pr={};["object","boolean","number","function","string","symbol"].forEach((i,l)=>{Pr[i]=function(o){return typeof o===i||"a"+(l<1?"n ":" ")+i}});const af={};Pr.transitional=function(l,d,o){function u(h,p){return"[Axios v"+Wf+"] Transitional option '"+h+"'"+p+(o?". "+o:"")}return(h,p,x)=>{if(l===!1)throw new Re(u(p," has been removed"+(d?" in "+d:"")),Re.ERR_DEPRECATED);return d&&!af[p]&&(af[p]=!0,console.warn(u(p," has been deprecated since v"+d+" and will be removed in the near future"))),l?l(h,p,x):!0}};Pr.spelling=function(l){return(d,o)=>(console.warn(`${o} is likely a misspelling of ${l}`),!0)};function pv(i,l,d){if(typeof i!="object")throw new Re("options must be an object",Re.ERR_BAD_OPTION_VALUE);const o=Object.keys(i);let u=o.length;for(;u-- >0;){const h=o[u],p=l[h];if(p){const x=i[h],y=x===void 0||p(x,h,i);if(y!==!0)throw new Re("option "+h+" must be "+y,Re.ERR_BAD_OPTION_VALUE);continue}if(d!==!0)throw new Re("Unknown option "+h,Re.ERR_BAD_OPTION)}}const wr={assertOptions:pv,validators:Pr},St=wr.validators;let Jn=class{constructor(l){this.defaults=l||{},this.interceptors={request:new Kp,response:new Kp}}async request(l,d){try{return await this._request(l,d)}catch(o){if(o instanceof Error){let u={};Error.captureStackTrace?Error.captureStackTrace(u):u=new Error;const h=u.stack?u.stack.replace(/^.+\n/,""):"";try{o.stack?h&&!String(o.stack).endsWith(h.replace(/^.+\n.+\n/,""))&&(o.stack+=`
`+h):o.stack=h}catch{}}throw o}}_request(l,d){typeof l=="string"?(d=d||{},d.url=l):d=l||{},d=Xn(this.defaults,d);const{transitional:o,paramsSerializer:u,headers:h}=d;o!==void 0&&wr.assertOptions(o,{silentJSONParsing:St.transitional(St.boolean),forcedJSONParsing:St.transitional(St.boolean),clarifyTimeoutError:St.transitional(St.boolean)},!1),u!=null&&(V.isFunction(u)?d.paramsSerializer={serialize:u}:wr.assertOptions(u,{encode:St.function,serialize:St.function},!0)),d.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?d.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:d.allowAbsoluteUrls=!0),wr.assertOptions(d,{baseUrl:St.spelling("baseURL"),withXsrfToken:St.spelling("withXSRFToken")},!0),d.method=(d.method||this.defaults.method||"get").toLowerCase();let p=h&&V.merge(h.common,h[d.method]);h&&V.forEach(["delete","get","head","post","put","patch","common"],w=>{delete h[w]}),d.headers=Ga.concat(p,h);const x=[];let y=!0;this.interceptors.request.forEach(function(M){typeof M.runWhen=="function"&&M.runWhen(d)===!1||(y=y&&M.synchronous,x.unshift(M.fulfilled,M.rejected))});const f=[];this.interceptors.response.forEach(function(M){f.push(M.fulfilled,M.rejected)});let b,v=0,A;if(!y){const w=[ef.bind(this),void 0];for(w.unshift(...x),w.push(...f),A=w.length,b=Promise.resolve(d);v<A;)b=b.then(w[v++],w[v++]);return b}A=x.length;let P=d;for(;v<A;){const w=x[v++],M=x[v++];try{P=w(P)}catch(H){M.call(this,H);break}}try{b=ef.call(this,P)}catch(w){return Promise.reject(w)}for(v=0,A=f.length;v<A;)b=b.then(f[v++],f[v++]);return b}getUri(l){l=Xn(this.defaults,l);const d=Jf(l.baseURL,l.url,l.allowAbsoluteUrls);return qf(d,l.params,l.paramsSerializer)}};V.forEach(["delete","get","head","options"],function(l){Jn.prototype[l]=function(d,o){return this.request(Xn(o||{},{method:l,url:d,data:(o||{}).data}))}});V.forEach(["post","put","patch"],function(l){function d(o){return function(h,p,x){return this.request(Xn(x||{},{method:l,headers:o?{"Content-Type":"multipart/form-data"}:{},url:h,data:p}))}}Jn.prototype[l]=d(),Jn.prototype[l+"Form"]=d(!0)});let fv=class eg{constructor(l){if(typeof l!="function")throw new TypeError("executor must be a function.");let d;this.promise=new Promise(function(h){d=h});const o=this;this.promise.then(u=>{if(!o._listeners)return;let h=o._listeners.length;for(;h-- >0;)o._listeners[h](u);o._listeners=null}),this.promise.then=u=>{let h;const p=new Promise(x=>{o.subscribe(x),h=x}).then(u);return p.cancel=function(){o.unsubscribe(h)},p},l(function(h,p,x){o.reason||(o.reason=new Ks(h,p,x),d(o.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(l){if(this.reason){l(this.reason);return}this._listeners?this._listeners.push(l):this._listeners=[l]}unsubscribe(l){if(!this._listeners)return;const d=this._listeners.indexOf(l);d!==-1&&this._listeners.splice(d,1)}toAbortSignal(){const l=new AbortController,d=o=>{l.abort(o)};return this.subscribe(d),l.signal.unsubscribe=()=>this.unsubscribe(d),l.signal}static source(){let l;return{token:new eg(function(u){l=u}),cancel:l}}};function gv(i){return function(d){return i.apply(null,d)}}function xv(i){return V.isObject(i)&&i.isAxiosError===!0}const jd={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(jd).forEach(([i,l])=>{jd[l]=i});function ag(i){const l=new Jn(i),d=Rf(Jn.prototype.request,l);return V.extend(d,Jn.prototype,l,{allOwnKeys:!0}),V.extend(d,l,null,{allOwnKeys:!0}),d.create=function(u){return ag(Xn(i,u))},d}const de=ag(al);de.Axios=Jn;de.CanceledError=Ks;de.CancelToken=fv;de.isCancel=Yf;de.VERSION=Wf;de.toFormData=Lr;de.AxiosError=Re;de.Cancel=de.CanceledError;de.all=function(l){return Promise.all(l)};de.spread=gv;de.isAxiosError=xv;de.mergeConfig=Xn;de.AxiosHeaders=Ga;de.formToJSON=i=>$f(V.isHTMLForm(i)?new FormData(i):i);de.getAdapter=Zf.getAdapter;de.HttpStatusCode=jd;de.default=de;const{Axios:l0,AxiosError:r0,CanceledError:c0,isCancel:o0,CancelToken:d0,VERSION:u0,all:m0,Cancel:h0,isAxiosError:p0,spread:f0,toFormData:g0,AxiosHeaders:x0,HttpStatusCode:b0,formToJSON:j0,getAdapter:v0,mergeConfig:y0}=de;/**
 * react-router v7.9.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var tf="popstate";function bv(i={}){function l(o,u){let{pathname:h,search:p,hash:x}=o.location;return vd("",{pathname:h,search:p,hash:x},u.state&&u.state.usr||null,u.state&&u.state.key||"default")}function d(o,u){return typeof u=="string"?u:Vi(u)}return vv(l,d,null,i)}function ca(i,l){if(i===!1||i===null||typeof i>"u")throw new Error(l)}function ft(i,l){if(!i){typeof console<"u"&&console.warn(l);try{throw new Error(l)}catch{}}}function jv(){return Math.random().toString(36).substring(2,10)}function nf(i,l){return{usr:i.state,key:i.key,idx:l}}function vd(i,l,d=null,o){return{pathname:typeof i=="string"?i:i.pathname,search:"",hash:"",...typeof l=="string"?qs(l):l,state:d,key:l&&l.key||o||jv()}}function Vi({pathname:i="/",search:l="",hash:d=""}){return l&&l!=="?"&&(i+=l.charAt(0)==="?"?l:"?"+l),d&&d!=="#"&&(i+=d.charAt(0)==="#"?d:"#"+d),i}function qs(i){let l={};if(i){let d=i.indexOf("#");d>=0&&(l.hash=i.substring(d),i=i.substring(0,d));let o=i.indexOf("?");o>=0&&(l.search=i.substring(o),i=i.substring(0,o)),i&&(l.pathname=i)}return l}function vv(i,l,d,o={}){let{window:u=document.defaultView,v5Compat:h=!1}=o,p=u.history,x="POP",y=null,f=b();f==null&&(f=0,p.replaceState({...p.state,idx:f},""));function b(){return(p.state||{idx:null}).idx}function v(){x="POP";let H=b(),_=H==null?null:H-f;f=H,y&&y({action:x,location:M.location,delta:_})}function A(H,_){x="PUSH";let E=vd(M.location,H,_);f=b()+1;let L=nf(E,f),q=M.createHref(E);try{p.pushState(L,"",q)}catch(oe){if(oe instanceof DOMException&&oe.name==="DataCloneError")throw oe;u.location.assign(q)}h&&y&&y({action:x,location:M.location,delta:1})}function P(H,_){x="REPLACE";let E=vd(M.location,H,_);f=b();let L=nf(E,f),q=M.createHref(E);p.replaceState(L,"",q),h&&y&&y({action:x,location:M.location,delta:0})}function w(H){return yv(H)}let M={get action(){return x},get location(){return i(u,p)},listen(H){if(y)throw new Error("A history only accepts one active listener");return u.addEventListener(tf,v),y=H,()=>{u.removeEventListener(tf,v),y=null}},createHref(H){return l(u,H)},createURL:w,encodeLocation(H){let _=w(H);return{pathname:_.pathname,search:_.search,hash:_.hash}},push:A,replace:P,go(H){return p.go(H)}};return M}function yv(i,l=!1){let d="http://localhost";typeof window<"u"&&(d=window.location.origin!=="null"?window.location.origin:window.location.href),ca(d,"No window.location.(origin|href) available to create URL");let o=typeof i=="string"?i:Vi(i);return o=o.replace(/ $/,"%20"),!l&&o.startsWith("//")&&(o=d+o),new URL(o,d)}function tg(i,l,d="/"){return Nv(i,l,d,!1)}function Nv(i,l,d,o){let u=typeof l=="string"?qs(l):l,h=Wt(u.pathname||"/",d);if(h==null)return null;let p=ng(i);kv(p);let x=null;for(let y=0;x==null&&y<p.length;++y){let f=Ov(h);x=Rv(p[y],f,o)}return x}function ng(i,l=[],d=[],o="",u=!1){let h=(p,x,y=u,f)=>{let b={relativePath:f===void 0?p.path||"":f,caseSensitive:p.caseSensitive===!0,childrenIndex:x,route:p};if(b.relativePath.startsWith("/")){if(!b.relativePath.startsWith(o)&&y)return;ca(b.relativePath.startsWith(o),`Absolute route path "${b.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),b.relativePath=b.relativePath.slice(o.length)}let v=Zt([o,b.relativePath]),A=d.concat(b);p.children&&p.children.length>0&&(ca(p.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${v}".`),ng(p.children,l,A,v,y)),!(p.path==null&&!p.index)&&l.push({path:v,score:Cv(v,p.index),routesMeta:A})};return i.forEach((p,x)=>{if(p.path===""||!p.path?.includes("?"))h(p,x);else for(let y of sg(p.path))h(p,x,!0,y)}),l}function sg(i){let l=i.split("/");if(l.length===0)return[];let[d,...o]=l,u=d.endsWith("?"),h=d.replace(/\?$/,"");if(o.length===0)return u?[h,""]:[h];let p=sg(o.join("/")),x=[];return x.push(...p.map(y=>y===""?h:[h,y].join("/"))),u&&x.push(...p),x.map(y=>i.startsWith("/")&&y===""?"/":y)}function kv(i){i.sort((l,d)=>l.score!==d.score?d.score-l.score:Mv(l.routesMeta.map(o=>o.childrenIndex),d.routesMeta.map(o=>o.childrenIndex)))}var _v=/^:[\w-]+$/,Sv=3,wv=2,Av=1,Tv=10,Ev=-2,sf=i=>i==="*";function Cv(i,l){let d=i.split("/"),o=d.length;return d.some(sf)&&(o+=Ev),l&&(o+=wv),d.filter(u=>!sf(u)).reduce((u,h)=>u+(_v.test(h)?Sv:h===""?Av:Tv),o)}function Mv(i,l){return i.length===l.length&&i.slice(0,-1).every((o,u)=>o===l[u])?i[i.length-1]-l[l.length-1]:0}function Rv(i,l,d=!1){let{routesMeta:o}=i,u={},h="/",p=[];for(let x=0;x<o.length;++x){let y=o[x],f=x===o.length-1,b=h==="/"?l:l.slice(h.length)||"/",v=Mr({path:y.relativePath,caseSensitive:y.caseSensitive,end:f},b),A=y.route;if(!v&&f&&d&&!o[o.length-1].route.index&&(v=Mr({path:y.relativePath,caseSensitive:y.caseSensitive,end:!1},b)),!v)return null;Object.assign(u,v.params),p.push({params:u,pathname:Zt([h,v.pathname]),pathnameBase:zv(Zt([h,v.pathnameBase])),route:A}),v.pathnameBase!=="/"&&(h=Zt([h,v.pathnameBase]))}return p}function Mr(i,l){typeof i=="string"&&(i={path:i,caseSensitive:!1,end:!0});let[d,o]=Dv(i.path,i.caseSensitive,i.end),u=l.match(d);if(!u)return null;let h=u[0],p=h.replace(/(.)\/+$/,"$1"),x=u.slice(1);return{params:o.reduce((f,{paramName:b,isOptional:v},A)=>{if(b==="*"){let w=x[A]||"";p=h.slice(0,h.length-w.length).replace(/(.)\/+$/,"$1")}const P=x[A];return v&&!P?f[b]=void 0:f[b]=(P||"").replace(/%2F/g,"/"),f},{}),pathname:h,pathnameBase:p,pattern:i}}function Dv(i,l=!1,d=!0){ft(i==="*"||!i.endsWith("*")||i.endsWith("/*"),`Route path "${i}" will be treated as if it were "${i.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/,"/*")}".`);let o=[],u="^"+i.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(p,x,y)=>(o.push({paramName:x,isOptional:y!=null}),y?"/?([^\\/]+)?":"/([^\\/]+)")).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return i.endsWith("*")?(o.push({paramName:"*"}),u+=i==="*"||i==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):d?u+="\\/*$":i!==""&&i!=="/"&&(u+="(?:(?=\\/|$))"),[new RegExp(u,l?void 0:"i"),o]}function Ov(i){try{return i.split("/").map(l=>decodeURIComponent(l).replace(/\//g,"%2F")).join("/")}catch(l){return ft(!1,`The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${l}).`),i}}function Wt(i,l){if(l==="/")return i;if(!i.toLowerCase().startsWith(l.toLowerCase()))return null;let d=l.endsWith("/")?l.length-1:l.length,o=i.charAt(d);return o&&o!=="/"?null:i.slice(d)||"/"}function Lv(i,l="/"){let{pathname:d,search:o="",hash:u=""}=typeof i=="string"?qs(i):i;return{pathname:d?d.startsWith("/")?d:Pv(d,l):l,search:Bv(o),hash:Fv(u)}}function Pv(i,l){let d=l.replace(/\/+$/,"").split("/");return i.split("/").forEach(u=>{u===".."?d.length>1&&d.pop():u!=="."&&d.push(u)}),d.length>1?d.join("/"):"/"}function sd(i,l,d,o){return`Cannot include a '${i}' character in a manually specified \`to.${l}\` field [${JSON.stringify(o)}].  Please separate it out to the \`to.${d}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Uv(i){return i.filter((l,d)=>d===0||l.route.path&&l.route.path.length>0)}function Ed(i){let l=Uv(i);return l.map((d,o)=>o===l.length-1?d.pathname:d.pathnameBase)}function Cd(i,l,d,o=!1){let u;typeof i=="string"?u=qs(i):(u={...i},ca(!u.pathname||!u.pathname.includes("?"),sd("?","pathname","search",u)),ca(!u.pathname||!u.pathname.includes("#"),sd("#","pathname","hash",u)),ca(!u.search||!u.search.includes("#"),sd("#","search","hash",u)));let h=i===""||u.pathname==="",p=h?"/":u.pathname,x;if(p==null)x=d;else{let v=l.length-1;if(!o&&p.startsWith("..")){let A=p.split("/");for(;A[0]==="..";)A.shift(),v-=1;u.pathname=A.join("/")}x=v>=0?l[v]:"/"}let y=Lv(u,x),f=p&&p!=="/"&&p.endsWith("/"),b=(h||p===".")&&d.endsWith("/");return!y.pathname.endsWith("/")&&(f||b)&&(y.pathname+="/"),y}var Zt=i=>i.join("/").replace(/\/\/+/g,"/"),zv=i=>i.replace(/\/+$/,"").replace(/^\/*/,"/"),Bv=i=>!i||i==="?"?"":i.startsWith("?")?i:"?"+i,Fv=i=>!i||i==="#"?"":i.startsWith("#")?i:"#"+i;function Hv(i){return i!=null&&typeof i.status=="number"&&typeof i.statusText=="string"&&typeof i.internal=="boolean"&&"data"in i}var ig=["POST","PUT","PATCH","DELETE"];new Set(ig);var Iv=["GET",...ig];new Set(Iv);var Gs=j.createContext(null);Gs.displayName="DataRouter";var Ur=j.createContext(null);Ur.displayName="DataRouterState";j.createContext(!1);var lg=j.createContext({isTransitioning:!1});lg.displayName="ViewTransition";var Kv=j.createContext(new Map);Kv.displayName="Fetchers";var qv=j.createContext(null);qv.displayName="Await";var xt=j.createContext(null);xt.displayName="Navigation";var tl=j.createContext(null);tl.displayName="Location";var bt=j.createContext({outlet:null,matches:[],isDataRoute:!1});bt.displayName="Route";var Md=j.createContext(null);Md.displayName="RouteError";function Gv(i,{relative:l}={}){ca($s(),"useHref() may be used only in the context of a <Router> component.");let{basename:d,navigator:o}=j.useContext(xt),{hash:u,pathname:h,search:p}=nl(i,{relative:l}),x=h;return d!=="/"&&(x=h==="/"?d:Zt([d,h])),o.createHref({pathname:x,search:p,hash:u})}function $s(){return j.useContext(tl)!=null}function jt(){return ca($s(),"useLocation() may be used only in the context of a <Router> component."),j.useContext(tl).location}var rg="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function cg(i){j.useContext(xt).static||j.useLayoutEffect(i)}function Ys(){let{isDataRoute:i}=j.useContext(bt);return i?iy():$v()}function $v(){ca($s(),"useNavigate() may be used only in the context of a <Router> component.");let i=j.useContext(Gs),{basename:l,navigator:d}=j.useContext(xt),{matches:o}=j.useContext(bt),{pathname:u}=jt(),h=JSON.stringify(Ed(o)),p=j.useRef(!1);return cg(()=>{p.current=!0}),j.useCallback((y,f={})=>{if(ft(p.current,rg),!p.current)return;if(typeof y=="number"){d.go(y);return}let b=Cd(y,JSON.parse(h),u,f.relative==="path");i==null&&l!=="/"&&(b.pathname=b.pathname==="/"?l:Zt([l,b.pathname])),(f.replace?d.replace:d.push)(b,f.state,f)},[l,d,h,u,i])}j.createContext(null);function Yv(){let{matches:i}=j.useContext(bt),l=i[i.length-1];return l?l.params:{}}function nl(i,{relative:l}={}){let{matches:d}=j.useContext(bt),{pathname:o}=jt(),u=JSON.stringify(Ed(d));return j.useMemo(()=>Cd(i,JSON.parse(u),o,l==="path"),[i,u,o,l])}function Vv(i,l){return og(i,l)}function og(i,l,d,o,u){ca($s(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:h}=j.useContext(xt),{matches:p}=j.useContext(bt),x=p[p.length-1],y=x?x.params:{},f=x?x.pathname:"/",b=x?x.pathnameBase:"/",v=x&&x.route;{let E=v&&v.path||"";dg(f,!v||E.endsWith("*")||E.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${f}" (under <Route path="${E}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${E}"> to <Route path="${E==="/"?"*":`${E}/*`}">.`)}let A=jt(),P;if(l){let E=typeof l=="string"?qs(l):l;ca(b==="/"||E.pathname?.startsWith(b),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${b}" but pathname "${E.pathname}" was given in the \`location\` prop.`),P=E}else P=A;let w=P.pathname||"/",M=w;if(b!=="/"){let E=b.replace(/^\//,"").split("/");M="/"+w.replace(/^\//,"").split("/").slice(E.length).join("/")}let H=tg(i,{pathname:M});ft(v||H!=null,`No routes matched location "${P.pathname}${P.search}${P.hash}" `),ft(H==null||H[H.length-1].route.element!==void 0||H[H.length-1].route.Component!==void 0||H[H.length-1].route.lazy!==void 0,`Matched leaf route at location "${P.pathname}${P.search}${P.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let _=Wv(H&&H.map(E=>Object.assign({},E,{params:Object.assign({},y,E.params),pathname:Zt([b,h.encodeLocation?h.encodeLocation(E.pathname.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:E.pathname]),pathnameBase:E.pathnameBase==="/"?b:Zt([b,h.encodeLocation?h.encodeLocation(E.pathnameBase.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:E.pathnameBase])})),p,d,o,u);return l&&_?j.createElement(tl.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",...P},navigationType:"POP"}},_):_}function Jv(){let i=sy(),l=Hv(i)?`${i.status} ${i.statusText}`:i instanceof Error?i.message:JSON.stringify(i),d=i instanceof Error?i.stack:null,o="rgba(200,200,200, 0.5)",u={padding:"0.5rem",backgroundColor:o},h={padding:"2px 4px",backgroundColor:o},p=null;return console.error("Error handled by React Router default ErrorBoundary:",i),p=j.createElement(j.Fragment,null,j.createElement("p",null,"💿 Hey developer 👋"),j.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",j.createElement("code",{style:h},"ErrorBoundary")," or"," ",j.createElement("code",{style:h},"errorElement")," prop on your route.")),j.createElement(j.Fragment,null,j.createElement("h2",null,"Unexpected Application Error!"),j.createElement("h3",{style:{fontStyle:"italic"}},l),d?j.createElement("pre",{style:u},d):null,p)}var Xv=j.createElement(Jv,null),Qv=class extends j.Component{constructor(i){super(i),this.state={location:i.location,revalidation:i.revalidation,error:i.error}}static getDerivedStateFromError(i){return{error:i}}static getDerivedStateFromProps(i,l){return l.location!==i.location||l.revalidation!=="idle"&&i.revalidation==="idle"?{error:i.error,location:i.location,revalidation:i.revalidation}:{error:i.error!==void 0?i.error:l.error,location:l.location,revalidation:i.revalidation||l.revalidation}}componentDidCatch(i,l){this.props.unstable_onError?this.props.unstable_onError(i,l):console.error("React Router caught the following error during render",i)}render(){return this.state.error!==void 0?j.createElement(bt.Provider,{value:this.props.routeContext},j.createElement(Md.Provider,{value:this.state.error,children:this.props.component})):this.props.children}};function Zv({routeContext:i,match:l,children:d}){let o=j.useContext(Gs);return o&&o.static&&o.staticContext&&(l.route.errorElement||l.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=l.route.id),j.createElement(bt.Provider,{value:i},d)}function Wv(i,l=[],d=null,o=null,u=null){if(i==null){if(!d)return null;if(d.errors)i=d.matches;else if(l.length===0&&!d.initialized&&d.matches.length>0)i=d.matches;else return null}let h=i,p=d?.errors;if(p!=null){let f=h.findIndex(b=>b.route.id&&p?.[b.route.id]!==void 0);ca(f>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(p).join(",")}`),h=h.slice(0,Math.min(h.length,f+1))}let x=!1,y=-1;if(d)for(let f=0;f<h.length;f++){let b=h[f];if((b.route.HydrateFallback||b.route.hydrateFallbackElement)&&(y=f),b.route.id){let{loaderData:v,errors:A}=d,P=b.route.loader&&!v.hasOwnProperty(b.route.id)&&(!A||A[b.route.id]===void 0);if(b.route.lazy||P){x=!0,y>=0?h=h.slice(0,y+1):h=[h[0]];break}}}return h.reduceRight((f,b,v)=>{let A,P=!1,w=null,M=null;d&&(A=p&&b.route.id?p[b.route.id]:void 0,w=b.route.errorElement||Xv,x&&(y<0&&v===0?(dg("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),P=!0,M=null):y===v&&(P=!0,M=b.route.hydrateFallbackElement||null)));let H=l.concat(h.slice(0,v+1)),_=()=>{let E;return A?E=w:P?E=M:b.route.Component?E=j.createElement(b.route.Component,null):b.route.element?E=b.route.element:E=f,j.createElement(Zv,{match:b,routeContext:{outlet:f,matches:H,isDataRoute:d!=null},children:E})};return d&&(b.route.ErrorBoundary||b.route.errorElement||v===0)?j.createElement(Qv,{location:d.location,revalidation:d.revalidation,component:w,error:A,children:_(),routeContext:{outlet:null,matches:H,isDataRoute:!0},unstable_onError:o}):_()},null)}function Rd(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function ey(i){let l=j.useContext(Gs);return ca(l,Rd(i)),l}function ay(i){let l=j.useContext(Ur);return ca(l,Rd(i)),l}function ty(i){let l=j.useContext(bt);return ca(l,Rd(i)),l}function Dd(i){let l=ty(i),d=l.matches[l.matches.length-1];return ca(d.route.id,`${i} can only be used on routes that contain a unique "id"`),d.route.id}function ny(){return Dd("useRouteId")}function sy(){let i=j.useContext(Md),l=ay("useRouteError"),d=Dd("useRouteError");return i!==void 0?i:l.errors?.[d]}function iy(){let{router:i}=ey("useNavigate"),l=Dd("useNavigate"),d=j.useRef(!1);return cg(()=>{d.current=!0}),j.useCallback(async(u,h={})=>{ft(d.current,rg),d.current&&(typeof u=="number"?i.navigate(u):await i.navigate(u,{fromRouteId:l,...h}))},[i,l])}var lf={};function dg(i,l,d){!l&&!lf[i]&&(lf[i]=!0,ft(!1,d))}j.memo(ly);function ly({routes:i,future:l,state:d,unstable_onError:o}){return og(i,void 0,d,o,l)}function Ji({to:i,replace:l,state:d,relative:o}){ca($s(),"<Navigate> may be used only in the context of a <Router> component.");let{static:u}=j.useContext(xt);ft(!u,"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");let{matches:h}=j.useContext(bt),{pathname:p}=jt(),x=Ys(),y=Cd(i,Ed(h),p,o==="path"),f=JSON.stringify(y);return j.useEffect(()=>{x(JSON.parse(f),{replace:l,state:d,relative:o})},[x,f,o,l,d]),null}function _a(i){ca(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function ry({basename:i="/",children:l=null,location:d,navigationType:o="POP",navigator:u,static:h=!1}){ca(!$s(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let p=i.replace(/^\/*/,"/"),x=j.useMemo(()=>({basename:p,navigator:u,static:h,future:{}}),[p,u,h]);typeof d=="string"&&(d=qs(d));let{pathname:y="/",search:f="",hash:b="",state:v=null,key:A="default"}=d,P=j.useMemo(()=>{let w=Wt(y,p);return w==null?null:{location:{pathname:w,search:f,hash:b,state:v,key:A},navigationType:o}},[p,y,f,b,v,A,o]);return ft(P!=null,`<Router basename="${p}"> is not able to match the URL "${y}${f}${b}" because it does not start with the basename, so the <Router> won't render anything.`),P==null?null:j.createElement(xt.Provider,{value:x},j.createElement(tl.Provider,{children:l,value:P}))}function cy({children:i,location:l}){return Vv(yd(i),l)}function yd(i,l=[]){let d=[];return j.Children.forEach(i,(o,u)=>{if(!j.isValidElement(o))return;let h=[...l,u];if(o.type===j.Fragment){d.push.apply(d,yd(o.props.children,h));return}ca(o.type===_a,`[${typeof o.type=="string"?o.type:o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),ca(!o.props.index||!o.props.children,"An index route cannot have child routes.");let p={id:o.props.id||h.join("-"),caseSensitive:o.props.caseSensitive,element:o.props.element,Component:o.props.Component,index:o.props.index,path:o.props.path,middleware:o.props.middleware,loader:o.props.loader,action:o.props.action,hydrateFallbackElement:o.props.hydrateFallbackElement,HydrateFallback:o.props.HydrateFallback,errorElement:o.props.errorElement,ErrorBoundary:o.props.ErrorBoundary,hasErrorBoundary:o.props.hasErrorBoundary===!0||o.props.ErrorBoundary!=null||o.props.errorElement!=null,shouldRevalidate:o.props.shouldRevalidate,handle:o.props.handle,lazy:o.props.lazy};o.props.children&&(p.children=yd(o.props.children,h)),d.push(p)}),d}var Ar="get",Tr="application/x-www-form-urlencoded";function zr(i){return i!=null&&typeof i.tagName=="string"}function oy(i){return zr(i)&&i.tagName.toLowerCase()==="button"}function dy(i){return zr(i)&&i.tagName.toLowerCase()==="form"}function uy(i){return zr(i)&&i.tagName.toLowerCase()==="input"}function my(i){return!!(i.metaKey||i.altKey||i.ctrlKey||i.shiftKey)}function hy(i,l){return i.button===0&&(!l||l==="_self")&&!my(i)}var br=null;function py(){if(br===null)try{new FormData(document.createElement("form"),0),br=!1}catch{br=!0}return br}var fy=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function id(i){return i!=null&&!fy.has(i)?(ft(!1,`"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Tr}"`),null):i}function gy(i,l){let d,o,u,h,p;if(dy(i)){let x=i.getAttribute("action");o=x?Wt(x,l):null,d=i.getAttribute("method")||Ar,u=id(i.getAttribute("enctype"))||Tr,h=new FormData(i)}else if(oy(i)||uy(i)&&(i.type==="submit"||i.type==="image")){let x=i.form;if(x==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let y=i.getAttribute("formaction")||x.getAttribute("action");if(o=y?Wt(y,l):null,d=i.getAttribute("formmethod")||x.getAttribute("method")||Ar,u=id(i.getAttribute("formenctype"))||id(x.getAttribute("enctype"))||Tr,h=new FormData(x,i),!py()){let{name:f,type:b,value:v}=i;if(b==="image"){let A=f?`${f}.`:"";h.append(`${A}x`,"0"),h.append(`${A}y`,"0")}else f&&h.append(f,v)}}else{if(zr(i))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');d=Ar,o=null,u=Tr,p=i}return h&&u==="text/plain"&&(p=h,h=void 0),{action:o,method:d.toLowerCase(),encType:u,formData:h,body:p}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Od(i,l){if(i===!1||i===null||typeof i>"u")throw new Error(l)}function xy(i,l,d){let o=typeof i=="string"?new URL(i,typeof window>"u"?"server://singlefetch/":window.location.origin):i;return o.pathname==="/"?o.pathname=`_root.${d}`:l&&Wt(o.pathname,l)==="/"?o.pathname=`${l.replace(/\/$/,"")}/_root.${d}`:o.pathname=`${o.pathname.replace(/\/$/,"")}.${d}`,o}async function by(i,l){if(i.id in l)return l[i.id];try{let d=await import(i.module);return l[i.id]=d,d}catch(d){return console.error(`Error loading route module \`${i.module}\`, reloading page...`),console.error(d),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function jy(i){return i==null?!1:i.href==null?i.rel==="preload"&&typeof i.imageSrcSet=="string"&&typeof i.imageSizes=="string":typeof i.rel=="string"&&typeof i.href=="string"}async function vy(i,l,d){let o=await Promise.all(i.map(async u=>{let h=l.routes[u.route.id];if(h){let p=await by(h,d);return p.links?p.links():[]}return[]}));return _y(o.flat(1).filter(jy).filter(u=>u.rel==="stylesheet"||u.rel==="preload").map(u=>u.rel==="stylesheet"?{...u,rel:"prefetch",as:"style"}:{...u,rel:"prefetch"}))}function rf(i,l,d,o,u,h){let p=(y,f)=>d[f]?y.route.id!==d[f].route.id:!0,x=(y,f)=>d[f].pathname!==y.pathname||d[f].route.path?.endsWith("*")&&d[f].params["*"]!==y.params["*"];return h==="assets"?l.filter((y,f)=>p(y,f)||x(y,f)):h==="data"?l.filter((y,f)=>{let b=o.routes[y.route.id];if(!b||!b.hasLoader)return!1;if(p(y,f)||x(y,f))return!0;if(y.route.shouldRevalidate){let v=y.route.shouldRevalidate({currentUrl:new URL(u.pathname+u.search+u.hash,window.origin),currentParams:d[0]?.params||{},nextUrl:new URL(i,window.origin),nextParams:y.params,defaultShouldRevalidate:!0});if(typeof v=="boolean")return v}return!0}):[]}function yy(i,l,{includeHydrateFallback:d}={}){return Ny(i.map(o=>{let u=l.routes[o.route.id];if(!u)return[];let h=[u.module];return u.clientActionModule&&(h=h.concat(u.clientActionModule)),u.clientLoaderModule&&(h=h.concat(u.clientLoaderModule)),d&&u.hydrateFallbackModule&&(h=h.concat(u.hydrateFallbackModule)),u.imports&&(h=h.concat(u.imports)),h}).flat(1))}function Ny(i){return[...new Set(i)]}function ky(i){let l={},d=Object.keys(i).sort();for(let o of d)l[o]=i[o];return l}function _y(i,l){let d=new Set;return new Set(l),i.reduce((o,u)=>{let h=JSON.stringify(ky(u));return d.has(h)||(d.add(h),o.push({key:h,link:u})),o},[])}function ug(){let i=j.useContext(Gs);return Od(i,"You must render this element inside a <DataRouterContext.Provider> element"),i}function Sy(){let i=j.useContext(Ur);return Od(i,"You must render this element inside a <DataRouterStateContext.Provider> element"),i}var Ld=j.createContext(void 0);Ld.displayName="FrameworkContext";function mg(){let i=j.useContext(Ld);return Od(i,"You must render this element inside a <HydratedRouter> element"),i}function wy(i,l){let d=j.useContext(Ld),[o,u]=j.useState(!1),[h,p]=j.useState(!1),{onFocus:x,onBlur:y,onMouseEnter:f,onMouseLeave:b,onTouchStart:v}=l,A=j.useRef(null);j.useEffect(()=>{if(i==="render"&&p(!0),i==="viewport"){let M=_=>{_.forEach(E=>{p(E.isIntersecting)})},H=new IntersectionObserver(M,{threshold:.5});return A.current&&H.observe(A.current),()=>{H.disconnect()}}},[i]),j.useEffect(()=>{if(o){let M=setTimeout(()=>{p(!0)},100);return()=>{clearTimeout(M)}}},[o]);let P=()=>{u(!0)},w=()=>{u(!1),p(!1)};return d?i!=="intent"?[h,A,{}]:[h,A,{onFocus:Gi(x,P),onBlur:Gi(y,w),onMouseEnter:Gi(f,P),onMouseLeave:Gi(b,w),onTouchStart:Gi(v,P)}]:[!1,A,{}]}function Gi(i,l){return d=>{i&&i(d),d.defaultPrevented||l(d)}}function Ay({page:i,...l}){let{router:d}=ug(),o=j.useMemo(()=>tg(d.routes,i,d.basename),[d.routes,i,d.basename]);return o?j.createElement(Ey,{page:i,matches:o,...l}):null}function Ty(i){let{manifest:l,routeModules:d}=mg(),[o,u]=j.useState([]);return j.useEffect(()=>{let h=!1;return vy(i,l,d).then(p=>{h||u(p)}),()=>{h=!0}},[i,l,d]),o}function Ey({page:i,matches:l,...d}){let o=jt(),{manifest:u,routeModules:h}=mg(),{basename:p}=ug(),{loaderData:x,matches:y}=Sy(),f=j.useMemo(()=>rf(i,l,y,u,o,"data"),[i,l,y,u,o]),b=j.useMemo(()=>rf(i,l,y,u,o,"assets"),[i,l,y,u,o]),v=j.useMemo(()=>{if(i===o.pathname+o.search+o.hash)return[];let w=new Set,M=!1;if(l.forEach(_=>{let E=u.routes[_.route.id];!E||!E.hasLoader||(!f.some(L=>L.route.id===_.route.id)&&_.route.id in x&&h[_.route.id]?.shouldRevalidate||E.hasClientLoader?M=!0:w.add(_.route.id))}),w.size===0)return[];let H=xy(i,p,"data");return M&&w.size>0&&H.searchParams.set("_routes",l.filter(_=>w.has(_.route.id)).map(_=>_.route.id).join(",")),[H.pathname+H.search]},[p,x,o,u,f,l,i,h]),A=j.useMemo(()=>yy(b,u),[b,u]),P=Ty(b);return j.createElement(j.Fragment,null,v.map(w=>j.createElement("link",{key:w,rel:"prefetch",as:"fetch",href:w,...d})),A.map(w=>j.createElement("link",{key:w,rel:"modulepreload",href:w,...d})),P.map(({key:w,link:M})=>j.createElement("link",{key:w,nonce:d.nonce,...M})))}function Cy(...i){return l=>{i.forEach(d=>{typeof d=="function"?d(l):d!=null&&(d.current=l)})}}var hg=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{hg&&(window.__reactRouterVersion="7.9.3")}catch{}function My({basename:i,children:l,window:d}){let o=j.useRef();o.current==null&&(o.current=bv({window:d,v5Compat:!0}));let u=o.current,[h,p]=j.useState({action:u.action,location:u.location}),x=j.useCallback(y=>{j.startTransition(()=>p(y))},[p]);return j.useLayoutEffect(()=>u.listen(x),[u,x]),j.createElement(ry,{basename:i,children:l,location:h.location,navigationType:h.action,navigator:u})}var pg=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ve=j.forwardRef(function({onClick:l,discover:d="render",prefetch:o="none",relative:u,reloadDocument:h,replace:p,state:x,target:y,to:f,preventScrollReset:b,viewTransition:v,...A},P){let{basename:w}=j.useContext(xt),M=typeof f=="string"&&pg.test(f),H,_=!1;if(typeof f=="string"&&M&&(H=f,hg))try{let ye=new URL(window.location.href),he=f.startsWith("//")?new URL(ye.protocol+f):new URL(f),Oe=Wt(he.pathname,w);he.origin===ye.origin&&Oe!=null?f=Oe+he.search+he.hash:_=!0}catch{ft(!1,`<Link to="${f}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}let E=Gv(f,{relative:u}),[L,q,oe]=wy(o,A),re=Ly(f,{replace:p,state:x,target:y,preventScrollReset:b,relative:u,viewTransition:v});function te(ye){l&&l(ye),ye.defaultPrevented||re(ye)}let ge=j.createElement("a",{...A,...oe,href:H||E,onClick:_||h?l:te,ref:Cy(P,q),target:y,"data-discover":!M&&d==="render"?"true":void 0});return L&&!M?j.createElement(j.Fragment,null,ge,j.createElement(Ay,{page:E})):ge});Ve.displayName="Link";var Ry=j.forwardRef(function({"aria-current":l="page",caseSensitive:d=!1,className:o="",end:u=!1,style:h,to:p,viewTransition:x,children:y,...f},b){let v=nl(p,{relative:f.relative}),A=jt(),P=j.useContext(Ur),{navigator:w,basename:M}=j.useContext(xt),H=P!=null&&Fy(v)&&x===!0,_=w.encodeLocation?w.encodeLocation(v).pathname:v.pathname,E=A.pathname,L=P&&P.navigation&&P.navigation.location?P.navigation.location.pathname:null;d||(E=E.toLowerCase(),L=L?L.toLowerCase():null,_=_.toLowerCase()),L&&M&&(L=Wt(L,M)||L);const q=_!=="/"&&_.endsWith("/")?_.length-1:_.length;let oe=E===_||!u&&E.startsWith(_)&&E.charAt(q)==="/",re=L!=null&&(L===_||!u&&L.startsWith(_)&&L.charAt(_.length)==="/"),te={isActive:oe,isPending:re,isTransitioning:H},ge=oe?l:void 0,ye;typeof o=="function"?ye=o(te):ye=[o,oe?"active":null,re?"pending":null,H?"transitioning":null].filter(Boolean).join(" ");let he=typeof h=="function"?h(te):h;return j.createElement(Ve,{...f,"aria-current":ge,className:ye,ref:b,style:he,to:p,viewTransition:x},typeof y=="function"?y(te):y)});Ry.displayName="NavLink";var Dy=j.forwardRef(({discover:i="render",fetcherKey:l,navigate:d,reloadDocument:o,replace:u,state:h,method:p=Ar,action:x,onSubmit:y,relative:f,preventScrollReset:b,viewTransition:v,...A},P)=>{let w=zy(),M=By(x,{relative:f}),H=p.toLowerCase()==="get"?"get":"post",_=typeof x=="string"&&pg.test(x),E=L=>{if(y&&y(L),L.defaultPrevented)return;L.preventDefault();let q=L.nativeEvent.submitter,oe=q?.getAttribute("formmethod")||p;w(q||L.currentTarget,{fetcherKey:l,method:oe,navigate:d,replace:u,state:h,relative:f,preventScrollReset:b,viewTransition:v})};return j.createElement("form",{ref:P,method:H,action:M,onSubmit:o?y:E,...A,"data-discover":!_&&i==="render"?"true":void 0})});Dy.displayName="Form";function Oy(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function fg(i){let l=j.useContext(Gs);return ca(l,Oy(i)),l}function Ly(i,{target:l,replace:d,state:o,preventScrollReset:u,relative:h,viewTransition:p}={}){let x=Ys(),y=jt(),f=nl(i,{relative:h});return j.useCallback(b=>{if(hy(b,l)){b.preventDefault();let v=d!==void 0?d:Vi(y)===Vi(f);x(i,{replace:v,state:o,preventScrollReset:u,relative:h,viewTransition:p})}},[y,x,f,d,o,l,i,u,h,p])}var Py=0,Uy=()=>`__${String(++Py)}__`;function zy(){let{router:i}=fg("useSubmit"),{basename:l}=j.useContext(xt),d=ny();return j.useCallback(async(o,u={})=>{let{action:h,method:p,encType:x,formData:y,body:f}=gy(o,l);if(u.navigate===!1){let b=u.fetcherKey||Uy();await i.fetch(b,d,u.action||h,{preventScrollReset:u.preventScrollReset,formData:y,body:f,formMethod:u.method||p,formEncType:u.encType||x,flushSync:u.flushSync})}else await i.navigate(u.action||h,{preventScrollReset:u.preventScrollReset,formData:y,body:f,formMethod:u.method||p,formEncType:u.encType||x,replace:u.replace,state:u.state,fromRouteId:d,flushSync:u.flushSync,viewTransition:u.viewTransition})},[i,l,d])}function By(i,{relative:l}={}){let{basename:d}=j.useContext(xt),o=j.useContext(bt);ca(o,"useFormAction must be used inside a RouteContext");let[u]=o.matches.slice(-1),h={...nl(i||".",{relative:l})},p=jt();if(i==null){h.search=p.search;let x=new URLSearchParams(h.search),y=x.getAll("index");if(y.some(b=>b==="")){x.delete("index"),y.filter(v=>v).forEach(v=>x.append("index",v));let b=x.toString();h.search=b?`?${b}`:""}}return(!i||i===".")&&u.route.index&&(h.search=h.search?h.search.replace(/^\?/,"?index&"):"?index"),d!=="/"&&(h.pathname=h.pathname==="/"?d:Zt([d,h.pathname])),Vi(h)}function Fy(i,{relative:l}={}){let d=j.useContext(lg);ca(d!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:o}=fg("useViewTransitionState"),u=nl(i,{relative:l});if(!d.isTransitioning)return!1;let h=Wt(d.currentLocation.pathname,o)||d.currentLocation.pathname,p=Wt(d.nextLocation.pathname,o)||d.nextLocation.pathname;return Mr(u.pathname,p)!=null||Mr(u.pathname,h)!=null}var gg=Mf();const xg=j.createContext(),Wa=()=>j.useContext(xg),Hy=({children:i})=>{const[l,d]=j.useState(null),[o,u]=j.useState(!0);j.useEffect(()=>{h()},[]);const h=async()=>{try{const b=localStorage.getItem("token"),v=localStorage.getItem("user");b&&v&&((await de.get("/api/auth/check",{headers:{Authorization:`Bearer ${b}`}})).data.success?(d(JSON.parse(v)),de.defaults.headers.common.Authorization=`Bearer ${b}`):(localStorage.removeItem("token"),localStorage.removeItem("user"),delete de.defaults.headers.common.Authorization))}catch(b){console.error("Auth check error:",b),localStorage.removeItem("token"),localStorage.removeItem("user"),delete de.defaults.headers.common.Authorization}finally{u(!1)}},f={user:l,login:async(b,v,A=!1)=>{try{const P=A?"/api/auth/admin/login":"/api/auth/login",w=await de.post(P,{email:A?void 0:b,username:A?b:void 0,password:v});if(w.data.success){const{token:M,user:H}=w.data.data;return localStorage.setItem("token",M),localStorage.setItem("user",JSON.stringify(H)),de.defaults.headers.common.Authorization=`Bearer ${M}`,d(H),{success:!0,user:H}}else return{success:!1,message:w.data.message}}catch(P){return{success:!1,message:P.response?.data?.message||"Login failed"}}},register:async b=>{try{const v=await de.post("/api/auth/register",b);if(v.data.success){const{token:A,user:P}=v.data.data;return localStorage.setItem("token",A),localStorage.setItem("user",JSON.stringify(P)),de.defaults.headers.common.Authorization=`Bearer ${A}`,d(P),{success:!0,user:P}}else return{success:!1,message:v.data.message}}catch(v){return{success:!1,message:v.response?.data?.message||"Registration failed"}}},logout:async()=>{try{await de.post("/api/auth/logout")}catch(b){console.error("Logout error:",b)}finally{localStorage.removeItem("token"),localStorage.removeItem("user"),delete de.defaults.headers.common.Authorization,d(null)}},loading:o,isAuthenticated:!!l,isAdmin:l?.user_type==="admin"||l?.role==="admin",isParticipant:l?.user_type==="participant"};return e.jsx(xg.Provider,{value:f,children:i})},Xt="https://www.fitalenta.co.id/",Iy=()=>{const{user:i,logout:l,isAuthenticated:d,isAdmin:o,loading:u}=Wa(),h=Ys(),p=jt(),[x,y]=j.useState(!1),[f,b]=j.useState(!1),[v,A]=j.useState(!1),P=p.pathname==="/",w=p.pathname==="/programs",M=p.pathname==="/login",H=p.pathname==="/register",_=!P&&!w;j.useEffect(()=>{const te=()=>{b(window.scrollY>40)};return te(),window.addEventListener("scroll",te,{passive:!0}),()=>{window.removeEventListener("scroll",te)}},[]),j.useEffect(()=>{A(!1)},[p.pathname]);const E=j.useCallback(te=>te==="/"?p.pathname==="/":p.pathname.startsWith(te),[p.pathname]),L=async()=>{try{await l()}catch(te){console.error("Logout error:",te)}finally{h("/")}},q=()=>{A(!1)},oe=te=>{if(d&&!o){te.preventDefault(),q(),h("/dashboard");return}q()},re=(P||w)&&!f&&!v;return u?e.jsxs(e.Fragment,{children:[e.jsx("header",{className:`\r
            fitalenta-header\r
            fitalenta-header-solid\r
          `,children:e.jsx("nav",{className:"fitalenta-navbar",children:e.jsx("div",{className:`\r
                fitalenta-navbar-inner\r
                fitalenta-loading-inner\r
              `,children:e.jsxs("div",{className:"fitalenta-loading",children:[e.jsx("div",{className:`\r
                    spinner-border\r
                    spinner-border-sm\r
                  `,role:"status","aria-hidden":"true"}),e.jsx("span",{children:"Loading..."})]})})})}),_&&e.jsx("div",{className:"fitalenta-header-spacer","aria-hidden":"true"}),e.jsx(of,{})]}):e.jsxs(e.Fragment,{children:[e.jsx("header",{className:`fitalenta-header ${re?"fitalenta-header-transparent":"fitalenta-header-solid"} ${w?"fitalenta-header-program":""} ${M?"fitalenta-header-login":""} ${H?"fitalenta-header-register":""}`,children:e.jsx("nav",{className:"fitalenta-navbar",children:e.jsxs("div",{className:"fitalenta-navbar-inner",children:[e.jsx("a",{href:`${Xt}/`,className:"fitalenta-brand",onClick:oe,"aria-label":d&&!o?"FITALENTA Dashboard":"FITALENTA Home",children:x?e.jsx("span",{children:"FITALENTA"}):e.jsx("img",{src:"/images/logo/logoputih.png",alt:"FITALENTA",onError:()=>y(!0)})}),e.jsxs("button",{type:"button",className:`fitalenta-menu-toggle ${v?"active":""}`,onClick:()=>A(te=>!te),"aria-label":"Buka menu","aria-expanded":v,children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsxs("div",{className:`fitalenta-navbar-content ${v?"show":""}`,children:[!d&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fitalenta-nav-menu",children:[e.jsx("a",{href:`${Xt}/`,onClick:q,children:"Home"}),e.jsx("a",{href:`${Xt}/events`,onClick:q,children:"Event"}),e.jsx("a",{href:`${Xt}/services`,onClick:q,children:"Services"}),e.jsx(Ve,{to:"/programs",onClick:q,className:E("/programs")?"active":"",children:"Program"}),e.jsx("a",{href:`${Xt}/articles`,onClick:q,children:"Blog"}),e.jsx("a",{href:`${Xt}/gallery`,onClick:q,children:"Gallery"}),e.jsx("a",{href:`${Xt}/about`,onClick:q,children:"About"}),e.jsx("a",{href:`${Xt}/contact`,onClick:q,children:"Contact"})]}),e.jsxs("div",{className:"fitalenta-auth-menu",children:[e.jsx(Ve,{to:"/login",onClick:q,className:`fitalenta-login-link ${E("/login")?"active":""}`,children:"Login"}),e.jsx(Ve,{to:"/register",onClick:q,className:`fitalenta-register-btn ${E("/register")?"active":""}`,children:"Registrasi"})]})]}),d&&!o&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fitalenta-nav-menu",children:[e.jsx(Ve,{to:"/dashboard",onClick:q,className:E("/dashboard")?"active":"",children:"Dashboard"}),e.jsx(Ve,{to:"/programs",onClick:q,className:E("/programs")?"active":"",children:"Program"}),e.jsx(Ve,{to:"/registration",onClick:q,className:E("/registration")?"active":"",children:"Pendaftaran"}),e.jsx(Ve,{to:"/payment",onClick:q,className:E("/payment")?"active":"",children:"Pembayaran"})]}),e.jsx(cf,{user:i,isAdmin:!1,handleLogout:L,closeMenu:q})]}),d&&o&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fitalenta-nav-menu",children:[e.jsx("a",{href:`${Xt}/`,onClick:q,children:"Home"}),e.jsx(Ve,{to:"/admin",onClick:q,className:p.pathname==="/admin"?"active":"",children:"Dashboard"}),e.jsx(Ve,{to:"/admin/payments",onClick:q,className:E("/admin/payments")?"active":"",children:"Pembayaran"}),e.jsx(Ve,{to:"/admin/selection",onClick:q,className:E("/admin/selection")?"active":"",children:"Seleksi"}),e.jsx(Ve,{to:"/admin/placement",onClick:q,className:E("/admin/placement")?"active":"",children:"Penyaluran"}),e.jsx(Ve,{to:"/admin/financial-reports",onClick:q,className:E("/admin/financial-reports")?"active":"",children:"Laporan"})]}),e.jsx(cf,{user:i,isAdmin:!0,handleLogout:L,closeMenu:q})]})]})]})})}),_&&e.jsx("div",{className:"fitalenta-header-spacer","aria-hidden":"true"}),e.jsx(of,{})]})},cf=({user:i,isAdmin:l,handleLogout:d,closeMenu:o})=>e.jsxs("div",{className:"dropdown fitalenta-user",children:[e.jsxs("button",{className:`\r
          fitalenta-user-btn\r
          dropdown-toggle\r
        `,type:"button","data-bs-toggle":"dropdown","aria-expanded":"false",children:[e.jsx("span",{className:"fitalenta-avatar",children:e.jsx("i",{className:"bi bi-person-fill"})}),e.jsx("span",{className:"fitalenta-user-name",children:i?.full_name||i?.email||"User"}),l&&e.jsx("span",{className:"fitalenta-admin-badge",children:"Admin"})]}),e.jsx("ul",{className:`\r
          dropdown-menu\r
          dropdown-menu-end\r
          shadow\r
          border-0\r
          mt-2\r
        `,children:e.jsx("li",{children:e.jsxs("button",{type:"button",className:`\r
              dropdown-item\r
              text-danger\r
              py-2\r
            `,onClick:()=>{o(),d()},children:[e.jsx("i",{className:"bi bi-box-arrow-right me-2"}),"Logout"]})})})]}),of=()=>e.jsx("style",{children:`

      @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');


      :root {
        --fitalenta-primary: #00294B;
        --fitalenta-secondary: #E8491D;
        --fitalenta-white: #ffffff;
      }


      /* =====================================
         HEADER
      ====================================== */

      .fitalenta-header {
        position: fixed !important;

        top: 0 !important;
        left: 0 !important;
        right: 0 !important;

        z-index: 1050;

        width: 100%;

        margin: 0 !important;
        padding: 0 !important;

        color: #ffffff;

        transition:
          background .25s ease,
          box-shadow .25s ease;
      }


      .fitalenta-header-solid {
        background:
          #00294B !important;

        box-shadow:
          0 6px 22px
          rgba(
            0,
            0,
            0,
            .10
          ) !important;
      }


      /*
        BENAR-BENAR TRANSPARAN
        saat Home / Programs
        masih berada di paling atas.
      */

      .fitalenta-header-transparent {
        background:
          transparent !important;

        background-color:
          transparent !important;

        background-image:
          none !important;

        box-shadow:
          none !important;

        backdrop-filter:
          none !important;

        -webkit-backdrop-filter:
          none !important;
      }


      /*
        Pastikan elemen di dalam navbar
        juga tidak punya background sendiri.
      */

      .fitalenta-header-transparent
      .fitalenta-navbar,

      .fitalenta-header-transparent
      .fitalenta-navbar-inner {
        background:
          transparent !important;

        background-color:
          transparent !important;

        background-image:
          none !important;
      }


      /* =====================================
         SPACER
      ====================================== */

      .fitalenta-header-spacer {
        width: 100%;

        height: 96px;

        display: block;

        flex-shrink: 0;

        pointer-events: none;
      }


      /* =====================================
         NAVBAR
      ====================================== */

      .fitalenta-navbar {
        width: 100%;

        margin: 0;

        padding: 0;

        background:
          transparent;

        font-family:
          "Figtree",
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }


      .fitalenta-navbar-inner {
        width:
          min(
            1180px,
            calc(
              100% - 40px
            )
          );

        min-height: 96px;

        margin:
          0 auto;

        padding:
          0;

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          18px;

        position:
          relative;

        background:
          transparent;
      }


      /* =====================================
         LOGO
      ====================================== */

      .fitalenta-brand {
        position:
          relative;

        width:
          175px;

        height:
          64px;

        display:
          flex;

        align-items:
          center;

        flex-shrink:
          0;

        color:
          #ffffff;

        text-decoration:
          none;

        font-size:
          20px;

        font-weight:
          800;

        letter-spacing:
          .5px;

        overflow:
          visible;
      }


      .fitalenta-brand:hover {
        color:
          #ffffff;
      }


      .fitalenta-brand img {
        display:
          block;

        width:
          175px;

        height:
          64px;

        max-width:
          none;

        object-fit:
          contain;

        object-position:
          left center;

        transform:
          scale(1.75);

        transform-origin:
          left center;

        transition:
          transform
          .25s
          ease;
      }


      .fitalenta-brand:hover img {
        transform:
          scale(1.82);
      }


      /* =====================================
         NAV CONTENT
      ====================================== */

      .fitalenta-navbar-content {
        display:
          flex;

        flex:
          1;

        align-items:
          center;

        justify-content:
          flex-end;

        gap:
          14px;

        min-width:
          0;
      }


      .fitalenta-nav-menu,
      .fitalenta-auth-menu {
        display:
          flex;

        align-items:
          center;

        gap:
          2px;

        min-width:
          0;
      }


      /* =====================================
         NAV LINKS
      ====================================== */

      .fitalenta-nav-menu a,
      .fitalenta-login-link {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          42px;

        padding:
          0 11px;

        border-radius:
          9px;

        color:
          #ffffff;

        text-decoration:
          none;

        font-size:
          14px;

        font-weight:
          600;

        line-height:
          1;

        white-space:
          nowrap;

        transition:
          background
          .2s
          ease,
          color
          .2s
          ease;
      }


      .fitalenta-nav-menu a:hover,
      .fitalenta-nav-menu a.active,
      .fitalenta-login-link:hover,
      .fitalenta-login-link.active {
        background:
          rgba(
            255,
            255,
            255,
            .10
          );
      }


      .fitalenta-nav-menu a.active,
      .fitalenta-login-link.active {
        color:
          #E8491D;
      }


      /* =====================================
         AUTH
      ====================================== */

      .fitalenta-auth-menu {
        flex-shrink:
          0;

        gap:
          5px;
      }


      .fitalenta-register-btn {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          44px;

        padding:
          0 20px;

        margin-left:
          0;

        border-radius:
          9px;

        background:
          #ffffff;

        color:
          #00294B;

        text-decoration:
          none;

        font-size:
          14px;

        font-weight:
          700;

        box-shadow:
          0 6px 18px
          rgba(
            0,
            0,
            0,
            .10
          );

        transition:
          transform
          .2s
          ease,
          background
          .2s
          ease,
          color
          .2s
          ease;

        white-space:
          nowrap;
      }


      .fitalenta-register-btn:hover,
      .fitalenta-register-btn.active {
        background:
          #E8491D;

        color:
          #ffffff;

        transform:
          translateY(-1px);
      }


      /* =====================================
         USER
      ====================================== */

      .fitalenta-user {
        position:
          relative;

        flex-shrink:
          0;
      }


      .fitalenta-user-btn {
        min-height:
          44px;

        display:
          flex;

        align-items:
          center;

        gap:
          9px;

        padding:
          6px 12px 6px 7px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .15
          );

        border-radius:
          10px;

        background:
          rgba(
            255,
            255,
            255,
            .10
          );

        color:
          #ffffff;

        cursor:
          pointer;

        transition:
          all
          .25s
          ease;
      }


      .fitalenta-user-btn:hover {
        background:
          rgba(
            255,
            255,
            255,
            .18
          );
      }


      .fitalenta-avatar {
        width:
          32px;

        height:
          32px;

        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          50%;

        background:
          #ffffff;

        color:
          #00294B;
      }


      .fitalenta-user-name {
        max-width:
          135px;

        overflow:
          hidden;

        white-space:
          nowrap;

        text-overflow:
          ellipsis;

        font-size:
          13px;

        font-weight:
          600;
      }


      .fitalenta-admin-badge {
        padding:
          3px 7px;

        border-radius:
          20px;

        background:
          #E8491D;

        color:
          #ffffff;

        font-size:
          10px;

        font-weight:
          700;
      }


      /* =====================================
         MOBILE BUTTON
      ====================================== */

      .fitalenta-menu-toggle {
        display:
          none;

        width:
          44px;

        height:
          44px;

        border:
          0;

        border-radius:
          10px;

        align-items:
          center;

        justify-content:
          center;

        flex-direction:
          column;

        gap:
          5px;

        background:
          rgba(
            255,
            255,
            255,
            .10
          );

        color:
          #ffffff;

        cursor:
          pointer;
      }


      .fitalenta-menu-toggle span {
        display:
          block;

        width:
          21px;

        height:
          2px;

        border-radius:
          2px;

        background:
          #ffffff;

        transition:
          all
          .25s
          ease;
      }


      .fitalenta-menu-toggle.active
      span:nth-child(1) {
        transform:
          translateY(7px)
          rotate(45deg);
      }


      .fitalenta-menu-toggle.active
      span:nth-child(2) {
        opacity:
          0;
      }


      .fitalenta-menu-toggle.active
      span:nth-child(3) {
        transform:
          translateY(-7px)
          rotate(-45deg);
      }


      /* =====================================
         LOADING
      ====================================== */

      .fitalenta-loading-inner {
        justify-content:
          center;
      }


      .fitalenta-loading {
        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        color:
          #ffffff;
      }


      /* =====================================
         TABLET / MOBILE
      ====================================== */

      @media (
        max-width: 799px
      ) {

        .fitalenta-header-spacer {
          height:
            80px;
        }


        .fitalenta-navbar-inner {
          width:
            calc(
              100% - 28px
            );

          min-height:
            80px;
        }


        .fitalenta-brand {
          width:
            150px;

          height:
            58px;
        }


        .fitalenta-brand img {
          width:
            150px;

          height:
            58px;

          transform:
            scale(1.62);

          transform-origin:
            left center;
        }


        .fitalenta-brand:hover img {
          transform:
            scale(1.67);
        }


        .fitalenta-menu-toggle {
          display:
            flex;
        }


        .fitalenta-navbar-content {
          display:
            none;

          position:
            absolute;

          top:
            80px;

          left:
            -14px;

          width:
            calc(
              100% + 28px
            );

          padding:
            15px
            18px
            20px;

          flex-direction:
            column;

          align-items:
            stretch;

          gap:
            14px;

          background:
            rgba(
              0,
              41,
              75,
              .99
            );

          border-top:
            1px
            solid
            rgba(
              255,
              255,
              255,
              .10
            );

          box-shadow:
            0 16px 30px
            rgba(
              0,
              0,
              0,
              .18
            );

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);
        }


        .fitalenta-navbar-content.show {
          display:
            flex;
        }


        .fitalenta-nav-menu,
        .fitalenta-auth-menu {
          width:
            100%;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            stretch;

          gap:
            4px;
        }


        .fitalenta-nav-menu a,
        .fitalenta-login-link {
          width:
            100%;

          justify-content:
            flex-start;

          min-height:
            auto;

          padding:
            13px 14px;
        }


        .fitalenta-register-btn {
          width:
            100%;

          margin:
            4px 0 0;
        }


        .fitalenta-user {
          width:
            100%;
        }


        .fitalenta-user-btn {
          width:
            100%;

          justify-content:
            flex-start;
        }
      }


      /* =====================================
         SMALL MOBILE
      ====================================== */

      @media (
        max-width: 480px
      ) {

        .fitalenta-header-spacer {
          height:
            76px;
        }


        .fitalenta-navbar-inner {
          width:
            calc(
              100% - 24px
            );

          min-height:
            76px;
        }


        .fitalenta-brand {
          width:
            138px;

          height:
            54px;
        }


        .fitalenta-brand img {
          width:
            138px;

          height:
            54px;

          transform:
            scale(1.55);

          transform-origin:
            left center;
        }


        .fitalenta-brand:hover img {
          transform:
            scale(1.60);
        }


        .fitalenta-navbar-content {
          top:
            76px;

          left:
            -12px;

          width:
            calc(
              100% + 24px
            );
        }
      }

    `}),Ky=()=>e.jsx("footer",{className:"footer-section",children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"row footer-row",children:[e.jsxs("div",{className:"col-lg-3 col-md-4",children:[e.jsx("h5",{className:"footer-title",children:"FITALENTA"}),e.jsxs("p",{className:"footer-address",children:["Gedung Science Techno Park ITB",e.jsx("br",{}),"Jl. Ganesha No.15E,",e.jsx("br",{}),"Lb. Siliwangi, Kec. Coblong",e.jsx("br",{}),"Bandung 40132"]})]}),e.jsxs("div",{className:"col-lg-3 col-md-4",children:[e.jsx("h5",{className:"footer-title",children:"SOSIAL MEDIA"}),e.jsxs("ul",{className:"footer-social",children:[e.jsxs("li",{children:[e.jsx("i",{className:"bi bi-instagram"}),e.jsx("a",{href:"https://www.instagram.com/fitalenta.id/",target:"_blank",rel:"noreferrer",children:"fitalenta.id"})]}),e.jsxs("li",{children:[e.jsx("i",{className:"bi bi-whatsapp"}),e.jsx("a",{href:"https://wa.me/6281110119273",target:"_blank",rel:"noreferrer",children:"+62 811 1011 9273"})]})]})]}),e.jsxs("div",{className:"col-lg-4 col-md-4",children:[e.jsx("h5",{className:"footer-title",children:"OUR LOCATION"}),e.jsx("div",{className:"footer-map",children:e.jsx("iframe",{src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9732250108013!2d107.60892999999996!3d-6.893806000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e79861a09a0f%3A0x7edcd4dc41c3c5e1!2sGedung%20Science%20and%20Techno%20Park%20(STP)%20ITB!5e0!3m2!1sid!2sid!4v1786278710246!5m2!1sid!2sid",title:"FITALENTA Location",allowFullScreen:!0,loading:"lazy",referrerPolicy:"strict-origin-when-cross-origin"})})]})]}),e.jsx("hr",{className:"footer-line"}),e.jsxs("div",{className:"footer-copy",children:["© ",new Date().getFullYear(),e.jsx("strong",{children:" FITALENTA"}),". All rights reserved."]})]})}),wt=({children:i})=>e.jsxs("div",{className:"d-flex flex-column min-vh-100",children:[e.jsx(Iy,{}),e.jsx("main",{className:"flex-grow-1",children:i}),e.jsx(Ky,{})]}),ld=[{path:"/admin",icon:"bi-speedometer2",label:"Dashboard",description:"Ringkasan sistem",exact:!0},{path:"/admin/payments",icon:"bi-credit-card",label:"Manajemen Pembayaran",description:"Transaksi & invoice"},{path:"/admin/selection-and-placement",icon:"bi-clipboard-check",label:"Manajemen Seleksi & Penyaluran",description:"Seleksi dan penempatan"},{path:"/admin/financial-reports",icon:"bi-graph-up-arrow",label:"Laporan Keuangan",description:"Rekap & laporan"},{path:"/admin/programs",icon:"bi-journal-text",label:"Manajemen Program",description:"Program pelatihan"},{path:"/admin/users",icon:"bi-people",label:"Manajemen User",description:"Peserta & administrator"}],qy=({children:i})=>{const{user:l,logout:d}=Wa(),o=jt(),[u,h]=j.useState(!1),[p,x]=j.useState(typeof window<"u"?window.innerWidth<992:!1),[y,f]=j.useState(!1);j.useEffect(()=>{const L=()=>{const q=window.innerWidth<992;x(q),q||f(!1)};return L(),window.addEventListener("resize",L),()=>{window.removeEventListener("resize",L)}},[]),j.useEffect(()=>{f(!1)},[o.pathname]);const b=L=>L.exact?o.pathname===L.path:o.pathname===L.path||o.pathname.startsWith(`${L.path}/`),v=ld.find(L=>b(L))||ld[0],A=l?.full_name||l?.email||"Admin Fitalenta",w=(L=>L.split(" ").filter(Boolean).slice(0,2).map(q=>q.charAt(0).toUpperCase()).join(""))(A),M=async()=>{await d(),window.location.href="https://www.fitalenta.co.id/"},H=()=>{f(L=>!L)},_=(L=!1)=>e.jsxs("nav",{className:"admin-sidebar-navigation",children:[e.jsx("div",{className:"admin-sidebar-section-label",children:!u||L?"UTAMA":""}),e.jsx("ul",{className:"admin-sidebar-menu",children:ld.map(q=>{const oe=b(q);return e.jsx("li",{className:"admin-sidebar-menu-item",children:e.jsxs(Ve,{to:q.path,className:`admin-sidebar-menu-link ${oe?"active":""}`,title:u&&!L?q.label:void 0,onClick:()=>{L&&f(!1)},children:[e.jsx("span",{className:"admin-sidebar-menu-icon",children:e.jsx("i",{className:`bi ${q.icon}`,"aria-hidden":"true"})}),(!u||L)&&e.jsxs("span",{className:"admin-sidebar-menu-content",children:[e.jsx("strong",{children:q.label}),e.jsx("small",{children:q.description})]})]})},q.path)})})]}),E=(L=!1)=>e.jsxs("div",{className:"admin-sidebar-footer",children:[(!u||L)&&e.jsxs("div",{className:"admin-sidebar-user-summary",children:[e.jsx("div",{className:"admin-sidebar-user-avatar",children:w}),e.jsxs("div",{className:"admin-sidebar-user-copy",children:[e.jsx("strong",{children:A}),e.jsx("span",{children:"Administrator"})]})]}),e.jsxs("button",{type:"button",className:"admin-sidebar-logout",onClick:M,title:u&&!L?"Keluar Aplikasi":void 0,children:[e.jsx("span",{className:"admin-sidebar-logout-icon",children:e.jsx("i",{className:"bi bi-box-arrow-right"})}),(!u||L)&&e.jsx("span",{className:"admin-sidebar-footer-label",children:"Keluar Aplikasi"})]})]});return e.jsxs("div",{className:"admin-layout",children:[!p&&e.jsxs("aside",{className:`admin-sidebar ${u?"admin-sidebar-collapsed":""}`,children:[e.jsxs("div",{className:"admin-sidebar-header",children:[e.jsxs(Ve,{to:"/admin",className:"admin-sidebar-brand",title:u?"FITALENTA Admin Management":void 0,children:[e.jsx("span",{className:"admin-sidebar-brand-icon",children:e.jsx("span",{children:"F"})}),!u&&e.jsxs("span",{className:"admin-sidebar-brand-copy",children:[e.jsx("strong",{children:"FITALENTA"}),e.jsx("small",{children:"ADMIN MANAGEMENT"})]})]}),e.jsx("button",{type:"button",className:"admin-sidebar-collapse-button",onClick:()=>h(L=>!L),"aria-label":u?"Perbesar sidebar":"Perkecil sidebar",children:e.jsx("i",{className:`bi ${u?"bi-chevron-right":"bi-chevron-left"}`})})]}),_(!1),E(!1)]}),p&&y&&e.jsx("button",{type:"button",className:"admin-mobile-sidebar-overlay",onClick:()=>f(!1),"aria-label":"Tutup menu"}),p&&e.jsxs("aside",{className:`admin-mobile-sidebar ${y?"open":""}`,children:[e.jsxs("div",{className:"admin-sidebar-header",children:[e.jsxs(Ve,{to:"/admin",className:"admin-sidebar-brand",onClick:()=>f(!1),children:[e.jsx("span",{className:"admin-sidebar-brand-icon",children:e.jsx("span",{children:"F"})}),e.jsxs("span",{className:"admin-sidebar-brand-copy",children:[e.jsx("strong",{children:"FITALENTA"}),e.jsx("small",{children:"ADMIN MANAGEMENT"})]})]}),e.jsx("button",{type:"button",className:"admin-sidebar-mobile-close",onClick:()=>f(!1),"aria-label":"Tutup menu",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),_(!0),E(!0)]}),e.jsxs("div",{className:`admin-main ${u?"admin-main-sidebar-collapsed":""}`,children:[e.jsx("header",{className:"admin-topbar",children:e.jsxs("div",{className:"admin-topbar-inner",children:[e.jsxs("div",{className:"admin-topbar-left",children:[p&&e.jsx("button",{type:"button",className:"admin-mobile-menu-button",onClick:H,"aria-label":"Buka menu",children:e.jsx("i",{className:"bi bi-list"})}),e.jsxs("div",{className:"admin-page-context",children:[e.jsx("span",{className:"admin-page-title-indicator"}),e.jsxs("div",{className:"admin-page-title-copy",children:[e.jsx("strong",{children:v.label}),e.jsx("span",{children:"FITALENTA Admin Management"})]})]})]}),e.jsx("div",{className:"admin-topbar-right",children:e.jsxs("div",{className:"dropdown",children:[e.jsxs("button",{type:"button",className:"admin-user-menu","data-bs-toggle":"dropdown","aria-expanded":"false",children:[e.jsx("span",{className:"admin-topbar-avatar",children:w}),e.jsxs("span",{className:"admin-topbar-user-info",children:[e.jsx("strong",{children:A}),e.jsx("small",{children:"Administrator"})]}),e.jsx("i",{className:"bi bi-chevron-down admin-user-menu-chevron"})]}),e.jsxs("ul",{className:"dropdown-menu dropdown-menu-end admin-user-dropdown",children:[e.jsx("li",{children:e.jsxs("div",{className:"admin-user-dropdown-header",children:[e.jsx("div",{className:"admin-user-dropdown-avatar",children:w}),e.jsxs("div",{children:[e.jsx("strong",{children:A}),e.jsx("span",{children:l?.email||"Administrator FITALENTA"})]})]})}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider"})}),e.jsx("li",{children:e.jsxs("button",{type:"button",className:"dropdown-item admin-user-dropdown-logout",onClick:M,children:[e.jsx("i",{className:"bi bi-box-arrow-right"}),"Keluar Aplikasi"]})})]})]})})]})}),e.jsx("main",{className:"admin-content-area",children:e.jsx("div",{className:"admin-content-container",children:i})}),e.jsxs("footer",{className:"admin-footer",children:[e.jsxs("span",{children:["© ",new Date().getFullYear()," ",e.jsx("strong",{children:"FITALENTA"}),". All rights reserved."]}),e.jsx("span",{children:"Admin Management Panel"})]})]})]})},df={1:"/images/home_regular.jpg",2:"/images/home_hybrid.jpg",3:"/images/home_fast_track.jpg",4:"/images/home_asrama.jpg",9:"/images/home_beasiswa.jpg",10:"/images/home_gijinkoku.jpg",11:"/images/home_korea.jpg",12:"/images/home_gijinkoku.jpg",13:"/images/home_amto.jpg",reguler:"/images/home_regular.jpg",regular:"/images/home_regular.jpg",asrama:"/images/home_asrama.jpg",hybrid:"/images/home_hybrid.jpg","fast-track":"/images/home_fast_track.jpg",fasttrack:"/images/home_fast_track.jpg",beasiswa:"/images/home_beasiswa.jpg",korea:"/images/home_korea.jpg",amto:"/images/home_amto.jpg"};function Gy(i){return i&&(df[i.id]||df[String(i.name).toLowerCase().replace(/program|\s|-/g,"")]||i.image)||"/images/hero_home.jpg"}const $y="6281110119273",Yy="Halo Fitalenta, saya tertarik dengan program FITALENTA. Mohon info pendaftaran dan langkah selanjutnya. Terima kasih!",Yn=[{id:1,name:"Rendi Adistya Rosdiyana, S.Pd.",position:"Towakai Universal Medical Service",content:"Visa Tokutei Ginou cocok banget buat yang mau coba bidang baru. Visa mudah, peluang kerja banyak (minimal ijazah SMK/sederajat)."},{id:2,name:"Taufan Himawan, S.IP., M.B.A.",position:"Trade Negotiator Specialist ASEAN – Japan",content:"Satu langkah dengan visa studi telah membuka jalan sukses berkarir di Jepang."},{id:3,name:"Laksamana Rayhan Utomo, B.E., M.Eng.",position:"Operations Manager at Hikari Asia Co., Ltd.",content:"Dari kampus ke karier internasional, Jepang adalah tempat membuktikan kemampuan terbaik."},{id:4,name:"Satria Rusdiputra, S.T., M.Eng.",position:"Research Engineer at Torishima Pump Manufacturing Co. Ltd.",content:"Kerja di Jepang sebagai Engineer, plus bisa explore Jepang bareng keluarga ke tempat-tempat seru."}],Vy=[{id:"reguler",categoryName:"Program Reguler",name:"Program Reguler",type:"Regular Program",description:"Metode pelatihan intensif pagi hingga sore untuk mempersiapkan bahasa, budaya kerja, dan kesiapan penyaluran ke Jepang.",image:"/images/home_regular.jpg",icon:"bi-mortarboard",duration:"6 bulan",training_cost:95e5,installment_plan:"3_installments",down_payment:5e6,job_matching_cost:0},{id:"asrama",categoryName:"Program Asrama",name:"Program Asrama",type:"Residential Program",description:"Metode pelatihan intensif sekaligus karantina kerja berasrama dengan pendampingan belajar dan persiapan kerja.",image:"/images/home_asrama.jpg",icon:"bi-house-door",duration:"6 bulan",training_cost:15e6,installment_plan:"3_installments",down_payment:0,job_matching_cost:0},{id:"hybrid",categoryName:"Program Hybrid",name:"Program Hybrid",type:"Flexible Learning",description:"Kombinasi kelas online dan offline untuk peserta yang membutuhkan fleksibilitas selama proses pelatihan.",image:"/images/home_hybrid.jpg",icon:"bi-laptop",duration:"6 bulan",training_cost:7e6,installment_plan:"3_installments",down_payment:0,job_matching_cost:0},{id:"fast-track",categoryName:"Program Fast Track",name:"Program Fast Track",type:"Accelerated Program",description:"Jalur ekspres bagi kandidat yang sudah memiliki sertifikat JLPT N4/JFT-A2 dan sertifikat SSW sesuai bidang.",image:"/images/home_fast_track.jpg",icon:"bi-lightning-charge",duration:"1 bulan",training_cost:3e6,installment_plan:"none",down_payment:0,job_matching_cost:0},{id:"beasiswa",categoryName:"Program Beasiswa",name:"Program Beasiswa Bahasa Jepang",type:"Scholarship Program",description:"Program studi bahasa Jepang untuk persiapan kuliah maupun karier profesional dengan pengalaman belajar di Indonesia dan Jepang.",image:"/images/home_beasiswa.jpg",icon:"bi-mortarboard-fill",duration:"6 bulan + 2 tahun",training_cost:15e6,installment_plan:"none",down_payment:0,job_matching_cost:0},{id:"korea",categoryName:"Program Korea",name:"Program Korea",type:"Korea Career Program",description:"Program persiapan bahasa Korea, budaya, dokumen, dan kesiapan peserta untuk membuka peluang studi atau karier di Korea Selatan.",image:"/images/home_korea.jpg",icon:"bi-globe-asia-australia",duration:"3 bulan",training_cost:42e5,installment_plan:"3_installments",down_payment:0,job_matching_cost:0},{id:"amto",categoryName:"AMTO",name:"Basic Certificate Category C (Avionics) - AMTO",type:"Aircraft Maintenance Training",description:"Program competency bridging bagi lulusan D3/S1 Teknik menuju kompetensi aircraft maintenance melalui pelatihan avionics.",image:"/images/home_amto.jpg",icon:"bi-tools",duration:"±6 bulan",training_cost:595e5,installment_plan:"none",down_payment:0,job_matching_cost:0}],Jy=[{id:1,icon:"bi-journal-check",title:"Pelatihan Komprehensif",description:"Program bahasa, budaya kerja, serta keterampilan yang dirancang untuk mempersiapkan peserta menghadapi dunia kerja internasional."},{id:2,icon:"bi-person-check",title:"Pendampingan Profesional",description:"Peserta didampingi mentor berpengalaman mulai dari tahap persiapan hingga proses pengembangan kompetensi."},{id:3,icon:"bi-diagram-3",title:"Jaringan Terpercaya",description:"Membangun koneksi dan kerja sama dengan lembaga serta mitra perusahaan yang mendukung peluang karier peserta."},{id:4,icon:"bi-trophy",title:"Komitmen Pada Kesuksesan",description:"Kami membangun disiplin, kompetensi, mental kerja, dan kepercayaan diri sebagai fondasi perjalanan karier peserta."}],Xy=(i="")=>String(i).trim().toLowerCase().replace(/[-_\s]+/g,""),Xi=i=>{const l=Xy(typeof i=="string"?i:i?.category_name||i?.categoryName||"");return{programregular:0,programreguler:0,regular:0,reguler:0,programasrama:1,asrama:1,programhybrid:2,hybrid:2,programfasttrack:3,fasttrack:3,programbeasiswa:4,beasiswa:4,programkorea:5,korea:5,amto:6,programamto:6}[l]??999},Qy=(i=[])=>[...i].sort((l,d)=>{const o=Xi(l),u=Xi(d);return o!==u?o-u:String(l?.name||"").localeCompare(String(d?.name||""),"id")}),Zy=i=>Xi(i)===2,Wy=i=>{if(!i)return"-";const l=i.installment_plan;if(!l||l==="none")return"Bayar Penuh";if(l==="dp"){const o=Number(i.down_payment||0);return o>0?`DP Rp ${Math.round(o).toLocaleString("id-ID")}`:"DP / Uang Muka"}const d=String(l).match(/^(\d+)_installments$/);return d?`${d[1]} Cicilan`:"-"},uf=i=>{const l=Number(i||0);return`Rp ${Math.round(Number.isFinite(l)?l:0).toLocaleString("id-ID")}`},eN=()=>{const[i,l]=j.useState([]),[d,o]=j.useState(!0),[u,h]=j.useState(""),[p,x]=j.useState(0),[y,f]=j.useState(!1),b=j.useRef(!1);j.useEffect(()=>{b.current||(b.current=!0,v())},[]);const v=async()=>{try{o(!0),h("");const _=await de.get("/api/programs",{timeout:1e4});if(_.data?.success){const E=Array.isArray(_.data.data)?_.data.data:[];l(Qy(E))}else l([]),h("Program terbaru belum dapat dimuat")}catch(_){console.error("Error fetching featured programs:",_),l([]),_.code==="ECONNABORTED"?h("Server membutuhkan waktu terlalu lama untuk merespons"):_.response?.status===429?h("Terlalu banyak permintaan. Silakan coba kembali beberapa saat lagi"):h(_.response?.data?.message||"Informasi program terbaru belum dapat dimuat")}finally{o(!1)}};j.useEffect(()=>{if(Yn.length<=1||y)return;const _=window.setInterval(()=>{x(E=>(E+1)%Yn.length)},5e3);return()=>window.clearInterval(_)},[y]);const A=j.useMemo(()=>Vy.map(_=>{const E=Xi(_),L=i.find(q=>Xi(q)===E);return{..._,category_name:_.categoryName,detailId:L?.id||null,name:_.name,description:_.description,duration:_.duration||"",training_cost:_.training_cost||0,departure_cost:_.departure_cost||0,installment_plan:_.installment_plan||"none",down_payment:_.down_payment||0,job_matching_cost:_.job_matching_cost||0,image:_.image,icon:_.icon,type:_.type}}),[i]),P=()=>{const _=`https://api.whatsapp.com/send?phone=${$y}&text=${encodeURIComponent(Yy)}`;window.open(_,"_blank","noopener,noreferrer")},w=()=>{v()},M=()=>{x(_=>(_-1+Yn.length)%Yn.length)},H=()=>{x(_=>(_+1)%Yn.length)};return e.jsxs("main",{className:"home-page",children:[e.jsxs("section",{className:"home-hero","aria-label":"FITALENTA career program",children:[e.jsx("div",{className:"home-hero-background","aria-hidden":"true"}),e.jsxs("div",{className:"home-container home-hero-container",children:[e.jsxs("div",{className:"home-hero-content",children:[e.jsxs("div",{className:"home-hero-eyebrow",children:[e.jsx("i",{className:"bi bi-stars","aria-hidden":"true"}),e.jsx("span",{children:"YOUR CAREER JOURNEY STARTS HERE"})]}),e.jsxs("h1",{children:["Build your",e.jsxs("span",{children:[" ","dream career"]})]}),e.jsx("p",{className:"home-hero-description",children:"Persiapkan perjalanan karier Anda menuju kesempatan internasional melalui pelatihan terstruktur, pendampingan profesional, dan pengembangan kompetensi bersama FITALENTA."}),e.jsxs("div",{className:"home-hero-actions",children:[e.jsxs(Ve,{to:"/register",className:"home-primary-button",children:[e.jsx("span",{children:"Mulai Sekarang"}),e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})]}),e.jsxs(Ve,{to:"/programs",className:"home-secondary-button",children:[e.jsx("i",{className:"bi bi-grid","aria-hidden":"true"}),e.jsx("span",{children:"Jelajahi Program"})]})]}),e.jsxs("div",{className:"home-hero-benefits",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-shield-check","aria-hidden":"true"}),e.jsx("span",{children:"Pendampingan terarah"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-translate","aria-hidden":"true"}),e.jsx("span",{children:"Persiapan bahasa & budaya"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-briefcase","aria-hidden":"true"}),e.jsx("span",{children:"Fokus kesiapan kerja"})]})]})]}),e.jsxs("div",{className:"home-hero-card","aria-label":"FITALENTA program summary",children:[e.jsxs("div",{className:"home-hero-card-top",children:[e.jsx("span",{className:"home-status-dot"}),e.jsx("span",{children:"FITALENTA CAREER PREPARATION"})]}),e.jsx("div",{className:"home-hero-card-icon",children:e.jsx("i",{className:"bi bi-rocket-takeoff","aria-hidden":"true"})}),e.jsx("span",{className:"home-hero-card-eyebrow",children:"PREPARE • DEVELOP • GROW"}),e.jsx("h2",{children:"Persiapkan diri untuk kesempatan yang lebih besar"}),e.jsx("p",{children:"Bangun kompetensi, kedisiplinan, pemahaman budaya, dan kesiapan profesional sebelum memasuki lingkungan kerja internasional."}),e.jsxs("div",{className:"home-hero-card-list",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-check-circle-fill","aria-hidden":"true"}),e.jsx("span",{children:"Pembelajaran terstruktur"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-check-circle-fill","aria-hidden":"true"}),e.jsx("span",{children:"Mentor dan pendamping profesional"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-check-circle-fill","aria-hidden":"true"}),e.jsx("span",{children:"Persiapan menuju dunia kerja internasional"})]})]})]})]})]}),e.jsx("section",{className:"home-about-section",children:e.jsx("div",{className:"home-container",children:e.jsxs("div",{className:"home-about-layout",children:[e.jsxs("div",{className:"home-about-content",children:[e.jsxs("div",{className:"home-section-eyebrow",children:[e.jsx("i",{className:"bi bi-building","aria-hidden":"true"}),e.jsx("span",{children:"ABOUT FITALENTA"})]}),e.jsx("h2",{children:"Mempersiapkan talenta untuk menghadapi dunia kerja global"}),e.jsx("p",{children:"FITALENTA adalah lembaga pelatihan dan penyaluran kerja yang berfokus pada persiapan serta pendampingan individu untuk mengembangkan karier internasional."}),e.jsx("p",{children:"Program kami mencakup pembelajaran bahasa, budaya, pengembangan keterampilan, pembentukan disiplin, serta kesiapan profesional sehingga peserta memiliki fondasi yang lebih kuat untuk menghadapi tantangan dunia kerja."}),e.jsxs(Ve,{to:"/contact",className:"home-text-link",children:[e.jsx("span",{children:"Kenali FITALENTA lebih dekat"}),e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})]})]}),e.jsxs("div",{className:"home-about-panel",children:[e.jsxs("div",{className:"home-about-panel-header",children:[e.jsx("div",{className:"home-about-panel-icon",children:e.jsx("i",{className:"bi bi-compass","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("span",{children:"OUR PURPOSE"}),e.jsx("h3",{children:"Menghubungkan potensi dengan peluang"})]})]}),e.jsxs("div",{className:"home-about-points",children:[e.jsxs("div",{className:"home-about-point",children:[e.jsx("span",{children:"01"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Persiapan"}),e.jsx("p",{children:"Membentuk kemampuan dasar, bahasa, budaya, dan kesiapan mental peserta."})]})]}),e.jsxs("div",{className:"home-about-point",children:[e.jsx("span",{children:"02"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Pendampingan"}),e.jsx("p",{children:"Mendukung perkembangan peserta melalui proses sistematis dan profesional."})]})]}),e.jsxs("div",{className:"home-about-point",children:[e.jsx("span",{children:"03"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Peluang"}),e.jsx("p",{children:"Membantu peserta mempersiapkan langkah menuju kesempatan karier yang lebih luas."})]})]})]})]})]})})}),e.jsx("section",{className:"home-program-section",children:e.jsxs("div",{className:"home-container",children:[e.jsxs("div",{className:"home-section-header",children:[e.jsxs("div",{className:"home-section-header-content",children:[e.jsxs("div",{className:"home-section-eyebrow",children:[e.jsx("i",{className:"bi bi-grid","aria-hidden":"true"}),e.jsx("span",{children:"OUR PROGRAMS"})]}),e.jsx("h2",{children:"Pilih jalur pembelajaran yang sesuai dengan kebutuhan Anda"}),e.jsx("p",{children:"Tujuh program FITALENTA dirancang untuk memberikan pengalaman belajar, pendampingan, dan persiapan sesuai tahap perjalanan peserta."})]}),e.jsxs(Ve,{to:"/programs",className:"home-section-action",children:[e.jsx("span",{children:"Lihat semua program"}),e.jsx("i",{className:"bi bi-arrow-up-right","aria-hidden":"true"})]})]}),u&&e.jsxs("div",{className:"home-program-notice",children:[e.jsx("div",{className:"home-program-notice-icon",children:e.jsx("i",{className:"bi bi-info-circle","aria-hidden":"true"})}),e.jsxs("div",{className:"home-program-notice-content",children:[e.jsx("strong",{children:"Informasi program terbaru belum tersedia"}),e.jsx("span",{children:"Kami tetap menampilkan gambaran program FITALENTA yang dapat Anda jelajahi."})]}),e.jsxs("button",{type:"button",onClick:w,children:[e.jsx("i",{className:"bi bi-arrow-clockwise","aria-hidden":"true"}),"Coba lagi"]})]}),e.jsx("div",{className:"home-program-grid",children:A.map((_,E)=>{const L=Zy(_),q=Number(_.job_matching_cost||0);return e.jsxs("article",{className:"home-program-card",children:[e.jsxs("div",{className:"home-program-image",children:[e.jsx("img",{src:Gy(_),alt:_.name,loading:E===0?"eager":"lazy"}),e.jsx("div",{className:"home-program-image-overlay"}),e.jsx("span",{className:"home-program-number",children:String(E+1).padStart(2,"0")}),e.jsxs("div",{className:"home-program-type",children:[e.jsx("i",{className:`bi ${_.icon}`,"aria-hidden":"true"}),e.jsx("span",{children:_.type})]})]}),e.jsxs("div",{className:"home-program-card-body",children:[d&&e.jsxs("div",{className:"home-program-syncing",children:[e.jsx("span",{className:"home-program-syncing-dot"}),"Memuat informasi terbaru"]}),e.jsx("h3",{children:_.name}),e.jsx("p",{children:_.description}),e.jsxs("div",{className:"home-program-features",children:[_.duration&&e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-clock","aria-hidden":"true"}),e.jsxs("span",{children:["Durasi"," ",_.duration]})]}),Number(_.training_cost||0)>0&&e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-wallet2","aria-hidden":"true"}),e.jsxs("span",{children:["Pelatihan"," ",uf(_.training_cost)]})]}),L&&q>0&&e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-person-workspace","aria-hidden":"true"}),e.jsxs("span",{children:["Job Matching"," ",uf(q)]})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-arrow-repeat","aria-hidden":"true"}),e.jsx("span",{children:Wy(_)})]})]}),e.jsxs(Ve,{to:_.detailId?`/program/${_.detailId}`:"/programs",className:"home-program-link",children:[e.jsx("span",{children:"Pelajari program"}),e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})]})]})]},_.id)})})]})}),e.jsx("section",{className:"home-why-section",children:e.jsxs("div",{className:"home-container",children:[e.jsxs("div",{className:"home-section-heading-centered",children:[e.jsxs("div",{className:"home-section-eyebrow",children:[e.jsx("i",{className:"bi bi-patch-check","aria-hidden":"true"}),e.jsx("span",{children:"WHY CHOOSE US"})]}),e.jsx("h2",{children:"Lebih dari sekadar pelatihan"}),e.jsx("p",{children:"Kami membangun proses persiapan yang membantu peserta berkembang secara kompetensi, mental, dan profesional."})]}),e.jsx("div",{className:"home-why-grid",children:Jy.map((_,E)=>e.jsxs("article",{className:"home-why-card",children:[e.jsxs("div",{className:"home-why-card-top",children:[e.jsx("div",{className:"home-why-icon",children:e.jsx("i",{className:`bi ${_.icon}`,"aria-hidden":"true"})}),e.jsx("span",{children:String(E+1).padStart(2,"0")})]}),e.jsx("h3",{children:_.title}),e.jsx("p",{children:_.description}),e.jsx("div",{className:"home-why-line"})]},_.id))})]})}),e.jsx("section",{className:"home-story-section",children:e.jsx("div",{className:"home-container",children:e.jsxs("div",{className:"home-story-card",children:[e.jsx("div",{className:"home-story-decoration home-story-decoration-one","aria-hidden":"true"}),e.jsx("div",{className:"home-story-decoration home-story-decoration-two","aria-hidden":"true"}),e.jsxs("div",{className:"home-story-header",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"home-story-eyebrow",children:[e.jsx("i",{className:"bi bi-chat-quote","aria-hidden":"true"}),e.jsx("span",{children:"SUCCESS STORIES"})]}),e.jsx("h2",{children:"Cerita dari perjalanan mereka"})]}),e.jsxs("div",{className:"home-story-controls",children:[e.jsx("button",{type:"button",onClick:M,"aria-label":"Testimoni sebelumnya",children:e.jsx("i",{className:"bi bi-arrow-left","aria-hidden":"true"})}),e.jsx("button",{type:"button",onClick:H,"aria-label":"Testimoni berikutnya",children:e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})})]})]}),e.jsx("div",{className:"home-story-slider",onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),onFocus:()=>f(!0),onBlur:()=>f(!1),children:e.jsx("div",{className:"home-story-track",style:{transform:`translate3d(-${p*100}%, 0, 0)`},children:Yn.map(_=>e.jsxs("article",{className:"home-story-slide",children:[e.jsx("div",{className:"home-story-quote",children:e.jsx("i",{className:"bi bi-quote","aria-hidden":"true"})}),e.jsx("blockquote",{children:_.content}),e.jsxs("div",{className:"home-story-person",children:[e.jsx("div",{className:"home-story-avatar",children:_.name.charAt(0)}),e.jsxs("div",{children:[e.jsx("strong",{children:_.name}),e.jsx("span",{children:_.position})]})]})]},_.id))})}),e.jsx("div",{className:"home-story-pagination","aria-label":"Navigasi testimoni",children:Yn.map((_,E)=>e.jsx("button",{type:"button",className:p===E?"active":"",onClick:()=>x(E),"aria-label":`Tampilkan testimoni ${E+1}`,"aria-current":p===E?"true":void 0},_.id))})]})})}),e.jsx("section",{className:"home-cta-section",children:e.jsx("div",{className:"home-container",children:e.jsxs("div",{className:"home-cta-card",children:[e.jsx("div",{className:"home-cta-decoration home-cta-decoration-one","aria-hidden":"true"}),e.jsx("div",{className:"home-cta-decoration home-cta-decoration-two","aria-hidden":"true"}),e.jsxs("div",{className:"home-cta-content",children:[e.jsx("div",{className:"home-cta-icon",children:e.jsx("i",{className:"bi bi-rocket-takeoff","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("span",{children:"READY TO START?"}),e.jsx("h2",{children:"Unlock Your Future Career Potential."}),e.jsx("p",{children:"Konsultasikan program, proses pendaftaran, jadwal, biaya, dan persyaratan bersama tim FITALENTA."})]})]}),e.jsxs("div",{className:"home-cta-actions",children:[e.jsxs("button",{type:"button",className:"home-whatsapp-button",onClick:P,"aria-label":"Hubungi FITALENTA melalui WhatsApp",children:[e.jsx("i",{className:"bi bi-whatsapp","aria-hidden":"true"}),e.jsxs("span",{children:[e.jsx("small",{children:"Konsultasi cepat"}),e.jsx("strong",{children:"Chat via WhatsApp"})]}),e.jsx("i",{className:"bi bi-arrow-up-right","aria-hidden":"true"})]}),e.jsx(Ve,{to:"/programs",className:"home-cta-program-link",children:"Lihat Program"})]})]})})})]})},qe={formatCurrency:i=>!i&&i!==0?"-":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(i),formatDateForBirthDate:i=>i?new Intl.DateTimeFormat("id-ID",{year:"numeric",month:"long",day:"numeric"}).format(new Date(i)):"-",formatDate:i=>i?new Intl.DateTimeFormat("id-ID",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(i)):"-",formatDateTime:i=>i?new Intl.DateTimeFormat("id-ID",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(i)):"-"},aN=[{key:"penyaluran",label:"Penyaluran"},{key:"pelatihan",label:"Pelatihan"},{key:"korea",label:"Korea"},{key:"amto",label:"AMTO"}],Hs=(i="")=>String(i).trim().toLowerCase().replace(/[()]/g,"").replace(/[-_\s]+/g,""),mf=i=>{const l=Hs(i?.name||"");return l.includes("reguler")||l.includes("regular")?1:l.includes("asrama")?2:l.includes("hybrid")?3:l.includes("fasttrack")||l.includes("fast")?4:l.includes("beasiswa")?5:l.includes("gijinkoku")?6:l.includes("jishusei")||l.includes("magang")?7:l.includes("ssw")||l.includes("tokutei")||l.includes("ginou")?8:l.includes("amto")?9:l.includes("hse")?10:l.includes("korea")?11:999},hf=i=>{const l=Hs(i?.category_name||"");return l.includes("penyaluran")?"penyaluran":l.includes("pelatihan")?"pelatihan":l.includes("korea")?"korea":l.includes("amto")?"amto":"unknown"},pf=i=>{const l=Hs(i?.program_format||""),d=Hs(i?.name||"");return l==="reguler"||l==="regular"?"reguler":l==="asrama"?"asrama":l==="hybrid"?"hybrid":l==="fasttrack"?"fasttrack":l==="beasiswa"?"beasiswa":l==="studi"||l==="study"?"studi":l==="nonasrama"?"nonasrama":l==="teknis"||l==="technical"?"teknis":d.includes("reguler")||d.includes("regular")?"reguler":d.includes("asrama")?"asrama":d.includes("hybrid")?"hybrid":d.includes("fasttrack")?"fasttrack":d.includes("beasiswa")?"beasiswa":"unknown"},ff=(i=[])=>[...i].sort((l,d)=>{const o=mf(l),u=mf(d);if(o!==u)return o-u;const h=pf(l),p=pf(d);return h!==p?h.localeCompare(p,"id"):String(l?.name||"").localeCompare(String(d?.name||""),"id")}),tN=i=>i?.name||"-",nN=i=>i?.category_name||"Program",sN=i=>i?.program_format||"-",iN=i=>{const l=Hs(i?.program_format||""),d=Hs(i?.name||"");return l==="hybrid"||d.includes("hybrid")},lN=i=>{if(!i)return"-";const l=i.installment_plan;if(!l||l==="none")return"Bayar Penuh";if(l==="dp"){const o=Number(i.down_payment||0);return o>0?`DP ${qe.formatCurrency(o)}`:"DP / Uang Muka"}const d=String(l).match(/^(\d+)_installments$/);return d?`${d[1]} Cicilan`:"-"},rN=i=>{const l=Number(i?.capacity)||0,d=Number(i?.current_participants)||0;return l<=0?0:Math.min(100,Math.max(0,d/l*100))},cN=()=>{const[i,l]=j.useState([]),[d,o]=j.useState(!0),[u,h]=j.useState(""),[p,x]=j.useState("all");j.useEffect(()=>{y()},[]);const y=async()=>{try{o(!0),h("");const A=await de.get("/api/programs");if(A.data?.success){const P=Array.isArray(A.data.data)?A.data.data:[];l(ff(P))}else l([]),h("Gagal memuat data program.")}catch(A){console.error("Error fetching programs:",A),l([]),h(A.response?.data?.message||"Gagal memuat program. Silakan coba kembali.")}finally{o(!1)}},f=j.useMemo(()=>ff(i),[i]),b=j.useMemo(()=>aN.filter(A=>f.some(P=>hf(P)===A.key)),[f]),v=j.useMemo(()=>p==="all"?f:f.filter(A=>hf(A)===p),[f,p]);return d?e.jsxs(e.Fragment,{children:[e.jsxs("main",{className:"programs-page",children:[e.jsx("section",{className:"program-page-hero",children:e.jsxs("div",{className:"program-hero-content",children:[e.jsx("h1",{children:"Program FITALENTA"}),e.jsx("p",{children:"Temukan program pengembangan kompetensi dan persiapan karier yang sesuai dengan tujuan Anda."})]})}),e.jsxs("div",{className:"program-loading",children:[e.jsx("div",{className:"spinner-border",role:"status"}),e.jsx("strong",{children:"Memuat program..."}),e.jsx("span",{children:"Mohon tunggu beberapa saat."})]})]}),e.jsx(cd,{})]}):u?e.jsxs(e.Fragment,{children:[e.jsxs("main",{className:"programs-page",children:[e.jsx("section",{className:"program-page-hero",children:e.jsxs("div",{className:"program-hero-content",children:[e.jsx("h1",{children:"Program FITALENTA"}),e.jsx("p",{children:"Temukan program pengembangan kompetensi dan persiapan karier yang sesuai dengan tujuan Anda."})]})}),e.jsx("div",{className:"program-breadcrumb",children:e.jsxs("div",{className:"program-container",children:[e.jsx("a",{href:"https://www.fitalenta.co.id/",children:"Home"}),e.jsx("span",{children:"/"}),e.jsx("strong",{children:"Program"})]})}),e.jsx("div",{className:"program-error-wrapper",children:e.jsxs("div",{className:"program-error-card",children:[e.jsx("div",{className:"program-error-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsx("h3",{children:"Gagal Memuat Program"}),e.jsx("p",{children:u}),e.jsxs("button",{type:"button",onClick:y,children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Coba Lagi"]})]})})]}),e.jsx(cd,{})]}):e.jsxs(e.Fragment,{children:[e.jsxs("main",{className:"programs-page",children:[e.jsxs("section",{className:"program-page-hero",children:[e.jsx("div",{className:"program-hero-decoration program-decoration-left"}),e.jsx("div",{className:"program-hero-decoration program-decoration-right"}),e.jsxs("div",{className:"program-hero-content",children:[e.jsx("h1",{children:"Program FITALENTA"}),e.jsx("p",{children:"Persiapkan kompetensi, karier, dan peluang kerja Anda melalui program FITALENTA."})]})]}),e.jsx("div",{className:"program-breadcrumb",children:e.jsxs("div",{className:"program-container",children:[e.jsx("a",{href:"https://www.fitalenta.co.id/",children:"Home"}),e.jsx("span",{children:"/"}),e.jsx("strong",{children:"Program"})]})}),e.jsx("section",{className:"program-main-section",children:e.jsxs("div",{className:"program-container",children:[b.length>0&&e.jsxs("div",{className:"program-filter-wrapper",children:[e.jsx("button",{type:"button",className:p==="all"?"program-filter active":"program-filter",onClick:()=>x("all"),children:"Semua Program"}),b.map(A=>e.jsx("button",{type:"button",className:p===A.key?"program-filter active":"program-filter",onClick:()=>x(A.key),children:A.label},A.key))]}),v.length===0?e.jsxs("div",{className:"program-empty",children:[e.jsx("div",{className:"program-empty-icon",children:e.jsx("i",{className:"bi bi-folder2-open"})}),e.jsx("h3",{children:"Tidak ada program"}),e.jsx("p",{children:"Silakan pilih kategori lain atau hubungi tim FITALENTA."})]}):e.jsx("div",{className:"program-grid",children:v.map(A=>{const P=iN(A),w=Number(A.job_matching_cost||0),M=rN(A);return e.jsxs("article",{className:"program-card",children:[e.jsxs("div",{className:"program-card-top",children:[e.jsx("div",{className:"program-card-category",children:nN(A)}),e.jsx("h3",{children:tN(A)}),A.program_format&&e.jsxs("div",{className:"program-card-format",children:[e.jsx("span",{children:"Format Program"}),e.jsx("strong",{children:sN(A)})]})]}),e.jsxs("div",{className:"program-card-body",children:[e.jsx("p",{className:"program-description",children:A.description||"Informasi program belum tersedia."}),e.jsxs("div",{className:"program-info",children:[e.jsx(rd,{icon:"bi-calendar3",label:"Jadwal",value:A.schedule||"-"}),e.jsx(rd,{icon:"bi-clock",label:"Durasi",value:A.duration||"-"}),e.jsx(rd,{icon:"bi-geo-alt",label:"Lokasi",value:A.location||"-"})]}),e.jsxs("div",{className:"program-cost-section",children:[e.jsxs("div",{className:"program-cost-title",children:[e.jsx("i",{className:"bi bi-wallet2"}),"Informasi Biaya"]}),e.jsxs("div",{className:"program-cost-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Biaya Pelatihan"}),e.jsx("strong",{children:qe.formatCurrency(A.training_cost||0)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Biaya Keberangkatan"}),e.jsx("strong",{children:qe.formatCurrency(A.departure_cost||0)})]})]}),P&&w>0&&e.jsxs("div",{className:"program-job-matching",children:[e.jsx("span",{children:"Pendampingan Job Matching"}),e.jsx("strong",{children:qe.formatCurrency(w)})]})]}),e.jsxs("div",{className:"program-payment-row",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Skema Pembayaran"}),e.jsx("strong",{children:lN(A)})]}),e.jsx("i",{className:"bi bi-credit-card"})]}),e.jsxs("div",{className:"program-quota",children:[e.jsxs("div",{className:"program-quota-head",children:[e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-people"}),"Kuota"]}),e.jsxs("strong",{children:[A.current_participants||0," / ",A.capacity||0]})]}),e.jsx("div",{className:"program-progress",children:e.jsx("div",{style:{width:`${M}%`}})})]})]}),e.jsxs("div",{className:"program-card-footer",children:[e.jsxs(Ve,{to:`/program/${A.id}`,className:"program-detail-btn",children:["Detail Program",e.jsx("i",{className:"bi bi-arrow-right"})]}),e.jsx(Ve,{to:"/register",className:"program-register-btn",children:"Daftar Sekarang"})]})]},A.id)})})]})})]}),e.jsx(cd,{})]})},rd=({icon:i,label:l,value:d})=>e.jsxs("div",{className:"program-info-item",children:[e.jsx("span",{className:"program-info-icon",children:e.jsx("i",{className:`bi ${i}`})}),e.jsxs("div",{children:[e.jsx("span",{children:l}),e.jsx("strong",{children:d})]})]}),cd=()=>e.jsx("style",{children:`

      :root {
        --program-navy: #00294b;
        --program-navy-dark: #001f3a;
        --program-blue: #17578a;
        --program-orange: #e8491d;
        --program-bg: #f6f8fb;
        --program-text: #102a43;
        --program-muted: #66788a;
        --program-border: #e3e8ef;
        --program-white: #ffffff;
      }


      /*
        PENTING:
        halaman program dinaikkan ke belakang
        navbar fixed.

        Karena navbar transparan,
        hero benar-benar terlihat di belakangnya.
      */

      .programs-page {
        width:
          100%;

        margin-top:
          -96px;

        padding-top:
          0;

        background:
          var(
            --program-bg
          );
      }


      .program-container {
        width:
          min(
            1180px,
            calc(
              100% - 40px
            )
          );

        margin:
          0 auto;
      }


      /* =====================================
         HERO
      ====================================== */

      .program-page-hero {
        position:
          relative;

        min-height:
          456px;

        padding-top:
          96px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        text-align:
          center;

        overflow:
          hidden;

        background:
          linear-gradient(
            120deg,
            #06365e 0%,
            #0b4876 52%,
            #1c6497 100%
          );

        color:
          #ffffff;
      }


      .program-hero-content {
        position:
          relative;

        z-index:
          2;

        max-width:
          850px;

        margin:
          0 auto;

        padding:
          70px 24px;
      }


      .program-page-hero h1 {
        margin:
          0;

        font-size:
          clamp(
            42px,
            6vw,
            64px
          );

        line-height:
          1.1;

        font-weight:
          800;

        color:
          #ffffff !important;
      }


      .program-page-hero p {
        max-width:
          760px;

        margin:
          22px
          auto
          0;

        font-size:
          20px;

        line-height:
          1.6;

        color:
          rgba(
            255,
            255,
            255,
            .90
          );
      }


      .program-hero-decoration {
        position:
          absolute;

        border-radius:
          50%;

        border:
          1px
          solid
          rgba(
            255,
            255,
            255,
            .05
          );

        background:
          rgba(
            255,
            255,
            255,
            .04
          );
      }


      .program-decoration-left {
        width:
          320px;

        height:
          320px;

        left:
          -160px;

        bottom:
          -140px;
      }


      .program-decoration-right {
        width:
          330px;

        height:
          330px;

        right:
          -120px;

        top:
          -120px;
      }


      /* =====================================
         BREADCRUMB
      ====================================== */

      .program-breadcrumb {
        display:
          flex;

        align-items:
          center;

        min-height:
          54px;

        background:
          #ffffff;

        border-bottom:
          1px
          solid
          #edf0f5;
      }


      .program-breadcrumb
      .program-container {
        display:
          flex;

        align-items:
          center;

        gap:
          12px;

        font-size:
          14px;
      }


      .program-breadcrumb a {
        color:
          var(
            --program-navy
          );

        font-weight:
          600;

        text-decoration:
          none;
      }


      .program-breadcrumb span {
        color:
          #bcc4cf;
      }


      .program-breadcrumb strong {
        color:
          var(
            --program-muted
          );

        font-weight:
          500;
      }


      /* =====================================
         MAIN SECTION
      ====================================== */

      .program-main-section {
        padding:
          42px
          0
          90px;
      }


      /* =====================================
         FILTER
      ====================================== */

      .program-filter-wrapper {
        display:
          flex;

        justify-content:
          center;

        flex-wrap:
          wrap;

        gap:
          10px;

        margin-bottom:
          40px;
      }


      .program-filter {
        min-height:
          43px;

        padding:
          9px
          20px;

        border:
          1px
          solid
          #d5dce5;

        border-radius:
          999px;

        background:
          #ffffff;

        color:
          var(
            --program-navy
          );

        font-size:
          14px;

        font-weight:
          700;

        cursor:
          pointer;

        transition:
          all
          .25s
          ease;
      }


      .program-filter:hover {
        border-color:
          var(
            --program-orange
          );

        color:
          var(
            --program-orange
          );
      }


      .program-filter.active {
        border-color:
          var(
            --program-orange
          );

        background:
          var(
            --program-orange
          );

        color:
          #ffffff;

        box-shadow:
          0
          7px
          20px
          rgba(
            232,
            73,
            29,
            .18
          );
      }


      /* =====================================
         GRID
      ====================================== */

      .program-grid {
        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          26px;

        align-items:
          stretch;
      }


      /* =====================================
         CARD
      ====================================== */

      .program-card {
        display:
          flex;

        flex-direction:
          column;

        min-width:
          0;

        overflow:
          hidden;

        border:
          1px
          solid
          var(
            --program-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        box-shadow:
          0
          12px
          35px
          rgba(
            0,
            41,
            75,
            .06
          );

        transition:
          transform
          .28s
          ease,
          box-shadow
          .28s
          ease;
      }


      .program-card:hover {
        transform:
          translateY(
            -6px
          );

        box-shadow:
          0
          24px
          48px
          rgba(
            0,
            41,
            75,
            .13
          );
      }


      /* =====================================
         CARD TOP
      ====================================== */

      .program-card-top {
        position:
          relative;

        min-height:
          160px;

        padding:
          28px
          26px;

        overflow:
          hidden;

        background:
          linear-gradient(
            135deg,
            #07365d,
            #185c8f
          );

        color:
          #ffffff;
      }


      .program-card-top::after {
        content:
          "";

        position:
          absolute;

        width:
          150px;

        height:
          150px;

        right:
          -45px;

        top:
          -65px;

        border-radius:
          50%;

        background:
          rgba(
            255,
            255,
            255,
            .07
          );
      }


      .program-card-category {
        position:
          relative;

        z-index:
          2;

        display:
          inline-flex;

        padding:
          7px
          15px;

        border-radius:
          999px;

        background:
          rgba(
            255,
            255,
            255,
            .95
          );

        color:
          var(
            --program-navy
          );

        font-size:
          12px;

        font-weight:
          800;
      }


      .program-card-top h3 {
        position:
          relative;

        z-index:
          2;

        margin:
          18px
          0
          0;

        font-size:
          23px;

        line-height:
          1.25;

        font-weight:
          800;
      }


      .program-card-format {
        position:
          relative;

        z-index:
          2;

        display:
          flex;

        align-items:
          center;

        gap:
          6px;

        margin-top:
          12px;

        color:
          rgba(
            255,
            255,
            255,
            .75
          );

        font-size:
          12px;
      }


      .program-card-format strong {
        color:
          #ffffff;
      }


      /* =====================================
         BODY
      ====================================== */

      .program-card-body {
        display:
          flex;

        flex-direction:
          column;

        flex:
          1;

        padding:
          26px;
      }


      .program-description {
        min-height:
          92px;

        margin:
          0
          0
          24px;

        color:
          #536779;

        font-size:
          14px;

        line-height:
          1.7;
      }


      /* =====================================
         INFO
      ====================================== */

      .program-info {
        display:
          grid;

        gap:
          14px;

        padding-bottom:
          22px;

        border-bottom:
          1px
          solid
          #edf0f4;
      }


      .program-info-item {
        display:
          flex;

        gap:
          12px;

        align-items:
          flex-start;
      }


      .program-info-icon {
        width:
          36px;

        height:
          36px;

        flex:
          0 0 36px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          10px;

        background:
          #eef5fb;

        color:
          var(
            --program-blue
          );
      }


      .program-info-item div {
        display:
          flex;

        flex-direction:
          column;

        gap:
          2px;
      }


      .program-info-item span {
        color:
          #8593a1;

        font-size:
          11px;
      }


      .program-info-item strong {
        color:
          var(
            --program-text
          );

        font-size:
          13px;

        font-weight:
          700;
      }


      /* =====================================
         COST
      ====================================== */

      .program-cost-section {
        margin-top:
          22px;
      }


      .program-cost-title {
        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        margin-bottom:
          13px;

        color:
          var(
            --program-navy
          );

        font-size:
          13px;

        font-weight:
          800;
      }


      .program-cost-title i {
        color:
          var(
            --program-orange
          );
      }


      .program-cost-grid {
        display:
          grid;

        grid-template-columns:
          repeat(
            2,
            1fr
          );

        gap:
          10px;
      }


      .program-cost-grid > div,
      .program-job-matching {
        padding:
          13px;

        border:
          1px
          solid
          #edf0f4;

        border-radius:
          12px;

        background:
          #fafbfd;
      }


      .program-cost-grid span,
      .program-job-matching span {
        display:
          block;

        margin-bottom:
          5px;

        color:
          #8693a0;

        font-size:
          10px;
      }


      .program-cost-grid strong,
      .program-job-matching strong {
        color:
          var(
            --program-navy
          );

        font-size:
          13px;
      }


      .program-job-matching {
        margin-top:
          10px;
      }


      /* =====================================
         PAYMENT
      ====================================== */

      .program-payment-row {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        margin-top:
          18px;

        padding:
          14px
          15px;

        border-radius:
          13px;

        background:
          #f5f8fb;
      }


      .program-payment-row > div {
        display:
          flex;

        flex-direction:
          column;

        gap:
          2px;
      }


      .program-payment-row span {
        color:
          #8593a0;

        font-size:
          10px;
      }


      .program-payment-row strong {
        color:
          var(
            --program-navy
          );

        font-size:
          13px;
      }


      .program-payment-row > i {
        color:
          var(
            --program-blue
          );

        font-size:
          19px;
      }


      /* =====================================
         QUOTA
      ====================================== */

      .program-quota {
        margin-top:
          18px;
      }


      .program-quota-head {
        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        color:
          var(
            --program-text
          );

        font-size:
          12px;
      }


      .program-quota-head span {
        display:
          flex;

        align-items:
          center;

        gap:
          7px;

        color:
          #66798b;
      }


      .program-progress {
        width:
          100%;

        height:
          7px;

        margin-top:
          9px;

        overflow:
          hidden;

        border-radius:
          999px;

        background:
          #e8edf3;
      }


      .program-progress > div {
        height:
          100%;

        border-radius:
          inherit;

        background:
          linear-gradient(
            90deg,
            #17578a,
            #e8491d
          );

        transition:
          width
          .3s
          ease;
      }


      /* =====================================
         FOOTER
      ====================================== */

      .program-card-footer {
        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          10px;

        padding:
          0
          26px
          26px;
      }


      .program-card-footer a {
        min-height:
          44px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          8px;

        border-radius:
          10px;

        font-size:
          13px;

        font-weight:
          800;

        text-decoration:
          none;

        transition:
          all
          .25s
          ease;
      }


      .program-detail-btn {
        border:
          1px
          solid
          var(
            --program-navy
          );

        color:
          var(
            --program-navy
          );

        background:
          #ffffff;
      }


      .program-detail-btn:hover {
        color:
          #ffffff;

        background:
          var(
            --program-navy
          );
      }


      .program-register-btn {
        border:
          1px
          solid
          var(
            --program-orange
          );

        color:
          #ffffff;

        background:
          var(
            --program-orange
          );
      }


      .program-register-btn:hover {
        color:
          #ffffff;

        background:
          #d43f18;

        border-color:
          #d43f18;
      }


      /* =====================================
         EMPTY / ERROR / LOADING
      ====================================== */

      .program-empty,
      .program-error-card,
      .program-loading {
        max-width:
          650px;

        margin:
          70px
          auto;

        padding:
          45px
          30px;

        border:
          1px
          solid
          var(
            --program-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        text-align:
          center;
      }


      .program-empty-icon,
      .program-error-icon {
        width:
          62px;

        height:
          62px;

        margin:
          0
          auto
          18px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          16px;

        background:
          #f0f5fa;

        color:
          var(
            --program-navy
          );

        font-size:
          25px;
      }


      .program-empty h3,
      .program-error-card h3 {
        color:
          var(
            --program-navy
          );

        font-weight:
          800;
      }


      .program-empty p,
      .program-error-card p,
      .program-loading span {
        color:
          var(
            --program-muted
          );
      }


      .program-error-card button {
        display:
          inline-flex;

        align-items:
          center;

        gap:
          8px;

        margin-top:
          10px;

        padding:
          11px
          22px;

        border:
          0;

        border-radius:
          9px;

        background:
          var(
            --program-navy
          );

        color:
          #ffffff;

        font-weight:
          700;
      }


      .program-loading {
        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        gap:
          10px;

        color:
          var(
            --program-navy
          );
      }


      /* =====================================
         RESPONSIVE
      ====================================== */

      @media (
        max-width: 1050px
      ) {

        .program-grid {
          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );
        }

      }


      @media (
        max-width: 799px
      ) {

        .programs-page {
          margin-top:
            -80px;
        }


        .program-page-hero {
          padding-top:
            80px;

          min-height:
            380px;
        }

      }


      @media (
        max-width: 767px
      ) {

        .program-hero-content {
          padding:
            55px
            20px;
        }


        .program-page-hero p {
          font-size:
            16px;
        }


        .program-main-section {
          padding:
            34px
            0
            70px;
        }


        .program-grid {
          grid-template-columns:
            1fr;
        }


        .program-description {
          min-height:
            auto;
        }

      }


      @media (
        max-width: 520px
      ) {

        .program-container {
          width:
            min(
              calc(
                100% - 28px
              ),
              1180px
            );
        }


        .program-card-footer {
          grid-template-columns:
            1fr;
        }


        .program-cost-grid {
          grid-template-columns:
            1fr;
        }


        .program-filter-wrapper {
          justify-content:
            flex-start;
        }


        .program-filter {
          flex:
            0
            0
            auto;
        }

      }


      @media (
        max-width: 480px
      ) {

        .programs-page {
          margin-top:
            -76px;
        }


        .program-page-hero {
          padding-top:
            76px;

          min-height:
            376px;
        }

      }

    `}),$i=(i="")=>String(i).trim().toLowerCase().replace(/[-_\s]+/g,""),bg=i=>{const l=$i(i?.program_format||""),d=$i(i?.name||"");return l==="hybrid"||d.includes("hybrid")},oN=i=>{if(!i)return"-";const l=i.installment_plan;if(!l||l==="none")return"Bayar Penuh";if(l==="dp")return"DP / Uang Muka";const d=String(l).match(/^(\d+)_installments$/);return d?`${d[1]} Kali Cicilan`:"-"},dN=i=>{const l=Number(i?.down_payment||0);return l<=0?"Tidak Ada":qe.formatCurrency(l)},uN=i=>{if(!i)return 0;const l=Number(i.training_cost||0),d=Number(i.departure_cost||0),o=bg(i)?Number(i.job_matching_cost||0):0;return l+d+o},mN=()=>{const{id:i}=Yv(),[l,d]=j.useState(null),[o,u]=j.useState(!0),[h,p]=j.useState("");j.useEffect(()=>{x()},[i]);const x=async()=>{try{u(!0),p("");const E=await de.get(`/api/programs/${i}`);E.data?.success?d(E.data.data):(d(null),p("Program tidak ditemukan"))}catch(E){console.error("Error fetching program:",E),d(null),p(E.response?.data?.message||"Gagal memuat detail program")}finally{u(!1)}},y=E=>E?String(E).split(`
`).map(L=>L.trim().replace(/^[-•]\s*/,"")).filter(L=>L!==""):[],f=()=>{const E=$i(l?.category_name||""),L=$i(l?.program_format||""),q=$i(l?.name||"");return E.includes("amto")?"/images/home_amto.jpg":E.includes("korea")?"/images/home_korea.jpg":L==="asrama"||q.includes("asrama")?"/images/home_asrama.jpg":L==="hybrid"||q.includes("hybrid")?"/images/home_hybrid.jpg":L==="fasttrack"||q.includes("fasttrack")?"/images/home_fast_track.jpg":L==="beasiswa"||L==="studi"||q.includes("beasiswa")?"/images/home_beasiswa.jpg":q.includes("gijinkoku")?"/images/home_gijinkoku.jpg":(L==="reguler"||L==="regular"||q.includes("reguler")||q.includes("regular"),"/images/home_regular.jpg")};if(o)return e.jsx("div",{className:"container mt-5",children:e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center gap-3 py-5",children:[e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})}),e.jsx("span",{className:"text-muted",children:"Memuat informasi program..."})]})});if(h||!l)return e.jsx("div",{className:"container mt-5",children:e.jsxs("div",{className:"alert alert-danger",role:"alert",children:[e.jsx("h5",{children:"Program tidak dapat dimuat"}),e.jsx("p",{className:"mb-0",children:h||"Program tidak ditemukan"}),e.jsx(Ve,{to:"/programs",className:"btn btn-outline-danger mt-3",children:"Kembali ke Daftar Program"})]})});const b=y(l.timeline_text),v=y(l.training_fee_details),A=y(l.departure_fee_details),P=y(l.requirements_text||l.requirements),w=bg(l),M=Number(l.job_matching_cost||0),H=Number(l.down_payment||0),_=uN(l);return e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"hero-section position-relative d-flex align-items-center",style:{minHeight:"60vh",backgroundImage:`url("${f()}")`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"},"aria-label":`Program ${l.name}`,children:[e.jsx("div",{className:"position-absolute top-0 start-0 w-100 h-100",style:{background:"linear-gradient(135deg, rgba(10, 29, 51, 0.86), rgba(23, 54, 93, 0.62))"},"aria-hidden":"true"}),e.jsx("div",{className:"container position-relative text-center text-light",children:e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-12 col-lg-9",children:[e.jsxs("div",{className:"d-flex flex-wrap justify-content-center gap-2 mb-3",children:[e.jsx("span",{className:"badge bg-light text-primary px-3 py-2",children:l.category_name||"PROGRAM FITALENTA"}),l.program_format&&e.jsx("span",{className:"badge bg-primary border border-light px-3 py-2",children:l.program_format})]}),e.jsx("h1",{className:"fw-bold mb-3 display-4",children:l.name}),e.jsx("p",{className:"lead mb-4 fs-5",children:l.description||"Program persiapan karier FITALENTA."}),e.jsxs("div",{className:"d-flex gap-3 flex-column flex-sm-row justify-content-center",children:[e.jsx(Ve,{to:"/register",className:"btn btn-lg btn-light text-primary px-4 fw-semibold",children:"Daftar Sekarang"}),e.jsx(Ve,{to:"/programs",className:"btn btn-lg btn-outline-light px-4 fw-semibold",children:"Lihat Program Lain"})]})]})})})]}),e.jsxs("div",{className:"container mt-5",children:[e.jsxs("section",{className:"mb-5",children:[e.jsx("h2",{className:"text-center mb-4 text-uppercase fw-bold text-primary",children:"Overview Program"}),e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsx("div",{className:"card h-100 border-0 shadow-sm hover-shadow",children:e.jsxs("div",{className:"card-body text-center p-4",children:[e.jsx("div",{className:"mb-3",children:e.jsx("i",{className:"bi bi-calendar3 text-primary fs-1"})}),e.jsx("h5",{className:"card-title text-uppercase fw-bold",children:"Jadwal"}),e.jsx("p",{className:"card-text text-muted mb-0",children:l.schedule||"-"})]})})}),e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsx("div",{className:"card h-100 border-0 shadow-sm hover-shadow",children:e.jsxs("div",{className:"card-body text-center p-4",children:[e.jsx("div",{className:"mb-3",children:e.jsx("i",{className:"bi bi-clock text-primary fs-1"})}),e.jsx("h5",{className:"card-title text-uppercase fw-bold",children:"Durasi"}),e.jsx("p",{className:"card-text text-muted mb-0",children:l.duration||"-"})]})})}),e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsx("div",{className:"card h-100 border-0 shadow-sm hover-shadow",children:e.jsxs("div",{className:"card-body text-center p-4",children:[e.jsx("div",{className:"mb-3",children:e.jsx("i",{className:"bi bi-geo-alt text-primary fs-1"})}),e.jsx("h5",{className:"card-title text-uppercase fw-bold",children:"Lokasi"}),e.jsx("p",{className:"card-text text-muted mb-0",children:l.location||"-"})]})})}),e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsx("div",{className:"card h-100 border-0 shadow-sm hover-shadow",children:e.jsxs("div",{className:"card-body text-center p-4",children:[e.jsx("div",{className:"mb-3",children:e.jsx("i",{className:"bi bi-people text-primary fs-1"})}),e.jsx("h5",{className:"card-title text-uppercase fw-bold",children:"Kuota"}),e.jsxs("p",{className:"card-text text-muted mb-0",children:[l.current_participants||0," ","/"," ",l.capacity||0," ","Peserta"]})]})})})]})]}),b.length>0&&e.jsxs("section",{className:"mb-5",children:[e.jsx("h2",{className:"text-center mb-4 text-uppercase fw-bold text-primary",children:"Timeline Program"}),e.jsx("div",{className:"row g-4",children:b.map((E,L)=>e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsx("div",{className:"card h-100 border-0 shadow-sm text-center hover-shadow",children:e.jsxs("div",{className:"card-body p-4",children:[e.jsx("div",{className:"mb-3",children:e.jsx("div",{className:"bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold fs-4",style:{width:"60px",height:"60px"},children:L+1})}),e.jsx("p",{className:"card-text text-muted mb-0",children:E})]})})},L))})]}),e.jsxs("section",{className:"mb-5",children:[e.jsx("h2",{className:"text-center mb-4 text-uppercase fw-bold text-primary",children:"Biaya & Detail Program"}),e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:w?"col-lg-4":"col-lg-6",children:e.jsxs("div",{className:"card h-100 border-0 shadow-sm",children:[e.jsxs("div",{className:"card-header bg-primary text-white text-center py-3",children:[e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold",children:"Biaya Pelatihan"}),e.jsx("h4",{className:"mb-0 fw-bold mt-2",children:qe.formatCurrency(l.training_cost||0)})]}),e.jsx("div",{className:"card-body",children:v.length>0?e.jsx("ul",{className:"list-unstyled mb-0",children:v.map((E,L)=>e.jsxs("li",{className:"mb-2 d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:E})]},L))}):e.jsx("p",{className:"text-muted mb-0",children:"Detail biaya pelatihan belum tersedia."})})]})}),w&&e.jsx("div",{className:"col-lg-4",children:e.jsxs("div",{className:"card h-100 border-0 shadow-sm",children:[e.jsxs("div",{className:"card-header bg-primary text-white text-center py-3",children:[e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold",children:"Pendampingan Job Matching"}),e.jsx("h4",{className:"mb-0 fw-bold mt-2",children:qe.formatCurrency(M)})]}),e.jsx("div",{className:"card-body",children:e.jsxs("ul",{className:"list-unstyled mb-0",children:[e.jsxs("li",{className:"mb-2 d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:"Pendampingan pencocokan profil peserta dengan peluang kerja."})]}),e.jsxs("li",{className:"mb-2 d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:"Pendampingan persiapan seleksi dan proses job matching."})]}),e.jsxs("li",{className:"mb-0 d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:"Fasilitas khusus Program Hybrid."})]})]})})]})}),e.jsx("div",{className:w?"col-lg-4":"col-lg-6",children:e.jsxs("div",{className:"card h-100 border-0 shadow-sm",children:[e.jsxs("div",{className:"card-header bg-primary text-white text-center py-3",children:[e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold",children:"Biaya Keberangkatan"}),e.jsx("h4",{className:"mb-0 fw-bold mt-2",children:qe.formatCurrency(l.departure_cost||0)})]}),e.jsx("div",{className:"card-body",children:A.length>0?e.jsx("ul",{className:"list-unstyled mb-0",children:A.map((E,L)=>e.jsxs("li",{className:"mb-2 d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:E})]},L))}):e.jsx("p",{className:"text-muted mb-0",children:"Detail biaya keberangkatan belum tersedia."})})]})})]})]}),e.jsx("section",{className:"mb-5",children:e.jsxs("div",{className:"card border-0 shadow-sm",children:[e.jsx("div",{className:"card-header bg-light py-3",children:e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold text-center text-primary",children:"Ringkasan Biaya & Pembayaran"})}),e.jsx("div",{className:"card-body",children:e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"bi bi-wallet2 text-primary fs-2"}),e.jsx("h6",{className:"mt-2 mb-1",children:"Biaya Pelatihan"}),e.jsx("strong",{children:qe.formatCurrency(l.training_cost||0)})]})}),w&&e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"bi bi-person-workspace text-primary fs-2"}),e.jsx("h6",{className:"mt-2 mb-1",children:"Job Matching"}),e.jsx("strong",{children:qe.formatCurrency(M)})]})}),e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"bi bi-airplane text-primary fs-2"}),e.jsx("h6",{className:"mt-2 mb-1",children:"Keberangkatan"}),e.jsx("strong",{children:qe.formatCurrency(l.departure_cost||0)})]})}),e.jsx("div",{className:"col-md-6 col-lg-3",children:e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"bi bi-calculator text-primary fs-2"}),e.jsx("h6",{className:"mt-2 mb-1",children:"Total Estimasi"}),e.jsx("strong",{children:qe.formatCurrency(_)})]})})]})})]})}),P.length>0&&e.jsx("section",{className:"mb-5",children:e.jsxs("div",{className:"card border-0 shadow-sm",children:[e.jsx("div",{className:"card-header bg-primary text-white text-center py-3",children:e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold",children:"Persyaratan Peserta"})}),e.jsx("div",{className:"card-body",children:e.jsx("div",{className:"row",children:P.map((E,L)=>e.jsx("div",{className:"col-md-6 mb-3",children:e.jsxs("div",{className:"d-flex align-items-start",children:[e.jsx("i",{className:"bi bi-check-circle text-success me-2 mt-1"}),e.jsx("span",{children:E})]})},L))})})]})}),e.jsx("section",{className:"mb-5",children:e.jsxs("div",{className:"card border-0 shadow-sm",children:[e.jsx("div",{className:"card-header bg-primary text-white py-3",children:e.jsx("h5",{className:"card-title mb-0 text-uppercase fw-bold text-center",children:"Informasi Tambahan"})}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"row g-4",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-tags text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"Kategori Program"}),e.jsx("p",{className:"text-muted mb-0",children:l.category_name||"-"})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-grid-3x3-gap text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"Tipe / Format Program"}),e.jsx("p",{className:"text-muted mb-0",children:l.program_format||"-"})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-arrow-repeat text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"Skema Pembayaran"}),e.jsx("p",{className:"text-muted mb-0",children:oN(l)})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-cash-stack text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"DP / Uang Muka"}),e.jsx("p",{className:"text-muted mb-0",children:dN(l)})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-bank text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"Dana Talang Keberangkatan"}),e.jsx("p",{className:"text-muted mb-0",children:l.bridge_fund||"-"})]})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"d-flex align-items-start gap-3",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-people text-primary fs-3"})}),e.jsxs("div",{children:[e.jsx("h6",{children:"Kuota Program"}),e.jsxs("p",{className:"text-muted mb-0",children:[l.capacity||0," ","peserta"]})]})]})})]}),l.installment_plan==="dp"&&H>0&&e.jsx("div",{className:"alert alert-info mt-4 mb-0",children:e.jsxs("div",{className:"d-flex align-items-start gap-2",children:[e.jsx("i",{className:"bi bi-info-circle mt-1"}),e.jsxs("div",{children:[e.jsx("strong",{className:"d-block",children:"Pembayaran DP"}),e.jsxs("span",{children:["Pembayaran awal program ini sebesar"," ",e.jsx("strong",{children:qe.formatCurrency(H)}),". Informasi pembayaran selanjutnya akan mengikuti ketentuan program."]})]})]})}),l.contact_info&&e.jsxs("div",{className:"mt-4 pt-4 border-top",children:[e.jsxs("h6",{className:"d-flex align-items-center gap-2",children:[e.jsx("i",{className:"bi bi-headset text-primary"}),"Kontak Informasi"]}),e.jsx("div",{className:"text-muted",style:{whiteSpace:"pre-line"},children:l.contact_info})]})]})]})}),e.jsx("section",{className:"mb-5",children:e.jsx("div",{className:"card border-0 bg-primary text-white shadow-sm",children:e.jsxs("div",{className:"card-body text-center p-5",children:[e.jsx("i",{className:"bi bi-rocket-takeoff fs-1 mb-3 d-block"}),e.jsxs("h3",{className:"fw-bold",children:["Tertarik dengan"," ",l.name,"?"]}),e.jsx("p",{className:"mb-4 opacity-75",children:"Lengkapi formulir pendaftaran dan mulai proses seleksi bersama FITALENTA."}),e.jsxs(Ve,{to:"/register",className:"btn btn-light text-primary fw-semibold px-4 py-2",children:["Daftar Program",e.jsx("i",{className:"bi bi-arrow-right ms-2"})]})]})})})]})]})},Pd=(i="")=>String(i).trim().toLowerCase().replace(/[-_\s]+/g,""),gf=i=>{const l=Pd(typeof i=="string"?i:i?.name||"");return{programregular:0,programreguler:0,regular:0,reguler:0,programasrama:1,asrama:1,programhybrid:2,hybrid:2,programfasttrack:3,fasttrack:3,programbeasiswa:4,beasiswa:4,programgijinkoku:5,gijinkoku:5,programkorea:6,korea:6}[l]??999},xf=(i=[])=>[...i].sort((l,d)=>{const o=gf(l),u=gf(d);return o!==u?o-u:String(l?.name||"").localeCompare(String(d?.name||""),"id")}),bf=i=>Pd(i?.name||"").includes("hybrid"),jf=i=>Pd(i?.name||"").includes("fasttrack"),vf=i=>{if(!i)return"-";const l=i.installment_plan;if(!l||l==="none")return"Bayar Penuh";if(l==="dp")return"DP / Uang Muka";const d=String(l).match(/^(\d+)_installments$/);return d?`${d[1]} Cicilan`:"-"},hN=i=>{const l=Number(i?.down_payment||0);return l<=0?"Tidak Ada":qe.formatCurrency(l)},pN=()=>{const[i,l]=j.useState(1),[d,o]=j.useState([]),[u,h]=j.useState([]),[p,x]=j.useState({}),[y,f]=j.useState(!1),[b,v]=j.useState(!1),[A,P]=j.useState({}),[w]=j.useState({}),[M,H]=j.useState(!1),[_,E]=j.useState(""),[L]=j.useState(""),[q,oe]=j.useState(!1),[re,te]=j.useState(null),[ge,ye]=j.useState(!1),[he,Oe]=j.useState(!1),[Ce,Se]=j.useState(!1),[Z,fe]=j.useState(!0),[U,ie]=j.useState(0),[I,ue]=j.useState(!1),[D,N]=j.useState("idle"),[k,Y]=j.useState(!1),{user:X}=Wa(),se=Ys(),pe=j.useMemo(()=>xf(d),[d]),Ae={current_activity:{pelajar:"Pelajar",mahasiswa:"Mahasiswa",bekerja:"Bekerja",tidak_bekerja:"Tidak Bekerja",pencari_kerja:"Pencari Kerja"},marital_status:{belum_menikah:"Belum Menikah",sudah_menikah:"Sudah Menikah",sudah_menikah_dan_memiliki_anak:"Sudah Menikah dan Memiliki Anak"},parent_relationship:{ayah:"Ayah",ibu:"Ibu",kakak:"Kakak",kerabat:"Kerabat"},last_education:{SMA:"SMA/Sederajat",D1:"D1",D2:"D2",D3:"D3",D4:"D4",S1:"S1",S2:"S2",S3:"S3"}},B=(F,ne)=>ne?Ae[F]?.[ne]||ne:"-",[S,ee]=j.useState({full_name:X?.full_name||"",nik:"",gender:"",birth_place:"",birth_date:"",email:X?.email||"",phone:X?.phone||"",last_education:"",parent_phone:"",parent_relationship:"",major:"",education_institution:"",current_activity:"",marital_status:"",ktp_province:"",ktp_province_name:"",ktp_city:"",ktp_city_name:"",ktp_address:"",domicile_province:"",domicile_province_name:"",domicile_city:"",domicile_city_name:"",domicile_address:"",photo_file:null,photo_preview:null,program_id:"",n4_file:null,n4_preview:null,ssw_file:null,ssw_preview:null}),Je=()=>`fitalenta_program_registration_draft_${X?.id||X?.email||"guest"}`,He=()=>({version:1,currentStep:i,isSameAsKTP:he,savedAt:new Date().toISOString(),hadFiles:{photo:!!S.photo_file,n4:!!S.n4_file,ssw:!!S.ssw_file},formData:{full_name:S.full_name,nik:S.nik,gender:S.gender,birth_place:S.birth_place,birth_date:S.birth_date,email:S.email,phone:S.phone,last_education:S.last_education,parent_phone:S.parent_phone,parent_relationship:S.parent_relationship,major:S.major,education_institution:S.education_institution,current_activity:S.current_activity,marital_status:S.marital_status,ktp_province:S.ktp_province,ktp_province_name:S.ktp_province_name,ktp_city:S.ktp_city,ktp_city_name:S.ktp_city_name,ktp_address:S.ktp_address,domicile_province:S.domicile_province,domicile_province_name:S.domicile_province_name,domicile_city:S.domicile_city,domicile_city_name:S.domicile_city_name,domicile_address:S.domicile_address,program_id:S.program_id}}),R=()=>{try{localStorage.removeItem(Je()),N("idle")}catch(F){console.error("Error clearing registration draft:",F)}},be=async()=>{try{f(!0);const F=await de.get("/api/programs");if(F.data?.success){const ne=Array.isArray(F.data.data)?F.data.data:[];o(xf(ne))}else o([]),E("Gagal memuat data program")}catch(F){console.error("Error fetching programs:",F),o([]),E(F.response?.data?.message||"Gagal memuat data program")}finally{f(!1)}},ke=async()=>{try{v(!0);const F=await de.get("/api/wilayah/provinces");F.data?.success?h(Array.isArray(F.data.data)?F.data.data:[]):E("Gagal memuat data provinsi")}catch(F){console.error("Error fetching provinces:",F),E("Gagal memuat data provinsi")}finally{v(!1)}},Ie=async F=>{if(F)try{P(je=>({...je,[F]:!0}));const ne=await de.get(`/api/wilayah/regencies/${F}`);ne.data?.success&&x(je=>({...je,[F]:Array.isArray(ne.data.data)?ne.data.data:[]}))}catch(ne){console.error(`Error fetching cities for province ${F}:`,ne),E(`Gagal memuat data kabupaten/kota untuk provinsi ${F}`)}finally{P(ne=>({...ne,[F]:!1}))}};j.useEffect(()=>{be(),ke()},[]),j.useEffect(()=>{if(X)try{const F=Je(),ne=localStorage.getItem(F);if(!ne){ee(Ue=>({...Ue,full_name:Ue.full_name||X?.full_name||"",email:X?.email||Ue.email||"",phone:Ue.phone||X?.phone||""})),ue(!0),N("saved");return}const je=JSON.parse(ne);if(!je?.formData){localStorage.removeItem(F),ue(!0),N("saved");return}ee(Ue=>({...Ue,...je.formData,full_name:je.formData.full_name||X?.full_name||Ue.full_name,email:X?.email||je.formData.email||Ue.email,phone:je.formData.phone||X?.phone||Ue.phone,photo_file:null,photo_preview:null,n4_file:null,n4_preview:null,ssw_file:null,ssw_preview:null})),Oe(!!je.isSameAsKTP),ye(!1);const Ge=Number(je.currentStep);Ge>=1&&Ge<=3&&(Ge>1&&je.hadFiles?.photo?(l(1),Y(!0)):l(Ge)),(je.hadFiles?.photo||je.hadFiles?.n4||je.hadFiles?.ssw)&&Y(!0),ue(!0),N("restored")}catch(F){console.error("Error restoring registration draft:",F);try{localStorage.removeItem(Je())}catch(ne){console.error("Error removing invalid registration draft:",ne)}ue(!0),N("error")}},[X]),j.useEffect(()=>{if(!X||!I||q)return;N("saving");const F=setTimeout(()=>{try{localStorage.setItem(Je(),JSON.stringify(He())),N("saved")}catch(ne){console.error("Error saving registration draft:",ne),N("error")}},600);return()=>clearTimeout(F)},[X,I,i,he,S,q]),j.useEffect(()=>{if(!I)return;const F=[S.ktp_province,S.domicile_province].filter(Boolean);[...new Set(F)].forEach(je=>{!p[je]&&!A[je]&&Ie(je)})},[I,S.ktp_province,S.domicile_province]),j.useEffect(()=>()=>{["photo","n4","ssw"].forEach(F=>{const ne=S[`${F}_preview`];ne&&typeof ne=="string"&&URL.revokeObjectURL(ne)})},[]),j.useEffect(()=>{he&&ee(F=>({...F,domicile_province:F.ktp_province,domicile_province_name:F.ktp_province_name,domicile_city:F.ktp_city,domicile_city_name:F.ktp_city_name,domicile_address:F.ktp_address}))},[he,S.ktp_province,S.ktp_province_name,S.ktp_city,S.ktp_city_name,S.ktp_address]);const oa=(F,ne)=>{if(!ne)return;const je=["image/jpeg","image/jpg","image/png","application/pdf"];if(F==="photo"&&!ne.type.startsWith("image/")){E("File foto harus berupa gambar JPG atau PNG");return}if(F!=="photo"&&!je.includes(ne.type)){E(`File ${F} harus berupa JPG, PNG, atau PDF`);return}if(ne.size>10*1024*1024){E(`Ukuran file ${F} maksimal 10MB`);return}E("");const Ge=S[`${F}_preview`];Ge&&URL.revokeObjectURL(Ge);const Ue=ne.type.startsWith("image/")?URL.createObjectURL(ne):null;ee(an=>({...an,[`${F}_file`]:ne,[`${F}_preview`]:Ue})),F==="photo"&&Y(!1)},Te=F=>{const{name:ne,value:je}=F.target;if(ne==="ktp_province"){const Ge=u.find(Ue=>Ue.code===je);ee(Ue=>({...Ue,ktp_province:je,ktp_province_name:Ge?.name||"",ktp_city:"",ktp_city_name:""})),je&&!p[je]&&Ie(je);return}if(ne==="ktp_city"){const Ge=p[S.ktp_province]?.find(Ue=>Ue.code===je);ee(Ue=>({...Ue,ktp_city:je,ktp_city_name:Ge?.name||""}));return}if(ne==="domicile_province"){const Ge=u.find(Ue=>Ue.code===je);ee(Ue=>({...Ue,domicile_province:je,domicile_province_name:Ge?.name||"",domicile_city:"",domicile_city_name:""})),je&&!p[je]&&Ie(je);return}if(ne==="domicile_city"){const Ge=p[S.domicile_province]?.find(Ue=>Ue.code===je);ee(Ue=>({...Ue,domicile_city:je,domicile_city_name:Ge?.name||""}));return}ee(Ge=>({...Ge,[ne]:je}))},Ra=F=>{const ne=F.target.checked;Oe(ne),ne&&ee(je=>({...je,domicile_province:je.ktp_province,domicile_province_name:je.ktp_province_name,domicile_city:je.ktp_city,domicile_city_name:je.ktp_city_name,domicile_address:je.ktp_address}))},Ke=pe.find(F=>String(F.id)===String(S.program_id)),Oa=jf(Ke),Tt=bf(Ke),We=F=>{const ne=[];if(F===1&&(S.full_name||ne.push("Nama lengkap harus diisi"),S.nik||ne.push("NIK harus diisi"),S.gender||ne.push("Jenis kelamin harus dipilih"),S.birth_place||ne.push("Tempat lahir harus diisi"),S.birth_date||ne.push("Tanggal lahir harus diisi"),S.phone||ne.push("Nomor handphone harus diisi"),S.last_education||ne.push("Pendidikan terakhir harus diisi"),S.major||ne.push("Jurusan harus diisi"),S.education_institution||ne.push("Asal institusi pendidikan terakhir harus diisi"),S.current_activity||ne.push("Pekerjaan/aktivitas saat ini harus dipilih"),S.marital_status||ne.push("Status pernikahan harus dipilih"),S.parent_relationship||ne.push("Hubungan dengan orang tua/wali harus dipilih"),S.parent_phone||ne.push("Nomor handphone orang tua harus diisi"),S.ktp_province||ne.push("Provinsi KTP harus dipilih"),S.ktp_city||ne.push("Kota/Kabupaten KTP harus dipilih"),S.ktp_address||ne.push("Alamat KTP harus diisi"),S.domicile_province||ne.push("Provinsi domisili harus dipilih"),S.domicile_city||ne.push("Kota/Kabupaten domisili harus dipilih"),S.domicile_address||ne.push("Alamat domisili harus diisi"),S.photo_file||ne.push("Foto harus diupload")),F===2){S.program_id||ne.push("Program harus dipilih");const je=pe.find(Ge=>String(Ge.id)===String(S.program_id));jf(je)&&(S.n4_file||ne.push("Sertifikat N4 harus diupload untuk Program Fast Track"),S.ssw_file||ne.push("Sertifikat SSW harus diupload untuk Program Fast Track"))}return F===3&&!ge&&ne.push("Anda harus menyetujui syarat dan ketentuan"),ne.length>0?(E(ne.join(", ")),window.scrollTo({top:0,behavior:"smooth"}),!1):!0},pa=()=>{We(i)&&(l(F=>F+1),E(""),window.scrollTo({top:0,behavior:"smooth"}))},Vs=()=>{l(F=>Math.max(1,F-1)),E(""),window.scrollTo({top:0,behavior:"smooth"})},An=F=>p[F]||[],Et=F=>A[F]||!1,vt=F=>w[F]||!1,Js=async F=>{if(F.preventDefault(),!!We(3)){if(!X?.id){E("Data pengguna tidak ditemukan. Silakan login kembali.");return}try{H(!0),E("");let ne=null,je=null,Ge=null;if(S.photo_file){const La=new FormData;La.append("file",S.photo_file);const et=await de.post("/api/uploads/photo",La,{headers:{"Content-Type":"multipart/form-data"}});if(!et.data?.success)throw new Error("Gagal mengupload foto");ne=et.data.data.file_path}if(Oa&&S.n4_file){const La=new FormData;La.append("file",S.n4_file),La.append("type","n4_certificate");const et=await de.post("/api/uploads/document",La,{headers:{"Content-Type":"multipart/form-data"}});if(!et.data?.success)throw new Error("Gagal mengupload sertifikat N4");je=et.data.data.file_path}if(Oa&&S.ssw_file){const La=new FormData;La.append("file",S.ssw_file),La.append("type","ssw_certificate");const et=await de.post("/api/uploads/document",La,{headers:{"Content-Type":"multipart/form-data"}});if(!et.data?.success)throw new Error("Gagal mengupload sertifikat SSW");Ge=et.data.data.file_path}const Ue={user_id:X.id,program_id:S.program_id,nik:S.nik,gender:S.gender,birth_place:S.birth_place,birth_date:S.birth_date,last_education:S.last_education,parent_phone:S.parent_phone,parent_relationship:S.parent_relationship,major:S.major,education_institution:S.education_institution,current_activity:S.current_activity,marital_status:S.marital_status,ktp_province_code:S.ktp_province,ktp_province_name:S.ktp_province_name,ktp_city_code:S.ktp_city,ktp_city_name:S.ktp_city_name,ktp_address:S.ktp_address,domicile_province_code:S.domicile_province,domicile_province_name:S.domicile_province_name,domicile_city_code:S.domicile_city,domicile_city_name:S.domicile_city_name,domicile_address:S.domicile_address,photo_path:ne,n4_certificate_path:je,ssw_certificate_path:Ge,user_data:{full_name:S.full_name,phone:S.phone}},an=await de.post("/api/registrations",Ue);an.data?.success?(R(),te(an.data.data),oe(!0)):E(an.data?.message||"Gagal melakukan pendaftaran")}catch(ne){console.error("Registration error:",ne),console.error("Error details:",ne.response?.data),E(ne.response?.data?.message||ne.message||"Terjadi kesalahan saat mendaftar. Silakan coba lagi.")}finally{H(!1)}}},ja=({icon:F,title:ne,description:je,required:Ge=!1,children:Ue})=>e.jsxs("div",{className:"registration-section-heading",children:[e.jsxs("div",{className:"registration-section-title-wrap",children:[e.jsx("div",{className:"registration-section-icon",children:e.jsx("i",{className:`bi ${F}`})}),e.jsxs("div",{children:[e.jsx("h5",{children:ne}),e.jsx("p",{children:je})]})]}),e.jsxs("div",{className:"registration-section-actions",children:[Ue,Ge&&e.jsx("span",{className:"registration-required-badge",children:"WAJIB"})]})]}),Xs=()=>e.jsxs("div",{className:"registration-step-content",children:[e.jsxs("div",{className:"registration-step-heading",children:[e.jsx("div",{className:"registration-step-index",children:"01"}),e.jsxs("div",{children:[e.jsx("span",{className:"registration-step-eyebrow",children:"LANGKAH PERTAMA"}),e.jsx("h4",{children:"Kenali Anda Lebih Dekat"}),e.jsx("p",{children:"Informasi ini digunakan sebagai identitas utama selama proses seleksi dan program FITALENTA."})]})]}),e.jsxs("div",{className:"registration-info-strip",children:[e.jsx("div",{className:"registration-info-strip-icon",children:e.jsx("i",{className:"bi bi-shield-check"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Data Anda digunakan hanya untuk kebutuhan pendaftaran"}),e.jsx("span",{children:"Pastikan seluruh informasi sesuai dengan dokumen resmi untuk mempermudah proses verifikasi."})]})]}),k&&e.jsxs("div",{className:"alert alert-info d-flex align-items-start gap-3 mb-4",children:[e.jsx("i",{className:"bi bi-cloud-check fs-5"}),e.jsxs("div",{children:[e.jsx("strong",{className:"d-block mb-1",children:"Data sebelumnya berhasil dipulihkan"}),e.jsx("span",{children:"Informasi yang sudah Anda isi tetap tersedia. Untuk keamanan browser, foto atau dokumen yang sebelumnya dipilih perlu diunggah kembali."})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-camera",title:"Foto Profil",description:"Gunakan foto terbaru dengan wajah terlihat jelas.",required:!0}),e.jsxs("div",{className:"registration-upload-grid",children:[e.jsxs("label",{htmlFor:"photo",className:`registration-upload-box ${S.photo_file?"has-file":""}`,children:[e.jsx("input",{type:"file",id:"photo",accept:".jpg,.jpeg,.png",onChange:F=>oa("photo",F.target.files[0]),disabled:vt("photo")}),e.jsx("div",{className:"registration-upload-icon",children:e.jsx("i",{className:"bi bi-cloud-arrow-up"})}),e.jsx("strong",{children:S.photo_file?S.photo_file.name:"Upload foto Anda"}),e.jsx("span",{children:"Klik untuk memilih foto"}),e.jsx("small",{children:"JPG atau PNG • Maksimal 10 MB"})]}),S.photo_preview?e.jsxs("div",{className:"registration-photo-preview",children:[e.jsx("span",{className:"registration-preview-badge",children:"FOTO ANDA"}),e.jsx("img",{src:S.photo_preview,alt:"Preview Foto"}),e.jsxs("div",{className:"registration-preview-success",children:[e.jsx("i",{className:"bi bi-check-circle-fill"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Foto siap digunakan"}),e.jsx("small",{children:"Klik area upload jika ingin mengganti"})]})]})]}):e.jsxs("div",{className:"registration-photo-preview empty",children:[e.jsx("span",{className:"registration-preview-badge",children:"PREVIEW"}),e.jsx("div",{className:"registration-empty-photo-icon",children:e.jsx("i",{className:"bi bi-person-bounding-box"})}),e.jsx("strong",{children:"Belum ada foto"}),e.jsx("small",{children:"Preview akan muncul setelah Anda memilih foto"})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-person-vcard",title:"Informasi Pribadi",description:"Informasi dasar yang digunakan pada profil peserta."}),e.jsxs("div",{className:"row registration-form-row",children:[e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"full_name",className:"form-label",children:["Nama Lengkap ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",id:"full_name",name:"full_name",value:S.full_name,onChange:Te,placeholder:"Masukkan nama lengkap",required:!0})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"nik",className:"form-label",children:["NIK ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",id:"nik",name:"nik",value:S.nik,onChange:Te,placeholder:"Masukkan 16 digit NIK",maxLength:16,inputMode:"numeric",required:!0}),e.jsxs("small",{className:"registration-field-help",children:[e.jsx("i",{className:"bi bi-info-circle"}),"Sesuai dengan KTP"]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"gender",className:"form-label",children:["Jenis Kelamin ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"gender",name:"gender",value:S.gender,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Jenis Kelamin"}),e.jsx("option",{value:"L",children:"Laki-laki"}),e.jsx("option",{value:"P",children:"Perempuan"})]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"birth_place",className:"form-label",children:["Tempat Lahir ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",id:"birth_place",name:"birth_place",value:S.birth_place,onChange:Te,placeholder:"Contoh: Bandung",required:!0})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"birth_date",className:"form-label",children:["Tanggal Lahir ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"date",className:"form-control",id:"birth_date",name:"birth_date",value:S.birth_date,onChange:Te,required:!0})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"email",className:"form-label",children:["Email ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("div",{className:"registration-readonly-field",children:[e.jsx("input",{type:"email",className:"form-control",id:"email",value:S.email,disabled:!0}),e.jsx("i",{className:"bi bi-lock-fill"})]}),e.jsxs("small",{className:"registration-field-help",children:[e.jsx("i",{className:"bi bi-shield-lock"}),"Mengikuti email akun yang sedang login"]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"phone",className:"form-label",children:["Nomor Handphone ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"tel",className:"form-control",id:"phone",name:"phone",value:S.phone,onChange:Te,placeholder:"Contoh: 081234567890",required:!0}),e.jsxs("small",{className:"registration-field-help",children:[e.jsx("i",{className:"bi bi-whatsapp"}),"Gunakan nomor WhatsApp aktif"]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"last_education",className:"form-label",children:["Pendidikan Terakhir ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"last_education",name:"last_education",value:S.last_education,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Pendidikan"}),e.jsx("option",{value:"SMA",children:"SMA/Sederajat"}),e.jsx("option",{value:"D1",children:"D1"}),e.jsx("option",{value:"D2",children:"D2"}),e.jsx("option",{value:"D3",children:"D3"}),e.jsx("option",{value:"D4",children:"D4"}),e.jsx("option",{value:"S1",children:"S1"}),e.jsx("option",{value:"S2",children:"S2"}),e.jsx("option",{value:"S3",children:"S3"})]})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-mortarboard",title:"Pendidikan & Aktivitas",description:"Ceritakan sedikit mengenai latar belakang pendidikan dan aktivitas Anda."}),e.jsxs("div",{className:"row registration-form-row",children:[e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"major",className:"form-label",children:["Jurusan ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",id:"major",name:"major",value:S.major,onChange:Te,placeholder:"Contoh: Teknik Informatika",required:!0})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"education_institution",className:"form-label",children:["Asal Institusi Pendidikan ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"text",className:"form-control",id:"education_institution",name:"education_institution",value:S.education_institution,onChange:Te,placeholder:"Contoh: Universitas Indonesia",required:!0})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"current_activity",className:"form-label",children:["Pekerjaan/Aktivitas Saat Ini ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"current_activity",name:"current_activity",value:S.current_activity,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Aktivitas"}),e.jsx("option",{value:"pelajar",children:"Pelajar"}),e.jsx("option",{value:"mahasiswa",children:"Mahasiswa"}),e.jsx("option",{value:"bekerja",children:"Bekerja"}),e.jsx("option",{value:"tidak_bekerja",children:"Tidak Bekerja"}),e.jsx("option",{value:"pencari_kerja",children:"Pencari Kerja"})]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"marital_status",className:"form-label",children:["Status Pernikahan ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"marital_status",name:"marital_status",value:S.marital_status,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Status"}),e.jsx("option",{value:"belum_menikah",children:"Belum Menikah"}),e.jsx("option",{value:"sudah_menikah",children:"Sudah Menikah"}),e.jsx("option",{value:"sudah_menikah_dan_memiliki_anak",children:"Sudah Menikah dan Memiliki Anak"})]})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-telephone",title:"Kontak Orang Tua / Wali",description:"Kontak ini hanya digunakan apabila diperlukan selama proses program."}),e.jsxs("div",{className:"row registration-form-row",children:[e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"parent_relationship",className:"form-label",children:["Hubungan dengan Orang Tua/Wali ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"parent_relationship",name:"parent_relationship",value:S.parent_relationship,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Hubungan"}),e.jsx("option",{value:"ayah",children:"Ayah"}),e.jsx("option",{value:"ibu",children:"Ibu"}),e.jsx("option",{value:"kakak",children:"Kakak"}),e.jsx("option",{value:"kerabat",children:"Kerabat"})]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"parent_phone",className:"form-label",children:["Nomor Handphone Orang Tua/Wali ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{type:"tel",className:"form-control",id:"parent_phone",name:"parent_phone",value:S.parent_phone,onChange:Te,placeholder:"Contoh: 081234567890",required:!0})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-person-badge",title:"Alamat Sesuai KTP",description:"Masukkan alamat yang tercantum pada identitas resmi Anda."}),e.jsxs("div",{className:"row registration-form-row",children:[e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"ktp_province",className:"form-label",children:["Provinsi ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"ktp_province",name:"ktp_province",value:S.ktp_province,onChange:Te,required:!0,children:[e.jsx("option",{value:"",children:b?"Memuat provinsi...":"Pilih Provinsi"}),u.map(F=>e.jsx("option",{value:F.code,children:F.name},F.code))]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"ktp_city",className:"form-label",children:["Kabupaten/Kota ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"ktp_city",name:"ktp_city",value:S.ktp_city,onChange:Te,disabled:!S.ktp_province||Et(S.ktp_province),required:!0,children:[e.jsx("option",{value:"",children:Et(S.ktp_province)?"Memuat Kabupaten/Kota...":"Pilih Kabupaten/Kota"}),An(S.ktp_province).map(F=>e.jsx("option",{value:F.code,children:F.name},F.code))]})]}),e.jsxs("div",{className:"col-12 registration-field",children:[e.jsxs("label",{htmlFor:"ktp_address",className:"form-label",children:["Detail Alamat ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{className:"form-control",id:"ktp_address",name:"ktp_address",rows:"3",value:S.ktp_address,onChange:Te,placeholder:"Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan",required:!0}),e.jsxs("small",{className:"registration-field-help",children:[e.jsx("i",{className:"bi bi-geo-alt"}),"Tuliskan alamat selengkap mungkin"]})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-house-door",title:"Alamat Domisili",description:"Alamat tempat tinggal Anda saat ini.",children:e.jsxs("label",{className:"registration-same-address",htmlFor:"same_as_ktp",children:[e.jsx("input",{type:"checkbox",id:"same_as_ktp",checked:he,onChange:Ra}),e.jsx("span",{className:"registration-custom-checkbox"}),e.jsxs("span",{className:"registration-same-address-text",children:[e.jsx("strong",{children:"Sama dengan KTP"}),e.jsx("small",{children:"Salin otomatis"})]})]})}),e.jsxs("div",{className:`row registration-form-row ${he?"registration-fields-synced":""}`,children:[e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"domicile_province",className:"form-label",children:["Provinsi ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"domicile_province",name:"domicile_province",value:S.domicile_province,onChange:Te,disabled:he,required:!0,children:[e.jsx("option",{value:"",children:"Pilih Provinsi"}),u.map(F=>e.jsx("option",{value:F.code,children:F.name},F.code))]})]}),e.jsxs("div",{className:"col-md-6 registration-field",children:[e.jsxs("label",{htmlFor:"domicile_city",className:"form-label",children:["Kabupaten/Kota ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select",id:"domicile_city",name:"domicile_city",value:S.domicile_city,onChange:Te,disabled:he||!S.domicile_province||Et(S.domicile_province),required:!0,children:[e.jsx("option",{value:"",children:Et(S.domicile_province)?"Memuat Kabupaten/Kota...":"Pilih Kabupaten/Kota"}),An(S.domicile_province).map(F=>e.jsx("option",{value:F.code,children:F.name},F.code))]})]}),e.jsxs("div",{className:"col-12 registration-field",children:[e.jsxs("label",{htmlFor:"domicile_address",className:"form-label",children:["Detail Alamat ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{className:"form-control",id:"domicile_address",name:"domicile_address",rows:"3",value:S.domicile_address,onChange:Te,disabled:he,placeholder:"Masukkan alamat lengkap domisili saat ini",required:!0})]})]}),he&&e.jsxs("div",{className:"registration-sync-notice",children:[e.jsx("i",{className:"bi bi-check-circle-fill"}),e.jsx("span",{children:"Alamat domisili otomatis mengikuti alamat KTP."})]})]})]}),O=({program:F,compact:ne=!1})=>{if(!F)return null;const je=bf(F),Ge=Number(F.down_payment||0),Ue=Number(F.job_matching_cost||0);return e.jsxs("div",{className:ne?"program-select-finance":"registration-program-finance",children:[e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Biaya Pelatihan"}),e.jsx("strong",{children:qe.formatCurrency(F.training_cost||0)})]})]}),je&&e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-person-workspace"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Pendampingan Job Matching"}),e.jsx("strong",{children:qe.formatCurrency(Ue)})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-airplane"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Biaya Keberangkatan"}),e.jsx("strong",{children:qe.formatCurrency(F.departure_cost||0)})]})]}),Ge>0&&e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-cash-stack"})}),e.jsxs("div",{children:[e.jsx("small",{children:"DP / Uang Muka"}),e.jsx("strong",{children:qe.formatCurrency(Ge)})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-arrow-repeat"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Skema Pembayaran"}),e.jsx("strong",{children:vf(F)})]})]})]})},le=()=>e.jsxs("div",{className:"registration-step-content",children:[e.jsxs("div",{className:"registration-step-heading",children:[e.jsx("div",{className:"registration-step-index",children:"02"}),e.jsxs("div",{children:[e.jsx("span",{className:"registration-step-eyebrow",children:"PILIHAN PROGRAM"}),e.jsx("h4",{children:"Pilih Jalur Terbaik untuk Anda"}),e.jsx("p",{children:"Bandingkan program yang tersedia dan pilih sesuai kebutuhan serta kesiapan Anda."})]})]}),e.jsxs("div",{className:"registration-info-strip program-info",children:[e.jsx("div",{className:"registration-info-strip-icon",children:e.jsx("i",{className:"bi bi-lightbulb"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Tidak perlu terburu-buru memilih"}),e.jsx("span",{children:"Perhatikan durasi, jadwal, biaya, skema pembayaran dan persyaratan masing-masing program."})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-briefcase",title:"Pilih Program",description:"Klik salah satu kartu untuk memilih program.",required:!0}),y?e.jsxs("div",{className:"registration-loading-state",children:[e.jsx("div",{className:"spinner-border",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})}),e.jsx("strong",{children:"Menyiapkan pilihan program"}),e.jsx("span",{children:"Mohon tunggu sebentar..."})]}):pe.length===0?e.jsxs("div",{className:"registration-empty-state",children:[e.jsx("div",{className:"registration-empty-icon",children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsx("strong",{children:"Belum ada program tersedia"}),e.jsx("span",{children:"Silakan kembali lagi setelah program dibuka."})]}):e.jsx("div",{className:"row program-selection-grid",children:pe.map((F,ne)=>e.jsx("div",{className:"col-lg-6",children:e.jsxs("label",{htmlFor:`program-${F.id}`,className:`program-select-card ${String(S.program_id)===String(F.id)?"selected":""}`,children:[e.jsx("input",{type:"radio",id:`program-${F.id}`,name:"program_selection",value:F.id,checked:String(S.program_id)===String(F.id),onChange:je=>ee(Ge=>({...Ge,program_id:je.target.value,n4_file:null,n4_preview:null,ssw_file:null,ssw_preview:null}))}),e.jsxs("div",{className:"program-select-header",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"program-select-label",children:["PROGRAM"," ",String(ne+1).padStart(2,"0")]}),e.jsx("h5",{children:F.name})]}),e.jsx("div",{className:"program-select-indicator",children:e.jsx("i",{className:"bi bi-check-lg"})})]}),e.jsx("p",{className:"program-select-description",children:F.description?`${F.description.substring(0,170)}${F.description.length>170?"...":""}`:"Informasi lengkap program tersedia pada halaman program."}),e.jsxs("div",{className:"program-select-meta",children:[e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-clock"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Durasi"}),e.jsx("strong",{children:F.duration||"-"})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"program-meta-icon",children:e.jsx("i",{className:"bi bi-people"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Kuota"}),e.jsx("strong",{children:Number(F.capacity||0)>0?`${F.capacity} peserta`:"-"})]})]})]}),e.jsx(O,{program:F,compact:!0}),e.jsxs("div",{className:"program-select-schedule",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-calendar3"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Jadwal Program"}),e.jsx("span",{children:F.schedule||"-"})]})]}),F.location&&e.jsxs("div",{className:"program-select-schedule",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-geo-alt"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Lokasi"}),e.jsx("span",{children:F.location})]})]}),e.jsx("div",{className:"program-select-footer",children:String(S.program_id)===String(F.id)?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-check-circle-fill"}),"Program dipilih"]}):e.jsxs(e.Fragment,{children:["Pilih program ini",e.jsx("i",{className:"bi bi-arrow-right"})]})})]})},F.id))})]}),Ke&&e.jsxs("div",{className:"registration-selected-summary",children:[e.jsx("div",{className:"registration-selected-summary-icon",children:e.jsx("i",{className:"bi bi-check2-circle"})}),e.jsxs("div",{children:[e.jsx("small",{children:"PROGRAM TERPILIH"}),e.jsx("strong",{children:Ke.name}),e.jsx("span",{children:"Anda masih dapat mengganti pilihan sebelum melanjutkan."})]})]}),Oa&&e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-file-earmark-check",title:"Dokumen Fast Track",description:"Lengkapi dokumen khusus untuk melanjutkan melalui Program Fast Track.",required:!0}),e.jsxs("div",{className:"registration-fasttrack-banner",children:[e.jsx("i",{className:"bi bi-lightning-charge-fill"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Persyaratan khusus Program Fast Track"}),e.jsx("span",{children:"Sertifikat N4 dan SSW wajib diunggah sebelum melanjutkan."})]})]}),e.jsxs("div",{className:"row registration-form-row",children:[e.jsx("div",{className:"col-md-6 registration-field",children:e.jsxs("label",{htmlFor:"n4",className:"registration-document-upload",children:[e.jsx("input",{type:"file",id:"n4",accept:".jpg,.jpeg,.png,.pdf",onChange:F=>oa("n4",F.target.files[0]),disabled:vt("n4")}),e.jsx("div",{className:"registration-document-icon",children:e.jsx("i",{className:"bi bi-file-earmark-text"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Sertifikat N4"}),e.jsx("span",{children:"JPG, PNG atau PDF • Maks. 10 MB"}),e.jsx("small",{children:S.n4_file?S.n4_file.name:"Klik untuk memilih dokumen"})]}),S.n4_file&&e.jsx("i",{className:"bi bi-check-circle-fill registration-document-check"})]})}),e.jsx("div",{className:"col-md-6 registration-field",children:e.jsxs("label",{htmlFor:"ssw",className:"registration-document-upload",children:[e.jsx("input",{type:"file",id:"ssw",accept:".jpg,.jpeg,.png,.pdf",onChange:F=>oa("ssw",F.target.files[0]),disabled:vt("ssw")}),e.jsx("div",{className:"registration-document-icon",children:e.jsx("i",{className:"bi bi-file-earmark-text"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Sertifikat SSW"}),e.jsx("span",{children:"JPG, PNG atau PDF • Maks. 10 MB"}),e.jsx("small",{children:S.ssw_file?S.ssw_file.name:"Klik untuk memilih dokumen"})]}),S.ssw_file&&e.jsx("i",{className:"bi bi-check-circle-fill registration-document-check"})]})})]})]})]});function me({label:F,value:ne,icon:je="bi-check2"}){return e.jsxs("div",{className:"registration-confirm-item",children:[e.jsx("div",{className:"registration-confirm-icon",children:e.jsx("i",{className:`bi ${je}`})}),e.jsxs("div",{children:[e.jsx("small",{children:F}),e.jsx("strong",{children:ne||"-"})]})]})}const sa=()=>e.jsxs("div",{className:"registration-step-content",children:[e.jsxs("div",{className:"registration-step-heading",children:[e.jsx("div",{className:"registration-step-index",children:"03"}),e.jsxs("div",{children:[e.jsx("span",{className:"registration-step-eyebrow",children:"LANGKAH TERAKHIR"}),e.jsx("h4",{children:"Periksa Sebelum Mengirim"}),e.jsx("p",{children:"Pastikan seluruh informasi sudah benar sebelum pendaftaran dikirim."})]})]}),e.jsxs("div",{className:"registration-review-hero",children:[e.jsx("div",{className:"registration-review-avatar",children:S.photo_preview?e.jsx("img",{src:S.photo_preview,alt:S.full_name}):e.jsx("i",{className:"bi bi-person"})}),e.jsxs("div",{className:"registration-review-person",children:[e.jsx("small",{children:"CALON PESERTA"}),e.jsx("h5",{children:S.full_name||"Nama Peserta"}),e.jsx("span",{children:S.email})]}),e.jsxs("div",{className:"registration-review-program",children:[e.jsx("small",{children:"PROGRAM PILIHAN"}),e.jsx("strong",{children:Ke?.name||"-"})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-person-check",title:"Data Diri",description:"Periksa kembali informasi pribadi Anda."}),e.jsxs("div",{className:"registration-confirm-grid",children:[e.jsx(me,{label:"Nama Lengkap",value:S.full_name,icon:"bi-person"}),e.jsx(me,{label:"NIK",value:S.nik,icon:"bi-person-vcard"}),e.jsx(me,{label:"Jenis Kelamin",value:S.gender==="L"?"Laki-laki":S.gender==="P"?"Perempuan":"-",icon:"bi-people"}),e.jsx(me,{label:"Tempat, Tanggal Lahir",value:`${S.birth_place||"-"}, ${S.birth_date||"-"}`,icon:"bi-calendar-event"}),e.jsx(me,{label:"Email",value:S.email,icon:"bi-envelope"}),e.jsx(me,{label:"Nomor Handphone",value:S.phone,icon:"bi-phone"})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-mortarboard",title:"Pendidikan & Aktivitas",description:"Ringkasan latar belakang pendidikan Anda."}),e.jsxs("div",{className:"registration-confirm-grid",children:[e.jsx(me,{label:"Pendidikan Terakhir",value:B("last_education",S.last_education),icon:"bi-mortarboard"}),e.jsx(me,{label:"Jurusan",value:S.major,icon:"bi-book"}),e.jsx(me,{label:"Institusi Pendidikan",value:S.education_institution,icon:"bi-building"}),e.jsx(me,{label:"Aktivitas Saat Ini",value:B("current_activity",S.current_activity),icon:"bi-briefcase"}),e.jsx(me,{label:"Status Pernikahan",value:B("marital_status",S.marital_status),icon:"bi-person-hearts"}),e.jsx(me,{label:"Hubungan Orang Tua/Wali",value:B("parent_relationship",S.parent_relationship),icon:"bi-people"}),e.jsx(me,{label:"Nomor HP Orang Tua/Wali",value:S.parent_phone,icon:"bi-telephone"})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-geo-alt",title:"Alamat",description:"Pastikan informasi tempat tinggal sudah sesuai."}),e.jsxs("div",{className:"registration-address-review-grid",children:[e.jsxs("div",{className:"registration-address-review-card",children:[e.jsxs("div",{className:"registration-address-review-header",children:[e.jsx("div",{className:"registration-address-review-icon",children:e.jsx("i",{className:"bi bi-person-vcard"})}),e.jsxs("div",{className:"registration-address-review-title",children:[e.jsx("small",{children:"ALAMAT IDENTITAS"}),e.jsx("strong",{children:"Alamat Sesuai KTP"})]})]}),e.jsxs("div",{className:"registration-address-review-body",children:[e.jsx("p",{children:S.ktp_address||"-"}),e.jsxs("div",{className:"registration-address-review-location",children:[e.jsx("i",{className:"bi bi-geo-alt"}),e.jsx("span",{children:S.ktp_city_name&&S.ktp_province_name?`${S.ktp_city_name}, ${S.ktp_province_name}`:"-"})]})]})]}),e.jsxs("div",{className:"registration-address-review-card",children:[e.jsxs("div",{className:"registration-address-review-header",children:[e.jsx("div",{className:"registration-address-review-icon domicile",children:e.jsx("i",{className:"bi bi-house-door"})}),e.jsxs("div",{className:"registration-address-review-title",children:[e.jsx("small",{children:"TEMPAT TINGGAL"}),e.jsx("strong",{children:"Alamat Domisili"})]})]}),e.jsxs("div",{className:"registration-address-review-body",children:[e.jsx("p",{children:S.domicile_address||"-"}),e.jsxs("div",{className:"registration-address-review-location",children:[e.jsx("i",{className:"bi bi-geo-alt"}),e.jsx("span",{children:S.domicile_city_name&&S.domicile_province_name?`${S.domicile_city_name}, ${S.domicile_province_name}`:"-"})]}),he&&e.jsxs("div",{className:"registration-address-same-badge",children:[e.jsx("i",{className:"bi bi-check-circle-fill"}),e.jsx("span",{children:"Sama dengan KTP"})]})]})]})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-briefcase",title:"Program yang Dipilih",description:"Ringkasan program pilihan Anda."}),e.jsxs("div",{className:"registration-program-review-card",children:[e.jsxs("div",{className:"registration-program-review-header",children:[e.jsx("div",{className:"registration-program-review-icon",children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsxs("div",{className:"registration-program-review-title",children:[e.jsx("small",{children:"PROGRAM FITALENTA"}),e.jsx("strong",{children:Ke?.name||"-"})]})]}),e.jsxs("div",{className:"registration-program-review-meta",children:[e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-clock"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Durasi"}),e.jsx("strong",{children:Ke?.duration||"-"})]})]}),e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Biaya Pelatihan"}),e.jsx("strong",{children:Ke?qe.formatCurrency(Ke.training_cost||0):"-"})]})]}),Tt&&e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-person-workspace"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Pendampingan Job Matching"}),e.jsx("strong",{children:qe.formatCurrency(Ke?.job_matching_cost||0)})]})]}),e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-airplane"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Biaya Keberangkatan"}),e.jsx("strong",{children:Ke?qe.formatCurrency(Ke.departure_cost||0):"-"})]})]}),e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-cash-stack"})}),e.jsxs("div",{children:[e.jsx("small",{children:"DP / Uang Muka"}),e.jsx("strong",{children:hN(Ke)})]})]}),e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-arrow-repeat"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Skema Pembayaran"}),e.jsx("strong",{children:vf(Ke)})]})]}),e.jsxs("div",{className:"registration-program-review-item",children:[e.jsx("div",{className:"registration-program-meta-icon",children:e.jsx("i",{className:"bi bi-calendar3"})}),e.jsxs("div",{children:[e.jsx("small",{children:"Jadwal"}),e.jsx("strong",{children:Ke?.schedule||"-"})]})]})]})]})]}),Oa&&e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-file-earmark-check",title:"Dokumen Fast Track",description:"Dokumen yang akan dikirim bersama pendaftaran."}),e.jsxs("div",{className:"registration-confirm-grid",children:[e.jsx(me,{label:"Sertifikat N4",value:S.n4_file?.name||"Belum diupload",icon:"bi-file-earmark-check"}),e.jsx(me,{label:"Sertifikat SSW",value:S.ssw_file?.name||"Belum diupload",icon:"bi-file-earmark-check"})]})]}),e.jsxs("section",{className:"registration-form-section",children:[e.jsx(ja,{icon:"bi-shield-check",title:"Konfirmasi & Persetujuan",description:"Satu langkah terakhir sebelum pendaftaran dikirim."}),e.jsxs("label",{className:`registration-agreement ${ge?"checked":""}`,htmlFor:"agreement",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",id:"agreement",checked:ge,onChange:F=>ye(F.target.checked)}),e.jsx("div",{className:"registration-agreement-icon",children:e.jsx("i",{className:"bi bi-shield-check"})}),e.jsxs("div",{className:"registration-agreement-content",children:[e.jsx("strong",{children:"Saya memastikan data yang saya berikan benar"}),e.jsxs("span",{children:["Saya menyatakan seluruh data yang tercantum di atas adalah benar dan valid serta telah membaca, memahami, dan menyetujui Syarat dan Ketentuan Program FITALENTA.",e.jsxs("span",{className:"text-danger",children:[" ","*"]})]})]}),e.jsx("div",{className:"registration-agreement-check",children:e.jsx("i",{className:"bi bi-check-lg"})})]}),e.jsxs("div",{className:"registration-warning-box",children:[e.jsx("div",{className:"registration-warning-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Periksa sekali lagi sebelum mengirim"}),e.jsx("span",{children:"Data yang telah dikirim tidak dapat diubah. Setelah formulir terkirim, Anda akan masuk ke proses seleksi interview."})]})]})]})]}),ya=()=>e.jsxs("div",{className:"registration-floating-help",children:[e.jsx("button",{type:"button",onClick:()=>Se(F=>!F),"aria-label":"Bantuan pendaftaran",children:e.jsx("i",{className:"bi bi-question-lg"})}),Ce&&e.jsxs("div",{className:"registration-help-popup",children:[e.jsx("strong",{children:"Mengalami kendala?"}),e.jsx("span",{children:"Tim FITALENTA siap membantu proses pendaftaran Anda."}),e.jsx("a",{href:"https://wa.me/6281110119273",target:"_blank",rel:"noreferrer",children:"Hubungi Tim FITALENTA"})]})]}),Tn=()=>e.jsx("div",{className:`modal fade ${q?"show":""}`,style:{display:q?"block":"none"},tabIndex:"-1",role:"dialog","aria-modal":q?"true":void 0,children:e.jsx("div",{className:"modal-dialog modal-dialog-centered",children:e.jsxs("div",{className:"modal-content registration-success-modal",children:[e.jsx("div",{className:"registration-success-illustration",children:e.jsx("div",{className:"registration-success-circle",children:e.jsx("i",{className:"bi bi-check-lg"})})}),e.jsxs("div",{className:"modal-body text-center",children:[e.jsx("span",{className:"registration-success-label",children:"PENDAFTARAN BERHASIL"}),e.jsx("h4",{children:"Selamat, pendaftaran Anda telah diterima!"}),e.jsxs("p",{children:["Anda telah berhasil mendaftar pada program"," ",e.jsx("strong",{children:Ke?.name}),"."]}),e.jsxs("div",{className:"registration-code-card",children:[e.jsx("small",{children:"NOMOR PENDAFTARAN"}),e.jsxs("strong",{children:["#",re?.registration_code]}),e.jsx("span",{children:"Simpan nomor ini untuk kebutuhan selanjutnya."})]}),e.jsxs("div",{className:"registration-next-step",children:[e.jsx("i",{className:"bi bi-whatsapp"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Pantau WhatsApp Anda"}),e.jsx("span",{children:"Informasi proses seleksi berikutnya akan disampaikan melalui nomor yang Anda daftarkan."})]})]})]}),e.jsx("div",{className:"modal-footer justify-content-center",children:e.jsxs("button",{type:"button",className:"btn btn-primary",onClick:()=>se("/dashboard"),children:[e.jsx("span",{children:"Lihat Detail Program"}),e.jsx("i",{className:"bi bi-arrow-right"})]})})]})})}),Qs=()=>!I||D==="idle"?null:D==="saving"?e.jsxs("div",{className:"d-flex align-items-center justify-content-center gap-2 text-muted small mb-3",children:[e.jsx("i",{className:"bi bi-cloud-arrow-up"}),e.jsx("span",{children:"Menyimpan perubahan..."})]}):D==="restored"?e.jsxs("div",{className:"d-flex align-items-center justify-content-center gap-2 text-success small mb-3",children:[e.jsx("i",{className:"bi bi-cloud-check"}),e.jsx("span",{children:"Data sebelumnya dipulihkan dan tersimpan otomatis"})]}):D==="error"?e.jsxs("div",{className:"d-flex align-items-center justify-content-center gap-2 text-danger small mb-3",children:[e.jsx("i",{className:"bi bi-cloud-slash"}),e.jsx("span",{children:"Penyimpanan otomatis tidak tersedia"})]}):e.jsxs("div",{className:"d-flex align-items-center justify-content-center gap-2 text-muted small mb-3",children:[e.jsx("i",{className:"bi bi-cloud-check"}),e.jsx("span",{children:"Tersimpan otomatis"})]}),Qn=[{icon:"bi-person-vcard",title:"KTP / NIK",description:"Siapkan 16 digit NIK dan informasi alamat sesuai identitas resmi."},{icon:"bi-camera",title:"Foto Terbaru",description:"Gunakan foto terbaru dalam format JPG atau PNG, maksimal 10 MB."},{icon:"bi-whatsapp",title:"WhatsApp Aktif",description:"Pastikan nomor WhatsApp aktif dan dapat dihubungi oleh tim FITALENTA."},{icon:"bi-mortarboard",title:"Data Pendidikan",description:"Siapkan pendidikan terakhir, jurusan, dan institusi pendidikan."},{icon:"bi-geo-alt",title:"Alamat Domisili",description:"Siapkan alamat tempat tinggal Anda saat ini."},{icon:"bi-file-earmark-check",title:"Dokumen Fast Track",description:"Siapkan Sertifikat N4 dan SSW apabila memilih Program Fast Track."}],en=[{step:1,icon:"bi-person-vcard",eyebrow:"LANGKAH PERTAMA",title:"Lengkapi Data Diri",description:"Isi seluruh identitas pribadi dan informasi pendukung secara lengkap sesuai dokumen resmi.",checklist:["Upload foto terbaru dalam format JPG atau PNG.","Isi nama lengkap dan 16 digit NIK sesuai KTP.","Lengkapi jenis kelamin, tempat lahir, dan tanggal lahir.","Pastikan nomor WhatsApp yang digunakan masih aktif.","Lengkapi pendidikan terakhir, jurusan, dan institusi pendidikan.","Pilih aktivitas saat ini dan status pernikahan.","Isi hubungan serta nomor handphone orang tua atau wali.","Lengkapi alamat sesuai KTP.","Lengkapi alamat domisili atau gunakan pilihan Sama dengan KTP."],result:"Data profil peserta lengkap dan siap digunakan."},{step:2,icon:"bi-briefcase",eyebrow:"LANGKAH KEDUA",title:"Pilih Program",description:"Pelajari program yang tersedia dan pilih jalur yang paling sesuai dengan kebutuhan serta kesiapan Anda.",checklist:["Lihat tujuh pilihan program yang tersedia.","Baca deskripsi dan informasi masing-masing program.","Perhatikan durasi pelaksanaan program.","Periksa jadwal program sebelum menentukan pilihan.","Perhatikan biaya pelatihan dan biaya keberangkatan.","Perhatikan DP dan skema cicilan apabila tersedia.","Program Hybrid memiliki biaya pendampingan Job Matching.","Klik kartu program untuk memilih program.","Pastikan bagian Program Terpilih menampilkan program yang benar."],result:"Program FITALENTA berhasil dipilih."},{step:3,icon:"bi-check2-circle",eyebrow:"LANGKAH TERAKHIR",title:"Periksa & Kirim",description:"Lakukan pemeriksaan terakhir sebelum mengirim pendaftaran ke FITALENTA.",checklist:["Periksa kembali identitas dan data pribadi.","Pastikan data pendidikan dan aktivitas sudah benar.","Periksa kembali kontak orang tua atau wali.","Pastikan alamat KTP dan domisili sudah sesuai.","Periksa program yang telah dipilih.","Periksa rincian biaya dan skema pembayaran program.","Periksa dokumen Fast Track apabila diperlukan.","Baca pernyataan konfirmasi dan persetujuan.","Centang persetujuan sebelum mengirim.","Klik tombol Kirim Pendaftaran."],result:"Pendaftaran dikirim dan masuk ke proses seleksi."}],Ct=["Persiapan","Data Diri","Pilih Program","Periksa & Kirim","Tahap Selanjutnya"],ut=Ct.length,Mt=()=>{ie(F=>Math.max(0,F-1))},Zn=()=>{ie(F=>Math.min(ut-1,F+1))},En=()=>{fe(!1),ie(0),window.requestAnimationFrame(()=>{document.getElementById("registration-form-area")?.scrollIntoView({behavior:"smooth",block:"start"})})},Zs=({data:F})=>e.jsxs("div",{className:"registration-guide-page",children:[e.jsxs("div",{className:"registration-guide-page-heading",children:[e.jsx("div",{className:"registration-guide-page-heading-icon",children:e.jsx("i",{className:`bi ${F.icon}`})}),e.jsxs("div",{children:[e.jsx("span",{children:F.eyebrow}),e.jsx("h4",{children:F.title}),e.jsx("p",{children:F.description})]})]}),e.jsxs("div",{className:"registration-guide-detail-layout",children:[e.jsxs("div",{className:"registration-guide-checklist",children:[e.jsx("span",{className:"registration-guide-section-label",children:"YANG PERLU ANDA LAKUKAN"}),F.checklist.map((ne,je)=>e.jsxs("div",{className:"registration-guide-check-item",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsx("span",{children:ne})]},`${F.step}-${je}`))]}),e.jsxs("div",{className:"registration-guide-side",children:[F.step===1&&e.jsxs("div",{className:"registration-guide-side-card",children:[e.jsx("div",{className:"registration-guide-side-icon",children:e.jsx("i",{className:"bi bi-person-vcard"})}),e.jsx("strong",{children:"Informasi yang akan diisi"}),e.jsx("span",{children:"Identitas pribadi, pendidikan, aktivitas, kontak orang tua atau wali, alamat KTP, alamat domisili, dan foto."})]}),F.step===2&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"registration-guide-side-card",children:[e.jsx("div",{className:"registration-guide-side-icon",children:e.jsx("i",{className:"bi bi-search"})}),e.jsx("strong",{children:"Bandingkan sebelum memilih"}),e.jsx("span",{children:"Perhatikan durasi, jadwal, biaya pelatihan, biaya keberangkatan, DP, cicilan dan persyaratan sebelum menentukan program."})]}),e.jsxs("div",{className:"registration-guide-fasttrack",children:[e.jsx("div",{className:"registration-guide-fasttrack-icon",children:e.jsx("i",{className:"bi bi-lightning-charge-fill"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Khusus Program Fast Track"}),e.jsx("span",{children:"Sertifikat N4 dan SSW wajib diunggah jika Anda memilih Program Fast Track."}),e.jsx("small",{children:"JPG, PNG atau PDF • Maksimal 10 MB per file"})]})]})]}),F.step===3&&e.jsxs("div",{className:"registration-guide-warning",children:[e.jsx("div",{className:"registration-guide-warning-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Periksa sebelum mengirim"}),e.jsx("span",{children:"Pastikan seluruh informasi benar sebelum menekan tombol Kirim Pendaftaran."})]})]}),e.jsxs("div",{className:"registration-guide-result",children:[e.jsxs("small",{children:["HASIL LANGKAH ",F.step]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-check-circle"}),e.jsx("strong",{children:F.result})]})]})]})]})]}),sl=()=>U===0?e.jsxs("div",{className:"registration-guide-page",children:[e.jsxs("div",{className:"registration-guide-page-heading",children:[e.jsx("div",{className:"registration-guide-page-heading-icon",children:e.jsx("i",{className:"bi bi-clipboard-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"SEBELUM MEMULAI"}),e.jsx("h4",{children:"Siapkan Data & Dokumen"}),e.jsx("p",{children:"Menyiapkan informasi berikut sebelum mulai akan membuat proses pendaftaran lebih cepat dan mengurangi kesalahan saat mengisi."})]})]}),e.jsx("div",{className:"registration-guide-preparation-grid",children:Qn.map(F=>e.jsxs("div",{className:"registration-guide-preparation-item",children:[e.jsx("div",{className:"registration-guide-preparation-icon",children:e.jsx("i",{className:`bi ${F.icon}`})}),e.jsxs("div",{children:[e.jsx("strong",{children:F.title}),e.jsx("span",{children:F.description})]})]},F.title))}),e.jsxs("div",{className:"registration-guide-tip",children:[e.jsx("div",{className:"registration-guide-tip-icon",children:e.jsx("i",{className:"bi bi-lightbulb"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Gunakan data sesuai dokumen resmi"}),e.jsx("span",{children:"Data yang konsisten dengan dokumen resmi membantu memperlancar proses verifikasi."})]})]})]}):U===1?e.jsx(Zs,{data:en[0]}):U===2?e.jsx(Zs,{data:en[1]}):U===3?e.jsx(Zs,{data:en[2]}):e.jsxs("div",{className:"registration-guide-page",children:[e.jsxs("div",{className:"registration-guide-page-heading",children:[e.jsx("div",{className:"registration-guide-page-heading-icon success",children:e.jsx("i",{className:"bi bi-send-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"SETELAH PENDAFTARAN DIKIRIM"}),e.jsx("h4",{children:"Apa yang Terjadi Selanjutnya?"}),e.jsx("p",{children:"Setelah formulir berhasil dikirim, pendaftaran Anda akan masuk ke proses seleksi FITALENTA."})]})]}),e.jsxs("div",{className:"registration-guide-after-flow",children:[e.jsxs("div",{className:"registration-guide-after-item",children:[e.jsx("div",{className:"registration-guide-after-number",children:"1"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Form Berhasil Dikirim"}),e.jsx("span",{children:"Sistem menampilkan nomor pendaftaran setelah proses pengiriman berhasil."})]})]}),e.jsx("div",{className:"registration-guide-after-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"registration-guide-after-item",children:[e.jsx("div",{className:"registration-guide-after-number",children:"2"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Masuk Proses Seleksi"}),e.jsx("span",{children:"Tim FITALENTA akan memproses pendaftaran dan melakukan pemeriksaan data Anda."})]})]}),e.jsx("div",{className:"registration-guide-after-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"registration-guide-after-item",children:[e.jsx("div",{className:"registration-guide-after-number",children:"3"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Informasi Lanjutan"}),e.jsx("span",{children:"Pantau dashboard dan nomor WhatsApp yang Anda gunakan saat mendaftar."})]})]})]}),e.jsxs("div",{className:"registration-guide-after-info",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-bookmark-check"})}),e.jsxs("span",{children:[e.jsx("strong",{children:"Simpan nomor pendaftaran Anda"}),e.jsx("small",{children:"Nomor pendaftaran dapat digunakan sebagai referensi selama proses selanjutnya."})]})]}),e.jsxs("div",{className:"registration-guide-ready",children:[e.jsx("div",{className:"registration-guide-ready-icon",children:e.jsx("i",{className:"bi bi-check2-circle"})}),e.jsxs("div",{children:[e.jsx("small",{children:"PANDUAN SELESAI"}),e.jsx("strong",{children:"Anda siap melakukan pendaftaran"}),e.jsx("span",{children:"Klik tombol Mulai Isi Formulir untuk melanjutkan."})]})]})]});return e.jsx("div",{className:"program-registration-page",children:e.jsxs("div",{className:"registration-shell",children:[e.jsxs("header",{className:"registration-header",children:[e.jsx("span",{className:"registration-header-badge",children:"FITALENTA PROGRAM"}),e.jsx("h2",{children:"Mulai Perjalanan Karier Anda"}),e.jsx("p",{children:"Lengkapi beberapa informasi berikut untuk mendaftar program FITALENTA. Prosesnya hanya terdiri dari tiga langkah."}),e.jsxs("div",{className:"registration-header-benefits",children:[e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-shield-check"}),"Data aman"]}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-clock"}),"± 5–10 menit"]}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-check-circle"}),"3 langkah"]})]})]}),e.jsx("div",{className:"registration-stepper",children:[1,2,3].map(F=>{const ne={1:{title:"Data Diri",subtitle:"Kenali Anda",icon:"bi-person"},2:{title:"Program",subtitle:"Pilih jalur",icon:"bi-briefcase"},3:{title:"Konfirmasi",subtitle:"Periksa data",icon:"bi-check2-circle"}};return e.jsxs(Sd.Fragment,{children:[e.jsxs("div",{className:`registration-step-item ${F===i?"active":""} ${F<i?"completed":""}`,children:[e.jsx("div",{className:"registration-step-circle",children:F<i?e.jsx("i",{className:"bi bi-check-lg"}):e.jsx("i",{className:`bi ${ne[F].icon}`})}),e.jsxs("div",{className:"registration-step-label",children:[e.jsxs("small",{children:["LANGKAH ",F]}),e.jsx("strong",{children:ne[F].title}),e.jsx("span",{children:ne[F].subtitle})]})]}),F<3&&e.jsx("div",{className:`registration-step-line ${i>F?"completed":""}`,children:e.jsx("span",{})})]},F)})}),e.jsxs("div",{className:"registration-mobile-progress",children:[e.jsxs("div",{children:[e.jsxs("span",{children:["Langkah ",i," dari 3"]}),e.jsxs("strong",{children:[i===1&&"Lengkapi data diri",i===2&&"Pilih program",i===3&&"Konfirmasi pendaftaran"]})]}),e.jsxs("span",{children:[Math.round(i/3*100),"%"]}),e.jsx("div",{className:"registration-mobile-progress-bar",children:e.jsx("span",{style:{width:`${i/3*100}%`}})})]}),_&&e.jsxs("div",{className:"registration-message registration-message-danger",children:[e.jsx("div",{className:"registration-message-icon",children:e.jsx("i",{className:"bi bi-exclamation-circle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Beberapa data masih perlu dilengkapi"}),e.jsx("span",{children:_})]})]}),L&&e.jsxs("div",{className:"registration-message registration-message-success",children:[e.jsx("div",{className:"registration-message-icon",children:e.jsx("i",{className:"bi bi-check-circle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Berhasil"}),e.jsx("span",{children:L})]})]}),e.jsx(Qs,{}),e.jsxs("section",{className:"registration-guide",children:[e.jsxs("div",{className:"registration-guide-header",children:[e.jsxs("div",{className:"registration-guide-heading",children:[e.jsx("div",{className:"registration-guide-heading-icon",children:e.jsx("i",{className:"bi bi-compass"})}),e.jsxs("div",{children:[e.jsx("span",{className:"registration-guide-eyebrow",children:"PANDUAN PENDAFTARAN"}),e.jsx("h3",{children:"Cara Mendaftar Program FITALENTA"}),e.jsx("p",{children:"Ikuti panduan singkat berikut sebelum mengisi formulir pendaftaran."})]})]}),e.jsxs("button",{type:"button",className:"registration-guide-toggle",onClick:()=>fe(F=>!F),"aria-expanded":Z,children:[e.jsx("span",{children:Z?"Sembunyikan":"Lihat Panduan"}),e.jsx("i",{className:`bi ${Z?"bi-chevron-up":"bi-chevron-down"}`})]})]}),Z&&e.jsxs("div",{className:"registration-guide-body",children:[e.jsxs("div",{className:"registration-guide-progress",children:[e.jsxs("div",{className:"registration-guide-progress-top",children:[e.jsxs("div",{children:[e.jsxs("span",{children:["PANDUAN"," ",U+1," DARI"," ",ut]}),e.jsx("strong",{children:Ct[U]})]}),e.jsxs("span",{className:"registration-guide-progress-percent",children:[Math.round((U+1)/ut*100),"%"]})]}),e.jsx("div",{className:"registration-guide-progress-track",children:e.jsx("span",{style:{width:`${(U+1)/ut*100}%`}})}),e.jsx("div",{className:"registration-guide-progress-steps",children:Ct.map((F,ne)=>e.jsxs("div",{className:`registration-guide-progress-step ${ne===U?"active":""} ${ne<U?"completed":""}`,children:[e.jsx("div",{children:ne<U?e.jsx("i",{className:"bi bi-check-lg"}):ne+1}),e.jsx("span",{children:F})]},F))})]}),e.jsx("div",{className:"registration-guide-content","aria-live":"polite",children:sl()}),e.jsxs("div",{className:"registration-guide-navigation",children:[e.jsxs("button",{type:"button",className:"registration-guide-nav previous",onClick:Mt,disabled:U===0,children:[e.jsx("i",{className:"bi bi-arrow-left"}),e.jsx("span",{children:"Sebelumnya"})]}),e.jsxs("div",{className:"registration-guide-navigation-status",children:[e.jsxs("span",{children:[U+1," /"," ",ut]}),e.jsx("small",{children:Ct[U]})]}),U<ut-1?e.jsxs("button",{type:"button",className:"registration-guide-nav next",onClick:Zn,children:[e.jsx("span",{children:"Selanjutnya"}),e.jsx("i",{className:"bi bi-arrow-right"})]}):e.jsxs("button",{type:"button",className:"registration-guide-nav start",onClick:En,children:[e.jsx("span",{children:"Mulai Isi Formulir"}),e.jsx("i",{className:"bi bi-arrow-down"})]})]}),e.jsxs("div",{className:"registration-guide-autosave",children:[e.jsx("div",{className:"registration-guide-autosave-icon",children:e.jsx("i",{className:"bi bi-cloud-check"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Form tersimpan otomatis"}),e.jsx("span",{children:"Data yang Anda isi akan disimpan otomatis di browser. Foto dan dokumen perlu dipilih kembali apabila halaman dimuat ulang."})]})]})]})]}),e.jsx("form",{id:"registration-form-area",onSubmit:Js,noValidate:!0,children:e.jsxs("div",{className:"registration-main-card",children:[e.jsxs("div",{className:"registration-main-body",children:[i===1&&Xs(),i===2&&le(),i===3&&sa()]}),e.jsxs("div",{className:"registration-navigation",children:[e.jsxs("button",{type:"button",className:"registration-nav-btn previous",onClick:Vs,disabled:i===1,children:[e.jsx("i",{className:"bi bi-arrow-left"}),e.jsx("span",{children:"Sebelumnya"})]}),e.jsxs("div",{className:"registration-navigation-status",children:[e.jsxs("span",{children:[i===1&&"Data diri",i===2&&"Program & dokumen",i===3&&"Konfirmasi"]}),e.jsxs("small",{children:["Langkah ",i," dari 3"]})]}),i<3?e.jsxs("button",{type:"button",className:"registration-nav-btn next",onClick:pa,children:[e.jsx("span",{children:"Lanjutkan"}),e.jsx("i",{className:"bi bi-arrow-right"})]}):e.jsx("button",{type:"submit",className:"registration-nav-btn submit",disabled:M,children:M?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status"}),e.jsx("span",{children:"Mengirim..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-send-check"}),e.jsx("span",{children:"Kirim Pendaftaran"})]})})]})]})}),e.jsxs("div",{className:"registration-help-footer",children:[e.jsx("i",{className:"bi bi-question-circle"}),e.jsx("span",{children:"Mengalami kendala saat mengisi formulir?"}),e.jsx("a",{href:"https://wa.me/6281110119273",target:"_blank",rel:"noreferrer",children:"Hubungi tim FITALENTA"})]}),e.jsx(ya,{}),e.jsx(Tn,{}),q&&e.jsx("div",{className:"modal-backdrop fade show"})]})})},fN="https://www.fitalenta.co.id/",gN=()=>{const[i,l]=j.useState({email:"",password:""}),[d,o]=j.useState(!1),[u,h]=j.useState(!1),[p,x]=j.useState(""),{login:y,isAuthenticated:f,isAdmin:b,loading:v}=Wa(),A=Ys();j.useEffect(()=>{!v&&f&&A(b?"/admin":"/dashboard",{replace:!0})},[f,b,v,A]);const P=M=>{const{name:H,value:_}=M.target;l(E=>({...E,[H]:_})),p&&x("")},w=async M=>{M.preventDefault(),x("");const H=i.email.trim();if(!H||!i.password){x("Email dan password harus diisi.");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(H)){x("Format email tidak valid.");return}h(!0);try{const E=H.toLowerCase(),L=await y(E,i.password,!1);if(L.success)return;const q=await y(E,i.password,!0);q.success||x(q.message||L.message||"Login gagal. Silakan periksa kembali email dan password Anda.")}catch(E){console.error("Login error:",E),x("Terjadi kendala saat login. Silakan coba kembali beberapa saat lagi.")}finally{h(!1)}};return v?e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"simple-login-page",children:e.jsxs("div",{className:"simple-login-loading",children:[e.jsx("div",{className:"spinner-border",role:"status","aria-label":"Memuat"}),e.jsx("strong",{children:"Memeriksa autentikasi..."})]})}),e.jsx(yf,{})]}):e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"simple-login-page",children:e.jsxs("section",{className:"simple-login-shell",children:[e.jsxs("div",{className:"simple-login-intro",children:[e.jsxs("a",{href:fN,className:"simple-login-back",children:[e.jsx("i",{className:"bi bi-arrow-left"}),e.jsx("span",{children:"Kembali ke FITALENTA"})]}),e.jsxs("div",{className:"simple-login-intro-content",children:[e.jsx("span",{className:"simple-login-eyebrow",children:"FITALENTA REGISTRATION"}),e.jsx("h1",{children:"Selamat datang kembali"}),e.jsx("p",{children:"Masuk menggunakan akun peserta FITALENTA untuk melanjutkan proses pendaftaran program, seleksi, pembayaran, dan penyaluran."}),e.jsxs("div",{className:"simple-login-benefits",children:[e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Akses satu akun"}),e.jsx("small",{children:"Gunakan satu akun untuk seluruh proses pendaftaran FITALENTA."})]})]}),e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pantau proses Anda"}),e.jsx("small",{children:"Lihat status program, seleksi, pembayaran, dan perkembangan pendaftaran."})]})]}),e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Akses lebih aman"}),e.jsx("small",{children:"Informasi akun digunakan untuk mengakses layanan peserta FITALENTA."})]})]})]})]})]}),e.jsx("div",{className:"simple-login-form-side",children:e.jsxs("div",{className:"simple-login-card",children:[e.jsxs("header",{className:"simple-login-card-header",children:[e.jsx("div",{className:"simple-login-icon",children:e.jsx("i",{className:"bi bi-person-lock"})}),e.jsxs("div",{children:[e.jsx("span",{children:"AKSES PESERTA"}),e.jsx("h2",{children:"Login"}),e.jsx("p",{children:"Masukkan email dan password akun FITALENTA Anda."})]})]}),p&&e.jsxs("div",{className:"simple-login-error",role:"alert",children:[e.jsx("i",{className:"bi bi-exclamation-circle"}),e.jsx("span",{children:p})]}),e.jsxs("form",{onSubmit:w,className:"simple-login-form",noValidate:!0,children:[e.jsxs("div",{className:"simple-login-field",children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsxs("div",{className:"simple-login-input",children:[e.jsx("i",{className:"bi bi-envelope"}),e.jsx("input",{id:"email",type:"email",name:"email",value:i.email,onChange:P,placeholder:"contoh@email.com",autoComplete:"email",maxLength:150,disabled:u,required:!0})]})]}),e.jsxs("div",{className:"simple-login-field",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"simple-login-input simple-login-password",children:[e.jsx("i",{className:"bi bi-lock"}),e.jsx("input",{id:"password",type:d?"text":"password",name:"password",value:i.password,onChange:P,placeholder:"Masukkan password",autoComplete:"current-password",disabled:u,required:!0}),e.jsx("button",{type:"button",onClick:()=>o(M=>!M),disabled:u,"aria-label":d?"Sembunyikan password":"Tampilkan password",children:e.jsx("i",{className:d?"bi bi-eye-slash":"bi bi-eye"})})]})]}),e.jsx("button",{type:"submit",className:"simple-login-submit",disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm","aria-hidden":"true"}),e.jsx("span",{children:"Memproses..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Masuk ke Akun"}),e.jsx("i",{className:"bi bi-arrow-right"})]})})]}),e.jsxs("div",{className:"simple-login-register",children:[e.jsx("span",{children:"Belum punya akun?"}),e.jsx(Ve,{to:"/register",children:"Registrasi di sini"})]}),e.jsxs("div",{className:"simple-login-security",children:[e.jsx("i",{className:"bi bi-shield-check"}),e.jsx("span",{children:"Informasi akun Anda digunakan untuk mengakses layanan FITALENTA."})]})]})})]})}),e.jsx(yf,{})]})},yf=()=>e.jsx("style",{children:`

      :root {
        --sl-navy: #00294b;
        --sl-navy-dark: #001f3a;
        --sl-blue: #17578a;
        --sl-orange: #e8491d;
        --sl-bg: #f5f7fa;
        --sl-text: #102a43;
        --sl-muted: #6d7f90;
        --sl-border: #dfe6ed;
        --sl-white: #ffffff;
      }


      .simple-login-page,
      .simple-login-page * {
        box-sizing:
          border-box;
      }


      .simple-login-page {
        width:
          100%;

        min-height:
          100vh;

        margin:
          0;

        padding:
          0;

        background:
          var(
            --sl-bg
          );

        color:
          var(
            --sl-text
          );

        font-family:
          "Figtree",
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }


      /* =====================================
         SHELL
      ====================================== */

      .simple-login-shell {
        width:
          100%;

        min-height:
          calc(
            100vh - 96px
          );

        display:
          grid;

        grid-template-columns:
          minmax(
            360px,
            .9fr
          )
          minmax(
            520px,
            1.1fr
          );
      }


      /* =====================================
         LEFT SIDE
      ====================================== */

      .simple-login-intro {
        position:
          relative;

        min-height:
          100%;

        padding:
          42px
          clamp(
            36px,
            6vw,
            86px
          );

        display:
          flex;

        flex-direction:
          column;

        overflow:
          hidden;

        color:
          #ffffff;

        background:
          radial-gradient(
            circle at 12% 88%,
            rgba(
              255,
              255,
              255,
              .08
            ) 0,
            rgba(
              255,
              255,
              255,
              .08
            ) 130px,
            transparent 131px
          ),
          radial-gradient(
            circle at 100% 0%,
            rgba(
              255,
              255,
              255,
              .06
            ) 0,
            rgba(
              255,
              255,
              255,
              .06
            ) 170px,
            transparent 171px
          ),
          linear-gradient(
            145deg,
            #00294b 0%,
            #063c67 58%,
            #0d527f 100%
          );
      }


      .simple-login-back {
        position:
          relative;

        z-index:
          2;

        width:
          fit-content;

        display:
          inline-flex;

        align-items:
          center;

        gap:
          9px;

        color:
          rgba(
            255,
            255,
            255,
            .84
          );

        text-decoration:
          none;

        font-size:
          13px;

        font-weight:
          700;

        transition:
          .2s ease;
      }


      .simple-login-back:hover {
        color:
          #ffffff;

        transform:
          translateX(
            -2px
          );
      }


      .simple-login-intro-content {
        position:
          relative;

        z-index:
          2;

        width:
          min(
            520px,
            100%
          );

        margin:
          auto 0;

        padding:
          58px
          0;
      }


      .simple-login-eyebrow {
        display:
          inline-block;

        margin-bottom:
          15px;

        color:
          #ff8a67;

        font-size:
          11px;

        font-weight:
          800;

        letter-spacing:
          1.6px;
      }


      .simple-login-intro h1 {
        max-width:
          480px;

        margin:
          0;

        color:
          #ffffff;

        font-size:
          clamp(
            38px,
            4.2vw,
            58px
          );

        line-height:
          1.08;

        font-weight:
          800;

        letter-spacing:
          -1.2px;
      }


      .simple-login-intro-content > p {
        max-width:
          500px;

        margin:
          20px 0 0;

        color:
          rgba(
            255,
            255,
            255,
            .78
          );

        font-size:
          15px;

        line-height:
          1.75;
      }


      /* =====================================
         BENEFITS
      ====================================== */

      .simple-login-benefits {
        margin-top:
          36px;

        display:
          grid;

        gap:
          18px;
      }


      .simple-login-benefits > div {
        display:
          flex;

        align-items:
          flex-start;

        gap:
          12px;
      }


      .simple-login-benefits
      > div
      > span {
        width:
          30px;

        height:
          30px;

        flex:
          0 0 30px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        margin-top:
          1px;

        border:
          1px
          solid
          rgba(
            255,
            255,
            255,
            .15
          );

        border-radius:
          9px;

        background:
          rgba(
            255,
            255,
            255,
            .08
          );

        color:
          #ffffff;

        font-size:
          14px;
      }


      .simple-login-benefits p {
        margin:
          0;

        display:
          flex;

        flex-direction:
          column;

        gap:
          3px;
      }


      .simple-login-benefits strong {
        color:
          #ffffff;

        font-size:
          13px;

        font-weight:
          700;
      }


      .simple-login-benefits small {
        color:
          rgba(
            255,
            255,
            255,
            .66
          );

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         RIGHT SIDE
      ====================================== */

      .simple-login-form-side {
        min-width:
          0;

        padding:
          54px
          clamp(
            32px,
            6vw,
            86px
          );

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        background:
          #f7f9fb;
      }


      /* =====================================
         CARD
      ====================================== */

      .simple-login-card {
        width:
          min(
            520px,
            100%
          );

        padding:
          34px;

        border:
          1px
          solid
          var(
            --sl-border
          );

        border-radius:
          20px;

        background:
          #ffffff;

        box-shadow:
          0
          20px
          55px
          rgba(
            0,
            41,
            75,
            .08
          );
      }


      .simple-login-card-header {
        display:
          flex;

        align-items:
          center;

        gap:
          15px;

        margin-bottom:
          25px;
      }


      .simple-login-icon {
        width:
          50px;

        height:
          50px;

        flex:
          0 0 50px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border-radius:
          14px;

        background:
          #edf4fa;

        color:
          var(
            --sl-blue
          );

        font-size:
          21px;
      }


      .simple-login-card-header
      > div:last-child {
        min-width:
          0;
      }


      .simple-login-card-header span {
        display:
          block;

        margin-bottom:
          3px;

        color:
          var(
            --sl-orange
          );

        font-size:
          9px;

        font-weight:
          800;

        letter-spacing:
          1.1px;
      }


      .simple-login-card-header h2 {
        margin:
          0;

        color:
          var(
            --sl-navy
          );

        font-size:
          27px;

        line-height:
          1.2;

        font-weight:
          800;
      }


      .simple-login-card-header p {
        margin:
          5px 0 0;

        color:
          var(
            --sl-muted
          );

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         ERROR
      ====================================== */

      .simple-login-error {
        margin-bottom:
          18px;

        padding:
          12px
          14px;

        display:
          flex;

        align-items:
          flex-start;

        gap:
          9px;

        border:
          1px
          solid
          #f1c5bd;

        border-radius:
          10px;

        background:
          #fff4f2;

        color:
          #a73a29;

        font-size:
          11px;

        line-height:
          1.5;
      }


      /* =====================================
         FORM
      ====================================== */

      .simple-login-form {
        display:
          grid;

        gap:
          18px;
      }


      .simple-login-field label {
        display:
          block;

        margin-bottom:
          7px;

        color:
          #2c4053;

        font-size:
          11px;

        font-weight:
          700;
      }


      .simple-login-input {
        position:
          relative;
      }


      .simple-login-input > i {
        position:
          absolute;

        top:
          50%;

        left:
          14px;

        transform:
          translateY(
            -50%
          );

        z-index:
          2;

        color:
          #8b9baa;

        font-size:
          14px;

        pointer-events:
          none;
      }


      .simple-login-input input {
        width:
          100%;

        height:
          48px;

        padding:
          0 44px 0 42px;

        border:
          1px
          solid
          #d8e0e7;

        border-radius:
          10px;

        outline:
          none;

        background:
          #ffffff;

        color:
          var(
            --sl-text
          );

        font:
          inherit;

        font-size:
          12px;

        transition:
          border-color
          .2s ease,
          box-shadow
          .2s ease;
      }


      .simple-login-input
      input::placeholder {
        color:
          #a0adb8;
      }


      .simple-login-input
      input:focus {
        border-color:
          #5a8db3;

        box-shadow:
          0 0 0 3px
          rgba(
            23,
            87,
            138,
            .09
          );
      }


      /* =====================================
         PASSWORD
      ====================================== */

      .simple-login-password button {
        position:
          absolute;

        top:
          50%;

        right:
          7px;

        width:
          34px;

        height:
          34px;

        padding:
          0;

        transform:
          translateY(
            -50%
          );

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border:
          0;

        border-radius:
          8px;

        background:
          transparent;

        color:
          #8495a5;

        cursor:
          pointer;
      }


      /* =====================================
         SUBMIT
      ====================================== */

      .simple-login-submit {
        width:
          100%;

        height:
          50px;

        margin-top:
          4px;

        padding:
          0 17px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          10px;

        border:
          0;

        border-radius:
          10px;

        background:
          var(
            --sl-orange
          );

        color:
          #ffffff;

        font-size:
          12px;

        font-weight:
          800;

        cursor:
          pointer;

        box-shadow:
          0 9px
          20px
          rgba(
            232,
            73,
            29,
            .18
          );

        transition:
          .2s ease;
      }


      .simple-login-submit:hover:not(:disabled) {
        background:
          #d94218;

        transform:
          translateY(
            -1px
          );
      }


      .simple-login-submit:disabled {
        opacity:
          .72;

        cursor:
          not-allowed;
      }


      /* =====================================
         REGISTER LINK
      ====================================== */

      .simple-login-register {
        margin-top:
          23px;

        padding-top:
          19px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          5px;

        border-top:
          1px
          solid
          #e8edf2;

        color:
          var(
            --sl-muted
          );

        font-size:
          11px;
      }


      .simple-login-register a {
        color:
          var(
            --sl-blue
          );

        text-decoration:
          none;

        font-weight:
          800;
      }


      /* =====================================
         SECURITY
      ====================================== */

      .simple-login-security {
        margin-top:
          18px;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          7px;

        color:
          #8795a1;

        font-size:
          9px;

        text-align:
          center;

        line-height:
          1.45;
      }


      /* =====================================
         LOADING
      ====================================== */

      .simple-login-loading {
        min-height:
          calc(
            100vh - 96px
          );

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        gap:
          12px;

        color:
          var(
            --sl-navy
          );
      }


      /* =====================================
         RESPONSIVE
      ====================================== */

      @media (
        max-width: 799px
      ) {

        .simple-login-shell {
          min-height:
            calc(
              100vh - 80px
            );

          grid-template-columns:
            1fr;
        }

      }


      @media (
        max-width: 700px
      ) {

        .simple-login-intro {
          padding:
            28px
            20px;
        }


        .simple-login-intro-content {
          padding:
            38px
            0
            20px;
        }


        .simple-login-form-side {
          padding:
            30px
            16px
            48px;
        }


        .simple-login-card {
          padding:
            25px
            20px;

          border-radius:
            16px;
        }

      }


      @media (
        max-width: 480px
      ) {

        .simple-login-shell {
          min-height:
            calc(
              100vh - 76px
            );
        }

      }

    `}),xN="https://www.fitalenta.co.id/",bN=()=>{const[i,l]=j.useState({full_name:"",email:"",phone:"",password:"",confirmPassword:""}),[d,o]=j.useState(!1),[u,h]=j.useState(!1),[p,x]=j.useState(!1),[y,f]=j.useState(""),{register:b,isAuthenticated:v,isAdmin:A,loading:P}=Wa(),w=Ys();j.useEffect(()=>{!P&&v&&w(A?"/admin":"/dashboard",{replace:!0})},[v,A,P,w]);const M=j.useMemo(()=>({length:i.password.length>=6,match:i.confirmPassword.length>0&&i.password===i.confirmPassword}),[i.password,i.confirmPassword]),H=q=>{const{name:oe,value:re}=q.target;l(te=>({...te,[oe]:re})),y&&f("")},_=q=>{const oe=q.target.value.replace(/\D/g,"").slice(0,15);l(re=>({...re,phone:oe})),y&&f("")},E=()=>{const q=i.full_name.trim(),oe=i.email.trim(),re=i.phone.trim();return!q||!oe||!re||!i.password||!i.confirmPassword?"Semua field wajib diisi.":q.length<3?"Nama pengguna minimal terdiri dari 3 karakter.":/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oe)?re.length<10?"Nomor telepon minimal terdiri dari 10 digit.":i.password.length<6?"Password harus minimal 6 karakter.":i.password!==i.confirmPassword?"Password dan konfirmasi password tidak sama.":"":"Format email tidak valid."},L=async q=>{q.preventDefault(),f("");const oe=E();if(oe){f(oe);return}x(!0);try{const re={full_name:i.full_name.trim(),email:i.email.trim().toLowerCase(),phone:i.phone.trim(),password:i.password,address:""},te=await b(re);te.success||f(te.message||"Registrasi belum berhasil. Silakan periksa kembali data Anda.")}catch(re){console.error("Register error:",re),f("Terjadi kendala saat membuat akun. Silakan coba kembali beberapa saat lagi.")}finally{x(!1)}};return P?e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"simple-register-page",children:e.jsxs("div",{className:"simple-register-loading",children:[e.jsx("div",{className:"spinner-border",role:"status","aria-label":"Memuat"}),e.jsx("strong",{children:"Memeriksa autentikasi..."})]})}),e.jsx(Nf,{})]}):e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"simple-register-page",children:e.jsxs("section",{className:"simple-register-shell",children:[e.jsxs("div",{className:"simple-register-intro",children:[e.jsxs("a",{href:xN,className:"simple-register-back",children:[e.jsx("i",{className:"bi bi-arrow-left"}),e.jsx("span",{children:"Kembali ke FITALENTA"})]}),e.jsxs("div",{className:"simple-register-intro-content",children:[e.jsx("span",{className:"simple-register-eyebrow",children:"FITALENTA REGISTRATION"}),e.jsx("h1",{children:"Buat akun peserta"}),e.jsx("p",{children:"Daftar dengan data dasar terlebih dahulu. Kelengkapan profil dapat Anda isi setelah berhasil masuk ke akun FITALENTA."}),e.jsxs("div",{className:"simple-register-benefits",children:[e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Registrasi lebih cepat"}),e.jsx("small",{children:"Hanya informasi dasar untuk membuat akun."})]})]}),e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Lengkapi setelah login"}),e.jsx("small",{children:"Alamat dan data pendaftaran diisi setelah akun aktif."})]})]}),e.jsxs("div",{children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-check2"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pilih program FITALENTA"}),e.jsx("small",{children:"Gunakan akun untuk melanjutkan proses pendaftaran program."})]})]})]})]})]}),e.jsx("div",{className:"simple-register-form-side",children:e.jsxs("div",{className:"simple-register-card",children:[e.jsxs("header",{className:"simple-register-card-header",children:[e.jsx("div",{className:"simple-register-icon",children:e.jsx("i",{className:"bi bi-person-plus"})}),e.jsxs("div",{children:[e.jsx("span",{children:"AKUN PESERTA BARU"}),e.jsx("h2",{children:"Registrasi"}),e.jsx("p",{children:"Masukkan data berikut untuk membuat akun."})]})]}),y&&e.jsxs("div",{className:"simple-register-error",role:"alert",children:[e.jsx("i",{className:"bi bi-exclamation-circle"}),e.jsx("span",{children:y})]}),e.jsxs("form",{onSubmit:L,className:"simple-register-form",noValidate:!0,children:[e.jsxs("div",{className:"simple-register-field",children:[e.jsx("label",{htmlFor:"full_name",children:"Nama Pengguna"}),e.jsxs("div",{className:"simple-register-input",children:[e.jsx("i",{className:"bi bi-person"}),e.jsx("input",{id:"full_name",type:"text",name:"full_name",value:i.full_name,onChange:H,placeholder:"Masukkan nama lengkap",autoComplete:"name",maxLength:100,disabled:p,required:!0})]})]}),e.jsxs("div",{className:"simple-register-field",children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsxs("div",{className:"simple-register-input",children:[e.jsx("i",{className:"bi bi-envelope"}),e.jsx("input",{id:"email",type:"email",name:"email",value:i.email,onChange:H,placeholder:"contoh@email.com",autoComplete:"email",maxLength:150,disabled:p,required:!0})]})]}),e.jsxs("div",{className:"simple-register-field",children:[e.jsx("label",{htmlFor:"phone",children:"Nomor Telepon"}),e.jsxs("div",{className:"simple-register-input",children:[e.jsx("i",{className:"bi bi-phone"}),e.jsx("input",{id:"phone",type:"tel",name:"phone",value:i.phone,onChange:_,placeholder:"08xxxxxxxxxx",autoComplete:"tel",inputMode:"numeric",maxLength:15,disabled:p,required:!0})]})]}),e.jsxs("div",{className:"simple-register-field",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"simple-register-input simple-register-password",children:[e.jsx("i",{className:"bi bi-lock"}),e.jsx("input",{id:"password",type:d?"text":"password",name:"password",value:i.password,onChange:H,placeholder:"Minimal 6 karakter",autoComplete:"new-password",minLength:6,disabled:p,required:!0}),e.jsx("button",{type:"button",onClick:()=>o(q=>!q),disabled:p,"aria-label":d?"Sembunyikan password":"Tampilkan password",children:e.jsx("i",{className:d?"bi bi-eye-slash":"bi bi-eye"})})]}),i.password&&e.jsxs("small",{className:M.length?"simple-register-valid":"simple-register-hint",children:[e.jsx("i",{className:M.length?"bi bi-check-circle":"bi bi-info-circle"}),"Minimal 6 karakter"]})]}),e.jsxs("div",{className:"simple-register-field",children:[e.jsx("label",{htmlFor:"confirmPassword",children:"Konfirmasi Password"}),e.jsxs("div",{className:"simple-register-input simple-register-password",children:[e.jsx("i",{className:"bi bi-shield-lock"}),e.jsx("input",{id:"confirmPassword",type:u?"text":"password",name:"confirmPassword",value:i.confirmPassword,onChange:H,placeholder:"Ulangi password",autoComplete:"new-password",disabled:p,required:!0}),e.jsx("button",{type:"button",onClick:()=>h(q=>!q),disabled:p,"aria-label":u?"Sembunyikan konfirmasi password":"Tampilkan konfirmasi password",children:e.jsx("i",{className:u?"bi bi-eye-slash":"bi bi-eye"})})]}),i.confirmPassword&&e.jsxs("small",{className:M.match?"simple-register-valid":"simple-register-invalid",children:[e.jsx("i",{className:M.match?"bi bi-check-circle":"bi bi-exclamation-circle"}),M.match?"Password sudah sesuai":"Konfirmasi password belum sama"]})]}),e.jsx("button",{type:"submit",className:"simple-register-submit",disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm","aria-hidden":"true"}),e.jsx("span",{children:"Membuat akun..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"Buat Akun"}),e.jsx("i",{className:"bi bi-arrow-right"})]})})]}),e.jsxs("div",{className:"simple-register-login",children:[e.jsx("span",{children:"Sudah punya akun?"}),e.jsx(Ve,{to:"/login",children:"Login di sini"})]}),e.jsxs("div",{className:"simple-register-security",children:[e.jsx("i",{className:"bi bi-shield-check"}),e.jsx("span",{children:"Data Anda digunakan untuk layanan dan proses pendaftaran FITALENTA."})]})]})})]})}),e.jsx(Nf,{})]})},Nf=()=>e.jsx("style",{children:`
      :root {
        --sr-navy: #00294b;
        --sr-navy-dark: #001f3a;
        --sr-blue: #17578a;
        --sr-orange: #e8491d;
        --sr-bg: #f5f7fa;
        --sr-text: #102a43;
        --sr-muted: #6d7f90;
        --sr-border: #dfe6ed;
        --sr-white: #ffffff;
      }

      .simple-register-page,
      .simple-register-page * {
        box-sizing: border-box;
      }

      .simple-register-page {
        width: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        background: var(--sr-bg);
        color: var(--sr-text);
        font-family: "Figtree", ui-sans-serif, system-ui, -apple-system,
          BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .simple-register-shell {
        width: 100%;
        min-height: calc(100vh - 96px);
        display: grid;
        grid-template-columns: minmax(360px, 0.9fr) minmax(520px, 1.1fr);
      }

      .simple-register-intro {
        position: relative;
        min-height: 100%;
        padding: 42px clamp(36px, 6vw, 86px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #ffffff;
        background:
          radial-gradient(
            circle at 12% 88%,
            rgba(255, 255, 255, 0.08) 0,
            rgba(255, 255, 255, 0.08) 130px,
            transparent 131px
          ),
          radial-gradient(
            circle at 100% 0%,
            rgba(255, 255, 255, 0.06) 0,
            rgba(255, 255, 255, 0.06) 170px,
            transparent 171px
          ),
          linear-gradient(145deg, #00294b 0%, #063c67 58%, #0d527f 100%);
      }

      .simple-register-back {
        position: relative;
        z-index: 2;
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: rgba(255, 255, 255, 0.84);
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
        transition: 0.2s ease;
      }

      .simple-register-back:hover {
        color: #ffffff;
        transform: translateX(-2px);
      }

      .simple-register-intro-content {
        position: relative;
        z-index: 2;
        width: min(520px, 100%);
        margin: auto 0;
        padding: 58px 0;
      }

      .simple-register-eyebrow {
        display: inline-block;
        margin-bottom: 15px;
        color: #ff8a67;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.6px;
      }

      .simple-register-intro h1 {
        max-width: 480px;
        margin: 0;
        color: #ffffff;
        font-size: clamp(38px, 4.2vw, 58px);
        line-height: 1.08;
        font-weight: 800;
        letter-spacing: -1.2px;
      }

      .simple-register-intro-content > p {
        max-width: 500px;
        margin: 20px 0 0;
        color: rgba(255, 255, 255, 0.78);
        font-size: 15px;
        line-height: 1.75;
      }

      .simple-register-benefits {
        margin-top: 36px;
        display: grid;
        gap: 18px;
      }

      .simple-register-benefits > div {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .simple-register-benefits > div > span {
        width: 30px;
        height: 30px;
        flex: 0 0 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9px;
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        font-size: 14px;
      }

      .simple-register-benefits p {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .simple-register-benefits strong {
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
      }

      .simple-register-benefits small {
        color: rgba(255, 255, 255, 0.66);
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-form-side {
        min-width: 0;
        padding: 54px clamp(32px, 6vw, 86px);
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f9fb;
      }

      .simple-register-card {
        width: min(520px, 100%);
        padding: 34px;
        border: 1px solid var(--sr-border);
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 20px 55px rgba(0, 41, 75, 0.08);
      }

      .simple-register-card-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 25px;
      }

      .simple-register-icon {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: #edf4fa;
        color: var(--sr-blue);
        font-size: 21px;
      }

      .simple-register-card-header > div:last-child {
        min-width: 0;
      }

      .simple-register-card-header span {
        display: block;
        margin-bottom: 3px;
        color: var(--sr-orange);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.1px;
      }

      .simple-register-card-header h2 {
        margin: 0;
        color: var(--sr-navy);
        font-size: 27px;
        line-height: 1.2;
        font-weight: 800;
      }

      .simple-register-card-header p {
        margin: 5px 0 0;
        color: var(--sr-muted);
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-error {
        margin-bottom: 18px;
        padding: 12px 14px;
        display: flex;
        align-items: flex-start;
        gap: 9px;
        border: 1px solid #f1c5bd;
        border-radius: 10px;
        background: #fff4f2;
        color: #a73a29;
        font-size: 11px;
        line-height: 1.5;
      }

      .simple-register-form {
        display: grid;
        gap: 15px;
      }

      .simple-register-field label {
        display: block;
        margin-bottom: 7px;
        color: #2c4053;
        font-size: 11px;
        font-weight: 700;
      }

      .simple-register-input {
        position: relative;
      }

      .simple-register-input > i {
        position: absolute;
        top: 50%;
        left: 14px;
        transform: translateY(-50%);
        z-index: 2;
        color: #8b9baa;
        font-size: 14px;
        pointer-events: none;
      }

      .simple-register-input input {
        width: 100%;
        height: 48px;
        padding: 0 44px 0 42px;
        border: 1px solid #d8e0e7;
        border-radius: 10px;
        outline: none;
        background: #ffffff;
        color: var(--sr-text);
        font: inherit;
        font-size: 12px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .simple-register-input input::placeholder {
        color: #a0adb8;
      }

      .simple-register-input input:focus {
        border-color: #5a8db3;
        box-shadow: 0 0 0 3px rgba(23, 87, 138, 0.09);
      }

      .simple-register-password button {
        position: absolute;
        top: 50%;
        right: 7px;
        width: 34px;
        height: 34px;
        padding: 0;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #8495a5;
        cursor: pointer;
      }

      .simple-register-field > small {
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 9px;
        line-height: 1.4;
      }

      .simple-register-valid {
        color: #2f8a5d;
      }

      .simple-register-invalid {
        color: #c44835;
      }

      .simple-register-hint {
        color: #7d8d9b;
      }

      .simple-register-submit {
        width: 100%;
        height: 50px;
        margin-top: 4px;
        padding: 0 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 0;
        border-radius: 10px;
        background: var(--sr-orange);
        color: #ffffff;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 9px 20px rgba(232, 73, 29, 0.18);
        transition: 0.2s ease;
      }

      .simple-register-login {
        margin-top: 23px;
        padding-top: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border-top: 1px solid #e8edf2;
        color: var(--sr-muted);
        font-size: 11px;
      }

      .simple-register-login a {
        color: var(--sr-blue);
        text-decoration: none;
        font-weight: 800;
      }

      .simple-register-security {
        margin-top: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #8795a1;
        font-size: 9px;
        text-align: center;
        line-height: 1.45;
      }

      .simple-register-loading {
        min-height: calc(100vh - 96px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: var(--sr-navy);
      }

      @media (max-width: 799px) {
        .simple-register-shell {
          min-height: calc(100vh - 80px);
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .simple-register-intro {
          padding: 28px 20px;
        }

        .simple-register-intro-content {
          padding: 38px 0 20px;
        }

        .simple-register-benefits {
          grid-template-columns: 1fr;
        }

        .simple-register-form-side {
          padding: 30px 16px 48px;
        }

        .simple-register-card {
          padding: 25px 20px;
          border-radius: 16px;
        }
      }

      @media (max-width: 480px) {
        .simple-register-shell {
          min-height: calc(100vh - 76px);
        }
      }
    `}),jN=()=>{const[i,l]=j.useState(null),[d,o]=j.useState(!0),[u,h]=j.useState(""),{user:p}=Wa();j.useEffect(()=>{p&&x()},[p]);const x=async()=>{try{h(""),o(!0);const P=await de.get(`/api/user-dashboard/${p.id}`);P.data.success?l(P.data.data):h("Gagal memuat data dashboard")}catch(P){console.error("Error fetching dashboard:",P),h(P.response?.data?.message||"Terjadi kesalahan saat memuat data")}finally{o(!1)}},y=P=>{const M={pending:{class:"warning",text:"Menunggu"},installment_1:{class:"info",text:"Cicilan 1"},installment_2:{class:"info",text:"Cicilan 2"},installment_3:{class:"info",text:"Cicilan 3"},installment_4:{class:"info",text:"Cicilan 4"},installment_5:{class:"info",text:"Cicilan 5"},installment_6:{class:"info",text:"Cicilan 6"},paid:{class:"success",text:"Lunas"},overdue:{class:"danger",text:"Jatuh Tempo"},cancelled:{class:"secondary",text:"Dibatalkan"},menunggu:{class:"warning",text:"Menunggu"},lolos:{class:"success",text:"Lolos"},tidak_lolos:{class:"danger",text:"Tidak Lolos"},proses:{class:"warning",text:"Proses"},ditempatkan:{class:"success",text:"Ditempatkan"},registration_menunggu:{class:"warning",text:"Menunggu Interview"},registration_lolos:{class:"success",text:"Lolos Interview"},registration_tidak_lolos:{class:"danger",text:"Tidak Lolos Interview"}}[P]||{class:"secondary",text:P||"-"};return e.jsx("span",{className:`badge bg-${M.class}`,children:M.text})},f=P=>{const M={menunggu:{class:"warning",text:"Menunggu Interview"},lolos:{class:"success",text:"Lolos Interview"},tidak_lolos:{class:"danger",text:"Tidak Lolos Interview"}}[P]||{class:"secondary",text:"Belum Ditentukan"};return e.jsx("span",{className:`badge bg-${M.class}`,children:M.text})},b=P=>{if(!P||P.length===0)return{paymentStatus:{status:"-"},registrationStatus:{status:"-"},selectionStatus:{status:"-"},placementStatus:{status:"-"},programName:"-",companyName:"-"};const w=P[0],M=_=>_==="paid"?"success":_&&_.startsWith("installment_")?"info":_==="overdue"?"danger":_==="pending"?"warning":"secondary";return{paymentStatus:{status:(_=>_==="paid"?"Lunas":_==="installment_1"?"Cicilan 1":_==="installment_2"?"Cicilan 2":_==="installment_3"?"Cicilan 3":_==="installment_4"?"Cicilan 4":_==="installment_5"?"Cicilan 5":_==="installment_6"?"Cicilan 6":_==="overdue"?"Jatuh Tempo":_==="pending"?"Menunggu":_==="cancelled"?"Dibatalkan":_||"-")(w.payment_status),class:M(w.payment_status)},registrationStatus:{status:w.registration_status||"menunggu",class:w.registration_status==="lolos"?"success":w.registration_status==="tidak_lolos"?"danger":"warning"},selectionStatus:{status:w.selection_status||"-",class:w.selection_status==="lolos"?"success":w.selection_status==="tidak_lolos"?"danger":"secondary"},placementStatus:{status:w.placement_status||"-",class:w.placement_status==="ditempatkan"?"success":"secondary"},programName:w.program_name||"-",companyName:w.company_name||"-"}};if(d)return e.jsx("div",{className:"participant-dashboard",children:e.jsx("div",{className:"dashboard-content",children:e.jsx("div",{className:"loading-spinner",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"spinner-border text-primary",role:"status"}),e.jsx("p",{className:"mt-3",children:"Memuat dashboard..."})]})})})});if(u)return e.jsx("div",{className:"participant-dashboard",children:e.jsx("div",{className:"dashboard-content",children:e.jsx("div",{className:"container py-5",children:e.jsxs("div",{className:"alert alert-danger",children:[e.jsx("h5",{children:"Error Memuat Dashboard"}),e.jsx("p",{className:"mb-3",children:u}),e.jsxs("button",{type:"button",className:"btn btn-primary",onClick:x,children:[e.jsx("i",{className:"bi bi-arrow-clockwise me-1"}),"Coba Lagi"]})]})})})});const v=i?.registrations||[],A=b(v);return e.jsx("div",{className:"participant-dashboard",children:e.jsx("div",{className:"dashboard-content",children:e.jsxs("div",{className:"dashboard-container",children:[e.jsxs("div",{className:"dashboard-header",children:[e.jsxs("div",{className:"dashboard-header-text",children:[e.jsx("h1",{className:"dashboard-title",children:"Dashboard Status Program"}),e.jsxs("p",{className:"dashboard-welcome",children:["Selamat Datang, ",e.jsx("strong",{children:p?.full_name})]}),e.jsx("p",{className:"dashboard-subtitle",children:v.length>0?"Berikut status program Anda.":"Anda belum memiliki program yang terdaftar."})]}),e.jsxs("button",{type:"button",className:"dashboard-refresh",onClick:x,children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),e.jsx("span",{children:"Refresh"})]})]}),v.length>0&&e.jsx("div",{className:"dashboard-information",children:e.jsxs("div",{className:"alert alert-info",children:[e.jsx("h6",{children:"Informasi Penting:"}),e.jsxs("ul",{className:"mb-0",children:[e.jsx("li",{children:"Status akan diperbarui secara real-time oleh admin"}),e.jsx("li",{children:"Untuk pertanyaan mengenai status, hubungi admin"}),e.jsx("li",{children:"Proses interview membutuhkan waktu 3-5 hari kerja"}),e.jsx("li",{children:"Nama perusahaan akan ditentukan setelah proses seleksi selesai"})]})]})}),e.jsxs("div",{className:"status-grid",children:[e.jsxs("div",{className:"status-card",children:[e.jsx("div",{className:"status-card-icon",children:e.jsx("i",{className:"bi bi-clipboard-check"})}),e.jsxs("div",{className:"status-card-content",children:[e.jsx("h3",{children:"Status Seleksi"}),e.jsx("p",{children:A.selectionStatus.status})]})]}),e.jsxs("div",{className:"status-card",children:[e.jsx("div",{className:"status-card-icon",children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsxs("div",{className:"status-card-content",children:[e.jsx("h3",{children:"Penempatan Kerja"}),e.jsx("p",{children:A.placementStatus.status})]})]}),e.jsxs("div",{className:"status-card",children:[e.jsx("div",{className:"status-card-icon",children:e.jsx("i",{className:"bi bi-journal-text"})}),e.jsxs("div",{className:"status-card-content",children:[e.jsx("h3",{children:"Program Saya"}),e.jsx("p",{children:A.programName})]})]})]}),e.jsxs("div",{className:"program-detail-card",children:[e.jsx("div",{className:"program-detail-header",children:e.jsx("h4",{className:"program-detail-title",children:"Detail Program Anda"})}),e.jsx("div",{className:"program-detail-body",children:v.length>0?e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-hover text-center",children:[e.jsx("thead",{className:"table-light align-middle",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Nama Program"}),e.jsx("th",{children:"Kode Pendaftaran"}),e.jsx("th",{children:"Tanggal Pendaftaran"}),e.jsx("th",{children:"Status Pendaftaran (Interview)"}),e.jsx("th",{children:"Status Seleksi (Diklat)"}),e.jsx("th",{children:"Status Penyaluran"}),e.jsx("th",{children:"Nama Perusahaan"})]})}),e.jsx("tbody",{className:"align-middle",children:v.map((P,w)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:P.program_name||"-"})}),e.jsx("td",{children:e.jsx("code",{children:P.registration_code||"-"})}),e.jsx("td",{children:qe.formatDate(P.registration_date)}),e.jsx("td",{children:f(P.registration_status)}),e.jsx("td",{children:y(P.selection_status)}),e.jsx("td",{children:y(P.placement_status)}),e.jsx("td",{children:P.company_name?e.jsx("span",{className:"badge bg-success",children:P.company_name}):e.jsx("span",{className:"text-muted",children:"Belum ditentukan"})})]},`${P.id}-${w}-${P.registration_code}`))})]})}):e.jsxs("div",{className:"program-empty",children:[e.jsx("div",{className:"program-empty-icon",children:e.jsx("i",{className:"bi bi-inbox"})}),e.jsx("h5",{className:"program-empty-title",children:"Data tidak tersedia"}),e.jsx("p",{className:"program-empty-text",children:"Anda belum terdaftar dalam program magang."}),e.jsx(Ve,{to:"/registration",className:"program-register-btn",children:"Daftar Program Magang"})]})})]})]})})})},Qt=i=>i?.replace(/\/+$/,"")||"",jg=i=>typeof window>"u"?"":window.__APP_CONFIG__?.[i],vN=()=>{const i=Qt(jg("VITE_API_URL")||"https://try.fitalenta.co.id");if(!i){const l=Qt(window.location.origin);return console.warn("VITE_API_URL tidak ditemukan, fallback ke origin yang sama:",l),l}return/^https?:\/\//i.test(i)||i.startsWith("/")?i:`/${i}`},yN=vN(),NN=()=>{const i=Qt(jg("VITE_FILE_BASE_URL")||"https://try.fitalenta.co.id");if(i){if(/^https?:\/\//i.test(i))return i;if(i.startsWith("/"))return`${Qt(window.location.origin)}${i}`}const l=yN;if(/^https?:\/\//i.test(l))try{const d=new URL(l),o=Qt(d.pathname.replace(/\/api(\/)?$/,"")),u=o&&o!=="/"?o:"";return`${d.origin}${u}`}catch{return Qt(window.location.origin)}if(l.startsWith("/")){const d=Qt(l.replace(/\/api(\/)?$/,"")),o=d&&d!=="/"?d:"";return`${Qt(window.location.origin)}${o}`}return Qt(window.location.origin)},kN=NN(),_N=i=>{if(!i)return null;const l=`${i}`.trim();if(/^https?:\/\//i.test(l))return l;const d=l.replace(/\\/g,"/").replace(/\s+/g,u=>u.replace(/\s/g,"%20")).replace(/\/+/g,"/"),o=d.startsWith("/")?d:`/${d}`;return`${kN}${o}`},Ud=async i=>{if(!i)return null;const d=String(i).trim().replace(/\\/g,"/").match(/(?:\/)?uploads\/(photos|documents|payments)\/([^/?#]+)/);if(!d)throw new Error("Path file tidak valid");return _N(`/uploads/${d[1]}/${d[2]}`)},kf=i=>{i&&i.startsWith("blob:")&&URL.revokeObjectURL(i)},Yi=({filePath:i,alt:l="",fallback:d=null,...o})=>{const[u,h]=j.useState(null);return j.useEffect(()=>{let p=!0,x=null;return(async()=>{if(!i){h(null);return}try{x=await Ud(i),p?h(x):kf(x)}catch(f){console.error("Gagal memuat gambar private:",f),p&&h(null)}})(),()=>{p=!1,x&&kf(x)}},[i]),u?e.jsx("img",{src:u,alt:l,...o}):d},SN=()=>{const{user:i}=Wa(),[l,d]=j.useState([]),[o,u]=j.useState([]),[h,p]=j.useState(!0),[x,y]=j.useState(""),[f,b]=j.useState(null),[v,A]=j.useState(null),[P,w]=j.useState(!1),[M,H]=j.useState(!1),[_,E]=j.useState("basic"),[L,q]=j.useState({program:"all",payment_status:"all",selection_status:"all",placement_status:"all",search:""}),[oe,re]=j.useState({registration_status:"",notes:""}),[te,ge]=j.useState({totalRegistrations:0,newRegistrations:0,totalRevenue:0,pendingVerifications:0,paymentStats:{pending:0,installment_1:0,installment_2:0,installment_3:0,installment_4:0,installment_5:0,installment_6:0,paid:0,overdue:0},registrationStats:{menunggu:0,lolos:0,tidak_lolos:0},selectionStats:{menunggu:0,lolos:0,tidak_lolos:0},placementStats:{proses:0,lolos:0,ditempatkan:0}}),ye=(R="")=>{const be=R.trim().split(/\s+/).filter(Boolean);return be.length?be.slice(0,2).map(ke=>ke.charAt(0).toUpperCase()).join(""):"P"},he=L.program!=="all"||L.payment_status!=="all"||L.selection_status!=="all"||L.placement_status!=="all"||L.search.trim()!=="",Oe=j.useCallback(R=>{const be=R.length,ke=new Date;ke.setDate(ke.getDate()-7);const Ie=R.filter(We=>new Date(We.registration_date)>ke).length,oa=R.reduce((We,pa)=>We+parseFloat(pa.amount_paid||0),0),Te={pending:0,installment_1:0,installment_2:0,installment_3:0,installment_4:0,installment_5:0,installment_6:0,paid:0,overdue:0},Ra={menunggu:0,lolos:0,tidak_lolos:0},Ke={menunggu:0,lolos:0,tidak_lolos:0},Oa={proses:0,lolos:0,ditempatkan:0};R.forEach(We=>{We.payment_status&&Object.prototype.hasOwnProperty.call(Te,We.payment_status)?Te[We.payment_status]+=1:We.payment_status||(Te.pending+=1),We.registration_status&&Object.prototype.hasOwnProperty.call(Ra,We.registration_status)&&(Ra[We.registration_status]+=1),We.selection_status&&Object.prototype.hasOwnProperty.call(Ke,We.selection_status)&&(Ke[We.selection_status]+=1),We.placement_status&&Object.prototype.hasOwnProperty.call(Oa,We.placement_status)&&(Oa[We.placement_status]+=1)});const Tt=Ra.menunggu+Ke.menunggu+Te.pending;ge(We=>({...We,totalRegistrations:be,newRegistrations:Ie,totalRevenue:oa,pendingVerifications:Tt,paymentStats:Te,registrationStats:Ra,selectionStats:Ke,placementStats:Oa}))},[]),Ce=j.useCallback(async()=>{try{p(!0),y("");const R=new URLSearchParams;Object.entries(L).forEach(([oa,Te])=>{Te!=="all"&&Te!==""&&R.append(oa,Te)});const be=R.toString(),ke=be?`/api/registrations?${be}`:"/api/registrations",Ie=await de.get(ke);if(Ie.data.success){const oa=Ie.data.data||[];d(oa),Oe(oa)}else y("Gagal mengambil data pendaftaran.")}catch(R){console.error("Error fetching registrations:",R),y(R.response?.data?.message||"Terjadi kesalahan saat memuat data pendaftaran.")}finally{p(!1)}},[L,Oe]),Se=j.useCallback(async()=>{try{const R=await de.get("/api/programs");R.data.success&&u(R.data.data||[])}catch(R){console.error("Error fetching programs:",R)}},[]),Z=j.useCallback(async()=>{try{const R=await de.get("/api/admin/statistics");R.data.success&&ge(be=>({...be,...R.data.data}))}catch(R){console.error("Error fetching statistics:",R)}},[]);j.useEffect(()=>{Se(),Z()},[Se,Z]),j.useEffect(()=>{const R=setTimeout(()=>{Ce()},L.search?450:0);return()=>clearTimeout(R)},[L,Ce]),j.useEffect(()=>{if(!f)return;const R=setTimeout(()=>{b(null)},4500);return()=>clearTimeout(R)},[f]);const fe=(R,be)=>{q(ke=>({...ke,[R]:be}))},U=R=>{fe("search",R.target.value)},ie=()=>{q({program:"all",payment_status:"all",selection_status:"all",placement_status:"all",search:""})},I=R=>{A(R),E("basic"),w(!0)},ue=async R=>{try{const be=await Ud(R);window.open(be,"_blank","noopener,noreferrer")}catch(be){console.error("Gagal membuka file private:",be)}},D=R=>{A(R),re({registration_status:R.registration_status||"menunggu",notes:""}),w(!1),H(!0)},N=()=>{w(!1),H(!1),A(null),E("basic"),re({registration_status:"",notes:""})},k=async R=>{if(R.preventDefault(),!!v)try{if(p(!0),!(await de.put(`/api/registrations/${v.id}/registration-status`,{status:oe.registration_status,notes:oe.notes,evaluated_by:i?.id})).data.success)throw new Error("Gagal memperbarui status pendaftaran.");d(ke=>ke.map(Ie=>Ie.id===v.id?{...Ie,registration_status:oe.registration_status}:Ie)),b({type:"success",message:"Status pendaftaran berhasil diperbarui."}),await Z(),H(!1),A(null),re({registration_status:"",notes:""})}catch(be){console.error("Error updating registration status:",be),b({type:"danger",message:be.response?.data?.message||be.message||"Gagal memperbarui status."})}finally{p(!1)}},Y=({tone:R="neutral",icon:be,children:ke})=>e.jsxs("span",{className:`admin-status-badge ${R}`,children:[be&&e.jsx("i",{className:`bi ${be}`}),e.jsx("span",{children:ke})]}),X=(R,be)=>{if(!R||R==="pending")return"Belum Bayar";if(R==="paid")return"Lunas";if(R==="overdue")return"Jatuh Tempo";if(R==="cancelled")return"Dibatalkan";if(!R.startsWith("installment_"))return R;const ke=R.split("_")[1];return be==="4_installments"?`Cicilan ${ke}/4`:be==="6_installments"?`Cicilan ${ke}/6`:`Cicilan ${ke}`},se=(R,be)=>{const ke=X(R,be);return R==="paid"?e.jsx(Y,{tone:"success",icon:"bi-check-circle-fill",children:ke}):R==="overdue"?e.jsx(Y,{tone:"danger",icon:"bi-exclamation-circle-fill",children:ke}):R?.startsWith("installment_")?e.jsx(Y,{tone:"info",icon:"bi-credit-card",children:ke}):R==="cancelled"?e.jsx(Y,{tone:"neutral",icon:"bi-x-circle",children:ke}):e.jsx(Y,{tone:"warning",icon:"bi-clock-fill",children:ke})},pe=R=>R==="lolos"?e.jsx(Y,{tone:"success",icon:"bi-check-circle-fill",children:"Lolos Interview"}):R==="tidak_lolos"?e.jsx(Y,{tone:"danger",icon:"bi-x-circle-fill",children:"Tidak Lolos"}):e.jsx(Y,{tone:"warning",icon:"bi-hourglass-split",children:"Menunggu Interview"}),Ae=R=>R==="lolos"?e.jsx(Y,{tone:"success",icon:"bi-check-circle-fill",children:"Lolos"}):R==="tidak_lolos"?e.jsx(Y,{tone:"danger",icon:"bi-x-circle-fill",children:"Tidak Lolos"}):e.jsx(Y,{tone:"warning",icon:"bi-clock-fill",children:"Menunggu"}),B=R=>R==="ditempatkan"?e.jsx(Y,{tone:"success",icon:"bi-building-check",children:"Ditempatkan"}):R==="lolos"?e.jsx(Y,{tone:"info",icon:"bi-check-circle-fill",children:"Lolos"}):e.jsx(Y,{tone:"primary",icon:"bi-arrow-repeat",children:"Proses"}),S=R=>{const be=[];return R.n4_certificate_path&&be.push({key:"n4",label:"N4",path:R.n4_certificate_path}),R.ssw_certificate_path&&be.push({key:"ssw",label:"SSW",path:R.ssw_certificate_path}),be.length?e.jsx("div",{className:"admin-document-list",children:be.map(ke=>e.jsxs("a",{href:ke.path,target:"_blank",rel:"noopener noreferrer",className:"admin-document-chip",title:`Buka Sertifikat ${ke.label}`,children:[e.jsx("i",{className:"bi bi-file-earmark-pdf"}),ke.label]},ke.key))}):e.jsx("span",{className:"admin-empty-value",children:e.jsx("i",{className:"bi bi-dash"})})},ee=({label:R,value:be,full:ke=!1})=>e.jsxs("div",{className:`admin-detail-item ${ke?"full":""}`,children:[e.jsx("span",{children:R}),e.jsx("strong",{children:be||"-"})]}),Je=R=>e.jsxs("div",{className:"admin-detail-section-grid",children:[e.jsxs("div",{className:"admin-detail-section-card",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-person-vcard"})}),e.jsxs("span",{children:[e.jsx("small",{children:"IDENTITAS"}),e.jsx("strong",{children:"Informasi Pribadi"})]})]}),e.jsxs("div",{className:"admin-detail-data-grid",children:[e.jsx(ee,{label:"NIK",value:R.nik}),e.jsx(ee,{label:"Jenis Kelamin",value:R.gender==="L"?"Laki-laki":R.gender==="P"?"Perempuan":"-"}),e.jsx(ee,{label:"Tempat Lahir",value:R.birth_place}),e.jsx(ee,{label:"Tanggal Lahir",value:R.birth_date?qe.formatDateForBirthDate(R.birth_date):"-"}),e.jsx(ee,{label:"Status Pernikahan",value:R.marital_status})]})]}),e.jsxs("div",{className:"admin-detail-section-card",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-mortarboard"})}),e.jsxs("span",{children:[e.jsx("small",{children:"PENDIDIKAN"}),e.jsx("strong",{children:"Latar Belakang Pendidikan"})]})]}),e.jsxs("div",{className:"admin-detail-data-grid",children:[e.jsx(ee,{label:"Pendidikan Terakhir",value:R.last_education}),e.jsx(ee,{label:"Jurusan",value:R.major}),e.jsx(ee,{label:"Institusi Pendidikan",value:R.education_institution}),e.jsx(ee,{label:"Aktivitas Saat Ini",value:R.current_activity})]})]}),e.jsxs("div",{className:"admin-detail-section-card full",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-telephone"})}),e.jsxs("span",{children:[e.jsx("small",{children:"KONTAK DARURAT"}),e.jsx("strong",{children:"Orang Tua / Wali"})]})]}),e.jsxs("div",{className:"admin-detail-data-grid",children:[e.jsx(ee,{label:"Nomor Handphone",value:R.parent_phone}),e.jsx(ee,{label:"Hubungan",value:R.parent_relationship})]})]})]}),He=R=>e.jsxs("div",{className:"admin-address-grid",children:[e.jsxs("div",{className:"admin-address-card",children:[e.jsxs("div",{className:"admin-address-card-header",children:[e.jsx("div",{className:"admin-address-icon",children:e.jsx("i",{className:"bi bi-person-badge"})}),e.jsxs("span",{children:[e.jsx("small",{children:"ALAMAT IDENTITAS"}),e.jsx("strong",{children:"Alamat Sesuai KTP"})]})]}),e.jsxs("div",{className:"admin-address-location",children:[e.jsx("i",{className:"bi bi-geo-alt-fill"}),e.jsxs("span",{children:[R.ktp_city_name||"-",","," ",R.ktp_province_name||"-"]})]}),e.jsx("p",{children:R.ktp_address||"Alamat belum tersedia."})]}),e.jsxs("div",{className:"admin-address-card domicile",children:[e.jsxs("div",{className:"admin-address-card-header",children:[e.jsx("div",{className:"admin-address-icon",children:e.jsx("i",{className:"bi bi-house-door"})}),e.jsxs("span",{children:[e.jsx("small",{children:"ALAMAT SAAT INI"}),e.jsx("strong",{children:"Alamat Domisili"})]})]}),e.jsxs("div",{className:"admin-address-location",children:[e.jsx("i",{className:"bi bi-geo-alt-fill"}),e.jsxs("span",{children:[R.domicile_city_name||"-",","," ",R.domicile_province_name||"-"]})]}),e.jsx("p",{children:R.domicile_address||"Alamat belum tersedia."})]})]});return h&&l.length===0?e.jsx("div",{className:"admin-dashboard-page",children:e.jsxs("div",{className:"admin-dashboard-loading",children:[e.jsx("div",{className:"admin-dashboard-loading-icon",children:e.jsx("span",{className:"spinner-border"})}),e.jsx("strong",{children:"Menyiapkan dashboard"}),e.jsx("span",{children:"Data pendaftaran sedang dimuat."})]})}):e.jsxs("div",{className:"admin-dashboard-page",children:[e.jsxs("div",{className:"admin-dashboard-shell",children:[e.jsxs("section",{className:"admin-dashboard-header",children:[e.jsxs("div",{className:"admin-dashboard-heading",children:[e.jsxs("div",{className:"admin-dashboard-eyebrow",children:[e.jsx("i",{className:"bi bi-grid-1x2-fill"}),"ADMIN CONTROL CENTER"]}),e.jsx("h1",{children:"Admin Dashboard"}),e.jsx("p",{children:"Pantau pendaftaran, pembayaran, seleksi, dan perkembangan peserta FITALENTA dalam satu halaman."})]}),e.jsxs("div",{className:"admin-welcome-card",children:[e.jsx("div",{className:"admin-welcome-avatar",children:ye(i?.full_name||"Admin Fitalenta")}),e.jsxs("div",{children:[e.jsx("small",{children:"SELAMAT DATANG"}),e.jsx("strong",{children:i?.full_name||"Admin Fitalenta"}),e.jsx("span",{children:"Administrator FITALENTA"})]})]})]}),f&&e.jsxs("div",{className:`admin-feedback ${f.type}`,children:[e.jsx("div",{className:"admin-feedback-icon",children:e.jsx("i",{className:`bi ${f.type==="success"?"bi-check-circle-fill":"bi-exclamation-circle-fill"}`})}),e.jsxs("div",{children:[e.jsx("strong",{children:f.type==="success"?"Perubahan berhasil":"Terjadi masalah"}),e.jsx("span",{children:f.message})]}),e.jsx("button",{type:"button",onClick:()=>b(null),children:e.jsx("i",{className:"bi bi-x"})})]}),e.jsxs("section",{className:"admin-stat-grid",children:[e.jsxs("div",{className:"admin-stat-card primary",children:[e.jsxs("div",{className:"admin-stat-card-top",children:[e.jsx("div",{className:"admin-stat-icon",children:e.jsx("i",{className:"bi bi-people"})}),e.jsx("span",{className:"admin-stat-chip",children:"Semua Program"})]}),e.jsx("small",{children:"TOTAL PENDAFTAR"}),e.jsx("strong",{children:te.totalRegistrations}),e.jsx("p",{children:"Jumlah peserta yang telah melakukan pendaftaran."})]}),e.jsxs("div",{className:"admin-stat-card blue",children:[e.jsxs("div",{className:"admin-stat-card-top",children:[e.jsx("div",{className:"admin-stat-icon",children:e.jsx("i",{className:"bi bi-person-plus"})}),e.jsx("span",{className:"admin-stat-chip",children:"7 Hari"})]}),e.jsx("small",{children:"PENDAFTAR BARU"}),e.jsx("strong",{children:te.newRegistrations}),e.jsx("p",{children:"Pendaftaran peserta dalam tujuh hari terakhir."})]}),e.jsxs("div",{className:"admin-stat-card success",children:[e.jsxs("div",{className:"admin-stat-card-top",children:[e.jsx("div",{className:"admin-stat-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsxs("span",{className:"admin-stat-chip",children:[te.paymentStats.paid," ","Lunas"]})]}),e.jsx("small",{children:"TOTAL PEMASUKAN"}),e.jsx("strong",{children:qe.formatCurrency(te.totalRevenue)}),e.jsx("p",{children:"Total pembayaran yang telah tercatat pada sistem."})]}),e.jsxs("div",{className:"admin-stat-card warning",children:[e.jsxs("div",{className:"admin-stat-card-top",children:[e.jsx("div",{className:"admin-stat-icon",children:e.jsx("i",{className:"bi bi-hourglass-split"})}),e.jsx("span",{className:"admin-stat-chip",children:"Perlu Tindakan"})]}),e.jsx("small",{children:"VERIFIKASI TERTUNDA"}),e.jsx("strong",{children:te.pendingVerifications}),e.jsx("p",{children:"Proses yang masih membutuhkan tindak lanjut admin."})]})]}),e.jsxs("section",{className:"admin-filter-card",children:[e.jsxs("div",{className:"admin-card-heading",children:[e.jsxs("div",{className:"admin-card-heading-left",children:[e.jsx("div",{className:"admin-card-heading-icon",children:e.jsx("i",{className:"bi bi-funnel"})}),e.jsxs("div",{children:[e.jsx("span",{children:"FILTER DATA"}),e.jsx("h2",{children:"Filter & Pencarian"}),e.jsx("p",{children:"Temukan data peserta berdasarkan kriteria tertentu."})]})]}),he&&e.jsxs("button",{type:"button",className:"admin-reset-filter",onClick:ie,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]})]}),e.jsxs("div",{className:"admin-filter-body",children:[e.jsxs("div",{className:"admin-filter-field search",children:[e.jsx("label",{children:"Pencarian"}),e.jsxs("div",{className:"admin-search-wrapper",children:[e.jsx("i",{className:"bi bi-search"}),e.jsx("input",{type:"text",value:L.search,onChange:U,placeholder:"Cari nama, email, telepon, atau kode pendaftaran..."}),L.search&&e.jsx("button",{type:"button",onClick:()=>fe("search",""),title:"Hapus pencarian",children:e.jsx("i",{className:"bi bi-x-lg"})})]})]}),e.jsxs("div",{className:"admin-filter-field",children:[e.jsx("label",{children:"Program"}),e.jsxs("select",{value:L.program,onChange:R=>fe("program",R.target.value),children:[e.jsx("option",{value:"all",children:"Semua Program"}),o.map(R=>e.jsx("option",{value:R.id,children:R.name},R.id))]})]}),e.jsxs("div",{className:"admin-filter-field",children:[e.jsx("label",{children:"Pembayaran"}),e.jsxs("select",{value:L.payment_status,onChange:R=>fe("payment_status",R.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status"}),e.jsx("option",{value:"pending",children:"Belum Bayar"}),e.jsx("option",{value:"installment_1",children:"Cicilan 1"}),e.jsx("option",{value:"installment_2",children:"Cicilan 2"}),e.jsx("option",{value:"installment_3",children:"Cicilan 3"}),e.jsx("option",{value:"installment_4",children:"Cicilan 4"}),e.jsx("option",{value:"installment_5",children:"Cicilan 5"}),e.jsx("option",{value:"installment_6",children:"Cicilan 6"}),e.jsx("option",{value:"paid",children:"Lunas"}),e.jsx("option",{value:"overdue",children:"Jatuh Tempo"})]})]}),e.jsxs("div",{className:"admin-filter-field",children:[e.jsx("label",{children:"Seleksi"}),e.jsxs("select",{value:L.selection_status,onChange:R=>fe("selection_status",R.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status"}),e.jsx("option",{value:"menunggu",children:"Menunggu"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"tidak_lolos",children:"Tidak Lolos"})]})]}),e.jsxs("div",{className:"admin-filter-field",children:[e.jsx("label",{children:"Penyaluran"}),e.jsxs("select",{value:L.placement_status,onChange:R=>fe("placement_status",R.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status"}),e.jsx("option",{value:"proses",children:"Proses"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"ditempatkan",children:"Ditempatkan"})]})]})]})]}),e.jsxs("section",{className:"admin-registration-card",children:[e.jsxs("div",{className:"admin-card-heading registration",children:[e.jsxs("div",{className:"admin-card-heading-left",children:[e.jsx("div",{className:"admin-card-heading-icon",children:e.jsx("i",{className:"bi bi-people"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE PESERTA"}),e.jsx("h2",{children:"Data Pendaftar"}),e.jsxs("p",{children:["Menampilkan"," ",l.length," ","data berdasarkan filter saat ini."]})]})]}),e.jsxs("button",{type:"button",className:"admin-refresh-button",onClick:Ce,disabled:h,children:[e.jsx("i",{className:`bi bi-arrow-clockwise ${h?"admin-spin":""}`}),h?"Memuat...":"Refresh"]})]}),x&&e.jsxs("div",{className:"admin-inline-error",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-exclamation-triangle-fill"})}),e.jsxs("span",{children:[e.jsx("strong",{children:"Data belum dapat dimuat"}),e.jsx("small",{children:x})]})]}),l.length===0?e.jsxs("div",{className:"admin-empty-state",children:[e.jsx("div",{className:"admin-empty-illustration",children:e.jsx("i",{className:"bi bi-inbox"})}),e.jsx("span",{className:"admin-empty-label",children:"DATA TIDAK DITEMUKAN"}),e.jsx("h3",{children:he?"Tidak ada peserta yang sesuai":"Belum ada data pendaftaran"}),e.jsx("p",{children:he?"Ubah filter atau kata kunci pencarian untuk melihat hasil lainnya.":"Data pendaftaran peserta akan tampil di area ini."}),he&&e.jsxs("button",{type:"button",onClick:ie,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"admin-table-wrapper d-none d-lg-block",children:e.jsxs("table",{className:"admin-registration-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Peserta"}),e.jsx("th",{children:"Program"}),e.jsx("th",{children:"Tanggal Daftar"}),e.jsx("th",{children:"Pembayaran"}),e.jsx("th",{children:"Perkembangan Peserta"}),e.jsx("th",{children:"Dokumen"}),e.jsx("th",{className:"admin-action-column",children:"Aksi"})]})}),e.jsx("tbody",{children:l.map(R=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"admin-participant-cell",children:[e.jsx("div",{className:"admin-participant-photo",children:R.photo_path?e.jsx(Yi,{filePath:R.photo_path,alt:R.full_name}):e.jsx("span",{children:ye(R.full_name)})}),e.jsxs("div",{className:"admin-participant-info",children:[e.jsx("strong",{children:R.full_name}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-envelope"}),R.email||"-"]}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-telephone"}),R.phone||"-"]})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"admin-program-table-cell",children:[e.jsx("div",{className:"admin-program-table-icon",children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsxs("div",{className:"admin-program-cell",children:[e.jsx("strong",{children:R.program_name||"-"}),e.jsx("span",{children:qe.formatCurrency(R.program_training_cost)}),e.jsx("code",{children:R.registration_code})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"admin-date-cell",children:[e.jsx("div",{className:"admin-date-icon",children:e.jsx("i",{className:"bi bi-calendar3"})}),e.jsxs("span",{children:[e.jsx("strong",{children:qe.formatDate(R.registration_date)}),e.jsx("small",{children:"Tanggal pendaftaran"})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"admin-payment-cell",children:[se(R.payment_status,R.program_installment_plan),Number(R.amount_paid||0)>0&&e.jsxs("div",{className:"admin-payment-amount",children:[e.jsx("span",{children:"Terbayar"}),e.jsx("strong",{children:qe.formatCurrency(R.amount_paid)})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"admin-progress-list",children:[e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-person-check"}),e.jsx("span",{children:"Interview"})]}),pe(R.registration_status)]}),e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-clipboard-check"}),e.jsx("span",{children:"Seleksi"})]}),Ae(R.selection_status)]}),e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-building"}),e.jsx("span",{children:"Penyaluran"})]}),B(R.placement_status)]})]})}),e.jsx("td",{children:e.jsx("div",{className:"admin-document-cell",children:S(R)})}),e.jsx("td",{children:e.jsxs("div",{className:"admin-action-buttons",children:[e.jsx("button",{type:"button",className:"view",onClick:()=>I(R),title:"Lihat detail peserta",children:e.jsx("i",{className:"bi bi-eye"})}),e.jsx("button",{type:"button",className:"edit",onClick:()=>D(R),title:"Update status interview",children:e.jsx("i",{className:"bi bi-pencil"})})]})})]},R.id))})]})}),e.jsx("div",{className:"admin-registration-mobile-list d-lg-none",children:l.map(R=>e.jsxs("article",{className:"admin-registration-mobile-card",children:[e.jsxs("div",{className:"admin-mobile-registration-header",children:[e.jsxs("div",{className:"admin-participant-cell",children:[e.jsx("div",{className:"admin-participant-photo",children:R.photo_path?e.jsx(Yi,{filePath:R.photo_path,alt:R.full_name}):e.jsx("span",{children:ye(R.full_name)})}),e.jsxs("div",{className:"admin-participant-info",children:[e.jsx("strong",{children:R.full_name}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-envelope"}),R.email||"-"]})]})]}),pe(R.registration_status)]}),e.jsxs("div",{className:"admin-mobile-program",children:[e.jsx("div",{className:"admin-program-table-icon",children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsxs("div",{children:[e.jsx("span",{children:"PROGRAM"}),e.jsx("strong",{children:R.program_name||"-"}),e.jsx("small",{children:R.registration_code})]})]}),e.jsxs("div",{className:"admin-mobile-info-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Tanggal Daftar"}),e.jsx("strong",{children:qe.formatDate(R.registration_date)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Biaya Pelatihan"}),e.jsx("strong",{children:qe.formatCurrency(R.program_training_cost)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Telepon"}),e.jsx("strong",{children:R.phone||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Pembayaran"}),se(R.payment_status,R.program_installment_plan)]})]}),e.jsxs("div",{className:"admin-mobile-progress",children:[e.jsxs("div",{className:"admin-mobile-section-title",children:[e.jsx("i",{className:"bi bi-diagram-3"}),e.jsx("span",{children:"Perkembangan Peserta"})]}),e.jsxs("div",{className:"admin-progress-list",children:[e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-person-check"}),e.jsx("span",{children:"Interview"})]}),pe(R.registration_status)]}),e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-clipboard-check"}),e.jsx("span",{children:"Seleksi"})]}),Ae(R.selection_status)]}),e.jsxs("div",{className:"admin-progress-row",children:[e.jsxs("div",{className:"admin-progress-label",children:[e.jsx("i",{className:"bi bi-building"}),e.jsx("span",{children:"Penyaluran"})]}),B(R.placement_status)]})]})]}),e.jsxs("div",{className:"admin-mobile-document-row",children:[e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-folder2-open"}),"Dokumen"]}),S(R)]}),e.jsxs("div",{className:"admin-mobile-action-row",children:[e.jsxs("button",{type:"button",className:"admin-mobile-view-button",onClick:()=>I(R),children:[e.jsx("i",{className:"bi bi-eye"}),"Lihat Detail"]}),e.jsxs("button",{type:"button",className:"admin-mobile-edit-button",onClick:()=>D(R),children:[e.jsx("i",{className:"bi bi-pencil"}),"Update Status"]})]})]},R.id))})]}),e.jsxs("div",{className:"admin-table-footer",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"}),e.jsxs("span",{children:[l.length," ","pendaftar ditampilkan"]})]}),e.jsx("small",{children:"Data diperbarui berdasarkan filter dan pencarian yang aktif."})]})]})]}),P&&v&&e.jsx("div",{className:"admin-modal-overlay",onMouseDown:N,children:e.jsx("div",{className:"admin-modal-dialog large",onMouseDown:R=>R.stopPropagation(),children:e.jsxs("div",{className:"admin-modal-content",children:[e.jsxs("div",{className:"admin-modal-header",children:[e.jsxs("div",{className:"admin-modal-heading",children:[e.jsx("div",{className:"admin-modal-avatar",children:v.photo_path?e.jsx(Yi,{filePath:v.photo_path,alt:v.full_name}):ye(v.full_name)}),e.jsxs("div",{children:[e.jsx("span",{children:"DETAIL PESERTA"}),e.jsx("h2",{children:v.full_name}),e.jsxs("p",{children:[v.registration_code," ","·"," ",v.program_name]})]})]}),e.jsx("button",{type:"button",className:"admin-modal-close",onClick:N,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"admin-detail-tabs",children:[e.jsxs("button",{type:"button",className:_==="basic"?"active":"",onClick:()=>E("basic"),children:[e.jsx("i",{className:"bi bi-person"}),"Informasi Dasar"]}),e.jsxs("button",{type:"button",className:_==="personal"?"active":"",onClick:()=>E("personal"),children:[e.jsx("i",{className:"bi bi-person-vcard"}),"Data Pribadi"]}),e.jsxs("button",{type:"button",className:_==="address"?"active":"",onClick:()=>E("address"),children:[e.jsx("i",{className:"bi bi-geo-alt"}),"Alamat"]}),e.jsxs("button",{type:"button",className:_==="status"?"active":"",onClick:()=>E("status"),children:[e.jsx("i",{className:"bi bi-clipboard-check"}),"Status & Dokumen"]})]}),e.jsxs("div",{className:"admin-modal-body",children:[_==="basic"&&e.jsxs("div",{className:"admin-basic-detail-layout",children:[e.jsxs("div",{className:"admin-detail-section-card",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-person-lines-fill"})}),e.jsxs("span",{children:[e.jsx("small",{children:"KONTAK PESERTA"}),e.jsx("strong",{children:"Informasi Dasar"})]})]}),e.jsxs("div",{className:"admin-detail-data-grid",children:[e.jsx(ee,{label:"Nama Lengkap",value:v.full_name}),e.jsx(ee,{label:"Email",value:v.email}),e.jsx(ee,{label:"Nomor Handphone",value:v.phone}),e.jsx(ee,{label:"Tanggal Pendaftaran",value:qe.formatDate(v.registration_date)}),e.jsx(ee,{label:"Kode Pendaftaran",value:v.registration_code})]})]}),e.jsxs("div",{className:"admin-detail-section-card",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-briefcase"})}),e.jsxs("span",{children:[e.jsx("small",{children:"PROGRAM PILIHAN"}),e.jsx("strong",{children:"Informasi Program"})]})]}),e.jsxs("div",{className:"admin-detail-data-grid",children:[e.jsx(ee,{label:"Program",value:v.program_name}),e.jsx(ee,{label:"Biaya Pelatihan",value:qe.formatCurrency(v.program_training_cost)}),e.jsx(ee,{label:"Biaya Keberangkatan",value:qe.formatCurrency(v.program_departure_cost)}),e.jsx(ee,{label:"Durasi",value:v.program_duration}),e.jsx(ee,{label:"Lokasi",value:v.program_location})]})]})]}),_==="personal"&&Je(v),_==="address"&&He(v),_==="status"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"admin-status-overview-grid",children:[e.jsxs("div",{className:"admin-status-overview-card",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-person-check"})}),e.jsx("span",{children:"Interview"}),pe(v.registration_status)]}),e.jsxs("div",{className:"admin-status-overview-card",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-credit-card"})}),e.jsx("span",{children:"Pembayaran"}),se(v.payment_status,v.program_installment_plan),Number(v.amount_paid||0)>0&&e.jsx("small",{children:qe.formatCurrency(v.amount_paid)})]}),e.jsxs("div",{className:"admin-status-overview-card",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-clipboard-check"})}),e.jsx("span",{children:"Seleksi Diklat"}),Ae(v.selection_status)]}),e.jsxs("div",{className:"admin-status-overview-card",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-building"})}),e.jsx("span",{children:"Penyaluran Kerja"}),B(v.placement_status),v.company_name&&e.jsx("small",{children:v.company_name})]})]}),e.jsxs("div",{className:"admin-document-section",children:[e.jsxs("div",{className:"admin-detail-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-folder2-open"})}),e.jsxs("span",{children:[e.jsx("small",{children:"BERKAS PESERTA"}),e.jsx("strong",{children:"Dokumen & Sertifikat"})]})]}),e.jsxs("div",{className:"admin-document-card-grid",children:[e.jsxs("div",{className:"admin-document-card",children:[e.jsx("div",{className:"photo",children:e.jsx("i",{className:"bi bi-person-badge"})}),e.jsxs("span",{children:[e.jsx("small",{children:"FOTO PESERTA"}),e.jsx("strong",{children:"Foto Profil"})]}),v.photo_path?e.jsxs("a",{href:"#",onClick:R=>{R.preventDefault(),ue(v.photo_path)},target:"_blank",rel:"noopener noreferrer",children:["Lihat",e.jsx("i",{className:"bi bi-arrow-up-right"})]}):e.jsx("small",{className:"unavailable",children:"Tidak tersedia"})]}),e.jsxs("div",{className:"admin-document-card",children:[e.jsx("div",{className:"pdf",children:e.jsx("i",{className:"bi bi-file-earmark-pdf"})}),e.jsxs("span",{children:[e.jsx("small",{children:"DOKUMEN BAHASA"}),e.jsx("strong",{children:"Sertifikat N4"})]}),v.n4_certificate_path?e.jsxs("a",{href:"#",onClick:R=>{R.preventDefault(),ue(v.n4_certificate_path)},target:"_blank",rel:"noopener noreferrer",children:["Lihat",e.jsx("i",{className:"bi bi-arrow-up-right"})]}):e.jsx("small",{className:"unavailable",children:"Tidak tersedia"})]}),e.jsxs("div",{className:"admin-document-card",children:[e.jsx("div",{className:"pdf",children:e.jsx("i",{className:"bi bi-file-earmark-pdf"})}),e.jsxs("span",{children:[e.jsx("small",{children:"DOKUMEN KOMPETENSI"}),e.jsx("strong",{children:"Sertifikat SSW"})]}),v.ssw_certificate_path?e.jsxs("a",{href:"#",onClick:R=>{R.preventDefault(),ue(v.ssw_certificate_path)},target:"_blank",rel:"noopener noreferrer",children:["Lihat",e.jsx("i",{className:"bi bi-arrow-up-right"})]}):e.jsx("small",{className:"unavailable",children:"Tidak tersedia"})]})]})]})]})]}),e.jsxs("div",{className:"admin-modal-footer",children:[e.jsx("button",{type:"button",className:"admin-secondary-button",onClick:N,children:"Tutup"}),e.jsxs("button",{type:"button",className:"admin-primary-button",onClick:()=>D(v),children:[e.jsx("i",{className:"bi bi-pencil-square"}),"Update Status Interview"]})]})]})})}),M&&v&&e.jsx("div",{className:"admin-modal-overlay",onMouseDown:N,children:e.jsx("div",{className:"admin-modal-dialog",onMouseDown:R=>R.stopPropagation(),children:e.jsxs("div",{className:"admin-modal-content",children:[e.jsxs("div",{className:"admin-modal-header compact",children:[e.jsxs("div",{className:"admin-modal-heading",children:[e.jsx("div",{className:"admin-modal-heading-icon",children:e.jsx("i",{className:"bi bi-person-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"INTERVIEW PESERTA"}),e.jsx("h2",{children:"Update Status Pendaftaran"}),e.jsx("p",{children:v.full_name})]})]}),e.jsx("button",{type:"button",className:"admin-modal-close",onClick:N,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:k,children:[e.jsxs("div",{className:"admin-modal-body",children:[e.jsxs("div",{className:"admin-status-participant",children:[e.jsx("div",{className:"admin-status-participant-avatar",children:ye(v.full_name)}),e.jsxs("div",{children:[e.jsx("small",{children:"PESERTA"}),e.jsx("strong",{children:v.full_name}),e.jsxs("span",{children:[v.registration_code," ","·"," ",v.program_name]})]})]}),e.jsxs("div",{className:"admin-modal-field",children:[e.jsxs("label",{children:["Status Interview"," ",e.jsx("span",{children:"*"})]}),e.jsxs("select",{value:oe.registration_status,onChange:R=>re(be=>({...be,registration_status:R.target.value})),required:!0,children:[e.jsx("option",{value:"menunggu",children:"Menunggu Interview"}),e.jsx("option",{value:"lolos",children:"Lolos Interview"}),e.jsx("option",{value:"tidak_lolos",children:"Tidak Lolos Interview"})]}),e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-info-circle"}),"Status ini menentukan hasil tahap interview peserta."]})]}),e.jsxs("div",{className:"admin-modal-field",children:[e.jsx("label",{children:"Catatan Interview"}),e.jsx("textarea",{rows:"4",value:oe.notes,onChange:R=>re(be=>({...be,notes:R.target.value})),placeholder:"Tambahkan catatan mengenai hasil interview peserta..."}),e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-journal-text"}),"Catatan bersifat opsional dan akan tersimpan pada riwayat peserta."]})]})]}),e.jsxs("div",{className:"admin-modal-footer",children:[e.jsx("button",{type:"button",className:"admin-secondary-button",onClick:N,disabled:h,children:"Batal"}),e.jsx("button",{type:"submit",className:"admin-primary-button",disabled:h,children:h?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyimpan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-check-lg"}),"Simpan Status"]})})]})]})]})})})]})},ce={formatCurrency:i=>{if(!i&&i!==0)return"Rp 0";const l=parseFloat(i);return isNaN(l)?"Rp 0":`Rp ${Math.round(l).toLocaleString("id-ID")}`},parseFloatSafe:(i,l=0)=>{if(i==null||i==="")return l;const d=parseFloat(i);return isNaN(d)?l:Math.round(d*100)/100},calculateRemainingSafe:(i,l)=>{const d=Math.round(parseFloat(i||0)*100),o=Math.round(parseFloat(l||0)*100);return Math.max(0,(d-o)/100)},getStatusBadge:i=>{const d={pending:{class:"bg-warning",text:"Menunggu Pembayaran"},installment_1:{class:"bg-primary",text:"Cicilan 1"},installment_2:{class:"bg-primary",text:"Cicilan 2"},installment_3:{class:"bg-primary",text:"Cicilan 3"},installment_4:{class:"bg-primary",text:"Cicilan 4"},installment_5:{class:"bg-primary",text:"Cicilan 5"},installment_6:{class:"bg-primary",text:"Cicilan 6"},paid:{class:"bg-success",text:"Lunas"},overdue:{class:"bg-danger",text:"Jatuh Tempo"},cancelled:{class:"bg-secondary",text:"Dibatalkan"}}[i]||{class:"bg-secondary",text:i||"-"};return e.jsx("span",{className:`badge ${d.class}`,children:d.text})},getStatusText:i=>({pending:"Menunggu Pembayaran",installment_1:"Cicilan 1",installment_2:"Cicilan 2",installment_3:"Cicilan 3",installment_4:"Cicilan 4",installment_5:"Cicilan 5",installment_6:"Cicilan 6",paid:"Lunas",overdue:"Terlambat",cancelled:"Dibatalkan"})[i]||i||"-",getInstallmentPlanText:i=>{const l={none:"Bayar Penuh","3_installments":"3 Cicilan","4_installments":"4 Cicilan","5_installments":"5 Cicilan","6_installments":"6 Cicilan"};if(l[i])return l[i];const d=parseInt(String(i||"").split("_")[0],10);return[3,4,5,6].includes(d)?`${d} Cicilan`:"-"},getTotalInstallments:i=>{if(!i)return 4;const l=String(i.program_installment_plan||"");if(!l)return 4;if(l==="none")return 1;const d=l.match(/^([3-6])_installments$/);if(d)return Number(d[1]);const o=parseInt(l.split("_")[0],10);return[3,4,5,6].includes(o)?o:4},getInstallmentText:i=>{if(!i||!i.status)return"Unknown";if(i.status==="paid")return"Lunas";const l=ce.getTotalInstallments(i);return i.status==="pending"?l===1?"Pembayaran Penuh":"Menunggu Pembayaran":i.status.startsWith("installment_")?`Cicilan ${i.status.split("_")[1]}`:i.status},getCurrentInstallmentInfo:i=>{if(!i)return{number:0,text:"Unknown",isPaid:!1,totalInstallments:4,isWaitingVerification:!1};const l=ce.getTotalInstallments(i),d=ce.isWaitingVerification(i);if(i.status==="paid")return{number:l,text:"Lunas",isPaid:!0,totalInstallments:l,isWaitingVerification:!1};if(i.status==="pending")return{number:1,text:l===1?"Pembayaran Penuh":"Menunggu Cicilan 1",isPaid:!1,totalInstallments:l,isWaitingVerification:d};if(i.status.startsWith("installment_")){const o=parseInt(i.status.split("_")[1],10)||1,u=ce.isInstallmentPaid(i,o);let h=l===1?"Pembayaran Penuh":`Cicilan ${o}`;return d?h+=" (Menunggu Verifikasi)":u&&(h+=" (Sudah Dibayar)"),{number:o,text:h,isPaid:u,totalInstallments:l,isWaitingVerification:d}}return{number:0,text:i.status,isPaid:!1,totalInstallments:l,isWaitingVerification:d}},getNextInstallmentInfo:i=>{if(!i)return{number:0,text:"Unknown",exists:!1,totalInstallments:4};const l=ce.getCurrentInstallmentInfo(i),d=l.totalInstallments;if(d===1||l.number>=d||i.status==="paid")return{number:null,text:"Lunas",exists:!1,totalInstallments:d};const o=l.number+1;return{number:o,text:`Cicilan ${o}`,exists:!0,totalInstallments:d}},isInstallmentPaid:(i,l)=>{if(!i||!l)return!1;if(i.status==="paid")return!0;const d=ce.getTotalInstallments(i),o=ce.parseFloatSafe(i.program_training_cost),u=ce.parseFloatSafe(i.amount_paid);if(o>0&&u>=o)return!0;if(d<=0||o<=0)return!1;const p=o/d*l;return u+.01>=p},getCurrentInstallmentAmount:i=>{if(!i)return 0;const l=ce.parseFloatSafe(i.program_training_cost),d=ce.getTotalInstallments(i),o=ce.parseFloatSafe(i.amount_paid);if(d===1)return Math.max(0,l-o);if(!i.due_date&&i.status!=="pending")return 0;if(i.installment_amounts)try{const u=typeof i.installment_amounts=="string"?JSON.parse(i.installment_amounts):i.installment_amounts,p=ce.getCurrentInstallmentInfo(i).number;if(p>0){const x=`installment_${p}`;if(u[x]?.amount)return parseFloat(u[x].amount)}for(let x=1;x<=d;x++){const y=`installment_${x}`;if(u[y]?.amount)return parseFloat(u[y].amount)}}catch(u){console.error("❌ Error parsing installment_amounts:",u)}return d>0?Math.round(l/d):0},isOverdue:i=>{if(!i?.due_date||i.status==="paid")return!1;try{const l=new Date(i.due_date);l.setHours(0,0,0,0);const d=new Date;return d.setHours(0,0,0,0),l<d}catch(l){return console.error("Error checking overdue:",l),!1}},isDueSoon:i=>{if(!i?.due_date||i.status==="paid")return!1;try{const l=new Date(i.due_date);l.setHours(0,0,0,0);const d=new Date;d.setHours(0,0,0,0);const o=new Date(d);return o.setDate(d.getDate()+3),l>=d&&l<=o}catch(l){return console.error("Error checking due soon:",l),!1}},isWaitingVerification:i=>{if(!i||i.status==="paid"||i.status==="cancelled")return!1;const l=!!i.proof_image,d=!i.verified_by;return l&&d},needsUpload:i=>{if(!i)return!1;const l=ce.getCurrentInstallmentInfo(i),d=!!i.due_date,o=!i.proof_image,u=!i.verified_by,h=i.status!=="paid"&&i.status!=="cancelled",p=!l.isPaid;return d&&o&&u&&h&&p},hasActiveInvoice:i=>{if(!i)return!1;const l=!!i.due_date,d=i.status!=="paid"&&i.status!=="cancelled",o=ce.parseFloatSafe(i.amount_paid||0)<ce.parseFloatSafe(i.program_training_cost||0),u=!ce.isWaitingVerification(i);return l&&d&&o&&u},isWaitingForInvoice:i=>{if(!i)return!1;const l=ce.parseFloatSafe(i.amount_paid||0)<ce.parseFloatSafe(i.program_training_cost||0),d=ce.getCurrentInstallmentInfo(i),o=ce.getNextInstallmentInfo(i);return!i.due_date&&l&&i.status!=="paid"&&i.status!=="cancelled"&&d.isPaid&&o.exists&&!ce.isWaitingVerification(i)},getInstallmentInfo:i=>{if(!i)return{currentInstallment:0,totalInstallments:4,totalAmount:0,paidAmount:0,remainingAmount:0,progressPercentage:0};const l=ce.parseFloatSafe(i.program_training_cost||0),d=ce.parseFloatSafe(i.amount_paid||0),o=Math.max(0,l-d),u=ce.getCurrentInstallmentInfo(i);return{currentInstallment:u.number,totalInstallments:u.totalInstallments,totalAmount:l,paidAmount:d,remainingAmount:o,progressPercentage:l>0?Math.min(100,d/l*100):0}},validatePayment:i=>i?i.id?i.invoice_number?{isValid:!0,error:null}:{isValid:!1,error:"Invoice number is missing"}:{isValid:!1,error:"Payment ID is missing"}:{isValid:!1,error:"Payment data is null"},getImageUrl:i=>i?i.startsWith("http")||i.startsWith("/")?i:`/${i}`:null},wN=()=>{const{user:i}=Wa(),[l,d]=j.useState([]),[o,u]=j.useState(!0),[h,p]=j.useState(null),[x,y]=j.useState(!1),[f,b]=j.useState(!1),[v,A]=j.useState(!1),[P,w]=j.useState(!1),[M,H]=j.useState(null),[_,E]=j.useState(null),[L,q]=j.useState({type:"",text:""}),[oe,re]=j.useState([]),te=j.useCallback(B=>{if(!B)return"-";try{return new Date(B).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"})}catch(S){return console.error("Error formatting date:",S),"-"}},[]),ge=j.useCallback(B=>{if(!B)return 0;const S=ce.parseFloatSafe(B?.program_training_cost)||0,ee=ce.parseFloatSafe(B?.amount_paid)||0;return S<=0?0:Math.min(100,ee/S*100)},[]),ye=j.useCallback(B=>{if(!B)return 0;const S=ce.parseFloatSafe(B?.program_training_cost)||0,ee=ce.parseFloatSafe(B?.amount_paid)||0;return ce.calculateRemainingSafe(S,ee)},[]),he=j.useCallback(B=>B?ce.getCurrentInstallmentAmount(B):0,[]),Oe=j.useCallback(B=>{if(!B||B.length===0)return[];const S=[];return B.forEach(ee=>{const Je=ce.validatePayment(ee);if(!Je.isValid){console.warn("Invalid payment data:",Je.error);return}const He=ce.getCurrentInstallmentInfo(ee),R=ce.getNextInstallmentInfo(ee),be=ce.hasActiveInvoice(ee),ke=ce.isWaitingForInvoice(ee),Ie=ce.isWaitingVerification(ee),oa=he(ee);if(be&&ce.isOverdue(ee)&&!Ie?S.push({type:"danger",title:"Pembayaran Terlambat!",message:`Tagihan ${ee.invoice_number} (${He.text}) sudah melewati batas waktu. Segera lakukan pembayaran.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,dueDate:ee.due_date,amount:oa,installmentText:He.text,icon:"bi-exclamation-triangle",action:"upload"}):be&&ce.isDueSoon(ee)&&!Ie&&S.push({type:"warning",title:"Akan Jatuh Tempo",message:`Tagihan ${ee.invoice_number} (${He.text}) akan jatuh tempo pada ${te(ee.due_date)}.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,dueDate:ee.due_date,amount:oa,installmentText:He.text,icon:"bi-clock",action:"upload"}),Ie)S.push({type:"secondary",title:"Menunggu Verifikasi Admin",message:`Bukti pembayaran untuk ${ee.invoice_number} (${He.text}) sedang diverifikasi. Biasanya membutuhkan 1-2 hari kerja.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,installmentText:He.text,icon:"bi-hourglass-split",action:"view_proof"});else if(be&&ce.needsUpload(ee))S.push({type:"primary",title:"Upload Bukti Pembayaran",message:`Silakan upload bukti pembayaran untuk ${He.text} sebesar ${ce.formatCurrency(oa)}.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,dueDate:ee.due_date,amount:oa,installmentText:He.text,action:"upload",icon:"bi-upload"});else if(ke&&R.exists)S.push({type:"info",title:"Menunggu Tagihan Berikutnya",message:`Pembayaran ${He.text} sudah diverifikasi. Admin akan menerbitkan tagihan ${R.text} untuk program ${ee.program_name}.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,installmentText:R.text,icon:"bi-clock-history"});else if(!ee.due_date&&ee.status==="pending"&&!Ie){const Te=ce.getTotalInstallments(ee);S.push({type:"info",title:Te===1?"Menunggu Tagihan Pembayaran":"Menunggu Tagihan Pertama",message:Te===1?`Admin akan menerbitkan tagihan pembayaran untuk program ${ee.program_name}. Silakan tunggu pemberitahuan selanjutnya.`:`Admin akan menerbitkan tagihan cicilan pertama untuk program ${ee.program_name}. Silakan tunggu pemberitahuan selanjutnya.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,installmentText:Te===1?"Bayar Penuh":"Cicilan 1",icon:"bi-info-circle"})}else ee.status==="paid"?S.push({type:"success",title:"Pembayaran Lunas",message:`Selamat! Pembayaran untuk ${ee.program_name} sudah lunas.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,icon:"bi-check-circle"}):be&&!Ie&&S.push({type:"info",title:"Tagihan Aktif",message:`Tagihan ${He.text} sebesar ${ce.formatCurrency(oa)}.`,paymentId:ee.id,invoiceNumber:ee.invoice_number,dueDate:ee.due_date,amount:oa,installmentText:He.text,action:"upload",icon:"bi-receipt"})}),S.sort((ee,Je)=>{const He={secondary:0,danger:1,warning:2,primary:3,info:4,success:5};return He[ee.type]-He[Je.type]})},[te,he]),Ce=j.useCallback(async()=>{if(!i?.id){console.warn("User ID not available"),u(!1);return}try{u(!0),q({type:"",text:""});const B=await de.get(`/api/payments/user/${i.id}`,{timeout:1e4});if(B.data?.success){const S=Array.isArray(B.data.data)?B.data.data:[];d(S),re(Oe(S))}else throw new Error(B.data?.message||"Format response tidak valid")}catch(B){console.error("❌ Error fetching payments:",B);const S=B.response?.data?.message||B.message||"Gagal memuat data pembayaran";q({type:"error",text:S}),d([]),re([])}finally{u(!1)}},[i,Oe]);j.useEffect(()=>{Ce()},[Ce]),j.useEffect(()=>()=>{_&&URL.revokeObjectURL(_)},[_]);const Se=B=>{const S=B.target.files[0];if(!S)return;if(!["image/jpeg","image/jpg","image/png","image/gif"].includes(S.type)){q({type:"error",text:"Hanya file gambar (JPG, PNG, GIF) yang diizinkan"}),B.target.value="";return}if(S.size>5*1024*1024){q({type:"error",text:"Ukuran file maksimal 5MB"}),B.target.value="";return}_&&URL.revokeObjectURL(_),H(S),q({type:"",text:""});const Je=URL.createObjectURL(S);E(Je)},Z=()=>{y(!1),p(null),H(null),_&&(URL.revokeObjectURL(_),E(null)),q({type:"",text:""})},fe=async()=>{if(!M||!h){q({type:"error",text:"Pilih file bukti pembayaran terlebih dahulu"});return}const B=ce.validatePayment(h);if(!B.isValid){q({type:"error",text:"Data pembayaran tidak valid: "+B.error});return}w(!0),q({type:"",text:""});try{const S=new FormData;S.append("proof_image",M);const ee=await de.post(`/api/payments/${h.id}/upload-proof`,S,{headers:{"Content-Type":"multipart/form-data"},timeout:3e4});if(ee.data?.success)q({type:"success",text:"✅ Bukti pembayaran berhasil diupload! Status sekarang: Menunggu Verifikasi Admin. Admin akan memverifikasi dalam 1-2 hari kerja."}),Z(),setTimeout(()=>{Ce()},2e3);else throw new Error(ee.data?.message||"Upload gagal")}catch(S){console.error("❌ Error uploading proof:",S),q({type:"error",text:S.response?.data?.message||S.message||"Gagal upload bukti pembayaran"})}finally{w(!1)}},U=B=>B?ce.needsUpload(B):!1,ie=B=>B?B.verified_by&&B.status!=="pending"&&B.status!=="cancelled":!1,I=async B=>{const S=ce.validatePayment(B);if(!S.isValid){q({type:"error",text:"Data pembayaran tidak valid: "+S.error});return}try{try{const Te=await de.get(`/api/payments/${B.id}/receipt`,{responseType:"blob",timeout:15e3}),Ra=window.URL.createObjectURL(new Blob([Te.data])),Ke=document.createElement("a");Ke.href=Ra,Ke.setAttribute("download",`kwitansi-${B.receipt_number||B.invoice_number}.pdf`),document.body.appendChild(Ke),Ke.click(),Ke.remove(),window.URL.revokeObjectURL(Ra),q({type:"success",text:"Kwitansi PDF berhasil diunduh"});return}catch(Te){console.log("PDF receipt not available, generating HTML receipt...",Te)}const ee=window.open("","_blank");if(!ee){q({type:"error",text:"Popup diblokir. Izinkan popup untuk generate kwitansi."});return}const Je=B.payment_date?new Date(B.payment_date).toLocaleDateString("id-ID"):new Date().toLocaleDateString("id-ID"),He=ce.parseFloatSafe(B.program_training_cost||0),R=ce.parseFloatSafe(B.amount_paid||0),be=ce.calculateRemainingSafe(He,R),ke=he(B),Ie=ce.getInstallmentText(B),oa=ce.getInstallmentPlanText(B.program_installment_plan);ee.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>KWITANSI - ${B.receipt_number||B.invoice_number}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              position: relative;
            }
            .receipt-header {
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .receipt-title {
              font-size: 2.5em;
              font-weight: 700;
              margin-bottom: 10px;
              letter-spacing: 2px;
              position: relative;
              z-index: 1;
            }
            .receipt-subtitle {
              font-size: 1.2em;
              font-weight: 300;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .company-info {
              background: #f8f9fa;
              padding: 25px 30px;
              border-bottom: 1px solid #e9ecef;
              text-align: center;
            }
            .company-name {
              font-size: 1.4em;
              font-weight: 700;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .company-address {
              color: #6c757d;
              line-height: 1.5;
            }
            .receipt-content {
              padding: 40px 30px;
            }
            .receipt-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .info-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .info-label {
              font-size: 0.85em;
              color: #6c757d;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 1.1em;
              font-weight: 600;
              color: #2c3e50;
            }
            .installment-highlight {
              background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
              border: 2px solid #ffd43b;
              border-radius: 15px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
            }
            .installment-text {
              font-size: 1.1em;
              color: #856404;
              font-weight: 500;
              margin-bottom: 10px;
            }
            .installment-amount {
              font-size: 1.8em;
              font-weight: 700;
              color: #e67700;
            }
            .section {
              margin-bottom: 35px;
            }
            .section-title {
              font-size: 1.1em;
              font-weight: 600;
              color: #007bff;
              padding: 12px 20px;
              background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
              border-radius: 10px;
              margin-bottom: 20px;
              border-left: 4px solid #007bff;
            }
            .data-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .data-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 10px;
              border: 1px solid #e9ecef;
            }
            .progress-container {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .progress-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              font-weight: 600;
              color: #2c3e50;
            }
            .progress-bar-container {
              height: 12px;
              background: #e9ecef;
              border-radius: 10px;
              overflow: hidden;
              margin: 15px 0;
            }
            .progress-bar {
              height: 100%;
              background: linear-gradient(90deg, #28a745, #20c997);
              border-radius: 10px;
            }
            .progress-text {
              text-align: center;
              font-weight: 600;
              color: #495057;
              font-size: 1.1em;
            }
            .payment-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            .payment-table th {
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              padding: 18px 15px;
              text-align: left;
              font-weight: 600;
            }
            .payment-table td {
              padding: 18px 15px;
              border-bottom: 1px solid #e9ecef;
              font-weight: 500;
            }
            .payment-table .amount {
              text-align: right;
              font-weight: 600;
            }
            .payment-table .total-row {
              background: #f8f9fa;
              font-weight: 700;
              font-size: 1.1em;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 20px;
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              border-radius: 25px;
              font-weight: 600;
              font-size: 1.1em;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .signature-area {
              margin-top: 50px;
              text-align: right;
              padding: 30px;
              background: #f8f9fa;
              border-radius: 15px;
              border: 1px solid #e9ecef;
            }
            .signature-line {
              width: 300px;
              height: 1px;
              background: #6c757d;
              margin: 60px 0 10px auto;
            }
            .footer {
              background: #2c3e50;
              color: white;
              padding: 30px;
              text-align: center;
              margin-top: 40px;
            }
            .footer-text {
              font-size: 0.9em;
              opacity: 0.8;
              line-height: 1.6;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 8em;
              font-weight: 900;
              color: rgba(0, 123, 255, 0.03);
              pointer-events: none;
              z-index: 0;
              white-space: nowrap;
            }
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
              }
              .receipt-container {
                box-shadow: none !important;
                margin: 0 !important;
                max-width: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="watermark">FITALENTA</div>
            <div class="receipt-header">
              <h1 class="receipt-title">KWITANSI RESMI</h1>
              <p class="receipt-subtitle">Program Magang Perusahaan</p>
            </div>
            <div class="company-info">
              <div class="company-name">FITALENTA</div>
              <div class="company-address">
                Jl. Ganesha No.15E, Lb. Siliwangi, Kec. Coblong Bandung 40132<br>
                Telp: (021) 123-4567 | Email: admin@fitalenta.com
              </div>
            </div>
            <div class="receipt-content">
              <div class="receipt-info-grid">
                <div class="info-item">
                  <span class="info-label">No. Kwitansi</span>
                  <span class="info-value">${B.receipt_number||B.invoice_number}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">No. Invoice</span>
                  <span class="info-value">${B.invoice_number}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tanggal Kwitansi</span>
                  <span class="info-value">${Je}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status Pembayaran</span>
                  <span class="info-value">${ce.getStatusText(B.status)}</span>
                </div>
              </div>
              <div class="installment-highlight">
                <div class="installment-text">${Ie}</div>
                <div class="installment-amount">${ce.formatCurrency(ke)}</div>
              </div>
              <div class="section">
                <div class="section-title">DATA PESERTA</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Nama Lengkap</span>
                    <span class="info-value">${i?.full_name||"N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${i?.email||"N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Nomor Telepon</span>
                    <span class="info-value">${i?.phone||"N/A"}</span>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">DETAIL PROGRAM</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Program Magang</span>
                    <span class="info-value">${B.program_name||"N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Durasi Program</span>
                    <span class="info-value">${B.program_duration||"N/A"}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Total Biaya Program</span>
                    <span class="info-value">${ce.formatCurrency(He)}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Plan Cicilan</span>
                    <span class="info-value">${oa}</span>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">PROGRESS PEMBAYARAN</div>
                <div class="progress-container">
                  <div class="progress-header">
                    <span>Progress Pembayaran</span>
                    <span>${ge(B).toFixed(1)}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${ge(B)}%"></div>
                  </div>
                  <div class="progress-text">
                    ${ce.formatCurrency(R)} / ${ce.formatCurrency(He)}
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="section-title">RINCIAN PEMBAYARAN</div>
                <table class="payment-table">
                  <thead>
                    <tr>
                      <th>Keterangan</th>
                      <th style="text-align: right;">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Biaya Program ${B.program_name||""}</td>
                      <td class="amount">${ce.formatCurrency(He)}</td>
                    </tr>
                    <tr class="total-row">
                      <td>TOTAL TAGIHAN</td>
                      <td class="amount">${ce.formatCurrency(He)}</td>
                    </tr>
                    <tr class="total-row">
                      <td>SUDAH DIBAYAR</td>
                      <td class="amount">${ce.formatCurrency(R)}</td>
                    </tr>
                    ${be>0?`
                    <tr class="total-row">
                      <td>SISA TAGIHAN</td>
                      <td class="amount">${ce.formatCurrency(be)}</td>
                    </tr>
                    `:""}
                  </tbody>
                </table>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <div class="status-badge">
                  ${B.status==="paid"?"LUNAS":ce.getInstallmentText(B).toUpperCase()}
                </div>
              </div>
              ${B.status==="paid"?`
              <div class="section">
                <div class="section-title">KONFIRMASI PEMBAYARAN</div>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="info-label">Status</span>
                    <span class="info-value" style="color: #28a745; font-weight: 700;">LUNAS</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Tanggal Pembayaran</span>
                    <span class="info-value">${Je}</span>
                  </div>
                  <div class="data-item">
                    <span class="info-label">Metode Pembayaran</span>
                    <span class="info-value">${B.payment_method||"Transfer Bank"}</span>
                  </div>
                  ${B.bank_name?`
                  <div class="data-item">
                    <span class="info-label">Bank</span>
                    <span class="info-value">${B.bank_name}</span>
                  </div>
                  `:""}
                </div>
              </div>
              `:""}
              <div class="signature-area">
                <p>Bandung, ${Je}</p>
                <div class="signature-line"></div>
                <p style="font-weight: 700; margin-top: 10px;">Admin FITALENTA</p>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">
                ** Kwitansi ini sah dan dapat digunakan sebagai bukti pembayaran yang valid **<br>
                Terima kasih telah mempercayai program magang kami<br>
                Generated on: ${new Date().toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </body>
        </html>
      `),ee.document.close(),setTimeout(()=>{ee.print()},1e3)}catch(ee){console.error("❌ Error generating receipt:",ee),q({type:"error",text:"Gagal mengunduh kwitansi: "+(ee.message||"Unknown error")})}},ue=B=>{const S=ce.validatePayment(B);if(!S.isValid){q({type:"error",text:"Data pembayaran tidak valid: "+S.error});return}p(B),b(!0)},D=()=>{b(!1),p(null)},N=B=>{p(B),A(!0)},k=()=>{A(!1),p(null)},Y=B=>{const S=l.find(ee=>ee.id===B.paymentId);if(!S){q({type:"error",text:"Data pembayaran tidak ditemukan"});return}B.action==="upload"?(p(S),y(!0)):B.action==="view_proof"&&S.proof_image&&N(S)},X=B=>{re(S=>S.filter((ee,Je)=>Je!==B))},se=()=>{re([])};if(o)return e.jsx("div",{className:"payment-page",children:e.jsx("div",{className:"payment-shell",children:e.jsxs("div",{className:"payment-loading-state",children:[e.jsx("div",{className:"payment-loading-icon",children:e.jsx("div",{className:"spinner-border",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}),e.jsx("strong",{children:"Memuat data pembayaran"}),e.jsx("span",{children:"Mohon tunggu sebentar, kami sedang menyiapkan informasi pembayaran Anda."})]})})});const pe={danger:oe.filter(B=>B.type==="danger").length,warning:oe.filter(B=>B.type==="warning").length,primary:oe.filter(B=>B.type==="primary").length,secondary:oe.filter(B=>B.type==="secondary").length,info:oe.filter(B=>B.type==="info").length,success:oe.filter(B=>B.type==="success").length},Ae=B=>{const S=ge(B),ee=ce.isOverdue(B),Je=ce.hasActiveInvoice(B),He=ce.isWaitingForInvoice(B),R=ce.isWaitingVerification(B),be=he(B),ke=ce.getCurrentInstallmentInfo(B),Ie=ce.getNextInstallmentInfo(B);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"payment-invoice-cell",children:[e.jsx("div",{className:"payment-table-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("strong",{children:B.invoice_number}),B.receipt_number&&e.jsxs("small",{children:["Kwitansi:"," ",B.receipt_number]}),R&&e.jsxs("div",{className:"payment-inline-status warning",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),e.jsxs("span",{children:["Menunggu Verifikasi"," ",ke.text]})]}),Je&&!R&&e.jsxs("div",{className:"payment-inline-status primary",children:[e.jsx("i",{className:"bi bi-wallet2"}),e.jsx("span",{children:be>0?`Tagihan ${ke.text}: ${ce.formatCurrency(be)}`:`Tagihan ${ke.text}`})]}),He&&Ie.exists&&!R&&e.jsxs("div",{className:"payment-inline-status primary",children:[e.jsx("i",{className:"bi bi-clock-history"}),e.jsxs("span",{children:["Menunggu"," ",Ie.text," dari Admin"]})]}),ke.isPaid&&Ie.exists&&!Je&&!R&&e.jsxs("div",{className:"payment-inline-status success",children:[e.jsx("i",{className:"bi bi-check-circle"}),e.jsx("span",{children:ke.text})]})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-program-cell",children:[e.jsx("strong",{children:B.program_name}),e.jsx("span",{children:B.program_duration||"-"}),e.jsxs("small",{children:["Total"," ",ce.formatCurrency(B.program_training_cost)]}),e.jsx("small",{children:ce.getInstallmentPlanText(B.program_installment_plan)})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-progress-cell",children:[e.jsxs("div",{className:"payment-progress-header",children:[e.jsx("span",{children:"Progress"}),e.jsxs("strong",{children:[S.toFixed(0),"%"]})]}),e.jsx("div",{className:"payment-progress-track",children:e.jsx("span",{style:{width:`${S}%`}})}),e.jsxs("div",{className:"payment-progress-values",children:[e.jsx("strong",{children:ce.formatCurrency(B.amount_paid||0)}),e.jsxs("span",{children:["dari"," ",ce.formatCurrency(B.program_training_cost||0)]})]}),S<100&&e.jsxs("small",{children:["Sisa"," ",ce.formatCurrency(ye(B))]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-status-cell",children:[ce.getStatusBadge(B.status),R&&e.jsxs("div",{className:"payment-status-description warning",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),e.jsx("span",{children:"Menunggu verifikasi admin"})]}),Je&&B.due_date&&!R&&e.jsxs("div",{className:`payment-status-description ${ee?"danger":""}`,children:[e.jsx("i",{className:"bi bi-calendar-event"}),e.jsxs("span",{children:[ke.text,e.jsx("br",{}),"Jatuh tempo"," ",te(B.due_date)]})]}),He&&Ie.exists&&!R&&e.jsxs("div",{className:"payment-status-description",children:[e.jsx("i",{className:"bi bi-clock-history"}),e.jsxs("span",{children:["Menunggu ",Ie.text]})]}),ke.isPaid&&Ie.exists&&!Je&&!R&&e.jsxs("div",{className:"payment-status-description success",children:[e.jsx("i",{className:"bi bi-check-circle"}),e.jsxs("span",{children:[ke.text," sudah dibayar"]})]}),B.status==="paid"&&e.jsxs("div",{className:"payment-status-description success",children:[e.jsx("i",{className:"bi bi-check-circle"}),e.jsx("span",{children:"Pembayaran lunas"})]})]})}),e.jsx("td",{children:B.receipt_number?e.jsxs("span",{className:"payment-receipt-badge",children:[e.jsx("i",{className:"bi bi-check-circle"}),B.receipt_number]}):e.jsx("span",{className:"payment-receipt-empty",children:"Belum tersedia"})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-action-group",children:[U(B)&&e.jsx("button",{type:"button",className:"payment-action-btn",onClick:()=>{p(B),y(!0)},title:"Upload Bukti Bayar",children:e.jsx("i",{className:"bi bi-upload"})}),B.proof_image&&e.jsx("button",{type:"button",className:"payment-action-btn",onClick:()=>N(B),title:"Lihat Bukti Pembayaran",children:e.jsx("i",{className:"bi bi-eye"})}),ie(B)&&e.jsx("button",{type:"button",className:"payment-action-btn",onClick:()=>I(B),title:"Download Kwitansi",children:e.jsx("i",{className:"bi bi-download"})}),e.jsx("button",{type:"button",className:"payment-action-btn",onClick:()=>ue(B),title:"Lihat Detail Pembayaran",children:e.jsx("i",{className:"bi bi-info-circle"})})]})})]},B.id)};return e.jsx("div",{className:"payment-page",children:e.jsxs("div",{className:"payment-shell",children:[e.jsxs("header",{className:"payment-header",children:[e.jsxs("span",{className:"payment-header-badge",children:[e.jsx("i",{className:"bi bi-credit-card-2-front"}),"FITALENTA PAYMENT"]}),e.jsx("div",{className:"payment-header-content",children:e.jsxs("div",{children:[e.jsx("h1",{children:"Manajemen Pembayaran"}),e.jsx("p",{children:"Kelola invoice, pembayaran cicilan, dan bukti pembayaran program magang Anda dalam satu tempat."})]})}),e.jsxs("div",{className:"payment-header-benefits",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-shield-check"}),e.jsx("span",{children:"Aman & Terverifikasi"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-receipt"}),e.jsx("span",{children:"Invoice Terintegrasi"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-arrow-repeat"}),e.jsx("span",{children:"Pembayaran Bertahap"})]})]})]}),L.text&&e.jsxs("div",{className:`payment-message ${L.type==="error"?"danger":L.type==="success"?"success":"info"}`,children:[e.jsx("div",{className:"payment-message-icon",children:e.jsx("i",{className:`bi ${L.type==="error"?"bi-exclamation-circle":L.type==="success"?"bi-check-circle":"bi-info-circle"}`})}),e.jsxs("div",{className:"payment-message-content",children:[e.jsx("strong",{children:L.type==="error"?"Terjadi Kendala":L.type==="success"?"Berhasil":"Informasi"}),e.jsx("span",{children:L.text})]}),e.jsx("button",{type:"button",className:"payment-message-close",onClick:()=>q({type:"",text:""}),"aria-label":"Tutup",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),oe.length>0&&e.jsxs("section",{className:"payment-summary-alert",children:[e.jsx("div",{className:"payment-summary-alert-icon",children:e.jsx("i",{className:"bi bi-bell"})}),e.jsxs("div",{className:"payment-summary-alert-content",children:[e.jsxs("strong",{children:["Anda memiliki"," ",oe.length," ","pemberitahuan pembayaran"]}),e.jsx("span",{children:"Periksa informasi berikut agar proses pembayaran berjalan lancar."}),e.jsxs("div",{className:"payment-summary-chips",children:[pe.danger>0&&e.jsxs("span",{className:"danger",children:[e.jsx("i",{className:"bi bi-exclamation-triangle"}),"Terlambat"," ",pe.danger]}),pe.warning>0&&e.jsxs("span",{className:"warning",children:[e.jsx("i",{className:"bi bi-clock"}),"Jatuh Tempo"," ",pe.warning]}),pe.primary>0&&e.jsxs("span",{className:"primary",children:[e.jsx("i",{className:"bi bi-upload"}),"Perlu Upload"," ",pe.primary]}),pe.secondary>0&&e.jsxs("span",{className:"secondary",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),"Verifikasi"," ",pe.secondary]}),pe.info>0&&e.jsxs("span",{className:"info",children:[e.jsx("i",{className:"bi bi-info-circle"}),"Informasi"," ",pe.info]}),pe.success>0&&e.jsxs("span",{className:"success",children:[e.jsx("i",{className:"bi bi-check-circle"}),"Lunas"," ",pe.success]})]})]})]}),oe.length>0&&e.jsxs("section",{className:"payment-alert-panel",children:[e.jsxs("div",{className:"payment-section-header",children:[e.jsxs("div",{className:"payment-section-heading",children:[e.jsx("div",{className:"payment-section-icon",children:e.jsx("i",{className:"bi bi-bell"})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Pemberitahuan Pembayaran"}),e.jsx("p",{children:"Informasi yang membutuhkan perhatian Anda."})]})]}),e.jsx("span",{className:"payment-count-badge",children:oe.length})]}),e.jsx("div",{className:"payment-alert-list",children:oe.map((B,S)=>e.jsxs("div",{className:`payment-alert-item ${B.type}`,children:[e.jsx("div",{className:"payment-alert-item-icon",children:e.jsx("i",{className:`bi ${B.icon}`})}),e.jsxs("div",{className:"payment-alert-item-content",children:[e.jsx("strong",{children:B.title}),e.jsx("p",{children:B.message}),e.jsxs("div",{className:"payment-alert-details",children:[B.amount>0&&e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-wallet2"}),ce.formatCurrency(B.amount)]}),B.dueDate&&e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-calendar-event"}),te(B.dueDate)]})]})]}),e.jsxs("div",{className:"payment-alert-actions",children:[B.action==="upload"&&e.jsxs("button",{type:"button",className:"payment-alert-action-btn",onClick:()=>Y(B),children:[e.jsx("i",{className:"bi bi-upload"}),"Upload"]}),B.action==="view_proof"&&e.jsxs("button",{type:"button",className:"payment-alert-action-btn",onClick:()=>Y(B),children:[e.jsx("i",{className:"bi bi-eye"}),"Lihat Bukti"]}),e.jsx("button",{type:"button",className:"payment-alert-dismiss",onClick:()=>X(S),"aria-label":"Sembunyikan pemberitahuan",children:e.jsx("i",{className:"bi bi-x-lg"})})]})]},`${B.paymentId}-${S}`))}),e.jsxs("div",{className:"payment-alert-footer",children:[e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-bell"}),oe.length," ","pemberitahuan aktif"]}),e.jsxs("button",{type:"button",onClick:se,children:[e.jsx("i",{className:"bi bi-eye-slash"}),"Sembunyikan Semua"]})]})]}),e.jsxs("section",{className:"payment-process-card",children:[e.jsx("div",{className:"payment-section-header",children:e.jsxs("div",{className:"payment-section-heading",children:[e.jsx("div",{className:"payment-section-icon",children:e.jsx("i",{className:"bi bi-diagram-3"})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Sistem Pembayaran"}),e.jsx("p",{children:"Ketahui alur pembayaran program magang FITALENTA."})]})]})}),e.jsxs("div",{className:"payment-process-grid",children:[e.jsxs("div",{className:"payment-process-step",children:[e.jsx("div",{className:"payment-process-number",children:"01"}),e.jsx("div",{className:"payment-process-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsx("strong",{children:"Tagihan Diterbitkan"}),e.jsx("span",{children:"Admin menerbitkan tagihan pertama setelah Anda lolos interview."})]}),e.jsx("div",{className:"payment-process-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"payment-process-step",children:[e.jsx("div",{className:"payment-process-number",children:"02"}),e.jsx("div",{className:"payment-process-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsx("strong",{children:"Lakukan Pembayaran"}),e.jsx("span",{children:"Bayar sesuai nominal invoice yang telah diterbitkan."})]}),e.jsx("div",{className:"payment-process-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"payment-process-step",children:[e.jsx("div",{className:"payment-process-number",children:"03"}),e.jsx("div",{className:"payment-process-icon",children:e.jsx("i",{className:"bi bi-cloud-arrow-up"})}),e.jsx("strong",{children:"Upload Bukti"}),e.jsx("span",{children:"Unggah bukti pembayaran melalui halaman ini."})]}),e.jsx("div",{className:"payment-process-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"payment-process-step",children:[e.jsx("div",{className:"payment-process-number",children:"04"}),e.jsx("div",{className:"payment-process-icon",children:e.jsx("i",{className:"bi bi-shield-check"})}),e.jsx("strong",{children:"Verifikasi Admin"}),e.jsx("span",{children:"Admin memeriksa pembayaran dalam 1–2 hari kerja."})]}),e.jsx("div",{className:"payment-process-arrow",children:e.jsx("i",{className:"bi bi-arrow-right"})}),e.jsxs("div",{className:"payment-process-step",children:[e.jsx("div",{className:"payment-process-number",children:"05"}),e.jsx("div",{className:"payment-process-icon",children:e.jsx("i",{className:"bi bi-check2-circle"})}),e.jsx("strong",{children:"Tagihan Berikutnya"}),e.jsx("span",{children:"Untuk pembayaran cicilan, proses berulang hingga seluruh pembayaran dinyatakan lunas."})]})]}),e.jsxs("div",{className:"payment-process-note",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-info-circle"})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Menunggu Tagihan Admin"}),e.jsx("span",{children:"Jika status pembayaran menunjukkan “Menunggu Tagihan Admin”, Anda tidak perlu melakukan tindakan. Tagihan selanjutnya akan diterbitkan oleh admin."})]})]})]}),e.jsxs("section",{className:"payment-invoice-card",children:[e.jsxs("div",{className:"payment-invoice-header",children:[e.jsxs("div",{className:"payment-section-heading",children:[e.jsx("div",{className:"payment-section-icon",children:e.jsx("i",{className:"bi bi-receipt-cutoff"})}),e.jsxs("div",{children:[e.jsx("h2",{children:"Invoice Pembayaran"}),e.jsx("p",{children:"Lihat tagihan, progress, jatuh tempo, dan status pembayaran Anda."})]})]}),e.jsxs("button",{type:"button",className:"payment-refresh-btn",onClick:Ce,disabled:o,children:[e.jsx("i",{className:`bi bi-arrow-clockwise ${o?"spin":""}`}),e.jsx("span",{children:o?"Memuat...":"Refresh"})]})]}),e.jsx("div",{className:"payment-invoice-body",children:l.length===0?e.jsxs("div",{className:"payment-empty-state",children:[e.jsxs("div",{className:"payment-empty-visual",children:[e.jsx("div",{className:"payment-empty-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsx("span",{className:"payment-empty-decoration decoration-one"}),e.jsx("span",{className:"payment-empty-decoration decoration-two"})]}),e.jsx("span",{className:"payment-empty-label",children:"BELUM ADA INVOICE"}),e.jsx("h3",{children:"Belum ada pembayaran"}),e.jsx("p",{children:"Setelah Anda mendaftar program dan dinyatakan lolos interview, invoice pembayaran akan muncul secara otomatis di halaman ini."}),e.jsxs("div",{className:"payment-empty-info",children:[e.jsx("i",{className:"bi bi-info-circle"}),e.jsx("span",{children:"Tidak ada tindakan yang perlu dilakukan saat ini."})]})]}):e.jsx("div",{className:"payment-table-wrapper",children:e.jsxs("table",{className:"payment-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Invoice"}),e.jsx("th",{children:"Program & Biaya"}),e.jsx("th",{children:"Progress Pembayaran"}),e.jsx("th",{children:"Status & Jatuh Tempo"}),e.jsx("th",{children:"Kwitansi"}),e.jsx("th",{children:"Aksi"})]})}),e.jsx("tbody",{children:l.map(Ae)})]})})})]}),x&&h&&e.jsx("div",{className:"payment-modal-overlay",children:e.jsx("div",{className:"payment-modal-dialog",children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-cloud-arrow-up"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Upload Bukti Pembayaran"}),e.jsx("p",{children:"Unggah bukti transfer untuk diverifikasi oleh admin."})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:Z,disabled:P,"aria-label":"Tutup",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"payment-modal-body",children:[e.jsxs("div",{className:"payment-modal-notice",children:[e.jsx("i",{className:"bi bi-info-circle"}),e.jsx("span",{children:"Setelah bukti diunggah, admin akan melakukan verifikasi dalam 1–2 hari kerja."})]}),e.jsxs("div",{className:"payment-modal-summary-grid",children:[e.jsxs("div",{className:"payment-modal-summary-card",children:[e.jsxs("div",{className:"payment-modal-summary-heading",children:[e.jsx("i",{className:"bi bi-receipt"}),e.jsx("strong",{children:"Informasi Pembayaran"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Invoice"}),e.jsx("dd",{children:h.invoice_number})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Program"}),e.jsx("dd",{children:h.program_name})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Rencana Pembayaran"}),e.jsx("dd",{children:ce.getInstallmentPlanText(h.program_installment_plan)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Pembayaran Saat Ini"}),e.jsx("dd",{children:ce.getInstallmentText(h)})]}),e.jsxs("div",{className:"highlight",children:[e.jsx("dt",{children:"Jumlah Dibayar"}),e.jsx("dd",{children:ce.formatCurrency(he(h))})]}),h.due_date&&e.jsxs("div",{children:[e.jsx("dt",{children:"Jatuh Tempo"}),e.jsx("dd",{className:ce.isOverdue(h)?"danger":"",children:te(h.due_date)})]})]})]}),e.jsxs("div",{className:"payment-modal-summary-card",children:[e.jsxs("div",{className:"payment-modal-summary-heading",children:[e.jsx("i",{className:"bi bi-wallet2"}),e.jsx("strong",{children:"Detail Biaya"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Total Biaya"}),e.jsx("dd",{children:ce.formatCurrency(h.program_training_cost||0)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Sudah Dibayar"}),e.jsx("dd",{children:ce.formatCurrency(h.amount_paid||0)})]}),e.jsxs("div",{className:"highlight",children:[e.jsx("dt",{children:"Sisa Tagihan"}),e.jsx("dd",{children:ce.formatCurrency(ye(h))})]})]})]})]}),e.jsxs("div",{className:"payment-upload-section",children:[e.jsxs("label",{htmlFor:"proofFile",className:"payment-upload-label",children:["Bukti Pembayaran",e.jsx("span",{children:"*"})]}),e.jsxs("label",{htmlFor:"proofFile",className:`payment-upload-box ${M?"has-file":""}`,children:[e.jsx("input",{type:"file",id:"proofFile",accept:"image/*",onChange:Se,disabled:P}),e.jsx("div",{className:"payment-upload-icon",children:e.jsx("i",{className:`bi ${M?"bi-check-circle":"bi-cloud-arrow-up"}`})}),e.jsx("strong",{children:M?M.name:"Pilih bukti pembayaran"}),e.jsx("span",{children:"Klik area ini untuk memilih file dari perangkat Anda"}),e.jsx("small",{children:"JPG, PNG, GIF • Maksimal 5 MB"})]})]}),_&&e.jsxs("div",{className:"payment-proof-preview",children:[e.jsxs("div",{className:"payment-proof-preview-header",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-image"}),e.jsx("strong",{children:"Preview Bukti Pembayaran"})]}),e.jsx("span",{children:"SIAP DIUPLOAD"})]}),e.jsx("img",{src:_,alt:"Preview bukti pembayaran",onError:B=>{console.error("Error loading preview image"),B.target.style.display="none"}})]}),ce.isOverdue(h)&&e.jsxs("div",{className:"payment-modal-warning",children:[e.jsx("i",{className:"bi bi-exclamation-triangle"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Pembayaran melewati batas waktu"}),e.jsx("span",{children:"Segera selesaikan pembayaran agar proses program tidak terhambat."})]})]})]}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:Z,disabled:P,children:"Batal"}),e.jsx("button",{type:"button",className:"payment-primary-btn",onClick:fe,disabled:!M||P,children:P?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Mengupload..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-cloud-arrow-up"}),"Upload Bukti"]})})]})]})})}),v&&h&&h.proof_image&&e.jsx("div",{className:"payment-modal-overlay",children:e.jsx("div",{className:"payment-modal-dialog",children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-image"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Bukti Pembayaran"}),e.jsx("p",{children:h.invoice_number})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:k,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"payment-modal-body",children:[e.jsx("div",{className:"payment-proof-image-view",children:e.jsx(Yi,{filePath:h.proof_image,alt:"Bukti Pembayaran",onError:B=>{console.error("Error loading proof image"),B.target.style.display="none",q({type:"error",text:"Gagal memuat gambar bukti pembayaran"})}})}),e.jsxs("div",{className:"payment-proof-status",children:[e.jsxs("div",{children:[e.jsx("small",{children:"Status Pembayaran"}),ce.getStatusBadge(h.status)]}),e.jsxs("div",{className:"payment-proof-status-info",children:[e.jsx("i",{className:"bi bi-clock-history"}),e.jsx("span",{children:"Admin akan memverifikasi pembayaran ini dalam 1–2 hari kerja."})]})]})]}),e.jsx("div",{className:"payment-modal-footer",children:e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:k,children:"Tutup"})})]})})}),f&&h&&e.jsx("div",{className:"payment-modal-overlay",children:e.jsx("div",{className:"payment-modal-dialog payment-modal-large",children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Detail Invoice"}),e.jsxs("p",{children:[h.invoice_number," ","•"," ",ce.getInstallmentText(h)]})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:D,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"payment-modal-body",children:[e.jsxs("div",{className:"payment-detail-grid",children:[e.jsxs("section",{className:"payment-detail-card",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-receipt"}),e.jsx("h4",{children:"Informasi Invoice"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Nomor Invoice"}),e.jsx("dd",{children:h.invoice_number})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Nomor Kwitansi"}),e.jsx("dd",{children:h.receipt_number||"-"})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Program"}),e.jsx("dd",{children:h.program_name})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Durasi"}),e.jsx("dd",{children:h.program_duration||"-"})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Plan Cicilan"}),e.jsx("dd",{children:ce.getInstallmentPlanText(h.program_installment_plan)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Pembayaran Saat Ini"}),e.jsx("dd",{children:ce.getInstallmentText(h)})]}),e.jsxs("div",{className:"highlight",children:[e.jsx("dt",{children:"Jumlah yang Harus Dibayar"}),e.jsx("dd",{children:ce.formatCurrency(he(h))})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Jatuh Tempo"}),e.jsx("dd",{children:h.due_date?te(h.due_date):"Menunggu tagihan admin"})]})]})]}),e.jsxs("section",{className:"payment-detail-card",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-shield-check"}),e.jsx("h4",{children:"Status Pembayaran"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Status"}),e.jsx("dd",{children:ce.getStatusBadge(h.status)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Tanggal Invoice"}),e.jsx("dd",{children:te(h.created_at)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Tanggal Bayar"}),e.jsx("dd",{children:h.payment_date?te(h.payment_date):"-"})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Verifikasi"}),e.jsx("dd",{children:h.verified_by?"Terverifikasi Admin":"Belum diverifikasi"})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Bukti Pembayaran"}),e.jsx("dd",{children:h.proof_image?"Sudah diupload":"Belum diupload"})]})]})]})]}),e.jsxs("section",{className:"payment-detail-progress-card",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-bar-chart"}),e.jsx("h4",{children:"Progress Pembayaran"})]}),e.jsxs("div",{className:"payment-detail-stat-grid",children:[e.jsxs("div",{children:[e.jsx("div",{className:"payment-detail-stat-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsx("small",{children:"Total Biaya Program"}),e.jsx("strong",{children:ce.formatCurrency(h.program_training_cost||0)})]}),e.jsxs("div",{children:[e.jsx("div",{className:"payment-detail-stat-icon success",children:e.jsx("i",{className:"bi bi-check-circle"})}),e.jsx("small",{children:"Sudah Dibayar"}),e.jsx("strong",{children:ce.formatCurrency(h.amount_paid||0)})]}),e.jsxs("div",{children:[e.jsx("div",{className:"payment-detail-stat-icon warning",children:e.jsx("i",{className:"bi bi-hourglass-split"})}),e.jsx("small",{children:"Sisa Tagihan"}),e.jsx("strong",{children:ce.formatCurrency(ye(h))})]})]}),e.jsxs("div",{className:"payment-detail-progress",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Progress keseluruhan"}),e.jsxs("strong",{children:[ge(h).toFixed(0),"%"]})]}),e.jsx("div",{className:"payment-progress-track",children:e.jsx("span",{style:{width:`${ge(h)}%`}})})]})]}),h.payment_method&&e.jsxs("section",{className:"payment-detail-card payment-detail-full",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-credit-card"}),e.jsx("h4",{children:"Metode Pembayaran"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Metode"}),e.jsx("dd",{children:h.payment_method})]}),h.bank_name&&e.jsxs("div",{children:[e.jsx("dt",{children:"Bank"}),e.jsx("dd",{children:h.bank_name})]}),h.account_number&&e.jsxs("div",{children:[e.jsx("dt",{children:"Nomor Rekening"}),e.jsx("dd",{children:h.account_number})]})]})]}),h.notes&&e.jsxs("section",{className:"payment-detail-note",children:[e.jsx("i",{className:"bi bi-chat-left-text"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Catatan"}),e.jsx("p",{children:h.notes})]})]})]}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:D,children:"Tutup"}),ie(h)&&e.jsxs("button",{type:"button",className:"payment-secondary-outline-btn",onClick:()=>{I(h),D()},children:[e.jsx("i",{className:"bi bi-download"}),"Download Kwitansi"]}),U(h)&&e.jsxs("button",{type:"button",className:"payment-primary-btn",onClick:()=>{const B=h;b(!1),p(B),y(!0)},children:[e.jsx("i",{className:"bi bi-upload"}),"Upload Bukti Bayar"]})]})]})})})]})})},we={getStatusBadge:i=>{const d={pending:{tone:"warning",icon:"bi-clock-history",text:"Menunggu Pembayaran"},installment_1:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 1"},installment_2:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 2"},installment_3:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 3"},installment_4:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 4"},installment_5:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 5"},installment_6:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 6"},paid:{tone:"success",icon:"bi-check-circle",text:"Lunas"},overdue:{tone:"danger",icon:"bi-exclamation-circle",text:"Jatuh Tempo"},cancelled:{tone:"secondary",icon:"bi-x-circle",text:"Dibatalkan"}}[i]||{tone:"secondary",icon:"bi-dash-circle",text:i||"Belum Ditentukan"};return e.jsxs("span",{className:`payment-status-badge payment-status-${d.tone}`,children:[e.jsx("i",{className:`bi ${d.icon}`,"aria-hidden":"true"}),d.text]})},getPaymentMethodText:i=>({transfer:"Transfer Bank",cash:"Tunai",credit_card:"Kartu Kredit"})[i]||i||"-",getPaymentMethodIcon:i=>({transfer:"bi-bank",cash:"bi-cash-stack",credit_card:"bi-credit-card"})[i]||"bi-wallet2",getInstallmentPlanText:i=>{if(!i||i==="none")return"Bayar Penuh";const l=parseInt(String(i).split("_")[0],10);return[3,4,5,6].includes(l)?`${l}x cicilan`:String(i)},formatCurrency:(i,l="0")=>{if(i==null||i==="")return l;const d=typeof i=="number"?i:parseFloat(i);return Number.isNaN(d)?l:Math.round(d).toLocaleString("id-ID")},parseFloatSafe:(i,l=0)=>{if(i==null||i==="")return l;const d=parseFloat(i);return Number.isNaN(d)?l:Math.round(d*100)/100},formatDate:i=>{if(!i)return"-";const l=new Date(i);return Number.isNaN(l.getTime())?"-":l.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},getInstallmentText:i=>i?.status?i.status==="paid"?"Lunas":i.status==="pending"?"Menunggu Pembayaran":i.status.startsWith("installment_")?`Cicilan ${i.status.split("_")[1]}`:i.status:"Belum Ditentukan",getTotalInstallments:i=>{if(!i?.program_installment_plan)return 1;const l=String(i.program_installment_plan);if(l==="none")return 1;const d=parseInt(l.split("_")[0],10);return[3,4,5,6].includes(d)?d:1},calculateNextInstallment:i=>{if(!i)return{number:null,amount:0,error:"Data tidak lengkap"};try{const l=we.parseFloatSafe(i.program_training_cost),d=we.parseFloatSafe(i.amount_paid||0);if(d>=l)return{number:null,amount:0,message:"Pembayaran sudah lunas"};let o=1,u=0;i.status==="pending"?(u=0,o=1):i.status?.startsWith("installment_")&&(u=parseInt(i.status.split("_")[1],10)||0,o=u+1);const h=we.getTotalInstallments(i);if(o>h)return{number:null,amount:0,message:`Maksimal ${h} cicilan sudah tercapai`};const p=Math.max(0,l-d),x=h-u,y=x>0?Math.round(p/x/1e3)*1e3:0;return{number:o,amount:y,totalInstallments:h,remainingAmount:p,currentInstallment:u,message:"Admin dapat menentukan nominal tagihan"}}catch(l){return console.error("Error calculating installment:",l),{number:null,amount:0,error:l.message}}},canIssueInvoice:i=>{try{if(!i?.status||!i.status.startsWith("installment_"))return!1;const l=parseInt(i.status.split("_")[1],10)||0,d=we.getTotalInstallments(i);return l<d}catch(l){return console.error("Error in canIssueInvoice:",l),!1}},canIssueManualInvoice:i=>{try{return!i?.status||i.status==="paid"||i.status==="cancelled"?!1:we.calculateNextInstallment(i).number!==null}catch(l){return console.error("Error in canIssueManualInvoice:",l),!1}},getPaymentProgress:i=>{if(!i)return{percentage:0,paid:0,total:0,remaining:0};const l=we.parseFloatSafe(i.program_training_cost),d=we.parseFloatSafe(i.amount_paid||0),o=Math.max(0,l-d),u=l>0?d/l*100:0;return{percentage:Math.min(100,Math.max(0,Math.round(u))),paid:d,total:l,remaining:o}},shouldShowVerifyButton:i=>i?(i.status==="pending"||i.status?.startsWith("installment_"))&&!!i.proof_image:!1,validatePayment:i=>i?!i.id||i.id<=0?{isValid:!1,error:"ID pembayaran tidak valid"}:i.program_training_cost===null||i.program_training_cost===void 0?{isValid:!1,error:"Data program tidak lengkap"}:{isValid:!0,error:null}:{isValid:!1,error:"Data pembayaran tidak ada"},getImageUrl:i=>i?i.startsWith("http")||i.startsWith("/")?i:`/${i}`:null,getInitials:i=>i?i.split(" ").filter(Boolean).slice(0,2).map(l=>l.charAt(0).toUpperCase()).join(""):"P"},Ka={NONE:null,DETAIL:"detail",MANUAL:"manual",VERIFICATION:"verification",INVOICE:"invoice",MANUAL_INVOICE:"manual_invoice",PREVIEW:"preview"},AN=()=>{const[i,l]=j.useState([]),[d,o]=j.useState([]),[u,h]=j.useState([]),[p,x]=j.useState(!0),[y,f]=j.useState(""),[b,v]=j.useState(null),[A,P]=j.useState({status:"all",program:"all",search:""}),[w,M]=j.useState(""),[H,_]=j.useState(Ka.NONE),[E,L]=j.useState(null),[q,oe]=j.useState(null),[re,te]=j.useState({registration_id:"",amount:"",amount_paid:"",payment_method:"transfer",bank_name:"",account_number:"",status:"pending",payment_date:new Date().toISOString().split("T")[0],notes:""}),[ge,ye]=j.useState({installment_number:1,amount:"",due_date:new Date(Date.now()+720*60*60*1e3).toISOString().split("T")[0],notes:""}),[he,Oe]=j.useState(null),[Ce,Se]=j.useState(!1),[Z,fe]=j.useState({status:"paid",rejection_reason:"",amount_paid:0}),[U,ie]=j.useState({due_date:new Date(Date.now()+720*60*60*1e3).toISOString().split("T")[0],amount:0,installment_number:1,notes:""}),{user:I}=Wa(),ue=j.useRef(null),D=j.useRef(null),N=j.useCallback(async()=>{try{x(!0),f(""),ue.current&&ue.current.abort(),ue.current=new AbortController;const O=new URLSearchParams;Object.keys(A).forEach(me=>{A[me]!=="all"&&A[me]!==""&&O.append(me,A[me])});const le=await de.get(`/api/payments?${O.toString()}`,{signal:ue.current.signal,timeout:1e4});if(le.data?.success)l(Array.isArray(le.data.data)?le.data.data:[]);else throw new Error("Format respons tidak valid")}catch(O){if(de.isCancel(O)||O?.code==="ERR_CANCELED")return;console.error("Error fetching payments:",O),f(O.response?.data?.message||O.message||"Gagal memuat data pembayaran")}finally{x(!1)}},[A.status,A.program,A.search]),k=j.useCallback(async()=>{try{const O=await de.get("/api/programs",{timeout:1e4});O.data?.success&&o(Array.isArray(O.data.data)?O.data.data:[])}catch(O){console.error("Error fetching programs:",O)}},[]),Y=j.useCallback(async()=>{try{const O=await de.get("/api/registrations",{timeout:1e4});O.data?.success&&h(Array.isArray(O.data.data)?O.data.data:[])}catch(O){console.error("Error fetching registrations:",O)}},[]),X=j.useCallback(async()=>{try{const O=await de.get("/api/payments/statistics",{timeout:1e4});O.data?.success&&v(O.data.data)}catch(O){console.error("Error fetching payment statistics:",O)}},[]),se=j.useCallback(()=>{_(Ka.NONE),L(null),oe(null),Oe(null),fe({status:"paid",rejection_reason:"",amount_paid:0}),ye({installment_number:1,amount:"",due_date:new Date(Date.now()+720*60*60*1e3).toISOString().split("T")[0],notes:""})},[]),pe=async O=>{const le=we.validatePayment(O);if(!le.isValid){alert(le.error);return}try{x(!0);const me=await de.get(`/api/payments/${O.id}`,{timeout:1e4});me.data?.success&&(L(me.data.data),_(Ka.DETAIL))}catch(me){console.error("Error fetching payment details:",me),alert("Error loading payment details: "+(me.response?.data?.message||me.message))}finally{x(!1)}},Ae=()=>{_(Ka.MANUAL)},B=async O=>{if(!O?.proof_image){alert("Tidak ada bukti pembayaran untuk ditampilkan.");return}oe(await Ud(O.proof_image)),_(Ka.PREVIEW)},S=async O=>{const le=we.validatePayment(O);if(!le.isValid){alert(le.error);return}try{x(!0);const me=await de.get(`/api/payments/${O.id}`,{timeout:1e4});if(me.data?.success){const sa=me.data.data;L(sa);const ya=we.parseFloatSafe(sa.program_training_cost),Tn=we.getTotalInstallments(sa),Qs=Tn>0?Math.round(ya/Tn):ya;let Qn=sa.status;sa.status==="pending"&&(Qn=Tn===1?"paid":"installment_1"),fe({status:Qn,rejection_reason:"",amount_paid:Qs}),_(Ka.VERIFICATION)}}catch(me){console.error("Error preparing verification:",me),alert("Error mempersiapkan verifikasi: "+(me.response?.data?.message||me.message))}finally{x(!1)}},ee=O=>{const le=we.validatePayment(O);if(!le.isValid){alert(le.error);return}if(!we.canIssueManualInvoice(O)){alert("Tidak dapat membuat tagihan manual untuk pembayaran ini.");return}const me=we.calculateNextInstallment(O);ye({installment_number:me.number||1,amount:me.amount||"",due_date:new Date(Date.now()+720*60*60*1e3).toISOString().split("T")[0],notes:`Tagihan cicilan ${me.number||1} untuk program ${O.program_name}`}),L(O),_(Ka.MANUAL_INVOICE)},Je=O=>{const le=we.validatePayment(O);if(!le.isValid){alert(le.error);return}if(!we.canIssueInvoice(O)){alert("Tidak dapat menerbitkan tagihan untuk pembayaran ini.");return}const me=we.calculateNextInstallment(O),sa=new Date;sa.setDate(sa.getDate()+30),ie({due_date:sa.toISOString().split("T")[0],amount:me.amount||0,installment_number:me.number||1,notes:`Tagihan cicilan ${me.number||1} untuk program ${O.program_name}`}),L(O),_(Ka.INVOICE)},He=async(O,le)=>{if(!le)return null;try{Se(!0);const me=new FormData;me.append("proof_image",le);const sa=await de.post(`/api/payments/${O}/upload-proof`,me,{headers:{"Content-Type":"multipart/form-data"},timeout:3e4});if(sa.data?.success)return sa.data.data.proof_image;throw new Error("Upload bukti pembayaran gagal")}finally{Se(!1)}},R=O=>{const le=O.target.files?.[0];if(le){if(le.size>5*1024*1024){alert("Ukuran file terlalu besar. Maksimal 5MB."),O.target.value="";return}if(!le.type.startsWith("image/")){alert("Hanya file gambar yang diizinkan."),O.target.value="";return}Oe(le)}},be=async O=>{if(O.preventDefault(),!re.registration_id){alert("Pilih pendaftaran terlebih dahulu");return}try{Se(!0);const le={registration_id:parseInt(re.registration_id,10),amount_paid:we.parseFloatSafe(re.amount_paid),payment_method:re.payment_method,bank_name:re.bank_name,account_number:re.account_number,status:re.status,payment_date:re.payment_date,notes:re.notes,verified_by:I?.id},me=await de.post("/api/payments/manual",le,{timeout:15e3});if(me.data?.success){const sa=me.data.data?.payment_id;he&&sa&&await He(sa,he),alert("Pembayaran manual berhasil diproses!"),se(),te({registration_id:"",amount:"",amount_paid:"",payment_method:"transfer",bank_name:"",account_number:"",status:"pending",payment_date:new Date().toISOString().split("T")[0],notes:""}),await Promise.all([N(),X()])}}catch(le){console.error("Error processing manual payment:",le),alert("Error processing payment: "+(le.response?.data?.message||le.message))}finally{Se(!1)}},ke=async O=>{if(O.preventDefault(),!E?.id){alert("Data pembayaran tidak valid");return}const le=we.calculateNextInstallment(E);if(Number(ge.installment_number)!==Number(le.number)){alert(`Cicilan berikutnya yang diharapkan adalah cicilan ke-${le.number}.`);return}if(Number(ge.amount)<=0){alert("Jumlah tagihan harus lebih dari 0");return}try{(await de.post(`/api/payments/${E.id}/create-invoice`,{installment_number:Number(ge.installment_number),amount:we.parseFloatSafe(ge.amount),due_date:ge.due_date,notes:ge.notes,verified_by:I?.id},{timeout:15e3})).data?.success&&(alert("Tagihan berhasil dibuat."),se(),await Promise.all([N(),X()]))}catch(me){alert(me.response?.data?.message||me.message)}},Ie=async O=>{if(O.preventDefault(),!E?.id)return;const le=we.parseFloatSafe(Z.amount_paid);if(Z.status!=="cancelled"&&le<=0){alert("Jumlah pembayaran harus lebih dari 0");return}try{(await de.put(`/api/payments/${E.id}/status`,{status:Z.status,amount_paid:le,notes:Z.rejection_reason||`Verifikasi pembayaran - ${Z.status}`,verified_by:I?.id},{timeout:15e3})).data?.success&&(alert("Verifikasi pembayaran berhasil."),se(),await Promise.all([N(),X()]))}catch(me){alert(me.response?.data?.message||me.message)}},oa=async O=>{if(O.preventDefault(),!!E?.id)try{(await de.put(`/api/payments/${E.id}/due-date`,{due_date:U.due_date,notes:U.notes,verified_by:I?.id},{timeout:15e3})).data?.success&&(alert("Tagihan berhasil diterbitkan."),se(),await Promise.all([N(),X()]))}catch(le){alert(le.response?.data?.message||le.message)}},Te=j.useCallback((O,le)=>{P(me=>({...me,[O]:le}))},[]),Ra=j.useCallback(O=>{M(O),D.current&&clearTimeout(D.current),D.current=setTimeout(()=>{Te("search",O.trim())},500)},[Te]),Ke=()=>{M(""),P({status:"all",program:"all",search:""})},Oa=A.status!=="all"||A.program!=="all"||A.search!=="";j.useEffect(()=>(k(),Y(),X(),()=>{ue.current&&ue.current.abort(),D.current&&clearTimeout(D.current)}),[k,Y,X]),j.useEffect(()=>{N()},[N]);const Tt={totalRevenue:i.reduce((O,le)=>O+we.parseFloatSafe(le.amount_paid),0),pendingVerification:i.filter(O=>O.status==="pending").length,totalTransactions:i.length},We={totalRevenue:b?.totalRevenue??b?.total_revenue??Tt.totalRevenue,pendingVerification:b?.pendingVerification??b?.pending_verification??Tt.pendingVerification,totalTransactions:b?.totalTransactions??b?.total_transactions??Tt.totalTransactions},pa=(O,le=!1)=>e.jsxs("div",{className:`payment-action-group ${le?"payment-action-group-mobile":""}`,children:[e.jsxs("button",{type:"button",className:"payment-action-btn",onClick:()=>pe(O),title:"Lihat detail",children:[e.jsx("i",{className:"bi bi-eye"}),le&&e.jsx("span",{children:"Detail"})]}),we.shouldShowVerifyButton(O)&&e.jsxs("button",{type:"button",className:"payment-action-btn payment-action-success",onClick:()=>S(O),title:"Verifikasi pembayaran",children:[e.jsx("i",{className:"bi bi-check2-circle"}),le&&e.jsx("span",{children:"Verifikasi"})]}),we.canIssueManualInvoice(O)&&e.jsxs("button",{type:"button",className:"payment-action-btn",onClick:()=>ee(O),title:"Buat tagihan",children:[e.jsx("i",{className:"bi bi-file-earmark-plus"}),le&&e.jsx("span",{children:"Buat Tagihan"})]}),we.canIssueInvoice(O)&&e.jsxs("button",{type:"button",className:"payment-action-btn",onClick:()=>Je(O),title:"Terbitkan tagihan",children:[e.jsx("i",{className:"bi bi-receipt"}),le&&e.jsx("span",{children:"Terbitkan"})]})]}),Vs=()=>{if(!E)return null;const O=we.getPaymentProgress(E);return e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog payment-modal-large",onClick:le=>le.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Detail Invoice"}),e.jsxs("p",{children:[E.invoice_number," ","·"," ",E.full_name]})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"payment-modal-body",children:[e.jsxs("div",{className:"payment-detail-grid",children:[e.jsxs("div",{className:"payment-detail-card",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-person"}),e.jsx("h4",{children:"Peserta"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Nama"}),e.jsx("dd",{children:E.full_name})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Email"}),e.jsx("dd",{children:E.email})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Program"}),e.jsx("dd",{children:E.program_name})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Pendaftaran"}),e.jsx("dd",{children:E.registration_code})]})]})]}),e.jsxs("div",{className:"payment-detail-card",children:[e.jsxs("div",{className:"payment-detail-card-heading",children:[e.jsx("i",{className:"bi bi-wallet2"}),e.jsx("h4",{children:"Pembayaran"})]}),e.jsxs("dl",{children:[e.jsxs("div",{children:[e.jsx("dt",{children:"Skema"}),e.jsx("dd",{children:we.getInstallmentPlanText(E.program_installment_plan)})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Total"}),e.jsxs("dd",{children:["Rp"," ",we.formatCurrency(O.total)]})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Dibayar"}),e.jsxs("dd",{children:["Rp"," ",we.formatCurrency(O.paid)]})]}),e.jsxs("div",{children:[e.jsx("dt",{children:"Sisa"}),e.jsxs("dd",{children:["Rp"," ",we.formatCurrency(O.remaining)]})]})]})]})]}),e.jsxs("div",{className:"payment-detail-progress-card",children:[e.jsxs("div",{className:"payment-progress-header",children:[e.jsx("span",{children:"Progress"}),e.jsxs("strong",{children:[O.percentage,"%"]})]}),e.jsx("div",{className:"payment-progress-track",children:e.jsx("span",{style:{width:`${O.percentage}%`}})})]}),E.proof_image&&e.jsxs("div",{className:"payment-proof-preview",children:[e.jsx("div",{className:"payment-proof-preview-header",children:e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-image"}),e.jsx("strong",{children:"Bukti Pembayaran"})]})}),e.jsx(Yi,{filePath:E.proof_image,alt:"Bukti Pembayaran",onClick:()=>B(E)})]})]}),e.jsx("div",{className:"payment-modal-footer",children:e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:se,children:"Tutup"})})]})})})},An=()=>e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog",onClick:O=>O.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-plus-circle"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Tambah Pembayaran Manual"}),e.jsx("p",{children:"Catat transaksi pembayaran peserta."})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:be,children:[e.jsxs("div",{className:"payment-modal-body",children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Peserta"}),e.jsxs("select",{className:"form-select",value:re.registration_id,onChange:O=>te(le=>({...le,registration_id:O.target.value})),required:!0,children:[e.jsx("option",{value:"",children:"Pilih peserta"}),u.map(O=>e.jsxs("option",{value:O.id,children:[O.registration_code," ","-"," ",O.full_name," ","-"," ",O.program_name]},O.id))]})]}),e.jsxs("div",{className:"row g-3",children:[e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Jumlah Pembayaran"}),e.jsx("input",{type:"number",className:"form-control",min:"1",value:re.amount_paid,onChange:O=>te(le=>({...le,amount_paid:O.target.value})),required:!0})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Status"}),e.jsxs("select",{className:"form-select",value:re.status,onChange:O=>te(le=>({...le,status:O.target.value})),children:[e.jsx("option",{value:"pending",children:"Pending"}),[1,2,3,4,5,6].map(O=>e.jsxs("option",{value:`installment_${O}`,children:["Cicilan"," ",O]},O)),e.jsx("option",{value:"paid",children:"Lunas"})]})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Metode"}),e.jsxs("select",{className:"form-select",value:re.payment_method,onChange:O=>te(le=>({...le,payment_method:O.target.value})),children:[e.jsx("option",{value:"transfer",children:"Transfer Bank"}),e.jsx("option",{value:"cash",children:"Tunai"}),e.jsx("option",{value:"credit_card",children:"Kartu Kredit"})]})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Tanggal"}),e.jsx("input",{type:"date",className:"form-control",value:re.payment_date,onChange:O=>te(le=>({...le,payment_date:O.target.value}))})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Bank"}),e.jsx("input",{type:"text",className:"form-control",value:re.bank_name,onChange:O=>te(le=>({...le,bank_name:O.target.value}))})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Nomor Rekening"}),e.jsx("input",{type:"text",className:"form-control",value:re.account_number,onChange:O=>te(le=>({...le,account_number:O.target.value}))})]}),e.jsx("div",{className:"col-12",children:e.jsxs("label",{className:"payment-upload-box",children:[e.jsx("input",{type:"file",accept:"image/*",onChange:R}),e.jsx("div",{className:"payment-upload-icon",children:e.jsx("i",{className:"bi bi-cloud-arrow-up"})}),e.jsx("strong",{children:he?he.name:"Upload Bukti Pembayaran"}),e.jsx("span",{children:"JPG atau PNG, maksimal 5 MB"})]})}),e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Catatan"}),e.jsx("textarea",{className:"form-control",rows:"3",value:re.notes,onChange:O=>te(le=>({...le,notes:O.target.value}))})]})]})]}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:se,children:"Batal"}),e.jsx("button",{type:"submit",className:"payment-primary-btn",disabled:Ce,children:Ce?"Memproses...":"Simpan Pembayaran"})]})]})]})})}),Et=()=>e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog",onClick:O=>O.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-check2-circle"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Verifikasi Pembayaran"}),e.jsx("p",{children:"Periksa pembayaran sebelum memperbarui status."})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:Ie,children:[e.jsx("div",{className:"payment-modal-body",children:E&&e.jsxs("div",{className:"row g-3",children:[e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Status"}),e.jsxs("select",{className:"form-select",value:Z.status,onChange:O=>fe(le=>({...le,status:O.target.value})),children:[E.status==="pending"&&we.getTotalInstallments(E)>1&&e.jsx("option",{value:"installment_1",children:"Verifikasi Cicilan 1"}),e.jsx("option",{value:"paid",children:"Lunas"}),e.jsx("option",{value:"cancelled",children:"Tolak Pembayaran"})]})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Jumlah Dibayar"}),e.jsx("input",{type:"number",className:"form-control",value:Z.amount_paid,onChange:O=>fe(le=>({...le,amount_paid:O.target.value}))})]}),Z.status==="cancelled"&&e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Alasan Penolakan"}),e.jsx("textarea",{className:"form-control",rows:"3",value:Z.rejection_reason,onChange:O=>fe(le=>({...le,rejection_reason:O.target.value}))})]})]})}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:se,children:"Batal"}),e.jsx("button",{type:"submit",className:"payment-primary-btn",children:"Verifikasi"})]})]})]})})}),vt=()=>e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog",onClick:O=>O.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-file-earmark-plus"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Buat Tagihan Manual"}),e.jsx("p",{children:"Tentukan nominal cicilan berikutnya."})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:ke,children:[e.jsx("div",{className:"payment-modal-body",children:e.jsxs("div",{className:"row g-3",children:[e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Cicilan Ke"}),e.jsx("input",{type:"number",className:"form-control",value:ge.installment_number,readOnly:!0})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Nominal"}),e.jsx("input",{type:"number",className:"form-control",value:ge.amount,onChange:O=>ye(le=>({...le,amount:O.target.value}))})]}),e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Jatuh Tempo"}),e.jsx("input",{type:"date",className:"form-control",value:ge.due_date,onChange:O=>ye(le=>({...le,due_date:O.target.value}))})]}),e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Catatan"}),e.jsx("textarea",{className:"form-control",rows:"3",value:ge.notes,onChange:O=>ye(le=>({...le,notes:O.target.value}))})]})]})}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:se,children:"Batal"}),e.jsx("button",{type:"submit",className:"payment-primary-btn",children:"Buat Tagihan"})]})]})]})})}),Js=()=>e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog",onClick:O=>O.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("h3",{children:"Terbitkan Tagihan"}),e.jsx("p",{children:"Tentukan tanggal jatuh tempo pembayaran."})]})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:oa,children:[e.jsxs("div",{className:"payment-modal-body",children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Jatuh Tempo"}),e.jsx("input",{type:"date",className:"form-control",value:U.due_date,onChange:O=>ie(le=>({...le,due_date:O.target.value}))})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Catatan"}),e.jsx("textarea",{className:"form-control",rows:"3",value:U.notes,onChange:O=>ie(le=>({...le,notes:O.target.value}))})]})]}),e.jsxs("div",{className:"payment-modal-footer",children:[e.jsx("button",{type:"button",className:"payment-secondary-btn",onClick:se,children:"Batal"}),e.jsx("button",{type:"submit",className:"payment-primary-btn",children:"Terbitkan"})]})]})]})})}),ja=()=>e.jsx("div",{className:"payment-modal-overlay",onClick:se,children:e.jsx("div",{className:"payment-modal-dialog payment-modal-large",onClick:O=>O.stopPropagation(),children:e.jsxs("div",{className:"payment-modal-content",children:[e.jsxs("div",{className:"payment-modal-header",children:[e.jsxs("div",{className:"payment-modal-title-wrap",children:[e.jsx("div",{className:"payment-modal-title-icon",children:e.jsx("i",{className:"bi bi-image"})}),e.jsx("div",{children:e.jsx("h3",{children:"Bukti Pembayaran"})})]}),e.jsx("button",{type:"button",className:"payment-modal-close",onClick:se,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsx("div",{className:"payment-modal-body",children:e.jsx("div",{className:"payment-proof-image-view",children:q&&e.jsx("img",{src:q,alt:"Bukti Pembayaran"})})})]})})}),Xs=()=>{switch(H){case Ka.DETAIL:return Vs();case Ka.MANUAL:return An();case Ka.VERIFICATION:return Et();case Ka.INVOICE:return Js();case Ka.MANUAL_INVOICE:return vt();case Ka.PREVIEW:return ja();default:return null}};return p&&i.length===0?e.jsx("div",{className:"payment-page payment-management-page",children:e.jsx("div",{className:"payment-shell",children:e.jsxs("div",{className:"payment-loading-state",children:[e.jsx("div",{className:"payment-loading-icon",children:e.jsx("span",{className:"spinner-border",role:"status"})}),e.jsx("strong",{children:"Memuat data pembayaran"}),e.jsx("span",{children:"Mohon tunggu, data transaksi sedang disiapkan."})]})})}):e.jsx("div",{className:"payment-page payment-management-page",children:e.jsxs("div",{className:"payment-shell",children:[e.jsxs("div",{className:"payment-page-header",children:[e.jsxs("div",{className:"payment-page-title",children:[e.jsxs("div",{className:"payment-page-eyebrow",children:[e.jsx("span",{className:"payment-eyebrow-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),"MANAJEMEN KEUANGAN"]}),e.jsx("h1",{children:"Manajemen Pembayaran"}),e.jsx("p",{children:"Kelola pembayaran, verifikasi transaksi, dan pantau progress pelunasan peserta."})]}),e.jsxs("button",{type:"button",className:"payment-add-button",onClick:Ae,children:[e.jsx("span",{className:"payment-add-button-icon",children:e.jsx("i",{className:"bi bi-plus-lg"})}),e.jsxs("span",{className:"payment-add-button-text",children:[e.jsx("strong",{children:"Tambah Pembayaran"}),e.jsx("small",{children:"Input transaksi manual"})]})]})]}),e.jsxs("div",{className:"payment-stats-grid",children:[e.jsxs("div",{className:"payment-stat-card payment-stat-revenue",children:[e.jsxs("div",{className:"payment-stat-top",children:[e.jsx("div",{className:"payment-stat-icon",children:e.jsx("i",{className:"bi bi-graph-up-arrow"})}),e.jsx("span",{className:"payment-stat-tag",children:"Pemasukan"})]}),e.jsxs("div",{className:"payment-stat-content",children:[e.jsx("span",{className:"payment-stat-label",children:"Total Pemasukan"}),e.jsxs("strong",{className:"payment-stat-value",children:["Rp"," ",we.formatCurrency(We.totalRevenue)]}),e.jsx("p",{children:"Total pembayaran yang telah tercatat dalam sistem."})]}),e.jsx("div",{className:"payment-stat-decoration"})]}),e.jsxs("div",{className:"payment-stat-card payment-stat-pending",children:[e.jsxs("div",{className:"payment-stat-top",children:[e.jsx("div",{className:"payment-stat-icon",children:e.jsx("i",{className:"bi bi-hourglass-split"})}),e.jsx("span",{className:"payment-stat-tag",children:"Perlu Tindakan"})]}),e.jsxs("div",{className:"payment-stat-content",children:[e.jsx("span",{className:"payment-stat-label",children:"Menunggu Verifikasi"}),e.jsxs("strong",{className:"payment-stat-value",children:[We.pendingVerification," ",e.jsx("small",{children:"Transaksi"})]}),e.jsx("p",{children:"Pembayaran yang masih membutuhkan tindakan admin."})]}),e.jsx("div",{className:"payment-stat-decoration"})]}),e.jsxs("div",{className:"payment-stat-card payment-stat-transactions",children:[e.jsxs("div",{className:"payment-stat-top",children:[e.jsx("div",{className:"payment-stat-icon",children:e.jsx("i",{className:"bi bi-receipt-cutoff"})}),e.jsx("span",{className:"payment-stat-tag",children:"Database"})]}),e.jsxs("div",{className:"payment-stat-content",children:[e.jsx("span",{className:"payment-stat-label",children:"Total Transaksi"}),e.jsxs("strong",{className:"payment-stat-value",children:[We.totalTransactions," ",e.jsx("small",{children:"Transaksi"})]}),e.jsx("p",{children:"Seluruh transaksi pembayaran peserta."})]}),e.jsx("div",{className:"payment-stat-decoration"})]})]}),e.jsxs("section",{className:"payment-content-card payment-filter-card",children:[e.jsxs("div",{className:"payment-card-heading",children:[e.jsxs("div",{className:"payment-card-heading-left",children:[e.jsx("div",{className:"payment-section-icon",children:e.jsx("i",{className:"bi bi-funnel"})}),e.jsxs("div",{children:[e.jsx("span",{children:"FILTER DATA"}),e.jsx("h3",{children:"Filter & Pencarian"}),e.jsx("p",{children:"Temukan transaksi berdasarkan peserta, status, atau program."})]})]}),Oa&&e.jsxs("button",{type:"button",className:"payment-reset-filter",onClick:Ke,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]})]}),e.jsx("div",{className:"payment-filter-body",children:e.jsxs("div",{className:"payment-filter-grid",children:[e.jsxs("div",{className:"payment-filter-field payment-filter-search-field",children:[e.jsx("label",{htmlFor:"payment-search",children:"Pencarian"}),e.jsxs("div",{className:"payment-search-input",children:[e.jsx("i",{className:"bi bi-search payment-search-icon"}),e.jsx("input",{id:"payment-search",type:"text",value:w,onChange:O=>Ra(O.target.value),placeholder:"Cari peserta, email, kode pendaftaran, atau invoice..."}),w&&e.jsx("button",{type:"button",className:"payment-search-clear",onClick:()=>{M(""),Te("search","")},children:e.jsx("i",{className:"bi bi-x-lg"})})]})]}),e.jsxs("div",{className:"payment-filter-field",children:[e.jsx("label",{children:"Status Pembayaran"}),e.jsxs("select",{className:"form-select",value:A.status,onChange:O=>Te("status",O.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status"}),e.jsx("option",{value:"pending",children:"Menunggu Pembayaran"}),[1,2,3,4,5,6].map(O=>e.jsxs("option",{value:`installment_${O}`,children:["Cicilan"," ",O]},O)),e.jsx("option",{value:"paid",children:"Lunas"}),e.jsx("option",{value:"overdue",children:"Jatuh Tempo"})]})]}),e.jsxs("div",{className:"payment-filter-field",children:[e.jsx("label",{children:"Program"}),e.jsxs("select",{className:"form-select",value:A.program,onChange:O=>Te("program",O.target.value),children:[e.jsx("option",{value:"all",children:"Semua Program"}),d.map(O=>e.jsx("option",{value:O.id,children:O.name},O.id))]})]})]})})]}),e.jsxs("section",{className:"payment-content-card payment-invoice-card",children:[e.jsxs("div",{className:"payment-card-heading payment-invoice-heading",children:[e.jsxs("div",{className:"payment-card-heading-left",children:[e.jsx("div",{className:"payment-section-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE TRANSAKSI"}),e.jsx("h3",{children:"Daftar Invoice"}),e.jsxs("p",{children:["Menampilkan"," ",i.length," ","transaksi berdasarkan filter aktif."]})]})]}),e.jsxs("button",{type:"button",className:"payment-refresh-btn",onClick:()=>Promise.all([N(),X()]),disabled:p,children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Refresh"]})]}),y&&e.jsxs("div",{className:"payment-message danger",children:[e.jsx("div",{className:"payment-message-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsxs("div",{className:"payment-message-content",children:[e.jsx("strong",{children:"Data pembayaran gagal dimuat"}),e.jsx("span",{children:y})]})]}),i.length===0?e.jsxs("div",{className:"payment-empty-state",children:[e.jsx("div",{className:"payment-empty-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsx("h3",{children:"Tidak ada data pembayaran"}),e.jsx("p",{children:"Belum ada transaksi yang sesuai dengan filter."})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"payment-table-wrapper d-none d-lg-block",children:e.jsxs("table",{className:"payment-table payment-invoice-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Invoice"}),e.jsx("th",{children:"Peserta"}),e.jsx("th",{children:"Program"}),e.jsx("th",{children:"Progress"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Tanggal"}),e.jsx("th",{children:"Metode"}),e.jsx("th",{children:"Aksi"})]})}),e.jsx("tbody",{children:i.map(O=>{const le=we.getPaymentProgress(O),me=we.calculateNextInstallment(O);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"payment-invoice-cell",children:[e.jsx("div",{className:"payment-table-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("strong",{children:O.invoice_number}),O.receipt_number&&e.jsxs("small",{children:["Kwitansi"," ",O.receipt_number]})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-invoice-cell",children:[e.jsx("div",{className:"payment-table-icon",children:we.getInitials(O.full_name)}),e.jsxs("div",{children:[e.jsx("strong",{children:O.full_name}),e.jsx("small",{children:O.email}),e.jsx("small",{children:O.registration_code})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-program-cell",children:[e.jsx("strong",{children:O.program_name}),e.jsx("span",{children:O.program_duration||"-"}),e.jsx("small",{children:we.getInstallmentPlanText(O.program_installment_plan)}),e.jsxs("small",{children:["Rp"," ",we.formatCurrency(O.program_training_cost)]}),me.number&&e.jsxs("small",{children:["Cicilan berikutnya: Ke-",me.number]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"payment-progress-cell",children:[e.jsxs("div",{className:"payment-progress-header",children:[e.jsxs("span",{children:[le.percentage,"%"]}),e.jsxs("strong",{children:["Rp"," ",we.formatCurrency(le.paid)]})]}),e.jsx("div",{className:"payment-progress-track",children:e.jsx("span",{style:{width:`${le.percentage}%`}})}),e.jsxs("div",{className:"payment-progress-values",children:["Sisa Rp"," ",we.formatCurrency(le.remaining)]})]})}),e.jsx("td",{children:e.jsx("div",{className:"payment-status-cell",children:we.getStatusBadge(O.status)})}),e.jsxs("td",{children:[e.jsx("strong",{children:we.formatDate(O.created_at)}),O.due_date&&e.jsxs("small",{children:["Jatuh tempo"," ",we.formatDate(O.due_date)]})]}),e.jsx("td",{children:e.jsxs("span",{children:[e.jsx("i",{className:`bi ${we.getPaymentMethodIcon(O.payment_method)}`})," ",we.getPaymentMethodText(O.payment_method)]})}),e.jsx("td",{children:pa(O)})]},O.id)})})]})}),e.jsx("div",{className:"payment-mobile-list d-lg-none",children:i.map(O=>{const le=we.getPaymentProgress(O);return e.jsxs("article",{className:"payment-mobile-card",children:[e.jsxs("div",{className:"payment-mobile-card-header",children:[e.jsx("strong",{children:O.invoice_number}),we.getStatusBadge(O.status)]}),e.jsxs("div",{className:"payment-mobile-participant",children:[e.jsx("strong",{children:O.full_name}),e.jsx("span",{children:O.email})]}),e.jsxs("div",{className:"payment-mobile-info-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Program"}),e.jsx("strong",{children:O.program_name})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Skema"}),e.jsx("strong",{children:we.getInstallmentPlanText(O.program_installment_plan)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Total"}),e.jsxs("strong",{children:["Rp"," ",we.formatCurrency(O.program_training_cost)]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Tanggal"}),e.jsx("strong",{children:we.formatDate(O.created_at)})]})]}),e.jsxs("div",{className:"payment-mobile-progress",children:[e.jsxs("div",{className:"payment-progress-header",children:[e.jsx("span",{children:"Progress"}),e.jsxs("strong",{children:[le.percentage,"%"]})]}),e.jsx("div",{className:"payment-progress-track",children:e.jsx("span",{style:{width:`${le.percentage}%`}})}),e.jsxs("small",{children:["Sisa Rp"," ",we.formatCurrency(le.remaining)]})]}),pa(O,!0)]},O.id)})}),e.jsx("div",{className:"payment-table-footer",children:e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"})," ",i.length," ","transaksi ditampilkan"]})})]})]}),Xs()]})})},TN=()=>{const{user:i}=Wa(),[l,d]=j.useState([]),[o,u]=j.useState(!0),[h,p]=j.useState(""),[x,y]=j.useState({selection_status:"all",placement_status:"all",search:""}),[f,b]=j.useState(!1),[v,A]=j.useState(null),[P,w]=j.useState({selection_status:"",selection_notes:"",placement_status:"",company_name:"",placement_date:"",placement_notes:""}),[M,H]=j.useState(!1),[_,E]=j.useState({type:"",text:""}),L=async()=>{try{u(!0),p("");const Z=new URLSearchParams;x.selection_status!=="all"&&Z.append("selection_status",x.selection_status),x.placement_status!=="all"&&Z.append("placement_status",x.placement_status),x.search&&Z.append("search",x.search);const fe=await de.get(`/api/registrations?${Z.toString()}`);fe.data?.success?d(Array.isArray(fe.data.data)?fe.data.data:[]):p("Gagal memuat data registrasi")}catch(Z){console.error("Error fetching registrations:",Z),p(Z.response?.data?.message||"Gagal memuat data peserta")}finally{u(!1)}};j.useEffect(()=>{L()},[x.selection_status,x.placement_status,x.search]);const q=(Z,fe)=>{y(U=>({...U,[Z]:fe}))},oe=()=>{y({selection_status:"all",placement_status:"all",search:""})},re=x.selection_status!=="all"||x.placement_status!=="all"||x.search!=="",te=Z=>{A(Z),w({selection_status:Z.selection_status||"menunggu",selection_notes:Z.selection_notes||"",placement_status:Z.placement_status||"proses",company_name:Z.company_name||"",placement_date:Z.placement_date?new Date(Z.placement_date).toISOString().split("T")[0]:"",placement_notes:Z.placement_notes||""}),b(!0)},ge=()=>{M||(b(!1),A(null),w({selection_status:"",selection_notes:"",placement_status:"",company_name:"",placement_date:"",placement_notes:""}))},ye=async Z=>{if(Z.preventDefault(),!!v){H(!0);try{P.selection_status&&P.selection_status!==v.selection_status&&await de.put(`/api/selection/${v.id}`,{status:P.selection_status,notes:P.selection_notes,evaluated_by:i?.id}),P.placement_status&&P.placement_status!==v.placement_status&&await de.put(`/api/placement/${v.id}`,{status:P.placement_status,company_name:P.company_name,placement_date:P.placement_date||null,notes:P.placement_notes}),E({type:"success",text:"Status seleksi dan penyaluran berhasil diperbarui."}),b(!1),A(null),await L()}catch(fe){console.error("Error updating status:",fe),E({type:"error",text:"Gagal memperbarui status: "+(fe.response?.data?.message||fe.message)})}finally{H(!1)}}},he=Z=>{const U={menunggu:{tone:"warning",icon:"bi-clock",text:"Menunggu"},lolos:{tone:"success",icon:"bi-check-circle",text:"Lolos"},tidak_lolos:{tone:"danger",icon:"bi-x-circle",text:"Tidak Lolos"}}[Z]||{tone:"neutral",icon:"bi-dash-circle",text:Z||"Belum Ditentukan"};return e.jsxs("span",{className:`selection-status-badge selection-status-${U.tone}`,children:[e.jsx("i",{className:`bi ${U.icon}`,"aria-hidden":"true"}),U.text]})},Oe=Z=>{const U={proses:{tone:"info",icon:"bi-arrow-repeat",text:"Proses"},lolos:{tone:"success",icon:"bi-check-circle",text:"Lolos"},ditempatkan:{tone:"primary",icon:"bi-building-check",text:"Ditempatkan"}}[Z]||{tone:"neutral",icon:"bi-dash-circle",text:Z||"Belum Ditentukan"};return e.jsxs("span",{className:`selection-status-badge selection-status-${U.tone}`,children:[e.jsx("i",{className:`bi ${U.icon}`,"aria-hidden":"true"}),U.text]})},Ce=Z=>{if(!Z)return"-";const fe=new Date(Z);return Number.isNaN(fe.getTime())?"-":fe.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},Se=j.useMemo(()=>{const Z=l.length,fe=l.filter(I=>!I.selection_status||I.selection_status==="menunggu").length,U=l.filter(I=>I.selection_status==="lolos").length,ie=l.filter(I=>I.placement_status==="ditempatkan").length;return{total:Z,waitingSelection:fe,passedSelection:U,placed:ie}},[l]);return o&&l.length===0?e.jsx("div",{className:"selection-placement-page",children:e.jsxs("div",{className:"selection-loading-state",children:[e.jsx("div",{className:"selection-loading-icon",children:e.jsx("span",{className:"spinner-border",role:"status"})}),e.jsx("h4",{children:"Memuat data peserta"}),e.jsx("p",{children:"Data seleksi dan penyaluran sedang dipersiapkan."})]})}):e.jsxs("div",{className:"selection-placement-page",children:[e.jsxs("div",{className:"selection-page-header",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"selection-page-eyebrow",children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-clipboard-check"})}),"MANAJEMEN PESERTA"]}),e.jsx("h1",{children:"Manajemen Seleksi & Penyaluran"}),e.jsx("p",{children:"Kelola proses seleksi, kelulusan, penempatan, dan status penyaluran peserta."})]}),e.jsxs("button",{type:"button",className:"selection-header-action",onClick:L,disabled:o,children:[e.jsx("i",{className:`bi ${o?"bi-arrow-repeat":"bi-arrow-clockwise"}`}),e.jsxs("span",{children:[e.jsx("strong",{children:"Refresh Data"}),e.jsx("small",{children:"Perbarui daftar peserta"})]})]})]}),_.text&&e.jsxs("div",{className:`selection-message selection-message-${_.type}`,children:[e.jsx("i",{className:`bi ${_.type==="error"?"bi-exclamation-circle":"bi-check-circle"}`}),e.jsxs("div",{children:[e.jsx("strong",{children:_.type==="error"?"Terjadi Kesalahan":"Berhasil"}),e.jsx("span",{children:_.text})]}),e.jsx("button",{type:"button",onClick:()=>E({type:"",text:""}),children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("div",{className:"selection-stats-grid",children:[e.jsxs("div",{className:"selection-stat-card",children:[e.jsx("div",{className:"selection-stat-icon selection-stat-icon-primary",children:e.jsx("i",{className:"bi bi-people"})}),e.jsxs("div",{children:[e.jsx("span",{children:"Total Peserta"}),e.jsx("strong",{children:Se.total}),e.jsx("small",{children:"Peserta pada data aktif"})]})]}),e.jsxs("div",{className:"selection-stat-card",children:[e.jsx("div",{className:"selection-stat-icon selection-stat-icon-warning",children:e.jsx("i",{className:"bi bi-hourglass-split"})}),e.jsxs("div",{children:[e.jsx("span",{children:"Menunggu Seleksi"}),e.jsx("strong",{children:Se.waitingSelection}),e.jsx("small",{children:"Belum memperoleh keputusan"})]})]}),e.jsxs("div",{className:"selection-stat-card",children:[e.jsx("div",{className:"selection-stat-icon selection-stat-icon-success",children:e.jsx("i",{className:"bi bi-patch-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"Lolos Seleksi"}),e.jsx("strong",{children:Se.passedSelection}),e.jsx("small",{children:"Peserta dinyatakan lolos"})]})]}),e.jsxs("div",{className:"selection-stat-card",children:[e.jsx("div",{className:"selection-stat-icon selection-stat-icon-info",children:e.jsx("i",{className:"bi bi-building-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"Sudah Ditempatkan"}),e.jsx("strong",{children:Se.placed}),e.jsx("small",{children:"Peserta telah ditempatkan"})]})]})]}),e.jsxs("section",{className:"selection-content-card selection-filter-card",children:[e.jsxs("div",{className:"selection-card-heading",children:[e.jsxs("div",{className:"selection-card-heading-main",children:[e.jsx("div",{className:"selection-section-icon",children:e.jsx("i",{className:"bi bi-funnel"})}),e.jsxs("div",{children:[e.jsx("span",{children:"FILTER DATA"}),e.jsx("h2",{children:"Filter & Pencarian"}),e.jsx("p",{children:"Temukan peserta berdasarkan status seleksi, penyaluran, atau nama."})]})]}),re&&e.jsxs("button",{type:"button",className:"selection-reset-button",onClick:oe,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]})]}),e.jsxs("div",{className:"selection-filter-body",children:[e.jsxs("div",{className:"selection-filter-field",children:[e.jsx("label",{children:"Status Seleksi Diklat"}),e.jsxs("select",{value:x.selection_status,onChange:Z=>q("selection_status",Z.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status Seleksi"}),e.jsx("option",{value:"menunggu",children:"Menunggu"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"tidak_lolos",children:"Tidak Lolos"})]})]}),e.jsxs("div",{className:"selection-filter-field",children:[e.jsx("label",{children:"Status Penyaluran"}),e.jsxs("select",{value:x.placement_status,onChange:Z=>q("placement_status",Z.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status Penyaluran"}),e.jsx("option",{value:"proses",children:"Proses"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"ditempatkan",children:"Ditempatkan"})]})]}),e.jsxs("div",{className:"selection-filter-field selection-search-field",children:[e.jsx("label",{children:"Pencarian"}),e.jsxs("div",{className:"selection-search-input",children:[e.jsx("i",{className:"bi bi-search"}),e.jsx("input",{type:"text",placeholder:"Cari nama peserta...",value:x.search,onChange:Z=>q("search",Z.target.value)}),x.search&&e.jsx("button",{type:"button",onClick:()=>q("search",""),children:e.jsx("i",{className:"bi bi-x-lg"})})]})]})]})]}),e.jsxs("section",{className:"selection-content-card selection-database-card",children:[e.jsxs("div",{className:"selection-card-heading",children:[e.jsxs("div",{className:"selection-card-heading-main",children:[e.jsx("div",{className:"selection-section-icon",children:e.jsx("i",{className:"bi bi-person-lines-fill"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE PESERTA"}),e.jsx("h2",{children:"Daftar Peserta"}),e.jsxs("p",{children:["Menampilkan"," ",l.length," peserta berdasarkan filter aktif."]})]})]}),e.jsxs("button",{type:"button",className:"selection-refresh-button",onClick:L,disabled:o,children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Refresh"]})]}),h&&e.jsxs("div",{className:"selection-error-box",children:[e.jsx("i",{className:"bi bi-exclamation-triangle"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Gagal memuat data"}),e.jsx("span",{children:h})]}),e.jsx("button",{type:"button",onClick:()=>p(""),children:e.jsx("i",{className:"bi bi-x-lg"})})]}),l.length===0?e.jsxs("div",{className:"selection-empty-state",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-people"})}),e.jsx("h3",{children:"Tidak ada data peserta"}),e.jsx("p",{children:re?"Tidak ada peserta yang sesuai dengan filter yang digunakan.":"Belum ada peserta yang terdaftar."}),re&&e.jsx("button",{type:"button",className:"selection-secondary-button",onClick:oe,children:"Reset Filter"})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"selection-table-wrapper",children:e.jsxs("table",{className:"selection-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Peserta"}),e.jsx("th",{children:"Program"}),e.jsx("th",{children:"Seleksi Diklat"}),e.jsx("th",{children:"Penyaluran Kerja"}),e.jsx("th",{children:"Perusahaan"}),e.jsx("th",{children:"Penempatan"}),e.jsx("th",{children:"Aksi"})]})}),e.jsx("tbody",{children:l.map(Z=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"selection-participant",children:[e.jsx("div",{className:"selection-participant-avatar",children:Z.full_name?.charAt(0).toUpperCase()||"P"}),e.jsxs("div",{children:[e.jsx("strong",{children:Z.full_name}),e.jsx("span",{children:Z.email}),e.jsx("small",{children:Z.registration_code})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"selection-program-info",children:[e.jsx("strong",{children:Z.program_name}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-clock"}),Z.program_duration||"-"]})]})}),e.jsxs("td",{children:[he(Z.selection_status),Z.selection_notes&&e.jsx("small",{className:"selection-table-note",children:Z.selection_notes})]}),e.jsxs("td",{children:[Oe(Z.placement_status),Z.placement_notes&&e.jsx("small",{className:"selection-table-note",children:Z.placement_notes})]}),e.jsx("td",{children:Z.company_name?e.jsxs("div",{className:"selection-company",children:[e.jsx("i",{className:"bi bi-building"}),e.jsx("strong",{children:Z.company_name})]}):e.jsx("span",{className:"selection-empty-value",children:"Belum ditentukan"})}),e.jsx("td",{children:Z.placement_date?e.jsxs("div",{className:"selection-date",children:[e.jsx("i",{className:"bi bi-calendar3"}),e.jsx("span",{children:Ce(Z.placement_date)})]}):e.jsx("span",{className:"selection-empty-value",children:"-"})}),e.jsx("td",{children:e.jsxs("button",{type:"button",className:"selection-action-button",onClick:()=>te(Z),children:[e.jsx("i",{className:"bi bi-pencil-square"}),e.jsx("span",{children:"Kelola"})]})})]},Z.id))})]})}),e.jsxs("div",{className:"selection-table-footer",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"}),l.length," peserta ditampilkan"]}),re&&e.jsx("span",{children:"Berdasarkan filter aktif"})]})]})]}),f&&v&&e.jsx("div",{className:"selection-modal-overlay",onClick:ge,children:e.jsx("div",{className:"selection-modal-dialog",onClick:Z=>Z.stopPropagation(),children:e.jsxs("div",{className:"selection-modal",children:[e.jsxs("div",{className:"selection-modal-header",children:[e.jsxs("div",{className:"selection-modal-heading",children:[e.jsx("div",{className:"selection-modal-icon",children:e.jsx("i",{className:"bi bi-person-gear"})}),e.jsxs("div",{children:[e.jsx("span",{children:"KELOLA PESERTA"}),e.jsx("h3",{children:"Update Status Peserta"}),e.jsx("p",{children:"Perbarui status seleksi dan penyaluran peserta."})]})]}),e.jsx("button",{type:"button",className:"selection-modal-close",onClick:ge,disabled:M,children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:ye,children:[e.jsxs("div",{className:"selection-modal-body",children:[e.jsxs("div",{className:"selection-modal-summary",children:[e.jsx("div",{className:"selection-modal-summary-avatar",children:v.full_name?.charAt(0).toUpperCase()||"P"}),e.jsxs("div",{children:[e.jsx("span",{children:"PESERTA"}),e.jsx("strong",{children:v.full_name}),e.jsxs("small",{children:[v.registration_code," ","·"," ",v.program_name]})]})]}),e.jsxs("div",{className:"selection-current-status-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"STATUS SELEKSI SAAT INI"}),he(v.selection_status)]}),e.jsxs("div",{children:[e.jsx("span",{children:"STATUS PENYALURAN SAAT INI"}),Oe(v.placement_status)]})]}),e.jsxs("div",{className:"selection-modal-form-grid",children:[e.jsxs("section",{className:"selection-form-section",children:[e.jsxs("div",{className:"selection-form-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-clipboard-check"})}),e.jsxs("span",{children:[e.jsx("small",{children:"SELEKSI DIKLAT"}),e.jsx("strong",{children:"Status Seleksi"})]})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Status Seleksi *"}),e.jsxs("select",{value:P.selection_status,onChange:Z=>w(fe=>({...fe,selection_status:Z.target.value})),required:!0,children:[e.jsx("option",{value:"menunggu",children:"Menunggu"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"tidak_lolos",children:"Tidak Lolos"})]})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Catatan Seleksi"}),e.jsx("textarea",{rows:"5",value:P.selection_notes,onChange:Z=>w(fe=>({...fe,selection_notes:Z.target.value})),placeholder:"Tambahkan catatan seleksi..."})]})]}),e.jsxs("section",{className:"selection-form-section",children:[e.jsxs("div",{className:"selection-form-section-heading",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-building"})}),e.jsxs("span",{children:[e.jsx("small",{children:"PENYALURAN KERJA"}),e.jsx("strong",{children:"Informasi Penempatan"})]})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Status Penyaluran *"}),e.jsxs("select",{value:P.placement_status,onChange:Z=>w(fe=>({...fe,placement_status:Z.target.value})),required:!0,children:[e.jsx("option",{value:"proses",children:"Proses"}),e.jsx("option",{value:"lolos",children:"Lolos"}),e.jsx("option",{value:"ditempatkan",children:"Ditempatkan"})]})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Nama Perusahaan / Instansi"}),e.jsx("input",{type:"text",value:P.company_name,onChange:Z=>w(fe=>({...fe,company_name:Z.target.value})),placeholder:"Masukkan nama perusahaan..."})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Tanggal Penempatan"}),e.jsx("input",{type:"date",value:P.placement_date,onChange:Z=>w(fe=>({...fe,placement_date:Z.target.value}))})]}),e.jsxs("div",{className:"selection-form-field",children:[e.jsx("label",{children:"Catatan Penyaluran"}),e.jsx("textarea",{rows:"4",value:P.placement_notes,onChange:Z=>w(fe=>({...fe,placement_notes:Z.target.value})),placeholder:"Tambahkan catatan penyaluran..."})]})]})]}),P.placement_status==="ditempatkan"&&e.jsxs("div",{className:"selection-notice selection-notice-info",children:[e.jsx("i",{className:"bi bi-info-circle"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Status Ditempatkan"}),e.jsx("span",{children:"Pastikan nama perusahaan dan tanggal penempatan telah diisi."})]})]}),P.selection_status==="tidak_lolos"&&e.jsxs("div",{className:"selection-notice selection-notice-warning",children:[e.jsx("i",{className:"bi bi-exclamation-triangle"}),e.jsxs("div",{children:[e.jsx("strong",{children:"Status Tidak Lolos"}),e.jsx("span",{children:"Disarankan memberikan catatan alasan ketidaklolosan."})]})]})]}),e.jsxs("div",{className:"selection-modal-footer",children:[e.jsx("button",{type:"button",className:"selection-secondary-button",onClick:ge,disabled:M,children:"Batal"}),e.jsx("button",{type:"submit",className:"selection-primary-button",disabled:M,children:M?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyimpan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-check2-circle"}),"Simpan Perubahan"]})})]})]})]})})})]})},EN=()=>{const[i,l]=j.useState(null),[d,o]=j.useState([]),[u,h]=j.useState([]),[p,x]=j.useState(!0),[y,f]=j.useState(""),[b,v]=j.useState(""),A={program:"all",start_date:"",end_date:"",status:"all",search:""},[P,w]=j.useState(A),[M,H]=j.useState(A),_=j.useCallback((k,Y=!0)=>{const X=new URLSearchParams;return Object.keys(k).forEach(se=>{!Y&&se==="search"||k[se]!=="all"&&k[se]!==""&&X.append(se,k[se])}),X},[]),E=j.useCallback(async()=>{try{const k=await de.get("/api/programs",{timeout:1e4});k.data?.success&&h(Array.isArray(k.data.data)?k.data.data:[])}catch(k){console.error("Error fetching programs:",k)}},[]),L=j.useCallback(async k=>{const Y=_(k,!1),X=await de.get(`/api/reports/financial/summary?${Y.toString()}`,{timeout:15e3});if(!X.data?.success)throw new Error("Gagal memuat ringkasan keuangan");l(X.data.data)},[_]),q=j.useCallback(async k=>{const Y=_(k),X=await de.get(`/api/reports/financial/detailed?${Y.toString()}`,{timeout:15e3});if(!X.data?.success)throw new Error("Gagal memuat detail transaksi");o(Array.isArray(X.data.data)?X.data.data:[])},[_]),oe=j.useCallback(async(k=M)=>{try{x(!0),v(""),await Promise.all([L(k),q(k)])}catch(Y){console.error("Error fetching financial data:",Y),v(Y.response?.data?.message||Y.message||"Gagal memuat data keuangan")}finally{x(!1)}},[M,L,q]);j.useEffect(()=>{E()},[E]),j.useEffect(()=>{oe(M)},[M]);const re=(k,Y)=>{w(X=>({...X,[k]:Y}))},te=()=>{if(P.start_date&&P.end_date&&new Date(P.start_date)>new Date(P.end_date)){v("Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");return}v(""),H({...P})},ge=()=>{const k={program:"all",start_date:"",end_date:"",status:"all",search:""};w(k),H(k),v("")},ye=M.program!=="all"||M.start_date!==""||M.end_date!==""||M.status!=="all"||M.search!=="",he=(k,Y)=>{const X=window.URL.createObjectURL(k),se=document.createElement("a");se.href=X,se.setAttribute("download",Y),document.body.appendChild(se),se.click(),se.remove(),window.URL.revokeObjectURL(X)},Oe=async()=>{try{f("excel"),v("");const k=_(M),Y=await de.get(`/api/reports/financial/export/excel?${k.toString()}`,{responseType:"blob",timeout:3e4});Y.status===200&&he(new Blob([Y.data]),`laporan-keuangan-${new Date().toISOString().split("T")[0]}.xlsx`)}catch(k){console.error("Error exporting to Excel:",k),v(k.response?.status===404?"Fitur export Excel belum tersedia.":"Gagal mengekspor laporan ke Excel. Silakan coba lagi.")}finally{f("")}},Ce=async()=>{try{f("pdf"),v("");const k=_(M),Y=await de.get(`/api/reports/financial/export/pdf?${k.toString()}`,{responseType:"blob",timeout:3e4});Y.status===200&&he(new Blob([Y.data]),`laporan-keuangan-${new Date().toISOString().split("T")[0]}.pdf`)}catch(k){console.error("Error exporting to PDF:",k),v(k.response?.status===404?"Fitur export PDF belum tersedia.":"Gagal mengekspor laporan ke PDF. Silakan coba lagi.")}finally{f("")}},Se=k=>{if(k==null||k==="")return"Rp 0";const Y=parseFloat(k);return Number.isNaN(Y)?"Rp 0":`Rp ${Math.round(Y).toLocaleString("id-ID")}`},Z=k=>{if(!k)return"-";try{const Y=new Date(k);return Number.isNaN(Y.getTime())?"-":Y.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}catch{return"-"}},fe=k=>{const X={pending:{tone:"warning",icon:"bi-clock-history",text:"Menunggu"},installment_1:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 1"},installment_2:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 2"},installment_3:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 3"},installment_4:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 4"},installment_5:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 5"},installment_6:{tone:"primary",icon:"bi-wallet2",text:"Cicilan 6"},paid:{tone:"success",icon:"bi-check-circle",text:"Lunas"},overdue:{tone:"danger",icon:"bi-exclamation-circle",text:"Jatuh Tempo"},cancelled:{tone:"secondary",icon:"bi-x-circle",text:"Dibatalkan"}}[k]||{tone:"secondary",icon:"bi-dash-circle",text:k||"Tidak Diketahui"};return e.jsxs("span",{className:`financial-status-badge financial-status-${X.tone}`,children:[e.jsx("i",{className:`bi ${X.icon}`}),X.text]})},U=k=>({transfer:"Transfer Bank",cash:"Tunai",credit_card:"Kartu Kredit"})[k]||k||"-",ie=k=>({transfer:"bi-bank",cash:"bi-cash-stack",credit_card:"bi-credit-card"})[k]||"bi-wallet2",I=k=>{if(!k?.status)return"-";if(k.status==="paid")return"Pembayaran Lunas";if(k.status==="pending")return"Menunggu Pembayaran";if(k.status.startsWith("installment_")){const Y=k.status.split("_")[1],X=parseFloat(k.amount)||0,se=parseFloat(k.amount_paid)||0,pe=X>0?Math.round(se/X*100):0;return`Cicilan ${Y} · ${pe}% dibayar`}return k.status},ue=()=>{if(!i?.summary)return 0;const k=parseFloat(i.summary.total_amount||0),Y=parseFloat(i.summary.total_amount_paid||0);return Math.max(0,k-Y)},D=k=>k?k.split(" ").filter(Boolean).slice(0,2).map(Y=>Y.charAt(0).toUpperCase()).join(""):"P",N=i?.summary||{};return p&&!i?e.jsx("div",{className:"financial-reports-page",children:e.jsxs("div",{className:"financial-loading-state",children:[e.jsx("div",{className:"financial-loading-icon",children:e.jsx("span",{className:"spinner-border",role:"status"})}),e.jsx("h4",{children:"Memuat laporan keuangan"}),e.jsx("p",{children:"Data transaksi dan ringkasan keuangan sedang disiapkan."})]})}):e.jsxs("div",{className:"financial-reports-page",children:[e.jsxs("header",{className:"financial-page-header",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"financial-page-eyebrow",children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-graph-up-arrow"})}),"MANAJEMEN KEUANGAN"]}),e.jsx("h1",{children:"Laporan Keuangan"}),e.jsx("p",{children:"Monitoring, analisis, dan rekapitulasi transaksi keuangan seluruh program FITALENTA."})]}),e.jsxs("div",{className:"financial-header-status",children:[e.jsx("span",{className:"financial-header-status-icon",children:e.jsx("i",{className:"bi bi-shield-check"})}),e.jsxs("div",{children:[e.jsx("small",{children:"STATUS DATA"}),e.jsx("strong",{children:"Data Keuangan Terintegrasi"})]})]})]}),b&&e.jsxs("div",{className:"financial-alert",children:[e.jsx("div",{className:"financial-alert-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Terjadi kendala"}),e.jsx("span",{children:b})]}),e.jsx("button",{type:"button",onClick:()=>v(""),"aria-label":"Tutup pemberitahuan",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("section",{className:"financial-summary-grid",children:[e.jsxs("article",{className:"financial-summary-card financial-summary-revenue",children:[e.jsxs("div",{className:"financial-summary-card-top",children:[e.jsx("div",{className:"financial-summary-icon",children:e.jsx("i",{className:"bi bi-cash-stack"})}),e.jsx("span",{children:"PEMASUKAN"})]}),e.jsxs("div",{className:"financial-summary-content",children:[e.jsx("small",{children:"Total Pemasukan"}),e.jsx("strong",{children:Se(N.total_revenue)}),e.jsxs("p",{children:[N.total_transactions||0," ","transaksi tercatat"]})]}),e.jsx("div",{className:"financial-summary-decoration"})]}),e.jsxs("article",{className:"financial-summary-card financial-summary-pending",children:[e.jsxs("div",{className:"financial-summary-card-top",children:[e.jsx("div",{className:"financial-summary-icon",children:e.jsx("i",{className:"bi bi-hourglass-split"})}),e.jsx("span",{children:"PERLU TINDAKAN"})]}),e.jsxs("div",{className:"financial-summary-content",children:[e.jsx("small",{children:"Menunggu Verifikasi"}),e.jsx("strong",{children:Se(N.total_pending)}),e.jsx("p",{children:"Pembayaran yang belum dikonfirmasi"})]}),e.jsx("div",{className:"financial-summary-decoration"})]}),e.jsxs("article",{className:"financial-summary-card financial-summary-overdue",children:[e.jsxs("div",{className:"financial-summary-card-top",children:[e.jsx("div",{className:"financial-summary-icon",children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsx("span",{children:"MONITORING"})]}),e.jsxs("div",{className:"financial-summary-content",children:[e.jsx("small",{children:"Estimasi Tunggakan"}),e.jsx("strong",{children:Se(N.total_outstanding)}),e.jsxs("p",{children:[Se(N.total_overdue)," ","telah jatuh tempo"]})]}),e.jsx("div",{className:"financial-summary-decoration"})]}),e.jsxs("article",{className:"financial-summary-card financial-summary-remaining",children:[e.jsxs("div",{className:"financial-summary-card-top",children:[e.jsx("div",{className:"financial-summary-icon",children:e.jsx("i",{className:"bi bi-receipt-cutoff"})}),e.jsx("span",{children:"TAGIHAN"})]}),e.jsxs("div",{className:"financial-summary-content",children:[e.jsx("small",{children:"Sisa Tagihan"}),e.jsx("strong",{children:Se(ue())}),e.jsx("p",{children:"Total nominal yang belum dibayarkan"})]}),e.jsx("div",{className:"financial-summary-decoration"})]})]}),e.jsxs("section",{className:"financial-content-card financial-filter-card",children:[e.jsxs("div",{className:"financial-card-heading",children:[e.jsxs("div",{className:"financial-card-heading-left",children:[e.jsx("div",{className:"financial-section-icon",children:e.jsx("i",{className:"bi bi-funnel"})}),e.jsxs("div",{children:[e.jsx("span",{children:"FILTER DATA"}),e.jsx("h2",{children:"Filter & Pencarian"}),e.jsx("p",{children:"Sesuaikan laporan berdasarkan program, status, periode, atau peserta."})]})]}),ye&&e.jsxs("span",{className:"financial-active-filter-badge",children:[e.jsx("i",{className:"bi bi-check2-circle"}),"Filter Aktif"]})]}),e.jsxs("div",{className:"financial-filter-body",children:[e.jsxs("div",{className:"financial-filter-grid",children:[e.jsxs("div",{className:"financial-filter-field financial-filter-program",children:[e.jsx("label",{children:"Program"}),e.jsxs("select",{value:P.program,onChange:k=>re("program",k.target.value),children:[e.jsx("option",{value:"all",children:"Semua Program"}),u.map(k=>e.jsx("option",{value:k.id,children:k.name},k.id))]})]}),e.jsxs("div",{className:"financial-filter-field",children:[e.jsx("label",{children:"Status Pembayaran"}),e.jsxs("select",{value:P.status,onChange:k=>re("status",k.target.value),children:[e.jsx("option",{value:"all",children:"Semua Status"}),e.jsx("option",{value:"pending",children:"Menunggu Pembayaran"}),e.jsx("option",{value:"installment_1",children:"Cicilan 1"}),e.jsx("option",{value:"installment_2",children:"Cicilan 2"}),e.jsx("option",{value:"installment_3",children:"Cicilan 3"}),e.jsx("option",{value:"installment_4",children:"Cicilan 4"}),e.jsx("option",{value:"installment_5",children:"Cicilan 5"}),e.jsx("option",{value:"installment_6",children:"Cicilan 6"}),e.jsx("option",{value:"paid",children:"Lunas"}),e.jsx("option",{value:"overdue",children:"Jatuh Tempo"})]})]}),e.jsxs("div",{className:"financial-filter-field",children:[e.jsx("label",{children:"Tanggal Mulai"}),e.jsx("input",{type:"date",value:P.start_date,onChange:k=>re("start_date",k.target.value)})]}),e.jsxs("div",{className:"financial-filter-field",children:[e.jsx("label",{children:"Tanggal Akhir"}),e.jsx("input",{type:"date",value:P.end_date,onChange:k=>re("end_date",k.target.value)})]})]}),e.jsx("div",{className:"financial-search-row",children:e.jsxs("div",{className:"financial-search-field",children:[e.jsx("label",{children:"Pencarian"}),e.jsxs("div",{className:"financial-search-input",children:[e.jsx("i",{className:"bi bi-search"}),e.jsx("input",{type:"text",value:P.search,placeholder:"Cari nama peserta, email, atau nomor invoice...",onChange:k=>re("search",k.target.value),onKeyDown:k=>{k.key==="Enter"&&te()}}),P.search&&e.jsx("button",{type:"button",onClick:()=>re("search",""),"aria-label":"Hapus pencarian",children:e.jsx("i",{className:"bi bi-x-lg"})})]})]})}),e.jsxs("div",{className:"financial-filter-actions",children:[e.jsxs("button",{type:"button",className:"financial-reset-button",onClick:ge,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]}),e.jsx("button",{type:"button",className:"financial-primary-button",onClick:te,disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Memuat..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-search"}),"Terapkan Filter"]})})]})]})]}),e.jsxs("section",{className:"financial-export-card",children:[e.jsxs("div",{className:"financial-export-info",children:[e.jsx("div",{className:"financial-export-icon",children:e.jsx("i",{className:"bi bi-download"})}),e.jsxs("div",{children:[e.jsx("span",{children:"UNDUH DOKUMEN"}),e.jsx("h3",{children:"Ekspor Laporan"}),e.jsx("p",{children:"Download laporan sesuai filter aktif dalam format Excel atau PDF."})]})]}),e.jsxs("div",{className:"financial-export-actions",children:[e.jsx("button",{type:"button",className:"financial-export-button financial-export-excel",onClick:Oe,disabled:!!y||d.length===0,children:y==="excel"?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyiapkan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-file-earmark-excel"}),"Excel"]})}),e.jsx("button",{type:"button",className:"financial-export-button financial-export-pdf",onClick:Ce,disabled:!!y||d.length===0,children:y==="pdf"?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyiapkan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-file-earmark-pdf"}),"PDF"]})})]})]}),e.jsxs("section",{className:"financial-content-card financial-transaction-card",children:[e.jsxs("div",{className:"financial-card-heading financial-transaction-heading",children:[e.jsxs("div",{className:"financial-card-heading-left",children:[e.jsx("div",{className:"financial-section-icon",children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE KEUANGAN"}),e.jsx("h2",{children:"Detail Transaksi"}),e.jsxs("p",{children:["Menampilkan"," ",d.length," ","transaksi berdasarkan filter yang diterapkan."]})]})]}),e.jsx("button",{type:"button",className:"financial-refresh-button",onClick:()=>oe(M),disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Memuat"]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Refresh"]})})]}),p?e.jsxs("div",{className:"financial-table-loading",children:[e.jsx("span",{className:"spinner-border"}),e.jsx("strong",{children:"Memuat transaksi"}),e.jsx("p",{children:"Mohon tunggu sebentar."})]}):d.length===0?e.jsxs("div",{className:"financial-empty-state",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-receipt"})}),e.jsx("h4",{children:"Tidak ada data transaksi"}),e.jsx("p",{children:"Coba ubah filter atau periode untuk menampilkan data transaksi lainnya."}),ye&&e.jsxs("button",{type:"button",className:"financial-reset-button",onClick:ge,children:[e.jsx("i",{className:"bi bi-arrow-counterclockwise"}),"Reset Filter"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"financial-report-summary",children:[e.jsxs("div",{className:"financial-report-summary-heading",children:[e.jsx("div",{className:"financial-report-summary-icon",children:e.jsx("i",{className:"bi bi-bar-chart-line"})}),e.jsxs("div",{children:[e.jsx("span",{children:"RINGKASAN LAPORAN"}),e.jsxs("strong",{children:[d.length," ","Transaksi"]})]})]}),e.jsxs("div",{className:"financial-report-summary-values",children:[e.jsxs("div",{className:"financial-report-summary-item",children:[e.jsx("span",{children:"Total Tagihan"}),e.jsx("strong",{children:Se(N.total_amount)})]}),e.jsxs("div",{className:"financial-report-summary-item financial-report-summary-paid",children:[e.jsx("span",{children:"Sudah Dibayar"}),e.jsx("strong",{children:Se(N.total_amount_paid)})]}),e.jsxs("div",{className:"financial-report-summary-item financial-report-summary-remaining",children:[e.jsx("span",{children:"Sisa Tagihan"}),e.jsx("strong",{children:Se(ue())})]})]})]}),e.jsx("div",{className:"financial-transaction-list",children:d.map((k,Y)=>{const X=parseFloat(k.amount||0),se=parseFloat(k.amount_paid||0),pe=Math.max(0,X-se),Ae=X>0?Math.min(100,Math.round(se/X*100)):0;return e.jsxs("article",{className:"financial-transaction-item",children:[e.jsxs("div",{className:"financial-transaction-item-header",children:[e.jsx("div",{className:"financial-transaction-number",children:e.jsx("span",{children:Y+1})}),e.jsxs("div",{className:"financial-transaction-invoice",children:[e.jsx("span",{children:"INVOICE"}),e.jsx("strong",{children:k.invoice_number}),k.receipt_number&&e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-check-circle"}),"Kwitansi"," ",k.receipt_number]})]}),e.jsxs("div",{className:"financial-transaction-header-meta",children:[fe(k.status),e.jsxs("div",{className:"financial-transaction-date",children:[e.jsx("span",{children:"Tanggal Transaksi"}),e.jsx("strong",{children:Z(k.payment_date||k.created_at)})]})]})]}),e.jsxs("div",{className:"financial-transaction-body",children:[e.jsxs("div",{className:"financial-transaction-participant-section",children:[e.jsxs("div",{className:"financial-transaction-section-label",children:[e.jsx("i",{className:"bi bi-person"}),"INFORMASI PESERTA"]}),e.jsxs("div",{className:"financial-transaction-participant",children:[e.jsx("div",{className:"financial-transaction-avatar",children:D(k.full_name)}),e.jsxs("div",{className:"financial-transaction-participant-info",children:[e.jsx("strong",{children:k.full_name}),e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-envelope"}),k.email]})]})]}),e.jsxs("div",{className:"financial-transaction-detail-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Program"}),e.jsx("strong",{children:k.program_name})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Jenis Pembayaran"}),e.jsx("strong",{children:I(k)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Metode Pembayaran"}),e.jsxs("strong",{children:[e.jsx("i",{className:`bi ${ie(k.payment_method)}`}),U(k.payment_method)]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Jatuh Tempo"}),e.jsx("strong",{children:k.due_date?Z(k.due_date):"-"})]})]})]}),e.jsxs("div",{className:"financial-transaction-payment-section",children:[e.jsxs("div",{className:"financial-transaction-section-label",children:[e.jsx("i",{className:"bi bi-wallet2"}),"RINGKASAN PEMBAYARAN"]}),e.jsxs("div",{className:"financial-transaction-amount-grid",children:[e.jsxs("div",{className:"financial-transaction-amount-card",children:[e.jsx("span",{children:"Total Tagihan"}),e.jsx("strong",{children:Se(X)}),e.jsx("small",{children:"Nilai keseluruhan tagihan"})]}),e.jsxs("div",{className:"financial-transaction-amount-card is-paid",children:[e.jsx("span",{children:"Sudah Dibayar"}),e.jsx("strong",{children:Se(se)}),e.jsx("small",{children:"Pembayaran diterima"})]}),e.jsxs("div",{className:"financial-transaction-amount-card is-remaining",children:[e.jsx("span",{children:"Sisa Tagihan"}),e.jsx("strong",{children:Se(pe)}),e.jsx("small",{children:"Belum dibayarkan"})]})]}),e.jsxs("div",{className:"financial-transaction-progress",children:[e.jsxs("div",{className:"financial-transaction-progress-header",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Progress Pembayaran"}),e.jsxs("strong",{children:[Ae,"%"]})]}),e.jsxs("span",{children:[Se(se)," ","dari"," ",Se(X)]})]}),e.jsx("div",{className:"financial-transaction-progress-track",children:e.jsx("div",{className:"financial-transaction-progress-bar",style:{width:`${Ae}%`}})})]})]})]})]},k.id)})}),e.jsxs("div",{className:"financial-table-footer",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"}),e.jsxs("span",{children:[d.length," ","transaksi ditampilkan"]})]}),ye&&e.jsxs("span",{children:[e.jsx("i",{className:"bi bi-funnel"}),"Berdasarkan filter aktif"]})]})]})]})]})},CN=["Pelatihan","Penyaluran","Pelatihan dan Penyaluran"],vg=[{value:"Reguler",label:"Reguler"},{value:"Asrama",label:"Asrama"},{value:"Hybrid",label:"Hybrid"},{value:"Fast Track",label:"Fast Track"},{value:"Beasiswa",label:"Beasiswa"},{value:"Studi",label:"Studi"},{value:"Non-Asrama",label:"Non-Asrama"},{value:"Teknis",label:"Teknis"},{value:"Executive Training",label:"Executive Training"}],_f=[{value:"none",label:"Tidak Ada / Bayar Penuh"},{value:"3_installments",label:"3 Cicilan"},{value:"4_installments",label:"4 Cicilan"},{value:"5_installments",label:"5 Cicilan"},{value:"6_installments",label:"6 Cicilan"}],At=(i="")=>String(i).trim().toLowerCase().replace(/[-_\s]+/g,""),Qi=(i="")=>{const l=At(i);return{pelatihan:0,layananpelatihan:0,penyaluran:1,pelayananpenyaluran:1,layananpenyaluran:1,pelatihandanpenyaluran:2,penyalurandanpelatihan:2}[l]??999},yg=(i="")=>CN.some(l=>At(l)===At(i)),Sf=(i="")=>{const l=At(i);return{reguler:0,regular:0,asrama:1,hybrid:2,fasttrack:3,beasiswa:4,studi:5,study:5,nonasrama:6,teknis:7,technical:7,executivetraining:8,executive:8}[l]??999},MN=(i="")=>vg.some(l=>At(l.value)===At(i)),od=i=>{const l=At(i?.program_format||""),d=At(i?.name||"");return l==="hybrid"||d.includes("hybrid")},wf=(i=[])=>[...i].sort((l,d)=>{const o=Qi(l?.category_name),u=Qi(d?.category_name);if(o!==u)return o-u;const h=Sf(l?.program_format),p=Sf(d?.program_format);return h!==p?h-p:String(l?.name||"").localeCompare(String(d?.name||""),"id")}),Af=(i=[])=>[...i].filter(l=>yg(l?.name)).sort((l,d)=>{const o=Qi(l?.name),u=Qi(d?.name);return o!==u?o-u:String(l?.name||"").localeCompare(String(d?.name||""),"id")}),dd=i=>{const l=Qi(i);return l===999?999:l+1},Bs=i=>{if(i==null||i==="")return"";if(typeof i=="number")return Number.isFinite(i)?String(Math.round(i)):"";const l=String(i).trim();if(!l)return"";if(/^-?\d+(.\d+)?$/.test(l)){const o=Number(l);return Number.isFinite(o)?String(Math.round(o)):""}return l.replace(/[^\d]/g,"")},jr=i=>{const l=Bs(i);if(!l)return"";const d=Number(l);return Number.isFinite(d)?Math.round(d).toLocaleString("id-ID"):""},vr=i=>{const l=Bs(i);if(!l)return 0;const d=Number(l);return Number.isFinite(d)?d:0},RN=()=>{const[i,l]=j.useState([]),[d,o]=j.useState([]),[u,h]=j.useState(!0),[p,x]=j.useState(""),[y,f]=j.useState(!1),[b,v]=j.useState(null),[A,P]=j.useState(!1),[w,M]=j.useState({type:"",text:""}),H={category_id:"",program_format:"",name:"",description:"",requirements:"",schedule:"",duration:"",capacity:"",contact_info:"",status:"active",location:"Bandung, Indonesia & Jepang",training_cost:"",departure_cost:"",installment_plan:"none",down_payment:"",job_matching_cost:"",bridge_fund:"Tersedia",timeline_text:"",training_fee_details:"",departure_fee_details:"",requirements_text:"",sort_order:999},[_,E]=j.useState(H),L=j.useMemo(()=>wf(i),[i]),q=j.useMemo(()=>Af(d),[d]),oe=od({name:_.name,program_format:_.program_format}),re=async()=>{try{h(!0),x("");const D=await de.get("/api/programs",{timeout:1e4});if(D.data?.success){const N=Array.isArray(D.data.data)?D.data.data:[];l(wf(N))}else l([]),x("Gagal memuat data program.")}catch(D){console.error("Error fetching programs:",D),l([]),x(D.response?.data?.message||D.message||"Gagal memuat data program.")}finally{h(!1)}},te=async()=>{try{const D=await de.get("/api/program-categories",{timeout:1e4});if(D.data?.success){const N=Array.isArray(D.data.data)?D.data.data:[];o(Af(N))}}catch(D){console.error("Error fetching categories:",D)}};j.useEffect(()=>{re(),te()},[]);const ge=(D=null)=>{M({type:"",text:""}),D?(v(D),E({category_id:D.category_id??"",program_format:D.program_format||"",name:D.name||"",description:D.description||"",requirements:D.requirements||"",schedule:D.schedule||"",duration:D.duration||"",capacity:D.capacity??"",contact_info:D.contact_info||"",status:D.status||"active",location:D.location||"Bandung, Indonesia & Jepang",training_cost:Bs(D.training_cost),departure_cost:Bs(D.departure_cost),installment_plan:D.installment_plan||"none",down_payment:Bs(D.down_payment),job_matching_cost:Bs(D.job_matching_cost),bridge_fund:D.bridge_fund||"Tersedia",timeline_text:D.timeline_text||"",training_fee_details:D.training_fee_details||"",departure_fee_details:D.departure_fee_details||"",requirements_text:D.requirements_text||"",sort_order:dd(D.category_name||"")})):(v(null),E({...H})),f(!0)},ye=()=>{A||(f(!1),v(null),E({...H}))};j.useEffect(()=>{if(!y)return;const D=document.body.style.overflow,N=document.body.style.paddingRight,k=window.innerWidth-document.documentElement.clientWidth;return document.body.style.overflow="hidden",k>0&&(document.body.style.paddingRight=`${k}px`),()=>{document.body.style.overflow=D,document.body.style.paddingRight=N}},[y]),j.useEffect(()=>{if(!y)return;const D=N=>{N.key==="Escape"&&!A&&ye()};return window.addEventListener("keydown",D),()=>{window.removeEventListener("keydown",D)}},[y,A]);const he=D=>{const{name:N,value:k}=D.target;E(Y=>{const X={...Y,[N]:k};if(N==="category_id"){const se=d.find(pe=>String(pe.id)===String(k));X.sort_order=dd(se?.name||"")}return N==="program_format"&&(At(k)==="hybrid"||(X.job_matching_cost="")),X})},Oe=(D,N)=>{const k=String(N).replace(/[^\d]/g,"");E(Y=>({...Y,[D]:k}))},Ce=async D=>{D.preventDefault();const N=String(_.name||"").trim();if(!N){M({type:"error",text:"Nama program wajib diisi."});return}const k=d.find(ee=>String(ee.id)===String(_.category_id));if(!k){M({type:"error",text:"Kategori program wajib dipilih."});return}if(!yg(k.name)){M({type:"error",text:"Kategori program tidak valid."});return}const Y=String(_.program_format||"").trim();if(!Y){M({type:"error",text:"Tipe / format program wajib dipilih."});return}if(!MN(Y)){M({type:"error",text:"Tipe / format program tidak valid."});return}const X=od({name:N,program_format:Y}),se=vr(_.training_cost),pe=vr(_.departure_cost),Ae=vr(_.down_payment),B=X?vr(_.job_matching_cost):0;if(se<0){M({type:"error",text:"Biaya pelatihan tidak boleh kurang dari Rp 0."});return}if(pe<0){M({type:"error",text:"Biaya keberangkatan tidak boleh kurang dari Rp 0."});return}if(Ae<0){M({type:"error",text:"Nominal DP tidak boleh kurang dari Rp 0."});return}if(B<0){M({type:"error",text:"Biaya Job Matching tidak boleh kurang dari Rp 0."});return}if(Ae>se+pe+B&&Ae>0){M({type:"error",text:"Nominal DP tidak boleh melebihi total biaya program."});return}const S={..._,name:N,category_id:k.id,program_format:Y,training_cost:se,departure_cost:pe,down_payment:Ae,job_matching_cost:B,capacity:Number(_.capacity||0),sort_order:dd(k.name)};try{P(!0),x("");let ee;if(b?ee=await de.put(`/api/programs/${b.id}`,S,{timeout:15e3}):ee=await de.post("/api/programs",S,{timeout:15e3}),ee.data?.success===!1)throw new Error(ee.data?.message||"Program gagal disimpan.");f(!1),v(null),E({...H}),await re(),M({type:"success",text:b?"Program berhasil diperbarui.":"Program berhasil ditambahkan."})}catch(ee){console.error("Error saving program:",ee),M({type:"error",text:"Gagal menyimpan program: "+(ee.response?.data?.message||ee.message)})}finally{P(!1)}},Se=async D=>{if(window.confirm("Apakah Anda yakin ingin menghapus program ini?"))try{await de.delete(`/api/programs/${D}`,{timeout:15e3}),M({type:"success",text:"Program berhasil dihapus."}),await re()}catch(k){console.error("Error deleting program:",k),M({type:"error",text:"Gagal menghapus program: "+(k.response?.data?.message||k.message)})}},Z=D=>{const N=Number(D||0);return Number.isFinite(N)?`Rp ${Math.round(N).toLocaleString("id-ID")}`:"Rp 0"},fe=D=>{const k={active:{tone:"success",icon:"bi-check-circle",text:"Aktif"},inactive:{tone:"secondary",icon:"bi-pause-circle",text:"Tidak Aktif"},full:{tone:"warning",icon:"bi-people",text:"Penuh"}}[D]||{tone:"secondary",icon:"bi-circle",text:D||"-"};return e.jsxs("span",{className:`program-status-badge program-status-${k.tone}`,children:[e.jsx("i",{className:`bi ${k.icon}`,"aria-hidden":"true"}),k.text]})},U=D=>{const N=_f.find(k=>k.value===D);return N?D==="none"?"Bayar Penuh":N.label:"-"},ie=D=>{const N=Number(D.capacity)||0,k=Number(D.current_participants)||0,Y=N>0?Math.min(100,Math.round(k/N*100)):0;return{capacity:N,participants:k,percentage:Y}},I=D=>{const N=At(D||"");return N.includes("penyaluran")?"bi-briefcase":N.includes("pelatihan")?"bi-mortarboard":N.includes("korea")?"bi-globe-asia-australia":N.includes("amto")?"bi-tools":"bi-journal-bookmark"},ue={total:L.length,active:L.filter(D=>D.status==="active").length,full:L.filter(D=>D.status==="full").length,totalCapacity:L.reduce((D,N)=>D+(Number(N.capacity)||0),0)};return u&&L.length===0?e.jsx("div",{className:"program-management-page",children:e.jsxs("div",{className:"program-loading-state",children:[e.jsx("div",{className:"program-loading-icon",children:e.jsx("span",{className:"spinner-border",role:"status"})}),e.jsx("h4",{children:"Memuat data program"}),e.jsx("p",{children:"Informasi program sedang disiapkan."})]})}):e.jsxs("div",{className:"program-management-page",children:[e.jsxs("header",{className:"program-page-header",children:[e.jsxs("div",{className:"program-page-heading",children:[e.jsxs("div",{className:"program-page-eyebrow",children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-journal-text"})}),"MANAJEMEN PROGRAM"]}),e.jsx("h1",{children:"Manajemen Program"}),e.jsx("p",{children:"Kelola program pelatihan, penyaluran, kuota, biaya, jadwal, pembayaran, dan informasi pendukung program FITALENTA."})]}),e.jsxs("button",{type:"button",className:"program-add-button",onClick:()=>ge(),children:[e.jsx("span",{className:"program-add-button-icon",children:e.jsx("i",{className:"bi bi-plus-lg"})}),e.jsxs("span",{className:"program-add-button-copy",children:[e.jsx("strong",{children:"Tambah Program"}),e.jsx("small",{children:"Buat program baru"})]})]})]}),w.text&&e.jsxs("div",{className:`program-alert ${w.type==="error"?"program-alert-error":"program-alert-success"}`,children:[e.jsx("div",{className:"program-alert-icon",children:e.jsx("i",{className:`bi ${w.type==="error"?"bi-exclamation-triangle":"bi-check-circle"}`})}),e.jsxs("div",{className:"program-alert-content",children:[e.jsx("strong",{children:w.type==="error"?"Terjadi kendala":"Berhasil"}),e.jsx("span",{children:w.text})]}),e.jsx("button",{type:"button",onClick:()=>M({type:"",text:""}),"aria-label":"Tutup pemberitahuan",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("section",{className:"program-summary-grid",children:[e.jsxs("article",{className:"program-summary-card",children:[e.jsx("div",{className:"program-summary-icon",children:e.jsx("i",{className:"bi bi-grid"})}),e.jsxs("div",{children:[e.jsx("span",{children:"TOTAL PROGRAM"}),e.jsx("strong",{children:ue.total}),e.jsx("small",{children:"Program tersedia"})]})]}),e.jsxs("article",{className:"program-summary-card",children:[e.jsx("div",{className:"program-summary-icon program-summary-icon-success",children:e.jsx("i",{className:"bi bi-check2-circle"})}),e.jsxs("div",{children:[e.jsx("span",{children:"PROGRAM AKTIF"}),e.jsx("strong",{children:ue.active}),e.jsx("small",{children:"Sedang ditawarkan"})]})]}),e.jsxs("article",{className:"program-summary-card",children:[e.jsx("div",{className:"program-summary-icon program-summary-icon-warning",children:e.jsx("i",{className:"bi bi-people"})}),e.jsxs("div",{children:[e.jsx("span",{children:"PROGRAM PENUH"}),e.jsx("strong",{children:ue.full}),e.jsx("small",{children:"Kuota terpenuhi"})]})]}),e.jsxs("article",{className:"program-summary-card",children:[e.jsx("div",{className:"program-summary-icon program-summary-icon-info",children:e.jsx("i",{className:"bi bi-person-plus"})}),e.jsxs("div",{children:[e.jsx("span",{children:"TOTAL KUOTA"}),e.jsx("strong",{children:ue.totalCapacity}),e.jsx("small",{children:"Kapasitas peserta"})]})]})]}),e.jsxs("section",{className:"program-content-card",children:[e.jsxs("div",{className:"program-card-heading",children:[e.jsxs("div",{className:"program-card-heading-left",children:[e.jsx("div",{className:"program-section-icon",children:e.jsx("i",{className:"bi bi-journal-richtext"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE PROGRAM"}),e.jsx("h2",{children:"Daftar Program"}),e.jsxs("p",{children:["Menampilkan"," ",L.length," ","program sesuai kategori dan format resmi FITALENTA."]})]})]}),e.jsx("button",{type:"button",className:"program-refresh-button",onClick:re,disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Memuat"]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Refresh"]})})]}),p&&e.jsxs("div",{className:"program-error-message",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-exclamation-triangle"})}),e.jsx("span",{children:p}),e.jsx("button",{type:"button",onClick:()=>x(""),"aria-label":"Tutup error",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),L.length===0?e.jsxs("div",{className:"program-empty-state",children:[e.jsx("div",{className:"program-empty-icon",children:e.jsx("i",{className:"bi bi-journal-plus"})}),e.jsx("h4",{children:"Belum ada program"}),e.jsx("p",{children:"Mulai dengan membuat program pertama untuk ditampilkan kepada peserta."}),e.jsxs("button",{type:"button",className:"program-primary-button",onClick:()=>ge(),children:[e.jsx("i",{className:"bi bi-plus-lg"}),"Tambah Program"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"program-table-wrapper d-none d-lg-block",children:e.jsxs("table",{className:"program-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Program"}),e.jsx("th",{children:"Kategori"}),e.jsx("th",{children:"Durasi"}),e.jsx("th",{children:"Kuota"}),e.jsx("th",{children:"Biaya"}),e.jsx("th",{children:"Status"}),e.jsx("th",{className:"text-center",children:"Aksi"})]})}),e.jsx("tbody",{children:L.map((D,N)=>{const k=ie(D);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"program-table-program",children:[e.jsxs("small",{children:["PROGRAM ",String(N+1).padStart(2,"0")]}),e.jsx("strong",{children:D.name||"-"})]})}),e.jsx("td",{children:e.jsx("span",{className:"program-category-badge",children:D.category_name||"-"})}),e.jsx("td",{children:e.jsx("span",{className:"program-table-duration",children:D.duration||"-"})}),e.jsx("td",{children:e.jsxs("div",{className:"program-table-capacity",children:[e.jsxs("span",{className:"program-table-capacity-text",children:[k.participants,"/",k.capacity]}),e.jsx("div",{className:"program-capacity-track",children:e.jsx("div",{className:"program-capacity-bar",style:{width:`${k.percentage}%`}})})]})}),e.jsx("td",{children:e.jsx("span",{className:"program-table-price",children:Z(D.training_cost)})}),e.jsx("td",{children:fe(D.status)}),e.jsx("td",{className:"text-center",children:e.jsxs("div",{className:"program-table-actions",children:[e.jsx("button",{type:"button",className:"program-table-action-btn program-table-action-edit",onClick:()=>ge(D),"aria-label":"Edit Program",children:e.jsx("i",{className:"bi bi-pencil"})}),e.jsx("button",{type:"button",className:"program-table-action-btn program-table-action-delete",onClick:()=>Se(D.id),"aria-label":"Hapus Program",children:e.jsx("i",{className:"bi bi-trash"})})]})})]},D.id)})})]})}),e.jsx("div",{className:"program-mobile-list d-lg-none",children:L.map(D=>{const N=ie(D),k=od(D);return e.jsxs("article",{className:"program-mobile-card",children:[e.jsxs("div",{className:"program-mobile-card-header",children:[e.jsxs("div",{className:"program-mobile-program-heading",children:[e.jsx("div",{className:"program-table-program-icon",children:e.jsx("i",{className:`bi ${I(D.category_name)}`})}),e.jsxs("div",{children:[e.jsxs("div",{className:"program-mobile-badges",children:[e.jsx("span",{className:"program-category-badge",children:D.category_name||"-"}),e.jsx("span",{className:"program-format-badge",children:D.program_format||"-"})]}),e.jsx("strong",{children:D.name||"-"})]})]}),fe(D.status)]}),e.jsx("p",{className:"program-mobile-description",children:D.description||"Tidak ada deskripsi program."}),e.jsxs("div",{className:"program-mobile-info-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Tipe"}),e.jsx("strong",{children:D.program_format||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Durasi"}),e.jsx("strong",{children:D.duration||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Biaya Pelatihan"}),e.jsx("strong",{children:Z(D.training_cost)})]}),k&&e.jsxs("div",{children:[e.jsx("span",{children:"Job Matching"}),e.jsx("strong",{children:Z(D.job_matching_cost)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"DP / Uang Muka"}),e.jsx("strong",{children:Number(D.down_payment||0)>0?Z(D.down_payment):"Tidak Ada"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Skema Pembayaran"}),e.jsx("strong",{children:U(D.installment_plan)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Lokasi"}),e.jsx("strong",{children:D.location||"-"})]})]}),e.jsxs("div",{className:"program-mobile-capacity",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Kuota"}),e.jsxs("strong",{children:[N.participants," ","/"," ",N.capacity," ","peserta"]})]}),e.jsxs("span",{children:[N.percentage,"%"]}),e.jsx("div",{className:"program-capacity-track",children:e.jsx("div",{className:"program-capacity-bar",style:{width:`${N.percentage}%`}})})]}),e.jsxs("div",{className:"program-mobile-actions",children:[e.jsxs("button",{type:"button",className:"program-mobile-edit",onClick:()=>ge(D),children:[e.jsx("i",{className:"bi bi-pencil"}),"Edit Program"]}),e.jsx("button",{type:"button",className:"program-mobile-delete",onClick:()=>Se(D.id),"aria-label":"Hapus Program",children:e.jsx("i",{className:"bi bi-trash"})})]})]},D.id)})}),e.jsx("div",{className:"program-table-footer",children:e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"}),e.jsxs("span",{children:[L.length," ","program ditampilkan"]})]})})]})]}),y&&gg.createPortal(e.jsx("div",{className:"program-modal-overlay",onMouseDown:D=>{D.target===D.currentTarget&&!A&&ye()},children:e.jsx("div",{className:"program-modal-dialog",role:"dialog","aria-modal":"true","aria-labelledby":"program-modal-title",onMouseDown:D=>D.stopPropagation(),children:e.jsxs("div",{className:"program-modal-content",children:[e.jsxs("div",{className:"program-modal-header",children:[e.jsxs("div",{className:"program-modal-heading",children:[e.jsx("div",{className:"program-modal-heading-icon",children:e.jsx("i",{className:`bi ${b?"bi-pencil-square":"bi-journal-plus"}`})}),e.jsxs("div",{children:[e.jsx("span",{children:b?"PERBARUI PROGRAM":"PROGRAM BARU"}),e.jsx("h2",{id:"program-modal-title",children:b?"Edit Program":"Tambah Program"}),e.jsx("p",{children:b?"Perbarui informasi dan pengaturan program yang dipilih.":"Lengkapi informasi program sebelum dipublikasikan kepada peserta."})]})]}),e.jsx("button",{type:"button",className:"program-modal-close",onClick:ye,disabled:A,"aria-label":"Tutup modal",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{onSubmit:Ce,className:"program-modal-form",children:[e.jsxs("div",{className:"program-modal-body",children:[e.jsxs("section",{className:"program-form-section",children:[e.jsxs("div",{className:"program-form-section-heading",children:[e.jsx("div",{className:"program-form-section-icon",children:e.jsx("i",{className:"bi bi-info-circle"})}),e.jsxs("div",{children:[e.jsx("span",{children:"INFORMASI DASAR"}),e.jsx("h3",{children:"Identitas Program"}),e.jsx("p",{children:"Gunakan nama program sesuai judul resmi, pilih kategori utama, dan tentukan tipe atau format program."})]})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsxs("label",{children:["Nama Program"," ",e.jsx("span",{children:"*"})]}),e.jsx("input",{type:"text",name:"name",value:_.name,onChange:he,required:!0,placeholder:"Masukkan nama program"})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsxs("label",{children:["Kategori"," ",e.jsx("span",{children:"*"})]}),e.jsxs("select",{name:"category_id",value:_.category_id,onChange:he,required:!0,children:[e.jsx("option",{value:"",children:"Pilih kategori"}),q.map(D=>e.jsx("option",{value:D.id,children:D.name},D.id))]}),e.jsx("small",{children:"Kategori utama: Pelatihan, Penyaluran, atau Pelatihan dan Penyaluran."})]})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsxs("label",{children:["Tipe / Format Program"," ",e.jsx("span",{children:"*"})]}),e.jsxs("select",{name:"program_format",value:_.program_format,onChange:he,required:!0,children:[e.jsx("option",{value:"",children:"Pilih tipe / format program"}),vg.map(D=>e.jsx("option",{value:D.value,children:D.label},D.value))]}),e.jsx("small",{children:"Format menjelaskan karakter pelaksanaan program dan berbeda dari kategori utama."})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Deskripsi Program"}),e.jsx("textarea",{rows:"4",name:"description",value:_.description,onChange:he,placeholder:"Jelaskan tujuan, konsep, serta manfaat utama program..."})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Persyaratan Umum"}),e.jsx("textarea",{rows:"4",name:"requirements",value:_.requirements,onChange:he,placeholder:`Pisahkan persyaratan dengan baris baru.
Contoh:
Minimal lulusan SMK/sederajat
Sehat jasmani dan rohani
Komitmen mengikuti program`}),e.jsx("small",{children:"Digunakan sebagai persyaratan umum program."})]})]}),e.jsxs("section",{className:"program-form-section",children:[e.jsxs("div",{className:"program-form-section-heading",children:[e.jsx("div",{className:"program-form-section-icon",children:e.jsx("i",{className:"bi bi-calendar-week"})}),e.jsxs("div",{children:[e.jsx("span",{children:"OPERASIONAL PROGRAM"}),e.jsx("h3",{children:"Pelaksanaan Program"}),e.jsx("p",{children:"Atur jadwal, durasi, lokasi, kuota dan status program."})]})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Jadwal"}),e.jsx("input",{type:"text",name:"schedule",value:_.schedule,onChange:he,placeholder:"Contoh: Senin-Jumat (Full Day)"})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Durasi"}),e.jsx("input",{type:"text",name:"duration",value:_.duration,onChange:he,placeholder:"Contoh: 6 bulan"})]})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Kuota Peserta"}),e.jsx("input",{type:"number",min:"0",name:"capacity",value:_.capacity,onChange:he,placeholder:"Contoh: 20"})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Status"}),e.jsxs("select",{name:"status",value:_.status,onChange:he,children:[e.jsx("option",{value:"active",children:"Aktif"}),e.jsx("option",{value:"inactive",children:"Tidak Aktif"}),e.jsx("option",{value:"full",children:"Penuh"})]})]})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Lokasi"}),e.jsxs("div",{className:"program-input-with-icon",children:[e.jsx("i",{className:"bi bi-geo-alt"}),e.jsx("input",{type:"text",name:"location",value:_.location,onChange:he,placeholder:"Lokasi pelaksanaan program"})]})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Rencana Cicilan"}),e.jsx("select",{name:"installment_plan",value:_.installment_plan,onChange:he,children:_f.map(D=>e.jsx("option",{value:D.value,children:D.label},D.value))}),e.jsx("small",{children:"Cicilan dan DP diatur secara terpisah."})]})]})]}),e.jsxs("section",{className:"program-form-section",children:[e.jsxs("div",{className:"program-form-section-heading",children:[e.jsx("div",{className:"program-form-section-icon",children:e.jsx("i",{className:"bi bi-wallet2"})}),e.jsxs("div",{children:[e.jsx("span",{children:"INFORMASI BIAYA"}),e.jsx("h3",{children:"Biaya & Pendanaan"}),e.jsx("p",{children:"Atur biaya pelatihan, biaya keberangkatan, DP, dan fasilitas pendanaan."})]})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Biaya Pelatihan"}),e.jsxs("div",{className:"program-currency-input",children:[e.jsx("span",{children:"Rp"}),e.jsx("input",{type:"text",inputMode:"numeric",value:jr(_.training_cost),onChange:D=>Oe("training_cost",D.target.value),placeholder:"0"})]}),e.jsx("small",{children:"Contoh: 7.150.000"})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Biaya Keberangkatan"}),e.jsxs("div",{className:"program-currency-input",children:[e.jsx("span",{children:"Rp"}),e.jsx("input",{type:"text",inputMode:"numeric",value:jr(_.departure_cost),onChange:D=>Oe("departure_cost",D.target.value),placeholder:"0"})]}),e.jsx("small",{children:"Contoh: 30.000.000"})]})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"DP / Uang Muka"}),e.jsxs("div",{className:"program-currency-input",children:[e.jsx("span",{children:"Rp"}),e.jsx("input",{type:"text",inputMode:"numeric",value:jr(_.down_payment),onChange:D=>Oe("down_payment",D.target.value),placeholder:"0"})]}),e.jsx("small",{children:"Opsional. Isi nominal DP sesuai kebijakan program. DP dapat digunakan bersamaan dengan skema cicilan. Kosongkan jika tidak menggunakan DP."})]}),oe&&e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Biaya Pendampingan Job Matching"}),e.jsxs("div",{className:"program-currency-input",children:[e.jsx("span",{children:"Rp"}),e.jsx("input",{type:"text",inputMode:"numeric",value:jr(_.job_matching_cost),onChange:D=>Oe("job_matching_cost",D.target.value),placeholder:"0"})]}),e.jsx("small",{children:"Biaya pendampingan Job Matching hanya tersedia untuk program dengan format Hybrid."})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Dana Talang"}),e.jsx("input",{type:"text",name:"bridge_fund",value:_.bridge_fund,onChange:he,placeholder:"Informasi fasilitas dana talang"})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Info Kontak"}),e.jsx("textarea",{rows:"3",name:"contact_info",value:_.contact_info,onChange:he,placeholder:`Email: ...
Telp: ...
Alamat: ...`}),e.jsx("small",{children:"Kontak yang dapat dihubungi peserta untuk informasi lebih lanjut."})]})]}),e.jsxs("section",{className:"program-form-section",children:[e.jsxs("div",{className:"program-form-section-heading",children:[e.jsx("div",{className:"program-form-section-icon",children:e.jsx("i",{className:"bi bi-list-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"INFORMASI DETAIL"}),e.jsx("h3",{children:"Rincian Program"}),e.jsx("p",{children:"Informasi tambahan yang digunakan pada detail program."})]})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Timeline Program"}),e.jsx("textarea",{rows:"5",name:"timeline_text",value:_.timeline_text,onChange:he,placeholder:`Pisahkan setiap fase dengan baris baru.
Contoh:
Bulan 1: Pelatihan Dasar
Bulan 2: Pelatihan Lanjutan
Bulan 3: Persiapan Keberangkatan`}),e.jsx("small",{children:"Pisahkan setiap fase program menggunakan baris baru."})]}),e.jsxs("div",{className:"program-form-grid program-form-grid-two program-form-grid-top",children:[e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Detail Biaya Pelatihan"}),e.jsx("textarea",{rows:"6",name:"training_fee_details",value:_.training_fee_details,onChange:he,placeholder:oe?`Contoh:
Biaya administrasi
Modul pembelajaran
Pelatihan bahasa
Pendampingan program`:`Contoh:
Biaya administrasi
Modul pembelajaran
Seragam
Asrama`}),e.jsx("small",{children:"Rincian item yang termasuk biaya pelatihan."})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Detail Biaya Keberangkatan"}),e.jsx("textarea",{rows:"6",name:"departure_fee_details",value:_.departure_fee_details,onChange:he,placeholder:`Pisahkan setiap item dengan baris baru.
Contoh:
Tiket pesawat
Visa & dokumen
Asuransi
Biaya penempatan`}),e.jsx("small",{children:"Rincian item yang termasuk biaya keberangkatan."})]})]}),e.jsxs("div",{className:"program-form-field",children:[e.jsx("label",{children:"Daftar Persyaratan Peserta"}),e.jsx("textarea",{rows:"5",name:"requirements_text",value:_.requirements_text,onChange:he,placeholder:`Pisahkan setiap persyaratan dengan baris baru.
Contoh:
Usia minimal 18 tahun
Pendidikan minimal SMA
Sehat jasmani dan rohani`}),e.jsx("small",{children:"Digunakan pada tampilan detail persyaratan peserta."})]})]})]}),e.jsxs("div",{className:"program-modal-footer",children:[e.jsx("button",{type:"button",className:"program-secondary-button",onClick:ye,disabled:A,children:"Batal"}),e.jsx("button",{type:"submit",className:"program-primary-button",disabled:A,children:A?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyimpan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-check2-circle"}),b?"Simpan Perubahan":"Simpan Program"]})})]})]})]})})}),document.body)]})},DN=()=>{const[i,l]=j.useState([]),[d,o]=j.useState(!0),[u,h]=j.useState(!1),[p,x]=j.useState(""),[y,f]=j.useState(""),[b,v]=j.useState(!1),[A,P]=j.useState(null),w={full_name:"",email:"",phone:"",address:"",user_type:"participant",password:""},[M,H]=j.useState(w),_=async()=>{try{o(!0),x("");const I=await de.get("/api/admin/users");l(Array.isArray(I.data?.data)?I.data.data:[])}catch(I){console.error("Error fetching users:",I),L(I.response?.data?.message||"Gagal memuat data user")}finally{o(!1)}};j.useEffect(()=>{_()},[]),j.useEffect(()=>{if(!y&&!p)return;const I=setTimeout(()=>{f(""),x("")},5e3);return()=>clearTimeout(I)},[y,p]),j.useEffect(()=>{if(!b)return;const I=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=I}},[b]);const E=I=>{f(I),x("")},L=I=>{x(I),f("")},q=()=>{H({...w}),P(null)},oe=()=>{q(),v(!0)},re=I=>{P(I),H({full_name:I.full_name||"",email:I.email||"",phone:I.phone||"",address:I.address||"",user_type:I.user_type||"participant",password:""}),v(!0)},te=()=>{u||(v(!1),q())},ge=I=>{const{name:ue,value:D}=I.target;H(N=>({...N,[ue]:D}))},ye=async I=>{I.preventDefault();try{if(h(!0),x(""),A){const ue={...M};ue.password||delete ue.password,await de.put(`/api/admin/users/${A.id}`,ue),E("User berhasil diperbarui!")}else{if(!M.password){L("Password wajib diisi untuk user baru");return}await de.post("/api/admin/users",M),E("User berhasil ditambahkan!")}v(!1),q(),await _()}catch(ue){console.error("Error saving user:",ue);const D=ue.response?.data?.message||"Gagal menyimpan data user";L(D)}finally{h(!1)}},he=async I=>{const ue=i.find(D=>D.id===I);if(window.confirm(`Apakah Anda yakin ingin menghapus user "${ue?.full_name}"?

PERHATIAN: Semua data user termasuk:
• Data pendaftaran
• Data pembayaran
• File foto, dokumen, dan bukti pembayaran
• Jumlah peserta program akan disesuaikan
akan dihapus secara permanen!`))try{const D=await de.delete(`/api/admin/users/${I}`);E(D.data?.message||"User berhasil dihapus"),await _()}catch(D){console.error("Error deleting user:",D);const N=D.response?.data?.message||"Gagal menghapus user";L(N)}},Oe=async()=>{try{o(!0);const I=await de.post("/api/programs/sync-participants");E(I.data?.message||"Sinkronisasi user berhasil")}catch(I){console.error("Error syncing participants:",I);const ue=I.response?.data?.message||"Gagal sinkronisasi participants";L(ue)}finally{o(!1)}},Ce=I=>I?I.split(" ").filter(Boolean).slice(0,2).map(ue=>ue.charAt(0).toUpperCase()).join(""):"U",Se=I=>I==="admin"?e.jsxs("span",{className:"user-type-badge user-type-admin",children:[e.jsx("i",{className:"bi bi-shield-check"}),"Admin"]}):e.jsxs("span",{className:"user-type-badge user-type-participant",children:[e.jsx("i",{className:"bi bi-person"}),"Peserta"]}),Z=I=>{if(!I)return"-";const ue=new Date(I);return Number.isNaN(ue.getTime())?"-":ue.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},fe=I=>{if(!I)return"-";const ue=new Date(I);return Number.isNaN(ue.getTime())?"-":ue.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})},U={total:i.length,participants:i.filter(I=>I.user_type==="participant").length,admins:i.filter(I=>I.user_type==="admin").length,withPhone:i.filter(I=>!!I.phone).length};if(d&&i.length===0)return e.jsx("div",{className:"user-management-page",children:e.jsxs("div",{className:"user-loading-state",children:[e.jsx("div",{className:"user-loading-icon",children:e.jsx("span",{className:"spinner-border",role:"status"})}),e.jsx("h4",{children:"Memuat data user"}),e.jsx("p",{children:"Informasi pengguna sedang disiapkan."})]})});const ie=b&&gg.createPortal(e.jsx("div",{className:"user-modal-overlay",onMouseDown:I=>{I.target===I.currentTarget&&te()},children:e.jsx("div",{className:"user-modal-dialog",role:"dialog","aria-modal":"true","aria-labelledby":"user-modal-title",children:e.jsxs("div",{className:"user-modal-content",children:[e.jsxs("div",{className:"user-modal-header",children:[e.jsxs("div",{className:"user-modal-heading",children:[e.jsx("div",{className:"user-modal-heading-icon",children:e.jsx("i",{className:`bi ${A?"bi-pencil-square":"bi-person-plus"}`})}),e.jsxs("div",{children:[e.jsx("span",{children:A?"PERBARUI USER":"USER BARU"}),e.jsx("h2",{id:"user-modal-title",children:A?"Edit User":"Tambah User"}),e.jsx("p",{children:A?"Perbarui informasi dan pengaturan akun pengguna yang dipilih.":"Lengkapi informasi akun untuk menambahkan pengguna baru ke sistem."})]})]}),e.jsx("button",{type:"button",className:"user-modal-close",onClick:te,disabled:u,"aria-label":"Tutup modal",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("form",{className:"user-modal-form",onSubmit:ye,children:[e.jsxs("div",{className:"user-modal-body",children:[e.jsxs("section",{className:"user-form-section",children:[e.jsxs("div",{className:"user-form-section-heading",children:[e.jsx("div",{className:"user-form-section-icon",children:e.jsx("i",{className:"bi bi-person-vcard"})}),e.jsxs("div",{children:[e.jsx("span",{children:"INFORMASI AKUN"}),e.jsx("h3",{children:"Identitas User"}),e.jsx("p",{children:"Informasi dasar pengguna yang terdaftar pada sistem."})]})]}),e.jsxs("div",{className:"user-form-grid user-form-grid-two",children:[e.jsxs("div",{className:"user-form-field",children:[e.jsxs("label",{htmlFor:"full_name",children:["Nama Lengkap",e.jsx("span",{children:" *"})]}),e.jsxs("div",{className:"user-input-with-icon",children:[e.jsx("i",{className:"bi bi-person"}),e.jsx("input",{type:"text",id:"full_name",name:"full_name",value:M.full_name,onChange:ge,placeholder:"Masukkan nama lengkap",required:!0})]})]}),e.jsxs("div",{className:"user-form-field",children:[e.jsxs("label",{htmlFor:"email",children:["Email",e.jsx("span",{children:" *"})]}),e.jsxs("div",{className:"user-input-with-icon",children:[e.jsx("i",{className:"bi bi-envelope"}),e.jsx("input",{type:"email",id:"email",name:"email",value:M.email,onChange:ge,placeholder:"contoh@email.com",required:!0})]})]})]}),e.jsxs("div",{className:"user-form-grid user-form-grid-two",children:[e.jsxs("div",{className:"user-form-field",children:[e.jsx("label",{htmlFor:"phone",children:"Telepon"}),e.jsxs("div",{className:"user-input-with-icon",children:[e.jsx("i",{className:"bi bi-telephone"}),e.jsx("input",{type:"text",id:"phone",name:"phone",value:M.phone,onChange:ge,placeholder:"08xxxxxxxxxx"})]})]}),e.jsxs("div",{className:"user-form-field",children:[e.jsxs("label",{htmlFor:"user_type",children:["Tipe User",e.jsx("span",{children:" *"})]}),e.jsxs("div",{className:"user-select-with-icon",children:[e.jsx("i",{className:"bi bi-person-badge"}),e.jsxs("select",{id:"user_type",name:"user_type",value:M.user_type,onChange:ge,required:!0,children:[e.jsx("option",{value:"participant",children:"Peserta"}),e.jsx("option",{value:"admin",children:"Administrator"})]})]}),e.jsx("small",{children:M.user_type==="admin"?"Administrator memiliki akses penuh ke fitur admin.":"Peserta dapat melakukan pendaftaran dan mengikuti program."})]})]}),e.jsxs("div",{className:"user-form-field",children:[e.jsx("label",{htmlFor:"address",children:"Alamat"}),e.jsx("textarea",{id:"address",name:"address",rows:"4",value:M.address,onChange:ge,placeholder:"Masukkan alamat lengkap pengguna..."})]})]}),e.jsxs("section",{className:"user-form-section",children:[e.jsxs("div",{className:"user-form-section-heading",children:[e.jsx("div",{className:"user-form-section-icon",children:e.jsx("i",{className:"bi bi-shield-lock"})}),e.jsxs("div",{children:[e.jsx("span",{children:"KEAMANAN AKUN"}),e.jsx("h3",{children:"Password User"}),e.jsx("p",{children:"Atur password yang digunakan pengguna untuk mengakses sistem."})]})]}),e.jsxs("div",{className:"user-form-field",children:[e.jsxs("label",{htmlFor:"password",children:[A?"Password Baru":"Password",!A&&e.jsx("span",{children:" *"})]}),e.jsxs("div",{className:"user-input-with-icon",children:[e.jsx("i",{className:"bi bi-key"}),e.jsx("input",{type:"password",id:"password",name:"password",value:M.password,onChange:ge,required:!A,minLength:6,placeholder:A?"Kosongkan jika tidak ingin mengubah password":"Masukkan password minimal 6 karakter"})]}),e.jsx("small",{children:A?"Biarkan kosong apabila password lama tetap digunakan.":"Gunakan minimal 6 karakter untuk password user."})]}),e.jsxs("div",{className:"user-security-note",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-info-circle"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Keamanan akun"}),e.jsx("span",{children:"Pastikan email dan tipe user telah sesuai sebelum data disimpan."})]})]})]})]}),e.jsxs("div",{className:"user-modal-footer",children:[e.jsx("button",{type:"button",className:"user-secondary-button",onClick:te,disabled:u,children:"Batal"}),e.jsx("button",{type:"submit",className:"user-primary-button",disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Menyimpan..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-check2-circle"}),A?"Simpan Perubahan":"Simpan User"]})})]})]})]})})}),document.body);return e.jsxs("div",{className:"user-management-page",children:[e.jsxs("header",{className:"user-page-header",children:[e.jsxs("div",{className:"user-page-heading",children:[e.jsxs("div",{className:"user-page-eyebrow",children:[e.jsx("span",{children:e.jsx("i",{className:"bi bi-people"})}),"MANAJEMEN USER"]}),e.jsx("h1",{children:"Manajemen User"}),e.jsx("p",{children:"Kelola akun peserta dan administrator, informasi kontak, serta hak akses pengguna FITALENTA."})]}),e.jsxs("div",{className:"user-page-actions",children:[e.jsx("button",{type:"button",className:"user-sync-button",onClick:Oe,disabled:d,children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Sinkronisasi..."]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"user-sync-button-icon",children:e.jsx("i",{className:"bi bi-arrow-repeat"})}),e.jsxs("span",{className:"user-action-copy",children:[e.jsx("strong",{children:"Sinkron User"}),e.jsx("small",{children:"Perbarui jumlah peserta"})]})]})}),e.jsxs("button",{type:"button",className:"user-add-button",onClick:oe,children:[e.jsx("span",{className:"user-add-button-icon",children:e.jsx("i",{className:"bi bi-plus-lg"})}),e.jsxs("span",{className:"user-action-copy",children:[e.jsx("strong",{children:"Tambah User"}),e.jsx("small",{children:"Buat akun baru"})]})]})]})]}),(y||p)&&e.jsxs("div",{className:`user-alert ${p?"user-alert-error":"user-alert-success"}`,children:[e.jsx("div",{className:"user-alert-icon",children:e.jsx("i",{className:`bi ${p?"bi-exclamation-triangle":"bi-check-circle"}`})}),e.jsxs("div",{className:"user-alert-content",children:[e.jsx("strong",{children:p?"Terjadi kendala":"Berhasil"}),e.jsx("span",{children:p||y})]}),e.jsx("button",{type:"button",onClick:()=>{x(""),f("")},"aria-label":"Tutup pemberitahuan",children:e.jsx("i",{className:"bi bi-x-lg"})})]}),e.jsxs("section",{className:"user-summary-grid",children:[e.jsxs("article",{className:"user-summary-card",children:[e.jsx("div",{className:"user-summary-icon",children:e.jsx("i",{className:"bi bi-people"})}),e.jsxs("div",{children:[e.jsx("span",{children:"TOTAL USER"}),e.jsx("strong",{children:U.total}),e.jsx("small",{children:"Seluruh akun terdaftar"})]})]}),e.jsxs("article",{className:"user-summary-card",children:[e.jsx("div",{className:"user-summary-icon user-summary-icon-participant",children:e.jsx("i",{className:"bi bi-person"})}),e.jsxs("div",{children:[e.jsx("span",{children:"PESERTA"}),e.jsx("strong",{children:U.participants}),e.jsx("small",{children:"Akun peserta program"})]})]}),e.jsxs("article",{className:"user-summary-card",children:[e.jsx("div",{className:"user-summary-icon user-summary-icon-admin",children:e.jsx("i",{className:"bi bi-shield-check"})}),e.jsxs("div",{children:[e.jsx("span",{children:"ADMINISTRATOR"}),e.jsx("strong",{children:U.admins}),e.jsx("small",{children:"Pengelola sistem"})]})]}),e.jsxs("article",{className:"user-summary-card",children:[e.jsx("div",{className:"user-summary-icon user-summary-icon-contact",children:e.jsx("i",{className:"bi bi-telephone"})}),e.jsxs("div",{children:[e.jsx("span",{children:"KONTAK TERISI"}),e.jsx("strong",{children:U.withPhone}),e.jsx("small",{children:"Memiliki nomor telepon"})]})]})]}),e.jsxs("section",{className:"user-content-card",children:[e.jsxs("div",{className:"user-card-heading",children:[e.jsxs("div",{className:"user-card-heading-left",children:[e.jsx("div",{className:"user-section-icon",children:e.jsx("i",{className:"bi bi-person-lines-fill"})}),e.jsxs("div",{children:[e.jsx("span",{children:"DATABASE USER"}),e.jsx("h2",{children:"Daftar User"}),e.jsxs("p",{children:["Menampilkan ",i.length," akun pengguna yang terdaftar pada sistem."]})]})]}),e.jsx("button",{type:"button",className:"user-refresh-button",onClick:_,disabled:d,children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),"Memuat"]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"bi bi-arrow-clockwise"}),"Refresh"]})})]}),i.length===0?e.jsxs("div",{className:"user-empty-state",children:[e.jsx("div",{className:"user-empty-icon",children:e.jsx("i",{className:"bi bi-person-plus"})}),e.jsx("h4",{children:"Belum ada user"}),e.jsx("p",{children:"Tambahkan akun user pertama agar pengguna dapat mengakses sistem."}),e.jsxs("button",{type:"button",className:"user-primary-button",onClick:oe,children:[e.jsx("i",{className:"bi bi-plus-lg"}),"Tambah User"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"user-table-wrapper d-none d-lg-block",children:e.jsxs("table",{className:"user-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"User"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Telepon"}),e.jsx("th",{children:"Tipe User"}),e.jsx("th",{children:"Tanggal Daftar"}),e.jsx("th",{className:"text-center",children:"Aksi"})]})}),e.jsx("tbody",{children:i.map(I=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"user-table-profile",children:[e.jsx("div",{className:"user-table-avatar",children:Ce(I.full_name)}),e.jsxs("div",{children:[e.jsx("strong",{children:I.full_name}),e.jsx("span",{children:I.user_type==="admin"?"Administrator":"Peserta FITALENTA"})]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"user-table-contact",children:[e.jsx("i",{className:"bi bi-envelope"}),e.jsx("span",{children:I.email})]})}),e.jsx("td",{children:e.jsxs("div",{className:`user-table-contact ${I.phone?"":"is-empty"}`,children:[e.jsx("i",{className:"bi bi-telephone"}),e.jsx("span",{children:I.phone||"Belum tersedia"})]})}),e.jsx("td",{children:Se(I.user_type)}),e.jsx("td",{children:e.jsxs("div",{className:"user-date-cell",children:[e.jsx("strong",{children:Z(I.created_at)}),e.jsx("span",{children:fe(I.created_at)})]})}),e.jsx("td",{children:e.jsxs("div",{className:"user-action-group",children:[e.jsx("button",{type:"button",className:"user-action-button",onClick:()=>re(I),title:"Edit User",children:e.jsx("i",{className:"bi bi-pencil"})}),e.jsx("button",{type:"button",className:"user-action-button user-action-delete",onClick:()=>he(I.id),disabled:I.user_type==="admin",title:I.user_type==="admin"?"Administrator tidak dapat dihapus":"Hapus User",children:e.jsx("i",{className:"bi bi-trash"})})]})})]},I.id))})]})}),e.jsx("div",{className:"user-mobile-list d-lg-none",children:i.map(I=>e.jsxs("article",{className:"user-mobile-card",children:[e.jsxs("div",{className:"user-mobile-header",children:[e.jsxs("div",{className:"user-mobile-profile",children:[e.jsx("div",{className:"user-table-avatar",children:Ce(I.full_name)}),e.jsxs("div",{children:[e.jsx("strong",{children:I.full_name}),e.jsx("span",{children:I.email})]})]}),Se(I.user_type)]}),e.jsxs("div",{className:"user-mobile-info-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Telepon"}),e.jsx("strong",{children:I.phone||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Tanggal Daftar"}),e.jsx("strong",{children:Z(I.created_at)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Jam Daftar"}),e.jsx("strong",{children:fe(I.created_at)})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Akses"}),e.jsx("strong",{children:I.user_type==="admin"?"Administrator":"Peserta"})]})]}),e.jsxs("div",{className:"user-mobile-actions",children:[e.jsxs("button",{type:"button",className:"user-mobile-edit",onClick:()=>re(I),children:[e.jsx("i",{className:"bi bi-pencil"}),"Edit User"]}),e.jsx("button",{type:"button",className:"user-mobile-delete",onClick:()=>he(I.id),disabled:I.user_type==="admin","aria-label":"Hapus User",children:e.jsx("i",{className:"bi bi-trash"})})]})]},I.id))}),e.jsx("div",{className:"user-table-footer",children:e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-database"}),e.jsxs("span",{children:[i.length," user ditampilkan"]})]})})]})]}),d&&i.length>0&&e.jsx("div",{className:"user-operation-loading",children:e.jsxs("div",{children:[e.jsx("span",{className:"spinner-border spinner-border-sm"}),e.jsx("span",{children:"Memperbarui data..."})]})}),ie]})},yr=[{id:1,name:"Agus Ismail, S.T., M.B.A.",position:"Direktur",expertise:"HR & Sales Expert",level:"director",image:"/images/tim/agus_ismail.jpg",icon:"bi-person-badge"},{id:2,name:"Ratna Kosasih, S.Si., M.Sc.",position:"General Manager",level:"manager",image:"/images/tim/bu_ratna_gm.jpeg",icon:"bi-person-workspace"},{id:3,name:"Julia Nur Maulida, M.Pd.",position:"Business Executive",level:"staff",image:"/images/tim/julia.jpeg",icon:"bi-briefcase"},{id:4,name:"Rindra Rahmatulloh, S.T.",position:"Project Officer",level:"staff",image:"/images/tim/rindra.jpeg",icon:"bi-kanban"},{id:5,name:"Nurul Fauziyah Jaenudin, S.A.B.",position:"Digital Marketer",level:"staff",image:"/images/tim/fauziyah.jpg",icon:"bi-megaphone"}],ON=["Menyelenggarakan program pelatihan bahasa, budaya, dan keterampilan kerja sesuai standar kebutuhan industri di Jepang.","Memberikan pendampingan menyeluruh kepada peserta, mulai dari tahap pendaftaran, pelatihan, hingga proses penyaluran kerja.","Menjalin kerja sama dengan perusahaan dan institusi di Jepang untuk menciptakan peluang kerja yang luas dan berkelanjutan.","Membangun generasi muda Indonesia yang disiplin, profesional, serta memiliki etos kerja dan integritas tinggi.","Memberikan layanan pendidikan dan penyaluran kerja yang transparan, aman, dan terpercaya."],ud=({member:i,number:l})=>e.jsxs("article",{className:"about-team-card",children:[e.jsxs("div",{className:"about-team-photo",children:[e.jsx("img",{src:i.image,alt:`${i.name} - ${i.position}`,loading:l===1?"eager":"lazy"}),e.jsx("div",{className:"about-team-photo-overlay","aria-hidden":"true"}),e.jsx("span",{className:"about-team-number",children:String(l).padStart(2,"0")}),e.jsx("div",{className:"about-team-role-icon",children:e.jsx("i",{className:`bi ${i.icon}`,"aria-hidden":"true"})})]}),e.jsxs("div",{className:"about-team-info",children:[e.jsx("span",{className:"about-team-position",children:i.position}),e.jsx("h3",{children:i.name}),i.expertise&&e.jsx("p",{className:"about-team-expertise",children:i.expertise}),e.jsx("div",{className:"about-team-line"}),e.jsxs("div",{className:"about-team-brand",children:[e.jsx("i",{className:"bi bi-building-check","aria-hidden":"true"}),e.jsx("span",{children:"FITALENTA"})]})]})]}),LN=()=>{const i=yr.find(o=>o.level==="director"),l=yr.find(o=>o.level==="manager"),d=yr.filter(o=>o.level==="staff");return e.jsxs("main",{className:"about-page",children:[e.jsxs("section",{className:"about-hero","aria-label":"Tentang FITALENTA",children:[e.jsx("div",{className:"about-hero-background","aria-hidden":"true"}),e.jsx("div",{className:"about-container about-hero-inner",children:e.jsxs("div",{className:"about-hero-content",children:[e.jsxs("div",{className:"about-eyebrow about-eyebrow-light",children:[e.jsx("i",{className:"bi bi-building","aria-hidden":"true"}),e.jsx("span",{children:"ABOUT FITALENTA"})]}),e.jsxs("h1",{children:["Mengenal FITALENTA",e.jsx("span",{children:" lebih dekat"})]}),e.jsx("p",{children:"Mengenal perjalanan, tujuan, serta tim yang mendampingi peserta dalam mempersiapkan langkah menuju dunia kerja internasional."}),e.jsxs("div",{className:"about-hero-highlights",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-mortarboard","aria-hidden":"true"}),e.jsx("span",{children:"Pelatihan terarah"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-people","aria-hidden":"true"}),e.jsx("span",{children:"Pendampingan peserta"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-globe2","aria-hidden":"true"}),e.jsx("span",{children:"Persiapan karier global"})]})]})]})})]}),e.jsx("section",{className:"about-intro-section",children:e.jsx("div",{className:"about-container",children:e.jsxs("div",{className:"about-intro-grid",children:[e.jsxs("div",{className:"about-intro-content",children:[e.jsxs("div",{className:"about-eyebrow",children:[e.jsx("i",{className:"bi bi-stars","aria-hidden":"true"}),e.jsx("span",{children:"WHO WE ARE"})]}),e.jsx("h2",{children:"Mempersiapkan talenta Indonesia untuk kesempatan yang lebih luas"}),e.jsxs("p",{children:[e.jsx("strong",{children:"FITALENTA"})," adalah lembaga pelatihan dan penyaluran kerja yang berfokus pada persiapan serta pendampingan individu untuk berkarier di Jepang. Kami menyediakan program pelatihan yang komprehensif mencakup bahasa, budaya, serta pengembangan keterampilan sehingga setiap peserta memiliki kesiapan yang lebih baik dalam menghadapi dunia kerja internasional."]}),e.jsx("p",{children:"Dengan komitmen terhadap kualitas pendidikan dan integritas profesional, FITALENTA tidak hanya menjembatani peserta dengan peluang, tetapi juga mendorong pertumbuhan pribadi, kedisiplinan, kemampuan profesional, dan pemahaman lintas budaya."}),e.jsxs("div",{className:"about-intro-values",children:[e.jsxs("div",{children:[e.jsx("span",{className:"about-value-icon",children:e.jsx("i",{className:"bi bi-shield-check","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Profesional"}),e.jsx("small",{children:"Proses pembinaan yang terarah dan bertanggung jawab"})]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"about-value-icon",children:e.jsx("i",{className:"bi bi-person-check","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("strong",{children:"Berorientasi pada peserta"}),e.jsx("small",{children:"Pendampingan sesuai tahap perjalanan peserta"})]})]})]})]}),e.jsxs("div",{className:"about-intro-visual",children:[e.jsxs("div",{className:"about-intro-image",children:[e.jsx("img",{src:"/images/fitalenta_training.jpg",alt:"Kegiatan pelatihan FITALENTA"}),e.jsx("div",{className:"about-image-overlay","aria-hidden":"true"}),e.jsxs("div",{className:"about-image-caption",children:[e.jsx("span",{children:"FITALENTA"}),e.jsx("strong",{children:"Prepare • Develop • Grow"})]})]}),e.jsxs("div",{className:"about-floating-card",children:[e.jsx("div",{className:"about-floating-icon",children:e.jsx("i",{className:"bi bi-compass","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("small",{children:"OUR PURPOSE"}),e.jsx("strong",{children:"Menghubungkan potensi dengan peluang"})]})]})]})]})})}),e.jsx("section",{className:"about-vision-section",children:e.jsxs("div",{className:"about-container",children:[e.jsxs("div",{className:"about-section-heading",children:[e.jsxs("div",{className:"about-eyebrow",children:[e.jsx("i",{className:"bi bi-compass","aria-hidden":"true"}),e.jsx("span",{children:"OUR DIRECTION"})]}),e.jsx("h2",{children:"Visi & Misi Kami"}),e.jsx("p",{children:"Pedoman yang menjadi dasar dalam setiap langkah dan pelayanan FITALENTA."})]}),e.jsxs("div",{className:"about-vision-grid",children:[e.jsxs("article",{className:"about-vision-card about-vision-card-main",children:[e.jsxs("div",{className:"about-vision-card-top",children:[e.jsx("div",{className:"about-vision-icon",children:e.jsx("i",{className:"bi bi-eye","aria-hidden":"true"})}),e.jsx("span",{children:"01"})]}),e.jsx("div",{className:"about-vision-label",children:"VISI FITALENTA"}),e.jsx("h3",{children:"Menciptakan talenta yang siap bersaing secara global"}),e.jsx("p",{children:"Menjadi lembaga pelatihan dan penyaluran kerja terpercaya yang mampu mencetak sumber daya manusia Indonesia yang terampil, berdaya saing global, dan berintegritas tinggi, khususnya untuk kesempatan kerja di Jepang."}),e.jsx("div",{className:"about-vision-decoration","aria-hidden":"true"})]}),e.jsxs("article",{className:"about-mission-card",children:[e.jsxs("div",{className:"about-mission-header",children:[e.jsx("div",{className:"about-vision-icon about-mission-icon",children:e.jsx("i",{className:"bi bi-bullseye","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("span",{children:"MISI FITALENTA"}),e.jsx("h3",{children:"Langkah nyata menuju visi kami"})]})]}),e.jsx("div",{className:"about-mission-list",children:ON.map((o,u)=>e.jsxs("div",{className:"about-mission-item",children:[e.jsx("span",{className:"about-mission-number",children:String(u+1).padStart(2,"0")}),e.jsx("p",{children:o})]},o))})]})]})]})}),e.jsx("section",{className:"about-team-section",children:e.jsxs("div",{className:"about-container",children:[e.jsxs("div",{className:"about-team-heading",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"about-eyebrow",children:[e.jsx("i",{className:"bi bi-people","aria-hidden":"true"}),e.jsx("span",{children:"MEET OUR TEAM"})]}),e.jsx("h2",{children:"Tim di balik FITALENTA"}),e.jsx("p",{children:"Profesional yang bekerja bersama untuk menjalankan program, pelayanan, dan pengembangan FITALENTA."})]}),e.jsxs("div",{className:"about-team-count",children:[e.jsx("strong",{children:String(yr.length).padStart(2,"0")}),e.jsx("span",{children:"Core Team"})]})]}),e.jsxs("div",{className:"about-team-group",children:[e.jsx("div",{className:"about-team-group-heading",children:e.jsxs("div",{children:[e.jsx("span",{children:"LEADERSHIP"}),e.jsx("strong",{children:"Management Team"})]})}),e.jsxs("div",{className:"about-team-leadership-grid",children:[i&&e.jsx("div",{className:"about-team-director",children:e.jsx(ud,{member:i,number:1})}),l&&e.jsx("div",{className:"about-team-manager",children:e.jsx(ud,{member:l,number:2})})]})]}),e.jsxs("div",{className:"about-team-group about-team-operational",children:[e.jsx("div",{className:"about-team-group-heading",children:e.jsxs("div",{children:[e.jsx("span",{children:"CORE TEAM"}),e.jsx("strong",{children:"Operational Team"})]})}),e.jsx("div",{className:"about-team-staff-grid",children:d.map((o,u)=>e.jsx(ud,{member:o,number:u+3},o.id))})]})]})})]})},PN=()=>{const[i,l]=j.useState(0),d="6281110119273",o="Halo Fitalenta, saya ingin bertanya tentang program magang. Bisakah Anda memberikan informasi lebih lanjut?",u=(b=null)=>{const A=`https://wa.me/${d}?text=${encodeURIComponent(b||o)}`;window.open(A,"_blank","noopener,noreferrer")},h=[{icon:"bi-geo-alt",title:"Alamat Kantor",eyebrow:"Kunjungi Kami",content:"Jl. Ganesha No.15E, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132",link:"https://maps.app.goo.gl/HizqPRwZXnyn9S5p8",actionLabel:"Buka di Google Maps",featured:!0},{icon:"bi-clock",title:"Jam Operasional",eyebrow:"Waktu Pelayanan",content:`Senin - Jumat
08:00 - 17:00 WIB`,actionLabel:null},{icon:"bi-telephone",title:"Telepon",eyebrow:"Hubungi Langsung",content:"+62 811 1011 9273",link:"tel:+6281110119273",actionLabel:"Hubungi sekarang"},{icon:"bi-whatsapp",title:"WhatsApp",eyebrow:"Chat Dengan Kami",content:"+62 811 1011 9273",onClick:()=>u(),actionLabel:"Mulai percakapan",type:"whatsapp"},{icon:"bi-envelope",title:"Email",eyebrow:"Kirim Pesan",content:"info@fitalenta.co.id",link:"mailto:info@fitalenta.co.id",actionLabel:"Kirim email"}],p=[{name:"Facebook",username:"PT FAST Indo Talenta",icon:"bi-facebook",url:"https://www.facebook.com/people/PT-FAST-Indo-Talenta/61550075167981/"},{name:"Instagram",username:"@fitalenta.id",icon:"bi-instagram",url:"https://www.instagram.com/fitalenta.id/"},{name:"LinkedIn",username:"FITALENTA",icon:"bi-linkedin",url:"https://www.facebook.com/people/PT-FAST-Indo-Talenta/61550075167981/"}],x=[{question:"Bagaimana cara mendaftar program pelatihan?",answer:"Anda dapat mendaftar melalui website kami dengan mengisi formulir pendaftaran online. Jika membutuhkan informasi tambahan, Anda juga dapat menghubungi tim FITALENTA melalui WhatsApp atau datang langsung ke kantor kami"},{question:"Berapa lama durasi pelatihan?",answer:"Durasi pelatihan bervariasi tergantung program, mulai dari 6 bulan. Detail durasi dan jadwal masing-masing program dapat dilihat pada halaman Program"},{question:"Apakah ada jaminan penempatan kerja?",answer:"Kami memberikan jaminan penempatan kerja bagi peserta yang telah menyelesaikan pelatihan dengan baik serta memenuhi seluruh persyaratan program"},{question:"Bagaimana sistem pembayaran biaya pelatihan?",answer:"Pembayaran dapat dilakukan secara bertahap. DP dilakukan saat pendaftaran dan pelunasan sebelum keberangkatan. Tersedia juga opsi cicilan sesuai ketentuan program"}],y=b=>{l(v=>v===b?null:b)},f=b=>b.split(`
`).map((v,A)=>e.jsxs(Sd.Fragment,{children:[v,A<b.split(`
`).length-1&&e.jsx("br",{})]},`${v}-${A}`));return e.jsxs("div",{className:"contact-page",children:[e.jsxs("section",{className:"contact-hero",children:[e.jsx("div",{className:"contact-hero-background","aria-hidden":"true"}),e.jsxs("div",{className:"contact-container contact-hero-container",children:[e.jsxs("div",{className:"contact-hero-content",children:[e.jsxs("div",{className:"contact-hero-eyebrow",children:[e.jsx("i",{className:"bi bi-headset","aria-hidden":"true"}),e.jsx("span",{children:"PUSAT INFORMASI FITALENTA"})]}),e.jsxs("h1",{children:["Kami Siap Membantu",e.jsx("span",{children:" Perjalanan Anda"})]}),e.jsx("p",{children:"Punya pertanyaan tentang program, proses pendaftaran, pembayaran, atau keberangkatan? Hubungi tim FITALENTA melalui channel yang paling nyaman untuk Anda"}),e.jsxs("div",{className:"contact-hero-actions",children:[e.jsxs("button",{type:"button",className:"contact-primary-btn",onClick:()=>u(),children:[e.jsx("i",{className:"bi bi-whatsapp","aria-hidden":"true"}),e.jsx("span",{children:"Chat WhatsApp"}),e.jsx("i",{className:"bi bi-arrow-up-right","aria-hidden":"true"})]}),e.jsxs("a",{href:"mailto:info@fitalenta.co.id",className:"contact-secondary-btn",children:[e.jsx("i",{className:"bi bi-envelope","aria-hidden":"true"}),e.jsx("span",{children:"Kirim Email"})]})]}),e.jsxs("div",{className:"contact-hero-benefits",children:[e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-geo-alt","aria-hidden":"true"}),e.jsx("span",{children:"Bandung, Jawa Barat"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-clock","aria-hidden":"true"}),e.jsx("span",{children:"Senin - Jumat"})]}),e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-shield-check","aria-hidden":"true"}),e.jsx("span",{children:"Informasi resmi FITALENTA"})]})]})]}),e.jsxs("div",{className:"contact-hero-support-card",children:[e.jsxs("div",{className:"contact-support-status",children:[e.jsx("span",{className:"contact-support-status-dot"}),e.jsx("span",{children:"Tim FITALENTA"})]}),e.jsx("div",{className:"contact-support-icon",children:e.jsx("i",{className:"bi bi-chat-heart","aria-hidden":"true"})}),e.jsx("h2",{children:"Ada yang ingin ditanyakan?"}),e.jsx("p",{children:"Tim kami akan membantu memberikan informasi sesuai kebutuhan Anda"}),e.jsx("div",{className:"contact-support-divider"}),e.jsxs("div",{className:"contact-support-item",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-whatsapp","aria-hidden":"true"})}),e.jsxs("span",{children:[e.jsx("small",{children:"WhatsApp"}),e.jsx("strong",{children:"+62 811 1011 9273"})]})]}),e.jsxs("div",{className:"contact-support-item",children:[e.jsx("div",{children:e.jsx("i",{className:"bi bi-envelope","aria-hidden":"true"})}),e.jsxs("span",{children:[e.jsx("small",{children:"Email"}),e.jsx("strong",{children:"info@fitalenta.co.id"})]})]})]})]})]}),e.jsx("section",{className:"contact-information-section",children:e.jsxs("div",{className:"contact-container",children:[e.jsxs("div",{className:"contact-section-heading",children:[e.jsxs("div",{className:"contact-section-heading-text",children:[e.jsxs("span",{className:"contact-section-eyebrow",children:[e.jsx("i",{className:"bi bi-chat-dots","aria-hidden":"true"}),"HUBUNGI KAMI"]}),e.jsx("h2",{children:"Pilih Cara Terbaik untuk Menghubungi Kami"}),e.jsx("p",{children:"Gunakan salah satu channel berikut untuk mendapatkan informasi atau bantuan dari tim FITALENTA"})]}),e.jsxs("div",{className:"contact-section-note",children:[e.jsx("i",{className:"bi bi-info-circle","aria-hidden":"true"}),e.jsx("span",{children:"Untuk respons yang lebih cepat, kami menyarankan menghubungi melalui WhatsApp"})]})]}),e.jsx("div",{className:"contact-info-grid",children:h.map((b,v)=>e.jsxs("article",{className:`contact-info-card ${b.featured?"featured":""} ${b.type==="whatsapp"?"whatsapp":""}`,children:[e.jsxs("div",{className:"contact-info-card-top",children:[e.jsx("div",{className:"contact-info-icon",children:e.jsx("i",{className:`bi ${b.icon}`,"aria-hidden":"true"})}),b.type==="whatsapp"&&e.jsx("span",{className:"contact-recommended-badge",children:"Direkomendasikan"})]}),e.jsxs("div",{className:"contact-info-content",children:[e.jsx("small",{children:b.eyebrow}),e.jsx("h3",{children:b.title}),e.jsx("p",{children:f(b.content)})]}),b.link&&e.jsxs("a",{href:b.link,target:b.link.startsWith("http")?"_blank":void 0,rel:b.link.startsWith("http")?"noopener noreferrer":void 0,className:"contact-info-action",children:[e.jsx("span",{children:b.actionLabel}),e.jsx("i",{className:"bi bi-arrow-up-right","aria-hidden":"true"})]}),b.onClick&&e.jsxs("button",{type:"button",onClick:b.onClick,className:"contact-info-action",children:[e.jsx("span",{children:b.actionLabel}),e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})]})]},`${b.title}-${v}`))}),e.jsxs("div",{className:"contact-social-wrapper",children:[e.jsxs("div",{className:"contact-social-heading",children:[e.jsx("div",{className:"contact-social-icon",children:e.jsx("i",{className:"bi bi-share","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("span",{children:"IKUTI PERKEMBANGAN KAMI"}),e.jsx("h3",{children:"Terhubung dengan FITALENTA"})]})]}),e.jsx("div",{className:"contact-social-list",children:p.map((b,v)=>e.jsxs("a",{href:b.url,target:"_blank",rel:"noopener noreferrer",className:"contact-social-item","aria-label":`Kunjungi ${b.name} FITALENTA`,children:[e.jsx("div",{className:"contact-social-item-icon",children:e.jsx("i",{className:`bi ${b.icon}`,"aria-hidden":"true"})}),e.jsxs("div",{className:"contact-social-item-content",children:[e.jsx("small",{children:b.name}),e.jsx("strong",{children:b.username})]}),e.jsx("i",{className:"bi bi-arrow-up-right contact-social-arrow","aria-hidden":"true"})]},`${b.name}-${v}`))})]})]})}),e.jsx("section",{className:"contact-location-section",children:e.jsx("div",{className:"contact-container",children:e.jsxs("div",{className:"contact-location-layout",children:[e.jsxs("div",{className:"contact-location-content",children:[e.jsxs("span",{className:"contact-section-eyebrow",children:[e.jsx("i",{className:"bi bi-pin-map","aria-hidden":"true"}),"LOKASI KANTOR"]}),e.jsx("h2",{children:"Kunjungi Kantor FITALENTA"}),e.jsx("p",{children:"Anda juga dapat datang langsung ke kantor kami untuk konsultasi dan mendapatkan informasi lebih lengkap mengenai program FITALENTA"}),e.jsxs("div",{className:"contact-location-address",children:[e.jsx("div",{className:"contact-location-address-icon",children:e.jsx("i",{className:"bi bi-building","aria-hidden":"true"})}),e.jsxs("div",{children:[e.jsx("small",{children:"KANTOR PUSAT FITALENTA"}),e.jsx("strong",{children:"Gedung Science Techno Park ITB"}),e.jsx("span",{children:"Jl. Ganesha No.15E, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132"})]})]}),e.jsx("div",{className:"contact-location-hours",children:e.jsxs("div",{children:[e.jsx("i",{className:"bi bi-calendar-week"}),e.jsxs("span",{children:[e.jsx("small",{children:"Senin - Jumat"}),e.jsx("strong",{children:"08:00 - 17:00 WIB"})]})]})}),e.jsxs("a",{href:"https://maps.app.goo.gl/HizqPRwZXnyn9S5p8",target:"_blank",rel:"noopener noreferrer",className:"contact-map-button",children:[e.jsx("i",{className:"bi bi-geo-alt","aria-hidden":"true"}),e.jsx("span",{children:"Buka di Google Maps"}),e.jsx("i",{className:"bi bi-arrow-up-right","aria-hidden":"true"})]})]}),e.jsxs("div",{className:"contact-map-card",children:[e.jsxs("div",{className:"contact-map-header",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"contact-map-status",children:[e.jsx("i",{className:"bi bi-geo-alt-fill","aria-hidden":"true"}),"Bandung"]}),e.jsx("strong",{children:"Lokasi FITALENTA"})]}),e.jsx("a",{href:"https://maps.app.goo.gl/HizqPRwZXnyn9S5p8",target:"_blank",rel:"noopener noreferrer","aria-label":"Buka lokasi FITALENTA di Google Maps",children:e.jsx("i",{className:"bi bi-box-arrow-up-right","aria-hidden":"true"})})]}),e.jsx("div",{className:"contact-map-frame",children:e.jsx("iframe",{src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.973225068429!2d107.60635507464781!3d-6.893805993105319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e79861a09a0f%3A0x7edcd4dc41c3c5e1!2sGedung%20Science%20and%20Techno%20Park%20(STP)%20ITB!5e0!3m2!1sid!2sid!4v1759550448335!5m2!1sid!2sid",width:"100%",height:"100%",style:{border:0},allowFullScreen:!0,loading:"lazy",referrerPolicy:"no-referrer-when-downgrade",title:"Lokasi Kantor FITALENTA"})})]})]})})}),e.jsx("section",{className:"contact-faq-section",children:e.jsxs("div",{className:"contact-container",children:[e.jsxs("div",{className:"contact-faq-heading",children:[e.jsxs("span",{className:"contact-section-eyebrow",children:[e.jsx("i",{className:"bi bi-question-circle","aria-hidden":"true"}),"FAQ"]}),e.jsx("h2",{children:"Pertanyaan yang Sering Diajukan"}),e.jsx("p",{children:"Temukan jawaban cepat untuk beberapa pertanyaan yang sering ditanyakan calon peserta"})]}),e.jsxs("div",{className:"contact-faq-layout",children:[e.jsx("div",{className:"contact-faq-list",children:x.map((b,v)=>{const A=i===v;return e.jsxs("article",{className:`contact-faq-item ${A?"open":""}`,children:[e.jsxs("button",{type:"button",className:"contact-faq-question",onClick:()=>y(v),"aria-expanded":A,children:[e.jsx("span",{className:"contact-faq-number",children:String(v+1).padStart(2,"0")}),e.jsx("span",{className:"contact-faq-question-text",children:b.question}),e.jsx("span",{className:"contact-faq-toggle",children:e.jsx("i",{className:`bi ${A?"bi-dash-lg":"bi-plus-lg"}`,"aria-hidden":"true"})})]}),A&&e.jsxs("div",{className:"contact-faq-answer",children:[e.jsx("div",{className:"contact-faq-answer-line"}),e.jsx("p",{children:b.answer})]})]},`${b.question}-${v}`)})}),e.jsxs("aside",{className:"contact-faq-help",children:[e.jsx("div",{className:"contact-faq-help-icon",children:e.jsx("i",{className:"bi bi-chat-square-dots","aria-hidden":"true"})}),e.jsx("span",{children:"BELUM MENEMUKAN JAWABAN?"}),e.jsx("h3",{children:"Tanyakan langsung kepada tim kami"}),e.jsx("p",{children:"Kami siap membantu menjawab pertanyaan lain seputar program dan pendaftaran FITALENTA"}),e.jsxs("button",{type:"button",onClick:()=>u("Halo Fitalenta, saya memiliki pertanyaan yang belum tercantum pada FAQ. Bisakah Anda membantu?"),children:[e.jsx("i",{className:"bi bi-whatsapp","aria-hidden":"true"}),e.jsx("span",{children:"Tanya via WhatsApp"})]})]})]})]})}),e.jsx("section",{className:"contact-cta-section",children:e.jsx("div",{className:"contact-container",children:e.jsxs("div",{className:"contact-cta-card",children:[e.jsx("div",{className:"contact-cta-decoration contact-cta-decoration-one"}),e.jsx("div",{className:"contact-cta-decoration contact-cta-decoration-two"}),e.jsxs("div",{className:"contact-cta-content",children:[e.jsx("span",{children:"MASIH ADA PERTANYAAN?"}),e.jsx("h2",{children:"Kami Siap Membantu Anda"}),e.jsx("p",{children:"Jangan ragu untuk menghubungi tim FITALENTA sebelum memulai proses pendaftaran Anda"})]}),e.jsxs("div",{className:"contact-cta-actions",children:[e.jsxs("button",{type:"button",onClick:()=>u("Halo Fitalenta, saya masih ada pertanyaan tentang program magang. Bisakah Anda membantu?"),className:"contact-cta-whatsapp",children:[e.jsx("i",{className:"bi bi-whatsapp","aria-hidden":"true"}),e.jsx("span",{children:"Chat WhatsApp"}),e.jsx("i",{className:"bi bi-arrow-right","aria-hidden":"true"})]}),e.jsxs("a",{href:"mailto:info@fitalenta.co.id",className:"contact-cta-email",children:[e.jsx("i",{className:"bi bi-envelope","aria-hidden":"true"}),e.jsx("span",{children:"Kirim Email"})]})]})]})})})]})},UN="https://n8n-6xr7vvprsosz.jkt6.sumopod.my.id/webhook/fitalenta-chat",zN=async({message:i,sessionId:l,history:d})=>{try{const o=await fetch(UN,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({message:i,chatInput:i,question:i,sessionId:l,history:d})});if(!o.ok){let u="Gagal menghubungi FITALENTA AI.";try{const h=await o.json();u=h?.message||h?.error||u}catch{}throw new Error(u)}return await o.json()}catch(o){throw console.error("FITALENTA AI service error:",o),o}},Nd="fitalenta_chat_session",kd="fitalenta_chat_history",Er={id:"welcome-message",sender:"bot",text:"Halo! Saya FITALENTA AI Assistant. Ada yang bisa saya bantu seputar layanan konsultasi, program pelatihan, atau panduan pengembangan karier Anda?"},md=`Mohon maaf, saya belum dapat menjawab pertanyaan Anda dengan tepat.

Untuk mendapatkan informasi yang lebih lengkap dan sesuai kebutuhan Anda, silakan hubungi tim FITALENTA melalui WhatsApp.`,BN="https://wa.me/6281110119273",FN="+62 811-1011-9273",Tf="info@fitalenta.co.id",HN=["Apakah program tersedia secara online?","Bagaimana cara mendaftar?","Apa saja program yang tersedia?"],IN=()=>{let i=localStorage.getItem(Nd);return i||(typeof crypto<"u"&&typeof crypto.randomUUID=="function"?i=crypto.randomUUID():i=Date.now().toString(36)+Math.random().toString(36).substring(2),localStorage.setItem(Nd,i)),i},KN=()=>{try{const i=localStorage.getItem(kd);if(!i)return[Er];const l=JSON.parse(i);return!Array.isArray(l)||l.length===0?[Er]:l}catch(i){return console.error("Gagal membaca riwayat chatbot:",i),[Er]}},hd=(i,l)=>({id:Date.now()+Math.random().toString(36).substring(2),sender:i,text:l}),Ng=i=>i.filter(l=>l.id!=="welcome-message").slice(-12).map(l=>({role:l.sender==="user"?"user":"assistant",content:l.text})),qN=i=>i?typeof i=="string"?i:[i.reply,i.answer,i.message,i.text,i.response,i.output,i.result,i.data?.reply,i.data?.answer,i.data?.message,i.data?.text,i.data?.response,i.data?.output,i.result?.reply,i.result?.answer,i.result?.message,i.result?.text,i.result?.response].find(o=>typeof o=="string"&&o.trim().length>0)||null:null,GN=i=>{if(!i)return!0;const l=i.toLowerCase().replace(/\s+/g," ").trim();return["belum dapat memberikan jawaban","belum bisa memberikan jawaban","belum dapat menjawab","belum bisa menjawab","belum dapat memberikan informasi","belum bisa memberikan informasi","tidak dapat memberikan jawaban","tidak bisa memberikan jawaban","tidak dapat menjawab","tidak bisa menjawab","tidak menemukan jawaban","belum menemukan jawaban","informasi yang lebih jelas","informasi tersebut tidak tersedia","informasi tersebut belum tersedia","agar mendapatkan informasi yang lebih jelas","hubungi tim fitalenta","hubungi fitalenta","hubungi tim fitalenta melalui whatsapp","melalui whatsapp","silakan hubungi","maaf, saya belum","maaf saya belum","maaf, saya tidak","maaf saya tidak"].some(o=>l.includes(o))},Us=(i,l)=>{const d=i.toLowerCase();return l.some(o=>d.includes(o.toLowerCase()))},$N=i=>{for(let l=i.length-1;l>=0;l--)if(i[l].sender==="user")return i[l].text;return""},YN=i=>{for(let l=i.length-1;l>=0;l--)if(i[l].sender==="bot")return i[l].text;return""},VN=(i,l)=>{const d=i.trim();if(!d)return d;if(l.length<=1)return`
${d}

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jawab langsung sesuai pertanyaan.
- Gunakan paragraf pendek.
- Jika terdapat beberapa pilihan, gunakan daftar bullet.
- Jika terdapat langkah atau urutan, gunakan daftar bernomor.
- Jangan menggunakan tabel Markdown.
- Jangan mengulang informasi yang tidak diperlukan.
`.trim();const o=$N(l),u=YN(l),h=Ng(l),p=Us(d,["programnya","program apa","program apa saja","programnya apa","apa saja program","yang mana","yang tersedia"]),x=Us(o,["online","daring","secara online","online atau tidak"]);return p&&x?`
Konteks percakapan sebelumnya:
Pengguna sebelumnya bertanya:
"${o}"

Jawaban AI sebelumnya:
"${u}"

Pertanyaan pengguna sekarang:
"${d}"

Pahami pertanyaan sekarang sebagai pertanyaan lanjutan dari percakapan sebelumnya. Karena pengguna sebelumnya sedang membahas ketersediaan program secara online, maka ketika pengguna bertanya "apa saja programnya", maksudnya adalah program yang tersedia secara online, bukan seluruh program FITALENTA.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jawab langsung dan fokus pada konteks percakapan sebelumnya.
- Jika terdapat beberapa program, gunakan daftar bernomor atau bullet.
- Gunakan paragraf pendek.
- Jangan menggunakan tabel Markdown.
`.trim():Us(d,["yang online","online yang mana","bisa online","secara online","yang daring","daring yang mana"])&&o?`
Konteks percakapan sebelumnya:
"${o}"

Jawaban AI sebelumnya:
"${u}"

Pertanyaan pengguna sekarang:
"${d}"

Pahami pertanyaan ini sebagai pertanyaan lanjutan terhadap topik sebelumnya dan fokuskan jawaban hanya pada pilihan yang tersedia secara online.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan bullet jika terdapat beberapa pilihan.
- Gunakan paragraf pendek.
- Jangan mengulang informasi yang tidak diperlukan.
`.trim():Us(d,["berapa biayanya","berapa harganya","biayanya berapa","harganya berapa","berapa biaya","berapa harga","biaya","harga"])&&o?`
Konteks percakapan sebelumnya:
"${o}"

Jawaban AI sebelumnya:
"${u}"

Pertanyaan pengguna sekarang:
"${d}"

Pahami pertanyaan ini sebagai pertanyaan lanjutan terhadap program atau layanan yang sedang dibahas sebelumnya. Berikan biaya untuk konteks program atau layanan tersebut, bukan seluruh daftar harga FITALENTA.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jika terdapat beberapa biaya, gunakan daftar bernomor atau bullet.
- Gunakan paragraf pendek.
`.trim():Us(d,["cara daftar","bagaimana daftarnya","cara mendaftar","bagaimana cara mendaftar","daftarnya bagaimana"])&&o?`
Konteks percakapan sebelumnya:
"${o}"

Jawaban AI sebelumnya:
"${u}"

Pertanyaan pengguna sekarang:
"${d}"

Jelaskan cara mendaftar untuk program atau layanan yang sedang dibahas sebelumnya.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Jika menjelaskan tahapan, gunakan daftar bernomor.
- Gunakan kalimat yang singkat dan jelas.
`.trim():Us(d,["tadi","sebelumnya","yang itu","yang tadi","kalau itu","kalau yang tadi","tersebut","program tersebut","yang dimaksud","bagaimana dengan itu","kalau yang ini"])&&o?`
Konteks percakapan sebelumnya:
Pertanyaan pengguna:
"${o}"

Jawaban AI:
"${u}"

Pertanyaan pengguna sekarang:
"${d}"

Jawab sebagai kelanjutan dari percakapan sebelumnya. Jangan memulai topik baru dan jangan meminta pengguna mengulangi informasi yang sudah diberikan.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan daftar bullet atau nomor jika sesuai.
- Gunakan paragraf pendek.
`.trim():`
Konteks percakapan sebelumnya:
${JSON.stringify(h,null,2)}

Pertanyaan pengguna sekarang:
"${d}"

Jawab dengan mempertimbangkan konteks percakapan sebelumnya.

Instruksi jawaban:
- Gunakan Bahasa Indonesia yang baik, jelas, sopan, dan sesuai kaidah EYD.
- Gunakan paragraf pendek.
- Gunakan daftar bullet untuk beberapa pilihan atau item.
- Gunakan daftar bernomor untuk langkah atau urutan.
- Jawab secara langsung dan tidak bertele-tele.
`.trim()},Nr=i=>{const l=/(https?:\/\/[^\s]+|wa\.me\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;return i.split(l).map((o,u)=>{if(/^https?:\/\//i.test(o)){const p=o.replace(/[.,!?;:]$/,"");return e.jsx("a",{href:p,target:"_blank",rel:"noopener noreferrer",className:"fitalenta-chat-link",children:p},u)}if(/^wa\.me\//i.test(o)){const p=o.replace(/[.,!?;:]$/,"");return e.jsx("a",{href:`https://${p}`,target:"_blank",rel:"noopener noreferrer",className:"fitalenta-chat-link",children:p},u)}return/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(o)?e.jsx("a",{href:`mailto:${o}`,className:"fitalenta-chat-link",children:o},u):o.split(/(\*\*[^*]+\*\*|__[^_]+__)/).map((p,x)=>p.startsWith("**")&&p.endsWith("**")||p.startsWith("__")&&p.endsWith("__")?e.jsx("strong",{children:p.slice(2,-2)},`${u}-${x}`):e.jsx("span",{children:p},`${u}-${x}`))})},JN=i=>{if(!i)return null;const d=i.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim().split(`
`),o=[];let u=[],h=[];const p=()=>{u.length!==0&&(o.push(e.jsx("ul",{className:"fitalenta-chat-list",children:u.map((y,f)=>e.jsx("li",{children:Nr(y)},f))},`bullet-${o.length}`)),u=[])},x=()=>{h.length!==0&&(o.push(e.jsx("ol",{className:"fitalenta-chat-list",children:h.map((y,f)=>e.jsx("li",{children:Nr(y)},f))},`number-${o.length}`)),h=[])};return d.forEach(y=>{const f=y.trim();if(!f){p(),x();return}const b=f.match(/^(?:[-*•])\s+(.+)$/);if(b){x(),u.push(b[1].trim());return}const v=f.match(/^\d+[.)]\s+(.+)$/);if(v){p(),h.push(v[1].trim());return}p(),x();const A=f.match(/^(#{1,3})\s+(.+)$/);if(A){o.push(e.jsx("strong",{className:"fitalenta-chat-heading",children:Nr(A[2])},`heading-${o.length}`));return}const P=f.match(/^\*\*(.+)\*\*$/);if(P){o.push(e.jsx("strong",{className:"fitalenta-chat-heading",children:P[1]},`strong-${o.length}`));return}o.push(e.jsx("p",{className:"fitalenta-chat-paragraph",children:Nr(f)},`paragraph-${o.length}`))}),p(),x(),o},XN=()=>e.jsxs("div",{className:"fitalenta-chat-fallback",children:[e.jsx("p",{className:"fitalenta-chat-paragraph",children:"Mohon maaf, saya belum dapat menjawab pertanyaan Anda dengan tepat."}),e.jsx("p",{className:"fitalenta-chat-paragraph",children:"Untuk mendapatkan informasi yang lebih lengkap dan sesuai kebutuhan Anda, silakan hubungi tim FITALENTA melalui WhatsApp."}),e.jsx("div",{className:"fitalenta-chat-whatsapp-info",children:e.jsxs("span",{children:["WhatsApp:"," ",FN]})}),e.jsxs("a",{href:BN,target:"_blank",rel:"noopener noreferrer",className:"fitalenta-chat-whatsapp-button",children:[e.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("path",{d:"M20.5 11.3a8.4 8.4 0 0 1-12.4 7.3L4 20l1.4-4a8.4 8.4 0 1 1 15.1-4.7Z",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M8.7 8.4c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.3.1.5-.1.7l-.4.5c-.1.1-.1.3 0 .5.4.7 1 1.3 1.7 1.8.6.4 1.1.6 1.5.7.2 0 .3 0 .4-.2l.5-.6c.2-.2.4-.2.7-.1l1.4.6c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.4.3-.9.5-1.4.5-.8 0-1.9-.3-3.2-1.1-1.1-.7-2.1-1.7-2.8-2.8-.8-1.3-1.1-2.4-1.1-3.2 0-.5.2-1 .5-1.4Z",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),e.jsx("span",{children:"Chat via WhatsApp"})]}),e.jsxs("p",{className:"fitalenta-chat-fallback-email",children:["Anda juga dapat menghubungi kami melalui email"," ",e.jsx("a",{href:`mailto:${Tf}`,className:"fitalenta-chat-link",children:Tf}),"."]})]}),kr=()=>e.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("rect",{x:"4",y:"6",width:"16",height:"11",rx:"3",fill:"none",stroke:"currentColor",strokeWidth:"1.8"}),e.jsx("path",{d:"M9 11h.01M15 11h.01",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),e.jsx("path",{d:"M9 14h6",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"}),e.jsx("path",{d:"M12 6V4",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),e.jsx("circle",{cx:"12",cy:"3",r:"1",fill:"currentColor"})]}),QN=()=>e.jsxs("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("path",{d:"M4 4l16 8-16 8 3-8-3-8z",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M7 12h13",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),ZN=()=>e.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{d:"M6 6l12 12M18 6L6 18",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),WN=()=>e.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{d:"M6 8h12M8 8V6h8v2M9 8v10M15 8v10M5 8l1 12h12l1-12",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),e0=()=>{const[i,l]=j.useState(!1),[d,o]=j.useState(KN),[u,h]=j.useState(""),[p,x]=j.useState(!1),y=j.useRef(null),f=j.useRef(null);j.useEffect(()=>{try{localStorage.setItem(kd,JSON.stringify(d))}catch(w){console.error("Gagal menyimpan memory chatbot:",w)}},[d]),j.useEffect(()=>{y.current?.scrollIntoView({behavior:"smooth"})},[d,p]),j.useEffect(()=>{if(!i)return;const w=setTimeout(()=>{f.current?.focus()},150);return()=>clearTimeout(w)},[i]);const b=async(w=null)=>{const M=(w!==null?w:u).trim();if(!M||p)return;const H=hd("user",M),_=[...d,H];o(_),h(""),x(!0);try{const E=IN(),L=Ng(_),q=VN(M,d);console.log("FITALENTA AI message:",q),console.log("FITALENTA AI history:",L);const oe=await zN({message:q,sessionId:E,history:L});console.log("FITALENTA AI response:",oe);let re=qN(oe);(!re||GN(re))&&(re=md);const te=hd("bot",re);o(ge=>[...ge,te])}catch(E){console.error("FITALENTA AI error:",E);const L=hd("bot",md);o(q=>[...q,L])}finally{x(!1)}},v=w=>{w.preventDefault(),b()},A=w=>{b(w)},P=()=>{localStorage.removeItem(Nd),localStorage.removeItem(kd),o([Er]),h("")};return e.jsxs("div",{className:"fitalenta-chatbot",children:[!i&&e.jsxs("button",{type:"button",className:"fitalenta-chatbot-launcher",onClick:()=>l(!0),"aria-label":"Buka FITALENTA AI",children:[e.jsx("span",{className:"fitalenta-chatbot-launcher-icon",children:e.jsx(kr,{})}),e.jsx("span",{children:"Tanya FITALENTA AI"})]}),i&&e.jsxs("section",{className:"fitalenta-chatbot-window","aria-label":"FITALENTA AI Assistant",children:[e.jsxs("header",{className:"fitalenta-chatbot-header",children:[e.jsxs("div",{className:"fitalenta-chatbot-header-left",children:[e.jsx("div",{className:"fitalenta-chatbot-avatar",children:e.jsx(kr,{})}),e.jsxs("div",{className:"fitalenta-chatbot-header-title",children:[e.jsx("h2",{children:"FITALENTA AI Assistant"}),e.jsx("span",{children:"Virtual Career Assistant"})]})]}),e.jsxs("div",{className:"fitalenta-chatbot-header-actions",children:[e.jsx("button",{type:"button",onClick:P,"aria-label":"Percakapan baru",title:"Percakapan baru",children:e.jsx(WN,{})}),e.jsx("button",{type:"button",onClick:()=>l(!1),"aria-label":"Tutup chatbot",title:"Tutup",children:e.jsx(ZN,{})})]})]}),e.jsxs("div",{className:"fitalenta-chatbot-messages",children:[d.map(w=>e.jsxs("div",{className:`fitalenta-chat-message-row ${w.sender==="user"?"is-user":"is-bot"}`,children:[w.sender==="bot"&&e.jsx("div",{className:"fitalenta-chat-message-avatar",children:e.jsx(kr,{})}),e.jsx("div",{className:"fitalenta-chat-message-bubble",children:w.sender==="bot"?w.text===md?e.jsx(XN,{}):JN(w.text):w.text})]},w.id)),p&&e.jsxs("div",{className:"fitalenta-chat-message-row is-bot",children:[e.jsx("div",{className:"fitalenta-chat-message-avatar",children:e.jsx(kr,{})}),e.jsxs("div",{className:"fitalenta-chat-typing",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})]}),e.jsx("div",{ref:y})]}),e.jsxs("div",{className:"fitalenta-chatbot-faq",children:[e.jsx("span",{className:"fitalenta-chatbot-faq-label",children:"TOP FAQ:"}),e.jsx("div",{className:"fitalenta-chatbot-faq-list",children:HN.map(w=>e.jsx("button",{type:"button",onClick:()=>A(w),disabled:p,children:w},w))})]}),e.jsxs("form",{className:"fitalenta-chatbot-input-wrapper",onSubmit:v,children:[e.jsx("input",{ref:f,type:"text",value:u,onChange:w=>h(w.target.value),placeholder:"Ketik pertanyaan Anda...",disabled:p,maxLength:1e3,autoComplete:"off"}),e.jsx("button",{type:"submit",disabled:!u.trim()||p,"aria-label":"Kirim pertanyaan",title:"Kirim",children:e.jsx(QN,{})})]})]})]})},Ef=({children:i})=>{const{isAuthenticated:l,isAdmin:d,loading:o}=Wa();return o?e.jsx("div",{className:"d-flex justify-content-center align-items-center min-vh-100",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):l?d?e.jsx(Ji,{to:"/admin",replace:!0}):e.jsx(Ji,{to:"/dashboard",replace:!0}):i},pd=({children:i})=>{const{isAuthenticated:l,isParticipant:d,loading:o}=Wa();return o?e.jsx("div",{className:"d-flex justify-content-center align-items-center min-vh-100",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):!l||!d?e.jsx(Ji,{to:"/login",replace:!0}):i},zs=({children:i})=>{const{isAuthenticated:l,isAdmin:d,loading:o}=Wa();return o?e.jsx("div",{className:"d-flex justify-content-center align-items-center min-vh-100",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):!l||!d?e.jsx(Ji,{to:"/login",replace:!0}):e.jsx(qy,{children:i})},a0=()=>jt().pathname.startsWith("/admin")?null:e.jsx(e0,{});function t0(){return e.jsxs(Hy,{children:[e.jsxs(cy,{children:[e.jsx(_a,{path:"/",element:e.jsx(wt,{children:e.jsx(eN,{})})}),e.jsx(_a,{path:"/programs",element:e.jsx(wt,{children:e.jsx(cN,{})})}),e.jsx(_a,{path:"/program/:id",element:e.jsx(wt,{children:e.jsx(mN,{})})}),e.jsx(_a,{path:"/about-us",element:e.jsx(wt,{children:e.jsx(LN,{})})}),e.jsx(_a,{path:"/contact",element:e.jsx(wt,{children:e.jsx(PN,{})})}),e.jsx(_a,{path:"/login",element:e.jsx(Ef,{children:e.jsx(wt,{children:e.jsx(gN,{})})})}),e.jsx(_a,{path:"/register",element:e.jsx(Ef,{children:e.jsx(wt,{children:e.jsx(bN,{})})})}),e.jsx(_a,{path:"/registration",element:e.jsx(pd,{children:e.jsx(wt,{children:e.jsx(pN,{})})})}),e.jsx(_a,{path:"/dashboard",element:e.jsx(pd,{children:e.jsx(wt,{children:e.jsx(jN,{})})})}),e.jsx(_a,{path:"/payment",element:e.jsx(pd,{children:e.jsx(wt,{children:e.jsx(wN,{})})})}),e.jsx(_a,{path:"/admin",element:e.jsx(zs,{children:e.jsx(SN,{})})}),e.jsx(_a,{path:"/admin/payments",element:e.jsx(zs,{children:e.jsx(AN,{})})}),e.jsx(_a,{path:"/admin/selection-and-placement",element:e.jsx(zs,{children:e.jsx(TN,{})})}),e.jsx(_a,{path:"/admin/financial-reports",element:e.jsx(zs,{children:e.jsx(EN,{})})}),e.jsx(_a,{path:"/admin/programs",element:e.jsx(zs,{children:e.jsx(RN,{})})}),e.jsx(_a,{path:"/admin/users",element:e.jsx(zs,{children:e.jsx(DN,{})})}),e.jsx(_a,{path:"*",element:e.jsx(Ji,{to:"/",replace:!0})})]}),e.jsx(a0,{})]})}const n0="https://try.fitalenta.co.id";de.defaults.baseURL=n0;Kb.createRoot(document.getElementById("root")).render(e.jsx(Sd.StrictMode,{children:e.jsx(My,{children:e.jsx(t0,{})})}));
