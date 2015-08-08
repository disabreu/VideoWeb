(function (a1, $, undefined) { //namespace - very important

a1.videos = [];
a1.watchedVideos = [];
a1.fixedListOfVideos = [];

//1. An entry point funtion for implementation of our engine
a1.start = function(hookElementSelection, dataurlForJsonFile) {
	  //make an ajax call and wait for success to parse the json data.
	  $.ajax({url:dataurlForJsonFile}).success(function(clips) {
   
        createDisp(hookElementSelection);

		$.each(clips, function(i,val) {
			var video = new a1.Video(val.id, val.name, val.description,val['content-url'],val['thumb-url']);
			a1.videos.push(video);
	    });

	    if(!localStorage.s2){
	    	a1.fixedListOfVideos = a1.videos;
	    }else{
	    	a1.fixedListOfVideos = JSON.parse(localStorage.getItem("s2"));
	    	localStorage.removeItem("s2");
	    }

	    var middleArray = [];
        var vid = [];

     	if(localStorage.s1){
	       a1.watchedVideos = JSON.parse(localStorage.getItem("s1"));
	       localStorage.removeItem("s1");
   
	    $.each(a1.watchedVideos, function(index,value) {
            var vidW = value.id;
            vid.push(vidW);
        });

	    $.each(a1.fixedListOfVideos, function(i,val) {
	     if(vid.indexOf(val.id) == -1){
	         middleArray.push(val);
	     }

	    });

     	$.each(a1.watchedVideos, function(i,val) {
	        middleArray.push(val);
	    });

	    a1.fixedListOfVideos = middleArray;

	    }

	    localStorage.setItem("s2",JSON.stringify(a1.fixedListOfVideos));
        thumbList(a1.fixedListOfVideos, hookElementSelection);

      });  
};

	a1.Video = function(id, name, description, content, thumb) {

			this.id = id;
			this.name = name;
			this.description= description;
			this.content = content;
			this.thumb=thumb;		

			this.render = function(base) {

				var nameHTML = $("<p class='name'>" + this.name + "</p>"); 
				var finalHTML = $("<div class='video'></div>");
				finalHTML.append(nameHTML);
				base.append(finalHTML);

			};

    };

 
    var finalHTML = $("<div class='thumbList'></div>");
    var thumbPressed = '';
    var divvid = "<div class ='middle'></div>";

	var thumbList = function(videos,base,divvid){

		var base = base;
		$.each(videos, function(i,val) {

		var videoHTML = $("<img class= 'thumbnail' id='"+val.id+"' src='"+val.thumb+"' width='250' height='160'><"); 	
		finalHTML.append(videoHTML);
		base.append(finalHTML);

        document.getElementById(val.id).addEventListener("click", function(){
          videoDisplay(val.id, base,divvid);
        });

	  });

	};

    var createDisp = function(base){
        base.prepend(divvid);
    }

	var videoDisplay = function(thumbPressed,base){
		$.each(a1.videos, function(i,val){
			fullscreen =false;
			if(val.id == thumbPressed){
		    	var titleHTML = $("<h1 class='vidtitle' style = 'font-family: Courier;'>" + val.name + "</h1>"); 
				var videoDHTML = $("<div class='display'><video id='vidID' src='"+val.content+"' type= 'video/mp4' width='520' height='292' ></video><br><button class = 'button' id='play'>Play/Pause</button><button class = 'button' id ='stop'>Stop</button><progress id='progress-bar' min='0' max='100' value='0'>0% played</progress><button class='button' id='fullscreen'>FullScreen</button></div>");
				titleHTML.append(videoDHTML);
				$( "div.middle" ).html(titleHTML).append("<div class= 'description' style='left:-1000px; position: relative;' >"+val.description+"</div>");
                    
                    var videoWatched = new a1.Video(val.id, val.name, val.description,val.content,val.thumb);

                    var vid = [];

			        $.each(a1.watchedVideos, function(index,value) {
			            var vidW = value.id;
			            vid.push(vidW);
			        });

                    if(vid.indexOf(val.id) == -1){
	                    a1.watchedVideos.push(videoWatched);             	
                    }

	                localStorage.setItem("s1",JSON.stringify(a1.watchedVideos));

				    var buttonFullScreen = $("#fullscreen").on("click",function(event){ 
					   fullscreenmode();
				    });

				    document.getElementById('stop').addEventListener("click", function(){
				    	//$('#vidID').stop();

				    document.getElementById('vidID').pause();
				    document.getElementById('vidID').currentTime = 0;
				    //$('#vidID')[0].currentTime =0;
				    var progressBar = $('#progress-bar');
				    progressBar.attr("value",0);

                  });

	                document.getElementById('play').addEventListener("click", function(){

	              if (document.getElementById('vidID').paused) {
				      document.getElementById('vidID').play();
				  
				  } else {
				     document.getElementById('vidID').pause();
				  }

                  });

	             $('#vidID')[0].ontimeupdate = function(){

	 	         var progressBar = $('#progress-bar');
	             var percentage = Math.floor((100 / $('#vidID')[0].duration) * $('#vidID')[0].currentTime);

	             progressBar.attr("value",percentage);
	             progressBar.innerHTML = percentage + '% played';

	             if (percentage == 25){

	             	$(".description").animate({"left": "7px"}, 2000);
	             	$(".description").animate({"opacity": "0.0"}, 6000);
	             	$(".description").animate({"left": "-1000px"}, 2000);
	             	$(".description").animate({"opacity": "1.0"}, 1000);

	             }


                }

                document.getElementById('vidID').addEventListener('timeupdate', updateProgressBar, false);

                function updateProgressBar() {

				    var progressBar = document.getElementById('progress-bar');
				    var percentage = Math.floor((100 / document.getElementById('vidID').duration) *
					document.getElementById('vidID').currentTime);
					progressBar.value = percentage;
					progressBar.innerHTML = percentage + '% played';

				}

				function fullscreenmode(){

            	if (fullscreen==true){

            		fullscreen=false;
            		$('.display').removeClass("dispFull");
            		$('#vidID').removeClass("vidFull"); //añade video
         			$('.descripcion').removeClass("descFull"); //descripcion full 
            		$('.thumbnail').show();
            		$('.title').show();


            	}else{

					fullscreen=true;

            		$('.display').addClass("dispFull");
            		$('#vidID').addClass("vidFull"); //añade video
         			$('.descripcion').addClass("descFull"); //descripcion full
            		$('.thumbnail').hide();
            		$('.title').hide();
            		

            	}
            }
			}
		});
	}

})(window.a1 = window.a1 || {}, jQuery) //namespace protects the jQuery $ and the 'undefined' value

//FINAL NOTES:

//To be truly enterprise grade this code would need additional error handling

//we will cover hardening strategies at a later stage