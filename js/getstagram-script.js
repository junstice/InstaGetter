
/* GET! 버튼 클릭 */
const btnGet = document.getElementById("btnGet");
btnGet.addEventListener("click", () => {

    // clear child of result <div>
    document.getElementById("card-img-res").textContent = "";
    
    // 입력된 url
    const targetUrl = document.getElementById("targetUrl").value;
    
    // url check
    if (!validateTargetUrl(targetUrl)) return;
    
    // open GET request to targetUrl
    let xhr = new XMLHttpRequest();
    xhr.open("GET", targetUrl, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            
            // response로 받아와 script를 저장할 변수
            let targetScript = "";
        
            // 출력할 영상/사진의 url
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
                    targetScript = script.replace("window._sharedData = ", "").slice(0, -1);
                    break;
                }
            }

            // console.log(targetScript);

            // 다음 위치에 정의된 오브젝트를 이용하여 다운로드 미디어를 탐색 함
            const condObj = JSON.parse(targetScript).entry_data.PostPage[0].graphql.shortcode_media;
            
            // 업로드 된 미디어가 여럿인지 아닌지 "edge_sidecar_to_children"를 이용하여 판단
            if (condObj.edge_sidecar_to_children) {
                
                // 키 값 "edge_sidecar_to_children"이 있을 경우: 하나 이상의 사진과 영상이 있음
                const targetObj = condObj.edge_sidecar_to_children.edges;

                // 업로드 된 미디어 갯수만큼 loop
                for (let i = 0; i < targetObj.length; i++) {
                    
                    // 영상
                    if (targetObj[i].node.__typename === "GraphVideo") {
                        
                        // video_url 값으로 url 설정
                        imgUrl = targetObj[i].node.video_url;

                        // video DOM 추가
                        let elmVideo = document.createElement("video");
                        elmVideo.src = imgUrl;
                        elmVideo.className = "card-img-top";
                        elmVideo.controls = "controls";
                        elmVideo.type = "video/mp4";
                        
                        // video DOM append
                        document.getElementById("card-img-res").appendChild(elmVideo);
                    }
                    // 사진
                    else if (targetObj[i].node.__typename === "GraphImage") {

                        // display_url 값으로 url 설정
                        imgUrl = targetObj[i].node.display_url;
                        
                        // img DOM 추가
                        let elmImg = document.createElement("img");
                        elmImg.className = "card-img-top";
                        elmImg.src = imgUrl;
                        
                        // video DOM append
                        document.getElementById("card-img-res").appendChild(elmImg);
                    }

                    // 구분선 그리기
                    document.getElementById("card-img-res").appendChild(document.createElement("hr"));
                }
            }

            else {
                
                // 키 값 "edge_sidecar_to_children"이 없을 경우: 하나의 사진 혹은 영상이 있음
                // 영상
                if (condObj.__typename === "GraphVideo") {
                    // video_url 값으로 url 설정
                    imgUrl = condObj.video_url;

                    // video DOM 추가
                    let elmVideo = document.createElement("video");
                    document.getElementById("card-img-res").appendChild(elmVideo);
                    elmVideo.src = imgUrl;
                    elmVideo.className = "card-img-top";
                    elmVideo.controls = "controls";
                    elmVideo.type = "video/mp4";
                } 
                // 사진
                else if (condObj.__typename === "GraphImage") {
                    // video_url 값으로 url 설정
                    imgUrl = condObj.display_url;

                    // img DOM 추가
                    let elmImg = document.createElement("img");
                    document.getElementById("card-img-res").appendChild(elmImg);
                    elmImg.className = "card-img-top";
                    elmImg.src = imgUrl;
                }
            }
		}
	}
    
    // send GET request to targetUrl
    xhr.send();
}, false);

/* ? 버튼 클릭 */
const btnInfo = document.getElementById("btnInfo");
btnInfo.addEventListener("click", () => {
    openNav();
}, false);

/* Getstagram 정보 영역 열기 */
function openNav() {
    document.getElementById("infoNav").style.width = "50%";
}

/* Getstagram 정보 영역 닫기 */
function closeNav() {
    document.getElementById("infoNav").style.width = "0%";
}

/* 인스타그램 게시물 링크를 복사한 url 검증 */
function validateTargetUrl(url) {
    let result = false;

    if (!url) {
        alert("인스타그램 게시물의 링크를 복사하여 URL을 입력해주세요!");
    
    } else if (!url.startsWith("https://www.instagram.com/p/")) {
        alert("정보를 가져올 수 없는 URL 형식입니다.");
    
    } else {
        result = true;
    }
    
    return result;
}