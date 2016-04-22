//revpairings.js
/* baby app to calculate stat mods, growth rates, max stats, and class inheritance for fe fates units. matchmake away! 
 *
 * Sophie Laupheimer
 */
"use strict";
$(document).ready(function() { //on document load
    createPage();
    createFG();
    fillFGClasses();
    gogogo(); //gogogo!!

}); 
function gogogo() {
    fillBoonBaneTalent(); //add option tags to boon/bane/talent select boxes
    fillBBTable(); //display boon/bane information
    $("#boonSelect").change(updateBoonBane); //assign event handler
    $("#baneSelect").change(updateBoonBane); //""
    $("#talentSelect").change(updateTalent); //""
    $(".typeK").each(function() { //for each display option
        var kid = $(this).data("unit"); //get kid name
        var kiddo = noPar;
        for(var i = 0; i < allKiddies.length; i++) { //for each kid
            if(kid == allKiddies[i].n) { //if kid matches
                kiddo = allKiddies[i];
                i = allKiddies.length; //end loop
            }
        }
        //creating and appending type option tags...
        $(this).append($("<option></option>").val("mods").text("Stat Modifiers"));
        $(this).append($("<option></option>").val("bases").text("Base Growth Rates"));
        $(this).append($("<option></option>").val("grs").text("Effective Growth Rates"));
        $(this).append($("<option></option>").val("max").text("Max Stats"));
        $(this).change(function() { //assign event handler
            updateInnerChild(kiddo);
            updateView(kiddo)
        });
    });
    $(".typeF").each(function() { //for each display option
        var unit = $(this).data("unit"); //get unit name
        var unitO = noPar;
        for(var i = 0; i < allFG.length; i++) { //for each unit
            if(unit == allFG[i].n) { //if unit matches
                unitO = allFG[i];
                i = allFG.length; //end loop
            }
        }
        //creating and appending type option tags...
        $(this).append($("<option></option>").val("mods").text("Stat Modifiers"));
        $(this).append($("<option></option>").val("bases").text("Base Growth Rates"));
        $(this).append($("<option></option>").val("grs").text("Growth Rates"));
        $(this).append($("<option></option>").val("max").text("Max Stats"));
        $(this).change(function() { //assign event handler
            updateViewF(unitO);
        });
    });
    $(".clK").each(function() { //for each class select
        var kid = $(this).data("unit"); //get kid name
        var kiddo = noPar;
        for(var i = 0; i < allKiddies.length; i++) { //for each kid
            if(kid == allKiddies[i].n) { //if matching kid
                kiddo = allKiddies[i];
                i == allKiddies.length; //end loop
            }
        }
        updateClass(kiddo); //update class
        $(this).change(function() { //assign event handler
            updateInnerChild(kiddo);
            updateView(kiddo);
        });
    });
    $(".clF").each(function() { //for each first gen class select
        var unit = $(this).data("unit");
        var unitO = noPar;
        for(var i = 0; i < allFG.length; i++) { //for each first gen
            if(unit == allFG[i].n) { //if found match
                unitO = allFG[i];
                i = allFG.length; //end loop
            }
        }
        updateClass(unitO);
        updateViewF(unitO);
        $(this).change(function() { //assign event handler
            updateViewF(unitO);
        });
    });
    $(".sp").each(function() { //for each sp select box
        var kid = $(this).data("unit"); //get kid name
        var kiddo = noPar;
        for(var i = 0; i < allKiddies.length; i++) { //for each kid
            if(kid == allKiddies[i].n) { //if matching kid
                kiddo = allKiddies[i];
                i = allKiddies.length; //end loop
            }
        }
        fillKid(kiddo);
        updateView(kiddo);
        updateClass(kiddo)
        $(this).change(function() { //assign event handler
            updateInnerChild(kiddo);
            updateView(kiddo);
            updateClass(kiddo);
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
        $("#firstGen").toggle(); //hide or expand first gen table
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
        $(kidName).addClass("n").text(kiddo.n); //add attrs
        var fp = document.createElement("td"); //make td for first parent name
        $(fp).addClass("n").text(kiddo.firstParent.n); //add attrs
        var secParCol = document.createElement("td"); //make td for second parent select
        var secParSelect = document.createElement("select"); //make second parent select
        $(secParSelect).attr("id", kid + "SecPar").attr("data-unit", kiddo.n).addClass("sp"); //add attrs
        $(secParCol).append(secParSelect); //append to second parent select td
        var rs = document.createElement("td"); //make td for rs
        $(rs).attr("id", kid + "RS").addClass("rs").text("IDK"); //add attr
        var cl = document.createElement("td"); //make td for class select
        var clSelect = document.createElement("select"); //make class select
        $(clSelect).attr("id", kid + "Class").attr("data-unit", kiddo.n).addClass("clK"); //add attrs
        $(cl).append(clSelect); //append to class td
        var type = document.createElement("td"); //make td for type select
        var typeSelect = document.createElement("select"); //make type select
        $(typeSelect).attr("id", kid + "Type").attr("data-unit", kiddo.n).addClass("typeK"); //add attrs
        $(type).append(typeSelect); //append to type td
        $(row).append(kidName).append(fp).append(secParCol).append(rs).append(cl).append(type); //append tds to tr
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
/* accepts a kid object and updates kids' class options */
function updateClass(unit) {
    var v = unit.vName;
    $("#" + v + "Class").empty(); //remove class option tags
    var clOpts = []; //keep track of unpromoted class options
    var bc = unit.baseClass[0];
    //pushing base class and promotes...
    for(var i = 0; i < unit.baseClass.length; i++) { //for each base class
        var cc = unit.baseClass[i]; //current class
        var ccO = getClO(cc); //current class object
        if(ccO != noClass) {
            clOpts.push(cc);
            for(var j = 0; j < ccO.promotesTo.length; j++) { //for each promoted class
                if($.inArray(getSexedClass(ccO.promotesTo[j], unit)) == -1) { //if sexed class is not in array
                    clOpts.push(getSexedClass(ccO.promotesTo[j], unit));
                }
            }
        }
    }
    if(unit.isChild) {
        var x = "";
        var fp = unit.firstParent;
        var sp = getSecPar(v);
        var fromF = getSexedClass(fp.baseClass[0], unit);
        var fromS = getSexedClass(sp.baseClass[0], unit);
        //determining inheritance from first parent...
        if(fromF == "Songstress") { //if fp is azura
            fromF = "Troubadour"; //shiggy gets troubadour
        }
        else if(fromF == bc && fp.baseClass.length != 1) { //if same class
            fromF = fp.baseClass[1]; //set to fp's second class
        }
        if(fromF != "-") {
            x = getSexedClass(fromF, unit);
            if($.inArray(x, clOpts) == -1) { //if fromF is not kid's base class
                clOpts.push(x);
            }
            x = getSexedClass(getClO(fromF).promotesTo[0], unit);
            if($.inArray(x, clOpts) == -1) { //if first promotion not in clOpts
                clOpts.push(x);
            }
            if(getClO(fromF).promotesTo.length != 1) { //if not a fuzzywuzzy
                x = getSexedClass(getClO(fromF).promotesTo[1], unit);
                if($.inArray(x, clOpts) == -1) { //if second promotion not in clOpts
                    clOpts.push(x); //if it turns out that there is a way to make a option tag's value a defined object and I don't actually have to keep switching between the string names and the object itself, I'm going to flip a serious shit
                }
            }
        }
        else {
        }
        //determining second parent inheritance...
        if(fromS != "-") { //if sp has been selected
            if(fromS == "Songstress") { //if sp is azura
                fromS = sp.baseClass[1]; //give sky knight
                if(fromS == bc || fromS == fromF) { //if already has sky knight
                    fromS = getClO(fromS).llCl; //get troubadour
                }
            }
            else if(bc == fromS && sp.baseClass.length != 1) { //if same class and sp is not talentless (lol) corrin
                fromS = sp.baseClass[1]; //get second parent's second class
                if(fromS == fromF) { //if already has class
                    fromS = getClO(sp.baseClass[0]).llCl; //get parallel class
                }
            }
            if(fromS == fromF && sp.baseClass.length != 1 && fromS == sp.baseClass[0]) {//if same class, sp is not azura or talentless corrin, and fromS is second parent's first class option
                fromS = sp.baseClass[1] //get second parent's second class
            }
            if((fromS == bc && fromS == sp.baseClass[1])) { //if same class and fromS is second parent's second class
                fromS == sp.baseClass[0].llCl; //get parallel class
            }
            for(var i = 0; i < clOpts.length; i++) { //for each class option
                clOpts[i] = "" + clOpts[i]; //ensure string
            }
            if(fromS != "-") { //if class is being passed
                if($.inArray(fromS, clOpts) == -1) { //if not in array
                    clOpts.push(getSexedClass(fromS, unit));
                }
                if(sp.n != "Mozu") { //no promotes on villager
                    x = getSexedClass(getClO(fromS).promotesTo[0], unit);
                    if($.inArray(x, clOpts) == -1) { //if not in array
                        clOpts.push(x);
                    }
                    if(getClO(fromS).promotesTo.length != 1) {//if not a fuzzywuzzy
                        x = getSexedClass(getClO(fromS).promotesTo[1], unit);
                        if($.inArray(x, clOpts) == -1) { //if not in array
                            clOpts.push(x);
                        }
                    }
                }
            }
        }
    }
    if(unit.sex == "F") { //if female
        for(var i = 0; i < otherClsF.length; i++) { //for every female bonus class
            clOpts.push(otherClsF[i].n);
        }
    }
    else { //if male
        for(var i = 0; i < otherClsM.length; i++) { //for every male bonus class
            clOpts.push(otherClsM[i].n)
        }
    }
    for(var i = 0; i < clOpts.length; i ++) { //for each class option
        var opt = document.createElement("option"); //make option
        $(opt).val(clOpts[i]).text(clOpts[i]); //add attr
        $("#" + v + "Class").append(opt); //append to class select
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
    for(var i = 0; i < allParents.length; i++) { //for each parent
        if(allParents[i].n == secPar) { //if parent object found
            return allParents[i]; //return parent object
        }
    }
    return noPar; //return noPar object
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
    var boGR = getBoonGRArr(getBoon());
    var baGR = getBaneGRArr(getBane());
    for(var i = 1; i < statArr.length; i++) { //for each stat
        var j = fMods[i] + sMods[i]; //sum of parents' mods
        if(!secPar.isChild) { //if second parent isn't a child
            j++; // add 1 for not being a pedo
        }
        updateMod(statArr[i], j, kid); //update kid's stat mod
    }
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j; //initialize j-- kid's grs
        if(secPar != noPar) { //if second parent is selected
            if(kid == kanaF || kid == kanaM) { //if kana
                j = (kGR[i] + sGR[i] + boGR[i] + baGR[i]) / 2 + cGR[i]; //sum of the average of kana's grs, second parent's grs, boon/bane grs, and the selected class' grs
            }
            else { //not kana
                j = (kGR[i] + sGR[i]) / 2 + cGR[i]; //sum of the average of kid's grs and second grs and the selected class' grs
            }
        }
        else { //if no second parent selected
            if(kid == kanaF || kid == kanaM) { //if kana
                j = kGR[i] + boGR[i] + baGR[i] + cGR[i]; //sum of kana's grs, boon/bane grs, and selected class' grs
            }
            else { //not kana
                j = kGR[i] + cGR[i]; //sum of kid's grs and selected class' grs
            }
        }
        updateGR(statArr[i], j, kid);
    }
}
/* accepts a kid object and updates the information displayed */
function updateView(kid) {
    var v = kid.vName
    if(kid.isRoyal) { //if royal
        $("#" + v + "RS").empty().text("Yes"); //yep
    }
    else { //if not
        $("#" + v + "RS").empty().text("No"); //peasant!
    }
    var modArr = getModArr(kid);
    var baseGRArr = getGRBaseArr(kid);
    var grArr = getGRArrU(kid);
    var maxClArr = getMaxStatArr(getCl(v));
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j; //initialize j-- mod, gr, or max stat value
        if($("#" + v + "Type").val() == "mods") {//if mods selected
            j = modArr[i]; //set to stat mod
        }
        else if($("#" + v + "Type").val() == "bases") {
            j = baseGRArr[i];
        }
        else if($("#" + v + "Type").val() == "grs") {//if grs selected
            j = grArr[i]; //set to gr
        }
        else { //if max stats selected
            if(i == 0) { //if i is 0
                j = maxClArr[i]; //set to max stat
            }
            else { //if not
                j = maxClArr[i] + modArr[i]; //set to max stat + mod
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
    }
    if(ct != noClass) { //if talent selected
        var fct = getSexedClass(ct, kanaF);
        var mct = getSexedClass(ct, kanaM);
        corrinF.baseClass.push(fct);
        corrinM.baseClass.push(mct);
        updateClass(corrinF);
        updateClass(corrinM);
        updateViewF(corrinF);
        updateViewF(corrinM);
    }
    var corrinsKids = [kanaF, kanaM]; //tracks corrin's kids, kanas added automatically
    $.each($(".sp"), function() { //for each second parent select
        for(var i = 0; i < allKiddies.length; i++) { //for each kid
            if($(this).attr("unit") == allKiddies[i].n) { //if kid matches
                corrinsKids.push(allKiddies[i]);
            }
        }
    });
    for(var i = 0; i < corrinsKids.length; i++) { //for each of corrin's kids
        if(i <= 1) { //if kanas
            updateClass(corrinsKids[i]);
        }
        updateInnerChild(corrinsKids[i]);
        updateView(corrinsKids[i]);
    }
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
        $(fgName).addClass("n").text(unit.n); //assign props
        var rs = document.createElement("td"); //make td to display royal status
        $(rs).attr("id", unitV + "RS").addClass("rs"); //assign props
        if(unit.isRoyal) { //if royal
            $(rs).text("Yes");
        }
        else { //if not
            $(rs).text("No");
        }
        var cl = document.createElement("td");  //make td for class select
        var clSelect = document.createElement("select"); //make class select for fg
        $(clSelect).attr("id", unitV + "Class").attr("data-unit", unit.n).addClass("clF"); //assign props
        $(cl).append(clSelect); //append to td
        var type = document.createElement("td"); //make td for display select
        var typeSelect = document.createElement("select"); //make display select
        $(typeSelect).attr("id", unitV + "Type").attr("data-unit", unit.n).addClass("typeF"); //assign props
        $(type).append(typeSelect); //append to td
        $(row).append(fgName).append(rs).append(cl).append(type); //append to row
        for(var j = 0; j < statArr.length; j++) { //for each stat
            var statCol = document.createElement("td"); //create td for stat display
            $(statCol).attr("id", unitV + statArr[j]).addClass("sv"); //add attrs
            $(row).append(statCol); //append to row
        }
        $("#firstGen").append(row); //append to table
    }
}
/* fills the class selects for the fg units */
function fillFGClasses() {
    for(var i = 0; i < allFG.length; i++) { //for each first gen unit
        var unit = allFG[i];
        var unitV = unit.vName;
        var bc = unit.baseClass;
        var bcl = bc.length;
        var clOpts = []; //keep track of available unpromoted classes
        var select = $("#" + unitV + "Class");
        for(var j = 0; j < bc.length; j++) { //for each base class
            var bcj = getClO(bc[j]);
            if(bcj != noClass) {//if not talentless avatar
                clOpts.push(bcj.n);
                    for(var k = 0; k < bcj.promotesTo.length; k++) { //for each promote
                        if($.inArray(getSexedClass(bcj.promotesTo[k].n, unit), clOpts) == -1) { //if not in array
                            clOpts.push(getSexedClass(bcj.promotesTo[k], unit));
                        }
                    }
            }
        }
        for(var j = 0; j < clOpts.length; j++) { //for each class option
            var opt = document.createElement("option"); //make option tag
            $(opt).attr("value", clOpts[j]).text(clOpts[j]); //assign props
            $(select).append(opt); //append to select
        }
    }
}
/* update displayed information of fg unit */
function updateViewF(unit) {
    var modArrU = getModArr(unit);
    var grArrU = getGRArrU(unit);
    var grArrC = getGRArrC(getCl(unit.vName));
    var maxStatArr = getMaxStatArr(getCl(unit.vName));
    for(var i = 0; i < statArr.length; i++) { //for each stat
        var j;
        if($("#" + unit.vName + "Type").val() == "mods") { //mods selected
            j = modArrU[i];
        }
        else if($("#" + unit.vName + "Type").val() == "bases") {
            j = grArrU[i];
        }
        else if($("#" + unit.vName + "Type").val() == "grs") { //if grs selected
            j = grArrU[i] + grArrC[i];
        }
        else { //if max stats selected
            if(i == 0) { //if hp
                j = maxStatArr[i];
            }
            else { //otherwise
                j = maxStatArr[i] + modArrU[i];
            }
        }
        $("#" + unit.vName + statArr[i]).empty().append(j); //update display
    }
}
