(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const f=[{text:"全部地區",value:"全部"},{text:"台北",value:"台北"},{text:"台中",value:"台中"},{text:"高雄",value:"高雄"},{text:"東部",value:"東部"}];function p(e){const l=document.getElementById(e.inputFormId);document.getElementById(e.addNewCardId),l.querySelectorAll("input, select, textarea").forEach(t=>{const a=t.parentElement.parentElement.querySelector(`.${e.alertDivClass}`);t.addEventListener("input",function(){this.type!=="hidden"&&(this.validity.valid?a.classList.toggle("hidden",!0):a.classList.toggle("hidden",!1))})})}const g=e=>`
<li class="ticketCard">
          <div class="ticketCard-img">
            <a href="#">
              <img
                src="${e.imgUrl}"
                alt=""
              />
            </a>
            <div class="ticketCard-region">${e.area}</div>
            <div class="ticketCard-rank">${e.rate}</div>
          </div>
          <div class="ticketCard-content">
            <div>
              <h3>
                <a href="#" class="ticketCard-name">${e.name}</a>
              </h3>
              <p class="ticketCard-description">
                ${e.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${e.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${e.price}</span>
              </p>
            </div>
          </div>
        </li>
`,v=e=>`
<option value="${e.value}">${e.text}</option>
`,u='<option value="" disabled selected hidden>地區搜尋</option>',i={areaSelectId:"searchByArea",areaSelectInAddId:"ticketRegion",cardContainerId:"ticketCards",addCardSucessMsgId:"addNewCardSuccess",canotFindAreaId:"cantFind-area",filterResultId:"searchResult-text",validator_Constants:{inputFormId:"newTicketForm",alertDivClass:"alert-message",addNewCardId:"addNewCard"},newTicketFormId:"newTicketForm",selectAllValue:"全部",jsonUrl:"https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json",modalOverlayId:"success-modal-overlay"};let s=[],m,d=null;function y(){h(),k(),I(),E(i.jsonUrl)}function I(){const e=document.getElementById(i.areaSelectInAddId),l=document.getElementById(i.areaSelectId);l.addEventListener("change",n=>c(n.target.value));let t=u,a=u;f.forEach((n,r)=>{const o=v(n);t+=o,r!=0&&(a+=o)}),e.innerHTML=a,l.innerHTML=t}function c(e){const l=document.getElementById(i.cardContainerId),t=document.getElementById(i.filterResultId);let a="",n=0;s.forEach((r,o)=>{(e===i.selectAllValue||r.area===e)&&(a+=g(r),n++)}),l.innerHTML=a,w(),t.innerText=`本次搜尋共 ${n} 筆資料`,A(n)}function h(){document.getElementById(i.validator_Constants.addNewCardId).addEventListener("click",C),p(i.validator_Constants)}function C(){const e=document.getElementById(i.newTicketFormId);if(!e.reportValidity())return;const l=new FormData(e),t=e.querySelectorAll("[name][property]"),a={};a.id=s.length,t.forEach(n=>{const r=n.getAttribute("name"),o=n.getAttribute("property");a[o]=l.get(r)}),s.push(a),c(i.selectAllValue),document.getElementById(i.addCardSucessMsgId),d=()=>{e.reset(),e.querySelectorAll(`.${i.validator_Constants.alertDivClass}`).forEach(n=>{n.classList.toggle("hidden",!0)}),d=null},L("套票新增成功！",void 0,d),document.getElementById(i.areaSelectId).value=i.selectAllValue}function E(e,l=5e3){axios.get(e,{timeout:l}).then(function(t){s.length=0,Array.prototype.push.apply(s,t.data),c(i.selectAllValue),document.getElementById(i.areaSelectId).value=i.selectAllValue}).catch(function(t){let a=t.message;t.stack&&(a+=t.stack),t.response&&(a+=t.response),t.request&&(errMst+=t.request),alert(`載入 JSON失敗；請檢察網路連線、或URL ${e}是否正確`)})}function A(e){const l=document.getElementById(i.canotFindAreaId);l.style.display=e==0?"block":"none"}function k(){const e=document.querySelector(`#${i.modalOverlayId} .modal`);e.addEventListener("click",()=>{clearTimeout(m),d!=null&&d(),e.parentElement.classList.remove("active")})}function L(e,l=3e3,t=null){const a=document.getElementById(i.modalOverlayId);a.querySelector(".alt-msg-text").textContent=e,a.classList.add("active"),m=setTimeout(function(){a.classList.remove("active"),t!=null&&t()},l)}function w(){const e={};s.forEach(t=>{e[t.area]==null?e[t.area]=1:e[t.area]+=1});const l=[];for(const t in e)l.push([t,e[t]]);c3.generate({bindto:"#areaRatioPlotting",size:{width:162,height:192},data:{columns:l,type:"donut"},donut:{title:"套票地區比重"}})}console.log("JS week7 homework");document.addEventListener("DOMContentLoaded",y);
