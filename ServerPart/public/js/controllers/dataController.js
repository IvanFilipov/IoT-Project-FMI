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
            let days = 21;
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
            compareTempeerature(this.firstData,this.secondData,".comp_temp_graphic");
        });
    }

    function spliter(datetime){
        let dateAndTime = datetime.split(" ");
        let date = dateAndTime[0].split("/");
        let time = dateAndTime[1].split(":");
        return {
            month: date[0],
            day: date[1],
            year: date[2],
            hour: time[0],
            minute: time[1],
        }
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
        console.log(data);
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

    function compareTempeerature(firstData,secondData,selector)
    {
        let widthPixels = $(selector).width();
        let heightPixels = $(selector).height();

        let margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

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
            d.date = parseTime(d.moment_time);
            d.close = +d.temperature;
            // d.open = +d.open;
        });


        secondData.forEach(function(d) {
            d.date = parseTime(d.moment_time);
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
    return {
        showEspData,
        compareEspsData,
        showInfo
    }
})();







