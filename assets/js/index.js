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

let tickets = []; // 套票資料陣列
let modalTimerId; // modal 計時器 ID
let afterModal = null; // modal 關閉後執行的 callback function

//index.htl documentContentLoaded 後執行
export function InitHandler() {
  registryAddCard(); // 註冊新增套票按鈕
  registryModalMsg(); // 註冊 modal 訊息視窗
  registryChangeAreaOption(); // 註冊 與 處理 地區篩選下拉選單
  loadTicketJson_InitCards(constants.jsonUrl); // 載入 JSON 套票資料，並初始化套票卡片
}

// 註冊 與 處理 地區篩選下拉選單
function registryChangeAreaOption() {
  const selectInAddElem = document.getElementById(constants.areaSelectInAddId);
  const selectElem = document.getElementById(constants.areaSelectId);
  selectElem.addEventListener("change", (e) =>
    initCards(e.target.value, false)
  );
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
// 初始化 套票卡片 filtered by 地區(constants.selectAllValue: 全部),replotting: 是否重繪 圖表
function initCards(filtBy, replotting = true) {
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
  if (replotting) areaRatioPlotting();
  resultMsgElem.innerText = `本次搜尋共 ${resultCount} 筆資料`;
  handleFilterNotFound(resultCount);
}
// 註冊 新增套票 按鈕 與 表單驗證
function registryAddCard() {
  const addBtnElem = document.getElementById(
    constants.validator_Constants.addNewCardId
  );
  addBtnElem.addEventListener("click", addNewTicket);
  registerFrontValidate(constants.validator_Constants);
}
// 新增套票
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
  // 清除表單內容 與 驗證訊息
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
// 載入 JSON 套票資料，並初始化套票卡片
function loadTicketJson_InitCards(url, responseTimeout = 6000) {
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
      if (error.request) errMsg += error.request;

      alert(`載入 JSON失敗；請檢察網路連線、或URL ${url}是否正確`);
    });
}
// 處理 篩選無結果 顯示訊息
function handleFilterNotFound(resultCount) {
  const msgArea = document.getElementById(constants.canotFindAreaId);
  msgArea.style.display = resultCount == 0 ? "block" : "none";
}
// 註冊 modal 訊息視窗 點擊關閉事件 ， 如果有設定 afterModal 會在關閉後執行
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
// 顯示 modal 訊息視窗 timeout: 自動關閉時間(毫秒) aftershowHandler: 自動關閉後執行的 callback function
function modal_msg_show(msg, timeout = 3000, aftershowHandler = null) {
  const modalOverlayElem = document.getElementById(constants.modalOverlayId);
  modalOverlayElem.querySelector(".alt-msg-text").textContent = msg;
  modalOverlayElem.classList.add("active");
  modalTimerId = setTimeout(function () {
    modalOverlayElem.classList.remove("active");
    if (aftershowHandler != null) aftershowHandler();
  }, timeout);
}
// 關閉 modal 訊息視窗 afterCloseHandler: 關閉後執行的 callback function
function modal_msg_close(afterCloseHandler = null) {
  const modalOverlayElem = document.getElementById(constants.modalOverlayId);
  modalOverlayElem.classList.remove("active");
}
// 套票地區比重 圖表繪製
function areaRatioPlotting() {
  const areaCountArr = {};
  tickets.forEach(
    (ticket) =>
      (areaCountArr[ticket.area] = (areaCountArr[ticket.area] || 0) + 1)
  );

  const chart = c3.generate({
    bindto: "#areaRatioPlotting",
    size: { width: 162, height: 192 },
    data: {
      columns: Object.entries(areaCountArr),
      type: "donut",
    },
    donut: {
      title: "套票地區比重",
    },
  });
}
