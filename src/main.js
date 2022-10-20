import "./css/index.css"
import IMask from "imask"

const ccBg01 = document.querySelector(".cc-bg-01")
const ccBg02 = document.querySelector(".cc-bg-02")
const ccLogo = document.querySelector(".cc-icon-logo")

function setCcBgColor(flag) {
  const colors = {
    visa: ["#1e5799", "#7db9e8"],
    mastercard: ["#e67e22", "red"],
    binance: ["#e67e22", "#79bf00"],
    discover: ["#1e5799", "#7db9e8"],
    default: ["#000", "gray"],
  }

  ccBg01.setAttribute("fill", colors[flag][0])
  ccBg02.setAttribute("fill", colors[flag][1])
  ccLogo.setAttribute("src", `cc-${flag}.svg`)
}

// CVC
const cvc = document.querySelector("#security-code")
const cvcMask = {
  mask: "000",
}
const maskCvc = IMask(cvc, cvcMask)

// Expiration date
const expDate = document.querySelector("#expiration-date")
const expDateMask = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      maxLength: 2,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
      maxLength: 2,
    },
  },
}
const maskExpiratioDate = IMask(expDate, expDateMask)

// Card number
let flag = "default"
const cardNumber = document.querySelector("#card-number")
const cardNumberMask = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      RegExp: /^4\d{0,15}/,
      carType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      RegExp: /^9\d{0,15}/,
      carType: "binance",
    },
    {
      mask: "0000 0000 0000 0000",
      RegExp: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      carType: "discover",
    },
    {
      mask: "0000 0000 0000 0000",
      RegExp: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      carType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      carType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.RegExp)
    })
    flag = foundMask ? foundMask.carType : "default"
    setCcBgColor(flag)
    return foundMask
  },
}
const maskCardNumber = IMask(cardNumber, cardNumberMask)

const addBuuton = document.querySelector("#add-card")
addBuuton.addEventListener("click", function (event) {
  event.preventDefault()
  alert("Card Number: ")
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", function (event) {
  const cardHolderName = document.querySelector(".cc-holder .value")
  cardHolder.value.length === 0
    ? (cardHolderName.textContent = "Fulano da silva")
    : (cardHolderName.textContent = cardHolder.value.toUpperCase())
})

// const cardHolderNumber = document.querySelector("#card-number")
// cardHolderNumber.addEventListener("input", function (event) {
//   const ccNumber = document.querySelector(".cc-info .cc-number")
//   cardHolderNumber.value.length === 0
//     ? (ccNumber.textContent = "0000 0000 0000 0000")
//     : (ccNumber.textContent = cardHolderNumber.value)
// })

// const inputExpirationDate = document.querySelector("#expiration-date")
// inputExpirationDate.addEventListener("input", (e) => {
//   const ccExpirationDate = document.querySelector(".cc-expiration .value")
//   inputExpirationDate.value.length === 0
//     ? (ccExpirationDate.textContent = "02/32")
//     : (ccExpirationDate.textContent = inputExpirationDate.value)
// })

maskCardNumber.on("accept", () => {
  updateCardNumber(maskCardNumber.value)
})
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerHTML = number.length === 0 ? "1234 5678 9012 3456" : number
}

maskExpiratioDate.on("accept", () => {
  updateExpirationDate(maskExpiratioDate.value)
})
function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")
  ccExpirationDate.innerHTML = date.length === 0 ? "02/32" : date
}

maskCvc.on("accept", () => {
  updateSecurityCode(maskCvc.value)
})
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerHTML = code.length === 0 ? "123" : code
}
