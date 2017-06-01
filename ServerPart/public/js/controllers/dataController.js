var dataController = (function() {
    function showEspData(params) {

    }

    function compareEspsData(){
        // return Promise.all([dataService.getEspsData(), templates.get("espdata")])
        //     .then(function([data, template]) {
        //         let templateFunc = handlebars.compile(template);
        //         let html = templateFunc(data.result);
        //         $("#container").html(html);
        //     });
    }

    function showInfo(){

        $(function () {
            let currentDate = new Date();
            let days = 3;
            let offset = days * 24 * 60 * 60 * 1000;
            $('#datetimepickerFrom').datetimepicker({
                defaultDate: (currentDate - offset),
                format: 'MM/DD/Y HH:mm'
            });

            $('#datetimepickerTo').datetimepicker({
                defaultDate: currentDate,
                format: 'MM/DD/Y HH:mm'
                // "setDate": new Date()
                // locale: 'en'
            });
            $('#datetimepickerFromSecondESP').datetimepicker({
                defaultDate: (currentDate - offset),
                format: 'MM/DD/Y HH:mm'
                // "setDate": new Date()
                // locale: 'en'
            });
        });

        $(".btn-info").click(function(){ 
            let self = $(this);
            let espName = $(this).parent().data('espname') || $(this).data('espname');
            let title = "ESP " + espName;
            $('#infoModal .modal-title').text(title);
            $('#infoModal').on('hidden.bs.modal', function () {
                $(".temp_graphic_second").addClass("hidden");
                $(".humidity_graphic_second").addClass("hidden");
                $(".comp_temp_graphic").addClass("hidden");
                $(".comp_humidity_graphic").addClass("hidden");
            })
            printDataFirstESP.call(self);

            $(".btn-show-data").click(function(){ 
                printDataFirstESP.call(self);
            });


            $(".btn-show-second-data").click(function(){ 
                printDataSecondESP.call(self);
            });
        });

        espController.addEspToCompare();
    }

    function printDataFirstESP()
    {
        let unic_id = this.parent().data('unicid') || this.data('unicid');
        let from = spliter($("#datetimepickerFrom").find("input").val());
        let to = spliter($("#datetimepickerTo").find("input").val());
        let esp = {
            unic_id : unic_id,
            from : from,
            to : to
        }
        dataService.getEspData(esp).then(function(response) {
            let data = response.result.data;
            data = data.slice();
            this.firstData = data;
            proccessDate(data,".temp_graphic",".humidity_graphic")
        });
    }    
    function printDataSecondESP()
    {
        let unic_id = this.parent().data('unicid') || this.data('unicid');
        unic_id = $('#select-esp-to-comp option:selected').data("unicid");
        let from = spliter($("#datetimepickerFrom").find("input").val());
        let to = spliter($("#datetimepickerTo").find("input").val());
        let razlika = differenceTime(to, from);
        let fromSecond = spliter($("#datetimepickerFromSecondESP").find("input").val());
        let toSecond = sumTime(fromSecond, razlika);

        // $(".hours-num").text("")
        esp = {
            unic_id : unic_id,
            from : fromSecond,
            to : toSecond
        }
        if(!esp.unic_id) 
        {
            toastr.error('Chose ESP', 'Bad!');
            return;
        }
        $(".temp_graphic_second").removeClass("hidden");
        $(".humidity_graphic_second").removeClass("hidden");
        $(".comp_temp_graphic").removeClass("hidden");
        $(".comp_humidity_graphic").removeClass("hidden");
        dataService.getEspData(esp).then(function(response) {
            let data = response.result.data;
            data = data.slice();
            this.secondData = data;
            proccessDate(data,".temp_graphic_second",".humidity_graphic_second")

            // let razlikaFrom = differenceTime(from, fromSecond);
            // serializeData(this.secondData, razlikaFrom);
            let razlMillis = differenceTimeInMillisecond(from, fromSecond);
            serializeDataMilliseconds(this.secondData, razlMillis)
            compareTemperature(this.firstData,this.secondData,".comp_temp_graphic");
            compareHumidity(this.firstData,this.secondData,".comp_humidity_graphic");
            // multiCharTemp(this.firstData,this.secondData,".comp_temp_graphic", "temperature");
            // diffCharTemp(this.firstData,this.secondData,".comp_temp_graphic", "temperature");
            

        });
    }
    function serializeData(firstData, razlikaFrom)
    {   
        let razlikaTime = new Date(razlikaFrom.year, razlikaFrom.month, razlikaFrom.day, 
            razlikaFrom.hour, razlikaFrom.minute);
        for(let i = 0; i < firstData.length; i+=1)
        {
            let str = (razlikaTime.getFullYear()).toString() + "-" +
                        (razlikaTime.getMonth()).toString() + "-" +
                        (razlikaTime.getDate()).toString() + " " +

                        (razlikaTime.getHours()).toString() + ":" +
                        (razlikaTime.getMinutes()).toString() + ":" +
                        (razlikaTime.getSeconds()).toString();
            firstData[i].moment_time = str;

            let datee = new Date(str);
        }
    }
    function serializeDataMilliseconds(firstData, razlikaFromInMillis)
    {   
        for(let i = 0; i < firstData.length; i+=1)
        {
            let momentData = spliterReturnDate(firstData[i].moment_time);
            let correctTime = momentData.getTime() + razlikaFromInMillis;
            momentData.setTime(correctTime);
            let str = (momentData.getFullYear()).toString() + "-" +
                        String("0" + (momentData.getMonth()).toString()).slice(-2) + "-" +
                        String("0" + (momentData.getDate()).toString()).slice(-2) + " " +

                        String("0" + (momentData.getHours()).toString()).slice(-2) + ":" +
                        String("0" + (momentData.getMinutes()).toString()).slice(-2) + ":" +
                        String("0" + (momentData.getSeconds()).toString()).slice(-2);
            firstData[i].moment_time = str;
        }
    }

    function spliter(datetime){
        let datetime2 = datetime.replace(/-/g, "/");

        let dateAndTime = datetime2.split(" ");
        let date = dateAndTime[0].split("/");
        let time = dateAndTime[1].split(":");
        if(datetime.localeCompare(datetime2)!=0){
            return {
                year: date[0],
                month: date[1],
                day: date[2],
                hour: time[0],
                minute: time[1]
            }
        }
        return {
            month: date[0],
            day: date[1],
            year: date[2],
            hour: time[0],
            minute: time[1]
        }
    }
    function spliterReturnDate(datetime){
        let splitDate = spliter(datetime);
        let dateObj = new Date(splitDate.year, splitDate.month, splitDate.day, 
            splitDate.hour, splitDate.minute);
        return dateObj
    }
    function differenceTime(time1, time2)
    {
        let date1 = new Date(time1.year, time1.month, time1.day, 
            time1.hour, time1.minute);
        let date2 = new Date(time2.year, time2.month, time2.day, 
            time2.hour, time2.minute);
        let diff = new Date(date1.getTime() - date2.getTime());
        return {
            month: (diff.getMonth()).toString(),
            day: (diff.getDate()).toString(),
            year: (diff.getFullYear()).toString(),
            hour: (diff.getHours()).toString(),
            minute: (diff.getMinutes()).toString()
        }
    }

    function differenceTimeInMillisecond(time1, time2)
    {
        let date1 = new Date(time1.year, time1.month, time1.day, 
            time1.hour, time1.minute);
        let date2 = new Date(time2.year, time2.month, time2.day, 
            time2.hour, time2.minute);
        let diff = date1 - date2;
        return diff;
    }

    function sumTime(time1, time2)
    {
        let date1 = new Date(time1.year, time1.month, time1.day, 
            time1.hour, time1.minute);
        let date2 = new Date(time2.year, time2.month, time2.day, 
            time2.hour, time2.minute);
        // let sum = date1.getTime() + date2.getTime();
        let sum = new Date(date1.getTime() + date2.getTime());
        return {
            month: (sum.getMonth()).toString(),
            day: (sum.getDate()).toString(),
            year: (sum.getFullYear()).toString(),
            hour: (sum.getHours()).toString(),
            minute: (sum.getMinutes()).toString()
        }
    }

    function proccessDate(data, d3selectorTemp, d3selectorHumidity)
    {
        proccessTemperature(data, d3selectorTemp);
        proccessHumidity(data, d3selectorHumidity);
    }
    function proccessTemperature(data, d3selectorTemp) {
        // let widthPixels = $(".temp_graphic").width();
        let widthPixels = $(d3selectorTemp).width();
        let heightPixels = $(d3selectorTemp).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        let x = d3.scaleTime()
            .range([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);

        // let xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom")
        //     .tickFormat(d3.timeFormat("%m/%d %H:%M"));;

        // let yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left");



        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.timeFormat("%m/%d %H:%M"));;

        let yAxis = d3.axisLeft()
            .scale(y);



        let area = d3.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.close); });

        // var svg = d3.select("body").append("svg")
        d3.select(d3selectorTemp + " svg").remove();
        let svg = d3.select(d3selectorTemp)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.temperature;
        }); 

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) { return d.close; }),
                    d3.max(data, function(d) { return d.close; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.2em")
            .attr("dy", ".07em")
            .attr("transform", "rotate(-50)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Temperature");
    }

    function proccessHumidity(data, d3selectorHumidity) {
        let widthPixels = $(d3selectorHumidity).width();
        let heightPixels = $(d3selectorHumidity).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        let x = d3.scaleTime()
            .range([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);

        // let xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom")
        //     .tickFormat(d3.timeFormat("%m/%d %H:%M"));;

        // let yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left");

        // let area = d3.svg.area()


        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.timeFormat("%m/%d %H:%M"));;

        let yAxis = d3.axisLeft()
            .scale(y);



        let area = d3.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.close); });

        // var svg = d3.select("body").append("svg")
        d3.select(d3selectorHumidity + " svg").remove();
        let svg = d3.select(d3selectorHumidity)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.humidity;
        }); 

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.2em")
            .attr("dy", ".07em")
            .attr("transform", "rotate(-50)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Humidity");
    }

    function compareTemperature(firstData,secondData,selector)
    {
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // set the ranges


        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);


        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        d3.select(selector + " svg").remove();
        let svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Get the data


        // format the data
        firstData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.temperature;
            // d.open = +d.open;
        });


        secondData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.temperature;
            // d.open = +d.open;
        });


        // define the 1st line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y0(d.close);
            });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y1(d.close);
            });



        let min1 = d3.min(firstData, function(d) { return d.close; });
        let min2 = d3.min(secondData, function(d) { return d.close; });
        let xMin = min1 < min2? min1:min2;

        let max1 = d3.max(firstData, function(d) { return d.close; });
        let max2 = d3.max(secondData, function(d) { return d.close; });
        let xMax = max1 > max2? max1:max2;


        x.domain(d3.extent(firstData, 
            function (d) {  return d.date }));
        y0.domain([xMin, xMax]);
        y1.domain([xMin, xMax]);


        // x.domain(d3.extent(firstData, 
        //     function (d) {  return d.date }));
        // y0.domain([0, d3.max(firstData, 
        //     function (d) { return Math.max(d.close);})]);
        // y1.domain([0, d3.max(secondData, 
        //     function (d) { return Math.max(d.close);})]);


        // x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([d3.min(data, function(d) { return d.close; }),
        //             d3.max(data, function(d) { return d.close; })]);


        // Scale the range of the data
        // x.domain(d3.extent(firstData, function (d) {
        //     return d.date
        // }));

        // y0.domain([0, d3.max(firstData, function (d) {
        //     return Math.max(d.close);
        // })]);
        // y1.domain([0, d3.max(secondData, function (d) {
        //     return Math.max(d.close);
        // })]);



        // Add the valueline path.
        svg.append("path")
            .data([firstData])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([secondData])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("stroke","red")
            .attr("d", valueline2);



        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(xAxis)
        // .selectAll("text")  
        //     .style("text-anchor", "end")
        //     .attr("dx", "-.2em")
        //     .attr("dy", ".07em")
        //     .attr("transform", "rotate(-50)" );

        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis)
        //     .append("text")
        //         .attr("transform", "rotate(-90)")
        //         .attr("y", 6)
        //         .attr("dy", ".71em")
        //         .style("text-anchor", "end")
        //         .text("Humidity");


        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.2em")
            .attr("dy", ".07em")
            .attr("transform", "rotate(-50)" );

        // Add the Y0 Axis
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .call(d3.axisLeft(y0));

        // Add the Y1 Axis
        svg.append("g")
            .attr("class", "axisRed")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(y1));

    }


    function compareHumidity(firstData,secondData,selector)
    {
        console.log(firstData[0].date);
        console.log(secondData[0].date);
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);


        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        d3.select(selector + " svg").remove();
        let svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Get the data


        // format the data
        firstData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.humidity;
            // d.open = +d.open;
        });


        secondData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.humidity;
            // d.open = +d.open;
        });


        // define the 1st line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y0(d.close);
            });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y1(d.close);
            });


        // Scale the range of the data
        x.domain(d3.extent(firstData, function (d) {
            return d.date
        }));

        y0.domain([0, d3.max(firstData, function (d) {
            return Math.max(d.close);
        })]);
        y1.domain([0, d3.max(secondData, function (d) {
            return Math.max(d.close);
        })]);

    // y0.domain([d3.min(firstData, function(d) { return d.close; }),
    //                 d3.max(firstData, function(d) { return d.close; })]);

    // y1.domain([d3.min(secondData, function(d) { return d.close; }),
    //                 d3.max(secondData, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .data([firstData])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([secondData])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("stroke","red")
            // .attr("d", valueline);
            .attr("d", valueline2);


        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y0 Axis
        svg.append("g")
            .attr("class", "axisSteelBlue")
            .call(d3.axisLeft(y0));

        // Add the Y1 Axis
        svg.append("g")
            .attr("class", "axisRed")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(y1));
    }

    function multiCharTemp(firstData, secondData, selector, param)
    {
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        // margin = {top: 20, right: 80, bottom: 30, left: 50};
        // width = svg.attr("width") - margin.left - margin.right;
        // height = svg.attr("height") - margin.top - margin.bottom;


        d3.select(selector + " svg").remove();
        let svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        let g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
        parseDate = d3.timeParse("%Y%m%d");

        let x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        let line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.temperature); });

        // let cities = data.columns.slice(1).map(function(id) {
        //     return {
        //       id: id,
        //       values: data.map(function(d) {
        //         return {date: d.date, temperature: d[id]};
        //       })
        //     };
        //   });
        let data = [
            {
                City: "New York",
                Data: [
                    {
                        Data: "20111001",
                        Value: 63.4
                    },
                    {
                        Data: "20111002",
                        Value: 58.0
                    },
                    {
                        Data: "20111003",
                        Value: 53.3
                    }
                ]
            },
            {
                City: "San Francisco",
                Data: [
                    {
                        Data: "20111001",
                        Value: 63.4
                    },
                    {
                        Data: "20111002",
                        Value: 58.0
                    },
                    {
                        Data: "20111003",
                        Value: 53.3
                    }
                ]
            },
            {
                City: "Austin",
                Data: [
                    {
                        Data: "20111001",
                        Value: 72.2
                    },
                    {
                        Data: "20111002",
                        Value: 67.7
                    },
                    {
                        Data: "20111003",
                        Value: 69.4
                    }
                ]
            }
        ];
        data = [
          {
            "date": "20111001",
            "New York": "63.4",
            "San Francisco": "62.7",
            "Austin": "72.2"
          },
          {
            "date": "20111002",
            "New York": "58.0",
            "San Francisco": "59.9",
            "Austin": "67.7"
          },
          {
            "date": "20111003",
            "New York": "53.3",
            "San Francisco": "59.1",
            "Austin": "69.4"
          }
        ];
        var color = d3.scaleLinear()
            .domain([-1, 0, 1])
            .range(["red", "white", "green"]);
        var cities = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
                console.log(d);
                console.log(d[name]);
                console.log(name);
              return {date: d.date, temperature: +d[name]};
            })
          };
        });

          // x.domain(d3.extent(data, function(d) { return d.date; }));

          // y.domain([
          //   d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
          //   d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
          // ]);

          // z.domain(cities.map(function(c) { return c.id; }));
        // var minX = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Date; }) });
        // var maxX = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Date; }) });
        // var minY = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Value; }) });
        // var maxY = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Value; }) });

        // x.domain([minX, maxX]);
        // y.domain([minY, maxY]);
            // x.domain(d3.extent(data, function (d) {
            //     return d.date;
            // }));

            // y.domain([
            // d3.min(cities, function (c) {
            //     return d3.min(c.values, function (v) {
            //         return v.temperature;
            //     });
            // }),
            // d3.max(cities, function (c) {
            //     return d3.max(c.values, function (v) {
            //         return v.temperature;
            //     });
            // })]);

          g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("fill", "#000")
              .text("Temperature, ºF");

        let city = g.selectAll(".city")
            .data(cities)
            .enter().append("g")
              .attr("class", "city");

          city.append("path")
              .attr("class", "line")
              .attr("d", function(d) { console.log(d.values);return line(d.values); })
              .style("stroke", function(d) { return z(d.id); });

          city.append("text")
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
              .attr("x", 3)
              .attr("dy", "0.35em")
              .style("font", "10px sans-serif")
              .text(function(d) { return d.id; });

        // function type(d, _, columns) {
        //   d.date = parseDate(d.date);
        //   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        //   return d;
        // }
    }

    function diffCharTemp(firstData, secondData, selector, param)
    {
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;
        // set the ranges
        // var x = d3.scaleTime().range([0, width]);
        // var y0 = d3.scaleLinear().range([height, 0]);
        // var y1 = d3.scaleLinear().range([height, 0]);

        d3.select(selector + " svg").remove();
        let svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        let g = svg.append("g").attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");
        let parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        // var x = d3.scaleTime().range([0, width]);
        // var y = d3.scaleLinear().range([height, 0]);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });


        firstData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.humidity;
            // d.open = +d.open;
        });
        secondData.forEach(function(d) {
            d.date = parseDate(d.moment_time);
            d.close = +d.humidity;
            // d.open = +d.open;
        });

          x.domain(d3.extent(firstData, function(d) { return d.date; }));
          y.domain(d3.extent(firstData, function(d) { return d.close; }));

          g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
            .select(".domain")
              .remove();

          g.append("g")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Price ($)");

          g.append("path")
              .datum(firstData)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);

          g.append("path")
              .datum(secondData)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);
    }
    return {
        showEspData,
        compareEspsData,
        showInfo
    }
})();







/*  function diffCharTemp(firstData, secondData, selector, param)
    {
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%Y%m%d");

        var x = d3.scaleTime()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        // let area = d3.area()
        //     .x(function(d) { return x(d.date); })
        //     .y0(height)
        //     .y1(function(d) { return y(d.close); });

        var line = d3.area()
        // var line = d3.svg.area()
            // .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d["New York"]); });

        var area = d3.area()
            // .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y1(function(d) { return y(d["New York"]); });

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.tsv("data.tsv", function(error, data) {
          if (error) throw error;

          data.forEach(function(d) {
            d.date = parseDate(d.date);
            d["New York"]= +d["New York"];
            d["San Francisco"] = +d["San Francisco"];
          });

          x.domain(d3.extent(data, function(d) { return d.date; }));

          y.domain([
            d3.min(data, function(d) { return Math.min(d["New York"], d["San Francisco"]); }),
            d3.max(data, function(d) { return Math.max(d["New York"], d["San Francisco"]); })
          ]);

          svg.datum(data);

          svg.append("clipPath")
              .attr("id", "clip-below")
            .append("path")
              .attr("d", area.y0(height));

          svg.append("clipPath")
              .attr("id", "clip-above")
            .append("path")
              .attr("d", area.y0(0));

          svg.append("path")
              .attr("class", "area above")
              .attr("clip-path", "url(#clip-above)")
              .attr("d", area.y0(function(d) { return y(d["San Francisco"]); }));

          svg.append("path")
              .attr("class", "area below")
              .attr("clip-path", "url(#clip-below)")
              .attr("d", area);

          svg.append("path")
              .attr("class", "line")
              .attr("d", line);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Temperature (ºF)");
        });
    }*/