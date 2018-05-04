"use strict";
//async info
// https://www.youtube.com/watch?v=5kAPExqSZ1I
// async function Request(url, Data) {
//     $.post(url, JSON.stringify(Data), function(AnswerData, textStatus) {}, "json");
//     return AnswerData;
// }

async function Request(url, postData) {
    $.post(url, JSON.stringify(postData), function(data, textStatus) {
        return data;
    }, "json");

}
//THIS Asynchro function returns promise by @async function@ 

// function Requestq(url, postData) {
//     return new Promise(resolve => {
//         console.log(url)
//         $.post(url, JSON.stringify(postData), function(data, textStatus) {
//             resolve(data)
//         }, "json");
//     });
// }
//THIS synchro function returns promise by @return new Promise@ 

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