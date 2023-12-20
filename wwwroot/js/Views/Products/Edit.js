$(document).ready(function () {

    var tabName = "#tabProducts";
    var url = "/api/Products/";

    $("#popupWindow").jqxWindow({
        width: 300, height: 500, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#Cancel"), modalOpacity: 0.01
    });

    $("#Cancel").jqxButton({ theme: 'bootstrap' });
    $("#Save").jqxButton({ theme: 'bootstrap' });

    $("#Cancel").click(function () {
        Clear();
    });

    $("#Save").click(function () {

        var Id = 0;
        var file = null;
        var fileName = 'X'; //  без этого на сервере выдаёт кракозябры???

        if (window.IsEdit === true) {
            var selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
            Id = $(tabName).jqxGrid('getrowid', selectedrowindex);

            var dataRecord = $(tabName).jqxGrid('getrowdata', selectedrowindex);
        }

        //  Если редактируем
        if (window.IsEdit === true) {

            if ($("#ImgIsChange").val() === 'false') {
                fileName = dataRecord.foto;
            }
            else {

                if (document.getElementById("FotoInput").files && document.getElementById("FotoInput").files[0]) {
                    file = document.getElementById("FotoInput").files[0];

                    if (file !== null && file !== undefined) {
                        fileName = file.name;
                    }
                }
            }

        }
        else if (window.IsEdit === false) {

            if (document.getElementById("FotoInput").files && document.getElementById("FotoInput").files[0]) {
                file = document.getElementById("FotoInput").files[0];
                if (file !== null && file !== undefined) {
                    fileName = file.name;
                }
            }
        }

        var model =
        {
            'id': Id,
            'productName': $("#ProductNameE").val(),
            'price': $("#PriceE").val(),
            'categoryId': $("#CategoryE").val(),
            'categoryName': categoryNameV,
            'category': { 'id': $("#CategoryE").val(), 'categoryName': categoryNameV },
            'foto': fileName
        };

        if (window.IsEdit === true) {

            $(tabName).jqxGrid('updaterow', Id, model);
            $(tabName).jqxGrid('updatebounddata', 'cells');

            if ($("#ImgIsChange").val() === 'false') {
                fileName = dataRecord.foto;
            }
            else if ($("#ImgIsChange").val() === 'true') {

                var FotoInput = document.getElementById("FotoInput");
                var req = new XMLHttpRequest();
                var formData = new FormData();

                formData.append("foto", FotoInput.files[0]);
                formData.append("strId", Id);
                formData.append("IsEdit", true);
                debugger;
                req.open("POST", '/api/Products/LoadImage');  
                req.send(formData);
            }
        }
        else {

            var settings = {
                "url": url,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(model),
            };

            $.ajax(settings).done(function (data) {
                model.id = data.id;
                var strId = data.id;
    
                var FotoInput = document.getElementById("FotoInput");
                var req = new XMLHttpRequest();
                var formData = new FormData();
    
                formData.append('foto', file);
                formData.append("strId", strId);
                formData.append("IsEdit", false);
               
                req.open("POST", '/api/Products/LoadImage');
                req.send(formData);
                debugger;
                console.log(model);
                $(tabName).jqxGrid('addrow', null, model, "first");
                $(tabName).jqxGrid('updatebounddata', 'cells');
            }).fail(function () {
                debugger;
                console.log('Error');
              //  Clear();
            });
        }
        $("#popupWindow").jqxWindow('hide');
        Clear();

    });

    $("#PriceE").jqxNumberInput({ width: '180px', height: '25px', decimalDigits: 2, digits: 8, inputMode: 'advanced' });
    //------------------------------------------------------
    var sourceCategory = {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'categoryName', type: 'string' }
        ],
        id: 'id',
        url: '/api/Categories/'
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(sourceCategory, {
        contentType: 'application/json; charset=utf-8',
        autoBind: true,
        downloadComplete: function (data, textStatus, jqXHR) {
            return data;
        }
    });

    $("#CategoryE").jqxComboBox({
        source: dataAdapterCategory, width: '175px', height: '25px', promptText: "Выбирай: ", valueMember: 'id',
        displayMember: 'categoryName', selectedIndex: 0
    });

    var categoryNameV = '';

    var category = {
        id: $("#CategoryE").val(),
        categoryName: ''
    }

    $('#CategoryE').on('select', function (event) {
        var args = event.args;
        if (args) {
            var item = args.item;
            categoryNameV = item.label;

            category.id = item.value;
            category.categoryName = item.label;
        }
    });

});

function Clear() {

    $("#ProductNameE").val('');
    $("#PriceE").val(0);
    $("#CategoryE").val(1);
    clearFoto();
    console.log('Clear');
}

function clearFoto() {

    $("#FotoInput").val('');
    $('#ImageView').attr('src', "/images/NoFoto.jpg");
    $("#ImgIsChange").val('true');
}

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#ImageView').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);

        $("#ImgIsChange").val('true');

    }
}
