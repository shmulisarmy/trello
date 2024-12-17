(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const Ve=(e,t)=>e===t,v=Symbol("solid-proxy"),Y=Symbol("solid-track"),se={equals:Ve};let Oe=Ee;const M=1,ie=2,Pe={owned:null,cleanups:null,context:null,owner:null};var g=null;let _e=null,We=null,h=null,m=null,T=null,ge=0;function re(e,t){const n=h,r=g,s=e.length===0,i=t===void 0?r:t,o=s?Pe:{owned:null,cleanups:null,context:i?i.context:null,owner:i},l=s?e:()=>e(()=>J(()=>ee(o)));g=o,h=null;try{return G(l,!0)}finally{h=n,g=r}}function R(e,t){t=t?Object.assign({},se,t):se;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=s=>(typeof s=="function"&&(s=s(n.value)),Ce(n,s));return[xe.bind(n),r]}function w(e,t,n){const r=pe(e,t,!1,M);te(r)}function Ge(e,t,n){Oe=Ye;const r=pe(e,t,!1,M);r.user=!0,T?T.push(r):te(r)}function ye(e,t,n){n=n?Object.assign({},se,n):se;const r=pe(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,te(r),xe.bind(r)}function X(e){return G(e,!1)}function J(e){if(h===null)return e();const t=h;h=null;try{return e()}finally{h=t}}function He(e){return g===null||(g.cleanups===null?g.cleanups=[e]:g.cleanups.push(e)),e}function Z(){return h}function xe(){if(this.sources&&this.state)if(this.state===M)te(this);else{const e=m;m=null,G(()=>oe(this),!1),m=e}if(h){const e=this.observers?this.observers.length:0;h.sources?(h.sources.push(this),h.sourceSlots.push(e)):(h.sources=[this],h.sourceSlots=[e]),this.observers?(this.observers.push(h),this.observerSlots.push(h.sources.length-1)):(this.observers=[h],this.observerSlots=[h.sources.length-1])}return this.value}function Ce(e,t,n){let r=e.value;return(!e.comparator||!e.comparator(r,t))&&(e.value=t,e.observers&&e.observers.length&&G(()=>{for(let s=0;s<e.observers.length;s+=1){const i=e.observers[s],o=_e&&_e.running;o&&_e.disposed.has(i),(o?!i.tState:!i.state)&&(i.pure?m.push(i):T.push(i),i.observers&&je(i)),o||(i.state=M)}if(m.length>1e6)throw m=[],new Error},!1)),t}function te(e){if(!e.fn)return;ee(e);const t=ge;Xe(e,e.value,t)}function Xe(e,t,n){let r;const s=g,i=h;h=g=e;try{r=e.fn(t)}catch(o){return e.pure&&(e.state=M,e.owned&&e.owned.forEach(ee),e.owned=null),e.updatedAt=n+1,Te(o)}finally{h=i,g=s}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?Ce(e,r):e.value=r,e.updatedAt=n)}function pe(e,t,n,r=M,s){const i={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:g,context:g?g.context:null,pure:n};return g===null||g!==Pe&&(g.owned?g.owned.push(i):g.owned=[i]),i}function le(e){if(e.state===0)return;if(e.state===ie)return oe(e);if(e.suspense&&J(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<ge);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===M)te(e);else if(e.state===ie){const r=m;m=null,G(()=>oe(e,t[0]),!1),m=r}}function G(e,t){if(m)return e();let n=!1;t||(m=[]),T?n=!0:T=[],ge++;try{const r=e();return Qe(n),r}catch(r){n||(T=null),m=null,Te(r)}}function Qe(e){if(m&&(Ee(m),m=null),e)return;const t=T;T=null,t.length&&G(()=>Oe(t),!1)}function Ee(e){for(let t=0;t<e.length;t++)le(e[t])}function Ye(e){let t,n=0;for(t=0;t<e.length;t++){const r=e[t];r.user?e[n++]=r:le(r)}for(t=0;t<n;t++)le(e[t])}function oe(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const r=e.sources[n];if(r.sources){const s=r.state;s===M?r!==t&&(!r.updatedAt||r.updatedAt<ge)&&le(r):s===ie&&oe(r,t)}}}function je(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=ie,n.pure?m.push(n):T.push(n),n.observers&&je(n))}}function ee(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),r=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const i=s.pop(),o=n.observerSlots.pop();r<s.length&&(i.sourceSlots[o]=r,s[r]=i,n.observerSlots[r]=o)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)ee(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)ee(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function Ze(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function Te(e,t=g){throw Ze(e)}const et=Symbol("fallback");function $e(e){for(let t=0;t<e.length;t++)e[t]()}function tt(e,t,n={}){let r=[],s=[],i=[],o=0,l=t.length>1?[]:null;return He(()=>$e(i)),()=>{let c=e()||[],f=c.length,a,u;return c[Y],J(()=>{let _,A,O,I,ne,P,x,j,U;if(f===0)o!==0&&($e(i),i=[],r=[],s=[],o=0,l&&(l=[])),n.fallback&&(r=[et],s[0]=re(Je=>(i[0]=Je,n.fallback())),o=1);else if(o===0){for(s=new Array(f),u=0;u<f;u++)r[u]=c[u],s[u]=re(S);o=f}else{for(O=new Array(f),I=new Array(f),l&&(ne=new Array(f)),P=0,x=Math.min(o,f);P<x&&r[P]===c[P];P++);for(x=o-1,j=f-1;x>=P&&j>=P&&r[x]===c[j];x--,j--)O[j]=s[x],I[j]=i[x],l&&(ne[j]=l[x]);for(_=new Map,A=new Array(j+1),u=j;u>=P;u--)U=c[u],a=_.get(U),A[u]=a===void 0?-1:a,_.set(U,u);for(a=P;a<=x;a++)U=r[a],u=_.get(U),u!==void 0&&u!==-1?(O[u]=s[a],I[u]=i[a],l&&(ne[u]=l[a]),u=A[u],_.set(U,u)):i[a]();for(u=P;u<f;u++)u in O?(s[u]=O[u],i[u]=I[u],l&&(l[u]=ne[u],l[u](u))):s[u]=re(S);s=s.slice(0,o=f),r=c.slice(0)}return s});function S(_){if(i[u]=_,l){const[A,O]=R(u);return l[u]=O,t(c[u],A)}return t(c[u])}}}function b(e,t){return J(()=>e(t||{}))}const nt=e=>`Stale read from <${e}>.`;function Ne(e){const t="fallback"in e&&{fallback:()=>e.fallback};return ye(tt(()=>e.each,e.children,t||void 0))}function ve(e){const t=e.keyed,n=ye(()=>e.when,void 0,{equals:(r,s)=>t?r===s:!r==!s});return ye(()=>{const r=n();if(r){const s=e.children;return typeof s=="function"&&s.length>0?J(()=>s(t?r:()=>{if(!J(n))throw nt("Show");return e.when})):s}return e.fallback},void 0,void 0)}function rt(e,t,n){let r=n.length,s=t.length,i=r,o=0,l=0,c=t[s-1].nextSibling,f=null;for(;o<s||l<i;){if(t[o]===n[l]){o++,l++;continue}for(;t[s-1]===n[i-1];)s--,i--;if(s===o){const a=i<r?l?n[l-1].nextSibling:n[i-l]:c;for(;l<i;)e.insertBefore(n[l++],a)}else if(i===l)for(;o<s;)(!f||!f.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[i-1]&&n[l]===t[s-1]){const a=t[--s].nextSibling;e.insertBefore(n[l++],t[o++].nextSibling),e.insertBefore(n[--i],a),t[s]=n[i]}else{if(!f){f=new Map;let u=l;for(;u<i;)f.set(n[u],u++)}const a=f.get(t[o]);if(a!=null)if(l<a&&a<i){let u=o,S=1,_;for(;++u<s&&u<i&&!((_=f.get(t[u]))==null||_!==a+S);)S++;if(S>a-l){const A=t[o];for(;l<a;)e.insertBefore(n[l++],A)}else e.replaceChild(n[l++],t[o++])}else o++;else t[o++].remove()}}}const ke="_$DX_DELEGATE";function st(e,t,n,r={}){let s;return re(i=>{s=i,t===document?e():d(t,e(),t.firstChild?null:void 0,n)},r.owner),()=>{s(),t.textContent=""}}function k(e,t,n){let r;const s=()=>{const o=document.createElement("template");return o.innerHTML=e,o.content.firstChild},i=()=>(r||(r=s())).cloneNode(!0);return i.cloneNode=i,i}function it(e,t=window.document){const n=t[ke]||(t[ke]=new Set);for(let r=0,s=e.length;r<s;r++){const i=e[r];n.has(i)||(n.add(i),t.addEventListener(i,lt))}}function Se(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function p(e,t){t==null?e.removeAttribute("class"):e.className=t}function d(e,t,n,r){if(n!==void 0&&!r&&(r=[]),typeof t!="function")return ce(e,t,r,n);w(s=>ce(e,t(),s,n),r)}function lt(e){let t=e.target;const n=`$$${e.type}`,r=e.target,s=e.currentTarget,i=c=>Object.defineProperty(e,"target",{configurable:!0,value:c}),o=()=>{const c=t[n];if(c&&!t.disabled){const f=t[`${n}Data`];if(f!==void 0?c.call(t,f,e):c.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&i(t.host),!0},l=()=>{for(;o()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),e.composedPath){const c=e.composedPath();i(c[0]);for(let f=0;f<c.length-2&&(t=c[f],!!o());f++){if(t._$host){t=t._$host,l();break}if(t.parentNode===s)break}}else l();i(r)}function ce(e,t,n,r,s){for(;typeof n=="function";)n=n();if(t===n)return n;const i=typeof t,o=r!==void 0;if(e=o&&n[0]&&n[0].parentNode||e,i==="string"||i==="number"){if(i==="number"&&(t=t.toString(),t===n))return n;if(o){let l=n[0];l&&l.nodeType===3?l.data!==t&&(l.data=t):l=document.createTextNode(t),n=z(e,n,r,l)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||i==="boolean")n=z(e,n,r);else{if(i==="function")return w(()=>{let l=t();for(;typeof l=="function";)l=l();n=ce(e,l,n,r)}),()=>n;if(Array.isArray(t)){const l=[],c=n&&Array.isArray(n);if(me(l,t,n,s))return w(()=>n=ce(e,l,n,r,!0)),()=>n;if(l.length===0){if(n=z(e,n,r),o)return n}else c?n.length===0?Ae(e,l,r):rt(e,n,l):(n&&z(e),Ae(e,l));n=l}else if(t.nodeType){if(Array.isArray(n)){if(o)return n=z(e,n,r,t);z(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function me(e,t,n,r){let s=!1;for(let i=0,o=t.length;i<o;i++){let l=t[i],c=n&&n[e.length],f;if(!(l==null||l===!0||l===!1))if((f=typeof l)=="object"&&l.nodeType)e.push(l);else if(Array.isArray(l))s=me(e,l,c)||s;else if(f==="function")if(r){for(;typeof l=="function";)l=l();s=me(e,Array.isArray(l)?l:[l],Array.isArray(c)?c:[c])||s}else e.push(l),s=!0;else{const a=String(l);c&&c.nodeType===3&&c.data===a?e.push(c):e.push(document.createTextNode(a))}}return s}function Ae(e,t,n=null){for(let r=0,s=t.length;r<s;r++)e.insertBefore(t[r],n)}function z(e,t,n,r){if(n===void 0)return e.textContent="";const s=r||document.createTextNode("");if(t.length){let i=!1;for(let o=t.length-1;o>=0;o--){const l=t[o];if(s!==l){const c=l.parentNode===e;!i&&!o?c?e.replaceChild(s,l):e.insertBefore(s,n):c&&l.remove()}else i=!0}}else e.insertBefore(s,n);return[s]}const V=Symbol("store-raw"),E=Symbol("store-node"),$=Symbol("store-has"),De=Symbol("store-self");function Le(e){let t=e[v];if(!t&&(Object.defineProperty(e,v,{value:t=new Proxy(e,ct)}),!Array.isArray(e))){const n=Object.keys(e),r=Object.getOwnPropertyDescriptors(e);for(let s=0,i=n.length;s<i;s++){const o=n[s];r[o].get&&Object.defineProperty(e,o,{enumerable:r[o].enumerable,get:r[o].get.bind(t)})}}return t}function B(e){let t;return e!=null&&typeof e=="object"&&(e[v]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function D(e,t=new Set){let n,r,s,i;if(n=e!=null&&e[V])return n;if(!B(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let o=0,l=e.length;o<l;o++)s=e[o],(r=D(s,t))!==s&&(e[o]=r)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const o=Object.keys(e),l=Object.getOwnPropertyDescriptors(e);for(let c=0,f=o.length;c<f;c++)i=o[c],!l[i].get&&(s=e[i],(r=D(s,t))!==s&&(e[i]=r))}return e}function W(e,t){let n=e[t];return n||Object.defineProperty(e,t,{value:n=Object.create(null)}),n}function F(e,t,n){if(e[t])return e[t];const[r,s]=R(n,{equals:!1,internal:!0});return r.$=s,e[t]=r}function ot(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===v||t===E||(delete n.value,delete n.writable,n.get=()=>e[v][t]),n}function we(e){Z()&&F(W(e,E),De)()}function Me(e){return we(e),Reflect.ownKeys(e)}const ct={get(e,t,n){if(t===V)return e;if(t===v)return n;if(t===Y)return we(e),n;const r=W(e,E),s=r[t];let i=s?s():e[t];if(t===E||t===$||t==="__proto__")return i;if(!s){const o=Object.getOwnPropertyDescriptor(e,t);Z()&&(typeof i!="function"||e.hasOwnProperty(t))&&!(o&&o.get)&&(i=F(r,t,i)())}return B(i)?Le(i):i},has(e,t){return t===V||t===v||t===Y||t===E||t===$||t==="__proto__"?!0:(Z()&&F(W(e,$),t)(),t in e)},set(){return!0},deleteProperty(){return!0},ownKeys:Me,getOwnPropertyDescriptor:ot};function L(e,t,n,r=!1){if(!r&&e[t]===n)return;const s=e[t],i=e.length;n===void 0?(delete e[t],e[$]&&e[$][t]&&s!==void 0&&e[$][t].$()):(e[t]=n,e[$]&&e[$][t]&&s===void 0&&e[$][t].$());let o=W(e,E),l;if((l=F(o,t,s))&&l.$(()=>n),Array.isArray(e)&&e.length!==i){for(let c=e.length;c<i;c++)(l=o[c])&&l.$();(l=F(o,"length",i))&&l.$(e.length)}(l=o[De])&&l.$()}function Ie(e,t){const n=Object.keys(t);for(let r=0;r<n.length;r+=1){const s=n[r];L(e,s,t[s])}}function ut(e,t){if(typeof t=="function"&&(t=t(e)),t=D(t),Array.isArray(t)){if(e===t)return;let n=0,r=t.length;for(;n<r;n++){const s=t[n];e[n]!==s&&L(e,n,s)}L(e,"length",r)}else Ie(e,t)}function H(e,t,n=[]){let r,s=e;if(t.length>1){r=t.shift();const o=typeof r,l=Array.isArray(e);if(Array.isArray(r)){for(let c=0;c<r.length;c++)H(e,[r[c]].concat(t),n);return}else if(l&&o==="function"){for(let c=0;c<e.length;c++)r(e[c],c)&&H(e,[c].concat(t),n);return}else if(l&&o==="object"){const{from:c=0,to:f=e.length-1,by:a=1}=r;for(let u=c;u<=f;u+=a)H(e,[u].concat(t),n);return}else if(t.length>1){H(e[r],t,[r].concat(n));return}s=e[r],n=[r].concat(n)}let i=t[0];typeof i=="function"&&(i=i(s,n),i===s)||r===void 0&&i==null||(i=D(i),r===void 0||B(s)&&B(i)&&!Array.isArray(i)?Ie(s,i):L(e,r,i))}function Be(...[e,t]){const n=D(e||{}),r=Array.isArray(n),s=Le(n);function i(...o){X(()=>{r&&o.length===1?ut(n,o[0]):H(n,o)})}return[s,i]}function ft(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||n.set||!n.configurable||t===v||t===E||(delete n.value,delete n.writable,n.get=()=>e[v][t],n.set=r=>e[v][t]=r),n}const at={get(e,t,n){if(t===V)return e;if(t===v)return n;if(t===Y)return we(e),n;const r=W(e,E),s=r[t];let i=s?s():e[t];if(t===E||t===$||t==="__proto__")return i;if(!s){const o=Object.getOwnPropertyDescriptor(e,t),l=typeof i=="function";if(Z()&&(!l||e.hasOwnProperty(t))&&!(o&&o.get))i=F(r,t,i)();else if(i!=null&&l&&i===Array.prototype[t])return(...c)=>X(()=>Array.prototype[t].apply(n,c))}return B(i)?Fe(i):i},has(e,t){return t===V||t===v||t===Y||t===E||t===$||t==="__proto__"?!0:(Z()&&F(W(e,$),t)(),t in e)},set(e,t,n){return X(()=>L(e,t,D(n))),!0},deleteProperty(e,t){return X(()=>L(e,t,void 0,!0)),!0},ownKeys:Me,getOwnPropertyDescriptor:ft};function Fe(e){let t=e[v];if(!t){Object.defineProperty(e,v,{value:t=new Proxy(e,at)});const n=Object.keys(e),r=Object.getOwnPropertyDescriptors(e),s=Object.getPrototypeOf(e),i=s!==null&&e!==null&&typeof e=="object"&&!Array.isArray(e)&&s!==Object.prototype;if(i){const o=Object.getOwnPropertyDescriptors(s);n.push(...Object.keys(o)),Object.assign(r,o)}for(let o=0,l=n.length;o<l;o++){const c=n[o];if(!(i&&c==="constructor")){if(r[c].get){const f=r[c].get.bind(t);Object.defineProperty(e,c,{get:f,configurable:!0})}if(r[c].set){const f=r[c].set;Object.defineProperty(e,c,{set:u=>X(()=>f.call(t,u)),configurable:!0})}}}}return t}function dt(e,t){const n=D(e||{});return Fe(n)}const ue=new WeakMap,Re={get(e,t){if(t===V)return e;const n=e[t];let r;return B(n)?ue.get(n)||(ue.set(n,r=new Proxy(n,Re)),r):n},set(e,t,n){return L(e,t,D(n)),!0},deleteProperty(e,t){return L(e,t,void 0,!0),!0}};function Ue(e){return t=>{if(B(t)){let n;(n=ue.get(t))||ue.set(t,n=new Proxy(t,Re)),e(n)}return t}}const ht="_day_12gvs_31",gt="_events_12gvs_41",_t="_event_12gvs_41",yt="_event_small_12gvs_58",mt="_selected_12gvs_74",bt="_info_12gvs_91",pt="_actions_12gvs_100",vt="_multiple_date_selector_12gvs_113",wt="_day_selector_grid_12gvs_138",$t="_day_selector_inner_12gvs_158",kt="_day_selector_text_12gvs_164",St="_day_selector_num_events_12gvs_168",y={day:ht,events:gt,event:_t,event_small:yt,selected:mt,info:bt,actions:pt,multiple_date_selector:vt,day_selector_grid:wt,"day-selector":"_day-selector_12gvs_144",day_selector_inner:$t,day_selector_text:kt,day_selector_num_events:St},[fe,ze]=Be({1:{events:[{id:1,name:"baseball",time:900,duration:"1h",color_theme:"rgb(81, 6, 81)"},{id:2,name:"brunch",time:1100,duration:"1.5h",color_theme:"darkblue"},{id:3,name:"grocery shopping",time:1400,duration:"2h",color_theme:"darkred"},{id:4,name:"game night",time:1900,duration:"2h",color_theme:"darkgreen"}],weekday:"Monday"},2:{events:[{id:5,name:"yoga",time:600,duration:"1h",color_theme:"darkred"},{id:6,name:"work",time:800,duration:"8h",color_theme:"darkblue"},{id:7,name:"dinner date",time:1900,duration:"2h",color_theme:"rgb(81, 6, 81)"},{id:8,name:"movie night",time:2100,duration:"2.5h",color_theme:"darkgreen"}],weekday:"Tuesday"},3:{events:[{id:9,name:"study group",time:900,duration:"2h",color_theme:"darkblue",task_reference:1},{id:10,name:"lunch",time:1200,duration:"1h",color_theme:"darkred"},{id:11,name:"workout",time:1500,duration:"1.5h",color_theme:"rgb(81, 6, 81)"},{id:12,name:"dinner",time:1800,duration:"1h",color_theme:"darkgreen"}],weekday:"Wednesday"},4:{events:[{id:13,name:"school",time:800,duration:"6h",color_theme:"rgb(81, 6, 81)",task_reference:2},{id:14,name:"go to store",time:1400,duration:"1h",color_theme:"darkblue"},{id:15,name:"reading group",time:1800,duration:"2h",color_theme:"darkred"},{id:16,name:"TV night",time:2100,duration:"2h",color_theme:"darkgreen"}],weekday:"Thursday"},5:{events:[{id:17,name:"breakfast",time:700,duration:"1h",color_theme:"darkblue"},{id:18,name:"walk",time:900,duration:"1.5h",color_theme:"rgb(81, 6, 81)"},{id:19,name:"lunch",time:1200,duration:"1h",color_theme:"darkred"},{id:20,name:"game night",time:1900,duration:"2h",color_theme:"darkgreen"}],weekday:"Friday"},6:{events:[{id:21,name:"brunch",time:1100,duration:"1.5h",color_theme:"rgb(81, 6, 81)"},{id:22,name:"grocery shopping",time:1400,duration:"2h",color_theme:"darkblue"},{id:23,name:"movie night",time:1900,duration:"2.5h",color_theme:"darkred"},{id:24,name:"yoga",time:2100,duration:"1h",color_theme:"darkgreen"}],weekday:"Saturday"},7:{events:[{id:25,name:"sleep in",time:900,duration:"2h",color_theme:"darkred"},{id:26,name:"lunch",time:1200,duration:"1h",color_theme:"darkblue"},{id:27,name:"workout",time:1400,duration:"1.5h",color_theme:"rgb(81, 6, 81)"},{id:28,name:"TV night",time:1900,duration:"2h",color_theme:"darkgreen"}],weekday:"Sunday"}});function At(e){const t=Math.floor(e/60),n=e%60,r=t>12?t-12:t,s=n<10?`0${n}`:n,i=t>12?"PM":"AM";return`${r}:${s}: ${i}`}var Ot=k("<div><h2></h2><div>"),Q=k("<p>"),Pt=k("<button>Join"),xt=k("<div><div class=info>info tag"),be=k("<div>"),Ct=k("<div>loading..."),Et=k("<h1>filter by day"),jt=k("<div><div>"),Tt=k("<div><div><div><span>"),Nt=k("<div><span>🛠️</span><button>Delete<span class=selected-events> (<!>)</span></button><button>clear</button><button>Join</button><div class=backlog-actions><span>📝</span><button>undo</button><button>redo"),Dt=k("<div><button>Small</button><button>Medium</button><button>Large"),Lt=k("<div><h1>Info</h1><p>events size modes: </p><p>selecting events: </p><p>selected events: </p><p>selected events: </p><p>backlog: </p><p>backlog pointer: </p><p>selected days: ");const[ae,Ke]=R([]);let[q,qe]=R(0);Ge(()=>{q(),Ke(Ue(e=>{e.length=q()}))});const N=dt({events:{size:"medium"},selecting_events:!1});window.addEventListener("mousedown",()=>{N.selecting_events=!0});window.addEventListener("mouseup",()=>{N.selecting_events=!1});const[C,K]=Be([]),[Mt,de]=R(!0);function It({day:{events:e,weekday:t}}){return(()=>{var n=Ot(),r=n.firstChild,s=r.nextSibling;return d(r,t),d(s,()=>e.map(i=>b(Rt,{event:i}))),w(i=>{var o=y.day,l=y.events;return o!==i.e&&p(n,i.e=o),l!==i.t&&p(s,i.t=l),i},{e:void 0,t:void 0}),n})()}function Bt({event:e}){return[(()=>{var t=Q();return d(t,()=>e.name),t})(),(()=>{var t=Q();return d(t,()=>At(e.time)),t})(),(()=>{var t=Q();return d(t,()=>e.duration),t})(),(()=>{var t=Pt();return t.$$click=()=>{},t})()]}function Ft({event:e}){return(()=>{var t=Q();return d(t,()=>e.name),t})()}function Rt({event:e}){const[t,n]=R(!1);return(()=>{var r=xt(),s=r.firstChild;return r.$$click=()=>{{if(C.some(i=>i.id===e.id)){K(C.filter(i=>i.id!==e.id)),n(!1);return}K([...C,e]),n(!0)}},r.$$mouseover=()=>{if(N.selecting_events){if(C.some(i=>i.id===e.id)){K(C.filter(i=>i.id!==e.id)),n(!1);return}K([...C,e]),n(!0)}},r.style.setProperty("position","relative"),r.style.setProperty("cursor","pointer"),d(r,b(ve,{get when(){return N.events.size=="small"},get fallback(){return b(Bt,{event:e})},get children(){return[" ",b(Ft,{event:e})]}}),s),s.style.setProperty("width","fit-content"),s.style.setProperty("height","fit-content"),s.style.setProperty("padding","0.5rem"),s.style.setProperty("position","absolute"),s.style.setProperty("top","0.5rem"),s.style.setProperty("right","0.5rem"),w(i=>{var o=`${y.event} ${t()?y.selected:""}`,l=e.color_theme;return o!==i.e&&p(r,i.e=o),l!==i.t&&((i.t=l)!=null?s.style.setProperty("background-color",l):s.style.removeProperty("background-color")),i},{e:void 0,t:void 0}),r})()}const Ut=()=>(()=>{var e=be();return d(e,b(Wt,{}),null),d(e,b(Gt,{}),null),d(e,b(Kt,{}),null),d(e,b(Vt,{}),null),d(e,b(ve,{get when(){return Mt()},get fallback(){return Ct()},get children(){return b(Ht,{})}}),null),w(()=>p(e,y.App)),e})(),[he,zt]=R([]);function Kt(){const e=t=>{zt(n=>n.includes(t)?n.filter(r=>r!==t):[...n,t])};return[Et(),(()=>{var t=jt(),n=t.firstChild;return d(n,b(Ne,{get each(){return Object.keys(fe)},children:r=>{const s=fe[r],i=s.events.length,o=s.events.map(l=>(()=>{var c=Q();return d(c,()=>l.name),w(()=>Se(c,"key",l.id)),c})());return(()=>{var l=Tt(),c=l.firstChild,f=c.firstChild,a=f.firstChild;return l.$$click=()=>e(r),d(f,r,a),d(a,i),w(u=>{var S=`day-selector ${he().includes(r)?y.selected:""}`,_=`${r}
${i} events
${o.join(`
`)}`,A=y.day_selector_inner,O=y.day_selector_text,I=y.day_selector_num_events;return S!==u.e&&p(l,u.e=S),_!==u.t&&Se(l,"title",u.t=_),A!==u.a&&p(c,u.a=A),O!==u.o&&p(f,u.o=O),I!==u.i&&p(a,u.i=I),u},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),l})()}})),w(r=>{var s=y.multiple_date_selector,i=y.day_selector_grid;return s!==r.e&&p(t,r.e=s),i!==r.t&&p(n,r.t=i),r},{e:void 0,t:void 0}),t})()]}function qt(){de(!1),de(!0)}function Jt(){Ke([...ae(),fe]),qe(e=>e+1),ze(Ue(e=>Object.values(e).map(t=>{t.events=t.events.filter(n=>!C.some(r=>r.id===n.id))}))),de(!1),de(!0),K([])}function Vt(){return(()=>{var e=Nt(),t=e.firstChild,n=t.nextSibling,r=n.firstChild,s=r.nextSibling,i=s.firstChild,o=i.nextSibling;o.nextSibling;var l=n.nextSibling,c=l.nextSibling,f=c.nextSibling,a=f.firstChild,u=a.nextSibling,S=u.nextSibling;return t.style.setProperty("font-size","2rem"),t.style.setProperty("margin-right","1rem"),n.$$click=Jt,n.style.setProperty("position","relative"),n.style.setProperty("color","red"),d(s,()=>C.length,o),l.$$click=()=>{K([]),document.querySelectorAll(`.${y.selected}`).forEach(_=>{_.classList.remove(y.selected)})},c.$$click=()=>{},f.style.setProperty("display","flex"),f.style.setProperty("gap","1rem"),a.style.setProperty("font-size","2rem"),a.style.setProperty("margin-right","1rem"),u.$$click=()=>{q()>0&&(console.log("previous",ae()[q()-1]),ze(ae()[q()-1]),qe(_=>_-1)),qt()},u.style.setProperty("background-color","blue"),S.style.setProperty("background-color","blue"),w(()=>p(e,y.actions)),e})()}function Wt(){return(()=>{var e=Dt(),t=e.firstChild,n=t.nextSibling,r=n.nextSibling;return t.$$click=()=>{N.events.size="small"},n.$$click=()=>{N.events.size="medium"},r.$$click=()=>{N.events.size="large"},w(()=>p(e,y.settings)),e})()}function Gt(){return(()=>{var e=Lt(),t=e.firstChild,n=t.nextSibling;n.firstChild;var r=n.nextSibling;r.firstChild;var s=r.nextSibling;s.firstChild;var i=s.nextSibling;i.firstChild;var o=i.nextSibling;o.firstChild;var l=o.nextSibling;l.firstChild;var c=l.nextSibling;return c.firstChild,d(n,()=>N.events.size,null),d(r,()=>N.selecting_events?"true":"false",null),d(s,()=>C.length,null),d(i,()=>JSON.stringify(C),null),d(o,()=>JSON.stringify(ae()),null),d(l,q,null),d(c,()=>JSON.stringify(he()),null),w(()=>p(e,y.info)),e})()}function Ht(){return(()=>{var e=be();return d(e,b(Ne,{get each(){return Object.entries(fe)},children:([t,n])=>b(ve,{get when(){return he().length==0||he().includes(t)},get fallback(){return be()},get children(){return b(It,{day:n})}})})),w(()=>p(e,y.calendar)),e})()}it(["click","mouseover"]);const Xt=document.getElementById("root");st(()=>b(Ut,{}),Xt);