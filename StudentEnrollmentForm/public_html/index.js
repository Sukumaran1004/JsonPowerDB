/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var empDBName = 'StudentDatabase';
var empRelationName = 'StudentData';
var connToken = '90932258|-31949270826202976|90954428';

$('#rollno').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getEmpIdAsJsonObj(){
    var rollno = $('#rollno').val();
    var jsonStr = {
        rollno:rollno 
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#stdname').val(record.name);
    $('#stdclass').val(record.class);
    $('#birth').val(record.BirthDate);
    $('#address').val(record.address);
    $('#enroll').val(record.EnrollmentDate);
}

function resetForm(){
    $('#rollno').val("");
    $('#stdname').val("");
    $('#stdclass').val("");
    $('#birth').val("");
    $('#address').val("");
    $('#enroll').val("");
    $('#rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollno').focus();
}

function validateData() {
    var rollno , stdname, stdclass, birthdate, address, enrolldate;
    rollno = $("#rollno").val();
    stdname = $("#stdname").val();
    stdclass = $("#stdclass").val();
    birthdate = $("#birth").val();
    address = $("#address").val();
    enrolldate = $("#enroll").val();

    if (rollno === "") {
        alert('Student Roll Number missing');
        $("#rollno").focus();
        return "";
    }
    if (stdname === "") {
        alert('Student Name missing');
        $("#stdname").focus();
        return "";
    }
    if (stdclass === "") {
        alert('Student class missing');
        $("#stdclass").focus();
        return "";
    }
    if (birthdate === "") {
        alert('Birth Date missing');
        $("#birth").focus();
        return "";
    }
    if (address === "") {
        alert('Student Address missing');
        $("#address").focus();
        return "";
    }
    if (enrolldate === "") {
        alert('Student Enrollment date missing');
        $("#enroll").focus();
        return "";
    }

    var jsonStrObj = {
        rollno: rollno,
        name: stdname,
        class: stdclass,
        BirthDate: birthdate,
        address: address,
        EnrollmentDate: enrolldate
    };
    return JSON.stringify(jsonStrObj);

}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName,empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    $('#save').prop('disabled', false);
    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stdname').focus();
    }else if (resJsonObj.status === 200){
        $("#rollno").prop('disabled', true);
        fillData(resJsonObj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stdname').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === ''){
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,empDBName,empRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollno').focus();
}

function changeData() {
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createdUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}





