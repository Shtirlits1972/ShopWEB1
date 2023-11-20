$(document).ready(function () {

    var tabName = "#tabOrderHead";
    var url = "/api/OrderHead/";

    $("#popupWindow").jqxWindow({
        width: 300, height: 300, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01
    });

    $("#Cancel").jqxButton({ theme: 'bootstrap' });
    $("#Save").jqxButton({ theme: 'bootstrap' });

    $("#Cancel").click(function () {
        Clear();
    });

    $("#Save").click(function () {

        var Id = 0;

        if (window.IsEdit === true) {
            var selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
            Id = $(tabName).jqxGrid('getrowid', selectedrowindex);
        }

    //    var model =
    //    {
    //        'id': Id
    //        , 'categoryName': $("#CategoryNameE").val()
    //    };
    //    if (window.IsEdit === true) {
    //        $(tabName).jqxGrid('updaterow', Id, model);
    //    }
    //    else {
    //        var settings = {
    //            "url": url,
    //            "method": "POST",
    //            "timeout": 0,
    //            "headers": {
    //                "Content-Type": "application/json"
    //            },
    //            "data": JSON.stringify(model),
    //        };

    //        $.ajax(settings).done(function (data) {
    //            console.log(data);
    //            $(tabName).jqxGrid('addrow', null, data, "first");
    //            //   $(tabName).jqxGrid('updatebounddata', 'cells'); //   без этого не обновляется клетка isAppruved !!!!  
    //            Clear();
    //        }).fail(function () {
    //            console.log('Error');
    //            Clear();
    //        });
    //    }

        $("#popupWindow").jqxWindow('hide');
    });
    Clear();
});

function Clear() {

  //  $("#CategoryNameE").val('');
    console.log('Clear');
}