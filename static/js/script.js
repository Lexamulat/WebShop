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

    let list = $(".MenuList") // . means class | #means id
    list.empty();

    for (let i = 0; i < BMenu.length; i++) {
        const el = BMenu[i];

        let listEl = `
        <div class="card wow zoomIn" data-wow-duration="2s" >
            <img class="card-img-top " src="${el.ImgPath}" alt="img">
            <div class="card-body ">
                <h5 class="card-title ">${el.Name}</h5>
                <p class="card-text ">${el.Description}</p>
                <a href="#" class="mybtn btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-id=${el.Id} data-name='${el.Name}' data-description='${el.Description}' data-img='${el.ImgPath}' >Go somewhere</a>
                </div>
        </div>
       `
            // !! TAKE care of @data-name=${el.Name}@ and @data-name='${el.Name}'@  the difference in reading up to a blank in the first case. space after @data-name='${el.Name}'@ is very important 
            // !! data-'all in lowercase'
        list.append(listEl)
    }
}


async function GetAndWriteAllContent() {

    const BMenu = await Request("BMenu");
    await WriteBmenu(BMenu);


}

function animate(elem) {
    var effect = elem.data("effect");
    elem.addClass("animated " + effect).one(animationEnd, function() {
        elem.removeClass("animated" + effect);
    });

}


async function EDIT() {

    console.log("edit")

    let out = {
        id: $('#exampleModal').data("id"),
        name: $("#EditName").val(),
        description: $("#EditDescription").val(),
        picture: picture.getAttribute('src')
    }

    let res = await Request("edit", out)
    console.log(res)
    var x = document.getElementById("SucseesSnackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
    // if (res) {
    //     LAB.toast("Успешно")
    // } else {
    //     LAB.toast("Ошибка доабвления")
    // }
}


async function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#picture').attr('src', e.target.result);
            console.log(e.target.result)
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function start() {




    console.log("start");
    GetAndWriteAllContent();



    $(".menuicon").click(function() {
        animate($(".ModelContent"));
    });


    $('#exampleModal').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingId = button.data('id')
        console.log(EditingId)
        let EditingName = button.data('name')
        let EditingDescription = button.data('description')
        let EditingPicture = button.data('img')

        console.log(this)
        $(this).find('#EditName').val(EditingName)
        $(this).find('#EditDescription').val(EditingDescription)
        $("#picture").attr("src", EditingPicture)
        $(this).data('id', EditingId)
        console.log("end")


    })


    $("#imgInp").change(async function() {
        await readURL(this);
    });


    $("#MENUEDIT").click(EDIT)
}



$(document).ready(start)