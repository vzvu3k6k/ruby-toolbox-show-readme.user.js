// ==UserScript==
// @name           Ruby Toolbox: read README on site
// @description    Opens readme in Github repository
// @version        1.1
// @author         vzvu3k6k
// @include        https://www.ruby-toolbox.com/*
// @namespace      http://vzvu3k6k.tk/
// ==/UserScript==

// div.attribute-section.readme
//   div.attr-inner
//     h4
//       BUTTON
//     div.readme
//       README

(function(){
    GM_addStyle(".show-readme {margin: 0; float: right;}");
    GM_addStyle("h4 .show-readme:before {margin-left: 9px;}");
    GM_addStyle(".show-readme:before {font-size: 18px; color: #000;}");
    GM_addStyle(":not(.attribute-section).readme {height: 20em; overflow:scroll; margin-top: 1em; padding-right: 1ex;}");
    GM_addStyle(".readme .highlight {background: transparent;}");
    GM_addStyle(".readme pre {background: lightgray; margin: 0; padding: 1ex; border-radius: 5px;}");

    var projects = document.querySelectorAll(".project");
    for(var i = 0, l = projects.length; i < l; i++){
        var project = projects[i];
        
        // get github repo url
        var github_repo = project.querySelector(".github_repo a");
        if(github_repo){
            var github_url = github_repo.href;
        }else{
            var website = project.querySelector("a.website");
            if(website && /^https?:\/\/github.com\//.test(website)){
                github_url = website.href;
            }else{
                continue;
            }
        }

        var link = document.createElement("a");
        link.setAttribute("href", github_url);
        link.setAttribute("class", "show-readme icon icon-search"); // show-more-attributesを指定するとmouseover時に要素が消される
        link.setAttribute("data-ghurl", github_url);
        // link.textContent = "@";
        link.addEventListener("click", function(event){
            event.preventDefault();

            var url_elements = event.target.getAttribute("data-ghurl").split("/"),
                repo_name = url_elements.pop(),
                owner = url_elements.pop();
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.github.com/repos/" + owner + "/" + repo_name + "/readme",
                headers: {accept: "application/vnd.github.v3.html+json"},
                onload: function(result){
                    var target = event.target,
                        section = target.parentNode.parentNode,
                        readme_box = document.createElement("div");
                    target.setAttribute("style", "display:none");
                    readme_box.setAttribute("class", "readme");
                    readme_box.innerHTML = result.responseText;
                    section.insertBefore(readme_box, null);
                },
                onerror: function(result){
                    alert("request error");
                }
            });
        });

        project.querySelector(".attribute-section").insertAdjacentHTML("afterend",
          '<div class="attribute-section readme">' +
            '<div class="attr-inner">' +
              '<h4>README in Github</h4>' +
            '</div>' +
          '</div>');
        project.querySelector(".attribute-section.readme h4").appendChild(link);

        // add tooltip
        location.href = "javascript:void (" + function(){
            $(".show-readme").tipsy({fallback: "Click for README"});
        } + ")()";
    }
})();