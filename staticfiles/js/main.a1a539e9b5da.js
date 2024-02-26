$(document).ready(function () {

    let data = [];
    let dane = [];
    let selection = {};
    let sdata = []; // selection of data and dane
    let sdane = [];
    let last_brush_element = "";
    let one_photo_name = "";
    let one_photo_id = "";
    let answer_cols_org = [
        "q1_1", "q2_1", "q3_1", "q4_1", "q5_1", "q6_1", "q7_1", "q8_1", "q9_1", "q10_1",
        "q11_1", "q12_1", "q13_1", "q14_1", "q15_1", "q16_1", "q17_1", "q18_1", "q19_1", "q20_1",
        "q21_1", "q22_1", "q23_1", "q24_1", "q25_1", "q26_1", "q27_1", "q28_1", "q29_1", "q30_1",
        "q31_1", "q32_1", "q33_1", "q34_1", "q35_1", "q36_1", "q37_1", "q38_1", "q39_1", "q40_1"];

    let answer_cols = [
        "q1_1", "q2_1", "q3_1", "q4_1", "q5_1", "q6_1", "q7_1", "q8_1", "q9_1", "q10_1",
        "q11_1", "q12_1", "q13_1", "q14_1", "q15_1", "q16_1", "q17_1", "q18_1", "q19_1", "q20_1",
        "q21_1", "q22_1", "q23_1", "q24_1", "q25_1", "q26_1", "q27_1", "q28_1", "q29_1", "q30_1",
        "q31_1", "q32_1", "q33_1", "q34_1", "q35_1", "q36_1", "q37_1", "q38_1", "q39_1", "q40_1"];

    /**
     * Draws a violin plot in the specified container.
     * @param {string} container_id - The ID of the container element.
     * @param {Array} dane - The data array.
     * @param {string} column - The column name.
     * @param {boolean} [selection=false] - Indicates whether selection is enabled.
     */
    function draw_violin(container_id, dane, column, selection = false) {

        /**
         * Handles the brush event.
         */
        function brushed() {

            extent = d3.event.selection;

            // color the selected data
            d3.select(d3.select(container_id).selectAll("path")["_groups"][0][0]).style("fill", "#E1CAEC");

            // dont allow cursor to go outside of the chart
            let src = d3.event.sourceEvent.srcElement;
            if ($(src)[0].nodeName === "rect") {
                let parent = src.parentElement;
                let parent_class = parent.className.baseVal;
                last_brush_element = parent_class;
            }

        }

        /**
         * Handles the brushended event.
         */
        function brushended() {
            extent = d3.event.selection;
            if (!extent) {
                d3.select(d3.select(container_id).selectAll("path")["_groups"][0][0]).style("fill", "#CE99E9");
                selection_of_data(last_brush_element, [], true);
                return;
            } else {
                let rob = ["ff", "bm", "sl", "hls"];
                let y_vio = ["ff", "bm", "sl"]
                let dat;
                if (rob.includes(last_brush_element)) {
                    dat = data_for_chart(dane, last_brush_element);
                } else {
                    dat = data_for_chart(dane, last_brush_element);
                }

                let val_start, val_end;
                let selected_data = [];
                if (y_vio.includes(last_brush_element)) {
                    val_start = y.invert(extent[0]);
                    val_end = y.invert(extent[1]);

                    dat.forEach(function (d) {
                        if (d.key <= val_start && d.key >= val_end) {
                            selected_data.push(d);
                        }
                    });
                } else {
                    val_start = x.invert(extent[0]);
                    val_end = x.invert(extent[1]);

                    dat.forEach(function (d) {
                        if (d.key >= val_start && d.key <= val_end) {
                            selected_data.push(d);
                        }
                    });
                }

                if (selected_data.length > 0) {
                    selection_of_data(last_brush_element, selected_data);

                }
            }
        }

        let height = $(container_id).height();
        let width = $(container_id).width();
        let d_column = [];
        dane.forEach(function (d) {
            d_column.push(d[column]);
        });

        let violin = {
            "M2": {
                "name": "Wiek",
                "domain": [d3.min(d_column) - 1, d3.max(d_column) + 1],
                "ticks": 20,
                "direction": "x",
                "x_corr": 18,
                "min": d3.min(d_column),
                "max": d3.max(d_column)
            },
            "ff": {
                "name": "Facial Features",
                "domain": [d3.min(d_column) - 0.1, d3.max(d_column) + 0.1],
                "ticks": 15,
                "direction": "y",
                "x_corr": -62,
                "min": d3.min(d_column),
                "max": d3.max(d_column)
            },
            "bm": {
                "name": "Body Manipulators",
                "domain": [d3.min(d_column) - 0.1, d3.max(d_column) + 0.15],
                "ticks": 15,
                "direction": "y",
                "x_corr": -70,
                "min": d3.min(d_column),
                "max": d3.max(d_column)
            },
            "sl": {
                "name": "Surface Look",
                "domain": [d3.min(d_column) - 0.1, d3.max(d_column) + 0.1],
                "ticks": 15,
                "direction": "y",
                "x_corr": -62,
                "min": d3.min(d_column),
                "max": d3.max(d_column)
            },
            "hls": {
                "name": "Human-Likeness Score",
                "domain": [d3.min(d_column) - 5, d3.max(d_column) + 5],
                "ticks": 20,
                "direction": "x",
                "x_corr": 100,
                "min": d3.min(d_column),
                "max": d3.max(d_column)
            }
        }

        const svg = d3.select(container_id)
            .append("svg")
            .attr("viewBox", [0, 0, width, height]) // 30    Adjust the viewBox width to include the extra space
            .append("g");


        let x_cen, y_cen, brush;

        if (violin[column]["direction"] == "y") {
            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].name)
                .style("font-size", "16px")
                .style("color", "white")
                .style("width", "100%")
                .style("font-weight", "bold")
                .style("text-align", "center")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");

            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].max)
                .style("top", "" + height * 0.12 + "px")
                .style("left", "" + width * 0.07 + "px")
                .style("font-size", "12px")
                .style("width", "" + width * 0.4 + "px")
                .style("color", "#ce99e9")
                .style("font-weight", "bold")
                .style("text-align", "left")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");

            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].min)
                .style("top", "" + height * 0.90 + "px")
                .style("left", "" + width * 0.07 + "px")
                .style("font-size", "12px")
                .style("width", "" + width * 0.4 + "px")
                .style("color", "#ce99e9")
                .style("font-weight", "bold")
                .style("text-align", "left")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");


            y_cen = height * 0.15;
            x_cen = width * 0.25;
            height = height * 0.8;
            width = width * 0.5;
            brush = d3.brushY()
                .extent([[x_cen, y_cen], [width + x_cen, height + y_cen]])
                .on("brush", brushed)
                .on("end", brushended);
            var y = d3.scaleLinear()
                .domain(violin[column]["domain"])
                .range([height + y_cen * 0.5, y_cen])

            // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
            var x = d3.scaleLinear()
                .range([x_cen, width + x_cen])
                .domain([maxNum, -maxNum])

            var histogram = d3.histogram()
                .domain(y.domain())
                .thresholds(y.ticks(violin[column]["ticks"]))
                .value(d => d)

        } else {
            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].name)
                .style("font-size", "16px")
                .style("color", "white")
                .style("width", "100%")
                .style("font-weight", "bold")
                .style("text-align", "center")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");

            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].min)
                .style("top", "" + height * 0.5 + "px")
                .style("left", "" + width * 0.07 + "px")
                .style("font-size", "12px")
                .style("width", "" + width * 0.1 + "px")
                .style("color", "#ce99e9")
                // .style("width", "100%")
                .style("font-weight", "bold")
                .style("text-align", "left")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");

            d3.select(container_id).insert("p", ":first-child")
                .text(violin[column].max)
                .style("top", "" + height * 0.5 + "px")
                .style("left", "" + width * 0.82 + "px")
                .style("font-size", "12px")
                .style("width", "" + width * 0.1 + "px")
                .style("color", "#ce99e9")
                .style("font-weight", "bold")
                .style("text-align", "right")
                .style("word-break", "break-word")
                .style("position", "absolute")
                .attr("text-wrap", "wrap");

            x_cen = width * 0.15;
            y_cen = height;
            width = width * 0.7;
            brush = d3.brushX()
                .extent([[x_cen, height * 0.2], [width + x_cen, height]])

                .on("brush", brushed)
                .on("end", brushended);

            var y = d3.scaleBand()
                .domain(["test"])
                .range([height * 0.2, height])
                .padding(0.05)

            var x = d3.scaleLinear()
                .domain(violin[column]["domain"])
                .range([x_cen, x_cen + width]);

            var histogram = d3.histogram()
                .domain(x.domain())
                .thresholds(x.ticks(violin[column]["ticks"]))
                .value(d => d);
        }


        // Compute the binning for each group of the dataset
        var sumstat = d3.nest()
            .key(function (d) { return d.id; })
            .rollup(function (d) {
                input = d.map(function (g) { return g.ff; })
                bins = histogram(input)
                return (bins)
            })
            .entries(dane)
        var v_input = dane.map(function (g) { return g[column]; })
        var v_bins = histogram(v_input)
        sumstat = [{ key: "test", value: v_bins }]
        var maxNum = 0

        for (i in sumstat) {
            allBins = sumstat[i].value
            lengths = allBins.map(function (a) { return a.length; })
            longuest = d3.max(lengths)
            if (longuest > maxNum) { maxNum = longuest }
        }

        if (violin[column]["direction"] == "y") {
            var x = d3.scaleLinear()
                .range([x_cen, width + x_cen])
                .domain([maxNum, -maxNum])
            svg
                .selectAll(container_id)
                .data(sumstat)
                .enter()
                .append("path")
                .datum(function (d) { return (d.value) })
                .style("stroke", "none")
                .style("fill", "#ce99e9")
                .attr("d", d3.area()
                    .x0(function (d) { return (x(-d.length)) })
                    .x1(function (d) { return (x(d.length)) })
                    .y(function (d) { return (y(d.x0)) })
                    .curve(d3.curveCatmullRom)
                )

            svg.append("g").attr("class", column).call(brush);
        } else {
            var xNum = d3.scaleLinear()
                .range([0, y.bandwidth()])
                .domain([-maxNum, maxNum]);
            svg
                .selectAll(container_id)
                .data(sumstat)
                .enter()
                .append("path")
                .attr("transform", function (d) { return ("translate(0, " + height * 0.2 + ")") })
                .datum(function (d) { return (d.value) })
                .style("stroke", "none")
                .style("fill", "#ce99e9")
                .attr("d", d3.area()
                    .x(function (d) { return (x(d.x0)) })
                    .y0(function (d) { return (xNum(d.length)) })
                    .y1(function (d) { return (xNum(-d.length)) })
                    .curve(d3.curveCatmullRom)
                )
            svg.append("g").attr("class", column).call(brush);

        }
        if (selection) {
            let pos_x = width + (2 * x_cen) - 20;
            let pos_y = 20;
            if (violin[column]["direction"] == "y") {
                pos_y = height + y_cen;
            }

            svg.append("g")
                .attr("c", column)
                .append("circle")
                .attr("cx", pos_x)
                .attr("cy", pos_y)

                .attr("r", 10)
                .attr("fill", "#E74C4C")
                .attr("opacity", ".8")
            // add x to the circle
            let g = svg.selectAll("g")["_groups"][0]
            g = g[g.length - 1];
            g = d3.select(g);
            g.append("text")
                .attr("x", pos_x)
                .attr("y", pos_y + 5)
                .text("x")
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("fill", "#212529")
                .attr("font-weight", "bold");

            g.on("mouseup", function (d) {
                console.log("clicked");
                console.log(d3.select(this).attr("c"));
                selection_of_data(d3.select(this).attr("c"), [], true);
            })
        }

    }


    /**
     * Draws a doughnut chart in the specified container using the provided data.
     * @param {string} container_id - The ID of the container element where the chart will be rendered.
     * @param {Array} data - The data used to generate the chart.
     * @param {string} column - The column name used for data manipulation.
     * @param {number} height - The height of the chart.
     * @param {number} width - The width of the chart.
     * @param {boolean} [selection=false] - Optional parameter to enable/disable selection functionality.
     */
    function draw_doughnut(container_id, data, column, height, width, selection = false) {
        let d_column = data_for_chart(data, column);
        var svg = d3.select(container_id).append("svg")
            .attr("viewBox", [0, 0, width, height]);

        // for each key in d_column, draw circle with radius proportional to value, next to each other, keeping in mind that smallest circle must be visible
        // and the biggest must not exceed the width of the container
        let max = d3.max(d_column, function (d) { return d.value; });
        let min = d3.min(d_column, function (d) { return d.value; });

        // scale linearly the radius of the circles

        let keys_length = Object.keys(d_column).length + 1;
        let x_width = width / keys_length;
        let x = 0;
        // check which one is smaller width or height
        let small = width < height ? width : height;
        let small_min = small * 0.2;
        let small_max = small * 0.6;
        let diff = small_max - small_min;
        let y = height / 2 + height * 0.1;
        let i = 0;

        let nominal = {
            "M1": {
                "order": [1, 3, 2],
                "tooltip": {
                    1: "Mężczyzna",
                    2: "Kobieta",
                    3: "Inna"
                },
                "diff": 1,
                "name": "Płeć",
                "1": "M",
                "2": "K",
                "3": "?",
                "x_corr": -15
            },
            "M3": {
                "order": [2, 4, 5, 3],
                "tooltip": {
                    2: "Średnie",
                    3: "Wyższe",
                    4: 'Zawodowe',
                    5: "Student"
                },
                "diff": 2,
                "name": "Wykształcenie",
                "2": "Średnie",
                "3": "Wyższe",
                "4": 'Zawodowe',
                "5": "Student",
                "x_corr": -50
            },
            "M4": {
                "order": [1, 2],
                "tooltip": {
                    1: "Tak",
                    2: "Nie"
                },
                "diff": 1,
                "name": "Doświadczenie z robotami",
                "1": "Tak",
                "2": "Nie",
                "x_corr": -100
            }
        }
        let d;
        let val_stay = []
        for (let i in d_column) {
            val_stay.push(d_column[i].key);
        }
        let final_order = [];
        for (let i in nominal[column].order) {
            if (val_stay.includes(nominal[column].order[i])) {
                final_order.push(val_stay.indexOf(nominal[column].order[i]));
            }
        }

        let lowest_val
        for (j = 0; j < d_column.length; j++) {
            d = d_column[final_order[j]];

            // if d.value is undefined, continue
            let ciw = container_id.substring(1);

            svg.append("g")
                .attr("v", d.key)
                .attr("a", d.value)
                .attr('c', column)
                .append("circle")
                .attr("cx", x + x_width)
                .attr("cy", y)
                .attr("r", ((diff * (d.value / max)) + small_min) / 2)
                .attr("fill", "#ce99e9");
            // title each circle with the key in the middle of the circle
            let g = svg.selectAll("g")["_groups"][0]
            g = g[g.length - 1];
            g = d3.select(g);
            g.append("text")
                .attr("x", x + x_width)
                .attr("y", y + 4)
                .text(nominal[column][d.key])
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "white")
                .attr("font-weight", "bold");
            x += x_width;
            i++;
        };
        if (selection) {
            // append delete button x to the right of the svg
            svg.append("g")
                .attr("c", column)
                .append("circle")
                // .attr("c", column)
                .attr("cx", width - 20)
                .attr("cy", 20)
                .attr("r", 10)
                .attr("fill", "#E74C4C")
                .attr("opacity", ".8")
            // add x to the circle
            let g = svg.selectAll("g")["_groups"][0]
            g = g[g.length - 1];
            g = d3.select(g);
            g.append("text")
                .attr("x", width - 20)
                .attr("y", 25)
                .text("x")
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("fill", "#212529")
                .attr("font-weight", "bold");
        }
        // add title to the chart in the left top corner
        svg.append("text")
            .attr("id", column)
            .attr("x", "50%")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("y", 13)
            .text(nominal[column].name)
            .attr("font-size", "16px")
            .attr("fill", "white")
            .style("font-weight", "bold");

        // make each circle clickable and add a tooltip with the value
        svg.selectAll("g")
            .on("mouseup", function (d) {
                let touched = d3.select(this).select("circle");
                let other = d3.select(container_id).selectAll("circle").filter(function (d) {
                    return d3.select(this).attr("fill") == "#ce99e9";
                });
                if (touched.attr("fill") == "#B35BE2" || other["_groups"][0].length == 1 || touched.attr("fill") == "#E74C4C") {
                    other.attr("fill", "#CE99E9");
                    selection_of_data(d3.select(this).attr("c"), [], true);
                } else {
                    d3.select(container_id).selectAll("circle").attr("fill", "#E1CAEC");
                    touched.attr("fill", "#B35BE2")

                    selection_of_data(d3.select(this).attr("c"), [parseFloat(d3.select(this).attr("v"))]);
                }
            })

            //show tooltip on hover on particular circle
            .on("mouseover", function (d) {
                $("#tooltip").remove();
                let touched = d3.select(this).select("circle");

                let a = parseFloat(d3.select(this).attr("a"));
                let v = d3.select(this).attr("v");
                let c = d3.select(this).attr("c");
                d3.select("#" + c).text(nominal[c]["tooltip"][v] + " (" + a + ")");


            })

            .on("mouseout", function (d) {
                d3.select("#" + column).text(nominal[column].name);
            })

    }

    /**
     * Draws a doughnut chart in the specified container using the provided data and column.
     * @param {string} container_id - The ID of the container element where the chart will be drawn.
     * @param {Array} data - The data used to generate the chart.
     * @param {string} column - The column used to determine the values for the chart.
     */
    function drawYDoughnut(container_id, data, column) {
        let height = $(container_id).height();
        let width = $(container_id).width();
        let d_column = answers_for_chart(data);
        var svg = d3.select(container_id).append("svg")
            .attr("viewBox", [0, 0, width, height]);

        // for each key in d_column, draw circle with radius proportional to value, next to each other, keeping in mind that smallest circle must be visible
        // and the biggest must not exceed the width of the container
        let max = d3.max(d_column, function (d) { return d.value; });
        let min = d3.min(d_column, function (d) { return d.value; });

        // scale linearly the radius of the circles

        let keys_length = Object.keys(d_column).length + 1;
        let y_height = height / keys_length;
        let y = y_height / 3;
        // check which one is smaller width or height
        let small = width > height ? width : height;
        let small_min = y_height * 0.2;
        let small_max = y_height;
        let diff = small_max - small_min;
        let x = width / 2;
        let i = 0;
        let key_meaning = {
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
        }
        let nominal = {
            "q1_1": {
                "order": [0, 1, 2, 3, 4],
                "name": "ANSWERS",
                "tooltip": {
                    1: 1,
                    2: 2,
                    3: 3,
                    4: 4,
                    5: 5
                },
                "1": "1",
                "2": "2",
                "3": "3",
                "4": '4',
                "5": "5",
                "x_corr": -45,
                "color": {
                    // from i dont like to i like it
                    "1": "#E1CAEC",
                    "2": "#D8B2EB",
                    "3": "#CE99E9",
                    "4": "#BF7CE2",
                    "5": "#B35BE2"
                }
            },
        }

        let d;
        for (j = 0; j < d_column.length; j++) {
            d = d_column[nominal[column].order[j]];
            // if d.value is undefined, continue
            svg.append("g")
                .attr("v", d.key)
                .attr("a", d.value)
                .append("circle")
                .attr("cx", x)
                .attr("cy", y + y_height)
                .attr("r", ((diff * (d.value / max) + small_min)) / 2)
                .attr("fill", nominal[column].color[d.key])
                .attr("opacity", ".8")
            // title each circle with the key in the middle of the circle
            let g = svg.selectAll("g")["_groups"][0]
            g = g[g.length - 1];
            g = d3.select(g);
            g.append("text")
                .attr("x", x)
                .attr("y", y + y_height + 4)
                .text(nominal[column][d.key])
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("fill", "white")
                .attr("font-weight", "bold");

            y += y_height;
            i++;
        };
        svg.selectAll("g")
            .on("mouseover", function (d) {
                console.log(d3.select(this));
                let a = parseFloat(d3.select(this).attr("a"));
                let v = d3.select(this).attr("v");
                $("#tit_ann").text(nominal["q1_1"]["tooltip"][v] + " (" + a + ")");
            })

            .on("mouseout", function (d) {
                $("#tit_ann").text("ANSWERS");
            })


    }

    $("#reset").on("click", resetFilters);

    /**
     * Resets the filters and clears the chart containers, violins, answers, and robot display.
     * Calls the drawAllCharts function to redraw all the charts.
     * @function resetFilters
     * @returns {void}
     */
    function resetFilters() {
        selection = {};
        answer_cols = Object.assign([], answer_cols_org);

        $("#chart-container").empty();
        $("#chart-container1").empty();
        $("#chart-container2").empty();
        $("#chart-container3").empty();
        $("#violin-1").empty();
        $("#violin-2").empty();
        $("#violin-3").empty();
        $("#violin-4").empty();
        $("#answers").empty();
        $("#robot_sp").text("ROBOT");
        $("#robot_sp").removeClass("animated_text");
        $("#robot_hr").removeClass("robot_hr");
        $("div[name='" + one_photo_name + "']").removeClass("col-6");
        $("div[name='" + one_photo_name + "']").addClass("col-1");
        $("div[name='" + one_photo_name + "']").removeClass("align-self-center");
        $("div[name='" + one_photo_name + "']").removeClass("h-100");
        $("div[name='" + one_photo_name + "'] img").removeClass("img-fluid-2");
        $("div[name='" + one_photo_name + "'] img").addClass("img-fluid-1");
        one_photo_name = "";

        drawAllCharts();
        draw_violin("#violin-1", dane, "ff");
        draw_violin("#violin-2", dane, "bm");
        draw_violin("#violin-3", dane, "sl");
        draw_violin("#violin-4", dane, "hls");
        reduce_robots_img(dane);

    }

    /**
     * Reduces the visibility of robot images based on the provided data.
     * @param {Array} ndane - The array of robot data.
     */
    function reduce_robots_img(ndane) {
        let ids = [];
        for (let i in ndane) {
            ids.push(ndane[i].robot_id);
        }

        for (let i = 1; i < 41; i++) {
            if (!ids.includes(i)) {
                $("div[robot_id=" + i + "]").hide();
            } else {
                $("div[robot_id=" + i + "]").show();
            }
        }
    }

    /**
     * Handles the click event on an image.
     */
    function image_click() {
        let robot_id = $(this).attr("robot_id");
        one_photo_name = $(this).attr("name");
        one_photo_id = robot_id;
        // answer_cols = ["q" + robot_id + "_1"]
        if ($(this).hasClass("col-6")) {
            answer_cols = Object.assign([], answer_cols_org);
            $("#robot_sp").text("ROBOT");
            $("#robot_sp").removeClass("animated_text");
            $("#robot_hr").removeClass("robot_hr");
            $("div[name='" + one_photo_name + "']").removeClass("col-6");
            $("div[name='" + one_photo_name + "']").addClass("col-1");
            $("div[name='" + one_photo_name + "']").removeClass("align-self-center");
            $("div[name='" + one_photo_name + "']").removeClass("h-100");
            $("div[name='" + one_photo_name + "'] img").removeClass("img-fluid-2");
            $("div[name='" + one_photo_name + "'] img").addClass("img-fluid-1");
            one_photo_name = "";
            selection_of_data("", [], true);
            return;
        } else {
            answer_cols = ["q" + robot_id + "_1"]
            $('.robot-photo-columns').hide();
            $("div[robot_id='" + robot_id + "'] img").addClass("img-fluid-2");
            $("div[robot_id='" + robot_id + "'] img").removeClass("img-fluid-1");
            $("div[robot_id='" + robot_id + "']").removeClass("col-1");
            $("div[robot_id='" + robot_id + "']").addClass("col-6");
            $("div[robot_id='" + robot_id + "']").addClass("align-self-center");
            $("div[robot_id='" + robot_id + "']").addClass("h-100");
            $("#robot_sp").text("ROBOT " + $(this).attr("name").toUpperCase());
            $("#robot_sp").addClass("animated_text");
            $("#robot_hr").addClass("robot_hr");
            $(this).show();
            selection_of_data("", robot_id, true);
            return;
        }

    }
    $(".robot-photo-columns").on("click", image_click);

    /**
     * Modifies the data and charts based on the provided column and values.
     * @param {string} column - The column to filter the data and charts.
     * @param {Array} values - The values to filter the data and charts.
     * @param {boolean} [del=false] - Indicates whether to delete the selection for the given column.
     */
    function selection_of_data(column, values, del = false) {
        let ndata = Object.assign([], data);
        let ndane = Object.assign([], dane);

        let dane_cols = [
            "ff", "bm", "sl", "hls"
        ]

        if (one_photo_name) {

            ndane = ndane.filter(function (d) {
                return d.robot_id == one_photo_id;
            });

        } else {
            answer_cols = Object.assign([], answer_cols_org);
        }
        let data_cols = [
            "M1", "M2", "M3", "M4"
        ]

        let violin_cols = [
            "M2", "ff", "bm", "sl", "hls"
        ]

        if (violin_cols.includes(column)) {
            let new_values = [];
            for (let i in values) {
                new_values.push(values[i].key);
            }
            values = new_values;
        }
        console.log(selection)
        if (column) {
            if (del) {
                delete selection[column];
            } else {
                selection[column] = values;
            }
        }
        console.log(selection)

        // for each key value in selection

        for (let key in selection) {
            // if the key is in data_cols
            if (dane_cols.includes(key) && one_photo_name) {
                continue;
            }

            if (data_cols.includes(key)) {
                // filter the data

                ndata = ndata.filter(function (d) {
                    return selection[key].includes(d[key]);
                });


            } else if (dane_cols.includes(key)) {
                // filter the dane
                ndane = ndane.filter(function (d) {
                    return selection[key].includes(d[key]);
                });
                robots_that_stay = [];
                for (let i in ndane) {
                    robots_that_stay.push(ndane[i].robot_id);
                }

                answer_cols = [];
                for (let i in robots_that_stay) {
                    answer_cols.push("q" + robots_that_stay[i] + "_1");
                }
            } else {

            }
        }
        // clear the charts
        $("#chart-container").empty();
        $("#chart-container1").empty();
        $("#chart-container2").empty();
        $("#chart-container3").empty();
        $("#violin-1").empty();
        $("#violin-2").empty();
        $("#violin-3").empty();
        $("#violin-4").empty();
        $("#answers").empty();

        let left_side_height = $("#chart-container").height();
        let left_side_width = $("#chart-container").width();

        // draw the charts with the new data
        draw_doughnut("#chart-container", ndata, "M1", left_side_height, left_side_width, "M1" in selection);
        draw_violin("#chart-container1", ndata, "M2", "M2" in selection);
        draw_doughnut("#chart-container2", ndata, "M3", left_side_height, left_side_width, "M3" in selection);
        draw_doughnut("#chart-container3", ndata, "M4", left_side_height, left_side_width, "M4" in selection);
        drawYDoughnut("#answers", ndata, "q1_1");
        draw_violin("#violin-1", ndane, "ff", "ff" in selection);
        draw_violin("#violin-2", ndane, "bm", "bm" in selection);
        draw_violin("#violin-3", ndane, "sl", "sl" in selection);
        draw_violin("#violin-4", ndane, "hls", "hls" in selection);
        reduce_robots_img(ndane);
        $("#respondents").text("RESPONDENTS (" + ndata.length + ")");
        if (one_photo_name) {
            $("#robot_sp").text("ROBOT " + one_photo_name.toUpperCase());
        } else {
            $("#robot_sp").text("ROBOTS (" + ndane.length + ")");
        }
    }


    /**
     * Draws all the charts on the page.
     */
    function drawAllCharts() {
        let left_side_height = $("#chart-container").height();
        let left_side_width = $("#chart-container").width();

        draw_doughnut("#chart-container", data, "M1", left_side_height, left_side_width);
        draw_violin("#chart-container1", data, "M2");
        draw_doughnut("#chart-container2", data, "M3", left_side_height, left_side_width);
        draw_doughnut("#chart-container3", data, "M4", left_side_height, left_side_width);
        drawYDoughnut("#answers", data, "q1_1");
        $("#respondents").text("RESPONDENTS (" + data.length + ")");
    }

    /**
     * Converts data into a format suitable for a chart.
     * @param {Array} data - The input data array.
     * @param {string} column - The column name to extract from each data object.
     * @returns {Array} - The converted data array with key-value pairs.
     */
    function data_for_chart(data, column) {
        let d_column = [];
        data.forEach(function (d) {
            d_column.push(d[column]);
        });
        let count = d_column.reduce(function (value, value2) {
            return (
                value[value2] ? ++value[value2] : (value[value2] = 1),
                value
            );
        }, {});
        new_d = [];
        //count is a dictionary
        for (let key in count) {
            new_d.push({ key: parseFloat(key), value: count[key] });
        }
        return new_d;
    }

    /**
     * Generates chart data based on the input data.
     * @param {Array} data - The input data.
     * @returns {Array} - The chart data.
     */
    function answers_for_chart(data) {
        let d_column = [];
        data.forEach(function (d) {
            answer_cols.forEach(function (col) {
                d_column.push(d[col]);
            });
        });
        let count = d_column.reduce(function (value, value2) {
            return (
                value[value2] ? ++value[value2] : (value[value2] = 1),
                value
            );
        }, {});
        new_d = [];
        //count is a dictionary
        for (let key in count) {
            new_d.push({ key: parseInt(key), value: count[key] });
        }
        return new_d;
    }

    /**
     * Updates the window by calling the selection_of_data function, removing SVG elements, and positioning modal elements if necessary.
     */
    function updateWindow() {
        selection_of_data("", []);
        $(".modall svg").remove();
        if ($(".modall").css("display") == "block") {
            position_of_modal_elements();
        }
    }

    /**
     * Positions the modal elements on the page.
     */
    function position_of_modal_elements() {
        let reset_btn = $("#reset");
        let reset_x_left = reset_btn.offset().left + reset_btn.width() + 25;
        let reset_y_top = reset_btn.offset().top + reset_btn.height() / 3;
        $(".m_reset_filters").css("left", reset_x_left);
        $(".m_reset_filters").css("top", reset_y_top);
        let robot_photos = $("#robot_photos");
        let robot_photos_x_left = robot_photos.offset().left;
        let robot_photos_y_top = robot_photos.offset().top - 30;
        $(".m_click_robot").css("left", robot_photos_x_left);
        $(".m_click_robot").css("top", robot_photos_y_top);
        let close = $("#statistics");
        let close_x_left = close.offset().left + close.width() - $("#close").css("font-size") / 2;
        let close_y_top = close.offset().top - $("#close").css("font-size") / 2;
        $("#close").css("left", close_x_left);
        $("#close").css("top", close_y_top);
        let viewBox = [
            0,
            0,
            $("#rob").offset().left - $("#resp").offset().left + $("#rob").width(),
            $("#statistics").height()
        ]
        let svg = d3.select(".modall").append("svg")
            .attr("width", viewBox[2])
            .attr("height", viewBox[3])
            .style("position", "absolute")
            .style("left", $("#resp").offset().left)
            .style("top", $("#resp").offset().top);

        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", viewBox[2])
            .attr("height", viewBox[3])
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", "5px")
            .attr("stroke-dasharray", "5,5");
        let interactive = $(".modall svg");
        let interactive_x_left = parseFloat(interactive.css("left").replace("px", "")) + 10;
        let interactive_y_top = parseFloat(interactive.css("top").replace("px", "")) + 10;
        console.log(interactive_x_left);
        console.log(interactive_y_top);
        $(".m_interactive_statistics").css("left", interactive_x_left);
        $(".m_interactive_statistics").css("top", interactive_y_top);
        $(".m_interactive_statistics").css("width", viewBox[2] - 20);
        viewBox = [
            0,
            0,
            $("#ann").width(),
            $("#statistics").height()
        ]

        svg = d3.select(".modall").append("svg")
            .attr("width", viewBox[2])
            .attr("height", viewBox[3])
            .style("position", "absolute")
            .style("left", $("#ann").offset().left)
            .style("top", $("#ann").offset().top);

        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", viewBox[2])
            .attr("height", viewBox[3])
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", "5px")
            .attr("stroke-dasharray", "5,5");

        let tooltip = $(".modall svg:last-child");
        let tooltip_x_left = parseFloat(tooltip.css("left").replace("px", "")) + 10;
        let tooltip_y_top = parseFloat(tooltip.css("top").replace("px", "")) + 10;
        console.log(tooltip_x_left);
        console.log(tooltip_y_top);
        $(".m_tooltip").css("left", tooltip_x_left);
        $(".m_tooltip").css("top", tooltip_y_top);
        $(".m_tooltip").css("width", viewBox[2] - 20);
    }

    /**
     * Function that handles the click event to show a modal with instructions on how to use the app.
     */
    function how_to_click() {
        // show modal with how to use the app
        $(".about").hide();
        console.log("clicked");
        position_of_modal_elements();
        $(".modall").show();

    }

    /**
     * Hides the modal for "how to" section.
     */
    function cancel_how_to() {
        $(".modall").hide()
    }

    /**
     * Hides the element with class "about".
     */
    function cancel_about() {
        $(".about").hide()
    }

    /**
     * Handles the click event for the "about" button.
     * Hides the ".modall" element, calculates the width and left position of the "#statistics" element,
     * and sets the left position and width of the ".about-text" element accordingly.
     * Finally, shows the ".about" element.
     */
    function about_click() {
        $(".modall").hide();
        let stats = $("#statistics");
        let width = stats.width() / 2;
        let left = stats.offset().left + width;
        console.log(left, width)
        $(".about-text").css("left", left);
        $(".about-text").css("width", width);

        $(".about").show()
    }

    $("#close").on("click", cancel_how_to)
    $("#how_to").on("click", how_to_click);
    $("#about").on("click", about_click);
    $("#close_about").on("click", cancel_about);
    $.ajax({
        url: '/robots/get_results_data/',
        type: 'GET',
        dataType: 'json',
        success: function (dane) {
            data = dane;
            drawAllCharts();
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });

    $.ajax({
        url: '/robots/get_robot_data/',
        type: 'GET',
        dataType: 'json',
        success: function (e) {
            dane = e;
            height = $("#violin-1").height();
            width = $("#violin-1").width();
            draw_violin("#violin-1", dane, "ff");
            draw_violin("#violin-2", dane, "bm");
            draw_violin("#violin-3", dane, "sl");
            draw_violin("#violin-4", dane, "hls");
            $("#robot_sp").text("ROBOTS (" + dane.length + ")");
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });

    d3.select(window).on('resize.updatesvg', updateWindow);
});