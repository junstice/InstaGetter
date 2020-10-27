// for debug
// document.getElementById("targetUrl").value = "abcde";
document.getElementById("targetUrl").value = "https://www.instagram.com/p/CGiueXRMR1M/?utm_source=ig_web_copy_link";

/* GET! 버튼 클릭 */
const btnGet = document.getElementById("btnGet");
btnGet.addEventListener("click", () => {
    
    let targetUrl = document.getElementById("targetUrl").value;
	let xhr = new XMLHttpRequest();

    xhr.open("GET", targetUrl, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			
            // console.log(this.responseText);
            
            let domparser = new DOMParser();
			let xmlDoc = domparser.parseFromString(xhr.responseText, "text/html");
			let srcElements = xmlDoc.getElementsByTagName("script");
            let imgUrl = "";
            
            for (let i = 0; i < srcElements.length; i++) {
                // console.log(srcElements[i]);
                let script = (srcElements[i].innerText);
                if (script.indexOf("window._sharedData = ") !== -1) {
                    console.log("찾았다!");
                    console.log(script.replace("window._sharedData = ", ""));
                    
                    break;
                }                
            }
            
            // 여러장 이미지와 한 장 이미지는 스크립트가 달라 분기 처리 필요
            
            let elmImg = document.createElement("img")
            document.getElementById("card-img-res").appendChild(elmImg);
            elmImg.src = imgUrl;
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
