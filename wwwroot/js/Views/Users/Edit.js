$(document).ready(function () {

    $("#popupWindow").jqxWindow({
        width: 300, height: 300, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01
    });

    $("#Cancel").jqxButton({ theme: 'bootstrap' });
    $("#Save").jqxButton({ theme: 'bootstrap' });

    $("#Save").click(function () {

        var Id = 0;

        if (window.IsEdit === true) {
            var selectedrowindex = $("#tabUsers").jqxGrid('getselectedrowindex');
            Id = $("#tabUsers").jqxGrid('getrowid', selectedrowindex);
        }

        var isAppruved = true;
        var isAppruvedLabel = '\u2714';

        if ($("#isApprovedE").jqxCheckBox('checked') === false) {
            isAppruved = false;
            isAppruvedLabel = '\u2610';
        }

        var t = 9;

        var model =
        {
             'id': Id
            , 'email': $("#EmailE").val()
            , 'password': $("#PassE").val()
            , 'role': $("#RoleE").val()
            , 'usersName': $("#UserFioE").val()
            , 'isAppruved': isAppruved
        };

        if (window.IsEdit === true) {
            $('#tabUsers').jqxGrid('updaterow', Id, model);
        }
        else {
            var settings = {
                "url": "/api/Users/",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(model),
            };

            $.ajax(settings).done(function (data) {
                console.log(data);
                $("#tabUsers").jqxGrid('addrow', null, data, "first");
                $("#tabUsers").jqxGrid('updatebounddata', 'cells'); //   без этого не обновляется клетка isAppruved !!!!  
            //    Clear();
            }).fail(function () {
                console.log('Error');
                Clear();
            });

        }

        $("#popupWindow").jqxWindow('hide');
    });

    var sourceRole = ["user", "admin"];

    $("#RoleE").jqxComboBox({ source: sourceRole, width: '170px', height: '25px', template: 'info'});
    $("#RoleE").jqxComboBox('selectIndex', 0);

    $("#isApprovedE").jqxCheckBox({ width: 30, height: 25, checked: true });

});

function Clear() {

    $("#EmailE").val('');
    $("#PassE").val('');
    $("#RoleE").jqxComboBox('selectIndex', 0);
    $("#UserFioE").val('');
    $("#isApprovedE").val(true);

}