const text =
"ไม่รู้ว่าอนาคตจะเป็นยังไง🫪\n แต่ถ้าในอนาคตมีเธออยู่ด้วย เค้าคงจะมีความสุขที่สุดเลยยยย";

let i = 0;

function typing(){

if(i < text.length){

document.getElementById("typing").innerHTML += text.charAt(i);

i++;

setTimeout(typing,60);

}

}

typing();

const no = document.getElementById("no");

no.addEventListener("mouseover",()=>{

let x=Math.random()*(window.innerWidth-120);

let y=Math.random()*(window.innerHeight-80);

no.style.left=x+"px";

no.style.top=y+"px";

});

document.getElementById("yes").onclick=function(){

document.getElementById("popup").style.display="block";

confetti();

}

function confetti(){

for(let i=0;i<120;i++){

let heart=document.createElement("div");

heart.className="heart";

heart.innerHTML="💖";

heart.style.left=Math.random()*100+"vw";

heart.style.animationDuration=3+Math.random()*4+"s";

heart.style.fontSize=(20+Math.random()*35)+"px";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},7000);

}

}