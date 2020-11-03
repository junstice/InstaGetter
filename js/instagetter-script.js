// [for debug]
document.getElementById("targetUrl").value = "https://www.instagram.com/p/CG9ScwUl8sx/?utm_source=ig_web_copy_link";

/* GET! 버튼 클릭 */
const btnGet = document.getElementById("btnGet");
btnGet.addEventListener("click", () => {
    
    let targetUrl = document.getElementById("targetUrl").value;
    let xhr = new XMLHttpRequest();
    let targetScript = "";

    xhr.open("GET", targetUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			
            let imgUrl = "";

            // DOMParser
            let domparser = new DOMParser();
            
            // html parsing
            let xmlDoc = domparser.parseFromString(xhr.responseText, "text/html");
            
            // <script> 태그를 선택
            let srcElements = xmlDoc.getElementsByTagName("script");
            
            // <script> 태그 수만큼 loop
            for (let i = 0; i < srcElements.length; i++) {
                
                // <script> 태그 내에 쓰여진 스크립트 텍스트 취득
                let script = (srcElements[i].innerText);
                
                // 이미지, 동영상 정보가 있는 스크립트를 판정하여 변수에 저장
                if (script.indexOf("window._sharedData = ") !== -1) {
                    targetScript = script.replace("window._sharedData = ", "").replace(";", "");
                    break;
                }
            }

            console.log(targetScript);

            // 이미지 한 장만 있을 때
            // const targetObj = JSON.parse(targetScript).entry_data.PostPage[0].graphql.shortcode_media.display_resources;
            // imgUrl = targetObj[targetObj.length - 1].src;
            
            // 이미지 한 장 append
            // let elmImg = document.createElement("img");
            // document.getElementById("card-img-res").appendChild(elmImg);
            // elmImg.className = "card-img-top";
            // elmImg.src = imgUrl;

            // 이미지와 영상 등 여럿 있을 때
            const targetObj = JSON.parse(targetScript).entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges;
            console.log(targetObj);
            console.log(targetObj[0].node.__typename); // 영상: "GraphVideo", 사진: "GraphImage"
            console.log(targetObj[0].node.video_url); // 영상: "video_url", 사진: "display_url"
            imgUrl = targetObj[0].node.video_url;

            // 영상 append
            let elmVideo = document.createElement("video");
            document.getElementById("card-img-res").appendChild(elmVideo);
            elmVideo.src = imgUrl;
            elmVideo.className = "card-img-top";
            elmVideo.controls = "controls";
            elmVideo.type = "video/mp4";
		}
	}
	xhr.send();
}, false);

/* ? 버튼 클릭 */
const btnInfo = document.getElementById("btnInfo");
btnInfo.addEventListener("click", () => {
    openNav();
}, false);

/* Instagetter 정보 영역 열기 */
function openNav() {
    document.getElementById("infoNav").style.width = "50%";
}

/* Instagetter 정보 영역 닫기 */
function closeNav() {
    document.getElementById("infoNav").style.width = "0%";
}
