// 搜索框
			function download(data){
				var oUl1 = document.getElementById('ul1');
				oUl1.style.display = 'block';
				oUl1.innerHTML = '';
				var arr = data.result;
				for(var i = 0;i < arr.length; i++){
					var oLi = document.createElement('li');
					var oA = document.createElement('a');
					oA.innerHTML = arr[i][0];
					oLi.appendChild(oA);
					oUl1.appendChild(oLi);
				}
			}
			window.onload = function(){
				var oQ = document.getElementById('q');
				var oUl1 = document.getElementById('ul1');
				oQ.onkeyup = function(){
					if(oQ.value){
						var oScript = document.createElement('script');
						oScript.src = 'https://suggest.taobao.com/sug?q=' + oQ.value + '&callback=download';
						document.body.appendChild(oScript);
					}else{
						oUl1.style.display = 'none';
					}
				}
			}






			// 购物车
					/*
			eval json格式的字符串转成字符串
			转换的字符串，必须最外层是数组，数组元素是对象
		 */


	$(function(){
		$("#clearBtn").click(function(){
			$.cookie("goods", null);
			$(".sc_right .sc_num").html(0);
			$(".sc_right ul").html("");
		})
		sc_car();

		$.ajax({
			url: "data.json",
			success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li class = 'goods_item'>
				<div class = "goods_pic">
					<img src="${arr[i].img}" alt="">	
				</div>
				<div class = 'goods_title'>
					${arr[i].title}<br/>
					<div id = "TEXT">${arr[i].span}</div>
				</div>
				<div class = 'sc'>
					<div id = "${arr[i].id}" class = 'sc_btn'>加入购物车</div>
				</div>
			</li>`).appendTo($('.goods_box ul'));
				}
				
			}
		})


		//事件委托
		$(".goods_box").on("click", ".sc_btn", function(){
			//进行抛物线运动
			ballMove(this);

			//获取到当前加入购物车按钮所在的商品id
			var id = this.id;
			//存储cookie的时候，对于当前商品只存储两个值，id num
			//json格式的字符串去存 goods  [{id:1, num:3},{id:7, num2}];
			//
			//1、判断是否第一次添加cookie
			var first = $.cookie("goods") == null ? true : false;
			if(first){
				$.cookie('goods', `[{id:${id},num:1}]`, {expires: 7});
			}else{
				//2、判断之前是否添加过该商品
				var str = $.cookie('goods');
				var arr = eval(str);
				var same = false; //假设没有相同的数据
				for(var i = 0; i < arr.length; i++){
					if(arr[i].id == id){
						//之前添加过
						arr[i].num++;
						var cookieStr = JSON.stringify(arr);
						$.cookie('goods', cookieStr, {expires: 7});
						same = true;
						break;
					}
				}

				if(!same){
					//之前没添加过
					var obj = {id: id, num: 1};
					arr.push(obj);
					var cookieStr = JSON.stringify(arr);
					$.cookie('goods', cookieStr, {expires: 7});
				}
			}
			sc_car();
		})


		//抛物线运动
		function ballMove(startNode){
			$("#ball").css({
				left: $(startNode).offset().left,
				top: $(startNode).offset().top,
				display: "block"
			})

			var offsetX = $(".sc_pic").offset().left - $("#ball").offset().left;
			var offsetY = $(".sc_pic").offset().top - $("#ball").offset().top;
			//配置参数
			var bool = new Parabola({
				el: "#ball",
				targetEl: null,
				offset: [offsetX, offsetY],
				curvature: 0.0005,
				duration: 400,
				callback:function(){
					$("#ball").css('display', 'none');
				}
			})

			bool.start();
		}

		/*
		JQ事件
			mouseenter 移入
			mouseleave 移出

		 */
		$(".sc_right").mouseenter(function(){
			$(this).stop().animate({
				right: 0
			})
			sc_msg();
		});

		$(".sc_right").mouseleave(function(){
			$(this).stop().animate({
				right: -270
			})
		});

		// 购物车数字
		function sc_car(){
			var str = $.cookie("goods");
			if(str){
				var arr = eval(str);
				var sum = 0;
				for(var i = 0; i < arr.length; i++){
					sum += arr[i].num;
				}
				$(".sc_num").html(sum);
			}
		}
		
		//显示购物车内商品
		function sc_msg(){
			$.ajax({
				url: 'data.json',
				success: function(arr){
					$(".sc_right ul").html("");
					//在所有商品信息里面找出，加入购物车的商品信息
					var cookie_arr = eval($.cookie('goods'));
					for(var i = 0; i < cookie_arr.length; i++){
						$(`<li>
				<div class = "sc_goodsPic">
					<img src="${arr[cookie_arr[i].id].img}" alt="">
				</div>
				<div class = "sc_goodsTitle">
					<p>这是商品曲奇饼干</p>
				</div>
				<div class = "sc_goodsBtn">购买</div>
				<div class = "sc_goodsNum">商品数量:${cookie_arr[i].num}</div>
			</li>`).appendTo($(".sc_right ul"));
					}
				}
			})
		}

	})

// 轮播图js
		$(function(){
				var aBtns = $("#div4-banner").find("ol").find("li");
				var oUl = $("#div4-banner").find("ul");
				var aLis = oUl.find("li");
				var iNow = 0 ;
				var timer = null;
				aBtns.click(function(){
					iNow = $(this).index();
					tab();
				})
				function tab(){
					aBtns.attr("class","");
					aBtns.eq(iNow).attr("class","active1");
					oUl.stop().animate({left:-952 * iNow},500,function(){
						if(iNow == aLis.size() - 1){
							iNow = 0;
							oUl.css("top",0);
						}
					})
				}
				function timerInner(){
					iNow++;
					document.title = iNow;
					tab();
					if(iNow == aLis.size() - 1){
						aBtns.eq(0).attr("class","active1");
					}
				}
				timer = setInterval(timerInner,2000);
				$("#div4-banner").hover(function(){
					clearInterval(timer);
				},function(){
					timer = setInterval(timerInner,2000);
				}
				);

			})

// 选项卡
			// $(function(){
			// 	$("#div8").find("button").mouseenter(function(){
			// 		$("#div8").find("button").attr("class","");
			// 		$("#div8").find("div").css("display",'none').eq($(this).index()).css("display",'block');
			// 		$(this).attr("class",'active');
			// 	})
			// })
// 主图侧边栏
// li1
		$(function(){
			$.ajax({
				url: "json/li1.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI1 .H1'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
// li2
       $(function(){
			$.ajax({
				url: "json/li2.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI2 .H2'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
       // li3
        $(function(){
			$.ajax({
				url: "json/li3.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI3 .H3'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})

// li4
		 $(function(){
			$.ajax({
				url: "json/li4.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI4 .H4'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})

// li5

		  $(function(){
			$.ajax({
				url: "json/li5.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI5 .H5'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})


// li6

		    $(function(){
			$.ajax({
				url: "json/li6.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI6 .H6'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})

// li7
		    $(function(){
			$.ajax({
				url: "json/li7.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI7 .H7'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})


// li8

		      $(function(){
			$.ajax({
				url: "json/li8.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI8 .H8'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
// li9

		          $(function(){
			$.ajax({
				url: "json/li9.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI9 .H9'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
// li10
  $(function(){
			$.ajax({
				url: "json/li10.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI10 .H10'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
// li11

   $(function(){
			$.ajax({
				url: "json/li11.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li>
				<div id = "D1">
					<img src="${arr[i].img}" alt=""id = "P1">
					<div id = "T1">${arr[i].title}</div><br/>
				</div>		
				
			</li>`).appendTo($('.div3 .box1 .u1 .LI11 .H11'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})
// 精品推荐
    $(function(){
			$.ajax({
				url: "json/tuijian.json",
				success: function(arr){
				for(var i = 0; i < arr.length; i++){
					$(`<li id = "TJ">
					<div id = "D2">
						<img src="${arr[i].img}" alt=""id = "P">
					</div>
					<div id = "T2">${arr[i].title}<br/>
						<span>${arr[i].span}</span>
					</div>
			</li>`).appendTo($('#div7-R'));
					}
				
			   }   
			   // ,error:function(msg){
			   // 	  alert(msg);
			   // }
			});
		})

    // tab1
				$(function(){
					$.ajax({
						url: "json/tab1.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L1 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})


		// tab2
		 	  $(function(){
					$.ajax({
						url: "json/tab2.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L2 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})

// TAB3

		 	   $(function(){
					$.ajax({
						url: "json/tab3.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L3 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})


// TAB4
		 	   $(function(){
					$.ajax({
						url: "json/tab4.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L4 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})

// TAB5
		 	   	 $(function(){
					$.ajax({
						url: "json/tab5.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L5 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})




// TAB6
		 	   	$(function(){
					$.ajax({
						url: "json/tab6.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L6 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})


// TAB7

		 	  $(function(){
					$.ajax({
						url: "json/tab7.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L7 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})
// TAB8
		 	  $(function(){
					$.ajax({
						url: "json/tab8.json",
						success: function(arr){
						for(var i = 0; i < arr.length; i++){
							$(`<l id = "TJ3">
							<div id = "D3">
								<img src="${arr[i].img}" alt=""id = "P3">
							</div>
							<div id = "T9">${arr[i].title}
								<h3>${arr[i].span}</h3>
							</div>
					</l>`).appendTo($('#L8 #box3'));
							}
						
					   }   
					   // ,error:function(msg){
					   // 	  alert(msg);
					   // }
					});
				})