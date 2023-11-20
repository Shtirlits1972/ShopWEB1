$(document).ready(function () {

    var tabName = "#tabProducts";
    var url = "/api/Products/";

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

        var model =
        {
            'id': Id,
            'productName': $("#ProductNameE").val(),
            'price': $("#PriceE").val(),
            'categoryId': $("#CategoryE").val(),
            'categoryName': categoryNameV,
            'category': { 'id': $("#CategoryE").val(), 'categoryName': categoryNameV }
        };

       // debugger;

        if (window.IsEdit === true) {
            $(tabName).jqxGrid('updaterow', id, model);
            $(tabName).jqxGrid('updatebounddata', 'cells'); 
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

            var t1 = 0;

            $.ajax(settings).done(function (data) {
                model.id = data.id;
                console.log(model);
                $(tabName).jqxGrid('addrow', null, model, "first");
           //     $(tabName).jqxGrid('updatebounddata', 'cells'); 
                Clear();
            }).fail(function () {
                console.log('Error');
                Clear();
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

    console.log('Clear');
}