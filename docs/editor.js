function load() {
    //console.log("hi")
    //window.addEventListener('resize', ()=>{//console.log("resize")});
    selectE = { type: "blank" }
    setHH = true
    meeb = false
    hsvgCall = false;
    hsvgBusyOut = ""
    hamCall = false;
    COLDelements = []
    selecting = false
    pause = false
    dotpoints = new Array();
    mode = "draw"
    OptionsV = false;
    routingmode = false;
    k = [];
    lineS = "";
    lineT = 7;
    lineP = new Array();
    magicNum = 1;
    wigglenum = 1;
    red = 0;
    green = 0;
    blue = 0;
    AB = true;

    //console.log("svgload")
    Pan = new Hammer.Pan({ event: "pan", direction: Hammer.DIRECTION_ALL });
    Panend = new Hammer.Pan({ event: "panend", direction: Hammer.DIRECTION_ALL });
    Panstart = new Hammer.Pan({ event: "panstart", direction: Hammer.DIRECTION_ALL });
    Tap = new Hammer.Tap({ event: 'tap', taps: 1 });
    hamcount = 0;
    drawbutton = document.getElementById("draw");
    activebutton = drawbutton
    CARDsvg = document.getElementById("CARDsvg")
    CARDrect = CARDsvg.getBoundingClientRect()
    canvasW = window.screen.width * .8
    CARDsvg.setAttribute("style", "background: #171717;cursor: pointer;")
    HOTsvg = document.getElementById("HOTTsvg")
    COLDsvg = document.getElementById("COLDsvg")
    //IMGsvg=document.getElementById("IMGsvg")
    //BACKsvg=document.getElementById("BACKsvg")
    DIVsvg = document.getElementById("DIVsvg")
    selectElement = document.getElementById("selector")
    setCanvas(false)
    ham(DIVsvg)
    getHSVG()
}

function setCanvas(E) {
    if (E) {
        var maybeW = Number(document.getElementById("width").value)

        canvasH = Number(document.getElementById("height").value)
        //console.log(maybeW)
        if (maybeW > 350) {
            canvasW = maybeW
        }
        else {
            canvasW = 350
        }

    }
    else {
        canvasH = window.innerHeight - 100;
        canvasW = window.innerWidth - 225;

    }

    //BACKsvg.innerHTML=`<rect width="${  canvasW}" height="${  canvasH}" style="fill:white;stroke:none" />`
    Array(HOTsvg, COLDsvg, DIVsvg).forEach(svg => {
        svg.setAttribute("width", canvasW.toString())
        svg.setAttribute("height", canvasH.toString())
    })
    document.getElementById("width").setAttribute("value", canvasW.toString())
    document.getElementById("height").setAttribute("value", canvasH.toString())
    //ham(DIVsvg)
    getHSVG()
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
sum = function (V) { return V.reduce((previous, current) => current += previous); }
av = function (V) { return sum(V) / V.length }


function stringify([T1, T2]) {
    return T1 + "," + T2
}

function pyth([x1, y1], [x2, y2]) {
    return Math.sqrt((delta(x1, x2)) ** 2 + (delta(y1, y2)) ** 2) | 1
}

function delta(a, b) {
    return parseInt(a) - parseInt(b)
}






//line drawing functions

sqrt2 = x => Math.sqrt(Math.abs(x)) * Math.sign(x)
x = E => ((E.pointers[0].clientX - (document.getElementById("DIVsvg").getBoundingClientRect().left)))
y = E => ((E.pointers[0].clientY - (document.getElementById("DIVsvg").getBoundingClientRect().top)))

function getRelativePoints(points) {
    var outpoints = [];
    for (var x = 1; x < points.length; x++) {
        if ((parseFloat(points[x][0]) != parseFloat(points[x - 1][0])) || (parseFloat(points[x][1]) != parseFloat(points[x - 1][1]))) {

            outpoints.push([(parseFloat(points[x][0]) - parseFloat(points[x - 1][0])).toString(), (parseFloat(points[x][1]) - parseFloat(points[x - 1][1])).toString()])

        }
    }
    return outpoints
}

function setThicc() {
    var E = document.getElementById("thickness")
    if (E) {
        val = Number(E.value)
        if (val && val != 0) {
            lineT = val ** 2
        }
    }
}
function setRed() {
    var E = document.getElementById("red")
    if (E) { red = Number(E.value) }
}
function setGreen() {
    var E = document.getElementById("green")
    if (E) { green = Number(E.value) }
}
function setBlue() {
    var E = document.getElementById("blue")
    if (E) { blue = Number(E.value) }
}


function setMagic() {
    var E = document.getElementById("magicitemnumber")
    if (E) { magicNum = Number(E.value) }
}
function setWiggles() {
    var E = document.getElementById("wiggle")
    if (E) { wigglenum = Number(E.value) }
}


function cleanLinePoints(P) {
    //console.log("cleaning")
    var lineNotS;
    //lineNotS = `M ${P[0][0]} , ${P[0][1]} `
    lineNotS = ""
    getRelativePoints(P).forEach(([x, y]) => {
        lineNotS += ` l ${x},${y} `
    })

    return lineNotS
}

async function drawTap(E) {
    //  dotpoint(E)
    setThicc()
    setRed()
    setGreen()
    setBlue()
    //console.log("Tap")
    var toem = {
        string: `<circle  cx="${x(E)}" cy="${y(E)}" 
    style="fill:black;stroke:rgb(${  red},${green},${blue});stroke-width:${(lineT - 1).toString()}" r=".5">`,
        points: [x(E), y(E)],
        type: "dot",
        prefix: "",
        suffix: ""

    }
    if (COLDelements.length != 0) {
        if (COLDelements[COLDelements.length - 1].string != toem.string) {
            //console.log("circle time!")

            if (selectE.type == "bacterium") {
                //console.log("attached!")
                toem.string = `<circle transform="rotate(${selectE.attachment.angle} ${0} ${0})" cx="${x(E) - selectE.attachment.point.x}" cy="${y(E) - selectE.attachment.point.y}" style="fill:black;stroke:rgb(${red},${green},${blue});stroke-width:${(lineT - 1).toString()}" r=".5">`
                toem.suffix += selectE.attachment.string
                toem.location = [x(E) - selectE.attachment.point.x, y(E) - selectE.attachment.point.y]
            }

            toem.suffix += "</circle>"
            
            sendToCold(toem)
        }
    }

    getCSVG("drawtap")
    getHSVG()
    //  yog()
}

function drawPan(E) {
    ne = [Math.round(x(E)), Math.round(y(E))]
    try {
        nel = lineP[lineP.length - 1]
        //nel[0] != ne[0]  || nel[1] != ne[1]
        dist = pyth(ne, nel)

        if (dist > 3) {
            var nely = averagepoint(nel, ne)
            lineS += ` ${nel} ${nely} `
            lineP.push(ne)

        }
    }
    catch{
        lineS = `M ${ne} Q `
        lineP.push(ne)
    }


    getHSVG()
}
function noodlePan(E) {
    var ne = [x(E), y(E)]
    if(lineP.length>2){
        var nel = lineP[lineP.length - 1]
        dist = pyth(ne, nel)
        if (dist > 3) {
            lineP.push(ne)
        }
    }
    else{
        lineP.push(ne)
    }
    getHSVG()
}
function wigglePan(E) {
    var ne = [x(E), y(E)]
    try {
        var nel = lineP[lineP.length - 1]
        dist = pyth(ne, nel)
        if (dist > 3) {
            lineP.push(ne)
        }
    }
    catch{
        lineP.push(ne)
    }
    getHSVG()
}


function hammerMove(E) {
}

hep = ""



function sendToCold(toCold) {
    if (COLDelements.length == 0) {
        COLDelements.push(toCold)
    }
    else {
        if (toCold.string != COLDelements[COLDelements.length - 1].string) {
            COLDelements.push(toCold)
        }
    }
}





function drawPanEnd(E) {

    //console.log("smooth line")
    var toCold = { string: "", points: lineP, type: "line", prefix: "", suffix: "" };
    if (lineP.length > 1) {
        setRed()
        setGreen()
        setBlue()
        toCold.location = MagicOffset(toCold)
        var smoothboi = smoothline(lineP)
        toCold.string += `<path stroke-linecap="round" style="fill:none;stroke:rgb(${red},${green},${blue});stroke-width:${lineT}" d="${smoothboi}"></path>`
        sendToCold(toCold)

    }
    lineP = []
    lineS = ""
    getCSVG("drawpanend")
    getHSVG(true)
}

function FleePanEnd(E) {
    if (lineP.length > 1) {
    //console.log("buzzzz")
    var toCold = { string: "", points: lineP, type: "flee", prefix: "", suffix: "" };
    
        setRed()
        setGreen()
        setBlue()
        //console.log(MagicOffset(toCold))
        toCold.location = MagicOffset(toCold)
        var endlist = []
        var length = 2
        for (i = 1; i < lineP.length / length; i++) {
            var work = lineP.slice(i * length - length, i * length)
            var toout = smoothline(work)
            endlist.push(toout)
        }
        toCold.string += `<path fill="none" d="${endlist[0]}" stroke-linecap="round"  stroke-width="${lineT}" style="stroke:rgb(${red},${green},${blue})" stroke="black">`
        toCold.suffix += `<animate attributeName="d" values="${endlist.join(";")}" dur="800ms" repeatCount="indefinite" /></path>`
        sendToCold(toCold)
    //console.log(lineP)
    lineP = []
    lineS = ""
    getCSVG("fleepanend")
    getHSVG(true)
    }
    lineP = []
    lineS = ""
}



function calcAngleDegrees([x1, x2], [y1, y2]) {
    return Math.atan2(y1 - y2, x2 - x1) * 180 / Math.PI;
}

function bacteriumPanEnd(E) {

    lineP.push([x(E), y(E)])

    //console.log("bacteria!")
    var toElements = { string: "", points: lineP, type: "bacterium", prefix: "", suffix: "", attachment: {} };
    if (lineP.length > 10) {
        setRed()
        setGreen()
        setBlue()
        toElements.location = MagicOffset(toElements)
        var smoothboi = smoothline(lineP)
        var svgtemp = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgtemp.setAttribute("d", smoothboi)
        var lengthofpath = svgtemp.getTotalLength()
        var svgtemp2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgtemp2.setAttribute("d", smoothboi)
        var lengthofpath2 = svgtemp2.getTotalLength()
        var lengthind = 1
        if (svgtemp2.getTotalLength() > 200) {


            while (lengthofpath < lengthofpath2 + 100) {
                lengthind += 1
                svgtemp2.setAttribute("d", smoothline(lineP.slice(lengthind, lineP.length - 1)))
                lengthofpath2 = svgtemp2.getTotalLength()

            }


            var p1 = svgtemp.getPointAtLength(lengthofpath - lengthofpath2 - 1)
            var p2 = svgtemp.getPointAtLength(lengthofpath - lengthofpath2 + 1)


            toElements.attachment.point = svgtemp.getPointAtLength(lengthofpath - lengthofpath2)
            toElements.attachment.angle = calcAngleDegrees([p1.x, p2.x], [p1.y, p2.y])
            toElements.attachment.string += `<animateMotion dur="2s" repeatCount="indefinite"
        path="${smoothline(lineP.slice(lengthind, lineP.length - 1))}" rotate="auto" />`



            toElements.string += `<path stroke-dasharray="${lengthofpath - lengthofpath2} 10000" stroke-linecap="round" style="fill:none;stroke:rgb(${red},${green},${blue});stroke-width:${lineT}" d="${smoothboi}">`
            toElements.suffix += `<animate attributeName="stroke-dashoffset" values="0;${-(lengthofpath - (lengthofpath - lengthofpath2))}" dur="2s" repeatCount="indefinite"  /></path>`


            sendToCold(toElements)
        }
    }
    lineP = []
    lineS = ""
    getCSVG("bacteriapanend")
    getHSVG(true)
    
}








function Averagemaker() {

}
function MagicOffset(E) {
    var x, y
    if (E.type == "line" || E.type == "flee" || E.type == "bacterium") {
        [x, y] = aveofpoints(E.points);
    }
    if (E.type == "dot") {
        [x, y] = E.points
    }
    if (E.type == "boob") {
        [x, y] = [(E.points[0][0][0] + E.points[0][1][0]) / 2, (E.points[0][0][1] + E.points[0][1][1]) / 2]
    }

    return [x, y]

}

async function magicPanEnd(E) {
    //console.log("magicPanEnd")
    if(lineP.length<10){
        lineP = []
        lineS = ""
        getCSVG("magicpanend")
        getHSVG(true)
        return 0
    }

    try{
        if (COLDelements.length != 0) {
            setMagic()
            if (magicNum == 1 || COLDelements.length == 3) {
                MagicPanStringEngine(E)
            }
            else {
                MagicMultiEngine(E)
            }

        }
    }
    catch{
        //console.log("ouch")
    }
    lineP = []
    lineS = ""
    getCSVG("magicpanend")
    getHSVG(true)
    //ham(DIVsvg)
}
function MagicPanStringEngine(E, xl, yl, w) {
    if (w != null) {
        var which = w
    }
    else {
        which = COLDelements.length - 1
    }
    var work = COLDelements[which]


    if (xl != null && yl != null) {
        var [x, y] = [xl, yl]
    }
    else {
        var [x, y] = MagicOffset(work)
    }


    var prefix = `<g transform='translate(-${x},-${y})'> ${work.prefix}`
    var suffix = `${work.suffix} <animateMotion dur="6s"  repeatCount="indefinite" path="${smoothline(lineP)} z" ></animateMotion> </g>`
    COLDelements[which].prefix = prefix
    COLDelements[which].suffix = suffix
    return prefix + work.string + suffix
}
function MagicMultiEngine(Es) {
    setMagic()
    var num = magicNum
    //console.log(num)
    var sums = [0, 0]
    Array.from(Array(num).keys()).forEach((E) => {
        sums[0] = MagicOffset(COLDelements[COLDelements.length - E - 1])[0] + sums[0]
        sums[1] = MagicOffset(COLDelements[COLDelements.length - E - 1])[1] + sums[1]
    })
    sums[0] = sums[0] / num
    sums[1] = sums[1] / num
    Array.from(Array(num).keys()).forEach((E) => {
        MagicPanStringEngine(Es, sums[0], sums[1], COLDelements.length - E - 1)
    })
}




comp = (a, b) => a < b




function wiggleTap(E) {
    var ne = [x(E), y(E)]
    try {
        var nel = dotpoints[dotpoints.length - 1]
        if (nel[0] != ne[0] || nel[1] != ne[1]) {
            dotpoints.push(ne)
        }
    }
    catch{
        dotpoints.push(ne)
    }
    getHSVG()

}
function noodleTap(E) {
    var ne = [x(E), y(E)]
    try {
        var nel = dotpoints[dotpoints.length - 1]
        if (nel[0] != ne[0] || nel[1] != ne[1]) {
            dotpoints.push(ne)
        }
    }
    catch{
        dotpoints.push(ne)
    }
    getHSVG()

}

function wigglePanEnd(E) {
    if(lineP.length>4){
    if (dotpoints.length < 2) {
        dotpoints.push([0, 0])
        if (dotpoints.length < 2) {
            dotpoints.push([0, 0])
        }

    }
    var fpoints = dotpoints.slice(-2)
    var animV = lineP.map(E => { return `M ${fpoints[0]} Q ${E} ${fpoints[1]}` }).join(";")
    var output = `
    <path d="M ${fpoints[0]} Q ${lineP[0]} ${fpoints[1]}" stroke-linecap="round" style="fill:none;stroke:rgb(${red},${green},${blue});stroke-width:${lineT}">`
    var suffix = `<animate attributeName="d" values="${animV}" dur="6s" repeatCount="indefinite" /></path>`
    var toElements = { string: output, points: [fpoints, lineP], type: "boob", prefix: "", suffix: suffix }
    toElements.location = MagicOffset(toElements)
    
        sendToCold(toElements)
    }
    
    lineP = []
    lineS = ""
    dotpoints = []
    getCSVG("wigglepanend")
    getHSVG(true)
    //ham(DIVsvg)

}



function noodlePanEnd(E) {
    if(lineP.length>4){
    if (dotpoints.length < 2) {
        dotpoints.push([0, 0])
        if (dotpoints.length < 2) {
            dotpoints.push([0, 0])
        }

    }
    var fpoints = dotpoints.slice(-2)
    var anim = lineP.map(E => { return `M ${fpoints[0]} Q ${fpoints[1]} ${E} ` })
    var animV = anim.join(";")
    var svgtemp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var min = Math.min(...anim.map( (E) => {svgtemp.setAttribute("d", E)
    return svgtemp.getTotalLength()||100000}))
    
    
    var output = `
    <path stroke-dasharray="${min} 10000" stroke-linecap="round" d="M ${fpoints[0]} Q ${fpoints[1]} ${lineP[0]}"  style="fill:none;stroke:rgb(${red},${green},${blue});stroke-width:${lineT}">`
    var suffix = `<animate attributeName="d" values="${animV}" dur="2s" repeatCount="indefinite" /></path>`
    var toElements = { string: output, points: [fpoints, lineP], type: "boob", prefix: "", suffix: suffix }
    toElements.location = MagicOffset(toElements)
    
        sendToCold(toElements)
    }
    
    lineP = []
    lineS = ""
    dotpoints = []
    getCSVG("noodlepanend")
    getHSVG(true)
    //ham(DIVsvg)

}


async function ham(Ele) {

    //console.log("ham")
    try{
        Hammer.off('tap',Ele)
    Hammer.off('pan',Ele)
    Hammer.off('panend',Ele)
    }
    catch{
        //console.log("sup")
    }
    
    hammer = new Hammer.Manager(Ele, {});
    Ele.setAttribute("style", "background: #fff")
    hammer.add([Tap, Pan, Panend, Panstart])
    if (mode == "draw") {
        hammer.on(`Panstart`, E => {
            setThicc()
            setRed()
            setGreen()
            setBlue()
        })
        hammer.on('tap', async E => drawTap(E))
        hammer.on('pan', async E => { drawPan(E) })
        hammer.on('panend', async E => drawPanEnd(E))
    }
    if (mode == "magic") {
        hammer.on('tap', async E => drawTap(E))
        hammer.on('pan', async E => { drawPan(E) })
        hammer.on('panend', async E => magicPanEnd(E))
    }
    if (mode == "wiggly") {
        hammer.on('tap', async E => wiggleTap(E))
        hammer.on('pan', async E => { wigglePan(E) })
        hammer.on('panend', async E => wigglePanEnd(E))
    }
    if (mode == "bacteria") {
        hammer.on('tap', async E => drawTap(E))
        hammer.on('pan', async E => { drawPan(E) })
        hammer.on('panend', async E => bacteriumPanEnd(E))
    }
    if (mode == "flee") {
        hammer.on('tap', async E => drawTap(E))
        hammer.on('pan', async E => { drawPan(E) })
        hammer.on('panend', async E => FleePanEnd(E))
    }
    if (mode == "noodle") {
        hammer.on('tap', async E => noodleTap(E))
        hammer.on('pan', async E => { noodlePan(E) })
        hammer.on('panend', async E => noodlePanEnd(E))
    }


}

async function yog(override) {
    if ((platform.is("cordova") && !hamCall) || override) {
        hamCall = true
        //ham(DIVsvg)
        await delay(0)
        hamCall = false
    }
}


function aveofpoints(points) {
    var totalx = 0
    var totaly = 0
    points.forEach(([x, y]) => {
        totalx += parseFloat(x)
        totaly += parseFloat(y)
    });
    var x = totalx / points.length
    var y = totaly / points.length
    return [x, y]
}

async function resethsvgCall() {
    await delay(0)
    hsvgCall = false
}

function averagepoint([x1, y1], [x2, y2]) {


    return [((((x2 | 0) - (x1 | 0)) / 2) + (x1 | 0)), (((((y2) | 0) - (y1) | 0)) / 2) + ((y1) | 0)]
}

function smoothline(g, m) {
    var out = ""
    var outlist = []

    try {
        for (var k = 0; k < g.length - 1; k++) {
            if (g[k][0] != g[k + 1][0] || g[k][1] != g[k + 1][1]) {
                outlist.push(g[k])
                outlist.push(averagepoint(g[k], g[k + 1]))
            }
        }


        if (!m) { out = `M ${g[0][0]},${g[0][1]} ` }

        return `${out} Q ${outlist} `

    }
    catch{

        return out
    }


}


function getHSVG(override) {
    override = override || false
    var out = ""
    setThicc()
    setRed()
    setGreen()
    setBlue()
    if (lineP.length > 1) {
        if (mode == "draw" || mode == "bacteria" || mode == "flee") {
            out += `<path stroke-linecap="round" style="fill:none;stroke:rgb( ${red} , ${green} , ${blue});stroke-width:${lineT}" d="${lineS}"  />`

        }
        if (mode == "magic") {
            out += `<path stroke-linecap="round" style="fill:none;stroke:fuchsia;stroke-width:5" d="${smoothline(lineP)}"  />`
            out += `<path stroke-linecap="round" style="fill:none;stroke:aqua;stroke-width:2" d="${smoothline(lineP)}"  />`


        }
        if (mode == "noodle") {
            out += `<path stroke-linecap="round" style="fill:none;stroke:orange;stroke-width:2" d="${smoothline(lineP)}"  />`
            out += `<path stroke-linecap="round" style="fill:none;stroke:yellow;stroke-width:5" d="M  ${dotpoints[dotpoints.length - 2]} Q  ${dotpoints[dotpoints.length - 1]} ${lineP[lineP.length - 1]}"  />`
        }
        if(mode == "wiggly"){
            out += `<path stroke-linecap="round" style="fill:none;stroke:orange;stroke-width:2" d="${smoothline(lineP)}"  />`
            out += `<path stroke-linecap="round" style="fill:none;stroke:yellow;stroke-width:5" d="M ${dotpoints[dotpoints.length - 1]} Q ${lineP[lineP.length - 1]} ${dotpoints[dotpoints.length - 2]} "  />`
        }
    }
    if (mode == "wiggly"||mode == "noodle") {

        if (dotpoints.length > 0) {
            out += `<circle cx="${dotpoints[dotpoints.length - 1][0]}" cy="${dotpoints[dotpoints.length - 1][1]}" style="fill:yellow;" r="4" />`
            out += `<circle cx="${dotpoints[dotpoints.length - 1][0]}" cy="${dotpoints[dotpoints.length - 1][1]}" style="fill:orange;" r="2" />`
            if (dotpoints.length > 1) {
                out += `<circle cx="${dotpoints[dotpoints.length - 2][0]}" cy="${dotpoints[dotpoints.length - 2][1]}" style="fill:yellow;" r="4" />`
                out += `<circle cx="${dotpoints[dotpoints.length - 2][0]}" cy="${dotpoints[dotpoints.length - 2][1]}" style="fill:orange;" r="2" />`
            }
        }
    }

    //HOTsvg.innerHTML = out
    setH(out, override)//
    //  hsvgBusyOut = out
    return out


}






async function setH(H, override) {//
    if (setHH || override) {
        setHH = false
        HOTsvg.innerHTML = H
        await delay(10)
        setHH = true
    }
}

function counter(str, search) {
    return str.split('').map(function (e, i) { if (e === search) return i; })
        .filter(Boolean).length

}

function returns() {
    slides.lockSwipes(false)
    slides.slideTo(0)
}


async function getCSVG(yep) {
    //console.log(yep)
    //console.log("getCSVG")
    var out

    if (pause) {
        COLDelements.forEach(element => {

            if (element.type == "boob" || element.type == "flee" || element.type == "bacterium") {
                out += element.string + "</path>"
            }
            else {
                if (element.type == "dot") {
                    out += `<g transform="translate(${element.loaction})"> ${element.string}</circle></g>`
                }
                else {
                    out += element.string
                }
            }

            //element.prefix+element.string+"</g>".repeat(counter(element.suffix,"</g>"))
        });

    }
    else {
        COLDelements.forEach(element => {
            out += element.prefix + element.string + element.suffix
        });
    }



    if (selecting && COLDelements.length > 2) {
        try {
            var inside = selectE.prefix + selectE.string + selectE.suffix
            out += `<g transform="scale(1.02 .98)" opacity=".5">${inside}</g>`
        }
        catch{
            try {
                selectE = COLDelements[2]
                selected = 2
            }
            catch{
                selected = 2
            }
        }



    }
    COLDsvg.innerHTML = out
    //  yog()


    return out



}

function makeIMG(EN) {
    var E = Object.create(EN)
    if (override) { Object.assign(E, override) }
    return `<image x="${E.x}" y="${E.y}" width="${E.w}" height="${E.h}" xlink:href="${E.string}" />`
}
async function getISVG() {
    //console.log("getISVG")

    //`<image x="0" y="0" xlink:href="`+base64Image+`" width="200" height="300" />`
    var out = "";
    IMGelements.forEach(E => {
        out += makeIMG(E)
    })
    //IMGsvg.innerHTML = out
    //  yog()
    return out
}



IMGelements = [];
function image() {

    camera.getPicture(Coptions).then((imageData) => {
        let base64Image = `data:image/jpeg;base64,${imageData}`
        IMGelements.push({ x: 20, y: 20, w: 100, h: 100, string: base64Image })
        getISVG()
    },
        (err) => {
            //console.log("fuck")
        })
}
arrayify = E => Array(10)












function changeSlected() {
    selectElement.setAttribute("max", COLDelements.length - 2)
    selected = Number(selectElement.value) + 1
    selectE = COLDelements[selected]
    //getCSVG("change selected")
}





function men() {
    slides.lockSwipes(false)
    if (meeb) {
        slides.slideTo(1)
        meeb = false
    }

    else {
        slides.slideTo(2)
        meeb = true
    }
    slides.lockSwipes(true)
}

function cleanString(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
        else {
            //console.log(input.charAt(i))
        }
    }
    return output;
}
function addAnimations() {

}





function reset() {
    selectE = { type: "blank" }
    dotpoints = []
    hep = ""
    IMGelements = [];
    COLDelements = [];
    lineS = ""
    lineP = []
    getISVG()
    getCSVG("reset")
    getHSVG()
}

function back() {
    if (COLDelements.length != 0) {
        COLDelements = COLDelements.slice(0, -1)
    }

    //if (selected <= COLDelements.length + 2) {
    //    selectE = { type: "blank" }
    //}
    getCSVG("back")
    getHSVG()
}

async function print(a) {
    var i = await getISVG()
    var c = await getCSVG()
    var h = await getHSVG()
    var into = DIVsvg.innerHTML
    var out = ` width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">${BACKsvg.innerHTML}${i}${c}${h}</svg>`
    var clip = `data:image/svg+xml;utf8,<svg`
    var lolfile = `<?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg"`


    a.setAttribute("download", document.getElementById("filename").value)
    a.href = clip + out

    unhref(a)
    //clipboard.copy(clip+out) 
    ////console.log(out)
    //  transfer.create().download(clip+out,`/myz`).catch(err=>//console.log(err))

    return out
}
async function unhref(a) {
    await delay(10)
    a.removeAttribute("href");

}

function buttonControl(E, newmode) {
    if (mode != newmode) {
        mode = newmode
        activebutton.classList.remove("btn-active")
        E.classList.add("btn-active")
        activebutton = E
    }
    else {
        E.classList.remove("btn-active")
        drawbutton.classList.add("btn-active")
        activebutton = drawbutton
        mode = "draw"
    }
    ham(DIVsvg)
}


function draw(E) {
    mode = "draw"
    //console.log(mode)
    activebutton.classList.remove("btn-active")
    E.classList.add("btn-active")
    activebutton = E
    ham(DIVsvg)
}




function pauser(E) {
    pause = !pause
    if (pause) {
        E.classList.remove("btn-danger")
        E.classList.add("btn-success")
        E.textContent = "PLAY"
    }
    else {
        E.classList.remove("btn-success")
        E.classList.add("btn-danger")
        E.textContent = "PAUSE"
    }
    getCSVG("pauser")
}
function showSelected() {
    if (COLDelements.length != 0) {
        selecting = !selecting
        getCSVG("showselected")
    }

}
