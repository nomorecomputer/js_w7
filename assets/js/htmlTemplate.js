export const createCardHtml = (card) => `
<li class="ticketCard">
          <div class="ticketCard-img">
            <a href="#">
              <img
                src="${card.imgUrl}"
                alt=""
              />
            </a>
            <div class="ticketCard-region">${card.area}</div>
            <div class="ticketCard-rank">${card.rate}</div>
          </div>
          <div class="ticketCard-content">
            <div>
              <h3>
                <a href="#" class="ticketCard-name">${card.name}</a>
              </h3>
              <p class="ticketCard-description">
                ${card.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${card.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${card.price}</span>
              </p>
            </div>
          </div>
        </li>
`;

export const createAreaOptionHtml = (area) => `
<option value="${area.value}">${area.text}</option>
`;
export const AreaDefaultOptionHtml = `<option value="" disabled selected hidden>地區搜尋</option>`;
