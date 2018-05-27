"use strict";
//async info
// https://www.youtube.com/watch?v=5kAPExqSZ1I

// async function Request(url, postData) {
//     return $.post(url, JSON.stringify(postData), function(data, textStatus) {
//         console.log("1")
//     }, "json");
// }
//THIS Asynchro function returns promise by @async function@

function Request(url, postData) {
    return new Promise(resolve => {
        // console.log(url)
        $.post(url, JSON.stringify(postData), function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}
//THIS synchro function returns promise by @return new Promise@



async function WriteBmenu(BMenu) {
    console.log("WriteBmenu");
    console.log(BMenu);

    let list = $(".BurgsMenu")
    list.empty();

    for (let i = 0; i < BMenu.length; i++) {
        const el = BMenu[i];
        let listEl = `
        <div class="card wow zoomIn" data-wow-duration="2s">
            <img class="card-img-top " src="${el.ImgPath}" alt="img">
            <div class="card-body ">
                <h5 class="card-title ">${el.Name}</h5>
                <p class="card-text ">${el.Description}</p>
                <a  class="mybtn btn btn-success addbasket" data-id=${el.Id} >В корзину</a>
            </div>
        </div>
       `
        list.append(listEl)
    }
}



async function GetAndWriteAllContent() {

    const BMenu = await Request("BMenu");
    await WriteBmenu(BMenu);



}
// !! The other way for animation (part 2)
//animate menu for mobiles
// function animate(elem) {
//     var effect = elem.data("effect");
//     elem.addClass("animated " + effect).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
//         // !! @animation end is not defined@
//         // Its Ok, at the beginning, the object doesnt have an animation attribute, thats why it cant to remove it
//         elem.removeClass("animated" + effect);

//     });
// }

function ResetAnimation($elem) {
    var effect = $elem.data("effect")
    $elem.before($elem.clone(true));
    var $newElem = $elem.prev();
    $elem.remove();
    $newElem.addClass("animated " + effect);
}

// for basket animation
window.onscroll = () => {
    let b = document.getElementsByClassName("basket")[0]
    b.style.top = window.pageYOffset + window.innerHeight - 200 + "px"
}

function AddToBasket($this) {
    var id = $this.data("id")
    if (basket[id] == undefined) {
        basket[id] = 1;
    } else {
        basket[id]++;
    }
    localStorage.setItem("basket", JSON.stringify(basket))

}
async function start() {
    console.log("start");
    await GetAndWriteAllContent();

    // !! The other way for animation (part 1)
    // Animate mobile menu
    //          $(".menuicon").click(function() {
    //          animate($(".ModelContent"));
    //          });

    $(".menuicon").click(function() {

        var $this = ($(".ModelContent"));
        ResetAnimation($this);


    });

    //for dynamic blocks its better to use .on
    $('.addbasket').on('click', function() {
        var $this = ($(".basketfon"));
        ResetAnimation($this);
        AddToBasket($(this))
    });



}


var basket = {};



$(document).ready(start)