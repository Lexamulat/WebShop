var basket = {};

function Request(url, postData) {
    return new Promise(resolve => {
        $.post(url, JSON.stringify(postData), function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}


async function Write(cont) {

    let list = $(".section_2")
    list.empty();

    for (let l = 0; l < cont.length; l++) {
        const el = cont[l];

        let listEl = `
        <div class="card ">
            <img class="card-img-top " src="${el.ImgPath}" alt="Card image cap ">
            <div class="card-body ">
                <h5 class="card-title ">${el.Name}</h5>
                <p class="card-text ">${el.Description}</p>
            </div>
            <ul class="list-group list-group-flush ">
                <li class="list-group-item ">Цена: ${el.Price}руб.</li>
                <li class="list-group-item ">Количество: ${basket[el.Id]}шт. </li>
                <li class="list-group-item ">Сумма: ${el.Price * basket[el.Id]}руб. </li>
            </ul>
            <div class="redactbuttons">
                <a class="btn btn-danger minus " data-id=${el.Id} >
                    <svg class="svgiconplus " xmlns="http://www.w3.org/2000/svg " viewBox="0 0 32 32 "><path d="M0 13v6c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-30c-0.552 0-1 0.448-1 1z"></path>
                                </symbol>
                                    </symbol>
                        </svg>

                </a>
                <a class="btn btn-success plus " data-id=${el.Id} >
                    <svg class="svgiconplus " xmlns="http://www.w3.org/2000/svg " viewBox="0 0 32 32 "><path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                                    </symbol>
                        </svg>

                </a>
            </div>
        </div>
        `
        list.append(listEl)
    }

}

function ChangeOrder(elem, action) {
    let id = $(elem).data("id")
    if (action == "plus") {
        basket[id]++;
    } else {
        basket[id]--;
    }
    localStorage.setItem("basket", JSON.stringify(basket))
}
//что будет если нажать удалить элем а его  и нет?

async function CheckAndDisplayBasket() {
    if (localStorage.getItem('basket') != null) {

        basket = JSON.parse(localStorage.getItem("basket"))
        var arr = [];

        for (var i in basket) {
            arr.push(i)
        }

        const cont = await Request("getOrder", arr)

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

    $(".plus").click(function() {

        ChangeOrder(this, "plus");
    });
    $(".minus").click(function() {

        ChangeOrder(this, "minus");
    });
}

$(document).ready(start)