
function doSubmit(ip_name){
    //change hidden input so we can update target, set shown input back to null
    document.getElementById(ip_name + "_h").value = document.getElementById(ip_name).value;
    document.getElementById(ip_name).placeholder = document.getElementById(ip_name).value;
    document.getElementById(ip_name).value = null;
    return false;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
var testtter = 0;

function get_ip(){
    //Get current temperature readings from the AP
    try {
       
        //vdocument.getElementById('navtest').innerHTML = "HELLo"
        
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://127.0.0.1:3011/output", false);
        xhttp.setRequestHeader("Content-type", "text/html");
        //document.getElementById('navtest').innerHTML = "HELLo"
        xhttp.send();
    
        var response = JSON.parse(xhttp.response);
        //document.getElementById('navtest').innerHTML = String(response.a_value);
        return String(response.a_value)
        alert(xhttp.response);
    } catch (error) {
        alert(error.message);
    }
}

function getData(current = 298, target = -1) {
    //USED FOR TESTING BEFORE DATA WAS COMING IN FROM SERVER
    //randomly increment the current value, if target is selected move towards it, if target isn't selected target ==-1

    var increment = 0;
    if(target != -1){
        //we have been given a target value, randomly move towards it
        increment = getRndInteger(0,3)
        if(current>target){
            //we need to move down
            return current - increment
        }
        else if(current <target){
            //we need to move up
            return current + increment;
        }
        else{
            return current;
        }
    }
    else{
        //We have not been given a target, randomly increment
        increment = getRndInteger(-3,3)
        return current + increment 

    }
    
}  

//Start plotting the chart
var graphDiv = document.getElementById('chart')
var time = new Date();
var launch_time = time ;
var data1 = {
    x: [time],
    y:[getData()],
    type:'line',
    name: 'A-298'
}
var data2 = {
    x: [time],
    y:[getData()],
    type:'line',
    name: 'B-298'
}
var data3 = {
    x: [time],
    y:[getData()],
    type:'line',
    name: 'C-298'
}
var data4 = {
    x: [time],
    y:[getData()],
    type:'line',
    name: 'D-298'
}
var layout = {
    // title: 'ARPES Cryostat Temperature',
    // titlefont:{
    //     size:22
    // },
    autosize: true,
    height: 950,
    xaxis: {
      title: 'Time',
    //   showgrid: false,
    //   zeroline: false
    titlefont: {
        size: 20
    }
    },
    yaxis: {
      title: 'Temperature (K)',
      //showline: false
      titlefont: {
        size: 20
    }
    },
    showlegend: true,
    legend:{
        "orientation": "h",
        x: 0.38,
        font: {
            size: 20
        }
    }
  };
var data = [data1,data2,data3,data4];
Plotly.newPlot(graphDiv,data,layout)


var cnt = 0;
var current = 298;
var current2 = 298;
var current3 = 298;
var current4 = 298;
max = 600;

var interval = setInterval(function(){
    //CAN ONLY QUERY CONTROLLER ONCE EVERY 50ms, luckily we can get every value in one query so split the string and update readings.
    //Refresh every 100 ms

    var exp = ''
    readings = String(get_ip()).split(",")
    a_reading = parseFloat(readings[0])
    b_reading = parseFloat(readings[1])
    c_reading = parseFloat(readings[2])
    d_reading = parseFloat(readings[3])
    

    //Get Data and update the boi
    current =a_reading
    current2=b_reading
    current3=c_reading
    current4=d_reading
    
    // current =  getData(current,ulv_form.ulv_hname.value) ;
    // current2 = getData(current2);
    // current3 = getData(current3);
    // current4 = getData(current4, braid_form.braid_hname.value);

    var update = {
        name: ['A:  ' + current.toString()+ 'K', 
        'B:  ' + current2.toString()+ 'K',
        'C:  ' + current3.toString()+ 'K',
        'D:  ' + d_reading.toString()+ 'K']
    }
    Plotly.restyle(graphDiv,update,[0,1,2,3]);

    // var update = {
    //    // x:[[time],[time],[time],[time]],
    //     y: [[current],[current2],[current3],[current4]]
    // }
    var time = new Date();
    var minute_forward = moment(time).add(1, 'm').toDate();
    var minute_back = moment(time).subtract(1, 'm').toDate();
    Plotly.relayout(graphDiv,
		{
			'xaxis.range': [minute_back, minute_forward]
		})

    Plotly.extendTraces(graphDiv, {x:[[time],[time],[time],[time]], y: [[current],[current2],[current3],[current4]]}, [0,1,2,3]);

    cnt= cnt+1;
    if(cnt > max) {
        //Only allow datapoints to have max (600) points each to maintain performance.
        data[0].y.shift();
        data[1].y.shift();
        data[2].y.shift();
        data[3].y.shift();
        data[0].x.shift();
        data[1].x.shift();
        data[2].x.shift();
        data[3].x.shift();
    }

    
   
},100);

// Other attempts at fast-reloading 
//var big_time = new Date();
// function update() {

//     //GET UPDATES
//     var exp = ''
//     exp = String(get_ip())
//     var time = new Date();
//     big_time = time;

//     //Get Data and update the boi
//     current = getData(current,ulv_form.ulv_hname.value) ;
//     current2 = getData(current2);
//     current3 = getData(current3);
//     current4 = getData(current4, braid_form.braid_hname.value);

//     // data[0].y[cnt] = current;
//     // data[0].x[cnt] = time;
//     // data[1].y[cnt] = current;
//     // data[1].x[cnt] = time;
//     // data[2].y[cnt] = current;
//     // data[2].x[cnt] = time;
//     // data[3].y[cnt] = current;
//     // data[3].x[cnt] = time;

//     // cnt= cnt+1;
//     // if(cnt > max) {
//     //     //Only allow datapoints to have max (600) points each to maintain performance.
//     //     cnt = max+1;
//     //     data[0].y.shift();
//     //     data[1].y.shift();
//     //     data[2].y.shift();
//     //     data[3].y.shift();
//     //     data[0].x.shift();
//     //     data[1].x.shift();
//     //     data[2].x.shift();
//     //     data[3].x.shift();
//     // }



//     //Legend update
//     // var update = {
//     //     name: [String(data[0].x.length), 
//     //     'B:  ' + current2.toString()+ 'K',
//     //     'C:  ' + current3.toString()+ 'K',
//     //     'D:  ' + current4.toString()+ 'K']
//     // }

    
//     var minute_forward = moment(time).add(1, 'm').toDate();
//     var minute_back = moment(time).subtract(1, 'm').toDate();
//     Plotly.relayout(graphDiv,
// 		{
// 			'xaxis.range': [minute_back, minute_forward]
// 		})

//     //
//     Plotly.animate(graphDiv, {
//         data: [{x:[[big_time],[big_time],[big_time],[big_time]], y: [[current],[current2],[current3],[current4]]}]}
//       , {
//         transition: {
//           duration: 10
//         },
//         frame: {
//           duration: 1000,
//           redraw: false
//         }
//       });
    
//       requestAnimationFrame(update);
//     }
    
//     requestAnimationFrame(update);




// $.getJSON('http:localhost:3011/output',function(data){

// });



// var interval = setInterval(function(){
//     //refresh the chart given user inputs. Constant on the last line is how many refreshes/second.
//     // $.getJSON('http://localhost:3011/output', function(data) {
//     // // JSON result in `data` variable
//     // });
//     var exp = ''
//     exp = String(get_ip())
//     current = getData(current,ulv_form.ulv_hname.value) ;
//     current2 = getData(current2);
//     current3 = getData(current3);
//     current4 = getData(current4, braid_form.braid_hname.value);

//     var time = new Date();
//     var update = {
//         name: [exp, 
//         'B:  ' + current2.toString()+ 'K',
//         'C:  ' + current3.toString()+ 'K',
//         'D:  ' + current4.toString()+ 'K']
//     }
//     Plotly.restyle(graphDiv,update,[0,1,2,3]);

//     var update = {
//         x:[[time],[time],[time],[time]],
//         y: [[current],[current2],[current3],[current4]]
//     }
    

//     var olderTime = time.setMinutes(time.getMinutes() - 1);
//     var futureTime = time.setMinutes(time.getMinutes() + 1);
  
//     var minuteView = {
//           xaxis: {
//             type: 'date',
//             range: [olderTime,futureTime]
//           }
//         };
  
    

//     Plotly.extendTraces(graphDiv,update , [0,1,2,3]);
//     Plotly.relayout(graphDiv, minuteView);
//     if(++cnt===2*60*100) clearInterval(interval);
    
//     //cnt++;
//     // if(cnt > 500) {
//     //     Plotly.relayout(graphDiv,{
//     //         xaxis: {
//     //             range: [cnt-500,cnt]
//     //         }
//     //     });
//     // }
// },100);