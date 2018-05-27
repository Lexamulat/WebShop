var basket = {};

function CheckAndDisplayBasket() {
    if (localStorage.getItem("basket") != null) {
        basket = JSON.parse(localStorage.getItem("basket"))
    }
    console.log(basket)
    var out = '';
    for (var i in basket) {
        out += basket[i]
    }
    $(".BasketList").html(out);
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

function start() {
    console.log("start")
    CheckAndDisplayBasket()
    $(".menuicon").click(function() {

        var $this = ($(".ModelContent"));
        ResetAnimation($this);


    });
}

$(document).ready(start)