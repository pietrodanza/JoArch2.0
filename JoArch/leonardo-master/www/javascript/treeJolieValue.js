/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                                                    *
* Copyright (C) 2017 Vincenzo Mattarella <vinsmattarella@gmail.com>                  *
*                                                                                    *
* Permission is hereby granted, free of charge, to any person obtaining a copy of    *
* this software and associated documentation files (the "Software"), to deal in the  *
* Software without restriction, including without limitation the rights to use,      *
* copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the    *
* Software, and to permit persons to whom the Software is furnished to do so, subject*
* to the following conditions:                                                       *
*                                                                                    *
* The above copyright notice and this permission notice shall be included in all     *
* copies or substantial portions of the Software.                                    *
*                                                                                    *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,*
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A      *
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT *
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  *
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE     *
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                             *
*                                                                                    *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 *  Recursive function to draw a Jolie Object on html element
 *
 *  Parameters:
 *  obj - Javascript Object to parse
 *  level - Depth level of the element
 *  isRoot - Boolean value 
 *  isAnArrayElement - Boolean value
 *  divIdName - Name of the div in which draw the value
 */

function scan(obj, level, isRoot, isAnArrayElement, divIdName) {
    var k;
    if (obj instanceof Object) {
        level++;
        for (k in obj) {
            count++;
            var nameComposed = "idName_Nested_" + count;
            var buttonNumber = "idName_Button_" + count;
            if (obj.hasOwnProperty(k)) {
                if (Array.isArray(obj[k])) {
                    document.getElementById(divIdName).innerHTML += "<div class='expandable' id='" + nameComposed + "' style='padding-left:" + level + "em;'><div class='handled' style='display:inline-flex'><div class='buttone opened' id='" + buttonNumber + "' style='width:2em'><div class='opened' ></div></div><div>" + k + ":</div></div></div>";
                    scan(obj[k], level, true, true, nameComposed);
                } else if (typeof obj[k] === 'object') {
                    if (obj[k].$ != undefined) {
                        document.getElementById(divIdName).innerHTML += "<div  class='expandable' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div class='handled' style='display:inline-flex'><div class='buttone opened' id='" + buttonNumber + "' style='width:2em' ><div  class='opened' id='" + count + "' ></div></div><div>[" + k + "] : " + obj[k].$ + "</div></div></div>";
                        scan(obj[k], level, false, false, nameComposed);
                    } else {
                        document.getElementById(divIdName).innerHTML += "<div  class='expandable' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div class='handled' style='display:inline-flex'><div class='buttone opened' id='" + buttonNumber + "' style='width:2em' ><div  class='opened' id='" + count + "' ></div></div><div>[" + k + "] : void</div></div></div>";
                        scan(obj[k], level, true, false, nameComposed);
                    }
                } else {
                    if (isAnArrayElement == true) {
                        if (k != "$") {
                            document.getElementById(divIdName).innerHTML += "<div class='generic' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div style='display:inline-flex'><div style='width:2em;'></div><div>[" + k + "] : " + obj[k] + "</div></div></div>";
                            scan(obj[k], level, true, false, nameComposed);
                        } else {
                            if (isRoot) {
                                document.getElementById(divIdName).innerHTML += "<div class='generic' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div><div></div><div>[" + k + "] : " + obj[k] + "</div></div></div>";
                                scan(obj[k], level, true, false, nameComposed);
                            } else {
                                scan(obj[k], level, true, false, nameComposed);
                            }
                        }
                    } else {
                        if (k != "$") {
                            document.getElementById(divIdName).innerHTML += "<div  class='generic' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div><div></div><div>" + k + " : " + obj[k] + "</div></div></div>";
                            scan(obj[k], level, true, false, nameComposed);
                        } else {
                            if (isRoot) {
                                document.getElementById(divIdName).innerHTML += "<div class='generic' id='" + nameComposed + "'  style='padding-left:" + level + "em;'><div><div></div><div>" + k + " : " + obj[k] + "</div></div></div>";
                                scan(obj[k], level, true, false, nameComposed);
                            } else {
                                scan(obj[k], level, true, false, nameComposed);
                            }
                        }
                    }
                }
            }
            if (document.getElementById(nameComposed)) {
                var children = document.getElementById(nameComposed).children;
                if (document.getElementById(buttonNumber))
                    close(children, buttonNumber);
            }
        }
    }
};

$(document).on('click', "[id^='idName_Button_']", function() {

    var $this = $(this);
    var buttonIdName = $this.attr("id");
    var idNumber = buttonIdName.slice(-1);
    var idName = "idName_Nested_" + idNumber;
    var testo = document.getElementById(buttonIdName).className;
    if (testo === "opened") {
        var Children = document.getElementById(idName).children;
        close(Children, buttonIdName);
    } else {
        var Children = document.getElementById(idName).children;
        for (i = 0; i <= Children.length - 1; i++) {
            Children[i].style.display = "";
            if (Children[i].className == "handled") {
                Children[i].style.display = "inline-flex";
            }
        }
        changeSign(buttonIdName, "opened");
    }
});

function close(Children, buttonIdName) {
    for (i = 0; i <= Children.length - 1; i++) {
        if (Children[i].className != "handled") {
            Children[i].style.display = "none";
        }
    }
    changeSign(buttonIdName, "closed");
}

function changeSign(idName, classState) {
    document.getElementById(idName).className = classState;
}