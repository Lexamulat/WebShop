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

    let list = $(".BurgsMenu") // . means class | #means id
    list.empty();

    for (let i = 0; i < BMenu.length; i++) {
        const el = BMenu[i];
        let listEl = `
        <div class="card wow zoomIn" data-wow-duration="2s">
                <img class="card-img-top " src="${el.ImgPath}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title ">${el.Name}</h5>
                    <p class="card-text ">${el.Description}</p>
                    <div class="redactbuttons">
                        <a class=" mybtn btn btn-primary edit" data-toggle="modal" data-target="#editModal" data-id=${el.Id} data-name='${el.Name}' data-description='${el.Description}' data-img='${el.ImgPath}' >Edit</a>
                        <a class="delete" data-toggle="modal" data-target="#exampleModal">Del</a>
                    </div>
                </div>
            </div>
        `
        list.append(listEl)
    }
}

async function WriteSubMenu(BMenu) {
    console.log("WriteBmenu");
    console.log(BMenu);

    let list = $(".SubMenu") // . means class | #means id
    list.empty();

    for (let i = 0; i < BMenu.length; i++) {
        const el = BMenu[i];

        let listEl = `
            <div class="card wow zoomIn" data-wow-duration="2s" >
                <img class="card-img-top " src="${el.ImgPath}" alt="img">
                <div class="card-body ">
                    <h5 class="card-title ">${el.Name}</h5>
                    <p class="card-text ">${el.Description}</p>
                    <a href="#" class="mybtn btn btn-primary" data-toggle="modal" data-target="#editModal" data-id=${el.Id} data-name='${el.Name}' data-description='${el.Description}' data-img='${el.ImgPath}' >Go somewhere</a>
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
    // await WriteSubMenu(BMenu);


}

function animate(elem) {
    var effect = elem.data("effect");
    elem.addClass("animated " + effect).one(animationEnd, function() {
        // !! @animation end is not defined@
        // Its Ok, at the beginning, the object doesnt have an animation attribute, thats why it cant to remove it
        elem.removeClass("animated" + effect);
    });
}

// async function MENUADD() {
//     let out = {
//         name: $("#AddName").val(),
//         description: $("#AddDescription").val(),
//         picture: picture.getAttribute('src')
//     }
//     let res = await Request("BurgAdd", out)
//     console.log(res);
//     if (res == "0") {
//         var x = document.getElementById("ErrorSnackbar")
//     } else {
//         var x = document.getElementById("SucseesSnackbar")
//     }
//     //Add the "show" class to DIV
//     x.className = "show";
//     // After 3 seconds, remove the show class from DIV
//     setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
//     await GetAndWriteAllContent();
// }

async function EDIT() {
    let out = {
        id: $('#editModal').data("id"),
        name: $("#EditName").val(),
        description: $("#EditDescription").val(),
        picture: picture.getAttribute('src')
    }
    let res = await Request("edit", out)
    console.log(res);
    if (res == "0") {
        var x = document.getElementById("ErrorSnackbar")
    } else {
        var x = document.getElementById("SucseesSnackbar")
    }
    //Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
    await GetAndWriteAllContent();
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

async function start() {




    console.log("start");
    await GetAndWriteAllContent();


    // Animate mobile menu
    $(".menuicon").click(function() {
        animate($(".ModelContent"));
    });


    $('#editModal').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingId = button.data('id')
        let EditingName = button.data('name')
        let EditingDescription = button.data('description')
        let EditingPicture = button.data('img')


        $(this).find('#EditName').val(EditingName)
        $(this).find('#EditDescription').val(EditingDescription)
        $("#picture").attr("src", EditingPicture)
        $(this).data('id', EditingId)
    })


    $("#imgInp").change(async function() {
        await readURL(this);
    });


    $("#MENUEDIT").click(EDIT)
        // $("#MENUADD").click(MENUADD)
}



$(document).ready(start)