$(document).ready(function () {

    var IsEdit = false;
    var tabName = "#tabCategories";

    var url = "/api/Categories/";

    var source = {
        datatype: "json",

        updaterow: function (rowid, rowdata, commit) {

            var settings = {
                "url": url + rowid,
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
            { name: 'categoryName', type: 'string' }

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
                    var offset = $(tabName).offset();

                    $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                    $("#popupWindow").jqxWindow('open');

                    selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                    var dataRecord = $(tabName).jqxGrid('getrowdata', selectedrowindex);

                    console.log(dataRecord.categoryName);

                    $("#CategoryNameE").val(dataRecord.categoryName);

                }
                else {
                    alert('Выбеирте строку для изменения!');
                }
            });
            // create new row.
            $("#btnAdd").on('click', function () {
                window.IsEdit = false;
                var offset = $(tabName).offset();
                $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                $("#popupWindow").jqxWindow('open');
            });
            $("#btnDel").on('click', function () {
                var selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                var rowscount = $(tabName).jqxGrid('getdatainformation').rowscount;

                if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                    var id = $(tabName).jqxGrid('getrowid', selectedrowindex);
                    var r = confirm("Хотите удалить?!");
                    if (r === true) {

                        var settings = {
                            "url": url+ id,
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
            { text: 'Название', datafield: 'categoryName', align: 'center' }
        ]
    });
});