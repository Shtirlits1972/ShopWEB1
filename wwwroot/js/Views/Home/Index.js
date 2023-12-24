$(document).ready(function () {

    var tabName = "#ProductListView";
    var url = "/api/Products/";

    $("#ProductListView").jqxListBox({ width: '500px', height: '750px', });
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

        //updaterow: function (rowid, rowdata, commit) {

        //    var modelProduct = {
        //        'id': rowid,
        //        'productName': rowdata.productName,
        //        'price': rowdata.price,
        //        'categoryId': rowdata.categoryId,
        //        'categoryName': rowdata.categoryName,
        //        'foto': rowdata.foto,
        //        'category': { 'id': rowdata.categoryId, 'categoryName': rowdata.categoryName }
        //    };

        //    console.log(JSON.stringify(modelProduct));

        //    var settings = {
        //        "url": url + rowid,
        //        "method": "PUT",
        //        "timeout": 0,
        //        "headers": {
        //            "Content-Type": "application/json"
        //        },
        //        "data": JSON.stringify(modelProduct),
        //    };
        //    var t = 0;
        //    $.ajax(settings).done(function (data) {
        //        console.log(data);
        //        commit(true);
        //        $(tabName).jqxGrid('updatebounddata', 'cells');
        //    }).fail(function () {
        //        commit(false);
        //        console.log('Error');
        //    });
        //},

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
            { name: "categoryName", map: "category>categoryName", type: 'string' },
            { name: 'foto', type: 'string' }
        ],

        //loadComplete: function () {
        //    dataAdapterCategories.dataBind();

        //    //console.log('dataAdapterCategories.records');
        //    //console.log(dataAdapterCategories.records);
        //},

        id: 'id',
        url: url
    };

    var dataAdapter = new $.jqx.dataAdapter(source,
        {
            autoBind: true,
            loadComplete() {
                dataAdapterCategories.dataBind();

                var records = dataAdapter.records;
                var length = records.length;

                for (var i = 0; i < length; i++) {

                    //   console.log(records[i].productName);

                    var listItem = "<table style=\" height: 150px; width: 100%; \">"

                        + "<tr>"
                        + "<td>" + records[i].productName + "</td>"
                        + "</tr>";


                    if (records[i].foto.trim() !== '' && records[i].foto !== null && records[i].foto !== undefined && records[i].foto.length > 3 && records[i].foto !== 'X') {
                        listItem += '<tr><td ><img src="images/product/' + records[i].id + '/' + records[i].foto + ' "     style="max-width: 300px; max-height: 100px; object-fit: cover;" ></td></tr>';
                        //   
                    }
                    else {
                        listItem += '<tr  style="width: 100%; height: 100%; " ><td style="width: 100%;  height: 100%; " ><div  style="background-color: #ABBAEA; width: 150px;  height: 100%; display: flex; justify-content: center;  align-items: center; "    > Нет фото </div></td></tr>';
                    }

                    listItem += "<tr>"
                        + "<td> Price: " + records[i].price + " $ </td>"
                        + "</tr>"

                        + "</table>";

                    console.dir(listItem);

                    $("#ProductListView").jqxListBox('addItem', listItem);
                }
            }
        });

});