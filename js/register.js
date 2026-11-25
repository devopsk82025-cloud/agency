const registerForm=document.getElementById("registerForm");
const registerMessage=document.getElementById("message");
function showRegisterMessage(text,success=false){registerMessage.textContent=text;registerMessage.classList.toggle("success",success)}
registerForm.addEventListener("submit",async(event)=>{
  event.preventDefault(); const button=registerForm.querySelector("button[type=submit]");button.disabled=true;showRegisterMessage("Creating your account…");
  try{
    const {data,error}=await supabaseClient.auth.signUp({
      email:document.getElementById("email").value.trim(),
      password:document.getElementById("password").value,
      options:{data:{full_name:document.getElementById("fullName").value.trim(),role:document.getElementById("role").value}}
    });
    if(error) throw error;
    if(data.session){showRegisterMessage("Account created. Redirecting to sign in…",true);setTimeout(()=>location.replace("login.html"),1200);}
    else showRegisterMessage("Registration received. Check your email to confirm your account, then sign in.",true);
  }catch(error){showRegisterMessage(error.message||"Registration failed.");button.disabled=false;}
});
