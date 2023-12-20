var url = "/api/OrderDetail/";
var IdDetail = 0;
var ProductNameV = '';
var tabNameDetail = "#tabOrderDetail";

$(document).ready(function () {

    var OrderId = $("#OrderId").val();
    //----------------------------------------------------------------------------------------------------------------
    var sourceProduct =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'productName', type: 'string' },
            {
                name: 'price', type: 'number', columntype: 'numberinput', cellsformat: 'c2'
            },
            { name: 'categoryId', type: 'int' },
            { name: "categoryName", map: "category>categoryName", type: 'string' }
        ],
        id: 'id',
        url: '/api/Products/'
    };

    var dataAdapterProduct = new $.jqx.dataAdapter(sourceProduct, {
        autoBind: true
    });

    $("#ProductE").jqxComboBox({
        source: dataAdapterProduct, width: '175px', height: '25px', promptText: "Выбирай: ", valueMember: 'id',
        displayMember: 'productName', selectedIndex: 0
    });

    $('#ProductE').on('select', function (event) {
        var args = event.args;
        if (args) {
            var item = args.item;
            ProductNameV = item.label;

            product.id = item.value;
            product.productName = item.label;

            IdDetail = item.value;
        }
    });

    var product = {
        id: $("#ProductE").val(),
        productName: ''
    }

    $("#popupWindow").jqxWindow({
        width: 500, height: 400, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#CancelDetail"), modalOpacity: 0.01
    });

    $("#CancelDetail").jqxButton({ theme: 'bootstrap' });
    $("#SaveDetail").jqxButton({ theme: 'bootstrap' });

    $("#CancelDetail").click(function () {
        Clear();
    });

    $("#SaveDetail").click(function () {

            if (OrderId === "0") {

                var OrderHead = {
                    "id": OrderId,
                    "orderData": $("#OrderDataE").jqxDateTimeInput('value'),
                    "orderNumber": "",
                    "userId": 0,
                    "user": null
                };

                var OrderData = $("#OrderDataE").jqxDateTimeInput('value');  //   $("#OrderDataE").val();    //    

                console.log(OrderData);
                //    debugger;
                var formattedDate = $.jqx.dataFormat.formatdate(OrderData, 'yyyy-MM-dd') + "T00:00:00";

                OrderHead.orderNumber = $("#OrderNumberE").val();
                OrderHead.orderData = formattedDate;

                console.dir(OrderHead);
                debugger;
        //        //  Добавляел новый заказ
                var settings = {
                    "url": "/api/OrderHead/",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(OrderHead),
                };
                        debugger;
                $.ajax(settings).done(function (data) {
                    debugger;
                    console.log(data);
                    $("#OrderId").val(data.id);
                    debugger;
                    SaveDetail(true, data.id);
                    //Clear();
                    //ReturnToOrderHead();
                }).fail(function () {
                    console.log('Error');
                    //    Clear();
                });
                //  Добавляел новый заказ
                debugger;
            } else {
                debugger;
                SaveDetail(false, 0);
            }

        //    var model =
        //    {
        //        'Id': 0,
        //        'OrderId': $("#OrderId").val(),
        //        'ProductId': IdDetail,
        //        'Qty': $("#QtyE").val(),
        //        "Product": null,
        //        "Order": null
        //    };

        //    console.log(model);
        //    debugger;

        //    if (window.IsEdit === true) {
        //        $(tabNameDetail).jqxGrid('updaterow', Id, model);
        //    }
        //    else {
        //        var settings = {
        //            "url": url,
        //            "method": "POST",
        //            "timeout": 0,
        //            "headers": {
        //                "Content-Type": "application/json"
        //            },
        //            "data": JSON.stringify(model)
        //        };

        //        //      debugger;

        //        try {
        //            $.ajax(settings).done(function (data) {
        //                console.log(data);
        //                $(tabNameDetail).jqxGrid('addrow', null, data, "first");
        //                $(tabNameDetail).jqxGrid('updatebounddata', 'cells'); //   без этого не обновляется клетка isAppruved !!!!
        //                Clear();
        //            }).fail(function () {
        //                console.log('Error');
        //                Clear();
        //                //         debugger;
        //            });

        //        } catch (e) {
        //            console.log(e);
        //            debugger;
        //        }
        //    }

        //    Clear();
        //    $("#popupWindow").jqxWindow('hide');
        //    console.log("SaveDetail");

    });

    $("#QtyE").jqxNumberInput({ width: '180px', height: '25px', decimalDigits: 2, digits: 6, decimalSeparator: ",", groupSeparator: " ", inputMode: 'advanced' });

});

function SaveDetail(isNewOrder, orderId) {

    var model =
    {
        'id': 0,
        'orderId': $("#OrderId").val(),
        'productId': window.IdDetail,
        'qty': $("#QtyE").val(),
        "product": null,
        "order": null
    };

    console.log(model);
    debugger;

    if (window.IsEdit === true) {
        $(tabNameDetail).jqxGrid('updaterow', Id, model);
    }
    else {
        var settings = {
            "url": url,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(model)
        };

        debugger;

        try {
            $.ajax(settings).done(function (data) {
                console.log(data);
                $(tabNameDetail).jqxGrid('addrow', null, data, "first");
                $(tabNameDetail).jqxGrid('updatebounddata', 'cells'); //   без этого не обновляется клетка isAppruved !!!!

                if (isNewOrder === true && orderId > 0) {
                    window.location.href = '/OrderDetailView?OrderId=' + orderId;
                }

                Clear();
            }).fail(function () {
                console.log('Error');
                Clear();
                debugger;
            });

        } catch (e) {
            console.log(e);
            debugger;
        }
    }

    Clear();
    $("#popupWindow").jqxWindow('hide');
    console.log("SaveDetail");

}

function Clear() {

    $("#QtyE").val(0);
    console.log('Clear');
}