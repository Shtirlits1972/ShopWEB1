$(document).ready(function () {

    var urlOrderHead = "/api/OrderHead/";
    var IsEditDetail = false;

    var OrderId = $("#OrderId").val();
    var OrderData = $("#OrderData").val();
    var UserId = $("#UserId").val();
    var OrderNumber = $("#OrderNumber").val();

    console.log(OrderId);
    console.log(OrderData);

    var OrderHead = {
        "Id": OrderId,
        "OrderData": $("#OrderDataE").jqxDateTimeInput('value'),
        "OrderNumber": "",
        "UserId": 0,
        "user": null
    };

    var settings = {
        "url": urlOrderHead + OrderId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        }
    };
    //---------------------------------------------------
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
    //-------------------------------------------------------------------------------

    $.ajax(settings).done(function (data) {
        OrderHead = data;
        console.log(OrderHead);

    }).fail(function () {
        console.log('Error');
    });


    $("#OrderNumberE").val(OrderHead.orderNumber);
    //   debugger;
    //-----------------------------------------------------

    $("#Cancel").jqxButton({ theme: 'bootstrap' });
    $("#Save").jqxButton({ theme: 'bootstrap' });

    $("#Cancel").click(function () {
        Clear();
        ReturnToOrderHead();
    });

    $("#Save").click(function () {

        var OrderData = $("#OrderDataE").jqxDateTimeInput('value');  //   $("#OrderDataE").val();    //    

        console.log(OrderData);
        //    debugger;
        var formattedDate = $.jqx.dataFormat.formatdate(OrderData, 'yyyy-MM-dd') + "T00:00:00";

        OrderHead.orderNumber = $("#OrderNumberE").val();
        OrderHead.orderData = formattedDate;

        console.dir(OrderHead);
        //  debugger;

        if (OrderId !== undefined && OrderId > 0) {

            var settings = {
                "url": urlOrderHead + OrderId,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(OrderHead),
            };
            // debugger;
            $.ajax(settings).done(function (data) {
                console.log(data);
               // ReturnToOrderHead();
            }).fail(function () {
                console.log('Error');
            });
        } else {
            //  Добавляел новый заказ
            var settings = {
                "url": urlOrderHead,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(OrderHead),
            };
            //        debugger;
            $.ajax(settings).done(function (data) {
                console.log(data);
                window.location.href = '/OrderDetailView?OrderId=' + data.id;
              //  ReturnToOrderHead();
            }).fail(function () {
                console.log('Error');
            });
            //  Добавляел новый заказ
        }


    });

    //===========================================//=================================

    var tabNameDetail = "#tabOrderDetail";
    var urlDetail = "/api/OrderDetail/";

    var sourceDetail = {
        datatype: "json",

        updaterow: function (rowid, rowdata, commit) {
            console.log(rowdata);
            debugger;
            var settings = {
                "url": urlDetail + rowid,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(rowdata),
            };

            $.ajax(settings).done(function (data) {
                console.log(data);
                commit(true);
            }).fail(function () {
                commit(false);
                console.log('Error');
            });

        },

        datafields: [
            { name: 'id', type: 'int' },
            { name: 'orderId', type: 'int' },
            { name: 'productId', type: 'int' },
            { name: 'qty', type: 'number' },
            { name: "productName", map: "product>productName", type: 'string' }

        ],
        id: 'id',
        url: urlDetail + '?OrderHeadId=' + OrderId
    };

    var dataAdapterDetail = new $.jqx.dataAdapter(sourceDetail);

    $(tabNameDetail).jqxGrid({
        autoloadstate: true,
        autosavestate: true,
        filterable: true,
        sortable: true,
        autoshowfiltericon: true,
        editable: true,
        editmode: 'dblclick',
        localization: getLocalization('ru'),
        showtoolbar: true,
        width: 650,
        source: dataAdapterDetail,
        //filtermode: 'excel',
        columnsresize: true,
        pageable: true,
        pagesize: 10,
        pagesizeoptions: ['5', '10', '50', '100', '1000'],
        pagermode: "simple",  //  "pagesizeoptions",

        rendertoolbar: function (toolbar) {
            var me = this;
            var container = $("<div style='margin: 5px;'></div>");
            toolbar.append(container);
            container.append('<input id="btnAdd" type="button" value="Добавить" />');
            container.append('<input style="margin-left: 5px;" id="btnDel" type="button" value="Удалить" />');

            $("#btnAdd").jqxButton({ theme: 'bootstrap' });
            $("#btnDel").jqxButton({ theme: 'bootstrap' });

            // create new row.
            $("#btnAdd").on('click', function () {
                window.IsEdit = false;
                var offset = $(tabNameDetail).offset();
                $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                $("#popupWindow").jqxWindow('open');
            });
            $("#btnDel").on('click', function () {
                var selectedrowindex = $(tabNameDetail).jqxGrid('getselectedrowindex');
                var rowscount = $(tabNameDetail).jqxGrid('getdatainformation').rowscount;

                if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                    var id = $(tabNameDetail).jqxGrid('getrowid', selectedrowindex);
                    var r = confirm("Хотите удалить?!");
                    if (r === true) {

                        var settings = {
                            "url": urlDetail + id,
                            "method": "DELETE",
                            "timeout": 0,
                        };

                        $.ajax(settings).done(function (response) {
                            var commit = $(tabNameDetail).jqxGrid('deleterow', id);
                            console.log(response);
                            Clear();
                        }).fail(function () { alert('Ошибка!'); });

                    }
                }
                else {
                    alert('Выбеирте строку для удаления!');
                }
            });

        },

        columns: [
            { text: 'ИД', datafield: 'id', width: 50, editable: false, cellsalign: 'center', align: 'center' },

         //   { text: 'Название товара', datafield: 'productName', align: 'center', width: 450 },
            {
                text: 'Товар', datafield: 'productId', align: 'center',
                columntype: 'combobox',
                filtertype: 'checkedlist',
                displayfield: "productName",

                createeditor: function (row, value, editor) {
                    editor.jqxComboBox({ source: dataAdapterProduct.records, displayMember: 'productName', valueMember: 'id' });
                }
            },

            { text: 'Количество', datafield: 'qty', align: 'center', cellsalign: 'center', width: 150, cellsformat: 'D2' }
        ]
    });

    $("#OrderDataE").jqxDateTimeInput({ width: '170px', height: '25px', culture: 'ru-RU', formatString: 'dd.MM.yyyy', showTimeButton: false });

    if (OrderData !== undefined) {
        $("#OrderDataE").jqxDateTimeInput('setDate', OrderData);
    }
});

function ReturnToOrderHead() {
    window.location.href = '/OrderHeadView';
}