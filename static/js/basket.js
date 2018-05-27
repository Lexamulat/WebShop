var basket = {};

function Request(url, postData) {
    return new Promise(resolve => {
        $.post(url, JSON.stringify(postData), function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}


async function Write(cont) {

    let list = $(".BasketList")
    list.empty();

    for (let l = 0; l < cont.length; l++) {
        const el = cont[l];
        let listEl = `<li>${el.Name}</li>`
        list.append(listEl)
    }
}

async function CheckAndDisplayBasket() {
    if (localStorage.getItem('basket') != null) {

        basket = JSON.parse(localStorage.getItem("basket"))
        var arr = [];

        for (var i in basket) {
            arr.push(i)
        }

        const cont = await Request("getOrder", arr)
        console.log(cont)
        await Write(cont)

    } else {
        console.log("bask empty")
    }
}

function ResetAnimation($elem) {
    var effect = $elem.data("effect")
    $elem.before($elem.clone(true));
    var $newElem = $elem.prev();
    $elem.remove();
    $newElem.addClass("animated " + effect);
}

window.onscroll = () => {
    let b = document.getElementsByClassName("basket")[0]
    b.style.top = window.pageYOffset + window.innerHeight - 200 + "px"
}

async function start() {
    console.log("start")
    await CheckAndDisplayBasket()
    $(".menuicon").click(function() {

        var $this = ($(".ModelContent"));
        ResetAnimation($this);


    });
}

$(document).ready(start)