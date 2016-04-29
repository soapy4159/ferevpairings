//revpairings.js
/* baby app to calculate stat mods, growth rates, max stats, and class inheritance for fe fates units. matchmake away! 
 *
 * Sophie Laupheimer
 */
"use strict";
$(document).ready(function() { //on document load
    createPage();
    createFG();
    gogogo(); //gogogo!!
}); 
function gogogo() {
    fillBoonBaneTalent(); //add option tags to boon/bane/talent select boxes
    fillBBTable(); //display boon/bane information
    $("#boonSelect").change(updateBoonBane); //assign event handler
    $("#baneSelect").change(updateBoonBane); //""
    $("#talentSelect").change(updateTalent); //""
    $(".typeK").each(function() { //for each display option
        var kid = getUnitO($(this).data("unit"));
        //creating and appending type option tags...
        $(this).append($("<option></option>").val("mods").text("Stat Modifiers"));
        $(this).append($("<option></option>").val("bases").text("Base Growth Rates"));
        $(this).append($("<option></option>").val("grs").text("Effective Growth Rates"));
        $(this).append($("<option></option>").val("max").text("Max Stats"));
        $(this).append($("<option></option>").val("pb").text("Max Pair Up Bonuses"));
        $(this).change(function() { //assign event handler
            updateInnerChild(kid);
            updateView(kid)
        });
    });
    $(".typeF").each(function() { //for each display option
        var unit = getUnitO($(this).data("unit"));
        //creating and appending type option tags...
        $(this).append($("<option></option>").val("mods").text("Stat Modifiers"));
        $(this).append($("<option></option>").val("bases").text("Base Growth Rates"));
        $(this).append($("<option></option>").val("grs").text("Effective Growth Rates"));
        $(this).append($("<option></option>").val("max").text("Max Stats"));
        $(this).append($("<option></option>").val("pb").text("Max Pair Up Bonuses"));
        $(this).change(function() { //assign event handler
            updateViewF(unit);
        });
    });
    $(".clK").each(function() { //for each class select
        var kid = getUnitO($(this).data("unit"));
        clDir("", kid);
        $(this).change(function() { //assign event handler
            updateInnerChild(kid);
            updateView(kid);
        });
    });
    $(".clF").each(function() { //for each first gen class select
        var unit = getUnitO($(this).data("unit"));
        if(unit == corrinF || unit == corrinM) {
            fillCorrinClass(unit);
        }
        else {
            clDir("", unit);
        }
        updateViewF(unit);
        $(this).change(function() { //assign event handler
            updateViewF(unit);
        });
    });
    $(".sp").each(function() { //for each sp select box
        var kid = getUnitO($(this).data("unit"));
        fillKid(kid);
        updateView(kid);
        $(this).change(function() { //assign event handler
            clDir("sp", kid);
            updateInnerChild(kid);
            updateView(kid);
        });
    });
    $(".apl").each(function() { //for each bff select
        var unit = getUnitO($(this).data("unit"));
        var noBFF = document.createElement("option");
        $(noBFF).val("-").text("-");
        $(this).append(noBFF);
        for(var i = 0; i < unit.bff.length; i++) { //fill options
            var opt = document.createElement("option");
            $(opt).val(unit.bff[i]).text(unit.bff[i]);
            $(this).append(opt);
        }
        $(this).change(function() { //assign event handler
            clDir("apl", unit);
        });
    });
    $(".spl").each(function() { //for each s select
        var unit = getUnitO($(this).data("unit"));
        var noLove = document.createElement("option");
        $(noLove).val("-").text("-");
        $(this).append(noLove);
        for(var i = 0; i < unit.sRank.length; i++) { //fill options
            var opt = document.createElement("option");
            $(opt).val(unit.sRank[i]).text(unit.sRank[i]);
            $(this).append(opt);
        }
        $(this).change(function() { //assign event handler
            clDir("spl", unit);
        });
    });
    $("#toggleSpoiler").click(function() { //assign event handler
        $("#revSpoiler").toggle(); //hide or expand spoiler div
        if($(this).text() == "+") { //if was hidden
            $(this).text("-");
            $("#revShowHide").text("Hide");
        }
        else { //otherwise
            $(this).text("+");
            $("#revShowHide").text("Show");
        }
    });
    $("#toggleFG").click(function() { //assign event handler
        $("#ffs").toggle(); //hide or expand first gen table
        if($(this).text() == "-") { //if was expanded
            $(this).text("+");
            $("#fgShowHide").text("Show");
        }
        else { //otherwise
            $(this).text("-");
            $("#fgShowHide").text("Hide");
        }
    });
    $("#toggleK").click(function() { //assign event handler
        $("#kds").toggle(); //hides or expands kid table
        if($(this).text() == "-") { //if was expanded
            $(this).text("+");
            $("#kidsShowHide").text("Show");
        }
        else { //otherwise
            $(this).text("-");
            $("#kidsShowHide").text("Hide");
        }
    });
}
var statArr = ["HP", "Str", "Mag", "Skl", "Spd", "Lck", "Def", "Res"]; //array of all stats, used to assign/display stats using loops
function createPage() {
    for(var i = 0; i < allKiddies.length; i++) { //for each kid
        var kiddo = allKiddies[i];
        var kid = kiddo.vName;
        var row = document.createElement("tr") //make table row for kid
        $(row).attr("id", kid + "Stats").addClass("stats"); //add attrs
        if(i % 2 == 0) { //if even
            $(row).addClass("even"); //add even class
        }
        else { //if odd
            $(row).addClass("odd"); //add odd class
        }
        var kidName = document.createElement("td"); //make table column for kid name
        if(kiddo.isRoyal) { //if royal
            $(kidName).attr("id", kid + "Name").addClass("n").text(kiddo.n + "*"); //add attrs
        }
        else {
            $(kidName).attr("id", kid + "Name").addClass("n").text(kiddo.n); //add attrs
        }
        var fp = document.createElement("td"); //make td for first parent name
        if(kiddo.firstParent.isRoyal) {
            $(fp).addClass("n").text(kiddo.firstParent.n + "*"); //add attrs
        }
        else {
            $(fp).addClass("n").text(kiddo.firstParent.n); //add attrs
        }
        var secParCol = document.createElement("td"); //make td for second parent select
        var secParSelect = document.createElement("select"); //make second parent select
        $(secParSelect).attr("id", kid + "SecPar").attr("data-unit", kiddo.n).addClass("sp"); //add attrs
        $(secParCol).append(secParSelect); //append to second parent select td
        var apl = document.createElement("td"); //make td for apl select
        var aplSelect = document.createElement("select"); //make apl select
        $(aplSelect).attr("id", kid + "Apl").attr("data-unit", kiddo.n).addClass("apl");
        $(apl).append(aplSelect);
        var spl = document.createElement("td"); //make td for spl select
        var splSelect = document.createElement("select"); //make spl select
        $(splSelect).attr("id", kid + "Spl").attr("data-unit", kiddo.n).addClass("spl");
        $(spl).append(splSelect);
        var cl = document.createElement("td"); //make td for class select
        var clSelect = document.createElement("select"); //make class select
        $(clSelect).attr("id", kid + "Class").attr("data-unit", kiddo.n).addClass("clK"); //add attrs
        $(cl).append(clSelect); //append to class td
        var type = document.createElement("td"); //make td for type select
        var typeSelect = document.createElement("select"); //make type select
        $(typeSelect).attr("id", kid + "Type").attr("data-unit", kiddo.n).addClass("typeK"); //add attrs
        $(type).append(typeSelect); //append to type td
        $(row).append(kidName).append(fp).append(secParCol).append(apl).append(spl).append(cl).append(type); //append tds to tr
        for(var j = 0; j < statArr.length; j++) { //for each stat
            var statCol = document.createElement("td"); //create td for stat display
            $(statCol).attr("id", kid + statArr[j]).addClass("sv"); //add attrs
            $(row).append(statCol); //append to row
        }
        $("#kiddies").append(row); //append row to table
    }
}
function fillBoonBaneTalent() {
    for(var i = 0; i < boonArr.length; i++) { //for each boon
        var boon = boonArr[i].txtVal;
        $("#boonSelect").append($("<option></option>").val(boon).text(boon).attr("data-optNo", i)); //make boon option tag
        var bane = baneArr[i].txtVal;
        $("#baneSelect").append($("<option></option").val(bane).text(bane).attr("data-optNo", i)); //make bane option tag
    }
    for(var i = 0; i < talents.length; i++) { //for each talent
        var tal = talents[i].talentN;
        $("#talentSelect").append($("<option></option").val(tal).text(tal).attr("data-optNo", i)); //make talent option tag
    }
}
/* displays boon/bane information on the bbTable */
function fillBBTable() {
    var cMods = getModArr(corrinF);
    var cGR = getGRArrU(corrinF);
    for(var i = 0; i < statArr.length; i++) { //for each stat
        $("#corrin" + statArr[i]).empty().text(cMods[i]); //display mod
        $("#corrin" + statArr[i] + "GR").empty().text(cGR[i]); //display gr
    }
}
/* makes changes to corrin when boon or bane is changed */
function updateBoonBane() {
    //get mod and gr arrays
    var boModArr = getBoonModArr(getBoon());
    var baModArr = getBaneModArr(getBane());
    var boGRArr = getBoonGRArr(getBoon());
    var baGRArr = getBaneGRArr(getBane());
    var cbgr = getGRBaseArr(corrinF);
    for(var i = 0; i < statArr.length; i++) { //for each stat
        updateGR(statArr[i], (boGRArr[i] + baGRArr[i] + cbgr[i]), corrinF);
        updateGR(statArr[i], (boGRArr[i] + baGRArr[i] + cbgr[i]), corrinM);
        if(i != 0) { //if stat is not hp
            updateMod(statArr[i], boModArr[i] + baModArr[i], corrinF);
            updateMod(statArr[i], boModArr[i] + baModArr[i], corrinM);
        }
    }
    corrinF.cpb = getBoon().cpb.slice(0);
    corrinF.spb = getBoon().spb.slice(0);
    corrinM.cpb = getBoon().cpb.slice(0);
    corrinM.spb = getBoon().spb.slice(0);
    /* fills the bb table with corrin's current info and modifies all their kids */
    fillBBTable(); //display mod and gr info
    updateViewF(corrinF);
    updateViewF(corrinM);
    var corrinsKids = [kanaF, kanaM]; //to keep track of corrin's kids
    $.each($(".sp"), function() { //for each second parent select box
        for(var i = 0; i < allKiddies.length; i++) { //for each kid
            if($(this).val() == "Corrin (F)" || $(this).val() == "Corrin (M)") { //if second parent is corrin
            if($(this).attr("data-unit") == allKiddies[i].n) { //if matching kid
                corrinsKids.push(allKiddies[i]);
            }
        }}
    });
    for(var i = 0; i < corrinsKids.length; i++) { //for each of corrin's kids
        updateInnerChild(corrinsKids[i]);
        updateView(corrinsKids[i]);
    }
}
/* accepts a kid object and adds parent option tags and updates mods from first parent */
function fillKid(kid) {
    var v = kid.vName;
    for(var i = 0; i < kid.secondParent.length; i++) { //for each parent option
        var secPar = kid.secondParent[i];
        $("#" + v + "SecPar").append($("<option></option>").val(secPar).text(secPar).attr("data-optNo", i)); //add parent option tag
    }
    var fMods = getModArr(kid.firstParent); 
    var j; //initialize j-- mod
    for(var i = 1; i < statArr.length; i++) { //for each stat
        j = fMods[i] + 1; //assume second parent is not a kid
        updateMod(statArr[i], j, kid); //update mod
    }
}
/* accepts a class string and a unit object and returns the class string that corresponds to the kid's sex */
function getSexedClass(cl, unit) {
    if(cl == "Shrine Maiden" && unit.sex == "M") {
        cl = "Monk";
    }
    else if(cl == "Monk" && unit.sex == "F") {
        cl = "Shrine Maiden";
    }
    else if(cl == "Priestess" && unit.sex == "M") {
        cl = "Great Master";
    }
    else if(cl == "Great Master" && unit.sex == "F") {
        cl = "Priestess";
    }
    else if(cl == "Maid" && unit.sex == "M") {
        cl = "Butler";
    }
    else if(cl == "Butler" && unit.sex == "F") {
        cl = "Maid";
    }
    else if(cl == "Nohr Princess" && unit.sex == "M") {
        cl = "Nohr Prince";
    }
    else if(cl == "Nohr Prince" && unit.sex == "F") {
        cl = "Nohr Princess";
    }
    return cl; //return sexed class
}
/* accepts a kid string and returns the selected second parent's object */
function getSecPar(v) {
    var secPar = $("#" + v + "SecPar").val(); //gets second parent's string name
    return getUnitO(secPar);
}
function getApl(v) {
    var apl = $("#" + v + "Apl").val();
    return getUnitO(apl);
}
function getSpl(v) {
    var spl = $("#" + v + "Spl").val();
    return getUnitO(spl);
}
/* accepts a unit string and returns the selected class object */
function getCl(v) { 
    var cl = $("#" + v + "Class").val(); //get selected class string
    for(var i = 0; i < allClasses.length; i++) { //for every class
        if(allClasses[i].n == cl) { //if class object found
            return allClasses[i]; //return class object
        }
    }
    return noClass; //still amusing
}
/* takes a class string and returns the class object */
function getClO(str) {
    for (var i = 0; i < allClasses.length; i++) { //for every class
        if(allClasses[i].n == str) { //if class object found
            return allClasses[i]; //return class object
        }
    }
    return noClass; //yep
}
/* takes a unit name string and returns the unit object */
function getUnitO(str) {
    for(var i = 0; i < allUnits.length; i++) { //for every unit
        if(allUnits[i].n == str) { //if unit object found
            return allUnits[i]; //return unit object
        }
    }
    return noPar;
}
/* returns selected boon object */
function getBoon() {
    for(var i = 0; i < boonArr.length; i++) { //for each boon
        if(boonArr[i].txtVal == $("#boonSelect").val()) { //if boon object found
            return boonArr[i]; //return boon
        }
    }
    return noBB; //return noBB object
}
/* returns selected bane object */
function getBane() {
    for(var i = 0; i < baneArr.length; i++) { //for each bane
        if(baneArr[i].txtVal == $("#baneSelect").val()) { //if bane object found
            return baneArr[i]; //return bane
        }
    }
    return noBB; //return noBB object
}
/* accepts a kid object and updates kid objects info */
function updateInnerChild(kid) {
    var v = kid.vName;
    var secPar = getSecPar(v); //gets second parent object
    var firstPar = kid.firstParent; //gets first parent object
    if(firstPar.isRoyal || secPar.isRoyal) { //if either parent is royal
        kid.isRoyal = true; //kid's royal
    }
    else { //if not
        kid.isRoyal = false; //kid's a filthy pleb
    }
    var fMods = getModArr(firstPar);
    var sMods = getModArr(secPar);
    var kGR = getGRBaseArr(kid);
    var sGR = getGRArrU(secPar);
    var cGR = getGRArrC(getCl(v));
    //calculating mods...
    for(var i = 1; i < statArr.length; i++) { //for each stat
        var j = fMods[i] + sMods[i]; //sum of parents' mods
        if(!secPar.isChild) { //if second parent isn't a child
            j++; // add 1 for not being a pedo
        }
        updateMod(statArr[i], j, kid); //update kid's stat mod
    }
    //calculating growth rates...
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j; //initialize j-- kid's grs
        if(secPar != noPar) { //if second parent is selected
            j = (kGR[i] + sGR[i]) / 2; //average of kid's grs and second grs 
        }        
        else { //if no second parent selected
            j = kGR[i]; //kid's grs
        }
        updateGR(statArr[i], j, kid);
    }
    //assigning pair up bonuses...
    if(firstPar.sex == "M") { //if first parent is father
        kid.cpb = firstPar.cpb.slice(0);
        kid.bpb = secPar.bpb.slice(0);
        kid.apb = firstPar.apb.slice(0);
        kid.spb = secPar.spb.slice(0);
    }
    else { //else
        kid.cpb = secPar.cpb.slice(0);
        kid.bpb = firstPar.bpb.slice(0);
        kid.apb = secPar.apb.slice(0);
        kid.spb = firstPar.spb.slice(0);
    }
    if(kid == getSecPar(kanaF.vName)) {
        updateInnerChild(kanaF);
        updateView(kanaF);
    }
    if(kid == getSecPar(kanaM.vName)) {
        updateInnerChild(kanaM);
        updateView(kanaM);
    }
}
/* accepts a kid object and updates the information displayed */
function updateView(kid) {
    var v = kid.vName
    var cl = getCl(v);
    var modArr = getModArr(kid);
    var baseGRArr = getGRBaseArr(kid);
    var grArr = getGRArrU(kid);
    var grArrC = getGRArrC(cl);
    var maxClArr = getMaxStatArr(cl);
    $("#" + v + "Name").empty();
    if(kid.isRoyal) { //if royal
        $("#" + v + "Name").text(kid.n + "*");
    }
    else {
        $("#" + v + "Name").text(kid.n);
    }
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j; //initialize j-- mod, gr, or max stat value
        if($("#" + v + "Type").val() == "mods") {//if mods selected
            j = modArr[i]; //set to stat mod
        }
        else if($("#" + v + "Type").val() == "bases") {
            j = baseGRArr[i];
        }
        else if($("#" + v + "Type").val() == "grs") {//if grs selected
            j = grArr[i] + grArrC[i]; //set to gr
        }
        else if($("#" + v + "Type").val() == "max") { //if max stats selected
            if(i == 0) { //if i is 0
                j = maxClArr[i]; //set to max stat
            }
            else { //if not
                j = maxClArr[i] + modArr[i]; //set to max stat + mod
            }
        }
        else { //if pair up bonuses selected
            if(i == 0) {
                j = "-";
            }
            else {
                j = kid.cpb[i - 1] + kid.bpb[i - 1] + kid.apb[i - 1] + kid.spb[i - 1] + cl.pb[i - 1];
            }
        }
        $("#" + v + statArr[i]).empty().append(j); //update display
    }
}
/* updates the selected talent */
function updateTalent() {
    var tal = $("#talentSelect").val(); //get selected talent string
    var ct = "-";
    for(var i = 0; i < talents.length; i++) { //for each talent
        if(talents[i].talentN == tal) { //if talent object found
            ct = talents[i].n;
            i = talents.length; //ends loop
        }
    }
    if(corrinF.baseClass.length != 1) { //if had talent assigned
        corrinF.baseClass.pop();
        corrinM.baseClass.pop();
        kanaF.baseClass.pop();
        kanaM.baseClass.pop();
    }
    if(ct != noClass) { //if talent selected
        var fct = getSexedClass(ct, kanaF);
        var mct = getSexedClass(ct, kanaM);
        corrinF.baseClass.push(fct);
        corrinM.baseClass.push(mct);
        kanaF.baseClass.push(fct);
        kanaM.baseClass.push(mct);
        clDir("sp", kanaF);
        clDir("sp", kanaM);
        updateView(kanaF);
        updateView(kanaM);
    }
    $(".spl").each(function() {
        var u = $(this).val();
        if(u == corrinF.n || u == corrinM.n) {
            var unit = getUnitO($(this).data("unit"));
            clDir("spl", unit);
        }
    });
}
/* accepts mod string, int val, and unit object and updates the unit's mod to val */
function updateMod(mod, val, unit) {
    if(mod == "Str") {
        unit.strMod = val;
    }
    else if(mod == "Mag") {
        unit.magMod = val;
    }
    else if(mod == "Skl") {
        unit.sklMod = val;
    }
    else if(mod == "Spd") {
        unit.spdMod = val;
    }
    else if(mod == "Lck") {
        unit.lckMod = val;
    }
    else if(mod == "Def") {
        unit.defMod = val;
    }
    else {
        unit.resMod = val;
    }
}
/* accepts gr string, int val, and unit object and updates that unit's gr to val */
function updateGR(gr, val, unit) {
    if(gr == "HP") {
        unit.hpGR = val;
    }
    else if(gr == "Str") {
        unit.strGR = val;
    }
    else if(gr == "Mag") {
        unit.magGR = val;
    }
    else if(gr == "Skl") {
        unit.sklGR = val;
    }
    else if(gr == "Spd") {
        unit.spdGR = val;
    }
    else if(gr == "Lck") {
        unit.lckGR = val;
    }
    else if(gr == "Def") {
        unit.defGR = val;
    }
    else {
        unit.resGR = val;
    }
}
/* creates the fgTable */
function createFG() {
    for(var i = 0; i < allFG.length; i++) { //for each fg
        var unit = allFG[i];
        var unitV = unit.vName;
        var row = document.createElement("tr"); //made tr for fg
        $(row).attr("id", unitV + "Stats").addClass("stats"); //assign props
        if(i % 2 == 0) { //if even
            $(row).addClass("even"); //add even class
        }
        else { //if odd
            $(row).addClass("odd"); //add odd class
        }
        var fgName = document.createElement("td"); //make td to display name
        if(unit.isRoyal) {
            $(fgName).addClass("n").text(unit.n + "*"); //assign props
        }
        else {
            $(fgName).addClass("n").text(unit.n); //assign props
        }
        var apl = document.createElement("td"); //make td for apl select
        var aplSelect = document.createElement("select"); //make apl select
        $(aplSelect).attr("id", unitV + "Apl").attr("data-unit", unit.n).addClass("apl");
        $(apl).append(aplSelect);
        var spl = document.createElement("td"); //make td for spl select
        var splSelect = document.createElement("select"); //make spl select
        $(splSelect).attr("id", unitV + "Spl").attr("data-unit", unit.n).addClass("spl");
        $(spl).append(splSelect);
        var cl = document.createElement("td"); //make td for class select
        var clSelect = document.createElement("select"); //make class select for fg
        $(clSelect).attr("id", unitV + "Class").attr("data-unit", unit.n).addClass("clF"); //assign props
        $(cl).append(clSelect); //append to td
        var type = document.createElement("td"); //make td for display select
        var typeSelect = document.createElement("select"); //make display select
        $(typeSelect).attr("id", unitV + "Type").attr("data-unit", unit.n).addClass("typeF"); //assign props
        $(type).append(typeSelect); //append to td
        $(row).append(fgName).append(apl).append(spl).append(cl).append(type); //append to row
        for(var j = 0; j < statArr.length; j++) { //for each stat
            var statCol = document.createElement("td"); //create td for stat display
            $(statCol).attr("id", unitV + statArr[j]).addClass("sv"); //add attrs
            $(row).append(statCol); //append to row
        }
        $("#firstGen").append(row); //append to table
    }
}
/* update displayed information of fg unit */
function updateViewF(unit) {
    var v = unit.vName;
    var cl = getCl(v);
    var modArrU = getModArr(unit);
    var grArrU = getGRArrU(unit);
    var grArrC = getGRArrC(cl);
    var maxStatArr = getMaxStatArr(cl);
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j;
        if($("#" + v + "Type").val() == "mods") { //mods selected
            j = modArrU[i];
        }
        else if($("#" + v + "Type").val() == "bases") {
            j = grArrU[i];
        }
        else if($("#" + v + "Type").val() == "grs") { //if grs selected
            j = grArrU[i] + grArrC[i];
        }
        else if($("#" + v + "Type").val() == "max") { //if max stats selected
            if(i == 0) { //if hp
                j = maxStatArr[i];
            }
            else { //otherwise
                j = maxStatArr[i] + modArrU[i];
            }
        }
        else {
            if(i == 0) {
                j = "-";
            }
            else {
                j = unit.cpb[i - 1] + unit.bpb[i - 1] + unit.apb[i - 1] + unit.spb[i - 1] + cl.pb[i - 1];
            }
        }
        $("#" + v + statArr[i]).empty().append(j); //update display
    }
}
/* accepts a unit object and sets up the classes that are available by default */
function setUpClass(unit) {
    //setting up variables...
    var v = unit.vName;
    var bc = unit.baseClass;
    var clOpts = [];
    var sel = $("#" + v + "Class");
    $(sel).empty(); //empty select
    for(var i = 0; i < bc.length; i++) { //for each base class
        if(bc[i] != "-") { //if legit class
            clOpts.push(bc[i]);
            for(var j = 0; j < getClO(bc[i]).promotesTo.length; j++) { //for each of the current base class' promotions
                if($.inArray(getSexedClass(getClO(bc[i]).promotesTo[j], unit), clOpts) == -1) { //if new class
                    clOpts.push(getSexedClass(getClO(bc[i]).promotesTo[j], unit));
                }
            }
        }
    }
    //adding the options to the select
    for(var i = 0; i < clOpts.length; i++) { //for each option
        var opt = document.createElement("option");
        $(opt).val(clOpts[i]).text(clOpts[i]);
        $(sel).append(opt);
    }
}
function newCl(rel, ou, unit, clOpts) {
    if(ou == noPar) {
        return clOpts;
    }
    var obc = ou.baseClass;
    var oc = getSexedClass(obc[0], unit);
    //if other unit is corrin of fuzzy and not parent child rel
    if((ou == corrinF || ou == corrinM || ou == keaton || ou == velouria || ou == kaden || ou == selkie || ou == mozu || ou == azura) && rel == "np") {
        if(obc.length > 1) {
            oc = obc[1];
            if(oc == unit.baseClass[0]) {
                oc = getClO(obc[0]).llCl;
            }
        }
        else {
            return clOpts;
        }
    }
    if(rel == "np") {
        if(oc == unit.baseClass[0]) {
            oc = obc[1];
        }
        return clOpts;
    }
    if(rel == "p" && unit.firstParent.sex == "F") { //if fixed parent is female
        clOpts = [clOpts[0]];
        if(oc == clOpts[0]) {
            oc = obc[1];
        }
        clOpts.push(oc);
        obc = unit.firstParent.baseClass;
        oc = getSexedClass(obc[0], unit);
    }
    if(oc == "Songstress") { //if other unit is azura
        oc = obc[1];
        if($.inArray(oc, clOpts) != -1) { //if unit has sky knight
            oc = getClO(obc[0]).llCl;
            if($.inArray(oc, clOpts) != -1) { //if unit has troubadour
                oc = getClO(obc[1]).llCl;
            }
        }
    }
    else { //if second parent is not azura
        if($.inArray(oc, clOpts) != -1) { //if unit has class
            if(obc.length > 1) { //if second parent has more than one base class
                oc = getSexedClass(obc[1], unit); //get second parent's second class
            }
            if($.inArray(oc, clOpts) != -1 && !(obc[0] == "Nohr Prince" || obc[0] == "Nohr Princess")) { //if unit has class
                oc = getSexedClass(getClO(obc[0]).llCl, unit); //get parallel class
            }
            else if($.inArray(oc, clOpts) != -1 && (obc[0] == "Nohr Prince" || obc[0] == "Nohr Princess") && obc.length > 1) {
                oc = getSexedClass(getClO(obc[1]).llCl, unit);
            }
        }
    }
    if($.inArray(oc, clOpts) == -1) { // if not in array
        clOpts.push(oc)
    }
    return clOpts;
}
/* accepts string and unit object and determines order of adding classes */
function clDir(x, unit) {
    if(unit == corrinF || unit == corrinM) { //if corrin
        return;
    }
    var clOpts = unit.baseClass.slice(0);
    var apl = getApl(unit.vName);
    var spl = getSpl(unit.vName);
    if(x == "sp") { //if sp changed
        clOpts = newCl("p", getSecPar(unit.vName), unit, clOpts);
        if(unit.lr == "apl") { //if a rank was last chosen
            clOpts = newCl("np", spl, unit, clOpts);
            clOpts = newCl("np", apl, unit, clOpts);
        }
        else {
            clOpts = newCl("np", apl, unit, clOpts);
            clOpts = newCl("np", spl, unit, clOpts);
        }
    }
    if(x == "apl") { //if a rank changed
        if(unit.isChild) { //if child
            unit.lr = "apl";
            clOpts = newCl("p", getSecPar(unit.vName), unit, clOpts);
        }
        clOpts = newCl("np", spl, unit, clOpts);
        clOpts = newCl("np", apl, unit, clOpts);
    }
    if(x == "spl") { //if s rank changed
        if(unit.isChild) { //if child
            unit.lr = "spl";
            clOpts = newCl("p", getSecPar(unit.vName), unit, clOpts);
        }
        clOpts = newCl("np", apl, unit, clOpts);
        clOpts = newCl("np", spl, unit, clOpts);
    }
    addClOpts(clOpts, unit);
    if(unit.isChild) {
        updateView(unit);
    }
    else {
        updateViewF(unit);
    }
}
/* accepts an array of strings and a unit object and fills up the class select */
function addClOpts(clOpts, unit) {
    var fullClOpts = [];
    var sel = $("#" + unit.vName + "Class");
    $(sel).empty();
    for(var i = 0; i < clOpts.length; i++) {
        if(clOpts[i] != "-") {
            fullClOpts.push(getSexedClass(clOpts[i], unit));
            for(var j = 0; j < getClO(clOpts[i]).promotesTo.length; j++) {
                if($.inArray(getSexedClass(getClO(clOpts[i]).promotesTo[j], unit), fullClOpts) == -1) {
                    fullClOpts.push(getSexedClass(getClO(clOpts[i]).promotesTo[j], unit));
                }
            }
        }
    }
    for(var i = 0; i < fullClOpts.length; i++) {
        var opt = document.createElement("option");
        $(opt).val(fullClOpts[i]).text(fullClOpts[i]);
        $(sel).append(opt);
    }
        var sel = $("#" + unit.vName + "Class");
    if(unit.sex == "F") { //if lady
        for(var i = 0; i < otherClsF.length; i++) {
            var opt = document.createElement("option");
            $(opt).val(otherClsF[i].n).text(otherClsF[i].n);
            $(sel).append(opt);
        }
    }
    else { //if gent
    for(var i = 0; i < otherClsM.length; i++) {
            var opt = document.createElement("option");
            $(opt).val(otherClsM[i].n).text(otherClsM[i].n);
            $(sel).append(opt);
        }
    }
}
/* accepts corrin object and fills in all classes */
function fillCorrinClass(unit) {
    var sel = $("#" + unit.vName + "Class");
    if(unit == corrinF) {
        for(var i = 0; i < allClCorF.length; i++) {
            var opt = document.createElement("option");
            $(opt).val(allClCorF[i].n).text(allClCorF[i].n);
            $(sel).append(opt);
        }
    }
    else {
        for(var i = 0; i < allClCorM.length; i++) {
            var opt = document.createElement("option");
            $(opt).val(allClCorM[i].n).text(allClCorM[i].n);
            $(sel).append(opt);
        }
    }
    if(unit.isChild) {
        updateInnerChild(unit);
        updateView(unit);
    }
    else {
        updateViewF(unit);
    }
}
