$(document).ready(function () {

    var IsEdit = false;
    var tabName = "#tabProducts";
    var url = "/api/Products/";
    //----------------------------------------------------------------------------------------------------------------
    var sourceCategories =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'categoryName', type: 'string' }
        ],
        id: 'id',
        url: '/api/Categories/'
    };

    var dataAdapterCategories = new $.jqx.dataAdapter(sourceCategories, {
        autoBind: true, async: false
    });

    //------------------------------------------------------------------------------------------------------------------------

    var source = {
        datatype: "json",

        updaterow: function (rowid, rowdata, commit) {

            var  h = 0;

            var modelProduct = {
                'id': rowid,
                'productName': rowdata.productName,
                'price': rowdata.price,
                'categoryId': rowdata.categoryId,
                'categoryName': rowdata.categoryName,
                'foto': rowdata.foto,
                'category': { 'id': rowdata.categoryId, 'categoryName': rowdata.categoryName }
            };

            console.log(JSON.stringify(modelProduct));

            var settings = {
                "url": url + rowid,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(modelProduct),
            };
            var t = 0;
            $.ajax(settings).done(function (data) {
                console.log(data);
                commit(true);
                $(tabName).jqxGrid('updatebounddata', 'cells');
            }).fail(function () {
                commit(false);
                console.log('Error');
            });
        },
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'productName', type: 'string' },
            {
                name: 'price', type: 'number', columntype: 'numberinput', cellsformat: 'c2',
                initeditor: function (row, cellvalue, editor) {
                    editor.jqxNumberInput({ decimalDigits: 2 });
                }
            },
            { name: 'categoryId', type: 'int' },
            //       { name: 'id', map: 'department&gt;id' },
            { name: "categoryName", map: "category>categoryName", type: 'string' },
            { name: 'foto', type: 'string' }
        ],
        loadComplete: function () {
            dataAdapterCategories.dataBind();
            console.log('dataAdapterCategories.records');
            console.log(dataAdapterCategories.records);
        },

        id: 'id',
        url: url
    };

    var dataAdapter = new $.jqx.dataAdapter(source);


    //  на случай если захотим показывать фото
    var imageRender = function (row, columnfield, value, defaulthtml, columnproperties) {
        var RowId = $(tabName).jqxGrid('getrowid', row);
        if (value.trim() !== '' && value !== null && value !== undefined && value.length > 3 && value !== 'X') {

            console.log('RowId =' + RowId + '+ value= ' + value);
            return '<img src="images/product/' + RowId + '/' + value + '" onclick="editImage(' + RowId + ', &quot;' + value + '&quot;)">';
        }
        else {
            console.log('RowId =' + RowId + '+ value.length= ' + value.length);
            return '<div style="width: 60px; height: 28px;" onclick="editImage(' + RowId + ', &quot;' + value + '&quot;)"> </div>';
        }
    };

    $(tabName).jqxGrid({

        autoloadstate: false,
        autosavestate: false,

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
                //    debugger;
                    $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                    $("#popupWindow").jqxWindow('open');

                    selectedrowindex = $(tabName).jqxGrid('getselectedrowindex');
                    var dataRecord = $(tabName).jqxGrid('getrowdata', selectedrowindex);

                    console.log(dataRecord.categoryName);

                    $("#ProductNameE").val(dataRecord.productName);
                    $("#PriceE").val(dataRecord.price);
                    $("#CategoryE").val(dataRecord.categoryId);

                    //-------------------------------------------------------------------------------------------
                    if (dataRecord.foto !== '' && dataRecord.foto !== 'X') {
                        $('#ImageView').attr('src', "/images/product/" + id + "/" + dataRecord.foto);
                    }
                    else {
                        $('#ImageView').attr('src', "/images/NoFoto.jpg");
                    }
                    //-------------------------------------------------------------------------------------------

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
            { text: 'Название', datafield: 'productName', align: 'center' },
            { text: 'Цена', datafield: 'price', align: 'center', cellsformat: 'D2' },

            {
                text: 'Категория', datafield: 'categoryId', align: 'center',
                columntype: 'combobox',
                filtertype: 'checkedlist',
                displayfield: "categoryName",

                createeditor: function (row, value, editor) {
                    editor.jqxComboBox({ source: dataAdapterCategories.records, displayMember: 'categoryName', valueMember: 'id' });
                }
            },

            { text: 'Фото', datafield: 'foto', align: 'center', /*columntype: 'custom',*/ cellsrenderer: imageRender, width: 60, editable: false }
        ]
    });
});


function editImage(RowId, value = "") {

    var offset = $("#tabProducts").offset();
    $("#EditImage").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
    $("#EditImage").jqxWindow('open');

    $('#HideRowId').attr('value', RowId);

    if (value !== '' && value !== 'X') {
        $('#ImageView2').attr('src', "images/product/" + RowId + "/" + value);
    }
    else {
        $('#ImageView2').attr('src', "/images/NoFoto.jpg");
    }

}