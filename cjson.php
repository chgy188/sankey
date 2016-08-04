<?php
	error_reporting(0);
	//$x = $_REQUEST['x'];
	$year = $_REQUEST['year'];
	$month = $_REQUEST['month'];
	$organ = $_REQUEST['organ'];
	$party = $_REQUEST['party'];
	
	//echo $year."-".$month;
	
  //echo "$year-$month-$organ-$party";
	 switch (1)
{
//case $x=='year':
case !isset($year):
	$select="tx_year,tx_dc,sum(tx_sum)";
    if ($month=="all" and $organ=="all" and $party=="all"){$where=" group by 1,2 order by 1,2";}
	else{
		if ($month=="all"){$month="";}else{$month="and tx_month='".$month."' ";}
		if ($organ=="all"){$organ="";}else{$organ="and tx_organ='".$organ."' ";}
		if ($party=="all"){$party="";}else{$party="and tx_party='".$party."' ";}
		$where=$month.$organ.$party;
		$where=substr($where,3);
		$where=" where ".$where." group by 1,2 order by 1,2";
		}
	break;
//case $x=='month':
case !isset($month):
	$select="tx_month,tx_dc,sum(tx_sum)";
	$year=" where tx_year='".$year."' ";
    
		
	if ($organ=="all"){$organ="";}else{$organ="and tx_organ='".$organ."' ";}
	if ($party=="all"){$party="";}else{$party="and tx_party='".$party."' ";}
		
	$where=$year.$organ.$party." group by 1,2 order by 1,2";
	break;
//case $x=='organ':
case !isset($organ):
	$select="tx_organ,tx_dc,sum(tx_sum)";
	$year=" where tx_year='".$year."' ";
    
		
	if ($month=="all"){$month="";}else{$month="and tx_organ='".$month."' ";}
	if ($party=="all"){$party="";}else{$party="and tx_party='".$party."' ";}
		
	$where=$year.$month.$party." group by 1,2 order by 2,3 desc";
	break;
default:
	$select="tx_party,tx_dc,sum(tx_sum)";
	$year=" where tx_year='".$year."' ";
    
		
	if ($month=="all"){$month="";}else{$month="and tx_organ='".$month."' ";}
	if ($organ=="all"){$organ="";}else{$organ="and tx_party='".$organ."' ";}
		
	$where=$year.$month.$organ." group by 1,2 order by 1,2";
	break;
}
    //echo $where;
    $sql="select ".$select." from tx.tx_acct".$where;
	$sqlcash="select ".$select." from tx.tx_acct".$where;
    $sqlnopp="select ".$select." from tx.tx_nopp".$where;
    //echo $sql."\n";
	include 'mysqlconn.php';
	$rs = @mysql_query('SET NAMES UTF8');
	$rs = mysql_query($sql);
	
	//判断是否查询成功
	$num=mysql_num_rows($rs);
	if($num>0){ 
    //建最外层对象
	$data=new StdClass;
	//建立两个属性数组
	$x_x = array();
	$credit = array();
	$debit = array();
	
	while($row = mysql_fetch_row($rs)){
		
       //如果是贷出
			if ($row[1]=='D'){
				
			    array_push($x_x, $row[0]);
				array_push($debit, floatval($row[2]));
				}
				else{
				//贷credit
				  array_push($credit, floatval($row[2]));
				}
	}
    //cash query
//	$rs = mysql_query($sqlcash);
//	
//	//判断是否有数
//	$num=mysql_num_rows($rs);
//	$count=0;
//	if($num>0){
//			while($row = mysql_fetch_row($rs)){echo "count:$count--num:$num";
//			if($row[1]=="D"){$out[$count]=$out[$count]+$row[2];$count+=1;if($count==$num/2){$count=0;}}
//			else{$credit[$count]=$credit[$count]+$row[2];$count+=1;if($count==$num/2){$count=0;}}
//			}		
//	}
//
//	 //no opp query
//	 $rs = mysql_query($sqlnopp);
//	
//	//判断是否有数
//	$num=mysql_num_rows($rs);
//	$count=0;
//	if($num>0){
//			while($row = mysql_fetch_row($rs)){
//			if($row[1]=="D"){$out[$count]=$out[$count]+$row[2];$count+=1;}
//			else{$credit[$count]=$credit[$count]+$row[2];$count+=1;}
//			}		
//	}
     //encap json
	 mysql_close($conn);
	
//				$arrlength=count($x_x);
//
//				for($x=0;$x<$arrlength;$x++)
//				{
//				echo $x_x[$x];
//				echo "<br>";
//				}
	$data->name=$x_x;
	$data->credit=$credit;
	$data->debit=$debit;
	echo json_encode($data);

	}
	else{echo "error";}
?>