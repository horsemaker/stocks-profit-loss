var heroImg = document.querySelector('#hero-img')
var stockNameInput = document.querySelector('#stock-name')
var stockList = document.querySelector('#stocks')
var purchasePriceInput = document.querySelector('#purchase-price')
var stockQuantityInput = document.querySelector('#stock-quantity')
var checkAction = document.querySelector('#check')
var result = document.querySelector('#result')
var resultText = document.querySelector('#result-text')
// var inputTest = document.querySelector('#input-test')
// var bodyElement = document.getElementsByTagName('body')[0]
// var emoji = document.querySelector('#emoji')
var profitEmojis = document.querySelector('#profitEmojis')
var lossEmojis = document.querySelector('#lossEmojis')
var root = document.documentElement

function giveResult(currentPriceString, purchasePrice, stockQuantity) {
  var currentPrice = parseFloat(currentPriceString)
  // var moneySpent = purchasePrice * stockQuantity

  // console.log(currentPrice)
  // console.log(typeof(currentPrice))
  // console.log(purchasePrice)
  // console.log(typeof(purchasePrice))
  // console.log(stockQuantity)
  // console.log(typeof(stockQuantity))
  // console.log(moneySpent)
  // console.log(typeof(moneySpent))

  if (currentPrice > purchasePrice) {
    var percentProfit = (
      ((currentPrice - purchasePrice) / purchasePrice) *
      100
    ).toFixed(2)
    var absoluteProfit = (
      (currentPrice - purchasePrice) *
      stockQuantity
    ).toFixed(2)
    // console.log('Percent Profit:', percentProfit)
    // console.log('Absolute Profit:', absoluteProfit)
    // resultText.style.zIndex = '1'
    // event.preventDefault()
    // bodyElement.innerHTML += ``

    if (percentProfit >= 50) {
      root.style.setProperty('--primary-color', '#8AFF8A')
      root.style.setProperty('--secondary-color', '#065F46')
      root.style.setProperty('--tertiary-color', '#064E3B')
      root.style.setProperty('--quinary-color', '#064E3B')
      heroImg.src = 'assets/profit.svg'
    }

    lossEmojis.style.display = 'none'
    profitEmojis.style.display = 'block'
    result.style.display = 'block'

    setTimeout(function () {
      profitEmojis.style.display = 'none'
    }, 30000)
    resultText.textContent =
      'You gained ' +
      percentProfit +
      '%. Your total profit is ' +
      absoluteProfit +
      '.'
  } else if (currentPrice < purchasePrice) {
    var percentLoss = (
      ((purchasePrice - currentPrice) / purchasePrice) *
      100
    ).toFixed(2)
    var absoluteLoss = ((purchasePrice - currentPrice) * stockQuantity).toFixed(
      2
    )
    // console.log('Percent Loss:', percentLoss)
    // console.log('Absolute Loss:', absoluteLoss)

    if (percentLoss >= 50) {
      root.style.setProperty('--primary-color', '#EF4444')
      root.style.setProperty('--secondary-color', '#991B1B')
      root.style.setProperty('--tertiary-color', '#B91C1C')
      root.style.setProperty('--quinary-color', '#7F1D1D')
      heroImg.src = 'assets/loss.svg'
    }

    profitEmojis.style.display = 'none'
    lossEmojis.style.display = 'block'
    result.style.display = 'block'

    setTimeout(function () {
      lossEmojis.style.display = 'none'
    }, 30000)
    resultText.textContent =
      'You lost ' + percentLoss + '%. Your total loss is ' + absoluteLoss + '.'
  } else if (currentPrice === purchasePrice) {
    result.style.display = 'block'
    resultText.textContent = 'Perfectly balanced!'
  }
}

function inputHandler(event) {
  event.preventDefault()

  // console.log(stockCodeInput)
  // console.log(stockCodeInput.value)
  // console.log(typeof(stockCodeInput.value))

  // console.log(purchasePriceInput)
  // console.log(purchasePriceInput.value)
  // console.log(typeof(purchasePriceInput.value))

  // console.log(stockQuantityInput)
  // console.log(stockQuantityInput.value)
  // console.log(typeof(stockQuantityInput.value))

  if (!stockNameInput.value) {
    alert("Enter a valid stock name!")
    return
  }

  if (!purchasePriceInput.value || !stockQuantityInput.value) {
    alert("Please enter valid values in all the fields!")
    return
  }

  var stockName = stockNameInput.value
  var stockDetails = stockName.split(' - ')
  // console.log(stockDetails)
  var stockCode = stockDetails[1]
  // console.log(stockCode)
  // console.log(typeof(stockCode))
  var purchasePrice = parseFloat(purchasePriceInput.value)
  var stockQuantity = parseInt(stockQuantityInput.value)

  if (purchasePrice <= 0 || stockQuantity <= 0) {
    alert("Values can't be 0 or less than 0!")
    return
  }

  // console.log(stockCode)
  // console.log(typeof(stockCode))

  // console.log(purchasePrice)
  // console.log(typeof(purchasePrice))

  // console.log(stockQuantity)
  // console.log(typeof(stockQuantity))

  var fetchPriceURL =
    'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' +
    stockCode +
    '&apikey=W1UR6RQS7NO83YPW'

  // console.log(fetchPriceURL)

  fetch(fetchPriceURL)
    .then((response) =>
      // console.log(response)
      // console.log(response.json())
      //   stockObject = response.json()
      //   console.log(stockObject)
      response.json()
    )
    .then((resJSON) =>
      giveResult(
        resJSON['Global Quote']['08. previous close'],
        purchasePrice,
        stockQuantity
      )
    )
}

function updateStockList(event) {
  // inputTest.textContent = event.target.value

  if (event.target.value === '') {
    // console.log('i am working')
    return
  }

  stockList.innerHTML = ''

  // if (document.querySelectorAll('.stock-option')) {
  //   // console.log(document.querySelectorAll('.stock-option'))
  //  var optionList = document.querySelectorAll('.stock-option')
  //  for(var i = 0; i < optionList.length; i) {
  //    optionList[0].remove()
  //  }
  // }

  var fetchStocksURL =
    'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
    event.target.value +
    '&apikey=W1UR6RQS7NO83YPW'

  // console.log(fetchStocksURL)

  fetch(fetchStocksURL)
    .then((response) => response.json())
    .then((resJSON) => {
      resJSON['bestMatches'].map((stock) => {
        var stockOption = document.createElement('option')
        stockOption.classList.add('stock-option')
        stockOption.value = stock['2. name'] + ' - ' + stock['1. symbol']
        stockList.appendChild(stockOption)
      })
    })
    .catch((err) => console.log(err))
}

checkAction.addEventListener('click', inputHandler)
stockNameInput.addEventListener('input', updateStockList)

// console.log(resJSON["bestMatches"].map((stock) => stock["2. name"]))
