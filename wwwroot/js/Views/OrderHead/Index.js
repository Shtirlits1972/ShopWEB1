$(document).ready(function () {

    var IsEdit = false;
    var tabName = "#tabOrderHead";
    var url = "/api/OrderHead/";
    var OrderHeadId = 0;
    //----------------------------------------------------------------------------------------------------------------
    var sourceUsers =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'usersName', type: 'string' }
        ],
        id: 'id',
        url: '/api/Users/'
    };

    var dataAdapterUsers = new $.jqx.dataAdapter(sourceUsers, {
        autoBind: true, async: false
    });

    //------------------------------------------------------------------------------------------------------------------------

    var source = {
        datatype: "json",

        updaterow: function (rowid, rowdata, commit) {

            //  без этой хрени показует дату на день меньше :-(
            rowdata.orderData = new Date(Date.UTC(rowdata.orderData.getFullYear(), rowdata.orderData.getMonth(), rowdata.orderData.getDate(), rowdata.orderData.getHours(), rowdata.orderData.getMinutes()));
            console.log(rowdata.orderData);
            debugger;

            var settings = {
                "url": url + rowid,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(rowdata),
            };
            debugger;
            $.ajax(settings).done(function (data) {
                debugger;
                console.log(data);
                commit(true);
                $(tabName).jqxGrid('updatebounddata', 'cells'); // без этого не обновляется дата заказа????
                
            }).fail(function () {
                commit(false);
                console.log('Error');
                debugger;
            });

        },
        datafields: [
            { name: 'id', type: 'int' },

            { name: 'orderNumber', type: 'string' },
            { name: 'orderData', type: 'date' },

            { name: 'userId', type: 'int' },

            { name: "usersName", map: "user>usersName", type: 'string' },
            {name : "user", type: "object"}

        ],
        id: 'id',
        url: url
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    $(tabName).jqxGrid({
        autoloadstate: true,
        autosavestate: true,
        filterable: true,
        sortable: true,
        autoshowfiltericon: true,
        editable: true,
        editmode: 'dblclick',
        localization: getLocalization('ru'),
        showtoolbar: true,
        width: 800,
        source: dataAdapter,
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
            container.append('<input style="margin-left: 5px;" id="btnEdit" type="button" value="Изменить" />');
            container.append('<input style="margin-left: 5px;" id="btnClearFilter" type="button" value="Сброс" />');
            container.append('<input style="margin-left: 5px;" id="btnRefresh" type="button" value="Обновить" />');

            $("#btnAdd").jqxButton({ theme: 'bootstrap' });
            $("#btnDel").jqxButton({ theme: 'bootstrap' });
            $("#btnEdit").jqxButton({ theme: 'bootstrap' });
            $("#btnClearFilter").jqxButton({ theme: 'bootstrap' });
            $("#btnRefresh").jqxButton({ theme: 'bootstrap' });

            $('#btnRefresh').click(function () {
                $(tabName).jqxGrid({ source: dataAdapter });
            });

            $('#btnClearFilter').click(function () {
                $(tabName).jqxGrid('clearfilters');
            });
            // update row.
            $("#btnEdit").on('click', function () {
                window.IsEdit = true;
                var selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                if (selectedrowindex >= 0) {

                    var id = $(tabName).jqxGrid('getrowid', selectedrowindex);
                    window.location.href = '/OrderDetailView?OrderId=' + id;
                    //var offset = $(tabName).offset();
                    //window.OrderHeadId = $(tabName).jqxGrid('getrowid', selectedrowindex);

                    //console.log(window.OrderHeadId);
                    //debugger;

                    //$("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                    //$("#popupWindow").jqxWindow('open');

                    //selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                    //var dataRecord = $(tabName).jqxGrid('getrowdata', selectedrowindex);

                }
                else {
                    alert('Выберите строку для изменения!');
                }
            });
            // create new row.
            $("#btnAdd").on('click', function () {
                window.location.href = '/OrderDetailView?OrderId=0';
                //window.IsEdit = false;
                //var offset = $(tabName).offset();
                //$("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                //$("#popupWindow").jqxWindow('open');
            });
            $("#btnDel").on('click', function () {
                var selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                var rowscount = $(tabName).jqxGrid('getdatainformation').rowscount;

                if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                    var id = $(tabName).jqxGrid('getrowid', selectedrowindex);
                    var r = confirm("Хотите удалить?!");
                    if (r === true) {

                        var settings = {
                            "url": url + id,
                            "method": "DELETE",
                            "timeout": 0,
                        };

                        $.ajax(settings).done(function (response) {
                            var commit = $(tabName).jqxGrid('deleterow', id);
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
            { text: 'Номер', datafield: 'orderNumber', align: 'center' },
            {
                text: 'Дата', datafield: 'orderData', align: 'center', cellsformat: 'dd.MM.yyyy', filtertype: 'date',
                columntype: 'datetimeinput',
                culture: 'ru-RU',
                cellsalign: 'center',
                createeditor: function (row, value, editor) {
                    editor.jqxDateTimeInput({ firstDayOfWeek: 1, culture: 'ru-RU',  formatString: 'dd.MM.yyyy', showTimeButton: false });
                },
                createfilterwidget: function (column, columnElement, widget) {
                    widget.jqxDateTimeInput({ firstDayOfWeek: 1, culture: 'ru-RU',  formatString: 'dd.MM.yyyy', showTimeButton: false });
                },
            },

            {
                text: 'Заказчик', datafield: 'userId', align: 'center',
                columntype: 'combobox',
                filtertype: 'checkedlist',
                displayfield: "usersName",

                createeditor: function (row, value, editor) {
                    editor.jqxComboBox({ source: dataAdapterUsers.records, displayMember: 'usersName', valueMember: 'id' });
                }
            }

        ]
    });
});