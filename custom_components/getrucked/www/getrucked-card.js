var ne=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var P=(r,t,e,s)=>{for(var i=s>1?void 0:s?oe(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&ne(t,e,i),i};var Z=globalThis,Q=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),Rt=new WeakMap,U=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Rt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Rt.set(e,t))}return t}toString(){return this.cssText}},wt=r=>new U(typeof r=="string"?r:r+"",void 0,ht),I=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new U(e,r,ht)},Tt=(r,t)=>{if(Q)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Z.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ut=Q?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return wt(e)})(r):r;var{is:ae,defineProperty:le,getOwnPropertyDescriptor:ce,getOwnPropertyNames:de,getOwnPropertySymbols:he,getPrototypeOf:ue}=Object,X=globalThis,Lt=X.trustedTypes,pe=Lt?Lt.emptyScript:"",ge=X.reactiveElementPolyfillSupport,O=(r,t)=>r,N={toAttribute(r,t){switch(t){case Boolean:r=r?pe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},tt=(r,t)=>!ae(r,t),Mt={attribute:!0,type:String,converter:N,reflect:!1,useDefault:!1,hasChanged:tt};Symbol.metadata??=Symbol("metadata"),X.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Mt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&le(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=ce(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Mt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=ue(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...de(e),...he(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ut(i))}else t!==void 0&&e.push(ut(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Tt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:N).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:N;this._$Em=i;let l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??tt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[O("elementProperties")]=new Map,b[O("finalized")]=new Map,ge?.({ReactiveElement:b}),(X.reactiveElementVersions??=[]).push("2.1.2");var yt=globalThis,Dt=r=>r,et=yt.trustedTypes,Ft=et?et.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ht="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,zt="?"+x,me=`<${zt}>`,E=document,z=()=>E.createComment(""),K=r=>r===null||typeof r!="object"&&typeof r!="function",$t=Array.isArray,fe=r=>$t(r)||typeof r?.[Symbol.iterator]=="function",pt=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,Ut=/>/g,A=RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),It=/'/g,Ot=/"/g,Kt=/^(?:script|style|textarea|title)$/i,bt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=bt(1),Me=bt(2),De=bt(3),S=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Nt=new WeakMap,k=E.createTreeWalker(E,129);function Gt(r,t){if(!$t(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ft!==void 0?Ft.createHTML(t):t}var _e=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=H;for(let l=0;l<e;l++){let a=r[l],h,p,c=-1,f=0;for(;f<a.length&&(o.lastIndex=f,p=o.exec(a),p!==null);)f=o.lastIndex,o===H?p[1]==="!--"?o=Pt:p[1]!==void 0?o=Ut:p[2]!==void 0?(Kt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=A):p[3]!==void 0&&(o=A):o===A?p[0]===">"?(o=i??H,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?A:p[3]==='"'?Ot:It):o===Ot||o===It?o=A:o===Pt||o===Ut?o=H:(o=A,i=void 0);let v=o===A&&r[l+1].startsWith("/>")?" ":"";n+=o===H?a+me:c>=0?(s.push(h),a.slice(0,c)+Ht+a.slice(c)+x+v):a+x+(c===-2?l:v)}return[Gt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},G=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[h,p]=_e(t,e);if(this.el=r.createElement(h,s),k.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=k.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Ht)){let f=p[o++],v=i.getAttribute(c).split(x),R=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:R[2],strings:v,ctor:R[1]==="."?mt:R[1]==="?"?ft:R[1]==="@"?_t:L}),i.removeAttribute(c)}else c.startsWith(x)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(Kt.test(i.tagName)){let c=i.textContent.split(x),f=c.length-1;if(f>0){i.textContent=et?et.emptyScript:"";for(let v=0;v<f;v++)i.append(c[v],z()),k.nextNode(),a.push({type:2,index:++n});i.append(c[f],z())}}}else if(i.nodeType===8)if(i.data===zt)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(x,c+1))!==-1;)a.push({type:7,index:n}),c+=x.length-1}n++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function T(r,t,e=r,s){if(t===S)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=K(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=T(r,i._$AS(r,t.values),i,s)),t}var gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);k.currentNode=i;let n=k.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new j(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new vt(n,this,t)),this._$AV.push(h),a=s[++l]}o!==a?.index&&(n=k.nextNode(),o++)}return k.currentNode=E,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},j=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),K(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):fe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&K(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=G.createElement(Gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new gt(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Nt.get(t.strings);return e===void 0&&Nt.set(t.strings,e=new G(t)),e}k(t){$t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Dt(t).nextSibling;Dt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=T(this,t,e,0),o=!K(t)||t!==this._$AH&&t!==S,o&&(this._$AH=t);else{let l=t,a,h;for(t=n[0],a=0;a<n.length-1;a++)h=T(this,l[s+a],e,a),h===S&&(h=this._$AH[a]),o||=!K(h)||h!==this._$AH[a],h===u?t=u:t!==u&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}o&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},mt=class extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},ft=class extends L{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},_t=class extends L{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??u)===S)return;let s=this._$AH,i=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==u&&(s===u||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},vt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var ve=yt.litHtmlPolyfillSupport;ve?.(G,j),(yt.litHtmlVersions??=[]).push("3.3.3");var jt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new j(t.insertBefore(z(),n),n,void 0,e??{})}return i._$AI(r),i};var xt=globalThis,y=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=jt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};y._$litElement$=!0,y.finalized=!0,xt.litElementHydrateSupport?.({LitElement:y});var ye=xt.litElementPolyfillSupport;ye?.({LitElement:y});(xt.litElementVersions??=[]).push("4.2.2");var $e={attribute:!0,type:String,converter:N,reflect:!1,hasChanged:tt},be=(r=$e,t,e)=>{let{kind:s,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){let{name:o}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){let{name:o}=e;return function(l){let a=this[o];t.call(this,l),this.requestUpdate(o,a,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function st(r){return(t,e)=>typeof e=="object"?be(r,t,e):((s,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function it(r){return st({...r,state:!0,attribute:!1})}var B="getrucked-card",nt="getrucked-card-editor",W="getrucked",Bt=["rank","weekly_distance","monthly_distance","fitness_ctl","fatigue_atl","form_tsb","distance_to_next_rank","latest_ruck","goals"],q=["rank","weekly_distance","monthly_distance","form_tsb","latest_ruck"],V=["rank","weekly_distance","monthly_distance","fitness_ctl","fatigue_atl","form_tsb","latest_ruck","goals"],Wt=["date","type","pack_weight","distance","duration","pace","elevation_gain","elevation_loss","steps","calories","cadence","terrain","rating","weather","heart_rate","dog"],ot=["pack_weight","distance","duration","pace"],at=["pack_weight","distance","duration","pace","elevation_gain","elevation_loss","terrain","weather","heart_rate","steps","calories","cadence","dog","rating"];function lt(r){let t=new Set;for(let e of Object.values(r.entities))e.platform===W&&e.device_id&&t.add(e.device_id);return[...t].map(e=>{let s=r.devices[e],i=s?.name_by_user||s?.name||e;return{id:e,name:i}}).sort((e,s)=>e.name.localeCompare(s.name))}function qt(r,t,e){for(let[s,i]of Object.entries(r.entities))if(i.device_id===t&&i.platform===W&&i.translation_key===e)return s;return null}function Vt(r,t){let e=[];for(let[s,i]of Object.entries(r.entities))i.device_id===t&&i.platform===W&&i.translation_key==="goal_percent"&&e.push(s);return e.sort()}function g(r,t){return t?r.states[t]??null:null}function Yt(r,t){let e=r.devices[t]?.config_entries?.[0];if(!e||!r.issues)return!1;let s=`${e}_premium_required`;return Object.values(r.issues).some(i=>i.domain===W&&i.issue_id===s)}function Y(r,t){return r==null?"\u2014":`${r.toFixed(2)} ${t??""}`.trim()}function Jt(r,t){return r==null?"No pack":`${r.toFixed(1)} ${t??""}`.trim()}function Zt(r,t){if(!r)return"\u2014";let e=t?.includes("km")?"/km":"/mi";return`${r} ${e}`}function Qt(r,t,e,s){let i=r!=null?r.toFixed(2):"0.00",n=t!=null?String(t):"?";return`${i} / ${n} ${e??""} \xB7 ${s??0}%`.replace(/\s+·/," \xB7")}function At(r){return r==null?"form-neutral":r>10?"form-fresh":r<-10?"form-fatigued":"form-neutral"}function Xt(r,t,e){if(r==null&&!e)return null;let s=[];return r!=null&&s.push(`${Math.round(r)}${t??""}`),e&&s.push(e),s.join(" \xB7 ")}function te(r,t){if(r==null&&t==null)return null;let e=r!=null?Math.round(r):"\u2014",s=t!=null?Math.round(t):"\u2014";return`${e} / ${s} bpm`}function ee(r){return r?`\u{1F415} ${r}`:null}function se(r){if(r==null)return null;let t=Math.max(0,Math.min(5,Math.round(r)));return"\u2605".repeat(t)+"\u2606".repeat(5-t)}function ie(r,t,e=new Date){if(!r)return{text:"Not updated yet",stale:!1};let s=r.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"}),i=e.getTime()-r.getTime(),n=2*t*60*1e3,o=i>n;return{text:o?`\u26A0 Updated ${s} \u2014 data may be stale`:`Updated ${s}`,stale:o}}var Ae="/getrucked-static/logo-wordmark.png",ke="/getrucked-static/logo-full.png";function $(r,t){t&&r.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}var C=class extends y{static getStubConfig(t){let e=lt(t);return{type:`custom:${B}`,device_id:e[0]?.id,layout:"compact"}}static getConfigElement(){return document.createElement(nt)}setConfig(t){if(!t)throw new Error("Invalid configuration");let e=t.layout==="detailed"?"detailed":"compact";this._config={...t,layout:e,metrics:t.metrics??(e==="detailed"?V:q),ruck_fields:t.ruck_fields??(e==="detailed"?at:ot)}}getCardSize(){return this._config?.layout==="detailed"?8:4}_entity(t){return this._config.device_id?qt(this.hass,this._config.device_id,t):null}_hasMetric(t){return this._config.metrics?.includes(t)??!1}_hasField(t){return this._config.ruck_fields?.includes(t)??!1}render(){if(!this.hass||!this._config)return d``;let t=this._config.device_id,e=this._config.layout!=="detailed";if(!t)return this._shell(e,d`<div class="gr-simple-state">
          <p>No Get-Rucked device selected. Edit this card to pick one.</p>
        </div>`);if(Yt(this.hass,t))return this._shell(e,d`<div class="gr-premium">
          <div class="gr-premium-badge">⭐ Premium Feature</div>
          <p class="gr-premium-msg">
            Your Get-Rucked Premium subscription has lapsed, so live stats aren't available right now.
          </p>
          <p class="gr-premium-sub">
            Renew Premium in the Get-Rucked app to bring your stats back.
          </p>
        </div>`);let s=this._entity("rank"),i=g(this.hass,s);return i?i.state==="unavailable"?this._shell(e,d`<div class="gr-simple-state">
          <p class="gr-warn-icon">⚠️</p>
          <p><strong>Get-Rucked is unavailable</strong></p>
          <p>Check the integration's status in Settings → Devices & Services.</p>
        </div>`):this._shell(e,e?this._renderCompactBody():this._renderDetailedBody(),!0):this._shell(e,d`<div class="gr-simple-state">
          <div class="gr-spinner"></div>
          <p>Loading Get-Rucked stats…</p>
        </div>`)}_shell(t,e,s=!1){return d`
      <ha-card>
        <div class="gr-banner ${t?"compact":"detailed"}">
          <img src=${t?Ae:ke} alt="Get-Rucked" />
        </div>
        <div class="gr-banner-accent"></div>
        ${e}
        ${s?this._renderFooter():u}
      </ha-card>
    `}_renderFooter(){let t=this._entity("rank"),e=g(this.hass,t),s=Number(e?.attributes.poll_interval_minutes??15),i=e?.last_updated?new Date(e.last_updated):null,{text:n,stale:o}=ie(i,s);return d`<div class="gr-footer ${o?"stale":""}">${n}</div>`}_renderRank(t){let e=this._entity("rank"),s=g(this.hass,e),i=this._entity("distance_to_next_rank"),n=g(this.hass,i),o=s?.state??"\u2014",l=s?.attributes.icon_emoji??"\u{1F3C5}",a=s?.attributes.total_miles,h=s?.attributes.next_rank_name,p=n?.state?Number(n.state):null;return d`
      <div class="gr-rank" @click=${()=>$(this,e)}>
        <div class="gr-rank-icon" style=${t?"font-size:40px":""}>${l}</div>
        <div class="gr-rank-main">
          <div class="gr-rank-name" style=${t?"font-size:19px":""}>${o}</div>
          <div class="gr-rank-sub">
            ${h&&p!=null?`${Y(p,"mi")} to ${h}`:"Top rank reached"}
          </div>
        </div>
        <div class="gr-rank-miles">
          <div class="num" style=${t?"font-size:22px":""}>
            ${a!=null?a.toFixed(2):"\u2014"}
          </div>
          <div class="unit">mi lifetime</div>
        </div>
      </div>
    `}_renderWeekMonthForm(t){let e=this._entity("weekly_distance"),s=g(this.hass,e),i=this._entity("monthly_distance"),n=g(this.hass,i),o=this._entity("form_tsb"),l=g(this.hass,o),a=l?.state?Number(l.state):null,h=l?.attributes.label??"",p=At(a),c=[];this._hasMetric("weekly_distance")&&c.push(d`
        <div class="gr-chip" @click=${()=>$(this,e)}>
          <div class="gr-chip-label">Weekly${t?"":" Distance"}</div>
          <div class="gr-chip-value">
            ${Y(s?.state?Number(s.state):null,"")}<span class="unit"
              >${s?.attributes.unit_of_measurement??""}</span
            >
          </div>
          <div class="gr-chip-sub">${s?.attributes.session_count??0} sessions</div>
        </div>
      `),this._hasMetric("monthly_distance")&&c.push(d`
        <div class="gr-chip" @click=${()=>$(this,i)}>
          <div class="gr-chip-label">Monthly${t?"":" Distance"}</div>
          <div class="gr-chip-value">
            ${Y(n?.state?Number(n.state):null,"")}<span class="unit"
              >${n?.attributes.unit_of_measurement??""}</span
            >
          </div>
          <div class="gr-chip-sub">${n?.attributes.session_count??0} sessions</div>
        </div>
      `);let f=d`
      <div class="gr-chip" @click=${()=>$(this,o)}>
        <div class="gr-chip-label">Form (TSB)</div>
        <div class="gr-chip-value">${a??"\u2014"}</div>
        <div class="gr-chip-sub ${p}">${t?h.split(" \u2014 ")[0]:h}</div>
      </div>
    `;return t&&this._hasMetric("form_tsb")&&c.push(f),c.length?d`
      <div class="gr-section-title">This Week / Month${t?" / Form":""}</div>
      <div class="gr-chip-grid ${t?"cols-3":""}">${c}</div>
      ${!t&&this._hasMetric("form_tsb")?d`<div class="gr-section-title">Form</div>
            <div class="gr-chip-grid">${f}</div>`:u}
    `:d``}_renderTrainingLoad(){if(!this._hasMetric("fitness_ctl")&&!this._hasMetric("fatigue_atl"))return u;let t=this._entity("fitness_ctl"),e=g(this.hass,t),s=this._entity("fatigue_atl"),i=g(this.hass,s),n=this._entity("form_tsb"),o=g(this.hass,n),l=o?.state?Number(o.state):null,a=o?.attributes.label??"",h=At(l);return d`
      <div class="gr-section-title">Training Load</div>
      <div class="gr-chip-grid cols-3">
        <div class="gr-chip" @click=${()=>$(this,t)}>
          <div class="gr-chip-label">Fitness (CTL)</div>
          <div class="gr-chip-value">${e?.state??"\u2014"}</div>
        </div>
        <div class="gr-chip" @click=${()=>$(this,s)}>
          <div class="gr-chip-label">Fatigue (ATL)</div>
          <div class="gr-chip-value">${i?.state??"\u2014"}</div>
        </div>
        <div class="gr-chip" @click=${()=>$(this,n)}>
          <div class="gr-chip-label">Form (TSB)</div>
          <div class="gr-chip-value">${l??"\u2014"}</div>
          <div class="gr-chip-sub ${h}">${a}</div>
        </div>
      </div>
    `}_renderLatestRuck(t){if(!this._hasMetric("latest_ruck"))return u;let e=this._entity("latest_ruck_distance"),s=g(this.hass,e),i=s?.attributes??{},n=s?.state?Number(s.state):null,o=i.unit_of_measurement??"mi",l=g(this.hass,this._entity("latest_ruck_duration")),a=g(this.hass,this._entity("latest_ruck_pace")),h=g(this.hass,this._entity("latest_ruck_pack_weight")),p=h?.attributes.unit_of_measurement??"lbs",c=g(this.hass,this._entity("latest_ruck_elevation_gain")),f=c?.attributes.unit_of_measurement??"ft",v=g(this.hass,this._entity("latest_ruck_weather_temp")),R=v?.attributes.unit_of_measurement??"\xB0F",ct=g(this.hass,this._entity("latest_ruck_heart_rate_avg")),re=g(this.hass,this._entity("latest_ruck_calories")),kt=g(this.hass,this._entity("latest_ruck_steps")),w=i.type??"walk",Et=w==="ruck"?"\u{1F392}":w==="run"?"\u{1F3C3}":"\u{1F6B6}",dt=i.date?new Date(i.date):null,_=(J,D,F)=>D==null?u:d`<div>
            <div class="gr-field-label">${J}</div>
            <div class="gr-field-value">${D}</div>
            ${F?d`<div class="gr-field-sub">${F}</div>`:u}
          </div>`,m=[];if(this._hasField("pack_weight")&&m.push(_("Pack"+(t?"":" Weight"),Jt(h?.state?Number(h.state):null,p))),this._hasField("distance")&&m.push(_("Distance",Y(n,o))),this._hasField("duration")&&m.push(_("Duration",l?.state?`${l.state} min`:"\u2014")),this._hasField("pace")&&m.push(_("Pace",Zt(a?.state??null,a?.attributes.unit))),!t){this._hasField("elevation_gain")&&m.push(_("Elev. Gain",c?.state?`${c.state} ${f}`:"\u2014")),this._hasField("elevation_loss")&&m.push(_("Elev. Loss",i.elevation_loss!=null?`${i.elevation_loss} ${i.elevation_unit??"ft"}`:"\u2014")),this._hasField("terrain")&&m.push(_("Terrain",i.terrain??"\u2014"));let J=Xt(v?.state?Number(v.state):null,R,i.weather_condition);this._hasField("weather")&&J&&m.push(_("Weather",J));let D=te(ct?.state?Number(ct.state):null,ct?.attributes.max);this._hasField("heart_rate")&&D&&m.push(_("Heart Rate",D,"avg / max")),this._hasField("steps")&&m.push(_("Steps",kt?.state?Number(kt.state).toLocaleString():"\u2014")),this._hasField("calories")&&m.push(_("Calories",re?.state??"\u2014")),this._hasField("cadence")&&m.push(_("Cadence",i.avg_cadence!=null?`${i.avg_cadence} spm`:"\u2014"));let F=ee(i.dog_name);this._hasField("dog")&&F&&m.push(_("Dog",F));let Ct=se(i.rating);this._hasField("rating")&&Ct&&m.push(d`<div>
          <div class="gr-field-label">Rating</div>
          <div class="gr-field-value gr-stars">${Ct}</div>
        </div>`)}let St=dt?t?dt.toLocaleDateString(void 0,{month:"short",day:"numeric"}):dt.toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):"";return d`
      <div class="gr-section-title">Latest Ruck</div>
      ${t?d`<div class="gr-ruck-head-compact" @click=${()=>$(this,e)}>
            <span class="gr-ruck-type">${Et} ${w.charAt(0).toUpperCase()+w.slice(1)}</span>
            <span class="gr-ruck-date"> · ${St}</span>
          </div>`:d`<div class="gr-ruck-head" @click=${()=>$(this,e)}>
            <span class="gr-ruck-type">${Et} ${w.charAt(0).toUpperCase()+w.slice(1)}</span>
            <span class="gr-ruck-date">${St}</span>
          </div>`}
      <div class="gr-ruck-fields ${t?"cols-4":""}">${m}</div>
    `}_renderGoals(){if(!this._hasMetric("goals")||!this._config.device_id)return u;let t=Vt(this.hass,this._config.device_id);return t.length?d`
      <div class="gr-section-title">Goals</div>
      ${t.map(e=>{let s=g(this.hass,e),i=s?.attributes??{};return d`
          <div class="gr-goal" @click=${()=>$(this,e)}>
            <div class="gr-goal-head">
              <span class="gr-goal-title">${i.title??""}</span>
              <span class="gr-goal-pct"
                >${Qt(i.current_value,i.target_value,i.unit,s?.state?Number(s.state):null)}</span
              >
            </div>
            <div class="gr-goal-track">
              <div class="gr-goal-fill" style="width: ${s?.state??0}%;"></div>
            </div>
          </div>
        `})}
    `:u}_renderCompactBody(){return d`
      <div class="gr-body compact">
        ${this._hasMetric("rank")?this._renderRank(!1):u}
        ${this._renderWeekMonthForm(!0)}
        ${this._renderLatestRuck(!0)}
      </div>
    `}_renderDetailedBody(){return d`
      <div class="gr-body detailed">
        ${this._hasMetric("rank")?this._renderRank(!0):u}
        ${this._renderWeekMonthForm(!1)}
        ${this._renderTrainingLoad()}
        ${this._renderLatestRuck(!1)}
        ${this._renderGoals()}
      </div>
    `}};C.styles=I`
    :host {
      --gr-amber: #f59e0b;
      --gr-amber-soft: rgba(245, 158, 11, 0.12);
      --gr-amber-border: rgba(245, 158, 11, 0.35);
      --gr-green: #22c55e;
      --gr-red: #ef4444;
      --gr-chip-bg: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      --gr-divider: var(--divider-color, rgba(128, 128, 128, 0.2));
    }
    ha-card {
      overflow: hidden;
    }
    .gr-banner {
      background: #000;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .gr-banner.compact {
      height: 42px;
    }
    .gr-banner.detailed {
      height: 60px;
    }
    .gr-banner img {
      display: block;
    }
    .gr-banner.compact img {
      height: 26px;
      width: auto;
    }
    .gr-banner.detailed img {
      height: 48px;
      width: auto;
    }
    .gr-banner-accent {
      height: 3px;
      background: linear-gradient(90deg, var(--gr-amber), #fbbf24);
    }
    .gr-body {
      padding: 14px 18px 4px;
      color: var(--primary-text-color);
    }
    .gr-body.compact {
      padding: 8px 14px 0;
    }
    .gr-section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin: 14px 0 8px;
    }
    .gr-body.compact .gr-section-title {
      margin: 8px 0 4px;
      font-size: 10px;
    }
    .gr-section-title:first-child {
      margin-top: 0;
    }
    .gr-rank {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      background: var(--gr-chip-bg);
      border-radius: 10px;
      cursor: pointer;
    }
    .gr-body.compact .gr-rank {
      padding: 7px 10px;
      gap: 9px;
    }
    .gr-rank-icon {
      font-size: 24px;
      line-height: 1;
    }
    .gr-rank-main {
      flex: 1;
      min-width: 0;
    }
    .gr-rank-name {
      font-size: 14px;
      font-weight: 700;
    }
    .gr-rank-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .gr-rank-miles {
      text-align: right;
    }
    .gr-rank-miles .num {
      font-size: 15px;
      font-weight: 700;
    }
    .gr-rank-miles .unit {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .gr-chip-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .gr-chip-grid.cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
    .gr-chip {
      background: var(--gr-chip-bg);
      border-radius: 10px;
      padding: 6px 8px;
      cursor: pointer;
    }
    .gr-body.detailed .gr-chip {
      padding: 9px 11px;
    }
    .gr-chip-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin-bottom: 3px;
    }
    .gr-chip-value {
      font-size: 15px;
      font-weight: 700;
      line-height: 1.1;
    }
    .gr-body.detailed .gr-chip-value {
      font-size: 17px;
    }
    .gr-chip-value .unit {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-left: 3px;
    }
    .gr-chip-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .form-fresh {
      color: var(--gr-green);
    }
    .form-neutral {
      color: var(--gr-amber);
    }
    .form-fatigued {
      color: var(--gr-red);
    }
    .gr-ruck-head,
    .gr-ruck-head-compact {
      cursor: pointer;
    }
    .gr-ruck-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .gr-ruck-head-compact {
      font-size: 13px;
      margin-bottom: 7px;
    }
    .gr-ruck-type {
      font-weight: 700;
    }
    .gr-ruck-date {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .gr-ruck-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px 12px;
    }
    .gr-ruck-fields.cols-4 {
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 8px;
    }
    .gr-field-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .gr-field-value {
      font-size: 14px;
      font-weight: 600;
    }
    .gr-body.compact .gr-field-value {
      font-size: 12.5px;
    }
    .gr-field-sub {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      margin-top: 1px;
    }
    .gr-stars {
      color: var(--gr-amber);
      font-size: 13px;
      letter-spacing: 1px;
    }
    .gr-goal {
      margin-bottom: 10px;
      cursor: pointer;
    }
    .gr-goal:last-child {
      margin-bottom: 0;
    }
    .gr-goal-head {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .gr-goal-title {
      font-weight: 600;
    }
    .gr-goal-pct {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .gr-goal-track {
      height: 6px;
      border-radius: 3px;
      background: var(--gr-divider);
      overflow: hidden;
    }
    .gr-goal-fill {
      height: 100%;
      background: var(--gr-amber);
      border-radius: 3px;
    }
    .gr-footer {
      padding: 8px 18px 12px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .gr-footer.stale {
      color: var(--gr-red);
      font-weight: 600;
    }
    .gr-premium {
      text-align: center;
      padding: 28px 20px;
    }
    .gr-premium-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--gr-amber-soft);
      border: 1px solid var(--gr-amber-border);
      color: var(--gr-amber);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    .gr-premium-msg {
      font-size: 14px;
      line-height: 1.6;
      color: var(--primary-text-color);
      max-width: 380px;
      margin: 0 auto;
    }
    .gr-premium-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 10px;
    }
    .gr-simple-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 36px 20px;
      text-align: center;
      color: var(--primary-text-color);
    }
    .gr-simple-state p {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .gr-warn-icon {
      font-size: 28px;
      margin-bottom: 4px;
    }
    .gr-spinner {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2.5px solid var(--gr-divider);
      border-top-color: var(--gr-amber);
      animation: gr-spin 0.9s linear infinite;
    }
    @keyframes gr-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,P([st({attribute:!1})],C.prototype,"hass",2),P([it()],C.prototype,"_config",2);var Ee={rank:"Rank",weekly_distance:"Weekly Distance",monthly_distance:"Monthly Distance",fitness_ctl:"Fitness (CTL)",fatigue_atl:"Fatigue (ATL)",form_tsb:"Form (TSB)",distance_to_next_rank:"Distance To Next Rank",latest_ruck:"Latest Ruck",goals:"Goals"},Se={date:"Date",type:"Type",pack_weight:"Pack Weight",distance:"Distance",duration:"Duration",pace:"Pace",elevation_gain:"Elevation Gain",elevation_loss:"Elevation Loss",steps:"Steps",calories:"Calories",cadence:"Cadence",terrain:"Terrain",rating:"Rating",weather:"Weather",heart_rate:"Heart Rate",dog:"Dog"},M=class extends y{setConfig(t){this._config={...t}}_emitChange(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_setLayout(t){let e=this._config.metrics===void 0||this._config.metrics===q||this._config.metrics===V;this._config={...this._config,layout:t,...e?{metrics:t==="detailed"?V:q,ruck_fields:t==="detailed"?at:ot}:{}},this._emitChange()}_toggle(t,e,s){let i=(this._config[t]??[]).slice(),n=i.indexOf(e);n>=0?i.splice(n,1):(i.push(e),i.sort((o,l)=>s.indexOf(o)-s.indexOf(l))),this._config={...this._config,[t]:i},this._emitChange()}_move(t,e,s){let i=(this._config[t]??[]).slice(),n=e+s;n<0||n>=i.length||([i[e],i[n]]=[i[n],i[e]],this._config={...this._config,[t]:i},this._emitChange())}_renderList(t,e,s,i){let n=this._config[e]??[],o=s.filter(l=>!n.includes(l));return d`
      <div class="gr-editor-section">
        <div class="gr-editor-title">${t}</div>
        <div class="gr-editor-list">
          ${n.map((l,a)=>d`
              <div class="gr-editor-row">
                <label>
                  <input
                    type="checkbox"
                    checked
                    @change=${()=>this._toggle(e,l,s)}
                  />
                  ${i[l]}
                </label>
                <span class="gr-editor-reorder">
                  <button
                    type="button"
                    ?disabled=${a===0}
                    @click=${()=>this._move(e,a,-1)}
                    aria-label="Move ${i[l]} up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    ?disabled=${a===n.length-1}
                    @click=${()=>this._move(e,a,1)}
                    aria-label="Move ${i[l]} down"
                  >
                    ▼
                  </button>
                </span>
              </div>
            `)}
          ${o.map(l=>d`
              <div class="gr-editor-row gr-editor-row-off">
                <label>
                  <input type="checkbox" @change=${()=>this._toggle(e,l,s)} />
                  ${i[l]}
                </label>
              </div>
            `)}
        </div>
      </div>
    `}render(){if(!this.hass||!this._config)return d``;let t=lt(this.hass),e=this._config.layout==="detailed"?"detailed":"compact";return d`
      <div class="gr-editor-section">
        <div class="gr-editor-title">Device</div>
        <select
          @change=${s=>{this._config={...this._config,device_id:s.target.value},this._emitChange()}}
        >
          ${t.map(s=>d`<option value=${s.id} ?selected=${s.id===this._config.device_id}>
              ${s.name}
            </option>`)}
        </select>
        ${t.length===0?d`<p class="gr-editor-hint">No Get-Rucked device found. Add the integration first.</p>`:""}
      </div>

      <div class="gr-editor-section">
        <div class="gr-editor-title">Layout</div>
        <label
          ><input
            type="radio"
            name="layout"
            value="compact"
            .checked=${e==="compact"}
            @change=${()=>this._setLayout("compact")}
          />
          Compact</label
        >
        <label
          ><input
            type="radio"
            name="layout"
            value="detailed"
            .checked=${e==="detailed"}
            @change=${()=>this._setLayout("detailed")}
          />
          Detailed</label
        >
      </div>

      ${this._renderList("Metrics (checked = shown, use \u25B2\u25BC to reorder)","metrics",Bt,Ee)}
      ${this._config.metrics?.includes("latest_ruck")?this._renderList("Latest Ruck fields","ruck_fields",Wt,Se):""}

      <p class="gr-editor-hint">
        You can also edit this card as YAML (switch via the card editor's own toggle) for full control.
      </p>
    `}};M.styles=I`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .gr-editor-section {
      margin-bottom: 20px;
    }
    .gr-editor-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .gr-editor-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;
    }
    .gr-editor-row-off {
      opacity: 0.6;
    }
    .gr-editor-reorder button {
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      cursor: pointer;
      padding: 2px 6px;
      margin-left: 4px;
    }
    .gr-editor-reorder button:disabled {
      opacity: 0.3;
      cursor: default;
    }
    select {
      width: 100%;
      padding: 6px 8px;
      font-size: 13px;
    }
    .gr-editor-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `,P([it()],M.prototype,"_config",2);customElements.define(B,C);customElements.define(nt,M);window.customCards=window.customCards||[];window.customCards.push({type:B,name:"Get-Rucked",description:"Shows your Get-Rucked stats: rank, weekly/monthly distance, training load, the latest ruck, and goals.",preview:!0});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
