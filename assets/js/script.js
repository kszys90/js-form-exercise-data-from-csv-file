document.addEventListener('DOMContentLoaded', function () {
    bracketItemProto.remove()
    liItem.remove()
    const uploader = document.querySelector('.uploader__label')
    uploader.addEventListener('change', function readFile(e) {
        const file = e.target.files[0]

        if (file && file.type.includes('text/csv')) {
            const reader = new FileReader()

            reader.onload = function (readerEvent) {
                const contentUnsplitted = readerEvent.target.result
                const content = splitString(contentUnsplitted, '","')
                if (content) {
                    pushContent(content)
                }
                const forms = document.querySelectorAll('.excursions__form')
                if (forms) {
                    addToBracket(forms)
                }

            }
            reader.readAsText(file, 'UTF-8')
        }

    })

})

const bracketItemProto = document.querySelector('.summary__item--prototype')
const liItem = document.querySelector('.excursions__item--prototype')
const bracketSum = document.querySelector('.order__total-price-value')
bracketSum.innerText = '0 PLN'
const bracket = []
const orderForm = document.querySelector('.panel__order')
const orderSubmit = orderForm.querySelector('.order__field-submit')
orderForm.addEventListener('submit', makeOrder)


function splitString(element, separator) {
    const splitToRows = element.split(/[\r\n]+/gm)
    let arrayOfStrings = []
    splitToRows.forEach(function (el) {
        arrayOfStrings.push(el.split(separator))
    })
    if (arrayOfStrings) {
        arrayOfStrings.forEach(function (el) {
            el[0] = el[0].replace(/"/g, "")
            const elLength = el.length - 1
            el[elLength] = el[elLength].replace(/"/g, "")

        })
    }
    return arrayOfStrings
}
function pushContent(element) {

    const ulItem = document.querySelector('.panel__excursions')
    if (element && element.length > 0) {
        for (let i = 0; i < element.length; i++) {
            const newLiItem = liItem.cloneNode(true)
            ulItem.appendChild(newLiItem)
        }
    }
    const title = []
    const desc = []
    const price = []

    const liList = document.querySelectorAll('.excursions__item--prototype')
    for (let i = 0; i < element.length; i++) {
        title[i] = liList[i].querySelector('.excursions__title')
        desc[i] = liList[i].querySelector('.excursions__description')
        price[i] = liList[i].querySelectorAll('.excursions__price')
        title[i].innerText = element[i][1]
        desc[i].innerText = element[i][2]
        price[i][0].innerText = element[i][3]
        price[i][1].innerText = element[i][4]
    }

}
function addToBracket(element) {
    const bracketEl = document.querySelector('.panel__summary')

    element.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault()
            const bracketItem = bracketItemProto.cloneNode(true)
            bracket.push(bracketItem)
            const formParent = form.parentNode
            const title = formParent.querySelector('.excursions__title')
            const price = formParent.querySelectorAll('.excursions__price')
            const itemTitle = bracketItem.querySelector('.summary__name')
            itemTitle.innerText = title.innerText
            if (bracketEl.length > 0) {
                bracketEl[bracketEl.length].appendChild(bracketItem)
            }
            else {
                bracketEl.appendChild(bracketItem)
            }
            const elementTitle = bracketItem.querySelector('.summary__name')
            const elementSum = bracketItem.querySelector('.summary__total-price')
            const elementPrice = bracketItem.querySelector('.summary__prices')
            const amount = formParent.querySelectorAll('.excursions__field-input')
            elementTitle.innerText = title.innerText
            if (amount[0].value && amount[1].value && amount[0].value > -1 && amount[1].value > -1 && Number.isInteger(Number(amount[0].value)) === true && Number.isInteger(Number(amount[1].value)) === true) {
                elementPrice.innerText = 'Dorośli:' + amount[0].value + ' x ' + price[0].innerText + ' PLN, ' + 'Dzieci:' + amount[1].value + ' x ' + price[1].innerText + ' PLN'
                elementSum.innerText = Number(amount[0].value) * Number(price[0].innerText) + Number(amount[1].value) * Number(price[1].innerText) + ' PLN'
                const elementValue = Number(amount[0].value) * Number(price[0].innerText) + Number(amount[1].value) * Number(price[1].innerText)
                if (bracketSum.innerText === '0 PLN') {
                    bracketSum.innerText = Number(elementValue) + ' PLN'
                }
                else {
                    const splittedSum = bracketSum.innerText.split(' ')
                    bracketSum.innerText = Number(splittedSum[0]) + Number(elementValue) + ' PLN'
                }
                amount[0].value = ''
                amount[1].value = ''
                const removeButton = bracketItem.querySelector('.summary__btn-remove')
                if (removeButton) {
                    removeButton.setAttribute('onclick', 'event.preventDefault()')
                }

            }
            else {
                bracketItem.remove()
                alert('Sprawdź wpisane dane i spóbuj ponownie')
            }
            removeBracketItem()
        })

    })
}
function removeBracketItem() {
    if (bracket.length > 0) {
        const removeButtons = document.querySelectorAll('.summary__btn-remove')
        removeButtons.forEach(function (item) {
            item.addEventListener('click', function (e) {
                const buttonParent = item.parentNode
                const bracketItemToRemove = buttonParent.parentNode
                for (let i = 0; i < bracket.length; i++) {
                    if (bracket[i] === bracketItemToRemove) {
                        const removeValueEl = bracketItemToRemove.querySelector('.summary__total-price')
                        const removeValueSplit = removeValueEl.innerText.split(' ')
                        const removeValue = removeValueSplit[0]
                        const bracketValueEl = document.querySelector('.order__total-price-value')
                        const bracketValueSplit = bracketValueEl.innerText.split(' ')
                        const bracketValue = bracketValueSplit[0]
                        bracketValueEl.innerText = Number(bracketValue) - Number(removeValue) + ' PLN'
                        bracket.splice(i, 1)
                    }
                }
                bracketItemToRemove.remove()

            })
        })

    }

}
function makeOrder(event) {

    const name = document.querySelector('[name="name"]')
    const email = document.querySelector('[name="email"]')
    const emailVal = email.value
    function ValidateEmail(mail) {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (mail.match(validRegex)) {
            return true;
        } else {
            return false;
        }

    }
    if ((bracket.length > 0)) {
        if (name && email && name.value.length > 1) {
            if (ValidateEmail(emailVal) === true) {

                alert(
                    'Gratulacje '
                    + name.value
                    + ' udało Ci się zamówić wycieczki!'
                    + ' Szczegóły zamówienia zostały wysłane na '
                    + email.value)

            }
            else {
                event.preventDefault()
                alert('Podany email jest niepoprawny. Spróbuj ponownie')
            }
        }
        else {
            event.preventDefault()
            alert('Podane imię i nazwisko jest niepoprawne. Spróbuj ponownie')
        }
    }
    else {
        event.preventDefault()
        alert('Koszyk jest pusty!')
    }
}