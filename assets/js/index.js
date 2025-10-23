import { areas } from "/assets/js/areaOptions";
import { registerFrontValidate } from "/assets/js/frontValidator";
import * as UI_Template from "/assets/js/htmlTemplate";

// 常數定義 集中一處 管理
const constants = {
  areaSelectId: "searchByArea",
  areaSelectInAddId: "ticketRegion",
  cardContainerId: "ticketCards",
  addCardSucessMsgId: "addNewCardSuccess",
  canotFindAreaId: "cantFind-area",
  filterResultId: "searchResult-text",
  validator_Constants: {
    inputFormId: "newTicketForm",
    alertDivClass: "alert-message",
    addNewCardId: "addNewCard",
  },
  newTicketFormId: "newTicketForm",
  selectAllValue: "全部",
  jsonUrl:
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json",
  modalOverlayId: "success-modal-overlay",
};

let tickets = [];
let modalTimerId;
let afterModal = null;

//index.htl documentContentLoaded 後執行
export function InitHandler() {
  registryAddCard(); // 註冊新增套票按鈕
  registryModalMsg();
  registryChangeAreaOption(); // 註冊 與 處理 地區篩選下拉選單
  loadTicketJson_InitCards(constants.jsonUrl);
}

function registryChangeAreaOption() {
  const selectInAddElem = document.getElementById(constants.areaSelectInAddId);
  const selectElem = document.getElementById(constants.areaSelectId);
  selectElem.addEventListener("change", (e) => initCards(e.target.value));
  let innerHtml = UI_Template.AreaDefaultOptionHtml;
  let innerHtmlInAdd = UI_Template.AreaDefaultOptionHtml;
  areas.forEach((area, index) => {
    const newOptionHtml = UI_Template.createAreaOptionHtml(area);
    innerHtml += newOptionHtml;
    if (index != 0) innerHtmlInAdd += newOptionHtml;
  });
  selectInAddElem.innerHTML = innerHtmlInAdd;
  selectElem.innerHTML = innerHtml;
}
function initCards(filtBy) {
  const containerElem = document.getElementById(constants.cardContainerId);
  const resultMsgElem = document.getElementById(constants.filterResultId);
  let innerHtml = "";
  let resultCount = 0;
  tickets.forEach((card, index) => {
    if (filtBy === constants.selectAllValue || card.area === filtBy) {
      innerHtml += UI_Template.createCardHtml(card);
      resultCount++;
    }
  });
  containerElem.innerHTML = innerHtml;
  areaRatioPlotting();
  resultMsgElem.innerText = `本次搜尋共 ${resultCount} 筆資料`;
  handleFilterNotFound(resultCount);
}

function registryAddCard() {
  const addBtnElem = document.getElementById(
    constants.validator_Constants.addNewCardId
  );
  addBtnElem.addEventListener("click", addNewTicket);
  registerFrontValidate(constants.validator_Constants);
}

function addNewTicket() {
  const addTicketFormElem = document.getElementById(constants.newTicketFormId);
  if (!addTicketFormElem.reportValidity()) return;

  const formData = new FormData(addTicketFormElem);
  const inputElems = addTicketFormElem.querySelectorAll("[name][property]");
  const newTicket = {};
  newTicket.id = tickets.length;

  inputElems.forEach((inputElem) => {
    const fieldName = inputElem.getAttribute("name");
    const fieldProperty = inputElem.getAttribute("property");
    newTicket[fieldProperty] = formData.get(fieldName);
  });
  tickets.push(newTicket);
  initCards(constants.selectAllValue);
  const modal_overlay_Elem = document.getElementById(
    constants.addCardSucessMsgId
  );
  afterModal = () => {
    addTicketFormElem.reset();
    addTicketFormElem
      .querySelectorAll(`.${constants.validator_Constants.alertDivClass}`)
      .forEach((alertDiv) => {
        alertDiv.classList.toggle("hidden", true);
      });
    afterModal = null;
  };
  modal_msg_show("套票新增成功！", undefined, afterModal);

  document.getElementById(constants.areaSelectId).value =
    constants.selectAllValue;
}

function loadTicketJson_InitCards(url, responseTimeout = 5000) {
  axios
    .get(url, { timeout: responseTimeout })
    .then(function (response) {
      tickets.length = 0;
      Array.prototype.push.apply(tickets, response.data);
      initCards(constants.selectAllValue);
      document.getElementById(constants.areaSelectId).value =
        constants.selectAllValue;
    })
    .catch(function (error) {
      let errMsg = error.message;
      if (error.stack) errMsg += error.stack;
      if (error.response) errMsg += error.response;
      if (error.request) errMst += error.request;

      alert(`載入 JSON失敗；請檢察網路連線、或URL ${url}是否正確`);
    });
}

function handleFilterNotFound(resultCount) {
  const msgArea = document.getElementById(constants.canotFindAreaId);
  msgArea.style.display = resultCount == 0 ? "block" : "none";
}

function registryModalMsg() {
  const modalElem = document.querySelector(
    `#${constants.modalOverlayId} .modal`
  );
  modalElem.addEventListener("click", () => {
    clearTimeout(modalTimerId);
    if (afterModal != null) afterModal();
    modalElem.parentElement.classList.remove("active");
  });
}
function modal_msg_show(msg, timeout = 3000, aftershowHandler = null) {
  const modalOverlayElem = document.getElementById(constants.modalOverlayId);
  modalOverlayElem.querySelector(".alt-msg-text").textContent = msg;
  modalOverlayElem.classList.add("active");
  modalTimerId = setTimeout(function () {
    modalOverlayElem.classList.remove("active");
    if (aftershowHandler != null) aftershowHandler();
  }, timeout);
}

function modal_msg_close(afterCloseHandler = null) {
  const modalOverlayElem = document.getElementById(constants.modalOverlayId);
  modalOverlayElem.classList.remove("active");
}

function areaRatioPlotting() {
  const areaCountArr = {};
  tickets.forEach((ticket) => {
    if (areaCountArr[ticket.area] == undefined) {
      areaCountArr[ticket.area] = 1;
    } else {
      areaCountArr[ticket.area] += 1;
    }
  });
  const plotData = [];
  for (const area in areaCountArr) {
    plotData.push([area, areaCountArr[area]]);
  }
  const chart = c3.generate({
    bindto: "#areaRatioPlotting",
    size: { width: 162, height: 192 },
    data: {
      columns: plotData,
      type: "donut",
    },
    donut: {
      title: "套票地區比重",
    },
  });
}
