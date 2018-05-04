"use strict";


// function Request(url, Data) {
//     return $.post(url, JSON.stringify(Data), function(AnswerData, textStatus) {

//     }, "json");
// }


function Request(url, postData) {
    return new Promise(resolve => {
        console.log(url)
        $.post(url, JSON.stringify(postData), function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}

async function WriteBmenu(BMenu) {
    console.log("BMenu2");

}

async function GetAndWriteAllContent() {
    const BMenu = await Request("BMenu");


}

function start() {
    console.log("start");
    GetAndWriteAllContent();

}

$(document).ready(start)