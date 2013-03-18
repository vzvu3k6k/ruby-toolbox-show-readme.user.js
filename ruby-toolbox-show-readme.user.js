// ==UserScript==
// @name           Ruby Toolbox: read README on site
// @description    Opens readme in Github repository
// @version        1.0
// @author         vzvu3k6k
// @include        https://www.ruby-toolbox.com/*
// @namespace      http://vzvu3k6k.tk/
// ==/UserScript==

(function(){
    var projects = document.querySelectorAll(".project");
    for(var i = 0, l = projects.length; i < l; i++){
        var project = projects[i];
        
        // get github repo url
        var github_repo = project.querySelector("github_repo a");
        if(github_repo){
            var github_url = github_repo.href;
        }else{
            var website = project.querySelector("a.website");
            if(website && /^https?:\/\/github.com\//.test(website)){
                github_url = website.href;
            }else{
                return;
            }
        }

        var link = document.createElement("a");
        link.href = github_url;
        link.setAttribute("class", "show-more-attributes show-readme icon icon-search");
        link.setAttribute("style", "margin: 0");
        link.setAttribute("data-ghurl", github_url);
        link.onclick = function(event){
            var url_elements = event.target.getAttribute("data-ghurl").split("/"),
                repo_name = url_elements.pop(),
                owner = url_elements.pop();
            jQuery.ajax("https://api.github.com/repos/" + owner + "/" + repo_name + "/readme",
                        {headers: {accept: "application/vnd.github.v3.html+json"}})
                .done(function(html){
                    jQuery(event.target).parent().after(jQuery(html))
                    jQuery(event.target).hide();
                });
        };
        project.querySelector(".description").appendChild(link);
        location.href = "javascript:void (" + function(){
            $(".show-readme").tipsy({fallback: "Click for README"});
        } + ")()";
    }
})();