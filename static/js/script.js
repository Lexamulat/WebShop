"use strict";
//async info
// https://www.youtube.com/watch?v=5kAPExqSZ1I

async function Request(url, postData) {
    return $.post(url, JSON.stringify(postData), function(data, textStatus) {
        console.log("1")
    }, "json");
}
//THIS Asynchro function returns promise by @async function@ 

// function Request(url, postData) {
//     return new Promise(resolve => {
//         console.log(url)
//         $.post(url, JSON.stringify(postData), function(data, textStatus) {
//             resolve(data)
//         }, "json");
//     });
// }
//THIS synchro function returns promise by @return new Promise@ 

async function WriteBmenu(BMenu) {
    console.log("WriteBmenu");
    console.log(BMenu);

    let list = $(".MenuList")
    list.empty()

    for (let i = 0; i < BMenu.length; i++) {
        const el = BMenu[i];

        let listEl = `
        <div class="card wow zoomIn" data-wow-duration="2s">
            <img class="card-img-top " src="${el.Img}" alt="Card image cap ">
            <div class="card-body ">
                <h5 class="card-title ">${el.Name}</h5>
                <p class="card-text ">${el.Description}</p>
                <a href="# " class="mybtn btn btn-primary ">Go somewhere</a>
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

function start() {

    console.log("start");
    GetAndWriteAllContent();


}

Image byteArrayToImage(byte[] byteArrayIn) {
    MemoryStream ms = new MemoryStream(byteArrayIn);
    Image returnImage = Image.FromStream(ms);
    return returnImage;
}

$(document).ready(start)