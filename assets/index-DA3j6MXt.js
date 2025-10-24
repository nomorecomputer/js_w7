(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(t){if(t.ep)return;t.ep=!0;const r=n(t);fetch(t.href,r)}})();const f=[{text:"全部地區",value:"全部"},{text:"台北",value:"台北"},{text:"台中",value:"台中"},{text:"高雄",value:"高雄"},{text:"東部",value:"東部"}];function p(e){const l=document.getElementById(e.inputFormId);document.getElementById(e.addNewCardId),l.querySelectorAll("input, select, textarea").forEach(n=>{const a=n.parentElement.parentElement.querySelector(`.${e.alertDivClass}`);n.addEventListener("input",function(){this.type!=="hidden"&&(this.validity.valid?a.classList.toggle("hidden",!0):a.classList.toggle("hidden",!1))})})}const g=e=>`
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
`,u='<option value="" disabled selected hidden>地區搜尋</option>',i={areaSelectId:"searchByArea",areaSelectInAddId:"ticketRegion",cardContainerId:"ticketCards",addCardSucessMsgId:"addNewCardSuccess",canotFindAreaId:"cantFind-area",filterResultId:"searchResult-text",validator_Constants:{inputFormId:"newTicketForm",alertDivClass:"alert-message",addNewCardId:"addNewCard"},newTicketFormId:"newTicketForm",selectAllValue:"全部",jsonUrl:"https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json",modalOverlayId:"success-modal-overlay"};let d=[],m,o=null;function y(){h(),k(),I(),E(i.jsonUrl)}function I(){const e=document.getElementById(i.areaSelectInAddId),l=document.getElementById(i.areaSelectId);l.addEventListener("change",t=>c(t.target.value,!1));let n=u,a=u;f.forEach((t,r)=>{const s=v(t);n+=s,r!=0&&(a+=s)}),e.innerHTML=a,l.innerHTML=n}function c(e,l=!0){const n=document.getElementById(i.cardContainerId),a=document.getElementById(i.filterResultId);let t="",r=0;d.forEach((s,S)=>{(e===i.selectAllValue||s.area===e)&&(t+=g(s),r++)}),n.innerHTML=t,l&&w(),a.innerText=`本次搜尋共 ${r} 筆資料`,A(r)}function h(){document.getElementById(i.validator_Constants.addNewCardId).addEventListener("click",C),p(i.validator_Constants)}function C(){const e=document.getElementById(i.newTicketFormId);if(!e.reportValidity())return;const l=new FormData(e),n=e.querySelectorAll("[name][property]"),a={};a.id=d.length,n.forEach(t=>{const r=t.getAttribute("name"),s=t.getAttribute("property");a[s]=l.get(r)}),d.push(a),c(i.selectAllValue),document.getElementById(i.addCardSucessMsgId),o=()=>{e.reset(),e.querySelectorAll(`.${i.validator_Constants.alertDivClass}`).forEach(t=>{t.classList.toggle("hidden",!0)}),o=null},L("套票新增成功！",void 0,o),document.getElementById(i.areaSelectId).value=i.selectAllValue}function E(e,l=6e3){axios.get(e,{timeout:l}).then(function(n){d.length=0,Array.prototype.push.apply(d,n.data),c(i.selectAllValue),document.getElementById(i.areaSelectId).value=i.selectAllValue}).catch(function(n){let a=n.message;n.stack&&(a+=n.stack),n.response&&(a+=n.response),n.request&&(a+=n.request),alert(`載入 JSON失敗；請檢察網路連線、或URL ${e}是否正確`)})}function A(e){const l=document.getElementById(i.canotFindAreaId);l.style.display=e==0?"block":"none"}function k(){const e=document.querySelector(`#${i.modalOverlayId} .modal`);e.addEventListener("click",()=>{clearTimeout(m),o!=null&&o(),e.parentElement.classList.remove("active")})}function L(e,l=3e3,n=null){const a=document.getElementById(i.modalOverlayId);a.querySelector(".alt-msg-text").textContent=e,a.classList.add("active"),m=setTimeout(function(){a.classList.remove("active"),n!=null&&n()},l)}function w(){const e={};d.forEach(l=>e[l.area]=(e[l.area]||0)+1),c3.generate({bindto:"#areaRatioPlotting",size:{width:162,height:192},data:{columns:Object.entries(e),type:"donut"},donut:{title:"套票地區比重"}})}console.log("JS week7 homework");document.addEventListener("DOMContentLoaded",y);
