var php_para;
//var start=exec();
$(document).ready(function ()
{
//cookie
/*var userId = _getCookie();
alert(userId);
try{
			doCookieLoginOA("guoyong","AjExMDAgAA5wb3J0YWw6Z3VveW9uZ4gAE2Jhc2ljYXV0aGVudGljYXRpb24BAAdHVU9ZT05HAgADMDAwAwADRVBQBAAMMjAxNjA2MjcwNzAxBQAEAAAADAoAB0dVT1lPTkf%2FAPcwgfQGCSqGSIb3DQEHAqCB5jCB4wIBATELMAkGBSsOAwIaBQAwCwYJKoZIhvcNAQcBMYHDMIHAAgEBMBYwDjEMMAoGA1UEAxMDRVBQAgRJ8qc9MAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNjA2MjcwNzAxMTVaMCMGCSqGSIb3DQEJBDEWBBTK9JkIN%2FWym39gEK%2FJ4MgS0IDvXjAJBgcqhkjOOAQDBC4wLAIUJcW6aJj91U2HVUUEsOzkXclNhe4CFHWx%2FFVC1JEFxtERnc4qWbAl0!0w");  
		}catch(e){}
*/
var loginflag=0;
			var strCookie=document.cookie; 
			var arrCookie=strCookie.split(";"); 
			
			for(var i=0;i<arrCookie.length;i++)
				{
					var arr=arrCookie[i].split("="); 
					
					if (arr[0]==" MYSAPSSO2" || arr[0]=="MYSAPSSO2")
					{ 
					loginflag=1;userid="OAUSER";
					break; 
					}
				} 
			for(var i=0;i<arrCookie.length;i++)
				{ 
					var arr=arrCookie[i].split("="); 
					if (arr[0]==" edw_ws_useroperid" || arr[0]=="edw_ws_useroperid" || arr[0]=="SignOnDefault")
					{ 
					loginflag=1;userid=arr[1];
					break; 
     				 } 
				} 
	         if (loginflag==0){//$("#swf").hide("fast");$("#swf").show("fast");
			    $(".button").hide();
				$("#control").hide();
				alert("请先登陆OA/数据仓库门户!");
			  }
			  else{
			  d3.json("http://edwhv199.cmbc.com.cn/sankey/visitsankey.php?userid="+userid
				  ,function(error,data){exec();});
			    
			      }
//cookie end
$('#cmonth').hide();
$('#x').change(function(){
var selectx=$(this).val();

$("select").show();
$('#c'+selectx).hide();

});
});
function doCookieLoginOA(userId,cookieStr){   
		try{
			alert(cookieStr);
			var rlst;
			//cookie单点登录这里固定传整数“2”;
			try{
				rlst = com.SD_TicketSSOLogin(2,userId,cookieStr); 
			}catch (err){
				rlst = com.SD_TicketSSOLogin(2,userId); 
			};
			if( rlst!=0 ){//成功返回0,非0值失败
				alert("登录失败，详细:"+com.GetLastError());
				return false;
			}
			alert("消息发送成功！");
			return true;
		} catch(e){
			alert("请先安装安全文档！");
			return false;
		}
	}
function _getCookie(){
		if(document.cookie.length>0){
			startIndex = document.cookie.indexOf("COOKIE_PORTAL_LOGON_USER_ID=");
			if(startIndex != -1){
				startIndex = startIndex+"COOKIE_PORTAL_LOGON_USER_ID=".length;
				endIndex = document.cookie.indexOf(";",startIndex);
				if(endIndex == -1){
					endIndex = document.cookie.length;
				}
				return unescape(document.cookie.substring(startIndex,endIndex));
			}
		}
		return "";
	}

function column(){
d3.select("svg").remove();
var x = d3.select('#x').node().value;
var year = d3.select('#cyear').node().value;
var month = d3.select('#cmonth').node().value;
var party = d3.select('#cparty').node().value;
var organ = d3.select('#corgan').node().value;
//alert(x);
var url="http://edwhv199.cmbc.com.cn/sankey/cjson.php?year="+year+"&month="+month+"&party="+party+"&organ="+organ;
url=url.replace(x,"");
//alert(url);
d3.json(url,function(error,data){
	if(!data){alert("无数据!");return;}
	var xarray=data.name; 
	var credit=data.credit;
	var debit=data.debit;
	//画布大小
	var width = 1200;
	var height = 480;

	//在 body 里添加一个 SVG 画布	
	var svg = d3.select("#chart")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	//画布周边的空白
	var padding = {left:100, right:30, top:100, bottom:20};

	//定义一个数组
	//var dataset = [10, 20, 30, 40, 33, 24, 12, 5];
		
	//x轴的比例尺
	var xScale = d3.scale.ordinal()
		.domain(d3.range(xarray.length))
		.rangeRoundBands([0, width - padding.left - padding.right]);

	//y轴的比例尺
	//var maxv=[d3.max(credit),d3.max(credit)];
	var yScale = d3.scale.linear()
		.domain([0,d3.max(credit)])
		.range([height - padding.top - padding.bottom, 0]);

	//定义x轴
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickFormat(function(d,i) {return ""});
		
	//定义y轴
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");


	//矩形之间的空白
	var rectPadding = 2;

	//添加矩形元素
	var rects = svg.selectAll(".MyRect")
		.data(credit)
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return xScale(i) + rectPadding/2;
		} )
		.attr("y",function(d){
			return yScale(d);
		})
		.attr("width", xScale.rangeBand() - rectPadding )
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d);
		});

		var rects = svg.selectAll(".MyDRect")
		.data(debit)
		.enter()
		.append("rect")
		.attr("class","MyDRect")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return xScale(i) + rectPadding/2;
		} )
		.attr("y",function(d){
			return yScale(d);
		})
		.attr("width", xScale.rangeBand() - rectPadding )
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d);
		});

	//添加文字元素
	var texts = svg.selectAll(".MyText")
		.data(xarray)
		.enter()
		.append("text")
		.attr("class","MyText")
		
		//.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return  padding.left +xScale(i) + rectPadding/2;
		} )
		.attr("y",function(d,i){
			return height-padding.bottom;
		})
		.attr("dx",function(){
			return (xScale.rangeBand() - rectPadding)/2;
		})
		.attr("dy",function(d){
			return 20;
		})
		
		.attr("transform","rotate(315)")
		.attr("transform",function(d,i){
			return "rotate(270 "+(padding.left +xScale(i) + rectPadding/2)+","+(height - padding.bottom)+")";
		    })
		.text(function(d){
				//if(d=="C"){d="对公交易"} else{if(d=="I") {d="零售交易"}else{d="无标志"}}
			switch (d)
			{
			case "C":
			d="对公交易"
			break;
			case "I":
			d="零售交易"
			break;
			case "":
			d="无标志"
			break;
			}
			return d;
		});
		

	//添加x轴
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
		.call(xAxis); 
		
	//添加y轴
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.call(yAxis);
    
	svg.append("rect")
		.attr("class","MyRect")
		.attr("x", width-135)
		.attr("y", 5)
		.attr("width", 40 )
		.attr("height", 20);
	svg.append("text")
		.attr("x", width-65)
		.attr("y", 23)
		.attr("class","MyText")
		.text("转入");

     svg.append("rect")
		.attr("class","MyDRect")
		.attr("x", width-135)
		.attr("y", 40)
		.attr("width", 40 )
		.attr("height", 20);
	svg.append("text")
		.attr("x", width-65)
		.attr("y", 58)
		.attr("dx",0)
		.attr("dy",0)
		.attr("class","MyText")
		.text("转出");

   });
}
//---------------------------------------------------------------------------------------
function exec(){
d3.select("svg").remove();
var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 1260 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " 亿元"; },
    color = d3.scale.category20();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

var year = d3.select('#year').node().value;
var month = d3.select('#month').node().value;
var party = d3.select('#party').node().value;
var organ = d3.select('#organ').node().value;
var jasonurl="http://edwhv199.cmbc.com.cn/sankey/cmbcjson.php?year="+year+"&month="+month+"&organ="+organ+"&party="+party;
//alert(jasonurl);
d3.json(jasonurl, function(cmbc) {

  if(!cmbc){alert("无数据!");return;}
  sankey
      .nodes(cmbc.nodes)
      .links(cmbc.links)
      .layout(32);

  var link = svg.append("g").selectAll(".link")
      .data(cmbc.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  var node = svg.append("g").selectAll(".node")
      .data(cmbc.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
});
}
