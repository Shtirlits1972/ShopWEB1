$(document).ready(function () {

    var productImageDir = "/wwwroot/images/product/";

    $("#EditImage").jqxWindow({
        width: 300, height: 250, resizable: false, isModal: true, autoOpen: false, cancelButton: $("#CancelImage"), modalOpacity: 0.01
    });

    $("#SaveImage").click(function () {

        var file = null;
        var fileName = 'X';  //  без этого на сервере выдаёт кракозябры???

        var RowId = document.getElementById("HideRowId").value;
        var rowdata = $("#tabProducts").jqxGrid('getrowdatabyid', RowId);

        if ($("#ImgIsChange2").val() === 'false') {

            fileName = productImageDir + RowId;
        }
        else {

            if (document.getElementById("FotoInput2").files && document.getElementById("FotoInput2").files[0]) {

                file = document.getElementById("FotoInput2").files[0];

                if (file !== null && file !== undefined) {
                    fileName = file.name;
                }
            }
        }

        var model =
        {
            'id': RowId,
            'productName': rowdata.productName,
            'price': rowdata.price,
            'categoryId': rowdata.categoryId,
            'categoryName': rowdata.categoryName,
            'category': { 'id': rowdata.categoryId, 'categoryName': rowdata.categoryName },
            'foto': fileName
        };

        console.log(fileName);
       debugger;


        $('#tabProducts').jqxGrid('updaterow', RowId, model);

        debugger;

        var FotoInput = document.getElementById("FotoInput2");
        var req = new XMLHttpRequest();
        var formData = new FormData();

        formData.append("foto", FotoInput.files[0]);
        formData.append("strId", RowId);
        formData.append("IsEdit", true);
        debugger;
        req.open("POST", '/api/Products/LoadImage/');  //
        req.send(formData);

        $("#EditImage").jqxWindow('hide');

        $("#CancelImage").click(function () {
            clearFoto1();
        });

    });

});

    function clearFoto2() {

        $("#ImgIsChange2").val('true');
        $("#FotoInput2").val('');
        $('#ImageView2').attr('src', "/images/NoFoto.jpg");
        //$('#HideRowId').attr('value', 0);
    }

    function clearFoto1() {

        $("#ImgIsChange2").val('false');
        $("#FotoInput2").val('');
        $('#ImageView2').attr('src', "/images/NoFoto.jpg");
        $('#HideRowId').attr('value', 0);
    }

    function readURL2(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#ImageView2').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
            $("#ImgIsChange2").val('true');
        }
    }