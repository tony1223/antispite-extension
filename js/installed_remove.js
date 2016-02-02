/*
just hide install btn
*/
installbtn = document.querySelector(".install_extension");
console.log(installbtn);
for(var key in installbtn)
{
  target = installbtn[key];
  installbtn.style.display ="none";
}