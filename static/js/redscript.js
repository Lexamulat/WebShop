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

function PushToast(res) {
    if (res == "0") {
        var x = document.getElementById("ErrorSnackbar")
    } else {
        var x = document.getElementById("SucseesSnackbar")
    }
    //Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}


async function WriteBmenu(BMenu) {
    console.log("WriteBmenu");
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
                        <a class="delete" data-toggle="modal" data-target="#delModal" data-id=${el.Id}>Del</a>
                    </div>
                </div>
            </div>
        `
        list.append(listEl)
    }
}

async function GetAndWriteAllContent() {

    const BMenu = await Request("BMenu");
    await WriteBmenu(BMenu);
    // await WriteSubMenu(BMenu);


}
//animate menu for mobiles
function animate(elem) {
    var effect = elem.data("effect");
    elem.addClass("animated " + effect).one(animationEnd, function() {
        // !! @animation end is not defined@
        // Its Ok, at the beginning, the object doesnt have an animation attribute, thats why it cant to remove it
        elem.removeClass("animated" + effect);
    });
}

async function MENUADD() {
    let out = {
            name: $("#AddName").val(),
            description: $("#AddDescription").val(),
            picture: pictureForAddBurgsModal.getAttribute('src')
        }
        //We need to clean info in modal window 
    document.getElementById("AddName").value = "";
    document.getElementById("AddDescription").value = "";

    let res = await Request("BurgAdd", out)
        // document.getElementById("pictureForAddBurgsModal").setAttribute('src', "#");

    await PushToast(res)
    await GetAndWriteAllContent();
}

async function EDIT() {
    let out = {
        id: $('#editModal').data("id"),
        name: $("#EditName").val(),
        description: $("#EditDescription").val(),
        picture: picture.getAttribute('src')
    }
    let res = await Request("edit", out)
    await PushToast(res)
    await GetAndWriteAllContent();
}


async function MENUDELETE() {
    let out = {
        id: $('#delModal').data("id")
    }

    console.log(out)
    let res = await Request("BurgDel", out)
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


async function readURLEdit(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#picture').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function readURLAdd(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(t) {
            $('#pictureForAddBurgsModal').attr('src', t.target.result);
            // console.log()
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
    $('#delModal').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingId = button.data('id')
        $(this).data('id', EditingId) // !! this method didnt rewrite data
            //!! $(this).attr('aaaaaaaaaaaaaaaaa', "aaaaaaaaaaaaaa")
            //!! this method will rewrite data
    })


    $("#imgInp").change(async function() {
        await readURLEdit(this);
    });
    $("#imgInpForAddBurgsModal").change(async function() {
        await readURLAdd(this);
    });


    $("#MENUEDIT").click(EDIT)
    $("#MENUADD").click(MENUADD)
    $("#MENUDELETE").click(MENUDELETE)
}



$(document).ready(start)