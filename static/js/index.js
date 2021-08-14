"use strict";

const calcFinalPrice = function (a, b) {
  let total = a * b;
  return total;
};

const calcTax = function (a, b) {
  let total = Math.round(a * 0.13 * b);
  return total;
};

const calcTaxTotal = function (a, b) {
  let total = a + b;
  return total;
};

document.querySelector(".card1").addEventListener("click", function () {
  const priceValOneMonth = Number(
    document.querySelector(".checkPrice1").textContent
  );

  document.querySelector(".finalPrice").textContent = calcFinalPrice(
    1,
    priceValOneMonth
  );
  document.querySelector(".TaxPrice").textContent = calcTax(
    priceValOneMonth,
    1
  );

  document.querySelector(".finalTaxWithTotal").textContent = calcTaxTotal(
    calcTax(priceValOneMonth, 1),
    calcFinalPrice(1, priceValOneMonth)
  );

  document.querySelector(".monthTotal").textContent = 1;
});

document.querySelector(".card2").addEventListener("click", function () {
  const priceValTwelveMonth = Number(
    document.querySelector(".checkPrice12").textContent
  );
  document.querySelector(".finalPrice").textContent = calcFinalPrice(
    12,
    priceValTwelveMonth
  );
  document.querySelector(".TaxPrice").textContent = calcTax(
    priceValTwelveMonth,
    12
  );

  document.querySelector(".finalTaxWithTotal").textContent = calcTaxTotal(
    calcTax(priceValTwelveMonth, 12),
    calcFinalPrice(12, priceValTwelveMonth)
  );
  document.querySelector(".monthTotal").textContent = 12;
});

document.querySelector(".card3").addEventListener("click", function () {
  const priceValtwentyFourMonth = Number(
    document.querySelector(".checkPrice24").textContent
  );
  document.querySelector(".finalPrice").textContent = calcFinalPrice(
    24,
    priceValtwentyFourMonth
  );
  document.querySelector(".TaxPrice").textContent = calcTax(
    priceValtwentyFourMonth,
    24
  );
  document.querySelector(".finalTaxWithTotal").textContent = calcTaxTotal(
    calcTax(priceValtwentyFourMonth, 24),
    calcFinalPrice(24, priceValtwentyFourMonth)
  );
  document.querySelector(".monthTotal").textContent = 24;
});

document.querySelector(".card4").addEventListener("click", function () {
  const priceValThirtySixMonth = Number(
    document.querySelector(".checkPrice36").textContent
  );
  document.querySelector(".finalPrice").textContent = calcFinalPrice(
    36,
    priceValThirtySixMonth
  );
  document.querySelector(".TaxPrice").textContent = calcTax(
    priceValThirtySixMonth,
    36
  );
  document.querySelector(".finalTaxWithTotal").textContent = calcTaxTotal(
    calcTax(priceValThirtySixMonth, 36),
    calcFinalPrice(36, priceValThirtySixMonth)
  );
  document.querySelector(".monthTotal").textContent = 36;
});

document.querySelector(".finalCheckOut").addEventListener("click", function () {
  document.querySelector(".finalPrice").textContent = 0;
  document.querySelector(".TaxPrice").textContent = 0;
  document.querySelector(".finalTaxWithTotal").textContent = 0;
});
