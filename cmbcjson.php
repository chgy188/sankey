<?php
	//error_reporting(0);
	$year = $_REQUEST['year'];
	$month = $_REQUEST['month'];
	$organ = $_REQUEST['organ'];
	$party = $_REQUEST['party'];
	//echo $year."-".$month;
	 if ($month=="all"){$months="";}else{$months=" and tx_month='".$month."' ";}
     if ($organ=="all"){$organs="";$organ="全行";}else{$organs=" and tx_organ='".$organ."' ";}
	 if ($party=="all"){$partys="";}else{$partys=" and tx_party='".$party."' ";}
	include 'mysqlconn.php';
	$rs = @mysql_query('SET NAMES UTF8');
	$rs = mysql_query("select tx_dc,tx_kind,tx_bank,sum(tx_sum) from tx.tx_acct where tx_year='$year' ".$months.$organs.$partys." group by 1,2,3 order by 1,2,4 desc;");
	// echo "select tx_dc,tx_kind,tx_bank,sum(tx_sum) from tx.tx_acct where tx_year='$year' ".$months.$organs.$partys." group by 1,2,3 order by 1,2,4;";
	//判断是否查询成功
	$num=mysql_num_rows($rs);
	if($num>0){
    //建最外层对象
	$data=new StdClass;
	//建立两个属性数组
	$nodes = array();
	$links = array();
	//建类型，位置，汇总
	$kind_d='';$pos_d=0;$sum_d=0;
	$kind_c='';$pos_c=0;$sum_c=0;
	//建立name,connect对象
	$name=new StdClass;
	$connect=new StdClass;
	if($party=="I"){$name->name="中国民生银行"."($organ-零售)";}
	elseif($party=="C"){$name->name="中国民生银行"."($organ-对公)";}
		else{$name->name="中国民生银行"."($organ-汇总)";}
	//$name->name="中国民生银行"."($organ-)";
	array_push($nodes, $name);
	$count=0;
	//取一行数据
	while($row = mysql_fetch_row($rs)){
		
       //如果是贷出
			if ($row[0]=='D'){
				if($row[1]==$kind_d){
				//累加同类数据
				$name=new StdClass;
				$sum_d+=floatval($row[3]);
				$name->name=$row[2];//加bank节点
			    array_push($nodes, $name);$count+=1;
				//加新bank进links
				$connect=new StdClass;
				$connect->source=$pos_d;$connect->target=$count;$connect->value=floatval($row[3]);
				array_push($links, $connect);
				}
				else{
				//初始化
				  if ($kind_d==''){
				      if($count>0){//C类型last汇总加入连接
					   $connect=new StdClass;
						$connect->source=$pos_c;$connect->target=0;$connect->value=floatval($sum_c);
						array_push($links, $connect);
						}
					  //加入kind节点
					  $name=new StdClass;
					  $name->name=$row[1];
					   array_push($nodes, $name); $count+=1;
					   //记录类型，位置，汇总
					  $kind_d=$row[1];$pos_d=$count;$sum_d=floatval($row[3]);
					  // 加入bank节点
					   $name=new StdClass;
					  $name->name=$row[2];
					   array_push($nodes, $name);  $count+=1;
					 
					   //插入一个连接
					   $connect=new StdClass;
				$connect->source=$count-1;$connect->target=$count;$connect->value=floatval($row[3]);
						array_push($links, $connect);
					  }
				  else{
				      
					   //类型汇总加入连接
					   $connect=new StdClass;
						$connect->source=0;$connect->target=$pos_d;$connect->value=floatval($sum_d);
						array_push($links, $connect);
					  
					  //加入kind节点
					  $name=new StdClass;
					  $name->name=$row[1];
					   array_push($nodes, $name);$count+=1;
					   //new kind process
						$kind_d=$row[1];$pos_d=$count;$sum_d=floatval($row[3]);
						//加入BANK节点
					   $name=new StdClass;
					   $name->name=$row[2];
					   array_push($nodes, $name);$count+=1;
					   //插入一个连接
					   $connect=new StdClass;
				$connect->source=$count-1;$connect->target=$count;$connect->value=floatval($row[3]);
						array_push($links, $connect);
					  }
				}
			}
			else //借入
				{
				//---
				if($row[1]==$kind_c){
				//累加同类数据
				$sum_c+=floatval($row[3]);
				$name=new StdClass;
				$name->name=$row[2];//加bank节点
			    array_push($nodes, $name);$count=$count+1;

				//加新bank进links
				$connect=new StdClass;
				$connect->source=$count;$connect->target=$pos_c;$connect->value=floatval($row[3]);
				array_push($links, $connect);
				}
				else{
				//初始化
				  if ($kind_c==''){
				      
					  //加入KIND节点
					  $name=new StdClass;
					  $name->name=$row[1];
					   array_push($nodes, $name);$count+=1;
					   //类型，位置，汇总赋值
					  $kind_c=$row[1];$pos_c=$count;$sum_c=floatval($row[3]);
						//加入BANK节点
					   $name=new StdClass;
					   $name->name=$row[2];
					   array_push($nodes, $name);$count+=1;
					   
					   //插入一个连接
					   $connect=new StdClass;
				$connect->source=$count;$connect->target=$count-1;$connect->value=floatval($row[3]);
						array_push($links, $connect);
					  }
				  else{
				      
					   //类型汇总加入连接
					   $connect=new StdClass;
						$connect->source=$pos_c;$connect->target=0;$connect->value=floatval($sum_c);
						array_push($links, $connect);
					  //new kind process
						$kind_c=$row[1];$pos_c=$count;$sum_c=floatval($row[3]);
					  //加入KIND节点
					  $name=new StdClass;
					  $name->name=$row[1];
					   array_push($nodes, $name);$count+=1;
					   //new kind process
						$kind_c=$row[1];$pos_c=$count;$sum_c=floatval($row[3]);
						//加入BANK节点
					   $name=new StdClass;
					   $name->name=$row[2];
					   array_push($nodes, $name);$count+=1;
					   //插入一个连接
					   $connect=new StdClass;
				$connect->source=$count;$connect->target=$count-1;$connect->value=floatval($row[3]);
						array_push($links, $connect);
					  }
				}
				//---
				}//big else
		
	}
						//D类型last汇总加入连接
						$connect=new StdClass;
						$connect->source=0;$connect->target=$pos_d;$connect->value=floatval($sum_d);
						array_push($links, $connect);
    //cash query
	$rs = mysql_query("select tx_dc,sum(tx_sum) from tx.tx_cash where tx_year='$year' ".$months.$organs.$partys." group by 1 order by 1,2;");
	
	//判断是否有数
	$num=mysql_num_rows($rs);
	if($num>0){
			while($row = mysql_fetch_row($rs)){
			if($row[0]=="C"){
			           $name=new StdClass;
					   $name->name="现金存入";
					   array_push($nodes, $name);$count+=1;
					   $connect=new StdClass;
						$connect->source=$count;$connect->target=0;$connect->value=floatval($row[1]);
						array_push($links, $connect);}
			else{$name=new StdClass;
					   $name->name="取现";
					   array_push($nodes, $name);$count+=1;
					   $connect=new StdClass;
						$connect->source=0;$connect->target=$count;$connect->value=floatval($row[1]);
						array_push($links, $connect);}
			
			}		
	}

	 //no opp query
	 $rs = mysql_query("select tx_dc,sum(tx_sum) from tx.tx_nopp where tx_year='$year' ".$months.$organs.$partys." group by 1 order by 1,2;");
	
	//判断是否有数
	$num=mysql_num_rows($rs);
	if($num>0){
			while($row = mysql_fetch_row($rs)){
			if($row[0]=="C"){
			           $name=new StdClass;
					   $name->name="POS收款等";
					   array_push($nodes, $name);$count+=1;
					   $connect=new StdClass;
						$connect->source=$count;$connect->target=0;$connect->value=floatval($row[1]);
						array_push($links, $connect);}
			else{$name=new StdClass;
					   $name->name="消费缴费";
					   array_push($nodes, $name);$count+=1;
					   $connect=new StdClass;
						$connect->source=0;$connect->target=$count;$connect->value=floatval($row[1]);
						array_push($links, $connect);}
			
			}		
	}
     //encap json
	 mysql_close($conn);
	$data->nodes=$nodes;
	$data->links=$links;
	echo json_encode($data);

	}
?>