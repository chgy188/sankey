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


//---------------------------------------------------------------------------------------
function exec(){
d3.select("svg").remove();
var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " 人"; },
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

var organ = d3.select('#organ').node().value;
var time = d3.select('#time').node().value;
var grade = d3.select('#class').node().value;
var jasonurl="http://edwhv199.cmbc.com.cn/sankey/customjson.php?organ="+organ+"&neworold="+time+"&class="+grade;
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
