<?php
	//error_reporting(0);
	
	$organ = $_REQUEST['organ'];
    $neworold= $_REQUEST['neworold'];
    $class = $_REQUEST['class'];
	
	//echo $year."-".$month;
	if ($organ=="all" && $class=="all") {$where="";}
else
{
     if ($organ=="all"){
         if ($neworold=="all"){ $where=" where new_class='$class' or old_class= '$class'";}
      else{$where=" where ".$neworold."_class='$class' ";}
     }
    else
     {  if ($neworold=="all"){ 
                if ($class=="all"){$where=" where org_name = '$organ'";}
               else {$where=" where org_name = '$organ' and (new_class='$class' or old_class= '$class')";}
                                       }
      else{
             if ($class=="all"){$where=" where org_name = '$organ'";}
             else{$where=" WHERE org_name = '$organ' and ".$neworold."_class='$class' ";}
            }
     }
}
	 include 'mysqlconn.php';
     //echo "SELECT sum(cust_count),old_class,new_class FROM tx.custom_class	$organs	group by 2,3	ORDER BY old_class	desc;";

	$rs = @mysql_query('SET NAMES UTF8');
	$rs = mysql_query("SELECT sum(cust_count),old_class,new_class 
					FROM tx.custom_class	$where group by 2,3	ORDER BY old_class	desc;");
	//判断是否查询成功
 $oldindex=0;
    $newindex=0;
	$num=mysql_num_rows($rs);
	if($num>0){
    //建最外层对象
	$data=new StdClass;
	//建立两个属性数组
	$nodes = array();
	$links = array();
	$nodearray=array("私人银行客户","钻石级客户","金卡级客户","银卡级客户","有效客户","非零非有效客户","无评级");
    $arraylength=count($nodearray);
			for ($y=0;$y<2;$y++)
                {
				for($x=0;$x< $arraylength;$x++)
				{
					   $name=new StdClass;
					   $name->name=$nodearray[$x];//加bank节点
						array_push($nodes, $name);
                        }
						}
	
	//取一行数据
	while($row = mysql_fetch_row($rs)){
     //echo $row[0]."-".$row[1]."-".$row[2];
		
       //查数组返回序号
			for($x=0;$x<$arraylength;$x++)
				{  
					if ($row[1]==$nodearray[$x]){$oldindex=$x;}
					if ($row[2]==$nodearray[$x]){$newindex=$x+7;}
			
				}
					
				//echo "oldindex=$oldindex  newindex=$newindex";
				//加新bank进links
				$connect=new StdClass;
				$connect->source=$oldindex;$connect->target=$newindex;$connect->value=$row[0];
				array_push($links, $connect);

        }
		

	 
	
     //encap json
	 mysql_close($conn);
	$data->nodes=$nodes;
	$data->links=$links;
	echo json_encode($data);
}
	
?>