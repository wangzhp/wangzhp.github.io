
	
$(function() {
 
 $(function(){
  //显示当前时间
  initNowDate();
 
  //微博热闻
  //fetchHotNews("hotTopNews","weibo_event",15);
  //fetchHotNews("hotSearchNews","weibo_hot",4);
  //百度热搜
  fetchBaiDuHotNews();
  //知乎热问
  //fetchHotNews("hotZhiHuNews","zhihu_hot");
  //绑定拷贝事件
  bindCopyEvent()
  //加载微语
  initProverb()
 });
 
 function fetchBaiDuHotNews(){
	   $.ajax({
         type: "get",
         url: "https://api.vvhan.com/api/hotlist?type=baiduRD",
         dataType: "json",
         success: function(obj){
			  if(!obj||!obj.success){
				  alert("百度热搜拉取失败");
				  return;
			  }
			var hotSearchList=obj.data;
			console.log("百度热搜拉取成功，当前热榜总条数:"+hotSearchList.length);
	        $("#baiDuHotSearchNewsSyncTime").text("同步时间："+obj.update_time);
			var newsContent='';
			setHotTitle(hotSearchList);
		for(var i=0;i<20;i++){
		   var shortKey=hotSearchList[i].title.replace(/#/g,'');
		   var title="<span>"+shortKey+"</span> ";
		   var icon="<span style='color:#808080;'>"+hotSearchList[i].hot+"</span>";;
		   var titleDiv= getLinkLineNews((i+1)+"."+title,hotSearchList[i].url,hotSearchList[i].hot,icon,i);
		   var topicDiv='',picDiv='';
		  var topic=hotSearchList[i].desc;
		  if(topic){
			   picDiv="<div><img style='width:300px;height:200px;' src='"+hotSearchList[i].pic+"'/></div>"
		      topicDiv ="<div style='text-indent:2em;'>"+topic+"<br/><br/></div>"
		  }

		  newsContent=newsContent+titleDiv+picDiv+topicDiv;
				}
		$(".baiDuHotSearchNews").empty();
	    $(".baiDuHotSearchNews").append(newsContent);
	   }});
 }
 
 
 function getOneDate(date,sign1){
	
	  var year = date.getFullYear() // 年
	  var month = date.getMonth() + 1; // 月
	  var day  = date.getDate(); // 日
	  // 给一位数数据前面加 “0”
	  if (month >= 1 && month <= 9) {
	   month = "0" + month;
	  }
	  if (day >= 0 && day <= 9) {
	   day = "0" + day;
	  }
	 return year + sign1 + month + sign1 + day;
	 
 }
 
 function bindRefresh(){
         console.log('加载开始'); 
 for(var k=2;k>0;k--){
  var url='https://www.zhihu.com/api/v4/questions/308696075/answers?include=data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cattachment%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Cis_labeled%2Cpaid_info%2Cpaid_info_content%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%2Cis_recognized%3Bdata%5B*%5D.mark_infos%5B*%5D.url%3Bdata%5B*%5D.author.follower_count%2Cvip_info%2Cbadge%5B*%5D.topics%3Bdata%5B*%5D.settings.table_of_content.enabled&offset='+k+'&limit=20&sort_by=updated';
    
	//sleep(3000)
	$.ajax({ url: url,  type:"GET", success: function(data){
      console.log(data);
     var rData=data.data;
     if(rData!=null&&rData.length>0){
      for(var i=0;i<rData.length;i++){
		 // sleep(3000)
      var id= rData[i].id;
      var cUrl='https://www.zhihu.com/api/v4/answers/'+id+'/root_comments?limit=20&offset=1&order=normal&status=open';
       $.getJSON(cUrl, function(data){
        var cData=data.data;
          if(rData!=null&&rData.length>0){
       for(var j=0;j<cData.length;j++){
        var name=cData[j].author.member.name;
       console.log(name);
         if(name=='芊芊财会'){
          console.log('评论：'+cData[j].content+'地址：'+cData[j].url);
        }
      }
       }
        
       });
     }
     }
    },
             error: function(){
     console.log('fail');
                 alert('fail');
    }});
 }
 console.log('加载完毕');
 }
 
function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}
 
 function bindRrefreshArticle(){
	  $('.workbench .refreshArticle').bind('click',function(){
		  fetchWzryNews();
		   });
 }
 
 
 
 // 获取当前选项卡ID
function getCurrentTabId(callback)
{
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
 {
  if(callback) callback(tabs.length ? tabs[0].id: null);
 });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code)
{
 getCurrentTabId((tabId) =>
 {
  chrome.tabs.executeScript(tabId, {code: code});
 });
}


 function bindCopyTitle(){
 $('.workbench .copyTitle').bind('click',function(){
  var title= $(".article:visible").attr('title');
  if(!title){
   alert('未选择展示内容！');
   return false;
  }
 copyTitle(title);

 });
 }
 
 function bindCopyGameArticle(){
 $('.workbench .copyArticle').bind('click',function(){
 var node= $(".article:visible")[0];
 copyArticle(node);
 });
   }
 
 
  function bindShowGameArticle(){
 $('.gameTitle a').live('click',function(){
 $(this).css('color','red').parent().siblings('.gameTitle').find('a').css({'color':'rgb(72, 91, 247)'});
 var title=$(this).text();
 $(".article[title='"+title+"']").show().siblings('.article').hide();
 return false;
 });
 }
	 
	  function bindDeleteGameArticle(){
	 $('.gameTitle input').live('click',function(){
	  var a$= $(this).next();
	  var title=a$.text();
	  a$.parent().remove();
	  $(".article[title='"+title+"']").remove();
	 });
	  }
	   
	 

	 function copyTitle(hotTitle){
	  var input = document.createElement('input');
	  input.value = hotTitle;
	  input.style.position = 'fixed';
	  input.style.top = '-10vh';
	  input.style.left = '0';
	  document.body.appendChild(input)
	  input.select();
	  document.execCommand('copy');
	  document.body.removeChild(input);
	  alert('复制标题成功：'+hotTitle);
	 }

	 function copyArticle(node){
	 if(!node){
	  alert('未选择展示内容！');
	  }
	 if(!node.innerText){
	 alert('内容加载中，请稍等片刻！');
	 }
	 // Selection 对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。
	 var selection = window.getSelection();
	 range = document.createRange();
	 range.selectNodeContents(node); //使 Range 包含某个节点的内容。
	 selection.removeAllRanges(); //将所有的区域都从选区中移除。
	 selection.addRange(range); //一个区域（Range）对象将被加入选区。
	 document.execCommand('copy');
	 selection.removeAllRanges();
	 alert('文章复制成功！');
	}
	 
	function fetchHotNews(className,keyword,pageSize){
		  
	  $.getJSON("https://yiban.io/api/hot_search/record/list?platform="+keyword, function(data){
			  if(data&&data.success){
		var hotSearchList=data.hot_search_list;
		if(hotSearchList&&hotSearchList.length>0){
	  console.log(className+'当前拉取热榜总条数：'+hotSearchList.length);
	   updateSyncTime(className,data.update_at*1000);
		var newsContent="";
		for(var i=0;i<pageSize;i++){
		 var icon=getTipSpan('#ff3852','要闻');
		 var rank=hotSearchList[i].rank;
		 if('weibo_hot'==keyword){
		  //跳过广告
		  if('荐'==hotSearchList[i].icon){
		   continue;
		  }
		   icon=getIcon(hotSearchList[i].icon);
		    setHotTitle(hotSearchList);
		 }else if('zhihu_hot'==keyword){
			icon=getIcon(hotSearchList[i].trend);
		 }
	   var shortKey=hotSearchList[i].key.replace(/#/g,'');
	   var title="<span>"+shortKey+"</span> ";
	   var linkLineNews= getLinkLineNews(title,hotSearchList[i].url,hotSearchList[i].hot,icon,i);
	   newsContent=newsContent+linkLineNews;
	   //异步拉取新闻导语
	   syncAppendTopic(className,hotSearchList[i].key,i,keyword);
	  }
	  $("."+className+"").empty();
	  $("."+className+"").append(newsContent);
	   }
	  }
	  });
	}

	 var hotTitle='';
	function setHotTitle(hotSearchList){
	 hotTitle=getShortNowDate()+'热搜榜：';
	 for(var i=0;i<3;i++){
	  hotTitle=hotTitle+hotSearchList[i].title.replace(/#/g,'')+'；';
	 }
	   hotTitle=hotTitle.replace(/[；]$/,"");
	}

	function getLinkLineNews(title,url,hot,icon,rowIndex){
	 var newTitle ="<span class='titleSpan' >"+title+"</span>";
	 //var newTitle ="< a href='"+url+"' target='_blank' style='color:#0078b6'>"+title+"</ a>";
	// var newHot="<span type='color:#808080;'>"+hot+"       </span>";
		return "<div type='"+rowIndex+"'>"+newTitle+icon+"</div>";
	}

	function syncAppendTopic(className,topic,rowIndex,keyword){
	  if(keyword.indexOf('weibo')==-1){
	   return;
	  }
	   $.ajax({ url: "https://s.weibo.com/weibo?q="+encodeURIComponent(topic),  type:"GET", success: function(data){
	 var $topic= $(data).find(".card-topic-lead");
	 var $hotTopNews=$("."+className+" div[type='"+rowIndex+"']");
	 var style='text-indent:2em;';
	 if($topic.length>0){
	 $topic.find('strong').remove();//去掉导语title 
	 topic=$topic.text().replace('导语：','').replace('收起d','');
	 }else{
	  //如果没有导语，则取详情描述
	var  $feed_list_item= $(data).find("div[action-type='feed_list_item']:eq(0)");
	  var $desc=$feed_list_item.find("p[node-type='feed_list_content_full']");
	  if($desc.length>0){
        topic=$desc[0].innerText.replace('收起d','');
        console.log("feed_list_content_full:"+topic);
       }else{
         $desc=$feed_list_item.find("p[node-type='feed_list_content']");
         topic=$desc[0].innerText.replace('收起d','');
         console.log("feed_list_content:"+topic);
       }
	 }
	 $hotTopNews.after("<div style='"+style+"'>     "+topic+"<br/><br/></div>");
	  }});
	}

	function updateSyncTime(className,timeSpan){
	  $("#"+className+"SyncTime").text("同步时间："+formatDate(timeSpan));
	}

	function getIcon(icon){
	 var color='';
	 if('爆'==icon){
	  color= '#bd0000';
	 }
	 else if('沸'==icon){
	  color= '#f86400';
	 }
	   else if('热'==icon){
	  color= '#FF9812';
	 }
	 else if('新'==icon){
	  color= '#ff3852';
	 }
	 else{
	  return '';
	 }
	 icon=icon+'闻';
	return getTipSpan(color,icon);
	}

	function getTipSpan(color,desc){
	 return "<span style='color:"+color+";font-size:14px;'>"+desc+"</span>";
	}


	 function initNowDate() {
	  $('#nowDate').text(getFullNowDate('年','月','日'));
	 }
	 
	 
	 function getShortNowDate(){
		   var date = new Date();
	  var month = date.getMonth() + 1; // 月
	  var day  = date.getDate(); // 日
	 var currentdate=month+'月'+ day+'日';
	 return  currentdate;
	 }
	 
	 function getFullNowDate(sign1,sign2,sign3){
	  var date = new Date();
	  var year = date.getFullYear() // 年
	  var month = date.getMonth() + 1; // 月
	  var day  = date.getDate(); // 日
	  // 给一位数数据前面加 “0”
	  if (month >= 1 && month <= 9) {
	   month = "0" + month;
	  }
	  if (day >= 0 && day <= 9) {
	   day = "0" + day;
	  }
	 var currentdate= year + sign1 + month + sign2 + day+sign3;
	  var weekArr = ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	  var week = weekArr[new Date().getDay()];
	 return currentdate+ " "+ week;
	 }
	 
	 function getNowDate(sign1){
	  var date = new Date();
	  var year = date.getFullYear() // 年
	  var month = date.getMonth() + 1; // 月
	  var day  = date.getDate(); // 日
	  // 给一位数数据前面加 “0”
	  if (month >= 1 && month <= 9) {
	   month = "0" + month;
	  }
	  if (day >= 0 && day <= 9) {
	   day = "0" + day;
	  }
	 return year + sign1 + month + sign1 + day;
	 
	 }
	   
	 function formatDate(timeSpan){
	  var date = new Date(timeSpan);
	  var hour = date.getHours(); // 时
	  var minutes = date.getMinutes(); // 分
	  var seconds = date.getSeconds(); //秒
	  var sign1 = "-";
	   var sign2 = ":";
	   if (hour >= 0 && hour <= 9) {
	   hour = "0" + hour;
	  }
	  if (minutes >= 0 && minutes <= 9) {
	   minutes = "0" + minutes;
	  }
	  if (seconds >= 0 && seconds <= 9) {
	   seconds = "0" + seconds;
	  }
	 return hour + sign2 + minutes + sign2 + seconds;
	   }

	 function getNewsTopDesc(){
		  var desc='<div><span style="color: rgb(64, 118, 0);font-family: -apple-system, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-weight: 700;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);">每日微热榜：一份热搜榜，速览天下事<br/><br/>'+getFullNowDate('年','月','日')+'</span></div>';
	     return desc;
	 }  

	function copyTextRang(){
	$('.fullHotNews').append(getNewsTopDesc());
	//$('.fullHotNews').append($('.hotSearchNews').html());
	$('.fullHotNews').append($('.baiDuHotSearchNews').html());
	 $('.fullHotNews').append('<div>'+$('#proverb').html()+'</div>');
	// $('.fullHotNews').append('<span>'+appendGZHtml('欢迎关注获取更多热搜榜资讯')+'</span>');
	
	 var node=$('.fullHotNews')[0];
	 if(!node.innerText){
	 alert('内容加载中，请稍等片刻！');
	 }
	 // Selection 对象表示用户选择的文本范围或插入符号的当前位置。它代表页面中的文本选区，可能横跨多个元素。
	 var selection = window.getSelection();
	 range = document.createRange();
	 range.selectNodeContents(node); //使 Range 包含某个节点的内容。
	 selection.removeAllRanges(); //将所有的区域都从选区中移除。
	 selection.addRange(range); //一个区域（Range）对象将被加入选区。
	 document.execCommand('copy');
	 selection.removeAllRanges();
	$('.fullHotNews').empty();
	 alert('复制正文成功！');
	}

	function copyHotNewsTitle(){
	 copyTitle(hotTitle);
	}

	function bindCopyEvent(){
	 //复制正文
	 $("#copyTextBtn").bind('click',copyTextRang);
	 //复制标题
	 $("#copyTitleBtn").bind('click',copyHotNewsTitle);
	 
	  //移除
	 $("#HideTextBtn").bind('click',function(){
		 //先追加
		 $('.baiDuHotSearchNews').prepend(getNewsTopDesc());
		 $(".opDiv").remove();
	 });
	}
	
	function initProverb(){
	var proverbs=["地位越高，自我评价就越高，自信心多强，能力就有多强。我们总能表现出与环境的和谐平等。——赫兹里特", "发明家全靠一股了不起的信心支持，才有勇气在不可知的天地中前行。", "坚决的信心，能使平凡的人们，做出惊人的事业。——马尔顿", "千万别迷恋网络游戏，要玩就玩好人生这场大游戏。", "时间是治疗心灵创伤的大师，但绝不是解决问题的高手。", "自信和自负是有差别的，只是一字之差就是天壤之别。我特别希望我能够自信而不自负。——郭凡生", "人生是个圆，有的人走了一辈子也没有走出命运画出的圆圈，其实，圆上的每一个点都有一条腾飞的切线。", "如果我们都去做自己能力做得到的事，我们会让自己大吃一惊。", "出路出路，走出去了，总是会有路的。困难苦难，困在家里就是难。", "有信心的人，可以化渺小为伟大，化平庸为神奇。——萧伯纳", "具有博大胸襟的人，才有可能在心灵上潇洒；具有自信和实力的人，才有可能在外表上的潇洒。", "要有自信，然后全力以赴——假如具有这种观念，任何事情十之八九都能成功。——威尔逊", "两个人共尝一个痛苦只有半个痛苦，两个人共享一个欢乐却有两个欢乐。", "人须有自信之能力，当从自己良心上认定是非，不可以众人之是非为从违。——章太炎", "你把周围的人看作魔鬼，你就生活在地狱；你把周围的人看作天使，你就生活在天堂。", "人生是一条没有回程的单行线，上帝不会给你一张返程的票。", "如果你不给自己烦恼，别人也永远不可能给你烦恼，烦恼都是自己内心制造的。", "我所学到的任何有价值的知识都是由自学中得来的。——达尔文", "承担重任首先需要自信。", "人一生下就会哭，笑是后来才学会的。所以忧伤是一种低级的本能，而快乐是一种更高级的能力。", "困难是一块顽石，对于弱者它是绊脚石，对于强者它是垫脚石。", "除了人格以外，人生最大的损失，莫过于失掉自信心了。——培尔辛", "对待生活中的每一天若都像生命中的最后一天去对待，人生定会更精彩。", "我们总是对陌生人太客气，而对亲密的人太苛刻。", "行动是治愈恐惧的良药，而犹豫、拖延将不断滋养恐惧。", "活在昨天的人失去过去，活在明天的人失去未来，活在今天的人拥有过去和未来。", "对那些有自信心而不介意于暂时成败的人，没有所谓失败！对怀着百折不挠的坚定意志的人，没有所谓失败！对别…有所谓失败！对每次跌倒，而立刻站起来；每次坠地，反会像皮球一样跳得更高的人，没有所谓失败！——雨果", "过错是暂时的遗憾，而错过则是永远的遗憾！", "缺乏一种自信的精神，这往往导致一些本来是萌芽了的天才走向自我扼杀。——舒卓", "背负着过去的痛苦，夹杂着现实的烦恼，这对于人的心灵而言是无任何益处。", "请一定要有自信。你就是一道风景，没必要在别人风景里面仰视。——柯少爷", "放弃该放弃的是无奈，放弃不该放弃的是无能，不放弃该放弃的是无知，不放弃不该放弃的是执著！", "在真实的生命，每桩伟业都有信心开始，并由信心跨出第一步。——奥格斯特·冯史勒格", "天道酬勤。也许你付出了不一定得到回报，但不付出一定得不到回报。", "玉不琢、不成器，人不学、不知义。", "逆境是成长必经的过程，能勇于接受逆境的人，生命就会日渐的茁壮。", "做一个决定，并不难，难的是付诸行动，并且坚持到底。", "忍别人所不能忍的痛，吃别人所别人所不能吃的苦，是为了收获得不到的收获。", "学的到东西的事情是锻炼，学不到的是磨练。", "书是人类进步的阶梯。——高尔基", "学习永远不晚。——高尔基", "自信与自靠是坚强的柱石。", "读一切好书，就是和许多高尚的人谈话。——笛卡儿", "要是没有自信心，那实在糟糕！要是你不相信自己，或者怀疑自己，那是再糟也没有了。——契诃夫", "笑对人生，能穿透迷雾；笑对人生，能坚持到底；笑对人生，能化解危机；笑对人生，能照亮黑暗。", "无知者比有知者更自信。只有无知者才会自信地断言，科学永远不能解决任何问题。——达尔文", "要有自信，然后全力以赴--假如具有这种观念，任何事情十之八九都能成功。——威尔逊", "坚信自己的思想，相信自己心里认准的东西也一定适合于他人这就是天才。——爱默生", "人生最大的悲哀不是失去太多，而是计较太多，这也是导致一个人不快乐的重要原因。", "天生我材必有用。——李白", "书到用时方恨少，事非经过不知难。", "征服畏惧、建立自信的最快最确实的方法，就是去做你害怕的事，直到你获得成功的经验。", "勇气是控制恐惧心理，而不是心里毫无恐惧。", "自尊不是轻人，自信不是自满，独立不是孤立。——徐特立", "学而不思则惘，思而不学则殆。——孔子", "一个人是否有成就只有看他是否具有自尊心和自信心两个条件。——苏格拉底", "一日不读口生，一日不写手生。", "书山有路勤为径，学海无涯苦作舟。", "一个人缺少了自信，就容易对环境产生怀疑与戒备。", "一个做主角的非有天才不可。可是天才在于自信，在于自己的力量。——高尔基", "生活是一面镜子。你对它笑，它就对你笑；你对它哭，它也对你哭。", "宁愿做过了后悔，也不要错过了后悔。", "得之坦然，失之淡然，顺其自然，争其必然。", "命运掌握在自己手中。要么你驾驭生命，要么生命驾驭你，你的心态决定你是坐骑还是骑手。", "我只有一个忠告给你，做你自己的主人。——拿破仑", "自信是成功的第一秘诀。——爱默生", "有自信这是件好事，但过分绝对地自信则不成……过分地自信，则会有很大的失败在等待着。", "少而好学，如日出之阳；壮而好学，如日中之光；志而好学，如炳烛之光。——刘向", "只有不断找寻机会的人才会及时把握机会。", "想要使你自己够坚强与增加你的自信，最好的办法就是拿出胆量去做那些你认为没有把握的事。——罗兰", "一百个满怀信心和决心的人，要比一万个谨小慎微的和可敬的可尊重的人强得多。——辛克莱", "好好管教自己，不要管别人。", "运气就是机会碰巧撞到了你的努力。", "如果你能像看别人缺点一样，如此准确般的发现自己的缺点，那么你的生命将会不平凡。", "你硬要把单纯的事情看得很严重，那样子你会很痛苦。", "也许个性中，没有比坚定的决定更重要的成分。小男孩要成为伟大的人，或想日后在任何方面举足轻重，必须下定决心，不只要克服行里障碍，而且要在千百次的挫折和失败之后获胜。——提奥多·罗斯福", "一年只穿一双破鞋子、一件破衣服也是世界上最自信、最骄傲的人！千万不要因为物质贫困而自卑！精神贫困最可怕！——李阳", "读书给人以快乐、给人以光彩、给人以才干。——培根", "一个人除非自己有信心，否则不能带给别人信心；已经信服的人，方能使人信服。——麦修·阿诺德", "我们心中的恐惧，永远比真正的危险巨大的多。", "勇敢乃是自信与害怕中间之道。——亚里士多德", "环境不会改变，解决之道在于改变自己。", "一个懒惰的少年将来就是一褴褛的老人。", "为中华之崛起而读书。——周恩来", "读书要三到：心到、眼到、口到", "宝剑锋从磨砺出，梅花香自苦寒来。", "内心有一种在理性制约下的自信与镇定，这是因为他有着宽广的胸怀和高远的志向。——于丹", "中年是对青年的延伸，又是对青年的告别。这种告别不仅仅是一系列观念的变异，而是一个终于自立的成熟者对于能够随心所欲处置各种问题的自信。——余秋雨", "只有你学会把自己已有的成绩都归零，才能腾出空间去接纳更多的新东西，如此才能使自己不断的超越自己。", "深窥自己的心，而后发觉一切的奇迹在你自己。——培根", "命运负责洗牌，但是玩牌的是我们自己！", "人之所以痛苦，在于追求错误的东西。", "我扑在书上，就像饥饿的人扑在面包上。——高尔基", "凡事总要有信心，老想着“行”。要是做一件事，先就担心着怕自己不行，那你就没有勇气了。", "先相信自己，然后别人才会相信你。——罗曼·罗兰", "我们应该有恒心，尤其是要有自信心，必须相信自己是有能力的，而且要不惜任何代价把这种能力发挥出来。——博宾斯卡", "大部分人往往对已经失去的机遇捶胸顿足，却对眼前的机遇熟视无睹。", "只有满怀自信的人，才能在任何地方都怀有自信沉浸在生活中，并实现自己底意志。——高尔基", "黑发不知勤学早，白首方悔读书迟。——颜真卿", "忧伤回首看，优悉四处瞧，自信向上望。", "还能冲动，表示你还对生活有激情，总是冲动，表示你还不懂生活。", "读过一本好书，像交了一个益友。——藏克家", "地球上的任何一点离太阳都同样地遥远。——伯顿", "缺乏信心并不是因为出现了困难，而出现困难倒是因为缺乏信心。——塞内加", "一杯清水因滴入一滴污水而变污浊，一杯污水却不会因一滴清水的存在而变清澈。", "读一本好书，就如同和一个高尚的人在交谈。——歌德", "读书破万卷，下笔如有神。", "无论你觉得自己多么的了不起，也永远有人比你更强；无论你觉得自己多么的不幸，永远有人比你更加不幸。", "如果没有自信心的话，你永远也不会有快乐。——拉罗什夫科", "成功的条件在于勇气和自信，而勇气和自信乃是由健全的思想和健康的体魄而来。——科伦", "我们必须有恒心，尤其要有自信！我们必须相信我们的天赋是要用来做某种事情的，无论代价多么大，这种事情必须做到。——居里夫人", "有自信心的人，可以化渺小为伟大，化平庸为神奇。——萧伯纳", "与其说是别人让你痛苦，不如说自己的修养不够。", "活着一天，就是有福气，就该珍惜。当我哭泣我没有鞋子穿的时候，我发现有人却没有脚。", "恢弘志士之气，不宜妄自菲薄。——诸葛亮", "少壮不努力，老大徒悲伤。", "在实现理想的路途中，必须排除一切干扰，特别是要看清那些美丽的诱惑。", "行万里路，读万卷书。", "一日无书，百事荒废。——陈寿", "一个人敢于暴露自己的弱点，代表他自信、强大。——周正", "不要拿小人的错误来惩罚自己，不要在这些微不足道的事情上折磨浪费自己的宝贵时间。"];
	var days = Math.floor(Math.random()*120);
	$("#proverb").append(proverbs[days]);
	}

	});
