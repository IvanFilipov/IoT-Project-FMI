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
            let days = 47;
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
        });

        $(".btn-info").click(function(){ 
            let self = $(this);
            let unic_id = self.parent().data('unicid') || self.data('unicid');

            let from = spliter($("#datetimepickerFrom").find("input").val());
            let to = spliter($("#datetimepickerTo").find("input").val());

            let espName = $(this).parent().data('espname') || $(this).data('espname');
            let title = "ESP " + espName;
            $('#infoModal .modal-title').text(title);

            let esp = {
                unic_id : unic_id,
                from : from,
                to : to
            }

            dataService.getEspData(esp).then(function(response) {
                let data = response.result.data;
                data = data.slice();
                proccessData2(data);

            });
            $(".btn-show-data").click(function(){ 
                unic_id = self.parent().data('unicid') || self.data('unicid');
                from = spliter($("#datetimepickerFrom").find("input").val());
                to = spliter($("#datetimepickerTo").find("input").val());
                esp = {
                    unic_id : unic_id,
                    from : from,
                    to : to
                }

                dataService.getEspData(esp).then(function(response) {
                    let data = response.result.data;
                    data = data.slice();
                    // console.log(data);
                    proccessData2(data);

                });
            });
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

    // var svg = d3.select("svg");
    // var data = JSONData.slice();
    function proccessData(data){
        let json = d3.select();

        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%d-%b-%y");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var area = d3.area()
            .x(function(d) { return x(d.date); })
            .y1(function(d) { return y(d.close); });

        d3.tsv("data.tsv", function(d) {
          d.date = parseTime(d.date);
          d.close = +d.close;
          return d;
        }, function(error, data) {
          if (error) throw error;

          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.close; })]);
          area.y0(y(0));

          g.append("path")
              .datum(data)
              .attr("fill", "steelblue")
              .attr("d", area);

          g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          g.append("g")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Price ($)");
        });
    }
    function proccessData2(data) {
        let widthPixels = $(".visualisation").width();
        let heightPixels = $(".visualisation").height();

        var margin = {top: 20, right: 20, bottom: 75, left: 50},
            width = widthPixels - margin.left - margin.right,
            height = heightPixels - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%m/%d %H:%M"));;

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.close); });

        // var svg = d3.select("body").append("svg")
        d3.select(".visualisation svg").remove();
        var svg = d3.select(".visualisation")
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

    return {
        showEspData,
        compareEspsData,
        showInfo
    }
})();







